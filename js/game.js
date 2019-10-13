// base scene
// anything common across the entire game goes here
class Base extends Phaser.Scene {
  constructor(config) {
    super(config)
  }

  preload() {
    this.load.spritesheet('next', 'assets/nextButton.png', { frameWidth: 193, frameHeight: 92 })
    this.load.image('congratzMessage', 'assets/congratsTEXT.png')
    this.load.image('congratz', 'assets/congratsBack.png')
    this.load.image('menu1', 'assets/menuBackground.png');
    this.load.spritesheet('about', 'assets/about.png', { frameWidth: 193, frameHeight: 92 })
    this.load.spritesheet('help', 'assets/howtobuttons.png', { frameWidth: 251, frameHeight: 92 })
    this.load.spritesheet('play', 'assets/play2.png', { frameWidth: 193, frameHeight: 92 })
    this.load.image('title', 'assets/GeNOME.png')
    this.load.image('arrow', 'assets/arrow.png');
    this.load.image('protein1', 'assets/protein1.png');
    this.load.image('protein2', 'assets/protein2.png');
    this.load.image('protein3', 'assets/protein3.png');
    this.load.image('protein4', 'assets/protein4.png');
    this.load.image('gnome', 'assets/gnome.png');
    this.load.image('bg', 'assets/bg.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('aboutPanel', 'assets/woodPanel3.png');
    this.load.spritesheet('back', 'assets/backButton.png', { frameWidth: 186, frameHeight: 203 });
    this.load.image('dna', 'assets/dna.png');
    this.load.image('sick', 'assets/sick.png');

    this.load.image('level1Title', 'assets/Level-15.png')
    this.load.image('level2Title', 'assets/Level-25.png')
    this.load.image('level3Title', 'assets/Level-35.png')
    this.load.image('level4Title', 'assets/Level-45.png')
    this.load.image('level5Title', 'assets/Level-55.png')
    this.load.image('continue', 'assets/clicktocontinue.png')
  }

  create() {
  }

  update() {
  }
}

// level scene
class Level extends Base {

  constructor(config, scene, n, text) {
    super(config)
    this.next_scene = scene;
    this.text = text;
    this.n = n;
  }

  preload() {
    super.preload()
  }

  create() {
    super.create()
    this.add.image(400, 300, 'bg');
    this.back = this.add.sprite(700, 600, 'back')
      .setFrame(0)
      .setInteractive()
      .on('pointerover', () => {
        this.back.setFrame(1);
      }, this)
      .on('pointerout', () => {
        this.back.setFrame(0);
      }, this).on('pointerdown', () => {
        this.scene.start('menu');
      }, this);
    this.add.text(550, 50, 'Cure cancer! Sort genes!', {
      fill: "#000000",
    });
    this.add.image(550 + 100, 60 + 50, 'dna');
    this.add.text(550, 150, 'Mutation-caused Disease: ' + this.text['disease'], {
      fill: "#000000",
      wordWrap: {
        width: 800 - 550,
        useAdvancedWrap: true,
      },
    });
    this.add.image(550 + 110, 160 + 110, 'sick');
    this.add.text(550, 350, 'Description: ' + this.text['description'], {
      fill: "#000000",
      wordWrap: {
        width: 800 - 550,
        useAdvancedWrap: true,
      },
    });
    this.add.image(46 / 2, 565 / 2 + 10, 'arrow');
    this.player = this.physics.add.image(400, 300, 'gnome');
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wall = this.physics.add.staticImage(438 * 3 / 2, 300, 'wall');

    this.genes = [];

    {
      let x0 = 120;
      let y0 = 140 - ((this.n - 5) * 20);
      let dy = 60;
      let y = y0;
      for (let i = 0; i < this.n; ++i) {
        this.genes.push(this.physics.add.staticImage(x0, y, 'protein' + (i % 4 + 1)));
        y += dy;
      }
    }

    function make_array(length) {
      // return [2, 1, 3, 4, 5, 6, 7, 8, 9, 10];
      // https://stackoverflow.com/a/5836921/4400820
      function shuffle(a) {
        let tmp, current, top = a.length;
        if (top) while (--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = a[current];
          a[current] = a[top];
          a[top] = tmp;
        }
        return a;
      }
      let array = []
      for (let i = 0; i < length; ++i) {
        array[i] = i
      }
      return shuffle(array);
    }

    this.values = make_array(this.n);
    this._gene_vals = [];

    for (let i = 0; i < this.genes.length; ++i) {
      let gene = this.genes[i];
      gene.name = "gene" + i;
      gene.setData('number', this.values[i]);
      let text = this.add.text(0, 0, "" + gene.getData('number'), {
        fill: "#000000",
      })
      gene.setData('text', text);
    }

    this.physics.add.collider(this.player, this.genes, this.swap, null, this);
    this.physics.add.collider(this.player, this.wall);
  }

  update() {
    super.update()
    this.player_move()
    this._gene_vals = [];
    for (let i = 0; i < this.genes.length; ++i) {
      let gene = this.genes[i];
      let text = gene.getData('text');
      text.x = Math.floor(gene.x + gene.width / 2);
      text.y = Math.floor(gene.y - 20);
      this._gene_vals.push(gene.getData('number'));
    }
    if (this.check_sorted()) {
      // do something useful
      // console.log('sorted');
      this.scene.start(this.next_scene);
    }
  }

  player_move() {
    let moving = false;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      moving = true;
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      moving = true;
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
      moving = true;
    }
    else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
      moving = true;
    }

    if (!moving) {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
    }
  }

  // swap one down
  swap(player, gene) {
    // stop further hits, no matter what
    player.x += 20;

    let swap_i = null;
    for (let i = 1; i < this.genes.length; ++i) {
      let g = this.genes[i];
      if (g.name === gene.name) {
        swap_i = i - 1;
        break;
      }
    }

    if (swap_i === null) return;

    {
      let temp = gene.getData('text');
      gene.setData('text', this.genes[swap_i].getData('text'));
      this.genes[swap_i].setData('text', temp);
    }
    {
      let temp = gene.getData('number');
      gene.setData('number', this.genes[swap_i].getData('number'));
      this.genes[swap_i].setData('number', temp);
    }

  }

  check_sorted() {
    // check if the genes sorted
    for (let i = 0; i < this._gene_vals.length - 1; ++i) {
      if (this._gene_vals[i] > this._gene_vals[i + 1])
        return false;
    }
    return true;
  }

}



//Main Menu Scene
class MainMenu extends Base {

  constructor(config) {
    super(config)
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    this.add.image(400, 300, 'menu1');
    this.add.image(400, 150, 'title');

    // implementation for "Play" button
    this.startButton = this.add.sprite(400, 310, 'play').setFrame(0).setInteractive();
    this.startButton.on('pointerover', () => {
      this.startButton.setFrame(1);
    }, this);
    this.startButton.on('pointerout', () => { this.startButton.setFrame(0) }, this);
    this.startButton.on('pointerdown', () => { this.scene.start('t1') });

    // implementation for "How to Play" Button
    this.helpButton = this.add.sprite(400, 405, 'help').setFrame(0).setInteractive();
    this.helpButton.on('pointerover', () => {
      this.helpButton.setFrame(1);
    }, this);
    this.helpButton.on('pointerout', () => { this.helpButton.setFrame(0) }, this);
    this.helpButton.on('pointerdown', () => { window.open('help.html') });

    // Implementation for the "About" Button
    this.aboutButton = this.add.sprite(400, 500, 'about').setFrame(0).setInteractive();
    this.aboutButton.on('pointerover', () => {
      this.aboutButton.setFrame(1);
    }, this);
    this.aboutButton.on('pointerout', () => { this.aboutButton.setFrame(0) }, this);
    this.aboutButton.on('pointerdown', () => { this.scene.start('aboutscr') });
  }

  update() {
    super.update();
  }


}

class AboutScreen extends Base {

  constructor(config, menu) {
    super(config);
    this._menu = menu;
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    this.add.image(400, 300, 'menu1');
    this.add.image(400, 250, 'aboutPanel')
    this.aboutButton = this.add.sprite(400, 50, 'about').setFrame(0).setInteractive();

    this.backButton = this.add.sprite(93, 500, 'back').setFrame(0).setInteractive()
    this.backButton.on('pointerover', () => {
      this.backButton.setFrame(1);
    }, this);
    this.backButton.on('pointerout', () => { this.backButton.setFrame(0) }, this);
    this.backButton.on('pointerdown', () => { this.scene.start('menu') });

    this.add.text(125, 135, "Lost in the human body, all \t our heroic gnome can do is sort... sort genomes, that is!", {
      fill: "#000000",
      wordWrap: {
        width: 710 - 125,
        useAdvancedWrap: true,
      },
    });

    this.add.text(125, 200, "Designed for education about genetic disorders and gnome sort, this cleverly-titled game combines the hilarity of gnome sort with the seriousness of cancer.", {
      fill: "#000000",
      wordWrap: {
        width: 710 - 125,
        useAdvancedWrap: true,
      },
    });

    this.add.text(125, 280, "Genetic mutations are diseases caused by changes in the genetic sequence. In this game we treat the mutation by untangling the altered genetic sequences.", {
      fill: "#000000",
      wordWrap: {
        width: 710 - 125,
        useAdvancedWrap: true,
      },
    });

  }

  update() {
    super.update()
  }

}


class CongratzScreen extends Base {

  constructor(config, scene) {
    super(config);
    this.next = scene;
  }

  preload() {
    super.preload()
  }

  create() {
    super.create()
    this.add.image(400, 300, 'congratz');
    this.add.image(400, 150, 'congratzMessage')

    this.nextButton = this.add.sprite(400, 500, 'next').setFrame(0).setInteractive();
    this.nextButton.on('pointerover', () => {
      this.nextButton.setFrame(1)
    }, this);
    this.nextButton.on('pointerout', () => { this.nextButton.setFrame(0) }, this);
    this.nextButton.on('pointerdown', () => {
      this.scene.start(this.next)
    }, this);
  }

  update() {
    super.update()
  }

}

class LevelTitleScreen extends Base {

  constructor(config, scene, levelIndicator) {
    super(config);
    this.next = scene;
    this.levelIndic = levelIndicator
  }

  preload() {
    super.preload()
  }

  create() {
    super.create()
    if (this.levelIndic === 1) {
      this.add.image(400, 200, 'level1Title')
    } else if (this.levelIndic === 2) {
      this.add.image(400, 200, 'level2Title')
    } else if (this.levelIndic === 3) {
      this.add.image(400, 200, 'level3Title')
    } else if (this.levelIndic === 4) {
      this.add.image(400, 200, 'level4Title')
    } else {
      this.add.image(400, 200, 'level5Title')
    }

    this.continueNext = this.add.image(400, 475, 'continue').setInteractive()
    this.input.on('pointerdown', () => {this.scene.start(this.next)})

  }

  update() {
    super.update()
  }

}

// declare scenes
let menu = new MainMenu('menu')
let about = new AboutScreen('aboutscr', 'menu');
let congrat1 = new CongratzScreen('c1', 't2');
let congrat2 = new CongratzScreen('c2', 't3');
let congrat3 = new CongratzScreen('c3', 't4');
let congrat4 = new CongratzScreen('c4', 't5');
let congrat5 = new CongratzScreen('c5', 'menu');
let title1 = new LevelTitleScreen('t1', 'l1', 1);
let title2 = new LevelTitleScreen('t2', 'l2', 2);
let title3 = new LevelTitleScreen('t3', 'l3', 3);
let title4 = new LevelTitleScreen('t4', 'l4', 4);
let title5 = new LevelTitleScreen('t5', 'l5', 5);

let level5 = new Level(
  'l5',
  'c5',
  9,
  {
    disease: 'Follicular lymphoma (FL)',
    description: 'Cancer in lymphocyte B-cells, specifically centrocytes and centroblasts. About 15,000 new patients get diagnosed every year'
  },
);
let level4 = new Level(
  'l4',
  'c4',
  8,
  {
    disease: 'Mantle cell lymphoma (MCL)',
    description: 'A type of B-cell lymphoma accounting for only about 15,000 patients present in U.S.'
  },
);
let level3 = new Level(
  'l3',
  'c3',
  7,
  {
    disease: "Burkitt's lymphoma",
    description: 'Cancer in the B lymphocytes, commonly diagnosed in low-income countries and in young kids. The overall cure rate is about 90%.'
  },
);
let level2 = new Level(
  'l2',
  'c2',
  6,
  {
    disease: 'Chronic myelogenous leukemia (CML)',
    description: 'Cancer in white blood cells characterized by increased growth of myeloid cells in blood marrow'
  },
);
let level1 = new Level(
  'l1',
  'c1',
  5,
  {
    disease: 'Infertility',
    description: 'Gametes with unbalanced chromosome translocations'
  },
)

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
    },
  },
  scene: [
    menu, // start
    level1,
    level2,
    level3,
    level4,
    level5,
    congrat1,
    congrat2,
    congrat3,
    congrat4,
    congrat5,
    title1,
    title2,
    title3,
    title4,
    title5,
    about,
  ],
};

// start game
let game = new Phaser.Game(config);

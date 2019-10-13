var style = {
  // font: "32px Arial"
  // fill: "#ff0044"
  // wordWrap: true
  // wordWrapWidth: sprite.width
  // align: "center"
  // backgroundColor: "#ffff00"
}

// base scene
// anything common across the entire game goes here
class Base extends Phaser.Scene {
  constructor() {
    super()
  }

  preload() {
  }

  create() {
  }

  update() {
  }
}

// level scene
class Level extends Base {

  constructor() {
    super()
  }

  preload() {
    super.preload()
    this.load.image('bg', 'assets/bg.png');
    this.load.image('gnome', 'assets/gnome.png');
    this.load.image('gene', 'assets/gene.png');
    this.load.image('arrow', 'assets/arrow.png');
  }

  create() {
    super.preload()
    this.add.image(400, 300, 'bg');
    this.player = this.physics.add.image(400, 300, 'gnome');
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.staticImage(100/2, 550/2, 'arrow');

    this.genes = [];

    {
      let x0 = 180;
      let y0 = 30;
      let dy = 60;
      let y = y0;
      for (let i = 0; i < 10; ++i) {
        this.genes.push(this.physics.add.staticImage(x0, y, 'gene'));
        y += dy;
      }
    }

    function make_array(length) {
      // https://stackoverflow.com/a/5836921/4400820
      function shuffle(a) {
        let tmp, current, top = a.length;
        if(top) while(--top) {
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

    this.values = make_array(10);
    this._gene_vals = [];

    for (let i = 0 ; i < this.genes.length; ++i) {
      let gene = this.genes[i];
      gene.name = "gene" + i;
      gene.setData('number', this.values[i]);
      let text = this.add.text(0, 0, ""+gene.getData('number'), style)
      gene.setData('text', text);
    }

    this.physics.add.collider(this.player, this.genes, this.swap, null, this);
  }

  update() {
    super.preload()
    this.player_move()
    this._gene_vals = [];
    for (let i = 0 ; i < this.genes.length; ++i) {
      let gene = this.genes[i];
      let text = gene.getData('text');
      text.x = Math.floor(gene.x + gene.width / 2);
      text.y = Math.floor(gene.y - 20);
      this._gene_vals.push(gene.getData('number'));
    }
    if (this.check_sorted()) {
      // do something useful
      console.log('sorted');
    }
  }

  player_move() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    }
    else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    }
    else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    }
    else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
    }
  }

  // swap one down
  swap(player, gene) {
    // stop further hits, no matter what
    player.x += 20;

    let swap_i = null;
    for (let i = 1 ; i < this.genes.length; ++i) {
      let g = this.genes[i];
      if (g.name === gene.name) {
        swap_i = i-1;
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
    for (let i = 0; i < this._gene_vals.length-1; ++i) {
      if (this._gene_vals[i] > this._gene_vals[i+1])
        return false;
    }
    return true;
  }

}

//Main Menu Scene
class mainMenu extends Phaser.Scene {

  constructor() {
    super()
  } 

  preload() {
    this.load.image('menu', 'assets/menuBackground.png')
    this.load.image('title', 'assets/GeNOME.png')
    this.load.spritesheet('play', 'assets/play2.png',{ frameWidth: 193, frameHeight: 92 })
  }

  create() {
    this.add.image(400, 300, 'menu');
    this.add.image(400, 150, 'title');

    this.startButton = this.add.sprite(400, 310, 'play').setFrame(0).setInteractive();
    this.startButton.on('pointerover', () => {
      this.startButton.setFrame(1);
      console.log("hello");
    }, this);
    this.startButton.on('pointerout', () => {this.startButton.setFrame(0)}, this);
    this.startButton.on('pointerdown', () => {this.scene.start(level1)});
  }

  update() {
  }


}


// declare scenes
let level1 = new Level()
let menu = new mainMenu()

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
    level1,
    // start
    menu,
  ],
};

// start game
let game = new Phaser.Game(config);

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
    this.load.image('gnome', 'assets/gnome.png');
    this.load.image('gene', 'assets/gene.png');
  }

  create() {
    super.preload()
    this.player = this.physics.add.image(400, 300, 'gnome');
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.genes = this.physics.add.staticGroup({
      key: 'gene',
      repeat: 9,
      setXY: { x: 120, y: 30, stepY: 60 },
    });

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

    {
      // put this in it's own scope to prevent leakage
      let i = 0;
      let that = this;
      this.genes.children.iterate(function (gene) {
        gene.name = "gene" + i;
        gene.setData('number', that.values[i]);
        let text = that.add.text(0, 0, ""+that.values[i], style)
        gene.setData('text', text);
        ++i;
      });
    }

    this.physics.add.collider(this.player, this.genes, this.swap, null, this);
  }

  update() {
    super.preload()
    this.player_move()
    this._gene_vals = [];
    {
      let that = this;
      this.genes.children.iterate(function (gene) {
        let text = gene.getData('text');
        text.x = Math.floor(gene.x + gene.width / 2);
        text.y = Math.floor(gene.y - 20);
        that._gene_vals.push(gene.getData('number'));
      });
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

    // let gx = gene.x;
    // let gy = gene.y;
    // let sx = to_swap.x;
    // let sy = to_swap.y;
    // gene.x = sx;
    // gene.y = sy;
    // to_swap.x = gx;
    // to_swap.y = gy;
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

// declare scenes
let level1 = new Level()

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
  ],
};

// start game
let game = new Phaser.Game(config);
game.scene.start('level1')

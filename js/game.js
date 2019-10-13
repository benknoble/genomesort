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
  }

  create() {
    super.preload()
    this.player = this.physics.add.image(100, 450, 'gnome');
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    super.preload()
    this.player_move()
  }

  player_move() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    }
    else {
      this.player.setVelocityX(0);
    }
  }

}

//Main Menu Scene
class mainMenu extends Phaser.Scene {

  constructor() {
    super()
  } 

  preload() {
    this.load.image('menu', 'assets/menuBackground.png')
    this.load.image('title', 'assets/GeNome.png')
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
      gravity: { y: 200 }
    }
  },
  scene: [
    menu,
    level1,
  ],
};

// start game
let game = new Phaser.Game(config);
game.scene.start('menu')


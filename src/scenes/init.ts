import Phaser from 'phaser';

export class InitScene extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'InitScene' });
  }

  preload() {
    this.load.image('bg', 'bg.png');
    this.load.image('ground', 'ground.png');
    this.load.image('player', 'player.png');
  }

  create() {
    this.add.image(400, 300, 'bg');

    const ground = this.physics.add.staticGroup();
    ground.create(400, 580, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    this.physics.add.collider(this.player, ground);

    this.cursors = this.input.keyboard.createCursorKeys();

    // Zoom and camera bounds
    this.cameras.main.setBounds(0, 0, 1600, 1200);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.5);
  }

  update() {
    const speed = 200;
    const { left, right, up } = this.cursors;

    if (left?.isDown) {
      this.player.setVelocityX(-speed);
    } else if (right?.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (up?.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
    }

    // Dynamic zoom based on velocity (2.5D effect)
    const velocity = this.player.body.velocity.length();
    const zoom = Phaser.Math.Clamp(1.5 - velocity / 1000, 1.2, 1.5);
    this.cameras.main.setZoom(zoom);
  }
}
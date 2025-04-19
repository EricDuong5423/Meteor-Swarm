import Phaser from "phaser";

export default class LoaderScene extends Phaser.Scene {
  constructor() {
    super("loader-scene");
  }
  preload() {
    //Load image
    this.load.image("player", "./assets/player.png");
    this.load.image("laser", "./assets/laserBlue16.png");
    this.load.image("meteor-small", "./assets/meteor_small.png");
    this.load.image("meteor-medium", "./assets/meteor_med.png");
    this.load.image("meteor-large", "./assets/meteor_large.png");
    //Bitmaps
    this.load.bitmapFont(
      "arcade",
      "./assets/fonts/arcade.png",
      "./assets/fonts/arcade.xml"
    );
    //Load audio
    this.load.audio("shoot", "./assets/laser-shoot.wav");
    this.load.audio("explosion", "./assets/laser-explosion.wav");
    this.load.audio("death", "./assets/death-sound.wav");
    this.load.audio("hit", "./assets/hit-sound.wav");
  }
  create() {
    this.scene.start("main-menu-screen");
  }
}

import Phaser from "phaser";

export default class LoaderScene extends Phaser.Scene {
  constructor() {
    super("loader-scene");
  }
  preload() {
    //Load image
    this.load.image("player", "../public/assets/player.png");
    this.load.image("laser", "../public/assets/laserBlue16.png");
    this.load.image("meteor-small", "../public/assets/meteor_small.png");
    this.load.image("meteor-medium", "../public/assets/meteor_med.png");
    this.load.image("meteor-large", "../public/assets/meteor_large.png");
    //Bitmaps
    this.load.bitmapFont(
      "arcade",
      "../public/assets/fonts/arcade.png",
      "../public/assets/fonts/arcade.xml"
    );
    //Load audio
    this.load.audio("shoot", "../public/assets/laser-shoot.wav");
    this.load.audio("explosion", "../public/assets/laser-explosion.wav");
  }
  create() {
    this.scene.switch("main-menu-screen");
  }
}

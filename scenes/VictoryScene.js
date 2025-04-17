import Phaser from "phaser";

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super("victory-screen");
  }
  preload() {}
  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const titleText = this.add
      .bitmapText(width / 2, height / 2 - 50, "arcade", "YOU WON!", 40)
      .setOrigin(0.5);
  }
}

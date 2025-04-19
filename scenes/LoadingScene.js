import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("loading-scene");
  }
  preload() {}
  createLoadingAnimation() {
    //Store bar in a list
    const bars = [];

    const radius = 64;
    const height = radius * 0.5;
    const width = 10;

    const cx = 400;
    const cy = 300;

    let angle = -90;
    for (let i = 0; i < 12; i++) {
      const { x, y } = Phaser.Math.RotateAround(
        {
          x: cx,
          y: cy - (radius - height * 0.5),
        },
        cx,
        cy,
        Phaser.Math.DEG_TO_RAD * angle
      );
      const bar = this.add
        .rectangle(x, y, width, height, 0xffffff, 1)
        .setAngle(angle)
        .setAlpha(0.2);
      bars.push(bar);
      angle += 30;
    }
    //Animate bars
    let index = 0;
    const tweens = [];
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        bars.forEach((bar, i) => {
          const alpha = i === index ? 1 : 0.2;
          bar.setAlpha(alpha);
        });
        index = (index + 1) % bars.length;
      },
    });
  }
  create(data) {
    const nameNextScene = data.nameNextScene;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.createLoadingAnimation();
    const loadingText = this.add
      .bitmapText(width / 2 - 100, 175, "arcade", "Loading...", 75)
      .setScale(0.5);
    this.time.delayedCall(1000, () => {
      this.scene.start(nameNextScene);
    });
  }
}

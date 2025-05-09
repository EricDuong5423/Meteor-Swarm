import Phaser from "phaser";
import Meteor from "../entities/Meteor.js";
import Laser from "../entities/Laser.js";
import EnemySpawnState from "../Stage/EnemySpawnState.js";

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super("play-scene");
    this.lastHit = 0;
    this.hitTime = 0;
    this.score = 0;
    this.waitFlag = false;

    this.spawnState = EnemySpawnState.BEGINNER;
  }

  create() {
    this.waitFlag = false;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    // Score
    this.scoreText = this.add
      .bitmapText(width - 80, 20, "arcade", `Score: 0000`, 24)
      .setOrigin(0.5);
    this.levelText = this.add.bitmapText(
      20,
      20,
      "arcade",
      `Level: ${this.spawnState.toString()}`,
      24
    );

    // Player
    this.player = this.physics.add.image(200, 200, "player");
    this.player.setDrag(0.99);
    this.player.setMaxVelocity(150);
    this.player.setScale(0.5);
    this.player.setCollideWorldBounds(true);

    // Spawn meteors tùy theo state
    this.spawnMeteors(width, height);

    // Laser
    this.laserGroup = this.physics.add.group({
      classType: Laser,
      maxSize: 1,
      runChildUpdate: true,
    });

    // Collisions
    this.setupCollisions();
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  setupCollisions() {
    this.physics.add.overlap(
      this.laserGroup,
      this.meteorGroup,
      (laser, meteor) => {
        laser.destroy();
        meteor.destroy();

        switch (meteor.meteorType) {
          case 0:
            this.score += 10;
            break;
          case 1:
            this.score += 20;
            break;
          case 2:
            this.score += 30;
            break;
        }
        this.kill += 1;
        this.sound.play("explosion");
      },
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.meteorGroup,
      (player, meteor) => {
        meteor.destroy();
        this.sound.play("hit");
        this.score -= 10;
        const currentTime = this.time.now;
        if (currentTime - this.lastHit > 3000) {
          this.hitTime += 1;
          this.lastHit = currentTime;
          if (this.hitTime >= 2) {
            this.sound.play("death");
            this.scene.start("loading-scene", {
              nameNextScene: "game-over-screen",
            });
          }
        }
      },
      null,
      this
    );
  }

  spawnMeteors(width, height) {
    let count = 0;
    switch (this.spawnState) {
      case EnemySpawnState.BEGINNER:
        count = 5;
        break;
      case EnemySpawnState.INTERMEDIATE:
        count = 10;
        break;
      case EnemySpawnState.ADVANCED:
        count = 15;
        break;
      case EnemySpawnState.MASTER:
        count = 20;
        break;
    }

    this.meteorGroup = this.physics.add.group();
    this.meteorArray = [];

    for (let i = 0; i < count; i++) {
      const meteor = new Meteor(this, 300, 300);
      const xPos = Phaser.Math.RND.between(0, width);
      const yPos = Phaser.Math.RND.between(0, height);
      meteor.setPosition(xPos, yPos);
      meteor.setActive(true);
      meteor.setVisible(true);
      this.meteorGroup.add(meteor, true);
      this.meteorArray.push(meteor);
    }
  }

  update(time, delta) {
    if (this.cursors.up.isDown) {
      this.physics.velocityFromRotation(
        this.player.rotation,
        150,
        this.player.body.acceleration
      );
    } else {
      this.player.setAcceleration(0);
    }

    if (this.cursors.left.isDown) {
      this.player.setAngularVelocity(-300);
    } else if (this.cursors.right.isDown) {
      this.player.setAngularVelocity(300);
    } else {
      this.player.setAngularVelocity(0);
    }

    if (this.cursors.space.isDown) {
      const shoot = this.laserGroup.get();
      if (shoot) {
        shoot.fire(this.player.x, this.player.y, this.player.rotation);
        this.sound.play("shoot");
      }
    }

    for (const meteor of this.meteorArray) {
      meteor.update(time, delta);
    }

    this.scoreText.setText(`Score: ${this.score}`);
    this.levelText.setText(`Level: ${this.spawnState.toString()}`);

    this.checkSpawnState();
  }

  checkSpawnState() {
    if (this.waitFlag == true) return;
    if (
      this.meteorGroup.countActive() == 0 &&
      this.spawnState === EnemySpawnState.BEGINNER
    ) {
      this.waitFlag = true;
      this.spawnState = EnemySpawnState.INTERMEDIATE;
      this.showLevelUpText();
      this.time.delayedCall(2000, () => {
        this.scene.restart();
      });
    } else if (
      this.meteorGroup.countActive() == 0 &&
      this.spawnState === EnemySpawnState.INTERMEDIATE
    ) {
      this.waitFlag = true;
      this.spawnState = EnemySpawnState.ADVANCED;
      this.showLevelUpText();
      this.time.delayedCall(2000, () => {
        this.scene.restart();
      });
    } else if (
      this.meteorGroup.countActive() == 0 &&
      this.spawnState === EnemySpawnState.ADVANCED
    ) {
      this.waitFlag = true;
      this.spawnState = EnemySpawnState.MASTER;
      this.showLevelUpText();
      this.time.delayedCall(2000, () => {
        this.scene.restart();
      });
    } else if (
      this.meteorGroup.countActive() == 0 &&
      this.spawnState === EnemySpawnState.MASTER
    ) {
      this.scene.start("loading-scene", { nameNextScene: "victory-scene" });
    }
  }
  showLevelUpText() {
    const announceText = this.add
      .bitmapText(
        this.cameras.main.width / 2,
        300,
        "arcade",
        `Level: ${this.spawnState}`,
        40
      )
      .setOrigin(0.5)
      .setAlpha(1);

    this.tweens.add({
      targets: announceText,
      y: 250,
      alpha: 0,
      duration: 2000,
      ease: "Power2",
      onComplete: () => {
        announceText.destroy();
      },
    });
  }
}

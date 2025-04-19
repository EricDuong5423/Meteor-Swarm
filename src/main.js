import Phaser from "phaser";
import LoaderScene from "../scenes/LoaderScene";
import MainMenuScene from "../scenes/MainMenuScene";
import PlayScene from "../scenes/PlayScene";
import GameOverScene from "../scenes/GameOverScene";
import LoadingScene from "../scenes/LoadingScene";
import VictoryScene from "../scenes/VictoryScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [
    LoaderScene,
    MainMenuScene,
    LoadingScene,
    PlayScene,
    GameOverScene,
    VictoryScene,
  ],
};

const game = new Phaser.Game(config);

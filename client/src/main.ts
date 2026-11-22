import * as Phaser from "phaser";
import { GAME } from "./game.config";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";

document.title = GAME.title;

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#0f1720",
  scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
  render: { antialias: true, powerPreference: "high-performance" },
  scene: [MenuScene, GameScene], // first scene in the list starts automatically
});

// Expose for automated playtests (Playwright / Claude in Chrome).
(window as unknown as { __game: Phaser.Game }).__game = game;

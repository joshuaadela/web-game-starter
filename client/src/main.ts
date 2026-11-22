import * as Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#0f1720",
  scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
  render: { antialias: true, powerPreference: "high-performance" },
  scene: [GameScene],
});

// Expose for automated playtests (Playwright / Claude in Chrome).
(window as unknown as { __game: Phaser.Game }).__game = game;

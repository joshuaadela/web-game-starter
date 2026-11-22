import * as Phaser from "phaser";
import { GAME } from "../game.config";
import type { GameMode } from "../session/types";

const LABELS: Record<GameMode, string> = { solo: "Play Solo", online: "Play Online" };

/**
 * Start menu. Shows one button per mode in GAME.modes.
 * Skipped when the game has a single mode, or when the URL has ?mode=solo|online
 * (handy for automated playtests).
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  create() {
    const fromUrl = new URLSearchParams(location.search).get("mode") as GameMode | null;
    if (fromUrl && GAME.modes.includes(fromUrl)) return this.play(fromUrl);
    const [only] = GAME.modes;
    if (GAME.modes.length === 1 && only) return this.play(only);

    const title = this.add.text(0, 0, GAME.title, { fontFamily: "system-ui", fontSize: "40px", fontStyle: "bold", color: "#f1f5f9" }).setOrigin(0.5);
    const buttons = GAME.modes.map((mode) => {
      const btn = this.add
        .text(0, 0, LABELS[mode], { fontFamily: "system-ui", fontSize: "24px", color: "#0f1720", backgroundColor: "#4ecdc4", padding: { x: 28, y: 14 } })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
      btn.on("pointerover", () => btn.setAlpha(0.85));
      btn.on("pointerout", () => btn.setAlpha(1));
      btn.on("pointerup", () => this.play(mode));
      return btn;
    });

    const layout = () => {
      const { width, height } = this.scale;
      title.setPosition(width / 2, height / 2 - 90);
      buttons.forEach((b, i) => b.setPosition(width / 2, height / 2 + i * 80));
    };
    layout();
    this.scale.on("resize", layout);
    this.events.once("shutdown", () => this.scale.off("resize", layout));
  }

  private play(mode: GameMode) {
    this.scene.start("game", { mode });
  }
}

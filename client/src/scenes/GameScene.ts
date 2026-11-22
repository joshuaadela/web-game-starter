import * as Phaser from "phaser";
import { PLAYER, WORLD } from "@game/shared";
import { VirtualJoystick } from "../input/VirtualJoystick";
import { LocalSession } from "../session/LocalSession";
import { OnlineSession } from "../session/OnlineSession";
import type { GameMode, GameSession, PlayerSnapshot } from "../session/types";

interface PlayerView {
  body: Phaser.GameObjects.Arc;
  label: Phaser.GameObjects.Text;
  /** Latest authoritative position; the view smoothly moves toward it. */
  target: { x: number; y: number };
}

/**
 * Example gameplay scene: top-down movement in a bounded world.
 * Replace the drawing and input code for your genre; keep talking to `this.session`.
 */
export class GameScene extends Phaser.Scene {
  private session!: GameSession;
  private ready = false;
  private views = new Map<string, PlayerView>();
  private keys?: Record<"up" | "down" | "left" | "right" | "w" | "a" | "s" | "d", Phaser.Input.Keyboard.Key>;
  private joystick?: VirtualJoystick;
  private lastSent = { dx: 0, dy: 0 };
  private statusText?: Phaser.GameObjects.Text;

  constructor() {
    super("game");
  }

  init(data: { mode?: GameMode }) {
    const mode = data.mode ?? "solo";
    this.session = mode === "online" ? new OnlineSession(`Player${Math.floor(Math.random() * 1000)}`) : new LocalSession();
    this.ready = false;
    this.views.clear();
    this.lastSent = { dx: 0, dy: 0 };
  }

  async create() {
    this.drawWorld();
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
    this.statusText = this.add.text(12, 12, this.session.mode === "online" ? "Connecting…" : "", { fontFamily: "system-ui", fontSize: "16px", color: "#cbd5e1" }).setScrollFactor(0).setDepth(2000);

    const kb = this.input.keyboard;
    if (kb) {
      this.keys = kb.addKeys({ up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT", w: "W", a: "A", s: "S", d: "D" }) as typeof this.keys;
    }
    this.joystick = new VirtualJoystick(this);
    this.events.once("shutdown", () => this.session.leave());

    try {
      await this.session.start({
        onPlayerAdded: (p, isMe) => this.addPlayer(p, isMe),
        onPlayerMoved: (id, x, y) => {
          const v = this.views.get(id);
          if (v) v.target = { x, y };
        },
        onPlayerRemoved: (id) => this.removePlayer(id),
        onDisconnected: () => this.statusText?.setText("Disconnected"),
      });
      this.ready = true;
    } catch (err) {
      this.statusText.setText("Could not reach game server. Is `npm run dev` running?");
      console.error("[net] join failed", err);
    }
  }

  override update(_time: number, deltaMs: number) {
    if (!this.ready) return;

    // --- Input: keyboard + touch → direction, sent only when it changes.
    let dx = 0;
    let dy = 0;
    const k = this.keys;
    if (k) {
      dx = (k.right.isDown || k.d.isDown ? 1 : 0) - (k.left.isDown || k.a.isDown ? 1 : 0);
      dy = (k.down.isDown || k.s.isDown ? 1 : 0) - (k.up.isDown || k.w.isDown ? 1 : 0);
    }
    if (this.joystick && (this.joystick.dx || this.joystick.dy)) {
      dx = this.joystick.dx;
      dy = this.joystick.dy;
    }
    if (Math.abs(dx - this.lastSent.dx) > 0.01 || Math.abs(dy - this.lastSent.dy) > 0.01) {
      this.session.sendInput({ dx, dy });
      this.lastSent = { dx, dy };
    }

    this.session.update(deltaMs);

    // --- Render: smooth toward the latest positions.
    const t = 1 - Math.pow(0.001, (deltaMs / 1000) * 8);
    for (const view of this.views.values()) {
      view.body.x = Phaser.Math.Linear(view.body.x, view.target.x, t);
      view.body.y = Phaser.Math.Linear(view.body.y, view.target.y, t);
      view.label.setPosition(view.body.x, view.body.y - PLAYER.radius - 14);
    }

    const who = this.session.mode === "online" ? `Players: ${this.views.size}` : "Solo";
    this.statusText?.setText(`${who}  ·  ${Math.round(this.game.loop.actualFps)} fps`);
  }

  private addPlayer(p: PlayerSnapshot, isMe: boolean) {
    const body = this.add.circle(p.x, p.y, PLAYER.radius, p.color).setStrokeStyle(isMe ? 4 : 2, isMe ? 0xffffff : 0x000000, isMe ? 1 : 0.4);
    const label = this.add.text(p.x, p.y - PLAYER.radius - 14, p.name, { fontFamily: "system-ui", fontSize: "14px", color: "#e2e8f0" }).setOrigin(0.5);
    this.views.set(p.id, { body, label, target: { x: p.x, y: p.y } });
    if (isMe) this.cameras.main.startFollow(body, true, 0.15, 0.15);
  }

  private removePlayer(id: string) {
    const view = this.views.get(id);
    view?.body.destroy();
    view?.label.destroy();
    this.views.delete(id);
  }

  private drawWorld() {
    const g = this.add.graphics();
    g.fillStyle(0x1b2a1f, 1).fillRect(0, 0, WORLD.width, WORLD.height);
    g.lineStyle(1, 0x2c4433, 1);
    for (let x = 0; x <= WORLD.width; x += 100) g.lineBetween(x, 0, x, WORLD.height);
    for (let y = 0; y <= WORLD.height; y += 100) g.lineBetween(0, y, WORLD.width, y);
    g.lineStyle(6, 0x8b5a2b, 1).strokeRect(0, 0, WORLD.width, WORLD.height);
  }
}

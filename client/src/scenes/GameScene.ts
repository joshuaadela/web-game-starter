import * as Phaser from "phaser";
import { Callbacks, type Room } from "@colyseus/sdk";
import { MESSAGE, PLAYER, WORLD, type ArenaState, type Player } from "@game/shared";
import { joinArena } from "../net";
import { VirtualJoystick } from "../input/VirtualJoystick";

interface PlayerView {
  body: Phaser.GameObjects.Arc;
  label: Phaser.GameObjects.Text;
  /** Latest authoritative position from the server; we interpolate toward it. */
  target: { x: number; y: number };
}

export class GameScene extends Phaser.Scene {
  private room?: Room<any, ArenaState>;
  private views = new Map<string, PlayerView>();
  private keys?: Record<"up" | "down" | "left" | "right" | "w" | "a" | "s" | "d", Phaser.Input.Keyboard.Key>;
  private joystick?: VirtualJoystick;
  private seq = 0;
  private lastSent = { dx: 0, dy: 0 };
  private statusText?: Phaser.GameObjects.Text;

  constructor() {
    super("game");
  }

  async create() {
    this.drawWorld();
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
    this.statusText = this.add.text(12, 12, "Connecting…", { fontFamily: "system-ui", fontSize: "16px", color: "#cbd5e1" }).setScrollFactor(0).setDepth(2000);

    const kb = this.input.keyboard;
    if (kb) {
      this.keys = kb.addKeys({ up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT", w: "W", a: "A", s: "S", d: "D" }) as typeof this.keys;
    }
    this.joystick = new VirtualJoystick(this);

    try {
      this.room = await joinArena(`Player${Math.floor(Math.random() * 1000)}`);
    } catch (err) {
      this.statusText.setText("Could not reach game server. Is `npm run dev` running?");
      console.error("[net] join failed", err);
      return;
    }
    this.bindState(this.room);
  }

  private bindState(room: Room<any, ArenaState>) {
    const cb = Callbacks.get(room);

    cb.onAdd("players", (player: Player, sessionId: string) => {
      const isMe = sessionId === room.sessionId;
      const body = this.add.circle(player.x, player.y, PLAYER.radius, player.color).setStrokeStyle(isMe ? 4 : 2, isMe ? 0xffffff : 0x000000, isMe ? 1 : 0.4);
      const label = this.add.text(player.x, player.y - PLAYER.radius - 14, player.name, { fontFamily: "system-ui", fontSize: "14px", color: "#e2e8f0" }).setOrigin(0.5);
      const view: PlayerView = { body, label, target: { x: player.x, y: player.y } };
      this.views.set(sessionId, view);

      cb.onChange(player, () => {
        view.target.x = player.x;
        view.target.y = player.y;
      });

      if (isMe) this.cameras.main.startFollow(body, true, 0.15, 0.15);
    });

    cb.onRemove("players", (_player: Player, sessionId: string) => {
      const view = this.views.get(sessionId);
      view?.body.destroy();
      view?.label.destroy();
      this.views.delete(sessionId);
    });

    room.onLeave(() => this.statusText?.setText("Disconnected"));
  }

  override update(_time: number, deltaMs: number) {
    if (!this.room) return;

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
      this.room.send(MESSAGE.input, { dx, dy, seq: ++this.seq });
      this.lastSent = { dx, dy };
    }

    // --- Render: smooth toward server positions (simple interpolation; prediction comes later).
    const t = 1 - Math.pow(0.001, deltaMs / 1000 * 8);
    for (const view of this.views.values()) {
      view.body.x = Phaser.Math.Linear(view.body.x, view.target.x, t);
      view.body.y = Phaser.Math.Linear(view.body.y, view.target.y, t);
      view.label.setPosition(view.body.x, view.body.y - PLAYER.radius - 14);
    }

    this.statusText?.setText(`Players: ${this.views.size}  ·  ${Math.round(this.game.loop.actualFps)} fps`);
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

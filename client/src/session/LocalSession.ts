import { NET, WORLD, stepMovement, type PlayerInput } from "@game/shared";
import type { GameSession, PlayerSnapshot, SessionHandlers } from "./types";

const LOCAL_ID = "local-player";
const STEP_MS = 1000 / NET.tickRate;

/**
 * Single-player session: runs the same pure rules from `shared/` in the browser,
 * at the same fixed tick rate as the server, so behaviour matches online play.
 */
export class LocalSession implements GameSession {
  readonly mode = "solo" as const;
  private handlers?: SessionHandlers;
  private player: PlayerSnapshot = { id: LOCAL_ID, name: "You", x: WORLD.width / 2, y: WORLD.height / 2, color: 0x4ecdc4 };
  private input: Pick<PlayerInput, "dx" | "dy"> = { dx: 0, dy: 0 };
  private accumulatorMs = 0;

  async start(handlers: SessionHandlers) {
    this.handlers = handlers;
    handlers.onPlayerAdded({ ...this.player }, true);
  }

  sendInput(input: Omit<PlayerInput, "seq">) {
    this.input = { dx: input.dx, dy: input.dy };
  }

  update(deltaMs: number) {
    if (!this.handlers) return;
    // Cap catch-up after the tab was in the background.
    this.accumulatorMs = Math.min(this.accumulatorMs + deltaMs, 250);
    let moved = false;
    while (this.accumulatorMs >= STEP_MS) {
      const next = stepMovement(this.player, this.input, STEP_MS / 1000);
      this.player.x = next.x;
      this.player.y = next.y;
      this.accumulatorMs -= STEP_MS;
      moved = true;
    }
    if (moved) this.handlers.onPlayerMoved(this.player.id, this.player.x, this.player.y);
  }

  leave() {
    this.handlers?.onPlayerRemoved(this.player.id);
    this.handlers = undefined;
  }
}

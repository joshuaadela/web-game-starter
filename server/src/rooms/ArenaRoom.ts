import { Room, type Client } from "colyseus";
import {
  ArenaState,
  MESSAGE,
  NET,
  Player,
  WORLD,
  sanitizeInput,
  stepMovement,
  type PlayerInput,
} from "@game/shared";

const COLORS = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xc56cf0, 0xf8a5c2, 0x63cdda, 0xf5cd79];

/**
 * Authoritative arena. Clients only send inputs; the server owns all state.
 */
export class ArenaRoom extends Room<{ state: ArenaState }> {
  override maxClients = NET.maxPlayersPerRoom;

  /** Latest input per session; applied every tick. */
  private latestInput = new Map<string, PlayerInput>();

  override onCreate() {
    this.setState(new ArenaState());
    this.setPatchRate(NET.patchIntervalMs);

    this.onMessage(MESSAGE.input, (client, raw) => {
      const input = sanitizeInput(raw);
      if (input) this.latestInput.set(client.sessionId, input);
    });

    this.setSimulationInterval((deltaMs) => this.tick(deltaMs / 1000), 1000 / NET.tickRate);
  }

  override onJoin(client: Client, options?: { name?: string }) {
    const player = new Player();
    player.name = String(options?.name ?? "Player").slice(0, 16);
    player.x = WORLD.width / 2 + (Math.random() - 0.5) * 400;
    player.y = WORLD.height / 2 + (Math.random() - 0.5) * 400;
    player.color = COLORS[this.clients.length % COLORS.length] ?? 0xffffff;
    player.lastSeq = 0;
    this.state.players.set(client.sessionId, player);
    console.log(`[arena ${this.roomId}] ${player.name} joined (${this.clients.length} players)`);
  }

  override onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    this.latestInput.delete(client.sessionId);
  }

  private tick(dtSec: number) {
    this.state.players.forEach((player, sessionId) => {
      const input = this.latestInput.get(sessionId);
      if (!input) return;
      const next = stepMovement(player, input, dtSec);
      player.x = next.x;
      player.y = next.y;
      player.lastSeq = input.seq;
    });
  }
}

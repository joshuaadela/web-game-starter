import { Callbacks, Client, type Room } from "@colyseus/sdk";
import { ArenaState, MESSAGE, NET, ROOM_NAME, type Player, type PlayerInput } from "@game/shared";
import type { GameSession, SessionHandlers } from "./types";

/** Server URL: same host the page was loaded from, so phones on your LAN work. */
function serverUrl(): string {
  const env = import.meta.env.VITE_SERVER_URL as string | undefined;
  if (env) return env;
  const proto = location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${location.hostname}:${NET.defaultPort}`;
}

/** Multiplayer session: the Colyseus server simulates; we send inputs and mirror its state. */
export class OnlineSession implements GameSession {
  readonly mode = "online" as const;
  private room?: Room<any, ArenaState>;
  private seq = 0;

  constructor(private playerName: string) {}

  async start(handlers: SessionHandlers) {
    const room: Room<any, ArenaState> = await new Client(serverUrl()).joinOrCreate(ROOM_NAME, { name: this.playerName }, ArenaState);
    this.room = room;
    const cb = Callbacks.get(room);

    cb.onAdd("players", (p: Player, id: string) => {
      handlers.onPlayerAdded({ id, name: p.name, x: p.x, y: p.y, color: p.color }, id === room.sessionId);
      cb.onChange(p, () => handlers.onPlayerMoved(id, p.x, p.y));
    });
    cb.onRemove("players", (_p: Player, id: string) => handlers.onPlayerRemoved(id));
    room.onLeave(() => handlers.onDisconnected?.());
  }

  sendInput(input: Omit<PlayerInput, "seq">) {
    this.room?.send(MESSAGE.input, { ...input, seq: ++this.seq });
  }

  update() {
    // Server drives the simulation; nothing to do per frame (prediction would go here).
  }

  leave() {
    void this.room?.leave();
  }
}

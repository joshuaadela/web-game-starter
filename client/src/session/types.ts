import type { PlayerInput } from "@game/shared";

/** How the game is being played. Pick the modes your game supports in `game.config.ts`. */
export type GameMode = "solo" | "online";

/** What the scene needs to draw a player. Same shape in solo and online modes. */
export interface PlayerSnapshot {
  id: string;
  name: string;
  x: number;
  y: number;
  color: number;
}

/** Callbacks the scene registers; a session calls them when the game state changes. */
export interface SessionHandlers {
  onPlayerAdded(player: PlayerSnapshot, isMe: boolean): void;
  onPlayerMoved(id: string, x: number, y: number): void;
  onPlayerRemoved(id: string): void;
  onDisconnected?(): void;
}

/**
 * The scene talks to a GameSession and never directly to the network, so the
 * same scene works for single-player (LocalSession) and multiplayer (OnlineSession).
 */
export interface GameSession {
  readonly mode: GameMode;
  /** Connect / start simulating and begin calling the handlers. */
  start(handlers: SessionHandlers): Promise<void>;
  /** Player intent. Solo applies it locally; online sends it to the server. */
  sendInput(input: Omit<PlayerInput, "seq">): void;
  /** Called every frame by the scene. Solo advances the simulation here. */
  update(deltaMs: number): void;
  leave(): void;
}

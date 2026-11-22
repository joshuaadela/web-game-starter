/**
 * Game-wide tuning values shared by client and server.
 * Keep gameplay numbers here (or in data files), never hard-coded in logic.
 */
export const WORLD = {
  width: 3000,
  height: 3000,
} as const;

export const PLAYER = {
  radius: 24,
  /** Movement speed in world units per second. */
  speed: 260,
} as const;

export const NET = {
  /** Server simulation rate (ticks per second). */
  tickRate: 30,
  /** How often state patches are sent to clients (ms). */
  patchIntervalMs: 50,
  /** Max players per arena room. */
  maxPlayersPerRoom: 50,
  defaultPort: 2567,
} as const;

export const ROOM_NAME = "arena";

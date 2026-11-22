import type { GameMode } from "./session/types";

/**
 * Per-game settings. The `new-game` skill edits this when adapting the template.
 */
export const GAME = {
  title: "Web Game Starter",
  /**
   * Modes this game offers, in menu order.
   *  - ["solo"]           single-player only (no server needed)
   *  - ["online"]         multiplayer only
   *  - ["solo", "online"] both; the menu lets players choose
   */
  modes: ["solo", "online"] as GameMode[],
  /** Screen orientation the game is designed for (enforced in native builds later). */
  orientation: "any" as "any" | "portrait" | "landscape",
};

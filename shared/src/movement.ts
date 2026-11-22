import { PLAYER, WORLD } from "./constants";
import type { PlayerInput } from "./input";

export interface Vec2 {
  x: number;
  y: number;
}

/**
 * Deterministic movement step. Runs on the server (authoritative) and will run
 * on the client too once we add prediction — so it must stay pure.
 */
export function stepMovement(pos: Vec2, input: Pick<PlayerInput, "dx" | "dy">, dtSec: number): Vec2 {
  const r = PLAYER.radius;
  const x = pos.x + input.dx * PLAYER.speed * dtSec;
  const y = pos.y + input.dy * PLAYER.speed * dtSec;
  return {
    x: Math.min(WORLD.width - r, Math.max(r, x)),
    y: Math.min(WORLD.height - r, Math.max(r, y)),
  };
}

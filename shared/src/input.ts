/** Input a client sends to the server each frame it changes. */
export interface PlayerInput {
  /** Desired move direction; any length, normalised by the server. */
  dx: number;
  dy: number;
  /** Monotonic sequence number, used later for client prediction/reconciliation. */
  seq: number;
}

export const MESSAGE = {
  input: "input",
} as const;

/**
 * Never trust client input: coerce to finite numbers and clamp the direction
 * vector to length <= 1 so a hacked client can't move faster than allowed.
 */
export function sanitizeInput(raw: unknown): PlayerInput | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const dx = Number(r.dx);
  const dy = Number(r.dy);
  const seq = Number(r.seq);
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || !Number.isFinite(seq)) return null;
  const len = Math.hypot(dx, dy);
  const scale = len > 1 ? 1 / len : 1;
  return { dx: dx * scale, dy: dy * scale, seq: Math.max(0, Math.floor(seq)) };
}

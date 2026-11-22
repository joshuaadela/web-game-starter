import { describe, expect, it } from "vitest";
import { NET, PLAYER, WORLD } from "@game/shared";
import { LocalSession } from "./LocalSession";
import type { SessionHandlers } from "./types";

function recorder() {
  const moves: Array<{ x: number; y: number }> = [];
  let added = 0;
  const handlers: SessionHandlers = {
    onPlayerAdded: () => void added++,
    onPlayerMoved: (_id, x, y) => void moves.push({ x, y }),
    onPlayerRemoved: () => {},
  };
  return { handlers, moves, added: () => added };
}

describe("LocalSession (single-player)", () => {
  it("spawns exactly one local player", async () => {
    const r = recorder();
    await new LocalSession().start(r.handlers);
    expect(r.added()).toBe(1);
  });

  it("moves at the same speed as the server simulation", async () => {
    const r = recorder();
    const s = new LocalSession();
    await s.start(r.handlers);
    s.sendInput({ dx: 1, dy: 0 });
    for (let i = 0; i < NET.tickRate; i++) s.update(1000 / NET.tickRate); // 1 simulated second
    const last = r.moves.at(-1)!;
    expect(last.x).toBeCloseTo(WORLD.width / 2 + PLAYER.speed, 0);
    expect(last.y).toBe(WORLD.height / 2);
  });
});

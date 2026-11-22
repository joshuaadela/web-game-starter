import { describe, expect, it } from "vitest";
import { PLAYER, WORLD } from "./constants";
import { sanitizeInput } from "./input";
import { stepMovement } from "./movement";

describe("stepMovement", () => {
  it("moves at PLAYER.speed per second", () => {
    const p = stepMovement({ x: 500, y: 500 }, { dx: 1, dy: 0 }, 1);
    expect(p).toEqual({ x: 500 + PLAYER.speed, y: 500 });
  });

  it("clamps to world bounds", () => {
    expect(stepMovement({ x: 10, y: 10 }, { dx: -1, dy: -1 }, 1)).toEqual({ x: PLAYER.radius, y: PLAYER.radius });
    const far = stepMovement({ x: WORLD.width, y: WORLD.height }, { dx: 1, dy: 1 }, 1);
    expect(far).toEqual({ x: WORLD.width - PLAYER.radius, y: WORLD.height - PLAYER.radius });
  });
});

describe("sanitizeInput", () => {
  it("rejects garbage", () => {
    expect(sanitizeInput(null)).toBeNull();
    expect(sanitizeInput("hi")).toBeNull();
    expect(sanitizeInput({ dx: NaN, dy: 0, seq: 1 })).toBeNull();
  });

  it("clamps speed hacks to unit length", () => {
    const i = sanitizeInput({ dx: 100, dy: 0, seq: 3 })!;
    expect(i.dx).toBeCloseTo(1);
    expect(i.seq).toBe(3);
  });
});

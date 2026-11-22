/**
 * Headless multiplayer smoke test: two bots join, bot A moves right,
 * bot B must observe A's position change. Exit code 0 = pass.
 * Usage: npx tsx scripts/smoke-test.ts [ws://localhost:2567]
 */
import { Client } from "@colyseus/sdk";
import { ArenaState, MESSAGE, NET, ROOM_NAME } from "@game/shared";

const url = process.argv[2] ?? `ws://localhost:${NET.defaultPort}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const a = await new Client(url).joinOrCreate(ROOM_NAME, { name: "botA" }, ArenaState);
const b = await new Client(url).joinOrCreate(ROOM_NAME, { name: "botB" }, ArenaState);
await sleep(300);

const seenByB = () => b.state.players.get(a.sessionId);
const startX = seenByB()?.x;
if (startX === undefined) throw new Error("B cannot see A");

a.send(MESSAGE.input, { dx: 1, dy: 0, seq: 1 });
await sleep(1000);
a.send(MESSAGE.input, { dx: 0, dy: 0, seq: 2 });
await sleep(200);

const moved = (seenByB()?.x ?? startX) - startX;
const playerCount = b.state.players.size; // read before leaving: leaving removes players
console.log(`players in room: ${playerCount}, A moved ${moved.toFixed(1)}px as seen by B`);
await a.leave();
await b.leave();
if (playerCount < 2 || moved < 150) {
  console.error("SMOKE TEST FAILED");
  process.exit(1);
}
console.log("SMOKE TEST PASSED");
process.exit(0);

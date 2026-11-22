# Web Game Starter — project guide for Claude

A starter for **2D real-time multiplayer games** that run in the **browser and on mobile (iOS/Android)**,
built with Claude Code. Users of this template are often web developers who are new to game development
and build mostly by prompting ("vibe coding"): explain game-dev concepts briefly when they come up, and
prefer simple, readable code over clever code.

## Stack
| Part | Tech | Where |
|---|---|---|
| Client | Phaser 4 + TypeScript, built with Vite 8 | `client/` |
| Server | Colyseus 0.18 (authoritative), run with tsx | `server/` |
| Shared | Constants, input types, pure simulation, network schema | `shared/` |
| Mobile wrapper | Capacitor (not added yet) | `client/` |
| Tests | Vitest (unit), `scripts/smoke-test.ts` (multiplayer) | |

Node **24** (`.nvmrc`; 22.12+ minimum). With nvm, run `source ~/.nvm/nvm.sh && nvm use` before npm commands — an older default Node will break the tooling.

## Commands
- `npm run dev` — server on :2567 + client on :5173 (also reachable from a phone on the same Wi-Fi)
- `npm test` — unit tests
- `npm run typecheck` — TypeScript across all workspaces
- `npm run build` — production client build
- `npm run smoke` — two bots join and verify state sync (server must be running)

## Architecture rules (non-negotiable)
1. **Server is authoritative.** Clients send *inputs* only (`MESSAGE.input`), never positions, damage, or inventory results.
2. **Validate every client message** on the server (see `sanitizeInput`). Assume clients are hacked.
3. **Simulation logic lives in `shared/` as pure functions** (e.g. `stepMovement`) so the server runs it and the client can reuse it for prediction. No Phaser or Colyseus imports in simulation code.
4. **Tuning numbers live in `shared/src/constants.ts`** (or data files later), not inline.
5. **Network schema (`shared/src/schema.ts`) holds only what other clients must see.** Every field costs bandwidth for every player.
6. Colyseus 0.18 `Room` already defines members like `inputs`, `state`, `clients` — don't shadow them.
7. Schemas use the `schema({...}, "Name")` API, not decorators.
8. **No secrets in `client/`** — everything there ships to players. Secrets go in gitignored `.env` files used by the server only.

## Mobile performance budget
- 60 fps on a mid-range Android phone; never below 30 fps.
- No per-frame allocations in hot paths (`update`, tick loops): reuse objects and vectors.
- Pool frequently spawned objects (projectiles, particles, pickups).
- Keep draw calls low: texture atlases, not individual images.
- Initial download target: < 5 MB gzipped.

## Workflow
- New features: follow the `feature-workflow` skill (spec → GDD → implement → test → perf check → playtest).
- Design questions: use the `game-designer` agent and keep `docs/GDD.md` current.
- Before saying anything is done: run the `test-build` skill and report real output.

## Agents (`.claude/agents/`)
`game-designer`, `gameplay-engineer`, `netcode-engineer`, `mobile-perf`, `tech-artist`, `ui-touch`.

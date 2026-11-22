# Web Game Starter — project guide for Claude

A starter for **2D games of any genre**, single-player and/or multiplayer (real-time or turn-based), that run
in the **browser and on mobile (iOS/Android)**, built with Claude Code. The example code is top-down movement
playable solo or online; `docs/GENRES.md` explains how to adapt it to other genres. Users of this template are often web developers who are new to game development
and build mostly by prompting ("vibe coding"): explain game-dev concepts briefly when they come up, and
prefer simple, readable code over clever code.

## Stack
| Part | Tech | Where |
|---|---|---|
| Client | Phaser 4 + TypeScript, built with Vite 8 | `client/` |
| Game settings | Title, modes (solo/online), orientation | `client/src/game.config.ts` |
| Session layer | `LocalSession` (solo) / `OnlineSession` (multiplayer) | `client/src/session/` |
| Server | Colyseus 0.18 (authoritative; only needed for online play) | `server/` |
| Shared | Constants, input types, pure simulation, network schema | `shared/` |
| Mobile wrapper | Capacitor (not added yet) | `client/` |
| Tests | Vitest (unit), `scripts/smoke-test.ts` (multiplayer) | |

Node **24** (`.nvmrc`; 22.12+ minimum). With nvm, run `source ~/.nvm/nvm.sh && nvm use` before npm commands — an older default Node will break the tooling.

## Commands
- `npm run dev` — server on :2567 + client on :5173 (also reachable from a phone on the same Wi-Fi)
- `npm run dev -w client` — client only (enough for solo mode)
- Open `/?mode=solo` or `/?mode=online` to skip the menu
- `npm test` — unit tests
- `npm run typecheck` — TypeScript across all workspaces
- `npm run build` — production client build
- `npm run smoke` — two bots join and verify state sync (server must be running)

## Architecture rules (non-negotiable)
1. **Game rules live in `shared/` as pure functions** (e.g. `stepMovement`) with tests. Solo mode runs them in the browser (`LocalSession`); online mode runs them on the server. No Phaser or Colyseus imports in rule code.
2. **Scenes talk to a `GameSession`, never directly to the network.** This keeps solo and online interchangeable.
3. **Online: the server is authoritative.** Clients send *inputs or move requests* only, never positions, damage, or results.
4. **Validate every client message** on the server (see `sanitizeInput`). Assume clients are hacked.
5. **Tuning numbers live in `shared/src/constants.ts`** (or data files later), not inline.
6. **Network schema (`shared/src/schema.ts`) holds only what other clients must see.** Every field costs bandwidth for every player.
7. Colyseus 0.18 `Room` already defines members like `inputs`, `state`, `clients` — don't shadow them.
8. Schemas use the `schema({...}, "Name")` API, not decorators.
9. **No secrets in `client/`** — everything there ships to players. Secrets go in gitignored `.env` files used by the server only.

## Mobile performance budget
- 60 fps on a mid-range Android phone; never below 30 fps.
- No per-frame allocations in hot paths (`update`, tick loops): reuse objects and vectors.
- Pool frequently spawned objects (projectiles, particles, enemies, pickups).
- Keep draw calls low: texture atlases, not individual images.
- Initial download target: < 5 MB gzipped.

## Workflow
- Starting a game from this template: use the `new-game` skill (genre, modes, controls → configures the project).
- New features: follow the `feature-workflow` skill (spec → GDD → implement → test → perf check → playtest).
- Design questions: use the `game-designer` agent and keep `docs/GDD.md` current.
- Before saying anything is done: run the `test-build` skill and report real output.

## Improving the template
This repo is (or was created from) the template in `.template.json`. Feed lessons back:
- When something **in the template** causes friction (a bug in template code, a wrong API note, a missing script, a misleading agent/skill instruction, an incomplete genre recipe), add an entry to `docs/TEMPLATE-NOTES.md` right away, in the format shown there. Game-specific design and code don't go there.
- To send lessons back, run the `template-feedback` skill. It reviews all changes, keeps the generic ones, and opens a PR to the template for the developer to approve. Never push to the template's `main` directly.
- Keep `.template.json` and `docs/TEMPLATE-NOTES.md` when adapting the template.

## Agents (`.claude/agents/`)
`game-designer`, `gameplay-engineer`, `netcode-engineer`, `mobile-perf`, `tech-artist`, `ui-touch`.

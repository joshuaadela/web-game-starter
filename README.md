# Web Game Starter

A TypeScript starter for **2D games of any genre** (single-player, online multiplayer, or both; real-time or turn-based) that run in the browser and on mobile.
It's set up for building with [Claude Code](https://claude.com/claude-code): project rules, specialist agents, workflow skills and genre recipes are included.

> **About this repo:** this is a reference base to come back to whenever starting a basic 2D game on a web stack.
> It isn't a game itself. It's a clean, working starting point (project structure, tooling, multiplayer plumbing and Claude Code setup)
> to copy or create new game repositories from.

It's aimed at **web developers making their first game**: everything is TypeScript, runs with familiar web tooling, and can be tested end-to-end by Claude.

![stack](https://img.shields.io/badge/Phaser-4-blue) ![stack](https://img.shields.io/badge/Colyseus-0.18-purple) ![stack](https://img.shields.io/badge/TypeScript-7-3178c6) ![stack](https://img.shields.io/badge/Vite-8-646cff)

## What you get

A small working example (top-down movement) playable two ways from a start menu:
- **Solo:** the game rules run in the browser, with no server needed.
- **Online:** open two tabs and each player sees the other move, with the server in charge.

Plus:
- **Genre recipes** (`docs/GENRES.md`) for platformers, puzzle, card/board, tower defense, roguelike, strategy, idle, party, racing and action games.
- **A session layer** (`client/src/session/`), so the same scene works solo or online.
- **Server-authoritative multiplayer** with [Colyseus](https://colyseus.io): clients send inputs, the server simulates, and state syncs automatically.
- **Shared game logic** in `shared/`: pure, tested functions used by both server and client.
- **Phaser 4 client** with keyboard controls and a floating touch joystick for phones.
- **Tests:** Vitest unit tests plus a headless two-bot multiplayer smoke test.
- **Claude Code setup:** `CLAUDE.md`, 6 agents and 5 skills (below).

## Quick start

Requires **Node 22.12+** (Node 24 recommended, pinned in `.nvmrc`).

```bash
nvm use            # or install Node 24 another way
npm install
npm run dev        # server :2567 + client :5173
```

Open http://localhost:5173, pick **Solo** or **Online**, and move with **WASD / arrow keys**.
For online, open a second window to see both players. Add `?mode=solo` or `?mode=online` to the URL to skip the menu.
On a phone on the same Wi-Fi, open the `Network:` URL Vite prints and drag on the left half of the screen.

| Command | What it does |
|---|---|
| `npm run dev` | Start server and client with hot reload |
| `npm run dev -w client` | Client only (enough for solo mode) |
| `npm test` | Unit tests |
| `npm run typecheck` | Type-check all workspaces |
| `npm run build` | Production client build |
| `npm run smoke` | Two bots join and verify state sync (server must be running) |

> npm 11+ may ask you to approve install scripts. `esbuild` and `fsevents` are needed; `msgpackr-extract` is an optional native speed-up and can be skipped.

## Project structure

```
client/    Phaser 4 game: scenes, input, session layer (solo/online), game.config.ts
server/    Colyseus game server: rooms, authoritative simulation
shared/    Constants, input types, pure game logic, network schema (+ tests)
scripts/   smoke-test.ts: headless multiplayer check
docs/      GDD.md (design document template), GENRES.md (genre recipes)
.claude/   Agents and skills for Claude Code
CLAUDE.md  Project rules Claude follows in every session
```

## Claude Code agents and skills

| Agent | Role |
|---|---|
| `game-designer` | Mechanics, balance, progression; maintains `docs/GDD.md` |
| `gameplay-engineer` | Implements features across shared/server/client |
| `netcode-engineer` | Authority, prediction, lag, bandwidth, anti-cheat |
| `mobile-perf` | Frame rate, memory, GC stutter, bundle size |
| `tech-artist` | Sprites, atlases, particles, shaders, game feel |
| `ui-touch` | Touch controls, HUD, menus, safe areas |

| Skill | Use it to |
|---|---|
| `new-game` | Adapt the template to your game: genre, solo/online, controls, orientation |
| `feature-workflow` | Take a feature from spec → code → tests → review → playtest |
| `dev-run` | Start/stop the local game |
| `playtest` | Open two clients in Chrome and verify (needs [Claude in Chrome](https://claude.com/chrome)) |
| `test-build` | Typecheck, tests, build and smoke test, with real output |
| `netcode-review` | Check multiplayer changes for cheating, lag and bandwidth issues |

## Start your game

1. Create your own repository from this template.
2. Open it in Claude Code and describe your game idea, or run **`/new-game`**. Claude asks about genre, solo vs online and controls, then configures the project and writes your design doc.
3. Build features one at a time with `/feature-workflow`.

3D games: Phaser is 2D only. Swap the client renderer for Babylon.js or Three.js; the rest of the setup still applies (see `docs/GENRES.md`).

## Roadmap ideas
- Genre example branches (platformer, puzzle, card game)
- Client-side prediction and reconciliation for the local player
- Capacitor wrapper for iOS/Android builds
- Interest management (only sync nearby entities)
- Deployment guide for the game server

## License

[MIT](LICENSE)

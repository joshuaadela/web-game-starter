# Web Game Starter

A TypeScript starter for **2D real-time multiplayer games** that run in the browser and on mobile,
set up for building with [Claude Code](https://claude.com/claude-code): project rules, specialist agents and workflow skills are included.

It's aimed at **web developers making their first game**: everything is TypeScript, runs with familiar web tooling, and can be tested end-to-end by Claude.

![stack](https://img.shields.io/badge/Phaser-4-blue) ![stack](https://img.shields.io/badge/Colyseus-0.18-purple) ![stack](https://img.shields.io/badge/TypeScript-7-3178c6) ![stack](https://img.shields.io/badge/Vite-8-646cff)

## What you get

A working "hello multiplayer": open two browser tabs and each player sees the other move, in real time, with the server in charge.

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

Open http://localhost:5173 in two windows and move with **WASD / arrow keys**.
On a phone on the same Wi-Fi, open the `Network:` URL Vite prints and drag on the left half of the screen.

| Command | What it does |
|---|---|
| `npm run dev` | Start server and client with hot reload |
| `npm test` | Unit tests |
| `npm run typecheck` | Type-check all workspaces |
| `npm run build` | Production client build |
| `npm run smoke` | Two bots join and verify state sync (server must be running) |

> npm 11+ may ask you to approve install scripts. `esbuild` and `fsevents` are needed; `msgpackr-extract` is an optional native speed-up and can be skipped.

## Project structure

```
client/    Phaser 4 game: rendering, input, connecting to the server
server/    Colyseus game server: rooms, authoritative simulation
shared/    Constants, input types, pure game logic, network schema (+ tests)
scripts/   smoke-test.ts: headless multiplayer check
docs/      GDD.md: game design document template
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
| `feature-workflow` | Take a feature from spec → code → tests → review → playtest |
| `dev-run` | Start/stop the local game |
| `playtest` | Open two clients in Chrome and verify (needs [Claude in Chrome](https://claude.com/chrome)) |
| `test-build` | Typecheck, tests, build and smoke test, with real output |
| `netcode-review` | Check multiplayer changes for cheating, lag and bandwidth issues |

**Start here:** describe your game idea to Claude and ask it to use the `game-designer` agent to fill in `docs/GDD.md`, then build the first feature with `feature-workflow`.

## Roadmap ideas
- Client-side prediction and reconciliation for the local player
- Capacitor wrapper for iOS/Android builds
- Interest management (only sync nearby entities)
- Deployment guide for the game server

## License

[MIT](LICENSE)

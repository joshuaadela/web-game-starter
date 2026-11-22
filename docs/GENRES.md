# Genre recipes

How to adapt this starter to different kinds of 2D games. The `new-game` skill uses this file.

The starter ships with one example: **top-down movement** that runs **solo** (rules run in the browser)
or **online** (rules run on the Colyseus server). Every recipe keeps the same core ideas:

- Game rules are **pure functions in `shared/`**, with tests.
- The scene talks to a **`GameSession`** (`client/src/session/`), never directly to the network.
- Tuning numbers live in **`shared/src/constants.ts`**.

## First decision: does the game need a server?

| Your game | Modes (`client/src/game.config.ts`) | Server |
|---|---|---|
| Single-player only (platformer, puzzle, roguelike, idle) | `["solo"]` | Not needed to play. Keep `server/` for leaderboards or saves later, or delete it. |
| Multiplayer only (io, arena, party) | `["online"]` | Required, and authoritative |
| Both (solo practice + online) | `["solo", "online"]` | Required for online only |

## Real-time vs turn-based multiplayer

| | Real-time | Turn-based |
|---|---|---|
| Client sends | Inputs every time they change (direction, aim) | Moves/actions (`{ type: "play", cardId }`) |
| Server runs | A fixed-rate tick loop (`setSimulationInterval`) | No tick; validates each move in `onMessage`, then updates state |
| Key rules | Speed and cooldown limits, lag compensation | Is it this player's turn? Is the move legal? Turn timers |
| Hidden info | Only sync nearby entities | Hand cards/secret info via `.view()` fields or `client.send` |

## Recipes

### Top-down action / io / arena (the shipped example)
- Keep everything as is. Add combat, pickups and scoring as pure functions in `shared/`.
- Controls: floating joystick on the left, action buttons on the right; WASD + mouse on desktop.
- Watch: bandwidth as entities grow (interest management), client-side prediction for the local player.

### Platformer
- Usually **solo**. Use Phaser **Arcade Physics** in the client for gravity and collisions.
- Levels: the **Tiled** map editor (JSON tilemaps), loaded with Phaser's tilemap loader.
- Controls: on-screen left/right + jump buttons (not a joystick); arrows/WASD + Space on desktop.
- For online platforming, keep the physics simple and deterministic in `shared/`. Real-time online platformers are hard, so start solo.

### Puzzle (match-3, sliding, logic)
- Solo. Board state and rules (`isValidMove`, `applyMove`, `findMatches`) are pure functions in `shared/`. These are easy to unit test.
- No real-time loop: react to taps/swipes, animate with tweens.
- Controls: tap / swipe / drag. Portrait orientation.
- Online versions (versus, daily leaderboard) reuse the same rules server-side.

### Card / board games (turn-based)
- Online turn-based is a great fit for Colyseus. Remove the tick loop; validate each move in `onMessage`.
- State: deck/hand/board in the schema; **hands must be private** (`.view()` fields).
- Solo version: rules in `shared/` + a simple bot that picks legal moves.
- Controls: tap to select, drag to play. Works in either orientation.

### Tower defense
- Usually solo, optionally co-op online.
- Waves, enemy paths and tower targeting are pure functions in `shared/`, stepped at a fixed tick (see `LocalSession`).
- Paths: a grid + A* pathfinding, or fixed waypoints from Tiled.
- Controls: tap to place/upgrade, pinch/drag camera. Landscape.
- Performance: pool enemies and projectiles; many identical sprites → use atlases.

### Roguelike / dungeon crawler
- Solo. Procedural generation in `shared/` with a **seeded random generator** (same seed → same dungeon; great for tests and daily challenges).
- Turn-based (grid) or real-time (top-down example) movement.
- Save/load: `localStorage` for runs; the server later for cloud saves.

### Strategy / RTS
- Online or solo vs AI. Lots of units → keep sim data compact and deterministic.
- Selection: tap/box-select, drag to command; pinch-zoom camera on mobile.
- Hard genre for a first game; start with a small unit count.

### Idle / clicker / incremental
- Solo. Economy formulas as pure functions in `shared/` (and tested; numbers grow huge, so consider a big-number library).
- Offline progress: store the last-seen timestamp and simulate the elapsed time on return.
- UI-heavy: HTML/CSS over the canvas works well here.

### Party / casual multiplayer (quizzes, drawing, mini-games)
- Online. Rooms with join codes (Colyseus room IDs or a custom code), a lobby, then rounds.
- Mostly turn/round-based; real-time only where needed.
- Controls: big tap targets; portrait; works on any phone.

### Racing (top-down)
- Solo vs AI or online. Car physics (velocity, drift) as pure functions in `shared/`.
- Track from Tiled; checkpoints for lap counting and anti-cheat.
- Controls: steer (left/right buttons or tilt) + accelerate/brake.

## Not covered: 3D
Phaser is 2D only. For a 3D game, replace the `client/` renderer with **Babylon.js** or **Three.js**.
`shared/`, `server/`, the session layer, tests and all agents/skills still apply unchanged.

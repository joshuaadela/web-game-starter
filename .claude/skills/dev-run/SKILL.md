---
name: dev-run
description: Start, stop or restart the local game (Colyseus server + Vite client) for development. Use when asked to run, start or launch the game, or before any playtest.
---

# Run the game locally

1. Use Node 24: always prefix commands with `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null &&` (an older default Node version will break the tooling).
2. Check for anything already running: `lsof -iTCP:2567 -iTCP:5173 -sTCP:LISTEN`. Reuse it if it's healthy, and stop stale ones only if they belong to this project.
3. Start in the background: `npm run dev` (server :2567 + client :5173). For a solo-only game, `npm run dev -w client` is enough. Run it as a background task, not in the foreground.
4. Wait until both are up: the server logs `Game server listening`, and Vite logs `Local:`.
5. Report:
   - Desktop: http://localhost:5173
   - Phone on the same Wi-Fi: the `Network:` URL Vite prints (the client connects to the server on the same host, port 2567).
6. Optional lag simulation: start the server separately with `COLYSEUS_LATENCY=150`.

To stop: kill the background task, or `pkill -f "vite|tsx watch src/index.ts"` (scoped to this project).

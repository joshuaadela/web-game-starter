---
name: playtest
description: Playtest the game in a real browser via Claude in Chrome. Tests solo mode and (if enabled) online mode with two clients, checks movement and sync, reads console errors, and takes screenshots. Use after any gameplay, rendering, UI or networking change, or when asked to "test it", "play it" or "check it works".
---

# Playtest in the browser

Prerequisite: the game is running (use the `dev-run` skill first).

1. Load the `claude-in-chrome` skill and its tools in one ToolSearch call (`tabs_context_mcp`, `tabs_create_mcp`, `navigate`, `computer`, `read_console_messages`, `javascript_tool`, `resize_window`).
2. Check which modes the game has in `client/src/game.config.ts` (`GAME.modes`).
3. **Solo** (if enabled): open a new tab at http://localhost:5173/?mode=solo. Check that the game loads, the player moves, and there are no console errors.
4. **Online** (if enabled): open **two new tabs** at http://localhost:5173/?mode=online (never reuse the user's tabs). In each tab, check:
   - The status text shows `Players: 2` (both clients are in the same room).
   - Console: `read_console_messages` with pattern `error|Error|\[net\]`. There should be no errors.
   - The game is exposed as `window.__game`. Use `javascript_tool` to inspect it when useful, e.g. `__game.loop.actualFps`.
5. **Movement test** (online): focus tab 1, hold `D` for about 1 second (key actions are instant, so dispatch `keydown`, wait, then `keyup` via `javascript_tool`), then screenshot both tabs. Tab 2 must show tab 1's player has moved.
6. **Menu:** open http://localhost:5173 with no `?mode`; the menu shows one button per mode.
7. **Mobile layout:** resize to 390×844 and screenshot. Check the HUD is readable and nothing is clipped. The joystick appears on touch only.
8. Test whatever feature just changed, explicitly.
9. Record a GIF with `gif_creator` if the change is visual and worth reviewing.
10. Report what you saw, with screenshots, plus any console errors. If something failed, say so plainly.

Don't trigger browser alert or confirm dialogs. Close the test tabs when done.

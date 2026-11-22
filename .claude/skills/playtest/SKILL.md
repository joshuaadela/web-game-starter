---
name: playtest
description: Playtest the game in a real browser via Claude in Chrome. Opens two clients, checks they connect, see each other and move, reads console errors, and takes screenshots. Use after any gameplay, rendering, UI or networking change, or when asked to "test it", "play it" or "check it works".
---

# Playtest in the browser

Prerequisite: the game is running (use the `dev-run` skill first).

1. Load the `claude-in-chrome` skill and its tools in one ToolSearch call (`tabs_context_mcp`, `tabs_create_mcp`, `navigate`, `computer`, `read_console_messages`, `javascript_tool`, `resize_window`).
2. Open **two new tabs** at http://localhost:5173 (never reuse the user's tabs).
3. In each tab, check:
   - The status text shows `Players: 2` (both clients are in the same room).
   - Console: `read_console_messages` with pattern `error|Error|\[net\]`. There should be no errors.
   - The game is exposed as `window.__game`. Use `javascript_tool` to inspect it when useful, e.g. `__game.loop.actualFps`.
4. **Movement test:** focus tab 1, hold `D` (or `ArrowRight`) for about 1 second via `computer` key actions, then screenshot both tabs. Tab 2 must show tab 1's player has moved.
5. **Mobile layout:** resize to 390×844 and screenshot. Check the HUD is readable and nothing is clipped. The joystick appears on touch only.
6. Test whatever feature just changed, explicitly.
7. Record a GIF with `gif_creator` if the change is visual and worth reviewing.
8. Report what you saw, with screenshots, plus any console errors. If something failed, say so plainly.

Don't trigger browser alert or confirm dialogs. Close the test tabs when done.

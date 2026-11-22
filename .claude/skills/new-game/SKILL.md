---
name: new-game
description: Adapt this starter template to a specific game. Interviews the user about genre, single/multiplayer, real-time vs turn-based, controls and orientation, then configures the project, fills in the GDD and removes what the game doesn't need. Use when the user says they want to start a new game from this template, describes a game idea for the first time, or asks to set the template up for a genre.
---

# Set up a new game from the template

## 1. Interview (short)
Ask only what isn't already clear, ideally in one `AskUserQuestion` call:
1. **Genre / one-line pitch:** what is the game?
2. **Players:** solo only, online multiplayer only, or both?
3. If online: **real-time or turn-based?** How many players per room?
4. **Platform priority and orientation:** phone portrait, phone landscape, or desktop-first?
5. **Controls:** suggest the default for the genre from `docs/GENRES.md` and confirm.

## 2. Plan
Find the matching recipe in `docs/GENRES.md`. Tell the user in plain language what you'll keep, change and remove, and get a yes before deleting anything.

## 3. Configure
- `client/src/game.config.ts`: `title`, `modes`, `orientation`.
- `package.json` `name`, `client/index.html` `<title>`.
- `docs/GDD.md`: delegate to the `game-designer` agent to write the pitch, pillars, core loop and match structure.
- `CLAUDE.md`: add a short **"This game"** section at the top (genre, modes, real-time/turn-based, controls, orientation) so every future session knows.
- `shared/src/constants.ts`: replace the example values with genre-appropriate ones.

## 4. Trim (only with the user's OK)
- Never remove `.template.json`, `docs/TEMPLATE-NOTES.md` or the `template-feedback` skill; they send improvements back to the template.
- Solo only: remove the online mode from config. Keep `server/` unless the user wants it gone (it's useful later for leaderboards and saves). If removed, also drop the smoke test and the `dev` script's server part.
- Turn-based: replace the tick loop in the room with move validation in `onMessage`; remove the joystick if unused.
- Non-movement games (puzzle, cards, idle): replace the example `GameScene` with a genre-appropriate scene skeleton. Keep the `GameSession` pattern.

## 5. First playable slice
Agree the smallest playable version with the user, then build it with the `feature-workflow` skill.

## 6. Verify
Run `test-build`, then `playtest` (for solo: open `/?mode=solo`). Summarise what changed and what's next.

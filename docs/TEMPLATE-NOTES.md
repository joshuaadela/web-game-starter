# Template notes

Lessons learned while building this game that could improve the **template** this repo was created from
(see `.template.json`). The `template-feedback` skill reads this file and turns entries into a pull request
to the template.

**Add an entry when** something in the template caused friction: a bug in template code, an outdated or
wrong API note, a missing script/tool, a confusing doc, an agent or skill instruction that led Claude astray,
or a genre recipe in `docs/GENRES.md` that turned out wrong or incomplete.

**Don't add** game-specific design or code (that stays in this repo).

Format: newest at the bottom. Status is `open` until sent, then `sent in <PR link>` or `rejected: <reason>`.

<!-- Example:
### 2026-12-01 · Colyseus reconnection not handled in OnlineSession
- **Where:** client/src/session/OnlineSession.ts
- **Problem:** Phone going to background drops the connection; the game shows "Disconnected" forever.
- **Fix used here:** used room.reconnect() with a retry loop (see commit abc1234).
- **Why it's generic:** every online game on mobile hits this.
- **Status:** open
-->

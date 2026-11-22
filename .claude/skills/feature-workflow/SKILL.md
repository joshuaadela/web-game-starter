---
name: feature-workflow
description: The standard end-to-end workflow for adding any new game feature (spec, design doc, implementation, tests, performance and netcode review, playtest). Use whenever the user asks to add or change a gameplay feature, mechanic, item, enemy, UI element or system.
---

# Feature workflow

Keep each feature small enough to finish and playtest in one session. If it's bigger, split it and agree the first slice with the user.

1. **Clarify.** If the request is ambiguous, use `grill-me` (briefly; 2–5 questions max for small features).
2. **Spec.** Delegate to the `game-designer` agent: rules, numbers, edge cases, what must sync, touch controls. It updates `docs/GDD.md`.
3. **Plan the slice.** Decide which files change in `shared/`, `server/` and `client/`. Put new tuning values in `shared/src/constants.ts`.
4. **Implement** (the `gameplay-engineer` agent, or directly):
   - shared: pure logic + Vitest tests first
   - server: wire it into the room tick and message handlers, with validation
   - client: render the state and send inputs
   - UI and touch: follow the `ui-touch` principles
5. **Review** in parallel where relevant:
   - networking changed → `netcode-review` skill / `netcode-engineer` agent
   - rendering or update loop changed → `mobile-perf` agent
6. **Verify:** the `test-build` skill (typecheck, tests, build, smoke test).
7. **Playtest:** the `playtest` skill, with screenshots.
8. **Summarise** for the user in plain language: what changed, how to try it, known limitations, and the suggested next slice. Offer to commit.

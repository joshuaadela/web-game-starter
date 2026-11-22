---
name: test-build
description: Run the full verification pipeline (typecheck, unit tests, production build, multiplayer smoke test) and report real results. Use before declaring any task done, before commits, and when asked "does it work?".
---

# Full verification

Run each step with Node 24 (`source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null && ...`). Stop at the first failure, fix it, and re-run from the top.

1. `npm run typecheck`
2. `npm test`
3. `npm run build`, then note the bundle size from the output (budget: < 5 MB gzipped total).
4. Multiplayer smoke test:
   - Start a throwaway server on a spare port in the background: `PORT=2599 npx tsx server/src/index.ts`
   - `npx tsx scripts/smoke-test.ts ws://localhost:2599` must print `SMOKE TEST PASSED`
   - Stop that server afterwards.
5. If the change was visual or interactive, also run the `playtest` skill.

Report a short table of step → pass/fail → key output line. Never say "should work". Paste the evidence.

## Mobile builds (once Capacitor is added)
- `npm run build && npx cap sync` in `client/`
- Android: `npx cap run android` (needs Android Studio)
- iOS: `npx cap run ios` (needs Xcode)

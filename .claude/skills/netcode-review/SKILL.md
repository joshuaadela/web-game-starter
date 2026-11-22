---
name: netcode-review
description: Review a change for multiplayer correctness, cheating, bandwidth and lag behaviour. Use whenever server/, shared/src/schema.ts, shared/src/input.ts or network messages change, and before merging any multiplayer feature.
---

# Netcode review

Look at the diff (`git diff`, or the files just changed). For each new or changed message, schema field, or server behaviour, answer:

## Authority & cheating
- [ ] Does the client send only *intent* (inputs or requests), never outcomes?
- [ ] Is every message validated on the server (shape, types, ranges, rate limit, game legality)?
- [ ] Could a modified client gain speed, range, damage, resources or vision with this?

## State & bandwidth
- [ ] Is every new schema field needed by *other* clients? Private data belongs in a `.view()` field or a direct `client.send`.
- [ ] Are values as small as possible (integers, quantised floats, enums as numbers)?
- [ ] Estimate: bytes per update × patch rate (20/s) × visible entities. Is that OK at 50 players?

## Feel & robustness
- [ ] How does it behave at 150–200 ms latency? Test with `COLYSEUS_LATENCY=150`.
- [ ] Is your own player's action predicted locally if it needs to feel instant?
- [ ] Join, leave or reconnect mid-action: no orphaned state, no crash.
- [ ] Is simulation logic in `shared/` as a pure function with tests?

## Output
Findings ranked blocker → should-fix → nit, each with file:line and a concrete fix. If the change touched networking, run the smoke test from `test-build`.

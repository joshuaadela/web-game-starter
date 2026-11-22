---
name: template-feedback
description: Review all changes made in a game repo created from the web-game-starter template, extract generic improvements (bug fixes, tooling, docs, agents/skills, genre recipe lessons) from git history and docs/TEMPLATE-NOTES.md, and open a pull request to the template for the developer's approval. Use when the user asks to send improvements back to the template, review the project for template improvements, or "upstream" changes.
---

# Send improvements back to the template

Goal: turn lessons from this game repo into a **pull request on the template repo**. The developer reviews and approves it there. Never push to the template's `main`, and never merge.

## 0. Preconditions
- Read `.template.json` → `templateRepo` (e.g. `owner/web-game-starter`).
- If the current repo **is** the template (`gh repo view --json nameWithOwner` equals `templateRepo`), stop: this skill runs in game repos.
- `gh auth status` must succeed. If not, ask the user to run `! gh auth login`.

## 1. Find the starting point
The game repo's first commit is a snapshot of the template. Find which template commit it came from:
```bash
WORK=<scratchpad>/template-feedback && mkdir -p "$WORK"
gh repo clone <templateRepo> "$WORK/template" -- -q
ROOT=$(git rev-list --max-parents=0 HEAD | tail -1)
ROOT_TREE=$(git rev-parse "$ROOT^{tree}")
git -C "$WORK/template" log --format='%H %T' | awk -v t="$ROOT_TREE" '$2==t{print $1; exit}'   # → BASE (template commit)
```
If there's no exact match, use the template commit closest in date to `$ROOT` and say so.

## 2. Gather everything
- `docs/TEMPLATE-NOTES.md`: all entries with status `open`. These are the highest-signal input.
- `git log --reverse --format='%h %ad %s' --date=short $ROOT..HEAD`: every change since creation.
- `git diff $ROOT..HEAD --stat`, then read diffs for **template-owned paths**:
  `.claude/`, `CLAUDE.md`, `docs/GENRES.md`, `scripts/`, `client/src/session/`, `client/src/input/`, `client/src/main.ts`, `client/src/scenes/MenuScene.ts`, `client/vite.config.ts`, `server/src/index.ts`, `shared/src/input.ts`, `package.json` files (scripts, deps, engines), `tsconfig*.json`, `vitest.config.ts`, `.gitignore`, `.github/`.
- Also skim game-specific paths for **patterns** that would help every game (e.g. a reconnection helper, an object pool, a test utility), but only propose the generic part.
- Check whether the template has moved on since BASE (`git -C "$WORK/template" log BASE..main`) so you don't propose things already fixed.

## 3. Classify
For each candidate decide:
| Bucket | Examples | Action |
|---|---|---|
| **Generic fix** | Bug in session layer, smoke test flakiness, wrong API note in an agent | Propose |
| **Generic improvement** | Better skill steps, new helper, dependency upgrade that fixed problems, new/updated genre recipe | Propose |
| **Game-specific** | Gameplay rules, constants values, art, GDD, scenes for this game | Skip |
| **Unsure** | Could go either way | Ask the user |

Rewrite proposals so they contain **no game-specific names, design details, or private information**. The template is public; this game repo may be private.

## 4. Confirm with the user (required)
Show a numbered list: title → what & why → source (note / commit) → files in the template. Ask which to include (AskUserQuestion, multiSelect). Opening a PR on a public repo is outward-facing, so do nothing further without an explicit selection.

## 5. Apply to the template on a branch
```bash
cd "$WORK/template"
git checkout -b improve/<game-repo-name>-<YYYY-MM-DD>
```
- Re-implement each selected change against the template's **current** `main`: adapt, don't blindly copy diffs.
- Keep it minimal: one PR, small and focused commits (one per improvement).
- Verify with Node 24: `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, plus the smoke test (`PORT=2599 npx tsx server/src/index.ts` in the background, then `npm run smoke -- ws://localhost:2599`). All must pass. Fix or drop an item rather than send a failing PR.
- Final scan of the diff for secrets, local paths, emails and game-specific content.

## 6. Open the pull request
```bash
git push -u origin HEAD
gh pr create --repo <templateRepo> --base main --title "<short summary>" --body-file <body.md>
```
Fill the body using `.github/pull_request_template.md` from the template: improvements list, source (game repo name, notes, commits), evidence (check output), and anything the reviewer should test manually. Do not request merge or auto-merge.

## 7. Close the loop
- In this game repo, update each sent note in `docs/TEMPLATE-NOTES.md`: `Status: sent in <PR URL>`. Commit that change locally (ask before pushing).
- Report the PR URL to the user and remind them they approve and merge it on GitHub. CI runs the checks automatically.
- Remove `$WORK`.

## Pulling template updates into a game (reverse direction)
If the user wants a merged template improvement in this game too: add the template as a remote (`git remote add template https://github.com/<templateRepo>.git`), fetch, and cherry-pick the merged commits. Resolve conflicts carefully, since game code has diverged.

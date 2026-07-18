# ae49-task-integrate — operations

> Full step-by-step for each operation of `ae49-task-integrate`. The orchestrator
> (intro, two-windows split, argument table, Placeholders, Preflights, Notes) stays in
> SKILL.md; read this file when you actually run an operation. The placeholders
> (`<hub>`, `<buildN>`, `<repo>`, `<slug>`, `<prefix>/<slug>`) and the Preflights are
> defined in SKILL.md.

## Operation: `init` (one-time pool creation / top-up)

Create the 4 build clones if they don't exist. Safe to re-run — it only makes missing ones.

For each N in 1..4, if `<parent>\<hubname>-buildN` does **not** exist:
```powershell
$N = 1                 # 1..4 — repeat per missing folder
$port = 3000 + $N      # computed OUTSIDE the here-string; bash-style $((3000 + N)) inside it is a PowerShell parse error
gh repo clone <owner>/<repo> "<parent>\<hubname>-build$N"
Copy-Item "<hub>\.env.local" "<parent>\<hubname>-build$N\.env.local"
npm ci --prefix "<parent>\<hubname>-build$N"
# dev.cmd — mirror the hub's proven .claude\dev.cmd (Node on PATH) + this folder's port:
Set-Content -Path "<parent>\<hubname>-build$N\dev.cmd" -Encoding ascii -Value @"
@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
call npm run dev -- -p $port
"@
# exclude dev.cmd locally so it never dirties `git status` (the claimable-check needs a clean status):
Add-Content "<parent>\<hubname>-build$N\.git\info\exclude" "dev.cmd"
```
(Clones from GitHub so `origin` is correct. `npm ci` is a real install — do NOT junction
`node_modules`; Turbopack rejects a junction that points outside the project root. `dev.cmd`
is excluded per-clone because a fresh clone doesn't inherit the hub's local exclude.) Then
tell the user: 4 build windows can now stay open, one per folder, each on its own port.

---

## Operation: `board` (default)

1. **Fetch:** `git -C "<hub>" fetch origin --prune`.
2. **Plans:** scan `<hub>\docs\plans\*.md` (non-recursive; `done/` excluded) for slug + `**Status:**` + `**Branch:**`.
3. **Pool:** for each existing `<buildN>` read its branch (`git -C "<buildN>" rev-parse --abbrev-ref HEAD`),
   clean/unpushed state, and port. Classify each folder:
   - **Free** — on `main`, clean → ready to claim.
   - **Building `<branch>`** — on a `(feature|bugfix|refactor)/*` branch whose PR is still
     open or not yet opened → busy (show its `http://localhost:300N`).
   - **Reusable** — on a `(feature|bugfix|refactor)/*` branch whose PR is merged/closed,
     clean → claimable (will re-sync on claim). *(All three prefixes count everywhere —
     `feature/*` alone would strand bugfix/refactor folders in no state.)*
   - Missing folder → note "run `init` to recreate".
4. **PRs:** `gh pr list --repo <owner>/<repo> --state open --json number,headRefName,labels,statusCheckRollup`
   (+ `--state merged --limit 10` for the doctor pass).
5. **Board state per plan:** Ready (plan, no branch) · In progress (remote branch, no PR) ·
   Ready to merge (open PR, no `blocked` label, CI shown) · Blocked (open PR with `blocked`) ·
   Done (plan in `done/`). A plan whose `Branch:` is the bare `—` and whose Status reads
   `In progress`/`On hold` is being built **directly on main** — show it as "In progress
   (direct on main)", not Ready. *Planning* (uncommitted plan) is intentionally invisible.
6. **Derive the build chains** from every undone plan's `**After:**` field (blank/`—`/missing
   = no deps = a root). Everything here is derived live — nothing is stored but the edges:
   - **Chain (letter)** = a connected group of plans linked by `**After:**` edges. Separate
     groups are independent and build fully in parallel. Label them A, B, C… for display.
   - **Level (number)** = longest dependency depth: a root = 1; any other plan =
     `1 + max(level of its still-undone `After` predecessors)`. A predecessor that is
     Done / cancelled / missing counts as **satisfied** (it no longer gates — treat as level 0).
   - **Sibling (`.1/.2`)** = plans at the same level in the same chain. Because *every* file
     overlap is an `After:` edge, same-level plans provably share no file → parallel-safe.
     Order them by `**Created:**` (earliest = `.1`), tiebreak slug-alphabetical.
   - **Readiness:** **Ready** = no `After:` predecessor is still in the undone set
     (Ready / In progress / On hold); otherwise **Waiting on <those predecessors>**. A plan
     that already has a branch/PR is **Already building** regardless of its `After:`.
7. **Doctor pass:** merged PR but remote branch survives → offer branch delete; merged PR but
   plan still in `docs/plans/` → offer archive; build folder stuck dirty → surface it;
   **hub not on `main`** (e.g. parked on `_merge_preview` after a mid-merge crash — `:3000`
   is then silently serving preview content) → offer `git -C "<hub>" checkout main` +
   `git -C "<hub>" branch -D _merge_preview`.
8. **Print** the pool (folder → port → state), then the plans **grouped by chain** —
   `A1 → A2 → A3.1 / A3.2 → …`, each with its readiness (Ready / Waiting on X / Already
   building) and CI — then the doctor flags (or "no doctor flags"). Advisory — always fetches
   first; `merge` re-checks live.

---

## Operation: `setup [<plan-slug>]`

Claim a free build folder for a plan and get it ready for a branch session.

**0. No slug given → plan-status summary, then the picker (the normal entry point).**

**0a. Report a plan-status summary FIRST.** Every `setup` call opens with a short,
**plan-lifecycle-only** readout — Ready / In progress / On hold. This is deliberately *not*
the `board`: **no PR numbers, no CI, no build-folder/port/pool detail** (use `board` for
those). Scan every undone `docs\plans\*.md` (`done/` excluded) plus the `After:`-chain
readiness (board steps 2, 4, 6), and bucket each plan by its lifecycle status:
- **Ready** — plan `**Status:** Ready`, every `After:` predecessor resolved, `Branch:` is
  **not** the bare `—`, and no branch exists for it yet. The buildable-now plans → these become
  the buttons in 0b.
- **In progress (building)** — a branch already exists for the plan (one
  `git ls-remote --heads origin <prefix>/<slug>` hit). **Derived from branch existence** — a
  building plan's file still reads `Status: Ready`, because the plan file is never flipped to
  In progress (only `main` flips a plan's Status, and only to `Done`, after the merge). This is
  the *only* git/GitHub the summary touches — no PR or folder lookups.
- **On hold** — plan `**Status:** On hold` (and no branch yet).
- *(Mentioned, never offered:* **Waiting** = Status Ready but an `After:` predecessor still
  undone → name the predecessor it needs; **Direct-on-main** = `Branch: —`, a tiny cosmetic
  fix that lands on `main`, not a folder build.)*

Print it as a **table**, one row per bucket (Status · Count · Plans) — not a plain sentence.
Empty buckets show `0` / `—`. Example:

| Status | Count | Plans |
|---|---|---|
| 🟢 Ready | 2 | a · b |
| 🔨 In progress | 3 | c · d · e |
| ⏸️ On hold | 0 | — |
| ⏳ Waiting | 1 | f → needs g |

**0b. Then auto-offer the Ready plans as next-action buttons.** ≤4 Ready → `AskUserQuestion`,
one option per Ready plan (most-unblocking — the one gating the most others — first); >4 → a
numbered list the user types (mirror implement-feature's picker). After the pick, drop into
step 1 with the chosen slug — the folder is auto-claimed (step 2); the user never picks the
folder. **Zero Ready** → say so and name the blocker (the Waiting plans' predecessors, or
"all folders busy — merge one first"). A **Waiting** plan may still be started early only with
an explicit **`--force`** (see step 1b): "its predecessor ‹X› isn't merged, so its changes
won't be in your branch — start early anyway?"

1. **Resolve the branch:** from the plan's `**Branch:**` field in `<hub>\docs\plans\<slug>.md`.
   If the field is a bare `—`, **STOP** — the plan declares itself direct-on-main (tiny fix /
   bootstrap), so a build folder is the wrong route; don't silently convert it to a PR build.
   The `feature/<slug>` fallback applies only when the field is **missing** (pre-template
   plans). If `<prefix>/<slug>` already exists on `origin`, STOP — it's already being built;
   point at the folder that's on it.
1b. **Chain gate.** Read this plan's `**After:**`. If any listed predecessor is still in the
   undone set (Ready / In progress / On hold — i.e. not merged/cancelled/gone), **STOP:**
   "‹slug› waits on ‹pred› (‹state›) — merge that first." Building now would branch off an
   `origin/main` that lacks the predecessor's changes, guaranteeing the conflict the chain
   exists to prevent. Override only with an explicit **`--force`** (you accept the branch
   won't contain the predecessor's changes and you'll rebase/resolve later).
2. **Pick a claimable folder** (see Folder-claimable preflight). If all 4 are Building, STOP:
   "all 4 build folders are busy — merge or abandon one first, or `init` won't help (pool is
   capped at 4)."
3. **Sync + branch + publish (off fresh `origin/main`):**
   ```powershell
   git -C "<buildN>" fetch origin --prune
   git -C "<buildN>" checkout -B "<prefix>/<slug>" origin/main
   git -C "<buildN>" push -u origin "<prefix>/<slug>"
   ```
   `-B` resets the folder to `origin/main` and creates the branch; the clean precondition
   means nothing is lost. The immediate `push -u` **publishes the branch from minute one**,
   so the board shows *In progress* right away and a second `setup` of the same plan is
   refused — without it the whole build is invisible until the branch session's first
   commit. **Re-copy env** (secrets may have changed):
   `Copy-Item "<hub>\.env.local" "<buildN>\.env.local" -Force`.
4. **Deps:** only if the plan's `## Files to touch` includes `package.json`/lockfile, run
   `npm ci --prefix "<buildN>"`. Otherwise the existing `node_modules` is reused as-is.
5. **Hand off** (plain words): use the **build`N`** window (folder `<buildN>`); run
   `/ae49-task-implement-feature`, pick this plan; dev = `.\dev.cmd` on `http://localhost:300N`.
   That session builds, pushes the branch, opens the PR — then come back and run
   `/ae49-task-integrate merge <PR#>`.

---

## Operation: `merge <PR#>` (one PR at a time — NEVER batch)

Land one feature, testing the **squashed result on the hub's `:3000` before anything deploys.**

1. **Preflight** (Hub-clean, incl. the no-unpushed-main check). `git -C "<hub>" fetch origin
   --prune`. Identify the PR + its head branch `<prefix>/<slug>`. **Re-entrancy:** if the PR
   is ALREADY merged (a previous run crashed mid-tail), skip a–g and resume from h → i — each
   tail step is safely re-runnable. **Auto-fix re-entry:** if a dispatch is in flight —
   `<buildN>/.review/pr-<PR#>.results.json` exists — handle it per **[AUTOFIX.md](AUTOFIX.md)**
   step c-4 (read the outcomes, STOP on any `needs-human`, else re-review the fix diff) before
   Phase 1.
- **a. Clear a stale `blocked` label.** If the PR carries `blocked` from an earlier halt and
  the cause is fixed, remove it now:
  `gh pr edit <PR#> --repo <owner>/<repo> --remove-label blocked`.
  (Steps below only ADD the label — this is the one place it comes off.)
- **b. CI green.** `gh pr checks <PR#> --repo <owner>/<repo>` must pass. Red → fix or add `blocked` label, STOP.
- **c. Review.** Run `/code-review` on the PR (findings as PR comments). Blockers → `gh pr edit <PR#> --repo <owner>/<repo> --add-label blocked`. Then, when fixable findings remain, **optionally run the auto-fix loop → [AUTOFIX.md](AUTOFIX.md)**: emit a structured `findings.json`, classify each finding `auto | decision | wontfix`, and offer (opt-in — **never default**) to dispatch the `auto` fixes to the branch's build folder, where a `/ae49-task-implement-feature --from-review` session implements + pushes them. `decision` findings always stay with the user and keep the PR blocked. If the user declines dispatch, STOP for manual fix-forward as today. The loop re-enters at step f — it **never skips the preview or your confirmation**.
- **d. Unexpected files.** `gh pr diff <PR#> --repo <owner>/<repo> --name-only` vs the plan's `## Files to touch` — surface extras.
- **e. Conflict / duplication.** Files overlap another open PR → explain, list options, user decides order; skim other PRs for same-functionality duplication.
- **f. Phase 1 — preview the squashed result on `:3000` (NO deploy):**
  ```powershell
  git -C "<hub>" fetch origin --prune   # REFRESH the branch ref first — a fix-forward force-push moves origin/<branch>; without this re-fetch, a re-gate squashes the STALE local ref and serves old code (verified bite)
  git -C "<hub>" checkout -B _merge_preview origin/main
  git -C "<hub>" merge --squash "origin/<prefix>/<slug>"
  git -C "<hub>" commit -m "preview: <slug>"
  ```
  **If the squash merge reports conflicts:** undo the half-merge with
  `git -C "<hub>" reset --merge` (a conflicted `--squash` has no `MERGE_HEAD`, so
  `merge --abort` won't work), then `checkout main` + `branch -D _merge_preview`, add the
  `blocked` label, STOP. Conflicts are resolved by the branch session in ITS build folder
  (`git pull --rebase origin main`, fix, push, CI re-runs) — never on the hub — then `merge`
  is re-run.
  **If the PR changes `package.json`/lockfile:** run `npm ci` in the hub before judging the
  preview, and again after returning to `main` (either path), so `node_modules` always
  matches the checked-out tree.
  The hub's dev server on **http://localhost:3000** (HMR) now shows `main` + this feature. Ask
  the USER to check `:3000` (start the hub dev server first if it isn't running) and **WAIT for
  explicit confirmation** — never self-certify. Nothing has been pushed or deployed yet.
  (If they find a problem: fix-forward or abandon — see step j.)
- **g. Phase 2 — on the user's OK, do the real merge (this deploys):**
  ```powershell
  git -C "<hub>" fetch origin main    # base re-check — see below
  git -C "<hub>" checkout main
  git -C "<hub>" branch -D _merge_preview
  gh pr merge <PR#> --repo <owner>/<repo> --squash    # deploys; auto-closes PR + auto-deletes branch
  git -C "<hub>" pull --ff-only
  ```
  **Base re-check:** if the fetch shows `origin/main` MOVED since Phase 1 (a plan push or a
  tiny fix landed meanwhile), the deployed tree would no longer equal the previewed one —
  redo Phase 1 on the new base instead of merging blind. Only when the base is unchanged is
  the deployed tree identical to the preview. Use `pull --ff-only`, never bare `git pull`.
- **h. Post-merge sanity.** `npx tsc --noEmit` in `<hub>` green; App Hosting rollout healthy.
  **If tsc errors ONLY in `.next/` generated files** (e.g. `.next/dev/types/… routes.d.ts is
  not a module`), that's the hub's stale Next type cache from branch-switching — NOT a code
  error (CI already type-checked the branch fresh). Clear it and re-run:
  `rm -rf .next/dev/types .next/types; git checkout -- next-env.d.ts; npx tsc --noEmit`.
  Only an error in a **source** file (outside `.next/`) is a real problem.
- **i. Archive the plan.** Status → `Done`, then:
  ```powershell
  New-Item -ItemType Directory -Force "<hub>\docs\plans\done" | Out-Null
  git -C "<hub>" mv "docs/plans/<slug>.md" "docs/plans/done/<slug>.md"
  git -C "<hub>" add "docs/plans/done/<slug>.md"   # git mv stages the PRE-edit blob — re-add or the archive commits a stale Status
  ```
  One commit, push (doc-only deploy — harmless). Verify the committed blob really says `Done`:
  `git -C "<hub>" show "HEAD:docs/plans/done/<slug>.md" | Select-String "Status"`.
- **j. Bad path (user finds a problem at Phase 1):** **nothing was deployed** — undo the
  preview:
  ```powershell
  git -C "<hub>" checkout main
  git -C "<hub>" branch -D _merge_preview
  ```
  (Plus `npm ci` in the hub if step f installed the PR's deps.) Add the `blocked` label.
  Then either **fix-forward** (the branch session fixes on `<prefix>/<slug>` + updates the
  PR → re-run `merge`, which clears the label at step a) or `abandon <slug>`.
- **k. No folder cleanup + reminder.** The build folder stays; it becomes claimable again
  once its PR is merged/closed, and `setup` re-syncs it next time. (After a merge, its
  remote branch is auto-deleted; the local branch is harmless and gets replaced on the next
  `checkout -B`.) Remind the user (plain words): the Phase-2 push deployed to the live
  site. If a problem surfaces later, use the **Rollback recipe** in `CLAUDE.md` (App Hosting
  console rollback → `git revert <squash-sha>` on main + push; never `reset --hard` /
  force-push `main`).
- **l. Post-merge status recap + next actions (ALWAYS run before ending the turn).** The land
  is done — leave the user with a live picture and their next move; **never report it from
  memory.** Re-derive LIGHT + LIVE:
  - `git -C "<hub>" fetch origin --prune`, then `gh pr list --repo <owner>/<repo> --state
    open --json number,headRefName,labels,statusCheckRollup` — **every** open PR, classified
    **Ready-to-merge** (CI green + no `blocked`) vs **Blocked**.
  - The **pool** — each `<buildN>` as Free / Building `<branch>` / Reusable (board step 3).
  - The **queue** — undone plans whose `**After:**` deps are all satisfied = **Ready**, else
    **Waiting on X** (board steps 5–6); include `Branch: —` direct-on-main Ready plans.

  **Report** (emoji summary): `✅ Merged <slug> (<squash-sha>) — App Hosting rollout in
  progress`, then **Status:** — **ALL** open PRs (number · branch · CI · ready/blocked), the
  pool line (folder → port → state), and the queue (Ready now / Waiting on X). Point at the
  live app URL (memory `ae49hub-app-hosting-url`) so the user can eyeball the rollout health.

  **Then auto-offer the next move as BUTTONS via `AskUserQuestion`** (not prose-only): one
  option per Ready-to-merge PR (`merge #N — <branch>`), one to set up the top Ready plan
  (`setup <slug>`, or `pick a plan` → the setup picker), a `full board` option, and ALWAYS a
  `Nothing — done for now` escape (a batch-merger must be able to bow out). Cap at 4 (the
  question limit) — surface most-actionable first (ready PRs → a setup → board/done); the
  text **Status** above still lists EVERYTHING, the buttons are just the shortcuts. Honor the
  pick by entering that operation (`merge <PR#>` re-enters this flow from step 1; `setup`
  runs its own). If nothing is open and no plan is Ready, skip the buttons — say the queue is
  empty and suggest `board` or planning a feature.

---

## Operation: `abandon <slug>`

Cancel a feature and free its build folder — without deleting the folder.

1. **Preflight** (Hub-clean).
2. **Close the PR** if open: `gh pr close <PR#> --repo <owner>/<repo>`.
3. **Print the branch head SHA** first (recoverable from the reflog ~90 days); warn about any
   un-pushed commits in the folder that's on `<prefix>/<slug>`.
4. **Free the folder, then delete the branch.** In the folder that's on the branch — after
   the step-3 SHA report/warning, and only with the user's explicit OK if anything is
   uncommitted or unpushed (this discards it):
   ```powershell
   git -C "<buildN>" reset --hard                    # drop uncommitted edits
   git -C "<buildN>" clean -fd                       # drop untracked leftovers (dev.cmd survives — it's ignored via .git\info\exclude, and clean -fd skips ignored files)
   git -C "<buildN>" checkout -B main origin/main    # folder back to Free
   git -C "<buildN>" branch -D "<prefix>/<slug>"
   ```
   Without the reset/clean, an abandoned in-progress folder stays dirty and therefore
   permanently unclaimable by the setup preflight. Then delete the remote branch:
   `git -C "<hub>" push origin --delete "<prefix>/<slug>"` (treat "remote ref does not
   exist" as success — auto-delete may have raced).
5. **Dependents check, then leave the plan.** First scan every undone plan for this slug in
   its `**After:**` — those plans depend on this one. Then decide how to leave THIS plan:
   - **No dependents →** it may stay `Ready` in `docs/plans/` for a rebuild, or be archived
     to `done/` with a `Cancelled` note. Ask the user.
   - **Has dependents →** it may **NOT** stay `Ready` (a lingering `Ready` predecessor would
     block them forever). Name the dependents, then archive this plan to `done/` with a
     `Cancelled` note (or delete it) — either exits the undone set and **unblocks** them
     (their `After:` edge becomes satisfied; a cancelled predecessor's changes never landed,
     so there's nothing left to conflict with).

---


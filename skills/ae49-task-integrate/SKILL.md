---
name: ae49-task-integrate
description: >
  The Main Session control room for the multi-session workflow, built on a STANDING
  POOL of 4 reusable clone folders (<hubname>-build1..4, ports 3001-3004) that are never
  deleted. One command, five operations (argument-selected, default `board`): show a
  live status board of the pool + plans + PRs; one-time `init` to create the 4 clones;
  `setup <plan>` to claim a free build folder, sync it to main and branch it; `merge
  <PR#>` for the gated land — which previews the squashed result on the hub's
  localhost:3000 and only deploys after you confirm; and `abandon <slug>` to close a PR
  and free its folder. Use in the ONE Main Session (hub folder on main) for the feature
  board/status, to set up or start a branch for a plan, to merge/integrate a PR, to
  review-and-land a finished feature, or to abandon/cancel one. Run exactly one Main Session.
---

# Integrate — the Main Session control room

Runs in the hub folder (the original clone, `git rev-parse --show-toplevel`) on `main`, port
**3000**. It is the control room that sets up build folders, reviews, gates, merges, archives
plans, and reconciles PRs. By default a **single** window does all of it, one operation at a
time — but the hub may optionally be split across **two** windows (a Merge Session + a
Setup Session); see **Two windows** just below.

The workflow uses a **standing pool of 4 clone folders** — `<hubname>-build1..4` — each an
**independent `git clone`** of the repo with its own `node_modules` and `.env.local`, on
ports **3001–3004**. They are **never deleted**: a finished folder is re-synced to `main`
and reused. (Separate clones — not git worktrees — because worktrees share one `.git`,
which collides with the desktop app's own worktree feature, breaks Turbopack via a
`node_modules` junction, and file-locks on teardown. Clones have none of those problems.)

## Two windows: a Merge Session + an optional Setup Session

`merge` is the ONE operation that takes over the hub — it flips the hub's working branch to
`_merge_preview` while you eyeball `:3000`, and that **manual test can run long**. So you may
split the control room across **two** hub windows so setup work doesn't stall behind a merge:

- **Merge Session (exactly one)** — the hub window that runs `merge`. While its Phase-1
  preview is parked on `:3000`, the hub sits on `_merge_preview` and nothing else may commit
  in the hub. It also owns `board` and `abandon`.
- **Setup Session (optional, one)** — a second hub window that runs **only** `setup` (and the
  one-time `init`), so you can keep claiming folders and kicking off new builds while a merge
  preview is being tested. It **never** runs `merge`.

**Why the Setup Session is safe next to a live merge:** `setup` never commits to or switches
the hub's working branch, and it always branches the build folder off **`origin/main`** (the
remote ref) — not the hub's checkout — so it produces a correct branch even while the hub is
parked on `_merge_preview`. `.env.local` is gitignored, so the copy is unaffected by the flip.
Setup's picker also runs only board steps 2/4/5/6, **never the step-7 doctor pass**, so it can
never offer to reset the hub off `_merge_preview`.

**Hard rules for the split:**
- **Only the Merge Session ever runs `merge`.** Two `merge` at once corrupts the gate.
- **The Setup Session runs `setup`/`init` only — never `merge`, never a commit in the hub**
  (the same "don't commit in the hub mid-merge" rule that binds plan sessions).
- **Keep `board` and `abandon` in the Merge Session** — or run them only when no merge is
  parked. `board`'s step-7 doctor pass, seeing the hub on `_merge_preview`, offers to
  `checkout main` + delete `_merge_preview`, which would **kill the live preview**.
- Two windows firing `git … fetch` on the hub at the same instant can hit a transient `.git`
  `index.lock` error — harmless, just re-run.

Running a single control room? Ignore this — one window does everything, one op at a time.

**Argument selects the operation** (default `board`):

| Argument | Operation |
|---|---|
| *(none)* / `board` | Live status board of the pool + plans + PRs + doctor pass |
| `init` | One-time: create the 4 clone folders (or top the pool back up to 4) |
| `setup [<plan-slug>]` | Claim a free folder + branch it (no slug → chain-aware picker) |
| `merge <PR#>` | Gated land: preview on `:3000`, then deploy only after you confirm |
| `abandon <slug>` | Close the PR, delete the branch, free the folder |

## Placeholders

- `<hub>` — the Main Session's clone root (`git rev-parse --show-toplevel`), on `main`, `:3000`.
  Example — `C:\Users\<you>\Documents\<hubname>`.
- `<parent>` — the folder that contains `<hub>` (e.g. `C:\Users\<you>\Documents`).
- `<hubname>` — the hub folder's basename (e.g. `myapp`).
- `<buildN>` — a pool folder `<parent>\<hubname>-buildN` (N = 1..4), port `3000 + N`.
- `<slug>` — a plan's slug (its `docs/plans/` filename without `.md`).
- `<prefix>/<slug>` — the branch; `<prefix>` ∈ `feature|bugfix|refactor`, from the plan's
  `**Branch:**` field (fallback `feature/<slug>`).
- `<repo>` — the GitHub repo the `gh` commands target, in `owner/name` form. Written as
  `<owner>/<repo>` throughout for this hub; **change this one value for another project**
  (or drop the `--repo` flag entirely — `gh` then defaults to the current folder's `origin`).
  It's the only project-specific value here; everything else derives from the folder.

## Preflights (hard rules)

- **Hub-clean (merge / abandon):** `git -C "<hub>" status --porcelain` non-empty → **ABORT**
  ("the hub has uncommitted changes — resolve/stash before integrating"). These operations
  commit or branch-switch on the hub. For `merge`, ALSO require no unpushed commits on the
  hub's `main` (after the fetch, `git -C "<hub>" log origin/main..main --oneline` must be
  empty) — an unpushed tiny-fix commit would be missing from the preview, and Phase 2's
  `pull --ff-only` would fail AFTER the deploy already happened. Push or remove it first.
- **Folder-claimable (setup):** a `<buildN>` is claimable only if ALL of:
  1. its working tree is clean (`git -C "<buildN>" status --porcelain` empty), **and**
  2. it's on `main` (never held a branch), **or** a **merged/closed PR actually exists** for
     its branch — `gh pr list --repo <owner>/<repo> --head "<prefix>/<slug>" --state all
     --json number,state` must return **≥1 PR with none `OPEN`**. **A branch with NO PR in any
     state is NOT claimable** — that's a build that was just set up and hasn't opened its PR
     yet (the board shows it "Building — PR not yet opened"); recycling it would reset the
     folder and wipe a live build. (Testing only that `--state open` is empty is WRONG — an
     about-to-start build also has no open PR, so "no open PR" ≠ "the work landed". A crashed
     no-PR build is freed with `abandon`, which returns the folder to `main` → then the
     on-`main` branch of this rule makes it claimable.) **and**
  3. nothing unpushed: if the branch still has an upstream, `git -C "<buildN>" log
     "@{u}..HEAD" --oneline` must be empty. **If `@{u}` no longer resolves, that is NOT a
     failure** — it's the normal recycled state (after a squash-merge GitHub auto-deletes
     the remote branch, killing the upstream); condition 2's merged/closed PR already
     proves the work landed.
  A folder whose branch has an **open PR** is NOT claimable even when clean and pushed —
  that PR may still need fix-forward work done in this folder.
- Never report the board from memory — always fetch and derive live.

---

## Operations

Each operation's full step-by-step lives in **[OPERATIONS.md](OPERATIONS.md)** — read it when
you run one. Quick map (argument selects the operation, default `board`):

- **`init`** — one-time: create / top-up the 4-clone pool.
- **`board`** — live status board of pool + plans + PRs + doctor pass.
- **`setup [<slug>]`** — claim a free folder, sync it to `origin/main`, branch + publish it.
- **`merge <PR#>`** — gated land: CI + review → preview the squash on `:3000` → deploy only on
  your OK → archive the plan. After review it can **optionally auto-fix** — dispatch the
  mechanical findings to the branch's build folder for a `--from-review` build session, then
  re-enter at the preview (opt-in, never skips a gate) → **[AUTOFIX.md](AUTOFIX.md)**.
- **`abandon <slug>`** — close the PR, free the folder, delete the branch, leave or archive the plan.

The argument table and Preflights above bind every operation; OPERATIONS.md has the exact commands.

## Notes

- **Folders are never deleted** — the whole teardown/junction/file-lock class of problems is
  designed out. A folder is recycled by `checkout -B <branch> origin/main`, which re-syncs it.
- **One PR at a time.** Conflicts are arbitrated per-PR; the real merge is `gh pr merge`
  (clean GitHub squash + auto-delete), done only after the `:3000` preview passes.
- **The plan file belongs to `main`.** Branch sessions only read it; the Main Session flips
  its Status and moves it to `done/` (step i) — after the merge, never before.
- **Nothing deploys until you approve.** Phase 1 previews locally on `:3000`; only the Phase-2
  push reaches production.
- **Windows/PowerShell-runnable** throughout (`git -C`, `Copy-Item`, `gh`, `npm ci --prefix`).

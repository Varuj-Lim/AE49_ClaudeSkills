# PR_FLOW — branch sessions

> Loaded on demand by `ae49-task-implement-feature` when step 1's flow detection finds
> `cur != def` (a branch session in a pooled build-folder clone). On DIRECT_TO_MAIN this
> file does not apply.


Applies **only** when flow detection in step 1 found `cur != def`. This session is a
**branch session** in its own build folder (one of the pooled independent clones,
`<hubname>-build1..4`), on a `(feature|bugfix|refactor)/<slug>` branch claimed by
`/ae49-task-integrate setup`. Build the plan as in steps 2–12 **except** for the
deltas below. Golden rule: **a branch session never touches `main` and never touches the
plan file** — both belong to the one Main Session at merge time. (On DIRECT_TO_MAIN this
whole section does not apply.)

- **The plan is PRE-BOUND to the branch (replaces the step 2–4 pick).** This folder was set
  up FOR one plan: the branch is `<prefix>/<slug>`, so the plan is `docs/plans/<slug>.md` —
  present that one plan for a quick confirmation instead of the full pick list. If that
  file is missing, or the user wants a different plan, **STOP** — building a different plan
  on this branch corrupts the merge gate (merge derives the slug from the PR's head branch
  and would archive the WRONG plan file). The right route is `/ae49-task-integrate setup`
  for that other plan.

- **Plan file is READ-ONLY (all steps).** Read `docs/plans/<slug>.md` for the design, but
  never flip its **Status**, never `git add` it, never `git mv` it — and **never tick its
  checkboxes either** (step 6's box-ticking and step 9's Success-criteria ticks are skipped
  on a branch; track progress in your own report instead). The file must stay
  **byte-identical** in the build folder — any local edit leaves the folder dirty and
  unclaimable after the merge. Its whole lifecycle (Status → `Done`, archive to `done/`)
  belongs to the Main Session, which does it only after the squash-merge; a branch commit
  touching the plan file collides with main's later archive move.

- **Being-built detection (steps 2–4).** The Status-based *In progress* bucket is dead here
  (branches never write Status). To see what is already being built, `git fetch` then list
  remote `(feature|bugfix|refactor)/*` branches — a matching branch means that plan is in
  progress. The Status-based collision warning in step 3 guards DIRECT_TO_MAIN only.

- **Push every commit promptly.** `setup` already published the branch (`push -u`), so the
  board shows *In progress* from the start; after each commit (checkpoint or real) just
  `git push` so the remote — and the PR, once open — always reflects the latest state.
  Never push `main`.

- **Dev server.** Start it via the build folder's `.\dev.cmd` (carries the folder's assigned
  port, 3001–3004) — never bare `npm run dev`.

- **Pause for a manual action (step 6).** Same idea, but checkpoint-commit **code files
  ONLY — never the plan file.** Record the pause state (the Step number to resume from) in
  the checkpoint commit message AND in the report. Step 5's plan-Status-based On-hold
  resume routing does not apply on a branch — on resume, read the branch's last commit
  message to find where you paused.

- **Skip steps 8–10** (show-the-testing-checklist-and-wait, act-on-the-answer,
  archive-to-`done/`). The manual test does **not** happen in the branch session — it moves
  to the **merge gate** in `/ae49-task-integrate merge`. Do not wait for a user test here,
  do not set Status `Done`, do not archive.

- **Step 11 (final commit + push) is replaced by:** make the final commit → push the branch
  → open the PR:
  ```bash
  gh pr create --base main --head <prefix>/<slug> --title "<type>: <slug>" --body "<body>"
  ```
  `<type>` = the branch prefix (feature / bugfix / refactor); `<body>` = the plan's
  `## Plain-language summary` + `## Testing checklist` sections (compose the body directly
  from the plan you already read — an `awk`/section-slice extraction is a fine fallback).
  **Never stage or add any `docs/plans/` file to the branch or the PR.** (W3: there is no
  pre-PR Files-to-touch self-check — that guard runs only at merge time in the Main Session.)

- **Final report (step 12).** Report the **PR number** and this line: *"Manual testing
  happens at merge time — run `/ae49-task-integrate merge <PR#>` in the Main Session."* Do
  not report the feature as `Done`; on a branch the honest state is "PR open, awaiting the
  merge gate."


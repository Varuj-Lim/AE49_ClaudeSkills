---
name: ae49-implement-feature
description: >
  Implement a previously planned feature. Reads every plan in docs/plans/, lists
  the ones that aren't Done yet, lets the user pick which to build, executes its
  steps end-to-end, then commits and pushes. Use when the user wants to implement
  or build a planned feature, invokes /ae49-implement-feature, or is in an implement
  session ready to execute a docs/plans/ plan file.
---

# Implement a feature

Pick a pending plan from `docs/plans/` and build it. Meant to run in an
**implement** session (`claude --permission-mode acceptEdits` or default).

## Workflow

1. **Find plans.** If a remote is configured, `git pull --rebase` first so the list
   reflects plans pushed from a plan session. List `docs/plans/*.md` — every file
   there is a `<feature>.md` plan. (Completed plans live in the `docs/plans/done/`
   subfolder; the non-recursive `*.md` glob skips them, so they never appear in the
   list.) If `docs/plans/` is missing or empty, tell the user there's nothing to
   implement (plan one with `/ae49-plan-feature`) and stop.

2. **Filter.** Read each file's **Status** line. Keep only plans whose Status is NOT
   `Done` (ready ones, plus any left `In progress` to resume). If none qualify, say
   so and stop.

3. **List + select.** If 4 or fewer qualify, present them with **AskUserQuestion**
   (one option per plan: label = feature name, description = the plan's Context or
   first line). If MORE than 4, show a numbered text list and ask the user to type
   the number or feature name. Either way the user picks exactly one.

4. **Load.** Read the selected plan fully. Set its **Status** to `In progress`.

5. **Build.** Execute the plan's **Steps** in order. After each step's verify
   passes, tick its box (`[ ]` → `[x]`). Reuse the helpers named in the plan's
   **Reuse** section — don't rewrite what exists. Stay surgical: only what the plan
   calls for.

6. **Verify.** Run the plan's **Verification** section end-to-end (run the app,
   typecheck, exercise the flow). Fix and re-verify until it passes.

7. **Finish the plan file.** Tick all Success-criteria boxes that now hold; set
   **Status** to `Done`.

8. **Move the plan file into `done/`.** Once the plan is fully built and marked `Done`,
   move it into the `docs/plans/done/` subfolder so completed plans are separated from
   active ones: `git mv docs/plans/<feature>.md docs/plans/done/<feature>.md`. Use
   `git mv` (not a plain rename) so the move is staged and history is preserved. Create
   the `docs/plans/done/` folder first if it doesn't exist — Git's `git mv` does NOT
   create the destination directory and will fail with "No such file or directory" if
   it's missing. Do this before the commit so the move rides in the same commit. (Plans
   in `done/` are excluded by step 1's non-recursive `docs/plans/*.md` glob, so they
   never reappear in the list — no `-DONE` suffix needed.)

9. **Commit + push.** Stage ONLY the files this build touched, plus the moved
   `docs/plans/done/<feature>.md` plan file — never `git add -A`. One commit, message focused on
   the feature ("why"), per the repo's commit convention. Then, if a remote is
   configured, `git pull --rebase` and push — so the built code and the `Done` status
   reach the remote and stay in sync with the pushed plan. If no remote, commit only.

## Notes

- One plan per run. To build another, run the skill again.
- If a step is ambiguous or the plan contradicts the code, stop and ask — don't guess.

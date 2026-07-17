---
name: ae49-task-plan-feature
description: >
  Plan a new feature for the current repo by stress-testing the design with a
  grilling interview, then saving the result as docs/plans/<feature>.md from a
  bundled plan template. Creates the docs/plans/ folder if it does not exist. Use
  when the user wants to plan or design a new feature, invokes /ae49-task-plan-feature,
  or is in a plan-mode session and needs to produce a docs/plans/ plan file.
---

# Plan a feature

Turn a feature idea into a ready-to-build `docs/plans/<feature>.md` that an
implement session can later execute. Meant to run in a **plan-mode** session
(`claude --permission-mode plan`), but works in any session.

## Workflow

1. **Confirm plan mode.** This skill is meant for a plan-mode session. You are in
   plan mode if the harness has signalled it — a plan-mode system reminder is
   present and every write is blocked until ExitPlanMode. If you are NOT in plan
   mode, tell the user and recommend they switch (Shift+Tab → "plan mode") so
   planning stays read-only; then ask whether to switch or proceed anyway. Resolve
   this before continuing.

2. **Get the feature.** Use the feature name/description the user gave (skill
   args). If none, ask one line: what feature?

3. **Grill the design.** Invoke the **ae49-task-grill** skill (via the Skill tool) on
   the feature. Walk the decision tree, explore the codebase to answer questions,
   resolve every branch until the design is settled and the user agrees.

4. **Ensure the folder.** Check for `docs/plans/` at the repo root. If it does not
   exist, create it.

5. **Read the template.** Read [TEMPLATE-FORMAT.md](TEMPLATE-FORMAT.md) from THIS
   skill's directory — that is the canonical plan format (do not depend on a
   project-level template).

6. **Exit plan mode, then write.** In plan mode you cannot create the file yet, and
   you cannot silently switch modes yourself. Put the full plan in the plan-mode
   plan file, then call **ExitPlanMode** (so the approval screen shows the real
   plan) — the user's approval is the switch that turns plan mode off.
   Once approved (or if you were never in plan mode), save `docs/plans/<slug>.md`,
   where `<slug>` is the feature name in kebab-case (e.g. "Leave page" →
   `leave-page.md`). Fill every section of the template from the grilled design, set
   **Status** to `Ready`, and stamp **Created** with today's date. Fill `Files to
   touch` completely — implement-feature reads it to detect two sessions colliding on
   the same file, so list every file you create or modify. Write the
   `## Plain-language summary` section in plain English — no jargon, no file paths,
   just what gets built and what's different for the user once it's done —
   implement-feature reads this same section back to the user later, so get it
   right here. Also write the `## Testing checklist` section: plain, numbered
   steps the user can click through in the app after the feature is built, to
   confirm it actually works — implement-feature reads this back to the user as
   its final report once the build is done.

7. **Wire overlaps into the build chain.** Before committing, connect this plan to any
   undone plan it shares a file with, so `/ae49-task-integrate` knows what can build in
   parallel vs. what must wait. **Skip this whole step when this plan's `**Branch:**` is the
   bare `—`** (direct-on-main plans don't use build folders) — leave `**After:**` as `—`.
   - **Find overlaps.** Collect this plan's `## Files to touch` paths (ignore any
     `NO changes:` bullet). Read every OTHER **undone** plan in `docs/plans/*.md` (Status
     Ready / In progress / On hold — skip the `done/` subfolder and other `Branch: —` plans)
     and collect theirs the same way. An overlap = they share ≥1 path (same collision logic
     implement-feature uses).
   - **No overlaps →** leave `**After:**` as `—` and continue.
   - **Overlaps →** show them all at once (each plan's name + the shared file) and ask ONE
     question — build this **after all of them** (default, one keypress) or mark it
     **urgent**?
     - **After all (default):** set this plan's `**After:** <slugA>, <slugB>, …` to every
       overlapped plan. If the overlaps span more than one existing chain, this correctly
       merges those chains into one.
     - **Urgent:** the user picks which overlapped plan(s) should instead wait for THIS
       plan; for each, add `<this-slug>` to THAT plan's own `**After:**` field (edit the
       existing plan file — allowed, plan docs live on `main`) and drop it from this plan's
       `After`. Only offer flipping a plan that is **not yet building** (no branch/PR).
       **Refuse a flip that would create a cycle** (the target already sits behind this plan
       through some path) and explain.
   - Store only these `**After:**` edges — never letters/levels/`.N`; `/ae49-task-integrate`
     derives the chain display (A1 → A2 → A3.1/A3.2) live from them.

8. **Commit + push the plan.** The ExitPlanMode approval in step 6 already served
   as the user's review of the plain-language summary and testing checklist — do
   not ask them to confirm again.

   **First, the merge-in-flight check (multi-session repos with a build-folder pool).** A
   plan session shares the hub folder with the one Main Session, and the merge gate briefly
   parks the hub on a `_merge_preview` branch. **Before staging, confirm the hub is on the
   default branch** — `git rev-parse --abbrev-ref HEAD`. If it reads `_merge_preview` (or any
   non-default branch), a merge is mid-flight: **do NOT commit** — the commit would land on
   the preview branch and error. Tell the user the plan is written and waiting, and hold the
   commit until the hub is back on `main` (re-check, then commit). Never `git checkout` the
   hub yourself. (On a solo repo with no such pool, HEAD is always the default branch — this
   check just passes.)

   Then: stage ONLY the plan file(s) this run wrote or changed —
   `docs/plans/<slug>.md` plus any existing plan whose `**After:**` you edited in step 7's
   urgent path — never `git add -A` (`git add <file>` creates the folder for you). Commit
   with a message naming the feature (follow the repo's commit convention). Then, if a remote
   is configured, `git pull --rebase` first (so the push isn't rejected non-fast-forward)
   and push. If no remote, commit only and tell the user push was skipped.

9. **Mark complete.** Mark this planning run complete in the session task list:
   call **TaskUpdate** to set the plan-feature task's status to `completed`. If you
   never registered a task for this run, create one now with **TaskCreate** and
   immediately mark it `completed`, so the task list clearly shows the skill
   finished.

10. **Return to plan mode + hand off.** Call **EnterPlanMode** to switch back into
   plan mode, ready for the next plan. (If EnterPlanMode isn't available, ask the
   user to Shift+Tab back to plan mode.) Then report the saved plan path and the
   commit/push status. Do NOT implement here. ALWAYS close the turn with this exact
   standard hand-off line (adjust only the push wording if push was skipped/blocked),
   so the user knows the plan is finished and you're ready for the next one:

   > ✅ Planning done — plan saved & pushed. Build it anytime with
   > `/ae49-task-implement-feature`. Ready for your next `/ae49-task-plan-feature`.

## Output

- `docs/plans/<slug>.md`, Status `Ready`, `**After:**` wired, committed and pushed
  (plus, only in step 7's urgent path, an edited `**After:**` line in one existing plan).
- Session left back in plan mode, ready for the next `/ae49-task-plan-feature`.

## Notes

- **Don't show the preview to the user — they'll see it themselves.** Never open,
  screenshot, or share the browser preview with the user.

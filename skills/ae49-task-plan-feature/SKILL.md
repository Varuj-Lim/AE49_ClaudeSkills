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
   the same file, so list every file you create or modify.

7. **Commit + push the plan.** Stage ONLY `docs/plans/<slug>.md` — never
   `git add -A` (`git add <file>` creates the folder for you). Commit with a message
   naming the feature (follow the repo's commit convention). Then, if a remote is
   configured, `git pull --rebase` first (so the push isn't rejected non-fast-forward)
   and push. If no remote, commit only and tell the user push was skipped.

8. **Mark complete.** Mark this planning run complete in the session task list:
   call **TaskUpdate** to set the plan-feature task's status to `completed`. If you
   never registered a task for this run, create one now with **TaskCreate** and
   immediately mark it `completed`, so the task list clearly shows the skill
   finished.

9. **Return to plan mode + hand off.** Call **EnterPlanMode** to switch back into
   plan mode, ready for the next plan. (If EnterPlanMode isn't available, ask the
   user to Shift+Tab back to plan mode.) Then report the saved plan path and the
   commit/push status. Do NOT implement here. ALWAYS close the turn with this exact
   standard hand-off line (adjust only the push wording if push was skipped/blocked),
   so the user knows the plan is finished and you're ready for the next one:

   > ✅ Planning done — plan saved & pushed. Build it anytime with
   > `/ae49-task-implement-feature`. Ready for your next `/ae49-task-plan-feature`.

## Output

- One file: `docs/plans/<slug>.md`, Status `Ready`, committed and pushed.
- Session left back in plan mode, ready for the next `/ae49-task-plan-feature`.

## Notes

- **Don't show the preview to the user — they'll see it themselves.** Never open,
  screenshot, or share the browser preview with the user.

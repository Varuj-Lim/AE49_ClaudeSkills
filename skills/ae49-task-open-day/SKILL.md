---
name: ae49-task-open-day
description: Morning resume ceremony on any machine after ae49-task-close-day parked work on another — fast-forwards main from the project's backup branch, syncs skills, restores the parked feature tree (uncommitted) from its park/ transport branch, re-opens the manual-test gate, and reports the board. Use when the user says "เปิดวัน", "มาทำต่อ", "ทำต่อจากที่ทำงาน", "ทำต่อจากที่บ้าน", "resume where I left off", "open the day", starts a session right after switching machines, or invokes /ae49-task-open-day.
---

# Open day — resume parked work on this machine

Mirror of `ae49-task-close-day`. Everything arrives through git.

**Iron rules**

- Fast-forward ONLY. If histories diverged: STOP and show the user — never
  `reset --hard`, never force-push, never guess which side wins.
- Restoring uses cherry-pick **`-n`** (no commit): feature work must end up
  UNCOMMITTED on main again (no-commit-before-test rule).
- Park/agent branches stay on origin until their feature LANDS; open-day never
  deletes them.

## Ceremony

1. **Fetch + fast-forward.**

   ```
   git fetch origin
   git status --short                  # expect clean — close-day left it clean
   git merge --ff-only origin/main
   git merge --ff-only origin/backup   # backup normally leads main between pushes
   ```

   A dirty tree here, or an ff failure, means something unexpected happened —
   stop and resolve with the user before touching anything.

2. **Skills sync.** If this machine's daily drift hook reported changes, act on
   its report. If the machine has no hook, run the `ae49-task-update-skills`
   preview (apply per that skill's warning gate). Freshly applied skills load in
   the NEXT session — say so.

3. **Read the in-flight memory** (the driver's folder under the project's
   `.claude/memory/`). It is the park manifest: which `park/` branch holds the
   hub tree, which agent branches hold queued builds, the gate state, and the
   first action.

4. **Restore the hub tree** (when the manifest lists a park branch):

   ```
   git cherry-pick -n origin/park/<name>
   git restore --staged .
   git status --short                  # should mirror close-day's survey
   ```

   A conflict means main moved underneath the park (something landed after the
   park was cut) — stop and resolve with the user.

5. **Queued builds** need nothing yet. When a queue item's turn comes, stage it
   with `git cherry-pick -n origin/<its-agent-branch>` + `git restore --staged .`
   — this replaces any older Temp-patch instructions still written in the memory.

6. **Re-open the gate** if one was open at close: rewrite the project's
   gate-checklist items file from the plan + memory and hand over the file://
   link per the gate rules. Emulator and seeded test data are machine-local — if
   the gate needs seeded data, re-seed on THIS machine (the project's test-data
   skill), and launch the dev/emulator with this machine's launcher.

7. **Update memory + report.** Note "resumed on <machine> <date>" in the
   in-flight file (the commit can ride the next landing). Report the board per
   `ae49-ref-report-format` and name the single next action.

## Notes

- Runs fine on the SAME machine that closed — restore is symmetric.
- When a parked feature lands, delete its transport branch:
  `git push origin --delete park/<name>` (landing cleans up, not open-day).

---
name: ae49-task-close-day
description: End-of-day parking ceremony so every piece of in-flight work travels via git and a session on ANY machine can resume exactly here — parks uncommitted feature trees and queued worktree builds onto transport branches, runs the project's no-deploy backup push, and rewrites the in-flight memory to point at branches instead of machine paths. Use when the user says "ปิดวัน", "ย้ายเครื่อง", "เอางานกลับบ้าน", "park my work", "close the day", is about to switch machines (office ↔ home), or invokes /ae49-task-close-day. Pairs with ae49-task-open-day on the other side.
---

# Close day — park everything so work travels

After this ceremony the machine can be shut down, and `ae49-task-open-day` on any
other machine (or this same one) resumes exactly where things stood. Everything
travels through git; nothing important stays only in a working tree, a worktree,
or a Temp folder.

**Iron rules**

- NEVER `git push origin main` here. In projects where a main push deploys,
  this ceremony must not deploy. Only the project's declared no-deploy backup
  push (e.g. `git push origin main:backup`) is allowed.
- `park/*` branches and worktree-agent branches are TRANSPORT ONLY: never merge
  them, never open a PR from them. They are deleted when their feature lands.
- Feature work must stay uncommitted ON MAIN (no-commit-before-test rule).
  Parking commits it on a throwaway branch instead, then returns main to clean.

## Ceremony

1. **Survey.** `git status --short`, `git worktree list`, and the driver's
   in-flight memory (the per-person folder under the project's `.claude/memory/`).
   List what exists: a staged-uncommitted feature tree on main? queued builds in
   worktrees? an open manual-test gate? unpushed commits on main?

2. **Discard dev-generated noise.** The project's CLAUDE.md names files a dev
   server rewrites (e.g. `next-env.d.ts`, a tsconfig include). `git checkout --`
   those in the hub tree AND in each worktree being parked. Never park them.

3. **Park the hub tree** (skip when only dev noise was dirty):

   ```
   git checkout -b park/<machine>-<yyyy-mm-dd>
   git add -A
   git status --porcelain    # VERIFY: no .env*, no secret or emulator files
   git commit -m "park: <what> (transport — never merge)"
   git push origin park/<machine>-<yyyy-mm-dd>
   git checkout main         # tree is now clean; the park branch holds the work
   ```

   `.gitignore` shields secrets and emulator data from `git add -A` — the
   porcelain check is the belt-and-braces confirmation. Anything suspicious
   there: stop and ask the user.

4. **Park queued worktree builds.** For each worktree still holding an unlanded
   build (per the in-flight memory): inside that worktree, repeat the discard +
   `git add -A` + commit + push on its own agent branch. Skip a worktree whose
   tree is clean and whose branch is already on origin.

5. **Update the in-flight memory.** Rewrite the driver's inflight file so every
   queue item points at a BRANCH (never a machine path or Temp patch file), and
   record: parked-by machine name, date, gate state, and what open-day should
   restore first. Commit it: `docs(memory): close-day park <date>`.

6. **Backup push.** Run the project's no-deploy backup push, e.g.
   `git push origin main:backup`. This carries the memory commit plus every
   unpushed main commit off-machine. (Park branches were pushed in 3–4.)

7. **Skills repo check.** The skills sync clone must be clean and pushed
   (`git -C <clone> status -sb`) per the same-turn mirror rule. Drift found:
   mirror + push it now, so the other machine's drift check pulls it tomorrow.

8. **Report** per `ae49-ref-report-format`: a table of item → where it now lives
   (branch) → what open-day will do with it. If a gate was open, warn that
   emulator/seeded test data is machine-local and must be re-seeded on the other
   side. End with: Main can be closed and the machine shut down (close a running
   emulator with Ctrl+C, never the window X).

## Notes

- Staying on the same machine tomorrow? The ceremony is harmless — open-day
  restores identically wherever it runs.
- Distinct from `ae49-task-handoff`, which compacts a CONVERSATION into a doc;
  close-day moves WORK. Use both when the next session also needs deep context.

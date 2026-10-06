---
name: ae49-task-close-day
description: End-of-day parking ceremony so every piece of in-flight work travels via git and a session on ANY machine can resume exactly here — parks uncommitted feature trees and queued worktree builds onto transport branches, runs the project's no-deploy backup push, rewrites the in-flight memory to point at branches instead of machine paths, and builds the 🎒 hand-carry list of gitignored machine-local files (e.g. an .env.local whose keys changed) that must travel outside git. Use when the user says "ปิดวัน", "ย้ายเครื่อง", "เอางานกลับบ้าน", "park my work", "close the day", is about to switch machines (office ↔ home), or invokes /ae49-task-close-day. Pairs with ae49-task-open-day on the other side.
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

5. **Off-git cargo check (🎒 hand-carry list).** Git cannot carry ignored
   machine-local files, so list what must travel by hand. Check `.env.local`
   (and any other `.env*` the project uses): if its modified time is newer than
   the previous close-day — or the user says keys were added/rotated — flag it
   CARRY, naming WHICH key changed (key NAME only, NEVER the value). Same for
   any other gitignored file the user wants identical on the other side
   (emulator snapshots are normally rebuilt per machine, not carried). Unsure
   whether something changed? Ask the user. Nothing to carry → record that
   explicitly.

6. **Update the in-flight memory.** Rewrite the driver's inflight file so every
   queue item points at a BRANCH (never a machine path or Temp patch file), and
   record: parked-by machine name, date, gate state, the step-5 🎒 carry list
   with each item's reason, and what open-day should restore first. Commit it:
   `docs(memory): close-day park <date>`.
   **The open-items register goes in first (owner ruling 2026-09-30, `ae49-router`
   §"The open-items register").** Before writing the memory, read
   `docs/plans/_open-items.md` and run the router's backstop sweep (spec
   `open-questions.md` files, Draft / On hold plans, the memory's own "Parked" /
   "deferred" / "Owner steps" lines); anything open with no plan and no register
   row gets a row now, committed with the register. The memory's queue then LISTS
   the register rows by ID. **"Backlog cleared" / "nothing parked" may be written
   only when the register is EMPTY** — the 2026-09-30 close-day wrote it while the
   seismic tool, T0202 Q18 and four deferrals were open, and they stayed invisible
   for 12 days.

7. **Backup push.** Run the project's no-deploy backup push, e.g.
   `git push origin main:backup`. This carries the memory commit plus every
   unpushed main commit off-machine. (Park branches were pushed in 3–4.)

8. **Skills repo check.** The skills sync clone must be clean and pushed
   (`git -C <clone> status -sb`) per the same-turn mirror rule. Drift found:
   mirror + push it now, so the other machine's drift check pulls it tomorrow.

9. **Report** per `ae49-ref-report-format`: a table of item → where it now lives
   (branch) → what open-day will do with it, plus a **🎒 carry with you**
   section listing every step-5 item with its reason and how to move it (USB
   drive or password manager — never chat, never git). Say "nothing to carry"
   out loud when the list is empty, so the user never has to guess. If a gate
   was open, warn that emulator/seeded test data is machine-local and must be
   re-seeded on the other side. **A parked gate board travels AS-IS, so condense it
   BEFORE parking: every section inside the 5–7 budget of `ae49-router` (never 10) —
   the 16-item section parked on 2026-09-11 earned the owner's reminder.** End with: Main can be closed and the machine
   shut down (close a running emulator with Ctrl+C, never the window X) — then step 10.

10. **Shut down the computer — DEFAULT: DON'T (owner rule 2026-10-06).** The ceremony ends with
    the machine READY to be shut down, never shut down by Main on its own: the owner may still want
    the browser, a terminal, or another session. Main shuts the machine down only when the owner says
    so explicitly in chat in that same sitting ("ปิดเครื่องด้วย", "shut it down") — never from a
    standing instruction, never because the report said "the machine can be shut down", and never
    while a background agent, a build, a backup push or an emulator is still running (check step 7
    finished and `git -C <clone> status -sb` is quiet first). The report's last line offers it once:
    *"ปิดเครื่องให้ไหม — ถ้าต้องการพิมพ์ว่า ปิดเครื่อง"*.

    When the owner DOES say so, run it from the **PowerShell tool** (the Bash tool eats `/` switches —
    see the machine's `cmd /c` MSYS trap) with a 60-second grace so a wrong click is still cancellable:

    ```powershell
    shutdown.exe /s /t 60 /c "AE49 close-day: shutting down in 60 s - run  shutdown.exe /a  to cancel"
    ```

    Cancel inside the grace period: `shutdown.exe /a`. Hand the owner the same two lines as plain
    text as well (owner-facing commands are PowerShell, pasted bare — `~/.claude/CLAUDE.md`
    §Communication). Say the shutdown is scheduled and how to cancel; do not keep working after it.

## Notes

- Staying on the same machine tomorrow? The ceremony is harmless — open-day
  restores identically wherever it runs.
- Distinct from `ae49-task-handoff`, which compacts a CONVERSATION into a doc;
  close-day moves WORK. Use both when the next session also needs deep context.

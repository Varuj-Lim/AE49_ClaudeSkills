# close — end the day: park everything so work travels to another machine

Formerly `ae49-task-close-day` (moved whole 2026-10-28, step numbers kept). Runs ONLY when the owner types
`/ae49-task-session close` or says the day ends / the machine changes — never inferred (SKILL.md). For a
same-machine session change use [swap.md](swap.md).

After this ceremony the machine can be shut down, and [open](open.md) on any
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

**First of all — switch Autopilot OFF and report (owner rule 2026-10-22).** Before step 0, read
`~/.claude/autopilot/<project-folder-name>/state.json`. `"on": true` → run `ae49-mode-autopilot off`
(state `on: false`, heartbeat stopped) and give its full `off` report from the log — the decisions,
landed, parked, owner steps — as its own message, THEN start step 0. No file or `"on": false` → one
line "Autopilot: already Off" and go on. Never ask whether to switch off: closing the day IS the
switch-off. Step 6 then records `Autopilot: OFF (switched off at close-day)` in the manifest. Why:
on 2026-10-22 the open-day found the mode still ON from 2026-10-02 with every scope item long
landed, and had to ask the owner whether to switch it off (*"เพิ่มกติกาใหม่ทุกครั้งที่ close-day ให้ปิดโหมด
ก่อนทุกครั้งแล้วรายงาน หลังจากนั้นค่อยเริ่มปิดวัน จะได้ไม่ต้องมาถามแบบนี้อีก"*).

0. **Stop the engines (owner rule 2026-10-06).** Nothing may still be WRITING when the survey
   runs — an agent mid-build makes step 1 lie and step 3 park a half-written tree.
   - `ListAgents` + the background-task list: an agent, a builder, an audit or a Bash task still
     running → ASK the owner "รอให้เสร็จ หรือหยุดเลย" (a build minutes from done is worth the wait;
     an exploration is not). Stop with `TaskStop`; never park a worktree whose builder is alive.
   - Emulator / dev server that MAIN started (`preview_start`) → `preview_stop`, then the safe-kill
     check of `web-ref-local-emulator` (ports free, no orphan `java` / `node`). One the OWNER started
     in their own terminal → tell them: close it with Ctrl+C, never the window X (as before).
   - A backup push or skills push still in flight → wait for it; step 7 / 8 re-run them anyway.
   Record "engines: all stopped" (or what was left running and why) in the step-9 report; step 10
   refuses to shut the machine down while this line is not clean.

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
    while step 0's "engines: all stopped" line is not clean (re-run its checks now — an agent may
    have been started since — and confirm step 7's push landed and `git -C <clone> status -sb` is
    quiet).

    **It is NOT asked (owner rule 2026-10-07, replacing the 2026-10-06 "ask every close-day"
    rule: *"ปกติไม่ต้องถามผมสิ ต้องเป็นแบบไม่ปิดเป็น Default เลยถ้าผมไม่ได้บอกอะไร"*).** The report
    ends WITHOUT a shutdown question and the machine stays on. Main shuts down only when the
    owner's own message in that sitting asks for it ("ปิดวันและปิดเครื่อง", "close day and close
    computer"). The report may say once, plainly, that the machine CAN be shut down; it never
    offers it as a choice to answer.

    **Exception — the owner's emulator, once the owner has said to shut down (owner rule
    2026-10-07: "once I told you to close computer I allow you to close emulator by using
    stop-emu.cmd, don't ask me … sometime I already away from keyboard").** An emulator suite or
    emulator dev server the OWNER started is normally theirs to close (step 0). But when the owner's
    live message in this sitting says to shut the machine down, Main closes it ITSELF instead of
    asking: run the project's safe-stop launcher (AE49: `.claude\stop-emu.cmd`, which EXPORTS the
    data first and stops only java / node on the emulator ports) from the PowerShell tool, then
    re-check the ports are free and the launcher printed its `[OK]` line. If the export FAILS the
    launcher stops nothing — then Main does NOT shut down and reports the exact message (data must
    never be lost to a shutdown). Afterwards discard the dev noise the launcher leaves (the project
    CLAUDE.md names it, e.g. `next-env.d.ts`, the tsconfig include) so `main` is clean. This covers
    ONLY the project's own emulator / dev servers; anything else still running (an agent, a build,
    an unknown program) still blocks the shutdown as above.

    When the owner DOES say so, run it from the **PowerShell tool** (the Bash tool eats `/` switches —
    see the machine's `cmd /c` MSYS trap) with a 60-second grace so a wrong click is still cancellable:

    ```powershell
    shutdown.exe /s /t 60 /c "AE49 close-day: shutting down in 60 s - run  shutdown.exe /a  to cancel"
    ```

    Cancel inside the grace period: `shutdown.exe /a`. Hand the owner the same two lines as plain
    text as well (owner-facing commands are PowerShell, pasted bare — `~/.claude/CLAUDE.md`
    §Communication). Say the shutdown is scheduled and how to cancel; do not keep working after it.

## Notes

- Staying on the same machine and only changing session? Use [swap](swap.md) — faster, keeps Autopilot.
  If close ran anyway, open restores identically wherever it runs.
- Distinct from `ae49-task-handoff` (doc), which writes a CONVERSATION into a document;
  close moves WORK. Use both when the next session also needs deep context.

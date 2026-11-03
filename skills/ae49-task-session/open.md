# open — start the day / a fresh session on this machine

Mirror of [close.md](close.md);
also what a NEW session runs after a [swap](swap.md). Everything arrives through git.

**Same-machine fast path (owner 2026-10-28).** When the in-flight memory's last entry is a `swap` (or a
`close`) written on THIS machine and names no park branch and no 🎒 item, steps 4 and 5 have nothing to do —
say so in one line and skip them. Steps 1–3 and 6–8 still run: the fetch is cheap and proves nothing moved,
and an Autopilot left ON by a swap is ticked in 7b.

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
   git status --short
   git merge --ff-only origin/main
   git merge --ff-only origin/backup   # backup normally leads main between pushes
   ```

   A dirty file is expected when it is dev-server churn (the files `web-ref-deploy-landing` §7 means: never
   commit them; while the emulator runs it rewrites them, so leave them) or work the in-flight memory names. Any other dirty file, or an ff
   failure, means something unexpected happened: stop and resolve with the user before touching anything.

2. **Skills sync.** If this machine's daily drift hook reported changes, act on
   its report; if the machine has no hook, run the `ae49-task-update-skills`
   preview. Then APPLY per that skill's Workflow — **the repo wins, no asking**
   (owner ruling 2026-08-24, reaffirmed 2026-09-15): look which side is newer yourself,
   copy repo-newer items down from the machine's clone, never apply the
   `UPDATE CLAUDE.md` scrub line, and say what changed. Also diff the `self`
   skill (`ae49-task-update-skills`) against the clone — it never syncs itself,
   so copy it down by hand when the repo's copy is newer (a stale self copy is
   how a three-week-old ruling went unseen on this machine). Freshly applied
   skills load in the NEXT session — say so.

3. **Read the in-flight memory** (`inflight-now.md` in the driver's folder under the project's
   `.claude/memory/`; a project not moved to it yet: its newest `inflight-*` file). It is the park manifest: which `park/` branch holds the
   hub tree, which agent branches hold queued builds, the gate state, and the
   first action.

4. **Verify the 🎒 cargo arrived.** For each item in the manifest's carry list
   (e.g. ".env.local — key X added"): confirm it is on THIS machine — the named
   key exists in this machine's `.env.local` (check the key NAME with a grep,
   never print values), or the file's modified time is fresh. Anything missing:
   STOP and tell the user exactly what to bring before continuing — a stale
   `.env.local` fails much later with a confusing auth error, so catch it here.

5. **Restore the hub tree** (when the manifest lists a park branch):

   ```
   git cherry-pick -n origin/park/<name>
   git restore --staged .
   git status --short                  # should mirror close's survey
   ```

   A conflict means main moved underneath the park (something landed after the
   park was cut) — stop and resolve with the user.

6. **Queued builds** need nothing yet. When a queue item's turn comes, stage it
   with `git cherry-pick -n origin/<its-agent-branch>` + `git restore --staged .`
   — this replaces any older Temp-patch instructions still written in the memory.

7. **Re-open the gate** if one was open at close: rewrite the project's
   gate-checklist items file from the plan + memory and hand over the file://
   link per the gate rules. **Condense first: every section of an inherited board
   must sit inside the 5–7 budget of `ae49-ref-gate-checklist` (never 10) — a parked board is
   not exempt.** Emulator and seeded test data are machine-local — if
   the gate needs seeded data, re-seed on THIS machine (the project's test-data
   skill), and launch the dev/emulator with this machine's launcher.

7b. **Switch autopilot ON (`ask`) on EVERY open-day, with EVERY open row in scope — no question
   first** (owner AQ1 b, 2026-10-28, replacing owner Q186 a of 2026-10-22, which asked first).
   Whenever THIS machine's state file `~/.claude/autopilot/<project>/state.json` is missing or
   `"on": false` — whatever the manifest says — Main gathers the board first (step 8's register read
   and backstop sweep), then runs `ae49-mode-autopilot on ask <scope>` where the scope is **every row
   of that board**: each plan / batch in flight AND every row of `docs/plans/_open-items.md`, held rows
   and rows waiting on an owner ruling included. The owner chose ALL rows over Main's narrower
   proposal ("only the rows Main can move") knowing what it means:
   - **an undecided row draws a question** (`ae49-ref-question-format`) in the open-day report or the
     next tick; **a held row** ("wait until X") draws one question — has X happened? — and nothing is
     done on it until the owner says so;
   - **the NEVER list still decides what Main may DO with a row** (`ae49-mode-autopilot`): a backup
     sweep, a migration `--apply`, a sibling handoff, a push, an owner's-hands step stays the owner's —
     being in scope never makes it Main's;
   - **`ask` only, never `decide`**; the state file's `rulings` start fresh with this open-day's line —
     never copy an old state's scope or rulings over;
   - the open-day report says the mode went ON, lists the scope by row number, and how to narrow it
     ("ตัด #3") or switch off ("ปิด autopilot"); the 🤖 line then reads `On (ask)`.
   When the state file is already ON (a same-machine resume), skip the switch-on and run its `tick`.
   A manifest written by `close` always says `Autopilot: OFF` (close switches it off first), so this step never trusts the manifest.

8. **Update memory + report.** Note "resumed on <machine> <date>" in the
   in-flight file (the commit can ride the next landing). Report the board per
   `ae49-ref-report-format` and name the single next action.
   **The board renders every row of `docs/plans/_open-items.md`** (owner ruling
   2026-09-30, `ae49-router` §"The open-items register") — each entry named, same-cause entries in one `⏸️` row
   with what it waits on — so the day starts with the whole picture, not only the
   plans and the park. An open-day report that says "clean board" while the
   register holds rows is wrong.
   The autopilot state is NOT a board row: like every message, the report ends
   with the `🤖 Autopilot mode: On (ask|decide) / Off` line of
   `ae49-ref-report-format` (owner 2026-10-07). The CHECK itself stays in `~/.claude/CLAUDE.md`; the
   automatic switch-on is step 7b.

## Notes

- Runs fine on the SAME machine that closed — restore is symmetric.
- When a parked feature lands, delete its transport branch:
  `git push origin --delete park/<name>` (landing cleans up, not open-day).

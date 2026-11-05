# swap — close this session, continue in a fresh one on the SAME machine

Runs on
`/ae49-task-session swap`, or on a bare `/ae49-task-session` typed in a session that already holds work.

When the intent is "close this session and continue in a fresh one ON THIS MACHINE" (the user
says "ปิด session", "เปิด session ใหม่", "close this session", reaches the router's clean break
in a long session, or hands off with no machine switch), run THIS — never [close](close.md). Close is
for switching MACHINES: it parks trees on branches, builds a 🎒 hand-carry list and switches
Autopilot OFF, all of which only slow a same-machine swap down or break it (owner HQ1 a,
2026-10-27).

0. **Clean break or stop** (`ae49-router` § Session length). No sub-agent running, no gate section open on the board, no
   question asked and unanswered that lives only in chat (it must be in the open-items register). If any of these holds, say
   which and finish it (or register it) first. Unfinished work is NOT parked: an uncommitted tree or a built but unaudited
   worktree stays where it is, and the in-flight file names it.
1. **Commit everything that is done** (explicit pathspec, never `git add -A`; HEAD must be the default branch, never a `.claude/worktrees/agent-` path).
2. **Rewrite the in-flight memory** — `.claude/memory/<person>/inflight-now.md`, REWRITTEN whole, never
   appended, never a new dated file (git keeps the old text): live sha + time, unpushed set and any rules/index deploy it needs,
   the gate counter, what is queued with its plan and approved rulings, the register rows, emulator
   state, the autopilot log path, the single next action. Keep the MEMORY.md index line current.
   Without git-synced per-person memory, write a handoff doc (`ae49-task-handoff`) instead and point the new
   session at it. Write a full `docs/handoffs/` doc ONLY when deep context does not fit (link it).
3. **Leave Autopilot exactly as it is.** The state file is machine-local; a new session on this
   machine reads it at start and, if ON, runs its `tick`. Never switch it off here, never write an
   off report.
4. **Backup push** — the project's no-deploy backup push, exactly as [close](close.md) step 7
   (that skill owns the command and the never-push-the-deploy-branch rule).
4b. **Emulator auto-close** — [SKILL.md](SKILL.md) § Emulator auto-close: nothing pending uses the suite → safe-close it.
5. **Report in two or three lines and stop** — the in-flight file's path, what was committed / pushed, anything the user still
   has to look at (a rollout, a deploy), and the one line to type in the NEW session:
   `/ae49-task-session` (bare — in the new, empty session it runs [open](open.md)) — then the 🤖 line. **The USER closes this session and opens the new one
   themselves. Main NEVER starts it** (no `start_session`, no sub-session, no dispatched agent that
   carries the work on): a session Main starts is linked to this one and runs beside it in the same
   checkout, which is exactly the parallel writer the swap is meant to avoid (owner 2026-10-27).

Skipped on purpose: park branches, worktree parking, the 🎒 hand-carry list, the engines stop
(no agent is running — step 0; a dev server may stay up, the emulator follows step 4b), the close-day-park log entry (one line is optional), the
skills-repo sync check, the shutdown question.

For switching MACHINES, use [close](close.md) instead (work must travel via
git, with a 🎒 hand-carry list); this mode covers only a same-machine swap.

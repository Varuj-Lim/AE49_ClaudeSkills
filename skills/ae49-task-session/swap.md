# swap — close this session, continue in a fresh one on the SAME machine

Formerly `ae49-task-handoff` § "Session-close mode" (moved whole 2026-10-28, step numbers kept). Runs on
`/ae49-task-session swap`, or on a bare `/ae49-task-session` typed in a session that already holds work.

When the intent is "close this session and continue in a fresh one ON THIS MACHINE" (the user
says "ปิด session", "เปิด session ใหม่", "close this session", accepts the router's fresh-session
offer, or hands off with no machine switch), run THIS — never [close](close.md). Close is
for switching MACHINES: it parks trees on branches, builds a 🎒 hand-carry list and switches
Autopilot OFF, all of which only slow a same-machine swap down or break it (owner HQ1 a,
2026-10-27: *"ปิด session ได้ไวขึ้น … เครื่องเดิม แค่อยากเปิด Session ใหม่"*).

0. **Clean break or stop.** No sub-agent running, no gate section open on the board, no build
   staged but unlanded, no question asked and unanswered that lives only in chat (it must be in the
   open-items register). If any of these holds, say which and finish it (or register it) first.
   Uncommitted feature work in the tree is NOT parked: the new session opens the same checkout and
   finds it there — but name it in the in-flight file.
1. **Commit everything that is done** (explicit pathspec, never `git add -A`; HEAD must be the default branch, never a `.claude/worktrees/agent-` path).
2. **Rewrite the in-flight memory** — the file the project names (NuriHub / AE49_Hub:
   `.claude/memory/<person>/inflight-now.md`, REWRITTEN whole, never appended; projects without
   one: `inflight-<date>.md`): live sha + time, unpushed set and any rules/index deploy it needs,
   the gate counter, what is queued with its plan and approved rulings, the register rows, emulator
   state, the autopilot log path, the single next action. Keep the MEMORY.md index line current.
   Without git-synced per-person memory, write a handoff doc (`ae49-task-handoff`) instead and point the new
   session at it. Write a full `docs/handoffs/` doc ONLY when deep context does not fit (link it).
3. **Leave Autopilot exactly as it is.** The state file is machine-local; a new session on this
   machine reads it at start and, if ON, runs its `tick`. Never switch it off here, never write an
   off report.
4. **Backup push** — the project's no-deploy backup push, exactly as [close](close.md) step 7
   (that skill owns the command and the never-push-the-deploy-branch rule).
5. **Report in two or three lines and stop** — what was committed / pushed, anything the user still
   has to look at (a rollout, a deploy), and the one line to type in the NEW session:
   `/ae49-task-session` (bare — in the new, empty session it runs [open](open.md)) — then the 🤖 line. **The USER closes this session and opens the new one
   themselves. Main NEVER starts it** (no `start_session`, no sub-session, no dispatched agent that
   carries the work on): a session Main starts is linked to this one and runs beside it in the same
   checkout, which is exactly the parallel writer the swap is meant to avoid (owner 2026-10-27:
   *"ผมหมายถึงว่า จะปิด Session นี้ แล้วเดียวผมจะเปิดใหม่เอง ไม่ได้ให้คุณมาเปิดเป็น Sub Session"*).

Skipped on purpose: park branches, worktree parking, the 🎒 hand-carry list, the engines stop
(nothing may be running anyway — step 0), the close-day-park log entry (one line is optional), the
skills-repo sync check, the shutdown question.

For switching MACHINES, use [close](close.md) instead (work must travel via
git, with a 🎒 hand-carry list); this mode covers only a same-machine swap.

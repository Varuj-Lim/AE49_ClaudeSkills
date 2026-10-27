---
name: ae49-task-handoff
description: Close this session and continue in a fresh one ON THE SAME MACHINE (the DEFAULT mode — commit, rewrite the in-flight memory, keep Autopilot as it is, backup push, short report; the user then opens the new session and types /ae49-task-open-day), or, only when asked with the doc mode, write a handoff document for another agent. Use when the user says "/ae49-task-handoff", "handoff", "ปิด session", "เปิด session ใหม่", "close this session and open a new one", or accepts the router's fresh-session offer; use the doc mode when they say "handoff doc", "เขียนเอกสาร handoff", "write a handoff" for another agent, or pass the argument doc. For switching MACHINES use ae49-task-close-day instead.
argument-hint: "(empty) = close this session · doc [topic] = write a handoff document"
---

# Handoff

> *Adapted from [mattpocock/skills — productivity/handoff](https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff) by Matt Pocock ([MIT License](https://github.com/mattpocock/skills/blob/main/LICENSE)).*

## Which mode — the DEFAULT is closing the session (owner 2026-10-27)

- **No argument, or any wording about closing / switching session → Session-close mode** (the
  section below). This is what `/ae49-task-handoff` does unless the user says otherwise (owner:
  *"อยากให้การปิด Session เป็น Default ของ สกิล /ae49-task-handoff … ยกเว้นแต่ว่าเราเปลี่ยน"*).
- **`doc` argument, or the user asks for a handoff DOCUMENT for another agent → Doc mode** (the
  next section).
- **Switching machines → neither: `ae49-task-close-day`.**

## Doc mode — write a handoff document (only when asked)

Write a handoff document summarising the current conversation so a fresh agent can continue the work.

Save it INTO THE PROJECT at `docs/handoffs/<topic>.md` (a path relative to the project root / current workspace):

- `<topic>` is a short kebab-case slug naming what the handoff is about — derive it from the user's argument when one is given (e.g. "draftsman-grid-tweaks"), otherwise from the main thread of the conversation. The topic MUST appear in the filename.
- Check whether the `docs/handoffs/` directory exists FIRST; create it if it doesn't (it is not created automatically — `mkdir -p docs/handoffs` or the platform equivalent).
- After writing, AUTO-COMMIT it: stage ONLY the handoff file (never `git add -A` — other work may be in progress), commit with a concise message like `docs(handoff): <topic>`, and if a remote is configured run `git pull --rebase` then push so the handoff is durable and reachable from another machine/session. Then tell the user the exact path.
- **Branch guard.** Before staging, confirm HEAD is the default branch — `git rev-parse --abbrev-ref HEAD`. If it is any other branch, or the path contains `.claude/worktrees/agent-`, do NOT commit — write the handoff file, tell the user it's saved and the commit is held, and let them land it from the main checkout. Never `git checkout` on someone else's behalf.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments after `doc`, treat them as a description of what the next session will focus on and tailor the doc accordingly.

## Session-close mode (same machine, new session) — the DEFAULT, the FAST swap

When the intent is "close this session and continue in a fresh one ON THIS MACHINE" (the user
says "ปิด session", "เปิด session ใหม่", "close this session", accepts the router's fresh-session
offer, or hands off with no machine switch), run THIS — never `ae49-task-close-day`. Close-day is
for switching MACHINES: it parks trees on branches, builds a 🎒 hand-carry list and switches
Autopilot OFF, all of which only slow a same-machine swap down or break it (owner HQ1 a,
2026-10-27: *"ปิด session ได้ไวขึ้น … เครื่องเดิม แค่อยากเปิด Session ใหม่"*).

0. **Clean break or stop.** No sub-agent running, no gate section open on the board, no build
   staged but unlanded, no question asked and unanswered that lives only in chat (it must be in the
   open-items register). If any of these holds, say which and finish it (or register it) first.
   Uncommitted feature work in the tree is NOT parked: the new session opens the same checkout and
   finds it there — but name it in the in-flight file.
1. **Commit everything that is done** (explicit pathspec, never `git add -A`; branch guard above).
2. **Rewrite the in-flight memory** — the file the project names (NuriHub / AE49_Hub:
   `.claude/memory/<person>/inflight-now.md`, REWRITTEN whole, never appended; projects without
   one: `inflight-<date>.md`): live sha + time, unpushed set and any rules/index deploy it needs,
   the gate counter, what is queued with its plan and approved rulings, the register rows, emulator
   state, the autopilot log path, the single next action. Keep the MEMORY.md index line current.
   Without git-synced per-person memory, write the handoff doc as above instead and point the new
   session at it. Write a full `docs/handoffs/` doc ONLY when deep context does not fit (link it).
3. **Leave Autopilot exactly as it is.** The state file is machine-local; a new session on this
   machine reads it at start and, if ON, runs its `tick`. Never switch it off here, never write an
   off report.
4. **Backup push** — the project's no-deploy backup push, exactly as `ae49-task-close-day` step 7
   (that skill owns the command and the never-push-the-deploy-branch rule).
5. **Report in two or three lines and stop** — what was committed / pushed, anything the user still
   has to look at (a rollout, a deploy), and the one line to type in the NEW session:
   `/ae49-task-open-day` — then the 🤖 line. **The USER closes this session and opens the new one
   themselves. Main NEVER starts it** (no `start_session`, no sub-session, no dispatched agent that
   carries the work on): a session Main starts is linked to this one and runs beside it in the same
   checkout, which is exactly the parallel writer the swap is meant to avoid (owner 2026-10-27:
   *"ผมหมายถึงว่า จะปิด Session นี้ แล้วเดียวผมจะเปิดใหม่เอง ไม่ได้ให้คุณมาเปิดเป็น Sub Session"*).

Skipped on purpose: park branches, worktree parking, the 🎒 hand-carry list, the engines stop
(nothing may be running anyway — step 0), the close-day-park log entry (one line is optional), the
skills-repo sync check, the shutdown question.

For switching MACHINES, use `ae49-task-close-day` instead (work must travel via
git, with a 🎒 hand-carry list); this mode covers only a same-machine swap.

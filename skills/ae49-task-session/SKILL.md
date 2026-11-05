---
name: ae49-task-session
description: "Session ceremonies: open starts the day or a fresh session, swap closes THIS session on the SAME machine, close ends the day before switching MACHINES. No argument: NEW session runs open, used one swap; close only when typed. Use on เปิดวัน, เปิด session ใหม่, มาทำต่อ, ปิด session, ปิดวัน, ย้ายเครื่อง. Handoff DOCUMENT: ae49-task-handoff."
argument-hint: "(empty) = open in a new session / swap in a used one · open · swap · close"
---

# ae49-task-session — open · swap · close

**Owner ruling 2026-10-28** (merging `ae49-task-open-day`, `ae49-task-close-day` and the session-close mode of
`ae49-task-handoff`): a NEW session runs `open`; a bare command in a session that already holds data runs `swap`; ending
the day for real is typed `/ae49-task-session close`; no confirmation question. The doc mode stays in `ae49-task-handoff`.
The owner's words and the old-name map: [history.md](history.md).

## Which one runs — decided, never asked

| Typed | Session state | Runs | File |
|---|---|---|---|
| `/ae49-task-session` | NEW — this conversation has done no work yet (no tool call before it, or only the session-start skills and the autopilot check) | **open** | [open.md](open.md) |
| `/ae49-task-session` | USED — work has already happened in this conversation (tools ran, files changed, agents started) | **swap** | [swap.md](swap.md) |
| `/ae49-task-session open` | any | **open** | [open.md](open.md) |
| `/ae49-task-session swap` | any | **swap** | [swap.md](swap.md) |
| `/ae49-task-session close` | any | **close** | [close.md](close.md) |

- **No confirmation question.** The rule above IS the owner's answer; Main says in one line which verb it
  inferred ("เริ่ม open" / "เริ่ม swap") and runs it.
- **`close` is never inferred** — not from "ปิด session", not from a long session, not at night. Only the
  typed argument `close`, or the owner's words about switching machines / ending the day ("ปิดวัน",
  "ย้ายเครื่อง", "เอางานกลับบ้าน"), starts it.
- A compacted session counts as USED (the summary proves work happened) → `swap`.
- The router's clean break in a long session runs `swap` (`ae49-router` § Session length).

## What each verb does — one line

- **open** — bring this machine up to the project's latest state and start the day: fetch + ff, skills
  sync, 🎒 check, restore a park branch, gate, Autopilot ON (`ask`, every row), the board. On the same
  machine after a `swap` it takes the fast path (no park, no carry list to check).
- **swap** — the fast same-machine hand-over: clean break, commit, rewrite the in-flight memory, Autopilot
  left AS IS, backup push, a 2–3-line report ending with `/ae49-task-session` for the NEW session. Main never
  opens the new session itself.
- **close** — make the work travel to another machine: Autopilot OFF + its report, stop the engines, park
  the hub tree and queued builds on `park/` / agent branches, the 🎒 carry list, backup push, skills-repo
  check, the report. The machine stays ON unless the owner says to shut it down.

## Iron rules — all three verbs

- **Never push the deploy branch** (`main` in the hubs — push == deploy). Only the project's no-deploy backup
  push (`git push origin main:backup`; `web-ref-deploy-landing` owns the command).
- **Fast-forward only** on open; a diverged history or a dirty tree where a clean one was expected → STOP
  and show the owner. Never `reset --hard`, never force-push, never guess which side wins.
- **The open-items register is rendered whole** (`docs/plans/_open-items.md`, `ae49-router` §"The
  open-items register"): no verb may write "backlog cleared" / "nothing open" while a row exists.
- **Every report** follows `ae49-ref-report-format` and ends with the 👤 line and the 🤖 Autopilot line.
- `park/*` and worktree-agent branches are TRANSPORT ONLY — never merged, never a PR; the landing of their
  feature deletes them (`git push origin --delete park/<name>`), never open.

## Emulator auto-close — swap and close (owner 2026-11-05)

Owner: *"ตอนสั่ง /ae49-task-session ถ้าหากไม่มีงานอะไรเหลือค้างเลย ให้ปิด Emu อัตโนมัติไม่ต้องรอผมบอก"*. As the last step
before the report, **swap** and **close** probe the project's emulator suite (its hub port, `web-ref-local-emulator`) and,
when it is up and NOTHING pending uses it, Main safe-closes it itself without asking:
- **Nothing pending means:** no plan building, in audit or at its gate; no gate section open; no `ae49-gate` agent,
  builder probe or harness on the suite; nothing queued to start next that needs it. A register row held on the owner's
  word or on a date does not count.
- **How:** the project's safe-stop launcher (it exports the data first) in its own visible cmd window, exactly as
  `web-ref-local-emulator` § 1's second bend presses it, then its safe-kill check (ports free, no orphan `java` / `node`).
- **Report:** one line, `ปิด emulator แล้ว — ไม่มีงานค้าง` with the tab link. Something pending → the suite stays up and
  the line names what still uses it. The launcher refuses or the export fails → leave it up and quote the exact message.
- **open** does not auto-close: a suite that is up at open was usually just started by the owner for the day's work.


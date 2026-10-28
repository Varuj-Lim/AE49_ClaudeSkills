---
name: ae49-task-session
description: The session ceremonies of an ae49-workflow project (AE49_Hub, Nuri_Hub, siblings) — `open` starts the day or a fresh session (ff main from backup, skills sync, 🎒 check, restore a parked tree, re-open the gate, Autopilot ON in ask, the board); `swap` closes THIS session on the SAME machine (commit, rewrite in-flight memory, Autopilot as is, backup push; the user opens the new one); `close` ends the day before switching MACHINES (Autopilot OFF + report, stop engines, park trees on transport branches, 🎒 carry list, backup push). No argument: a NEW session runs open, a used one runs swap; close runs only when typed. Use on /ae49-task-session, "เปิดวัน", "มาทำต่อ", "เปิด session ใหม่", "ปิด session", "ปิดวัน", "ย้ายเครื่อง", "open/close the day", or when the owner accepts the router's fresh-session offer. A handoff DOCUMENT is ae49-task-handoff.
argument-hint: "(empty) = open in a new session / swap in a used one · open · swap · close"
---

# ae49-task-session — open · swap · close

**Owner ruling 2026-10-28** (merging `ae49-task-open-day`, `ae49-task-close-day` and the
session-close mode of `ae49-task-handoff`): *"ถ้าเป็นการเริ่ม Session ใหม่ จะเป็น open ถ้า ผมพิมเฉยๆ ตอนที่
session มีข้อมูลมาแล้ว เป็น swap แล้วถ้าผมต้องการปิดวันจริงๆ ผมจะเขียนว่า /ae49-task-session close"* — and
*"ไม่ต้องถามยืนยัน คุณลุยเลยได้"*. The three were one subject (they pointed at each other both ways and ran
as pairs); one name with three verbs is easier to reach for. The doc mode stays in `ae49-task-handoff`.

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
- The router's fresh-session offer, when accepted, runs `swap`.

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

## Old name → where it lives now

| Old | Now |
|---|---|
| `ae49-task-open-day` (whole, steps 1–8 incl. 7b) | `open.md`, same step numbers |
| `ae49-task-close-day` (whole, "First of all" + steps 0–10) | `close.md`, same step numbers |
| `ae49-task-handoff` § "Session-close mode" (steps 0–5) | `swap.md`, same step numbers |
| `ae49-task-handoff` § "Doc mode" | stays in `ae49-task-handoff` (now its only mode) |

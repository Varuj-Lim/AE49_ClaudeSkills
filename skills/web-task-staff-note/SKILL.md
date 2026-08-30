---
name: web-task-staff-note
description: >-
  The shared staff-note workflow for every hub project (AE49_Hub, NuriHub, future
  siblings) — an OWNER-authored ticket that asks the team something (ask) or tells the
  team something (inform), filed so a decision surfaced mid-work is never lost before
  the next conversation. Use whenever the owner says "เปิด ticket บอก user", "จดไว้ถามทีม",
  "เขียน ticket แจ้งทีม", or a session surfaces a policy question staff must weigh in on.
  The PROCESS lives here and changes here once; each project's own skill supplies the
  FACTS: its filing script path, how ask/inform are marked (dedicated ticket types or a
  title prefix), owner identity, and status vocabulary. Reverse direction of a normal
  ticket (owner → staff); never a release note (that is the patch-note workflow) and
  never a broadcast — filing notifies nobody.
---

# Staff note — owner → team agenda ticket (shared canon)

## What it is

A **staff note** is a ticket the OWNER files toward the team, in two intents:

- **ask** (ถามทีม) — a question the team must answer before work proceeds.
- **inform** (แจ้งทีม) — a fact or rule the team must know.

It deliberately lives in the project's ONE ticket queue — same list, same
open → resolved lifecycle — so nothing new must be checked. How the two intents are
marked is a **project fact** (a dedicated ticket type where the app has one; a title
prefix where it does not yet).

**It notifies nobody.** Hub ticket systems ping developers on creation, and a staff
note is authored BY the developer side — so no bell rings anywhere. That is by
design: a staff note is an agenda item the owner raises in person; the ticket is the
durable record. A real push-to-staff channel with read receipts is the
"Announcements module" decision — its own plan, never smuggled in here.

## Filing one

1. **Pick the intent** — ask or inform. One decision per ticket; two questions are
   two tickets, so each resolves alone.
2. **Write the body in plain language** (staff read it — no file paths, no code, no
   jargon; same bar as a patch note):
   - บริบทสั้นๆ — เรื่องนี้มาจากไหน เกิดอะไรขึ้น
   - สิ่งที่ทีมต้องรู้ (bullet ได้)
   - คำถามที่ต้องเคาะ เป็นข้อๆ (สำหรับ ask)
   - ตัวเลือกที่เสนอ + ข้อดีข้อเสีย ถ้ามี
   - ลงนามเจ้าของ
3. **File through the project's script** (per the project skill), dry-run first,
   read the doc back, then apply. The script attributes the ticket to the owner and
   writes the project's activity-log entry exactly as the in-app form would.

## Resolution

When the owner reports the team's answer, the normal ticket write-back applies (the
`web-task-ticket-to-plan` two-step, via the project's update script): the answer goes
into the response field, the status moves, and any resulting build work routes through
the normal grill → plan flow. In ticket listings, an **ask** note with no answer yet is
skipped — never "clarified" by Claude inventing the team's answer.

## Project facts each sibling skill supplies

| Fact | Example (NuriHub) |
|---|---|
| Filing script | `scripts/staff-note-ticket.cjs` (dry-run default, `--apply` writes) |
| Marking | dedicated ticket types `ask` / `inform` — labels Ask / Inform (landed 2026-08-30; a developer may also file them from the in-app create form) |
| Owner identity | the fixed owner email the script resolves live |
| Status vocabulary | the project's ticket statuses |

AE49_Hub: facts skill + script port pending (canon adopted 2026-08-30 from NuriHub's
convention; port them in an AE49_Hub session and update its facts skill there).

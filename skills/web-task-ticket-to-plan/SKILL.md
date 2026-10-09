---
name: web-task-ticket-to-plan
description: The shared ticket-to-plan doorway for every hub project (AE49_Hub, Nuri_Hub, siblings) - read the support tickets, let the owner pick, clarify until the intent is settled, then hand off into the NORMAL plan flow - plus the ticket-queue ORDER (priority tier first, missing = normal, oldest first within a tier, Priority after Status) in queue-order.md and the owner-to-team STAFF NOTE (an ask / inform ticket, notifies nobody) in staff-note.md. Use for "ticket to plan", "read the tickets", "ดู ticket", "what did staff request/report", any ticket listing, any priority or ordering ruling, "เปิด ticket บอก user", "จดไว้ถามทีม", "เขียน ticket แจ้งทีม", or when a session surfaces a policy question staff must weigh in on. The two-step write-back (plan APPROVAL = in_progress only; PUSH = resolved + the ONE Thai reply; none at the gate PASS) is in hard-rules.md; tickets are cited by HUMAN CODE (TK0007). The project's own ticket skill supplies the facts.
---

# Ticket → Plan — shared doorway workflow

Merged 2026-10-09 (plan `skills-merge-sweep` M2, owner SQ1 a): the ticket-queue ordering canon and the
staff-note workflow are topics of this folder; the doorway's own long sections moved into topic files
(owner MQ1 b) so this index stays under the 150-line cap. Every section was moved WHOLE.

## Read X when Y

| File | Read it when |
|---|---|
| [hard-rules.md](hard-rules.md) | citing a ticket (human code, not doc id), the two-step write-back (approval = status only, push = the one reply), the fuller reply for a `bug` ticket, writing directly with no approval round trip |
| [flow.md](flow.md) | running the flow: list → pick → read in full (attachments, the ticket card first) → clarify → hand off → write back; listing-table output notes |
| [queue-order.md](queue-order.md) | ordering or columning ANY ticket listing, editing a project's ticket list script, or a ruling on ticket priority / ordering |
| [staff-note.md](staff-note.md) | the owner files a ticket TO the team ("เปิด ticket บอก user", "จดไว้ถามทีม", "เขียน ticket แจ้งทีม"): ask / inform, filing, resolution |

## Old name → where it lives now

| Old skill | Now |
|---|---|
| `web-ref-ticket-queue` | `web-task-ticket-to-plan/queue-order.md` |
| `web-task-staff-note` | `web-task-ticket-to-plan/staff-note.md` |
| this skill's sections "Shared hard rules" / "The flow" + "Output notes" | `hard-rules.md` / `flow.md` (headings unchanged) |

**Scope (old description of this skill, 2026-10-09):** The shared ticket-to-plan doorway workflow for every hub project (AE49_Hub, Nuri_Hub, and future siblings) — read the support tickets, let the owner pick, clarify until the intent is settled, then hand off into the project's NORMAL plan flow. Use when the user wants to work from tickets in ANY hub project — "ticket to plan", "read the tickets", "ดู ticket", "what did staff request/report" — alongside that project's own ticket skill, which supplies the facts: script paths, collection/status vocabulary, priority tiers, attachment markers, actor identity, and notification behavior — the two-step write-back itself (plan APPROVAL → in_progress only, no reply, owner ruling 2026-09-08; PUSH → resolved + the ONE Thai reply — deliberately NO reply at the gate PASS, owner ruling 2026-09-10 collapsing the former three-step rule) lives HERE and is identical in every hub. The process changes HERE once; project skills never restate it. Tickets are cited by their HUMAN CODE (AE49 `TK0007`) wherever the owner reads, never by the raw doc id (owner ruling 2026-09-09).

Staff file bugs and suggestions at each hub's Support → Tickets. This skill is
the ONE process for turning them into `docs/plans/` work: **read and clarify,
then hand off** — the plan itself is produced by the normal `plan:` lane. Each
project's ticket skill (`ae49Hub-task-ticket-to-plan`,
`nurihub-task-ticket-to-plan`) declares its facts;
this file never carries a path, uid, or collection name — the process and the response templates live here.

## What each project's ticket skill must declare

Script paths and invocations · collection name and doc shape · status
vocabulary · priority tiers (the `queue-order.md` facts) · attachment
markers and image-field semantics · write-back FACTS (script, actor identity,
notification behavior) · any project-only statuses or fields.

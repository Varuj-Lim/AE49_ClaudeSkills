---
name: web-task-ticket-to-plan
description: The shared ticket-to-plan doorway workflow for every hub project (AE49_Hub, Nuri_Hub, and future siblings) — read the support tickets, let the owner pick, clarify until the intent is settled, then hand off into the project's NORMAL plan flow. Use when the user wants to work from tickets in ANY hub project — "ticket to plan", "read the tickets", "ดู ticket", "what did staff request/report" — alongside that project's own ticket skill, which supplies the facts: script paths, collection/status vocabulary, priority tiers, attachment markers, and its OWN write-back rules. The process changes HERE once; project skills never restate it.
---

# Ticket → Plan — shared doorway workflow

Staff file bugs and suggestions at each hub's Support → Tickets. This skill is
the ONE process for turning them into `docs/plans/` work: **read and clarify,
then hand off** — the plan itself is produced by the normal `plan:` lane. Each
project's ticket skill (`ae49Hub-task-ticket-to-plan`,
`nurihub-task-ticket-to-plan`) declares its facts and its write-back rules;
this file never carries a path, uid, collection name, or response template.

## Shared hard rules

- **No plan writing here.** After clarification, hand off to the normal flow —
  short grill in Main, then dispatch `ae49-plan` per the router skill. One plan
  per settled spec; a ticket may also turn out to be a tiny fix (router's
  tiny-fix fast path) or a duplicate of an existing plan — say so instead of
  forcing a plan.
- **Ticket writes happen ONLY at moments the owner owns — never on Main's
  initiative, and never before the work is on PRODUCTION.** A landed-but-
  unpushed feature is invisible to the requester; closing their ticket then
  sends them looking for something that is not there (it happened, 2026-08-17).
  WHAT gets written differs per project and lives in the project skill (AE49:
  two-step Thai responses at gate-pass and push; Nuri: status-only resolve
  after push, replies are the owner's to write in the app). Follow the project
  skill exactly; when in doubt, read it before touching a ticket.

## The flow

1. **List** — run the project's read-only list script (path in the project
   skill). Default scope = **open + in_progress + on_hold** (owner ruling
   2026-08-13); `--status all` / `--status <one>` widens on request. Render as
   a table (English, per `ae49-ref-report-format`): ID · Status · Priority ·
   Type · Date · Requester · Title, one row per ticket, **ordered per
   `web-ref-ticket-queue`** (priority tier first, oldest first within each
   tier). Tier vocabulary and attachment/answered markers are the project
   skill's facts.

2. **Pick** — ask the owner which ticket(s) to take up (by ID or title). Don't
   auto-pick, don't rank by your own judgment unless asked.

3. **Read in full** — `--id <docId>` for the full description and any existing
   response. If there is an attachment, say a screenshot exists and ask the
   owner to open it in the app if its content matters (the scripts cannot view
   Storage images).

   **Always show the owner the ticket card FIRST (owner rule 2026-08-25,
   shared).** The moment a ticket is picked up — and again whenever work on it
   resumes in a later message — render its full card in chat BEFORE any
   analysis, question, or action: **Title · Description (verbatim, in full) ·
   Type · Priority · Status · Date · Requester** (+ attachment markers and the
   ID). Never discuss a ticket by row number or bare ID alone: the owner must
   never have to scroll back or open the app to know which ticket is on the
   table. **Every batch of clarifying questions opens by restating which
   ticket it is about** (title + requester at minimum, the full card if
   anything else was said in between) — a question block arriving after
   unrelated output with no ticket header caused real confusion on 2026-08-25.

4. **Clarify — the point of this skill.** Before any planning, ask the owner
   the questions the ticket leaves open, per the grill discipline (one at a
   time, each with a recommendation). Typical gaps in staff tickets: what
   outcome the requester actually wants vs what they suggested; bug vs change
   request; scope (one page or app-wide); who else is affected; priority vs
   the current board. A vague two-line suggestion usually needs 2–4 questions.
   Stop when Main could defend the spec to the `ae49-plan` agent.

5. **Hand off** — summarise the settled spec in 2–3 sentences, name the source
   ticket (ID + title) so the plan's Context section can cite it, and continue
   exactly as a `plan:` request: remaining grill → dispatch `ae49-plan` →
   approve → `impl:` → audit → gate chain. **Carry the ticket id forward** — a
   plan whose Context does not name its source ticket cannot be closed
   cleanly later.

6. **Close — per the project's write-back rules, at the owner's own words**
   (see the shared hard rule above). Dry-run first, show the owner what will
   change, `--apply` only after it reads right.

## Output notes

Listing tables and finding-style output follow `ae49-ref-report-format`;
clarifying questions follow `ae49-task-grill`.

## What each project's ticket skill must declare

Script paths and invocations · collection name and doc shape · status
vocabulary · priority tiers (the `web-ref-ticket-queue` facts) · attachment
markers and image-field semantics · write-back rules, actor identity, and
response language/templates · any project-only statuses or fields.

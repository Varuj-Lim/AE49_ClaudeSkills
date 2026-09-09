---
name: web-task-ticket-to-plan
description: The shared ticket-to-plan doorway workflow for every hub project (AE49_Hub, Nuri_Hub, and future siblings) — read the support tickets, let the owner pick, clarify until the intent is settled, then hand off into the project's NORMAL plan flow. Use when the user wants to work from tickets in ANY hub project — "ticket to plan", "read the tickets", "ดู ticket", "what did staff request/report" — alongside that project's own ticket skill, which supplies the facts: script paths, collection/status vocabulary, priority tiers, attachment markers, actor identity, and notification behavior — the three-step write-back itself (plan APPROVAL → in_progress only, no reply, owner ruling 2026-09-08; gate PASS → in_progress + Thai reply; PUSH → resolved + Thai reply, owner ruling 2026-08-26) lives HERE and is identical in every hub. The process changes HERE once; project skills never restate it. Tickets are cited by their HUMAN CODE (AE49 `TK0007`) wherever the owner reads, never by the raw doc id (owner ruling 2026-09-09).
---

# Ticket → Plan — shared doorway workflow

Staff file bugs and suggestions at each hub's Support → Tickets. This skill is
the ONE process for turning them into `docs/plans/` work: **read and clarify,
then hand off** — the plan itself is produced by the normal `plan:` lane. Each
project's ticket skill (`ae49Hub-task-ticket-to-plan`,
`nurihub-task-ticket-to-plan`) declares its facts;
this file never carries a path, uid, or collection name — the process and the response templates live here.

## Shared hard rules

- **Cite tickets by their HUMAN CODE, never by the doc id (owner ruling
  2026-09-09: "ตอนคุณบอกระบุมาเป็น ID ที่มองไม่ได้ง่ายๆ ใน web").** A Firestore doc
  id is invisible on the web; the code (AE49 and NuriHub: `TK0007`, first column of
  Support → Tickets, in the modal title, the bells and the search box) is what
  the owner can find. So chat cards, listing tables, plan `Context` lines,
  commit messages and patch notes name the CODE + title. The doc id is only
  ever a script argument, and the project scripts accept the code there too.
  A project that has no code yet cites the doc id and says so in its project
  skill — none today: AE49_Hub and NuriHub both mint `TK` codes (2026-09-09).
- **No plan writing here.** After clarification, hand off to the normal flow —
  short grill in Main, then dispatch `ae49-plan` per the router skill. One plan
  per settled spec; a ticket may also turn out to be a tiny fix (router's
  tiny-fix fast path) or a duplicate of an existing plan — say so instead of
  forcing a plan.
- **Ticket writes happen at exactly THREE moments, all owned by the owner —
  never on Main's initiative (owner ruling 2026-08-26, unified across the
  hubs, supersedes NuriHub's 2026-08-17 status-only rule; the APPROVAL step
  was added by owner ruling 2026-09-08 so staff can see a ticket is being
  worked on — picking a ticket up for reading/clarifying still writes
  nothing, because a picked ticket may turn out to be a duplicate or a
  no-plan):**
  0. **At the owner's APPROVAL of the plan that cites the ticket** →
     `status: in_progress` and NOTHING else — no response text (owner ruling
     2026-09-08: "แค่เปลี่ยน Status พอ ไม่ต้องอธิบาย" — the explanation is
     written only when the work is done, at the two moments below). Silent
     (no bell). Run the project's update script with `--status in_progress`
     and no response argument.
  1. **At the owner's gate PASS** for the feature that answers the ticket →
     keep `in_progress`, add the Thai response saying it is done and waiting
     for the next deploy.
  2. **At the owner's PUSH** (production deploy) → `status: resolved` + a
     Thai response saying it is live now.
  Templates (plain Thai, keep the app's English labels; one or two
  sentences, say WHAT changed for the requester, never the internals):
  - **PASS:** `ทำเสร็จแล้วครับ — <สิ่งที่เปลี่ยนสำหรับผู้ยื่น 1 ประโยค> รอขึ้นระบบจริงในรอบ deploy ถัดไป จะแจ้งอีกครั้งเมื่อใช้ได้`
  - **PUSH:** `ขึ้นระบบแล้วครับ — <สิ่งที่เปลี่ยน 1 ประโยค> ลองใช้ได้เลย ถ้าไม่ตรงที่ต้องการแจ้งกลับได้ที่ ticket นี้`
  **Write directly — no approval round trip (owner ruling 2026-09-08 evening:
  "เขียนไปได้เลย แค่บอกผมว่าเขียนว่าอะไร ไม่ต้องขออนุญาต").** The owner's PASS /
  PUSH / approve word IS the authorization: compose the reply from the
  template, `--apply` it, and REPORT the exact text written (the owner checks
  it in the app when it goes out). The script's dry-run stays Main's own
  sanity check (ticket found, status transition right, bell decision as
  expected), not a gate the owner has to read; it replaced an
  "always show first" rule that cost a round trip per ticket. One ticket per
  call; only for a ticket the plan cites; never `rejected` unless the owner
  says so; and **never before the work is on PRODUCTION** — a
  landed-but-unpushed feature is invisible to the requester (it happened,
  2026-08-17). Script paths, actor identity, and notification behavior are
  the project skill's facts.

## The flow

1. **List** — run the project's read-only list script (path in the project
   skill). Default scope = **open + in_progress + on_hold** (owner ruling
   2026-08-13); `--status all` / `--status <one>` widens on request. Render as
   a table (English, per `ae49-ref-report-format`): Code · Status · Priority ·
   Type · Date · Requester · Title (Code = the human code; the doc id only
   where the project has no code yet), one row per ticket, **ordered per
   `web-ref-ticket-queue`** (priority tier first, oldest first within each
   tier). Tier vocabulary and attachment/answered markers are the project
   skill's facts.

   **`in_progress` tickets are NOT rows (owner rule 2026-09-08).** A ticket
   that is `in_progress` AND cited by an open plan (grep its code — or its
   doc id where no code exists — in `docs/plans/*.md`) is work already moving — nothing blocks it, so it only
   pads the table. Leave it out and say it in ONE line under the table:
   `N in_progress — carried by <plan slugs>`. Show an `in_progress` ticket as
   a row ONLY when no plan carries it, flagged ⚠️ — that is a ticket someone
   flipped and then forgot, and it needs a pick like any open one.

2. **Pick** — ask the owner which ticket(s) to take up (by code or title). Don't
   auto-pick, don't rank by your own judgment unless asked.

3. **Read in full** — `--id <code|docId>` (the project script resolves the
   human code; the doc id still works) for the full description and any
   existing response. **Attachments: fetch and LOOK at them yourself — never ask the
   owner to open the app (owner ruling 2026-09-08, standing authorization in
   every hub; asking each time was the complaint).** Each image field on the
   doc is a plain download URL (Firebase Storage `?alt=media&token=…`, no
   auth needed); pull every attachment into the session scratchpad and view it
   with the image-capable Read tool BEFORE asking any question the picture
   might already answer:

   ```
   curl -sSL --max-time 60 -o "<scratchpad>/ticket-<id6>-<n>.png" "<attachmentUrl>"
   ```

   Then say in the card, in one line, what the screenshot shows. The list
   scripts stay text-only on purpose — the fetch is a shell step, not a script
   feature. If a fetch fails (expired token, deleted file), say so and only then
   ask the owner to open it in the app.

   **Always show the owner the ticket card FIRST (owner rule 2026-08-25,
   shared).** The moment a ticket is picked up — and again whenever work on it
   resumes in a later message — render its full card in chat BEFORE any
   analysis, question, or action: **Title · Description (verbatim, in full) ·
   Type · Priority · Status · Date · Requester** (+ attachment markers and the
   CODE). Never discuss a ticket by row number or bare doc id alone: the owner must
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
   ticket (code + title) so the plan's Context section can cite it, and continue
   exactly as a `plan:` request: remaining grill → dispatch `ae49-plan` →
   approve → `impl:` → audit → gate chain. **Carry the ticket CODE forward** (the
   doc id beside it is optional) — a plan whose Context does not name its source
   ticket cannot be closed cleanly later.

6. **Write back — the three-step rule above, at the owner's own words.** The
   approval step fires the moment the owner approves a plan whose Context
   cites the ticket; every step writes directly and reports the text
   afterwards (no "show first" round trip); the project skill names the
   script, the actor identity, and whether a bell notification accompanies
   the write.

## Output notes

Listing tables and finding-style output follow `ae49-ref-report-format`;
clarifying questions follow `ae49-task-grill`.

## What each project's ticket skill must declare

Script paths and invocations · collection name and doc shape · status
vocabulary · priority tiers (the `web-ref-ticket-queue` facts) · attachment
markers and image-field semantics · write-back FACTS (script, actor identity,
notification behavior) · any project-only statuses or fields.

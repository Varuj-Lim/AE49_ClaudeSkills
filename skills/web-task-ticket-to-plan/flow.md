**Scope (part of web-task-ticket-to-plan, split out 2026-10-09):** the six-step flow (list → pick → read in full → clarify → hand off → write back) and the output notes. Moved whole from the `SKILL.md` sections "The flow" and "Output notes". The write-back it names is [hard-rules.md](hard-rules.md); the listing order is [queue-order.md](queue-order.md).

## The flow

1. **List** — run the project's read-only list script (path in the project
   skill). Default scope = **open + in_progress + on_hold** (owner ruling
   2026-08-13); `--status all` / `--status <one>` widens on request. Render as
   a table (English, per `ae49-ref-report-format`): Code · Status · Priority ·
   Type · Date · Requester · Title (Code = the human code; the doc id only
   where the project has no code yet), one row per ticket, **ordered per
   `queue-order.md`** (priority tier first, oldest first within each
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

6. **Write back — the two-step rule above, at the owner's own words.** The
   approval step fires the moment the owner approves a plan whose Context
   cites the ticket, and writes STATUS ONLY; the reply itself is written once,
   at the owner's push. **A gate PASS writes NOTHING to the ticket.** Both
   writes go directly and report the text afterwards (no "show first" round
   trip); the project skill names the script, the actor identity, and whether a
   bell notification accompanies the write.

## Output notes

Listing tables and finding-style output follow `ae49-ref-report-format`;
clarifying questions follow `ae49-task-grill`.

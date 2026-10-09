**Scope (part of web-task-ticket-to-plan, split out 2026-10-09):** the hard rules every hub shares for a ticket — human-code citation, no plan writing here, the TWO write-back moments (approval → `in_progress`; push → `resolved` + the one reply), the fuller reply for a `bug` ticket, and writing directly with no approval round trip. Moved whole from the `SKILL.md` section "Shared hard rules".

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
- **Ticket writes happen at exactly TWO moments, both owned by the owner —
  never on Main's initiative (owner ruling 2026-09-10, which COLLAPSED the
  former three-step rule; it supersedes the 2026-08-26 unification and
  NuriHub's older 2026-08-17 status-only rule. Picking a ticket up for
  reading/clarifying still writes nothing, because a picked ticket may turn
  out to be a duplicate or a no-plan):**
  1. **At the owner's APPROVAL of the plan that cites the ticket** — or its AUTO-approval
     (a plan holding nothing beyond the grill, `ae49-router` owner rule 2026-10-06, counts as
     the owner's approval) →
     `status: in_progress` and NOTHING else — no response text (owner ruling
     2026-09-08: "แค่เปลี่ยน Status พอ ไม่ต้องอธิบาย"). Silent (no bell). Run the
     project's update script with `--status in_progress` and no response
     argument.
  2. **At the owner's PUSH** (production deploy) → `status: resolved` + a
     Thai response saying it is live now. **This is the ONLY moment a reply is
     ever written.**

  **There is deliberately NO reply at the gate PASS (owner ruling 2026-09-10,
  "ยุบเหลือตอบตอน push").** A "done, waiting for the next deploy" reply used to go
  out at the gate; it is removed because the gap between a PASS and a push is
  not reliably short — NuriHub was sitting on 23 unpushed commits the day this
  was ruled. A reply saying เสร็จแล้ว while the feature is not on production
  sends the requester looking for something that is not there, which is exactly
  the 2026-08-17 burn: **a landed-but-unpushed feature is invisible to the
  requester.** Silence until the push is the honest state, and `in_progress`
  already tells staff the ticket is being worked on. That clause — **never
  write a reply before the work is on PRODUCTION** — now governs every write
  with nothing contradicting it; under the old three-step rule it sat in direct
  tension with the gate-PASS step, which is how the rule came to be
  re-examined.

  Template (plain Thai, keep the app's English labels; one or two sentences,
  say WHAT changed for the requester, never the internals):
  - **PUSH:** `ขึ้นระบบแล้วครับ — <สิ่งที่เปลี่ยน 1 ประโยค> ลองใช้ได้เลย ถ้าไม่ตรงที่ต้องการแจ้งกลับได้ที่ ticket นี้`

  **A `bug` ticket gets a FULLER reply — the one-sentence template is not enough
  (owner ruling 2026-09-13).** A suggestion's author asked for a change and only
  needs to know it is live. A bug's author *reported a symptom* and is owed an
  answer to the question they actually asked: **was I right about what was
  happening, and is it gone now?** A bare "ขึ้นระบบแล้วครับ — X เปลี่ยนแล้ว" lets
  them assume their symptom is fixed when often only part of it is, and they find
  out the hard way in front of a customer. So a bug reply covers, in plain Thai,
  in this order — each a sentence or two, skipping any that genuinely does not
  apply:

  1. **What was actually wrong** — the real cause, in the requester's words, not
     the code's. Say so plainly when it differs from what they guessed; they gave
     you a symptom, not a diagnosis, and being corrected kindly is useful to them.
  2. **What changed** — the fix, as they will experience it.
  3. **What did NOT change, when part of the symptom remains** — never let silence
     imply the whole thing is gone. Name what still behaves the old way and why
     (an external system's rule we do not control, a deliberate decision, a
     follow-up ticket).
  4. **What they should do now** — including undoing any workaround they built.
     People keep their workarounds running for months otherwise.
  5. **How to tell it is working**, when that is not obvious from just using it.

  Still plain words, still no internals — no file names, no field names, no
  collection names, no commit ids. Length follows the bug: a one-line typo fix
  stays one line; a bug whose cause turned out to be different from the report
  needs all five points. The rule is that nothing true and useful to the reporter
  is left out, not that the reply must be long.

  **Write directly — no approval round trip (owner ruling 2026-09-08 evening:
  "เขียนไปได้เลย แค่บอกผมว่าเขียนว่าอะไร ไม่ต้องขออนุญาต").** The owner's PUSH /
  approve word IS the authorization: compose the reply from the template,
  `--apply` it, and REPORT the exact text written (the owner checks it in the
  app when it goes out). The script's dry-run stays Main's own sanity check
  (ticket found, status transition right, bell decision as expected), not a
  gate the owner has to read; it replaced an "always show first" rule that cost
  a round trip per ticket. One ticket per call; only for a ticket the plan
  cites; never `rejected` unless the owner says so. Script paths, actor
  identity, and notification behavior are the project skill's facts.

**Scope (part of web-task-ticket-to-plan, added 2026-11-07, owner CQ27 a):** the OPT-IN estimated-hours rule for a hub
whose client is billed against a monthly hour cap: state an estimate (ชั่วโมงประเมิน) when a ticket is taken up, repeat it
at the closing reply, and build the monthly summary on request. Off unless the project turns it on.

## Estimated hours (ชั่วโมงประเมิน) — opt-in

**Why.** The client agreements count work from the estimate written on each ticket BEFORE work starts, never from
measured time, cap it at 40 estimated hours a month (the rest moves to the next month), and ask for a monthly summary.
Writing the figure by hand was fiddly, so Main states it at the two write-back moments ([hard-rules.md](hard-rules.md)).

**Switch.** The rule applies ONLY when the project's own `CLAUDE.md` holds this exact line:

```
Ticket estimated hours: ON — follow web-task-ticket-to-plan/estimated-hours.md (ชั่วโมงประเมิน, สรุปรายเดือน)
```

No line → none of this section applies, and the two write-backs stay exactly as `hard-rules.md` says.

**The method — the same for every ticket.**
- The figure is the effort a human developer would spend on the WHOLE ticket: clarify, build, test, deploy, reply.
  Estimate each part, add them, round UP to the half-hour grid, minimum 0.5 (written `3.5 ชม.`, per
  `web-ref-date-time` § 3).
- **Never Claude's own run time** — it is far shorter than human effort and would mislead the client; never lowered
  because the work went fast.
- Always labelled **ชั่วโมงประเมิน**, never "ใช้เวลา" or anything that reads as measured time. A hub whose ticket replies
  are English (its project skill says so) writes `Estimated hours: 3.5 h` in the ticket; chat with the owner stays Thai.

**1. Taking the ticket** (plan approval, auto-approval, or the owner's go-ahead on a no-plan fix):
- Say the figure in chat with a one-line breakdown, and the month's running total (estimates of tickets closed this
  month plus those `in_progress`). If this ticket takes the month past 40, say so; the owner picks what moves to next month.
- Write it into the plan's Context next to the ticket code.
- **The approval write carries ONE reply in these projects** — `ชั่วโมงประเมิน: 3.5 ชม.` and nothing else — because the
  contract needs the estimate on the ticket before work starts. This is the only exception to "approval = status only".
- **Scope grows after that** (the requester adds to the ticket, the owner widens it): post a new reply BEFORE the extra
  work, `ชั่วโมงประเมินใหม่: 5 ชม. (เดิม 3.5 ชม.) — <เหตุผล 1 ประโยค>`. Same scope, wrong guess → the figure stays.

**2. Closing the ticket** (the PUSH reply): end the normal reply with `ชั่วโมงประเมิน: 3.5 ชม.`; if the figure changed
since step 1, `ชั่วโมงประเมิน: 5 ชม. (เดิม 3.5 ชม. — <เหตุผล>)`.

**3. Monthly summary — on "สรุปรายเดือน"** (default: the previous Thai calendar month; the owner may name one):
- Source: the tickets themselves — `resolved` tickets whose resolve date (ICT) falls in the month, each one's latest
  estimate line from its thread. A ticket closed without a line is listed as `?` and named to the owner, never guessed.
- Output, in the hub's reply language: a table `Code · Title · Estimated hours · Closed`, the total, then
  `Carried to next month` — tickets that got an estimate but were not closed by month end (`Code · Title · Estimated hours · Status`).
- Meeting time the contract counts is a separate row, with the hours the owner gives; never assumed.
- Total over 40 → say so plainly; the contract caps a month at 40, so the owner decides which tickets count next month.
- Show it in chat for the owner to send; Main sends nothing to the client.

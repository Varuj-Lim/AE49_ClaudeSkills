# AE49 changelog — changes to the shared pages

Written by AE49_Hub's session in the same turn as each landing whose commit touches a path in `pages.md`
(`web-ref-deploy-landing` §5a); newest at the bottom. A parity run reads the rows after its hub's baseline.
A row added later by a parity run's safety net says `(safety net, <hub> <date>)` in `Change`.

| Date | AE49 commit | Page | Change | Other hubs should | หมายเหตุ |
|---|---|---|---|---|---|
| 2026-11-04 | `8b1789c4` | Rules over these pages (8) | `isEmployee()` on users read, tickets read/create + submitter update arms, replies, settings, patchNotes, counters, activityLogs, notification create, `member()`, storage `tickets/` read/write/delete; RD keeps a login's email / hasLogin; ticket create type whitelist + `enteredByUid` = caller (create only) | AE49 only | AE49 รับแบบของ AWDC (R11, R12, R17) — AWDC มีอยู่แล้ว |
| 2026-11-04 | `a543c0a5` | Support tickets (list, view, new edit page) | Tickets get a real `/[id]/edit` page; the row ⋮ adds Edit (Change status · Cancel · Edit · Delete) from one shared who/dim helper; no inline edit form on the View; Edit hidden for visitors; Save stays disabled until the page leaves | follow | ⋮ ของ ticket ต้องมี Edit เหมือนหน้า View (กติกา row ↔ view parity) |
| 2026-11-06 | `53ce20fd` | Sign-in pages, Support tickets, Home cards, Settings → Data Management (B4) | Forgot password answers at once and refuses an oversized body; Resolve confirm drops the "submitter is notified" line on your own ticket; an Edit open while the status changes saves cleanly with a toast; Submitted by explained on Add Ticket; Initialize keeps only Seed default holidays; the Login page explains a session revoked by an email or password change | follow | ตามแบบ AWDC (B4) — ประโยคบนหน้า Login เป็นของ AE49 (owner Q604 a, Q608 a) |

Column `Other hubs should`: `follow` (the default), `ask` (AE49's session is unsure it fits other hubs), or `AE49 only`
(the change belongs to an AE49-only module or fact; still listed so the run can confirm).

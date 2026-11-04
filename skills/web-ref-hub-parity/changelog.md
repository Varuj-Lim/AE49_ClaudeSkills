# AE49 changelog — changes to the shared pages

Written by AE49_Hub's session in the same turn as each landing whose commit touches a path in `pages.md`
(`web-ref-deploy-landing` §5a); newest at the bottom. A parity run reads the rows after its hub's baseline.
A row added later by a parity run's safety net says `(safety net, <hub> <date>)` in `Change`.

| Date | AE49 commit | Page | Change | Other hubs should | หมายเหตุ |
|---|---|---|---|---|---|
| 2026-11-04 | `8b1789c4` | Rules over these pages (8) | `isEmployee()` on users read, tickets read/create + submitter update arms, replies, settings, patchNotes, counters, activityLogs, notification create, `member()`, storage `tickets/` read/write/delete; RD keeps a login's email / hasLogin; ticket create type whitelist + `enteredByUid` = caller (create only) | AE49 only | AE49 รับแบบของ AWDC (R11, R12, R17) — AWDC มีอยู่แล้ว |

Column `Other hubs should`: `follow` (the default), `ask` (AE49's session is unsure it fits other hubs), or `AE49 only`
(the change belongs to an AE49-only module or fact; still listed so the run can confirm).

---
name: web-ref-tickets
description: The Ticket page canon for every hub project (AE49_Hub, Nuri_Hub, CCP_Hub, AWDC_Hub, future siblings) — the TRIAGER (the role that works the queue: RD on AE49 Support tickets, IT on AE49 IT tickets, the hub's own triager elsewhere) gets, in BOTH the list row's ⋮ and the ticket page's ⋮, the items Change status · Cancel · Delete in that order; Change status opens the hub's shared change-status popup with every status except the current one (a final ticket may be reopened); Cancel is a confirmed shortcut; both write EXACTLY what the edit form's Status picker writes (same service, same transaction / refusal, same bell, same log) — never a second write path; the submitter's own Cancel (Open only) stays; real tickets are canceled, Delete is for test or mistaken tickets; codes are never reused (web-ref-record-codes). Use whenever building, porting or reviewing a ticket list, a ticket page, its ⋮ menu or its status changes — trigger on "ปุ่มยกเลิกใน 3 Dot", "เปลี่ยน Status ใน 3 Dot", "change the ticket status", "cancel a ticket", "triager actions". Each hub keeps its paths and role mapping in its own <hub>-ref-tickets facts skill; the rule changes HERE once.
---

# Tickets — shared canon

**Owner rulings 2026-10-30 (AE49_Hub):** "ช่วยทำปุ่มยกเลิกใน 3 Dot ให้ผมเพิ่มหน่อย", then "ให้ผมสามารถเปลี่ยน Status เป็นทุกแบบได้ใน 3 Dot เลย จะได้ไม่ต้องกด เข้าไป Edit Status มันลำบาก", and "อันนี้ควรเป็นกติกากลางของหน้า Ticket" — so this is the rule for every hub's Ticket pages, not one hub's.

## The triager's ⋮ — list row AND ticket page

| Order | Item | What it does |
|---|---|---|
| 1 | **Change status** | Opens the hub's shared change-status popup (AE49: `RdChangeStatusModal`) listing every ticket status except the current one — including reopening a Rejected / Canceled ticket where the hub lets the triager edit a final ticket. |
| 2 | **Cancel** | A ConfirmModal ("Cancel ticket" / Keep Ticket / Cancel Ticket), then Canceled. Dimmed with the Thai reason "รายการนี้อยู่ในสถานะสุดท้ายแล้ว" on a final ticket. |
| 3 | **Delete** | `danger` tone; for test or mistaken tickets only (real tickets are canceled — `web-ref-record-codes`). |

- **One write path.** Change status and Cancel call EXACTLY what the edit form's Status picker calls: the same service function, the same "only from this status" transaction and its refusal sentence, the same bell to the submitter, the same activity-log line. A second write path is a finding.
- **The edit form's Status picker stays.** The ⋮ is a shortcut, not a replacement.
- **The submitter** (not the triager) keeps only their own Cancel, live while the ticket is Open, dimmed with its reason afterwards — unchanged.
- **Hidden vs dimmed** follows the table action-menu canon: an item the viewer may never use is hidden; an item they may use but not now is dimmed with a Thai reason.
- Labels are bare English verbs (`web-ref-ui-language`); the confirm body and reasons are Thai.

## Codes

Ticket codes (TK…, ITK…) follow `web-ref-record-codes`: issued once, never reused after a delete.

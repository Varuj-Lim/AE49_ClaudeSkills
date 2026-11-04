---
name: web-ref-tickets
description: "Canon (web-ref-*) for Ticket pages: the TRIAGER gets Change status, Cancel, Edit, Delete (that order) in both list row and ticket page ⋮; both write exactly what the edit form's Status picker writes; the submitter keeps own Cancel. Use for any ticket page; ปุ่มยกเลิกใน 3 Dot, เปลี่ยน Status ใน 3 Dot, change the ticket status, cancel a ticket."
---

# Tickets — shared canon

**Owner rulings 2026-10-30 (AE49_Hub):** "ช่วยทำปุ่มยกเลิกใน 3 Dot ให้ผมเพิ่มหน่อย", then "ให้ผมสามารถเปลี่ยน Status เป็นทุกแบบได้ใน 3 Dot เลย จะได้ไม่ต้องกด เข้าไป Edit Status มันลำบาก", and "อันนี้ควรเป็นกติกากลางของหน้า Ticket" — so this is the rule for every hub's Ticket pages, not one hub's.

Each hub keeps its paths and role mapping in its own `<hub>-ref-tickets` facts skill; the rule changes here once.

## The triager's ⋮ — list row AND ticket page

| Order | Item | What it does |
|---|---|---|
| 1 | **Change status** | Opens the hub's shared change-status popup (AE49: `RdChangeStatusModal`) listing every ticket status except the current one — including reopening a Rejected / Canceled ticket where the hub lets the triager edit a final ticket. |
| 2 | **Cancel** | A ConfirmModal ("Cancel ticket" / Keep Ticket / Cancel Ticket), then Canceled. Dimmed with the Thai reason "รายการนี้อยู่ในสถานะสุดท้ายแล้ว" on a final ticket. |
| 3 | **Edit** | Opens the ticket's own Edit page (`/<list>/[id]/edit`, canon `web-ref-routes`); the same who / dim rule as the ticket page's Edit pill, from ONE shared helper (AE49_Hub action-menu-parity, owner Q460 b, 2026-11-04). Hidden for read-only visitor logins. |
| 4 | **Delete** | `danger` tone; for test or mistaken tickets only (real tickets are canceled — `web-ref-record-codes`). |

- **One write path.** Change status and Cancel call EXACTLY what the edit form's Status picker calls: the same service function, the same "only from this status" transaction and its refusal sentence, the same bell to the submitter, the same activity-log line. A second write path is a finding.
- **The edit form's Status picker stays.** The ⋮ is a shortcut, not a replacement.
- **The submitter** (not the triager) keeps their own Cancel and Edit, live while the ticket is Open, dimmed with their reasons afterwards.
- **Hidden vs dimmed** follows the table action-menu canon: an item the viewer may never use is hidden; an item they may use but not now is dimmed with a Thai reason.
- **Editing happens on the Edit page, not inline on the ticket page** (2026-11-04), so the ticket page has no "form open" dims; a hub that still edits inline keeps them until it moves to an Edit page.
- Labels are bare English verbs (`web-ref-ui-language`); the confirm body and reasons are Thai.

## Codes

Ticket codes (TK…, ITK…) follow `web-ref-record-codes`: issued once, never reused after a delete.

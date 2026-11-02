---
name: web-ref-tickets
description: "Canon (web-ref-*) for Ticket pages: the TRIAGER gets Change status, Cancel, Delete (in that order) in both the list row's ⋮ and the ticket page's ⋮; Change status offers every status but the current; both write exactly what the edit form's Status picker writes (one write path); the submitter keeps own Cancel. Use for any ticket page."
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
- **The submitter** (not the triager) keeps only their own Cancel, live while the ticket is Open (except while the ticket page's edit form is open — below), dimmed with its reason afterwards.
- **Hidden vs dimmed** follows the table action-menu canon: an item the viewer may never use is hidden; an item they may use but not now is dimmed with a Thai reason.
- **While the ticket page's edit form is open (or saving), EVERY ⋮ item on that page is dimmed** — the triager's Change status, Cancel and Delete, and the submitter's own Cancel — with "กด Save changes หรือ Close ฟอร์มแก้ไขก่อน แล้วค่อยกด <verb>" (saving: the hub's "saving" sentence). A ⋮ action on success closes the form, so a live item would drop the typed edits without a word (AE49 owner Q178 a / Q183 a / Q184 a, 2026-10-30). The list page has no edit form, so its ⋮ is unaffected.
- Labels are bare English verbs (`web-ref-ui-language`); the confirm body and reasons are Thai.

## Codes

Ticket codes (TK…, ITK…) follow `web-ref-record-codes`: issued once, never reused after a delete.

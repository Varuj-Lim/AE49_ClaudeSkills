---
name: web-ref-record-codes
description: "Canon (web-ref-*) for running record codes (TK0040, ITK, LO, OT, PR, DMO, any counter): issued once, NEVER reused even after deletion; counters only go up, gaps are normal, not fixed. Real records are canceled or rejected; Delete is for test or mistaken ones. Use for any counter, code-minting create flow, delete action; ทำไมเลขข้าม, ลบแล้วเลขหาย."
---

# Record codes — never reused

**Owner ruling 2026-10-30 (AE49_Hub, Q173 a):** "เลขที่ใช้แล้วห้ามใช้ซ้ำ แม้ใบนั้นจะถูกลบ" — and, the same day, "อันนี้คือสำหรับทุกหน้าเลย … เอาไปใส่ในระดับ User". The owner had asked whether deleting the last record (TK0039) should let the next one take its number; Main recommended no and the owner ruled it for every page.

## The rule

1. **A code is issued once.** A counter (`counters/<kind>.last`, a transaction that reads and bumps it) only goes UP. Deleting a record never lowers it, never hands its code to the next record, and no "re-number" / "fill the gap" job exists.
2. **Gaps are expected.** A missing number means a record was deleted; that is information, not an error. Never show "missing" warnings or compact a sequence.
3. **Cancel, don't delete, a real record.** Where a screen has a lifecycle (Canceled / Rejected / Withdrawn), the everyday path for a real record is that status; Delete stays for test data and records created by mistake (and is usually RD / triager only).
4. **Migrations keep codes.** A data move, a rename or a restore writes the record's existing code back; it never mints a new one for an old record, and a restore never collides with a code issued since (refuse and report instead).

## Why (the common practice)

A code lives outside its record — in bells already sent, activity logs, LINE / email messages, printed sheets, chat, people's notes. A reused code silently points all of those at a DIFFERENT record. Two people creating at the moment of a delete could also be issued the same number. Ticket systems (Jira, GitHub, most help desks) never reuse numbers for the same reason. The one domain that needs gap-free numbering — legally sequential documents such as tax invoices — handles it by canceling, never by deleting or reusing; no hub has such a document today.

## Where it is checked

Each hub's audit (the counters / create-flow topic) flags any code path that decrements a counter, reuses a deleted code, or computes "the next number" from the highest existing record instead of the counter.

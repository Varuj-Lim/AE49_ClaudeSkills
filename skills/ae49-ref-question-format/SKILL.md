---
name: ae49-ref-question-format
description: The ONE format for every question Main puts to the owner — a grill question, a design fork, a ruling request, an audit QUESTION relayed for a decision, a "which option" during a gate, a "did you mean X" check. Owner rule 2026-10-01 ("วิธีการถามคำถามของคุณที่ส่งมาให้ผมตอบนั้นแย่ ไม่มี Format … ไม่ใช่การเขียนแบบสั้นๆ แล้วไม่อธิบายอะไรเลย ผมอ่านแล้วไม่เข้าใจ") — a question is never a terse fragment; it carries the context the owner needs to picture the situation, labelled options each with how / pros / cons / cost / whose hands (a consequence lives inside its option's ข้อเสีย — no separate "what goes wrong" block, owner 2026-10-01), a recommendation with its reason, and how to answer. Use whenever you are about to ask the owner anything that needs a decision — trigger even when the question feels small or obvious, and even in caveman mode (questions are an auto-clarity exception).
---

# Question format — how Main asks the owner anything

**Why this exists (owner ruling 2026-10-01).** During the notification-settings grill Main asked
"Q3 — มีหัวข้อที่ปิดไม่ได้ไหม? (ก) … (ข) … (ค) …" in three compressed lines. The owner answered
"Q3 ถามว่าอะไรขอละเอียดหน่อย", then, after a second question in the same style: *"วิธีการถามคำถามของคุณ
ที่ส่งมาให้ผมตอบนั้นแย่ ไม่มี Format … ไม่ใช่การเขียนแบบสั้นๆ แล้วไม่อธิบายอะไรเลย ผมอ่านแล้วไม่เข้าใจ"*. The cause
was caveman mode leaking into questions: a question compressed to fragments saves tokens and costs
the owner a round trip (and the trust that the question was thought through). The version the owner
DID understand had: what the thing is in plain words, concrete examples of what goes wrong, each
option spelled out with its consequence, and a recommendation with the reason. That is the format.

## The format — copy this shape

```markdown
## ❓ Q<n> — <ชื่อเรื่องสั้น ๆ ที่บอกว่าตัดสินใจเรื่องอะไร>

**เรื่องอะไร:** 2–4 ประโยค — ตอนนี้ระบบ/งานเป็นอย่างไร (ชี้ไปที่หน้า/ปุ่ม/ข้อมูลจริงที่เจ้าของเคยเห็น),
ทำไมต้องตัดสินใจเรื่องนี้ตอนนี้, และคำถามนี้เกี่ยวกับคำถามก่อนหน้าอย่างไร (ถ้ามี)

**ตัวเลือก:**
- **(a) <ชื่อสั้น> — แนะนำ** · ทำอย่างไร (1 ประโยค) · ข้อดี · ข้อเสีย/ต้นทุน (งานกี่ไฟล์, ใครต้องกดอะไร, ต้อง deploy อะไร)
- **(b) <ชื่อสั้น>** · ทำอย่างไร · ข้อดี · ข้อเสีย/ต้นทุน
- **(c) <ชื่อสั้น>** · … (มีเท่าที่จำเป็น 2–4 ตัวเลือก)

**ผมแนะนำ (a) เพราะ** <เหตุผล 1–2 ประโยค ในภาษาคน — ไม่ใช่ "ตาม canon">

**ตอบได้ว่า:** a / b / c หรือพิมพ์ทางของคุณเอง · เมื่อตอบแล้วผมจะ <สิ่งที่เกิดต่อ เช่น "ถามข้อถัดไปเรื่อง LINE" / "เขียน plan ให้อนุมัติ">
```

## Rules

1. **Every question to the owner uses this shape — no exceptions for "small" questions.** A
   one-line "a/b/c?" is exactly what the owner refused. If the question is genuinely tiny
   ("ชื่อ a หรือ b"), the sections shrink to one sentence each; they never disappear.
2. **Caveman mode is OFF inside a question** (added to `ae49-mode-caveman`'s auto-clarity list
   2026-10-01). Full Thai sentences; English only for identifiers, labels, codes, file paths and
   technical terms; no programmer shorthand; no abbreviations the owner has not used himself.
3. **One question per message by default** (the grill rule — resolve a branch before the next).
   Batch several ONLY when the owner asked to answer item by item (e.g. decode questions DQ1–DQ5,
   or "ตอบทีละข้อ"); then every item still carries the full shape, compactly, and the message ends
   with one "ตอบได้ว่า" line listing them.
4. **Context before options.** The owner cannot see the code or the previous ten tool calls;
   the "เรื่องอะไร" block must let them picture the screen or the data. Name the page, the button,
   the record (quoted values per `ae49-ref-gate-checklist`), the number that matters.
5. **No separate "what goes wrong" section (owner 2026-10-01: "ตัดหัวข้อว่า ถ้าเลือกผิดจะเกิดอะไรขึ้น").**
   A consequence that matters belongs inside the option it belongs to, as that option's ข้อเสีย,
   in one concrete phrase — never as a block of its own above the options.
6. **Every option says who does what and what it costs** — files, a deploy, the owner's hands,
   a migration, a wait. The owner decides by trade-off, not by label.
7. **A recommendation is mandatory, with a plain reason.** "แนะนำ (a)" alone is not a reason.
   If Main has no preference, say why the options are equal and what would tip it.
8. **Say what happens after the answer** so the owner knows whether another question follows
   or the work starts.
9. **Option letters are LATIN — (a) (b) (c) (d) — never Thai ก/ข/ค (owner rule 2026-10-06).** The
   owner answers from an English keyboard and the board, the log and the register carry the
   letter; a Thai letter costs a layout switch and reads differently in every font. The sentences
   around the options stay Thai; only the label changes. Rulings recorded BEFORE 2026-10-06 keep
   their ก/ข letters in the plans and logs — they are history, not to be rewritten.
10. **When the owner says "ไม่เข้าใจ" / "ขอละเอียดหน่อย"**, do not repeat the same text longer:
   add a worked example from the app (a real record, a real screen) and restate each option as
   "ถ้าเลือก (a) คุณจะเห็น … / ต้องทำ …".
11. **Numbering:** `Q<n>` within one grill; a decode's questions keep the spec's IDs (`DQ1` / `Q6`);
    an audit's open question relayed to the owner keeps its audit ID. Never reuse a number in one
    grill. The log line records the ruling as `ruling: owner Q<n> (a) — <one line>`.
12. **The board's 👤 line still names the pending question** ("รอคุณ: Q5 a/b") — that line is a
    pointer, never the question itself; the question lives in its own block above.

## A good one and a bad one (the 2026-10-01 pair)

**Bad (refused):**
> รับ Q2 = (ก). ต่อ **Q3 — มีหัวข้อที่ "ปิดไม่ได้" ไหม?** (ก) ล็อก 2 หัวข้อ + ระบบ (ข) ปิดได้หมด (ค) ล็อกเฉพาะ ⑪

**Good (understood, answered "ก" at once):**
> **คำถามคือ:** ทุกหัวข้อจะเป็น checkbox ให้ปิดเองได้ — แต่ควรมีบางหัวข้อที่ "ติ๊กออกไม่ได้" ไหม (ติ๊กถาวร สีเทา)
> เพราะถ้าปิดแล้วเขาจะพลาดเรื่องที่กระทบตัวเองหรือกฎบริษัท
> **(ก) แนะนำ** — ล็อกไว้ 3 อย่าง: ผลใบลาของฉัน · การขาดงาน/ลงเวลา · ข้อความระบบ; ที่เหลือปิดได้ตามใจ
> **(ข)** ไม่ล็อกอะไรเลย — ง่ายสุด แต่พนักงานที่ปิด "ผลใบลาของฉัน" จะไม่รู้ว่าใบลาถูกปฏิเสธและมาทำงานไม่ทัน
> **(ค)** ล็อกแค่การขาดงาน
> **รอคุณ:** ก / ข / ค

## Where this sits

- `ae49-task-grill` asks its questions in this format (one at a time, recommendation each).
- `ae49-ref-report-format` owns reports and the board; a question embedded in a report (an audit
  QUESTION the owner must rule on) uses THIS shape inside the report.
- `ae49-mode-caveman` lists "questions to the owner" as an auto-clarity exception.
- `ae49-mode-autopilot` forks that are PARKED for the owner are written into the log and the
  register as prose, and ASKED in chat in this shape when the owner is reachable.

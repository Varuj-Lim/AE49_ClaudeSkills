---
name: ae49-ref-question-format
description: "The ONE format for every question Main puts to the owner: grill question, design fork, ruling request, relayed audit QUESTION, which-option at a gate. Context, labelled options (how, pros, cons, cost, whose hands), a recommendation with its reason, how to answer. Use before ANY decision question, even a small one, even in caveman mode."
---

# Question format — how Main asks the owner anything

**Why (owner ruling 2026-10-01).** A question compressed to fragments (caveman mode leaking into it) saves tokens and costs
the owner a round trip. The version the owner DID understand had: what the thing is in plain words, each option
spelled out with its consequence, and a recommendation with the reason. That is the format. The story: [history.md](history.md).

## The format — copy this shape

```markdown
## ❓ Q<n> — <ชื่อเรื่องสั้น ๆ ที่บอกว่าตัดสินใจเรื่องอะไร>

**เรื่องอะไร:** 2–4 ประโยค — ตอนนี้ระบบ/งานเป็นอย่างไร (ชี้ไปที่หน้า/ปุ่ม/ข้อมูลจริงที่เจ้าของเคยเห็น),
ทำไมต้องตัดสินใจเรื่องนี้ตอนนี้, และคำถามนี้เกี่ยวกับคำถามก่อนหน้าอย่างไร (ถ้ามี)

**ตัวเลือก:**
- **(a) <ชื่อสั้น> — แนะนำ**
  - ทำอย่างไร: 1 ประโยค
  - ข้อดี: …
  - ข้อเสีย: …
  - ต้นทุน: งานกี่ไฟล์, ใครต้องกดอะไร, ต้อง deploy อะไร
- **(b) <ชื่อสั้น>**
  - ทำอย่างไร: …
  - ข้อดี: …
  - ข้อเสีย: …
  - ต้นทุน: …
- **(c) <ชื่อสั้น>** … (มีเท่าที่จำเป็น 2–4 ตัวเลือก แต่ละตัวเลือกมี 4 บรรทัดนี้เสมอ)

**📐 มาตรฐาน:** (เฉพาะคำถามงานออกแบบโครงสร้าง — rule 15) ACI / วสท. / มยผ. / กฎกระทรวง กำหนดเรื่องนี้ว่าอะไร พร้อมเลขข้อ
**🏢 ที่ทำกันทั่วไป:** (เฉพาะคำถามงานออกแบบโครงสร้าง) บริษัทออกแบบทั่วไปทำเรื่องนี้อย่างไร

**ผมแนะนำ (a) เพราะ** <เหตุผล 1–2 ประโยค ในภาษาคน — ไม่ใช่ "ตาม canon">

**ตอบได้ว่า:** a / b / c หรือพิมพ์ทางของคุณเอง · เมื่อตอบแล้วผมจะ <สิ่งที่เกิดต่อ เช่น "ถามข้อถัดไปเรื่อง LINE" / "เขียน plan ให้อนุมัติ">
```

## Rules

1. **Every question to the owner uses this shape — no exceptions for "small" questions.** A
   one-line "a/b/c?" is exactly what the owner refused. If the question is genuinely tiny
   ("ชื่อ a หรือ b"), the sections shrink to one sentence each; they never disappear.
2. **Caveman mode is OFF inside a question** (a "decide" case of `ae49-mode-caveman` § Auto-Clarity,
   2026-10-01). Full Thai sentences; English only for identifiers, labels, codes, file paths and
   technical terms; no programmer shorthand; no abbreviations the owner has not used himself.
3. **Ask every ready question in ONE message — up to 10 (owner rule 2026-10-07, replaces "one
   question per message").** When several questions are waiting, send them together instead of one
   per turn.
   - **Cap: 10 per message.** More than 10 → send the 10 that unblock the most work first, say how
     many follow, and send the rest in the next message.
   - **Every item keeps the full shape** (rules 1, 4–11): its own `## ❓` heading, context, options
     with the four slots, a recommendation with a reason — compact, never shrunk to one line.
   - **Only questions that are READY go in.** A question whose options depend on the answer to
     another (the grill's "resolve a branch before the next") waits for the next message; say in
     one line that it will follow and why.
   - **End with ONE "ตอบได้ว่า" line** giving a copyable answer template with the recommendations,
     e.g. `EQ1 a / EQ2 a / EQ3 b`, and put the same pointer in the 👤 line.
   - **Questions from different features keep their own prefixes** (OQ / EQ / Q) so a reply like
     "OQ4 a" can never be read against the wrong plan.
4. **Context before options.** The owner cannot see the code or the previous ten tool calls;
   the "เรื่องอะไร" block must let them picture the screen or the data. Name the page, the button,
   the record (quoted values per `ae49-ref-gate-checklist`), the number that matters.
5. **No separate "what goes wrong" section (owner 2026-10-01).**
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
11. **Each option's four facts stand on their OWN lines (owner rule 2026-10-06).** Under every option, ทำอย่างไร / ข้อดี / ข้อเสีย / ต้นทุน are four separate sub-bullets — never one run-on line joined with " · ". The owner reads the options by scanning down the same four slots in each; a run-on line hides which phrase is the cost and which the drawback. A fact that genuinely does not apply is written "—", not dropped, so the four slots stay aligned across options.
12. **Numbering — one running `Q<n>` per project, restarted after every push, with a running total (owner Q663 a,
    2026-11-07; replaces the per-grill count and the 2026-10-28 restart-on-request).**
    - **The counter file** `.claude/memory/shared/questions.json` (git-synced, so both machines agree):
      `{ "round": <n>, "roundSince": "<push sha | \"start\">", "next": <n>, "askedThisRound": <n>, "answeredThisRound": <n>,
      "totalAsked": <n>, "totalAnswered": <n>, "seeded": "<how the totals began>" }`. It replaces the in-flight memory's
      "Next question number" line.
    - **Asking** takes `next` and bumps it with `askedThisRound` / `totalAsked`; **an answer logged as a ruling** bumps
      `answeredThisRound` / `totalAnswered`. Every question the owner answers counts, whatever its prefix (a decode's `DQ`,
      an audit's ID, a contract's `CQ`); only `Q<n>` takes its number from `next` — the others keep their own IDs.
    - **At the push of the deploy branch** (the owner's "push", `web-ref-deploy-landing`), the push report carries one line,
      `🔢 คำถาม: รอบนี้ตอบ N ข้อ · รวมทั้งหมด M ข้อ`, then the file moves to the next round: `round` + 1, `roundSince` = the
      pushed sha, `next` = 1, both this-round counts = 0; committed with the push's memory commit. A backup push is not a push.
    - **Chat keeps the bare `Q<n>`; durable records write the round before it — `P12-Q5`** (log `ruling:` lines, plan
      Decisions, the register), so a restarted number never reads as an older ruling of the same number. The log line
      reads `ruling: owner P12-Q5 (a) — <one line>`. Records written before this rule keep their forms (bare `Q<n>`,
      `2026-10-28 Q1`) — history, not rewritten.
    - **A question still open at the push** is asked again in the new round with a new number that names the old one —
      `Q3 (เดิม P11-Q57)` — and its register row is renumbered in the same commit.
    - **A project without the file** creates it at its first question: `round` 1, and the totals SEEDED from its own
      records (logs, plans, the register — the distinct answered IDs), `"seeded"` saying it is an estimate and how it was
      counted. When asked "ตอบไปกี่ข้อ", Main reads the file, never recounts from memory.
    - A decode's questions keep the spec's IDs (`DQ1` / `Q6`) and an audit's open question relayed to the owner keeps its
      audit ID; never reuse a number inside one round.
13. **The board's 👤 line still names the pending question** ("รอคุณ: Q5 a/b") — that line is a
    pointer, never the question itself; the question lives in its own block above.
14. **Option (a) is ALWAYS Main's recommendation (owner rule 2026-11-03).** The recommended option is listed first
    and marked "— แนะนำ"; the rest follow from the closest alternative to the farthest, and "อธิบายเอง" / "เลือกเอง", when
    offered, is last. When Main has no preference (rule 7), (a) is the option Main would take if made to choose, and the
    "ผมแนะนำ" line says the options are equal. The answer template and the first `wrap_up` button then read the same
    (a). Why: the owner answers fast by taking (a) and wanted that to be safe every time, not a habit that usually held.

15. **A structural-engineering question carries 📐 and 🏢 (owner Q489 a, 2026-11-05).** When the decision is about
    structural design — an R&D calculation page, a calculation engine, an engineering default, a code check, a detailing
    limit — the question adds two lines after the options and before "ผมแนะนำ", apart from the options' pros and cons:
    - **📐 มาตรฐาน** — what the governing code says: ACI, and the Thai ones (วสท., มยผ., กฎกระทรวง) where they apply. A
      clause number is written only when it comes from a source in the project (a spec, a decoded workbook, an engine
      comment) and that source is named; one recalled from memory is marked "จากความจำ ควรตรวจ", because a wrong
      clause written confidently misleads worse than none. No clause governs it → say so.
    - **🏢 ที่ทำกันทั่วไป** — how design firms usually do it: common practice, design-software defaults (ETABS, SAFE,
      spColumn …), handbook guidance. It is general practice, never a statistic; when Main does not know, it writes
      "ไม่แน่ใจ" instead of guessing.
    An option that matches or departs from the code says so in its ข้อดี / ข้อเสีย in a few words ("ตรง ACI", "เข้มกว่า ACI");
    the detail stays in 📐. Questions about UI, data or workflow keep the shape without these two lines.
    Why: the owner decides engineering forks by the code and by what practitioners do; with both in the question the
    owner no longer has to look them up (Q473, the spiral pitch cap, was the example).

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

- `ae49-task-grill` asks its questions in this format (every independent question at once, up to
  10 per message — rule 3; recommendation each).
- `ae49-ref-report-format` owns reports and the board; a question embedded in a report (an audit
  QUESTION the owner must rule on) uses THIS shape inside the report.
- `ae49-mode-caveman` § Auto-Clarity keeps "questions to the owner" in full sentences (a "decide" case).
- `ae49-mode-autopilot` forks that are PARKED for the owner are written into the log and the
  register as prose, and ASKED in chat in this shape when the owner is reachable.

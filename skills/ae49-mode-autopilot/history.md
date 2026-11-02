# ae49-mode-autopilot history

Why the rules are shaped as they are. The rules themselves live in `SKILL.md`; a conflict resolves in its favour.

## Incident stories and quotes moved out of SKILL.md on 2026-11-02 (S8, owner Q340 a)

- **Origin (owner ruling 2026-09-25, "ทำเลย").** The owner wanted a switch: ON = "run the work on your own while I sleep — you are
  the gate tester and the one who dispatches agents, don't ask me"; OFF = "tell me every decision you took for me since ON, so I
  can change any of it". Main's reply, accepted with two defaults: yes, behind three fences — a NEVER list, a scope fixed at
  switch-on, and a decision log that is a FILE.
- **Live push command (owner ruling 2026-09-30).** *"ผมอยากให้ผมสามารถสั่ง Push ขณะเปิดโหมดนี้ได้จะได้ไม่ต้องปิดก่อน"*.
- **Filing a ticket on the owner's order (owner ruling 2026-10-26).** *"แก้กติกาหน่อยว่าให้คุณสามารถเขียน Ticket ได้เหมือนกับ
  /web-task-ticket-to-plan ตอนที่งานเสร็จแล้วสามารถเขียนตอบได้เลย"*.
- **Ticket write-backs in `ask` (owner ruling 2026-10-27).** *"เขียนกติกาใหม่ให้ Mode Autopilot โหมด Ask สามารถแก้เฉพาะ Ticket ได้
  ผมอนุญาต เพราะผมคอยดูอยู่"*. On 2026-10-27 an approval's one-line `in_progress` write was handed to the owner as two PowerShell
  commands while the owner sat watching the session.
- **No reports in `decide` (owner rule 2026-10-20).** *"ระหว่างอยู่ใน Mode Decide ไม่จำเป็นต้องเขียนรายงานบอกผม เพราะผมอาจจะไม่อยู่
  ไว้ผมอยากดูรายงานจะมาบอกเองพรุ่งนี้"*.
- **"ปิดโหมด Ask" means switch to `decide` (owner 2026-10-21).** *"ความหมายของปิดโหมด Ask ไม่ได้หมายถึงปิด Autopilot ให้เปลี่ยนเป็นโหมด
  ตัดสินใจเอง"*.
- **Switch report carries ⏱️ / ⚡ (owner 2026-10-22).** The decide → ask report had the decisions and the board but no ⏱️ / ⚡.
- **Work ordered before switch-on joins the scope (owner 2026-10-26).** *"เมื่อไหร่ก็ตามที่ผมสั่งงานใน Autopilot ต้องเพิ่มเข้าไปเลยไม่ต้องรอผมบอก"*.
  On 2026-10-07 the owner asked whether work ordered after switch-on was in scope — it was not, so a finished, gated build would
  have waited at the landing step for a "land" the owner did not know was needed. On 2026-10-26 the CSV-removal build (TK0096),
  ordered minutes before switch-on, was left "out of scope" and its gate handed to the owner, who asked "เข้า Autopilot
  ไม่ได้ทำให้เองหรอ".
- **No cap on agents (owner ruling 2026-10-07).** *"อยากให้ไม่จำกัดไปเลยผมจะดูจาก Token เอง"*.
- **Five audit rounds (owner 2026-10-29).** *"ขยายกติกา Autopilot ให้ Audit ได้ 5 รอบ"* — raised from 3 after requester B1's round 3
  found a new MAJOR in its own rollback text.
- **Ask rather than decide a fork (owner ruling 2026-10-02 run 8).** *"ถ้าติดคำถามให้มาถามมากกว่าการตัดสินใจเอง แต่ให้ระบบ Test เองนะ"*,
  split into two named modes the same day.
- **Decision report in Thai cells (owner rule 2026-10-21).** *"เขียนรายงานรูปแบบตารางเป็นข้อๆในภาษาไทย"* then *"ชื่อหัวข้อเป็น English ได้
  แต่คำอธิบายอยากให้เป็นไทยนะ"*.

Old trigger words, cut from the description because they did not fit the 350-character limit:

- ผมจะไปนอน ทำต่อเองเลย
- รันต่อเองทั้งคืน
- /ae49-mode-autopilot on [ask|decide] <scope>|off|status|tick

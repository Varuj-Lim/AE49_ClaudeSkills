# Deliberate divergences — what each hub keeps different from AE49 on purpose

A parity run lists a difference that matches a row here and does NOT ask about it. `?` = not recorded yet (the hub's
next run fills it). Sources: each hub's `CLAUDE.md` and `<hub>-ref-*` skills as of 2026-11-04, unless a ruling is cited.

## Baselines

| Hub | Last parity run | Ruled up to AE49 commit | หมายเหตุ |
|---|---|---|---|
| AE49 | — | — (for AE49 this cell holds the AE49_ClaudeSkills commit its run ruled up to) | AE49 เป็นต้นแบบ เทียบกับ skill อย่างเดียว จุดอ้างอิงเป็น commit ของ skills repo |
| AWDC | 2026-11-04 (run 1, 94 items) | `3c5c186c` | รอบแรกเสร็จ รอบหน้าดูเฉพาะ changelog + ตาข่าย GitHub หลัง commit นี้ |
| CCP | — | — | ยังไม่เคยรัน รอบแรกสแกนเต็ม |
| NURI | — | — | ยังไม่เคยรัน รอบแรกสแกนเต็ม |

## Divergences

| # | Topic | AE49 | AWDC | CCP | NURI | หมายเหตุ |
|---|---|---|---|---|---|---|
| 1 | Hub's role | Reference | Follows AE49 (cloned via CCP) | Follows AE49 (cloned from AE49) | Follows AE49 by concept (own codebase) | NURI ไม่ได้ clone มาจาก AE49 จึงเทียบกันที่ "พฤติกรรม" ไม่ใช่บรรทัด code |
| 2 | UI language | Thai sentences, English names (`web-ref-ui-language`) | Every word US English (`awdchub-ref-ui-language`) | Thai sentences, English names | ? | AWDC เป็นภาษาอังกฤษทั้งเว็บโดยตั้งใจ |
| 3 | Access model | Many departments; a department grants powers | Two departments: Staff, Developer (only Developer is privileged) | Two departments: Staff, Developer | Four roles: developer, admin, manager, staff | สิทธิ์ต่างกันตามธุรกิจ ไม่ต้องทำให้เหมือน |
| 4 | Department / position values | Its own | Its own (engineering positions) | Its own (textile positions) | Its own | รายชื่อตำแหน่งเป็นข้อมูลของแต่ละบริษัท |
| 5 | LINE messenger | Yes | Removed completely | Removed completely | Yes (Settings → Integrations) | AWDC กับ CCP ไม่ใช้ LINE |
| 6 | Brand palette and logo | Its own tokens | `awdc-*` charcoal, AWDC wordmark | `ccp-*` blue | `nuri-*` terra | สีและโลโก้ตามแบรนด์แต่ละบริษัท |
| 7 | Modules outside the shared pages, and the pages that serve them | Attendance, leave, projects, draftsman, R&D, IT, policies, …; also Dashboard, Employees → Organization / Ranks, Settings → Holidays / Human Resources | None yet; those five pages stay AE49-only until AWDC has a module (AWDC 2026-11-04 P9 a) | Production modules | Inventory and sales | module ของงานแต่ละบริษัทอยู่นอกขอบเขตการเทียบ |
| 8 | Invite link + Employees → Approvals | Yes | Yes (2026-11-01 Q1 a) | No — "no self-registration, no Approvals page" (2026-10-19 Q32 a) | ? | CCP ตัดสินไว้ก่อน AWDC จะเปิดใช้ รอบแรกของ CCP ควรถามใหม่ |
| 9 | Infrastructure (Firebase project, ports, accounts, mail sender) | Its own | Its own | Its own | Its own | ค่าจริงอยู่ใน CLAUDE.md ของแต่ละ Hub ห้ามเขียนที่นี่ |
| 10 | Login page right panel | Slideshow + festival animations | Static logo (2026-11-04 P8 ② 4) | ? | ? | หน้า login ของ AWDC เป็นโลโก้นิ่ง ไม่ต้องทำสไลด์ |
| 11 | Employees → Directory columns | Team, Draftsman Team, LINE (module columns) | Position (2026-11-04 P8 ④ 3) | ? | ? | คอลัมน์ตามข้อมูลของแต่ละบริษัท |
| 12 | Forgot-password overall cap per hour | 30 | 10 (2026-11-04 P4, item R10) | ? | ? | AWDC ใช้ Gmail ของบริษัท จึงจำกัดต่ำกว่า |

# Deliberate divergences — what each hub keeps different from AE49 on purpose

A parity run lists a difference that matches a row here and does NOT ask about it. `?` = not recorded yet (the hub's
next run fills it). Sources: each hub's `CLAUDE.md` and `<hub>-ref-*` skills as of 2026-11-04, unless a ruling is cited.

## Baselines

| Hub | Last parity run | Ruled up to AE49 commit | หมายเหตุ |
|---|---|---|---|
| AE49 | — | — (for AE49 this cell holds its FAMILY run's skills-repo commit and the three child pins: `skills <sha> · NURI <sha> · CCP <sha> · AWDC <sha>`) | AE49 เป็น Hub แม่ รอบของ AE49 เทียบกับ Hub ลูกทั้งสามและ skill แล้วเสนอแบบที่ดีที่สุด (owner 2026-11-05) |
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
| 7 | Modules outside the shared pages, and the pages that serve them | Attendance, leave, projects, draftsman, R&D, IT, policies, …; also Dashboard, Employees → Organization / Ranks, Settings → Holidays / Human Resources | Projects only (AWDC 2026-11-05, OI-3; its differences are rows 13–17); the five pages stay AE49-only until AWDC has a module that needs them (AWDC 2026-11-04 P9 a) | Production modules | Inventory and sales | module ของงานแต่ละบริษัทอยู่นอกขอบเขตการเทียบ |
| 8 | Invite link + Employees → Approvals | Yes | Yes (2026-11-01 Q1 a) | No — "no self-registration, no Approvals page" (2026-10-19 Q32 a) | ? | CCP ตัดสินไว้ก่อน AWDC จะเปิดใช้ รอบแรกของ CCP ควรถามใหม่ |
| 9 | Infrastructure (Firebase project, ports, accounts, mail sender) | Its own | Its own | Its own | Its own | ค่าจริงอยู่ใน CLAUDE.md ของแต่ละ Hub ห้ามเขียนที่นี่ |
| 10 | Login page right panel | Slideshow + festival animations | Static logo (2026-11-04 P8 ② 4) | ? | ? | หน้า login ของ AWDC เป็นโลโก้นิ่ง ไม่ต้องทำสไลด์ |
| 11 | Employees → Directory columns | Team, Draftsman Team, LINE (module columns) | Position (2026-11-04 P8 ④ 3) | ? | ? | คอลัมน์ตามข้อมูลของแต่ละบริษัท |
| 12 | Forgot-password overall cap per hour | 30 | 10 (2026-11-04 P4, item R10) | ? | ? | AWDC ใช้ Gmail ของบริษัท จึงจำกัดต่ำกว่า |
| 13 | Projects → Parts | Yes: per-part leader, draftsman, engineer, areas, cost, schedule; Part Schedule page; part proposals | None on screen; the data keeps exactly one hidden part (AWDC 2026-11-05 Q5 a) | — (no Projects module) | — (no Projects module) | AWDC ถามทีมใน Ask ticket ว่าต้องการ Part ไหม ถ้าต้องการค่อยเปิดหน้าจอ ไม่ต้องย้ายข้อมูล |
| 14 | Projects → Draftsman | Per-part draftsman, close-project bookings, proposal holds, draftsman status on the Gantt | None (AWDC owner 2026-11-05) | — | — | AWDC ไม่มีแผนก Draftsman |
| 15 | Projects → who adds / edits | Director, Team Leader, RD write; Structural Engineers propose, Directors / Team Leaders approve (Propose + Approvals pages) | Every employee adds and edits; only a Developer deletes or sets Active / Inactive; no Propose / Approvals (AWDC 2026-11-05 Q6 a: "บริษัทนี้ขนาดเล็กมาก 4-5 คน") | — | — | ทีม AWDC ถูกถามใน Ask ticket ว่าจะมีกี่ Department และสิทธิ์ต่างกันตรงไหน |
| 16 | Projects → Project Code | `AE` + 4 digits, checked in five places | Free text, required, unique ignoring case; format pending the team's Ask ticket (AWDC 2026-11-05 Q8 a) | — | — | AWDC ไม่ใช้รูปแบบ AE แน่นอน |
| 17 | Projects → Leader / Engineer pickers, Gantt headings | Pickers filtered by department; Gantt grouped under Director / Team Leader | Any active employee; Gantt grouped under each project's Leader (AWDC 2026-11-05 Q7 a) | — | — | ตำแหน่งของ AWDC เป็นแค่ป้ายชื่อ ไม่มีสิทธิ์ |

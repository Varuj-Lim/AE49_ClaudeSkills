**Scope (part of ae49-ref-gate-checklist, split out 2026-10-09):** the clickable `docs/gate-checklist` page — content-keyed ticks, a fix or ruling during a gate as a NEW section, only open sections on the board, when a section may be on the board and its reset to the CLOSED payload at landing, and template adoption. Moved whole from the `SKILL.md` sections "The clickable page — ticks, fixes during a gate, open sections only", "When a section is on the board — and closing it at landing" and "Template adoption". The CLOSED payload itself is [closed-format.md](closed-format.md).

## The clickable page — ticks, fixes during a gate, open sections only

**Clickable checklist page:** if the project carries a gate-checklist template (e.g.
`docs/gate-checklist.html` reading a sibling `gate-checklist.js` items file), overwrite
the items file for this gate (`## <section>` strings become headers) and hand the user a
clickable FULL file URL to the page (e.g.
`file:///C:/…/<project>/docs/gate-checklist.html`, as a markdown link) — ticks persist
in their browser. **A tick belongs to the item's CONTENT, never to its position**
(owner 2026-09-16: *"ทำไมบางทีเปิดมาเหมือนมีที่กาค้างไว้อยู่ ทั้ง ๆ ที่บางอันเป็นของใหม่"* — the
page used to key ticks by number, so after a board rewrite the new item 3.2 wore the
tick of whatever had been 3.2 before): the template keys each tick by a hash of its
section heading + item text, keeps them in ONE fixed browser bucket (`ae49-gate-ticks`) that is NEVER derived from the board's `feature` / `title` line (owner 2026-09-18: *"กดติ๊กไปแล้วคุณส่งอันใหม่เข้ามา ผมเลยกด Refresh ที่ติ๊กอยู่หายหมดเลย"* — a per-feature bucket emptied every tick the moment Main rewrote that line; the page now merges any old per-feature bucket back on load), prunes keys whose item is gone, and so an unchanged item
keeps its tick across rewrites while a reworded or new one comes back unticked — by
itself, with no "Reset ticks" from anyone. Main's side of that rule: when a section is
re-added or an item reworded, SAY which items are new or changed (they are the unticked
ones), never ask the owner to reset, and never reword a passed item cosmetically — a
changed text is a fresh test in the owner's eyes. **A ruling or fix given DURING a gate
goes on the board as a NEW section — never into the section under test** (owner
2026-09-17, after ㉔ was added beside ㉓: *"ถ้าผมสั่งแก้อะไรให้ขึ้น Gate ใหม่ ไม่ใช่เอาไปแก้
ของเดิมให้ตรวจซ้ำ เพราะบางทีผมตรวจผ่านไปแล้วมันจะงง"*): when the owner asks for a change
while ㉓ is open, the fix lands as ㉔ with ONLY the items that prove that fix; ㉓'s items
stay word-for-word (passed ones keep their ticks, unchecked ones stay open); an item the
fix makes obsolete is REMOVED from ㉓, not reworded; ㉓ is dropped when its feature
lands, ㉔ when the fix lands — so a section on the board is never edited underneath a
reader. The one escape hatch: **when the feedback on a section is extensive — several
rulings on one build — Main may PULL that whole section off the board, have the build
redone, and re-issue it as a FRESH section** (owner 2026-09-17: *"หากผมขอแก้เยอะมาก คุณ
สามารถเอา Gate หัวข้อนั้นออกก่อนได้ แล้วไปทำมาใหม่ ขึ้น Gate ใหม่ได้เช่นกัน"*); say so when
pulling it, and note that ticks on items whose text did not change still carry over by
content. **When the page exists, do NOT print
the checklist items in chat** (user rule, 2026-07-23): the chat message carries only
the link, the item count, and any gate-specific notes (seeded values, cautions, which
items are new since the last look).
Print items in chat only when the project has no checklist page. The items file is
gitignored per-gate scratch: never commit it. **The board holds ONLY the open sections
(owner 2026-09-16: "ล้าง Gate checklist เวลาทำเสร็จแล้ว เหลือแค่ที่ใช้ — ยาวจนจะเป็น 100 แล้ว"):
the moment ONE feature's section passes and lands, delete that section from the file —
never let passed sections accumulate under new ones (the 2026-09-15/16 board reached 92 items
across twelve sections before this rule). Dropping a section moves NO other item's number
(numbers restart per section, 2026-09-18) and ticks follow content, so nothing else changes —
just say which sections remain.

## When a section is on the board — and closing it at landing

**A section is on the
board ONLY while the build it tests is complete in the hub tree** (audited, copied, gates
green) — never while a builder is still changing it. When the owner's gate feedback
sends the build back (a wording fix, a width rule, a new check), DELETE the section at
once and re-add it — with the new checks — only when the amended build has been copied
in; the owner must never read a section and wonder whether it is finished (owner
2026-09-16: "ทำให้เสร็จก่อนค่อยมาใส่ใน Gate เพราะผมงงนึกว่าเสร็จแล้ว"). **At landing ("all pass, commit it") RESET it to the CLOSED payload** — shape and closed-line grammar live in the shared canon **`closed-format.md`** (single source, rule 2026-08-27; e.g. `<slug> landed <date> (gate N/N; commit <sha>)`) — so the page reads "No open gate" instead of showing an already-landed gate (user rule 2026-08-04); the shell renders that state. Write a fresh item list only when the NEXT gate opens.

## Template adoption

**Template adoption** — a project that doesn't yet carry the template adopts it in
ONE docs commit (no manual-test gate needed for a docs-only adoption):
1. Copy this skill's bundled `resources/gate-checklist.html` →
   `<project>/docs/gate-checklist.html`, unchanged (the page is project-agnostic; an
   identical copy in a sibling project works as the source too).
2. Add `docs/gate-checklist.js` to the project's `.gitignore` with a short comment
   (per-gate scratch, never committed).
3. Commit the template + `.gitignore` edit together as one docs commit on the default
   branch, explicit pathspec (e.g. `docs: adopt clickable gate-checklist page`).
4. If the project defines a no-deploy backup push (e.g. `git push origin main:backup`),
   run it; a deploying push still needs the user's explicit go-ahead.

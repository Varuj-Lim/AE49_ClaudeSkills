---
name: ae49-ref-gate-checklist
description: >-
  The ONE rulebook for the owner's manual-test GATE in every ae49-workflow project (AE49_Hub,
  Nuri_Hub, future siblings) — when a gate opens, the checklist format (Thai, full sentences,
  5–7 parent items per feature section, at most 5 sub-steps each), circled gate numbers per
  deploy round, the clickable docs/gate-checklist page (ticks keyed by content, a fix during a
  gate as a NEW section, only open sections on the board), every item's three tags
  [EMU] (account) {Nav -> Page} and quoted values, the CLOSED payload at landing, template
  adoption and the emulator-by-default rule — plus the scripts that CHECK and CLOSE the page
  (validate-gate.cjs, close-gate.cjs). Invoke BEFORE writing, rewriting, renumbering or closing
  ANY gate, every time, and whenever the owner says a gate "ไม่ตรงกติกา", "ข้อเยอะไป",
  "ไม่เห็น Gate", or asks for a test checklist. Split out of ae49-router 2026-09-25.
---

# Gate checklist — the owner's manual-test gate

**Split out of `ae49-router` on 2026-09-25** (owner, on Main's review of the router: *"ทำทุกข้อไปเลย"*).
For weeks these rules were ONE ~150-line paragraph inside the router. On 2026-09-23 the first gate
after a context compact broke eight of them — handed over in chat instead of on the page, 10 items
instead of 5–7, no section heading, no `[EMU] (account) {Nav -> Page}` tags, placeholder accounts,
unquoted values — because the router's body had left context with the compact and nothing had
reloaded it. Two fixes, both here: the rules are a skill of their own that Main invokes before
every gate, and the checkable half of them is a SCRIPT, which a compact cannot erase.

## Use the scripts — they hold what a machine can check

| Script | Run | What it does |
|---|---|---|
| `resources/validate-gate.cjs` | `node ~/.claude/skills/ae49-ref-gate-checklist/resources/validate-gate.cjs docs/gate-checklist.js` — after EVERY write of the page | FAILS on: a section heading without a circled numeral; more than 7 parent items in a section; more than 5 sub-steps under a parent; a parent item without the three tags; a title without its numeral or environment; a closed payload off the grammar. WARNS on markdown (the page renders text literally) and on a section under 5 items. |
| `resources/close-gate.cjs` | `node …/close-gate.cjs docs/gate-checklist.js --slug <slug> --score P/N --commit <sha>[,…] [--waived W] [--prod M/M] [--deployed web]` — at landing | Writes the CLOSED payload in `web-ref-gate-closed-format`'s grammar, keeping the gate's feature and title; the date comes from the clock in ICT; refuses a placeholder sha; validates before writing. |
| `resources/gate-checklist.html` | copied once into a project | The page template (see "Template adoption"). |

The scripts do not replace the rules below — they cannot tell whether an item is a full Thai
sentence, whether a value on screen is quoted, or whether the named account is the right one; those
stay the author's job. **A gate handed over without a clean `validate-gate.cjs` run is not handed
over.** Landing the plan behind a gate uses `web-ref-deploy-landing`'s `resources/archive-plan.cjs`.

## When the gate opens

The **manual-test gate** — after `ae49-implement` returns **and `ae49-audit` passes**, show the user the change and
**stop for their manual test** before any commit. **Every gate hands the user a numbered
test checklist** — the plan's Testing checklist (drift-corrected against what was actually
built) when a plan exists, or a short checklist you write from the diff for planless /
tiny-fix changes that touch UI or behavior. A gate without a checklist is not a gate.

## The checklist — format, budget, language

**Checklists are written with caveman mode OFF** — every item a full, self-explanatory
sentence ("Open X → do Y → you should see Z"); never compressed fragments, never a
prose-run summary of items. **Checklist format:** each item on its own line as
`N. [ ] <sentence>` with ONE check per item, **numbered 1..N WITHIN each feature section —
the count restarts at 1 under every section header** (owner 2026-09-18: a count running across
sections moved every later item's number whenever a landed section was dropped, so "ข้อ 11"
pointed at a different item after each board rewrite — *"ลำดับข้อจะขยับทำให้ผม Reference หาคุณ
ลำบาก และ สับสนได้ง่าย"*). An item is referenced by its section's circled numeral plus its
number — "⑫ ข้อ 5", never a bare number — and the checklist page numbers it the same way;
when a list must exceed ~8 items it groups under short bold section headers.
**Checklist budget (user rule 2026-08-13): aim for 5–7 items; only a genuinely
complex gate may exceed that, and it should never reach 10. The budget is PER
FEATURE — a combined gate of several features is one section per feature, each
section inside the budget (owner reminder 2026-09-08, after Main opened a 44-item
combined list by pasting every plan checklist plus every audit drift line; the
drift lines are merged INTO the 7, never appended). Second reminder 2026-09-15,
after a 16-item section inherited from a close-day board — "ผมตรวจไม่ไหว … แต่ละเรื่องต้องมี
ไม่เกิน 7 ข้อ": a section over 7 is CONDENSED before it is handed over, whoever wrote it
and whenever; the owner asked for this to live HERE, in the skill read every session,
not in memory.** Condense by merging
related checks into one item and covering only the core flow plus the risky edges —
the audit already verified the rest; a gate checklist is the user's smoke test, not a
re-audit. When a plan's Testing checklist is longer, Main condenses it at the gate.
**Checklist language (user rule 2026-08-13): items are written in THAI**, keeping
technical terms, UI labels, button names, codes and file paths in English (e.g.
"เปิดแท็บ Approvals แล้วกด Approve ใบ OT9901 → ตัวเลขต้องอ่าน 5h 30m") — full,
self-explanatory sentences still apply.

## Gate numbers — circled, per deploy round

**Gate numbers are CIRCLED numerals (owner 2026-09-17: "ทำให้เป็นกติกาการบอก Gate เป็นเลข
ลักษณะนี้ ㊶").** Every gate section Main opens is named by the project's NEXT number written
as ONE circled numeral — ①…⑳ (U+2460–2473), ㉑…㉟ (U+3251–325F), ㊱…㊿ (U+32B1–32BF) —
never "Gate 3", "G3", "#3" or "(3)". The same glyph names that gate everywhere: the
checklist page's section heading (`## ㊶ <feature> — <what it proves>`), the chat message,
the board's Stage cell (`🧪 Gate ㊶`), plan notes, the in-flight memory and the landing
commit / closed line. **The counter is PER PROJECT and PER DEPLOY ROUND (owner 2026-09-17:
"อยากให้เลขขึ้นใหม่ทุกครั้งที่ push เพราะถือว่าส่ง Deploy แล้ว")** — one push = one deploy, so
gates are numbered within that round (a patch note is NOT tied to a push any more — canon
`web-task-patch-note`, owner ruling 2026-09-22 — so a round is named by its DEPLOY, never by
a note version). Inside a round the counter
only moves forward, across days, machines and accounts: every new section takes the next
unused number — a fix issued as a new section during a gate, and a pulled section re-issued
fresh, each get a NEW number too. **After a deploying push succeeds, the next gate starts
again at ①.** A gate still OPEN at push time keeps its number until it closes (its feature
is not in that deploy); the new round skips any number still open on the board so two open
sections never share a glyph. **Chat and the board use the bare glyph** (㊶); **durable
records — plan notes, in-flight memory, commit bodies, closed lines — prefix the SHORT SHA
of the commit the round deployed** (`5530de65 ①`; the round opens at that push, so the sha
is known the moment it opens) so a glyph read later is never confused with the same glyph
from another round. Until 2026-09-23 the prefix was the round's upcoming patch-note
VERSION (`V6.3 ㉓`); once notes stopped being one-per-push (canon `web-task-patch-note`,
ruling 2026-09-22) two rounds could share a version and the prefix stopped
disambiguating — owner ruling 2026-09-23 ("เห็นด้วย") moved it to the deploy sha. Main may name the number at dispatch ("จะขึ้น gate ㊶") so
the owner can refer to it early. **Where the counter lives:** the round's deploy sha and the
last number used are written into the project's in-flight memory each time a section opens
and reset there at each push; a resuming session reads them before numbering. **Past ㊿ in
one round** (Unicode has no circled numeral beyond 50 — unlikely, a round runs ~25 gates)
numbering wraps to ①, skipping numbers still open, and Main says so once.

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

## Every item — the account, quoted values, three tags, sub-steps

**Every item names the exact account to
use** — "Sign in as Nattapat Hongbandalsuk (K. GORN)", "บัญชี RD ของคุณ" — never a
placeholder such as "คน A" or "a non-RD employee" (owner 2026-09-16: "ทำไมไม่ระบุคนมาเลย");
when a seed was made in somebody's name, the item says whose. **Record titles and
values the reader must find or type on screen are QUOTED** — "ทดสอบ IT ยกเลิก", "28o" —
never floating bare in the sentence (owner 2026-09-16: "อย่าพิมพ์ลอย ๆ อ่านแล้วงง"); codes
(PJ9902, TK9901) and UI labels (Cancel request) stay unquoted. **Every item opens with
three tags, in this order** (owner 2026-09-16): `[EMU]` / `[PRD]` / `[APH]` = where —
the emulator app (AE49 :3001), the production-data dev app (:3000), or the live App
Hosting site; `(ANY)` / `(RD)` / `(K. GORN)` = which account — the name to Sign in as,
`(RD)` = the owner's own login; `{R&D -> Footing Detail Design -> Design}` = the click
path to the screen. Example: `[EMU] (K. GORN) {Support -> Tickets} คลิกแถว "ทดสอบ ยกเลิก" → …`.
**Sub-steps:** an item that needs several steps splits into sub-items `2.1`, `2.2` …
(in the items file: a string starting with `- ` right after its parent) — ONE test step
per sub-item, at most 5 per item; the ≤ 7 rule counts parent items per feature section.
Sub-items inherit the parent's tags unless one overrides them.

## When a section is on the board — and closing it at landing

**A section is on the
board ONLY while the build it tests is complete in the hub tree** (audited, copied, gates
green) — never while a builder is still changing it. When the owner's gate feedback
sends the build back (a wording fix, a width rule, a new check), DELETE the section at
once and re-add it — with the new checks — only when the amended build has been copied
in; the owner must never read a section and wonder whether it is finished (owner
2026-09-16: "ทำให้เสร็จก่อนค่อยมาใส่ใน Gate เพราะผมงงนึกว่าเสร็จแล้ว"). **At landing ("all pass, commit it") RESET it to the CLOSED payload** — shape and closed-line grammar live in the shared canon **`web-ref-gate-closed-format`** (single source, rule 2026-08-27; e.g. `<slug> landed <date> (gate N/N; commit <sha>)`) — so the page reads "No open gate" instead of showing an already-landed gate (user rule 2026-08-04); the shell renders that state. Write a fresh item list only when the NEXT gate opens.

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

## Waived and Main-verified items (owner 2026-09-25)

The owner may decide not to click through a section — a feature they will rarely use, a
production-only gate that costs real time, an item the audit and the automated tests already
cover. Two outcomes exist, and both are RECORDED, never silently counted as passed:

- **Waived** — the owner says an item (or the rest of a section) is not tested ("ไว้ใช้จริงค่อยดู",
  "ข้ามได้"). The closed line then reads `gate 3/7 (4 waived)` (`web-ref-gate-closed-format`;
  `close-gate.cjs --score 3/7 --waived 4`), and the plan's landing note lists WHICH items were
  waived and why, so the next reader knows what production has never proved.
- **Main-verified** — the owner asks Main to run the check instead ("(ก) Main รันเอง"): Main
  creates TAGGED test data, drives the real system the way the button would (the same API route
  or the same service call, never a shortcut that skips the code under test), verifies the result
  with a read-only script, and reports the evidence. Such an item counts as PASSED; the landing
  note says Main verified it and how. Main never verifies an item that needs the owner's eyes
  (a rendering, a wording, a click path) — those are waived or tested, not "verified".

Before either, Main says once, in plain words, what will NOT have been seen by anyone if the
items are waived — then does what the owner decides.

**Items Main performs itself** — reading a manifest, a bucket, a log, an execution — have no
screen to click to. They open `[ENV] (Main)` without the `{Nav -> Page}` tag; `validate-gate.cjs`
accepts that form. Keep them to one or two per section; the gate is the owner's smoke test.

**Backticks are allowed** since 2026-09-25: the page renders `` `code` `` spans as code (URLs,
file paths, codes, folder names), so a plan's Testing checklist can be copied onto the board as
written. Other markdown (`**bold**`, links) still shows literally; an unpaired backtick shows
every backtick literally — the validator warns on both.

## Test data

If the checklist needs data that doesn't
exist and the project has a test-data skill (e.g. `<project>-task-test-data`), offer to
seed **tagged disposable test data** per that skill, and after the user passes the test
sweep it (verify zero remain) **before** landing.

## Environment — the emulator by default

**The gate runs on the EMULATOR by default** (rule 2026-08-27, strengthened by the owner
2026-08-28: read cost is the deciding factor). When a project offers both a
production-backed and an emulator/sandbox-backed dev environment, the emulator is the
DEFAULT and production must be argued for. Three reasons, in the owner's order of
importance:
1. **Read cost.** Every gate burns reads — the tester's page loads, plus any priming or
   aggregate rebuild the feature needs. A gate re-opened four or five times over an
   afternoon (normal while polish is iterated) multiplies that. The emulator costs zero.
2. **Junk.** A checklist that has the user CREATE, EDIT or DELETE records leaves those
   records behind in production for someone to sweep.
3. **No real data needed.** Anything whose inputs the tester types by hand does not touch
   production data at all.
**Production only when the gate genuinely cannot work without it** — chiefly when the
expected values were DERIVED from production (a checklist asserting real people, real
totals, real names), because a snapshot shows different numbers and the tester reports a
mismatch that is not a defect. Even then, first ask whether the same figures can be
produced by priming/seeding the EMULATOR and deriving the checklist's expected values
from there — that usually works and keeps the cost at zero.
State the chosen environment in the checklist title so the tester cannot land on the
wrong port, and record the reason where the feature's notes live.

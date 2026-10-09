---
name: ae49-ref-gate-checklist
description: >-
  The ONE rulebook for the owner's manual-test GATE in every ae49-workflow project (AE49_Hub,
  Nuri_Hub, siblings) - when a gate opens, the checklist format (Thai, full sentences, 5-7
  parent items per feature section, at most 5 sub-steps each), every item's three tags
  [EMU] (account) {Nav -> Page} and quoted values, circled gate numbers per deploy round, the
  clickable docs/gate-checklist page (ticks keyed by content, a fix during a gate = a NEW
  section, only open sections on the board), the CLOSED line and "No open gate" payload at
  landing (or when that line looks different between projects), waived / Main-verified items, template adoption and the emulator-by-default rule -
  plus the scripts that CHECK and CLOSE the page (validate-gate.cjs, close-gate.cjs). Invoke
  BEFORE writing, rewriting, renumbering or closing ANY gate, every time, and whenever the
  owner says a gate "ไม่ตรงกติกา", "ข้อเยอะไป", "ไม่เห็น Gate", or asks for a test checklist.
  Split out of ae49-router 2026-09-25; topic files hold the rest.
---

# Gate checklist — the owner's manual-test gate

Split into topic files 2026-10-09 (plan `skills-merge-sweep` M1, owner MQ1 b) and merged with
`web-ref-gate-closed-format`. THIS file keeps the working core — invoke it before every gate, run
`validate-gate.cjs`, the item format with its three tags, the 5–7 budget — so one read still gives the
rules a compact erases; the long sections moved WHOLE (headings and owner quotes unchanged) into the
topic files below. `resources/*` paths are unchanged.

## Read X when Y

| File | Read it when |
|---|---|
| this file (below) | EVERY gate: the scripts, when a gate opens, the checklist format / budget / language, the three tags and quoted values, the table edge-stability item — and the hand-over: the items go on the page (`page.md`) and the owner gets the LINK, never the items in chat; a fix during a gate is a NEW section |
| [gate-numbers.md](gate-numbers.md) | naming a gate: the circled glyph ①…㊿, the per-deploy-round counter, the sha prefix on durable records |
| [page.md](page.md) | the clickable `docs/gate-checklist` page: content-keyed ticks, a fix or ruling during a gate, only open sections, when a section may go on the board, closing it at landing, template adoption |
| [waived.md](waived.md) | the owner will not click through an item or a section: waived / Main-verified / waiting owner, and the `[ENV] (Main)` item form |
| [environment.md](environment.md) | test data for a gate, and which environment (emulator by default) the gate runs on |
| [closed-format.md](closed-format.md) | landing: the CLOSED payload shape, the closed-line grammar and slot rules (what `close-gate.cjs` writes) |

## Old name → where it lives now

| Old skill / section | Now |
|---|---|
| `web-ref-gate-closed-format` (whole) | `ae49-ref-gate-checklist/closed-format.md` |
| "Gate numbers — circled, per deploy round" | `gate-numbers.md` |
| "The clickable page…" · "When a section is on the board…" · "Template adoption" | `page.md` |
| "Waived and Main-verified items (owner 2026-09-25)" | `waived.md` |
| "Test data" · "Environment — the emulator by default" | `environment.md` |

**Scope (old description of this skill, 2026-09-25):** The ONE rulebook for the owner's manual-test GATE in every ae49-workflow project (AE49_Hub, Nuri_Hub, future siblings) — when a gate opens, the checklist format (Thai, full sentences, 5–7 parent items per feature section, at most 5 sub-steps each), circled gate numbers per deploy round, the clickable docs/gate-checklist page (ticks keyed by content, a fix during a gate as a NEW section, only open sections on the board), every item's three tags [EMU] (account) {Nav -> Page} and quoted values, the CLOSED payload at landing, template adoption and the emulator-by-default rule — plus the scripts that CHECK and CLOSE the page (validate-gate.cjs, close-gate.cjs). Invoke BEFORE writing, rewriting, renumbering or closing ANY gate, every time, and whenever the owner says a gate "ไม่ตรงกติกา", "ข้อเยอะไป", "ไม่เห็น Gate", or asks for a test checklist. Split out of ae49-router 2026-09-25.

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
| `resources/close-gate.cjs` | `node …/close-gate.cjs docs/gate-checklist.js --slug <slug> --score P/N --commit <sha>[,…] [--waived W] [--waiting O] [--prod M/M] [--deployed web]` — at landing | Writes the CLOSED payload in `closed-format.md`'s grammar, keeping the gate's feature and title; the date comes from the clock in ICT; refuses a placeholder sha; validates before writing. |
| `resources/gate-checklist.html` | copied once into a project | The page template (see "Template adoption" in [page.md](page.md)). |

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

## A table page always carries one edge-stability item

**Canon `web-ref-table` (AE49_Hub plan `table-widths-sweep` B3, 2026-10-02).** When the
feature under test touches a page with a table — a list, a detail's line items, a parameter block, a
result table, a print sheet — the section carries ONE item of this shape, and condensing never drops
it: `[EMU] (RD) {Nav -> Page} <ทำ pick / พิมพ์ / โหลด ที่ทำให้แถวเปลี่ยน> → เส้นแบ่งคอลัมน์อยู่ที่เดิม`
(e.g. "กด `Show all (N)` แล้วกดกลับ → เส้นแบ่งคอลัมน์อยู่ที่เดิม"). It is the one check that catches a
column sized by its content, which no build gate sees; Main-verified form: read the `<th>` right
edges before and after and compare the arrays.

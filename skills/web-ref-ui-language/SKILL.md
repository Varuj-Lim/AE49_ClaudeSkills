---
name: web-ref-ui-language
description: The ONE UI-language canon for every hub project (AE49_Hub, Nuri_Hub, future siblings) — EXPLANATIONS ARE THAI, IDENTIFIERS ARE ENGLISH, and English is US-spelled (Story not Storey, color, canceled; stored words change only by a ruled migration). Every long explanatory sentence an ordinary staff member reads (page / section intro lines, hints, captions, footnotes, empty states, confirm-dialog BODIES, validation errors, toasts, notification messages, picker placeholders) is plain Thai, while everything that NAMES something on screen (headings, section titles, dialog TITLES, labels, column names, button / pill / tab / toggle / status text, codes, employee labels, dates, times, numbers, technical terms) stays English so it matches what people click; never Thai on a control; failure strings follow the three-way split (staff-facing → Thai, actor-limited API / dev-only → English by ruling, machine text → English) and each hub's deliberate-English registry lives in its audit topic. Use whenever writing, translating, reviewing or auditing ANY user-facing string in a hub — trigger even when the user only says "ทำไมไม่เป็นไทย", "this dialog is English", "translate this", "add an error message", "what language should this be", or asks whether a label may be Thai. Per-project facts (rulings history, registry, template pages, module notes) live in each hub's own <hub>-ref-… facts skill; the rule changes HERE once.
---

# UI language — shared canon (Thai explainers · English identifiers)

**Why (owner rulings 2026-08-20 → 2026-09-15):** the hubs are used by Thai staff who
learn the screens by their English labels. A sentence whose job is to make a person
UNDERSTAND something is written in plain Thai; a word whose job is to NAME something
stays English so the explanation can point at exactly what they click. On
2026-09-15 the owner promoted this from AE49's project skill to every hub, and in the
same breath removed the last module-wide English exemption (the plot-order screens).

## The rule

**Explanations = Thai. Identifiers = English.**

| Stays ENGLISH | Becomes THAI |
|---|---|
| Headings & section titles (`Attendance Record`, `MONTH BY MONTH`) | Page / section intro sentences under them |
| Dialog TITLES (`Reject leave request`, `Cancel order`) | Dialog BODIES — what happens, what cannot be undone, who is told |
| Labels & column names (`Days worked`, `Avg in`, `Required`, `Total`) | Field `hint` lines, tile captions, table notes, footnotes, legends |
| Button / pill / tab / toggle / status text (`Submit Order`, `Pending`, `Export Excel`) | Empty-state sentences ("ยังไม่มี … เพราะ …") |
| Codes, employee labels, dates, times, numbers (`LO2081`, `08:30`, `[DM01] …`) | Validation errors, toasts, confirm bodies, notification messages staff read |
| Technical terms INSIDE a Thai sentence when they name a column or control (`Total`, `clockExempt`) | Picker placeholders ("เลือก Project"), search placeholders ("ค้นหาจาก Name …") |

- **No vocabulary exceptions for controls (owner ruling 2026-08-20, second that day):**
  buttons, pills, toggles, chips, tabs and status text are NEVER Thai — not even when a
  Thai word feels like the feature's natural name. The one exception ever granted (a
  ทำจริง/จองไว้ toggle) was reversed the day it shipped: the control became
  **Actual / Booked** and the Thai moved into its `title` tooltips and the caption
  beside it. If a control needs Thai to be understood, the Thai goes in a tooltip or a
  caption NEXT to it, never on it. The same holds for chart axes: the Thai goes in the
  tooltip / footnote, never on the axis label.
- **Caption vs label (ruling 2026-08-21):** the SAME fact renders Thai in a caption
  position (a small annotation under a value — `กรอกโดย …`) and English in a label
  position (a field name among other English labels — `Entered by`). One test: is it a
  sentence-y annotation (Thai) or a field name (English)?
- **A dialog is two languages by design:** the title is a heading (English), the body is
  an explainer (Thai). Every confirm in every hub reads this way; a body left English
  "because the module is English" is a finding — module-wide English exemptions are gone.
- **Column heads are English in EVERY table — screen, popup, print sheet, export header
  (owner ruling 2026-10-01, AE49 OI-15: *"หัวคอลัมน์ทุกตารางเป็นอังกฤษ ข้อความอธิบายเป็นไทย"*).**
  A column head is an IDENTIFIER — people point at it ("the Value column") — so it follows
  the identifier rule whatever the rest of the table's language. The test is POSITIONAL,
  not semantic: text that renders in a `<th>` (or a column-definition `label` / `header`
  that becomes one) is a head and is English; Thai belongs in the cells' prose (the CONTENT
  of a Description column), captions under the table, notes, legends and empty states. The
  only non-English heads allowed are the domain's own NOTATION — a unit or currency sign
  (`(฿)`, `m²`), a standard's category letter (ข ค ง), a formula symbol (`fc′`) — never
  a Thai WORD. Written because AE49's parameter tables shipped
  `คำอธิบาย · สัญลักษณ์ · ค่า · หน่วย` under an older per-table order (2026-08-28) that was
  never registered as an exception, a second card copied them a month later, and the
  audit found the conflict (plan `ui-table-heads-english`). The rule for that case: an
  earlier owner order for ONE table does not create an exception unless it is written into
  the hub's audit registry with its date — and the hub's project audit greps `<th>` text
  for Thai (AE49 topic 27, detector T-HEAD).

## Failure strings — the three-way split (rulings consolidated 2026-08-26)

Every user-facing failure string (setError box, toast, confirm body, an API-route
string a page shows verbatim, functions / LINE / mail text) is exactly one of:

1. **Staff-facing → THAI** — the default. If any ordinary employee can see it, it is a
   Thai sentence. An `app/api/**` string a page displays verbatim IS staff-facing — the
   route boundary grants no exemption.
2. **Actor-limited → ENGLISH is deliberate** — the language follows THE ACTOR (ruling
   2026-08-25), and the class is NARROW: API routes, logs and dev tooling only a
   developer ever reads. On 2026-09-08 the owner ruled that RD-only *screens* are
   translated like everything else ("แปลไปเลยจะได้เหมือนกันทั้งระบบ"), so "only RD sees
   this page" is no longer a reason to keep a UI string English.
3. **Machine text → ENGLISH** — error codes, log / audit lines, `"Row N:"` prefixes and
   English column names inside an otherwise-Thai import error, technical identifiers.

**The registry.** A string is deliberately English ONLY if it is listed, with its
ruling and date, in the hub's audit topic Exclude list. Anything staff-facing and
English outside that list is a finding — never "probably intentional".

## Placeholders (ruling 2026-08-20, third that day)

"Select …" placeholders are INSTRUCTIONS, not labels — Thai, led by **เลือก**, keeping
the field's on-screen English word when it names one: the shared pickers default to
Thai at the source (SelectField "เลือก …", DateField "เลือกวันที่" / "เลือกเดือน" /
"เลือกวันเริ่มและวันสิ้นสุด", TimeField "เลือกเวลา"); explicit per-site placeholders read
"เลือก Project" / "เลือก Approver". Search boxes follow the same shape ("ค้นหาจาก Name …").

## House style for the Thai

- Plain, spoken Thai — สุภาพแบบไม่เป็นทางการเกินไป; never a forced translation of a
  technical term that is a column or control name on the same screen (keep `Total`,
  `Required` inside the Thai sentence).
- Carry the SAME information the English carried — explainers are the app's honesty
  mechanism (why a number is what it is); never shorten away a caveat.
- Interpolations survive verbatim: `{name}`, `{code}`, `${countedSpan}`, counts,
  formatted dates — the Thai wraps around them.
- Thai needs no singular / plural branches — collapse `x === 1 ? "day" : "days"` into
  `X วัน`.
- **One vocabulary per module, chosen not invented:** when a module already speaks Thai
  (its notifications, banners, sibling screens), new strings reuse ITS words; when three
  dialects exist, the sweep picks one and rewrites the others (AE49's Excel-import
  vocabulary, 2026-08-26). Each hub's facts skill lists its fixed terms (AE49:
  ผู้เขียนแบบ never ช่างเขียนแบบ; ใบสั่งพล็อต; ผู้สั่งงาน / ผู้อนุมัติ).

## English is US English (owner ruling 2026-10-07, Q25 c)

Every English word the hubs write is spelled the **US** way — on screen, in printed sheets and
Excel headers, AND in code identifiers, routes, stored values, field names and new docs. The
engineers live in ETABS / ACI / ASCE, which are US-spelled; a page that says "Storey" beside an
ETABS paste that says "Story" reads as two different things. Common pairs:

| Write (US) | Never (UK) |
|---|---|
| Story / stories | Storey / storeys |
| color, gray | colour, grey |
| center, meter, liter | centre, metre, litre |
| canceled / canceling (cancellation stays) | cancelled / cancelling |
| behavior, favor, honor, labor | behaviour, favour, honour, labour |
| catalog, license (noun and verb), defense, program | catalogue, licence, defence, programme |
| organize, analyze, modeling, traveled, judgment, fulfill, aluminum | organise, analyse, modelling, travelled, judgement, fulfil, aluminium |

- **A word that is STORED is changed only by a ruled migration**, never by a text sweep: a status
  value (`"cancelled"`), a field or collection name, an id, an Excel import header people's files
  carry. The order is expand → migrate → contract: code that reads BOTH spellings ships first,
  rules accept both, the data is backed up (`web-ref-migration-backups`) and migrated, and only
  then is the old spelling dropped. Each hub's facts skill lists the stored UK words still
  waiting for that, so a sweep never touches them by accident.
- History is not rewritten: landed plans in `docs/plans/done/`, commit messages, logs and quoted
  standards (a มยผ. or BS title) keep their spelling.

## Where the rule does NOT apply

- Activity-log `changes` strings, code comments, developer logs (machine / dev audience).
- Outgoing external mail follows ITS OWN ruling per module (a work order to a Thai
  supplier is 100% Thai; a letter to a foreign vendor is whatever the recipient reads) —
  the screen that previews it still follows this canon.
- Technical identifiers, environment / config text, anything only a script prints.

## Don't

- Don't put Thai on a button, pill, tab, toggle, status or axis; don't translate a
  code, a column name or an employee label.
- Don't leave a dialog body or an error English because "this module is English".
- Don't keep an RD-only screen English because only RD sees it (ruled 2026-09-08).
- Don't add a deliberate-English string without its registry line.
- Don't mix two Thai words for one idea on one screen; don't invent when a sibling
  screen already named it.

## Pair with an audit

Each hub's project audit carries a UI-language topic (AE49: topic 27 "Thai explainers")
that sweeps every page, constants file, service and API route for staff-facing English
sentences — quoted literals, template literals, JSX text nodes, and strings that reach
the DOM through `setError` / toasts / notifications — writes the per-page fix steps in
the report shape, and holds the Exclude registry with each ruling and date.

## Per-project facts live elsewhere

Rulings history, settled surfaces, the registry pointer, the template page to copy,
module notes and fixed vocabulary belong in `<hub>-ref-…` (AE49:
`ae49Hub-ref-thai-explainers`). A hub without one creates the equivalent from the
AE49 file and adds the audit topic beside it.

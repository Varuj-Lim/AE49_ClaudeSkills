**Scope (was web-ref-parameter-table):** The shared ENGINEERING-TABLE format canon for every hub web project (AE49_Hub, NuriHub, future siblings) — the owner's favourite table shape, taken from AE49_Hub's Foundation Design → Detail Design → Design page (owner 2026-10-09, "I love table format in /rd/foundation-design/detail/design, please make those into our table format"). Covers the three shapes a calculation tool needs — the PARAMETER BLOCK (Description · Symbol · Value · Unit, English heads, Thai prose, half-height rows, symbols keep their case), the REPEATED-ROW table (symbol + unit once in the header, unit on its own line) and the WIDE GRID (one record = one row, compact padding tier, fixed per-kind column widths, one named flexible column, identical name column across sibling tables, sideways scroll inside the card with a sticky name column) — plus the shared parts: column prose in ONE section legend popup (Symbol · Description · Unit, band banner rows), tags keyed on the table head, a computed verdict shown as the colored value itself on screen and with a shape mark on paper, numeric cells with no stepper arrows and a red frame on letters, Save that asks the boxes, the printed block that keeps the screen's order plus an "=", and the arrow keys of web-ref-table T8. Use whenever building, editing or reviewing ANY engineering / calculation / parameter / spreadsheet-ported input or result table in a hub — a footing, pile, seismic, BOQ, pricing or optimizer table, or a new calculation tool — and whenever the owner says "ทำตารางแบบหน้า Detail Design", "table format แบบเดิม", "port this Excel sheet", or a parameter table's rows feel tall, its columns move, its dropdown is clipped or its prose crowds the header. NOT for record LIST pages (directories, queues, logs) — those follow the list-page and filter canons.

## Parameter tables — shared canon (hub web projects)

## Why this exists (owner 2026-10-09)

The owner, looking at AE49_Hub's **Foundation Design → Detail Design → Design** page:
*"I love table format in /rd/foundation-design/detail/design, please make those into our table
format"*. That page is the product of some twenty owner rulings between 2026-08-28 and
2026-10-02 (gates W1, ⑫ and the table-widths sweep). Until today they lived only in AE49's
project skill, so a second calculation tool — or a sibling hub — would have had to rediscover
them one gate at a time, which is what happened to AE49's own Seismic Load page (it copied the
form but not the width rule and shipped columns that moved, OI-38).

This canon holds the RULES. Each hub's facts skill holds its tokens, components and measured
widths (§ Per-project facts). When a rule changes, it changes HERE.

**Scope.** Engineering / calculation tables: inputs ported from a spreadsheet, parameter
sheets, result grids, price and quantity matrices. **Not** record lists (directories, queues,
logs) — they keep `web-ref-table/general/filter-format.md`, `web-ref-table/general/sort-arrows.md`, `web-ref-table/general/list-pagination.md`.
Both kinds obey `web-ref-table` (fixed widths) and, when editable,
`web-ref-table` T8 (arrow keys).

## The three shapes

| Shape | What it is | Example on the Design page |
|---|---|---|
| **P · Parameter block** | a dozen single fields read DOWN a narrow table | Global Parameters |
| **R · Repeated-row table** | the same few fields on every row, a handful of rows | Pile Specs |
| **W · Wide grid** | one `<tr>` per record, 15–30 columns, wider than most screens | Footing Inputs / Footing Outputs |

Pick the shape first; every rule below says which shapes it covers.

## 1 · Parameter block (P): four columns, in this order

| Description | Symbol | Value | Unit |
|---|---|---|---|
| ตัวคูณลดกำลังสำหรับการดัด | φb | `[ 0.9 ]` | – |

- **Description first**, then Symbol, Value, Unit (owner 2026-08-28: make it look like the
  source sheet). The prose is what the eye scans down, the symbol is the anchor matched
  against the workbook, the number is where you type.
- **Heads are ENGLISH, the description cells THAI** (owner 2026-10-01; `web-ref-ui-language`).
- **Unit is never blank** — `–` for a dimensionless value.
- **Rendered from ONE field registry**, never a hand-written row list — the form, the
  defaults, the validation and the print block (§9) read the same registry, so they cannot
  drift.
- **Fixed layout from the first row** (`web-ref-table` T1): Description is the
  flexible column, Symbol / Value / Unit take per-kind widths. Blocks that sit beside or
  above each other share ONE column list so Symbol / Value / Unit start at the same x in all
  of them. Rows may come and go with a mode; a column may not (T4) — a read-only form renders the same columns with empty cells.
- A Description cell wraps; the Symbol and Unit cells stay on one line, with the full text in `title`.
- Reuse the project's shared table head / body tokens, so a parameter table matches every other table of the app.
- A description may **quote another field's live value** (`{fieldKey}` filled at render) the
  way the sheet does ("ขนาดเล็กกว่า 16 มม." — never "เล็กกว่าค่าใน fy Threshold"). The filler
  lives with the strings, not in one card, so screen and paper quote the same number. An
  unknown key stays visible as `{token}` so a typo shows.

## 2 · Rows are half height — the two paddings are a PAIR (P, R, W)

A default row is ~66px: the input's own vertical padding PLUS the cell's. Shrink both
together (~34px). **Derive** the table's input / picker classes from the app's shared input
token (replace the padding), never re-type them and never edit the shared token — the border,
focus ring and stepper removal stay locked to every other input in the app. A picker in the
table takes the same shrink, or its row stays tall.

## 3 · Symbols keep their case (P, R, W)

Header rows are uppercased; symbols are not words — `dp` uppercased is a different quantity.
Every header cell that carries a symbol is `normal-case`, and on a narrow symbol head the
letter-spacing goes too.

## 4 · Where the explanation lives — never in the header text

| Shape | Prose goes |
|---|---|
| P | nowhere to move — Description is a column |
| R and W | **ONE section legend popup**, opened by the help button at the section's top-right (owner 2026-09-16: *"เอา ? ออก ไปรวมไว้ที่มุม Section"*) — never a `?` on every header |
| a lone field outside a table | a `?` marker beside its label, hover text only (a native `title`, not a popup — a popup is for paragraphs of rules) |

**Symbol and unit always stay visible** on the header; only the prose moves. They are what
you need while typing; the prose is read once.

**The legend popup** (`web-ref-popup`, read-only kind):
- a table of **Symbol · Description · Unit** — symbol FIRST, because a legend is a lookup
  keyed by the symbol you are staring at (deliberately not §1's order);
- one row per column, in table order, from a registry kept beside the column registry;
  prose already in a field registry is rendered from it, never copied;
- **every band of the grid opens a tinted BANNER row** — band word under Symbol, the band's
  Thai description under Description — including single-column bands (owner 2026-09-16:
  *"ใส่ Banner แยก Column ใหญ่ดีกว่านะ"*);
- the banner is a plain row — no `position`, no `z-index` — so it cannot paint over the sticky table head;
- band words stay English, everything else Thai.

**A TAG used inside cells (`N.C.`, `*`) is keyed ON THE TABLE HEAD**, as a caption directly
above the table (and under the title block on paper), from ONE constant, ALWAYS rendered —
never only when a row shows the tag. The legend row points at it and does not restate it.

## 5 · Repeated-row table (R): header once, unit on its own line

The same fields repeat down every row, so symbol and unit sit in the header ONCE — the unit on
its own line under the symbol, no parentheses. The prose goes to the legend (§4) however few
columns there are: the reason is the repetition, not the count. A repeated-row table takes its own column list, built from the same kind SCALE as the block it sits beside.

## 6 · Wide grid (W): one record, one row — width bought honestly

- **One record is one row.** Folding a record onto two lines under a stacked header was built
  and rejected the same day (2026-09-10: *"ระบบ 2 แถว … อ่านยากมากกกก"*); so were shortening
  header words and smaller screen text. Width is bought with padding, editor widths, fixed
  columns, the legend (§4), and asking whether a column has to exist.
- **A compact padding tier** — one smaller horizontal padding on body cells, editors AND
  header cells together, scoped to these grids only. Padding, editor width and column width
  are ONE decision: change one, re-measure all three, in the real page with the real font.
- **Fixed column widths from the project's per-kind scale** (`web-ref-table` T1/T2),
  on a `<colgroup>` from the column registry; no call site types a width.
- **Exactly one column is flexible, and it is the one people READ** (owner 2026-09-16, round 4:
  *"ส่วนที่ ย่อ หรือ ขยาย เป็น Result เท่านั้น"*) — named in the colgroup, never left to whichever
  column is last. Its kind width stays in the sum as its floor.
- **The table's `min-width` = Σ every column's width**, flexible one included — required, or
  the flexible column collapses to zero under fixed layout.
- **The name column is fixed and IDENTICAL across sibling tables** — two tables that show the
  same records (input above, output below) must start at the same place (gate ⑫). Its width is
  the smallest that holds the longest realistic value.
- **Wider than the card → it scrolls sideways INSIDE the card, name column sticky left.**
  Never squeeze a column below its measured width to avoid the scrollbar.
- **Over-long values clip** with an ellipsis and the full value on hover; a status pill never
  truncates (the value beside it does).
- **A one-icon Actions column may hide its header word** (screen-reader-only, zero width) —
  the cell holding that hidden word is `position: relative`, or the hidden text escapes the
  scroll box and scrolls the page. A column with two or more actions, or an icon that is not
  self-evident, keeps its visible heading.
- **Re-measure a kind the day the thing it was measured around is deleted** (a word, a pill,
  a mark) — a width outlives its shape unless someone goes back for it.
- **Delete a width kind whose last column leaves it** — do not keep it for a caller that may never come.
- **Measure a width's WHOLE string in ONE face.** Punctuation advances differently in bold than in
  regular, so a mostly-punctuation string measured in mixed faces is wrong.
- **A screen width and a print measure are re-measured SEPARATELY** — but a ruling that changes
  what a cell CONTAINS is owed both rounds.
- **Spend freed print width on the columns whose content can still GROW** (a string with no ceiling),
  never spread thin over fixed-length ones; a column shared with a sibling sheet is never a
  candidate — both sheets are re-cut together.

## 7 · A computed verdict is the VALUE, colored (W)

- **On screen:** the ratio itself, green when it passes and red when it fails — no pill, no
  word, no mark (owner 2026-09-16, four steps to *"เอาเครื่องหมายออก … ตัวอักษรใช้สีแทน"*).
  Allowed only because the value already says pass/fail (threshold 1.000); the cell still
  carries a Thai `title` / `aria-label` (`ผ่าน · 0.860`). A state whose value does not spell
  itself out keeps a word or a shape. A pill is for a state a PERSON set, not a computed one.
- **On paper:** the colored number PLUS a failure glyph in front of a failing value — a sheet
  gets photocopied in black and white, so color is never the only carrier there.
- **A check that did not run shows the MARK instead of a number** (`N.C.`, in the pass
  color) — never `0.000 (NC)`. Every sibling column in the same situation takes the same
  mark; a partial case (one axis of two skipped) keeps the real number. The signed
  calculation report keeps the full number.
- One recipe renders the verdict for every table that shows it, so a sibling pair cannot drift.
- The legend row for a color-only cue must describe the COLOR — it is the only place the cue is keyed.

## 8 · Numeric cells (P, R, W)

Numeric cells follow the project's input-token rule (no stepper arrows, red frame on letters, Save asks the boxes) — see the project's facts (Per-project facts, below).

## 9 · On paper (P, W)

- **A parameter block prints as the same table, same order, plus the sheet's `=`**:
  `Description | Symbol | = | Value | Unit`. A prose-less symbol grid was drafted and withdrawn
  — A4 has no `?` to click.
- Printed from the same registries and the same `{fieldKey}` filler as the screen; it prints
  the DRAFT strings verbatim (paper is a snapshot of the screen).
- **Every nested print table has its own colgroup summing to the sheet width**, the spare in a
  trailing filler so the block hugs the left edge like the source sheet.
- A column may exist on paper and not on screen — make it a TYPE in the column registry
  (print-only), so the screen colgroup, the min-width sum and the cells all skip it; it uses
  the screen's own symbol and unit, character for character.
- **One document = the full title block ONCE, a one-line running strip** (project · set ·
  sheet) **repeated in the table head** on every page; never "continued" in it; any tag key
  rides in the strip too.
- **Never print an abbreviation whose key is not on the same page** — the key sits in the table head
  that repeats on every page.
- **A repeated-row sub-table prints inside the block**, not on a sheet of its own; with zero rows it
  prints nothing — never a heading over an empty table.
- **A print-only column owes no legend row** (the legend explains screen columns). Assert at the gate that the screen minimum width is unchanged.
- **What must print once goes in normal flow; what must repeat on every page goes in the table head.**
  The running strip is a variant of the title-block component, never a second block of markup. A
  fixed-position running header is rejected: its reserved height is a hard-coded literal, and a long
  wrapped name overlaps the first row.
- If one half of a two-table grid leaves paper, keep its measures and mark them dormant; re-measure
  before trusting them again.
- Smaller print text, where ruled, is a NAMED tier of the project's print tokens — never a raw size at the call site.
- Smaller print text is NOT a tool, with one recorded exception per sheet that needs the
  owner's own ruling, measured before and after.

## 10 · Headers are not sticky in a plain card (P, R)

A sticky header row pins to the VIEWPORT when the table is not inside its own scroll shell,
sliding under the app header and stacking two tables' heads. Use the header look without the
sticky classes; a wide grid inside its scrolling card shell may keep its sticky head.

## 11 · Dropdowns inside a scrolling table open `fixed` (P, R, W)

A sideways-scroll wrapper also clips vertically (CSS cannot keep `overflow-y: visible` beside
`overflow-x: auto`), so a normal dropdown panel is cut off and grows a second scrollbar. Every
picker inside the wrapper opens in the fixed / portal presentation; the wrapper itself also
hides vertical overflow so Thai headroom cannot grow a phantom scrollbar.

## 12 · Keyboard (P, R, W)

Every editable table here is wired for arrow-key movement — `web-ref-table` T8.

## Checklist for a new calculation table

1. Shape chosen (P / R / W) and the columns come from a registry.
2. Heads English, prose Thai; unit never blank; symbols `normal-case`.
3. Fixed layout, per-kind widths, one named flexible column, `min-width` = Σ widths; siblings
   share the name column.
4. Half-height rows by derived input / picker classes.
5. Prose in the description column (P) or the section legend (R, W); tags keyed on the head.
6. Numeric cells per the project's number-input facts (§8).
7. Verdicts as colored values on screen, marked on paper.
8. Pickers `fixed`; header not sticky outside a scroll shell; arrow keys wired.
9. A print block in the same order with `=`, colgroups summing to the sheet.

## Per-project facts

| Project | Facts skill | Reference page |
|---|---|---|
| AE49_Hub | `ae49Hub-ref-table/calculation/parameter-table.md` (tokens, components, the measured `COL_PX` widths, every dated ruling; canon §8 (AE49 §10) numeric cells → `ae49Hub-ref-form-errors/number-inputs.md` §Numeric inputs: no stepper arrows, red frame on letters) | `/rd/foundation-design/detail/design` — `RdFootingGlobalsForm.tsx` (P + R), `FootingDesignTables.tsx` / `FootingInputRow.tsx` (W), `FootingLegendPopup.tsx` (§4), `FootingGlobalsPrintBlock.tsx` (§9) |
| NuriHub | not adopted yet — its first calculation table writes its facts skill from this canon | — |

---
name: web-ref-table-columns
description: The shared table-column canon for every hub web project (AE49_Hub, Nuri_Hub, future siblings) — every table, on screen AND on a printed A4 sheet, lays out with FIXED column widths that never depend on the data (no auto-fit). A column's width comes from its KIND on one shared scale per project, so the same kind of column (checkbox, code, date, status, quantity, money, actions…) is the same width on every page, and exactly one main text column takes the remaining space. A value too long for its column truncates to one line with an ellipsis and shows in full on hover; on paper, where nothing can hover, it wraps inside its fixed column instead. Use whenever adding, changing, reviewing or auditing ANY table in ANY hub project — a list page, a detail page's line items, a table in a modal, a report matrix, a printed sheet — and whenever the user says "the columns jump", "column widths keep changing", "the table looks different on this page", "fix the column width", "the table auto-fits", "ความกว้างคอลัมน์", or "ตารางขยับ". Each project supplies its own width scale and helpers in its facts skill; the RULE lives here and changes here once.
---

# Table columns — shared canon

One rule for every table in every hub project. Projects supply the width scale and the
helpers; nothing here is project-specific.

## Why this exists (owner ruling 2026-09-11, NuriHub)

The owner: *"ตารางทุกหน้า ต้องมีความกว้างของ Column (หลัก) เท่ากัน ไม่ได้ขยับไปมาตามแต่ข้อมูลที่มาหรือ
AutoFit"*.

A browser's default table layout sizes every column to its longest value, so the columns move
whenever the data changes — after a search, a filter, a tab switch, a sort, a new page of
results, or one new long name. A staff member reading down a column loses their place, and the
same kind of column sits at a different width on every page. Neither hub had a rule: of ~43
NuriHub tables only two line-item tables used a fixed layout, and AE49 used one in 14 files,
case by case.

The owner settled four points the same day: widths are **fixed** and come from the **column's
kind**; one main text column takes the rest; a long value **truncates, with the full value on
hover**; and the rule covers **every table, printed A4 sheets included**.

## T1 · Fixed layout, always

Every `<table>` uses the fixed layout algorithm — `table-layout: fixed` (Tailwind
`table-fixed`) at `width: 100%` — and gives every column but one an explicit width, on the
header cells or a `<colgroup>`. Under the fixed algorithm the browser takes the widths from the
column definitions and never from the cell contents, which is the whole point: a column cannot
be sized by what it holds.

- Never let content size a column — not on screen, not in print.
- A table wider than its container gets a `min-width` and scrolls sideways inside its card
  (`overflow-x-auto`). Never squeeze fixed columns below their scale width to make them fit.

## T2 · The width comes from the column's KIND, on one scale

Each project keeps **one width scale** — a named width per column kind — in shared code, and
every table picks from it. The same kind of column is the same width on every page. Typical
kinds (the project's facts skill lists its real ones and their values):

| Kind | Examples |
|---|---|
| select | the row checkbox |
| index | a row number |
| code | a document or record code (`SO-0057`, `TK0069`, `W0001`) |
| date · date-time | a created, due or delivery date |
| status | a status pill |
| quantity | a count, a stock figure |
| money | an amount |
| short label | a type, a category, a role |
| person | a name or nickname |
| actions | the row's action icons or menu |

- **Exactly one main column is flexible** — the name / title / description column — and gets
  NO width, so under the fixed layout it takes whatever the table width leaves. That remainder
  depends on the screen, never on the data. A table with no natural text column makes its
  widest-content column the flexible one.
- A column whose kind is missing from the scale gets a **new entry on the scale** — never a
  one-off width at the call site. The scale grows; call sites never invent widths.
- Each scale width is chosen for the longest **realistic** value of its kind (the longest code
  format, a full date), so a well-formed value never truncates.

## T3 · Too long for the column → one line, ellipsis, full value on hover

- Cell text stays on one line and truncates with an ellipsis (`truncate`), and the full value is
  available on hover (a `title` attribute or the project's tooltip). Every row is one height.
- A cell designed as two lines (a name over a sub-label) truncates each line the same way and
  never grows to a third.
- **Printed sheets keep the fixed widths but WRAP instead of truncating.** Paper cannot hover,
  so on a print layout a long value wraps inside its fixed column — a printed invoice must never
  cut a product name or an address short. Only the overflow behaviour differs; the widths are
  still fixed and still come from the scale (in the print layout's own units).

## T4 · Nothing else moves a column

A column's width does not change with a search, a filter, a tab, a sort direction, pagination,
the loading or empty state, the number of selected rows, or a row's hover or expanded state. The
empty state spans every column in one cell (`colSpan`) and leaves the header widths alone.

## Rules that keep it honest

- One scale per project, defined once in shared code, imported everywhere — never re-typed.
- A project that deliberately diverges says so in its facts skill, with the reason.
- The owner asked for EVERY table, so this is an app-wide conversion driven by each project's
  audit — not only a rule for new tables. New tables follow it from birth.

## Each project supplies its FACTS in its own ref skill

| Project | Facts skill | Scale lives in |
|---|---|---|
| NuriHub | `nurihub-ref-table-columns` — created with the scale (planned 2026-09-11) | the shared table helpers, once built |
| AE49_Hub | not adopted yet (handoff 2026-09-11) | its `TableCard` + `lib/constants/tableStyles` are the natural home |
| future siblings | create with the first table | copy the shape: one scale, one flexible column |

Filter pills have their own width rule in `web-ref-filter-format` R4 — a pill is as wide as its
longest option. Both rules serve the same goal: nothing on a list page changes size because the
data or the selection changed.

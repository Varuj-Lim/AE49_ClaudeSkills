---
name: web-ref-table
description: The ONE table canon for every hub project (AE49_Hub, Nuri_Hub, siblings), in three types - GENERAL (record lists, directories, queues), CALCULATION (engineering/parameter tables ported from a spreadsheet) and SCHEDULE (Gantt/calendar grids). Holds fixed column widths by kind (T1-T7, "ตารางขยับ"), search + filter bar + Clear, sort arrows, pagination (cap 50, "โหลดนาน"), bulk verbs, the ⋮ action menu on rows, cards, view-page and modal headers, arrow keys and Excel paste in editable cells, the Detail Design table format ("ทำตารางแบบหน้า Detail Design"), BOQ price lists ("ใส่ราคา"), and schedule grids (month fold, month divider, today/weekend/holiday, signed-in-user highlight, bar chips, cell-marking mode). Use for ANY table, "ลูกศร sort", "เรียงจากน้อยไปมาก", "กดลูกศรแล้วเลื่อนช่อง", "วางข้อมูลจาก Excel", "table format แบบเดิม", list page, filter, sort header, row action ("three dots", kebab), bulk approve, page buttons, Gantt or grid, or when columns jump. Each hub's <hub>-ref-table holds its tokens and paths.
---

# Table canon - one folder, three table types

Every rule about a table in a hub project lives here ONCE; each hub keeps only its FACTS (tokens,
component paths, measured numbers, registries) in its own `<hub>-ref-table/`. Read the topic file
you need, not all of them. A rule changes HERE; the hub files never restate it.

## Which type, which files

| Type | What it is | Read |
|---|---|---|
| **general** | a record LIST, directory, queue, log, or any existing page's table | `columns.md` (every table) + the `general/` files below |
| **calculation** | an engineering table: parameter block, repeated-row table, wide grid, spreadsheet port (R&D tools); a price list | `columns.md` + `calculation/parameter-table.md` (prices: `calculation/price-list.md`); editable cells also `keyboard.md` |
| **schedule** | a Gantt / calendar grid whose columns or rows are dates | `schedule/schedule-grid.md` |

## Read X when Y

| File | Read it when |
|---|---|
| [columns.md](columns.md) | ANY table: widths, "the columns jump", a table that moves, a long cell, the toolbar above a table (T1-T7) |
| [keyboard.md](keyboard.md) | a table with input boxes, number cells, pickers or tick boxes: arrow keys, paste from Excel (T8, P1-P11) |
| [general/filter-format.md](general/filter-format.md) | a search box, filter pills, tabs, `Clear`, the row-count caption, an empty state (R1-R4) |
| [general/sort-arrows.md](general/sort-arrows.md) | a sortable header, the direction glyph, which tables sort |
| [general/list-pagination.md](general/list-pagination.md) | a list that reads a growing collection: cap 50, page buttons, "show all" (section 1-6) |
| [general/bulk-actions.md](general/bulk-actions.md) | the verbs inside a selection cluster: `Verb (N)`, skip lines, role-absent verbs (B1-B6) |
| [general/action-menu.md](general/action-menu.md) | the ⋮ menu or visible verbs on rows, list cards, view-page headers, modal headers |
| [calculation/parameter-table.md](calculation/parameter-table.md) | a parameter block, repeated-row table or wide grid; "ทำตารางแบบหน้า Detail Design" (section 1-12) |
| [calculation/price-list.md](calculation/price-list.md) | ANY table where prices are typed: a price list, a price snapshot, prices per size - always the BOQ matrix (owner 2026-10-09) |
| [schedule/schedule-grid.md](schedule/schedule-grid.md) | a schedule / Gantt / calendar grid: month fold, divider, highlight, bar chip, marking mode (section 1-11); an editable cell also `keyboard.md` |

## The T-rules (columns.md and keyboard.md)

| ID | Rule in one line | File |
|---|---|---|
| T1 | Fixed layout always - `table-fixed`, no exemptions | columns.md |
| T2 | A column's width comes from its KIND on one scale; exactly one flexible column | columns.md |
| T3 | Too long for the column: one line, ellipsis, full value on hover (paper wraps) | columns.md |
| T4 | Nothing else (search, filter, sort, page, selection) moves a column | columns.md |
| T5 | Nothing moves the TABLE either - selection cluster at the toolbar's right end | columns.md |
| T6 | A list page's chrome stays put; only the rows scroll | columns.md |
| T7 | A long explanation never lives in a cell - a marker in the cell, the note under the table | columns.md |
| T8 | Arrow keys between editable cells; multi-cell paste from Excel | keyboard.md |

## Old name -> where it lives now

Pointer form: `web-ref-table` T5 for a T-rule; `web-ref-table/general/filter-format.md` R4 for a
topic section. A section id (T1-T8, R1-R4, B1-B6, section numbers) never changed.

| Old skill | Now |
|---|---|
| `web-ref-table-columns` | `web-ref-table` T1-T7 -> `columns.md` |
| `web-ref-table-keyboard` | `web-ref-table` T8 -> `keyboard.md` |
| `web-ref-sort-arrows` / `-filter-format` / `-list-pagination` / `-bulk-actions` / `-action-menu` | `web-ref-table/general/<same>.md` |
| `web-ref-parameter-table` | `web-ref-table/calculation/parameter-table.md` |
| `ae49Hub-ref-sort-arrows` / `-action-menu` | `ae49Hub-ref-table/general/<same>.md` |
| `ae49Hub-ref-parameter-table` (section 11 -> `keyboard.md`) | `ae49Hub-ref-table/calculation/parameter-table.md` |
| `ae49Hub-ref-schedule-style` | `ae49Hub-ref-table/schedule/schedule-grid.md` |
| `ae49Hub-ref-list-page` | by section: Table columns / Fill mode -> `columns.md`; the rest -> `general/list-page.md`, `general/filter-format.md`, `general/list-pagination.md`, `general/bulk-actions.md` |
| `ae49Hub-ref-table-actions` | bulk -> `general/bulk-actions.md`; English heads -> `SKILL.md`; the rest -> `general/row-actions.md` |
| Nuri: `nurihub-ref-table-columns`, `-list-page`, `-filter-bar`, `-sort-arrows`, `-bulk-selection`, `-action-menu`, `-table-row-menu`, `-row-menu-layout` | `nurihub-ref-table/` (see the table below) |

## Per-project facts

| Canon file | AE49_Hub (`ae49Hub-ref-table/`) | NuriHub (`nurihub-ref-table/`) |
|---|---|---|
| `columns.md` | `columns.md` (`COL_PX`, `ListColGroup`, `TableCard`, Exclude registry) | `columns.md` |
| `keyboard.md` | `keyboard.md` (`lib/gridArrowNav.ts`, wired-table registry) | not adopted yet |
| `general/filter-format.md` | `general/filter-format.md` + `general/list-page.md` | `general/filter-format.md`, `general/list-page.md` |
| `general/sort-arrows.md` | `general/sort-arrows.md` | `general/sort-arrows.md` |
| `general/list-pagination.md` | `general/list-pagination.md` | no separate file yet |
| `general/bulk-actions.md` | `general/bulk-actions.md` | `general/bulk-actions.md` |
| `general/action-menu.md` | `general/action-menu.md` + `general/row-actions.md` | `general/action-menu.md`, `general/row-menu.md`, `general/row-menu-layout.md` |
| `calculation/parameter-table.md` | `calculation/parameter-table.md` | none yet - write it with the first calculation table |
| `schedule/schedule-grid.md` | `schedule/schedule-grid.md` | none yet - no schedule grid |

When a hub has no facts file for a topic, create it from the canon file the first time it builds one.

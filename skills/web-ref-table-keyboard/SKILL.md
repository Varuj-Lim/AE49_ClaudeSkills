---
name: web-ref-table-keyboard
description: The shared ARROW-KEY canon for every editable table in every hub web project (AE49_Hub, NuriHub, future siblings) — in any table where people type or pick values, the arrow keys move between the cells like a spreadsheet (owner ruling 2026-10-08, Q1 a + Q2 a). Up/Down always move to the same column of the next row that has a cell; Left/Right move only when the caret is at the edge of the text (or the box is empty or fully selected); arriving on a text box selects its whole text so typing replaces it; edges stay put (no wrap, no jump into another table); an OPEN picker keeps its own keys; Thai IME composition and any modifier key leave the arrows alone. Implemented ONCE per project as one delegated keydown helper wired on the table — never per-cell handlers. Row-SELECTION checkbox tables are not editable tables and stay out. Each project's own facts skill holds its helper path, wiring and table registry. Use whenever building, editing, or reviewing ANY table with input boxes, number cells, pickers or tick boxes inside cells — a parameter grid, a price grid, a schedule grid, an engineering input table — and whenever the user says "กดลูกศรแล้วเลื่อนช่อง", "arrow keys", "move like Excel", "keyboard navigation in the table", or a new table is added that holds an input.
---

# Table keyboard — shared canon (hub web projects)

## The rule (owner ruling 2026-10-08)

Owner: *"เพิ่มกติกา ทุกตารางผมอยากให้สามารถกดลูกศรแล้วสามารถเลื่อนไปช่องถัดไปตามทิศของลูกศร"*.
Q1 a fixed the behaviour, Q2 a made it the rule for every editable table in every hub, checked by
each hub's project audit.

| Key | Behaviour |
|---|---|
| **Up / Down** | ALWAYS move to the nearest cell above / below in the SAME visual column (`colSpan` counted). Rows without a cell in that column are passed over. A `<textarea>` keeps its own Up/Down. |
| **Left / Right** | Move to the previous / next cell of the row ONLY when the caret is at the start (Left) / end (Right) of the text, or the box is empty, or its WHOLE text is selected. Otherwise the caret moves as usual. A cell with no text (tick box, closed picker) always moves. |
| **Arrival** | A text / number box gets `focus()` + `select()` — typing overwrites. A tick box or picker trigger only takes focus. |
| **Edges** | First/last row, first/last cell of a row → focus stays. No wrap to the next row, no jump into another table. The key is still swallowed so the page does not scroll. |
| **Open picker** | While a dropdown / date panel is OPEN the helper does nothing — the panel's own keys win. Moving between CLOSED pickers never opens or saves anything. |
| **After a pick** | A pick made with the KEYBOARD (Enter / Space) puts focus back on the picker's trigger, so the arrows carry on from there (owner Q5 a, 2026-10-09). A pick made with the MOUSE or a tap leaves focus as before — no focus ring left on the box (owner Q6 a). A "create new" path that opens its own dialog keeps the dialog's focus. |
| **Hands off** | Thai/IME composition (`isComposing`, `keyCode 229`), any Shift / Ctrl / Alt / Meta, or an event a child already handled → do nothing. |
| **Not changed** | Tab / Shift+Tab, Enter, Home / End, Page keys. |

## What a CELL ("stop") is

An editable control inside a `<td>`: a text-like or number `<input>`, a tick box, or a custom
control that marks itself as a cell (a picker trigger). Skipped: disabled, read-only, not rendered,
anything inside an open picker panel, and everything that is not a control — derived text, totals,
links, delete / view icon buttons. A locked or read-only table renders text, has no stops, and the
arrows do nothing there.

## Which tables

- **IN — every editable table:** any table whose cells hold input boxes, number cells, pickers or
  tick boxes the user fills (parameter grids, price grids, schedule grids, engineering input tables).
  New tables of that kind are wired when they are built.
- **OUT — row-SELECTION tables** (owner AQ1 a, 2026-10-09): list / queue tables whose only control is
  the checkbox that selects a row for a bulk action. Also out: forms laid out in a grid that are not
  a `<table>`, and tables whose picker sits above the table rather than in a cell.
- **Native `type="number"` / `email` / `radio` inputs are not used in a wired table** (owner AQ3 a,
  2026-10-09; audit 2026-10-09): number and email expose no caret position, so the edge rule cannot
  work — use the project's shared number input; a radio group owns its arrow keys. The helper's stop
  selector is an ALLOW-list (text-like inputs, the shared number input, tick boxes, marked picker
  triggers), never a deny-list.

## How it is built — once per project

- **ONE helper**, a plain delegated `onKeyDown` handler attached to the `<table>` (or through an
  opt-in prop on the project's table-card component). It reads the rendered DOM — so a sorted view,
  added rows and imported rows just work — and holds no state. No per-cell handlers, no hook.
- Picker components carry two markers: the trigger says it is a cell and whether it is open
  (`aria-expanded`), the open panel says "arrows off". Without both, the panel's search box would be
  walked as a cell.
- Follow the rows as SHOWN, never the stored order.

## Per-project facts

| Project | Facts skill |
|---|---|
| AE49_Hub | `ae49Hub-ref-parameter-table` §11 "Arrow keys" (helper `lib/gridArrowNav.ts`, `TableCard arrowNav`, the table registry) + audit topic 38 |
| NuriHub | not adopted yet — when its first editable table is wired, write its facts skill from this canon |

When the rule changes, it changes HERE; the facts skills hold paths and registries only.

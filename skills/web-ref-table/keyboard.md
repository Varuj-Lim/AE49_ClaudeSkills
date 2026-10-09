**Scope (was web-ref-table-keyboard):** The shared ARROW-KEY canon for every editable table in every hub web project (AE49_Hub, NuriHub, future siblings) — in any table where people type or pick values, the arrow keys move between the cells like a spreadsheet (owner ruling 2026-10-08, Q1 a + Q2 a). Up/Down always move to the same column of the next row that has a cell; Left/Right move only when the caret is at the edge of the text (or the box is empty or fully selected); arriving on a text box selects its whole text so typing replaces it; edges stay put (no wrap, no jump into another table); an OPEN picker keeps its own keys; Thai IME composition and any modifier key leave the arrows alone. Implemented ONCE per project as one delegated keydown helper wired on the table — never per-cell handlers. Row-SELECTION checkbox tables are not editable tables and stay out. The same tables also take a multi-cell PASTE from Excel (owner XQ1–XQ7 a, 2026-10-09): the block fills the editable cells from the focused cell right then down, skipping derived columns; Add-Row tables grow; bad numbers land red and Save refuses; pickers match by label; Ctrl+Z undoes the last paste; a single value pastes as before. Each project's own facts skill holds its helper path, wiring and table registry. Use whenever building, editing, or reviewing ANY table with input boxes, number cells, pickers or tick boxes inside cells — a parameter grid, a price grid, a schedule grid, an engineering input table — and whenever the user says "กดลูกศรแล้วเลื่อนช่อง", "arrow keys", "move like Excel", "keyboard navigation in the table", "copy from Excel", "paste many cells", "วางข้อมูลจาก Excel", or a new table is added that holds an input.

## T8 · Table keyboard — shared canon (hub web projects)

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

## Arrival is always fully visible (2026-10-09, AE49 gate)

A cell the arrows land on must be fully visible — never under a frozen (sticky) left column or a
pinned header. A table with frozen columns / a pinned header pads its own scroller by their size
(scroll padding), and the helper ARRIVES with focus-without-scroll followed by a "scroll into view,
nearest" call: a browser's plain `focus()` does not scroll an element that is already PARTLY
visible, so padding alone leaves a cell half hidden (measured on AE49's Footing Inputs: 41px under
the name column). The offset is derived from the column registry, never typed. Two details found
at the gate: use `scroll-margin-left` on the NON-frozen cells' controls (a container
`scroll-padding` also drags the card while typing in a frozen cell), and a control INSIDE a frozen
(sticky) cell never scrolls its table sideways — it is always visible by construction. A frozen
cell is marked by the `sticky` class on the cell itself.

## Paste from Excel (owner XQ1–XQ7 a, 2026-10-09)

Owner: *"Today when I copy data from excel and paste into our table it will store only 1 cell."*
Every table wired for the arrow keys also takes a multi-cell paste:

| # | Rule |
|---|---|
| P1 | **Where:** every arrow-wired table (XQ1 a) — one delegated paste handler per table, beside the arrow-key helper, never per cell. |
| P2 | **Shape:** the clipboard's tab-separated block fills from the FOCUSED cell, right then down, onto the table's EDITABLE COLUMNS in order — derived / read-only columns, links and icon buttons are skipped, so a block copied from the source sheet lands column for column (XQ2 a). A cell that is only TEMPORARILY disabled in that row still takes its column's value and skips it (counted), so later values never shift a column (VQ2 a). |
| P3 | **Too many rows:** a table with an Add Row action grows to fit; a fixed-row table fills what it has and says how many rows were not placed (XQ3 a). Columns past the row's last stop are dropped and counted the same way. |
| P4 | **Bad values still land:** a number box shows its red frame and Save refuses until fixed — the project's number-input Save guard, nothing new (XQ4 a). A dedicated whole-table import that validates all-or-nothing keeps its own rule. |
| P5 | **Pickers and tick boxes:** a picker takes the option whose LABEL matches, ignoring case and extra spaces; no match → the cell is left as it was. A tick box takes TRUE/FALSE, 1/0, Y/N. One summary sentence says how many cells were skipped (XQ5 a). |
| P6 | **Undo:** Ctrl+Z right after a paste puts back every cell the paste changed — one level, the last paste only (XQ6 a). |
| P7 | **One value is not a block:** a single cell — no tab, and at most ONE trailing line break (Excel adds one to a copied cell) — pastes exactly as the browser always did (XQ7 a, VQ1 a). |
| P8 | **Hands off:** a locked / read-only table, an open picker panel, and a paste target outside a cell do nothing special. |
| P9 | **Dates are skipped** (counted): Excel's `9/10/2026` is day-first or month-first depending on the PC, and a silently swapped date is worse than a skipped one (VQ3 a). |
| P10 | **A blank Excel cell clears a text / number box** (as Excel does); it leaves a picker or tick box alone (VQ5 a). |
| P11 | **Feedback:** a clean paste shows a short success toast with the cell count and the Ctrl+Z hint; a paste with skips shows how many and why (VQ6 a). A table that saves on every pick (a schedule grid) still takes a paste — one save per cell (VQ4 a). |

Numbers read from a paste follow the project's existing paste-number rule (in AE49: a comma is
always a thousands separator, `1,145.77` = 1145.77). The summary is a Thai sentence per
`web-ref-ui-language`; field names in it stay English.

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
| AE49_Hub | `ae49Hub-ref-table/keyboard.md` "Arrow keys" (helper `lib/gridArrowNav.ts`, `TableCard arrowNav` / `stickyLeftPx`, the table registry) + audit topic 38; paste: `ae49Hub-ref-table/keyboard.md` §12 (helper `lib/gridPaste.ts`, markers `data-grid-slot` / `data-grid-band` / `data-grid-reflow`, the paste registry; plan `table-paste-excel`, done 2026-10-09) |
| NuriHub | not adopted yet — when its first editable table is wired, write its facts skill from this canon |

When the rule changes, it changes HERE; the facts skills hold paths and registries only.

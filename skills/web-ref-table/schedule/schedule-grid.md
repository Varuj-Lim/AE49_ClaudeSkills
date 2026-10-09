**Scope (new, 2026-10-09 — plan `table-skills-consolidate` D13, TQ1 b):** The shared SCHEDULE-GRID canon for every hub web project — a table whose columns (or rows) are DATES: a leave schedule, a project / stage Gantt, a booking or duty calendar. It holds the RULES of the grid itself — the frozen zone, month folding, the precedence of today / weekend / holiday, the two color lanes, the month-boundary line, the column- versus row-axis, highlighting the signed-in user, hover on clickable cells, the cell-marking mode, the bar chip and the optional heatmap. It was lifted out of one hub's facts skill, where the rules sat mixed with that hub's tokens and paths; each hub's own facts file now holds only its paths, tokens and measured numbers. A plain monthly table with no month-folding, frozen columns or cell coloring is NOT a schedule grid — it is a general list (see `general/`). This file has no frontmatter of its own: the index `SKILL.md` description carries the triggers.

## Schedule grids — shared canon (hub web projects)

One set of rules for every schedule / Gantt-style grid in every hub project. Projects supply the tokens, the component names and the measured numbers; nothing here is project-specific. A schedule grid built independently drifts — on row height, divider weight and the scope of a color override — which is the reason these rules are written down once.

## 1 · Frozen zone, fixed sizes, ONE row height

- The **frozen zone** is a run of fixed-width columns. Their widths accumulate into a sticky-offset map, so each sticky column knows its left offset and the scrolling day grid starts exactly where the frozen zone ends.
- A **day column has one fixed width** and a **collapsed month strip has one fixed width**.
- **ONE row height** for header rows, folded-month cells and every day cell. A taller variant on one axis is drift, not a feature: a grid that had one was brought back to the common height. Never reintroduce it.

## 2 · Month folding

- Fold state is a **set of folded month indices**.
- Auto-fold every month BEFORE the current one **only when the grid is showing the current year**; any other year opens unfolded.
- A fold-all and an expand-all control toggle the whole set.

## 3 · Precedence of marks — never layered

A cell shows ONE of these, in this order: an **explicit mark** (a letter or a color a user set) wins first; else **today** shows its highlight (red); else **weekend / holiday** get their own, weaker background. Never all three layered on one cell.

## 4 · Two color lanes

- **User-managed categories** (leave types, stage groups — and the weekend / holiday tints when the project's permitted editors can edit them) take their color from a **stored hex map** passed in as data (the defaults merged with the permitted editors' overrides). Paint with an inline fill and an **auto-readable text color computed from that hex**. Every grid reads the SAME map for the same swatch: a tint that one grid takes from the stored map must not be a static class on another.
- **Fixed workflow states** (a booking status such as pending / reserved / completed) are NOT user-managed categories. They keep static classes and are **never forced through the stored-hex path**.

## 5 · The month boundary takes the strongest line tier

- A month boundary — and any comparably strong "the eye should stop here" split — takes the **strongest tier of the project's shared line ladder** (its light and its on-dark variant), never a hand-typed border class. On a column axis that is the left edge of the first day of each month, in the dark header and in the body rows alike; a split between per-person blocks of columns uses the same tier.
- A split inside a **sticky header** that a border would lose (a border on a sticky cell is overlapped by the next sticky row) is drawn as an inset shadow and is a **named token**, not an inline value at two call sites.

## 6 · Column axis versus row axis

- **Column axis:** dates run left to right as columns; a person or project is a row; a month boundary is a column-divider line (§5).
- **Row axis** (the same grid transposed): dates run top to bottom as rows, with month sections folding as **banner rows** between them; each person owns a block of slot-columns across the top; the row height is the same as on the column axis (§1).
- On a row axis the month boundary is a **banner row**, not a column line — there is no month-boundary column divider to apply §5 to.

## 7 · Highlight the signed-in user — on every cell

Highlight the viewer's own line so they do not hunt for their name.

- **What is highlighted follows the axis:** the whole row on a column-axis grid; the person's column header cell only on a transposed grid (there it is a column, not a row).
- **How:** thread the signed-in user's id into the grid as a prop, match it against each row's id, and paint with a **row-aware background and border on EACH cell, across BOTH the frozen and the scrolling zones**. A row background does not show through the opaque sticky frozen cells, so the fill and the frame cannot live on the row element.
- **Look:** the app's standard "selected / this is you" fill plus a frame — a frame line top and bottom around the full row, or an inset ring on a header cell.
- **Paint only otherwise-neutral cells:** marks, today, weekend / holiday and any heatmap stay visible under the highlight.
- **Use an inline style**, not an appended class — it wins over the sticky cells' opaque background and over a hard-coded row-divider border.

## 8 · Hover-invert on clickable cells only

- Every clickable **name** cell (a person, project, code, part, a section banner) and every **month / fold** cell inverts on hover, so it is obvious which single cell a click will hit: a light frozen cell flips to a dark fill with light text, a dark header cell flips to a light fill with dark text. **Only the one hovered cell changes** — not its row, not its column.
- **One shared token**, a paired light / dark pair mirroring the line ladder. Apply it to the clickable cell, and add a group-hover variant to any colored child link or button so its text flips together with the fill.
- **Colored body cells** (marks, stage bars, bookings) are out of scope; they keep their own opacity hover.
- **Pure CSS hover, gated to hover-capable pointers** — touch never triggers it and no JS hover state can stick.
- **Coexistence with §7:** a cell carrying the signed-in-user highlight has an inline background that `:hover` cannot override, so it does not invert. That is acceptable — it is already highlighted.

## 9 · Cell marking is behind a toolbar MODE (owner ruling 2026-09-23)

Marking a cell (for example "unavailable") is not something a bare click does. After accidental clicks on a grid people mostly READ kept leaving a live selection behind, the owner ruled that the toolbar carries a labeled **mode toggle**, and **the cell's whole marking affordance exists only while the mode is ON**: the pointer cursor, the hint `title`, the press / drag handlers and the selection ring. With the mode OFF a click or a drag on an empty cell does nothing and the cell looks inert.

- **One derived value gates every affordance** — `markable = mode && mayMark(cell)` — used at every one of those sites. `mayMark` keeps its own meaning (the PERMISSION) and the mode never touches it: **the mode gates the affordance, never the permission.** Half-applying it (a pointer cursor still keyed on the permission alone) is the regression to watch for.
- **Leaving the mode** is the toggle again or `Esc`, in two stages: `Esc` with a selection clears the selection and stays in the mode; `Esc` with nothing selected leaves it. **Every exit drops the selection WITHOUT persisting — no exit ever writes.**
- **The toggle is hidden** for a viewer who owns no markable row. The mode is **session-only**, never persisted, OFF on every fresh visit.
- **§8 is untouched by this:** name cells, banners and month-fold cells still invert on hover in or out of the mode — they navigate and fold, they do not edit. So do a duty picker, the booking bars and leave boxes: only the plain empty-cell marking is mode-gated.

## 10 · One bar chip, color-free typography

Every merged colored block on a grid — a booking, a leave box, a stage run, a meeting — is **ONE shared chip**, never a hand-typed class string.

- **The chip:** one row-height centered flex, small horizontal padding, rounded, a thin border, truncating. Its typography is one shared **bar text style that is DELIBERATELY COLOR-FREE**. Width is the caller's: full width inside a cell, `flex-1` inside a flex strip.
- **A clickable bar** appends one shared click style (pointer cursor, opacity hover, a short transition).
- **Two color lanes on the SAME element** (§4): a stored-hex bar takes one helper that sets the inline fill and the auto-readable text color; a class-colored bar appends its background / text classes to the chip element.
- **Never re-apply a TEXT tier inside a bar.** The inner span carries ONLY `truncate`: a text tier's color class overrides the color the bar inherited (the bug: dark text on dark stored colors).
- **Small-chip variants** (compact summary chips) follow the same two lanes and compose a shared COMPACT chip token and the same color helper instead of a hand-typed text size and an inline color pair, and keep their own compact sizing.

## 11 · A per-column heatmap is optional

A grid with **summary or usage-stat columns** (used / total per type) MAY paint a continuous green → amber → red ramp keyed to each column's OWN min / max spread — a runtime-computed value (neither a class nor a stored hex), pastel, with forced dark text so the digits stay legible. It is **optional**: a grid with no summary columns does not add it, and it is not a required part of the canon.

## Per-project facts

| Project | Facts file |
|---|---|
| AE49_Hub | `ae49Hub-ref-table/schedule/schedule-grid.md` (the shared tokens, the three grids, the measured numbers, every dated ruling) |
| NuriHub | none yet — it has no schedule grid; write its facts file from this canon with its first one |

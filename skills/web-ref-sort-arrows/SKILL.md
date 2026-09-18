---
name: web-ref-sort-arrows
description: The shared table-sort ARROW canon for every hub web project (AE49_Hub, NuriHub, future siblings) — the direction glyph on a sortable column header points the way VALUES GROW as the eye travels DOWN the rows (owner ruling 2026-09-03), which deliberately INVERTS the common spreadsheet convention: ascending (น้อยไปมาก) shows ▼ (down), descending (มากไปน้อย) shows ▲ (up), and an unsorted column shows a muted neutral glyph. One shared SortIcon-style component per project renders all three states — never a hand-typed ▲/▼/↑/↓ literal at a call site, and never flipping fold/expand or dropdown chevrons, which share the glyph but not the meaning. Each project's own ref skill supplies the FACTS (its component, its glyph names). Use whenever adding, editing, or reviewing ANY sortable table header, sort indicator, sort direction icon, or when the user mentions ลูกศร sort, "เรียงจากน้อยไปมาก" arrows, sort chevrons, or a column-sort UI — and when standing up a NEW project's first sortable table, create its facts skill + component from this canon.
---

# Sort arrows — shared canon (hub web projects)

## The rule (owner ruling 2026-09-03)

**The arrow points the way values grow as you read DOWN the table.**

| Sort state | Glyph | Reading |
|---|---|---|
| Ascending — น้อย → มาก | **▼** (down) | values grow downward |
| Descending — มาก → น้อย | **▲** (up) | values grow upward |
| Not the active sort column | muted neutral glyph | clickable, not sorted |

⚠️ **This deliberately INVERTS the common ▲=ascending spreadsheet convention.**
That is the point of the ruling, not a bug — an auditor or a new build must not
"fix" it back. The inversion lives in exactly ONE place per project (the shared
sort-icon component), so conforming and reverting are both one-line changes.

## Which tables sort — every list, every ordered column (owner ruling 2026-09-18)

The owner, finding a list with no sort at all: *"ผมเจอว่าบางตารางไม่มี Function Sort เช่น /account/overtime"*.
Until then the rule lived only by example (a project's list-page template shows a sortable table, and
~22 of its lists sort while ~11 do not). It is a rule now:

- **Every LIST or QUEUE table sorts** — any page that lists records the user searches, filters or
  decides on (directories, order / claim / ticket lists, approval queues, logs). A detail page's
  line items, a report matrix, a print sheet, a drag-to-reorder list and an engineering grid do not
  (they have an order of their own).
- **Every column whose value has a natural order sorts** — text, code, name, date, time, number,
  status (in the status set's own canonical order, `web-ref-option-order`, never alphabetical),
  a person (by the displayed name). Columns that do not: the checkbox, Actions, a free-form
  multi-value cell, a cell that renders a component with no single value.
- **One default sort per table, stated and stable** — newest first for anything dated (the
  reference is the record's created / filed date, with its code as the tie-break), name for a
  directory. A table never shows rows "in query order"; the default is the first header state.
- **Sort state is URL state** (the project's list-URL rule — `?sort=` / `?dir=`), written only
  when off default, so a shared link and Back/Forward restore it like a filter.
- **Sorting moves nothing but the rows** — the header keeps its width and its arrow slot
  (`web-ref-table-columns` T4); the arrow follows this file's direction rule.
- The header is the ONLY sort control (no "Sort by" in the toolbar) and every sortable header is
  the same affordance on every page — the project's `thSortableClass` + `<SortIcon>`.
- A project converts its unsorted lists in one sweep and keeps a detector in its audit
  (a list-page table with no `<SortIcon>` is a finding); new lists follow this from birth.

## Rules that keep it honest

- **One component per project renders all three states.** Never a hand-typed
  `▲` / `▼` / `↑` / `↓` literal, inline SVG, or per-page ternary at a call site.
- **Only SORT arrows follow this canon.** Fold/expand chevrons, dropdown-trigger
  chevrons, and pagination arrows share the glyphs but not the meaning — they
  keep their own conventions and must never be flipped by this rule.
- The neutral state stays visibly muted (readable as "sortable, not active").
- A table that sorts on click must SHOW the indicator — silent sort state is a
  defect.

## Each project supplies its FACTS in its own ref skill

| Project | Facts skill | Component |
|---|---|---|
| AE49_Hub | `ae49Hub-ref-sort-arrows` (in-repo) | `components/ui/SortIcon.tsx` (AppIcon `chevron-down`/`chevron-up`/`sort-neutral`) |
| NuriHub / future | create on first sortable table | copy the shape: one SortIcon component over the project's icon system |

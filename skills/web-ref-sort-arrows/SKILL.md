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

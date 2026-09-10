---
name: web-ref-filter-format
description: The shared filter-bar canon for every hub web project (AE49_Hub, Nuri_Hub, future siblings) — when a list page gets tabs vs a pill dropdown vs an advanced panel, what `Clear` counts and resets, what "this filter group is inactive" means (all ticked, never empty), which controls are allowed, and the wording and DOM order of a toolbar. Use whenever adding, changing, reviewing or auditing ANY filtering surface in ANY hub project: a list page's search box or filter bar, a status tab strip, an advanced/collapsible filter panel, a date-range filter, a `Clear`/reset affordance, a row-count caption, or a filtered empty state. Trigger it even when the request only says "add a filter", "add a search box", "why doesn't Clear reset this", "add a status tab", "make this filterable", "the filters look different on this page", or "put the filters on the toolbar". Each project supplies its own component paths and tokens in its facts skill; the RULE lives here and changes here once.
---

# Filter bars — shared canon

One set of rules for every list page in every hub project. Projects supply component
paths and tokens; nothing here is project-specific.

## Why this exists (origin 2026-09-10, NuriHub)

The owner noticed one page's Advanced filter "is not consistent with the whole
program". An audit of every filtering surface found the page was **not** the odd
one out — the project had **no shared filter component at all**, so all 17
surfaces hand-rolled their own toolbar. The result:

- **five different meanings of `Clear`** — some reset the search box, some do not,
  some count it, some hide, some never existed at all
- **two search-box shapes** and two tab orders
- **two OPPOSITE meanings of "inactive"** inside one project: on one page all
  boxes ticked meant "not filtering", on another an empty set meant it. A staff
  member who learned one and applied the other got an empty table and a flat
  "nothing found" message, and concluded the data was gone.

None of that was anyone breaking a rule. **There was no rule.** That is what this
file is: the rule, so the eighteenth toolbar does not invent a sixth `Clear`.

Two of the "deviant" page's choices turned out to be *better* than the majority
and are now canon below (the advanced-panel disclosure, and all-ticked-means-
inactive). **An audit or a new build must not "fix" those back.**

## R1 · Which control, by how many dimensions

| Filter dimensions | Control |
|---|---|
| 1 coarse, mutually exclusive (a status lifecycle) | underline tab strip, "All" first, a count in each tab label |
| 1–3 secondary | pill dropdowns inline in the toolbar |
| ≥4, **or** anything with a date range | a collapsible advanced panel, closed by default, **below** the tab strip |
| any dimension that must be shareable by link | put it in the URL query |

A panel that has shrunk to one dimension is no longer an "Advanced filter" —
**rename the button to what it actually holds** (`Date range`) and give it a
matching icon. A funnel on a button labelled `Date range` is a lie.

## R2 · `Clear` and "inactive"

- **`Clear` may exclude the search box ONLY IF the search box has its own clear
  affordance** — `type="search"`, which paints a native ×, or an explicit × button.
  Where it does, `Clear (N)` counts filters only and resets filters only, so the two
  affordances stay independent. **Where the search box is a plain `type="text"` with no
  ×, `Clear` MUST reset and count it too** — otherwise there is no way to clear a search
  at all except selecting the text and deleting it.
  **Check the input; do not assume.** This clause was first written the AE49 way,
  filters-only with the native × as its justification, and that was simply wrong for
  NuriHub: `type="search"` appears nowhere in that codebase, so every list page whose
  `Clear` also resets the search box is RIGHT, not deviant (verified 2026-09-10, the day
  this file was written).
- The button **self-hides** at `count === 0`. Never render it disabled.
- **Multi-value group: ALL TICKED = inactive. An empty set shows nothing.** This
  is deliberately the opposite of the intuition that "unticking everything
  resets it" — the compensation is a `Select all` control, one click back to
  inactive. Pick this side everywhere; the cost of two projects disagreeing is a
  user who believes their data was deleted.
- **Single-value: the only sentinel is `""`.** A magic `"all"` string is allowed
  only with a comment at the call site saying why.
- `Clear` must also reset **the panel that is currently open**, not just the
  committed state. Otherwise the panel keeps showing stale boxes and the next
  Apply silently re-applies a filter the user just cleared — with nothing on
  screen to explain why rows vanished again.

## R3 · Allowed controls

- **Single-value pick → the project's one select component.** Never a raw
  `<select>`, never a `<datalist>`, never a hand-rolled option panel.
- **Multi-value pick → the project's one multi-select component.** Never
  hand-roll another popover.
- **A value drawn from a closed list the page has already loaded → never a free
  text box.** One typo yields zero rows with no explanation, and the page already
  holds the real options.
- **Date range → one shared pair of fields.** And the `To` bound must be
  genuinely inclusive of the chosen day: compare `< startOfNextDay`, never
  `<= dateTo + oneDay`. A record stored at exactly midnight lands ON the second
  bound and is pulled in, so "To 10 Sept" quietly lists the 11th and inflates
  every figure read off the filtered list.
- **No debounce** while filters run over an already-loaded in-memory array.
  Revisit only if a filter ever queries the server.
- **Sort never moves into the toolbar.** Sorting lives on the table header with
  the project's sort icon (see `web-ref-sort-arrows`).
- **No active-filter chips.** A tinted pill is already the affordance.

## R4 · Wording and layout

- DOM order: page header → tab strip → toolbar → advanced panel → bulk-action bar
  → table.
- Toolbar order: search box → filter pills → `Clear (N)` → the row-count caption
  pushed right.
- Placeholder: `Search by <field>, <field>…` — one real ellipsis character, never
  `...`, never a bare `Search`. Name the fields it actually matches.
- Pill label: `<Label>: All` when inactive, `<Label> (N)` when active.
- Tab label: Title Case, "All" first, a per-tab count preferred. **Never mix
  dimensions in one strip** — a payment state does not belong in a status strip.
- The row-count caption in a page header counts **total**, never the filtered
  subset.
- A filtered list has **two mandatory empty states**:
  `total === 0 ? "No X yet." : "No X match your search or filters."` One flat
  message for both is how a user concludes the records are gone.

## Rules that keep it honest

- **One component per project per control**, and every page uses it. The moment a
  second page hand-rolls the same toolbar, the drift restarts.
- When a page's filter needs something the shared component cannot do, **extend
  the component**, never fork it inline.
- Converting the whole app at once is not the goal and not advised: new pages use
  the shared controls from birth, old pages convert when they are being touched
  anyway. Pick the project's already-shared toolbar (if it has one) as the
  reference implementation to convert first.
- A rule here that a project deliberately diverges from must say so **in that
  project's facts skill**, with the reason. Silent divergence is what this file
  exists to end.

## Each project supplies its FACTS in its own ref skill

| Project | Facts skill | Shared components |
|---|---|---|
| AE49_Hub | `ae49Hub-ref-list-page` (in-repo) | `SearchInput`, `FilterSelect`, `FilterMultiSelect`, `ClearFiltersButton`, `useMultiSelectFilter`, `TableCard`; date range per `ae49Hub-ref-date-range` |
| NuriHub | `nurihub-ref-filter-bar` (in-repo, created 2026-09-10 at the first conversion) | single-value picks go through its one `SelectField` (`nurihub-ref-select-field`); a shared multi-value control was adopted by owner ruling B on 2026-09-10 and is not built yet — four sites still hand-roll one; `components/logs/LogTable.tsx` is the only already-shared toolbar and the conversion reference |
| future siblings | create on the first sortable/filterable list | copy the shape: one component per control over the project's own tokens |

**Note on a dangling name:** `ae49Hub-ref-list-page` and AE49's
`useMultiSelectFilter` both cite a skill called `web-ref-filter-dropdown`, which
has never existed. **This file is what those references meant** — repoint them
here rather than creating a second canon.

**Scope (was web-ref-filter-format):** The shared filter-bar canon for every hub web project (AE49_Hub, Nuri_Hub, future siblings) — when a list page gets tabs vs a pill dropdown vs an advanced panel, what `Clear` counts and resets, what "this filter group is inactive" means (all ticked, never empty), which controls are allowed (a list-page filter is a multi-select checklist by default), why a filter pill never changes width with the selection, and the wording and DOM order of a toolbar. Use whenever adding, changing, reviewing or auditing ANY filtering surface in ANY hub project: a list page's search box or filter bar, a status tab strip, an advanced/collapsible filter panel, a date-range filter, a `Clear`/reset affordance, a row-count caption, or a filtered empty state. Trigger it even when the request only says "add a filter", "add a search box", "why doesn't Clear reset this", "add a status tab", "make this filterable", "the filters look different on this page", or "put the filters on the toolbar". Each project supplies its own component paths and tokens in its facts skill; the RULE lives here and changes here once.

## Filter bars — shared canon

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
- **The button is ALWAYS laid out.** At `count === 0` it goes `invisible` + `inert` +
  `aria-hidden` + `tabIndex={-1}` + `disabled` — never `return null`, and never a
  *visible* disabled button. A control that appears and disappears in the middle of
  the toolbar row slides every pill after it and can re-wrap the row, which moves the
  table (`web-ref-table` T5). The label also reserves its widest counted form
  with a measured `min-w-[…]`. *(2026-09-22, AE49 `table-columns-app-wide` B1 — this
  supersedes the 2026-09-10 "self-hides / never disabled" clause: the `disabled` here
  is invisible and exists only to take the control out of pointer and Tab reach.)*
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

- **A list-page filter is a MULTI-select checklist by default** (owner ruling
  2026-09-11: *"Format ของ Filter เรามันเป็นให้กดเลือกว่าจะ Filter อะไรออกบ้าง"* — AE49's
  long-standing rule, promoted into this canon because NuriHub never received it and grew
  single-value pills instead). The user ticks which values to see; the pill reads
  `<Label>: All` / `<Label> (N)`. A single-value pick is only for a **genuinely one-value
  choice** — a report period, a chart's top-N — and says why at the call site.
- **An on/off view of the rows → the project's one toggle pill (`FilterToggle`)** — e.g. `Created by me`
  (NuriHub plan `home-page` D13, 2026-10-22; AE49 has the same component). It is not a list, so it is not
  a checklist: one pill, `aria-pressed`, the URL holds `?<key>=1` only while on, and Clear counts and resets it.
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
  the project's sort icon (see `web-ref-table/general/sort-arrows.md`).
- **No active-filter chips.** A tinted pill is already the affordance.

## R4 · Wording and layout

- DOM order: page header → tab strip → toolbar → advanced panel → table. **The bulk-action cluster has
  no row of its own:** it is the LAST child of the toolbar row, right-aligned (`ml-auto`), always laid out
  and merely invisible + inert while nothing is ticked, so the table never moves (`web-ref-table` T5, owner 2026-09-18).
- Toolbar order: search box → filter pills → **the row-count caption** → `Clear (N)`, all
  packed LEFT. **The caption is NOT pushed right** (owner ruling 2026-09-23, reversing the
  `Clear (N)` → caption-pushed-right order this line carried until then).
  - **Why it moved.** Pushed right, the caption floats alone in the empty middle of a sparse
    toolbar with nothing to read it against — the owner's words were *"บางอันมันลอยๆอยู่เพราะคำสั่งไม่ครบ"*.
    Sitting against the last filter pill it reads as the ANSWER to the filter just changed:
    cause and effect side by side, which is the question the number exists to answer.
  - **The cost, accepted with it in view:** `Clear (N)` clears the filters, and the caption now
    sits between the pills and the button that clears them — a control separated from its
    target. The owner was shown this and chose cause-and-effect adjacency over it.
  - **`ml-auto` therefore belongs to the bulk-selection cluster**, which becomes the only member
    of the right-hand group. Exactly ONE child of the toolbar row may carry it: two `ml-auto`
    children split the free space between them and float the first one mid-row.
  - **This reverses a rule both hubs had already built to.** NuriHub shipped twelve call sites
    and AE49_Hub shipped its own `RowCountCaption` against the old order, correctly — neither
    was in breach. A sibling asked to "fix" this is being asked to follow a CHANGED rule, not
    to repair a mistake, and a handoff prompt must say so.
- Placeholder: `Search by <field>, <field>…` — one real ellipsis character, never
  `...`, never a bare `Search`. Name the fields it actually matches.
- Pill label: `<Label>: All` when inactive, `<Label> (N)` when active.
- **Pill width never follows the selection** (owner rulings 2026-09-11: *"Filter ทั้งหมด ต้องมา
  ขนาดช่องตายตัวไม่ขยับไปหาตามหัวข้อที่เลือก"*). Because a filter is a checklist (R3), its pill shows
  `<Label>: All` or `<Label> (N)` — never the chosen values — and it sizes to the WIDEST of those
  forms: render every form invisibly in the same grid cell as the visible one, so moving
  between `Department: All` and `Department (4)` never nudges the toolbar. *(This replaces an
  "as wide as its longest option" rule that lived for a few hours the same day — it only made
  sense while a pill could display the selected value.)* A genuine single-value filter (R3's
  rare case) keeps a fixed width from its container. Tables have the matching rule in
  `web-ref-table`.
- Tab label: Title Case, "All" first, a per-tab count preferred. **Never mix
  dimensions in one strip** — a payment state does not belong in a status strip.
- The row-count caption in a page header counts **total**, never the filtered
  subset.
- **EVERY list page carries a toolbar row-count caption, and it reads `{filtered} of {total}`**
  (owner ruling 2026-09-23, NuriHub). Until that ruling this section said only WHERE a caption
  sits, never whether one must exist or how it reads — so NuriHub had three shapes at once
  (`{filtered} of {total}` on seven pages, `{filtered} results` on one, nothing on five) with
  nobody breaking a rule. The owner's words were *"ควรเหมือนกัน แบบไหนก็ได้ มี หรือไม่มี แต่ต้องเหมือนกันทั้งหมด"*
  and the direction was chosen deliberately: **adding the count to the pages that lack it beats
  deleting it from the pages that have it**, because the number answers a question the user
  actually has — did my filter do anything, and have I seen everything? `{filtered} results`
  answers only the first half.
  - **No trailing noun.** `12 of 40`, never `12 of 40 tickets` — one reservation has to serve
    every page, and a noun makes each one a different width.
  - **The caption reserves its width**, like `Clear (N)` and for the same reason: it sits on the
    row directly above the table, so a caption that widens when the count crosses a digit
    boundary re-lays the toolbar and drops the table (`web-ref-table` T5). Reserve the
    widest form the page can reach, and reserve it in ONE shared component — a per-page class is
    how the three shapes happened.
  - **The denominator is the unfiltered count of what THAT table shows**, which is not always the
    collection it came from: a page showing one kind out of a mixed collection counts its kind, a
    page behind a tab strip counts what the tab holds. Getting this wrong prints "4 of 91" on a
    twelve-row list and reads as a bug in the filter.
  - **A surface with no filter gets no caption.** A caption whose numerator can never differ from
    its denominator is a constant wearing a filter's clothes. If a section already shows its own
    count in its heading, that is the count.
- A filtered list has **two mandatory empty states**:
  `total === 0 ? "No X yet." : "No X match your search or filters."` One flat
  message for both is how a user concludes the records are gone.
  - **The no-match state carries a Clear button** (owner 2026-10-29, Q88 a; AE49_Hub plan
    `table-units-row-and-empty-clear` D5 / D6): under the sentence, a quiet-tier button reading
    **`Clear search & filters`** that resets the search box AND every filter in ONE press — so, unlike the
    toolbar's `Clear (N)` (R2, which may leave the search box to its own ×), it never leaves a search in place
    that would keep the list empty. It is shown on EVERY no-match row, a search-only one included. The sentence
    already says "your search or filters"; a button that left the search behind would make the user clear it
    twice.
  - **"No X yet" has NO button** — there is nothing to clear. Neither does a loading row, a "pick an employee
    first" row, a tab that simply holds no rows, or a page empty only in the year / period its scope chose
    (that reads "No X yet", and the scope is not the button's to reset).
  - **What the button resets:** the search box, every filter, and an open filter panel (R2's "Clear also resets
    the open panel"). Never a scope that decides what is READ (a year or period scope — a free in-memory reset must
    not become a network read) and never a tab of a tab strip.
  - **One shared component renders the row**, one `colSpan` cell (T4: no column moves), and it shows the button
    only when the caller passes a clear handler — which a caller does ONLY in its no-match branch. The handler is
    the page's existing `Clear (N)` reset plus the search reset, never a new reset path (a second path is how a
    filter that lives in the URL ends up cleared on screen but not in the link). The sentence keeps living at the
    call site; a sentence that ended "— press Clear to see everything" drops that tail, the button replaces it.

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
| AE49_Hub | `ae49Hub-ref-table/general/filter-format.md` + `ae49Hub-ref-table/general/list-page.md` (in-repo) | `SearchInput`, `FilterSelect`, `FilterMultiSelect`, `ClearFiltersButton`, `useMultiSelectFilter`, `TableCard`; date range per `ae49Hub-ref-date-time/date.md` |
| NuriHub | `nurihub-ref-table/general/filter-format.md` (in-repo, created 2026-09-10 at the first conversion) | single-value picks go through its one `SelectField` (`nurihub-ref-select-field`); multi-value picks go through `FilterMultiSelect` (owner ruling B 2026-09-10, built 2026-09-11 — all four hand-rolled sites converted), and its exported pill class `FILTER_TRIGGER_CLASS` dresses EVERY filter pill, single- and multi-value (all single-value pills converted 2026-09-11); `components/logs/LogTable.tsx` is the only already-shared toolbar and the conversion reference |
| future siblings | create on the first sortable/filterable list | copy the shape: one component per control over the project's own tokens |

**Note on a dangling name:** `ae49Hub-ref-table/general/filter-format.md` and AE49's
`useMultiSelectFilter` both cite a skill called `web-ref-filter-dropdown`, which
has never existed. **This file is what those references meant** — repoint them
here rather than creating a second canon.

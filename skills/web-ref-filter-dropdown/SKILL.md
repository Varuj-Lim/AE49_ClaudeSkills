---
name: web-ref-filter-dropdown
description: The checkbox multi-select filter-dropdown pattern for a list / index / directory page — a `FilterMultiSelect` button that opens a checkbox list with an **"All"** master box (tick any mix of values; indeterminate dash on a partial pick; outside-click closes; long lists scroll with "All" pinned), driven by a `useMultiSelectFilter` hook that owns the `selected` set, the row `matches()` predicate, the off-default `active`/`isDefault` flags, and `reset()`. Distilled from a real Next.js + Tailwind app. Use whenever building, reviewing, or porting a filter dropdown on a searchable/filterable table — one that should let the user pick more than one value at once (statuses, types, departments, a person/entity picker) — or when a request says "filter by multiple", "checkbox filter", "multi-select filter", "an All option", or "let me pick more than one status". Trigger even when the request only says "add a filter dropdown", "filter this table", or "a filter like the other pages".
---

# Filter dropdown (checkbox multi-select)

The default filter control for a list page is a **checkbox multi-select**, not a
single-value `<select>`. The user ticks any combination of values; an **"All"**
master checkbox is the one-click "show everything". Everything is ticked by
default, so the initial view shows all records — multi-select is purely additive.

Two pieces: the **`FilterMultiSelect`** component (the dropdown UI) and the
**`useMultiSelectFilter`** hook (the per-filter state). One hook instance per
filter; the parent wires the hook into the component and the row predicate.

## The hook — `useMultiSelectFilter`

```ts
const status = useMultiSelectFilter(allValues: string[], defaultValues?: string[]);
// → { selected, setSelected, active, isDefault, matches, reset }
```

- `allValues` — every current option **value** (a `string[]`). For a dynamic list
  that loads from the server after first render, pass `options.map(o => o.value)`;
  the hook stays correct before and after the data arrives (see the sentinel note).
- `defaultValues` — omit for the normal **"all selected = show everything"**
  default. Pass a subset for a filter that should open pre-narrowed (e.g. a Status
  filter that opens on `["open","in_progress"]` and hides resolved rows).
- Returns:
  - `selected: Set<string>` → the component's `selected`
  - `setSelected: (next: Set<string>) => void` → the component's `onChange`
  - `active: boolean` → the component's `active` (highlight when off-default)
  - `isDefault: boolean` → true when there's nothing to clear (feeds the
    active-filter count)
  - `matches: (value: string) => boolean` → the row predicate
  - `reset: () => void` → back to default (the Clear-filters action)

**Why a `null` sentinel (the key correctness point).** Internally the hook holds
`Set<string> | null`, where `null` means "at default". `matches()` returns `true`
for every value while at default (unless a custom `defaultValues` was given, in
which case it honours that subset). Without this, a filter whose option list
loads asynchronously — where a naive `default = new Set(allValues)` initialises
empty — would hide every row until the data arrives. The sentinel makes "at
default" mean "show all", independent of whether the options have loaded.

```ts
"use client";
import { useCallback, useMemo, useState } from "react";

export interface MultiSelectFilter {
  selected: Set<string>;
  setSelected: (next: Set<string>) => void;
  active: boolean;
  isDefault: boolean;
  matches: (value: string) => boolean;
  reset: () => void;
}

const setEq = (a: Set<string>, b: Set<string>) =>
  a.size === b.size && [...a].every((v) => b.has(v));

export function useMultiSelectFilter(
  allValues: string[],
  defaultValues?: string[],
): MultiSelectFilter {
  const [sel, setSel] = useState<Set<string> | null>(null); // null = at default
  const defaultSet = useMemo(() => new Set(defaultValues ?? allValues), [defaultValues, allValues]);
  const selected = sel ?? defaultSet;
  const isDefault = sel === null;
  const setSelected = useCallback((next: Set<string>) => setSel(setEq(next, defaultSet) ? null : next), [defaultSet]);
  const reset = useCallback(() => setSel(null), []);
  const matches = useCallback(
    (value: string) => (sel === null ? (defaultValues ? defaultSet.has(value) : true) : sel.has(value)),
    [sel, defaultSet, defaultValues],
  );
  return { selected, setSelected, active: !isDefault, isDefault, matches, reset };
}
```

## The component — `FilterMultiSelect`

A button reading `"{label}: All"` (everything ticked) or `"{label} ({n})"` (a
subset), opening a panel with:
- an **"All"** master checkbox that selects/clears every option, rendered
  **indeterminate** (a dash) while a partial set is picked;
- the option checkboxes, capped in height so a long list (~50 items) **scrolls
  inside the panel while "All" stays pinned** above the scroll area;
- **outside-click to close** (a `mousedown` listener on `document`).

Props: `label` (a singular noun — "Status", "Type", "Department"), `options:
{value,label}[]`, `selected: Set<string>`, `onChange: (next: Set<string>) => void`,
`active: boolean`. The component owns the All / toggle logic; the parent only
supplies the set and reacts to `onChange`. An empty selected set matches nothing —
"All" is the one-click "show everything".

## Parent wiring contract

```tsx
const STATUS_OPTIONS = [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }];

const status = useMultiSelectFilter(STATUS_OPTIONS.map((o) => o.value));
const type   = useMultiSelectFilter(TYPE_OPTIONS.map((o) => o.value));

// One line per filter; count only the off-default ones for the Clear button.
const activeFilters = [status, type].filter((f) => !f.isDefault).length;

const filtered = rows.filter((r) =>
  matchSearch(r) && status.matches(r.status) && type.matches(r.type),
);

<div className="flex flex-wrap items-center gap-3">
  <SearchInput value={search} onChange={setSearch} placeholder="Search…" />
  <FilterMultiSelect label="Status" options={STATUS_OPTIONS}
    selected={status.selected} onChange={status.setSelected} active={status.active} />
  <FilterMultiSelect label="Type" options={TYPE_OPTIONS}
    selected={type.selected} onChange={type.setSelected} active={type.active} />
  <ClearFiltersButton count={activeFilters} onClick={() => { status.reset(); type.reset(); }} />
</div>
```

Rules:
- **One hook per filter**, called unconditionally at the top level (never inside a
  conditional or after an early return — the Rules of Hooks). A dynamic-options
  filter's hook must sit **after** its options array is computed, but still
  unconditionally.
- **Predicate:** `x.matches(row.field)`. Add `?? ""` only when the field can be
  null/undefined. For a predicate over a possibly-empty collection
  (`.some()`/`.includes()`), guard with `x.isDefault || coll.some((v) => x.matches(v))`
  so an empty collection still shows at default.
- **Mapped predicate:** when the row doesn't hold the option value directly, map it
  — e.g. a linked/not-linked filter: `x.matches(isLinked(r) ? "linked" : "not-linked")`.
- **Count:** `[a, b, …].filter((f) => !f.isDefault).length` → `ClearFiltersButton count`.
- **Clear:** call `x.reset()` for every filter in the Clear handler.
- **Custom default:** pass `defaultValues` for a filter that opens pre-narrowed
  (e.g. `useMultiSelectFilter(STATUS, ["open", "in_progress"])`); its `active`/count
  then reflect "off *that* default", not "off all".

## Don't

- Don't reach for a single-select `<select>` by default — use `FilterMultiSelect`.
  Keep a single-select only for a genuinely one-value-only filter.
- Don't hand-roll the per-filter `Set` boilerplate (default / isDefault / matches /
  reset) on the page — that's exactly what `useMultiSelectFilter` centralises.
- Don't initialise a dynamic filter as `new Set(allValues)` — it starts empty and
  hides everything until data loads. Use the hook's `null`-at-default sentinel.
- Don't put a hook call inside a conditional or below an early return.

## Cross-project note

The palette classes in `FilterMultiSelect` — `accent-ae49-slate` (the checkbox
tick) and `border-ae49-slate bg-ae49-cloud text-ae49-slate` (the active-button
highlight) — are **project-specific**. Swap them for the host project's own
accent/active tokens when porting; the structure (All master, indeterminate
partial, scroll-capped list, outside-click close) is what's reusable.

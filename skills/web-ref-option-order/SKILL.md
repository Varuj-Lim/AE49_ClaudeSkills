---
name: web-ref-option-order
description: The shared option-ORDER canon for every hub web project (AE49_Hub, NuriHub, future siblings) — every dropdown, picker, and filter option list shows its rows in a DEFINED order, never raw database fetch order (ruling 2026-09-03, born when a project picker showed AE2619 → AE9999 → AE2617). The PROCESS lives here and changes here once: a four-tier ladder (semantic-sequence constants keep their declared order and are NEVER sorted; entity lists follow their project's entity canon, e.g. an employee-order or project-code helper; every other human-label list sorts ascending by label with a locale-aware numeric-aware collator; date/time-shaped lists are chronological), plus the honesty rules (fetch order is never presentation order, sort a copy, sort before synthetic rows, tier 1 beats everything, one collator per project). Each project's own ref skill supplies the FACTS: its lib helpers, its entity canons, its collator home. Use whenever adding, editing, or reviewing ANY option list in a hub project, whenever the user mentions option order, sorting a dropdown, "เรียง", "จากน้อยไปมาก", or a picker showing rows in random order — and when standing up a NEW project's first picker, create its project-facts skill + tiny lib from this canon.
---

# Option order — shared canon (hub web projects)

## Why this exists

2026-09-03: mid-test, a Project picker in AE49_Hub listed `AE2619 — AE2618 — AE9999 —
AE2617 …` — raw Firestore fetch order. Half the pickers sorted (those built on a shared
options helper), half showed whatever the query returned. The owner ruled: **one defined
order per kind of list, in every picker, in every hub project.** The principle is
project-agnostic, so it lives here once; each project keeps its own facts skill naming its
helpers.

## The ladder — four tiers, first match wins

| # | Kind of list | Order | Who defines it |
|---|---|---|---|
| 1 | **Semantic sequence** — work stages, lifecycle states, type/category enums that encode a real-world progression | The constant's own declared order. **NEVER sort these** — alphabetizing a sequence is a bug, not a cleanup. | the project's `lib/constants/*` |
| 2 | **Entity with its own canon** — people, projects, anything the project already orders app-wide | That entity's ordering helper, reused — never re-sorted ad hoc | the project's entity libs (named in its facts skill) |
| 3 | **Everything else with a human label** — catalogs, product types, companies, device options | Ascending by label via the project's ONE collator helper — locale-aware (Thai labels collate correctly) and numeric-aware (`"9" < "10"`) | the project's option-order lib |
| 4 | **Date/time-shaped lists** | Chronological | usually free from how the list is generated |

## Rules that keep it honest

- **Fetch order is never a presentation order.** A `getX().then(setX)` feeding an options
  map without a sort is a defect even when today's data happens to look sorted.
- **Sort a COPY** (`[...list].sort`) — never mutate state in place.
- **Sort before mapping / before synthetic rows**, so a deliberately-placed row (a
  stale-value row unshifted to the top, a special "Other" first option) stays above the
  sorted body.
- **Tier 1 beats everything.** If the list encodes a sequence, keeping that sequence IS
  the ordering.
- **One collator per project.** `Intl.Collator([<locales>], { numeric: true,
  sensitivity: "base" })` in one lib file; extend it, never fork a second comparator
  inline at a call site.

## Each project supplies its FACTS in its own ref skill

| Project | Facts skill | Helpers |
|---|---|---|
| AE49_Hub | `ae49Hub-ref-option-order` (in-repo) | `lib/optionOrder.ts` (tier-3 collator) · `lib/employeeOrder.ts` (people) · `lib/project.ts` `sortByProjectCode` / `toProjectPickerOptions` (projects) |
| NuriHub / future | create on first picker | copy the shape: one collator lib + entity helpers |

A NEW project adopts this canon by creating its facts skill and a tiny collator lib the
first time it builds a picker — never by copying comparator code between call sites.

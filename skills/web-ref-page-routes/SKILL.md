---
name: web-ref-page-routes
description: >-
  The canonical record-navigation pattern for a CRUD entity — the route shape
  (/<entity> list · /<entity>/[id]/view · /<entity>/[id]/edit · /<entity>/add),
  a breadcrumb trail (Hardware › NB-ACER-01 › Edit) that REPLACES the lone
  in-page back arrow, origin-aware "back" delegated to the browser's own back
  button, an edit-save that uses router.replace so Edit never lingers in history,
  and list filter/sort/search kept in the URL and carried through view→edit→save
  via a single `return` param so a filtered list survives the round-trip.
  Distilled from real Next.js App Router + Tailwind apps. Use
  whenever building, reviewing, or porting any record view / detail / edit / add
  page, a breadcrumb, or "back" navigation in any project — and whenever someone
  reports "the back button goes to the edit page instead of the list", "returning
  to the list loses my filters", or asks for breadcrumbs / a record-page route
  structure. Trigger even when the request only says "add a view page", "edit
  page", "breadcrumb", "back button", "record detail route", or "list → detail
  navigation".
---

# Web Page Routes — record navigation

## Why this exists

A record CRUD flow is **list → view → edit → save**. The naive build has two nav bugs:

1. **Back returns to Edit, not the list.** After an edit save the form does
   `router.push(view)`, so history becomes `[list, view, edit, view]` — Back from the
   fresh view lands on **Edit**. Users get trapped bouncing view↔edit.
2. **Returning to the list loses your place.** A hardcoded back link (or a fresh push to
   `/<entity>`) re-mounts the list clean, dropping the search / filters / sort / scroll
   the user had.

This pattern fixes both and standardizes the routes, so every entity navigates the same way.

## The route shape (canonical)

```
/<entity>                 → list   (the only page reached from the sidebar)
/<entity>/[id]/view       → view   (read-only detail)
/<entity>/[id]/edit       → edit   (form, mode="edit")
/<entity>/add             → add    (form, mode="add")
```

Worked example (<hubname> Hardware): `/operations/it/hardware`, `.../hardware/[id]/view`,
`.../hardware/[id]/edit`, `.../hardware/add`.

## Breadcrumbs replace the in-page back arrow

**Every record page (view / edit / add) shows a breadcrumb, not a lone back arrow.** The
lone in-page back arrow is **retired** — origin-aware "back" is the **browser's own back
button** (see below). The breadcrumb is the labeled, deterministic, structure-based nav.

Trail per page (separator `›`, muted; the **last** crumb is the current page, **not** a link):

| Page | Breadcrumb | Crumb links |
|---|---|---|
| **List** | *(none — the page title is the root)* | — |
| **View** | `Hardware › NB-ACER-01` | `Hardware` → list · record = current |
| **Edit** | `Hardware › NB-ACER-01 › Edit` | `Hardware` → list · `NB-ACER-01` → view · `Edit` = current |
| **Add**  | `Hardware › New` | `Hardware` → list · `New` = current |

- The record label (`NB-ACER-01`) is the loaded record's display id/name — render it only
  after the record loads (show the loading spinner first), so the crumb never flashes a
  placeholder.
- **Which pages get what:** breadcrumbs on record view/edit/add. **No** breadcrumb and
  **no** arrow on top-level / sidebar / tabbed pages (the list itself, settings tabs,
  dashboards) — those navigate by sidebar + tabs. **No page keeps a lone back arrow.**

### The Breadcrumb component (portable)

```tsx
// components/ui/Breadcrumb.tsx
"use client";
import Link from "next/link";

export type Crumb = { label: string; href?: string }; // href omitted => current page

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {c.href && !last ? (
              <Link href={c.href} className="text-gray-500 hover:text-gray-800 transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className={last ? "font-semibold text-gray-900" : "text-gray-500"}>{c.label}</span>
            )}
            {!last && <span className="text-gray-300" aria-hidden>›</span>}
          </span>
        );
      })}
    </nav>
  );
}
```

Place it where the old back-arrow header sat (top of the page, above the title/form).

## Preserve navigation state through list → view → edit → save

Two independent mechanisms — keep both:

### 1. The browser back button owns origin-aware return

A record is reachable from many places (its list, an approvals table, a schedule grid, a
notification link). The **browser back button** already returns the user to the *actual*
page they came from, with its scroll + filters intact (it's the kept-alive client-cache
page). We keep that for free — by **not** adding a competing in-page arrow. The one code
rule that makes it correct:

- **Edit-save must `router.replace(view)`, never `router.push(view)`.** Replacing keeps
  Edit out of the back stack (`[list, view, edit]` → the current entry is swapped for
  view), so the browser Back from the post-save view steps past Edit to the real origin.

### 2. A single `return` param keeps the *filtered list* one click away

The breadcrumb's `Hardware` crumb is a plain link — a fresh navigation — so on its own it
would land on a **clean** list, losing the user's filters. Fix: **keep the list's state in
its URL, and thread that URL through the record pages as one `return` query param.**

- **List keeps its state in the URL.** Search / filter / sort / (optionally page) live in
  the query string — the list reads them from `useSearchParams` and writes them back with
  `router.replace` on change. The list URL *is* the state (also makes a filtered list
  shareable / bookmarkable).
- **List row-links carry it:** `href = /<entity>/<id>/view?return=<encodeURIComponent(currentListUrl)>`
  where `currentListUrl` includes the list's own query (e.g. `/hardware?brand=Dell&sort=name`).
- **View / Edit / Add read `return`** (`useSearchParams().get("return")`) and use it for the
  `Hardware` crumb href — falling back to the bare `/<entity>` when it's absent (deep link,
  refresh, or arrived from elsewhere). They **thread it forward** unchanged:
  - View's `Edit` action → `/<entity>/<id>/edit?return=<same>`
  - Edit's record crumb → `/<entity>/<id>/view?return=<same>`
  - **Edit-save → `router.replace(/<entity>/<id>/view?return=<same>)`** (rule 1 + the param together)
- `return` always points at the **list** (never the view), so it stays valid through every hop.

Net: browser-back restores your *exact* origin; the breadcrumb's list crumb restores your
*filtered* list; and Edit never traps you.

## Do / don't

- ✅ Breadcrumb on every record view/edit/add page; **no** lone in-page back arrow anywhere.
- ✅ `router.replace` (not `push`) for the edit→view hop on save.
- ✅ List filters/sort/search in the URL; thread the list URL via one `return` param.
- ✅ Last crumb is the current page and is **not** a link.
- ❌ Don't reintroduce a hardcoded back link to a fixed list — it ignores the real origin.
- ❌ Don't `router.push(view)` after an edit save — that's the "Back goes to Edit" bug.
- ❌ Don't put breadcrumbs on sidebar/tabbed top-level pages — those aren't a drill-in hierarchy.
- ❌ Don't store list state only in React state / a fresh push — it's lost on the round-trip.

## Migration note (existing apps)

Apps that used a shared origin-aware back-arrow component (e.g. <hubname>'s `BackButton` /
`useGoBack` on the leave-order, draftsman-order, and project view pages) migrate by:
swapping the arrow for `<Breadcrumb>`, adding the `return` param to list row-links, and
changing edit-save from `push` to `replace`. The browser back button then subsumes what the
arrow's `router.back()` did — so `BackButton`/`useGoBack` can be retired once every record
page is migrated.

---
name: web-ref-ticket-page
description: >-
  The canonical support-ticket / bug-report / feedback page pattern — a header
  with a "New ticket" button, a search + status/type filter toolbar, a record
  table (Title · Type · Submitter · Status · Created · Actions), and every
  create/view/edit/delete handled in modals on one page. Distilled from two real
  Next.js + Tailwind + Firebase apps (AE49_Hub, NuriHub) that share it. Use
  whenever building, reviewing, or porting a ticket / support / bug-report /
  feedback / issue / request page in any project — the layout, the status/type
  badge colors (open gray / in_progress amber / resolved emerald; bug rose /
  suggestion indigo), the whole-row-click-opens-modal interaction, or the
  privileged bulk-delete. Trigger even when the request only says "add a ticket
  page", "bug report list", "feedback table", "support tickets", or "a page
  where users file issues".
---

# Web Ticket Page

## Why this exists

The support-ticket page is the same page in every app: file a bug or suggestion,
list them, mark them resolved. Two real apps (**AE49_Hub**, **NuriHub**) forked it
from one origin and still share the layout, colors, and interaction. Copy this
canon into a new project instead of reinventing it. The two apps are the worked
examples — see [REFERENCE.md](REFERENCE.md) for a paste-ready skeleton + how each
one did it.

## Anatomy

```
┌────────────────────────────────────────────────────────────┐
│ Tickets                                    [ + New ticket ] │  header: title + subtitle + primary pill
│ Report a bug or suggest an improvement                      │
├────────────────────────────────────────────────────────────┤
│ [🔍 Search…]   [Status ▾]   [Type ▾]   Clear(2)   12 of 40  │  toolbar: search · filters · clear · count
├────────────────────────────────────────────────────────────┤
│ ▸ 3 selected      [ Delete selected ]      Clear            │  bulk bar — privileged, only when rows picked
├────────────────────────────────────────────────────────────┤
│ ☐  Title           Type   Submitter  Status     Created   ⋯ │  table header (sticky)
│ ☐  Login broken    Bug    K.Nick     In Prog    12 Jul   🗑 │  whole row → opens Detail modal
└────────────────────────────────────────────────────────────┘
   Modals on this one page (no extra routes):  Create · Detail/Edit · Delete-confirm
```

## Data model

```ts
type TicketType   = "bug" | "suggestion";
type TicketStatus = "open" | "in_progress" | "resolved";   // starts "open"

interface Ticket {
  id: string;
  title: string;
  description: string;            // plain text
  type: TicketType;
  status: TicketStatus;
  submittedBy: string;           // uid
  submittedByName: string;       // snapshot
  submittedByNickname?: string;
  createdAt: string;             // ISO
  updatedAt: string;             // ISO
  resolvedAt?: string;           // set when status → resolved
  attachmentUrl?: string;        // optional screenshot (cloud-storage URL)
  // AE49_Hub-only reply feature (leave out if you don't need it):
  response?: string; respondedBy?: string; respondedByName?: string; respondedAt?: string;
}
```

Backed by a `tickets` collection, queried newest-first (`createdAt desc`).

## Badge colors (the shared canon)

Both apps keep these **page-local** (declared at the top of `page.tsx`, not in a
shared color file). Two maps + one pill wrapper:

```ts
const STATUS_TONE = {
  open:        "bg-gray-100 text-gray-500",
  in_progress: "bg-amber-100 text-amber-700",
  resolved:    "bg-emerald-100 text-emerald-700",
};
const TYPE_TONE = {
  bug:         "bg-rose-100 text-rose-700",
  suggestion:  "bg-indigo-100 text-indigo-700",
};
const PILL = "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium";
```

Labels: **Open · In Progress · Resolved** and **Bug · Suggestion**.

## Table columns

1. **Checkbox** — *privileged only*; header has select-all (indeterminate when partial).
2. **Title** — bold; an unread red-dot (AE49) or a paperclip when attached (Nuri).
3. **Type** — `TYPE_TONE` pill.
4. **Submitter** — nickname if set, else full name.
5. **Status** — `STATUS_TONE` pill.
6. **Created** — formatted date.
7. **Actions** — *privileged only*; right-aligned trash icon (its cell stops click propagation).

## Interaction rules (what makes it a ticket page)

- **Whole row is the click target** → opens the Detail modal. NOT a name-link to a `/view` route.
- **All CRUD lives in modals on one page** — no `/new`, `/[id]`, or `/edit` routes.
- **No column sorting** — order is fixed newest-first from the query; you filter, not sort.
- **Status filter defaults to open** (AE49 `open`; Nuri `open` + `in_progress`), never "all".
- **Create modal** = type + title + description + optional screenshot, and supports
  **Ctrl+V paste-to-attach** with a preview + remove.
- **A privilege gate** controls the checkbox column, the per-row trash, the *editable* Detail
  form, and bulk delete. Everyone else gets a **read-only** Detail modal and no delete.
- **Bulk delete** = a sequential loop behind a confirm modal with a progress bar.

## Porting to a new project

**Keep as-is (app-agnostic):** the anatomy, the two badge maps, the modal-CRUD-on-one-page
shape, the `Ticket` data model, the whole-row-click.

**Swap per project:**
- **Brand primary** → the "New ticket" pill background + the input focus ring
  (`ae49-slate` / `nuri-terra` / your token).
- **Privilege predicate** → who may edit/delete (a department check vs a role check).
- **Compose vs inline** → lean on a shared UI kit if the project has one (AE49), or hand-roll
  the header/search/filter/table if it doesn't (Nuri).

## Don't

- **No priority field/colors** — neither app has one; adding it is net-new, not "the pattern".
- **No `/view` or `/edit` routes** — use modals.
- **Don't scatter the badge colors** — keep `STATUS_TONE` + `TYPE_TONE` together atop the page.
- **Don't make the Title a link** — the row is the click target.

## Reference

- Paste-ready skeleton, per-modal shapes, full app comparison, file index → [REFERENCE.md](REFERENCE.md).
- **AE49_Hub** — `app/(app)/support/tickets/page.tsx` (list + all modals inline), `types/ticket.ts`, `lib/services/ticketService.ts`.
- **NuriHub** — `app/(app)/support/tickets/page.tsx`, `components/support/TicketModal.tsx` + `TicketDetailModal.tsx`, `types/ticket.ts`, `lib/services/ticketService.ts`.

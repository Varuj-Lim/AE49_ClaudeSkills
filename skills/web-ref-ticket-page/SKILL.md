---
name: web-ref-ticket-page
description: >-
  The canonical support-ticket / bug-report / feedback page pattern — a header
  with a "New ticket" button, a search + status/type filter toolbar, a record
  table (Title · Type · Submitter · Status · Created · Actions), and every
  create/view/edit/delete handled in modals on one page. Distilled from two real
  Next.js + Tailwind + Firebase apps that share it. Use
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

The support-ticket page is the same page in every app: file a bug or suggestion, list
them, mark them resolved. Two real apps (**<hubname>**, **<hubname2>**) forked it from one
origin. Copy this canon instead of reinventing it; [REFERENCE.md](REFERENCE.md) has a
paste-ready skeleton + how each app did it.

## Canonical choices (this reference)

This skill describes ONE recommended ticket page — the best of both apps:

- **Default view:** Open **+** In Progress (Resolved hidden). *(from <hubname2>)*
- **Status filter:** a **multi-select checkbox menu** (tick any mix). **Type filter:** a single dropdown. *(from <hubname2>)*
- **"Clear" resets to the default view**, not to "show all". *(from <hubname2>)*
- **Reply:** the privileged Detail form has an **optional Response** field; once written it shows read-only to the submitter. *(from <hubname>)*
- **Status labels:** "Open / In Progress / Resolved" (capital **P**).
- **Toolbar count:** show "{shown} of {total} tickets".
- **Privilege gate stays generic** — a department check *or* a role check; the skill doesn't pick one.
- **No notifications** are part of this pattern (out of scope).

## Anatomy

```
┌────────────────────────────────────────────────────────────┐
│ Tickets                                    [ + New ticket ] │  header: title + subtitle + primary pill
│ Report a bug or suggest an improvement                      │
├────────────────────────────────────────────────────────────┤
│ [🔍 Search…]  [Status(2)▾]  [Type ▾]  Clear   12 of 40    │  status = checkboxes · type = dropdown · live count
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
  // Reply feature — the privileged Response back to the submitter:
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
2. **Title** — bold; optionally a small marker (an attachment paperclip, or an unread dot).
3. **Type** — `TYPE_TONE` pill.
4. **Submitter** — nickname if set, else full name.
5. **Status** — `STATUS_TONE` pill.
6. **Created** — formatted date.
7. **Actions** — *privileged only*; right-aligned trash icon (its cell stops click propagation).

## Interaction rules (what makes it a ticket page)

- **Whole row is the click target** → opens the Detail modal. NOT a name-link to a `/view` route.
- **All CRUD lives in modals on one page** — no `/new`, `/[id]`, or `/edit` routes.
- **No column sorting** — order is fixed newest-first from the query; you filter, not sort.
- **Status filter** = the shared **`FilterMultiSelect`** checkbox multi-select. Its mechanics —
  the "All" master checkbox, indeterminate-on-partial, empty-set-matches-nothing, outside-click
  close, and the `useMultiSelectFilter` hook — are specified once in
  **[`web-ref-filter-dropdown`](../web-ref-filter-dropdown/SKILL.md)**; don't re-derive them here.
  Ticket-specific choices on top: it **defaults to Open + In Progress** (Resolved hidden) via the
  hook's `defaultValues`, and needs **`z-40`** so the panel clears the table's sticky header
  (`z-20`) yet still sits below modals/toasts (`z-50`). **Type filter** = a single dropdown.
  **"Clear" resets to that default view**, not to "show all".
- **Toolbar shows a live count** — "{shown} of {total} tickets".
- **Reply loop** — the *editable* (privileged) Detail form has an **optional Response** field;
  once written it shows read-only to the submitter (needs the `response*` fields on the model).
- **Create modal** = type + title + description + optional screenshot, and supports
  **Ctrl+V paste-to-attach** with a preview + remove.
- **A privilege gate** controls the checkbox column, the per-row trash, the *editable* Detail
  form, and bulk delete. Everyone else gets a **read-only** Detail modal and no delete.
- **Bulk delete** = a sequential loop behind a confirm modal with a progress bar.

## Porting to a new project

**Keep:** the anatomy, badge maps, modal-CRUD-on-one-page, the `Ticket` model, whole-row-click.
**Swap per project:** brand primary (New-ticket pill + focus ring), the privilege predicate
(department vs role check), and compose-vs-inline (shared UI kit vs hand-rolled).

## Don't

- **No priority field/colors** — neither app has one; adding it is net-new, not "the pattern".
- **No `/view` or `/edit` routes** — use modals.
- **Don't scatter the badge colors** — keep `STATUS_TONE` + `TYPE_TONE` together atop the page.
- **Don't make the Title a link** — the row is the click target.
- **Don't wire notifications into this pattern** — out of scope for the reference.

## Reference

- Paste-ready skeleton, per-modal shapes, full app comparison, file index → [REFERENCE.md](REFERENCE.md).
- **<hubname>** — `app/(app)/support/tickets/page.tsx` (list + all modals inline), `types/ticket.ts`, `lib/services/ticketService.ts`.
- **<hubname2>** — `app/(app)/support/tickets/page.tsx`, `components/support/TicketModal.tsx` + `TicketDetailModal.tsx`, `types/ticket.ts`, `lib/services/ticketService.ts`.

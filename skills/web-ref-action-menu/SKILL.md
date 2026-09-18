---
name: web-ref-action-menu
description: The ONE action-menu (⋮ kebab) canon for every hub project (AE49_Hub, Nuri_Hub, future siblings) — the HYBRID rule for every cluster of record actions (table rows, list cards, record view-page headers, modal headers): the frequently-used decision verbs (Approve / Reject / Mark …) and the page's primary button stay VISIBLE, and EVERY other action (Edit, Delete, Reset password, Activate / Deactivate, Cancel request, Roll back, Restore, Open PDF, Download …) lives behind one always-visible ⋮ trigger — even when there is only one such action; the menu is rendered position:fixed from the trigger's rectangle (never absolute inside a table cell, which the wrapper's overflow-hidden clips), right-aligned, flipped above when it would clip the viewport, closed on outside mousedown / scroll / item click / route change; items are grouped by intent (in-place → navigation → edit/state/destructive) in escalating consequence with Delete LAST and the only red; every writing item still opens its confirm. Use whenever adding, moving, restyling or reviewing ANY row action, action column, kebab / three-dot / overflow menu, "more" button, header action cluster or modal-header action in a hub project — trigger even when the user only says "add an edit button to the table", "put delete in the menu", "the actions column is cluttered", "three dots", "more actions", or "why is this red". Each project keeps its component / hook / token file paths and its surface inventory in its own <hub>-ref-action-menu facts skill; the rule changes HERE once.
---

# Action menu (⋮) — shared canon

**Why (owner rulings 2026-08-27 → 2026-09-15):** Nuri rows carried many lifecycle
actions and used a ⋮ menu; AE49 rows showed an always-visible icon row, and on
2026-08-27 the owner ruled that a deliberate divergence (C1). On 2026-09-15, with
AE49's busiest rows showing four to five icons, the owner REVERSED C1 and chose a
**hybrid** for every hub: *"เอาปุ่มที่ใช้บ่อยออกมาด้านนอก"* — the frequent, primary actions
stay visible; everything else goes behind one ⋮. Both hubs now follow this file.

## The hybrid split — by surface

| Surface | VISIBLE at rest | IN THE ⋮ |
|---|---|---|
| Table rows · list cards | the page's **decision verbs** (Approve, Reject, Mark Done / Returned / Received, Consent, Force …), coloured at rest per the project's decision-icon set, each behind its confirm; plus the row's job-navigation verb where the page has one (Check Out, Add Time) | Edit · Delete / Remove · Reset password · Sign in as · Activate / Deactivate · Cancel (withdraw own request) · Roll back · Restore · Open PDF / report · Download / Print / Copy / Duplicate · Mark read/unread · any other secondary action |
| Record view-page header | the same decision verbs **plus the page's primary `Edit` pill** (the most-pressed button on a record page is never buried) | Cancel order · Delete · Roll back · Unlink · every other secondary action |
| Modal | the FOOTER keeps only the primary pair (Close, or Cancel + Save / the decision confirm) | secondary and destructive actions move to a ⋮ in the modal HEADER, beside the X — never into the footer |
| Bulk toolbars · sidebar · pickers · sort / fold toggles | unchanged | — (out of scope) |

- **View is dropped** wherever the row itself or its name cell already opens the
  record; otherwise "View" is the menu's navigation item — never a second eye beside a ⋮.
- **One item is enough for a ⋮** (owner 2026-09-15, overruling a "one-action floor"):
  a non-decision action is ALWAYS reached through the menu, so the eye learns one shape.
- A row whose every action is a menu item shows **only** the ⋮; a row with no actions
  keeps its dash. Decisions-only rows (Approve + Reject) get no ⋮.

## The trigger

Always visible (never hover-only — invisible on touch and unfindable on a first visit).
The project's grey icon-button rung, imported never typed; the `more` glyph (vertical ⋮,
three circles) from the project's icon registry; `title="More actions"` and
`aria-label="Open actions for <record code>"` with the id fallback so nothing announces
"undefined". The column header keeps its word (`Actions`) — not blanked, not renamed.

## The mechanism

| Detail | Rule | Why |
|---|---|---|
| positioning | `position: fixed`, coordinates from `getBoundingClientRect()` on the trigger | a table wrapper is `overflow-hidden` for its rounded corners; an `absolute` menu inside a `<td>` is clipped and no z-index saves it |
| anchor | 4px below the trigger, right-aligned: `left = rect.right − MENU_W` where `MENU_W` is the SAME constant as the menu's width class | a width changed without its offset drifts off its anchor |
| flip | measure the rendered menu in `useLayoutEffect`; if it would cross `innerHeight − 8`, place it above the trigger | the last row's menu used to clip below the viewport; before paint, so the flip is never seen |
| close | `mousedown` outside (document) · `scroll` in the capture phase · after EVERY item click (close before invoking the callback) · on route change | a fixed menu whose anchor scrolled away is an orphan |
| stacking | inline z-index above the sticky table head AND above the popup overlay | a modal-header ⋮ must clear its own card |
| state | inside the shared `<ActionMenu>` component, per trigger — never a shared `openMenuId` | the first menu closes on the mousedown that opens the second |

The menu is **not a popup**: no popup tokens, no backdrop, no "kind" rule from
`web-ref-popup` — the only relation is that a modal-header ⋮ rides in the popup's
header-actions slot.

## The contents — sections by intent, escalating consequence

Separate sections with one thin divider (`my-1 border-t border-gray-100`), in this order:

1. **In-place** — changes how the row is shown, not the record (mark read/unread, pin).
2. **Navigation** — you leave the screen or a new one opens (View, Open report, Open PDF, Download).
3. **Edit / state / destructive** — reversible state flips (Deactivate / Activate, Cancel
   request, Roll back, Restore, Unlink) → Edit → Reset password → **Delete / Remove LAST**.

- A **2-item menu gets no dividers**; a conditional section wraps its trailing divider.
- **Labels are BARE English verbs (owner 2026-09-16: "Cancel request / Edit proposal ยาวเกิน
  เหลือแค่ Cancel / Edit")** — `Edit`, `Cancel`, `Delete`, `Roll back`, `Restore`, `Reset
  password`, `Sign in as`, `Unlink LINE`, `Download`. The row already names the object, so the
  item never repeats it (`Edit proposal`, `Cancel request`, `Delete employee` are wrong); a
  noun stays only when it disambiguates two items in the SAME menu (`Unlink LINE` vs a
  second unlink) or is part of the verb (`Reset password`, `Sign in as`). The project's Thai
  explainers stay in tooltips.
- **Colour: every item plain grey; ONLY Delete / Remove / Discard is red** (data destroyed).
  A decision verb inside the menu (Cancel request, Roll back, Restore) has no tone — the
  at-rest decision colours belong to the ICON form outside the menu; the menu-item form is
  a third rendering, like the bulk pill is a second.
- **Hidden vs dimmed (owner 2026-09-15).** The line is WHO YOU ARE versus THE STATE OF
  THIS RECORD NOW. An action the viewer's role or ownership never permits (Delete is
  RD's; Cancel request is the requester's) is **not listed** — a menu never advertises
  what cannot happen for this person. An action they may take but that this record's
  state blocks right now (no LINE link to unlink, no app login to reset or sign in as,
  their own account, a row already being acted on, dependent records, the wrong status)
  stays **listed, dimmed and inert, with the reason in `title`** — so the menu keeps
  one shape per role and a dimmed row is information ("this person has no LINE").
  Dimmed = `aria-disabled` + the shared dimmed classes, never native `disabled`, so
  the reason tooltip shows in every browser. No third state.
- **Every item that writes still opens its existing confirm, unchanged** — the menu changes
  where you click, never what happens after. A withdraw / cancel-request confirm is the
  project's primary (slate) tone, roll back the warning (orange) tone, a bulk approve the
  approve (green) tone; **never the red danger tone** (red means data is destroyed).
- **The confirm repeats the item's VERB (owner 2026-09-16).** The dialog's title and its
  confirm button carry the same verb the menu item showed — `Cancel` opens "Cancel request"
  / **Cancel request** (the dialog adds the noun because it stands alone; its dismiss reads
  **Keep request**, never a second "Cancel"), `Delete` opens "Delete proposal" / **Delete**,
  `Roll back` opens "Roll back …" / **Roll back** — never a synonym (Withdraw, Remove for
  Delete, Discard for Cancel). Found on 2026-09-16: a ⋮ "Cancel request" opening "Withdraw
  proposal" with a red "Withdraw" button — wrong verb AND wrong tone. The full rule lives in
  `web-ref-popup` (confirm popups).
- Item class: `w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50` (red
  variant for destructive); menu `w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1`;
  a dimmed item is one shared spelling (`MENU_ITEM_DISABLED` + `aria-disabled`).

## One size per cluster (owner ruling 2026-09-18)

Every control that sits in ONE action cluster — a table row's Actions cell, a list card's
action group, a view-page or popup header cluster — shares ONE glyph size and ONE button
box. A job-navigation icon (AE49's Add Time clock), the ⋮ trigger and the decision discs
beside them are all drawn at the cluster's size; never a 16px icon next to a 20px one.
Owner, on the draftsman order view's Parts row (clock 16px beside ⊖ ⊗ 20px): *"ขนาดของ Icon
นาฬิกาไม่เท่ากับของกากบาทและขีด เอาให้เท่ากัน … เวลาเอาปุ่มมาวางข้างกันต้องมีขนาดเท่ากันเสมอ"*.
The cluster's size is the decision size where decisions are present (AE49: `DECISION_ICON.row`
in rows); a cluster with no decision keeps its project's management size. Pills are their
own cluster kind: a pill's leading glyph is sized by the pill, and pills beside pills share
the pill size — and that size is the DECISION pill's (the `md` rung) whenever a decision pill
sits in the cluster: a View / Edit navigation pill beside Approve / Reject is `md` too, never
the small header pill (owner 2026-09-18, the project-approvals popup: *"Icon View ขนาดไม่เท่ากับ
Approve Reject"*). The small header pill remains only for clusters with no decision pill. An audit detector flags any cluster that mixes two sizes.

## Don't

- Don't render the menu `absolute` inside a cell; don't share one open-id across rows.
- Don't hide the trigger until hover; don't blank the Actions header.
- Don't keep a lone Edit / Delete icon beside a ⋮ "because it is only one" — one item is a menu.
- Don't colour a menu item that is not a delete; don't put Delete anywhere but last.
- Don't hide a temporarily blocked action, and don't list a never-permitted one.
- Don't add Escape handling or an enter/exit animation without a ruling.

## Row ↔ view parity (owner ruling 2026-09-17)

**A record's list row and its view surface offer the SAME set of actions — always.** Whatever
a row's ⋮ (plus its inline decision icons and its job-navigation verb) can do, the record's
view page header (its decision icons + Edit pill + header ⋮) — or, for a record that opens in
a detail modal, that modal's header ⋮ + footer — can do too, and vice versa. Clicking a row to
open the record must never LOSE a verb; it is the same record with more room. The owner's words:
*"ในหน้าตาราง พอกด Row เพื่อเข้าไปใน View จะต้องมี Function เท่ากัน"* — found when
`/attendance/orders` rows offered Edit · Cancel · Restore · Delete while the order's view page
offered only the decisions, Edit and Cancel.

The only two exemptions:
- **View** itself — you are already on the view; a row's "View"/row-click has no counterpart.
- **Bulk-toolbar pills** (`Approve (n)`, `Delete (n)`, …) — they act on a selection, not one
  record; the per-record verb they aggregate must still exist on both surfaces.

The same WHO/STATE gate governs both surfaces (hide by who you are, dim by record state with
the same reason string), the same confirm opens from both, and the same service call runs —
the view surface reuses the list page's handlers or the shared service, never a second
implementation. A project's audit topic carries a parity detector: for every record type with
a list and a view, diff the two verb sets; any verb on one side only (other than the two
exemptions) is a finding.


## Pair with an audit

Each hub's project audit carries (or adds) an action-menu topic: inventory every action
cluster, check the split per surface, the trigger, the fixed-position mechanism, the
section order, the red rule and the confirm rule.

## Per-project facts live elsewhere

Component / hook / token file paths, the surface inventory, the reference pages and any
exclusion (e.g. a file mid-rewrite by another plan) belong in `<hub>-ref-action-menu`
(AE49: `ae49Hub-ref-action-menu`). A hub without one creates it from the AE49 file.

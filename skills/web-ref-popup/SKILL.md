---
name: web-ref-popup
description: The ONE popup / modal / dialog canon for every hub project (AE49_Hub, Nuri_Hub, future siblings) — every centered-overlay dialog is composed from the project's shared POPUP_* tokens (the dimmed backdrop, the rounded-2xl shadow-xl card in four widths, the title, the pill buttons rendered from the button ladder, the full-width Close, the inline error), actions sit where the KIND says (View / Edit top-right on a read-only detail popup; Cancel + confirm in a bottom row on a confirm or form popup), and the close rule follows the KIND — a read-only popup ALSO closes on click-outside, a confirm or form popup closes ONLY by its button, a MIXED component (read-only or form by a flag such as canEdit) follows the rule per mode; no Escape key, no enter/exit animation. Use whenever building, editing, restyling or reviewing ANY popup, modal, dialog, overlay, confirm box, detail popup, picker, progress or result window in a hub project — trigger even when the user only says "add a popup", "a confirm dialog", "show details in a popup", "close when I click outside", "why can't I click away", "style this dialog" or "move the popup buttons". Each project keeps only its token file path, reference implementation and consumer list in its own <hub>-ref-popup facts skill; the rule changes HERE once.
---

# Popups — shared canon

**Why one canon (AE49, 2026-08):** ~19 modal files each hand-typed the same
backdrop, card, title and button strings, so every new dialog was one paste away
from drift (a stray `rounded-xl`, a `max-w-md` where `sm` was meant, a button
missing `disabled:opacity-60`) — and click-outside was wired on some read-only
popups and forgotten on others. The tokens and the rules below are the fix. Each
hub keeps its **own token file and reference implementation** (named in that hub's
`<hub>-ref-popup` facts skill); this file holds only what must be identical.

## The pieces — token names are the canon, the file is per project

| Token | What it is |
|---|---|
| `POPUP_OVERLAY` | The dimmed, centering backdrop `<div>` (`fixed inset-0 bg-black/40 … z-50 p-4`). |
| `POPUP_CARD.sm / .md / .lg / .wide` | The white card — always `rounded-2xl shadow-xl`. Pick by width (below). |
| `POPUP_TITLE` · `POPUP_SUBTITLE` | The `<h3>` title (`text-lg font-bold`) and its one-line description. Deliberately NOT a text-scale tier. |
| `POPUP_HEADER` + `POPUP_HEADER_ACTIONS` | Header row: title left, action cluster pinned top-right. |
| `POPUP_ACTIONS_ROW` | Bottom button row (`flex gap-3`). |
| `POPUP_BTN.primary / .secondary / .danger / .warning / .approve / .approveBlocked` | The button tones — the POPUP rendering of the project's button ladder (full-width, `py-2`), composed from the ladder's tone map so a colour lives in ONE file. |
| `POPUP_CLOSE_FULL` | Full-width single Close (read-only footer). |
| `POPUP_PILL` (+ `_DANGER`) | Small pill for a header action (View eye link, Edit dates). |
| `POPUP_CLOSE_ICON` | Square X icon-button (top-right corner variant). |
| `POPUP_ERROR` | Inline error banner (red; swap the three colour words for amber / emerald). |

Text and dividers inside a popup come from the project's text / line / colour
refs (caption + body rows, hairline dividers, status pills) — never from here.

## Card width — pick by content

| Width | `max-w-*` | Use for |
|---|---|---|
| `sm` | `max-w-sm` | confirm dialogs, short read-only detail popups |
| `md` | `max-w-md` | simple add/edit forms, pickers |
| `lg` | `max-w-lg` | long forms / reports — scrolls its own body (`max-h-[90vh] overflow-y-auto`) |
| `wide` | `max-w-3xl` | broad editors (a whole-project date grid) |

## Button tone — pick by action

| Tone | Rung of the ladder | Use for |
|---|---|---|
| `primary` (slate) | 1 Primary | save, import, a safe confirm; **every decision verb** (Approve / Consent / Mark …) |
| `secondary` (outlined) | 2 Secondary | Cancel / Keep |
| `danger` (red) | 3 Destructive | delete — **red means data is destroyed**, so never on a decision or a "cancel the request" |
| `warning` (orange) | not a rung | roll back / force — the confirm-side partner of the orange decision icon |
| `approve` (green) | not a rung | the confirm behind a bulk Approve — a decision verb keeps its colour from row to dialog |
| `approveBlocked` | not a rung | the same confirm rendered inert while the page's precondition fails |

Prefix `flex-1` when two buttons share a row. A read-only popup uses
`POPUP_CLOSE_FULL` alone instead of a Cancel/confirm pair.

## Where the actions go

- **Read-only detail popup** — View / Edit ride in the top-right header
  (`POPUP_HEADER` → `POPUP_HEADER_ACTIONS`); a full-width **Close** at the bottom.
- **Confirm / form popup** — Cancel + Save / Delete / Import in a bottom
  `POPUP_ACTIONS_ROW`; the inline `POPUP_ERROR` sits DIRECTLY ABOVE that row.

## Confirm wording — the confirm repeats the opener's verb (owner ruling 2026-09-16)

A confirm popup is opened by ONE control — a ⋮ menu item, an icon button's `title`, a
text button, a bulk pill. The control shows a BARE verb (`Cancel`, `Delete`, `Edit` — the
row names the object; `web-ref-action-menu`); the popup **carries that same verb** in its
title and on its confirm button, so the person reads one verb three times: on the control,
in the title, on the button they press. The title adds the object noun because the dialog
stands alone.

| Control says | Title | Confirm button | Dismiss | Tone |
|---|---|---|---|---|
| `Cancel` (⋮ item / ⊘ icon) | Cancel request · Cancel claim · Cancel order | **Cancel request** (verb + noun — so it can never be read as the dismiss) | **Keep request** / Keep claim / Keep order | primary (slate) — nothing is destroyed |
| `Delete` / `Remove` (whichever the control says) | Delete proposal / Remove device | **Delete** / **Remove** | Cancel | danger (red) — data is destroyed |
| `Reject` (decision icon) | Reject leave request | **Reject** | Cancel | the decision's own tone |
| `Roll back` | Roll back print request | **Roll back** | Cancel | warning (orange) |
| `Approve` (bulk pill) | Approve selected requests | **Approve** | Cancel | approve (green) |

- **Never a synonym.** `Withdraw` for a control that says Cancel, `Remove` for a control
  that says Delete, `Discard` for Cancel, `Refuse` for Reject, `Release` for Consent — each
  is a defect. If the concept needs a gloss ("cancel = withdraw the request"), it goes in
  the Thai body sentence, never on the title or the button.
- **Delete vs Remove is a meaning, not a mood:** `Delete` destroys a record (an employee, a
  request, a holiday, a pile spec that exists only inside its calculation set); `Remove`
  detaches something that keeps existing elsewhere and leaves the parent intact (a device
  from a person, a login from an account, a member from a team). The test: after the act,
  does the thing still exist anywhere? Yes → Remove; no → Delete. One object keeps ONE verb
  everywhere — row icon, ⋮ item, bulk pill, dialog.
- **Titles are sentence case:** verb + lowercase noun (`Delete pile spec`, `Cancel request`,
  `Approve overtime claim`); codes and proper nouns keep their case (`Delete PJ0007`).
  Never Title Case (`Delete Calculation Set`) — one shape across every dialog.
- **A cancel-type confirm never shows two "Cancel" buttons.** Its dismiss reads
  **Keep <noun>** (the ticket precedent "Keep Ticket", 2026-09-11) and its confirm reads the
  verb with the noun (**Cancel request**). Every other confirm dismisses with the bare
  `Cancel`.
- **The tone follows the action, not the mood**: only Delete / Remove / Discard is red;
  a cancel confirm is slate even though it ends the request; ONE tone per verb family
  (no amber cancels beside slate ones).
- Found 2026-09-16 (AE49, gate ⑧): a ⋮ "Cancel request" opened "Withdraw proposal" with a
  red "Withdraw" button — wrong verb AND wrong tone; the owner's words: *"เราไม่ควรใช้คำว่า
  Withdraw นะ มันไม่ตรงกับปุ่ม ปุ่มบอก Cancel"*. Each hub's audit topic checks every confirm
  against its opener (AE49: topic 33 detector PU6).

## Close conventions — the rule follows the KIND (owner rulings 2026-08, 2026-09-15)

| Kind | Closes by button | Closes on click-outside | Why |
|---|---|---|---|
| **Read-only** detail (no inputs) | Close / X | **YES — required** | nothing can be lost; the reader expects to click away |
| **Confirm** (Cancel + decision) | Cancel or the decision | **NEVER** | an accidental click must not decide anything |
| **Form** (inputs + Save) | Cancel / Save | **NEVER** | an accidental click must not discard typing |
| **Mixed** — ONE component that renders read-only OR a form by a flag | as above, per mode | **per mode**: `onClick={canEdit ? undefined : onClose}` | the reader of a cancelled / foreign record is in read-only mode and gets the read-only behaviour (owner 2026-09-15, found on the ticket detail modals) |

Wiring: `onClick={onClose}` on the overlay (conditional for mixed), and
`onClick={(e) => e.stopPropagation()}` on the card — always, so a click inside
never bubbles out. **No Escape-key handling** anywhere and **no enter/exit
animation** — only the `transition` on hover for pills. Don't add either without
a ruling.

The audit question for every popup: *which kind is it, and is its overlay wired
the way that kind demands?* A read-only popup without click-outside and a form
popup WITH it are both defects — and a mixed component is easy to get half right.

## How to apply

```tsx
// read-only detail
<div className={POPUP_OVERLAY} onClick={onClose}>
  <div className={POPUP_CARD.sm} onClick={(e) => e.stopPropagation()}>
    <div className={POPUP_HEADER}>
      <h3 className={`${POPUP_TITLE} min-w-0`}>{title}</h3>
      <div className={POPUP_HEADER_ACTIONS}>{/* View / Edit pill */}</div>
    </div>
    {/* caption/body rows */}
    <button onClick={onClose} className={POPUP_CLOSE_FULL}>Close</button>
  </div>
</div>

// confirm / form — NO overlay onClick
<div className={POPUP_OVERLAY}>
  <div className={POPUP_CARD.sm}>
    <h3 className={`${POPUP_TITLE} mb-2`}>Delete item?</h3>
    {error && <div className={`${POPUP_ERROR} mb-3`}>{error}</div>}
    <div className={POPUP_ACTIONS_ROW}>
      <button onClick={onCancel} className={`flex-1 ${POPUP_BTN.secondary}`}>Cancel</button>
      <button onClick={onConfirm} className={`flex-1 ${POPUP_BTN.danger}`}>Delete</button>
    </div>
  </div>
</div>
```

## Don't

- Don't hand-type the overlay, card, title or button strings — import the token;
  a hub that has no token file yet creates it (the AE49 file is the model).
- Don't use the page-card class for a modal (`rounded-xl border`); modals are
  `rounded-2xl shadow-xl`.
- Don't invent a width or colour inline — reuse a variant, or add a NAMED one.
- Don't add click-outside to a confirm or form; don't forget it on a read-only
  one; don't add Escape or a slide/fade animation.
- An inline popover anchored under a field (a date-range calendar) is a
  different family — not governed by these tokens.

## Pair with an audit

This ref's rules are checkable: each hub's project audit carries (or adds) a
popup topic that classifies every overlay file by kind and checks the overlay
wiring, tokens, and the Escape/animation ban. AE49's 2026-09-15 sweep is the
first run of that check.

## Per-project facts live elsewhere

Token file path, reference implementation, model consumers, outliers, migration
status and the list of popups already wired belong in `<hub>-ref-popup`
(AE49: `ae49Hub-ref-popup`). A hub without one creates it from the AE49 file.

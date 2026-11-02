---
name: web-ref-button
description: "Canon (web-ref-*) button ladder: rungs by meaning, red only where data is destroyed, orange a caution that destroys no data, quiet text for view helpers, navigation as a link, bare label, one width, ONE line. Use for any button, pill or header action; ปุ่มแดง, ปุ่มส้ม, ปุ่มขึ้น 2 บรรทัด, ปุ่มตกบรรทัด, add a button, button wraps."
---

# web-ref-button — the cross-hub button canon

Each hub keeps its ladder's tokens, components and named tones in `<hub>-ref-button`; a rule changes here, once.

## The ladder: a button's look says what the click means

| Rung | Look | Means |
|---|---|---|
| Primary | filled pill | the ONE main action on a screen: `Add <Noun>`, Save, a confirm |
| Secondary | outlined pill | Cancel, Print, Export, Close |
| Destructive | filled red pill | the click destroys stored data |
| Icon action | gray-until-hover icon | a table row's action |
| Decision | icon colored at rest | Approve, Reject, Cancel request, Roll back |
| Quiet | bare text, no fill, no border | changes only what is on this screen: Clear filters, Select all, Clear, Expand all, Collapse all |

- **Red means the click destroys stored data,** on every rung. Two named bends stay, each a closed set a hub lists and nothing else borrows: the decision set's own colors, and sign-out text as a caution against a misclick.
- **Orange is a caution color that destroys no data.** Each hub names its own set in its ladder, as a rung or as a named tone.
- **A quiet helper that goes elsewhere is a link,** such as a page section's `View all (N)`. A page's or popup's own action may be a pill, even when it opens another page: `Add <Noun>`, a popup's View, a View / Edit pill.
- **A label is the word alone:** `Open`, `Save as`, never `Open…`. `…` appears only while busy: `Saving…`.
- **A busy label keeps one width:** both words share one grid cell, so nothing beside the button moves while it works. No width is typed.
- **The raw-constant dimming trap:** where a hub's button tokens carry no disabled style and its `Button` component adds it, moving a hand-typed button onto a bare token silently drops the dimming. Use the component, or add the disabled class at the call site.

## Rule 1 — a button label is ONE line, never two (owner 2026-10-30)

**The rule.** Every button shows its label on one line: page-header pills ("Download Excel",
"Add Fiscal Year"), form actions, popup buttons, worded decisions, text buttons, a busy label
("Saving…"). A label that would wrap is a layout bug, not an accepted look.

**How.**
- The **shared button tokens carry `whitespace-nowrap`** (the pill lead, the popup buttons, the
  quiet / text rung) — so every button built from them is one line without the call site doing
  anything. A hand-typed button class outside the tokens carries `whitespace-nowrap` itself (and
  should move onto the tokens).
- **The CONTAINER gives way, never the button.** A page header's action group is `shrink-0`
  with a `gap` from the title block, so a long subtitle wraps instead of squeezing the pills; a
  row that genuinely has no room wraps WHOLE buttons onto the next line (`flex-wrap`) — it never
  breaks a label.
- A **busy label** (a sizer that reserves the busy word's width) is one line too — the reserve
  holds one line in both states.
- Never fix a wrapping label by shortening the word or by a fixed width; fix the container.
- **Tabs count as buttons (owner 2026-10-30, CCP Q58 a).** A page / sub-tab label is one line too, and a tab
  strip with no room wraps WHOLE tabs onto a second row — never a label.

**Common practice.** Common design systems render button text with `white-space: nowrap` —
Ant Design's `.ant-btn` and Bootstrap 4's `.btn` both do — because a two-line label reads as two
controls and makes buttons in one row different heights.

**Each hub's facts** — the token file, the `Button` component, the page-header component, the
hand-typed call sites — live in its own `<hub>-ref-button` skill (CCP: `ccphub-ref-button`
`ladder.md` § "One line only").

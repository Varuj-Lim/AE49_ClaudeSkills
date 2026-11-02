---
name: web-ref-button
description: "Canon (web-ref-*) cross-hub button rule: every button label renders on ONE line, never wrapped; a crowded row gives way elsewhere (subtitle wraps, action group keeps its width, whole buttons wrap), never inside a button. Use for any button, pill or header action; ปุ่มขึ้น 2 บรรทัด, ปุ่มตกบรรทัด. Each hub's <hub>-ref-button holds tokens."
---

# web-ref-button — the cross-hub button canon

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

**Why (owner 2026-10-30).** On CCP_Hub's Finance → Profit & Loss page the header's long Thai
subtitle squeezed the action group, so "Download Excel" and "Add Fiscal Year" each broke onto two
lines; the owner ruled every button one line, at user level, so no hub repeats it (*"ผมไม่ชอบให้ปุ่ม
มันขึ้นเป็น 2 บรรทัด ทุกปุ่มต้องเป็น บรรทัดเดียวเท่านั้น … เขียนลง User Skill ด้วยจะได้ไม่พลาด"*).

**Each hub's facts** — the token file, the `Button` component, the page-header component, the
hand-typed call sites — live in its own `<hub>-ref-button` skill (CCP: `ccphub-ref-button`
`ladder.md` § "One line only").

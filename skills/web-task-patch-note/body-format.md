# Patch-note body format (`body` field)

The note's `body` is **not** plain paragraphs. Every hub's patch-notes page
renders it through its `StructuredText` component, which reads each line by
its **prefix and indentation**. Write the body to match this grammar, or
lines come out as the wrong style (a plain paragraph silently renders as a
**bold heading**, not a bullet — a real past mistake).

## Line grammar (how `StructuredText` reads each line)

The body is split on `\n`. For each line, in this order:

1. **Blank line** → a small vertical spacer. Use one blank line between sections.
2. **Line starting with `- `** (after trimming) → a **bullet** (• dot, muted
   text). This check runs *before* the heading check, so a `- ` line is
   always a bullet, at any indent depth.
3. **Any other non-blank line** → a **heading**:
   - **No indentation (level 0)** → top-level **bold** heading (the section name).
   - **Indented** → a lighter **semibold sub-heading**.

**Indentation = 4 spaces per level.** Level is `floor(leadingSpaces / 4)`.
Indentation also nudges bullets right, so bullets can nest under a sub-heading.

## Canonical structure — group by app area

Don't write a flat list of bullets with no headings. The house style groups
changes under a **section heading per app area** — the same areas as that
app's nav (each project's patch-note skill names them) — with the changes as
`- ` bullets under each and a blank line between sections.

- **Default:** heading at column 0, then flat `- ` bullets directly under it
  (bullets need no indentation; the heading already groups them).
- **Deeper (only when a section genuinely has sub-areas):** heading →
  sub-heading indented 4 spaces → bullets indented 8 spaces.

Order sections newest/most-important first (the headline feature at the top),
mirroring the title.

## Worked example (from AE49_Hub's V2.0, default style)

Section headings have **no** `-`, the changes do, blank line between:

```
Draftsman Orders
- Reserve a draftsman for a job, browse every reservation, and open a read-only detail page for each order (cancelled orders stay viewable). You can set the reservation hours and attach a hand sketch as a PDF.
- New Schedules tab: a day-by-day grid of each draftsman's booked slots, with today's row highlighted.

Notifications
- You can now delete your own notifications, one at a time or in bulk.
- Unread dots and the sidebar count now stay in sync with your full unread list.

Settings (RD only)
- New Style Guide page.
- New Data Management tool to wipe and re-initialize data.
```

## Writing it into the draft JSON

`body` is a JSON string, so encode the layout inside the string: newlines are
`\n`, a blank line between sections is `\n\n`, indentation is literal spaces
(4 per level), double quotes are escaped `\"`.

```json
"body": "Draftsman Orders\n- Reserve a draftsman for a job…\n- New Schedules tab: …\n\nNotifications\n- You can now delete your own notifications…"
```

## Quick checklist before publishing the body

- [ ] Every section name is its **own line with no `- `** (renders as a bold heading).
- [ ] Every change is a `- ` line (renders as a bullet, not a heading).
- [ ] One blank line (`\n\n`) between sections.
- [ ] Sections are the app's nav areas, headline feature first — never one
      undifferentiated list.

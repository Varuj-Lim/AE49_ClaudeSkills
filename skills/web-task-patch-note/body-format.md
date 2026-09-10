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

## Bullet style (owner ruling 2026-09-10 — "อ่าน Patch Note แล้ว Format เละ")

The grammar above fixes the SHAPE; this fixes the WRITING. It exists because
AE49's living handout had grown to 162 bullets, 92 of them over 500 characters
(the longest ~2,000): landings kept APPENDING a changelog sentence with its
design rationale instead of revising the area's description.

- **One bullet = ONE thing the user can see or do** — a change in a version
  note, a capability in the living handout. **≤ ~25 Thai words (~150
  characters).** If it needs more, it is two bullets, or a sub-heading
  (indented 4 spaces) with 2–3 short bullets under it.
- **Verb first, effect second:** เพิ่ม… / เปลี่ยน… / แก้… / ลบ… / ย้าย… then what
  the user gets, in the user's words. No design rationale ("เพราะ…"), no
  history ("เดิม… ตอนนี้…"), no programmer terms (component, state, hook,
  collection, commit, merge). Keep the app's English tab/button/field names
  verbatim so what staff read matches what they click.
- **Bug fixes** go under a `    แก้ไข` sub-heading inside the area's section
  (indented 4 spaces, bullets indented 8), one bullet each, and only when a
  user could have noticed the bug.
- **Per area per note: ≤ ~6 bullets**, headline area first (already the rule).
- **The living handout is REVISED, never appended — where a project keeps one.**
  Each project names its own handout file, and a project may keep NONE: AE49
  deleted `docs/launch-patch-note.md` on 2026-09-10 (the owner had stopped using
  it, and no app code ever read it), so this bullet simply does not apply there.
  Where a handout does exist it describes what the app DOES today in 3–6 bullets
  per area, and a landing rewrites or merges that area's bullets in place. Either
  way the version note's changelog is built from `git log` at publish time (Flow),
  never read off a handout.
- **Before publishing, audit the body against these rules:** any bullet over
  ~150 characters, any "เดิม…", any programmer term is a finding to fix first.

---
name: ae49-task-compare-conventions
description: >-
  Compare two convention sets (two projects' skills/patterns/launchers, two
  implementations of the same concept) and walk every conflict to an owner
  ruling, one item at a time, using the five-part item format that worked in
  the 2026-08-27 AE49-vs-Nuri session. Use when the user wants two things made
  consistent, asks "เปรียบเทียบ / เทียบกับอีกโปรเจกต์ / ให้มัน consistent กัน",
  asks which of two conflicting rules should win, or after a comparison scan
  produced a list of opposite rulings that now need decisions. Covers the whole
  arc: fan-out scan → findings with IDs → per-item ruling walk (a/b/c options
  incl. deliberate divergence) → recording rulings and spawning the alignment
  work. Trigger even when the user only says "ไล่เคาะทีละข้อ", "grill C1-C8",
  or quotes a finding ID from a comparison report.
---

# Compare conventions → owner rulings

The job has three phases. The heart is Phase 2's item format — preserve it
exactly; it is what makes the walk land.

## Phase 1 — Scan (delegate, don't read inline)

Fan out a read-only agent (or several) over both sides. Demand:

- **Pairing by concept, not by name** — same-name pairs, different-name pairs
  (verify each candidate by reading), only-in-A, only-in-B, meta/structural
  drift. A concept can hide under 2 skills on one side and 1 on the other.
- **file:line evidence for every conflicting rule** — a conflict without a
  quotable line is an impression, not a finding.
- **Separate EXPECTED divergence from real conflict** — ports, brand colors,
  domain vocabulary differ by design; process/behavior rules that disagree are
  the findings.

Report per `ae49-ref-report-format`; give every conflict an ID (C1, C2, …) —
the walk, the rulings table, and later sessions all reference these. Save the
full scan to `docs/` when the user asks or the list is long.

## Phase 2 — The ruling walk (one item per message)

Per `ae49-task-grill` discipline: one question at a time, recommendation
first, wait for the ruling, record it before moving on. Announce the standard
options ONCE up front:

- **(a)/(b) one side wins** — the loser changes docs AND real code everywhere.
- **(c) deliberate divergence** — both keep their behavior, and BOTH sides'
  skills get a written cross-note: "intentional, because X — never 'fix' one
  app to match the other". Frame honestly: (c) still counts as consistency —
  what it removes is *accidental* drift, and it costs no code.

Each item then gets the **five-part format** (numbered `Cn/total` so the user
sees the path):

1. **"A ทำแบบนี้ / B ทำแบบนี้"** — concrete and visual. Show a tiny ASCII
   mock, real class string, or 3-line snippet of what a user/reader actually
   sees on each side. Never only adjectives ("cleaner", "simpler").
2. **ทำไมต่างกัน** — dig for the reason each side evolved its way. Most
   conflicts are not accidents: one side grew from its domain (many actions →
   menu; few decisions → icon row). Naming the real cause is what lets the
   owner choose confidently — and exposes which conflicts ARE just drift.
3. **ราคาถ้าจะบังคับให้เหมือน** — who pays, blast radius in files/pages, and
   the nature of the gain: behavior-correctness vs pure cosmetics. Say when a
   sweep can be **as-touched** (rule applies to new/edited code now, old code
   converts when next opened) vs must be one big sweep.
4. **คำแนะนำ + เหตุผล** — take a position, marked (Recommended). Crucially,
   classify the conflict first:
   - **Objective** (one side prevents real bugs: dead `router.back()` on a
     fresh tab, Thai baseline off-center in `inline-block`, browser bubble in
     the wrong language) → recommend that side wins, say the bug out loud.
   - **Taste/brand** (typography weights, icon-vs-menu) → recommend (c) and
     say why forcing it buys nothing.
   The user may overrule — record their choice, never re-litigate.
5. **Ask** — `AskUserQuestion`, options a/b/c with one-line consequences.
   When an item has separable layers (mechanics vs policy vs presentation),
   offer **layered rulings** — e.g. "A wins mechanics, gates stay
   per-project" — instead of forcing all-or-nothing.

After each answer: one line "บันทึก Cn = <ruling> ✅" + the immediate
consequence, then the next item. Explanations in Thai for the owner; labels,
IDs, tables, code in English.

## Phase 3 — Close out (same session, before anything else)

Rulings that live only in chat are lost. Immediately:

1. **Rulings table** appended to the comparison doc — ID, concept, ruling,
   consequence (one row each).
2. **Divergence notes** for every (c): a short "Cross-project note (owner
   ruling <date>, Cn)" block in BOTH sides' skills — state the shared kernel
   both obey, the reason each side differs, and "never unify".
3. **Memory fact** (shared/ for git-synced projects) pointing at the doc —
   future sessions must build to the ruled side.
4. **Spawn the work**: code consequences become plans per the project's
   normal flow (footprints + `After:` edges — alignment sweeps collide with
   everything, so expect them to chain late); the other repo's share becomes
   a ready-to-paste handoff prompt for a session there.

## Don'ts

- Don't walk items the scan couldn't evidence with file:line.
- Don't present (a)/(b) without the price tag — cost changes rulings.
- Don't batch multiple conflicts into one question, and don't continue past
  an unanswered item.
- Don't skip Phase 3 because the session ran long — unrecorded rulings
  guarantee re-drift.

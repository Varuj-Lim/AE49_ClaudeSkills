---
name: ae49-ref-report-format
description: The one shared format for any findings / review / audit / status report the model writes for the user — plain English, emoji-tagged severity tiers, a per-finding ID so the user can reference one back, concise labelled finding lines, and an emoji verdict. Use whenever producing a review, scrutiny, audit, findings list, or status report to the user, or when another skill says "format the report per ae49-ref-report-format". The report skills (ae49-task-scrutinize, ae49-task-audit-lib, ae49Hub-task-audit-project) point here instead of each redefining the format. Trigger this even when the request only says "review this", "audit that", "what's wrong with", or "give me findings" — using this one format (never an ad-hoc per-skill layout) is required for every report.
---

# Report format

The single source for how we format a findings / review / audit / status **report to the
user**, so every report reads the same, scans fast, and is easy to reference. Other report
skills point here instead of redefining the format.

## 1. Plain English

Write so a non-programmer can follow it — explain the *why* and the consequence in everyday
words; swap programmer terms for plain ones (or explain them on first use). **Exception:** file
paths, `file:line` citations, code snippets, and exact error text stay verbatim — never reword.

## 2. Emoji-tag every section

Tag each section / severity / field with a small, consistent emoji so the eye can jump to it —
one emoji per thing, used the same way every run, no decorative sprinkling. Emoji are welcome
even when the report is headed to an external channel (JIRA / Slack / email): they aid scanning,
so don't drop them for formality.

## 3. ID every finding (so the user can reference it back)

Order findings by severity and give each a short **ID** = a per-group prefix + a counter from 1.
Lead each finding with **emoji + ID + a short title** — e.g. `🔴 MJ1 — books the past`. The user
then refers to findings by ID ("fix MJ1 and MN2").

**Standard set** (review / bug / scrutiny reports):

- 🚫 **Blocker** → `B1`, `B2`, … — must be fixed before this can ship.
- 🔴 **Major** → `MJ1`, `MJ2`, … — a real bug or risk; fix it.
- 🟡 **Minor** → `MN1`, `MN2`, … — worth fixing, not urgent.
- ⚪ **Nit** → `N1`, `N2`, … — polish / optional.

A skill whose findings group differently (an audit's own tiers, HIGH / LOW, etc.) keeps its own
labels but **still gives every finding a short ID** so it stays referenceable.

## 4. Finding body

Under each finding, a few short labelled lines. Default set for a review (skills may swap the
fields to fit their domain):

- 🔍 **Finding** — one plain sentence, specific. Cite `file:line` when applicable.
- 💥 **Why it matters** — the real-world consequence, not the principle.
- 🧾 **Evidence** — the trace step, input, or location that exposes it.
- 🔧 **Fix** — the concrete, minimal change.

## 5. Verdict / bottom line

Close with one line. When there's a ship decision, tag it:

- ✅ **Ship** · 🩹 **Fix-then-ship** · 🔨 **Rework** · ❌ **Reject**

— with the single biggest reason, in plain English. A report without a ship decision (e.g. a
reuse or pattern audit) ends with a one-line bottom-line summary instead.

## For skill authors

A skill that produces a report points its **Report** / **Output** section here rather than
copying this format, then adds only its own specifics (its severity/tier labels and its field
names). See [ae49-task-write-a-skill](../ae49-task-write-a-skill/SKILL.md).

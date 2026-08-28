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

**Caveman mode NEVER applies to a report (user rule, 2026-08-04).** Even when the session runs
in caveman/compressed mode, every report to the user — audits, reviews, findings, status —
is written in full, complete sentences: each finding says what the thing is, why it is safe or
unsafe, and what happens if it is removed/fixed versus left alone. Comprehension beats token
savings in reports; the user must never have to guess what a compressed fragment meant.

## 1b. Multi-track status boards are TABLES (user rule, 2026-08-05)

Whenever a report covers the state of **multiple parallel items** — in-flight builds, plans,
agents, features, gates, tickets — render them as a **markdown table**, one row per item,
never a bullet/numbered list. Prose stays for the surrounding explanation; the board itself is
the table. One or two items may stay inline in a sentence — three or more always get the table.

### The template (user-confirmed 2026-08-06 — copy this shape)

```markdown
| Item | Stage | Waiting on | Next |
|---|---|---|---|
| overtime-exact-minutes | 🔍 Audit running | Auditors | Fixes → stage → gate |
| attendance-import-review-screen | 🔍 Audit running | Auditor | Fixes → stage → gate |
| profile-attendance-report | 📋 Ready | Exact-minutes landing | Build (chain tail) |
| Unpushed on `main` | 📦 17 items | Your "push" | One push deploys all |
```

Which renders as:

| Item | Stage | Waiting on | Next |
|---|---|---|---|
| overtime-exact-minutes | 🔍 Audit running | Auditors | Fixes → stage → gate |
| attendance-import-review-screen | 🔍 Audit running | Auditor | Fixes → stage → gate |
| profile-attendance-report | 📋 Ready | Exact-minutes landing | Build (chain tail) |
| Unpushed on `main` | 📦 17 items | Your "push" | One push deploys all |

### What each column is for

| Column | Holds | Rule |
|---|---|---|
| **Item** | The plan slug, feature or standing concern — the name the user already uses for it | Never a sentence. Standing concerns (unpushed commits, a pending deploy) get a row too. |
| **Stage** | Emoji + two or three words | One emoji, from the legend below. Not a percentage, not a guess at time remaining. |
| **Waiting on** | **WHO or WHAT unblocks it** | The most important column — it tells the user whether the ball is theirs. Say "Your gate" / "Your push" plainly when it is. |
| **Next** | The single next action once unblocked | An arrow chain (`Fixes → stage → gate`) is fine. Not a list of everything left. |

### Stage emoji legend — same emoji, same meaning, every run

📝 planning · 📋 plan ready · 🔨 building · 🔍 audit running · 🔧 fixing findings ·
📦 staged / pending · 🧪 the user's manual gate · ✅ landed · 🚀 deployed · ⏸️ blocked

### Rules that keep the board honest

- **One row per item, always the same columns.** Adapt column *names* only if the domain
  genuinely differs (tickets, deploys); never drop "Waiting on".
- **Never invent progress.** A background agent's result is unknown until its notification
  arrives — write "🔍 Audit running", never a predicted verdict or a percentage.
- **The user's own rows go last** (their gate, their push) so the ask is the final thing read.
- **Put the table at the END of the message**, after the prose that explains it. The reader
  wants the reasoning first and the board as the summary they scroll back to.
- A one-line takeaway may follow the table when something needs emphasis (e.g. what a push
  would deploy) — but the table is never *replaced* by that line.
- **Close with the 👤 "your move" line — REQUIRED, never omitted (user rule, 2026-08-28).**
  The very last line of the message answers the question the reader actually has: *is anything
  waiting on me?* It restates, as concrete actions, every row whose *Waiting on* points at the
  user — and when no row does, it says that outright and names what is being waited on instead,
  so silence is never mistaken for "nothing to do". Rules:
  - One or two lines, in the conversation's language (the table itself stays English).
  - Concrete verbs the user can act on ("test the 7 gate items, then say ผ่านหมด"), never a
    restatement of a Stage ("gate is open").
  - It comes AFTER the table and after any takeaway line — nothing follows it.
  - Never dropped on the grounds that the *Waiting on* column already says it: a reader
    scanning a ten-row board must not have to re-read a column to learn the ball is theirs.

  ```markdown
  👤 **รอคุณ:** เทส gate 7 ข้อบนหน้า checklist แล้วบอก "ผ่านหมด" · สั่ง "push" เมื่อพร้อม deploy
  ```

  ```markdown
  👤 **ไม่มีอะไรรอคุณตอนนี้** — รอ builder เสร็จ แล้วผมจะรายงานพร้อม gate ต่อไป
  ```

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

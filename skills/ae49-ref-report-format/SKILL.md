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

### When to send a board — four moments only (owner Q84 a, 2026-10-21)

A message with the status board goes to the owner ONLY at:
1. **Something waits on the owner** — a question, a button to press, a command to run, a gate to test.
2. **A landing or a plan closed** — work landed on the deploy branch, a plan moved to `done/`, a push done.
3. **A problem** — a gate item FAILED, an audit found a BLOCKER / MAJOR, a build or a production step failed.
4. **The owner asked** — `status:`, "รายงานหน่อย", any question about progress.

Everything else — a build finished, an audit passed, a fold sent, a re-audit dispatched, a harness green —
is written to the log (and the register when it is an item) and gets NO chat message. A quiet stretch of
20–40 minutes while agents work is expected. Why: on 2026-10-21, after the owner asked where the report had
gone, Main sent a full board with every agent notification — about ten boards in one morning, most of them
the same — and the owner asked whether a frequency rule existed (*"การเขียนรายงานของคุณตอนนี้มันถี่มาก"*).
In autopilot `decide` mode the stricter rule stands: no reports at all until the owner asks.

**This rule sets HOW OFTEN, never HOW MUCH (owner 2026-10-21, the same morning: *"อย่าตัดให้สั้นลง กำหนดแค่
ความถี่พอแล้ว พอสั้นลงผมจะหาไม่เจอ"*).** Every board that IS sent carries every open row — each plan / batch
in flight AND every row of the open-items register (`ae49-router` status lane), the unpushed commits, the
items waiting on the owner — never trimmed to "what changed" to save space. The owner looks for an item on
the board; a row dropped for brevity reads as a row that vanished (it happened with OI-145 the same day).

### The template (owner ruling 2026-09-16 — copy this shape; five columns, the 2026-08-06 set plus a row number)

```markdown
| # | Feature / plan / task | Stage | Waiting On | Next |
|---|---|---|---|---|
| 1 | plot-order-se-compose | 🚀 Live — `fb96ec0a`, V6.0 published | — | — |
| 2 | rd-footing-help-legend-and-widths | 🧪 Gate ⑫ | Your check of items 3–7 | land → plan → done/ |
| 3 | thai-sweep-plot-and-strays | 🔨 Building | Builder | audit → gate → land |
| 4 | action-menu-hybrid B1 | ⏳ Queued | #3 landing | dispatch |
| 5 | Unpushed on `main` | 📦 2 commits (on backup) | Your "push" | one push deploys both |
```

Which renders as:

| # | Feature / plan / task | Stage | Waiting On | Next |
|---|---|---|---|---|
| 1 | plot-order-se-compose | 🚀 Live — `fb96ec0a`, V6.0 published | — | — |
| 2 | rd-footing-help-legend-and-widths | 🧪 Gate ⑫ | Your check of items 3–7 | land → plan → done/ |
| 3 | thai-sweep-plot-and-strays | 🔨 Building | Builder | audit → gate → land |
| 4 | action-menu-hybrid B1 | ⏳ Queued | #3 landing | dispatch |
| 5 | Unpushed on `main` | 📦 2 commits (on backup) | Your "push" | one push deploys both |

### What each column is for

| Column | Holds | Rule |
|---|---|---|
| **#** | Row number, 1… in the order shown | So the user can answer "ข้อ 3" without retyping the slug; renumber every run — never carry old numbers. |
| **Feature / plan / task** | The plan slug, feature or standing concern — the name the user already uses for it | Never a sentence. Standing concerns (unpushed commits, a pending deploy, a handoff) get a row too. |
| **Stage** | Emoji + two or three words | One emoji, from the legend below. Not a percentage, not a guess at time remaining. |
| **Waiting On** | **WHO or WHAT unblocks it** | The most important column — it tells the user whether the ball is theirs. Say "Your gate" / "Your push" / "Your check" plainly when it is; name the agent otherwise. **When the blocker is another feature / plan / task, write its ROW NUMBER on this board — `#3 landing` — never its name** (rule below). |
| **Next** | The single next action once unblocked | An arrow chain (`audit → gate → land`) is fine. Not a list of everything left. |

### Stage emoji legend — same emoji, same meaning, every run

📝 planning · 📋 plan ready · 🔨 building · 🔍 audit running · 🔧 fixing findings ·
📦 staged / pending · 🧪 the user's manual gate · ✅ landed · 🚀 deployed · ⏸️ blocked

### Rules that keep the board honest

- **One row per item, always the same columns.** Adapt column *names* only if the domain
  genuinely differs (tickets, deploys); never drop "Waiting on".
- **A blocker that is another item is written as its row number: `#N <event>`** (owner ruling
  2026-09-23). When a row waits on another feature, plan or task — a plan in its `After:` chain,
  a batch that shares its files, a gate that must land first — its *Waiting On* cell reads `#N`
  plus the event that frees it (`#2 landing`, `#4 gate`, `#1 push`), where `#N` is THAT item's
  row on THIS board. Never the item's slug or a prose description (not "row-count B3 landing
  (shares Overtime page)"): the `#` column exists so the reader can jump to the blocker and see
  its own state and its own *Waiting On* in one glance, which a name does not give. Consequences:
  - **The blocker must have its own row.** If it is not on the board, add it — a row that points
    at something the board does not show is a dead end.
  - **Several blockers → several numbers**: `#2 + #5 landing`.
  - **The WHY goes in *Next* or the prose, never in *Waiting On*** — "shares the Overtime page" is
    a reason; the cell stays a pointer.
  - Row numbers are renumbered every run (the `#` rule above), so every `#N` is re-derived from
    the board being written — never copied from an earlier board.
- **Never invent progress.** A background agent's result is unknown until its notification
  arrives — write "🔍 Audit running", never a predicted verdict or a percentage.
- **Row order — four groups, always in this order (owner ruling 2026-10-21):**
  1. 🔨🔍🧪🔧 **In progress** — builder, audit, fold, Main-run gate — in chain order (a row before the rows it unblocks).
  2. ✅ **Done today** — landed / committed / closed / live since the day began (Thai calendar day); older ones drop off.
  3. ⏸️📋📝📦 **Waiting on something other than the owner** — a token reset, another row's landing (`#N landing`), a plan being written, a parked or registered item to do later.
  4. 👤 **Waiting on the owner** — a question, a button, a command, a push, a Billing read, the owner's gate — LAST, so the ask is the final thing read before the 👤 line.
  **A register row that no one is moving waits on the OWNER, never on "—" (owner 2026-10-21):** an item Main found
  and registered (an audit leftover, a gate observation) that is not in the owner's ordered scope is waiting for the
  owner's go-ahead — its *Waiting On* reads `Your go-ahead (Q<n>)`, it sits in group 4, and the question that asks for
  the go-ahead is put in the same message. "⏸️ Registered · —" hides that the ball is the owner's.
  Within a group, most urgent first. Why: on 2026-10-21 a twelve-row board mixed the four kinds and the owner could not find what was running, what was done and what was theirs (*"งานที่กำลังทำอยู่ด้านบน … งานที่รอผม…"*; the owner chose this order over Main's done-at-the-bottom proposal).
- **Put the table at the END of the message**, after the prose that explains it. The reader
  wants the reasoning first and the board as the summary they scroll back to.
- **A cross-session handoff prompt is never a row** (owner rule 2026-09-11,
  `web-task-handoff-prompt`). Once the block is pasted in chat it belongs to the
  destination session: no "handoff delivered" row, no follow-up line, no mention in the
  👤 line, and no asking later whether the sibling has done it.
- A one-line takeaway may follow the table when something needs emphasis (e.g. what a push
  would deploy) — but the table is never *replaced* by that line.
- **The ⏱️ ETA line — on every message that carries the status board (owner Q42 a,
  2026-10-20).** One line right after the table (and any takeaway), right ABOVE the 👤 line:
  ONE finish window for ALL the work that does NOT wait on the owner — a summary, never a list of
  items or per-item times (owner 2026-10-20: *"แก้เป็นแบบสรุปเลย ว่าจบประมาณกี่โมง ไม่ต้องแยกรายการ"*) — e.g.
  `⏱️ งานทั้งหมดที่ไม่รอคุณจะจบราว 14:30–15:40 น. (ไม่นับช่วงที่รอคุณ)`, or with the date when it rolls
  over: `⏱️ … จบราวพรุ่งนี้ (21 ต.ค.) 12:00–16:00 น.`. Computed with
  `ae49-task-estimate-eta`'s baselines and chain rules from the board being written (no
  re-run of its scripts each time — run `open-batches.cjs` only when the set of plans changed),
  from the clock (`date`), rounded to 5 min; "น่าจะข้ามไปพรุ่งนี้" past 18:00 ICT; when every
  row waits on the owner it says so (`⏱️ ทุกงานรอคุณ — เริ่มนับเมื่อ …`). It is a forecast, never
  progress. Not on messages without a board. The full breakdown stays `/ae49-task-estimate-eta`.
  Why: the owner wanted "เสร็จกี่โมง" on every status without asking, at ~2–3 % more tokens a day
  instead of the 10–20 % a full ETA per report would cost.
  **With it, the ⚡ "faster" line (owner 2026-10-20, the same day: *"ช่วยเพิ่มด้วยว่าสามารถทำให้เร็วขึ้นได้
  ด้วยอะไรในรายงานด้วยนะ"*)** — right under ⏱️: the one or two biggest ways to finish sooner, from
  `ae49-task-estimate-eta` §"Ways to finish sooner" (an owner step that unblocks a chain, a chain
  that could run in parallel, a batch that could split), each as `what to do · minutes saved`,
  e.g. `⚡ เร่งได้: ตอบ Q34–Q41 ตอนนี้ (−30–60 นาที) · ทำ Cloud Shell setup ระหว่าง B1 build (−30–60 นาที)`.
  Offers only — Main never acts on them without the owner. None found → `⚡ ไม่มีทางเร่งตอนนี้`.
- **Close with the 👤 "your move" line — REQUIRED, never omitted (user rule, 2026-08-28).**
  The very last line of the message answers the question the reader actually has: *is anything
  waiting on me?* It restates, as concrete actions, every row whose *Waiting on* points at the
  user — and when no row does, it says that outright and names what is being waited on instead,
  so silence is never mistaken for "nothing to do". Rules:
  - One or two lines, in the conversation's language (the table itself stays English).
  - Concrete verbs the user can act on ("test the 7 gate items, then say ผ่านหมด"), never a
    restatement of a Stage ("gate is open").
  - **Today only (owner 2026-10-21):** it names only what the owner can do TODAY (the Thai calendar day). A
    step that cannot happen until a later day — tomorrow's Billing read, a check after a reset — stays as its
    row on the board and is NOT mentioned in the 👤 line. Nothing for today → "ไม่มีอะไรรอคุณวันนี้".
  - It comes AFTER the table and after any takeaway line — nothing follows it except the
    🤖 autopilot line below.
  - Never dropped on the grounds that the *Waiting on* column already says it: a reader
    scanning a ten-row board must not have to re-read a column to learn the ball is theirs.

  ```markdown
  👤 **รอคุณ:** เทส gate 7 ข้อบนหน้า checklist แล้วบอก "ผ่านหมด" · สั่ง "push" เมื่อพร้อม deploy
  ```

  ```markdown
  👤 **ไม่มีอะไรรอคุณตอนนี้** — รอ builder เสร็จ แล้วผมจะรายงานพร้อม gate ต่อไป
  ```

- **Then the 🤖 autopilot line — on EVERY message to the owner, ON or OFF (owner ruling
  2026-10-07).** In an ae49-workflow project the very last line is the mode's state, read
  from `~/.claude/autopilot/<project-folder>/state.json` (no file = Off):
  `🤖 Autopilot mode: On (ask)` · `🤖 Autopilot mode: On (decide)` · `🤖 Autopilot mode: Off`.
  It is a status line, never a board row — the Autopilot state is NOT a table row on any
  board, the open-day board included (this line replaced the open-day row of owner Q11 a the
  same day). Why: the owner had to ask "did you go into autopilot?"; a fixed last line answers
  that at a glance without putting a no-action row on the board they scan for their own moves.
  It follows the 👤 line because the ask is still the last thing to READ; the 🤖 line is only
  glanced at.

  ```markdown
  👤 **รอคุณ:** ตอบ Q14 ด้วย a / b / c
  🤖 Autopilot mode: On (ask)
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

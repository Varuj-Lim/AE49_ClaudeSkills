---
name: ae49-task-estimate-eta
description: Estimates how long each piece of work still open in an ae49-workflow project (AE49_Hub, Nuri_Hub, siblings) will take and the clock time (ICT) everything should be finished — from the plan board, the open-items register and the running agents, using MEASURED stage durations (build, audit, fold, Main gate, landing) instead of guesses, honouring the chain order. DEFAULT mode `short`: no table — the finish time, what it excludes, the biggest risk and the ways to finish sooner, in a few Thai lines; mode `full` ("full", "ขอตาราง", "แบบละเอียด") adds the per-item English table. Use when the owner asks "อีกนานไหม", "เสร็จกี่โมง", "งานทั้งหมดจะเสร็จเมื่อไหร่", "ประเมินเวลา", "ETA", "how long will this take", "when will everything be done", or invokes /ae49-task-estimate-eta.
---

# Estimate ETA — how long each open item takes, and when it all finishes

**Owner request 2026-10-15** (*"Skill เพื่อประเมินว่างานที่มีอยู่ตอนนี้แต่ละงานใช้เวลาประมาณเท่าไหร่ แล้วทั้งหมดจะเสร็จ
ประมาณกี่โมง พร้อมเขียน Report ในรูปแบบตารางบอกด้วย"*), after Main answered "อีกนานไหม" by hand from memory. An
estimate is a FORECAST, never progress: it never claims an agent is n % done (`ae49-ref-report-format` — never
invent progress). It says how it was computed so the owner can judge it.

## Workflow

1. **Read the clock** — `date` (Bash; already ICT on the owner's machines). Never a stamp carried from earlier.
2. **Collect the open items, from files** — the batches left come from the SCRIPT, never from a hand grep or the
   plan's `Status:` line: `node ~/.claude/skills/ae49-task-estimate-eta/resources/open-batches.cjs` (project root).
   It lists every batch of every open plan as `LANDED` (a landing note, case-insensitive, with its sha), `OPEN`, or
   `CHECK` (a code commit names the batch but no landing note does — read the plan and the commit before choosing;
   a batch can ship in parts), and flags `STALE STATUS` (every batch landed, `Status:` not flipped) — such a plan is
   CLOSED with `archive-plan.cjs`, never estimated. Then add every row of `docs/plans/_open-items.md`, the agents
   running now (`ListAgents` — name, kind, minutes running), and the unpushed commits. One row per batch that still
   has work; never merge items (`ae49-router` status rule). **Why the script (owner 2026-10-16, "มันไม่ควรมีปัญหา"):**
   an ETA listed `unsaved-leave-popup` B2–B8 as "not started" two days after all seven landed — the plan's `Status:`
   was never flipped after B9, and Main grepped the landing notes for `LANDED` in capitals while they said
   `landed`. The owner then put the "missing" work in scope and there was nothing to build.
3. **Place each item on its chain** — `After:` edges and shared files (`ae49-router` chain graph). Items on one
   chain run one after another; independent chains run in parallel (no cap on agents unless the owner set one).
   Two plans that share ONLY a strings / constants file in different sections are NOT a chain (`ae49-router`
   chain graph rule 4, owner 2026-10-16) — run them in parallel and add +5–15 min merge to the second landing.
4. **Cost the remaining stages** with the baselines below — a LOW–HIGH range per stage, summed per item. An
   agent already running costs `max(0, baseline − minutes so far)`, floored at the low end of the next stage.
5. **Owner-bound waits are NOT time** — an item waiting on the owner's answer, hands or push gets the stage
   `⏸️ Waits on you` and its finish reads `after your answer + X–Y min`; it is left out of the overall window,
   which then says so.
6. **Compute finish clock times** — per chain, start = now; add each item's range in order; the overall window
   is the latest chain's LOW–HIGH. Round to 5 minutes. Past 18:00 ICT say the day is likely to roll over.
7. **Report** in the chosen MODE (below; `short` unless the owner asked for `full`), then log one line in the autopilot
   log if the autopilot mode is ON. Steps 1–6 run the same in both modes — `short` changes only what is SHOWN.
8. **Recalibrate** — when today's measured times (agent `duration_ms` in task notifications, log timestamps)
   differ from the baselines by more than ~50 % for a stage, update the table in this file (and mirror it to the
   skills repo per `~/.claude/CLAUDE.md`) with the date.

## Baselines (measured, AE49_Hub 2026-10-15; minutes)

| Stage | Low | High | Notes |
|---|---|---|---|
| Plan — Main one-pager | 5 | 10 | small change |
| Plan — `ae49-plan` agent (+ rewrite after rulings) | 5 | 12 | each rewrite again 4–6 |
| Build — `ae49-implement`, small (≤ 5 files) | 8 | 16 | today 8 / 8 / 12 / 16 |
| Build — UI measuring or shared component | 20 | 40 | CQ7 35 |
| Build — `ae49-implement-heavy` (engine, file format, data shape) | 30 | 100 | B3 rework 97 · matrix B1 28 · matrix B2 52 (recalibrated 2026-10-15) |
| Fold after an audit (builder resumed or Main inline) | 3 | 8 | |
| Audit — SHORT | 4 | 15 | 10-15: 4–9 · 10-16: 3, 7, 11, 14, 15 — a re-audit of a refit or a heavy fold runs long (recalibrated 2026-10-16) |
| Audit — FULL | 10 | 20 | today 10–19 |
| Main gate — logic / script items | 5 | 10 | |
| Main gate — screens in the pane | 10 | 25 | |
| Main gate — headless Chrome (real paste, sign-out, throttling) | 20 | 35 | first set-up in a session +10 |
| Main gate — delegated to `ae49-gate` agents (parallel, one port each) | 20 | 35 | per section, all at once; +5–10 agent start-up; Main reads evidence 3–5 (2026-10-16) |
| Landing (commit, close gate, plan → done, backup, worktree cleanup) | 3 | 6 | |
| Merge onto a moved `main` with a known conflict | 5 | 15 | |

Typical totals: a SMALL item = build + SHORT audit + fold + SHORT re-audit + gate + landing ≈ 35–65 min; a FULL
item ≈ 50–90 min; a HEAVY item ≈ 2–3 h. Add ONE fold + re-audit per expected audit round (most builds need 1–2).

## Risks that move the window

Name the ones that apply, in plain Thai: an audit that finds a MAJOR (one more fold + re-audit, +15–30), the 3-round
audit budget being hit (owner decides — the item stops), an owner question raised by a builder or audit, a
merge onto a `main` that moved, a gate item only the owner can check (Excel, LINE, a real download), the
machine or the emulator not running.

## Ways to finish sooner (owner ETA1 a, 2026-10-15)

Every report also looks for time the queue is wasting and OFFERS it — never acts on it (the owner rules on the
order; `ae49-router` start-now rule). Check, in this order:

- **Chained only by a small file overlap** — two items queued one after the other because they share a file in
  DIFFERENT sections (e.g. both add strings to `labels.ts`). Offer to run them in parallel: minutes saved (the
  shorter item's whole range) vs. the merge cost (+5–15 per shared file, Main resolves it).
- **An idle owner step** — a push, a deploy or an answer that would unblock a long chain. Name it and the minutes
  it frees.
- **A batch that could split** — a heavy batch whose part B does not need part A's code. Offer the split only when
  the plan's file footprint shows it.

Each offer is one Thai line under the risks: what to change, minutes saved, what it costs. None found → say so.

## Modes (owner 2026-10-16: *"เพิ่ม mode … รายงานแบบสั้น โดยเอาตารางออกทั้งหมด และให้โหมดนี้เป็นโหมด Default … ส่วนใหญ่อยากรู้แค่ว่าจะเสร็จกี่โมง ทำยังไงถึงจะเร็วขึ้นได้บ้าง"*)

| Mode | How it is asked | What is shown |
|---|---|---|
| `short` — **DEFAULT** | `/ae49-task-estimate-eta`, "อีกนานไหม", "เสร็จกี่โมง" | the Short report below — NO table of any kind |
| `full` | `/ae49-task-estimate-eta full`, "ขอตาราง", "แบบละเอียด", "ทีละงาน" | the Full report below — prose + the per-item table |

The owner's ruling overrides `ae49-ref-report-format` §1b ("three or more items always get a table") FOR THIS SKILL'S
`short` mode only. The math is identical in both modes, so a `full` asked a minute later shows the same window.

### Short report (default)

Thai, no table, no per-item list, in this order:

1. **One sentence: the finish window** — "งานที่ไม่ต้องรอคุณจะเสร็จราว HH:MM–HH:MM น." (+ "น่าจะข้ามไปพรุ่งนี้" past 18:00),
   and what it EXCLUDES in the same or the next sentence (owner waits, items with no plan, owner-PC steps).
2. **One line: the biggest risk** that could move it, in plain words.
3. **Ways to finish sooner** — the offers from the section above, one bullet each: what to do · minutes saved · cost.
   None found → one line saying so. This is the part the owner reads most; never drop it.
4. The 👤 line (what the owner can do now — an answer or a step that would speed things up first) and the 🤖 line.

Six to ten lines in all. A single item that is the bottleneck may be NAMED in a sentence ("ที่จบช้าสุดคือ …"), but
items are never listed one by one.

### Full report

Format per `ae49-ref-report-format` (Thai prose, English table, `#` column, the 👤 and 🤖 lines last):

```markdown
| # | Feature / plan / task | Stage now | Remaining steps | Est. time | Waiting On | Est. finish (ICT) |
|---|---|---|---|---|---|---|
| 1 | foundation-no-mixed-piles | 📝 Planning | approve → heavy build → FULL audit → gate → land | 2h 30m – 3h 40m | #2 landing | 14:20 – 15:50 |
```

- `Est. time` is the remaining work only (no owner waits); `Est. finish` follows the chain (`Waiting On` = `#N`
  for a blocker on the board, `Your …` for the owner).
- Above the table, 3–5 Thai sentences: the overall finish window, the method (measured baselines, chains in
  parallel), and the biggest risk. Below it: one line per risk that applies, then the "ways to finish sooner" offers.
- Say what the window EXCLUDES (owner waits, items with no plan yet).

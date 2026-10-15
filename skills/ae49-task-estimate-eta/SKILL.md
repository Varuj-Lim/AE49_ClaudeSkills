---
name: ae49-task-estimate-eta
description: Estimates how long each piece of work still open in an ae49-workflow project (AE49_Hub, Nuri_Hub, siblings) will take and the clock time (ICT) everything should be finished — from the plan board, the open-items register and the running agents, using MEASURED stage durations (build, audit, fold, Main gate, landing) instead of guesses, honouring the chain order, and reporting one English table plus a Thai summary of the finish window and what could push it later. Use when the owner asks "อีกนานไหม", "เสร็จกี่โมง", "งานทั้งหมดจะเสร็จเมื่อไหร่", "ประเมินเวลา", "ETA", "how long will this take", "when will everything be done", or invokes /ae49-task-estimate-eta.
---

# Estimate ETA — how long each open item takes, and when it all finishes

**Owner request 2026-10-15** (*"Skill เพื่อประเมินว่างานที่มีอยู่ตอนนี้แต่ละงานใช้เวลาประมาณเท่าไหร่ แล้วทั้งหมดจะเสร็จ
ประมาณกี่โมง พร้อมเขียน Report ในรูปแบบตารางบอกด้วย"*), after Main answered "อีกนานไหม" by hand from memory. An
estimate is a FORECAST, never progress: it never claims an agent is n % done (`ae49-ref-report-format` — never
invent progress). It says how it was computed so the owner can judge it.

## Workflow

1. **Read the clock** — `date` (Bash; already ICT on the owner's machines). Never a stamp carried from earlier.
2. **Collect the open items, from files** — every plan in `docs/plans/*.md` not `Done` (its batches left), every
   row of `docs/plans/_open-items.md`, the agents running now (`ListAgents` — name, kind, minutes running), and
   the unpushed commits. One row per batch that still has work; never merge items (`ae49-router` status rule).
3. **Place each item on its chain** — `After:` edges and shared files (`ae49-router` chain graph). Items on one
   chain run one after another; independent chains run in parallel (no cap on agents unless the owner set one).
4. **Cost the remaining stages** with the baselines below — a LOW–HIGH range per stage, summed per item. An
   agent already running costs `max(0, baseline − minutes so far)`, floored at the low end of the next stage.
5. **Owner-bound waits are NOT time** — an item waiting on the owner's answer, hands or push gets the stage
   `⏸️ Waits on you` and its finish reads `after your answer + X–Y min`; it is left out of the overall window,
   which then says so.
6. **Compute finish clock times** — per chain, start = now; add each item's range in order; the overall window
   is the latest chain's LOW–HIGH. Round to 5 minutes. Past 18:00 ICT say the day is likely to roll over.
7. **Report** (below), then log one line in the autopilot log if the mode is ON.
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
| Build — `ae49-implement-heavy` (engine, file format, data shape) | 60 | 100 | B3 rework 97 |
| Fold after an audit (builder resumed or Main inline) | 3 | 8 | |
| Audit — SHORT | 4 | 10 | today 4–9 |
| Audit — FULL | 10 | 20 | today 10–19 |
| Main gate — logic / script items | 5 | 10 | |
| Main gate — screens in the pane | 10 | 25 | |
| Main gate — headless Chrome (real paste, sign-out, throttling) | 20 | 35 | first set-up in a session +10 |
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

## Report

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

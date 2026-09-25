---
name: ae49-mode-autopilot
description: An ON/OFF mode for the Main session of an ae49-workflow project (AE49_Hub, Nuri_Hub, future siblings) — while ON, Main keeps working unattended inside a scope the owner set at switch-on, dispatches and audits agents itself, runs every gate itself (scripts for logic and data, the built-in browser on the emulator for screens, screenshots as evidence), lands and backs up — but never pushes the deploy branch, never deploys, never migrates, never deletes real data, never sends anything, never decides an unsettled design; every decision it takes for the owner goes into a dated log file the moment it is made. While OFF (the normal state) nothing here applies. Invoke on "/ae49-mode-autopilot on|off|status|tick", "เปิดโหมด autopilot", "ผมจะไปนอน ทำต่อเองเลย", "รันต่อเองทั้งคืน", "ปิดโหมด", "ตั้งแต่เปิดโหมดคุณตัดสินอะไรไปบ้าง", and at every session start or compact when the state file says ON.
---

# ae49-mode-autopilot — unattended Main, with a decision log

**Owner ruling 2026-09-25 ("ทำเลย").** The owner wanted a switch: ON = "run the work on your own
while I sleep — you are the gate tester and the one who dispatches agents, don't ask me"; OFF =
"tell me every decision you took for me since ON, so I can change any of it". Main's reply,
accepted with two defaults: yes, behind three fences — a NEVER list, a scope fixed at switch-on,
and a decision log that is a FILE (a long unattended run WILL be compacted; the file is what survives).

## The NEVER list — ON or OFF, no exception, no owner pre-authorisation inside this mode

1. **Never push the deploy branch** (`main` in the hubs — push == deploy, `web-ref-deploy-landing` §1).
   Everything lands as local commits + the backup branch; the morning report lists what is ready to push.
2. **Never deploy** security rules, indexes, Cloud Functions, a worker image or a job update.
3. **Never run a migration or backfill with `--apply`**; dry-runs and emulator rehearsals only.
4. **Never delete or rewrite real data.** Tagged test data (`isTestData` + the batch tag) may be swept.
5. **Never send anything** — LINE, mail, notifications, patch notes, tickets' write-backs to people.
6. **Never touch money**, billing, IAM, or any secret; never sign in on production as anyone. On the
   emulator the dev login ("Sign in as …") is allowed — that world is disposable.
7. **Never write outside this project** (user CLAUDE.md, one session one project); a sibling-hub change
   becomes a handoff prompt, parked in the log for the owner.
8. **Never decide an unsettled design.** A fork with product impact that is not cheaply reversible is
   PARKED with the options written out, not chosen.
9. **Never invent work.** When the scope is exhausted the mode goes quiet; it does not look for more.

## `on <scope…>` — switching on (the owner is still awake: this is the one moment to ask)

1. **Take the scope from the owner's words** — plan slugs / batches / named tasks, e.g.
   `on stories-B1 stories-B2 table-columns-B8`. Read those plans; check their `After:` chains are
   satisfied or inside the scope. No scope given → ask ONCE ("คืนนี้ให้ทำอะไรบ้าง") — never start on a guess.
2. **Collect pre-answered rulings** the owner gives now ("ถ้าถามเรื่อง X ให้เลือก ก") into the state.
3. **Budget** (defaults unless the owner says otherwise): at most **2** agents at once; at most **3**
   audit rounds per build before the build is parked; no time box unless given.
4. **Write the state file** `~/.claude/autopilot/<project-folder-name>/state.json`:
   `{ "on": true, "project": "<absolute path>", "since": "<clock, ICT>", "scope": [...],
   "rulings": [...], "budget": {...}, "log": "<path of the decision log>" }` — machine-local on
   purpose: a session on the other machine must not believe it is in the mode.
5. **Open the decision log** `<project>/.claude/memory/<person>/autopilot-<YYYY-MM-DD>.md` (the
   git-synced per-person memory; `<person>` from the mapping in `.claude/memory/MEMORY.md`) with a
   header: since, scope, rulings, budget. Screenshots go to
   `~/.claude/autopilot/<project-folder-name>/<YYYY-MM-DD>/shots/` and are linked from the log as `file://`.
6. **Start the heartbeat.** Agent completions wake Main by themselves; for the gaps, invoke the
   `loop` skill self-paced with the prompt `/ae49-mode-autopilot tick` (the harness re-wakes Main via
   ScheduleWakeup). If the harness refuses the invocation, ask the owner to type
   `/loop /ae49-mode-autopilot tick` before leaving — and say so plainly; without a heartbeat the mode
   only moves when an agent finishes.
7. **Say back, in Thai:** the scope as understood, the NEVER list in one line, the budget, that
   nothing will reach production, how to switch off (`/ae49-mode-autopilot off` or "ปิดโหมด"), and
   that the morning report will list every decision. Then start the first `tick` at once.

## `tick` — one unattended step (every wakeup, every agent completion)

1. **Re-read the state file and the tail of the log first.** Not ON → do nothing and stop the
   heartbeat. If the five session skills (`~/.claude/CLAUDE.md`) are not in context — a compact
   happened — re-invoke them before anything else.
2. **Pick the next actionable item inside the scope** by the chain graph (`ae49-router`); respect
   the budget. Nothing actionable and nothing running → stop the heartbeat (ScheduleWakeup `stop`)
   and write `QUEUE EMPTY` in the log; the state stays ON until the owner's `off`, so the report still runs.
3. **Do the work by the ordinary rules** — the router's who-plans / who-builds / audit-depth rule,
   `web-ref-deploy-landing`, `ae49-ref-gate-checklist` — with exactly two relaxations:
   - a plan for IN-SCOPE work is approved by Main (the design was settled with the owner when the
     scope was set; each approval is logged);
   - a build is committed after the **Main-run gate** below instead of the owner's manual test.
   Everything else stands: the audit is never skipped (≤ 3 rounds, then PARK), commits carry an
   explicit pathspec, the plan moves to `done/`, the board is closed, the backup branch is pushed.
4. **The Main-run gate.** Write the gate section on the page exactly as for the owner (validate it),
   then execute every item yourself and record the outcome per item in the log:
   - **logic and data** — read-only scripts against the emulator or production, the way the day's
     smoke runs were done (create TAGGED data through the same route the button uses, read the
     result back, sweep the tags);
   - **screens** — the built-in browser on the emulator: the dev login as the named account, the
     click path in the item, `read_page` for text, a screenshot saved under `shots/` for anything the
     owner would have looked at; the item is **Main-verified** (counts as passed, screenshot linked);
   - **owner-only** — Cloud Shell, the Firebase console, LINE on a phone, production-only steps —
     mark **WAITING-OWNER**, queue the complete block for the morning (one sitting, per the router's
     owner-steps rule); such a feature lands only if its items that CAN be checked all passed and
     the plan says the owner-only part is separate (a rules deploy before a push, for instance).
   Closed line: `gate P/N` counts Main-verified as passed; nothing is waived by Main — an item it
   cannot verify is WAITING-OWNER and named in the report.
5. **Forks.** When a choice arises — an agent's open question, a wording, a small design detail —
   choose the option the relevant canon recommends, or the safest cheaply-reversible one, and log it
   as a DECISION with the alternatives. A fork that changes product behaviour and is not cheaply
   undone → PARK (NEVER 8). A ticket or request outside the scope → write the plan, PARK it for
   approval, never build (owner default 2026-09-25).
6. **Log immediately, never later.** One line per event, appended as it happens:
   ```
   - HH:MM ICT · D<n> DECISION · <what> · chosen: <x> · alternatives: <y | z> · why: <one line> · undo: <sha / file / step> · risk: low|medium|high
   - HH:MM ICT · LANDED · <slug> · commit <sha> · gate P/N (M Main-verified) · backup pushed
   - HH:MM ICT · PARKED · <slug / item> · why · what the owner must rule
   - HH:MM ICT · WAITING-OWNER · <step> · block ready at <where>
   - HH:MM ICT · FAILED · <what> · <error, exact> · left as: <state>
   ```
   Owner rulings given at switch-on are cited as `ruling:` — they are the owner's, not Main's decisions.
7. **Pace the heartbeat honestly:** agents running → a long fallback (1200 s+); actionable work → act
   now; everything parked or waiting on the owner → stop. Never wake up just to say "still waiting".

## `off` — the report the owner asked for

Set `on: false` in the state file, stop the heartbeat, then ONE report per `ae49-ref-report-format`
(Thai prose, English table), built from the LOG, never from memory:

1. **Decisions taken for you** — the table `# | Decision | Chosen | Alternatives | Undo | Risk`, every
   `D<n>` line, oldest first. This is the section the owner came for; it is never summarised away.
2. **Landed** — slug, commit, gate score with the Main-verified count, evidence links.
3. **Ready to push** — the commits on the deploy branch that the morning push would deploy, and any
   rules / functions / indexes deploy that must precede it.
4. **Owner steps queued** — the one-sitting block(s), with the minutes they need.
5. **Parked** — what stopped, why, and the exact question the owner must answer.
6. **Failed / not reached** — with the exact error text.
7. The 👤 line: what the owner does first this morning.
Commit the log with the next landing's memory commit as usual. If the owner asks to undo a decision,
the `undo:` column is the recipe; a landed commit is reverted, never rewritten.

## `status`

One paragraph: ON/OFF, since when, scope left, agents running, last tick, log path — read from the
files, not from memory.

## Session start and compaction

`~/.claude/CLAUDE.md` names this skill: at every session start and right after any compact, Main
reads the state file for the current project; ON → invoke `tick` before touching anything else.
A session in the mode that is asked a question by the owner answers it normally — the mode is not
a gag; a new ruling from the owner is logged as `ruling:` and applied.

## What this mode is not

Not a licence to deploy, not a replacement for the owner's design decisions, not a way to skip the
audit. It moves the owner's manual test to Main **with evidence** and defers the owner's judgment
**with a log** — the two things that let the owner sleep and still own the product in the morning.

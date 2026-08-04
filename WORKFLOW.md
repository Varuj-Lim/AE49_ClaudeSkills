# The Owner's Handbook — how to drive the ae49 workflow

Everything YOU say and do when working with Claude on an ae49-workflow project.
Claude's side is encoded in the skills/agents of this repo; this file is the
human side. One Main session per project at a time — Main routes, grills,
gatekeeps, and lands; headless sub-agents do the heavy work in isolated
worktrees and never touch git.

## 0. Session start (automatic — you do nothing)

Every session self-loads: the grill discipline, the coding guidelines, caveman
mode, and the router. The project's `CLAUDE.md` adds project rules, and
git-synced project memory (`.claude/memory/` — `shared/` + your personal
folder) restores everything past sessions learned. On a machine you haven't
used lately: `git pull` first, so memory and plans are current.

## 1. Routing — the prefixes you type

| You type | What happens |
|---|---|
| *(no prefix — a question)* | You get an answer/assessment. Nothing is changed. |
| *(no prefix — a small command)* | Tiny cosmetic fix path: Claude proposes → you approve → edit lands and auto-commits (never auto-pushes). |
| `refine: <rough idea>` | Claude turns it into a sharp prompt/spec, nothing else. |
| `plan: <feature>` | Design grill first (see §2), then a plan file is drafted. |
| `impl:` | Build the approved plan (see §4). |
| `self: <change>` | Main edits its own workflow/skills/config. |
| `status` | The plan board: what's Ready / building / gating / Done. |

## 2. The grill — expect questions before work

For any real feature, Claude interviews you with option cards (recommended
choice listed first). Answer them all; type "Other" text when no option fits.
Rulings you give here are FINAL for the build — they go into the plan file
verbatim, and sub-agents obey the plan, not the chat. If you change your mind
later, say so explicitly; it becomes a recorded amendment.

## 3. The plan — review it before building

The `ae49-plan` agent writes `docs/plans/<slug>.md`: steps, file footprint,
settled decisions, edge cases, testing checklist, `After:` chain-edges. Main
shows you the summary + any open questions. Confirm or veto each. The plan is
then **committed to main BEFORE any builder launches** (isolated worktrees
only see committed state). Say `impl:` when you want the build.

## 4. Build → audit → your gate (the quality funnel)

1. **`ae49-implement`** builds the whole plan in its own git worktree,
   runs the project's build checks, returns an emoji status report. It never
   commits.
2. **`ae49-audit`** (mandatory, automatic) adversarially reviews the diff
   against the plan BEFORE you see anything. BLOCKER/MAJOR findings get fixed
   or re-dispatched first; MINORs are reported to you at the gate.
3. The build is staged **uncommitted** into your working tree. Your dev server
   hot-reloads it.
4. **Your manual-test gate:** open `docs/gate-checklist.html` in a browser
   (items live in the gitignored `docs/gate-checklist.js`, rewritten for every
   gate; ticks persist in localStorage). Walk every item on `localhost:<port>`.
   NOTHING is committed until you pass it.

## 5. Landing — the phrases that move git

| You say | What Claude does |
|---|---|
| `all pass, commit it` | ONE commit per feature on main → plan flipped Done + archived to `docs/plans/done/` → worktree removed safely → **gate checklist reset to its closed state** (the page reads "No open gate") → `backup` branch pushed (off-machine safety; NEVER deploys). |
| `push` | `git push origin main` → **auto-deploys to production**. Only ever say it when you mean production. |
| *(you say nothing)* | Commits queue locally; `backup` still protects them. |

Fail an item instead? Just describe it — Claude fixes and you re-test. Mid-gate
change requests ("move this button…") are normal; they're folded into the same
feature commit and recorded in the plan's deviations.

## 6. Deploys that are NOT the git push

Some changes ship outside App-Hosting pushes and happen BEFORE your test gate,
not at landing: Firestore/Storage **rules** (a new collection 403s until rules
are live), **Cloud Functions**, and **secrets** (created + access-granted
BEFORE any config referencing them). Claude runs these and tells you; secrets
values never appear in chat — you paste them in your own terminal or point
Claude at a file it pipes without printing.

## 7. Real-data migrations

`ae49-migrate` profiles the source, transforms per your settled mapping, and
**dry-runs first** — you always see counts/diffs before anything writes. It
applies only when you explicitly say `apply`. Production data is real; there is
no test-tag mode.

## 8. Memory — "remember this"

Say it and Claude writes a memory file: team truths → `.claude/memory/shared/`,
your personal working style → `.claude/memory/<you>/`, machine quirks → the
machine-local folder. Repo memories ride commits, so every machine and teammate
inherits them. Wrong/stale memory? Say so — it gets updated or deleted.

## 9. Release notes & documents

A living draft (`docs/launch-patch-note.md`-style) is updated at EVERY landing.
Publishing to staff is a separate explicit step (the patch-note skill: version,
title, Git No., recipient count — you confirm before it writes + notifies).
Thai PDFs render via headless-browser print from styled HTML — ask and you get
the file to review before anything is distributed.

## 10. Multi-machine ritual

- Start of a session on any machine: `git pull` (code + plans + memory arrive
  together). Claude checks for drift and reconciles — it will never force-push.
- Keep this skills repo synced the same way: "update the skill repo" makes
  Claude diff both directions, push local-newer, pull repo-newer, and
  placeholder-check everything crossing the public boundary.

## 11. Safety rails you can rely on

- No feature commit before your gate; one commit per feature; plans are the
  source of truth between sessions.
- `backup` branch = off-machine copy that never deploys; `push` = production.
- Rollback: platform console → roll back the rollout, then `git revert` + push
  to reconcile. Never `reset --hard`, never force-push main.
- Anything destructive (deleting data, mass edits) is shown to you with counts
  before it runs, and runs only on your explicit yes.

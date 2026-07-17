---
name: ae49-task-setup-team-workflow
description: >
  Teaches how to set up the multi-session team workflow for Claude Code — five
  coordinated session types (Refine Prompt, Plan, Main Setup, Build, Main Merge),
  each with the skill it runs, step-by-step setup, and a verification checklist,
  plus a diagram of how they hand off to each other. Project-agnostic: works for any
  repo wired for the ae49 plan / implement / integrate skills. Use when the user wants
  to set up / onboard the parallel multi-session workflow, asks how the sessions fit
  together, how to run plan / build / merge sessions in parallel without stepping on
  each other, which window runs which skill, or invokes /ae49-task-setup-team-workflow.
disable-model-invocation: true
---

# Set up the team workflow

Stand up a **team of Claude Code windows** that build features in parallel without
colliding. Work flows through five session types: a rough idea is sharpened into a
clean prompt, planned into a doc, set up onto a build folder, built into a PR, then
merged and deployed — only after you eyeball it live.

This skill is the **map + setup guide**. Each session runs its own skill (already
installed); this one teaches how to open each window, what it does, and how to check
it's set up right. It works for any project wired for the ae49 plan / implement /
integrate skills — the project name, ports, and folder count below are **examples**;
use your own.

## The five sessions at a glance

| # | Session | Runs | Where | How many |
|---|---|---|---|---|
| 1 | **Refine Prompt** | `/ae49-ref-prompt-refine` | any folder | as needed |
| 2 | **Plan** | `/ae49-task-plan-feature` | hub · default branch · plan mode | many (parallel) |
| 3 | **Main Setup** | `/ae49-task-integrate setup` (+ one-time `init`) | hub · default branch | one |
| 4 | **Build** | `/ae49-task-implement-feature` | a build folder · its branch | up to the pool size (one/folder) |
| 5 | **Main Merge** | `/ae49-task-integrate merge <PR#>` (+ `board`, `abandon`) | hub · default branch · dev port | exactly one |

**Hub** = your project's main repo clone (where the Main sessions run), on the default
branch (usually `main`), on a dev port (e.g. `:3000`) where the live app is checked.
**Build folders** = a standing pool of clones (e.g. 4: `<project>-build1…4`) on their
own ports (e.g. `:3001`–`:3004`), each on its own feature branch.

## How the five sessions connect

```
  ┌──────────────────────┐
  │ 1. Refine Prompt      │  /ae49-ref-prompt-refine
  │    any folder         │  rough idea → one clean English prompt
  └──────────┬───────────┘
             │  paste the clean prompt into any session below (Plan shown)
             ▼
  ┌──────────────────────┐
  │ 2. Plan  (×many)      │  /ae49-task-plan-feature
  │    hub · plan mode    │  grills the design → docs/plans/<slug>.md → pushes
  └──────────┬───────────┘
             │  plan is Ready
             ▼
  ┌──────────────────────┐
  │ 3. Main Setup  (×1)   │  /ae49-task-integrate setup <slug>
  │    hub                 │  claims a free build folder, branches it off the default branch
  └──────────┬───────────┘
             │  buildN now on feature/<slug>
             ▼
  ┌──────────────────────┐
  │ 4. Build  (×pool)     │  /ae49-task-implement-feature
  │    buildN · dev port  │  builds the plan → pushes branch → opens a PR
  └──────────┬───────────┘
             │  PR open
             ▼
  ┌──────────────────────┐
  │ 5. Main Merge  (×1)   │  /ae49-task-integrate merge <PR#>
  │    hub · dev port     │  CI + review + local preview → you confirm → deploy
  └──────────────────────┘
```

Sessions 3 and 5 are two windows on the **same hub folder** — a safe split so setting
up new builds never stalls behind a long merge preview. You may instead run both from
one hub window, one operation at a time.

## One-time prerequisites

Before opening the team, once:

1. A GitHub remote + `gh` CLI signed in, with CI that runs on every PR (type-check /
   tests) so a PR can't merge red.
2. The build-folder pool created: in a **Main Setup** window run
   `/ae49-task-integrate init` — it makes the pool clones (`<project>-build1…N`), each
   with its own dependencies, local env file, and dev-server script. Never deleted; reused.

## Setup per session + checklists

Detailed step-by-step setup for each of the five sessions, each with its own
verification checklist, lives in **[SETUP.md](SETUP.md)**. Open it, set up the sessions
you need, and tick each checklist. Start with the **master checklist** at the bottom of
that file to confirm the whole team is wired correctly.

## The golden rules (do not break)

- **Exactly one Main Merge session.** Two `merge` at once corrupts the merge gate.
- **Don't commit in the hub while a merge is mid-flight.** The merge gate parks the hub
  on a throwaway `_merge_preview` branch while you check the live preview; a Plan session
  sharing the hub must hold its commit until the hub is back on the default branch.
- **Build sessions never touch the default branch or the plan file.** The plan doc is
  owned by the hub (Main sessions); a Build session only reads it.
- **Nothing reaches the live app until you confirm it locally.** The merge gate previews
  the squashed result on the hub first; only your OK deploys it.

**Source of truth:** these rules and the exact commands live in your project's `CLAUDE.md`
and in the `ae49-task-integrate` skill. If anything here ever disagrees with those, trust
them — this guide is the onboarding map, not the spec.

## When to use each session

- Rough or mixed-language idea, want a clean prompt → **Refine Prompt**.
- Have a feature idea, want it designed + written down → **Plan**.
- A plan is Ready, want to start building it → **Main Setup** (then hands to Build).
- A build folder is on its branch, want to write the code → **Build**.
- A PR is open, want to review + land + deploy it → **Main Merge**.

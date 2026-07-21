# AE49 Skills

Agent skills for real engineering work in the AE49 stack — not vibe coding.

Building real software is hard. Frameworks that try to own the whole process tend to take away your control and make failures hard to debug. These skills take the opposite stance: they're **small, easy to adapt, and composable**. They work with any model, slot into any repo, and are based on engineering fundamentals rather than a rigid pipeline. Hack on them, make them your own.

They began as an adaptation of Matt Pocock's [Skills For Real Engineers](https://github.com/mattpocock/skills) (see [Credits](#credits)), tuned for AE49 — including the PyRevit extension — and extended with a few skills of our own.

## Quickstart

Clone the repo and copy the skills into your Claude Code skills directory.

**Windows (PowerShell):**

```powershell
git clone https://github.com/Varuj-Lim/AE49_ClaudeSkills.git
Copy-Item -Path .\AE49_ClaudeSkills\skills\*  -Destination "$env:USERPROFILE\.claude\skills\"  -Recurse -Force
Copy-Item -Path .\AE49_ClaudeSkills\agents\*  -Destination "$env:USERPROFILE\.claude\agents\"  -Force
```

**macOS / Linux:**

```bash
git clone https://github.com/Varuj-Lim/AE49_ClaudeSkills.git
cp -r AE49_ClaudeSkills/skills/* ~/.claude/skills/
mkdir -p ~/.claude/agents && cp AE49_ClaudeSkills/agents/*.md ~/.claude/agents/
```

For a single project instead of globally, copy into `<your-repo>/.claude/skills/` instead. Then invoke any skill by name, e.g. `/ae49-task-grill`.

## Layout

| Folder | Goes to | What it is |
|---|---|---|
| `skills/` | `~/.claude/skills/` | The skills themselves — invoke by name, e.g. `/ae49-task-grill`. |
| `agents/` | `~/.claude/agents/` | Subagent definitions. `ae49-plan` and `ae49-implement` are the headless workers a Main session spawns to write plans and build them in isolated worktrees. Skills alone are not enough — without these, `ae49-router` has nothing to delegate to. |
| `dotclaude/CLAUDE.md` | `~/.claude/CLAUDE.md` | Session-init: the skills loaded on every session's first response. |

`/ae49-task-update-skills` syncs all three, one-way, GitHub → local.

To auto-load skills every session, put a `CLAUDE.md` at `~/.claude/CLAUDE.md` (or a repo root). One is provided:

- [`dotclaude/CLAUDE.md`](./dotclaude/CLAUDE.md) — **the full setup, and the one `/ae49-task-update-skills` syncs.** Loads four skills: `ae49-task-grill`, `ae49-ref-guidelines`, `ae49-ref-caveman`, and `ae49-router`. Use this if you want the router workflow (Main delegates to the `ae49-plan` / `ae49-implement` agents). For a minimal setup without the router, trim it to just `ae49-ref-caveman` + `ae49-ref-guidelines`.

Adapt or omit as you like — but note the sync overwrites `~/.claude/CLAUDE.md` from `dotclaude/`, so put local edits there if you want them to survive.

## Why These Skills Exist

Each skill targets a common failure mode of coding agents.

### #1: The agent didn't do what I wanted

The most common failure in software is misalignment — you think the agent understood you, then you see what it built. The fix is a **grilling session**: make the agent ask you detailed questions *before* it writes code, and stress-test finished work afterward.

- [`/ae49-task-grill`](./skills/ae49-task-grill/SKILL.md) — get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved. If the repo carries a domain model (`CONTEXT.md` / `docs/adr/`), it challenges the plan against the existing language and updates those docs inline.
- [`/ae49-task-scrutinize`](./skills/ae49-task-scrutinize/SKILL.md) — once it's built, get an outsider-perspective review that traces the *actual* code path, not just the diff.

### #2: The code doesn't work

When the agent flies blind without feedback, it produces crap. The fix is a tight feedback loop and a disciplined debugging method instead of guess-and-check.

- [`/ae49-ref-debug-soft`](./skills/ae49-ref-debug-soft/SKILL.md) — the lightweight default: a four-mantra discipline (reproduce, trace the fail path, falsify the hypothesis, cross-reference) applied before proposing any fix.
- [`/ae49-task-debug-hard`](./skills/ae49-task-debug-hard/SKILL.md) — for hard or intermittent bugs and performance regressions: reproduce → minimise → hypothesise → instrument → fix → regression-test, built around a repro harness and a post-mortem.

### #3: We built a ball of mud

Agents accelerate coding — and software entropy with it. The fix is to care about design every day, and to periodically rescue a codebase before it ossifies.

- [`/ae49-task-improve-codebase-architecture`](./skills/ae49-task-improve-codebase-architecture/SKILL.md) — find deepening opportunities, consolidate tightly-coupled modules, and make a codebase more testable and AI-navigable, informed by the domain language in `CONTEXT.md` and the decisions in `docs/adr/`.
- [`/ae49-ref-guidelines`](./skills/ae49-ref-guidelines/SKILL.md) — the standing rules for code work: keep changes simple and surgical, check shared code first, define verifiable success criteria, commit per logical change.

### #4: The agent is way too verbose

Agents use twenty words where one will do, and explain code at the wrong altitude for the audience.

- [`/ae49-ref-caveman`](./skills/ae49-ref-caveman/SKILL.md) — ultra-compressed communication mode that cuts token usage ~75% while keeping full technical accuracy.
- [`/ae49-task-management-talk`](./skills/ae49-task-management-talk/SKILL.md) — rewrite engineer-to-engineer content for leadership, shaped for the channel it's going to (JIRA, Slack, standup, email, meeting).

## Reference

### Engineering

Skills for code work.

| Skill | What it does |
|-------|--------------|
| **[ae49-task-grill](./skills/ae49-task-grill/SKILL.md)** | Relentlessly interview the user about a plan or design until shared understanding is reached, resolving each branch of the decision tree. Challenges the plan against `CONTEXT.md` / `docs/adr/` and updates them inline. |
| **[ae49-task-scrutinize](./skills/ae49-task-scrutinize/SKILL.md)** | Outsider-perspective, end-to-end review of a plan, PR, or change. Questions intent first, then traces the actual code path to verify the change does what it claims. |
| **[ae49-ref-debug-soft](./skills/ae49-ref-debug-soft/SKILL.md)** | The everyday four-mantra debugging discipline: reproduce, trace the fail path, falsify the hypothesis, cross-reference every breadcrumb — before proposing any fix. |
| **[ae49-task-debug-hard](./skills/ae49-task-debug-hard/SKILL.md)** | Disciplined diagnosis loop for hard/intermittent bugs and performance regressions: reproduce → minimise → hypothesise → instrument → fix → regression-test, with a repro harness and post-mortem. |
| **[ae49-task-improve-codebase-architecture](./skills/ae49-task-improve-codebase-architecture/SKILL.md)** | Find deepening opportunities in a codebase, consolidate tight coupling, and make it more testable and AI-navigable, informed by the domain language and ADRs. |
| **[ae49-ref-guidelines](./skills/ae49-ref-guidelines/SKILL.md)** | Behavioral guidelines for code work: question vs. command, ≥95% understanding before coding, reuse-first, surgical changes, verifiable success criteria, commit per logical change. |
| **[ae49-task-audit-lib](./skills/ae49-task-audit-lib/SKILL.md)** | Non-destructive reuse audit of the codebase: finds inline logic that's duplicated or reusable enough to belong in shared code (a helper, module, or component), reports a prioritized list with `file:line` and a proposed home, and changes nothing until you approve. |
| **[ae49-router](./skills/ae49-router/SKILL.md)** | Makes the Main session a thin router: it grills you, then delegates planning to the `ae49-plan` agent and building to `ae49-implement` (each in its own git worktree, so independent work runs in parallel), while every human gate — design approval, manual test, and anything that touches git — stays with you. Requires the `agents/` folder. |
| **[ae49-task-plan-feature](./skills/ae49-task-plan-feature/SKILL.md)** | Plan a new feature for the current repo by stress-testing the design with a grilling interview, then saving the result as `docs/plans/<feature>.md` from a bundled plan template. |
| **[ae49-task-implement-feature](./skills/ae49-task-implement-feature/SKILL.md)** | Implement a previously planned feature: reads the plans in `docs/plans/`, lists the ones ready to build, executes its steps end-to-end, runs the automated checks, then waits for you to test before committing and pushing. |

### Productivity

General workflow tools, not code-specific.

| Skill | What it does |
|-------|--------------|
| **[ae49-ref-caveman](./skills/ae49-ref-caveman/SKILL.md)** | Ultra-compressed communication mode. Cuts token usage ~75% by dropping filler while keeping full technical accuracy. |
| **[ae49-task-management-talk](./skills/ae49-task-management-talk/SKILL.md)** | Rewrite engineer-to-engineer content for leadership and shape it for the target channel (JIRA, Slack, standup, email, meeting talking-points). |
| **[ae49-task-handoff](./skills/ae49-task-handoff/SKILL.md)** | Compact the current conversation into a handoff document so another agent can pick up the work. |
| **[ae49-task-teach](./skills/ae49-task-teach/SKILL.md)** | Teach the user a new skill or concept, using the current directory as a stateful teaching workspace. |
| **[ae49-task-write-a-skill](./skills/ae49-task-write-a-skill/SKILL.md)** | Create new agent skills with proper structure, progressive disclosure, and bundled resources. |
| **[ae49-task-audit-memory](./skills/ae49-task-audit-memory/SKILL.md)** | Non-destructive review of the project's auto-memory files: flags stale, duplicate, or misfiled entries plus gaps, and reports keep / update / delete / create suggestions without changing anything until you approve. |
| **[ae49-task-read-memory](./skills/ae49-task-read-memory/SKILL.md)** | Re-read the project's auto-memory from disk to pick up edits made by other Claude sessions running in parallel, then recap the current state grouped by type. Read-only — never edits. |
| **[ae49-ref-report-format](./skills/ae49-ref-report-format/SKILL.md)** | The one shared format for any findings / review / audit / status report: plain-English lines, emoji-tagged severity tiers, a per-finding ID you can reference back, and an emoji verdict. Used by the review and audit skills so they don't each reinvent a layout. |
| **[ae49-ref-prompt-refine](./skills/ae49-ref-prompt-refine/SKILL.md)** | On/off mode that turns the agent into a prompt rewriter: it stops answering and instead rewrites whatever you type into one clearer English prompt to copy and send. Runs on the smallest model. |

### Web patterns

Reusable UI/app patterns distilled from real production apps — portable references for building, reviewing, or porting common web features. Not process skills; drop them into any project. Examples are from Next.js + Tailwind + Firebase apps; swap the brand/framework specifics when porting.

| Skill | What it does |
|-------|--------------|
| **[web-ref-filter-dropdown](./skills/web-ref-filter-dropdown/SKILL.md)** | Checkbox multi-select filter dropdown for a list page: a `FilterMultiSelect` button with an "All" master box (indeterminate on a partial pick), driven by a `useMultiSelectFilter` hook that owns the selected set, row predicate, and reset. |
| **[web-ref-device-auth](./skills/web-ref-device-auth/SKILL.md)** | Trusted-device sign-in: an "Add this device" checkbox that registers a remembered, remotely-revocable device kept alive by a heartbeat, paired with a membership-gated Google sign-in that never auto-creates accounts. |

## Credits

These skills are adapted from Matt Pocock's [Skills For Real Engineers](https://github.com/mattpocock/skills) (`caveman`, `grill`, `improve-codebase-architecture`, `handoff`, `teach`, `write-a-skill`, and the `diagnose` debugging loop), retuned for AE49 and extended with AE49 originals: `ae49-task-scrutinize`, `ae49-task-management-talk`, `ae49-ref-guidelines`, `ae49-ref-debug-soft`, `ae49-ref-report-format`, `ae49-task-plan-feature`, and `ae49-task-implement-feature`. Huge thanks to Matt for the original work.

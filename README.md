# AE49 Skills

Agent skills for real engineering work in the AE49 stack — not vibe coding.

Building real software is hard. Frameworks that try to own the whole process tend to take away your control and make failures hard to debug. These skills take the opposite stance: they're **small, easy to adapt, and composable**. They work with any model, slot into any repo, and are based on engineering fundamentals rather than a rigid pipeline. Hack on them, make them your own.

They began as an adaptation of Matt Pocock's [Skills For Real Engineers](https://github.com/mattpocock/skills) (see [Credits](#credits)), tuned for AE49 — including the PyRevit extension — and extended with a few skills of our own.

## Quickstart

Clone the repo and copy the skills into your Claude Code skills directory.

**Windows (PowerShell):**

```powershell
git clone https://github.com/Varuj-Lim/AE49_ClaudeSkills.git
Copy-Item -Path .\AE49_ClaudeSkills\skills\* -Destination "$env:USERPROFILE\.claude\skills\" -Recurse -Force
```

**macOS / Linux:**

```bash
git clone https://github.com/Varuj-Lim/AE49_ClaudeSkills.git
cp -r AE49_ClaudeSkills/skills/* ~/.claude/skills/
```

For a single project instead of globally, copy into `<your-repo>/.claude/skills/` instead. Then invoke any skill by name, e.g. `/ae49-grill`.

## Why These Skills Exist

Each skill targets a common failure mode of coding agents.

### #1: The agent didn't do what I wanted

The most common failure in software is misalignment — you think the agent understood you, then you see what it built. The fix is a **grilling session**: make the agent ask you detailed questions *before* it writes code, and stress-test finished work afterward.

- [`/ae49-grill`](./skills/ae49-grill/SKILL.md) — get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved. If the repo carries a domain model (`CONTEXT.md` / `docs/adr/`), it challenges the plan against the existing language and updates those docs inline.
- [`/ae49-scrutinize`](./skills/ae49-scrutinize/SKILL.md) — once it's built, get an outsider-perspective review that traces the *actual* code path, not just the diff.

### #2: The code doesn't work

When the agent flies blind without feedback, it produces crap. The fix is a tight feedback loop and a disciplined debugging method instead of guess-and-check.

- [`/ae49-debug-soft`](./skills/ae49-debug-soft/SKILL.md) — the lightweight default: a four-mantra discipline (reproduce, trace the fail path, falsify the hypothesis, cross-reference) applied before proposing any fix.
- [`/ae49-debug-hard`](./skills/ae49-debug-hard/SKILL.md) — for hard or intermittent bugs and performance regressions: reproduce → minimise → hypothesise → instrument → fix → regression-test, built around a repro harness and a post-mortem.

### #3: We built a ball of mud

Agents accelerate coding — and software entropy with it. The fix is to care about design every day, and to periodically rescue a codebase before it ossifies.

- [`/ae49-improve-codebase-architecture`](./skills/ae49-improve-codebase-architecture/SKILL.md) — find deepening opportunities, consolidate tightly-coupled modules, and make a codebase more testable and AI-navigable, informed by the domain language in `CONTEXT.md` and the decisions in `docs/adr/`.
- [`/ae49-guidelines`](./skills/ae49-guidelines/SKILL.md) — the standing rules for code work in the AE49 PyRevit extension: keep changes simple and surgical, check shared code first, define verifiable success criteria.

### #4: The agent is way too verbose

Agents use twenty words where one will do, and explain code at the wrong altitude for the audience.

- [`/ae49-caveman`](./skills/ae49-caveman/SKILL.md) — ultra-compressed communication mode that cuts token usage ~75% while keeping full technical accuracy.
- [`/ae49-management-talk`](./skills/ae49-management-talk/SKILL.md) — rewrite engineer-to-engineer content for leadership, shaped for the channel it's going to (JIRA, Slack, standup, email, meeting).

## Reference

### Engineering

Skills for code work.

- **[ae49-grill](./skills/ae49-grill/SKILL.md)** — Relentlessly interview the user about a plan or design until shared understanding is reached, resolving each branch of the decision tree. Challenges the plan against `CONTEXT.md` / `docs/adr/` and updates them inline.
- **[ae49-scrutinize](./skills/ae49-scrutinize/SKILL.md)** — Outsider-perspective, end-to-end review of a plan, PR, or change. Questions intent first, then traces the actual code path to verify the change does what it claims.
- **[ae49-debug-soft](./skills/ae49-debug-soft/SKILL.md)** — The everyday four-mantra debugging discipline: reproduce, trace the fail path, falsify the hypothesis, cross-reference every breadcrumb — before proposing any fix.
- **[ae49-debug-hard](./skills/ae49-debug-hard/SKILL.md)** — Disciplined diagnosis loop for hard/intermittent bugs and performance regressions: reproduce → minimise → hypothesise → instrument → fix → regression-test, with a repro harness and post-mortem.
- **[ae49-improve-codebase-architecture](./skills/ae49-improve-codebase-architecture/SKILL.md)** — Find deepening opportunities in a codebase, consolidate tight coupling, and make it more testable and AI-navigable, informed by the domain language and ADRs.
- **[ae49-guidelines](./skills/ae49-guidelines/SKILL.md)** — Behavioral guidelines for code work in the AE49 PyRevit extension: question vs. command, ≥95% understanding before coding, surgical changes, verifiable success criteria, commit per logical change.

### Productivity

General workflow tools, not code-specific.

- **[ae49-caveman](./skills/ae49-caveman/SKILL.md)** — Ultra-compressed communication mode. Cuts token usage ~75% by dropping filler while keeping full technical accuracy.
- **[ae49-management-talk](./skills/ae49-management-talk/SKILL.md)** — Rewrite engineer-to-engineer content for leadership and shape it for the target channel (JIRA, Slack, standup, email, meeting talking-points).
- **[ae49-handoff](./skills/ae49-handoff/SKILL.md)** — Compact the current conversation into a handoff document so another agent can pick up the work.
- **[ae49-teach](./skills/ae49-teach/SKILL.md)** — Teach the user a new skill or concept, using the current directory as a stateful teaching workspace.
- **[ae49-write-a-skill](./skills/ae49-write-a-skill/SKILL.md)** — Create new agent skills with proper structure, progressive disclosure, and bundled resources.

## Credits

These skills are adapted from Matt Pocock's [Skills For Real Engineers](https://github.com/mattpocock/skills) (`caveman`, `grill`, `improve-codebase-architecture`, `handoff`, `teach`, `write-a-skill`, and the `diagnose` debugging loop), retuned for AE49 and extended with `ae49-scrutinize`, `ae49-management-talk`, `ae49-guidelines`, and `ae49-debug-soft`. Huge thanks to Matt for the original work.

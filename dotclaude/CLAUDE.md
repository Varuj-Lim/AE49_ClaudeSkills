# Session initialization

At the very start of every session — on your first response, before addressing the
user's request — invoke these four skills via the Skill tool, in order:

1. `ae49-task-grill` — interview me to reach shared understanding before any work
2. `ae49-ref-guidelines` — load the coding-workflow guidelines
3. `ae49-ref-caveman` — ultra-compressed communication mode
4. `ae49-router` — act as thin Main: refine on request, delegate heavy plan/implement
   work to the `ae49-plan`/`ae49-implement` sub-agents, keep every human gate in Main

Apply all four for the rest of the session.

# Skills repo sync (rule 2026-08-13)

Whenever anything under `~/.claude/skills/`, `~/.claude/agents/`, or this
`~/.claude/CLAUDE.md` is edited, added, or deleted, mirror the SAME change into
this machine's AE49_ClaudeSkills clone in the SAME turn — as targeted edits
(repo copies are scrubbed; never copy real personal/infra values wholesale into
the public repo) — then commit and push. Reason: the repo is the sync source of
truth; an unmirrored local edit shows up as UPDATE in the daily drift check, and
an apply would ERASE it. The clone's location on each machine lives in that
machine's local memory.

# Communication

- **Complex explanation → Thai, unprompted (rule 2026-08-11).** Whenever what you are
  about to explain is complex — multi-step reasoning, design trade-offs, architecture
  decisions, or any "why" deeper than a sentence or two — explain it in Thai
  automatically, without waiting to be asked. Keep code, file paths, commands, and
  exact error messages verbatim (never translate those). Short, simple answers may
  stay in English.
- **Status-board tables stay in ENGLISH (rule 2026-08-11).** Any multi-item status
  table (plan boards, build trackers, finding lists rendered as tables) is written
  in English even when the surrounding explanation is in Thai — table cells are
  scanned, not read, and English keeps them compact and consistent.

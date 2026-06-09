# AE49 Claude Skills

A collection of [Claude Code](https://claude.com/claude-code) agent skills used in the AE49 workflow.
Each folder is a self-contained skill with a `SKILL.md` and any bundled resource files.

## Skills

| Skill | Purpose |
|-------|---------|
| `ae49-caveman` | Ultra-compressed communication mode to cut token usage. |
| `ae49-debug-soft` | Lightweight four-mantra debugging discipline for everyday bugs. |
| `ae49-debug-hard` | Disciplined diagnosis loop for hard/intermittent bugs and regressions. |
| `ae49-grill` | Socratic interview that stress-tests a plan or design before building. |
| `ae49-scrutinize` | Outsider-perspective end-to-end review of a plan, PR, or change. |
| `ae49-guidelines` | Behavioral guidelines for code work in the AE49 PyRevit extension. |
| `ae49-handoff` | Compact a conversation into a handoff document for another agent. |
| `ae49-improve-codebase-architecture` | Find deepening / refactoring opportunities in a codebase. |
| `ae49-management-talk` | Rewrite engineer-to-engineer content for leadership channels. |
| `ae49-teach` | Teaching / learning-record workflow. |
| `ae49-write-a-skill` | Create new agent skills with proper structure. |

## Usage

Copy the skill folders into your Claude Code skills directory (`~/.claude/skills/`)
or a project's `.claude/skills/`, then invoke a skill with `/<skill-name>`.

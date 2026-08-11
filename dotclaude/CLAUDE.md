# Session initialization

At the very start of every session — on your first response, before addressing the
user's request — invoke these four skills via the Skill tool, in order:

1. `ae49-task-grill` — interview me to reach shared understanding before any work
2. `ae49-ref-guidelines` — load the coding-workflow guidelines
3. `ae49-ref-caveman` — ultra-compressed communication mode
4. `ae49-router` — act as thin Main: refine on request, delegate heavy plan/implement
   work to the `ae49-plan`/`ae49-implement` sub-agents, keep every human gate in Main

Apply all four for the rest of the session.

# Communication

- **Complex explanation → Thai, unprompted (rule 2026-08-11).** Whenever what you are
  about to explain is complex — multi-step reasoning, design trade-offs, architecture
  decisions, or any "why" deeper than a sentence or two — explain it in Thai
  automatically, without waiting to be asked. Keep code, file paths, commands, and
  exact error messages verbatim (never translate those). Short, simple answers may
  stay in English.

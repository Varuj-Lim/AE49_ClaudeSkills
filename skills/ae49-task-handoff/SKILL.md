---
name: ae49-task-handoff
description: Compact the current conversation into a handoff document for another agent to pick up. Use when the user wants to hand work off to a fresh session, says "handoff", "hand this off", or "write a handoff", or wants the current session summarized so another agent can continue the work.
argument-hint: "What will the next session be used for?"
---

# Handoff

> *Adapted from [mattpocock/skills — productivity/handoff](https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff) by Matt Pocock ([MIT License](https://github.com/mattpocock/skills/blob/main/LICENSE)).*

Write a handoff document summarising the current conversation so a fresh agent can continue the work.

Save it INTO THE PROJECT at `docs/handoffs/<topic>.md` (a path relative to the project root / current workspace):

- `<topic>` is a short kebab-case slug naming what the handoff is about — derive it from the user's argument when one is given (e.g. "draftsman-grid-tweaks"), otherwise from the main thread of the conversation. The topic MUST appear in the filename.
- Check whether the `docs/handoffs/` directory exists FIRST; create it if it doesn't (it is not created automatically — `mkdir -p docs/handoffs` or the platform equivalent).
- After writing, AUTO-COMMIT it: stage ONLY the handoff file (never `git add -A` — other work may be in progress), commit with a concise message like `docs(handoff): <topic>`, and if a remote is configured run `git pull --rebase` then push so the handoff is durable and reachable from another machine/session. Then tell the user the exact path.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

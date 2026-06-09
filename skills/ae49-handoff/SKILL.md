---
name: ae49-handoff
description: Compact the current conversation into a handoff document for another agent to pick up. Use when the user wants to hand work off to a fresh session, says "handoff", "hand this off", or "write a handoff", or wants the current session summarized so another agent can continue the work.
argument-hint: "What will the next session be used for?"
---

# Handoff

> *Adapted from [mattpocock/skills — productivity/handoff](https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff) by Matt Pocock ([MIT License](https://github.com/mattpocock/skills/blob/main/LICENSE)).*

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save it to the OS temp directory — resolve `$TMPDIR`, falling back to `/tmp` (or `%TEMP%` on Windows) — not the current workspace.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

---
name: ae49-task-handoff
description: Compact the current conversation into a handoff document for another agent to pick up. Use when the user wants to hand work off to a fresh session, says "handoff", "hand this off", or "write a handoff", or wants the current session summarized so another agent can continue the work — including closing a session in place ("ปิด session", "close this session and open a new one"), where in projects with git-synced per-person memory the driver's in-flight memory file (auto-read at next session start) is the primary artifact and the doc is written only for deep context.
argument-hint: "What will the next session be used for?"
---

# Handoff

> *Adapted from [mattpocock/skills — productivity/handoff](https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff) by Matt Pocock ([MIT License](https://github.com/mattpocock/skills/blob/main/LICENSE)).*

Write a handoff document summarising the current conversation so a fresh agent can continue the work.

Save it INTO THE PROJECT at `docs/handoffs/<topic>.md` (a path relative to the project root / current workspace):

- `<topic>` is a short kebab-case slug naming what the handoff is about — derive it from the user's argument when one is given (e.g. "draftsman-grid-tweaks"), otherwise from the main thread of the conversation. The topic MUST appear in the filename.
- Check whether the `docs/handoffs/` directory exists FIRST; create it if it doesn't (it is not created automatically — `mkdir -p docs/handoffs` or the platform equivalent).
- After writing, AUTO-COMMIT it: stage ONLY the handoff file (never `git add -A` — other work may be in progress), commit with a concise message like `docs(handoff): <topic>`, and if a remote is configured run `git pull --rebase` then push so the handoff is durable and reachable from another machine/session. Then tell the user the exact path.
- **Branch guard.** Before staging, confirm HEAD is the default branch — `git rev-parse --abbrev-ref HEAD`. If it is any other branch, or the path contains `.claude/worktrees/agent-`, do NOT commit — write the handoff file, tell the user it's saved and the commit is held, and let them land it from the main checkout. Never `git checkout` on someone else's behalf.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

## Session-close mode (same machine, new session)

When the intent is "close this session and continue in a fresh one" (the user
says "ปิด session", "close this session", or hands off with no machine switch):

1. **Check for git-synced per-person memory** — a repo `.claude/memory/MEMORY.md`
   with a driver mapping. Without it, write the handoff doc as above and tell
   the user to point the new session at the file (nothing loads it by itself).
2. **With it, the driver's in-flight memory file is the PRIMARY artifact** — the
   next session auto-reads it at start, while a `docs/handoffs/` doc alone sits
   unread. Update (or create) the driver's `inflight-<date>.md`: current state,
   queue, decisions made this session, the single next action. Keep the
   person's MEMORY.md index line current.
3. **Write the full handoff doc ONLY when the conversation carries deep context
   the memory format can't hold** (a long investigation, design reasoning).
   Link it from the in-flight file so the next session actually finds it.
4. Commit per the rules above (memory commits: `docs(memory): …`; the branch
   guard still applies). Durability push: in a project where a default-branch
   push DEPLOYS, never push main here — use the project's no-deploy backup push
   (e.g. `git push origin main:backup`) instead; plain push only where pushing
   is inert. Then tell the user: close away — the next session picks this up by
   itself.

For switching MACHINES, use `ae49-task-close-day` instead (work must travel via
git, with a 🎒 hand-carry list); this mode covers only a same-machine swap.

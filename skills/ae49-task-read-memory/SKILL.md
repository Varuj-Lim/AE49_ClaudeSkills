---
name: ae49-task-read-memory
description: Re-read this project's auto-memory files from disk and report their current contents — used to pick up edits made by OTHER Claude sessions so the current session stays in sync. Use whenever the user wants to reload / re-read / refresh / sync project memory, or says another session changed the memory.
---

# Read (re-sync) project memory

Re-reads ALL of this project's auto-memory from disk so the current session reflects the latest state — including edits made by a **different** Claude session running in parallel.

## Where memory lives
```
<home>/.claude/projects/<flattened-project-path>/memory/
```
`<flattened-project-path>` = the absolute project path with every character that isn't a letter or digit — the drive colon, `\`, `/`, `.`, `_` — replaced by `-`
(e.g. `C:\Users\alex\Documents\my_app` → `C--Users-alex-Documents-my-app`).

## Steps
1. **Read fresh from disk.** Read `MEMORY.md` (the index) first, then read **every** other `.md` file in that folder. Do a real re-read — do NOT rely on what's already in context (the whole point is that another session may have changed it).
2. If the folder or `MEMORY.md` doesn't exist, report "no memory saved yet for this project" and stop.
3. **Recap the current memory**, grouped by type: **👤 User · 💬 Feedback · 📁 Project · 🔗 Reference**. Keep it concise, scannable, and in plain language per `ae49-ref-report-format` — paraphrase each entry rather than pasting the memory file's raw technical wording verbatim.
4. 🆕 **Highlight what's NEW or CHANGED** versus what this session previously had in context — call out added rules (🆕), edited facts (✏️), or removed entries (🗑️), so the user can see what the other session changed. If you can't tell what changed, just present the current state and say so.

## Principle
- **Read-only.** This skill never edits memory — it only loads and reports it.
- To *clean up / fix* memory (merge duplicates, prune, propose edits), use the **`ae49-task-audit-memory`** skill instead.

---
name: ae49-task-audit-memory
description: Review this project's auto-memory files and report suggested keep / update / delete / create changes WITHOUT modifying anything until the user approves. Use when the user asks to audit, review, check, or clean up the project's memory.
---

# Audit Memory

Perform a **non-destructive review** of the current project's auto-memory and report findings.

**Hard rule: make NO changes to any memory file until the user explicitly approves a specific suggestion.** This skill reads and recommends only.

## Step 1 — Locate the memory directory

The memory lives at:

```
<home>/.claude/projects/<flattened-project-path>/memory/
```

`<flattened-project-path>` is the absolute project path with every character that isn't a letter or digit — the drive colon, `\`, `/`, `.`, `_` — replaced by `-`.
Example: `C:\Users\alex\Documents\my_app` → `C--Users-alex-Documents-my-app`.

Read `MEMORY.md` (the always-loaded index) first, then read **every** other `.md` file in that folder.

If the folder or `MEMORY.md` does not exist, report "no memory saved yet for this project" and stop.

## Step 2 — Assess each memory file

For every file, check:

- **Stale / outdated** — does it cite files, paths, functions, decisions, or dates that may no longer hold? Flag claims to verify against the *current* project state. Before asserting a claim is wrong, verify it (check the file exists, grep the symbol) — a memory is a point-in-time note, not live truth.
- **Duplication / overlap** — do two files, or two rules inside one file, say the same thing?
- **Wrong type / misfiled** — is a fact stored under the wrong memory type? Types are: `user` (who they are), `feedback` (how to work), `project` (what's happening & why), `reference` (where to find external info).
- **Index accuracy** — does each `MEMORY.md` line still match its file? Any file missing from the index, or any index line pointing to a file that no longer exists?
- **Frontmatter** — does each file have valid frontmatter (`name`, `description`, `metadata.type`)?

## Step 3 — Identify gaps (what to create)

Note any durable, useful context that is clearly **missing** — e.g. no `user` memory exists, or a major project decision was made but never recorded. Only suggest creating memory that is durable and **not** derivable from code or git history.

## Step 4 — Report (change nothing)

Produce a short, scannable report, formatted per the **`ae49-ref-report-format`** skill (plain
English, emoji, a short **ID** per suggestion so the user can reference one back):

1. A table of each memory file with a status: **✅ OK / ⚠️ stale / ♻️ duplicate / 📦 misfiled**.
2. Suggestions grouped under **✅ Keep · ✏️ Update · 🗑️ Delete · ➕ Create**, each with an ID
   (e.g. `U1` update, `D1` delete, `C1` create) and one line of reasoning.

Then **ask the user which suggestions to apply** (by ID). Apply changes only after explicit approval, one approved item at a time, and update `MEMORY.md` to match.

## Guiding principles

- **Read-only by default.** Never edit, delete, or create a memory file in this skill without the user first approving that specific change.
- **Be honest.** If the memory is in good shape, say so and suggest nothing — do not invent busywork to look thorough.
- **Keep it concise.** A clear table plus a short list beats a long essay.

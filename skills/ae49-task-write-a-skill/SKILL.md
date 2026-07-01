---
name: ae49-task-write-a-skill
description: Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to create, write, or build a new skill.
---

> *Adapted from [mattpocock/skills — productivity/write-a-skill](https://github.com/mattpocock/skills/tree/main/skills/productivity/write-a-skill) by Matt Pocock ([MIT License](https://github.com/mattpocock/skills/blob/main/LICENSE)).*

# Writing Skills

## Process

1. **Gather requirements** - ask user about:
   - What task/domain does the skill cover?
   - What specific use cases should it handle?
   - Does it need executable scripts or just instructions?
   - Any reference materials to include?

2. **Draft the skill** - create:
   - SKILL.md with concise instructions
   - Additional reference files if content exceeds 500 lines
   - Utility scripts if deterministic operations needed

3. **Review with user** - present draft and ask:
   - Does this cover your use cases?
   - Anything missing or unclear?
   - Should any section be more/less detailed?

## Naming

Skill name is kebab-case: `<scope>-<type>-<name>`.

**Scope segment** — who owns it:

- **Project-level skill** (lives in the project's `.claude/skills/`) — prefix with the project's short name, e.g. `ae49Hub-`. This namespaces project skills and keeps them distinct from user-level ones.
- **User-level skill** (lives in `~/.claude/skills/`) — use your personal namespace, e.g. `ae49-`.

**Type segment** — what kind (required, immediately after the scope):

- `ref` — a REFERENCE skill: a convention, pattern, or knowledge the model auto-applies whenever the relevant work comes up (style guides, display rules, component patterns, behavior modes). Fires on relevance; the user rarely types it. e.g. `ae49Hub-ref-colors`, `ae49-ref-guidelines`.
- `task` — a TASK skill: an action/workflow the user invokes (usually `/name`) that runs a process or produces an artifact (publish, audit, plan, implement, generate). e.g. `ae49Hub-task-patch-note`, `ae49-task-plan-feature`.

Classify by Anthropic's two content patterns: Reference content (knowledge applied to current work) → `ref`; Task content (step-by-step action) → `task`. If a skill truly does both, name it by how the user reaches it most often.

Invocation pairing (guideline, not enforced): `task` skills are typically `/`-invoked — set `disable-model-invocation: true` if it should run ONLY when the user calls it. `ref` skills stay model-invokable so they auto-apply.

## Skill Structure

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── REFERENCE.md       # Detailed docs (if needed)
├── EXAMPLES.md        # Usage examples (if needed)
└── scripts/           # Utility scripts (if needed)
    └── helper.js
```

## SKILL.md Template

```md
---
name: skill-name
description: Brief description of capability. Use when [specific triggers].
---

# Skill Name

## Quick start

[Minimal working example]

## Workflows

[Step-by-step processes with checklists for complex tasks]

## Advanced features

[Link to separate files: See [REFERENCE.md](REFERENCE.md)]
```

## Description Requirements

The description is **the only thing your agent sees** when deciding which skill to load. It's surfaced in the system prompt alongside all other installed skills. Your agent reads these descriptions and picks the relevant skill based on the user's request.

**Goal**: Give your agent just enough info to know:

1. What capability this skill provides
2. When/why to trigger it (specific keywords, contexts, file types)

**Format**:

- Max 1024 chars
- Write in third person
- First sentence: what it does
- Second sentence: "Use when [specific triggers]"

**Good example**:

```
Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when user mentions PDFs, forms, or document extraction.
```

**Bad example**:

```
Helps with documents.
```

The bad example gives your agent no way to distinguish this from other document skills.

## When to Add Scripts

Add utility scripts when:

- Operation is deterministic (validation, formatting)
- Same code would be generated repeatedly
- Errors need explicit handling

Scripts save tokens and improve reliability vs generated code.

## When to Split Files

Split into separate files when:

- SKILL.md exceeds 150 lines
- Content has distinct domains (finance vs sales schemas)
- Advanced features are rarely needed

## Pair `ref` skills with an audit

A **`ref` skill** *teaches* a convention at write time (one source of truth + the rule); an
**audit `task` skill** *checks* it later — sweeping for drift and writing a `docs/plans/`
fix plan (`file:line + rule + fix`) for a separate implement step, editing no code.
**Keep them symmetric:** every codified rule should be both teachable (`ref`) and checkable
(an audit topic) — add one, add the other, and cross-reference each. For a multi-rule
audit, make `SKILL.md` a lean orchestrator with each rule in its own `topics/NN-*.md` file,
loaded on demand — see [AUDIT-PATTERN.md](AUDIT-PATTERN.md).

## Reports: use the shared report-format ref

If the new skill **produces a report for the user** (a review, audit, findings list, summary,
or status output), do NOT invent or copy a format. Point its **Report** / **Output** section at
the shared **[`ae49-ref-report-format`](../ae49-ref-report-format/SKILL.md)** skill — the single
source for plain English, emoji tagging, per-finding **IDs** (so the user can reference a finding
back), the labelled finding lines, and the emoji verdict. Add only the skill's own specifics on
top (its severity / tier labels and its field names). Keep the format in one place so it can't
drift across skills.

## Review Checklist

After drafting, verify:

- [ ] Description includes triggers ("Use when...")
- [ ] Name has the `<scope>-<type>-<name>` form (ref/task segment)
- [ ] SKILL.md under 150 lines
- [ ] No time-sensitive info
- [ ] Consistent terminology
- [ ] Concrete examples included
- [ ] References one level deep
- [ ] Each `ref` rule has (or plans) a matching audit topic; many-rule audits split into `topics/NN-*.md`
- [ ] If the skill outputs a report, its Report/Output section points at `ae49-ref-report-format` (not a copied format) and gives findings referenceable IDs

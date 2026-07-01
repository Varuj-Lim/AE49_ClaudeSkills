# Audit-skill pattern (paired with `ref` skills)

The companion to a family of `ref` skills: ONE `task` skill that sweeps the codebase for
violations of those rules and turns them into a fix plan. It edits no code itself.

## The loop

- **`ref` skill** = the rule, applied at write time (auto-applied on relevance).
- **audit topic** = the detector, swept later → findings → a `docs/plans/` fix plan → a
  separate implement step applies the fixes.
- **1:1 symmetry** — each `ref` skill has an audit topic; each topic names its `ref` skill.
  Every codified rule is both teachable and checkable.

## Structure — orchestrator + per-topic files

```
audit-skill/
├── SKILL.md              # orchestrator only
└── topics/
    ├── 01-<rule>.md
    ├── 02-<rule>.md
    └── 14-<inventory>.md   # optional report-only topic
```

`SKILL.md` keeps just the orchestration: **Process, Scope + keyword map, Output format,
Plan output, Don't.** Each rule's Rule + Detector lives in its own topic file. A scoped
run reads ONLY the in-scope topic files (progressive disclosure) — never all of them.

## Keyword map (in SKILL.md)

| #  | Topic    | Keywords     | Reference file        |
|----|----------|--------------|-----------------------|
| 1  | `<rule>` | `<keywords>` | `topics/01-<rule>.md` |

An argument (`colors`, `7`, `ALL`) matches a keyword/number → the file(s) to read. With
no argument, print the map as a menu and ask which topics to run.

## Per-topic file template

```md
# Topic N — <name>
**Keywords:** … · **Ref skill:** <scope>-ref-<x> · **Output:** plan | report-only

## Rule
<what's required — cite the ref skill + its single source of truth>
## Detect
<the grep/scan that finds violations>
## Exclude
<the source / canonical-consumer files that legitimately contain the pattern>
```

## Output: a plan, never edits

- Findings → a `docs/plans/<audit>-<scope>-<date>.md` fix plan (`Status: Ready`), one
  step per finding (`Fix file:line — rule → fix`), so a separate implement step applies
  them. The audit run changes no app code.
- Re-scan fresh every run; never report from memory.
- If every scoped topic is clean, write no plan — just say so.

## Report-only variant

A topic can *describe* rather than *judge* — an inventory/map (e.g. "which tables are
clickable, and how"). Mark it `Output: report-only`: it prints its table to chat and
contributes nothing to the plan. Don't shoehorn a descriptive map into the
violation/plan format. If it's the only topic in scope, the run writes no plan.

## Why this shape

- **One skill, many rules** — users learn one entry point, not a dozen audit skills.
- **Progressive disclosure** — the orchestrator stays small; detail loads on demand, so a
  one-topic run doesn't pay for the other thirteen.
- **Plan, don't patch** — the audit (a read-only sweep) stays separate from the edit
  (an implement step), so findings are reviewable before anything changes.

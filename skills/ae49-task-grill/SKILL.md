---
name: ae49-task-grill
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. If the repo carries a domain model (CONTEXT.md / docs/adr/), also challenges the plan against the existing language and decisions and updates those docs inline. Use when the user wants to stress-test a plan, get grilled on their design, or mentions "grill me". For reviewing a finished PR, diff, or code change, use ae49-task-scrutinize instead.
---

# Grill

> *Adapted from [mattpocock/skills — productivity/grill-me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me) and [engineering/grill-with-docs](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs) by Matt Pocock ([MIT License](https://github.com/mattpocock/skills/blob/main/LICENSE)).*

<what-to-do>

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing.

If a question can be answered by exploring the codebase, explore the codebase instead.

**Risk-tiered question depth (user rule, 2026-07-22):** scale how much you probe the USER
(vs. settle by exploration) to the feature's risk tier.
- **Dial UP — always scenario-probe the user** when the feature touches money, permission /
  visibility boundaries (who can see or edit what), deleting or migrating real data, or
  external state (security rules, deploys, third-party messaging/email). Code cannot answer
  *intent* there, and a wrong assumption causes real harm.
- **Stay lean** for clones of an existing in-repo pattern ("same as X"), UI shape, and
  cosmetic work — explore the precedent, decide, and let the manual-test gate verify.
  Zero questions is a valid grill result when code answers every branch.

</what-to-do>

## Adapt to the repo

At the start of the session, check whether the repo carries a documented domain model:

- **No `CONTEXT.md` and no `docs/adr/`** → run a plain grilling session (the block above). Don't manufacture documentation the project hasn't opted into. Create a doc only if a decision clearly warrants it *and* the user agrees.
- **`CONTEXT.md` or `docs/adr/` present** → also run the doc-aware behaviour below: challenge the plan against the existing language and decisions, and update the docs inline as decisions crystallise.

<supporting-info>

## Domain awareness

During codebase exploration, also look for existing documentation:

### File structure

Most repos have a single context:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

If a `CONTEXT-MAP.md` exists at the root, the repo has multiple contexts. The map points to where each one lives:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Create files lazily — only when you have something to write. If no `CONTEXT.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update CONTEXT.md inline

When a term is resolved, update `CONTEXT.md` right there. Don't batch these up — capture them as they happen. Use the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

`CONTEXT.md` should be totally devoid of implementation details. Do not treat `CONTEXT.md` as a spec, a scratch pad, or a repository for implementation decisions. It is a glossary and nothing else.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).

</supporting-info>

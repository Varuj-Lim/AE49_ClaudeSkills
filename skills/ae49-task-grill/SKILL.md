---
name: ae49-task-grill
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when the user wants to stress-test a plan, get grilled on their design, or mentions "grill me". For reviewing a finished PR, diff, or code change, use ae49-task-scrutinize instead.
---

# Grill

> *Adapted from [mattpocock/skills — productivity/grill-me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me) and [engineering/grill-with-docs](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs) by Matt Pocock ([MIT License](https://github.com/mattpocock/skills/blob/main/LICENSE)).*

<what-to-do>

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask every question that is ready at once — up to 10 per message — and wait for the answers before
continuing (owner rule 2026-10-07, `ae49-ref-question-format` rule 3; replaces "one at a time").
A question whose options depend on another's answer waits for the next message.

**Every question is written in the shape of `ae49-ref-question-format` (owner rule 2026-10-01):**
context the owner can picture, options labelled a/b/c each
with how / pros / cons / cost, a recommendation with its reason, and how to answer — never a
compressed one-liner, even in caveman mode.

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

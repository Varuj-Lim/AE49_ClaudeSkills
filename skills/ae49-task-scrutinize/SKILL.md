---
name: ae49-task-scrutinize
description: "Questions whether a plan, design or change should exist at all and whether a smaller way reaches the same goal, then follows the real code path to test what it claims. Use on /ae49-task-scrutinize or when the owner asks for a second opinion, a sanity check, or \"is this the right approach\". A bug hunt over a diff is code-review; a finished build against its plan is the ae49-audit agent; a live design interview is ae49-task-grill."
---

# Scrutinize

Read the work as someone who did not write it. The first question is whether it should exist; the second is whether it
does what it says. This skill reports and plans. It does not edit app code.

## Steps, in order

**1. Purpose.** Write what the work is for in one sentence of your own. If that cannot be done, the work is underspecified:
say so and stop. Then look for a cheaper route: not doing it, something the codebase already has, a much smaller change
that covers most of the need, or the same fix at another layer. A better route found here is the most useful result, so it
leads the report. Skip this only when the owner says not to question the scope.

**2. Follow the path.** Start at the entry point and read through callers, branches, state changes and side effects, past
the edges of the diff, since faults tend to sit where new code meets old. For a plan, walk its flow against the system as it
is now and list what it assumes. Write down anything that surprises you.

**3. Test the claims.** For each claim, state the path and what you saw at its end, and whether the claim holds. Then ask:
- Which inputs or states break it: errors, retries, concurrent callers, empty or very large values, ordering?
- What does it change without saying: speed, error behaviour, other callers, stored shapes?
- Do its tests run this path, or do they pass around it?

Keep "the plan says" and "I traced and found" apart.

**4. Report** in the format of `ae49-ref-report-format`, the cheaper route first, then findings by severity, each citing
`file:line`. Say what you checked even when you find nothing, so the owner can judge the coverage. Leave out style remarks
when a structural problem exists.

**5. Fixes.** Ask which finding IDs to fix, then:
- **App code:** write a plan from `ae49-task-plan-feature`'s template, reusing the findings as its content, with Status
  `Ready`, Created and a complete Files to touch. Commit only that file and push the backup branch (no backup branch or
  remote: commit only, and say so), never the deploy branch (`web-ref-deploy-landing` §2). Main builds it later, because a
  direct edit could collide with a build on the same tree.
- **User-level files** (skills, config, docs): edit them directly and mirror them per `~/.claude/CLAUDE.md`.

Unsure which applies: ask.

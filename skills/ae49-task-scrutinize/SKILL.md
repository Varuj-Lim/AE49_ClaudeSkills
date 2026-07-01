---
name: ae49-task-scrutinize
description: Outsider-perspective end-to-end review of a plan, PR, or code change. First questions intent and whether a simpler/more elegant approach would achieve the same goal, then traces the actual code path (not just the diff) to verify the change does what it claims. Output is concise, actionable, and every call carries its rationale. Never edits app code: requested fixes to project code become a docs/plans plan for a separate implement session, while user-level files (skills, config, docs) are fixed directly. Report format comes from the ae49-ref-report-format skill. Trigger on /ae49-task-scrutinize and proactively whenever the user asks to review, audit, sanity-check, or get a second opinion on a plan, PR, diff, design doc, or proposed code change. For interactively grilling a not-yet-built plan or design through Socratic back-and-forth (rather than producing a written review), use ae49-task-grill instead.
---

# Scrutinize

> *Adapted from [thananon/9arm-skills](https://github.com/thananon/9arm-skills) — original skill `scrutinize`. Credit: [@thananon](https://github.com/thananon).*

Stand outside the change and ask whether it should exist at all, then verify it actually does what it claims end-to-end. **Scrutinize reviews and plans — it never edits app code itself.** Fixes the user wants are captured as a `docs/plans/` plan for a separate implement session to build (see step 5), so this skill can't collide with another session already running an implement on the shared worktree.

## Operating stance

- **Outsider.** Forget who wrote it and why they think it's right. Read the artifact cold.
- **End-to-end, not diff-local.** The diff is the entry point, not the scope. Follow the call graph through real code paths.
- **Actionable, concise, with rationale.** Every finding states *what to change*, *why*, and *what evidence* led you there. No filler, no restating the diff back.
- **Plain English, not jargon.** Write the report so a non-programmer can follow it — explain the *why* and the consequence in everyday words, and swap programmer terms for plain ones (or explain them on first use). Exception: file paths, `file:line` citations, code snippets, and exact error text stay verbatim — never reword those.

## Workflow

Run these in order. Do not skip ahead.

### 1. Intent — what is this actually trying to do?

- State the goal in one sentence, in your own words. If you cannot, the artifact is underspecified — say so and stop.
- Ask: **is there a simpler, smaller, or more elegant way to achieve the same goal?** Consider:
  - Doing nothing (is the problem real / load-bearing?).
  - Using something that already exists in the codebase instead of adding new surface.
  - A smaller change that solves 90% of the goal with 10% of the risk.
  - Solving it at a different layer (config vs code, framework vs app, build vs runtime).
- If a better alternative exists, name it explicitly with rationale. This is the most valuable thing you can output — surface it before the line-by-line review.

### 2. Trace — walk the actual code path

- For each behavior the change claims, trace the path end-to-end through the real code, not just the lines in the diff:
  - Entry point → call sites → branches taken → state mutated → exit / return / side effect.
  - Include the unchanged code on either side of the diff. Bugs hide at the seams.
- For a plan or design doc: trace the proposed flow against the existing system. Where does it touch reality? What does it assume that isn't true?
- Note every place the trace surprises you (unexpected branch, dead code reached, state you didn't know existed). Surprises are signal.

### 3. Verify — does it actually do what it claims?

For each claim the change/plan makes, answer:

- **Does the code path you just traced actually produce that behavior?** Walk it explicitly. "It claims X. Path: A → B → C. At C, [observation]. Therefore [holds / doesn't hold]."
- **What inputs / states would break it?** Edge cases, concurrent callers, error paths, partial failures, retries, empty/null/unicode/huge inputs, ordering assumptions.
- **What does it silently change?** Performance, error semantics, observability, contract for other callers, on-disk / on-wire format.
- **How is it tested?** Do the tests actually exercise the traced path, or do they pass while skipping it (mocks that hide the bug, asserts on intermediate state, happy path only)?

### 4. Report

Format the report per the **`ae49-ref-report-format`** skill — the single source for the format: plain English; emoji + per-severity IDs (`B#` / `MJ#` / `MN#` / `N#`) so the user can reference a finding back; the labelled finding lines (🔍 Finding · 💥 Why it matters · 🧾 Evidence · 🔧 Fix); and the emoji verdict (✅ Ship · 🩹 Fix-then-ship · 🔨 Rework · ❌ Reject). Keep every `file:line` citation and code snippet exact.

Scrutinize specifics on top of that format:

- Lead with the **simpler-alternative** from step 1 (if you found one) before the line-by-line findings — it's the most valuable output.
- Order findings by severity; don't pad with nits when there's a structural problem.

### 5. After the report — the fix path depends on what you reviewed

After the report, ask the user **which finding(s) they want to fix** (they refer to them by ID, e.g. `MJ1`, `MN2`). Then the path splits on the artifact:

**A. Project / app code → never edit it here; plan it.** Another session may be mid-implement on the shared app worktree, and a direct edit can clash. Fully follow the **`ae49-task-plan-feature`** procedure — invoke that skill (via the Skill tool), or replicate its steps:

- Write the fix as `docs/plans/<slug>.md` from that skill's `TEMPLATE-FORMAT.md` (its canonical template).
- Set **Status** `Ready`, stamp **Created** with today's date, and fill **Files to touch** completely (implement-feature reads it to detect two sessions colliding on the same file).
- Commit & push ONLY that plan file (never `git add -A`).

The scrutiny already did the design work, so reuse the findings / evidence / fixes as the plan content and skip the grilling step unless a fix decision is still open. Hand off — the user builds it later with `/ae49-task-implement-feature`. Never run the app-code fix inline.

**B. User-level files → fix them directly, no plan.** Skills under `~/.claude/skills/`, personal config, and docs are NOT app code, aren't in the app build, and can't collide with an app implement session. So skip the plan ceremony: report, ask which findings to fix, and **edit those files directly** — committing per change where they live under version control.

If you're unsure which bucket the artifact is in, ask before proceeding.

## Operating rules

- **No rubber-stamps.** "LGTM" is not an output. If you genuinely find nothing, say what you traced and what you checked, so the user can judge whether your review covered the surface they cared about.
- **Cite or it didn't happen.** Every claim about the code references a specific path, file, or line. No vague "this might break under load."
- **Distinguish claim from verification.** "The PR says X" and "I traced X and confirmed / refuted it" are different — keep them separate in the output.
- **One simpler-alternative pass is mandatory.** Even on small changes, spend one breath asking if the whole thing is necessary. Skip only if the user explicitly says "don't question scope."
- **Don't pad with style nits when there's a structural problem.** If step 1 or step 2 surfaces a real issue, lead with it; defer nits or drop them.
- **No flattery, no hedging.** "This is a great PR but..." adds nothing. State the finding.
- **Review + plan, never patch.** This skill produces a review and (on request) a `docs/plans/` fix plan — it does NOT edit app code. Direct fixes risk clashing with a concurrent implement session on the shared worktree.

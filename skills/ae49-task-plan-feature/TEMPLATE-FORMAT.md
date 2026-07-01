# Plan: <feature>

**Status:** Ready <!-- Ready | In progress | On hold | Done -->
**Created:** <YYYY-MM-DD>

## Plain-language summary
<!-- No jargon, no file paths — written for the user, not a developer. This is
     shown back to the user twice: once here to confirm before the plan is
     committed, and again by implement-feature right after they pick this plan
     to build. Keep it accurate if the plan changes later. -->
**What changes:** <1-2 plain-English sentences on what gets built/changed>
**After this is done:** <1-2 plain-English sentences on what's different for the user>

## Context
Why this change — the problem or need, what prompted it, the intended outcome.

## Success criteria
- [ ] Verifiable outcome 1
- [ ] Verifiable outcome 2

## Steps
1. [ ] <step> → verify: <check>
2. [ ] <step> → verify: <check>

## Files to touch
<!-- Complete list — implement-feature compares these paths across In-progress plans to
     catch two sessions editing the same file. List EVERY file you create or modify, one
     backtick-wrapped path per bullet. Files you deliberately leave alone go on a
     "NO changes:" bullet so they're excluded from the check. -->
- `path/to/file` — what changes

## Reuse
Existing helpers / components / patterns to reuse (with paths) instead of writing new.

## Out of scope
- <thing deliberately not done>

## Open questions
- <unresolved question for the user>

## Verification
How to test end-to-end — run the app, exercise the flow, run typecheck
(`npx tsc --noEmit`), and check the changed routes.

# Plan: <feature>

**Status:** Ready <!-- Ready | In progress | On hold | Done -->
**Created:** <YYYY-MM-DD>
**Branch:** <prefix>/<slug> <!-- Pick the prefix by change type: feature/ (new
     capability) · bugfix/ (fix) · refactor/ (restructure, no behavior change). slug =
     this plan file's slug (the filename without .md). Use a bare `—` when the change is
     built directly on main (the tiny-fix fast path or a bootstrap that can't ride the
     PR flow). The integrate/implement skills match the pattern (feature|bugfix|refactor)/<slug>. -->
**After:** — <!-- Build-order chain, filled by plan-feature's wiring step (do NOT hand-set).
     Comma-separated slugs of the undone plans this one shares a file with and must build
     AFTER; bare `—` when it overlaps nothing. `/ae49-task-integrate` reads these edges to
     derive the live chain display (A1 → A2 → A3.1/A3.2) and to block a plan whose
     predecessor hasn't merged. Only edges are stored here — never the letters/levels. -->

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

## Risks
<!-- What could go wrong when this is built or shipped, and the guard for each.
     Keep it signal, not boilerplate — on a small plan, `- None beyond standard` is a
     complete, valid answer. Prose only for real hazards (data loss, irreversible
     migration, prod-only failure modes, shared-file collisions). -->
- <risk> → <guard / mitigation>

## Edge cases
<!-- Boundary inputs / unusual states this design must handle correctly (empty,
     missing, duplicate, concurrent, permission-denied, first-run…). On a small plan,
     `- None beyond standard` is a complete, valid answer. -->
- <edge case> → <expected behavior>

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

## Rollback strategy
<!-- How to undo this if it breaks production after merge. On most plans the standard
     recipe covers it, so `Standard — see CLAUDE.md recipe` is a complete, valid answer
     (App Hosting rollout roll-back → `git revert <sha>` + push; never reset --hard /
     force-push main). Write prose ONLY for deviations that the standard recipe does not
     cover — e.g. a Firestore schema change, storage-rule change, or a new secret that
     also needs manual reversal. -->
Standard — see CLAUDE.md recipe

## Verification
How to test end-to-end — run the app, exercise the flow, run typecheck
(`npx tsc --noEmit`), and check the changed routes.

## Testing checklist
<!-- Plain, numbered click-through steps for the USER (not the build session) to
     follow after the feature is built, to confirm it works. No jargon, no file
     paths — same audience as the Plain-language summary. implement-feature reads
     this back to the user as part of its final report. -->
1. [ ] <do this in the app> → you should see <this>
2. [ ] <do this in the app> → you should see <this>

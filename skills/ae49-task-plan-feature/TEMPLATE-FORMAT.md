# Plan: <feature>

**Status:** Ready <!-- Ready | In progress | On hold | Done. Main sets Done and moves
     the file to docs/plans/done/ after the squash-merge, then removes the agent
     worktree. -->
**Created:** <YYYY-MM-DD>
**Branch:** <prefix>/<slug> <!-- Pick the prefix by change type: feature/ (new
     capability) · bugfix/ (fix) · refactor/ (restructure, no behavior change). slug =
     this plan file's slug (the filename without .md). Main creates this branch AFTER
     the user signs off on the build — ae49-implement never branches. A bare `—` no
     longer exempts a plan from anything; it just signals a tiny fix Main may land
     straight on main. -->
**After:** — <!-- Build-order chain, set by the ae49-plan agent from the file-footprint
     overlap (do NOT hand-set). Comma-separated slugs of the undone plans this one shares
     a file with and must build AFTER; bare `—` when it overlaps nothing. Main reads these
     edges into a DAG: independent chains get parallel ae49-implement worktrees; a chained
     plan is not dispatched until its predecessors have merged. Only edges are stored
     here — never the letters/levels. -->

## Plain-language summary
<!-- No jargon, no file paths — written for the user, not a developer. Main shows
     this to the user during the grill, and again when it reports the finished build
     before the manual-test gate. Keep it accurate if the plan changes later. -->
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
<!-- Complete list — this is the plan's file footprint. ae49-plan compares it against
     every other undone plan to set `After:`, and Main uses those edges to decide what
     builds in parallel. An omission here causes two worktrees to collide on merge. List
     EVERY file you create or modify, one backtick-wrapped path per bullet. Files you
     deliberately leave alone go on a "NO changes:" bullet so they're excluded from the
     check. -->
- `path/to/file` — what changes

## Reuse
Existing helpers / components / patterns to reuse (with paths) instead of writing new.

## Out of scope
- <thing deliberately not done>

## Open questions
- <unresolved question for the user>

## Rollback strategy
<!-- How to undo this if it breaks production after merge. Standard = revert the merge
     commit on main (`git revert <sha>` + push, which App Hosting redeploys); never
     reset --hard or force-push main. `Standard` is a complete, valid answer. Write prose
     ONLY for deviations — Firestore schema change, storage/firestore rules change (those
     need a separate `npx firebase-tools deploy --only firestore:rules`), or a new secret
     needing manual reversal. -->
Standard

## Verification
How to test end-to-end — run the app, exercise the flow, run typecheck
(`npx tsc --noEmit`), and check the changed routes.

## Testing checklist
<!-- MANDATORY — never empty, never "none". There is no docs/TESTING.md any more; this
     section is the project's ONLY testing artefact. Plain, numbered click-through steps
     for the USER (not the build session), no jargon, no file paths — same audience as
     the Plain-language summary. ae49-implement quotes this section **verbatim** in its
     final report, and Main hands it straight to the user for the manual-test gate. -->
1. [ ] <do this in the app> → you should see <this>
2. [ ] <do this in the app> → you should see <this>

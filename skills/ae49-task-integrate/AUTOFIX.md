# AUTOFIX — dispatch review findings to the branch's build folder

> Loaded on demand by the `merge <PR#>` operation (OPERATIONS.md step c) when a review
> leaves fixable findings and the user opts into the auto-fix loop. It automates the
> hand-off that a human otherwise carries by hand: findings → build folder → build session
> implements + pushes → merge re-enters at the preview. **It never skips a gate** — the
> `:3000` Phase-1 preview and the user's confirmation in step f/g still run exactly as
> before. Auto-fix changes only *how the branch reaches* the preview.

## When it runs

After step c's `/code-review`, when there are findings worth fixing. It is **opt-in** and
**never the default** — step c offers it as one of three buttons and only proceeds here if
the user picks *dispatch*. On DIRECT_TO_MAIN merges (no build-folder pool) it does not apply.

## Invariants (must hold — same safety contract as the manual flow)

1. The Phase-1 `:3000` preview and the user's confirmation are **never skipped**. A blocker
   is **never auto-cleared** — only a re-review over the actually-pushed code downgrades it.
2. **One writer per branch.** Only the build folder that already owns the PR's branch is
   written to. If a human build session is active on it, dispatch **asks** before proceeding.
3. The **Merge session never writes feature code** and never commits in the hub. The fix is
   built in the build folder, by a build session — consistent with the golden rules.
4. Only **`auto`-class** findings are dispatched. `decision`-class findings (a trade-off, an
   auth/deploy/data-model policy, anything the review phrased as a question or "your call")
   **always stay human-owned** and keep the PR blocked until the user resolves them.

## Step c-1 — emit the findings artifact

`/code-review` posts inline PR comments but cannot emit a machine file (it is a built-in
skill). So the **Merge session** writes the artifact itself from the review it just ran:
capture each finding's id / severity / file / line / summary / fix, and **classify** it:

- `auto` — mechanical and self-contained: a missing aggregation, a dropped guard, a wrong
  sort direction, duplicated code, a missing null-check, a convention fix. Safe for a build
  session to implement without a human decision.
- `decision` — names a trade-off, asks a question, says "your call", or touches
  auth / deploy / data-model / security policy. **Never dispatched.**
- `wontfix-candidate` — the review suspects it's intended / out of scope; the human confirms.

When unsure, mark `decision` — err toward keeping the human in the loop. Write the artifact to
the branch's build folder (the one on `<prefix>/<slug>`), git-ignored so it never commits:

```
<buildN>/.review/pr-<PR#>.json
```

Schema:
```jsonc
{
  "pr": 6,
  "branch": "feature/<slug>",
  "reviewedSha": "<origin/<branch> head at review time>",
  "findings": [
    { "id": "B1", "severity": "blocker", "class": "auto",
      "file": "lib/services/x.ts", "line": 171,
      "summary": "…", "fix": "…", "outcome": null }
  ]
}
```

`.review/` must be in the build folder's local git exclude (add `\.review/` to
`<buildN>/.git/info/exclude` once, alongside the existing `dev.cmd` exclude from `init`).

## Step c-2 — offer the dispatch (the opt-in gate)

Present an `AskUserQuestion` after review. Options (cap to what's actionable):

- **`Dispatch N auto-fixes to buildN`** — only shown when ≥1 `auto`-class finding exists.
  Sends `blocker`+`major` `auto` findings by default; a `dispatch --all` variant includes
  minor/nit.
- **`I'll fix-forward manually`** — the existing behavior: leave the PR blocked, human drives
  the build window by hand.
- **`Merge anyway`** — only offered when there are **no** blockers and no unresolved
  `decision` findings.

If any `decision`-class finding exists, say so plainly and note it stays blocked regardless of
the pick — it needs the user, not a build session.

**Two-writer preflight before dispatching:** the target `<buildN>` must be the folder on
`<prefix>/<slug>` and be idle (no active build session mid-edit — check `git -C "<buildN>"
status --porcelain` is clean and its branch matches). If a build session looks active, ask
before overwriting `.review/`.

## Step c-3 — the build session implements

Dispatch drops `pr-<PR#>.json` into `<buildN>/.review/` and tells the user (plain words) to
run, in the **buildN window**:

```
/ae49-task-implement-feature --from-review
```

That skill's **FROM-REVIEW** mode reads the artifact, implements each `auto` finding, commits
+ pushes per finding-group, and writes results back to `<buildN>/.review/pr-<PR#>.results.json`
(same schema, each `outcome` ∈ `fixed | needs-human | wontfix`). CI re-runs on the pushed
branch. *(Tier-2, optional: a build window running `Monitor` on `.review/` can auto-start this;
or, if a cross-session message tool is available, dispatch can ping the build session. Neither
is required — the file-drop is the portable core.)*

## Step c-4 — merge re-entry (after the build pushes)

The user re-runs `merge <PR#>` (or an auto-watching merge resumes). On re-entry, before
Phase 1:

1. Read `<buildN>/.review/pr-<PR#>.results.json`. Missing / partial ⇒ treat absent outcomes
   as `needs-human` (the build errored mid-run).
2. **Any `needs-human`?** → **STOP** before the preview. Re-post those findings as PR comments
   tagged `needs-human` (the build session already should have), keep `blocked`, and report the
   open items. The user does what they do today: manual fix-forward, accept-and-merge noting
   the finding, or `abandon`. **The blocker set is never auto-cleared here.**
3. **`wontfix` outcomes** → surface each with its one-line rationale for the user to accept or
   override. An accepted `wontfix` does not block; an overridden one goes back through dispatch.
4. **All `auto` findings `fixed`** → run a **quick re-review of the fix diff only** (`git -C
   "<hub>" diff <reviewedSha>..origin/<branch>` through `/code-review`, or a scoped verify) to
   confirm the fixes landed and introduced nothing new. New findings re-enter this loop.
5. Then continue to **step f (Phase-1 preview)** exactly as the manual flow — CI must be green
   (step b re-checks), the squash-preview goes up on `:3000`, and **you wait for the user's
   confirmation** before step g deploys. Nothing about the gate changes.

On a clean pass, delete the consumed `.review/pr-<PR#>.*.json` files from the build folder so a
stale artifact can't mislead a later run (the `reviewedSha` guard also protects against this).

## Failure & edge cases

- **Build session errored** → results missing → step c-4.1 treats as `needs-human`, STOP.
- **CI red after the fix push** → normal red-CI STOP at step b; `blocked` stays.
- **Fix introduced a new problem** → caught by the step c-4.4 fix-diff re-review; re-enters.
- **`origin/main` moved while fixing** → the existing Phase-2 base re-check (step g) handles it.
- **Stale artifact** → `reviewedSha` in the file must match the branch head `--from-review` is
  about to fix; mismatch ⇒ the build session refuses and asks for a fresh dispatch.

# Design: auto-fix loop for `/ae49-task-integrate merge`

**Status:** Draft for review
**Author:** Main Merge session
**Scope:** the user-level `ae49-task-integrate` skill (and a small hook into `code-review` and `ae49-task-implement-feature`). Not a NuriHub code change.

---

## 1. Goal

Close the loop that a human currently carries by hand. Today, when `merge <PR#>` finds
problems, the human reads the PR comments, walks to the build window, tells the build
session what to fix, waits, then comes back and re-runs `merge`. This design automates the
**hand-off of findings into the build session** and the **round-trip back to the gate**,
while keeping the one thing that must never be automated: the human's eyeball on the live
`:3000` preview before anything deploys.

**One-line summary of the change:** review → *dispatch confirmed findings to the branch's
build folder* → build session implements + pushes → CI re-runs → merge re-enters at the
Phase-1 preview → human confirms → deploy. The auto-fix step replaces the manual courier,
not any gate.

---

## 2. The load-bearing constraint

The ae49 team workflow runs as **independent Claude Code windows** (separate OS processes),
one **writer per branch**, using only portable `git` + `gh` — deliberately **no git
worktrees** (they collide with the desktop app and Turbopack). There is **no robust,
portable way for one window to push work into another window's process**. So "automatically
send findings to a build session" cannot mean an in-process RPC. It must mean:

> The Merge session writes the findings to a **durable location the build session can read**,
> and the build session **pulls** them.

Because the build folder that owns the branch sits on the **same machine** as the hub, the
Merge session can write a file straight into it (`<buildN>/.review/…`). That is genuine
automatic delivery — no copy-paste — even though the build session still pulls rather than
being pushed to.

### Architectural fork (resolved)

| | **A. Multi-window (recommended)** | **B. Single-session subagent** |
|---|---|---|
| Who builds the fix | the existing Build window on the branch | a subagent the Merge session spawns |
| Delivery | findings file dropped in `<buildN>/.review/` | in-memory, straight to the subagent |
| Automation | build session pulls + implements | fully automatic, one command |
| Fits ae49 rules | yes (one writer/branch, no worktree) | **no** — Merge session would write feature code; needs a worktree or borrows the build folder → two-writer risk |
| Your framing matches | **yes** ("a build session", "Merge session") | no |

Your description names "a build session" and "the Merge session" as distinct — that is
model A, the existing architecture. **This document designs model A** and treats B as a
documented alternative in §9.

---

## 3. Resolved decisions (your four questions)

### Q1 — How are findings packaged and sent?

**Recommendation: a structured `findings.json` artifact, delivered by dropping it into the
claimed build folder; PR inline comments remain the human-readable mirror.**

- `code-review` **already** posts inline PR comments (`--comment`). It gains one addition: it
  also writes a machine-readable `findings.json` (schema in §5) to a known path.
- `merge` copies that artifact into the build folder that owns the PR's branch, at
  `<buildN>/.review/pr-<PR#>.json` (git-ignored — never committed).
- The build session reads it via a new `ae49-task-implement-feature --from-review` mode.

**Why not the alternatives:**
- *Skill args / CLI string* — findings are large and structured (severity, file, line, fix,
  class); a positional arg can't carry them without escaping pain and truncation.
- *A committed findings file on the branch* — pollutes the PR history and the eventual
  squash; review data shouldn't live in the product's git log.
- *PR comments as the ONLY transport* — they're the right human surface, but parsing markdown
  back into structured intent is lossy. Keep them as the mirror, make JSON the machine channel.
  (`gh pr view --json comments` stays available as a fallback if the file is missing.)

### Q2 — Auto-commit, or leave staged for review?

**Recommendation: the build session commits and pushes (updates the PR). It does *not* leave
changes staged-only.**

Independent windows/processes do not share a working tree — a staged-but-uncommitted change
in the build folder is **invisible** to the Merge session, so "staged for user review" cannot
be reviewed from the gate. The review surface that already exists and works is the **PR + CI +
the `:3000` Phase-1 preview**. So the build pushes, CI re-runs, and the human reviews the
*result* at the preview, exactly as today.

Granularity: one commit per finding-group (mirrors the existing "commit per logical change"
rule), messages referencing the finding IDs (`fix: MJ1 stock clobber (#6)`).

*(In model B only, staged-only is viable because it's one session — noted in §9.)*

### Q3 — What if the build session fails or can't auto-fix something?

**Recommendation: every finding ends in one of three states, and anything not `fixed` blocks
the merge and is surfaced back — never silently dropped, never merged around.**

| Outcome | Meaning | Effect |
|---|---|---|
| `fixed` | implemented + pushed | clears on the re-review pass |
| `needs-human` | build tried, uncertain / needs a decision / a test failed | re-posted as a PR comment tagged `needs-human`; `blocked` label stays |
| `wontfix` | build judges it intended / out of scope | re-posted with a one-line rationale for the human to accept or override |

The build session writes a `results.json` (same schema + `outcome`) back to `.review/`, and
`merge` reads it on re-entry. If **any** finding is `needs-human`, or the build session errored
outright, `merge` **stops before the preview** and reports the open items. The human then does
what they do today: fix-forward manually, accept-and-merge noting the finding, or `abandon`.
The blocker set can never be auto-cleared by the build session alone.

### Q4 — Optional, or default?

**Recommendation: opt-in, offered as a button after review — never the default. And even when
opted in, only `auto`-class findings are dispatched; `decision`-class findings always stop for
the human.**

Rationale, straight from today's runs: a large share of real findings are **not safe to
auto-implement** — PR #5's revocation model was a design decision, several PR #6 findings were
"intended, document it," and deploy-ops findings (create a Secret Manager secret) are human
actions a build session literally cannot perform. Auto-fix-**and**-merge as default behavior
would ship those wrong. So:

- `merge` classifies each finding `auto | decision | wontfix-candidate` during review.
- After review it offers: **`dispatch fixes to buildN`** · `I'll fix-forward manually` ·
  `merge anyway (no blockers)`.
- Choosing dispatch sends only `auto`-class findings. `decision`-class always remain
  human-owned and keep the PR blocked until resolved.

---

## 4. Data flow

```
 MERGE SESSION (hub, one only)                 BUILD SESSION (buildN, owns the branch)
 ─────────────────────────────                 ────────────────────────────────────────
 merge <PR#>
   ├─ preflight + CI green
   ├─ /code-review --comment
   │     ├─ posts inline PR comments
   │     └─ writes findings.json  ─────────┐
   ├─ classify auto|decision|wontfix        │
   ├─ ANY blocker? → label 'blocked'        │
   └─ prompt: [dispatch fixes to buildN]    │
         │ (user opts in)                   │
         ▼                                  ▼
   copy findings.json ───────────────►  <buildN>/.review/pr-<#>.json
   (auto-class only)                        │
                                            ▼
                                     /ae49-task-implement-feature --from-review
                                       ├─ reads .review/pr-<#>.json
                                       ├─ implements each 'auto' finding
                                       ├─ commit + push (per finding-group)
                                       ├─ writes results.json (fixed|needs-human|wontfix)
                                       └─ CI re-runs on the pushed branch
         ┌──────────────────────────────────┘
         ▼
   merge <PR#>            (human re-enters, or auto-resumes if watching)
   ├─ read results.json
   ├─ any needs-human? → STOP, report open items, stay 'blocked'
   ├─ else optional quick re-review of the fix diff  ← "verify findings addressed"
   ├─ Phase 1: squash-preview on :3000
   ├─ WAIT for human confirmation           ◄── the gate that never auto-clears
   └─ Phase 2: real squash-merge = deploy → archive plan
```

**Tier-2 (optional) full automation:** a running build window can `Monitor` the `.review/`
folder and auto-start `--from-review` when a new findings file lands, so the human doesn't even
switch windows. If the SDK's cross-session message tool is present, `merge` can additionally
ping the build session to start. Both are enhancements layered on the portable file-drop core —
neither is required for the workflow to function.

---

## 5. The findings artifact (schema)

`code-review` emits this; `implement --from-review` consumes it; `merge` reads the results
mirror. One file per PR.

```jsonc
{
  "pr": 6,
  "branch": "feature/sales-order-warehouse-selection",
  "reviewedSha": "a04bdeb…",
  "generatedAt": "2026-07-18T…Z",
  "findings": [
    {
      "id": "B1",
      "severity": "blocker",          // blocker | major | minor | nit
      "class": "auto",                // auto | decision | wontfix-candidate
      "file": "lib/services/salesOrderService.ts",
      "line": 171,
      "summary": "same-product lines clobber global stock",
      "fix": "aggregate global deltas per product before writing",
      "outcome": null                 // build writes: fixed | needs-human | wontfix
    }
  ]
}
```

- `class` is the auto-fix gate. Heuristic for `decision`: the finding text asks a question,
  names a trade-off, says "your call", or touches auth/deploy/data-model policy. Everything
  mechanical (missing aggregation, dropped guard, dup code, wrong sort direction) is `auto`.
  When unsure, mark `decision` — err toward keeping the human in the loop.
- `outcome` is null on dispatch; the build session fills it in `results.json`.

---

## 6. Invariants preserved (the safety contract)

These must hold no matter what the auto-fix loop does:

1. **The `:3000` Phase-1 preview and the human confirmation are never skipped.** Auto-fix
   changes *how the branch reaches* the preview, not the preview itself.
2. **One writer per branch.** Only the build folder that owns the branch is written to. If a
   human build window is already open on it, dispatch refuses (or asks) rather than racing.
3. **The Merge session never writes feature code** and never commits in the hub — the fix is
   built in the build folder, consistent with the existing golden rules.
4. **No blocker is ever auto-cleared.** Only a re-review pass over the actually-pushed code
   downgrades a finding; the build session asserting "fixed" is a claim to be verified, not a
   pass.
5. **Exactly one Merge session** still runs `merge`. Dispatch is issued from it but executes
   in the build folder.

---

## 7. Failure & edge cases

- **Build session errors mid-fix** → `results.json` missing or partial; `merge` treats absent
  outcomes as `needs-human`, stops, reports.
- **CI goes red after the fix push** → normal red-CI stop at the existing step (b); `blocked`
  stays.
- **Fix introduces a new problem** → caught by the optional re-review of the fix diff (the
  "verify the fixes" pass this session has been doing by hand); new findings re-enter the loop.
- **`origin/main` moved while fixing** → the existing Phase-2 base-re-check already handles this;
  the branch is rebased/re-previewed, unchanged by this design.
- **Two-writer collision** (human opened the build window too) → dispatch preflight checks the
  folder is idle/clean before dropping findings; if busy, it asks.
- **Findings file drift** (stale from a previous review) → `pr-<#>.json` carries `reviewedSha`;
  `--from-review` refuses if it doesn't match the branch head it's about to fix.

---

## 8. Implementation strategy (phased, each shippable alone)

1. **`code-review` emits `findings.json`** alongside the inline comments (+ the `class`
   tagging). Pure addition; nothing else changes yet. Immediately useful on its own.
2. **`ae49-task-implement-feature --from-review`** — reads a findings file, implements
   `auto`-class items, commits/pushes, writes `results.json`. Runnable manually by a human who
   copies the file over — proves the build half before any automation.
3. **`merge` dispatch step** — the post-review button that copies the artifact into `<buildN>`
   and the re-entry logic that reads `results.json` and gates on `needs-human`. This is the
   piece that closes the loop.
4. **(Optional) Tier-2 automation** — build-window `Monitor` auto-start and/or cross-session
   ping. Layered on; skip if not wanted.

Phases 1–2 have value without 3, so this can land incrementally and be tested at each step.

---

## 9. Alternative: model B (single-session subagent)

If you'd rather have *true one-command* auto-fix and accept the architectural cost: `merge`
spawns a subagent that operates in the branch's build folder via `git -C`, implements the
`auto` findings, commits, pushes — no second window, no findings file, in-memory hand-off.
Same gates afterward (preview + confirm). Cost: the Merge session is now effectively driving a
build, which strains "the Merge session owns main and doesn't build features," and it only
works when no human build window is open on that branch (single-writer). Recommended only if
the fully-manual courier step is the specific pain you want gone and you're willing to relax
that separation. The two models can coexist — B as a `--inline` flag on dispatch.

---

## 10. Open decisions for you

1. **Model A (multi-window, recommended) vs B (subagent `--inline`)** — or both, with A default.
2. **Auto-fix scope:** dispatch only `blocker`+`major` `auto`-class, or all severities incl.
   nits? (Recommend: default blocker+major; `--all` to include the rest.)
3. **Re-review after fix:** always run the quick fix-diff verification before the preview, or
   only on request? (Recommend: always — it's cheap and it's exactly what caught the round-2
   regressions this session.)
4. **Where should this design + the eventual skill changes live** — the `AE49_ClaudeSkills`
   repo (so the sync picks them up), or edited in place under `~/.claude/skills/`?
```

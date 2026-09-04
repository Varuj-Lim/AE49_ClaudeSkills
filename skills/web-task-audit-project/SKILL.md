---
name: web-task-audit-project
description: >-
  Canon PROCESS for a hub project's whole-codebase pattern audit — works in any
  project (AE49_Hub, Nuri_Hub, future siblings). The project supplies the FACTS
  in its own `<proj>-task-audit-project` skill: a numbered topic table with
  keywords, a `topics/NN-*.md` rule+detector file per topic, and a phase
  grouping; this skill supplies everything else: scope/menu parsing, the PHASED
  execution rule (any scope over 6 topics runs one phase per context with a disk
  checkpoint after each phase, so a long audit cannot die of token exhaustion —
  origin 2026-09-04, a 29-topic sweep ran out mid-audit), resume-from-marker,
  router-mode fan-out (one read-only sub-agent per phase), the report format
  (ae49-ref-report-format) and the docs/plans fix-plan output for the impl lane.
  Use when the user asks to audit the project, audit patterns, check
  consistency, or "sweep the app" in ANY repo; the project facts skill triggers
  this canon instead of restating it. Audits edit no app code and re-scan
  current code each run — never report from memory.
---

# Project Pattern Audit — canon process

## Why this exists

Hub projects grow page by page and their codified conventions drift. Each
project keeps its OWN rulebook (topic files with rule + detector), because the
component names and rules genuinely differ per repo — but the way an audit RUNS
is identical everywhere, so the process lives once, here (rule 2026-08-28:
facts per project, process in user skills).

**It's a plan session: findings become a `docs/plans/` fix plan and the audit
changes no app code** — the router's `impl:` lane applies fixes later.

## The facts contract (what the project's skill must provide)

The current repo's `.claude/skills/<proj>-task-audit-project/` holds:

1. **The topic table** — `# | Topic | Keywords | Reference file`, numbered, in
   the SKILL.md. Keywords feed scope matching; numbers are stable IDs.
2. **One `topics/NN-*.md` per topic** — that topic's rule, detector
   (grep/read recipe), exclusions, and an `Output:` line (`plan` = findings go
   to the fix plan; `report-only` = prints an inventory, never judged, never in
   a plan).
3. **A `## Phases` grouping table** — thematic groups of topics for the phased
   run. If the project has not declared one, fall back to numeric-order chunks
   of at most 5 topics.

**A project with NO audit facts skill yet:** say so plainly, and offer to
scaffold one — topic stubs mapped from that project's `*-ref-*` skills (each
ref rule is a natural topic), detectors written IN THAT PROJECT'S own session
where its code can be read. Never audit from a sibling project's rulebook.

## Scope (argument parsing)

Read `$ARGUMENTS` first:

- **Argument given** → match each token (case-insensitive) against the
  project's keyword table; a bare number selects that topic; `all` runs every
  topic. A token matching nothing → say which, re-show the menu, ask again.
- **No argument** → print the project's topic table as a menu and ASK which
  topics to audit (numbers/keywords space-separated, or `ALL`). WAIT before
  scanning.
- `--fresh` anywhere in the arguments → discard today's draft and start over
  (see Resume).

`<scope>` (`full`, or the joined topic keywords) names the plan file, the chat
header, and the "Clean topics" line.

## Process

1. Determine scope (above).
2. **Decide the run shape:** ≤ 6 topics → single pass. MORE than 6 → **PHASED
   run** (next section). Never scan more than one phase's topics in one
   context.
3. Per in-scope topic, **Read its `topics/NN-*.md`** — only the in-scope files
   (in a phased run: only the CURRENT phase's).
4. Re-scan the code fresh (Grep/Read) per the topic's detector. Never trust a
   previous audit or memory.
5. Record per finding: file:line, rule broken, concrete fix, topic number,
   priority (🔴 HIGH = user-visible, 🟡 LOW = cosmetic drift).
6. Report per **`ae49-ref-report-format`** — the leading number is the
   finding's ID; HIGH before LOW; one line per clean topic. Optionally let the
   user drop findings before the plan is finalized.
7. Output: `plan` topics with findings → the fix plan below; all clean → say so
   and write NO plan; `report-only` topics → print their inventory to chat and
   never put them in a plan.

## Phases (any scope over 6 topics — always for ALL)

**Why: one 29-topic context ran out of tokens mid-audit (2026-09-04) and lost
everything scanned.** Structural fix, not "be brief":

- **One phase per context.** Use the project's `## Phases` grouping; skip
  phases with no in-scope topic. No grouping declared → numeric chunks of ≤ 5.
- **The checkpoint file is the plan draft itself**, written from phase 1:
  `docs/plans/audit-<scope>-<YYYY-MM-DD>.md`, headed `**Status:** Draft — audit
  in progress`, with a marker line kept at the top:
  `<!-- AUDIT-PHASES done: P1,P2 -->`.
- **After EACH phase:** append that phase's findings to the draft (IDs continue
  from the file's current count — unique across phases), update the marker,
  post the phase's findings to chat. Hold nothing in memory between phases.
- **Resume:** invoked again on the same scope while today's draft exists → read
  the marker, announce which phases are done, continue from the first missing
  one. Draft findings are NOT re-verified here (the plan's own Step 1
  re-verifies at fix time). `--fresh` discards the draft.
- **Router mode (the real token fix):** when a Main session orchestrates, each
  phase SHOULD be its own read-only sub-agent dispatch (fresh context per
  phase) — the dispatch names the phase's topic files, the agent returns that
  phase's findings in the report format, Main appends to the draft + marker.
  Sequential same-session phases are the fallback for a direct run.
- **At the end:** rewrite the header to `**Status:** Ready`, drop the marker,
  finish per Plan output, and post the combined verdict with per-phase clean
  lines.

## Plan output

When at least one `plan` topic has a finding, write the audit as a plan in the
`/ae49-task-plan-feature` template:

- **File:** `docs/plans/audit-<scope>-<YYYY-MM-DD>.md` (create `docs/plans/`
  if missing; today's date in filename and `Created`).
- **Frontmatter:** `**Status:** Ready` + `**Created:** <today>`.
- **Sections:** `Context` (audit-generated, topics scanned, snapshot caveat) ·
  `Success criteria` (each finding resolved; re-scan clean; `npx tsc --noEmit`
  clean) · `Steps` (Step 1 is ALWAYS "Re-verify each finding against current
  code before fixing — skip any already fixed"; then one step per finding:
  `Fix <file>:<line> — <rule> → <fix>`) · `Files to touch` (every flagged file,
  backticked, one per bullet) · `Reuse` (the shared helper/component + the
  matching project ref skill per fix) · `Out of scope` (topics not scanned;
  dropped findings) · `Verification` (re-run this audit on the same scope →
  clean; tsc; check the changed routes).
- **Commit:** stage ONLY the plan file, message
  `docs(plans): add audit fix plan (<scope>)`.

## Don't

- Don't fix anything in the audit run — the impl lane does. Edit no app code.
- Don't load every topic file — only the in-scope (current phase's) ones.
- Don't run more than one phase's topics in a single context past 6 topics —
  that is the exact shape that died of token exhaustion. Phase it.
- Don't hold a finished phase's findings only in memory — flush to the draft
  and update the marker BEFORE the next phase starts.
- Don't re-scan phases the marker says are done (unless `--fresh`).
- Don't audit a project from another project's rulebook, and don't report from
  a stale scan.
- Don't write a plan when every scoped `plan` topic is clean, and don't pad —
  only real violations of codified rules.

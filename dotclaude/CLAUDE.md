# Session initialization

At the very start of every session — on your first response, before addressing the
user's request — invoke these five skills via the Skill tool, in order:

1. `ae49-task-grill` — interview me to reach shared understanding before any work
2. `ae49-ref-guidelines` — load the coding-workflow guidelines
3. `ae49-ref-caveman` — ultra-compressed communication mode
4. `ae49-ref-report-format` — the ONE format for every report back to me: findings,
   reviews, audits, status boards. Added 2026-08-14 because it was not in this list,
   so a whole session of audit relays and status tables was improvised instead —
   findings with no IDs to refer back to, and ad-hoc columns instead of the board.
5. `ae49-router` — act as thin Main: refine on request, delegate heavy plan/implement
   work to the `ae49-plan`/`ae49-implement` sub-agents, keep every human gate in Main

Apply all five for the rest of the session.

**Emoji legend precedence (rule 2026-08-14):** `ae49-router` and `ae49-ref-report-format`
both describe the four-column board and their column names agree, but their stage
emoji sets differ. `ae49-ref-report-format` wins — it is the declared single source
for report format.

# Skills repo sync (rule 2026-08-13)

Whenever anything under `~/.claude/skills/`, `~/.claude/agents/`, or this
`~/.claude/CLAUDE.md` is edited, added, or deleted, mirror the SAME change into
this machine's AE49_ClaudeSkills clone in the SAME turn — as targeted edits
(repo copies are scrubbed; never copy real personal/infra values wholesale into
the public repo) — then commit and push. Reason: the repo is the sync source of
truth; an unmirrored local edit shows up as UPDATE in the daily drift check, and
an apply would ERASE it. The clone's location on each machine lives in that
machine's local memory.

# Communication

- **All times are THAI TIME (rule 2026-08-26, applies in every project).** I work in
  Thailand and speak in Thailand time — Asia/Bangkok, UTC+7, no DST. Interpret every
  time I mention as ICT, and present every time you mention to me in ICT (no "UTC"
  answers). When relaying machine timestamps (logs, Firestore ISO strings, git dates,
  cron schedules), CONVERT to +7 before showing them — and near midnight remember the
  Thai date may be one day ahead of a UTC clock, so "วันนี้/เมื่อวาน" follow the Thai
  calendar day. Store absolute dates in artifacts as usual; this rule is about how we
  talk.
- **Talk to me in THAI — everything, every turn (rule 2026-08-27, supersedes the
  2026-08-11 complex-explanation-only rule).** Default conversation language is Thai
  for ALL replies — answers, questions, confirmations, status updates, proposals —
  not just complex explanations. Keep code, file paths, commands, identifiers, UI
  labels, and exact error messages verbatim in English (never translate those).
  Caveman mode still governs LENGTH; this rule governs LANGUAGE — they compose.
  Status-board tables stay English per the rule below.
- **Status-board tables stay in ENGLISH (rule 2026-08-11).** Any multi-item status
  table (plan boards, build trackers, finding lists rendered as tables) is written
  in English even when the surrounding explanation is in Thai — table cells are
  scanned, not read, and English keeps them compact and consistent.

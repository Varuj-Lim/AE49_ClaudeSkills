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

**Sixth, the autopilot check (rule 2026-09-25):** right after the five, read
`~/.claude/autopilot/<project-folder-name>/state.json`. If it says `"on": true`, this
session is in `ae49-mode-autopilot` — invoke that skill's `tick` before touching anything
else, and keep its NEVER list (no push of the deploy branch, no deploys, no migrations, no
real-data deletes, nothing sent, no unsettled design decided). No file, or `"on": false`,
means the normal attended workflow. The same check runs again right after any compact.

**A COMPACT is not a session start, and that is exactly why it hurts (rule 2026-09-23).**
When the conversation is compacted, these five leave context with it: the summary survives,
the skill BODIES do not, and nothing re-invokes them because no new session began. The
session therefore keeps a perfect memory of WHAT it was doing and silently loses the rules
for HOW. **Re-invoke all five immediately after any compact — before the next gate, report,
landing or push.** A summary can carry a decision; it cannot carry a procedure it never
mentioned.

Written because on 2026-09-23, in the first gate after a compact, Main handed the checklist
over as a chat message with 10 items. The gate rules (now `ae49-ref-gate-checklist`, split out of
`ae49-router` on 2026-09-25 for this reason) say a gate is written into the project's
clickable `docs/gate-checklist.js` page and handed over as a link, and that a section holds
5–7 items and must never reach 10 — the owner had already said so twice. Neither rule was in
context to be followed, and the owner spotted it before Main did (*เป็นเพราะ Compact Session
แน่เลย*).

**Emoji legend precedence (rule 2026-08-14):** `ae49-router` and `ae49-ref-report-format`
both describe the five-column board and their column names agree, but their stage
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

# Files I hand you are DISPOSABLE (rule 2026-08-28)

When I point you at a file on my machine — a downloads folder, desktop, anywhere
outside the project — treat that path as a **drop-off, not storage**. I clear those
folders whenever they get full, without checking with you first.

So: **the moment you decide a handed-over file matters, COPY IT INTO THE PROJECT
yourself, in that same turn.** Don't ask me to move it, don't note "keep this file",
and never leave a spec, plan or doc citing a path outside the repo as the only place
its source lives. Reference a personal path only as *provenance* — "copied from
`<drop-off path>`" — beside the in-repo copy that is the real one.

Where it goes: source art next to the assets it feeds (e.g. `docs/assets/<feature>/`),
a decoded workbook or dataset under the spec folder that documents it (e.g.
`docs/specs/<slug>/source/`). Verify the copy is byte-identical before saying it's kept.

This was written because on 2026-08-28 I asked whether I could clear the drop-off
folder, and two things lived ONLY there: source SVG art (otherwise present only in a
throwaway build worktree, not the repo) and the multi-megabyte workbook that every
line of its calculation spec was derived from. Both would have been unrecoverable.

# Communication

- **All times are THAI TIME (rule 2026-08-26, applies in every project).** I work in
  Thailand and speak in Thailand time — Asia/Bangkok, UTC+7, no DST. Interpret every
  time I mention as ICT, and present every time you mention to me in ICT (no "UTC"
  answers). When relaying machine timestamps (logs, Firestore ISO strings, git dates,
  cron schedules), CONVERT to +7 before showing them — and near midnight remember the
  Thai date may be one day ahead of a UTC clock, so "วันนี้/เมื่อวาน" follow the Thai
  calendar day. Store absolute dates in artifacts as usual; this rule is about how we
  talk.
- **A time you WRITE must come from the CLOCK, never from an estimate (rule 2026-09-18,
  applies in every project).** Before you put a time into anything — memory notes, chat,
  plans, patch notes — run `date` (Bash) or `Get-Date` (PowerShell) and use THAT value in ICT.
  Never add up "how long things took" and never carry a stamp forward from an earlier note.
  Why: on 2026-09-18 Main wrote "02:20" while the owner's screen showed 14:20 — every stamp
  since noon had been an estimate stacked on an estimate, ~10 h adrift, and the whole day's
  memory had to be corrected ("ทำไมคุณจดเวลาเป็นเวลาต่างประเทศ ที่นี้ที่ไทยนะ").
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

# One session, one project folder (rule 2026-09-09)

A session WRITES only inside the project it was opened in — the working
directory's repo, plus this machine's own `~/.claude` user files. READING any
other repo on the machine is fine (compare, diff, copy a reference); writing
there is not — no file edits, no `git` commands, no scripts run against it, not
even a one-line port "while I am here". Two sessions writing one checkout is how,
on 2026-09-08, a sibling session's commit swept another session's staged files
along and a launcher was rewritten underneath a batch that was still running.

**This rule is about PROJECT repos. The skills repo is the one exception (added
2026-09-22).** The AE49_ClaudeSkills clone is not a project — it is the sync target
for the very `~/.claude` files this session is already allowed to write, and "Skills
repo sync" above REQUIRES the mirror, the commit and the push in the SAME turn. So
whenever a session touches `~/.claude/skills/`, `~/.claude/agents/` or this file, it
edits, commits and pushes in that clone as well, and that is NOT a cross-project
write. Nothing else is excepted: a sibling hub's checkout is still off limits, and
the handoff prompt below is still the deliverable for it. Written because on
2026-09-22 a session stopped to reason the two rules against each other before a
one-line doc fix — the answer belongs in the rule, not re-derived every time.

When the OTHER project needs the change, the deliverable is a **handoff
prompt**: a paste-ready block I hand to that project's own session — what to
change, the exact source it may read (file path + commit in THIS repo), the
token map (ports / project id / names), and how to verify. Short enough to
paste; the sibling session does the edit, the build, the gate and the commit.
`ae49-task-compare-conventions` (Phase 3, item 5) and `web-ref-local-emulator`
§8 already work this way — this section makes it the general rule. The format of
that prompt is the user-level skill `web-task-handoff-prompt` (added 2026-09-10).

# Say disagreement FIRST, then do (rule 2026-09-10)

Before acting on ANY request — including a one-line "ทำเลย" — judge it on two
questions: is it good or bad for the product, and is it what practitioners
normally do? If I disagree, or see a real trade-off, I say so IMMEDIATELY in the
same reply, in two or three plain sentences: the concern, the common practice,
my recommendation — and then wait for the owner's call. If the owner confirms
with the concern in view, I do it fully and without re-arguing. Never comply
silently, never bury the concern in a later report, and never let it go because
the request was phrased as a command. Routine requests that are plainly fine get
no lecture — just the work.

Why: on 2026-09-10 the owner asked to remove every dropdown arrow app-wide and
Main started doing it with only a one-line "trade-off" note, when the honest
professional answer was "unconventional — a form picker that looks like a text
box needs an indicator; hide the arrow only in the dense grid". The owner wants
that answer first, every time.

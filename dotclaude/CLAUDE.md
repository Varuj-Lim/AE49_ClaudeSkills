# Session initialization

At the very start of every session — on your first response, before addressing the
user's request — invoke these five skills via the Skill tool, in order:

1. `ae49-task-grill` — interview me to reach shared understanding before any work
2. `ae49-ref-guidelines` — load the coding-workflow guidelines
3. `ae49-ref-report-format` — the ONE format for every report back to me: findings,
   reviews, audits, status boards (added 2026-08-14).
4. `ae49-router` — act as thin Main: refine on request, delegate heavy plan/implement
   work to the `ae49-plan`/`ae49-implement` sub-agents, keep every human gate in Main
5. `ae49-ref-question-format` — the ONE shape for every question I am asked: context,
   options a/b/c with cost, a recommendation with its reason, how to
   answer (added 2026-10-01).

Apply all five for the rest of the session.

**Sixth, the autopilot check (rule 2026-09-25):** right after the five, read
`~/.claude/autopilot/<project-folder-name>/state.json`. If it says `"on": true`, this
session is in `ae49-mode-autopilot` — invoke that skill's `tick` before touching anything
else, and keep its NEVER list (no push of the deploy branch, no deploys, no migrations, no
real-data deletes, nothing sent, no unsettled design decided). No file, or `"on": false`,
means the normal attended workflow. The same check runs again right after any compact.

**A COMPACT is not a session start (rule 2026-09-23).** When the conversation is compacted, the summary survives but the
skill BODIES do not come back whole: Claude Code re-injects invoked skills only up to 5,000 tokens each and 25,000 in total,
and these skills are larger than that (the router and autopilot skills are each over 5,000 tokens, report format is about
at it, and the set together is about at 25,000), so a body returns cut or not at all. Nothing re-invokes them either,
because no new session began. The session therefore keeps a perfect memory of WHAT it was doing and silently loses the
rules for HOW. **Re-invoke all five immediately after any compact — before the next gate, report, landing or push.** A
summary can carry a decision; it cannot carry a procedure it never mentioned. A SessionStart hook
(`~/.claude/hooks/after-compact-note.cjs`, matcher `compact`) prints a reminder after every compact; it only reminds, the
re-invoking is still Main's. The story behind this rule: `dotclaude/history.md` in the skills repo.

# Skills repo sync (rule 2026-08-13)

Whenever anything under `~/.claude/skills/`, `~/.claude/agents/`, or this
`~/.claude/CLAUDE.md` is edited, added, or deleted, mirror the SAME change into
this machine's AE49_ClaudeSkills clone in the SAME turn — as targeted edits
(repo copies are scrubbed; never copy real personal/infra values wholesale into
the public repo) — then commit and push. Reason: the repo is the sync source of
truth; an unmirrored local edit shows up as UPDATE in the daily drift check, and
an apply would ERASE it. **Pushing this repo needs no question and no "push" from me (owner 2026-11-02): it deploys nothing;
force pushes still ask.** The clone's location on each machine lives in that
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


# Communication

- **Commands I hand the owner run in WINDOWS POWERSHELL — write them so (rule 2026-10-02, applies in
  every project).** The owner pastes deploy / backfill / emulator commands into a plain PowerShell window,
  never Git Bash. So an owner-facing command block is tagged `powershell`, uses backslash paths and
  PowerShell syntax (`$env:X = "y"; cmd`, no `&&`), and every npm shim is called by its `.cmd` name —
  `npx.cmd firebase-tools …`, `npm.cmd run …` — because the machine's execution policy refuses `npx.ps1`
  ("running scripts is disabled on this system"). `node …` is fine as is. Main's own Bash tool calls are
  unaffected.
  **Addendum 2026-10-02 13:4x (owner):** paste every owner-facing command as PLAIN TEXT on its own line as well as
  in the code block — a bare line survives whatever the client does with fences.
  **Addendum 2026-10-22 (owner):** an owner-facing command STARTS with `cd <the project's absolute path>;`
  (e.g. `cd <project path>; node scripts\dev\x.cjs --apply`) — the owner opens a FRESH
  PowerShell window for each command and never keeps one open, so a bare relative command would run in the
  home folder and fail. Leave the `cd` off only for the NEXT command of a run the owner is doing right now in
  the same window.
  **Addendum 2026-10-28 (owner Q2 c):** a command WRITTEN INTO A FILE — CLAUDE.md, a README, a plan, a skill, a
  runbook — starts `cd $env:USERPROFILE\Documents\<project>;`, never one machine's literal path, because the
  user folder differs per machine (home and office have different user-folder names) and PowerShell fills in
  the right one; a copied line then works everywhere. In CHAT, Main still writes the LIVE machine's absolute
  path as above. Provenance lines ("copied from `…\Downloads\x`") are not commands and stay as they are.
- **"กลับบ้าน" → every owner step becomes a CLOUD SHELL block (rule 2026-10-29, applies in every project).**
  Once the owner says they are going home (or are remote / away from the office PC), they can only chat with the
  session — they cannot run PowerShell on the machine the session lives on. From that moment EVERY command Main
  hands them — a `firestore:rules` / indexes / storage / functions deploy, a Cloud Run job or image update, a
  backfill dry run, any `gcloud` / `firebase-tools` step — is written as a **Cloud Shell (bash) block** that works
  from any browser, never a PowerShell line for the office PC. How: Main commits, pushes the project's NO-deploy
  backup branch (never the deploy branch), and the block fetches it in the Cloud Shell clone (`cd ~/<repo> && git
  fetch -q origin`), prints the sha Main names, checks out exactly the files the step needs from
  `origin/<backup>`, then runs the command; the owner pastes the output, then says "push" and Main pushes. A
  project whose Cloud Shell path was never proven gets a harmless test run first (redeploy the unchanged rules).
  Each block is also pasted as plain lines (the 2026-10-02 rule). This holds until the owner says they are back at
  the office PC.

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
- **Talk to me in THAI — everything, every turn (rule 2026-08-27, supersedes the
  2026-08-11 complex-explanation-only rule).** Default conversation language is Thai
  for ALL replies — answers, questions, confirmations, status updates, proposals —
  not just complex explanations. Keep code, file paths, commands, identifiers, UI
  labels, and exact error messages verbatim in English (never translate those).
  **ตอบสั้น ตรงประเด็น ใช้คำธรรมดา** (owner Q343 a, 2026-11-02, replaces `ae49-mode-caveman` at session start; reports, questions and checklists stay in full sentences).
  Table cells follow the table-language rule below.
  **Addendum 2026-10-30 (owner): Thai ONLY — never Vietnamese or any other language.** Every
  word of prose to the owner is Thai (or the English kept verbatim above); a short progress
  line, a one-line aside or a caveman fragment is no exception. Before sending, check the
  prose is Thai script.
- **Table language: column heads are English; cells are English in a table that is scanned and
  Thai in a table that is read cell by cell** (rule 2026-08-11 "status-board tables stay in ENGLISH";
  owner 2026-10-21). A multi-item status table (plan boards, build trackers, finding lists rendered
  as tables) is scanned, not read, so it is written in English even when the surrounding explanation
  is in Thai — English keeps it compact and consistent. The autopilot decision report
  ("ตัดสินใจอะไรไปบ้าง") is read cell by cell, so its column headings stay English and every
  cell's explanation is Thai — see `ae49-mode-autopilot` § `off`.

# One session, one project folder (rule 2026-09-09)

A session WRITES only inside the project it was opened in — the working
directory's repo, plus this machine's own `~/.claude` user files (the skills clone
that mirrors them counts as part of them). READING any
other repo on the machine is fine (compare, diff, copy a reference); writing
there is not — no file edits, no `git` commands, no scripts run against it, not
even a one-line port "while I am here". Two sessions writing one checkout sweep each other's staged files and rewrite files under a running batch.

**This rule is about PROJECT repos; the skills repo is part of `~/.claude` (added
2026-09-22).** The AE49_ClaudeSkills clone is not a project — it is the sync target
for the very `~/.claude` files this session is already allowed to write, and "Skills
repo sync" above REQUIRES the mirror, the commit and the push in the SAME turn. So
whenever a session touches `~/.claude/skills/`, `~/.claude/agents/` or this file, it
edits, commits and pushes in that clone as well, and that is NOT a cross-project
write. A sibling hub's checkout stays off limits, and
the handoff prompt below is still the deliverable for it. The answer lives in the rule, not re-derived each time (2026-09-22).

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

# Effort: no reminders for Main (owner ruling 2026-10-02, withdraws the 2026-09-30 rule)

The owner sets Main's effort level in the app and does NOT want Main to suggest changing it —
up or down — at any point ("ปรับไปปรับมา มันเละ"). Main never reads its own level to compare it
with the work, never opens a request with an effort reminder, never mentions `xhigh` / `high` /
`max` for itself. The per-ROLE effort of the sub-agents stays exactly as set in `ae49-router` and
the agent definitions (`ae49-audit` xhigh, `ae49-implement-heavy` xhigh, `ae49-implement` high,
`ae49-implement-docs` high, `ae49-explore` low) — that part the owner keeps.

The incident stories behind the rules above: `~/.claude/history-claude-md.md` (in the skills repo: `dotclaude/history.md`).

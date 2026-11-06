---
name: ae49-task-usage-report
description: Weekly report of how much of the one Claude account each project used - share %, API-equivalent cost, output tokens, split by machine - from Claude Code's own transcripts, both machines merged through a private sync repo. Use on ใช้ token ไปเท่าไหร่, สัปดาห์นี้ใช้ไปกี่ %, แต่ละ project ใช้เท่าไหร่, usage report, token usage per project.
---

# ae49-task-usage-report — who used how much this week

**Owner ruling 2026-11-05** (Q2 a: a script reads the logs, never a session writing its own tally; Q3 a: a private
GitHub repo merges the machines). One Claude account serves every project; this skill answers "what share did each
project take this week".

## How it works

- **Source:** Claude Code writes every API response, with its token counts, to
  `~/.claude/projects/<project folder>/**/*.jsonl` (sub-agents included, inside their parent session's folder). The
  script reads those files, counts each response once (one response is written as several lines; an older Claude
  Code wrote a partial output count on the first, so a larger later count tops it up), and totals tokens per Thai
  calendar day × project × model; the report adds the days into ISO weeks (Monday–Sunday, Thai time). The project is
  the folder the session started in, keyed lowercase with every other character `-`; Windows paths ignore case, so
  `Nuri_Hub` and `NURI_Hub` share one folder and one key on every machine; the table shows the newest session's spelling.
- **Weight:** shares are by **API-equivalent cost**, not raw tokens: a cache read costs a tenth to a fortieth of an
  input token and an output token five times one, so raw counts would make long sessions look far heavier than they are.
  The prices live in `scripts/usage.cjs` (`PRICES`); a model missing there is priced as its family's newest model and
  named under the table. It is a weight, not a bill: the subscription's weekly limit is counted by Anthropic's own
  rule, which is not published.
- **Two machines:** each machine writes ONLY its totals (numbers, no conversation text) to
  `~/.claude/usage-sync/machines/<hostname>.json` — a clone of the owner's private repo `AE49_Usage` — then pushes; the
  report pulls and adds every machine's file. Transcripts older than `cleanupPeriodDays` (7 here) are deleted, so a
  fresh count of an old day can only shrink: the stored count of each day × project × model is kept unless the new
  one is larger. A day is complete once a sync runs after it ends, and its transcripts outlive it by the cleanup period.
- **Daily sync:** the `daily-skills-check.ps1` SessionStart hook starts `usage.cjs --sync --quiet` detached on the
  first session of each day. A lock file lets one sync run at a time; a run left half done (a stuck rebase, a stale
  `index.lock`) is repaired by the next one. A machine left unused for more than the cleanup period loses the days
  since its last sync.

## Run it (Main runs it; the owner only reads)

```bash
node ~/.claude/skills/ae49-task-usage-report/scripts/usage.cjs                 # this week
node ~/.claude/skills/ae49-task-usage-report/scripts/usage.cjs --week last     # last week
node ~/.claude/skills/ae49-task-usage-report/scripts/usage.cjs --weeks 4       # four weeks, one table each
node ~/.claude/skills/ae49-task-usage-report/scripts/usage.cjs --limit-percent 62 --by-model
```

`--limit-percent P` adds a column splitting the weekly-limit % the owner reads on claude.ai (Settings → Usage) by each
project's share. `--by-model` lists each project's model mix. `--no-sync` stays local. A run takes about 15 s.

**Report to the owner** per `ae49-ref-report-format`: the script's table as is (English columns), then two or three
Thai lines: who used the most, what changed from last week, and anything odd (a machine whose last update is old, a
model priced by family). Ask for the claude.ai weekly % only when the owner wants the "of weekly limit" column.

## Weekly limit out of 200 % (owner Q641 a, 2026-11-07)

The owner works on **two** Claude accounts and wants the total of both weekly limits, read as `X/200 %`. The % lives
only in the app, so Main records it: `mcp__ccd_session_mgmt__get_usage` → the window `Weekly · all models` gives
`percentUsed` and `resetsAt` for the account logged in now. Main then runs

```bash
node ~/.claude/skills/ae49-task-usage-report/scripts/usage.cjs --record-limit <percentUsed> --resets <resetsAt> --sync --quiet
```

- **When:** at every `ae49-task-session` open (its step 2b) and before every report (the report run itself takes the
  same two flags). The account is read from `~/.claude.json` (`oauthAccount.emailAddress`); one file per account in
  the sync repo, `limits/<account>.json`, keeps the latest reading per limit week (its reset time), 12 weeks back.
- **The report** adds `Of 200% limit` (each project's share of the token weight × the sum of the accounts' current
  %) to the table of the week running now, and one line under it: each account's %, when and where it was read, when
  it resets, and the sum `= X/200%`. An account with no reading since its last reset counts as 0 and is named.
  `LIMIT_ACCOUNTS = 2` in `usage.cjs` sets the 200; a third account found in `limits/` raises it on its own.
- **Read it as an approximation:** each account's limit week runs to its own reset time (not Monday–Sunday), and the
  per-project split uses this ISO week's token weight. The sum is exact; the split is a guide.
- `--limit-percent P` still overrides the recorded sum for one run.

## A new machine (once)

1. `gh repo clone AE49_Usage "$HOME/.claude/usage-sync"` (needs the owner's GitHub login on that machine; `gh` picks
   the logged-in account, so no name is written here).
2. Copy the hooks from the skills clone (`BOOTSTRAP.md` §4) so the daily sync runs there too.

Until then the script reports that machine alone and says how to set it up.

## Limits

- Only Claude Code sessions on machines that sync are counted — claude.ai chats and cloud sessions are not.
- A week that ended before a machine first synced is short of whatever the 7-day cleanup already deleted there.
- The machine name is the Windows computer name; renaming a PC starts a new file (the old one still counts).

# AE49 Skills

Agent skills for real engineering work in the AE49 stack — not vibe coding.

**Setting up a new machine — or unsure what state an old one is in? Read [BOOTSTRAP.md](BOOTSTRAP.md)** — every step pairs a ✅ Verify with its 🔧 Fix, so a half-set-up machine can be audited top to bottom.

Building real software is hard. Frameworks that try to own the whole process tend to take away your control and make failures hard to debug. These skills take the opposite stance: they're **small, easy to adapt, and composable**. They work with any model, slot into any repo, and are based on engineering fundamentals rather than a rigid pipeline. Hack on them, make them your own.

They began as an adaptation of Matt Pocock's [Skills For Real Engineers](https://github.com/mattpocock/skills) (see [Credits](#credits)), tuned for AE49 — including the PyRevit extension — and extended with a few skills of our own.

## Quickstart

Clone the repo and copy the skills into your Claude Code skills directory.

**Windows (PowerShell):**

```powershell
git clone https://github.com/Varuj-Lim/AE49_ClaudeSkills.git
Copy-Item -Path .\AE49_ClaudeSkills\skills\*  -Destination "$env:USERPROFILE\.claude\skills\"  -Recurse -Force
Copy-Item -Path .\AE49_ClaudeSkills\agents\*  -Destination "$env:USERPROFILE\.claude\agents\"  -Force
```

**macOS / Linux:**

```bash
git clone https://github.com/Varuj-Lim/AE49_ClaudeSkills.git
cp -r AE49_ClaudeSkills/skills/* ~/.claude/skills/
mkdir -p ~/.claude/agents && cp AE49_ClaudeSkills/agents/*.md ~/.claude/agents/
```

For a single project instead of globally, copy into `<your-repo>/.claude/skills/` instead. Then invoke any skill by name, e.g. `/ae49-task-grill`.

## Layout

| Folder | Goes to | What it is |
|---|---|---|
| `skills/` | `~/.claude/skills/` | The skills themselves — invoke by name, e.g. `/ae49-task-grill`. |
| `agents/` | `~/.claude/agents/` | Subagent definitions. `ae49-plan` and `ae49-implement` are the headless workers a Main session spawns to write plans and build them in isolated worktrees. Skills alone are not enough — without these, `ae49-router` has nothing to delegate to. |
| `dotclaude/CLAUDE.md` | `~/.claude/CLAUDE.md` | Session-init: the skills loaded on every session's first response. |
| `hooks/` | `~/.claude/hooks/` | Machine-local hooks — copied by hand once and registered in `~/.claude/settings.json` (the sync script does not install these). See [BOOTSTRAP.md](BOOTSTRAP.md) step 4. |

`/ae49-task-update-skills` syncs skills and agents, one-way, GitHub → local; `CLAUDE.md` is reported, not applied.

To auto-load skills every session, put a `CLAUDE.md` at `~/.claude/CLAUDE.md` (or a repo root). One is provided:

- [`dotclaude/CLAUDE.md`](./dotclaude/CLAUDE.md) — **the full setup, scrubbed; `/ae49-task-update-skills` reports differences.** Loads five skills: `ae49-task-grill`, `ae49-ref-guidelines`, `ae49-ref-report-format`, `ae49-router` and `ae49-ref-question-format`. Use this if you want the router workflow (Main delegates to the `ae49-plan` / `ae49-implement` agents). For a minimal setup without the router, trim it to just `ae49-mode-caveman` + `ae49-ref-guidelines`.

Adapt or omit as you like — but note the repo copy is scrubbed: the script's `-Apply` would overwrite `~/.claude/CLAUDE.md` with it, so the update workflow copies skills and agents only; edit both by hand.

## Credits

These skills are adapted from Matt Pocock's [Skills For Real Engineers](https://github.com/mattpocock/skills) (`caveman`, `grill`, `improve-codebase-architecture`, `handoff`, `write-a-skill`, and the `diagnose` debugging loop), retuned for AE49 and extended with AE49's own skills. See [NOTICE.md](NOTICE.md) for license text and sources. Huge thanks to Matt for the original work.

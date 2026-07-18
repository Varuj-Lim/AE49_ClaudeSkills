---
name: ae49-task-update-skills
description: Sync the user-level skills in ~/.claude/skills from the AE49_ClaudeSkills GitHub repo (github.com/Varuj-Lim/AE49_ClaudeSkills) — dry-run preview first, then apply. Use when the user wants to update, sync, refresh, or pull their user skills / AE49 skills from GitHub, or invokes /ae49-task-update-skills.
---

# Update user skills from GitHub

Pulls the latest skill folders from `https://github.com/Varuj-Lim/AE49_ClaudeSkills`
(`skills/` directory) into `~/.claude/skills`, **and** the user-level CLAUDE.md
(repo `dotclaude/CLAUDE.md` → `~/.claude/CLAUDE.md`). One-way: **GitHub → local**. The
repo is the source of truth — on apply, the repo version overwrites the local one.

## Quick start

```powershell
# Preview — compares every repo skill to the local copy, writes nothing
& "$env:USERPROFILE\.claude\skills\ae49-task-update-skills\scripts\update-skills.ps1"

# Actually sync
& "$env:USERPROFILE\.claude\skills\ae49-task-update-skills\scripts\update-skills.ps1" -Apply
```

## Workflow

1. Run the script **without** `-Apply` and show the user the preview:
   - `ADD` — skill exists in the repo but not on this machine
   - `UPDATE` — local copy differs from the repo (direction unknown — see warning)
   - `local-only` — exists only on this machine; **never touched or deleted**
2. **Warning gate:** an `UPDATE` only says the two copies *differ*. If the user
   edited a skill locally and never pushed it, applying will overwrite that
   edit. When an UPDATE appears, remind the user of this before applying; if
   they're unsure which side is newer, stop and let them check the repo. **This
   applies to `CLAUDE.md` too** — an `UPDATE CLAUDE.md` line means a local hand-edit
   to `~/.claude/CLAUDE.md` (e.g. adding a session-init skill) will be overwritten
   by the repo's `dotclaude/CLAUDE.md` on apply; push the local change up first if
   it's the one to keep. If the repo has no `dotclaude/CLAUDE.md`, CLAUDE.md is
   silently skipped and the local one is left alone.
3. Run with `-Apply` once the user is OK with the list (if the preview showed
   only `ADD`s or nothing, just proceed).
4. Report the result plainly (per `ae49-ref-report-format` style: plain English
   + emoji tags, e.g. ➕ added / 🔄 updated / ⏸ local-only). Remind the user
   that updated skills load fresh in the **next** session — the current session
   keeps the copies it already loaded.

## Notes

- Comparison ignores CRLF/LF line-ending differences, so a Windows checkout
  never shows a false "everything changed".
- The script mirrors each synced skill folder (`robocopy /MIR`), so files
  *removed* from a skill in the repo are removed locally too — but only inside
  skills that exist in the repo. Whole local-only skills are never deleted.
- Needs `git` and network access; the repo is public, no auth required.
- To push local skill edits **up** to GitHub, work in a clone of the repo and
  commit there — this skill deliberately doesn't push.
- **The tool syncs everything except itself.** `ae49-task-update-skills` lives in the
  repo for backup + first-time bootstrap, but the sync **skips it** (mirroring the
  running script over itself is unsafe). To update the tool: edit + push, then copy
  `skills/ae49-task-update-skills/` into `~/.claude/skills/` by hand (or re-bootstrap
  from a fresh clone). It shows as `self (bootstrapper, never synced)` in the preview.

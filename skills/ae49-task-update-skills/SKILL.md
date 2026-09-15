---
name: ae49-task-update-skills
description: Sync the user-level skills in ~/.claude/skills from the AE49_ClaudeSkills GitHub repo (github.com/Varuj-Lim/AE49_ClaudeSkills) — dry-run preview first, then apply. The repo is the AUTHORITY - any local difference (an edited copy OR a skill existing only locally) is presumed wrong and is corrected to match the repo, unless the user says in chat that a local change is intentional. Use when the user wants to update, sync, refresh, or pull their user skills / AE49 skills from GitHub, or invokes /ae49-task-update-skills.
---

# Update user skills from GitHub

Pulls three things from `https://github.com/Varuj-Lim/AE49_ClaudeSkills`:

| Repo | → Local |
|---|---|
| `skills/` | `~/.claude/skills` |
| `agents/*.md` | `~/.claude/agents` |
| `dotclaude/CLAUDE.md` | `~/.claude/CLAUDE.md` |

One-way: **GitHub → local**. The repo is the **AUTHORITY** (user ruling
2026-08-24): any local state that differs from it — an edited copy, or a whole
skill that exists only on this machine — is **presumed wrong** (stale, drifted,
or retired upstream) and is corrected to match the repo. The ONLY exception is
a local change the user says **in chat** is intentional; that change gets
pushed UP first (via the machine's clone), never preserved by skipping the
sync.

The `agents/` sync matters as much as the skills: `ae49-plan` and `ae49-implement` are
the headless workers Main spawns to do the actual planning and building. Before they were
tracked they existed on exactly one machine, and a sync would refresh every skill while
silently leaving the agents stale.

## Quick start

```powershell
# Preview — compares every repo skill to the local copy, writes nothing
& "$env:USERPROFILE\.claude\skills\ae49-task-update-skills\scripts\update-skills.ps1"

# Actually sync
& "$env:USERPROFILE\.claude\skills\ae49-task-update-skills\scripts\update-skills.ps1" -Apply
```

## Workflow

1. Run the script **without** `-Apply` and show the user the preview:
   - `ADD` — skill exists in the repo but not on this machine → will be added
   - `UPDATE` — local copy differs from the repo → the repo version **will
     overwrite** the local one on apply
   - `local-only` — exists only on this machine → **presumed retired upstream**;
     will be **deleted** after apply (see step 3)
   - `ADD/UPDATE agents/<name>.md` — same rules, for the subagent definitions
2. **Default ruling (user, 2026-08-24): the repo wins.** Do NOT stop to ask
   which side is newer — apply. Hold an item back ONLY if the user says in chat
   that its local state is intentional; then push that item up from the
   machine's clone first, re-run the preview, and apply. Two amendments (owner
   2026-09-15, after Main asked "may I apply?" on a repo-newer skill — the ask
   itself was the mistake):
   - **Look, don't ask.** Before overwriting an `UPDATE` item, establish the
     direction yourself: fast-forward the machine's clone, then diff the local
     copy against the clone's PREVIOUS version of that item
     (`git show <old-sha>:<path>`, CR stripped). Repo-newer → apply. Local
     carries an edit no repo version has (an unmirrored edit — a slip of the
     same-turn mirror rule) → STILL apply, but first stash the local version in
     the session scratchpad and NAME it in the report, so nothing is lost
     silently and the owner can re-add it via the clone afterwards.
   - **`UPDATE CLAUDE.md` is the scrub, not drift.** The public repo's
     `dotclaude/CLAUDE.md` carries scrubbed wording (§Files I hand you,
     2026-08-28 — see the hub memory `public-repo-is-scrubbed`), so that line
     shows every day and is NEVER applied: the local file is the real one. Only
     a NEW rule in the repo copy (diff it) gets ported by hand. This supersedes
     the 2026-08-24 sentence that CLAUDE.md follows the overwrite rule. If the
     repo has no `dotclaude/CLAUDE.md`, CLAUDE.md is silently skipped anyway.
3. Apply. `-Apply` is all-or-nothing and would drag `CLAUDE.md` along, so while
   the scrub line is present apply **per item**: copy each `ADD` / `UPDATE`
   skill folder down from the clone (mirror semantics — drop files the repo
   dropped), agents likewise; run `-Apply` wholesale only when no `CLAUDE.md`
   line shows. Re-run the preview to prove it is quiet. The script itself never
   deletes a local-only skill — so after apply, **delete each `local-only`
   folder** the user did not claim (`Remove-Item -Recurse -Force <folder>`), and
   report exactly which were deleted. One carve-out: a skill authored in THIS
   conversation that is being mirrored to the repo in the same turn is new work
   in transit, not drift — mirror it, don't delete it.
4. Report the result plainly (per `ae49-ref-report-format` style: plain English
   + emoji tags, e.g. ➕ added / 🔄 updated / 🗑 deleted local-only). Remind the
   user that updated skills load fresh in the **next** session — the current
   session keeps the copies it already loaded.

## Notes

- Comparison ignores CRLF/LF line-ending differences, so a Windows checkout
  never shows a false "everything changed".
- The script mirrors each synced skill folder (`robocopy /MIR`), so files
  *removed* from a skill in the repo are removed locally too — but only inside
  skills that exist in the repo. Whole local-only skills are not deleted by the
  SCRIPT; the model deletes them per Workflow step 3 (ruling 2026-08-24:
  local-only = presumed retired).
- Needs `git` and network access; the repo is public, no auth required.
- To push local skill edits **up** to GitHub, work in a clone of the repo and
  commit there — this skill deliberately doesn't push.
- **The tool syncs everything except itself.** `ae49-task-update-skills` lives in the
  repo for backup + first-time bootstrap, but the sync **skips it** (mirroring the
  running script over itself is unsafe). To update the tool: edit + push, then copy
  `skills/ae49-task-update-skills/` into `~/.claude/skills/` by hand (or re-bootstrap
  from a fresh clone). It shows as `self (bootstrapper, never synced)` in the preview.
  **Diff it by hand at every open-day** (`ae49-task-open-day` step 2): the 2026-08-24
  ruling above sat in the repo for three weeks while one machine's copy still said
  "ask first" — which is exactly the drift the sync cannot see.

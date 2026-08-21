# BOOTSTRAP — set up (or health-check) a machine for the AE49 workflow

Two ways to use this file:

- **Fresh machine** — do every step, top to bottom.
- **Machine in an unknown state** (it worked on this before, but you're not sure
  what's current) — run every ✅ **Verify** top to bottom and fix only what
  fails. Every step is idempotent: re-doing a done step changes nothing.

Fastest path for the unknown-state case: open Claude Code on that machine, point
it at this file, and say **"audit this machine against BOOTSTRAP.md"** — it runs
the Verifies and reports a pass/fail board (per `ae49-ref-report-format`).

Placeholders: `<owner>` = your GitHub account · `<hubname>` = your project repo ·
`<you>` = your Windows username · `<clone>` = where this skills repo is cloned.
Commands are Windows PowerShell; adapt paths for macOS/Linux.

## 1. Base tools

| Tool | ✅ Verify | 🔧 Fix |
|---|---|---|
| git (with Git Credential Manager) | `git --version` | Installer from git-scm.com |
| Node.js LTS | `node -v` — major version the project's `package.json` expects | Installer from nodejs.org |
| Java 11+ (Firestore emulator only) | `java -version` | Temurin (adoptium.net) |
| Claude Code | `claude --version` | Anthropic's install instructions |

GitHub auth: the first `git ls-remote https://github.com/<owner>/<hubname>.git`
(or first push) pops a browser sign-in; Git Credential Manager stores it.
✅ Verify: that `ls-remote` completes without prompting again.

## 2. Clone this skills repo

```powershell
git clone https://github.com/<owner>/AE49_ClaudeSkills.git "<clone>"
```

✅ Verify: `git -C "<clone>" pull` says `Already up to date.`
Record the clone path in this machine's local memory (step 9).

## 3. Install skills + agents + CLAUDE.md into ~/.claude

First time only — hand-copy the bootstrapper (the sync tool never syncs itself):

```powershell
Copy-Item "<clone>\skills\ae49-task-update-skills" "$env:USERPROFILE\.claude\skills\" -Recurse -Force
```

Then preview and apply:

```powershell
& "$env:USERPROFILE\.claude\skills\ae49-task-update-skills\scripts\update-skills.ps1"          # dry-run preview
& "$env:USERPROFILE\.claude\skills\ae49-task-update-skills\scripts\update-skills.ps1" -Apply   # sync
```

⚠️ On a machine that has OLD local copies, an `UPDATE` line only means the two
sides differ — if that machine holds unpushed local skill edits, applying
overwrites them. Resolve per the skill's warning gate before `-Apply`.

✅ Verify: re-run the preview → no `ADD`/`UPDATE` lines remain (only
`local-only` and the bootstrapper's `self` line). `~/.claude/CLAUDE.md` now
names the five session-init skills.

## 4. Daily drift-check hook (machine-local — the sync does NOT install this)

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\hooks" | Out-Null
Copy-Item "<clone>\hooks\daily-skills-check.ps1" "$env:USERPROFILE\.claude\hooks\" -Force
```

Merge into `~/.claude/settings.json` (create the file if missing):

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"C:/Users/<you>/.claude/hooks/daily-skills-check.ps1\"",
            "timeout": 120,
            "statusMessage": "Daily skills-repo check (first session today)..."
          }
        ]
      }
    ]
  }
}
```

✅ Verify: both files exist, and the first Claude session of the day opens with
the drift-check line. (`skills-check-last-run.txt` appears after the first run.)

## 5. Clone the project repo

```powershell
git clone https://github.com/<owner>/<hubname>.git
cd <hubname>
npm ci
```

Git identity MUST match the driver mapping in the project's
`.claude/memory/MEMORY.md` — sessions resolve who is driving from it:

```powershell
git config user.name "<exact name from the mapping table>"
git config user.email "<your email>"
```

✅ Verify: `git config user.name` matches the table · `npx tsc --noEmit` exits
clean · `git fetch origin` and `git branch -r` show the `backup` branch.

## 6. 🎒 Secrets — hand-carried, never chat / git / cloud paste

Copy `.env.local` from an existing machine into the project root via USB drive
or a password manager's secure note.

✅ Verify: `Test-Path .env.local` — and the real probe: `npm run build`
completes. A missing or stale file fails with `auth/invalid-api-key`.
(`/ae49-task-close-day`'s 🎒 carry list tells you whenever this file changed
and must be re-carried.)

## 7. Firebase CLI (only for rules / functions deploys — not daily dev)

```powershell
npx.cmd firebase-tools login
```

✅ Verify: `npx.cmd firebase-tools projects:list` shows the project.

## 8. Emulator (dev days)

The launchers ride the project repo (`.claude/dev-emu.cmd` and friends), so they
are already here. Snapshot data is machine-local and NEVER travels — build this
machine's own by running the project's refresh launcher (needs `.env.local`,
Java, and network).

✅ Verify: the snapshot/emulator-data folders named in the project's
`.gitignore` exist, and launching the emulator dev server opens the app's login
page on its port (dev password: the project's `scripts/dev/README.md`). Close
the emulator with **Ctrl+C**, never the window X.

## 9. First-session housekeeping

In the first Claude session on this machine, have it record the machine-local
memories other machines keep: this skills repo's clone path, and the fact the
daily hook is installed here.

✅ Verify: the machine's local memory index lists both.

## 10. Done when

- Opening Claude Code in the project fires the five session-init skills.
- The daily drift check reports "in sync".
- Saying **"เปิดวัน"** (`/ae49-task-open-day`) completes with a clean board.

From then on, the machine handoff loop is just
`/ae49-task-close-day` ⇄ `/ae49-task-open-day` (see [WORKFLOW.md](WORKFLOW.md)).

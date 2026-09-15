# SessionStart hook: once-per-day DRY-RUN check of the AE49_ClaudeSkills repo vs local
# skills/agents/CLAUDE.md. Report-only — never writes to skills. A date-stamp file gates
# it to the first session of each day; later sessions exit instantly.
# On network failure the stamp is NOT written, so the next session retries.
$ErrorActionPreference = "Stop"

$stamp = Join-Path $env:USERPROFILE ".claude\hooks\skills-check-last-run.txt"
$today = (Get-Date).ToString("yyyy-MM-dd")
if ((Test-Path $stamp) -and ((Get-Content $stamp -Raw).Trim() -eq $today)) { exit 0 }

$checkScript = Join-Path $env:USERPROFILE ".claude\skills\ae49-task-update-skills\scripts\update-skills.ps1"

try {
  $output = & $checkScript | Out-String
  Set-Content -Path $stamp -Value $today -Encoding ascii
  $note = "Daily AE49 skills-repo check (dry run, first session today; SessionStart hook). " +
          "Nothing was written. If drift appears below, settle it per the ae49-task-update-skills " +
          "Workflow (owner ruling 2026-08-24, reaffirmed 2026-09-15): the repo wins - look which side " +
          "is newer yourself, copy repo-newer items down from the machine's AE49_ClaudeSkills clone " +
          "WITHOUT asking, never apply the UPDATE CLAUDE.md line (it is the public-repo scrub, not " +
          "drift), then report what changed in one short block (ae49-ref-report-format). Applied " +
          "skills load next session. If everything matches, one short line is enough. Raw output:`n" + $output
  @{ hookSpecificOutput = @{ hookEventName = "SessionStart"; additionalContext = $note } } |
    ConvertTo-Json -Depth 4 | Write-Output
} catch {
  $note = "Daily AE49 skills-repo check FAILED (likely no network): $($_.Exception.Message). " +
          "Stamp not written - it will retry on the next session start. Mention this to the user in one line."
  @{ hookSpecificOutput = @{ hookEventName = "SessionStart"; additionalContext = $note } } |
    ConvertTo-Json -Depth 4 | Write-Output
  exit 0
}

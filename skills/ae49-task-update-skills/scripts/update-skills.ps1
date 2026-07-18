# Sync user-level skills in ~/.claude/skills from the AE49_ClaudeSkills GitHub repo,
# plus the user-level CLAUDE.md (repo dotclaude/CLAUDE.md -> ~/.claude/CLAUDE.md).
# Dry-run by default; pass -Apply to actually copy. Never deletes local-only skills.
param(
  [switch]$Apply
)

$ErrorActionPreference = "Stop"

$RepoUrl   = "https://github.com/Varuj-Lim/AE49_ClaudeSkills.git"
$SkillsDir = Join-Path $env:USERPROFILE ".claude\skills"
$TmpDir    = Join-Path $env:TEMP ("ae49-skills-update-" + [guid]::NewGuid().ToString("N"))
# The bootstrapper itself. It lives in the repo (backup + cross-machine bootstrap) but is
# NEVER auto-synced — mirroring it would overwrite the script that is currently running.
# Update the tool by editing + pushing, then copy it into ~/.claude/skills by hand.
$SelfSkill = "ae49-task-update-skills"

# Hash file content with line endings normalized, so a CRLF-vs-LF checkout
# difference between git and the local copy doesn't read as a change.
function Get-ContentKey([string]$Path) {
  $bytes = [System.IO.File]::ReadAllBytes($Path)
  $text  = [System.Text.Encoding]::UTF8.GetString($bytes) -replace "`r`n", "`n"
  $sha   = [System.Security.Cryptography.SHA256]::Create()
  try {
    $hash = $sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($text))
    return [BitConverter]::ToString($hash)
  } finally {
    $sha.Dispose()
  }
}

# True when the repo skill folder and the local skill folder have the same
# files with the same (line-ending-normalized) content.
function Test-SkillSame([string]$Src, [string]$Dst) {
  $srcFiles = @(Get-ChildItem $Src -Recurse -File | ForEach-Object { $_.FullName.Substring($Src.Length + 1) } | Sort-Object)
  $dstFiles = @(Get-ChildItem $Dst -Recurse -File | ForEach-Object { $_.FullName.Substring($Dst.Length + 1) } | Sort-Object)
  if (Compare-Object $srcFiles $dstFiles) { return $false }
  foreach ($rel in $srcFiles) {
    if ((Get-ContentKey (Join-Path $Src $rel)) -ne (Get-ContentKey (Join-Path $Dst $rel))) { return $false }
  }
  return $true
}

if (-not (Test-Path $SkillsDir)) { throw "Skills folder not found: $SkillsDir" }

Write-Output "Fetching $RepoUrl ..."
git clone -c core.autocrlf=false --depth 1 --quiet $RepoUrl $TmpDir
if ($LASTEXITCODE -ne 0) { throw "git clone failed (exit $LASTEXITCODE) - is the network up?" }

try {
  $repoSkillsRoot = Join-Path $TmpDir "skills"
  if (-not (Test-Path $repoSkillsRoot)) { throw "The repo has no skills/ folder - layout changed?" }

  $repoSkills = @(Get-ChildItem $repoSkillsRoot -Directory | Where-Object { $_.Name -ne $SelfSkill })
  $added = @(); $updated = @(); $unchangedCount = 0

  foreach ($skill in $repoSkills) {
    $target = Join-Path $SkillsDir $skill.Name
    if (-not (Test-Path $target)) {
      $added += $skill.Name
    } elseif (Test-SkillSame $skill.FullName $target) {
      $unchangedCount++
    } else {
      $updated += $skill.Name
    }
  }

  $repoNames = $repoSkills | ForEach-Object { $_.Name }
  $localOnly = @(Get-ChildItem $SkillsDir -Directory | Where-Object { $repoNames -notcontains $_.Name -and $_.Name -ne $SelfSkill } | ForEach-Object { $_.Name })

  # Also mirror the user-level CLAUDE.md: repo dotclaude/CLAUDE.md -> ~/.claude/CLAUDE.md.
  # Skipped silently if the repo has no dotclaude/CLAUDE.md. Repo wins on apply, same as skills
  # — so a local hand-edit to ~/.claude/CLAUDE.md that isn't pushed to the repo is overwritten.
  $repoClaude  = Join-Path $TmpDir "dotclaude\CLAUDE.md"
  $localClaude = Join-Path $env:USERPROFILE ".claude\CLAUDE.md"
  $claudeState = "skip"
  if (Test-Path $repoClaude) {
    if (-not (Test-Path $localClaude)) { $claudeState = "add" }
    elseif ((Get-ContentKey $repoClaude) -ne (Get-ContentKey $localClaude)) { $claudeState = "update" }
    else { $claudeState = "unchanged" }
  }
  $claudeChanged = ($claudeState -eq "add" -or $claudeState -eq "update")

  if ($Apply) {
    foreach ($name in ($added + $updated)) {
      $src = Join-Path $repoSkillsRoot $name
      $dst = Join-Path $SkillsDir $name
      # /MIR per skill folder so files deleted in the repo version are removed too.
      robocopy $src $dst /MIR /NJH /NJS /NDL /NFL /NP | Out-Null
      if ($LASTEXITCODE -ge 8) { throw "robocopy failed for $name (exit $LASTEXITCODE)" }
    }
    if ($claudeChanged) { Copy-Item $repoClaude $localClaude -Force }
  }

  $mode = "DRY RUN"
  if ($Apply) { $mode = "APPLY" }
  Write-Output ""
  Write-Output "== AE49 skills update ($mode) =="
  foreach ($name in $added)   { Write-Output "ADD      $name  (in repo, not on this machine)" }
  foreach ($name in $updated) { Write-Output "UPDATE   $name  (local differs from repo; repo version wins on apply)" }
  Write-Output "unchanged: $unchangedCount"
  if ($localOnly.Count -gt 0) { Write-Output "local-only, never touched: $($localOnly -join ', ')" }
  Write-Output "self (bootstrapper, never synced): $SelfSkill"
  switch ($claudeState) {
    "add"    { Write-Output "ADD      CLAUDE.md  (user-level; in repo, not on this machine)" }
    "update" { Write-Output "UPDATE   CLAUDE.md  (user-level; local differs from repo; repo version wins on apply)" }
  }

  if (-not $Apply) {
    if (($added.Count + $updated.Count) -eq 0 -and -not $claudeChanged) {
      Write-Output ""
      Write-Output "Everything already matches the repo. Nothing to do."
    } else {
      Write-Output ""
      Write-Output "DRY RUN - nothing written. Re-run with -Apply to update."
    }
  } else {
    $claudeNote = ""
    if ($claudeChanged) { $claudeNote = " + CLAUDE.md" }
    Write-Output ""
    Write-Output "Done: $($added.Count) added, $($updated.Count) updated$claudeNote."
  }
} finally {
  Remove-Item -Recurse -Force $TmpDir -ErrorAction SilentlyContinue
}

exit 0

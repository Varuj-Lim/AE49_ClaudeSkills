# Runs one command on a builder's private emulator suite, with its own TEMP so its exit cannot delete the owner's
# Storage files (web-ref-local-emulator section 1b). The only allowed way to run emulators:exec from an agent.
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File "$HOME/.claude/skills/web-ref-local-emulator/resources/private-suite.ps1" `
#     -Only firestore,auth -Project demo-x -Config <firebase.json with free ports> -Run "node scripts/dev/verify-x.cjs"
param(
  [Parameter(Mandatory = $true)][string]$Only,
  [Parameter(Mandatory = $true)][string]$Project,
  [Parameter(Mandatory = $true)][string]$Config,
  [Parameter(Mandatory = $true)][string]$Run
)
$ErrorActionPreference = "Stop"

function Refuse($message) { Write-Error "private-suite refused: $message"; exit 2 }

if ($Project -notmatch '^demo-') { Refuse "the project id must start with demo-, so it cannot reach real data: $Project" }
if (-not (Test-Path $Config)) { Refuse "config not found: $Config" }

$emulators = (Get-Content $Config -Raw | ConvertFrom-Json).emulators
foreach ($name in ($Only -split ',')) {
  $entry = $emulators.$($name.Trim())
  if (-not $entry -or -not $entry.port) { Refuse "the config pins no port for $name" }
}
foreach ($pair in @(@{ name = "hub"; entry = $emulators.hub }, @{ name = "logging"; entry = $emulators.logging })) {
  if (-not $pair.entry -or -not $pair.entry.port) { Refuse "the config pins no port for $($pair.name)" }
}
if (($Only -split ',') -contains "firestore" -and -not $emulators.firestore.websocketPort) { Refuse "the config pins no firestore websocketPort" }

$temp = Join-Path ([IO.Path]::GetTempPath()) ("private-suite-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force $temp | Out-Null
$env:TEMP = $temp
$env:TMP = $temp
Remove-Item Env:FIRESTORE_EMULATOR_HOST -ErrorAction SilentlyContinue
Remove-Item Env:FIREBASE_AUTH_EMULATOR_HOST -ErrorAction SilentlyContinue
Remove-Item Env:FIREBASE_STORAGE_EMULATOR_HOST -ErrorAction SilentlyContinue

$exitCode = 1
try {
  & npx.cmd firebase-tools emulators:exec --only $Only --project $Project --config $Config $Run
  $exitCode = $LASTEXITCODE
} finally {
  Remove-Item -Recurse -Force $temp -ErrorAction SilentlyContinue
}
exit $exitCode

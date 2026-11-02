# Runs one command on a builder's private emulator suite, with its own TEMP so its exit cannot delete the owner's
# Storage files (web-ref-local-emulator section 1b). The only allowed way to run emulators:exec from an agent. The demo- id
# binds the CLI, not the -Run script: name every service the script uses in -Only, and let it gate on assert-emulator.cjs.
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File "$HOME/.claude/skills/web-ref-local-emulator/resources/private-suite.ps1" `
#     -Only firestore,auth -Project demo-x -Config <firebase.json with free ports> -Run "node scripts/dev/verify-x.cjs"
param(
  [Parameter(Mandatory = $true)][string[]]$Only,
  [Parameter(Mandatory = $true)][string]$Project,
  [Parameter(Mandatory = $true)][string]$Config,
  [Parameter(Mandatory = $true)][string]$Run
)
$ErrorActionPreference = "Stop"

$Only = ($Only -join ",")

function Refuse($message) { [Console]::Error.WriteLine("private-suite refused: $message"); exit 2 }

if ($Project -notmatch '^demo-') { Refuse "the project id must start with demo-: $Project" }
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

# The owner's suite runs on the ports in the project's own firebase.json; sharing one would make the launcher reuse this run.
if (Test-Path "firebase.json") {
  $shared = @{}
  (Get-Content "firebase.json" -Raw | ConvertFrom-Json).emulators.PSObject.Properties | ForEach-Object {
    if ($_.Value.port) { $shared[[string]$_.Value.port] = $_.Name }
    if ($_.Value.websocketPort) { $shared[[string]$_.Value.websocketPort] = $_.Name }
  }
  $emulators.PSObject.Properties | ForEach-Object {
    foreach ($port in @($_.Value.port, $_.Value.websocketPort)) {
      if ($port -and $shared.ContainsKey([string]$port)) { Refuse "port $port is the shared suite's $($shared[[string]$port]) port" }
    }
  }
}

$temp = Join-Path ([IO.Path]::GetTempPath()) ("private-suite-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force $temp | Out-Null
$env:TEMP = $temp
$env:TMP = $temp
Remove-Item Env:FIRESTORE_EMULATOR_HOST -ErrorAction SilentlyContinue
Remove-Item Env:FIREBASE_AUTH_EMULATOR_HOST -ErrorAction SilentlyContinue
Remove-Item Env:FIREBASE_STORAGE_EMULATOR_HOST -ErrorAction SilentlyContinue
Remove-Item Env:STORAGE_EMULATOR_HOST -ErrorAction SilentlyContinue

$exitCode = 1
try {
  & npx.cmd firebase-tools emulators:exec --only $Only --project $Project --config $Config $Run
  $exitCode = $LASTEXITCODE
} finally {
  Remove-Item -Recurse -Force $temp -ErrorAction SilentlyContinue
}
exit $exitCode

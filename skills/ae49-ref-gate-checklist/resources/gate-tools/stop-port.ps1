# stop-port.ps1 <port> — kill ONLY the headless Chrome that listens on this debugging port (never another gate's).
param([Parameter(Mandatory=$true)][int]$Port)
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
  Where-Object { $_.CommandLine -match "--remote-debugging-port=$Port(\s|$)" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; "stopped $($_.ProcessId)" }

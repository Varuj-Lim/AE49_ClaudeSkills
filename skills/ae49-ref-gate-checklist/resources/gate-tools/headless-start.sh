#!/usr/bin/env bash
# headless-start.sh <url> — start a fresh headless Chrome on $CDP_PORT (default 9333), sign it in on the project's
# EMULATOR app through the app's impersonation hand-off (mint-emu-token.cjs), then open <url>.
# Run from the project root (it reads .claude/gate-tools.json). Each port gets its own user-data dir under
# $GATE_WORK (default: $TMP/ae49-gate), so two gates never share a profile.
#   CDP_PORT=9334 bash headless-start.sh http://localhost:3001/rd
set -u
PORT="${CDP_PORT:-9333}"
T="$(cd "$(dirname "$0")" && pwd)"
WORK="${GATE_WORK:-${TMP:-/tmp}/ae49-gate}"
mkdir -p "$WORK/chrome-$PORT"
APP=$(node -e 'console.log(require(process.cwd()+"/.claude/gate-tools.json").appUrl)')
KEYS=$(node -e 'const k=require(process.cwd()+"/.claude/gate-tools.json").impersonationKeys;console.log(k.marker+" "+k.token)')
MK=${KEYS% *}; TK=${KEYS#* }
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
"$CHROME" --headless=new --disable-gpu --remote-debugging-port="$PORT" --user-data-dir="$WORK/chrome-$PORT" \
  --window-size=1600,1000 "$APP/login" > /dev/null 2>&1 &
for i in $(seq 1 20); do curl -s -m 2 "http://127.0.0.1:$PORT/json/version" >/dev/null && break; sleep 1; done
J=$(node "$T/mint-emu-token.cjs") || { echo "mint failed"; exit 1; }
sleep 3
CDP_PORT="$PORT" node "$T/cdp.mjs" eval "(()=>{const j=$J; sessionStorage.setItem('$MK', JSON.stringify(j.marker)); sessionStorage.setItem('$TK', j.token); location.href='$1'; return 'set';})()"
sleep 12
# a cold dev server can answer the first hop with chrome-error; navigate once more after sign-in
CDP_PORT="$PORT" node "$T/cdp.mjs" nav "$1" > /dev/null
CDP_PORT="$PORT" node "$T/cdp.mjs" eval "({port: $PORT, path: location.pathname, signedIn: !/login/.test(location.pathname)})"

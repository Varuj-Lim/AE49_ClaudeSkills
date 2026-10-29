#!/usr/bin/env bash
# headless-start.sh <url> — start a fresh headless Chrome on $CDP_PORT (default: the config's cdpMainPort, else 9333),
# refusing a port outside cdpMainPort…cdpMainPort+6 or one that already listens (delegated.md § Ports), sign it in on the project's
# EMULATOR app through the app's impersonation hand-off (mint-emu-token.cjs), then open <url>.
# Run from the project root (it reads .claude/gate-tools.json). <url> must start with the config's appUrl.
# Each port gets its own user-data dir under $GATE_WORK (default: $TMP/ae49-gate). GATE_ACCOUNT_EMAIL picks
# another account than the config's (restart Chrome to switch).
#   CDP_PORT=9334 bash headless-start.sh http://localhost:3001/rd   (AE49: cdpMainPort 9333 → agents 9334…9339)
# The tab first opens $APP/favicon.ico, not /login: a hub's EMULATOR /login auto-signs-in the Developer driver the
# moment it renders (CCP_Hub `ccphub-emu-autologin`), which beat the marker and left the tab signed in as the WRONG
# person while `signedIn` still read true (CCP_Hub OI-55, owner Q15 a, 2026-10-29). The last line also reports
# `identity` — the Firebase user the tab really holds against the minted uid — and `signedIn` is false on a mismatch.
set -u
URL="${1:?usage: headless-start.sh <url under appUrl>}"
MAINPORT=$(node -e 'const c=require(require("path").join(process.cwd(),".claude","gate-tools.json"));console.log(c.cdpMainPort||9333)')
PORT="${CDP_PORT:-$MAINPORT}"
if [ "$PORT" -lt "$MAINPORT" ] || [ "$PORT" -gt "$((MAINPORT + 6))" ]; then echo "refuse: port $PORT is outside this project's range $MAINPORT…$((MAINPORT + 6))"; exit 1; fi
if curl -s -m 2 "http://127.0.0.1:$PORT/json/version" >/dev/null || curl -s -m 2 -g "http://[::1]:$PORT/json/version" >/dev/null; then echo "refuse: port $PORT already has a Chrome — pick another port of $MAINPORT…$((MAINPORT + 6))"; exit 1; fi
T="$(cd "$(dirname "$0")" && pwd)"
WORK="${GATE_WORK:-${TMP:-/tmp}/ae49-gate}"
APP=$(node -e 'console.log(require(require("path").join(process.cwd(),".claude","gate-tools.json")).appUrl)')
node -e 'process.exit(new URL(process.argv[1]).origin===new URL(process.argv[2]).origin?0:1)' "$URL" "$APP" || { echo "refuse: $URL is not on the origin of $APP"; exit 1; }
KEYS=$(node -e 'const k=require(require("path").join(process.cwd(),".claude","gate-tools.json")).impersonationKeys;console.log(k.marker+" "+k.token)')
MK=${KEYS% *}; TK=${KEYS#* }
# mint BEFORE Chrome starts, so a failed mint never leaves an orphan Chrome on the port (audit GA-5)
J=$(node "$T/mint-emu-token.cjs") || { echo "mint failed"; exit 1; }
mkdir -p "$WORK/chrome-$PORT"
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
"$CHROME" --headless=new --disable-gpu --remote-debugging-port="$PORT" --user-data-dir="$WORK/chrome-$PORT" \
  --window-size=1600,1000 "$APP/favicon.ico" > /dev/null 2>&1 &
for i in $(seq 1 20); do curl -s -m 2 "http://127.0.0.1:$PORT/json/version" >/dev/null && break; sleep 1; done
sleep 2
CDP_PORT="$PORT" node "$T/cdp.mjs" eval "(()=>{const j=$J; sessionStorage.setItem('$MK', JSON.stringify(j.marker)); sessionStorage.setItem('$TK', j.token); location.href='$URL'; return 'set';})()" > /dev/null
sleep 12
# a cold dev server can answer the first hop with chrome-error; navigate once more after sign-in
CDP_PORT="$PORT" node "$T/cdp.mjs" nav "$URL" > /dev/null
# signed in = on the app's origin, at the asked path, not on /login (a chrome-error page has path "/" — GA-5)
# identity = the uid in the Firebase auth record the tab holds (session or local storage) vs the minted targetUid:
# "ok" / "mismatch:<uid>" / "unknown" (no record readable — e.g. IndexedDB persistence; then check the app's banner by eye)
WANT=$(node -e 'console.log(JSON.parse(process.argv[1]).marker.targetUid)' "$J")
CDP_PORT="$PORT" node "$T/cdp.mjs" eval "(()=>{const s=(p)=>p.endsWith('/')?p.slice(0,-1):p; const uids=[]; for (const st of [sessionStorage, localStorage]) for (let i=0;i<st.length;i++){const k=st.key(i); if(k&&k.startsWith('firebase:authUser:')){try{uids.push(JSON.parse(st.getItem(k)).uid)}catch(e){}}} const identity = uids.length===0 ? 'unknown' : (uids.includes('$WANT') && uids.every(u=>u==='$WANT')) ? 'ok' : 'mismatch:'+uids.join(','); const onPage = location.origin === new URL('$APP').origin && s(location.pathname).startsWith(s(new URL('$URL').pathname)) && !location.pathname.includes('login'); return {port: $PORT, at: location.href, identity, signedIn: onPage && !identity.startsWith('mismatch')};})()"

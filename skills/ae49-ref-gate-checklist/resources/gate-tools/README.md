# gate-tools: headless-Chrome gate tools (ae49-ref-gate-checklist)

These are used by Main (port 9333) and by `ae49-gate` sub-agents (ports 9334 and up) to run a gate's screen items against the project's **emulator** app. They moved here from a session scratchpad on 2026-10-16 (plan `ae49-gate-agent`, owner AQ1 a), because that scratchpad could be wiped.

## Project config: `<project>/.claude/gate-tools.json` (committed in the project, never here)

```json
{ "projectId": "<firebase project id>", "appUrl": "http://localhost:<emulator app port>",
  "authEmulator": "127.0.0.1:<auth port>", "firestoreEmulator": "127.0.0.1:<firestore port>",
  "accountEmail": "<the gate account>", "impersonationKeys": { "marker": "<sessionStorage key>", "token": "<key>" } }
```

`emu-admin.cjs` (used by `mint-emu-token.cjs` and `emu-sweep.cjs`) refuses to run unless both hosts are on `127.0.0.1`. `headless-start.sh` refuses a URL outside `appUrl`. Sign-in goes through the app's own impersonation hand-off, so no password is ever typed. `GATE_ACCOUNT_EMAIL` overrides the account for a single run.

## Files

| File | Use |
|---|---|
| `headless-start.sh <url>` | `CDP_PORT=<port> GATE_WORK=<dir> bash headless-start.sh <url>` starts Chrome on that port with its own profile, signs in, opens the url, and prints `signedIn`. |
| `cdp.mjs <cmd> <arg>` | `CDP_PORT=<port> node cdp.mjs …` covers eval / nav / paste / undo / key / type / enter / clickxy / file / shot / grant / grantp / dialog / throttle / throttled-eval. `CDP_URL_MATCH` picks a tab. |
| `cdp-dialog.mjs` | Accepts a pending beforeunload dialog on every tab of that port. |
| `stop-port.ps1 -Port <n>` | Kills only the Chrome on that debugging port. Call it as `powershell -NoProfile -ExecutionPolicy Bypass -File stop-port.ps1 -Port <n>` (this machine's policy is Restricted). Never kill Chrome by name. |
| `emu-admin.cjs` | `const { admin, db, cfg } = require("<tools>/emu-admin.cjs")` — the ONLY way a gate script reaches Firestore / Auth: refuses non-127.0.0.1 hosts, never reads `.env.local`, no Storage. |
| `emu-sweep.cjs <tag> <cols> [--apply]` | Deletes the gate's own `isTestData` + `testBatch` docs on the emulator; dry run first. Never use a project cleanup script that reads `.env.local` (it hits production). |
| `mint-emu-token.cjs` | Used by `headless-start.sh`. |

## Rules

Ports belong to their owner: Main uses 9333, and each agent uses the one port Main named. Two gates never use the same set or record. Each gate tags its seeds with its own `testBatch` and sweeps them afterwards. See `delegated.md`.

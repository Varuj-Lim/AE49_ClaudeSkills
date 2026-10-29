# gate-tools: headless-Chrome gate tools (ae49-ref-gate-checklist)

These are used by Main (port `9d33`) and by `ae49-gate` sub-agents (ports `9d34`…`9d39`) — `d` is the project's port-scheme thousands digit, set as `cdpMainPort` in the project config (`delegated.md` § Ports) to run a gate's screen items against the project's **emulator** app. They moved here from a session scratchpad on 2026-10-16 (plan `ae49-gate-agent`, owner AQ1 a), because that scratchpad could be wiped.

## Project config: `<project>/.claude/gate-tools.json` (committed in the project, never here)

```json
{ "projectId": "<firebase project id>", "appUrl": "http://localhost:<emulator app port>",
  "authEmulator": "127.0.0.1:<auth port>", "firestoreEmulator": "127.0.0.1:<firestore port>",
  "accountEmail": "<the gate account>", "impersonationKeys": { "marker": "<sessionStorage key>", "token": "<key>" },
  "cdpMainPort": <9d33 — 9333 AE49 · 9433 NURI · 9533 CCP · 9633 AWDC> }
```

`emu-admin.cjs` (used by `mint-emu-token.cjs` and `emu-sweep.cjs`) refuses to run unless both hosts are on `127.0.0.1`. `headless-start.sh` refuses a URL outside `appUrl`. Sign-in goes through the app's own impersonation hand-off, so no password is ever typed. `GATE_ACCOUNT_EMAIL` overrides the account for a single run.

## Files

| File | Use |
|---|---|
| `headless-start.sh <url>` | `CDP_PORT=<port> GATE_WORK=<dir> bash headless-start.sh <url>` starts Chrome on that port with its own profile, signs in, opens the url, and prints `identity` (`ok` / `mismatch:<uid>` / `unknown` — the Firebase user the tab really holds vs the minted account) and `signedIn` (false on a mismatch). It opens `favicon.ico` first so a hub's emulator `/login` auto-login cannot sign the tab in as the wrong person (CCP_Hub OI-55, 2026-10-29); on `unknown`, read the app's "signed in as" banner before any step. |
| `cdp.mjs <cmd> <arg>` | `CDP_PORT=<port> node cdp.mjs …` covers eval / nav / paste / undo / key / type / enter / clickxy / file / shot / grant / grantp / dialog / throttle / throttled-eval. `CDP_URL_MATCH` picks a tab. |
| `cdp-dialog.mjs` | Accepts a pending beforeunload dialog on every tab of that port. |
| `stop-port.ps1 -Port <n>` | Kills only the Chrome on that debugging port. Call it as `powershell -NoProfile -ExecutionPolicy Bypass -File stop-port.ps1 -Port <n>` (this machine's policy is Restricted). Never kill Chrome by name. |
| `emu-admin.cjs` | `const { db, auth, cfg } = require("<tools>/emu-admin.cjs")`, required FIRST — the ONLY way a gate script reaches Firestore / Auth: refuses non-127.0.0.1 hosts or an already-initialised firebase-admin, never reads `.env.local`, Storage pointed at a dead port and not exported. |
| `emu-sweep.cjs <tag> <cols> [--apply]` | Deletes the gate's own `isTestData` + `testBatch` docs on the emulator, top-level collections only (seed no subcollections, or sweep them yourself through `emu-admin`); dry run first. Never use a project cleanup script that reads `.env.local` (it hits production). |
| `mint-emu-token.cjs` | Used by `headless-start.sh`. |

## Rules

Ports belong to their owner: Main uses `cdpMainPort`, and each agent uses the one port Main named from `cdpMainPort + 1`…`+ 6` — never a port of another project's range. Two gates never use the same set or record. Each gate tags its seeds with its own `testBatch` and sweeps them afterwards. See `delegated.md`.

---
name: web-ref-local-emulator
description: The shared local-emulator discipline for every hub project (AE49_Hub, Nuri_Hub, and future siblings) that runs a Firebase emulator suite behind one-click .cmd launchers — who presses the launchers (the OWNER, never Claude; a build agent's private self-closing `emulators:exec` on its own ports is the one exception), probe-before-naming-a-button, the trusted aliveness check, the cross-project port scheme, the look-alike-process safe-kill rule (netstat ports + image name), refresh in both suite states, and the stale-build-cache 404 trap. Use whenever starting, stopping, refreshing, or debugging a project's emulator, before telling the user to press any launcher, or when a launcher/emulator ruling lands — the rule changes HERE once, project skills keep only their own ports and paths.
---

# Local emulator — shared discipline

One set of rules for every hub's emulator suite (each project keeps its own
ports, launcher paths, dev password, and gate table in its own skill or
manual). **Owner rulings 2026-08-25, after two same-day collisions.**

## 1. Launchers are OWNER-clicked ONLY

The three one-click buttons (start `dev-emu.cmd`, safe-close
`stop-emu.cmd`, snapshot `refresh-emu-data.cmd`) are pressed by the owner —
**Claude NEVER runs them**: not from Bash, not from PowerShell, not in the
background. A harness-launched suite lives in a shell the owner cannot see
or Ctrl+C; their own next click then lands in "reuse" mode (one window
instead of two) and the two dev servers collide on the app port.

Claude's part is READ-ONLY: probe, `netstat`, read logs, diagnose, then
NAME the button. Killing a stray PID (per rule 6) or deleting the emulator
build cache BETWEEN the owner's clicks is fine — starting/stopping/
refreshing is not.

### 1b. A builder's PRIVATE, self-closing suite is allowed (owner Q13 a, 2026-10-29)

One exception to rule 1: a headless build or audit agent may prove ITS OWN worktree's rules
with a private `firebase emulators:exec` run, when ALL of these hold:
- **Own ports** — a block no launcher and no other project uses (inside the project's own
  thousands digit, on a hundreds layer the launchers never take; CCP_Hub's first one used
  5220–5226). Never the shared suite ports, never the app ports.
- **Own project id** — a separate `demo-…` id (e.g. `demo-ccphub-tkport`), so it shares no data
  with the owner's suite.
- **Self-closing** — `emulators:exec "<the probe command>"`: the suite starts, runs the one
  command, and exits with it. Never `emulators:start`, never left running, never in the background
  past the agent's own run.
- **Hands off the launchers** — it never runs `dev-emu.cmd` / `stop-emu.cmd` /
  `refresh-emu-data.cmd`, never kills a process on the shared port block, never touches
  `.dev-emulator-data`.
- **Own temp folder (owner 2026-10-29 Q1 a, CCP_Hub OI-57)** — the run sets `TEMP` and `TMP` to a folder in the
  agent's own scratchpad, and its config pins every port it opens (the Firestore websocket and the hub included).
  Every Storage emulator on the machine otherwise shares `%TEMP%\firebase\storage`, and a private suite DELETES that
  folder when it exits — the owner's running Storage emulator then dies on its next upload (`ENOENT …
  firebase\storage\blobs\…` → "An unexpected error has occurred"), taking Auth and the hub with it. From Git Bash, put
  the env lines and the `npx.cmd firebase-tools emulators:exec …` call in a small `.ps1` run with
  `powershell -NoProfile -ExecutionPolicy Bypass -File` (an env prefix in front of `npx.cmd` breaks on the space in
  `C:\Program Files`). Proved once on 2026-10-29: a private Firestore + Storage run with its own TEMP exited and the
  owner's suite kept its PIDs and its `blobs` folder.
Main still re-runs the probe in the hub, on the owner's suite, before the gate — the private run is
early evidence, not the gate's. Why: on 2026-10-29 the tickets B2+B3 builder did exactly this to prove
its new `replies` rule before merge; the owner ruled it fine (Q13 a) because nothing in rule 1's fear —
a hidden shell holding the owner's ports, a collision on the next click — can happen with it. Cost: about
1 GB of RAM (Java) per run, so several at once may slow the machine.

## 2. Probe BEFORE naming a button — every time

Never tell the owner to press a launcher without checking the live state
first (the suite hub + the app port) and saying what was found. **"Already
up — press nothing" is a normal and common answer.** Telling an owner to
start what is already running causes the exact collision rule 1 prevents.

## 3. The only trusted aliveness check

The suite is "up" ONLY when its **hub endpoint** answers
(`curl http://127.0.0.1:<hub-port>/emulators` with JSON naming
`firestore`). A bare connect on the Firestore port has false-positived
against a foreign process. Each project's skill names its hub port.

## 4. The port scheme (shared ruling 2026-08-24)

Thousands digit = project, hundreds digit = layer — so two hubs run app +
full suite side by side with zero overlap. Concrete numbers live in each
project's own skill/manual, never here.

## 5. The stale-build-cache 404 trap

After a big route refactor, a restarted emulator dev server can serve the
OLD route table out of its separate build-cache dir: whole sections 404
with the app's own chrome still rendering, while the files plainly exist
(the login route still works; the dev badge reads "(stale)"). Fix — routed
through the owner's clicks per rule 1: owner presses safe-close (it exports
data first; the X button loses it) → Claude deletes the emulator build
cache → owner presses start.

**Signature to confirm it (2026-09-08):** the SAME URL answers 200 on the
production-data dev server and 404 on the emulator one, and every DYNAMIC
route (`/…/[id]/view`) 404s while list pages still render — check with
`curl -o /dev/null -w "%{http_code}"` against both app ports before naming
a button.

**Prevention — ruled 2026-09-08 after the cache had grown to 21 GB / 39 GB
(emulator / production dev servers of one hub):**
1. The dev cache must not persist on disk. Next 16 keeps Turbopack's dev
   cache under `<distDir>/dev` by default and never prunes it; each project
   turns that off in its Next config (`experimental.
   turbopackFileSystemCacheForDev: false`) so the cache lives in memory,
   nothing grows, and a restart starts clean. Production builds are untouched.
2. **Main tells the owner to restart BEFORE the gate** whenever it has staged
   a LARGE build (roughly 10+ files copied into the hub tree at once) while
   the emulator dev server is up — that HMR burst is exactly what corrupts
   the route table. Say it in the gate hand-over, never assume the running
   server absorbed the change.
3. Between the owner's clicks, Claude deletes a bloated dist dir (the
   emulator's when the suite is safe-closed; the production dev server's
   only while that launcher is closed) — deleting is fine, starting is not.

## 6. Killing look-alike processes safely (ruling 2026-08-26)

Two hubs' suites are IDENTICAL in a process listing — the same
`npm run emu` → npx firebase-tools → java chain with the same relative
`--import` argument — so a "stray-looking" java/node tree may be the OTHER
project's LIVE suite (on 2026-08-26 only a port check stopped exactly that
kill). Before killing anything emulator-ish: map each PID to its LISTENING
ports via `netstat -ano` and touch only PIDs on THIS project's port block;
then kill by IMAGE NAME only — `java.exe` or `node.exe`. Any other image
on the port is reported and LEFT RUNNING. The launchers encode this as
their `:killif` subroutine; ad-hoc kills between the owner's clicks follow
the same two checks.

## 7. Refresh works in BOTH suite states (owner request 2026-08-26)

`refresh-emu-data.cmd` does not require the suite to be up. Suite UP →
live wipe-import into the running emulator. Suite DOWN → a TEMPORARY
headless suite (`firebase emulators:exec`) imports the fresh production
snapshot, saves it into `.dev-emulator-data`, and exits — the next
`dev-emu.cmd` start boots straight into that snapshot. Rule 1 is
unchanged either way: the OWNER presses the button.

## 8. Launcher parity across hubs (owner ruling 2026-09-08)

Every hub carries the SAME five launcher files in `.claude/` — `dev.cmd`
(production dev), `dev-utc.cmd` (production dev with `TZ=UTC`, mimics App
Hosting for server-clock gates), `dev-emu.cmd`, `stop-emu.cmd`,
`refresh-emu-data.cmd` — plus the matching three `launch.json` entries
(`<hub>`, `<hub>-utc`, `<hub>-emu`, each with `autoPort: true`). The files
are byte-identical across hubs EXCEPT the project tokens: the app ports, the
emulator port block, the Firebase project id and the hub's display name.
Batch files stay pure ASCII (no em-dashes — cmd.exe reads them as ANSI).

- A launcher improvement made in one hub is ported to every sibling hub the
  SAME DAY, by that hub's own session — never by cross-editing another hub's
  repo. Main lists the exact hunks in a handoff for the sibling session. The
  prompt itself follows `web-task-handoff-prompt` (the shared template).
- Each hub keeps ONE facts skill named `<hub>-ref-emulator` (ports, launcher
  names, sign-in, which gate runs where, script retargeting, known fixes)
  that mirrors its siblings section-for-section; this canon holds only the
  discipline.
- Verify parity with a normalised diff: substitute the sibling's ports /
  project id / name into its copy, `diff` it against this hub's file — zero
  non-comment differences is the pass condition (Main ran exactly this on
  2026-09-08: `dev.cmd` identical, the other three differed in comments only).

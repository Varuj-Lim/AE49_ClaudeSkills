---
name: web-ref-local-emulator
description: The shared local-emulator discipline for every hub project (AE49_Hub, Nuri_Hub, and future siblings) that runs a Firebase emulator suite behind one-click .cmd launchers — who presses the launchers (the OWNER, never Claude), probe-before-naming-a-button, the trusted aliveness check, the cross-project port scheme, and the stale-build-cache 404 trap. Use whenever starting, stopping, refreshing, or debugging a project's emulator, before telling the user to press any launcher, or when a launcher/emulator ruling lands — the rule changes HERE once, project skills keep only their own ports and paths.
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
NAME the button. Killing a stray PID or deleting the emulator build cache
BETWEEN the owner's clicks is fine — starting/stopping/refreshing is not.

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

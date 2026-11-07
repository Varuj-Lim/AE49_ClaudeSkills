---
name: ae49-task-agent-town
description: "Open, close or change Agent Town, the 3D town in the Claude app's Browser pane where Main and each sub-agent build one house per task, fed by Claude Code hooks; or its lineup test preset. Use on เปิดเมือง, ปิดเมือง, Agent Town, ดูเมือง, ปรับเมือง, ดูตัวละคร, เปิดเมือง lineup, /ae49-task-agent-town."
---

# Agent Town

Owner ruling 2026-11-06 (Q616 a, Q620 a): a 3D town (three.js) beside the chat. It is a page served from this machine and
shown in the Browser pane, because a Claude Code pane cannot draw WebGL. No model tokens are spent while it runs: hooks
write events, the page reads them.

## Files (this machine; mirrored in the skills repo under `agent-town/` and `hooks/`)

| File | Role |
|---|---|
| `~/.claude/hooks/agent-town-hook.cjs` | hook on PreToolUse (`*`), PostToolUse (`Agent\|Task`), SubagentStart, SubagentStop, Stop, UserPromptSubmit in `~/.claude/settings.json`; appends to `~/.claude/agent-town/state.json` (last 400 events) and rewrites `events.js` |
| `~/.claude/agent-town/town.html` | the town: robots, houses (11 stages), day / night, camera; polls `events.js` every 2 s; pauses while hidden |
| `~/.claude/agent-town/serve.cjs` | static server on `http://127.0.0.1:8049` (`--ensure` starts it detached only if nothing answers) |
| `<skills clone>/agent-town/install.cjs` | installs / updates the town on a machine: copies `agent-town/` to `~/.claude/agent-town` (keeps the machine's `state.json`, `events.js`, `*-source.glb`), the hook to `~/.claude/hooks/`, and adds the six hook entries to `~/.claude/settings.json` after a backup; `--dry-run` first; idempotent (owner Q639 a, 2026-11-06) |

## Verbs

**A bare `/ae49-task-agent-town` is a TOGGLE (owner 2026-11-06):** the town is OPEN when the server answers on
`http://127.0.0.1:8049/ping` or a Browser tab shows `127.0.0.1:8049` (`tabs_context`) → run **close**; otherwise run **open**.
Say in one line which one ran. Words win over the toggle: "เปิดเมือง" always opens, "ปิดเมือง" always closes, "ปรับเมือง" changes.

- **open** (เปิดเมือง): FIRST, if `~/.claude/agent-town/town.html` or `~/.claude/hooks/agent-town-hook.cjs` is missing, or the
  clone's `agent-town/` is newer (another machine — e.g. the owner's home PC): `git -C <skills clone> pull --ff-only`, then
  `node <skills clone>/agent-town/install.cjs --dry-run`, then without `--dry-run` (the clone's path is in this machine's local
  memory; usually `~/Documents/AE49_ClaudeSkills`); say in one line what it installed and that new hooks record from the NEXT
  session. Then `node "$HOME/.claude/agent-town/serve.cjs" --ensure`, then `preview_start` with
  `url: "http://127.0.0.1:8049/"` (the built-in browser). One line to the owner: the town is open, drag to turn the camera,
  🌙 for night, ⟲ to reset.
- **lineup** (เปิดเมือง lineup, ดูตัวละคร, เทียบโมเดล; owner 2026-11-07): the TEST preset, no real events. Same as **open**
  but `url: "http://127.0.0.1:8049/?lineup"`: every role in one row, all playing the same state, stepping through every state
  every 6 s; ◀ ⏸ ▶ step by hand, 🧍 switches between lineup and the live town. Use it after a new model or clip lands.
- **close** (ปิดเมือง): close the Browser tab showing `127.0.0.1:8049`, then stop the server — find the listener on port
  8049 and stop it ONLY if its command line is `…agent-town…serve.cjs` (PowerShell `Get-NetTCPConnection -LocalPort 8049`
  → `Get-CimInstance Win32_Process`). The hooks keep recording; that costs nothing noticeable.
- **change** (ปรับเมือง): the owner's wishes are edits to `town.html` (looks, motion, layout), the hook (what is recorded)
  or both. Settle each wish in the `ae49-ref-question-format` shape when it has a real choice; build; reload the page in
  the Browser pane and show a screenshot; then mirror the changed files into the skills repo clone (`agent-town/`,
  `hooks/`) and push it in the same turn (the `~/.claude/CLAUDE.md` skills-sync rule).

## How the town reads events

- Role per agent type: implement → Builder (red, four arms), implement-heavy → Heavy Builder (purple, shield),
  implement-docs / migrate / excel → Carrier (gold, crate), audit → Inspector (green, magnifier), gate → Tester (teal,
  laptop), plan → Planner (white, floating, hologram), explore / fetch → Scout (blue, jetpack), Main → Foreman.
- A house per task, found by the Agent call's description (shared words); stages: plot → planned → foundation → frame →
  walls → roof → inspection tape → red cone → tested → landed → lights on. Main's `land.cjs` marks a house landed
  (matched by `--plan <slug>`), `git push origin main` (not `main:backup`) lights every landed house.
- An agent whose dispatch the hook missed is woken from its own tool events (they carry `agent_type`).

## Limits

- Main and Planner wear the owner's rigged Tripo models with 9 clips; Builder wears an unrigged statue; the rest are robots
  built from simple shapes until their models arrive. Names shown in the town are English (owner 2026-11-07). A new model:
  the owner's concept art is `agent-town/reference/2026-11-07/`, the prompts follow `ae49-ref-3d-prompt`, the clip names
  and the model notes are in `agent-town/README.md`; check it in the **lineup** before calling it done.
- three.js loads from a CDN the first time; offline the page says so.
- RAM: about 150–250 MB while the page is visible; keep it closed while two builders and a gate Chrome run (16 GB machine).

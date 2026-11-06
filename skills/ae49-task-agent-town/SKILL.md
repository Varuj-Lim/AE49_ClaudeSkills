---
name: ae49-task-agent-town
description: Open, close or change Agent Town — the 3D town in the Claude app's Browser pane where Main and each sub-agent are robots that walk around and build one house per task, fed by Claude Code hooks. Use on เปิดเมือง, ปิดเมือง, Agent Town, ดูเมือง, ปรับเมือง, /ae49-task-agent-town.
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

## Verbs

- **open** (default; เปิดเมือง): `node "$HOME/.claude/agent-town/serve.cjs" --ensure`, then `preview_start` with
  `url: "http://127.0.0.1:8049/"` (the built-in browser). One line to the owner: the town is open, drag to turn the camera,
  🌙 for night, ⟲ to reset.
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

- The robots are built from simple shapes in code. A real `.glb` model can replace one later (same roles, clips
  `idle walk run work celebrate alarm question sleep carry_walk wave`, see the owner's reference
  `docs/assets/agent-town/reference-agents-2026-11-06.webp` in AE49_Hub).
- three.js loads from a CDN the first time; offline the page says so.
- RAM: about 150–250 MB while the page is visible; keep it closed while two builders and a gate Chrome run (16 GB machine).

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

- Role per agent type: implement → Builder (red), implement-heavy → Heavy Builder (orange, big), implement-docs /
  excel → Carrier (gold), migrate → Migrator (purple, data drums), audit → Inspector (green, propeller), gate → Tester
  (teal, spider legs), plan → Planner (white), explore / fetch → Scout (blue, jet flames), Main → Foreman.
- A house per task, found by the Agent call's description (shared words); stages: plot → planned → foundation → frame →
  walls → roof → inspection tape → red cone → tested → landed → lights on. Main's `land.cjs` marks a house landed
  (matched by `--plan <slug>`), `git push origin main` (not `main:backup`) lights every landed house, then clears it.
- An agent whose dispatch the hook missed is woken from its own tool events (they carry `agent_type`).

## Town design rules (owner, 2026-11-07; keep them when changing the town)

The owner set these one by one while building the town; the code that does each, and his words, are in
`agent-town/README.md` (mostly "Buildings, plots, trees and the circle"; the sit lift and the robots under "Real
models") and in the comments in `town.html`. A change that breaks one needs his word first.

1. **Only the owner's models.** Robots, buildings, trees, lamps and boxes are his Tripo exports; no building is drawn in code.
   Code draws only small things: the construction site (slab, scaffold, stakes, blueprint, tape), flags, cones, bushes,
   station props, robot add-ons (cape, jet flames, rotor) and the stand-ins shown until a model loads.
2. **Buildings are 2–3 × a robot's height** (a robot is about 2.04): `TARGET_H` / `MIN_H` / `MAX_FOOT`, low types
   stretched up. Plots, props and work spots scale with them, and no robot may stand or walk inside one.
3. **One building per job, from a shuffle bag:** every house type once before any repeats. The main building's type
   (SITE OFFICE) and the hall's (TOWN HALL) never go to a house.
4. **Work in progress is a construction site:** from the plan on, slab and scaffold with the building rising out of the
   ground; whole at "roof"; no square base once built.
5. **The main building** is the SITE OFFICE model at 2 × a house, north of the plaza (owner Q17 b).
6. **Rest in front of Main:** Main sits at the main building's door facing the others; everyone else sits on an arc in
   front facing Main. Sit / Sleep plays once and holds (no standing up and looping); every seated robot sits on the
   ground (the lift; Tester splays its spider legs instead). Main works standing at its seat, sits when its turn ends,
   and never stays stranded at a house or the hall.
7. **Jobs:** walk to the job's building and work there (a job with no house is done at the role's station); when done
   walk to the spot in front of Main, report facing Main, then walk back to the same seat. Walks go around the main building,
   the hall and every house's building.
8. **Cheer:** when a house lands, and again when a push lights it, everyone seated stands and claps, then sits again;
   Main walks to the landed house (on a push, to the front of the hall) to celebrate, then back to its seat.
9. **Push resets:** every `git push origin main`, in any repo (owner: "นับทุก push"), lights the landed houses and,
   6 s later, clears them (Main may still be at the hall); the main building, the hall and jobs still in progress stay.
10. **Colour and light:** each building type is re-coloured from Tripo's blue (its light lines keep their colour and
    glow once the house is lit; the two landmarks always glow); a lamp lights only from the underside of its arm's far end.
11. **Making a new model:** `ae49-ref-3d-prompt`; buildings isometric or three-quarter (a straight front view made
    Tripo's multi-view guess a flat slab); check it in the town (and robots in the lineup) before calling it done.

## Limits

- Every role wears the owner's rigged Tripo model (2026-11-07; README lists each one's quirks); a shape robot shows only
  until a model loads, or if it fails. Names shown in the town are English (owner 2026-11-07). A new model:
  the owner's concept art is `agent-town/reference/2026-11-07/`, the prompts follow `ae49-ref-3d-prompt`, the clip names
  and the model notes are in `agent-town/README.md`; check it in the **lineup** before calling it done.
- three.js loads from a CDN the first time; offline the page says so.
- RAM: about 150–250 MB while the page is visible; keep it closed while two builders and a gate Chrome run (16 GB machine).

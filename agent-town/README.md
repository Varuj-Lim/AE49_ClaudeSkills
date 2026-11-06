# Agent Town

A 3D town (three.js) where Main and each sub-agent walk around and build one house per task. Events come from Claude Code
hooks (no model calls): `hooks/agent-town-hook.cjs` writes `~/.claude/agent-town/events.js`; `serve.cjs` serves the folder
on http://127.0.0.1:8049 so the page runs in the Claude app's Browser pane.

Install on a machine: copy `town.html` and `serve.cjs` to `~/.claude/agent-town/`, the hook to `~/.claude/hooks/`, then add
to `~/.claude/settings.json` hooks: `PreToolUse` (matcher `*`), `PostToolUse` (matcher `Agent|Task`), `SubagentStart`,
`SubagentStop`, `Stop`, `UserPromptSubmit` → `node "<home>/.claude/hooks/agent-town-hook.cjs"`, and `SessionStart` →
nothing at SessionStart: open it with the skill `ae49-task-agent-town` (it starts the server on demand).

## Real models (2026-11-06)

`town.html`'s `MODEL_URLS` gives a role a `.glb` from `models/` (Builder: `models/builder-g70.glb`, from the owner's Tripo
export `Agenet Implement.glb`, 1.84 M triangles / 61 MB, kept on the machine only as `models/builder-source.glb`, gitignored).
`tools/decimate-glb.cjs <in> <out> --grid 70 --uvgrid 48` shrinks a single-mesh export by vertex clustering that respects UV
seams (80 k triangles, 5.5 MB, base-colour texture only). The model is a statue — no rig, no clips — so it moves as one piece;
a rigged export with the clip names in the skill would animate limbs. `preview-model.html?models=a.glb,b.glb` compares copies.
- **Planner (2026-11-06):** `models/planner.glb` — the owner's Tripo export, 10 k triangles, Mixamo rig (54 bones, names come back
  without the `:` through GLTFLoader), no clips. `town.html` poses it in code (`rigPose`: idle, walk, work = pointing, question =
  hand up, celebrate, wave, alarm, sleep) by turning bones about the Mixamo frame (faces +Z, left arm +X). Clips in a later export
  replace the code poses role by role.
- **Planner clips (2026-11-06, the owner's second export):** `models/planner.glb` now carries 9 clips (idle, walk, Pointing to the
  front, Typing / Writing / Using tablet, Thinking, Looking around / Searching, Wave / Nod, Cheer / Clap, Sit / Sleep). `MODEL_CLIPS`
  maps town states to clips (work alternates Pointing and Typing every 8 s); `playClip` cross-fades them through an
  AnimationMixer; the hips' horizontal drift is removed at load so walk plays in place. A model with no clips keeps the code poses.

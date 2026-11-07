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
- **Main + Planner (2026-11-07, the owner's third round):** `models/main.glb` (Main / foreman: black and gold, hood, 9.5 k
  triangles, 2K PBR, 4.2 MB) and a new `models/planner.glb` (9.0 MB). Both carry the same 9 clips, but the pointing clip is a
  Text2Motion clip named after its prompt ("Standing in place, the character extends the right arm forward "), so a
  `MODEL_CLIPS` name matches a clip by exact name or by prefix (`CLIP_SET("Standing in place")`). Both get `metalness: 0.25`:
  without an environment map a metallic PBR surface renders near black. How the art and prompts were made:
  `reference/2026-11-07/` and the skill `ae49-ref-3d-prompt`.
- **Colour maps are read as LINEAR (2026-11-07).** The renderer's output is linear (never set; the town's hex colours are
  tuned for it), while GLTFLoader marks a GLB's colour maps sRGB, so every model showed far darker than in Tripo (a mid-grey
  128 displayed as about 55). `loadModel` sets `map` / `emissiveMap` to `LinearEncoding`: a model now looks as Tripo shows
  it. `preview-model.html` still renders sRGB in and out, so it is not a colour reference for the town; the lineup is.
- **Tone (Main, owner Q4 a):** `MODEL_RIGGED.<role>.tone = { lift, cool, gold }` re-grades the base colour once at load —
  lifts the colourless darks to grey (colourful pixels such as painted lights and gold keep their values), leans the
  greys cool, makes the gold richer. Main: `{ lift: 40, cool: 10, gold: 1.25 }`. A cool rim light from behind lifts
  dark outlines off the ground.
- **Scout (2026-11-07):** `models/scout.glb` (9.4 k triangles, 4.3 MB, same 9 clips). The owner removed the jet flames from the
  art; `MODEL_JETS.scout` lists the two nozzle points (model units, measured from the rest pose) and `addJetFlames` hangs an
  emissive cone on the Spine2 bone at each: long and flickering while walking, short otherwise, off while asleep.
- **Carrier (2026-11-07):** `models/carrier.glb` (yellow and silver, 9.7 k triangles, 5.1 MB, same 9 clips, `metalness: 0.25`).
  The shape robot's crate is not carried over; if the model does not read as a carrier in the lineup, a code-drawn crate
  can hang on a hand bone the way `addJetFlames` hangs the flames.

- **Heavy Builder, four arms (2026-11-07, owner Q6 b):** `models/heavy.glb` (orange and grey, 9.3 k triangles, 4.4 MB, 0.72
  tall so `MODEL_SCALE` 3.4, same 9 clips). Tripo rigs two arms only, and this export's skeleton is not Mixamo's
  (`Hip`, `Spine01/02`, `L_Upperarm`…, 78 bones) with the lower arms weighted to the UPPER arm bones. `MODEL_EXTRA_ARMS.heavy`
  lists each lower arm's root, elbow and hand point (model units, rest pose); `rigExtraArms` adds a shoulder and an elbow
  bone per side under `Spine02` once per file, moves the lower-arm skin onto them (the vertices below y 0.505 whose strongest
  bone is that side's arm or hand; blended into the spine at the root), and `driveExtraArms` poses them by state: arms
  crossed across the belly at rest, walking, waving and asleep (owner: "ปกติเป็นการกอดอก"; the arms are short for the wide
  body, so the forearms meet in the middle rather than overlap), hammering at work, raised out when celebrating, flailing on
  alarm; the lower shoulder's top cap (y 0.505–0.54) is partly faded into the spine so its stretch is spread. The clips never move them.
- **Inspector, legless, hovering (2026-11-07, owner Q7 b):** `models/inspector.glb` (the owner's second export: green and
  white, 9.8 k triangles, 5.2 MB, 0.524 tall so `MODEL_SCALE` 3.4). Its Mixamo skeleton came out UPSIDE DOWN (Hips at the
  helmet, the legs running up into the helmet and the X, the spine running down into the body); only the arms are boned
  right, and its 9 clips are broken at the source (arms-down plays as arms-up, in Tripo's preview too). So:
  `reweightSkin` moves the helmet skin from the leg bones to `Head`; the inspector has no `MODEL_CLIPS` entry, and
  `inspectorPose` (`MODEL_POSER`, on the four arm bones `MODEL_BONES` exposes) poses the arms in all eight states (they hang
  at 0.85 rad so the long arms clear the floor; at work one hand points ahead and sweeps like a magnifying glass);
  `driveHover` moves the whole model — hovers at 0.55 (0.45 asleep, with a slow breath), turns to look around at rest, leans
  while walking; the base pose is smoothed and the quick shake / hop / bob are added after (owner: "ขยับเยอะขึ้น");
  `hideAbove` folds everything above y 0.4535 (the X plate and the dome's very tip) into a zero-scale bone at
  its base, leaving a flat lid, and `addRotor` puts a three-blade code propeller there that spins fast on the move, slowly at rest, and stops
  asleep (owner: "กังหันแทนตัว X").
- **Tester, six spider legs (2026-11-07):** `models/tester.glb` (teal, 9.9 k triangles, 4.7 MB, Mixamo rig, 9 clips). The
  Humanoid rig weighted the round base and every spider leg to the Mixamo LEG bones, so the clips would twist the base.
  `MODEL_SPIDER.tester` lists the six legs' azimuths and the hip / knee points (model units, rest pose; the two back legs
  stand straight below the rim and get their own points and a height blend); `rigSpiderLegs` moves the base onto a still
  `SpiderBase` bone and each leg onto its own hip and knee bones (blended at the rim), and moves any weight left on the
  dead Mixamo thigh bones onto Hips, once per file. The clips then move only the upper body; `driveSpiderLegs` walks the legs in two alternating tripods in step with
  the walk clip, twitches them at rest, taps the front legs at work, raises one to ask or wave, and splays them asleep while
  the body sinks — the Sit clip is not used (`sleep: ["idle"]`), it would sink the torso into the still base.

## Lineup preset (2026-11-07)

`http://127.0.0.1:8049/?lineup` (or 🧍 in the town) reads no events: every role stands in one row on an empty stage, facing
the camera, all in the same state, and the row steps through every state every 6 s (idle, walk, work clip 1, work clip 2,
question, alarm, wave, celebrate, sleep); ◀ ⏸ ▶ step by hand, ⟲ re-frames, 🧍 goes back to the live town. The camera backs off
until the row fits the pane's width. Use it to check a new model's size, colours and clips beside the others.

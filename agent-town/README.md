# Agent Town

A 3D town (three.js) where Main and each sub-agent walk around and build one house per task. Events come from Claude Code
hooks (no model calls): `hooks/agent-town-hook.cjs` writes `~/.claude/agent-town/events.js`; `serve.cjs` serves the folder
on http://127.0.0.1:8049 so the page runs in the Claude app's Browser pane.

Install on a machine: copy `town.html` and `serve.cjs` to `~/.claude/agent-town/`, the hook to `~/.claude/hooks/`, then add
to `~/.claude/settings.json` hooks: `PreToolUse` (matcher `*`), `PostToolUse` (matcher `Agent|Task`), `SubagentStart`,
`SubagentStop`, `Stop`, `UserPromptSubmit` → `node "<home>/.claude/hooks/agent-town-hook.cjs"`, and `SessionStart` →
nothing at SessionStart: open it with the skill `ae49-task-agent-town` (it starts the server on demand).

## Real models (2026-11-06)

`town.html`'s `MODEL_URLS` gives a role a `.glb` from `models/`. The first one (2026-11-06) was a Builder statue,
`models/builder-g70.glb`, from the owner's Tripo export `Agenet Implement.glb` (1.84 M triangles / 61 MB; its source was kept only on the
machine that made it, as `models/builder-source.glb`, gitignored); since 2026-11-07 every role wears a rigged model (below) and the statue was
deleted (owner, 2026-11-07; it stays in git history).
`tools/decimate-glb.cjs <in> <out> --grid 70 --uvgrid 48` shrinks a single-mesh export by vertex clustering that respects UV
seams (80 k triangles, 5.5 MB, base-colour texture only). `preview-model.html?models=a.glb,b.glb` compares copies.
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
- **Main's cape (2026-11-07, owner Q14 a):** drawn in code, not in Tripo (a Tripo cape fuses into the mesh, moves stiffly
  with the spine and lets the legs pass through a long one). `MODEL_CAPE.foreman`: a 10 × 14 cloth grid hung from Spine2 by
  `mountOnBone` at (0, 0.79, −0.108) behind the shoulders, 0.57 long (to the calves), dark grey (0x2a2d33, as Main's tone
  lifts its blacks) with vertex-coloured gold trim. `driveCape` bends the rows back by an eased angle per state (flared on
  the walk, a slow sway at rest) plus an eased ripple running down the cloth on its own phase, so a state change never jumps
  it; once a row would reach the ground (sitting asleep) the rest lies flat behind, each row dropping only as far as the
  room left, so the tail never jumps.
- **Scout (2026-11-07):** `models/scout.glb` (9.4 k triangles, 4.3 MB, same 9 clips). The owner removed the jet flames from the
  art; `MODEL_JETS.scout` lists the two nozzle points (model units, measured from the rest pose) and `addJetFlames` hangs an
  emissive cone on the Spine2 bone at each: long and flickering while walking, short otherwise, off while asleep.
- **Carrier (2026-11-07):** `models/carrier.glb` (yellow and silver, 9.7 k triangles, 5.1 MB, same 9 clips, `metalness: 0.25`).
  The shape robot's crate is not carried over; if the model does not read as a carrier in the lineup, a code-drawn crate
  can hang on a hand bone the way `addJetFlames` hangs the flames.

- **Heavy Builder, two arms (2026-11-07):** `models/heavy.glb` — the owner's second export (orange and grey, backpack,
  Mixamo rig with 65 bones, 9.8 k triangles, 5.2 MB, 0.85 tall, same 9 clips), wired like Carrier. The first export had
  four arms with the lower pair boned in code (owner Q6 b); the owner dropped it ("4 แขนแล้วไม่สวยเลย") and that code is in
  git history before this change. `MODEL_SCALE` 3.98 makes it about 1.4 × as tall as the rest (owner: big, then +30 %,
  then −10 %); its speech bubble floats above its head (`parts.bubbleY`, from the model's top) instead of at y 3.
- **Sitting on the ground (2026-11-07, owner Q15 a):** Tripo's Sit / Sleep clip sinks every robot's seat 0.09–0.33 world
  units into the ground (more on Heavy). `driveSitLift` measures the lowest skinned point while that clip plays (every
  frame through the cross-fade, then 4×/s, 1×/s when settled, jittered) and eases the model up until it touches the
  ground, then back down on waking. Tester is skipped (it sleeps on idle and moves its own model for the spider legs).
- **Inspector, third export (2026-11-07, owner Q13 a):** `models/inspector.glb` (green and white, two short legs added so
  Tripo rigs it as a humanoid; 9.4 k triangles, 4.6 MB, 0.84 tall, same 9 clips). `MODEL_SCALE` 2.3 makes it about 80 % as
  tall as the rest (owner: smaller). Tripo's first rig of it put the arm bones below the arms (shoulder 0.432 against an
  arm centred near 0.505); the owner re-rigged it (export of 17:26, arm bones at 0.51), so the code lift that bridged the
  first one is gone (07323c3 has it). On load `hideAbove` folds the model's
  two-blade propeller (above y 0.79) into a zero-scale bone on the Head bone and `addRotor` spins a two-blade code propeller
  there, mounted on the Head bone (`mountOnBone`) so it rides the clips (fast on the move, slow at rest, still asleep;
  it fell off the head when it hung on the model root). Asleep it sits, lifted onto the ground by `driveSitLift`. The second export (legless, upside-down skeleton, hover and code arm poses, owner Q7 b) was
  replaced; its code is in git history before this change.
- **Tester, six spider legs (2026-11-07):** `models/tester.glb` (teal, 9.9 k triangles, 4.7 MB, Mixamo rig, 9 clips). The
  Humanoid rig weighted the round base and every spider leg to the Mixamo LEG bones, so the clips would twist the base.
  `MODEL_SPIDER.tester` lists the six legs' azimuths and the hip / knee points (model units, rest pose; the two back legs
  stand straight below the rim and get their own points and a height blend); `rigSpiderLegs` moves the base onto a still
  `SpiderBase` bone and each leg onto its own hip and knee bones (blended at the rim), and moves any weight left on the
  dead Mixamo thigh bones onto Hips, once per file. The clips then move only the upper body; `driveSpiderLegs` walks the legs in two alternating tripods in step with
  the walk clip, twitches them at rest, taps the front legs at work, raises one to ask or wave, and splays them asleep while
  the body sinks — the Sit clip is not used (`sleep: ["idle"]`), it would sink the torso into the still base.
- **Migrator (2026-11-07, owner Q2 a):** a ninth role for `ae49-migrate` (Carrier keeps implement-docs and excel; `roleOf`
  sends `migrate` to it). `models/migrator.glb` (purple and gold armour, 9.4 k triangles, 4.6 MB, Mixamo rig, same 9 clips),
  0.84 tall so `MODEL_SCALE` 2.85 makes it as tall as the rest; `metalness: 0.25`. Station at (-4, -6) with a stack of
  purple data drums; at a house it stands at offset (3.0, -1.8) (clear of Carrier, Tester, the blueprint board and the
  trees; `houseSpot` mirrors any spot that lands on a station robot's home to the house's other side — only Migrator at plot 1,
  which sits beside the Inspector's station) and moves the house's stage the way Carrier does.
- **Builder (2026-11-07):** `models/builder.glb` (red and yellow armour, green canisters on the back, 9.5 k triangles, 3.8 MB,
  Mixamo rig, same 9 clips), 0.82 tall so `MODEL_SCALE` 2.93; `metalness: 0.25`. It replaces the statue `builder-g70.glb`,
  deleted on the owner's word.

## Buildings, plots, trees and the circle (2026-11-07)

- **Buildings (owner Q8 a / Q12 a / Q16 a):** six owner-made Tripo buildings (static GLBs in
  `models/building-*.glb`, about 9 k triangles each): CYBERNETIC CORE, FOUNDRY, SYNTHESIS (from
  `reference/2026-11-07/buildings.jpg`) and NETWORK NODE, ALGORITHM REFINERY, CONTROL SPIRE (from `buildings-2.jpg`,
  exported as Build 1–3); CYBERNETIC CORE is only the main building and ALGORITHM REFINERY only the hall, so a house is
  one of the other four. The stages are code: stakes on the bare plot (1); from the plan on, while the job is in progress, a
  construction site (2–5, owner: in-progress work shows as construction): a slab (gone once built, owner: no square base),
  a scaffold, a blueprint (2–3), and the building rising out of the ground (a clipping plane per house shows 12 / 25 / 45 /
  75 % of it, `REVEAL`, eased by `driveBuilding`); the whole building (6+; one already built when the page opens does not
  regrow), its light lines glowing once lit (11). A push lights the landed houses, everyone claps, and 6 s later the
  shipped houses are cleared (owner: "ถ้า push ก็ให้ Reset"); houses still in progress stay.
- **Which building (owner, replacing Q9 a's name hash):** a shuffle bag — every type once in a random order before any
  repeats, then a new order (`bagType(h.serial)`), seeded by the round so a replay of the same events gives the same
  buildings (the hook keeps the last 400 events, so a log that has rolled can differ).
- **Size (owner: "ใหญ่กว่าตัวละครเสมอ … 2-3 เท่า", a robot is about 2.04):** scaled to `TARGET_H` 5.5 unless the wider
  side would pass `MAX_FOOT` 4.6 (SYNTHESIS 5.0); one left under `MIN_H` 4.4 is stretched up to its `maxStretch`
  (FOUNDRY 2.2, SYNTHESIS 1.7). Plot props and work spots sit `HS` 1.25 × further out than around the old box house.
- **Colour (owner Q16 a, Tripo made them all blue):** `gradeBuilding` gradient-maps the body by brightness from the
  type's `dark` to its `light` colour; the light lines (bright cyan with almost no red) keep their colour and become
  the glow map.
- **Landmarks:** the main building (the site office) is a CYBERNETIC CORE at 2 × a house (`MAIN_SCALE`), north of the
  plaza at `MAIN_Z` −9.5 (owner Q17 b); the north ring road and the cross road stop at it. The town hall is an ALGORITHM
  REFINERY. Both are always lit (`landmark`); the Inspector's and Tester's box booths are gone (open ground).
- **Plots** were re-laid for the bigger buildings: twelve, outside the ring road, clear of the stations, the office, the
  hall and the roads, the camera side (+z) first, then the sides, the far side and the corners; the home camera backed off and the fog moved out so
  all twelve show. Trees and the plaza lamps
  moved with them.
- **Trees:** the owner's `models/tree-1..3.glb` replace the code cones once loaded, in turn, `TREE_H` 4.4 × size.
- **Lamp posts:** the owner's `models/lamp-post.glb` (a street lamp) replaces the code pole and bulb, `LAMP_H` 3.6, each
  turned so its arm reaches over the plaza; at night only the underside of the arm's far end glows (`prepareLamp` moves
  the down-facing triangles of that end into a glowing material group; owner: "ไฟต้องออกมาจากส่วนปลายเท่านั้น ด้านใต้").
- **Boxes:** the owner's `models/box.glb` (a cardboard box on a pallet, ONE mesh) replaces the code crates: three pallets in
  a row at the Carrier's station with three bare boxes stacked on them, and two bare boxes on each Builder / Heavy table,
  sizes and turns varied (`crate(len, pallet, …)`). A box on the ground keeps the pallet; one on another box or on a table
  loses it (owner Q19 a): `bareBox` drops the triangles below `BOX_PALLET` (the deck top, 0.102 in file units) and cuts
  the side faces at it, once per file. `BOX_W/H/D` are the file's size, so stacks are laid out before it loads.
- **Rest, report, cheer (owner; Q17 b):** Main rests at the main building's door (`MAIN_SEAT`) facing south; everyone
  else rests seated on an arc in front of it facing Main (`seatOf`; a second agent of a role sits behind). A job at a house
  is done there, one without a house at the role's station; when done the agent walks to the spot in front of Main,
  reports facing Main, then walks back to its own seat. Main works standing at its seat and sits when its turn ends (it
  never stays stranded at a house or the hall: `mainRest`). When a house lands, and again when a push lights it,
  everyone seated stands and claps (`cheerAll`). The Sit / Sleep clip plays once and holds the seated pose. Walks go
  around the main building, the hall and every house's building (`routeTo`: one corner, or two on one side when the
  goal is behind it; each leg routed again when more buildings are in the way). Checked: all 216 seat → work spot → report
  walks with all twelve plots built pass no building.
- Make a new building isometric or three-quarter: a straight front view made Tripo's multi-view guess a flat slab; one
  that looks the same from every side can take the same image in all four multi-view slots.

## Lineup preset (2026-11-07)

`http://127.0.0.1:8049/?lineup` (or 🧍 in the town) reads no events: every role stands in one row on an empty stage, facing
the camera, all in the same state, and the row steps through every state every 6 s (idle, walk, work clip 1, work clip 2,
question, alarm, wave, celebrate, sleep); ◀ ⏸ ▶ step by hand, ⟲ re-frames, 🧍 goes back to the live town. The camera backs off
until the row fits the pane's width. Use it to check a new model's size, colours and clips beside the others.

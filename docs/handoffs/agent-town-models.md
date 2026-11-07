# Handoff — Agent Town: the owner's Tripo models (2026-11-07 16:32 ICT)

Written at a same-machine `ae49-task-session swap` (context 75 %+). This repo has no git-synced per-person memory, so this
file is the in-flight note. Read `agent-town/README.md` ("Real models" and "Lineup preset") first: it records every model
and every code technique below in detail.

## State

- `main` = `8440f64`, pushed (this repo deploys nothing; pushing needs no ask). Tree clean.
- Town installed on this machine (`~/.claude/agent-town`, hooks in `~/.claude/settings.json` — they record from the next
  session). Server: `node "$HOME/.claude/agent-town/serve.cjs" --ensure`. The test preset the owner uses:
  `http://127.0.0.1:8049/?lineup` (skill verb "เปิดเมือง lineup" / "ดูตัวละคร"). After editing `agent-town/town.html`,
  copy it to `~/.claude/agent-town/` (or run `node agent-town/install.cjs`) and reload.
- Models in town (all from the owner's drop-off `Downloads\Claude Skill\Agent Model\`, copied byte-identical):
  main, planner, scout (code jet flames), carrier, heavy (code-made lower-arm bones, arms crossed at rest), inspector
  (code-posed, hover, code propeller; its second export's rig is upside down), tester (code spider legs). At the swap Builder still wore the old
  statue `builder-g70.glb`; it and Migrator got their rigged models after it (see Next).
- Every change this session got a short/full `ae49-audit`; all BLOCKER/MAJOR folded. Open MINOR noted by the last audit:
  inspectorPose arm poses snap on state change (no easing) — owner's visual call.

## Next (in order) — updated 2026-11-07 16:52 ICT (next session)

Done after the swap: **Builder** (`models/builder.glb`) and **Migrator** (`models/migrator.glb`, new role) are in town;
the `ae49-ref-3d-prompt` "prompt in the final message" rule is in. `models/builder-g70.glb` was deleted on the owner's
word ("ลบเลย").

0. **Inspector remake (owner Q13 a, in progress):** two short stubby legs so Tripo rigs it as a humanoid and its 9 clips
   work. Image rounds so far: legs added (came back near T-pose, magnifier gone) → legs shortened → the four balls on the
   head replaced by a three-blade rotor (prompts in chat). When the model arrives: drop the inspector's special code
   (`MODEL_REWEIGHT`, `MODEL_HOVER`, `MODEL_POSER`, `MODEL_BONES` entries) and wire it like Carrier, but keep a code rotor:
   hide the model's rotor (`hideAbove`, re-measured) and spin `addRotor` there. The owner took the long-legged image as
   is (legs not shortened) and is rigging it in Tripo; in town Main makes it SMALLER than the others with `MODEL_SCALE`
   (owner: "เดี๋ยวค่อยให้คุณไปย่อขนาดตัวให้เล็กใน Model เอา"). This replaces the earlier re-texture idea.
1. **Buildings (owner Q8 a, Q9 a, Q12 a):** Tripo makes ONE finished building per type (static, no rig); the construction stages
   are code — foundation and scaffold drawn in code, walls revealed bottom-up by a clipping plane on the real model,
   window glow found in the texture or placed at measured points. The type is picked by a hash of the house name. The
   owner's concept sheet `agent-town/reference/2026-11-07/buildings.jpg` set the style (blue sci-fi; Q10/Q11 withdrawn);
   Q12 a: start with CENTRAL CORE, FOUNDRY, SYNTHESIS (CENTRAL CORE first, to try the stages). Each needs its own image cut
   from the sheet on white, then multi-view → model → export (no rig). Waits until the Inspector remake (item 0) is done.

## Rulings this session (owner)

Q1 c models stay in the public repo · Q2 a purple = Migrator · Q3 no colour changes · Q4 a Main toned in code ·
Q5 a / Q6 b Heavy four arms, lower pair code-boned · Q7 b Inspector legless, code-animated · lineup preset · English
role labels · Heavy lower arms crossed at rest · Tester six spider legs · Q8 a buildings: Tripo finished model + code
stages · Q9 a building type by name hash · Q12 a CENTRAL CORE / FOUNDRY / SYNTHESIS first · Q13 a Inspector remade with two
short legs.

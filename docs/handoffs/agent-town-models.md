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
  (at the swap: the legless second export, code-posed and hovering; replaced after it, see Next item 0), tester (code spider legs). At the swap Builder still wore the old
  statue `builder-g70.glb`; it and Migrator got their rigged models after it (see Next).
- Every change this session got a short/full `ae49-audit`; all BLOCKER/MAJOR folded. The MINOR about
  inspectorPose snapping closed with the third export (that code is gone).

## Next (in order) — updated 2026-11-07 16:52 ICT (next session)

Done after the swap: **Builder** (`models/builder.glb`) and **Migrator** (`models/migrator.glb`, new role) are in town;
the `ae49-ref-3d-prompt` "prompt in the final message" rule is in. `models/builder-g70.glb` was deleted on the owner's
word ("ลบเลย").

0b. **Main's cape (owner Q14 a):** drawn in code (a cloth grid on Spine2 via `mountOnBone`, black with gold trim, flares
   back on the walk) — in progress after the Inspector commit.
0c. **Heavy Builder back to TWO arms (owner 2026-11-07, "4 แขนแล้วไม่สวยเลย", replaces Q6 b):** the owner is redoing it in
   Tripo (round 1: T-pose prompt given). When the model arrives: drop `MODEL_EXTRA_ARMS.heavy` (and the code-boned lower
   arms), wire it like Carrier, check the scale.
0. **Inspector remake (owner Q13 a): done** — third export in town, arm pivots lifted in code, code propeller, scale 2.3.
1. **Buildings (owner Q8 a, Q9 a, Q12 a):** Tripo makes ONE finished building per type (static, no rig); the construction stages
   are code — foundation and scaffold drawn in code, walls revealed bottom-up by a clipping plane on the real model,
   window glow found in the texture or placed at measured points. The type is picked by a hash of the house name. The
   owner's concept sheet `agent-town/reference/2026-11-07/buildings.jpg` set the style (blue sci-fi; Q10/Q11 withdrawn);
   Q12 a: start with CENTRAL CORE, FOUNDRY, SYNTHESIS (CENTRAL CORE first, to try the stages). Each needs its own image cut
   from the sheet on white, then multi-view → model → export (no rig). Next up after the cape (item 0b).

## Rulings this session (owner)

Q1 c models stay in the public repo · Q2 a purple = Migrator · Q3 no colour changes · Q4 a Main toned in code ·
Q5 a / Q6 b Heavy four arms, lower pair code-boned · Q7 b Inspector legless, code-animated · lineup preset · English
role labels · Heavy lower arms crossed at rest · Tester six spider legs · Q8 a buildings: Tripo finished model + code
stages · Q9 a building type by name hash · Q12 a CENTRAL CORE / FOUNDRY / SYNTHESIS first · Q13 a Inspector remade with two
short legs · Q14 a Main's cape in code · Heavy Builder back to two arms (replaces Q6 b).

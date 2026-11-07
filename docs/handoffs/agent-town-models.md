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
  main, planner, scout (code jet flames), carrier, heavy (at the swap: four arms, the lower pair code-boned; replaced, see item 0c), inspector
  (at the swap: the legless second export, code-posed and hovering; replaced after it, see Next item 0), tester (code spider legs). At the swap Builder still wore the old
  statue `builder-g70.glb`; it and Migrator got their rigged models after it (see Next).
- Every change this session got a short/full `ae49-audit`; all BLOCKER/MAJOR folded. The MINOR about
  inspectorPose snapping closed with the third export (that code is gone).

## Next (in order) — updated 2026-11-07 17:58 ICT (next session)

Done after the swap: **Builder** (`models/builder.glb`) and **Migrator** (`models/migrator.glb`, new role) are in town;
the `ae49-ref-3d-prompt` "prompt in the final message" rule is in. `models/builder-g70.glb` was deleted on the owner's
word ("ลบเลย").

0b. **Main's cape (owner Q14 a):** drawn in code (a cloth grid on Spine2 via `mountOnBone`, dark grey 0x2a2d33 with gold trim, flares
   back on the walk, lies flat behind when Main sits asleep) — done.
0c. **Heavy Builder back to TWO arms (owner 2026-11-07, "4 แขนแล้วไม่สวยเลย", replaces Q6 b): done** — wired like
   Carrier, the four-arm code removed, scale 3.98 (≈1.4 × the rest, the owner's pick), bubble above its head.
0e. **For the owner's eye in the live town (audit questions, not fixed):** Heavy's pointing hand may reach into the
   house wall at its work spot; Heavy sitting at its station may put its feet into the table; Heavy's feet may slide on
   the walk (1.4 × stride, shared speed); the house sign at stages 1–5 covers part of Heavy's chest.
0d. **Sit lift (owner Q15 a): done** — `driveSitLift` keeps every sitting robot on the ground; the Inspector sits again.
0. **Inspector remake (owner Q13 a): done** — third export in town; the owner re-rigged the arms in Tripo (17:26 export), no code lift; code propeller on Head;
   scale 2.3.
1. **Buildings (owner Q8 a, Q9 a, Q12 a):** Tripo makes ONE finished building per type (static, no rig); the construction stages
   are code — foundation and scaffold drawn in code, walls revealed bottom-up by a clipping plane on the real model,
   window glow found in the texture or placed at measured points. The type is picked by a hash of the house name. The
   owner's concept sheet `agent-town/reference/2026-11-07/buildings.jpg` set the style (blue sci-fi; Q10/Q11 withdrawn);
   Q12 a: start with CENTRAL CORE, FOUNDRY, SYNTHESIS (CENTRAL CORE first, to try the stages). Each needs its own image cut
   from the sheet on white, then multi-view → model → export (no rig). Use an isometric / three-quarter view: a straight
   front view made Tripo's multi-view guess a flat slab. CYBERNETIC CORE is IN (`models/building-cybernetic-core.glb`,
   0.76 × 0.76 footprint, 0.98 tall, 9.5 k triangles; made by putting the same four-sided front image in all four
   multi-view slots) but not yet used by the code. FOUNDRY (`building-foundry.glb`, 0.98 × 0.91, 0.45 tall) and SYNTHESIS
   (`building-synthesis.glb`, one dome, 0.98 × 0.98, 0.47 tall) are in too (17:56). CENTRAL CORE is still owed (Q12 a);
   the second sheet `buildings-2.jpg` has five more types.
   **Done by 18:25:** buildings re-laid on new plots, office = the main building (CYBERNETIC CORE, 2 ×, north, Q17 b) and hall (ALGORITHM REFINERY), the
   owner's trees, everyone rests in front of the main building facing Main / reports in front of Main / claps when a house
   lands or lights; a push clears the shipped houses; in-progress jobs look like construction, the Sit clip
   holds, building type by a shuffle bag (owner, replaces Q9 a), size 2–3 × a robot (owner). **Earlier, 18:03:** the building system in `town.html` with six types (README "Buildings"), re-coloured per type (owner
   Q16 a); the tree that stood on plot 8 moved off it. Owner to look at it in the live town and judge colours / sizes.

## Rulings this session (owner)

Q1 c models stay in the public repo · Q2 a purple = Migrator · Q3 no colour changes · Q4 a Main toned in code ·
Q5 a / Q6 b Heavy four arms, lower pair code-boned (superseded) · Q7 b Inspector legless, code-animated · lineup preset · English
role labels · Heavy lower arms crossed at rest (superseded) · Tester six spider legs · Q8 a buildings: Tripo finished model + code
stages · Q9 a building type by name hash · Q12 a CENTRAL CORE / FOUNDRY / SYNTHESIS first · Q13 a Inspector remade with two
short legs · Q14 a Main's cape in code · Heavy Builder back to two arms (replaces Q6 b),
scale ≈1.4 × · Q17 b main building CYBERNETIC CORE 2 × in the north, everyone in front facing Main
(houses never use CORE or the hall's REFINERY) · push resets shipped houses, every `git push origin main` in any repo counts (owner "นับทุก push") · Q15 a sit lift for every clip-driven robot (Tester skipped), Inspector sits · buildings: the owner made
CYBERNETIC CORE, FOUNDRY (one block) and SYNTHESIS (one dome) first; CENTRAL CORE is still owed · Q16 a buildings re-coloured in code
per type · Build 1–3 = NETWORK NODE, ALGORITHM REFINERY, CONTROL SPIRE.

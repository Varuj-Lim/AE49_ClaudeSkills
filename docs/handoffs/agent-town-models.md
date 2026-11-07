# Handoff — Agent Town (2026-11-07 19:31 ICT, same-machine swap)

This repo has no git-synced per-person memory, so this file is the in-flight note. Read first:
`skills/ae49-task-agent-town/SKILL.md` § "Town design rules" (the owner's 11 rules — keep them) and `agent-town/README.md`
("Real models", "Buildings, plots, trees and the circle", "Lineup preset").

## State

- `main` = `b5641ee`, pushed (this repo deploys nothing; pushing needs no ask). Tree clean. No agent running.
- Town installed on this machine (`~/.claude/agent-town/` mirrors `agent-town/`; after editing `agent-town/town.html` copy
  it there, or run `node agent-town/install.cjs`, and reload). Server: `node "$HOME/.claude/agent-town/serve.cjs" --ensure`;
  town `http://127.0.0.1:8049/`, robot check `http://127.0.0.1:8049/?lineup`.
- Every robot wears the owner's rigged Tripo model (9 roles incl. Migrator; Heavy two-armed at ≈1.4 ×; Inspector remade
  with legs, code propeller on Head; Main's cape is code; every robot sits on the ground; the Sit clip holds).
- Buildings: six owner models (`models/building-*.glb`); CYBERNETIC CORE is only the main building (2 ×, north,
  `MAIN_Z` −9.5), ALGORITHM REFINERY only the hall; houses draw the other four from a shuffle bag. Owner trees
  (`tree-1..3.glb`) and lamp (`lamp-post.glb`, glows only under the arm's end). Plots re-laid; walks route around every
  building (checked: 216 walks, twelve houses, none through a building).
- Every change got a short `ae49-audit`; all BLOCKER / MAJOR folded. Not verified by eye (owner may look): Heavy crowding
  its neighbours on the arc when everyone stands to clap; corner-plot houses may cast no shadow (outside the sun's shadow
  box ±22).
- Autopilot: Off for this project (no state file).

## Next (in order)

1. **Box model** — the owner will export a cardboard box on a pallet as `Box.glb` into
   `Downloads\Claude Skill\Agent Model\`. Copy it (byte-check) to `agent-town/models/box.glb`, then replace the code
   crates: Carrier's station stack and the crates on the Builder / Heavy tables, sized and stacked in code (vary sizes,
   small turns). Ask the owner whether upper boxes keep their pallet (he was asked; no answer yet). Short audit, commit.
2. **CENTRAL CORE** building (Q12 a) is still owed — image prompt when the owner wants it (isometric view; see
   `ae49-ref-3d-prompt`). The second sheet `agent-town/reference/2026-11-07/buildings-2.jpg` has more types.

## Rulings this session (owner, 2026-11-07)

Q1 c models stay in the public repo · Q2 a purple = Migrator · Q3 no colour changes (robots) · Q4 a Main toned in code ·
Q5 a / Q6 b Heavy four arms (superseded: two arms, big) · Q7 b Inspector legless (superseded by Q13 a: two short legs) ·
lineup preset · English role labels · Tester six spider legs · Q8 a buildings: Tripo finished model + code stages ·
Q9 a type by name hash (superseded: shuffle bag, no repeats until all used) · Q12 a CENTRAL CORE / FOUNDRY / SYNTHESIS
first (owner then made CYBERNETIC CORE, FOUNDRY, SYNTHESIS and Build 1–3) · Q14 a Main's cape in code · Q15 a sit lift ·
Q16 a buildings re-coloured in code · buildings 2–3 × a robot · in-progress work is a construction site · no square base ·
everyone rests in front of the main building facing Main, reports in front of Main, walks back to the same seat ·
everyone claps when a house lands or a push lights it · a push clears the shipped houses · Q17 b main building
CYBERNETIC CORE 2 × in the north, houses never use it (nor the hall's type) · Q18 a town rules written into the skill ·
every `git push origin main`, in any repo, counts as a town push · lamps light only under the arm's far end.

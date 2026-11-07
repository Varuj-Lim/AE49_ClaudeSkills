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
  (code-posed, hover, code propeller; its second export's rig is upside down), tester (code spider legs). Builder still
  wears the old unrigged statue `builder-g70.glb`.
- Every change this session got a short/full `ae49-audit`; all BLOCKER/MAJOR folded. Open MINOR noted by the last audit:
  inspectorPose arm poses snap on state change (no easing) — owner's visual call.

## Next (in order)

1. **Builder** — the owner is making it in Tripo now (round 1 T-pose passed). When `Agent Builder.glb` lands in the
   drop-off: copy to `agent-town/models/builder.glb` (check with `cmp`), inspect (clips, bones, tris), set MODEL_URLS /
   MODEL_CLIPS (`CLIP_SET("Standing in place")`) / MODEL_SCALE / MODEL_RIGGED for `builder` like carrier, retire
   `builder-g70.glb` from MODEL_URLS (ask before deleting the file), check in the lineup, short audit, commit.
2. **Inspector re-texture** — its second export's texture has baked cartoon outlines; the owner may re-texture it in
   Tripo (Remove Lighting on, 2K, PBR) and export over `Agent Inspector.glb`. If the geometry is unchanged the rotor and
   cut values hold; if not, re-measure (`MODEL_ROTOR.inspector`, see README).
3. **Migrator (purple) — owner ruling Q2 a (2026-11-07):** a NEW role `migrator` for `ae49-migrate` (Carrier keeps
   implement-docs + excel). Art: `agent-town/reference/2026-11-07/all.png` (purple armoured, top right). The owner asked for
   its round-1 prompt at 16:3x; it was given in chat (strict T-pose, hands empty). Town side when the model arrives: add
   the role to ROLES (English label "Migrator"), `roleOf` (`migrate` → migrator), a station, then the model tables.
   Earlier attempt at the role was reverted on the owner's word ("มันเป็นแค่รูป") — this time the owner asked for the model.
4. **Skill rule to add (owner's repeated complaint):** in `ae49-ref-3d-prompt`, a prompt is ALWAYS in the turn's final
   message, never in text between tool calls (it got lost twice: Inspector round 1, Builder round 1). Mirror to
   `~/.claude/skills`, validate, commit, push.

## Rulings this session (owner)

Q1 c models stay in the public repo · Q2 a purple = Migrator · Q3 no colour changes · Q4 a Main toned in code ·
Q5 a / Q6 b Heavy four arms, lower pair code-boned · Q7 b Inspector legless, code-animated · lineup preset · English
role labels · Heavy lower arms crossed at rest · Tester six spider legs.

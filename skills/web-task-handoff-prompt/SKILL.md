---
name: web-task-handoff-prompt
description: The ONE format for a cross-project HANDOFF PROMPT — the paste-ready block that carries a change from the project this session is in to a sibling hub project's OWN session (AE49_Hub ↔ Nuri_Hub ↔ future siblings). It is the only allowed way to move work across projects under the one-session-one-project rule (user CLAUDE.md, 2026-09-09) — never a cross-edit of the other repo. Use whenever the user says "เขียน prompt ให้ Nuri", "handoff ให้อีกโปรเจกต์", "ส่งไปแก้ฝั่งนั้นด้วย", "port this to the other hub", or whenever a change landed here (a launcher, a shared component, a ruling, a skill, a script) must also land there. Not for handing a conversation to a fresh session of the SAME project — that is ae49-task-handoff.
---

# Cross-project handoff prompt — the shared format

**Why this exists (owner, 2026-09-10):** on that day Main hand-wrote two handoff
prompts (the dropdown-chevron change and the emulator launcher prompt) in two
different shapes, while the rule that demands them lived in three places
(user `CLAUDE.md` "One session, one project folder", `ae49-task-compare-conventions`
Phase 3 item 5, `web-ref-local-emulator` §8) and none carried a template. This
skill is the single source; those three point here.

## When

- A change made or ruled in THIS project must also happen in a sibling hub —
  launcher parity (`web-ref-local-emulator` §8), a shared UI component that both
  hubs copy (e.g. `components/ui/SelectField.tsx`), a convention alignment
  (`ae49-task-compare-conventions`), a project skill or audit topic that mirrors a
  sibling's, a ruling the owner wants applied everywhere.
- This session may READ the sibling's checkout to compare, but never writes there:
  no file edits, no git, no scripts, no launcher presses (user CLAUDE.md rule
  2026-09-09). The deliverable is the prompt; the sibling's session does the edit,
  its own build/lint gates, its own audit + manual gate, and its own commit.
- User-level skills are the one exception — they travel through the skills repo
  (`skills-edit-mirrors-to-repo`), not through a handoff.

## The seven parts — every prompt, in this order

1. **Title line** — `handoff จาก <this hub> — <what> (<owner ruling wording, date>)`.
   The ruling and its date are what let the sibling session act without asking.
2. **What to change** — a numbered, FILE-level list for the sibling's repo: file
   path (their path, not ours), what to add/remove, and the exact strings or
   snippets that must be identical (class names, arguments, messages). Include
   docs the sibling must sync (its README, its project skill, its audit topic).
3. **Read-only source** — where the finished change lives here: the absolute hub
   path + the commit sha, and a ready `git -C <hub root> show <sha> -- <paths>`
   line, plus any skill/topic file to read. Cite commits, never the working tree.
4. **Token map** — every value that differs between the hubs and must be
   substituted: ports, Firebase project id, hub display name, collection names,
   skill names (`<hub>-ref-…`), reads-per-refresh figures, file names. Say "same"
   explicitly for the ones that are the same; never write "as here".
5. **Why** — two or three sentences of rationale (the concern the change answers,
   the common practice, what NOT to touch and why) so the sibling session can
   judge fit instead of copying blindly — and can push back per the
   "say disagreement first" rule.
6. **Verify** — the sibling's own gates (build / tsc / lint as that project
   defines them), a 3–5 item manual check in THAI (full sentences), and the
   landing route: its plan/approve flow if it is a feature, planless if it is a
   launcher/skill/docs change, then its own commit + memory.
7. **Scope guard** — one line: "แก้เฉพาะใน <sibling hub>; ห้ามแตะ <this hub> จาก
   session นั้น" — mirrors the rule from the other side.

## Rules

- ONE prompt per change; a batch of unrelated changes is several prompts.
- Paste-ready: deliver it in chat inside one fenced block, plain text, Thai
  narration with English identifiers verbatim (the owner reads Thai; the sibling
  session reads code). No markdown headings inside the block — the sibling
  session receives it as a user message.
- Self-contained: the sibling session has none of this conversation. Every
  ruling is quoted with its date; every source is a path + sha; every number
  (ports, counts) is written out.
- Never instruct the sibling to run anything against THIS hub's data or repo.
- **Delivering the prompt ENDS the job (owner rule 2026-09-11).** Paste the block in
  chat and stop. It is NOT a task of this session: no board row, no line in a report,
  no "handoff delivered" note in memory, no later check on whether the sibling has done
  it. The owner carries the block across; the destination session owns everything after
  it — its plan, build, gate, commit and its own memory. Owner: *"ตอนเราสั่งให้ทำ Prompt ข้าม Session ไม่ต้องเอามันมาเป็น Task ว่าทำส่งไปทางนั้น เดียวเราทำเอง แค่ส่งข้อความมา แล้วจบตรงนั้นได้เลย ไม่ต้องใส่ใน Report ไม่ต้องไปตามต่อว่าทางนั้นทำแล้วหรือยัง ให้เป็นหน้าที่ฝั่งปลายทางทำเอง"* (This replaces
  the earlier bullet that told Main to record the delivery in its in-flight memory.)
- When the sibling hub has a matching project skill or audit topic, the prompt
  names it (or says "create the equivalent") so the two hubs' canons stay
  section-for-section mirrors.

## Template

```
handoff จาก <this hub> — <what changed> (owner ruling <date>: "<owner's words>")

สิ่งที่ต้องแก้ใน <sibling hub> (แก้เองในโปรเจกต์นั้น ไม่แตะ <this hub>):
1. <their/path/file> — <exact change; identical strings in backticks>
2. <their/path/file> — <…>
3. <their docs / project skill / audit topic> — <what to add>

ต้นฉบับที่อ่านได้ (read-only): <this hub root> @ <sha> —
  git -C <this hub root> show <sha> -- <path> <path>
  <skill or topic file to read>
token map: <port A here → port A there> · <project id> · <hub name> · <skill names> · <figures> · "same" for the rest

เหตุผล: <2–3 sentences: concern · common practice · what not to touch>

verify: <their build/tsc/lint> · <3–5 Thai manual checks, full sentences> · land ตาม process ของ <sibling hub> (plan/approve/audit/gate if a feature; planless if launcher/skill/docs) · commit + memory ฝั่งนั้น
scope: แก้เฉพาะใน <sibling hub>; ห้ามแตะ <this hub> จาก session นั้น
```

## Examples (2026-09-10, both delivered from AE49_Hub to Nuri_Hub)

- **Dropdown chevron removed app-wide + pointer/hover affordance** — parts:
  change list (SelectField trigger, SELECT_TRIGGER_CLASS, docblock; the dropdown
  skill paragraph; a new audit topic "Dropdown triggers (no arrow)"), source
  `git show f0664c32 -- components/ui/SelectField.tsx` + the AE49 topic file,
  token map "component/file names same; skill names = the sibling's own; grep its
  `triggerClassName=` sites", why (arrow needless once the placeholder names the
  picker; keep the affordance via cursor + hover; sidebar/accordion/sort chevrons
  are not dropdowns), verify (lint/tsc/build + 4 Thai checks: add form, filled
  edit form, custom-trigger table, disabled field).
- **Emulator launcher asks before booting whether to refresh from production**
  (option ก) — change list (the prompt block in `dev-emu.cmd` with `choice /C YN
  /T 5 /D N`, the `fromlauncher` arg in `refresh-emu-data.cmd`, the README
  paragraph), source `git show 8e42ed3b`, token map (hub probe port, project id,
  reads per refresh, block structure may differ), why (a refresh costs thousands of
  production reads and erases the export-on-exit world), verify (stop → start:
  prompt shows the snapshot date; no key = boots; `y` = refresh then boot).

## For skill authors

A skill that tells Main to "write a handoff for the sibling" points here instead
of describing the prompt. Project facts (ports, ids, skill names) stay in each
hub's own `<hub>-ref-emulator` / project skills — this canon holds only the shape.

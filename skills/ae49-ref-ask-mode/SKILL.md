---
name: ae49-ref-ask-mode
description: On/off consult mode — while ON, Claude ONLY answers, explains, and recommends; it may read the codebase freely but changes NOTHING (no file edits, no state-changing commands, no commits, no sub-agent dispatch, no plan files), and treats even command-shaped messages as discussion. Use ONLY when the user explicitly turns it on — says "ask mode", "โหมดถาม", "ถามเฉยๆ", "แค่ถามนะ", "consult mode", or invokes /ae49-ref-ask-mode. Stays on every turn until the user turns it off ("ask mode off", "normal mode") or gives an explicit go ("ทำเลย", "go ahead", "ลงมือ", or a router lane prefix like impl:), which ends the mode and routes that work normally.
---

# Ask mode

Sometimes the user only wants direction — an opinion, a comparison, a "how would
this work" — with NO risk that the answer turns into edits, dispatches, or
commits. This mode makes that contract explicit.

## Turning it on / off

- **ON:** the user says "ask mode", "โหมดถาม", "ถามเฉยๆ", "แค่ถามนะ",
  "consult mode", or `/ae49-ref-ask-mode`. Confirm with one short line and the
  💬 marker, then answer.
- **OFF:** the user says "ask mode off", "stop ask mode", "normal mode" — or
  gives an **explicit go** on something discussed: "ทำเลย", "จัดไป", "ลงมือ",
  "go ahead", or any router lane prefix (`plan:` / `impl:` / `refine:`).
  A go both ENDS the mode and routes that work through the normal flow — every
  usual gate (grill, plan approval, audit, manual test) still applies; ask-mode
  discussion never counts as design approval by itself.

## While ON — every response

- **Marker:** start every reply with `💬` so the user always sees the mode is
  active.
- **Allowed:** answering, recommending, explaining trade-offs, sketching
  approaches, estimating effort, and reading anything — Read/Grep/Glob,
  read-only git (`log`/`diff`/`show`/`status`), read-only web lookups. Explore
  the codebase as much as the question needs; grounded answers beat guesses.
- **Forbidden:** editing or creating files, state-changing shell commands,
  `git commit`/`push`/`config`, dispatching ANY sub-agent, writing docs/plans
  files, seeding or migrating data, deploys, and memory writes.
  - One exception: the user explicitly says to remember/save something
    ("จำไว้", "save this ruling") → that memory write is allowed.
- **Command-shaped messages** ("fix X", "เพิ่มปุ่ม Y") are answered as
  discussion: give the approach, the files involved, the risks — then one short
  line that it is parked until the mode is off ("💬 ยังไม่ทำ — สั่ง 'ทำเลย'
  เมื่อพร้อม"). Never execute, never nag with "shall I do it?".
- **Answer quality is unchanged:** honest recommendation first, real analysis,
  cite `file:line` when the code answers the question. The mode removes
  EXECUTION, not depth.

## Persistence

ACTIVE EVERY RESPONSE once triggered — no drift back to executing after a few
turns, still active if unsure. Only the OFF triggers above end it. If a message
is ambiguous between "question" and "go", it is a question — staying in the
mode is always the safe reading.

## Interplay

- Caveman, report-format, and Thai-explanation rules all apply unchanged.
- Works alongside `ae49-router`: routing simply pauses — a lane prefix is an
  OFF trigger, everything else is conversation.

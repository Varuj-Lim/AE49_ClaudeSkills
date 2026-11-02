# ae49-ref-gate-checklist history

Why the rules are shaped as they are. The rules themselves live in `SKILL.md` and the topic files; a conflict resolves in
their favour.

## Split into topic files (2026-10-09)

Plan `skills-merge-sweep` M1, owner MQ1 b: the long sections moved WHOLE (headings and owner quotes unchanged) into the topic
files and the skill was merged with `web-ref-gate-closed-format`. `resources/*` paths were not changed.

## Old name → where it lives now

| Old skill / section | Now |
|---|---|
| `web-ref-gate-closed-format` (whole) | `ae49-ref-gate-checklist/closed-format.md` |
| "Gate numbers — circled, per deploy round" | `gate-numbers.md` |
| "The clickable page…" · "When a section is on the board…" · "Template adoption" | `page.md` |
| "Waived and Main-verified items (owner 2026-09-25)" | `waived.md` |
| "Test data" · "Environment — the emulator by default" | `environment.md` |

## Scope, as the description read on 2026-09-25

The ONE rulebook for the owner's manual-test GATE in every ae49-workflow project (AE49_Hub, Nuri_Hub, future siblings) — when
a gate opens, the checklist format (Thai, full sentences, 5–7 parent items per feature section, at most 5 sub-steps each),
circled gate numbers per deploy round, the clickable docs/gate-checklist page (ticks keyed by content, a fix during a gate as
a NEW section, only open sections on the board), every item's three tags [EMU] (account) {Nav -> Page} and quoted values, the
CLOSED payload at landing, template adoption and the emulator-by-default rule — plus the scripts that CHECK and CLOSE the page
(validate-gate.cjs, close-gate.cjs). Invoke BEFORE writing, rewriting, renumbering or closing ANY gate, every time, and
whenever the owner says a gate "ไม่ตรงกติกา", "ข้อเยอะไป", "ไม่เห็น Gate", or asks for a test checklist. Split out of
ae49-router 2026-09-25.

## Split out of `ae49-router` (2026-09-25)

Owner, on Main's review of the router: *"ทำทุกข้อไปเลย"*. For weeks these rules were ONE ~150-line paragraph inside the router.
On 2026-09-23 the first gate after a context compact broke eight of them — handed over in chat instead of on the page, 10 items
instead of 5–7, no section heading, no `[EMU] (account) {Nav -> Page}` tags, placeholder accounts, unquoted values — because
the router's body had left context with the compact and nothing had reloaded it. Two fixes: the rules became a skill of their
own that Main invokes before every gate, and the checkable half of them became a SCRIPT, which a compact cannot erase.

## Numbering restarts under every section (owner 2026-09-18)

A count running across sections moved every later item's number whenever a landed section was dropped, so "ข้อ 11" pointed at
a different item after each board rewrite — *"ลำดับข้อจะขยับทำให้ผม Reference หาคุณลำบาก และ สับสนได้ง่าย"*.

## Budget per feature (owner 2026-08-13, reminders 2026-09-08 and 2026-09-15)

On 2026-09-08 Main opened a 44-item combined list by pasting every plan checklist plus every audit drift line; the owner's
reminder was that the drift lines are merged INTO the 7, never appended. On 2026-09-15 a 16-item section inherited from a
close-day board drew the second reminder — *"ผมตรวจไม่ไหว … แต่ละเรื่องต้องมีไม่เกิน 7 ข้อ"* — and the owner asked for the rule
to live in the skill read every session, not in memory.

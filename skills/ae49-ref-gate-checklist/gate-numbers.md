**Scope (part of ae49-ref-gate-checklist, split out 2026-10-09):** how a gate is NAMED — the circled glyph, the per-deploy-round counter, the sha prefix on durable records. Moved whole from the `SKILL.md` section "Gate numbers — circled, per deploy round".

## Gate numbers — circled, per deploy round

**Gate numbers are CIRCLED numerals (owner 2026-09-17: "ทำให้เป็นกติกาการบอก Gate เป็นเลข
ลักษณะนี้ ㊶").** Every gate section Main opens is named by the project's NEXT number written
as ONE circled numeral — ①…⑳ (U+2460–2473), ㉑…㉟ (U+3251–325F), ㊱…㊿ (U+32B1–32BF) —
never "Gate 3", "G3", "#3" or "(3)". The same glyph names that gate everywhere: the
checklist page's section heading (`## ㊶ <feature> — <what it proves>`), the chat message,
the board's Stage cell (`🧪 Gate ㊶`), plan notes, the in-flight memory and the landing
commit / closed line. **The counter is PER PROJECT and PER DEPLOY ROUND (owner 2026-09-17:
"อยากให้เลขขึ้นใหม่ทุกครั้งที่ push เพราะถือว่าส่ง Deploy แล้ว")** — one push = one deploy, so
gates are numbered within that round (a patch note is NOT tied to a push any more — canon
`web-task-patch-note`, owner ruling 2026-09-22 — so a round is named by its DEPLOY, never by
a note version). Inside a round the counter
only moves forward, across days, machines and accounts: every new section takes the next
unused number — a fix issued as a new section during a gate, and a pulled section re-issued
fresh, each get a NEW number too. **After a deploying push succeeds, the next gate starts
again at ①.** A gate still OPEN at push time keeps its number until it closes (its feature
is not in that deploy); the new round skips any number still open on the board so two open
sections never share a glyph. **Chat and the board use the bare glyph** (㊶); **durable
records — plan notes, in-flight memory, commit bodies, closed lines — prefix the SHORT SHA
of the commit the round deployed** (`5530de65 ①`; the round opens at that push, so the sha
is known the moment it opens) so a glyph read later is never confused with the same glyph
from another round. Until 2026-09-23 the prefix was the round's upcoming patch-note
VERSION (`V6.3 ㉓`); once notes stopped being one-per-push (canon `web-task-patch-note`,
ruling 2026-09-22) two rounds could share a version and the prefix stopped
disambiguating — owner ruling 2026-09-23 ("เห็นด้วย") moved it to the deploy sha. Main may name the number at dispatch ("จะขึ้น gate ㊶") so
the owner can refer to it early. **Where the counter lives:** the round's deploy sha and the
last number used are written into the project's in-flight memory each time a section opens
and reset there at each push; a resuming session reads them before numbering. **Past ㊿ in
one round** (Unicode has no circled numeral beyond 50 — unlikely, a round runs ~25 gates)
numbering wraps to ①, skipping numbers still open, and Main says so once.

# ~/.claude/CLAUDE.md history

Why the rules in `CLAUDE.md` are shaped as they are. The rules themselves live in `CLAUDE.md`; a conflict resolves in its favour.
Incident stories moved out on 2026-11-02 (S8, owner Q340 a).

## Session initialization

- **Report format in the session list (added 2026-08-14).** It was not in the list, so a whole session of audit relays and status
  tables was improvised instead — findings with no IDs to refer back to, and ad-hoc columns instead of the board.
- **Question format in the session list (added 2026-10-01).** A grill's questions had shrunk to caveman one-liners
  (*"ไม่ใช่การเขียนแบบสั้นๆ แล้วไม่อธิบายอะไรเลย ผมอ่านแล้วไม่เข้าใจ"*).
- **Re-invoke after a compact (rule 2026-09-23).** In the first gate after a compact, Main handed the checklist over as a chat
  message with 10 items. The gate rules (now `ae49-ref-gate-checklist`, split out of `ae49-router` on 2026-09-25 for this reason)
  say a gate is written into the project's clickable `docs/gate-checklist.js` page and handed over as a link, and that a
  section holds 5–7 items and must never reach 10 — the owner had already said so twice. Neither rule was in context to be
  followed, and the owner spotted it before Main did (*เป็นเพราะ Compact Session แน่เลย*).
- **What the docs say about re-injection (checked 2026-11-02, S9).** Invoked skills are re-injected after a compact only up to
  5,000 tokens each and 25,000 in total; the router (about 8k tokens), autopilot (about 7k) and report format (about 5k)
  exceed or reach the per-skill cap, so re-invoking stays required. The SessionStart hook `after-compact-note.cjs` (installed
  by S4, matcher `compact`) reminds; it cannot invoke the skills.

## Files I hand you are DISPOSABLE (rule 2026-08-28)

On 2026-08-28 the owner asked whether the drop-off folder could be cleared, and two things lived ONLY there: source SVG art
(otherwise present only in a throwaway build worktree, not the repo) and the multi-megabyte workbook that every line of its
calculation spec was derived from. Both would have been unrecoverable.

## Communication

- **PowerShell commands (rule 2026-10-02).** The same day the pre-push block was handed over as `bash` blocks with plain `npx`,
  failed on the first line, and the owner had to ask twice (*"มันรันไม่ได้ ต้องเป็น npx.cmd"*).
- **Plain text as well as the code block (addendum 2026-10-02).** Twice that day the owner could not see the fenced block
  (*"คำสั่งอยู่ไหนละ … ให้ผมพิมพ์ว่าอะไร"*) and had to ask three times.
- **Start with `cd` (addendum 2026-10-22).** The 2026-10-22 backup-sweep command was handed over as `cd …; node …`, and the owner
  asked for that to be the rule (*"ผมเองเปิดใหม่ทุกครั้งไม่ได้เปิดคาไว้ จดเรื่องนี้เข้ากติกา"*).
- **Commands written into a file (addendum 2026-10-28, owner Q2 c).** On 2026-10-27 every deploy line in one hub's CLAUDE.md
  carried the home path and failed at the `cd` on the office PC; the owner asked for the fix at user level (*"จะได้ทำได้ทุก Project"*).
- **"กลับบ้าน" → Cloud Shell (rule 2026-10-29).** The AE49 owner went home mid-chain (set-owner rules deploy pending) and asked for
  this to be the rule everywhere (*"ถ้าผมบอกกลับบ้าน ให้คุณส่งคำสั่ง … มาเป็น Cloud … แทนทั้งหมด"*); the first project's path was
  proven the same day (clone in Cloud Shell's home, backup branch → `Deploy complete!`, no login needed).
- **Times from the clock (rule 2026-09-18).** Main wrote "02:20" while the owner's screen showed 14:20 — every stamp since noon
  had been an estimate stacked on an estimate, about 10 h adrift, and the whole day's memory had to be corrected
  (*"ทำไมคุณจดเวลาเป็นเวลาต่างประเทศ ที่นี้ที่ไทยนะ"*).
- **Thai only (addendum 2026-10-30).** An open-day's two short progress lines came out in Vietnamese ("Autopilot ON → chạy tick
  trước", "Đang mở ngày …") and the owner asked for the rule (*"ระบุลงในกติกา User Skill หน่อยว่าให้ใช้ภาษาไทย ไม่ใช้เวียดนาม"*).

## One session, one project folder (rule 2026-09-09)

- On 2026-09-08 a sibling session's commit swept another session's staged files along and a launcher was rewritten underneath a
  batch that was still running.
- The skills-repo exception (2026-09-22): a session stopped to reason the two rules against each other before a one-line doc
  fix — the answer belongs in the rule, not re-derived every time.

## Say disagreement FIRST (rule 2026-09-10)

The owner asked to remove every dropdown arrow app-wide and Main started doing it with only a one-line "trade-off" note, when
the honest professional answer was "unconventional — a form picker that looks like a text box needs an indicator; hide the arrow
only in the dense grid". The owner wants that answer first, every time.

## Effort: no reminders for Main (owner ruling 2026-10-02)

On 2026-10-02 a morning of reminders moved the session xhigh → high → max in two hours and the owner found the replies worse at
the lower level; the ladder that used to live in CLAUDE.md (design = xhigh/max, everything else = high, high the floor) was
withdrawn for Main.

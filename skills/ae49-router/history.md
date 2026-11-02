# ae49-router history

Why the rules are shaped as they are. The rules themselves live in `SKILL.md`; a conflict resolves in its favour.

## Session length, as written before the 2026-11-02 merge

Three generations of this section stood side by side and disagreed on the threshold, on whether new work was done, and on who
runs the swap. Merged per owner Q340 a; the latest ruling won each conflict.

A long session costs more on every turn (the whole context is re-sent), and every compact drops
the loaded skill bodies (the 2026-09-23 lesson in `~/.claude/CLAUDE.md`) and blurs old detail.
The project's state already lives in files — the in-flight memory, `_open-items.md`, the plans,
the autopilot log, git — so a fresh session that opens the day from them loses nothing. So Main
**offers** to close this session and open a new one when BOTH hold:

- **A clean break** — no agent running, no gate open, no uncommitted or unlanded work in the tree,
  nothing half-asked (a question may be pending only if it is in the register).
- **The session is long** — measured by its CONTEXT, not by how much work landed (owner 2026-10-29, Main's proposal
  "เอาตามที่เสนอ"): at about **75 %** of the context window used Main starts the 🧹 line and steers to the nearest break;
  at about **85 %** it takes no new work at all and swaps at the first break reached; a session that has been compacted
  at least once also counts as long. Main reads the percentage itself with the desktop app's `get_usage` tool (the
  `context` block — the same figure as `/context`; see below). Why: the old proxy ("about 5 features
  landed, or half a working day") fired at 63 % on 2026-10-29 after five small landings, while a day of large builds
  could reach 90 % before five; the real costs — every turn re-sends the whole context, a compact drops the loaded
  skill bodies (2026-09-23), old detail blurs — track the context, not the feature count.
  **The window is 1,000,000 tokens — never guess the percentage from how long the chat feels (owner 2026-10-29:
  *"เขียนลงในกติกาด้วยนะ อย่าพลาดแบบนี้อีก"*).** Main measures against the model's real window (Opus 5.5 here: 1M; a
  full working day of agent reports is roughly 300–400k ≈ 30–40 %). BEFORE writing any 🧹 line or deferring work for
  length, Main must have a figure: it calls `get_usage` (`mcp__ccd_session_mgmt__get_usage`, session "self" — load it
  with ToolSearch when deferred) and reads `context.percentUsed`; only when the tool is missing or answers
  "unavailable" does it ASK the owner to run `/context` and wait for the number. It never warns, defers a dispatch or
  steers to a break on its own estimate. Why: on 2026-10-29 ~15:20 ICT Main guessed "~70–75 %", started the 🧹 steering
  and held back a fold and three builds; the owner's `/context` read 37 % (374.8k / 1m) — the work was delayed for
  nothing. The same evening Main asked the owner for `/context`, and the owner asked why Main could not read it itself
  (*"ผมสงสัยคุณตรวจสอบ /context เองไม่ได้หรอ"*) — `get_usage` gave 42 % against the owner's 41 %; owner "แก้กติกา",
  2026-10-29.

How: first rewrite the in-flight memory so it is complete, then put the offer as the `wrap_up`
question with a "new session" button (or one Thai line where there is no box). The NEW session
**replaces** this one — it is not a parallel session in the same checkout. Main never closes a
session itself, never offers in the middle of a build / gate / landing, and offers again only at
the next clean break. The owner may say "เปิดใหม่" at any time and Main prepares the memory at once.
When the owner accepts, run `ae49-task-session swap` (the FAST same-machine swap —
commit, rewrite in-flight, keep Autopilot as it is, backup push, report — the USER then opens the
new session; Main never starts it) — never
`ae49-task-session close`, which is for switching machines (owner HQ1 a, 2026-10-27; the three
ceremonies became one skill 2026-10-28).

**Long but no break yet → warn the owner so a break can happen (owner 2026-10-22: *"ถ้า Session ยาวแล้ว
ให้เตือนผมหน่อย ผมจะได้หยุดสั่งงาน ไม่งั้นผมจะสั่งไปเรื่อยๆ จะไม่เจอจุดพัก"*).** A clean break never
comes while new work keeps arriving. So from the moment the session is long (the second bullet above)
until it is closed, EVERY message to the owner carries one line right above the 🤖 line:
`🧹 Session ยาวแล้ว — แนะนำหยุดสั่งงานใหม่ ให้งานที่ค้างจบก่อน แล้วเปิด session ใหม่` (add what is still
running in a few words, e.g. "รอ B2 audit"). It is a reminder, not a refusal: new work the owner orders
anyway is still done. When the in-flight work finishes, the line gives way to the offer above.
Why: on 2026-10-22 the owner closed a session that had stayed open two days because it felt unsafe,
and asked that Main be the one to suggest the break (*"เพิ่มกติกาให้คุณ แนะนำผมเพื่อเปิด Session ใหม่"*).

**Main STEERS to the nearest break, then says "close now" (owner 2026-10-29: *"เมื่อไหร่ที่คุณมองว่า Session ยาวเกินแล้ว
ช่วยหาจุดพักที่ใกล้ที่สุด แล้วบอกให้ผม ปิด Session เปิดใหม่ให้เลยนะ ผมจะไม่สั่งงานใหม่ไปให้"*).** The 🧹 line is no longer
only a reminder. From the moment the session is long:
- **Main names the nearest break** in the 🧹 line — what is still running and when it should end (e.g. "จุดพักถัดไป: หลัง
  Pile B2 build + clear-optional B2 build กลับมา ≈ 11:30").
- **Main starts nothing new** — no new dispatch, no next batch of a chain, no new plan; queued or newly unblocked work goes
  into the in-flight memory for the next session. In-flight agents are allowed to FINISH (their result is recorded); a
  result that would open more work (an audit after a build, a fold after an audit) is NOT chased — it is written down as
  the next session's first action. A gate already running finishes and lands if it passes.
- **The moment the last running agent is back and recorded**, Main runs `ae49-task-session swap` (commit, in-flight
  memory, backup push) and tells the owner plainly, in its own line: `🧹 ถึงจุดพักแล้ว — ปิด session นี้ แล้วพิมพ์
  /ae49-task-session ใน session ใหม่`. Built-but-unaudited worktrees are a clean break (they are named in the memory).
- The owner has said they will stop ordering new work once warned; a live order that still arrives is done only if it
  is a few tool calls, otherwise it is written into the memory for the next session and Main says so in one line.

## Incident stories moved out of SKILL.md on 2026-11-02 (S8, owner Q340 a)

The rules stayed in `SKILL.md` with their ruling ids; these are the stories that explained them.

- **Audit at xhigh (owner 2026-09-30).** The audit is the step that found every Major on 2026-09-25, so it gets the deepest
  reasoning of the roster.
- **Ceremony scaled to risk (owner 2026-09-25, "เอาทั้ง (ก)–(ง)").** On 2026-09-25 a ~150-line change cost ~25 agent-minutes
  through plan → build → audit → fix against ~12 inline, and the audit was the part that paid: it found two defects that
  would have shipped.
- **Owner-only steps batched into one sitting (owner 2026-09-25).** About 50 of the ~75 minutes of the 2026-09-25 link-cap
  landing were the owner's Cloud Shell turn and the waits around it.
- **Board stage legend.** Before 2026-08-14 this skill carried a second, slightly different emoji set (⏳ waiting, ⛔ on
  hold, 🗄️ recently landed), so two skills defined the same board two ways; the legend now lives only in
  `ae49-ref-report-format`. The five board columns are the four of the 2026-08-13 ruling plus the row number added
  2026-09-16 so the owner can answer "ข้อ 3".
- **Open-items register (owner ruling 2026-09-30, *"ทำไมงานพวกนี้ถึงไม่เจอตอนคุณรายงานสถานะ … ผมไม่อยากให้เกิดขึ้นอีก"*).**
  The seismic tool (decoded 2026-09-18, Q1–Q14 awaiting the owner), T0202 Q18 and several deferred follow-ups vanished for
  12+ days because the board read only `docs/plans/*.md` while those items lived as prose inside a ~2,900-line in-flight
  memory file, and a close-day then wrote "backlog cleared".
- **Tell the owner in the same moment (owner Q32 a, 2026-10-28).** On 2026-10-28 OI-223 (15:47), OI-224 and OI-225 (at the
  swap) were only written into the register and reached the owner 30–60 minutes later while the owner sat watching
  (*"คุณมักไม่มาถามผมทันที มักจะเขียน Register จดไว้เฉยๆ"*), and a 👤 line said nothing was waiting while the table held
  owner rows.
- **A shared strings file is not a chain (owner 2026-10-16).** The Options-table rebuild waited 35–80 min behind
  `rd-row-actions` B1 only because both added words to `lib/rd/foundation/labels.ts`, in disjoint sections.
- **Worktree junctions.** The hub's own `node_modules` was emptied on 2026-09-25 (the builder had been given the hub's
  `node_modules` by link). The safe recipe was then used four times on 2026-09-30 with the hub's `node_modules` intact each
  time. On 2026-10-20 a skipped outside link was followed by `git worktree remove --force` and emptied the hub's
  `node_modules/firebase-admin` and `rimraf` while the folder count still read 457, which is why step 4 checks those two
  packages and not the count alone.
- **Auto-approval splits on "beyond the grill" (owner Q9 a, 2026-10-06).** The plan `rd-project-first`, written after a
  one-question grill, carried a decision nobody asked about (first Save stops asking for the project), a bug the planner
  found, and two new questions; a blanket auto-approval would have put all of them into the build unseen.
- **Plan frozen per dispatch (L3, 2026-11-02).** CCP_Hub 2026-10-31: four first-round BLOCKERs in a day came from decisions
  added after the build began.
- **Gate rules split out (2026-09-25).** The gate rules were one ~150-line paragraph in the router, and the first gate after
  a compact broke eight of them; they now live in `ae49-ref-gate-checklist`.

---
name: web-ref-duration-format
description: The ONE way a duration (a span of time — hours worked, minutes late, payable overtime, a booked block, leave hours) is written on screen and on paper in every hub project (AE49_Hub, Nuri_Hub, future siblings). Two families that never mix — MINUTE-PRECISE durations read `1h 4m` / `42m` / `2h` (compact, no zero parts, no decimals, no minus sign), HALF-HOUR-GRID quantities read `3.5h` / `4h` (decimal hours with the `h` suffix) — plus the header rule (a column is named for the quantity, `Late` / `Total Hours`, never for the unit like `Late (min)`) and the Thai-prose rule (`สาย 64 นาที` in a sentence, `1h 4m` in a cell). Use whenever adding, formatting, relabelling or reviewing ANY duration, hours figure, minutes figure, lateness figure, or time-span column, tooltip, caption, print cell or log line — trigger even when the user only says "show the hours", "add a minutes column", "how long", "late by", "format the time worked", or pastes a duration that looks different from the others. Each project keeps only its helper names here; the rule changes HERE once.
---

# Duration format — shared canon

Two owner rulings settled this: *"one claim can never read two ways"* (2026-08-06,
which killed decimals in the overtime module) and *"แก้ช่อง Late (MIN) ให้เหลือแค่ LATE
… ตัวเลขที่แสดงให้มี m ต่อท้ายเหมือนกับช่อง total hours"* (2026-09-09, which made the
late figure read like every other minute figure). This file is where that
consistency lives so the next duration is not invented per page.

## 1. Two families — pick by what the number IS, never by taste

| Family | The quantity | Reads as | Examples |
|---|---|---|---|
| **Minute-precise** | anything measured off a CLOCK — time worked, payable overtime, minutes late, a clocked span, the difference between two times | `Xh Ym`, compact: drop a zero part, no decimals, no minus sign | `1h 4m` · `42m` · `2h` · `3h 30m` · zero → `0h` |
| **Half-hour grid** | anything the app STORES on its 0.5 h grid — a booked block, leave hours, a draftsman reservation, a quota | decimal hours with the `h` suffix, at most one decimal, trailing `.0` dropped | `3.5h` · `4h` · `0.5h` · `12h` |

- The families never mix on one figure: a booked 3.5 h block is `3.5h`, never
  `3h 30m`; 64 clocked minutes are `1h 4m`, never `1.07h` or `64 นาที` in a cell.
- **The one named exception — LATENESS in whole minutes where a project's HR asks
  for it** (AE49_Hub Overtime `Late`, owner relaying HR 2026-09-11: *"HR เอาแค่ Late"*
  — HR keys lateness in minutes). It stays minute-precise (no decimals, no seconds),
  reads `65m` · `125m` (a total of none reads `0m`), goes through the project's
  own named helper, and is listed in §5. Nothing else borrows it: the other
  durations on the same page keep `Xh Ym`, and a project without the row in §5
  writes lateness as `1h 4m`.
- A before → after pair keeps ONE family on both sides (`3h → 3.5h`, `4h 23m → 4h`).
- Negative or impossible input never prints a minus sign — the figure renders its
  floor (`0h`) and the explanation lives in a caption beside it.
- A cell whose figure is "nothing to say" (not late, unmeasurable, no clock) shows
  the app's dash `—`, with a `title` tooltip saying WHY in Thai; the formatter is
  never asked to render that case.

## 2. Headers name the quantity, not the unit (owner ruling 2026-09-09)

`Late` · `Total Hours` · `Hours` · `Break` · `Start / End` — the unit rides on the
VALUE (`1h 4m`), so a header never carries `(min)`, `(h)`, `(hrs)`. The one exception
is a chart axis or a report title that must state its unit for a scale (`(h.)` on the
draftsman charts) — that is a chart rule, not a table one.

## 3. Prose vs cells

- A **table cell, print cell, chip or tile** uses the compact form: `1h 4m`,
  and **it never wraps** (owner ruling 2026-09-10). `1h 4m` is ONE figure, not two
  words: broken across two lines it reads as two numbers stacked in a column of
  numbers, and on a printed sheet the reader cannot tell a wrapped figure from a
  second row. So the cell that holds a duration carries `whitespace-nowrap`, and
  a column that holds durations is given enough width for its widest figure
  rather than being allowed to wrap — if something has to give, take the width
  from a text column (a name, a description), never from a duration column.
  This applies on screen and on paper, to a total row as much as to a data row.
- A **Thai explainer sentence** (Policy column, tooltip, caption, toast, log
  line meant for staff) spells the unit out in Thai, minutes only when the figure
  is minutes: `สาย 64 นาที — เส้นแบ่งเวลาเข้าวันนั้นคือ 13:00`, `รวม 3.5 ชั่วโมง`.
- An **English row label** in a list (the dossier's late list) keeps the compact
  form with the word after it: `1h 4m late`, `expected by 13:00`.

## 4. Don'ts

- Don't format a duration by hand (`${h}h ${m}m`, `toFixed(1) + "h"`) — call the
  project's helper (below), so a future change to the shape happens once.
- Don't show seconds anywhere; the clock data is minute-precise by design.
- Don't pad (`1h 04m`), don't use colons for durations (`1:04` reads as a clock
  time), don't write `hrs`, `mins`, `นาที` inside a cell.

## 5. Per-project helpers (facts only — the rule above is the canon)

| Project | Minute-precise `Xh Ym` | Half-hour grid `3.5h` |
|---|---|---|
| **AE49_Hub** | `formatHoursMinutes(minutes)` — `lib/overtime.ts` (Overtime Total Hours, Claim, Break, payable notes) · **§1 exception:** `formatLateMinutes(minutes)` — `lib/overtime.ts`, the Overtime `Late` cell and the print sheet's `Late` + its total in whole minutes (`65m`, HR 2026-09-11) | `fmtHours(hours)` — `lib/leave.ts`, and the call site appends the `h` (`${fmtHours(h)}h`; import review, draftsman bookings, leave hours) |
| **Nuri_Hub** | no duration on screen yet — when one appears, add the same two helpers under the same names and point this row at them | — |

A project adds a row here when it gains a duration; it never restates the rule in
its own skills (`ae49Hub-ref-text` covers the TYPE of a cell, this file covers the
SHAPE of the number).

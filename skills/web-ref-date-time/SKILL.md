---
name: web-ref-date-time
description: "Canon (web-ref-*) for dates, clock times and durations: one display helper, one picker per hub, 24-hour clock, safe date-only parsing; durations read 1h 4m / 42m or 3.5h / 4h, never mixed. Use for any date, time picker or hours figure; เลือกวันที่, เลือกเวลา, วันที่เพี้ยน, วันคลาดไปหนึ่งวัน, สาย 64 นาที, how long, late by, format the time worked."
---

# Dates, times and durations

Each hub keeps its helpers, components and its own ruled format in `<hub>-ref-date-time`; a rule changes here, once.

## 1. Dates

- **One display helper.** Every date on screen goes through the hub's one helper, in the one format the hub's owner ruled and its facts skill records. A page never formats a date by hand.
- **One picker.** The hub's facts skill names the control its owner ruled for picking a date, and every date picked in that hub uses it. Where it is a shared component, that component holds the only calendar grid: extend it, never fork it.
- **Stored as `yyyy-mm-dd`,** a month as `yyyy-mm`; empty is `""`.
- **One record's start and end are one range,** not two unrelated fields, when the hub's picker has a range.
- **A required date is checked in the submit handler** and takes the red frame (`web-ref-form-errors`).

### Parsing a date-only string

`new Date("2026-11-02")` parses as UTC, midnight UTC: in Bangkok that is 07:00 on the same day, so `getHours()` and day arithmetic are off, and any zone west of UTC sees the previous day. The day-early bug here comes from the way back: `toISOString()` on local midnight is the previous day in UTC (`new Date(2026, 10, 2).toISOString()` is `2026-11-01T17:00:00.000Z`).

- **Parse** a date-only string as local: `` new Date(`${iso}T00:00:00`) ``.
- **Format back** from local parts through the hub's helper, never `toISOString().slice(0, 10)`.

## 2. Clock times

- **24-hour `HH:mm`,** on screen and stored; `""` is not set. `24:00` is legal only as the exclusive end of a day.
- **One picker,** the same way as dates; never a hand-built list of times. A hub with no clock time yet builds the shared control when the first one appears.
- A stored value off the picker's step still displays and is never auto-rounded.
- A date with a time uses the hub's helper for that pair.
- **A date with a time shown as a VALUE is two lines** — the date on top, the time below in gray — in a table cell
  and in a detail field's value, through ONE shared component (AE49_Hub `components/ui/DateTimeCell.tsx`: two
  `whitespace-nowrap` lines, `leading-tight`, non-truncating). The one-line pair stays only inside a sentence, a
  caption, a tooltip or a toast. A column's width is set by the DATE line. Never hand-build the two lines from two
  helpers. (AE49 owner Q107 b, 2026-10-21; lifted to every hub by AWDC 2026-11-04 P5 a, `web-task-hub-parity`.)

## 3. Durations: two families, picked by what the number IS

| Family | The quantity | Reads as | Examples |
|---|---|---|---|
| **Minute-precise** | anything measured off a CLOCK: time worked, payable overtime, minutes late, a clocked span, the difference between two times | `Xh Ym`, compact: drop a zero part, no decimals, no minus sign | `1h 4m` · `42m` · `2h` · `3h 30m` · zero → `0h` |
| **Half-hour grid** | anything the app STORES on its 0.5 h grid: a booked block, leave hours, a reservation, a quota | decimal hours with the `h` suffix, at most one decimal, trailing `.0` dropped | `3.5h` · `4h` · `0.5h` · `12h` |

- The families never mix on one figure: one claim never reads two ways. A booked 3.5 h block is `3.5h`, never `3h 30m`; 64 clocked minutes are `1h 4m`, never `1.07h` or `64 นาที` in a cell.
- An owner ruling for one named column is listed in that hub's duration facts, and an audit treats it as conforming. It covers that column only.
- A before → after pair keeps ONE family on both sides: `3h → 3.5h`, `4h 23m → 4h`.
- Negative or impossible input never prints a minus sign: the figure renders its floor (`0h`), and a caption beside it explains.
- A cell with nothing to say (not late, unmeasurable, no clock) shows the app's dash `—` with a Thai `title` saying why; the formatter is never asked to render that case.

**Headers name the quantity, not the unit:** `Late` · `Total Hours` · `Hours` · `Break` · `Start / End`. The unit rides on the value, so a table head never carries `(min)`, `(h)`, `(hrs)`. A chart axis or report title may state its unit when its scale needs it.

**Prose vs cells:**

- A **table cell, print cell, chip or tile** uses the compact form and never wraps: `1h 4m` is one figure, and broken across lines it reads as two numbers. The cell carries `whitespace-nowrap`, and its column gets the width of its widest figure, taken from a text column if something must give. On screen and on paper, totals too.
- A **Thai sentence** (Policy column, tooltip, caption, toast, staff log line) spells the unit out, minutes only when the figure is minutes: `สาย 64 นาที — เส้นแบ่งเวลาเข้าวันนั้นคือ 13:00`, `รวม 3.5 ชั่วโมง`.
- An **English row label** keeps the compact form with the word after it: `1h 4m late`, `expected by 13:00`.

**Don't:**

- Format a duration by hand (`${h}h ${m}m`, `toFixed(1) + "h"`): call the hub's helper, so a change happens once.
- Show seconds in a duration; clock data is minute-precise by design.
- Pad (`1h 04m`), use colons (`1:04` reads as a clock time), or write `hrs`, `mins`, `นาที` in a cell.

Helper names, paths and one-column rulings are the hub's facts (AE49: `ae49Hub-ref-date-time/duration.md`). A hub with no duration on screen adds the same two helpers under the same names when the first appears. `<hub>-ref-text` covers a cell's TYPE; this covers the SHAPE of the number.

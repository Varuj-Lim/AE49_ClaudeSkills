# web-ref-date-time history

- **2026-11-02, S10 D6:** the shared date and time core was written here, and all of `web-ref-duration-format` moved in; that name stays as a pointer.
- **Timezone claim corrected.** `ae49Hub-ref-date-time/date.md` says plain `new Date(iso)` "lands a day early in Asia/Bangkok". Run in Bangkok on 2026-11-02, `new Date("2026-11-02")` gave 07:00 on Nov 2, the same day. The day-early result in Bangkok comes from `toISOString()` on local midnight (`2026-11-01T17:00:00.000Z`). The west-of-UTC sentence is reasoning from the UTC parse, not a run.
- **Hubs differ by owner ruling, and that is data, not an exception:** NURI_Hub's ruled display is `30 Sep 2026` (owner DF1 b, 2026-10-09) and its picker is the native date input; AE49_Hub, AWDC_Hub and CCP_Hub use `DateField`. The canon names the shape and each hub records its ruling.

## Duration rulings

- 2026-08-06: *"one claim can never read two ways"*, which killed decimals in the overtime module.
- 2026-09-09: *"แก้ช่อง Late (MIN) ให้เหลือแค่ LATE … ตัวเลขที่แสดงให้มี m ต่อท้ายเหมือนกับช่อง total hours"*, which made the late figure read like every other minute figure and headers name the quantity.
- 2026-09-10: a duration in a cell never wraps.

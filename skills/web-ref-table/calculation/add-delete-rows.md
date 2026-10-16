**Scope (part of web-ref-table, added 2026-10-16):** how the user adds and deletes rows in an INPUT table, meaning a table whose rows the user types. Calculation tables, price lists and repeated-row parameter tables are covered. Record lists are not; those add through a form or page.

# Add / delete rows: the row-end Action pair

Owner, AE49_Hub, 2026-10-16, on the Pile Prices table: *"ผมชอบ ตารางที่มี Action เพิ่ม และ ลบ อยู่ด้านท้าย อยากให้ทุกตารางที่เราต้องกรอกข้อมูลเป็นตาม format นี้ … เอาปุ่ม +Add ออกเลยเพราะเอาไปท้ายแถวแล้ว"*. Plan `rd-row-actions`, rulings RAQ1–RAQ6 a.

## The rule
1. **Every input table ends with an `Action` column** holding two icon buttons per row:
   - **`+`** inserts a blank row directly BELOW that row.
   - **The bin** deletes that row. Ask before deleting only when the row holds data that cannot be recovered or that something else depends on. A blank row can go silently.

   The head `Action` is visible text, not screen-reader only. In the legend popup it is the last row.
2. **No separate "Add row" button.** It goes away, whether it sat under the table, in the toolbar or as a pill. A table with no rows shows ONE row instead: a caption across every column but Action, saying what is missing and "กด + ท้ายแถวนี้…", and in the Action cell a single `+` that adds the first row.
3. **Insert under the clicked row, even in a sorted view.** The new row appears right under the row that was clicked in the order on screen, not at the end of the data. If the clicked row has vanished meanwhile, insert at the top. A `null` "after" adds at the end.
4. **Paste from Excel still grows the table at the end** (`keyboard.md` P-rules). The add door takes `null`. A paste at the last row overwrites that row first, then grows the table.
5. **Caps and refusals keep their reasons on hover.**
   - When the table is full, the `+` dims but stays hoverable, with `aria-disabled` and the click suppressed. Its title gives the reason, e.g. "ตารางรายชั้นมีได้ไม่เกิน 200 แถว".
   - A bin that may not delete, such as the last row of a table that needs one, says why in its title.
   - Never use a `pointer-events-none` that eats the reason.
6. **Read-only (a locked set)**
   - The Action cell stays, so the columns do not move (T4), but it is empty.
   - The empty-table caption becomes a read-only sentence with no "กด +", e.g. "ชุดนี้ไม่มีจุดรับแรง".
7. **Widths:** the pair is a column KIND on the project's scale (T2):
   - two 28 px buttons + an 8 px gap + the tier's horizontal padding;
   - in AE49_Hub, the mid tier is 80 and the list tier is 96.

   Measure on the real cells. When the wider Action column pushes a table past the card at the project's target window, narrow a name or code column (truncating with the full value on hover). Do not let the table scroll (AE49 owner RAQ6 a).
8. **Labels:**
   - The `+` title is `Add — <what> ใต้แถวนี้` and the bin title is `Delete — <what>`; both are English verbs plus a Thai explanation.
   - The aria labels name the row, e.g. "เพิ่มจุดรับแรงใหม่ใต้ จุดที่ 3" / "ลบแถว จุดที่ 3". The first-row `+` aria drops the "Add — " prefix.
   - Thai wording lives in the labels file, never in the component, unless the project records an exception.
9. **Keyboard:** the icons are not arrow-key or paste stops. Tab reaches them; a native-disabled bin is skipped (`keyboard.md`).
10. **Exceptions:** an add that is really a picker stays a button that opens its popup, for example AE49's "Add Footing", which chooses a pile spec and a design first. Record each exception in the project's facts file.

## Why
- One way to add and delete across every input table, placed where the eye already is: the row.
- A separate Add button drifts in position from table to table and always adds at the end. Inserting in the middle then meant add + cut + paste.

## Facts
Per project, in `<hub>-ref-table/calculation/add-delete-rows.md`: the adopting tables and their files, add doors, caps, texts, width kinds and exceptions. AE49_Hub has one (B5a of plan `rd-row-actions`).

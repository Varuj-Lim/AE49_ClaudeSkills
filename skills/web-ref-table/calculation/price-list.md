# Price lists — always the BOQ matrix

**Owner ruling 2026-10-09** (AE49_Hub, at the Pile Prices gate, after the per-size drilling and
concrete prices had been built as two separate input tables beside the BOQ block):
*"ผมอยากให้มันอยู่ในรูปแบบตารางเหมือนเดิม แบบเดียวกับ 1.2, 1.2.2 ไม่ใช่มาทำตาราง Input แบบนี้ จดเรื่อง
การใส่ราคาไปด้วยว่า เราจะใส่ราคาในรูปแบบตารางเหมือนของ BOQ"* — and the rule lives in this
user-level canon (*"เขียนใน user ref table skill นะ"*).

## The rule

Every table where a person TYPES PRICES — a company price list, a project's or a calculation set's
price snapshot, a per-size price family — is ONE BOQ matrix, the same shape as the BOQ on the
hub's pricing page:

| No. | Description | Unit | UNIT PRICE: Material | Labor | Amount |
|---|---|---|---|---|---|

- **Bands are header rows** (`1.2.` `งานเสาเข็มเจาะ`), items are rows under them, numbered the way
  the source workbook numbers them (`1.2.1.`, `1.2.2.` …). Rows keep the workbook's order.
- **Only the price cells are input boxes** — Material and Labor; Amount is computed (Material +
  Labor) and read-only. No. / Description / Unit are text.
- **A family priced by size** (per pile diameter, per concrete strength, per bar size) is a BAND with
  one row per size (`dp 35 cm`, `fc′ 280 ksc`) inside the same matrix — never a separate
  "size | Material | Labor | Amount" input table beside it.
- **A list that can grow or shrink keeps its controls inside the matrix** (under its band / on its
  row); the hub's facts file says exactly how. A second table to hold the editable part is the
  thing this rule forbids.
- Everything else is the calculation canon: column widths by kind (`columns.md`), arrow keys and
  Excel paste in the price boxes (`keyboard.md` T8), number boxes per `parameter-table.md` §10.

## Why

The engineers read and check prices against the BOQ printout and the source workbook, row by row.
One matrix in the workbook's own order lets them compare line for line; a separate input table
breaks the numbering and the reading order, and makes the same kind of price look like two
different things on one page.

## Facts

Each hub names its BOQ matrix tokens, its reference price page and how a sized band adds or drops
a row in its own `<hub>-ref-table/calculation/` facts. AE49_Hub: the R&D pricing page
(`rd/directory/pricing`), `FOOTING_BOQ_MATRIX_COLS` / `boqCellClass` / `boqPriceInputClass` /
`formatBoqMoney` / `BOQ_COLUMNS`.

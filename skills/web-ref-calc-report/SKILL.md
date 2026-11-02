---
name: web-ref-calc-report
description: "The rule for a detailed calculation report in any hub: every computed value shows its equation, the same equation with the real values put in, and the result with its unit, as separate parts an engineer can check by hand; a computed value in a table has an ƒx at the cell's top right opening a short how-it-was-calculated popup. Use when building, porting or reviewing a calculation report, a design sheet, an Excel calculation ported to the web, or a page that shows computed engineering values, and on \"รายการคำนวณ\", \"สมการ\", \"แทนค่า\", \"ค่ามาจากไหน\", \"เครื่องหมายในช่อง\", \"วิธีคำนวณของช่องนี้\", \"show the working\"."
---

# Calculation reports show their working

A calculation report exists so an engineer can check and sign it. A result with no working asks them to trust the program. Owner,
2026-11-02: every detailed calculation item writes its equation and its substitution separately.

## What counts

- **Applies:** a report or sheet an engineer reads to verify a design: strength checks, design sheets, a seismic report, a BOQ's
  derived quantities.
- **A table of computed values** (Pile Capacity, options, a report's pile tables): the `ƒx` in each cell below replaces the written formula (owner Q355 a). On paper such a table shows values.
- **Does not apply:** plain inputs and schedules.

## Each computed item shows four parts

| Part | Example |
|---|---|
| What it is, with its symbol | ความลึกประสิทธิผล, d |
| The equation, in symbols | `d = t − c − db/2` |
| The substitution, with this design's values | `= 60 − 7.5 − 1.6/2` |
| The result and its unit | `= 51.7 ซม.` |

Equation and substitution each stand on their own line or column, never merged into one string or left in a label.

- **Input or looked-up value:** name the source instead of an equation: `จาก Project Globals`, `ตาราง 1.4-1 (SD 2.0 ของ code ที่ใช้)`.
- **Branch:** show the branch that ran and why: `เนื่องจาก ρ < ρmin จึงใช้ ρmin`.
- **Clause:** name the code and clause when a known source states it; never guess one (owner Q355 a).
- **Check:** end with the comparison and verdict: `φVc = 45.2 ≥ Vu = 38.1 ตัน → ผ่าน`.
- **Same equation over many cases** (rebar groups, floors, axes): write the equation once and one substitution per case.

## A computed value in a table has an `ƒx` in its cell (owner 2026-11-02, Q352 a)

Every computed cell of a table has `ƒx` at the cell's **top right**, not `?`, since a page's `?` already means "what is this column". Pressing it opens a popup with the simple calculation of
**that cell**.

- **The popup** is the read-only kind (`web-ref-popup`): the item's name in Thai, the equation in symbols, the substitution with this
  cell's values, the result and unit, and a short plain sentence when the equation needs one. Simple means the steps that make this
  value, not the whole sheet; a value built from other computed values names them and shows their values.
- **The glyph** is one icon in the project's registry, small and quiet, positioned over the corner so it never sets the column's width or moves the
  number. It is a real button with a Thai label naming the item. It never prints.
- **Only on computed cells.** No glyph on an input, a text cell, or a cell with no value (`–`).
- **One component and one popup** for the whole table, fed by the same values as the engine (below). A table's rows do not each mount
  their own popup.
- **Not the section legend.** The legend (`web-ref-table/calculation/parameter-table.md` §4) still explains what each COLUMN means, once,
  and head cells still carry no markers. The cell's `ƒx` explains how this one VALUE came out.

## How it is built

- **The text shows what was actually calculated, only (owner Q353 a, 2026-11-02).** A substitution is built from the values the engine used, so calculating it by hand reaches the result. Where a source sheet's text differs from its own calculation, the calculation wins; this is the rule, so it needs no exception list.
- **One source of numbers.** The substitution reads the same values the engine used, never a second calculation. The engine
  returns the working with its result, or the report builds it from the engine's own intermediate values.
- **Rounding is visible.** Display values to enough digits that a calculator reproduces the result. When the engine rounds at a
  step, as ported workbooks do, the substitution shows that rounded value. When display rounding alone would change the last digit,
  say so once in the report's notes.
- **Text in the label file** of the module; symbols, units and numbers stay as engineers write them. Words are Thai
  (`web-ref-ui-language`).
- **Screen and paper are one component.** Length is accepted: a report may run to more pages so the working stays visible.
- **Test:** a harness evaluates each substitution string and compares it with the engine's value, so wording cannot drift from the
  calculation.

## Porting from Excel

Decode the sheet's display strings as well as its formulas (for example `CONCATENATE("= ",M54," - ",M39," - ",R72)`). They are part
of what the engineer reads, so a plan that ports a calculation sheet lists them and leaves none out silently. Their values follow the rule above.

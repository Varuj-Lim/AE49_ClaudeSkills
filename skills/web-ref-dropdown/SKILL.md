---
name: web-ref-dropdown
description: The ONE cross-hub rule for adding a NEW value to a dropdown (AE49_Hub, Nuri_Hub, future siblings) — wherever a user may add an option not in the list yet, the dropdown itself offers it: a typed text matching no option shows one row `Use "<typed>" as a new value` (Enter or click), never a separate "+ Add" button beside the field, a free-text input with suggestions, a `<datalist>`, or a trip to another page; a value that must live in a shared catalog opens that catalog's create popup from the same row and selects the new entry on success. Closed lists stay strict — status, people, records, fixed vocabularies never offer the row. Use whenever building, reviewing or auditing a dropdown / select / picker / combobox / type-ahead where users might add an option, or when the owner says "Use … as new value", "เพิ่มข้อมูลใน dropdown", "เพิ่มตัวเลือก", "add a new option". Each hub keeps its component names, props and site list in its own `<hub>-ref-dropdown` facts skill; this rule changes HERE once.
---

# web-ref-dropdown — adding a new value from the dropdown itself

**Owner ruling 2026-10-28 (AE49_Hub):** after using the Outsource Contacts form's Product Type —
*"การกรอกข้อมูลเพิ่ม แบบ Use "..." as new value … ผมชอบวิธีการนี้ หากต้องการเพิ่มข้อมูลลงใน Dropdown ที่เราทำ … ผมอยากให้ทุกที่
เป็นแบบนี้ทั้งระบบนะ ช่วยส่ง Audit ด้วย"*.

## The rule

1. **Where a user may add a value that is not in the list yet, the dropdown offers it in place.** Typing in the
   picker's search box a text that matches no option label exactly (trimmed, case-insensitive) shows ONE extra row:
   `Use "<typed>" as a new value`. Click or Enter commits it. The row disappears as soon as the text matches an option.
2. **Two flavours, one look** — chosen by where the value lives afterwards:
   - **Free value** (nothing else needs to know it exists): the typed text is stored on the record; the option list is
     the distinct values already used.
   - **Catalog value** (it must exist in a shared list first — a settings array, a type record): the same row opens that
     catalog's create popup pre-filled with the typed text, and on success selects the new entry. The row may say what it
     creates (`Create "<typed>" as a new type`).
3. **Not allowed for adding a value:** a separate "+ Add" / "New …" button next to the field, a free-text input with a
   suggestion list or `<datalist>`, an "Other — please specify" second field, or sending the user to a settings page and
   back. (A catalog may still have its own management page; the FORM does not send people there to add one value.)
4. **Closed lists stay strict.** Status values, people, records (projects, orders, employees), fixed vocabularies the
   code branches on, and anything another rule relies on never offer the row. The question is the owner's when unsure:
   *may a user invent this value?*
5. **The new value behaves like an existing one** at once: it shows in the trigger, it is offered in the next pick, and
   the save validates it like any other option.

## Checking it

Each hub's project audit carries a check for this rule (AE49_Hub: `ae49Hub-task-audit-project` topic `31-dropdowns`):
list every place a user can add a value to a pick list and how — the inline row (compliant), a separate button, a
free-text field with suggestions, a datalist, an "Other" field, or a settings-page detour — and every open list that
should allow adding but cannot.

## Hub facts

| Hub | Facts skill |
|---|---|
| AE49_Hub | `ae49Hub-ref-dropdown` — `components/ui/SelectField.tsx` props `allowNew` (free value) / `onCreateNew` (catalog value), `createNewLabel`, the site list |
| Nuri_Hub | its own dropdown facts skill (added by a handoff) |

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
   `Use "<typed>" as a new value`. Clicking it (or arrowing onto it and pressing Enter) commits it; a plain Enter on
   the query picks the FIRST matching option, so a near-duplicate is never created by accident (owner 2026-10-28 Q24 a).
   A near option the typo guard (rule 6) only ADDED back — the plain filter did not match it — is not a "matching
   option": Enter skips it, and when it is the only row Enter does nothing, so a real one-letter variant (`USB-A` beside
   `USB-C`) is never swapped silently (owner 2026-10-28 Q35 b).
   The row disappears as soon as the text matches an option exactly.
2. **Three flavours, one look** — chosen by where the value lives afterwards and what it needs:
   - **Free value** (nothing else needs to know it exists): the typed text is stored on the record; the option list is
     the distinct values already used.
   - **Catalog value, name only** (it must live in a shared list — e.g. a settings array — but the entry IS just its
     name): clicking the row writes the entry to the catalog and selects it at once — NO popup (owner 2026-10-28 Q16 a:
     a popup that only re-confirms the typed text adds a step and catches nothing).
   - **Catalog value with more fields** (the new entry needs more than its name — e.g. a type with a code prefix and a
     counter): the same row opens that catalog's create popup pre-filled with the typed text, and on success selects the
     new entry. The row may say what it creates (`Create "<typed>" as a new type`).
3. **Not allowed for adding a value:** a separate "+ Add" / "New …" button next to the field, a free-text input with a
   suggestion list or `<datalist>`, an "Other — please specify" second field, or sending the user to a settings page and
   back. (A catalog may still have its own management page; the FORM does not send people there to add one value.)
4. **Closed lists stay strict.** Status values, people, records (projects, orders, employees), fixed vocabularies the
   code branches on, and anything another rule relies on never offer the row. The question is the owner's when unsure:
   *may a user invent this value?*
5. **The new value behaves like an existing one** at once: it shows in the trigger, it is offered in the next pick, and
   the save validates it like any other option.
6. **Guard against typos before they are saved (owner 2026-10-28 Q25 a).** When the typed text is CLOSE to an existing
   option — equal after trimming / collapsing spaces / ignoring case, or within 1–2 characters (edit distance) — the
   picker shows that option — at the top when the plain filter matched it too, otherwise right above the new-value
   row, so the top row is always what Enter takes (owner 2026-10-28 Q37 a) — and the new-value row warns in Thai that it looks like it (e.g. `Use "Dlel" as a
   new value — คล้ายกับ "Dell" ที่มีอยู่แล้ว`; a text equal after trim + case-fold is an EXACT match and shows no
   new-value row at all). The row still works; the user decides. One shared component change,
   so every dropdown gets it.
7. **Every catalog that grows this way has a place to fix it (owner 2026-10-28 Q25 a).** A catalog value (rule 2) must be
   renamable and deletable-when-unused by its managers (RD in AE49) from a manage screen or popup; a rename either
   follows automatically (records hold the id) or rewrites the records that carry the old name in the same action. A
   free value needs no tool: correcting the records removes the typo from the list by itself.

## Checking it

Each hub's project audit carries a check for this rule (AE49_Hub: `ae49Hub-task-audit-project` topic `31-dropdowns`; Nuri_Hub: `nurihub-task-audit-project` topic `36-dropdown-add-value`):
list every place a user can add a value to a pick list and how — the inline row (compliant), a separate button, a
free-text field with suggestions, a datalist, an "Other" field, or a settings-page detour — and every open list that
should allow adding but cannot.

## Hub facts

| Hub | Facts skill |
|---|---|
| AE49_Hub | `ae49Hub-ref-dropdown` — `components/ui/SelectField.tsx` props `allowNew` (free value) / `onCreateNew` (catalog value), `createNewLabel`, the site list |
| Nuri_Hub | `nurihub-ref-select-field` — `components/ui/SelectField.tsx` props `allowNew` (free value) / `onCreateNew` (catalog value), the exact / near test in `lib/utils/optionFilter.ts` (`pickerRows`), the site table; audit topic `36-dropdown-add-value` |

---
name: web-ref-gate-closed-format
description: >-
  The one format for a hub project's gate-checklist "No open gate" closed
  payload — the exact JS shape and the closed-line grammar Main writes into
  docs/gate-checklist.js when a feature lands, identical in every project
  (AE49_Hub, Nuri_Hub, future siblings). Use whenever landing a feature and
  resetting the gate-checklist page, writing or reviewing a closed payload,
  or when the user says the No-open-gate line looks different between
  projects. ae49-ref-gate-checklist points here (and its close-gate.cjs writes it); this file changes once
  and every project's page reads the same.
---

# Gate-checklist CLOSED payload — one format

At landing ("all pass, commit it") Main RESETS the project's gitignored
`docs/gate-checklist.js` to the CLOSED payload so the page reads
**No open gate** (user rule 2026-08-04). The shell renders the state; this
skill fixes the payload so it renders identically in every project.

## The payload shape (exact)

```js
window.GATE_CHECKLIST = {
  feature: "<slug>",              // the landed plan's slug, unchanged
  title: "<the closed gate's title>",  // keep the last gate's title
  closed: "<closed line — grammar below>",
  items: []                       // ALWAYS empty in the closed state
};
```

## The closed line — grammar

```
<slug> landed <YYYY-MM-DD> (gate <P>/<N>[ dev + <M>/<M> prod][ (<not passed>)]; commit <sha>[; deployed <scope>])
<not passed> ::= <W> waived | <O> waiting owner | <W> waived, <O> waiting owner
```

Slot rules, in order, `; `-separated inside the parentheses:

1. **`<slug> landed <date>`** — the verb is always **`landed`** (never DONE,
   shipped, closed). Date is the landing date, `YYYY-MM-DD`.
2. **`gate N/N`** — the checklist score. A double gate (dev then production)
   reads `gate 8/8 dev + 7/7 prod` — dev first, prod second, always those
   two labels. **Waived items (owner 2026-09-25):** when the owner WAIVES
   some items instead of testing them, the score counts only the items that
   PASSED and the slot ends with the waived count — `gate 3/7 (4 waived)`,
   passed + waived = total. An item Main verified for the owner (a smoke run
   the owner chose instead of clicking — `ae49-ref-gate-checklist` "Waived
   and Main-verified items") counts as passed; WHICH items were waived or
   Main-verified is written in the plan's landing note, not in this line.
   **Waiting owner (owner 2026-09-25):** an item the owner was asked to
   REPORT (a line count, a measurement) and has not answered when the
   landing goes ahead is neither passed nor waived — it ends the slot as
   `<O> waiting owner`: `gate 32/34 (2 waiting owner)`, or with both kinds
   `gate 30/34 (2 waived, 2 waiting owner)` (waived first, comma-separated);
   passed + waived + waiting = total. The landing note names the items and
   what the owner still owes, and the in-flight memory carries a dated
   follow-up until the answer arrives. Never fold such an item into
   "waived" — the 2026-09-25 bulk-actions landing had to, for want of this slot.
3. **`commit <sha>`** — the landing commit (short sha). Multiple landing
   commits: `commits <a>/<b>/<c>` slash-separated up to 4; five or more:
   `commits <first>…<last> (K)`.
4. **`deployed <scope>`** — ONLY when the landing was actually deployed
   before the reset; name the scope plainly (`deployed web`,
   `deployed web+functions`, `deployed web+rules`). Omit the slot entirely
   when nothing deployed — never write "not deployed".

## Worked examples

- `form-validation-bulk-mechanics landed 2026-08-27 (gate 7/7; commit 53ccc5f)`
- `notification-senders landed 2026-08-27 (gate 8/8 dev + 7/7 prod; commits 719f641/444578f/0659dfe/e993c2e; deployed web+functions)`
- `stock-model-per-warehouse-p3 landed 2026-08-28 (gate 6/6; commit abc1234; deployed web+rules)`
- `tools-data-link-archiver-p2 landed 2026-09-25 (gate 3/7 (4 waived); commit 1a2b3c4)`
- `bulk-actions-2026-09-23 landed 2026-09-25 (gate 32/34 (2 waiting owner); commit 2468650)`

## Don'ts

- Don't leave the previous gate's `items` in place — an already-landed gate
  showing as open is exactly what the closed state exists to prevent.
- Don't invent extra prose in `closed` (reasons, follow-ups, thanks) — the
  line is a record, not a message; anything else belongs in chat or memory.
- Don't reorder or rename the slots; a reader should be able to scan the
  line the same way on every project, every time.
- The file stays **gitignored per-gate scratch** — never commit it.

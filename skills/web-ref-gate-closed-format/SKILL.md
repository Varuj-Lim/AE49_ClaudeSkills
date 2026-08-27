---
name: web-ref-gate-closed-format
description: >-
  The one format for a hub project's gate-checklist "No open gate" closed
  payload — the exact JS shape and the closed-line grammar Main writes into
  docs/gate-checklist.js when a feature lands, identical in every project
  (AE49_Hub, Nuri_Hub, future siblings). Use whenever landing a feature and
  resetting the gate-checklist page, writing or reviewing a closed payload,
  or when the user says the No-open-gate line looks different between
  projects. ae49-router's gate section points here; this file changes once
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
<slug> landed <YYYY-MM-DD> (gate <N>/<N>[ dev + <M>/<M> prod]; commit <sha>[; deployed <scope>])
```

Slot rules, in order, `; `-separated inside the parentheses:

1. **`<slug> landed <date>`** — the verb is always **`landed`** (never DONE,
   shipped, closed). Date is the landing date, `YYYY-MM-DD`.
2. **`gate N/N`** — the checklist score. A double gate (dev then production)
   reads `gate 8/8 dev + 7/7 prod` — dev first, prod second, always those
   two labels.
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

## Don'ts

- Don't leave the previous gate's `items` in place — an already-landed gate
  showing as open is exactly what the closed state exists to prevent.
- Don't invent extra prose in `closed` (reasons, follow-ups, thanks) — the
  line is a record, not a message; anything else belongs in chat or memory.
- Don't reorder or rename the slots; a reader should be able to scan the
  line the same way on every project, every time.
- The file stays **gitignored per-gate scratch** — never commit it.

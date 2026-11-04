---
name: web-ref-hub-parity
description: The central hub-parity ledger - AE49_Hub is the reference hub; divergences.md lists what every hub keeps different on purpose (one column per hub), pages.md the shared pages kept equal (Home, Notifications, Employees, Support, Settings, sign-in pages, the shell), changelog.md what AE49 changed on them. Use when AE49_Hub lands a change to one of those pages (log it), when a hub's parity run reads or records a ruling, or on ทำไม Hub นี้ต่างจาก AE49, จงใจให้ต่าง, บันทึกการเปลี่ยนแปลง AE49.
---

# web-ref-hub-parity — the ledger that keeps the hubs' shared pages equal

**Owner ruling 2026-11-04** (AWDC_Hub session, Q1–Q8): AE49_Hub is the REFERENCE hub. The pages every hub shares
stay equal to AE49 and to the user skills; what a hub keeps different on purpose is written down once, here, so no
parity run asks it again. The procedure that reads and writes this ledger is `web-task-hub-parity`.

## The three files

| File | Holds | Who writes it, when |
|---|---|---|
| [divergences.md](divergences.md) | Every deliberate difference: one row per topic, one column per hub, a short Thai note; and each hub's parity baseline (the AE49 commit its last run ruled up to) | `web-task-hub-parity` at the close of every run, in any hub's session |
| [pages.md](pages.md) | The pages in scope and the AE49 paths behind them (the safety-net filter); the SETTLED behaviours every hub follows (owner rulings, e.g. the login-email change) | Any session, when the owner adds or drops a page |
| [changelog.md](changelog.md) | One row per AE49 landing that touched a path in `pages.md` | AE49_Hub's session at landing (`web-ref-deploy-landing` §5a) |

## Rules

1. **English table, Thai note.** Every table here is English; the last column (`หมายเหตุ`) is one short Thai sentence the
   owner can read when a cell is unclear (owner 2026-11-04).
2. **A divergence row needs an owner ruling or a hub fact already on record** — cite it (`AWDC 2026-11-04 Q3`, or the
   hub's `CLAUDE.md` / `<hub>-ref-*` skill). `?` in a cell means "not recorded yet": that hub's next parity run fills it.
3. **Public repo — no infra values.** This skill is mirrored to the public skills repo: never write a project id, email,
   account, port, URL or secret here. "Own Firebase project" is enough; the value lives in the hub's `CLAUDE.md`.
4. **The changelog is written in the same turn as the AE49 landing**, then mirrored and pushed with the skills repo
   (user `CLAUDE.md` "Skills repo sync"). A forgotten row is caught by the safety net in `web-task-hub-parity` step 2,
   and that run adds the missing row.
5. **A hub's baseline moves only when every item up to that AE49 commit is RULED** (built or not — the build is the
   hub's plan, tracked on its own board).
6. **Adding a hub:** add a column to `divergences.md` (every cell `?`) and a baseline cell `—`; nothing else changes.

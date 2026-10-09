**Scope (part of ae49-ref-gate-checklist, split out 2026-10-09):** the three recorded outcomes when an item is not clicked through (waived, Main-verified, waiting owner), the `[ENV] (Main)` item form and the backtick rule. Moved whole from the `SKILL.md` section "Waived and Main-verified items (owner 2026-09-25)". Cited by `ae49-router` as "Waived and Main-verified items".

## Waived and Main-verified items (owner 2026-09-25)

The owner may decide not to click through a section — a feature they will rarely use, a
production-only gate that costs real time, an item the audit and the automated tests already
cover. Three outcomes exist, and all three are RECORDED, never silently counted as passed:

- **Waived** — the owner says an item (or the rest of a section) is not tested ("ไว้ใช้จริงค่อยดู",
  "ข้ามได้"). The closed line then reads `gate 3/7 (4 waived)` (`closed-format.md`;
  `close-gate.cjs --score 3/7 --waived 4`), and the plan's landing note lists WHICH items were
  waived and why, so the next reader knows what production has never proved.
- **Main-verified** — the owner asks Main to run the check instead ("(ก) Main รันเอง"): Main
  creates TAGGED test data, drives the real system the way the button would (the same API route
  or the same service call, never a shortcut that skips the code under test), verifies the result
  with a read-only script, and reports the evidence. Such an item counts as PASSED; the landing
  note says Main verified it and how. Main never verifies an item that needs the owner's eyes
  (a rendering, a wording, a click path) — those are waived or tested, not "verified".
- **Waiting owner** (owner 2026-09-25) — the owner passes the section but leaves an item they
  were asked to REPORT (a line count at 1366, a measurement, a screenshot) unanswered, and the
  landing goes ahead. The item is neither passed nor waived: the closed line reads
  `gate 32/34 (2 waiting owner)` (`close-gate.cjs --score 32/34 --waiting 2`; both kinds:
  `--waived 2 --waiting 2` → `(2 waived, 2 waiting owner)`), the landing note names the items
  and what is still owed, and the in-flight memory carries a dated follow-up until the owner
  answers. The count is never folded into "waived" — the bulk-actions landing of 2026-09-25
  (items 4.4 / 5.3, the toolbar line counts) had no slot for it and was written as waived.

Before either, Main says once, in plain words, what will NOT have been seen by anyone if the
items are waived — then does what the owner decides.

**Items Main performs itself** — reading a manifest, a bucket, a log, an execution — have no
screen to click to. They open `[ENV] (Main)` without the `{Nav -> Page}` tag; `validate-gate.cjs`
accepts that form. Keep them to one or two per section; the gate is the owner's smoke test.

**Backticks are allowed** since 2026-09-25: the page renders `` `code` `` spans as code (URLs,
file paths, codes, folder names), so a plan's Testing checklist can be copied onto the board as
written. Other markdown (`**bold**`, links) still shows literally; an unpaired backtick shows
every backtick literally — the validator warns on both.

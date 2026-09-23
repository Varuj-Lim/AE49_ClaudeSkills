---
name: web-ref-bulk-actions
description: The ONE bulk-action canon for every hub project (AE49_Hub, Nuri_Hub, future siblings) — what the verbs inside a list page's selection cluster show and do. Every verb the viewer's ROLE can use is VISIBLE whenever the cluster shows (never hidden because of what happens to be ticked); each shows its own eligible count `Verb (N)`; pressing it acts ONLY on those N rows and skips the rest; its confirm says how many will be acted on, how many are skipped, and why in one plain sentence; at N = 0 it stays visible but dimmed with the reason on hover; a verb the viewer's role never permits is absent. Use whenever adding, changing or reviewing ANY bulk verb, bulk toolbar, selection cluster, select-all action or bulk confirm in a hub project — trigger even when the user only says "approve all the ticked ones", "bulk approve", "the Approve button disappeared when I ticked", "why can't I approve these", "apply to selected", or "ทำทีละหลายรายการ". Each project keeps its component paths, pages and grandfathered exceptions in its own facts skill; the rule changes HERE once.
---

# Bulk actions — shared canon

## Why (owner ruling 2026-09-23, AE49_Hub)

*"ทุกปุ่มต้องแสดงหมดเพียงแต่ว่า มันจะทำงานเฉพาะ Order ที่สามารถทำได้ อันไหนทำไม่ได้ก็ข้ามไป
ให้เป็นแบบนี้ทุกหน้าที่ทำได้"*

Before this ruling a decision verb (Approve / Reject) appeared only when EVERY ticked row was
decidable, for fear that "Approve 3" beside a "Delete selected" meaning all 7 would get somebody's
record deleted. The result: select-all on a mixed list made Approve vanish, and the user had to
untick every decided row by hand. The ruling keeps the protection and drops the hiding — the COUNT
on each verb and the SKIP line in each confirm tell the user exactly what will happen.

## The rules

**B1 · Every verb the viewer's ROLE can use is visible whenever the cluster shows.** A verb is
never hidden, and never made invisible, because of WHAT is ticked — a status, a mix, a count of
zero. The cluster's own visibility is not this rule's business (see "How it composes").

**B2 · Each verb counts its own eligible rows — `Verb (N)`.** N = the ticked rows THIS verb can act
on for THIS viewer, asked with the same per-row gate the row's own button asks. One exception: a
verb whose eligibility IS the predicate that renders the row's checkbox (every tickable row
qualifies — the usual `Delete selected`) may keep a `Verb selected` label: its N is the
`N selected` beside it, by construction.

**B3 · Pressing it acts on those N only; the rest are skipped.** ONE derived list per verb drives
its label, its confirm's number, its progress total and its loop, so the number shown is always the
number attempted. The list is taken over EVERY ticked row the page has loaded — including one a
later filter hides, because it is still ticked and still counted in `N selected`. Never write,
widen or narrow a gate for the bulk path; never let a skipped row fail loudly inside the loop.

**B4 · The confirm says acted-on, skipped, and why.** Its body states how many will be acted on and,
when any are skipped, how many and WHY in one plain sentence in the project's explainer language;
its confirm button repeats the verb and the acted-on count (`Approve 5`). The outcome message may
repeat the skip count.

**B5 · At N = 0 the verb stays, dimmed, and says why.** Visible, dimmed, inert, with the reason in a
hover tooltip. Use `aria-disabled` + the project's dimmed classes and simply attach no handler —
NOT the native `disabled` attribute, which swallows hover in some browsers and hides the very
tooltip that explains the state. Never a button that looks live and does nothing; never a gap
where a verb used to be.

**B6 · A verb the viewer's ROLE never permits is ABSENT.** RD's Delete is simply not there for a
Team Leader. The line is the one `web-ref-action-menu` draws: hide by WHO YOU ARE, dim by THE STATE
OF THE DATA. A role-bound condition may name only session-constant facts (department, permission
flags, "decides this module at all"); a condition that reads the selection, a count or a status is
the bug this canon removes.

## How it composes

- **`web-ref-table-columns` T5 — unchanged.** The CLUSTER is still always laid out at the right end
  of the toolbar row, still `invisible` + `inert` while nothing is ticked, and still ONE width in
  every state. This canon governs the VERBS inside it: a dimmed verb keeps its box, and every
  counted label reserves its widest `(999)` form with a measured minimum width, so ticking,
  unticking or changing the mix never resizes the cluster. Role-absence is constant for the whole
  session, so it moves nothing either.
- **`web-ref-action-menu` — the same WHO / STATE line**, and bulk-toolbar pills stay exempt from its
  list↔view parity rule (they aggregate a per-record verb that must still exist on both surfaces).
- **`web-ref-ui-language`** — the tooltip and the confirm body are explanations (Thai in AE49 /
  Nuri); the verb labels, counts and dialog titles are identifiers (English).
- **`web-ref-popup`** — the confirm is an ordinary confirm popup; its title and button repeat the
  pill's verb.
- A decision pill keeps its decision COLOUR (green Approve, red Reject) — the project's
  decision-actions facts.

## Don't

- Don't hide a verb because the selection is mixed, or make it invisible at N = 0.
- Don't label a subset verb `Verb selected` — if it can skip, it counts.
- Don't let two numbers for one verb come from two lists (a label counted from one array and a loop
  run over another is how "Cancel 3" cancels 4).
- Don't disable with the native `disabled` attribute where the reason must show on hover.
- Don't list a verb the viewer's role never permits "for consistency".

## Each project supplies its FACTS in its own skill

| Project | Facts skill | What it records |
|---|---|---|
| AE49_Hub | `ae49Hub-ref-table-actions` §"Verbs on one selection" (+ `ae49Hub-ref-list-page` §Table columns for widths) | `components/ui/BulkCluster.tsx` (`bulkVerb`, `BulkSkipNote`), the pages carrying counted verbs, Leave's grandfathered bulk Reject, Asset Checkout's same-item refusal, the measured `min-w` table |
| NuriHub | `nurihub-ref-bulk-selection` (named 2026-09-23 when the handoff landed) | `components/ui/BulkSelectionCluster.tsx` (`bulkVerb`, `BulkSkipNote`); counted verbs on Sales Orders, Purchase Orders and Support Tickets; `withoutHover` splits on `/s+/`, not AE49's `/s+/` |
| future siblings | create with the first bulk verb | copy the shape |

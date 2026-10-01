---
name: web-ref-list-pagination
description: The ONE list-loading canon for every hub project (AE49_Hub, Nuri_Hub, future siblings) — a list page whose collection can grow without bound NEVER loads the whole collection on open; it reads the newest 50 rows plus a count, shows "page n / N · total" with ◀ ▶ buttons, and loads the (year-scoped) full set ONLY when the user searches, filters or sorts by another column, then pages that result client-side 50 at a time; bounded reference lists (employees, projects, device catalogs) stay unpaged; a non-default "show all" exists; Export still takes the whole scope. Use whenever building, editing, reviewing or auditing ANY list / table / directory page, any `getXxx()` service getter that reads a collection, a search box, a filter, a column sort, a row-count caption or an Excel export on a list — trigger even when the user only says "หน้านี้โหลดนาน", "ข้อมูลเยอะ", "แบ่งหน้า", "pagination", "load more", "cap 50 rows", "page buttons", or asks why a page reads thousands of documents. Owner ruling 2026-10-01 (AE49): "Cap การ Load Data ของทุกหน้าอยู่ที่ 50 แถว แล้วมีปุ่มให้เลือกหน้าถัด ๆ ไป". Per-project facts (which pages, the shared hook/component names, the year scope) live in each hub's own <hub>-ref-list-page facts skill; the rule changes HERE once.
---

# List pagination — shared canon (cap 50, hybrid paging)

**Owner ruling 2026-10-01 (AE49_Hub, OI-18):** *"อยากให้มี Cap สำหรับการ Load Data ของทุกหน้า อยู่ที่ 50 แถวพอ
แล้วมีปุ่มให้เลือกหน้าถัด ๆ ไป เพราะข้อมูลจะเยอะมาก เช่นหน้า /draftsman/orders ข้อมูลเยอะ เปิดโหลดนานโดยที่ข้อมูลบางอันไม่ได้ใช้
เขียนกติกานี้ลงไปใน Skill ด้วยนะ"* — and, grilled the same morning (Q1–Q5, all as recommended): the HYBRID
model below, prev/next paging, unbounded lists only, a non-default "show all", `/draftsman/orders` first.

Written because on 2026-10-01 every one of AE49's ~20 list pages read its WHOLE collection on open
(`/draftsman/orders` ≈ 1,450 docs per visit, cached 10 min) and none paged; the only `limit(` in the
app was in a worker's job list. The cost is twofold — Firestore reads on every open, and a table of
1,450 rows drawn for a user who wanted the latest ten.

## The rule in one line

**A list whose collection can grow without bound loads 50 rows and a count on open, pages with ◀ ▶,
and loads the full (year-scoped) set only when the user asks a question the 50 cannot answer.**

## 1. Which lists — the UNBOUNDED test

| Paginate (collection grows without bound) | Leave unpaged (bounded reference list) |
|---|---|
| orders / reservations · tickets (support, IT) · leave requests · overtime claims · plot orders · approvals queues · activity / audit logs · notifications · proposals · price requests · asset-checkout requests · patch notes | employees (~150) · projects (hundreds, all needed in pickers) · device catalogs (< 100 each) · holidays · settings lists · option catalogs |

The test is the DATA, not today's count: "does one more month of business add rows forever?" — yes →
paginate; a list people must see WHOLE to work (a directory they scan, a picker's source) → unpaged.
A page that is already scoped to a period (a month calendar, `?year=`) still paginates inside that
scope when the scope can exceed 50 rows. Record each hub's classification in its facts skill.

## 2. The hybrid model (owner Q1 = ค)

Two loading modes, one page, decided by the user's intent:

1. **Default view (no search, no filter, default sort)** — ONE query: the collection's default order
   (newest first) `limit(50)`, plus a COUNT aggregation for the total (one cheap read). Next page =
   `startAfter(lastDoc)` + `limit(50)`; previous page = the cursor stack of pages already visited.
   The caption reads `page n / N · total` (N = ceil(total / 50)) and ◀ ▶ step through it. Page
   numbers are shown only for pages already visited (a cursor can go back to them at no cost);
   jumping to an unvisited page N is NOT offered — Firestore has no cheap offset, and `offset` bills
   every skipped document.
2. **Question view (a search term, any filter, a non-default column sort)** — the page loads the
   FULL set of its scope once (the year, or the collection when it has no year scope), through the
   same cached getter it used before pagination existed, runs today's client-side `matchesQuery` /
   filter / sort over it, and pages the RESULT client-side 50 at a time with the same ◀ ▶ caption
   (`page n / N · k matches of total`). Clearing the question returns to the default view.

Why hybrid, not server-side search: Firestore cannot search "contains" and composite filters need an
index per combination — moving search server-side would make search WORSE than today's seven-field
substring match. Why not client-side-only paging: it saves rendering, not reads. The hybrid keeps
search exactly as it is and makes the common case (open, glance at the latest) cost 50 reads + 1
count. **The two modes share one table, one caption, one set of buttons** — the user never learns
there are two.

## 3. Controls and copy

- **◀ ▶ buttons** sit in the toolbar row beside the row-count caption, never in a footer the user
  must scroll to; disabled at the ends; keyboard-reachable; `aria-label`s "หน้าก่อนหน้า" / "หน้าถัดไป"
  are Thai explainers, the visible glyphs carry no text.
- **The caption** extends the hub's row-count caption (`{filtered} of {total}`): default view
  `1–50 จาก 1,811 · หน้า 1 / 37`; question view `แสดง 1–50 จาก 123 ที่ตรง (ทั้งหมด 1,811)`. Thai sentence,
  English identifiers, per `web-ref-ui-language`.
- **"Show all" (owner Q4)** — a secondary control (a text link in the toolbar reading `Show all` /
  `Show 50 per page` — ENGLISH, like every control, per `web-ref-ui-language`; the Thai explainer
  rides in its `title`), never the default; it loads the full scope and shows it unpaged, as today;
  the choice is per visit (URL state `?all=1`), not remembered. A page over ~500 rows may warn in the caption that the table is long.
- **Page state lives in the URL** (`?page=3` for the default view; the question view's page resets to
  1 whenever the question changes) so a refresh or a shared link lands on the same page — the hub's
  URL-state helper, not component state.
- **Export** keeps exporting the WHOLE scope (the year, or the filtered result when a question is
  active), never the visible page — the caption near the button says which.
- **Row-level actions and bulk selection** act on the visible page only; a "select all" means the
  page, and says so (`เลือกทั้ง 50 แถวในหน้านี้`).

## 4. Data and cache rules

- The default view's `limit(50)` query is NOT cached (it is already cheap); the full-set getter keeps
  its cache (10 min in AE49) and is only called by the question view and "show all".
- Writes that bust the full-set cache must also refresh the default view (the page re-runs its
  first-page query after its own create/edit/delete) — a new row must appear on page 1 immediately.
- The count comes from the SDK's count aggregation (`getCountFromServer` / `count()`), scoped like the
  query (the year, the collection) — one read, no documents transferred.
- Sorting in the default view is the query's `orderBy` (newest first). Another column's sort is a
  QUESTION (mode 2) — the page never sorts 50 rows and pretends that is the collection's order.
- Year scope stays what it is: a page with `?year=` pages INSIDE the year; the year picker stays —
  but NOT as a date RANGE when the default order is another field: Firestore makes the range
  field the first sort, so a list ordered by its own sequence number scopes the year through an
  EQUALITY field (`year`, stored at create, backfilled once) + one composite index
  (`year ASC, <seq> DESC, <tie-break> DESC` — the tie-break is whatever orders rows that SHARE
  the sequence number, e.g. a part index; without it the cursor falls back to the document id and
  a page boundary can split siblings). AE49 learned this on 2026-10-01 when a production read showed
  `createdAt` and `orderSeq` disagree on migrated rows, and the tie-break the same day (audit D11:
  parts of one order share `orderSeq` AND `createdAt`).
- Other readers of the same getter (schedule grids, aggregates, home cards, cron routes) are NOT
  changed by a page's pagination — they keep their full reads; the list page gets a NEW limited
  query, it never narrows the shared getter.

## 5. Shared pieces, not per-page code

One hook and one component per hub, used by every paginated page: a `usePagedList`-style hook that
owns the mode, the cursor stack, the page number, the count and the URL state, and takes (a) the
first-page query factory, (b) the full-set loader, (c) the client-side question predicate; and a
`PageNav`-style component that renders the caption + ◀ ▶ + "show all". A page that hand-rolls its
own cursor logic is a finding. Names and paths are each hub's facts.

## 6. Audit — what the project audit checks

- A list page of an UNBOUNDED collection (per §1) whose service getter reads the collection with
  no `limit(` on open — finding.
- A page that pages client-side ONLY (loads all, slices 50) — finding (reads unchanged).
- Search / filters / sort that look at the loaded 50 only (the question view missing) — finding.
- A page-number control that jumps to unvisited pages via `offset` — finding.
- Export of the visible page only — finding.
- A getter narrowed with `limit(` that another surface (grid, aggregate, cron) also reads — finding.

## Don't

- Don't paginate a bounded reference list (employees, projects, catalogs) — 50 rows cut a list people
  need whole.
- Don't move search server-side to "fix" paging — it makes search worse; use the question view.
- Don't cache the 50-row page; don't bust the full-set cache from the page query.
- Don't add a second table or a second caption for the question view — one table, two modes.
- Don't ship a page-number row that pretends every page is reachable.

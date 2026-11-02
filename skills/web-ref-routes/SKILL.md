---
name: web-ref-routes
description: "Canon (web-ref-*) route shape: record page /<list>/[id]/view, edit /<list>/[id]/edit, create /<list>/add; bare /<list>/[id] has NO page, never a redirect; a Thai not-found page; a renamed route moves every link, stored ones by a ruled migration. Use for any route, URL, path or link; ลิงก์เสีย, หน้า detail, ลิงก์ใน bell, เปิดเป็นหน้า, 404."
---

# web-ref-routes — the record-page route shape

## The rule

| Page | Route | Notes |
|---|---|---|
| The list | `/<section>/…/<list>` | The URL mirrors the nav path (hub facts skill). |
| Create | `/<list>/add` | Nested under its list. |
| Read ONE record | `/<list>/[id]/view` | ALWAYS `/view` — also when the page holds actions, a thread or an edit form inline. |
| Edit ONE record | `/<list>/[id]/edit` | Only when editing is a page of its own. |
| A screen of ONE record that is neither its read nor its edit page | `/<list>/[id]/<name>` | e.g. `/projects/[id]/part-schedule` (owner Q311 a). Kebab-case name, linked from the record's `/view`. |
| Bare id | `/<list>/[id]` | **No `page.tsx`.** It opens the not-found page. |

- **Nothing redirects** (the hubs' no-redirect ruling): no `next.config` redirect or rewrite, no
  middleware hop, no `page.tsx` that only calls `redirect()`. The sole exception each hub keeps is its
  app root `/` → `/login`.
- **Every hub has a Thai not-found page** (`app/not-found.tsx`): one Thai sentence that the link no longer works and a link home. An old link lands there, never on the framework's English 404, and never on a redirect.
- **`[id]` is the record's id** (the Firestore document id, or the hub's stable code when the hub's
  facts say so). A dynamic segment that is NOT a record — a year, a tab slug, a set name — is not a
  record page and this rule does not apply to it.
- **Words:** `view`, `edit`, `add` — never `detail`, `show`, `details`, `new`, `create`.
- **`/view` is required only when a read page exists** (owner Q310 a, 2026-10-28). A record that opens straight into its
  edit page from the list (no read-only page) keeps `/<list>/[id]/edit` alone — no read page is added just to satisfy the rule.
- **A popup is not a route.** A record shown only in a popup from its list needs no route. Once it
  becomes a page of its own (a thread, a share link, a bell that opens it), it takes `/[id]/view`.

## Every link moves with the route — in the same change

1. **Code links** — `href`, `router.push`, template strings, breadcrumbs, `?return=` values, Home cards,
   e-mail / LINE builders. Grep for the old path and change every one; the build gate does not catch
   a stale string.
2. **Stored links** — a `link` field already written to Firestore (bells / notifications, LINE message
   logs, tickets, mail docs). Because nothing redirects, an old stored link opens the not-found page.
   Move them with a ruled migration script per `web-ref-migration-backups` (emulator rehearsal → dry run
   → backup → the OWNER's `--apply` → verify 0), run right after the push that ships the new route.
3. **Bells written from now on** point at `/view` directly.
4. **Sent links** — a plan that renames a route states whether links to it were sent outside the app (mail, LINE, copied). No migration reaches those, so they will open the not-found page, and the plan says so.

## Checking it

- Each hub's project audit carries a check for this rule (AE49_Hub: `ae49Hub-task-audit-project`
  topic `08-nav-placement`): list every `app/**/[*]/page.tsx` that is a record page without `/view`,
  every read page named other than `view`, and every link builder pointing at them.
- A cross-hub change to this rule goes to the sibling hubs as a handoff prompt (`web-task-handoff-prompt`),
  never as a cross-repo edit.

## Hub facts

| Hub | Facts skill |
|---|---|
| AE49_Hub | `ae49Hub-ref-nav-placement` (nav levels, segment names, migration history) |
| Nuri_Hub | `nurihub-ref-routing` (URL map, record-page table) + `nurihub-ref-nav-placement` (pointer bullet); audit topic `02-routing`; moved by plan `routes-view` 2026-10-28 — read pages `/view`, edit-only forms `/edit`, the public tracking page `/track/[token]/view`; stored bell links migrated by `scripts/dev/migrate-record-links-view.cjs` |

# Web Ticket Page — Reference

Deep detail behind [SKILL.md](SKILL.md): a paste-ready skeleton, the per-modal shapes,
the two-app comparison, and a file index. Swap `brand-primary` / `brand-primary-dark` /
`brand-tint` for your own tokens (AE49 uses `ae49-slate` / `-dark` / `ae49-cloud`; Nuri
uses `nuri-terra` / `-dark` / `-light`).

## 1. Page skeleton

One client component. List + filters + table live here; the three modals are stubs you
either inline (AE49 style) or extract to `components/…/Ticket*Modal.tsx` (Nuri style).

```tsx
"use client";
// page.tsx — support tickets

const STATUS_TONE = {
  open: "bg-gray-100 text-gray-500",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
} as const;
const TYPE_TONE = {
  bug: "bg-rose-100 text-rose-700",
  suggestion: "bg-indigo-100 text-indigo-700",
} as const;
const STATUS_LABEL = { open: "Open", in_progress: "In Progress", resolved: "Resolved" } as const;
const TYPE_LABEL = { bug: "Bug", suggestion: "Suggestion" } as const;
const PILL = "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium";
const DEFAULT_STATUS: TicketStatus[] = ["open", "in_progress"]; // shown on load; Resolved hidden

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<TicketStatus>>(() => new Set(DEFAULT_STATUS));
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [filterType, setFilterType] = useState<TicketType | "">("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);
  const [detail, setDetail] = useState<Ticket | null>(null);
  const [toDelete, setToDelete] = useState<Ticket | null>(null);

  const canManage = /* privilege gate: department check OR role === "developer" */ false;

  useEffect(() => { getTickets().then(setTickets).finally(() => setLoading(false)); }, []);

  const toggleStatus = (s: TicketStatus) => setStatusFilter((prev) => {
    const next = new Set(prev); next.has(s) ? next.delete(s) : next.add(s); return next;
  });
  const statusIsDefault =
    statusFilter.size === DEFAULT_STATUS.length && DEFAULT_STATUS.every((s) => statusFilter.has(s));
  const clearFilters = () => { setStatusFilter(new Set(DEFAULT_STATUS)); setFilterType(""); };

  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    const hitsSearch = !q || [t.title, t.description, t.submittedByName]
      .some((f) => f?.toLowerCase().includes(q));
    const hitsStatus = statusFilter.size === 0 || statusFilter.has(t.status);
    return hitsSearch && hitsStatus && (!filterType || t.type === filterType);
  });
  // "Clear" is offered only when the status set differs from the default (or a type is picked).
  const activeFilters = (statusIsDefault ? 0 : 1) + (filterType ? 1 : 0);

  return (
    <div className="flex flex-col h-full min-h-0 space-y-6">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tickets</h1>
          <p className="text-sm text-gray-500">Report a bug or suggest an improvement</p>
        </div>
        <button onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold
                     text-white bg-brand-primary hover:bg-brand-primary-dark transition">
          + New ticket
        </button>
      </header>

      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch}
          placeholder="Search by title, description, submitter…" />

        {/* Status = multi-select checkbox menu (add an outside-click listener to close it) */}
        <div className="relative">
          <button type="button" onClick={() => setStatusMenuOpen((o) => !o)}
            className="rounded-lg border px-3 py-2 text-sm">
            {statusFilter.size === 0 ? "Status: All" : `Status (${statusFilter.size})`} ▾
          </button>
          {statusMenuOpen && (
            <div className="absolute z-20 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
              {(["open", "in_progress", "resolved"] as TicketStatus[]).map((s) => (
                <label key={s} className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50">
                  <input type="checkbox" checked={statusFilter.has(s)} onChange={() => toggleStatus(s)} />
                  {STATUS_LABEL[s]}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Type = single dropdown */}
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as TicketType | "")}
          className="rounded-lg border px-3 py-2 text-sm">
          <option value="">All types</option>
          <option value="bug">Bug</option>
          <option value="suggestion">Suggestion</option>
        </select>

        {activeFilters > 0 && (
          <button onClick={clearFilters}>Clear ({activeFilters})</button>
        )}
        <span className="ml-auto text-sm text-gray-500">{filtered.length} of {tickets.length} tickets</span>
      </div>

      {/* BULK BAR — privileged, only when rows selected */}
      {canManage && selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-brand-tint px-3 py-2">
          <span className="text-sm">{selected.size} selected</span>
          <button className="rounded-full bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
            Delete selected
          </button>
          <button onClick={() => setSelected(new Set())} className="text-sm">Clear</button>
        </div>
      )}

      {/* TABLE */}
      {loading ? <LoadingSpinner className="py-20" /> : (
        <TableCard fill>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20 bg-gray-50 border-b text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                {canManage && <th className="w-10 px-4 py-3">{/* select-all checkbox (indeterminate) */}</th>}
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Submitter</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={canManage ? 7 : 6} className="py-12 text-center text-gray-400">
                  No tickets match your search or filters.
                </td></tr>
              ) : filtered.map((t) => (
                <tr key={t.id} onClick={() => setDetail(t)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors">
                  {canManage && (
                    <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      {/* row checkbox → toggle selected */}
                    </td>
                  )}
                  <td className="px-4 py-3 font-medium">{t.title}</td>
                  <td className="px-4 py-3"><span className={`${PILL} ${TYPE_TONE[t.type]}`}>{TYPE_LABEL[t.type]}</span></td>
                  <td className="px-4 py-3 text-gray-600">{t.submittedByNickname ?? t.submittedByName}</td>
                  <td className="px-4 py-3"><span className={`${PILL} ${STATUS_TONE[t.status]}`}>{STATUS_LABEL[t.status]}</span></td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatDate(t.createdAt)}</td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {canManage && (
                      <button onClick={() => setToDelete(t)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">🗑</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}

      {/* MODALS — all on this one page, no extra routes */}
      {creating && <CreateTicketModal onClose={() => setCreating(false)} />}
      {detail && <TicketDetailModal ticket={detail} canManage={canManage} onClose={() => setDetail(null)} />}
      {toDelete && <ConfirmModal title="Delete ticket"
        message={`Delete "${toDelete.title}"? This cannot be undone.`} onConfirm={/* deleteTicket */} />}
    </div>
  );
}
```

## 2. Create modal

Fields: **Type** select (Bug / Suggestion) · **Title** (required) · **Description** textarea
(required, `min-h-[140px]`) · **Attachment** (optional image). Extras:

- **Paste-to-attach**: a `document` paste listener while the modal is open grabs an image
  from the clipboard (Ctrl+V), shows an object-URL preview + a Remove button.
- On submit: upload the attachment (if any) → create with `status: "open"` → write an
  activity log → toast + close.

## 3. Detail / edit modal

- **Read-only (non-privileged):** title, Type + Status pills, "Filed by … · date", the
  description (`whitespace-pre-wrap`), the attachment image, and the reply block if present.
- **Editable (privileged):** Title + Description inputs, then a Type select, a Status select,
  and an **optional Response** textarea (the reply back to the submitter); plus Delete + Save.
  Save diffs each field, stamps `resolvedAt` when status → resolved, stamps the reply fields
  (`respondedBy`/`respondedByName`/`respondedAt`) when a response is written, logs the changes,
  toasts, closes.

## 4. <hubname> vs <hubname2>

Same origin, since diverged. Same badge colors, same modal shells, same paste-to-attach,
same bulk-delete loop. The skill's canonical page (SKILL.md → *Canonical choices*) blends
both — <hubname2>'s filters + count, <hubname>'s Response reply. This table is the full
divergence, for reference:

| Aspect | <hubname> | <hubname2> |
|---|---|---|
| Shared UI | composes `PageHeader` / `SearchInput` / `FilterSelect` / `ClearFiltersButton` / `TableCard` + `tableStyles` / `formStyles` | all inline; shares only `LoadingSpinner` / `ConfirmModal` / `ProgressBar` |
| Modals | inlined in `page.tsx` | extracted to `components/support/TicketModal.tsx` + `TicketDetailModal.tsx` |
| Privilege gate | `isRdDepartment(userProfile?.department)` | `userProfile?.role === "developer"` |
| Status filter | single-value `FilterSelect`, default `open` | ★ multi-select checkbox dropdown, default `open` + `in_progress` |
| Toolbar count | none | ★ "{shown} of {total} tickets" |
| Reply | ★ `response*` fields + optional Response textarea | no reply |
| Row marker | unread red-dot (`useUnreadTargets`) + `markRead` on open | paperclip on rows with an attachment |
| Brand primary | `ae49-slate` (`#526D82`) | `nuri-terra` (`#CF5E40`) |
| Bulk-select | shared `useMultiSelect` hook | local `useState<Set<string>>` |
| Label casing | ★ "In Progress" | "In progress" |
| Table layout | `<TableCard fill>` full-height, sticky header, internal scroll | `bg-white rounded-xl border` card, horizontal scroll |

★ = the side this skill adopts as canonical (SKILL.md → *Canonical choices*).

Two choices the skill leaves open — decide per project: **compose vs inline** (lean on a
shared UI kit if the project has one, else hand-roll the header/search/filter/table), and
the **row marker** (unread dot, attachment paperclip, or neither).

## 5. File index

**<hubname>** (`C:\Users\<you>\Documents\<hubname>`)
- `app/(app)/support/tickets/page.tsx` — list + create/detail/delete modals (all inline)
- `types/ticket.ts` — `Ticket`, `TicketType`, `TicketStatus`
- `lib/services/ticketService.ts` — Firestore/Storage CRUD (`tickets` collection)
- shared UI: `components/ui/{PageHeader,SearchInput,FilterSelect,ClearFiltersButton,TableCard,ConfirmModal,ProgressBar,RequiredMark,LoadingSpinner}.tsx`
- constants: `lib/constants/{tableStyles,formStyles,textStyles}.ts`; brand tokens in `app/globals.css` `@theme`
- hooks: `lib/hooks/{useMultiSelect,useUnreadTargets}.ts`

**<hubname2>** (`<owner>/<repo2>`, private — read via `gh`)
- `app/(app)/support/tickets/page.tsx` — list page
- `components/support/TicketModal.tsx` — create · `components/support/TicketDetailModal.tsx` — view/edit
- `types/ticket.ts` · `lib/services/ticketService.ts`
- shared UI: `components/ui/{LoadingSpinner,ConfirmModal,ProgressBar}.tsx`
- brand tokens in `app/globals.css` `@theme` (`nuri-terra` `#CF5E40`)

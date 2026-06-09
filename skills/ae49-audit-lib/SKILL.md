---
name: ae49-audit-lib
description: Audit the AE49_Hub codebase for logic written inline inside pages/components that is duplicated or reusable enough to belong in shared lib code (a helper, a hook, or a shared component). Re-scans the current code each run and reports a prioritized list with file locations and a proposed shared home, changing NOTHING until the user approves. Use when the user wants to find duplicate / copy-pasted code, DRY up the app, check for reuse opportunities, or asks "what could move into lib".
---

# Audit Lib (shared-code / reuse audit)

Perform a **non-destructive review** of the AE49_Hub source and report logic that is
currently written inline inside pages/components but is **duplicated** or **reusable**
enough to belong in the shared layer — a `lib` helper, a hook, or a shared component.

**Hard rule: make NO code changes until the user explicitly approves a specific
suggestion.** This skill reads and recommends only. Producing the list is the job;
extracting the code is a separate, approved step the user comes back for.

**Re-scan every run.** Always read the current code fresh — do NOT rely on a saved
list or on memory. Other Claude sessions edit this same folder in parallel, so the
findings must reflect the code as it is right now.

## Step 1 — Map the source

Glob `**/*.{ts,tsx}` under these folders and **read the whole files** (this is a
cross-file duplication check — reading only excerpts will miss matches):

- `app/**` — pages, layouts, API routes
- `components/**`
- `context/**`, `hooks/**`
- `lib/**`, `types/**` — needed to know what is ALREADY shared

## Step 2 — Inventory what's already shared (reuse first)

Before flagging anything, list what already exists in `lib/`, `components/ui/`,
`context/`, `hooks/`, and `types/`. The audit has two goals: (a) find inline code
that should JOIN this shared layer, and (b) catch places that re-implement something
that already lives here. Never propose a helper/component that already exists — point
to the existing one instead.

## Step 3 — Scan for candidates

Look for these patterns (examples to guide the search, not an exhaustive list):

- **Duplicated state + UI** — the same `useState` + handler + JSX copied in 2+ files
  (e.g. a toast/notification, a modal). → a hook + a shared component.
- **Logic worth a hook** — the same stateful logic repeated (e.g. sort field/direction
  + comparator, search/filter, pagination). → `lib/hooks/useX.ts`.
- **Repeated style constants** — identical long Tailwind class strings redeclared per
  file (e.g. `inputClass`, `labelClass`). → `lib/constants/…` or a shared field component.
- **Repeated input handling** — the same sanitise/validate/format code (e.g. a phone
  digit-strip + "N digits left" hint). → a shared input component + a `lib` helper.
- **Repeated object construction** — the same object literal assembled many times
  (e.g. an audit-log `performedBy` / actor). → a `lib` helper.
- **Repeated network calls** — the same `fetch` + auth-header + error-check block.
  → a `lib/services` function.
- **Magic values** — the same meaningful literal duplicated (e.g. a min-password length
  used in both the client and an API route). → a shared constant.
- **Reuse gaps** — markup/logic re-typed inline when a shared component/helper ALREADY
  exists (e.g. inlining a spinner when `LoadingSpinner` exists). → import the existing one.

**Threshold (avoid over-engineering):** flag something only when it is genuinely
duplicated (appears in **2+ places**) OR is clearly reusable business logic. A few
similar lines in a single place is fine — do not invent abstractions for hypothetical
future reuse.

## Step 4 — Report (change nothing)

Produce a short, scannable, **prioritized** list. For each finding give:

- **What** it is — one plain-language line,
- **Where** — a `file:line` reference for each occurrence,
- **Proposed home** — the `lib/` path, hook, or component it should become.

Group by priority:

- **Tier 1 — clear duplication** (biggest copy-paste, most likely to drift apart).
- **Tier 2 — smaller tidy-ups.**
- **Tier 3 — optional / low value.**

Then **ask which to extract.** Apply changes only after explicit approval, **one
approved item at a time**, reusing existing shared code where possible. Per the project
workflow, commit + push each completed extraction.

## Guiding principles

- **Read-only by default.** Never create or edit code in this skill without the user
  approving that specific change.
- **Reuse before create.** Check the existing shared layer first; prefer importing what
  already exists over making something new.
- **Be honest.** If the code is already DRY, say so and suggest little or nothing — do
  not invent busywork to look thorough.
- **Don't over-abstract.** Three similar lines beat a premature abstraction; only flag
  real, repeated, or clearly-reusable logic.
- **Keep it concise.** A tiered list with `file:line` beats a long essay.

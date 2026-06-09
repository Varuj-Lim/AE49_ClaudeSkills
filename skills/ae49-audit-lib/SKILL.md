---
name: ae49-audit-lib
description: Audit the codebase for logic written inline that is duplicated across files or reusable enough to belong in shared code (a helper, a module, or a shared component). Re-scans the current code each run and reports a prioritized list with file locations and a proposed shared home, changing NOTHING until the user approves. Use when the user wants to find duplicate / copy-pasted code, DRY up the codebase, check for reuse opportunities, or asks "what could move into the shared layer".
---

# Audit Lib (shared-code / reuse audit)

Perform a **non-destructive review** of the codebase and report logic that is currently
written inline but is **duplicated** or **reusable** enough to belong in the shared
layer — a shared helper/module, or (in a UI project) a shared component.

**Hard rule: make NO code changes until the user explicitly approves a specific
suggestion.** This skill reads and recommends only. Producing the list is the job;
extracting the code is a separate, approved step the user comes back for.

**Re-scan every run.** Always read the current code fresh — do NOT rely on a saved
list or on memory. Other Claude sessions edit this same code in parallel, so the
findings must reflect the code as it is right now.

## Step 1 — Map the source

First identify the project's language(s) and layout — don't assume a stack. Check the
manifest / build file (e.g. `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`,
`pom.xml`) and the directory tree to learn the file extensions and where code lives.

Then read the source files — **read whole files**, not excerpts: this is a cross-file
duplication check, and excerpts will miss matches. Cover both:

- the **application / feature code** — where inline logic accumulates, and
- the **existing shared layer** — whatever this project calls it (`lib/`, `src/shared/`,
  `common/`, `utils/`, `helpers/`, `packages/`, internal modules) — so you know what is
  ALREADY shared.

## Step 2 — Inventory what's already shared (reuse first)

Before flagging anything, list what already exists in the shared layer. The audit has
two goals: (a) find inline code that should JOIN the shared layer, and (b) catch places
that re-implement something that already lives there. Never propose a helper / module /
component that already exists — point to the existing one instead.

## Step 3 — Scan for candidates

Look for these patterns (examples to guide the search, not an exhaustive list):

- **Duplicated logic block** — the same computation or transformation copied in 2+
  files. → a shared function/module.
- **Repeated stateful behavior** — the same logic repeated across call sites (sort +
  comparator, search/filter, pagination, retry/backoff). → a shared module (or a hook,
  in a UI framework that has them).
- **Repeated UI + state** (UI projects) — the same widget + state + handler copied in
  2+ places (a toast, a modal, a form field). → a shared component (+ a hook if the
  framework supports it).
- **Repeated input handling** — the same validate / sanitise / format code (e.g. a
  phone digit-strip + "N digits left" hint). → a shared helper (+ a shared input
  component in a UI project).
- **Repeated object construction** — the same object/record assembled many times
  (e.g. an audit-log actor / `performedBy`). → a shared factory/helper.
- **Repeated I/O** — the same network call, DB query, or file-access block (auth header
  + error check, the same query shape). → a shared service/repository function.
- **Repeated constants / formats** — identical long style strings, format strings, or
  config literals redeclared per file. → a shared constant.
- **Magic values** — the same meaningful literal duplicated in 2+ places (e.g. a min
  password length used on both client and server). → a shared constant.
- **Reuse gaps** — logic re-typed inline when a shared helper/component ALREADY exists.
  → import the existing one.

**Threshold (avoid over-engineering):** flag something only when it is genuinely
duplicated (appears in **2+ places**) OR is clearly reusable business logic. A few
similar lines in a single place is fine — do not invent abstractions for hypothetical
future reuse.

## Step 4 — Report (change nothing)

Produce a short, scannable, **prioritized** list. For each finding give:

- **What** it is — one plain-language line,
- **Where** — a `file:line` reference for each occurrence,
- **Proposed home** — the shared module / function / component it should become.

Group by priority:

- **Tier 1 — clear duplication** (biggest copy-paste, most likely to drift apart).
- **Tier 2 — smaller tidy-ups.**
- **Tier 3 — optional / low value.**

Then **ask which to extract.** Apply changes only after explicit approval, **one
approved item at a time**, reusing existing shared code where possible. Commit each
completed extraction as its own logical change.

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

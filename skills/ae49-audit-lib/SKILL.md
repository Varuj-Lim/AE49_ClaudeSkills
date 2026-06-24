---
name: ae49-audit-lib
description: Audit the codebase for logic written inline that is duplicated across files or reusable enough to belong in shared code (a helper, a module, or a shared component), then save the approved extractions as a docs/plans/<slug>.md plan an implement session can later build. Re-scans the current code each run, reports a prioritized list with file locations and a proposed shared home, and changes NO app code itself. Use when the user wants to find duplicate / copy-pasted code, DRY up the codebase, check for reuse opportunities, or asks "what could move into the shared layer".
---

# Audit Lib (shared-code / reuse audit → plan)

Perform a **non-destructive review** of the codebase, report logic that is currently
written inline but is **duplicated** or **reusable** enough to belong in the shared
layer — a shared helper/module, or (in a UI project) a shared component — then save the
approved extractions as a `docs/plans/<slug>.md` plan that an implement session can
later execute. Meant to run in a **plan-mode** session (`claude --permission-mode plan`),
but works in any session.

**Hard rule: make NO app-code changes in this skill.** The only file this skill writes
is the plan in `docs/plans/`. Extracting the code is a separate step the user runs later
with `/ae49-implement-feature`.

**Re-scan every run.** Always read the current code fresh — do NOT rely on a saved
list or on memory. Other Claude sessions edit this same code in parallel, so the
findings must reflect the code as it is right now.

## Workflow

1. **Confirm plan mode.** This skill is meant for a plan-mode session. You are in plan
   mode if the harness has signalled it — a plan-mode system reminder is present and
   every write is blocked until ExitPlanMode. If you are NOT in plan mode, tell the user
   and recommend they switch (Shift+Tab → "plan mode") so the audit stays read-only;
   then ask whether to switch or proceed anyway. Resolve this before continuing.

2. **Map the source.** Identify the project's language(s) and layout — don't assume a
   stack. Check the manifest / build file (e.g. `package.json`, `pyproject.toml`,
   `go.mod`, `Cargo.toml`, `pom.xml`) and the directory tree to learn the file
   extensions and where code lives. Then read the source files — **read whole files**,
   not excerpts: this is a cross-file duplication check, and excerpts will miss matches.
   Cover both:
   - the **application / feature code** — where inline logic accumulates, and
   - the **existing shared layer** — whatever this project calls it (`lib/`,
     `src/shared/`, `common/`, `utils/`, `helpers/`, `packages/`, internal modules) — so
     you know what is ALREADY shared.

3. **Inventory what's already shared (reuse first).** Before flagging anything, list
   what already exists in the shared layer. The audit has two goals: (a) find inline
   code that should JOIN the shared layer, and (b) catch places that re-implement
   something that already lives there. Never propose a helper / module / component that
   already exists — point to the existing one instead.

4. **Scan for candidates.** Look for these patterns (examples to guide the search, not
   an exhaustive list):

   - **Duplicated logic block** — the same computation or transformation copied in 2+
     files. → a shared function/module.
   - **Repeated stateful behavior** — the same logic repeated across call sites (sort +
     comparator, search/filter, pagination, retry/backoff). → a shared module (or a
     hook, in a UI framework that has them).
   - **Repeated UI + state** (UI projects) — the same widget + state + handler copied in
     2+ places (a toast, a modal, a form field). → a shared component (+ a hook if the
     framework supports it).
   - **Repeated input handling** — the same validate / sanitise / format code (e.g. a
     phone digit-strip + "N digits left" hint). → a shared helper (+ a shared input
     component in a UI project).
   - **Repeated object construction** — the same object/record assembled many times
     (e.g. an audit-log actor / `performedBy`). → a shared factory/helper.
   - **Repeated I/O** — the same network call, DB query, or file-access block (auth
     header + error check, the same query shape). → a shared service/repository function.
   - **Repeated constants / formats** — identical long style strings, format strings, or
     config literals redeclared per file. → a shared constant.
   - **Magic values** — the same meaningful literal duplicated in 2+ places (e.g. a min
     password length used on both client and server). → a shared constant.
   - **Reuse gaps** — logic re-typed inline when a shared helper/component ALREADY
     exists. → import the existing one.

   **Threshold (avoid over-engineering):** flag something only when it is genuinely
   duplicated (appears in **2+ places**) OR is clearly reusable business logic. A few
   similar lines in a single place is fine — do not invent abstractions for hypothetical
   future reuse.

5. **Report + pick scope (change nothing).** Produce a short, scannable, **prioritized**
   list. For each finding give:
   - **What** it is — one plain-language line,
   - **Where** — a `file:line` reference for each occurrence,
   - **Proposed home** — the shared module / function / component it should become.

   Group by priority:
   - **Tier 1 — clear duplication** (biggest copy-paste, most likely to drift apart).
   - **Tier 2 — smaller tidy-ups.**
   - **Tier 3 — optional / low value.**

   Then **ask which findings to put in the plan.** If the codebase is already DRY, say
   so and stop — do NOT write an empty plan or invent busywork to look thorough.

6. **Ensure the folder.** Check for `docs/plans/` at the repo root. If it does not
   exist, create it.

7. **Read the template.** Read [TEMPLATE-FORMAT.md](TEMPLATE-FORMAT.md) from THIS
   skill's directory — that is the canonical plan format (do not depend on a
   project-level template).

8. **Exit plan mode, then write the plan.** In plan mode you cannot create the file yet,
   and you cannot silently switch modes yourself. Put the full plan in the plan-mode plan
   file, then call **ExitPlanMode** (so the approval screen shows the real plan) — the
   user's approval is the switch that turns plan mode off. Once approved (or if you were
   never in plan mode), save `docs/plans/<slug>.md`, where `<slug>` is a kebab-case name
   for the extraction work (e.g. `shared-code-extraction.md`, or scope it like
   `dry-leave-tables.md`). Fill every section of the template from the approved findings:
   - **Context** — what's duplicated and why centralising it helps.
   - **Steps** — one step per extraction: create the shared home, then update each call
     site to import it; `→ verify:` a real check (e.g. `npx tsc --noEmit`, the route
     still renders).
   - **Files to touch** — list the new/edited shared file AND every call site that gets
     rewired to import it, so implement-feature can detect two sessions colliding on the
     same file.
   - **Reuse** — point at any existing shared code the new extraction should build on.

   Set **Status** to `Ready` and stamp **Created** with today's date.

9. **Commit + push the plan.** Stage ONLY `docs/plans/<slug>.md` — never `git add -A`
   (`git add <file>` creates the folder for you). Commit with a message naming the
   extraction (follow the repo's commit convention). Then, if a remote is configured,
   `git pull --rebase` first (so the push isn't rejected non-fast-forward) and push. If
   no remote, commit only and tell the user push was skipped.

10. **Mark complete.** Mark this audit run complete in the session task list: call
    **TaskUpdate** to set the audit task's status to `completed`. If you never registered
    a task for this run, create one now with **TaskCreate** and immediately mark it
    `completed`, so the task list clearly shows the skill finished.

11. **Return to plan mode + hand off.** Call **EnterPlanMode** to switch back into plan
    mode. (If EnterPlanMode isn't available, ask the user to Shift+Tab back to plan
    mode.) Then report the saved plan path and the commit/push status. Do NOT extract the
    code here. ALWAYS close the turn with this exact standard hand-off line (adjust only
    the push wording if push was skipped/blocked):

    > ✅ Audit done — extraction plan saved & pushed. Build it anytime with
    > `/ae49-implement-feature`. Ready for your next `/ae49-audit-lib`.

## Output

- One file: `docs/plans/<slug>.md`, Status `Ready`, committed and pushed — OR nothing if
  the codebase is already DRY (say so).
- No app-code changes. Session left back in plan mode.

## Guiding principles

- **Read-only on app code.** This skill writes only the plan doc; never create or edit
  app code here.
- **Reuse before create.** Check the existing shared layer first; prefer importing what
  already exists over making something new.
- **Be honest.** If the code is already DRY, say so and write no plan — do not invent
  busywork to look thorough.
- **Don't over-abstract.** Three similar lines beat a premature abstraction; only flag
  real, repeated, or clearly-reusable logic.
- **Keep it concise.** A tiered list with `file:line` beats a long essay.

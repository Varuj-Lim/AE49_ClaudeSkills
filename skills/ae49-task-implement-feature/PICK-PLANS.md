# Choosing a plan to build — collision mapping + pick list

> Step 3 of `ae49-task-implement-feature`: map file-collisions across undone plans,
> order + render the pick list, and have the user select exactly one.


**(a) Map collisions.** Across ALL *undone* plans — both **Buildable** and
**In-progress** (every plan that could be built now) — read each plan's
`## Files to touch` section and collect the backtick-wrapped paths, **ignoring** any
path on a bullet marked "NO changes" (those are explicitly untouched). That yields one
path-set per plan. Compute every pairwise intersection: a plan *collides* with another
when their path-sets share ≥1 file. Record, per plan, which other plans it collides
with and on which files. A collision with an **In-progress** plan is the serious one
(a concurrent implementer builds the same files in its own worktree → the two diffs
conflict when they land); a collision between two **Buildable** plans only bites if
both get built at once.

**(b) List + select.** Present the **Buildable** plans for the user to pick one. For
each option show the feature name **plus its status**, so an `On hold` resume is
distinguishable from a fresh `Ready`; for an `On hold` plan also surface its
`## On hold` note so the user recalls what it's waiting on. **Append a collision
warning to every option whose path-set intersects another undone plan** — name the
colliding plan(s), their status, and the shared file(s), e.g. "⚠️ collides with
*absent-policy* (In progress) on `functions/src/index.ts`, `types/notification.ts`".
Mark options with no overlap as clean.
- If the *stuck?* set (In-progress plans) is non-empty, also list those under a
  clear **warning**: "In progress — may be a live session or agent building it now, or a
  crashed/stale build. Pick one only to resume after a crash; if another build is live,
  its uncommitted work in a separate worktree will conflict with yours at landing."
  The user MAY force-pick one of these to resume.
**Order the buildable list smallest plan first (small → big).** Size = number of
paths in that plan's `## Files to touch` (already collected in step 3a), tie-broken
by the count of `## Steps` checkboxes. Fewest files first; equal files → fewer Steps
first. Number the list in that order so the quickest builds sit at the top.

**ALWAYS print the buildable plans as a plain-text numbered list first** — even
when you then use AskUserQuestion — so the choices stay visible in the transcript
(the picker widget alone hides them, and the user has said they often can't see
what's on offer). One line per plan, each starting with an emoji for its status:
📋 the plan, then `✅ Ready` / `⏸️ On hold` / `🔨 In progress`, the feature name in
**bold**, a one-line gist (its Context or first line), and any `⚠️ collides with …`
warning. Example:

```
Buildable plans:
1. 📋 ✅ **unified-leave-table-format** — merge Orders + Approval into one shared table. ⚠️ collides with *absent-policy* (In progress) on `types/order.ts`
2. 📋 ⏸️ **hr-email-digest** — On hold: waiting on you to enable the email extension. Clean.
```

- After that list: if 4 or fewer options total, fire **AskUserQuestion** for the
  actual pick (one option per plan: label = feature name, description = status +
  collision warning + gist). If MORE than 4, skip the widget and ask the user to
  type the number or feature name. Either way the user picks exactly one.

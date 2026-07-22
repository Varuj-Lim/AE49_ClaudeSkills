---
name: ae49-task-plan-feature
description: >
  Plan a new feature for the current repo by stress-testing the design with a
  grilling interview, then saving the result as docs/plans/<feature>.md from a
  bundled plan template. Creates the docs/plans/ folder if it does not exist. Use
  when the user wants to plan or design a new feature, invokes /ae49-task-plan-feature,
  or when the ae49-plan agent needs the canonical docs/plans/ plan format. Main runs
  the grill; the ae49-plan agent writes the file.
---

# Plan a feature

Turn a feature idea into a ready-to-build `docs/plans/<feature>.md` that an
ae49-implement worktree can later execute. Normally written by the headless
**ae49-plan** agent that Main spawns once the design is settled; the same format
applies if Main writes it inline.

## Workflow

1. **Confirm the design is settled.** This skill writes a file; it does not decide
   anything. Main must already have grilled the user to a settled spec. If you are
   the ae49-plan agent and the spec has gaps, do NOT guess and do NOT try to ask —
   write the plan with your best reading and return the gaps as **Open questions**
   for Main to resolve with the user.

2. **Get the feature.** Use the feature name/description the user gave (skill
   args). If none, ask one line: what feature?

3. **Grill the design — Main only.** If you are Main, invoke the **ae49-task-grill**
   skill (via the Skill tool) and resolve every branch with the user before spawning
   ae49-plan. If you are the ae49-plan agent, SKIP this step — the design arrived
   settled and you cannot interview.

4. **Ensure the folder.** Check for `docs/plans/` at the repo root. If it does not
   exist, create it.

5. **Read the template.** Read [TEMPLATE-FORMAT.md](TEMPLATE-FORMAT.md) from THIS
   skill's directory — that is the canonical plan format (do not depend on a
   project-level template).

6. **Write the plan file.** Save `docs/plans/<slug>.md` directly (no ExitPlanMode,
   no approval screen — Main already got the user's sign-off on the design during
   the grill), where `<slug>` is the feature name in kebab-case (e.g. "Leave page" →
   `leave-page.md`). Fill every section of the template from the grilled design, set
   **Status** to `Ready`, and stamp **Created** with today's date. Fill `Files to
   touch` completely — it is the plan's file footprint, and it is the ONLY input to
   the `After:` edges Main uses to decide which implementers can run in parallel
   worktrees. An incomplete list means two builders silently collide. List every file
   you create or modify. Write the `## Plain-language summary` section in plain
   English — no jargon, no file paths, just what gets built and what's different for
   the user once it's done — the ae49-implement agent reads this same section back to
   the user later, so get it right here. Also write the `## Testing checklist`
   section: plain, numbered steps the user can click through in the app after the
   feature is built. **Caveman mode is OFF inside a Testing checklist** — every item
   is a full, self-explanatory sentence naming where to click, what to do, and what
   the user should see ("Open X → do Y → you should see Z"); never compressed
   fragments. This is now the project's ONLY testing artefact (there is no
   docs/TESTING.md), and ae49-implement quotes it **verbatim** in its final report —
   so it must be present, non-empty, and accurate. Never write "none".

7. **Wire overlaps into the build chain.** Connect this plan to any undone plan it
   shares a file with, so **Main** knows which implementers can run in parallel
   worktrees and which must wait. Do this for EVERY plan — there is no longer a
   Branch-based exemption, because every plan now builds in a worktree.
   - **Find overlaps.** Collect this plan's `## Files to touch` paths (ignore any
     `NO changes:` bullet). Read every OTHER **undone** plan in `docs/plans/*.md` (Status
     Ready / In progress / On hold — skip the `done/` subfolder) and collect theirs the
     same way. An overlap = they share ≥1 path.
   - **No overlaps →** leave `**After:**` as `—` and continue.
   - **Overlaps →** if you are the ae49-plan agent, apply the **after-all** default
     automatically (set `**After:** <slugA>, <slugB>, …`) and report the overlap set +
     the shared files to Main, noting that the user can request an urgent flip. Only
     Main may ask the user the after-all-vs-urgent question and, on "urgent", edit the
     other plan's `**After:**`.
     - **After all (default):** set this plan's `**After:** <slugA>, <slugB>, …` to every
       overlapped plan. If the overlaps span more than one existing chain, this correctly
       merges those chains into one.
     - **Urgent (Main only):** the user picks which overlapped plan(s) should instead wait
       for THIS plan; for each, add `<this-slug>` to THAT plan's own `**After:**` field
       (edit the existing plan file — allowed, plan docs live on `main`) and drop it from
       this plan's `After`. Only offer flipping a plan that is **not yet building** (no
       branch/PR). **Main refuses a flip that would create a cycle** (the target already
       sits behind this plan through some path) and explains why.
   - Store only these `**After:**` edges — never letters/levels/`.N`. Main (per
     ae49-router) reads them into a DAG at dispatch time: independent chains run in
     parallel worktrees, chained plans run sequentially.

8. **Hand the file to Main — do NOT commit.** If you are the ae49-plan agent you must
   not run `git add`, `git commit`, `git push`, or any branch command; leave
   `docs/plans/<slug>.md` uncommitted in the working tree and return its path to Main.

   **Main then commits the plan to `main` AND PUSHES IT.** This push is a hard
   prerequisite, not a nicety: `ae49-implement` runs in a throwaway worktree created
   from **origin/main**, so an unpushed plan is invisible to the builder and the build
   will fail to find its own plan file. Stage ONLY the plan file(s) this run wrote or
   changed (`docs/plans/<slug>.md`, plus any existing plan whose `**After:**` was edited
   on the urgent path) — never `git add -A`. `git pull --rebase`, then push. **Do not
   spawn ae49-implement until `git push` has succeeded.** If no remote is configured,
   tell the user the plan cannot be built by a worktree agent until one is.

9. **Mark complete.** If you are Main and tracking this run in the session task list,
   mark it `completed`. The ae49-plan agent has no task tools — it simply returns its
   report and exits.

10. **Hand off.** The ae49-plan agent returns: plan path, file footprint, `After:`
   edges set (and why), and any Open questions. Main then reports to the user. Do NOT
   implement here. ALWAYS close the turn with this exact standard hand-off line, so the
   user knows the plan is finished and you're ready for the next one:

   > ✅ Planning done — plan committed and **pushed to main** (the builder's worktree
   > needs it there). Say `impl: <slug>` to dispatch ae49-implement. Ready for your
   > next `plan:`.

## Output

- `docs/plans/<slug>.md`, Status `Ready`, `**After:**` wired, left uncommitted by
  ae49-plan; committed to `main` and **pushed** by Main.
- A report to Main: plan path, file footprint, `After:` edges, Open questions.

## Notes

- **Never edit application code here.** This skill produces one document.
- **Never commit or push from ae49-plan.** All git landing is Main's, after the
  user's gate.

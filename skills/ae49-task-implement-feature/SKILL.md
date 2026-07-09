---
name: ae49-task-implement-feature
description: >
  Implement a previously planned feature. Reads every plan in docs/plans/, lists
  the ones ready to build (Status Ready or On hold), lets the user pick which to
  build, executes its steps end-to-end, waits for the user to manually test and
  confirm it works before marking it Done, then commits and pushes. Use when the
  user wants to implement
  or build a planned feature, invokes /ae49-task-implement-feature, or is in an implement
  session ready to execute a docs/plans/ plan file.
---

# Implement a feature

Pick a pending plan from `docs/plans/` and build it. Meant to run in an
**implement** session (`claude --permission-mode acceptEdits` or default).

## Workflow

1. **Find plans.** If a remote is configured, `git pull --rebase` first so the list
   reflects plans pushed from a plan session. List `docs/plans/*.md` — every file
   there is a `<feature>.md` plan. (Completed plans live in the `docs/plans/done/`
   subfolder; the non-recursive `*.md` glob skips them, so they never appear in the
   list.) If `docs/plans/` is missing or empty, tell the user there's nothing to
   implement (plan one with `/ae49-task-plan-feature`) and stop.

2. **Filter.** Read each file's **Status** (the first word of the Status line) and
   sort plans into three buckets:
   - **Buildable** — Status `Ready` (fresh) or `On hold` (paused, waiting on the
     user). These go in the pick list.
   - **In progress** — a session is (or was) actively building it. Do NOT put these
     in the normal list; hold them aside as the *stuck?* set (a live concurrent
     session, OR a crashed/abandoned build).
   - **Done** — ignore.

   If there are no Buildable plans **and** no In-progress plans, tell the user
   there's nothing to implement (plan one with `/ae49-task-plan-feature`) and stop.

3. **Map collisions, then list + select.** *Collision-check FIRST, so every option is
   labeled with what it clashes with before the user picks.*

   **(a) Map collisions.** Across ALL *undone* plans — both **Buildable** and
   **In-progress** (every plan that could be built now) — read each plan's
   `## Files to touch` section and collect the backtick-wrapped paths, **ignoring** any
   path on a bullet marked "NO changes" (those are explicitly untouched). That yields one
   path-set per plan. Compute every pairwise intersection: a plan *collides* with another
   when their path-sets share ≥1 file. Record, per plan, which other plans it collides
   with and on which files. A collision with an **In-progress** plan is the serious one
   (a live concurrent session shares the worktree → edits can clobber); a collision
   between two **Buildable** plans only bites if both get built at once.

   **(b) List + select.** Present the **Buildable** plans for the user to pick one. For
   each option show the feature name **plus its status**, so an `On hold` resume is
   distinguishable from a fresh `Ready`; for an `On hold` plan also surface its
   `## On hold` note so the user recalls what it's waiting on. **Append a collision
   warning to every option whose path-set intersects another undone plan** — name the
   colliding plan(s), their status, and the shared file(s), e.g. "⚠️ collides with
   *absent-policy* (In progress) on `functions/src/index.ts`, `types/notification.ts`".
   Mark options with no overlap as clean.
   - If the *stuck?* set (In-progress plans) is non-empty, also list those under a
     clear **warning**: "In progress — may be a live session building it now, or a
     crashed/stale build. Pick one only to resume after a crash; if another session
     is live, the shared worktree means edits can clobber." The user MAY force-pick
     one of these to resume.
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

4. **Confirm a collision on the pick.** The collision map is already computed (step 3a)
   and the warning was shown at selection (step 3b). Now act on it for the plan the user
   actually picked. If that plan collides with an **In-progress** plan, restate the
   conflicting plan and shared files, then ask how to handle it before building:
   (i) **proceed anyway** — I keep edits additive/surgical and verify my diff lands in
   the commit; (ii) **build but skip the shared file(s)** where the plan allows it; or
   (iii) **pick a different plan**. Continue only once the user decides. If the picked
   plan has no In-progress collision (a clash with another *Buildable* plan is not a live
   threat), continue silently. This is a best-effort guard, not a lock: Status reflects
   the step-1 `git pull --rebase` snapshot, so a plan another session marks In progress a
   moment later may be missed.

5. **Load, explain, proceed.** Read the selected plan fully.

   **Announce the pick in plain text** — one clear line so the user can always see
   which plan is running, e.g. `🔨 Building: **unified-leave-table-format** (was
   Ready)`. Restate it the same way if you resume after a pause.

   Then show the plan's `## Plain-language summary` section back to the user —
   what will change and what's different once it's built — **for visibility only;
   do NOT ask them to confirm it again**. They already approved it during planning
   and just picked it in step 3, so proceed directly to building. (If an older plan
   has no `## Plain-language summary` section, write one now from the plan's
   Context/Steps and show it — still no confirmation wait.)

   Set the plan's **Status** to `In progress`. If you are resuming
   an `On hold` plan, read its `## On hold` note to tell which pause it was: (a) a
   manual action was needed before the build could continue — assume it's done,
   delete the note, and resume from the first unticked Step; (b) awaiting your test
   confirmation (step 8 below) — the build and Verify already finished, so skip
   straight to asking whether testing confirmed it works (step 9) instead of
   rebuilding.

6. **Build.** Execute the plan's **Steps** in order. After each step's verify
   passes, tick its box (`[ ]` → `[x]`). Reuse the helpers named in the plan's
   **Reuse** section — don't rewrite what exists. Stay surgical: only what the plan
   calls for.

   - **Pause for a manual action (On hold).** If a step needs the *user* to do
     something you cannot (deploy rules, log into a CLI, run a production migration,
     create test accounts, etc.) before the build can continue:
     (a) set **Status** to `On hold`;
     (b) add a `## On hold — waiting on you` section naming the exact manual action
     **and** the Step number to resume from;
     (c) **checkpoint-commit** — stage only the files touched so far **plus** the plan
     file (never `git add -A`), commit with a message noting it's paused on a manual
     step, and if a remote is configured `git pull --rebase` then push — so the paused
     state and partial work are durable and any session can resume cleanly;
     (d) tell the user the manual action, then **stop**.
     `On hold` is filtered IN, so once they finish the manual step they re-run
     `/ae49-task-implement-feature`, pick the plan, and step 5 flips it back to
     `In progress` and resumes from the noted step.

7. **Verify.** Run the plan's **Verification** section end-to-end (run the app,
   typecheck, exercise the flow). Fix and re-verify until it passes.

8. **Show the testing checklist — then wait.** Automated Verify (step 7) is not the
   finish line. **Never set Status to `Done` on your own say-so** — that only
   happens once the user has personally tried the feature and told you it works.

   - Print the plan's `## Testing checklist` section back to the user verbatim —
     plain, numbered, click-through steps. (If an older plan has no such section,
     write one now from its Success criteria and Steps, then show that instead.)
     This is a lightweight, per-feature list only — separate from the full
     `/ae49Hub-task-uat-docs` role-based checklist pipeline, which this step does
     not touch or update.
   - Tell the user plainly: the build and your own checks passed, but you're
     holding off on marking it Done until they've run through the checklist and
     told you it works.
   - **Checkpoint before waiting**, the same way as a manual-action pause, since
     this wait can outlast the conversation: set **Status** to `On hold`, add a
     `## On hold — awaiting your test confirmation` section noting that all Steps
     and automated Verify are already done and only the user's confirmation is
     pending, then **checkpoint-commit** (stage the files touched so far plus the
     plan file — never `git add -A` — commit with a message noting it's paused on
     test confirmation, `git pull --rebase` then push if a remote is configured).
   - Then **stop** and wait for the user's reply. Do not touch Success-criteria
     boxes or Status again until step 9 resolves them.

9. **Act on the user's answer.**
   - **It works.** Delete the `## On hold` section, tick every Success-criteria box
     that now holds, and set **Status** to `Done`. Continue to step 10.
   - **It doesn't work / something's off.** Fix it, re-run **Verify** (step 7), then
     repeat step 8 (fresh checklist, fresh checkpoint) and wait again. Loop until
     confirmed — never mark `Done` on an unconfirmed build.
   - If confirmation arrives in a **later run** of this skill (the user picked this
     same `On hold` plan back up), step 5 already routes you straight here instead
     of rebuilding.

10. **Move the plan file into `done/`.** Once the plan is confirmed working and marked
   `Done`, move it into the `docs/plans/done/` subfolder so completed plans are separated
   from active ones: `git mv docs/plans/<feature>.md docs/plans/done/<feature>.md`. Use
   `git mv` (not a plain rename) so the move is staged and history is preserved. Create
   the `docs/plans/done/` folder first if it doesn't exist — Git's `git mv` does NOT
   create the destination directory and will fail with "No such file or directory" if
   it's missing. Do this before the commit so the move rides in the same commit. (Plans
   in `done/` are excluded by step 1's non-recursive `docs/plans/*.md` glob, so they
   never reappear in the list — no `-DONE` suffix needed.)

11. **Commit + push (final).** Stage ONLY the files this build touched, plus the moved
   `docs/plans/done/<feature>.md` plan file — never `git add -A`. One commit, message focused on
   the feature ("why"), per the repo's commit convention. Then, if a remote is
   configured, `git pull --rebase` and push — so the built code and the `Done` status
   reach the remote and stay in sync with the pushed plan. If no remote, commit only.

12. **Report.** Close out per [ae49-ref-report-format](../ae49-ref-report-format/SKILL.md)'s
    shared principles — plain English, one consistent emoji per field, one-line close —
    but skip its severity-tier / finding-ID machinery (sections 3–4): a build isn't a
    findings list, it's one item, so use this domain-specific field set instead:
    ```
    ✅ **Done: <feature-name>**
    🔨 Built: <one-line, what changed>
    🧪 Verify: <✅/❌ per check, e.g. "✅ tsc clean" · "👀 preview not checked (reason)">
    👤 Tested by you: <✅ confirmed working — quote or summarize their confirmation>
    📝 Commit: <short message>
    🚀 Push: <✅ pushed / ⏭️ skipped — reason>
    ⚠️ Watch out: <anything the user should manually check — omit the line if none>
    ```
    One clause per line, no prose. Reuse the same field emoji every run
    (✅/🔨/🧪/👤/📝/🚀/⚠️) so reports scan the same way build to build.

## Notes

- One plan per run. To build another, run the skill again.
- If a step is ambiguous or the plan contradicts the code, stop and ask — don't guess.
- **Don't show the preview to the user — they'll see it themselves.** Verify your own
  way (typecheck, route checks, etc.), but never open, screenshot, or share the browser
  preview with the user.

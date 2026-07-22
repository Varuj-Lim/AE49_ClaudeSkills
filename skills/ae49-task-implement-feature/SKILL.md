---
name: ae49-task-implement-feature
description: >
  Implement a previously planned feature. Reads every plan in docs/plans/, lists
  the ones ready to build (Status Ready or On hold), lets the user pick which to
  build, executes its steps end-to-end, runs the automated checks, then STOPS with
  every change uncommitted for the user to manually test — committing only after the
  user confirms testing passed and asks to commit. Use when the user wants to implement
  or build a planned feature, invokes /ae49-task-implement-feature, or is in an implement
  session ready to execute a docs/plans/ plan file. Solo single-session path — when Main
  is routing via the ae49-implement agent, this skill is not used.
---

# Implement a feature

Pick a pending plan from `docs/plans/` and build it. Meant to run in an
**implement** session (`claude --permission-mode acceptEdits` or default).

## When to use this — and when NOT to

This is the **solo, hands-on build path**: ONE human session, in the repo folder,
that picks a plan, builds it, and holds it for your manual test. Use it for small
plans where spawning an agent + worktree is more ceremony than the change, for
resuming an `On hold` plan that needed a manual action only you can do, or whenever
the router/worktree harness isn't in play.

**Do NOT run this inside an `ae49-implement` agent** — that agent is headless, has
no user to test with, and is told not to run this skill. If Main is routing (`impl:`),
Main spawns `ae49-implement` in a throwaway worktree and owns the manual-test gate and
the git landing itself; this skill is not part of that path. The agent is the default;
this skill is the deliberate exception.

## Commit gate (the core rule — read first)

**Manual testing by the user is the final gate before ANY commit.** Build the
plan and run every automated check (typecheck, build, lint, tests/CI), then **STOP with
all changes sitting uncommitted in the working tree** and wait. Do **not** create a
commit or push anything — not a checkpoint, not the plan-status bookkeeping, nothing —
until the user has run the testing checklist, explicitly confirms it passed, and asks
you to commit. Only then do steps 10–11 (archive + the single commit). This holds
everywhere, including the mid-build manual-action pause (step 6): that stays uncommitted
too. In a normal run there is exactly ONE commit, and it happens after the user's
approval.

**This gate has no exception.** On a feature branch the commit is cheaper (a branch commit
is not a deploy), but the user still tests BEFORE the merge — and the merge is the deploy.
Never merge a PR the user has not personally tested and explicitly told you to merge.

## Workflow

1. **Find plans.** If a remote is configured **and the working tree is clean**,
   `git pull --rebase` first so the list reflects plans pushed from a plan session.
   **Skip the pull when the tree is dirty** — a build paused at step 8 leaves its work
   uncommitted, and `git pull --rebase` aborts on a dirty tree ("cannot pull with
   rebase: you have unstaged changes"); in that case you're resuming that paused build,
   so proceed without pulling. List `docs/plans/*.md` — every file
   there is a `<feature>.md` plan. (Completed plans live in the `docs/plans/done/`
   subfolder; the non-recursive `*.md` glob skips them, so they never appear in the
   list.) If `docs/plans/` is missing or empty, tell the user there's nothing to
   implement (plan one with `/ae49-task-plan-feature`) and stop.

   **Agent-worktree guard:** if this folder's path contains `.claude/worktrees/agent-`,
   **STOP** — you are inside an `ae49-implement` agent's throwaway worktree, which never
   commits and is deleted after landing. Report back to Main instead of building here.

   **Note the current branch** (`git rev-parse --abbrev-ref HEAD`) and the default branch
   (`git symbolic-ref --short refs/remotes/origin/HEAD`, stripped of `origin/`, falling
   back to `main` when it prints nothing). Step 11 needs it: you never commit on the
   default branch. Use `symbolic-ref`, **not** `git rev-parse --abbrev-ref origin/HEAD` —
   the latter echoes its argument when the ref is missing.

2. **Filter.** Read each file's **Status** (the first word of the Status line) and
   sort plans into three buckets:
   - **Buildable** — Status `Ready` (fresh) or `On hold` (paused, waiting on the
     user). These go in the pick list.

     **Chain check:** a plan carries `After: <slug>[, <slug>]` edges written by
     `ae49-plan`. A plan is only Buildable if every plan it lists in `After:` is already
     `Done` (in `docs/plans/done/`). Otherwise hold it aside as **Blocked** — list it
     separately, naming what it waits on, and don't offer it as a pick.
   - **In progress** — a session is (or was) actively building it. Do NOT put these
     in the normal list; hold them aside as the *stuck?* set (a live concurrent
     session, OR a crashed/abandoned build).
   - **Done** — ignore.

   **Concurrent-agent override:** an `ae49-implement` agent building in its own worktree
   never writes Status, so its plan still reads `Ready`. After the step-1 sync, run
   `git worktree list`: if a worktree under `.claude/worktrees/agent-*` exists, treat any
   plan it may be building as **In progress** (ask the user which, if it isn't obvious) —
   its work is uncommitted and invisible to `git log`.

   If there are no Buildable plans **and** no In-progress plans, tell the user
   there's nothing to implement (plan one with `/ae49-task-plan-feature`) and stop.

3. **Map collisions, then list + select.** Before the user picks, detect file-collisions
   across ALL undone plans (Buildable + In-progress), then present the Buildable plans as a
   plain-text numbered list — smallest first, each tagged with status and any
   `⚠️ collides with …` warning — and have the user pick exactly one. Full procedure
   (collision mapping, ordering, plain-text list format, the AskUserQuestion pick) →
   **[PICK-PLANS.md](PICK-PLANS.md)**.

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

   Set the plan's **Status** to `In progress` (in the working tree only — per the
   Commit gate, this and every later change stays uncommitted until the user approves
   testing). If you are resuming
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
     (c) **do NOT commit or push** — the build isn't finished and hasn't been tested, so
     the partial work stays uncommitted in the working tree (per the Commit gate);
     (d) tell the user the exact manual action AND the Step number to resume from, note
     that the work is sitting uncommitted, then **stop**.
     **Durability caveat:** nothing is committed, and this repo's concurrent sessions can
     strip unstaged edits — so it's safest to do the manual action and resume in the SAME
     session. If the pause must span sessions, you MAY offer a clearly-labeled *untested
     WIP* checkpoint commit, but make it ONLY with the user's explicit OK (and the final
     commit in step 11 still supersedes it once testing passes).
     `On hold` is filtered IN, so once they finish the manual step they re-run
     `/ae49-task-implement-feature`, pick the plan, and step 5 flips it back to
     `In progress` and resumes from the noted step.

7. **Verify.** Run the plan's **Verification** section end-to-end. If it is missing or
   thin, fall back to the project's own commands from its `CLAUDE.md` — at minimum
   typecheck, build and lint. Fix and re-verify until it passes.

8. **Show the testing checklist — then STOP, uncommitted.** Automated Verify (step 7)
   is not the finish line, and it is NOT a licence to commit. **Never commit or push,
   and never set Status to `Done`, on your own say-so** — both wait until the user has
   personally tried the feature and told you it works (per the Commit gate).

   - Print the plan's `## Testing checklist` section back to the user verbatim —
     plain, numbered, click-through steps, **with caveman mode OFF**: every item a
     full, self-explanatory sentence ("Open X → do Y → you should see Z"), never
     compressed fragments or prose-run summaries. (If an older plan has no such
     section, write one now from its Success criteria and Steps, then show that
     instead.)
     The plan's own `## Testing checklist` is the ONLY testing model — there is no
     project testing doc to keep in sync. If the built code diverged from the checklist,
     quote it verbatim anyway and add a short "Checklist drift" note listing the
     corrected or missing steps.
   - Tell the user plainly: the build and your automated checks passed, **all changes
     are sitting uncommitted in the working tree**, and you're holding off on BOTH the
     commit and marking it Done until they've run the checklist and told you it works.
   - Set the plan's **Status** to `On hold` and add a `## On hold — awaiting your test
     confirmation` section (all Steps + automated Verify done, only the user's
     confirmation pending) — but **leave it uncommitted**, in the working tree, with
     everything else. **Do NOT commit or push here.**
   - **Durability caveat:** the work now lives only in the working tree, and this
     repo's concurrent sessions can strip unstaged edits — so it's safest to test in
     this same session. If the wait must span sessions, you MAY offer a clearly-labeled
     *untested WIP* checkpoint commit, but only with the user's explicit OK.
   - Then **stop** and wait for the user's reply. Do not commit, and do not touch
     Success-criteria boxes or Status again, until step 9 resolves them.

9. **Act on the user's answer.**
   - **It works / they ask you to commit.** NOW — and only now — is committing
     unlocked. Delete the `## On hold` section, tick every Success-criteria box that
     now holds, set **Status** to `Done`, and continue to step 10 (archive) + step 11
     (the single commit — the FIRST commit of this build).
   - **It doesn't work / something's off.** Fix it — changes stay uncommitted — re-run
     **Verify** (step 7), then repeat step 8 (fresh checklist) and wait again. Still
     **do not commit**. Loop until confirmed — never commit or mark `Done` on an
     unconfirmed build.
   - If confirmation arrives in a **later run** of this skill (the user picked this
     same `On hold` plan back up), step 5 routes you straight here — provided the
     uncommitted work is still in the working tree (or a labeled WIP checkpoint was
     made); either way step 11 produces the clean final commit.

10. **Move the plan file into `done/`.** Once the plan is confirmed working and marked
   `Done`, move it into the `docs/plans/done/` subfolder so completed plans are separated
   from active ones: `git mv docs/plans/<feature>.md docs/plans/done/<feature>.md`. Use
   `git mv` (not a plain rename) so the move is staged and history is preserved. Create
   the `docs/plans/done/` folder first if it doesn't exist — Git's `git mv` does NOT
   create the destination directory and will fail with "No such file or directory" if
   it's missing. Do this before the commit so the move rides in the same commit. (Plans
   in `done/` are excluded by step 1's non-recursive `docs/plans/*.md` glob, so they
   never reappear in the list — no `-DONE` suffix needed.)

11. **Commit (final) — and stop there.** This runs ONLY after the user's step-9 approval —
   it is normally the FIRST and only commit of the build (nothing was committed earlier).
   Stage ONLY the files this build touched, plus the moved `docs/plans/done/<feature>.md`
   plan file — never `git add -A`. One commit, message focused on the feature ("why"), per
   the repo's commit convention. (If a labeled *untested WIP* checkpoint was made during a
   cross-session pause, fold it into one clean feature commit — `git commit --amend` or a
   soft reset — never leave the WIP as the final record.)

   **Never commit or push on the default branch.** If you are on it, create the feature
   branch FIRST (`git switch -c <prefix>/<slug>`, prefix per the plan's `**Branch:**`
   field), and commit there. Then **stop and report** — the commit is the end of this
   skill's authority.

   Anything that reaches the default branch needs the user's **explicit go-ahead, asked
   for and answered each time**: pushing the branch, opening the PR (`gh pr create --base
   <def>`), and — separately — the squash-merge. **Merging is deploying.** Never push the
   default branch, never merge a PR, and never treat "commit it" as permission to do
   either. If the repo has no remote, commit on the branch and stop.

12. **Report.** Close out per [ae49-ref-report-format](../ae49-ref-report-format/SKILL.md)'s
    shared principles — plain English, one consistent emoji per field, one-line close — but
    skip its severity-tier / finding-ID machinery (a build is one item, not a findings list).
    Use the build-specific field set (✅ Done · 🔨 Built · 🧪 Verify · 👤 Tested by you ·
    📝 Commit · 🚀 Push · ⚠️ Watch out) + the jargon-free "Watch out" rule → **[REPORT.md](REPORT.md)**.

## Notes

- One plan per run. To build another, run the skill again.
- If a step is ambiguous or the plan contradicts the code, stop and ask — don't guess.
- To implement PR review findings, the user pastes them in and you fix them on the PR
  branch — there is no `.review/` artifact and no auto-fix dispatch.
- **Don't show the preview to the user — they'll see it themselves.** Verify your own
  way (typecheck, route checks, etc.), but never open, screenshot, or share the browser
  preview with the user.

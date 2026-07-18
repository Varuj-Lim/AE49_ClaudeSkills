# FROM-REVIEW — implement code-review findings on a branch

> Loaded on demand by `ae49-task-implement-feature` when it is invoked with `--from-review`
> (or when a `.review/pr-<PR#>.json` artifact exists for the current branch). This is a
> variant of **PR_FLOW**: a branch session in a pooled build folder, but instead of building a
> plan from scratch it implements the fixes the Main Session's merge gate dispatched. Produced
> by `/ae49-task-integrate merge`'s AUTOFIX loop (see that skill's AUTOFIX.md).

Everything in **PR-FLOW.md** still binds (plan file is READ-ONLY and never staged, never touch
`main`, push every commit, dev via `.\dev.cmd`, no user-test wait here). The deltas below
replace the plan-pick and the build steps.

## Preconditions (STOP if any fails)

- Current branch is a `(feature|bugfix|refactor)/<slug>` branch (not the default branch), and
  the folder is one of the pooled clones. If on the default branch, STOP — this mode never
  runs on `main`.
- `.review/pr-<PR#>.json` exists in this folder. If missing, STOP and tell the user to dispatch
  from the Main Session (`/ae49-task-integrate merge <PR#>`).
- The artifact's **`reviewedSha` matches the current branch head** (`git rev-parse HEAD` /
  `origin/<branch>`). Mismatch ⇒ the branch moved since review; STOP and ask for a fresh
  dispatch (fixing against stale findings would target the wrong code).

## Steps

1. **Read the artifact.** Parse `.review/pr-<PR#>.json`. Consider only findings with
   `class == "auto"` — `decision` and `wontfix-candidate` items are the human's, never
   implemented here; if the artifact contains any, note them for the report but do not touch
   them. Announce plainly, e.g. `🔧 Implementing 5 review fixes on feature/<slug> (PR #6)`.

2. **Implement each `auto` finding**, grouped by area. Use the finding's `fix` as the intent,
   but **verify against the actual code** — the `fix` is a suggestion, not a spec; if the code
   shows the suggested fix is wrong or incomplete, implement what's correct and record the
   divergence in the finding's `note`. Stay surgical: only what the finding calls for. Reuse
   existing helpers. If a finding is ambiguous, contradicts the code, or needs a product
   decision you can't make, **do not guess** — mark it `needs-human` (step 4) and move on.

3. **Verify + commit + push, per finding-group.** After each group: run the automated checks
   (typecheck / build / lint as the repo uses), then commit **code files only — never the plan
   file or `.review/`** with a message naming the finding ids (`fix: B1,MJ3 stock ledger
   (#<PR#>)`), and `git push`. One group's failure does not stop the others — record it and
   continue. CI re-runs on the pushed branch.

4. **Write results.** Produce `.review/pr-<PR#>.results.json` — the same schema as the input,
   each finding's `outcome` set to exactly one of:
   - `fixed` — implemented, committed, pushed, checks green.
   - `needs-human` — tried but uncertain / a check failed / needs a decision. Add a `note`
     saying what's blocking. **Also re-post it as a PR comment** tagged `needs-human` so it is
     visible on the PR, not only in the file:
     `gh pr comment <PR#> --repo <owner>/<repo> --body "🔧 needs-human — <id>: <why>"`.
   - `wontfix` — on inspection it's intended / out of scope. Add a one-line `note` rationale;
     the Main Session surfaces it for the user to accept or override.
   Never invent a `fixed` you didn't push. `.review/` stays git-ignored (never committed).

5. **Report** (per REPORT.md's field set, plus a per-finding line). Lead with the tally —
   `✅ fixed N · 🙋 needs-human M · 🚫 wontfix K` — then one line per finding with its outcome,
   then the branch state (commits pushed, CI running). Close with the hand-back line:

   > *"Fixes pushed. Back in the Main Session run `/ae49-task-integrate merge <PR#>` — it reads
   > the results, re-reviews the fix diff, and (if all clear) goes to the `:3000` preview."*

   Do **not** report the feature `Done` and do **not** wait for a user test here — that happens
   at the merge gate, same as a normal branch build.

## Notes

- This mode never picks or writes a plan; the plan file stays byte-identical (PR-FLOW rule).
- If **every** finding is `needs-human`/`wontfix` (nothing auto-implementable), push nothing,
  write the results, and say so — the Main Session will stop at its re-entry gate for the user.

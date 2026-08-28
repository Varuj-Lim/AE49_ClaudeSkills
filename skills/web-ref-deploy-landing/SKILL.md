---
name: web-ref-deploy-landing
description: The shared landing-and-deploy discipline for every hub project (AE49_Hub, Nuri_Hub, future siblings) whose default branch auto-deploys to Firebase App Hosting — push==deploy, the non-deploying backup branch, deploying security rules SEPARATELY and BEFORE the manual-test gate, committing a plan before dispatching implementers, one commit per feature with an explicit pathspec, the tiny-fix fast path, dev-server files that rewrite themselves, and the rollback recipe. Use when landing, committing, pushing, deploying, or rolling back in such a project, and whenever a deploy/landing ruling arrives — the rule changes HERE once, project CLAUDE.md files keep only their own branch names, ports and project ids.
---

# Landing and deploying — shared discipline

One set of rules for every hub whose default branch is wired to Firebase App
Hosting. **Each project supplies only its own facts**; nothing here is
project-specific, and no project should restate the process below in its own
`CLAUDE.md`.

The *routing* half of the workflow — who grills, who plans, who builds, the audit
gate, the manual-test gate and its checklist — lives in **`ae49-router`**. This
skill starts where that one ends: at the moment there is something to commit.

## What each project must state in its own CLAUDE.md

A short facts table, nothing more:

| Fact | Example |
|---|---|
| Deploy branch (auto-deploys) | `main` |
| Backup branch (never deploys) | `backup` |
| Firebase project id | for the rules/functions deploy command |
| App ports | production vs emulator |
| Does it ship security rules / functions? | yes → the separate deploy below applies |
| Lint/typecheck commands that ACTUALLY exist | see rule 8 |

## 1. push == deploy — the deploy branch needs explicit go-ahead

App Hosting watches the deploy branch and rebuilds on every push to it, so there
is **no staging buffer between a push and production**. Never push the deploy
branch without the user asking for it *in that turn*. "They approved a push
yesterday" is not approval for today's push, and passing the manual-test gate is
approval to COMMIT, never to deploy.

## 2. The backup branch is always allowed

`git push origin <deploy-branch>:<backup-branch>` gets the day's commits off the
machine **without deploying anything** — App Hosting only watches the deploy
branch. Run it after every landing. It is never a substitute for the user's
"push", and never needs their permission.

## 3. Security rules and functions deploy SEPARATELY — and BEFORE the gate

**A push ships application code only.** `firestore.rules` (and Cloud Functions)
are NOT deployed by App Hosting. They go out through their own command:

```
npx firebase-tools deploy --only firestore:rules --project <project-id>
```

**When the gate runs against PRODUCTION, deploy the rules before opening it** —
otherwise the tester hits `permission-denied` on a feature whose code is
perfectly correct.

**When the gate runs on the EMULATOR (the default — see `ae49-router`), it needs
no deploy at all.** `firebase.json` points the emulator at the very same
`firestore.rules` file in the working tree, so the local suite is already
running the new rules the moment they are saved. Deploying "for the gate" in
that case changes production for no testing benefit. Check `firebase.json`
rather than assuming.

Either way, **the rules must go out before the feature does**. If they are
forgotten, the push deploys the app against the OLD rules and the feature goes
live **denying itself** — and the symptom is a permission error that reads
exactly like an application bug, so the hunt starts in the wrong place. So treat
"does this feature touch rules or functions?" as a question with a deadline of
the deploy, asked while preparing the gate; deploying at that moment is fine and
de-risks landing day, but say plainly that it is a landing step, not a gate
prerequisite, whenever the gate is on the emulator.

## 4. Commit the plan BEFORE dispatching implementers

Land the plan file on the deploy branch (a local commit — it deploys nothing on
its own) and push it to the backup branch **before** spawning any implementer.
Then every dispatch tells the builder to verify its base carries that commit and
to `git merge --ff-only <deploy-branch>` if its worktree snapshot is stale.

This exists because a builder working from a stale snapshot silently reverts
whatever landed after its worktree was cut. The failure is quiet: the build
succeeds, the diff looks right, and the loss only surfaces when someone notices
an earlier edit has come undone. Integrating such a build is worse still —
copying its files over the working tree **overwrites hand-edits made since**, so
check for those before copying, and re-apply them after.

## 5. One commit per feature, explicit pathspec

Stage the exact paths that belong to the feature. **Never `git add .` / `-A`** —
these repos routinely carry a second feature's uncommitted work, a checklist
scratch file, and dev-server churn (rule 7) in the same tree, and a blanket add
sweeps all of it into one unreviewable commit.

Nothing is committed before the user's manual test passes.

## 6. Tiny-fix fast path

A tiny **cosmetic** change — one or two files, no new behaviour, no plan file —
is done by Main directly: propose → user approves → edit → commit. Anything
larger (new behaviour, several files, anything touching data or permissions)
takes the full plan → implement → audit → gate route.

## 7. Dev servers rewrite files — never commit their churn

A running Next.js dev server rewrites `next-env.d.ts`, so it shows as
perpetually modified. An emulator launcher may also rewrite `tsconfig.json`
(adding its own build-output globs). **Discard both rather than committing the
dev flavour** — committing them makes every other machine's dev server produce a
diff on checkout.

```
git checkout -- next-env.d.ts tsconfig.json
```

## 8. Only name gates that exist

Before a project's `CLAUDE.md` tells build agents to run a command, confirm the
script is actually in its `package.json`. A documented gate that errors out is
worse than no gate: the agent must decide on its own whether to ignore the
failure, so quality depends on that agent's judgement instead of a rule. Where a
project has no linter, say so plainly and name what it *does* run (typically
`npm run build` plus `npx tsc --noEmit`).

## 9. Rollback recipe

When a deployed push breaks production:

1. **Stop the bleeding first** — Firebase Console → App Hosting → the backend →
   **Rollouts → roll back** to the last-good rollout. No rebuild, effective
   immediately.
2. **Then reconcile the repo** — `git revert <sha>` on the deploy branch and
   push, so the code matches what is now live.
3. If rules or functions were part of the bad release, redeploy their previous
   version too (step 1 does not touch them — see rule 3).

**Never `git reset --hard` and never force-push the deploy branch.** Both
rewrite shared history, and a revert leaves the record of what went wrong.

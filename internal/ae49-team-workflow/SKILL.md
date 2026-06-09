---
name: ae49-team-workflow
description: AE49-internal addendum to ae49-guidelines — the team's repo-specific workflow (shared-lib location and the commit-and-push automation). NOT for distribution. Use on AE49 team repos alongside ae49-guidelines.
license: MIT
---

# AE49 Team Workflow (internal — do not distribute)

> **Internal only.** This skill encodes AE49-team-specific automation, including a standing push authorization. It must **NOT** be copied to other users' machines. The shippable, environment-neutral rules live in [`ae49-guidelines`](../../skills/ae49-guidelines/SKILL.md).

Apply everything in [`ae49-guidelines`](../../skills/ae49-guidelines/SKILL.md), then layer these AE49 repo-specific additions on top.

## Shared-lib location (extends guidelines §3)

- For the AE49 PyRevit extension, the shared layer is `AE49.extension/lib/AE49lib/`. Check there first when reusing or extracting helpers.

## Commit and push (extends guidelines §7)

Guidelines §7 commits per logical change but does **not** push. On AE49 repos only, add the push step:

- After a completed, verified logical change, push to `origin main` using the `GH_TOKEN`-prefixed command in `CLAUDE.local.md` (standing pre-authorization for AE49 repos).
- This authorization is specific to AE49 repos and the team's `CLAUDE.local.md`. It does **not** transfer to any other repo or user — which is exactly why this skill stays out of the distributed `skills/` folder.
- Still pause before destructive git ops (force-push, `reset --hard`, etc.).

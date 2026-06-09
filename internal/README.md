# Internal skills — not for distribution

Skills in this folder are **AE49-team-internal** and must **not** be shipped to other users.

The distribution [Quickstart](../README.md#quickstart) copies only `skills/*` into `~/.claude/skills/`, so nothing here is installed by following the main README — that exclusion is the whole point. To use these on an AE49 team machine, copy `internal/*` into your skills directory as a separate, deliberate step.

| Skill | Why it's internal |
|-------|-------------------|
| **[ae49-team-workflow](./ae49-team-workflow/SKILL.md)** | Encodes an AE49 repo path (`AE49.extension/lib/AE49lib/`) and a standing push-to-`origin main` authorization via `CLAUDE.local.md` / `GH_TOKEN`. Safe on AE49 repos; unsafe on anyone else's. Layers on top of the shippable [`ae49-guidelines`](../skills/ae49-guidelines/SKILL.md). |

---
name: ae49-task-setup-git-memory
description: Set up GIT-SYNCED, per-person Claude memory inside a project repo — .claude/memory/shared/ (team truths) + .claude/memory/<person>/ (working style), a router MEMORY.md with a git-user → folder mapping table, and the CLAUDE.md rule that makes every session read/write it. Use when the user wants project memory shared across machines or team members, says "set up git memory", "sync memory via git", "memory in the repo", or a second machine/teammate has appeared and local harness memory is splitting.
---

# Set up git-synced per-person project memory

Harness memory is per-machine: `~/.claude/projects/<flattened-project-path>/memory/`
is loaded automatically but never travels. The moment a project lives on two
machines (or two people), lessons split-brain. This skill moves project memory
INTO the repo so it rides every push/pull — structured per person from day one
(user ruling 2026-08-04: keep the team structure even for a single user, so a
future teammate changes nothing).

## Target structure

```
.claude/memory/
  MEMORY.md     ← router: explains the structure + the mapping table below
  shared/       ← team truths: project facts, conventions, hard-won lessons
    MEMORY.md   ←   its own index (avoids index collisions between people)
    <fact>.md
  <person>/     ← ONE folder per person: working style + in-flight context
    MEMORY.md
    <fact>.md
```

Router `MEMORY.md` carries a mapping table:

```
| git user.name | folder      | person |
|---------------|-------------|--------|
| <git-name>    | `<person>/` | <who>  |
```

New teammate = one table row + one folder. Nothing else changes.

## Steps

1. **Create the folders** in the repo: `.claude/memory/shared/` and
   `.claude/memory/<person>/` for the current user (short, stable folder name —
   e.g. their machine username).
2. **Migrate the harness-local memories** (if any): copy every fact file from
   the local harness folder into the repo, then classify **by MEANING, not by
   the recorded frontmatter type** — a fact the user taught is still a TEAM
   truth if it binds any driver (deploy orderings, repo conventions, domain
   rules → `shared/`); only genuine working-style preferences (how to propose,
   report formats, language) go to `<person>/`. Drop stale in-flight notes
   instead of migrating them.
3. **Write the three indexes**: router (structure + mapping table),
   `shared/MEMORY.md`, `<person>/MEMORY.md` — same one-line-per-fact format as
   harness memory.
4. **Add the CLAUDE.md rule** (project CLAUDE.md, near the top):
   - At session start read `shared/MEMORY.md`, identify the driver via
     `git config user.name` + the mapping table, read that folder's index too.
   - Saving: shared truth → `shared/`; personal style → the driver's folder;
     always update that folder's index. Commit with the next landing or its own
     `docs(memory):` commit. Never write project facts to the machine-local
     harness folder again.
   - After a `git pull`, re-read the indexes if `.claude/memory/` changed.
5. **Reduce the machine-local harness folder to a pointer**: its `MEMORY.md`
   keeps ONE entry pointing at the repo memory; keep only machine-specific
   facts there (installed tools, local paths, this-machine quirks). Delete the
   migrated copies so recall can't drift.
6. **Commit** everything (`feat(memory): git-synced project memory …`) and
   remind the user other machines get it on their next `git pull`.

## Rules and caveats

- **Privacy boundary:** repo memory is as visible as the repo. Personal
  *preferences* are fine; anything sensitive about a person never goes in.
- **The honest limitation:** the harness auto-loads only the LOCAL index — repo
  memory works because CLAUDE.md instructs every session to read it. That
  instruction is auto-injected, so in practice it behaves the same; do not also
  duplicate facts locally "just in case" (drift).
- **Peeking:** a session may read another person's folder only to explain a
  conflict between rules, never to apply that person's style to the driver.
- Classification disputes default to `shared/` — a wrongly-shared style rule is
  visible and cheap to demote; a wrongly-personal team truth silently hides
  from teammates.

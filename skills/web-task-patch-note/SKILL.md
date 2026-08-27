---
name: web-task-patch-note
description: >-
  The shared patch-note / release-note publishing workflow for every hub
  project (AE49_Hub, Nuri_Hub, and future siblings): gather the git changelog
  since the last note, draft a plain-language staff-facing change list in the
  StructuredText body grammar, pick the version bump, dry-run, and publish to
  Firestore only after the user confirms — notifying all active users. Use
  whenever the user wants to write, draft, publish, or release a patch note /
  release note / changelog entry in ANY hub project, alongside that project's
  own patch-note skill, which supplies the facts: script path, author email,
  version casing, notification reach, in-app-form policy, and deploy-rule
  pointer. The PROCESS lives here and changes here once; project skills never
  restate it. Publishing a note never deploys code.
---

# Publish a patch note — shared workflow

Drafts and publishes a release note into the project's `patchNotes` Firestore
collection, doing exactly what the app's **New patch note** form does — the
`patchNotes` doc **plus** the `activityLogs` entry **plus** the
`patch_note_published` notification fan-out to every active user except the
author. The note shows on the app's patch-notes page and rings the bell.

**The project skill supplies the FACTS** (read it together with this canon):
the publish script's path, the fixed author email (and any role constraint on
it), the version label's exact prefix/casing, the notification's reach (bell
only? LINE? email?), whether the in-app form is still an allowed manual path,
the app's nav-area names for body sections, and where the project's deploy
rule lives. When this canon says "per the project skill", that is the file it
means.

**This skill never deploys.** Publishing the note is an in-app announcement;
shipping code is the project's own deploy rule (its `CLAUDE.md`), a separate
manual step that always needs the user's explicit go-ahead.

## Node on PATH

Commands below use plain `node`. If a run reports `node: command not found`
(PowerShell sessions don't always have Node on PATH), prefix once with:

```
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Run from the project's checkout root — resolve it from the current working
tree, never from a hardcoded path (machines differ). The script reads the
Firebase service-account key from `.env.local` — it must exist.

## Flow

1. **Read the current version + the previous release's commit.**
   ```
   node <script> --latest
   ```
   Note the `version=` line and keep its **exact prefix and casing** (each
   project's convention differs — e.g. `V1.3` vs `v2.1`; the bump in step 4
   preserves it). Note the `commitHash=` line — the **Git No.** the previous
   note was published from; it is the default changelog base
   (`<commitHash>..<this note's Git No.>`). If `commitHash=` is empty or "No
   patch notes published yet", there is no anchor — ask the user for a base.

2. **Confirm the base + this note's Git No. The author is fixed — don't ask.**
   - **Base commit or range** — default to step 1's `commitHash=`. Show it for
     confirmation; the user may override with another SHA/tag/`HEAD~10`.
   - **This note's Git No. (REQUIRED — ask the user; do NOT auto-use HEAD).**
     It is BOTH the end of the changelog range AND the `commitHash` stamped on
     the note (what the NEXT note diffs from). Suggest a sensible default —
     usually the last *feature* commit, not HEAD when trivial commits sit on
     top — but the user's choice wins. Pass it as `--commit <hash>` in steps
     5–6.
   - **Release date = that Git No.'s commit date, NOT today:**
     `git show -s --format=%cs <hash>` (`%cs` = `YYYY-MM-DD`).
   - **Author email** — fixed per the project skill (it is the `users` lookup
     for the author, the log actor, and the one person excluded from the
     fan-out). Never ask; only an explicitly named different publisher
     overrides it.

3. **Gather the commits.**
   ```
   git log <base>..<this note's Git No.> --pretty=format:"%h %s"
   ```
   Read subjects (and bodies/diffs when unclear) to understand what actually
   shipped for users.

4. **Draft the note.**
   - **Change list (`body`)** — plain-language, staff-facing: what changed in
     the app, for the team. NOT raw commit subjects, NOT jargon (no file
     names, no "refactor"). Group related commits into one bullet; drop
     purely-internal commits with no user-visible effect. **Format per
     [body-format.md](body-format.md)** — section headings by app area
     (names per the project skill), `- ` bullets under each, headline feature
     first. A plain line with no `- ` renders as a bold heading.
   - **Title** — a short headline for the release.
   - **`releaseDate`** — the Git No.'s commit date from step 2.
   - **Version bump** — propose with a one-line reason: **minor** (default)
     bumps `x.y → x.(y+1)`; **major** (big/breaking) bumps `x.y → (x+1).0`.
     Keep the project's exact prefix/casing.

5. **Write the draft + dry-run.** Draft JSON at `scripts/patch-note-draft.json`
   (`version`, `title`, `body`, `releaseDate`, `authorEmail` — **no commit
   field**; the Git No. goes on the command line only):
   ```
   node <script> --draft scripts/patch-note-draft.json --commit <hash>
   ```
   Confirm the preview's `commitHash (Git No.):` matches the user's choice.
   Show the user the preview — version, title, body, **recipient count** —
   and get an explicit yes on the bump, the version, and the content. Fix and
   re-dry-run as often as needed. Never proceed without the yes.

6. **Publish (only after confirmation).** Same `--commit`, plus `--apply`:
   ```
   node <script> --draft scripts/patch-note-draft.json --commit <hash> --apply
   ```
   Report an emoji-tagged confirmation per `ae49-ref-report-format` style —
   `🚀 Published <version> — <title>` and `📣 Notified <N> staff` — then
   delete the draft file (`rm scripts/patch-note-draft.json`; gitignored, but
   no stale draft may linger).

## Notes

- **One publish path per note.** Each note is created exactly once. This
  skill's path is the CLI script; whether the in-app form remains an allowed
  *manual* alternative is a project fact — but never both for the same note
  (each fans out its own notification).
- The script is read-only with `--latest` and `--draft`; the only write path
  is `--apply`. When unsure, dry-run.
- **Git No. is user-chosen** — the script defaults to `git rev-parse HEAD`,
  which is often wrong (trivial commits on top of the real release). The
  chosen hash is the changelog end, the `releaseDate` source, the stamp on
  the note, and the anchor the next run reads back.
- Notification reach (bell only / LINE / email) is a project fact — state it
  when previewing so the user knows who gets pinged and how.

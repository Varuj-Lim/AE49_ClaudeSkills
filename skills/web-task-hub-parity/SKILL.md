---
name: web-task-hub-parity
description: Compare THIS hub's shared pages (Home, Notifications, Employees, Support, Settings, sign-in pages, the shell) with AE49_Hub - the reference hub - and with the user skills, then walk every difference to an owner ruling - this hub follows AE49, the skill changes, AE49 changes, or it stays different on purpose. Reads only this hub, AE49 on GitHub and the user skills. Use on /web-task-hub-parity, เทียบกับ AE49, ทำให้เหมือน AE49 Hub, Hub นี้ต่างจาก AE49 ตรงไหน, ให้ consistent กัน, ไล่เคาะทีละข้อ.
---

# web-task-hub-parity — keep this hub's shared pages equal to AE49_Hub

**Owner ruling 2026-11-04** (AWDC_Hub session, Q1–Q8; it replaces `ae49-task-compare-conventions`, whose ruling-walk
format lives on in step 4). The ledger it reads and writes is `web-ref-hub-parity` — read its `SKILL.md` first.

## Reading boundary

- **This hub** (the working directory) — read freely.
- **AE49_Hub** — from **GitHub `main` only** (`Varuj-Lim/AE49_Hub`, read with `gh`), never the local AE49 folder: it
  may hold unpushed work, and no `git` command runs against another hub's checkout (user `CLAUDE.md`, one session one
  project). Pin ONE commit for the whole run.
- **User skills** — `~/.claude/skills/`.
- **No other hub, ever** — not CCP, not NURI, not to "check how they did it".
- **Run in AE49_Hub's own session:** AE49 is compared with the skills only; there is no hub column to fill. Follow
  § "Run in AE49_Hub" below instead of steps 1, 2 and 5.

## Run in AE49_Hub (owner 2026-11-04)

The reference hub has no hub to follow, so its run checks AE49 against the user skills only:
- **Step 1 — no snapshot.** Read AE49's own working tree (its committed `main`); nothing comes from GitHub.
- **Step 2 — baseline = a skills-repo commit.** AE49's row in `divergences.md` § Baselines holds the AE49_ClaudeSkills
  commit its last run ruled up to. No baseline → a FULL scan of `pages.md` against every canon those pages follow;
  a baseline → only the skills-repo commits since it on those canons, plus AE49's own commits on the `pages.md`
  paths since the baseline date (`git log`).
- **Steps 3–4 as written**, with one difference: every difference is "AE49 vs the skill", and the options are only
  **AE49 follows the skill** or **the skill changes to match AE49** (layered allowed). No "keeps different" row: a
  rule AE49 breaks on purpose is a skill change.
- **Step 5 — close-out:** AE49 follows → a plan in AE49 through its normal flow, and each landing logs a
  `changelog.md` row (`web-ref-deploy-landing` §5a) so the other hubs pick it up; the skill changes → edit, mirror,
  commit, push now. No handoff prompt. Then write today's date and the skills-repo commit into AE49's baseline row.

## Steps

1. **Pin AE49 and fetch a snapshot.** `gh api repos/Varuj-Lim/AE49_Hub/commits/main --jq .sha` → `<pin>`. Download
   `gh api repos/Varuj-Lim/AE49_Hub/tarball/<pin>` into a NEW folder under the session scratchpad and extract it there;
   the snapshot is read-only evidence and is never built or run.
2. **Decide what to compare** from this hub's baseline in `divergences.md`:
   - **No baseline (first run)** → a FULL scan of every page in `pages.md`.
   - **A baseline** → only: (a) the `changelog.md` rows after it; (b) **the safety net** — for each AE49 path in
     `pages.md`, `gh api "repos/Varuj-Lim/AE49_Hub/commits?sha=<pin>&since=<baseline date>&path=<path>"`; every commit
     found that has no changelog row joins the list, and gets a row now, marked `(safety net, <hub> <date>)`;
     (c) this hub's own commits on its matching paths since the baseline (`git log`), since a hub drifts too;
     (d) the skills-repo commits since the baseline date on the canons those pages follow.
   Say in one line which it is and how many changes are in the list.
3. **Scan — delegate.** A first run dispatches read-only agents (`ae49-explore` for locating, a general agent for the
   comparison), one per `pages.md` group, in parallel; a short list may be done by Main. Each difference comes back with
   `file:line` on BOTH sides (the snapshot and this hub) and, when a skill rules it, the skill line. Classify:
   - **Expected** — it matches a `divergences.md` row or a fact in this hub's `CLAUDE.md` / `<hub>-ref-*` skills →
     listed in the report, never asked.
   - **Already ruled** — an earlier run's ruling covers it → listed, never asked.
   - **Open** → an item `P1, P2, …`. A difference with no quotable line on both sides is an impression: no item.
   Save the scan to `docs/specs/hub-parity/<YYYY-MM-DD>.md` in this hub (commit it with the close-out; it is the evidence).
   Check what only a screen shows (spacing, wrapping, a popup's look) on both emulators only for the items whose code
   reading stays unclear; the owner starts AE49's emulator when asked.
4. **The ruling walk** — up to 10 items per message, each in `ae49-ref-question-format` shape, numbered `Pn/total`,
   with these parts inside the context block:
   - **AE49 / this hub / the skill** — what each shows or does, concretely: a tiny ASCII mock, the label, a 3-line
     snippet. Never adjectives alone.
   - **Why they differ** — the real cause (a later AE49 feature, a ruling made in one hub, plain drift). Naming it is
     what lets the owner choose.
   - **Objective or taste** — a side that prevents a real bug says so out loud and is recommended; a taste difference
     says forcing it buys nothing.
   The options are drawn from these kinds (letters per `ae49-ref-question-format`: the recommendation is (a)):
   - **This hub follows AE49** — the default end state.
   - **The skill changes to match AE49** — then this hub follows, if it differs too.
   - **AE49 changes to match the skill** — this hub follows the skill.
   - **AE49 adopts this hub's way** — the hub keeps it; AE49 changes.
   - **Stays different on purpose** — a row in `divergences.md`.
   Layered rulings are allowed ("AE49 wins the behavior, the label stays this hub's").
   **Many items → group by cause (run 1, 2026-11-04: 94 items became P1–P10).** Items with one cause and one likely
   ruling share ONE question whose context names every item ID (e.g. "the shared parts AE49 added after the clone").
   A pile of small taste items the owner wants to see one by one goes on the hub's gate page instead
   (`ae49-ref-gate-checklist` format, one item per difference, "tick = follow AE49, no tick = keep and record"); the
   ticks live in the owner's browser, so the owner replies with the ticked numbers ("① 3, ③ 2" or "ไม่ติ๊กเลย").
5. **Close out — the same session, before anything else.** Rulings that live only in chat are lost.
   - **This hub follows** → one plan `docs/plans/hub-parity-<YYYY-MM-DD>.md` holding every such item, through the
     normal `ae49-router` flow (plan → build → audit → gate → land).
   - **A skill changes** → edit it now, in any hub's session, then mirror, commit and push the skills repo.
   - **AE49 changes** → in AE49's own session: plan it there. In any other session: ONE handoff prompt per
     `web-task-handoff-prompt`, never an edit to AE49.
   - **Stays different** → a `divergences.md` row (or this hub's cell in an existing row) citing `<hub> <date> Pn`.
   - **Baseline** → this hub's row in `divergences.md`: today's date and `<pin>`. Mirror and push the ledger.
   - **Memory** → one line in this hub's in-flight memory: the run's date, `<pin>`, the plan and the handoff.

## Report

Per `ae49-ref-report-format`: an English table `# | Page | Difference | Kind | Ruling` (Kind = Expected / Already ruled
/ Open), the open items' questions, then the 👤 and 🤖 lines.

## Don'ts

- Don't read another hub than this one and AE49, and don't read AE49 from its local folder.
- Don't ask an Expected or Already-ruled difference again.
- Don't offer an option without its cost (files, a plan, a handoff, the owner's hands).
- Don't move the baseline while an item up to the pin is unruled.

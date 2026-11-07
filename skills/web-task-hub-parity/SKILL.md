---
name: web-task-hub-parity
description: "Compare THIS hub's shared pages (Home, Notifications, Employees, Support, Settings, sign-in, the shell) with AE49_Hub and the user skills, then walk each difference to an owner ruling. In AE49_Hub it runs the family comparison (NURI, CCP, AWDC). Use on /web-task-hub-parity, เทียบกับ AE49, ทำให้เหมือน AE49 Hub, Hub นี้ต่างจาก AE49 ตรงไหน."
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
- **No other hub, ever** — not CCP, not NURI, not to "check how they did it". **The one exception is AE49's own run**
  (below): the parent hub reads its child hubs, from GitHub only, the same way a child reads AE49.
- **Run in AE49_Hub's own session:** follow § "Run in AE49_Hub — the family run" instead of the steps below.

## Run in AE49_Hub — the family run (owner 2026-11-05, replacing the skills-only run of 2026-11-04)

AE49 is the parent hub; NURI_Hub, CCP_Hub and AWDC_Hub are its children. AE49's run compares **AE49 with every child
AND with the user skills**, and for each difference proposes the BEST version, whichever hub or skill it lives in
today — not only "follow AE49".

**What "best" means (owner 2026-11-05)** — the recommended option (a) is the version that, in this order:
1. **is easiest for staff to use** — the clearest UI / UX, the fewest clicks, the plainest words;
2. **is least complex** — fewer moving parts, less code, fewer special cases;
3. **runs fastest** — fewer reads, faster page, no extra round trips;
4. **costs least to reach** — the fewest hubs and files to change to get every hub onto it.
A higher criterion wins over a lower one; the question says which criterion decided it and why, in one line. A side
that prevents a real bug wins over all four and says so.

- **Step 1 — pin and snapshot every child.** AE49 is read from its own working tree (committed `main`). Each child is
  read from **GitHub `main` only** (`Varuj-Lim/NURI_Hub`, `Varuj-Lim/CCP_Hub`, `Varuj-Lim/AWDC_Hub`): pin ONE commit
  per child and extract its tarball into a NEW scratchpad folder, exactly as step 1 below — never the child's local
  folder, never a `git` command there (a sibling session may be working in it).
- **Step 2 — the family baseline.** AE49's row in `divergences.md` § Baselines holds the date of its last family run,
  the skills-repo commit and each child's pin (`NURI <sha> · CCP <sha> · AWDC <sha>`). No family baseline → a FULL scan
  of `pages.md` across all four hubs and the canons those pages follow. A baseline → only: AE49's commits on the
  `pages.md` paths since its date (`git log`), each child's commits on its matching paths since that child's pin
  (`gh api …/commits?sha=<pin>&since=…&path=…`), and the skills-repo commits since it on those canons.
- **Step 3 — scan, one agent per child.** Dispatch three read-only agents in parallel, one per child, each comparing
  AE49 ⇄ that child ⇄ the skills over the `pages.md` groups, every difference with `file:line` on each side. Main
  merges them into ONE table keyed by topic with one column per hub (AE49 · NURI · CCP · AWDC · skill), so a topic where
  two children already agree is one item, not two. Classify as in step 3 below (Expected / Already ruled / Open);
  each child's own earlier rulings (its rows in `divergences.md`, its scan files in the snapshot) count as ruled.
- **Step 4 — the ruling walk** as in step 4 below, with every hub shown side by side (the ASCII mock / label / snippet
  of each), the cause of each difference, and the options drawn from:
  - **Every hub follows AE49** (the skill states it if it does not yet);
  - **Every hub follows <child>'s way** — AE49 adopts it too, the skill is updated to it;
  - **The skill's way** — the hubs that differ from the skill follow it;
  - **Stays different on purpose** — a `divergences.md` cell per hub that keeps its own.
  Layered rulings allowed. The (a) option is the best one by the four criteria above, with the criterion named.
- **Step 5 — close-out, the same session.**
  - **AE49 changes** → one plan in AE49 (`docs/plans/hub-parity-family-<YYYY-MM-DD>.md`) through the normal flow;
    each landing logs a `changelog.md` row (`web-ref-deploy-landing` §5a).
  - **A skill changes** → edit, mirror, commit and push now.
  - **A child changes** → ONE handoff prompt per child (`web-task-handoff-prompt`) holding all of that child's items,
    each citing the ruling (`AE49 <date> Pn`) and the AE49 / skill source to copy from — never an edit in the child.
  - **Stays different** → the `divergences.md` cells.
  - **The evidence** → the merged scan with every ruling in `docs/specs/hub-parity/family-<YYYY-MM-DD>.md` in AE49,
    committed. A child's own later run reads it from its AE49 snapshot and treats those rulings as Already ruled.
  - **Baselines** → AE49's row only (date, skills commit, the three child pins). A child's row moves only in that
    child's own run, after it has built its handoff.

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

- Don't read another hub than this one and AE49 (AE49's family run reads its children, from GitHub), and don't read
  any other hub from its local folder.
- Don't ask an Expected or Already-ruled difference again.
- Don't offer an option without its cost (files, a plan, a handoff, the owner's hands).
- Don't move the baseline while an item up to the pin is unruled.

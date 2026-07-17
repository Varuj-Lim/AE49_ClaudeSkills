# Session setup + checklists

Step-by-step setup for each of the five sessions, each ending in a checklist. Open only
the windows you need. Main Setup (session 3) and Main Merge (session 5) are two windows
on the same hub folder — see the split rules under session 5.

Placeholders: `<hub>` = your project's main repo folder, on the default branch (a dev
port, e.g. `:3000`); `<hub>-buildN` = pool folder N (its own port, e.g. `:3001`–`:3004`);
`<slug>` = a plan's filename in `docs/plans/` without `.md`.

---

## 1. Refine Prompt session

**What it does.** Turns a rough or mixed-language idea into ONE clean English prompt you
then paste into a Plan / Build / Main session. While on, it ONLY rewrites — it never
answers or runs the task. On/off mode.

**Skill.** `/ae49-ref-prompt-refine`

**Setup.**
1. Open any Claude Code window (it doesn't touch code — folder doesn't matter).
2. Switch the session to **Haiku** model, **medium** effort, **manual** mode. It won't
   proceed until you confirm these — refining is cheap work that must run small.
3. Run `/ae49-ref-prompt-refine`. It confirms the setup, then replies `Prompt Refine ON.`
4. Type your rough idea. It returns one improved prompt in a code block — copy it.
5. Say `stop` (or `normal mode`) to turn it off when done.

**✅ Checklist — Refine Prompt**
- [ ] Session is on **Haiku** · **medium** effort · **manual** mode.
- [ ] `/ae49-ref-prompt-refine` replied `Prompt Refine ON.`
- [ ] Typing an idea returns a rewritten prompt in a code block (no answer, no action).

---

## 2. Plan session

**What it does.** Designs one feature: grills the design with an interview, then writes
`docs/plans/<slug>.md` (Status `Ready`) and pushes it. Docs only, so **many Plan
sessions run in parallel safely.**

**Skill.** `/ae49-task-plan-feature`

**Setup.**
1. Open a Claude Code window in the **hub folder**, on the default branch.
2. Put it in **plan mode**: launch `claude --permission-mode plan`, or press
   Shift+Tab → "plan mode". (Keeps planning read-only until you approve.)
3. Run `/ae49-task-plan-feature`. Give the feature (or paste a refined prompt).
4. Answer the grilling until the design settles; approve on the ExitPlanMode screen.
5. It writes the plan, wires build-order links, commits + pushes.

**Caveat.** If a merge is mid-flight, the hub is temporarily on `_merge_preview`; the
skill detects this and **holds the commit** until the hub is back on the default branch.
Don't `git checkout` the hub yourself.

**✅ Checklist — Plan**
- [ ] Window is in the **hub folder** on the default branch, in **plan mode**.
- [ ] `/ae49-task-plan-feature` ran the grill and you approved the plan.
- [ ] A new `docs/plans/<slug>.md` exists with **Status: Ready**, committed + pushed.
- [ ] (Running several) each Plan window is a **separate feature** — fine in parallel.

---

## 3. Main Setup session

**What it does.** Assigns a Ready plan to a **free build folder**: claims the folder,
syncs it to the default branch, creates + publishes the feature branch, then hands off
to a Build session. **Setup only — it never merges.** Also runs the one-time pool
creation (`init`).

**Skill.** `/ae49-task-integrate setup [<slug>]` (and once, `/ae49-task-integrate init`)

**Setup.**
1. Open a Claude Code window in the **hub folder**, on the default branch.
2. First time only: run `/ae49-task-integrate init` to create the build-folder pool.
3. Run `/ae49-task-integrate setup`. With no slug it shows a plan-status summary and
   offers the Ready plans as buttons; pick one (or run `setup <slug>`).
4. It claims a free folder, branches it off the remote default branch, publishes the
   branch, and tells you which **buildN** window to open for the Build session (session 4).

This is safe to run alongside a live merge preview: `setup` never commits to or switches
the hub's branch. Keep it to `setup`/`init` only.

**✅ Checklist — Main Setup**
- [ ] Window is in the **hub folder** on the default branch.
- [ ] (Once) `/ae49-task-integrate init` created the build-folder pool.
- [ ] `/ae49-task-integrate setup <slug>` put a free folder on `feature/<slug>` and
  published the branch.
- [ ] It named the **buildN folder + port** to hand to the Build session.
- [ ] This window runs **only** `setup`/`init` — never `merge`, never a hub commit.

---

## 4. Build session

**What it does.** Builds ONE plan in a build folder and ends in a PR. Runs the plan's
steps, runs the automated checks, pushes the branch, opens the PR. **Never touches the
default branch or the plan file** (those belong to the hub). Up to the pool size run at
once — one per folder.

**Skill.** `/ae49-task-implement-feature`

**Setup.** A Build session comes AFTER a **Main Setup** session (session 3) has put a
build folder on the feature branch. Then:
1. Open a Claude Code window in the **assigned build folder** (`<hub>-buildN`) — it is
   already on `feature/<slug>` (or `bugfix/…` / `refactor/…`).
2. Start its dev server with the folder's dev-server script (**`.\dev.cmd`**, which
   carries the folder's port) — never bare `npm run dev`.
3. Run `/ae49-task-implement-feature`. It detects the branch (PR flow), shows the
   pre-bound plan for a quick confirm, and builds it.
4. It pushes each commit and opens the PR. Note the **PR number** for the merge session.

**Do NOT** open a Build session on an idle build folder that's still on the default
branch — the skill stops you (that would deploy straight to production). Run Main Setup
first.

**✅ Checklist — Build**
- [ ] Window is in a **build folder** (`<hub>-buildN`), already on a `feature/…` branch
  (not the default branch).
- [ ] Dev server started with the folder's script (**`.\dev.cmd`**), reachable on its port.
- [ ] `/ae49-task-implement-feature` picked the **pre-bound plan** for this branch.
- [ ] Build finished → branch pushed → **PR opened**; you have the PR number.

---

## 5. Main Merge session

**What it does.** Lands finished PRs and deploys. For one PR: checks CI, runs a code
review, previews the squashed result on the hub's **dev port** locally, and only after
you confirm does the real squash-merge (which deploys) and archives the plan. Also owns
the status **`board`** and **`abandon`**.

**Skill.** `/ae49-task-integrate merge <PR#>` (plus `board`, `abandon`)

**Setup.**
1. Open a Claude Code window in the **hub folder**, on the default branch, and start the
   hub dev server on its port.
2. Run `/ae49-task-integrate board` to see the pool, plans, and open PRs.
3. Run `/ae49-task-integrate merge <PR#>`. It checks CI + reviews, then parks the hub on
   `_merge_preview` and asks you to check the live preview.
4. Eyeball the live app. Only when you confirm does it deploy and archive the plan. If
   something's wrong, nothing deployed — fix-forward or `abandon`.

**Split rules (Setup vs Merge windows).**
- **Exactly one** window ever runs `merge` — this one. Two at once corrupts the gate.
- Keep **`board`** and **`abandon`** in THIS (Merge) window — their doctor pass would
  offer to reset the hub off `_merge_preview` and kill a live preview.
- While a merge preview is parked, **do not commit in the hub** from any window (Plan /
  Setup included).

**✅ Checklist — Main Merge**
- [ ] Window is in the **hub folder** on the default branch, hub dev server running.
- [ ] This is the **only** session that runs `merge`.
- [ ] `merge <PR#>` reached the local preview and **waited for your confirmation** before
  deploying.
- [ ] After landing, the plan moved to `docs/plans/done/` and the live app is healthy.

---

## Master checklist — whole team wired

Run through this once the windows are open, to confirm the team won't collide:

- [ ] **One-time:** GitHub remote + `gh` signed in; CI runs on PRs; build pool
  `<hub>-buildN` created via `init`.
- [ ] **Refine Prompt** (if used): Haiku · medium · manual; `Prompt Refine ON.`
- [ ] **Plan** windows: all in the hub on the default branch, plan mode; each on a
  **different** feature.
- [ ] **Main Setup**: hub on the default branch; runs only `setup`/`init`.
- [ ] **Build** windows: each in a distinct **buildN** folder on its own `feature/…`
  branch, dev server via its script (`.\dev.cmd`).
- [ ] **Main Merge**: **exactly one** window; hub on the default branch, dev server
  running; owns `board` + `abandon`.
- [ ] No two windows share a build folder; no Plan/Setup commit lands in the hub while a
  merge preview is parked on `_merge_preview`.

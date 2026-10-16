**Scope (part of ae49-ref-gate-checklist, added 2026-10-16):** Main-run gates handed to `ae49-gate` sub-agents, several at once, with Main keeping the verdict.

# Delegated gates (owner AQ1 a, 2026-10-16)

**Why:** builders and auditors already ran in parallel, so the gate queue became the slowest step. Every gate went through Main in one Chrome, 20–35 min each. On 2026-10-16, rd-row-actions B2/B3/B4 were all built at once and then queued about 40–70 min for gates. The owner on cost: *"ถ้าเทียบเป็นต่องานก็ไม่ได้เพิ่มขึ้น"*. That is right: per task, the only extra is the agent's cold start, plus a re-gate when a MAJOR lands mid-gate.

## Where it applies
Delegation covers only **Main-run gates**: autopilot (`ae49-mode-autopilot`, the Main-run gate) and items the owner has left to Main (`waived.md`). The owner's own gate on the page is unchanged.

## The split
- **Main** decides which items run and gives each agent:
  - a port;
  - a `testBatch` tag;
  - the sets it may use;
  - a scratch dir.
- **Main** reads the evidence and screenshots and decides each item. Main spot-checks **at least one item per section** in its own Chrome on 9333. That is always required until plan `ae49-gate-agent` items 3–5 have passed, and after that whenever a reading looks off.
- **Wording:** the landing note says "run by ae49-gate :<port>, verdict Main". The log line keeps `(M Main-verified)`. The closed line's grammar is unchanged (`closed-format.md`).
- **`ae49-gate`** (`~/.claude/agents/ae49-gate.md`) runs one section in its own headless Chrome and returns per-item evidence: PASS / FAIL / CANNOT-VERIFY. It never decides the gate.

## When gates may run at once
- **One server:** everything being gated must be in the hub tree, because the emulator app is one server. Only batches whose changed files are disjoint may be gated at once. A shared strings file (router chain rule 4) is merged into the tree first.
- **No merge or fold under a running gate.** While a gate agent runs, Main merges no other batch and folds nothing into the hub tree, because :3001 would hot-reload under it. If a merge cannot wait, every item run before it is re-gated.
- **Ports:** one port per agent (9334, 9335 …). Main keeps 9333. Each agent stops only its own port, with `stop-port.ps1` called through `powershell -NoProfile -ExecutionPolicy Bypass -File`. Nobody ever kills Chrome by name.
- **Data:** each gate uses its own sets and its own `testBatch`. Data goes only through `gate-tools/emu-admin.cjs`, which refuses unless the host is 127.0.0.1, and is swept with `emu-sweep.cjs`. Never use a project script that reads `.env.local`.

## Gate during audit (Main-run gates only)
A Main-run gate may start as soon as the build is in the hub tree.
- A BLOCKER or MAJOR fold re-gates the items it touches.
- A MINOR fold is re-checked by Main.
- **The land still waits for both** the audit and the gate.

## What stays Main's
- Every CANNOT-VERIFY item: a visible pane or hover, Excel, a phone, the owner, production-only steps, colour judged by eye.
- The checklist drift fix.
- The page, the closed payload and the landing.

Tools: `resources/gate-tools/README.md`.

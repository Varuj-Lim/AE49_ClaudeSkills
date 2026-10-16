**Scope (part of ae49-ref-gate-checklist, added 2026-10-16):** Main runs gates through `ae49-gate` sub-agents, several at once. Main keeps the verdict.

# Delegated gates (owner AQ1 a, 2026-10-16)

**Why:** builders and auditors already run in parallel, so the gate queue became the slowest step. Every gate ran through Main in one Chrome, 20–35 min each. On 2026-10-16, rd-row-actions B2/B3/B4 were built at once and then queued about 40–70 min for gates. The owner on cost: *"ถ้าเทียบเป็นต่องานก็ไม่ได้เพิ่มขึ้น"*. That is right. Per task, the only extra is the agent's cold start and a re-gate when a MAJOR lands mid-gate.

## The split
- **Main** writes the section on the page, and it must pass `validate-gate.cjs`. Main names the port, the testBatch tag and the sets the agent may use. Main reads the evidence and decides each item. The closed line still says **Main-verified**. Main spot-checks at least one item per section in its own Chrome on 9333 whenever an agent's reading looks off.
- **`ae49-gate`** (`~/.claude/agents/ae49-gate.md`) runs one section in its own headless Chrome and returns evidence for each item: PASS / FAIL / CANNOT-VERIFY. It never decides the gate.

## When gates may run at once
- Every batch being gated must be in the hub tree, because the emulator app is one server. Gate batches at the same time only when their changed files are disjoint. A shared strings file (router chain rule 4) is merged into the tree first.
- One port per agent: 9334, 9335 and so on. Main keeps 9333. Each agent stops only its own port (`gate-tools/stop-port.ps1`).
- Each gate uses its own sets or records and its own `testBatch`. Two gates never open the same record.

## Gate during audit
Main may dispatch the gate as soon as the build is in the hub tree, without waiting for the audit.
- A BLOCKER or MAJOR fold is re-gated, but only on the items that fold touches.
- A MINOR fold is re-checked by Main.
- **The land still waits for both a passed audit and a passed gate.**

## What stays Main's
- Every CANNOT-VERIFY item. That covers a visible pane, Excel, a phone, the owner, production-only steps, and colour judged by eye.
- The checklist drift correction.
- The page, the closed payload and the landing.

Tools: `resources/gate-tools/README.md`.

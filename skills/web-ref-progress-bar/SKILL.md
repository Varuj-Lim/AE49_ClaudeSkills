---
name: web-ref-progress-bar
description: "Canon (web-ref-*) for any batch or loop: a live X of N progress bar from one shared component, bumped after each item including failures, always reaching 100 %, failures reported afterward, no spinner. Use for an import, bulk delete, mass update or many emails; แถบความคืบหน้า, นำเข้าไฟล์, ลบหลายรายการ, ค้างหรือเปล่า, progress bar."
---

# Progress bar

A loop over many records takes seconds. A spinner cannot tell progress from a hang, so the user sees a live count. Each hub keeps its component path and look in `<hub>-ref-progress-bar`; a rule changes here, once.

## The rule

An operation that processes a list shows the hub's one shared `ProgressBar`, reading **X of N**, driven by state bumped as each item finishes. Never a hand-built bar, and never only a spinner or a static `Loading…`.

```tsx
setProgress(0);
let done = 0;
for (const item of items) {
  try { await doOne(item); } catch { failed.push(item); }
  setProgress(++done);   // after each item, success or failure
}
```

- **Bump after every item, failures included,** so the bar always reaches 100 %. Counting only successes leaves it stuck and looking frozen.
- **Report failures afterward,** per `web-ref-toast`, never by stopping the bar.
- **Reset to 0** at the start of each run.
- **Each step awaits real work:** a tight loop with no `await` never repaints.
- **A chunked write bumps per committed chunk,** by the chunk's size. Never split a batch into per-row calls to satisfy the count.
- **A second pass counts:** add its rows to the total, so the bar neither freezes nor sits at 100 % while work runs.
- **The component** clamps value to total and shows 0 % when the total is 0, so a call site guards neither.

## Where it goes

Inside the confirm popup, beside its buttons, when the action started there; otherwise under the control that started it.

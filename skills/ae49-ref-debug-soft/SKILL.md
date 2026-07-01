---
name: ae49-ref-debug-soft
description: A simple 4-step habit for debugging — first make the bug happen again reliably, then find exactly where it breaks, then try to prove your best guess wrong before trusting it, then keep track of every test you've run so you don't repeat yourself. Say this discipline's short reminder out loud at the start of any debugging session, then follow the four steps in order before suggesting a fix. This is the everyday, lightweight version for normal bugs. Trigger on /ae49-ref-debug-soft and automatically whenever debugging starts — the user reports a bug, says something is broken/crashing/failing, asks you to debug/diagnose/investigate, or pastes an error message or stack trace. For tougher or on-and-off bugs that need a proper repeatable test setup, performance slowdowns, permanent regression tests, or a written post-mortem, switch to ae49-task-debug-hard instead.
---

# Debug Mantra (Debugging Reminder)

> *Adapted from [thananon/9arm-skills](https://github.com/thananon/9arm-skills) — original skill `debug-mantra`. Credit: [@thananon](https://github.com/thananon).*

Four simple habits for any debugging session. Say the reminder out loud, then follow the steps in order.

## Say this out loud — first thing in your first reply

> **Reminder:**
> 1. **Can we make it happen again?** Reliably, on demand.
> 2. **Find exactly where it breaks.** Step through it with a debugger first; if that's not possible, trace the code by hand and list everything that could be changing the outcome; only then add temporary log/print statements.
> 3. **Try to prove your best guess wrong.** What test would disprove it?
> 4. **Keep a trail.** Write down every test you run and what it told you.

Then start working.

---

## 1. Make it happen again, reliably

Before anything else, get a way to trigger the bug on demand.

- **You can trigger it every time** → write down the exact steps, inputs, and setup as something re-runnable: a failing test, a small script, a command, a replay of real data.
- **It only happens sometimes** → not debuggable yet. Make it happen more often first — run the trigger in a loop, run many copies at once, add load, narrow the timing window, add small delays. If it fails about half the time, you can debug it; if it only fails 1 time in 100, you can't yet.
- **You can't make it happen at all** → stop. Say so plainly. Ask for access to wherever it happens, saved evidence (browser network log, error log, crash file), or permission to add temporary logging. Do **not** start guessing at causes yet.

Aim for a quick (1–5 second) check that reliably tells you pass or fail. Freeze anything that changes on its own — the clock, random numbers, the network, files on disk.

## 2. Find exactly where it breaks

Once you can trigger it, find *where* the code goes wrong and *what's stopping it from going wrong*. Try these in order — only move to the next one if the current one doesn't work.

1. **Use a debugger.** If you can, attach one and step through to the exact spot it fails. One well-placed pause beats ten scattered log lines. Do this **before** changing any settings.
2. **Read the code path by hand, and list everything that could affect the outcome.** If a debugger isn't available (or can't reach the bug), trace the code from start to finish and list everything that might be changing the result:
   - settings, environment variables, feature switches
   - which branch of an if/else gets taken, what shape the input is
   - timing, multiple things happening at once, build settings
   Each one of these is something you can try changing, one at a time, to see if it affects the bug.
3. **Add temporary log/print statements.** If nothing outside the code can move the failure, go inside: add print or log statements at the spot you suspect, and print out what the relevant values actually are. Mark every one with a unique tag (e.g. `[DBG-a4f2]`) so you can find and delete them all with one search later. Let what you see show you where reality differs from what you expected.

## 3. Try to prove your best guess wrong

Once you have a candidate cause, question it **before** you trust it.

- Does it actually explain everything about the bug, start to finish? Walk through it step by step.
- What's the simplest way to **prove** it's right? What's the simplest way to **prove** it's wrong?
- Try the "prove it wrong" test first. If the guess survives that, it's probably real. If it fails, you just avoided wasting time on a wrong lead.
- Come up with 3–5 possible causes, ranked by likelihood — not just one. Fixating on the first idea that comes to mind is a common trap.

## 4. Keep a trail

Keep a running list of every test you try during this session: what you changed, what happened, and what it told you (ruled in or ruled out).

- Whenever a new guess comes up, check it against everything on that list — not just the most recent test.
- If any earlier test contradicts the new guess, the guess is wrong or incomplete — fix it or drop it.
- When unsure what to try next, design the ONE test whose result would settle things for certain, and run that — instead of running lots of similar, inconclusive tests.
- Add to the list after every test. It's your memory for the rest of the session.

---

## Ground rules

- Say the reminder **once** per debugging session, in your first reply. Don't repeat it partway through.
- Say it **word for word**. Don't shorten it, reword it, or skip any line.
- If the user says "skip the reminder" → skip saying it out loud, but still quietly follow the four steps.
- Follow the four steps **in this order**:
  - Don't suggest a fix before step 1 is done (you can trigger the bug reliably).
  - Don't start testing guesses before step 2 has narrowed down where it breaks.
  - Don't commit to a guess before step 3 has tried to disprove it.
  - Don't call a guess confirmed until step 4 checks it against everything you've seen so far.
- If you notice yourself suggesting a fix without being able to reliably trigger the bug, stop and go back to step 1.
- This discipline is something **you** follow through the session — not advice to just tell the user about.

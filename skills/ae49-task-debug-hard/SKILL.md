---
name: ae49-task-debug-hard
description: A careful step-by-step process for hard bugs — make it happen again → shrink it to the smallest case that still shows the bug → guess possible causes → test those guesses → fix it → add a test that locks the fix in place. Built around having a fast, repeatable way to check pass/fail, a lasting test that guards against the bug coming back, and a short write-up afterward. Use when the user explicitly says "diagnose this", describes a hard or on-and-off bug, a slowdown/performance problem, or a bug that came back after a first fix attempt. For everyday bugs, use the lighter ae49-ref-debug-soft instead (a short 4-step reminder); escalate here when that isn't enough. For turning the fix into a write-up for managers/leadership afterward, use ae49-task-management-talk.
---

> *Adapted from [mattpocock/skills — engineering/diagnose](https://github.com/mattpocock/skills/tree/main/skills/engineering/diagnose) by Matt Pocock ([MIT License](https://github.com/mattpocock/skills/blob/main/LICENSE)).*

# Diagnose

A careful process for hard bugs. Only skip a step when you have a clear, stated reason to.

Before diving in, get familiar with the relevant part of the codebase — check the project's glossary of terms and any design-decision documents for the area you're touching, so your mental model matches the codebase's own language.

## Step 1 — Build a fast, repeatable pass/fail check

**This is the important part. Everything after this is just mechanical.** If you have a quick, reliable, automatic way to check "did the bug happen or not," you will find the cause — narrowing down the cause, testing guesses, and adding debug output are all just ways of using that check repeatedly. Without one, staring at the code won't get you there.

Spend more time here than feels comfortable. **Be persistent and creative — don't give up on this step.**

### Ways to build one — try roughly in this order

1. **A failing test**, wherever in the code it can reach the bug — a small unit test, a broader integration test, or a full end-to-end test.
2. **A curl / HTTP script** run against a working copy of the app.
3. **A command-line run** with a known input, comparing the output against a known-good result.
4. **A browser automation script** (Playwright / Puppeteer) that drives the actual UI and checks the page, console, and network requests.
5. **Replay a real recorded case.** Save a real request, real data, or a real sequence of events to a file, then feed it back through the same code on its own.
6. **A throwaway mini version of the system** — just the one piece involved, with everything else faked out, that lets you trigger the bug with a single function call.
7. **Throw random inputs at it.** If the bug is "sometimes gives the wrong answer," run a thousand random inputs and watch for failures.
8. **Narrow it down by testing in-between versions.** If the bug appeared somewhere between two known points (an old commit, an old dataset, an old version), automate "load version X, check, repeat" so you can let a bisecting tool run it for you automatically.
9. **Compare old vs. new.** Run the exact same input through the old version and the new version (or two different settings) and diff the results.
10. **Walk a human through it, if nothing else works.** If a person has to physically click something, use the `scripts/hitl-loop.template.sh` script to guide them through it step by step in a structured way, and feed what they report back into your notes.

Building the right check here basically solves 90% of the bug.

### Keep improving the check itself

Once you have *a* check, ask:

- Can it run faster? (Skip setup you don't need, narrow what it actually tests.)
- Can it point more precisely at the actual symptom? (Check for the specific wrong behavior, not just "didn't crash.")
- Can it be more consistent? (Freeze the clock, fix random numbers, isolate from the network and filesystem.)

A shaky 30-second check that only sometimes works is barely better than nothing. A solid 2-second check you can trust is what actually lets you debug fast.

### If the bug only happens sometimes

Don't aim for a clean, always-reproduces case — aim to make it happen more OFTEN. Run the trigger over and over, run many at once, add load, narrow the timing window, add small delays. If it fails about half the time, it's debuggable; if it only fails 1 time in 100, keep working to raise that rate before continuing.

### If you truly can't build a check

Stop and say so plainly. List what you tried. Ask the user for one of: (a) access to somewhere the bug actually happens, (b) something they've already captured (a browser network log, an error log, a crash file, a screen recording with timestamps), or (c) permission to add temporary logging to the live system. Do **not** start guessing at causes without a way to check your guess.

Don't move to Step 2 until you have a check you actually trust.

## Step 2 — Make it happen

Run your check. Watch the bug show up.

Confirm:

- [ ] It's showing the SAME problem the user described — not a different, nearby problem. Chasing the wrong bug wastes everyone's time.
- [ ] It happens again reliably across multiple runs (or, for on-and-off bugs, happens often enough that you can actually work with it).
- [ ] You've written down exactly what the symptom looks like (the error message, the wrong output, how slow it is) so you can later confirm the fix actually addresses it.

Don't move on until you've actually seen the bug happen.

## Step 3 — Guess the cause(s)

Come up with **3–5 possible causes, ranked by how likely they are**, before testing any of them. Jumping on the first idea that seems plausible is a common trap.

Each guess needs to make a **testable prediction**: state clearly what you'd expect to see if it's right.

> Say it like: "If <this> is the cause, then changing <that> will make the bug go away / changing <this other thing> will make it worse."

If you can't state a clear prediction like that, the guess is just a hunch — sharpen it or drop it.

**Show your ranked list to the user before testing any of them.** They often know something you don't — "we just changed something related to #3" — or already know which guesses are wrong. It's a cheap check that can save a lot of time. Don't wait around for a reply if they're not available — just go with your own ranking.

## Step 4 — Test the guesses

Every check you add should be testing a specific prediction from Step 3. **Change one thing at a time.**

Preferred tools, in order:

1. **A debugger or interactive console**, if you have one available. One well-placed pause beats ten scattered log lines.
2. **Targeted log lines**, placed exactly where they'll tell the guesses apart.
3. Never just "log everything and search through it."

**Tag every temporary log line** with a unique marker, e.g. `[DEBUG-a4f2]`. That way cleanup at the end is a single search-and-delete. Untagged logs tend to get left behind by accident; tagged ones don't.

**For slowdowns specifically:** logs usually aren't the right tool. Instead, measure a baseline first (a timing script, `performance.now()`, a profiler, a query plan), then narrow it down step by step. Measure before you try to fix anything.

## Step 5 — Fix it, and lock the fix in with a test

Write the test that locks in the fix **before making the fix** — but only if there's a **good point in the code** to hang that test on.

A good point to test at is one where the test actually exercises the **real bug**, the way it really happens in production. If the only place available is too narrow (e.g. a test that only covers one caller, when the bug only shows up with several callers interacting; or a small unit test that can't recreate the real chain of events that triggered it), a test there would give false confidence.

**If there's genuinely no good point to test at, that itself is worth noting.** It means the way the code is structured is making this bug hard to guard against. Flag it for later.

If there IS a good point to test at:

1. Turn your smallest reproducing case into a test that fails at that point.
2. Confirm it actually fails.
3. Apply the fix.
4. Confirm the test now passes.
5. Re-run your Step 1 check against the full original scenario (not just the minimized case).

## Step 6 — Clean up and write it up

Before calling it done, confirm:

- [ ] The original bug no longer happens (re-run the Step 1 check)
- [ ] The new test passes (or you've written down why no good point for one existed)
- [ ] Every temporary `[DEBUG-...]` log line has been removed (search for the marker to check)
- [ ] Any throwaway test code has been deleted (or clearly moved somewhere marked as temporary)
- [ ] The commit / PR message states which guess turned out to be correct — so the next person who hits something like this can learn from it

🧠 **Then ask: what would have prevented this bug in the first place?** If the answer points to something structural (no good place to test, tangled dependencies between parts of the code, hidden connections that aren't obvious), hand that off to the `/ae49-task-improve-codebase-architecture` skill with the specifics. Make that suggestion **after** the fix is done, not before — you know more about the problem now than when you started.

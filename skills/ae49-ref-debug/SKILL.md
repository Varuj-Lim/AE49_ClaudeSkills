---
name: ae49-ref-debug
description: "Debugging discipline in two levels. This file is the everyday order to follow before suggesting any fix; hard.md is a fuller loop with a pass/fail check, ranked causes and a regression test. Use whenever debugging starts: a bug report, something broken, crashing or failing, a request to debug or investigate, a pasted error or stack trace. Read hard.md for an on-and-off bug, a slowdown, a bug that came back after a fix, or \"diagnose this\". Trigger on /ae49-ref-debug."
---

# Debugging

| File | Read it when |
|---|---|
| this file | any debugging start |
| [hard.md](hard.md) | the bug comes and goes, is a slowdown, came back after a fix, needs a regression test or write-up, or the owner says "diagnose this". This file's order still applies |
| [scripts/hitl-loop.template.sh](scripts/hitl-loop.template.sh) | a person must click through the repro (`hard.md` step 1, way 10) |

## Say this once, in your first reply

Unless the owner asks you to skip it, open with these four lines. Follow the order either way.

> **ลำดับการไล่บั๊ก:**
> 1. ทำให้เกิดซ้ำได้ตามสั่งก่อน
> 2. หาจุดที่พังให้เจอ
> 3. ลองพิสูจน์ว่าสาเหตุที่เดาไว้ผิด
> 4. จดทุกการทดสอบและผลของมัน

No fix is suggested before step 1 is met. If you catch yourself suggesting one without a reliable repro, go back.

## 1. Get a reliable repro

Aim for a check of a few seconds that answers pass or fail, written down so it can be re-run: a failing test, a script, a
command, a replay of real data. Hold still whatever moves by itself, such as the clock, random values, the network and files.

- **Happens only sometimes:** raise its rate first, with a loop, parallel runs, load or added delay. About half the time is
  debuggable; 1 time in 100 is not yet.
- **Cannot be triggered:** stop and say so. Ask for access, saved evidence (network log, error log) or leave to add
  temporary logging. Do not guess a fix.

## 2. Locate the break

Use the first of these that works:

1. **Debugger.** Pause at the failing spot before changing any setting.
2. **Read the path.** Trace it from start to end and list what can change the result: settings, environment variables,
   switches, the branch taken, the input's shape, timing, build options. Change them one at a time.
3. **Temporary logs.** Print the actual values where you suspect the fault, each with one unique tag such as `[DBG-a4f2]`, so
   one search removes them all afterward.

## 3. Attack your own guess

List 3-5 possible causes by likelihood, so the first idea does not win by default. For the leading one, check that it explains
the whole bug, then run the test that could prove it wrong before any test that could prove it right.

## 4. Keep a trail

After each test, note what changed, what happened and what that rules in or out. Check every new guess against the whole list;
one contradicting result means the guess is wrong or incomplete. When unsure what to try, design the single test whose result
settles the question, instead of several similar ones. A guess is confirmed only after this check.

**Scope (part of ae49-ref-gate-checklist, split out 2026-10-09):** test data for a gate and the environment it runs on (the emulator by default). Moved whole from the `SKILL.md` sections "Test data" and "Environment — the emulator by default".

## Test data

If the checklist needs data that doesn't
exist and the project has a test-data skill (e.g. `<project>-task-test-data`), offer to
seed **tagged disposable test data** per that skill, and after the user passes the test
sweep it (verify zero remain) **before** landing.

## Environment — the emulator by default

**The gate runs on the EMULATOR by default** (rule 2026-08-27, strengthened by the owner
2026-08-28: read cost is the deciding factor). When a project offers both a
production-backed and an emulator/sandbox-backed dev environment, the emulator is the
DEFAULT and production must be argued for. Three reasons, in the owner's order of
importance:
1. **Read cost.** Every gate burns reads — the tester's page loads, plus any priming or
   aggregate rebuild the feature needs. A gate re-opened four or five times over an
   afternoon (normal while polish is iterated) multiplies that. The emulator costs zero.
2. **Junk.** A checklist that has the user CREATE, EDIT or DELETE records leaves those
   records behind in production for someone to sweep.
3. **No real data needed.** Anything whose inputs the tester types by hand does not touch
   production data at all.
**Production only when the gate genuinely cannot work without it** — chiefly when the
expected values were DERIVED from production (a checklist asserting real people, real
totals, real names), because a snapshot shows different numbers and the tester reports a
mismatch that is not a defect. Even then, first ask whether the same figures can be
produced by priming/seeding the EMULATOR and deriving the checklist's expected values
from there — that usually works and keeps the cost at zero.
State the chosen environment in the checklist title so the tester cannot land on the
wrong port, and record the reason where the feature's notes live.

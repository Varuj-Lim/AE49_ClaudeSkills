// SessionStart hook, matcher "compact": states what a compact dropped, so the next step does not run without it.
console.log(
  "A compact just happened. Invoked skills come back only up to 5,000 tokens each and 25,000 in total, and the " +
    "session skills are larger than that. ~/.claude/CLAUDE.md asks that the five session skills be invoked again before " +
    "the next gate, report, landing or push, and that the autopilot state file be read again."
);

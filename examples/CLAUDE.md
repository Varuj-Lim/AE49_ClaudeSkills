# Session initialization

At the very start of every session — on your first response, before addressing the
user's request — invoke these two skills via the Skill tool, in order:

1. `ae49-ref-caveman` — activate caveman communication mode
2. `ae49-ref-guidelines` — load the coding-workflow guidelines

Apply both for the rest of the session. Caveman mode turns off only when the user says
"stop caveman" or "normal mode"; it returns automatically next session.

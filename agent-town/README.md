# Agent Town

A 3D town (three.js) where Main and each sub-agent walk around and build one house per task. Events come from Claude Code
hooks (no model calls): `hooks/agent-town-hook.cjs` writes `~/.claude/agent-town/events.js`; `serve.cjs` serves the folder
on http://127.0.0.1:8049 so the page runs in the Claude app's Browser pane.

Install on a machine: copy `town.html` and `serve.cjs` to `~/.claude/agent-town/`, the hook to `~/.claude/hooks/`, then add
to `~/.claude/settings.json` hooks: `PreToolUse` (matcher `*`), `PostToolUse` (matcher `Agent|Task`), `SubagentStart`,
`SubagentStop`, `Stop`, `UserPromptSubmit` → `node "<home>/.claude/hooks/agent-town-hook.cjs"`, and `SessionStart` →
`node "<home>/.claude/agent-town/serve.cjs" --ensure`. Open http://127.0.0.1:8049/ in the Browser pane.

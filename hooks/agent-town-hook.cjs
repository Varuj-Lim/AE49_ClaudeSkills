// agent-town-hook.cjs — Claude Code hook (PreToolUse, PostToolUse on Agent, SubagentStart, SubagentStop, Stop,
// UserPromptSubmit) that records what Main and each sub-agent is doing into ~/.claude/agent-town/events.js,
// which the Agent Town page (~/.claude/agent-town/town.html) polls. No model call, no network, never blocks:
// any failure is swallowed and the hook exits 0 at once.
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");

const DIR = path.join(os.homedir(), ".claude", "agent-town");
const STATE = path.join(DIR, "state.json");
const OUT = path.join(DIR, "events.js");
const KEEP = 400;

// The background tasks still in flight when a turn ends (Stop / SubagentStop carry `background_tasks`): the only place a
// hook can learn that a background shell has finished — it is no longer in the list. No field = unknown (no `bgTasks`): the
// town then keeps its count rather than end every shell (an older Claude Code may not send it).
function bgTasks(j) {
  if (!Array.isArray(j.background_tasks)) return {};
  return { bgTasks: j.background_tasks.slice(0, 20).map((b) => (b || {})).map((b) => ({ id: String(b.id || ""), type: String(b.type || ""),
    status: String(b.status || ""), cmd: String(b.command || b.description || "").slice(0, 120) })) };
}

function read(stdin) {
  let j = {};
  try { j = JSON.parse(stdin || "{}"); } catch { return null; }
  const ev = j.hook_event_name || "";
  const project = j.cwd ? path.basename(j.cwd) : "";
  const agentId = j.agent_id || j.agentId || "";
  const agentType = j.agent_type || j.agentType || "";
  const base = { t: Date.now(), ev, project, session: String(j.session_id || "").slice(0, 8) };
  if (ev === "PreToolUse") {
    const input = j.tool_input || {};
    const e = { ...base, kind: "tool", agent: agentId || "main", agentType, tool: j.tool_name || "" };
    if (j.tool_name === "Bash" || j.tool_name === "PowerShell") {
      e.cmd = String(input.command || "").slice(0, 240);
      if (input.run_in_background === true) e.bg = true;   // a background shell starts (G1)
    }
    if (j.tool_name === "Agent" || j.tool_name === "Task") {
      e.kind = "dispatch-ask";
      e.subType = input.subagent_type || "general-purpose";
      e.desc = String(input.description || "").slice(0, 80);
    }
    return e;
  }
  if (ev === "PostToolUse" && (j.tool_name === "Agent" || j.tool_name === "Task")) {
    const input = j.tool_input || {};
    const text = typeof j.tool_response === "string" ? j.tool_response : JSON.stringify(j.tool_response || "");
    const m = /agentId["\s:]+([a-z0-9]{8,})/i.exec(text);
    return { ...base, kind: "dispatch", agent: agentId || "main", newAgent: m ? m[1] : "",
      subType: input.subagent_type || "general-purpose", desc: String(input.description || "").slice(0, 80) };
  }
  if (ev === "SubagentStart") return { ...base, kind: "agent-start", agent: agentId, agentType };
  if (ev === "SubagentStop") return { ...base, kind: "agent-stop", agent: agentId, agentType, ...bgTasks(j) };
  if (ev === "Stop") return { ...base, kind: "main-idle", agent: "main", ...bgTasks(j) };
  if (ev === "UserPromptSubmit") {
    // A background task's completion wakes Main through this event too: it is not the owner speaking (G1)
    const p = String(j.prompt || "");
    if (/^\s*<task-notification>/.test(p)) {   // the wake's prompt starts with it (seen 2026-11-07); a quoted one inside an owner prompt is not one
      const done = [...p.matchAll(/<task-notification>([\s\S]*?)<\/task-notification>/g)].slice(0, 10).map(([, whole]) => {
        const b = whole.split("<result>")[0];   // only the head: an agent's report in <result> may quote tags (audit 2026-11-07)
        const id = /<task-id>([^<]+)<\/task-id>/.exec(b), st = /<status>([^<]+)<\/status>/.exec(b);
        return { taskId: id ? id[1] : "", status: st ? st[1] : "", shell: /<summary>\s*Background command/.test(b) };   // an agent's reads "Agent … finished"
      });
      return { ...base, kind: "bg-done", agent: "main", done };
    }
    return { ...base, kind: "owner", agent: "main" };
  }
  return null;
}

let buf = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => { buf += d; });
process.stdin.on("end", () => {
  try {
    const e = read(buf);
    if (!e) return;
    fs.mkdirSync(DIR, { recursive: true });
    let list = [];
    try { list = JSON.parse(fs.readFileSync(STATE, "utf8")); } catch { list = []; }
    if (!Array.isArray(list)) list = [];
    list.push(e);
    if (list.length > KEEP) list = list.slice(-KEEP);
    const tmp = STATE + "." + process.pid;
    fs.writeFileSync(tmp, JSON.stringify(list));
    fs.renameSync(tmp, STATE);
    const tmp2 = OUT + "." + process.pid;
    fs.writeFileSync(tmp2, "window.__AGENT_TOWN_EVENTS=" + JSON.stringify(list) + ";\n");
    fs.renameSync(tmp2, OUT);
  } catch { /* never block Claude Code */ }
});
setTimeout(() => process.exit(0), 1500).unref();

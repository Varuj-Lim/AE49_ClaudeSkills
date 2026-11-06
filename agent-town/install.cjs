// install.cjs — put Agent Town on THIS machine from the skills-repo clone (owner Q639 a, 2026-11-06).
//   node <clone>/agent-town/install.cjs            install / update
//   node <clone>/agent-town/install.cjs --dry-run  say what it would do, change nothing
// It copies <clone>/agent-town/* to ~/.claude/agent-town (never the machine's own state.json / events.js, never a local
// *-source.glb), <clone>/hooks/agent-town-hook.cjs to ~/.claude/hooks/, and adds the six hook entries to
// ~/.claude/settings.json if they are not there yet — after a backup of that file. Running it twice changes nothing more.
// New hooks take effect in the NEXT Claude Code session.
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");

const DRY = process.argv.includes("--dry-run");
const SRC = __dirname;
const HOME = path.join(os.homedir(), ".claude");
const DEST = path.join(HOME, "agent-town");
const HOOK_SRC = path.join(SRC, "..", "hooks", "agent-town-hook.cjs");
const HOOK_DEST = path.join(HOME, "hooks", "agent-town-hook.cjs");
const SETTINGS = path.join(HOME, "settings.json");
const SKIP = new Set([".gitignore", "install.cjs"]);
const KEEP_LOCAL = /^(state\.json|events\.js)$|-source\.glb$/;
const say = (s) => console.log((DRY ? "[dry-run] " : "") + s);

function same(a, b) { try { return fs.readFileSync(a).equals(fs.readFileSync(b)); } catch { return false; } }
function copyTree(from, to) {
  let n = 0;
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (SKIP.has(e.name) || KEEP_LOCAL.test(e.name)) continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) { if (!DRY) fs.mkdirSync(b, { recursive: true }); n += copyTree(a, b); continue; }
    if (same(a, b)) continue;
    say("copy " + path.relative(SRC, a) + " -> " + b);
    if (!DRY) { fs.mkdirSync(to, { recursive: true }); fs.copyFileSync(a, b); }
    n++;
  }
  return n;
}

// 1. Files.
const files = copyTree(SRC, DEST);
if (!fs.existsSync(HOOK_SRC)) { console.error("missing " + HOOK_SRC + " — is this the skills-repo clone?"); process.exit(1); }
let hookCopied = 0;
if (!same(HOOK_SRC, HOOK_DEST)) { say("copy hooks/agent-town-hook.cjs -> " + HOOK_DEST); if (!DRY) { fs.mkdirSync(path.dirname(HOOK_DEST), { recursive: true }); fs.copyFileSync(HOOK_SRC, HOOK_DEST); } hookCopied = 1; }

// 2. Hooks in settings.json — one entry per event, only where none points at the town hook yet.
const command = 'node "' + HOOK_DEST.split(path.sep).join("/") + '"';
const WANT = [["PreToolUse", "*"], ["PostToolUse", "Agent|Task"], ["SubagentStart"], ["SubagentStop"], ["Stop"], ["UserPromptSubmit"]];
let settings = {};
if (fs.existsSync(SETTINGS)) settings = JSON.parse(fs.readFileSync(SETTINGS, "utf8"));
settings.hooks = settings.hooks || {};
const added = [];
for (const [event, matcher] of WANT) {
  const list = (settings.hooks[event] = settings.hooks[event] || []);
  const has = list.some((m) => (m.hooks || []).some((h) => /agent-town-hook\.cjs/.test(h.command || "")));
  if (has) continue;
  list.push({ ...(matcher ? { matcher } : {}), hooks: [{ type: "command", command, timeout: 5 }] });
  added.push(event);
}
if (added.length) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  say("settings.json: add the town hook on " + added.join(", ") + " (backup settings.json.bak-agent-town-" + stamp + ")");
  if (!DRY) {
    if (fs.existsSync(SETTINGS)) fs.copyFileSync(SETTINGS, SETTINGS + ".bak-agent-town-" + stamp);
    fs.writeFileSync(SETTINGS, JSON.stringify(settings, null, 2) + "\n");
  }
}

console.log(`${DRY ? "would change" : "done"}: ${files} town file(s), ${hookCopied} hook file, ${added.length} hook entr${added.length === 1 ? "y" : "ies"}` +
  (added.length ? " — new hooks start recording in the NEXT Claude Code session" : ""));

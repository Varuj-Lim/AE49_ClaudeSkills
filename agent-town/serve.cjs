// serve.cjs — serves ~/.claude/agent-town on http://127.0.0.1:8049 so the Agent Town page runs live in the Claude app's
// Browser pane (a file:// page outside a project is shown only as a still snapshot there).
//   node serve.cjs            run the server (foreground)
//   node serve.cjs --ensure   start it detached if nothing answers on the port, then exit at once (SessionStart hook)
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const PORT = 8049;
const ROOT = __dirname;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" };

if (process.argv.includes("--ensure")) {
  const req = http.get({ host: "127.0.0.1", port: PORT, path: "/ping", timeout: 400 }, (res) => { res.resume(); process.exit(0); });
  req.on("error", () => {
    const child = spawn(process.execPath, [__filename], { detached: true, stdio: "ignore", windowsHide: true });
    child.unref(); process.exit(0);
  });
  req.on("timeout", () => { req.destroy(); });
  return;
}

http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/ping") { res.end("ok"); return; }
  const file = path.normalize(path.join(ROOT, url === "/" ? "town.html" : url));
  if (!file.startsWith(ROOT) || !/\.(html|js|json)$/.test(file)) { res.statusCode = 404; res.end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.statusCode = 404; res.end(); return; }
    res.setHeader("Content-Type", TYPES[path.extname(file)] || "text/plain");
    res.setHeader("Cache-Control", "no-store");
    res.end(data);
  });
}).listen(PORT, "127.0.0.1");

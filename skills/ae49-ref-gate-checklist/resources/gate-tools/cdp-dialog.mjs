// Accept a pending JavaScript dialog (e.g. beforeunload) on every page of the headless Chrome at $CDP_PORT (default the
// project's cdpMainPort in .claude/gate-tools.json, else 9333) —
// sends ONLY Page.handleJavaScriptDialog, nothing that would wait on the blocked page.
const cfgPort = (() => { try { const fs = process.getBuiltinModule("node:fs"), path = process.getBuiltinModule("node:path"); return JSON.parse(fs.readFileSync(path.join(process.cwd(), ".claude", "gate-tools.json"), "utf8")).cdpMainPort; } catch { return undefined; } })();
const list = await (await fetch(`http://127.0.0.1:${process.env.CDP_PORT || String(cfgPort || 9333)}/json/list`)).json();
for (const t of list.filter((x) => x.type === "page")) {
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  const res = await new Promise((resolve) => {
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id === 1) resolve(d); };
    ws.send(JSON.stringify({ id: 1, method: "Page.handleJavaScriptDialog", params: { accept: true } }));
    setTimeout(() => resolve({ timeout: true }), 3000);
  });
  console.log(t.url.slice(0, 80), res.error ? res.error.message : res.timeout ? "timeout" : "accepted");
  ws.close();
}
process.exit(0);

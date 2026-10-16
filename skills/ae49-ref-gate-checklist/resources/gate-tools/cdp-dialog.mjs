// Accept a pending JavaScript dialog (e.g. beforeunload) on every page of the headless Chrome at $CDP_PORT (default 9333) —
// sends ONLY Page.handleJavaScriptDialog, nothing that would wait on the blocked page.
const list = await (await fetch(`http://127.0.0.1:${process.env.CDP_PORT || "9333"}/json/list`)).json();
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

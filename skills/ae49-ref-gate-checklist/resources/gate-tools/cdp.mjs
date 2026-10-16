// cdp.mjs — tiny CDP driver for a headless Chrome started by headless-start.sh (ae49-ref-gate-checklist gate-tools).
// Port: env CDP_PORT (default 9333 = Main; gate agents get 9334, 9335 … from Main's dispatch).
// Commands: eval "<js>" · nav <url> · paste "<tsv>" · undo · key <Key> · type "<text>" · enter · clickxy x,y ·
//           file <absolute path> (first input[type=file]) · shot <png> · grant <origin> · grantp <origin>,<perm>… ·
//           dialog [dismiss] · throttle <ms> · throttled-eval "<js>"
// Env CDP_URL_MATCH picks the tab whose URL contains it.
const [, , cmd, arg] = process.argv;
const PORT = process.env.CDP_PORT || "9333";
const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const match = process.env.CDP_URL_MATCH; const page = match ? list.find((t) => t.type === "page" && t.url.includes(match)) : list.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
await new Promise((r) => (ws.onopen = r));
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: `(async()=>{ return (${expr}); })()`, awaitPromise: true, returnByValue: true, userGesture: true });
  if (r.result?.exceptionDetails) return { error: r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text };
  return r.result?.result?.value;
};
const key = async (k, code, vk, modifiers = 0, commands) => {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code, windowsVirtualKeyCode: vk, modifiers, ...(commands ? { commands } : {}) });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code, windowsVirtualKeyCode: vk, modifiers });
};
await send("Emulation.setFocusEmulationEnabled", { enabled: true });
let out;
if (cmd === "eval") out = await evalJs(arg);
else if (cmd === "nav") { await send("Page.navigate", { url: arg }); await new Promise((r) => setTimeout(r, 4000)); out = await evalJs("location.href"); }
else if (cmd === "paste") {
  const origin = await evalJs("location.origin");
  await send("Browser.grantPermissions", { origin, permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] });
  out = { wrote: await evalJs(`navigator.clipboard.writeText(${JSON.stringify(arg.replace(/\\t/g, "\t").replace(/\\n/g, "\n"))}).then(()=>true)`) };
  await key("v", "KeyV", 86, 2, ["paste"]);
  await new Promise((r) => setTimeout(r, 1200));
}
else if (cmd === "undo") { await key("z", "KeyZ", 90, 2); await new Promise((r) => setTimeout(r, 1200)); out = "undo sent"; }
else if (cmd === "key") { const vk = { Tab: 9, Enter: 13, ArrowDown: 40, ArrowUp: 38, ArrowLeft: 37, ArrowRight: 39, Escape: 27, Backspace: 8, Delete: 46 }[arg]; await key(arg, arg, vk); await new Promise((r) => setTimeout(r, 500)); out = "key " + arg; }
else if (cmd === "throttled-eval") { await send("Network.enable"); await send("Network.emulateNetworkConditions", { offline: false, latency: 4000, downloadThroughput: -1, uploadThroughput: -1 }); out = await evalJs(arg); await send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }); }
else if (cmd === "throttle") { await send("Network.enable"); await send("Network.emulateNetworkConditions", { offline: false, latency: Number(arg), downloadThroughput: -1, uploadThroughput: -1 }); out = "latency " + arg; }
else if (cmd === "shot") { const r = await send("Page.captureScreenshot", { format: "png" }); const fs = await import("fs"); fs.writeFileSync(arg, Buffer.from(r.result.data, "base64")); out = "saved " + arg; }
else if (cmd === "grant") { const r = await send("Browser.grantPermissions", { permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"], origin: arg }); out = r.error ? r.error : "granted"; }
else if (cmd === "grantp") { const [origin, ...perms] = arg.split(","); const r = await send("Browser.grantPermissions", { permissions: perms, origin }); out = r.error ? r.error : "granted " + perms.join("+"); }
else if (cmd === "dialog") { const r = await send("Page.handleJavaScriptDialog", { accept: arg !== "dismiss" }); out = r.error ? r.error.message : "dialog handled"; }
else if (cmd === "enter") { await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" }); await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 }); await new Promise((r) => setTimeout(r, 500)); out = "enter"; }
else if (cmd === "clickxy") { const [x, y] = arg.split(",").map(Number); for (const type of ["mouseMoved", "mousePressed", "mouseReleased"]) await send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 }); await new Promise((r) => setTimeout(r, 500)); out = "clicked " + arg; }
else if (cmd === "type") { await send("Input.insertText", { text: arg }); await new Promise((r) => setTimeout(r, 300)); out = "typed"; }
else if (cmd === "file") { const doc = await send("DOM.getDocument", { depth: -1, pierce: true }); const q = await send("DOM.querySelector", { nodeId: doc.result.root.nodeId, selector: "input[type=file]" }); const r = await send("DOM.setFileInputFiles", { files: [arg], nodeId: q.result.nodeId }); await new Promise((res) => setTimeout(res, 3000)); out = r.error ? r.error.message : "file set"; }
console.log(JSON.stringify(out, null, 1));
ws.close();
process.exit(0);

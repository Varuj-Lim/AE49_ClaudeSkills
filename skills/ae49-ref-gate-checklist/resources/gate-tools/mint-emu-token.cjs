// mint-emu-token.cjs — EMULATOR ONLY. Mints a custom token for the gate account on the Auth emulator so a headless
// Chrome tab can sign in through the app's own impersonation hand-off. No password is ever typed.
// Uses emu-admin.cjs (refuses non-127.0.0.1 hosts, never reads .env.local). Account: GATE_ACCOUNT_EMAIL or the
// config's accountEmail. Prints JSON { token, marker }. Run from the project root.
const { auth, cfg } = require("./emu-admin.cjs");
(async () => {
  const email = process.env.GATE_ACCOUNT_EMAIL || cfg.accountEmail;
  const u = await auth.getUserByEmail(email);
  const token = await auth.createCustomToken(u.uid, { impersonatedBy: u.uid });
  const marker = { targetUid: u.uid, impersonatedBy: u.uid, label: "headless gate (" + email + ")", byLabel: "gate" };
  console.log(JSON.stringify({ token, marker }));
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });

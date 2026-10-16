// mint-emu-token.cjs — EMULATOR ONLY. Mints a custom token for the gate account on the Auth emulator so a headless
// Chrome tab can sign in through the app's own impersonation hand-off. No password is ever typed.
// Reads the project's `.claude/gate-tools.json` (run from the project root):
//   { "projectId", "authEmulator": "127.0.0.1:<port>", "firestoreEmulator": "127.0.0.1:<port>",
//     "accountEmail", "appUrl": "http://localhost:<emulator app port>", "impersonationKeys": { "marker", "token" } }
// Prints JSON { token, marker }. Refuses unless the config names emulator hosts on 127.0.0.1.
const fs = require("fs");
const path = require("path");
const cfg = JSON.parse(fs.readFileSync(path.join(process.cwd(), ".claude", "gate-tools.json"), "utf8"));
if (!/^127\.0\.0\.1:\d+$/.test(cfg.authEmulator || "") || !/^127\.0\.0\.1:\d+$/.test(cfg.firestoreEmulator || "")) {
  console.error("refuse: gate-tools.json must name 127.0.0.1 emulator hosts"); process.exit(1);
}
process.env.FIREBASE_AUTH_EMULATOR_HOST = cfg.authEmulator;
process.env.FIRESTORE_EMULATOR_HOST = cfg.firestoreEmulator;
const admin = require(path.join(process.cwd(), "node_modules", "firebase-admin"));
admin.initializeApp({ projectId: cfg.projectId });
(async () => {
  const u = await admin.auth().getUserByEmail(process.env.GATE_ACCOUNT_EMAIL || cfg.accountEmail);
  const token = await admin.auth().createCustomToken(u.uid, { impersonatedBy: u.uid });
  const marker = { targetUid: u.uid, impersonatedBy: u.uid, label: "headless gate", byLabel: "gate" };
  console.log(JSON.stringify({ token, marker }));
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });

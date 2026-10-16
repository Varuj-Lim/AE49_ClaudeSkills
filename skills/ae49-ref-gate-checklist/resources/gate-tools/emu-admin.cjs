// emu-admin.cjs — the ONLY way a gate script gets Firestore / Auth: EMULATOR ONLY (audits GA-2 / GA-8 / GA-9, 2026-10-16).
// const { db, auth, cfg } = require("<tools>/emu-admin.cjs");   (run from the project root; require it FIRST)
// Reads <project>/.claude/gate-tools.json, refuses unless both hosts are 127.0.0.1, sets the emulator env BEFORE
// firebase-admin loads, points Storage at a dead local port, drops credential env, never reads .env.local,
// refuses if firebase-admin was already initialised by the caller, and exports only db + auth (no Storage).
const fs = require("fs");
const path = require("path");
const cfg = JSON.parse(fs.readFileSync(path.join(process.cwd(), ".claude", "gate-tools.json"), "utf8"));
const local = (h) => /^127\.0\.0\.1:\d+$/.test(h || "");
if (!local(cfg.authEmulator) || !local(cfg.firestoreEmulator)) {
  console.error("refuse: gate-tools.json must name 127.0.0.1 emulator hosts"); process.exit(1);
}
process.env.FIRESTORE_EMULATOR_HOST = cfg.firestoreEmulator;
process.env.FIREBASE_AUTH_EMULATOR_HOST = cfg.authEmulator;
process.env.FIREBASE_STORAGE_EMULATOR_HOST = "127.0.0.1:9";   // dead port: any Storage call fails locally
process.env.STORAGE_EMULATOR_HOST = "http://127.0.0.1:9";
delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
const admin = require(path.join(process.cwd(), "node_modules", "firebase-admin"));
if (admin.apps.length) { console.error("refuse: firebase-admin already initialised before emu-admin — require emu-admin first"); process.exit(1); }
const app = admin.initializeApp({ projectId: cfg.projectId }, "ae49-gate-emu");
const db = app.firestore();
const host = db._settings && db._settings.host;
if (host && !String(host).startsWith("127.0.0.1")) { console.error("refuse: Firestore host " + host + " is not the emulator"); process.exit(1); }
module.exports = { db, auth: app.auth(), cfg };

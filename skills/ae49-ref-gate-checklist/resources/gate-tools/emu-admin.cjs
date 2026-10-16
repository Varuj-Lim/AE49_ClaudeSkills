// emu-admin.cjs — the ONLY way a gate script gets Firestore / Auth: EMULATOR ONLY (audit GA-2, 2026-10-16).
// const { admin, db, cfg } = require("<tools>/emu-admin.cjs");   (run from the project root)
// Reads <project>/.claude/gate-tools.json, refuses unless both hosts are 127.0.0.1, sets the emulator env BEFORE
// firebase-admin loads, drops any credential env, never reads .env.local, and gives no Storage access at all.
const fs = require("fs");
const path = require("path");
const cfg = JSON.parse(fs.readFileSync(path.join(process.cwd(), ".claude", "gate-tools.json"), "utf8"));
const local = (h) => /^127\.0\.0\.1:\d+$/.test(h || "");
if (!local(cfg.authEmulator) || !local(cfg.firestoreEmulator)) {
  console.error("refuse: gate-tools.json must name 127.0.0.1 emulator hosts"); process.exit(1);
}
process.env.FIRESTORE_EMULATOR_HOST = cfg.firestoreEmulator;
process.env.FIREBASE_AUTH_EMULATOR_HOST = cfg.authEmulator;
delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
delete process.env.FIREBASE_STORAGE_EMULATOR_HOST;
const admin = require(path.join(process.cwd(), "node_modules", "firebase-admin"));
if (!admin.apps.length) admin.initializeApp({ projectId: cfg.projectId });
module.exports = { admin, db: admin.firestore(), cfg };

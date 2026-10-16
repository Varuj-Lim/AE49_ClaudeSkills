// emu-sweep.cjs <testBatch> <collection>[,<collection>…] [--apply] — EMULATOR ONLY sweep of a gate's own seeds:
// deletes docs with isTestData == true AND testBatch == <tag>. Dry run unless --apply. No Storage deletes.
// Gates never use the project's production cleanup scripts (they read .env.local) — audit GA-2, 2026-10-16.
const { db } = require("./emu-admin.cjs");
const [tag, cols, flag] = process.argv.slice(2);
if (!tag || !cols) { console.error("usage: node emu-sweep.cjs <testBatch> <col>[,<col>…] [--apply]"); process.exit(2); }
(async () => {
  let n = 0;
  for (const c of cols.split(",")) {
    const q = await db.collection(c).where("isTestData", "==", true).where("testBatch", "==", tag).get();
    for (const d of q.docs) { if (flag === "--apply") await d.ref.delete(); n++; console.log((flag === "--apply" ? "deleted " : "would delete ") + c + "/" + d.id); }
  }
  console.log((flag === "--apply" ? "swept " : "dry run: ") + n); process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });

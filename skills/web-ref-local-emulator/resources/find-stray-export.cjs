#!/usr/bin/env node
// Find an emulator save that landed in a STRAY folder (plan emu-stray-export, owner 2026-10-29 Q3 a).
//
// The Firebase CLI exports into a temporary `firebase-export-<digits><random>` folder in the project
// root and then renames it into `.dev-emulator-data`. When that rename fails, the newest world stays in
// the stray folder and the next `.claude\dev-emu.cmd` start loads the OLD `.dev-emulator-data` — the
// work done on the emulator is gone without a word (2026-10-28, register OI-14). dev-emu.cmd calls this
// script before it boots the suite and asks the owner whether to use the newer world.
//
// Run (from the project root):
//   node find-stray-export.cjs                              prints the newest stray folder that is NEWER
//                                                           than .dev-emulator-data, or nothing; exit 0
//   node scripts/dev/find-stray-export.cjs --adopt <dir>    keeps .dev-emulator-data aside as
//                                                           .dev-emulator-data-before-<stamp>, then renames
//                                                           <dir> to .dev-emulator-data; deletes nothing
//   --root <dir>                                            (tests) work in <dir> instead of the project root
//
// A stray folder may lack the top-level firebase-export-metadata.json: the CLI writes it LAST, and the
// 2026-10-28 save was cut off right there (its Firestore, Auth and Storage parts are all complete). Such a
// folder counts when its Firestore and Auth parts are complete; --adopt then writes the missing metadata
// file (version numbers taken from the world it replaces) before it moves anything.
//
// Pure file-system work: no Firebase, no network, no credential.

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const arg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const ROOT = path.resolve(arg("--root") || process.cwd());
const CURRENT = path.join(ROOT, ".dev-emulator-data");
const META = "firebase-export-metadata.json";
const STRAY_NAME = /^firebase-export-\d+/;

// A cut-off save counts only when its Firestore and Auth parts are COMPLETE: the Firestore overall
// metadata is the last Firestore file written, and Auth writes accounts.json then config.json (audit A3).
const FIRESTORE_DONE = "firestore_export/firestore_export.overall_export_metadata";
const AUTH_FILES = ["auth_export/accounts.json", "auth_export/config.json"];
// Storage writes buckets.json FIRST, then each blob and its metadata JSON — so its part counts only when
// buckets.json and every metadata JSON parse (round-2 audit MN1); the import JSON.parses all of them at boot.
const STORAGE_BUCKETS = "storage_export/buckets.json";
const STORAGE_META_DIR = "storage_export/metadata";

const mtime = (p) => { try { return fs.statSync(p).mtimeMs; } catch { return null; } };
const parses = (p) => { try { JSON.parse(fs.readFileSync(p, "utf8")); return true; } catch { return false; } };

/** Did the Storage part of a save finish? (see STORAGE_BUCKETS) */
function storageComplete(dir) {
  if (!parses(path.join(dir, STORAGE_BUCKETS))) return false;
  const metaDir = path.join(dir, STORAGE_META_DIR);
  let files;
  try { files = fs.readdirSync(metaDir, { recursive: true }); } catch { return true; } // no blobs saved
  return files.filter((f) => String(f).endsWith(".json")).every((f) => parses(path.join(metaDir, String(f))));
}

/** Modified time of a world's metadata file, or null when the world has none. */
function metaTime(dir) { return mtime(path.join(dir, META)); }

/** When a stray world was saved: its metadata file, else its complete parts (null = not a usable save). */
function strayTime(dir) {
  const meta = metaTime(dir);
  if (meta !== null) return meta;
  const parts = [FIRESTORE_DONE, ...AUTH_FILES].map((p) => mtime(path.join(dir, p)));
  if (parts.includes(null) || !AUTH_FILES.every((p) => parses(path.join(dir, p)))) return null;
  return Math.max(...parts);
}

/** Wait without a timer — this script is synchronous from start to end. */
const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

/** Rename, retrying a few times on the Windows "file in use" errors (antivirus, a just-closed java.exe). */
function renameRetry(from, to) {
  for (let i = 1; ; i++) {
    try { return fs.renameSync(from, to); } catch (e) {
      if (i >= 5 || !["EBUSY", "EPERM", "EACCES"].includes(e.code)) throw e;
      pause(400 * i);
    }
  }
}

/** The newest stray world in ROOT that is newer than CURRENT (or any, when CURRENT has no metadata). */
function newestStray() {
  const current = metaTime(CURRENT);
  let best = null;
  for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!e.isDirectory() || !STRAY_NAME.test(e.name)) continue;
    const t = strayTime(path.join(ROOT, e.name));
    if (t === null || (current !== null && t <= current)) continue;
    if (!best || t > best.t) best = { dir: path.join(ROOT, e.name), t };
  }
  return best && best.dir;
}

/** YYYYMMDD-HHMMSS in Thai time (UTC+7, no DST) — the suffix of the kept-aside folder. */
function ictStamp() {
  const d = new Date(Date.now() + 7 * 3600 * 1000).toISOString();
  return d.slice(0, 10).replace(/-/g, "") + "-" + d.slice(11, 19).replace(/:/g, "");
}

function die(msg) { console.error("[X] " + msg); process.exit(1); }

const adopt = arg("--adopt");
if (adopt === undefined) {
  const found = newestStray();
  if (found) console.log(found);
  process.exit(0);
}

const src = path.resolve(ROOT, adopt);
if (path.dirname(src) !== ROOT || !STRAY_NAME.test(path.basename(src))) {
  die(`${adopt} is not a stray emulator export (a firebase-export-<digits>... folder in ${ROOT}) - nothing changed.`);
}
const saved = strayTime(src);
if (saved === null) die(`${src} is not a complete save (no ${META}, and no complete Firestore + Auth parts) - nothing changed.`);

// 1. The metadata file the CLI never got to write — BEFORE any folder moves (audit A1). Built from the fixed
//    part folders; the version numbers come from the world being replaced (same CLI). Storage only when its
//    part finished (storageComplete) — otherwise the suite starts with empty Storage, said on screen. Dated
//    with the save's own time, so the launcher shows when it was saved.
if (metaTime(src) === null) {
  let ref;
  try { ref = JSON.parse(fs.readFileSync(path.join(CURRENT, META), "utf8")); } catch { ref = null; }
  if (!ref || !ref.version || !ref.firestore || !ref.firestore.version) {
    die(`${src} has no ${META} and .dev-emulator-data has none to copy the versions from - nothing changed.`);
  }
  const meta = {
    version: ref.version,
    firestore: { version: ref.firestore.version, path: "firestore_export", metadata_file: FIRESTORE_DONE },
    auth: { version: (ref.auth && ref.auth.version) || ref.version, path: "auth_export" },
  };
  if (storageComplete(src)) {
    meta.storage = { version: (ref.storage && ref.storage.version) || ref.version, path: "storage_export" };
  } else if (fs.existsSync(path.join(src, "storage_export"))) {
    console.log("the Storage part of this save did not finish - Storage (ticket attachments) will start empty");
  }
  const file = path.join(src, META);
  try {
    fs.writeFileSync(file, JSON.stringify(meta, null, 2) + "\n");
    fs.utimesSync(file, saved / 1000, saved / 1000);
  } catch (e) {
    try { fs.unlinkSync(file); } catch { /* not written at all */ }
    die(`could not write ${file}: ${e.message} - nothing changed.`);
  }
  console.log(`wrote the missing ${META} (versions copied from the previous world)`);
}

// 2. Move the folders. A failure after the first move puts the previous world back (audit A1), so the
//    launcher never boots on a missing .dev-emulator-data.
let aside = null;
try {
  if (fs.existsSync(CURRENT)) {
    aside = path.join(ROOT, ".dev-emulator-data-before-" + ictStamp());
    renameRetry(CURRENT, aside);
  }
  renameRetry(src, CURRENT);
} catch (e) {
  if (aside && !fs.existsSync(CURRENT)) {
    try { renameRetry(aside, CURRENT); } catch (e2) {
      die(`could not move the folders (${e.message}), and could not put the previous world back (${e2.message}).\n` +
        `    Run this (any folder, cmd or PowerShell), then start again:  ren "${aside}" .dev-emulator-data`);
    }
    die(`could not move the folders (${e.message}) - rolled back: .dev-emulator-data is as it was.`);
  }
  die(`could not move the folders (${e.message}) - .dev-emulator-data is as it was.`);
}
if (aside) console.log(`kept the previous world aside: ${aside} (delete it by hand once you are happy)`);
console.log(`now in use: ${CURRENT} (from ${path.basename(src)})`);

#!/usr/bin/env node
// close-gate.cjs — reset a project's docs/gate-checklist.js to the CLOSED payload at landing,
// in the exact grammar of web-ref-gate-closed-format, then validate it.
//
// Usage:
//   node close-gate.cjs <docs/gate-checklist.js> --slug <slug> --score <P/N> --commit <sha>[,<sha>…]
//                       [--waived <W>] [--prod <M/M>] [--deployed <web|web+rules|web+functions>] [--date YYYY-MM-DD]
//
// The feature and title of the gate being closed are KEPT (the canon: "keep the last gate's
// title"). --date defaults to today in Thai time (ICT, UTC+7). Commits: one → "commit <sha>",
// 2–4 → "commits a/b/c", 5+ → "commits <first>…<last> (K)". --waived W (owner 2026-09-25): the
// owner waived W items; --score then counts only the PASSED items and passed + waived must
// equal the total, e.g. --score 3/7 --waived 4 → "gate 3/7 (4 waived)".
// Writes nothing if an argument is missing or the result fails validation.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const [file, ...rest] = process.argv.slice(2);
const arg = (name) => { const i = rest.indexOf("--" + name); return i >= 0 ? rest[i + 1] : undefined; };
const die = (m) => { console.error("close-gate: " + m); process.exit(2); };
if (!file) die("usage: node close-gate.cjs <docs/gate-checklist.js> --slug <slug> --score <N/N> --commit <sha>[,…] [--prod M/M] [--deployed scope] [--date YYYY-MM-DD]");

const slug = arg("slug"), score = arg("score"), commitArg = arg("commit");
if (!slug) die("--slug is required");
if (!score || !/^\d+\/\d+$/.test(score)) die("--score must look like 25/25");
if (!commitArg) die("--commit is required (the landing commit's short sha)");
const shas = commitArg.split(",").map((s) => s.trim()).filter(Boolean);
if (!shas.every((s) => /^[0-9a-f]{7,40}$/.test(s))) die("--commit takes hex shas only — never a placeholder");
const prod = arg("prod");
if (prod && !/^\d+\/\d+$/.test(prod)) die("--prod must look like 7/7");
const waivedArg = arg("waived");
if (waivedArg !== undefined && !/^\d+$/.test(waivedArg)) die("--waived takes a whole number of waived items");
const waived = waivedArg === undefined ? 0 : Number(waivedArg);
{
  const [passed, total] = score.split("/").map(Number);
  if (waived === 0 && passed !== total) die(`--score ${score}: passed and total differ, so name the waived items with --waived ${total - passed}`);
  if (waived > 0 && passed + waived !== total) die(`--score ${score} --waived ${waived}: passed + waived must equal the total`);
}
const deployed = arg("deployed");
if (deployed && !/^[a-z+]+$/.test(deployed)) die("--deployed takes a plain scope like web or web+rules");

// Today in ICT, from the clock — never an estimate.
const ict = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
const date = arg("date") || ict;
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) die("--date must be YYYY-MM-DD");

// Keep the current feature and title.
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox);
const cur = sandbox.window.GATE_CHECKLIST || {};
if (!cur.title) die("the current file has no title to keep");

const commitSlot = shas.length === 1 ? `commit ${shas[0]}`
  : shas.length <= 4 ? `commits ${shas.join("/")}`
  : `commits ${shas[0]}…${shas[shas.length - 1]} (${shas.length})`;
const gateSlot = (prod ? `gate ${score} dev + ${prod} prod` : `gate ${score}`) + (waived ? ` (${waived} waived)` : "");
const closed = `${slug} landed ${date} (${gateSlot}; ${commitSlot}${deployed ? `; deployed ${deployed}` : ""})`;

const q = (s) => JSON.stringify(s);
const out = [
  "window.GATE_CHECKLIST = {",
  `  feature: ${q(cur.feature || slug)},`,
  `  title: ${q(cur.title)},`,
  `  closed: ${q(closed)},`,
  "  items: []",
  "};",
  "",
].join("\n");

const tmp = file + ".closing";
fs.writeFileSync(tmp, out, "utf8");
try {
  execFileSync(process.execPath, [path.join(__dirname, "validate-gate.cjs"), tmp], { stdio: "inherit" });
} catch {
  fs.unlinkSync(tmp);
  die("the closed payload failed validation — nothing written");
}
fs.renameSync(tmp, file);
console.log("closed: " + closed);

#!/usr/bin/env node
// open-batches.cjs — which batches of which plans STILL have work, read from the files and git, never from memory.
//
// Usage (from the project root):  node ~/.claude/skills/ae49-task-estimate-eta/resources/open-batches.cjs [docs/plans]
//
// Why (owner 2026-10-16): an ETA report listed unsaved-leave-popup B2–B8 as "not started" when all seven had landed
// two days before — the plan's `Status:` line was never flipped to Done, and Main hand-grepped the landing notes for
// "LANDED" in capitals while those notes said "landed". This script is the one way step 2 reads the plan board.
//
// For every docs/plans/*.md (not _open-items.md, not done/):
//   - its batch ids, from the lines that DEFINE batches: "- **B3 …", "**B3 …", "| B3 …" (table row), "### B3";
//   - each batch's landing evidence, from BOTH sources, case-insensitive:
//       a. the plan's own text: "B3 landed" / "B3 LANDED" (+ the first sha in backticks on that line);
//       b. git: a commit whose subject names the plan slug and the batch ("<slug> B3", "(…<slug> B3…)", "B3 — …<slug>").
//   - a batch with evidence is LANDED; a batch with none is OPEN.
// A plan whose every batch is LANDED but whose Status is not Done is printed as STALE STATUS — close it
// (archive-plan.cjs), never estimate it. A plan with no batch lines is printed as NO BATCHES (read it by hand).
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const dir = process.argv[2] || "docs/plans";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
let log = "";
try { log = execFileSync("git", ["log", "--format=%h %s", "-n", "3000"], { encoding: "utf8" }); } catch { /* not a repo */ }
const commits = log.split("\n").filter(Boolean);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let anyOpen = false;
for (const f of files) {
  const slug = f.replace(/\.md$/, "");
  const text = fs.readFileSync(path.join(dir, f), "utf8").replace(/\r\n/g, "\n");
  const status = ((text.match(/^\*\*Status:\*\*\s*(.*)$/m) || [])[1] || "(no Status line)").slice(0, 90);
  const ids = new Set();
  const defRe = /^(?:- \*\*|\*\*|\| |#{2,4} )(B\d+[a-z]?)\b/gm;
  let m;
  while ((m = defRe.exec(text))) ids.add(m[1]);
  console.log(`\n== ${slug}  —  Status: ${status}`);
  if (!ids.size) { console.log("   NO BATCHES found by the definition patterns — read the plan by hand"); continue; }
  const sorted = [...ids].sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)) || a.localeCompare(b));
  let open = 0;
  for (const id of sorted) {
    // a. The landing note — the authority. "B3 landed" / "**B3 LANDED" with the batch id RIGHT before the word
    //    (case-insensitive), so "B3 … the B2 gate landed" or "#1 landing" never counts. Prefer a line with a sha.
    const noteRe = new RegExp(`\\b${id}\\*{0,2}\\s+(?:landed|done)\\b[^\\n]*`, "gi");
    const notes = text.match(noteRe) || [];
    const shaOf = (s) => (s.match(/`([0-9a-f]{7,40})`/) || [])[1];
    const noteSha = notes.length ? (notes.map(shaOf).find(Boolean) || "no-sha") : null;
    // b. git — any commit but a docs(plans) one (a docs-only batch lands as docs(…)) naming the slug and the batch. Evidence only: a batch can ship in parts
    //    (etabs-helper B3: the storage rules landed while the Helper was redone), so git alone is never "landed".
    const gitRe = new RegExp(`(${esc(slug)}[^\\n]{0,40}\\b${id}\\b|\\b${id}\\b[^\\n]{0,80}${esc(slug)})`, "i");
    const hit = commits.find((c) => gitRe.test(c) && !/^\w+ docs\(plans\)/.test(c));
    const gitSha = hit ? hit.split(" ")[0] : null;
    const state = noteSha ? "LANDED" : gitSha ? "CHECK " : "OPEN  ";
    if (!noteSha) open++;
    console.log(`   ${id.padEnd(5)} ${state}  ${noteSha ? "note " + noteSha : ""}${noteSha && gitSha ? " · " : ""}${gitSha ? "git " + gitSha + (noteSha ? "" : "  ← code commit but no landing note: read the plan / the commit before calling it open or landed") : ""}`);
  }
  if (!open && !/^Done/i.test(status)) console.log("   ⚠ STALE STATUS — every batch landed but Status is not Done: close it (archive-plan.cjs), do not estimate it");
  if (open) anyOpen = true;
}
process.exit(0);

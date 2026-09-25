#!/usr/bin/env node
// archive-plan.cjs — archive a landed plan: set its Status line, append its landing notes, and
// move it to docs/plans/done/. Run from the project root.
//
// Usage:
//   node archive-plan.cjs docs/plans/<slug>.md --status "<text after **Status:**>" --notes <notes.md>
//
// Example:
//   node archive-plan.cjs docs/plans/table-fill-mode-2026-09-23.md \
//     --status "Done — landed 2026-09-23 (gate \`fcbadbd\` ① 25/25 on :4001; commit f49d05a)" \
//     --notes <scratch>/notes.md
//
// Why a script (2026-09-25): Main archived plans with a fresh inline script each time, and the
// shell layer between the text and the disk broke it repeatedly — an apostrophe closing a
// single-quoted `node -e`, a backslash eaten on the way. The notes come from a FILE written with
// the Write tool, so no shell ever touches their text. The file's own line endings are kept.
// Aborts without writing if the plan has no Status line or the target already exists.
"use strict";
const fs = require("fs");
const path = require("path");

const [plan, ...rest] = process.argv.slice(2);
const arg = (n) => { const i = rest.indexOf("--" + n); return i >= 0 ? rest[i + 1] : undefined; };
const die = (m) => { console.error("archive-plan: " + m); process.exit(2); };
if (!plan) die("usage: node archive-plan.cjs docs/plans/<slug>.md --status \"<status text>\" --notes <notes.md>");
const status = arg("status"), notesFile = arg("notes");
if (!status) die("--status is required");
if (!notesFile) die("--notes <file> is required (write it with the Write tool, not a shell heredoc)");
if (!fs.existsSync(plan)) die("no such plan: " + plan);
if (!fs.existsSync(notesFile)) die("no such notes file: " + notesFile);

const dir = path.dirname(plan);
if (path.basename(dir) === "done") die("the plan is already in done/");
const target = path.join(dir, "done", path.basename(plan));
if (fs.existsSync(target)) die("target already exists: " + target);

let s = fs.readFileSync(plan, "utf8");
const nl = s.includes("\r\n") ? "\r\n" : "\n";
const statusLines = s.match(/^\*\*Status:\*\*.*$/gm) || [];
if (statusLines.length !== 1) die(`expected exactly one "**Status:**" line, found ${statusLines.length}`);
s = s.replace(/^\*\*Status:\*\*.*$/m, "**Status:** " + status);

const notes = fs.readFileSync(notesFile, "utf8").replace(/\r\n/g, "\n").replace(/^\s+|\s+$/g, "");
if (!/^## /.test(notes)) die("the notes must start with a heading, e.g. \"## Landing notes (YYYY-MM-DD)\"");
s = s.replace(/\s*$/, nl) + nl + notes.split("\n").join(nl) + nl;

fs.mkdirSync(path.join(dir, "done"), { recursive: true });
fs.writeFileSync(plan, s, "utf8");
fs.renameSync(plan, target);
const slash = (p) => p.split(path.sep).join("/");
console.log("archived " + slash(plan) + " -> " + slash(target));
console.log("status: " + status);
console.log("stage both paths: git add " + slash(plan) + " " + slash(target));

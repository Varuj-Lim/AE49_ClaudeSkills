#!/usr/bin/env node
// land.cjs — commit a landing from exact paths, and prove what went in. Run from the project root.
//
//   node land.cjs --message-file <file> [--plan docs/plans/<slug>.md] [--allow-churn] -- <file> [<file> ...]
//
// Why a script (L2, skills review 2026-11-02): at least five landings in two hubs committed only the plan after a refused
// `git add`, or swept in files staged by `git apply --3way`. It stops before committing when a named path has no change, and
// it commits the named paths only, whatever else is staged. Dev-server churn is refused. Pushes nothing.
"use strict";
const fs = require("fs");
const { execFileSync } = require("child_process");

const die = (m) => { console.error("land: " + m + " Nothing was committed."); process.exit(2); };
const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

const argv = process.argv.slice(2);
const split = argv.indexOf("--");
if (split < 0 || split === argv.length - 1) die("usage: land.cjs --message-file <file> [--plan <plan>] -- <path> ...");
const options = argv.slice(0, split);
const paths = argv.slice(split + 1).map((p) => p.replace(/\\/g, "/").replace(/^\.\//, ""));
const option = (name) => { const i = options.indexOf(name); return i >= 0 ? options[i + 1] : undefined; };

const messageFile = option("--message-file");
if (!messageFile || !fs.existsSync(messageFile)) die("--message-file must name a file written with the Write tool.");

if (git("rev-parse", "--show-toplevel").includes(".claude/worktrees/agent-")) die("this is an agent worktree, not the project's main checkout.");
const branch = git("branch", "--show-current").trim();
if (branch !== "main" && branch !== "master") die(`HEAD is on "${branch || "a detached commit"}", not the default branch.`);
const CHURN = new Set(["next-env.d.ts", "tsconfig.json"]);

const untracked = [];
for (const p of paths) {
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) die(`${p} is a folder; name the files, so scratch files cannot ride along.`);
  if (CHURN.has(p) && !options.includes("--allow-churn")) die(`${p} is dev-server churn (web-ref-deploy-landing section 7); pass --allow-churn for a real change.`);
  const status = git("status", "--porcelain", "--", p);
  if (!status.trim()) die(`${p} has no change to commit. Was its edit lost, or the path misspelled?`);
  if (status.split("\n").some((l) => l.startsWith("??"))) untracked.push(p);
}
if (untracked.length) git("add", "--", ...untracked);

try {
  git("commit", "-q", "-F", messageFile, "--", ...paths);
} catch (e) {
  die("git commit failed: " + String(e.stderr || e.message).trim());
}

const committed = git("show", "--name-only", "--format=", "HEAD").split("\n").filter(Boolean);
console.log(`committed ${git("rev-parse", "--short", "HEAD").trim()}, ${committed.length} files:`);
for (const f of committed) console.log("  " + f);

const plan = option("--plan");
if (plan && fs.existsSync(plan)) {
  const text = fs.readFileSync(plan, "utf8");
  const outside = committed.filter((f) => f !== plan && !text.includes(f) && !f.startsWith("docs/plans/") && !f.startsWith(".claude/memory/"));
  if (outside.length) console.log("not named in the plan, check these belong:\n  " + outside.join("\n  "));
}
const left = git("diff", "--cached", "--name-only").split("\n").filter(Boolean);
if (left.length) console.log("still staged, not in this commit:\n  " + left.join("\n  "));

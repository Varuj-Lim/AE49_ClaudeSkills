#!/usr/bin/env node
// ae49-task-usage-report — weekly Claude Code token use per project, across machines.
//
// Reads this machine's transcripts (~/.claude/projects/**/*.jsonl), totals tokens per
// Thai calendar day x project x model, merges them into the private sync clone
// (~/.claude/usage-sync/machines/<hostname>.json), pushes, then reports every machine's
// numbers together by ISO week (Mon–Sun, Thai time). Numbers only — no conversation text.
//
//   node usage.cjs                      this week's report (syncs first)
//   node usage.cjs --week last          last week
//   node usage.cjs --week 2026-W45      a named ISO week
//   node usage.cjs --weeks 4            the last 4 weeks, one table each
//   node usage.cjs --limit-percent 62   also split the weekly-limit % read from claude.ai
//   node usage.cjs --by-model           add a per-model breakdown under each table
//   node usage.cjs --no-sync            local numbers only, touch no git
//   node usage.cjs --sync --quiet       sync only, print nothing (the daily hook)
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const HOME = os.homedir();
const PROJECTS_DIR = path.join(HOME, ".claude", "projects");
const SYNC_DIR = process.env.AE49_USAGE_SYNC || path.join(HOME, ".claude", "usage-sync");
const MACHINE = os.hostname();
const ICT_MS = 7 * 3600 * 1000;
const DAY_MS = 86400000;
const LOCK_STALE_MS = 10 * 60 * 1000;

// USD per million tokens (Anthropic list prices, claude-api skill table cached 2026-10-06).
// Used only as WEIGHTS so a cache read does not count like an output token. cacheRead
// defaults to 0.1 x input; cache writes are 1.25 x input (5 min) and 2 x input (1 h).
const PRICES = {
  "claude-fable-5-1": { input: 10, output: 50, cacheRead: 0.25 },
  "claude-fable-5": { input: 10, output: 50 },
  "claude-opus-5-5": { input: 4, output: 20, cacheRead: 0.2 },
  "claude-opus-5": { input: 5, output: 25 },
  "claude-opus-4-8": { input: 5, output: 25 },
  "claude-opus-4-7": { input: 5, output: 25 },
  "claude-opus-4-6": { input: 5, output: 25 },
  "claude-sonnet-5-5": { input: 2, output: 10, cacheRead: 0.2 },
  "claude-sonnet-5": { input: 2, output: 10 },
  "claude-sonnet-4-6": { input: 3, output: 15 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5 },
  "claude-haiku-4-5": { input: 1, output: 5 },
};
// An id not in the table is priced as the newest model of its family.
const FAMILY_FALLBACK = {
  fable: "claude-fable-5-1",
  opus: "claude-opus-5-5",
  sonnet: "claude-sonnet-5-5",
  haiku: "claude-haiku-5-5",
};

function args() {
  const a = process.argv.slice(2);
  const o = { week: "this", weeks: 1, sync: true, syncOnly: false, quiet: false, limitPercent: null, byModel: false };
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === "--week") o.week = a[++i];
    else if (k === "--weeks") o.weeks = Math.max(1, parseInt(a[++i], 10) || 1);
    else if (k === "--limit-percent") o.limitPercent = parseFloat(a[++i]);
    else if (k === "--by-model") o.byModel = true;
    else if (k === "--no-sync") o.sync = false;
    else if (k === "--sync") o.syncOnly = true;
    else if (k === "--quiet") o.quiet = true;
    else if (k === "--help" || k === "-h") {
      console.log(fs.readFileSync(__filename, "utf8").split("\n").slice(1, 16).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
      process.exit(0);
    } else {
      console.error(`unknown option: ${k} (try --help)`);
      process.exit(2);
    }
  }
  return o;
}

// ---- days and weeks (Thai time) ----------------------------------------------------------

// The Thai calendar day of an instant, as YYYY-MM-DD.
const dayOf = (ms) => new Date(ms + ICT_MS).toISOString().slice(0, 10);

// The ISO week (YYYY-Www) a Thai calendar day belongs to.
function weekOfDay(day) {
  const d = new Date(`${day}T00:00:00Z`);
  const wd = (d.getUTCDay() + 6) % 7; // Mon = 0
  const thursday = new Date(d.getTime() + (3 - wd) * DAY_MS);
  const year = thursday.getUTCFullYear();
  // The ISO week is the week of its Thursday: count whole weeks from 1 January.
  const week = 1 + Math.floor((thursday - Date.UTC(year, 0, 1)) / DAY_MS / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

// Monday (YYYY-MM-DD, Thai calendar) of an ISO week key.
function mondayOf(key) {
  const [y, w] = key.split("-W").map(Number);
  const jan4 = Date.UTC(y, 0, 4);
  const mon1 = jan4 - ((new Date(jan4).getUTCDay() + 6) % 7) * DAY_MS;
  return new Date(mon1 + (w - 1) * 7 * DAY_MS).toISOString().slice(0, 10);
}

const addDays = (day, n) => new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);

function weekKeys(o) {
  const today = dayOf(Date.now());
  let start;
  if (o.week === "this") start = weekOfDay(today);
  else if (o.week === "last") start = weekOfDay(addDays(today, -7));
  else if (/^\d{4}-W\d{2}$/.test(o.week) && weekOfDay(mondayOf(o.week)) === o.week) start = o.week;
  else {
    console.error(`--week takes this, last or an existing ISO week YYYY-Www, not "${o.week}"`);
    process.exit(2);
  }
  const keys = [];
  for (let i = 0; i < o.weeks; i++) keys.push(weekOfDay(addDays(mondayOf(start), -7 * i)));
  return keys;
}

// ---- reading this machine's transcripts --------------------------------------------------

function listJsonl(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listJsonl(p, out);
    else if (e.isFile() && e.name.endsWith(".jsonl")) out.push(p);
  }
  return out;
}

// A project's KEY is its folder name lowercased, with every character but a letter or digit
// turned into "-" (as Claude Code names ~/.claude/projects folders). Windows paths ignore
// case, so "Nuri_Hub" and "NURI_Hub" share one folder; the lowercasing makes them one key
// on every machine. Its display NAME is the spelling of the newest session there.
const projectKey = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "-");

// The project is the folder a session was opened in: read from the first `cwd` of the
// newest top-level transcript in its ~/.claude/projects folder (sub-agent transcripts sit
// inside their parent's). A line's own cwd is not used: it follows every `cd`. An agent
// worktree path counts for its hub.
const projectByFolder = {};
function projectOf(file) {
  const folder = path.relative(PROJECTS_DIR, file).split(path.sep)[0];
  if (folder in projectByFolder) return projectByFolder[folder];
  const dir = path.join(PROJECTS_DIR, folder);
  let tops = [];
  try {
    tops = fs
      .readdirSync(dir)
      .filter((n) => n.endsWith(".jsonl"))
      .map((n) => {
        try {
          return { n, t: fs.statSync(path.join(dir, n)).mtimeMs };
        } catch {
          return null; // deleted meanwhile — one lost file must not rename the project
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.t - a.t);
  } catch {}
  let name = folder;
  for (const { n } of tops) {
    let cwd = null;
    try {
      const m = fs.readFileSync(path.join(dir, n), "utf8").match(/"cwd":"((?:[^"\\]|\\.)*)"/);
      if (m) cwd = JSON.parse(`"${m[1]}"`);
    } catch {}
    if (!cwd) continue;
    const base = cwd.replace(/\\/g, "/").replace(/\/\.claude\/worktrees\/.*$/, "").replace(/\/+$/, "").split("/").pop();
    if (base) {
      name = base;
      break;
    }
  }
  return (projectByFolder[folder] = { key: projectKey(name), name });
}

function emptyCounts() {
  return { input: 0, output: 0, cacheWrite5m: 0, cacheWrite1h: 0, cacheRead: 0, messages: 0 };
}

function readLocal() {
  const days = {};
  const names = {};
  const seen = new Map(); // response id -> { c, output } as counted
  for (const file of listJsonl(PROJECTS_DIR, [])) {
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const line of text.split("\n")) {
      if (!line.includes('"usage"') || !line.includes('"assistant"')) continue;
      let o;
      try {
        o = JSON.parse(line);
      } catch {
        continue;
      }
      const m = o.message;
      if (o.type !== "assistant" || !m || !m.usage || !o.timestamp) continue;
      const model = String(m.model || "").replace(/\[.*\]$/, "");
      if (!model || model === "<synthetic>") continue;
      const u = m.usage;
      const output = Number(u.output_tokens) || 0;
      // One API response is written as several lines (one per content block). Count it
      // once; older Claude Code versions wrote a partial output count on the first line,
      // so a later, larger count tops it up.
      const id = m.id ? `${m.id}:${o.requestId || ""}` : o.uuid;
      const prev = id && seen.get(id);
      if (prev) {
        if (output > prev.output) {
          prev.c.output += output - prev.output;
          prev.output = output;
        }
        continue;
      }
      const ms = Date.parse(o.timestamp);
      if (Number.isNaN(ms)) continue;
      const cw1h = Number((u.cache_creation || {}).ephemeral_1h_input_tokens) || 0;
      const cwTotal = Number(u.cache_creation_input_tokens) || 0;
      const { key, name } = projectOf(file);
      names[key] = name;
      const d = (days[dayOf(ms)] ||= {});
      const p = (d[key] ||= {});
      const c = (p[model] ||= emptyCounts());
      c.input += Number(u.input_tokens) || 0;
      c.output += output;
      c.cacheWrite1h += cw1h;
      c.cacheWrite5m += Math.max(0, cwTotal - cw1h);
      c.cacheRead += Number(u.cache_read_input_tokens) || 0;
      c.messages += 1;
      if (id) seen.set(id, { c, output });
    }
  }
  return { days, names };
}

// ---- merging with what this machine stored before ----------------------------------------

const tokenSum = (c) => c.input + c.output + c.cacheWrite5m + c.cacheWrite1h + c.cacheRead;

// Fold project keys written under another spelling into the current key.
function normalizeDays(days) {
  const out = {};
  for (const [day, projects] of Object.entries(days || {})) {
    for (const [project, models] of Object.entries(projects)) {
      for (const [model, c] of Object.entries(models)) {
        const p = ((out[day] ||= {})[projectKey(project)] ||= {});
        if (!p[model] || tokenSum(c) > tokenSum(p[model])) p[model] = c;
      }
    }
  }
  return out;
}

// Claude Code deletes old transcripts (cleanupPeriodDays), so a fresh count of an older
// day can only shrink. Per day x project x model keep whichever count is larger. A day
// is complete once synced after it ended, and its files outlive it by the cleanup period.
function mergeMax(stored, fresh) {
  const out = normalizeDays(stored);
  for (const [day, projects] of Object.entries(fresh)) {
    for (const [project, models] of Object.entries(projects)) {
      for (const [model, c] of Object.entries(models)) {
        const p = ((out[day] ||= {})[project] ||= {});
        if (!p[model] || tokenSum(c) >= tokenSum(p[model])) p[model] = c;
      }
    }
  }
  return out;
}

// ---- the sync clone -----------------------------------------------------------------------

function git(argv, quiet) {
  return execFileSync("git", argv, {
    cwd: SYNC_DIR,
    encoding: "utf8",
    timeout: 30000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    stdio: ["ignore", "pipe", quiet ? "ignore" : "pipe"],
  });
}

// One sync at a time on this clone (the hook can fire from several sessions at once).
function takeLock() {
  const lock = path.join(SYNC_DIR, ".git", "ae49-usage.lock");
  try {
    if (Date.now() - fs.statSync(lock).mtimeMs > LOCK_STALE_MS) fs.unlinkSync(lock);
  } catch {}
  try {
    fs.closeSync(fs.openSync(lock, "wx"));
    return () => {
      try {
        fs.unlinkSync(lock);
      } catch {}
    };
  } catch {
    return null;
  }
}

// Undo what an interrupted run can leave behind, so one bad run never blocks every later one.
function repairClone(o) {
  const g = path.join(SYNC_DIR, ".git");
  const indexLock = path.join(g, "index.lock");
  try {
    if (Date.now() - fs.statSync(indexLock).mtimeMs > LOCK_STALE_MS) fs.unlinkSync(indexLock);
  } catch {}
  if (fs.existsSync(path.join(g, "rebase-merge")) || fs.existsSync(path.join(g, "rebase-apply"))) {
    try {
      git(["rebase", "--abort"], o.quiet);
    } catch {}
  }
}

function sync(fresh, o) {
  const warn = (msg) => {
    if (!o.quiet) console.error(`note: ${msg}`);
  };
  if (!fs.existsSync(path.join(SYNC_DIR, ".git"))) {
    warn(`no sync clone at ${SYNC_DIR} — showing this machine only. Set it up once: gh repo clone AE49_Usage "${SYNC_DIR}"`);
    return false;
  }
  const release = takeLock();
  if (!release) {
    warn("another sync is running — showing what the clone holds now");
    return true;
  }
  try {
    repairClone(o);
    let hasCommits = true;
    try {
      git(["rev-parse", "--verify", "HEAD"], true);
    } catch {
      hasCommits = false;
    }
    if (hasCommits) {
      try {
        git(["pull", "--rebase", "--autostash", "--quiet"], o.quiet);
      } catch {
        warn("git pull failed (offline?) — the other machine's numbers may be old");
        repairClone(o);
      }
    }
    const dir = path.join(SYNC_DIR, "machines");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${MACHINE}.json`);
    let stored = {};
    try {
      stored = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {}
    const merged = {
      machine: MACHINE,
      updatedAt: new Date().toISOString(),
      names: { ...(stored.names || {}), ...fresh.names },
      days: mergeMax(stored.days, fresh.days),
    };
    fs.writeFileSync(file, JSON.stringify(merged, null, 1) + "\n");
    try {
      git(["add", path.join("machines", `${MACHINE}.json`)], o.quiet);
      git(["commit", "--quiet", "-m", `usage: ${MACHINE} ${merged.updatedAt.slice(0, 16)}Z`], true);
    } catch {}
    try {
      git(["push", "--quiet", "-u", "origin", "HEAD"], o.quiet);
    } catch {
      warn("git push failed (offline?) — this machine's numbers stay local until the next run");
    }
    return true;
  } finally {
    release();
  }
}

function readAllMachines(fresh, synced) {
  const all = { [MACHINE]: { updatedAt: new Date().toISOString(), names: fresh.names, days: fresh.days } };
  if (!synced) return all;
  const dir = path.join(SYNC_DIR, "machines");
  for (const name of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    if (!name.endsWith(".json")) continue;
    try {
      const m = JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
      const mc = m.machine || name.replace(/\.json$/, "");
      // This machine: the stored file plus today's fresh count (the file may predate it when
      // another sync held the lock); it also holds days already cleaned up here.
      all[mc] = { ...m, days: mc === MACHINE ? mergeMax(m.days, fresh.days) : normalizeDays(m.days), oldFormat: !m.days };
    } catch {}
  }
  return all;
}

// ---- report --------------------------------------------------------------------------------

function priceOf(model) {
  if (PRICES[model]) return { p: PRICES[model], exact: true };
  const fam = Object.keys(FAMILY_FALLBACK).find((f) => model.includes(f));
  return { p: PRICES[fam ? FAMILY_FALLBACK[fam] : "claude-opus-5-5"], exact: false };
}

function costOf(model, c) {
  const { p } = priceOf(model);
  const cr = p.cacheRead ?? p.input * 0.1;
  return (c.input * p.input + c.output * p.output + c.cacheWrite5m * p.input * 1.25 + c.cacheWrite1h * p.input * 2 + c.cacheRead * cr) / 1e6;
}

const fmtTok = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}k` : String(n));
const fmtPct = (x) => `${(x * 100).toFixed(1)}%`;
const fmtIct = (iso) => (iso ? new Date(Date.parse(iso) + ICT_MS).toISOString().slice(0, 16).replace("T", " ") : "?");

function report(all, keys, o) {
  // Display names: the most recently updated machine's spelling wins.
  const names = {};
  for (const m of Object.values(all).sort((a, b) => String(a.updatedAt).localeCompare(String(b.updatedAt)))) {
    for (const [k, v] of Object.entries(m.names || {})) names[projectKey(k)] = v;
  }
  const unpriced = new Set();
  for (const key of keys) {
    const mon = mondayOf(key);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
    const rows = {}; // project key -> { cost, output, byMachine, byModel }
    for (const [machine, m] of Object.entries(all)) {
      for (const day of weekDays) {
        for (const [project, models] of Object.entries((m.days || {})[day] || {})) {
          const r = (rows[project] ||= { cost: 0, output: 0, byMachine: {}, byModel: {} });
          for (const [model, c] of Object.entries(models)) {
            if (!priceOf(model).exact) unpriced.add(model);
            const cost = costOf(model, c);
            r.cost += cost;
            r.output += c.output;
            r.byMachine[machine] = (r.byMachine[machine] || 0) + cost;
            r.byModel[model] = (r.byModel[model] || 0) + cost;
          }
        }
      }
    }
    const total = Object.values(rows).reduce((s, r) => s + r.cost, 0);
    console.log(`\n## ${key} (${mon} – ${weekDays[6]}, Thai time)\n`);
    if (!total) {
      console.log("No usage recorded for this week.");
      continue;
    }
    const limitCol = o.limitPercent != null;
    console.log(`| # | Project | Share | API-equivalent | Output tokens |${limitCol ? " Of weekly limit |" : ""} By machine |`);
    console.log(`|---|---|---|---|---|${limitCol ? "---|" : ""}---|`);
    const sorted = Object.entries(rows).sort((a, b) => b[1].cost - a[1].cost);
    sorted.forEach(([project, r], i) => {
      const share = r.cost / total;
      const machines = Object.entries(r.byMachine)
        .sort((a, b) => b[1] - a[1])
        .map(([mc, v]) => `${mc} ${fmtPct(v / r.cost)}`)
        .join(" · ");
      const lim = limitCol ? ` ${(share * o.limitPercent).toFixed(1)}% |` : "";
      console.log(`| ${i + 1} | ${names[project] || project} | ${fmtPct(share)} | $${r.cost.toFixed(2)} | ${fmtTok(r.output)} |${lim} ${machines} |`);
    });
    const totalOut = sorted.reduce((s, [, r]) => s + r.output, 0);
    console.log(`| | **Total** | 100% | $${total.toFixed(2)} | ${fmtTok(totalOut)} |${limitCol ? ` ${o.limitPercent}% |` : ""} |`);
    if (o.byModel) {
      console.log("");
      for (const [project, r] of sorted) {
        const parts = Object.entries(r.byModel)
          .sort((a, b) => b[1] - a[1])
          .map(([md, v]) => `${md} ${fmtPct(v / r.cost)}`)
          .join(" · ");
        console.log(`- ${names[project] || project}: ${parts}`);
      }
    }
  }
  console.log("");
  console.log(
    `Machines (last update, Thai time): ${Object.entries(all)
      .map(([mc, m]) => `${mc} ${fmtIct(m.updatedAt)}${m.oldFormat ? " (old script's format — not counted until it updates)" : ""}`)
      .join(" · ")}`,
  );
  if (unpriced.size) console.log(`Priced by family (not in the table): ${[...unpriced].join(", ")}`);
}

// ---- main ----------------------------------------------------------------------------------

function main() {
  const o = args();
  const keys = o.syncOnly ? [] : weekKeys(o);
  const fresh = readLocal();
  let synced = false;
  if (o.sync || o.syncOnly) {
    try {
      synced = sync(fresh, o);
    } catch (e) {
      if (!o.quiet) console.error(`note: sync failed — ${e.message}`);
    }
  }
  if (o.syncOnly) return;
  report(readAllMachines(fresh, synced), keys, o);
}

main();

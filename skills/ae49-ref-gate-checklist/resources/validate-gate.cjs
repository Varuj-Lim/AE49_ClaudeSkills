#!/usr/bin/env node
// validate-gate.cjs — check a project's docs/gate-checklist.js against ae49-ref-gate-checklist.
//
// Usage:  node validate-gate.cjs <path/to/docs/gate-checklist.js>
// Exit 0 = every checkable rule holds (warnings may still print). Exit 1 = a rule is broken.
//
// It checks what a machine CAN check. It cannot judge whether an item is a full sentence,
// whether a value on screen is quoted, or whether the account named is the right one —
// those stay the author's job. Run it after EVERY write of the file.
"use strict";
const fs = require("fs");
const vm = require("vm");

const file = process.argv[2];
if (!file) { console.error("usage: node validate-gate.cjs <docs/gate-checklist.js>"); process.exit(2); }

const src = fs.readFileSync(file, "utf8");
const sandbox = { window: {} };
try { vm.runInNewContext(src, sandbox, { filename: file }); }
catch (e) { console.error("FAIL  the file does not run as JavaScript: " + e.message); process.exit(1); }
const d = sandbox.window.GATE_CHECKLIST;
if (!d || typeof d !== "object") { console.error("FAIL  window.GATE_CHECKLIST is not set"); process.exit(1); }

const errors = [], warns = [];
const err = (m) => errors.push(m), warn = (m) => warns.push(m);

// One circled numeral: ①…⑳ U+2460–2473, ㉑…㉟ U+3251–325F, ㊱…㊿ U+32B1–32BF.
const CIRCLED = "[①-⑳㉑-㉟㊱-㊿]";
const TAGS = /^\[(EMU|PRD|APH)\] \([^)]+\) \{[^}]+\}/;

if (!d.feature) err("`feature` is missing");
if (!d.title) err("`title` is missing");

if (d.closed) {
  // CLOSED payload — grammar per web-ref-gate-closed-format.
  if (!Array.isArray(d.items) || d.items.length) err("a closed payload must have `items: []`");
  const re = new RegExp(
    "^\\S+ landed \\d{4}-\\d{2}-\\d{2} \\(gate \\d+/\\d+( dev \\+ \\d+/\\d+ prod)?; " +
    "(commit [0-9a-f]{7,40}|commits [0-9a-f]{7,40}(/[0-9a-f]{7,40}){1,3}|commits [0-9a-f]{7,40}…[0-9a-f]{7,40} \\(\\d+\\))" +
    "(; deployed [a-z+]+)?\\)$");
  if (!re.test(d.closed)) err("`closed` does not match the grammar: " + JSON.stringify(d.closed));
  if (/\bnot deployed\b|DONE|shipped/i.test(d.closed)) err("`closed` uses a forbidden word (the verb is always `landed`; omit the deployed slot rather than writing \"not deployed\")");
} else {
  // OPEN payload.
  if (!new RegExp(CIRCLED).test(d.title)) err("`title` must carry the gate's circled numeral");
  if (!/EMULATOR|PRODUCTION|App Hosting|APH/i.test(d.title)) err("`title` must state the environment (e.g. \"ทั้งหมดบน EMULATOR http://localhost:<port>\")");
  if (!Array.isArray(d.items) || !d.items.length) err("an open payload needs items");
  const items = Array.isArray(d.items) ? d.items : [];
  if (items.length && !String(items[0]).startsWith("## ")) err("the first item must be a section heading `## <circled numeral> <feature> — <what it proves>`");

  let section = null, parents = 0, subs = 0, sectionCount = 0;
  const closeSection = () => {
    if (section === null) return;
    if (parents === 0) err(`section "${section}" has no items`);
    if (parents > 7) err(`section "${section}" has ${parents} parent items — the budget is 5–7, never more; condense before handing it over`);
    else if (parents < 5 && parents > 0) warn(`section "${section}" has ${parents} parent items (budget aims for 5–7; fine for a tiny fix)`);
  };
  items.forEach((raw, i) => {
    const it = String(raw), n = i + 1;
    if (it.startsWith("## ")) {
      closeSection();
      section = it.slice(3, 60); parents = 0; subs = 0; sectionCount++;
      if (!new RegExp("^## " + CIRCLED + " ").test(it)) err(`item ${n}: a section heading must start "## <circled numeral> " — got ${JSON.stringify(it.slice(0, 40))}`);
      if (!/ — /.test(it)) warn(`item ${n}: a section heading reads "<feature> — <what it proves>"`);
      return;
    }
    if (section === null) err(`item ${n}: an item before any section heading`);
    if (it.startsWith("- ")) {
      if (parents === 0) err(`item ${n}: a sub-step before any parent item`);
      subs++;
      if (subs > 5) err(`item ${n}: more than 5 sub-steps under one parent`);
      const body = it.slice(2);
      if (/^\[(EMU|PRD|APH)\]/.test(body) && !TAGS.test(body)) err(`item ${n}: a sub-step that overrides the tags must give all three: [ENV] (account) {Nav -> Page}`);
    } else {
      parents++; subs = 0;
      if (!TAGS.test(it)) err(`item ${n}: a parent item must open with the three tags [EMU|PRD|APH] (account) {Nav -> Page} — got ${JSON.stringify(it.slice(0, 50))}`);
      if (/\((ANY|คน [A-Zก-ฮ]|a non-)/.test(it.slice(0, 40))) warn(`item ${n}: the account tag looks like a placeholder; name the exact account`);
    }
    // The page renders text with textContent: markdown shows literally.
    if (/\*\*[^*]+\*\*/.test(it)) warn(`item ${n}: **bold** renders as literal asterisks on the page`);
    if (/`[^`]+`/.test(it)) warn(`item ${n}: backticks render literally on the page — quote values with "…" instead`);
  });
  closeSection();
  if (!sectionCount) err("no section heading found");
}

const kind = d.closed ? "CLOSED" : "OPEN";
for (const w of warns) console.log("warn  " + w);
for (const e of errors) console.log("FAIL  " + e);
if (errors.length) { console.log(`\n${kind} payload: ${errors.length} rule(s) broken — fix before handing the gate over.`); process.exit(1); }
if (!d.closed) {
  const items = d.items || [];
  const p = items.filter((x) => !String(x).startsWith("## ") && !String(x).startsWith("- ")).length;
  const s = items.filter((x) => String(x).startsWith("- ")).length;
  const h = items.filter((x) => String(x).startsWith("## ")).length;
  console.log(`OK    OPEN payload: ${h} section(s), ${p} parent item(s), ${s} sub-step(s), ${p + s} ticks.`);
} else {
  console.log("OK    CLOSED payload: " + d.closed);
}

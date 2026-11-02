#!/usr/bin/env node
// Checks every <dir>/<skill>/SKILL.md frontmatter, because a skill whose YAML does not parse loses its
// description and with it the words that trigger the skill.
// Usage: node validate-skills.cjs [skillsDir ...]   (default: ~/.claude/skills). Exit 1 on any error.
const fs = require("fs");
const os = require("os");
const path = require("path");

const DESCRIPTION_WARN_CHARS = 1024;

// A plain (unquoted) YAML value breaks on ": " or " #", or on a leading indicator character.
function plainScalarProblem(value) {
  if (/^[\[{].*[\]}]$/.test(value)) return null; // a one-line flow list or map
  if (/:\s/.test(value)) return 'contains ": "';
  if (/\s#/.test(value)) return 'contains " #"';
  if (/:$/.test(value)) return 'ends with ":"';
  if (/^[\[\]{},#&*!%@`?]/.test(value) || /^- /.test(value)) return `starts with "${value[0]}"`;
  return null;
}

const DOUBLE_QUOTE_ESCAPE = /^(?:[0abt\tnvfre "\/\\N_LP]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})/;

function doubleQuotedProblem(value) {
  for (let i = 1; i < value.length; i++) {
    if (value[i] === "\\") {
      if (!DOUBLE_QUOTE_ESCAPE.test(value.slice(i + 1))) return `has the bad escape \\${value[i + 1] ?? ""}`;
      i += value[i + 1] === "x" ? 3 : value[i + 1] === "u" ? 5 : value[i + 1] === "U" ? 9 : 1;
    } else if (value[i] === '"') {
      return /^\s*(#.*)?$/.test(value.slice(i + 1)) ? null : "has text after the closing quote";
    }
  }
  return "quote is not closed";
}

function singleQuotedProblem(value) {
  for (let i = 1; i < value.length; i++) {
    if (value[i] !== "'") continue;
    if (value[i + 1] === "'") { i++; continue; }
    return /^\s*(#.*)?$/.test(value.slice(i + 1)) ? null : "has text after the closing quote";
  }
  return "quote is not closed";
}

function valueProblem(value) {
  if (value[0] === '"') return doubleQuotedProblem(value);
  if (value[0] === "'") return singleQuotedProblem(value);
  return plainScalarProblem(value);
}

// The text a field holds, counting a block value's indented lines and dropping quotes.
function fieldText(value, following) {
  if (/^[>|]/.test(value)) return following.join(" ").trim();
  return value.replace(/^["']|["']\s*(#.*)?$/g, "");
}

function checkSkill(dir, name) {
  const errors = [];
  const warnings = [];
  const text = fs.readFileSync(path.join(dir, name, "SKILL.md"), "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { errors: ["no frontmatter"], warnings };

  const fields = {};
  const lines = match[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const field = lines[i].match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (!field) {
      if (lines[i].trim() && !/^\s+/.test(lines[i])) errors.push(`line is not "key: value": ${lines[i].slice(0, 40)}`);
      continue;
    }
    const value = field[2].trim();
    const following = [];
    while (i + 1 < lines.length && (/^\s+/.test(lines[i + 1]) || !lines[i + 1].trim())) following.push(lines[++i].trim());
    if (field[1] in fields) errors.push(`${field[1]} appears twice`);
    fields[field[1]] = fieldText(value, following);
    if (!value) {
      if (following.join("").trim()) errors.push(`${field[1]}: put the value on the key's line or use a block value (>-)`);
      continue;
    }
    if (/^[>|]/.test(value)) continue;
    const problem = valueProblem(value);
    if (problem) errors.push(`${field[1]}: ${problem}${value[0] === '"' || value[0] === "'" ? "" : ", quote the value"}`);
    else if (following.join("").trim()) errors.push(`${field[1]}: a value on several lines, use a block value (>-)`);
  }

  if (!fields.name) errors.push("no name");
  else if (fields.name !== name) errors.push(`name "${fields.name}" differs from the folder`);
  if (!fields.description) errors.push("no description");
  else if (fields.description.length > DESCRIPTION_WARN_CHARS) warnings.push(`description is ${fields.description.length} chars`);
  return { errors, warnings };
}

const dirs = process.argv.slice(2);
if (dirs.length === 0) dirs.push(path.join(os.homedir(), ".claude", "skills"));

let errorCount = 0;
let warningCount = 0;
let skillCount = 0;
for (const dir of dirs) {
  for (const name of fs.readdirSync(dir).sort()) {
    if (!fs.existsSync(path.join(dir, name, "SKILL.md"))) continue;
    skillCount++;
    const { errors, warnings } = checkSkill(dir, name);
    for (const e of errors) console.log(`ERROR ${name}: ${e}`);
    for (const w of warnings) console.log(`warn  ${name}: ${w}`);
    errorCount += errors.length;
    warningCount += warnings.length;
  }
}
console.log(`${skillCount} skills, ${errorCount} errors, ${warningCount} warnings`);
process.exit(errorCount ? 1 : 0);

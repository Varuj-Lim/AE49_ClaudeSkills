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
  if (/:\s/.test(value)) return 'contains ": "';
  if (/\s#/.test(value)) return 'contains " #"';
  if (/:$/.test(value)) return 'ends with ":"';
  if (/^[\[\]{}>|*&!%@`,#?-]\s?/.test(value)) return `starts with "${value[0]}"`;
  return null;
}

function quotedProblem(value) {
  const quote = value[0];
  if (value.length < 2 || !value.endsWith(quote)) return "quote is not closed";
  const inner = value.slice(1, -1);
  if (quote === '"' && /(^|[^\\])(\\\\)*"/.test(inner)) return 'has an unescaped " inside';
  if (quote === "'" && /'/.test(inner.replace(/''/g, ""))) return "has an unescaped ' inside";
  return null;
}

function checkSkill(dir, name) {
  const errors = [];
  const warnings = [];
  const text = fs.readFileSync(path.join(dir, name, "SKILL.md"), "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { errors: ["no frontmatter"], warnings };

  const fields = {};
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const field = line.match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (!field) continue;
    fields[field[1]] = field[2];
    const value = field[2].trim();
    if (!value || /^[>|]/.test(value)) continue;
    const problem = /^["']/.test(value) ? quotedProblem(value) : plainScalarProblem(value);
    if (problem) errors.push(`${field[1]}: ${problem}, quote the value`);
  }

  if (!fields.name) errors.push("no name");
  else if (fields.name.trim().replace(/^["']|["']$/g, "") !== name) errors.push(`name "${fields.name}" differs from the folder`);
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

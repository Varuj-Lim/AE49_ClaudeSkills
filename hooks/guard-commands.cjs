// PreToolUse hook for Bash and PowerShell: asks the owner before a command that deploys, writes real data or
// destroys work. It asks rather than blocks; a push to the deploy branch does not ask (owner 2026-11-02 Q393 b), a force push does; only a bare emulators:exec is refused, since a safe form exists. It is a net
// for slips, not a security boundary: a script that pushes from inside is not seen.
const path = require("path");

const REFUSE = "refuse: ";
const SHELLS = new Set(["bash", "sh", "zsh", "powershell", "pwsh", "cmd"]);

function withoutHereDocs(command) {
  return command
    .replace(/@'[\s\S]*?\n'@/g, "''")
    .replace(/@"[\s\S]*?\n"@/g, "''")
    .replace(/<<-?\s*['"]?(\w+)['"]?[^\n]*\n[\s\S]*?\n\s*\1\b/g, " ");
}

// Splits into commands, each a list of words, honouring quotes. Quoted text stays one word, so a commit message
// cannot read as a command. Returns null on an unclosed quote.
function parse(command, backslashEscapes) {
  const commands = [[]];
  let word = null;
  let quote = null;
  const endWord = () => {
    if (word !== null) commands[commands.length - 1].push(word);
    word = null;
  };
  for (let i = 0; i < command.length; i++) {
    const c = command[i];
    if (!quote && (c === "\\" || c === "`") && (command[i + 1] === "\n" || command.slice(i + 1, i + 3) === "\r\n")) {
      i += command[i + 1] === "\n" ? 1 : 2;
      endWord();
      continue;
    }
    if (quote) {
      if (c === "\\" && quote === '"' && backslashEscapes && '"\\$`'.includes(command[i + 1] ?? " ")) word += command[++i];
      else if (c === "`" && quote === '"' && !backslashEscapes && command[i + 1] === '"') word += command[++i];
      else if (c === quote) quote = null;
      else word += c;
    } else if (c === '"' || c === "'") {
      quote = c;
      word = word ?? "";
    } else if (c === "&" && word !== null && /[<>]$/.test(word)) {
      word += c; // 2>&1
    } else if (c === ";" || c === "\n" || c === "|" || c === "(" || c === ")" || c === "{" || c === "}" ||
               (c === "&" && (command[i + 1] === "&" || word !== null || commands[commands.length - 1].length > 0))) {
      if ((c === "(" || c === "{" ) && word !== null && word.endsWith("$")) { word += c; continue; }
      endWord();
      if (command[i + 1] === c) i++;
      commands.push([]);
    } else if (/\s/.test(c)) {
      endWord();
    } else {
      word = (word ?? "") + c;
    }
  }
  if (quote) return null;
  endWord();
  return commands.filter((words) => words.length);
}

const baseName = (word) => path.win32.basename(word).toLowerCase().replace(/\.(exe|cmd|ps1)$/, "");

function pushReason(args) {
  if (args.some((a) => /^(--force|--force-with-lease|--force-if-includes|-[a-z]*f[a-z]*)(=|$)/.test(a) || a.startsWith("+"))) {
    return "force push: this overwrites history on the remote";
  }
  return null;
}

// A word may name a variable set earlier in the same command.
function expand(word, vars) {
  return word.replace(/\$\{?(\w+)\}?/g, (whole, name) => vars[name] ?? whole);
}

function gitReason(words) {
  let i = 1;
  while (i < words.length && words[i].startsWith("-")) i += words[i] === "-C" || words[i] === "-c" ? 2 : 1;
  const args = words.slice(i + 1);
  if (words[i] === "push") return pushReason(args);
  if (words[i] === "reset" && args.includes("--hard")) return "git reset --hard: this discards uncommitted work";
  return null;
}

function commandReason(words, cwd, backslashEscapes, vars) {
  for (;;) {
    if (["&", "time", "then", "do", "else", "if", "elif", "while", "!"].includes(words[0]) || /^\w+=/.test(words[0] ?? "")) words = words.slice(1);
    else if (words[0] === "timeout" && /^\d/.test(words[1] ?? "")) words = words.slice(2);
    else break;
  }
  if (!words.length) return null;
  const program = baseName(words[0]);

  if (SHELLS.has(program)) {
    const flag = words.findIndex((w) => /^(-c|-lc|-command|\/c)$/i.test(w));
    if (flag >= 0 && words[flag + 1]) return reasonFor(words.slice(flag + 1).join(" "), cwd, backslashEscapes);
    return null;
  }
  if (program === "git") return gitReason(words);

  if (words.map(baseName).some((n) => n === "firebase" || n === "firebase-tools") && words.includes("emulators:exec")) return REFUSE + "a bare emulators:exec can delete the owner's Storage files when it exits; use web-ref-local-emulator/resources/private-suite.ps1";

  const names = words.map(baseName);
  if (names.includes("firebase") || names.includes("firebase-tools")) {
    if (words.includes("deploy") || words.some((w) => /:delete$/.test(w))) return "firebase deploy or delete: this changes production";
  }
  if (program === "gcloud" && words.some((w) => ["deploy", "update", "delete", "execute", "create"].includes(w))) {
    return "gcloud change: this changes production";
  }
  const script = names.find((n) => /\.c?[jt]s$|\.mjs$/.test(n)) ?? "";
  const writes = words.includes("--apply") || (["node", "npx", "npm", "tsx"].includes(program) && words.includes("--commit") && !/^close-gate/.test(script));
  if (writes && !vars.__emulator && !/^emu-sweep/.test(script)) return "this script writes for real; the dry run does not";
  return null;
}

function reasonFor(raw, startCwd, backslashEscapes) {
  const commands = parse(withoutHereDocs(raw), backslashEscapes);
  if (!commands) {
    return /\bpush\b|\bdeploy\b|--apply|--commit|reset\s+--hard/.test(raw) ? "could not read this command's quotes, and it may deploy or write" : null;
  }
  let cwd = startCwd;
  const vars = {};
  for (const rawWords of commands) {
    const words = rawWords.map((w) => expand(w, vars));
    const bashSet = words.length === 1 && words[0].match(/^(\w+)=(.+)$/);
    if (bashSet) { vars[bashSet[1]] = bashSet[2]; if (/^(127\.0\.0\.1|localhost):/.test(vars.FIRESTORE_EMULATOR_HOST ?? "")) vars.__emulator = true; continue; }
    const psSet = words.length === 3 && words[1] === "=" && words[0].match(/^\$(?:env:)?(\w+)$/);
    if (psSet) { vars[psSet[1]] = words[2]; }
    if (/^(127\.0\.0\.1|localhost):/.test(vars.FIRESTORE_EMULATOR_HOST ?? "")) vars.__emulator = true;
    if (psSet) continue;
    const prefix = words.find((w) => /^FIRESTORE_EMULATOR_HOST=(127\.0\.0\.1|localhost):/.test(w));
    if (prefix) vars.__emulator = true;
    if (/^(cd|set-location|sl|chdir)$/i.test(words[0]) && words[1]) {
      cwd = words[words.length - 1];
      continue;
    }
    const reason = commandReason(words, cwd, backslashEscapes, vars);
    if (reason) return reason;
  }
  return null;
}

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let reason = null;
  try {
    const event = JSON.parse(input);
    reason = reasonFor(String(event.tool_input?.command ?? ""), String(event.cwd ?? ""), event.tool_name !== "PowerShell");
  } catch {
    process.exit(0);
  }
  if (reason) {
    const refused = reason.startsWith(REFUSE);
    console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: refused ? "deny" : "ask", permissionDecisionReason: refused ? reason.slice(REFUSE.length) : reason } }));
  }
});

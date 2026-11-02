// PreToolUse hook for Bash and PowerShell: asks the owner before a command that deploys, writes real data
// or destroys work. It asks, never blocks, so an owner-ordered push still goes through with one click.
const DEPLOY_BRANCHES = "main|master";
const NON_DEPLOY_REPOS = /AE49_ClaudeSkills/i;

// Text inside quotes and heredocs is data (a commit message, a grep pattern), so it must not trigger.
function withoutQuotedText(command) {
  return command
    .replace(/@'[\s\S]*?\n'@/g, " ")
    .replace(/@"[\s\S]*?\n"@/g, " ")
    .replace(/<<-?\s*['"]?(\w+)['"]?[\s\S]*?\n\s*\1\b/g, " ")
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/'[^'\n]*'/g, "''");
}

function isDeployPush(command) {
  const push = /\bgit\b[^;&|\n]*?\spush\b([^;&|\n]*)/g;
  let match;
  while ((match = push.exec(command))) {
    const args = match[1].trim().split(/\s+/).filter((a) => a && !a.startsWith("-"));
    if (args.length < 2) return true; // a bare push sends the current branch
    if (args.slice(1).some((ref) => new RegExp(`^(\\+?)(HEAD|[^:]+:)?(refs/heads/)?(${DEPLOY_BRANCHES})$`).test(ref) || ref === "HEAD" || ref.startsWith("+"))) return true;
  }
  return false;
}

function reasonFor(raw, cwd) {
  const command = withoutQuotedText(raw);
  const inNonDeployRepo = NON_DEPLOY_REPOS.test(raw) || NON_DEPLOY_REPOS.test(cwd || "");
  if (/\bgit\b[^;&|\n]*\spush\b[^;&|\n]*\s(--force\b|-f\b|--force-with-lease\b)/.test(command)) return "force push: this overwrites history on the remote";
  if (!inNonDeployRepo && isDeployPush(command)) return "push to the deploy branch: in the hubs this deploys";
  if (/\bfirebase(-tools)?(\.cmd)?\b[^;&|\n]*\sdeploy\b/.test(command)) return "firebase deploy: this changes production";
  if (/\bgcloud\b[^;&|\n]*\s(deploy|update|delete)\b/.test(command)) return "gcloud change: this changes production";
  if (/(^|\s)--apply\b/.test(command)) return "--apply: this script writes for real; the dry run does not";
  if (/\bgit\b[^;&|\n]*\sreset\s+--hard\b/.test(command)) return "git reset --hard: this discards uncommitted work";
  return null;
}

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let reason = null;
  try {
    const event = JSON.parse(input);
    reason = reasonFor(String(event.tool_input?.command ?? ""), event.cwd);
  } catch {
    process.exit(0);
  }
  if (reason) {
    console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "ask", permissionDecisionReason: reason } }));
  }
});

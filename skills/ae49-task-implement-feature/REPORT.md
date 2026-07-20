# Final build report — field set + jargon-free rule

> Step 12 of `ae49-task-implement-feature`. Close out per `ae49-ref-report-format`'s
> shared principles, but skip its severity/finding-ID machinery — a build is one item,
> not a findings list. Use this field set:

```
✅ **Done: <feature-name>**
🔨 Built: <one-line, what changed>
🧪 Verify: <✅/❌ per check, e.g. "✅ tsc clean" · "👀 preview not checked (reason)">
👤 Tested by you: <✅ confirmed working — quote or summarize their confirmation>
📝 Commit: <short message>
🚀 Push: <⏸️ not pushed — awaiting your go-ahead (the default) / ✅ pushed <branch> after your go-ahead / ⏭️ skipped — reason>
⚠️ Watch out: <anything the user must manually do or check — written in PLAIN, everyday language; omit the line if none>
```
One clause per line, no prose. Reuse the same field emoji every run
(✅/🔨/🧪/👤/📝/🚀/⚠️) so reports scan the same way build to build.

**Watch out must be jargon-free (per `ae49-ref-guidelines` rule 8).** This line is
written for the user, who may not be technical — translate every item into plain
words: say what they need to do and why it matters in real terms, never lead with
raw config keys, cloud role names, API/method names, or internal mechanics. Put the
plain meaning first; if a specific setting or name is genuinely needed to act on it,
add it in parentheses *after* the plain explanation. Example —
- ❌ jargon: "`createCustomToken` 500s in prod without the Service Account Token
  Creator role on the App Hosting service account."
- ✅ plain: "On the live website (not your computer), Google login won't work until
  one Google Cloud permission is turned on — it tests fine locally. Ask whoever
  manages the server to enable it (the *Service Account Token Creator* role)."

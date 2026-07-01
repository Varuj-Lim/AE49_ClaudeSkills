# Management Talk — Worked Example

The same bug, rewritten across channels — a reference for how much to keep and drop per channel. See [SKILL.md](SKILL.md) for the rules these examples follow.

## Worked example — same bug, three channels

**Source (engineering JIRA comment):**

> **Mechanism:** the single-stream fast-path in `tadaLaunchPrepare` / `tadaLaunchKernel` / `tadaLaunchFinish` (gated on `scheduler->numStreams == 1 && !plan->persistent`) skipped the cross-stream event between `launchStream` and `handle->shared->deviceStream`. dumbModel hits this gate exactly. Kernel launched before deviceStream's IPC publish / scratch-buffer writes (the ones that populate `scratchBuf`) were visible to launchStream → `scratchBuf == NULL` in the kernel → stray pointer dereference → ring ready-flag read from garbage → thread spins forever.

### As a JIRA comment

> **Status: Fixed pending merge.** Bug found, fix validated, PR up for review.
>
> **Impact:** LLM-7B fine-tuning on 8 GPUs would hang every time it tried to evaluate the model — blocking the entire workload. Affects customers using dumbModel (a popular framework for training large models that don't fit on a single GPU), which means most large-model fine-tuning runs on the platform were exposed.
>
> **What broke:** Our GPU communication library (Tada) skipped an internal synchronization step under a specific configuration that dumbModel happens to trigger. The GPUs ended up reading from an uninitialized buffer and got stuck waiting for a signal that would never arrive. The unsafe shortcut had been in the code for months but wasn't reached by any real workload until now.
>
> **A previous fix attempt** added a defensive check that hid the symptom in some paths but left the underlying race in place. This new fix removes the unsafe shortcut entirely and tightens the safety check on the device side.
>
> **Owner:** Alex (Tada team). PR org/platform#5751.
>
> **Next steps:** code review → merge. Customers hitting this today can disable IPC registration as a temporary workaround.

### As a Slack post

> **Tada hang affecting dumbModel LLM-7B fine-tuning is fixed pending merge.** (JIRA-12345)
>
> - Skipped synchronization in the comms fast-path → GPUs read uninitialized memory → hang. Latent for months; dumbModel was the first workload to hit it.
> - Owner: Alex, PR #5751 in review.
> - Workaround until merge: disable IPC registration.

### As a standup note

> Fixed Tada hang on dumbModel LLM-7B (JIRA-12345). Alex's PR #5751 in review. Workaround posted in the ticket; backport to v7.2 next.

What changed between channels: same diagnosis, same owner, same next step. JIRA gets every block. Slack drops "why now" and "previous fix attempt" — too much for the channel. Standup keeps just state + key + owner + next. None of them mention `scratchBuf` or `tadaLaunchPrepare`.

---
name: web-ref-migration-backups
description: The shared data-migration safety ladder for every hub project (AE49_Hub, NuriHub, future siblings) — rehearse on the emulator, dry-run, copy every doc a production write will touch into a `<collection>_backup_<stamp>` collection with a --restore path, verify after, and SWEEP the backups once the work is verified (owner's one-word confirm, roughly a week later). Use whenever writing or reviewing a script that mutates real Firestore data, before running any such script with --apply, when the owner asks why data backups exist or whether they can be deleted, or when backup collections/files have piled up. Written for Claude's own recall, not as team documentation.
---

# Data-migration safety ladder — shared canon

**Audience: Claude.** The owner explicitly does not want human-facing docs for
this (ruling 2026-09-03) — this file exists so every session on every machine
knows the discipline without rediscovering it.

## Why backups when the emulator exists

The emulator and the pre-write backup guard DIFFERENT risks; one never replaces
the other. The emulator is the rehearsal room: it proves the CODE against a
snapshot that is always older and cleaner than reality. The backup is the
seatbelt for the real run: production data is messier than any snapshot (docs
from old app versions, half-migrated fields, edge cases born after the snapshot),
bugs can surface days after an apply, and run-time mistakes (wrong flag, data
moving underneath because staff are using the app) only exist in the real run.
Rehearsing a surgery on a dummy never removes the need for blood on standby.

## The ladder — every script that mutates real data

1. **Rehearse on the emulator** until the logic is right (zero cost).
2. **Dry-run against production** — read-only preview printing counts + samples
   of exactly what would change. `--apply` is the only write path.
3. **Backup before the first write.** On `--apply`, copy every doc that will
   change WHOLESALE into `<collection>_backup_<ISO-stamp>` (one stamp per run,
   shared by all collections that run touches), and ship a
   `--restore <backupCollection>` mode that writes only whitelisted fields
   back. For destructive field DROPS, a machine-local JSON file backup
   (fsynced, count-verified, owner copies it off-machine) is the variant.
4. **Verify after** — health check / spot totals; per-doc `activityLogs`
   before→after entries double as field history.

## The sweep rule (added 2026-09-03, after 215 stale docs piled up)

A backup is DISPOSABLE once its migration is verified in production — about a
week of live trading, or the owner's earlier explicit confirmation. Then:

- Main PROPOSES the sweep: a table of collection, doc count, creating script,
  and work round — never deletes on its own initiative.
- Owner confirms in one word; delete with EXPLICITLY NAMED collections (never
  pattern-match at delete time), write ONE `activityLogs` entry carrying the
  per-collection counts, and note the purge in project memory.
- The same clock applies to machine-local JSON backups.
- Never sweep `migrations` bookkeeping docs or frozen-legacy collections —
  those are not backups.

## Project facts stay in the projects

Each hub's scripts carry the pattern themselves (NuriHub:
`backfill-line-shipping-address.cjs`, `migrate-sales-channel-names.cjs`,
`repair-line-order-money.cjs`, `migrate-design-variants.cjs` are worked
examples). AE49_Hub has no real-data migration yet — apply this canon from its
first one. The `ae49-migrate` agent follows this ladder when dispatched.

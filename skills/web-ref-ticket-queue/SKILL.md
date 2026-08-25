---
name: web-ref-ticket-queue
description: The shared ticket-queue ordering canon for every hub project (AE49_Hub, Nuri_Hub, and future siblings) — how any ticket listing is ordered and columned, regardless of which app's tickets they are. Use when listing, tabling, or triaging support/IT tickets in any project, when editing a project's ticket-to-plan skill or list script, or when a ruling about ticket priority/ordering lands — the rule changes HERE once, project skills only carry their own facts.
---

# Ticket queue — shared ordering canon

One rule for every hub's ticket listings (skill scripts, app Open tabs,
boards), so a ruling lands ONCE here instead of once per project.
**Owner ruling 2026-08-25, shared across AE49_Hub + Nuri_Hub.**

## The order

1. **Priority tier first.** Each project declares its own tier vocabulary
   and canonical order in its own code/skill (AE49_Hub: `urgent > normal`;
   Nuri_Hub: `urgent > normal > low`). Higher tier always outranks newer.
2. **A missing `priority` reads as `normal`** — both hubs deliberately ran
   NO backfill, so legacy tickets simply count as normal (each project
   names its own resolver/constant; never treat absence as missing data).
3. **OLDEST first within each tier** — the longest-waiting urgent ticket
   sits at the very top, and nothing old can hide under newer arrivals.

## The table

Any ticket listing rendered for the user carries **Priority as its own
column, immediately after Status** (ID · Status · Priority · Type · Date ·
Requester · Title). English, per the status-board rule.

## Split of responsibilities

- **This canon:** the ordering rule, the missing-value rule, the column.
- **The project's ticket skill:** its tier vocabulary, script paths,
  collection names, status scopes, actor uids — and its bundled list
  script must actually IMPLEMENT this order (a doc-only edit that leaves
  the script printing newest-first is half a fix; that happened 2026-08-25).

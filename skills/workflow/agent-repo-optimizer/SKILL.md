---
name: agent-repo-optimizer
description: >
  Audit a repository to make it cheaper, faster, and safer for coding agents to work in —
  agent docs, skills, token cost, and doc/reality drift. Use when asked to "optimize this repo
  for agents", "make this codebase easier for coding agents", "audit our CLAUDE.md/AGENTS.md",
  or "reduce agent token usage". Produces a survey report and a tiered improvement plan;
  changes nothing until the plan is approved.
---

This is a survey-first workflow. Phase 1 is strictly read-only.

## Phase 1 — Survey (read-only)

Start with the bundled inventory script (next to this skill) — it deterministically finds
every agent doc, sizes it in approximate tokens, checks documented package commands against
package.json scripts, and hash-compares mirrored skill trees:

```bash
node <skill dir>/docs-inventory.mjs <repoRoot>
```

Its output seeds items 1, 2, and parts of 3–5 below; the remaining judgment work
(claim-vs-reality drift, duplication of meaning, gaps) is yours:

1. **Agent docs** — every CLAUDE.md / AGENTS.md / .cursorrules / equivalent, at every level.
   Record path, size (lines and approximate tokens), and what it claims.
2. **Skills** — every skills directory (`.claude/skills`, `.agents/skills`, `skills/`, plugin
   dirs). Record each skill's name, description quality, size, and last-touched date.
3. **Drift check** — verify claims against reality: do documented commands exist in
   package.json/Makefile/scripts? Do referenced paths, counts, and module lists match the file
   tree? Do docs describe components that no longer exist (ghosts) or miss ones that do?
4. **Duplication** — the same rule stated in multiple docs, mirrored skill trees out of sync,
   overlapping skills.
5. **Token hotspots** — oversized always-loaded docs, giant instruction files an agent must
   read to do anything, boilerplate repeated per-directory.
6. **Gaps** — recurring procedures visible in the repo (scripts, CI, conventions) that no doc
   or skill captures, forcing rediscovery every session.

For large repos, fan out parallel read-only subagents per area, then merge findings.

## Phase 2 — Report

Deliver a survey report: doc inventory table, drift list (claim → reality), duplication map,
token-cost hotspots, and gaps. Every finding cites the file(s) involved.

## Phase 3 — Tiered plan

Propose improvements in tiers, cheapest-first:

- **Tier 1 — corrections:** fix drifted claims, delete dead references, dedupe repeated rules
  to a single source of truth.
- **Tier 2 — restructure:** split monolithic docs into per-directory AGENTS.md scoped to what
  an agent needs *in that directory*; move rarely-needed detail out of always-loaded files.
- **Tier 3 — new skills:** turn recurring procedures found in the gap analysis into skills,
  one procedure per skill, with descriptions written for trigger accuracy.
- **Tier 4 — tooling:** scripts or hooks that keep docs honest (e.g. a drift check in CI).

Get approval per tier before executing. Apply the `principles` skill while executing: minimal
change, no scope creep beyond the approved tier.

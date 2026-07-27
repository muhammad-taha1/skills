---
name: agent-repo-optimizer
description: >
  Audit a repository to make it cheaper, faster, and safer for coding agents to work in —
  agent docs, skills, token cost, and doc/reality drift. Use whenever the user wants to
  optimize a repo for coding agents, audit or clean up their CLAUDE.md / AGENTS.md, cut agent
  token usage, or suspects their agent docs have drifted from reality. Produces a survey
  report and a tiered improvement plan; changes nothing until the plan is approved.
---

This is a survey-first workflow. Phase 1 is strictly read-only.

## Phase 1 — Survey (read-only)

Find every agent doc first, and measure it rather than eyeballing it — sizes drive the
token-hotspot ranking in item 5, and estimated sizes are reliably wrong. Glob for `CLAUDE.md`,
`AGENTS.md`, `AGENT.md`, `GEMINI.md`, `SKILL.md`, and `.cursorrules` at every level, then size
the results in one pass:

```bash
wc -lc <every doc found>   # lines and bytes; bytes/4 ≈ tokens
```

Then read them. Reading is the point — every item below except sizing turns on what the docs
actually claim, so there is no shortcut around opening them:

1. **Agent docs** — record each doc's path, size, and what it claims.
2. **Skills** — every skills directory (`.claude/skills`, `.agents/skills`, `skills/`, plugin
   dirs). Record each skill's name, description quality, size, and last-touched date.
3. **Drift check** — verify claims against reality. Do documented commands exist *in whatever
   runner the repo actually uses* — package.json scripts, Makefile targets, justfile, poetry,
   cargo, tox? A doc saying `npm run test` in a repo with no `test` script sends an agent
   straight into a failure. Do referenced paths, counts, and module lists match the file tree?
   Do docs describe components that no longer exist (ghosts) or miss ones that do?
4. **Duplication** — the same rule stated in multiple docs, overlapping skills, and mirrored
   skill trees out of sync. For mirrors, hash-compare rather than skim: identical `SKILL.md`
   files can still hide drifted `references/` or `scripts/` beside them.
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

Get approval per tier before executing, and stay inside it — no scope creep beyond the approved
tier.

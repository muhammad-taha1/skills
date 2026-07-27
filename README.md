# skills

A personal catalog of general-purpose agent skills, installable with
[`npx skills`](https://github.com/vercel-labs/skills) into Claude Code, Cursor, OpenCode, and
any other agent the CLI supports.

## Install

```bash
# everything
npx skills add muhammad-taha1/skills

# a single skill
npx skills add muhammad-taha1/skills --skill principles

# globally, for one agent
npx skills add muhammad-taha1/skills -a claude-code -g

# local testing from a checkout (repo root; add --copy if symlinks are unavailable)
npx skills add ./ -g -a claude-code
```

## Catalog

Skills are organized as `skills/<category>/<name>/SKILL.md`.

### craft
Operating defaults an agent applies silently while it codes.

| Skill | What it does |
| --- | --- |
| `principles` | How to structure code, shape abstractions, and model a domain — minimal change, deep modules, permanent fix over point fix. Design and DDD depth live in `references/`. |
| `testing` | TDD at the interface seam — test what a module promises, mock only true boundaries. |

### workflow
Multi-phase processes I run agents through.

| Skill | What it does |
| --- | --- |
| `research-plan-build` | Discover → read-only research → explanation-first plan (markdown source of truth + commentable HTML view) → feedback loop → build. |
| `agent-repo-optimizer` | Audit a repo's agent docs, skills, token cost, and doc/reality drift; survey report plus a tiered improvement plan, nothing changed until approved. |

### toolkit
Task-specific skills, invoked for a concrete job.

| Skill | What it does |
| --- | --- |
| `demo` | Sub-60s animated HTML spotlight for a skill or project — runs the subject for real, sources every claim from actual output, zero dependencies. |
| `excel-analysis` | Safe openpyxl workbook analysis and editing — formula-preserving, taxonomy-respecting. |

## Structure

A skill is one directory. `SKILL.md` is the only required file; the rest appear when a skill
needs them.

| Path | Holds |
| --- | --- |
| `SKILL.md` | The skill — always loaded, kept short |
| `references/` | Depth the skill reads on demand |
| `scripts/` | Executables the skill invokes |
| `assets/` | Templates and static files the scripts consume |
| `evals/` | `evals.json` plus `fixtures/` for testing the skill |

## License

MIT

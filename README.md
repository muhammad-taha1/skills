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

### domain-knowledge
Adds knowledge and operating defaults to an agent.

| Skill | What it does |
| --- | --- |
| `principles` | Core engineering operating defaults — minimal change, permanent fix over point fix, complexity in code not prompts. |
| `simplicity` | Design philosophy — deep modules, abstraction layers, Rule of Three, work → right → fast. |
| `domain-modeling` | DDD guidance tiered by complexity — strategic always, tactical when earned. |
| `testing` | TDD at the interface seam — test what a module promises, mock only true boundaries. |

### workflow
How I run coding agents day to day.

| Skill | What it does |
| --- | --- |
| `discover` | Requirements interview before any design — produces a brief. |
| `research-plan-build` | Discover → read-only research → explanation-first plan (markdown source of truth + commentable HTML view) → feedback loop → build. |
| `agent-repo-optimizer` | Audit a repo's agent docs/skills for drift, duplication, and token cost; tiered improvement plan. |

### productivity
Non-coding tasks I do regularly.

| Skill | What it does |
| --- | --- |
| `excel-analysis` | Safe openpyxl workbook analysis and editing — formula-preserving, taxonomy-respecting. |

### executable
One-off skills, invoked manually for a specific task.

| Skill | What it does |
| --- | --- |
| `skill-feedback` | Fold a session correction into the skill that should have prevented it. |
| `demo` | Sub-60s animated HTML spotlight for a skill or project — sourced claims only, zero dependencies. |

## License

MIT

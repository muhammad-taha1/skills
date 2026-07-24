# AGENTS.md

Agent instructions for working in this repo. (README.md is for humans; this file is for you.)

## What this repo is

A personal catalog of **general-purpose** agent skills, distributed via
[`npx skills`](https://github.com/vercel-labs/skills). There is no build, no tests, no plugin
manifest — the deliverable is the SKILL.md files themselves.

## Layout

```
skills/<category>/<name>/SKILL.md
```

Exactly four categories — never invent a fifth:

| Category | Meaning |
| --- | --- |
| `domain-knowledge` | Adds knowledge or operating defaults to an agent |
| `workflow` | How the owner runs coding agents day to day |
| `productivity` | Regular non-coding tasks |
| `executable` | One-off skills, invoked manually for a specific task |

## Rules for skills in this repo

- **General-purpose only.** Project-specific skills belong in their own repos (e.g.
  `D:\ai_video_docs\.agents\skills\`, orient's `.agents/skills/`), never here.
- **Frontmatter is `name` + `description` only.** The `npx skills` format recognizes nothing
  else. Merge trigger phrases into the description ("Trigger on: ..."); no `when_to_use`,
  `user-invocable`, `argument-hint`, or other agent-specific keys.
- **Bodies must be agent-agnostic.** The owner installs these into Claude Code, Cursor, and
  others. No `$ARGUMENTS`, no slash-command syntax, no references to a specific agent's tools.
  Refer to sibling skills by plain name ("the `discover` skill"), not `/craft:discover`.
- **One skill per directory, `SKILL.md` exactly.** Supporting reference files may sit beside
  it, but keep skills self-contained when possible.
- **Match the house voice:** short, declarative, bolded rule names, rules over narration.
  Negative constraints ("never X") are the highest-value content — keep them prominent.
- **Editing a skill = also checking its description.** If a change affects when the skill
  should trigger, the description must change with it.

## Adding a new skill

1. Confirm it's general-purpose and pick the category (ask if genuinely ambiguous).
2. Create `skills/<category>/<name>/SKILL.md` (kebab-case name matching the directory).
3. Add a row to the category's table in README.md.

## Verifying

No validator exists. Sanity checks: frontmatter parses as YAML, `name` matches the directory,
every skill appears in README.md, and `npx skills add ./ --list` (from repo root) discovers all
skills if you need an end-to-end check.

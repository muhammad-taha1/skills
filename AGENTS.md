# AGENTS.md

Agent instructions for working in this repo. (README.md is for humans; this file is for you.)

## What this repo is

A personal catalog of **general-purpose** agent skills, distributed via
[`npx skills`](https://github.com/vercel-labs/skills). There is no build and no test runner —
the deliverable is the SKILL.md files themselves.

## Layout

```
skills/<category>/<name>/SKILL.md      the skill — the only required file
                        references/    docs the skill tells the agent to read on demand
                        scripts/       executables the skill invokes
                        assets/        templates and static files the scripts consume
                        evals/         evals.json + fixtures/ for testing the skill
```

Exactly three categories — never invent a fourth:

| Category | Meaning |
| --- | --- |
| `craft` | Operating defaults an agent applies silently while coding |
| `workflow` | Multi-phase processes the owner runs agents through |
| `toolkit` | Task-specific skills, invoked for a concrete job |

## Rules for skills in this repo

- **General-purpose only.** Project-specific skills belong in their own repos (e.g.
  `D:\ai_video_docs\.agents\skills\`, orient's `.agents/skills/`), never here.
- **Frontmatter is `name` + `description` only.** The `npx skills` format recognizes nothing
  else — no `when_to_use`, `user-invocable`, `argument-hint`, or other agent-specific keys.
- **Descriptions are prose, not keyword lists.** One block: what the skill does, then
  `Use whenever ...` covering the situations that should trigger it — including the case where
  the user asks for the underlying task without naming the skill. No `Trigger on:` lists.
- **Bodies must be agent-agnostic.** The owner installs these into Claude Code, Cursor, and
  others. No `$ARGUMENTS`, no slash-command syntax, no references to a specific agent's tools.
  Refer to sibling skills by plain name ("the `principles` skill"), not `/craft:principles`.
- **SKILL.md stays short; depth goes in `references/`.** The body is the always-loaded part —
  keep it to the rules that must always apply, and point to a reference file for anything
  consulted only sometimes.
- **Match the house voice:** short, declarative, bolded rule names, rules over narration.
  Negative constraints ("never X") are the highest-value content — keep them prominent.
- **Editing a skill = also checking its description.** If a change affects when the skill
  should trigger, the description must change with it.

## Adding a new skill

1. Confirm it's general-purpose and pick the category (ask if genuinely ambiguous).
2. Create `skills/<category>/<name>/SKILL.md` (kebab-case name matching the directory).
3. Add `references/`, `scripts/`, `assets/`, `evals/` only if the skill actually needs them.
4. Add a row to the category's table in README.md.

## Evals

`evals/evals.json` holds `skill_name`, a `notes` field describing the fixture and what a
correct run looks like, and an `evals` array of `{id, name, prompt, expected_output, files}`.
Prompts are written the way the owner actually talks — vague, lowercase, no skill name — so
they test whether the description triggers, not just whether the body works. Fixtures live in
`evals/fixtures/` and must be self-contained.

## Verifying

No validator exists. Sanity checks: frontmatter parses as YAML, `name` matches the directory,
every skill appears in README.md, and `npx skills add ./ --list` (from repo root) discovers all
skills if you need an end-to-end check.

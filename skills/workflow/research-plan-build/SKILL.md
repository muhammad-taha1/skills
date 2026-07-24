---
name: research-plan-build
description: >
  The full feature-development loop: discover requirements, research the codebase read-only,
  write an explanation-first plan file the user annotates with inline comments, revise until
  approved, then build. Use for any non-trivial feature or change. Trigger on: "let's plan",
  "new feature", "before we build", "research and plan", "make a plan for", or any task big
  enough that jumping straight to code would be a gamble.
---

Run these phases in order. Do not skip ahead: no code changes until the plan is approved.

## Phase 1 — Discover

If the problem, outcomes, and non-goals aren't already crisp, run the `discover` skill first
and produce its brief. If a brief (or equivalent clarity) already exists, restate it in one
short paragraph and confirm before continuing.

## Phase 2 — Research (read-only)

Investigate the codebase without changing anything. Find the code paths involved, the existing
patterns to follow, the constraints (schemas, contracts, invariants), and anything that
contradicts the brief. Prefer reading real code over assuming. Note surprises — they belong in
the plan's Background section.

## Phase 3 — Plan artifacts

Produce two files with the same basename:

- `plans/YYYY-MM-DD-<slug>.md` — the **source of truth**. The agent reads, revises, and merges
  feedback here.
- `plans/YYYY-MM-DD-<slug>.html` — the **reading/commenting view**, generated from the
  markdown, for the user to open in a local browser. Regenerate it after every markdown
  revision; never edit it independently.

The plan is a *teaching document*, not a task list. Optimize for the reader building intuition
before seeing mechanics. Markdown structure:

```
# Plan: <title>

## Background
What exists today and what problem we're solving. Start broad enough that someone
unfamiliar with this corner of the codebase can follow; narrow to the specific
files/behaviors involved. Include what research turned up, especially surprises.

## Intuition
The core idea in plain language. Explain WHY this approach, using a concrete
example or toy data walked end-to-end ("a request for X comes in, today it does
A→B; after this change it does A→C→B because..."). Diagrams welcome. No
implementation detail yet. If alternatives were considered, one line each on why not.

## Changes
The how, grouped conceptually (not file-by-file). Each group: what changes, which
files (path references), and how the pieces connect. Keep it at the level of
signatures, data shapes, and seams — not full code.

## Risks & open questions
What could go wrong, what's assumed, what needs the user's call.

## Out of scope
Explicit non-goals carried from the brief, plus anything deferred.
```

### The HTML view

Do NOT hand-write the HTML — generate it with the bundled zero-dependency script that lives
next to this skill, so regeneration costs one command instead of tokens:

```bash
node <this skill's directory>/build-plan-html.mjs plans/YYYY-MM-DD-<slug>.md
```

The script renders the markdown into `template.html` (also bundled) and writes the `.html`
beside the `.md`. What the generated page gives the user:

- Readable single-file page (inline CSS/JS, no dependencies), TOC, works on a phone.
- A 💬 button on every block to attach comments; comments persist in `localStorage`.
- "Save comments into .md" writes each comment as `>> ` lines directly into the plan
  markdown at the right block (File System Access API, Chrome/Edge; user picks the `.md`
  once). Clipboard fallback copies `>> (section) comment` lines instead.
- `>>` lines already present in the markdown render as visible pending-comment cards.

If node isn't available, fall back to hand-writing an equivalent page from `template.html`
(wrap each block in `<div class="blk" data-md-line="<last source line>"
data-section="<current h2>">`), but prefer the script.

## Phase 4 — Feedback loop

Tell the user both file paths and that they can either open the HTML and comment there
(exporting when done) or type `>>` lines straight into the markdown — both end up as `>>`
lines in the markdown, which is the only thing the agent reads.

On each revision round:
1. Re-read the plan markdown and collect every `>>` line.
2. Address each one: revise the relevant section, or — if you disagree or need a decision —
   answer inline directly below the comment.
3. Remove the `>>` lines you fully addressed and append a short entry to a `## Revision log`
   section at the bottom (one line per comment: what was asked, what changed).
4. **Regenerate the HTML from the updated markdown** so the reading view never goes stale.
5. Report back and repeat until the user says the plan is approved.

Never start building while unaddressed comments exist.

## Phase 5 — Build

Implement exactly what the approved plan says, applying the `principles` skill defaults
(minimal change, permanent fix over point fix, use project tools). If implementation reveals
the plan was wrong somewhere, stop, update the plan file (with a Revision log entry), and flag
it — don't silently diverge. Finish by verifying the observable outcomes named in the brief
and reporting results against them.

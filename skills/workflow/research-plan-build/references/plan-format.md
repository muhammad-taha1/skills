# Plan file format

The plan is a *teaching document*, not a task list. The reader builds intuition before seeing
mechanics. Section order matters: the HTML review view renders in markdown order, so
user-facing explanation sits on top and agent-facing detail sits at the bottom.

```
# Plan: <title>

## Background
What exists today and what problem we're solving. Start broad enough that someone
unfamiliar with this corner of the codebase can follow; narrow to the specific
files/behaviors involved. Include what research turned up, especially surprises.

## Intuition
The core idea in plain language. Explain WHY this approach, using a concrete example
or toy data walked end-to-end ("a request for X comes in, today it does A→B; after
this change it does A→C→B because..."). No implementation detail yet. If
alternatives were considered, one line each on why not.

## Changes
The how, grouped conceptually (not file-by-file). Each group: what changes, which
files (path references), and how the pieces connect. Keep it at the level of
signatures, data shapes, and seams — not full code.

## Risks & open questions
What could go wrong, what's assumed, what needs the user's call.

## Out of scope
Explicit non-goals carried from the brief, plus anything deferred.

## Implementation order            <- agent-facing; deliberately last
Numbered, dependency-ordered steps for the build phase. Terse and mechanical —
this section becomes the task list in Phase 5. Each step small enough to verify.

## Revision log                    <- appended during the review loop
One line per addressed comment: what was asked, what changed.
```

Writing rules:

- Prose is for the user; write full sentences in Background/Intuition. Implementation order
  is for the agent; keep it terse.
- **Use ASCII diagrams wherever a picture beats prose** — data flow, before/after
  architecture, request lifecycles, state machines. Put them in fenced code blocks (```text)
  so the HTML view renders them monospace with alignment intact. They shine in Background
  (what exists today) and Intuition (the before→after shape). Keep them narrow (~70 chars)
  so they don't scroll. Example:

  ```text
  today:  source A ──> transform ──> consumer
  after:  source B ──> adapter ──> transform ──> consumer
                          │
                          └─ new seam introduced by this plan
  ```
- Don't hard-wrap lines aggressively — soft wrap or long lines are fine; the renderer joins
  wrapped lines anyway.
- Negative constraints from the brief go in Out of scope verbatim — they are load-bearing.

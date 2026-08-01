---
name: research-plan-build
description: >
  The full feature-development loop: discover requirements, research the codebase read-only,
  write an explanation-first plan file the user annotates with inline comments, revise until
  approved, then build. Use for any non-trivial feature or change — whenever the user wants to
  plan before building, or the task is big enough that going straight to code would be a
  gamble, even if they didn't ask for a plan.
---

Run the phases in order. No code changes until the plan is approved. If your environment has
an enforced read-only or planning mode (e.g. Claude Code's plan mode), enable it for phases
1–3 and exit it only on approval — enforcement beats intent.

This skill bundles scripts. Their location is the skill's base directory, announced when the
skill was loaded (e.g. "Base directory for this skill: ..."). Use that path verbatim — never
guess it, reconstruct it from other installs, or disk-search for the scripts.

## Planning agent

The primary agent owns the user conversation, review-server task, approval state, and build.
After discovery produces a brief, prefer one dedicated planning agent for Phases 2–4 when the
environment supports subagents. Give it the brief, keep it read-only except for the plan file,
and route every review comment back to that same agent. End it after approval; the primary
agent implements Phase 5 from the approved plan.

Use per-spawn model controls when available rather than changing the primary agent's model or
making all subagents inherit the planning model. **Read `references/environment-adapters.md`
now** when the environment exposes model selection or enforced planning modes. If dedicated
agents are unavailable, the primary agent performs the planning work directly.

## Phase 1 — Discover

**Read `references/discover.md` now.** Produce a brief before technical research. Do not infer
outcomes, non-goals, or product decisions from a feature request merely because implementation
sounds obvious. Ask targeted questions for every material gap; skip only facts the user already
provided. If the request genuinely supplies the entire brief, restate it and ask the user to
confirm or correct it before continuing.

## Phase 2 — Research (read-only)

Investigate without changing anything: the code paths involved, existing patterns to follow,
constraints (schemas, contracts, invariants), and anything contradicting the brief.

The dedicated planning agent owns this phase. Give it the brief and the specific questions
(where does X live, what patterns exist, what constraints apply, what contradicts the brief)
and have it return a structured report. This keeps the primary context lean and makes
read-only structurally true. Research directly only when a planning agent isn't available.

- Use dedicated read/search tools, one target per call — never chained shell commands
  (`a && b && c`); chains force a permission prompt on every variation.
- Never read secret files (`.env*`, keys). Their existence can be a constraint; their
  contents never are.
- Stay scoped to the brief — targeted reading, not a repo sweep.
- Keep an ambiguity log while researching: contradictions, consequential choices, unverified
  assumptions, and missing acceptance criteria.
- Before writing the plan, report the important findings and resolve every material ambiguity
  with the user. Ask questions in a small conversational batch. Never bury a user decision in
  `Risks & open questions`, guess it, or let a planning agent answer it.
- If research produces no material question, say so explicitly and explain which evidence made
  the brief unambiguous. This checkpoint is mandatory even when no question is needed.

## Phase 3 — Plan

Choose a plan root that both the planning writer and review server can write. Prefer
`~/.agents/plans`; if the host sandbox does not permit it, use an environment-declared writable
temporary directory. Verify the parent before writing and do not retry a known-forbidden path.
Never put the plan in the project repo. **Read `references/plan-format.md` (next to this skill)
now** — it defines the required structure: explanation-first sections for the user on top,
implementation detail for the agent at the bottom. The dedicated planning agent writes it.

## Phase 4 — Review loop

**Read `references/review-flow.md` now.** Short version: start the bundled review server as a
managed background task, retain its handle, point the user at the URL, and wait. The primary
agent owns the server; the planning agent merges the user's `>>` comments, revises, and keeps
the revision log. Restart the server after each revision. Repeat until the page reports approval
or the user explicitly approves in chat. Never detach the server or build with unaddressed
comments.

## Phase 5 — Build

On approval:
1. Treat approval as authorization to perform the approved workspace edits. Do not ask
   "should I begin?", request approval again, or wait for another user message.
2. End the dedicated planning agent. Use the environment's native transition out of enforced
   read-only/plan mode when one exists. If mode state is not inspectable, attempt the first
   approved workspace edit; ask the user to switch modes only after an actual mode error.
3. If an approved operation gets a filesystem permission error, inspect the exact target.
   Retry through the environment's normal permission mechanism when the target is in scope, or
   relocate only workflow artifacts such as the plan/review result to a writable root. Never
   treat a permission failure as missing approval.
4. Turn the plan's "Implementation order" section into your task tracker's items so progress
   is visible.
5. In the same turn, announce the transition and perform the first implementation action.
   Do not end the turn with only a status update or prospective promise.
6. Implement exactly what the plan says — nothing beyond it. Ideas that surface during the
   build go in a "Future" note, not into this change.
7. If implementation proves the plan wrong somewhere, stop, update the plan file (with a
   revision log entry), and flag it — don't silently diverge.
8. Verify the observable outcomes named in the brief and report results against them.

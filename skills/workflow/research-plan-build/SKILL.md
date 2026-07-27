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

## Phase 1 — Discover

If the problem, outcomes, and non-goals aren't crisp, **read `references/discover.md` now** and
run the interview it defines to produce a brief. If that clarity already exists, restate it in
one short paragraph and confirm.

## Phase 2 — Research (read-only)

Investigate without changing anything: the code paths involved, existing patterns to follow,
constraints (schemas, contracts, invariants), and anything contradicting the brief.

Preferred: delegate this to a read-only subagent when your environment supports one — give it
the brief and the specific questions (where does X live, what patterns exist, what
constraints apply, what contradicts the brief) and have it return a structured report. This
keeps the main context lean and makes read-only structurally true. Research directly only
when subagents aren't available.

- Use dedicated read/search tools, one target per call — never chained shell commands
  (`a && b && c`); chains force a permission prompt on every variation.
- Never read secret files (`.env*`, keys). Their existence can be a constraint; their
  contents never are.
- Stay scoped to the brief — targeted reading, not a repo sweep.
- A question that surfaces during research goes to the user NOW, before the plan is written —
  not into the plan as a guess or an open question you could have resolved.

## Phase 3 — Plan

Write the plan to `~/.agents/plans/<project-name>/YYYY-MM-DD-<slug>.md` (create the folder;
never inside the project repo). **Read `references/plan-format.md` (next to this skill) now**
— it defines the required structure: explanation-first sections for the user on top,
implementation detail for the agent at the bottom.

## Phase 4 — Review loop

**Read `references/review-flow.md` now.** Short version: start the bundled review server as a
background task, point the user at the URL, and wait — the task exiting IS the notification.
Merge the user's `>>` comments, revise, keep a revision log, restart the server. Repeat until
`PLAN APPROVED`. Never build with unaddressed comments.

## Phase 5 — Build

On approval:
1. Exit read-only/plan mode. Ask ONCE whether to switch to auto-accepted edits for this
   build (approval of the plan usually means yes) instead of prompting per file.
2. Turn the plan's "Implementation order" section into your task tracker's items so progress
   is visible.
3. Implement exactly what the plan says — nothing beyond it. Ideas that surface during the
   build go in a "Future" note, not into this change.
4. If implementation proves the plan wrong somewhere, stop, update the plan file (with a
   revision log entry), and flag it — don't silently diverge.
5. Verify the observable outcomes named in the brief and report results against them.

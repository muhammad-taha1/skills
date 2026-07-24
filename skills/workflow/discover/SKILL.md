---
name: discover
description: >
  Requirements and brainstorming interview — run BEFORE technical design or planning.
  Use when starting a new feature, project, or significant change where the problem or
  outcomes aren't yet crisp. Produces a brief that feeds directly into planning. Trigger on:
  vague feature ideas, "I want to build", "we should add", "help me think through", or any
  situation where the *what/why* isn't fully pinned before jumping to *how*.
---

Conduct a focused requirements interview. Goal: produce a brief that separates the
*what/why* from the *how*, before any technical design starts. This is not a planning session
— it ends with a brief, not a solution.

## Interview

Work through these questions conversationally. Ask one at a time. Adapt based on answers —
skip what's already clear, dig deeper where it's fuzzy.

1. **Problem** — What problem are we solving? Who experiences it? What prompted this now?
2. **Outcomes** — What does success look like? How will we know it worked (observable, not
   just "it's done")?
3. **Non-goals** — What are we explicitly *not* doing? What's out of scope?
4. **Constraints** — Tech (language, existing systems, APIs), time, team, or deployment
   constraints that must be respected.
5. **Assumptions** — What are we assuming is true that we haven't validated?

## Output

Emit a compact brief in this format. Keep it short — one crisp sentence or phrase per item:

```
## Brief: <title>

**Problem:** <1–2 sentences>
**Who:** <who this affects>
**Success looks like:** <observable outcome>
**Out of scope:** <explicit non-goals>
**Constraints:** <hard constraints>
**Assumptions to validate:** <any key unknowns>
```

This brief feeds directly into technical planning — the `research-plan-build` skill picks it
up as its input. The brief is the deliverable — not a solution, not a proposal, not a design.

If an initial idea was provided when this skill was invoked, treat it as the starting point
and begin the interview there.

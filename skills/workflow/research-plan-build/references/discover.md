# Discover — requirements interview

Run before any technical design. Goal: a brief that separates the *what/why* from the *how*.
This is not a planning session — it ends with a brief, not a solution.

## Interview

Work through these conversationally. Ask one at a time. Adapt based on answers — skip what's
already clear, dig deeper where it's fuzzy.

1. **Problem** — What problem are we solving? Who experiences it? What prompted this now?
2. **Outcomes** — What does success look like? How will we know it worked (observable, not
   just "it's done")?
3. **Non-goals** — What are we explicitly *not* doing? What's out of scope?
4. **Constraints** — Tech (language, existing systems, APIs), time, team, or deployment
   constraints that must be respected.
5. **Assumptions** — What are we assuming is true that we haven't validated?

Do not skip the interview merely because the request names a solution. A proposed implementation
does not establish the desired outcome, non-goals, or acceptance signal. The user may answer
several items at once; incorporate those answers and ask only the remaining material questions.

After codebase research, return here for a second, shorter checkpoint. Show contradictions and
consequential choices discovered in the code, then ask the user to resolve them before planning.
Repository facts answer technical questions; they do not authorize product decisions.

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

The brief is the deliverable — not a solution, not a proposal, not a design. It becomes the
input to Phase 2 research.

If an initial idea was provided when the skill was invoked, treat it as the starting point and
begin the interview there.

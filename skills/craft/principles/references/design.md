# Design — structure and abstraction

The reasoning behind the design defaults in SKILL.md. These are criteria, not a checklist.

## Module depth

Prefer **deep modules** — a simple interface hiding a powerful implementation. A module is too
shallow when its interface is nearly as complex as its implementation (pass-through wrappers,
trivial delegators). When designing, ask: does the interface hide real complexity, or just
rename it?

Avoid **classitis** — splitting code into many small shallow classes raises complexity rather
than reducing it. Fewer, deeper units beat many narrow ones.

This is what SRP is actually for. SRP is not about making classes small — it's about making each
unit's responsibility clear and non-overlapping. A class that does one thing well can still be
large. A class that does two unrelated things is the problem, regardless of size.

## Abstraction layers

**Different layer, different abstraction.** Each layer should add something — a genuinely new
concept, not just a renamed call to the layer below. If adding a layer doesn't change the level
of abstraction, it's a pass-through; remove it or merge it.

**Consistency.** Similar things should look and behave similarly. Inconsistency forces readers to
hold multiple mental models for the same concept.

## Abstraction timing

**Why the Rule of Three works.** A premature abstraction that turns out to be wrong is harder to
remove than the duplication it replaced — callers have already bent themselves around its shape.
Waiting for the third instance is what makes the pattern's real shape visible. Abstract then,
not before.

## Refinement

**Design is continuous.** Refactor toward deeper insight as understanding grows. No
big-design-up-front. The right abstraction usually reveals itself after you've built the naïve
version and used it.

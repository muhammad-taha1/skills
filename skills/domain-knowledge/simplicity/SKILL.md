---
name: simplicity
description: >
  Code structure and design philosophy. Apply when making design decisions, proposing
  implementations, refactoring, or reviewing diffs. Covers module depth, abstraction layers,
  consistency, and sequencing discipline. Trigger on: architecture discussions, "how should I
  structure", "is this abstraction right", "should I extract", "refactor", code review,
  designing a new module or interface.
---

Apply these as design criteria, not checklists. Silently.

## Module depth

Prefer **deep modules** — a simple interface hiding a powerful implementation. A module is too
shallow when its interface is nearly as complex as its implementation (pass-through wrappers,
trivial delegators). When designing, ask: does the interface hide real complexity, or just rename it?

Avoid **classitis** — splitting code into many small shallow classes raises complexity rather than
reducing it. Fewer, deeper units beat many narrow ones.

## Abstraction layers

**Different layer, different abstraction.** Each layer should add something — a genuinely new
concept, not just a renamed call to the layer below. If adding a layer doesn't change the level
of abstraction, it's a pass-through; remove it or merge.

**Consistency.** Similar things should look and behave similarly. When a pattern already exists
in the codebase, follow it. Inconsistency forces readers to hold multiple mental models for the
same concept.

## Abstraction timing

**Rule of Three.** Tolerate duplication until a pattern repeats a third time and its shape is
clear. Abstract then, not before. *Duplication is cheaper than the wrong abstraction* — a
premature abstraction that turns out to be wrong is harder to remove than the original duplication.

## Sequencing

**Work → right → fast.** Make it work first. Then make it correct and clean. Optimize last,
and only when you've measured a real problem. *Premature optimization is the root of all evil.*

## Refinement

**Design is continuous.** Refactor toward deeper insight as understanding grows. No
big-design-up-front. The right abstraction usually reveals itself after you've built the naïve
version and used it.

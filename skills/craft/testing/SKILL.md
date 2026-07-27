---
name: testing
description: >
  TDD and testing discipline — where to put the seam, what to mock, what earns coverage. Use
  whenever writing, restructuring, or reviewing tests, deciding what a suite should cover, or
  choosing what to mock, even when the user only asks to add a test for something.
---

Apply these silently when writing or reviewing tests.

## Test at the seam

**TDD at the interface.** Tests verify what an interface or deep module *promises* — the
observable behavior it exposes — not the internal methods that implement it. Write the test
against the public contract; let the implementation stay free to change.

**The diagnostic:** if a test breaks because of a refactor that didn't change observable
behavior, the test was written at the wrong level. Move it up to the seam rather than repairing
it in place.

## Mock only true boundaries

Mock only where your system genuinely ends:

- **Mock:** I/O, network calls, external services, the clock, randomness — anything whose real
  behavior is nondeterministic, slow, or outside your control.
- **Don't mock:** collaborators that are internal implementation details. They're part of the
  behavior under test.

If a test requires deep knowledge of the internals to set up, it's too tightly coupled — that's
a signal about the design, not just the test.

## Complex models earn direct coverage

Where domain logic is genuinely complex — invariants, lifecycle rules, branching business
rules — test the model's behavior directly rather than only through the layers above it. These
earn the extra coverage; simple data-shuffling code does not.

For the structural side of this (deep modules, why a hard-to-test unit is a design signal), see
the `principles` skill.

---
name: testing
description: >
  TDD and testing discipline. Apply when writing tests, deciding what to cover, or reviewing
  test structure. Centers on testing at the interface seam — what a module promises — rather
  than testing every internal method or dependency. Trigger on: "write tests for", "what should
  I test", "test coverage", "unit test", "integration test", "mock", "should I test this", or
  any discussion of test strategy.
---

Apply these silently when writing or reviewing tests.

## Test at the seam

**TDD at the interface.** Tests verify what an interface or deep module *promises* — its
observable behavior (the x/y/z it exposes) — not the internal methods that implement it.
Write the test against the public contract; let the implementation stay free to change.

If a test breaks because of a refactor that didn't change observable behavior, the test was
written at the wrong level.

## Don't mock internals

**Test through the public interface.** Avoid mocking collaborators that are internal implementation
details. Mock only true external boundaries — I/O, network, external services, time. If a test
requires deep knowledge of the internals to set up, it's too tightly coupled.

## SRP in service of deep modules

**One clear responsibility per module.** SRP is not about making classes small — it's about
making each unit's responsibility clear and non-overlapping. A class that does one thing well
can still be large. A class that does two unrelated things is the problem, regardless of size.

The goal is deep modules with clear responsibilities, not many shallow single-method classes
(classitis).

## Complex models

Where domain logic is genuinely complex — invariants, lifecycle rules, branching business
rules — test the model's behavior directly. These earn the extra coverage.

---
name: principles
description: >
  Core coding principles — how to structure code, shape abstractions, and model a domain.
  Use whenever writing or reviewing code, weighing two designs, deciding whether to extract
  an abstraction, or naming and modeling domain concepts, including when the user hasn't
  asked for design guidance explicitly.
---

Apply these silently. Do not narrate them; just work by them.

## Working defaults

**Negative constraints are load-bearing.** When the user says "don't add X", "no new Y",
"keep Z as is" — treat those as hard requirements and carry them forward across the whole task.
A restated constraint means it was violated once already; never require a third statement.

**Discovery before design.** For anything non-trivial: pin down the problem, the desired
outcomes, and the explicit non-goals before proposing *how*. The `research-plan-build` skill
runs this properly — use it when the task is big enough that jumping to code would be a gamble.

## Design defaults

- **Complexity is the enemy.** When options tie, pick the one that's easier to understand,
  change, and debug. The simpler interface almost always wins.
- **Consistency.** When a pattern already exists in the codebase, follow it.
- **Rule of Three.** Tolerate duplication until a pattern repeats a third time and its shape is
  clear. *Duplication is cheaper than the wrong abstraction.*

→ **Read `references/design.md`** before proposing a new module, layer, or abstraction.

→ For anything test-related — what to cover, where the seam goes, what to mock — use the
`testing` skill.

## Domain defaults

- **Ubiquitous language.** Name things in code the way the domain names them. Inconsistent
  vocabulary forces a translation layer in every reader's head.
- **Bounded contexts.** Every model lives inside a context where its meaning is consistent. Don't
  let two contexts share a model that means different things in each.
- **Tactical patterns are earned, not imposed.** Aggregates, domain events, and anti-corruption
  layers require genuine domain complexity. Never impose them on CRUD, scripts, or pipelines.

→ **Read `references/ddd.md`** before designing a domain layer or a boundary between systems.

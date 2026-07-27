# Domain modeling — DDD, tiered by complexity

Two tiers. The first is always active (summarized in SKILL.md). The second is earned.

## Tier 1 — Always (low cost, universally beneficial)

**Ubiquitous language.** Name things in code the way the domain names them. When the codebase
uses a different word than the domain expert (or the product spec), rename toward the domain word.

**Bounded contexts.** Every model lives inside a context where its meaning is consistent. At
context boundaries, translation is explicit. Don't let two contexts share a model that means
different things in each — that model will eventually be wrong in both.

**Supple design.** Three properties that make a model easy to think with and safe to use:

- *Intention-revealing interfaces* — the name of a method or type should say what it does, not
  how. A caller shouldn't need to read the implementation to use it correctly.
- *Side-effect-free functions* — prefer functions that return values over procedures that mutate
  state. Where mutation is necessary, make it explicit and isolated.
- *Conceptual contours* — carve at the joints of the domain. Modules should match the natural
  divisions in the problem, not the accidental divisions in the first implementation.

## Tier 2 — Earned (reach for only when domain complexity pays for it)

Apply when the domain has real invariants, lifecycle rules, or cross-boundary coordination that
simple CRUD patterns can't express cleanly. The Rule of Three applies here too: if the same
domain rule is being enforced in three places, it probably needs an aggregate. Not before.

- **Aggregates & roots** — cluster entities that must stay consistent together under a single
  root. Enforce invariants at the boundary. One transaction per aggregate.
- **Domain events** — when something happens in the domain that other parts of the system need
  to know about, name it as an event. Events make implicit coupling explicit.
- **Anti-corruption layer** — when integrating with a system whose model conflicts with yours,
  translate at the boundary rather than letting the foreign model leak in.
- **Rich domain models** — business rules belong on the domain object, not in a service layer
  that treats the model as a data bag.

## Match the project

Don't impose tactical patterns on CRUD, scripts, or generative pipelines. If a project doesn't
have a domain layer with real invariants, strategic naming (ubiquitous language, bounded
contexts) is still valuable. The tactical building blocks require genuine domain complexity to
earn their keep.

---
name: principles
description: >
  Core engineering operating defaults. Apply on any coding task, feature, design decision, or
  code review — when starting work, proposing a change, reviewing a diff, or choosing what to
  build or how. Trigger on: "let's build", "implement", "add", "how should I", "what's the best
  way", "review this", "should I", "plan", any task that could expand in scope.
---

Apply these silently. Do not narrate them; just work by them.

## Defaults

**Minimal change.** Do exactly what's asked. Bigger ideas go in a brief "Future" note at the
end — never built unless asked.

**Complexity is the enemy.** When options tie, pick the one that's easier to understand, change,
and debug. The simpler interface almost always wins.

**Discovery before design.** For anything non-trivial: pin down the problem, the desired outcomes,
and the explicit non-goals before proposing *how*. Use the `discover` skill to do this properly.

**Read before you diagnose.** Confirm current behavior in the actual code path before claiming
something's broken or missing. Never "fix" a deliberate divergence. When asked to investigate,
investigate — explore and report first; change code only once the diagnosis is agreed.

**Permanent fix over point fix.** When something breaks, fix the immediate case *and* trace it
to the root cause so the class of failure can't recur. If only the point fix is in scope, say
so and name the permanent fix explicitly.

**Use the project's tools.** Prefer the repo's existing scripts, commands, and entry points over
ad-hoc one-off scripts. If a needed script doesn't exist and the task recurs, add it to the
project — don't leave logic stranded in a throwaway.

**Complexity lives in code, not prompts.** When building anything LLM-adjacent, push
deterministic work (arithmetic, ID sequencing, validation, formatting) down into code. Never
depend on a model to do what a function can do reliably.

**Negative constraints are load-bearing.** When the user says "don't add X", "no new Y",
"keep Z as is" — treat those as hard requirements and carry them forward across the whole task.
A restated constraint means it was violated once already; never require a third statement.

**Cleanup is opt-in.** While in a file you're already editing, fix obvious trivial issues (a typo,
a dead import). Anything that crosses files, adds scope, or looks like a refactor: surface it,
don't do it.

For the deeper design reasoning behind these, see the `simplicity` skill.

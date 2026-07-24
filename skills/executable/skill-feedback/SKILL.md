---
name: skill-feedback
description: >
  Fold a correction or lesson from the current session into the skill that should have
  prevented it. Use when the user says "update the skill", "add that to the skill",
  "remember this in /X", "make sure this doesn't happen again", or gives a correction that
  an existing skill's instructions should have covered. The compounding loop: every repeated
  correction becomes a permanent skill improvement.
---

Input: a correction, preference, or lesson from this session — and optionally which skill it
belongs to.

## Procedure

1. **Identify the target skill.** If not named, search the skill directories in scope
   (project `.claude/skills`, `.agents/skills`, `skills/`, then user-level skill dirs) for the
   skill whose description covers the situation the correction arose in. If none fits, say so
   and propose either the closest skill or a new one — don't force a bad fit.
2. **Read the whole skill first.** The correction may already be half-covered; find the exact
   section it belongs in.
3. **Distill the correction to a durable rule.** Strip session-specific details; keep what
   generalizes. State it the way the user enforces it — if they said "don't do X", encode it
   as a prohibition, not a soft suggestion. Include the *why* in one clause when it prevents
   misreading.
4. **Patch minimally.** Add or amend the one rule in the right section, matching the skill's
   existing voice and format. Do not restructure the skill, and do not let the description
   drift out of sync — if the correction changes when the skill should trigger, update the
   description too.
5. **Check for mirrors.** If the project keeps synced skill copies (e.g. `.agents/skills`
   mirrored into `.claude/skills` or `.gemini/skills`), apply the same patch to every copy —
   or to the canonical source if a sync mechanism exists.
6. **Show the diff** and one line on where the rule landed and why there.

## Quality bar

- One correction → one focused edit. Batch multiple corrections as separate visible changes.
- Negative constraints ("never", "don't", "no new X without asking") are the highest-value
  rules to capture — they encode exactly what went wrong.
- If the same correction has now been folded into the same skill twice, the skill's structure
  is failing; flag that instead of stacking a third variant of the rule.

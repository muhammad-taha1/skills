---
name: demo
description: >
  Generate a short, polished visual demo — a light-themed, self-contained animated HTML
  slideshow — that spotlights a skill, tool, or technical project in under 60 seconds. Runs
  the subject for real in a scratch demo environment, captures its actual UI and output, and
  builds slides only from those artifacts: no invented claims, no filler. Optional Remotion
  recipe for video output. Trigger on: "make a demo", "demo this skill", "spotlight",
  "showcase", "pitch deck for", "make a video/slideshow about this project".
---

Input: the thing to demo — a skill, a repo, a CLI, a library — and optionally where the demo
will be shown (social post, README, meeting).

This skill bundles scripts. Their location is the skill's base directory, announced when the
skill was loaded (e.g. "Base directory for this skill: ..."). Use that path verbatim — never
guess it, reconstruct it from other installs, or disk-search for the scripts.

**Where artifacts go.** Deliverables live in the *calling repo* under
`.claude/demos/<subject-slug>/` — the `deck.json`, a `captures/` folder, and the built
`demo.html` all land there, versioned alongside the project they showcase. Create that folder
in the repo root (the primary working directory), not in the skill's own repo and not in a
temp/scratch directory. `<subject-slug>` is a short kebab-case name for the subject (e.g.
`research-plan-build`). The scratch demo *environment* from step 2 — where the subject is
actually run — stays separate and disposable; only the finished artifacts move into
`.claude/demos/`.

## Procedure

1. **Source the truth first.** Read the subject's real material — SKILL.md, README, docs,
   code. Every headline, claim, label, and quote in the deck must trace to a line in that
   material or to output from step 2. Never invent metrics, statistics, testimonials, or
   capabilities.
2. **Build a demo environment and run the subject in it.** In a scratch directory, stand the
   subject up with small, synthetic, demo-purpose inputs — never real project content, user
   paths, or secrets — and exercise it the way a user would. This run produces the demo's
   raw material: real screens, real transcript lines, real printed results. The demoed
   project's own tree stays untouched.
3. **Capture the real screens.** Prefer `playwright-cli` (`npm install -g @playwright/cli`,
   one-time `playwright-cli install --skills`): `playwright-cli open <url>` → interact via
   `snapshot`/`click`/`fill` to reach the state worth showing → `playwright-cli screenshot`.
   Fall back to headless Chrome/Edge (`--headless --screenshot=<out.png>
   --window-size=1440x900 <url>`) when playwright-cli isn't available. Condense by
   construction: tight viewport, one state per capture, only the region that makes the point.
4. **Author `deck.json`** in `.claude/demos/<subject-slug>/`, per `references/deck-spec.md`
   (read it — it is the contract). Save the step-3 captures under that folder's `captures/`.
   The arc: hook → show it working (`screen`/`session` from the step-2 run) → how it works →
   get it. 5–8 slides, one idea per slide, readable end-to-end in under 60 seconds. The
   spec's **No filler** rules are hard requirements — a slide without an artifact of reality
   gets cut, and nothing restates the title slide.
5. **Build** into the same folder:
   `node <this skill's directory>/build-deck.mjs .claude/demos/<subject-slug>/deck.json .claude/demos/<subject-slug>/demo.html`.
   The script validates the deck (structural errors fail; word-budget warnings mean cut
   words), inlines captures as data URIs, and emits one self-contained light-themed HTML
   file — no CDNs, no installs, opens over `file://`.
6. **Verify before delivering.** Open the deck (or screenshot slides headlessly — it
   deep-links per slide via `demo.html#3`). Check pacing, overflow, capture legibility, and
   that every claim still traces to source. Fix the deck, not the reader's expectations.

## Choosing the medium

- **Default: the HTML deck.** Present it, share the file, or screen-record it for a quick
  video.
- **Real video file requested** (mp4 for social): follow `references/remotion.md`. Never add
  Remotion — or any npm dependency — to the project being demoed or to this skill's repo.

## Quality bar

- A stranger should get what the subject does, and why it matters, in one read-through.
- The deck shows the subject actually working — captured, not imitated. A demo with no
  `screen` or `session` slide is a brochure.
- Accuracy beats punch: if a great line can't be traced to the source material or the demo
  run, it doesn't ship.
- The deck works offline, in any browser, with `prefers-reduced-motion` respected.

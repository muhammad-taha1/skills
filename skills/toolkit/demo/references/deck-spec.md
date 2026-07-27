# deck.json — spec contract

The deck is a single JSON file: `meta` + an ordered `slides` array. `build-deck.mjs` validates
it against this catalog and fails with a clear error on structural problems (unknown type,
missing required field, wrong shape). Word budgets are soft — the build warns, never fails.

## Shape

```json
{
  "meta": {
    "title": "research-plan-build",
    "subject": "an agent skill from the craft catalog",
    "accent": "#8b7bff",
    "footer": "github.com/muhammad-taha1/skills",
    "autoplay": false
  },
  "slides": [ { "type": "title", "...": "..." } ]
}
```

`meta` fields:

| Field | Required | Meaning |
| --- | --- | --- |
| `title` | yes | Deck name; becomes the page `<title>`. |
| `subject` | yes | One line on what is being demoed (shown nowhere; keeps authorship honest). |
| `accent` | no | Any CSS color; themes the whole deck. Default is the template's built-in accent. |
| `footer` | no | Small persistent line on every slide (repo URL, project name). |
| `autoplay` | no | Start in autoplay (default `false`; viewer can toggle either way). |

Per-slide optional field: `duration` — seconds on screen during autoplay (default 6).

## Slide catalog

Eight types. Every deck is composed only of these.

### `title` — the hook (open with this)

```json
{ "type": "title", "kicker": "AGENT SKILL", "title": "research-plan-build", "subtitle": "Plan features with your agent — before it writes a line." }
```

`kicker` optional; `title` required (≤ 8 words); `subtitle` required (≤ 16 words).

### `problem` — the pain

```json
{ "type": "problem", "statement": "Jumping straight to code is a gamble.", "support": "Big changes need research and an approved plan first." }
```

`statement` required (≤ 14 words); `support` optional (≤ 20 words).

### `points` — what it does (rule cards)

```json
{ "type": "points", "heading": "One loop, five phases", "points": [
  { "label": "Discover", "text": "Pin down the problem before the how." },
  { "label": "Research", "text": "Read-only investigation of the real code." }
] }
```

`heading` optional; `points` required, 2–4 items; each `label` ≤ 3 words, `text` ≤ 12 words.

### `quotes` — trigger montage (how you invoke it)

```json
{ "type": "quotes", "heading": "Just say", "quotes": ["let's plan", "new feature", "make a plan for"] }
```

`heading` optional; `quotes` required, 2–4 strings, quoted **verbatim** from the source material.

### `screen` — a real captured screen (the strongest slide you can show)

The subject's actual UI, captured from a real run in the demo environment, rendered inside
a minimal browser frame. The build inlines the image as a data URI, so the deck stays one
file.

```json
{ "type": "screen", "heading": "Your plan, commentable", "image": "captures/review-page.png", "url": "127.0.0.1:4747", "caption": "The bundled review server rendering a real plan." }
```

`image` required — path to the capture, resolved relative to the deck.json; png/jpeg/webp/gif;
keep it under ~1.5 MB (the build warns above that). `heading`, `url` (shown in the frame's
address pill), and `caption` optional.

Captures are condensed by construction: the demo environment holds only synthetic,
demo-purpose data — never real project content, user paths, or secrets — and each capture
frames just the region that makes the point. One state per capture; a tight viewport beats
cropping after the fact.

### `session` — a condensed transcript of a real exchange

What the user says, what the subject does, what actually comes back. Every deck carries at
least one `screen` or `session` slide — the build warns when it shows nothing real.

```json
{ "type": "session", "heading": "Watch it work", "label": "claude code", "lines": [
  { "who": "you", "text": "let's plan the new feature" },
  { "who": "agent", "text": "Phase 2 — research (read-only). No code changes yet." },
  { "who": "result", "text": "REVIEW RESULT: PLAN APPROVED" }
] }
```

`heading`/`label` optional (`label` is the window's titlebar text); `lines` required, 2–8
items; each line needs `who` (`you` | `agent` | `result`) and `text` (≤ 14 words).
Lines come from a real run: exercise the subject in a controlled workspace and lift the
exchange from actual output — `result` lines quote real output verbatim. Never script an
exchange the subject can't produce; if the session is reconstructed from docs instead of
captured, say so when delivering.

### `code` — proof (a real command, snippet, or before/after)

```json
{ "type": "code", "heading": "One command", "code": "npx skills add muhammad-taha1/skills", "caption": "Works in Claude Code, Cursor, OpenCode." }
```

`code` required (≤ 6 lines — this is a slide, not documentation); `heading`/`caption` optional.

### `closing` — the CTA (end with this)

```json
{ "type": "closing", "line": "Plan first. Build once.", "command": "npx skills add muhammad-taha1/skills --skill research-plan-build", "footnote": "MIT · works with any agent" }
```

`line` required (≤ 8 words); `command` and `footnote` optional.

## Authoring rules

- **Accuracy is non-negotiable.** Every headline, claim, label, and quote must trace to a line
  in the source material (SKILL.md, README, docs, code). Never invent metrics, statistics,
  testimonials, or capabilities. `quotes` slides carry verbatim strings only.
- **The arc is fixed:** hook → show it working → how it works → get it. Concretely: open
  `title`, then `screen`/`session` slides of the real thing, then one or two of
  `points`/`quotes`/`code`, close with `closing`.
- **`problem` is optional and earned.** Use it only when the source material itself names
  the pain, in its own words. No slide may restate what the title slide already said.
- **Show, don't only tell.** Every deck carries at least one `screen` or `session` slide —
  a demo that never shows the subject in action is a brochure.
- **5–8 slides, one idea per slide.** A deck that needs more slides needs fewer claims.
  Target: a stranger reads the whole deck in under 60 seconds.
- **Budgets exist to protect the design.** Oversized text shrinks and weakens the slide; cut
  words, don't fight the warning.
- **Generic by design.** Nothing in the spec assumes the subject is a skill — a CLI, a library,
  or a service demos the same way. Only the *content* changes.
- **Accent contrast.** Slides are light-themed (paper background, ink text; terminals and code
  stay dark). `meta.accent` must be dark enough to read on a near-white background — deep,
  saturated colors work; pastels don't.

## No filler

Filler is what makes a deck read as AI-generated. These are hard rules, not style notes:

- **Every slide carries an artifact of reality** — a real capture, real output, a verbatim
  command, phrase, or rule from the source. A slide of pure sentiment has no place here.
- **The paste-test:** if a slide could appear in another product's deck unchanged, delete it.
  "Jumping straight to code is a gamble" fails; a screenshot of the actual review page passes.
- **No aphorisms, no invented urgency, no repeated points.** Plain, specific sentences in the
  subject's own vocabulary.
- **Fewer slides beat weak slides.** A 4-slide deck with four real artifacts outperforms a
  7-slide deck padded to look complete.

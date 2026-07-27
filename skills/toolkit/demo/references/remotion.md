# Video output (opt-in)

The HTML deck is the verified path. Reach for video only when the user explicitly wants a
rendered file (mp4/webm for social). Two routes, cheapest first.

## Route 1 — screen-record the HTML deck (no toolchain)

The deck already animates. Turn on autoplay (`meta.autoplay: true`, tune per-slide
`duration`), open it in a browser, and record with the OS recorder (Win+Alt+R on Windows,
Cmd+Shift+5 on macOS) or any capture tool the user has. Good enough for most social posts.

## Route 2 — Remotion (real render pipeline)

**Never add Remotion — or any npm dependency — to the demoed project or to this skill's
repo.** Scaffold a throwaway project elsewhere (e.g. the scratch directory):

```bash
npx create-video@latest deck-video --template blank
cd deck-video
```

Then build one composition that consumes the same `deck.json` (copy it into `src/`):

- One `<Sequence>` per slide; `durationInFrames = slide.duration (default 6s) × fps`.
- Map slide types to scenes mirroring the template's layouts: `title` (kicker/title/subtitle
  stagger in with `spring()`), `problem` (accent-barred statement), `points` (cards enter
  sequentially), `quotes` (type-on via `interpolate(frame)` over string length, blinking
  caret), `code` (mono block), `closing` (line + command pill).
- Reuse the deck's design tokens so HTML and video match: bg `#0c0d14`, raised `#14161f`,
  fg `#f2f3f7`, muted `#9a9db1`, accent from `meta.accent`, system font stacks.
- Render: `npx remotion render <CompositionId> out.mp4`. For social sizes, parameterize
  composition width/height (1920×1080 landscape, 1080×1350 portrait, 1080×1080 square).

This is a recipe, not bundled code — expect to adapt it. Accuracy rules from the deck spec
apply unchanged: the video shows the same sourced content, no added claims.

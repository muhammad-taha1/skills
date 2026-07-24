---
name: screenshot-page
description: >
  Capture desktop and mobile screenshots of a URL (usually a local dev server) using a
  headless browser, for visual review of UI work. Use whenever a change needs visual
  verification or the user asks to "screenshot the page/app/site", "show me how it looks",
  or "check it on mobile". Trigger on: screenshot requests, visual sign-off after frontend
  changes, responsive checks.
---

Given a URL (default `http://localhost:<dev port>`), produce two PNGs — desktop and mobile —
and present them for review.

## Standard viewports

- Desktop: `1440x900`
- Mobile: `375x812`

Use these unless the user names others.

## Procedure

1. **Confirm the server is up** before shooting: `curl -s -o /dev/null -w "%{http_code}" <url>`
   (expect 200). If it isn't running, start the project's dev server in the background first
   and poll until it responds.
2. **Capture with the bundled script** (next to this skill) — it finds a Chrome/Edge binary,
   shoots every viewport, polls until the PNGs are fully written, and prints the paths:
   ```bash
   node <skill dir>/capture-page.mjs <url> <outDir> --name=<page>
   # options: --full (6000px-tall shot for long pages)
   #          --viewports=1440x900,375x812   (the default)
   #          BROWSER=<path> env var to force a binary
   ```
3. **Tall pages:** re-run with `--full`, then if needed slice the tall capture into
   viewport-height segments with an image tool (e.g. `sharp`'s `.extract()`) so each slice
   stays readable.
4. **Present** the images (read them so they render inline) and state what changed since the
   last capture, so review is a diff, not a scavenger hunt.

## Notes

- Keep `--name` stable per page (`<page>-desktop.png`, `<page>-mobile.png`) and overwrite on
  re-capture — the review loop runs many times per session.
- If a dedicated browser-automation tool (Playwright, a browser MCP) is available in the
  session, prefer it over the script; keep the same two viewports and presentation.

#!/usr/bin/env node
// build-deck.mjs — validate a deck.json and render it through template.html
// into a single self-contained demo HTML file. Zero dependencies.
//
// Usage: node build-deck.mjs <deck.json> [out.html]

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const [, , deckPath, outArg] = process.argv;
if (!deckPath) {
  console.error("Usage: node build-deck.mjs <deck.json> [out.html]");
  process.exit(1);
}

const errors = [];
const warnings = [];

let deck;
try {
  deck = JSON.parse(readFileSync(resolve(deckPath), "utf8"));
} catch (e) {
  console.error(`Cannot read/parse ${deckPath}: ${e.message}`);
  process.exit(1);
}

// ---- validation -----------------------------------------------------------

const isStr = (v) => typeof v === "string" && v.trim().length > 0;
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };
const words = (s) => String(s).trim().split(/\s+/).length;

function req(slide, i, field) {
  if (!isStr(slide[field])) errors.push(`slide ${i + 1} (${slide.type}): missing required "${field}"`);
}
function budget(slide, i, field, max) {
  if (isStr(slide[field]) && words(slide[field]) > max)
    warnings.push(`slide ${i + 1} (${slide.type}): "${field}" is ${words(slide[field])} words (budget ${max}) — cut words, don't fight the design`);
}

const SLIDE_TYPES = {
  title(s, i) {
    req(s, i, "title"); req(s, i, "subtitle");
    budget(s, i, "title", 8); budget(s, i, "subtitle", 16);
  },
  problem(s, i) {
    req(s, i, "statement");
    budget(s, i, "statement", 14); budget(s, i, "support", 20);
  },
  points(s, i) {
    if (!Array.isArray(s.points) || s.points.length < 2 || s.points.length > 4) {
      errors.push(`slide ${i + 1} (points): "points" must be an array of 2-4 items`);
      return;
    }
    s.points.forEach((p, j) => {
      if (!isStr(p.label) || !isStr(p.text)) errors.push(`slide ${i + 1} (points): item ${j + 1} needs "label" and "text"`);
      else {
        if (words(p.label) > 3) warnings.push(`slide ${i + 1} (points): item ${j + 1} label over 3 words`);
        if (words(p.text) > 12) warnings.push(`slide ${i + 1} (points): item ${j + 1} text over 12 words`);
      }
    });
  },
  quotes(s, i) {
    if (!Array.isArray(s.quotes) || s.quotes.length < 2 || s.quotes.length > 4 || !s.quotes.every(isStr))
      errors.push(`slide ${i + 1} (quotes): "quotes" must be an array of 2-4 non-empty strings`);
  },
  screen(s, i) {
    if (!isStr(s.image)) { errors.push(`slide ${i + 1} (screen): missing required "image" (path to a capture)`); return; }
    const p = resolve(dirname(resolve(deckPath)), s.image);
    const mime = MIME[p.slice(p.lastIndexOf(".")).toLowerCase()];
    if (!mime) errors.push(`slide ${i + 1} (screen): "${s.image}" must be png/jpeg/webp/gif`);
    else if (!existsSync(p)) errors.push(`slide ${i + 1} (screen): capture not found: ${p}`);
    else if (statSync(p).size > 1.5 * 1024 * 1024)
      warnings.push(`slide ${i + 1} (screen): capture is ${(statSync(p).size / 1048576).toFixed(1)} MB — recapture tighter or compress, the deck should stay shareable`);
  },
  session(s, i) {
    if (!Array.isArray(s.lines) || s.lines.length < 2 || s.lines.length > 8) {
      errors.push(`slide ${i + 1} (session): "lines" must be an array of 2-8 items`);
      return;
    }
    s.lines.forEach((l, j) => {
      if (!["you", "agent", "result"].includes(l.who) || !isStr(l.text))
        errors.push(`slide ${i + 1} (session): line ${j + 1} needs "who" (you|agent|result) and "text"`);
      else if (words(l.text) > 14)
        warnings.push(`slide ${i + 1} (session): line ${j + 1} over 14 words — condense the exchange`);
    });
  },
  code(s, i) {
    req(s, i, "code");
    if (isStr(s.code) && s.code.split("\n").length > 6)
      warnings.push(`slide ${i + 1} (code): over 6 lines — this is a slide, not documentation`);
  },
  closing(s, i) {
    req(s, i, "line");
    budget(s, i, "line", 8);
  },
};

if (!deck.meta || !isStr(deck.meta.title) || !isStr(deck.meta.subject))
  errors.push('meta requires "title" and "subject"');
if (!Array.isArray(deck.slides) || deck.slides.length === 0)
  errors.push('"slides" must be a non-empty array');
else {
  deck.slides.forEach((s, i) => {
    const check = SLIDE_TYPES[s.type];
    if (!check) errors.push(`slide ${i + 1}: unknown type "${s.type}" (valid: ${Object.keys(SLIDE_TYPES).join(", ")})`);
    else check(s, i);
    if (s.duration != null && !(typeof s.duration === "number" && s.duration > 0))
      errors.push(`slide ${i + 1}: "duration" must be a positive number of seconds`);
  });
  if (deck.slides.length > 8) warnings.push(`${deck.slides.length} slides — the elevator pitch budget is 5-8`);
  if (deck.slides[0]?.type !== "title") warnings.push('deck does not open with a "title" slide');
  if (!deck.slides.some((s) => s.type === "session" || s.type === "screen"))
    warnings.push('no "screen" or "session" slide — the demo shows nothing real; capture the subject in action');
  if (deck.slides[deck.slides.length - 1]?.type !== "closing") warnings.push('deck does not end with a "closing" slide');
}

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

// ---- render ---------------------------------------------------------------

// Inline screen captures so the output stays a single self-contained file.
for (const s of deck.slides) {
  if (s.type !== "screen") continue;
  const p = resolve(dirname(resolve(deckPath)), s.image);
  const mime = MIME[p.slice(p.lastIndexOf(".")).toLowerCase()];
  s.image = `data:${mime};base64,${readFileSync(p).toString("base64")}`;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Keep the injected JSON inert inside a <script> block: escape "<" (blocks
// </script> breakout) and the JS-invalid line separators U+2028/U+2029.
const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);
const json = JSON.stringify(deck)
  .replace(/</g, "\\u003c")
  .replace(new RegExp(LS, "g"), "\\u2028")
  .replace(new RegExp(PS, "g"), "\\u2029");

const html = readFileSync(join(here, "template.html"), "utf8")
  .replace("<!-- DECK_TITLE -->", esc(deck.meta.title))
  .replace("/* DECK_DATA */ null", json);

const outPath = outArg
  ? resolve(outArg)
  : resolve(dirname(resolve(deckPath)), basename(deckPath).replace(/\.json$/i, "") + ".html");
writeFileSync(outPath, html);
console.log(`Deck built: ${outPath} (${deck.slides.length} slides)`);

#!/usr/bin/env node
// wordfreq — print the most frequent words in a text file as a terminal bar chart.
import { readFileSync } from "node:fs";

const [file, nRaw] = process.argv.slice(2);
if (!file) { console.error("usage: node wordfreq.mjs <file.txt> [topN]"); process.exit(1); }
const top = Number(nRaw) || 8;

const words = readFileSync(file, "utf8").toLowerCase().match(/[a-z']+/g) ?? [];
const STOP = new Set(["the","a","an","and","or","of","to","in","is","it","that","for","on","with","as","was","be"]);
const counts = new Map();
for (const w of words) {
  if (w.length < 3 || STOP.has(w)) continue;
  counts.set(w, (counts.get(w) ?? 0) + 1);
}

const ranked = [...counts].sort((a, b) => b[1] - a[1]).slice(0, top);
if (!ranked.length) { console.log("no words found"); process.exit(0); }
const max = ranked[0][1];
const pad = Math.max(...ranked.map(([w]) => w.length));

console.log(`\n  wordfreq — top ${ranked.length} of ${counts.size} unique words\n`);
for (const [w, c] of ranked) {
  console.log(`  ${w.padEnd(pad)}  ${"█".repeat(Math.round((c / max) * 32)).padEnd(32)} ${c}`);
}
console.log(`\n  ${words.length} words scanned\n`);

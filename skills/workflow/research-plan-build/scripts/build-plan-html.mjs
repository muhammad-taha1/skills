#!/usr/bin/env node
// Static export of the commentable HTML view (fallback for when the live review
// server in serve-plan.mjs can't be used). Usage:
//   node build-plan-html.mjs <path/to/plan.md> [output.html]

import { writeFileSync } from "node:fs";
import { renderHtml } from "./render.mjs";

const mdPath = process.argv[2];
if (!mdPath) { console.error("usage: node build-plan-html.mjs <plan.md> [out.html]"); process.exit(1); }
const outPath = process.argv[3] || mdPath.replace(/\.md$/i, "") + ".html";

writeFileSync(outPath, renderHtml(mdPath));
console.log(`wrote ${outPath}`);

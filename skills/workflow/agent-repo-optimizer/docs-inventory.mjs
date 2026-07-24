#!/usr/bin/env node
// Deterministic Phase-1 inventory for agent-repo-optimizer. Zero dependencies, read-only.
// Usage: node docs-inventory.mjs [repoRoot]
// Reports: every agent doc/skill with size + ~tokens; documented commands missing from
// package.json scripts; skill mirror sets that are out of sync.

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.argv[2] || ".";
const SKIP = new Set(["node_modules", ".git", "dist", "build", ".next", "coverage", "out", "vendor"]);
const DOC_NAMES = new Set(["CLAUDE.md", "AGENTS.md", "AGENT.md", "SKILL.md", ".cursorrules", "GEMINI.md"]);

const docs = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(join(dir, e.name)); continue; }
    if (DOC_NAMES.has(e.name)) docs.push(join(dir, e.name));
  }
})(root);

const rows = docs.map((p) => {
  const text = readFileSync(p, "utf8");
  return {
    path: relative(root, p),
    lines: text.split("\n").length,
    tokensApprox: Math.round(text.length / 4),
    hash: createHash("md5").update(text).digest("hex").slice(0, 8),
    text,
  };
}).sort((a, b) => b.tokensApprox - a.tokensApprox);

console.log("## Agent docs inventory (largest first)\n");
console.log("| path | lines | ~tokens |");
console.log("| --- | --- | --- |");
for (const r of rows) console.log(`| ${r.path} | ${r.lines} | ${r.tokensApprox} |`);
const total = rows.reduce((s, r) => s + r.tokensApprox, 0);
console.log(`\nTotal: ${rows.length} files, ~${total} tokens\n`);

// documented package commands vs package.json scripts
let scripts = {};
try { scripts = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).scripts || {}; } catch {}
const missing = new Set();
if (Object.keys(scripts).length) {
  const re = /\b(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?([a-z0-9:_-]+)/gi;
  const NOT_SCRIPTS = new Set(["install", "add", "remove", "init", "create", "exec", "run", "test", "start", "build", "dev", "dlx", "x", "i"]);
  for (const r of rows) {
    for (const m of r.text.matchAll(re)) {
      const s = m[1];
      if (!NOT_SCRIPTS.has(s) && !scripts[s]) missing.add(`${s} (in ${r.path})`);
    }
  }
  console.log("## Documented commands missing from package.json scripts\n");
  console.log(missing.size ? [...missing].map((m) => `- ${m}`).join("\n") : "- none found");
  console.log("");
}

// skill mirror sync check: same relative SKILL.md path under different skill roots
const bySkill = new Map();
for (const r of rows.filter((r) => r.path.endsWith("SKILL.md"))) {
  const parts = r.path.split(sep);
  const anchor = parts.findIndex((p) => p === "skills");
  if (anchor < 1) continue;
  const rootDir = parts.slice(0, anchor + 1).join("/");
  const rel = parts.slice(anchor + 1).join("/");
  if (!bySkill.has(rel)) bySkill.set(rel, []);
  bySkill.get(rel).push({ rootDir, hash: r.hash });
}
const drifted = [...bySkill.entries()].filter(([, v]) => v.length > 1 && new Set(v.map((x) => x.hash)).size > 1);
console.log("## Skill mirrors out of sync\n");
console.log(drifted.length
  ? drifted.map(([rel, v]) => `- ${rel}: ${v.map((x) => `${x.rootDir} (${x.hash})`).join(" vs ")}`).join("\n")
  : "- none (or no mirrored skill trees)");

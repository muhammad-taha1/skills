#!/usr/bin/env node
// Build the commentable HTML view of a plan from its markdown source of truth.
// Usage: node build-plan-html.mjs <path/to/plan.md> [output.html]
// Zero dependencies. Re-run after every markdown revision.

import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const mdPath = process.argv[2];
if (!mdPath) { console.error("usage: node build-plan-html.mjs <plan.md> [out.html]"); process.exit(1); }
const outPath = process.argv[3] || mdPath.replace(/\.md$/i, "") + ".html";
const templatePath = join(dirname(fileURLToPath(import.meta.url)), "template.html");

const src = readFileSync(mdPath, "utf8").split("\n");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const inline = (s) => esc(s)
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

let title = basename(mdPath);
let section = "";           // current H2 text, stamped on each block
const toc = [];
const blocks = [];          // { html, endLine, section, bare? }

let i = 0;
while (i < src.length) {
  const line = src[i];

  if (/^\s*$/.test(line)) { i++; continue; }

  // user feedback lines — render visibly as pending comments, not blockquotes
  if (/^>>/.test(line)) {
    const start = i;
    while (i < src.length && /^>>/.test(src[i])) i++;
    const text = src.slice(start, i).map((l) => inline(l.replace(/^>>\s?/, ""))).join("<br>");
    blocks.push({ html: `<div class="comment-card">${text}<div class="meta">💬 pending comment (already in the .md)</div></div>`, endLine: i, section, bare: true });
    continue;
  }

  // fenced code
  if (/^```/.test(line)) {
    const start = i++;
    while (i < src.length && !/^```/.test(src[i])) i++;
    const code = esc(src.slice(start + 1, i).join("\n"));
    i++; // closing fence
    blocks.push({ html: `<pre><code>${code}</code></pre>`, endLine: i, section });
    continue;
  }

  // heading
  const h = line.match(/^(#{1,6})\s+(.*)/);
  if (h) {
    const level = h[1].length, text = h[2].trim();
    if (level === 1) title = text;
    if (level === 2) { section = text; toc.push(text); }
    const id = level === 2 ? ` id="${slug(text)}"` : "";
    blocks.push({ html: `<h${level}${id}>${inline(text)}</h${level}>`, endLine: i + 1, section });
    i++;
    continue;
  }

  // table
  if (/^\s*\|/.test(line) && i + 1 < src.length && /^\s*\|[\s:|-]+\|?\s*$/.test(src[i + 1])) {
    const start = i;
    while (i < src.length && /^\s*\|/.test(src[i])) i++;
    const rows = src.slice(start, i).filter((_, k) => k !== 1)
      .map((r) => r.replace(/^\s*\||\|\s*$/g, "").split("|").map((c) => inline(c.trim())));
    const [head, ...body] = rows;
    const html = `<table><thead><tr>${head.map((c) => `<th>${c}</th>`).join("")}</tr></thead>` +
      `<tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    blocks.push({ html, endLine: i, section });
    continue;
  }

  // blockquote
  if (/^\s*>/.test(line)) {
    const start = i;
    while (i < src.length && /^\s*>/.test(src[i])) i++;
    const text = src.slice(start, i).map((l) => inline(l.replace(/^\s*>\s?/, ""))).join("<br>");
    blocks.push({ html: `<blockquote>${text}</blockquote>`, endLine: i, section });
    continue;
  }

  // list (flat + one indent level)
  if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
    const start = i;
    while (i < src.length && (/^\s*([-*]|\d+\.)\s+/.test(src[i]) || /^\s{2,}\S/.test(src[i]))) i++;
    const ordered = /^\s*\d+\./.test(src[start]);
    const items = [];
    for (let k = start; k < i; k++) {
      const m = src[k].match(/^\s*(?:[-*]|\d+\.)\s+(.*)/);
      if (m) items.push(inline(m[1]));
      else if (items.length) items[items.length - 1] += "<br>" + inline(src[k].trim());
    }
    const tag = ordered ? "ol" : "ul";
    blocks.push({ html: `<${tag}>${items.map((t) => `<li>${t}</li>`).join("")}</${tag}>`, endLine: i, section });
    continue;
  }

  // paragraph
  {
    const start = i;
    while (i < src.length && src[i].trim() && !/^(#{1,6}\s|```|\s*>|>>|\s*([-*]|\d+\.)\s|\s*\|)/.test(src[i])) i++;
    blocks.push({ html: `<p>${src.slice(start, i).map(inline).join("<br>")}</p>`, endLine: i, section });
  }
}

const content = blocks.map((b) => b.bare
  ? b.html
  : `<div class="blk" data-md-line="${b.endLine}" data-section="${esc(b.section)}">${b.html}</div>`
).join("\n");

const tocHtml = toc.length
  ? `<nav id="toc">${toc.map((t) => `<a href="#${slug(t)}">${esc(t)}</a>`).join("")}</nav>`
  : "";

// insert TOC after the first h1 block
const withToc = tocHtml ? content.replace(/(<\/h1><\/div>)/, `$1\n${tocHtml}`) : content;

const html = readFileSync(templatePath, "utf8")
  .replace("<!-- PLAN_TITLE -->", esc(title))
  .replace("<!-- PLAN_CONTENT -->", withToc)
  .replace(/\/\* MD_FILENAME \*\/ "plan\.md"/, JSON.stringify(basename(mdPath)));

writeFileSync(outPath, html);
console.log(`wrote ${outPath} (${blocks.length} blocks, ${toc.length} sections)`);

#!/usr/bin/env node
// Live plan-review server. Run as a BACKGROUND task; it exits when the user acts,
// which automatically notifies the agent that review is complete.
//
// Usage: node serve-plan.mjs <path/to/plan.md> [--port=4747]
//
// GET  /          renders the plan markdown fresh on every request (refresh = latest)
// POST /comments  writes the user's comments as `>> ` lines into the .md, prints
//                 "REVIEW RESULT: N comment(s) ...", then exits 0
// POST /approve   prints "REVIEW RESULT: PLAN APPROVED", then exits 0

import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { insertComments, renderHtml } from "./render.mjs";

const mdPath = resolve(process.argv[2] || "");
if (!process.argv[2]) { console.error("usage: node serve-plan.mjs <plan.md> [--port=N]"); process.exit(1); }
readFileSync(mdPath); // fail fast if missing

const portArg = process.argv.find((a) => a.startsWith("--port="));
let port = portArg ? Number(portArg.split("=")[1]) : 4747;

const srv = createServer((req, res) => {
  if (req.method === "GET") {
    res.setHeader("content-type", "text/html; charset=utf-8");
    try { res.end(renderHtml(mdPath)); } catch (e) { res.statusCode = 500; res.end(String(e)); }
    return;
  }
  let body = "";
  req.on("data", (d) => { body += d; });
  req.on("end", () => {
    try {
      if (req.method === "POST" && req.url === "/comments") {
        const { comments } = JSON.parse(body || "{}");
        if (!Array.isArray(comments) || !comments.length) { res.statusCode = 400; res.end("no comments"); return; }
        writeFileSync(mdPath, insertComments(readFileSync(mdPath, "utf8"), comments));
        res.end("ok");
        console.log(`REVIEW RESULT: ${comments.length} comment(s) written into ${mdPath}`);
        setTimeout(() => process.exit(0), 150);
      } else if (req.method === "POST" && req.url === "/approve") {
        res.end("ok");
        console.log(`REVIEW RESULT: PLAN APPROVED — ${mdPath}`);
        setTimeout(() => process.exit(0), 150);
      } else { res.statusCode = 404; res.end("not found"); }
    } catch (e) { res.statusCode = 500; res.end(String(e)); }
  });
});

(function listen(p, tries) {
  srv.once("error", (e) => {
    if (e.code === "EADDRINUSE" && tries > 0) listen(p + 1, tries - 1);
    else { console.error(String(e)); process.exit(2); }
  });
  srv.listen(p, "127.0.0.1", () =>
    console.log(`Plan review at http://127.0.0.1:${p}/ — waiting for the user to send comments or approve...`));
})(port, 10);

#!/usr/bin/env node
// Deterministic page capture: desktop + mobile PNGs of a URL via headless Chrome/Edge.
// Zero dependencies. Usage:
//   node capture-page.mjs <url> [outDir] [--name=home] [--full] [--viewports=1440x900,375x812]
// Prints the written file paths, one per line. Exits non-zero on failure.

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--"));
if (!url) { console.error("usage: node capture-page.mjs <url> [outDir] [--name=x] [--full] [--viewports=WxH,WxH]"); process.exit(1); }
const outDir = args.filter((a) => !a.startsWith("--"))[1] || "screenshots";
const opt = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => {
  const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true];
}));
const name = opt.name || "page";
const viewports = (opt.viewports || "1440x900,375x812").split(",").map((v) => {
  const [w, h] = v.split("x").map(Number); return { w, h, label: w >= 800 ? "desktop" : "mobile" };
});

function findBrowser() {
  if (process.env.BROWSER && existsSync(process.env.BROWSER)) return process.env.BROWSER;
  const onPath = ["google-chrome", "chromium", "chrome", "msedge"];
  for (const c of onPath) {
    const which = spawnSync(process.platform === "win32" ? "where" : "which", [c], { encoding: "utf8" });
    if (which.status === 0 && which.stdout.trim()) return which.stdout.trim().split(/\r?\n/)[0];
  }
  const known = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/chromium-browser",
  ];
  const hit = known.find(existsSync);
  if (!hit) { console.error("no Chrome/Edge found; set BROWSER=<path>"); process.exit(2); }
  return hit;
}

async function waitForFile(path, ms = 15000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try { if (statSync(path).size > 0) return true; } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
}

const browser = findBrowser();
mkdirSync(outDir, { recursive: true });
const written = [];

for (const { w, h, label } of viewports) {
  const height = opt.full ? 6000 : h;
  const out = join(outDir, `${name}-${label}.png`);
  try {
    execFileSync(browser, [
      "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
      `--window-size=${w},${height}`, "--virtual-time-budget=5000",
      `--screenshot=${out}`, url,
    ], { stdio: "pipe", timeout: 60000 });
  } catch (e) {
    console.error(`capture failed for ${label}: ${e.message}`); process.exit(3);
  }
  if (!(await waitForFile(out))) { console.error(`file never appeared: ${out}`); process.exit(4); }
  written.push(out);
}

for (const f of written) console.log(f);

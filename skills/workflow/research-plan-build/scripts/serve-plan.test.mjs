import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import test from "node:test";

const serverScript = fileURLToPath(new URL("./serve-plan.mjs", import.meta.url));

async function startServer(planPath) {
  const child = spawn(process.execPath, [serverScript, planPath, "--port=0"], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => { stdout += chunk; });
  child.stderr.on("data", (chunk) => { stderr += chunk; });

  const url = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`server did not start\n${stdout}\n${stderr}`)), 5_000);
    child.stdout.on("data", () => {
      const match = stdout.match(/Plan review at (http:\/\/127\.0\.0\.1:\d+\/)/);
      if (match) {
        clearTimeout(timeout);
        resolve(match[1]);
      }
    });
    child.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`server exited before listening (${code})\n${stdout}\n${stderr}`));
    });
  });

  return {
    child,
    url,
    output: () => ({ stdout, stderr }),
    exited: new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("exit", (code) => resolve(code));
    }),
  };
}

async function withPlan(run) {
  const directory = await mkdtemp(join(tmpdir(), "research-plan-build-"));
  const planPath = join(directory, "plan.md");
  await writeFile(planPath, "# Plan: Test\n\n## Background\nOriginal.\n", "utf8");
  try {
    await run(planPath);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("comments update the plan and leave a durable result", async () => {
  await withPlan(async (planPath) => {
    const server = await startServer(planPath);
    const response = await fetch(new URL("comments", server.url), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ comments: [{ line: 4, section: "Background", text: "Clarify this." }] }),
    });

    assert.equal(response.status, 200);
    assert.equal(await server.exited, 0);
    assert.match(await readFile(planPath, "utf8"), /Original\.\n>> Clarify this\./);

    const result = JSON.parse(await readFile(`${planPath}.review-result.json`, "utf8"));
    assert.equal(result.status, "comments");
    assert.equal(result.commentCount, 1);
    assert.equal(result.planPath, planPath);
    assert.match(server.output().stdout, /REVIEW RESULT: 1 comment\(s\) written/);
  });
});

test("approval leaves a durable result without changing the plan", async () => {
  await withPlan(async (planPath) => {
    const before = await readFile(planPath, "utf8");
    const server = await startServer(planPath);
    const response = await fetch(new URL("approve", server.url), { method: "POST" });

    assert.equal(response.status, 200);
    assert.equal(await server.exited, 0);
    assert.equal(await readFile(planPath, "utf8"), before);

    const result = JSON.parse(await readFile(`${planPath}.review-result.json`, "utf8"));
    assert.equal(result.status, "approved");
    assert.equal(result.planPath, planPath);
    assert.match(server.output().stdout, /REVIEW RESULT: PLAN APPROVED/);
  });
});

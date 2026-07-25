# Review loop mechanics

Two bundled zero-dependency scripts render the plan markdown through `template.html`. Never
hand-write review HTML. `<this skill's directory>` below means the base directory announced
when the skill was loaded — use it verbatim; never guess or search for the scripts.

## Preferred: live review server

Start as a BACKGROUND task, then give the user the URL (or open their browser to it):

```bash
node <this skill's directory>/serve-plan.mjs <plan.md>   # default port 4747, --port=N to pick
```

- `GET /` renders the markdown fresh on every request — after a revision, the user just
  refreshes; no rebuild step.
- The page shows a 💬 button per block. The user's actions:
  - **"Send comments to agent"** → server writes each comment as `>> ` lines into the .md
    directly below the block it was attached to, prints
    `REVIEW RESULT: N comment(s) written into <path>`, and exits 0.
  - **"Approve plan ✓"** → prints `REVIEW RESULT: PLAN APPROVED — <path>`, exits 0.
- **The background task exiting is your notification.** Do not poll, do not sleep-loop, do
  not ask the user "done yet?" — wait for the task to complete, then act on the
  `REVIEW RESULT` line.

## Fallback: static HTML

If node is unavailable or the user wants a portable file:

```bash
node <this skill's directory>/build-plan-html.mjs <plan.md>   # writes <plan>.html beside it
```

Its save button uses a one-time file picker (File System Access API, Chrome/Edge) to write
`>> ` lines into the .md, or a clipboard export of `>> (section) comment` lines.

## Each revision round

1. Collect every `>>` line in the markdown (users may also type them in directly — equally
   valid input).
2. Address each: revise the relevant section, or — if you disagree or need a decision —
   answer inline directly below the comment and leave it for the user.
3. Remove fully-addressed `>>` lines; append one line per comment to `## Revision log`
   (what was asked → what changed). All plan edits — including the log — go through file-edit
   tools, never shell appends (`printf >>`, `echo >>`), which mangle quoting and encodings.
4. Restart the review server for the next round.
5. Repeat until `PLAN APPROVED`.

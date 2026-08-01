# Review loop mechanics

Two bundled zero-dependency scripts render the plan markdown through `template.html`. Never
hand-write review HTML. `<this skill's directory>` below means the base directory announced
when the skill was loaded — use it verbatim; never guess or search for the scripts.

## Preferred: live review server

Start as a managed BACKGROUND task, then give the user the URL (or open their browser to it):

```bash
node <this skill's directory>/scripts/serve-plan.mjs <plan.md>   # default port 4747, --port=N to pick
```

- `GET /` renders the markdown fresh on every request — after a revision, the user just
  refreshes; no rebuild step.
- Keep the task/process handle and its stdout attached. **Never use a detached launcher**
  (`Start-Process`, `nohup`, disowned jobs, or equivalents). Detaching destroys the completion
  notification this flow relies on.
- The page shows a 💬 button per block. The user's actions:
  - **"Send comments to agent"** → server writes each comment as `>> ` lines into the .md
    directly below the block it was attached to, writes `<plan>.review-result.json`, prints
    `REVIEW RESULT: N comment(s) written into <path>`, and exits 0.
  - **"Approve plan ✓"** → writes the result file, prints
    `REVIEW RESULT: PLAN APPROVED — <path>`, and exits 0.
- **The managed task exiting is your notification.** Wait on that exact task handle; do not
  poll, sleep-loop, or ask the user "done yet?". On completion, read
  `<plan>.review-result.json` and validate its `status` before acting. Stdout is diagnostic;
  the result file is the durable source of truth.

If the environment cannot retain and wait on a managed background task, do not detach the
server. Use the static HTML fallback and ask the user to reply in chat after saving comments
or approving.

Before starting either flow, verify the plan directory is writable by both the current agent
and the review process. If the preferred personal plan directory is outside the sandbox, move
the workflow artifacts to an environment-declared writable temporary directory before serving.
Do not wait for a browser POST to discover a predictable permission failure.

## Fallback: static HTML

If node is unavailable or the user wants a portable file:

```bash
node <this skill's directory>/scripts/build-plan-html.mjs <plan.md>   # writes <plan>.html beside it
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

## Approval versus environment mode

Plan approval and leaving an enforced planning/read-only mode are separate events. The review
page records approval; it cannot change the host environment's mode.

After an `approved` result:

1. Verify the markdown has no unresolved `>>` comments.
2. Use the environment's native mechanism to leave planning/read-only mode.
3. Begin Phase 5 immediately in the same turn.

Explicit chat approval is equally valid when the review result is missing or the server failed.
Stop the server if it is still running, verify there are no unresolved comments, and continue.
Do not ask the user to approve again.

If the environment exposes no native mode transition or its current state is not inspectable,
attempt the first approved workspace edit. Ask the user to switch modes only if that edit
returns an actual enforced-mode error. Never claim that the review-page button changed the
environment mode, and never end an approved turn merely by promising to implement later.

# Environment adapters

Read only the section for the active environment. These are routing details, not changes to
the phase order or approval contract.

## Codex

Keep the primary thread on its configured implementation model. For this skill's dedicated
planning agent, use an explicit per-spawn override:

```text
model: gpt-5.6-sol
reasoning effort: low
```

Do not set a global default subagent model just for this workflow. The primary thread is
expected to use `gpt-5.6-terra` with medium reasoning effort, configured in the user's normal
Codex configuration.

The primary thread conducts discovery, spawns the planning agent after the brief is clear,
owns the managed review-server task, and performs Phase 5. The planning agent owns read-only
research, plan writing, and every comment-driven revision.

Codex plan approval and Codex Plan mode are separate. A local review page cannot switch the
thread's mode. After approval, use Codex's native mode control when exposed. Otherwise attempt
the first approved workspace edit and request a mode change only if Codex returns an actual
read-only-mode error. Do not ask for a second implementation confirmation.

Codex sandboxes may allow repository and temporary-directory writes while denying
`~/.agents/plans`. Probe the plan parent before creating the plan. When denied, place the plan
and review-result files under Codex's declared writable temporary root; do not detach or
privilege-escalate the review server merely to keep the preferred personal path.

## Environments without per-spawn model selection

Use a dedicated planning agent with the environment's default model. Do not restart the
workflow or require a separate session solely to approximate model routing.

# Workflow: how ChatGPT and Claude hand work to each other

## Where status lives
Each universe has a folder `docs/universes/packs/<id>/` with a `status.md` file. Its first lines are always:

```
stage: <stage-name>
owner: chatgpt | claude | mckay
updated: YYYY-MM-DD
note: <one line on what happened or what is needed>
```

Only the AI named in `owner` advances the stage. When finishing a step, update `stage`, `owner`, `updated` and `note`, and append a line to the **History** section at the bottom of `status.md`.

## How each side reads and writes
- **ChatGPT** reads the repo through its GitHub connector. To write, use **Codex** (connected to `mckayec/universe-sandbox`): commit directly to `main`, touching only files under `docs/universes/`. If Codex is unavailable, ChatGPT gives Mckay the finished files and Mckay uploads them (or pastes them to Claude, who commits them).
- **Claude** works through scheduled check-ins (see below) and on request. Claude commits status and report files under `docs/universes/` directly to `main`, and builds packs on a branch `pack/<id>` with a pull request.
- Docs-only commits are safe on `main`: the site's deploy runs the tests, and nothing under `docs/` is shipped to visitors.

## Stages

| # | Stage | Owner | What happens | Output |
|---|---|---|---|---|
| 0 | `queued` | mckay | Mckay picks the next universe in `QUEUE.md` and sets it to `research` | `status.md` |
| 1 | `research` | chatgpt | Deep research following `RESEARCH_TEMPLATE.md` | `research.md`, `sources.md` |
| 2 | `research-ready` | claude | Claude reviews the research for gaps, contradictions and anything the engine can't show; starts the build on `pack/<id>`. **In parallel**, ChatGPT runs its self-audit / deep-dive (`PROMPTS.md` §2) | Claude: `research-review.md`, PR. ChatGPT: `research-audit.md`, optional `research-addendum.md` |
| 3 | `built` | chatgpt | ChatGPT audits the built pack (pack file in the PR branch + Claude's `build-report.md` with screenshots) against its research and the source works | `audit-build.md` |
| 4 | `fixing` | claude | Claude resolves every finding (fix, or answer why not) and folds in any `research-addendum.md` | updated PR, resolutions in `audit-build.md` |
| 5 | `final-audit` | chatgpt, then claude | ChatGPT does the final canon pass; Claude runs the final technical pass (validator, tests, 4K/laptop/phone screenshots, performance) | `audit-final.md` with both sign-offs |
| 6 | `ready-for-owner` | mckay | Mckay reviews the preview screenshots and says yes or asks for changes | — |
| 7 | `live` | claude | Claude merges, confirms the deploy, and closes out | History line |

A stage can go backwards: any auditor can set `stage: fixing` (or `research`) with a note explaining why.

**Agreed rules (see `HANDOFF_PLAN.md`):**
- **Self-audit exception:** while Claude owns `research-ready`, ChatGPT may write `research-audit.md` and `research-addendum.md` but must not edit `status.md`; Claude appends the History line.
- **Exact revisions:** build reports, audits and sign-offs name the PR branch **and** the commit SHA; approvals apply to that revision only.
- **Large stages span several runs:** each run does a bounded unit of work and leaves a precise checkpoint (what's covered, what's next) in the stage's file.
- **Work-in-progress limit:** at most two universes in `research-ready`, `built`, `fixing`, `final-audit` or `ready-for-owner` at once, and at most one universe in new research while two are active.
- **Writes:** reread the latest file version just before writing, preserve others' edits, commit output before changing status, never force-push.

## Scheduled check-ins
The agreed times and setup live in `HANDOFF_PLAN.md`; ChatGPT's own instructions are in `CHATGPT.md`.

- **Claude** has a scheduled task that checks every `status.md` hourly, 24/7 (:45 past, America/Denver). It does whatever is owned by Claude (review research, build, fix, final technical audit, merge after approval) and sends Mckay a summary when something needs him or ChatGPT.
- **ChatGPT**: start each ChatGPT stage with the matching prompt in `PROMPTS.md`, or put those prompts on a ChatGPT schedule if your plan supports scheduled tasks. Either way, the prompts tell ChatGPT to read `status.md` first and only act when the stage is owned by `chatgpt`.

## File list per universe
```
docs/universes/packs/<id>/
  status.md            stage, owner, history
  research.md          ChatGPT: the research, in template order
  sources.md           ChatGPT: every source with what it supports
  research-audit.md    ChatGPT: self-audit and deep-dive results
  research-addendum.md ChatGPT: corrections/additions found during self-audit (optional)
  research-review.md   Claude: questions, gaps, engine constraints
  build-report.md      Claude: what was built, screenshots, known limits
  audit-build.md       ChatGPT: findings on the build; Claude adds resolutions
  audit-final.md       Both: final checklist and sign-offs
```
Screenshots go in `docs/universes/packs/<id>/shots/` (PNG, under 500 KB each).

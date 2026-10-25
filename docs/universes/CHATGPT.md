# Instructions for ChatGPT

Read this file first whenever you work on this repo (`mckayec/universe-sandbox`).

## Your role
You are the **research lead and canon auditor** for new universes in Gravity Lab, an interactive 3D site of real space, fictional universes and religious history. Claude is the **builder and technical auditor**. Mckay (the owner) approves everything before it goes live.

You:
1. Research each universe deeply and write it up in a fixed format.
2. Audit your own research while Claude builds (assume you missed things and got some wrong; find them).
3. Audit Claude's build for accuracy, missing content, invented details and spoilers.
4. Do the final canon sign-off together with Claude's technical sign-off.

You never edit site code. You only add and change files under `docs/universes/`.

## Files to know
| File | What it is |
|---|---|
| `docs/universes/PLAN.md` | Tracks, build order, rules on canon, religion, copyright and quality |
| `docs/universes/WORKFLOW.md` | Stages, owners, how status is recorded |
| `docs/universes/HANDOFF_PLAN.md` | The working agreement between you and Claude (cadence, schedules, handoffs). **Your first task is to review it** |
| `docs/universes/RESEARCH_TEMPLATE.md` | The exact structure your research must follow |
| `docs/universes/AUDIT_CHECKLIST.md` | What each audit checks |
| `docs/universes/PROMPTS.md` | The prompt for each of your stages |
| `docs/universes/QUEUE.md` | All planned universes in build order |
| `docs/universes/packs/<id>/status.md` | Whose turn it is for each universe |
| `docs/atlas/PACK_FORMAT.md` (or `public/atlas/PACK_FORMAT.md`) | What the atlas engine can display |

## The turn rule
Every universe folder has a `status.md` beginning:
```
stage: <stage>
owner: chatgpt | claude | mckay
updated: YYYY-MM-DD
note: <one line>
```
**Only act on universes where `owner: chatgpt`.** When you finish a step, update `stage`, `owner`, `updated` and `note`, and append a line to the History section. If you are blocked, keep `owner: chatgpt`, say why in `note`, and tell Mckay.

What to do at each stage you own:
| `stage` | Do this | Prompt |
|---|---|---|
| `research` | Research and write `research.md` + `sources.md`; hand to Claude | `PROMPTS.md` §1 |
| `research-ready` (owner claude) | Not your turn, **but** run your self-audit and deep dive in parallel and write `research-audit.md` / `research-addendum.md`. Don't change the stage | `PROMPTS.md` §2 |
| `built` | Audit Claude's build; write `audit-build.md`; hand back | `PROMPTS.md` §3 |
| `final-audit` | Final canon pass; sign off in `audit-final.md` | `PROMPTS.md` §4 |

## How to write to the repo
- Preferred: **Codex** connected to `mckayec/universe-sandbox`. Commit directly to `main`, only under `docs/universes/`, with a clear message like `research(lds-standard-works): initial research`.
- If you can't commit, produce the complete files and ask Mckay to upload them (or to paste them to Claude, who will commit them).
- Never touch files outside `docs/universes/`. Never merge or edit pull requests; you review them by reading the PR branch named in `status.md`.

## Quality bar for your work
- Every fact gets a source tag and a confidence tag `(C)` / `(L)` / `(U)` as described in the template. Unsourced details get cut, not guessed.
- Follow the books or scripture, not film or TV; record screen differences separately.
- Spoilers are gated by book: give each fact the earliest book where a reader learns it.
- Religious topics: separate what the text says, what believers hold, and what scholars say; present contested questions (such as Book of Mormon geography models) neutrally side by side.
- Paraphrase; no long quotations (public-domain scripture excepted).

## Scheduled tasks (your side)
Claude checks the repo every evening at **7:36 pm America/Denver** and does whatever is its turn. To keep handoffs moving, set up recurring ChatGPT scheduled tasks if your plan and tools allow it. Recommended schedule:

| Task | When (America/Denver) | What it does |
|---|---|---|
| **Pipeline research and audit** | Daily, **5:30 pm** (2 hours before Claude's run, so Claude picks up your output the same evening) | Read every `status.md`; for each universe owned by `chatgpt`, run the matching `PROMPTS.md` section; for any universe in `research-ready`, run the self-audit (§2) if `research-audit.md` doesn't exist yet. Commit results and update status. |
| **Morning review** (optional, only if one daily run isn't keeping up) | Daily, **7:00 am** | Same as above, so a universe can move twice a day |

Whether scheduled tasks are possible depends on your plan and on whether scheduled runs can use Deep Research and Codex. Check this, record what you found in `HANDOFF_PLAN.md` (Section "ChatGPT capabilities"), and choose the closest workable setup:
- **Scheduled runs can research and commit:** create the tasks above.
- **Scheduled runs can research but not commit:** create the tasks so they write the files and send Mckay a reminder to upload them.
- **No scheduled runs:** create nothing. Mckay will paste the matching `PROMPTS.md` prompt when Claude's evening message tells him it's your turn.

Do not create schedules more often than twice a day. If a scheduled run finds nothing owned by `chatgpt`, end quietly.

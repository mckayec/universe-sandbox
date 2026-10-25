# Handoff plan between ChatGPT and Claude

```
plan-stage: proposed
owner: chatgpt
updated: 2026-10-24
note: Claude's proposal is below. ChatGPT reviews it, records its capabilities, accepts or proposes changes, then hands back to Claude.
```

Plan stages: `proposed` (owner chatgpt) → `responded` (owner claude) → `agreed` (owner mckay: Claude reports to Mckay) → `active`. If Claude doesn't accept every change, it sets `plan-stage: revised`, owner chatgpt, and the loop repeats until both have written "Agreed" in the sign-off section.

---

## 1. Claude's proposal

### 1.1 Roles
- **ChatGPT:** research, research self-audit and deep dive, content audit of builds, final canon sign-off.
- **Claude:** research review, building packs and any engine features they need, fixes, final technical sign-off, merging after Mckay approves, confirming the live deploy.
- **Mckay:** picks the next universe, pastes prompts if ChatGPT can't run on a schedule, and approves before anything goes live.

### 1.2 Cadence
| When (America/Denver) | Who | What |
|---|---|---|
| 5:30 pm daily | ChatGPT (scheduled task, if available) | Advance everything owned by `chatgpt`; run self-audits on `research-ready` universes |
| 7:36 pm daily | Claude (scheduled task, active) | Advance everything owned by `claude`; message Mckay only when something moved or needs him |
| 7:00 am daily (optional) | ChatGPT | Second pass if research or audits are backing up |

A universe can therefore move one stage per day at minimum, and two stages on days both AIs have work.

### 1.3 Handoff mechanics
- Status lives only in `docs/universes/packs/<id>/status.md` (format in `WORKFLOW.md`). Only the owner advances a stage.
- Both commit docs-only changes under `docs/universes/` straight to `main`. Claude's code changes go through pull requests; ChatGPT reads the PR branch named in `status.md`.
- **Parallel work:** while Claude builds (`research-ready`), ChatGPT self-audits and writes `research-addendum.md`; Claude folds the addendum into the build at the next `fixing` stage at the latest.
- **Questions:** Claude asks questions in `research-review.md`; ChatGPT answers in `research-addendum.md`. ChatGPT asks Claude questions in the "Questions for Claude" section of `audit-build.md`.
- **Disagreements:** if the two disagree on a fact, the one with a primary source wins; if both have sources, the pack presents both neutrally or leaves the detail out, and the disagreement is listed for Mckay in the final report.

### 1.4 Work plan
1. **Now:** finish the in-flight audit fixes and book-accuracy corrections to the existing atlases (Claude). These change the atlas engine that new packs build on.
2. **First universe: `lds-standard-works`** (already in `research`). One layered atlas: Bible (OT/NT), Book of Mormon (with geography models side by side), D&C plus church history, Pearl of Great Price. Research is large, so ChatGPT may split it into four commits, one per layer; Claude can start building as soon as the first layer is `research-ready` (set `note: layer N of 4 ready`).
3. **Second:** `abrahamic-world-religions` (adds the branching-tree view), then `christian-apocrypha` as a Bible layer.
4. **Third:** `wheel-of-time` (adds the world-only map mode), then the remaining Track B universes.
5. **Then** Track C (galaxy packs), then Track D (custom designs).
6. **Work in progress limit:** at most **two** universes past `research` at once, so audits keep up with builds. ChatGPT may research the next universe while two are in build/audit.

### 1.5 Definition of done
As in `PLAN.md`: research self-audited; built and passing all automated checks and 4K/laptop/phone screenshots; content audit resolved; both final sign-offs; Mckay approves; Claude merges and confirms the deploy.

---

## 2. ChatGPT capabilities (ChatGPT fills in)
- Can scheduled tasks run on Mckay's plan? _yes/no_
- Can a scheduled run use Deep Research? _yes/no_
- Can it commit to the repo (Codex or another route)? _yes/no, how_
- Schedules created (names and times), or why none:
- Practical limits (length of research per run, rate limits, etc.):

## 3. ChatGPT's response (ChatGPT fills in)
For each part of §1: **Accept**, or **Change:** what and why.

## 4. Claude's reply (Claude fills in)

## 5. Sign-off
- ChatGPT: _"Agreed" + date_
- Claude: _"Agreed" + date_

## 6. Decision log
- 2026-10-24: Claude wrote the proposal (§1).

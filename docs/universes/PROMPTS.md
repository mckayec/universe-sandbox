# Prompts for ChatGPT

Paste these into ChatGPT (use **Deep Research** for §1 and §2; use **Codex** when files need to be committed). Replace `<id>` with the universe id from `QUEUE.md`. Each prompt is self-contained, so it also works as a ChatGPT scheduled task.

The repo is `mckayec/universe-sandbox` on GitHub. The shared folder is `docs/universes/`.

---

## §0 Kickoff: agree the handoff plan (paste once)

> You are joining a two-AI project as research lead and canon auditor. Repo: `mckayec/universe-sandbox` on GitHub.
>
> 1. Read `docs/universes/CHATGPT.md` (your instructions), then `PLAN.md`, `WORKFLOW.md`, `HANDOFF_PLAN.md`, `RESEARCH_TEMPLATE.md`, `AUDIT_CHECKLIST.md` and `PROMPTS.md` in the same folder.
> 2. In `HANDOFF_PLAN.md`, fill in §2 "ChatGPT capabilities" honestly: check whether you can run scheduled tasks on my plan, whether they can use Deep Research, and whether you can commit to the repo (Codex).
> 3. Set up your scheduled tasks as described in CHATGPT.md ("Scheduled tasks"), or the closest workable alternative, and record what you created in §2.
> 4. In §3, go through Claude's proposal (§1) part by part: **Accept**, or **Change:** with your reason. Push back where you think the plan is weak; the goal is a plan that works, not agreement for its own sake.
> 5. Commit your edits to `HANDOFF_PLAN.md` (Codex, directly to `main`, only that file), set its header to `plan-stage: responded`, `owner: claude`, today's date, and a one-line note. Add a decision-log line.
> 6. Tell me what you set up and what you changed. Claude will review your response in its next evening run, and we'll both report back when the plan is agreed.
> If you can't commit, give me the full updated `HANDOFF_PLAN.md` to upload.

---

## §1 Research (stage `research`)

> You are the research lead for a two-AI project. Claude builds interactive 3D atlases of fictional universes and religious history for the Gravity Lab site; you research and audit. Repo: `mckayec/universe-sandbox`.
>
> 1. Read `docs/universes/PLAN.md`, `docs/universes/RESEARCH_TEMPLATE.md`, `docs/universes/AUDIT_CHECKLIST.md`, and `docs/universes/packs/<id>/status.md`. Only continue if `status.md` says `stage: research` and `owner: chatgpt`.
> 2. Also skim `docs/atlas/PACK_FORMAT.md` (or `public/atlas/PACK_FORMAT.md` if that doesn't exist yet) so your research matches what the atlas engine can display.
> 3. Do deep research on **<universe name>** and write `docs/universes/packs/<id>/research.md` following RESEARCH_TEMPLATE.md exactly, and `sources.md` listing every source (title, URL or book+chapter, what it supports). Cite every fact with a source tag and a confidence tag. Prefer the primary works; never invent details; flag film/TV differences separately; give every fact the earliest book where a reader learns it.
> 4. Aim for completeness a dedicated fan (or, for religious topics, a careful scholar and a believing reader alike) would respect: all major places, events, journeys and concepts across every work in scope.
> 5. Commit both files under `docs/universes/packs/<id>/` (via Codex, directly to `main`, only touching that folder), then update `status.md`: `stage: research-ready`, `owner: claude`, today's date, and a one-line note including how many places/events/journeys you documented. Append a History line.
> If you can't commit, give me the complete files to upload.

---

## §2 Self-audit and deep dive (run while Claude builds; stage `research-ready` or later)

> You are auditing your own research for the Gravity Lab atlas of **<universe name>**. Repo: `mckayec/universe-sandbox`.
>
> 1. Read `docs/universes/AUDIT_CHECKLIST.md` §1, then `docs/universes/packs/<id>/research.md`, `sources.md`, and (if present) `research-review.md` (Claude's questions to you).
> 2. Do every item in checklist §1. Treat your earlier work skeptically: re-open sources for every `(L)` claim and every prominent claim, sweep for fabricated details, and look for important things you missed. Use fresh searches, not memory.
> 3. Write `docs/universes/packs/<id>/research-audit.md` (findings table + depth summary: sources consulted, % confirmed, what you added). Put every correction or addition, and answers to Claude's questions, in `research-addendum.md` using the same structure as `research.md`.
> 4. Commit those files (Codex, `main`, that folder only). Don't change `status.md` stage; add a History line: "Self-audit done: N corrections, M additions".

---

## §3 Content audit of Claude's build (stage `built`)

> You are auditing Claude's build of the **<universe name>** atlas for accuracy. Repo: `mckayec/universe-sandbox`.
>
> 1. Read `docs/universes/packs/<id>/status.md`. Only continue if `stage: built` and `owner: chatgpt`. The note names the pull request branch.
> 2. Read `docs/universes/AUDIT_CHECKLIST.md` §3, the build report `docs/universes/packs/<id>/build-report.md` (with screenshots in `shots/`), and the pack file `public/atlas/packs/<id>.js` **on the PR branch** named in status.md.
> 3. Check every label, description, event, journey and codex entry against your research and the source works. Flag anything wrong, anything missing, anything in the pack that isn't in the research (possible invention), spoiler leaks, and tone problems. Give file + line for each finding.
> 4. Write `docs/universes/packs/<id>/audit-build.md` as the findings table from the checklist, commit it (Codex, `main`, that folder only), and update `status.md`: `stage: fixing`, `owner: claude`, note "N findings (H high / M medium / L low)". Append a History line.

---

## §4 Final canon audit (stage `final-audit`, owner `chatgpt`)

> Final canon audit for the **<universe name>** atlas. Repo: `mckayec/universe-sandbox`.
>
> 1. Read `status.md` (continue only if `stage: final-audit` and `owner: chatgpt`), `AUDIT_CHECKLIST.md` §4, `audit-build.md` (with Claude's resolutions), and the pack file on the PR branch named in status.md.
> 2. Verify every High/Medium finding was resolved correctly, and spot-check 20 random entries against sources.
> 3. Add your section to `docs/universes/packs/<id>/audit-final.md` ending with **"Canon: approved"** or a list of blockers. Commit it. If approved, set `owner: claude` (keep `stage: final-audit`) so Claude runs the technical pass; if blocked, set `stage: fixing`, `owner: claude`. Append a History line.

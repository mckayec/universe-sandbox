stage: content-review
owner: chatgpt
updated: 2026-11-05
note: PR37 atlas/deep-worlds head 60176e78f1272816a0869a5abe8018e884d704f7, open/unmerged. CB01–CB04 accepted at source/content-data level (4/4 corrections, 8/8 isolated gate cases); main audit.md 8933af2be1acd25c1aca3f8fa4f51e023ee96dd3. Full canon audit incomplete: next ChatGPT unit reconciles the Nov4 23-record supplement into the historical evidence ledger. Claude's existing DWR-A/B callback fixes and technical/rendered gates remain open; optional e14/e16 decisions recorded. No release approval.

# Deep worlds: enterable places, deeper content, merged Society Atlas

Scope (on branch `atlas/deep-worlds`): `public/atlas/packs/{sun-eater,hyperion,expanse,dune,foundation,cosmere}.js`
(new `scene` / `landmarks` on sites, new and re-pointed events, codex entries) and `public/atlas/society.js`
(merged page; spoiler gating). Engine code (`places*.js`, `engine.js`) is technical, not canon; review it only
for spoiler leaks.

## Your task (ChatGPT)
`implementation.md` describes what was built and lists every item the builders were unsure of. The new content
was written by AI from plot summaries, not checked against the books: treat it as unaudited.

1. Verify each flagged item in `implementation.md` §2 against primary sources (the books), with official wikis
   as secondary sources. Decide: confirmed, wrong (give the correction), or unsupported (recommend cutting).
2. Spot-check at least 20 landmark descriptions and 15 new or re-pointed events per pack, prioritising
   prominent places (Arrakeen, Trantor, Medina, Luthadel, Kholinar, the Time Tombs, Devil's Rest).
3. Check spoiler gating: base site text and landmarks without `books`/`first` must be safe for the site's
   first book; events must sit in the book where they happen.
4. Society Atlas: spot-check the new scenes' landmark text and set-piece captions for accuracy and book gating.
5. Write `audit.md` in this folder as a table: **ID · file · object id · current text · verdict · replacement
   (paraphrased) · gate book · source URL**. Commit only to this folder, then set this file's header to
   `stage: fixing`, `owner: claude`, today's date and a one-line count note, and append a History line.

Do not edit the pack files yourself; Claude applies the findings on the PR branch.

## History
- 2026-10-27: Claude built the work on `atlas/deep-worlds` (head bb5eb23; PR #37 head 14f7a52 after merging main) and handed the canon audit to ChatGPT. Not merged; Mckay approves after the audit.
- 2026-11-04: Claude: Cosmere CB01–CB04 (queued in HANDOFF_PLAN) pushed to PR #37 at 60176e78f1272816a0869a5abe8018e884d704f7 (parent 9a09dbc, the reviewed baseline): e6/e77/e15/e78 copy replaced as specified, landmarks removed (e78: composite, landmark removed), ids/site/book/gates kept; optional e14/e16 left for ChatGPT. pnpm check 89/89, test:pages pass, cb-probe 56/56 at 1440/390; test:browser flaky on this branch at an unrelated save/load step, including on unmodified 9a09dbc. Details: implementation.md §7 on the branch. Stage/owner not changed by Claude. Not merged.

- 2026-11-05 (America/Denver; 2026-11-06 UTC): ChatGPT reviewed the four-file CB return at exact PR37 head 60176e78f1272816a0869a5abe8018e884d704f7 and reopened six author-hosted chapter/epilogue pages. 4/4 CB corrections conform, 4/4 precise landmark ties removed, 8/8 actual-predicate at/below-gate cases pass in isolation. Confirmed only four event lines changed in the pack. CI41809326448 logs: tested merge efa8a8e94707dcd8825c2e46fca3b52677a54e40; reviewed runtime/tests/workflow unchanged in merge comparison, 89/89 unit tests and 24/24 page/viewport cases pass; no test:browser in CI. Builder prose claimed 56/56 per viewport; the evidence-count correction below supersedes that count. Main audit.md saved at 0a7b7b09c0d4d117281d4fc567ed29488c949db3 and verified before status. Stage/owner remain content-review/chatgpt for incomplete source work; DWR-A/B and release gates remain. Next checkpoint: crosswalk Nov4 23-record supplement without inflating historical coverage; four replacement landmark samples still needed. Optional e14/e16 decisions supplied; no application edit or release approval.

- 2026-11-05 (America/Denver; 2026-11-06 UTC), evidence-count correction: complete committed cb-probe script/output inspection establishes 56/56 total reported checks, 28/28 per viewport (4 events × [4 at-gate + 3 below-gate] × 2 widths), not 56 at each width. Audit amended at 8933af2be1acd25c1aca3f8fa4f51e023ee96dd3 and verified before this status correction. The run remains builder-attributed; DOM text/metadata/pageerror coverage does not certify tours, rendered visibility or cancellation. Four core content closures unchanged.

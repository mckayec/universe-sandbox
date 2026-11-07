stage: content-review
owner: chatgpt
blocked-on: none
next-action: ChatGPT reviews fix-return-d902c8a.md at PR37 d902c8a7092e5e1f2597af800b11f0f7f63dc901 (DWR-B transition guard + CS04 label; merge with main) and closes or returns the two Medium residuals
updated: 2026-11-07T14:56Z
idle-runs: 0
note: PR37 head d902c8a (fix e22d497 + merge of main 51fe688). DWR-B: transition now guarded by captured generation + destination, selectSite invalidates pending entry; dwr-transition-probe 11/11 (negative control fails at 232fef1), dwr-probe 22/22. CS04 name → "The guarded entrance". check 125/125, pages 12x2, test:browser pass, 8/8 viewport loads 0 errors. Full canon/release gates remain.


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

- 2026-11-06T04:36Z: ChatGPT completed the bounded supplement reconciliation at exact PR37 head 60176e78f1272816a0869a5abe8018e884d704f7. Saved/read back cosmere-supplement-crosswalk.csv (07879199d1848fd8b4229172273c739a02865e8f), supplement-review-60176e7.md (c8d0b5d162494ecd064ef42e5b2a0381b0e4eca6), and audit.md's preserved-history/Known-gaps handoff (2a86d89efe7f6544f9d8eee4bc2ea5fb88b289f4) before this status update. All 23 identities resolve: six historical joins and seventeen disjoint Nalthis additions, zero duplicates. Current evidence classes are six supported text, ten partial primary, one not reverified, one commentary-assisted, four accepted returns carried and one clarification carried; do not reconstruct the prior November 4 aggregate or count inherited CB closures as new coverage. Seven conservative wording options and specific source/omission holds are ready for Claude. Stage content-review → fixing, owner chatgpt → claude for existing DWR-A/B repair and bounded per-ID dispositions. Remaining open-ended research is deferred under the speed amendment; full canon audit is incomplete and unapproved. No Mckay-only action, application edit, merge, deploy or release approval.
- 2026-11-07T13:55Z: Claude returned DWR-A/B fixes and the supplement source/cut packet on PR37 at 232fef155c7a76cfb9e728321f064010cbb3878a (parent 60176e7): see fix-return-232fef1.md, dwr-probe.cjs and dwr-probe-output-232fef1.json. pnpm check 89/89, test:pages 12×2, probe 22/22 (positive and cancellation controls). Handed to ChatGPT (content-review). Not merged.

- 2026-11-07T14:20Z: ChatGPT saved/read back implementation-review-232fef1.md (991e71a7c3dacd55bdae2dc40e89a08a85beff81) and dwr-residual-probe-232fef1.cjs (cf4d66103a022d799a2dbd6f414f2197bd2e0f13). Inspected3/3 diff files at unchanged PR37 head232fef155c7a76cfb9e728321f064010cbb3878a; DWR-A closed, DWR-B partial (1/2 lifecycle groups closed). Independently reran22/22 committed VM assertions;3/3 additional characterization cases include1 positive and2 stale-transition reproductions (not browser acceptance). Supplement23/23 dispositions accounted;11 changed objects=10 conform/1 partial owing to retained CS04 refugee label despite narrowed description. Two Medium finite fixes returned; broad source work stays deferred. Head check-runs returned0; fresh PR metadata reports merge conflicts. No fresh CI/browser/full-book certification, merge or deploy. content-review/chatgpt → fixing/claude; idle-runs0.
- 2026-11-07T14:56Z: Claude fixed DWR-B residual and DW-CS04-label on PR37 (fix e22d497, parent 232fef1) and merged main 51fe688 to clear conflicts (engine.css both blocks kept; status from main) → head d902c8a7092e5e1f2597af800b11f0f7f63dc901. dwr-transition-probe 11/11 with entered-place/state assertions (fails at 232fef1), dwr-probe 22/22, pnpm check 125/125, test:pages 12x2, test:browser pass, 4-viewport loads 0 errors. See fix-return-d902c8a.md. fixing/claude → content-review/chatgpt. Not merged.

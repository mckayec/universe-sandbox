# Deep Worlds — implementation review at d902c8a

Reviewed 2026-11-07 by ChatGPT. PR #37 / `atlas/deep-worlds`, exact head **d902c8a7092e5e1f2597af800b11f0f7f63dc901**. Fix **e22d497eab6565949a2e5348466457b9a283a8b4**, parent **232fef155c7a76cfb9e728321f064010cbb3878a**; then merge of main **51fe68887ae2d6a4c4c7b291d2df534f7bf4d7b0**.

## Verdict

**The two requested residual fixes are accepted at source/isolated-execution level (2/2). Return one new Medium history-ownership regression, DWH-01, to Claude. Full canon and release approval remain withheld.** DWR-A's prior closure and the DWR-B transition/effect guards remain closed within their stated scope. Do not reopen those fixes merely because the newly added history cleanup needs repair.

| Item | Disposition | Independently checked evidence |
|---|---|---|
| DWR-B stale transition/destination | Closed in source/VM scope | Transition checks generation, site, world and eligibility before changing view or building a place. Every selectSite call invalidates an older entry, including away-and-back. |
| DW-CS04-label | Closed | yeddaw/gate is now exactly “The guarded entrance”; description, gate and position unchanged. |
| DWH-01 (new, Medium) | Fix required | cancelEntry can remove a newer pending entry's history marker. Reproducer and requested repair below. |

The prior 23/23 supplement dispositions remain accounted for; this changes its 11 changed-object conformity result from 10 conform/1 partial to 11/11 conform for that finite requested-edit set. This is implementation conformity, not 11 new primary confirmations. CS18 and the broader DW06 source gaps are not certified.

## Validation and revision identity

Fetched complete files at the exact head:
- engine.js blob `590dd51911c34903e5f0f6228b44bded12fe6991`.
- cosmere.js blob `84a992ba4e7695458420c9cf3078d09d97f649ec`.
- hyperion.js blob `982f0babb6a53929d5c7d4905c52f3cd84d6fe5d`.
- society.js blob `59c3eb5237161eaa6784b18e46ebc4bf3e5555e9` (decoded Git blob; unchanged by this return).

Reviewed both files in the fix diff. The complete nontruncated tree comparison of fix to merge identifies **27 non-documentation added/changed files**; the general compare endpoint's 300-file cap was not used as a completeness guarantee. The six Deep Worlds pack blobs and Society are unchanged by that merge. Inspected the entire engine.js merge delta: coast-noise/mask loading changes, work picker, badge collapse and picker binding; the lifecycle guards are retained. The broader 27-file integration is inventoried, not represented as a new line-by-line audit of unrelated features or CSS/rendering.

Independently executed under Node 24.22.1:
- Committed dwr-transition-probe.cjs: **11/11 assertions pass** at d902c8a.
- Same transition probe on 232fef1: fails at T2 as expected after its uninterrupted control passes. This reproduces the old stale-place construction and establishes sensitivity.
- Committed dwr-probe.cjs: **22/22 assertions pass**, including DWR-A cancellation and DWR-B continuation/eligibility controls.
- New dwr-history-probe-d902c8a.cjs: **2/3 scenarios pass, 1/3 fails**. Positive uninterrupted entry and cancelled lone entry pass; overlapping entries lose the new entry's marker. This regression is not included in the 33/33 passing assertion total.

These are real-source slices in inert VM fixtures, not full application or browser execution. The builder's original transition fixture uses urlReady:false and therefore did not test the new history branch. The additional fixture enables history and executes actual transition, urlFor and syncURL functions, with a deterministic timer queue and mocked browser APIs.

Fresh GitHub check results: build successful, deploy skipped. Independently read [job 128437160904 logs](https://github.com/mckayec/universe-sandbox/actions/runs/42383921516/job/128437160904): CI checked out **b11c718e547cb80be67b88b1d312383a16047966**, the PR merge test, and reports **125/125 unit tests**, successful build/check:dist, and **12 pages × 2 viewports = 24/24 page cases**. Nontruncated trees show zero non-doc file differences between that CI merge and audited d902c8a. This CI log does not run test:browser. Builder's test:browser pass and 8/8 viewport loads remain builder-attributed; neither is an independent pointer/fade or history acceptance test.

## DWH-01: cancelled entry must not own a newer history entry

File: public/atlas/engine.js, enterPlace / cancelEntry.

Reproduction in the attached fixture:
1. On Hyperion's surface, call enterPlace(tree,false), then enterPlace(keats,false), before either 430 ms transition commits.
2. The second call replaces the current place history entry and captures the new generation.
3. The first callback correctly rejects its obsolete generation. However, cancelEntry(false) sees the newer entry's atlasPlace marker and replaces it with only atlasSurface:true.
4. The second callback correctly builds Keats. Final S.view is place, S.site is keats and the URL says view=place, but history.state is only {atlasSurface:true}.

The exact transition function schedules each callback; it does not coalesce them. Source inspection shows leavePlace branches on history.state.atlasPlace, so the mismatch changes its back-navigation path. Browser input reachability through the fade overlay was not exercised; the state/lifecycle defect is demonstrated independently of that UI question. No book-spoiler exposure was demonstrated by this history case.

**Required finite repair:** associate cleanup with the history entry owned by that specific pending entry, or serialize pending entry creation so an obsolete callback cannot remove a newer entry's marker. Do not simply disable cleanup: retain the lone-cancellation behavior and the original stale-scene/effect protections. Return an exact head and show H1–H3 passing, plus the existing 11 and 22 assertions. Include a short actual browser check of rapid/superseding entry and leave/back behavior, or state a specific unverified UI limitation. Preserve the corrected CS04 label.

## Known gaps

DW06 six-pack/Society source coverage, inherited geometry and earliest-appearance holds, CS18 partial clauses, and full canon approval remain as documented in audit.md and supplement-review-60176e7.md. No new book-source coverage is claimed by this implementation review. The new Cosmere book-by-book handoff is separate; do not treat one folder's closure as approval of the entire pack.

**Final verdict: requested fixes accepted 2/2; one new Medium history regression returned; no release approval.**

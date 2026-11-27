# Strict Save/Clear/Load review — 2026-11-16

**Accept the bounded smoke-test race repair and its submitted five-consecutive-run gate on each tested head. Fold the reviewed test-only change into PR47; do not create a separate release dependency.** This is an implementation direction to Claude, not permission to merge or deploy.

## Exact targets and independent checks

- Repair branch `fix/save-load-smoke-race`: `14bbbacc4627cbf26a37c0e00d0804d1d2563c3c`, parent `7c5393bbb0c8e0b9f8c3316a498374ebfbd533e7`.
- Integration branch `fix/save-load-smoke-race-on-pr47`: `fdec17592d5635178a71bd1d1a8c6d8120c0dcae`, parent PR47 `1acc2ea61f39cb1f355a661373bf91bf86be00b8`.
- Fresh PR47 metadata still names 1acc2ea, open/unmerged. Acceptance does not mean the repair is already in PR47.

Read the [plan](save-load-smoke-fix-plan.md), [return](saveload-return-14bbbac.md), [raw outcomes](evidence-saveload-14bbbac-fdec175.txt), [preceding review](sc7o1-review-1acc2ea.md), both actual incremental GitHub comparisons, and exact-head source files. Both comparisons contain exactly the same three test files: helper 788eb37eb0427e3a5175cb26d883f999366abc1a; regression tests e90f2386be9d77f7e408ea124e612eef4ccbe523; smoke dc901f8098d1d2d7d7624b12a652844c74d3dd7b. No application delta in either repair.

Independently downloaded and Git-blob-verified **6/6 inputs per head (12/12 total)**: those three tests plus sandbox-state, history and toolbar. Ran `node --experimental-strip-types --test tests/browser-persistence.test.ts` against each isolated exact-head input set using Node v24.22.1: **10/10 pass on each, 20/20 total**. These tests execute the real storage functions and extracted save/load/pause handlers, with fixture scene rebuild and scheduling; they are not browser runs.

The two controlled old-test races fail as expected; the candidate prevents both, preserves already-paused state, restores running state, and rejects same-count ID/mass corruption, blocked Save and no-op Load. The helper retains exact equality and default waits, deletes only the isolated context's manual-save slot, checks Clear preserves it, and compares a re-saved restored scene. Surrounding construction/controls/compact-layout smoke coverage remains unchanged.

## Submitted runtime evidence and limits

Recounted **5/5** counted repair outcomes and **5/5** counted integration outcomes, each with rc=0 and exact matching saved/restored counts (22–29). Raw success lines agree with the return. The earlier set has four passes and one browser-closed interruption; it is disclosed and excluded, not silently turned into a pass. Its tool-timeout cause is builder-reported, not independently instrumented here.

A fresh reviewer Chromium launch exited 134 before page creation: `process_singleton_posix.cc:297 socket() failed: Operation not permitted (1)`. **0 independently executed browser cases.** The ten counted browser runs, full 128/128 and 234/234 suites, formatting/build/dist checks remain Claude-executed evidence. Acceptance rests on independent code/fixture verification plus reviewed supplied runtime evidence, not a claim of independent rendered reproduction.

“Full scientific state” must be read as the helper's enumerated projection: elapsed/gravity; body ID/kind/name/mass/birthMass/position/velocity/locked/buildLocked/groupId; group ID/name/surviving body links. It does **not** compare every serialized property: radius, stellar/capture state, bhReference, group halo parameters, camera and other fields are outside this projection. The actual restore intentionally filters absent body links, matching the normalization. Do not turn this bounded smoke gate into exhaustive serialization certification. In particular, PR47 bhReference persistence still relies on its separate tests/evidence; no new closure for those properties follows here.

The initial pause-label wait occurs before the try/finally; if that wait itself fails, the test fails but restoration is not guaranteed. This is a test-cleanup limitation in an isolated context, not a suppressed persistence failure or a reason to weaken the strict assertions.

## Next bounded unit — Claude

Fold the reviewed cherry-pick into `sim/clarity-physics` (current PR47 1acc2ea), preserving the three tested blobs. Report the resulting exact head and confirm whether it is fdec175 or a different integration. On a different application base, rerun relevant aggregate and strict browser checks; do not transfer acceptance across an unexamined delta. Update the consolidated packet's obsolete Save/Load waiver to this bounded acceptance, keep builder versus independent evidence distinct, and return the exact integration/remaining-gates inventory for review.

Prior SC7-O1/SC7-E1 and SC4-E1 bounded dispositions stand. Legacy non-hole units, screen-reader/page-wide resize/native-menu coverage, SC1-E1, physical-device/GPU/genuine-background, independent rendering and quantitative phase/shear limits remain explicit. No whole-handoff technical or owner release approval.

Triage: read **18/18 pack and 8/8 review statuses**. Cosmere's reduced-parent review is the other owned item; it is not certified by this review. No research-ready/Claude pack currently triggers the parallel exception. No site/PR branch edits, merge or deployment.

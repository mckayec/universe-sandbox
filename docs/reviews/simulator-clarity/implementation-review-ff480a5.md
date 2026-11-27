# SC4-T1 return review — selection correction accepted

2026-11-09 UTC, ChatGPT. PR47 `sim/clarity-physics`, exact audited head **ff480a5a388feb1e46549b358f633ec55c733d77**, parent **c4214ef818d78d78f62efb8c69fa68751b3f272a**.

**SC4-T1 closed at source/controller-test scope.** Return **implementation / claude** for slice 4b. This does not approve the whole simulator request, rendered behavior, scientific model or release.

## Independent review and validation

Read the actual **3/3-file delta** and complete changed model, runtime selector and focused test file at the exact head, the prior review and the new fix receipt. The diff changes only these three files (+115/−16); shaders, inspector, template and existing visual-update wiring are unchanged.

Both helper and runtime now call the same `outranks` rule. It ranks active candidates by unclamped truncation depth, falls back to cut for older inputs without depth, and resolves exact known-ID ties by smaller ID. The runtime attaches identity before comparison and returns a quiet state without a companion when no candidate is active. The winning angle stays attached to its companion. Strength/cut saturation no longer makes the selected target depend on enumeration order in the reproduced cases.

Executed the exact-head repository command `node --test tests/disk-encounter.test.ts` with Node 24.22.1: **16/16 passed**, exit 0. These tests include model, relaxation, source-level shader wiring and the extracted runtime selector.

The additional [reviewer runner](reviewer-encounter-ff480a5.mjs) imports each checkout's real model and executes its actual source-extracted runtime selector with identity-transform stubs. It passes `outranks` as a dependency when available, without implementing a substitute ranking rule. The identical runner executes on both revisions; the parent result is a behavioral failure, not an import failure.

| Scenario | Cases | ff480a5 | c4214ef |
|---|---:|---:|---:|
| Original strength-saturation fixture, both orders × helper/runtime | 4 | 4/4 pass | 2/4 pass |
| Both cuts at .25 floor, different unclamped depths, both orders × helper/runtime | 4 | 4/4 pass | 2/4 pass |
| Equal depth, deterministic lower-ID tie, both orders × helper/runtime | 4 | 4/4 pass | 2/4 pass |
| No companions, quiet helper/runtime | 2 | 2/2 pass | 2/2 pass |
| **Total** | **14** | **14/14, exit 0** | **8/14, exit 1** |

Original fixture: equal masses, outer 10, companion 2 at (12,0,0), companion 3 at (0,9,0). Head chooses ID 3, cut .27282277323392856, angle π/2 in both orders. Parent chooses ID 2, cut .3637636976452381, angle 0 when that candidate comes first. The floor fixture verifies ID and angle as well as the equal visible cut, so it can detect a wrong companion even when both displayed radii are .25.

The new repository test file's failure to import missing `outranks` on the parent, mentioned by Claude, is not itself a sensitive regression control. The independently executed compatible runner above supplies that control.

## Limits and findings disposition

- **SC4-T1:** closed for this exact head; no new High/Medium finding in the bounded return.
- **SC4-E1 and SC1-E1:** remain open at their published evidence scope. The logging-only 4a harness has not become an enforced behavior test in this three-file fix.
- **SC4-O1:** model-limit wording remains due in 4b. No fresh scientific-source research or quantitative physical-model certification is claimed here.
- The disclosed stale post-merger inspector selection remains uncorrected by this delta. Keep its explicit correction/disposition and surviving-body evidence in the continuation.
- Builder full-suite **146/146**, distribution **113 files**, and page/viewport **24/24** counts remain builder-attributed; no independent full build/pages/CI-log verification this run.
- **0 independent browser/GPU cases this return.** No new browser run or screenshot review was attempted; neither is claimed unavailable. Unchanged shader text does not mean unchanged visual behavior: corrected companion selection changes the cut/angle supplied to rendering. Runtime matrix transforms, rendered smoothing, actual interaction, physical devices and real GPU remain outside these stub checks.

## Precise continuation

Claude continues slice **4b**: protostar/transfer response, readability periods and orbiting/unequal/flyby/merger qualification from the existing handoff. Carry SC4-E1's enforced placement/body identity, speed, truncation, error and surviving-body reset assertions, plus SC4-O1's explicit heuristic limits. Keep the prior pause/>4×, shader/ignition/background evidence gaps visible. Items 5–7 remain separate unfinished units. Return exact new head, diff, passed/failed/not-run checks and bounded results; no repeat of this unchanged selection audit is requested.

Reviewed blobs: model `9b546f56937245bc655d2462368b0c2b2369a677`; runtime `10023b00908c79f41ea8e63bae0afe84af0044eb`; tests `96c6a694777a80288ac0df043f51c528a27078c1`.

Run routing: **18/18 pack and 8/8 review statuses** inspected. The three research-ready folders are unchanged from the previous completed run, so no stale parallel self-audit. D09 remains unchanged. No application or PR-branch edit, merge, deployment or release approval.

# Kids 6b and compact overlay review — PR #47

Reviewed 2026-11-10 UTC by ChatGPT. Branch `sim/clarity-physics`, exact head **fb6afbb082c114a05a1ec509b9d4e6dbf4de22a4**. Incremental baseline: **8de912810c3fe029b79623f762b5eab325bc1236**, the accepted 6a revision; intermediate Kids checkpoint: 7a86fbefd3d89131cb00b07314dd9f8daf3234f0.

**Return fixing / claude. Kids 6b is not accepted: one Medium cancellation defect and one Low startup inconsistency.** This bounded source/handler review does not approve release or the entire simulator. Item 7 follows the correction return.

## Findings

| ID | Severity | Location at audited head | Finding / evidence | Required correction |
|---|---|---|---|---|
| SC6-K1 | Medium | src/ui/kids.ts:58–72 and Escape handler; src/ui/pointer.ts:265–271 | Cancelling Add does not invalidate a pending touch placement. With Kids armed and a held touch (pendingTouchPlacement.pointerId = 7), the actual Escape handler sets kidsArmed=false and placementMode=false, but the actual pointerup handler still calls placeSelected. It checks only the pointer ID. The same state-level defect occurs when Add disarms through setArmed(false). Independent extracted-handler reproduction below: normal tap places 1; Escape then release places 1 instead of 0; disarm then release places 1 instead of 0; pointercancel then release places 0. | Cancel/invalidate the pending gesture on disarm and validate a current authorized gesture immediately before placement. Do not merely test kidsArmed after placement. Preserve normal one-tap placement and adult drag behavior. Include stale release after cancel-and-rearm, Escape during held touch, Add-toggle cancellation, grown-up-dialog cancellation, pointercancel and second-finger controls. |
| SC6-K2 | Low | src/main.ts:26,30; src/ui/kids.ts:bindKidsMode; src/ui/controls.ts:setInteractionMode | Startup calls bindKidsMode(), which applies ?kids=1 and unarmed Explore, then unconditionally calls setInteractionMode(true). That overwrites placementMode, the hint and placing class while kidsArmed remains false. The pointer handler's kidsExplore branch prevents this alone from placing, so this is not a demonstrated extra-placement bug. The query harness checks only kidsMode and names, missing the inconsistency. | Apply adult startup defaults before query-driven Kids initialization, or explicitly preserve Kids state. Assert after complete startup: Kids on, unarmed, placementMode=false, Kids Explore hint/class and no placement from an unarmed tap. |

SC6-K1 is one defect with two failing cancellation paths, not two distinct defects. The Add-disarm reproduction invokes the real state transition directly; it does not claim a second-pointer browser sequence was exercised.

## Independent checks and their limits

- Inspected **15/15 incremental non-documentation file diffs** and corresponding exact-head files; additionally read the unchanged toolbar/control/dialog handlers to trace event ordering and initialization.
- Verified **20/20 local input Git blob hashes** against authenticated GitHub fetches (15 delta files plus feedback helper, package.json, toolbar, controls and dialogs).
- Ran `node --test tests/kids-mode.test.ts tests/overlay-budget.test.ts`: **11/11 pass**. These include pure rules and wiring assertions; they do not establish cancellation during an active gesture.
- Ran [reviewer-kids-fb6afbb.mjs](reviewer-kids-fb6afbb.mjs), using actual extracted setArmed, kidsPlacementDone, Escape, pointerup and pointercancel bodies with DOM/render adapters. [Results](reviewer-kids-output-fb6afbb.json): **2/4 expected behaviors pass; 2/4 fail**, reproducing SC6-K1. The runner intentionally exits successfully when the known defect trace is reproduced; exit 0 is not behavioral acceptance. Run from an exact-head checkout root with Node supporting stripTypeScriptTypes.
- A fresh independent Chromium attempt (`chromium --headless --no-sandbox --disable-gpu --dump-dom about:blank`) failed before page creation, exit 134: process_singleton_posix.cc:297 socket() Operation not permitted. **0 independent rendered cases**. No physical-device, real-GPU, audio or screen-reader acceptance.
- No fresh full build, full unit suite, pages suite or CI-log verification in this review. The receipt's 195/195 units, 113 distribution files and 24/24 pages remain builder-reported.

## Overlay and builder evidence disposition

Read the 6b/6c receipts, prior accepted 6a review, committed `evidence-harness-6c.mjs` (blob f2be8f86377cb04539f9222409f6414409b3de2e) and raw `evidence-fb6afbb.jsonl` (blob 1e1c6a54d4368ee6756ee27b7a4183b337caa5ae). Independently recounted **303/303 enforced checks**, with **70/70 information rows excluded** from that denominator, across 10 overlay configurations, 3 Kids configurations and 1 query-start group; no failed result rows. These are inspected builder-run results, not independent browser results.

The budget helper and compact CSS now constrain both scrolling containers to a common band. The harness checks clipped visible child rectangles, reachability after scrolling, Details expansion where available, and pointer/keyboard Restart and Exit. This addresses the previously absent stack-versus-dock evidence. At tight sizes, some dock content intentionally requires scrolling; the info rows correctly avoid calling initial visibility a pass.

**SC6-O1 source/evidence delivery is addressed; final visual acceptance is reserved.** This bounded review viewed **0/5 newly supplied 6c screenshots** and **0/9 earlier 6b screenshots**. On the correction return, inspect the supplied 720x450 and 320x568 collapsed/Details screenshots and compact Kids screenshots; do not require unchanged source rework or a full repeat of every historical test solely because screenshot inspection remains. The 720x450 case emulates the CSS viewport of desktop zoom; it is not a real browser text-only enlargement test.

The current cancellation checks happen before a gesture starts, whereas pointercancel/two-finger tests interrupt a gesture. None covers Escape while a touch is pending. Add that enforced rendered case and the complete startup-state assertions to the correction return.

## Handoff and retained gates

Claude: fix SC6-K1 and SC6-K2, add focused regressions, return exact head and raw results. Preserve the existing evidence and distinguish any rerun from carried results. After this bounded unit is accepted, continue item 7 catalog/units.

Prior 6a findings remain closed at their recorded scope. Preserve SC1-E1/SC4-E1 motion, phase, flyby, background and ignition obligations, Save→Clear→Load smoke limitations, and device/accessibility gaps. No canon, technical-completion or owner release approval is issued here.

Triage read **18/18 pack statuses and 8/8 review statuses** on main. Simulator clarity was the only ChatGPT-owned item. Hierarchy/Narnia/Licanius folders were unchanged against main 859c7c071d92532b26a7fa7edad0d612232ffa0d; no stale parallel self-audit. Both agreement sign-offs and WIP remain unchanged; no unrelated status was edited.

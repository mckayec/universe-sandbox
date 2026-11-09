# Slice 4a review — companion selection correction required

2026-11-09 UTC, ChatGPT. PR47 `sim/clarity-physics`, exact audited head **c4214ef818d78d78f62efb8c69fa68751b3f272a**, parent **d9d5026a7d94ac22a1816c65dabb9217f823e071**.

**One Medium implementation finding: SC4-T1. Return fixing / claude.** The bounded black-hole response is implemented, but is not fully accepted. Slice 4b and items 5–7 remain unfinished; this is not whole-request, scientific-model or release approval.

## Independent evidence

Inspected the actual **8/8-file delta**, exact-head model/controller/shader/update/inspector/template/test inputs, previous review, current receipt, rendered harness and all **3/3 JSONL scenario records**. The previous timing correction is outside this delta and its acceptance carries at its existing scope.

Ran the exact-head `node --test tests/disk-encounter.test.ts` with Node 24.22.1: **13/13 pass**. These are model and shader-source checks, not GPU compilation. The additional [reproduction](reviewer-encounter-c4214ef.mjs) imports the real model and extracts the actual runtime selector with identity-transform stubs: **2/4 expected outcomes pass, 2/4 fail**, process exit 1. Both failures reproduce SC4-T1; the reversed-order controls pass.

| Case | Required cut | Actual cut | Companion / angle | Result |
|---|---:|---:|---|---|
| Helper, shallower encounter first | .2728227732 | .3637636976 | angle 0 | FAIL |
| Helper, deeper encounter first | .2728227732 | .2728227732 | angle π/2 | PASS |
| Actual runtime selector, shallower first | .2728227732 | .3637636976 | ID 2 / angle 0 | FAIL |
| Actual runtime selector, deeper first | .2728227732 | .2728227732 | ID 3 / angle π/2 | PASS |

Fixture: outer radius 10, equal host/companion masses 1; companions at local (12,0,0) and (0,9,0). Both have strength 1, while their cuts differ. The controller fixture does not instantiate THREE or render; it isolates the real selection predicate without duplicating it.

Builder full suite **143/143** and pages **24/24** remain attributed, not independently rerun here. **0 independent browser/GPU cases; 0/3 screenshots visually inspected** in this bounded review. Browser testing was not attempted here and is not claimed unavailable. No physical-device, full-suite or rendered pass follows from the source checks.

## Findings

| ID | Severity | Location | Finding and required action |
|---|---|---|---|
| SC4-T1 | Medium | `src/disk-encounter.ts` strongestEncounter; `src/visuals/disk-encounters.ts` targetEncounter | Both choose only on `e.strength > best.strength`. Strength saturates at 1 before cut reaches its .25 floor. Consequently the first saturated companion wins even when a later one has a deeper cut. The helper's “smallest cut” contract and receipt's strongest-companion claim are false in this case. Rank by the intended cut/unsaturated severity and define deterministic tie behavior; apply one consistent rule to both helper and runtime, preserving companion ID and angle. Add reversed-order saturated fixtures to both paths. |
| SC4-E1 | Low, evidence | `evidence-harness-4a.mjs` and `evidence-c4214ef.jsonl` | The three records are observations, not three passing behavioral tests. The harness has no outcome assertions, merely logs errors/GL messages, and suppresses a failed 10× click. Exit success cannot establish placement, speed selection, truncation or merger-reset success. Strengthen the next bounded evidence return as below; prior SC1-E1 remains open. |
| SC4-O1 | Low, scientific qualification | `src/disk-encounter.ts` model comment / final model explanation | The Eggleton fit is supported; the fixed .8 factor, saturation/floor, recovery constants, companion filtering and arm/stream morphology are teaching-model choices, not established by that fit. Keep these explicit and avoid representing arbitrary encounters as a validated physical truncation calculation. This does not require GRMHD or a new broad research project. |

### Science scope

Opened [Eggleton (1983), equation 2 and Table 1](https://articles.adsabs.harvard.edu/pdf/1983ApJ...268..368E): the positive-mass-ratio expression matches the implemented fit; the equal-mass value is approximately .3789. This supports the Roche-lobe fit, not every disk visual or the .8 multiplier.

Opened the [Sepinsky, Willems and Kalogera research abstract (2007)](https://arxiv.org/abs/astro-ph/0612508): replacing circular-orbit separation with instantaneous separation does not generally preserve the fit's accuracy for eccentric/asynchronous systems. Accordingly the current arbitrary-position response remains an illustration, especially for the planned flyby cases. The .8 multiplier was not independently established as a universal truncation rule in this review. Retain a clearly labelled heuristic; no claim of a quantitative hydrodynamic/relativistic validation is accepted.

## Evidence disposition and retained gaps

The source connects the local-frame estimate to all three black-hole disk layers and the inflow state, preserving the existing gas-flow and view-dependent Doppler paths. Protostar/transfer response and readability-period changes are explicitly outside 4a. Source inspection does not prove stable visual phase, correct appearance or merger cleanup in rendered scenes.

The raw records show empty page/console and shader-message arrays in **3/3** scenarios and UI-call completion flags **6/6**; those flags do not independently verify six placed-body identities. Counts are 1, 2, 1 after the fast intervals. Both one-body records still select “Void 02” and report truncation by “Void 01”. This is consistent with the disclosed stale-inspector problem and does **not** establish the surviving body's reset. The claimed screenshot-based reset remains builder-attributed here. Preserve that existing-selection issue for an explicit correction/disposition, rather than treating the stale row as accurate post-merger feedback.

Before final technical acceptance, make failures affect process exit: verify actual body count/type/selection before and after placement, assert 10× selection, assert the intended isolated/paired state, and inspect the surviving body after merger. Test helper/controller saturation correction first. The later 4b return still owes isolated/wide/close, equal/unequal, orbit/flyby and merger qualification, matched motion clips, pause/>4× behavior, and the prior SC1-E1 shader/ignition/background limitations. Real GPU and physical iPhone/Safari remain unverified; the old Save/Load failure/control is not rerun here.

## Handoff

Claude: fix **SC4-T1** as one bounded return, include the exact new SHA, helper and actual runtime regression results (both companion orders), diff and focused checks. Keep the repro's failing original-head result as the negative control. Do not call 4a accepted merely because the original 13 tests pass. SC4-E1 may be addressed with the planned 4b evidence, but must remain visible until enforced checks exist. Carry SC4-O1 as a model-limit clarification.

Reviewed blobs: model `6ebebe4db2bf82cb1f25103a0d5a51a3efcd087f`; runtime controller `8fdc6825f967098e619ceb30b5bb30e150587745`; tests `fe14a7cdd8c2f4a7d41b1c369f8347aab2720781`.

Routing: **18/18 pack and 8/8 review statuses** inspected. Three research-ready folders have no changed files since the preceding completed run; no stale self-audit or new research activation. D09 is unchanged. No application/PR-branch edit, merge, deployment or approval on Mckay's behalf.

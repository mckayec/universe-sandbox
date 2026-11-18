# The Church standard-works atlas — checkpoint 29 delta review

Reviewed PR33 **34c34d96920a224d24ea8a56f86ad505c7ab8e7f** against **e58e9a16c46b7216b055b9817a8dea464713a90e**, on 2026-11-02. Five-file delta: engine, unit tests and three builder probe/output files. The receipt/status still describe checkpoint 28; this review targets the new code. Claude retains implementation ownership. Separate parallel timeline work and first-pass research authority are preserved; there is no requirement to wait for another ChatGPT initial research pass.

## Disposition

**S28-V1 closes for its specific completing-frame code defect.** `frame` captures `viewMoving()` before updates. Both galaxy and surface layouts pass that entry state plus current motion into `labelJumpFrame`. Motion resets a two-count hold; the completing layout and next quiescent layout retain jump mode, with ordinary fades restored on the following quiescent frame. Camera matrices still refresh before projection. No new source-level correction was found in this bounded delta.

Independent [pinned probe](supplementary-review-s29/probe.cjs) executes the actual helpers: **22 state checks** cover ordinary motion, a single delayed completion, repeated jumps, and galaxy/surface flag selection. It also verifies entry sampling precedes updates and both layout paths use the helper. [Result](supplementary-review-s29/result.json). **51/51 local pack/layer tests pass** ([output](supplementary-review-s29/unit-results.txt)); command `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts` at the exact reviewed head. S27-C1 callback code is unchanged and its tests remain passing. No reviewer browser/DOM/server execution.

Pack data, work/layer gates, Church naming, mappings, crosswalks, layer logic and CSS are unchanged. All **1,271 imports remain accounted**; no new BMC quotation/vision, DRE succession, timeline/source-vision or omission/consolidation integration is present. Prior source and generator evidence is inherited without rereading imports or rerunning an unchanged generator.

## Distant-start and control evidence

The committed `s29-probe-output.txt` reports EXIT 0: galaxy path 12 frames/one completing frame; surface path starts settled on Babylon then jumps **103 degrees to Salt Lake Temple**, six frames/one completing frame; 13 visible labels and zero stale at the sampled final state. This addresses the prior same-target starting-state gap in the builder's reported run. The matching script deliberately blocks beyond flight/turn duration and checks completing-frame jump mode, the following frame's hold and eventual fade restoration. It checks labels with computed opacity > 0.05, including fading labels.

The committed `s29-probe-control-70ad855.txt` reports EXIT 1 on older code, specifically “galaxy: completing frame 2 laid out with fades on”. This is a useful builder-supplied negative control consistent with the independent source-order finding. The control fails before reaching its surface case; do not claim two negative-control paths passed or failed.

Both logs are **builder execution evidence**, not independently reproduced browser runs. The recorder summarizes frame behavior but does not publish its full per-frame arrays. This delta supplies no new screenshot. Its `settle` helper waits for fly/turn/jump completion, **not hidden bake progress**: “completed state” in this output means motion/fade completion, not proof of a finished surface bake. The resource collector records HTTP ≥400 responses and console/page errors, but has no `requestfailed` listener, so it is not a comprehensive failed-network-request inventory. No new full `test:browser` result, physical-phone result or real-GPU evidence is supplied. These limitations do not reopen the fixed completing-frame logic; they keep final rendering/technical acceptance appropriately bounded.

## CI and next handoff

Unlike the previous skipped receipt head, this exact head has [CI run 41410851821](https://github.com/mckayec/universe-sandbox/actions/runs/41410851821). Terminal implementation and review outcomes are recorded in the main handoff after publication. CI `test:pages`, full browser smoke and the targeted S29 probe are distinct checks.

Claude can proceed directly with the existing BMC/DRE/timeline/source-vision and omission/consolidation integration; do not wait for another unchanged-source research pass. For final acceptance supply exact-head content/integration accounting, terminal CI, 4K/1280/phone readability and full keyboard traversal/activation/Escape/focus return, along with visibly finished rendering and real-GPU/physical-phone native-select/touch evidence or the precise external hardware dependency. Final S25-V1 rendered/real-GPU sign-off remains open even though its identified S28 completing-frame subdefect is fixed. Capture moving and settled labels/routes in both generic views, and distinguish bake completion from motion completion.

ChatGPT independently audits returned changed code/research and deepens evidence where needed. Preserve Claude's code, status, lock and parallel work. Basemap, magic-system and other separate follow-on tasks add no initial-release gate. Specific-PR owner approval remains required. No application edits, formal approval, merge, deployment or release by this review.

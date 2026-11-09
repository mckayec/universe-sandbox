# Simulator item 5 implementation review — da48c23

2026-11-09, ChatGPT. **Return to fixing/claude for SC5-T1 (Medium). Item 5 is not complete.** The star-selection/controller work is supported within the tested scope, but the new normal transform is wrong for the simulator's existing tidal deformation.

Audited open PR47 `sim/clarity-physics` head **da48c23ac0c8738c3168f1be92fce51487bd9a30**, parent **920f76e80958a7753ced450b97d66d49ebc4eaca**. Read current status/receipt, [previous review](implementation-review-920f76e.md), the seven-file incremental commit diff and complete seven head files, three modified parent files, catalog/lifecycle context, rendered harness/log and close-up harness. Inventoried the cumulative PR's 26 files; prior accepted items are not represented as freshly re-audited.

## SC5-T1 — Medium: wrong normal on tidally stretched worlds

Location: [key-light-glsl.ts at audited head](https://github.com/mckayec/universe-sandbox/blob/da48c23ac0c8738c3168f1be92fce51487bd9a30/src/visuals/key-light-glsl.ts), LIT_VERTEX:

`vWN = normalize(mat3(modelMatrix) * normal);`

A position/direction matrix does not correctly transform surface normals under nonuniform scale. This is an active application path, not merely a hypothetical future object: `setTidalVisualScale()` in update-visuals.ts places bodySurface and planetAtmosphere under tidalFrame and scales its axes differently. The new shared vertex shader feeds rocky, gas and atmosphere day-side lighting from that incorrect normal.

The independent reproduction executes the **actual extracted tidalFrameFor/setTidalVisualScale and lighting controller with Three.js r180**, then compares the audited GLSL matrix expression against the inverse-transpose normal. The input normal is (1,0,1)/sqrt(2), light is (1,0,-1)/sqrt(2), spin/angle zero, body base scale 2. Results:

| Existing tidal strain | Normal angular error | Rocky day-side term from head | Correct-normal day-side term |
|---|---:|---:|---:|
| 0.5 | 13.1206° | 0.704058 | 0.055453 |
| 0.88 | 21.6272° | 0.895194 | 0 |

These are CPU matrix/shader-term results, **not measured screenshot brightness**. The uniform-scale/spin control has zero normal error. The inverse-transpose control stays perpendicular to the transformed tangent at both strains. The new repository source test currently asserts the incorrect matrix expression, so its pass does not cover this defect.

**Required fix:** supply a correct world-space normal for the full model transform, including nested nonuniform tidal scale and rotation. A proper normal matrix or a correct conversion of the existing view-space normal is suitable; preserve object-space surface patterns and scene-space light directions. Add behavioral matrix/normal regressions for uniform scale, nonuniform tidal scale, body spin, rotated tidal frame and camera orientation. Replace the test that merely pins the faulty expression. Return actual shader compilation and a focused stretched-world scene at the fixed head; no new renderer or physics change is needed.

Reference opened during this review: [Three.js Matrix3.getNormalMatrix](https://threejs.org/docs/pages/Matrix3.html#getNormalMatrix), which specifies the inverse-transpose construction. This mathematical correctness finding does not certify the physical tidal model.

## Independent checks and positive scope

- **10/10** fetched head/evidence input Git blob hashes match: seven incremental files, catalog, item-5 harness and raw log.
- **10/10** exact-head repository key-light tests independently pass under Node 24.22.1.
- [Independent runner](reviewer-lighting-da48c23.mjs): **7/9 pass, 2/9 fail**; both failures reproduce SC5-T1 at the strains above. [Raw output](reviewer-lighting-output-da48c23.json). Runner exits 1 as expected for the audited defect.
- Passing groups exercise actual controller updates across **4/4** world kinds with nested surface/atmosphere materials; moving/removing a star and fallback reset; flux ranking and second-source fill; excluded asteroid lighting; fresh visual/material replacement; actual catalog emitter-temperature mapping; uniform-scale normal control; and the two-strain inverse-transpose tangent control (grouped in the nine test outcomes).
- The model uses display-radius/temperature ratios, selects two sources and documents its fallback/omissions. This review verifies implementation behavior, not radiative transfer, physical luminosities or complete multi-star appearance.
- Spin/camera/source separation is sound at source scope for spherical/uniformly scaled surfaces. The helper's equal-flux test checks the day-side term, not every specular effect or rendered binary transition.

Reproduce with Node 24+ and the exact PR checkout:
`SIMULATOR_REVIEW_ROOT=/path/to/checkout node docs/reviews/simulator-clarity/reviewer-lighting-da48c23.mjs`
The runner imports installed `three`; `THREE_REVIEW_MODULE` can point to a Three ESM file. The reviewed execution used r180, matching the repository dependency family. It extracts the actual functions after TypeScript stripping and explicitly guards the audited shader expression; if that expression changes, adapt the characterization to the returned implementation rather than treating the guard failure as a behavioral pass.

## CI and builder evidence — kept separate

The check associated with da48c23 reports build success and deploy skipped. Independently read [job 129444714667 logs](https://github.com/mckayec/universe-sandbox/actions/runs/42700814716/job/129444714667): checkout was synthetic merge **08905918f7b9b9251aeb7655a4569615dd19a015**, not the head SHA itself. Complete nontruncated tree comparison establishes **228/228 non-doc files identical** between that merge and audited head. Logs confirm format, build, **169/169 unit tests**, **113/113 distribution files**, and **24/24 standalone page/viewport cases**. These page cases cover atlas/powers/exoplanets, not the new simulator lighting interaction. No simulator `test:browser` pass is inferred.

Independently counted the saved item-5 JSONL: **6/6 head scenarios, 28/28 true checks**, and **6/6 parent scenarios, 12/12 generic error checks**. Parent rows explicitly skip lighting assertions because the old probe lacks lighting fields; they are comparison captures, not a behavioral failing-parent control for the new light assertions. Head results remain builder-run SwiftShader evidence.

Viewed **1/9 supplied item-5 image files**, the combined gas close-up (two before/after panels). It shows the intended directional change on the illustrated gas world; it does not cover tidal distortion, motion, camera orbit, every material or a physical device. The other eight full-scene image files were not visually inspected in this bounded review. Both viewport FPS arrays in the receipt match the raw log; six one-second readings per build/viewport do not establish a general “no performance cost” conclusion.

### SC5-E1 — Low: evidence assertions and receipt precision

For the next finite return:

1. Require the lighting probe for **head** mode. Currently `if (!hasLightProbe) return` skips the main assertions for either label, allowing a head without lighting fields to exit successfully. Keep an explicit parent mode where missing new fields is expected.
2. Assert paused/running/speed probe states in item-5 scenes, and retain the earlier explicit binary phase assertions requested for item 4. Clicking or helper intent alone is not the recorded state assertion.
3. Reconcile the receipt to the committed log: lone-gas spin samples are **0 → 0.3168146928** desktop and **0 → 2.1186293856** compact, not 6.10/1.46. The final compact moving-source sample has zero worlds and is deliberately excluded; report **3/4** usable compact samples and **4/4** desktop samples.
4. Describe the camera operation as **zoom-out**, not an independently verified camera-orbit test. The key-direction probe does not by itself verify transformed GPU normals or visible terminators.

This is a bounded evidence correction, not a second product defect or a demand to repeat every earlier scenario.

## Runtime limits and handoff

Attempted independent Chromium/Playwright launch with system Chromium and SwiftShader. It failed before page creation at `process_singleton_posix.cc:297: socket() failed: Operation not permitted`; **0 independent rendered cases**. No GPU/compiler pass is claimed from the CPU tests, viewed builder screenshot or unavailable local browser. Full local app build/test suite was not rerun; the verified CI scope is stated above.

**implementation-review/chatgpt → fixing/claude.** Next unit: SC5-T1 normal correction plus focused regression/rendered return and SC5-E1 harness/receipt amendments. Keep items 6–7 queued until this return; the previously authorized separate Save/Load-smoke milestone may proceed without changing PR47 under review. Preserve SC1-E1, SC4-E1 binary/flyby/motion/device/GPU limits, the separate Save→Clear→Load issue and existing accepted timing/companion-ranking work.

No application or PR-branch file was changed by this review. No merge, deployment, full implementation acceptance or approval on Mckay's behalf.

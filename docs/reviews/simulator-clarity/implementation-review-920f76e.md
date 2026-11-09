# Slice 4b-2 independent review: source/controller acceptance, release gates retained

2026-11-09 UTC. PR47 `sim/clarity-physics`, audited head **920f76e80958a7753ced450b97d66d49ebc4eaca**, parent **6c7d08ea380c4c93deb7bc928fb45b36ab3b3413**. Review artifacts and status read from main **6a25703bac51e05163759b76358dc205103e054a**.

## Disposition

Accept this bounded delta at source/controller/helper scope. No new High/Medium implementation defect found. This is not independent rendered acceptance, physical validation, merge authorization, or release approval. Recommend returning the implementation queue to Claude for items 5–7 while preserving the remaining evidence gates below. This is a documentation-only handoff; the official status transition is recorded separately after this report is saved and read back.

## Verified state and owner

- 4b-1 was accepted at source/controller/removal-function scope in `implementation-review-6c7d08e.md`; its limits remain applicable to unchanged work.
- Claude picked up 4b-2 and supplied the implementation and receipt at 13:15 UTC. Current main status is `implementation-review`, owner `chatgpt`, blocked-on `none`. No active run lock or newer 4b-2 review was present at the read checkpoint.
- PR47 is open, draft, and unmerged. Exact-head CI [42623662937](https://github.com/mckayec/universe-sandbox/actions/runs/42623662937) completed successfully. Build, tests, distribution checks and standalone-page browser job succeeded. Upload/configure Pages and the deploy job were explicitly skipped. This is not evidence of live publication.
- Items 1–4 have implementation in PR47, with the evidence qualifications retained. Items 5 (lighting/graphics), 6 (mobile, quiet updates, Kids mode), and 7 (black-hole catalog and units) are not started per current receipt.

## Independent execution

All ten changed files inspected. Nineteen fetched fixtures verified byte-for-byte against their Git blob SHA-1; see [review input manifest](review-inputs-920f76e.json).

- 20/20 repository encounter tests pass under Node 24.22.1.
- 9/9 repository readability/helper/source tests pass. The unused `three` import is intentionally resolved to an empty module for this helper-only run; tested functions do not call Three. This does not test Three integration or render shaders.
- 14/14 additional independent tests pass in [the independent runner](reviewer-4b2-920f76e.mjs): both transfer-layer uniforms, transformed donor coordinates, zero and split timestep behavior, separate stream state, nebula/debris exclusions, far-donor recovery, missing outer radius, finite/clamped output, exact probe opt-in, detached snapshot values, survivor negative controls, settling negative controls, and raw receipt consistency.
- The controller tests execute source-extracted `applyTide`/`updateTransferDiskTide`/`transferDiskEncounterOf` with the actual model. Scene transformations use analytic fixture adapters, not real Three matrices. The prior 4b-1 Three-matrix audit is not being claimed as a new 4b-2 run.
- No full application build, full test suite, browser/server launch, independent GPU execution, or screenshot inspection was attempted here. Previous launch restrictions were not retried or bypassed. The public runner was rerun after adapting its input paths: 14/14 pass. For reproduction with Node 24+, set `SIMULATOR_REVIEW_ROOT` to a checkout of the exact PR head and `SIMULATOR_REVIEW_EVIDENCE_ROOT` to a main checkout containing the pinned evidence files, then run `node --test docs/reviews/simulator-clarity/reviewer-4b2-920f76e.mjs`. The helper-only run used an empty-module loader for the unused `three` import. `pnpm exec prettier --version` could not initialize its local store, so no fresh formatting-command pass is claimed for these documentation artifacts.

## Findings and coverage

1. Transfer disks now receive the donor-driven tide in the outer disk's local frame, and the shared mask reaches both layers. Runtime setup keeps those layers in the same plane and scale. Nebula/debris donors remain quiet. Existing black-hole own-disk handling is preserved. No forces were added.
2. The new angular-speed floor preserves the difference in angular speed between radii. All fifteen tested geometry configurations have nominal outer pattern periods at most 30 visual seconds, with the bright inner speeds increasing by at most 11%. This is a display choice, not measured physical orbital speed. The shader crossfades and reseeds its patterns every phase, so this numeric period is not proof that a persistent visible feature completes a full orbit or that the user will perceive it as moving. Keep matched motion evidence open.
3. Probe installation requires exact `?probe=1`; returned state is copied primitives/arrays, not mutable simulation objects. Survivor-ID and placement-pause assertions close the prior name-only assertion weakness at source scope. Negative controls were independently exercised.
4. The .8 truncation multiplier is now explicitly a chosen teaching factor rather than an unsupported sourced rule. Prior Roche-lobe and eccentric/flyby limitations remain. This is a heuristic visualization, not a hydrodynamic or relativistic accretion simulation.

### Low evidence limitation: binary pause and motion assertions

The binary scenario in `evidence-harness-4b2.mjs` lines 192–223 clicks 10× and Pause, but unlike the merger/protostar cases, never asserts `paused === false && speed === 10` before the encounter or `paused === true` after the click. It samples only tide strength, not positions/velocities/masses. The stated “bodies frozen,” “orbiting,” and “unequal” properties therefore rely partly on the known exhibit and successful clicks, not direct runtime assertions. This is not a demonstrated product defect.

For the next bounded evidence return, assert those two probe states, and record stable body IDs plus positions/velocities/masses if claiming fixed positions and unequal orbiting bodies. Keep the existing enforced nonzero exit and negative controls. A flyby and actual visible pattern-motion comparison are still owed; no new product UI is necessary.

## Rendered and release gates

The builder's raw `evidence-920f76e.jsonl` contains **45/45 true assertions across five scenarios**, zero reported failures, plus passing pure negative-control rules. These are builder-attributed SwiftShader results, not an independently rerun or visually inspected GPU result. Coverage includes desktop/mobile-sized mergers and protostars plus a desktop unequal-binary transfer disk. The parent run fails because the probe is absent; that is an infrastructure sensitivity check, not a behavioral parent comparison.

Carry SC4-E1 and SC1-E1 with these explicit remaining limits: independent rendered acceptance; real GPU; physical iPhone/Safari; matched paused/1×/high-speed motion; flyby/unbound behavior; ignition versus supernova visual distinction; genuine background/foreground behavior rather than only a synthetic visibility event; and the pre-existing Save→Clear→Load browser-smoke failure. Preserve any additional final device/graphics gates from the project plan. Full release needs completion/disposition of items 5–7, exact-final-head CI and release authorization.

## Suggested continuation

Record `implementation` / `claude` as the next stage and owner after this report is saved and verified. Claude then owns the remaining implementation slices and finite evidence return; the current source/controller review does not need repeating for an unchanged head. Do not duplicate 4b-2 implementation, reopen unchanged timing/companion-ranking fixes, or claim the app is live. No credible live ETA is supported by the current draft/review state.

Sources: [PR47](https://github.com/mckayec/universe-sandbox/pull/47); [pinned status](https://github.com/mckayec/universe-sandbox/blob/6a25703bac51e05163759b76358dc205103e054a/docs/reviews/simulator-clarity/status.md); [head controller](https://github.com/mckayec/universe-sandbox/blob/920f76e80958a7753ced450b97d66d49ebc4eaca/src/visuals/disk-encounters.ts); [pinned harness](https://github.com/mckayec/universe-sandbox/blob/6a25703bac51e05163759b76358dc205103e054a/docs/reviews/simulator-clarity/evidence-harness-4b2.mjs).

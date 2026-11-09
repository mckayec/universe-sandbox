# Slice 4b-1 implementation review — accepted with evidence qualifications

2026-11-09 UTC, ChatGPT. PR47 `sim/clarity-physics`, exact audited head **6c7d08ea380c4c93deb7bc928fb45b36ab3b3413**, parent **ff480a5a388feb1e46549b358f633ec55c733d77**.

**Accept this bounded slice at source/controller/removal-function scope; return implementation / claude for 4b-2.** No new High/Medium implementation finding in this delta. This is not complete item-4 acceptance, rendered acceptance, physical-model validation or release approval.

## Scope and independent results

Read the PR's 19-file cumulative diff and the complete 9-file incremental delta (+93/−24), the changed files at the exact head, prior reviews, current receipt, enforced harness and all 3/3 raw scenario records. Prior unchanged closures retain their original evidence scope. Fetched verification inputs were checked against Git blob hashes: **17/17** matched, including the three parent inputs.

Executed `node --test tests/disk-encounter.test.ts` with Node 24.22.1: **20/20 pass**. Four new repository tests are source-pattern guards; they do not execute a protostar renderer or a real collision.

The additional [independent runner](reviewer-4b1-6c7d08e.mjs) executes the source-extracted actual encounter-controller module against **Three.js 0.180.0** objects, matrices and material uniforms. It imports the real model. Separately, it executes the actual `removeBody` function with collection/selection fixtures and unrelated effects stubbed. The identical runner works on head and parent without relying on new exports.

| Behavior group | Cases | Head 6c7d08e | Parent ff480a5 |
|---|---:|---:|---:|
| Protostar isolated/close, transformed local frame, growth, removal reset, companion exclusions | 6 | 6/6 | 0/6 |
| Existing black-hole response control | 1 | 1/1 | 1/1 |
| Selected swallowed body hands off to live successor | 1 | 1/1 | 0/1 |
| Survivor/third-body selection preserved; absent or removed successor clears selection | 4 | 4/4 | 4/4 |
| **Total** | **12** | **12/12, exit 0** | **5/12, exit 1** |

The six parent protostar failures reflect missing controller support (no encounter state), rather than missing-module/import failures. The seventh failure returns null selection instead of the live successor. These are sensitivity controls for the new behavior, not claims that the parent promised protostar support.

The transformed-frame fixture uses translated/scaled host geometry, tilted and scaled disk geometry, and real world/local matrix conversion. At a fixed world separation, increasing the disk scale from .06 to 1 changes the result from quiet to active. This supports the growth/local-frame wiring; it does not verify a rendered nebula-to-protostar sequence, shader compilation, visual continuity or an entire collision simulation.

## Findings and disposition

| ID / area | Disposition | Evidence and remaining action |
|---|---|---|
| Protostar controller/shader wiring | Accepted at source/controller scope | `protoDisk` receives tide uniforms; the runtime loop includes protostars after formation scaling; inspector exposes its Disk row. Actual controller probes exercise scale/tilt and reset. New GLSL remains uncompiled here and in the builder's stated protostar evidence. |
| Stale post-merger selection | Accepted at removal-function scope | `consume` passes `a` and fragment collision passes `remnant` to `removeBody`; the selected removed body transfers to a non-removed successor. The history reset wraps `forEach`, preventing its array index from becoming the optional successor. Full consume/fragment/rendered execution was not independently performed. |
| SC4-T1 | Prior closure retained | Ranking implementation unchanged apart from model comments/wording; existing focused tests still pass. |
| SC4-O1 | Model-limit clarification accepted | Header separates the Roche-lobe fit from arbitrary constants, instantaneous-separation use, morphology and simulator units; inspector now says “heuristic estimate.” The assertion that .8 is a *common* rule of thumb remains unverified here; do not promote it to a quantitative physical validation. A final explanation should call it a chosen teaching factor or provide specific supporting evidence. |
| SC4-E1 | Partially addressed; final evidence gate stays open | Harness now records assertions, counts failures and exits nonzero; the suppressed 10× action failure is gone. Raw builder evidence reports 33/33 checks across 3 scenarios plus the separation comparison. This closes the logging-only design defect at source scope, not independent rendered acceptance. Strengthen survivor identity as described below and add the owed protostar/4b-2 scenarios. |
| SC1-E1 | Unchanged/open | Existing shader/ignition, real background/foreground, pause/high-speed motion and device evidence limitations remain. |

### Remaining harness precision

In `evidence-harness-4b.mjs`, the survivor check accepts **either original name**:
`!after.panelEmpty && [first.name, second.name].includes(after.name)`.
Together with a count of one and “Undisturbed,” this could still accept stale selection of the swallowed body if a future bug kept the panel shown and reset its text. The current raw output consistently names Void 01, and the independent removal-function probe supports the fix; this is a **Low evidence limitation**, not a demonstrated new selection bug.

In the next finite evidence return, assert selected identity equals the **actual remaining body's ID**, and that the swallowed ID is absent. A test-only in-memory probe is sufficient; this need not add diagnostic UI. Preserve enforced exit failure and add a negative control that leaves the swallowed selection/panel visible. Also assert intended paused state before placement; fixed waits alone are not a pause assertion. The three present scenes start at rest and do not cover orbiting/flyby qualification.

## Sources opened this run

- [Eggleton (1983), equation 2 and Table 1](https://articles.adsabs.harvard.edu/pdf/1983ApJ...268..368E): the Roche-lobe-radius fit and equal-mass value support the formula, not the disk factor or visual response constants. (C: source opened.)
- [Sepinsky, Willems & Kalogera (2007), research abstract](https://arxiv.org/abs/astro-ph/0612508): substituting instantaneous separation into the circular fit does not generally give a good approximation for eccentric/asynchronous systems. The opened abstract supports the limitation; this is not a full-paper or hydrodynamic audit. (C: abstract opened.)

These two sources support the narrowed wording. No separate Deep Research product was used. The .8 multiplier and visual constants remain teaching choices, not newly verified physical predictions.

## Runtime and attribution limits

Independent browser preflight was attempted with installed Chromium 156.0.8078.79 and Playwright. Chromium terminated before creating a page: `process_singleton_posix.cc:297 ... socket() failed: Operation not permitted (1)`. **0 independent rendered scenarios completed; 0/3 saved screenshots visually inspected.** This is the observed executor launch restriction, not proof of a site failure. No renderer workaround, full production build or full browser harness was run.

Builder-reported 150/150 full-suite tests, 113 distribution files, 24/24 page/viewport cases, 33/33 harness checks and four parent browser failures remain **builder-attributed**. The parent's third browser scenario timed out per the receipt and is not a completed negative control. Real GPU, physical iPhone/Safari, protostar shader/rendered formation, matched motion clips, orbit/flyby cases and Save→Clear→Load smoke remain unverified in this review.

Reviewed head blobs: controller `9bf27619e880392b7275c2c257870737c3be10b0`; lifecycle `e82147093a71193c472d0ccbad016a6893cde76e`; model `928ae6dbbc87ef4f8223903c54e0a739bcad6b07`; material `008b738e1c7b6c027b06d6bcee22d13d12c8955e`; focused tests `1fba6b9bb7f78f4f82c469dc62ecd8b724531251`. Main harness blob `63b117b54a5bbc7e13f733e17e173da9c93d533d`; raw evidence blob `fcecd4cb4d3e14d2fd795a58ee8a5df6c37fb834`.

## Precise continuation

Claude owns **4b-2**: transfer-disk response, readability periods, and bounded orbit/flyby/equal-and-unequal-mass/merger evidence. Include a rendered protostar scenario (fixture injection is acceptable when UI placement is unavailable), enforced surviving-ID and pause assertions, exact head and passed/failed/not-run counts. Carry SC4-E1/SC1-E1 until their remaining evidence is supplied or explicitly dispositioned. Items 5–7 remain unfinished. No repeat of unchanged SC4-T1 or these source/controller checks is requested.

Run routing: **18/18 pack statuses and 8/8 review statuses** inspected on main. One owned handoff processed; all three research-ready folders unchanged since the preceding completed run, so no stale parallel self-audit. D09 unchanged. No application/PR-branch edits, merge, deployment or approval on Mckay's behalf.

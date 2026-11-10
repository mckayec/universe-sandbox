# Black-hole catalog and pointer bounds review — 07464c3

ChatGPT, 2026-11-10 UTC. PR #47, `sim/clarity-physics`, exact audited head **07464c3c379aa0632fcc8526a39983a391c20e2a**; parent **20837c0211575d03ed0ad3ff3c34fcb98adeb653**.

**SC6-O2 closes. Item 7a needs two presentation corrections (1 Medium, 1 Low); return to Claude.** The reference calculations and honest model-unit mass labels pass the bounded checks below. This does not accept unfinished item 7b, final technical validation, or release.

## Scope and findings

Read **11/11 incremental patches** and their exact-head files, the prior implementation review, the item-7a return, the complete committed rendered harness and raw log, and **3/3 supplied screenshots**. The active signed agreement is unchanged.

| ID | Severity | Exact-head location | Finding / evidence | Required correction | Resolution |
|---|---|---|---|---|---|
| SC7-C1 | Medium | `src/black-hole-catalog.ts:165–185`; `src/ui/black-hole-scales.ts:5–15` | The data holds six source URLs, uncertainty/status strings and context, but `presetRows()` reduces each chosen example to name and rounded mass. The visible reference block contains **0/5 status labels and 0/5 source links** for its five displayed examples. The approximately sign communicates rounding, but GW190521 is displayed without its original quasi-circular model inference / credible interval; Gaia BH3's dormant context also disappears. The handoff explicitly requires cited reference masses with uncertainty/status labels. Data-only presence does not satisfy the visitor-facing claim. | Carry a compact qualification and accessible source link into each displayed example, with expanded detail if needed. For GW190521 preserve the original 2020 quasi-circular inference, source-frame median and 90% +28/−16 M☉ qualification; do not imply a universal exact current measurement. Keep Gaia BH3 dormant/no bright disk context distinguishable from the generic illustrative disk. Other examples may use concise rounded/estimated wording. No need to show all six examples in the five-row overview or turn it into an exhaustive astronomy catalog. | Open |
| SC7-C2 | Low | `src/ui/black-hole-scales.ts:9`; `src/black-hole-catalog.ts:190–192` | The lengths are **radii**, but both rows and caveat omit that word. The first row reads “horizon 15 km · shadow 38 km”; actual helper outputs are 14.76625038 km and 38.36384384 km radii. The surrounding canvas/menu uses diameter Ø, making the quantity distinction especially useful. The formula is correct; the ambiguity is in presentation. | Say “horizon radius” and “apparent shadow radius”, or use an equally clear shared radii heading. Retain the nonspinning/far-observer model and separation from measured image diameters, gas extent, and display/picking size. | Open |

Acceptance return: verify that qualifications and source links survive the actual row-to-markup path; test keyboard access to links/details, compact collapsed/expanded behavior, non-black-hole hiding, and overflow after the added text at the existing three viewports. Return actual failures/not-run items separately. Keep controls and the source explanation reachable when the panel scrolls. These are finite corrections to the current slice, not a demand to complete the physical solver or every later stage.

The supplied desktop and short-landscape captures corroborate the already-disclosed performance badge overlap with the final caveat lines. Do not count “panel within viewport width” as evidence that all text is unobscured. Carry that known low layout limitation into the updated captures; no new blocker beyond the two findings is asserted here.

## Independent execution

[Reviewer output, generated markup and exact input manifest](reviewer-catalog-output-07464c3.json).

- **25/25** local source/test input Git blob hashes match the exact-head tree. No local application source changes were used in the counted runs.
- **30/30** focused repository tests pass: 8 catalog, 11 cancellation/authorization, 5 Kids mode, 6 overlay-budget. Command: `node --test tests/black-hole-catalog.test.ts tests/kids-cancel.test.ts tests/kids-mode.test.ts tests/overlay-budget.test.ts`.
- **18/18** actual-handler expectations pass using the existing [builder runner](builder-kids-k3.mjs) with one reviewer adapter change: the dialog-case VM context gains `document: { querySelector: () => ({ hidden: false }) }` for the newly added open-dialog check. The code under review is still extracted from the exact-head source. These are DOM-adapted handler checks, not browser execution.
- SC6-O2's tests exercise 1,000 unrecorded releases (zero retained entries), 1,000 recorded releases and 1,000 held pointers (each map capped at 16), newest-pointer authorization, reset, keyboard activation, and suppression outside an open Kids dialog. The 18 handler cases retain the prior mixed-pointer and held-placement protections. **SC6-O2 closed at source/helper/handler scope; SC6-K1/K2/K3 remain closed.**
- Independently called `blackHoleScalesHtml()` and compared its output to `nearestExample()` records: the missing status/source fields and absence of radius/radii wording reproduce without a DOM. The generated HTML is retained in the evidence JSON.
- Initial test invocation used the wrong working directory (two relative-path file-read failures); rerunning from the snapshot root passes. The old handler runner initially lacked the document adapter and failed before its dialog cases; only the corrected 18/18 execution is counted.

## Science verification

This run used source-based web retrieval, not the separate Deep Research product. Opened **6/6 catalog citations** and checked their stated rounded masses. This is verification of those sourced reference values and qualifications, not a new measurement or a survey of every competing astrophysical estimate.

| Example | Opened source and bounded result |
|---|---|
| Cygnus X-1 | [NASA IXPE article](https://www.nasa.gov/universe/nasas-ixpe-reveals-shape-orientation-of-hot-matter-around-black-hole/) supports about 21 solar masses and the accreting binary context. |
| Gaia BH3 | [ESA figure](https://www.esa.int/ESA_Multimedia/Images/2024/04/Gaia_black_holes) supports about 33 solar masses. Also opened [ESA discovery article](https://www.esa.int/articles/about-us/directorates/science/gaia/sleeping-giant-surprises-gaia-scientists), which explicitly identifies its dormant state. |
| GW190521 remnant | [LIGO/Virgo 2020 paper](https://dcc.ligo.org/public/0165/P2000021/012/gw190521-implications-main_20200901.pdf), abstract, §2 and Table 1: 142 +28/−16 M☉, median/90% interval under the original quasi-circular coalescence interpretation; other waveform estimates appear in the table. Preserve that model qualification. |
| HLX-1 | [NASA Hubble article](https://science.nasa.gov/missions/hubble/nasas-hubble-spots-a-relic-from-a-shredded-galaxy/) supports an estimated approximately 20,000 solar masses. Its catalog candidate/uncertain wording is appropriately cautious. |
| Sagittarius A* | [NASA types page](https://science.nasa.gov/universe/black-holes/types/) supports the rounded 4 million solar-mass reference. Retrieval returned a cached page dated 2026-11-09T23:36:45Z, not a fresh measurement. |
| M87* | [NASA/JPL teaching article](https://www.jpl.nasa.gov/edu/resources/teachable-moment/how-scientists-captured-the-first-image-of-a-black-hole/) supports 6.5 billion solar masses and active accretion/jet context. |

Opened [IAU Resolution B3](https://www.iau.org/common/Uploaded%20files/IAUGA2015-Resolution-B3-recommended-nominal-conversion.pdf): the code's nominal GM☉ = 1.3271244 × 10²⁰ m³/s² matches the conversion constant, which is not an exact measured solar mass. With the stated c, the resulting horizon radius is approximately 2.953250076 km per solar mass.

Opened [Kocherlakota et al., arXiv:2403.08862v2](https://arxiv.org/html/2403.08862v2): Schwarzschild horizon 2M, photon sphere 3M, distant shadow radius √27 M, and ISCO 6M support the code's respective ratios 1, 1.5, √27/2, 3 relative to the horizon. The paper also distinguishes accretion-image morphology from the shadow. [Narayan et al., arXiv:1910.02957](https://arxiv.org/abs/1910.02957) independently states the distant shadow radius √27 GM/c² for its spherical optically thin model. The catalog's `outerDiskKm: null` correctly avoids inferring an outer disk extent from mass alone.

The OUP version returned article navigation only; a Southampton repository fetch failed. Neither was treated as opened supporting text; the accessible author paper above supplies the formula evidence. No inaccessible evidence is certified.

Five preset masses produce three approximate classes, as intended. The pure size helper scales linearly; this **does not** implement linear physical-horizon growth for simulated bodies. Solver constants/contact/velocity behavior remain unchanged in this delta. A catalog import through the formatting helper is not a transfer of reference masses into the solver.

## CI and rendered evidence

Independently inspected [CI run 42812892748](https://github.com/mckayec/universe-sandbox/actions/runs/42812892748), job **129818521854**, including logs: formatting/build succeed, **214/214 units**, **113/113 distribution files**, **24/24 standalone-page cases** pass; deploy skipped. CI checked synthetic merge **57edda2caba1b8d9e8365cfba16b0c0c4350c5be**; **241/241 non-doc files match** the audited PR head, with zero extra non-doc files in the merge tree.

The committed [7a harness](evidence-harness-7a.mjs) and [raw log](evidence-7a-07464c3.jsonl) contain **40/40 builder-enforced checks** at 1440×900, 390×844, 844×390, with no recorded page/console errors. They cover UI placement, model-unit inspector/canvas text, reference disclosure, five rows, width containment, and hiding on rocky selection. They do not inspect example uncertainty/source links or radius wording; passing them therefore does not close SC7-C1/C2. Screenshots at all three sizes were independently viewed, but remain builder-produced Chromium/SwiftShader evidence.

Fresh independent browser launch attempts failed before any page: bundled executable missing; installed Chromium aborts at `process_singleton_posix.cc:297`, `socket() failed: Operation not permitted`. **0 independent rendered cases.** Full Save→Clear→Load, physical Safari/iPhone, real GPU and screen-reader acceptance remain unverified here.

## Continuation

Set **fixing / claude** for SC7-C1/C2; preserve accepted pointer/model-unit/calculation work. After the finite presentation correction, continue 7b with a documented scene-wide unit mapping, per-body reference scale, persistence/history/merger treatment and physical-horizon scaling separate from visual/picking/contact sizes. Do not silently relabel legacy masses or apply cube-root display growth to a physical horizon. Other-body legacy Earth-mass labels remain a disclosed follow-up, not newly accepted realism.

Existing SC1-E1/SC4-E1, Save/Load, device/accessibility and release limits remain. No Mckay action is needed for these two code corrections.

Inspected **18/18 pack statuses and 8/8 review statuses** on main. Hierarchy, Narnia and Licanius folders remain byte-identical to prior completed-run main **89bdc890e7baeb056a097cce7815ed5848c9516c**; no stale parallel self-audit or new research slot was found. Other owners and their histories were left unchanged. No site code or PR branch was edited, and no merge, deployment, final canon certification or release approval was performed.

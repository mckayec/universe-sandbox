# SC7-C1 / SC7-C2 correction review — 660cfaf

Reviewer: ChatGPT, 2026-11-10 UTC. **Accept the bounded item-7a correction; close SC7-C1 and SC7-C2 (2/2). Return to Claude for item 7b.** This is not acceptance of the whole simulator handoff or release approval.

## Audited revision and scope

PR [#47](https://github.com/mckayec/universe-sandbox/pull/47), exact head **660cfaf36d838d35dc2aae0f0ed99bb16907b324**, parent **07464c3c379aa0632fcc8526a39983a391c20e2a**. Fresh PR metadata confirms that head remains current and open. Inspected all **4/4** incremental patches and their complete exact-head files: black-hole catalog, generated reference markup, stylesheet, catalog tests. Solver, inspector selection logic and pointer code are unchanged.

Read [previous findings](implementation-review-07464c3.md), [Claude's correction receipt](sc7-c-return-660cfaf.md), the committed [7a2 harness](evidence-harness-7a2.mjs), and its [raw output](evidence-7a2-660cfaf.jsonl). Independent execution and the input blob manifest are in [reviewer-catalog-output-660cfaf.json](reviewer-catalog-output-660cfaf.json). All **25/25** locally present source/test inputs match exact-head Git blob hashes.

## Dispositions

| Finding | Evidence and disposition |
| --- | --- |
| SC7-C1 — displayed provenance and qualification | Closed. Actual generated markup now carries the catalog URL and qualification for **5/5** displayed examples; the previous markup retained these fields for **0/5**. GW190521 explicitly says original 2020 quasi-circular interpretation, source-frame median, 90% range +28/−16 solar masses. Gaia BH3 is explicitly dormant with no bright disk, distinguished from the illustration. Other examples identify rounding/context. Linked names have target/rel/accessible new-tab labels, and the stylesheet adds underlining and focus outlines. |
| SC7-C2 — radius semantics | Closed. **5/5** generated rows say horizon radius and shadow radius. The caveat specifies nonspinning radii rather than diameters, distant-observer apparent shadow, and separates these from measured image, gas and on-screen sizes. Toy-gravity/model-unit and disk-size caveats remain. |

No new blocking defect found in this four-file correction. Scientific masses, source URLs and formulas are unchanged from the prior source-based review, which opened six mass references and formula references. That source verification is inherited, not represented as a fresh web-research run. The new wording implements that review's distinctions; no separate Deep Research product was used.

## Independent checks and evidence limits

- Ran **9/9** focused repository tests successfully with Node 24.22.1. Independently executed the real markup function: **5/5** rows retain their source URL, qualification and radius labels; the saved parent markup has **0/5** for each field. The JSON records both outputs and hashes. This is source execution, not rendered-browser execution.
- Read CI [run 42819224457](https://github.com/mckayec/universe-sandbox/actions/runs/42819224457), build job **129840122266**, and its logs: formatting/build succeeded, **215/215** unit tests, **113/113** distribution files, **24/24** page/viewport checks (12 pages × 2). CI checked merge **358b8faf54bf39dd0278757b712a2217133e259b**; independently compared recursive trees and found **241/241** files outside docs identical to the audited head. Deploy was skipped. CI is independently retrieved evidence, not a reviewer-local full build.
- Independently counted builder evidence: desktop **24/24**, portrait **25/25**, landscape **24/24**, total **73/73** enforced checks. The harness covers opening/hiding, model-unit labels, row contents, horizontal overflow, Enter on the summary, and Tab to the first source link. These remain **Claude-run Chromium/SwiftShader checks**, not reviewer browser runs.
- Viewed **3/3** supplied screenshots: [desktop](shots/sc7a2-1440x900.png), [portrait](shots/sc7a2-390x844.png), [landscape](shots/sc7a2-844x390.png). Desktop shows all five qualifications and the first link focus ring. Portrait and landscape are scrolled views; they corroborate access to the caveat, not simultaneous visibility of all rows. The disclosed performance-badge/lock-control proximity is not claimed fixed.
- Harness precision: the check named “visible qualifications” tests text length rather than computed visibility; keyboard coverage reaches the first link, not every link or external activation. The caveat assertion checks its top; raw coordinates also put its bottom inside the panel for **3/3** captures. Screenshots and source corroborate this bounded correction, not full accessibility certification.
- Fresh reviewer browser launch attempts failed before page creation: bundled Chromium executable missing; installed Chromium aborts at process-singleton socket creation with “Operation not permitted”. **0 independent rendered cases**. Physical Safari/iPhone, real GPU, screen-reader and external-link activation were not independently tested.

## Continuation

Return stage to **implementation / owner claude** for bounded **7b**: scene-wide unit mapping, per-body reference scale, persistence/history/merger treatment, and physical-horizon scale distinct from visual/picking/contact size. Legacy Earth-mass labels on other bodies remain the disclosed follow-up. Preserve prior SC6-O2 closure and SC1-E1/SC4-E1, Save→Clear→Load, device/GPU/accessibility and release evidence limitations. Do not treat 7a acceptance as closing those gates.

Inspected **18/18 pack statuses and 8/8 review statuses** on current main. This was the only owned review; the three parallel research-audit folders were unchanged, with no stale self-audit requiring work. No new research slot was opened. Agreement/sign-offs, other owners' histories and application/PR branches remain untouched. No merge, deployment or approval on Mckay's behalf.

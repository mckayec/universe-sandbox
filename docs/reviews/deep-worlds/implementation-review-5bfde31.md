# Independent DWT-03 implementation review — 5bfde31

2026-11-08 UTC, ChatGPT. PR37 `atlas/deep-worlds`, exact head **5bfde313d819ab89e273af4b9c6a5f788d6d6f3d**, parent **311e9fefa4bad16dff40e909d57f0b450532b216**. PR remains open and unmerged.

**The reported DWT-03 stale-site timer defect closes at the source/VM scope, with the builder's bounded rendered qualification accepted as builder evidence.** The three converted timer paths preserve a newer pending or committed place entry. One Low, latent tree-navigation regression is recorded below for integration disposition; it is not a reproduced defect in the seven packs shipped on this head. This is not full technical, canon or release approval.

## Scope and evidence identity

Read the prior [311e9fe review](implementation-review-311e9fe.md), [fix return](fix-return-5bfde31.md), [rendered diagnosis and checkpoint history](rendered-diagnosis-311e9fe.md), complete relevant probes and their committed logs. Inspected the actual GitHub commit diff: **1/1 changed application files**, `public/atlas/engine.js` +7/-3; **3/3 delayed selection call sites**. No pack/content changes. Exact engine blobs independently verified locally: head `e4ae0168bc96e651866031588be0c319a9276406`, parent `124a805fe85f29335c32b01bacbbc3f548196886`.

The new helper captures `placeGen` and the destination world. A later entry or selection invalidates the stale callback; a changed world also prevents it from selecting a site on the wrong world. Actual call sites are `goPlace` (1000 ms), the no-current-planet branch of `doLeavePlace` (900 ms), and cross-world `openEvent` (900 ms). Existing entry/history/rollback logic and startup restoration are unchanged.

## Independently executed source checks

[Reproducible reviewer probe](reviewer-dwt03-5bfde31.cjs): Node VM using actual `goPlace`, `descend`, `openEvent`, `selectSite`, transition, entry, cancellation and history slices. It extends the inspected DWT-02 fixture with the actual descent and event functions. Chronological fake timers; renderer, camera and DOM mocked. The no-current-planet leave fixture explicitly sets PL absent while calling leave. All fixture worlds/sites are visible; this is not book-gate, pixel, real-history or performance validation.

| New check group | Head | Parent |
| --- | --- | --- |
| Uninterrupted delayed selection, one per converted route | 3/3 | 3/3 |
| New entry committed before the old timer, one per route | 3/3 | 0/3 |
| New entry still pending when the old timer fires, one per route | 3/3 | 0/3 |
| Two tree requests during descent, gaps 0/150/429 ms | 0/3 | 3/3 |
| Two tree requests at 430/1000 ms boundary controls | 2/2 | 1/2 |
| A/B/A tree requests before descent settles | 0/1 | 1/1 |
| **Total** | **11/15** | **8/15** |

Thus **6/6 sensitive stale-entry checks improve**, while **4/4 pre-descent tree ordering cases regress**. Do not describe this as 15/15 or treat the probe's expected nonzero exit as a harness failure. The parent also fails the 430 ms tree case because its old callback overwrites the newer immediate selection; the fix correctly handles that boundary.

Unmodified retained probes were run on exact head and parent after confirming all four probe blob identities:

| Retained check | Head | Parent |
| --- | --- | --- |
| DWT-02 builder repeated-request/control | 7/7 | 7/7 |
| DWT-01c cancellation extension | 26/26 | 26/26 |
| F1 immediate cleanup | 8/8 | 8/8 |
| Independent DWT-02 timing/payload/rollback | 12/12 | 12/12 |

These preserve their prior narrow source/VM closures. F1 presentation callbacks and the cancellation fixture's visibility predicates remain mocks.

## DWT-03-R1 — Low, latent tree last-request regression

At [engine.js lines 1317–1322](https://github.com/mckayec/universe-sandbox/blob/5bfde313d819ab89e273af4b9c6a5f788d6d6f3d/public/atlas/engine.js#L1317), a `goPlace(a,a1)` request from galaxy view begins an asynchronous descent without incrementing `placeGen`. A second `goPlace(a,a2)` before the 430 ms descent callback captures the same generation. At 1000 ms the older selection runs and increments the generation; the newer callback is then discarded. The final state/URL names a1 instead of a2. Parent ends on a2 in the 0/150/429 ms and A/B/A cases. The general comment that all newer navigation supersedes the timer is consequently too broad.

Exposure was checked before escalating severity: `goPlace` is wired to the optional tree view's onShow callback; the tree closes before dispatching it, and reopening/choosing again would be needed in the UI. The fade overlay does not block pointer events. However, **7/7 registered concrete pack objects evaluated from this exact PR head have no tree** (Cosmere, Dune, Expanse, Foundation, Hyperion, Sun Eater, Christian Apocrypha). The tree view is therefore not created for those packs. No real-pointer tree reproduction is claimed, and this does not reopen the accepted current-pack DWT-02/DWO-E2 qualification.

**Disposition to Claude:** retain this as a Low integration follow-up before combining/enabling a tree-bearing pack on this engine. Either give successive tree requests distinct ownership while preserving the six stale-entry guards, or explicitly defer it with that integration trigger. Do not remove the generation guard or require a new broad canon/research cycle. A focused return should cover latest-request ordering, uninterrupted selection and newer place-entry protection, then a real tree UI case when an actual tree-bearing integration is available. The reviewer has not edited application code.

## Rendered evidence inspected, not independently rerun

- [DWT-03 trace harness](dwt03-trace-repro.cjs) and four trace logs: parent gap150 ends inconsistent; head gaps **0/150/400: 3/3 completed runs**, each records matching fane/c6 place/state/URL at +5/+20/+40/+60 seconds, with no page errors. The harness's final boolean only checks site/render agreement, non-null event and fade; it does not itself assert the exact expected fane/c6/URL or page-error count. Those values were checked in the committed log lines, not inferred from the word PASS. The parent trace links the late selectSite/history write to cancellation; the builder's earlier rollback-baseline hypothesis is superseded.
- [v2.1 repeat/Stop harness](dwt02-rendered-probe-v2.cjs): **19/19 assertions in each of four head logs**, Cosmere b10 and Dune b3 at 1440×900 and 390×844 (**76/76 total reported assertions**). Inspected trusted-click records show the repeated/Stop clicks while the old place was still rendered, one later build for successful arrival, no build after Stop, matching URL/history checks and successful retry. Some gaps exceed 430 ms under SwiftShader; qualification rests on recorded pre-commit state, not a wall-clock assumption. Parent rendered qualification remains partial; no completed four-pair parent suite is claimed.
- [DWO-E2 matrix harness](dwo-e2-browser-check.cjs) and [head output](dwo-e2-browser-output-5bfde31.txt): **90/90 reported assertions**, 45 per viewport. These concern the specified Dune omissions/residency and Cosmere e70/e102 paths. Several actions use programmatic DOM clicks and setBook, so they are not pointer/device acceptance. The below-gate direct-link predicate checks absence of event copy even if place arrival times out; it does not certify that arrival. The matrix is not full spoiler or visual coverage.
- `test:browser` first-failure/rerun-pass remains **builder-reported** in the return. Its Save/Load flake is not independently resolved here.

Fresh local Playwright/Chromium launch at **21:13:16 UTC** failed before page creation: `process_singleton_posix.cc:297: socket() failed: Operation not permitted (1)`. **0 independent rendered cases.** No renderer/pixel result is manufactured from source tests.

## CI independently verified

[Workflow run 42509377038](https://github.com/mckayec/universe-sandbox/actions/runs/42509377038), [build job 128818895165](https://github.com/mckayec/universe-sandbox/actions/runs/42509377038/job/128818895165): decoded logs verify formatting, production build, **125/125 unit tests**, **175-file** distribution check, and **12 pages × 2 viewports**. Deploy skipped. Workflow and package scripts were read at the audited head; CI does not run `test:browser` or these directed DWT probes.

CI checked out synthetic merge **97a0a214692559ac9b193f38c09c33df697edaad** (head into base `004240b1eefeb4d2ee7e901479b26ee804f0df60`). Complete untruncated recursive-tree comparisons establish **281/281 non-doc files identical** to the audited head, with no extras. This is inspected CI evidence, not a local full-build claim.

## Handoff and remaining gates

Return to **fixing / claude** for one finite technical disposition packet: acknowledge/defer DWT-03-R1 with its tree-integration trigger, consolidate the accepted current-head navigation evidence and identify the still-required Society/visual/device/Save-Load checks versus explicit Known gaps. Do not repeat the completed DWT-02 qualification merely because this review could not launch Chromium. Fix R1 before a tree-bearing integration, or return that focused implementation if chosen now.

All prior content decisions carry unchanged: **18 narrowed leaves, three scoped retains, three Dune omissions, eight source holds and 139 unselected records**. This run adds **0 new canon/source approvals**. Broad Society, geometry, full canon/technical and Mckay release gates remain open. No ready-for-owner transition, PR approval, application edit, merge or deployment.

Run inventory: read **18/18 pack statuses and 7/7 review statuses** on current main. Deep Worlds was the only owned actionable review; the three research-ready/Claude audit input sets were unchanged. Agreement and decision log remain unchanged.

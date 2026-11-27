# Deep Worlds return review — 03394c3

2026-11-09, ChatGPT. PR [#37](https://github.com/mckayec/universe-sandbox/pull/37), branch `atlas/deep-worlds`.

**DWO-S1 accepted at source/VM scope. Report reconciliation accepted. Final evidence packet partially complete; Canon: not approved.** Two of the three continuation units in [implementation-review-68d47ce.md](implementation-review-68d47ce.md) are closed; the final visual/validation unit remains partial. No new application defect was established in this delta.

## Revision and independently inspected inputs

- Exact head: `03394c32816fcb5c95261bf6a9ea4520381a5838`.
- Parent: `68d47cebf40b37c345a37cb8b0080590c52a0339`.
- Engine head blob: `4a162090ae65154e66248daaeb1fa882008c7b85`; parent: `e4ae0168bc96e651866031588be0c319a9276406`.
- Hyperion pack: `20587c62f3fc5ddbd24cc4f3cefe527ab198d191`.
- Society: `c002eae9f01eacf8655e20a368217743d5d8f5f9`, unchanged from the prior accepted disposition implementation.
- Branch implementation report: `358a2b630fc3ad85f376e630d05d0526f15bbdb4`.
- Main return: [fix-return-03394c3.md](fix-return-03394c3.md), `d444f2d3abcf9eaabff35f596a18a26f86085339`; checkpoint: `c934c702c9036f136d1d6180591dc645649dcd74`.

Read GitHub's actual commit diff, complete head/parent engine files, the branch report, actual Hyperion pack, relevant callers/predicates and supplied scripts/logs. **2/2 changed files inspected; 1/1 changed application files.** Reconstructed the entire engine from the parent and actual patch: exact byte match, **+5/-2**, with both input Git blob hashes checked locally. No pack or Society application content changes in this commit. Earlier closures carry at their stated scope; this does not repeat or expand their acceptance.

## DWO-S1 disposition and independent checks

| Location at head | Decision | Evidence / boundary |
|---|---|---|
| engine.js 948–949, `hideUnseen` | Accepted | A missing site now follows the existing hidden-site path: clear site/landmark and reduce place to world. The actual URL serializer and temporary presentation wrapper inherit that guard. |
| engine.js 1392–1394, `selectSite` | Accepted | An unknown ID is nulled when the selected world exists; valid IDs and the synthetic `__surface` remain supported. Generation invalidation remains in place. Calls with no selected world retain their previous behavior. This is not a general state-schema sanitizer. |
| Branch report §3 | Accepted | Explicitly supersedes Tyche IV with V, records six Book V tour steps, and corrects the old phone log to 22 PASS + 3 FAIL = 25. A dated reconciliation is also appended to main's historical `implementation.md`; its older counts are not current certification. |

[Independent probe](reviewer-dwo-s1-03394c3.cjs) and [output](reviewer-dwo-s1-output-03394c3.txt): **head 23/23 PASS; parent 13/23 PASS, 10/23 expected FAIL**. The negative control demonstrates sensitivity to this defect.

The probe executes selected actual engine functions in a Node VM and loads the actual Hyperion data. It checks missing-site surface/place state and URLs; valid Tombs and unnamed-surface controls; hidden-site/world book boundaries; All and noncumulative modes; temporary presentation/restoration; direct and delayed selection; generation/world-switch cancellation. Two small synthetic gate fixtures test unchanged book boundaries. Render callbacks, timer scheduling and history/location are adapters; geometry, renderer, native Back/Forward, real clicks and full startup are not executed. These are independent source/runtime-function checks, not independent browser acceptance.

Browser launch was attempted again. Bundled Playwright Chromium headless shell 1234 is absent; system `/usr/bin/chromium` fails before page creation at `process_singleton_posix.cc` with `socket() failed: Operation not permitted (1)`. **0 independent rendered cases.** This does not reopen already accepted unrelated navigation tests.

## Builder evidence reconciliation

Independently counted the committed PASS/FAIL lines and inspected the scripts. Execution remains builder-attributed.

| Artifact | Actual counts | Qualification |
|---|---|---|
| DWO-S1 desktop partial log | Desktop 13/13; then phone 4 PASS before stop | 17 PASS in the file, not 17 desktop checks; no completed two-viewport run inferred. |
| DWO-S1 phone return | 13/13 | Together the completed legs cover 26/26 reported assertions. Parent desktop is 7 PASS + 6 FAIL = 13; parent phone not run. Valid place-link entry is not a control here: the last control URL uses `view=surface`, despite the script comment. |
| Main Society desktop partial log | Desktop 24 PASS + 1 FAIL = 25; then phone 6 PASS before harness termination | Checkpoint §3's “1440 leg 30/31” mixed widths. The final return's 24/1 table corrects it. Preserve the termination and original failed row. |
| Main Society phone log | 23 PASS + 2 FAIL = 25 | Closed-sheet toggle/replay failures remain in the original log; focused runs test the corrected harness path. |
| Flood combined log | 20 PASS + 2 FAIL = 22 (10/1 per width) | Desktop stale exit and phone V off-toggle fail. Phone rerun 11/11 is a separate run, not erasure of the failure. |
| Fresh-browser stale log | 8/8 (4 per width) | Eventual exits recorded at 33,121 ms / 19,293 ms, with DOM fallback. Not responsive interaction or real-GPU proof. |
| Leviathan combined log | 12 PASS + 2 FAIL = 14 (desktop 7/7, phone 5/7) | Phone V/VI label visibility waits fail; text is printed after DOM dispatch. Combined assertions do not separately prove every text condition for a failed row. |
| Leviathan phone rerun | 7/7 with 120-second label wait | Along with desktop's successful leg, 12/12 text cases plus 2 error rows are reported across the completed legs. All 12 successful text-case clicks use DOM fallback; no pointer-hit acceptance. |

These overlapping runs must not be summed into a unique coverage total. The latest focused evidence supports the narrow retained flood and Europa-boundary checks as **builder-observed DOM/state evidence**, alongside the earlier independent source/VM acceptance.

Additional limits:

- The main Society probe's “shared LEV_TEXT” row still reads landmark data; its globe loop asserts nothing. The new leviathan probe is the evidence for actually dispatching the globe-label handler and checking the banner.
- The leviathan probe checks label opacity at one instant, banner `hidden`/text, and selected landmark `innerText`. It does not establish stable pointer targeting, unobscured layout or the visibility of every scene surface.
- The flood probe uses `__floodH=43000`; all these Society scripts use `__atlasFast`. The normal flood equation was independently checked in the prior review, not freshly re-certified visually here.
- “Harness flake” and SwiftShader starvation are builder diagnoses. The supplied reruns show different outcomes; they do not independently establish that normal-device interaction cannot fail.
- The new focused suite is not a rerun of the historical 676-row Society gate suite. Carry or rerun broader coverage explicitly by affected dependencies; do not relabel these smaller probes as 676 current passes.

## Screenshots and validation gates

Fetched all four JPEGs through GitHub, verified their Git blob hashes and pixel dimensions, and visually inspected **4/4**: 3840×2160, 1440×900, 1280×800 and 390×844. They show the Society Book-I system landing with controls/Chronicle; the phone panels are collapsed. The phone's desktop right-drag/scroll hint is visible, as already disclosed. These images do not show Tyche, Lorn's Castle, any galactic pack place, open phone dossier, or a rendered leviathan interaction.

This satisfies **4/4 Society landing captures**, not the full matrix previously specified in [technical-disposition-5bfde31.md](technical-disposition-5bfde31.md) §4: atlas index + one place in each of six packs + Society at four sizes, **32 image slots**. This return supplies **4/32** of those slots; the other 28 are not supplied by this packet. Do not infer missing scene/readability checks from landing shots or DOM text. On a later narrowed scope, explicitly revise the matrix before taking new captures.

Fresh GitHub checks query for this exact head returned **0 check runs** and Actions query returned **0 workflow runs**. This is absence of exact-head CI evidence, not a failing test result. The builder's `pnpm check` **125/125**, distribution **175 files**, and `test:pages` **12×2** are reported in the checkpoint; no complete command log was supplied in this packet or independently executed here. The prior 68d47ce green run must not be presented as a new engine-head pass.

Before final technical sign-off, attach exact-runtime command/log provenance or an actual current CI run, resolve applicable visual slots, and retain the disclosed pointer-hit/device/timing and Save/Load limits. Final technical sign-off has not occurred.

## Canon boundary and next bounded deliverable

No new novel/source reading was performed in this implementation review: **0/6 legacy Society rows newly primary-verified**. Separate Deep Research was not invoked. The historical **139 unselected records** remain uncertified; that is an inherited sample-backlog count, not a fresh census of all current retained records. Remaining DW06 and full Society source coverage are incomplete and capped/deferred under R3. Accepted omissions and qualified reconstructions do not justify whole-PR canon approval.

**Hand back to fixing / claude for one documentation deliverable: `release-scope-manifest-03394c3.md`.** This makes the deferred canon boundary concrete before another final-evidence run or any owner scope decision:

1. At an exact unchanged successor or this head, map the existing audit/ledger dispositions to stable file/object selectors: accepted retained, explicitly qualified/model, already omitted, and still unreviewed/unsupported. Reconcile the historical 139 with surviving IDs; do not declare unreviewed claims false or verified.
2. Propose a dependency-closed, smaller release slice using only already accepted content dispositions and technical changes. Name retained files/selectors, excluded additions/scenes, entry points and cross-references that would change, including overlaps with PR24 and the separate Cosmere reading-state work. If a clean slice cannot be identified, name the exact dependency preventing it.
3. List the applicable exact-head validation and visual matrix for that proposed slice, carrying the missing gates above. Keep DWT-03-R1's trigger: fix and verify before any tree-bearing pack integrates. Preserve accepted unchanged fixes without asking for their research or tests again.

This is **packaging existing evidence, not a new broad source hunt**, authorization to delete 139 records, permission to split/merge PRs, or a release decision. Do not apply new cuts based on this request alone. Return the manifest for ChatGPT's finite scope review; only after a concrete acceptable proposal exists should any Mckay-only scope question be opened. No new Mckay action is required merely to prepare it. If this exceeds one run, save an exact completed/remaining selector checkpoint.

All **18/18 pack** and **8/8 review** statuses were checked. The three research-ready folders are unchanged from their completed self-audit baseline; no parallel status/history edits were made.

**Canon: not approved. No final technical approval, ready-for-owner transition, PR approval, merge, deployment or release approval.**

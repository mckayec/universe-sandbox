# Deep Worlds F2 independent review at 117ecba

2026-11-08, ChatGPT. Target: [PR37](https://github.com/mckayec/universe-sandbox/pull/37), `atlas/deep-worlds`, exact head `117ecbaadfe9a06fb24d8be79fb7262d71486c54`; parent `9aa06c1d72bbd23c6861e9239659049494ea5ae9`.

**DWO-E2-F2 closes within the reviewed book-gated text, announcement and URL scope. No new blocking defect was established in that delta. This is not full browser, technical, canon or release approval.** PR37 is still open and unmerged. Physical rendered state and visual fades are not certified by this review.

## Revision and change inspection

Read all nine files in the returned commit: eight probe/log files and the one application file, `public/atlas/engine.js`. The GitHub commit diff reports engine +29/-9 (the builder report describes +30/-8); this does not change the reviewed scope. Downloaded source and probe/log bytes were checked against their Git blob identities. Engine blob: `c6dfb80d65265e9feae0700d5a837ba378e0d8b7`.

The [builder return](fix-return-117ecba.md) was committed to main at `039348142413ca46d70b828310090851463c068c`, whose actual committer timestamp is 2026-11-08T09:36:13Z. Its 10:06Z status/report timestamp is ahead of that receipt and must not be used as execution timing.

The new `worldBookOk/siteBookOk/hideUnseen/asVisible` projection makes a book-hidden world appear unselected, and a book-hidden site appear as its still-visible world. Dossier, crumbs and announcements use that temporary view; `finally` restores the underlying transition selection. URL construction uses the same book projection. The downgrade handler refreshes those surfaces immediately in both the place and direct world-view branches. A hidden selection on popstate rewrites the landed URL while preserving its history marker. Site labels are not rebuilt for a hidden world during leave. Navigation ownership/cancellation counters and rollback state are unchanged.

This is intentionally book-only gating. Realm/layer filtering retains its prior behavior. Underlying selected world/site and physical transition state can remain present until the leave/ascend completes; the projection is not an assertion that all internal state is immediately empty.

## Independently executed checks

[Independent source probe](dwo-e2-f2-source-review-117ecba.cjs), run against exact snapshots:

| Check family | Head 117ecba | Parent 9aa06c1 | Meaning |
| --- | --- | --- | --- |
| Common book-gated presentation/URL checks | 14/14 | 4/14 | Ten parent failures exercise the changed behavior; four visible-positive controls pass on both |
| New helper restoration after throw and nested call | 2/2 | Not applicable | New helper does not exist on parent |
| Adapted F1 cleanup regression | 8/8 | Prior parent comparison retained separately | New calls mocked; original cleanup assertions unchanged |
| Adapted cancellation regression | 26/26 | Prior parent comparison retained separately | New presentation/book functions mocked; original navigation assertions unchanged |

The source probe executes actual engine slices for book guards, dossier renderer, crumbs, announcement, URL writes and popstate callback. It covers hidden-world place/world/galaxy phase states; hidden-site place/world states; site since/until gates; visible-place, All-books and noncumulative controls; later-book restoration; immediate popped-entry rewrite with history marker preserved; visible popstate; pending hidden-destination URLs; and temporary-state restoration.

These are fixture-based Node VM checks with mocked DOM, auxiliary dossier helpers, pack data, history and renderer. Phase states are supplied directly, not produced by real browser timing. They do not establish complete pack output, rendered pixels, browser history timing or accessibility behavior.

The F1 adapted harness differs from the prior independent probe only by four no-op calls now required by the handler: `renderDossier`, `renderCrumbs`, `announce`, `syncURL`. The cancellation adapted harness adds four mocks: identity `hideUnseen`, false `selHidden`, true `worldBookOk`, and no-op `announce`, with all fixture worlds visible. Thus the 26/26 cancellation result must not be described as validation of the new book gate; that gate is covered separately by the source probe.

## Builder browser evidence inspected, not independently rerun

Read the complete [phase probe](dwo-e2-f2-phase-probe.cjs) and [1440x900](dwo-e2-f2-phase-output-1440.txt), [390x844](dwo-e2-f2-phase-output-390.txt), and [parent 390x844](dwo-e2-f2-phase-output-parent-9aa06c1-390.txt) logs.

- Head: 20/20 at each width, 40 total. Parent: 14/20, with six failing copy/URL predicates across the three downgrade scenarios.
- Cases cover tour to e70/Luthadel, Stop, book 2 to 1; direct Scadrial world view, book 2 to 1; Elendel book 6 to 5 while Scadrial remains visible; a visible-place downgrade positive; and fresh book-1 galaxy negative-predicate control.
- Immediate samples run in the same JavaScript task as setBook, followed by polling until settlement. Actual polling under SwiftShader is roughly 0.3–1 seconds, despite a nominal 100 ms interval. Sub-sample flashes cannot be excluded. Logged immediate, post-leave/pre-ascent and final states are represented.
- The actual mobile A log contains **16 samples**, rather than the report table's 17. Desktop A contains 13. Assertion counts remain 20/20 per width.
- The hidden-world-name predicate applies to the dossier heading, crumbs and announcement, not all dossier body text: the neutral series introduction legitimately names worlds. Hidden-site and selected-event text have broader body checks. This is not an all-string spoiler audit.
- The probe uses DOM tour clicks plus API setBook/entry/selection. It checks page exceptions, not all console/network failures. It has no same-document marker and no screenshots. It does not prove real pointer, keyboard, assistive-technology, physical-device or real-GPU behavior.

**No independent browser execution is claimed.** The previously observed Chromium socket-permission block remains an independent-browser limitation; no retry or alternate route was used in this review.

The 90-check DWO-E2 matrix was not rerun at this head, nor was `test:browser`. Prior 90/90 evidence belongs to 9aa06c1. The direct-from-galaxy place-leave branch that descends into the world and then ascends is not covered by the new phase probe. The 3D world/site visuals during fades are expressly ungated by this change. These remain validation limits, not newly demonstrated defects.

## CI verified against the tested revision

Inspected [CI run 42467829065](https://github.com/mckayec/universe-sandbox/actions/runs/42467829065), its [build job 128691336528](https://github.com/mckayec/universe-sandbox/actions/runs/42467829065/job/128691336528), and complete job logs:

- Formatting and production build pass; **125/125 unit tests** pass.
- Distribution validation covers 175 files; **12 pages x 2 viewports** pass.
- Deploy job is skipped.
- CI does **not** run `test:browser`.

The checkout is synthetic merge `b367f8b52fe80fa468a3bf20273e5f6cf3ca55a9` into base `fc48da39c2f96eaa3fb0675712d0b024ea93ad2b`. Complete, untruncated recursive tree comparison shows all **281 non-doc file identities identical** between that tested merge and the reviewed PR head. No local full-build or full-browser-suite pass is claimed.

## Existing DWT-02 remains reproducible; next bounded unit

[Independent current characterization](dwt02-characterization-117ecba.cjs) reruns the previously recorded Low DWT-02 case at both 117ecba and 9aa06c1. Only the same four presentation/book mocks described above were added to the earlier harness; assertions and navigation slices are unchanged.

Starting inside a/a1, call `goEvent(e2, a/a2)`, advance 100 ms, repeat the identical pending destination and drain the fake timer/history queue:

- Both revisions: no a/a2 arrival; state/history return to a/a1.
- Issue a fresh request after settlement: a/a2 arrives and e2 is selected.
- Desired arrival plus recovery: **1/2 on each revision**. This is a modeled navigation result, not a newly run browser reproduction or an F2 regression.

**Return to Claude for a bounded DWT-02 repair or evidence-backed disposition after its active Timeline O-1 unit.** Claude's 09:46Z run lock explicitly names Timeline same-document layer restoration on PR45; do not interrupt or replace that work. This queue entry is not evidence of DWT-02 pickup.

For DWT-02, preserve same-destination idempotence or make the latest same-destination request arrive once, without losing a committed view. Return the exact head, parent-failing/current-passing repeated-request control, fresh-retry and distinct newer-destination controls, plus the 26 cancellation and 8 F1 regressions. Keep newly introduced presentation mocks distinct from actual gating checks. If real rendered evidence cannot be run, report the precise limit rather than promoting the VM result.

## Gates preserved

Prior accepted content dispositions are unchanged: the 18 narrowed leaves, three scoped retains and three Dune omissions are not reopened. Eight source holds and 139 unselected records remain; there is no new source coverage from this engine review. Society, Save/Load, broader browser/device/technical evidence, geometry and full canon audit remain unfinished. Mckay's release gate remains required. This review edits documentation/probes only and does not approve, merge or deploy PR37.

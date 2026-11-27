# Independent checkpoint 28 review — daeaf39

2026-11-08 UTC. **O-1 closed within the bounded same-document filter-restoration source/transaction scope.** Return to implementation / claude for the carried real-input/focus qualification. No final canon, full technical or release approval.

## Exact revision and scope

PR45 `engine/timelines`, head **daeaf395fd4fc309eca1ea27854e2a8f4bb287ea**, parent **1ceb4b224b5343f06116ccd581cb1ceb10ad9f5f**. Independently read PR metadata, the actual parent diff, **6/6 changed text files**, full head/parent engine source and relevant unchanged layer decoder. The only application delta is the new filter-restoration helpers and their call in popstate; other five files are checkpoint/probe/log evidence. No pack, ledger or source-eligibility changes. **0/12 real pilot relationships promoted or newly canon-approved.**

Intake read **25/25 pack/review statuses** on current main fccfb5a96d44d25fd02d71359a5db5a171208d8f. Sole owned work: this review. **15/15** research/source/review/audit/addendum blobs across Hierarchy, Licanius and Narnia match previously inspected main19a518ac7e5e08157e364bf6196ceb9a4ef44447; no stale parallel self-audit. Agreement remains active with both sign-offs. No changes to Mckay decisions or Claude-owned deep-worlds status.

## Assessment

`filtersFromURL` applies incoming active layers and year range after chapter restoration and before timeline restoration, within the existing URL-write hold. It treats absent filter keys as all layers/full range, avoids refresh when sets/ranges are equal by value, clears filtered-out events/sites, refreshes host controls and timeline, and lets the popstate path handle ascent rather than calling history.back inside itself.

This fixes the specific O-1 omission: the parent never applied incoming filters at all. The captured hash remains available for timeline restoration; intermediate refreshes cannot overwrite it. Layer decoder inspection confirms omitted fields are undefined, and the new function normalizes those to null. This is source evidence; it does not certify every surface transition.

## Independent execution

[Reproducible source-transaction probe](tl28/reviewer-transaction.cjs) embeds exact head/parent transaction snippets and the unchanged chapter restoration function. It substitutes parseHash input, rendering/refresh effects, timeline gate/selection behavior and history transport. These are labelled synthetic fixtures, not browser or canon evidence.

| Case | Head | Parent |
|---|---|---|
| Layer downgrade clears timeline selection | Pass | Fail |
| Missing layers key restores all | Pass | Fail |
| Incoming year range applied | Pass | Fail |
| Missing year key resets range | Pass | Fail |
| Equal sets/ranges avoid filter refresh | Pass | Pass |
| Hidden event cleared | Pass | Fail |
| Hidden galaxy selection cleared | Pass | Fail |
| Chapter and layers applied before timeline restore | Pass | Fail |

Each case also requires exactly one unheld URL-write request. **8/8 head;1/8 parent**. Parent failures are expected negative controls. The initial reviewer predicate assumed non-null layers and threw on the parent; it was corrected to test null safely before the recorded paired run.

Pinned source blobs: head engine **ff085bd42b4ae62519b0e2d48ff06dd50403cfaf**; parent engine **b6650d6fe7a33fa0d2d8c9b3ac27ea3a883fdedf**; layer decoder **22fff796d738d18b70db12fd3fab18e4ce4b23e9**. Execution: Node v24.22.1.

Fresh Playwright launch using /usr/bin/chromium, headless, --no-sandbox failed at10:11:31 UTC before page creation:
`process_singleton_posix.cc:297: socket() failed: Operation not permitted (1)`.
**0/96 browser cases independently executed**. No screenshots, real input, device/AT or full-suite pass claimed.

## Builder evidence and qualifications

Read the full probe and all three logs. Counts reconcile: **96/96 head**, **48/96 parent** with48 failures, and **38/38 chapter-history regression**. The seven entries exercise same-document hash links, Back and Forward at1440/390 with chapter, layers, chips, URL selection and timeline-open state. These remain builder observations.

The probe checks exact record-ID membership and uniqueness. Despite its “relationship set equality” wording, it checks relationship counts, not relationship identities; this is counted relationship coverage only. It captures `tl` but does not separately assert its value in the state predicate. All seven entries omit `yr`, so rendered year-control restoration is not covered by the96-case log; the independent year controls above cover state assignment/reset only. These limits do not reopen the specific missing-layer restoration fix.

The full check165/165 and page smoke12×2 are checkpoint reports, not independently rerun here. Synthetic chapter gates are fixtures, not real canon data. No new source research was needed for this engine-only delta.

## Next bounded unit

Claude should investigate the carried TL22-E2 actual-input/focus gap: reproduce the1440 timeline-open click timeout against exact head/parent, retain390 as a control, and exercise real close→chapter change→reopen with selected-record/list gating. Return causal diagnosis, any scoped fix, and terminal/browser evidence or the exact blocker. DOM-dispatched clicks alone do not close the real-input qualification. Preserve the separately queued deep-worlds DWT-02 work.

Carried limits: hand-typed hashes naming a surface hidden by their own layers; default-off-layer fresh-load versus same-document semantics; rendered year controls; mobile1714-row performance; device/AT; chapter gates outside the timeline; PR33 integration; full technical qualification and Mckay release approval. The existing default-off and hidden-surface limitations are explicitly disclosed in checkpoint28, not newly certified behavior. No additional O-1 layer-fix loop requested.

# Independent TL27-E1 return review — 1ceb4b2

2026-11-08 UTC. **TL27-E1 closed within the bounded probe-correction scope.** Return to implementation / claude. This is not final canon, full technical, rendered-browser or release approval.

## Exact target and intake

PR45 `engine/timelines` at **1ceb4b224b5343f06116ccd581cb1ceb10ad9f5f**, parent **97674adb29a88745ddf56c9ea3b7f0cf46093887**. PR metadata independently confirms the head. The actual parent diff contains six documentation/evidence files: **5/5 text files read**, **0/1 changed JPG visually inspected**. No application, pack, sidecar or test file changes. Prior application review is [independent-review-97674ad.md](independent-review-97674ad.md); this evidence-only return does not re-certify the entire PR.

Read current-main workflow documents and **25/25 pack/review statuses** at intake main19a518ac7e5e08157e364bf6196ceb9a4ef44447. Sole owned item: this review. **15/15** research/source/review/audit/addendum blobs for Hierarchy, Licanius and Narnia are unchanged against previously inspected main059021a9463819062cf7b8f96086b572acfb3002; no stale self-audit identified. Agreement active with both sign-offs, unchanged. Existing Mckay decisions and WIP limits remain in force.

## Disposition

| Finding | Severity | Result |
|---|---|---|
| TL27-E1 paired endpoint/ring offset falsely passes | Low | Closed at predicate/evidence-definition scope |
| Overview note claim exceeds phrase-presence assertion | Qualification in TL27-E1 | Closed: parsed numeric counts now compared |

The revised reader obtains the actual `.tl-sum-bar` center keyed by the enclosing `data-lane-t`. Coordinates are converted through inverse root CTM × element CTM. The predicate compares folded path ends and rings independently to that lane's measured bar center, with tolerance0.01; it does not merely compare them to each other. A dated lane lacking a summary bar fails. A lane without dated chart marks may have no bar, while an attempted folded endpoint there still fails. Expanded endpoints, same-lane hidden edges, folded flags and title checks are retained.

The live-DOM mutation code moves a folded path end and its ring together by26 local units, tests rejection, re-renders through collapse/expand controls, tests acceptance, then moves the ring alone and tests rejection. This directly targets the reported false positive. The note check parses folded and inside counts rather than testing phrase presence.

## Independent execution

[Reproducible synthetic controls](tl27/reviewer-e1-predicate.cjs) contain the exact revised `near/judge` and numeric-note assertions extracted from probe blob **c12b4b4e4f14943da2d37ee13f09dd5e5c9172ff**. These exercise predicates, not browser measurement or application rendering.

```text
node tl27e1-predicate.cjs
PASS valid folded geometry
PASS paired 26px shift rejected
PASS ring-only shift rejected
PASS path-only shift rejected
PASS missing summary rejected
PASS wrong-lane summary rejected
PASS expanded end displacement rejected
PASS missing folded ring rejected
PASS correct numeric note
PASS wrong numeric note rejected
10/10 independent synthetic predicate checks passed
```

Fresh Playwright launch using /usr/bin/chromium, headless, --no-sandbox failed at09:18:48 UTC before page creation:
`process_singleton_posix.cc:297: socket() failed: Operation not permitted (1)`.
**0/75 browser assertions independently executed**; no screenshot or rendered geometry pass claimed. Full application tests were not rerun because the delta is documentation/probe-only; prior14/14 targeted unit results belong to the parent review, not a new run.

## Builder evidence assessed

The JSON contains **75/75 passing results**, zero errors, matching the75 PASS entries in the text log. Includes **8/8 negative mutation cases** (paired/ring-only ×2 lanes ×2 widths), plus **4/4 restored-state controls**. Summary Y values91 (Judaism) and415 (Christianity) are recorded at both widths; note counts1/2 and1/6 match the per-lane expectations. The separate history log contains **38/38 PASS entries**. These remain builder observations, not independently executed browser checks. The checkpoint's165/165 full check is an attributed report; page tests were explicitly not rerun.

The real-pack Islam-off case remains a weak removal test (7→7 connectors); meaningful book/chapter/layer removal coverage is the previously reviewed synthetic unit fixture. No application defect was reproduced by this return. **0/12 real pilot relationships promoted or newly canon-approved.**

## Next bounded unit and carried gates

No further TL27-E1 loop is requested. Claude should preserve its already queued deep-worlds DWO-E2-F2 priority, then address the existing O-1 same-document layer-restoration gap on PR45: apply incoming layer state before timeline gating/selection restoration, and return exact-head/parent evidence for Back/Forward with layer and timeline state together. Keep source eligibility, proposed-only sidecar status and chapter-history regression intact.

Carried limits remain TL22-E2 real-input/focus and1440 click timeout; real close→chapter change→reopen; mobile1714-row performance; device/AT; chapter gates outside the timeline; PR33 integration; full technical qualification and Mckay release approval. This closure does not waive them.

# Deep worlds — overlapping-cancellation return review

- Reviewer: ChatGPT, 2026-11-08 UTC (November 7 Denver).
- Audited PR #37 / `atlas/deep-worlds`: **b47a60c663c571a2bb5deb932bb129fe941c73da**.
- Parent: `3621250b917509aa57bb877fd3f143dd8a0ad2fe`.
- Verdict: **DWT-01c closed within the source/VM scope.** Return to Claude for the existing DWO-E2 rendered matrix. No new canon, full technical or release approval.

## Scope and evidence

Read [prior review](implementation-review-3621250.md), [fix return](fix-return-b47a60c.md), the complete one-file commit diff and actual head engine source. The only changed file is `public/atlas/engine.js` (+7/-4). Independently verified the local source's Git blob as `df48a8f22aaace81ed9cf79318eabe6092c58a8f`. Fresh PR metadata still names the audited head and reports the PR open.

The shared `pendPrev` baseline now survives overlapping pending entries, is inherited before another destination overwrites state, and clears on successful entry, actual restoration, and leaving the place. Existing generation/site/history-entry ownership checks remain. This addresses the prior T21 root cause without rolling an obsolete request back over a newer successful entry.

| Independently executed check | Head | Parent | Interpretation |
| --- | --- | --- | --- |
| Existing reviewer 22-case probe | 22/22 | Prior run 21/22; not rerun separately here | Original overlapping Stop reproduction now passes |
| Builder 26-case extension | 26/26 | 23/26 | Parent fails T21, T23, T26; head preserves chained cancellation, newer manual entry, committed-baseline refresh and post-rollback retry |
| Same-destination arrival/retry characterization below | 1/2 | 1/2 | Repeated pending request loses arrival on both; fresh retry succeeds on both |

These execute actual engine source slices with chronological timers and asynchronous modeled history. DOM, renderer, eligibility helpers and page environment are mocked. Counts are scenarios, not browser/full-engine coverage, and overlapping suites must not be added into a unique coverage total.

The builder's 125/125 unit tests, 24/24 page cases, build/dist and older regression passes were not independently rerun in this review; they remain attributed to the return. No new CI execution/log verification or full-book source research is claimed.

## Rendered corroboration: useful, bounded

Read [browser harness](dwt01c2-browser-check.cjs) and all six scenario records in [saved output](dwt01c2-browser-output-b47a60c.txt). The parent overlap-stop log reports state/URL Paddies while rendered Castle remains; all three head logs report state/URL/rendered Castle, with zero reported page errors. These support the specific correction, but execution is builder-attributed.

Limitations:
- API `enterPlace` calls and callback invalidation, not actual Tour/Stop buttons; 640×400 SwiftShader only.
- The predicate allows `rendered == null` and merely logs page errors. Tighten future acceptance to require the exact rendered place and zero errors. All supplied head logs actually contain `rendered: "castle"` and zero errors, so this predicate weakness does not invalidate those recorded observations.
- Positive mode finishes at Castle, not Paddies despite the stale script-header comment. It does not alone prove a different destination rendered; VM T16/T24 provide separate modeled positive controls.
- Screenshots were not inspected here; no independent visual acceptance.

A fresh independent browser attempt failed: default Playwright executable was absent; the installed `/usr/bin/chromium` then failed before page creation at `process_singleton_posix.cc:297`, `socket() failed: Operation not permitted (1)`. **Zero independent rendered scenarios completed.** This limitation is not a pass and does not close DWO-E2.

## DWT-02 — repeated identical pending destination (Low follow-up)

The builder's observation is independently reproduced on both head and parent. Starting inside a/a1, request e2@a2, advance 100 ms, request e2@a2 again, then drain. No a2 entry builds; state/history restore a1. A fresh request after settling builds a2 normally.

Reproduction using the existing `ctx`, `G`, `SURF` and `PLACE` helpers from [dwt01c2-probe.cjs](dwt01c2-probe.cjs):

```js
const x = ctx({
  S: {view:'place', sel:'a', site:'a1'},
  history: [G, SURF('a'), PLACE('a','a1')]
});
x.goEvent(x.ev('e2','a','a2'));
x.advance(100);
x.goEvent(x.ev('e2','a','a2'));
x.drain();
// Both revisions: x.log.entered === []; S.site === 'a1'.
// Desired eventual-arrival assertion would fail on both.
x.goEvent(x.ev('e2','a','a2'));
x.drain();
// Both revisions: x.log.entered === ['a/a2']; fresh retry succeeds.
```

**Disposition:** record as a separate Low follow-up; do not reopen DWT-01c or delay the DWO-E2 matrix for another speculative race sweep. The demonstrated impact is a lost rapid repeated navigation with recovery on a fresh retry, not an established spoiler leak or document exit. Browser frequency and actual Tour interaction remain unverified. Preserve this gap in the eventual technical/release recommendation; this review does not approve shipping the whole atlas.

## Handoff

Claude's next bounded unit is **DWO-E2**: e70/e102 at/below gate, direct links, tour/Back, 390px, and Dune conservatory/residency navigation, as already requested. Use exact-head evidence and assertions that require rendered state rather than allowing missing state. Return failed scenarios or precise blockers honestly. Carry DWT-02 as a separate follow-up with its recovery/coverage limits.

Prior canon dispositions carry unchanged: three authorized Dune omissions, eighteen narrowed leaves and three scoped retains; eight source holds and 139 unselected records remain outside acceptance. No new canon verification or release action.

Run inventory: 25/25 status files checked. This was the sole ChatGPT-owned review. All 15 research/source/question/audit/addendum blobs across Hierarchy, Licanius and Narnia are unchanged from main `721710d90875e46e5f37a46ae12f3bab0fa701ab`; no stale parallel self-audit was identified. Agreement and other ownership remain unchanged.

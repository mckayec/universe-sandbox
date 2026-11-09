# Deep worlds — DWT-01c return review

- Reviewer: ChatGPT; 2026-11-08 UTC.
- Audited PR #37 head: `3621250b917509aa57bb877fd3f143dd8a0ad2fe`, branch `atlas/deep-worlds`.
- Compared parent: `1fe00c42d4d44c61544a68223e2d47ad40704d70`.
- Scope: 1/1 changed application files inspected, `public/atlas/engine.js` (+11/-3); head Git blob `7f34de68c441d5c2867aeb2e110c3b8ceb8ce7a5`.
- Disposition: **single-switch correction verified at source/VM level; DWT-01c remains open (Medium) for overlapping cancelled switches. Return fixing/claude.**
- This is a bounded technical return review, not new canon acceptance, full technical acceptance, or Mckay's release approval.

## Evidence and independent checks

Read the actual head source/diff, prior review and corrections, [builder return](fix-return-3621250.md), [builder VM probe](dwt01c-probe.cjs), [browser harness](dwt01c-browser-check.cjs), and [saved browser output](dwt01c-browser-output-3621250.txt).

| Check | Audited head | Parent | Evidence class / limit |
| --- | --- | --- | --- |
| Builder's 20-case probe independently executed | 20/20 | 17/20 | Actual engine source slices, mocked DOM/renderer; parent fails T15, T19, T20 |
| Prior independent 16-case probe executed | 16/16 | Not rerun in this return | VM only |
| [New 22-case reviewer extension](dwt-review-probe-3621250.cjs) | 21/22 | 19/22 | T21 fails head and passes parent; T22 positive control passes both |
| Builder single-switch rendered logs | 2/2 head scenarios consistent | 1 positive control consistent; 1 cancellation mismatch reproduced | Four saved scenarios inspected, not independently run or assertion-based |
| Independent rendered scenarios | 0 completed | 0 completed | Chromium failed before page creation |
| pnpm check / test:pages | Builder reports 125/125 and 24/24 | Not rerun | Counts remain builder-attributed this run |

The final reviewer extension adds a `location.href` getter so the new rollback receives a real URL string in the VM; the failing T21 persists with that correction. Its timers are chronological and history traversal asynchronous. The renderer and DOM are mocked, so it demonstrates state/transition behavior, not a browser reproduction. It does not exhaustively test browser history-state identity or physical Back behavior.

Prior lifecycle/transition/history closures are not reopened by this review, but those older suites were not independently rerun in this return. `test:browser` was not rerun by the builder for this head according to the return. No fresh full-suite or CI acceptance is asserted.

## DWT-01c residual — rollback captures a pending destination

**Medium; engine.js lines 1405 and 1423 onward, `enterPlace` / `cancelEntry`.**

The new snapshot copies `S.site/lm/ev` and the current URL/history before destination writes. With one switch, these describe the rendered place, and T15/T19/T20 now pass. With a second request arriving before the first entry commits, they describe the first request's pending destination instead.

Reproduction in T21:

1. Start inside rendered place a/a1 with its place history entry.
2. Request event e2 at a/a2.
3. Advance 100 ms; request event e1 at a/a1.
4. Advance 100 ms; Stop; drain queued work.

Expected: neither cancelled entry builds; state and URL continue to describe a/a1, which remains rendered.

Observed at audited head with the final URL-model correction:

```json
{
  "entered": [],
  "state": {"view":"place","sel":"a","site":"a2","lm":null,"ev":null},
  "history": {
    "st": {"atlasSurface":true,"atlasPlace":true,"atlasEntry":1},
    "hash":"#world=a&site=a2&view=place"
  }
}
```

No replacement place was constructed, but the second cancellation restores a2 from its snapshot. Parent 1fe00c4 passes this particular scenario (while still failing the three original single-switch cases). Thus this is a newly demonstrated regression in the rollback, not a claim that the parent is acceptable overall. T22 repeats the two requests without Stop and verifies only the latest entry builds and e1 is selected; it passes both revisions.

**Required bounded correction:** make rollback identify the last committed rendered place and its corresponding selection/history across overlapping pending entries. Do not treat another uncommitted request's mutable state as the rendered baseline. Preserve the existing ownership protections so cancellation cannot overwrite a newer successful/manual entry. The implementation approach remains Claude's choice.

Acceptance for the return: T21 must pass alongside T1–T20 and T22; include a chained-cancellation control and a newer-successful-entry control. Provide rendered corroboration when the working browser environment permits, explicitly distinguishing API calls from actual Tour/Stop interaction.

## Rendered evidence and remaining gate

The builder's saved four scenarios support the narrower single-switch fix: parent Castle → Paddies cancellation leaves state/URL at Paddies while rendered place/title remain Castle; fixed cancellation keeps Castle consistent; uninterrupted controls reach Paddies on both revisions. Each log reports zero page errors.

The inspected harness invokes `window.__atlas.enterPlace` directly and invalidates its ownership callback after 100 ms. It does **not** exercise the actual Tour Stop button. It logs values and takes screenshots without assertions. Screenshots were not inspected in this review. These records are useful builder evidence, not independent rendered acceptance and not coverage of T21.

A fresh local Playwright Chromium launch failed before any page was created with `socket() failed: Operation not permitted (1)` in `chrome/browser/process_singleton_posix.cc:297`. Zero independent browser scenarios completed; this unavailable test is not a pass.

**DWO-E2 remains pending:** complete the existing e70/e102 at/below-gate, direct-link, tour/Back, 390px, and Dune conservatory/residency navigation matrix, or supply its bounded disposition for review. The single-switch logs do not replace that matrix.

## Continuation and ownership

Hand back the finite DWT-01c residual and DWO-E2 evidence work to Claude immediately. Do not expand this return into another broad source pass. Previously accepted three Dune omissions, eighteen narrowed leaves and three scoped retains carry; eight source holds and 139 unselected records remain outside acceptance. No new primary-source research was performed or claimed.

Run inventory: 25/25 pack/review statuses inspected; this was the sole ChatGPT-owned review. Hierarchy, Licanius and Narnia research/source/question/audit/addendum blobs were unchanged (15/15 comparison) from the prior check, so no parallel self-audit rewrite was warranted. Other Claude/Mckay-owned work remains with its owner.

Only documentation and the coordination lock were written on main. No application code, PR branch, merge, deployment or release approval.

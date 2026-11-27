# Lore corrections — revision 4 handoff reconciliation

Reviewed 2026-11-05 America/Denver (2026-11-06 UTC), ChatGPT.

**Not approved: the previously identified R4-C1 deferred EMP timer still survives effect cancellation.** This is a source/state implementation recheck and reconciliation of a stale main handoff, not a new literary-source audit or release decision.

Exact target: PR [24](https://github.com/mckayec/universe-sandbox/pull/24), branch `fix/lore-corrections`, **a0d8726d55e389e4568a8d00ab4d9937d2f51e86**, freshly confirmed open/unmerged. The same head was already reviewed in [the published R4 report](https://github.com/mckayec/universe-sandbox/blob/0d916114ce5c542d63ade991ab137fa73c449b96/docs/reviews/lore-corrections/implementation-review-r4.md). Main still requested this review. Preserve that earlier report, its validation/probes, and the historical reviews; this document makes its actionable outcome available on main.

## Evidence and dispositions

Read Claude's [Revision 4 implementation evidence](https://github.com/mckayec/universe-sandbox/blob/a0d8726d55e389e4568a8d00ab4d9937d2f51e86/docs/reviews/lore-corrections/implementation.md), the published R4 report, the actual [fix commit 0eec1d4](https://github.com/mckayec/universe-sandbox/commit/0eec1d452d410ef5d54c6f02620c6ed67b7e345d), and relevant exact-head Society and Hyperion source. PR head identity establishes that no successor fix has replaced the reviewed implementation.

| Prior item | Disposition retained at this unchanged head |
| --- | --- |
| R3-C1 | Closed at source/data level. Shared Europa `LEV_DESC` has neutral base and book-VI detail, banner uses `eraVal`, and the repeatable landmark gate runs after the final extensions. The earlier fixture coverage remains historical evidence, not a newly executed gate matrix. |
| R3-C2 | Partial. Navigation-generation and commit-time visibility checks exist; book changes call effect/banner cleanup. R4-C1 below remains unfixed. |
| R3-C3 | Closed as the inherited editorial repair: Bressia explicitly names the Consul's wife and son. No new primary-book confirmation was obtained in this run. |

**Counts: 2/3 R3 groups closed, 1/3 partial; 1/1 previously reported R4 blocker still open; 0 new finding IDs.** The inherited forty-row ledger remains 26 mandatory rows conforming, L29 partial, 13 retained/no-change rows. These are prior reconciliation counts, not forty newly verified literary claims.

## R4-C1 — Medium: canceled Heliopolis effect can mutate a later scene

At [society.js line 3034](https://github.com/mckayec/universe-sandbox/blob/a0d8726d55e389e4568a8d00ab4d9937d2f51e86/public/atlas/society.js#L3034), `FX.heliofall` still schedules:

```js
SITES.heliopolis._emp&&setTimeout(()=>SITES.heliopolis._emp(),2500);
```

The returned effect has an update function but no timer-disposal hook. [`stopFx`, line 2867](https://github.com/mckayec/universe-sandbox/blob/a0d8726d55e389e4568a8d00ab4d9937d2f51e86/public/atlas/society.js#L2867), calls any effect dispose hook and removes its group; it cannot cancel this unretained timer. Book changes call that cleanup at line 3176, but the timer checks neither generation nor active scene/instance. Its callback looks up the current `SITES.heliopolis._emp`, which scene construction replaces at line 2378.

A fresh isolated Node VM probe extracted the exact timer statement and `stopFx` from the fetched head. It supplied inert scene fixtures and a captured timer queue, without loading Three.js or a browser:

| Case | Observed result |
| --- | --- |
| Uninterrupted control | Original handler called once. |
| Stop before timer fires | Effect group removed; original handler still called once. |
| Stop, replace scene handler, then fire old timer | Effect group removed; replacement handler called once, original handler zero times. |

**3/3 characterization cases matched: 1 normal control and 2 reproductions of the existing defect. This is not a passing acceptance test for the implementation.** The return object's lack of disposal was also inspected directly. This focused probe did not execute the full effect constructor, actual book-switch UI or rendered scene; the earlier R4 report separately records its source-state downgrade/return probe. No visible book-I spoiler or real-device race is claimed.

Required correction remains unchanged:

1. Retain the timer handle in the effect and clear it on disposal.
2. Also guard callback execution by reading-selection generation and the same active scene/instance. Capture the intended handler/instance rather than applying an old callback to a freshly installed handler.
3. Cover downgrade before firing, downgrade-and-return/rebuild, stop/replay within the same book, and uninterrupted eligible playback firing once. A generation check alone does not cover same-book stopping/replacement.

Do not remove the effect or weaken acceptance to make checks pass. Return the new exact PR head, per-case evidence and any updated tests for ChatGPT recheck.

## Evidence boundaries and continuation

The earlier review's 82/82 unit tests, 141 source assertions (including its expected defect reproduction), and successful CI are historical results, not rerun here. Claude's 54/54 browser assertions at each viewport and older 419-assertion regression suite remain attributed implementation evidence; neither proves that this omitted timer path is safe.

No dedicated Deep Research session, primary-book re-verification, browser/server/device test, complete rendered acceptance or new full test/build run occurred in this bounded reconciliation. Earlier source-confidence qualifications and rendered/mobile/keyboard gates remain open at their recorded scope. Source correction, containment testing and Mckay's eventual release decision remain separate.

Claude owns the concrete timer fix. Main status moves to `fixing / claude` after this report is committed and confirmed saved. Earlier R3-C1/C3 corrections need not be redone unchanged. No code change, formal GitHub approval, merge or deployment is included.

**Not approved: fix R4-C1, return the changed exact head with cancellation/replay controls, and retain the outstanding rendered/interactive and owner-release gates.**

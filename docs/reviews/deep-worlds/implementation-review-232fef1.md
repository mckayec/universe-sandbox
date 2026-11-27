# Deep Worlds — bounded return review at 232fef1

2026-11-07 UTC · ChatGPT.

**Verdict: changes requested.** DWR-A is closed at source/isolated-test scope; DWR-B is partially repaired. Two Medium follow-ups below are finite implementation work. Full canon and release approval remain withheld.

## Exact target and method

PR [#37](https://github.com/mckayec/universe-sandbox/pull/37), `atlas/deep-worlds`, **232fef155c7a76cfb9e728321f064010cbb3878a**, parent **60176e78f1272816a0869a5abe8018e884d704f7**. Fresh PR read: open/unmerged; GitHub reports mergeable=false / dirty. Claude owns conflict reconciliation; any changed runtime/content needs the applicable recheck.

Read all **3/3 diff files** (engine.js, society.js, packs/cosmere.js), exact-head engine navigation/eligibility code, Society effect registration/disposal/book-clearing paths, previous audit and supplement instructions, builder return, complete committed probe and output. The Contents endpoint returned empty Society content; the Git blob endpoint supplied the complete source for blob **59c3eb5237161eaa6784b18e46ebc4bf3e5555e9**, used in the independent tests. Engine blob: **ba51c41371dba7270e82d33394af98ad32c2a1fe**.

This is an implementation review against existing source-backed dispositions, not a fresh literary audit. **0 new primary-book claims certified.** Unchanged CB closures, commentary provenance and broader Known gaps remain intact.

## Lifecycle disposition

**DWR-A: closed at source/isolated-test level.** The EMP timeout belongs to the effect group, stopFx clears it, and the callback checks both navigation generation and active-group membership. clearForBook increments generation and stops effects on downgrade. Replay/stop cannot reuse the old instance; natural removal from fxList also fails the membership guard. Full rendered acceptance remains separate.

**DWR-B: partial.** The 500 ms continuation and later event effect now reject stale generations and ineligible/different-destination events. However, the earlier transition callback still builds the old place before reaching those guards.

| ID | Severity | Exact location and finding | Evidence | Required repair |
|---|---|---|---|---|
| DWR-B residual | Medium | engine.js, enterPlace transition callback around lines 1385–1392; selectSite around 1350. The transition checks current world and site eligibility but not its captured generation or current site destination before PLACES.enter. selectSite also does not invalidate the generation. | Independent actual-source fixture: queue entry to Hyperion tree, then call openEvent(null,false), then drain → PLACES.enter still builds tree despite invalidated generation. Queue tree, then actual selectSite(keats), then drain → tree is built while S.site is keats. Later event playback is correctly blocked, but the place/state mismatch remains. | Guard the transition before changing view or building PLACES with the captured generation and intended destination. Invalidate pending entry when site selection changes, including away-and-back selection. Recheck world/site eligibility at commit. Add assertions for the entered place and state, not only S.ev/effect counts. Preserve an uninterrupted positive control and fresh navigation after cancellation. |
| DW-CS04-label | Medium | packs/cosmere.js, yeddaw/gate around line 318. Description now removes the unsupported refugee identity, but name remains **The refugee entrance**. | Actual returned object and CS04's existing evidence limit in supplement-review-60176e7.md: inspected excerpt supports a guarded entrance and waiting people, not their refugee identity. This is unverified here, not proof that refugees never occur in the novel. | Exact conservative replacement for name: **The guarded entrance**. Keep the already accepted replacement description and gate. Alternatively supply the primary passage establishing the retained label. |

DWR-B remains the existing blocker ID, not a duplicate new defect group. DW-CS04-label is the residual label in this return's claimed narrowing.

## Independent execution and limits

Ran the committed dwr-probe.cjs against the retrieved exact-head engine, Society and Hyperion sources: **22/22 assertions pass**. The engine-only subset's 12/12 pass is part of that total, not additional coverage. The suite executes real source slices in VM fixtures with inert renderer/state collaborators; it is not a browser run. Some handler behaviors are modeled and source-asserted, rather than executing full DOM handlers.

Added [dwr-residual-probe-232fef1.cjs](dwr-residual-probe-232fef1.cjs), using the same engine fixture with actual selectSite/openEvent functions and a recorded PLACES.enter target. **3/3 characterization outcomes observed: 1 uninterrupted positive control and 2 defect reproductions.** Its exit 0 means the expected defect was reproduced, not that the application passed remediation.

Observed output:

```json
{"label":"positive uninterrupted","entered":["tree"],"view":"place","site":"tree","event":"b2n","effects":["battle"]}
{"label":"generation invalidated before transition","entered":["tree"],"view":"place","site":"tree","event":null,"effects":[]}
{"label":"site changed before transition","entered":["tree"],"view":"place","site":"keats","event":null,"effects":[]}
```

This demonstrates source-state lifecycle behavior, not that a specific pointer sequence was reproduced through the fade overlay in a browser. It exposes what the existing B2/B7 tests omit: those only assert no later event playback/restoration and do not assert that the stale place was never entered.

Claude's **89/89 unit**, **24/24 page** and distribution checks remain builder-reported in this review. The head check-runs endpoint returned **0 check runs** at this read; no fresh successful CI run is claimed. Prior-head CI is not transferred. No independent app/browser, keyboard, tour, deep-link, screenshot or physical-device execution was performed here. Builder explicitly did not run test:browser or four-viewport capture for this return; those acceptance gates remain open.

## Supplement implementation accounting

All **23/23 IDs** have a returned disposition. This is accounting, not 23 verified literary records.

- Seven prescribed conservative descriptions (CS01/04/07/08/11/12/17) match the requested replacement text **7/7**. Six have no new residual in this comparison; CS04 retains the label issue above.
- CS02 Clubs landmark and CS06/e7 are omitted **2/2** as requested. Removing unsupported detail does not prove it false.
- Optional e14 landmark detachment and e16 clarification conform **2/2**.
- The other **12/12 dispositions** are explicitly carried unchanged, including four accepted CB returns. CS16 stays commentary-assisted; CS18/e13 stays partial; e14's broad city arc is not newly primary-certified.
- Thus **11 changed objects: 10 conform, 1 partial** when the CS04 label is included. Geometry and broad pack-selector/earliest-appearance limits are not resolved by prose narrowing.

## Finite next handoff and Known gaps

Return to **fixing / claude** for (1) DWR-B's transition/destination guard and its state assertions, (2) the exact CS04 label replacement or a primary-source justification. Preserve DWR-A closure and all accepted text changes. Return the exact new SHA and relevant tests; reconcile branch conflicts without treating unreviewed integration as approved.

Remaining DW06 six-pack/Society source gaps, CS18 partial clauses, sample replacement for Sun Eater/Expanse/Foundation, geometry, earliest appearances and final technical acceptance remain open as previously recorded. Open-ended research stays deferred under R3; this return does not request a restart of that broad audit or interfere with the separate Cosmere book-by-book lane. No new Mckay-only decision is necessary for these two repairs.

**Verdict: changes requested — 1/2 lifecycle groups closed, 1/2 partial; 2 Medium follow-ups. No canon sign-off, merge, deployment or release approval.**

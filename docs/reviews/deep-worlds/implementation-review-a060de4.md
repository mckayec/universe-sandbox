# Deep Worlds R0 implementation review

**R0-2 is closed for the opted-in fixture at `a060de4263ec88870854ed9590da5192d6c35f24`.** Claude can prepare the technical disposition for this engine-only candidate. Mckay’s D10 selected its scope. Release approval is a separate decision. The deferred narrative and Society work has no new canon disposition. [PR #53](https://github.com/mckayec/universe-sandbox/pull/53) · [Previous finding](implementation-review-6f78d98.md) · [Fix receipt](r0-2-fix-a060de4.md)

## Scope and integration

The merge at `f279d9970aae6d88fc32ccc9e904a5eab1c4efb6` has parents `6f78d98c301841277cce325b3c1fb818c048b1a7` and main `5210bbabb43b8b5d00dc9a10d93a6e894fbc4695`. The subsequent fix changes two files, `public/atlas/engine.js` and `tests/atlas-places-fixture.mjs`. I checked the PR diff and Git trees. All 12 candidate changes against integrated main fall in the nine engine/integration paths and the three previously reviewed test-only paths. Shipped packs, Society and simulator content match the base. The 4/4 place modules match their PR37 source blobs. The [scope script](r0-2-scope-check-output.txt) returned FAIL on exactly those three test paths. Record that exception when packaging the candidate. [Full R0 diff](https://github.com/mckayec/universe-sandbox/compare/5210bbabb43b8b5d00dc9a10d93a6e894fbc4695...a060de4263ec88870854ed9590da5192d6c35f24)

## Independent checks

I ran the actual book-click handler, site eligibility functions, cache-key logic and surface-label builder with candidate Dune data and its opt-in fixture. The DOM, route drawing and downstream refresh were stubbed. **3/3 controls behaved as expected** on the same Arrakis mesh:

| Revision and gate | Book II → I → II |
|---|---|
| Candidate, opted in | At I the selected Keep and landmark cleared, every label matched the eligible site set, and Arrakeen and Sietch Tabr remained. The Keep returned at II. |
| Merge parent, opted in | The later-book label and selection survived the downgrade. This independently reproduces the defect before the fix. |
| Candidate, gate off | The old behavior remained. D10 limits the repair to the opted-in engine. |

The engine also checks eligibility during layout and removes hidden labels’ pointer, tab and accessibility exposure. The fixture drove a real Tab sequence in the builder's Chromium run. Its eligibility assertion checks a small set of later-book strings and can pass with zero reached labels. I checked the actual nonempty lists in the raw log against the independently calculated book-I site set. **64/64 logged label occurrences** matched: 18 each in desktop S1/B3 and 14 each on phone. The upgrade assertion proves DOM presence. Focus and visibility on upgrade were outside that assertion.

I reran the prior downgrade, history/cancellation and repeated-destination VM probes. Their unmodified mock environments lack the integrated host's focus-cancellation and route-cleanup functions. With no-op mocks for those functions and an empty label collection in the downgrade harness, the original assertions passed **8/8, 26/26 and 7/7**. These 41/41 checks exercise navigation state. They do not measure rendering or route cleanup.

## Rendered evidence and remaining limits

- The [builder's raw log](r0-2-places-fixture-output-a060de4.txt) records 124/124 predicates at each of 1440×900 and 390×844. S1 and B3 cover direct downgrade and cancellation, including label text and keyboard access. B3 sampled the cancellation 20 times. The [merge-parent control](r0-2-negative-control-f279d99.txt) passed 44/68 and failed 24/68, including later-book exposure. One phone positive-control failure predates the final sheet-lowering harness change.
- Dormancy logs report 138/138 per width, **276/276** total. The receipt records 383/383 units, 30/30 page/viewport cases and one 29/29 Save/Load round trip. The [exact-head CI build](https://github.com/mckayec/universe-sandbox/actions/runs/45954462033) passed format, build, units, distribution, standalone pages and mobile touch. Its workflow skipped deployment.
- Independent rendered reruns were **0/2**. The local Chromium launcher has no executable. No physical-device, GPU or assistive-technology result is available here. The existing qualification for a tree-bearing opt-in fixture still applies. The pre-existing gate-off surface-label issue and the hidden raw site ID on a stale book-I link remain documented.

Claude owns technical sign-off and the separate release packet for this SHA. Keep the three test-path exceptions, the emulation limits and the deferred content scope visible. A PR head change requires review of its delta.

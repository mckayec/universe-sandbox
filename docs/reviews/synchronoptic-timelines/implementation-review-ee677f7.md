# Synchronoptic timelines integration review

**G1 is closed at `ee677f7a2c622cde82f6fc5adc7c84bfb80738ef`.** The integrated candidate satisfies the packet's specified G2 emulation check. Claude can prepare the release decision for this SHA with G3–G9 attached. Mckay retains the release decision. [PR #45](https://github.com/mckayec/universe-sandbox/pull/45) · [Integration receipt](integration-ee677f7.md) · [Previous review](packet-review-420c1e7.md)

## Integration and independent checks

The GitHub merge commit has parents `420c1e77f50c9c34a433f00b4062911cc422c42b` and `5210bbabb43b8b5d00dc9a10d93a6e894fbc4695`. I compared both trees against the candidate. The delta contains 121 non-documentation paths against the earlier candidate, including upstream changes, and 15 against integrated main. Seven final blobs differ from both parents. In addition to the combined engine, CSS, registry and layers test, these include the layers helper, Abrahamic test and timeline test. The browser smoke file matches main and calls its Save/Load helper. [Integrated diff against main](https://github.com/mckayec/universe-sandbox/compare/5210bbabb43b8b5d00dc9a10d93a6e894fbc4695...ee677f7a2c622cde82f6fc5adc7c84bfb80738ef)

The host retains the compact work picker, book-change focus cancellation and route state alongside chapter reset, timeline refresh and focus-preserving range controls. The stylesheet includes both control sets. The registry includes the two released scripture packs and the Abrahamic relationship-source part. The layer suite exercises both the compact book picker and the reachable last year.

I ran **65/65** Node tests from hash-checked candidate files across the timeline model, layers, grounding, sidecar and Standard Works adapter suites. An independent count from the assembled Abrahamic model returned **83/169 dated, 86/169 undated, 129 relationships, 6 connectors with two dated ends and 0/6 crossing lanes**. The real-data fold check consequently exercises no cross-lane pair. The synthetic collapsed-lane and gated-end tests still pass. Real content promotions remain **0/12**.

## Validation evidence

| Check | Evidence and limit |
|---|---|
| GitHub CI | The exact-head build job passed formatting, build, units, distribution, standalone pages and mobile touch. Deployment was skipped. [CI run](https://github.com/mckayec/universe-sandbox/actions/runs/45950153775) |
| Builder integration checks | The receipt records 432/432 unit tests, 127 distribution files, 30/30 page/viewport cases and one passing Save/Load smoke. Raw probe logs report [96/96 layer](tl28-layer-history-output-ee677f7.txt), [194/194 year-history](tl30-year-history-output-ee677f7.txt) and [16/16 handle cases](tl31-year-handle-output-ee677f7.txt). |
| G2 phone keyboard | The required tl31 run contributed 8/8 at **390×844**. The separate [23/23 probe](g2-phone-keyboard-output-ee677f7.txt) asserted exact handle values, readout, range, URL and focus step by step, then exercised dialog entry, traversal and exit at **390×664 CSS pixels**. These are distinct runs on emulated Chromium. No physical keyboard, software keyboard, VoiceOver or WebKit qualification follows. |
| Captures | The [capture log](shots-output-ee677f7.txt) records 4/4 requested sizes and zero runtime errors. The 4K capture was stored at half scale. I verified artifact entries and read the output. GitHub's text reader rejected the PNG bytes and the local Chromium launcher lacks its executable. Independent pixel inspection and rendered reruns in this review were 0/4. |

## Handoff

Claude owns the next implementation-stage action under [packet §4](final-technical-packet-420c1e7.md). Prepare the exact-head release request. Retain unverified pointer/touch drag (G3), device/GPU/AT/performance limits (G4), the off-screen phone entry (G5), partial chapter negative control (G6), future default-off pack validation (G7), untested rendered hidden-surface hash (G8) and bounded adapter/relationship coverage (G9). The separate phone probe placed the entry button at x=384–473 on a 390-pixel viewport. Opening it by focusing it programmatically does not establish discovery by touch. Existing approvals for earlier PRs do not cover #45.

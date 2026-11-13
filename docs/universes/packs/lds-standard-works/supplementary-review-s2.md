# LDS supplementary checkpoint 2 — corrections and phone chooser delta

Reviewed 2026-11-01. Implementation PR33 `47debcfdb86a3e41a023a30e04c6fcd5bd7209b0`; baseline `fe24d334731c1b25c806c2300aa7a23f930babbb`; prior review `e0840462c961181713a8c3fdb03a526ecff66e16`. Builder receipt is `supplementary-implementation.md` on this exact implementation head; latest main status read at `3463f9a` retains fixing/claude. No new source research or full canon reread was needed.

**Verdict:** S1-C1 and the SC04.4 citation recommendation close at source/data level. The compact chooser behaves correctly in the bounded actual-function mock probes; static screenshots support the intended phone layout change. No new content correction found. Native-select, real-keyboard and real-device acceptance remain unverified by ChatGPT. This is not final technical/canon approval.

## Exact content and accounting delta

There are **zero new supplementary records**. Counts remain **111 imported SD rows + seven prose cards**, **1,160 SD rows pending**, 321 total codex cards. Every mapping row was checked; 1,271 SD rows match the accepted research metadata and seven prose rows remain separate. Only SC04.4's mapping locator string changes.

- BXJ12 / SD0086 uses the prior review's minimum replacement verbatim, explicitly including the land of Zarahemla and the intervening land toward Bountiful. Existing sources, book/layer gate and nonspatial form are unchanged. **S1-C1 closed.** Evidence: previously inspected [3 Nephi 3:23–24](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/3?lang=eng), reused here rather than claimed newly retrieved.
- SC04.4 adds `Mosiah 17:1–3` / [official chapter](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/17?lang=eng) to both the card and CSV locators; copy is unchanged. **Citation recommendation closed.** Prior source-check evidence is in [source-checks.md](supplementary-review-s1/source-checks.md).
- All **319 other cards** are unchanged. Restoring those two changed cards to baseline makes the entire pack deep-equal to baseline: sites, coordinates, chronology, routes, events, primary 169-ID / 170-card accounting, Salamis and Palmyra dispositions carry forward.
- The prior full 118-card comparison therefore carries forward with S1-C1 corrected: all 118 now conform to the accepted context within the recorded research limits. This is not a fresh 118-record primary-source audit or full supplementary completion.
- Builder `copy_bom.py` contains both changes. Re-running the unchanged generator in an isolated temporary tree using the exact accepted CSV reproduces the committed pack and mapping byte-for-byte. Source checkouts and application files were not edited.

## Phone chooser source review

`public/atlas/engine.js` adds the labelled `cxPick` select, populates it from the same `K.codex` sections as the buttons, preserves `cxTab`, reuses `renderCodex` and existing layer/book filtering, and resets list scroll position on selection. The focus-trap selector now includes select elements and continues excluding disabled/hidden elements. `engine.css` shows the chooser and hides tab buttons at ≤600 px, with a 44 px minimum control height; wider screens retain buttons. This is generic atlas-engine behavior, not only LDS copy.

The [probe](supplementary-review-s2/probe.cjs) extracts actual codex functions/handlers into a VM with mock element state. It exercises all eight LDS sections; chooser/button synchronization; BoM source visibility and NT/earlier-book exclusion; forward and reverse focus wrap with hidden/disabled controls; opening on Close; Escape and return to the Codex button. All pass. CSS breakpoints are inspected as source, not executed layout. The mock does not model native option menus, browser focus retention while option HTML is rebuilt, assistive technology, or resizing through 600 px.

**Remaining finite technical checks for Claude:** phone native-select keyboard operation, reverse Tab with the chooser visible, focus retention after selection/re-render, resize across 600/601 px, screen-reader label/option announcements and real-device behavior. The chooser's DOM position precedes Close while CSS order places it below the header; verify that focus order remains understandable. This is a testing requirement, not an established accessibility failure. Generic pack smoke checks do not by themselves exercise every pack's codex chooser.

## Reproduction and actual validation

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s2/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s2/accounting.py
node --test /path/to/47debcf-checkout/tests/lds-pack.test.ts /path/to/47debcf-checkout/tests/atlas-layers.test.ts
```

Results: [probe-result.json](supplementary-review-s2/probe-result.json), [accounting-result.json](supplementary-review-s2/accounting-result.json), [23/23 targeted tests](supplementary-review-s2/targeted-tests.txt). Initial probe development incorrectly keyed unkeyed cards by nonunique display names; fixed by ordered card comparison before recording passing results. No application defect was inferred from that harness error. Prior source/gate inventories were reused where exact data equality warrants it; no repeated full research validation is claimed.

## Rendered evidence and remaining scope

Inspected the two committed screenshots `shots/s2-codex-390x844.png` and `shots/s2-codex-1440x900.png`. The phone capture visibly replaces the stacked tab wall with one chooser and exposes considerably more content with Close visible. The desktop capture retains the buttons. These are builder-supplied static images, not independent interaction certification. Builder reports eight options, selection synchronization, forward Tab containment, Escape/focus return and no console errors under SwiftShader. Builder explicitly did not test reverse Tab, VoiceOver or real devices. No browser/server workaround was used by ChatGPT.

Exact-head implementation CI `41282045209` and this review's documentation CI are followed to terminal outcomes and recorded in the main handoff/publication response. CI success does not supersede the native-select, final same-head rendered/technical, real-GPU and owner release gates.

Claude retains fixing ownership and can continue SC08 onward now. Complete the remaining 1,160 SD mappings and required prose/consolidations, preserving SC55–62 dense-reference dispositions, then return the changed head for content/accounting review. This checkpoint resolves prior review feedback rather than adding imports. No code edit, PR approval, merge, deployment or release is authorized by this report.

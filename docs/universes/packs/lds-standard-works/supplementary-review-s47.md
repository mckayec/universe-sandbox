# S47 — checkpoint 48 focus and label-edge delta

Audited implementation: `6b8684523d9c67f3a241e637d48df2737e7b81cb`; baseline `5c7edcd824e7657ae0010c9d3943a753d478f899`. Prior review: S46 at `688b82334407c035a49644a5d01330e134d91242`. This is a bounded independent source/evidence review, not release approval for the atlas of The Church of Jesus Christ of Latter-day Saints. Claude retains implementation ownership. Parallel research and timeline work need not wait.

## Disposition

- **S46-C1 original missing-recovery path corrected at source level.** `layoutSiteLabels` checks the active element before hiding it; `recoverLabelFocus` prefers the matching gated row, then navigation controls. Unrelated focus and selection are not mutated. Builder evidence supports row/grab recovery and a separate committed-build landscape fallback. Complete visible-target/keyboard acceptance remains open as described below.
- **S46-C2 original selected right-edge example corrected.** Extracted production logic at x=385, width=390, full width=110 now flips left (x0=282), rather than extending to the right. Measured widths replace the original estimate once available. This does not certify all edges, long names or tooltips.
- No pack, citations, imports, semantic ledger or omission dispositions changed. Inherit prior accepted evidence and outstanding semantic gates; 1,271 imports are not newly reviewed or newly integrated here. No new finished 4K capture.

## Remaining corrections and bounded evidence requests

**S47-C1 — visible focus target must account for clipping containers.** `visibleControl` checks the viewport, the element's style and hidden/aria-hidden/inert ancestry, but not scroll-container clipping or ancestor opacity/visibility. A row can have an on-viewport rectangle while outside the visible portion of the scrolling dossier. `focus({preventScroll:true})` would not reveal it. This is a source-level gap, not a reproduced browser failure. Intersect candidate bounds with relevant clipping ancestors (and effective visibility), or use a known visible navigation fallback when the matching row is clipped. Test a matching row scrolled outside the dossier's visible area, collapsed sheet, and unrelated focused control. Recovery must leave focus visibly discoverable without silently changing selection. Do not certify a row merely because it intersects the viewport.

**S47-C2 — finish both-edge and long-name protection.** Extracted current logic at x=2, width=390, full width=110 reports show=true, dot=false, x0=-5: the full button box is still partly outside the viewport. This establishes a source geometry gap, not necessarily clipped name glyphs in a rendered screenshot. At x=195 with full width=430 neither side fits and selected-dot fallback is exercised. CSS `.plbl.dot.edge:hover .tx` / `:focus-visible` anchors a nowrap tooltip `right:24px` without a viewport width limit or clamping; leftward placement alone cannot fit a tooltip wider than the screen. Preserve the selected marker/name via a bounded, wrapping/clamped accessible presentation or deliberate suppression with a visible equivalent. Test measured button, text and focus-outline bounds at both edges, long names, focus/hover and orientation changes. The existing sweep logged dot=0, so it does not cover this fallback. Do not count these extracted cases as rendered reproduction.

**S47-A1 — evidence precision.** The builder's 28-check full run predates the added header fallback. Only the four-check rotation rerun is explicitly recorded at the committed build. The full-run log's initial rotation left focus on body; that is historical, not evidence the returned fallback failed. Focus was set programmatically; it is not Tab traversal. Recheck changed focus behavior with actual keyboard traversal on the final head. Keep inherited checks separate from same-head execution.

## Builder answers

1. A visible header home link is acceptable as a last-resort focus destination, provided focus alone never activates navigation and a visible in-atlas equivalent is preferred. The rotated supplied image shows a visible ring on that link. This is not proof of actual Tab traversal or complete landscape usability.
2. The both-sides-too-narrow case remains a required check; the source probe reaches it, but tooltip containment and accessible name discovery require rendered testing. No new source/canon research is needed to implement the bounded presentation.
3. The landscape screenshot has very little globe area and a clipped heading. Preserve that known compact-layout limitation; do not label the image final device acceptance. Existing 119/120/121 px framing-boundary tests and non-Earth Space/galaxy framing evidence remain open.

## Evidence and validation

Independent: inspected all eight changed paths, engine JS/CSS delta, builder probe/output and three image pixels; ran `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts` at the implementation head: **63 passed**. Saved output and reproducible pure-JavaScript extraction probe are in [supplementary-review-s47](supplementary-review-s47/). Three geometry cases assert the returned right-edge fix, left-edge residual and selected-dot fallback. Static assertions confirm active-element recovery guard. No DOM, browser, server or GPU probe was run by this reviewer. These unit tests do not exercise the new DOM measurement/focus behavior.

Builder-only: normal/reduced-motion 49-step Jerusalem sweeps, row/grab recovery, Expanse descent and rotation rerun; `pnpm check` 137 tests, `test:pages` 13×2 and `test:browser` pass as reported in checkpoint 48. Supplied images: `s48-sweep-end-390x844.jpg` shows the sheet open and selected Jerusalem row; `s48-rotated-844x390.jpg` shows header focus ring and CHARTING SURFACE; `s48-expanse-390x844.jpg` shows Venus label and CHARTING SURFACE. The latter two are loading-state captures, not finished bakes or physical-device evidence.

Independently queried [implementation CI 41612886711](https://github.com/mckayec/universe-sandbox/actions/runs/41612886711): build success, including formatting/build/unit/dist and standalone-page browser check; deploy skipped. That workflow does not independently establish the separate builder `test:browser` claim. Fresh PR metadata: exact head matches, open/unmerged, mergeable true at query time; no merge performed.

## Remaining release gates

Return S47-C1/C2 evidence, same-head actual keyboard/native-select/focus paths, framing boundary and cross-pack checks, finished 4K capture and final technical/rendered evidence. Physical-phone and real-GPU evidence remain unavailable here; SwiftShader/emulation and screenshots cannot replace them. Wider semantic omission/vision and required integration gates remain inherited, not closed by unchanged row totals. Preserve specific-PR owner approval. No approval, merge, deployment, scope reduction or release is granted. Follow-on basemap/timelines/Cosmere remain nonblocking.

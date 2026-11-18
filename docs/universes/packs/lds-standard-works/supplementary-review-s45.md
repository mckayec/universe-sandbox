# S45 — The Church of Jesus Christ of Latter-day Saints: finished-render evidence

Reviewed PR33 `421a5bc0a65323a06bafd8c694f106823b71f1ff` against `4aa6571c45bd6cc9063e77c57f7a40156e0a4c26`; prior review `6cc8388f32e6b5a719a8488924075fbd483563b6`. This is an evidence-only follow-up to builder checkpoint 46, not final rendered or release acceptance.

## What now has evidence

The exact five-file delta adds two JPGs, a probe, its output and receipt text. All application code, pack data and tests are unchanged. The builder tested runtime 4aa6571 is byte-identical to this head. No repeated source audit or redundant local unit suite was run: prior 63-test/source findings carry forward explicitly.

Actually inspected `s46-finished-1280x800.jpg` and `s46-finished-390x844.jpg`. Neither shows the charting-surface indicator. The 1280 capture shows readable place labels, breadcrumb, controls and side panel in the captured state; no obvious new text collision was found there. The 390 capture shows readable breadcrumb text and an open details sheet, but globe-label fragments remain visible around its surrounding chrome.

The supplied log records observed bake-hidden states at 237 seconds (390) and 1704 seconds (1280), no horizontal page overflow and matching canvas dimensions at DPR 1, ending **PASS**. The probe is the earlier s42 script with only its header and screenshot names changed; the saved verification script proves this and the runtime equality. Therefore the formerly missing 1280/390 finished-bake captures are now supplied for this exact runtime. This closes that evidence-delivery subtask, not mobile usability or all rendered gates.

## S45-V1 — confirmed existing phone-label occlusion (builder S46-O1)

The 390 image visibly contains the trailing part of Syracuse at the far left beside the breadcrumb and a partial Philippi label between the canon tabs and controls. These are partial labels behind foreground UI, not evidence of wrong coordinates. The builder's opacity count of 21 labels does not test occlusion, complete bounds, hit-target exposure or keyboard reachability. This is independently confirmed from supplied pixels; no browser was run here.

The proposed compact-layout occlusion fix is reasonable: suppress an entire globe label when its displayed bounds intersect active top controls, breadcrumb or details-sheet bounds, rather than leaving fragments. Keep map coordinates and source data unchanged. Use actual visible blocker rectangles and update after viewport/header/sheet changes, camera movement and label placement. Restore labels when unobstructed. Avoid a global z-index increase that paints labels over controls.

Acceptance requirements for Claude's returned implementation:

- Exercise 390 and other supported compact widths with details sheet open/closed, selection changes, rotated/zoomed camera, layer/year filters and orientation changes. Confirm no clipped fragments and no flicker from alternating hide/show decisions.
- Hidden/occluded labels must not retain invisible click or Tab targets. Keep equivalent gated, named place actions available through the side list; do not drop an active focused element without deliberate focus recovery to the corresponding visible control. A selected place must remain discoverable.
- Check unoccluded labels reappear and remain operable, and desktop labels are unaffected. Return representative screenshots plus actual keyboard/touch checks, not opacity counts alone.

This is an implementation recommendation within the existing usability work, not an application edit or a new source-research dependency. Claude can proceed in parallel with semantic research.

## Checks and limits

`python docs/universes/packs/lds-standard-works/supplementary-review-s45/verify.py` verifies exact SHAs, five-file docs-only scope, unchanged public/test trees, probe-copy differences, recorded viewport dimensions and terminal PASS. Results saved alongside this report. Exact-head [implementation CI 41589069678](https://github.com/mckayec/universe-sandbox/actions/runs/41589069678) completed success, build passed and deploy skipped. Pages CI is not separate full browser-smoke or hardware acceptance.

The new run used only VPS=390,1280, so the probe's keyboard-traversal block (1440 only) did not run. No new full keyboard, native-select or focus-outline clipping evidence is supplied. The finished helper waits for bake-hidden plus a delay, but does not independently assert the absence of camera animation. Error collection inherits the earlier graphics/software-WebGL console exclusions; do not promote it to an unrestricted all-errors certification. These are SwiftShader/emulated viewports, not physical-phone/real-GPU tests.

## Remaining gates and handoff

Still open: S45-V1 phone-label treatment; final 3840 finished-bake evidence; S44-A1's accurate programmatic-focus wording and actual narrow-screen Tab/focus checks; wider source-vision and semantic omission accounting; final same-runtime technical/interactive and real-hardware evidence; specific-PR owner approval. The 1,271 import total and 146 summary-level omission dispositions are unchanged. Preserve Claude ownership/locks, parallel timeline/research and nonblocking follow-ons. No approval, merge, deployment, application change or new research wait.

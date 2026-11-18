# S46 — The Church of Jesus Christ of Latter-day Saints: compact labels and framing

Reviewed PR33 `5c7edcd824e7657ae0010c9d3943a753d478f899` against `421a5bc0a65323a06bafd8c694f106823b71f1ff`; prior review `df572572c5b4af07b4af410329fc0789987272fd`. Covers builder checkpoint 47. Verdict: reported fragments disappear in supplied states, but S45-V1 is not fully closed; focus recovery and selected-edge coverage remain actionable. No release approval.

## Delta and verified improvement

Only runtime `engine.js` changes. Pack/canon, CSS, imports and semantic dispositions are unchanged. Compact layouts now hide site labels in horizontal chrome bands, collapse nonselected right-edge names to markers, and frame cameras within the remaining vertical globe area. View-offset easing and two additional ResizeObserver targets are generic engine changes; they need broader regression evidence than one pack's initial view.

Actually inspected all four supplied JPGs. The 390 sheet-open capture no longer has Syracuse/Philippi fragments around the controls; collapsed-sheet and index-open captures show complete labels in the open area, and the 768 capture shows readable labels below the filters. The 768 capture still visibly says CHARTING SURFACE; it is not finished-bake evidence. No new 3840 finished capture exists in this delta.

Builder log ends PASS: 390 finishes baking, then reports zero labels while no globe area is open and 16/17 visible after sheet/index changes; 768 reports 10/21; 1440 reports 21. Desktop band overlaps are informational and deliberately unasserted. This is useful supplied SwiftShader evidence, not independently executed browser testing, full keyboard coverage or real-device acceptance.

## Remaining findings

**S46-C1 — recover focus when a compact label is suppressed.** `layoutSiteLabels()` changes opacity to 0, pointer-events to none, tabindex to -1 and aria-hidden to true, but never checks whether that label currently owns focus or transfers focus. Removing an element from sequential Tab order does not itself move existing focus. Dynamic sheet/header changes, resizing or rotation can therefore leave the active label invisible/aria-hidden. The requested S45 acceptance explicitly included safe focus recovery, and no new keyboard probe covers it.

Before suppressing the actively focused site label, deliberately transfer focus to an equivalent visible, enabled, correctly gated place control in the side list; if none is available, use a predictable visible navigation control and retain selected-place context. Do not focus an offscreen/closed-sheet row merely because it exists. Avoid moving focus when the disappearing label is not active. Return actual keyboard checks through sheet toggles, viewport/orientation changes and filter/camera changes, including selected/filtered-out cases. Preserve side-list action equivalence.

**S46-C2 — selected names bypass the new edge protection.** `edgeDot` is guarded by `!sel`; selected names remain full width. The extracted production decision logic allows a selected label at x=385 on a 390-wide viewport, estimated right=495, to stay shown as full text. This is a source-level counterexample to the blanket no-edge-fragment claim, not a newly captured browser screenshot. User camera movement can place a selected site near an edge; the initial centered screenshots do not exercise it. Use measured/clamped placement, a safe selected-label marker/tooltip alternative, or whole-label suppression with an accessible selected-place counterpart. Test both edges and long selected names under rotation/zoom; ensure no altered coordinates or lost selection.

The existing geometry uses `name.length * 8 + 30` and a fixed 24px height, not actual label bounds. Treat that as an estimate, especially across fonts/packs. The returned browser probe measures actual boxes in selected states, but does not prove all names/states obey the estimate. Avoid alternating show/hide placement or focus churn during offset easing.

## Builder questions

(a) Hiding the selected label when covered is acceptable: covered text is not a useful map affordance. Selection must remain discoverable in a visible accessible control, and S46-C1 focus recovery must be implemented. No geographic/canon objection.

(b) The 120px threshold is a reasonable initial layout heuristic, not a researched universal minimum. Keep it provisional; test 119/120/121px open areas, long labels, expanded controls and both reduced-motion states. Ensure a selected place remains reachable when the fallback shift leaves no label in view. No new owner preference or initial research wait is needed for this bounded validation. Because framing also changes galaxy-view cameras in compact mode, include a non-Earth pack and Space/Earth transitions in cross-pack checks. The claim “desktop unchanged” is bounded to the existing MOB classification; short coarse-pointer screens can take the compact path.

## Independent checks, CI and conflict report

- Exact-head `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`: **63/63 passed**, log saved. These existing tests do not exercise the new DOM occlusion/framing paths.
- `node docs/universes/packs/lds-standard-works/supplementary-review-s46/probe.cjs`: five cases execute extracted production label-decision expressions in a pure VM, reproduce the selected-edge gap, check absent focus recovery and exact runtime-file scope. No DOM, browser or server execution; no rendering claim.
- Exact-head [implementation CI 41597176471](https://github.com/mckayec/universe-sandbox/actions/runs/41597176471) completed success. Pages CI is not full separate browser-smoke/hardware acceptance.
- Fresh GitHub lookup reports **mergeable true** at 5c7edcd. Against fresh main **e59f9b62d2106af7a93f0725b65afec63295732c**, `git merge-tree --write-tree --name-only` returned 0, no conflict paths, tree `f6ebc6f03f07ac3d49e71920a1af8055a92ea65a`. No branch/worktree merge occurred. The reported earlier false state is not reproduced; its cause remains unknown. Recheck before any later authorized merge.

## Next handoff

Claude can address C1/C2 and return the focused keyboard/edge/cross-pack matrix while continuing semantic research in parallel. The 1,271 imports and 146 summary-level omission dispositions are unchanged. Still open: 4K finished capture, wider semantic omission/vision accounting, actual final keyboard/native-select/focus evidence, real-GPU/physical-phone testing and specific-PR owner approval. Preserve ownership/locks and nonblocking follow-ons. No application edit, approval, merge or deployment performed.

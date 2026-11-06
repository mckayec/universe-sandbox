# S41 — The Church of Jesus Christ of Latter-day Saints: returned S40 corrections and checkpoint 42 evidence

Implementation reviewed: `52507fc725d1d4834aaf34449fedec685df28590`; baseline: `66c87095778b29b86e4750e48e8b9596dc21af10`. Prior review: `2ed94d48df86c26b7cbd1aa51fc0bc5a287bbe1c`. This review covers builder checkpoints 41–42. No final approval or release sign-off.

## Verdict and coverage

**S40-C1 closes within its specified scope.** The crosswalk now distinguishes keyword candidates, semantic classes and inherited family membership. All 13 enumerated Revelation children and four additional Ezekiel children are present. All 21 children across the two vision families preserve their own first source locator, gate and undated/nonspatial disposition. The generator checks unknown families and unclassified keyword candidates. Contrast-only BXP01/BMV-202 and category-label-only AE09/AE10 are correctly separated as not-vision. The new classification is explicitly about built card wording, not new primary evidence or an exhaustive source search.

**S40-A1 closes.** The receipt now acknowledges the two First Vision cards' narrated filter year while retaining the reception-location versus vision-content distinction. S40's attributed date answer remains accepted by unchanged runtime/source evidence.

Structural coverage: all **154 unique crosswalk rows**, with all 137 prior identities, gates and date fields preserved, plus exactly 17 inherited-only children. There remain 96 keyword candidates, 21 inherited children (four overlap keywords), and 25 not-vision classifications. Date classes remain documentary 8 / narrated 4 / synthesis 11 / site-period 12, with 119 no-year rows. The 35 date-bearing entries are unchanged. Semantic checks focused on the requested children, contrast/category false positives, family logic and stated scope limits; this is not independent primary-passage verification of every new class. The 19 section-card not-vision labels are claims about their wording, not findings that the underlying sections contain no visions.

No application file changed. All cards, links, gates, coordinates, dates and import/omission ledgers remain byte-identical to S40. All 1,271 imports remain accounted, and all 146 summary-level omission dispositions remain unchanged. Wider source-vision/omission completeness remains open; neither 154 rows nor zero unclassified candidates closes it.

## Builder answers

**AE09 / AE10:** use these exact minimal replacements, retaining existing sources and 2/nt gates:

- AE09: “New Testament narrative — Matthew narrates Jesus’ prayer at Gethsemane before his arrest.” Source: [Matthew 26:30–57](https://www.churchofjesuschrist.org/study/scriptures/nt/matt/26?lang=eng).
- AE10: “New Testament narrative — Matthew names Golgotha as the place where Jesus is crucified.” Source: [Matthew 27:33–35](https://www.churchofjesuschrist.org/study/scriptures/nt/matt/27?lang=eng).

Only remove the ambiguous `/vision` category suffix. This reuses accepted source evidence and unchanged substantive copy; no new historical verification or fresh primary retrieval is claimed. Regenerate the crosswalk afterward: these two entries should no longer be keyword candidates merely because of a category label, and the fixed SEM candidate assertions must be updated accordingly. Do not retain artificial vision keywords to satisfy a count test.

**Keyboard order:** favor a logical DOM/focus order with primary navigation and controls before the globe-label group, preserving all current actions and visible focus. Do not fix order with positive tabindex. Making duplicate label buttons non-tabbable is acceptable only after demonstrating that each visible/available label's action remains reachable through an equivalently gated, named and usable side-list control at every relevant layer/year/selection state; do not assume duplicate text proves action equivalence. Recheck forward/reverse traversal to actual wrap, opening/closing Codex, return focus and narrow-screen section selection. This is canon-neutral implementation guidance, not permission to discard accessibility coverage or proof that the current order violates a particular standard.

**Unidentified JERUSALEM text:** the supplied finished screenshot visibly contains a separate spaced-capitals label near x 805–875, y 123, away from the highlighted site label near x 655–729, y 453. Its identity and anchor are not established by pixels. Inspect the responsible label element/class, source record, projected anchor and camera state before changing data or applying a layout offset. Check whether it is a world/region/site/route label, then test settled selection and distant-start transitions. Do not move Jerusalem's geographic coordinates to align a UI label. This remains the builder's existing observation, not an independently diagnosed new anchor defect.

## Verification and supplied rendering evidence

- Exact-head `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`: **63/63 passed**; log saved alongside this report. Generator-in-test leaves the implementation checkout clean.
- Independent `python docs/universes/packs/lds-standard-works/supplementary-review-s41/verify.py`: exact seven-file scope; application/import/omission equality; all prior CSV identities/gates/dates; exact 17 added children; all 21 inherited children; two isolated byte-identical crosswalk reproductions. Results saved. No browser/server/DOM execution here.
- Exact-head implementation [CI 41555260125](https://github.com/mckayec/universe-sandbox/actions/runs/41555260125) succeeded. Pages CI is not separate full browser smoke or hardware acceptance.

Actually inspected `shots/s42-finished-1440x900.jpg`, the probe source and complete terminal log tail. The screenshot shows the finished globe with readable side panel and site labels; the displaced text noted above remains visible. Builder evidence was captured at `0a853f68779b32c1ca4f41f45f6142a1d6cae445`; every public runtime file is byte-identical at reviewed head 52507fc, so that runtime evidence carries forward explicitly, not as a newly executed test at the final documentation SHA.

The log records 80 forward stops, reversed traversal, 25 modal Tab stops, modal boundary wrap and Escape return focus, then observed bake-hidden state at 1440×900. These are meaningful partial desktop checks. The forward loop reached its cap rather than full wrap. The probe's on-screen test checks intersection, not full visibility or absence of occlusion; its ring check accepts computed outline/box-shadow and is not a contrast audit; its name check is not a complete accessibility-tree audit. A helper WeakMap is stored on `window`, although no DOM content is rewritten. The finished helper checks bake-hidden, not an explicit no-camera-motion assertion, despite its comment. One initial focus setup is programmatic before reopening Codex.

The overall multi-viewport process **did not reach terminal PASS**: it was stopped while waiting for 4K baking, with a target/context-closed error. Do not present this as a fully passed browser suite. The receipt candidly carries 4K/1280/390 finished captures. The partial 1440 observations survive, but a separate completed run is needed for a clean terminal error summary. All evidence uses SwiftShader/emulation, not physical-phone or real-GPU testing. No independent rendered acceptance is granted.

## Next handoff and gates

Claude can implement the two source-category edits and keyboard-order improvement, identify the displaced label and continue the wider semantic omission/vision work in parallel. No initial ChatGPT research wait is imposed. Retain final same-runtime evidence for full keyboard traversal, narrow-screen/native-select interaction, completed 4K/1280/phone rendering and actual real-GPU/physical-phone testing (or an explicit owner decision about those unavailable gates). Preserve Claude ownership/locks, parallel timeline research and all nonblocking follow-ons. Specific-PR owner approval remains required. No application edits, formal approval, merge, deployment or release performed.

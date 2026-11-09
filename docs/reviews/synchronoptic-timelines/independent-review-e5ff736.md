# Checkpoint 23 independent review — host-validation evidence

Reviewed 2026-11-08. PR45 `engine/timelines`, exact head **e5ff736d51c1114570ea07ab671278af85179ada**. Current PR head read and matched. Compared against previously reviewed **5228e3564e61e3721faf16a00fccfe2913c8c10b**; this is the review baseline, not the direct parent. The intervening commits are bc12a8f29bd26bd01531d171f13e2b4522aa83b2 and e5ff736d51c1114570ea07ab671278af85179ada.

Inputs: [checkpoint 23](checkpoint-23.md), [prior review](independent-review-5228e35.md), [probe](tl23/host-layer-probe.mjs), [saved output](tl23/host-layer-probe-output.txt).

## Bounded verdict

Accept the improved test design for host layer-handler transitions and exact record-ID set membership. **Do not certify the 68/68 rendered checks as independently executed.** Return **implementation / claude** with one small predicate correction, the documented real-input/URL limitations, and the next planned bounded chapter-selector work. No application or canon change is in this checkpoint.

Inspected **3/3 changed files** and their full contents/diff across the two-commit return: report, probe and terminal output. GitHub compare shows only these documentation/evidence files; `public/`, `src/` and `tests/` are unchanged from 5228e35. Full 159-test-suite and browser results remain builder-attributed; unchanged application tests were not redundantly rerun.

## Independent checks and evidence boundaries

- Verified **3/3 local Git blob hashes** against pinned inputs: head timeline model `9ac4d24df05e269c8639cecfc3ae76003387b4e1`, head engine `75f12a0d91840b7bf91c408b41452454b3f6a3a7`, and PR33 pack `3d279a757303e6ae7e80c358a6f6e041269eb82c`.
- Computed model filtering independently in Node from that pack and actual adapter: **5/5 named state counts match** (three distinct filter combinations). All 1714 records/342 edges; NT off 1428/316; NT on 1714/342; the fresh-load target state 1428/316; OT-only book state 526/52. This verifies model counts, **not DOM rendering or URL restoration**.
- [Extracted-predicate controls](tl23-review-predicate.cjs): **3/4 pass**. Valid input accepted, missing ID rejected, extra ID rejected; duplicate row incorrectly accepted. This executes the unchanged committed `setEqual` predicate with controlled summary inputs.
- A fresh local Playwright launch using installed `/usr/bin/chromium` failed before any page: `FATAL:chrome/browser/process_singleton_posix.cc:297 ... socket() failed: Operation not permitted (1)`. **0/68 host-browser checks executed independently.** Full built dist was not prepared after this prerequisite failed.
- Inspected builder output contains **68/68 PASS assertions** over four width/variant combinations and **20/20 logged exact-set comparisons**. Those remain inspected builder evidence. Real-click output is separate INFO: two 390-width opens (~7.8–8.2 s) and Escape closures (~0.7 s); both 1440-width click attempts time out. No hardware performance or assistive-technology claim.

## Findings / dispositions

| ID | Disposition |
|---|---|
| TL22-E1 | The missing layer-handler test is now supplied: the actual host NT chip handler is activated off/on; record, selected detail, search and URL state are checked. Close the **missing-test-definition** gap, while retaining execution/input qualifications. The timeline covers the chip at both tested widths (`topIsChip:false`), and DOM `.click()` bypasses this. A real user close → toggle → reopen sequence is not independently validated and is not demonstrated by these hidden-chip activations. |
| TL22-E3 | Exact record-ID set membership replaces the weak thresholds and rejects missing/extra IDs. Accept that improvement. Relationship header and list count are compared with the gated model count; this is count equality, not edge-identity equality. Add the duplicate assertion below before claiming uniqueness is enforced. |
| TL23-E1, Low | `setEqual` checks `distinct === expected` but never `rows === distinct`. A DOM containing IDs [a,b,b] for expected [a,b] passes. Add row-count equality and positive/missing/extra/duplicate negative controls. Current logs happen to show rows equal distinct, so this is a test-strength defect, **not evidence that current UI rows are duplicated**. |
| TL22-E2 | Still open for real input/focus/navigation and performance qualification. The measured phone-width observations improve disclosure; desktop timeout remains incomplete evidence. Do not count INFO attempts as extra PASS assertions or attribute the timeout exclusively to hardware without a controlled comparison. |
| O-1 | Retain the explicit URL-restoration limitation: same-document hash navigation applies tl/tlsel but does not apply layers; a fresh document load does. The about:blank reset validly tests fresh load, but cannot close same-document layer restoration. “No leak” here is relative to unchanged in-memory filters, not proof that the requested URL filter was honored. No independent browser reproduction or new product regression is claimed. |

## Next bounded return

1. Correct TL23-E1 in the probe and run the four controls. Preserve honest simulated-input labeling and retain the existing logs.
2. Continue the planned chapter-selector checkpoint with book/chapter/layer downgrade and selection/detail/search/URL fail-closed checks. Keep no-selector behavior fail-closed and **0/12 real relationships promoted**. Folded-row connectors remain a later bounded unit.
3. Keep the real close/toggle/reopen path, same-document filter restoration, real pointer/keyboard focus/navigation, mobile 1714-row performance and device/AT checks on the explicit validation list. Obtain qualifying evidence when a usable environment exists; do not label these complete merely because model or DOM-handler tests pass.

No new source claims researched or accepted. Immutable edition/provenance and prior relationship identity/source holds remain. The PR33 integration, full technical qualification and Mckay's release approval remain separate open gates. No PR branch edit, merge or deployment.

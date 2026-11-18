# LDS checkpoint 27 — evidence-only successor

Reviewed PR33 **3e1f46091306c136610758a92a52589ac9a5e9f4** against code/audit baseline **6bf2812973995956e60cd3dc20472feb269cf916**, on 2026-11-02. This is a five-file documentation/evidence delta: four JPGs and 49 added receipt lines. [Reproducible scope and image-byte verification](supplementary-review-s27-evidence/verify.py), [result](supplementary-review-s27-evidence/verification.json). Application code, source data, tests, generator, mappings and crosswalks are identical. Inherit [S27](supplementary-review-s27.md) without repeating the unchanged 1,271-import research, 49 tests, 71,712 gate cases or two generator runs; those are prior-head results, not fresh executions here.

## Disposition

- **S26 Moses 7 guidance stays closed.** No source-copy, identity, navigation or work-gate change.
- **S27-C1 remains open.** No callback-cancellation implementation changed. Main status correctly names it as Claude's next unit and retains fixing/claude ownership. The builder's two passing race cases do not include the reopen-then-close sequence that restores Codex-button focus before the queued callback overrides it. Retain the S27 reproduction and cancellation acceptance requirements.
- **S25-V1: completed-frame evidence gap closes for this supplied SwiftShader capture; visible transition defect and real-GPU acceptance remain open.** The moving image still contains Old World labels over North America. No final rendered sign-off.
- No new BMC quotation/vision, DRE office-succession, timeline/source-vision or omission/consolidation implementation. All 1,271 imports remain accounted; zero new imports and zero newly completed integration categories.

## Four actual images inspected

All images are under `docs/universes/packs/lds-standard-works/shots/` at the reviewed SHA; byte hashes are in the verification artifact.

| Image | Pixel evidence and limits |
| --- | --- |
| `s27-event-completed-1440x900.jpg` | North American labels include Salt Lake Temple, Nauvoo, Palmyra and highlighted Kirtland Temple in the corresponding region; **no “Charting surface” indicator**. The Kirtland dedication event is open. Supports the supplied finished-state appearance, not an independent execution of the completion predicate or a real-GPU claim. |
| `s27-event-moving-1440x900.jpg` | Rome, Puteoli, Philippi, Babylon and other Old World labels visibly overlay North America; “Charting surface” remains visible in this frame. This is not a finished-state screenshot. The visible misassociation remains actionable regardless of target-opacity measurement. |
| `s27-zion-link-1440x900.jpg` | Focus outline on the PGP Enoch city card; distinct D&C/PGP views and both source-discussion/cross-account labels are readable. Static focus appearance does not certify full keyboard traversal. |
| `s27-zion-390x844.jpg` | PGP-only city card and Moses 7 discussion link fit the modal; D&C view is named as filtered with no active link. Native chooser is visible. Emulated viewport screenshot is not physical-phone selection or touch evidence. |

## Receipt versus measured coverage

The new receipt explicitly reports the S27 probe **passed after 48 minutes**, with no console errors or failed/≥400 resources (apart from filtered SwiftShader driver notices). It reports 252 alignment samples, including one mid-turn, a completed-state predicate, worst 0.00 px, 13 completion labels, the two race cases, D&C-only sections and emulated phone tap. This is now a terminal **builder-reported probe result**, not merely a proposed script. No standalone raw stdout/samples file is added in this delta; neither this reviewer nor CI independently reproduced that probe.

The 0.00 px number measures only labels whose inline **target opacity** is at least 0.5 (`s27-probe.mjs`, `alignment`). It excludes labels with target zero even while CSS transitions leave them visibly fading. `engine.css:164` applies `opacity .25s` to `.plbl`; `layoutSiteLabels` sets target opacity to zero for hidden labels but updates transforms only when `show` is true. This supports the builder's fade explanation at source level, without making the visible labels geographically correct. Recommended receipt wording: **“Intended-visible labels measured 0.00 px; fading-out stale labels remain visibly misassociated in the moving frame.”** Do not generalize that metric to every label a user can see. The reported one moving sample addresses S27's zero-moving-sample concern for this run only; keep an explicit nonzero-sample assertion in future probes.

The receipt reports local `test:pages` did not finish within 10 minutes while sharing CPU with this probe. That is a local timeout, not a passing run or proof of a product defect. The prior code head passed CI pages; the current evidence-head run is [41401550949](https://github.com/mckayec/universe-sandbox/actions/runs/41401550949), with terminal result recorded in the main handoff after publication. **`test:pages`, `test:browser`, and `s27-probe.mjs` are three different checks.** No new terminal `test:browser` result is supplied. No reviewer browser/server execution.

## Exact next actions and dependencies

Claude: fix S27-C1 through actual pending-focus cancellation/invalidation, preserving normal activation; address stale labels after large view jumps and capture both moving and completed states. Include visible fading labels in the evidence assessment; retain the fade for ordinary motion if safe. Since the engine is generic, check galaxy labels as well as surface labels/routes. Then complete the already-open BMC/DRE/timeline/source-vision and omission/consolidation crosswalk with exact IDs and source-role decisions. These tasks do not need another full import research pass.

Final same-head 4K/1280/phone readability, Tab/Shift-Tab/activation/Escape/focus return, physical-phone native-select/touch and real-GPU moving/settled alignment remain. The builder now explicitly identifies hardware access as unavailable to its cloud runner; an authorized tester with physical phone/real GPU must supply that evidence, or the owner must explicitly resolve that acceptance limitation. This is a genuine external evidence dependency, not a new owner approval request from ChatGPT. Emulation cannot be relabelled as hardware evidence.

ChatGPT rechecks returned changed code/evidence; specific-PR owner approval follows completed acceptance gates. Claude's code, ownership, status and lock management are preserved. Basemap, synchronoptic timelines and Cosmere remain separate post-release/nonblocking tasks. No application edit, approval, merge, deployment or release.

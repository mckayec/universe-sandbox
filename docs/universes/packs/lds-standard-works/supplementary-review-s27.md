# LDS checkpoint 27 — Moses 7 link and interaction remediation

Reviewed PR33 **6bf2812973995956e60cd3dc20472feb269cf916** against S26 **ed7a49bbe7bb1620b49eaa6c33799f5352663c4e**, on 2026-11-02. Bounded exact-head delta review; unchanged source evidence and import dispositions are inherited, not newly read or independently certified. Claude retains active implementation ownership and checkpoint-27 lock. The receipt and main status still describe checkpoint 26 at the time of inspection; this report targets the actual new code, not that older receipt.

## Verdict and content closure

**The S26 Moses 7 guidance is implemented exactly.** `PGM-qg06-zion` → `P17-pgp-enoch-city` reads “describes Enoch’s community and city”; the inverse reads “Moses 7 teaching and promise”. Both remain 5/pgp, and the P17 D&C cross-account link remains distinct. The future gathering is not collapsed into an ancient located city. The non-link CSV explanation now explicitly permits this source-discussion edge while excluding unrelated Zion uses. DD121-only → RC02, the S25-C1 correction, Church naming and all prior source copy remain unchanged.

Primary evidence is inherited from [S26](supplementary-review-s26.md#builder-answer--pgm-qg06-zion): [Moses 7:18–21, 62–69](https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/7?lang=eng). No fresh scripture reading or historical corroboration is claimed in this delta. The two cards change only by adding these links; **1,521 of 1,523 cards are unchanged**. All descriptions, sources, dates, gates and non-codex pack data are unchanged. **127 linked cards / 249 directed entries / 141 labelled entries / three event targets**, preserving all 247 prior entries. The typed-link register has 55 rows (two changed/new rows inspected in [dispositions](supplementary-review-s27/delta-dispositions.csv)).

**1,271 SD imports / zero pending remain unchanged**, with the 1,365-row implementation mapping and 12-person crosswalk byte-identical. There are no new BMC quotation/vision, DRE office-succession, timeline/source-vision or final omission/consolidation implementations in this delta. Completion of imports is not closure of those integration requirements.

## S27-C1 — pending event focus can still override a completed reopen/close

Location: `public/atlas/engine.js:1338–1343`, `cxGoEvent`; `openCodex` / `closeCodex` at 1358–1359. The new current-state guard correctly declines focus when the codex remains open, the selected event changes/clears, the target becomes filtered or locked, or its element disappears. The isolated actual-function probe verifies those cases plus normal activation.

One remaining sequence reproduces a stale focus effect: activate an event link, then `openCodex(); closeCodex()` before its queued 60 ms callback executes. `closeCodex` explicitly restores focus to `#cxBtn`, but the callback subsequently focuses the event because the modal is closed again, `S.ev` is unchanged and the event remains reachable. The comment “if nothing changed in the meantime” is stronger than the state checks establish. This is a deterministic isolated callback reproduction, **not a rendered/physical-device timing claim**.

**Required correction within the already-open event-focus race gate:** cancel or invalidate the scheduled focus on intervening codex open/close and relevant navigation/filter changes, using a generation/token or explicitly managed timeout. Checking only the final boolean modal state cannot distinguish this sequence. Preserve normal event-link focus when no intervention occurs. Acceptance: the seven passing cases in [callback-probe.cjs](supplementary-review-s27/callback-probe.cjs) stay passing; the eighth preserves `#cxBtn`; repeated reopen/close and competing event navigations cannot revive an older callback. Verify final keyboard focus in the builder's permitted browser/device checks. Do not change the reviewer probe merely to hide the reproduction.

## Camera update and S25-V1 evidence

`frame` now updates `orbG.cam` before `layoutGalaxyLabels`, and `orbW.cam` after orbit/planet updates and before `layoutSiteLabels` / `layoutRoutes`; both render calls follow their layouts. Orbit cameras are the corresponding `camG` / `camW`. Static ordering is correct for refreshing the camera matrices before projection. This affects the generic engine, so final regression evidence must include both galaxy labels and surface labels/routes, not only the LDS card.

**S25-V1 is not closed by code inspection.** No new screenshots or completed S27 probe log are in this exact six-file delta. S26's inspected settled screenshot still displays “Charting surface”; its earlier partial disposition carries forward. The new `s27-probe.mjs` is a useful proposed evidence collector: it waits for hidden bake progress, no turn/fly state and the selected Kirtland site, computes label projection differences and records failed resources. It was inspected, **not executed here**. A test script's existence is not a passing result.

Two evidence limitations to address when reporting that probe: it prints the number of moving samples but does not assert that any were observed, so require a nonzero moving sample count before claiming alignment “while moving”; its alignment helper calls `cam.updateMatrixWorld()` itself, so retain the independent source-order check and compare actual screenshots as well. A final screenshot/log must show completed state, not just elapsed time. SwiftShader and emulated touch remain distinct from real-GPU and physical-phone/native-select evidence. Programmatic focus before Enter is not full Tab/Shift-Tab traversal. No fresh browser-smoke result or same-head 4K/1280/phone evidence is present at this head.

## Validation and reproducibility

- **49/49** LDS-pack/layer tests passed at this head: [output](supplementary-review-s27/unit-results.txt). Command: `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts` in a detached exact-head checkout.
- [Pinned source probe](supplementary-review-s27/probe.cjs) verifies the two-card delta, preserved pack data/links, unique keys/targets and **71,712** work/layer/year reachability cases: [result](supplementary-review-s27/probe-result.json). Pure VM helpers only.
- [Callback probe](supplementary-review-s27/callback-probe.cjs) extracts actual head functions with explicit fake collaborators; seven expected cases pass and one remaining stale-focus sequence is reproduced: [result](supplementary-review-s27/callback-result.json). No DOM/browser/server execution.
- [Accounting script](supplementary-review-s27/accounting.py) runs two isolated generator reproductions; pack, mapping and both crosswalks are byte-identical: [result](supplementary-review-s27/accounting-result.json). Accepted register remains pinned at `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`.
- Coverage, reference and witness validators pass; outputs are in this directory. Witness integrity attests available bytes, not reading completeness or historical truth.

Implementation [CI 41397537659](https://github.com/mckayec/universe-sandbox/actions/runs/41397537659) is attached to this exact head; terminal implementation/review outcomes will be recorded in the main handoff after publication. CI `test:pages` is distinct from `test:browser` and from the proposed S27 interaction probe. No reviewer browser/server or rendered acceptance is claimed.

## Next handoff

Claude: fix S27-C1, finish the existing BMC/DRE/timeline/source-vision and omission/consolidation crosswalk with exact IDs and source-role dispositions, and publish the actual final-head probe outcome and completed-state images. Include same-head 4K/1280/phone readability, keyboard traversal/activation/Escape/focus return, physical native-select/touch, real-GPU moving/settled label and route alignment, and unfiltered resource evidence; name any genuine external device dependency. ChatGPT rechecks changed deltas and returned evidence. Specific-PR owner approval remains required after final gates.

Separate post-release basemap, synchronoptic timeline and Cosmere tasks are untouched and nonblocking. No status/lock change, application edit, formal approval, merge, deployment or release by this review.

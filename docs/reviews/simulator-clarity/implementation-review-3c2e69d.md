# Item 5 correction review — PR #47

Reviewed 2026-11-10 by ChatGPT. Branch `sim/clarity-physics`; exact head **3c2e69d1cf11187717d919a03fd0051b963ca82d**, compared with previously reviewed **da48c23ac0c8738c3168f1be92fce51487bd9a30**.

## Disposition

**SC5-T1 closed at source and matrix-behavior scope.** Item 5 may proceed to the next bounded implementation unit; this is not complete rendered acceptance of PR #47. No new High/Medium finding in this five-file correction. SC5-E1's item-5 harness and receipt amendments are addressed; its inherited item-4 binary phase evidence obligation remains with SC4-E1.

Return **implementation / claude** for item 6 (mobile/quiet/Kids mode), then item 7, with the outstanding evidence below carried forward. Existing review history and Mckay's release authority remain unchanged.

## Independently examined and executed

- Read **5/5 incremental changed files**: `src/tidal-visual.ts`, `src/visuals/update-visuals.ts`, `src/visuals/key-light-glsl.ts`, `src/ui/test-probe.ts`, `tests/key-light.test.ts`. Also read key-light selection, materials and lighting-controller sources. **8/8 downloaded source/test blob hashes matched GitHub.**
- The vertex shader first uses Three's inverse-transpose model-view normal matrix, then right-multiplies by the view matrix to undo the rigid camera rotation. This yields the inverse-transpose world normal under the existing nested nonuniform tidal scale. Surface-pattern coordinates and world-space source directions retain their prior roles. The extracted scale helper preserves the old scale values.
- Exact-head repository key-light tests: **13/13 pass**, Node 24.22.1, Three r180. These include behavioral transform, transformed-tangent and day-side checks; the old faulty expression is no longer pinned as expected behavior.
- [Independent runner](reviewer-normal-3c2e69d.mjs), using the actual extracted tidal transform and actual scale helper: **108/108** normal comparisons pass (3 strains × 2 spins × 2 tidal-frame angles × 3 cameras × 3 normals). Maximum Euclidean normal error **3.608224830031759e-16**. Replacing the normal expression with the former direct model-matrix transform fails **72/108** comparisons; the 36 uniform cases pass. This is a behavioral negative control, not an import failure. [Output and input manifest](reviewer-normal-output-3c2e69d.json).
- The runner evaluates the guarded shader expression on CPU with Three matrices; it does **not** compile GLSL or execute a renderer. Reproduce with Node 24+, an exact-head checkout in `SIMULATOR_REVIEW_ROOT`, and the Three 0.180.0 module path in `THREE_REVIEW_MODULE`, then run the linked runner.

## CI provenance

[Run 42721246359](https://github.com/mckayec/universe-sandbox/actions/runs/42721246359), [build job 129515462967](https://github.com/mckayec/universe-sandbox/actions/runs/42721246359/job/129515462967), succeeded; deploy job was skipped. Read the actual job log: checkout was synthetic merge **b3b007087699cfcc3e42ad56f31b2fe9f78bbdba**, not the bare PR head. Compared both complete, nontruncated trees: **229/229 non-doc files identical**. Logs confirm formatting and build pass, **172/172 unit tests**, **113/113 distribution files**, and **24/24 standalone-page cases** (12 pages × 2 viewports). These are independently inspected CI results; only the 13 focused unit tests were executed locally in this review.

## SC5-E1 and builder evidence

Read the full [5b harness](evidence-harness-5b.mjs), [raw return log](evidence-3c2e69d.jsonl), and corrected status receipts.

1. Head mode now fails on missing `keyDir`/`stretch` fields; only explicitly labelled parent comparison mode permits unavailable probes.
2. Item-5 scenarios assert recorded paused/running/speed state. The item-4 binary phase assertions are explicitly deferred and remain due.
3. Old receipt values were corrected without changing the old log. New return values agree with its log: lone-gas spins 0→0.31681469282036007 desktop and 0→1.2936293856407224 compact; moving-source usable samples **4/4 desktop, 2/4 compact**. Samples containing no worlds are excluded, not counted as successful tracking.
4. The camera action is accurately called zoom-out. It does not establish rendered camera-orbit invariance.

Raw builder evidence contains **60/60 true head checks across 8/8 scenarios**, and **26/26 generic parent checks across 8/8 scenarios**, with zero reported page/shader messages. Parent probe skips mean the parent count is not equivalent lighting coverage or a behavioral negative control. The stretched-giant head samples record strain 0.3889492569 desktop and 0.3230637283 compact, with the star as key source. These remain builder-run SwiftShader results, not independently repeated rendering.

Viewed **2/4 focused tidal image files**, the desktop and compact head images. The desktop image shows the giant illuminated from the star-facing left side. The compact close-up crops the body and its lower area is covered by UI, so it cannot establish the entire terminator/source geometry. Neither parent image was visually compared in this run. No before/after pixel-difference measurement is independently certified.

## Remaining evidence and continuation

Independent Chromium launch again failed before page creation: `process_singleton_posix.cc:297 socket() failed: Operation not permitted (1)` (exit 134). **0 independent rendered cases completed.** No GPU compilation, real-GPU performance, physical iPhone/Safari, 3840×2160, or rendered orbit invariance is certified here. The CPU matrix correction is sufficient to close the identified math defect; screenshots and probe direction alone would not be.

Carry SC1-E1/SC4-E1's ignition/background, motion/flyby/device and explicit binary paused/running evidence requirements forward. The Save→Clear→Load smoke remains unresolved: the builder reports head **1/4** and parent **1/3** cases passing, with failures at the known line 88 wait. That suite was not independently rerun here and is not a passing validation. Preserve `save-load-smoke-fix-plan.md` for Claude's bounded repair/evidence return.

Claude should complete item 6 as the next bounded slice, attach exact-head validation and an evidence receipt distinguishing executed checks from unavailable ones, and return ownership for review. Item 7 remains queued. This review does not certify the remaining implementation, physical fidelity, full browser suite, or release.

## Run coverage

Inspected **18/18 pack statuses and 8/8 review statuses** on current main. Simulator clarity was the only ChatGPT-owned implementation return. Hierarchy, Narnia and Licanius research inputs/audit folders were unchanged against the preceding checkpoint; no stale parallel self-audit was found. Other owners' statuses and the active, both-signed agreement were left unchanged. No site code or PR branch was edited; no merge, deployment or release approval was performed.

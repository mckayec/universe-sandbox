# Checkpoint 22 independent review — Standard Works host integration

Reviewed 2026-11-07. PR45 branch **engine/timelines**, exact head **5228e3564e61e3721faf16a00fccfe2913c8c10b**, parent **2cdef89f2518551ac5750be5abfd27c7adc5fa46**. PR head independently read and matched. Inputs: [checkpoint 22](checkpoint-22.md), [prior review](independent-review-2cdef89.md).

## Bounded verdict

Accept the adapter wiring at source/model level. The host now offers the Timeline button and container for supported adapters and passes the selected adapter's model to the view. The existing book/layer/chapter predicate is preserved, including fail-closed current-book chapters when no selector exists. Overview wording is adapter-specific and escaped. No pack or real relationship acceptance data changed.

Inspected all **3/3 runtime diffs**, the complete changed modules, checkpoint report, host probe and both terminal output files (**7/7 changed text files**). Four added screenshot files were inventoried but **not visually inspected** here; no screenshot/layout acceptance is claimed.

## Independent evidence

- **8/8 local Git blob hashes** match the exact-head tree: three changed modules, grounding module, grounding/sidecar tests, real-pack probe and proposed sidecar.
- **44/44 tests pass**, zero failures/skips: grounding, sidecar, Standard Works adapter/chapter gates and tree regression suites. Command: `node --test tests/atlas-timeline*.test.ts`. The initial isolated tree-suite attempt lacked pack fixtures; after fetching those six files from this exact head, the complete focused run passed. This was a fixture setup issue, not a product failure.
- Actual-pack probe **5/5 reported scenarios reproduced** using PR33 pack blob **3d279a757303e6ae7e80c358a6f6e041269eb82c**. Matching version: ok, **0 promoted / 12 rejected / 0 changed / 0 grounded edges** (11 proposed; Babylon destination containment remains unsatisfied). Absent, missing-version, stale-version and wrong-pack cases promote zero.
- A preliminary local pack copy had a different hash and correctly returned stale. It was not used as the matching-head result; the reported matching result above uses the verified pinned blob.
- Attempted the committed synthetic view probe with installed Playwright and `/usr/bin/chromium`. Browser launch failed before creating a page: `FATAL:chrome/browser/process_singleton_posix.cc:297 ... socket() failed: Operation not permitted (1)`. **0/14 scenarios executed independently**. The full host probe was inspected but not executed here; the same browser prerequisite is unavailable, and a full built dist was not prepared. No independent 52/52 browser claim.
- Builder's committed output reports **14/14 synthetic DOM scenarios** and **52/52 actual-host checks** at 1440/390, including book downgrade, URL restoration, search and Back/Forward. Those are inspected builder evidence, not independent execution. The full 159-test suite, page checks and browser smoke likewise remain builder-attributed this run.

## Evidence limits and finite follow-up

| ID | Priority | Finding / required disposition |
|---|---|---|
| TL22-E1 | Medium validation gap | `tl22/actual-host-probe.mjs` comments about a layer test but only clicks book 2 after book 1; it never toggles a layer. Thus its output demonstrates book filtering, not an independent layer-chip transition. Add an actual layer-off/on host case, verifying record/edge, selected detail, search and URL removal/restoration. If the host does not expose such a control, document that exact limitation rather than claim layer interaction coverage. This is missing evidence, not a reproduced leak. |
| TL22-E2 | Validation limit | Controls use DOM `click()` and dispatched keyboard/input events because real input timed out under software WebGL. Keep this scope explicit. Before interactive acceptance, obtain real pointer and keyboard open/close/focus/navigation evidence, or retain the precise environment/performance blocker. Synthetic Escape is not a real keyboard test. |
| TL22-E3 | Test-strength improvement | Model assertion uses records >1000 and list assertion uses ids >100. Logged 1714 values are useful observations, but these predicates do not prove complete list membership. Compare the exact gated model-ID set to the rendered list-ID set, so partial rendering cannot pass. |

No source facts were newly researched or accepted. **0/12 real relationships approved/promoted**; no immutable edition/source-provenance upgrade. Earlier source and identity holds remain.

## Next bounded handoff / Known gaps

Return to **implementation / claude**. Close TL22-E1 and strengthen TL22-E3 in the next bounded host-validation checkpoint. Preserve zero real promotions and the current chapter fail-closed behavior. TL22-E2 must remain explicitly qualified if the runtime cannot support real input; do not convert a timeout or simulated dispatch into a pass.

The chapter selector and folded-row connectors remain unfinished planned work. Continue them in bounded checkpoints after the host-validation return; no new open-ended source research is requested. Full runtime/CI qualification, mobile performance (1714 list rows), device/AT, integration with the separately approved PR33 pack, and Mckay's release approval remain open. The screenshot claims have not been independently evaluated in this run.

**Verdict: bounded source/model wiring accepted; real input, layer interaction and complete rendered-list evidence remain unverified. No final canon, full technical or release approval.**

# Item 6a correction review — PR #47

Reviewed 2026-11-10 UTC by ChatGPT. Branch `sim/clarity-physics`, exact head **8de912810c3fe029b79623f762b5eab325bc1236**, compared with previously reviewed **b7fc3f1244b72471143f2a22674dd73238acd259**.

**The two code defects are closed at source/handler scope; return fixing / claude for one bounded evidence completion, SC6-E2. Item 6a is not yet fully accepted.** The committed browser return has one failed check and its amended harness has not been rerun. Kids mode (6b) and item 7 remain unfinished. Preserve SC5-T1's closure and the existing release gates.

## Disposition

| ID | Result | Evidence and limit |
|---|---|---|
| SC6-T1 | Closed at source/handler scope | `loadExhibit` now uses `exhibitLoadOrigin(asAttract)`: automatic loads are simulation-origin and visitor loads remain action-origin. Independently executed actual load/start/restart/museum handlers produce zero banners and zero audio calls for quiet idle start plus restart, while a visitor load still presents. The additional accretion and slow-motion paths use `simulationToast`; its actual handler suppresses quiet and preserves full-mode banners. Compact rendered start/restart is supported by the builder log; desktop rendered return is still missing. |
| SC6-T2 | Closed at source/handler scope | `canvasLabelText` shortens only compact names. `updateLabels` changes `app.compactLabels` and refreshes every body on breakpoint transitions. Actual label/loop handlers pass compact → desktop → compact using Quiet Black Hole, retain full aria-label/title, and refresh an unselected hidden label before later selection. Full renderer timing remains subject to SC6-E2. |
| SC6-E1 | Requested harness change addressed | The current harness asserts running/10x before and after a bounded wait for a recorded non-guide event and requires that recording before crediting no banners. Both committed viewport logs record Planetary fragmentation. This is source inspection plus attributed builder results, not independent browser execution. |
| SC6-E2 | **Low, open: finish the amended rendered return** | Current raw output is **53/54** true checks: desktop 24/24 with idle explicitly omitted; compact 29/30 with a failed resize-back comparison. The revised per-name comparison and settling wait were not rerun. Run the current committed harness at both default viewports with idle enabled for both; record exact application head, harness blob SHA, command/environment, exit code and unedited results. Resolve any real failure before returning implementation-review/chatgpt. Do not replace the old log or describe a proposed correction as a passing run. |

The compact failure compares entire label arrays: the return includes an additional Drifting Cloud element, while Quiet Black Hole has the same shortened text and accessible name on both sides. That supports the explanation that the original comparison was too broad. It does **not** prove the amended harness passes. The revised per-name assertion is reasonable; retain the nonempty long-name precondition and require the same named object after both layout transitions.

The continuing ambient pulsar tick in `src/app/loop.ts` is separate from event feedback and remains controlled by the sound setting. The approved item-6 wording requires suppression of unsolicited banners/live announcements, not universal audio mute. This review therefore does not add an all-audio-mute requirement or certify one. The harness variable named `sound` actually reads narration-card hidden state; its check supplies **no audio evidence**.

## Independent verification

- Read **9/9 changed files** in the correction delta and fetched 4 supporting source files. **13/13 local source/test Git blob hashes match** the exact PR head; manifest and execution results are in [reviewer output](reviewer-feedback-output-8de9128.json).
- Exact-head `node --test tests/feedback.test.ts`: **12/12 pass** on Node v24.22.1.
- [Independent runner](reviewer-feedback-8de9128.mjs): **9/9 behavior groups pass**. It extends the prior reviewer reproduction with actual `simulationToast`, `updateBodyLabel` and `updateLabels` execution. This is independent execution of extracted production handlers using small DOM/scene/audio adapters, not Claude's reported rerun.
- The six preceding groups cover quiet recording/body history, direct action feedback, idle start/restart, full-mode presentation/vibration, bounded history and Details reset for a rebuilt object with the same ID. The three added groups cover simulation-only toasts and label resize/selection behavior.
- Reproduce with Node 24+ and exact-head source: `SIMULATOR_REVIEW_ROOT=/path/to/checkout node reviewer-feedback-8de9128.mjs`. Expected exit 0. Adapters do not exercise a renderer, real audio output, screen reader or physical device.
- Independent Chromium launch failed before page creation, exit 134: `process_singleton_posix.cc:297 socket() failed: Operation not permitted (1)`. **0 independent rendered cases.** This environment cannot supply the missing browser rerun.
- Visually inspected **2/2 supplied return screenshots**. Compact shows the selected Helios 01 label and Details control; desktop shows the fragmentation timeline and inspector. The visible Guided exhibit banner is permitted direct-action feedback. Neither still image demonstrates idle restart or a long-name resize sequence. These are builder images, not reviewer captures.

## CI and builder evidence

Read [harness 6a2](evidence-harness-6a2.mjs), [raw output](evidence-8de9128.jsonl), the builder receipt, and the preceding review. Builder SwiftShader checks remain attributed: **53/54**, not a green return.

Independently retrieved [Actions run 42740579750](https://github.com/mckayec/universe-sandbox/actions/runs/42740579750) and build-job **129580322489** logs. Checkout is synthetic merge **2fb56a36cfabb27857d7f29943bf4d5912058b53**, merging the reviewed head into 29704c78539aeddfe98df9920978c7685e126a1c. Compared complete nontruncated Git trees: **231/231 non-documentation files are identical** between this checkout and reviewed head. Logs confirm **184/184 unit tests**, **113/113 distribution files**, and **24/24 standalone-page cases** (12 pages × 2 viewports); format/build succeed and deployment is skipped. These are independently inspected CI results on equivalent source, not locally repeated full-suite checks or evidence that the simulator-specific harness passed.

## Bounded continuation

Claude: run the latest 6a2 harness with both viewports and both idle cases, preserve honest failures/timeouts, attach exact revision metadata, and return the evidence-only correction. No source rework is requested for the closed SC6-T1/T2 unless the rerun reveals a defect. If the application head changes, identify the delta and rerun applicable checks. Keep Kids 6b and catalog/units item 7 explicitly pending; 6b still needs one armed Add per placement, grown-up gating, Home fitting instead of resetting, and no idle replacement.

Retain SC1-E1/SC4-E1 binary phase/motion/flyby/background/ignition/device obligations and the Save→Clear→Load smoke limitation. Short landscape, 200% text, keyboard-only, screen-reader, physical iPhone/Safari and real GPU validation remain unverified here. This is not merge/deployment or Mckay release approval.

Run triage: **18/18 pack statuses and 8/8 review statuses** inspected on current main. Simulator clarity was the only ChatGPT-owned task. Hierarchy/Narnia/Licanius folders are unchanged against checkpoint d50721a06a2ad7b2aebe9cd238521c060a3fe10c; no stale parallel self-audit. Other owners, existing D09/D10 blockers, the active both-signed agreement and WIP are unchanged.

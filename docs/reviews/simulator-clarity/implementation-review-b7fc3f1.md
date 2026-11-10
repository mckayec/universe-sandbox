# Item 6a implementation review — PR #47

Reviewed 2026-11-10 UTC by ChatGPT. Branch `sim/clarity-physics`, exact head **b7fc3f1244b72471143f2a22674dd73238acd259**, parent **3c2e69d1cf11187717d919a03fd0051b963ca82d**.

**Return fixing / claude. Item 6a is not accepted yet.** One Medium quiet-mode defect and two Low corrections follow. Preserve the preceding SC5-T1 closure. Kids mode (6b) and item 7 remain unfinished; this is not release approval.

## Findings

| ID | Severity | Location | Finding and evidence | Required disposition |
|---|---|---|---|---|
| SC6-T1 | Medium | src/ui/exhibit-flow.ts: loadExhibit final museumEvent; src/ui/feed.ts: startAttractMode/updateAttractMode | Every guided-exhibit load is tagged action, including automatic idle loads. With quiet active, reduced motion off and pickers closed, idle >120 seconds calls loadExhibit('feed-black-hole', true); each subsequent >48-second attract restart does so again. Both bypass quiet filtering. The actual extracted handlers independently produce two unsolicited Guided exhibit banners and two audio.play('ui',1) calls over start + restart. This contradicts quiet feedback despite the nine-second collision scenario passing. | Distinguish automatic/attract origin from visitor-origin loads, preserving event recording and direct-action/failure feedback. Add behavioral start/restart regressions plus a focused rendered return. Replace the source test that requires every guide call to be action-origin: it currently enshrines this mistake. Audit any nested builder notifications if automatic exhibit selection is extended. |
| SC6-T2 | Low | src/bodies/registry.ts: updateBodyLabel | shortLabel(b.name) is unconditional, so desktop labels also truncate at 14 characters. The receipt's desktop-unchanged claim is too broad; current desktop tests cover visibility/metrics and short Helios/Void names, not long text. Full aria-label/title do not restore the visible desktop name. | Keep shortening specific to compact layout, including resize transitions, or explicitly justify and document the desktop scope change. Add a long-name compact/desktop behavioral case. This finding does not concern the unchanged distance visibility policy. |
| SC6-E1 | Low | docs/reviews/simulator-clarity/evidence-harness-6a.mjs: quiet running block | The harness logs timeline before/after/titles but does not assert a quiet event was recorded; empty banners alone could pass if no event occurred or recording broke. The committed log does show Planetary fragmentation at both sizes, which supports this particular builder run, not future regression protection. Running/speed state is inferred from clicks rather than asserted. | Require an identifiable recorded event and explicit running/10x probe state before crediting the no-banner scenario; use a bounded condition wait rather than relying solely on nine seconds. Preserve action and error feedback checks. |

## Independent evidence

- Read the **14/14 changed-file delta** and fetched exact-head files, plus stellar-evolution source for the wiring test. **15/15 local source/test Git blob hashes match**; manifest is in [reviewer output](reviewer-feedback-output-b7fc3f1.json).
- Ran exact-head `node --test tests/feedback.test.ts`: **9/9 pass**. These tests do not cover automatic exhibit entry through the action-origin call.
- [Independent reproduction](reviewer-feedback-b7fc3f1.mjs): **5/6 behavior groups pass, 1/6 fails**. Actual extracted museumEvent, loadExhibit, startAttractMode/updateAttractMode and selection handlers run with small DOM, scene and audio adapters. The failure is SC6-T1 (two banners plus two sound calls instead of zero), not missing imports or unavailable dependencies.
- Passing independent groups verify quiet simulation recording/body lastEvent without presentation; visible/audible direct exhibit action in quiet; full-mode simulation presentation/vibration; history capped at eight; and actual Details handler retaining expansion for the same object but resetting for a rebuilt object with the same ID.
- Reproduce using Node 24+ and an exact-head checkout: set `SIMULATOR_REVIEW_ROOT` to the checkout, then run the linked script. Exit 1 is expected on this head. This is handler execution with adapters, **not browser, GPU, real audio or screen-reader execution**.
- Fresh independent Chromium attempt failed before page creation, exit 134: `process_singleton_posix.cc:297 socket() failed: Operation not permitted (1)`. **0 independent rendered cases; 0/4 supplied screenshots visually inspected.** No visual acceptance is inferred.

## Builder evidence and CI

Read the full [harness](evidence-harness-6a.mjs), [raw log](evidence-b7fc3f1.jsonl), and item-6a status receipt. The log contains **35/35 true checks** across **2/2 viewport runs** (17 desktop, 18 compact), and both timeline records show the fragmentation event. These remain builder SwiftShader evidence. Desktop Details was invoked by DOM click because its control is hidden at that layout; that is not desktop pointer/keyboard usability validation. No idle start/restart case appears.

Fresh GitHub metadata for [run 42732521677](https://github.com/mckayec/universe-sandbox/actions/runs/42732521677), associated with the reviewed head, reports build job **129553814208** successful, including format/build/unit/distribution/standalone-page steps; deployment skipped. Full job logs and synthetic-merge checkout equivalence were **not** inspected in this run. Accordingly **181/181 units, 113 distribution files and 24/24 page cases remain builder-reported counts**, not locally repeated full-suite evidence.

## Bounded return

Claude should fix SC6-T1, disposition SC6-T2 and strengthen SC6-E1, attach exact new head and pass/fail/unavailable results, then return implementation-review/chatgpt. Keep direct failures, saves/loads and construction history available. Do not start treating Kids mode as implemented: one armed Add per placement, grown-up gating, Home fitting rather than resetting, and no idle replacement still need their separate 6b implementation and review.

Retain SC1-E1/SC4-E1's binary phase, motion/flyby, background/ignition and device evidence obligations and the Save→Clear→Load smoke limitation. Physical iPhone/Safari, real GPU, short landscape, 200% text, keyboard-only and screen-reader behavior are unverified here. No merge, deployment or Mckay release approval is supplied.

Run triage inspected **18/18 pack and 8/8 review statuses**. Only simulator clarity was ChatGPT-owned. Hierarchy/Narnia/Licanius folders (7/8/7 entries) are unchanged against prior checkpoint e19cc5fd470935a22ff78650045be5be5d3fd785; no stale parallel audit found. Other owners' files, existing D09/D10 questions, and the active both-signed agreement remain unchanged.

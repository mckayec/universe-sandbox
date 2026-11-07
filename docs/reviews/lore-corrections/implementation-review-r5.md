# Lore corrections — revision 5 implementation review

2026-11-06 UTC · ChatGPT.

**R4-C1 closed: 1/1 returned blocker resolved at source/state level. The timer implementation is accepted at the audited head; complete rendered/technical and release approval remain outstanding.**

Target: [PR24](https://github.com/mckayec/universe-sandbox/pull/24), `fix/lore-corrections`, exact head **4a13b1bde7cb0a11942f8892fa0fd22c86bc48ef**, freshly confirmed open/unmerged. Actual engine fix: **dd1a993e61fa0e3e6816cb94b40ab4d280bf20cc**; preceding reviewed head: **a0d8726d55e389e4568a8d00ab4d9937d2f51e86**. The final successor commit changes only the implementation report's browser-test note.

Read the existing corrections, [R4 review](implementation-review-r4.md), Claude's exact-head [Revision 5 evidence](https://github.com/mckayec/universe-sandbox/blob/4a13b1bde7cb0a11942f8892fa0fd22c86bc48ef/docs/reviews/lore-corrections/implementation.md), all three files in the parent-to-head diff and the relevant complete source/test files. No literary claim or atlas copy changes in this return.

## R4-C1 disposition

The actual [FX.heliofall implementation](https://github.com/mckayec/universe-sandbox/blob/4a13b1bde7cb0a11942f8892fa0fd22c86bc48ef/public/atlas/society.js#L3034) now retains the timer handle, clears it in `dispose()`, and captures the original EMP handler, reading generation and effect instance. The delayed callback requires all three to remain valid: unchanged generation, same instance still in `fxList`, and same installed handler.

Inspected the surrounding lifecycle rather than accepting the isolated callback alone:
- `playFx` stops the previous effect before registering the replacement instance.
- `stopFx` invokes the disposal hook and removes the effect; both stop/replay and reading changes reach it.
- `setEra` increments `navGen` and calls `stopFx` when the reading selection changes.
- `updateFx` invokes disposal on natural expiry and removes the expired instance.
- The installed Heliopolis EMP handler is an arrow closure, so capturing it does not lose a required method receiver.

The complete diff changes only this effect's timer lifecycle, its tests and implementation evidence. The rest of the visual effect remains unchanged. Source/data approval from earlier R3-C1 and R3-C3 findings is carried forward at its original evidence limits; R3-C2's remaining R4-C1 timer defect is now closed. This does not certify every possible asynchronous path or expand approval to PR37's separate implementation.

## Independently executed validation

Fetched files were written byte-for-byte and their Git blob hashes independently reproduced:
- `public/atlas/society.js`: **a6353f61901f8131e1bd02c7a0b7f26abe17ec83**.
- `tests/lore-heliofall-timer.test.ts`: **fbda4d1956c954584a9e03d6de7548b4c03b2a0a**.

Node v24.22.1 executed the exact committed test using the full extracted `FX.heliofall` constructor and `stopFx`, inert Three.js fixtures and a manually controlled timer queue.

| Committed acceptance case | Result |
| --- | --- |
| Uninterrupted playback: no fire before 2.5 seconds, then exactly once | Pass |
| Stop before deadline: no pending timer and no fire | Pass |
| Same-book stop/replay: only replacement fires at its own deadline | Pass |
| Book downgrade before deadline | Pass |
| Downgrade, return and rebuilt scene handler: neither old nor new handler hit | Pass |
| Cleanup-disabled callback guards | Pass |
| Missing handler: no timer scheduled | Pass |

**7/7 pass at the audited head.** Running those same tests against actual parent source produced **2/7 passing controls and 5/7 expected failures**, independently reproducing the old defect. Parent failures are negative-control evidence, not head failures.

Two additional reviewer probes passed (**2/2**):
1. Increment only `navGen` while keeping the same effect instance active and the same handler installed, with timer cancellation disabled; callback does not fire. The builder's bundled guard test also stops the effect, so it does not by itself isolate this generation check.
2. Extract and execute actual `updateFx` from the fetched source, advance effect time to its 22-second expiry before the timer's wall-clock deadline, and verify that the instance and timer are removed and no later callback fires.

These are **9/9 focused VM tests**, comprising 7 committed cases and 2 supplemental reviewer cases. They are source/state tests, not rendered scene, pointer, keyboard, physical-phone or GPU evidence. The full application and full unit suite were not independently executed locally in this return.

## CI and attributed builder evidence

Independently inspected [CI run 42166895552](https://github.com/mckayec/universe-sandbox/actions/runs/42166895552), job **127725346733**, for the exact PR head. At the last read on 2026-11-06 around 05:19 UTC, install, formatting, build, unit-test and distribution steps had succeeded; Chromium installation was in progress and standalone-page steps remained pending. **No full-CI pass is claimed.** Full logs were not yet available. Claude should record the eventual result before closing technical acceptance.

Claude reports local `pnpm check` **89/89**, standalone pages **24/24** (12×2), and a full browser-smoke pass after an initial invalid `CHROME_PATH` setup attempt. Those counts remain builder-attributed; a setup error is not a failed application test, and the smoke result is not independent Heliopolis rendered acceptance.

## Counts, known gaps and handoff

- **1/1** returned R4 blocker closed; **0 new blocking findings**.
- **3/3** historical R3 groups have their source/state repairs accepted, including the timer completion, at the limits described here and in previous reports.
- The inherited forty-row literary ledger is not recounted as new verification. No new primary-book audit occurred, no separate Deep Research product was invoked, and old source-confidence qualifications remain.
- Final CI completion, the prior rendered/mobile/keyboard evidence gates and Mckay's release decision remain open. The timer's visual behavior was not newly rendered in this review.

**Next bounded action for Claude:** record the completed exact-head CI outcome and finish the outstanding rendered/mobile/keyboard technical evidence, including Heliopolis interruption/replay in the actual app. Preserve the source qualifications, then route to the appropriate final content/release gates. Do not repeat this unchanged timer fix or claim that a code-level closure supplies missing book evidence. No formal GitHub approval, site-code change, merge or deployment is included.

After this review is committed and read back, main status returns to `fixing / claude` for the remaining evidence package, with `idle-runs: 0`. This stage names remaining technical work; there is no new timer-code correction requested.

## Observed timing and usage receipt

```json
{
  "project_id": "mckayec/universe-sandbox",
  "item_ids": [
    "lds-standard-works",
    "lore-corrections"
  ],
  "actor": "chatgpt",
  "run_id": "chatgpt-20261106-return-051219",
  "attempt_id": "1",
  "observed_start": "2026-11-06T05:12:19Z",
  "observed_end": "2026-11-06T05:20:22Z",
  "duration_seconds": 483,
  "duration_type": "elapsed_run_window",
  "timestamp_source": "clock.curr_time; start is the observed lock-acquisition timestamp, end sampled before publishing this review",
  "outputs": [
    {
      "item_id": "lds-standard-works",
      "status": "bounded_review_complete",
      "label": "RES64-C1/C2 closed; full canon still withheld; status handed to Claude",
      "evidence_url": "https://github.com/mckayec/universe-sandbox/blob/0061dcb553f068b17554305c3ef826c963383ebb/docs/universes/packs/lds-standard-works/audit-final.md"
    },
    {
      "item_id": "lore-corrections",
      "status": "bounded_review_complete",
      "label": "R4-C1 closed at source/state level; technical/release gates retained",
      "evidence_url": "https://github.com/mckayec/universe-sandbox/blob/main/docs/reviews/lore-corrections/implementation-review-r5.md"
    }
  ],
  "measured_usage": {
    "input_tokens": null,
    "cached_input_tokens": null,
    "output_tokens": null,
    "reasoning_output_tokens": null,
    "total_tokens": null,
    "credits": null,
    "estimated_usd": null,
    "billed_usd": null,
    "source": null
  },
  "coverage_notes": [
    "Partial observed review window only: preliminary triage and later publication/status/lock cleanup are excluded. Not complete session duration or active compute time.",
    "Mixed two-item window remains unallocated. CI and test durations are not added.",
    "Provider usage and billing counters unavailable; no estimates.",
    "Inspected all 18 universe and 6 review statuses on current main. Only two ChatGPT-owned returns were eligible; no research-ready Claude self-audit candidate. No new queued universe started while downstream WIP exceeds two."
  ],
  "recorded_at": "2026-11-06T05:20:22Z"
}
```

**Verdict: approve the R4-C1 implementation at 4a13b1bde7cb0a11942f8892fa0fd22c86bc48ef at source/state level; full rendered/technical, canon and owner-release approval are not granted by this bounded review.**

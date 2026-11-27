# Independent DWT-02 implementation review — 311e9fe

2026-11-08 UTC, ChatGPT. PR37 `atlas/deep-worlds`, exact head **311e9fefa4bad16dff40e909d57f0b450532b216**, parent **117ecbaadfe9a06fb24d8be79fb7262d71486c54**.

**DWT-02 closes within the source/VM navigation scope.** The repeated pending destination now arrives once, with the latest event selected; Stop preserves the last committed place. No new blocking defect found in this one-file delta. This is not a full browser, technical, canon or release sign-off.

## What was inspected

Read the actual GitHub parent diff and complete head/parent engine files: **1/1 changed application files**, engine.js +9/-3. Head engine blob `124a805fe85f29335c32b01bacbbc3f548196886`; parent `c6dfb80d65265e9feae0700d5a837ba378e0d8b7`. No pack/content changes. Read [prior review](implementation-review-117ecba.md), [builder return](fix-return-311e9fe.md), the complete builder probe and result log, and the characterization/cancellation/F1 harnesses used below.

The new `pendGen` distinguishes an in-flight in-place entry from a committed same-site view. When a repeated goEvent invalidates the first event token, `entryPending()` forces a replacement entry rather than sending the request to the committed-view path. The replacement inherits the original committed rollback snapshot and replaces the existing place history marker. Superseded callbacks cannot roll back the newer generation. On commit, `pendPrev` clears, so a later same-site request still avoids rebuilding. The existing generation increments on navigation remain in effect.

The builder's `ctx()` is byte-identical to the prior independent characterization fixture. All six downloaded engine/probe inputs were checked against their Git blob SHAs before execution.

## Independent execution

Node v24.22.1, exact head and parent snapshots, with chronological fake timers, asynchronous modeled history and mocked DOM/renderer. Counts were read from assertions, not exit status alone: the older builder/characterization scripts exit zero even when their parent negative controls fail.

| Check | Head | Parent |
| --- | --- | --- |
| Unmodified builder R1–R6b repeated-request/control probe | 7/7 | 5/7 (R1 and R5 fail) |
| Unmodified prior characterization: arrival plus recovery | 2/2 | 1/2 |
| Cancellation regressions | 26/26 | 26/26 |
| F1 cleanup regressions | 8/8 | 8/8 |
| New independent timing/payload/rollback checks | 12/12 | 8/12 |

[Reproducible independent boundary probe](reviewer-dwt02-boundaries-311e9fe.cjs) uses the same inspected fixture but new checks. Eight cases send a **different event and effect to the same destination**, at delays 0, 1, 100, 429, 430, 431, 929 and 930 ms. The actual transition commits at 430 ms. Each requires exactly one build, latest event/effect only, correct site/world/view and URL, and unchanged history length. Four Stop cases require restoration of the committed site, event, landmark and URL, with no build or effect. Only the four pre-commit arrival cases fail on the parent. These are deterministic boundary checks, not elapsed browser measurements.

The initial reviewer rollback predicate omitted the intentionally retained landmark URL parameter and failed on both revisions. The fixture's initial URL and expected rollback URL were corrected to include that landmark before the recorded paired run. No application defect is inferred from that test-authoring error.

The cancellation fixture treats all worlds/sites as visible: `hideUnseen` identity, `selHidden` false, `worldBookOk` true, `announce` no-op. F1 presentation callbacks are mocked. These results do not revalidate F2's actual book-gated rendering or physical fade state.

## CI independently inspected

[Run 42477650426](https://github.com/mckayec/universe-sandbox/actions/runs/42477650426), [build job 128722448770](https://github.com/mckayec/universe-sandbox/actions/runs/42477650426/job/128722448770): decoded logs confirm formatting, production build, **125/125 unit tests**, distribution check and **12 pages × 2 viewports** passing. Deploy is skipped. CI does not supply a DWT-02 rendered reproduction or run `test:browser`.

The checkout is synthetic merge **8dbacb52732d9c844208c24fdec961c60877940c**, merging the reviewed head into base **43d3a133d2eeee29fd648788cf707d6f17abccec**. Complete untruncated recursive trees show **281/281 non-doc file identities equal** between tested merge and head. This establishes CI's applicable code snapshot without claiming a local full-build run.

## Remaining evidence and handoff

A fresh Chromium/Playwright launch at **12:14:10 UTC** failed before page creation with `process_singleton_posix.cc:297: socket() failed: Operation not permitted (1)`. **0 rendered DWT-02 cases independently executed.** Builder also discloses no rendered DWT-02 reproduction. Neither the 90-case DWO-E2 matrix nor `test:browser` was rerun by this review; earlier matrix evidence belongs to an earlier revision.

Return to **fixing / claude** for a bounded rendered navigation qualification: reproduce the identical pending request using real pack destinations at head and parent (log whether the second request precedes commit), check latest arrival and Stop rollback, and rerun the current 90-case matrix. Keep programmatic/API activation distinct from real pointer input, and keep source/VM results distinct from pixels. If a specific rendered case cannot be driven, record that precise limit and an evidence-backed disposition rather than another unsupported pass. Preserve the Save/Load/browser-suite disposition and identify remaining technical gates before requesting final approval.

Prior content dispositions carry unchanged: 18 narrowed leaves, three scoped retains, three Dune omissions, **eight source holds and 139 unselected records**. No new source coverage or full-book certification is claimed. Society, visual/device evidence, geometry, full canon/technical checks and Mckay's release approval remain open. No code edit, PR branch write, PR approval, merge or deployment was performed.

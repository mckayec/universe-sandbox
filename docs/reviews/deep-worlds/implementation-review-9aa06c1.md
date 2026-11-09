# Deep Worlds: bounded F1 review and F2 return at 9aa06c1

Reviewer: ChatGPT. Date: 2026-11-08. Branch: `atlas/deep-worlds`, PR37.
Exact head: `9aa06c1d72bbd23c6861e9239659049494ea5ae9`; parent: `b47a60c663c571a2bb5deb932bb129fe941c73da`.

## Decision

**DWO-E2-F1 closes at source/VM scope.** The new hidden-place branch clears event/landmark state and place text before requesting asynchronous leave. The parent fails the sensitive cleanup controls. Prior DWT-01c cancellation closure is preserved.

**DWO-E2-F2 remains a separate bounded follow-up, not overall browser acceptance.** Accept the builder's corrected matrix as 90/90 attributed assertions, not a fully settled or continuously gated transition. Return the finite F2 correction below to Claude. Preserve its already active Timeline folded-row unit and lock; queue this return without interrupting that work. No new owner decision, broad source audit or repetition of the closed F1 is required for this correction.

## Evidence inspected

- One application file changed, `public/atlas/engine.js`, +5/-1. Downloaded exact-head bytes match Git blob `eac78a98f41a7900be409ed9c0e33e4c5b3d5155`.
- Read the complete fix return, prior matrix report, corrected browser harness and outputs, downgrade repro and settle probe, and relevant leave/ascend/render paths. Twelve downloaded artifacts matched their Git blob hashes.
- Canonical builder return: [33bf118](https://github.com/mckayec/universe-sandbox/commit/33bf118d4e5a25990b597a6d735b5151fbb914ce). The authored 07:47 status timestamp is distinct from that commit's 07:40:35 UTC time.
- PR37 was freshly verified open/unmerged and mergeable/clean at the exact head. This is not merge permission.

## Independent source checks

[dwo-e2-f1-review-probe-9aa06c1.cjs](dwo-e2-f1-review-probe-9aa06c1.cjs) executes the checkout's actual book-click handler in a Node VM. DOM, gate-result fixtures, renderer and asynchronous navigation are mocked. It checks cleanup before leave is requested, not real-browser timing or pixels.

| Check | Exact head | Parent |
| --- | --- | --- |
| Hidden world: immediate event/landmark/text cleanup | PASS | FAIL |
| Hidden site in visible world: same cleanup | PASS | FAIL |
| Missing current site: same cleanup | PASS | FAIL |
| Active tour: stop/queued-travel cleanup before leave | PASS | FAIL |
| Visible place retains eligible landmark | PASS | PASS |
| Visible place removes ineligible landmark | PASS | PASS |
| All books uses visible-place branch | PASS | PASS |
| Unrelated click leaves state unchanged | PASS | PASS |
| Total | **8/8**, exit 0 | **4/8**, exit 1 |

The existing [26-case cancellation probe](dwt01c2-probe.cjs) was independently rerun at the exact head: **26/26**, exit 0. These overlap earlier suites and must not be summed into a new unique-coverage total.

A separate source-slice characterization, not counted as a desired-behavior pass, confirms both versions' direct world-view hidden-world branch requests ascend without immediate event/text neutralization. The F1 fix does not change that branch.

## Browser evidence: what 90/90 establishes

The current [builder output](dwo-e2-browser-output-9aa06c1.txt) contains exactly 90 PASS / 0 FAIL, 45 per viewport (1440x900 and 390x844). The corrected e70/e102 tour predicate compares current-book tour length with current-book chronicle count instead of the cumulative chronicle. Positive entry checks require the expected rendered place; Back follows an in-app entry and checks same-document state.

It remains builder-executed SwiftShader evidence. Interaction uses DOM clicks and API.setBook, not physical pointer/keyboard, accessibility or device validation. No independent browser execution or new screenshots were obtained in this review.

The downgrade assertion checks event absence at +1.5 seconds. It does **not** require URL book to match state, neutral hidden-world/site copy throughout the transition, or final galaxy settlement:
- The passing 1440 downgrade row has state book=1 but URL book=2, with the old place still rendered.
- [Head repro](dwo-e2-downgrade-repro-output-9aa06c1.txt): 0/3 early event/text leaks versus 3/3 parent event leaks. At +8 seconds, all three head observations still have `placeCopy=true`. The persistent-leak predicate excludes that field, so its “clean” label means no tested event leak, not no hidden place/world text.
- [Settle output](dwo-e2-settle-probe-output-9aa06c1.txt) records Scadrial/Luthadel crumbs at +10 seconds and galaxy by +12 seconds. Its JSON `t` field is hard-coded; use the outer loop labels. These timings were not independently reproduced.
- Source agrees with the exposure path: `doLeavePlace` refreshes the world presentation before delayed ascent; `renderCrumbs` and `renderDossier` use selected-world data without a `seen(world)` guard at that point.
- The saved logs establish names, but do not enumerate every world-dossier field. “Only names” is not an independently established content limit.

## DWO-E2-F2: next bounded Claude unit

Keep the proposed Low classification separate from F1; it is a real spoiler-gating follow-up, not a blanket waiver.

1. Keep hidden world/site presentation neutral throughout the leave/ascend interval, including the existing direct world-view downgrade branch. Preserve visible-world/site positive behavior and navigation ownership/cancellation semantics.
2. Keep URL/state book and destination consistency explicit during the same transition. Do not restore or advertise a later-book destination as the earlier-book view settles.
3. Return exact-head evidence at both widths covering immediate downgrade, the post-leave/pre-ascent interval, and final settlement. Require absence of hidden event/world/site copy and test URL/state consistency, rather than checking only at +1.5 seconds. Include a visible-world positive control and retain F1/cancellation regressions.
4. If a residual cannot be fixed within this bounded unit, return its exact path, observed state, cause and narrowly supported disposition. Do not relabel the existing 90/90 as full browser or release acceptance.

This handoff does not authorize browser-permission workarounds, changes to the parallel Timeline lane, application edits by ChatGPT, merge or deployment.

## CI and retained gates

[CI42457900251](https://github.com/mckayec/universe-sandbox/actions/runs/42457900251): build succeeded; deployment skipped. Logs verify formatting/build, 125/125 unit tests, 175-file distribution check and 12 pages x 2 viewports. CI tested merge `129c6615248aa58bdaed47f7ffeef63d3af7799b`; complete untruncated recursive trees show all 281 non-doc file identities match this head. The 100 comparison changes are docs only. No `test:browser` command ran in that CI log; the builder did not rerun the separately tracked Save/Load flake.

DWT-02 remains a separate Low repeat-destination follow-up. Three Dune omissions, eighteen narrowed leaves and three scoped retains carry unchanged. Eight source holds and 139 unselected records receive no new canon approval. Society, Save/Load, independent browser/device/real-GPU, full technical/canon and Mckay-specific release gates remain open.

This is a docs-only review and finite implementation return, not PR approval, merge, deployment or release.

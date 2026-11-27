# Independent CA01-DESTINATION-01 implementation review

2026-11-21 UTC. Reviewer: ChatGPT.
PR48 / `feature/cosmere-reading-state`.
**Audited head: 057721011d6b0ba676ab957540b044241681382d.**
Actual parent: 0ad0c14957a840a69700e6d26df47102882a65d3.

## Verdict

**Accept CA01-DESTINATION-01: 2/2 removal operations, one finite correction unit.** D1 removes the definite UTol destination clause; D2 removes the unsupported Canticle–Komashi h-nomad link without replacing it. The actual incremental application diff matches [the checkpoint2 handoff](ca01-checkpoint2-2026-11-21.md) exactly.

This closes the requested removals, not all SP05/SP12 or the ending's canon. Full CA01 remains deferred at research checkpoint2/2; **0/33 full-work approvals**. Resume research/chatgpt for **AU01 unit1/2, Arcanum Unbounded system essays/maps**. No new CA01 research unit was consumed by this implementation review.

## Independent repository and execution checks

Read the [builder return](ca01dest-return-0577210.md), prior [weather acceptance](implementation-review-0ad0c14.md), actual GitHub commit diff, actual head and actual parent files. Fresh PR metadata confirms the audited branch/head. The commit changes exactly two files: pack +1/-2 and new tests/atlas-ca01-destination.test.ts +178. No engine, registry or other application file changed.

| Check | Result |
|---|---|
|Exact files|Head pack blob 2b8b9ccbfdca6ce47e8fc627e3fce9c416fbec43; parent ab5db8c8b53ee989391d6436d49afc8183bdccbf. The new test was read in the actual diff and fetched at head.|
|Actual-parent source comparison|Applying exactly the requested clause removal and whole link-line removal to the fetched parent yields the fetched head byte-for-byte. This verifies all other source, including accepted weather, remains unchanged.|
|Independent data assertions|**3/3 pass:** exact source transformation; link counts10→9; whole ordered head link array equals actual parent's array minus h-nomad. No replacement destination/link is introduced.|
|Actual selectors|Fetched engine blob0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 and reading.js blob4d9bc177294e5e33accf6f19825ef467f0bb90d4. Executed their actual relevant selector slices in the reviewer's JavaScript runtime against both fetched packs. **13/13 state comparisons pass** after allowing only D1's clause removal. World visibility, blurb, facts, status, **39/39 site-state entries and819/819 event-state entries** compared.|
|Exposure|The old clause appeared in **3/13** controls: All, legacy12, all works. It appears in **0/13** head observations. Sunlit-only remains hidden under inherited whole-bucket fallback; this behavior is not approved by this review.|
|Reference scan|Fetched **40/40** selected files: all top-level public/atlas JS/HTML and tests/atlas*.ts/mjs. Exact quoted h-nomad appears only in the new regression test's five intentional control/assertion lines. No operational reference found in this bounded scan. This is not a scan of every repository file.|
|CI metadata|GitHub reports exact-head build success, [run44868511958](https://github.com/mckayec/universe-sandbox/actions/runs/44868511958), deploy skipped. One annotation is advertised; fetching its endpoint returned connector INVALID_ARGUMENT/HTTP400 (endpoint not allowed), so its content was not reviewed. No inferred warning diagnosis. CI metadata is not a local rerun.|

Selector states: All; legacy10/11/12; none; Sunlit-only; bucket11; bucket11 minus Sunlit; all works minus Sunlit; all works; all works minus bucket11; first-work-only; legacy1.

The committed test reconstructs a parent by reversing its edits. Its round-trip assertion alone cannot establish the actual Git parent. This review's independently fetched parent and full-source equality provide that external control. No new implementation test was written and no PR branch was edited.

## Builder evidence reconciliation, with attribution retained

Read the complete [probe](ca01dest-probe.mjs) (blob2fde8c75724706bef30676757a02726e96c72560), [head log](ca01dest-rendered-output-0577210.txt) (a5031df68b2e36dbf7870bd22be21adea0494e86), [parent log](ca01dest-rendered-negative-0ad0c14.txt) (0899ee9713888317a2b4a5fae5b5bdce49b19621) and [visible-link data](ca01dest-visible-links.json) (d4cac5c4c76951a7614a6ab1cab810551c80692e).

Independently counted **180/180 assertion lines**: head90 pass/0 fail; parent42 pass/48 fail. All48 parent failures match expected old behavior: two route-object assertions in18 runs (36), plus clause/page and era-text assertions in six era12 runs (12). Independently compared all **18/18** recorded head link sets with parent sets minus h-nomad; all match.

The probe implements nine states at two viewports (1440×900,390×844), checks built link objects and their route metadata, programmatically selects Canticle, and expands the phone sheet with a tap. Its six era12 cases also assert selection, exact shortened text and a bounding-box check. The box check proves positive size, horizontal containment and vertical intersection, not complete visibility or lack of overlay occlusion. It does not inspect galaxy canvas pixels. Parent evidence uses the actual parent pack swapped into the head build, not an entire parent-runtime rebuild.

**0 independent rendered cases;0/2 screenshots visually inspected by this reviewer.** Browser results, screenshots, software-GL execution and format-equivalence of the executed versus committed harness remain attributed to Claude. Independent checks here establish source/data/selector behavior and consistency of the submitted evidence, not an independently reproduced browser session.

Claude reports focused tests2/2, parent negative control failure, pnpm check669/669 +115 dist, pages12×2 and browser smoke pass. Those commands were not independently rerun. The known Save/Load race did not trigger in Claude's reported run; it is not thereby fixed. No physical-device or4K verification is added.

The return's assertion that no other h-nomad references exist in tests should be read as no unintended operational dependencies: the new test intentionally mentions the removed ID. This wording distinction does not block the removal.

## Retained boundaries and next action

| Item | Disposition |
|---|---|
|D1 / SP05 definite destination clause|Accepted removal at audited head. No unnamed-world/Sho Del text or UTol theory newly certified.|
|D2 / SP12 h-nomad route|Accepted removal at audited head. h-scad-can/h-nomad2 and all other links remain outside canon approval.|
|CA01-WEATHER-01|Preserved byte-for-byte with all unrelated pack text. Previous finite acceptance retained.|
|SP03/SP04, SP06 remaining sunlight/core, SP07 geometry, SP11 Auxiliary/Dawnshard|Unchanged source/gate/geometry gaps remain deferred. No whole-key12 migration or broad canon approval.|
|Prior work/release gates|KO01/TH01/Kenton bounded acceptances, KO01/LU01/DR01/DR02 deferrals and SA07/S20/WAT06 holds preserved. No full PR approval, merge, deployment or Mckay release decision.|

Next: AU01 research unit1/2. Inventory system-essay/map claims at then-current exact PR24/37/48 heads; distinguish Khriss's in-world scholarship from omniscient fact, and system essays/maps from the nine stories/excerpts. Seek lawful opened primary essays/maps, record edition and map limitations, and leave incomplete research at research/chatgpt with a precise checkpoint. Do not repeat CA01 research without materially new evidence.

Intake inspected18/18 pack and8/8 review statuses; no other ChatGPT-owned item or research-ready/claude self-audit was eligible. Agreement active with both sign-offs; no agreement or other owner's status changed.

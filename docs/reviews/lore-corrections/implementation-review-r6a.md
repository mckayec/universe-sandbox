# Lore corrections — Revision 6a implementation acceptance

2026-11-07 UTC · ChatGPT.

**Canon/content: approved for the bounded PR #24 correction package at a4a6ea0ff5bd1d2a5bcb53d4c58f6d87738aa065.** This accepts the implemented corrections, explicit source-confidence qualifications and removals under the existing manifest. It is not a certification that every atlas claim has been verified against the novels. Claude's technical approval names the same branch head. Owner release approval remains pending; see D07 in ../../universes/DECISIONS.md.

## Target and independent inspection

PR [#24](https://github.com/mckayec/universe-sandbox/pull/24), `fix/lore-corrections`, open/unmerged at the fresh read. Reviewed the actual comparison from **6a961275cade4494a2d90b59e13fced5a2431155** to **a4a6ea0ff5bd1d2a5bcb53d4c58f6d87738aa065**: **3/3 changed files**, complete returned Society CSS/JS and probe, [prior content acceptance](implementation-review-r6.md), and [Claude's technical return](technical-r6-a4a6ea0.md).

- `public/atlas/society.css`: desktop index/dossier height now reserves a measured Chronicle height, with existing fixed values as fallbacks.
- `public/atlas/society.js`: one ResizeObserver plus resize/initial measurement sets the reserve to Chronicle height + 12 px. No per-frame work is introduced. Later mobile and hide-Chronicle CSS rules retain their precedence.
- `docs/reviews/lore-corrections/source-confidence-probe.cjs`: revised visibility, downgrade and failure handling.

No pack copy, literary claim, book gate or shared engine is changed by this delta. The prior **21/21** manifest dispositions, **3/3** residual-group resolutions and **5/5** unsupported-claim cut/neutralization dispositions therefore remain accepted at their recorded limits. The timer closure is not reopened.

## Finite return disposition

| R6 request | Inspection and result |
|---|---|
| 1. Expanded visible UI, selected palace, downgrade | The probe expands phone sheets, scopes palace assertions to the selected landmark, checks Range geometry, ancestor visibility/clipping and centre-point hit tests, and exercises Society 6→1 while the scene/landmark is open. Independently viewed all **4/4 supplied screenshots**: desktop palace, expanded-phone palace, downscaled 4K palace and phone book-one downgrade. Desktop and phone palace qualification text is readable; the downgrade image shows Earth at Book I without the New Sparta scene/landmark. Accepted with the evidence limits below. |
| 2. Failure exit and negative control | Inspected process.exitCode=1 for failed cases or page/console errors, and catch exitCode=2. Three negative controls are present: hidden/collapsed, clipped and nonexistent text. Data-only checks are labeled. Accepted. |
| 3. Runtime identity | Technical report explicitly tests branch head a4a6ea0, without integrating main, and does not transfer the prior merge's test results. Fresh CI identifies a different tested merge, recorded below. Accepted; eventual integrated runtime still needs its own rendered recheck. |
| 4. Exact-head technical sign-off | Claude explicitly approves a4a6ea0 for the source-confidence batch plus T-R6a-1 layout repair and states screenshot/performance limits. Accepted as Claude's technical sign-off, not an independently rerun browser suite. |

**4/4 finite return items addressed. 0 new blocking implementation findings in this delta.** T-R6a-1's measured reserve and the supplied desktop image support closure of the reported text-under-Chronicle defect. Scrolled screenshots need not show the dossier title and bottom simultaneously.

## Validation provenance

Independently fetched [CI run 42375798669, build job 128412986898](https://github.com/mckayec/universe-sandbox/actions/runs/42375798669/job/128412986898). The job logs show checkout **17e40e0beb157d5f70680ba670453b06342c2941**, merging reviewed head a4a6ea0 into **7a9372e8b2507a706a0ad5a3292f67da35855dc2**. At that tested merge: **125/125 unit tests**, **24/24 page/viewport cases**, build/format success and distribution check **113 files**. Deploy was skipped. This is confirmed CI evidence at the stated merge, not an independent run of the branch-head suite or of the source-confidence probe.

Claude reports **48/48 probe cases at each of four viewports** (192/192 case executions; repeated cases, not 192 distinct literary claims), **89/89 branch-head unit tests**, **24/24 page cases**, and distribution check 111 files. Probe kind counts per viewport: 27 visible, 14 absent, 4 data-only, 3 negative controls. These runtime counts remain **builder-reported**; this review independently inspected the test implementation and screenshot artifacts but did not execute that browser suite.

Limits retained:
- The absence predicate establishes that no matching occurrence passes its visibility test, not that every matching node was removed from the DOM. Centre-point hit testing and short text needles do not prove every pixel or entire paragraph unobstructed.
- On phone, the clipped negative control follows a collapsed-sheet control without reopening it, so it is not an isolated demonstration of clipping rejection there; desktop clipping control remains separate. This does not invalidate the positive expanded-sheet checks.
- Nomad's codex downgrade test reopens the codex; it is not a continuous-open-modal assertion. Four Society checks are data-only.
- The 4K screenshot is downscaled and is not a full-resolution pixel inspection. No new physical-device, real-GPU FPS or memory measurement. The disclosed blocky 4K terrain remains outside this correction batch.
- **0 new primary-book claims independently certified; 0 new local/browser test executions.** The historical 40-lead/120-spot-check records and their source limits remain unchanged. Broader book-by-book work stays separate.

## Owner handoff and release boundary

Recommend approval of this bounded correction package, with D07 recording the known gaps. After owner approval, Claude must reconcile the actual integration/release runtime and run the applicable rendered qualification/downgrade checks plus required CI before release; branch-head sign-offs do not automatically cover main's intervening engine changes. Record that exact tested revision. Any material content/runtime change returns for the relevant finite review. No repeated broad literary research is requested.

**Verdict: approved for the bounded correction scope at a4a6ea0; ready for the owner's release decision. Full-atlas primary-book certification is not granted. No merge or deployment performed.**

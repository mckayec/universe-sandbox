# Deep Worlds remediation delta review

2026-10-30. **Changes required: DW02 remains partial and DW06 evidence holds remain open.** Five of seven finding groups have their bounded correction verified or retained (DW01, DW03, DW04, DW05, DW07). No full canon or release approval.

Target: open PR [37](https://github.com/mckayec/universe-sandbox/pull/37), **9a09dbce1e777d3255e058e11d2b81c53cae8d98**. Prior implementation **f778b6b6fbbeb173763f2a79cd2d8bc0ff0d6f49**; prior documentation checkpoint **3c6ce20f8b6145566e4041f694cf764f8e9828ae**, PR41. Read the ten-file delta and builder remediation section. The 210-record ledger, sources and earlier reports are preserved as historical checkpoint evidence, not silently rewritten to claim current verification. This review does not restart the inventory or add primary-book access.

## Finding dispositions

| ID   | Result at 9a09dbc                                  | Evidence / limit                                                                                                                                                                                                                                                                                                     |
| ---- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DW01 | Prior narrow closure retained                      | Shared keyed `LEV_TEXT`, banner `eraVal` and landmark consumer unchanged. New implementation unit test checks I–VI. Early detailed sea-creature claims remain unverified; this is only containment of the explicit Light Bringer clause.                                                                             |
| DW02 | **Partial, two residual callback defects**         | Society fade generation/preload/final site predicate and downgrade cleanup are implemented. Positive repeated-downgrade, fresh-entry, actual stopFx, banner/caption/tour fixture checks pass. Residuals DWR-A/B below prevent closure.                                                                               |
| DW03 | Corrected                                          | Bressia now uses the conservative Kassad sentence and omits the family-death clause. No orphan pronoun; not fresh primary attestation.                                                                                                                                                                               |
| DW04 | Corrected                                          | Devil's Rest castle landmark uses the S01-supported “wants an heir rather than a child” replacement. No inverted clause remains in the evaluated pack. The earlier handoff requested both fields; the site description itself never contained that inversion and remains unchanged, with its separate source limits. |
| DW05 | Corrected                                          | Event d1 uses “Before the move to Arrakis”; castle/keep says “Before the move”. Both remove false exact-eve timing. The latter is semantically sufficient despite not copying every word of the requested replacement. S02 reused; no new source reading.                                                            |
| DW06 | **Partial omissions accepted; evidence gate open** | Named cuts/narrowings below are present. Removing room precision does not verify retained narrative, world, dates or first appearances.                                                                                                                                                                              |
| DW07 | Corrected                                          | Tabr entrance retains only the first sentence; no book-II departure clause remains in that book-I-visible description. First sentence's primary support remains a separate evidence hold.                                                                                                                            |

## DW06 precise dispositions

- Sun Eater: `borosevo/dungeons` deleted; b1j/b1n no longer target it; b1n title/text no longer asserts a Colosso basement. Liliana/Balian names removed, including the ziggurat description. **Retained narratives, exact dates and Redtine supplemental-selector question remain open.**
- Foundation: `termcity/board` deleted; f1d untied. f1h3 and f7g lose foundry/Zenow room ties; those landmarks reduced to schematic descriptions. **The retained event narratives still require passages.** `hotel/terminal` exactly adopts the S06 supported narrowing, removing the follower's claimed affiliation.
- Cosmere: orphanage landmark deleted; e35 loses landmark/effect and adopts S03's narrow Yeddaw journey sentence. This resolves those disputed ending assertions by omission, not proof of the ending. Other Yeddaw/Indicium entries retain their individual holds.
- Expanse: Ceres conference landmark deleted; b6i loses site/landmark and exact conference/leadership sequence. It still assigns `world:ceres`, which this delta does **not** verify. Railgun landmark and b6l are narrowed; b6l retains its railgun tie/effect. **Medina drum rooms are unchanged in this delta**, despite the builder's grouped wording suggesting Medina room ties were addressed. b3l/b8n, Medina and retained b6l claims still need passages.
- Hyperion: shiprest's repaired-return sentence removed; the independent book-IV b4f event remains, with its evidence requirement. Benares and Time Tombs/sphinx holds remain.
- Dune: station landmark reduced to schematic copy; d5 loses its exact station landmark and disputed named rescuers, but its battle effect/death/flight narrative remains unverified. d14/d19 and other later passages remain open.
- Society: prologue blurb now labels staging an interpretation, but its facts still name Tyche/orbit and the cinematic is unchanged. S07 is chapter 1, not the prologue. Labeling interpretation **does not close the primary-prologue hold**. Obtain the actual passage or withhold the detailed adaptation; no new canon endorsement.

Checkpoint 2 had 8 primary comparisons and 202 uncompared rows. **No new primary comparisons in this pass.** These are historical counts, not a freshly recounted current-population score: some rows now correspond to deleted/narrowed records. Use the original IDs plus the dispositions above; do not claim all 202 claims remain unchanged or that all current records are verified.

## DWR-A — residual DW02: Society EMP timeout survives book cancellation

The exact timer statement is identical to PR24 R4-C1:

```js
SITES.heliopolis._emp && setTimeout(() => SITES.heliopolis._emp(), 2500);
```

At `society.js:4791`, this timeout is neither retained for disposal nor generation/scene guarded. This review independently executes that statement with PR37's actual `setEra`/`clearForBook`; after downgrade and return, `_emp` still fires once. The PR24 review supplies the shared rationale, not a claim that its entire suite applies to PR37 (the navigation implementations differ).

**Fix:** cancel the timer in effect disposal and validate reading generation plus active scene/instance before firing. Test cancellation on downgrade, return/rebuild and same-book stop/replay, with uninterrupted playback as a positive control. No actual on-screen book-I leak is claimed; this is a reproduced stale story-effect callback.

## DWR-B — residual DW02: engine place-entry continuation can restart a hidden event

`engine.js:1380` now rechecks site eligibility before committing a transition, but `:1388` still schedules `then` with an unguarded 500ms timeout. `openEvent` supplies `()=>evInPlace(e)`. `evInPlace` only checks that the view is a place; it restores `S.ev` and schedules an effect based on that ID without rechecking the event's book. The book-click handler stops current FX/tour and clears selection in the place path; it does not invalidate this pending continuation.

Reproduction with actual evaluated Hyperion event **b2n**, book II, `hyperion/tree` (site books `[1,2]`): queue `enterPlace` with b2n's continuation, change `S.book` to I and clear `S.ev`, then drain the transition/continuation/effect callbacks. The real `siteEraOk`, `siteSeen`, `canEnter`, `enterPlace` and `evInPlace` functions allow the still-eligible site and play `battle`, restoring b2n as selected. Non-book filters and rendering are fixture dependencies, not visual evidence. The same gap applies if the downgrade happens during the 500ms interval after place entry.

**Fix:** invalidate both place transitions and their delayed event continuations on selection change; check event eligibility and destination identity at callback commit and before effect playback. Do not rely only on site eligibility or `S.ev`—the stale callback itself restores that ID. Test II→I at a site visible in both books, repeated downgrade/return, world/site change and an uninterrupted allowed event. Preserve neutral navigation. This remains within the existing High DW02 group; no new broad audit is implied.

## Actual verification and access

[remediation-checks.cjs](remediation-checks.cjs): **24 checks**, including two expected residual-defect reproductions, plus **480 existing event→landmark references** resolving after deletions. It evaluates real pack data, reuses the builder's inert sandbox fixture with additional scenarios, executes actual current functions and has no renderer/server/browser. The engine case uses actual cumulative site predicates with other filters eligible. It does not claim full scene integration.

On exact implementation head: **89/89 unit tests**, TypeScript noEmit, engine/Society syntax checks passed. Temporary dependency symlink to the already installed PR29 worktree was removed; implementation checkout clean. No new production build or rendered/mobile/keyboard tests claimed. Exact-head [CI40828887338](https://github.com/mckayec/universe-sandbox/actions/runs/40828887338) completed/success. Documentation formatting, syntax and whitespace checked. Early fixture runs required adding the inert `PLACES.focus` dependency and fixing a script-edit parenthesis; neither changed application code.

**Builder can proceed now:** implement DWR-A/B and retain the explicit DW06 evidence/omission decisions. This file is on the existing readable documentation branch/PR41; a new PR or metadata update is not needed for access. PR43's remediation already cites our published review branch, demonstrating that branch artifacts can be consumed. No direct message to Claude was sent.

Remaining ChatGPT/source work: unresolved primary passages and current-record reconciliation after future edits; remaining technical work: exact-new-head callback recheck and permitted rendered/interactive acceptance; release remains the owner's decision. No application/main edit, PR metadata action, merge or deployment.

## 2026-10-30 ledger reconciliation

[Historical-to-current mapping](ledger-reconciliation.md) now accounts for all210samples without altering the original ledger:188unchanged,18edited,4deleted;198surviving historically uncompared records retain evidence holds. Four additional six-pack content deltas are separately recorded. No new primary comparisons or callback review; existing finding-group verdict remains unchanged.

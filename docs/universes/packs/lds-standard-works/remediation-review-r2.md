# LDS remediation round 2 — exact-head content review

2026-10-31. **Implementation `dcc793c6036f9dc26ec4286d8c132c272638fd40`**, PR33. Prior reviewed head `5a9711eb2676e0b421fb093211fc0be97ae2b368`. Research/specification snapshot **`3729dbb33a98705fe8117a2aa53d9d058b870d9d`**. Builder receipt and 170-row import crosswalk on main **`fd8320936e75a26c16273156a7c27733add42df0`**, in `remediation-round2.md` and `ba07-implementation-crosswalk.csv`. The receipt releases Claude's lock and explicitly holds supplementary implementation for a separate commit after this recheck; this review does not mistake a new head for a finished build.

**Disposition: the specified primary/FM import tranche conforms at the source/data/helper level. Claude can proceed with the supplementary implementation. BA07 and release acceptance remain open.** No formal GitHub approval, merge, deployment, full canon re-certification or rendered sign-off is given.

## Checked coverage

| Measure | Result and meaning |
|---|---|
| Specification IDs | **169 / 169** resolve; minimum copy, source URL sets, books/layers and absence of invented numeric dates/geometry conform. |
| Keyed codex cards | **170 / 170**: AP09 has separate OT and NT cards but remains one research ID. One work per card. |
| Builder import mapping | **170 / 170** rows resolve to the actual tab/key with matching book/layer fields. Round-1 implementation SHAs remain valid provenance for retained cards. |
| Requested PGP-remainder titles | **18 / 18** manually checked against accepted PGP identities and passages; short descriptive titles are supported. See [title dispositions](remediation-review-r2/pgp-title-review.csv). |
| Preserved prior content | All **95** prior codex cards remain byte-equivalent as parsed data; **108** new cards bring the total to **203**. All **24 events** and **nine routes** remain equal. |
| Anchors | **34 sites** retained, with no coordinate changes. Only Salamis description and Palmyra source gate/copy changed; prior held Lystra/South Pass pins remain absent. |
| Supplementary mapping | **Not supplied**. The builder explicitly leaves SC01–54 / 1,271 SD rows for a separate commit with `supplementary-implementation.csv`. No supplementary implementation acceptance is inferred. |

[169-view comparison](remediation-review-r2/169-view-comparison.csv) carries exact keys, source/gate verdicts and payload hashes. [compare.py](remediation-review-r2/compare.py) pins the implementation and receipt SHAs and reproduces that inventory, title list and [summary](remediation-review-r2/comparison-result.json). It uses accepted research; it is not new primary-source reading. Whitespace/apostrophe normalization, BJ title terminal punctuation and the neutral AP09 title are acceptable editorial differences. FM05 includes precisely the eight witness names required by the accepted specification. AP09's URL set is assessed across its two correctly isolated cards, not by requiring an NT source link on the OT card.

## Prior findings and precise remaining actions

| Finding | Exact-head disposition | Next action |
|---|---|---|
| R1-C1 / BA02 Salamis provenance | **Closed at source/data level.** `sites[salamis].desc` equals the exact ToposText replacement sentence; coordinate and representative-point caveats remain. | Preserve the corrected active provenance. Do not restore the old Pleiades description as the source of the current point. |
| BA07 / FM01 Palmyra gate | **Closed for the requested neutral BoM facet at source/helper level.** Site has books 3/4 and BoM/D&C layers, neutral village/publication copy and year 1830. RE04 remains event group 4 / D&C and is hidden in BoM-only filtering. | Preserve source separation and approximate village identity; the marker is not the print shop. Rendered verification remains subject to evidence limits below. |
| BA01, BA03, BA05, BA06 | Prior source-level closures carry forward. Relevant route/source-split/Fayette tests and independent probes pass; existing geometry and other site data are unchanged. | Preserve those constraints while importing supplementary content; new shared identities must not reopen work-layer leaks. |
| BA07 primary/FM specifications | **169 specified IDs conform**, including AP09's two gates, the five RE date strings, J03's intended Egypt continuation and AJ01's disconnected excerpts. | No new factual/copy correction required for this imported tranche. Keep per-ID import accounting and recheck any subsequent edits. |
| BA07 supplementary content | **Open — builder implementation dependency.** The 62-category research disposition ledger is not an implementation ledger. SC01–54 requires actual retained/consolidated content and per-SD mappings; SC55–62 retains only the already authorized dense-display deferral. | Claude supplies `supplementary-implementation.csv`, including prose-only sections and dense-payload retention evidence, then returns the new exact head. Do not assume every existing primary overlap is absent; conversely, an overlapping identity alone does not import a supplementary source facet. |

The builder's phrase “none implemented yet” is treated as no completed supplementary tranche/mapping, not independent proof that none of the 1,271 rows overlaps existing content. Those rows are overlapping source views, not 1,271 distinct entities. No blanket new deferral or scope reduction is accepted.

## Research specification erratum — J03 / PJ02

The tranche-10 J03 consolidation instruction at the original research snapshot incorrectly suggested reusing PJ02. **PJ02 is Enoch's Mahujah → Mount Simeon journey; J03 is Abraham's narrated journey in Abraham 2. They must remain distinct.** The minimum attributed J03 copy was correct, and this implementation correctly creates separate cards rather than following the erroneous consolidation suggestion.

This review corrects `ba07-primary-remainder-spec.md`, the J03 generator rule and regenerated CSV. Counts, minimum copy, sources and gates are unchanged. No application fix is needed for this erratum. The earlier snapshot remains available in Git history; the correction is not presented as something the builder got wrong.

## Independent permitted validation

- `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts` on the exact implementation: **22 tests pass**, zero failures. [Saved output](remediation-review-r2/targeted-tests.txt).
- [Independent probe](remediation-review-r2/probe.cjs): all 170 keyed cards tested against all five work layers and preceding cumulative work groups; original five split identities preserved; actual route legs avoid held stops/unsupported bridge; Fayette's 1829 site/event/route match remains. Palmyra and RE04 isolation are checked directly.
- The new `date` display field is escaped by the actual `itemMeta` helper, does not activate numeric timeline filtering, and yields to a supplied numeric `when`. This verifies source/helper semantics, not UI readability. Source formatter escaping/scheme checks also pass. [Probe output](remediation-review-r2/probe-result.json).
- **13 documentation validation commands pass**: ten specification generators, original 96/256 inventory validator against its historical `c59c9bc` baseline, supplementary category validator and new disposition validator. Original historical payload counts were not rewritten to match the current build.
- Implementation CI: [41249428162](https://github.com/mckayec/universe-sandbox/actions/runs/41249428162), exact head `dcc793c`; terminal outcome is recorded in the publication handoff/final result. Do not infer an outcome while the run is pending.

## Technical and rendered evidence boundaries

Builder receipt reports `pnpm check` with 96 tests, standalone checks on 13 pages × two viewports (LDS newly included), and two successful browser-smoke runs. The changed Save/Load test now uses the count in the synchronous save toast rather than a later live count while an exhibit removes bodies. Source inspection confirms the save function takes a snapshot and emits the count synchronously, and the load assertion remains. This is a plausible race fix without deleting the assertion; this reviewer did not execute the browser flow and does not independently certify the reported cause or rendered result.

The receipt attributes six screenshots and software-rendered viewport checks to this round. **Five screenshots predate the final CSS tab-wrap change**; only `r2-codex-tabs-wrap-390.jpg` and the reported overflow probe follow it. Do not label all screenshots exact-final-head evidence. The earlier shots can support the builder's observation of unchanged content, subject to that limitation, not final layout certification. This reviewer inspected the receipt and source changes, not a new browser/server session or independent screenshot-based acceptance test.

Claude explicitly reports **real-GPU evidence unavailable** and **keyboard-only codex navigation not re-exercised**. Final same-head technical sign-off is still open. No browser/GPU workaround was attempted. CI's standalone page check, where successful, remains distinct from full interaction, keyboard, finished-surface and mobile acceptance.

## Next handoff

Claude may continue the already-authorized supplementary work now; the primary/FM review need not wait for merging PR34 or owner intervention. Keep the 169-ID / 170-card comparison as the baseline, preserve all 62 category requirements, provide exact mappings and return the changed head. ChatGPT then audits the actual supplementary copy/gates and regression delta. Real-GPU availability and same-head technical/owner release gates remain separate. Optional archaeology/LiDAR artifacts do not block conservative nonspatial imports. No merge, release or deploy authority is supplied by this review.

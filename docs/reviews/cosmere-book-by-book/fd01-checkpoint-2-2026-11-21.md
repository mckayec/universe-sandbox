# FD01 research checkpoint 2/2 — evidence reconciliation and bounded deferral

Date: 2026-11-21. Research lead: ChatGPT. FD01 here denotes the work *The Fires of December*; the historical finding FD01 separately denotes the palace/sword issue.

**The second bounded research unit is complete; the full-work audit is deferred under R3.** This is source-based web research and repository inspection, not the separate Deep Research product, a complete novel reading, a new implementation review, or release approval. Full-work approvals remain **0/33**. Preserve the accepted finite FD01-PUBLICATION-01 correction and all earlier dispositions.

## Scope and exact repository inputs

Fresh intake inspected **18/18 pack statuses and 8/8 review statuses** on current main. This folder is the only ChatGPT-owned item; no eligible research-ready/Claude parallel self-audit was found. The agreement remains active with both sign-offs. WIP remains five active packs against a limit of two; no queued pack was activated.

All three complete pack files were fetched from their exact PR heads and parsed in memory. The inspected file is `public/atlas/packs/cosmere.js`.

| PR / branch | Exact head | Pack blob |
| --- | --- | --- |
| 24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |
| 48 / feature/cosmere-reading-state | 614a391443a87cd67d27caca255d2836b5f15d37 | 179dfb810f22e3694f7751cf02c1e609ca8992f0 |

Per snapshot, selected **1/60 worlds**, **8/8 Miral sites**, **2 selected codex entries** (Valor and December), and **1/1 Miral events** on PR24/48 or **4/4** on PR37. PR37 contains **5/5** selected Miral landmarks; PR24/48 contain none. These are selected record counts, not an exhaustive atomic-claim denominator.

PR48 e63 retains exactly the accepted story-only sentence. PR24/37 retain the older publication aside outside that finite PR48 handoff. PR48 has **3/3 distinct bucket-12 work IDs**; that observation does not establish complete field-level spoiler coverage. No implementation tests or rendered cases were run in this research unit. The [accepted implementation review](implementation-review-614a391.md), its actual-parent comparison, CI observations, and explicit independent-runtime limits remain authoritative at their stated scope.

Read and reconciled:
- [Unit 1 handoff](fd01-handoff-2026-11-21.md) and [inventory](fd01-inventory-2026-11-21.json).
- [Historical supplied-ebook checkpoint](fires-of-december-primary-checkpoint-2026-11-09.md), including all 10 finding IDs, 25 connection rows and four magic-page proposals.
- [Kingseat visual addendum](fd01-kingseat-map-addendum-2026-11-21.md), blob `0131179f0e4aa82e9813fe36a7786c52e6263523`.
- [Initial 33-work ledger](audit-2026-11-06.md), current folder instructions/history and current pack-format coordinate/schema guidance. The initial ledger's Pending labels are historical and do not erase later saved checkpoints.

## Sources opened this run

Evidence types remain separate. C supports only the stated narrow proposition; L is a lead; U is unresolved.

| ID | Source / access result | Scope |
| --- | --- | --- |
| T2 | [Author-posted reading, chapters 1–2](https://www.brandonsanderson.com/blogs/blog/the-fires-of-december), live retrieval HTTP 200 | Targeted chapter-I passage read with surrounding paragraphs: December recalls the priests' account of a Prophet arriving roughly three centuries earlier and a sword remaining in the demon's beating heart. C **as local belief in this posted text**, not independently established absolute chronology. Posted reading is not proven byte-identical to the supplied or retail ebook. |
| P6 | [Official sample landing page](https://store.brandonsanderson.com/blogs/the-cognitive-realm/the-fires-of-december-sample-chapters), redirected to Dragonsteel Books, HTTP 200 | Publisher explicitly offers chapters 1–8 and links the PDF. The page confirms the public sample boundary; it does not supply later chapters. The PDF's earlier targeted checks remain attributed to unit 1, not newly repeated here. |
| G1 | [Author's Hoid's Travails gallery](https://www.brandonsanderson.com/pages/hoids-travails), HTTP 200 | Read gallery text, captions and image descriptions. Metadata describes Kingseat's body/channel relationship and a separate heart/spike illustration. This is publisher image-description evidence, not a fresh visual inspection or a late narrative chapter. |
| V1 | Kingseat raster linked by G1 | Web opening failed as inaccessible; direct download returned HTTP 403. **0 new raster inspections in this run.** The earlier addendum records two reviewers' actual visual inspection; preserve that attributed result without relabeling it as fresh verification. |
| H1 | Historical checkpoint above, supplied Dragonsteel first edition 2026, ISBN 9781938570728 as recorded there | Document reread; original full ebook was not reopened. Its late-text findings and chapter locators remain historical evidence, not newly verified narrative passages. |

A targeted official-domain search for chapters/epilogue found the posted opening, sample, publisher commentary and gallery. No accessible later primary chapters were obtained from that search; this is an access result for this run, **not a claim that later text does not exist or cannot be obtained**. No purchase, loan or account access occurred.

### Visual-source reconciliation

Retain V1's earlier narrow visual finding: a reclining giant body, city wall and red chest-fed channel are depicted together. Gallery descriptions additionally name a palace, colored branches, and a separate heart/spike image titled *Less a Sword, More a Spike*. The latter is corroborating metadata for the heart setting, not a fresh picture-based anatomical or mechanism check.

Neither image description nor the attributed city illustration establishes scaled regional geography, coordinates, directions, underground mining, monastery age, present plains vegetation, or the late release sequence. Do not turn an illustration's composition into physical measurements. The existing schematic notices remain necessary. G1 and T2 support retaining the old palace/heart distinction; they do not certify every word of a replacement or close PR37 findings.

## Historical findings — 10/10 dispositions

| Finding | This checkpoint's disposition |
| --- | --- |
| FD01 palace / sword | Retain the existing correction. T2 freshly corroborates heart placement as the local account; G1 separately supplies image-description corroboration, but neither supplies the later chamber/court sequence. PR37 palace landmark still conflates the locations; no new implementation acceptance. |
| FD02 arrival / defeat chronology | T2 freshly supports the reported three-century Prophet account. The eight-century arrival distinction and detailed device description remain H1-attributed. PR37 megalith landmark still conflates the chronology; retain correction, no closure. |
| FD03 mining | Body/tunnel rather than river mining remains H1-attributed, chapters XXV/XXVII. City illustration does not show underground structure. Retain correction and later-text gap. |
| FD04 experienced lives | Keep possible-life events separate from external history. Unit 1's sample supports the early memory distinction; later explanation and monastery sequence remain H1-attributed. PR37 e126/library cannot receive blanket approval. |
| FD05 court response | Keep the Geoffrim qualification from H1 XII–XIII. Publisher synopsis about court resistance cannot establish that every minister dismissed December. PR37 e127 remains unclosed. |
| FD06 release mechanism | H1 XXXIX–XL remains the evidence basis. Gallery heart/spike metadata cannot prove blood-contact/passphrase operation or the power-transfer sequence. PR37 e128 remains unclosed. |
| FD07 Valor / access | Preserve historical influence and qualified access wording; unit 1's chapter-IV check remains attributed. No present-residency claim, meeting claim or Valor-as-Megalith-source claim is earned here. |
| FD08 publication | Earlier edition-specific public metadata superseded the original month uncertainty. FD01-PUBLICATION-01 is already accepted on PR48 at 614a391; do not reopen it or claim October digital publication was false. |
| FD09 geography / monastery / plains | Narrow city/body/channel depiction retained from the map addendum. Exact geometry, monastery age and present uniform forest cover remain U; no regional geography approval. |
| FD10 work identity / gates | PR48's three separate bucket-12 IDs are present. No new all-fields, indirect-reference, route, search, callback or rendered gating acceptance. Preserve existing unreviewed fallback and cross-work evidence requirements. |

These are **10/10 accounted-for finding IDs**, not ten closed findings. PR37 belongs to its existing review/owner decision process; this checkpoint does not take ownership of that branch or authorize a content patch while its release scope is unresolved.

## Connection inventory — 25/25 dispositions

All chapter locators and original confidence labels remain in H1. This table records how each is carried forward; **0/25 connection rows are newly verified in full from their narrative sources this run**. No new relationship edge or identity merge is authorized.

| ID | Carried-forward boundary |
| --- | --- |
| FDC01 | Hoid's participation/narration: H1; opening and late appearances are not a complete fresh traversal. |
| FDC02 | Search for Valor is not evidence of meeting her; unit 1's opening check remains attributed. |
| FDC03 | Separate historical religious influence from the late temple/fire account and narrator uncertainty. |
| FDC04 | Jasper is a mention; no coordinates or inferred route. |
| FDC05 | Tzendish cult is a mention; world identity unassigned. |
| FDC06 | Design is an off-page mention, not an on-page appearance. |
| FDC07 | Roshar/Prophet simulacrum claim remains late-epilogue H1 evidence. |
| FDC08 | Vasher/Zahel remains a candidate identity, not a merged confirmed character. |
| FDC09 | Unnamed dragon remains unnamed; no transformation or Valor identity inferred. |
| FDC10 | Ambitional entity remains Hoid-attributed; no invented Threnody journey. |
| FDC11 | Keep Hemalurgy-adjacent qualification; no ordinary theft mechanism inferred from spike imagery. |
| FDC12 | Aon binding explanation remains H1; a geometric image description does not establish its operation. |
| FDC13 | Preserve early speculation versus later transformed-Breath explanation; not ordinary unchanged Breath. |
| FDC14 | Separate named Godsflame/Ashyn account, former belief and unknown transport mechanism. |
| FDC15 | Emotional effect is a Soothing analogy, not confirmed brass Allomancy. |
| FDC16 | Scadrian garment comparison does not establish a specific technology identity. |
| FDC17 | T'Telir comparison is not travel evidence. |
| FDC18 | Canal comparison is not a cross-world route. |
| FDC19 | Memory-backup allusion does not identify specific earlier incidents without corroboration. |
| FDC20 | Dangerous-sunrise/Canticle identification stays a candidate. |
| FDC21 | Three dragon-ruled destinations remain unnamed leads, without invented coordinates. |
| FDC22 | Rejected Cognitive Shadow/Returned/Herald/Creed Wraith comparisons are not membership edges. |
| FDC23 | Beautiful/core/bond late outcomes remain H1; do not equate every southern demon with a fragment. |
| FDC24 | Experienced lives remain distinct from external history; no unrestricted time-travel model. |
| FDC25 | Zuhel bond is a named term; no complete ruleset invented from an interrupted explanation. |

The four proposed magic modules—binding device, demon-bond cost, Hoid regeneration and experienced lives—remain **4/4 proposals**, not implemented or approved modules. Their source/gating/interaction acceptance checks in H1 survive. This run did not inspect an implementation of them or certify their absence across the entire application.

## Known gaps and continuation

| Gap | Impact / blocks what? | Disposition |
| --- | --- | --- |
| Full edition-aware narrative reconciliation, especially chapters IX–epilogue | Blocks full FD01 canon approval and fresh closure of late mechanisms/identities. | Deferred at research 2/2; preserve historical chapter evidence and confidence limits. Reopen only for a concrete new source or scoped returned implementation, not an automatic third research loop. |
| Scaled regional map / monastery-age / plains evidence | Blocks geographic and age certification; city illustration does not fill this gap. | Keep FD09 holds and schematic treatment. |
| Exhaustive atomic claims, missing content, cross-book gates and indirect references | Selected-record counts do not prove completeness. | Carry to the series coverage ledger as incomplete; no whole-work approval. |
| Current rendered checks and inherited Save/Load limitation | This documentation research supplies no new runtime result. | Preserve existing implementation-review attribution and release holds. |
| Initial 33-work ledger still uses historical Pending labels | Makes accumulated coverage and unclosed findings hard to assess. | Next bounded unit: create a current 33-row coverage reconciliation from saved checkpoints/reviews, linking latest evidence, research-cap disposition, accepted finite fixes and remaining holds for every row. Do not reset deferrals or count finite fixes as full-work approval. |

**Next owner/stage: research / chatgpt**, solely for that finite coverage reconciliation. Save it as `coverage-reconciliation-2026-11-21.md` before changing status, use exact source-document revisions, and select any subsequent actionable work from the reconciled record. Do not invent another book or silently restart FD01/AU01/CA01 or other capped units. If no eligible source-independent work remains after reconciliation, use the agreed explicit deferral/handoff rules.

No new Mckay decision is needed for this checkpoint. Existing owner decisions, accepted fixes, source holds and release gates are unchanged. No site/PR-branch edit, merge, deployment or owner approval occurred.

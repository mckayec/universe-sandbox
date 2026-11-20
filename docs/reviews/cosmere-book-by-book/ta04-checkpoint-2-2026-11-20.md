# TA04 — White Sand omnibus — checkpoint 2/2
Date: 2026-11-20
Reviewer: ChatGPT
Disposition: bounded research pass complete; full TA04 review deferred with known gaps at the agreed R3 cap. No full-work approval.
Prior checkpoint: [TA04 checkpoint 1](ta04-checkpoint-1-2026-11-20.md), saved at e963787278097c02835f2fdb4e0c0d92131566bf.

## Scope and exact revisions

Source-based web research and direct visual inspection of a lawful public sample were available. The separate Deep Research product was not invoked. This is a source/canon checkpoint, not an implementation review or release approval.

Fresh GitHub PR-head reads and actual `public/atlas/packs/cosmere.js` files at those heads were obtained in this run:

| PR | Exact head | Pack blob |
| --- | --- | --- |
| 24 | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |
| 48 | 0636b08ad9096274c793e045cc601324945844d9 | 7850087a03ff82650632d28015c755568f8d784f |

All three heads and blobs match checkpoint 1. The nine SITES_TALDAIN records remain at line 173; PR37's additional Diem hall remains at line 604. PR48's yearless omnibus registry entry is line 266, three Taldain-system world descriptions are lines 572–589, and e33 is line 780. Their existing descriptions and shared bucket 7 remain the comparison targets. No whole-pack reapproval is implied.

## Newly opened evidence and access receipt

| ID | Source / locator | Evidence class and outcome |
| --- | --- | --- |
| N1 | [Louisville Free Public Library / OverDrive, White Sand: Omnibus](https://lfpl.overdrive.com/media/10460297), public READ A SAMPLE | Catalogue identifies Dynamite, English digital edition, ISBN 9781524122713 and January 31, 2024. Library page and embedded sample opened normally without sign-in or borrowing. Reader's single-page navigation offers a 50-page sample; later table-of-contents entries show unavailable places. This is a sample limit, not a full-book reading. |
| N2 | N1 sample, printed **44**, “Sand Masters”; reader page **45** | **Direct primary page inspected visually.** Distinguishes Diem as profession and building, places the building on the Ry'DoAli's west bank outside Kezare's main island districts, and describes annual trials at Mount KraeDa's base. |
| N3 | N1 sample, printed **45**, “The Kerla”; reader page **46** | **Direct primary page inspected visually.** Describes Kerla's water, vegetation and fauna below the sand surface, contrasting it with deep sand's lower water table. These notes support limited ecological clauses, not every existing geographic claim. |
| N4 | [Author FAQ: Who Writes the Ars Arcanum?](https://faq.brandonsanderson.com/knowledge-base/who-writes-the-ars-arcanum-in-each-book/) | **Author commentary**, opened: identifies Khriss as the in-world author and Nazh's work for her. Does not establish a particular graphic-novel page's first disclosure. |
| N5 | [State of the Sanderson 2022](https://www.brandonsanderson.com/blogs/blog/state-of-the-sanderson-2022), Isaac Stewart's Creative Development section | **Production commentary**, opened: describes added prologue/reference material and revised text/art; specifically notes the German omnibus was split into three parts. Therefore a three-part foreign edition cannot be presumed to preserve the original English volumes' boundaries. |
| N6 | [Google Play omnibus catalogue](https://play.google.com/store/books/details/Brandon_Sanderson_s_White_Sand_Omnibus?hl=en-US&id=fH_xEAAAQBAJ) | Catalogue opened: January 2024 digital listing, 498 displayed pages. No Google sample narrative inspected. These digital metadata do not resolve the prior paperback on-sale-date conflict. |
| N7 | [Kezare](https://coppermind.net/wiki/Kezare), [Diem](https://coppermind.net/wiki/Diem), [Italian-site Diem redirect](https://it.coppermind.net/wiki/Underfen) | Secondary locator searches only; all three attempted page opens returned 403. Indexed snippets suggest a chapter-4 reference for sandstone, but the cited passage and edition correspondence were not inspected. **Unverified lead, not evidence closing the claim.** |

The web extractor could open the library catalogue but not its JavaScript sample redirect. The normal browser rendered the public sample and supplied N2/N3. The imprint/acknowledgments and printed contents were also visually consulted for edition context; the latter independently lists Sand Masters at 44 and Kerla at 45. Only the **2/2 requested reference passages** are counted as new substantive source coverage. Navigating past other pages does not count as reading them. Session-bound reader URLs are deliberately omitted; reproduce through N1's public sample button.

The earlier GlobalComix page-11 membership boundary and failed Graphic Policy galleries were not retried. The bare CDN sample's map/astronomy provenance remains as recorded in checkpoint 1: no blanket authentication of its other pages follows from the new OverDrive observations. No full paid copy, hidden pages, or account access was used.

## Final finite dispositions for TA04

C = confirmed within the stated narrow scope; L = limited support; U = unresolved. Neither C nor L below approves an entire record.

| Group | Updated disposition / implementation consequence |
| --- | --- |
| TA04-IDENTITY | **C** for omnibus identity from checkpoint 1 plus the new catalogue/sample chain. **U** for complete format/date reconciliation. Retain the yearless omnibus registry entry; no new date correction. |
| TA04-REVISION | **C** for revisions and additions, reinforced by N5. **U** for exhaustive original-to-omnibus page correspondence. Preserve distinct original-volume and omnibus selections. |
| TA04-ASTRONOMY | Prior **L/U** unchanged. N2/N3 do not settle stellar classes, Investiture pulses, orbital mechanism, polar geometry or earliest disclosures. **0/3 complete world descriptions newly approved.** |
| TA04-TIME | Prior **L** unchanged. No timekeeping field addition or physical-unit conversion requested. |
| TA04-GEOGRAPHY | **L**, now with direct primary support for selected ecology/trial-location clauses from N2/N3. All nine full descriptions, coordinates and their compound claims remain unapproved: **0/9**. |
| TA04-DIEM | **C** only for N2's limited identity/location observations; **U** for the stored single-block sandstone claim, modeled dimensions and earliest reveal. No import of PR37's hall into PR48; no geometry certification. |
| TA04-E33 | **U** for the entire campaign's Kerla pin, chronology and cross-edition correspondence. Reference notes do not verify the compound event or a journey. |
| TA04-BOUNDARY | **U** for field-by-field earliest-reveal mapping. N4 is external commentary, not permission to expose later identity/avatar claims to original-volume readers. No gate approval or new per-work mapping. |

**8/8 review groups dispositioned; 2/2 targeted reference pages newly inspected; 0 new implementation corrections; 0/33 full-work approvals.** This improves evidence for narrow clauses while leaving the full omnibus audit incomplete. The prior accepted TA01-KENTON-01 correction remains preserved. Existing SA07/S20/WAT06, source, runtime, Save/Load and release holds remain in force.

## Cap disposition and continuation

TA04 has consumed **2/2 bounded checkpoint units**. Defer unresolved full-book coverage under R3; do not keep scheduling the same retrieval attempts or certify completeness because the cap was reached. Reopen only with materially new authorized evidence or a newly scoped correction.

Next ledger unit: **TH01 — Shadows for Silence in the Forests of Hell**, research unit 1/2, owner ChatGPT. Establish work/edition identity and a lawful primary reading boundary; inventory its actual current-head world/site/event/codex targets and separate novella support from Arcanum Unbounded system-essay or later-work claims. Preserve the existing 33-work ledger and all prior closures. No new pack activation or WIP increase.

No application tests, rendered application checks, CI validations, PR-branch edits, merge, deployment or Mckay release approval occurred. No access blocker requires a new Mckay decision to continue the research ledger.

## Coordination receipt

Run `chatgpt-ta04-unit2-20261120T1816Z-83af`, started `2026-11-20T18:16:06Z`. Current main intake inspected **18/18 pack statuses and 8/8 review statuses**; no other owned stage or eligible stale research-ready/Claude parallel self-audit. Own lock and current status/target state are checked again before publication. Status follows only after saved-output readback.

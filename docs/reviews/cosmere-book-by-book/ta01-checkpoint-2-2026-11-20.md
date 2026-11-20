# TA01 checkpoint 2/2: edition verification and finite holds

ChatGPT, 2026-11-20 UTC. **TA01 original White Sand Volume 1 full audit deferred at the two-checkpoint cap, with Known gaps.** This closes the bounded source-retrieval unit, not the complete research. Keep stage research / owner chatgpt; next work is TA02 original Volume 2, unit 1/2. No additional implementation request, no new per-work gate, and **0/33 full-work approvals**.

## Exact repository scope

All 18/18 pack and 8/8 review statuses inspected on current main; this was the only ChatGPT-owned item. No eligible missing/stale parallel self-audit. Agreement active with both sign-offs. No queue item activated.

Complete `public/atlas/packs/cosmere.js` files fetched at these exact PR heads:

| PR | Branch | Head | Pack blob |
| --- | --- | --- | --- |
| 24 | fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 | atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |
| 48 | feature/cosmere-reading-state | 0636b08ad9096274c793e045cc601324945844d9 | 7850087a03ff82650632d28015c755568f8d784f |

Heads unchanged from the accepted Kenton return. [Implementation review](implementation-review-0636b08.md), commit bbc82f2ac94c471f1219fc4bfdb7adc96549ecc3, remains the authority for independently checked implementation evidence. Its actual-parent comparison is against 9a6e54bdf4f33364bc98b9f2482d75e1c5868857. No test or rendering rerun is claimed here.

TA01-KENTON-01 remains accepted only at its reviewed PR48 revision: Kenton's belief in sole survival is distinguished from omniscient fact. That narrow correction rests on publisher/author synopsis evidence, **not an inspected original-volume reveal panel**. It does not certify the rest of Taldain. PR24/37 retain their prior wording; no cross-branch port is requested.

## Method and source outcomes

Ordinary source-based web search/open and public sample retrieval, including Firecrawl scrape and local PDF rendering; **not the separate Deep Research product**. C = directly supported within the stated source/edition scope; L = lead requiring verification; U = unresolved. Successful HTTP delivery alone is not evidence of readable panels. No full graphic volume was read.

| ID | Opened source / locator | Result and evidence boundary |
| --- | --- | --- |
| A | [ICv2 original Vol. 1 preview, June 28, 2016](https://icv2.com/print/article/34824); [linked gallery](https://icv2.com/gallery/34824/1) | Article identifies a Dynamite 160-page hardcover and advertises cover + 8 interior pages (C, bibliographic/preview description). Gallery returned 403; **0/8 interiors inspected**. Synopsis is syndicated promotional copy, not a new primary witness. |
| B | [Reactor preview, March 18, 2016](https://reactormag.com/brandon-sanderson-white-sand-graphic-novel-preview/); [linked io9/Gizmodo article](https://gizmodo.com/one-of-brandon-sandersons-unreleased-fantasy-novels-is-1765541486) | Article bodies opened. Two discovered Reactor interior-image URLs were inaccessible to web open and were not saved by direct retrieval. No original narrative panels verified. The io9 preview lead did not expose a usable gallery in the retrieved body. |
| C | [Fort Worth Public Library / OverDrive Vol. 1](https://fwpl.overdrive.com/media/2908053); [public sample](https://samples.overdrive.com/?crid=b2f00a8a-cc77-418e-9ee4-741e87e7e349) | Listing associates the original volume with Read ISBN 9781606908877 and PDF ISBN 9781606908884 (C, catalog metadata). Web reader inaccessible; direct request returned a JavaScript reader bootstrap, not inspected panels. No borrowing/login or reader-content certification. |
| D | [Panini German Volume 1 public PDF sample](https://api.pageplace.de/preview/DT0400.9783736787865_A45263062/preview-9783736787865_A45263062.pdf); [matching retailer ISBN listing](https://www.orellfuessli.ch/shop/home/artikeldetails/A1066302884) | 20-page sample downloaded and rendered. Colophon PDF4 says first edition May 2022; digital PDF ISBN 9783736787865. PDF8 contents, PDF10 editorial foreword and PDF13 astronomy identify revised/expanded material. **C for this later sample's identity; U for equivalence to original 2016 panels.** Retailer corroborates the ISBN, not a complete original-volume text. |
| E | [English public sample 515957](https://d1vzi28wh99zvq.cloudfront.net/pdf_previews/515957-sample.pdf) | 12-page PDF. Cover identifies Volume 2; PDF7 colophon identifies 2018 and ISBN 9781524103422. PDF9 is a later recap, not original Volume 1 scene evidence. Search text mentioning Volume 1 is insufficient edition identification. Current catalog provenance unresolved: [product route](https://www.drivethrucomics.com/en/product/515957) returned an unavailable-content page. **L, route to TA02; no TA01 claim approved from it.** |
| F | [English public sample 526119](https://d1vzi28wh99zvq.cloudfront.net/pdf_previews/526119-sample.pdf) | 20-page PDF. PDF7 is a 2022 omnibus colophon; PDF10 foreword discusses revisions, PDF12 map and PDF13 astronomy are later-edition material. [Product route](https://www.drivethrucomics.com/en/product/526119) did not provide verified catalog provenance. **L for follow-up TA04 correspondence; not original-volume evidence or a certified distribution chain.** |
| G | [Bleeding Cool extended preview, June 28, 2016](https://bleedingcool.com/comics/exclusive-extended-previews-of-spirit-12-and-white-sand-1/) | Article identifies the original hardcover. Twelve linked interior filenames WhiteSandsHC-7.jpg through -18.jpg fetched as HTTP200 but all produced the same 250×250 logo placeholder. One discovered optimized CDN URL also yielded a logo. **0/12 readable interior images**; article availability is not panel availability. |
| H | [Graphic Policy original hardcover preview, June 29, 2016](https://graphicpolicy.com/2016/06/29/preview-brandon-sandersons-white-sand-vol-1-hc/) | Article opened; live image scrape exposed cover/avatar images, no readable interior sequence. No additional claim verification. |
| I | [Historical Dynamite press release URL](https://www.dynamite.com/htmlfiles/pressrelshow.html?display=PR03171641745) | 404 on this run. Not used as evidence. |

The German sample's printed pages 10–12 (PDF11–13) contain glossary/map/astronomy material, and printed pages 15/19 (PDF16/20) show the revised opening journey. These are useful edition-specific leads, **not permission to attach their geography or reveal timing to original Volume 1**. Exact German/English omnibus correspondence remains unverified. The in-world astronomy commentary must also retain its narrator/evidence status rather than becoming unrestricted omniscient physics.

### Reproducible retrieval manifest

PDF page indices below are 1-based file indices, not necessarily printed page numbers. Text extraction is not visual reading. No copyrighted sample/PDF/image is copied into this repository.

| Sample | Bytes / file pages | SHA-256 | Visually inspected pages |
| --- | --- | --- | --- |
| D German revised Volume 1 | 24,434,855 / 20 | e2bdd2dd2b42688e6af205d263e68e6f514ce9d9d4bee1155e32648f00d4986b | 4, 8, 10, 11, 12, 13, 16, 20: **8/20**. All 20 pages text-extracted; not all visually read. |
| E English Volume 2 lead | 3,986,022 / 12 | be417f76ec308c25dbb518c1d56cebb423395b97b4c422c305eef54084fe9e0f | 1, 7, 9, 11, 12: **5/12** |
| F English omnibus lead | 6,912,040 / 20 | 8199cf87ed3d330664a515375dfa8a0b612cf57275f501f8be7e2242113829c9 | 6, 7, 10, 12, 13: **5/20** |

G's twelve underlying image responses all had SHA-256 e39c94d28ee4d1a837779fd6235788a7414e1ff0ff12b53344005171713928a6 (10,487 bytes each). One original response and the optimized CDN response were visually checked as logos. Matching hashes establish duplicate responses, not twelve separately read pages. A's advertised 8 and G's 12 may overlap; do not add them into a unique-page denominator.

## Finite dispositions and Known gaps

These apply to the existing [unit-1 inventory](ta01-handoff-2026-11-20.md) and its [saved evidence](ta01-evidence-2026-11-20.json): **46/46 selected repository record instances inventoried previously (15/16/15 across PR24/37/48), not 46 verified canon claims**. This unit re-read the current packs but did not generate a new exhaustive semantic inventory.

| ID / records | Evidence status after this unit | Bounded disposition and build effect |
| --- | --- | --- |
| TA01-KENTON-01; Taldain last blurb sentence | C for qualified publisher-synopsis wording; U for original page/panel and knowledge transition | Keep accepted PR48 text. Do not restore exclusive survival as fact, add survivor identities/counts, or narrow its gate on this evidence. No new builder work. |
| TA01-ASTRONOMY; aisda, ridos, remaining taldain blurb/facts | U for original-volume earliest support; later samples are edition-limited leads | Hold stellar classes, orbital mechanism, moon/pulse interval and Investiture details from new per-work mapping. This checkpoint neither validates baseline exposure nor authorizes new fields/geometry. Need original scene or explicitly mapped later essay/omnibus source. |
| TA01-GEOGRAPHY; kraeda, kerla, kezare, kerkedasha, lraezare, nortallon, deepsand, borderocean, darkside | **0/9 site descriptions fully primary-verified for original Volume 1** | Keep all nine in the unverified backlog. Later map/glossary cannot establish original-reader knowledge. Need edition-labelled panels for position, nation, trial, water/vine, storm/UV and architectural claims. No new site, journey, coordinate or gate acceptance. |
| TA01-DIEM; PR37-only kezare/diem landmark | U for single-block construction, geometry and earliest reveal | No import to PR48; no scene certification. Need explicit original-volume architectural evidence or a schematic/omission disposition in separately authorized builder work. |
| TA01-E33; Kenton/Khriss event | C only for broad promotional premise carried from unit1; U for complete event chronology and Kerla pin | Later Volume 2 recap is not enough to locate the compound event or establish its original reveal page. Keep existing conservative gate; no new chronology, pin or journey approval. |
| TA01-CROSSWORK; Autonomy/Khriss codex and keyword-only bridges | U for TA01 earliest reveals; 98 prior keyword-hit instances are not 98 facts | Keep avatar/worldhopping/scholarly-identity and Yolen/Vax/subastral/galaxy/legend references as cross-work holds. No generic White Sand gate or full-bucket certification. |
| TA01-EDITION; registry and TA01–04 correspondence | C that inspected samples have materially different edition identities; U for complete panel correspondence and dates | TA01/02/03 remain original volumes; TA04 remains omnibus additions/revisions. A later “Volume 1” label does not prove original2016 equivalence. Keep registry/gates unchanged; do not resolve the previously recorded omnibus retail-date discrepancy by inference. |

**Full TA01 audit remains incomplete:** no complete narrative reading, original survivor scene, full low-confidence sweep, journey reconstruction or missing-content pass. The source access gap blocks completion and per-work mapping, not the already accepted narrow sentence correction or unrelated nongap work. These holds are documented review debt, not a claim that existing exposed baseline text is safe to release. No new implementation is proposed without stronger evidence.

Prior PR48 selector results (16 states, 1008 event and 144 site comparisons) are inherited from the accepted implementation review, not rerun here. Volume1-only/original-three/all-four White Sand selection remains conservatively hidden by the existing bucket fallback; this is not an approval of that bucket's canon. Builder render evidence remains attributed; independent rendered checks here **0**, complete volumes read **0**, full work approvals **0/33**. Existing Save/Load failure and all separate release gates remain.

## Continuation

TA01 is deferred at **2/2** research checkpoints. Reopen only for materially new accessible original-volume evidence or an explicit scope decision, not another cycle over the same blurbs and failed images. No Mckay decision is needed merely to continue the approved ledger.

**Next: TA02 original Volume 2 unit 1/2.** Establish an authorized, edition-labelled public preview route; E is only a lead until corroborated. Check visible narrative panels against current records, distinguish recap from scene evidence, and keep all new claims limited to the inspected pages. Preserve TA03/TA04 boundaries. Record finite findings or a precise incomplete checkpoint; do not certify a whole volume from a sample.

SA07 remains deferred at 2/2, retaining S20/WAT02 source conflict, WAT06 later-state debt, 15-unit backlog and eight bridge holds. Other review owners and prior closures remain unchanged. No application/PR-branch edits, merges, deployments or Mckay release approval.

## Run receipt

Run `chatgpt-ta01-unit2-20261120141237UTC-b72a`, started 2026-11-20T14:12:37Z. This TA01 unit prepared at 2026-11-20T14:23:00Z; preparation time is an approximate checkpoint time, not measured usage or publication completion. Publication/readback and any subsequent TA02 work are separate. Lock ownership and current status/target existence must be rechecked before writing; status changes follow confirmed output.

# TA02 checkpoint 1/2: original Volume 2 preview and source boundaries

ChatGPT, 2026-11-20 UTC. **Incomplete research; stage research / owner chatgpt retained.** This is the first bounded TA02 research checkpoint, not a full-volume reading or canon approval. No new implementation request. **0/33 full-work approvals.** TA01 remains deferred at 2/2; its accepted Kenton sentence correction is unchanged.

## Revision and scope

Complete `public/atlas/packs/cosmere.js` files were fetched at these exact revisions during this run; all three PR heads were rechecked unchanged before this checkpoint:

| PR | Branch | Audited head | Pack blob |
| --- | --- | --- | --- |
| 24 | fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 | atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |
| 48 | feature/cosmere-reading-state | 0636b08ad9096274c793e045cc601324945844d9 | 7850087a03ff82650632d28015c755568f8d784f |

This unit targets the existing Taldain/Diem/Kenton/Khriss records and their evidence boundaries. It is not a new exhaustive inventory. The prior 46 selected record instances (15/16/15) remain an inventory denominator, not verified claims. All 18/18 pack and 8/8 review statuses were inspected this run; this was the only owned item and no eligible stale parallel self-audit was found.

Method: source-based web search/open, live Firecrawl extraction, and local rendering of a public sample PDF; no separate Deep Research product. No login, purchase or full-text acquisition is claimed. C means supported only within the specified source scope; L means a lead; U means unresolved.

## Sources opened and access results

| ID | Source | Outcome / permissible use |
| --- | --- | --- |
| V2-A | [Author-site graphic novels page, Volume II section](https://www.brandonsanderson.com/pages/white-sand-graphic-novels) | C for the promotional premise: Kenton's leadership of surviving colleagues and political opposition. This is synopsis evidence, not inspected scene order or a page/panel locator. |
| V2-B | [Author-site release post](https://www.brandonsanderson.com/blogs/blog/white-sand-volume-2-is-out-today) | Opened editorial commentary by Isaac Stewart about adaptation under Brandon's direction. Supports keeping the graphic adaptation distinct from old prose; it does not verify individual atlas geography or reveal gates. |
| V2-C | [Midtown regular hardcover listing](https://www.midtowncomics.com/p/1666679-brandon-sandersons-white-sand-vol-2-hc-regular-edition) | Retrieved body explicitly lists Dynamite, release 2/21/2018 and ISBN 9781524103422. C as retailer metadata corroboration; not proof that a separate downloaded file has a verified distribution chain. |
| V2-D | [GlobalComix series](https://globalcomix.com/c/brandon-sanderson-s-white-sand) and [Volume 2 release](https://globalcomix.com/c/brandon-sanderson-s-white-sand/r/9b1a749d-26df-4224-9541-ba015d182e27) | Live extraction returned a Dynamite-labelled Volume 2 listing with a Preview control, cover and synopsis. It did not return interior panels or a usable preview-reader link. **0 narrative pages read from this route.** This does not establish that preview access requires payment; the extraction simply did not expose it. |
| V2-E | [ICv2 February 16, 2018 preview](https://icv2.com/print/article/39659); [gallery](https://icv2.com/gallery/39659/1) | Body opened, advertising cover plus 12 interiors and February 21 release. Gallery returned 403: **0/12 advertised interiors inspected**. Preview description is not panel evidence. |
| V2-F | [Graphic Policy hardcover preview](https://graphicpolicy.com/2018/02/19/preview-brandon-sandersons-white-sand-vol-2-hc/) and [2019 paperback preview](https://graphicpolicy.com/2019/08/15/preview-white-sand-vol-2-tp/) | Bodies opened. Hardcover extraction exposed cover, not an interior sequence. Paperback page linked five images, WhiteSand-Vol2-TP-Int-9-copy.jpg through -13-copy.jpg; all five web image opens returned 404. **0/5 readable linked images**. Hardcover/paperback correspondence remains unverified. Repeated synopsis copy is not independent narrative corroboration. |
| V2-G | [Public sample 515957](https://d1vzi28wh99zvq.cloudfront.net/pdf_previews/515957-sample.pdf); [associated catalog route](https://www.drivethrucomics.com/en/product/515957) | PDF identity and limited contents inspected below. Catalog route again returned an unavailable-content page. **L for narrative use pending verified catalog provenance**, despite internally consistent colophon and matching retailer ISBN. |

A GCD issue entry surfaced chapter/page-count information in search, but its body returned 403; it is not used to certify the chapter list or total pagination. Conflicting catalog page counts were not reconciled by inference. No chapter-completion percentage is calculated from them.

## Sample inspection: observation is not certification

V2-G is 3,986,022 bytes, 12 file pages, SHA-256 `be417f76ec308c25dbb518c1d56cebb423395b97b4c422c305eef54084fe9e0f`. **12/12 sample pages visually inspected** across this run; this supersedes the earlier TA01 checkpoint's 5/12 inspection count only for this same sample. No copyrighted file or image is copied into the repository.

One-based PDF indices: 1 cover; 2 logo; 3 praise; 4 decorative page; 5–6 title/art; 7 colophon; 8 map; 9 recap; 10 chapter opener; 11–12 story. The colophon gives 2018 and standard ISBN 9781524103422. Chapter 1 is labelled Honor Bound. The opening caption identifies the Diem as the Sand Masters' home; Khriss confronts Kenton. The recap separately locates an earlier encounter in the Kerla sands. These are sample observations, not a complete narrative or verified original-volume earliest-reveal sequence.

Only **2/12 file pages are inspected story pages**; the map and recap are different evidence types. **0 complete chapters or graphic volumes read.** The map is an edition-specific lead, not surveyed coordinates. Internal identity plus a matching ISBN does not resolve the missing catalog-to-file provenance.

## Bounded comparison and dispositions

All line references below are in `public/atlas/packs/cosmere.js` at the tabled heads.

| Unit | Actual records | Finding / disposition |
| --- | --- | --- |
| TA02-PROVENANCE | All prospective TA02 mappings | U: the strongest readable sample still lacks a verified catalog link chain. Keep it as L. Do not promote sample observations into accepted per-work gates. GlobalComix is a distinct publisher-labelled lead, not proof of that PDF's provenance. |
| TA02-DIEM | `kezare`, line 173 on all three heads; PR37 `diem`, line 604 | V2-G's limited opening is consistent with a Sand Master home. It does not verify the whole Kezare description, single-block white-sandstone construction, river-island geography, or modeled hall dimensions. These remain U; no landmark import or geometry approval. |
| TA02-E33 | `e33`: PR24 line 729, PR37 line 1317, PR48 line 780 | V2-A supports a broad continuing political struggle. A later recap's encounter location cannot locate the whole compound event in Kerla, and the two opening pages cannot establish the campaign chronology. Keep the pin/chronology hold; no new journey or event split proposed without adequate evidence. |
| TA02-MAP | Nine Taldain sites at line 173 | V2-G's map is a lead for label/topology comparison only. It does not certify all descriptive clauses, numeric coordinates, political details, hydrology or earliest reveals. **0/9 complete site descriptions newly verified**. |
| TA02-KENTON | Taldain blurb: PR24 around 530, PR37 around 1094, PR48 around 581 | Preserve the already accepted PR48 qualified-survival sentence and its synopsis-limited justification. V2-A does not supply the missing original TA01 panel locator. No new correction or cross-branch port. |
| TA02-BOUNDARY | TA01–TA04 and bucket 7 | Keep original Volumes 1–3 separate from omnibus additions/revisions. No evidence here resolves full original/omnibus correspondence, the TA04 date discrepancy, or the earliest reader knowledge of cross-work Autonomy/Khriss claims. Existing conservative fallback stays unchanged. |

The conclusions above are limits on what this source set proves; they are not a new certification that existing exposed baseline records are safe. No application change means no new implementation tests or rendered checks were warranted. Prior [Kenton implementation review](implementation-review-0636b08.md) remains the authority for its validation evidence. Builder reports are not independently rerun here. Save/Load, surface-render and release limits remain.

## Exact continuation: TA02 unit 2/2

1. Seek materially new, publicly readable original-Volume-2 evidence with an explicit publisher/catalog link chain. The GlobalComix release above is the specific unfulfilled preview lead; the current extractor yielded only its listing. Alternatively verify a publisher-linked sample for ISBN 9781524103422. Do not repeatedly fetch the same failed five images, 403 gallery or unavailable catalog route.
2. If accessible, compare the opening narrative, recap and map separately against `kezare`, PR37 `diem`, `e33` and the nine site descriptions at freshly checked heads. Record PDF/printed-page/panel distinctions and only the clauses actually supported. No complete-volume label from excerpts.
3. Resolve finite evidence-supported corrections immediately if any; otherwise close checkpoint 2/2 with explicit Known gaps, defer full TA02 and proceed to TA03. Do not create builder work solely to make the checkpoint look productive.

TA02 remains incomplete at **1/2**, owned by ChatGPT. No Mckay decision is required to continue this bounded research. TA01 stays deferred at 2/2 with its finite holds; prior SA07/S20/WAT06 debts and all other work states remain. No merge, deployment or Mckay release approval.

Run: `chatgpt-ta01-unit2-20261120141237UTC-b72a`, started 2026-11-20T14:12:37Z. Output publication/readback precedes the status checkpoint; lock ownership and current file versions must be rechecked before each write.

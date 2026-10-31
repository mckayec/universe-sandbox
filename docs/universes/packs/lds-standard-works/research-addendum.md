# LDS research addendum: builder questions and anchor dispositions

2026-10-27. Research revision `52adadf1558b8bba1c89ca266de682ccdc988767` (handoff `689b4959b520b5da57a6579e47877dd43726892b`). Read against main `ef345f6a52b17320076558bb2b682d2cff5c58c6` and builder checkpoint `326a572dd6ef0870f7d685c7c80daef2fa21a666`, draft PR [33](https://github.com/mckayec/universe-sandbox/pull/33). This is a bounded research response, not a final build audit or release sign-off. Builder-owned status and proposal remain unchanged. Companion files: [anchor register](anchor-dispositions.csv), [source notes](anchor-sources.md), [audit and validation](research-audit.md).

## A01 / Q01 / RR01: supplied register, with explicit limits

The register audits all **26 built proposals**, not the older ten research anchors or the proposal's unbuilt rows. It supplies exact copy and a disposition per record:

- **11 replace-representative:** directly inspected ToposText coordinate fields, cited as gazetteer representative points. These are not primary archaeological measurements or proof of narrated events. `C` means the reported point and scope are verified against that record, not that an episode occurred there.
- **13 conditional-retain-L:** the proposed number matches the opened secondary source; official site/address evidence corroborates identity where available, not the number's precision. These may remain only with the register's approximate city/site wording, explicit source and `(L)` label. If the build cannot show that qualification, withhold the point. No blanket primary-coordinate certification is given.
- **2 hold-ordinary-pin:** Lystra (AP19) and South Pass (RP12). Retain textual records and break the drawn route at each withheld stop. Do not silently skip a stop and draw the preceding and following points together.

All recommended numbers preserve the source's reported digits for traceability, **not measured accuracy**. Show approximately 3 decimals for city/island references and at most 4 for site references when coordinates are displayed; rounding is presentation, not a claimed uncertainty radius. Keep original coordinate/source metadata. A representative point does not authorize an ancient coastline, exact temple lot, room, harbor berth, footprint or recovered road. Do not substitute map viewport centers for features. Original narrative citations and work/era attribution remain necessary alongside the georeference.

### Required corrections and qualifications

**A01a — RP10, Mount Pisgah.** Replace `Near present Murray, Iowa; 1846. Coordinate pending; do not merge with biblical Pisgah.` in the restoration inventory with:

> Near Thayer, Union County, Iowa; the emigrant way station was established in 1846. The modern historic-site/cemetery reference is approximate and does not define the full settlement or an individual grave. Do not merge with biblical Pisgah.

[NPS](https://www.nps.gov/mopi/planyourvisit/mount-pisgah.htm) and the [Church's monument page](https://www.churchofjesuschrist.org/learn/locations/mount-pisgah-monument?lang=eng) support Thayer. [Iowa DNR](https://www.iowadnr.gov/places-go/state-preserves/mount-pisgah-cemetery-state-preserve) distinguishes the **one-acre preserve** from the wider historic park; do not copy Wikipedia's conflation of their areas. The proposed `41.038586,-94.113028` remains secondary `(L)`; official descriptions alone do not verify it to six decimals. Builder should carry the correction into research-derived copy; this addendum supersedes the Murray wording without rewriting the historical review.

**A01b — AP15, Paphos.** Use **Nea Paphos / Kato Paphos**, not Palaepaphos or an undifferentiated UNESCO serial-property point. [Cyprus official tourism](https://www.visitcyprus.com/discover-cyprus/culture/sites-and-monuments/archaeological-park-of-kato-pafos-paphos/) describes the relocation from Palaipafos and later capital at the harbor; [ToposText 348324PPap](https://topostext.org/place/348324PPap) provides `34.757000,32.407000`. This supports a city reference; it does not identify the site of the encounter in Acts 13.

**A01c — AP19, Lystra.** The [opened gazetteer](https://topostext.org/place/376323ULys) labels the identification low confidence and only possible at Hatunsaray. This does not meet Q01's own uncontested-pin condition. Remove the ordinary pin pending stronger evidence or a separately approved, explicitly uncertain candidate treatment. Agreement between nearby numerical points is not independent proof of identification.

**A01d — RP12, South Pass.** [BLM's numeric field](https://www.blm.gov/visit/south-pass-summit) gives `42.029,-108.025`, whereas the proposal's [secondary source](https://en.wikipedia.org/wiki/South_Pass_(Wyoming)) gives `42.3303,-108.9738`. These do not describe the same point. [NPS](https://www.nps.gov/places/000/south-pass.htm) identifies the historic crossing but the retrieved text supplies no resolving coordinate. Withhold a precise crossing pin until a direct GNIS/USGS feature or georeferenced primary map resolves the discrepancy; neither official branding nor this audit establishes which numeric field is erroneous.

**A01e — RP01 and AP33, scope of point.** Harmony's supplied number is a site-complex reference, not independently verified as the reconstructed Smith house; rename accordingly. The replacement Patmos record is associated with **Kastelli**, not an island centroid, traditional cave or vision location. Use the register copy. For Garden Grove, the NPS description explicitly says the modern town grew near the old camp: retain that distinction.

## A02 / Q02 / RR02: no canon objection to single mode

Yes: five work layers (OT, NT, Book of Mormon, D&C/history, PGP), with `spoilers.mode:"single"`, are appropriate for this reference atlas. [PACK_FORMAT §6](../../../atlas/PACK_FORMAT.md) documents the single-mode behavior. The existing research's five `first` values are work-group gates, not a claim that a reader must finish four other works before consulting D&C. Preserve them as provenance, preserve intra-work source locators, and do not present the selector as publication order or a reliable earliest-appearance chronology.

This answers the canon question, not runtime validation: final audit must check that disabled-layer notes, codex entries, route descriptions and shared-site aliases do not leak work-specific claims. Shared place copy stays neutral. Models remain visibly attributed and off by default; a visible work badge is not historical certification. This response does not sign off PR33's implementation.

## A03 / Q03 / RR05: owner-approved schematic, constrained by text

**Owner decision received 2026-10-27:** Mckay approved a separate, clearly labelled Book of Mormon internal-geography schematic and requested a paired evidence-based Americas archaeology/LiDAR comparison, beginning with review of three artifacts he says he added. This supersedes the previously pending design preference. It is not approval of particular modern identifications, the three artifacts' claims, a live map build, merge or deployment.

Use the permanent caption **“Schematic, not a real-world location map. Relationships follow the cited narrative; spacing and shapes do not represent measured distances or recovered borders.”** No Earth pins, latitude/longitude, metric scale or implied projection for the schematic. A relations diagram with unconnected components is preferable to filling gaps with invented topography.

The following narrow set was rechecked against official scripture bodies in this review. It is adequate for a first relation diagram; it is not an exhaustive new reading or a unique solution to internal geography.

| Relation | Textual evidence | Safe placement / prohibited inference |
|---|---|---|
| Land of Melek west of river Sidon | [Alma 8:3](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/8?lang=eng&id=p3#p3) | Relative west relation only; no exact city point, bank distance or river course. |
| Ammonihah north of land of Melek | [Alma 8:6](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/8?lang=eng&id=p6#p6) | Directional relation. Keep the narrated three-day journey in text; do not convert to miles. |
| Bountiful south of Desolation; bordering lands | [Alma 22:30–32](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/22?lang=eng&id=p30-p32#p30) | Regional adjacency and north/south order. The small neck connects northward/southward lands; neither its exact shape nor width is supplied. The day-and-a-half clause is not a surveyed width. |
| Jershon by the east sea, joining and south of Bountiful | [Alma 27:22](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/27?lang=eng&id=p22#p22) | Region relation, not a boundary polygon or named modern sea. |
| Moroni by east sea, south by Lamanite possession line | [Alma 50:13](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/50?lang=eng&id=p13#p13) | Narrative-era relation; do not turn the possession line into a permanent national border. |
| Nephihah between Moroni and Aaron | [Alma 50:14](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/50?lang=eng&id=p14#p14) | Betweenness only; not collinearity, midpoint or equal distance. Keep this Aaron scoped to this passage; do not merge all namesakes. |
| Lehi among northern cities, by seashore | [Alma 50:15](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/50?lang=eng&id=p15#p15) | Broad north/coast relation in the narrated construction sequence; no measured bearing. |

Alma 22:27 also associates Manti's borders and the head of Sidon with the wilderness division; show this as a contextual annotation if needed, not a solved river flow or complete drainage map. Do not force all regional statements into one precise polygon. Preserve chronology, changes and tensions already recorded in [bom-inventory.md](bom-inventory.md). Keep Arabian and American Bountiful distinct, city/land identities distinct, and pre-/post-destruction states distinct. Any broader relation set needs its own cited check rather than inheriting approval from this table.

### A03-ART01: authorized task for Claude — supply original comparison artifacts

**Requested by Mckay; pending artifact delivery, not a request to endorse their content.** Please add or link the **three original artifacts** Mckay created for the Book of Mormon/Americas archaeology/LiDAR comparison, together with their original filenames or titles, source/research context, creation/revision dates, and any underlying citations or reusable assets. Provide stable repository paths and commit SHA, identify which of the three each file represents, and distinguish generated synthesis from quoted/source material. Include rights/provenance for maps and imagery; do not upload full copyrighted source books. If they are only in the Claude project, export the originals or give an accessible owner-authorized link. Record their arrival and a disposition for this request in `research-review.md`, following the existing addendum handoff.

**Search result:** 0 of 3 positively identified. Fetched all 36 advertised branch heads (39 local remote refs including HEAD and two previously fetched review refs); examined candidate path names across those trees, relevant docs/assets, text searches for LiDAR/laser-scanning/comparison terms, recent added files and commit-message history. Main was `ef345f6`; the LDS build branch was `326a572`. No matching artifact set was found. This is a bounded repository search, not proof of absence from every attachment, deleted object, other repository or private Claude project. No access to that private project is claimed.

Existing reusable leads are [geography-evidence.md](geography-evidence.md), [geography-source-audit.md](geography-source-audit.md), [geography-record-support.md](geography-record-support.md) and [bom-inventory.md](bom-inventory.md). The `shots/b4-*`, `shots/b5-*` and `shots/rr09-*` files are builder screenshots, not identified as the requested originals. Do not count these existing files as any of the three without owner/artifact context.

**Paired-comparison review contract:** keep (1) text claim and narrative chronology, (2) actual archaeological observation with publication, survey footprint and ground verification, (3) archaeological dating method/range, and (4) proposed narrative association with its proponent and alternatives in separate fields. LiDAR can expose terrain and possible structures; it does not by itself establish ethnicity, personal identity, religious affiliation or equivalence to a named textual city/event. Distinguish acquisition date from discovery/publication date and occupation date. Record survey gaps and whether a feature is excavated, ground-checked, remotely inferred or only a press claim. Do not put unsupported associations on the schematic or promote them to ordinary Earth pins. This review sets criteria; it has not reviewed the missing artifacts or authenticated any particular new discovery.

## A04 / Q04 / RR06: display deferral accepted with accounting

Yes, defer dense contextual payloads from v1's map objects and default codex lists. They overlap and are not approximately 1,000 new independently mappable entities. This is **display deferral**, not deletion of the completed research or a finding that genealogies, greetings and allotments are irrelevant.

Keep the research payloads available as cited reference material and name the omitted families in the build report. Preserve the structured place/event/journey/codex inventories, unlocated narratives, essential people/relationships and source links; lack of a pin is not permission to omit them. The final builder report should give explicit imported/deferred/unlocated dispositions rather than claim full research-to-build coverage from the anchor count. A later people/genealogy view remains optional implementation, not work started by this addendum.

## A05 / RR07: status interpretation

The older research header and LDS-Q01 are historical checkpoint wording. Current status is `research-ready / claude`; the full-corpus research handoff is distinct from the unfinished build. This addendum does not reopen completed corpus passes or change ownership. Claude should record A01–A05 dispositions in `research-review.md`, with the two withheld pins and the artifact request still visibly open until resolved.

## Publication preflight update

Main advanced during this review to `dfcce4f4ac474f40a00ed5a9bf88fa6443ad7850`; the review branch was fast-forwarded before committing. PR33 advanced to `5897523b9cf7f75277bcf46d77c604587494c722`. The inspected pack diff adds label-priority flags and a checkpoint comment; no proposed anchor coordinates changed. Main adds checkpoint-6 notes/screenshots, not the requested comparison artifacts. The 26-row scope and dispositions above still apply; this does not audit the new label renderer.

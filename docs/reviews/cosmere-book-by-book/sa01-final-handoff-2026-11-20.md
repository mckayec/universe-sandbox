# SA01 — second checkpoint and finite geography handoff

ChatGPT, 2026-11-20 UTC. **Second/final bounded SA01 source unit. Full The Way of Kings audit deferred with Known gaps.** Two conservative description reductions are ready for Claude; neither is implemented here. This packet supersedes the first checkpoint's early-source access gap only to the extent stated below.

## Exact reconciliation

| PR / branch | Rechecked head | Rechecked cosmere.js blob |
| --- | --- | --- |
| 48 / feature/cosmere-reading-state | fccfe2c7023b93a91b52df1f812a17f0e94e3ed3 | 0d1dddaec48658936ab7a99225a9b089837a1f94 |
| 24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |

All three heads and actual files freshly fetched, unchanged from [checkpoint 1](sa01-checkpoint-2026-11-20.md). **3/3 blob matches; 57/57 selected slots remain inventoried (41 present, 16 absent).** The [inventory](sa01-inventory-2026-11-20.json) and [probe](sa01-inventory-probe.cjs) retain their original pins. The two target descriptions are identical across these three branches. PR48 is the implementation target; do not import or edit PR24/37.

## New opened primary source and boundaries

[Dragonsteel's official download announcement](https://www.dragonsteelbooks.com/blogs/the-cognitive-realm/the-way-of-kings-free-pdf-download) links [the free PDF sample](https://cdn.shopify.com/s/files/1/0266/6633/6336/files/Way_of_Kings_20.pdf?v=1723751870), advertised as the first 20%. Followed that link and read selected passages, not the entire sample or novel. This is source-based web research, not the separate Deep Research product.

Sample: 162 PDF pages; Tor, copyright 2010; trade-paperback ISBN 9780765376671; 2013/14 production stamps and 2018 updates. Not an original-first-edition collation. Printed pagination is used below; PDF page index equals printed page minus three for these passages.

| Follow-up group | Passage in linked PDF | Disposition |
| --- | --- | --- |
| e17 revenge clause | ch.1 p.41; ch.4 pp.80–82 | Revenge-war context supported. No change requested. |
| e18 composite | ch.2 pp.48–49; ch.9 pp.145–146; ch.11 pp.160–164 | Soldier/slave and bridge-leader context supported; whole survivor composite held. |
| e19 composite prose | ch.5 p.92; ch.8 pp.141–143 | Wardship acceptance and theft intent supported. No change requested. |
| shatteredplains.desc | ch.4 pp.80–82 | Replacement below supported; previous composite not certified. |
| warcamps.desc | ch.4 pp.80–82 | Replacement below supported; previous composite not certified. |
| kharbranth.desc | ch.3 pp.61–62 | City-state and steep coastal setting supported; complete record held. |

These are direct published-text passage checks (C at the stated scope), distinct from checkpoint 1's author commentary. **6/6 follow-up groups dispositioned: two event-prose support decisions, two replacement-description candidates, two partial/held groups.** This is not six wholly approved atlas records.

Other routes were checked honestly: the author chapter-3 page remains only a referral; the attempted Reactor opening/ch.9+11/ch.12+13 pages returned 403, and Hachette excerpt links did not expose additional body text. Publisher synopsis and author annotations 4/6 were inspected as their own source types, not promoted to novel scenes. No inference that inaccessible text is false or absent. The official PDF resolves part of the access gap; it does not resolve late-novel evidence or complete map coverage. Its contents list later maps outside this sample; their listing is not a reading of those maps.

## Two exact implementation requests

Both are **Low — evidence precision / conservative omission**, not proof that every omitted claim is false. Their accepted scope is the complete replacement string, with all non-description fields preserved.

### SA01-GEO-01

Target: PR48 `public/atlas/packs/cosmere.js`, Roshar site `shatteredplains.desc`.

Replace with exactly:

> An expanse of rocky plateaus divided by deep chasms, east of the Alethi warcamps. Kaladin is brought here as a slave.

The current description combines geography, gemheart hunting, a fallen fourth-moon assertion and bridge labor. The fourth-moon assertion has no verified support in this audit. Remove the unsupported composite rather than treating it as certified from a nearby true claim. The supplied replacement is supported at the passage scope in the table. This does not establish the landform's origin, geometry or any astronomy.

### SA01-GEO-02

Target: PR48 `public/atlas/packs/cosmere.js`, Roshar site `warcamps.desc`.

Replace with exactly:

> The armies of Alethkar’s ten highprinces camp in enormous craterlike rock formations west of the Shattered Plains.

The current description supplies an exact named north-to-south roster. That ordering is not verified here against an opened map/edition. Omit it pending evidence; do not label the roster disproved. The replacement retains a supported coarse description without implying precise cartographic validation.

No change to e17–e21, names, IDs, coordinates, landmark attachments, paths, parent text, books, `req`/`needs`/`in`, field gates, registry, presets or visibility policy. Do not use these descriptions to open a parent gate. Preserve CS01's already-removed northern-plateau qualifier, prior crosswalk closures and NA01-GEO-01/02. The eight PR37-only key-4 events and 26 selected landmark IDs remain outside this implementation request.

## Candidate isolation and required return

Reviewer used the pinned PR48 pack in memory: assigned exactly the two `desc` properties, checked both expected strings, then restored their original values. Full parsed-pack equality with the original returned true. **2/2 candidate assignments checked; 1/1 full-pack reversal equality.** No application file or PR branch was written. This is not an implementation test or rendering pass; **0 independent candidate rendered cases**.

Claude: implement only SA01-GEO-01/02 on PR48, adapting to a fresh head without overwriting concurrent changes. Return the exact new head and actual parent, changed-file list, both per-finding dispositions and validation evidence. Include a focused expected-payload check and an actual-parent negative control; demonstrate unchanged visibility under representative All/legacy/sufficient/incomplete reading states. Run the project's required checks and relevant rendered surfaces at desktop/mobile. Label any unavailable validation and the existing Save/Load smoke result separately; do not present an attributed report as reviewer execution. Do not merge or deploy.

After the implementation return, ChatGPT independently reviews the actual diff/files at the exact head, reruns appropriate finite checks, saves the review before status, and keeps the full SA01 audit deferred. Then proceed to SA02 / Words of Radiance (edition changes separate), subject to fresh priority/status checks. Do not start a third open-ended SA01 source pass.

## Known gaps and final SA01 disposition

| Gap | Impact | Blocks these two description reductions? |
| --- | --- | --- |
| Full novel, edition collation, complete claim inventory, missing-content/chronology/journey sweep not completed | Full SA01 audit remains deferred, not passed | No |
| e18 surgeon/background and crew-survival composite not fully verified in this unit | Whole e18 record held; no universal survival inference | No |
| e20 Tower rescue and e21 vision/death-tense/attachment evidence not checked in later primary scenes | Both whole records held; no memory-based correction | No |
| Eight PR37-only events and full text/geometry of 26 selected landmarks not audited here | No import, scene certification or parent promotion | No |
| Complete Kharbranth/Kholinar composites, later-book payloads and exact maps/coordinates unresolved | Whole selected sites and Roshar parent not approved | No |
| Removed astronomy and precise roster lack established evidence here | Keep omitted unless separately supported and reviewed | No |
| Technical/release holds, including known Save/Load smoke issue | Remain distinct from canon and Mckay's release decision | No canon clearance implied |

The original **19/19 selected record-type dispositions** remain explicit through checkpoint 1 plus this amendment. New evidence changes only the listed passage-level dispositions and two proposed descriptions. **0/5 complete PR48 key-4 event records, 0/5 complete selected base-site records, 0/33 full works approved.** Two proposed corrections, zero implemented by ChatGPT; no new mapping or parent promotion.

Handoff: **research/chatgpt → fixing/claude** for these two fields only after this file is saved and read back. Prior MB08/MB09/MB10/NA01 deferrals, D09/D10 decisions, implementation closures and separate release requirements stand. No Mckay decision required. No app/PR-branch edit, merge, deployment or release approval.

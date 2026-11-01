# Supplementary checkpoint 20: PGP concepts and article consolidation

Implementation **be4c60eab72a4db26d81d18e4f977688016721ca**, baseline **e7a532a9009b7a4bcc485a52b6f32c0a09ab9def**, prior review **07eaa45c0597f6eb49f93e01c1c2aadfb5a02a06**, accepted register **9cc874c09a3686119ca6b4c17c7e16f214fd7ab6**. Parallel content audit only; Claude retains fixing ownership, code and lock. No release or stage approval.

**S19-C1 through C4 close.** DD137 uses Joseph Smith's brother Alvin without displaying the surname early; its existing family-resolution child remains `5/pgp`. DD124 now distinguishes unnamed stake/teachers/deacons offices and the $50 per-share minimum from the $15,000 per-person maximum. DDO1 includes the institutional historical essay under its supplied attribution. The optional DD104 Johnson/Harris lot clarification also landed. These are four changed prior cards; the rest of their content remains unchanged.

**29/29 new SD rows compared:** 16 QG families and 13 article dispositions, represented by **17 parent cards plus one Cowdery child**. Twenty-eight rows meet the minimum accepted-row copy comparison; QG07 needs S20-C1 below. This is not a claim that every historical assertion was independently corroborated or that the whole PGP integration is complete. The [row comparison](supplementary-review-s20/row-comparison.csv) includes accepted context, actual copy, source sets, gates and each disposition.

## S20-C1 — display the QG07 names and ages, not a retention assertion

**SD1218 / QG07 / PGM-qg07-lamech-noah** says Noah's sons are named with distinct reported birth ages, then says the textual data are kept as given. But the card supplies neither the sons' names nor those ages. Its See-also target, **PE06 “Noah's warning in Moses”**, also lacks them. Pending **SD1244 / SC48** explicitly requires this same source-specific age payload. It is valid to consolidate the two rows later; it is not valid to treat the present generic sentence as retaining the data.

Replace the first two sentences after the work prefix with:

> Moses 8:5–13 identifies Methuselah as Lamech's father and Lamech as Noah's father. Verse 12 places Japheth's birth when Noah is 450, Shem's 42 years later (492 by addition), and Ham's when Noah is 500. These are the account's reported ages, not calendar dates harmonized with other genealogies.

Keep the Cainite/Sethite distinction, source link, stable key and `5/pgp` gate. [Moses 8:12](https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/8?lang=eng&id=p12#p12) supports the ordering and intervals. Do not silently replace it with Genesis's compressed age notice or fabricate birth years. This resolves a concrete accepted-content requirement, not a request for three new mapped places.

Acceptance: generated QG07 actually contains all three names and their respective age/interval statements. When SD1244 is implemented, map its shared payload explicitly to this view or a visibly referenced source view rather than duplicate it; keep any typed identity relationships separately accounted. No inaccessible evidence or owner decision prevents this fix.

## Checked content, children and mandatory context

- QG01–03 preserve source-specific creation, agency and expulsion as concepts/narrative ordering without geography or dates.
- QG04 retains the Cainite genealogy, occupations, Irad killing and wives' disclosure, without inventing a different victim to solve chronology. Its family prose is not authorization for more specific maternal edges than the source supports. SC48's typed-edge constraints still apply.
- QG05 preserves the Sethite line, person/land distinction, sea-east movement and the embedded account of Adam's baptism rather than assigning it to Enoch. QG06 distinguishes ancient Zion from future gathering.
- QG08–12 retain unnamed victims, Egyptus/Pharaoh co-reference uncertainty, Abraham's reported family/movement claims, uncompleted Egypt arrival, source-specific creation and attributed facsimile interpretation. They do not establish ancient population history or independently decipher the papyri. SC48's detailed identities/terms and final cross-links remain pending; these overview cards do not substitute for them.
- QG13 preserves a textual temple-to-Olives movement without route geometry. QG14 keeps the JS—History subranges, reported migrations, separate Harris trip and translation chronology. The new **PGM-qg14-cowdery-1834** follows QG14, is separately attributed and remains `5/pgp`; it is not verse 76. This satisfies the SC47 attribution requirement, not every SC49 person/material episode.
- QG15 attaches both the current Church essay and the historical scriptural passages, keeping present institutional interpretation separate from the narratives and modern ethnic identities. QG16's publication dates match the official introduction and remain document history rather than ancient chronology.
- The 13 Articles of Faith rows retain all 13 accepted table dispositions in **PGM-aof-1-13**, with references to the existing PC06/C06/PC07/C07/PC08 views. They are indexed summaries, not complete transcriptions of every phrase in the articles. The generator's `MERGE_NO_SRC` exception avoids 13 redundant chapter URLs while each consolidated mapping retains its own article locator. This is a source-reference consolidation, not 13 new events; it does not authorize removing the older views or claim final clickable cross-links.

The new `pgp-more` tab has 18 cards. All are gated to group 5 and the PGP layer; no numeric date or coordinate fields were added. The four corrected D&C cards remain group 4/D&C. Existing 74 children, including the Alvin and Sarai resolution views, are unchanged. All new See-also titles are checked by the generator, but a matching title is not proof of a typed relationship or navigable link.

## Reproducible accounting and validation

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s20/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s20/accounting.py
```

[Probe](supplementary-review-s20/probe-result.json): **18 added / four changed / 1,480 unchanged prior cards**, **1,502 total / 1,469 unique keyed cards**. All other pack data and engine JS/CSS/layers are unchanged; only the new tab is added. **550 work/layer combinations and 84 earlier-work exclusions pass.** The Cowdery child immediately follows its parent. Source sets include all three facsimiles and paired racial-context passages; the article card has one chapter URL, and DDO1's new historical source is retained.

[Accounting](supplementary-review-s20/accounting-result.json): all **1,271 SD rows** retain accepted location/declaration/hash provenance. Every old SD mapping is unchanged except DDO1's added historical-source locator. All imported/consolidated targets resolve. The generator, including `copy_pgp.py`, reproduces **pack and mapping byte-for-byte** in an isolated temporary directory. The new suppression of merged URLs is limited to SD1228; all 13 article mapping locators are retained. No application file was edited by this review.

- **1,240 imported / 31 pending SD rows:** SC48 11, SC50 9, SC52 3, SC53 4, SC54 4.
- **75 children**, seven standalone prose cards, one consolidated prose mapping. **1,354 mapping rows / 1,323 imported mapping rows / 1,299 distinct supplementary cards**. The 29 new SD imports produce only 17 parent cards because 13 articles share one card; one new child makes 18 added cards.
- **41/41 exact-head local tests passed** (`lds-pack.test.ts` and `atlas-layers.test.ts`); [output](supplementary-review-s20/unit-results.txt). Coverage, source-witness and reference-disposition validators passed, with outputs retained. These do not certify fresh source reading or complete historical accuracy.
- Exact implementation [CI 41359263128](https://github.com/mckayec/universe-sandbox/actions/runs/41359263128) completed successfully. Review-head CI terminal outcome belongs in the main handoff. CI is distinct from final rendered acceptance.

## Source evidence and honest limits

All new copy was compared against accepted SC46/47 table and surrounding prose, with prior source research reused. Five targeted official pages were checked on 2026-11-01: [Moses 5:41–53](https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/5?lang=eng), [Moses 8:5–13](https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/8?lang=eng), [JS—History 55–65 and appended Cowdery attribution](https://www.churchofjesuschrist.org/study/scriptures/pgp/js-h/1?lang=eng), [PGP introduction](https://www.churchofjesuschrist.org/study/scriptures/pgp/introduction?lang=eng), and [Race and the Priesthood, The Church Today](https://www.churchofjesuschrist.org/study/manual/gospel-topics-essays/race-and-the-priesthood?lang=eng). These support the sampled sensitive payloads and correction, not a new complete PGP reading. S19 closures reuse already-read evidence and supplied corrections. No raw captures or retrospective access hashes are committed.

At this head the receipt and screenshots still concern checkpoint 19. No new S20 rendered evidence is in the delta. Main status still describes S19 and remains fixing/claude. This is a parallel review of published code, not a final stage handback; no reviewer browser, DOM or server was run.

## Next implementation and acceptance gates

Claude can continue without a new owner decision: apply S20-C1, then the 31 pending rows and explicit mandatory integration. In particular:

1. **SC48:** retain 11 identity/term dispositions, including co-reference limits, homonyms, explicit versus inferred parentage and source-specific ages. QG overview imports do not close these rows.
2. **SC49:** despite having zero SD rows, its entire JS—History person/material prose remains required: source spellings, unnamed identities, employment/failed mine, marriage, relayed Harris testimony and material episodes. QG14 and the Cowdery attribution child cover only part of it; provide an explicit target crosswalk.
3. **SC50/51 and SC52–54:** finish front-matter consolidation and attributed geography/model references without turning proposed models into settled sites. Preserve the zero-row prose requirements as well as rows.
4. Finish the broader BA07 omission/consolidation, source/identity/vision, timeline and typed-link accounting. Imported codex cards do not alone prove those behaviors. Existing approval for the schematic remains separate; missing archaeology/LiDAR artifacts do not block these Earth-atlas corrections.
5. Return changed code for exact-head content recheck and supply same-head technical/rendered, native-select, keyboard and real-GPU evidence before final owner release. No approval, merge, deployment or release is made here.

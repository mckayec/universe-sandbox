# Supplementary checkpoint 9: apparatus and poetic places

Reviewed 2026-11-01. Implementation **a3ac8f89d3e501eea41a83f4ab31a12b9de8ca95**, baseline **0171db7e863b196a25993dec20999907bac43012**. Requested `8c337756dbc8998dba0019335e019fe7050991a9` has identical application, generator and mapping bytes; its successor only adds four screenshots and an eleven-line checks receipt. Prior review: `60eaa5b85d9a2905214767c5b39c3c87eee43ff2`. Accepted disposition witness: `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`, unchanged research reused, not newly reread canon.

**Verdict: bounded tranche substantially conforms; S9-C1 small comparison-payload correction required; integration and full acceptance remain open.** Claude remains fixing/claude. No approval, merge or release.

## Coverage and reproducibility

All 31 newly imported SD rows (SD0701–0726, SD0758–0762), both new children and all three changed older cards compared. [Row-by-row copy/source inventory](supplementary-review-s9/row-comparison.csv), [children](supplementary-review-s9/children.json), [accounting script](supplementary-review-s9/accounting.py), [actual pack/layer probe](supplementary-review-s9/probe.cjs). Thirty new SD contexts conform to minimum source copy; SD0760 needs S9-C1. This does not certify shared-entity integration: SD0721 expressly remains incomplete there. Both new child contexts conform, with later-work gates tested.

All 1,271 SD identities, research hashes, source locations and original declarations reconcile. The only work-gate override is explicitly recorded for SD0706. Totals: **731 imported / 540 pending SD rows**, seven standalone prose cards, one consolidated prose view, 33 children. There are 1,312 mapping rows, 772 imported mappings and 760 supplementary cards. Eleven SD consolidations plus the prose consolidation account for the difference; SD0705 now maps to the existing Ezekiel 42 child rather than another card. New cards: 32. Whole pack: 963 cards, 930 unique keyed cards; 928 older cards unchanged. No scene, route, chronology or engine/layer change.

Source links newly resolved for SC30 match its chapter/verse locators; SC29 splits the D&C 113 source out of the OT parent into its child. The shared JST Isaiah 29 source remains on the explicit OT comparison and later editorial child; external chapter links may themselves contain later material, and are not filtered scripture viewers. No new coordinate/date, modern identification or travel assertion is introduced. Isolated generator regeneration reproduces pack and mapping byte for byte.

## Closed earlier findings

- **S8-C1 closes:** `OTM-samaria` distinguishes Jeremiah's mountains of Samaria from a city location.
- **S8-C2 closes:** `OTM-j22-temple-tour-46` names 46:1 and 19–24 and adds 44:1–3 for the outer-gate distinction.
- S7 chapter payload and earlier gate corrections remain unchanged except the intended Ezekiel 42 apparatus addition.
- **S3-C1 remains open:** SD0214, SD0238 and SD0240 have no new required child payload in this delta. Do not close these from aggregate import counts.

## S9-C1 — actually supply the KJV side of Psalm 24

Location: `supplementary-build/copy_wp.py`, SD0760 / `OTW-c13-jst-psalm-24`; generated `ot-more` card. Current final sentence: “Shown alongside the KJV’s gate imagery; no literal road is drawn.” No other built card supplies Psalm 24, and this card links only the JST selection. The accepted WP-C13 requires preserving the KJV imagery alongside it. Naming an absent comparison is not its payload.

Keep the first sentence, then replace that final sentence with: **“In the KJV, gates and everlasting doors are called to lift up so that the King of glory may enter. This imagery is kept distinct from the JST selection; neither is drawn as a literal road.”** Add a source labelled **Psalm 24:7–10 (KJV)** linking [Psalm 24](https://www.churchofjesuschrist.org/study/scriptures/ot/ps/24?lang=eng). Retain the existing [JST selection](https://www.churchofjesuschrist.org/study/scriptures/jst/jst-ps/24?lang=eng), `books:[1]`, `layers:['ot']`. Acceptance: inspect actual generated copy and both source links, unchanged geometry, and gate tests. No missing source or owner decision blocks this correction.

## Six builder readings and integration limits

1. **JST Isaiah 29 editorial child:** conforms. [Official introduction](https://www.churchofjesuschrist.org/study/scriptures/jst/jst-isa/29?lang=eng) explicitly supplies the Book of Mormon interpretation before numbered verses. The card attributes it and the actual helper excludes it before group 3 and from OT-only selection. This is not a new American Ariel location.
2. **Ezekiel 37 heading:** conforms. [Official heading](https://www.churchofjesuschrist.org/study/scriptures/ot/ezek/37?lang=eng) identifies the two works; verses 16–22 explain reunited Israel. The separate `3/bom` card retains this distinction; SD0691's earlier OT context is unchanged.
3. **Tarshish:** conforms to accepted context. Jonah's intended destination is not reported arrival; Psalm 48's ships and Psalm 72's tribute remain separate references. Chapter-only source labels are adequate but verse labels 48:7 and 72:10 would improve navigation. No country identification follows.
4. **Bathrabbim/Heshbon:** copy conforms to [Song 7:4](https://www.churchofjesuschrist.org/study/scriptures/ot/song/7?lang=eng). Its requested shared Heshbon identity attachment is **not implemented**. This is a builder-disclosed integration hold, not a new incorrect geographical claim. Preserve SD0721 as copy imported / identity integration pending; create or reuse a source-supported nonspatial Heshbon identity and attach this poetic facet, without a pool/gate pin or invented modern position. A free-standing name is not a typed relationship. Do not mark the category fully integrated before this is recorded and checked.
5. **Jerusalem:** omitting implementation-only future NT/BoM gate instructions from reader prose is correct. The OT note is isolated and unchanged broader layer data retains the existing gate boundaries; later facets are not certified by this note alone.
6. **Mount of Olives:** prophecy is explicitly attributed; future splitting does not alter the physical mountain. Source-only representation conforms. This does not establish a separate rendered vision mode or certify final integration.

D&C 113's child retains the accepted stem/rod/root distinction and no unnamed servant is identified. Its Isaiah 52 material belongs to the separately gated DD113 source context; this new six-verse child is not a claim to import all of that section. The five selected JST views remain bounded study-help comparisons, not all JST material or substitute Bible text. Other shared-place prose pointers preserve narrative identity without claiming typed-link implementation. SC31/32/34 and SC35–54 remain pending, including later editorial interpretations and full identity/vision-mode integration.

## Evidence and validation limits

Fresh official retrieval on 2026-11-01: JST Isaiah 29 (introduction and all eight verses), Ezekiel 37 (heading and relevant joined-stick verses), Psalm 24 (including 7–10), Song 7 (including 4). URLs above. These four readings resolve the identified questions, not all 31 source bodies. Other comparisons reuse the accepted chapter ledgers/disposition text; source URLs and hashes alone are not proof of fresh reading or historical truth. No source access failure blocks the bounded correction.

Locally observed: **30/30 targeted unit tests**, **875 actual helper gate combinations** and three later-work all-layer exclusions; duplicate-key, nonspatial/date, full prior-pack regression and isolated generator checks pass. The three standing coverage/source-witness/reference validators pass; their results concern integrity, not renewed canon certification. Test files and pack bytes are identical between requested and final heads. No local full pnpm check or browser/server was run.

The successor receipt reports pnpm check 104/104, dist checks, 13 pages × two viewports and SwiftShader/DOM-driven captures. These are builder reports. I inspected the supplied 390×844 screenshot: it shows the OT parent, separately badged D&C child and Ariel parent in the reference panel. This is screenshot inspection, not independent interactive/native-select/keyboard/real-GPU acceptance. Four new captures do not close those expressly open gates.

Requested-head CI [41309463305](https://github.com/mckayec/universe-sandbox/actions/runs/41309463305) completed success. Final-head CI 41309951511 was still running its standalone-pages step during writing; terminal result will be recorded separately. Passing CI never supplies final content, rendered or owner release approval.

Claude can implement S9-C1 while continuing 540 pending SD rows (59 remaining OT rows in SC31/32/34), the three S3-C1 families and outstanding identity/vision integration. Keep final same-head content/technical/rendered and owner release gates. Q03 schematic is already approved; separate archaeology/LiDAR artifacts do not block current Earth corrections.

# Book of Mormon — textual inventory and coverage ledger

Research checkpoint, 2026-10-26; repository baseline `cd85ea8dcb36d4d5b54afd5ec05bc03c2c173d79`. This supplements `research.md` and `geography-evidence.md`. It supplies implementation-ready **text records**, not approved Earth-map geometry or a complete atlas. No dedicated Deep Research tool was used.

## Record contract

All records here have `layer: bom`, `first: 3`, using the proposed work navigator in `research.md`. This is a whole-work gate, not a claim that all facts appear in 1 Nephi. Each record retains its actual passage. If chapter-level spoiler controls are introduced, derive their gates from those passages; do not interpret the numeric 3 as scripture book three. Quoted copy is original proposed display text, not a quotation from scripture.

Every factual statement is **textual narrative**. `(C)` means confirmed against an opened official scripture page; it does not establish historical occurrence, archaeological identification, or modern coordinates. `when` is omitted for all entries. Any dates below are narrative calendar values, not independently established CE/BCE dates. No historical/scholarly conclusion is inferred from the scriptures. Tradition/model notes remain in `geography-evidence.md`, and independent historical scholarship remains outstanding.

Design: unlocated records use text/codex navigation until the engine supports a safe nonspatial place view. Do not assign artificial `lat/lon`, relative Earth offsets, exact road lines, or invented boundary polygons. All newly defined places have `parent: earth`, `modern: unknown`, `position: unlocated`, unless a textual relation is supplied. City and land of the same name share one *research* record here; split their geometries only after evidence supports it. No aliases are asserted except those explicitly stated.

## Coverage of all 15 constituent books

The ledger means **selected passage coverage**, not whole-book completion. The remaining-scope column distinguishes missing overview themes from detailed inventory expansion; neither implies a need to invent a location for every discourse or battlefield. Earlier 1 Nephi/Ether opens are reused, not counted as fresh independent verification.

| Book | Opened coverage and usable records | Remaining scope |
|---|---|---|
| 1 Nephi | 2,16–18: journey spine, Lemuel/Shazer, Nahom, coastal Bountiful, landing [B01–B04] (C) | Brass-plates/Ishmael return journeys, visions and theological codex, 19–22 |
| 2 Nephi | 5: migration and settlement named Nephi [B05] (C) | Lehi's discourses, Isaiah passages, doctrine of Christ, detailed temple record |
| Jacob | 7: Sherem dispute and transfer to Enos, BC01 [B06] (C) | Temple sermon, allegory and covenant concepts, chapters 1–6 |
| Enos | 1: prayer and concern for both peoples, BC02 [B07] (C) | Fuller record-preservation/chronology analysis; no named prayer site warranted |
| Jarom | 1: teaching and record succession, BC03 [B08] (C) | Fuller chronological and cultural analysis; no invented city list |
| Omni | 1: Mosiah's migration, Zarahemla, record keepers [B09] (C) | Zeniff expedition's complete two-stage route; Coriantumr encounter context |
| Words of Mormon | 1: editorial bridge, BC04 [B10] (C) | Benjamin-war background; record composition chronology |
| Mosiah | 2,7,17–18,22–24: Benjamin, Alma/Abinadi, Mormon, Limhi/Alma migrations [B11–B17] (C) | Zeniff/Noah reigns, Abinadi discourse, Limhi expedition, conversions, judge transition |
| Alma | 8,17,22,27,50,62: ministry route, Sidon/Manti topology, Jershon, selected eastern campaign [B18–B23] (C) | Ammon/Lamoni's complete mission, Ammonihah aftermath, Antionum, major discourses, western campaigns, Hagoth |
| Helaman | 3,13: northward migration and Samuel at Zarahemla [B24–B25] (C) | Nephi/Lehi mission and prison, chief judge murder, famine, Gadianton context, full Samuel prophecy |
| 3 Nephi | 8,11–12,17–18,20–21,23,27–28: destruction, appearance (existing E07), healing, selected sermons/ordinances, gathering, records and disciples [B26–B28,B47–B53] (C) | Overview themes still to expand: birth signs/political collapse, prayer/other-sheep discourse, Malachi teaching. Detailed verse-by-verse treatment remains outside this selected inventory |
| 4 Nephi | 1: rebuilt Zarahemla, community and division [B29] (C) | Full succession and dated societal transitions; no survey of all unnamed cities |
| Mormon | 2,6: early retreat and Cumorah [B30–B31] (C) | Ammaron/Shim, intervening retreat, final exhortations, Moroni's continuation in 8–9 |
| Ether | 1–3,6,15: origin/sea journey, landing, last campaign [B32–B36] (C) | Royal succession, settlement geography, prophets, New Jerusalem, complete wars |
| Moroni | All 10 chapters opened: survival, ordinances/church practice, faith/hope/charity, childhood baptism, wartime letter and closing exhortation [B37–B46] (C) | Selected overview now covers every chapter; full all-claims/chronology audit and separate detailed place records for Sherrizah/Moriantum remain |

## Place inventory

**Reuse, do not duplicate:** P08 `jerusalem`, P09 `waters-mormon`, P10 `bountiful-temple` from `research.md`. Reuse `bom-nahom`, `bom-bountiful-arabia`, `bom-first-landing`, `bom-great-tower`, `bom-nimrod-valley`, `bom-moriancumer`, `bom-shelem` from the geography supplement. They have `first:3` in this inventory's navigator. American Bountiful below is a region parent for P10, not Arabian Bountiful. Jershon below is not P19's PGP Jershon.

| ID; display name; type | Exact short copy / textual position; source | Events / later state |
|---|---|---|
| BP01 `bom-lemuel`; Valley of Lemuel; valley | “Lehi's family camps in a valley beside the river he names Laman, near its outlet to the Red Sea.” 1 Ne 2:6–14 [B01] (C) | BE01 |
| BP02 `bom-shazer`; Shazer; camp | “The travelers name a camp Shazer after four days of travel generally south-southeast.” 1 Ne 16:12–13 [B02] (C) | BJ01 |
| BP03 `bom-nephi`; Nephi / Lehi-Nephi; land/city | “Nephi's followers name their settlement Nephi after withdrawing into the wilderness.” 2 Ne 5:5–8 [B05] (C). Mosiah 7:1,6–7 uses Lehi-Nephi and Nephi in Limhi's setting. [B12] (C) | BE05, BE08–09; later states remain passage-labelled |
| BP04 `bom-zarahemla`; Zarahemla; land/city | “Mosiah's people reach Zarahemla and unite with its inhabitants.” Omni 1:12–19 [B09] (C) | BE06–07, BE09, BE11, BE14, BE16–17, BE19; burned then rebuilt [B26,B29] (C) |
| BP05 `bom-shilom`; Shilom; land | “Limhi's domain includes Shilom; his escaping people later travel around it.” Mosiah 7:7; 22:11 [B12,B15] (C) | BE09 |
| BP06 `bom-hill-north-shilom`; Hill north of Shilom; hill/camp | “Ammon's search party camps at a hill north of Shilom.” Mosiah 7:5 [B12] (C) | BE08 |
| BP07 `bom-helam`; Helam; land/city | “Alma's people establish Helam after fleeing into the wilderness.” Mosiah 23:1–5,19–20 [B16] (C) | BE10–11 |
| BP08 `bom-valley-alma`; Valley of Alma; camp | “Alma's people name this valley after their leader during their escape from bondage.” Mosiah 24:20 [B17] (C) | BE11 |
| BP09 `bom-sidon`; Sidon; river | “Alma locates Melek west of Sidon; a later geographical account associates Sidon's head with the borders of Manti.” Alma 8:3; 22:27 [B18,B20] (C) | No modern river identity or full flow course asserted |
| BP10 `bom-manti`; Manti; land | “Alma travels southward from Gideon toward Manti.” Alma 17:1 [B19] (C) | Narrative meeting context; no event site fabricated |
| BP11 `bom-melek`; Melek; land | “Alma teaches in Melek, west of the river Sidon.” Alma 8:3–5 [B18] (C) | BE12 |
| BP12 `bom-ammonihah`; Ammonihah; city | “Alma reaches Ammonihah after travelling north from Melek.” Alma 8:6 [B18] (C) | BJ06; no later destruction in base text |
| BP13 `bom-gideon`; Gideon; land | “Alma returns from Gideon to Zarahemla; a later campaign brings Moroni to Pahoran here.” Alma 8:1; 62:3–6 [B18,B23] (C) | BE14; later clause must remain attached to Alma 62 |
| BP14 `bom-bountiful-americas`; Bountiful (Americas); land | “Alma's geographical account places Bountiful south of Desolation.” Alma 22:30–31 [B20] (C) | P10 is the temple record, not another spelling of this region |
| BP15 `bom-desolation`; Desolation; land | “Desolation borders Bountiful on the northward side.” Alma 22:30–31 [B20] (C) | Keep separate from modern places called Desolation |
| BP16 `bom-narrow-neck`; Small neck of land; landform | “Alma describes a small neck between the land northward and land southward.” Alma 22:32 [B20] (C) | No kilometer width or modern isthmus assigned |
| BP17 `bom-jershon`; Jershon (Book of Mormon); land | “The Nephites offer Jershon to the people of Anti-Nephi-Lehi. It lies by the eastern sea, south of Bountiful.” Alma 27:21–22 [B21] (C) | BJ07 |
| BP18 `bom-moroni-city`; Moroni; city/land | “The Nephites found Moroni by the east sea near the southern boundary.” Alma 50:13 [B22] (C) | BE17: sinks into sea in 3 Ne 8:9 [B26] (C) |
| BP19 `bom-nephihah`; Nephihah; city/land | “Nephihah is founded between Moroni and Aaron.” Alma 50:14 [B22] (C) | BE13–14 |
| BP20 `bom-aaron-alma50`; Aaron (Alma 50); city | “Aaron is one of the two city references used to locate Nephihah.” Alma 50:14 [B22] (C) | Do not assume identical to every Aaron mentioned elsewhere |
| BP21 `bom-lehi-city`; Lehi; city/land | “Alma names Lehi among new northern coastal cities.” Alma 50:15 [B22] (C) | BJ08; distinguish from the person Lehi |
| BP22 `bom-land-northward`; Land northward; region | “Helaman describes emigrants from Zarahemla reaching the land northward, with many rivers and large waters.” Hel 3:3–4 [B24] (C) | BE15; no continental boundary asserted |
| BP23 `bom-angola`; Angola; city | “Mormon's forces fortify Angola but are driven out.” Morm 2:4 [B30] (C) | BE20 |
| BP24 `bom-david`; David; land | “Mormon's account says his people are driven from the land of David.” Morm 2:5 [B30] (C) | BE20 |
| BP25 `bom-joshua`; Joshua; land | “Mormon's forces reach Joshua at the western seashore.” Morm 2:6 [B30] (C) | BE20 |
| BP26 `bom-cumorah-ramah`; Cumorah / Ramah; hill and surrounding land | “Mormon gathers his people around Cumorah in a region of waters. Ether calls the hill where Mormon hid records Ramah.” Morm 6:2–6; Ether 15:11 [B31,B36] (C) | BE21,BE23; textual identity only, no modern hill asserted |
| BP27 `bom-jaredite-landing`; Jaredite landing; unnamed shore | “Ether describes the travelers reaching a promised shore after their sea voyage.” Ether 6:11–12 [B35] (C) | BE22; not automatically the Lehite landing |
| BP28 `bom-ripliancum`; Ripliancum; waters | “Coriantumr retreats to the waters called Ripliancum before another battle.” Ether 15:7–9 [B36] (C) | BE23 |
| BP29 `bom-ogath`; Ogath; camp | “Shiz's army retreats southward and camps at Ogath.” Ether 15:10 [B36] (C) | BE23; do not send Coriantumr through Ogath |
| BP30 `bom-benjamin-temple`; Benjamin's temple assembly; temple setting | “Families gather around the temple to hear Benjamin, who addresses them from a tower.” Mosiah 2:1–8 [B11] (C) | BE07; context is Zarahemla, no measured temple layout |

## Event records

All `book:3`, `first:3`, `layer:bom`; all dates are text strings. `places` resolve above or in the explicit reuse list. These are additions; existing E05–E07 remain and are not counted again. A precise locality not stated in a passage is not invented for a map event.

| ID / title | Places; figures; passage | Narrative date and exact proposed copy |
|---|---|---|
| BE01 — Camp in Lemuel | BP01; Lehi's household; 1 Ne 2:6–14 | No absolute year. “Lehi's family camps beside a river and offers thanks.” [B01] (C) |
| BE02 — Burial at Nahom | `bom-nahom`; Ishmael, family; 1 Ne 16:34–35 | No absolute year. “Ishmael dies and is buried at Nahom; his daughters mourn.” [B02] (C) |
| BE03 — Ship commanded | `bom-bountiful-arabia`; Nephi; 1 Ne 17:5–8 | No absolute year. “At coastal Bountiful, Nephi receives a command to build a ship.” [B03] (C) |
| BE04 — Lehite arrival | `bom-first-landing`; travelers; 1 Ne 18:23–24 | After many days at sea. “The company arrives, pitches tents and plants seeds.” [B04] (C) |
| BE05 — Settlement of Nephi | BP03; Nephi's group; 2 Ne 5:5–8 | No absolute year. “Nephi and those who accompany him withdraw into the wilderness and name their settlement Nephi.” [B05] (C) |
| BE06 — Mosiah reaches Zarahemla | BP03,BP04; Mosiah and communities; Omni 1:12–19 | No absolute year. “Mosiah leads a group out of Nephi; in Zarahemla the two communities unite.” [B09] (C) |
| BE07 — Benjamin's assembly | BP30,BP04; Benjamin, families; Mosiah 2:1–8 | No absolute year assigned. “Benjamin addresses the assembled families from a tower near the temple.” [B11] (C) |
| BE08 — Ammon finds Limhi | BP06,BP03; Ammon, three companions, Limhi; Mosiah 7:4–9 | After forty days wandering. “Ammon and three companions encounter Limhi, are imprisoned, and receive a formal audience two days later.” [B12] (C) |
| BE09 — Limhi's escape | BP03,BP05,BP04; Limhi, Ammon, people; Mosiah 22:11–14 | No absolute year. “Limhi's people leave by night, skirt Shilom and join Mosiah's people at Zarahemla.” [B15] (C) |
| BE10 — Helam established | P09,BP07; Alma's people; Mosiah 23:1–5,19–20 | Eight days' flight precede settlement. “Alma's community flees into the wilderness and builds Helam.” [B14,B16] (C) |
| BE11 — Alma's deliverance | BP07,BP08,BP04; Alma's people; Mosiah 24:18–25 | One day's travel to valley, then twelve days after leaving it. “Alma's people escape bondage, pause in a valley and reach Zarahemla.” [B17] (C) |
| BE12 — Teaching at Melek | BP11; Alma; Alma 8:3–5 | Tenth year of judges. “Alma teaches at Melek, where people come to be baptized.” [B18] (C) |
| BE13 — Nephihah founded | BP19,BP18,BP20; Nephite settlers; Alma 50:13–16 | Twentieth year of judges. “Nephihah is founded between Moroni and Aaron.” [B22] (C) |
| BE14 — Moroni and Pahoran's campaign | BP13,BP04,BP19; Moroni, Pahoran; Alma 62:3–8,14–26 | Thirtieth and thirty-first years of judges. “Moroni joins Pahoran, restores him at Zarahemla and helps retake Nephihah.” [B23] (C) |
| BE15 — Northward migration | BP04,BP22; emigrants; Hel 3:3–12 | Forty-sixth year of judges. “Many leave Zarahemla for the land northward; the account describes settlement and scarce timber.” [B24] (C) |
| BE16 — Samuel on the wall | BP04; Samuel; Hel 13:1–4 | Eighty-sixth year in Helaman's sequence. “Refused entry to the city, Samuel preaches from its wall.” [B25] (C) |
| BE17 — Cities destroyed | BP04,BP18; inhabitants; 3 Ne 8:5–12 | Year 34, first month, fourth day in the narrative. “A storm accompanies destruction: Zarahemla burns and Moroni sinks.” [B26] (C) |
| BE18 — Healing the multitude | P10; Jesus, multitude; 3 Ne 17:5–10 | Following the appearance narrative; no exact day assigned here. “Jesus responds with compassion and heals those brought to him.” [B28] (C); P10 setting carried from 3 Ne 11 [B27] (C) |
| BE19 — Zarahemla rebuilt | BP04; community; 4 Ne 1:7–8 | Exact construction year not supplied. “Zarahemla is rebuilt among the cities renewed after destruction.” [B29] (C) |
| BE20 — Early northern retreat | BP23,BP24,BP25; Mormon's forces; Morm 2:3–6 | Begins in narrative year 327. “Mormon's forces retreat through Angola and David to Joshua near the western sea.” [B30] (C) |
| BE21 — Gathering at Cumorah | BP26; Mormon, Moroni, people; Morm 6:2–15 | Gathering after 384 years have passed; battle follows. “The people gather around Cumorah; Mormon records a devastating defeat and survivors.” [B31] (C) |
| BE22 — Jaredite arrival | BP27; Jaredite travelers; Ether 6:11–12 | 344 days on the water; no BCE conversion. “The travelers reach the promised shore and give thanks.” [B35] (C) |
| BE23 — Final Jaredite gathering | BP28,BP29,BP26; Coriantumr, Shiz, armies; Ether 15:7–13 | No absolute year. “After battle at Ripliancum, Shiz camps at Ogath and Coriantumr at Ramah as the armies gather.” [B36] (C) |

## Ordered journeys

All `first:3`. The arrows express narrative order only. No line is a recovered road or a claim to modern distance. Intermediate unnamed wilderness is compressed, with the omission disclosed. Route lengths remain the source's travel times rather than speculative kilometers.

| ID; travelers | Ordered place IDs | Leg evidence and exact label |
|---|---|---|
| BJ01; Lehi's migrating household | P08 → BP01 → BP02 → `bom-nahom` → `bom-bountiful-arabia` → `bom-first-landing` | 1 Ne 2:4–14;16:12–14,33–34;17:1–8;18:23. Named-stop sequence; intervening camps and return trips excluded. “Lehi's migration: selected narrative stops.” [B01–B04] (C) |
| BJ02; Nephi's group | `bom-first-landing` → BP03 | 2 Ne 5:5–8 states departure from brothers to Nephi. First-landing endpoint is broad prior setting, **not** proof departure was from the landing beach. “Withdrawal into the wilderness; exact starting site unknown.” [B04,B05] (C) |
| BJ03; Mosiah's group | BP03 → BP04 | Omni 1:12–13 directly states departure and arrival, wilderness intermediate. “Mosiah's migration to Zarahemla.” [B09] (C) |
| BJ04; Ammon's party, then Limhi's people | BP04 → BP06 → BP03; return BP03 → around BP05 → BP04 | Mosiah 7:1–7 and 22:11–13. Separate outbound search from collective escape; only Ammon and three companions descend from the camp initially. “Search for Limhi; later escape to Zarahemla.” [B12,B15] (C) |
| BJ05; Alma's community | P09 → BP07 → BP08 → BP04 | Mosiah 18:34–35;23:1–5,19–20;24:20–25. First segment eight days; Helam is a settled interval, not a single overnight stop; valley-to-Zarahemla twelve days. “Alma's community: refuge and deliverance.” [B14,B16,B17] (C) |
| BJ06; Alma | BP13 → BP04 → BP11 → BP12 | Alma 8:1–6; includes home/rest interval at Zarahemla, new year's mission to Melek, three-day journey north to Ammonihah. “Alma's ministry: selected stops.” [B18] (C) |
| BJ07; people of Anti-Nephi-Lehi; separate delegation | BP03 → unnamed dividing wilderness → BP17; delegation wilderness → BP04 → wilderness | Alma 27:14–15,20–26. Do not send the entire refugee community through Zarahemla: it waits while the delegation seeks consent. “Refuge at Jershon; consultation at Zarahemla.” [B21] (C) |
| BJ08; Moroni's force, joined by Pahoran | BP13 → BP04 → BP19 → BP21 → BP18 | Alma 62:6–8,14–18,30–34; final pursuit compresses unnamed intermediate cities. Pahoran's presence on every later leg not asserted. “Selected stages of Moroni's later campaign.” [B23] (C) |
| BJ09; emigrants | BP04 → BP22 | Hel 3:3–4; no named intermediate settlements or exact distance. “Migration to the land northward.” [B24] (C) |
| BJ10; Mormon's people | BP23 → BP24 → BP25 | Morm 2:4–6; later route to Cumorah is excluded here rather than bridged across unreviewed chapters. “Early retreat in Mormon's account.” [B30] (C) |
| BJ11; Jaredite group | `bom-great-tower` → `bom-nimrod-valley` → `bom-moriancumer` → BP27 | Ether 1:33,42;2:1,5–6,13;6:4–12. Earlier water crossings and wilderness compressed; mountain visit at `bom-shelem` is the brother of Jared's side excursion, not a group port. “Jaredite migration: narrative sequence, modern route unknown.” [B32–B35] (C) |

## Nonspatial codex records

All `first:3`. These are intentionally not given fake event locations. They ensure books with limited geographical detail are represented without manufacturing sites.

| ID; title; passage | Exact proposed copy |
|---|---|
| BC01; Jacob's closing account; Jacob 7:1–23,27 | “Jacob recounts a dispute with Sherem over Christ and closes by entrusting the plates to Enos.” [B06] (C) |
| BC02; Enos's prayer; Enos 1:3–13 | “While hunting in a forest, Enos prays for forgiveness and then for the welfare of Nephites and Lamanites.” [B07] (C) |
| BC03; Jarom's brief record; Jarom 1:1–2,11–15 | “Jarom describes teachers urging faith in the coming Messiah and passes the record to Omni.” [B08] (C) |
| BC04; Mormon's editorial bridge; Words of Mormon 1:1–7 | “Mormon explains why he joins an earlier prophetic record to his abridgment, while preparing to hand records to Moroni.” [B10] (C) |
| BC05; Alma preserves Abinadi's words; Mosiah 17:2–4 | “Alma believes Abinadi, flees the king's servants and records the prophet's words while concealed.” [B13] (C) |
| BC06; Community and division; 4 Ne 1:2–3,24–26 | “Fourth Nephi describes a community sharing possessions, followed later by pride, inequality and division.” [B29] (C) |
| BC07; Moroni's survival and farewell; Moroni 1:1–4;10:1–5 | “Moroni writes while seeking safety. His closing words invite readers to remember God's mercy and seek a spiritual witness.” [B37,B38] (C) |

## Internal relations and integration safeguards

- Textual north/south/east/west are preserved as narrated. A map projection, magnetic bearing or kilometer conversion is not derived. Sidon's complete flow direction is not asserted from the head-of-river phrase. [B18,B20] (C for source wording; restriction is editorial.)
- Alma 22:32 gives a day-and-a-half journey on the Bountiful/Desolation line, not a surveyed isthmus width. Its eastern endpoint wording must not be expanded into an explicit eastern sea if the display quotes that verse. [B20] (C)
- The American Bountiful/Desolation relation and the temple-in-Bountiful relation describe different passage contexts. No inference that 3 Nephi's destruction leaves every earlier land boundary unchanged. [B20,B26,B27] (C; no-change prohibition is editorial.)
- BP26 identifies Ramah with Mormon's record-hiding hill within the narrative. It is not a finding that the final battles took place at the New York heritage site; consult the model memo. Mormon 6:6 explicitly exempts the plates passed to Moroni from the records hidden there. [B31,B36] (C)
- Distinguish Mosiah in Omni from the later Mosiah in the Limhi/Alma migrations. Distinguish Ammon the Zarahemla-descended search leader (Mosiah 7:3,13) from the son of Mosiah in Alma 17. [B09,B12,B19] (C)
- Do not express the scriptures' polemical descriptions of peoples as the atlas's ethnic judgments. Use attribution and specific actors/actions. Historical claims about present-day Indigenous peoples need separate evidence and are outside this inventory.
- Treat temple schematics, towers, city walls and boats as generic illustrations unless their specific features are textually described; never label a visualization an archaeological reconstruction.

## Opened sources

Each B source is the official Church-hosted chapter and was successfully opened on 2026-10-26. Passage-level support is given in the record tables. B02–B04 and B32–B34 reuse the opens from `geography-evidence.md` (not a second-source audit). No unverified `(L)` or `(U)` assertion is offered for building.

| Source | Official scripture page |
|---|---|
| B01 | [1 Nephi 2](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/2?lang=eng) |
| B02 | [1 Nephi 16](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/16?lang=eng) |
| B03 | [1 Nephi 17](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/17?lang=eng) |
| B04 | [1 Nephi 18](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/18?lang=eng) |
| B05 | [2 Nephi 5](https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/5?lang=eng) |
| B06 | [Jacob 7](https://www.churchofjesuschrist.org/study/scriptures/bofm/jacob/7?lang=eng) |
| B07 | [Enos 1](https://www.churchofjesuschrist.org/study/scriptures/bofm/enos/1?lang=eng) |
| B08 | [Jarom 1](https://www.churchofjesuschrist.org/study/scriptures/bofm/jarom/1?lang=eng) |
| B09 | [Omni 1](https://www.churchofjesuschrist.org/study/scriptures/bofm/omni/1?lang=eng) |
| B10 | [Words of Mormon 1](https://www.churchofjesuschrist.org/study/scriptures/bofm/w-of-m/1?lang=eng) |
| B11 | [Mosiah 2](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/2?lang=eng) |
| B12 | [Mosiah 7](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/7?lang=eng) |
| B13 | [Mosiah 17](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/17?lang=eng) |
| B14 | [Mosiah 18](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/18?lang=eng) |
| B15 | [Mosiah 22](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/22?lang=eng) |
| B16 | [Mosiah 23](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/23?lang=eng) |
| B17 | [Mosiah 24](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/24?lang=eng) |
| B18 | [Alma 8](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/8?lang=eng) |
| B19 | [Alma 17](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/17?lang=eng) |
| B20 | [Alma 22](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/22?lang=eng) |
| B21 | [Alma 27](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/27?lang=eng) |
| B22 | [Alma 50](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/50?lang=eng) |
| B23 | [Alma 62](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/62?lang=eng) |
| B24 | [Helaman 3](https://www.churchofjesuschrist.org/study/scriptures/bofm/hel/3?lang=eng) |
| B25 | [Helaman 13](https://www.churchofjesuschrist.org/study/scriptures/bofm/hel/13?lang=eng) |
| B26 | [3 Nephi 8](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/8?lang=eng) |
| B27 | [3 Nephi 11](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/11?lang=eng) |
| B28 | [3 Nephi 17](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/17?lang=eng) |
| B29 | [4 Nephi 1](https://www.churchofjesuschrist.org/study/scriptures/bofm/4-ne/1?lang=eng) |
| B30 | [Mormon 2](https://www.churchofjesuschrist.org/study/scriptures/bofm/morm/2?lang=eng) |
| B31 | [Mormon 6](https://www.churchofjesuschrist.org/study/scriptures/bofm/morm/6?lang=eng) |
| B32 | [Ether 1](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/1?lang=eng) |
| B33 | [Ether 2](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/2?lang=eng) |
| B34 | [Ether 3](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/3?lang=eng) |
| B35 | [Ether 6](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/6?lang=eng) |
| B36 | [Ether 15](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/15?lang=eng) |
| B37 | [Moroni 1](https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/1?lang=eng) |
| B38 | [Moroni 10](https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/10?lang=eng) |

## Validation and precise remaining coverage

- 15/15 constituent books have at least one opened chapter and an attributed record or existing-record link. This is not 15/15 complete books.
- 53 distinct chapter pages underpin this inventory; 6 reuse earlier successful opens. The main research's P08–P10 and E05–E07 remain shared records rather than duplicates.
- Added 30 textual place records, 23 events, 11 ordered journeys and 20 nonspatial codex records. All use navigator `first:3`; all new place/event/journey references are defined here or explicitly reused from the two companion files.
- No numeric ancient `when`, real-world Book of Mormon coordinate, diagram tracing, or claim of independent historical corroboration was added.
- Remaining content is enumerated per book above. Moroni 2–9 and selected later 3 Nephi ministry concepts are now covered by the extension below. Major overview themes still missing include Alma mission/conversion narratives and discourses, Helaman's prophetic ministry, 3 Nephi birth-sign/political and remaining sermon context, and Ether's prophecy/kingdom overview. Exhaustive campaign stops, minor settlements and every battlefield are **detailed inventory debt**, not prerequisites for a useful selected overview. Brief books have representative coverage but have not undergone an all-claims audit.
- Release work still requires the independent second-source/prominent-claim audit, chronology and navigator reconciliation, engine support for unlocated records and final canon/technical reviews. No status transition or publication is proposed by this file alone.

## Extension: Moroni 2–9 and later 3 Nephi ministry

Added after the initial inventory, 2026-10-26. All records retain `first:3`, `layer:bom`, nonspatial codex treatment and text-only evidence. No new geographic claim follows from adding these concepts. Moroni 2:3 explicitly places the remembered instruction at Christ's initial appearance: do not timestamp that instruction with the much later editorial heading of Moroni 2. [B39] (C)

| ID; title; passage | Exact proposed copy |
|---|---|
| BC08; Gift of the Holy Ghost; Moroni 2:1–3 | “Moroni records Christ's instruction that the twelve disciples pray and confer the Holy Ghost by laying on hands.” [B39] (C) |
| BC09; Ordination; Moroni 3:1–4 | “Moroni describes elders praying and laying hands on those ordained as priests and teachers.” [B40] (C) |
| BC10; Sacrament prayers; Moroni 4:1–3;5:1–2 | “Moroni preserves prayers over bread and wine that connect participation with remembering Jesus Christ and receiving his Spirit.” [B41,B42] (C) |
| BC11; Baptism and community care; Moroni 6:1–9 | “Moroni describes repentance before baptism, continued care for members, frequent worship, and forgiveness for those who repent.” [B43] (C) |
| BC12; Faith, hope and charity; Moroni 7:1,40–48 | “Moroni preserves Mormon's teaching on faith and hope, centered on charity as Christ's enduring love.” [B44] (C) |
| BC13; Little children and baptism; Moroni 8:1,5–12,19–22 | “In a letter, Mormon teaches that little children are alive in Christ and do not need baptism; repentance and baptism are for those accountable for sin.” [B45] (C) |
| BC14; Mormon's wartime letter; Moroni 9:1–6,7–19,25–26 | “Mormon reports severe violence and suffering among both peoples, urges continued service, and asks Moroni to find hope in Christ.” [B46] (C) |
| BC15; Blessings and discipleship; 3 Nephi 12:3–16 | “Jesus blesses the humble, merciful and peacemakers and calls the listeners to let their good works point others toward the Father.” [B47] (C) |
| BC16; Bread and wine among the multitude; 3 Nephi 18:1–12 | “Jesus gives bread and wine to the disciples and multitude, teaching them to remember his body and blood.” [B48] (C) |
| BC17; Gathering and covenant; 3 Nephi 20:10–14;21:1–7,22–29 | “Jesus teaches about God's covenant with Israel, the gathering of scattered people and a future New Jerusalem.” [B49,B50] (C) |
| BC18; Searching and preserving scripture; 3 Nephi 23:1–14 | “Jesus urges study of Isaiah and directs that the fulfillment of Samuel's resurrection prophecy be added to the record.” [B51] (C) |
| BC19; Church and gospel; 3 Nephi 27:3–10,13–21 | “Jesus directs that the church bear his name and teaches repentance, baptism, sanctification and faithful endurance.” [B52] (C) |
| BC20; Three disciples' desire; 3 Nephi 28:1–9 | “Three disciples desire to keep ministering, and Jesus promises that they will remain until his return.” [B53] (C) |

Editorial integration decisions:

- Keep BC10's source wording **wine** in this account; do not silently rewrite it as a statement of modern practice. Modern Church sacramental practice belongs in a separately sourced contemporary-history note.
- BC13 describes Mormon's teaching. Do not extend its criticism into the atlas's judgment of other Christian traditions.
- BC14 deliberately paraphrases atrocity reports without graphic detail. The letter does name Sherrizah and Moriantum (Moroni 9:7–10,16–17); no precise location is supplied. These names remain detailed place-inventory debt, not evidence of a surveyed war route. [B46] (C)
- BC17 is prophecy, not a dated completed construction event. It does not establish a modern coordinate by itself. Do not merge its New Jerusalem automatically with a present-day city record.
- BC20 remains a scriptural account, not a map of later sightings or a claim that any modern anecdote was verified.

Additional source pages, all successfully opened 2026-10-26:

| Source | Official scripture page |
|---|---|
| B39 | [Moroni 2](https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/2?lang=eng) |
| B40 | [Moroni 3](https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/3?lang=eng) |
| B41 | [Moroni 4](https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/4?lang=eng) |
| B42 | [Moroni 5](https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/5?lang=eng) |
| B43 | [Moroni 6](https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/6?lang=eng) |
| B44 | [Moroni 7](https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/7?lang=eng) |
| B45 | [Moroni 8](https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/8?lang=eng) |
| B46 | [Moroni 9](https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/9?lang=eng) |
| B47 | [3 Nephi 12](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/12?lang=eng) |
| B48 | [3 Nephi 18](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/18?lang=eng) |
| B49 | [3 Nephi 20](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/20?lang=eng) |
| B50 | [3 Nephi 21](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/21?lang=eng) |
| B51 | [3 Nephi 23](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/23?lang=eng) |
| B52 | [3 Nephi 27](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/27?lang=eng) |
| B53 | [3 Nephi 28](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/28?lang=eng) |

Extension validation: 15 additional official chapter pages opened; 13 new codex records, bringing the inventory to **30 places / 23 events / 11 journeys / 20 codex entries / 53 source pages**. Moroni now has chapter-level overview coverage for 10/10 chapters; this is not a final canon sign-off or a claim that every possible assertion has been audited.

# LDS standard works — research checkpoint 1

Research date: 2026-10-26. Repository baseline: `main` at `cd85ea8dcb36d4d5b54afd5ec05bc03c2c173d79`.

This is the template-ordered core of an expanded **research handoff for review**, not the full atlas and not permission to start a content build. See `build-handoff.md` for the completed supplemental inventories, exact existing-engine dispositions and remaining acceptance criteria. It supplies 20 place records, 13 event records, 3 journeys and 7 codex entries across the four requested layers. Status remains `research / chatgpt` under the agreed all-four-layers coverage rule. All factual text below is attributed to opened sources; implementation choices are labelled **Design**. `(C)` confirms what the source says, not the historical truth of a religious claim. Source keys resolve in `sources.md`.

The owner selected comprehensive coverage after the initial checkpoint. The eight `coverage-*.csv` ledgers enumerate every canonical chapter/section/declaration and the three facsimile explanations: **1,587 units**. See their companion research files for substantive findings, full versus partial reading, exact witness and edition limitations. Run `python docs/universes/packs/lds-standard-works/validate-coverage.py` for current counts. All1,587 unit bodies now have full-reading dispositions in the disclosed witnesses. These ledgers supersede the initial selected-book coverage table; full reading does not imply completed official-edition comparison, record integration or independent corroboration. `comprehensive-audit.md` identifies the remaining research-ready gates.

Current acceptance criteria and safe import decisions are specified in `build-handoff.md`. The core records below remain stable; supplements use distinct namespaces and cite actual passages. Counts refer to records, not exhaustive atomic claims or independent corroborations.

## 1. Meta

- **Design:** id `lds-standard-works`; title **Latter-day Saint Standard Works**; description: “Explore the places and narratives of Latter-day Saint scripture, with historical evidence and proposed geography clearly distinguished.”
- The Church’s canon includes the Old and New Testaments, Book of Mormon, Doctrine and Covenants and Pearl of Great Price. [S1] (C)
- **Design:** one Earth-historical atlas (Track A), four content layers `bible`, `bom`, `dc-history`, `pgp`. Optional geography proposals stay off by default. No fifth “combined works” duplicate; all layers on means combined.
- **Design navigator:** `first` means earliest **navigator volume in the following proposed order**, not earliest verse, composition date, or BCE chronology. Actual passage is always supplied. This checkpoint does not promise chapter-level spoiler protection. A final chapter/book inventory must replace this coarse navigation before a full build.

| Navigator number | Work / reading order | Publication-year treatment |
|---|---|---|
| 1 | Bible: Old Testament | No single year assigned; compilation/translation/edition dates must be separate |
| 2 | Bible: New Testament | Same; online KJV used here |
| 3 | Book of Mormon | First edition1830, supported by the Joseph Smith Papers bibliographic record. [S27] (C) |
| 4 | Doctrine and Covenants + contextual history | Modern revelations, including material beyond Joseph Smith’s lifetime. [S21] (C) No single event year for the collection |
| 5 | Pearl of Great Price: Moses, Abraham, JS—Matthew, JS—History, Articles of Faith | First collection 1851; canonized 1880; these are not dates of narrated ancient events. [S20] (C) |

**Design notice:** “Independent educational atlas. Not an official publication of The Church of Jesus Christ of Latter-day Saints. Scripture narratives, religious beliefs, historical evidence and geographic proposals are labelled separately.” Do not copy Church artwork, maps, logos or editorial apparatus. This checkpoint paraphrases and links; no claim of licensing clearance for future assets. Rights-owner/licensing review remains open rather than assigning one blanket copyright to every text.

**Design theme:** parchment, muted blue, restrained gold; original schematic artwork only. Screen differences: no screen adaptations used.

## 2. Structure

**Design:** parent `earth` for terrestrial records; symbolic/unlocated places are research/codex records, not artificial dots at `(0,0)`. Modern heritage markers are geographic anchors only, not archaeological proof of a narrated event. Map coordinates below are latitude, longitude; east/north positive.

Two coordinate pairs were derived from UNESCO’s published degree/minute/second coordinates: Jerusalem Old City `31.777778, 35.231667` [S22] (C), and the Nativity heritage property in Bethlehem `31.704353, 35.207500` [S23] (C). The latter marks the traditional commemorative site, not a demonstrated exact birth location. The comprehensive continuation adds a sourced representative Nazareth point in `gazetteer-evidence.md`; all other core coordinates are omitted pending a cited gazetteer or site survey. A place can be textually confirmed while its position is unknown.

**Engine constraint:** PACK_FORMAT §11.4 requires `lat/lon` or `rel` for surface sites, despite §20.3 suggesting coordinates may be omitted. Until a nonspatial rendering path is proven, omit unlocated records from `world.sites`; retain their text in codex/research. Never invent `rel` offsets or use an Earth-wide region’s center as an event location. The current engine supports `notes` for text/tradition/scholarship; use that distinction visibly.

**Design dates:** only sourced modern events receive numeric `when` here. Ancient scripture chronology remains a labelled narrative/date string, not a silently verified BCE year. Missing dates are absent fields, never year zero. Revelation/publication dates belong in metadata, distinct from the date of the episode narrated. For existing places use event-specific dates rather than inventing an entire occupancy interval.

## 3. Places

Shared fields: `parent: earth`; `eras: none supplied` unless explicitly stated. “None” means no researched change, not that history stopped. All are text-ready; P06/P07/P08 now have sourced modern map anchors (Nazareth provenance in `gazetteer-evidence.md`). **Design:** aliases `[]` unless listed. Earliest navigator `first` and layers are specified in each row; the factual basis follows the descriptive text.

| ID / name / aliases | Type; layer; first | Position / modern label / relevant time | Exact proposed description; events |
|---|---|---|---|
| P01 `haran` — Haran | place; bible, pgp; 1 | Modern identification/coordinates pending; patriarchal narrative, no absolute year | OT entry (gate1/bible): “Genesis describes Abram departing from Haran.” [S2] (C) PGP entry (gate5/pgp): “Abraham’s account also describes departure from Haran.” [S16] (C) Events E01, E12; keep the PGP assertion out of ungated base copy |
| P02 `shechem` — Shechem; Sichem, Sechem | place; bible, pgp; 1 | Modern archaeological identification pending | “The journey reaches the place called Sichem by the plain of Moreh.” [S2] (C) E01 |
| P03 `bethel-hai-camp` — Camp between Bethel and Hai | campsite; bible, pgp; 1 | Textual relation only: Bethel west, Hai east; no pin | “Abram pitches his tent between Bethel and Hai and builds an altar.” [S2] (C) E01 |
| P04 `egypt-region` — Egypt | region; bible, pgp; 1 | No single city or point asserted; no ancient boundary polygon supplied | “Genesis describes Abram travelling to Egypt during famine.” [S2] (C) E01 |
| P05 `horeb` — Horeb | mountain; bible; 1 | Unlocated in this research; no Sinai candidate adopted | “Exodus places Moses’ encounter at the burning bush at Horeb.” [S3] (C) E02 |
| P06 `nazareth` — Nazareth | town; bible; 2 | Galilee in Luke; representative Nazareth point `32.701029,35.300148` from `gazetteer-evidence.md`, not a house/departure location; birth/childhood narrative | “Luke names Nazareth as Joseph’s starting point before the journey to Bethlehem.” [S4] (C) E03 |
| P07 `bethlehem` — Bethlehem | town / commemorative anchor; bible; 1 | Modern Bethlehem; map marker is Nativity heritage property, `31.704353,35.207500`, not a town boundary [S23] (C) | Base: “The marker locates the Nativity heritage property in Bethlehem.” [S23] (C) OT entry: “Ruth describes Naomi and Ruth arriving in Bethlehem.” [S28] (C) NT entry: “Luke places Jesus’ birth in Bethlehem; the mapped property commemorates that birth in Christian tradition.” [S4][S23] (C) E03. Keep NT-specific text gated at2; this marker does not locate Ruth’s arrival. |
| P08 `jerusalem` — Jerusalem | city; bible, bom; 1 | Modern Old City anchor `31.777778,35.231667` [S22] (C); OT association now checked in bible-inventory.md A5 (2 Samuel5); minimum navigator1 | Base: “The marker locates Jerusalem’s Old City.” [S22] (C) Bible event: “Luke describes Jesus being brought to Jerusalem for presentation.” [S4] (C) Separate BoM-only note: “1 Nephi places Lehi at Jerusalem during Zedekiah’s reign.” [S6] (C) E04, E05 |
| P09 `waters-mormon` — Waters of Mormon | waters / narrative place; bom; 3 | Unknown modern location; keep off Earth map | “Mosiah describes Alma teaching and baptizing at waters in the place called Mormon.” [S7] (C) E06 |
| P10 `bountiful-temple` — Temple in Bountiful | temple / narrative place; bom; 3 | Unknown modern location; not the departure shore in 1 Nephi | “3 Nephi places a gathered multitude at the temple in Bountiful when Jesus appears.” [S8] (C) E07 |
| P11 `smith-grove` — Woods near the Smith home | religious-history site; pgp, dc-history; 5 | Manchester, New York context; exact grove point not sourced here; spring 1820 is reported event date | “Joseph Smith’s canonized account describes a prayer in nearby woods and a vision of two personages.” [S14] (C) E08 |
| P12 `fayette-organization` — Fayette organization setting | house / historical setting; dc-history; 4 | Fayette, New York; Whitmer home according to documentary editors; no coordinate; 1830-04-06 [S24] (C) | “The Joseph Smith Papers editors identify the Whitmer home in Fayette as the Church’s organization setting.” [S24] (C) E09 |
| P13 `independence` — Independence | town; dc-history; 4 | Independence, Missouri; coordinates pending; 1831-07-20 | “D&C 57 names Independence as the center place for Zion and describes a nearby temple lot.” [S10] (C) E10 |
| P14 `kirtland-temple` — Kirtland Temple | temple; dc-history; 4 | Kirtland, Ohio; coordinates pending; 1836-03-27 | “D&C 109 preserves the prayer associated with the Kirtland Temple dedication.” [S11] (C) E11 |
| P15 `nauvoo` — Nauvoo; Commerce (earlier settlement name) | town; dc-history; 4 | Nauvoo, Illinois; coordinates pending; 1841-01-19 for E13 | “The heading to D&C 124 places the revelation at Nauvoo. Its instructions include building a temple and lodging for visitors.” [S12] (C) E13 |
| P16 `carthage-jail` — Carthage Jail | jail; dc-history; 4 | Carthage, Illinois; coordinates pending; 1844-06-27 | “D&C 135 reports Joseph and Hyrum Smith’s deaths at Carthage Jail.” [S13] (C) Linked event: coverage-dc.md DE09 (attributed account of the deaths); no duplicate event created |
| P17 `zion-enoch` — Enoch’s city | city / narrative place; dc-history, pgp; 4 | Unlocated; no terrestrial coordinate. D&C38:4 already names Zion of Enoch at navigator4; City of Holiness appears in the PGP overlay at5 | D&C entry: “D&C38 describes Enoch’s city as taken into God’s presence.” [S32] (C) PGP entry: “Moses describes Enoch’s community as Zion and says the city was taken up.” [S15] (C) Keep each claim under its own work gate |
| P18 `ur-abraham` — Ur of the Chaldees | place / narrative setting; bible, pgp; 1 | Modern identification unresolved here; do not choose a proposed Ur | OT entry: “Genesis describes Terah’s household leaving Ur for Canaan and settling in Haran.” [S29] (C) PGP entry: “Abraham describes leaving Ur with family members.” [S16] (C) E12; PGP claim gated at5 |
| P19 `jershon-abraham` — Jershon (Abraham) | place / narrative setting; pgp; 5 | Unknown location; do not merge with Book of Mormon Jershon | “Abraham names Jershon on the way from Haran to Canaan.” [S16] (C) E12 |
| P20 `mount-olives` — Mount of Olives | mountain / discourse setting; bible, pgp; 1 | East of Jerusalem in Zechariah14:4; precise map coordinate pending [S30] (C) | OT entry: “Zechariah’s prophecy names the Mount of Olives east of Jerusalem.” [S30] (C) NT entry (gate2): “Matthew names the Mount of Olives in the Passion narrative.” [bible-inventory.md A9] (C) PGP entry (gate5): “Joseph Smith—Matthew places Jesus’ conversation with his disciples on the Mount of Olives.” [S18] (C) No event card yet |

**Design cross-layer safeguard:** P08’s Book of Mormon paragraph must appear only with the BoM layer and navigator 3 or later. If `notes` cannot independently gate text, keep the shared base description limited to geography and put each scriptural assertion in a layer-specific event/codex entry. Likewise do not append PGP-only details to the shared Abraham-route base text.

## 4. Events (the timeline)

These are research records, not a ready-to-import JS payload. `book` uses §1 navigator numbers. Ancient entries are arranged in reading/narrative sequence per work, not claimed to form a single settled world chronology. Modern records E08–E11, E13 can sort by their dates. Every `places` ID resolves in §3. Text is exact proposed display copy.

| ID / title | Book; passage; places; characters | Date / engine `when` | Summary and evidence type |
|---|---|---|---|
| E01 `abram-journey` — Abram’s journey | 1; Gen 12:4–10; P01,P02,P03,P04; Abram, Sarai, Lot | No absolute date; omit `when` | **Text:** “Genesis traces Abram’s movement from Haran into Canaan and then Egypt.” [S2] (C) |
| E02 `moses-call` — Moses’ commission | 1; Ex 3:1–12; P05; Moses | No absolute date; omit | **Text:** “At Horeb, Moses is commissioned to bring Israel out of Egypt.” [S3] (C) |
| E03 `jesus-birth-luke` — Birth in Luke | 2; Luke 2:4–7; P06,P07; Joseph, Mary, Jesus | No year assigned; omit | **Text:** “Luke describes Joseph and Mary’s journey to Bethlehem and Jesus’ birth there.” [S4] (C) |
| E04 `presentation` — Presentation in Jerusalem | 2; Luke 2:22; P08; Jesus, his parents | After E03 in Luke; omit | **Text:** “Jesus is brought to Jerusalem for presentation.” [S4] (C) |
| E05 `lehi-jerusalem` — Lehi at Jerusalem | 3; 1 Ne 1:4–7; P08; Lehi | Zedekiah’s first year in text; heading says about 600 BC; omit numeric `when` pending chronology review | **Text:** “Nephi introduces Lehi’s life at Jerusalem and his visionary experience.” [S6] (C) |
| E06 `alma-baptisms` — Baptisms at Mormon | 3; Mosiah 18:7–17; P09; Alma, Helam, gathered believers | Heading: about 147–145 BC, editorial; omit numeric `when` | **Text:** “Alma teaches baptismal commitments and baptizes at the waters of Mormon.” [S7] (C) |
| E07 `christ-bountiful` — Jesus at Bountiful | 3; 3 Ne 11:1–17; P10; Jesus, multitude | Absolute date not assigned | **Text:** “The narrative describes Jesus appearing to the multitude at the temple.” [S8] (C) |
| E08 `first-vision-account` — First Vision account | 4; D&C introduction; PGP source view5: JS—H1:14–20; P11 link only with PGP woods detail; Joseph Smith | Spring1820 as reported; `when:1820` with visible source label | **Official account / belief (gate4):** “The D&C introduction reports Joseph Smith’s First Vision in spring1820 while he was living in Manchester.” [S21] (C) **PGP account (gate5):** “Joseph Smith’s canonized account reports a vision following prayer in the woods.” [S14] (C) |
| E09 `organization` — Church organization | 4; D&C 20:1–4 and documentary history; P12; Joseph Smith, Oliver Cowdery | 1830-04-06; `when:1830` | **Documented history:** “The Church was organized on April 6, 1830; documentary editors locate the meeting in Fayette.” [S9][S24] (C) |
| E10 `zion-designation` — Independence designated | 4; D&C 57:1–3 and heading; P13; Joseph Smith, gathered elders | 1831-07-20; `when:1831` | **Text:** “The revelation designates Independence as the center place for Zion.” [S10] (C) |
| E11 `kirtland-dedication` — Kirtland dedication prayer | 4; D&C 109 heading; P14; Joseph Smith, assembled worshippers | 1836-03-27; `when:1836` | **Source-labelled history:** “D&C 109 preserves the dedication prayer for the Kirtland Temple.” [S11] (C) |
| E12 `abraham-journey` — Abraham’s journey account | 5; Abr 2:4–21; P18,P01,P19,P02,P03,P04; Abraham, Sarai, Lot | No absolute date; omit | **Text:** “Abraham describes a journey from Ur through Haran and Canaan toward Egypt.” [S16] (C) |
| E13 `nauvoo-revelation` — Nauvoo building instructions | 4; D&C 124 heading, 22–28; P15; Joseph Smith | 1841-01-19; `when:1841` | **Text:** “The Nauvoo revelation directs construction of a temple and a house for visitors.” [S12] (C) |

Event **dates** for revelations establish the document’s stated setting, not independent verification of divine authorship. Scholarship fields not researched below must not be replaced by generic claims that “historians agree.”

## 5. Journeys

| ID; who; volume | Ordered place IDs | Leg evidence and exact route label |
|---|---|---|
| J01 `abram-genesis`; Abram’s household; 1 | P01 → P02 → P03 → P04 | Sequence stated in Gen 12:5–10; intermediate southward travel compressed. **Label:** “Narrative sequence; connecting lines are schematic, not a recovered road.” [S2] (C) |
| J02 `luke-childhood`; Joseph, Mary and Jesus; 2 | P06 → P07 → P08 → P06 | Luke 2:4–7,22,39 states the sequence; Jesus is born at P07, so do not animate him on the first leg. **Label:** “Luke’s sequence; no precise route or travel date supplied.” [S4] (C) |
| J03 `abraham-pgp`; Abraham’s household; 5 | P18 → P01 → P19 → P02 → P03; intended continuation southward toward P04 | Abr2:4–20 gives the reached settings. Verses21–25 describe the decision to go to Egypt and an approach near entry, not a completed Egyptian arrival. **Label:** “Abraham’s narrated journey and intended continuation toward Egypt; modern identifications are not adopted.” Preserve Jershon and distinguish Terah’s stay at Haran from the continuing party. [S16] (C) |

**Design:** no Earth route geometry is authorized until each endpoint and route treatment is reviewed. These ordered lists are usable for text navigation now. Journeys must not become straight-line archaeological claims simply because the engine can draw them.

## 6. Codex

| ID; name; first; layer | Exact proposed text |
|---|---|
| C01 `standard-works`; Standard works; 1; all | “The Church names the Bible, Book of Mormon, Doctrine and Covenants and Pearl of Great Price as its standard works.” [S1] (C) |
| C02 `resurrection-testimony`; Resurrection testimony; 2; bible | “Matthew 28 narrates the announcement that Jesus has risen, appearances to followers and a commission to teach and baptize.” [S5] (C) |
| C03 `baptism-mormon`; Baptism at Mormon; 3; bom | “Mosiah connects baptism with service, mourning with others and standing as witnesses of God.” [S7] (C) |
| C04 `modern-revelation`; Doctrine and Covenants; 4; dc-history | “The Church presents this collection as modern revelations and declarations. Section7 is specifically described as a translated record attributed to John.” [S21][S31] (C) |
| C05 `kolob`; Kolob; 5; pgp | “Abraham describes Kolob in a revelation about heavenly order and divine reckoning of time. This atlas does not identify it with an observed star.” [S17] (C for the first sentence). **Design:** the second sentence states the atlas’s display policy. |
| C06 `principles-ordinances`; Principles and ordinances; 5; pgp | “The fourth Article of Faith names faith in Jesus Christ, repentance, baptism by immersion and laying on of hands for the gift of the Holy Ghost.” [S19] (C) |
| C07 `scripture-revelation`; Scripture and revelation; 5; pgp | “Articles of Faith 8–9 affirm the Bible, with a translation qualification, the Book of Mormon and continuing revelation.” [S19] (C) |

## 7. Open questions

| ID | Finding / disposition |
|---|---|
| LDS-Q01 | The unit-level full-reading pass is complete in its disclosed witnesses. Official-edition comparison, record integration and independent corroboration remain separate requirements; see comprehensive-audit.md and build-handoff.md. Keep `research / chatgpt` until the remaining acceptance criteria are satisfied. |
| LDS-Q02 | Now3/20 core place records have researched modern coordinate anchors; the Bible/restoration supplements and gazetteer continuation supply seven further anchors (ten total). Seventeen core places remain nonspatial pending evidence; some may properly remain unlocated permanently. No `(L)` coordinates are offered for provisional building. |
| LDS-Q03 | Layer-specific paragraphs and coarse navigator gates need explicit engine behavior. The scripture order must not make a visitor enable all earlier religious texts just to view church history. No code change is included. |
| LDS-Q04 | Genesis 12:4 gives 75 at departure from Haran; Abraham 2:14 gives 62. [S2][S16] (C) Preserve each account’s value if shown; do not average, silently correct, or assert a harmonization. |
| LDS-Q05 | No harmonized BCE date for Lehi’s departure is approved. Narrative regnal dating and editorial approximation remain distinct. [S6] (C) |
| LDS-Q06 | Modern place identity does not establish an ancient episode. Independent historical/archaeological syntheses for the patriarchs, Exodus and Book of Mormon remain to be researched; no “scholarly consensus” is invented here. |
| LDS-Q07 | Directly sourced model maps, variant-specific landmarks and critical comparison remain incomplete; see `geography-evidence.md`. Models must never supply default real-world Book of Mormon pins. |
| LDS-Q08 | Document date, narrated event date and canonization date are different fields. In particular, Moses 7’s December 1830 heading must not timestamp Enoch’s city. [S15] (C) |
| LDS-Q09 | A full independent second-source self-audit has not occurred. Source attribution was checked, but no final canon sign-off is given. |
| LDS-Q10 | Final rights notice, exact per-book navigation and expanded independent historical context remain open. Book of Mormon publication year and later D&C/declaration coverage have now been supplied. This is explicit scope debt, not “complete because every heading exists.” |

## 8. Track A additions (religion & history)

Apply these **Design evidence profiles** to every place/event, including those without a pin. Do not display an empty research placeholder as substantive scholarship.

| Profile / records | Text | Tradition / belief | Scholarship / historical evidence |
|---|---|---|---|
| Biblical narrative: P01–P08; E01–E04; J01–J02 | Only the passage-specific statements above [S2–S4] (C) | Do not generalize to every Jewish or Christian tradition. Bethlehem’s specific commemorative attribution is documented by UNESCO [S23] (C) | External source verifies the two heritage properties and their modern coordinates [S22–S23] (C); ancient events/dates not independently established in this checkpoint |
| BoM narrative: P08 BoM note, P09–P10; E05–E07 | Distinct scriptural assertions [S6–S8] (C) | Church geography policy and historical belief are attributed in the supplementary memo | Proposed locations are interpretive models; no model is established by quoting scripture. No independent archaeological verdict supplied |
| Restoration/history: P11–P16; E08–E11,E13 | Preserve the source’s religious framing as attributed text [S9–S14] (C) | First Vision is represented as Joseph Smith’s report; the Church’s essay discusses differing accounts [S25] (C) | JSP provides documentary argument for Fayette, not an independent supernatural verification [S24] (C). NPS independently describes Nauvoo’s historical role and departures [S26] (C). Other events need expanded external history |
| PGP ancient narrative: P17–P20; E12; J03 | Preserve the specific account, including names distinct from similarly named BoM places [S15–S18] (C) | Treat these as part of the Church’s canon [S1] (C), not beliefs automatically shared by other traditions | No modern-location or astronomical identification approved; no reconstruction of Enoch’s city or Kolob |

**Geography models:** use the companion `geography-evidence.md` for the official policy, model-specific evidence, uncertainties and exact safe copy. Unlocated/internal geography is the default. A comparative layer is an account of what a proponent proposes, not an endorsement or a measured map. The world-religions branching tree is a different queued atlas and is excluded here.

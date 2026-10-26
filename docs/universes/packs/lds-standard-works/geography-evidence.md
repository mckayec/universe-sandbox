# Book of Mormon geography: evidence and implementation handoff

**Current follow-up:** [geography-source-audit.md](geography-source-audit.md) supersedes the access limits below where explicitly stated: Nebes’s original epigraphic catalogue was inspected in targeted passages; Aston2024’s full article was read; Meldrum’s short author-attributed argument was read; Potter2022 received targeted inspection including its conclusion. Earlier counts and access statements below remain a historical checkpoint, not the current access total. Use the follow-up’s exact model notes and limits during integration. No disputed modern coordinates or archaeological narrative identifications are authorized.


Research checkpoint, 2026-10-26. Repository baseline: `cd85ea8dcb36d4d5b54afd5ec05bc03c2c173d79` on `main`. Supplement to `research.md`; not a complete Book of Mormon research pass or a release sign-off. Ordinary web search/open was used; no dedicated Deep Research capability is claimed.

Here `(C)` means the cited source was opened and supports the attributed statement, **not** that a proposed identification or a scriptural event has been established historically. `G` source IDs are local to this supplement. All descriptions below are paraphrases. No coordinates are supplied for disputed places.

## Default representation and exact visitor text

Use an unlocated textual view by default. Proposed real-world models belong in separately named, initially disabled layers. Do not make enabling all layers silently collapse different proposed places into one factual pin. This is an editorial implementation recommendation.

**Church position — ready for a labelled tradition note:** “For Book of Mormon events in the ancient Americas, the Church takes no position on specific geographic locations. These models are individual interpretations, not Church-endorsed maps.” [G1] (C)

**Internal-map notice — ready for a map caption:** “This schematic shows proposed relationships between places in the narrative. It does not identify them with modern locations.” The Church's teaching map makes this distinction explicitly; it is an educational reconstruction, not a revealed or archaeological map. [G2] (C)

**Evidence notice — editorial wording:** “A source may establish what a scripture says or what a researcher proposes without establishing that an event occurred at a modern site.”

Do not trace the Church's artwork. Independently construct any schematic from cited textual relations, retaining uncertainty. A connected route through unnamed or disputed places must be a narrative sequence, not a geodesic itinerary.

## Named model comparisons

These are deliberately short representative accounts, not an exhaustive ranking or a claim that all proposals have equal evidentiary support.

| Model | Attributed geography | Supporting argument and limitation | Safe short visitor copy |
|---|---|---|---|
| `bom-model-mesoamerican-sorenson` | John L. Sorenson places the land southward mainly in Guatemala, Chiapas and Tabasco, the narrow neck at Tehuantepec, and the land northward north/west of that isthmus. [G3] (C) | Sorenson argues that regional cultural patterns fit the narrative. [G3] (C) Earl Wunderli challenges the necessity of a small setting and the directional interpretation; his essay favors a hemispheric reading of the text, not archaeological confirmation of that alternative. [G4] (C) | “John L. Sorenson proposed a limited setting in southern Mexico and Guatemala, with Tehuantepec as the narrow neck. The interpretation is disputed.” [G3, G4] (C) |
| `bom-model-heartland` | Andrew H. Hedges identifies Rod L. Meldrum with a Heartland model centered on the Mississippi and Ohio valleys. [G5] (C) FAIR's older description of a Meldrum variant identifies Sidon with the Mississippi, Cumorah with New York, and the narrow neck with Niagara. [G6] (C; secondary description only) | Hedges reports supporters' use of early Church identifications of New York Cumorah and their reading of promised-land language as referring to the United States; critics dispute those premises and the fit to internal geography. Hedges also describes a later Lake Michigan corridor interpretation of the narrow neck. **Do not blend it with the Niagara variant.** [G5] (C) | “Heartland proposals place the narrative in parts of North America, particularly the Mississippi and Ohio valleys. Proposed boundaries and individual site identifications vary.” [G5] (C) |
| `bom-model-hemispheric-historical` | A historical hemispheric interpretation, associated with Orson Pratt, placed Nephi and Zarahemla in northern South America, the narrow neck at Darien/Panama, and the final battles at New York Cumorah. [G5] (C) | Broad continental readings have been defended from internal language; limited-model advocates contest the travel scale and distribution of events. These are disagreements about interpretation, not evidence that either map is established history. [G4] (C) | “A historical hemispheric model associated with Orson Pratt spread the narrative across North and South America. Later interpreters proposed smaller settings.” [G5] (C) |

**Readiness restriction:** the Heartland overview is usable as an attributed model-family description. Do not build detailed Heartland location pins from this checkpoint: the proponent pages attempted below failed to open, and the secondary descriptions cover different variants. Hedges, FAIR, Scripture Central and Dialogue are not sources of official Church doctrine. [G1, G5, G6] (C)

## Arabian narrative: statements that can be displayed without locating them

These records identify first scriptural references. Under research.md §1’s proposed navigator, all eight supplementary place records use `first:3`, `layers:["bom"]`, `parent:earth`, no coordinates and no numeric `when`. These are text/codex records until a nonspatial renderer is available; they are not ready-to-import surface sites.

| ID | First reference | Exact proposed text | Position/date treatment |
|---|---|---|---|
| `bom-nahom` | 1 Nephi 16:34 | “The narrative reports Ishmael’s death and says he was buried at a place called Nahom.” [G7] (C) | Unlocated in default view; no grave pin. |
| `bom-bountiful-arabia` | 1 Nephi 17:5–8 | “Nephi describes a fertile coastal place that the travelers name Bountiful. After arriving, he goes up a mountain where he is commanded to build a ship.” [G8] (C) | Distinct ID from the later American Bountiful; do not merge by display name. |
| `bom-irreantum` | 1 Nephi 17:5 | “The travelers call the sea Irreantum, which the text interprets as many waters.” [G8] (C) | No named modern ocean identification from this verse alone. |
| `bom-first-landing` | 1 Nephi 18:23 | “After sailing for many days, the company reaches the land it calls the promised land.” [G9] (C) | No American landing port or transoceanic track asserted. |

Journey sequence: Nahom → nearly eastward travel → coastal Bountiful → sea voyage → unnamed promised-land landing. The eastward wording and eight years in the wilderness are textual claims; the eight years do not measure only the Nahom–Bountiful leg. [G7–G9] (C) Do not use this sequence as evidence of a precise voyage date or surveyed route.

### Nahom and Bountiful proposals

- **Nahom/Nihm:** Warren P. Aston reports Yemeni altars with a donor's Nihm tribal affiliation and argues a relationship to scriptural Nahom. [G10] (C) Neal Rappleye argues that tribal and territorial uses of NHM need not be mutually exclusive, responding to an objection that the inscriptions identify a tribe rather than a place. [G11] (C) Safe model note: “Some Latter-day Saint researchers associate Nahom with the Nihm region of Yemen, citing ancient inscriptions. The identification remains an interpretation; the cited inscriptions do not identify Ishmael's burial.” [G10, G11] (C; final clause is this audit's inference from the reproduced inscription, not a quotation from an excavator.) The primary excavation reports were not independently checked; do not label the burial archaeologically confirmed.
- **Bountiful:** Aston's opened 2024 abstract proposes Khor Kharfot in southern Oman and discusses an alternative approach through Wadi Kharfot. [G12] (C; abstract only) FAIR also reports Khor Rori near Salalah as a proposal associated with Potter and Sedor. [G13] (C; secondary attribution) Safe model note: “Researchers have proposed locations on Oman's southern coast, including Khor Kharfot and Khor Rori. These are candidates for the narrative's Bountiful, not established identifications.” [G12, G13] (C) Do not build reconstructed shipyards or exact campsites from these sources.

## Jaredite narrative: Ether 1–3

| ID | First reference | Exact proposed text | Geographic limitation |
|---|---|---|---|
| `bom-great-tower` | Ether 1:33 | “Ether's account begins with Jared's group leaving the great tower at the scattering of languages.” [G14] (C) | Scripture narrative; no excavated tower identification or numeric date supplied. |
| `bom-nimrod-valley` | Ether 2:1 | “Jared's group gathers in the valley called Nimrod, northward of its earlier location.” [G15] (C) | Relative location only. |
| `bom-moriancumer` | Ether 2:13 | “The travelers name their coastal camp Moriancumer and remain there for four years.” [G15] (C) | No modern coast, sea or longitude established. |
| `bom-shelem` | Ether 3:1 | “At the mountain called Shelem, the brother of Jared prepares stones for the vessels' light.” [G16] (C) | No modern mountain identification. |

Ether 2:6 describes an earlier crossing of waters in barges; do not conflate this with the later ocean crossing. [G15] (C) Ether 1–3 does not establish an overland Asian itinerary, a Pacific departure point, or the eventual American landing coordinates. This is a bounded textual finding, not a claim about every proposed Jaredite model. [G14–G16] (C)

## Opened source register

All successful opens below were on 2026-10-26. The descriptions specify evidence scope.

| ID | Source | Supports / limitation |
|---|---|---|
| G1 | [Church, Book of Mormon Geography](https://www.churchofjesuschrist.org/study/manual/gospel-topics/book-of-mormon-geography?lang=eng) | Official Church position; opened substantive overview. |
| G2 | [Church, Possible Book of Mormon Sites in Relation to Each Other](https://www.churchofjesuschrist.org/bc/content/shared/content/images/gospel-library/manual/14419/book-mormon-land-map_1941052.pdf) | PDF text and map disclaimer; not a modern location map. |
| G3 | [John L. Sorenson, How Could Joseph Smith Write So Accurately about Ancient American Civilization? (2002)](https://scripturecentral.org/archive/books/book-chapter/how-could-joseph-smith-write-so-accurately-about-ancient-american-civilization) | Proponent's own argument and regional mapping; full text opened, especially “If we identify…” passage. |
| G4 | [Earl M. Wunderli, Critique of a Limited Geography for Book of Mormon Events, Dialogue 35:3](https://www.dialoguejournal.com/articles/critique-of-a-limited-geography-for-book-of-mormon-events/) | Original critical argument about textual scale/directions and historical model description; full text opened. |
| G5 | [Andrew H. Hedges, Book of Mormon Geographies, BYU Studies 60:3](https://byustudies.byu.edu/article/book-of-mormon-geographies) | Scholarly survey of model history and competing claims; opened. Faith-oriented survey, not archaeological consensus. |
| G6 | [FAIR, What is the Heartland Model of Book of Mormon geography?](https://www.fairlatterdaysaints.org/answers/Question:_What_is_the_Heartland_Model_of_Book_of_Mormon_geography) | Opened older Meldrum variant table; apologetic secondary description, no primary DVD inspected. |
| G7 | [1 Nephi 16](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/16?lang=eng) | Verses 13 and 34; textual direction and burial. |
| G8 | [1 Nephi 17](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/17?lang=eng) | Verses 1, 4–8; direction, duration, Bountiful, Irreantum and ship command. |
| G9 | [1 Nephi 18](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/18?lang=eng) | Verses 8 and 23; departure and arrival; narrative only. |
| G10 | [Warren P. Aston, Newly Found Altars from Nahom (2001)](https://scripturecentral.org/archive/periodicals/journal-article/newly-found-altars-nahom) | Full article and reproduced inscription opened; proponent's report, not independent replication. |
| G11 | [Neal Rappleye, The Place—or the Tribe—Called Nahom?, BYU Studies 62:2](https://byustudies.byu.edu/article/the-place-or-the-tribe-called-nahom) | Original argument about tribal/territorial usage; opened. Does not establish a named burial. |
| G12 | [Warren P. Aston, Accessing Nephi's Bountiful (2024)](https://scripturecentral.org/archive/periodicals/journal-article/accessing-nephi-s-bountiful-a-new-proposal-for-reaching-irreantum) | Opened abstract and publication metadata only; not the full article. |
| G13 | [FAIR, Is there a real-world match for Bountiful?](https://www.fairlatterdaysaints.org/answers/Question:_Is_there_a_real-world_match_in_the_Old_World_for_the_land_%22Bountiful%22_described_in_the_Book_of_Mormon%3F) | Opened competing candidate descriptions; apologetic secondary source. |
| G14 | [Ether 1](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/1?lang=eng) | Verses 33–43; narrative departure and northward valley. |
| G15 | [Ether 2](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/2?lang=eng) | Verses 1, 6 and 13; Nimrod, earlier crossings, Moriancumer. |
| G16 | [Ether 3](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/3?lang=eng) | Verse 1; Shelem and preparation of stones. |

## Access failures and remaining evidence work

- Direct opens of [FIRM's pros/cons discussion](https://bookofmormonevidence.org/pros-cons-of-book-of-mormon-geography-theories/) and [Meldrum's Mississippi/Sidon article](https://bookofmormonevidence.org/the-mississippi-could-it-have-been-river-sidon/) returned HTTP 503. Search snippets are leads, not confirmation of the full arguments. No assertion that Meldrum's current map was inspected.
- [Maxwell Institute geography-history page](https://mi.byu.edu/bom-geography-essay/) returned HTTP 403; not used as evidence.
- Before detailed model geometry: identify the particular edition/version, obtain the proponent's original map, independently assess modern topography, and review criticism at matching specificity. No proposed-model latitude/longitude has been verified here.
- Before historical/archaeological sign-off: open the primary Yemeni excavation/epigraphic publications and independent historical scholarship; this checkpoint does not certify historicity or a scholarly consensus.

Validation: 16 distinct source pages/PDFs successfully opened (G12 abstract only); 8/8 proposed textual place records have explicit primary scripture references; 3/3 named modern model summaries have attribution and an uncertainty boundary; 0 asserted disputed coordinates. No site code or status file changed by this supplement.

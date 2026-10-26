# Expanded Old Testament traditions: research checkpoint

2026-10-26. **Research remains incomplete.** This dossier covers selected expanded Old Testament and pseudepigraphal witnesses beyond the Catholic-core assignment. It does not call these works universally noncanonical: some are scripture within the communities that preserve them. Source keys resolve in [expanded-ot-sources.md](expanded-ot-sources.md); actual reading is recorded chapter by chapter in [expanded-ot-coverage.csv](expanded-ot-coverage.csv).

| Witness | Complete units read | Partial units | Remaining |
|---|---|---|---|
| English1Esdras | 1–9 | None | Bounded record extraction complete; full parallel-text comparison outside selected-witness pass |
| English2Esdras | 1–4 KJV;5–16 WEB Classic | None | See completed [supplement](2esdras-supplement.md); critical recension comparison remains |
| 3Maccabees | 1–7; WEB collated | None | Bounded record extraction complete |
| 4Maccabees | 1–18 supplied body | None | Supplied10/11 gaps checked in WEB PDF; remaining identified-edition collation limited |
| PrayerManasseh | Entire15verse witness | None | Recensional comparison |
| Psalm151 | Heading and7verses | None | Greek/Hebrew witness comparison |
| 1Enoch, Charles division | 1–108 supplied body | None | Edition defects retained; bounded record extraction complete |
| Jubilees, Charles division | 1–50 supplied body | None | Textual anomalies retained; bounded integration complete |
| 1Meqabyan Iyaric | 1–36 supplied | None | Verse-number gap15:11; provenance unresolved |
| 2Meqabyan Iyaric | 1–21 supplied | None | Provenance unresolved |
| 3Meqabyan Iyaric | 1–10 supplied | None | Provenance unresolved |

**277 supplied-body units read;0 partial or unread units in the selected witnesses.** This includes67 Meqabyan chapters from a provisional Iyaric translation whose fidelity remains unverified; reading completion does not establish canon-level certification. These are heterogeneous chapter/work units, not equivalent reading effort or completed atomic-record counts. The210 units excluding Meqabyan use the selected English chapter systems; they are not claimed to match Ethiopian liturgical numbering. No unread row is described as having no atlas material.

**Current acceptance:** selected-witness reading is finished, including all67 Iyaric Meqabyan chapters. Meqabyan translation fidelity remains U and its11 audit entries are excluded from build. Earlier dated supplements retain checkpoint history; their unread counts and total-access blockers are superseded by the final finite pass. Current integration:126rows, comprising115 selected and11 audit-only entries.

## 1. Meta and witness identity

Recommended view: reference library plus source-specific narrative journeys. Use Earth anchors only for independently identified material places, and schematic panels for visionary cosmology. No new coordinates are supplied. Provisional first-appearance gates below are `work:chapter`; the parent must map work IDs to the pack's ordered navigator before implementation. Do not assign all these texts a single supposedly universal canonical order.

| Stable work ID | Names that must remain qualified |
|---|---|
| `1esdras` | English1Esdras; GreekEsdrasA; LatinIII Esdras. Distinct from canonical Ezra/Nehemiah. [XO11] (C) |
| `2esdras` | English16chapter composite commonly called LatinIV Esdras. Its3–14 core is4Ezra; Christian framing commonly labelled5Ezra(1–2) and6Ezra(15–16) must not be silently included in every recension. [XO11,XO13] (C) |
| `ezra-sutuel` | Cowley's Ethiopian witness has13chapters corresponding to Latin4Esdras3–14, excluding5/6Ezra. This is a crosswalk, not chapter-number identity. [XO10] (C) |
| `1enoch` / `jubilees` | Ethiopian scripture witnesses; Charles chapter systems are working research locators. Cowley explicitly warns of different Ethiopian divisions. [XO09,XO10] (C) |
| `1meqabyan` / `2meqabyan` / `3meqabyan` | Distinct works, not aliases of Greek1–4Maccabees. Cowley notes counting books2/3 together can obscure the three works. [XO10] (C) |

OCA's institutional overview supports an expanded Orthodox collection but is not an edition-level Greek/Slavonic crosswalk [XO17] (C). Precise Slavonic Esdras numbering and the placement/status of4Maccabees in selected Greek editions remain **unresolved** here; the builder must not replace them with a universal Orthodox checkbox.

## 2. Structure, dates and confidence

`(C)` below means the stated witness was read and supports the limited textual proposition. It does not mean an event occurred historically or that the translation was collated to a critical edition. Unsupported historical identifications are withheld. 3Maccabees has now been collated against WEB Classic.4Maccabees1/18 retained cards were collated; remaining chapters retain an edition-quality limitation, including blank/missing10:4 and11:7–8 in XO04; these verses were subsequently read in WEB PDF XO22.

Separate three axes: `narrativeTime`, `compositionEstimate`, `manuscriptDate`. Examples:1Enoch's pre-Flood story is not dated200–150BCE merely because LOC dates the copied4Q201 fragment approximately then [XO12] (C).3Maccabees' PtolemyIV setting is distinct from the text's composition; VanderKam's quoted treatment connects the opening with Raphia217BCE, but this does not independently verify the miracle narrative [XO14] (C). No exact composition date is adopted for the other works on this preliminary evidence.

Jubilees' jubilee/week/year scheme remains a literary chronological system. Preserve explicit month/day and regnal labels as strings. Do not convert Charles's bracketed AM figures to archaeological BCE dates. The host says editorial notes were omitted, while some bracketed dates remain [XO08] (C).

## 3. Places and narrative settings

All entries are reference-only (`coordinates:null`). Shared known-city identity may be reused after parent crosswalk; narrative associations stay with their witnesses.

| ID | Setting; first gate | Source-specific association |
|---|---|---|
| XO-P01 | Jerusalem;1esdras:1 | Josiah's Passover and later destruction. [XO01]1:1–22,54–56(C) |
| XO-P02 | Magiddo/Megiddo;1esdras:1 | Josiah's battle; death follows transport to Jerusalem in this witness. [XO01]1:29–31(C) |
| XO-P03 | Babylon;1esdras:1 | Exile destination; return origin. [XO01]1:54–58;2:15(C) |
| XO-P04 | Darius's court;1esdras:3 | Debate setting; city unspecified. [XO01]3:1–16(C) |
| XO-P05 | Visionary Zion;2esdras:2 | Crowned assembly; distinguish vision from city geometry. [XO02]2:42–47(C) |
| XO-P06 | Babylon lament setting;2esdras:3 | Narrator's thirtieth year after the city's ruin. [XO02]3:1–2(C) |
| XO-P07 | Jerusalem temple;3maccabees:1 | Philopator's contested entry. [XO18]1:9–29(C) |
| XO-P08 | Schedia;3maccabees:4 | Captive landing; no precise modern pin. [XO18]4:11(C) |
| XO-P09 | Hippodrome outside city;3maccabees:4 | Confinement/deliverance setting. [XO18]4:11;6:16–30(C) |
| XO-P10 | Ptolemais “rose-bearing”;3maccabees:7 | Seven-day return stop; no automatic merge with Acre. [XO18]7:17–20(C) |
| XO-P11 | Hermon;1enoch:6 | Watchers' descent/oath. [XO07]6:6(C) |
| XO-P12 | Dudael;1enoch:10 | Azazel's confinement; location unknown. [XO07]10:4–6(C) |
| XO-P13 | Waters of Dan;1enoch:13 | Enoch's petition/dream. [XO07]13:7–8(C) |
| XO-P14 | Heavenly houses;1enoch:14 | Visionary ascent. [XO07]14:8–25(C) |
| XO-P15 | Chambers of dead;1enoch:22 | Visionary reception spaces. [XO07]22(C) |
| XO-P16 | Garden of Righteousness;1enoch:32 | Wisdom-tree encounter. [XO07]32(C) |
| XO-P17 | Sinai; jubilees:1 | Moses' revelation frame. [XO08]1:1–4(C) |
| XO-P18 | Eden/Sinai/Zion relation; jubilees:8 | Sacred spatial triad, not measured alignment. [XO08]8:19(C) |

## 4. Events and explanatory cards

| ID | Exact proposed paraphrase; first gate; chronology |
|---|---|
| XO-E01 | “Zerubbabel wins the court debate and asks for Jerusalem's restoration.” `1esdras:4`; Darius narrative setting, no importedBCE date. [XO01]4:13,34–63(C) |
| XO-E02 | “Uriel answers Ezra's questions about suffering through comparisons with human limits.” `2esdras:4`; follows the narrative thirtieth-year lament. [XO02]3:1;4(C) |
| XO-E03 | “The narrative describes persecution, threatened elephant trampling, angelic rescue and a royal reversal.” `3maccabees:6`; story chronology only. [XO18]2–6(C) |
| XO-E04 | “The return includes authorized reprisals against fellow Jews who had abandoned the law.” `3maccabees:7`; preserve this difficult ending alongside deliverance. [XO18]7:10–15(C) |
| XO-E05 | “The prayer confesses wrongdoing and seeks mercy.” `prayer-manasseh:1`; no explicit city or date in this prayer body. [XO05]1–15(C) |
| XO-E06 | “David recalls shepherding, anointing and victory over his opponent.” `psalm151:1`; heading attributes the psalm to David; not proof of authorship. [XO06]heading,1–7(C) |
| XO-E07 | “Devout reason is illustrated through Eleazar, seven brothers and their mother.” `4maccabees:1`; martyr narrative, no unsupported exact death date. [XO19]1:1–12(C) |
| XO-E08 | “Enoch conveys the Watchers' unsuccessful petition.” `1enoch:13`; pre-Flood literary setting. [XO07]13–16(C) |
| XO-E09 | “Noah's descendants receive territorial lots and an oath against encroachment.” `jubilees:8`; narrated jubilee scheme, not modern sovereign boundaries. [XO08]8–9(C) |
| XO-E10 | “Tseerutsaydan commands idol worship and threatens dissenters.” `1meqabyan:1`; this excerpt supplies no secure historical identification. [XO16]1:18–28(C) |

## 5. Journeys

| ID | Actor and ordered settings | Display limit |
|---|---|---|
| XO-J01 | Josiah: Magiddo→Jerusalem; `1esdras:1` [XO01]1:29–31(C) | Narrative transport, no surveyed road. |
| XO-J02 | Sanabassar/returnees: Babylon→Jerusalem; `1esdras:2` [XO01]2:15(C) | Do not silently merge all Ezra/Sheshbazzar aliases before comparison. |
| XO-J03 | Captives: unnamed Egyptian origins→Schedia→confinement; `3maccabees:4` [XO18]4:7–11(C) | Boats stated; origins and final city geometry unresolved. |
| XO-J04 | Released people: departure→Ptolemais→homes; `3maccabees:7` [XO18]7:16–20(C) | Return narrative; no modern itinerary. |
| XO-J05 | Enoch: Dan petition→visionary heaven; `1enoch:14` [XO07]13–14(C) | Schematic dream/ascent, not globe polyline. |
| XO-J06 | Enoch's cosmic tour; `1enoch:17` [XO07]17–36(C) | Source-ordered reference sequence; no astronomical coordinates. |

## 6. People, relationships and nonmerges

| ID | Relation; first gate | Source and constraint |
|---|---|---|
| XO-R01 | Zerubbabel — petitions → Darius;1esdras:4 | [XO01]4:43–47(C); patronage, not kinship merely because court title says “cousin.” |
| XO-R02 | Uriel — interprets-for → Ezra;2esdras:4 | [XO02]4:1–11(C); literary angel role. |
| XO-R03 | Simon — intercedes-for → community;3maccabees:2 | [XO18]2:1–20(C). |
| XO-R04 | Eleazar — intercedes-for → community;3maccabees:6 | [XO18]6:1–15(C); no automatic identity with4Maccabees' martyr. |
| XO-R05 | Mother — parent-of → seven sons;4maccabees:18 | [XO19]18:6–10(C); mother unnamed; no invented “Hannah” alias. |
| XO-R06 | Raphael — explains-to → Enoch;1enoch:22 | [XO07]22(C); retain witness spelling. |
| XO-R07 | Angel of presence — communicates-to → Moses;jubilees:1 | [XO08]1:27–29(C); do not silently name this angel. |
| XO-R08 | Noah — father-of → Shem/Ham/Japheth;jubilees:8 | [XO08]8:10–11(C); genealogy in text, not genetic population history. |

**Nonmerges:**1/2Esdras English numbering versus Latin/Greek names;2Esdras composite versus EthiopianEzraSutuel;GreekMaccabees versusMeqabyan;3MaccabeesEleazar versus4MaccabeesEleazar;physical Jerusalem versusvisionary Zion;Enoch's mythic stars versusmodern star catalogue;Psalm151 Greek-form witness versusHebrew151A/B without comparison. The last distinction is an explicit research hold, not a claim those recensions were read.

## 7. Open issues and precise next work

1. **Unfinished bodies:** the coverage table/CSV identifies every outstanding chapter. This is not full research acceptance. Remaining body gaps are1Meqabyan2–36 and unenumerated2/3Meqabyan.2Esdras and Jubilees supplied-body reading is complete; edition control and record integration remain.
2. **Edition control:** finish XO04 collation beyond1/18 against an identified edition; XO03 is now collated to XO18; fix neither transcription oddities nor variant names by memory. XO02's visibly damaged1:2 genealogy must not generate kinship edges. Jubilees9:2's “Ham” under Shem requires comparison before generating that edge. Enoch22's four-hollows/three-divisions wording remains a witness tension, not silently normalized geometry.
3. **Meqabyan:** chapter1 excerpt accessible;2–36 not supplied there;2/3Meqabyan primary editions not secured. No fictional Hasmonean identification ofTseerutsaydan. Cowley's distinction is usable despite narrative incompleteness.
4. **Recensions/canon:** explicit Greek/Slavonic edition matrix, Ethiopian numbering crosswalk and Psalm151 textual variants remain. HistoricalCowley1974 should not be recast as a current exhaustive institutional declaration.
5. **Record expansion:** retained cards are selected usable entries, not complete place/person extraction even for fully read3Maccabees. Future extraction must include lower-prominence names and recalled biblical exempla where relevant, or document their exclusion.

No source supplies measured geography for heavenly courts, angel prisons or Noah's allotted continents. Unknown locations remain legitimate reference entries; uncertainty does not authorize invented pins. Do not ship this checkpoint under a comprehensive or research-ready label.

## 8. Access, validation and scope boundary

Eight major witness families plusMeqabyan are tracked here.4Baruch andAscensionIsaiah are delegated to the parent dossier; no implied coverage here. This worker changed only the three expanded-OT artifacts, with no commits/pushes.

Reading evidence is passage-specific URLs and explicit spans, not retrospective fabricated source hashes. The ledger has248 unique rows:246 enumerated chapter/work units and2 unresolved book rows. All full/partial rows link the witness actually inspected. No raw copyrighted source corpus is uploaded. The original register has42 overlapping rows; the Enoch completion supplement adds20 and the Jubilees supplement adds38, for100 total selected rows (see counts below).

### Supplement after completing 1 Esdras and supplied 4 Maccabees

The full1Esdras reading adds Ecbatane archive(6:23), Theras river staging(8:41,61), Lebanon→Joppa timber transport(5:55), and Ezra’s Babylon→Theras→Jerusalem movement(8:3–6,41,61). Treat these as reference settings pending identity collation, not invented coordinates. Retain Adar23/year6Darius(7:5) as witness chronology; do not harmonize automatically with Ezra. Marriage-separation and public-reading accounts(8:91–9:55) need distinct event cards. [XO01]

4Maccabees adds Simon’s accusation, Apollonius’s temple attempt, Jason’s appointment and Antiochus’s attack(4); Eleazar’s refusal/death(5–6); seven brothers’ ordeal(8–12); mother’s exhortation(16) and reported death(17:1). Its proposed epitaph(17:8–10) is not an excavated tomb location. Harbor/ship imagery(7,13) supplies no voyage. The kinship statement calling Antiochus Seleucus’s son(4:15) must remain a text claim pending historical comparison. Blank10:4 and11:7–8 are defects in XO04, subsequently supplied by the parent’s full reading of WEB PDF chapters10–11 (XO22); this does not establish full18-chapter WEB collation. [XO04]


### Enoch completion: retained records and exclusions

Every supplied chapter1–108 was read; this establishes coverage of this historical translation, not a Geʽez critical collation. The following rows extend the selected atlas register. All use XO07 and confidence C for the limited textual claim, with no claim of historical occurrence. Locations remain `coordinates:null`; cosmic movements use schematic sequences. IDs are new and do not replace earlier Enoch records.

| ID | Kind; first gate | Source locator and proposed entry |
|---|---|---|
| XO-P19 | Visionary setting;1enoch:39 | 39:3–8. Whirlwind carries narrator to righteous dwellings at heaven’s end. |
| XO-P20 | Visionary setting;1enoch:48 | 48:1. Fountain of righteousness, with wisdom fountains. |
| XO-P21 | Visionary setting;1enoch:52 | 52. Western metal mountains; not ore-deposit coordinates. |
| XO-P22 | Visionary setting;1enoch:54 | 54:1–6. Fiery valley of punishment. Do not automatically merge all punishment valleys. |
| XO-P23 | Mythic setting;1enoch:60 | 60:7–10. Duidain wilderness east of the garden houses Behemoth; Leviathan has ocean depths. Distinct from Dudael until evidence supports identity. |
| XO-P24 | Visionary setting;1enoch:71 | 71:5–9. Crystal/fire house surrounded by angelic guardians. |
| XO-P25 | Narrative setting;1enoch:83 | 83:3–9. Mahalalel’s house frames Enoch’s first dream; town unknown. |
| XO-P26 | Visionary setting;1enoch:90 | 90:28–36. Old house removed; larger replacement gathers the flock. No reconstructed architectural dimensions. |
| XO-P27 | Visionary setting;1enoch:108 | 108:3–6. Fiery chaotic wilderness; explicitly not a terrestrial pin. |
| XO-E11 | Explanatory;1enoch:72 | 72–82. Solar/lunar portals and364-day calendar; represent ancient textual cosmology, not a modern scientific simulation. |
| XO-E12 | Vision;1enoch:85 | 85–90. Animal-history dream moves through destruction, deliverance, rule, temple loss and judgment. Animal-to-person/nation identifications require a separate attributed interpretive crosswalk. |
| XO-E13 | Explanatory;1enoch:93 | 93:1–10;91:12–17. Apocalypse of Weeks continues across reordered chapter segments in this edition; preserve literary order separately from numeric chapter gate. |
| XO-E14 | Narrative;1enoch:106 | 106–107. Lamech fears Noah’s unusual birth; Enoch affirms Lamech’s paternity. Do not turn the initial suspicion into a settled angelic-parent edge. |
| XO-J07 | Visionary journey;1enoch:70 | 70–71. Spirit-chariot elevation→north/west place→heavenly fire house; symbolic sequence. |
| XO-J08 | Narrative journey;1enoch:81 | 81:5–10. Seven holy beings return Enoch to his house to instruct his children; no city supplied. |
| XO-J09 | Narrative journey;1enoch:106 | 106:4–9;107. Lamech→Methuselah; Methuselah visits Enoch at earth’s ends and returns. No measured itinerary. |
| XO-R09 | interprets-for;1enoch:40 | 40:8–10. Angel of peace explains Michael/Raphael/Gabriel/Phanuel’s roles. Do not silently identify the guide with one of those four. |
| XO-R10 | teaches;1enoch:82 | 82:1–2. Enoch transmits books to Methuselah for later generations. |
| XO-R11 | parent-of;1enoch:85 | 85:1–3. Edna is named as Methuselah’s mother; Enoch addresses him as son. |
| XO-R12 | parent-of;1enoch:106 | 106:1–9;107:2. Enoch→Methuselah→Lamech→Noah; this explicit chain controls over loose “grandfather” language in65. |

Chapter-specific exclusions are recorded in the ledger. Chapters94–105 chiefly exhort or describe judgment/afterlife; ethical “paths,” generalized houses, sailors and wealth are not new named journeys or geocodable settlements. Chapters43–44 do not license merging parabolic stars with modern astronomical catalogues. Seven unnamed rivers/islands in77 stay collective literary features, not guessed modern equivalents. Chapter56 names Parthians/Medes in a projected incursion; it does not independently document a dated invasion.

Critical holds:60 has a Noah-fragment heading but opens with Enoch’s500th-year date;71 explicitly inserts a conjectural lost-passage explanation and interprets the Son-of-Man wording;74 prints21,832 for an eight-year lunar sum amid inconsistent-looking numerals;90 jumps from12 to19 in the supplied numbering;91 is split around92/93. These are transcription/editorial observations, not proof of an underlying manuscript variant. Preserve them and compare an identified edition before generating exact chronology, arithmetic, or identity claims. The chapter69 angel catalogue repeats names; do not deduplicate by spelling alone.

Before the Jubilees supplement below, the register contains27 setting cards,14 event/explanatory cards,9 journeys and12 relationship rows:62 overlapping selected rows. Full atomic extraction and cross-link audit remain open.


### Jubilees completion and exact integration constraints

All supplied Charles/NNU chapters1–50 were read on2026-10-26, including the closing Sabbath law and colophon. Each chapter has its own actual assessment in the CSV. The following source-specific records use **XO08**, textual confidence C, `coordinates:null`, narrative chronology only. They supplement rather than overwrite the earlier selected cards. Each row may collect multiple related claims; row counts are not atomic-fact counts.

| ID | Kind; first gate | Source locator and proposed entry |
|---|---|---|
| XO-P28 | Setting;jubilees:3 | 3:32–34. Elda is the post-Eden dwelling; modern identity unknown. |
| XO-P29 | Setting;jubilees:4 | 4:26. Eden, eastern mountain, Sinai and Zion form a four-place sacred grouping; retain alongside8:19’s triad. |
| XO-P30 | Setting;jubilees:5 | 5:28;7. Lubar is one mountain of Ararat, ark-rest/vineyard setting; no identification with a modern summit. |
| XO-P31 | Settlement group;jubilees:7 | 7:14–17. Sedeqetelebab east, Na’eltama’uk south and Adatan’eses west near Lubar are named for wives; schematic relative positions only. |
| XO-P32 | Setting;jubilees:18 | 18:13. Isaac’s binding mountain is explicitly Sion in this witness; retain without harmonizing to another text’s name. |
| XO-P33 | Setting;jubilees:24 | 24. Gerar wells named Perversity, Enmity and Room; separate narrative wells, unlocated. |
| XO-P34 | Setting;jubilees:29 | 29:9–11. Karnaim, Ashtaroth, Edrei, Misur and Beon belong to the narrated Rephaim landscape; no guessed coordinates. |
| XO-P35 | Setting;jubilees:32 | 32. Deborah’s burial oak/river and Rachel’s Ephrath/Bethlehem roadside pillar are distinct memorial settings. |
| XO-P36 | Setting;jubilees:33 | 33. Magdaladra’ef is a journey setting; modern identification withheld. |
| XO-P37 | Setting;jubilees:34 | 34. Robel and Tamnatares are attributed foundations; seven named Amorite rulers/settings require separate later atomic extraction. |
| XO-P38 | Setting;jubilees:38 | 38. Aduram hill is Esau’s narrated burial place; no modern identification. |
| XO-P39 | Setting;jubilees:45 | 45:1–7. Goshen and Rameses are granted dwelling regions; no reconstructed household boundaries. |
| XO-E15 | Explanatory;jubilees:6 | 6. Covenant/Weeks observance and364-day calendar are literary institutions, not measured astronomical accuracy. |
| XO-E16 | Narrative;jubilees:10 | 10. Mastema retains one-tenth of spirits; Noah transmits remedies. The account is not clinical evidence. |
| XO-E17 | Narrative;jubilees:12 | 12. Abram burns the idol-house; Haran dies while trying to save idols. Traditional narrative, not independently verified biography. |
| XO-E18 | Narrative;jubilees:30 | 30. Dinah’s assault and Simeon/Levi’s killing of Shechem’s men receive approval in this narrative; retain violence and attribution. |
| XO-E19 | Narrative;jubilees:32 | 32. Levi’s priestly role is affirmed; an angel prohibits Jacob’s planned permanent Bethel sanctuary. Do not render the proposed walls as built. |
| XO-E20 | Narrative;jubilees:33 | 33. Reuben assaults sleeping Bilhah; do not encode a consensual romantic relationship. |
| XO-E21 | Narrative;jubilees:38 | 38. Jacob kills Esau; sons’ pursuit leads to Seir tribute. Do not replace this witness with a harmonized Genesis ending. |
| XO-E22 | Explanatory;jubilees:49 | 49–50. Passover and Sabbath laws have a Sinai literary frame; sanctuary prescriptions and prospective Jordan crossing are not completed journeys. |
| XO-J10 | Journey;jubilees:3 | 3. Creation-place→Eden→Elda; schematic sacred narrative, not a mapped migration. |
| XO-J11 | Journey;jubilees:10 | 10. Ararat→Shinar/Babel; Canaan’s disputed settlement and Madai’s Media account are attributed territorial traditions. |
| XO-J12 | Journey;jubilees:12 | 12–13. Ur→Haran→Asshur→Shechem→Bethel/Ai→Hebron→Bealoth→Egypt→Bethel/Ai→Hebron. Preserve printed Asshur; no inferred road. |
| XO-J13 | Journey;jubilees:17 | 17. Hagar/Ishmael’s Beersheba wilderness→Paran sequence; no inherited modern border. |
| XO-J14 | Journey;jubilees:24 | 24. Isaac: Hebron→Well of Vision→Gerar/wells→Well of Oath; Egypt is explicitly prohibited, not a traveled destination. |
| XO-J15 | Journey;jubilees:27 | 27–32. Jacob: Well of Oath→Bethel→Haran→Gilead→Jabbok→Jordan/pastures→Shechem→Bethel; Hebron family visit is separately stated. |
| XO-J16 | Journey;jubilees:34 | 34. Joseph seeks brothers at Shechem, finds them at Dothan, and is sold onward to Egypt; slavery movement, not voluntary travel. |
| XO-J17 | Journey;jubilees:42 | 42–43. Two grain-buying journeys Canaan↔Egypt; second return interrupted by the planted-cup accusation and return to Joseph’s city. |
| XO-J18 | Journey;jubilees:44 | 44–45. Printed Haran→Well of Oath→Goshen; preserve the anomalous origin pending edition comparison. Departure third-month16, arrival fourth-month1 are narrative calendar strings. |
| XO-J19 | Journey;jubilees:45 | 45–46. Jacob’s burial and later brothers’ bones travel Egypt→Hebron; Joseph’s bones remain in Egypt at this point. Amram remains in Hebron before later returning. |
| XO-J20 | Journey;jubilees:47 | 47–50. Moses flees Egypt→Midian and returns; Exodus sea passage→Shur/shore→Sin between Elim/Sinai. Route geometry unknown; Jordan crossing remains future. |
| XO-R13 | spouse/sibling;jubilees:4 | 4. Awan is Cain’s sister/wife; Azura is Seth’s sister/wife. These are textual family claims. |
| XO-R14 | spouse/parent;jubilees:4 | 4. Edna daughter of Danel is Enoch’s wife; Edna daughter of Azrial is Methuselah’s wife. Distinct persons despite same spelling. |
| XO-R15 | renames;jubilees:15 | 15. Abram→Abraham and Sarai→Sarah are explicit identity aliases within this witness. |
| XO-R16 | sibling;jubilees:28 | 28:9,23. Bilhah and Zilpah are sisters; Zebulon and Dinah are twins. Do not infer these solely from external genealogies. |
| XO-R17 | parent/spouse;jubilees:40 | 40;44:24. Asenath is daughter of Potiphar, priest of Heliopolis; preserve this witness’s name rather than silently substituting Potiphera. |
| XO-R18 | adopts/parent;jubilees:47 | 47. Tharmuth adopts Moses; Jochebed nurses him; Amram teaches him writing; Miriam guards him. Distinguish adoption from biological kinship. |
| XO-R19 | transmits-to;jubilees:45 | 45:16. Jacob entrusts ancestral books to Levi; textual custodianship, not proof of surviving manuscripts. |

**Unresolved witness tensions:**9:2 prints Ham in Shem’s subdivision, whereas7:18 names Elam;13:25 has a lacuna in the rescue episode;28’s birth ordering/date labels require collation;34 reports Dinah’s death while44 includes her in the descent roster;44:1 prints Haran despite the preceding Hebron setting. Chapter48’s Mastema detention/release and49’s destructive powers require interpretation rather than a flattened continuous timetable. Chapter50 prints Sin[ai] between Elim and Sinai. Bracketed AM figures, reported army totals, and genealogical totals are not independently verified calculations. No historical migration or ethnic ancestry is established merely by10/20’s territorial and ethnogenetic narration.

Chapters2,6,15,21–23,25–26,49–50 include substantial law, blessing and eschatology; their imagined future motion, sailing prohibitions and metaphoric paths do not become new traveled routes. Named family catalogues in4,28,34,44 and king lists in38 are read but not exhaustively atomized here. This is an explicit integration gap, not an unread-source gap.

The local expanded register now has**100 overlapping selected rows**:39 settings,22 events/explanatory rows,20 journeys,19 relationships. The separate [2Esdras supplement](2esdras-supplement.md) contributes its own records; they are not included in100. Master coverage replaces2Esdras5–16 statuses from the parent’s12-row supplement, without adding duplicate chapter rows. Its restored7 and14 book-total differences remain source-specific.


### Finite integration additions from completed chapter assessments

These fifteen material entries close the principal unregistered episodes/settings identified in the chapter ledger and the earlier1Esdras/4Maccabees supplement. They use the same textual-only confidence C and reference-only geography. General illustrative biblical allusions, repeated exhortations, exhaustive census names and detailed torture steps are intentionally not separate atlas cards.

| ID | Kind; first gate | Source locator and proposed entry |
|---|---|---|
| XO-P40 | Setting;1esdras:6 | [XO01]6:23. Ecbatane is the archive location where the decree is found; no identification-by-spelling or exact building pin. |
| XO-P41 | Setting;1esdras:8 | [XO01]8:41,61. Theras river is Ezra’s staging point; no automatic equation with another witness’s river name. |
| XO-E23 | Narrative;1esdras:5 | [XO01]5. Altar restoration and temple foundations precede opposition to rebuilding; stages remain separate from final dedication. |
| XO-E24 | Narrative;1esdras:7 | [XO01]7:5–15. Temple completion and dedication precede Passover; Adar23 in Darius’s sixth year is this witness’s date string. |
| XO-E25 | Narrative;1esdras:8 | [XO01]8:91–9:36. Ezra’s lament and separation process concern marriages and families; retain coercive/social consequence without endorsing it. |
| XO-E26 | Narrative;1esdras:9 | [XO01]9:37–55. Public law reading and explanation take place before the gathered community. |
| XO-E27 | Narrative;4maccabees:4 | [XO04]4. Simon’s accusation leads to Apollonius’s temple attempt; Jason’s appointment and Antiochus’s attack belong to the narrated political sequence. No assumed historically exact kinship from4:15. |
| XO-E28 | Narrative;4maccabees:5 | [XO04]5–6. Eleazar refuses prohibited food and dies under torture; maintain the explicit witness-specific identity. |
| XO-E29 | Narrative;4maccabees:8 | [XO04]8–12. Seven brothers resist coercion and are killed; missing supplied verses in10/11 limit detailed reconstruction, not the broad episode. |
| XO-E30 | Narrative;4maccabees:16 | [XO04]16–17. Mother’s exhortation precedes the reported account of her death; the proposed epitaph is not a discovered monument. |
| XO-E31 | Explanatory;1enoch:6 | [XO07]6–11. Watchers’ descent, illicit instruction and judgment form the narrative background to Enoch’s petition; supernatural claims remain text-attributed. |
| XO-E32 | Narrative;jubilees:5 | [XO08]5–6. Flood and covenant are narrated before territorial divisions; Lubar landing is distinct from a modern summit identification. |
| XO-E33 | Narrative;jubilees:39 | [XO08]39–40. Joseph’s enslavement, imprisonment and appointment precede famine administration; do not turn literary regnal chronology into established Egyptian history. |
| XO-J21 | Transport;1esdras:5 | [XO01]5:55. Lebanon timber is brought by sea to Joppa; no reconstructed shipping track. |
| XO-J22 | Journey;1esdras:8 | [XO01]8:3–6,41,61. Ezra: Babylon→Theras river→Jerusalem; retain source-specific staging name. |

The integrated local register is now **115 selected records**:41 settings,33 events/explanatory cards,22 journeys and19 relationships. [expanded-ot-integration.csv](expanded-ot-integration.csv) indexes all115, including the original100. The separate2Esdras supplement is intentionally not duplicated. These are bounded editorial cards, not a claim that every named person or every clause deserves its own record.

### Acceptance boundary for the expanded-OT contribution

**Complete for this bounded handoff:** supplied-body reading of the210 enumerated non-Meqabyan units; selected place/event/journey/relationship cards; source-specific dating and uncertainty; local IDs, passage locators, typed record links and reference/schematic render dispositions. The additional fully read1Meqabyan excerpt makes211 fully read rows. “Supplied-body complete” does not mean an unabridged critical edition:4Maccabees10/11 and Enoch90 have recorded defects; the latter’s numbering jump is not silently declared missing manuscript text.

**Concrete remaining acceptance gates:** (1) obtain and read1Meqabyan2–36 plus an identified2/3Meqabyan witness with its own chapter enumeration, or obtain an explicit scope exclusion; (2) retain source-specific edition defects and do not claim full WEB collation beyond chapters1,10,11,18; (3) resolve Greek/Slavonic edition status and Ethiopian numbering for any edition-specific navigator actually offered, rather than presenting one universal canon; (4) implement the global pack’s work numbering and cross-dossier place/person identity joins, with a material-record audit after that mapping. A reference-only build does not require unknown ancient coordinates.

Intentional editorial exclusions are finite categories: every census/birth/king-list name as a standalone card, repeated legal exhortations, repeated retellings of already registered events, torture-step microevents, speculative animal-dream identity assignments, and comprehensive manuscript variants. They must not be described as independently researched historical evidence. The100 original and15 added cards carry their source passages; compound cards must gate later clauses to their later local units or display as explicitly retrospective reference summaries. The integration CSV’s first_local_unit is the card’s local entry gate, **not** authorization to expose all later linked passages at that gate.


**4Maccabees gap closure:** the parent read WEB Classic PDF chapters10:1–21 and11:1–27 on2026-10-26, including the three verses absent from XO04.10:4 concerns the third brother’s bodily suffering and untouched soul;11:7–8 concerns the fifth brother’s appeal and accusation against the tyrant. No additional place or route follows. Original HTML retrieval failures remain part of access history, but these particular verse-access gaps are resolved by XO22. This is supplemental witness access, not full WEB18-chapter collation.


### Provisional Meqabyan discovery: access is no longer the sole blocker

The newly accessible Iyaric bodies enumerate36/21/10chapters. Source notes XO23–27 distinguish actual reading from discovery snippets and document uncertain provenance. Earlier statements about2/3Meqabyan being unenumerated or wholly inaccessible describe the superseded checkpoint. The ledger now has277 unique work units:229 supplied-body read,1 partial,47 unread. Specifically outstanding reading:1Meqabyan6 remainder and7–35;2Meqabyan2–19. Book3 is read, but its translation fidelity is unverified. This cannot close Ethiopian-canon research acceptance by itself.

The following four entries are **audit-only (U)** for canon-level use. Their limited modern-witness wording was read; they must not ship as established Ethiopian scripture or historical events before provenance verification. No guessed geography or dates are supplied.

| ID | Kind; first gate | Source locator and proposed entry |
|---|---|---|
| XO-U01 | Narrative;1meqabyan:2 | XO24,2–4. Brothers flee to an unnamed mountain, submit to the king, suffer martyrdom and subsequently appear to him. Reference-only; no Seleucid identification. |
| XO-U02 | Narrative;2meqabyan:1 | XO25,1. A Moabite Meqabees attacks the Jerusalem region and returns; do not merge this figure with1Meqabyan’s Benjaminite father. |
| XO-U03 | Explanatory;3meqabyan:2 | XO26,2–4. The Adam/Eve retelling names forbidden fig fruit and frames repentance against the devil’s pride; not an independently established historical episode. |
| XO-U04 | Explanatory;3meqabyan:6 | XO26,6,9–10. Angels receive souls and resurrection is defended; unknown soul paths and figurative sailing are not mappable earthly journeys. |

These four audit entries extend the integration CSV to119 rows but remain excluded from its115 publishable selected records. This distinction prevents a readable yet unauthenticated translation from silently satisfying the source-quality requirement. Confirm translator/base edition or compare an identified translation before promotion. The seven-chapter Wikisource rendering is not a substitute: unexplained names differ materially from the Iyaric witness.


### Final finite Meqabyan reading pass

All67 supplied Iyaric chapters are now read. The master ledger has277 unique fully read units; no selected-witness chapter remains unread. Earlier partial-reading counts are checkpoint history superseded here. Translation acceptance remains blocked: an identified independent text was not readable through the available preview, and the mirrored Iyaric text’s base edition has not been established. Lulu’s publisher attribution supports identifying a likely translator, but cannot certify the mirror’s fidelity. U records remain excluded from build.

Additional audit entries, all U and reference-only:

| ID | Kind; first gate | Source locator and proposed entry |
|---|---|---|
| XO-U05 | Narrative;1meqabyan:15 | XO24,15. Akrandis crosses Yordanos; three brothers defeat him. No historical king identification; numbering skips11. |
| XO-U06 | Journey;1meqabyan:18 | XO24,18–19. Sethite descent and Cain’s westward Qiefaz movement; distinguish from Enoch’s Watchers. |
| XO-U07 | Explanatory;1meqabyan:34 | XO24,34. Kingdom-conflict oracle; not verified political chronology. |
| XO-U08 | Narrative;2meqabyan:2 | XO25,2–5. Reay counsels repentance; Meqabees reforms worship; his children are later captured. |
| XO-U09 | Journey;2meqabyan:8 | XO25,8. Tseerutsaydan’s campaign catalog; preserve names without a reconstructed historical route. |
| XO-U10 | Narrative;2meqabyan:12 | XO25,12:13–15. Thilimyakos strikes the king; enemy forces plunder his realm. |
| XO-U11 | Explanatory;2meqabyan:14 | XO25,14. Resurrection polemic about named Jewish groups; not a neutral account of their historical beliefs. |

The integration register now has126rows:115 selected records plus11 audit-only entries. The latter remain U. Allusion-heavy and exhortatory units are assessed in the chapter ledger; their rhetorical paths and anonymous landscapes are deliberately not added as terrestrial journeys. No additional canon-level claim is inferred from this modern witness alone.

### Current acceptance reconciliation

Earlier checkpoint paragraphs reporting partial Meqabyan access,119 rows, or missing4Maccabees verses are historical progress notes, superseded by this final finite pass and XO22. Current counts are277 read supplied units and126 registry rows (115 selected,11 U). The global record-work index now resolves all126 rows. Unknown dates, unknown locations and uncollated other recensions are disclosed research limits, not an instruction to manufacture missing data. The remaining mandatory source-quality blocker is fidelity/provenance for the11 Meqabyan U records; broader canon navigation is not offered by this work-based design.

# Christianity: origins, major families and overlapping movements

Researched 2026-10-26. Bounded Christianity handoff for the Abrahamic/world-religions atlas; not a declaration that the whole universe or every Christian denomination is complete. Sources below were opened through the web tool; this document paraphrases inspected passages. `(C)` means the cited source supports the attributed statement, not that a religious claim has been proved. **Design:** all records have pack-root `first:1` because this is a historical overview, not scripture reading order; retain `when`/period separately. This is the pack-root navigator gate; module labels are descriptive, without invented “book” chronology.

## 1. Meta and scope

**Design:** shard `christianity`; Earth-historical reference layer plus a typed relationship graph. Use `ch-*` node IDs, `chp-*` places and `che-*` events. Diagram edges represent specified institutional, historical or interpretive relationships; no edge establishes divine authority. “Christianity” is an overview category rather than one denomination founded at a single meeting. Early Jesus communities developed in a Jewish setting; the Gospel accounts preserve differing perspectives rather than a harmonized biography. [CH01] (C)

Covered here: early communities; council-era distinctions; Catholic, Eastern Orthodox, Oriental Orthodox and Church-of-the-East identities; Lutheran, Reformed, Anglican, Anabaptist, Baptist and Methodist developments; evangelical/Pentecostal overlaps; distinct restorationist movements and successor institutions. Deliberate exclusions: exhaustive national churches and modern schisms, detailed doctrinal adjudication, all missionary routes, and a current denomination population database. This is a substantive major-family overview, not exhaustive global Christian history.

## 2. Structure and binding representation rules

Use a graph with historical-context, institutional-development, communion-membership, rupture, merger and cross-cutting-affiliation relations. A single-parent tree is only a navigation projection. Do not force one historical mother church for every movement or display all branches as mutually exclusive demographic categories. Catholic Eastern churches are not simply Eastern Orthodox churches with a different label; Oriental Orthodoxy is distinct from Eastern Orthodoxy. [CH03–06] (C)

**Design:** the following proposed copy is ready as source-qualified reference text. All geometry is withheld in this shard: a documented city association is not an independently verified map coordinate or an exact ancient meeting room. Unknown founder dates stay as periods, not year0. No political borders or contemporary territorial rights are inferred from religious history.

## 3. Places

All have parent `earth`, local gate1, `lat/lon: omitted` and reference-only disposition pending the central gazetteer. Periods are association ranges, not occupancy claims.

| ID / name / type | Relevant period and supported association | Events / source |
|---|---|---|
| chp-jerusalem / Jerusalem / city | First century CE: crucifixion setting in the Christian origins account; a religious claim about resurrection must remain separately attributed. | che-origins; [CH02] (C) |
| chp-nicaea / Nicaea / council city |325: location of the council convened by Constantine. No building footprint supplied. | che-nicaea; [CH02] (C) |
| chp-constantinople / Constantinople / historical city reference |381council;1054Rome–Constantinople censures. Istanbul is the name used for the1965ceremony. | che-constantinople,che-1054,che-1965; [CH03][CH05] (C) |
| chp-ephesus / Ephesus / council city |431council; retain distinction from later Chalcedonian controversy. | che-ephesus; [CH03] (C) |
| chp-chalcedon / Chalcedon / council reference |451council and subsequent contested reception; no boundary or modern alias assumed here. | che-chalcedon; [CH03] (C) |
| chp-rome / Rome / city | Catholic communion's central episcopal reference;1965joint declaration read in Rome. | che-1965; [CH05][CH07] (C) |
| chp-wittenberg / Wittenberg / city |1517Luther's public opposition to indulgence sales. | che-luther; [CH08] (C) |
| chp-zurich / Zurich / city |1525Swiss believers' baptism episode, a symbolic beginning of Anabaptism. | che-anabaptist; [CH10] (C) |
| chp-london / London / city |1612Baptist congregation associated with Thomas Helwys. | che-baptist-london; [CH11] (C) |
| chp-azusa / Azusa Street mission, Los Angeles / historical mission address |312Azusa Street: April1906revival under William J. Seymour. Address is a historical association, not a verified surviving structure. | che-azusa; [CH14] (C) |
| chp-fayette / Fayette, New York / institution-attributed founding setting |6April1830organization in the Church's official account. | che-lds; [CH16] (C); detailed documentary questions remain in the separate LDS research pack |
| chp-east-syriac-region / Assyria, Babylonia and Persia / broad historical context | Church of the East developed east of the Roman-Byzantine world. No exact origin point. | ch-east-syriac; [CH17] (C) |

## 4. Events and date precision

`when` below is permissible only at the stated precision; rows giving centuries/periods omit a numeric single-year value. Associated people are participants, not automatically sole founders.

| ID | Date / kind / places | Exact proposed reference copy | Evidence |
|---|---|---|---|
| che-origins | First century CE; historical-context; chp-jerusalem | “The Jesus movement arose in a Jewish context. Its communities preserved several Gospel accounts and expanded among non-Jews.” Resurrection is Christian proclamation, not independently established by this map. | [CH01][CH02][CH18] (C) |
| che-nicaea |325; council; chp-nicaea | “Constantine convened the Council of Nicaea.” Do not label it the invention of Christianity or creation of the complete biblical canon. | [CH02] (C) |
| che-constantinople |381; council; chp-constantinople | “Constantinople381belongs to the councils accepted by the Oriental Orthodox family alongside Nicaea and Ephesus.” | [CH03] (C) |
| che-ephesus |431; council; chp-ephesus | “Ephesus431is the third council accepted by Oriental Orthodox churches.” Do not make every East-Syriac church a child created by this one event. | [CH03][CH17] (C) |
| che-chalcedon |451and later reception; council/divergence; chp-chalcedon | “Disagreement over Chalcedon's Christological formulation contributed to the separation of the churches now called Oriental Orthodox from the Chalcedonian churches.” No verdict that either party lacked belief in Christ's humanity. | [CH03] (C) |
| che-1054 |1054; personal censures within longer estrangement; chp-constantinople/chp-rome | “Roman legates and Constantinople's patriarchal synod exchanged censures against named persons. The1965joint declaration distinguished these acts from their later consequences for communion.” | [CH05] (C) |
| che-1965 |1965-12-07; reconciliation; chp-rome/chp-constantinople | “PaulVI and AthenagorasI removed the historical censures from ecclesial memory while explicitly acknowledging unresolved differences.” This is not a merger. | [CH05] (C) |
| che-luther |1517; reform controversy; chp-wittenberg | “Luther publicly opposed indulgence sales in Wittenberg. The later division developed beyond his original intention.” Avoid treating the traditional door-nailing scene as necessary to this sourced claim. | [CH08] (C) |
| che-anabaptist |1525-01-21; believers' baptism; chp-zurich | “Conrad Grebel baptized George Blaurock, who baptized others, in Felix Manz's house; Mennonite World Conference identifies this as the commonly recognized beginning.” Symbolic origin, not every Anabaptist group's sole birthplace. | [CH10] (C) |
| che-baptist-london |1612; congregation; chp-london | “Followers of John Smyth formed a London Baptist congregation led by Thomas Helwys.” Its earlier1609setting is the Netherlands; no unsupported Amsterdam pin supplied. | [CH11] (C) |
| che-methodist-us |1784; institutional organization; North America reference only | “American Methodists constituted the Methodist Episcopal Church following United States independence.” No city inferred from this source. | [CH12] (C) |
| che-stone-campbell |1831-12-31/1832-01-01; merger; Lexington, Kentucky reference only | “The Disciples' chronology distinguishes a31December handshake merger from the1January union of the Stone and Campbell movements.” Keep both documentary dates; do not create two unrelated movements. | [CH15][CH20] (C) |
| che-lds |1830-04-06; organization; chp-fayette | “The Church's official account places Joseph Smith and associates' organization at Fayette.” Claimed priesthood restoration through heavenly messengers is separately identified as belief. | [CH16] (C) |
| che-azusa |1906-04; revival; chp-azusa | “William J. Seymour led a prominent Pentecostal revival at the Azusa Street mission.” It is a major centre, not proof that every Pentecostal movement descends institutionally from it. | [CH14] (C) |

## 5. Spread and journeys

No surveyed route or individual travel polyline is approved by these regional summaries. `ch-spread-early`: Paul and early communities connected Jewish and gentile audiences across the Mediterranean; use network/reference mode without reconstructed itinerary here. [CH02][CH18] (C) `ch-spread-east`: Church-of-the-East missions extended into Asia, with seventh-century Christian presence in China described in its WCC profile; do not map apostolic founding traditions as verified travel. [CH17] (C) `ch-spread-methodist`: missionary activity from Britain and the United States contributed to international Methodist growth. [CH12] (C) `ch-spread-anglican`: overseas mission and later provincial autonomy formed a global Anglican network, not one permanent English administrative jurisdiction. [CH09] (C)

## 6. Family nodes and typed graph edges

Every row is gate1; source applies to both copy and relation. `ch-christianity` is the overview hub; `ch-jewish-context` is a historical context, not all Judaism treated as a discarded parent. Institutional self-understandings about apostolic continuity are beliefs/claims, not awarded by tree position.

| Node / proposed copy | Relations and periods | Evidence |
|---|---|---|
| ch-early-communities: “Early Jesus communities developed within a Jewish setting and included increasingly gentile audiences.” | ch-jewish-context → ch-early-communities `historical-context`, first century; ch-early-communities → ch-christianity `historical-development`; no one-day Judaism/Christianity divorce | [CH01][CH18] (C) |
| ch-catholic: “Catholic communion is centred on communion with the bishop of Rome; it includes Western and Eastern churches.” | ch-christianity → ch-catholic `family-membership`; ch-catholic → ch-eastern-catholic `communion-membership`; no1054foundation date | [CH06][CH07] (C) |
| ch-eastern-catholic: “Eastern Catholic churches retain distinct rites and disciplines within Catholic communion.” | Multiple Eastern historical traditions; no single rupture date or uniform ancestry edge | [CH06] (C) |
| ch-eastern-orthodox: “Eastern Orthodoxy comprises self-governing churches sharing the faith of seven ecumenical councils.” | ch-christianity → ch-eastern-orthodox `family-membership`; ch-catholic ↔ ch-eastern-orthodox `estrangement/reconciliation-history`, prolonged,1054marker | [CH04][CH05] (C) |
| ch-oriental-orthodox: “The Coptic, Armenian, Syriac, Ethiopian, Eritrean and Indian Oriental Orthodox churches accept the first three councils and reject Chalcedon's formulation.” | ch-christianity → ch-oriental-orthodox `family-membership`; Oriental ↔ Chalcedonian traditions `divergent-council-reception`,451onward | [CH03] (C) |
| ch-east-syriac: “The Church-of-the-East tradition developed in Mesopotamian and Persian settings.” | ch-christianity → ch-east-syriac `historical-family`; distinct from Oriental and Eastern Orthodox. Apostolic founders are tradition; “Nestorian” is not a neutral universal identity label | [CH17] (C) |
| ch-lutheran: “Lutheran churches developed from the sixteenth-century reform movement associated with Luther.” | Western Christianity → ch-lutheran `reform/institutional-development`;1517controversy marker, not instantaneous creation | [CH08] (C) |
| ch-reformed: “Reformed and Presbyterian traditions draw on Swiss and French reformers including Zwingli, Bullinger and Calvin.” | Western Christianity → ch-reformed `reform/institutional-development`, sixteenth century; not simply a Lutheran daughter | [CH19] (C) |
| ch-anglican: “Anglican identity took distinctive form through the British Reformations and later autonomous churches.” | Western Christianity → ch-anglican `reform/institutional-development`, sixteenth–seventeenth centuries; later communion ties, not every province a direct schism | [CH09] (C) |
| ch-anabaptist: “Anabaptist traditions developed within the Radical Reformation, emphasizing believers' baptism.” | Reformation context → ch-anabaptist `movement-emergence`;1525Zurich marker; Mennonite identity not synonymous with all Anabaptism | [CH10] (C) |
| ch-baptist: “Baptist traditions emphasize professed faith and congregational life.” | English Separatist context → ch-baptist `movement-emergence`, early1600s; do not assert a universal Anabaptist institutional parent | [CH11] (C) |
| ch-methodist: “Methodism grew from John and Charles Wesley's renewal work within the Church of England.” | ch-anglican → ch-methodist `renewal-then-institutional-separation`, eighteenth century | [CH12] (C) |
| ch-evangelical: “Evangelical identifies movements and commitments crossing Protestant and Anglican institutions.” | ch-evangelical ↔ Protestant/Anglican nodes `cross-cutting-affiliation`; revival and later developments, no single church/founder | [CH13] (C) |
| ch-pentecostal: “Pentecostal movements emphasize the Holy Spirit and spiritual gifts.” | Wesleyan-Holiness/Reformed revival contexts → ch-pentecostal `multiple-influences`; early1900s. ch-pentecostal ↔ ch-evangelical `overlapping-affiliation`; charismatic renewal within existing churches is not automatic institutional departure | [CH14] (C) |
| ch-stone-campbell: “Stone and Campbell movements sought Christian unity and restoration through their nineteenth-century movement.” | Stone movement + Campbell movement → ch-stone-campbell `merger`;1831–32. Distinct from Joseph Smith's restoration movement | [CH15][CH20] (C) |
| ch-latter-day-saint: “The Latter-day Saint movement understands its origin as restoration through Joseph Smith.” | ch-christianity → ch-latter-day-saint `self-identified-Christian/restoration-movement`, nineteenth century; no claim it is a branch of Stone–Campbell, or that other churches accept its theological claims | [CH16] (C) |

**Design:** abstract “Western Christianity,” “Reformation context,” “Stone movement” and “Campbell movement” are named historical-context nodes, not missing denominations or living membership totals. Use directed development edges only where specified. Do not interpret theological claims of restored authority as a verified institutional connection to first-century apostles.

## 6a. Major-family completion and successor distinctions

This continuation closes the named overview omissions from the initial pass. The records remain gate1, reference-only and source-qualified; inclusion records historical association/self-identification, not theological agreement among all churches. Existing `ch-latter-day-saint` is the **movement hub**, never an alias for one present institution.

| Node / exact proposed copy | Typed relations and date precision | Evidence |
|---|---|---|
| ch-adventist: “Seventh-day Adventists developed from the nineteenth-century Advent movement and organized their General Conference in1863.” | Revival/Millerite context → ch-adventist `movement-development`;1860name adoption distinct from1863organization. The1844expectation and subsequent sanctuary interpretation are beliefs/history of interpretation, not fulfilled predictions certified by the atlas. | [CH21][CH22] (C) |
| ch-jehovahs-witnesses: “Jehovah's Witnesses trace their modern organization to Bible Students near Pittsburgh, including Charles Taze Russell; they adopted their distinctive name in1931.” | Bible Student context → ch-jehovahs-witnesses `institutional-development/name-adoption`;late1800s/1931. They regard Jesus as their founder; distinguish that religious claim from modern organization. No direct Seventh-day Adventist institutional-parent edge is supplied. | [CH23][CH24] (C) |
| ch-african-instituted: “African Instituted Churches is a varied family of churches initiated by Africans, not one denomination.” | ch-christianity → ch-african-instituted `family-category`;multiple origins; no family-wide foundation period asserted from this source. Some churches overlap spiritual/Pentecostal categories; no universal founder or single missionary-parent edge. | [CH25] (C) |
| ch-african-church: “The African Church in Nigeria developed in1901from a disagreement within Anglican Christianity over indigenous leadership.” | ch-anglican → ch-african-church `institutional-separation`;ch-african-instituted → ch-african-church `family-classification`. Neither edge means all AICs have Anglican ancestry. | [CH26] (C) |
| ch-oaic: “The Organization of African Instituted Churches was founded at a1978Cairo conference to support fellowship and training.” | ch-african-instituted ↔ ch-oaic `representative-association`, not denomination merger or universal governance | [CH27] (C) |
| ch-lds-utah: “The Church of Jesus Christ of Latter-day Saints follows the leadership succession through Brigham Young and the Twelve after Joseph Smith's death.” | ch-latter-day-saint → ch-lds-utah `successor-tradition`;1844Twelve leadership,1847reconstituted First Presidency. Claims about the divine mantle remain attributed. | [CH28] (C) |
| ch-community-christ: “The Reorganized Church's1860development included Joseph SmithIII's presidency; it adopted the name Community of Christ in2001.” | ch-latter-day-saint → ch-community-christ `successor-tradition`;1860and2001are reorganization/name dates, not two unrelated origins. Do not draw it as an1860departure from the Utah church. | [CH29][CH30] (C) |
| ch-jesus-christ-bickerton: “The Church of Jesus Christ, identified in scholarly catalogues as Bickertonite, was organized by William Bickerton at Green Oak, Pennsylvania, in1862.” | ch-latter-day-saint → ch-jesus-christ-bickerton `historical-family`;do not equate the shared church name with ch-lds-utah or Stone–Campbell Churches of Christ | [CH31] (C) |
| ch-strang-movement: “JamesJ.Strang led a distinct movement following the1844succession debate.” | ch-latter-day-saint → ch-strang-movement `successor-claim/movement`;1844–47period. This historical node does not assert all present Strangite congregations form one organization. | [CH28] (C), institutional history from a different successor tradition; no theological succession adjudication |
| ch-old-catholic: “Old Catholic churches have differing origins; the Union of Utrecht brought Dutch, German and Swiss churches into communion in1889.” | Catholic contexts → ch-old-catholic `multiple-institutional-separations`;German/Swiss opposition to VaticanI is distinct from older Utrecht history. ch-old-catholic → Union-of-Utrecht context `communion-association`, not every self-described Old Catholic body included. | [CH32] (C) |
| ch-ukrainian-greek-catholic: “Ukrainian Greek Catholic history includes the1595–96Union of Brest and later regional receptions, while retaining Byzantine traditions in communion with Rome.” | ch-eastern-catholic → ch-ukrainian-greek-catholic `communion-membership`;Kyivan Byzantine context → same node `historical-development`. This does not imply all Orthodox accepted the union or that all Eastern Catholics began at Brest. | [CH33] (C) |

**Distinct church, rite, family and association:** `ch-catholic` includes the Eastern Catholic family represented by `ch-eastern-catholic`; the Ukrainian example adds a concrete historical case. Neither is a synonym for Oriental Orthodoxy or the Assyrian Church of the East. The existing VaticanII declaration supports equal dignity of Eastern and Western Catholic traditions in Catholic teaching. [CH06] (C) Union of Utrecht is an ecclesial communion; OAIC is an association; neither should be rendered as a biological parent of every member.

### Additional places and events

Each place is an Earth reference with gate1 and withheld coordinates. City names locate documented associations, not surveyed meeting rooms.

| ID / place / type | Supported association and event | Evidence |
|---|---|---|
| chp-battle-creek / Battle Creek, Michigan / city | General Conference organization,May1863;che-adventist | [CH22] (C) |
| chp-pittsburgh / Pittsburgh area, Pennsylvania / region | Bible Student origins,late1800s; no single house identified | [CH23] (C) |
| chp-columbus / Columbus, Ohio / city |1931name-adoption convention;che-jw-name | [CH24] (C) |
| chp-cairo / Cairo / city |1978OAIC conference;che-oaic | [CH27] (C) |
| chp-amboy / Amboy, Illinois / city |6April1860JosephSmithIII presidency;che-rlds | [CH29] (C) |
| chp-green-oak / Green Oak, Pennsylvania / settlement |1862Bickerton organization;che-bickerton | [CH31] (C) |
| chp-utrecht / Utrecht / city |24September1889bishops' meeting;che-utrecht | [CH32] (C) |
| chp-brest / Brest / synod city |1595–96union;che-brest | [CH33] (C) |

| Event ID | Date / place | Exact proposed copy | Evidence |
|---|---|---|---|
| che-adventist |1863-05-20–21;chp-battle-creek | “Delegates gathered on20May; the Church commemorates21May1863as its organization.” Preserve gathering versus organization dates. | [CH22] (C) |
| che-jw-name |1931-07-26;chp-columbus | “A convention led by J.F.Rutherford adopted the name Jehovah's Witnesses.” This names a modern community, not the first appearance of biblical witness language. | [CH24] (C) |
| che-african-church |1901;Nigeria reference only | “An indigenous-leadership disagreement within Anglican Christianity produced The African Church.” Exact local venue not supplied by this source. | [CH26] (C) |
| che-oaic |1978;chp-cairo | “Leaders invited by Coptic Pope ShenoudaIII established OAIC.” No conversion or corporate absorption into the Coptic Church implied. | [CH27] (C) |
| che-rlds |1860-04-06;chp-amboy | “JosephSmithIII became president of the Reorganized Church.” Later name Community of Christ:2001, source-qualified institution continuity. | [CH29][CH30] (C) |
| che-bickerton |1862;chp-green-oak | “William Bickerton organized The Church of Jesus Christ.” Year precision only; no month guessed from the catalogue. | [CH31] (C) |
| che-utrecht |1889-09-24;chp-utrecht | “Five bishops established their conference and affirmed communion among the represented Old Catholic churches.” Association date, not every church's founding date. | [CH32] (C) |
| che-brest |1595–1596;chp-brest | “A synod proclaimed union with Rome; reception was contested and some dioceses joined later.” Not a universal Orthodox–Catholic reunion. | [CH33] (C) |

## 7. Remaining evidence and exclusions

The Community of Christ history page timed out on two direct opens, and an alternate path was unavailable; its own doctrinal history was therefore not inferred from search snippets. The Joseph Smith Papers biographical entry and ARDA institutional profile support only the retained1860/2001historical statements. This access limitation does not erase those alternative-source records. One guessed WCC Disciples-family URL failed; the denomination's own chronology supplied the needed dates. This is a retrieval-path failure, not absence of evidence.

The named major-family omissions from the initial pass are now represented in §6a: Seventh-day Adventists, Jehovah’s Witnesses, the AIC family with a concrete church and association example, distinct Latter Day Saint successors, Old Catholics and a Ukrainian Eastern Catholic case. These examples do not claim to enumerate every Adventist branch, AIC denomination, Latter Day Saint successor or contemporary Orthodox jurisdiction dispute. Detailed missions/colonialism/slavery histories and local interfaith encounters also require their own evidence. These are explicit scope gaps, not permission to infer direct descent or to collapse controversial identities.

Numeric adherents are intentionally absent. Institutional membership, baptism totals, census affiliation and cross-cutting movement estimates are different measures; evangelical, charismatic and Pentecostal populations overlap denominational categories. Undated WCC profile counts and obsolete named officeholders were not imported as2026facts. Central demographic research should supply dated definitions and denominators before any sized nodes or summed totals.

## 8. Evidence classes and source register

WCC profiles are institutional/ecumenical summaries, useful for family self-description and bounded chronology; they are not independent certification of apostolic traditions or current demographic precision. The1965joint declaration and1964decree are primary records of the signatories' acts/teachings. Harvard's Pluralism Project is a scholarly overview; institutional accounts are explicitly marked as such. Christianity's resurrection, incarnation, apostolic succession and restoration claims remain attributed religious claims.

All registered sources accessed2026-10-26; unsuccessful Community of Christ direct retrievals are separately disclosed above. Only the described passages are relied on; no claim that all linked books/manuscripts were read. URLs are retrieval paths, not proof of an immutable source snapshot.

| Key | Opened source | Used scope / caution |
|---|---|---|
| CH01 | [Harvard Pluralism Project: Life and Teachings of Jesus](https://pluralism.org/life-and-teachings-of-jesus) | Jewish context, Gospel plurality; no harmonized exact biography |
| CH02 | [Harvard: Christianity timeline](https://pluralism.org/christianity) | Early regional context, Paul, Nicaea325; selected entries, not every timeline assertion adopted |
| CH03 | [WCC: Oriental Orthodox churches](https://www.oikoumene.org/church-families/orthodox-churches-oriental) | Family membership, councils, Chalcedon; reject simplistic “first ever division” wording as unnecessary to retained copy |
| CH04 | [WCC: Eastern Orthodox churches](https://www.oikoumene.org/church-families/orthodox-churches-eastern) | Autocephaly, councils, prolonged estrangement; current officeholder/membership statements not imported |
| CH05 | [Joint Catholic–Orthodox Declaration,7December1965](https://www.vatican.va/content/paul-vi/en/speeches/1965/documents/hf_p-vi_spe_19651207_common-declaration.html) | Full numbered declaration read; personal censures and unresolved communion |
| CH06 | [VaticanII: Orientalium Ecclesiarum,21November1964](https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19641121_orientalium-ecclesiarum_en.html) | §§1–6,24; Catholic doctrine/institutional diversity, not outside endorsement |
| CH07 | [Harvard: Roman Catholic Church and Catholic Communion](https://pluralism.org/the-roman-catholic-church-and-the-catholic-communion) | Roman primacy/communion framing; no current global percentage imported |
| CH08 | [LWF/PCPCU: Together in Hope,2016](https://lutheranworld.org/resources/document-together-hope-joint-catholic-lutheran-commemoration-500-years-reformation) |1517Wittenberg and unintended division; published joint institutional account |
| CH09 | [WCC: Anglican churches](https://www.oikoumene.org/church-families/anglican-churches) | Reformation identity, overseas spread and provincial autonomy; obsolete officeholder details excluded |
| CH10 | [Mennonite World Conference: How Mennonites came to be](https://mwc-cmm.org/en/stories/how-mennonites-came-be/) |2022article updated2023; symbolic1525origins and named baptism participants |
| CH11 | [WCC: Baptist churches](https://www.oikoumene.org/church-families/baptist-churches) |1609/1612history and congregational emphasis; no “largest” ranking imported |
| CH12 | [WCC: Methodist churches](https://www.oikoumene.org/church-families/methodist-churches) | Wesleyan origins,1784organization and broad mission direction |
| CH13 | [WCC: Evangelical churches](https://www.oikoumene.org/church-families/evangelical-churches) | Changing term and cross-denominational affiliation; no universal political stereotype |
| CH14 | [WCC: Pentecostal churches](https://www.oikoumene.org/church-families/pentecostal-churches) | Origins, Azusa1906, multiple influences, charismatic overlap; no additive population estimate |
| CH15 | [Christian Church(Disciples): Important dates](https://disciples.org/our-identity/history-of-the-disciples/important-dates-in-disciple-history/) | Official chronology's1831/1832distinction; source's individual entries not exhaustive movement history |
| CH16 | [Church Newsroom: Joseph Smith and the Restoration](https://news-gb.churchofjesuschrist.org/article/joseph-smith-and-the-restoration) | Official organization account and self-understanding, not independent proof of visions |
| CH17 | [WCC: Assyrian Church of the East](https://www.oikoumene.org/member-churches/holy-apostolic-catholic-assyrian-church-of-the-east) | East-Syriac context and Asian spread; apostolic narratives treated as tradition; undated counts/residence excluded |
| CH18 | [Harvard: Birth of the Church](https://pluralism.org/birth-of-the-church) | Gentile expansion summary; resurrection wording retained as religious proclamation |
| CH19 | [WCC: Reformed churches](https://www.oikoumene.org/church-families/reformed-churches) | Swiss/French reform roots, distinct family; no universal polity/date imposed |

| CH20 | [Christian Church(Disciples): History](https://disciples.org/our-identity/history-of-the-disciples/) | Early-history section: unity/restoration aims, Lexington merger setting; institutional history, no current counts adopted |

| CH21 | [Seventh-day Adventist Church: Our History](https://adventist.org/identity/history) | Official Millerite/Advent narrative,1860name and1863organization; theological predictions explicitly attributed; broad travel/health claims not imported |
| CH22 | [Adventist News Network:160th anniversary](https://ted.adventist.org/news/chosen-for-mission-celebrating-160-years-of-the-seventh-day-adventist-church/) |19May2023article;20Maygathering versus21Mayorganization at Battle Creek |
| CH23 | [Jehovah’s Witnesses: Who was the founder?](https://www.jw.org/en/jehovahs-witnesses/faq/founder/) | Official distinction between modern Bible Students and belief in Jesus as founder |
| CH24 | [Jehovah’s Witnesses: Name history](https://www.jw.org/en/library/books/Jehovahs-Witnesses-Proclaimers-of-Gods-Kingdom/Gaining-Accurate-Knowledge-of-Gods-Word-and-Applying-It/How-We-Came-to-Be-Known-as-Jehovahs-Witnesses/) | Chapter11,1931Columbus passages read; institutional recollection and quoted resolution, not validation of divine direction |
| CH25 | [JohnS.Pobee: African Instituted Churches, WCC Dictionary2002](https://www.oikoumene.org/item-3) | Varied meanings/overlaps of AIC category; outdated totals and generalized cultural characterizations not imported |
| CH26 | [WCC: The African Church](https://www.oikoumene.org/member-churches/the-african-church) |1901leadership controversy and Nigeria setting; no undated membership total |
| CH27 | [WCC: OAIC](https://www.oikoumene.org/organization/organization-of-african-instituted-churches) |1978Cairo origin; association not one merged church |
| CH28 | [Church History Topics: Succession of Church Leadership](https://www.churchofjesuschrist.org/study/history/topics/succession-of-church-leadership?lang=eng) |1844debate, Twelve leadership, Strang/Rigdon alternatives and1847presidency; institutional viewpoint identified |
| CH29 | [Joseph Smith Papers: JosephSmithIII biography](https://www.josephsmithpapers.org/person/joseph-smith-iii) |6April1860appointment in Amboy; scholarly editorial biography with cited records, Church-sponsored |
| CH30 | [ARDA: Community of Christ](https://www.thearda.com/us-religion/group-profiles/groups?D=236) |1860organization and2001name change; database tradition classifications not adopted as theological rulings |
| CH31 | [ARDA: Church of Jesus Christ(Bickertonite)](https://www.thearda.com/us-religion/group-profiles/groups?D=209) |1862Green Oak/William Bickerton; catalogue disambiguator, not a replacement for the church's preferred name |
| CH32 | [Union of Utrecht: History](https://www.utrechter-union.org/en/about-us/what-is-the-ibc/history/) | Multiple origins, German/Swiss VaticanI controversy and24September1889communion; no single1870founding for every Old Catholic church |
| CH33 | [CNEWA: Ukrainian Catholic Church](https://cnewa.org/eastern-christian-churches/the-catholic-eastern-churches/from-the-orthodox-church/the-ukrainian-catholic-church/) | Catholic institutional account;1595–96Brest, contested reception and later Galicia adherence; historical assertions limited to read passage |

## Validation and handoff limit

Twenty place references, twenty-two event rows and twenty-seven family/movement/association rows have explicit source tags, confidence and local gates; regional event settings remain explicitly nonspatial. Event place handles resolve to this document; no spatial pin or route is fabricated. Counts are artifact rows, not mutually exclusive churches or independently verified historical claims. The integration lead must merge shared cities/contexts with other religious shards and preserve these typed relations. This bounded contribution is ready for that integration; the exclusions above prevent a whole-universe completeness claim.

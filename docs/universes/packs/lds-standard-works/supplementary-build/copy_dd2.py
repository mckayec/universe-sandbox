# Builder display copy for supplementary SC45, second tranche (checkpoint 19): section dossiers DD071–DD138 and the
# two Official Declarations DDO1–DDO2. Same rules as copy_dd.py, which imports this list: each card restates that
# unit's coverage-ledger row (coverage-dc.md "Coverage ledger") in reader sentences, names every person the ledger
# row and the resolved roster (coverage-dc.md "Resolved recipient, traveler and office roster") name, and keeps the
# row's exclusion as a plain sentence. Commands, calls and promises are written as instructions ("is to", "is
# directed"), never as completed acts, unless the ledger records completion (S18-C2). Nothing is added from memory;
# no point or date field is drawn. "See also" names existing cards (the matrix row's DP/DE/DJ/DX/DR ids, plus the
# DE event keys from "Document-to-event decisions"), checked against the pack by build.py.

DOSSIERS_2 = [
    (71, 'booth-letters', 'Preaching in answer to Ezra Booth’s letters',
     'Dated December 1, 1831, at Hiram. Joseph Smith and Sidney Rigdon are to pause the Bible revision and preach, in '
     'response to Ezra Booth’s letters. Labels such as hostile or apostate belong to the Church’s account; they are '
     'not a neutral characterization of all criticism.', ['DP01', 'DX12']),
    (72, 'whitney-bishop', 'Newel K. Whitney as bishop',
     'Dated December 4, 1831, at Kirtland. Three revelations: first Newel K. Whitney is appointed bishop, then his '
     'duties are given, then certificates for those gathering. Whitney is to receive the accounts of his region; the '
     'bishop in Zion receives reports and certificates; three elders or the bishop certify travelers. Whitney is not '
     'substituted for Edward Partridge, the bishop in Missouri: the offices are regional.',
     ['DE16', 'DX07', 'DX12', 'DR13']),
    (73, 'revision-resumed', 'The Bible revision resumed',
     'Dated January 10, 1832, at Hiram. Joseph Smith and Sidney Rigdon are to resume the Bible revision alongside '
     'limited preaching. No completion date is inferred from the command to finish it.', ['DP01', 'DX12']),
    (74, 'corinthians', 'On 1 Corinthians 7:14',
     'Dated 1830 in Wayne County, New York; the current heading places it earlier than the surrounding 1832 sections. '
     'An interpretation of 1 Corinthians 7:14: children, marriage and circumcision. It is not new historical evidence '
     'about Paul.', ['DX12']),
    (75, 'amherst-missions', 'Missionaries appointed at Amherst',
     'Dated January 25, 1832, at Amherst, Ohio, where a conference sustains and ordains Joseph Smith President of the '
     'High Priesthood; two revelations, verses 1–22 and 23–36, appoint missionaries and provide for their families. '
     'Pairs with a direction: William E. McLellin and Luke S. Johnson, south (revoking the earlier eastern '
     'assignment); Orson Hyde and Samuel H. Smith, east; Lyman E. Johnson and Orson Pratt, east; Asa Dodds and Calves '
     'Wilson, west; Major N. Ashley and Burr Riggs, south. Pairs with no direction given: Simeon Carter and Emer '
     'Harris; Ezra Thayre and Thomas B. Marsh; Hyrum Smith and Reynolds Cahoon; Daniel Stanton and Seymour Brunson; '
     'Sylvester Smith and Gideon Carter; Ruggles Eames and Stephen Burnett; Micah B. Welton and Eden Smith. Conditions '
     'of family support govern the departures. The two revelations are kept separate, directions are not turned into '
     'invented endpoints, and the assignments are instructions, not completed itineraries.',
     ['DP02', 'DE01', 'DX08', 'DX14', 'DR17', 'DR18']),
    (76, 'the-vision', 'The vision of the glories',
     'Dated February 16, 1832, at Hiram. Joseph Smith and Sidney Rigdon report a vision received while revising John '
     '5:29: the celestial, terrestrial and telestial glories and redemption. The realms of the vision are nonspatial '
     'theological entries, not planets or sites in Ohio.', ['DP01', 'DE02', 'DX10', 'DX11', 'DR01']),
    (77, 'revelation-questions', 'Questions on the book of Revelation',
     'Dated about March 1832 at Hiram. Questions and answers interpreting the book of Revelation: symbolic creatures, '
     'seals, the 144,000 and two prophets. The interpretation assigns the seals to thousand-year periods, identifies '
     'the 144,000 as high priests and the two prophets as future Jewish prophets in Jerusalem, and describes John’s '
     'gathering mission. The text’s temporal scheme for the earth is not a geological age calculation or a dated '
     'forecast.', ['DP01', 'DX11']),
    (78, 'united-firm-directed', 'A firm for Zion and the poor',
     'Dated March 1, 1832, at Kirtland. Joseph Smith, Sidney Rigdon and Newel K. Whitney are directed toward Missouri '
     'to organize a mercantile and publishing firm, the United Firm, for Zion and the poor, and are to confer in Zion; '
     'Michael is placed under the Holy One. The heading distinguishes the United Firm of 1832–34 from the later edited '
     'wording of “order” and storehouse: the 1832 institution is not the later United Orders, and no intermediate '
     'stops on the journey are inferred.', ['DP03', 'DE03', 'DX09', 'DR19']),
    (79, 'jared-carter', 'Jared Carter called',
     'Dated March 12, 1832, at Hiram. Jared Carter is called on a mission; the body of the section names the eastern '
     'countries. A call is not a completed itinerary.', ['DP01', 'DE01', 'DX08']),
    (80, 'burnett-smith', 'Stephen Burnett and Eden Smith paired',
     'Dated March 7, 1832, at Hiram. Stephen Burnett and Eden Smith are paired, with the destination left to their '
     'choice; for this commission the pairing replaces their separate section 75 companions. The unknown destination '
     'stays unknown and is not inferred from the Ohio setting.', ['DP01', 'DE01', 'DX08', 'DR17']),
    (81, 'gause-williams', 'A counselor in the Presidency',
     'Dated March 15, 1832, at Hiram, with a replacement appointment on March 18, 1833. Jesse Gause originally '
     'received this appointment as counselor; Frederick G. Williams later replaced him; the formation of the '
     'Presidency. Williams is not shown receiving the appointment in March 1832, and the editorial substitution of '
     'his name in the current text stays visible.', ['DP01', 'DE18', 'DX07', 'DR14']),
    (82, 'firm-covenant', 'The United Firm covenant',
     'Dated April 26, 1832, at Independence. A council sustains Joseph Smith; governance of the United Firm and '
     'responsibility to one’s neighbor. Named in the covenant: Edward Partridge, Newel K. Whitney, Algernon Sidney '
     'Gilbert, Sidney Rigdon, Joseph Smith, John Whitmer, Oliver Cowdery, William W. Phelps and Martin Harris; the '
     'Kirtland stake and Zion are linked economically. The firm is not the whole church or every later communal '
     'institution.', ['DP03', 'DE03', 'DX09', 'DR19']),
    (83, 'support-obligations', 'Support for wives, children, widows and orphans',
     'Dated April 30, 1832, at Independence. Obligations of material support for wives and children, widows and '
     'orphans; the storehouse. A normative obligation, not proof that every dependent received support.',
     ['DP03', 'DX09', 'DX14']),
    (84, 'priesthood-temple', 'Priesthood lineage and the expected temple',
     'Dated September 22 and 23, 1832, at Kirtland. Priesthood lineage, the expected temple in Missouri, provision for '
     'missionaries and a warning. The priesthood line runs back from Moses to Jethro, and from Jethro through Caleb, '
     'Elihu, Jeremy and Gad to Esaias, with the Abraham and Melchizedek chain kept separate; a New Jerusalem temple is '
     'predicted in this generation; Newel K. Whitney is instructed to visit New York, Albany and Boston. The temple '
     'prophecy is not completed construction, and the lineage is not an independently verified genealogy.',
     ['DP03', 'DJ02', 'DX09', 'DX13', 'DX02', 'DR24']),
    (85, 'phelps-letter', 'A letter to William W. Phelps',
     'Dated November 27, 1832, at Kirtland: a letter to William W. Phelps in Independence. A clerk is to record '
     'consecrations and inheritances; a warning against unauthorized action, with an unnamed “one mighty and strong” '
     'and the steadying of the ark. No modern claimant is identified with the mighty and strong figure without '
     'separate sourced attribution.', ['DX09', 'DX12']),
    (86, 'wheat-tares', 'The wheat and the tares',
     'Dated December 6, 1832, at Kirtland, in the context of the Bible revision. An interpretation of the parable of '
     'the wheat and the tares and of the claimed priesthood inheritance; Babylon and the wilderness are figurative, '
     'not literal travel. The field and the harvest are symbolic, and no map site is added.', ['DX11']),
    (87, 'prophecy-war', 'A prophecy of war',
     'Dated December 25, 1832, at or near Kirtland. A prophecy naming South Carolina’s rebellion, the Northern and '
     'Southern States and Great Britain, with future war, a slave uprising and worldwide calamity, in the context of '
     'slavery. No blanket verdict of fulfillment is given: the prophecy text and the independently documented Civil '
     'War chronology stay distinct.', ['DX11', 'DX17']),
    (88, 'olive-leaf', 'The Olive Leaf',
     'Dated December 27 and 28, 1832, and January 3, 1833, at Kirtland: three dates. Cosmology, resurrection, a house '
     'of learning and the School of the Prophets, worship and the washing of feet. Its topics include the light of '
     'Christ, resurrection and the laws of kingdoms, a cosmic parable, the ordered trumpets and resurrections, and '
     'Michael’s future battle. The symbolic cosmic order is not an astronomy dataset, and this summary does not '
     'restate every passage of the long section.', ['DE19', 'DX10', 'DX11', 'DX13']),
    (89, 'word-of-wisdom', 'The Word of Wisdom',
     'Dated February 27, 1833, at Kirtland; the heading notes Emma Smith’s concern. Counsel on tobacco, drinks and '
     'foods, with promised blessings. The initial text says it is not given by commandment; it includes an exception '
     'for sacramental wine, hot drinks, tobacco, sparing use of meat, and grains. The 1833 wording is kept distinct '
     'from later enforcement and from modern dietary or medical claims.', ['DE20', 'DX14', 'DX03']),
    (90, 'first-presidency', 'The First Presidency and household counsel',
     'Dated March 8, 1833, at Kirtland; the heading dates the counselors’ ordination to March 18. Sidney Rigdon and '
     'Frederick G. Williams and the First Presidency; the language of preaching; counsel to named households. Vienna '
     'Jaques is to be funded to travel to Zion in Missouri and receive an inheritance; housing for the Williams '
     'family; Joseph Smith Sr. and Rigdon are to remain. The revelation date and the ordination date are not merged, '
     'and no companion or kinship is invented for Jaques.', ['DE18', 'DX07', 'DX14']),
    (91, 'apocrypha', 'The Apocrypha',
     'Dated March 9, 1833, at Kirtland. The Apocrypha in the Bible revision: discernment and the decision not to '
     'translate it. This is not a declaration that every narrative in the Apocrypha is geographically established.',
     ['DX12']),
    (92, 'williams-firm', 'Frederick G. Williams joins the firm',
     'Dated March 15, 1833, at Kirtland. Frederick G. Williams is admitted to the United Firm, with the obligation of '
     'active membership. No new travel or place feature.', ['DE03', 'DX09', 'DR19']),
    (93, 'intelligence', 'Intelligence and family duties',
     'Dated May 6, 1833, at Kirtland. Christ, intelligence and the eternal elements: John’s witness, Christ growing '
     'from grace to grace, uncreated intelligence and eternal elements. Frederick G. Williams, Sidney Rigdon, Joseph '
     'Smith and Newel K. Whitney are rebuked concerning their duties to their families; no journeys are specified. '
     'The metaphysical teaching is not particle physics or a literal map of a pre-earth life.', ['DX10', 'DX14']),
    (94, 'kirtland-lots', 'Plans for houses in Kirtland',
     'Dated August 2, 1833, at Kirtland; the current date differs from an older May placement. A house for the '
     'Presidency, a printing house and inheritances; Hyrum Smith, Reynolds Cahoon and Jared Carter form the building '
     'committee. The presidency and printing houses are each to have an inner court of 55 by 65 feet on the south '
     'lots; Hyrum Smith is assigned the third lot, and Cahoon and Carter lots to the north; construction is explicitly '
     'deferred. The proposed design is not proof of construction.', ['DE21', 'DX12', 'DX13']),
    (95, 'house-rebuke', 'The house not yet built',
     'Dated June 1, 1833, at Kirtland. A rebuke for failing to build the house, and its purposes of worship, '
     'instruction and endowment. The temple is to have an inner court of 55 by 65 feet, with worship below and a '
     'school above: a command and a promise, not a completed building. The construction direction is not the '
     'dedication date, which belongs to section 109.', ['DE21', 'DX13']),
    (96, 'french-farm', 'The French farm',
     'Dated June 4, 1833, at a conference considering the French farm near Kirtland. The bishop is to divide the '
     'inheritances; John Johnson joins the firm; support for publication. No modern parcel geometry is assigned from '
     'the farm’s name alone.', ['DE03', 'DX09', 'DX12', 'DX13', 'DR19']),
    (97, 'missouri-school', 'A school and a temple in Zion',
     'Dated August 2, 1833, at Kirtland, addressed to Jackson County; the heading notes the coerced agreement of July '
     '23. Parley P. Pratt presides over a school in Missouri; a proposed temple and its instruction; Zion as the pure '
     'in heart; protection is conditional, not unconditional immunity. The document’s origin at Kirtland is not moved '
     'to its recipients’ Missouri setting, and no completed Jackson County temple is implied.',
     ['DX09', 'DX11', 'DX13', 'DX01']),
    (98, 'renouncing-war', 'Renouncing war',
     'Dated August 6, 1833, at Kirtland, in the context of persecution in Missouri. Constitutional order, renouncing '
     'war, restraint and retaliation, and forgiveness: constitutional rights; conditions for forgiveness and '
     'restitution after repeated assaults and offers of peace; the ancient Nephi, Joseph, Jacob, Isaac and Abraham as '
     'exemplars. The heading’s claim of revelatory knowledge is a religious interpretation, not an independently '
     'established history of communication.', ['DX11', 'DX15']),
    (99, 'john-murdock', 'John Murdock and his children',
     'Dated August 29, 1832, at Hiram; the section number is out of chronological order. John Murdock, whose wife '
     'Julia Clapp died in April 1831, is to minister eastward after his motherless children are provided for and sent '
     'to the bishop in Zion; Murdock may later seek an inheritance. The children are unnamed, and their placements are '
     'not mapped without specific sources.', ['DP01', 'DX08', 'DX14', 'DR07', 'DR15']),
    (100, 'perrysburg', 'At Perrysburg',
     'Dated October 12, 1833, at Perrysburg, New York. Joseph Smith and Sidney Rigdon are away from their families: '
     'complementary roles of spokesman and revelator. Orson Hyde and John Gould are reassured; the journey is to '
     'continue, with the onward itinerary unstated. The reassurance about the families is the text’s claim, not an '
     'independent inspection of their conditions.', ['DP08', 'DX08']),
    (101, 'jackson-expulsion', 'After the expulsion from Jackson County',
     'Dated December 16 and 17, 1833, at Kirtland. The expulsion from Jackson County: attempted settlement in Van '
     'Buren, Lafayette and Ray counties, with the main body of refugees in Clay County (heading context); petitions '
     'for redress. The claim to Zion is retained despite the displacement; the Saints are to buy land in Jackson and '
     'the adjoining counties and to petition the judge, then the governor, then the president; the millennial '
     'transformation and the parable of the olive trees are not dated events. The parable’s olive grove is not a real '
     'battle site, and the counties are regional only, not detailed refugee tracks or modern boundaries.',
     ['DX09', 'DX11', 'DX15', 'DX01']),
    (102, 'high-council', 'The high council organized',
     'Dated February 17, 1834, at Kirtland, revised on the 18th and accepted on the 19th, with additions in 1835. The '
     'organization and minutes of the high council, which met at Joseph Smith’s house, with Oliver Cowdery and Orson '
     'Hyde as recorders of the original minutes; judicial procedure. Presidents: Joseph Smith, Sidney Rigdon and '
     'Frederick G. Williams. The twelve councilors: Joseph Smith Sr., John Smith, Joseph Coe, John Johnson, Martin '
     'Harris, John S. Carter, Jared Carter, Oliver Cowdery, Samuel H. Smith, Orson Hyde, Sylvester Smith and Luke S. '
     'Johnson; the 43 voters are a different body. The accused has advocates and the right to a rehearing. Verses '
     '30–32 were added in 1835, so the Twelve’s appellate provision is not assigned to the original meeting.',
     ['DE04', 'DX07', 'DX12', 'DX15']),
    (103, 'relief-expedition', 'Recruiting a relief expedition',
     'Dated February 24, 1834, at Kirtland. Parley P. Pratt and Lyman Wight have arrived from Missouri; a relief '
     'expedition, later called Zion’s Camp, is to be organized. Recruiting targets: 500, otherwise 300, and at least '
     '100. Recruiting companions: Joseph Smith and Parley P. Pratt; Sidney Rigdon and Lyman Wight; Hyrum Smith and '
     'Frederick G. Williams; Orson Hyde and Orson Pratt. No actual attendance count is inferred, and the conditional '
     'promise of victory is not a completed military reconquest.', ['DE05', 'DX08', 'DX15']),
    (104, 'stewardships', 'The firm divided into stewardships',
     'Dated April 23, 1834, at or near Kirtland. The United Firm is restructured into individual stewardships, with '
     'separate operations and treasuries in Ohio and Missouri. Stewardships: Sidney Rigdon, his residence and the '
     'tannery; Martin Harris, a lot involved in an exchange with John Johnson; Frederick G. Williams and Oliver '
     'Cowdery, the printing; John Johnson, his inheritance less reserved lots; Newel K. Whitney, houses, the store '
     'and the ashery; Joseph Smith, the temple lot of 40 by 12 rods and his father’s home. The sacred and general '
     'treasuries are separate. The April 10 decision and the April 23 direction are distinct, and the physical '
     'parcels need separate deeds before any mapping.', ['DE03', 'DX09', 'DX12', 'DR19']),
    (105, 'fishing-river', 'Redemption deferred at Fishing River',
     'Dated June 22, 1834, about four miles north of Fishing River in Clay County. Zion’s Camp has reached Missouri; '
     'the redemption of Zion is deferred after the governor declines militia support; an endowment in Kirtland is '
     'anticipated. Some are to stay, and eastern families may return as directed; peace, legal redress and the '
     'purchase of land; redemption is delayed, not an accomplished conquest. The approximate distance in the text is '
     'not a coordinate, and no exact camp is plotted.', ['DP06', 'DE05', 'DX09', 'DX15']),
    (106, 'warren-cowdery', 'Warren A. Cowdery at Freedom',
     'Dated November 25, 1834, at Kirtland. Warren A. Cowdery, Oliver’s older brother, is to be presiding high priest '
     'over Freedom and the surrounding region, with ministry in the adjoining counties. Freedom is a textual '
     'locality; its state and coordinates require a separate place source.', ['DX07', 'DR12']),
    (107, 'priesthood-organization', 'Priesthood organization and the line from Adam',
     'Dated late winter or spring 1835 at Kirtland; most of verses 60–100 incorporate a revelation of November 11, '
     '1831. Priesthood organization; the line from Adam to Noah; the assembly at Adam-ondi-Ahman; the context of the '
     'Twelve’s mission. Adam ordains Seth, Enos, Cainan, Mahalaleel, Jared, Enoch and Methuselah; Seth ordains Lamech; '
     'Methuselah ordains Noah; ordination is not parenthood. The journey to Shedolamak is unlocated. Enoch’s age of '
     '430 at his translation differs from the chronology of Genesis 5:23–24, and both are kept. The section is not '
     'one securely dated March 28 document, and the ancient gathering is not an 1835 event.',
     ['DP05', 'DP11', 'DX07', 'DX11', 'DX02', 'DR23']),
    (108, 'lyman-sherman', 'Lyman Sherman seeks direction',
     'Dated December 26, 1835, at Kirtland. Lyman Sherman, a president of the Seventy, seeks direction and is told to '
     'strengthen his fellow elders. No new route or building.', ['DX07']),
    (109, 'dedication-prayer', 'The dedicatory prayer',
     'Dated March 27, 1836, at the Kirtland Temple; the prayer was prepared the night before. Petitions for gathering '
     'and for Israel, including the return of Jerusalem and Judah and the redemption of Israel; the existing '
     'dedication entry is reused. Verse 65’s pejorative framing of Indigenous peoples is attributed to the prayer, '
     'not to the atlas. The prayer’s requests are not proof that each requested outcome occurred.',
     ['DE06', 'DX11', 'DX13']),
    (110, 'temple-vision', 'The Kirtland Temple vision',
     'Dated April 3, 1836, at the Kirtland Temple. Joseph Smith and Oliver Cowdery report seeing Christ, Moses, Elias '
     'and Elijah: Moses commits keys of the gathering, Elias the dispensation of Abraham, and Elijah keys of the '
     'dispensation and of turning the hearts of fathers and children. These visionary visits are distinguished from '
     'ordinary journeys; Elias and Elijah are not collapsed into one figure, and no modern coordinates are inferred '
     'for the vision.', ['DE06b', 'DX11', 'DX13', 'DR02']),
    (111, 'salem', 'At Salem',
     'Dated August 6, 1836, at Salem, Massachusetts. Joseph Smith, Sidney Rigdon, Hyrum Smith and Oliver Cowdery '
     'investigate a claim about money and preach; the heading gives their travel from Kirtland to Salem and back, '
     'returning without the expected money. The rented lodging is unspecified, and an inquiry about the ancient '
     'inhabitants is not a treasure discovery: no recovered treasure or treasure location is invented.',
     ['DP07', 'DJ03']),
    (112, 'thomas-marsh-twelve', 'Thomas B. Marsh and the Twelve',
     'Dated July 23, 1837, at Kirtland. Thomas B. Marsh, president of the Twelve, amid dissension among the leaders; '
     'a worldwide ministry. Marsh is to keep his house in Zion while ministering among the mountains and the nations; '
     'the Twelve act under the direction of the First Presidency. No completed worldwide route is given, and no '
     'claim is made that all dissent was resolved.', ['DX07', 'DR08']),
    (113, 'isaiah-questions', 'Questions on Isaiah',
     'Dated March 1838 at or near Far West. Questions on Isaiah 11 and 52: the imagery of Jesse, and a gathered Zion '
     'and priesthood. Elias Higbee asks the Isaiah 52 questions; the stem is identified as Christ, and the rod and '
     'the root are described as descendants without personal names. The unspecified prophetic servant is not given a '
     'modern personal identity here.', ['DP04', 'DX11']),
    (114, 'david-patten', 'David W. Patten to prepare',
     'Dated April 11, 1838, at Far West. David W. Patten is to prepare for a future mission; the offices of the '
     'unfaithful are to be given to others. The command does not show that Patten completed the 1839 mission, and his '
     'later death requires a historical source.', ['DP04', 'DX07', 'DX08']),
    (115, 'far-west-temple', 'Far West and its proposed temple',
     'Dated April 26, 1838, at Far West. The name of the church; Far West as a place of refuge and gathering; a '
     'proposed temple; leadership. The proposed house is not a completed temple, and the planned cornerstone dates '
     'are kept apart from records of actual events.', ['DP04', 'DE22', 'DX09', 'DX13', 'DX01']),
    (116, 'spring-hill', 'Spring Hill named Adam-ondi-Ahman',
     'Dated May or June 1838 at Spring Hill, near Wight’s Ferry in Daviess County. Spring Hill is named '
     'Adam-ondi-Ahman, the setting of an anticipated gathering with Adam, the Ancient of Days. The current heading '
     'gives no exact May 19 date, and the religious identification is not independent archaeology of an ancient '
     'site.', ['DP05', 'DX09', 'DX11', 'DX01']),
    (117, 'marks-whitney-granger', 'William Marks, Newel K. Whitney and Oliver Granger',
     'Dated July 8, 1838, at Far West. William Marks is called from Kirtland to preside at Far West; Newel K. Whitney '
     'is directed to Adam-ondi-Ahman; Oliver Granger is to handle the Presidency’s financial obligations. Olaha '
     'Shinehah is the text’s plain where Adam dwelt. Olaha Shinehah is not split into two invented sites, no ancient '
     'archaeology is inferred from the religious identification, and Marks and Whitney are not treated as a '
     'traveling pair.', ['DP04', 'DP05', 'DP12', 'DE23', 'DX09', 'DX14', 'DX01']),
    (118, 'twelve-vacancies', 'Vacancies in the Twelve',
     'Dated July 8, 1838, at Far West. The vacancies in the Twelve are filled and a mission is directed to depart from '
     'the temple site the following spring: Thomas B. Marsh is to remain to publish in Zion; John Taylor, John E. '
     'Page, Wilford Woodruff and Willard Richards are appointed to the vacancies. “Thomas” is resolved as Marsh by '
     'the current official footnote. The command to depart is not proof the journey happened, and the date of the '
     'document is distinct from any event.', ['DP04', 'DE22', 'DX07', 'DX08']),
    (119, 'tithing', 'Surplus property and tithing',
     'Dated July 8, 1838, at Far West. Surplus property and an annual tithing on interest; the heading clarifies the '
     'historical meaning of earlier tithing. Earlier references to tithing are not flattened into a present-day '
     'accounting definition.', ['DP04', 'DE24', 'DX09']),
    (120, 'tithing-council', 'A council for tithed property',
     'Dated July 8, 1838, at Far West. A council is to dispose of tithed property: the Presidency, the bishop and his '
     'council, and the high council. No new geographic feature; the administrative concept is linked with section '
     '119.', ['DP04', 'DE24', 'DX07', 'DX09']),
    (121, 'liberty-epistle', 'From Liberty Jail: power and persuasion',
     'Dated March 20 and about March 22, 1839, at Liberty Jail: two epistles. Suffering, power and persuasion; the '
     'existing Liberty Jail place and the “Letters from Liberty” event are reused. The Missouri River analogy is not '
     'a journey; threats against accusers and promises of future cosmological knowledge remain the text’s attributed '
     'claims, alongside its limits on coercive authority. The whole section is not dated March 20, and unjust power '
     'is not equated with righteous priesthood.', ['DX12', 'DX15']),
    (122, 'liberty-adversity', 'From Liberty Jail: adversity',
     'Dated about March 22, 1839, at Liberty Jail. A prison epistle on adversity and Christ’s descent: a pastoral '
     'response to suffering. The scenario of a six-year-old eldest son is part of conditional rhetoric, and no route '
     'by sea or pit is inferred. The hypothetical dangers are not all documented incidents.', ['DX12', 'DX15']),
    (123, 'liberty-redress', 'From Liberty Jail: gathering the record of losses',
     'Dated about March 22, 1839, at Liberty Jail. The Saints are to collect affidavits and a history of their '
     'losses, publish their grievances and seek a public hearing: property and personal losses, the names of '
     'perpetrators, publications and affidavits, to be presented to the government and the public. The mandate to '
     'collect is not a finished register of claims.', ['DX12', 'DX15']),
    (124, 'nauvoo', 'Nauvoo: temple, house and offices',
     'Dated January 19, 1841, at Nauvoo, formerly Commerce. Distinct instructions for the Nauvoo temple, including '
     'proxy baptism, and for the Nauvoo House, a boarding house. A proclamation is to be written with Robert B. '
     'Thompson’s help and John C. Bennett’s labor, with Sidney Rigdon and William Law as further assistants. Nauvoo '
     'House trustees: George Miller, Lyman Wight, John Snider and Peter Haws; the president to be chosen among them '
     'is unnamed. Stock is set from $50 to $15,000; Joseph Smith Jr., Vinson Knight, Hyrum Smith, Isaac Galland, '
     'William Marks, Henry G. Sherwood, William Law, Amos Davies and Robert D. Foster are directed to subscribe, and '
     'Foster is instructed concerning building a house for Smith. Isaac Galland is to be ordained by William Marks '
     'and to go with Hyrum Smith, and a future mission of William Law with Hyrum is reserved; Law is to preach at '
     'Warsaw, Carthage, Burlington and Madison; Rigdon is to move near Smith, not east. Offices: Hyrum Smith, '
     'patriarch and seer; William Law replaces him as counselor; the Presidency of Joseph Smith with Sidney Rigdon '
     'and William Law. Brigham Young presides over the Twelve: Heber C. Kimball, Parley P. Pratt, Orson Pratt, Orson '
     'Hyde, William Smith, John Taylor, John E. Page, Wilford Woodruff, Willard Richards and George A. Smith, with the '
     'deceased David W. Patten noted; no twelfth living name is invented. High council: Samuel Bent, Henry G. '
     'Sherwood, George W. Harris, Charles C. Rich, Thomas Grover, Newel Knight, David Dort, Dunbar Wilson, Aaron '
     'Johnson (replacing the deceased Seymour Brunson), David Fullmer, Alpheus Cutler and William Huntington. High '
     'priests: Don C. Smith, president, with Amasa Lyman and Noah Packard. Elders: John A. Hicks, Samuel Williams and '
     'Jesse Baker. Seventy: Joseph Young, Josiah Butterfield, Daniel Miles, Henry Herriman, Zera Pulsipher, Levi W. '
     'Hancock and James Foster. Bishopric: Vinson Knight, Samuel H. Smith and Shadrach Roundy, Roundy “if he will '
     'receive it”; Samuel Rolfe presides over the priests. The deaths of David W. Patten, Edward Partridge, Joseph '
     'Smith Sr. and Seymour Brunson are remembered, and the oppressed builders of the Jackson County temple are '
     'excused, not shown as having completed it. Commanded appointments and construction are kept apart from their '
     'completion; ward presidents are unnamed, and household and property coordinates require historical sources.',
     ['DP09', 'DE07', 'DJ04', 'DX07', 'DX09', 'DX12', 'DX13', 'DX14', 'DR04', 'DR20']),
    (125, 'iowa-saints', 'The Saints in Iowa',
     'Dated March 1841 at Nauvoo, addressed to the Saints in Iowa. Instructions for settlement and gathering, naming '
     'Zarahemla and Nashville in Iowa. Iowa’s Zarahemla is not identified with the Book of Mormon city, and the '
     'recipients’ location is not the document’s origin.', ['DP10', 'DX09', 'DX01']),
    (126, 'brigham-young-returns', 'Brigham Young home from England',
     'Dated July 9, 1841, at Brigham Young’s home in Nauvoo. Young has returned from a mission in England of nearly '
     'two years; care for his family and relief from travel. This is not a claim that Young never traveled again; '
     'the counsel is contextual.', ['DX08', 'DX14']),
    (127, 'recorder-letter', 'A letter on recording proxy baptisms',
     'Dated September 1, 1842, at Nauvoo: an epistle. Joseph Smith leaves temporarily for safety; records and '
     'witnesses for proxy baptism, with an eyewitness recorder and a temple archive; the letter promises further '
     'instruction by mail. His claim of legal innocence is attributed advocacy, not a new judgment by the atlas.',
     ['DE27', 'DX12', 'DX13', 'DX15', 'DX18']),
    (128, 'recorders-keys', 'Recorders, baptism for the dead and the keys',
     'Dated September 7, 1842, at Nauvoo: an epistle. Local and general recorders and baptism for the dead; a '
     'recapitulation of voices and keys names Cumorah, Fayette and the Susquehanna. The ancient identification of '
     'Cumorah and the exact date of each visitation remain separate evidence questions.',
     ['DE27', 'DX12', 'DX13', 'DX18']),
    (129, 'messengers', 'Distinguishing messengers',
     'Dated February 9, 1843, at Nauvoo. Instruction distinguishing resurrected beings from spirits, with diagnostic '
     'signs; the handshake test is theological teaching, not an empirical investigative method. No supernatural '
     'beings are plotted as verified physical sightings.', ['DX10']),
    (130, 'ramus-april', 'Instructions at Ramus, April 1843',
     'Dated April 2, 1843, at Ramus, Illinois. The celestial earth; the embodied Father and Son; intelligence; the '
     'timing of the Second Coming withheld. The statement about age 85 does not permit computing a certain date of '
     'return, and the cosmology is not astronomical coordinates.', ['DE25', 'DX10', 'DX19']),
    (131, 'ramus-may', 'Instructions at Ramus, May 1843',
     'Dated May 16 and 17, 1843, at Ramus. Marriage and exaltation, assurance, and spirit as matter. Nonspatial '
     'doctrine: not a physics measurement or a universal historical claim about marriage.',
     ['DE25', 'DX10', 'DX19']),
    (132, 'eternal-marriage', 'Eternal and plural marriage',
     'Recorded July 12, 1843, at Nauvoo; its principles were known earlier. Eternal marriage, plural marriage, the '
     'examples of Abraham, and instructions to Emma Smith. Verses 54 and 64 threaten destruction for refusal; verse '
     '61 speaks of the first wife’s consent, and verse 65 of an exemption that applies when she refuses; both stay '
     'visible. The exception concerning David and Uriah, and the tension with Jacob 2:24, are attributed rather than '
     'flattened. The recording date is not the start of every practice, the difficult passages on Emma and consent '
     'are not omitted, and further historical voices are still needed.', ['DE08', 'DX04', 'DR03']),
    (133, 'appendix', 'The appendix: gathering out of Babylon',
     'Dated November 3, 1831, at Hiram; originally an appendix. Gathering out of Babylon; Zion and Jerusalem and a '
     'future transformed earth; a worldwide proclamation. Judah is to gather to Jerusalem and the Gentiles to Zion; a '
     'future appearance on Olivet, the ocean and the islands; the tribes of the north country and their highway are '
     'unlocated; spiritual Babylon is explicitly figurative. The section number is not chronological, and the '
     'anticipated merging of continents is not a geological reconstruction.', ['DP01', 'DX11', 'DX01']),
    (134, 'government', 'A declaration on government',
     'Dated August 17, 1835, at an assembly in Kirtland. A declaration on government, law and conscience, adopted with '
     'the publication of the scriptures; it distinguishes religion from civil authority. It is not presented as a '
     'dictated revelation, and verse 12’s slavery-era qualification is not erased.',
     ['DE26', 'DX12', 'DX15', 'DX16']),
    (135, 'carthage', 'The announcement of the deaths at Carthage',
     'An event of June 27, 1844, at Carthage Jail, announced in the 1844 edition. Joseph Smith and his brother Hyrum '
     'are killed; in the account John Taylor is wounded and Willard Richards spared; a memorial testimony. The time of '
     'about 5 p.m. and a mob of 150 to 200 are the account’s estimates, and the quotation from Ether 12 and the praise '
     'are memorial witness, not independently neutral judgments. The announcement’s estimates and rhetoric need '
     'independent corroboration before being treated as statistics, and its authorship is not assigned to Taylor '
     'alone.', ['DE09', 'DX12', 'DX15', 'DR04']),
    (136, 'winter-quarters', 'Instructions at Winter Quarters',
     'Dated January 14, 1847, at Winter Quarters on Omaha land. Brigham Young’s instructions for the camps: captains '
     'and support for vulnerable families. Company organizers: Ezra T. Benson and Erastus Snow; Orson Pratt and '
     'Wilford Woodruff; Amasa Lyman and George A. Smith. Spring pioneers, crops and houses for those who stay, and '
     'shared support for the poor, widows, orphans and the families of men in the army. The verses do not name Salt '
     'Lake as the destination. The section does not show the Omaha people’s consent or every wagon’s exact route, '
     'and the modern anchor is the visitor center.', ['DJ05', 'DX12', 'DX14', 'DR21']),
    (137, 'alvin-vision', 'A vision including Alvin',
     'Dated January 21, 1836, at the Kirtland Temple. A vision including Alvin Smith: salvation beyond earthly '
     'knowledge, and children. Adam, Abraham, Joseph’s parents and Alvin are shown; those who would have received the '
     'gospel and children below the age of accountability are promised salvation. The vision includes parents then '
     'living; it is not a notice of deaths. It comes before section 109 in time, and the vision has no celestial or '
     'earthly coordinate.', ['DX12', 'DR06']),
    (138, 'redemption-of-dead', 'The vision of the redemption of the dead',
     'A vision of October 3, 1918, at Salt Lake City, accepted by Church leaders on October 31. Joseph F. Smith’s '
     'vision of Christ and his messengers among the dead, with Adam and Eve and the prophets; the existing vision '
     'cards are reused. Pontus, Galatia and Cappadocia come from Peter’s epistle; Christ commissions messengers rather '
     'than personally visiting the wicked; Eve and her daughters, Abel, Seth, Shem, the patriarchs and prophets and '
     'later leaders appear; Hyrum Smith is explicitly Joseph F. Smith’s father. October 31 is not called a '
     'general-conference canonization, and no exact room is assigned without a source.', ['DX12', 'DX20', 'DR05']),
    ('OD1', 'manifesto', 'The Manifesto',
     'Wilford Woodruff’s statement, the Manifesto, is dated September 24, 1890, and was accepted on October 6, 1890, '
     'at a conference in Salt Lake City on Lorenzo Snow’s motion; the existing “Manifesto accepted” event is reused. '
     'The appended material includes an account of the Endowment House demolition and excerpts of addresses at Logan '
     'in 1891 and at the Salt Lake Temple in 1893, labelled as separate settings. The statement’s denials are read '
     'with the Church’s later acknowledgment of plural marriages after 1890; it was not an instantaneous end of all '
     'unions.', ['DE28', 'DX05', 'DX04', 'DR22']),
    ('OD2', 'priesthood-restriction-ended', 'The priesthood restriction removed',
     'A temple confirmation reported on June 1, 1978, a letter dated June 8 and acceptance on September 30: the '
     'racial restriction on priesthood is removed. Spencer W. Kimball, N. Eldon Tanner and Marion G. Romney signed the '
     'letter; Tanner presented it to the conference; Kimball is the reported recipient of the revelation, confirmed on '
     'June 1 per the heading. The anonymous editorial heading is not attributed to these men. This was not the first '
     'baptism of Black members or an ordination of women to the priesthood, and the heading’s acknowledgment that '
     'the origins are unclear is not a statement that no harm was done.', ['DX05', 'DR22']),
]

# Book of Mormon source views for Bible texts and figures (checkpoint 32; builder answer in PR34
# supplementary-review-s31.md at 30a880d, "Builder answer — proceed with independently gated BMC source views").
#
# BMC-001–239 are chapter-reference research keys (coverage-bom.md "Chapter coverage contract"), not runtime cards.
# Where a chapter's own ledger finding (coverage-bom.md, BMC rows and the full-read omission checks) says the chapter
# quotes, sees in vision, teaches from or mentions an entity that already has a shared Old or New Testament card,
# this module adds one 3/bom codex source view in the tab `bom-bible`. The view carries the Book of Mormon copy and
# the official chapter locator; its See-also links point one way, to the existing biblical card or Chronicle event,
# with a relation label shown only on the view. No reciprocal label is written on any Bible card, no edge metadata is
# relied on, no map pin, route, date or travel is added, and no `site:` link is used. The target keeps its own gate.
#
# Copy is the ledger's own wording, shortened; nothing is added from memory. Verse locators are the ones the ledger,
# its full-read checks or the S31 review state; otherwise the view cites the chapter's full verse range, which is
# the extent of the quotation or finding the ledger records.
#
# build.py writes VIEWS into the pack and bmc-source-views.csv, which accounts for every BMC key (implemented,
# consolidated or omitted with a reason) and every hit of the bmc_candidates.py name scan (accepted or rejected).

# (BMC number, view key suffix, name, mode, description, verses or None for the full chapter, [(target, label)])
# mode: vision | quotation | teaching | mention | prophecy
VIEWS = [
    (1, 'jerusalem-destruction-vision', 'Lehi’s vision of Jerusalem’s destruction (1 Nephi 1)', 'vision',
     'Book of Mormon — The narrative opens in the first year of Zedekiah’s reign; Lehi’s vision anticipates '
     'Jerusalem’s destruction and Babylonian captivity. The vision is a warning, kept distinct from the destruction '
     'the Old Testament narrates; no house or rock is located.', None,
     [('OHR-ZEDEKIAH', 'first year of his reign named'), ('ev:jerusalem-destruction', 'foreseen in Lehi’s vision')]),
    (5, 'joseph-moses-plates', 'Joseph and Moses on the brass plates (1 Nephi 5)', 'mention',
     'Book of Mormon — Lehi reads the brass plates, which hold records of Moses and the prophets, and finds that he '
     'and Laban descend from Joseph. The descent is the narrative’s claim, not a genetic finding.', None,
     [('OHR-JOSEPH-JACOB', 'descent claimed from him'), ('OHR-MOSES', 'his records named on the plates')]),
    (10, 'bethabara-prophecy', 'Lehi’s prophecy of baptism at Bethabara (1 Nephi 10)', 'prophecy',
     'Book of Mormon — Lehi speaks of a Messiah six hundred years after the departure and of baptism at Bethabara '
     'beyond Jordan. This is prophecy that reuses a Bible place; Lehi does not travel there.', None,
     [('NTP-bethabara', 'foretold in Lehi’s prophecy')]),
    (11, 'nazareth-jerusalem-vision', 'Nephi’s vision of Nazareth and Jerusalem (1 Nephi 11)', 'vision',
     'Book of Mormon — In Nephi’s vision, he sees Nazareth and Jerusalem. The vision begins on an unnamed high '
     'mountain; the cities are viewed, not visited, and no mountain or route is located.', '1, 13, 32', []),
    (14, 'john-revelation-vision', 'John named in Nephi’s vision (1 Nephi 14)', 'vision',
     'Book of Mormon — The angel in Nephi’s vision identifies John as the writer of later revelations. John is '
     'named, not met.', '18–27', [('ev:patmos-vision', 'John named as its writer')]),
    (20, 'babylon-quotation', 'Departure from Babylon, quoted from Isaiah (1 Nephi 20)', 'quotation',
     'Book of Mormon — The quoted Isaiah discourse addresses Israel and departure from Babylon, contrasting divine '
     'guidance with disobedience. It is a quotation, not a Lehite visit to Babylon.', None,
     [('OTM-babylon', 'quoted from Isaiah')]),
    (21, 'zion-quotation', 'Zion restored, quoted from Isaiah (1 Nephi 21)', 'quotation',
     'Book of Mormon — The Isaiah quotation portrays a servant, Zion’s restoration and gathering from afar, '
     'including the place-name Sinim, which stays unidentified. The prophecy contains no return routes.', None,
     [('OTM-zion-prophetic-jerusalem', 'Zion’s restoration, quoted from Isaiah')]),
    (17, 'moses-exodus-recalled', 'Moses and the Exodus recalled by Nephi (1 Nephi 17)', 'teaching',
     'Book of Mormon — Nephi recalls Moses leading Israel out of Egypt and Israel’s wilderness experiences while '
     'addressing his brothers. These are scriptural recollections, not stops on Nephi’s voyage.', '23–32, 40–42',
     [('OHR-MOSES', 'recalled by Nephi')]),
    (22, 'scattering-gathering-reading', 'Scattering and gathering in Nephi’s reading of Isaiah (1 Nephi 22)',
     'teaching',
     'Book of Mormon — Nephi interprets the Isaiah chapters he has just quoted (1 Nephi 20–21): Israel’s scattering '
     'and gathering involve actual peoples, and he says the locations of the scattered tribes are unknown to his '
     'audience (22:4). No tribe, migration or place is located.', None, []),
    (23, 'jerusalem-destruction-known', 'Jerusalem’s destruction known in vision (2 Nephi 1)', 'vision',
     'Book of Mormon — Lehi reports that he has seen in vision that Jerusalem is destroyed. He knows it through '
     'vision, not a return journey.', None, [('ev:jerusalem-destruction', 'known to Lehi through vision')]),
    (25, 'joseph-egypt-prophecy', 'Joseph of Egypt’s prophecy, quoted by Lehi (2 Nephi 3)', 'quotation',
     'Book of Mormon — Lehi addresses his youngest son Joseph and quotes Joseph-of-Egypt traditions about Moses, '
     'records and a future seer bearing Joseph’s name. The three Josephs stay distinct; identifying the seer is '
     'interpretation.', None,
     [('OHR-JOSEPH-JACOB', 'prophecy attributed to him'), ('OHR-MOSES', 'named in the quoted prophecy')]),
    (28, 'jerusalem-captivity-reading', 'Jerusalem’s captivity in Jacob’s reading of Isaiah (2 Nephi 6)', 'teaching',
     'Book of Mormon — Jacob interprets Isaiah concerning Jerusalem’s captivity, the Messiah and a future '
     'gathering, in a sermon to Nephi’s people. No sermon building or gathering route is located.', None,
     [('OTM-jerusalem', 'its captivity, in Jacob’s reading')]),
    (30, 'abraham-sarah-quotation', 'Abraham, Sarah and Jerusalem, quoted from Isaiah (2 Nephi 8)', 'quotation',
     'Book of Mormon — Quoted Isaiah addresses Abraham and Sarah, Zion’s consolation, and Jerusalem’s affliction and '
     'release. Ancestors and cities are recalled, not visited. Verses 19–20 read two sons where Isaiah 51 reads two '
     'things; neither is harmonized.', None,
     [('OHR-ABRAHAM', 'recalled in quoted Isaiah'), ('OHR-SARAH', 'recalled in quoted Isaiah'),
      ('OTM-jerusalem', 'its affliction and release, quoted')]),
    (34, 'judah-jerusalem-oracle', 'Isaiah’s oracle on Judah and Jerusalem (2 Nephi 12)', 'quotation',
     'Book of Mormon — Isaiah’s oracle concerning Judah and Jerusalem, quoted, portrays the Lord’s mountain-house '
     'and nations seeking instruction, then judgment of pride. No pilgrim route is plotted.', None,
     [('OTM-judah-region', 'addressed in the quoted oracle'), ('OTM-jerusalem', 'addressed in the quoted oracle')]),
    (35, 'judah-jerusalem-judgment', 'Judgment on Jerusalem and Judah, quoted (2 Nephi 13)', 'quotation',
     'Book of Mormon — The Isaiah quotation announces judgment on Jerusalem and Judah, failed leadership and the '
     'pride of Zion’s daughters. No Nephite event is narrated.', None,
     [('OTM-jerusalem', 'judgment announced, quoted'), ('OTM-judah-region', 'judgment announced, quoted'),
      ('OTM-zion-prophetic-jerusalem', 'Zion’s daughters, quoted')]),
    (36, 'zion-shelter', 'Zion’s purified survivors, quoted (2 Nephi 14)', 'quotation',
     'Book of Mormon — The Isaiah quotation moves to purified survivors in Zion and Jerusalem, with cloud, fire and '
     'shelter over its assemblies. The shelter is imagery, not a building.', None,
     [('OTM-zion-prophetic-jerusalem', 'its survivors, quoted from Isaiah')]),
    (37, 'vineyard-song', 'Isaiah’s vineyard song (2 Nephi 15)', 'quotation',
     'Book of Mormon — Isaiah’s vineyard song, quoted, identifies Israel and Judah as its referents and condemns '
     'injustice, dispossession and pride. The vineyard is an allegory, not a site.', None,
     [('OTM-judah-region', 'a referent of the quoted song')]),
    (38, 'isaiah-throne-vision', 'Isaiah’s temple vision, quoted (2 Nephi 16)', 'quotation',
     'Book of Mormon — Isaiah’s temple-throne vision in the year of Uzziah’s death, quoted, includes seraphim, '
     'purification, commission and a surviving remnant. No calibrated year is given.', None,
     [('OHR-AZARIAH-UZZIAH', 'year of his death, in the quoted vision')]),
    (39, 'judah-damascus-samaria', 'Judah, Damascus and Samaria, quoted from Isaiah (2 Nephi 17)', 'quotation',
     'Book of Mormon — This chapter quotes Isaiah’s account concerning Judah, Damascus and Samaria: Ahaz faces Rezin '
     'and Pekah, and the Immanuel sign is given. It is quoted Israelite material, not Nephite geography; no pool is '
     'identified.', '1–14',
     [('OTM-r02-ahaz-crisis', 'same crisis, quoted'), ('OTM-judah-region', 'quoted from Isaiah'),
      ('OTM-damascus', 'quoted from Isaiah'), ('OTM-samaria', 'quoted from Isaiah')]),
    (40, 'isaiah-children-signs', 'Isaiah’s children as signs, quoted (2 Nephi 18)', 'quotation',
     'Book of Mormon — In the quotation Isaiah’s children are signs; the oracle anticipates the spoil of Damascus '
     'and Samaria and uses Assyria’s invasion as overflowing-water imagery, not a flood event.', None,
     [('OTM-r01-isaiah-family', 'his children as signs, quoted'), ('OTM-damascus', 'quoted from Isaiah'),
      ('OTM-samaria', 'quoted from Isaiah'), ('OTM-assyria-region', 'quoted from Isaiah')]),
    (41, 'jordan-galilee-light', 'Light beyond Jordan, quoted (2 Nephi 19)', 'quotation',
     'Book of Mormon — The quotation names Zebulun, Naphtali, Jordan and Galilee and promises light and a ruler. '
     'Verse 1 reads Red Sea where Isaiah 9:1 differs; the wording is kept, not harmonized.', None,
     [('OHP-JORDAN', 'named in the quotation')]),
    (42, 'assyrian-advance-oracle', 'Assyria’s advance toward Nob, quoted (2 Nephi 20)', 'quotation',
     'Book of Mormon — Assyria is portrayed as an instrument later judged; in verses 28–32 Aiath, Migron, Michmash, '
     'Geba and Nob form the oracle’s prophetic advance toward Zion. It is a quoted threat, not a military route.',
     '5–19, 28–32',
     [('OTM-j01-assyrian-oracle-march', 'same oracle, quoted'), ('OTM-assyria-region', 'quoted from Isaiah'),
      ('OTM-zion-prophetic-jerusalem', 'the advance’s goal, quoted')]),
    (43, 'jesse-ruler', 'A ruler from Jesse, quoted (2 Nephi 21)', 'quotation',
     'Book of Mormon — A ruler from Jesse, peace among creatures and recovery of Israel from named regions frame the '
     'quoted gathering prophecy. The regions get no present-day boundaries.', None,
     [('OTM-a01-jesse', 'same passage, quoted')]),
    (44, 'zion-song', 'Zion’s song of salvation, quoted (2 Nephi 22)', 'quotation',
     'Book of Mormon — A quoted song praises salvation, uses wells-of-salvation imagery and calls Zion’s inhabitants '
     'to rejoice in the Holy One of Israel.', None,
     [('OTM-zion-prophetic-jerusalem', 'its inhabitants addressed, quoted')]),
    (45, 'babylon-oracle', 'The Babylon oracle, quoted (2 Nephi 23)', 'quotation',
     'Book of Mormon — The quoted Babylon oracle portrays divine judgment, names the Medes and compares Babylon’s '
     'fate with Sodom and Gomorrah. It is prophecy, not a dated archaeological account.', None,
     [('OTM-babylon', 'quoted from Isaiah'), ('OTM-media', 'the Medes named, quoted'),
      ('OHP-SODOM', 'compared, quoted'), ('OHP-GOMORRAH', 'compared, quoted')]),
    (46, 'babylon-king-taunt', 'The taunt against Babylon’s king, quoted (2 Nephi 24)', 'quotation',
     'Book of Mormon — Israel’s restoration frames a quoted taunt against Babylon’s king, followed by Assyrian and '
     'Philistine judgment language. The taunt’s addressee and later interpretations stay separate; Palestina is not '
     'a modern border.', None,
     [('OTM-c05-babylon-taunt', 'same taunt, quoted'), ('OTM-assyria-region', 'quoted from Isaiah'),
      ('OTM-philista-region', 'quoted from Isaiah')]),
    (47, 'jerusalem-destruction-recounted', 'Jerusalem’s destruction recounted by Nephi (2 Nephi 25)', 'teaching',
     'Book of Mormon — Nephi interprets Isaiah and recounts Jerusalem’s destruction and projected return. His '
     'retrospective is kept apart from prophecy, and the six-hundred-year notices are not harmonized with outside '
     'chronology.', None, [('ev:jerusalem-destruction', 'recounted by Nephi')]),
    (78, 'sinai-recalled', 'Sinai and Egypt recalled by Abinadi (Mosiah 12)', 'teaching',
     'Book of Mormon — Questioned by Noah’s priests, who cite Isaiah, Abinadi challenges their teaching of Moses’ '
     'law. Sinai and Egypt are scriptural recollections, not Abinadi’s route.', None,
     [('OTS-AP04-sinai', 'recalled by Abinadi'), ('OHR-MOSES', 'his law, in Abinadi’s defense')]),
    (80, 'suffering-servant', 'The suffering servant, quoted by Abinadi (Mosiah 14)', 'quotation',
     'Book of Mormon — Abinadi quotes Isaiah’s suffering-servant passage (Isaiah 53) in his answer to the priests. '
     'It is a reference, not an observed crucifixion or a located grave.', None,
     [('OTM-c04-messianic-reception', 'Isaiah 53, quoted by Abinadi')]),
    (102, 'mary-jerusalem-teaching', 'Mary and Jerusalem in Alma’s teaching (Alma 7)', 'teaching',
     'Book of Mormon — At Gideon, Alma teaches Christ’s coming and names Mary and Jerusalem. The text’s wording, '
     'Jerusalem as the land of the forefathers, is kept beside the New Testament’s Bethlehem; no harmonization is '
     'claimed.', None,
     [('NTE-annunciations', 'Mary named by Alma'), ('ev:jesus-birth-luke', 'the birth Alma foretells')]),
    (107, 'eden-fall-teaching', 'Adam’s Fall in Alma’s teaching (Alma 12)', 'teaching',
     'Book of Mormon — In Ammonihah, Alma addresses Zeezrom and Antionah about Adam’s Fall, mortal probation and the '
     'plan of redemption. The recalled Eden is not a newly located garden.', None,
     [('OH-P01', 'Eden recalled by Alma')]),
    (108, 'melchizedek-salem', 'Melchizedek, king of Salem, in Alma’s teaching (Alma 13)', 'teaching',
     'Book of Mormon — Alma’s teaching recalls Melchizedek, king of Salem, and Abraham’s tithes as an example of '
     'peace and faith. It is not Alma’s travel, and Salem is not identified.', [14, '–', 18],
     [('OHR-ABRAHAM', 'his tithes recalled by Alma'), ('NTC-priesthood', 'Melchizedek, also in Hebrews 7')]),
    (128, 'moses-wilderness-type', 'Moses’ wilderness healing, cited by Alma (Alma 33)', 'teaching',
     'Book of Mormon — Alma cites Zenos, Zenock and Moses to teach prayer beyond synagogues and faith in the Son of '
     'God, including the wilderness healing type. The quoted settings are not stops on Alma’s mission.', None,
     [('OHR-MOSES', 'wilderness healing type, cited by Alma')]),
    (166, 'witnesses-mulek-claim', 'Moses, Abraham and Mulek’s survival in Nephi’s preaching (Helaman 8)', 'teaching',
     'Book of Mormon — Nephi recalls Moses and Abraham as witnesses and says that Mulek survived the killing of '
     'Zedekiah’s sons. The survival and descent are this text’s claims, not an independently established genealogy '
     'or migration.', '11–22',
     [('OHR-MOSES', 'recalled as a witness'), ('OHR-ABRAHAM', 'recalled as a witness'),
      ('OHR-ZEDEKIAH', 'Mulek survival claim concerning his sons')]),
    (190, 'redeemed-jerusalem', 'Redeemed Jerusalem, quoted by Jesus (3 Nephi 16)', 'quotation',
     'Book of Mormon — Jesus speaks of other sheep beyond this land and Jerusalem and quotes Isaiah on redeemed '
     'Jerusalem. The unvisited sheep have no named destination.', None,
     [('OTM-jerusalem', 'its redemption, quoted from Isaiah')]),
    (194, 'abraham-covenant-teaching', 'The covenant through Abraham, taught by Jesus (3 Nephi 20)', 'teaching',
     'Book of Mormon — Jesus teaches Israel’s gathering, a New Jerusalem in this land, the covenant through Abraham '
     'and a future return to ancestral Jerusalem. New Jerusalem and biblical Jerusalem stay distinct.', None,
     [('OHR-ABRAHAM', 'his covenant, in Jesus’ teaching')]),
    (199, 'horeb-elijah-malachi', 'Horeb and Elijah, quoted from Malachi (3 Nephi 25)', 'quotation',
     'Book of Mormon — Malachi’s coming day, healing, Moses’ law at Horeb and Elijah’s heart-turning mission are '
     'quoted to the people. Horeb is a retrospect, not a journey; Elijah’s coming is not said to occur here.', None,
     [('OTS-P05-horeb', 'Moses’ law there, quoted from Malachi'), ('OHR-ELIJAH', 'his promised mission, quoted'),
      ('OHR-MOSES', 'his law, quoted from Malachi')]),
    (218, 'john-writings-named', 'John’s writings named by Moroni (Ether 4)', 'mention',
     'Book of Mormon — Moroni explains restricted revelation and invites readers to receive fuller revelation, '
     'including John’s writings. Moroni’s editorial time differs from the Jaredite scene.', None,
     [('ev:patmos-vision', 'John’s writings named by Moroni')]),
    (227, 'jerusalem-new-jerusalem-prophecy', 'Jerusalem and a New Jerusalem in Ether’s prophecy (Ether 13)',
     'prophecy',
     'Book of Mormon — Ether’s prophecy distinguishes the Jerusalem from which Lehi would come from a New Jerusalem '
     'promised on this land. It recalls Joseph and his father in Egypt; the promised cities are not presented as '
     'completed Jaredite construction.', '4–11',
     [('OTM-jerusalem', 'Jerusalem of old in Ether’s prophecy'),
      ('OHR-JOSEPH-JACOB', 'Joseph recalled in the prophecy')]),
]

# Views implemented without a See-also link: reason (recorded in bmc-source-views.csv).
NOLINK = {
    11: 'nonspatial view without a link: its places are map pins, and See-also has no site: link',
    22: 'interpretation view without a link: it carries the 1 Nephi 22 locator and the 22:4 unknown-location '
        'safeguard for the 1 Nephi 20–21 quotations; no Bible card is its subject and no tribe or place is located',
}

# BMC keys deliberately not given a view although their finding touches a Bible text or figure: reason.
OMIT = {
    6: 'formulaic title “the God of Abraham, Isaac and Jacob” in a record-purpose chapter; no relation to the '
       'persons’ cards beyond the formula',
    19: 'Isaiah is introduced as a source and Zenos/Zenock are quoted prophets without cards; the Isaiah text itself is '
        'carried by the 1 Nephi 20–21 views',
    29: 'quoted Isaiah servant passage with no named shared entity in the finding; no card for this Isaiah chapter',
    33: 'editorial bridge introducing Isaiah as a witness; no entity relation; the quoted chapters 2 Nephi 12–24 have '
        'their own views',
    60: 'Zenos’s allegory: Zenos has no shared Bible card and the vineyard is not mapped',
    61: 'interpretation of Jacob 5; no named shared entity',
    184: 'the finding cites “Jacob” with Zenos and Zenock without saying which Jacob; the identity is not stated, so '
         'no person card is linked',
    189: 'the cross-link the ledger names (John 10’s other sheep) has no codex card or Chronicle event at this head; '
         'the card “Withdrawals beyond Jordan and to Ephraim (John 10–11)” is a journey, not that saying',
    196: 'Jesus quotes Isaiah 54 and Noah’s waters; neither Isaiah 54 nor Noah has an Old Testament card at this head',
    197: 'Samuel is the Lamanite prophet, not the Bible’s Samuel; the Isaiah study command names no entity',
    198: 'Malachi 3 is quoted, but no Old Testament card covers Malachi at this head; the only Malachi card is a '
         'Doctrine and Covenants source view (4/dc), a later work',
}

# Name-scan hits (bmc_candidates.py): default disposition per scanned name, then per-row overrides.
# 'accept' means the hit is implemented by the view for that BMC key; other values are the rejection reason.
SCAN_DEFAULT = {
    'Aaron': 'Book of Mormon namesake (Mosiah’s son Aaron, or the city Aaron), not Moses’ brother',
    'Ammon': 'Book of Mormon namesake (Mosiah’s son or Zarahemla’s descendant Ammon), not the land of Ammon',
    'Boaz': 'Book of Mormon city Boaz, not Ruth’s Boaz',
    'Gideon': 'Book of Mormon namesake (Gideon the officer, or the land/city Gideon), not the judge Gideon',
    'Gilgal': 'Book of Mormon or Jaredite Gilgal (city or valley), not Joshua’s Gilgal',
    'Jacob': 'Book of Mormon namesake (Lehi’s son Jacob, the Zoramite commander, the band’s king, or the city Jacob), '
             'not the patriarch',
    'Midian': 'Book of Mormon land Midian, not the Midian of Moses',
    'Ramah': 'Jaredite hill Ramah (identified with Cumorah), not Jeremiah’s Ramah',
    'Samuel': 'Samuel the Lamanite, not the prophet Samuel of the Bible',
    'Sidon': 'Book of Mormon river Sidon, not the Phoenician city',
    'Moses': 'the law of Moses as a practice, not a relation to the person card',
    'Zion': 'accept', 'Assyria': 'accept', 'Damascus': 'accept', 'Samaria': 'accept', 'Judah': 'accept',
    'Bethabara beyond Jordan': 'accept', 'Elijah': 'accept', 'Horeb': 'accept', 'Sodom': 'accept',
    'Gomorrah': 'accept', 'Zedekiah': 'accept',
}
SCAN_ROW = {
    ('BMC-005', 'Moses'): 'accept', ('BMC-025', 'Moses'): 'accept', ('BMC-078', 'Moses'): 'accept',
    ('BMC-128', 'Moses'): 'accept', ('BMC-199', 'Moses'): 'accept',
    ('BMC-189', 'Moses'): 'Moses’ law said to be fulfilled: a practice, not a relation to the person card; the '
                          'chapter is omitted (see its BMC row)',
    ('BMC-006', 'Isaac'): 'formulaic divine title; see the BMC-006 omission',
    ('BMC-006', 'Jacob'): 'formulaic divine title; see the BMC-006 omission',
    ('BMC-184', 'Jacob'): 'identity not stated in the finding; see the BMC-184 omission',
    ('BMC-010', 'Jordan'): 'consolidated: the view links the Bethabara-beyond-Jordan card, which carries the place',
    ('BMC-041', 'Jordan'): 'accept',
    ('BMC-041', 'Galilee'): 'not linked: the only Galilee card is the New Testament region (2/nt) and the ledger '
                            'binds no identity between the quoted Isaiah region and it; named in the view’s copy',
    ('BMC-210', 'Jordan'): 'Book of Mormon city Jordan, not the biblical river (the ledger exclusion says so)',
    ('BMC-025', 'Egypt'): 'not linked: Egypt is the setting of Joseph’s quoted tradition, not a relation the finding '
                          'states; Joseph’s card is linked instead',
    ('BMC-039', 'Damascus'): 'accept (the Old Testament prophets’ card, OTM-damascus; the four Damascus views are '
                             'already linked to each other as the same city)',
    ('BMC-040', 'Damascus'): 'accept (OTM-damascus, as for BMC-039)',
    ('BMC-039', 'Samaria'): 'accept (OTM-samaria, the prophets’ Samaria city card; NTP-samaria is the New '
                            'Testament region and is not linked)',
    ('BMC-040', 'Samaria'): 'accept (OTM-samaria, as for BMC-039)',
    ('BMC-021', 'Zion'): 'accept', ('BMC-030', 'Zion'): 'consolidated: the view links Jerusalem for the consolation '
                                                         'passage; Zion is named in its copy',
    ('BMC-224', 'Aaron'): 'Jaredite Aaron, son of Heth and father of Amnigaddah, who lived in captivity; not Moses’ '
                          'brother, Mosiah’s son or the city Aaron',
    ('BMC-102', 'Gideon'): 'Book of Mormon land Gideon (where Alma teaches), not the judge; the chapter’s Mary and '
                           'Jerusalem view is implemented',
}

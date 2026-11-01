# Builder display copy for supplementary SC24–SC29 (Old Testament major prophets: Isaiah, Jeremiah,
# Lamentations, Ezekiel; coverage-ot-major-prophets.md), one entry per SD row. Same rules as copy_ot.py:
# the accepted row text becomes reader sentences, constraints that tell a reader something are kept as
# plain distinctions, drawing-only constraints are honoured by drawing nothing, and nothing is added
# from memory. Built in checkpoints: this file currently covers SC25–SC28 (checkpoint 7).
#
# Sources: every SC25–SC28 row carries its own official chapter links; build.py keeps their verses.
# Where a row names a comparison passage without a link (SD0699: Ezekiel 24:25–27), it is in EXTRA_SRC.
#
# Movement rows (SC25, SC28) are source views: no route is drawn or animated, and prophetic, visionary
# and sign-action movements say what kind of movement they are. Where Kings already has a card for the
# same people or episode, the card names it as a separate source view instead of merging the accounts.
#
# SD0691 (Ezekiel 37): the chapter heading's Bible/Book of Mormon reading is not shown on this `1/ot`
# card; SD0706 (SC29) makes it a distinct child card gated at the Book of Mormon. SC29 is not built yet.
#
# Keys: `OTM-` + the row's research id without its `mp-` prefix.

P = 'Old Testament — '

COPY = {
    # SC25 prophetic, reported, visionary and sign-action movements
    'SD0642': ('OTM-j01-assyrian-oracle-march', 'Isaiah’s invasion oracle: Aiath to Nob', P + 'Isaiah’s oracle names a sequence: Aiath, Migron, Michmash, a passage, Geba, alarm at Ramah and Gibeah, cries at Gallim, Laish and Anathoth, flight from Madmenah and Gebim, and Nob, from which Zion is threatened. A dramatic invasion oracle, not a verified road itinerary.'),
    'SD0643': ('OTM-j02-moab-refugees', 'Moab’s refugees (Isaiah 15–16)', P + 'Moab’s lament names flight toward Zoar, Luhith, Horonaim and the waters; the appeal that follows sends a lamb from Sela through the wilderness toward Zion. The named towns are not consecutive refugee stops.'),
    'SD0644': ('OTM-j03-arabian-refugees', 'Dedanim and Tema (Isaiah 21)', P + 'In the oracle, the traveling companies of Dedanim lodge in Arabia, and Tema brings aid to fugitives fleeing weapons. No trail from origin to destination is given.'),
    'SD0645': ('OTM-j04-egypt-alliance', 'Envoys to Zoan and Hanes', P + 'Princes and ambassadors reach Zoan and Hanes while burdens travel through the south toward Egypt. The oracle condemns the alliance; it does not list a complete caravan road.'),
    'SD0646': ('OTM-j05-rabshakeh', 'Rabshakeh: Lachish, Jerusalem, Libnah', P + 'Rabshakeh comes from Lachish to Jerusalem’s upper pool by the fuller’s field. He returns and finds the king at Libnah, after the king has left Lachish. The separate message about Tirhakah does not make Tirhakah a stop on this route.'),
    'SD0647': ('OTM-j06-sennacherib-return', 'Sennacherib returns to Nineveh', P + 'The narrative sends Sennacherib back to Nineveh; his killers escape to Armenia, in the KJV wording. Separate travelers and separate episodes.'),
    'SD0648': ('OTM-j07-gathering-highways', 'Highways of gathering (Isaiah)', P + 'Assyria, Egypt and many named regions take part in Isaiah’s prophecies of gathering and of highways toward Jerusalem. These are promises, not records of completed mass migrations.'),
    'SD0649': ('OTM-j08-jeremiah-girdle', 'Jeremiah’s linen girdle', P + 'Jeremiah is told to take a linen girdle to Euphrates, hide it in a rock and later recover it. The text’s river name is kept; the dispute over its geographical interpretation is not treated as settled.'),
    'SD0650': ('OTM-j09-jeremiah-potter', 'The potter’s house', P + 'Jeremiah goes down to the potter’s house, watches the work on the wheels and receives a message interpreting the vessel. No street or workshop location is given.'),
    'SD0651': ('OTM-j10-broken-bottle', 'The broken bottle at Tophet', P + 'Jeremiah takes elders to the valley of Hinnom by the east gate and breaks a bottle as a sign, then returns from Tophet to the temple court. The precise gate and workshop geography remain unresolved.'),
    'SD0652': ('OTM-j11-baruch-scroll', 'Baruch’s scroll', P + 'Baruch reads Jeremiah’s scroll at the temple; officials hear it and store it; the king has it fetched and burns it. Jeremiah dictates a replacement with additional words. The scroll and its readers move separately.'),
    'SD0653': ('OTM-j12-jeremiah-arrest', 'Jeremiah arrested at Benjamin’s gate', P + 'While the siege is temporarily lifted, Jeremiah sets out toward Benjamin but is arrested at the gate of Benjamin, held in the house of Jonathan the scribe and later moved to the prison court. The text does not say he reached the district he intended.'),
    'SD0654': ('OTM-j13-zedekiah-flight', 'Zedekiah’s flight (Jeremiah)', P + 'Zedekiah leaves Jerusalem by the gate between the two walls by the king’s garden, goes toward the plain and is captured in the plains of Jericho, then is taken to Riblah for judgment and to Babylon in bonds. Capture, sentencing and deportation are separate stages. Jeremiah’s account is kept as its own source view beside the Kings card “Zedekiah’s capture”.'),
    'SD0655': ('OTM-j14-jeremiah-release', 'Jeremiah released: two accounts', P + 'Chapter 39 reports Jeremiah’s release from the prison court to Gedaliah; chapter 40 frames his release among the captives at Ramah, followed by residence with Gedaliah at Mizpah. The two accounts stay distinct; no transfer sequence is invented to join them.'),
    'SD0656': ('OTM-j15-mizpah-captives', 'Ishmael’s captives and Gibeon’s waters', P + 'Ishmael takes captives from Mizpah toward Ammon; Johanan catches up with him at the great waters of Gibeon. Ishmael escapes with eight men to Ammon; the rescued people go on to the habitation of Chimham near Bethlehem, intending to go to Egypt.'),
    'SD0657': ('OTM-j16-egypt-refugees', 'The remnant taken to Tahpanhes', P + 'Despite Jeremiah’s warning, Johanan’s group takes the remnant, including Jeremiah and Baruch, into Egypt to Tahpanhes. The later settlements in chapter 44 are not a proven personal itinerary for Jeremiah.'),
    'SD0658': ('OTM-j17-seraiah-scroll', 'Seraiah’s scroll for Euphrates', P + 'Seraiah goes with Zedekiah toward Babylon in the king’s fourth year, carrying instructions to read the scroll of judgment and sink it in Euphrates. Distinct from Zedekiah’s later deportation as a captive.'),
    'SD0659': ('OTM-j18-ezekiel-transport', 'Ezekiel carried in vision to Jerusalem', P + 'The vision carries Ezekiel from his setting in exile to Jerusalem and returns him, in vision, to the captives in Chaldea. No bodily round trip is described.'),
    'SD0660': ('OTM-j19-departing-glory', 'The glory departs and returns (Ezekiel)', P + 'Divine glory moves from the sanctuary toward the east gate and the mountain east of the city; in the later sanctuary vision, glory enters from the east. Distinct visionary episodes.'),
    'SD0661': ('OTM-j20-exile-baggage', 'Ezekiel’s exile baggage', P + 'Ezekiel carries baggage through a wall in the evening as a sign of exile and of the prince’s fate. A performed sign, not Ezekiel’s own deportation itinerary.'),
    'SD0662': ('OTM-j21-two-roads', 'Two roads at the fork', P + 'The sign sets two roads, toward Rabbah of Ammon and toward fortified Jerusalem, with the king of Babylon using divination at the fork. No exact junction is identified.'),
    'SD0663': ('OTM-j22-temple-tour', 'Ezekiel’s temple tour', P + 'A measuring guide shows Ezekiel gates, courts, the temple, chambers and cooking places. Each chapter’s measured spaces and gate functions are kept; this is a vision tour, not a visitor route through a modern complex.'),
    'SD0664': ('OTM-j23-healing-water', 'Healing water from the house', P + 'Water comes out from beneath the house, flows east past the altar and is measured at successive thousand-cubit intervals before it reaches the sea. The depths belong to the vision; they are not an empirical survey.'),
    # SC26 people, offices and relationships
    'SD0665': ('OTM-r01-isaiah-family', 'Isaiah’s family', P + 'Isaiah is named as the son of Amoz; Shear-jashub and Maher-shalal-hash-baz are his children. The prophetess in chapter 8 is not given a personal name.'),
    'SD0666': ('OTM-r02-ahaz-crisis', 'Ahaz, Rezin and Pekah', P + 'Ahaz faces Rezin of Syria and Pekah son of Remaliah of Israel; in the oracle, Damascus and Samaria are their respective centers.'),
    'SD0667': ('OTM-r03-hezekiah-court', 'Hezekiah’s court and Isaiah', P + 'Hezekiah’s officials Eliakim, Shebna and Joah meet Rabshakeh; Isaiah advises the king. Merodach-baladan’s messengers are a separate Babylonian embassy.'),
    'SD0668': ('OTM-r04-shebna-eliakim', 'Shebna and Eliakim', P + 'Shebna’s removal and the appointment of Eliakim son of Hilkiah are described through the key of the house of David. No excavated tomb is identified.'),
    'SD0669': ('OTM-r05-cyrus', 'Cyrus in Isaiah', P + 'Isaiah names Cyrus as shepherd and anointed agent in the language of restoration. This is not an eyewitness biography.'),
    'SD0670': ('OTM-r06-jeremiah-family', 'Jeremiah’s family and Hanameel’s field', P + 'Jeremiah is the son of Hilkiah, from Anathoth; Hanameel, son of his uncle Shallum, offers him the field to redeem. The text does not identify this Hilkiah with every other man of that name.'),
    'SD0671': ('OTM-r07-baruch-seraiah', 'Baruch and Seraiah, sons of Neriah', P + 'Baruch and Seraiah are each called son of Neriah, son of Maaseiah. Baruch writes Jeremiah’s words; Seraiah receives the instructions for the Babylon scroll.'),
    'SD0672': ('OTM-r08-gedaliah-house', 'Ahikam and Gedaliah', P + 'Ahikam son of Shaphan protects Jeremiah; Gedaliah son of Ahikam is appointed over the people who remain. Related men, kept as separate records.'),
    'SD0673': ('OTM-r09-ebed-melech', 'Ebed-melech', P + 'Ebed-melech, described as an Ethiopian eunuch in the king’s house, intervenes to rescue Jeremiah and receives an assurance of deliverance.'),
    'SD0674': ('OTM-r10-prophetic-opponents', 'Prophets in dispute with Jeremiah', P + 'Pashur, Hananiah, Ahab son of Kolaiah, Zedekiah son of Maaseiah and Shemaiah appear in distinct episodes of disputed prophecy. A shared name does not make two people the same.'),
    'SD0675': ('OTM-r11-rechabites', 'The Rechabites', P + 'The Rechabites keep the instruction of Jonadab son of Rechab and explain that they are in Jerusalem only for a time, because of invasion. Not every Rechab named elsewhere belongs to this family.'),
    'SD0676': ('OTM-r12-mizpah-conflict', 'Johanan, Gedaliah and Ishmael', P + 'Johanan warns Gedaliah about Ishmael son of Nethaniah and Baalis of Ammon; Ishmael later murders Gedaliah. The warning, the murder and the rescue remain separate events.'),
    'SD0677': ('OTM-r13-egypt-refugee-leaders', 'Leaders of the flight to Egypt', P + 'Johanan son of Kareah and Azariah son of Hoshaiah reject Jeremiah’s warning; the group takes Jeremiah and Baruch to Egypt. Chapter 42’s wording with Jezaniah is kept as that chapter gives it.'),
    'SD0678': ('OTM-r14-ezekiel', 'Ezekiel son of Buzi', P + 'Ezekiel is called the son of Buzi and a priest in exile. His wife’s death becomes part of a narrated sign, but her name is not given.'),
    'SD0679': ('OTM-r15-zedekiah-house', 'Zedekiah’s sons and captivity (Jeremiah)', P + 'Jeremiah reports that Zedekiah’s sons are killed before him, and that he is blinded and taken captive. Claims about Mulek from other books need their own attribution; the atlas does not silently harmonize them. Kings’ view of the king is the card “Zedekiah (Mattaniah)”.'),
    'SD0680': ('OTM-r16-tyre-rulers', 'Tyre’s prince and king (Ezekiel 28)', P + 'Ezekiel separately addresses the prince of Tyre and the king of Tyre, using exaltation and Eden imagery. Applying the oracle to Satan is an interpretation that needs explicit attribution; neither oracle gives a new archaeological biography.'),
    'SD0681': ('OTM-r17-prince-vision', 'The prince in Ezekiel’s sanctuary vision', P + 'The prince in Ezekiel’s sanctuary vision has duties and limits concerning worship, land and inheritance. The text does not license silently replacing him with a named modern leader.'),
    # SC27 themes, imagery and attributed interpretation
    'SD0682': ('OTM-c01-prophetic-commission', 'Prophetic commissions', P + 'Isaiah, Jeremiah and Ezekiel each receive a distinct commission; the throne, the almond rod, the boiling pot and the eaten scroll belong to their own accounts.'),
    'SD0683': ('OTM-c02-covenant-justice', 'Covenant and justice', P + 'These passages connect covenant faithfulness with justice, responsibility and care for vulnerable people, rather than treating places of worship as automatic protection.'),
    'SD0684': ('OTM-c03-remnant-gathering', 'Remnant and gathering', P + 'Restoration and gathering are prophetic promises; their regional names are not a modern migration schedule.'),
    'SD0685': ('OTM-c04-messianic-reception', 'Royal and servant passages in Isaiah', P + 'Isaiah’s royal and servant passages have distinct literary settings. The Church’s heading to Isaiah 53 explicitly identifies the Messiah; such applications stay attributed and do not erase those settings.'),
    'SD0686': ('OTM-c05-babylon-taunt', 'Taunt against Babylon’s king', P + 'Isaiah explicitly frames a taunt against the king of Babylon. The Church edition also applies the Lucifer language to the devil; both the stated address and that interpretation are kept.'),
    'SD0687': ('OTM-c06-symbolic-actions', 'Prophetic sign-actions', P + 'Prophetic signs use clothing, objects, food and bodily actions. Each keeps its actor and its stated explanation, and none is shown as an unlabelled historical catastrophe.'),
    'SD0688': ('OTM-c07-new-covenant', 'The new covenant (Jeremiah 31)', P + 'Jeremiah promises a renewed covenant involving an inward law, knowledge of God and forgiveness, alongside restoration language.'),
    'SD0689': ('OTM-c08-lament-trauma', 'Lamentations', P + 'Lamentations voices devastation, hunger, bereavement, shame, hope and a final plea for restoration. Its poetic speakers do not establish a named author’s biography.'),
    'SD0690': ('OTM-c09-watchman-responsibility', 'The watchman (Ezekiel)', P + 'Ezekiel’s watchman teaching and his arguments about responsibility distinguish warning, response and accountability. They do not establish a literal watchtower location.'),
    'SD0691': ('OTM-c10-restoration-bones-sticks', 'Dry bones and two sticks (Ezekiel 37)', P + 'The chapter explains the bones and the joined sticks in terms of Israel’s restoration and reunion. The Church’s chapter heading also identifies resurrection and the messianic David; these are attributed interpretive layers and create no physical graveyard or new king’s biography.'),
    'SD0692': ('OTM-c11-personified-cities', 'Cities portrayed as women', P + 'Cities and communities are portrayed through household and sexual imagery. Aholah is explicitly Samaria and Aholibah Jerusalem; these figures are not additional historical women.'),
    'SD0693': ('OTM-c12-future-sanctuary', 'Ezekiel’s future sanctuary', P + 'Ezekiel’s vision of sanctuary, worship, water and inheritance has its own reference card. No completed building, present-day territorial right or precise construction date is asserted.'),
    'SD0694': ('OTM-c13-gog-oracle', 'Gog (Ezekiel 38–39)', P + 'Gog and the named allies belong to Ezekiel’s prophecy of invasion and judgment. Identifying them with current nations or armies would require a separately attributed argument.'),
    'SD0695': ('OTM-c14-tyre-trade', 'Tyre’s trade (Ezekiel 27)', P + 'Tyre’s lament lists materials, ships and trading partners. These are trade associations, not one ship’s itinerary or verified trade quantities.'),
    'SD0696': ('OTM-c15-divergent-chronology', 'Differing dates in Jeremiah', P + 'Jeremiah 27 names Jehoiakim in verse 1 but Zedekiah in the setting that follows. Jeremiah 52 gives the tenth day in its account of the burning and the twenty-fifth for Jehoiachin’s release; the differences from Kings stay visible.'),
    # SC28 four additional movement statements
    'SD0697': ('OTM-j24-exile-letter', 'Jeremiah’s letter to the exiles', P + 'Jeremiah sends a letter from Jerusalem to Babylon by Elasah son of Shaphan and Gemariah son of Hilkiah, whom Zedekiah sends to Nebuchadnezzar. The carriers make the journey, not Jeremiah.'),
    'SD0698': ('OTM-j25-urijah-flight', 'Urijah’s flight to Egypt', P + 'Urijah son of Shemaiah flees to Egypt under Jehoiakim’s threat. Elnathan son of Achbor and companions fetch him back, and the king has him killed. Distinct from Jeremiah’s later journey to Egypt with the refugees.'),
    'SD0699': ('OTM-j26-fall-messenger', 'News of Jerusalem’s fall reaches Ezekiel', P + 'A fugitive from Jerusalem reaches Ezekiel with news that the city is struck. The account gives a regnal date but not the messenger’s route. Ezekiel 24:25–27 gives the advance sign of this news.'),
    'SD0700': ('OTM-j27-cistern-rescue', 'Jeremiah drawn out of the cistern', P + 'Ebed-melech takes thirty men at the king’s command and uses worn cloths and ropes to bring Jeremiah out of the cistern; Jeremiah remains in the prison court. Ebed-melech himself is on the card “Ebed-melech”.'),
}

EXTRA_SRC = {
    'SD0699': [('Ezekiel 24:25–27', 'ot/ezek/24')],
}
CHILDREN = {}

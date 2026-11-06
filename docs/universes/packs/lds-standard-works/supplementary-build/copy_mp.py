# Builder display copy for supplementary SC24–SC29 (Old Testament major prophets: Isaiah, Jeremiah,
# Lamentations, Ezekiel; coverage-ot-major-prophets.md), one entry per SD row. Same rules as copy_ot.py:
# the accepted row text becomes reader sentences, constraints that tell a reader something are kept as
# plain distinctions, drawing-only constraints are honoured by drawing nothing, and nothing is added
# from memory. Built in checkpoints: SC25–SC28 (checkpoint 7), SC24 (checkpoint 8) and SC29 (checkpoint 9).
#
# Sources: every SC25–SC28 row carries its own official chapter links; build.py keeps their verses.
# Where a row names a comparison passage without a link (SD0699: Ezekiel 24:25–27), it is in EXTRA_SRC.
#
# Movement rows (SC25, SC28) are source views: no route is drawn or animated, and prophetic, visionary
# and sign-action movements say what kind of movement they are. Where Kings already has a card for the
# same people or episode, the card names it as a separate source view instead of merging the accounts.
#
# SD0691 (Ezekiel 37): the chapter heading's Bible/Book of Mormon reading is not shown on this `1/ot`
# card; SD0706 (SC29) is its own card gated at the Book of Mormon (GATE).
#
# SC29 apparatus rows (checkpoint 9): each keeps the KJV/JST or text/edition-note distinction it names. A later-work
# interpretation a row names (D&C 113 for Isaiah 11, the JST introduction's Book of Mormon reading of Isaiah 29)
# is a child card with its own gate; its source is dropped from the 1/ot parent (DROP_SRC). SD0705 consolidates
# into the Ezekiel 42 child view of SD0663, which carries the reed/cubit distinction.
#
# Keys: `OTM-` + the row's research id without its `mp-` prefix.

P = 'Old Testament — '

COPY = {
    # SC24 places in Isaiah, Jeremiah, Lamentations and Ezekiel (checkpoint 8). Rows anchored to an existing
    # site (P01, P04, P07, P08, AP06, AP07) name that site's card as the same place; other rows name an existing
    # card only where the identity is the same named place, and keep each book's episodes separate.
    'SD0569': ('OTM-jerusalem', 'Jerusalem in the prophets', P + 'Isaiah, Jeremiah and Ezekiel repeatedly address Jerusalem. Their visions and narratives keep separate episode labels. The same city as Jerusalem in Samuel and Kings.'),
    'SD0570': ('OTM-babylon', 'Babylon in the prophets', P + 'Babylon appears as an oracle’s subject, an imperial destination and an exile setting. The city marker of Babylon in Kings does not verify each narrated event.'),
    'SD0571': ('OTM-egypt-region', 'Egypt in the prophets', P + 'Egypt is addressed in prophecy and receives refugees in Jeremiah’s narrative. The same region as Egypt (Old Testament settings).'),
    'SD0572': ('OTM-judah-region', 'Judah (region)', P + 'Judah frames the prophets’ royal and community settings. No fixed modern boundary is given.'),
    'SD0573': ('OTM-israel-prophetic-community', 'Israel in the prophets', P + 'Israel can mean a kingdom or the covenant people; each passage keeps its own scope.'),
    'SD0574': ('OTM-zion-prophetic-jerusalem', 'Zion (Jerusalem)', P + 'Zion and Jerusalem are paired in these prophecies, at the site of Jerusalem in Samuel and Kings. Symbolic renaming does not create additional towns.'),
    'SD0575': ('OTM-upper-pool-fullers-field', 'Upper pool by the fuller’s field', P + 'Isaiah meets Ahaz at the conduit of the upper pool, on the highway of the fuller’s field. Rabshakeh later appears at the same named setting.'),
    'SD0576': ('OTM-shiloah-water', 'Waters of Shiloah', P + 'The quiet waters of Shiloah contrast with an overflowing river in Isaiah’s account of foreign power.'),
    'SD0577': ('OTM-damascus', 'Damascus in the prophets', P + 'Damascus is named as the head of Syria and is addressed in judgment oracles. The same city as Damascus (Kings).'),
    'SD0578': ('OTM-samaria', 'Samaria in the prophets', P + 'Isaiah calls Samaria the head of Ephraim, and Ezekiel identifies Aholah with Samaria. Jeremiah promises renewed vine planting on the mountains of Samaria. Reuse Samaria (city) for the city reference while keeping the cultivation setting regional; these passages do not locate a vineyard within the city.'),
    'SD0579': ('OTM-assyria-region', 'Assyria', P + 'Assyria is both a threatening imperial power and a participant in Isaiah’s vision of reconciliation.'),
    'SD0580': ('OTM-nineveh', 'Nineveh in Isaiah', P + 'Isaiah’s narrative sends Sennacherib back to Nineveh after the Jerusalem crisis. The same city as Nineveh (Kings).'),
    'SD0581': ('OTM-lachish', 'Lachish in the prophets', P + 'Lachish is Rabshakeh’s departure point and, later, one of Judah’s remaining fortified cities. The same city as the card “Lachish”.'),
    'SD0582': ('OTM-libnah', 'Libnah', P + 'Rabshakeh finds the king of Assyria fighting against Libnah after he has left Lachish.'),
    'SD0583': ('OTM-ararat-region', 'Armenia and Ararat', P + 'Isaiah’s KJV account names Armenia as the killers’ refuge; Jeremiah separately names Ararat among the kingdoms summoned against Babylon. The printed names are kept, with no modern boundary equated to them.'),
    'SD0584': ('OTM-anathoth', 'Anathoth', P + 'Jeremiah’s priestly family is associated with Anathoth, where he buys a field in a narrated transaction with written evidences.'),
    'SD0585': ('OTM-benjamin-region', 'Land of Benjamin (Jeremiah)', P + 'Benjamin frames Jeremiah’s home district and a proposed departure from Jerusalem that leads to his arrest.'),
    'SD0586': ('OTM-tophet-hinnom', 'Tophet in the valley of Hinnom', P + 'Jeremiah associates Tophet, in the valley of Hinnom, with condemned sacrifice and coming judgment.'),
    'SD0587': ('OTM-potters-house', 'The potter’s house', P + 'Jeremiah visits a potter’s house and uses the reshaped vessel to explain how God deals with a nation.'),
    'SD0588': ('OTM-jeremiah-prison-court', 'Jeremiah in the court of the prison', P + 'Jeremiah is held in Jerusalem’s court of the prison and is let down into a muddy cistern before Ebed-melech arranges his rescue.'),
    'SD0589': ('OTM-ramah-jeremiah', 'Ramah (Jeremiah)', P + 'Ramah appears in Rachel’s lament and as the place where Jeremiah is released from among bound captives. The two scenes are distinct.'),
    'SD0590': ('OTM-mizpah-gedaliah', 'Mizpah (Gedaliah)', P + 'Gedaliah governs at Mizpah; Ishmael’s party kills him and takes people captive.'),
    'SD0591': ('OTM-gibeon-great-waters', 'The great waters at Gibeon', P + 'Johanan’s party catches up with Ishmael by the great waters at Gibeon and recovers the captives. The movement is on “Ishmael’s captives and Gibeon’s waters”.'),
    'SD0592': ('OTM-bethlehem', 'Bethlehem in Jeremiah', P + 'The fleeing group stops near Bethlehem, at the habitation of Chimham, while intending to go into Egypt. The same town as Bethlehem of Judah.'),
    'SD0593': ('OTM-chimham-habitation', 'Habitation of Chimham', P + 'Jeremiah names the habitation of Chimham, near Bethlehem, as a place where the refugees stop. No exact building is located.'),
    'SD0594': ('OTM-tahpanhes', 'Tahpanhes', P + 'The refugees enter Egypt at Tahpanhes, where Jeremiah places stones by Pharaoh’s house as a sign of Babylonian rule.'),
    'SD0595': ('OTM-noph', 'Noph', P + 'Noph is named among Egypt’s cities in prophecies and among the places where Judeans live.'),
    'SD0596': ('OTM-pathros', 'Pathros', P + 'Pathros appears as a region of gathering, a region where Judeans settle in Egypt, and a promised destination in Ezekiel’s Egypt oracle.'),
    'SD0597': ('OTM-migdol-egypt', 'Migdol (Egypt, Jeremiah)', P + 'Migdol is named among the Egyptian settlements Jeremiah addresses. These verses alone do not choose an excavated site.'),
    'SD0598': ('OTM-beth-shemesh-egypt', 'Beth-shemesh (Egypt)', P + 'Jeremiah predicts the breaking of images at Beth-shemesh in Egypt. This is not the town of the same name in Judah.'),
    'SD0599': ('OTM-carchemish', 'Carchemish', P + 'Jeremiah dates an oracle about Pharaoh-necho’s army at Carchemish by the Euphrates to the fourth year of Jehoiakim.'),
    'SD0600': ('OTM-euphrates', 'Euphrates in Jeremiah', P + 'Jeremiah names Euphrates in the sign of the linen girdle and in the instruction to sink Babylon’s written judgment. The two episodes are kept separate.'),
    'SD0601': ('OTM-chebar', 'River Chebar', P + 'Ezekiel’s visions are set among the captives by the river Chebar. No modern river is identified with it here.'),
    'SD0602': ('OTM-tel-abib-exile', 'Tel-abib (by Chebar)', P + 'Ezekiel sits among the captives at Tel-abib beside Chebar. This is not the modern city of Tel Aviv.'),
    'SD0603': ('OTM-ezekiel-house', 'Ezekiel’s house', P + 'Elders sit before Ezekiel in his house when revelation is reported. The house’s exact position is unknown.'),
    'SD0604': ('OTM-ezekiel-valley-vision', 'Valley of the dry bones (vision)', P + 'The valley of dry bones is the setting of a vision explaining Israel’s restoration, not a located burial field.'),
    'SD0605': ('OTM-ezekiel-temple-vision', 'Ezekiel’s visionary sanctuary', P + 'Ezekiel is shown a measured sanctuary in a vision. Its measurements are not evidence of an excavated or completed building.'),
    'SD0606': ('OTM-ezekiel-restored-land', 'Ezekiel’s restored land (vision)', P + 'Ezekiel describes a restored inheritance, including resident strangers and tribal portions. These are visionary allocations, not modern political boundaries.'),
    'SD0607': ('OTM-temple-river-vision', 'River from the sanctuary (vision)', P + 'In Ezekiel’s vision of healing waters, water flows from the sanctuary and deepens toward the sea.'),
    'SD0608': ('OTM-en-gedi', 'En-gedi in Ezekiel’s vision', P + 'En-gedi is one end named for fishing in the vision of healing waters. The fishing is predicted, not reported as done.'),
    'SD0609': ('OTM-en-eglaim', 'En-eglaim', P + 'En-eglaim is paired with En-gedi in Ezekiel’s vision of fishing. Its modern position is left unresolved.'),
    'SD0610': ('OTM-tyre', 'Tyre in the prophets', P + 'Tyre is the subject of maritime and siege oracles. Predicted destruction is not presented as independently verified history. The same city as Tyre (Kings).'),
    'SD0611': ('OTM-sidon', 'Sidon in the prophets', P + 'Sidon takes part in Isaiah’s maritime lament and receives a distinct judgment oracle in Ezekiel.'),
    'SD0612': ('OTM-tarshish', 'Tarshish', P + 'Tarshish appears in maritime and trading language. These passages do not settle its disputed modern identification.'),
    'SD0613': ('OTM-chittim', 'Chittim', P + 'Chittim is named in maritime and comparison passages. No exact island outline is given.'),
    'SD0614': ('OTM-lebanon', 'Lebanon in the prophets', P + 'The trees of Lebanon supply prophetic imagery, and shipbuilding material in the lament over Tyre’s trade.'),
    'SD0615': ('OTM-bashan', 'Bashan in the prophets', P + 'The oaks of Bashan appear in imagery of pride and in the description of Tyre’s shipbuilding.'),
    'SD0616': ('OTM-carmel', 'Carmel in the prophets', P + 'Carmel gives landscape and mountain comparisons. These images are not journeys by the prophets.'),
    'SD0617': ('OTM-sharon', 'Sharon', P + 'Sharon figures in promised renewal of the land and as pasture.'),
    'SD0618': ('OTM-achor', 'Valley of Achor', P + 'The valley of Achor is promised as a resting place for herds in Isaiah’s restoration oracle.'),
    'SD0619': ('OTM-moab', 'Moab in the prophets', P + 'Moab receives distinct judgment oracles; their local names belong to each oracle’s own geography. The same region as the card “Moab”.'),
    'SD0620': ('OTM-edom', 'Edom (Idumea)', P + 'Edom, called Idumea in Isaiah’s wording, is addressed in judgment and in imagery of Mount Seir.'),
    'SD0621': ('OTM-bozrah-edom', 'Bozrah (Edom)', P + 'Bozrah is named with Edom in judgment imagery. It is kept distinct from similarly named places.'),
    'SD0622': ('OTM-seir', 'Seir in the prophets', P + 'Seir appears in the watchman’s oracle and as the mountain Ezekiel’s judgment addresses. The same Seir as elsewhere in the atlas; the episodes stay distinct.'),
    'SD0623': ('OTM-ammon', 'Ammon', P + 'Ammon is addressed as a neighboring people and territory. Divine judgment remains an attributed prophetic claim.'),
    'SD0624': ('OTM-rabbah-ammon', 'Rabbah of the Ammonites', P + 'Rabbah is named with the Ammonites and as one branch of the choice in Ezekiel’s sign of the invasion.'),
    'SD0625': ('OTM-philista-region', 'Philistia in the prophets', P + 'The Philistine region receives separate oracles. No modern political identity is inferred from the older names.'),
    'SD0626': ('OTM-gaza', 'Gaza in Jeremiah', P + 'Jeremiah dates the Philistine oracle before Pharaoh strikes Gaza and includes Gaza in its mourning. The same city as Gaza (Azzah).'),
    'SD0627': ('OTM-ashkelon', 'Ashkelon', P + 'Ashkelon is named with the coast in Jeremiah’s judgment on the Philistines.'),
    'SD0628': ('OTM-ashdod', 'Ashdod in Isaiah', P + 'Isaiah dates a sign-action by the taking of Ashdod under Sargon’s commander. The same city as the card “Ashdod”.'),
    'SD0629': ('OTM-elam', 'Elam', P + 'Elam is summoned against Babylon in Isaiah and addressed by a separate oracle in Jeremiah.'),
    'SD0630': ('OTM-media', 'Media (the Medes)', P + 'The Medes are named in prophetic attacks on Babylon. The text alone does not give a full campaign reconstruction.'),
    'SD0631': ('OTM-hamath', 'Hamath', P + 'Hamath appears in passages of gathering, of judgment and of the visionary boundary, with a distinct role in each.'),
    'SD0632': ('OTM-riblah', 'Riblah in Jeremiah', P + 'The captive Zedekiah is brought before the king of Babylon at Riblah, where the narrative places judgment against his household. The same place as Riblah in Hamath.'),
    'SD0633': ('OTM-jericho', 'Plains of Jericho (Jeremiah)', P + 'The fleeing Zedekiah is overtaken in the plains of Jericho. The marker for Jericho in Joshua and Kings does not pinpoint the capture.'),
    'SD0634': ('OTM-shiloh', 'Shiloh in Jeremiah', P + 'Shiloh is invoked as a warning about a former place of worship; Jeremiah does not describe a new visit there. The same place as the card “Shiloh”.'),
    'SD0635': ('OTM-zoan', 'Zoan', P + 'Zoan is associated with Egypt’s leaders, with diplomacy and with judgment. The envoys’ movement is on “Envoys to Zoan and Hanes”.'),
    'SD0636': ('OTM-hanes', 'Hanes', P + 'Hanes is named in the oracle against the alliance with Egypt. The verse does not trace the whole route of the embassy.'),
    'SD0637': ('OTM-dedan', 'Dedan', P + 'Dedan appears in passages of caravans, warning and trade. Related names are not collapsed into one documented expedition.'),
    'SD0638': ('OTM-tema', 'Tema', P + 'Isaiah’s oracle on Arabia describes the inhabitants of Tema bringing water and bread to a fugitive.'),
    'SD0639': ('OTM-kedar', 'Kedar', P + 'Kedar is addressed in judgment oracles on Arabia. It is kept distinct from any precise modern settlement.'),
    'SD0640': ('OTM-sheba', 'Sheba in the prophets', P + 'Sheba appears in prophetic tribute and in Tyre’s trading list. These texts do not settle a single modern kingdom boundary.'),
    'SD0641': ('OTM-haran', 'Haran in Ezekiel', P + 'Haran appears among Tyre’s trading partners. The same city as Haran (Genesis); this trading context is separate from Abraham’s departure.'),
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
    'SD0663': ('OTM-j22-temple-tour', 'Ezekiel’s temple tour', P + 'A measuring guide shows Ezekiel gates, courts, the temple, chambers and cooking places. The cited chapters describe distinct measured spaces and gate functions; this is a vision tour, not a visitor route through a modern complex.'),
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
    'SD0679': ('OTM-r15-zedekiah-house', 'Zedekiah’s sons and captivity (Jeremiah)', P + 'Jeremiah reports that Zedekiah’s sons are killed before him, and that he is blinded and taken captive. This card retains Jeremiah’s account without harmonizing it with other accounts. Kings’ view of the king is the card “Zedekiah (Mattaniah)”.'),
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
    'SD0696': ('OTM-c15-divergent-chronology', 'Differing dates in Jeremiah', P + 'Jeremiah 27 names Jehoiakim in verse 1 but Zedekiah in the setting that follows. Jeremiah 52 dates Nebuzar-adan’s arrival to the tenth day of the fifth month before narrating the burning, and Jehoiachin’s release to the twenty-fifth day of the twelfth month; the differences from Kings remain separately attributed.'),
    # SC28 four additional movement statements
    'SD0697': ('OTM-j24-exile-letter', 'Jeremiah’s letter to the exiles', P + 'Jeremiah sends a letter from Jerusalem to Babylon by Elasah son of Shaphan and Gemariah son of Hilkiah, whom Zedekiah sends to Nebuchadnezzar. On this mission, the carriers make the journey, not Jeremiah.'),
    'SD0698': ('OTM-j25-urijah-flight', 'Urijah’s flight to Egypt', P + 'Urijah son of Shemaiah flees to Egypt under Jehoiakim’s threat. Elnathan son of Achbor and companions fetch him back, and the king has him killed. Distinct from Jeremiah’s later journey to Egypt with the refugees.'),
    'SD0699': ('OTM-j26-fall-messenger', 'News of Jerusalem’s fall reaches Ezekiel', P + 'A fugitive from Jerusalem reaches Ezekiel with news that the city is struck. The account gives a regnal date but not the messenger’s route. Ezekiel 24:25–27 gives the advance sign of this news.'),
    'SD0700': ('OTM-j27-cistern-rescue', 'Jeremiah drawn out of the cistern', P + 'Ebed-melech takes thirty men at the king’s command and uses worn cloths and ropes to bring Jeremiah out of the cistern; Jeremiah remains in the prison court. Ebed-melech himself is on the card “Ebed-melech”.'),
    # SC29 apparatus and cross-work distinctions (checkpoint 9)
    'SD0701': ('OTM-a01-jesse', 'Stem, rod and root of Jesse (Isaiah 11)', P + 'Isaiah uses stem, rod and root imagery associated with Jesse. The Church’s chapter heading identifies the stem with Christ; the three images are not all labelled as Jesus.'),
    'SD0702': ('OTM-a02-ariel', 'Ariel, David’s city (Isaiah 29)', P + 'Isaiah calls Ariel David’s city; the Church’s note identifies it with Jerusalem and explains the name through hearth or altar language. The Joseph Smith Translation of verses 1–8, shown as a labelled comparison, keeps the siege imagery.'),
    'SD0703': ('OTM-a03-servant', 'The blind servant: KJV and JST (Isaiah 42)', P + 'The KJV passage questions a blind and deaf servant. The Joseph Smith Translation instead describes a servant sent to people who are blind, with a promise tied to heeding the messenger. This shifts the roles, not the geography; neither version names a modern messenger.'),
    'SD0704': ('OTM-a04-conditional-calamity', 'Repentance and the threatened evil: KJV and JST (Jeremiah 26)', P + 'Jeremiah’s KJV wording speaks of the Lord repenting of the threatened evil. The Joseph Smith Translation directs the people to repent and describes the Lord turning the threatened evil away. Neither says the destruction has already happened.'),
    'SD0705': 'OTM-j22-temple-tour-42',
    'SD0706': ('OTM-a06-ezekiel-37-heading', 'The two sticks in the Church heading (Ezekiel 37)', P + 'The Church’s heading to Ezekiel 37 reads the joined sticks as the Bible and the Book of Mormon. This is an attributed edition interpretation, shown apart from the chapter’s own explanation of Israel’s reunion; it creates no physical place.'),
}

EXTRA_SRC = {
    'SD0699': [('Ezekiel 24:25–27', 'ot/ezek/24')],
}
# later-work sources that belong on the gated child, not the 1/ot card
DROP_SRC = {'SD0701': ['dc-testament/dc/113']}
# a whole row gated at a later work
GATE = {'SD0706': ([3], ['bom'])}
CHILDREN = {
    # SC29 later-work interpretations as gated children (fifth element: books, layers)
    'SD0701': [
        ('OTM-a01-jesse-dc113', 'Stem, rod and root in D&C 113', 'D&C 113 — Section 113 identifies the stem of Jesse as Christ and describes the rod and the root as servants or descendants with particular roles, without giving their personal names. No unnamed servant is assigned to a particular person here.', [('D&C 113:1–6', 'dc-testament/dc/113')], ([4], ['dc'])),
    ],
    'SD0702': [
        ('OTM-a02-ariel-jst-introduction', 'Isaiah 29 and the Book of Mormon (JST introduction)', P + 'The editorial introduction to the Joseph Smith Translation of Isaiah 29 relates the chapter’s message to the Book of Mormon. It is an editorial introduction, not wording added to the KJV verses, and it creates no Ariel site in the Americas.', [('JST Isaiah 29 (introduction)', 'jst/jst-isa/29')], ([3], ['bom'])),
    ],
    # S7-C1 (supplementary-review-s7): the chapter-specific contexts SD0663 requires, as child source views
    'SD0663': [
        ('OTM-j22-temple-tour-40', 'Ezekiel 40: gates, courts and priestly rooms', P + 'In the twenty-fifth year of the captivity, fourteen years after the city’s fall, Ezekiel is brought in vision to a high mountain in Israel. A measuring guide surveys the east, north and south gates, the courts, chambers, tables and priestly rooms. A visionary temple, not measured archaeological remains.', [('Ezekiel 40', 'ot/ezek/40')]),
        ('OTM-j22-temple-tour-41', 'Ezekiel 41: the house and the most holy place', P + 'The survey measures the temple, a most holy place twenty cubits square, side rooms on three levels, a building to the west, doors, a wooden altar or table, and palm and cherub ornament. The guide goes inward on his own; his access is kept distinct from Ezekiel’s. The source’s dimensions are kept and no exact reconstruction is drawn.', [('Ezekiel 41', 'ot/ezek/41')]),
        ('OTM-j22-temple-tour-42', 'Ezekiel 42: priestly chambers and the outer measure', P + 'Chambers on the north and south hold the offerings and the priests’ changed garments. The outer boundary, separating the sanctuary from the profane place, is measured five hundred reeds on each side in this translation; the reeds are not converted to cubits. The Church edition’s notes explain the outer and common terms; they keep the stated reeds and do not substitute cubits.', [('Ezekiel 42', 'ot/ezek/42')]),
        ('OTM-j22-temple-tour-43', 'Ezekiel 43:1–17: the glory returns; the altar', P + 'The glory of God returns from the east through the gate and fills the house; the altar’s stepped measurements follow. A visionary pattern, not a verified construction or date.', [('Ezekiel 43:1–17', 'ot/ezek/43')]),
        ('OTM-j22-temple-tour-44', 'Ezekiel 44:1–5: the shut outer east gate', P + 'The outer east gate stays shut because the Lord has entered by it; the prince may sit in it to eat bread before the Lord. Ezekiel is then brought by way of the north gate before the house. The gate is not identified with any present-day Jerusalem gate.', [('Ezekiel 44:1–5', 'ot/ezek/44')]),
        ('OTM-j22-temple-tour-46', 'Ezekiel 46:1, 19–24: inner gate and cooking places', P + 'Separate places are shown where the priests boil and bake the offerings, and, in the corners of the outer court, where the ministers of the house boil the people’s sacrifices. In this chapter the inner east gate opens on Sabbaths and new moons; it is distinct from chapter 44’s shut outer gate.', [('Ezekiel 46:1, 19–24', 'ot/ezek/46'), ('Ezekiel 44:1–3', 'ot/ezek/44')]),
    ],
}

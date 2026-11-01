# Builder display copy for supplementary SC18–SC23 (Old Testament: Chronicles, Ezra, Nehemiah, Esther;
# coverage-ot-late-history.md), one entry per SD row. Same rules as copy_ot.py: the accepted row text
# becomes reader sentences, constraints that tell a reader something are kept as plain distinctions,
# drawing-only constraints are honoured by drawing nothing, and nothing is added from memory.
#
# Sources: SC18–SC20 rows cite late-history ledger ids (LH1-11, LH2-11:5–12, LHE-08, LHN-12:31–40 …);
# build.py resolves them through the ledger rows of coverage-ot-late-history.md to the official chapter
# (with the row's verses where it gives them). SC21 and SC23 rows carry their own links.
#
# Consolidation: where a landmark/setting row (SC18) or an apparatus row (SC23) concerns the same identity
# as a place row (SC21) or another card, the entry is the string id of the card that carries it
# ('SD0559'), and build.py adds that row's sources to the card. The card's text covers both rows
# (consolidation rules: "consolidate only supported aliases"; SC23 "apply aliases and apparatus
# distinctions to relevant cards; source apparatus is not another event").
#
# Keys: `OTL-` + the row's research id, so they never collide with primary or earlier supplementary keys.

P = 'Old Testament — '

COPY = {
    # SC18 Chronicles–Esther landmark and setting rows
    'SD0476': ('OTL-jerusalem-chronicles-eras', 'Jerusalem in Chronicles', P + 'Chronicles follows Jerusalem from David’s capture through temple construction, royal reforms, destruction and exile. The same city as Jerusalem in Samuel and Kings, not a second Jerusalem.'),
    'SD0477': ('OTL-ornan-floor', 'Ornan’s threshing floor', P + 'David buys Ornan’s threshing floor for an altar; Chronicles connects it with the site of Solomon’s temple on Mount Moriah. Part of Jerusalem, not a separate map point. The KJV account describes the Lord halting the destroying angel at Ornan’s floor; the JST version expands the scene with the angel’s outstretched hand and the Lord beholding Israel before stopping the destruction. The two texts are given separately; the JST adds no new Jerusalem site or plague date.'),
    'SD0478': ('OTL-gibeon-sanctuary', 'Tabernacle at Gibeon', P + 'The account locates the tabernacle and bronze altar at Gibeon while the ark is at Jerusalem. Gibeon is not Gibeah.'),
    'SD0479': ('OTL-kirjath-jearim-ark', 'Kirjath-jearim (Baalah): the ark sets out', P + 'Baalah is identified here as Kirjath-jearim, where the ark’s journey begins. The same Kirjath-jearim as in Samuel.'),
    'SD0480': ('OTL-chidon-perez-uzza', 'Chidon’s threshing floor (Perez-uzza)', P + 'Uzza’s death during the ark procession gives this place the name Perez-uzza. Chronicles’ name, Chidon, is kept as written rather than replaced with the name in Samuel’s account.'),
    'SD0481': ('OTL-obed-edom-house', 'House of Obed-edom', P + 'The ark stays at Obed-edom’s house for three months before its later entry into Jerusalem. Unlocated; no surviving or excavated house is claimed.'),
    'SD0482': ('OTL-levitical-settlement-network', 'Levitical towns in Chronicles', P + 'Chronicles describes Levitical settlements across several tribal territories, including towns on both sides of Jordan. The full list (1 Chronicles 6:54–81) names the towns; it is a list, not a route.'),
    'SD0483': ('OTL-transjordan-chronicles', 'Reuben, Gad and half-Manasseh east of Jordan', P + 'Reuben, Gad and half-Manasseh are associated with Gilead and Bashan before the account’s Assyrian deportations. Regions only; no boundaries are drawn.'),
    'SD0484': ('OTL-judah-fortress-network', 'Rehoboam’s fortified cities', P + 'Rehoboam’s defenses include Bethlehem, Tekoa, Adullam, Lachish, Azekah, Hebron and other named towns; the full list is in 2 Chronicles 11:5–12.'),
    'SD0485': 'SD0548',
    'SD0486': ('OTL-solomon-maritime-network', 'Solomon’s ports and trade', P + 'Ezion-geber and Eloth are coastal settings; Ophir and Tarshish appear in the account’s trade notices. No modern destination or sea route is adopted.'),
    'SD0487': ('OTL-tekoa-berachah-campaign', 'Jehoshaphat: En-gedi to Berachah', P + 'Jehoshaphat’s account names En-gedi, Ziz, Jeruel, Tekoa and Berachah in a sequence of crisis and thanksgiving.'),
    'SD0488': ('OTL-gihon-ophel', 'Gihon and the city of David', P + 'Chronicles associates Gihon and the city of David with Hezekiah’s water works and Manasseh’s fortifications. No tunnel is identified.'),
    'SD0489': 'SD0560',
    'SD0490': 'SD0558',
    'SD0491': 'SD0559',
    'SD0492': 'SD0557',
    'SD0493': ('OTL-jerusalem-nehemiah-gates', 'Nehemiah’s gates, towers and wall', P + 'Nehemiah describes gates, towers, pools and wall sections during inspection, repair and dedication. They are named in the text only; no modern wall line is drawn.'),
    'SD0494': 'SD0561',
    'SD0495': ('OTL-returnee-settlement-registers', 'Returnee towns and families', P + 'Ezra and Nehemiah preserve overlapping lists of returnee families and towns, with differences in wording and totals. The lists are not merged into one census.'),
    # SC19 Chronicles–Esther movements (text only; no routes drawn)
    'SD0496': ('OTL-lh-j01-simeonite-expansion', 'Simeonite groups: Gedor and Mount Seir', P + 'Simeonite groups move toward the entrance of Gedor for pasture; a separate group goes to Mount Seir. Two movements, not one expedition.'),
    'SD0497': ('OTL-lh-j02-assyrian-deportation', 'Transjordan tribes deported', P + 'Reuben, Gad and half-Manasseh are carried from their territories to Halah, Habor, Hara and the river Gozan. The destinations are a list, not ordered stops.'),
    'SD0498': ('OTL-lh-j03-david-accession', 'David: Hebron to Jerusalem', P + 'David goes from Hebron to Jerusalem, also called Jebus; its conquest and his royal settlement there follow.'),
    'SD0499': ('OTL-lh-j04-ark', 'The ark: Kirjath-jearim to the temple', P + 'The ark goes from Kirjath-jearim (Baalah) to Chidon’s floor, named Perez-uzza, and then to Obed-edom’s house; after its stay there it is brought to the tent in Jerusalem, and later into the temple. This is Chronicles’ telling of the move shown in “David brings the ark to Jerusalem”.'),
    'SD0500': ('OTL-lh-j05-timber', 'Timber from Lebanon', P + 'Timber from Lebanon is carried by sea to Joppa and brought up to Jerusalem; Ezra’s account of the rebuilding names Lebanon and Joppa again.'),
    'SD0501': ('OTL-lh-j06-sheba', 'The queen of Sheba’s visit', P + 'The queen of Sheba comes to Jerusalem and returns to her own land. Sheba is not located here, and no stations between are given.'),
    'SD0502': ('OTL-lh-j07-jehoshaphat', 'Jehoshaphat: Samaria, Ramoth-gilead, Tekoa', P + 'Jehoshaphat visits Samaria, joins the campaign at Ramoth-gilead and returns to Jerusalem. A separate, later movement goes through Tekoa and Berachah back to Jerusalem.'),
    'SD0503': ('OTL-lh-j08-captive-care', 'Judah’s captives released at Jericho', P + 'Captives from Judah are brought toward Samaria, then clothed, fed and taken to Jericho; their escorts return to Samaria. Distinct from the captives taken to Damascus.'),
    'SD0504': ('OTL-lh-j09-manasseh', 'Manasseh taken to Babylon', P + 'Manasseh is taken from Judah to Babylon in custody and later restored to Jerusalem. No path is given.'),
    'SD0505': ('OTL-lh-j10-exile-return', 'Exile and return in Chronicles and Ezra', P + 'The destruction account takes captives from Jerusalem to Babylon; the later return account brings groups from Babylon to Jerusalem. These are not one group’s continuous journey.'),
    'SD0506': ('OTL-lh-j11-ezra', 'Ezra’s caravan', P + 'Ezra’s caravan goes from Babylon to the assembly at Ahava and on to Jerusalem; envoys sent to Casiphia bring back ministers. The caravan itself is not said to go to Casiphia.'),
    'SD0507': ('OTL-lh-j12-nehemiah', 'Nehemiah to Jerusalem', P + 'From the Shushan setting Nehemiah travels through unnamed imperial and beyond-the-river stages to Jerusalem. Later he returns to the king and then comes back to Jerusalem; where the king then resided is not given.'),
    'SD0508': ('OTL-lh-j13-night-inspection', 'Nehemiah’s night inspection', P + 'Nehemiah and a few men go from the Valley Gate past the Dragon Well to the Dung Gate, on to the Fountain Gate and the King’s Pool, up by the brook and back to the Valley Gate. The passage says his mount could not pass at one point.'),
    'SD0509': ('OTL-lh-j14-dedication-a', 'Wall dedication: the first company', P + 'The first thanksgiving company, with Ezra before them, goes toward the Dung Gate, past the Fountain Gate and the stairs of the city of David, by the Water Gate eastward, to the house of God. Its starting point is not named.'),
    'SD0510': ('OTL-lh-j15-dedication-b', 'Wall dedication: the second company', P + 'The opposite company, with Nehemiah following, goes beyond the Tower of the Furnaces to the Broad Wall, past the gates of Ephraim, the Old Gate and the Fish Gate and the towers of Hananeel and Meah, to the Sheep Gate and the Prison Gate, and on to the house of God.'),
    'SD0511': ('OTL-lh-j16-mordecai-honor', 'Mordecai honoured in Shushan', P + 'Haman leads Mordecai on a ceremonial ride through the street of Shushan; Mordecai then returns to the king’s gate. No street is named.'),
    # SC20 Chronicles–Esther people, institutions and themes
    'SD0512': ('OTL-lh-c01-david-house', 'David’s house in Chronicles', P + 'Chronicles traces David through Jesse and connects his royal household with Hebron and Jerusalem. Solomon succeeds him; the later royal genealogy continues beyond exile.'),
    'SD0513': ('OTL-lh-c02-levites', 'Priests, Levites, singers and gatekeepers', P + 'The account distinguishes Aaronite priests, other Levites, singers, gatekeepers and administrators. Genealogy and assigned service are related but are not identical offices.'),
    'SD0514': ('OTL-lh-c03-musical-service', 'Temple music', P + 'The families of Asaph, Heman and Jeduthun supply organized musical service; the account describes instruction, lots and repeated worship.'),
    'SD0515': ('OTL-lh-c04-davidic-promise', 'The promise to David', P + 'Nathan’s message promises David a continuing house and a son who will build the sanctuary. Chronicles gives the promise a dynastic as well as an architectural meaning.'),
    'SD0516': ('OTL-lh-c05-two-kingdoms', 'Two kingdoms after Solomon', P + 'After Solomon, Rehoboam rules Judah while Jeroboam leads the northern breakaway. Later rulers who share names need kingdom labels.'),
    'SD0517': ('OTL-lh-c06-joash-rescue', 'Joash hidden and crowned', P + 'Jehoshabeath, Ahaziah’s sister and Jehoiada’s wife, protects Joash while Athaliah rules; Jehoiada later organizes his coronation.'),
    'SD0518': ('OTL-lh-c07-prophetic-women', 'Huldah and Noadiah', P + 'Huldah is consulted about the discovered book of the law; Nehemiah separately names Noadiah among the opponents he describes. Neither woman is merged with another because she is called a prophetess.'),
    'SD0519': ('OTL-lh-c08-ezra-nehemiah', 'Ezra and Nehemiah', P + 'Ezra is presented as priest and scribe, Nehemiah as cupbearer and governor. Their roles overlap in the public reading, but their journeys and commissions remain distinct.'),
    'SD0520': ('OTL-lh-c09-return-registers', 'Family registers of the return', P + 'Family registers establish belonging and priestly eligibility within the narrative. Ezra 2 and Nehemiah 7 preserve differences that this atlas does not silently reconcile.'),
    'SD0521': ('OTL-lh-c10-restoration-of-worship', 'Restoring worship in stages', P + 'Rebuilding the altar, laying the temple foundation, completing the temple, repairing the wall and the public renewal of covenant are separate stages across Ezra and Nehemiah.'),
    'SD0522': ('OTL-lh-c11-identity-and-coercion', 'Marriage, community and boundaries', P + 'Ezra and Nehemiah recount boundary-making around marriage, community and worship, including coercive actions. These reports are not presented as present-day Church civil or marriage policy.'),
    'SD0523': ('OTL-lh-c12-esther-household', 'Esther’s household', P + 'Hadassah is Esther; she is Abihail’s daughter and Mordecai’s cousin, whom he raises as his daughter. Vashti precedes her as queen.'),
    'SD0524': ('OTL-lh-c13-haman-mordecai', 'Haman and Mordecai', P + 'Haman’s hostility toward Mordecai becomes a threat to Jews across the realm. Esther’s intervention and Mordecai’s promotion lead to a counter-decree, not a simple erasure of the first order.'),
    'SD0525': ('OTL-lh-c14-purim', 'Purim', P + 'Esther explains Purim through threatened destruction, reversal, letters, feasting, exchanged portions and gifts to the poor. Shushan and other communities have different narrated days of rest.'),
    # SC21 Chronicles–Esther place identities (text only; no coordinates)
    'SD0526': ('OTL-hebron', 'Hebron in Chronicles', P + 'Chronicles places David’s early royal household and Israel’s acknowledgment of his kingship at Hebron. The same Hebron as Hebron (Kirjath-arba).'),
    'SD0527': ('OTL-shechem', 'Shechem: Rehoboam’s assembly', P + 'Rehoboam goes to Shechem for the assembly that precedes the division of the kingdom. The same Shechem as Shechem (Sichem), not a new royal-era city.'),
    'SD0528': ('OTL-bethlehem', 'Bethlehem in Chronicles', P + 'Chronicles names Bethlehem in David’s water episode and in Rehoboam’s defenses; the episodes stay separate. The same city as Bethlehem of Judah.'),
    'SD0529': ('OTL-samaria', 'Samaria in Chronicles', P + 'Samaria is a royal meeting place and the setting for the release and care of Judah’s captives. The same city as Samaria (city).'),
    'SD0530': ('OTL-damascus', 'Damascus in Chronicles', P + 'Damascus is named in diplomatic and captive contexts. The city is kept distinct from its rulers and from Judah’s imitation of its cult.'),
    'SD0531': ('OTL-ramoth-gilead', 'Ramoth-gilead in Chronicles', P + 'Ahab and Jehoshaphat’s campaign at Ramoth-gilead ends with Ahab’s death; it is the campaign Kings also tells, not a second event. In Micaiah’s speech before it, the KJV says the Lord has put a lying spirit in the prophets’ mouths, while the JST reads that the Lord has found a lying spirit there. Both wordings are kept; they belong to the same confrontation.'),
    'SD0532': ('OTL-tekoa', 'Tekoa', P + 'Jehoshaphat’s company goes toward the wilderness of Tekoa; the town also appears among Rehoboam’s fortified places.'),
    'SD0533': ('OTL-berachah-valley', 'Valley of Berachah', P + 'The valley receives a name of blessing after the reported victory. No modern valley is selected.'),
    'SD0534': ('OTL-en-gedi', 'Hazazon-tamar (En-gedi)', P + 'The invading coalition is reported at Hazazon-tamar, which the verse identifies as En-gedi.'),
    'SD0535': ('OTL-gur-baal', 'Gur-baal', P + 'Gur-baal is associated with Arabians in the account of Uzziah’s campaigns. Its position is unresolved.'),
    'SD0536': ('OTL-ezem', 'Ezem', P + 'Ezem is named in the Simeonite settlement list. Being listed does not make it a travel stop, and no modern identification is given.'),
    'SD0537': ('OTL-gedor-pasture', 'Gedor (Simeonite pasture)', P + 'Simeonite groups seek pasture toward the entrance of Gedor and occupy the land described. Other places called Gedor are not assumed to be this one.'),
    'SD0538': ('OTL-seir', 'Mount Seir in Chronicles', P + 'A separate Simeonite group goes to Mount Seir and settles after conflict. The same Seir as elsewhere in the atlas; the episodes stay distinct.'),
    'SD0539': ('OTL-gilead', 'Gilead in Chronicles', P + 'Gilead belongs to the Transjordan settlement setting in Chronicles. No boundary is drawn.'),
    'SD0540': ('OTL-bashan', 'Bashan', P + 'Gadite settlements and pasture are associated with Bashan.'),
    'SD0541': ('OTL-halah-habor-hara-gozan', 'Halah, Habor, Hara and the river Gozan', P + 'The deportation account lists Halah, Habor, Hara and the river Gozan. The list is not an ordered itinerary, and the names are not one combined town.'),
    'SD0542': ('OTL-ezion-geber', 'Ezion-geber in Chronicles', P + 'Ezion-geber is connected with Solomon’s shipping and with Jehoshaphat’s shipbuilding venture, which fails; that venture is not shown as a voyage.'),
    'SD0543': ('OTL-eloth', 'Eloth (Elath) in Chronicles', P + 'Eloth appears beside Ezion-geber in Solomon’s activity and in Uzziah’s rebuilding. The Church’s Bible Dictionary treats Elath and Eloth as names for the same Edomite town and naval station.'),
    'SD0544': ('OTL-ophir', 'Ophir in Chronicles', P + 'Ophir is a source of gold and other imported materials in the account. No modern candidate is selected.'),
    'SD0545': ('OTL-sheba', 'Sheba in Chronicles', P + 'The queen of Sheba visits Solomon at Jerusalem. The same region as Sheba (kingdom); its modern extent is left unresolved.'),
    'SD0546': ('OTL-lebanon', 'Lebanon (timber)', P + 'Lebanon supplies timber carried by sea for building at Jerusalem.'),
    'SD0547': ('OTL-joppa', 'Joppa (Chronicles and Ezra)', P + 'Joppa is the landing place for timber brought by sea from Lebanon. The narrative does not identify a surviving wharf.'),
    'SD0548': ('OTL-succoth-casting', 'Bronze casting between Succoth and Zeredathah', P + 'Solomon’s bronze casting is placed in the Jordan plain between Succoth and Zeredathah. This Succoth is not the Exodus camp, and no furnace site is located.'),
    'SD0549': ('OTL-zeredathah', 'Zeredathah', P + 'Zeredathah is an endpoint used to describe the bronze casting ground; no exact furnace location follows.'),
    'SD0550': ('OTL-megiddo', 'Megiddo: Josiah wounded', P + 'Josiah is wounded in the valley of Megiddo and taken to Jerusalem, where he dies in Chronicles’ account. Its wording differs from Kings, and the difference is kept.'),
    'SD0551': ('OTL-lachish', 'Lachish in Chronicles', P + 'Lachish appears among Rehoboam’s defenses and as Sennacherib’s siege setting when his servants address Jerusalem.'),
    'SD0552': ('OTL-azekah', 'Azekah', P + 'Azekah belongs to Rehoboam’s list of fortified cities. No construction date is calculated.'),
    'SD0553': ('OTL-gerar', 'Gerar: Asa’s pursuit', P + 'Asa’s army pursues the defeated force toward Gerar and attacks the surrounding cities. No campaign path is drawn.'),
    'SD0554': ('OTL-mareshah', 'Mareshah', P + 'Asa’s forces meet the opposing army by Mareshah in the valley of Zephathah. Neither name gives an exact battle site.'),
    'SD0555': ('OTL-zephathah', 'Valley of Zephathah', P + 'The valley of Zephathah is named beside Mareshah as the army’s position. No modern valley is substituted.'),
    'SD0556': ('OTL-jericho', 'Jericho in Chronicles and Ezra', P + 'Jericho receives released captives and appears in the return register. The same Jericho as in Joshua and Kings; these episodes stay separate from the conquest.'),
    'SD0557': ('OTL-shushan-narrative', 'Shushan (Susa) in Nehemiah and Esther', P + 'Shushan is the royal setting of Esther and the setting of Nehemiah’s opening report and court service. A shared setting does not establish the same reign or room. The Church’s Bible Dictionary identifies Shushan as also known as Susa.'),
    'SD0558': ('OTL-ahava', 'Ahava', P + 'Ezra gathers the caravan by the water flowing to Ahava, where the company fasts, and departs from Ahava for Jerusalem on the twelfth day of the first month. No river course is drawn.'),
    'SD0559': ('OTL-casiphia', 'Casiphia', P + 'Ezra sends envoys to Iddo at Casiphia to obtain temple ministers. The main caravan is not said to go there.'),
    'SD0560': ('OTL-achmetha', 'Achmetha: the decree found', P + 'A memorandum concerning Cyrus’s decree is found at Achmetha in the province of the Medes. No archive chamber is identified, and a modern identification would need a separate historical source.'),
    'SD0561': ('OTL-ono', 'Plain of Ono', P + 'Nehemiah’s opponents invite him to meet in a village in the plain of Ono; he refuses, so no journey there is recorded.'),
    'SD0562': ('OTL-india-esther', 'India (Esther)', P + 'India is one endpoint of the realm’s described extent in Esther. No modern national borders are implied.'),
    'SD0563': ('OTL-ethiopia-esther', 'Ethiopia (Esther)', P + 'Ethiopia is the other named endpoint of Esther’s described realm. No modern territory is implied.'),
    # SC23 apparatus: applied to the card it explains, except the Ezra 4 notes, which have no single card
    'SD0564': 'SD0477',
    'SD0565': 'SD0531',
    'SD0566': ('OTL-lh-a03-trans-river', 'Ezra’s letters: language and the river', P + 'Ezra names the Syrian language in the letter; the Church’s note identifies it as Aramaic, and its notes place the officials’ side of the river west of the Euphrates. These are editorial explanations, not a newly dated survey. The heading of Ezra 4 mentions both temple and walls; it does not resolve every question of royal chronology.'),
    'SD0567': 'SD0543',
    'SD0568': 'SD0557',
}

EXTRA_SRC = {}
CHILDREN = {}

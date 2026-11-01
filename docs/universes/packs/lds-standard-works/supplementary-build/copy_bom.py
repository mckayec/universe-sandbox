# Builder display copy for supplementary SC01–SC07 (Book of Mormon), one entry per SD row.
# Wording follows the accepted research row (supplementary-dispositions/declaration-dispositions.csv,
# minimum_retained_source_context). Builder constraints in a row ("keep distinct", "do not draw") are
# honoured by the build and, where they inform a reader, stated as a plain distinction. Nothing is added
# from memory. Sources come from the row's own links (see build.py); EXTRA_SRC adds a locator the row
# names in its text without a link.
#
# Format: SD id -> (research key, display name, desc)

P = 'Book of Mormon — '
N = 'Book of Mormon narrative — '

COPY = {
    # SC01 Place identities needing distinct records or explicit notes
    'SD0001': ('BXP01', 'River Laman', P + 'A river Lehi names Laman empties into the Red Sea; the valley of Lemuel lies near its mouth. A later departure crosses it. It is distinct from the river in Lehi’s dream.'),
    'SD0002': ('BXP02', 'Irreantum', P + 'The name the travelers give the sea seen from coastal Bountiful in Arabia. The naming establishes no shoreline and no ocean crossing track.'),
    'SD0003': ('BXP03', 'Shemlon', P + 'A land seen from the tower king Noah builds near the temple and watched by Zeniff’s spies; later named among the lands taught by Amulon’s associates.'),
    'SD0004': ('BXP04', 'Amulon (land)', P + 'The settlement of Noah’s fugitive priests, sharing their leader’s name. Lamanite pursuers come upon it before finding Helam.'),
    'SD0005': ('BXP05', 'Hill Manti', P + 'The hill associated with Nehor’s execution. This account does not identify it with the later land of Manti.'),
    'SD0006': ('BXP06', 'Hill Amnihu', P + 'A hill east of the river Sidon where the fighting with the Amlicites begins.'),
    'SD0007': ('BXP07', 'Minon', P + 'A land the scouts describe as above Zarahemla in the direction of the land of Nephi, where Amlicite and Lamanite forces join.'),
    'SD0008': ('BXP08', 'Aaron (Alma 8)', P + 'A city toward which Alma travels after he is expelled from Ammonihah; he is redirected before any arrival is narrated. Whether it is the Aaron of Alma 50 is unproved.'),
    'SD0009': ('BXP09', 'Sidom', P + 'The refuge reached after expulsion from Ammonihah, where Alma heals Zeezrom and establishes a church.'),
    'SD0010': ('BXP10', 'Noah (land)', P + 'Borders named Noah suffer attack alongside Ammonihah. The land is distinct from king Noah.'),
    'SD0011': ('BXP11', 'Land of Ishmael', P + 'The land ruled by Lamoni, where Ammon begins his service and later teaches. Its name is attributed to the sons of Ishmael.'),
    'SD0012': ('BXP12', 'Waters of Sebus', P + 'The watering place for flocks in Ammon’s service narrative. No recovered spring or reservoir is identified.'),
    'SD0013': ('BXP13', 'Middoni', P + 'The land ruled by Antiomno, where Aaron and his companions are imprisoned and later released through Lamoni and Ammon.'),
    'SD0014': ('BXP14', 'Jerusalem (Book of Mormon city)', P + 'A city and land joining the borders of Mormon, named after the ancestral Jerusalem. It does not share the Jerusalem map pin.'),
    'SD0015': ('BXP15', 'Ani-Anti', P + 'A village where Aaron finds Muloki, Ammah and others before they go on to Middoni.'),
    # SC02 Further material places from Alma 23–63
    'SD0016': ('BXP16', 'Lemuel (city)', P + 'A city named among those whose people the missionaries convert; distinct from the valley of Lemuel in 1 Nephi.'),
    'SD0017': ('BXP17', 'Shimnilom', P + 'A city named among those whose people the missionaries convert.'),
    'SD0018': ('BXP18', 'Midian (Book of Mormon)', P + 'The missionaries meet here before consulting at Ishmael. No identity with biblical Midian is established.'),
    'SD0019': ('BXP19', 'Antionum', P + 'The Zoramite land east of Zarahemla, near the sea and south of Jershon; later a staging area for invasion.'),
    'SD0020': ('BXP20', 'Hill Onidah (Alma 32)', P + 'The hill where Alma teaches the poor. It is not automatically the gathering place called Onidah in Alma 47.'),
    'SD0021': ('BXP21', 'Rameumptom', P + 'The raised stand for worship in the Zoramite account; a feature within Antionum rather than a separate city.'),
    'SD0022': ('BXP22', 'Siron', P + 'A land near the Lamanite borders, associated with Corianton leaving the ministry.'),
    'SD0023': ('BXP23', 'Hill Riplah', P + 'A hill used to describe the positions of separate armies east of Sidon.'),
    'SD0024': ('BXP24', 'Onidah (Alma 47)', P + 'The place where reluctant Lamanite soldiers assemble in the Antipas episode. Identity with the hill Onidah of Alma 32 is unproved.'),
    'SD0025': ('BXP25', 'Mount Antipas', P + 'The mountain held by Lehonti’s force; Amalickiah’s army first camps in the valley nearby.'),
    'SD0026': ('BXP26', 'Morianton (city and land)', P + 'A community whose land dispute with the people of Lehi precedes an attempted migration northward. It is distinct from its leader of the same name.'),
    'SD0027': ('BXP27', 'Omner (city)', P + 'Named among the eastern coastal cities in Amalickiah’s advance; distinct from Omner, son of Mosiah.'),
    'SD0028': ('BXP28', 'Gid (city)', P + 'An eastern city later retaken by Moroni; distinct from the captain Gid.'),
    'SD0029': ('BXP29', 'Mulek (city)', P + 'A fortified eastern city retaken through coordinated movements near Bountiful.'),
    'SD0030': ('BXP30', 'Judea (Book of Mormon city)', P + 'The city where Helaman joins Antipus; not the biblical region of Judaea.'),
    'SD0031': ('BXP31', 'Zeezrom (city)', P + 'One of the western cities listed as occupied before Helaman reaches Judea; distinct from the convert Zeezrom.'),
    'SD0032': ('BXP32', 'Cumeni', P + 'A western city taken after its supplies are intercepted, then defended against a counterattack.'),
    'SD0033': ('BXP33', 'Antiparah', P + 'A city near Helaman’s diversionary march; its occupying force later abandons it.'),
    # SC03 Journey additions (schematic sequence only)
    'SD0034': ('BXJ01', 'Return for the plates: Lehi’s sons', 'First Nephi describes Lehi’s sons going from the camp in Lemuel to Jerusalem. After Laman’s unsuccessful approach they go to the family’s inheritance, back to Jerusalem and then to an unnamed refuge; Nephi later enters Jerusalem alone, rejoins his brothers outside the walls and returns to camp, with Zoram joining them. Not every attempt involves all four brothers.'),
    'SD0035': ('BXJ02', 'Return for Ishmael’s household', 'First Nephi describes the brothers going from the camp to Jerusalem and returning with Ishmael’s household through an unnamed wilderness conflict. This is a separate trip from the one for the plates.'),
    'SD0036': ('BXJ03', 'Zeniff’s expeditions', 'Mosiah describes Zeniff’s first expedition going from Zarahemla to a wilderness conflict and back, and a later settlement company returning past that area to the lands of Nephi and Shilom; Zeniff and four men first negotiate with king Laman. Omni’s earlier narration does not name the expedition’s leader, so each account keeps its own label.'),
    'SD0037': ('BXJ04', 'The Lamanites who pursue Limhi', 'Mosiah describes Lamanite pursuers lost in the wilderness who come upon Amulon and then Helam; a remaining contingent goes to the land of Nephi, and some later return to Helam with guard families. This is not Alma’s escape route.'),
    'SD0038': ('BXJ05', 'Alma’s ministry: later stops', 'Alma describes his journey from Zarahemla east of the river Sidon to Gideon, back to Zarahemla, then to Melek and Ammonihah, toward the city of Aaron until he is redirected, and back to Ammonihah by its southern entrance. It continues “Alma’s ministry: selected stops”; no arrival at Aaron is narrated.'),
    'SD0039': ('BXJ06', 'Alma and Amulek leave Ammonihah', 'Alma describes Alma and Amulek going from Ammonihah to Sidom and then to Zarahemla, to Alma’s house. Amulek’s relatives are not said to go with them.'),
    'SD0040': ('BXJ07', 'Ammon and Lamoni go to Middoni', 'Alma describes Ammon and Lamoni setting out from Ishmael, meeting Lamoni’s father on the way, going on to Middoni and returning to Ishmael. A visit to the land of Nephi is proposed but Ammon does not make it here.'),
    'SD0041': ('BXJ08', 'Aaron’s mission', 'Alma describes Aaron, after the missionaries separate, going to the Book of Mormon city of Jerusalem, then Ani-Anti and Middoni; after his release and further ministry he goes to the royal household in the land of Nephi. His companions differ by stage, and not all the missionaries are imprisoned.'),
    # SC05 Additional place register from the completed chapter sweep
    'SD0042': ('BXP34', 'Hermounts', P + 'Wilderness to the north and west into which defeated forces flee; not a settled city.'),
    'SD0043': ('BXP35', 'Nephi’s garden tower', P + 'A tower in Nephi’s garden by the highway to Zarahemla’s chief market; distinct from temple towers.'),
    'SD0044': ('BXP36', 'Lehi (southern land)', P + 'The land southward named after Lehi in the narrator’s explanation of north and south; not the city of Lehi.'),
    'SD0045': ('BXP37', 'Mulek (northern land)', P + 'The land northward named after Mulek; distinct from the city of Mulek.'),
    'SD0046': ('BXP38', 'Moronihah (city)', P + 'A city buried when the earth becomes a mountain; distinct from the commanders named Moronihah.'),
    'SD0047': ('BXP39', 'Gilgal (city)', P + 'A city sunk into the earth; not automatically the valley of Gilgal in Ether or biblical Gilgal.'),
    'SD0048': ('BXP40', 'Onihah', P + 'A city destroyed and replaced by waters. Its precise location is unknown.'),
    'SD0049': ('BXP41', 'Mocum', P + 'A city destroyed and replaced by waters. Its precise location is unknown.'),
    'SD0050': ('BXP42', 'Gadiandi', P + 'A city sunk amid hills and valleys. No proposed ruin is asserted.'),
    'SD0051': ('BXP43', 'Gadiomnah', P + 'A city sunk amid hills and valleys; a distinct named city.'),
    'SD0052': ('BXP44', 'Jacob (city)', P + 'A sunk city; distinct from Jacobugath and from people called Jacob.'),
    'SD0053': ('BXP45', 'Gimgimno', P + 'A sunk city. Its precise location is unknown.'),
    'SD0054': ('BXP46', 'Jacobugath', P + 'The burned settlement of king Jacob’s band, connected with the flight northward in 3 Nephi 7. No boundary is drawn.'),
    'SD0055': ('BXP47', 'Laman (city)', P + 'A burned city; distinct from the river Laman and from people of the same name.'),
    'SD0056': ('BXP48', 'Josh (city)', P + 'A burned city; distinct from Josh, a commander in Mormon 6.'),
    'SD0057': ('BXP49', 'Gad (city)', P + 'A burned city. No identity with the biblical territory is established.'),
    'SD0058': ('BXP50', 'Kishkumen (city)', P + 'A burned city; distinct from the earlier assassin Kishkumen.'),
    'SD0059': ('BXP51', 'Antum', P + 'The land containing the hill Shim and Ammaron’s hidden records.'),
    'SD0060': ('BXP52', 'Hill Shim', P + 'The hill where records are hidden, named in Mormon 1:3. Ether 9:3 also names Shim in its retrospective account of Omer’s journey.'),
    'SD0061': ('BXP53', 'Jashon', P + 'A city and land near the land where records were deposited, reached during the retreat.'),
    'SD0062': ('BXP54', 'Shem (land and city)', P + 'A northern land and city fortified after the retreat from Jashon; distinct from the commander Shem.'),
    'SD0063': ('BXP55', 'Teancum (city)', P + 'A coastal city near Desolation; not the earlier warrior Teancum.'),
    'SD0064': ('BXP56', 'Boaz', P + 'A city on the retreat that resists one attack and falls to the second.'),
    'SD0065': ('BXP57', 'Jordan (city)', P + 'A city defended in the final retreat; not the biblical river Jordan.'),
    'SD0066': ('BXP58', 'Nehor (Jaredite land)', P + 'A land and city associated with Corihor’s rebellion and Shule’s return attack.'),
    'SD0067': ('BXP59', 'Moron (land)', P + 'A royal seat near the land the Nephites call Desolation; distinct from king Moron and from the city of Moroni.'),
    'SD0068': ('BXP60', 'Hill Ephraim', P + 'Where Shule prepares metal for weapons; not the biblical territory of Ephraim.'),
    'SD0069': ('BXP61', 'Heth (land)', P + 'The base of the later Jared’s rebellion; distinct from rulers called Heth.'),
    'SD0070': ('BXP62', 'Ablom', P + 'Omer’s refuge eastward by the seashore after passing the hill Shim; the account also links the route with a later place of Nephite destruction.'),
    'SD0071': ('BXP63', 'Great city by the narrow neck', P + 'A great city built in Lib’s reign by the narrow neck of land where the sea divides the land. The text does not name it.'),
    'SD0072': ('BXP64', 'Mount Zerin', P + 'A mountain the brother of Jared is reported to have moved. When and where in his life this happens is not specified.'),
    'SD0073': ('BXP65', 'Ether’s cavity of a rock', P + 'The prophet’s daytime refuge and writing place during the final wars. No cave is identified.'),
    'SD0074': ('BXP66', 'Valley of Gilgal (Jaredite)', P + 'Site of repeated battles between Coriantumr and Shared; not automatically the later city of Gilgal.'),
    'SD0075': ('BXP67', 'Plains of Heshlon', P + 'Where a pursuit turns back between the battles at Gilgal.'),
    'SD0076': ('BXP68', 'Wilderness of Akish', P + 'Site of battle, siege and an army’s refuge in the final wars; distinct from king Akish.'),
    'SD0077': ('BXP69', 'Plains of Agosh', P + 'Coriantumr kills Lib here before fleeing from Shiz.'),
    'SD0078': ('BXP70', 'Land and valley of Corihor', P + 'Shiz’s army occupies this land and camps in its valley.'),
    'SD0079': ('BXP71', 'Valley of Shurr', P + 'Coriantumr’s camp near the hill Comnor.'),
    'SD0080': ('BXP72', 'Hill Comnor', P + 'Where armies muster and a trumpet invites battle, near the valley of Shurr.'),
    'SD0081': ('BXP73', 'Sherrizah', P + 'Captives are taken from the tower of Sherrizah, and its widows and daughters are left without supplies. No identity with another settlement is assumed.'),
    'SD0082': ('BXP74', 'Moriantum', P + 'Where reported Nephite atrocities take place; spelled differently from Morianton.'),
    # SC06 Later journey and event integration map
    'SD0083': ('BXJ09', 'Zoramite converts move to Jershon', 'Alma describes converted Zoramites and the missionaries leaving Antionum for Jershon, Ammon’s people moving from Jershon to Melek, and the missionaries returning to Zarahemla. Each group has its own movement.'),
    'SD0084': ('BXJ10', 'Mission of Nephi and Lehi (sons of Helaman)', 'Helaman describes Nephi and Lehi going from Bountiful to Gid, Mulek, the southern Nephite cities, Zarahemla and the land of Nephi; later a ministry in the land northward and Nephi’s return to Zarahemla. These are not the founding Nephi and Lehi.'),
    'SD0085': ('BXJ11', 'Samuel’s mission to Zarahemla', 'Helaman describes Samuel coming from an unnamed home country to Zarahemla; expelled, he returns to preach from the wall, then escapes to his own country. His final destination is unnamed, and his absence from later Nephite reports does not say he died.'),
    'SD0086': ('BXJ12', 'The defensive gathering', 'Third Nephi describes families converging from north and south on a region of the land southward that includes the land of Zarahemla and the land between Zarahemla and Bountiful, extending to the line between Bountiful and Desolation, and later returning to their separate lands. The gathering is a region, not a single point.'),
    'SD0087': ('BXJ13', 'Later retreat in Mormon’s account', 'Mormon describes later retreat stages, separate in time: from Joshua to Jashon and Shem; later from Desolation to Teancum, with repeated fighting, then Boaz, Jordan and Cumorah. Years and gaps prevent one continuous measured trek. It continues “Early retreat in Mormon’s account”; Mormon’s side trips to recover records at Shim are his own, not necessarily the whole people’s.'),
    'SD0088': ('BXJ14', 'Omer’s flight to Ablom', 'Ether describes Omer’s household, without Jared’s family, leaving the royal land, passing the hill Shim and a place of later Nephite destruction, and reaching Ablom by the seashore eastward; Nimrah joins separately, and Omer later returns. The link to Cumorah is only the account’s stated relation, not a modern location.'),
    'SD0089': ('BXJ15', 'Campaigns of the final Jaredite wars', 'Ether describes Coriantumr and Shared fighting from the valley of Gilgal to Heshlon and back to Gilgal. The later campaigns of Gilead and Coriantumr, and of Lib and Shiz, pass through Akish, Moron, the seashore, Agosh, Corihor, Shurr and Comnor, but each army has its own movements; both armies do not visit every named camp.'),
    'SD0090': ('BXJ16', 'The last campaign', 'Ether describes Coriantumr reaching Ripliancum; defeated, Shiz flees south to Ogath, Coriantumr camps at Ramah, and the surviving forces gather over four years. It continues “Final Jaredite gathering”.'),
    'SD0091': ('BXJ17', 'Moroni’s wandering', 'Moroni writes that he wanders for his safety. Direction, intermediate stops and where the records are finally deposited are not given; no route is drawn.'),
    'SD0092': ('BXE01', 'Defense, victory and resettlement', N + 'In years 16–26 the people gather to defend themselves, defeat the robbers, release those who covenant to stop, and resettle. A sequence of events, not one battle.'),
    'SD0093': ('BXE02', 'Collapse into tribes', N + 'In years 30–33 the government collapses into tribes; Jacob’s band withdraws, and Nephi continues to minister.'),
    'SD0094': ('BXE03', 'Destruction, darkness and Christ’s ministry', N + 'After the destruction and darkness, Jesus appears at Bountiful, teaches ordinances, heals and ministers repeatedly. The dated storm and the later appearance are separate; this continues “Cities destroyed” and “Healing the multitude”.'),
    'SD0095': ('BXE04', 'Common goods to division', N + 'A community holds goods in common and rebuilds Zarahemla; later class division and persecution follow, and records are hidden. This continues “Zarahemla rebuilt”.'),
    'SD0096': ('BXE05', 'Mormon’s command and the end at Cumorah', N + 'Mormon takes command, retreats, makes a treaty, resigns and returns, rescues records, fights the battle at Cumorah, and Moroni continues the record. The account does not place Mormon’s death in the scene where he survives wounded. This continues “Early northern retreat” and “Gathering at Cumorah”.'),
    'SD0097': ('BXE06', 'Jaredite kingdoms: succession and collapse', N + 'Ether recounts royal succession, kings held captive by rivals, prophets, famine, recovery, forced labor and renewed collapse, each in its own reign rather than as undated warfare.'),
    'SD0098': ('BXE07', 'Ether’s exile and the final war', N + 'Ether lives in exile during the final dynastic war; peace proposals fail and he completes his record. This continues “Final Jaredite gathering”.'),
    'SD0099': ('BXE08', 'Moroni’s closing record', N + 'Moroni preserves ordinances, his father’s sermon and letters, and his own final exhortation. The earlier letters and sermon are retrospective, not events after year 420.'),
    # SC07 People and explanatory-entry additions
    'SD0100': ('BXR01', 'The twelve disciples at Bountiful', P + 'Third Nephi names the twelve: Nephi, Timothy, Jonas, Mathoni, Mathonihah, Kumen, Kumenonhi, Jeremiah, Shemnon, a second Jonas, Zedekiah and Isaiah. Timothy is Nephi’s brother and Mathonihah is Mathoni’s brother; who the son clause refers to is left as the text gives it. These are not the biblical prophets of the same names. The three who tarry are deliberately not named.'),
    'SD0101': ('BXR02', 'Keepers of the records: Nephi to Moroni', P + 'The records pass from Nephi to his son Amos, to his son Amos, to his brother Ammaron; Ammaron instructs Mormon, and Mormon gives selected plates to his son Moroni. Mormon’s own father, also called Mormon, and the two Amos generations are separate people.'),
    'SD0102': ('BXR03', 'Commanders at Cumorah', P + 'Mormon names commanders at Cumorah: Gidgiddonah, Lamah, Gilgal, Limhah, Jeneum, Cumenihah, Moronihah, Antionum, Shiblom, Shem and Josh; ten others are not named. They are distinct from cities and earlier captains with the same names. Moroni and Mormon survive this scene.'),
    'SD0103': ('BXR04', 'Ether’s genealogy', P + 'Ether traces his line back: Ether, Coriantor, Moron, Ethem, Ahah, Seth, Shiblon, Com, Coriantum, Amnigaddah, Aaron, Heth, Hearthom, Lib, Kish, Corom, Levi, Kim, Morianton, Riplakish, Shez, Heth, Com, Coriantum, Emer, Omer, Shule, Kib, Orihah, Jared. Repeated names are different people. Ether 1:6, 16 and 23 say “descendant” rather than son; chapter 11 spells Shiblom, and 11:11 says descendant where 1:9 says son. This is a text genealogy, not a dated, complete pedigree.'),
    'SD0104': ('BXR05', 'Jaredite families', P + 'Jared’s brother is unnamed in the numbered text; his firstborn is Pagag. Jared’s sons are Jacom, Gilgah, Mahah and Orihah. Kib’s sons are Corihor and Shule. Noah is Corihor’s son; Cohor is named both as Noah’s brother and as his son; Nimrod is the son of the younger Cohor. Omer’s sons are Jared, Esrom and Coriantumr. Akish, son of Kimnor, marries Jared’s unnamed daughter and is father of Nimrah and other unnamed sons. Shared and Gilead are brothers, as are Lib and Shiz. Unnamed women are kept where the text mentions them.'),
    'SD0105': ('BXR06', 'People in Mormon’s letter (Moroni 9)', P + 'Archeantus, Luram and Emron have fallen; Amoron brings word; Zenephi commands; an Aaron is named whose identity needs more evidence. Widows, daughters and prisoners suffer. Amoron is not Ammaron, and no named victims are inferred.'),
    'SD0106': ('BXC01', 'The law fulfilled; worship and ordinances', P + 'Jesus declares the law of Moses fulfilled while covenant prophecies continue, and teaches repentance, baptism, the Holy Ghost, the sacrament and open worship, with distinctions of audience and ordinance kept. Related entries: “Bread and wine among the multitude”, “Church and gospel”.'),
    'SD0107': ('BXC02', 'Gathering of Israel and two Jerusalems', P + 'Teachings on gathering Israel, other sheep and the lost tribes, the inclusion of the Gentiles, and distinct promises for the old Jerusalem and a New Jerusalem. A prophecy, not a completed journey.'),
    'SD0108': ('BXC03', 'The translated disciples', P + 'The three disciples’ names are not known. Mormon is first uncertain about their change and later clarifies it; their continuing ministry is distinct from a final change to immortality. No later sightings are included.'),
    'SD0109': ('BXC04', 'How the record was made and passed on', P + 'Mormon and Moroni describe abridgment, admitted limitations, sealed material, interpreters, future witnesses, altered language and divine interpretation. These are the narrative’s own claims, separate from the external history of the manuscript.'),
    'SD0110': ('BXC05', 'Faith, hope, charity and weakness', P + 'Ether and Moroni teach faith, hope, charity, grace and human weakness, and describe spiritual gifts and seeking a spiritual witness.'),
    'SD0111': ('BXC06', 'Church practice in Moroni', P + 'Moroni records ordination, the sacrament prayers, readiness for baptism, recording names and caring for members, forgiveness and accountability, and teaches that little children are alive in Christ without baptism. Moroni 8 does not give the age of eight; D&C 68 is separate.'),
}

# SC04 is a prose-only section (coverage-bom.md:402-410): six mandatory people/relationship bullets.
# Keys are builder handles for the bullets (no SD rows exist for them).
PROSE = [
    ('SC04', 'SC04.1', 'Lehi and Sariah’s household', P + 'Laman, Lemuel, Sam and Nephi are named early; Jacob and Joseph are born in the wilderness; unnamed sisters go with Nephi when he withdraws. Their names and spouses are not given.',
     [('1 Nephi 2:5', 'bofm/1-ne/2'), ('1 Nephi 18:7', 'bofm/1-ne/18'), ('2 Nephi 5:6', 'bofm/2-ne/5')]),
    ('SC04', 'SC04.2', 'Keepers of the small plates', P + 'The plates pass from Jacob to his son Enos, to his son Jarom, to his son Omni, to his son Amaron, to his brother Chemish, to his son Abinadom, to his son Amaleki; Amaleki, who has no children, gives them to Benjamin. A chain of custody with mixed relationships, not a single father-to-son line.',
     [('Jacob 7:27', 'bofm/jacob/7'), ('Jarom 1:1,15', 'bofm/jarom/1'), ('Omni 1:1–12,25', 'bofm/omni/1')]),
    ('SC04', 'SC04.3', 'Two Mosiahs; two Ammons', P + 'The Mosiah of Omni is Benjamin’s father; Benjamin’s son Mosiah is the later king. The Ammon who leads the search in Mosiah 7 descends from Zarahemla; the missionary Ammon of Alma 17 is a son of the later Mosiah.',
     [('Omni 1:23', 'bofm/omni/1'), ('Mosiah 1:2', 'bofm/mosiah/1'), ('Mosiah 7:3', 'bofm/mosiah/7'), ('Mosiah 27:34', 'bofm/mosiah/27')]),
    ('SC04', 'SC04.4', 'Zeniff to Limhi; the two Almas', P + 'Zeniff, Noah and Limhi are father and son in turn. The elder Alma is the younger Alma’s father; the elder Alma’s link with Noah’s priests does not make the younger Alma one of them.',
     [('Mosiah 7:9', 'bofm/mosiah/7'), ('Mosiah 17:1–3', 'bofm/mosiah/17'), ('Mosiah 27:8', 'bofm/mosiah/27')]),
    ('SC04', 'SC04.5', 'Lamoni’s family and allies', P + 'Lamoni’s father and wife are not named in Alma 19–22; Antiomno is king of Middoni and Lamoni’s friend. Abish is a named woman who acts from her earlier faith; she is not Lamoni’s wife.',
     [('Alma 19:2–17', 'bofm/alma/19'), ('Alma 20:4–8', 'bofm/alma/20')]),
    ('SC04', 'SC04.6', 'Two men named Zoram', P + 'Zoram is Laban’s servant in 1 Nephi 4; a Zoram is chief captain and father of Lehi and Aha in Alma 16. The shared name alone does not make them one person or show a pedigree.',
     [('1 Nephi 4:35', 'bofm/1-ne/4'), ('Alma 16:5', 'bofm/alma/16')]),
    # SC02 closing prose (coverage-bom.md:388)
    ('SC02', 'SC02.1', 'Narrow pass near Desolation', P + 'Alma names a narrow pass near Desolation. It is a feature of that passage; no modern location and no automatic identity with every neck or pass is supplied.',
     [('Alma 50:34', 'bofm/alma/50'), ('Alma 52:9', 'bofm/alma/52')]),
]

EXTRA_SRC = {
    'SD0060': [('Ether 9:3', 'bofm/ether/9')],
}

# No child source views in the Book of Mormon family.
CHILDREN = {}

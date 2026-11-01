# Builder display copy for supplementary SC30–SC34 (Old Testament wisdom literature and the Twelve:
# coverage-ot-wisdom-prophets.md), one entry per SD row. Same rules as copy_ot.py and copy_mp.py: the accepted
# row text becomes reader sentences, constraints that tell a reader something are kept as plain distinctions,
# drawing-only constraints are honoured by drawing nothing, and nothing is added from memory.
# Built in checkpoints: SC30 and SC33 (checkpoint 9); SC31, SC32 and SC34 (checkpoint 10).
#
# Sources: SC30 rows carry no links; each names its verses (Job1:1, Daniel8:2,16 ...), which EXTRA_SRC spells out
# as official chapter links with those verses. SC33 rows carry their own JST links.
#
# Poetic place views (SC30): a place named in a poem, prayer or vision is a reference, not a journey. Rows the
# register attaches to an existing site or card name that card as the same place and keep the new passage separate.
#
# Keys: `OTW-` + the research id (WP-P01 -> OTW-p01-...; rows on an existing anchor -> OTW-<anchor>-...).

import re

P = 'Old Testament — '

SLUG = {'Job': 'job', 'Psalm': 'ps', 'Psalms': 'ps', 'Song of Solomon': 'song', 'Daniel': 'dan', 'Amos': 'amos',
        'Jonah': 'jonah', 'Micah': 'micah', 'Nahum': 'nahum', 'Zechariah': 'zech', 'Haggai': 'hag', 'Hosea': 'hosea',
        'Proverbs': 'prov', 'Ecclesiastes': 'eccl', 'Zephaniah': 'zeph', 'Joel': 'joel', 'Numbers': 'num',
        'Joshua': 'josh', 'Malachi': 'mal'}


def S(label):
    """'Daniel 8:2, 16' -> ('Daniel 8:2, 16', 'ot/dan/8'); 'Job 1 (KJV)' keeps its label; 'Psalms (chapter notes)' ->
    the book's contents page 'ot/ps' (rows that name notes across a whole book, not chapters)."""
    m = re.match(r'(.+?) (\d+)(?::[^ ]*(?: \d+)?)?(?: \(.*\))?$', label)
    if not m:
        return (label, f'ot/{SLUG[label.split(" (")[0]]}')
    return (label, f'ot/{SLUG[m.group(1)]}/{m.group(2)}')


COPY = {
    # SC30 named places in poetry, wisdom, visions and the Twelve
    'SD0707': ('OTW-p01-uz', 'Land of Uz', P + 'Job’s narrative introduces him as a man living in the land of Uz. No modern location is chosen for Uz.'),
    'SD0708': ('OTW-p02-nineveh', 'Nineveh in Jonah and Nahum', P + 'Jonah describes preaching and repentance at Nineveh; Nahum addresses an oracle against it. The same city as Nineveh (Kings); the two books describe different moments, not one event.'),
    'SD0709': ('OTW-p03-joppa', 'Joppa in Jonah', P + 'Jonah goes down to Joppa and boards a ship bound for Tarshish. The same port as Joppa (Chronicles and Ezra); no harbor point is drawn.'),
    'SD0710': ('OTW-p04-tarshish-intended', 'Tarshish, Jonah’s intended destination', P + 'Tarshish is Jonah’s intended destination; the narrative does not report him reaching it. No proposed identification is chosen. The ships of Psalm 48 and the tribute of Psalm 72 are separate references, not Jonah’s arrival.'),
    'SD0711': ('OTW-p05-dura', 'Plain of Dura', P + 'Daniel places the dedication of the king’s image on the plain of Dura in the province of Babylon. The plain is unlocated, and the Babylon marker does not locate the furnace.'),
    'SD0712': ('OTW-p06-shushan-vision', 'Shushan in Daniel’s vision', P + 'Daniel’s vision is set at Shushan in Elam, beside Ulai. The same Shushan as in Nehemiah and Esther; this is a visionary setting, not a confirmed journey.'),
    'SD0713': ('OTW-p07-ulai', 'Ulai', P + 'Ulai is the watercourse named in Daniel’s vision of the ram and the goat. No modern watercourse is drawn for it.'),
    'SD0714': ('OTW-p08-hiddekel', 'Hiddekel', P + 'Daniel places his encounter beside the great river Hiddekel. The Church edition’s note identifies it with the Tigris; the exact bank is not located.'),
    'SD0715': ('OTW-p09-tekoa', 'Tekoa in Amos', P + 'Amos introduces himself among the herdmen of Tekoa. The same town as the card “Tekoa”; no farm is pinned.'),
    'SD0716': ('OTW-p10-moresheth', 'Moresheth-gath (Micah)', P + 'Micah is called the Morasthite, and his oracle names Moresheth-gath. The designation and the town are linked, but no exact birthplace is given.'),
    'SD0717': ('OTW-p11-en-gedi-song', 'En-gedi in the Song of Solomon', P + 'The Song compares the beloved with a cluster from the vineyards of En-gedi. A poetic comparison: it does not show that the lovers visited, or locate a vineyard.'),
    'SD0718': ('OTW-p12-baca', 'Valley of Baca', P + 'Psalm 84 describes worshippers passing through the valley of Baca on their way toward Zion. The valley’s identification is unresolved, and no route is drawn.'),
    'SD0719': ('OTW-p13-mizar', 'Mizar', P + 'Psalm 42 names Mizar while recalling God from the region of the Jordan and Hermon. The hill is not identified.'),
    'SD0720': ('OTW-p14-baalhamon', 'Baalhamon', P + 'The Song mentions Solomon’s vineyard at Baalhamon. An unlocated literary reference; no estate is reconstructed.'),
    'SD0721': ('OTW-p15-bathrabbim', 'Pools of Heshbon by Bathrabbim', P + 'The Song uses the pools at Heshbon by the gate of Bathrabbim in a poetic comparison. The same Heshbon as the card “Heshbon”; no surviving pool or gate is identified.'),
    'SD0722': ('OTW-p08-jerusalem-psalms', 'Jerusalem in the Psalms', P + 'Psalms portray Jerusalem as a place of worship, pilgrimage, lament and hoped-for restoration. The same city as Jerusalem in Samuel and Kings; the marker stays at the Old City.'),
    'SD0723': ('OTW-ap07-babylon-psalm-137', 'By the rivers of Babylon (Psalm 137)', P + 'Psalm 137 depicts captives grieving beside Babylon’s rivers while remembering Jerusalem. The scene is not placed at the Babylon marker.'),
    'SD0724': ('OTW-p07-bethlehem-micah', 'Bethlehem Ephratah (Micah)', P + 'Micah’s oracle names Bethlehem Ephratah as the origin of a future ruler in Israel. A prophecy about Bethlehem of Judah, not a second Bethlehem.'),
    'SD0725': ('OTW-p20-olives-zechariah', 'Mount of Olives in Zechariah', P + 'Zechariah’s prophecy names the Mount of Olives east of Jerusalem. The splitting it foretells belongs to the prophecy; the mountain’s present landform is not changed.'),
    'SD0726': ('OTW-p02-shechem-psalms', 'Shechem in Psalms 60 and 108', P + 'Psalms 60 and 108 include Shechem in a declaration of divine authority over the land. One place in a repeated poetic passage, not a second conquest. The same town as Shechem (Sichem).'),
    # SC33 five selected Joseph Smith Translation comparisons (links in the rows)
    'SD0758': ('OTW-c11-jst-psalm-11', 'Psalm 11 in the Joseph Smith Translation', P + 'The Joseph Smith Translation selection for Psalm 11 expands the scene into a future divine coming, flight toward the Lord’s mountain, judgment and redemption. A selected translation comparison, not the base text; the mountain is not located.'),
    'SD0759': ('OTW-c12-jst-psalm-14', 'Psalm 14 in the Joseph Smith Translation', P + 'The Joseph Smith Translation selection for Psalm 14 expands the critique of corrupt teachers and anticipates Zion’s establishment from heaven. A selected translation comparison; this Zion is not merged with any modern city.'),
    'SD0760': ('OTW-c13-jst-psalm-24', 'Psalm 24 in the Joseph Smith Translation', P + 'The Joseph Smith Translation selection for Psalm 24 addresses Jacob’s generations and describes the coming King establishing and redeeming his people. In the KJV, gates and everlasting doors are called to lift up so that the King of glory may enter. This imagery is kept distinct from the JST selection; neither is drawn as a literal road.'),
    'SD0761': ('OTW-c14-jst-psalm-109', 'Psalm 109 in the Joseph Smith Translation', P + 'The Joseph Smith Translation selection for Psalm 109 makes prayer for the speaker’s adversaries explicit. The KJV’s severe wishes against the adversaries remain in the base text.'),
    'SD0762': ('OTW-c15-jst-amos-7', 'Amos 7 in the Joseph Smith Translation', P + 'The Joseph Smith Translation selection for Amos 7 presents Jacob’s repentance and the withholding of total destruction. It stays separate from the KJV wording in which the Lord relents; one is not substituted for the other.'),
}

EXTRA_SRC = {k: [S(t) for t in v] for k, v in {
    'SD0707': ['Job 1:1'],
    'SD0708': ['Jonah 3', 'Nahum 1'],
    'SD0709': ['Jonah 1:3'],
    'SD0710': ['Jonah 1:3', 'Psalm 48:7', 'Psalm 72:10'],
    'SD0711': ['Daniel 3:1'],
    'SD0712': ['Daniel 8:2'],
    'SD0713': ['Daniel 8:2, 16'],
    'SD0714': ['Daniel 10:4'],
    'SD0715': ['Amos 1:1'],
    'SD0716': ['Micah 1:1, 14'],
    'SD0717': ['Song of Solomon 1:14'],
    'SD0718': ['Psalm 84:6–7'],
    'SD0719': ['Psalm 42:6'],
    'SD0720': ['Song of Solomon 8:11'],
    'SD0721': ['Song of Solomon 7:4'],
    'SD0722': ['Psalm 122', 'Psalm 137', 'Psalm 147'],
    'SD0723': ['Psalm 137:1–6'],
    'SD0724': ['Micah 5:2'],
    'SD0725': ['Zechariah 14:4'],
    'SD0726': ['Psalm 60:6', 'Psalm 108:7'],
    # S9-C1: the KJV side of the Psalm 24 comparison (the row's own link is the JST selection)
    'SD0760': ['Psalm 24:7–10 (KJV)'],
}.items()}
# Checkpoint 10: SC31 (events, journeys, relationships), SC32 (genre and reading limits) and SC34 (chapter-note
# apparatus). Rows carry no links; each names its chapters or verses, spelled out in EXTRA_SRC. Journeys are
# described, never drawn: these cards have no coordinates, routes or years, and text dates stay as the text gives them.
# Two later-work or identity facets are children: the Psalm 85 heading's Book of Mormon reading (gated 3/bom, its
# 1/ot parent keeps only the verse), and a nonspatial Heshbon identity card that the Song 7:4 view points to.
COPY.update({
    # SC31 events
    'SD0727': ('OTW-e01-job-losses', 'Job’s losses', P + 'Job’s narrative recounts the loss of his children and property, his bodily affliction, and the arrival of friends who sit with him in grief. No historical date is given. Job’s wife and his friends Eliphaz, Bildad and Zophar are separate relationships; none is made a villain from one speech.'),
    'SD0728': ('OTW-e02-job-restoration', 'Job’s closing restoration', P + 'The closing narrative rebukes Job’s friends, describes Job praying for them, and recounts renewed prosperity and children, including daughters receiving an inheritance. The turning of Job’s “captivity” is not an exile and return: no route is drawn.'),
    'SD0729': ('OTW-e03-daniel-court-education', 'Daniel’s court education', P + 'Daniel describes youths from Judah taken into Babylonian royal service, given new names and trained. The text dates this to the third year of Jehoiakim; no single siege date is fixed from it. Jerusalem and Babylon are the two ends; the way between is not described.'),
    'SD0730': ('OTW-e04-furnace', 'The fiery furnace', P + 'Daniel narrates Shadrach, Meshach and Abednego refusing to worship the royal image and surviving the fiery furnace. The image is set on the plain of Dura in the province of Babylon; the furnace is not separately located. The fourth figure is described through the king’s words. Daniel himself is not said to be present.'),
    'SD0731': ('OTW-e05-belshazzar-feast', 'Belshazzar’s feast', P + 'Daniel describes a message of judgment appearing during Belshazzar’s feast, where the vessels taken from the temple at Jerusalem are used, and the king’s death that night. No excavated room is assigned to the feast. Darius the Mede is not equated with Darius I.'),
    'SD0732': ('OTW-e06-lions', 'Daniel and the lions', P + 'Daniel narrates Daniel’s continued prayer toward Jerusalem, his confinement with lions, and a deliverance he attributes to an angel. The thirty-day decree is a stated length of time, not a date, and the den is not pinned. The king’s punishment of the accusers and their families is told as narrative, not approved.'),
    'SD0733': ('OTW-e07-nineveh-response', 'Nineveh’s response', P + 'Jonah reports that Nineveh responds to his warning with fasting and repentance, and that the announced calamity is then withheld. The forty days are the warning’s terms, not a date of destruction.'),
    'SD0734': ('OTW-e08-haggai-rebuilding', 'Haggai’s appeal to rebuild', P + 'Haggai urges the returned community to rebuild the house of the Lord and records the leaders and people beginning work. The text dates the oracle to the second year of Darius, sixth month, first day, and the start of work to the twenty-fourth day; these are kept as the text gives them, not converted to years BC.'),
    'SD0735': ('OTW-e09-haggai-foundation', 'Haggai’s foundation day', P + 'Haggai marks a day connected with the laying of the temple’s foundation and promises blessing to the community from that day. The surrounding oracle is dated the twenty-fourth day of the ninth month in Darius’s second year. Ezra’s separate account of the foundation stays separate.'),
    'SD0736': ('OTW-e10-psalm-60-superscription', 'Psalm 60’s battle heading', P + 'Psalm 60’s superscription connects the song with conflict against Aram-naharaim and Aram-zobah and with Joab’s defeat of twelve thousand Edomites in the Valley of Salt. This is the heading’s own account; it is not merged with the Samuel and Chronicles battle records, whose actors and numbers are worded differently.'),
    'SD0737': ('OTW-e11-psalm-51-nathan', 'Psalm 51 and Nathan’s visit', P + 'Psalm 51’s superscription places the prayer after the prophet Nathan came to David, following David’s involvement with Bathsheba. The account itself is in Samuel; no palace position is drawn.'),
    # SC31 journeys (described, not drawn)
    'SD0738': ('OTW-j01-jonah-voyage', 'Jonah’s interrupted voyage', P + 'Jonah boards a ship at Joppa intending to sail to Tarshish. The voyage is interrupted, and he later goes to Nineveh after a landing the text does not name. Tarshish is not reached, and no line is drawn through the sea, the fish or a shore.'),
    'SD0739': ('OTW-j02-captives-royal-service', 'Captives taken into royal service', P + 'Daniel’s opening narrative links Jerusalem’s defeat with vessels and Judean youths taken into Babylonian royal service in the land of Shinar. The way between Jerusalem and Babylon is not described, and Shinar is a land, not a palace.'),
    'SD0740': ('OTW-j03-david-gath', 'David taken at Gath (Psalm 56)', P + 'Psalm 56’s superscription associates the song with the Philistines taking David in Gath. Gath is the only place given; where David came from is not stated in this psalm.'),
    'SD0741': ('OTW-j04-david-cave', 'David in the cave (Psalms 57 and 142)', P + 'The superscriptions of Psalms 57 and 142 associate prayer with David in a cave; Psalm 57 connects it with his flight from Saul. The cave is not named, and neither heading by itself chooses Adullam or En-gedi.'),
    'SD0742': ('OTW-j05-zion-pilgrimage', 'Going up to Jerusalem (Psalm 122)', P + 'Psalm 122 depicts an invitation to go to the house of the Lord and arrival at Jerusalem’s gates. The pilgrims are unnamed, no starting place is given, and no route is measured. The same Jerusalem as the city marker.'),
    # SC31 relationships
    'SD0743': ('OTW-r01-daniel-companions', 'Daniel and his companions', P + 'In the court narrative Daniel, Hananiah, Mishael and Azariah are given the names Belteshazzar, Shadrach, Meshach and Abednego. Four people, each with two names. Belteshazzar, Daniel’s court name, is not the king Belshazzar.'),
    'SD0744': ('OTW-r02-zechariah-joshua', 'Joshua the high priest (Zechariah)', P + 'Zechariah’s visions feature Joshua the high priest and, separately, address Zerubbabel. This Joshua is the high priest of the returned community, not Joshua the son of Nun.'),
    'SD0745': ('OTW-r03-hosea-household', 'Hosea’s household', P + 'Hosea names his wife Gomer, the daughter of Diblaim, and children whose names carry prophetic meanings. The woman in Hosea 3 is not named in that chapter and is not identified here.'),
    'SD0746': ('OTW-r04-psalm-collections', 'Names in the psalm headings', P + 'Psalm superscriptions associate psalms with David, Asaph, the sons of Korah, Solomon, Moses, Heman and Ethan, and some include directions involving Jeduthun. These are the headings’ attributions and directions, not independently established authorship, and each Asaph, Heman or Ethan elsewhere is not assumed to be the same person.'),
    'SD0747': ('OTW-r05-proverbs-voices', 'Voices in Proverbs', P + 'Proverbs names Solomon, a collection copied by the men of Hezekiah, Agur the son of Jakeh, and Lemuel, whose instruction is associated with his mother. Ithiel and Ucal are named only as the wording gives them. Lemuel is not assumed to be Solomon, nor his mother Bathsheba.'),
    # SC32 genre and reading limits
    'SD0748': ('OTW-c01-job-dialogue', 'Competing voices in Job', P + 'Job preserves competing voices about suffering, and the closing narrative does not endorse everything the friends said. Each statement belongs to its speaker.'),
    'SD0749': ('OTW-c02-poetic-places', 'Places named in poems and prayers', P + 'A place named in a comparison or a prayer does not by itself show that the speaker travelled there. The atlas lists such places as references and draws no journey for them.'),
    'SD0750': ('OTW-c03-song-church-edition', 'The Song of Solomon in the Church edition', P + 'The Church’s Bible prints the Song of Solomon. Its study note reports that the Joseph Smith Translation manuscript states that the Songs are not inspired writings. All eight chapters are still listed here, with that qualification shown.'),
    'SD0751': ('OTW-c04-vision-settings', 'Vision settings and vision movements', P + 'Daniel and Zechariah distinguish the place where a vision is received from the movements and landscapes seen in it. What is seen in a vision is not drawn as surveyed geography.'),
    'SD0752': ('OTW-c05-daniel-numbers', 'Daniel’s prophetic numbers', P + 'Daniel gives several symbolic or prophetic time expressions, among them seventy weeks, 2,300 days, 1,290 days and 1,335 days. Each is kept as written; they are not combined into one calendar or given a modern end date.'),
    'SD0753': ('OTW-c06-psalm-85', 'Truth from the earth (Psalm 85)', P + 'Psalm 85:11 says that truth shall spring out of the earth and righteousness look down from heaven. The verse itself names no book.'),
    'SD0754': ('OTW-c07-psalm-110', 'Psalm 110 as a messianic psalm', P + 'The Church edition’s heading identifies Psalm 110 as messianic and reads its royal and priestly language in relation to Christ. The psalm’s own words, including “a priest for ever after the order of Melchizedek”, are shown apart from that explanation; no historical identity is settled by it.'),
    'SD0755': ('OTW-c08-imprecation-lament', 'Lament and wishes for judgment', P + 'Some psalms express grief through severe wishes for judgment or retaliation. These are the speaker’s wishes in a lament, not events that took place, and not instruction from the atlas.'),
    'SD0756': ('OTW-c09-hosea-egypt', 'Return to Egypt in Hosea', P + 'Hosea says both that Israel will return to Egypt and that Israel will not return to Egypt. Both statements are kept with their verses; the tension is not resolved here.'),
    'SD0757': ('OTW-c10-david-covenant-psalms', 'Enduring promise and lament (Psalms 89 and 132)', P + 'These psalms set enduring promises to David beside conditions, warnings and laments over apparent abandonment. They are kept side by side, not reduced to one unconditional outcome.'),
    # SC34 chapter-note apparatus (Church edition notes and inline JST)
    'SD0763': ('OTW-a01-jonah-notes', 'Notes to Jonah 2–4', P + 'The Church edition’s notes read Jonah 2’s language of death as reaching the point of death, not a visit to a mapped underworld, and explain the three days’ journey as greater Nineveh with its surroundings, not a city-wall measurement. The inline JST of Jonah 3:9–10 places repentance with the people and the withdrawal of calamity with God. In Jonah 4 the notes offer “shelter” for the booth and “castor-bean plant” for the plant; neither locates a shelter or identifies a specimen.'),
    'SD0764': ('OTW-a02-nahum-notes', 'Notes to Nahum 3', P + 'The Church edition’s note identifies No-amon with Thebes and Lubim with the Libyans, in Nahum’s comparison of Nineveh with No. These are the edition’s identifications; no modern boundary or travel route follows.'),
    'SD0765': ('OTW-a03-zephaniah-notes', 'Notes to Zephaniah 1', P + 'The Church edition’s notes identify “the second” and Maktesh as districts of Jerusalem. They are listed with Jerusalem; no streets or modern neighborhoods are drawn.'),
    'SD0766': ('OTW-a04-joel-notes', 'Notes to Joel 1–2', P + 'Joel 1’s note interprets the kinds or stages of locusts as imagery for invading armies; the verses keep their locusts, and the interpretation is the edition’s. The inline JST of Joel 2:13–14 calls the people to repent and describes God withdrawing calamity, beside the KJV wording rather than in place of it. Notes on the wedding canopy, grain and vats explain words, not places.'),
    'SD0767': ('OTW-a05-amos-notes', 'Notes to Amos 3 and 7', P + 'In Amos 3:6 the inline JST changes the key word to “known”, and in 3:7 it gives “until”; each is read with its verse, so neither the cause of evil nor a doctrine of timing is drawn from the KJV alone. The inline JST of Amos 7:3 and 7:6 describes Jacob’s repentance and the withholding of total destruction. The note to 7:13 keeps Amaziah’s words in a royal sanctuary setting, not a new city.'),
    'SD0768': ('OTW-a06-micah-notes', 'Notes to Micah 1', P + 'The Church edition’s notes connect Aphrah with dust or ashes and explain the wordplay on town names in Micah 1:10–16. Each name stays with its rhetorical fate; the fates are not separate dated destructions.'),
    'SD0769': ('OTW-a07-daniel-1-notes', 'Notes to Daniel 1', P + 'The Church edition glosses the chief officer and the steward by their roles; Melzar is treated as a steward’s title in this edition rather than a certain personal name. The notes on seeds or grain, and on age and appearance, qualify the court test; no diet or health advice is drawn from them.'),
    'SD0770': ('OTW-a08-daniel-2-notes', 'Notes to Daniel 2', P + 'The Church edition glosses “Syriack” as Aramaic, the language spoken; the court does not move to Syria. The gloss at the chapter’s end concerns Daniel remaining at the king’s court, not a new journey.'),
    'SD0771': ('OTW-a09-daniel-4-notes', 'Notes to Daniel 4', P + 'Daniel’s text uses seven times; the Church edition’s notes explain the expression with years/seasons and a seven-years gloss. No calendar dates are derived from it.'),
    'SD0772': ('OTW-a10-daniel-5-notes', 'Notes to Daniel 5', P + 'Explanations of the Aramaic words accompany the inscription of judgment, and the inline JST of Daniel 5:28 uses “Upharsin”. The inscription’s word forms and their explanation are kept apart from modern place names. The plaster and the lampstand do not locate an archaeological room.'),
    'SD0773': ('OTW-a11-daniel-6-8-notes', 'Notes to Daniel 6–8', P + 'The notes explain the signed law that cannot be changed, the accusers being overpowered, the kingdoms in the interpretation of the beasts, and Ulai as a watercourse. They clarify roles and wording, not legal history or a reconstructed waterway. Daniel 8’s notes on time speak of the indignation and the last days, not a modern end date.'),
    'SD0774': ('OTW-a12-daniel-10-11-notes', 'Notes to Daniel 10–11', P + 'The note to Daniel 10:4 identifies Hiddekel as the Tigris, so Hiddekel is listed as the edition’s other name for that river; no bank is pinned. Daniel 10’s note identifies Grecia with Macedonia in explaining the spiritual conflict, and chapter 11’s glosses on the kingdom of Macedonia and the temple clarify the vision. The princes of the vision are not given earthly biographies, and no completed campaign is drawn.'),
    'SD0775': ('OTW-a13-hosea-1-3-notes', 'Notes to Hosea 1–3', P + 'The notes explain Lo-ruhamah and Lo-ammi and their reversal, Achor as trouble, and Ishi and Baali as husband and master. These are meaningful names and titles, not further people. The gloss on raisin cakes and fertility rites is the edition’s comment and locates no shrine.'),
    'SD0776': ('OTW-a14-hosea-5-6-notes', 'Notes to Hosea 5–6', P + 'A gloss explains the boundary-marker imagery, and the month in the threat is the text’s, not a date. At 6:7 the note offers “Adam” as an alternative reading beside the KJV wording. At 6:9 the note gives “the road to Shechem”: an accusation set on that road, at the same Shechem as Shechem (Sichem), not a journey by Hosea.'),
    'SD0777': ('OTW-a15-hosea-9-11-14-notes', 'Notes to Hosea 9, 11 and 14', P + 'The note in Hosea 9 identifies Tyrus as Tyre, and the note in 14 identifies Asshur as Assyria: other names, not modern boundaries. The inline JST of 11:8 adds gathering and extended mercy; the tension between 8:13 and 9:3 and 11:5 about Egypt remains.'),
    'SD0778': ('OTW-a16-zechariah-notes', 'Notes to Zechariah', P + 'The notes explain the valley, the craftsmen, the Adversary or Accuser, the pure cap and the heavenly messengers. Joshua’s accuser stands in a heavenly court scene, not a human trial. “The Branch” in chapter 6 stays a title within the prophecy, with no biography assigned from the note. The inline JST of 8:7 and 8:13 speaks of gathering, and in 14:10 the pronoun refers to Jerusalem; the city is not moved.'),
    'SD0779': ('OTW-a17-job-1-2-notes', 'Notes to Job 1–2', P + 'The inline JST calls the heavenly assembly “children”, a variant label for the same scene, not visitors from mapped places. The gloss on “perfect” as blameless qualifies the description of Job; it is not a medical or chronological fact.'),
    'SD0780': ('OTW-a18-job-6-28-40-notes', 'Notes to Job 6, 28 and 40', P + 'Job 6’s gloss on caravans supports the comparison with the travellers of Tema and Sheba, not a documented trading expedition. Job 28’s glosses on mines and rivers describe imagery of extraction, and Job 40’s gloss on marshes gives habitat language; neither proves a species or locates a site.'),
    'SD0781': ('OTW-a19-proverbs-notes', 'Notes to Proverbs 2, 18, 23 and 27', P + 'The glosses on the alien or foreign woman, and the inline JST of 18:22 qualifying a “good” wife, concern moral and social description, not nationality or a newly named woman. The spirit-world gloss in Proverbs 27 is an explanation of belief, not a place on Earth.'),
    'SD0782': ('OTW-a20-ecclesiastes-notes', 'Notes to Ecclesiastes 1, 3, 9 and 12', P + 'Notes on vanity and wind, eternity in the heart, covenant commitment and goads refine the speaker’s vocabulary. They add no person, place, journey or date.'),
    'SD0783': ('OTW-a21-song-notes', 'Notes to the Song of Solomon', P + 'The JST qualification in Song 1’s note, that the Songs are not inspired writings, stays visible. Glosses on henna, fragrant ointment, gazelles and fawns, and the turtledove are literary vocabulary; they do not establish animal migrations, plant sites or the lovers’ identities.'),
    'SD0784': ('OTW-a22-psalms-8-15-notes', 'Notes to Psalms 8 and 15', P + 'At Psalm 8 the Hebrew gloss “less than the gods” is shown as the edition’s alternative, not substituted for the KJV. The inline JST of Psalm 15:1 specifies the hill of Zion, the worship setting at Jerusalem; every Zion in scripture is not merged with it.'),
    'SD0785': ('OTW-a23-psalms-jst-notes', 'JST notes to Psalms 30, 32, 50, 138 and 141', P + 'Inline JST notes in these psalms give six labelled variants, each compared with the KJV in its own view after this one, with its verse. The JST notes do not replace the KJV text and add no place or date.'),
    'SD0786': ('OTW-a24-psalms-60-78-notes', 'Notes to Psalms 60, 66, 68, 74 and 78', P + 'Psalm 60’s alternative reading for Philistia agrees with the triumph language of Psalm 108; the repeated passage is not a second campaign. The glosses on the river (66), offspring and Benjamin leading (68), “assembly places” for synagogues (74) and “holy land” for sanctuary (78) refine the wording of scenes and roles. No river crossing or dated synagogue institution is drawn from them.'),
    'SD0787': ('OTW-a25-psalms-83-132-notes', 'Notes to Psalms 83, 87, 95, 106 and 132', P + 'Psalm 83’s gloss on pastures or the land of Israel clarifies the target of hostile speech; Psalm 87’s notes on cities and springs of joy are not mapped springs. Psalm 95:8 gives Meribah, Psalm 106 the Reed Sea, and Psalm 132:6 identifies Ya’ar as a place: textual alternative names. Their geography stays uncertain: no modern Red Sea crossing is chosen, and Ya’ar is not equated with Kirjath-jearim.'),
    'SD0788': ('OTW-a26-psalm-109-notes', 'Notes to Psalm 109', P + 'The Hebrew gloss allows “adversary” or “accuser”, and the JST note prays for the adversaries. Not every adversary is made a named Satan, and the KJV’s wishes against them are not erased.'),
    'SD0789': ('OTW-a27-animal-instrument-notes', 'Animal and instrument notes', P + 'Examples of the edition’s notes: instrument glosses in Job 21 and 30 and buffalo or bison in Job 39; wild ox, bison or buffalo in Psalms 22, 29 and 92, jackal in Psalms 44 and 63, rock badger in Psalm 104, sea monsters in Psalm 148 and pipes or flutes in Psalm 150; rock badger in Proverbs 30; and jackals in Malachi 1. This is a bounded list of examples, not every such note. They are the edition’s vocabulary for poetic imagery, not zoological evidence or locations of species.'),
    'SD0790': ('OTW-a28-lexical-notes', 'Other wording notes', P + 'The remaining notes on grammar, synonyms, food and harvest, social and legal idioms, reverence, moral description and metaphor add no identifiable place, journey or event, so the atlas draws nothing new from them. They remain in their chapters’ notes and in the research register, and the atlas does not display them one by one; this is a mapping choice, not a judgment that the passages lack meaning.'),
})

EXTRA_SRC.update({k: [S(t) for t in v] for k, v in {
    'SD0727': ['Job 1', 'Job 2'],
    'SD0728': ['Job 42:7–17'],
    'SD0729': ['Daniel 1'],
    'SD0730': ['Daniel 3'],
    'SD0731': ['Daniel 5'],
    'SD0732': ['Daniel 6'],
    'SD0733': ['Jonah 3'],
    'SD0734': ['Haggai 1'],
    'SD0735': ['Haggai 2:18–19'],
    'SD0736': ['Psalm 60 (superscription)'],
    'SD0737': ['Psalm 51 (superscription)'],
    'SD0738': ['Jonah 1', 'Jonah 2', 'Jonah 3'],
    'SD0739': ['Daniel 1'],
    'SD0740': ['Psalm 56 (superscription)'],
    'SD0741': ['Psalm 57 (superscription)', 'Psalm 142 (superscription)'],
    'SD0742': ['Psalm 122:1–5'],
    'SD0743': ['Daniel 1:6–7'],
    'SD0744': ['Zechariah 3', 'Zechariah 4'],
    'SD0745': ['Hosea 1', 'Hosea 3'],
    # S10-C2: the superscriptions themselves, from the accepted superscription register (not authorship)
    'SD0746': ['Psalm 3 (superscription: David)', 'Psalm 50 (superscription: Asaph)',
               'Psalm 42 (superscription: sons of Korah)', 'Psalm 72 (superscription: Solomon)',
               'Psalm 90 (superscription: Moses)', 'Psalm 88 (superscription: Heman)',
               'Psalm 89 (superscription: Ethan)', 'Psalm 39 (superscription: Jeduthun direction)'],
    'SD0747': ['Proverbs 1:1', 'Proverbs 25:1', 'Proverbs 30:1', 'Proverbs 31:1'],
    'SD0748': ['Job 42:7–8'],
    'SD0749': ['Song of Solomon 4', 'Song of Solomon 7', 'Psalm 29', 'Psalm 133'],
    'SD0750': ['Song of Solomon 1 (study note)'],
    'SD0751': ['Daniel 8', 'Daniel 10', 'Zechariah 5', 'Zechariah 6', 'Zechariah 14'],
    'SD0752': ['Daniel 8', 'Daniel 9', 'Daniel 12'],
    'SD0753': ['Psalm 85:11'],
    'SD0754': ['Psalm 110:1–4 (with heading)'],
    'SD0755': ['Psalm 58', 'Psalm 109', 'Psalm 137', 'Psalm 149'],
    'SD0756': ['Hosea 8:13', 'Hosea 9:3', 'Hosea 11:5'],
    'SD0757': ['Psalm 89', 'Psalm 132'],
    'SD0763': ['Jonah 2', 'Jonah 3', 'Jonah 4'],
    'SD0764': ['Nahum 3'],
    'SD0765': ['Zephaniah 1'],
    'SD0766': ['Joel 1', 'Joel 2'],
    'SD0767': ['Amos 3', 'Amos 7'],
    'SD0768': ['Micah 1'],
    'SD0769': ['Daniel 1'],
    'SD0770': ['Daniel 2'],
    'SD0771': ['Daniel 4'],
    'SD0772': ['Daniel 5'],
    'SD0773': ['Daniel 6', 'Daniel 7', 'Daniel 8'],
    'SD0774': ['Daniel 10', 'Daniel 11'],
    'SD0775': ['Hosea 1', 'Hosea 2', 'Hosea 3'],
    'SD0776': ['Hosea 5', 'Hosea 6'],
    'SD0777': ['Hosea 9', 'Hosea 11', 'Hosea 14'],
    'SD0778': ['Zechariah 1', 'Zechariah 3', 'Zechariah 6', 'Zechariah 8', 'Zechariah 14'],
    'SD0779': ['Job 1', 'Job 2'],
    'SD0780': ['Job 6', 'Job 28', 'Job 40'],
    'SD0781': ['Proverbs 2', 'Proverbs 18', 'Proverbs 23', 'Proverbs 27'],
    'SD0782': ['Ecclesiastes 1', 'Ecclesiastes 3', 'Ecclesiastes 9', 'Ecclesiastes 12'],
    'SD0783': ['Song of Solomon 1 (study notes)', 'Song of Solomon 2 (study notes)', 'Song of Solomon 4 (study notes)',
               'Song of Solomon 8 (study notes)'],
    'SD0784': ['Psalm 8', 'Psalm 15'],
    'SD0785': ['Psalm 30', 'Psalm 32', 'Psalm 50', 'Psalm 138', 'Psalm 141'],
    'SD0786': ['Psalm 60', 'Psalm 66', 'Psalm 68', 'Psalm 74', 'Psalm 78'],
    'SD0787': ['Psalm 83', 'Psalm 87', 'Psalm 95:8', 'Psalm 106', 'Psalm 132:6'],
    'SD0788': ['Psalm 109'],
    # S10-C2: chapter examples of the notes, not book contents pages
    'SD0789': ['Job 21 (study note: instruments)', 'Job 30 (study note: instruments)',
               'Job 39 (study note: buffalo or bison)', 'Psalm 22 (study note: wild ox)',
               'Psalm 29 (study note: bison or buffalo)', 'Psalm 92 (study note: buffalo or bison)', 'Psalm 44 (study note: jackal)',
               'Psalm 63 (study note: jackal)', 'Psalm 104 (study note: rock badger)',
               'Psalm 148 (study note: sea monsters)', 'Psalm 150 (study note: pipes or flutes)',
               'Proverbs 30 (study note: rock badger)', 'Malachi 1 (study note: jackals)'],
}.items()})
# S10-C2: SD0790 is a methodological exclusion; its source is the accepted research decision, not book contents
EXTRA_SRC['SD0790'] = [('Accepted apparatus audit (chapter concept register)',
                        'https://github.com/mckayec/universe-sandbox/blob/9cc874c09a3686119ca6b4c17c7e16f214fd7ab6/'
                        'docs/universes/packs/lds-standard-works/coverage-ot-wisdom-prophets.md'
                        '#bounded-inline-apparatus-audit')]

CHILDREN = {
    # S10-C3: the six inline JST comparisons, one view each, in verse order (all 1/ot)
    'SD0785': [
        ('OTW-a23-jst-psalm-30-5', 'Psalm 30:5: KJV and inline JST', P + 'The KJV contrasts momentary anger with life in divine favor; the inline JST explicitly connects the turning away of anger with the wicked repenting.', [('Psalm 30:5 (inline JST note)', 'ot/ps/30')]),
        ('OTW-a23-jst-psalm-30-9', 'Psalm 30:9: KJV and inline JST', P + 'The KJV asks whether dust will praise God; the inline JST says the speaker’s soul will praise God and declare truth after the body returns to dust.', [('Psalm 30:9 (inline JST note)', 'ot/ps/30')]),
        ('OTW-a23-jst-psalm-32-1', 'Psalm 32:1: KJV and inline JST', P + 'The KJV blesses one whose sin is covered; the inline JST describes forgiven people as having no sins to be covered.', [('Psalm 32:1 (inline JST note)', 'ot/ps/32')]),
        ('OTW-a23-jst-psalm-50-21', 'Psalm 50:21: KJV and inline JST', P + 'Where the KJV says things will be set in order, the inline JST specifies covenants.', [('Psalm 50:21 (inline JST note)', 'ot/ps/50')]),
        ('OTW-a23-jst-psalm-138-8', 'Psalm 138:8: KJV and inline JST', P + 'The KJV speaks of the Lord perfecting what concerns the speaker; the inline JST explicitly describes perfection in knowledge concerning God’s kingdom.', [('Psalm 138:8 (inline JST note)', 'ot/ps/138')]),
        ('OTW-a23-jst-psalm-141-5', 'Psalm 141:5: KJV and inline JST', P + 'The KJV speaks of righteous smiting and reproof; the inline JST specifies the word of the Lord, preserves faith and rejects delight in the reprovers’ calamities. This is not read as approval of physical harm.', [('Psalm 141:5 (inline JST note)', 'ot/ps/141')]),
    ],
    # S9 reading 4: a nonspatial Heshbon identity the Song 7:4 view attaches to (no pool, gate or position)
    'SD0721': [
        ('OTW-heshbon', 'Heshbon', P + 'Heshbon is named as the city of Sihon, king of the Amorites, in Numbers and Joshua, and the Song of Solomon uses its pools in a poetic comparison. One place, not drawn: no position is given for the city, its pools or its gate.', [('Numbers 21', 'ot/num/21'), ('Joshua 12', 'ot/josh/12'), ('Song of Solomon 7:4', 'ot/song/7')]),
    ],
    # SC32 Psalm 85: the heading's Book of Mormon reading is gated at the Book of Mormon; the 1/ot parent keeps the verse
    'SD0753': [
        ('OTW-c06-psalm-85-heading', 'Psalm 85 and the Book of Mormon (heading)', P + 'The Church edition’s heading to Psalm 85 relates truth springing out of the earth to the Book of Mormon. This is the edition’s interpretation; verse 11 does not name that book.', [('Psalm 85 heading', 'ot/ps/85')], ([3], ['bom'])),
    ],
}

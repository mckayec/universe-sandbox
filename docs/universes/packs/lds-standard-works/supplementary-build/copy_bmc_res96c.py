# Residual-96 coherent corrections RES96-C01–C14 (checkpoint 64; HANDOFF_PLAN 2026-11-04 "Full-source decisions for
# all 96 residual semantic chapters", "Coherent corrections, with exact source boundaries").
#
# ChatGPT read the 20 chapter keys in full from the official English chapter bodies. This module turns each
# correction into 3/bom source views (copy_bmc.VIEWS format) plus, where a correction consolidates several chapters,
# one OMIT decision per consolidated key naming the view that carries it. Every cited verse was read in the
# bcbooks/scriptures-json mirror before the copy was written; the official chapter links remain the citations. Copy
# names the speaker or narrator and restates only the cited verses. No date, year, pin, route, event or later-work
# (4/dc, 5/pgp) source is added; links are one way to existing 1/ot cards. Vision classes are set from the cited
# source in timeline_vision.cjs (SEM for keyword candidates, EXPLICIT otherwise), not from the card titles.

_S = 'https://www.churchofjesuschrist.org/study/scriptures/'

# (BMC number, view key suffix, name, mode, description, verses, [(target, label)])
RES96_VIEWS = [
    # RES96-C01 (BMC-125): the scripture citation and Korihor's reported appearance are two cards, not one event.
    (125, 'choose-whom-serve-scripture', 'Scripture on choosing whom to serve (Alma 30)', 'quotation',
     'Book of Mormon — The narrator explains that there was no law against a man’s belief, “for thus saith the '
     'scripture: Choose ye this day, whom ye will serve.” Compare Joshua 24:15, “choose you this day whom ye will '
     'serve”; the wording differs slightly, so no word-for-word identity is claimed. The citation explains the '
     'Nephite law of belief; it is not a meeting with Joshua or a visit to Shechem.', '7–9',
     [('OHR-JOSHUA-NUN', 'compare his words at Joshua 24:15')]),
    (125, 'korihor-reported-appearance', 'Korihor’s account of the devil in an angel’s form (Alma 30)', 'mention',
     'Book of Mormon — After he is struck dumb, Korihor writes that the devil deceived him: he appeared unto him in '
     'the form of an angel, told him to reclaim the people and that there is no God, and taught him what to say. '
     'This is Korihor’s own retrospective account, not a manifestation the atlas presents as its own claim. It is '
     'kept separate from the scripture the narrator cites at 30:8, and his loss of speech is not diagnosed.', '53',
     []),
    # RES96-C02 (BMC-063, 072, 095, 123): elapsed-years notices reckoned from Lehi's departure.
    (63, 'departure-reckoning-early', 'Lehi’s departure as the reckoning point (Enos 1; Mosiah 6, 29; Alma 28)',
     'mention',
     'Book of Mormon — Later records count time from Lehi’s departure from Jerusalem. Enos, beginning to be old, '
     'writes that 179 years had passed (Enos 1:25). Mosiah begins to reign in the thirtieth year of his age, about 476 '
     'years from the departure (Mosiah 6:4), and dies in the thirty and third year of his reign, sixty and three years '
     'old, 509 years from it (Mosiah 29:46). Alma 28:2 measures a battle’s severity, not a year: none like it had been '
     'known since Lehi left Jerusalem. These are the records’ own counts; no age or date for Enos’s prayer, BCE year, '
     'filter year, journey or casualty census is added.', '25',
     [('OTM-jerusalem', 'Lehi’s departure, used to count years')]),
    # RES96-C02 (BMC-175, 176): the 600/609-year notices, the birth-sign clock and the records' custody.
    (175, 'departure-reckoning-later', 'Six hundred years from the departure (3 Nephi 1–2)', 'mention',
     'Book of Mormon — The narrator says the ninety and first year had passed away and it was six hundred '
     'years from the time Lehi left Jerusalem (3 Nephi 1:1). Nephi, the son of Helaman, gives his eldest son Nephi '
     'charge of the plates of brass and of the records kept sacred from the departure (1:2). Later, 609 years had '
     'passed since Lehi left Jerusalem, a hundred since the days of king Mosiah, and nine from the sign of Christ’s '
     'coming, from which the Nephites began to reckon (3 Nephi 2:5–8); the elder Nephi could nowhere be found (2:9). '
     'The judges’ years, the departure count and the sign count stay separate clocks; no BCE year or filter year is '
     'added.', '1–2', [('OTM-jerusalem', 'Lehi’s departure, used to count years')]),
    # RES96-C03 (BMC-062): Jacob's closing lament.
    (62, 'jacob-closing-lament', 'Jacob’s closing lament: cast out from Jerusalem (Jacob 7)', 'mention',
     'Book of Mormon — Closing his record as he grows old, Jacob writes that their lives passed away as it were unto '
     'them a dream, “we being a lonesome and a solemn people, wanderers, cast out from Jerusalem, born in tribulation, '
     'in a wilderness, and hated of our brethren.” The dream is a simile for passing time, not a vision. The lament '
     'speaks of the people collectively; it does not say Jacob was born in Jerusalem or add a journey.', '26',
     [('OTM-jerusalem', 'cast out from it, in Jacob’s lament')]),
    # RES96-C04 (BMC-098): the records brought out of Jerusalem.
    (98, 'records-from-jerusalem', 'Records brought out of the land of Jerusalem (Alma 3)', 'mention',
     'Book of Mormon — The narrator says that whoever believed “those records which were brought out of the land of '
     'Jerusalem,” and the tradition of their fathers, were called Nephites, and that they kept the true records of '
     'both peoples. This is the narrator’s account of how the community defined itself. The surrounding verses on a '
     'mark and curse are the narrator’s and are not atlas judgments about ethnicity, archaeology, genetics or any '
     'Cain or Ham genealogy.', '11–12', [('OTM-jerusalem', 'records brought out of it')]),
    # RES96-C05 (BMC-111): synagogues after the manner of the Jews; the future appearance taught.
    (111, 'synagogues-coming-taught', 'Synagogues after the Jews’ manner and the coming taught (Alma 16)', 'teaching',
     'Book of Mormon — Alma and Amulek preach in temples, sanctuaries and synagogues “built after the manner of the '
     'Jews” (16:13). They hold forth the coming of the Son of God, his sufferings and death and the resurrection, and '
     'teach those who ask where he will come that he would appear unto them after his resurrection (16:19–20). The '
     'appearance is a future one to this people in the Book of Mormon, not a Gospel scene; the synagogues are not '
     'modern synagogues and no Bible site or person is added.', '13, 19–20', []),
    # RES96-C06 (BMC-121): a branch of the tree of Israel.
    (121, 'branch-of-israel', 'A branch of the tree of Israel in a strange land (Alma 26)', 'teaching',
     'Book of Mormon — Ammon praises God, who has been mindful of “this people, who are a branch of the tree of '
     'Israel, and has been lost from its body in a strange land,” and says God is mindful of every people, whatsoever '
     'land they may be in. This is Ammon’s collective self-description in a metaphor; no pedigree, modern ethnic '
     'mapping, branch route or patriarch link is drawn from it.', '36–37', []),
    # RES96-C07 (BMC-008): Lehi's dream, told from the source.
    (8, 'lehi-dream-tree', 'Lehi’s dream of the tree (1 Nephi 8)', 'vision',
     'Book of Mormon — In the wilderness Lehi tells his family: “I have dreamed a dream; or, in other words, I have '
     'seen a vision.” Following a man in a white robe through a dark and dreary waste, he prays and comes to a large '
     'and spacious field and a tree whose white fruit fills his soul with joy. Sariah, Sam and Nephi come and partake; '
     'Laman and Lemuel will not. He sees a river, a rod of iron and a strait and narrow path, a mist of darkness, and '
     'a great and spacious building whose people mock those eating the fruit. Nephi says he does not give all his '
     'father’s words; Lehi then fears for Laman and Lemuel and exhorts them. This is a dream account, distinct from '
     'Lehi’s Jerusalem vision (1 Nephi 1) and Nephi’s later vision (1 Nephi 11); the text does not identify the '
     'dream’s river as the river Laman, nothing in it is mapped or dated, and no Genesis or Revelation identity is claimed.', '2–38', []),
    # RES96-C08 (BMC-103 with Alma 38:7–8; BMC-133 consolidated): three distinct angelic accounts.
    (103, 'angel-to-alma-and-amulek', 'An angel’s message to Alma, and Amulek’s report (Alma 8; Alma 38)', 'mention',
     'Book of Mormon — Weighed down with sorrow on his way from Ammonihah, Alma is met by an angel of the Lord, who '
     'says he delivered Alma’s first message and sends him back to preach (Alma 8:14–18). Entering the city by '
     'another way, Alma asks a man for food; the man, Amulek, says an angel told him in a vision that he should '
     'receive him (8:19–21). Years later Alma tells his son Shiblon that he had seen an angel face to face before his '
     'conversion, and found peace when he cried to the Lord Jesus Christ (Alma 38:7–8). The three accounts stay '
     'distinct: no angel is named, no date or place is fixed, and Amulek’s experience is his own.', '14–21', []),
    # RES96-C09 (BMC-114): Lamoni, Abish and the angel reports.
    (114, 'lamoni-abish-angels', 'Lamoni’s Redeemer, Abish’s father, and angels reported (Alma 19)', 'mention',
     'Book of Mormon — Rising, king Lamoni tells the queen, “I have seen my Redeemer; and he shall come forth, and be '
     'born of a woman,” and sinks again with joy (19:12–13). Abish, a Lamanite woman, alone stays standing, having been '
     'converted many years before “on account of a remarkable vision of her father” (19:16); the text does not say '
     'whose vision it was. She raises the queen, who raises Lamoni; many then declare that they had seen angels and '
     'conversed with them (19:29–34). The future birth is foretold, not witnessed; Abish is not the queen, and no '
     'palace is located.', '12–16, 29–34', []),
    # RES96-C10 (BMC-163): names of the first parents and the prison manifestation.
    (163, 'names-and-prison-fire', 'Names of the first parents, and the fire in the prison (Helaman 5)', 'mention',
     'Book of Mormon — Helaman tells his sons Nephi and Lehi that he gave them the names of their first parents who '
     'came out of the land of Jerusalem, so they would remember their works (5:6). Later the brothers are cast into '
     'prison; they are encircled as if by fire that does not burn them, a cloud of darkness overshadows those present, '
     'and a still voice speaks three times (5:20–34). Aminadab sees their faces shine as the faces of angels and '
     'explains that they converse with angels (5:35–41). When the darkness disperses, every soul is encircled by fire; '
     'the people see the heavens open and angels come down, and about three hundred see and hear these things '
     '(5:42–50). What is seen and Aminadab’s explanation stay distinct; the brothers are not the founding Nephi and '
     'Lehi, Aminadab is not the biblical one, and the prison is not located.', '6, 20–50',
     [('OTM-jerusalem', 'first parents came from it, per Helaman')]),
    # RES96-C11 (BMC-174): angels to wise men; the skeptics' Jerusalem argument.
    (174, 'wise-men-angels-skeptics', 'Angels to wise men, and the skeptics’ Jerusalem argument (Helaman 16)',
     'mention',
     'Book of Mormon — In the ninetieth year of the judges, the narrator says, angels appeared unto men, wise men, and '
     'declared glad tidings of great joy (16:13–14). Separately, some argue that it is not reasonable that a Christ '
     'should come, asking why he would not show himself in this land as well as in the land of Jerusalem, and call '
     'the belief a wicked tradition (16:18–20). The argument is theirs, not the atlas’s; the wise men are unnamed and '
     'not identified with the visitors of Matthew 2, and no journey or coordinate is added.', '13–14, 18–20',
     [('OTM-jerusalem', 'named in the skeptics’ argument')]),
    # RES96-C12 (BMC-181): Nephi's eyewitness account of angels.
    (181, 'nephi-saw-angels', 'Nephi visited by angels (3 Nephi 7)', 'mention',
     'Book of Mormon — The narrator says Nephi had been visited by angels and by the voice of the Lord, had seen '
     'angels as an eyewitness, and had power to know concerning the ministry of Christ; he had also witnessed the '
     'people’s quick return to wickedness (7:15). His faith was so great that angels ministered unto him daily '
     '(7:18). Seeing angels, hearing the Lord’s voice and witnessing the relapse stay distinct, and the brother he '
     'raises later is not identified here.', '15, 18', []),
    # RES96-C13 (BMC-193): the witnessed ministry, prayer and light.
    (193, 'angels-prayer-light', 'Angels, prayer and light upon the disciples (3 Nephi 19)', 'mention',
     'Book of Mormon — After the twelve disciples are baptized and filled with the Holy Ghost and with fire, the '
     'multitude sees them encircled as if by fire from heaven, and angels come down and minister to them; then Jesus '
     'comes and stands in their midst (19:13–15). He prays to the Father for them and for those who believe their '
     'words; the disciples pray to him “because I am with them” (19:22), and as he blesses them the light of his '
     'countenance makes them as white as his countenance and garments (19:20–30). Jesus says he never saw so great '
     'faith among all the Jews (19:35–36); the comparison is his. The water is unnamed, and the disciples are not their Bible namesakes.',
     '13–15, 20–30, 35–36', []),
    # RES96-C14 (BMC-223): Omer's warning dream and Emer's sight, two men and two accounts.
    (223, 'omer-dream-emer-sight', 'Omer warned in a dream; Emer sees the Son of Righteousness (Ether 9)', 'mention',
     'Book of Mormon — The Lord warns Omer in a dream to depart out of the land, and he leaves with his family and '
     'pitches his tent at Ablom by the seashore (9:3). Later, Emer anoints his son Coriantum to reign in his '
     'place and lives four more years. The record says that he sees peace in the land, sees the Son of '
     'Righteousness, rejoices, and dies in peace (9:21–22). The dream '
     'is given only as a warning to depart, and the form and place of Emer’s sight are not described; the two men and '
     'the two accounts stay distinct, and no date is added.', '3, 21–22', []),
]

# Further sources a view cites beside its chapter locator, keyed by view (copy_bmc.EXTRA_SOURCES).
RES96_EXTRA = {
    'BMV-125-choose-whom-serve-scripture': [('Joshua 24:15', _S + 'ot/josh/24?lang=eng')],
    'BMV-063-departure-reckoning-early': [('Mosiah 6:4', _S + 'bofm/mosiah/6?lang=eng'),
                                          ('Mosiah 29:46', _S + 'bofm/mosiah/29?lang=eng'),
                                          ('Alma 28:2', _S + 'bofm/alma/28?lang=eng')],
    'BMV-175-departure-reckoning-later': [('3 Nephi 2:5–9', _S + 'bofm/3-ne/2?lang=eng')],
    'BMV-103-angel-to-alma-and-amulek': [('Alma 38:7–8', _S + 'bofm/alma/38?lang=eng')],
}

_D = 'checkpoint 64 decision (RES96-{0}): '

# Views implemented without a See-also link (copy_bmc.NOLINK), keyed by view.
RES96_NOLINK = {
    'BMV-125-korihor-reported-appearance':
        _D.format('C01') + 'attributed account without a link; 2 Corinthians 11:14 is an optional comparison, '
        'declined, and the appearance is not merged with the scripture citation',
    'BMV-111-synagogues-coming-taught':
        _D.format('C05') + 'source-only view; no Gospel card is linked because the appearance taught is the future '
        'one to this people, and no Bible site or person is added',
    'BMV-121-branch-of-israel':
        _D.format('C06') + 'attributed collective metaphor without a link; no patriarch card is required or linked',
    'BMV-008-lehi-dream-tree':
        _D.format('C07') + 'source-only dream account; no Genesis or Revelation card is linked, and the existing '
        'river Laman card is not identified with the dream’s river',
    'BMV-103-angel-to-alma-and-amulek':
        _D.format('C08') + 'source-only account of three distinct angelic contributions (Alma 8:14–18, 8:19–21, '
        'Alma 38:7–8); no Bible card is their subject',
    'BMV-114-lamoni-abish-angels':
        _D.format('C09') + 'source-only account; no Gospel birth card is linked, since the birth is foretold, not '
        'witnessed',
    'BMV-181-nephi-saw-angels':
        _D.format('C12') + 'source-only account; the 2 Peter 2:22 comparison is optional and declined',
    'BMV-193-angels-prayer-light':
        _D.format('C13') + 'source-only account; John 17 is an optional comparison, declined, not the same prayer',
    'BMV-223-omer-dream-emer-sight':
        _D.format('C14') + 'source-only account; no Numbers serpent card is linked',
}

# Consolidated chapter keys (copy_bmc.OMIT): the view that carries each.
RES96C_OMIT = {
    72: _D.format('C02') + 'Mosiah 6:4 (Mosiah begins to reign at thirty, about 476 years from Lehi’s departure) is '
        'represented by BMV-063-departure-reckoning-early, which cites it; no regnal date or BCE year is added.',
    95: _D.format('C02') + 'Mosiah 29:46 (Mosiah dies in the thirty and third year of his reign, aged sixty and three, '
        '509 years from the departure) is represented by BMV-063-departure-reckoning-early, which cites it.',
    123: _D.format('C02') + 'Alma 28:2 (a battle unlike any since Lehi left Jerusalem; a severity comparison, not an '
         'epoch) is represented by BMV-063-departure-reckoning-early, which cites it; no casualty census is claimed.',
    176: _D.format('C02') + '3 Nephi 2:5–9 (609 years from the departure, nine from the sign, and the elder Nephi not '
         'found) is represented by BMV-175-departure-reckoning-later, which cites it; the clocks stay separate.',
    133: _D.format('C08') + 'Alma 38:7–8 (Alma’s earlier conversion encounter with an angel, recounted to Shiblon) is '
         'represented by BMV-103-angel-to-alma-and-amulek, which cites it; no new chapter-38 occurrence or named '
         'angel is added.',
}

assert len({(n, s) for n, s, *_ in RES96_VIEWS}) == 16
assert sorted({n for n, *_ in RES96_VIEWS} | set(RES96C_OMIT)) == [
    8, 62, 63, 72, 95, 98, 103, 111, 114, 121, 123, 125, 133, 163, 174, 175, 176, 181, 193, 223]

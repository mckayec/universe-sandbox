# Builder display copy for supplementary SC46 (coverage-pgp.md "Additional research records and relationships",
# QG01–QG16) and SC47 (the Articles of Faith table in "Fine-grained coverage for the single-chapter components").
# One `PGM-qg` card per SC46 row: the accepted row text in reader sentences, with its locator and its
# implementation limit as a plain sentence. Nonspatial: no point, route or date field is drawn; places already in
# the atlas are named, not repeated. SC47's thirteen article rows are consolidated, per the row rule, into one card
# that keeps every clause and names the existing PC06/C06/PC07/C07/PC08 view for each article. "See also" names
# existing cards; build.py checks each title against the pack. Nothing is added from memory.

P = 'Pearl of Great Price — '


def S(label, path):
    return (label, 'pgp/' + path)


COPY = {
    # SC46 QG01–QG16
    'SD1212': ('PGM-qg01-moses-vision-purpose', 'Creation and eternal life in Moses’ vision',
               P + 'Moses 1:27–39: Moses’ vision connects divine creation with human immortality and eternal life. '
               'A concept, not a place; nothing is drawn. See also: “Moses’ vision”.'),
    'SD1213': ('PGM-qg02-moses-3-garden', 'Spiritual creation and the garden in Moses 3',
               P + 'Moses 3:1–25 joins spiritual creation, responsibility in the garden, choice and marital '
               'companionship. A concept; the garden is the existing Eden reference, not a new place. See also: '
               '“Garden in Eden”, “Creation in Moses”.'),
    'SD1214': ('PGM-qg03-moses-4-rebellion', 'Rebellion before the garden narrative in Moses 4',
               P + 'Moses 4:1–4 and 12–31 present a rebellion against agency before the garden narrative, then its '
               'consequences and the expulsion. An ordered narrative with no numeric date. See also: “Leaving Eden '
               'in Moses”.'),
    'SD1215': ('PGM-qg04-cain-line', 'Cain’s line: Enoch to Lamech',
               P + 'Moses 5:41–53: Cain, then Enoch, Irad, Mahujael, Methusael and Lamech is this family branch. '
               'Lamech’s wives are Adah and Zillah; their children Jabal (tents and cattle), Jubal (music), Tubal '
               'Cain (metalworking) and Naamah supply the occupational and family context. The account says Lamech '
               'kills Irad after Irad begins revealing their secret, and Lamech’s wives then disclose it (verses '
               '49–53). Irad keeps his place in the genealogy; no different victim is invented to remove the '
               'chronological difficulty. This Lamech, of Cain’s line, is not Noah’s father, and this Enoch is not '
               'the Enoch of Seth’s line. See also: “Cain in Nod”.'),
    'SD1216': ('PGM-qg05-seth-line', 'Seth’s line: Adam to Methuselah',
               P + 'Moses 6:2–25: Adam, then Seth, Enos, Cainan, Mahalaleel, Jared, Enoch and Methuselah is the other '
               'genealogy. Enos names a land for his son. Enoch’s movement by the sea east (verses 41–42) is a '
               'textual itinerary without geometry. Within Enoch’s discourse, Adam is described as being carried '
               'into water, baptized and born of the Spirit (verses 64–68): embedded speech about Adam, not Enoch’s '
               'baptism and not a located river. Cainan the person is not the land of Cainan, and this Enos is not '
               'the Book of Mormon writer. See also: “Land of Cainan”, “Enoch’s preaching”, “Enos and his people: '
               'Shulon to Cainan”.'),
    'SD1217': ('PGM-qg06-zion', 'Zion in Moses 7',
               P + 'Moses 7:18–21 gives the name Zion to a community with no poor among them and to its city; verses '
               '62–69 promise a later gathering and a meeting with it. The ancient narrative and the future '
               'expectation are kept separate, and no place is drawn.'),
    'SD1218': ('PGM-qg07-lamech-noah', 'Lamech, Noah and Noah’s sons',
               P + 'Moses 8:5–13: Methuselah’s son Lamech fathers Noah, and Noah’s sons are named with distinct '
               'reported birth ages. The textual data are kept as given, not harmonized into dates. This Lamech is '
               'of Seth’s line, not Cain’s. See also: “Noah’s warning in Moses”.'),
    'SD1219': ('PGM-qg08-abraham-egypt', 'Abraham, the priesthood records and Egyptian origins',
               P + 'Abraham 1:7–12 and 15–31 link Abraham’s rescue and the priesthood records he inherited with an '
               'account of Egyptian origins. The three unnamed daughters of Onitah are killed after refusing idol '
               'worship. The text’s Egyptus and Pharaoh relationships stay source-specific: not every Pharaoh is '
               'collapsed into one ruler, and the Egyptus statements in verses 23 and 25 are not forced into a '
               'resolved family tree. A literary relationship, not established population history. See also: '
               '“Abraham’s deliverance”, “Facsimile 1: published explanation”.'),
    'SD1220': ('PGM-qg09-abraham-household', 'Abraham’s covenant and household',
               P + 'Abraham 2:1–11 and 14–25: the covenant concerns Abraham’s descendants and ministry to all '
               'families. He reports his brother Haran’s death, his own marriage to Sarai and his brother Nahor’s '
               'marriage to Milcah, Haran’s daughter. Lot and Lot’s unnamed wife travel from Ur; Terah follows but '
               'remains in Haran. Near Egypt, Abraham conveys an instruction that Sarai identify herself as his '
               'sister: reported speech, not independent evidence of biological kinship. The existing journey is '
               'reused; Terah is not moved through the entire path, and arrival in Egypt is not narrated as '
               'completed. See also: “Abraham’s narrated journey”.'),
    'SD1221': ('PGM-qg10-heavenly-order', 'Heavenly order and premortal intelligences',
               P + 'Abraham 3:1–28: Abraham’s vision links heavenly ordering with premortal intelligences and a '
               'chosen mission. Not a scientific star map; nothing is drawn. See also: “Kolob”.'),
    'SD1222': ('PGM-qg11-abraham-creation', 'The Gods in counsel: Abraham’s creation account',
               P + 'Abraham 4–5 uses plural divine actors and distinguishes counsel from formation. It is compared '
               'with the other accounts as its own account, not combined with them into one chronology. See also: '
               '“Creation in Abraham”, “Creation in Moses”.'),
    'SD1223': ('PGM-qg12-facsimile-interpretation', 'Facsimile explanations as attributed interpretation',
               P + 'The explanations of all three facsimiles belong to the published scripture; their named figures '
               'and cosmic terms remain attributed interpretations. Published glosses are not independent Egyptian '
               'translations or measured astronomical bodies, and the evidence limit on the papyri still applies. '
               'See also: “Facsimile 1: published explanation”, “Facsimile 2: published explanation”, “Facsimile 3: '
               'published explanation”, “Book of Abraham: Church account of papyri”.'),
    'SD1224': ('PGM-qg13-temple-to-olives', 'From the temple to the Mount of Olives',
               P + 'Joseph Smith—Matthew 1:2–4: Jesus goes from the temple to the Mount of Olives and there answers '
               'questions about the destruction and his coming. A two-place textual movement; no path is drawn. See '
               'also: “Prophecy in Joseph Smith—Matthew”.'),
    'SD1225': ('PGM-qg14-js-history-moves', 'Joseph Smith—History: family moves, marriage and translation',
               P + 'Joseph Smith—History 1:3–4 and 55–75: Joseph reports his birth at Sharon, Vermont; his father’s '
               'move from Vermont to Palmyra; and the family’s subsequent move to Manchester. He reports work in '
               'Harmony, marriage in South Bainbridge, return to his father’s farm and a move with Emma to '
               'Pennsylvania. Martin Harris separately takes characters to New York, and Joseph is not routed along '
               'Harris’s trip. Oliver Cowdery joins the translation before the reported baptism. These are a '
               'birthplace and reported migration episodes, not a complete direct Sharon–Palmyra route; the '
               'restoration places already in the atlas are reused. Verse 62’s December arrival context and the '
               'separate translation episodes are kept; April 7, 1829 is not asserted to be the beginning of all '
               'translation. Subranges: verses 1–4 frame and family; 5–13 inquiry; 14–20 vision; 21–26 opposition; '
               '27–54 Moroni and the hill; 55–58 labor and marriage; 59–62 plates and move; 63–65 Harris; 66–67 '
               'Cowdery; 68–75 baptism and protection. Dates remain the account’s reported dates. See also: '
               '“Receiving the plates”.'),
    'SD1226': ('PGM-qg15-race-church-today', 'The Church today on race and the priesthood',
               P + 'The Church’s current essay disavows explanations connecting Black skin to divine disfavor or '
               'premortal wrongdoing and rejects racial inferiority. It is shown with Moses 7:8 and 22 and Abraham '
               '1:21–27, whose language is kept as written, not silently erased and not mapped onto modern ethnic '
               'groups. The essay is the Church’s current official position, not a rewritten ancient narrative. See '
               'also: “Racial priesthood and temple restrictions”.'),
    'SD1227': ('PGM-qg16-collection-history', 'Pearl of Great Price: publication dates',
               P + 'The official introduction: the collection appeared in 1851 and became a standard work on October '
               '10, 1880; present Doctrine and Covenants sections 137 and 138 were added in 1976 and moved out in '
               '1979. Document dates, not narrated ancient dates. See also: “Pearl of Great Price collection '
               'history”.'),
    # SC47: thirteen article rows, one card (SD1229–SD1240 consolidate into SD1228)
    'SD1228': ('PGM-aof-1-13', 'Articles of Faith 1–13, article by article',
               P + 'Articles of Faith 1:1–13 is a confession of belief; it implies no dated journey or event. '
               'Article 1: belief in the Godhead. 2: individual accountability rather than Adam’s transgression. 3: '
               'Christ’s Atonement and salvation. 4: faith, repentance, baptism by immersion and laying on of hands. '
               '5: calling and authority. 6: Church offices. 7: spiritual gifts. 8: the Bible with its translation '
               'qualification, and the Book of Mormon. 9: continuing revelation. 10: gathering, the New Jerusalem on '
               'the American continent and millennial hopes; no future footprint is drawn. 11: liberty of worship. '
               '12: civic obligations. 13: ethical aspirations. Articles 1–3 are also in “Articles of Faith 1–3”, '
               'article 4 in “Principles and ordinances”, 5–7 in “Articles of Faith 5–7”, 8–9 in “Scripture and '
               'revelation”, and 10–13 in “Articles of Faith 10–13”.'),
}
for _n in range(2, 14):
    COPY[f'SD{1227 + _n}'] = 'SD1228'

EXTRA_SRC = {
    'SD1212': [S('Moses 1:27–39', 'moses/1')],
    'SD1213': [S('Moses 3:1–25', 'moses/3')],
    'SD1214': [S('Moses 4:1–4, 12–31', 'moses/4')],
    'SD1215': [S('Moses 5:41–53', 'moses/5')],
    'SD1216': [S('Moses 6:2–25, 41–42, 64–68', 'moses/6')],
    'SD1217': [S('Moses 7:18–21, 62–69', 'moses/7')],
    'SD1218': [S('Moses 8:5–13', 'moses/8')],
    'SD1219': [S('Abraham 1:7–12, 15–31', 'abr/1')],
    'SD1220': [S('Abraham 2:1–11, 14–25', 'abr/2')],
    'SD1221': [S('Abraham 3:1–28', 'abr/3')],
    'SD1222': [S('Abraham 4', 'abr/4'), S('Abraham 5', 'abr/5')],
    'SD1223': [S('Facsimile 1, explanation', 'abr/fac-1'), S('Facsimile 2, explanation', 'abr/fac-2'),
               S('Facsimile 3, explanation', 'abr/fac-3')],
    'SD1224': [S('Joseph Smith—Matthew 1:2–4', 'js-m/1')],
    'SD1225': [S('Joseph Smith—History 1:3–4, 55–75', 'js-h/1')],
    # SD1226 and SD1227 carry their own links (essay; introduction); the paired verses are added here
    'SD1226': [S('Moses 7:8, 22', 'moses/7'), S('Abraham 1:21–27', 'abr/1')],
    'SD1227': [],
    'SD1228': [S('Articles of Faith 1:1–13', 'a-of-f/1')],
}
for _n in range(2, 14):
    EXTRA_SRC[f'SD{1227 + _n}'] = [S(f'Articles of Faith 1:{_n}', 'a-of-f/1')]
# the consolidated article rows keep their own locators in the mapping; the card cites the whole chapter once
MERGE_NO_SRC = {'SD1228'}

CHILDREN = {
    # SC47 rule: the appended 1834 Cowdery reminiscence remains separately attributed, not verse 76
    'SD1225': [('PGM-qg14-cowdery-1834', 'Oliver Cowdery’s 1834 account, appended',
                P + 'The October 1834 reminiscence by Oliver Cowdery appended to Joseph Smith—History is a separate '
                'retrospective witness, not verse 76 and not part of Joseph’s narration.',
                [('Joseph Smith—History, appended Cowdery note', 'pgp/js-h/1')])],
}

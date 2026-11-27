# Builder display copy for supplementary SC42 (Doctrine and Covenants ancient and visionary participants:
# coverage-dc.md "Ancient and visionary participants: separate identity space") and SC43 (closed document-to-event
# decisions DE06b–DE28). One `DCM-dca-` card per SC42 row: a D&C source view of named ancient or visionary figures
# whose identities already exist in the earlier layers; the card is not a new person. One `DCM-de` card per SC43
# row: the accepted exact title and display sentence, then the row's date, place (named as its pin or setting, no
# new point) and constraint as plain sentences. Sources: one official link per section (verses merged).

from copy_dc import P, S

COPY = {
    # SC42 ancient and visionary participants
    'SD1034': ('DCM-dca-father-son-spirit', 'The Father, the Son and the Holy Ghost in the revelations', P + 'Sections 19, 76:20–24, 93, 130:22–23 and 138 present Jesus Christ, God the Father and the Holy Ghost in the roles of divine speaker, mediator, Father, Son and Spirit. These relationships are doctrine, not ordinary human family ties or geography; nothing is drawn.'),
    'SD1035': ('DCM-dca-john-peter-james', 'John, Peter and James in the revelations', P + 'Section 7:1–8 depicts the Lord speaking with John the Beloved and then addressing Peter about their desires and ministry; 27:12 and 128:20 name Peter, James and John as messengers in the restoration narrative. This John is the apostle, not John the Baptist and not John Whitmer.'),
    'SD1036': ('DCM-dca-john-baptist', 'John the Baptist, son of Zacharias', P + 'The heading of section 13, 27:7–8 and 84:27–28 describe John the Baptist as the son of Zacharias and as the messenger reported to have ordained Joseph Smith and Oliver Cowdery.'),
    'SD1037': ('DCM-dca-moroni-mormon', 'Moroni and Mormon in the revelations', P + 'The headings of sections 2 and 10, 27:5 and 128:20 present Moroni as a messenger and custodian of the record, and Mormon as the abridger, in the editorial context of the lost manuscript pages.'),
    'SD1038': ('DCM-dca-elijah-elias-moses', 'Elijah, Elias and Moses: separate commissions', P + 'Sections 27:6–9 and 110:11–16 describe distinct messengers: Elijah, with the keys of turning the hearts of the fathers and the children; the Elias of section 110, committing the dispensation of the gospel of Abraham; the Elias of section 27, holding restoration keys and the promise made to Zacharias; and Moses, committing the keys of gathering. Whether the Elias of section 27 and the Elias of section 110 are the same is left open, and Elias is not merged with Elijah because one name translates the other.'),
    'SD1039': ('DCM-dca-adam-eve', 'Adam (Michael) and Eve', P + 'Section 27:11 names Michael as Adam. Section 107:53–56 narrates Adam’s assembly of his posterity, and 138:38–39 shows Adam and Eve in vision as the first parents. An ancient assembly in the text, distinct from the nineteenth-century gatherings.'),
    'SD1040': ('DCM-dca-gabriel-raphael', 'Gabriel and Raphael', P + 'Section 128:21 names Gabriel and Raphael among the heavenly voices and messengers. Gabriel is not merged with Noah; that would need a cited teaching.'),
    'SD1041': ('DCM-dca-abel-to-noah', 'From Abel to Noah in the revelations', P + 'Sections 84:16, 107:40–57, 124:75 and 138:40–41 name Abel, Cain, Seth, Enos, Cainan, Mahalaleel, Jared, Enoch, Methuselah, Lamech and Noah in lineage, ordination, offering-comparison and vision contexts. Section 107 distinguishes ordination from parenthood. Section 84:16 says Abel was slain by his brother, who is not named there. The ordination ages are claims of the text; Enoch’s 430 years in section 107 and the 365 years of Genesis 5 are both kept (see “Priesthood genealogies”).'),
    'SD1042': ('DCM-dca-patriarchs-houses', 'Patriarchs and the houses named for them', P + 'Sections 27:10, 84:14–16, 98:32, 109:64, 113:4–6, 132:29–37, 133:13 and 35, and 138:41 name Melchizedek, Abraham, Isaac, Jacob (Israel), Joseph of Egypt, Judah, Ephraim and Jesse as patriarchal examples, in lineage, or as names for collective houses. A personal ancestor is kept apart from the collective descendants called by the same name. Section 132:36 states that Isaac is Abraham’s son.'),
    'SD1043': ('DCM-dca-dc84-line', 'Jethro to Esaias: the priesthood line in section 84', P + 'Section 84:6–13 traces priesthood transmission through Jethro, Caleb, Elihu, Jeremy, Gad and Esaias. Verse 6 names Jethro as Moses’ father-in-law, and verse 13 says Esaias was blessed by Abraham. These names are not merged with similarly named biblical figures without evidence.'),
    'SD1044': ('DCM-dca-aaron', 'Aaron and the Aaronic Priesthood', P + 'Sections 68:16–21, 84:18 and 107:16–17 name Aaron as the namesake of the Aaronic Priesthood and teach the rights of his descendants; no modern recipient’s ancestry is inferred. That this Aaron is Moses’ brother rests on Exodus 4:14, not on these verses.'),
    'SD1045': ('DCM-dca-marriage-examples', 'Marriage examples in section 132', P + 'Section 132:1 and 34–39 cite Abraham, Sarah and Hagar, David, Solomon, Uriah and Nathan as marriage examples. Sarah gives Hagar to Abraham as a wife; David’s wrong concerning Uriah is set apart from the marriages described as granted. No claim is made that every participant consented. That Sarah is Abraham’s wife comes from Genesis 17:15, 19, not from these verses.'),
    'SD1046': ('DCM-dca-isaiah-ezekiel-daniel-malachi', 'Isaiah, Ezekiel, Daniel and Malachi', P + 'Sections 65:2, 113, 128:17 and 138:42–46 name Isaiah, Ezekiel, Daniel and Malachi for their prophetic writings or as participants in vision. Their temple and stone imagery stays textual; nothing is drawn.'),
    'SD1047': ('DCM-dca-shem-elias-transfiguration', 'Shem, and Elias at the Transfiguration', P + 'Section 138:41 names Shem as a great high priest; 138:45 describes Elias as with Moses on the Mount of Transfiguration. This Elias is kept separate from the Elias of section 110 until a cited source supports joining them.'),
    'SD1048': ('DCM-dca-book-of-mormon-figures', 'Book of Mormon figures in the revelations', P + 'Sections 10:41, 17:1, 33:8 and 98:32 name Nephi, Lehi, Laban, the brother of Jared and Benjamin in connection with manuscripts, plates and artifacts, or as ancestral examples. The brother of Jared is not named here, and the reference to Benjamin sets how far the translation extends.'),
    'SD1049': ('DCM-dca-paul-john-revelator', 'Paul and John the Revelator', P + 'The heading of section 74, 76:15, section 77 and 128:15–16 quote or explain Paul and John as New Testament witnesses, not as travelers in Ohio. John the Revelator is linked to another John only where an identity is stated, not by the name alone.'),
    'SD1050': ('DCM-dca-lucifer', 'Lucifer, the adversary', P + 'Sections 76:25–29 and 88:110–115 portray Lucifer, called Satan, as the adversary in visionary and doctrinal narrative. He has no physical location; nothing is drawn.'),
    # SC43 closed document-to-event decisions
    'SD1051': ('DCM-de06b-kirtland-vision', 'Vision in the Kirtland Temple', P + 'Smith and Cowdery report seeing Christ and receiving successive commissions from Moses, Elias and Elijah. The heading and verses 1–16 of section 110 date the reported vision to April 3, 1836, at the Kirtland Temple pin, an occasion separate from the March 27 dedication (see “Kirtland Temple: dedication and reported vision”). The messengers are described in “Elijah, Elias and Moses: separate commissions”.'),
    'SD1052': ('DCM-de09-carthage-deaths', 'Deaths at Carthage', P + 'D&C 135 announces the killing of Joseph and Hyrum Smith at Carthage Jail and describes Taylor’s wounding and Richards’s survival. Section 135:1–2 dates the deaths to June 27, 1844, at the Carthage Jail pin (John Taylor, Willard Richards). The announcement’s estimates and rhetoric remain its own.'),
    'SD1053': ('DCM-de10-moroni-smith-home', 'Moroni’s message in the Smith home', P + 'The heading to D&C 2 places Moroni’s message to Joseph Smith in the family log home at Palmyra, on the evening of September 21, 1823. The heading is a later history extract, not a surviving 1823 transcript, and the log home is a different setting from the grove. No point is drawn.'),
    'SD1054': ('DCM-de11-lost-manuscript', 'Loss of the manuscript pages', P + 'D&C 3 addresses the loss of manuscript pages entrusted to Martin Harris; D&C 10 instructs a different translation course. Section 3 is dated July 1828; section 10 likely April 1829, possibly with 1828 material, in the Harmony region. The loss itself is not precisely dated here, and July is not given as its day.'),
    'SD1055': ('DCM-de12-prospective-witnesses', 'Three prospective witnesses instructed', P + 'Cowdery, Whitmer and Harris receive conditions for witnessing the plates and other objects. The heading and verses 1–9 of section 17 date this to June 1829, in the regional setting of the Fayette (Whitmer home) pin (Oliver Cowdery, David Whitmer, Martin Harris). Instructions for a future experience, not a claim that every object was inspected on an assigned day; see “Prospective witnesses of the plates”.'),
    'SD1056': ('DCM-de13-gathering-to-ohio', 'Gathering to Ohio directed', P + 'The revelations direct the Saints toward Ohio and connect gathering with care for poor people and promised instruction. Sections 37:1–4 (December 1830) and 38:24–39 (January 2, 1831) give the command in New York with Ohio as the destination region. A command, not a single departure or a completed migration date.'),
    'SD1057': ('DCM-de14-partridge-bishop', 'Partridge named bishop', P + 'D&C 41 names Edward Partridge as bishop; later instructions give him duties involving property and stewardship. Section 41:9–11 is dated February 4, 1831, at Kirtland; section 51 gives the later duties. The heading calls him the first bishop; the appointment is distinct from his ordination, whose date is not supplied.'),
    'SD1058': ('DCM-de15-colesville-onward', 'Colesville community directed onward', P + 'After the Thompson agreement failed, Newel Knight was directed to lead the community toward Missouri. The heading and verses 1–10 of section 54 (June 10, 1831, given at Kirtland for the community at Thompson) and 56:6. The source attributes the failure to a broken covenant; the exact property boundaries and the completed route are not given.'),
    'SD1059': ('DCM-de16-whitney-bishop', 'Whitney appointed bishop', P + 'D&C 72 appoints Newel K. Whitney to receive accounts and administer temporal responsibilities in the Ohio church. Section 72:1–23 is dated December 4, 1831, at Kirtland; the distinct content of the section’s three revelations is kept separately.'),
    'SD1060': ('DCM-de17-publication-stewards', 'Revelation publication assigned', P + 'Six named stewards receive responsibility for managing the revelations and their publication. Section 70:1–5 (November 12, 1831, Hiram) names Joseph Smith, Martin Harris, Oliver Cowdery, John Whitmer, Sidney Rigdon and William W. Phelps. Not the later printing or publication date.'),
    'SD1061': ('DCM-de18-counselor-changed', 'Presidency counselor changed', P + 'The current heading explains that Jesse Gause originally received the 1832 counselor instruction and Frederick G. Williams took the office in 1833. Two dated steps: the instruction of March 15, 1832 (heading of section 81, Hiram) and Williams’s ordination on March 18, 1833 (heading of section 90, Kirtland; no room given). The name in the body is not evidence of the original recipient; see “Jesse Gause and Frederick G. Williams”.'),
    'SD1062': ('DCM-de19-school-of-the-prophets', 'School of the Prophets instructed', P + 'D&C 88 prescribes study, orderly conduct and a washing-of-feet ordinance for the School of the Prophets. The heading dates section 88 to December 27–28, 1832, and January 3, 1833, at Kirtland; verses 117–141 give these instructions. The participants are not named. An instruction, not a guessed first class date or attendance roster.'),
    'SD1063': ('DCM-de20-word-of-wisdom', 'Word of Wisdom recorded', P + 'The 1833 text gives dietary counsel and promised blessings and introduces itself as not given by commandment or constraint. The heading and verses 1–21 of section 89 date it to February 27, 1833, at Kirtland. The current section heading links Joseph Smith’s inquiry to tobacco use at the meetings and the concern it caused his wife, Emma Smith. Later mandatory observance is not backdated; see “The Word of Wisdom (1833)”.'),
    'SD1064': ('DCM-de21-kirtland-buildings', 'Kirtland building instructions', P + 'Revelations direct a house for worship and instruction and describe separate presidency and printing houses. Section 95:1–17 (June 1, 1833) gives the temple instruction and section 94:1–17 (August 2, 1833) the other houses, at Kirtland; 94:13–15 names Hyrum Smith, Reynolds Cahoon and Jared Carter as the building committee. Commands, not completed construction; the buildings and dates stay distinct.'),
    'SD1065': ('DCM-de22-far-west-temple', 'Far West temple directed', P + 'D&C 115 calls for a temple at Far West and names future dates for beginning and resuming its foundation work. Section 115:7–16 is dated April 26, 1838, at Far West; it plans work for July 4 and for the following April 26. No completed temple is claimed. The departure-site instruction of 118:5 is linked, not independent proof of fulfilment; see “Far West”.'),
    'SD1066': ('DCM-de23-kirtland-obligations', 'Kirtland obligations and new assignments', P + 'Marks and Whitney are directed toward Missouri while Granger is charged with work concerning the Presidency’s obligations. Section 117:1–16 is dated July 8, 1838, at Far West, for men departing Kirtland. Distinct destination assignments; see “Marks, Whitney and Granger: separate instructions”.'),
    'SD1067': ('DCM-de24-tithing', 'Tithing and its administration instructed', P + 'D&C 119 specifies surplus property and annual interest contributions, and D&C 120 assigns a council to administer the property. Both are dated July 8, 1838, at Far West. The council is an institutional role; no attendance is guessed, and the historical terms are not read as later accounting practice.'),
    'SD1068': ('DCM-de25-ramus-instructions', 'Ramus instructions', P + 'Instructions at Ramus discuss heavenly life, intelligence, marriage and exaltation while withholding a certain date for Christ’s return. Sections 130 (April 2, 1843) and 131 (May 16–17, 1843): two dated teaching settings at Ramus, Illinois, with no point drawn; heavenly life has no place on the map. See “Sections 130 and 131”.'),
    'SD1069': ('DCM-de26-government-declaration', 'Government declaration adopted', P + 'An 1835 assembly adopted the declaration now numbered D&C 134 on government, law and religious conscience. The heading dates the assembly to August 17, 1835, at Kirtland and names no individuals. An adopted statement, not a dictated revelation; it includes the slavery-era qualification of verse 12 (see “Section 134 on civil government”).'),
    'SD1070': ('DCM-de27-proxy-baptism-letters', 'Proxy-baptism records instructed', P + 'Two Nauvoo letters direct witnesses and recorders to preserve records of baptisms for the dead. The headings of sections 127 and 128 date them September 1 and September 7, 1842. Separate letters, not the date of the first proxy baptism; see “Proxy baptism, witnesses and records”.'),
    'SD1071': ('DCM-de28-manifesto-statement', 'Manifesto issued and explained', P + 'Woodruff’s statement was dated September 24; conference accepted it on October 6. The appended addresses explain his stated reasons for the change. Official Declaration 1 (1890) with its signature, motion and address notes; the acceptance is the existing card “Manifesto accepted”, and the later addresses (Logan, November 1, 1891; Salt Lake Temple, April 1893) are context, not a second Manifesto.'),
}

EXTRA_SRC = {k: [S(t) for t in v] for k, v in {
    'SD1034': ['D&C 19', 'D&C 76:20–24', 'D&C 93', 'D&C 130:22–23', 'D&C 138'],
    'SD1035': ['D&C 7:1–8', 'D&C 27:12', 'D&C 128:20'],
    'SD1036': ['D&C 13 heading', 'D&C 27:7–8', 'D&C 84:27–28'],
    'SD1037': ['D&C 2 heading', 'D&C 10 heading', 'D&C 27:5', 'D&C 128:20'],
    'SD1038': ['D&C 27:6–9', 'D&C 110:11–16'],
    'SD1039': ['D&C 27:11', 'D&C 107:53–56', 'D&C 138:38–39'],
    'SD1040': ['D&C 128:21'],
    'SD1041': ['D&C 84:16', 'D&C 107:40–57', 'D&C 124:75', 'D&C 138:40–41', 'Genesis 5'],
    'SD1042': ['D&C 27:10', 'D&C 84:14–16', 'D&C 98:32', 'D&C 109:64', 'D&C 113:4–6', 'D&C 132:29–37',
               'D&C 133:13, 35', 'D&C 138:41'],
    'SD1043': ['D&C 84:6–13'],
    'SD1044': ['D&C 68:16–21', 'D&C 84:18', 'D&C 107:16–17', 'Exodus 4:14'],
    'SD1045': ['D&C 132:1, 34–39', 'Genesis 17:15, 19'],
    'SD1046': ['D&C 65:2', 'D&C 113', 'D&C 128:17', 'D&C 138:42–46'],
    'SD1047': ['D&C 138:41, 45'],
    'SD1048': ['D&C 10:41', 'D&C 17:1', 'D&C 33:8', 'D&C 98:32'],
    'SD1049': ['D&C 74 heading', 'D&C 76:15', 'D&C 77', 'D&C 128:15–16'],
    'SD1050': ['D&C 76:25–29', 'D&C 88:110–115'],
    'SD1051': ['D&C 110 heading, 1–16'],
    'SD1052': ['D&C 135:1–2'],
    'SD1053': ['D&C 2 heading'],
    'SD1054': ['D&C 3 heading', 'D&C 10 heading'],
    'SD1055': ['D&C 17 heading, 1–9'],
    'SD1056': ['D&C 37:1–4', 'D&C 38:24–39'],
    'SD1057': ['D&C 41:9–11', 'D&C 51'],
    'SD1058': ['D&C 54 heading, 1–10', 'D&C 56:6'],
    'SD1059': ['D&C 72:1–23'],
    'SD1060': ['D&C 70:1–5'],
    'SD1061': ['D&C 81 heading', 'D&C 90 heading'],
    'SD1062': ['D&C 88:117–141'],
    'SD1063': ['D&C 89 heading, 1–21'],
    'SD1064': ['D&C 95:1–17', 'D&C 94:1–17'],
    'SD1065': ['D&C 115:7–16', 'D&C 118:5'],
    'SD1066': ['D&C 117:1–16'],
    'SD1067': ['D&C 119:1–7', 'D&C 120:1'],
    'SD1068': ['D&C 130', 'D&C 131'],
    'SD1069': ['D&C 134 heading, 12'],
    'SD1070': ['D&C 127 heading', 'D&C 128 heading'],
    'SD1071': ['Official Declaration 1'],
}.items()}

# SD1045: the Sarai alias rests on Abraham 2:2 (Pearl of Great Price), so it is a child view gated to group 5 rather
# than a source on the D&C card.
CHILDREN = {
    'SD1045': [('DCM-dca-sarai-abraham', 'Sarai in the Book of Abraham',
                'Pearl of Great Price — Abraham 2:2 names Abraham’s wife Sarai, the earlier name of Sarah (Genesis '
                '17:15). The alias rests on these sources, not on section 132.',
                [('Abraham 2:2', 'pgp/abr/2'), ('Genesis 17:15', 'ot/gen/17')], ([5], ['pgp']))],
}

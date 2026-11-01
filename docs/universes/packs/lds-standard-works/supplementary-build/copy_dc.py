# Builder display copy for supplementary SC35–SC45 (Doctrine and Covenants and church history: coverage-dc.md),
# one entry per SD row. Same rules as the other copy modules: the accepted row text becomes reader sentences,
# constraints that tell a reader something are kept as plain distinctions, drawing-only constraints are honoured
# by drawing nothing, and nothing is added from memory. Names are given only as fully as the row gives them.
# Built in checkpoints: SC35–SC39 (checkpoint 14); SC40–SC45 next.
#
# Sources: SC35–SC39 rows carry no links; each names its sections, headings or verses (65–66,76–77 headings;
# 57:1–3; OD1 ...), which EXTRA_SRC spells out as official section links, one per section (ranges expanded).
#
# Place views (SC35) reuse restoration identities: a place with a pin is named as that pin; others get no point.
# Event and journey views (SC36) keep document date, narrated experience and commanded travel apart.
# Relationship views (SC37, SC39) are codex cards: the codex has no typed-relation field, so each predicate is a
# sentence on its card, dated to its document where the row dates it.
#
# Keys: `DCM-` + the research id (DP01 -> DCM-dp01-..., DE01 -> DCM-de01-...).

import re

P = 'Doctrine and Covenants — '


def S(label):
    """'D&C 65 heading' -> ('D&C 65 heading', 'dc-testament/dc/65'); 'Official Declaration 1' -> 'dc-testament/od/1';
    'Genesis 5' -> 'ot/gen/5'; 'Jacob 2:23–30' -> 'bofm/jacob/2'."""
    m = re.match(r'D&C (\d+)', label)
    if m:
        return (label, f'dc-testament/dc/{m.group(1)}')
    m = re.match(r'Official Declaration (\d)', label)
    if m:
        return (label, f'dc-testament/od/{m.group(1)}')
    m = re.match(r'(Genesis|Jacob) (\d+)', label)
    return (label, {'Genesis': 'ot/gen/', 'Jacob': 'bofm/jacob/'}[m.group(1)] + m.group(2))


def secs(spec, suffix=''):
    """'65–66,76–77,99' -> ['D&C 65', 'D&C 66', 'D&C 76', 'D&C 77', 'D&C 99'] (each + suffix)."""
    out = []
    for part in spec.split(','):
        a, *b = part.split('–')
        for n in range(int(a), int(b[0]) + 1 if b else int(a) + 1):
            out.append(f'D&C {n}{suffix}')
    return out


COPY = {
    # SC35 Doctrine and Covenants place views
    'SD0791': ('DCM-dp01-hiram', 'Hiram, Ohio', P + 'The headings of sections 65–66, 76–77, 99 and 133 associate several revelations, and the 1832 vision account, with the town of Hiram. This places the revelations in the town; where Joseph Smith lived there needs separate evidence, and no house is pinned.'),
    'SD0792': ('DCM-dp02-amherst', 'Amherst, Ohio', P + 'The heading of section 75 associates an 1832 conference and two missionary revelations with Amherst. No meeting house is pinned.'),
    'SD0793': ('DCM-dp03-independence', 'Independence as Zion’s center place', P + 'Section 57:1–3 identifies Independence as Zion’s center place. The same place as the Independence pin and the narrative “Independence designated”; the town is distinct from the proposed temple lot, which this card does not locate.'),
    'SD0794': ('DCM-dp04-far-west', 'Far West', P + 'Section 115:7–16 names Far West as a gathering place and the setting of a prospective temple. A planned temple, not a completed one; no point is drawn for Far West.'),
    'SD0795': ('DCM-dp05-adam-ondi-ahman', 'Adam-ondi-Ahman', P + 'Section 116 identifies Spring Hill with Adam-ondi-Ahman and a future gathering of Adam’s people. The ancient assembly of section 107:53–57 is a separate passage. A named religious landscape, not archaeological verification; no point is drawn.'),
    'SD0796': ('DCM-dp06-fishing-river', 'Fishing River camp region', P + 'The heading of section 105 places the 1834 revelation deferring Zion’s redemption at the camp in the Fishing River region. The heading gives the camp’s position only approximately, so no point is drawn.'),
    'SD0797': ('DCM-dp07-salem', 'Salem, Massachusetts', P + 'The heading of section 111 reports that Church leaders investigated a claim about money and preached in Salem in 1836. No treasure location is drawn, and no money was recovered.'),
    'SD0798': ('DCM-dp08-perrysburg', 'Perrysburg, New York', P + 'The heading of section 100 places counsel to Joseph Smith and Sidney Rigdon at Perrysburg during their 1833 journey. Perrysburg, New York, not Perrysburg, Ohio.'),
    'SD0799': ('DCM-dp09-nauvoo-house', 'Nauvoo House', P + 'Section 124:22–24 and 56–83 direct the building of lodging for travelers, the Nauvoo House, distinct from the temple. A command to build; it belongs to Nauvoo (the Nauvoo pin) and has no point of its own.'),
    'SD0800': ('DCM-dp10-zarahemla-iowa', 'Zarahemla, Iowa', P + 'Section 125:3 names a gathering settlement called Zarahemla, opposite Nauvoo. A proposed settlement, not a verified Book of Mormon site; no point is drawn.'),
    'SD0801': ('DCM-dp11-shedolamak', 'Shedolamak', P + 'Section 107:45 associates Cainan’s journey with Shedolamak in the priesthood genealogy. No modern identification is supplied, and the place is unlocated.'),
    'SD0802': ('DCM-dp12-olaha-shinehah', 'Olaha Shinehah', P + 'Section 117:8 names the plain of Olaha Shinehah in its account of Adam. One phrase naming one place, not two sites; unlocated.'),
    # SC36 events and journeys
    'SD0803': ('DCM-de01-mission-assignments', 'Missionary assignments revised', P + 'Sections 52, 56, 66 and 75 (1831–1832) assign missionary pairs and later revise them. Each pairing belongs to its dated assignment; no permanent companion link is drawn.'),
    'SD0804': ('DCM-de02-kingdoms-of-glory', 'A shared vision of kingdoms of glory', P + 'Section 76 (February 16, 1832) records the vision Joseph Smith and Sidney Rigdon reported at Hiram (verses 11–24 and 50–119). The celestial, terrestrial and telestial kingdoms are religious concepts and are given no sky coordinates.'),
    'SD0805': ('DCM-de03-united-firm', 'The United Firm', P + 'The heading of section 78 and section 82:11–18 (1832) describe a United Firm linking commercial and publishing work in Kirtland, Ohio, and in Missouri at Independence. Its later change of terminology and its 1834 restructuring are separate steps, not part of this founding.'),
    'SD0806': ('DCM-de04-high-council-rules', 'High council rules for hearing disputes', P + 'Section 102 records the Kirtland minutes of February 17–19, 1834, in which the high council adopted rules for hearing disputes. Verses 30–32 are a later 1835 addition and are dated separately.'),
    'SD0807': ('DCM-de05-zions-camp', 'Zion’s Camp organized; its objective deferred', P + 'Section 103 (February 24, 1834) directs the organization of Zion’s Camp, and section 105 (June 22, 1834) defers its immediate objective. The camp went from Kirtland to the Fishing River region; the recruitment numbers in the revelation are targets, not counts of who went. No route is drawn.'),
    'SD0808': ('DCM-de06-kirtland-dedication-vision', 'Kirtland Temple: dedication and reported vision', P + 'Section 109 is the dedication prayer of March 27, 1836; section 110 reports a vision of Christ and heavenly messengers on April 3, 1836. Two events on two dates at the Kirtland Temple pin: a dedication prayer, then visionary testimony.'),
    'SD0809': ('DCM-de07-nauvoo-instructions', 'Nauvoo building and leadership instructions', P + 'Section 124 (January 19, 1841) records instructions to build in Nauvoo and to appoint leaders. A command to build and appoint, not a record of completed construction. The same revelation as the narrative “Nauvoo building instructions”.'),
    'SD0810': ('DCM-de08-section-132', 'Eternal and plural marriage teachings recorded', P + 'Section 132 is dated July 12, 1843, at Nauvoo and records teachings on eternal and plural marriage. The recorded date does not establish when the practice began.'),
    'SD0811': ('DCM-dj01-return-from-missouri', 'Return from Missouri: distinct routes and duties', P + 'Sections 60:5–10 and 61:23–35 (1831) direct the return from Missouri. Joseph Smith, Sidney Rigdon and Oliver Cowdery are to go from St. Louis to Cincinnati, with instructions about travel by land and by canal; the other elders’ preaching duties differ. A commanded journey; no exact road is drawn.'),
    'SD0812': ('DCM-dj02-whitney-eastern-cities', 'Whitney sent to warn eastern cities', P + 'Section 84:112–117 (1832) directs Whitney to warn the cities of New York, Albany and Boston. These are named destinations, not an observed itinerary, and no order between the stops is drawn.'),
    'SD0813': ('DCM-dj03-salem-journey', 'The Salem investigation', P + 'The heading of section 111 describes a journey in 1836 from Kirtland to Salem and back that returned without the expected money. The heading names four travelers; this is a historical account in an editorial heading, not the revelation’s own text.'),
    'SD0814': ('DCM-dj04-law-preaching', 'Law’s regional preaching assignment', P + 'Section 124:88 (1841) assigns Law to preach in Warsaw, Carthage, Burlington and Madison. The destinations are named; no route order and no state-specific points are drawn.'),
    'SD0815': ('DCM-dj05-westward-companies', 'Westward companies prepare mutual support', P + 'Section 136:1–16 (1847) directs the westward companies to organize for mutual support. The same instructions as the narrative “Instructions for the journey” at Winter Quarters; the text names no final Salt Lake endpoint and does not describe every leg of the trail.'),
    # SC37 teachings and relationships
    'SD0816': ('DCM-dx01-meanings-of-zion', 'Meanings of Zion', P + 'Zion can name a people, a gathering community or a particular promised place (57:1–3; 97:21; 101:17–21); each use is read in its context. Not every Zion is the same point on the map.'),
    'SD0817': ('DCM-dx02-priesthood-genealogies', 'Priesthood genealogies', P + 'Sections 84:6–17 and 107:39–57 describe religious authority and named relationships; their ages and chronology are claims of the text. Section 107:49 gives Enoch’s age at his translation as 430 years, alongside Genesis 5’s statement of 365 years. Both are kept; they are not silently harmonized.'),
    'SD0818': ('DCM-dx03-word-of-wisdom', 'The Word of Wisdom (1833)', P + 'Section 89:1–21 combines dietary counsel with promised blessings; its opening describes it as not given by commandment or constraint. How it is applied in current Church practice is not described here.'),
    'SD0819': ('DCM-dx04-section-132-consent', 'Consent and command in section 132', P + 'Section 132:51–65 presents a first wife’s consent and also an exemption when she refuses, and it threatens Emma with destruction for rejecting its command. Verses 61 and 65 are both kept. Compare Jacob 2:23–30 and Official Declaration 1; the atlas does not claim that the tensions between them are resolved.'),
    'SD0820': ('DCM-dx05-official-declarations', 'The Official Declarations: announcement and acceptance', P + 'The declarations document policy announcements and their acceptance at distinct times: Official Declaration 1 on September 24 and October 6, 1890; Official Declaration 2 on June 1, June 8 and September 30, 1978. See “Manifesto accepted”, “First Presidency letter”, “Declaration sustained”, “Second Manifesto”, “Ending plural marriage” and “Racial priesthood and temple restrictions”. Official Declaration 1 did not instantly end every plural union, and Official Declaration 2 did not provide for ordaining women to the priesthood.'),
    'SD0821': ('DCM-dr01-smith-rigdon', 'Joseph Smith and Sidney Rigdon: joint vision witnesses', P + 'Section 76:11–24 presents Smith and Rigdon as joint witnesses of the vision. A shared testimony, not a family relation.'),
    'SD0822': ('DCM-dr02-smith-cowdery', 'Joseph Smith and Oliver Cowdery: joint Kirtland vision witnesses', P + 'The heading of section 110 names Smith and Cowdery as joint witnesses of the Kirtland vision. The messengers in verses 11–16 keep their distinct roles.'),
    'SD0823': ('DCM-dr03-joseph-emma', 'Joseph Smith and Emma: spouses', P + 'Sections 25:1–5 and 132:51–56 address Emma as Joseph Smith’s wife. The passages are not evidence of her consent to every marriage.'),
    'SD0824': ('DCM-dr04-joseph-hyrum', 'Joseph and Hyrum Smith: brothers with distinct offices', P + 'Sections 135:1–3 and 124:91–96 present Joseph and Hyrum as brothers holding distinct offices. Hyrum’s office as patriarch is not merged with Joseph’s as president.'),
    'SD0825': ('DCM-dr05-joseph-f-hyrum', 'Joseph F. Smith, son of Hyrum', P + 'Section 138:53 explicitly names Hyrum Smith as Joseph F. Smith’s father. Joseph F. Smith is a different person from Joseph Smith Jr.'),
    'SD0826': ('DCM-dr06-joseph-alvin', 'Joseph and Alvin Smith: brothers', P + 'In the vision of section 137:5–6, Joseph sees his brother Alvin. The vision also shows his parents; that does not mean they had died when it was received.'),
    'SD0827': ('DCM-dr07-murdock-clapp', 'John Murdock and Julia Clapp', P + 'The heading and verse 6 of section 99 name Murdock and Julia Clapp as spouses with dependent children. Where the children were placed is not guessed, and no foster-family links are drawn.'),
    'SD0828': ('DCM-dr08-presidency-marsh', 'The Presidency, Marsh and the Twelve (1837)', P + 'Section 112:16–21 and 30 set out the Presidency’s direction of Marsh and the Twelve. An office relationship dated to 1837, not a permanent biography.'),
    # SC38 setting and teaching views across the collection
    'SD0829': ('DCM-dx06-book-of-mormon-production', 'The Book of Mormon in the revelations', P + 'Sections 3, 5–10, 17 and 19 describe the production, witnessing and publication of the Book of Mormon. A conditional promise to a witness is distinct from the later account of witnessing.'),
    'SD0830': ('DCM-dx07-church-offices', 'Offices, ordinances and discipline', P + 'Early instructions (sections 20–22, 26–28, 42–47, 102 and 107) define church offices, common consent, baptism, the sacrament and discipline. An office assignment is dated to its document and does not establish a lifelong role.'),
    'SD0831': ('DCM-dx08-calls-to-preach', 'Calls to preach', P + 'Calls to preach (sections 30–40, 52–56, 66, 75, 79–80, 99, 114 and 118) name companions and destinations, sometimes revising earlier instructions. A call does not by itself prove that a journey occurred.'),
    'SD0832': ('DCM-dx09-gathering', 'Gathering, land and consecration', P + 'Gathering instructions (sections 37–38, 48, 51, 57–64, 78, 82–85, 97, 101, 104–105 and 115–125) distinguish Ohio, Zion in Missouri and later settlements. Land purchase, consecration and care for dependent families are recurring obligations.'),
    'SD0833': ('DCM-dx10-prayer-gifts', 'Prayer, spiritual gifts and agency', P + 'Sections 29, 46, 50, 58, 88, 93 and 129–131 describe prayer, spiritual gifts, discernment, agency and redemption. These are religious teachings, not measurements of supernatural phenomena; nothing is pinned for them.'),
    'SD0834': ('DCM-dx11-prophecy-vision-parable', 'Prophecy, vision and parable', P + 'Prophecy, visionary description and parable (sections 45, 65, 76–77, 86–88, 98, 101 and 133) are labelled differently from narrated historical events, and the countries they name are not drawn as completed travel routes. Their links to Revelation and Isaiah are cross-references.'),
    'SD0835': ('DCM-dx12-records-and-genres', 'Bible revision, publication and records', P + 'Bible revision, publication and recordkeeping are distinct activities (sections 7, 35, 45, 47, 67–74, 85, 91, 102, 121–128 and 134–138). The collection also includes translated narrative, minutes, letters and declarations, not only revelations.'),
    'SD0836': ('DCM-dx13-temple-instructions', 'Temple instructions', P + 'Temple instructions (sections 84, 88, 94–97, 109–110, 115, 124 and 127–128) describe proposed construction, dedication, reported visitations and ordinances. A command to build is not evidence of a completed building.'),
    'SD0837': ('DCM-dx14-family-education-poor', 'Family care, education and the poor', P + 'Family care, education and provision for poor people recur alongside missionary and institutional duties (sections 25, 68, 75, 83, 90, 93, 99, 126 and 136). Named women have roles beyond being family connections.'),
    'SD0838': ('DCM-dx15-persecution-redress', 'Persecution, redress and authority', P + 'Texts about persecution (sections 98, 101, 103, 105, 121–123 and 134–135) combine suffering, legal redress and rules governing force and authority. Participants’ claims stay attributed to them rather than being treated as a neutral verdict on every conflict. See “Missouri expulsion order”, “Imprisonment at Liberty”, “Letters from Liberty” and “Authority and persuasion”.'),
    'SD0839': ('DCM-dx16-civil-government', 'Section 134 on civil government', P + 'Section 134 is an adopted declaration on civil government. Its statement on religious liberty is read alongside its slavery-era qualification in verse 12. No modern policy is inferred from it.'),
    'SD0840': ('DCM-dx17-section-87', 'Section 87: a prophecy of war', P + 'Section 87:1–8 predicts conflict beginning in South Carolina and widening beyond it. Identifying particular later events as its fulfillment is an interpretation that needs separate support; no war route is drawn.'),
    'SD0841': ('DCM-dx18-proxy-baptism-records', 'Proxy baptism, witnesses and records', P + 'Sections 127–128 link proxy baptism to witnesses and recordkeeping, and recall reported heavenly messages at named Restoration settings. No new exact date for an angelic visit is added. See “Priesthood restoration accounts” and “Salvation for the dead”.'),
    'SD0842': ('DCM-dx19-sections-130-131', 'Sections 130 and 131', P + 'Section 130 withholds a certain date for Christ’s return; section 131 discusses exaltation, marriage and spirit. These teachings give no measurable celestial coordinates.'),
    'SD0843': ('DCM-dx20-section-138', 'Section 138: messengers to the dead', P + 'Section 138:29–60 portrays Christ commissioning messengers to teach the dead. The vision names scriptural figures and later Church leaders; the spirit world is not located on the Earth map. See “Vision of the redemption of the dead”.'),
    # SC39 typed relations, one card per register row
    'SD0844': ('DCM-dr09-smith-family', 'Joseph Smith Sr., Joseph Jr. and Hyrum', P + 'Joseph Smith Sr. is the parent of Joseph Smith Jr., and Hyrum and Joseph Jr. are siblings (heading of section 4; heading and verse 1 of section 11; 23:4). Samuel H. Smith is identified separately, and no identity is inferred from a surname alone.'),
    'SD0845': ('DCM-dr10-scribes-recorder', 'Scribes and recorder', P + 'Oliver Cowdery is Joseph Smith’s scribe (heading of section 6) and Sidney Rigdon later his scribe (heading of section 35 and verse 20); John Whitmer is the Church’s recorder (47:1–4). Each responsibility is dated to its document.'),
    'SD0846': ('DCM-dr11-prospective-witnesses', 'Prospective witnesses of the plates', P + 'Section 17:1–9 names David Whitmer, Oliver Cowdery and Martin Harris as prospective witnesses of the plates. A conditional command; their later testimony is a separate event and source (see “Testimony of Three Witnesses”).'),
    'SD0847': ('DCM-dr12-pratt-cowdery-brothers', 'The Pratt and Cowdery brothers', P + 'Orson Pratt and Parley P. Pratt are brothers (heading of section 34), as are Warren A. Cowdery and Oliver Cowdery (heading of section 106). Not every Pratt or Cowdery is merged into these families.'),
    'SD0848': ('DCM-dr13-bishops-agent', 'Bishops and the bishop’s agent', P + 'Edward Partridge is appointed bishop of the Church, Newel K. Whitney bishop in Kirtland, and Sidney Gilbert agent to the bishop (41:9; 53:4; 72:8). Separate roles with separate dates.'),
    'SD0849': ('DCM-dr14-gause-williams', 'Jesse Gause and Frederick G. Williams', P + 'Jesse Gause is an original counselor in the Presidency (heading of section 81), and Frederick G. Williams succeeds to his office. The 1832 instruction and its 1833 replacement are different documents, and the two names are not aliases of one person.'),
    'SD0850': ('DCM-dr15-knight-murdock-spouses', 'The Knight and Murdock couples', P + 'Joseph Knight Sr. and Polly Knight are spouses (heading of section 59), as are John Murdock and Julia Clapp (heading of section 99). The Murdock household is the one on the card “John Murdock and Julia Clapp”, not a second household.'),
    'SD0851': ('DCM-dr16-section-52-companions', 'Mission companions in section 52', P + 'Section 52:22–40 assigns named mission companions, among them Smith and Rigdon, Wight and Corrill, and Murdock and Hyrum. The full roster of pairs stays in the revelation; later changes are tracked, and these are not permanent social links.'),
    'SD0852': ('DCM-dr17-revised-companions', 'Revised companion assignments', P + 'Marsh and Selah J. Griffin are revised companions (56:5–8); McLellin and Samuel H. Smith are assigned companions (66:7–8); McLellin and Luke S. Johnson are later revised companions (75:6–9). Each pairing belongs to its document, and an obsolete pair is not shown as still active.'),
    'SD0853': ('DCM-dr18-section-75-companions', 'Mission companions in section 75', P + 'Section 75:13–36 assigns further pairs, among them Hyde and Samuel Smith, and Lyman Johnson and Orson Pratt. The full roster stays in the revelation, with its conditions for supporting families.'),
    'SD0854': ('DCM-dr19-united-firm-members', 'Members of the United Firm', P + 'Section 82:11–18 names Partridge, Whitney, Gilbert, Rigdon, Smith, John Whitmer, Cowdery, Phelps and Harris as covenant participants in the United Firm (see “The United Firm”). Section 104 later restructures its stewardships; it is not one permanent partnership.'),
    'SD0855': ('DCM-dr20-nauvoo-offices', 'Offices named in section 124', P + 'Section 124:91–96 and 127 appoint Hyrum Smith as patriarch and seer, William Law as counselor in the Presidency, and Brigham Young as president of the Twelve. The full offices and rosters stay in the revelation; no permanent tenure is implied.'),
    'SD0856': ('DCM-dr21-company-organizers', 'Organizers of the westward companies', P + 'Section 136:12–14 names Benson and Snow, Pratt and Woodruff, and Lyman and George A. Smith to organize companies. Instructions for roles, not precise company manifests.'),
    'SD0857': ('DCM-dr22-declaration-signatories', 'Signatories and the motion to accept', P + 'Spencer W. Kimball, N. Eldon Tanner and Marion G. Romney signed the Official Declaration 2 letter; Lorenzo Snow proposed the motion accepting Official Declaration 1 at conference. Signing a letter or proposing a motion is not authorship of every appended heading.'),
    'SD0858': ('DCM-dr23-ordinations-107', 'Ordinations in section 107', P + 'Section 107:41–52 names Adam as the one who ordained Seth, Enos, Mahalaleel, Jared, Enoch and Methuselah; Seth ordained Lamech, and Methuselah ordained Noah. Cainan’s ordainer is unnamed in verse 45. These ordination links are not father-child links, and the ages remain claims of the text.'),
    'SD0859': ('DCM-dr24-priesthood-line-84', 'The priesthood line in section 84', P + 'Section 84:6–13 traces priesthood conferral from Esaias to Gad, Gad to Jeremy, Jeremy to Elihu, Elihu to Caleb, Caleb to Jethro, and Jethro to Moses. A line of priesthood transmission, not assumed biological descent; Abraham’s and Melchizedek’s relationships keep their own wording.'),
}

EXTRA_SRC = {k: [S(t) for t in v] for k, v in {
    'SD0791': secs('65–66,76–77,99,133', ' heading'),
    'SD0792': ['D&C 75 heading'],
    'SD0793': ['D&C 57:1–3'],
    'SD0794': ['D&C 115:7–16'],
    'SD0795': ['D&C 116', 'D&C 107:53–57'],
    'SD0796': ['D&C 105 heading'],
    'SD0797': ['D&C 111 heading'],
    'SD0798': ['D&C 100 heading'],
    'SD0799': ['D&C 124:22–24, 56–83'],
    'SD0800': ['D&C 125:3'],
    'SD0801': ['D&C 107:45'],
    'SD0802': ['D&C 117:8'],
    'SD0803': secs('52,56,66,75'),
    'SD0804': ['D&C 76:11–24, 50–119'],
    'SD0805': ['D&C 78 heading', 'D&C 82:11–18'],
    'SD0806': ['D&C 102'],
    'SD0807': ['D&C 103', 'D&C 105'],
    'SD0808': ['D&C 109', 'D&C 110'],
    'SD0809': ['D&C 124'],
    'SD0810': ['D&C 132'],
    'SD0811': ['D&C 60:5–10', 'D&C 61:23–35'],
    'SD0812': ['D&C 84:112–117'],
    'SD0813': ['D&C 111 heading'],
    'SD0814': ['D&C 124:88'],
    'SD0815': ['D&C 136:1–16'],
    'SD0816': ['D&C 57:1–3', 'D&C 97:21', 'D&C 101:17–21'],
    'SD0817': ['D&C 84:6–17', 'D&C 107:39–57', 'Genesis 5'],
    'SD0818': ['D&C 89:1–21'],
    'SD0819': ['D&C 132:51–65', 'Jacob 2:23–30', 'Official Declaration 1'],
    'SD0820': ['Official Declaration 1', 'Official Declaration 2'],
    'SD0821': ['D&C 76:11–24'],
    'SD0822': ['D&C 110 heading, 11–16'],
    'SD0823': ['D&C 25:1–5', 'D&C 132:51–56'],
    'SD0824': ['D&C 135:1–3', 'D&C 124:91–96'],
    'SD0825': ['D&C 138:53'],
    'SD0826': ['D&C 137:5–6'],
    'SD0827': ['D&C 99 heading, 6'],
    'SD0828': ['D&C 112:16–21, 30'],
    'SD0829': secs('3,5–10,17,19'),
    'SD0830': secs('20–22,26–28,42–47,102,107'),
    'SD0831': secs('30–40,52–56,66,75,79–80,99,114,118'),
    'SD0832': secs('37–38,48,51,57–64,78,82–85,97,101,104–105,115–125'),
    'SD0833': secs('29,46,50,58,88,93,129–131'),
    'SD0834': secs('45,65,76–77,86–88,98,101,133'),
    'SD0835': secs('7,35,45,47,67–74,85,91,102,121–128,134–138'),
    'SD0836': secs('84,88,94–97,109–110,115,124,127–128'),
    'SD0837': secs('25,68,75,83,90,93,99,126,136'),
    'SD0838': secs('98,101,103,105,121–123,134–135'),
    'SD0839': ['D&C 134:1–12'],
    'SD0840': ['D&C 87:1–8'],
    'SD0841': ['D&C 127', 'D&C 128'],
    'SD0842': ['D&C 130', 'D&C 131'],
    'SD0843': ['D&C 138:29–60'],
    'SD0844': ['D&C 4 heading', 'D&C 11 heading, 1', 'D&C 23:4'],
    'SD0845': ['D&C 6 heading', 'D&C 35 heading, 20', 'D&C 47:1–4'],
    'SD0846': ['D&C 17:1–9'],
    'SD0847': ['D&C 34 heading', 'D&C 106 heading'],
    'SD0848': ['D&C 41:9', 'D&C 53:4', 'D&C 72:8'],
    'SD0849': ['D&C 81 heading'],
    'SD0850': ['D&C 59 heading', 'D&C 99 heading'],
    'SD0851': ['D&C 52:22–40'],
    'SD0852': ['D&C 56:5–8', 'D&C 66:7–8', 'D&C 75:6–9'],
    'SD0853': ['D&C 75:13–36'],
    'SD0854': ['D&C 82:11–18', 'D&C 104'],
    'SD0855': ['D&C 124:91–96, 127'],
    'SD0856': ['D&C 136:12–14'],
    'SD0857': ['Official Declaration 2', 'Official Declaration 1'],
    'SD0858': ['D&C 107:41–52'],
    'SD0859': ['D&C 84:6–13'],
}.items()}

CHILDREN = {}

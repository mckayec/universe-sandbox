# Builder display copy for supplementary SC45 (coverage-dc.md "Complete disposition matrix": the 140 section
# dossiers DD001–DD138, DDO1 and DDO2). One `DCM-ddNNN-` card per dossier row, a cited reference for one section:
# its dated setting, named participants and atlas findings from that section's coverage-ledger row (coverage-dc.md
# "Coverage ledger"), then the ledger's exclusion or precision boundary as a plain sentence. Nothing is added from
# memory. A dossier is a document view, not a new event, place or person; no point or date field is drawn.
#
# "See also" names the existing cards the matrix row reuses (DX explanatory, DR relationship, DE event and DP place
# cards), by their displayed titles. Place settings without their own card (DP13+, P12, RP01) are named in the text
# as the ledger names them. "Named roles retained in DD" is honoured by naming every person the ledger row names.
#
# Built in checkpoints: DD001–DD070 (checkpoint 18); DD071–DD138, DDO1–DDO2 (checkpoint 19, copy_dd2.py).

import re

from copy_dc import P, S
from copy_dd2 import DOSSIERS_2

# matrix id -> the existing card's displayed title (keys DCM-<id>-...), written out so the copy reads as text;
# build.py checks each against the pack.
TITLES = {
    'DP01': 'Hiram, Ohio',
    'DP03': 'Independence as Zion’s center place',
    'DE01': 'Missionary assignments revised',
    'DX01': 'Meanings of Zion',
    'DX02': 'Priesthood genealogies',
    'DX06': 'The Book of Mormon in the revelations',
    'DX07': 'Offices, ordinances and discipline',
    'DX08': 'Calls to preach',
    'DX09': 'Gathering, land and consecration',
    'DX10': 'Prayer, spiritual gifts and agency',
    'DX11': 'Prophecy, vision and parable',
    'DX12': 'Bible revision, publication and records',
    'DX14': 'Family care, education and the poor',
    'DR03': 'Joseph Smith and Emma: spouses',
    'DR09': 'Joseph Smith Sr., Joseph Jr. and Hyrum',
    'DR10': 'Scribes and recorder',
    'DR11': 'Prospective witnesses of the plates',
    'DR12': 'The Pratt and Cowdery brothers',
    'DR13': 'Bishops and the bishop’s agent',
    'DR15': 'The Knight and Murdock couples',
    'DR16': 'Mission companions in section 52',
    'DR17': 'Revised companion assignments',
    'DP02': 'Amherst, Ohio',
    'DP04': 'Far West',
    'DP05': 'Adam-ondi-Ahman',
    'DP06': 'Fishing River camp region',
    'DP07': 'Salem, Massachusetts',
    'DP08': 'Perrysburg, New York',
    'DP09': 'Nauvoo House',
    'DP10': 'Zarahemla, Iowa',
    'DP11': 'Shedolamak',
    'DP12': 'Olaha Shinehah',
    'DE02': 'A shared vision of kingdoms of glory',
    'DE03': 'The United Firm',
    'DE04': 'High council rules for hearing disputes',
    'DE05': 'Zion’s Camp organized; its objective deferred',
    'DE06': 'Kirtland Temple: dedication and reported vision',
    'DE06b': 'Vision in the Kirtland Temple',
    'DE07': 'Nauvoo building and leadership instructions',
    'DE08': 'Eternal and plural marriage teachings recorded',
    'DE09': 'Deaths at Carthage',
    'DE16': 'Whitney appointed bishop',
    'DE17': 'Revelation publication assigned',
    'DE18': 'Presidency counselor changed',
    'DE19': 'School of the Prophets instructed',
    'DE20': 'Word of Wisdom recorded',
    'DE21': 'Kirtland building instructions',
    'DE22': 'Far West temple directed',
    'DE23': 'Kirtland obligations and new assignments',
    'DE24': 'Tithing and its administration instructed',
    'DE25': 'Ramus instructions',
    'DE26': 'Government declaration adopted',
    'DE27': 'Proxy-baptism records instructed',
    'DE28': 'Manifesto issued and explained',
    'DJ02': 'Whitney sent to warn eastern cities',
    'DJ03': 'The Salem investigation',
    'DJ04': 'Law’s regional preaching assignment',
    'DJ05': 'Westward companies prepare mutual support',
    'DX03': 'The Word of Wisdom (1833)',
    'DX04': 'Consent and command in section 132',
    'DX05': 'The Official Declarations: announcement and acceptance',
    'DX13': 'Temple instructions',
    'DX15': 'Persecution, redress and authority',
    'DX16': 'Section 134 on civil government',
    'DX17': 'Section 87: a prophecy of war',
    'DX18': 'Proxy baptism, witnesses and records',
    'DX19': 'Sections 130 and 131',
    'DX20': 'Section 138: messengers to the dead',
    'DR01': 'Joseph Smith and Sidney Rigdon: joint vision witnesses',
    'DR02': 'Joseph Smith and Oliver Cowdery: joint Kirtland vision witnesses',
    'DR04': 'Joseph and Hyrum Smith: brothers with distinct offices',
    'DR05': 'Joseph F. Smith, son of Hyrum',
    'DR06': 'Joseph Smith and his brother Alvin',
    'DR07': 'John Murdock and Julia Clapp',
    'DR08': 'The Presidency, Marsh and the Twelve (1837)',
    'DR14': 'Jesse Gause and Frederick G. Williams',
    'DR18': 'Mission companions in section 75',
    'DR19': 'Members of the United Firm',
    'DR20': 'Offices named in section 124',
    'DR21': 'Organizers of the westward companies',
    'DR22': 'Signatories and the motion to accept',
    'DR23': 'Ordinations in section 107',
    'DR24': 'The priesthood line in section 84',
}

# SD id: (section, slug, title, text, see-also ids)
DOSSIERS = [
    (1, 'preface', 'Preface to the published revelations',
     'Dated November 1, 1831, at Hiram, Ohio, in the context of a conference about publishing the revelations; '
     'Joseph Smith and assembled elders. The section is the preface to the published revelations: a worldwide '
     'proclamation, with Babylon and Idumea used as symbols. The apocalyptic Babylon is not mapped to an itinerary, '
     'and the Second Coming is not dated.', ['DP01', 'DX11', 'DX12']),
    (2, 'elijah', 'Elijah and the hearts of the children',
     'Dated September 21, 1823, at the Smith log home at Palmyra, New York, per the current heading; Joseph Smith and '
     'Moroni. The Elijah motif of turning the hearts of fathers and children is linked to later temple-key '
     'narratives. The section is an extract from a retrospective history, not a document written on the visitation '
     'date; no celestial coordinates are given.', ['DX11']),
    (3, 'lost-pages', 'The lost manuscript pages',
     'Dated July 1828 at Harmony, Pennsylvania; Joseph Smith and Martin Harris. It concerns the loss of 116 '
     'manuscript pages and the interrupted translation, and the text identifies several Book of Mormon peoples. No '
     'physical location is given for the missing manuscript, and no modern tribal ancestry is inferred from these '
     'names.', ['DX06', 'DX12']),
    (4, 'joseph-smith-sr', 'A call to service for Joseph Smith Sr.',
     'Dated February 1829 at Harmony. Joseph Smith Sr. receives instruction on service through his son, with '
     'qualifications for ministry. The harvest and the field are teaching metaphors, not farms or travel legs.',
     ['DX10', 'DX14', 'DR09']),
    (5, 'martin-harris-witness', 'Martin Harris asks for a witness',
     'Dated March 1829 at Harmony. Martin Harris asks for a witness; the section speaks of three future witnesses, '
     'with conditional participation, and gives translation instructions. The prediction and conditional promise are '
     'not themselves the later witnessing event, and Jerusalem appears only as a comparison with the past.',
     ['DX06']),
    (6, 'oliver-cowdery-scribe', 'Oliver Cowdery begins as scribe',
     'Dated April 1829 at Harmony; the heading says the scribal work began on April 7. Joseph Smith and Oliver '
     'Cowdery: mutual support, the work of scribe and translator, and an inward spiritual witness. No route or '
     'surveyed location is added beyond the document’s setting.', ['DX06', 'DR10']),
    (7, 'john-ministry', 'John’s desired ministry',
     'Dated April 1829 at Harmony. A revealed translation account in which the Lord speaks with John and then '
     'addresses Peter, explaining John’s desired ministry. The ancient narrated scene is not dated to April 1829, and '
     'no geographic itinerary is given for the translated John.', ['DX06', 'DX11', 'DX12']),
    (8, 'cowdery-gifts', 'Oliver Cowdery’s gifts',
     'Dated April 1829 at Harmony. Oliver Cowdery’s gifts and his request to translate; revelation is described as '
     'communication to the mind and heart. The reference to Moses and the Red Sea is an explanatory comparison, not a '
     'nineteenth-century journey.', ['DX06', 'DX10']),
    (9, 'cowdery-continue-writing', 'Cowdery directed to continue writing',
     'Dated April 1829 at Harmony. After an attempt to translate, Oliver Cowdery is directed to continue writing for '
     'Joseph Smith; the section describes a process of study and decision. No coordinates or exact date for the '
     'attempt are given beyond the month.', ['DX06', 'DX10', 'DR10']),
    (10, 'lost-manuscript-response', 'Response to the lost manuscript',
     'Probably dated around April 1829 at Harmony, though portions may date to summer 1828. A response to the lost '
     'manuscript: the instruction to translate Nephi’s record through the account of Benjamin, a relationship between '
     'the texts produced. The whole section is not treated as one precisely dated revelation, and the alleged '
     'alterers of the manuscript are not identified without evidence.', ['DX06', 'DX12']),
    (11, 'hyrum-prepare', 'Hyrum Smith told to prepare',
     'Dated May 1829 at Harmony, after the restoration of the Aaronic Priesthood as the heading suggests. Hyrum Smith, '
     'Joseph’s brother, is told to study and assist the translation before preaching publicly. A call to prepare is '
     'not proof that he had already left on a mission.', ['DX10', 'DX14', 'DR09']),
    (12, 'joseph-knight', 'Joseph Knight Sr.',
     'Dated May 1829 at Harmony. Joseph Knight Sr. gives material help to Joseph Smith and his scribe (heading); '
     'instructions on service and charity. The vineyard imagery does not identify a property.', ['DX10', 'DX14']),
    (13, 'aaronic-priesthood', 'The words of the Aaronic ordination',
     'Dated May 15, 1829, near Harmony. The reported ordination of Joseph Smith and Oliver Cowdery by John the '
     'Baptist, shown at the existing Harmony / Priesthood Restoration Site. No exact point in the forest is added, '
     'and the section does not date the visitation of Peter, James and John.', []),
    (14, 'david-whitmer', 'David Whitmer called',
     'Dated June 1829 at Fayette, in the Whitmer household: the household of Peter Whitmer Sr. hosts the translation. '
     'David Whitmer is promised a witness and a ministry; the heading notes he later became one of the Three '
     'Witnesses. Zion here is a religious cause, not an established Missouri site in June 1829.', ['DX06']),
    (15, 'john-whitmer', 'John Whitmer called',
     'Dated June 1829 at Fayette. John Whitmer is called to a ministry of repentance; the heading notes he later '
     'became one of the Eight Witnesses. That section 16 uses the same wording does not merge John with Peter '
     'Whitmer Jr., and no separate travel route is given.', ['DX06']),
    (16, 'peter-whitmer-jr', 'Peter Whitmer Jr. called',
     'Dated June 1829 at Fayette. Peter Whitmer Jr. receives instruction for ministry; the heading notes he later '
     'became one of the Eight Witnesses. He stays a separate recipient from section 15, and no map feature is added.',
     ['DX06']),
    (17, 'three-witnesses', 'Before the witnesses view the plates',
     'Dated June 1829 at Fayette, before the witnesses viewed the plates. Oliver Cowdery, David Whitmer and Martin '
     'Harris are told of a conditional witnessing of the plates and other objects; the text links them to Laban, the '
     'brother of Jared and Lehi. This is not a catalogue of recovered artifacts or independent evidence of ancient '
     'origin.', ['DX06', 'DR11']),
    (18, 'twelve-envisioned', 'The Twelve envisioned',
     'Dated June 1829 at Fayette. Joseph Smith, Oliver Cowdery and David Whitmer: a future Twelve is envisioned, with '
     'Cowdery and Whitmer to seek them out, and the worth of souls is taught. The actual organization of the Twelve '
     'is not dated to 1829; the later fulfillment is kept distinct.', ['DX07']),
    (19, 'martin-harris-printing', 'Martin Harris and the cost of printing',
     'Probably dated summer 1829 at Manchester. Martin Harris is told to finance the printing with his property; the '
     'section speaks of repentance and Christ’s suffering, in the context of the book’s publication. The older March '
     '1830 dating is not kept as certain, and the passage on suffering is theological testimony, not a '
     'nineteenth-century occurrence.', ['DX06']),
    (20, 'articles-and-covenants', 'The Articles and Covenants',
     'Composed over 1829–1830 at or near Fayette, and probably recorded after April 6, 1830. Joseph Smith is named '
     'first elder and Oliver Cowdery second; the section sets out church organization, officers, baptism, the '
     'sacrament and membership. April 6, 1830 is not used as a secure birth date for Jesus or as the date of every '
     'part of the text.', ['DX07']),
    (21, 'organization', 'The church organized',
     'Dated April 6, 1830, at the Peter Whitmer Sr. home in Fayette, at the organization meeting. Joseph Smith and '
     'Oliver Cowdery are sustained and ordain each other; instructions on records and leadership. The six founding '
     'participants are not necessarily everyone who attended.', ['DX07']),
    (22, 'baptism-authority', 'Baptism and authority',
     'Dated April 16, 1830, at Manchester, amid a controversy over baptism and authority; instruction on the new '
     'covenant. No journey is added, and the section is a doctrinal description rather than a historical claim that '
     'all earlier Christian baptism was invalid.', ['DX07']),
    (23, 'five-revelations', 'Five revelations at Manchester',
     'Dated April 1830 at Manchester. Five revelations to Oliver Cowdery, Hyrum Smith, Samuel H. Smith, Joseph Smith '
     'Sr. and Joseph Knight, each with a different ministry responsibility. The five recipients are not collapsed '
     'into one missionary event.', ['DX07', 'DR09']),
    (24, 'smith-cowdery-duties', 'Duties of Smith and Cowdery',
     'Dated July 1830 at Harmony. The duties of Joseph Smith and Oliver Cowdery, with ministry directed at '
     'Colesville, Fayette and Manchester. The commanded circuit is not a proven completed itinerary.', ['DX08']),
    (25, 'emma-smith', 'Emma Smith’s assignments',
     'Dated July 1830 at Harmony. Emma Smith, Joseph’s wife, is to act as scribe, expound scripture and select '
     'hymns: a religious relationship and a record of women’s participation. She is not merely an entry as a '
     'supporting wife; her named assignments are kept.', ['DX12', 'DX14', 'DR03']),
    (26, 'common-consent', 'Common consent',
     'Dated July 1830 at Harmony. Joseph Smith, Oliver Cowdery and John Whitmer: ministry at Colesville, farming, the '
     'next conference to the west, and common consent. No conference venue is inferred from the westward direction '
     'alone.', ['DX07']),
    (27, 'sacrament-gathering', 'The sacrament and a future gathering',
     'Dated August 1830, with a second stage in September, at Harmony; the heading describes the two-stage writing. '
     'The emblems of the sacrament, an anticipated gathering with Moroni and other sacred figures, and a genealogy of '
     'priesthood keys. The future sacramental assembly is not an 1830 travel event, and the text’s writing history '
     'is kept apart from the experience it reports.', ['DX07', 'DX11', 'DX02']),
    (28, 'hiram-page', 'Competing revelation claims',
     'Dated September 1830 at Fayette. Oliver Cowdery, Hiram Page and Joseph Smith: competing claims to revelation; a '
     'proposed mission among those the text calls Lamanites; a future Zion near their borders. The attribution of '
     'deception is the text’s judgment, and no surveyed Zion site exists yet.', ['DX07']),
    (29, 'millennium', 'Gathering, Millennium and resurrection',
     'Dated September 1830 at Fayette, before the conference of September 26; six elders present. Gathering, the '
     'Millennium, resurrection, agency and the Fall, and the redemption of children. The apocalyptic sequence is not '
     'given calendar years or drawn as disaster areas.', ['DX10', 'DX11']),
    (30, 'whitmer-brothers', 'Three Whitmers called',
     'Dated September 1830 at Fayette after the conference; three revelations combined in 1835. David, Peter Jr. and '
     'John Whitmer: Peter is to go with Oliver Cowdery, and David is at his father’s house. John is directed to Philip '
     'Burroughs’ and the surrounding region (verse 10). Religious use of “brother” is not proof of biological '
     'kinship, and the 1835 editorial combination is not the date of the missionary departure.', ['DX08']),
    (31, 'thomas-marsh', 'Thomas B. Marsh called',
     'Dated September 1830, following the conference; the heading does not specify the venue. Thomas B. Marsh is '
     'called to preach, with his family obligations and the prospect of their unity. The promise about his family is '
     'not evidence that each family member later converted.', ['DX08', 'DX14']),
    (32, 'western-mission', 'Pratt and Peterson join the western mission',
     'Dated early October 1830 at Manchester. Parley P. Pratt and Ziba Peterson join Oliver Cowdery and Peter Whitmer '
     'Jr. on the mission to the people the text calls Lamanites. The proposed mission’s western endpoints are '
     'unresolved. The historical term is kept with attribution and is not a genetic identification of all Indigenous '
     'peoples.', ['DX08']),
    (33, 'thayre-sweet', 'Ezra Thayre and Northrop Sweet called',
     'Dated October 1830 at Fayette. Ezra Thayre and Northrop Sweet are called to proclaim the gospel, with gathering '
     'and preparation. Nephi’s departure from Jerusalem is a scriptural comparison (verse 8), not their route; the '
     'vineyard and the eleventh hour are metaphors, not sites or clock times.', ['DX08']),
    (34, 'orson-pratt', 'Orson Pratt called',
     'Dated November 4, 1830, at the Whitmer home in Fayette. Orson Pratt, younger brother of Parley, is called to '
     'baptism, preaching and prophecy. The heading dates his conversion relative to the revelation; no exact baptism '
     'day is inferred here.', ['DX08', 'DR12']),
    (35, 'sidney-rigdon-scribe', 'Sidney Rigdon as scribe',
     'Dated December 7, 1830, at or near Fayette. Sidney Rigdon takes the scribal role in the Bible revision; he and '
     'Edward Partridge have arrived from Ohio; Oliver Cowdery and John Whitmer were earlier scribes. The “translation” '
     'of the Bible here is Joseph Smith’s revision project, not the discovery of an ancient manuscript.',
     ['DX08', 'DX12', 'DR10']),
    (36, 'edward-partridge', 'Edward Partridge called',
     'Dated December 9, 1830, near Fayette. Edward Partridge is called to preach; verse 2 promises that the Lord will '
     'lay his hand on him through Sidney Rigdon and that he will receive the Holy Ghost. The section gives priesthood '
     'and mission instructions. No travel path is added, and the wording of ordination or confirmation '
     'follows the text rather than an inferred office.', ['DX08']),
    (37, 'pause-translation', 'Translation paused; Ohio ahead',
     'Dated December 1830 near Fayette. Joseph Smith and Sidney Rigdon are to pause the translation, strengthen the '
     'church at Colesville and then gather in Ohio, timed by Oliver Cowdery’s return. The directive documents an '
     'intended migration, not a completed arrival.', ['DX08', 'DX09', 'DX12']),
    (38, 'fayette-conference', 'The Fayette conference of January 1831',
     'Dated January 2, 1831, at a conference in Fayette. Gathering in Ohio, care for the poor, a promised endowment of '
     'power, unity and a future land of inheritance, with a reference to Enoch’s Zion. The promised land is not mapped '
     'from this section alone, and the future wars are not given a computed year.', ['DX08', 'DX09']),
    (39, 'james-covel', 'James Covel instructed',
     'Dated January 5, 1831, at Fayette. James Covel, a long-serving Methodist minister according to the current '
     'heading, is told to accept baptism and preach. Ohio is the commanded destination, explicitly not the eastern '
     'countries (verse 14). The older identification as Covill, a Baptist, is not repeated without documentary '
     'explanation.', ['DX08']),
    (40, 'covel-rejection', 'Covel’s rejection explained',
     'Dated January 6, 1831, at Fayette. Joseph Smith and Sidney Rigdon receive an account explaining why James Covel '
     'rejected the instruction. This is the text’s attributed explanation of motives, not independent psychological '
     'evidence.', ['DX08']),
    (41, 'first-bishop', 'Partridge named first bishop',
     'Dated February 4, 1831, at Kirtland. Joseph Smith has arrived from New York; Leman Copley offers land at Thompson; '
     'Edward Partridge is named the first bishop; housing and support for the translation. Kirtland and Thompson are '
     'kept distinct, and the appointment is not a later organizational chart of bishoprics.', ['DX07', 'DR13']),
    (42, 'law-of-the-church', 'The law of the church',
     'Dated February 9 and 23, 1831, at Kirtland: verses 1–72 and 73–93 belong to the two different dates. Church '
     'law: missionaries in pairs, consecration and property, care for the sick, discipline, and a promise of '
     'information about the New Jerusalem. Civil and criminal cases, and private and public reconciliation, are '
     'distinguished (74–93). No New Jerusalem location is inferred here.', ['DX07', 'DX10']),
    (43, 'revelation-authority', 'Who receives revelation for the church',
     'Dated February 1831 at Kirtland. The authority to receive revelation for the church, disputed claims to it, the '
     'elders’ proclamation and teaching about the Millennium. No historical date is given for the Millennium, and no '
     'map of natural disasters is drawn.', ['DX07']),
    (44, 'summon-conference', 'A conference summoned',
     'Dated late February 1831 at Kirtland. Joseph Smith and Sidney Rigdon are told to summon a conference; legal '
     'organization and relief for the poor. The instruction and the June meeting are separate entries in the '
     'chronology.', ['DX07']),
    (45, 'mount-of-olives', 'The Mount of Olives discourse',
     'Dated March 7, 1831, at Kirtland. The discourse on the Mount of Olives and a future appearance; Enoch; the '
     'revision of the New Testament; gathering and the New Jerusalem as a refuge. The past discourse, the future '
     'prophecy and the 1831 writing are kept apart, and no predicted event is dated.', ['DX11', 'DX12', 'DX01']),
    (46, 'spiritual-gifts', 'Meetings and spiritual gifts',
     'Dated March 8, 1831, at Kirtland. Access to meetings for those seeking truth, spiritual gifts and discernment. '
     'A reference entry, not a geographic journey.', ['DX07', 'DX10']),
    (47, 'historian', 'John Whitmer as historian',
     'Dated March 8, 1831, at Kirtland. John Whitmer replaces Oliver Cowdery as historian and recorder, continuing '
     'the documentary record. No route is added, and the mandate to keep records is kept distinct from the records '
     'that actually survive.', ['DX07', 'DX12', 'DR10']),
    (48, 'eastern-migration', 'Migration into Ohio',
     'Dated March 10, 1831, at Kirtland. Migration from the East into Ohio; sharing and buying land, and a future '
     'city. An instruction to buy is not evidence that a named parcel was bought.', ['DX09']),
    (49, 'shakers', 'The mission to the Shakers',
     'Dated May 7, 1831, at Kirtland; the heading places the Shaker community near Cleveland, and its exact site is '
     'unresolved. Sidney Rigdon, Parley P. Pratt, Leman Copley and the Shakers: marriage, baptism, diet and a '
     'disagreement about the Second Coming. The section’s polemical description is not a complete independent '
     'history of the Shakers.', ['DX08']),
    (50, 'discerning-spirits', 'Discerning spiritual manifestations',
     'Dated May 9, 1831, at Kirtland. Spiritual manifestations are evaluated; preacher and hearer understand each '
     'other and are edified. Joseph Wakefield and Parley P. Pratt are to strengthen the churches, John Corrill is '
     'also called, and Edward Partridge is rebuked (37–39). Spiritual discernment is not mapped as a scientific '
     'classification of physical things.', ['DX07', 'DX10']),
    (51, 'thompson-stewardships', 'Stewardships at Thompson',
     'Dated May 20, 1831, at Thompson. Edward Partridge organizes properties, stewardships and a storehouse; Ohio is '
     'a temporary gathering place. Stewardships are not plotted without deeds, and Ohio is not implied to be a '
     'permanent endpoint.', ['DX09', 'DR13']),
    (52, 'missouri-companions', 'Companions sent to Missouri',
     'Dated June 6, 1831, at a conference in Kirtland, directing a gathering in Missouri. Assignments include: Joseph '
     'Smith and '
     'Sidney Rigdon; Lyman Wight and John Corrill; John Murdock and Hyrum Smith, by way of Detroit; Thomas B. Marsh and '
     'Ezra Thayre; Isaac Morley and Ezra Booth; Edward Partridge and Martin Harris to travel with Joseph Smith and Sidney '
     'Rigdon as one party; David Whitmer and '
     'Harvey Whitlock; the Pratt brothers; Solomon Hancock and Simeon Carter; Edson Fuller and Jacob Scott; Levi '
     'Hancock and Zebedee Coltrin; Reynolds Cahoon and Samuel H. Smith; Wheeler Baldwin and William Carter; Newel '
     'Knight and Selah J. Griffin. Joseph Wakefield and Solomon Humphrey are assigned east; Heman Basset is replaced by '
     'Simonds Ryder; Jared Carter and George James are ordained priests. The pairs and destinations are instructions, '
     'not completed itineraries, and section 56 revises the pairings.', ['DE01', 'DX08', 'DR16']),
    (53, 'sidney-gilbert', 'Sidney Gilbert as the bishop’s agent',
     'Dated June 8, 1831, at Kirtland. Algernon Sidney Gilbert is made an elder and the bishop’s agent, for temporal '
     'administration, and is to travel with Joseph Smith and Sidney Rigdon. He is not to be confused with Sidney '
     'Rigdon.', ['DX07', 'DX08', 'DR13']),
    (54, 'colesville-onward', 'The Colesville migrants directed onward',
     'Dated June 10, 1831, at Kirtland, addressed to the community at Thompson. The heading identifies Newel Knight as '
     'leader of the community at Thompson after Leman Copley’s farm agreement broke down. The revelation commands that '
     'community to leave the farm and journey to Missouri; it does not itself record their completed departure or '
     'arrival. This records a '
     'failed settlement arrangement, not an assumed permanent inheritance at Thompson.', ['DX08']),
    (55, 'phelps-printer', 'William W. Phelps, printer',
     'Dated June 14, 1831, at Kirtland. William W. Phelps, a printer: education and publication work and an '
     'assignment to Missouri. Phelps and Joseph Coe join Joseph Smith and Sidney Rigdon’s journey. The instruction to '
     'write schoolbooks does not identify a particular published edition.', ['DX08', 'DX12']),
    (56, 'companions-revised', 'Companions revised',
     'Dated June 15, 1831, at Kirtland. Thomas B. Marsh is now paired with Selah J. Griffin; Newel Knight remains to '
     'lead the Thompson group; Ezra Thayre’s assignment depends on his repentance. Obligations of the rich and the '
     'poor follow. The revoked instructions are superseded, not shown alongside as completed travel.',
     ['DE01', 'DX08', 'DR17']),
    (57, 'zion-center', 'Independence named as Zion’s center',
     'Dated July 20, 1831, in Jackson County, Missouri. Independence is identified as the center place of Zion and the '
     'place for a temple, which is distinct from the town; Sidney Gilbert’s store, William W. Phelps’s printing and '
     'Oliver Cowdery’s editing. The religious designation is not proof that the anticipated temple was built or that '
     'the whole county was bought.', ['DP03', 'DX09', 'DX12', 'DX01', 'DR13']),
    (58, 'land-of-zion', 'Gathering administration in Zion',
     'Dated August 1, 1831, in Jackson County, as the Colesville company arrives. Agency, repentance, the purchase of '
     'land and the administration of the gathering. Sidney Rigdon is to describe and dedicate the land and the temple '
     'spot; Joseph Smith, Rigdon and Oliver Cowdery are to return; Ziba Peterson’s office is removed pending his '
     'repentance. The promises and instructions to buy are not a completed land survey.', ['DX09', 'DX10']),
    (59, 'polly-knight', 'Polly Knight and the Sabbath',
     'Dated August 7, 1831, in Jackson County. Polly Knight, wife of Joseph Knight Sr., has died (the date is from the '
     'heading); the dedication of the land and temple spot precedes the revelation; the Sabbath and fasting. No burial '
     'location or historic site boundary is inferred.', ['DX09', 'DX14', 'DR15']),
    (60, 'return-east', 'Directions for the return east',
     'Dated August 8, 1831, at Independence. The returning elders are directed to St. Louis; Joseph Smith, Sidney '
     'Rigdon and Oliver Cowdery are to go on to Cincinnati; the others are to preach on their way home in pairs. '
     'Edward Partridge is directed to supply travel money, to be repaid as they are able. Permission for transport is not a confirmed '
     'route.', ['DP03', 'DX08', 'DX09']),
    (61, 'mcilwaines-bend', 'On the Missouri River at McIlwaine’s Bend',
     'Dated August 12, 1831, at McIlwaine’s Bend on the Missouri River. Joseph Smith and ten elders are returning by '
     'canoe toward Kirtland; William W. Phelps reports a vision; the travel is reorganized. Smith, Sidney Rigdon and '
     'Oliver Cowdery are directed toward Cincinnati, avoiding the water except by canal; Reynolds Cahoon and Samuel H. '
     'Smith must stay together. The vision is not generalized into a scientific claim about hazards, and no modern '
     'location is invented for the changed river bend.', ['DX08', 'DX09']),
    (62, 'chariton', 'Meeting at Chariton',
     'Dated August 13, 1831, on the Missouri River at Chariton. The returning Smith party meets elders traveling '
     'toward Zion; discretion about transport and preaching. The parties moving in opposite directions remain '
     'distinct, with no single merged route.', ['DX08', 'DX09']),
    (63, 'return-to-kirtland', 'Back in Kirtland',
     'Dated August 30, 1831, at Kirtland; the heading gives the return as August 27. Joseph Smith, Sidney Rigdon and '
     'Oliver Cowdery have returned: purchases in Zion, warning and faith, the resurrection. Titus Billings is to '
     'dispose of his farm to travel to Zion the next spring; Newel K. Whitney is to keep his store and act as agent; '
     'Rigdon is to rewrite his rejected description of the land; Smith and Rigdon are to find homes. The Mount of '
     'Transfiguration, mentioned in passing, is not located, and the prophesied wars are not dated.',
     ['DP03', 'DX09', 'DX12']),
    (64, 'forgiveness-debt', 'Forgiveness, debt and the five-year hold',
     'Dated September 11, 1831, at Kirtland. A move to Hiram for the Bible revision is planned, and a company is '
     'preparing to leave for Missouri in October; forgiveness and debt. Isaac Morley’s farm is to be sold but '
     'Frederick G. Williams’s farm kept; Kirtland is to be held for five years; the store of Newel K. Whitney and '
     'Sidney Gilbert is kept until the remaining disciples leave. The planned departures are not asserted as completed '
     'here, and “tithing” is not automatically the modern ten percent.', ['DX09']),
    (65, 'stone-of-daniel', 'A prayer and Daniel’s stone',
     'Dated October 30, 1831, at Hiram. A prayer for the kingdom of the gospel and a millennial union, with the motif '
     'of Daniel’s stone. The mountain and the rolling stone are not a route on the ground or a dated conquest of the '
     'world.', ['DP01', 'DX11']),
    (66, 'mclellin', 'William E. McLellin’s mission',
     'Dated October 29, 1831, at Hiram; section 66 precedes 65, so the order of sections does not give the date. '
     'William E. McLellin receives direction for a mission; the heading mentions his secret questions, which are not '
     'given here. He is to go east with Samuel H. Smith, not yet to Zion, and not to return until sent.',
     ['DP01', 'DE01', 'DX08', 'DR17']),
    (67, 'book-of-commandments', 'The Book of Commandments conference',
     'Dated early November 1831 at Hiram. A conference on publishing the Book of Commandments and a controversy over '
     'the language of the revelations; the heading mentions the press at Independence. The proposed print run is not '
     'the number of copies actually produced or surviving.', ['DP01', 'DX12']),
    (68, 'age-eight', 'Missionary words, bishops and parents',
     'Dated November 1, 1831, at Hiram, and expanded for the 1835 edition. Orson Hyde, Luke S. Johnson, Lyman E. '
     'Johnson and William E. McLellin: missionary words, bishops, and parents’ duty to teach. Oliver Cowdery is to '
     'carry the sayings to Zion; baptism at age eight. Not all the current wording is dated to 1831, and the claim of '
     'biological Aaronic descent remains doctrine.', ['DP01', 'DP03', 'DX08', 'DX12', 'DX14']),
    (69, 'manuscripts-to-zion', 'Manuscripts carried to Independence',
     'Dated November 11, 1831, at Hiram. Oliver Cowdery carries manuscripts and funds to Independence; John Whitmer '
     'goes with him and gathers historical records. A travel mandate, not a day-by-day route; it links the roles of '
     'publisher and recorder.', ['DP01', 'DP03', 'DX08', 'DX12']),
    (70, 'publication-stewards', 'Stewards of the revelations',
     'Dated November 12, 1831, at Hiram. Stewards of publication are appointed; spiritual labor and temporal equality. '
     'Section 70:1–5 names Joseph Smith Jr., Martin Harris, Oliver Cowdery, John Whitmer, Sidney Rigdon and William W. '
     'Phelps as stewards of the revelations and their publication. Stewardship is not merged with ownership of every '
     'manuscript.', ['DP01', 'DE17', 'DX12']),
]

COPY, EXTRA_SRC, CHILDREN = {}, {}, {}
# Official Declarations follow section 138 in the register: OD1 is SD1210, OD2 is SD1211.
OD_SD = {'OD1': 'SD1210', 'OD2': 'SD1211'}
for sec, slug, title, text, see in DOSSIERS + DOSSIERS_2:
    also = ''
    if see:
        also = ' See also: ' + ', '.join(f'“{TITLES[i]}”' for i in see) + '.'
    assert not re.search(r'\s{2}', text), sec
    if sec in OD_SD:
        n = sec[2]
        COPY[OD_SD[sec]] = (f'DCM-ddo{n}-{slug}', f'Official Declaration {n}: {title}',
                            P + f'Official Declaration {n}. ' + text + also)
        EXTRA_SRC[OD_SD[sec]] = [S(f'Official Declaration {n}')]
        continue
    sd = f'SD{1071 + sec:04d}'
    COPY[sd] = (f'DCM-dd{sec:03d}-{slug}', f'Section {sec}: {title}', P + f'Section {sec}. ' + text + also)
    EXTRA_SRC[sd] = [S(f'D&C {sec}')]

# Residual-96 full-read dispositions (checkpoint 63; HANDOFF_PLAN 2026-11-04 "Full-source decisions for all 96
# residual semantic chapters", "Explicit dispositions for the other 76 chapter keys").
#
# ChatGPT read every one of these chapters in full from the official English chapter bodies and compared them with the
# built copy, sources and dispositions. Each entry restates that decision as given (imperatives turned into the
# resulting decision); the builder spot-checked the repaired facts in the bcbooks/scriptures-json mirror. These are
# editorial decisions, not certified absence of every shared phrase. copy_bmc.OMIT is updated with them, so the keys
# leave the default-omission ledger. The 20 RES96-C01-C14 correction keys are not here.

_P = 'checkpoint 63 decision (RES96 full read of {0}): '

RES96_OMIT = {
    9: _P.format('1 Nephi 9') + (
        'Two-plate purposes; 9:1 recalls Lehi’s reporting context. No new Bible episode, duplicate vision or '
        'engraving date.'
    ),
    18: _P.format('1 Nephi 18') + (
        'Jerusalem seed provenance at 18:24 is represented by BE04/BJ01 (this replaces the earlier reason). No '
        'separate voyage; preserve namesakes.'
    ),
    54: _P.format('2 Nephi 32') + (
        'Christ doctrine, prayer and future manifestation. Matthew 7:7–8/Luke 18:1 are optional comparisons, not '
        'identified Gospel events; the earlier Zion range-spill reason is replaced.'
    ),
    55: _P.format('2 Nephi 33') + (
        'Jews/Israel and the words of Jews in a closing address. Narrow-gate comparison is optional; no visit to '
        'Zion or literal vision.'
    ),
    58: _P.format('Jacob 3') + (
        'Fidelity and anti-reviling instruction; David/Solomon belong to chapter 2. Preserve attribution and do '
        'not make ethnic judgments.'
    ),
    64: _P.format('Jarom 1') + (
        'Law of Moses/Sabbath at 1:5 and future Messiah at 1:11; retain BC03/SC04.2. General revelations are not '
        'separately narrated visions.'
    ),
    66: _P.format('Words of Mormon 1') + (
        'BC04 represents Mormon’s editorial record transfer. Benjamin’s prior reign remains separate; false '
        'Christs and Laban do not identify Gospel/Genesis people.'
    ),
    74: _P.format('Mosiah 8') + (
        '8:8’s hosts-of-Israel numerical simile is addressed explicitly: a comparison of number, not ancestry. '
        'General seer/interpreter teaching is not a new vision scene; no forced edge.'
    ),
    75: _P.format('Mosiah 9') + (
        'BXJ03 covers Zeniff’s expeditions. Unnamed fathers’ deliverance in 9:17 is not an identified Exodus; '
        'keep hostile descriptions attributed.'
    ),
    77: _P.format('Mosiah 11') + (
        'Noah is Zeniff’s son; towers/temple do not identify Babel/Solomon. Retain BXP03 and practice/narrative '
        'decision.'
    ),
    83: _P.format('Mosiah 17') + (
        'Book of Mormon king Noah and Abinadi’s execution; BC05 covers Alma’s records/escape. Attribute '
        'accusations; no identified Gospel trial.'
    ),
    85: _P.format('Mosiah 19') + (
        'Local Noah/Gideon; distinguish fleeing men, families and priests. No biblical judge identity or merged '
        'flight.'
    ),
    86: _P.format('Mosiah 20') + (
        'Judges 21:19–23 is a permissible abduction/dance comparison, not the same event or consent. No mandatory '
        'Bible link.'
    ),
    87: _P.format('Mosiah 21') + (
        'Ammon’s search and physical ruins/dry bones are not Ezekiel’s vision. Baptism is deferred; no duplicate '
        'earlier search.'
    ),
    88: _P.format('Mosiah 22') + (
        'BE09/BJ04/BXJ04 represent Limhi’s escape. Bondage/flight alone is not Egypt or Moses; preserve local '
        'namesakes.'
    ),
    89: _P.format('Mosiah 23') + (
        '23:23 invokes the God of Abraham/Isaac/Jacob, not their visit or pedigree (this replaces the earlier '
        'Noah-only reason). Galatians 5:1 comparison remains optional.'
    ),
    90: _P.format('Mosiah 24') + (
        '24:5 expressly says Mosaic law was not taught; spoken voices do not describe sight. Retain '
        'BE11/BJ05/BP08 and distinct Lamans.'
    ),
    96: _P.format('Alma 1') + (
        'Gideon is the local teacher. Attribute Nehor’s teaching; general charity/priestly practice does not '
        'require a Gospel scene.'
    ),
    97: _P.format('Alma 2') + (
        'Local river Sidon and valley named for the slain Gideon; BXP06/07/34 cover geography. No Phoenician city '
        'or Bible judge.'
    ),
    99: _P.format('Alma 4') + (
        'Prospective Christ/resurrection belief at 4:13–14 is recorded, not only institutions. No witnessed '
        'Gospel event or new Jesus person card.'
    ),
    101: _P.format('Alma 6') + (
        'Aaron is absent from this chapter, so the earlier range-spill reason is removed. BXJ05 covers '
        'Gideon/Sidon route; 6:8 is future teaching.'
    ),
    109: _P.format('Alma 14') + (
        'Acts 16 prison comparison is optional with different outcomes/victims. No one earthquake or named Bible '
        'book inferred from burned holy records.'
    ),
    110: _P.format('Alma 15') + (
        'BXP09/BXJ06 represent Zeezrom’s healing setting/travel. No identified Gospel healing or unsupported '
        'fate/travel for Amulek’s family.'
    ),
    112: _P.format('Alma 17') + (
        'Local Ammon/Ishmael; earlier angel recalled, not newly seen. Preserve fourteen-year frame and declined '
        'marriage offer; no Goliath identity.'
    ),
    115: _P.format('Alma 20') + (
        'BXJ07/BXP13 cover redirected travel; the voice is auditory. Genesis 4:10 blood comparison is optional, '
        'not Cain/Abel identity or new screen membership.'
    ),
    118: _P.format('Alma 23') + (
        'Conversion/proclamation, local Ishmael and BXP16/17. Generic revelation is not a new vision; no '
        'archaeological cities or modern ethnic genealogy.'
    ),
    119: _P.format('Alma 24') + (
        'The local Jerusalem distinction at 24:1 is recorded alongside Midian/Ishmael. Generic angel visits are '
        'not a described new vision; distinguish king and people.'
    ),
    120: _P.format('Alma 25') + (
        'Mosaic law as an unfulfilled type supporting faith in future Christ; keep the precise practice decision '
        'and avoid duplicate Ammonihah destruction.'
    ),
    122: _P.format('Alma 27') + (
        'BJ07/BP17 represent refuge and delegation separately. Missionaries treated as angels are a simile; '
        'resurrection hope is not a Gospel appearance.'
    ),
    126: _P.format('Alma 31') + (
        'Rejected Mosaic observance and opponent-attributed prayer are addressed explicitly. Luke 18/Matthew 6 '
        'comparisons are optional; Rameumptom remains a stand, not a city.'
    ),
    130: _P.format('Alma 35') + (
        'BXJ09 distinguishes refugees, hosts, military and missionaries. No single merged route or compulsory '
        'Gospel charity episode.'
    ),
    136: _P.format('Alma 41') + (
        'Restoration means resurrection/moral accountability, not nineteenth-century Restoration or geography. 1 '
        'Corinthians 15 comparison is optional; unnamed scriptures do not specify a book.'
    ),
    138: _P.format('Alma 43') + (
        'Local Sidon and BXP19/23 geography. No Bible war, new visual scene or modern battle map; keep separate '
        'army positions.'
    ),
    139: _P.format('Alma 44') + (
        'Continuation of the Sidon battle, not a Bible episode. Attribute opposing explanations; sea disposal '
        'does not map the river’s full course.'
    ),
    142: _P.format('Alma 47') + (
        'Local takeover, BXP24/25; Antipas is a mountain, not a Bible person. Keep unproved Onidah identity and '
        'conspirators’ false claims distinct.'
    ),
    143: _P.format('Alma 48') + (
        'Defensive narrative and religious service; Christian wording does not identify Antioch. No measured '
        'rampart or archaeological identification.'
    ),
    144: _P.format('Alma 49') + (
        'Noah is a local fortified city and Lehi its commander. Amalickiah is explicitly absent; no patriarch/ark '
        'identity or king at the battlefront.'
    ),
    145: _P.format('Alma 50') + (
        'Aaron is a local city; existing place/founding/pass cards suffice. Lehi’s promise is not a named Bible '
        'speech; no automatic Aaron/pass identity.'
    ),
    146: _P.format('Alma 51') + (
        'Local civil conflict/conquests; preserve BXP27/28/29 and the Nephihah wording tension in 51:25–26. No '
        'invented harmonizing recapture cycle.'
    ),
    147: _P.format('Alma 52') + (
        'Mulek is a city, Jacob a Zoramite commander; BXP29/SC02.1 suffice. Zedekiah descent belongs to Helaman '
        '8, not this battle.'
    ),
    148: _P.format('Alma 53') + (
        'Mulek is the city. Separate sons’ military covenant from parents’ oath and retain chapter 53’s frame '
        'versus Alma 56’s retrospective year 26.'
    ),
    150: _P.format('Alma 55') + (
        'BXP28 covers local Gid; Laman is a later man. Wine stratagem does not identify a Bible intoxication '
        'event or captain Gid.'
    ),
    151: _P.format('Alma 56') + (
        'Judea is the local city; BXP30/31/33 suffice. Figurative sons are not biological genealogy; preserve '
        'feigned destination and retrospective timing.'
    ),
    152: _P.format('Alma 57') + (
        'BXP32/33 cover western cities. Survival is specific to wounded youths, not all soldiers; prisoners do '
        'not all reach Zarahemla.'
    ),
    153: _P.format('Alma 58') + (
        'Assurance/peace is not a seen appearance. Galatians 5:1 comparison is optional; no completed Zarahemla '
        'stop or compass bearings from right/left.'
    ),
    154: _P.format('Alma 59') + (
        'Nephihah’s fall and Moroni’s assumptions are local narrative. Preserve Alma 51 tension and do not invent '
        'recapture or omniscient knowledge.'
    ),
    156: _P.format('Alma 61') + (
        'Local Gideon and corrective correspondence. Galatians 5:1 comparison is optional; preserve both '
        'viewpoints rather than deleting Moroni’s misunderstanding.'
    ),
    157: _P.format('Alma 62') + (
        'BE14/BJ08/BP13 cover campaign; Pahoran need not join every leg. No universal no-loss claim or later '
        'angel-Moroni identity.'
    ),
    158: _P.format('Alma 63') + (
        'Records, migration and shipbuilding are local narrative. Unknown ship fates remain unknown; no '
        'Polynesia, Noah identity or assertion Hagoth sailed each voyage.'
    ),
    159: _P.format('Helaman 1') + (
        'Local succession/invasion; Coriantumr descends from Zarahemla, not the last Jaredite king. Separate the '
        'Pahorans and intercepted Bountiful intention.'
    ),
    160: _P.format('Helaman 2') + (
        'Local assassination plot with unnamed servant/route. The editorial ending concerns the larger Nephi '
        'record, not only Helaman’s final chapter.'
    ),
    162: _P.format('Helaman 4') + (
        'Local loss/recovery and narrated moral interpretation. General revelations are not seen visions; one-day '
        'line is no measured isthmus.'
    ),
    167: _P.format('Helaman 9') + (
        'Murder investigation, confession and release remain distinct. Divine knowledge does not describe sight; '
        'popular claims that Nephi is a god are attributed.'
    ),
    168: _P.format('Helaman 10') + (
        'An audible commission/transport is acknowledged, not visual God/angels. Matthew 16:19 comparison is '
        'optional; no Peter identity, home interior or completed hypothetical destruction.'
    ),
    169: _P.format('Helaman 11') + (
        'Prayer for famine/rain permits James 5 comparison, not same Elijah/famine or paleoclimate. General daily '
        'revelations have no described visual content.'
    ),
    171: _P.format('Helaman 13') + (
        'BE16/BXJ11 retained; Mosaic practice and a reported angel-delivered message are part of this reason. No '
        'automatic seen angel or compulsory Matthew 23 event.'
    ),
    173: _P.format('Helaman 15') + (
        'Mosaic practice, Zenos and restoration teaching. Matthew 23–24/Hebrews 12 comparisons are optional; no '
        'extant Bible Zenos book or permanent ethnic moral class.'
    ),
    177: _P.format('3 Nephi 3') + (
        'BXJ12/BXE01 represent defensive gathering. General revelation is not a vision; distinguish hostile '
        'letter from narration and region from single city.'
    ),
    180: _P.format('3 Nephi 6') + (
        'Jacob is absent here, so the earlier Jacob range-spill reason is removed. Resettlement/judicial crisis '
        'and prospective Christ teaching retained; no new Gospel event or dated vision.'
    ),
    182: _P.format('3 Nephi 8') + (
        'BE17/BXE03 and places represent disaster/darkness, not a vision of it. Keep qualified calendar, storm '
        'versus darkness, and later appearance distinct.'
    ),
    206: _P.format('Mormon 1') + (
        'Mormon’s undescribed visitation at 1:15 is acknowledged, not textual absence. No automatic visual '
        'scene/date; Sidon and planned/completed retrieval distinctions retained.'
    ),
    207: _P.format('Mormon 2') + (
        'Exact chapter names: David/Joshua lands, king Aaron, Samuel the Lamanite and Shem (this replaces the '
        'earlier reason). Boaz/Jordan are later range spill; kingship is not exported to Moroni 9.'
    ),
    209: _P.format('Mormon 4') + (
        '4:12’s broad house-of-Israel wickedness comparison is acknowledged explicitly and a separate person/site '
        'edge is declined. Keep attribution, victims and retrieval stages.'
    ),
    211: _P.format('Mormon 6') + (
        'Gilgal is a commander at 6:14 (as BXR03 already says), not a city or valley. Ramah comes from separate '
        'Ether 15 alias support; no forced Pauline resurrection scene.'
    ),
    219: _P.format('Ether 5') + (
        'BXC04 covers future witnesses/sealed matter. Deuteronomy 19 comparison is optional; prospective showing '
        'is not completed vision or named modern witnesses.'
    ),
    221: _P.format('Ether 7') + (
        'Local Jaredite Noah, Nimrod and hill Ephraim; existing geography/family/dynasty cards suffice. '
        'Distinguish the Cohors; no biblical Exodus/metallurgy proof.'
    ),
    224: _P.format('Ether 10') + (
        'Aaron is a captive at 10:31 (son of Heth, who lived in captivity), not an unsupported king. Keep exact '
        'Jaredite roles and son/descendant distinctions; no Levite/King Saul/Moses identity.'
    ),
    225: _P.format('Ether 11') + (
        'Jaredite captive Seth and existing dynasty/genealogy coverage. Preserve Shiblom/Shiblon variants and the '
        'rejected 5/pgp target; no unnamed-usurper identity.'
    ),
    228: _P.format('Ether 14') + (
        'Gilead is Shared’s brother; Jared/Noah/Nimrod are range spill. Preserve separate armies and later Lib; '
        'collapse is not Coriantumr’s death.'
    ),
    229: _P.format('Ether 15') + (
        'Existing terminal-campaign/Ramah-Cumorah coverage suffices. Ether’s command is auditory and fate '
        'unresolved; no Jeremiah, New York or narrated translation.'
    ),
    230: _P.format('Moroni 1') + (
        'BC07/BXJ17/BXE08 cover survival, unknown wandering and writing. Allegiance to Christ is not a separate '
        'Gospel scene; no grave/date of death.'
    ),
    231: _P.format('Moroni 2') + (
        'BC08 covers retrospective instruction at the first appearance, not a new Moroni-era manifestation. Acts '
        '8 comparison is optional; no apostle identities.'
    ),
    232: _P.format('Moroni 3') + (
        'BC09 covers ordination practice. No named ordinands, temple venue, date or separate Bible ceremony is '
        'supplied.'
    ),
    233: _P.format('Moroni 4') + (
        'BC10 covers bread prayer. 1 Corinthians 11 comparison is optional, not a new Jerusalem supper or claimed '
        'quotation source.'
    ),
    234: _P.format('Moroni 5') + (
        'BC10 covers wine prayer. Preserve wine; modern water practice needs another source. No extra event, '
        'venue or journey.'
    ),
    235: _P.format('Moroni 6') + (
        'BC11/BXC06 cover baptism, care, meetings and discipline. Hebrews 12/Deuteronomy 19 comparisons are '
        'optional; disciplinary witnesses differ from Ether 5’s plate witnesses.'
    ),
}

assert len(RES96_OMIT) == 76

# Name-scan row whose default reason the full read corrects (copy_bmc.SCAN_ROW is updated with it).
RES96_SCAN_ROW = {
    ('BMC-207', 'Aaron'): 'Aaron the Lamanite king whom Mormon withstands (Mormon 2:9), not Moses’ brother, '
                          'Mosiah’s son or the city Aaron (checkpoint 63 RES96 decision)',
}

# Builder display copy for supplementary SC30–SC34 (Old Testament wisdom literature and the Twelve:
# coverage-ot-wisdom-prophets.md), one entry per SD row. Same rules as copy_ot.py and copy_mp.py: the accepted
# row text becomes reader sentences, constraints that tell a reader something are kept as plain distinctions,
# drawing-only constraints are honoured by drawing nothing, and nothing is added from memory.
# Built in checkpoints: SC30 and SC33 (checkpoint 9); SC31, SC32 and SC34 are not built yet.
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
        'Jonah': 'jonah', 'Micah': 'micah', 'Nahum': 'nahum', 'Zechariah': 'zech'}


def S(label):
    """'Daniel 8:2, 16' -> ('Daniel 8:2, 16', 'ot/dan/8')"""
    m = re.match(r'(.+?) (\d+)(?::.*)?$', label)
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
    'SD0721': ('OTW-p15-bathrabbim', 'Pools of Heshbon by Bathrabbim', P + 'The Song uses the pools at Heshbon by the gate of Bathrabbim in a poetic comparison. No surviving pool or gate is identified.'),
    'SD0722': ('OTW-p08-jerusalem-psalms', 'Jerusalem in the Psalms', P + 'Psalms portray Jerusalem as a place of worship, pilgrimage, lament and hoped-for restoration. The same city as Jerusalem in Samuel and Kings; the marker stays at the Old City.'),
    'SD0723': ('OTW-ap07-babylon-psalm-137', 'By the rivers of Babylon (Psalm 137)', P + 'Psalm 137 depicts captives grieving beside Babylon’s rivers while remembering Jerusalem. The scene is not placed at the Babylon marker.'),
    'SD0724': ('OTW-p07-bethlehem-micah', 'Bethlehem Ephratah (Micah)', P + 'Micah’s oracle names Bethlehem Ephratah as the origin of a future ruler in Israel. A prophecy about Bethlehem of Judah, not a second Bethlehem.'),
    'SD0725': ('OTW-p20-olives-zechariah', 'Mount of Olives in Zechariah', P + 'Zechariah’s prophecy names the Mount of Olives east of Jerusalem. The splitting it foretells belongs to the prophecy; the mountain’s present landform is not changed.'),
    'SD0726': ('OTW-p02-shechem-psalms', 'Shechem in Psalms 60 and 108', P + 'Psalms 60 and 108 include Shechem in a declaration of divine authority over the land. One place in a repeated poetic passage, not a second conquest. The same town as Shechem (Sichem).'),
    # SC33 five selected Joseph Smith Translation comparisons (links in the rows)
    'SD0758': ('OTW-c11-jst-psalm-11', 'Psalm 11 in the Joseph Smith Translation', P + 'The Joseph Smith Translation selection for Psalm 11 expands the scene into a future divine coming, flight toward the Lord’s mountain, judgment and redemption. A selected translation comparison, not the base text; the mountain is not located.'),
    'SD0759': ('OTW-c12-jst-psalm-14', 'Psalm 14 in the Joseph Smith Translation', P + 'The Joseph Smith Translation selection for Psalm 14 expands the critique of corrupt teachers and anticipates Zion’s establishment from heaven. A selected translation comparison; this Zion is not merged with any modern city.'),
    'SD0760': ('OTW-c13-jst-psalm-24', 'Psalm 24 in the Joseph Smith Translation', P + 'The Joseph Smith Translation selection for Psalm 24 addresses Jacob’s generations and describes the coming King establishing and redeeming his people. Shown alongside the KJV’s gate imagery; no literal road is drawn.'),
    'SD0761': ('OTW-c14-jst-psalm-109', 'Psalm 109 in the Joseph Smith Translation', P + 'The Joseph Smith Translation selection for Psalm 109 makes prayer for the speaker’s adversaries explicit. The KJV’s severe wishes against the adversaries remain in the base text.'),
    'SD0762': ('OTW-c15-jst-amos-7', 'Amos 7 in the Joseph Smith Translation', P + 'The Joseph Smith Translation selection for Amos 7 presents Jacob’s repentance and the withholding of total destruction. It stays separate from the KJV wording in which the Lord relents; one is not substituted for the other.'),
}

EXTRA_SRC = {k: [S(t) for t in v] for k, v in {
    'SD0707': ['Job 1:1'],
    'SD0708': ['Jonah 3', 'Nahum 1'],
    'SD0709': ['Jonah 1:3'],
    'SD0710': ['Jonah 1:3', 'Psalm 48', 'Psalm 72'],
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
}.items()}
CHILDREN = {}

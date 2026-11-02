# Typed See-also links from the accepted integration contract (integration-reconciliation.md on main: "Canonical keys
# and source gates", "Exact-slug collision audit" and "Typed links: binding resolutions").
#
# Every card stays a separate source view with its own work gate; nothing is merged and no gate moves. A link is a
# navigable See-also entry (PACK_FORMAT 20.5) with a short relation label. Only relations the contract binds are
# written, and only between cards that exist in the pack; where a contract end is a map pin, a route or not a codex
# card, it is listed in UNLINKED (ba07-integration.md) rather than linked. No identity is inferred from a name alone:
# every group below is a contract row whose cards already state the identity or relation in their own text.
#
# build.py merges these with copy_identity's person links (identity links first), writes them onto the cards
# (idempotent) and writes typed-links.csv.

# Same-entity source views: (contract row, relation label, [card keys]). Each card links to every other card of its
# group with the label.
SAME = [
    ('AP07 / babylon (collision audit)', 'same city',
     ['OTS-AP07-babylon', 'OTM-babylon', 'OTW-ap07-babylon-psalm-137']),
    ('bashan (collision audit)', 'same region', ['OTL-bashan', 'OTM-bashan']),
    ('P07 / bethlehem (collision audit)', 'same town',
     ['OTS-P07-bethlehem', 'OTL-bethlehem', 'OTM-bethlehem', 'OTW-p07-bethlehem-micah']),
    ('damascus (canonical row; collision audit)', 'same city',
     ['OHP-DAMASCUS', 'OTL-damascus', 'OTM-damascus', 'NTP-damascus']),
    ('P04 / egypt-region (canonical row; collision audit)', 'same land', ['OTS-P04-egypt', 'OTM-egypt-region']),
    ('P01 / haran (canonical row; collision audit)', 'same city', ['OTS-P01-haran', 'OTM-haran']),
    ('AP06 / jericho (canonical row; collision audit)', 'same city', ['OTS-AP06-jericho', 'OTL-jericho']),
    ('P08 / jerusalem (canonical row; collision audit)', 'same city',
     ['OTS-P08-jerusalem', 'OTM-jerusalem', 'OTW-p08-jerusalem-psalms']),
    ('lachish (collision audit)', 'same city', ['OHP-LACHISH', 'OTL-lachish', 'OTM-lachish']),
    ('lebanon (collision audit)', 'same region', ['OTL-lebanon', 'OTM-lebanon']),
    ('samaria city (canonical row; collision audit)', 'same city', ['OHP-SAMARIA', 'OTL-samaria', 'OTM-samaria']),
    ('seir (collision audit)', 'same region', ['OHP-SEIR', 'OTL-seir', 'OTM-seir']),
    ('sheba (collision audit)', 'same region', ['OHP-SHEBA', 'OTL-sheba', 'OTM-sheba']),
    ('P02 / shechem (canonical row; collision audit)', 'same city',
     ['OTS-P02-shechem', 'OTL-shechem', 'OTW-p02-shechem-psalms']),
    ('nineveh (canonical row)', 'same city', ['OHP-NINEVEH', 'OTM-nineveh', 'OTW-p02-nineveh']),
    ('joppa (canonical row)', 'same port', ['OTL-joppa', 'OTW-p03-joppa', 'NTP-joppa']),
    ('tarshish (canonical row)', 'same place name', ['OTM-tarshish', 'OTW-p04-tarshish-intended']),
    ('en-gedi (canonical row; typed link alias-of)', 'same place', ['OTL-en-gedi', 'OTM-en-gedi', 'OTW-p11-en-gedi-song']),
    ('shushan-narrative (canonical row)', 'same city', ['OTL-shushan-narrative', 'OTW-p06-shushan-vision']),
    ('tekoa (canonical row)', 'same town', ['OTL-tekoa', 'OTW-p09-tekoa']),
    ('jordan-river (canonical row)', 'same river', ['OHP-JORDAN', 'NTP-jordan']),
    # S25-C1: source views of one accepted concept in different works. The label says "in another account": each
    # card keeps its own wording and gate, and no identical landscape, modern location or pin is implied.
    ('eden-textual (canonical row; S25-C1)', 'Eden in another account', ['OH-P01', 'PP02']),
    ('nod-textual (canonical row; S25-C1)', 'Nod in another account', ['OH-P02', 'PP03']),
    ('P17 Enoch’s city (canonical row; S25-C1)', 'Enoch’s city in another account',
     ['P17-dc-enoch-city', 'P17-pgp-enoch-city']),
]

# Directed typed relations: (contract row, from card, label, to target, inverse label or None). A target starting
# "ev:" is a Chronicle event (the link opens it); events carry no links of their own, so they get no inverse.
TYPED = [
    ('AP06 jericho: city and plains are distinct settings', 'OTM-jericho', 'the city', 'OTS-AP06-jericho',
     'its plains'),
    ('MP zion-prophetic-jerusalem: epithet-of P08', 'OTM-zion-prophetic-jerusalem', 'epithet of', 'OTS-P08-jerusalem',
     'called Zion'),
    ('MP jeremiah-prison-court: contained-setting-of P08', 'OTM-jeremiah-prison-court', 'within',
     'OTS-P08-jerusalem', 'setting within it'),
    ('NTP-bethesda: contained-setting-of P08', 'NTP-bethesda', 'within', 'OTS-P08-jerusalem', 'feature within it'),
    ('NTP-siloam: contained-setting-of P08', 'NTP-siloam', 'within', 'OTS-P08-jerusalem', 'feature within it'),
    ('NTP-gabbatha: contained-setting-of P08', 'NTP-gabbatha', 'within', 'OTS-P08-jerusalem', 'feature within it'),
    ('NTP-samaria: region; city samaria related by context', 'NTP-samaria', 'the city', 'OHP-SAMARIA',
     'the region'),
    ('WP-E03 and WP-J02: same Daniel 1 source episode', 'OTW-e03-daniel-court-education', 'same Daniel 1 episode',
     'OTW-j02-captives-royal-service', 'same Daniel 1 episode'),
    ('DD109 describes E11', 'DCM-dd109-dedication-prayer', 'describes', 'ev:kirtland-dedication', None),
    ('DD110 describes DE06b', 'DCM-dd110-temple-vision', 'describes', 'DCM-de06b-kirtland-vision', 'described in'),
    ('DD137 describes RE08', 'DCM-dd137-alvin-vision', 'describes', 'ev:vision-celestial-kingdom', None),
    ('DD121 describes RE07', 'DCM-dd121-liberty-epistle', 'describes', 'RE07', 'described in'),
    ('DD122 describes RE07', 'DCM-dd122-liberty-adversity', 'describes', 'RE07', 'described in'),
    ('DD123 describes RE07', 'DCM-dd123-liberty-redress', 'describes', 'RE07', 'described in'),
    ('DD121 explains RC02', 'DCM-dd121-liberty-epistle', 'explains', 'RC02', 'explained in'),
    ('DD136 describes RE11', 'DCM-dd136-winter-quarters', 'describes', 'ev:dc136-camp-instructions', None),
    ('DD136 / DJ05: views of the same instructed migration sequence', 'DCM-dd136-winter-quarters',
     'same instructions', 'DCM-dj05-westward-companies', 'same instructions'),
    # S26 builder answer: the Moses 7 discussion card is a source discussion of the 5/pgp P17 view (verses 18–21),
    # not another city and not an alias of the future gathering in verses 62–69. Both ends are 5/pgp.
    ('S26: PGM-qg06-zion discusses P17 (Moses 7:18–21, 62–69)', 'PGM-qg06-zion',
     'describes Enoch’s community and city', 'P17-pgp-enoch-city', 'Moses 7 teaching and promise'),
]

# DRE office sets (contract row "appoints-to-office / succeeds-in-office with section source"; checkpoint 30). Each
# office card links to the person cards it appoints, labelled with the role its own text states, and each person card
# links back with the same role. Every role, verse and succession below is stated in the office card's own text (the
# accepted SC41 register row); nothing is inferred from a name, and no parent-of or kinship relation is drawn.
# Companion pairs, travel parties, stock subscriptions and the proclamation helpers are assignments, not offices, and
# get no office links.
DRE = 'DCM-dre'
OFFICES = [
    ('D&C 117:1, 10–15', DRE + '117-marks-whitney-granger', [
        ('william-marks', 'to preside at Far West'),
        ('newel-k-whitney', 'bishop at Adam-ondi-Ahman')]),
    ('D&C 118:6', DRE + '118-marsh-and-twelve', [
        (p, 'appointed to the Twelve') for p in ('john-taylor', 'john-e-page', 'wilford-woodruff', 'willard-richards')]),
    ('D&C 124:62–71', DRE + '124c-nauvoo-house-quorum', [
        (p, 'Nauvoo House trustee') for p in ('george-miller', 'lyman-wight', 'john-snider', 'peter-haws')]),
    ('D&C 124:91–97, 124–126', DRE + '124e-presidency-patriarch', [
        ('hyrum-smith', 'patriarch and seer'),
        ('joseph-smith-jr', 'presiding elder, seer and prophet'),
        ('sidney-rigdon', 'counselor in the Presidency'),
        ('william-law', 'counselor in the Presidency')]),
    ('D&C 124:127–130', DRE + '124f-twelve', [('brigham-young', 'president of the Twelve')] + [
        (p, 'member of the Twelve') for p in (
            'heber-c-kimball', 'parley-p-pratt', 'orson-pratt', 'orson-hyde', 'william-smith', 'john-taylor',
            'john-e-page', 'wilford-woodruff', 'willard-richards', 'george-a-smith')]),
    ('D&C 124:131–132', DRE + '124g-high-council', [
        (p, 'high councilor') for p in (
            'samuel-bent', 'henry-g-sherwood', 'george-w-harris', 'charles-c-rich', 'thomas-grover', 'newel-knight',
            'david-dort', 'dunbar-wilson', 'aaron-johnson', 'david-fullmer', 'alpheus-cutler', 'william-huntington')]),
    ('D&C 124:133–136', DRE + '124h-high-priests', [
        ('don-c-smith', 'president, high priests quorum'),
        ('amasa-lyman', 'counselor, high priests quorum'),
        ('noah-packard', 'counselor, high priests quorum')]),
    ('D&C 124:137', DRE + '124i-elders-quorum', [
        (p, 'elders quorum presidency') for p in ('john-a-hicks', 'samuel-williams', 'jesse-baker')]),
    ('D&C 124:138', DRE + '124j-seventy', [
        (p, 'to preside over the Seventy') for p in (
            'joseph-young', 'josiah-butterfield', 'daniel-miles', 'henry-herriman', 'zera-pulsipher',
            'levi-w-hancock', 'james-foster')]),
    ('D&C 124:141–142', DRE + '124k-bishopric-priests', [
        ('vinson-knight', 'bishopric presidency'),
        ('samuel-h-smith', 'bishopric presidency'),
        ('shadrach-roundy', 'bishopric, if he will receive it'),
        ('samuel-rolfe', 'president of the priests')]),
    ('D&C 52:37–38', DRE + '052c-eastern-charges', [
        ('jared-carter', 'to be ordained a priest'),
        ('george-james', 'to be ordained a priest')]),
]
for _src, _card, _people in OFFICES:
    for _p, _role in _people:
        TYPED.append((f'DRE appoints-to-office ({_src})', _card, _role, 'DCM-dcp-' + _p, _role))

# Succession and revision stated in the cards' own text: person-to-person where the verse names who replaces whom,
# card-to-card where a later section revises or supersedes an earlier assignment or office list.
TYPED += [
    ('DRE succeeds-in-office (D&C 124:91; card DRE124e: Law takes the counselor role Hyrum held)',
     'DCM-dcp-william-law', 'succeeds as counselor', 'DCM-dcp-hyrum-smith', 'succeeded as counselor by'),
    ('DRE succeeds-in-office (D&C 124:132; card DRE124g: Aaron Johnson in place of Seymour Brunson)',
     'DCM-dcp-aaron-johnson', 'in the place of', 'DCM-dcp-seymour-brunson', 'succeeded in his calling by'),
    ('DRE succeeds-in-office (D&C 124:132): the high council card names the deceased Seymour Brunson',
     DRE + '124g-high-council', 'replaced, deceased', 'DCM-dcp-seymour-brunson', 'replaced on the high council'),
    ('DRE reassigned charge (D&C 52:37; card DRE052c)', 'DCM-dcp-simonds-ryder', 'receives the charge of',
     'DCM-dcp-heman-basset', 'his charge given to'),
    ('DRE reassigned charge (D&C 52:37): both people on the card', DRE + '052c-eastern-charges', 'charge taken from',
     'DCM-dcp-heman-basset', 'charge taken (52:37)'),
    ('DRE reassigned charge (D&C 52:37): both people on the card', DRE + '052c-eastern-charges', 'charge given to',
     'DCM-dcp-simonds-ryder', 'given the charge (52:37)'),
    ('DRE successive office lists: 118:6 appointees are named members in 124:128–129', DRE + '118-marsh-and-twelve',
     'later list of the Twelve', DRE + '124f-twelve', 'earlier appointments to it'),
    ('DRE revision: section 56 replaces section 52 pairings from its date', DRE + '056-revisions',
     'revises the section 52 pairs', DRE + '052a-companion-pairs', 'revised in section 56'),
    ('DRE revision: section 75:6–9 revokes the section 66 pairing', DRE + '075-companion-pairs',
     'revokes the section 66 pairing', DRE + '066-mclellin-samuel-smith', 'revoked and revised in'),
    ('DRE revision: section 80 supersedes Burnett and Eden Smith’s section 75 pairings', DRE + '080-burnett-eden-smith',
     'supersedes their section 75 pairs', DRE + '075-companion-pairs', 'superseded for two by'),
]

# Contract rows that are not (or not only) codex-to-codex links, with the reason; written to typed-links.csv.
UNLINKED = [
    ('DD122 / DD123 explain RC02', 'not linked: the contract binds DD121–123 → RC02 as a group; only section 121 '
     'contains the teaching RC02 summarises, so only DD121 carries "explains"'),
    ('DD136 / RJ03 same migration sequence', 'not linked: RJ03 is a map route, not a codex card; DD136 and DJ05 '
     'name it in text and the route stays on the map'),
    ('P08 / site pin "jerusalem"', 'map pin, not a codex card: the Jerusalem source views link to each other; the '
     'pin is reached from the map'),
    ('P13 / DP03 Independence; P16 / DP27 Carthage Jail', 'map pins with one codex card each '
     '(DCM-dp03-independence; Carthage cards are the DE09 death event and DD135 dossier, kept distinct by the '
     'contract); no second codex view to link'),
    ('E11 / DE06a Kirtland dedication; DE06b distinct; RE08 distinct', 'linked as DD109 → event, DD110 ↔ DE06b, '
     'DD137 → event; the three occasions are not linked to each other (contract: one temple appearance event is a '
     'forbidden conversion)'),
    ('BMC quotation/vision records quote/see/mention shared biblical entity', 'open: not yet linked; the 239 BMC '
     'cards name the biblical entity in text; no traveled-to edge exists'),
    ('DRE office sets: no parent-of', 'office appointments, the two named successions (Law for Hyrum Smith as counselor, '
     'Aaron Johnson for Seymour Brunson), the Basset-to-Ryder charge and the section 56/75/80 revisions are linked '
     '(rows above); companion pairs, travel parties, stock subscriptions and proclamation helpers are assignments, '
     'not offices, so get no office links; the 118:6 vacancies name no predecessors, so no succession is drawn; '
     'David W. Patten’s death (124:130) is stated, not linked; no parent-of or kinship relation is drawn'),
    ('WP-R01 Daniel name pairs: alias-of within Daniel 1:6–7', 'within one card (OTW-r01-daniel-companions), which '
     'states the four name pairs; Belteshazzar is not merged with Belshazzar'),
    ('samaria-region vs samaria city', 'linked with labels "the city" / "the region"; the region card is not '
     'grouped with the city cards'),
    ('galilee-region', 'single codex view: NTP-galilee (2/nt) is the only Galilee region card; the Isaiah 9 and '
     '2 Kings 15 mentions are not separate cards, and AP09 (the lake) is a separate entity, so not linked'),
    ('tigris / Hiddekel (Daniel)', 'single setting card: OTW-p08-hiddekel (1/ot) is Daniel 10’s river setting; '
     'OTW-a12-daniel-10-11-notes reports the edition note inside its own text; the garden-river names in OH-P01 and '
     'PC10 are not linked to it (Eden hydrology is not reconstructed and shared names are not an identity)'),
    ('eden-textual, nod-textual, P17 (S25-C1)', 'linked as same-entity groups labelled "in another account" '
     '(OH-P01 ↔ PP02, OH-P02 ↔ PP03, P17-dc-enoch-city ↔ P17-pgp-enoch-city); source wording and gates kept; Cain’s '
     'Enoch (OH-P02, PGM-qg04-cain-line) is not linked to Enoch’s city; PGM-qg06-zion is linked only to the 5/pgp '
     'P17 view as a source discussion (S26), and other Zion usages (DCM-dx01, modern New Jerusalem) are not linked '
     'to P17; no location or pin'),
    ('bom-irreantum', 'single codex view: BXP02 (3/bom) is the only Irreantum card; BE03 narrates the ship command at '
     'Bountiful and is an event, not a second view of the sea, so not linked'),
]


def see_links():
    """card key -> ordered list of (target key, relation label); each target once, never to itself."""
    out = {}

    def add(a, b, r):
        lst = out.setdefault(a, [])
        if a != b and all(t != b for t, _ in lst):
            lst.append((b, r))

    for _row, rel, keys in SAME:
        for a in keys:
            for b in keys:
                add(a, b, rel)
    for _row, a, rel, b, inv in TYPED:
        add(a, b, rel)
        if inv and not b.startswith('ev:'):
            add(b, a, inv)
    return out

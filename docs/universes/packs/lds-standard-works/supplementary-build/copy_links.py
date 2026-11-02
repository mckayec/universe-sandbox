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
    ('DRE office sets: appoints-to-office / succeeds-in-office', 'stated in each DCM-dre card’s text (one card per '
     'register row); no parent-of relation is drawn; not yet linked between successive office cards'),
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

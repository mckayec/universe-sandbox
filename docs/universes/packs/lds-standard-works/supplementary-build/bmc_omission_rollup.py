# Omission rollup for the BMC source views (checkpoint 34).
#
# For every BMC key that copy_bmc.py omits with the generated default reason, gather all in-repo research text tied
# to that chapter and scan it for the names of entities that have a shared Old or New Testament card:
#   * the chapter's ledger row in coverage-bom.md (finding and exclusion);
#   * every "Full-read omission checks" row whose chapter range covers the chapter;
#   * every record the chapter-to-record crosswalk lists for the chapter, via bom-record-support.csv
#     (scope/copy and finding columns).
# The result is written to bmc-omission-rollup.csv. It is a reconciliation against the research as committed, not a
# full-text absence check of the chapter itself (the chapter bodies are not in the repository).
#
# Usage: python3 bmc_omission_rollup.py <repo root>  (prints a summary; writes the CSV next to the ledger)
import collections
import csv
import re
import sys

ROOT = sys.argv[1]
PACK_DIR = ROOT + '/docs/universes/packs/lds-standard-works'
PREFIXES = 'OHP|NTP|OTM|OTL|OTW|OHR|OH|NTE|NTJ|OHJ|OTS'
SMALL = {'the', 'of', 'and', 'in', 'to', 'at', 'on', 'from', 'a', 'an', 'by'}
# Leading capitalised words of descriptive card names that are ordinary words, not entity names.
GENERIC = {'Land', 'Temple', 'Prophecy', 'Prophetic', 'Captive', 'Withdrawal', 'Withdrawals', 'Vision', 'River',
           'Resurrection', 'Water', 'Sabbath', 'Royal', 'Place', 'Other', 'Name', 'Kingship', 'Creation', 'Covenant',
           'Baptism', 'Animal', 'Family', 'Repentance'}


def card_names(pack):
    """Map scan name -> sorted card keys, for Bible cards only."""
    rx = r"\{ key: '((?:" + PREFIXES + r")[^']*)', name: '((?:[^'\\]|\\.)*)', books: \[([\d, ]+)\]"
    names = collections.defaultdict(set)
    for key, name, _books in re.findall(rx, pack):
        name = name.replace("\\'", "'")
        base = re.sub(r' \(.*\)$', '', name)
        if len(base.split()) <= 3:
            names[base].add(key)
        # Leading run of capitalised words ("Jerusalem in the prophets" -> "Jerusalem").
        lead = []
        for word in base.split():
            if word[:1].isupper():
                lead.append(word)
            else:
                break
        head = ' '.join(lead).rstrip('’s').rstrip(',:')
        if len(head) >= 4 and head.lower() not in SMALL and head.split()[0] not in GENERIC:
            names[head].add(key)
    return {n: sorted(k) for n, k in names.items()}


SINGLE_CHAPTER = {'Enos', 'Jarom', 'Omni', 'Words of Mormon', '4 Nephi'}
LINK = re.compile(r'\[([^\]]+)\]\((https://[^)]+)\)')


def chapter_number_ranges(text):
    """Chapter identity of a reference, ignoring any verse qualifier.

    '1 Nephi 1–5' -> ('1 Nephi', 1, 5); '1 Nephi 7' -> ('1 Nephi', 7, 7); 'Alma 36:1–30' -> ('Alma', 36, 36)
    (a verse range is never read as a chapter range); 'Alma 36:1–37:5' -> ('Alma', 36, 37); 'Enos' -> ('Enos', 1, 1).
    Returns None for anything else, which the caller must account for explicitly."""
    t = text.strip()
    if t in SINGLE_CHAPTER:
        return t, 1, 1
    m = re.match(r'(.+?) (\d+)(?::\d+(?:[–-](\d+)(?::\d+)?)?|(?:[–-](\d+)))?$', t)
    if not m:
        return None
    book, a = m.group(1), int(m.group(2))
    # group 3 is the second number after a verse ("36:1–30" -> 30 is a verse, "36:1–37:5" -> 37 is a chapter)
    if m.group(3) and re.search(r':\d+[–-]\d+:\d+$', t):
        b = int(m.group(3))
    else:
        b = int(m.group(4) or a)
    return book, a, b


def parse_fullread_row(line):
    """A full-read table row -> (cell text, [(link text, url, range or None)], disposition text) or None."""
    if not line.startswith('| [') or line.count(' | ') < 1:
        return None
    first, _, rest = line[2:].partition(' | ')
    rest = rest.rstrip()
    if rest.endswith(' |'):
        rest = rest[:-2]
    links = [(t, u, chapter_number_ranges(t)) for t, u in LINK.findall(first)]
    return first, links, rest


def load_ledger():
    """Ledger rows, full-read rows and the record crosswalk, plus an ingestion inventory of every full-read row.

    Every table body row in a full-read section is either consumed (each linked reference parsed to a chapter
    range) or recorded as unsupported with a reason; anything else fails."""
    lines = open(PACK_DIR + '/coverage-bom.md', encoding='utf-8').read().splitlines()
    ledger, fullread, crosswalk, inventory = {}, [], {}, []
    section = ''
    for lineno, line in enumerate(lines, 1):
        if line.startswith('## '):
            section = line
        if section.startswith('## Full-read omission checks') and line.startswith('|'):
            if re.match(r'\|\s*-', line) or not line.startswith('| ['):
                continue  # header or separator row
            parsed = parse_fullread_row(line)
            assert parsed and parsed[1], f'coverage-bom.md:{lineno}: full-read row has no reference link'
            first, links, rest = parsed
            bad = [t for t, _u, r in links if r is None]
            if bad:
                inventory.append([lineno, section[3:], first, '', '', '', 'unsupported',
                                  'reference not parseable: ' + '; '.join(bad)])
                continue
            for t, _u, (book, a, b) in links:
                fullread.append(((book, a, b), t, rest))
                inventory.append([lineno, section[3:], t, book, a, b, 'consumed',
                                  'verse-qualified' if ':' in t else ('multi-link row' if len(links) > 1
                                                                       else 'chapter or chapter range')])
            continue
        m = re.match(r'\| \[([^\]]+)\]\((https://[^)]+)\) \| (.*) \|$', line)
        if not m:
            continue
        ref, _url, rest = m.groups()
        bmc = re.match(r'\*\*(BMC-\d+);', rest)
        if section.startswith('## Chapter ledger') and bmc:
            ledger[bmc.group(1)] = (ref, rest)
        elif section.startswith('## Final Book of Mormon integration') and rest.startswith('BMC-'):
            ids = [x.strip() for x in rest.split(';')]
            crosswalk[ids[0]] = ids[1:]
    return ledger, fullread, crosswalk, inventory


def load_support():
    out = {}
    with open(PACK_DIR + '/bom-record-support.csv', encoding='utf-8', newline='') as fh:
        for row in csv.DictReader(fh):
            out[row['id']] = row['source_scope_and_copy'] + ' ' + row['finding']
    return out


def omitted_defaults():
    keys = []
    with open(PACK_DIR + '/bmc-source-views.csv', encoding='utf-8', newline='') as fh:
        for row in csv.DictReader(fh):
            if row['state'] == 'omitted' and row['reason'].startswith(('generated default', 'rollup ')):
                keys.append((row['research_key'], row['locator']))
    return keys


# Disposition of each name hit. Every reason restates what the scanned research text itself says (see the
# first_excerpt column); nothing is added from memory of the chapter. States:
#   namesake      - the research names a Book of Mormon or Jaredite person/place sharing a Bible name
#   range-spill   - the hit is in a multi-chapter research row and the row ties it to another chapter of the range
#   title         - a divine title or a practice ("law of Moses"), not a relation to the person or place card
#   candidate     - the research for this chapter itself names a Bible figure, text or place with a shared card:
#                   a source view is proposed for the next checkpoint (still omitted at this head)
#   reader        - needs the reviewer's reading decision; the research does not settle it
NAME_DEFAULT = {
    'Aaron': ('namesake', 'Book of Mormon or Jaredite Aaron (Mosiah’s son, the city, King Aaron or the Jaredite), '
                          'not Moses’ brother'),
    'Ammon': ('namesake', 'Book of Mormon Ammon (Mosiah’s son or Zarahemla’s descendant), not the land of Ammon'),
    'Boaz': ('namesake', 'Book of Mormon city Boaz, not Ruth’s Boaz'),
    'Gideon': ('namesake', 'Book of Mormon Gideon (the officer, or the land/city/valley), not the judge Gideon'),
    'Gilgal': ('namesake', 'Book of Mormon or Jaredite Gilgal (city or valley), not Joshua’s Gilgal'),
    'Ramah': ('namesake', 'Jaredite hill Ramah, not Jeremiah’s Ramah'),
    'Samuel': ('namesake', 'Samuel the Lamanite, not the prophet Samuel of the Bible'),
    'Sidon': ('namesake', 'Book of Mormon river Sidon, not the Phoenician city'),
    'Midian': ('namesake', 'Book of Mormon land Midian, not the Midian of Moses'),
    'Ishmael': ('namesake', 'Book of Mormon Ishmael (the household head, Amulek’s ancestor or the land Ishmael); the '
                            'only Ishmael card is Ishmael son of Nethaniah at Mizpah'),
    'Jacob': ('namesake', 'Book of Mormon Jacob (Lehi’s son, the Zoramite commander, the band’s king or the city '
                          'Jacob), not the patriarch'),
    'Moses': ('title', 'the law of Moses as a practice, not a relation to the person card'),
    'Gilead': ('namesake', 'Jaredite Gilead, Shared’s brother, not the region Gilead'),
    'Ephraim': ('namesake', 'Jaredite hill Ephraim where Shule forges steel, not the New Testament town Ephraim'),
    'Kingship': ('namesake', 'kingship over Jacob’s band, not the Israelite monarchy the card describes'),
}
ROW = {
    # 1 Nephi 1–5 full-read row: Zedekiah belongs to 1 Nephi 1, the Joseph descent to 1 Nephi 5 (both implemented).
    **{(f'BMC-{n:03d}', 'Zedekiah'): ('range-spill', 'the 1 Nephi 1–5 full-read row ties the first Zedekiah year to '
                                      '1 Nephi 1 (implemented, BMV-001)') for n in (2, 3, 4)},
    **{(f'BMC-{n:03d}', 'Joseph'): ('range-spill', 'the 1 Nephi 1–5 full-read row ties Lehi’s and Laban’s descent '
                                    'from Joseph to 1 Nephi 5 (implemented, BMV-005)') for n in (2, 3, 4)},
    # 1 Nephi 7–11 full-read row: Bethabara/Jordan and Nazareth/Jerusalem belong to 1 Nephi 10–11 (implemented).
    **{(f'BMC-{n:03d}', nm): ('range-spill', 'the full-read row ties Bethabara beyond Jordan and the viewed '
                              'Nazareth/Jerusalem to Lehi’s prophecy and Nephi’s vision, 1 Nephi 10–11 (implemented, '
                              'BMV-010/011)')
       for n in (7, 8, 9) for nm in ('Bethabara', 'Bethabara beyond Jordan', 'Jordan')},
    **{(f'BMC-{n:03d}', 'Jerusalem'): ('range-spill', 'the full-read row ties the viewed Nazareth/Jerusalem to Nephi’s '
                                       'vision, 1 Nephi 11 (implemented, BMV-011)') for n in (8, 9)},
    ('BMC-003', 'Jerusalem'): ('reader', 'Lehi’s sons return toward Jerusalem for the brass plates: a narrative '
                                         'setting carried by the chapter’s own journey record, not a quotation, '
                                         'vision or teaching; whether a narrative visit is a “mention” for a source '
                                         'view is a reading decision'),
    ('BMC-004', 'Jerusalem'): ('reader', 'Nephi enters Jerusalem at night: a narrative setting, as for BMC-003'),
    ('BMC-007', 'Jerusalem'): ('reader', 'another Jerusalem journey bringing Ishmael’s household: a narrative setting, '
                                         'as for BMC-003'),
    # 1 Nephi 16–22 full-read row: the Babylon departure is the Isaiah quotation of 1 Nephi 20 (implemented).
    **{(f'BMC-{n:03d}', nm): ('range-spill', 'the full-read row ties the Babylon departure to the Isaiah quotation, '
                              '1 Nephi 20 (implemented, BMV-020)') for n in (16, 18) for nm in ('Babylon', 'Isaiah')},
    **{(f'BMC-{n:03d}', 'Joseph'): ('namesake', 'Lehi’s son Joseph, born in the wilderness, not Joseph son of Jacob')
       for n in (16, 18, 27, 56)},
    # 2 Nephi 1–5 full-read row.
    **{(f'BMC-{n:03d}', 'Jerusalem'): ('range-spill', 'the full-read row ties Lehi knowing Jerusalem’s destruction '
                                       'through vision to 2 Nephi 1 (implemented, BMV-023)') for n in (24, 26)},
    **{(f'BMC-{n:03d}', 'Joseph'): ('range-spill', 'the full-read row ties the Egyptian ancestor and future seer to '
                                    '2 Nephi 3 (implemented, BMV-025)') for n in (24, 26)},
    **{(f'BMC-{n:03d}', 'Solomon'): ('range-spill', 'the full-read row ties the temple that resembles Solomon’s to '
                                     'Nephi’s temple in 2 Nephi 5 (see BMC-027)') for n in (24, 26)},
    ('BMC-027', 'Solomon'): ('candidate', 'the research says Nephi’s temple construction resembles Solomon’s but its '
                                          'materials differ: a comparison to Solomon (OHR-SOLOMON)'),
    ('BMC-027', 'Jerusalem'): ('title', 'elapsed years counted from the departure from Jerusalem: a dating reference, '
                                        'not a relation to the city card'),
    ('BMC-024', 'Eden'): ('candidate', 'Lehi teaches the Fall; the research records it as a reference entry with no '
                                       'new physical Eden location: a teaching that touches the Eden card (OH-P01)'),
    ('BMC-137', 'Eden'): ('candidate', 'Alma’s teaching uses judgment and waters-of-life imagery; the research rules '
                                       'out a new Eden position: a teaching that touches the Eden card (OH-P01)'),
    # 2 Nephi 6–10 full-read row: the Isaiah 51 comparison belongs to 2 Nephi 8 (implemented).
    **{(f'BMC-{n:03d}', 'Isaiah'): ('range-spill', 'the full-read row ties the Isaiah quotation and its Isaiah 51 '
                                    'comparison to 2 Nephi 8 (implemented, BMV-030)') for n in (31, 32)},
    ('BMC-031', 'Israel'): ('title', '“the Holy One of Israel” is a divine title, not a relation to the community '
                                     'card'),
    ('BMC-048', 'Zion'): ('reader', 'the research reads priestcraft as seeking gain and praise rather than Zion’s '
                                    'welfare: whether this use of Zion is the prophetic-Jerusalem Zion of the card is a '
                                    'reading decision'),
    **{(f'BMC-{n:03d}', 'Zion'): ('range-spill', 'the 2 Nephi 26–33 full-read row ties the priestcraft and Zion '
                                  'clause to 2 Nephi 26 (see BMC-048)') for n in range(49, 56)},
    # Jacob 1–7 full-read row: the David/Solomon judgment is attributed to Jacob 2.
    **{(f'BMC-{n:03d}', nm): ('range-spill', 'the Jacob 1–7 full-read row attributes the David/Solomon plural-marriage '
                              'judgment to Jacob 2 (see BMC-057)') for n in (56, 58, 59, 62) for nm in ('David',
                                                                                                       'Solomon')},
    **{('BMC-057', nm): ('candidate', 'the research attributes Jacob 2’s judgment on David’s and Solomon’s plural '
                                      'marriages to this chapter and says it must stay beside D&C 132’s differing '
                                      'treatment: a teaching about David (OHR-DAVID) and Solomon (OHR-SOLOMON)')
       for nm in ('David', 'Solomon')},
    ('BMC-105', 'Joseph'): ('candidate', 'Amulek’s lineage runs through Lehi and Manasseh (descendant) to Joseph: a '
                                         'descent claim, like BMC-005, naming Joseph son of Jacob (OHR-JOSEPH-JACOB)'),
    ('BMC-105', 'Manasseh'): ('namesake', 'Manasseh here is the ancestor in Amulek’s lineage; the only Manasseh card '
                                          'is King Manasseh of Judah'),
    ('BMC-116', 'Jerusalem'): ('namesake', 'the research says American Jerusalem borders Mormon and is distinct from '
                                           'the Old World city'),
    ('BMC-117', 'Jerusalem'): ('namesake', 'American Jerusalem on Aaron’s route, as for BMC-116'),
    ('BMC-183', 'Jerusalem'): ('namesake', 'the Book of Mormon city Jerusalem covered by waters, not the Old World city'),
    ('BMC-151', 'Judaea'): ('namesake', 'the research says this Judaea is the city where Helaman joins Antipus, not '
                                        'the biblical region'),
    ('BMC-187', 'Solomon'): ('candidate', 'the research records Solomon as an illustrative reference in the sermon '
                                          'that parallels Matthew 6, not a visitor: a quotation that names Solomon '
                                          '(OHR-SOLOMON)'),
    **{(f'BMC-{n:03d}', nm): ('namesake', 'one of the Nephite twelve disciples at Bountiful, not the Bible prophet or '
                              'king') for n in (193, 202) for nm in ('Isaiah', 'Jeremiah', 'Zedekiah')},
    **{(f'BMC-{n:03d}', nm): ('range-spill', 'the 3 Nephi 15–22 record ties Israel’s gathering and the old/New '
                              'Jerusalem promises to the chapters that teach them (BMV-190 redeemed Jerusalem; '
                              'BMC-195)') for n in (191, 192, 193) for nm in ('Israel', 'Jerusalem')},
    ('BMC-195', 'Jerusalem'): ('namesake', 'the research names the New Jerusalem the Gentiles help build, which stays '
                                           'distinct from the Old World city (as in BMV-227)'),
    **{(f'BMC-{n:03d}', 'Israel'): ('reader', 'Israel as the covenant people to be gathered or addressed: whether this '
                                    'is a relation to “Israel as a prophetic community” (OTM-israel-prophetic-'
                                    'community) is a reading decision') for n in (179, 195, 203, 204, 208, 210)},
    # Checkpoint 35: hits exposed once the verse-qualified Mosiah/Alma 33–63/Helaman full-read rows were ingested.
    # Checkpoint 36: all five chapters below are implemented (S35 answers), so they leave the default-omission
    # rollup; the reasons are kept, corrected per S35-A1/A2, as the record of what the reader exposed.
    ('BMC-069', 'Mary'): ('candidate', 'S35-A2: Benjamin reports an angel’s prophecy naming Mary as Jesus’ mother; '
                                       'the existing card NTE-annunciations (“Announcements to Zacharias and Mary”) '
                                       'names her, so the view links there with the bounded label “Mary, also named '
                                       'in Luke”, not as the same announcement or the Visitation (implemented, '
                                       'BMV-069)'),
    ('BMC-073', 'Egypt'): ('candidate', 'the research records Limhi’s Egypt/Red Sea retrospective: a teaching that '
                                        'recalls the exodus from Egypt (OTS-P04-egypt; implemented, BMV-073)'),
    ('BMC-079', 'Sinai'): ('candidate', 'the research records Abinadi’s Ten Commandments with a Sinai comparison, “not '
                                        'another local mountain”: the narrator’s Moses comparison tied to the Sinai '
                                        'setting (OTS-AP04-sinai; implemented, BMV-079)'),
    ('BMC-131', 'Egypt'): ('candidate', 'the research records Alma’s remembered deliverance of the fathers from Egypt: '
                                        'a teaching recalling the exodus (OTS-P04-egypt; implemented, BMV-131)'),
    ('BMC-131', 'Jerusalem'): ('candidate', 'S35-A1: Alma 36:29 recalls the ancestral departure from Jerusalem; BXJ01 '
                                            'is the return for the plates, not the departure, so this is not '
                                            'consolidated there: the view links OTM-jerusalem with “ancestral '
                                            'departure recalled” (implemented, BMV-131)'),
    ('BMC-141', 'Joseph'): ('candidate', 'the research records Moroni quoting a saying about Joseph’s garment and notes '
                                         'the quotation is not present in the Genesis text: an attributed quotation '
                                         'naming Joseph son of Jacob (OHR-JOSEPH-JACOB), with that caveat '
                                         '(implemented, BMV-141)'),
    ('BMC-207', 'David'): ('namesake', 'the land David on Mormon’s retreat, not King David'),
    ('BMC-207', 'Joshua'): ('namesake', 'the western-seashore land Joshua, not Joshua son of Nun'),
    ('BMC-207', 'Jordan'): ('namesake', 'the Book of Mormon city Jordan on the retreat, not the biblical river'),
    ('BMC-210', 'Jordan'): ('namesake', 'the Book of Mormon city Jordan Mormon defends, not the biblical river'),
    ('BMC-239', 'Jerusalem'): ('candidate', 'the research calls Moroni’s Jerusalem/Zion exhortation quoted covenant '
                                            'imagery, not a journey: a quotation naming Jerusalem (OTM-jerusalem)'),
    ('BMC-239', 'Zion'): ('candidate', 'the quoted Jerusalem/Zion exhortation, as for Jerusalem '
                                       '(OTM-zion-prophetic-jerusalem)'),
}


def dispose(bmc, name):
    if (bmc, name) in ROW:
        return ROW[(bmc, name)]
    if name in NAME_DEFAULT:
        return NAME_DEFAULT[name]
    return ('reader', 'no disposition rule yet')


def main():
    pack = open(ROOT + '/public/atlas/packs/lds-standard-works.js', encoding='utf-8').read()
    names = card_names(pack)
    ledger, fullread, crosswalk, inventory = load_ledger()
    unsupported = [r for r in inventory if r[6] != 'consumed']
    with open(PACK_DIR + '/bmc-fullread-ingestion.csv', 'w', encoding='utf-8', newline='') as fh:
        w = csv.writer(fh, lineterminator='\n')
        w.writerow(['coverage_bom_line', 'section', 'reference', 'book', 'chapter_from', 'chapter_to', 'state',
                    'note'])
        w.writerows(inventory)
    assert not unsupported, f'unexplained full-read rows: {unsupported}'
    support = load_support()
    rows, counts = [], collections.Counter()
    for bmc, unit in omitted_defaults():
        rng = chapter_number_ranges(unit)
        texts = []
        if bmc in ledger:
            texts.append(('ledger', ledger[bmc][1]))
        for (book, a, b), ref, rest in fullread:
            if rng and book == rng[0] and a <= rng[1] <= b:
                texts.append(('full-read ' + ref, rest))
        recs = [r for r in crosswalk.get(bmc, []) if r in support]
        for rec in recs:
            texts.append(('record ' + rec, support[rec]))
        hits = collections.defaultdict(set)
        excerpt = {}
        for where, text in texts:
            for name, keys in names.items():
                m = re.search(r'(?<![\w-])' + re.escape(name) + r'(?![\w-])', text)
                if m:
                    hits[name].add(where.split(' ')[0])
                    excerpt.setdefault(name, text[max(0, m.start() - 90):m.end() + 90].replace('\n', ' '))
        sources = f'ledger row; {sum(1 for w, _ in texts if w.startswith("full-read"))} full-read row(s); ' \
                  f'{len(recs)} record-support row(s)'
        if not hits:
            state = 'reconciled-no-shared-name'
            counts[state] += 1
            rows.append([bmc, unit, state, '', '', '', '', sources, ''])
        else:
            disps = {name: dispose(bmc, name) for name in hits}
            states = {d[0] for d in disps.values()}
            chapter = ('candidate' if 'candidate' in states else 'reader' if 'reader' in states
                       else 'reconciled-hits-dispositioned')
            counts[chapter] += 1
            for name in sorted(hits):
                rows.append([bmc, unit, chapter, name, ';'.join(names[name]), disps[name][0], disps[name][1],
                             sources + '; hit in ' + '/'.join(sorted(hits[name])), excerpt[name]])
    with open(PACK_DIR + '/bmc-omission-rollup.csv', 'w', encoding='utf-8', newline='') as fh:
        w = csv.writer(fh, lineterminator='\n')
        w.writerow(['research_key', 'unit', 'state', 'scan_name', 'candidate_cards', 'hit_disposition', 'hit_reason', 'evidence_scanned', 'first_excerpt'])
        w.writerows(rows)
    print(dict(counts), 'rows', len(rows), 'full-read references consumed',
          sum(1 for r in inventory if r[6] == 'consumed'), 'table rows', len({r[0] for r in inventory}))


if __name__ == '__main__':
    main()

# Semantic omission pass over the BMC default omissions (checkpoint 37).
#
# The checkpoint 34–36 rollup (bmc_omission_rollup.py) only asks whether the name of an entity with a shared Bible
# card occurs in the committed research for a chapter. S36 asked for more: a retained / represented / omitted reason
# per chapter, with research locators and limits. This pass reads the same research text (the chapter's ledger row in
# coverage-bom.md, every full-read row covering it, and its crosswalk records in bom-record-support.csv) for Bible
# relations that are not card names — a Bible place with no card (the Red Sea), a Gospel event (Christ's baptism), a
# stated Matthew comparison, the Fall, the tower, Bible-named Jaredites — and gives each chapter one semantic state:
#
#   no-bible-relation  the research describes Book of Mormon content only; any Christ, baptism, priest, temple,
#                      prophets, Jews or Gentiles wording is a Book of Mormon teaching, ordinance, institution or
#                      audience, with no Gospel event, Bible text or Bible place named
#   namesake           every Bible-shared name in the research is a Book of Mormon or Jaredite namesake
#   practice-or-title  the Bible wording is a practice or title (“law of Moses”, “Holy One of Israel”, a script name)
#   represented        the Bible relation the research names is carried by an implemented view or a journey
#                      consolidation, named in the reason
#   relation-no-card   the research names a Bible relation, but no card at this head can carry it
#   unstated-parallel  a Bible parallel is plausible, but the committed research does not state it; linking it would
#                      add a reading the research does not make (a research question, not a builder decision)
#   candidate          the research states a Bible relation and a card exists: a source view is proposed (not built)
#   reader             the research names the relation but does not settle whether it warrants a link
#
# Every reason restates what the scanned research says or names the card evidence; nothing is added from memory of the
# chapter. Limits: the chapter bodies are not in the repository, so a state is a reading of the committed research,
# not a certified textual absence.
#
# Usage: python3 bmc_semantic_pass.py <repo root>  (prints a summary; writes bmc-semantic-dispositions.csv)
import collections
import csv
import re
import sys

sys.path.insert(0, __file__.rsplit('/', 1)[0])
import bmc_omission_rollup as R  # noqa: E402

GENERIC_CUES = r"Christ|Jesus|baptis|priest|temple|tower|prophets|Gentile|Jews?\b|commandments|Messiah"
# Cues that must have an explicit disposition below (an assertion fails otherwise).
STRICT_CUES = (r"Red Sea|law of Moses|Moses|Holy One|Fall\b|fall/|Eden|creation|Egypt|Hebrew|Matthew|John\b|Noah|"
               r"Mulek|Nimrod|Jared\b|Seth\b|Levi\b|Heth\b|Kish\b|Good Shepherd|lost tribes?|bread/wine|new star|"
               r"messengers proclaiming|sacred writings|rejected-foundation|Tower/creation")
LIMIT = ('reading of the committed research (ledger row, full-read rows, crosswalk records); the chapter body is not '
         'in the repository, so this is not a certified textual absence')

SEMANTIC = {
    'BMC-193': ('represented', 'Israel’s gathering and the old/New Jerusalem promises in the BXC02 record belong '
                               'to the chapters that teach them (BMV-190, BMV-195; rollup range-spill); the record’s '
                               'lost-tribes announcement is BMV-191 (S37: no tribe identity or destination); '
                               'Isaiah, Jeremiah and Zedekiah are Nephite disciples (rollup namesakes)'),
    'BMC-015': ('represented', 'Nephi interprets the olive tree, gathering and rod for his brothers; the 1 Nephi '
                               '12–15 full-read row notes John is identified in 14:27, which is BMV-014 (John named in '
                               'Nephi’s vision)'),
    'BMC-076': ('namesake', 'Noah is the Zeniff-line king (BXP03, land seen from Noah’s tower), not the patriarch'),
    'BMC-089': ('namesake', 'Noah is the Zeniff-line king whose fugitive priests settle Amulon (BXP04)'),
    'BMC-090': ('namesake', 'Noah is the Zeniff-line king (BXP03), not the patriarch'),
    'BMC-091': ('represented', 'the Mosiah 25 full-read row names Zarahemla as Mulek’s descendant; Mulek’s survival '
                               'as Zedekiah’s son is carried by BMV-166 (Helaman 8:11–22 and, since S37, '
                               'Helaman 6:10; OHR-ZEDEKIAH)'),
    'BMC-165': ('represented', 'Nephi prays on his garden tower in Zarahemla (BXP35, a Book of Mormon structure); the '
                               'city Mulek on the BXJ10 route is a namesake, and Mulek’s Zedekiah descent is BMV-166'),
    'BMC-217': ('namesake', 'the brother of Jared is the Jaredite founder’s brother; no Genesis Jared card exists and '
                            'the premortal appearance is a Book of Mormon theophany'),
    'BMC-222': ('namesake', 'Jared, Heth and Coriantumr here are later Jaredites (the research says so); no Bible link '
                            'is made and no card for those names exists'),
    'BMC-223': ('namesake', 'Jared and Heth are Jaredite rulers; the serpents are a Jaredite famine episode, not tied by '
                            'the research to any Bible text'),
    'BMC-226': ('namesake', 'the brother of Jared moves mount Zerin (BXP64); Jesus appears to Moroni — Book of Mormon '
                            'content with no Bible text or place named'),
    'BMC-228': ('namesake', 'Jared, Noah and Nimrod appear in the Jaredite people record BXR05 as Jaredites; Gilead is '
                            'Shared’s brother (rollup); no Bible link is made'),
    'BMC-059': ('practice-or-title', 'Jacob teaches the law of Moses as pointing to Christ: a practice, not a relation '
                                     'to the Moses card (rollup). The rejected-foundation stone imagery is not tied by '
                                     'the research to any Bible text, and the ledger calls it a literary reference'),
    'BMC-064': ('practice-or-title', 'Jarom describes teachers keeping Moses’ law and the Sabbath: a practice, not a '
                                     'relation to the Moses card (rollup)'),
    'BMC-077': ('namesake', 'Noah here is Zeniff’s son, king of the land; the pack’s Noah cards are Pearl of Great '
                            'Price records (5/pgp), and no Old Testament Noah card exists'),
    'BMC-083': ('namesake', 'Noah is the Zeniff-line king whose servants pursue Alma, not the patriarch'),
    'BMC-085': ('namesake', 'Noah is the Zeniff-line king who flees to the temple-side tower, not the patriarch'),
    'BMC-086': ('namesake', 'Noah’s priests are the Zeniff-line king’s, not the patriarch’s'),
    'BMC-111': ('namesake', 'Noah here is a Nephite land (BXP10) attacked with Ammonihah, not the patriarch'),
    'BMC-120': ('practice-or-title', 'surviving Lamanites observe Moses’ law while looking to Christ: a practice, not a '
                                     'relation to the Moses card (rollup)'),
    'BMC-144': ('namesake', 'Noah is the fortified Nephite city Lehi commands, not the patriarch'),
    'BMC-147': ('namesake', 'Mulek here is the city retaken near Bountiful (BXP29); Mulek’s descent from Zedekiah is '
                            'carried by Nephi’s Helaman 8 teaching (BMV-166)'),
    'BMC-148': ('namesake', 'Mulek is the city Lehi holds (BXP29); the Zedekiah lineage is carried by BMV-166'),
    'BMC-163': ('namesake', 'Mulek is a city on Nephi and Lehi’s mission route (BXP29); the Zedekiah lineage is '
                            'carried by BMV-166'),
    'BMC-175': ('practice-or-title', 'the law of Moses remains in force (a practice); the new star is the Book of '
                                     'Mormon birth sign, which the research does not tie to Matthew 2’s star '
                                     '(unstated parallel, not linked); the Nephi here is a Nephite record keeper'),
    'BMC-216': ('namesake', 'Nimrod valley is the Jaredite gathering place (and Ether 7’s Nimrod a ruler); the research '
                            'gives no Bible link and no Nimrod card exists'),
    'BMC-220': ('namesake', 'Jared and his brother are the Jaredite founders; no Genesis Jared card exists and the '
                            'research gives no Bible link'),
    'BMC-221': ('namesake', 'the research itself says Noah is distinct from biblical and Zeniff-line Noah; hill '
                            'Ephraim is Jaredite (rollup); Nimrod is a Jaredite ruler'),
    'BMC-224': ('namesake', 'Levi, Heth, Kish and Aaron are Jaredite kings and captives in the research; none is tied '
                            'to a Bible person, and King Aaron is dispositioned in the rollup'),
    'BMC-225': ('namesake', 'Seth is a Jaredite captive; the pack’s Seth card is a Pearl of Great Price lineage record '
                            '(5/pgp) and the research gives no Bible link'),
}


def ledger_lines():
    out = {}
    for n, line in enumerate(open(R.PACK_DIR + '/coverage-bom.md', encoding='utf-8'), 1):
        m = re.search(r'\| \*\*(BMC-\d+);', line)
        if m:
            out.setdefault(m.group(1), n)
    return out


def fullread_lines(unit):
    rng = R.chapter_number_ranges(unit)
    out = []
    with open(R.PACK_DIR + '/bmc-fullread-ingestion.csv', encoding='utf-8', newline='') as fh:
        for r in csv.DictReader(fh):
            if rng and r['state'] == 'consumed' and r['book'] == rng[0] and \
                    int(r['chapter_from']) <= rng[1] <= int(r['chapter_to']):
                out.append(r['coverage_bom_line'])
    return sorted(set(out), key=int)


def rollup_hits():
    out = collections.defaultdict(list)
    with open(R.PACK_DIR + '/bmc-omission-rollup.csv', encoding='utf-8', newline='') as fh:
        for r in csv.DictReader(fh):
            if r['scan_name']:
                out[r['research_key']].append(r)
    return out


IMPLEMENTED = set()


def implemented_ref(reason):
    """'(see BMC-057)' -> '(implemented since, BMV-057)' when that chapter now has a view."""
    return re.sub(r'\(see (BMC-(\d+))\)',
                  lambda m: f'(implemented since, BMV-{m.group(2)})' if m.group(1) in IMPLEMENTED else m.group(0),
                  reason)


def derive(bmc, texts, hits):
    """State and reason for a chapter with no explicit SEMANTIC entry."""
    strict = sorted({m.group(0) for _w, t in texts for m in re.finditer(STRICT_CUES, t)})
    assert not strict, f'{bmc}: cue(s) {strict} need an explicit semantic disposition'
    if hits:
        spill = [h for h in hits if h['hit_disposition'] == 'range-spill']
        others = [h for h in hits if h['hit_disposition'] != 'range-spill']
        parts = [f"{h['scan_name']}: {implemented_ref(h['hit_reason'])}" for h in spill + others]
        if spill:
            return 'represented', 'the Bible relations the research names are carried elsewhere — ' + '; '.join(parts)
        kinds = {h['hit_disposition'] for h in others}
        state = 'practice-or-title' if kinds == {'title'} else 'namesake'
        return state, '; '.join(parts)
    generic = sorted({m.group(0) for _w, t in texts for m in re.finditer(GENERIC_CUES, t)})
    first = texts[0][1].split('|')[0]
    first = re.sub(r'\*\*BMC-\d+; inspected\.\*\*\s*', '', first).strip()
    first = re.sub(r'\s*\([^)]*C for attributed text\)\s*$', '', first)
    if len(first) > 170:
        first = first[:170].rsplit(' ', 1)[0] + '…'
    reason = 'the research describes Book of Mormon content only — “' + first + '”'
    if generic:
        reason += (f'; its {", ".join(generic)} wording is Book of Mormon teaching, ordinance, institution or '
                   'audience, naming no Gospel event, Bible text or Bible place (the pack has no person card for '
                   'Jesus)')
    return 'no-bible-relation', reason


def main():
    ledger, fullread, crosswalk, _inv = R.load_ledger()
    support = R.load_support()
    lines = ledger_lines()
    hits_by = rollup_hits()
    rows, counts = [], collections.Counter()
    with open(R.PACK_DIR + '/bmc-source-views.csv', encoding='utf-8', newline='') as fh:
        IMPLEMENTED.update(r['research_key'] for r in csv.DictReader(fh) if r['state'] == 'implemented')
    keys = R.omitted_defaults()
    unused = set(SEMANTIC) - {k for k, _u in keys}
    assert not unused, f'semantic dispositions for keys that are not default omissions: {sorted(unused)}'
    for bmc, unit in keys:
        rng = R.chapter_number_ranges(unit)
        texts = [('ledger', ledger[bmc][1])]
        for (book, a, b), ref, rest in fullread:
            if rng and book == rng[0] and a <= rng[1] <= b:
                texts.append(('full-read ' + ref, rest))
        recs = [r for r in crosswalk.get(bmc, []) if r in support]
        texts += [('record ' + r, support[r]) for r in recs]
        if bmc in SEMANTIC:
            state, reason = SEMANTIC[bmc]
        else:
            state, reason = derive(bmc, texts, hits_by.get(bmc, []))
        counts[state] += 1
        loc = [f'coverage-bom.md:{lines[bmc]}'] + [f'coverage-bom.md:{n} (full-read)' for n in fullread_lines(unit)]
        loc += [f'bom-record-support.csv {r}' for r in recs]
        limit = LIMIT if len(loc) > 1 and 'full-read' in loc[1] else LIMIT + '; no full-read omission-check row covers ' \
            'this chapter, so only its ledger row and crosswalk records were read'
        rows.append([bmc, unit, state, reason, '; '.join(loc), limit])
    with open(R.PACK_DIR + '/bmc-semantic-dispositions.csv', 'w', encoding='utf-8', newline='') as fh:
        w = csv.writer(fh, lineterminator='\n')
        w.writerow(['research_key', 'unit', 'semantic_state', 'reason', 'research_locators', 'limit'])
        w.writerows(rows)
    print(dict(sorted(counts.items())), 'rows', len(rows))


if __name__ == '__main__':
    R.ROOT = sys.argv[1]
    R.PACK_DIR = R.ROOT + '/docs/universes/packs/lds-standard-works'
    main()

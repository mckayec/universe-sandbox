# Builder text screen for the BMC semantic rows that have no full-read omission-check row (checkpoint 56).
#
# The 142-row semantic ledger (bmc-semantic-dispositions.csv) is a reading of the committed research. For 39 rows
# (3 Nephi through Moroni) no full-read omission-check row exists, so their states rest on the ledger row and
# crosswalk records only. This script screens the chapter text itself for those rows:
#   * every scan name of a shared Old or New Testament card (bmc_omission_rollup.card_names, the same names the
#     rollup used), and
#   * the semantic cues of bmc_semantic_pass (STRICT_CUES) plus a short list of Bible-relation words below.
# Each hit is written with its verse references so a reader can check it; the builder triage in TRIAGE says
# whether the hit is consistent with the row's current semantic state or needs a reviewer disposition.
#
# Text: a third-party JSON mirror of the 1981/2013 Book of Mormon text (bcbooks/scriptures-json), passed in as a
# path. The text is not committed; the CSV records only references, cue words and short reasons. The official
# chapter links in coverage-bom.md remain the citations. This is a word screen, not a reading: a chapter with no
# hit is screened, not certified.
#
# Usage: python3 bmc_textscan.py <repo root> <book-of-mormon.json>
import collections
import csv
import json
import re
import sys

sys.path.insert(0, __file__.rsplit('/', 1)[0])
import bmc_omission_rollup as R  # noqa: E402
import bmc_semantic_pass as S  # noqa: E402

ROOT, TEXT = sys.argv[1], sys.argv[2]
PACK_DIR = ROOT + '/docs/universes/packs/lds-standard-works'
EXTRA_CUES = (r"Abraham|Isaac|Jacob|Israel|Isaiah|Malachi|Micah|Zenos|Zenock|Adam|Eve\b|Lamb of God|"
              r"Jerusalem|Zion|Babel|great tower|flood|Joseph|Lehi|Zedekiah|Elijah|Elias|Gospel|apostles|"
              r"the twelve|Peter|James|Sinai|Horeb|Pharaoh|Canaan|Sodom|Gomorrah|Bethlehem|Galilee|Calvary|"
              r"Golgotha|Pilate|Herod|Mary|Nazareth|Satan|devil|cross|crucified|Sermon|Beatitude|"
              # checkpoint 58: the card-name parser reads OH-R01 “Cain, Abel, Seth and Enos” as the combined alias
              # “Cain, Abel, Seth”, so Cain is screened as its own controlled cue (Ether 8:15 regression)
              r"Cain\b")
# Distinctive New Testament wording screened as possible unstated parallels (phrase -> cue label). A short,
# hand-picked list, not an exhaustive parallel search.
PARALLELS = {
    r'suffereth long, and is kind': 'parallel: 1 Corinthians 13:4-7',
    r'charity never faileth': 'parallel: 1 Corinthians 13:8',
    r'things which are hoped for and not seen': 'parallel: Hebrews 11:1',
    r'gates of hell shall not prevail': 'parallel: Matthew 16:18',
    r'sandy foundation': 'parallel: Matthew 7:26-27',
}
# Card scan names that are plain words in the text, not entity names.
SKIP_NAMES = {'Jesus', 'Christ', 'Lord', 'God', 'Messiah', 'Holy Ghost', 'Father', 'Son'}


def chapter_text(data, unit):
    book, num = unit.rsplit(' ', 1)
    for b in data['books']:
        if b['book'] == book:
            return b['chapters'][int(num) - 1]['verses']
    raise KeyError(unit)


# Checkpoint 58: the screen keeps its checkpoint-56 scope (the 39 rows that had no full-read omission-check row),
# even where a row has since left the semantic ledger for a view or a recorded decision; such a row's state is
# shown as that decision.
SCREEN_KEYS = ['BMC-%03d' % n for n in (175, 176, 177, 178, 180, 181, 182, 183, 185, 193, 200, 201, 205, 206, 207,
                                         209, 211, 213, 216, 217, 219, 220, 221, 222, 223, 224, 225, 226, 228, 229,
                                         230, 231, 232, 233, 234, 235, 236, 237, 238)]

# Screened rows that left the semantic ledger in checkpoint 60 (HANDOFF_PLAN 2026-11-04 next bounded tranche).
CHECKPOINT_60 = {'BMC-183', 'BMC-216', 'BMC-217', 'BMC-238'}


def residual_rows():
    from copy_bmc_res96c import RES96_VIEWS  # checkpoint 64
    CHECKPOINT_64 = {f'BMC-{n:03d}' for n, *_ in RES96_VIEWS}
    sem = {r['research_key']: r for r in csv.DictReader(open(PACK_DIR + '/bmc-semantic-dispositions.csv',
                                                             encoding='utf-8'))}
    views = list(csv.DictReader(open(PACK_DIR + '/bmc-source-views.csv', encoding='utf-8')))
    out = []
    for k in SCREEN_KEYS:
        if k in sem:
            assert '(full-read)' not in sem[k]['research_locators'], k
            out.append(sem[k])
            continue
        mine = [v for v in views if v['research_key'] == k and v['state'] in ('implemented', 'omitted')]
        assert mine, k
        cp = 'checkpoint-60' if k in CHECKPOINT_60 else 'checkpoint-58'
        # checkpoint 63: the RES96 full-read decisions are labelled by their own recorded reason
        if mine[0]['state'] == 'omitted' and mine[0]['reason'].startswith('checkpoint 63 decision'):
            cp = 'checkpoint-63'
        # checkpoint 64: the RES96-C01–C14 views and consolidations
        if k in CHECKPOINT_64 or mine[0]['reason'].startswith('checkpoint 64 decision'):
            cp = 'checkpoint-64'
        state = (cp + ' view ' + mine[0]['rendered_view'] if mine[0]['state'] == 'implemented'
                 else cp + ' decision (omitted)')
        unit = mine[0]['locator'].split(':')[0]
        out.append({'research_key': k, 'unit': unit, 'semantic_state': state})
    return out


def scan(verses, names):
    hits = collections.defaultdict(lambda: {'verses': [], 'cards': []})
    pats = [(n, re.compile(r'\b' + re.escape(n) + r'\b'), k) for n, k in names.items() if n not in SKIP_NAMES]
    cue_rx = re.compile(S.STRICT_CUES + '|' + EXTRA_CUES)
    for v in verses:
        t = v['text']
        for n, rx, keys in pats:
            if rx.search(t):
                hits[n]['verses'].append(v['verse'])
                hits[n]['cards'] = keys
        for rx, label in PARALLELS.items():
            if re.search(rx, t):
                hits[label]['verses'].append(v['verse'])
        for m in {m.group(0) for m in cue_rx.finditer(t)}:
            if m not in names:
                hits[m]['verses'].append(v['verse'])
    return hits


def main():
    from bmc_textscan_triage import TRIAGE  # noqa: E402
    data = json.load(open(TEXT, encoding='utf-8'))
    names = R.card_names(open(ROOT + '/public/atlas/packs/lds-standard-works.js', encoding='utf-8').read())
    out, counts, untriaged = [], collections.Counter(), []
    for row in residual_rows():
        verses = chapter_text(data, row['unit'])
        hits = scan(verses, names)
        if not hits:
            out.append([row['research_key'], row['unit'], row['semantic_state'], len(verses), '', '', '',
                        'no-hit', 'no card name or cue in the chapter text'])
            counts['no-hit'] += 1
            continue
        for cue in sorted(hits):
            h = hits[cue]
            key = (row['research_key'], cue)
            if key not in TRIAGE and cue not in TRIAGE:
                untriaged.append(key)
                tri = ('untriaged', '')
            else:
                tri = TRIAGE.get(key) or TRIAGE[cue]
            refs = ', '.join(f"{row['unit']}:{n}" for n in sorted(set(h['verses'])))
            out.append([row['research_key'], row['unit'], row['semantic_state'], len(verses), cue,
                        ' '.join(h['cards']), refs, tri[0], tri[1]])
            counts[tri[0]] += 1
    with open(PACK_DIR + '/bmc-textscan.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(['research_key', 'unit', 'semantic_state', 'verses_screened', 'cue', 'bible_cards', 'verses',
                    'builder_triage', 'reason'])
        w.writerows(out)
    print('rows', len(residual_rows()), 'hit rows', len(out), dict(counts))
    if untriaged:
        print('UNTRIAGED', len(untriaged))
        for k in untriaged:
            print('  ', k)
        sys.exit(1)


if __name__ == '__main__':
    main()

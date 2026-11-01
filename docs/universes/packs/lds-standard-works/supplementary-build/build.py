#!/usr/bin/env python3
"""Generate the supplementary codex block of public/atlas/packs/lds-standard-works.js and the per-SD-row
mapping docs/universes/packs/lds-standard-works/supplementary-implementation.csv.

Usage: python3 build.py <declaration-dispositions.csv>
The input is PR34's supplementary-dispositions/declaration-dispositions.csv (ChatGPT's accepted register).
Display copy lives in copy_*.py; sources come from each row's own markdown links. Rows whose family is not
built yet are written to the mapping as `pending` so the CSV always covers all 1,271 SD rows. Child source views a
parent row requires (copy_*.CHILDREN) follow their parent, as cards and as `child of SDnnnn` mapping rows."""
import csv, hashlib, re, sys, pathlib

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[4]
PACK = ROOT / 'public/atlas/packs/lds-standard-works.js'
MAP = HERE.parent / 'supplementary-implementation.csv'
BASE = 'https://www.churchofjesuschrist.org/study/scriptures/'
sys.path.insert(0, str(HERE))
import copy_bom
import copy_nt
import copy_ot
import copy_otl
import copy_mp
import copy_wp

BOOKS = {'1-ne': '1 Nephi', '2-ne': '2 Nephi', 'jacob': 'Jacob', 'enos': 'Enos', 'jarom': 'Jarom', 'omni': 'Omni',
         'w-of-m': 'Words of Mormon', 'mosiah': 'Mosiah', 'alma': 'Alma', 'hel': 'Helaman', '3-ne': '3 Nephi',
         '4-ne': '4 Nephi', 'morm': 'Mormon', 'ether': 'Ether', 'moro': 'Moroni'}
NT_BOOKS = {'matt': 'Matthew', 'mark': 'Mark', 'luke': 'Luke', 'john': 'John', 'acts': 'Acts', 'rom': 'Romans',
            '1-cor': '1 Corinthians', '2-cor': '2 Corinthians', 'gal': 'Galatians', 'eph': 'Ephesians',
            'philip': 'Philippians', 'col': 'Colossians', '1-thes': '1 Thessalonians', '2-thes': '2 Thessalonians',
            '1-tim': '1 Timothy', '2-tim': '2 Timothy', 'titus': 'Titus', 'philem': 'Philemon', 'heb': 'Hebrews',
            'james': 'James', '1-pet': '1 Peter', '2-pet': '2 Peter', '1-jn': '1 John', '2-jn': '2 John',
            '3-jn': '3 John', 'jude': 'Jude', 'rev': 'Revelation'}
# family -> (tab id, gate books, gate layers, copy module)
FAMILIES = {'bom': ('bom-more', [3], ['bom'], copy_bom), 'nt': ('nt-more', [2], ['nt'], copy_nt),
            'ot': ('ot-more', [1], ['ot'], copy_ot)}
BUILT = {f'SC0{i}': 'bom' for i in range(1, 8)}
BUILT.update({f'SC{i:02d}': 'nt' for i in range(8, 13)})
BUILT.update({f'SC{i:02d}': 'ot' for i in range(13, 24)})
BUILT.update({f'SC{i:02d}': 'ot' for i in range(24, 31)})
BUILT.update({f'SC{i:02d}': 'ot' for i in range(31, 35)})
COPY_MODULES = [copy_bom, copy_nt, copy_ot, copy_otl, copy_mp, copy_wp]
# OT chapter ledger: rows `| OH-G11 / [Genesis 11](url) |` in coverage-ot-history.md. SC14–SC17 rows cite these ids
# instead of links (their source_resolution says they resolve through the accepted chapter ledgers).
LEDGER = {}
for _line in (HERE.parent / 'coverage-ot-history.md').read_text(encoding='utf-8').splitlines():
    _m = re.match(r'\| (OH-[A-Z0-9-]+?) / \[([^\]]+)\]\((https://[^)]+)\)', _line)
    if _m:
        LEDGER[_m.group(1)] = (_m.group(2), _m.group(3))
# Late-history chapter ledger: rows `| LH1-04 — [1 Chronicles 4:1–43](url) |` in coverage-ot-late-history.md.
# SC18–SC20 rows cite these ids, sometimes with verses (LH2-11:5–12) or chapter lists (LH2-03,29,34,36).
for _line in (HERE.parent / 'coverage-ot-late-history.md').read_text(encoding='utf-8').splitlines():
    _m = re.match(r'\| (LH[12ENS]-\d+) — \[([^\]:]+)(?::[^\]]*)?\]\((https://[^)]+)\)', _line)
    if _m:
        LEDGER[_m.group(1)] = (_m.group(2), _m.group(3))
LH_REF = re.compile(r'(LH[12ENS]-)(\d+)(?::([\d–,\-]+)|((?:[–-]\d+)?(?:,\d+(?:[–-]\d+)?)*))')
OT_BOOKS = {re.search(r'/scriptures/ot/([^/?]+)/', u).group(1): t.rsplit(' ', 1)[0] for t, u in LEDGER.values()}
# SC24–SC34 rows carry their own links to books outside those two ledgers
OT_BOOKS.update({'isa': 'Isaiah', 'jer': 'Jeremiah', 'lam': 'Lamentations', 'ezek': 'Ezekiel'})
# Rows may name a link a card must not cite (a later-work source that belongs on a gated child): DROP_SRC lists
# url path fragments removed from that row's sources.
LEDGER_REF = re.compile(r'OH-(RU|S1-|S2-|K1-|K2-|[GXLNDQJ])(\d+(?:[–-]\d+)?(?:,\d+(?:[–-]\d+)?)*)')
LINK = re.compile(r'\[([^\]]+)\]\((https://[^)\s]+)\)')


def spaced(t):
    # '1 Chronicles11:1–3' / 'JST1Chronicles21:15' / 'Ezra4:7' -> '1 Chronicles 11:1–3' / 'JST 1 Chronicles 21:15' / 'Ezra 4:7'
    return re.sub(r'(?<=[A-Za-z])(?=\d)|(?<=\d)(?=[A-Z])', ' ', t)


def locator(text, url):
    if '/scriptures/jst/' in url:
        return spaced(text.strip())
    o = re.search(r'/scriptures/ot/([^/?]+)/(\d+)', url)
    if o:
        t = spaced(text.strip())
        if re.fullmatch(r'\d+:[\d–,\-]+', t):
            return f'{OT_BOOKS[o.group(1)]} {t}'
        assert t.startswith(OT_BOOKS[o.group(1)] + ' '), (text, url)
        return t
    n = re.search(r'/scriptures/nt/([^/?]+)/(\d+)', url)
    if n:
        t = text.strip()
        k = re.fullmatch(r'([0-9a-z-]+) (\d+(?::[\d–,\-]+)?)', t)
        assert k and k.group(1) == n.group(1), (text, url)
        return f'{NT_BOOKS[n.group(1)]} {k.group(2).replace(",", ", ")}'
    m = re.search(r'/scriptures/bofm/([^/?]+)/(\d+)', url)
    if not m:
        return text
    book, ch = BOOKS[m.group(1)], m.group(2)
    t = text.strip()
    if t.startswith('Official chapter'):
        v = t.split(',', 1)[1].split(';')[0].strip()
        return f'{book} {ch}:{v}'
    if re.fullmatch(r'\d+:[\d–,\-]+', t):
        return f'{book} {t}'
    if re.fullmatch(r'\d+', t):
        return f'{book} {t}'
    return t


def sources(row):
    out, seen = [], set()
    for t, u in LINK.findall(row['minimum_retained_source_context']):
        t = locator(t, u)
        if (t, u) not in seen:
            seen.add((t, u))
            out.append((t, u))
    if not out:
        for pre, items in LEDGER_REF.findall(row['minimum_retained_source_context']):
            for it in items.split(','):
                a, *b = re.split('[–-]', it)
                t, u = LEDGER[f'OH-{pre}{a}']
                if b:
                    t = t + '–' + LEDGER[f'OH-{pre}{b[0]}'][0].rsplit(' ', 1)[1]
                if (t, u) not in seen:
                    seen.add((t, u))
                    out.append((t, u))
    if not out:
        for pre, ch, verses, more in LH_REF.findall(row['minimum_retained_source_context']):
            items = [ch] if verses else (ch + more).split(',')
            for it in items:
                a, *b = re.split('[–-]', it)
                t, u = LEDGER[f'{pre}{int(a):02d}']
                if verses:
                    t = f'{t}:{verses}'.replace(',', ', ')
                elif b:
                    t = t + '–' + str(int(b[0]))
                if (t, u) not in seen:
                    seen.add((t, u))
                    out.append((t, u))
    drop = {k: v for m in COPY_MODULES for k, v in getattr(m, 'DROP_SRC', {}).items()}
    out = [(t, u) for t, u in out if not any(f in u for f in drop.get(row['disposition_id'], []))]
    extra = {k: v for m in COPY_MODULES for k, v in m.EXTRA_SRC.items()}
    for t, path in extra.get(row['disposition_id'], []):
        # a full URL (e.g. an accepted research decision on GitHub) is kept as given
        u = path if path.startswith('https://') else BASE + path + '?lang=eng'
        assert all(u != v for _, v in out), (row['disposition_id'], t)
        out.append((t, u))
    return out


def js(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


def entry(key, name, desc, src, books, layers):
    s = ', '.join('{ t: %s, u: %s }' % (js(t), js(u)) for t, u in src)
    return '          { key: %s, name: %s, books: %s, layers: [%s], desc: %s, src: [%s] },' % (
        js(key), js(name), books, ', '.join(js(l) for l in layers), js(desc), s)


def main(path):
    rows = list(csv.DictReader(open(path, encoding='utf-8')))
    assert len(rows) == 1271, len(rows)
    lines, mapping = {f: [] for f in FAMILIES}, []
    copy = {k: v for m in COPY_MODULES for k, v in m.COPY.items()}
    assert len(copy) == sum(len(m.COPY) for m in COPY_MODULES)
    children = {k: v for m in COPY_MODULES for k, v in m.CHILDREN.items()}
    assert all(k in copy for k in children), 'child of an unbuilt row'
    # rows consolidated into another row's card (copy value is that row's SD id): their sources join the card
    by_sd = {r['disposition_id']: r for r in rows}
    merged = {}
    prose_into = {}
    for m in COPY_MODULES:
        for cat, loc, rid, tsd, (t, path) in getattr(m, 'PROSE_INTO', []):
            assert tsd in copy and not isinstance(copy[tsd], str), (rid, tsd)
            prose_into.setdefault(tsd, []).append((cat, loc, rid, t, BASE + path + '?lang=eng'))
    child_keys = {c[0]: (psd, c) for psd, cs in children.items() for c in cs}
    for sd, v in copy.items():
        if isinstance(v, str) and v in child_keys:
            # consolidated into a child source view of another row (e.g. SD0705 into the Ezekiel 42 view)
            assert BUILT.get(by_sd[sd]['category']) == BUILT.get(by_sd[child_keys[v][0]]['category']), (sd, v)
            merged.setdefault(v, []).extend(sources(by_sd[sd]))
        elif isinstance(v, str):
            assert v in copy and not isinstance(copy[v], str), (sd, v)
            assert BUILT.get(by_sd[sd]['category']) == BUILT.get(by_sd[v]['category']), (sd, v)
            merged.setdefault(v, []).extend(sources(by_sd[sd]))
    for r in rows:
        sd, cat = r['disposition_id'], r['category']
        if sd in copy and isinstance(copy[sd], str):
            tsd = copy[sd]
            if tsd in child_keys:
                key, name = child_keys[tsd][1][0], child_keys[tsd][1][1]
                tsd = f'{key} child view of {child_keys[tsd][0]}'
            else:
                key, name, _ = copy[tsd]
            mapping.append([sd, cat, r['source_location'], r['research_declaration'], 'imported',
                            f'codex:{FAMILIES[BUILT[cat]][0]}', key, name, '; '.join(t for t, _ in sources(r)),
                            r['work_gate'], f'consolidated into {tsd} card; ' + r['consolidation_rule'], r['row_sha256']])
            continue
        fam = BUILT.get(cat)
        h = hashlib.sha256(r['minimum_retained_source_context'].encode()).hexdigest()
        if fam and sd in copy:
            key, name, desc = copy[sd]
            tab, books, layers, _ = FAMILIES[fam]
            gate = {k: v for m in COPY_MODULES for k, v in getattr(m, 'GATE', {}).items()}
            books, layers = gate.get(sd, (books, layers))
            src = sources(r)
            for t, u in merged.get(sd, []):
                # a consolidated row's chapter-level source is dropped when the card already cites that chapter
                if (t, u) not in src and not (':' not in t and any(u == v for _, v in src)):
                    src.append((t, u))
            assert src, sd
            for _c, _l, _r, pt, pu in prose_into.get(sd, []):
                # the prose view's wider locator replaces the card's label for the same chapter URL
                hit = [i for i, (_, u) in enumerate(src) if u == pu]
                assert len(hit) == 1, (sd, pu)
                src[hit[0]] = (pt, pu)
            lines[fam].append(entry(key, name, desc, src, books, layers))
            mapping.append([sd, cat, r['source_location'], r['research_declaration'], 'imported',
                            f'codex:{tab}', key, name, '; '.join(t for t, _ in src),
                            (f'{books[0]}/{layers[0]} (row gate); ' if sd in gate else '') + r['work_gate'],
                            r['consolidation_rule'], r['row_sha256']])
            for pcat, ploc, prid, pt, _u in prose_into.get(sd, []):
                mapping.append(['', pcat, ploc, prid, 'imported', f'codex:{tab}', key, name, pt, r['work_gate'],
                                f'consolidated into {sd} card (prose-only source view); no additional event or card',
                                ''])
            for ckey, cname, cdesc, csrc, *cgate in children.get(sd, []):
                # an optional fifth element gives the child its own later-work gate: ([4], ['dc'])
                cbooks, clayers = cgate[0] if cgate else (books, layers)
                csrc = [(ct, BASE + cp + '?lang=eng') for ct, cp in csrc]
                for t, u in merged.get(ckey, []):
                    if (t, u) not in csrc:
                        csrc.append((t, u))
                lines[fam].append(entry(ckey, cname, cdesc, csrc, cbooks, clayers))
                cwg = r['work_gate'] if not cgate else f'{cbooks[0]}/{clayers[0]} (child gate)'
                mapping.append(['', cat, f'child of {sd}', key, 'imported', f'codex:{tab}', ckey, cname,
                                '; '.join(ct for ct, _ in csrc), cwg,
                                'child source view required by its parent row', ''])
        else:
            assert not fam, f'{sd} in built family {cat} has no copy'
            mapping.append([sd, cat, r['source_location'], r['research_declaration'], 'pending', '', '', '', '',
                            r['work_gate'], r['consolidation_rule'], r['row_sha256']])
    for cat, key, name, desc, src in copy_bom.PROSE:
        src = [(t, BASE + p + '?lang=eng') for t, p in src]
        lines['bom'].append(entry(key, name, desc, src, [3], ['bom']))
        mapping.append(['', cat, 'prose', key, 'imported', 'codex:bom-more', key, name, '; '.join(t for t, _ in src),
                        '3/bom', 'prose-only section bullet; mandatory bounded content', ''])
    assert all(k in {r['disposition_id'] for r in rows} for k in copy)
    keys = [m[6] for m in mapping if m[4] == 'imported' and not m[10].startswith('consolidated into')]
    assert len(keys) == len(set(keys)), 'duplicate card keys'
    # write pack blocks
    text = PACK.read_text(encoding='utf-8')
    for fam, (tab, *_rest) in FAMILIES.items():
        a, b = f'/* SUPPLEMENT:{tab}:BEGIN */', f'/* SUPPLEMENT:{tab}:END */'
        i, j = text.index(a) + len(a), text.index(b)
        block = '\n' + '\n'.join(lines[fam]) + '\n          '
        text = text[:i] + block + text[j:]
    PACK.write_text(text, encoding='utf-8')
    with open(MAP, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['disposition_id', 'category', 'source_location', 'research_declaration', 'state', 'target',
                    'target_key', 'display_name', 'locators', 'work_gate', 'consolidation_rule', 'row_sha256'])
        w.writerows(mapping)
    n = sum(1 for m in mapping if m[4] == 'imported')
    print(f'{n} imported mapping rows ({sum(1 for m in mapping if m[0] and m[4]=="imported")} SD rows, '
          f'{sum(1 for m in mapping if m[2].startswith("child of"))} child views, '
          f'{sum(1 for m in mapping if m[0] and m[10].startswith("consolidated into"))} SD rows and '
          f'{sum(1 for m in mapping if not m[0] and m[10].startswith("consolidated into"))} prose views consolidated into another card); '
          f'{sum(1 for m in mapping if m[4]=="pending")} pending')


if __name__ == '__main__':
    main(sys.argv[1])

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
XWALK = HERE.parent / 'identity-crosswalk.csv'
TYPED = HERE.parent / 'typed-links.csv'
BASE = 'https://www.churchofjesuschrist.org/study/scriptures/'
sys.path.insert(0, str(HERE))
import copy_bom
import copy_nt
import copy_ot
import copy_otl
import copy_mp
import copy_wp
import copy_dc
import copy_dcp
import copy_dre
import copy_dca
import copy_dd
import copy_pgp
import copy_fm
import copy_geo
import copy_identity
import copy_links
import copy_bmc

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
            'ot': ('ot-more', [1], ['ot'], copy_ot), 'dc': ('dc-more', [4], ['dc'], copy_dc),
            'pgp': ('pgp-more', [5], ['pgp'], copy_pgp)}
BUILT = {f'SC0{i}': 'bom' for i in range(1, 8)}
BUILT.update({f'SC{i:02d}': 'nt' for i in range(8, 13)})
BUILT.update({f'SC{i:02d}': 'ot' for i in range(13, 24)})
BUILT.update({f'SC{i:02d}': 'ot' for i in range(24, 31)})
BUILT.update({f'SC{i:02d}': 'ot' for i in range(31, 35)})
BUILT.update({f'SC{i:02d}': 'dc' for i in range(35, 44)})
BUILT['SC45'] = 'dc'
BUILT.update({'SC46': 'pgp', 'SC47': 'pgp', 'SC48': 'pgp'})
BUILT.update({'SC52': 'bom', 'SC53': 'bom', 'SC54': 'bom'})
# families built over several checkpoints: rows without copy yet stay `pending`
PARTIAL = set()
COPY_MODULES = [copy_bom, copy_nt, copy_ot, copy_otl, copy_mp, copy_wp, copy_dc, copy_dcp, copy_dre, copy_dca, copy_dd, copy_pgp,
                copy_geo]
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
    text0 = PACK.read_text(encoding='utf-8')
    primary_names = {}
    for sd, (key, _d) in copy_fm.PRIMARY.items():
        m = re.search(r"\{ key: '%s', name: '((?:[^'\\]|\\.)*)', books: \[(\d)\]" % key, text0)
        assert m, key
        primary_names[key] = m.group(1).replace("\\'", "'")
    for key in copy_geo.DESC:
        m = re.search(r"\{ key: '%s', name: '((?:[^'\\]|\\.)*)', books: \[3\], layers: \['bom'\]" % key, text0)
        assert m, key
        primary_names[key] = m.group(1).replace("\\'", "'")
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
        if sd in copy_geo.ROWS:
            # SC53/SC54: the row's source view is an existing primary geography card; only its desc is rewritten
            key = copy_geo.ROWS[sd]
            mapping.append([sd, cat, r['source_location'], r['research_declaration'], 'imported',
                            f'codex:{copy_geo.TAB}', key, primary_names[key], '; '.join(t for t, _ in sources(r)),
                            r['work_gate'], f'consolidated into existing primary card {key}; ' + r['consolidation_rule'],
                            r['row_sha256']])
            continue
        if sd in copy_fm.PRIMARY:
            # SC50: the row's source view is an existing primary FM card; only that card's desc is rewritten
            key = copy_fm.PRIMARY[sd][0]
            locs = [t for t, _ in sources(r)] + [t for t, _ in copy_fm.ADDED_SOURCES.get(key, [])]
            mapping.append([sd, cat, r['source_location'], r['research_declaration'], 'imported',
                            'codex:reference-views', key, primary_names[key], '; '.join(locs),
                            r['work_gate'], f'consolidated into existing primary card {key}; ' + r['consolidation_rule'],
                            r['row_sha256']])
            continue
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
            no_merge = {k for m in COPY_MODULES for k in getattr(m, 'MERGE_NO_SRC', set())}
            for t, u in ([] if sd in no_merge else merged.get(sd, [])):
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
            assert not fam or cat in PARTIAL, f'{sd} in built family {cat} has no copy'
            mapping.append([sd, cat, r['source_location'], r['research_declaration'], 'pending', '', '', '', '',
                            r['work_gate'], r['consolidation_rule'], r['row_sha256']])
    for cat, key, name, desc, src in copy_bom.PROSE:
        src = [(t, BASE + p + '?lang=eng') for t, p in src]
        lines['bom'].append(entry(key, name, desc, src, [3], ['bom']))
        mapping.append(['', cat, 'prose', key, 'imported', 'codex:bom-more', key, name, '; '.join(t for t, _ in src),
                        '3/bom', 'prose-only section bullet; mandatory bounded content', ''])
    for cat, loc, rid, targets in copy_fm.PROSE_INTO_PRIMARY:
        mapping.append(['', cat, loc, rid, 'imported', 'codex:reference-views; codex:bom-more', targets, '', '',
                        '3/bom (FM04–07, person cards); FM08 4/dc; FM09 5/pgp',
                        'zero-row integration constraint carried as sentences in the named cards; no new event', ''])
    assert all(k in {r['disposition_id'] for r in rows} for k in copy)
    keys = [m[6] for m in mapping if m[4] == 'imported' and not m[10].startswith('consolidated into')]
    assert len(keys) == len(set(keys)), 'duplicate card keys'
    # write pack blocks
    text = PACK.read_text(encoding='utf-8')
    for i, t in copy_dd.TITLES.items():
        # the dossier cards' See-also titles must name existing cards
        assert re.search(r"key: 'DCM-%s-[^']*', name: %s" % (i.lower(), re.escape(js(t))), text), (i, t)
    for sd, (key, desc) in copy_fm.PRIMARY.items():
        # rewrite only the desc of the existing primary FM card (idempotent)
        pat = re.compile(r"(\{ key: '%s', name: '(?:[^'\\]|\\.)*', books: \[\d\], layers: \[[^\]]*\], desc: )"
                         r"'(?:[^'\\]|\\.)*'" % key)
        text, n = pat.subn(lambda m: m.group(1) + js(desc), text)
        assert n == 1, key
        for t, path in copy_fm.ADDED_SOURCES.get(key, []):
            # S22-C1: append the added source to the card's src list once; existing sources are kept
            add = '{ t: %s, u: %s }' % (js(t), js(BASE + path + '?lang=eng'))
            spat = re.compile(r"(\{ key: '%s', name: [^\n]*?, src: \[)([^\n]*?)(\] \},)" % key)
            m = spat.search(text)
            assert m, key
            if add not in m.group(2):
                text = text[:m.start(2)] + m.group(2) + ', ' + add + text[m.end(2):]
    for key, desc in copy_geo.DESC.items():
        # rewrite only the desc of the existing primary geography card (idempotent)
        pat = re.compile(r"(\{ key: '%s', name: '(?:[^'\\]|\\.)*', books: \[3\], layers: \['bom'\], desc: )"
                         r"'(?:[^'\\]|\\.)*'" % key)
        text, n = pat.subn(lambda m: m.group(1) + js(desc), text)
        assert n == 1, key
    names = set(re.findall(r"name: '((?:[^'\\]|\\.)*)'", text))
    fm_lines = [js(d) for _k, d in copy_fm.PRIMARY.values()] + [js(d) for d in copy_geo.DESC.values()]
    for fam_lines in lines.values():
        names |= {n for l in fam_lines for n in re.findall(r"name: '((?:[^'\\]|\\.)*)'", l)}
    for line in lines['pgp'] + lines['bom'] + fm_lines:
        # the PGP cards' See-also titles must name existing cards (any tab)
        also = re.search(r"See also: (.*?)\.'", line)
        for t in re.findall('“([^”]+)”', also.group(1)) if also else []:
            assert js(t.replace("\\'", "'"))[1:-1] in names, t
    for fam, (tab, *_rest) in FAMILIES.items():
        a, b = f'/* SUPPLEMENT:{tab}:BEGIN */', f'/* SUPPLEMENT:{tab}:END */'
        i, j = text.index(a) + len(a), text.index(b)
        block = '\n' + '\n'.join(lines[fam]) + '\n          '
        text = text[:i] + block + text[j:]
    text = write_see(text)
    text = write_bmc(text)
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


def card_line(text, key):
    """(start, end) of the single pack line holding codex card `key`."""
    m = list(re.finditer(r"^[ \t]*\{ key: '%s', [^\n]*$" % re.escape(key), text, re.M))
    assert len(m) == 1, (key, len(m))
    return m[0].start(), m[0].end()


def card_gate(line):
    b = re.search(r"books: \[(\d)\], layers: \['([a-z]+)'\]", line)
    return f'{b.group(1)}/{b.group(2)}'


def write_see(text):
    """Write copy_identity's See-also links onto their cards (idempotent) and the identity crosswalk CSV."""
    links = copy_identity.see_links()
    merged = {k: [(t, None) for t in v] for k, v in links.items()}
    for key, targets in copy_links.see_links().items():
        lst = merged.setdefault(key, [])
        for t, r in targets:
            if all(x != t for x, _ in lst):
                lst.append((t, r))
    ev_ids = set(re.findall(r"^\s+id: '([^']+)',\n\s+book: ", text, re.M))

    def ref(t, r):
        if t.startswith('ev:'):
            assert t[3:] in ev_ids, t
        else:
            card_line(text, t)
        return js(t) if r is None else '{ k: %s, r: %s }' % (js(t), js(r))

    for key, targets in merged.items():
        a, b = card_line(text, key)
        line = re.sub(r", see: \[[^\]]*\]", '', text[a:b])
        assert line.endswith(' },'), key
        line = line[:-3] + ', see: [' + ', '.join(ref(t, r) for t, r in targets) + '] },'
        text = text[:a] + line + text[b:]
    write_typed(text)
    rows = []
    for name, ident, hub, neutral, dc, pgp in copy_identity.PEOPLE:
        def views(keys):
            return '; '.join(f'{k} ({card_gate(text[slice(*card_line(text, k))])})' for k in keys)
        aliases = []
        for k in [hub] + neutral + dc + pgp:
            line = text[slice(*card_line(text, k))]
            for pat in copy_identity.ALIAS_PATTERNS[name]:
                for hit in re.findall(pat, line):
                    if hit not in aliases:
                        aliases.append(hit)
        rows.append([name, ident, f'{hub} ({card_gate(text[slice(*card_line(text, hub))])})', ' | '.join(aliases),
                     views(neutral), views(dc) or ('(identity card only)' if hub.startswith('DCM-') else '(none: no D&C card names this person)'),
                     views(pgp) or '(none)', len(links.get(hub, [])),
                     'each card keeps its own gate; links to later-work cards stay hidden (counted) until that work'
                     ' is reached; a filtered target is named, not linked; no surname-only kinship'])
    with open(XWALK, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['person', 'identity_key', 'identity_card', 'aliases_printed_on_linked_cards',
                    'neutral_source_views_3_bom', 'later_dc_views', 'later_pgp_views', 'see_links_on_identity_card',
                    'gate_and_navigation_rule'])
        w.writerows(rows)
    return text


def write_typed(text):
    """typed-links.csv: every contract row of copy_links with its cards, gates and link state."""
    def gate(k):
        if k.startswith('ev:'):
            m = re.search(r"id: '%s',\n\s+book: (\w+),[\s\S]*?layers: \['([a-z]+)'\]" % re.escape(k[3:]), text)
            return {'OT': '1', 'NT': '2', 'BOM': '3', 'DC': '4', 'PGP': '5'}[m.group(1)] + '/' + m.group(2) + ' (event)'
        return card_gate(text[slice(*card_line(text, k))])
    rows = []
    for row, rel, keys in copy_links.SAME:
        rows.append([row, 'same-entity group', rel, '; '.join(f'{k} ({gate(k)})' for k in keys), '',
                     'linked both ways between every pair'])
    for row, a, rel, b, inv in copy_links.TYPED:
        rows.append([row, 'typed', rel + (' / ' + inv if inv else ''), f'{a} ({gate(a)})', f'{b} ({gate(b)})',
                     'linked both ways' if inv else 'linked one way (events carry no links)'])
    for row, why in copy_links.UNLINKED:
        rows.append([row, 'not a codex link', '', '', '', why])
    with open(TYPED, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['contract_row', 'kind', 'relation_label', 'cards', 'target', 'state'])
        w.writerows(rows)


BMC_CSV = HERE.parent / 'bmc-source-views.csv'


ROLLUP_REASONS = {
    'reconciled-no-shared-name': 'rollup (checkpoint 36): no name of an entity with a shared Bible card occurs in '
                                 'this chapter’s ledger row, the full-read rows covering it or its record-support '
                                 'rows; reconciled against the committed research, not a full-text absence check of '
                                 'the chapter',
    'reconciled-hits-dispositioned': 'rollup (checkpoint 36): every shared-card name in the committed research for '
                                     'this chapter is dispositioned in bmc-omission-rollup.csv (namesake, '
                                     'range-spill or title); not a full-text absence check of the chapter',
    'candidate': 'rollup (checkpoint 36): a source view is proposed in bmc-omission-rollup.csv (candidate); still '
                 'omitted at this head',
    'reader': 'rollup (checkpoint 36): needs a reading decision recorded in bmc-omission-rollup.csv (reader); '
              'omitted until decided',
}


def rollup_reason(rollup, n, semantic=None):
    """Checkpoint 37: the semantic pass (bmc-semantic-dispositions.csv) gives each default omission its reason; the
    rollup state remains the name-scan record. A key missing from the semantic pass falls back to the rollup reason
    (only before the semantic pass has first been run)."""
    assert n in rollup, f'BMC-{n:03d} has no bespoke omission reason and no rollup row'
    if semantic and n in semantic:
        state, reason = semantic[n]
        return (f'semantic pass (checkpoint 37), {state}: {reason}. Limit: a reading of the committed research, not a '
                'certified textual absence (locators in bmc-semantic-dispositions.csv)')
    return ROLLUP_REASONS[rollup[n]]


def write_bmc(text):
    """Checkpoint 32: copy_bmc's Book of Mormon source views into the bom-bible tab, and bmc-source-views.csv, which
    accounts for every BMC key and every bmc_candidates.py scan hit. Idempotent."""
    chapters = {}
    for r in csv.DictReader(open(HERE.parent / 'coverage-bom.csv', encoding='utf-8')):
        m = re.search(r'BMC-(\d{3})', r['records'])
        chapters[int(m.group(1))] = (r['unit'], r['source_url'])
    assert sorted(chapters) == list(range(1, 240)), 'BMC-001..239 must each have one chapter row'
    verses = {r['unit']: int(r['captured_numbered_verses'])
              for r in csv.DictReader(open(HERE.parent / 'bom-source-witnesses.csv', encoding='utf-8'))}
    ev_ids = set(re.findall(r"^\s+id: '([^']+)',\n\s+book: ", text, re.M))
    ev_book = {i: {'OT': 1, 'NT': 2}.get(b, 9) for i, b in
               re.findall(r"^\s+id: '([^']+)',\n\s+book: ([A-Z]+),", text, re.M)}
    rollup = {}
    for r in csv.DictReader(open(HERE.parent / 'bmc-omission-rollup.csv', encoding='utf-8')):
        rollup.setdefault(int(r['research_key'][4:]), r['state'])
    semantic = {}
    sem_path = HERE.parent / 'bmc-semantic-dispositions.csv'
    if sem_path.exists():
        for r in csv.DictReader(open(sem_path, encoding='utf-8')):
            semantic[int(r['research_key'][4:])] = (r['semantic_state'], r['reason'])
    for key, desc in copy_bmc.PRIMARY_DESC.items():
        # checkpoint 60: rewrite only the desc of an existing primary 3/bom card (idempotent; sources unchanged)
        assert desc.startswith('Book of Mormon — '), key
        pat = re.compile(r"(\{ key: '%s', name: '(?:[^'\\]|\\.)*', books: \[3\], layers: \['bom'\], desc: )"
                         r"'(?:[^'\\]|\\.)*'" % key)
        text, n = pat.subn(lambda m: m.group(1) + js(desc), text)
        assert n == 1, key
    lines, rows, views = [], [], {}
    for n, suffix, name, mode, desc, vs, see in copy_bmc.VIEWS:
        assert n not in copy_bmc.OMIT, n
        unit, url = chapters[n]
        if vs is None:
            loc = f'{unit}:1–{verses[unit]}'
        elif isinstance(vs, str):
            loc = f'{unit}:{vs}'
        elif len(vs) == 3 and vs[1] == '–':
            loc = f'{unit}:{vs[0]}–{vs[2]}'
        else:
            loc = f'{unit}:' + ', '.join(str(v) for v in vs)
        key = f'BMV-{n:03d}-{suffix}'
        assert desc.startswith('Book of Mormon — ') and unit in name, key
        refs = []
        for t, rel in see:
            if t.startswith('ev:'):
                assert t[3:] in ev_ids and int(ev_book[t[3:]]) < 3, t
                gate = f"{ev_book[t[3:]]}/event"
            else:
                a, b = card_line(text, t)
                gate = card_gate(text[a:b])
                assert int(gate[0]) < 3, (t, gate)
            refs.append('{ k: %s, r: %s }' % (js(t), js(rel)))
            rows.append([f'BMC-{n:03d}', loc, t, gate, mode, rel, key, url, 'implemented', ''])
        if not see:
            rows.append([f'BMC-{n:03d}', loc, '', '', mode, '', key, url, 'implemented', copy_bmc.NOLINK[n]])
        extra = copy_bmc.EXTRA_SOURCES.get(n, [])
        assert all('/dc-testament/' not in u and '/pgp/' not in u for _t, u in extra), key  # no later work at 3/bom
        line = entry(key, name, desc, [(loc, url)] + extra, [3], ['bom'])
        if refs:
            line = line[:-3] + ', see: [' + ', '.join(refs) + '] },'
        lines.append(line)
        views.setdefault(n, []).append(key)
    for n in range(1, 240):
        unit, url = chapters[n]
        if n in views:
            continue
        why = copy_bmc.OMIT.get(n) or rollup_reason(rollup, n, semantic)
        rows.append([f'BMC-{n:03d}', unit, '', '', '', '', '', url, 'omitted', why])
    # name-scan hits: every one accepted (implemented by a view) or rejected with a reason
    import subprocess
    scan = subprocess.run([sys.executable, str(HERE / 'bmc_candidates.py'), str(ROOT)], capture_output=True,
                          text=True, check=True).stdout
    hits = list(csv.DictReader(scan.splitlines()))
    for h in hits:
        d = copy_bmc.SCAN_ROW.get((h['bmc'], h['name'])) or copy_bmc.SCAN_DEFAULT[h['name']]
        n = int(h['bmc'][4:])
        state = 'scan-accepted' if d.startswith('accept') else 'scan-rejected'
        if state == 'scan-accepted':
            assert n in views, (h['bmc'], h['name'])
        rows.append([h['bmc'], chapters[n][0], h['candidate_cards'], '', '', h['name'],
                     ';'.join(views.get(n, [])), chapters[n][1], state, d])
    a, b = '/* SUPPLEMENT:bom-bible:BEGIN */', '/* SUPPLEMENT:bom-bible:END */'
    i, j = text.index(a) + len(a), text.index(b)
    text = text[:i] + '\n' + '\n'.join(lines) + '\n          ' + text[j:]
    with open(BMC_CSV, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['research_key', 'locator', 'target', 'target_gate', 'mode', 'relation_label_or_scan_name',
                    'rendered_view', 'source', 'state', 'reason'])
        w.writerows(rows)
    print(f'BMC: {len(lines)} views over {len(views)} keys, {len(rows)} ledger rows, {len(hits)} scan hits')
    return text


if __name__ == '__main__':
    main(sys.argv[1])

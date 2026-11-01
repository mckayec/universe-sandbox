#!/usr/bin/env python3
"""Generate the supplementary codex block of public/atlas/packs/lds-standard-works.js and the per-SD-row
mapping docs/universes/packs/lds-standard-works/supplementary-implementation.csv.

Usage: python3 build.py <declaration-dispositions.csv>
The input is PR34's supplementary-dispositions/declaration-dispositions.csv (ChatGPT's accepted register).
Display copy lives in copy_*.py; sources come from each row's own markdown links. Rows whose family is not
built yet are written to the mapping as `pending` so the CSV always covers all 1,271 SD rows."""
import csv, hashlib, re, sys, pathlib

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[4]
PACK = ROOT / 'public/atlas/packs/lds-standard-works.js'
MAP = HERE.parent / 'supplementary-implementation.csv'
BASE = 'https://www.churchofjesuschrist.org/study/scriptures/'
sys.path.insert(0, str(HERE))
import copy_bom

BOOKS = {'1-ne': '1 Nephi', '2-ne': '2 Nephi', 'jacob': 'Jacob', 'enos': 'Enos', 'jarom': 'Jarom', 'omni': 'Omni',
         'w-of-m': 'Words of Mormon', 'mosiah': 'Mosiah', 'alma': 'Alma', 'hel': 'Helaman', '3-ne': '3 Nephi',
         '4-ne': '4 Nephi', 'morm': 'Mormon', 'ether': 'Ether', 'moro': 'Moroni'}
# family -> (tab id, gate books, gate layers)
FAMILIES = {'bom': ('bom-more', [3], ['bom'])}
BUILT = {f'SC0{i}': 'bom' for i in range(1, 8)}
LINK = re.compile(r'\[([^\]]+)\]\((https://[^)\s]+)\)')


def locator(text, url):
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
    for t, path in copy_bom.EXTRA_SRC.get(row['disposition_id'], []):
        out.append((t, BASE + path + '?lang=eng'))
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
    copy = copy_bom.COPY
    for r in rows:
        sd, cat = r['disposition_id'], r['category']
        fam = BUILT.get(cat)
        h = hashlib.sha256(r['minimum_retained_source_context'].encode()).hexdigest()
        if fam and sd in copy:
            key, name, desc = copy[sd]
            tab, books, layers = FAMILIES[fam]
            src = sources(r)
            assert src, sd
            lines[fam].append(entry(key, name, desc, src, books, layers))
            mapping.append([sd, cat, r['source_location'], r['research_declaration'], 'imported',
                            f'codex:{tab}', key, name, '; '.join(t for t, _ in src), r['work_gate'],
                            r['consolidation_rule'], r['row_sha256']])
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
    # write pack block
    text = PACK.read_text(encoding='utf-8')
    a, b = '/* SUPPLEMENT:bom-more:BEGIN */', '/* SUPPLEMENT:bom-more:END */'
    i, j = text.index(a) + len(a), text.index(b)
    block = '\n' + '\n'.join(lines['bom']) + '\n          '
    PACK.write_text(text[:i] + block + text[j:], encoding='utf-8')
    with open(MAP, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['disposition_id', 'category', 'source_location', 'research_declaration', 'state', 'target',
                    'target_key', 'display_name', 'locators', 'work_gate', 'consolidation_rule', 'row_sha256'])
        w.writerows(mapping)
    n = sum(1 for m in mapping if m[4] == 'imported')
    print(f'{n} imported mapping rows ({sum(1 for m in mapping if m[0] and m[4]=="imported")} SD rows); '
          f'{sum(1 for m in mapping if m[4]=="pending")} pending')


if __name__ == '__main__':
    main(sys.argv[1])

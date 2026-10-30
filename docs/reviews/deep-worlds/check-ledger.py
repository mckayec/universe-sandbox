"""Validate exported review identities/text against Node-evaluated pack JSON.
Usage: python check-ledger.py /tmp/deep-packs.json
Export packs by evaluating the six trusted repository pack files in Node vm;
this checks artifact consistency, not primary-source truth or rendered behavior.
"""
import collections
import csv
import json
import pathlib
import sys

packs = json.loads(pathlib.Path(sys.argv[1]).read_text())
rows = list(csv.DictReader(pathlib.Path(__file__).with_name('sample-ledger.csv').open()))
assert len(rows) == 210
assert len({r['sample_id'] for r in rows}) == 210
assert len({tuple(r[k] for k in ('pack', 'kind', 'world', 'site', 'object_id')) for r in rows}) == 210
for r in rows:
    p = packs[r['pack']]
    if r['kind'] == 'event':
        obj = next(x for x in p['events'] if x['id'] == r['object_id'])
        assert obj.get('world', '') == r['world'] and obj.get('site', '') == r['site']
        text = obj['text']
    else:
        w = next(x for x in p['worlds'] if x['id'] == r['world'])
        s = next(x for x in w['sites'] if x['id'] == r['site'])
        obj = next(x for x in s['scene']['landmarks'] if x['id'] == r['object_id'])
        text = obj['desc']
    assert text == r['current_text'], r['sample_id']
for pack in packs:
    group = [r for r in rows if r['pack'] == pack]
    assert collections.Counter(r['kind'] for r in group) == {'landmark': 20, 'event': 15}
counts = collections.Counter(r['comparison'] for r in rows)
assert counts == {'not-compared': 202, 'partial-or-corrective': 6, 'narrative-supported': 2}
print('210 unique IDs and exact current texts match; each pack 20 landmarks/15 events; comparison accounting matches.')

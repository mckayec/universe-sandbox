"""Usage: python validate-inventory.py /path/to/exact-build (Node required)."""
import csv
import hashlib
import json
from pathlib import Path
import subprocess
import sys

root = Path(sys.argv[1]).resolve()
base = Path(__file__).resolve().parent
loader = """const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');const c={window:{}};vm.createContext(c);const r=process.argv[1];for(const f of ['judaism','christianity','islam','encounters'])vm.runInContext(fs.readFileSync(path.join(r,'public/atlas/packs/abrahamic-world-religions',f+'.js'),'utf8'),c);vm.runInContext(fs.readFileSync(path.join(r,'public/atlas/packs/abrahamic-world-religions.js'),'utf8'),c);console.log(JSON.stringify(c.window.ATLAS_PACKS['abrahamic-world-religions']));"""
p = json.loads(subprocess.check_output(['node', '-e', loader, str(root)], text=True))
expected = {}
for typ, items in [('node',p['tree']['nodes']),('event',p['events'])] + [(t['id'],t['list']) for t in p['codex']]:
    for x in items:
        expected[typ+':'+x['id']] = x
for i,x in enumerate(p['tree']['links']):
    expected[f"link:{i+1:02d}:{x['from']}->{x['to']}"] = x
for world in p['worlds']:
    for x in world.get('sites',[]):
        expected['pin:'+x['id']] = x
rows = list(csv.DictReader(open(base/'copy-inventory.csv')))
assert len(rows) == len(expected) == 313
assert {r['record_key'] for r in rows} == set(expected)
for r in rows:
    digest = hashlib.sha256(json.dumps(expected[r['record_key']],sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
    assert r['payload_sha256'] == digest, r['record_key']
    assert r['passage_registers']
anchors = list(csv.DictReader(open(base/'q01-anchor-dispositions.csv')))
assert len(anchors) == len({r['anchor'] for r in anchors}) == 21
assert sum(r['disposition']=='supported' for r in anchors) == 7
for r in anchors:
    if r['disposition']=='supported':
        assert -90 <= float(r['latitude']) <= 90
        assert -180 <= float(r['longitude']) <= 180
    else:
        assert not r['latitude'] and not r['longitude']
print('PASS:313 exact payload hashes and unique keys;21 anchor dispositions;7 numeric reference packages. Artifact integrity only, not source verification.')

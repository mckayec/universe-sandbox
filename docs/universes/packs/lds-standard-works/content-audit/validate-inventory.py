"""Validate built-object hashes and finite accounting; not evidence of source reading."""
import csv
import hashlib
import json
import subprocess
import sys
from pathlib import Path

base = Path(__file__).resolve().parent
root = Path(sys.argv[1]).resolve()
loader = "const fs=require('fs'),vm=require('vm'),path=require('path');const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(process.argv[1],'public/atlas/packs/lds-standard-works.js'),'utf8'),c);console.log(JSON.stringify(c.window.ATLAS_PACKS['lds-standard-works']));"
p = json.loads(subprocess.check_output(['node','-e',loader,str(root)],text=True))
objects = {}
for kind,items in [('site',p['worlds'][0]['sites']),('event',p['events']),('route',p['worlds'][0]['routes']),('codex',[x for t in p['codex'] for x in t['list']])]:
    for x in items:
        objects[kind+':'+x.get('id',x.get('name'))] = x
rows = list(csv.DictReader(open(base/'built-record-inventory.csv')))
assert len(rows)==len(objects)==96
assert {r['record_key'] for r in rows}==set(objects)
for r in rows:
    value=json.dumps(objects[r['record_key']],sort_keys=True,ensure_ascii=False,separators=(',',':'))
    assert hashlib.sha256(value.encode()).hexdigest()==r['payload_sha256']
    file,line=r['research_location'].split(':')
    assert (base.parent/file).read_text().splitlines()[int(line)-1]==r['source_passage_context']
account=list(csv.DictReader(open(base/'research-import-accounting.csv')))
assert len(account)==len({r['research_id'] for r in account})==256
for r in account:
    if r['build_targets']:
        assert all(k in objects for k in r['build_targets'].split(';'))
    file,line=r['research_location'].split(':')
    assert (base.parent/file).read_text().splitlines()[int(line)-1]==r['research_row']
print('PASS:96 exact built payloads and256 unique primary research rows; cited rows and build targets resolve. Not a full-corpus/source certification.')

"""Pinned mapping delta, identity manifest and isolated generator integrity; not fresh primary reading."""
import csv, io, json, pathlib, subprocess, tempfile
HERE=pathlib.Path(__file__).resolve().parent; P='docs/universes/packs/lds-standard-works/'
HEAD='bf86c5316f499d7f85a7e6d5aff5ede83e957895'; BASE='bd7bdeec1cf302ae10e243dd08ad56c4a594a244'; RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(b):return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv'));assert read(HEAD,P+'supplementary-implementation.csv')==read(BASE,P+'supplementary-implementation.csv')
assert len(a)==1365;sd=[x for x in a if x['disposition_id']];assert len(sd)==1271 and all(x['state']=='imported' for x in a)
xw=rows(read(HEAD,P+'typed-links.csv'));assert len(xw)==121
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack']));cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')};events={'ev:'+e['id']:e for e in pack['events']}
with tempfile.TemporaryDirectory(prefix='church-s33-generator-') as d:
 root=pathlib.Path(d)
 names=subprocess.check_output(['git','ls-tree','-r','--name-only',HEAD,P+'supplementary-build/']).decode().splitlines()
 names += [P+'coverage-bom.csv',P+'coverage-bom.md',P+'bom-source-witnesses.csv',P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']
 for name in names:
  path=root/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(read(HEAD,name))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 for iteration in range(2):
  subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
  for path in [P+'bmc-source-views.csv',P+'supplementary-implementation.csv',P+'identity-crosswalk.csv',P+'typed-links.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path),(iteration,path)
r={'head':HEAD,'base':BASE,'acceptedRegister':RESEARCH,'mappingRows':len(a),'importedSD':len(sd),'pendingSD':0,'mappingUnchanged':True,'typedContractRows':len(xw),'generatorPasses':2,'packMappingAndBothCrosswalksByteIdentical':True,'newImports':0}
(HERE/'accounting-result.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))

ledger=rows(read(HEAD,P+'bmc-source-views.csv'));assert len(ledger)==369
from collections import Counter
counts=Counter(r['state'] for r in ledger);assert counts=={'implemented':68,'omitted':200,'scan-accepted':26,'scan-rejected':75}
assert len({r['research_key'] for r in ledger})==239

assert sum(r['state']=='omitted' and r['reason'].startswith('generated default') for r in ledger)==189
with (HERE/'delta-ledger.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=list(ledger[0]),lineterminator='\n');w.writeheader()
 for row in ledger:
  if row['research_key'] in ['BMC-011','BMC-014','BMC-017','BMC-022','BMC-039','BMC-042','BMC-166','BMC-227','BMC-224']:w.writerow(row)
print(dict(counts))

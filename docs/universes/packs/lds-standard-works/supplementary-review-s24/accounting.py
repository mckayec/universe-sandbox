"""Pinned mapping delta, identity manifest and isolated generator integrity; not fresh primary reading."""
import csv, io, json, pathlib, subprocess, tempfile
HERE=pathlib.Path(__file__).resolve().parent; P='docs/universes/packs/lds-standard-works/'
HEAD='8ec67f4732b1e253a31f3a5e802a7bd4d183e44a'; BASE='e09d6e83bb8774e798cdf583150f380eff2b0282'; RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(b):return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv')); b=rows(read(BASE,P+'supplementary-implementation.csv'))
assert len(a)==len(b)==1365
changed=[]
for x,y in zip(a,b):
 if x!=y:
  changed.append(x['disposition_id']);z=y.copy();z['locators']+='; Church, Book of Mormon Geography';assert x==z
assert changed==['SD1261','SD1262','SD1263']
sd=[x for x in a if x['disposition_id']];assert len(sd)==1271 and all(x['state']=='imported' for x in a)
xw=rows(read(HEAD,P+'identity-crosswalk.csv'));assert len(xw)==12;assert len({x['identity_key'] for x in xw})==12
links=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--links']));by={x['key']:x for x in links}
with (HERE/'identity-dispositions.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['person','accepted_identity','hub','source_view_count','all_target_keys','disposition','evidence_basis'])
 for x in xw:
  hub=x['identity_card'].split(' ')[0];c=by[hub];assert len(c['see'])==int(x['see_links_on_identity_card'])
  for key in c['see']:assert hub in by[key]['see']
  w.writerow([x['person'],x['identity_key'],hub,len(c['see']),'; '.join(c['see']),'source-view association supported; own gates preserved; not a new kinship edge','existing accepted/source-backed copy and locators; no fresh full-source reading'])
with tempfile.TemporaryDirectory(prefix='lds-s24-generator-') as d:
 root=pathlib.Path(d)
 names=subprocess.check_output(['git','ls-tree','-r','--name-only',HEAD,P+'supplementary-build/']).decode().splitlines()
 names += [P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']
 for name in names:
  path=root/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(read(HEAD,name))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 for iteration in range(2):
  subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
  for path in [P+'supplementary-implementation.csv',P+'identity-crosswalk.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path),(iteration,path)
r={'head':HEAD,'base':BASE,'acceptedRegister':RESEARCH,'mappingRows':len(a),'importedSD':len(sd),'pendingSD':0,'mappingChanges':changed,'identityRows':len(xw),'generatorPasses':2,'packMappingAndIdentityCrosswalkByteIdentical':True,'newImports':0,'freshPrimaryReading':False}
(HERE/'accounting-result.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))

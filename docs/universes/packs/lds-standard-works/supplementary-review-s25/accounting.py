"""Pinned mapping delta, identity manifest and isolated generator integrity; not fresh primary reading."""
import csv, io, json, pathlib, subprocess, tempfile
HERE=pathlib.Path(__file__).resolve().parent; P='docs/universes/packs/lds-standard-works/'
HEAD='1e8753001d674992603dee6153175c54204f60e9'; BASE='8ec67f4732b1e253a31f3a5e802a7bd4d183e44a'; RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(b):return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv'));assert read(HEAD,P+'supplementary-implementation.csv')==read(BASE,P+'supplementary-implementation.csv')
assert len(a)==1365;sd=[x for x in a if x['disposition_id']];assert len(sd)==1271 and all(x['state']=='imported' for x in a)
xw=rows(read(HEAD,P+'typed-links.csv'));assert len(xw)==48
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack']));cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')};events={'ev:'+e['id']:e for e in pack['events']}
import re
with (HERE/'contract-dispositions.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['contract_row','kind','relation','targets_and_source_copy','disposition'])
 for x in xw:
  keys=[v.strip().split(' ')[0] for v in (x['cards']+'; '+x['target']).split(';') if v.strip()];evidence=[]
  for k in keys:
   c=events.get(k) or cards[k];evidence.append({'key':k,'name':c.get('name',c.get('title')),'copy':c.get('desc',c.get('text')),'sources':c.get('src',[]),'gate':c.get('books',c.get('book')),'layers':c.get('layers')})
  verdict='matches accepted source-view/typed-relation contract; no fresh source validation'
  if x['kind']=='not a codex link':verdict='bounded non-link/open disposition retained; not final integration closure'
  if x['contract_row'].startswith('galilee-region,'):verdict='S25-C1 correction: Eden, Nod and Enoch have multiple existing source views; replace bundled single-view disposition'
  if x['contract_row']=='DD122 / DD123 explain RC02':verdict='builder reading accepted: only DD121 explains RC02; fresh official D&C 121:41-42, 122 and 123 comparison'
  w.writerow([x['contract_row'],x['kind'],x['relation_label'],json.dumps(evidence,ensure_ascii=False),verdict])
with tempfile.TemporaryDirectory(prefix='lds-s24-generator-') as d:
 root=pathlib.Path(d)
 names=subprocess.check_output(['git','ls-tree','-r','--name-only',HEAD,P+'supplementary-build/']).decode().splitlines()
 names += [P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']
 for name in names:
  path=root/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(read(HEAD,name))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 for iteration in range(2):
  subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
  for path in [P+'supplementary-implementation.csv',P+'identity-crosswalk.csv',P+'typed-links.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path),(iteration,path)
r={'head':HEAD,'base':BASE,'acceptedRegister':RESEARCH,'mappingRows':len(a),'importedSD':len(sd),'pendingSD':0,'mappingUnchanged':True,'typedContractRows':len(xw),'generatorPasses':2,'packMappingAndBothCrosswalksByteIdentical':True,'newImports':0}
(HERE/'accounting-result.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))

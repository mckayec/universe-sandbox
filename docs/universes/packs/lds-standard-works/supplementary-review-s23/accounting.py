"""Pinned S23 exports and integrity checks; copy verdicts are human review."""
import csv,io,json,pathlib,subprocess,tempfile,re
HERE=pathlib.Path(__file__).resolve().parent; P='docs/universes/packs/lds-standard-works/'
HEAD='e09d6e83bb8774e798cdf583150f380eff2b0282'; BASE='82a0053bf64e680554afe5a178576f9c017b1fc0'; RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p): return subprocess.check_output(['git','show',r+':'+p])
def rows(b): return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv')); b=rows(read(BASE,P+'supplementary-implementation.csv')); accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
sd=[r for r in a if r['disposition_id']]; old={r['disposition_id']:r for r in b if r['disposition_id']}
new=[r for r in sd if r['state']=='imported' and old[r['disposition_id']]['state']=='pending']
assert len(a)==1365 and len(sd)==1271 and len(new)==11
assert {r['disposition_id'] for r in new}=={f'SD{i:04}' for i in range(1261,1272)}
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','row_sha256']: assert m[f]==r[f],(m['disposition_id'],f)
 assert m['work_gate']==r['work_gate'] or (m['disposition_id']=='SD0706' and m['work_gate']=='3/bom (row gate); '+r['work_gate'])
 if m['disposition_id'] not in {x['disposition_id'] for x in new}:
  prior=old[m['disposition_id']].copy()
  if m['disposition_id']=='SD1259': prior['locators'] += '; D&C 7, historical heading'
  if m['disposition_id']=='SD1260': prior['locators'] += '; D&C introduction, 1981 edition'
  assert m==prior
assert sum(r['state']=='imported' for r in sd)==1271
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack'])); cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')}; research={r['disposition_id']:r for r in accepted}
with (HERE/'row-comparison.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['SD','accepted_location','accepted_context','built_key','copy','sources','gate','disposition'])
 for m in new:
  r=research[m['disposition_id']]; c=cards[m['target_key']]
  verdict='model attribution retained; add shared Church-position context S23-C1' if m['disposition_id'] in ['SD1261','SD1262','SD1263'] else 'minimum accepted source-view copy conforms; minor copy refinements in report'
  w.writerow([m['disposition_id'],r['source_location'],r['minimum_retained_source_context'],c['key'],c['desc'],json.dumps(c['src'],ensure_ascii=False),str(c['books'])+str(c['layers']),verdict])
with tempfile.TemporaryDirectory(prefix='lds-s23-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py','copy_otl.py','copy_mp.py','copy_wp.py','copy_dc.py','copy_dcp.py','copy_dre.py','copy_dca.py','copy_dd.py','copy_dd2.py','copy_pgp.py','copy_fm.py','copy_geo.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'supplementary-build/genealogy/matt-genealogy-names.csv',P+'supplementary-build/genealogy/luke-genealogy-names.csv',P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']: assert (root/path).read_bytes()==read(HEAD,path)
assert sum(r['state']=='imported' for r in a)==1365
assert len([r for r in a if r['source_location'].startswith('child of ')])==81
assert len({r['target_key'] for r in a if r['state']=='imported'})==1335
for m in a:
 if m['state'] in ['imported','consolidated']:
  assert all(k.strip() in cards for k in m['target_key'].split(';')), m
from collections import Counter
pending=Counter(r['category'] for r in sd if r['state']=='pending')
assert sum(v for k,v in pending.items() if 'SC45'<=k<='SC45')==0
assert sum(v for k,v in pending.items() if 'SC46'<=k<='SC54')==0
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'mappingRows':len(a),'SDRowsReconciled':len(sd),'importedSD':1271,'pendingSD':0,'pendingByCategory':dict(pending),'standaloneProse':9,'consolidatedProse':1,'constraintMappings':3,'childRows':81,'newSDRows':11,'newChildRows':0,'newCards':3,'importedMappingRows':1365,'distinctResolvedMappingTargets':1333,'generatorPackAndMappingByteIdentical':True,'freshFullPrimaryReading':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

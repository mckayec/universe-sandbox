"""Pinned S16 exports and integrity checks; copy verdicts are human review."""
import csv,io,json,pathlib,subprocess,tempfile,re
HERE=pathlib.Path(__file__).resolve().parent; P='docs/universes/packs/lds-standard-works/'
HEAD='1a6b94eea246a39a795d79c22204226e2d8f001e'; BASE='a136f70aec3a7ff7c47c020b06205cf2d4587506'; RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p): return subprocess.check_output(['git','show',r+':'+p])
def rows(b): return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv')); b=rows(read(BASE,P+'supplementary-implementation.csv')); accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
sd=[r for r in a if r['disposition_id']]; old={r['disposition_id']:r for r in b if r['disposition_id']}
new=[r for r in sd if r['state']=='imported' and old[r['disposition_id']]['state']=='pending']
assert len(a)==1352 and len(sd)==1271 and len(new)==36
assert {r['disposition_id'] for r in new}=={f'SD{i:04}' for i in range(998,1034)}
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','row_sha256']: assert m[f]==r[f],(m['disposition_id'],f)
 assert m['work_gate']==r['work_gate'] or (m['disposition_id']=='SD0706' and m['work_gate']=='3/bom (row gate); '+r['work_gate'])
 if m['disposition_id'] not in {x['disposition_id'] for x in new}|{'SD0826','SD0864','SD0962'}: assert m==old[m['disposition_id']]
assert sum(r['state']=='imported' for r in sd)==1033
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack'])); cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')}; research={r['disposition_id']:r for r in accepted}
with (HERE/'row-comparison.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['SD','accepted_location','accepted_context','built_key','copy','sources','gate','disposition'])
 for m in new:
  r=research[m['disposition_id']]; c=cards[m['target_key']]; verdict='conforms to accepted relation/office/context minimum; not independent historical certification'
  w.writerow([m['disposition_id'],r['source_location'],r['minimum_retained_source_context'],c['key'],c['desc'],json.dumps(c['src'],ensure_ascii=False),str(c['books'])+str(c['layers']),verdict])
with tempfile.TemporaryDirectory(prefix='lds-s16-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py','copy_otl.py','copy_mp.py','copy_wp.py','copy_dc.py','copy_dcp.py','copy_dre.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'supplementary-build/genealogy/matt-genealogy-names.csv',P+'supplementary-build/genealogy/luke-genealogy-names.csv',P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']: assert (root/path).read_bytes()==read(HEAD,path)
assert sum(r['state']=='imported' for r in a)==1114
assert len([r for r in a if r['source_location'].startswith('child of ')])==73
assert len({r['target_key'] for r in a if r['state']=='imported'})==1102
for m in a:
 if m['state'] in ['imported','consolidated']:
  assert m['target_key'] in cards, m
from collections import Counter
pending=Counter(r['category'] for r in sd if r['state']=='pending')
assert sum(v for k,v in pending.items() if 'SC42'<=k<='SC45')==178
assert sum(v for k,v in pending.items() if 'SC46'<=k<='SC54')==60
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'mappingRows':len(a),'SDRowsReconciled':len(sd),'importedSD':1033,'pendingSD':238,'pendingByCategory':dict(pending),'standaloneProse':7,'consolidatedProse':1,'childRows':73,'newSDRows':36,'newChildRows':1,'newCards':37,'importedMappingRows':1114,'supplementaryCards':1102,'generatorPackAndMappingByteIdentical':True,'freshFullPrimaryReading':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

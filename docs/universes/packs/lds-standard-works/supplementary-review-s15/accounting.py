"""Pinned S15 exports and integrity checks; copy verdicts are human review."""
import csv,io,json,pathlib,subprocess,tempfile,re
HERE=pathlib.Path(__file__).resolve().parent; P='docs/universes/packs/lds-standard-works/'
HEAD='a136f70aec3a7ff7c47c020b06205cf2d4587506'; BASE='0b8c8f8c5419712ac096fb7c72fd1dc96758361b'; RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p): return subprocess.check_output(['git','show',r+':'+p])
def rows(b): return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv')); b=rows(read(BASE,P+'supplementary-implementation.csv')); accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
sd=[r for r in a if r['disposition_id']]; old={r['disposition_id']:r for r in b if r['disposition_id']}
new=[r for r in sd if r['state']=='imported' and old[r['disposition_id']]['state']=='pending']
assert len(a)==1351 and len(sd)==1271 and len(new)==138
assert {r['disposition_id'] for r in new}=={f'SD{i:04}' for i in range(860,998)}
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','row_sha256']: assert m[f]==r[f],(m['disposition_id'],f)
 assert m['work_gate']==r['work_gate'] or (m['disposition_id']=='SD0706' and m['work_gate']=='3/bom (row gate); '+r['work_gate'])
 if m['disposition_id'] not in {x['disposition_id'] for x in new}: assert m==old[m['disposition_id']]
assert sum(r['state']=='imported' for r in sd)==997
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack'])); cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')}; research={r['disposition_id']:r for r in accepted}
with (HERE/'row-comparison.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['SD','accepted_location','accepted_context','built_key','copy','sources','gate','disposition'])
 for m in new:
  r=research[m['disposition_id']]; c=cards[m['target_key']]; verdict={'SD0864':'S15-C1 retain later-work surname resolution with correct gate','SD0962':'S15-C2 separate house contract from stock instruction'}.get(m['disposition_id'],'conforms to accepted name/locator/identity minimum; role integration remains')
  w.writerow([m['disposition_id'],r['source_location'],r['minimum_retained_source_context'],c['key'],c['desc'],json.dumps(c['src'],ensure_ascii=False),str(c['books'])+str(c['layers']),verdict])
# Independently resolve section-level source targets from each accepted roster locator.
shared=0; constraints=0
for m in new:
 r=research[m['disposition_id']];parts=[x.strip() for x in r['minimum_retained_source_context'].split('|') if x.strip()];key,name,loc,limit=parts
 c=cards[m['target_key']];assert c['name']==name,(m['disposition_id'],name)
 assert c['key']=='DCM-'+key.strip('`')
 expected=set()
 for segment in loc.split(';'):
  if segment.startswith('OD'): expected.add('dc-testament/od/'+segment[2])
  else:
   match=re.match(r'(\d+)(?:–(\d+))?',segment);assert match,segment
   for n in range(int(match[1]),int(match[2] or match[1])+1):expected.add('dc-testament/dc/'+str(n))
 actual={u['u'].split('/scriptures/')[1].split('?')[0] for u in c['src']}
 assert actual==expected,(m['disposition_id'],actual,expected)
 if limit.startswith('Same named participant'):shared+=1
 else:constraints+=1
assert (shared,constraints)==(102,36)
with tempfile.TemporaryDirectory(prefix='lds-s15-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py','copy_otl.py','copy_mp.py','copy_wp.py','copy_dc.py','copy_dcp.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'supplementary-build/genealogy/matt-genealogy-names.csv',P+'supplementary-build/genealogy/luke-genealogy-names.csv',P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']: assert (root/path).read_bytes()==read(HEAD,path)
from collections import Counter
pending=Counter(r['category'] for r in sd if r['state']=='pending')
assert sum(v for k,v in pending.items() if 'SC41'<=k<='SC45')==214
assert sum(v for k,v in pending.items() if 'SC46'<=k<='SC54')==60
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'mappingRows':len(a),'SDRowsReconciled':len(sd),'importedSD':997,'pendingSD':274,'pendingByCategory':dict(pending),'standaloneProse':7,'consolidatedProse':1,'childRows':72,'newSDRows':138,'newChildRows':0,'newCards':138,'importedMappingRows':1077,'supplementaryCards':1065,'generatorPackAndMappingByteIdentical':True,'freshFullPrimaryReading':False,'rosterNameKeySourceSetsChecked':138,'sharedRuleRows':shared,'individualConstraintRows':constraints}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

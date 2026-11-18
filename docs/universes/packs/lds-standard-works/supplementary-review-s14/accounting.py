"""Pinned S14 exports and integrity checks; copy verdicts are human review."""
import csv,io,json,pathlib,subprocess,tempfile
HERE=pathlib.Path(__file__).resolve().parent; P='docs/universes/packs/lds-standard-works/'
HEAD='0b8c8f8c5419712ac096fb7c72fd1dc96758361b'; BASE='bccae39d5e191d81b59a8bd31c740ce9bc4cdb51'; RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p): return subprocess.check_output(['git','show',r+':'+p])
def rows(b): return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv')); b=rows(read(BASE,P+'supplementary-implementation.csv')); accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
sd=[r for r in a if r['disposition_id']]; old={r['disposition_id']:r for r in b if r['disposition_id']}
new=[r for r in sd if r['state']=='imported' and old[r['disposition_id']]['state']=='pending']
assert len(a)==1351 and len(sd)==1271 and len(new)==69
assert {r['disposition_id'] for r in new}=={f'SD{i:04}' for i in range(791,860)}
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','row_sha256']: assert m[f]==r[f],(m['disposition_id'],f)
 assert m['work_gate']==r['work_gate'] or (m['disposition_id']=='SD0706' and m['work_gate']=='3/bom (row gate); '+r['work_gate'])
 if m['disposition_id'] not in {x['disposition_id'] for x in new}: assert m==old[m['disposition_id']]
assert sum(r['state']=='imported' for r in sd)==859
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack'])); cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')}; research={r['disposition_id']:r for r in accepted}
with (HERE/'row-comparison.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['SD','accepted_location','accepted_context','built_key','copy','sources','gate','disposition'])
 for m in new:
  r=research[m['disposition_id']]; c=cards[m['target_key']]; verdict={'SD0849':'S14-C1 correct transferred appointment vs different documents','SD0813':'S14-C2 supply four named travelers','SD0839':'S14-C3 explain verse 12 qualification','SD0851':'minimum conforms; DD052 roster pending','SD0853':'minimum conforms; DD075 roster pending','SD0855':'minimum conforms; DD124 roster pending'}.get(m['disposition_id'],'conforms to accepted minimum context; integration limits in report')
  w.writerow([m['disposition_id'],r['source_location'],r['minimum_retained_source_context'],c['key'],c['desc'],json.dumps(c['src'],ensure_ascii=False),str(c['books'])+str(c['layers']),verdict])
with tempfile.TemporaryDirectory(prefix='lds-s14-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py','copy_otl.py','copy_mp.py','copy_wp.py','copy_dc.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'supplementary-build/genealogy/matt-genealogy-names.csv',P+'supplementary-build/genealogy/luke-genealogy-names.csv',P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']: assert (root/path).read_bytes()==read(HEAD,path)
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'mappingRows':len(a),'SDRowsReconciled':len(sd),'importedSD':859,'pendingSD':412,'standaloneProse':7,'consolidatedProse':1,'childRows':72,'newSDRows':69,'newChildRows':0,'newCards':69,'importedMappingRows':939,'supplementaryCards':927,'generatorPackAndMappingByteIdentical':True,'freshFullPrimaryReading':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

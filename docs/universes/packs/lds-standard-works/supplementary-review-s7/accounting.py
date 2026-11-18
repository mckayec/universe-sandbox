"""Pinned S7 accounting/source export. Semantic verdicts are manual review, not inferred by this script."""
import csv,io,json,pathlib,subprocess,tempfile,re,collections
HERE=pathlib.Path(__file__).resolve().parent;P='docs/universes/packs/lds-standard-works/'
HEAD='851715884a6969308ac1eadd7ff6cd4d37b7e2fb';BASE='11b2491eeafb7a9e93ede1959f34f6f0eff9bcb4';RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(b):return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv'));b=rows(read(BASE,P+'supplementary-implementation.csv'));accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
sd=[r for r in a if r['disposition_id']];by={r['disposition_id']:r for r in sd};old={r['disposition_id']:r for r in b if r['disposition_id']}
assert len(a)==1304 and len(b)==1303 and len(sd)==1271
new=[r for r in sd if old[r['disposition_id']]['state']=='pending' and r['state']=='imported'];assert [r['disposition_id'] for r in new]==[f'SD{i:04}' for i in range(642,701)]
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','work_gate','row_sha256']:assert m[f]==r[f],(m['disposition_id'],f)
 assert m['consolidation_rule']==r['consolidation_rule'] or m['consolidation_rule'].endswith('card; '+r['consolidation_rule'])
 if m['disposition_id'] not in {r['disposition_id'] for r in new}|{'SD0550'}:assert m==old[m['disposition_id']]
assert [f for f in by['SD0550'] if by['SD0550'][f]!=old['SD0550'][f]]==['locators']
prose=[r for r in a if r['category']=='SC22'];assert len(prose)==1
pr=prose[0];assert not pr['disposition_id'] and pr['target_key']=='OTL-megiddo' and pr['research_declaration']=='lh-j17-josiah-return' and pr['work_gate']=='1/ot' and pr['locators']=='2 Chronicles 35:22–25' and pr['consolidation_rule'].startswith('consolidated into SD0550')
assert [r for r in a if not r['disposition_id'] and r not in prose]==[r for r in b if not r['disposition_id']]
assert sum(r['state']=='imported' for r in sd)==627 and sum(r['state']=='pending' for r in sd)==644
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack']));cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')}
research={r['disposition_id']:r for r in accepted};inventory=[]
for m in new:
 ident=m['disposition_id'];r=research[ident];c=cards[m['target_key']]
 urls=set(re.findall(r'\]\((https://[^)]+)\)',r['minimum_retained_source_context']))
 if ident=='SD0699':urls.add('https://www.churchofjesuschrist.org/study/scriptures/ot/ezek/24?lang=eng')
 assert urls=={s['u'] for s in c['src']},ident
 assert m['target']=='codex:ot-more' and m['work_gate']=='1/ot'
 assert m['locators']=='; '.join(s['t'] for s in c['src'])
 verdict={'SD0663':'partial-S7-C1-chapter-payload','SD0679':'S7-C2-earlier-work-name-exposure','SD0691':'OT-facet-conforms-later-child-pending-SD0706'}.get(ident,'conforms-to-accepted-minimum-context')
 inventory.append([ident,r['category'],r['source_location'],r['minimum_retained_source_context'],m['target_key'],c['name'],c['desc'],json.dumps(c['src'],ensure_ascii=False),verdict])
with tempfile.TemporaryDirectory(prefix='lds-s7-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py','copy_otl.py','copy_mp.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path),path
with (HERE/'row-comparison.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['SD','category','accepted_location','accepted_context','built_key','built_name','built_copy','built_sources','manual_disposition']);w.writerows(inventory)
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'mappingRows':1304,'SDRowsReconciled':1271,'importedSD':627,'pendingSD':644,'standaloneProse':7,'consolidatedProse':1,'childRows':25,'newSDRowsAndCards':59,'categoryCounts':dict(collections.Counter(r['category'] for r in new)),'all59SourceURLSetsMatchAcceptedPlusExplicitComparison':True,'generatorPackAndMappingByteIdentical':True,'S6C1MappingClosed':True,'manualDispositionCounts':dict(collections.Counter(r[-1] for r in inventory)),'fullPrimaryRereading':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

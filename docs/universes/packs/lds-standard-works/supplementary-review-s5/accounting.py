"""Pinned S5 delta, parent/child provenance and isolated regeneration. Verdicts are manual review inputs."""
import csv,io,json,pathlib,subprocess,tempfile,importlib.util,re,collections
HERE=pathlib.Path(__file__).resolve().parent;P='docs/universes/packs/lds-standard-works/'
HEAD='6067a78b1da53224026f7cd8ae0273a36c7f54b5';BASE='665f82590881ee8664b70bb88543e71a0965b7d1';RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6';REVIEW='f571cb96d3aa06a947a98aeec8e52348574d6c0c'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(b):return list(csv.DictReader(io.StringIO(b.decode())))
def writecsv(n,header,items):
 with (HERE/n).open('w',newline='') as f:
  w=csv.writer(f,lineterminator='\n');w.writerow(header);w.writerows(items)
a=rows(read(HEAD,P+'supplementary-implementation.csv'));b=rows(read(BASE,P+'supplementary-implementation.csv'))
assert len(a)==1303 and len(b)==1278
kids=[r for r in a if r['source_location'].startswith('child of ')];sd=[r for r in a if r['disposition_id']];prose=[r for r in a if not r['disposition_id'] and r not in kids]
assert (len(sd),len(kids),len(prose))==(1271,25,7)
accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'));by={r['disposition_id']:r for r in sd}
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','work_gate','consolidation_rule','row_sha256']:assert m[f]==r[f]
assert sum(r['state']=='imported' for r in sd)==475 and sum(r['state']=='pending' for r in sd)==796
baseline={r['disposition_id']:r for r in b if r['disposition_id']}
changes=[]
for r in sd:
 before=baseline[r['disposition_id']]
 if r!=before:
  assert [f for f in r if r[f]!=before[f]]==['locators'];changes.append(r['disposition_id'])
assert changes==['SD0206','SD0311','SD0354','SD0441']
assert prose==[r for r in b if not r['disposition_id']]
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack']));delta=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--delta']))
tabs={t['id']:t['list'] for t in pack['codex']};allcards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')}
nt=read(RESEARCH,P+'coverage-nt.md').decode().splitlines();ot=read(RESEARCH,P+'coverage-ot-history.md').decode().splitlines()
def ledger(ids):
 out=[]
 for i in ids:
  matches=[(n+1,l) for n,l in enumerate(nt) if ('`'+i+'` /') in l or ('`'+i+'`;') in l]
  assert len(matches)==1,(i,matches);n,l=matches[0];out.append(('coverage-nt.md:'+str(n),l))
 return out
sourceids={}
sourceids['NTE-temptations-luke']=['NT-luke-4']
for n in [4,5,6]:sourceids['NTE-jerusalem-community-'+str(n)]=['NT-acts-'+str(n)]
for n in range(22,27):sourceids['NTE-arrest-hearings-'+str(n)]=['NT-acts-'+str(n)]
rev=[[5],[6],[7],[8,9],[10],[11],[12],[13],[14],[15],[16],[17,18],[19],[20],[21,22]]
for n,chapters in enumerate(rev,1):sourceids[f'NTC-vision-sequence-{n:02}']=['NT-rev-'+str(c) for c in chapters]+(['NTX-revelation-woman-time'] if n==7 else [])
comparison=[]
with tempfile.TemporaryDirectory(prefix='lds-s5-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'coverage-ot-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 mods=[]
 for family in ['bom','nt','ot']:
  spec=importlib.util.spec_from_file_location('audit_'+family,root/(P+'supplementary-build/copy_'+family+'.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);mods.append(m)
 children={k:v for m in mods for k,v in m.CHILDREN.items()};assert len(children)==sum(len(m.CHILDREN) for m in mods)
 assert {k:len(v) for k,v in children.items()}=={'SD0213':1,'SD0226':3,'SD0236':5,'SD0270':15,'SD0443':1}
 for parent,cs in children.items():
  pm=by[parent];li=tabs[pm['target'].split(':')[1]];pos=next(n for n,c in enumerate(li) if c['key']==pm['target_key']);mp=a.index(pm)
  for offset,(key,name,desc,src) in enumerate(cs,1):
   c=li[pos+offset];mapping=a[mp+offset]
   assert (c['key'],c['name'],c['desc'])==(key,name,desc)
   expected=[{'t':t,'u':'https://www.churchofjesuschrist.org/study/scriptures/'+p+'?lang=eng'} for t,p in src];assert c['src']==expected
   assert mapping['target_key']==key and mapping['source_location']=='child of '+parent and not mapping['disposition_id']
   assert mapping['research_declaration']==pm['target_key'] and mapping['work_gate']==pm['work_gate'] and mapping['category']==pm['category'] and mapping['target']==pm['target']
   assert mapping['locators']=='; '.join(s['t'] for s in c['src'])
   if key=='OHJ-12-stages':
    sources=[('coverage-ot-history.md:246',ot[245]),('supplementary-review-s4.md S4-C2','Complete retained sequence and Deuteronomy distinction from the pinned prior review')]
    # The complete ordered sequence, not merely four sample stops, is preserved.
    ordered=ot[245].split('** ')[1].split('. Final camp')[0].split(' → ')
    built=desc.split('lists the stages in this order: ')[1].split('; the final camp')[0].split(' → ')
    assert ordered==built,(ordered,built)
    assert 'Beth-jesimoth to Abel-shittim' in desc
   else:sources=ledger(sourceids[key])
   disposition='conforms-to-accepted-context'
   if key=='NTE-jerusalem-community-6':disposition='partial-S3-C1-Nicolas-origin-facet'
   comparison.append([parent,key,';'.join(x[0] for x in sources),'\n'.join(x[1] for x in sources),name,desc,json.dumps(expected,ensure_ascii=False),disposition])
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path),path
assert len(comparison)==25
writecsv('child-comparison.csv',['parent_SD','child_key','accepted_source_locations','accepted_context','built_name','built_copy','built_sources','disposition'],comparison)
corrections=[]
for d in delta['changed']:
 c=d['after'];m=next(r for r in sd if r['target_key']==c['key'])
 corrections.append([m['disposition_id'],c['key'],d['before']['desc'],c['desc'],json.dumps(c['src'],ensure_ascii=False),'matches prior required or optional correction; OHJ-12 points to complete child'])
writecsv('parent-corrections.csv',['SD','key','before_copy','after_copy','sources','disposition'],corrections)
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'priorReview':REVIEW,'mappingRows':1303,'SDRowsReconciled':1271,'importedSD':475,'pendingSD':796,'proseRows':7,'childRows':25,'childParentCounts':{k:len(v) for k,v in children.items()},'parentLocatorChanges':changes,'changedParentsCompared':17,'childrenCompared':25,'childrenConform':24,'childrenPartial':1,'fullNumbers33SequenceEqualToAccepted':True,'allChildOrderGateMappingSourceChecks':True,'generatorPackAndMappingByteIdentical':True,'fullPrimaryRereading':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

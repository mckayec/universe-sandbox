"""Pinned mapping/source-resolution/generator audit. Manual dispositions are explicit review inputs."""
import csv,io,json,pathlib,subprocess,tempfile,re,collections,importlib.util
HERE=pathlib.Path(__file__).resolve().parent
P='docs/universes/packs/lds-standard-works/'
HEAD='665f82590881ee8664b70bb88543e71a0965b7d1';BASE='7b7a3da6154aceb1e279775a5805e5e287df4194';CODE='de94dffc3c4b7b6a7df2b40da11e069700e017e6';RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def csvrows(b):return list(csv.DictReader(io.StringIO(b.decode())))
def writecsv(name,header,rows):
 with (HERE/name).open('w',newline='') as f:
  w=csv.writer(f,lineterminator='\n');w.writerow(header);w.writerows(rows)
accepted=csvrows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
mapped=csvrows(read(HEAD,P+'supplementary-implementation.csv'));before=csvrows(read(BASE,P+'supplementary-implementation.csv'))
assert len(mapped)==len(before)==1278
sd=[r for r in mapped if r['disposition_id']];assert len(sd)==len(accepted)==1271
assert len({r['disposition_id'] for r in sd})==1271
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','work_gate','consolidation_rule','row_sha256']:assert m[f]==r[f],(r['disposition_id'],f)
changed=[r['disposition_id'] for r,b in zip(mapped,before) if r!=b]
assert changed==[f'SD{i:04}' for i in range(299,476)]
assert sum(r['state']=='imported' for r in sd)==475
assert sum(r['state']=='pending' for r in sd)==796
assert read(HEAD,P+'supplementary-build/copy_nt.py')==read(BASE,P+'supplementary-build/copy_nt.py')
assert read(HEAD,P+'supplementary-implementation.csv')==read(CODE,P+'supplementary-implementation.csv')
ledgerbytes=read(RESEARCH,P+'coverage-ot-history.md');assert ledgerbytes==read(HEAD,P+'coverage-ot-history.md')
ledger={}
for line in ledgerbytes.decode().splitlines():
 m=re.match(r'\| (OH-[A-Z0-9-]+) / \[([^\]]+)\]\((https://[^)]+)\)',line)
 if m:ledger[m[1]]=(m[2],m[3])
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack']))
cards={c['key']:c for t in pack['codex'] if t['id']=='ot-more' for c in t['list']}
by={r['disposition_id']:r for r in accepted};comparisons=[];resolutions=[];members=[]
findings={'SD0300':'S4-C1','SD0311':'S4-C1','SD0443':'S4-C2','SD0468':'S4-C2','SD0395':'S4-C3','SD0441':'S4-C3','SD0424':'S4-C4'}
with tempfile.TemporaryDirectory(prefix='lds-s4-audit-') as tmp:
 root=pathlib.Path(tmp)
 for path in [P+'supplementary-build/build.py',P+'supplementary-build/copy_bom.py',P+'supplementary-build/copy_nt.py',P+'supplementary-build/copy_ot.py',P+'coverage-ot-history.md','public/atlas/packs/lds-standard-works.js']:
  t=root/path;t.parent.mkdir(parents=True,exist_ok=True);t.write_bytes(read(HEAD,path))
 spec=importlib.util.spec_from_file_location('review_copy_ot',root/(P+'supplementary-build/copy_ot.py'));mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
 for m in sd:
  if m['disposition_id'] not in changed:continue
  r=by[m['disposition_id']];c=cards[m['target_key']];sid=m['disposition_id'];context=r['minimum_retained_source_context']
  assert m['target']=='codex:ot-more' and m['work_gate']=='1/ot' and m['display_name']==c['name']
  assert mod.COPY[sid]==(c['key'],c['name'],c['desc'])
  urls=set(re.findall(r'\]\((https://[^)\s]+)\)',context));expanded=[]
  # Independently expand every chapter range; the runtime link deliberately targets its first chapter.
  if not urls:
   for prefix,expression in re.findall(r'\b(OH-(?:RU|S1-|S2-|K1-|K2-|[GXLNDQJ]))(\d+(?:[–-]\d+)?(?:,\d+(?:[–-]\d+)?)*)',context):
    for term in expression.split(','):
     nums=re.split('[–-]',term);start=int(nums[0]);end=int(nums[-1]);assert end>=start
     keys=[prefix+str(n).zfill(len(nums[0])) for n in range(start,end+1)]
     assert all(k in ledger for k in keys),(sid,keys)
     first=ledger[keys[0]];label=first[0]+('–'+str(end) if end!=start else '')
     urls.add(first[1]);expanded.extend(keys)
     resolutions.append([sid,prefix+term,label,first[1],';'.join(keys),';'.join(ledger[k][1] for k in keys)])
     assert any(s['t']==label and s['u']==first[1] for s in c['src']),(sid,label)
  extras={'https://www.churchofjesuschrist.org/study/scriptures/'+p+'?lang=eng' for _,p in mod.EXTRA_SRC.get(sid,[])}
  assert {x['u'] for x in c['src']}==urls|extras,sid
  assert m['locators']=='; '.join(x['t'] for x in c['src'])
  for source in c['src']:
   match=re.search(r'/ot/[^/]+/(\d+)\?',source['u'])
   if match:assert re.search(r' (\d+)',source['t']).group(1)==match.group(1),source
  ids=re.findall(r'\bOHR-[A-Z-]+',r['research_declaration'])
  if len(ids)>1:
   for key in ids:members.append([sid,key,c['key'],c['name'],'member of shared reference card; not alias of another person'])
  verdict=findings.get(sid,'no-additional-discrepancy-identified')
  comparisons.append([sid,r['category'],c['key'],r['source_location'],context,c['name'],c['desc'],json.dumps(c['src'],ensure_ascii=False),verdict,'Accepted-research comparison; targeted fresh passages identified in report, not full primary certification.'])
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path),path
assert len(comparisons)==177
writecsv('comparison.csv',['SD','category','key','source_location','accepted_context','built_name','built_copy','built_sources','disposition','review_note'],comparisons)
writecsv('resolved-ledger-sources.csv',['SD','ledger_expression','built_label','built_url','expanded_ledger_IDs','expanded_official_urls'],resolutions)
writecsv('group-members.csv',['SD','distinct_research_person_ID','shared_card_key','card_name','relation'],members)
result={'head':HEAD,'codeHead':CODE,'base':BASE,'research':RESEARCH,'mappingRowsChecked':1278,'SDRowsCheckedAgainstResearch':1271,'newParentsCompared':177,'importedSD':475,'proseCards':7,'pendingSD':796,'newCategoryCounts':dict(collections.Counter(r[1] for r in comparisons)),'manualDispositions':dict(collections.Counter(r[8] for r in comparisons)),'groupedReferenceCards':len({r[0] for r in members}),'distinctGroupedPersonIDs':len(members),'ledgerExpressionsResolved':len(resolutions),'NTBlockAndCopyUnchanged':True,'generatorPackAndMappingByteIdentical':True,'fullPrimaryRereading':False,'result':'structural checks pass; seven content exceptions recorded'}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

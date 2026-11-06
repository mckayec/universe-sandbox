"""Pinned S6 accounting and reproducible evidence export; semantic dispositions are manual review."""
import csv,io,json,pathlib,subprocess,tempfile,re,importlib.util,collections
HERE=pathlib.Path(__file__).resolve().parent;P='docs/universes/packs/lds-standard-works/'
HEAD='11b2491eeafb7a9e93ede1959f34f6f0eff9bcb4';BASE='6067a78b1da53224026f7cd8ae0273a36c7f54b5';RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(b):return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv'));b=rows(read(BASE,P+'supplementary-implementation.csv'));accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
sd=[r for r in a if r['disposition_id']];by={r['disposition_id']:r for r in sd};old={r['disposition_id']:r for r in b if r['disposition_id']}
assert len(a)==len(b)==1303 and len(sd)==1271
assert [r for r in a if not r['disposition_id']]==[r for r in b if not r['disposition_id']]
new=[r for r in sd if r!=old[r['disposition_id']]];assert [r['disposition_id'] for r in new]==[f'SD{i:04}' for i in range(476,569)]
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','work_gate','row_sha256']:assert m[f]==r[f],(m['disposition_id'],f)
 assert m['consolidation_rule']==r['consolidation_rule'] or m['consolidation_rule'].endswith('card; '+r['consolidation_rule'])
assert sum(r['state']=='imported' for r in sd)==568 and sum(r['state']=='pending' for r in sd)==703
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack']));cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')}
research={r['disposition_id']:r for r in accepted};ledger=read(RESEARCH,P+'coverage-ot-late-history.md').decode().splitlines()
# Build an independent ledger index, then resolve each requested chapter start or explicit linked source.
index={}
for n,l in enumerate(ledger,1):
 m=re.match(r'\| (LH[12ENS]-\d+) — .*?\]\((https://[^)]+)\)',l)
 if m:index[m[1]]=(m[2],n,l)
def evidence(r):
 text=r['minimum_retained_source_context'];links=re.findall(r'\]\((https://[^)]+)\)',text);loc=[]
 if links:return set(links),[r['source_location']]
 for m in re.finditer(r'\b(LH[12ENS])-([0-9][0-9,–:\-]*)',text):
  prefix,tail=m.groups();chapters=tail.split(':')[0]
  for chunk in chapters.split(','):
   start=int(re.split('[–-]',chunk)[0]);url,line,_=index[f'{prefix}-{start:02}'];links.append(url);loc.append('coverage-ot-late-history.md:'+str(line))
 assert links,r['disposition_id']
 return set(links),loc
with tempfile.TemporaryDirectory(prefix='lds-s6-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py','copy_otl.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 spec=importlib.util.spec_from_file_location('audit_otl',root/(P+'supplementary-build/copy_otl.py'));mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
 assert len(mod.COPY)==93 and not mod.CHILDREN
 merges={sd:v for sd,v in mod.COPY.items() if isinstance(v,str)};assert len(merges)==10
 expected=collections.defaultdict(set);inventory=[]
 for m in new:
  ident=m['disposition_id'];r=research[ident];urls,loc=evidence(r);key=m['target_key'];c=cards[key]
  assert old[ident]['state']=='pending' and m['state']=='imported' and m['work_gate'] in ('1/ot','source-specific 1/ot; later commentary separately gated') and m['target']=='codex:ot-more'
  expected[key].update(urls)
  if ident in merges:
   target=merges[ident];assert by[target]['target_key']==key and m['consolidation_rule'].startswith('consolidated into '+target+' card; ')
  else:
   target=ident;k,n,d=mod.COPY[ident];assert (key,c['name'],c['desc'])==(k,n,d)
  assert urls<={s['u'] for s in c['src']},ident
  inventory.append([ident,r['category'],target,key,r['source_location'],'; '.join(loc),r['minimum_retained_source_context'],c['name'],c['desc'],json.dumps(c['src'],ensure_ascii=False),'conforms-to-accepted-minimum-context','shared reference/name only; future major-prophet integration remains pending' if ident in ['SD0492','SD0529','SD0534','SD0538','SD0540','SD0545','SD0546','SD0551','SD0568'] else ''])
 for key,urls in expected.items():assert urls=={s['u'] for s in cards[key]['src']},key
 assert len(expected)==83
 assert cards['NTE-jerusalem-community-6']['desc'].endswith('Acts 6:5 describes Nicolas as a proselyte of Antioch. The regional labels for participants in the dispute in Acts 6:9 are not a narrated journey by Stephen.')
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path),path
with (HERE/'row-comparison.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['SD','category','consolidated_owner_SD','built_key','accepted_location','source_ledger_locations','accepted_context','built_name','built_copy','built_sources','manual_disposition','integration_limit']);w.writerows(inventory)
counts=collections.Counter(r['category'] for r in new)
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'mappingRows':1303,'SDRowsReconciled':1271,'importedSD':568,'pendingSD':703,'proseRows':7,'childRows':25,'newSDRows':93,'newCards':83,'consolidatedRows':merges,'categoryCounts':dict(counts),'all93SourceURLSetsMatchAccepted':True,'generatorPackAndMappingByteIdentical':True,'SD0226ExactAddition':True,'freshFullPrimaryReading':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

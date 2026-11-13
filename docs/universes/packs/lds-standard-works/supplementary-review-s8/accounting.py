"""Pinned S8 accounting/source export; semantic verdicts are manual, not inferred from counts."""
import csv,io,json,pathlib,subprocess,tempfile,re,collections
HERE=pathlib.Path(__file__).resolve().parent;P='docs/universes/packs/lds-standard-works/'
HEAD='0171db7e863b196a25993dec20999907bac43012';BASE='851715884a6969308ac1eadd7ff6cd4d37b7e2fb';RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(b):return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv'));b=rows(read(BASE,P+'supplementary-implementation.csv'));accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
sd=[r for r in a if r['disposition_id']];by={r['disposition_id']:r for r in sd};old={r['disposition_id']:r for r in b if r['disposition_id']}
assert len(a)==1310 and len(b)==1304 and len(sd)==1271
new=[r for r in sd if old[r['disposition_id']]['state']=='pending' and r['state']=='imported'];assert [r['disposition_id'] for r in new]==[f'SD{i:04}' for i in range(569,642)]
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','work_gate','row_sha256']:assert m[f]==r[f],(m['disposition_id'],f)
 assert m['consolidation_rule']==r['consolidation_rule'] or m['consolidation_rule'].endswith('card; '+r['consolidation_rule'])
 if m['disposition_id'] not in {r['disposition_id'] for r in new}:assert m==old[m['disposition_id']]
children=[r for r in a if r['source_location']=='child of SD0663'];assert len(children)==6
assert [r for r in a if not r['disposition_id'] and r not in children]==[r for r in b if not r['disposition_id']]
assert sum(r['state']=='imported' for r in sd)==700 and sum(r['state']=='pending' for r in sd)==571
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack']));cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')}
research={r['disposition_id']:r for r in accepted};inventory=[]
def export(name,headers,data):
 with (HERE/name).open('w',newline='') as f:
  w=csv.writer(f,lineterminator='\n');w.writerow(headers);w.writerows(data)
for m in new:
 ident=m['disposition_id'];r=research[ident];c=cards[m['target_key']]
 urls=set(re.findall(r'\]\((https://[^)]+)\)',r['minimum_retained_source_context']))
 assert urls=={s['u'] for s in c['src']},ident
 assert m['target']=='codex:ot-more' and m['work_gate']=='1/ot' and m['locators']=='; '.join(s['t'] for s in c['src'])
 verdict='S8-C1-city-region-qualification' if ident=='SD0578' else 'conforms-to-accepted-context'
 inventory.append([ident,r['source_location'],r['minimum_retained_source_context'],m['target_key'],c['name'],c['desc'],json.dumps(c['src'],ensure_ascii=False),verdict])
export('row-comparison.csv',['SD','accepted_location','accepted_context','built_key','built_name','built_copy','built_sources','manual_disposition'],inventory)
li=next(t['list'] for t in pack['codex'] if t['id']=='ot-more');pos=next(n for n,c in enumerate(li) if c['key']=='OTM-j22-temple-tour');mp=a.index(by['SD0663']);childinventory=[]
for offset,ch in enumerate([40,41,42,43,44,46],1):
 key=f'OTM-j22-temple-tour-{ch}';c=li[pos+offset];m=a[mp+offset]
 assert c['key']==m['target_key']==key and m['source_location']=='child of SD0663' and not m['disposition_id']
 assert m['research_declaration']=='OTM-j22-temple-tour' and m['work_gate']=='1/ot' and c['books']==[1] and c['layers']==['ot']
 assert c['src'][0]['u']==f'https://www.churchofjesuschrist.org/study/scriptures/ot/ezek/{ch}?lang=eng'
 assert m['locators']==c['src'][0]['t']
 childinventory.append([key,f'coverage-ot-major-prophets.md:{199+[40,41,42,43,44,45,46].index(ch)}',c['name'],c['desc'],json.dumps(c['src'],ensure_ascii=False),'content-conforms-source-label-needs-46:1-S8-C2' if ch==46 else 'conforms-to-S7-minimum-context'])
export('child-comparison.csv',['key','accepted_location','built_name','built_copy','built_sources','manual_disposition'],childinventory)
# Resolve explicit reader name pointers to actual cards and retain both contexts for human identity review.
refs={569:'Jerusalem in Samuel and Kings',570:'Babylon in Kings',571:'Egypt (Old Testament settings)',574:'Jerusalem in Samuel and Kings',577:'Damascus (Kings)',578:'Samaria (city)',580:'Nineveh (Kings)',581:'Lachish',591:'Ishmael’s captives and Gibeon’s waters',592:'Bethlehem of Judah',610:'Tyre (Kings)',619:'Moab',626:'Gaza (Azzah)',628:'Ashdod',632:'Riblah in Hamath',633:'Jericho in Joshua and Kings',634:'Shiloh',635:'Envoys to Zoan and Hanes',641:'Haran (Genesis)'}
refrows=[]
for n,name in refs.items():
 m=by[f'SD{n:04}'];c=cards[m['target_key']];targets=[x for x in cards.values() if x['name']==name]
 assert len(targets)==1,(n,name,len(targets));t=targets[0];assert name in c['desc']
 refrows.append([m['disposition_id'],c['key'],t['key'],name,t['desc'],json.dumps(t['src'],ensure_ascii=False),'S8-C1-qualify-city-region' if n==578 else 'context-reference-resolves; not a clickable typed edge or new coordinate'])
export('named-references.csv',['SD','from_key','target_key','target_name','target_context','target_sources','disposition'],refrows)
with tempfile.TemporaryDirectory(prefix='lds-s8-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py','copy_otl.py','copy_mp.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path),path
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'mappingRows':1310,'SDRowsReconciled':1271,'importedSD':700,'pendingSD':571,'standaloneProse':7,'consolidatedProse':1,'childRows':31,'newSDRows':73,'newChildRows':6,'newCards':79,'namedReferencesResolved':len(refrows),'newParentDispositions':{'conforms':72,'qualification':1},'newChildDispositions':{'contentConforms':6,'locatorCorrectionWithinThose':1},'generatorPackAndMappingByteIdentical':True,'all73SourceURLSetsMatchAccepted':True,'fullPrimaryRereading':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

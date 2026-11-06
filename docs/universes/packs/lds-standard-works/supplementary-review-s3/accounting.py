"""Exact-head mapping/generator audit; comparison verdicts are manual review inputs, not inferred from counts."""
import csv,io,json,pathlib,subprocess,tempfile,re,collections,importlib.util
HERE=pathlib.Path(__file__).resolve().parent
P='docs/universes/packs/lds-standard-works/'
HEAD='7b7a3da6154aceb1e279775a5805e5e287df4194';BASE='47debcfdb86a3e41a023a30e04c6fcd5bd7209b0';RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def csvrows(b):return list(csv.DictReader(io.StringIO(b.decode())))
accepted=csvrows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
mapped=csvrows(read(HEAD,P+'supplementary-implementation.csv'));before=csvrows(read(BASE,P+'supplementary-implementation.csv'))
assert len(mapped)==len(before)==1278
sd=[r for r in mapped if r['disposition_id']];assert len(sd)==len(accepted)==1271
assert len({r['disposition_id'] for r in sd})==1271
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','work_gate','consolidation_rule','row_sha256']:assert m[f]==r[f],(r['disposition_id'],f)
changed=[r['disposition_id'] for r,b in zip(mapped,before) if r!=b]
assert changed==[f'SD{i:04}' for i in range(112,299)]
assert sum(r['state']=='imported' for r in sd)==298
assert sum(r['state']=='pending' for r in sd)==973
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack']))
cards={c['key']:c for t in pack['codex'] if t['id']=='nt-more' for c in t['list']}
by={r['disposition_id']:r for r in accepted};comparisons=[]
partial={'SD0213','SD0214','SD0226','SD0236','SD0238','SD0240','SD0270'}
with tempfile.TemporaryDirectory(prefix='lds-s3-audit-') as tmp:
 root=pathlib.Path(tmp)
 for path in [P+'supplementary-build/build.py',P+'supplementary-build/copy_bom.py',P+'supplementary-build/copy_nt.py','public/atlas/packs/lds-standard-works.js']:
  t=root/path;t.parent.mkdir(parents=True,exist_ok=True);t.write_bytes(read(HEAD,path))
 spec=importlib.util.spec_from_file_location('review_copy_nt',root/(P+'supplementary-build/copy_nt.py'));mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
 for m in sd:
  if m['disposition_id'] not in changed:continue
  r=by[m['disposition_id']];c=cards[m['target_key']];sdid=m['disposition_id']
  assert m['target']=='codex:nt-more' and m['work_gate']=='2/nt' and m['display_name']==c['name']
  assert mod.COPY[sdid]==(c['key'],c['name'],c['desc'])
  urls=set(re.findall(r'\]\((https://[^)\s]+)\)',r['minimum_retained_source_context']))
  extras={'https://www.churchofjesuschrist.org/study/scriptures/'+p+'?lang=eng' for _,p in mod.EXTRA_SRC.get(sdid,[])}
  assert {x['u'] for x in c['src']}==urls|extras,sdid
  assert m['locators']=='; '.join(x['t'] for x in c['src'])
  for source in c['src']:
   match=re.search(r'/nt/[^/]+/(\d+)\?',source['u'])
   if match:assert re.search(r' (\d+)',source['t']).group(1)==match.group(1),source
  verdict='no-additional-discrepancy-identified';note='Compared with accepted context; not a fresh primary-source certification.'
  if sdid in partial:verdict='partial-S3-C1';note='Required source-specific children/reference payload missing; see report. Parent present.'
  if sdid=='SD0190':verdict='copy-ambiguity-S3-C2';note='Clarify continuing literary journey, not a return to the refusing village.'
  if sdid=='SD0260':verdict='copy-overstatement-S3-C3';note='State atlas spatial/architectural limitation, not absence of sanctuary imagery.'
  if sdid=='SD0206':verdict='partial-S3-C4';note='AJ05 timing absent from built route/card despite receipt assertion.'
  comparisons.append([sdid,r['category'],c['key'],r['source_location'],r['minimum_retained_source_context'],c['name'],c['desc'],json.dumps(c['src'],ensure_ascii=False),verdict,note])
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path),path
assert len(comparisons)==187
with (HERE/'comparison.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator="\n");w.writerow(['SD','category','key','source_location','accepted_context','built_name','built_copy','built_sources','disposition','review_note']);w.writerows(comparisons)
result={'head':HEAD,'base':BASE,'research':RESEARCH,'mappingRowsChecked':1278,'SDRowsCheckedAgainstResearch':1271,'newParentRowsCompared':187,'importedSD':298,'proseCards':7,'pendingSD':973,'newCategoryCounts':dict(collections.Counter(r[1] for r in comparisons)),'manualComparisonDispositions':dict(collections.Counter(r[8] for r in comparisons)),'all187RowLinksRetained':True,'NTSourceLabelChaptersMatchURLs':True,'generatorPackAndMappingByteIdentical':True,'fullPrimaryRereading':False,'result':'structural checks pass; content exceptions recorded'}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

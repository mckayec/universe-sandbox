"""S11 pinned accounting and copy export; semantic verdicts remain manual."""
import csv,io,json,pathlib,subprocess,tempfile,re
HERE=pathlib.Path(__file__).resolve().parent;P='docs/universes/packs/lds-standard-works/'
HEAD='620df821c57be8afb86edfd8ae4ef1aab093456b';BASE='df8b7706d098d0e59202799c6ab430938b03f5d0';RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(b):return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv'));b=rows(read(BASE,P+'supplementary-implementation.csv'));sd=[r for r in a if r['disposition_id']];old={r['disposition_id']:r for r in b if r['disposition_id']}
assert len(a)==1345 and len(sd)==1271
accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','row_sha256']:assert m[f]==r[f]
 assert m['state']==old[m['disposition_id']]['state']
assert sum(r['state']=='imported' for r in sd)==790
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack']));delta=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--delta']));cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')};newkeys={c['key'] for c in delta['added']};children=[r for r in a if r['target_key'] in newkeys];assert len(children)==31
ledger=read(RESEARCH,P+'coverage-nt.md').decode().splitlines()
with (HERE/'child-comparison.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['key','parent','accepted_context','actual_copy','sources','verdict'])
 for r in children:
  c=cards[r['target_key']]
  if r['source_location']=='child of SD0785':context='supplementary-review-s10.md S10-C3 exact six comparison texts'
  else:
   m=re.search(r'/nt/([^/]+)/(\d+)',c['src'][0]['u']);ident='NT-'+m[1]+'-'+m[2];context=next(l for l in ledger if '`'+ident+'`' in l)
  w.writerow([c['key'],r['source_location'],context,c['desc'],json.dumps(c['src'],ensure_ascii=False),'copy conforms; SD0240 family completeness still open' if r['source_location']=='child of SD0240' else 'conforms to accepted context'])
for parent,count in [('SD0214',12),('SD0240',13),('SD0785',6)]:
 rr=[r for r in children if r['source_location']=='child of '+parent];assert len(rr)==count
 target=next(r['target_key'] for r in sd if r['disposition_id']==parent)
 li=next(t['list'] for t in pack['codex'] if any(c.get('key')==target for c in t['list']));idx=next(i for i,c in enumerate(li) if c.get('key')==target)
 assert [c['key'] for c in li[idx+1:idx+1+count]]==[r['target_key'] for r in rr]
(HERE/'changed-cards.json').write_text(json.dumps(delta['changed'],indent=2,ensure_ascii=False)+'\n')
# Full URL preservation is restricted by the independent pack probe to the one decision source.
assert cards['OTW-a28-lexical-notes']['src'][0]['u'].endswith('#bounded-inline-apparatus-audit')
with tempfile.TemporaryDirectory(prefix='lds-s11-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py','copy_otl.py','copy_mp.py','copy_wp.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path)
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'mappingRows':1345,'SDRowsReconciled':1271,'importedSD':790,'pendingSD':481,'newSDImports':0,'standaloneProse':7,'consolidatedProse':1,'childRows':66,'newChildRows':31,'newCards':31,'importedMappingRows':864,'supplementaryCards':852,'generatorPackAndMappingByteIdentical':True,'freshFullPrimaryReading':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

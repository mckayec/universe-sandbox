"""Pinned S10 exports and integrity checks; copy verdicts are human review."""
import csv,io,json,pathlib,subprocess,tempfile
HERE=pathlib.Path(__file__).resolve().parent; P='docs/universes/packs/lds-standard-works/'
HEAD='df8b7706d098d0e59202799c6ab430938b03f5d0'; BASE='a3ac8f89d3e501eea41a83f4ab31a12b9de8ca95'; RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p): return subprocess.check_output(['git','show',r+':'+p])
def rows(b): return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv')); b=rows(read(BASE,P+'supplementary-implementation.csv')); accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
sd=[r for r in a if r['disposition_id']]; old={r['disposition_id']:r for r in b if r['disposition_id']}
new=[r for r in sd if r['state']=='imported' and old[r['disposition_id']]['state']=='pending']
assert len(a)==1314 and len(sd)==1271 and len(new)==59
assert {r['disposition_id'] for r in new}=={f'SD{i:04}' for i in [*range(727,758),*range(763,791)]}
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','row_sha256']: assert m[f]==r[f],(m['disposition_id'],f)
 assert m['work_gate']==r['work_gate'] or (m['disposition_id']=='SD0706' and m['work_gate']=='3/bom (row gate); '+r['work_gate'])
 if m['disposition_id'] not in {x['disposition_id'] for x in new} and m['disposition_id'] not in ['SD0710','SD0721','SD0760']: assert m==old[m['disposition_id']]
assert sum(r['state']=='imported' for r in sd)==790
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack'])); cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')}; research={r['disposition_id']:r for r in accepted}
with (HERE/'row-comparison.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['SD','accepted_location','accepted_context','built_key','copy','sources','gate','disposition'])
 for m in new:
  r=research[m['disposition_id']]; c=cards[m['target_key']]; verdict={'SD0730':'S10-C1 distinguish image location from furnace inference','SD0746':'S10-C2 chapter sources needed','SD0783':'S10-C2 chapter sources needed','SD0789':'S10-C2 chapter sources needed','SD0790':'S10-C2 retained context reference needed','SD0785':'S10-C3 map six variants to verses'}.get(m['disposition_id'],'conforms to accepted minimum context; integration limits in report')
  w.writerow([m['disposition_id'],r['source_location'],r['minimum_retained_source_context'],c['key'],c['desc'],json.dumps(c['src'],ensure_ascii=False),str(c['books'])+str(c['layers']),verdict])
children=[r for r in a if r['source_location'] in ['child of SD0721','child of SD0753']];assert len(children)==2
(HERE/'children.json').write_text(json.dumps([{'mapping':r,'card':cards[r['target_key']]} for r in children],indent=2,ensure_ascii=False)+'\n')
assert 'dc-testament' not in str(cards['OTM-a01-jesse']['src'])
assert cards['OTM-a01-jesse-dc113']['books']==[4] and cards['OTM-a02-ariel-jst-introduction']['books']==[3]
assert cards['OTW-heshbon']['books']==[1] and cards['OTW-c06-psalm-85-heading']['books']==[3]
assert 'Psalm 24:7–10 (KJV)' in str(cards['OTW-c13-jst-psalm-24']['src'])
with tempfile.TemporaryDirectory(prefix='lds-s10-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py','copy_otl.py','copy_mp.py','copy_wp.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']: assert (root/path).read_bytes()==read(HEAD,path)
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'mappingRows':1314,'SDRowsReconciled':1271,'importedSD':790,'pendingSD':481,'standaloneProse':7,'consolidatedProse':1,'childRows':35,'newSDRows':59,'newChildRows':2,'newCards':61,'generatorPackAndMappingByteIdentical':True,'freshFullPrimaryReading':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

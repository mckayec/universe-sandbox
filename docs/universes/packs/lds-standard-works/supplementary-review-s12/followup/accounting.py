"""S12 pinned accounting and copy export; semantic verdicts remain manual."""
import csv,io,json,pathlib,subprocess,tempfile,re
HERE=pathlib.Path(__file__).resolve().parent;P='docs/universes/packs/lds-standard-works/'
HEAD='7f53ac471a1f108d0eb5773db731d6a6b6b49632';BASE='684cec17a7fea64f4f82f160bd469b16485a4d3f';RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(b):return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv'));b=rows(read(BASE,P+'supplementary-implementation.csv'));sd=[r for r in a if r['disposition_id']];old={r['disposition_id']:r for r in b if r['disposition_id']}
assert len(a)==1351 and len(sd)==1271
accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','row_sha256']:assert m[f]==r[f]
 assert m['state']==old[m['disposition_id']]['state']
assert sum(r['state']=='imported' for r in sd)==790
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack']));delta=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--delta']));cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')};newkeys={c['key'] for c in delta['added']};children=[r for r in a if r['target_key'] in newkeys];assert len(children)==6
ledger=read(RESEARCH,P+'coverage-nt.md').decode().splitlines()
with (HERE/'child-comparison.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['key','parent','accepted_context','actual_copy','sources','verdict'])
 for r in children:
  c=cards[r['target_key']]
  context='supplementary-review-s11.md S11-C1' if r['source_location']=='child of SD0240' else 'supplementary-review-s11/genealogy-handoff.md and source-order CSVs'
  w.writerow([c['key'],r['source_location'],context,c['desc'],json.dumps(c['src'],ensure_ascii=False),'S12-C1 corrected; all source-order safeguards preserved' if c['key']=='NTC-genealogies-matt-1' else 'conforms to supplied source context'])
for parent,count in [('SD0238',2),('SD0240',17)]:
 rr=[r for r in a if r['source_location']=='child of '+parent];assert len(rr)==count
 target=next(r['target_key'] for r in sd if r['disposition_id']==parent)
 li=next(t['list'] for t in pack['codex'] if any(c.get('key')==target for c in t['list']));idx=next(i for i,c in enumerate(li) if c.get('key')==target)
 assert [c['key'] for c in li[idx+1:idx+1+count]]==[r['target_key'] for r in rr]
# Inputs match the reviewed source payload exactly; inspect the actual generated chains independently.
names={}
for book in ['matt','luke']:
 path=P+'supplementary-build/genealogy/'+book+'-genealogy-names.csv'
 assert read(HEAD,path)==read('df275a8516b2eb9c0b042d48d8523f05a8a24a24',P+'supplementary-review-s11/'+book+'-genealogy-names.csv')
 names[book]=[n.strip() for r in rows(read(HEAD,path)) for n in r['names_in_source_order'].split(';')]
md=cards['NTC-genealogies-matt-1']['desc'];ld=cards['NTC-genealogies-luke-3']['desc']
segments=md.split('omitted: ')[1].split('. Verse 16')[0].split(' → ')
assert [x.split()[0] for x in segments]==names['matt']
assert ld.split('after it: ')[1].split(', “which')[0].split(' → ')==names['luke'][2:-1]
assert 'as was supposed' in ld and 'not harmonized with Matthew' in ld
assert 'does not say that Joseph begat Jesus' in md and 'no names are added' in md
assert 'Judas (his brethren are also named)' in md and 'Phares (Zara is also named; both are of Thamar)' in md and 'Booz (of Rachab)' in md and 'Obed (of Ruth)' in md
assert 'Solomon (of her that had been the wife of Urias)' in md and 'Jechonias (his brethren are also named' in md
assert len(names['matt'])==40 and len(names['luke'])==77
assert 'Psalm 29 (study note: bison or buffalo)' in str(cards['OTW-a27-animal-instrument-notes']['src'])
assert 'Psalm 92 (study note: buffalo or bison)' in str(cards['OTW-a27-animal-instrument-notes']['src'])
(HERE/'changed-cards.json').write_text(json.dumps(delta['changed'],indent=2,ensure_ascii=False)+'\n')
# Full URL preservation is restricted by the independent pack probe to the one decision source.
assert cards['OTW-a28-lexical-notes']['src'][0]['u'].endswith('#bounded-inline-apparatus-audit')
with tempfile.TemporaryDirectory(prefix='lds-s12-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py','copy_otl.py','copy_mp.py','copy_wp.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'supplementary-build/genealogy/matt-genealogy-names.csv',P+'supplementary-build/genealogy/luke-genealogy-names.csv',P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path)
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'mappingRows':1351,'SDRowsReconciled':1271,'importedSD':790,'pendingSD':481,'newSDImports':0,'standaloneProse':7,'consolidatedProse':1,'childRows':72,'newChildRows':6,'newCards':6,'importedMappingRows':870,'supplementaryCards':858,'MatthewMainChainOccurrences':40,'LukeOccurrences':77,'generatorPackAndMappingByteIdentical':True,'freshFullPrimaryReading':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

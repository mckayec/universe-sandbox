"""Pinned S21 exports and integrity checks; copy verdicts are human review."""
import csv,io,json,pathlib,subprocess,tempfile,re
HERE=pathlib.Path(__file__).resolve().parent; P='docs/universes/packs/lds-standard-works/'
HEAD='91a69fbaa9f42e9409955f0c2d35fe59eb02fdd0'; BASE='b27b845eec64bb987feb82fe1674051c9dde0e40'; RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p): return subprocess.check_output(['git','show',r+':'+p])
def rows(b): return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv')); b=rows(read(BASE,P+'supplementary-implementation.csv')); accepted=rows(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
sd=[r for r in a if r['disposition_id']]; old={r['disposition_id']:r for r in b if r['disposition_id']}
new=[r for r in sd if r['state']=='imported' and old[r['disposition_id']]['state']=='pending']
assert len(a)==1354 and len(sd)==1271 and len(new)==11
assert {r['disposition_id'] for r in new}=={f'SD{i:04}' for i in range(1241,1252)}
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','row_sha256']: assert m[f]==r[f],(m['disposition_id'],f)
 assert m['work_gate']==r['work_gate'] or (m['disposition_id']=='SD0706' and m['work_gate']=='3/bom (row gate); '+r['work_gate'])
 if m['disposition_id'] not in {x['disposition_id'] for x in new}:
  prior=old[m['disposition_id']].copy()
  assert m==prior
assert sum(r['state']=='imported' for r in sd)==1251
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack'])); cards={c['key']:c for t in pack['codex'] for c in t['list'] if c.get('key')}; research={r['disposition_id']:r for r in accepted}
with (HERE/'row-comparison.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['SD','accepted_location','accepted_context','built_key','copy','sources','gate','disposition'])
 for m in new:
  r=research[m['disposition_id']]; c=cards[m['target_key']]
  verdict={'SD1243':'S21-C1: source-specific ages missing', 'SD1245':'S21-C2: ambiguous Sarai spouse pronoun', 'SD1251':'index retained; explicit gloss enhancement supplied in report'}.get(m['disposition_id'],'minimum accepted-row content conforms; integration limits in report')
  w.writerow([m['disposition_id'],r['source_location'],r['minimum_retained_source_context'],c['key'],c['desc'],json.dumps(c['src'],ensure_ascii=False),str(c['books'])+str(c['layers']),verdict])
with tempfile.TemporaryDirectory(prefix='lds-s21-audit-') as tmp:
 root=pathlib.Path(tmp)
 for f in ['build.py','copy_bom.py','copy_nt.py','copy_ot.py','copy_otl.py','copy_mp.py','copy_wp.py','copy_dc.py','copy_dcp.py','copy_dre.py','copy_dca.py','copy_dd.py','copy_dd2.py','copy_pgp.py']:
  p=root/(P+'supplementary-build/'+f);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,P+'supplementary-build/'+f))
 for path in [P+'supplementary-build/genealogy/matt-genealogy-names.csv',P+'supplementary-build/genealogy/luke-genealogy-names.csv',P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(read(HEAD,path))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for path in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']: assert (root/path).read_bytes()==read(HEAD,path)
assert sum(r['state']=='imported' for r in a)==1334
assert len([r for r in a if r['source_location'].startswith('child of ')])==75
assert len({r['target_key'] for r in a if r['state']=='imported'})==1309
for m in a:
 if m['state'] in ['imported','consolidated']:
  assert m['target_key'] in cards, m
from collections import Counter
pending=Counter(r['category'] for r in sd if r['state']=='pending')
assert sum(v for k,v in pending.items() if 'SC45'<=k<='SC45')==0
assert sum(v for k,v in pending.items() if 'SC46'<=k<='SC54')==20
result={'head':HEAD,'base':BASE,'acceptedResearch':RESEARCH,'mappingRows':len(a),'SDRowsReconciled':len(sd),'importedSD':1251,'pendingSD':20,'pendingByCategory':dict(pending),'standaloneProse':7,'consolidatedProse':1,'childRows':75,'newSDRows':11,'newChildRows':0,'newCards':10,'importedMappingRows':1334,'supplementaryCards':1309,'generatorPackAndMappingByteIdentical':True,'freshFullPrimaryReading':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

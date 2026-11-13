#!/usr/bin/env python3
"""Reproduce mapping/source accounting and isolated generator output. No checkout writes outside this report directory."""
import csv,io,json,re,subprocess,tempfile,pathlib,hashlib,collections
HERE=pathlib.Path(__file__).resolve().parent
PREFIX='docs/universes/packs/lds-standard-works/'
HEAD='fe24d334731c1b25c806c2300aa7a23f930babbb'
RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def git(*args): return subprocess.check_output(['git',*args])
def data(ref,path): return git('show',ref+':'+path)
src=data(RESEARCH,PREFIX+'supplementary-dispositions/declaration-dispositions.csv')
assert src==data('3729dbb33a98705fe8117a2aa53d9d058b870d9d',PREFIX+'supplementary-dispositions/declaration-dispositions.csv')
rows=list(csv.DictReader(io.StringIO(src.decode())))
mapped=list(csv.DictReader(io.StringIO(data(HEAD,PREFIX+'supplementary-implementation.csv').decode())))
sd=[r for r in mapped if r['disposition_id']];prose=[r for r in mapped if not r['disposition_id']]
assert len(rows)==len(sd)==1271 and len(prose)==7
assert len(set(r['disposition_id'] for r in sd))==1271
by={r['disposition_id']:r for r in sd}
pack=json.loads(subprocess.check_output(['node',str(HERE/'probe.cjs'),'--pack']))
cards={x['key']:x for t in pack['codex'] if t['id']=='bom-more' for x in t['list']}
comp=[];imported=0
for r in rows:
 m=by[r['disposition_id']]
 for field in ['category','source_location','research_declaration','work_gate','consolidation_rule','row_sha256']: assert r[field]==m[field],(r['disposition_id'],field)
 expected=r['category'] in {'SC01','SC02','SC03','SC04','SC05','SC06','SC07'}
 assert m['state']==('imported' if expected else 'pending')
 if not expected:
  assert all(not m[x] for x in ['target','target_key','display_name','locators']);continue
 imported+=1;c=cards[m['target_key']]
 assert m['target']=='codex:bom-more' and m['display_name']==c['name'] and m['work_gate']=='3/bom'
 key=re.search(r'\b(BXP\d+|BXJ\d+|BXE\d+|BXR\d+|BXC\d+)\b',r['research_declaration']).group(0)
 assert key==c['key']
 urls=set(re.findall(r'\]\((https://[^)\s]+)\)',r['minimum_retained_source_context']))
 actual={x['u'] for x in c['src']}
 extra={'https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/9?lang=eng'} if key=='BXP52' else set()
 assert actual==urls|extra,(key,urls,actual)
 assert m['locators']=='; '.join(x['t'] for x in c['src'])
 outcome='conforms-to-accepted-context'
 note='Manual copy comparison completed; primary evidence reused, not freshly reread.'
 if key=='BXJ12': outcome='correction-S1-C1';note='Restore land of Zarahemla explicitly within gathering region; 3 Nephi 3:23.'
 if key in ['BXP12','BXP35','BXP62','BXJ14','BXE05']:note='Conforms; targeted official passage reread (see source-checks.md).'
 comp.append([r['disposition_id'],r['category'],key,r['source_location'],r['minimum_retained_source_context'],c['name'],c['desc'],json.dumps(c['src'],ensure_ascii=False),outcome,note])
assert imported==111 and len(cards)==118
# All seven prose bullets have explicit targets and copy; comparison is manually recorded, not inferred from counts.
coverage=data(RESEARCH,PREFIX+'coverage-bom.md').decode().splitlines()
prose_lines=[line for line in coverage[401:411] if line.startswith('- **')]
assert len(prose_lines)==6
prose_sources={f'SC04.{i+1}':line for i,line in enumerate(prose_lines)}
prose_sources['SC02.1']=next(line for line in coverage if line.startswith('The named narrow pass'))
for m in prose:
 c=cards[m['target_key']];assert m['target']=='codex:bom-more' and m['work_gate']=='3/bom' and m['display_name']==c['name']
 comp.append(['',m['category'],c['key'],'coverage-bom.md prose',prose_sources[c['key']],c['name'],c['desc'],json.dumps(c['src'],ensure_ascii=False),'conforms-to-accepted-context','Manual prose comparison; source references inherited (SC04.4 citation improvement noted in report).'])
assert {r[2] for r in comp}==set(cards)
# Run builder generator in a disposable tree, never on Claude's checkout.
with tempfile.TemporaryDirectory(prefix='lds-s1-audit-') as tmp:
 root=pathlib.Path(tmp)
 paths=[PREFIX+'supplementary-build/build.py',PREFIX+'supplementary-build/copy_bom.py','public/atlas/packs/lds-standard-works.js']
 for path in paths:
  p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data(HEAD,path))
 inp=root/'accepted.csv';inp.write_bytes(src)
 output=subprocess.check_output(['python',str(root/paths[0]),str(inp)],text=True).strip()
 assert (root/(PREFIX+'supplementary-implementation.csv')).read_bytes()==data(HEAD,PREFIX+'supplementary-implementation.csv')
 assert (root/paths[2]).read_bytes()==data(HEAD,paths[2]),'generated pack differs'
with (HERE/'comparison.csv').open('w',newline='') as f:
 w=csv.writer(f);w.writerow(['SD','category','key','source_location','accepted_context','built_name','built_copy','built_sources','disposition','review_note']);w.writerows(comp)
result={'implementation':HEAD,'research':RESEARCH,'accepted_csv_sha256':hashlib.sha256(src).hexdigest(),'mapped_SD_rows':1271,'imported_SD_rows':111,'pending_SD_rows':1160,'prose_cards':7,'compared_cards':118,'copy_corrections':1,'other_cards_conform_to_accepted_context':117,'generator_pack_and_mapping_byte_identical':True,'generator_output':output,'category_import_counts':dict(collections.Counter(r['category'] for r in sd if r['state']=='imported')),'fresh_full_canon_validation':False}
(HERE/'accounting-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

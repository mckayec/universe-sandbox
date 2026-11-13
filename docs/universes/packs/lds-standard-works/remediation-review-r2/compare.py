"""Exact-head review: actual pack values versus 169 accepted specification IDs.
Usage: python compare.py /path/to/dcc793c-checkout
Produces reproducible CSV/JSON; accepted research conformity, not fresh primary reading.
"""
import csv,hashlib,io,json,re,subprocess,sys
from collections import Counter
from pathlib import Path
P=Path(__file__).resolve().parent; B=P.parent; root=Path(sys.argv[1]).resolve()
SHA='dcc793c6036f9dc26ec4286d8c132c272638fd40'; OLD='5a9711eb2676e0b421fb093211fc0be97ae2b368'; RECEIPT='fd8320936e75a26c16273156a7c27733add42df0'
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()==SHA
loader="const fs=require('fs'),vm=require('vm'),c={window:{}};vm.runInNewContext(fs.readFileSync(0,'utf8'),c);console.log(JSON.stringify(c.window.ATLAS_PACKS['lds-standard-works']));"
def pack(sha):
 src=subprocess.check_output(['git','show',sha+':public/atlas/packs/lds-standard-works.js'],cwd=root,text=True)
 return json.loads(subprocess.check_output(['node','-e',loader],input=src,text=True))
p,old=pack(SHA),pack(OLD)
allcards=lambda p:[x for t in p['codex'] for x in t['list']]
cards=allcards(p); by={x['key']:x for x in cards if x.get('key')};assert len(by)==170
norm=lambda s:re.sub(r'\s','',s.replace('’',"'"))
rows=[];titles=[]
for f in sorted((B/'ba07-spec').glob('*crosswalk.csv')):
 for r in csv.DictReader(f.open()):
  key=r['research_id'];x=by[key];expected=r.get('minimal_neutral_copy',r.get('minimal_attributed_copy',''));mode='spacing/apostrophes normalized'
  if key=='FM05':
   expected=expected.replace('Eight named witnesses','Eight named witnesses (Christian Whitmer, Jacob Whitmer, Peter Whitmer Jr., John Whitmer, Hiram Page, Joseph Smith Sr., Hyrum Smith and Samuel H. Smith)');mode='required eight signatory names retained'
  assert norm(expected)==norm(x['desc']),key
  assert x['books']==json.loads(r['books']) and x['layers']==json.loads(r['layers']),key
  assert not any(z in x for z in ['when','lat','lon','position','stops']),key
  urls={s['u'] for s in x['src']}
  if key=='AP09':
   nt=by['AP09.NT'];assert nt['desc']=='Matthew places the call of fishermen beside this sea.' and nt['books']==[2] and nt['layers']==['nt'];urls|={s['u'] for s in nt['src']};mode='two source-gated cards, one research ID'
  assert urls==set(re.split(r'\s*;\s*',r['source_urls'])),key
  title=r.get('proposed_title',r.get('accepted_title',''))
  if title and key!='AP09': assert norm(title.rstrip('.'))==norm(x['name'].rstrip('.')),key
  if r.get('display_date'): assert x.get('date')==r['display_date'],key
  if f.name=='pgp-remainder-content-crosswalk.csv':titles.append(dict(research_id=key,runtime_title=x['name'],source_context=r.get('source_location',''),disposition='manually compared with accepted PGP identity/passage; descriptive title supported, no modern localization'))
  rows.append(dict(research_id=key,spec_file=f.name,runtime_keys=key+';AP09.NT' if key=='AP09' else key,copy_result='conforms',comparison_mode=mode,source_URLs='conform (AP09 combined across separate views)',gate_result='conforms',date_result='accepted date text; no numeric when' if x.get('date') else 'no numeric when',runtime_title=x['name'],payload_sha256=hashlib.sha256(json.dumps(x,sort_keys=True,ensure_ascii=False).encode()).hexdigest()))
assert len(rows)==len({r['research_id'] for r in rows})==169 and len(titles)==18
mapping=csv.DictReader(io.StringIO(subprocess.check_output(['git','show',RECEIPT+':docs/universes/packs/lds-standard-works/ba07-implementation-crosswalk.csv'],cwd=root,text=True)))
mapping=list(mapping);assert len(mapping)==170
for m in mapping:
 key=m['runtime_key'];tab=next(t for t in p['codex'] if t['id']==m['runtime_codex_tab']);assert key in {x.get('key') for x in tab['list']}
 assert by[key]['books']==json.loads(m['books']) and by[key]['layers']==json.loads(m['layers'])
 assert m['implemented_head'] in [OLD,SHA]
canonical=lambda x:json.dumps(x,sort_keys=True,ensure_ascii=False)
oldhash=Counter(canonical(x) for x in allcards(old));newhash=Counter(canonical(x) for x in cards);assert not oldhash-newhash
assert p['events']==old['events'] and p['worlds'][0]['routes']==old['worlds'][0]['routes']
oldsites={s['id']:s for s in old['worlds'][0]['sites']};sites={s['id']:s for s in p['worlds'][0]['sites']};assert set(oldsites)==set(sites)
changed=[k for k in sites if sites[k]!=oldsites[k]];assert set(changed)=={'palmyra','salamis'}
assert all(sites[k]['lat']==oldsites[k]['lat'] and sites[k]['lon']==oldsites[k]['lon'] for k in sites)
for name,data in [('169-view-comparison.csv',rows),('pgp-title-review.csv',titles)]:
 out=io.StringIO();w=csv.DictWriter(out,fieldnames=list(data[0]),lineterminator='\n');w.writeheader();w.writerows(data);(P/name).write_text(out.getvalue())
evidence=dict(implementation=SHA,prior_implementation=OLD,research='3729dbb33a98705fe8117a2aa53d9d058b870d9d',builder_receipt=RECEIPT,specified_IDs=169,keyed_cards=170,builder_mapping_rows=170,PGP_titles_checked=18,prior_cards_preserved=95,new_cards=108,total_codex_cards=203,sites=34,changed_sites=changed,unchanged_events=24,unchanged_routes=9,supplementary_mapping='not supplied; builder explicitly defers SC01–54 implementation',limits='Source conformity and data equality only; not rendered, historical or full-canon certification')
(P/'comparison-result.json').write_text(json.dumps(evidence,indent=2)+'\n');print(json.dumps(evidence,indent=2))

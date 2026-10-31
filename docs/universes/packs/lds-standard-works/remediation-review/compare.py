"""Exact-head accepted-spec comparison; no fresh primary-source certification.
Usage: python compare.py /path/to/5a9711e-checkout
Writes a reproducible 119-row inventory and JSON evidence beside this script.
"""
import csv, hashlib, io, json, re, subprocess, sys
from pathlib import Path
here=Path(__file__).resolve().parent
base=here.parent
root=Path(sys.argv[1]).resolve()
sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
assert sha=='5a9711eb2676e0b421fb093211fc0be97ae2b368'
loader="const fs=require('fs'),vm=require('vm');const c={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),c);console.log(JSON.stringify(c.window.ATLAS_PACKS['lds-standard-works']));"
p=json.loads(subprocess.check_output(['node','-e',loader,str(root/'public/atlas/packs/lds-standard-works.js')],text=True))
cards=[x for t in p['codex'] for x in t['list']]
keyed=[x for x in cards if x.get('key')]
by={x['key']:x for x in keyed}
assert len(keyed)==len(by)==62
files=['minimum-content-crosswalk.csv','restoration-content-crosswalk.csv','bom-content-crosswalk.csv','bible-content-crosswalk.csv','bom-events-content-crosswalk.csv','pgp-remainder-content-crosswalk.csv','restoration-events-content-crosswalk.csv','bom-journeys-content-crosswalk.csv']
rows=[]
norm=lambda s:re.sub(r'\s','',s.replace('’',"'"))
for file in files:
 for r in csv.DictReader((base/'ba07-spec'/file).open()):
  rid=r['research_id']; x=by.get(rid)
  result='not imported by research key; older contextual representation not reclassified'
  if x:
   expected=r['minimal_neutral_copy']
   if rid=='FM05':
    expected=expected.replace('Eight named witnesses', 'Eight named witnesses (Christian Whitmer, Jacob Whitmer, Peter Whitmer Jr., John Whitmer, Hiram Page, Joseph Smith Sr., Hyrum Smith and Samuel H. Smith)')
   assert norm(x['desc'])==norm(expected),rid
   assert x['books']==json.loads(r['books']) and x['layers']==json.loads(r['layers']),rid
   assert 'when' not in x and not any(k in x for k in ['lat','lon','position','stops']),rid
   assert {s['u'] for s in x['src']}==set(re.split(r'\s*;\s*',r['source_urls'])),rid
   result='accepted-spec copy, source URLs and gate fields conform; not fresh source verification'
  rows.append({'research_id':rid,'spec_csv':file,'disposition':result,'runtime_key':rid if x else '', 'payload_sha256':hashlib.sha256(json.dumps(x,sort_keys=True,ensure_ascii=False).encode()).hexdigest() if x else ''})
assert len(rows)==len({r['research_id'] for r in rows})==119
assert sum(bool(r['runtime_key']) for r in rows)==62
sites={s['id']:s for s in p['worlds'][0]['sites']}
anchors=list(csv.DictReader((base/'anchor-dispositions.csv').open()))
assert len(anchors)==26
for r in anchors:
 s=sites.get(r['site_id'])
 if r['site_id'] in ['lystra','south-pass']: assert s is None
 else:
  assert s['lat']==float(r['recommended_lat']) and s['lon']==float(r['recommended_lon']),r['site_id']
  assert norm(r['anchor_copy']) in norm(s['modern']),r['site_id']
assert len(sites)==34
out=io.StringIO(); w=csv.DictWriter(out,fieldnames=rows[0],lineterminator="\n");w.writeheader();w.writerows(rows)
(here/'119-view-disposition.csv').write_text(out.getvalue())
evidence={'implementation':sha,'review_baseline':'f3b90e06be4d643d98da38fad1078d436f0d2daf','spec_views':119,'imported_conforming':62,'not_imported_by_key':57,'anchors_checked':26,'sites':len(sites),'events':len(p['events']),'routes':len(p['worlds'][0]['routes']),'codex_cards':len(cards),'salamis_desc':sites['salamis']['desc'],'salamis_modern':sites['salamis']['modern'],'palmyra_books':sites['palmyra']['books'],'palmyra_layers':sites['palmyra']['layers'],'limits':'Accepted research/spec reuse. Not fresh source reading, rendered testing or full BA07 accounting.'}
(here/'comparison-result.json').write_text(json.dumps(evidence,indent=2,ensure_ascii=False)+'\n')
print(json.dumps(evidence,indent=2,ensure_ascii=False))

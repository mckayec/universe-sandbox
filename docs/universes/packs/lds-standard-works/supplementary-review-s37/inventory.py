"""Pinned structural inventory, not a primary-text absence test."""
import csv,io,json,re,subprocess,pathlib,collections
H='102f697cd8ce55118a441d4d91e1f74542c52688'; B='57486b2e44c58e908db3f2f71f2992ed09c4760d'; P='docs/universes/packs/lds-standard-works/'; D=pathlib.Path(__file__).resolve().parent
def read(r,p):return subprocess.check_output(['git','show',r+':'+p]).decode()
def rows(f):return list(csv.DictReader(io.StringIO(read(H,P+f))))
s=rows('bmc-semantic-dispositions.csv'); ledger=rows('bmc-source-views.csv'); assert len(s)==167 and len({x['research_key'] for x in s})==167
lines=read(H,P+'coverage-bom.md').splitlines(); support={r['id'] for r in rows('bom-record-support.csv')}
focus={2,13,16,31,51,53,81,94,100,113,124,164,172,186,188,191,192,202,212,214,215}
old=list(csv.DictReader(io.StringIO(read(B,P+'bmc-source-views.csv')))); assert len(old)==len(ledger)==373
changed=[]
for a,b in zip(old,ledger):
 if a!=b:
  changed.append(b['research_key']); x=dict(a);y=dict(b);x.pop('reason');y.pop('reason');assert x==y
assert set(changed)=={x['research_key'] for x in s} and len(changed)==167
counts=collections.Counter();out=[]
for r in s:
 k=r['research_key'];n=int(k[4:]);loc=r['research_locators']; refs=re.findall(r'coverage-bom.md:(\d+)',loc); assert refs and k in lines[int(refs[0])-1]
 for v in refs: assert lines[int(v)-1].startswith('|')
 for rec in re.findall(r'bom-record-support.csv ([A-Z]+\d+)',loc):assert rec in support
 match=[x for x in ledger if x['research_key']==k and x['state']=='omitted'];assert len(match)==1 and r['reason'] in match[0]['reason']
 counts[r['semantic_state']]+=1
 out.append([k,r['unit'],r['semantic_state'],len(refs), 'targeted-primary-passages; see builder-decisions.md' if n in focus else 'reason-screened; inherited-summary-evidence only; no primary absence certification', 'S37-C1' if n==16 else 'S37-C2' if n==164 else '',loc])
for f in ['public/atlas/packs/lds-standard-works.js','public/atlas/engine.js','public/atlas/engine.css','public/atlas/layers.js',P+'supplementary-implementation.csv',P+'identity-crosswalk.csv',P+'typed-links.csv',P+'bmc-fullread-ingestion.csv',P+'bmc-omission-rollup.csv']:assert read(H,f)==read(B,f),f
with (D/'coverage.csv').open('w') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['research_key','unit','builder_state','research_line_locators','review_evidence','finding','research_locators']);w.writerows(out)
r=dict(head=H,base=B,semanticRows=len(s),uniqueKeys=167,states=dict(counts),targetedPrimaryKeys=21,otherReasonScreenedKeys=146,primaryAbsenceCertified=False,runtimeAndOldMappingUnchanged=True)
(D/'inventory-result.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))

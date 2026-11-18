"""Exact-head disposition delta and visible payload accounting; inherited S37 sources."""
import csv,io,json,pathlib,subprocess,collections
D=pathlib.Path(__file__).resolve().parent;H='c3e500e0c21d619a96b296a2a4b1e23753cadca6';B='102f697cd8ce55118a441d4d91e1f74542c52688';P='docs/universes/packs/lds-standard-works/'
def read(r,f):return subprocess.check_output(['git','show',r+':'+P+f]).decode()
def rows(r,f):return list(csv.DictReader(io.StringIO(read(r,f))))
a={r['research_key']:r for r in rows(B,'bmc-semantic-dispositions.csv')};b={r['research_key']:r for r in rows(H,'bmc-semantic-dispositions.csv')}
resolved={f'BMC-{n:03}' for n in [2,13,16,31,51,53,81,94,100,113,124,164,172,186,188,191,192,202,212,214,215]}
assert set(a)-set(b)==resolved and len(b)==146
changed=[k for k in b if a[k]!=b[k]];assert set(changed)=={'BMC-091','BMC-193'}
for k in changed:
 x=dict(a[k]);y=dict(b[k]);x.pop('reason');y.pop('reason');assert x==y
ra=rows(B,'bmc-omission-rollup.csv');rb=rows(H,'bmc-omission-rollup.csv');assert all(r in ra for r in rb);assert len(ra)-len(rb)==33
assert {r['research_key'] for r in ra if r not in rb}==resolved
ledger=rows(H,'bmc-source-views.csv');out=[]
for k in sorted(resolved):
 rr=[r for r in ledger if r['research_key']==k and r['state'] in ('implemented','omitted')];assert rr
 n=int(k[4:]);assert {r['state'] for r in rr}==({'omitted'} if n in [2,16,164] else {'implemented'})
 out.append([k,a[k]['semantic_state'],rr[0]['state'],'bounded consolidation' if n in [2,16,164] else 'new source view', '; '.join(r['locator'] for r in rr), 'S37 accepted primary evidence reused; not freshly read'])
with (D/'disposition-delta.csv').open('w') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['key','old_semantic_state','current_ledger_state','payload','locators','evidence']);w.writerows(out)
r={'head':H,'base':B,'resolvedKeys':len(resolved),'newViews':18,'consolidations':3,'remainingSemanticKeys':len(b),'remainingReasonUpdates':changed,'remainingStates':dict(collections.Counter(x['semantic_state'] for x in b.values())),'removedRollupRows':33,'semanticAbsenceCertified':False}
(D/'inventory-result.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))

"""Pinned mapping delta, identity manifest and isolated generator integrity; not fresh primary reading."""
import csv, io, json, pathlib, subprocess, tempfile
HERE=pathlib.Path(__file__).resolve().parent; P='docs/universes/packs/lds-standard-works/'
HEAD='180b337b6b661861e19a4f746c40a5714556e698'; BASE='c3e500e0c21d619a96b296a2a4b1e23753cadca6'; RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(b):return list(csv.DictReader(io.StringIO(b.decode())))
a=rows(read(HEAD,P+'supplementary-implementation.csv'));assert read(HEAD,P+'supplementary-implementation.csv')==read(BASE,P+'supplementary-implementation.csv')
assert len(a)==1365;sd=[x for x in a if x['disposition_id']];assert len(sd)==1271 and all(x['state']=='imported' for x in a)
xw=rows(read(HEAD,P+'typed-links.csv'));assert len(xw)==121
changed=subprocess.check_output(['git','diff','--name-only',BASE,HEAD]).decode().splitlines()
assert set(changed)=={P+'bmc-source-views.csv',P+'supplementary-build/copy_bmc.py',P+'supplementary-implementation.md'}
old=rows(read(BASE,P+'bmc-source-views.csv'));new=rows(read(HEAD,P+'bmc-source-views.csv'))
delta=[(x,y) for x,y in zip(old,new) if x!=y];assert len(old)==len(new)==374 and len(delta)==1
x,y=delta[0];assert x['research_key']==y['research_key']=='BMC-100'
assert [k for k in x if x[k]!=y[k]]==['reason']
assert y['reason']=='S37 decision: comparison view without a link; John 10 is cited as a source, with no shared scene or quotation claimed. NTC-other-sheep is not reused because its principal subject differs from this bounded good-shepherd comparison'
assert read(HEAD,'public/atlas/packs/lds-standard-works.js')==read(BASE,'public/atlas/packs/lds-standard-works.js')
with tempfile.TemporaryDirectory(prefix='church-s39-generator-') as d:
 root=pathlib.Path(d)
 names=subprocess.check_output(['git','ls-tree','-r','--name-only',HEAD,P+'supplementary-build/']).decode().splitlines()
 names += [P+'bmc-semantic-dispositions.csv',P+'bmc-fullread-ingestion.csv',P+'bmc-omission-rollup.csv',P+'bom-record-support.csv',P+'bmc-source-views.csv',P+'coverage-bom.csv',P+'coverage-bom.md',P+'bom-source-witnesses.csv',P+'coverage-ot-history.md',P+'coverage-ot-late-history.md','public/atlas/packs/lds-standard-works.js']
 for name in names:
  path=root/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(read(HEAD,name))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 for iteration in range(2):
  subprocess.check_output(['python',str(root/(P+'supplementary-build/bmc_omission_rollup.py')),str(root)])
  subprocess.check_output(['python',str(root/(P+'supplementary-build/bmc_semantic_pass.py')),str(root)])
  subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
  for path in [P+'bmc-semantic-dispositions.csv',P+'bmc-fullread-ingestion.csv',P+'bmc-omission-rollup.csv',P+'bmc-source-views.csv',P+'supplementary-implementation.csv',P+'identity-crosswalk.csv',P+'typed-links.csv','public/atlas/packs/lds-standard-works.js']:assert (root/path).read_bytes()==read(HEAD,path),(iteration,path)
r={'head':HEAD,'base':BASE,'acceptedRegister':RESEARCH,'mappingRows':len(a),'importedSD':len(sd),'pendingSD':0,'mappingUnchanged':True,'typedContractRows':len(xw),'generatorPasses':2,'packMappingAndBothCrosswalksByteIdentical':True,'newImports':0}
(HERE/'accounting-result.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))

ledger=rows(read(HEAD,P+'bmc-source-views.csv'));assert len(ledger)==374
from collections import Counter
counts=Counter(r['state'] for r in ledger);assert counts=={'implemented':110,'omitted':163,'scan-accepted':26,'scan-rejected':75}
assert len({r['research_key'] for r in ledger})==239


roll=rows(read(HEAD,P+'bmc-omission-rollup.csv')); states={r['research_key']:r['state'] for r in roll};assert len(states)==146
print(Counter(states.values()))

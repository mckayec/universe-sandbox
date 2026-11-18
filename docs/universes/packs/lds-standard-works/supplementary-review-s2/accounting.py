import csv,io,json,pathlib,subprocess,tempfile
HERE=pathlib.Path(__file__).resolve().parent
P='docs/universes/packs/lds-standard-works/'
BASE='fe24d334731c1b25c806c2300aa7a23f930babbb';HEAD='47debcfdb86a3e41a023a30e04c6fcd5bd7209b0';RESEARCH='9cc874c09a3686119ca6b4c17c7e16f214fd7ab6'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(r):return list(csv.DictReader(io.StringIO(read(r,P+'supplementary-implementation.csv').decode())))
b,a=rows(BASE),rows(HEAD);assert len(a)==len(b)==1278
changed=[i for i,(x,y) in enumerate(zip(b,a)) if x!=y];assert len(changed)==1
x,y=b[changed[0]],a[changed[0]];assert y['target_key']=='SC04.4'
assert [k for k in x if x[k]!=y[k]]==['locators'];assert y['locators']=='Mosiah 7:9; Mosiah 17:1–3; Mosiah 27:8'
sd=[r for r in a if r['disposition_id']];assert len(sd)==1271
accepted=list(csv.DictReader(io.StringIO(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv').decode())))
for m,r in zip(sd,accepted):
 for f in ['disposition_id','category','source_location','research_declaration','work_gate','consolidation_rule','row_sha256']:assert m[f]==r[f]
assert sum(r['state']=='imported' for r in sd)==111
assert sum(r['state']=='pending' for r in sd)==1160
with tempfile.TemporaryDirectory(prefix='lds-s2-audit-') as tmp:
 root=pathlib.Path(tmp)
 for p in [P+'supplementary-build/build.py',P+'supplementary-build/copy_bom.py','public/atlas/packs/lds-standard-works.js']:
  t=root/p;t.parent.mkdir(parents=True,exist_ok=True);t.write_bytes(read(HEAD,p))
 inp=root/'accepted.csv';inp.write_bytes(read(RESEARCH,P+'supplementary-dispositions/declaration-dispositions.csv'))
 subprocess.check_output(['python',str(root/(P+'supplementary-build/build.py')),str(inp)])
 for p in [P+'supplementary-implementation.csv','public/atlas/packs/lds-standard-works.js']:assert (root/p).read_bytes()==read(HEAD,p)
r={'head':HEAD,'base':BASE,'mappingRowsChecked':1278,'SDRowsCheckedAgainstResearch':1271,'importedSD':111,'proseCards':7,'pendingSD':1160,'changedMappingRows':['SC04.4 locators only'],'generatorPackAndMappingByteIdentical':True,'result':'pass'}
(HERE/'accounting-result.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))

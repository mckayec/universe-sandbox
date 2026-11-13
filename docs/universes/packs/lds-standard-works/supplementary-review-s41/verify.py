"""Pinned S40 correction verification; no browser and no new primary-source reading."""
import subprocess,csv,io,json,pathlib,tempfile,collections
HERE=pathlib.Path(__file__).resolve().parent
HEAD='52507fc725d1d4834aaf34449fedec685df28590';BASE='66c87095778b29b86e4750e48e8b9596dc21af10';P='docs/universes/packs/lds-standard-works/'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
def rows(r,p):return list(csv.DictReader(io.StringIO(read(r,p).decode())))
changed=subprocess.check_output(['git','diff','--name-only',BASE,HEAD]).decode().splitlines();assert len(changed)==7 and not any(x.startswith('public/') for x in changed)
for p in ['public/atlas/packs/lds-standard-works.js','public/atlas/engine.js','public/atlas/layers.js',P+'supplementary-implementation.csv',P+'bmc-semantic-dispositions.csv',P+'bmc-source-views.csv',P+'bmc-omission-rollup.csv']:assert read(HEAD,p)==read(BASE,p),p
r=rows(HEAD,P+'timeline-source-vision.csv');old=rows(BASE,P+'timeline-source-vision.csv');by={x['record']:x for x in r};assert len(by)==len(r)==154
for x in old:
 y=by[x['record']]
 for k in ['record','kind','name','gate','filter_years','date_text','date_class']:assert x[k]==y[k],(x['record'],k)
children=[x for x in r if 'inherited:' in x['vision_basis']];assert len(children)==21
for x in children:assert x['vision_class']=='vision-content' and x['source'] and not x['filter_years'] and x['date_class']=='no-year'
added=set(by)-{x['record'] for x in old}
expected={'codex:NTC-vision-sequence-'+str(i).zfill(2) for i in range(2,15)}|{'codex:OTM-j22-temple-tour-'+str(i) for i in [41,42,44,46]};assert added==expected
for k in expected:assert by[k]['gate']==('2/nt' if 'NTC-' in k else '1/ot')
for k in ['BXP01','AE09','AE10','BMV-202-three-disciples-john']:assert by['codex:'+k]['vision_class']=='not-vision'
with tempfile.TemporaryDirectory(prefix='s41-timeline-') as d:
 root=pathlib.Path(d)
 for p in ['public/atlas/packs/lds-standard-works.js',P+'supplementary-build/timeline_vision.cjs']:
  f=root/p;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(read(HEAD,p))
 for _ in range(2):
  subprocess.check_output(['node',str(root/(P+'supplementary-build/timeline_vision.cjs'))]);assert (root/(P+'timeline-source-vision.csv')).read_bytes()==read(HEAD,P+'timeline-source-vision.csv')
result={'head':HEAD,'base':BASE,'changedFiles':changed,'runtimeAndImportOmissionLedgersUnchanged':True,'rows':len(r),'priorRowsPreserved':len(old),'addedChildRows':len(added),'allInheritedChildren':len(children),'keywordCandidates':sum(x['vision_keyword']=='yes' for x in r),'visionClasses':dict(collections.Counter(x['vision_class'] for x in r)),'dateClasses':dict(collections.Counter(x['date_class'] for x in r)),'generatorReproductions':2,'browserExecuted':False,'result':'pass'}
(HERE/'verification-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

import subprocess,pathlib,json,csv,io,tempfile
HERE=pathlib.Path(__file__).resolve().parent
HEAD='d84599cd2e67abc9265cc00873bd9eb482a0ce14';BASE='b878e38a49ba76394f5e5d144e0cf09ae8e40b1e';MAIN='934b95e729a3439fad39a98fe7ca8cbc4c8362a7';P='docs/universes/packs/lds-standard-works/'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
pack='public/atlas/packs/lds-standard-works.js';a=read(BASE,pack);b=read(HEAD,pack)
assert a.count(b'New Testament narrative/vision \xe2\x80\x94 Matthew ')==2
assert a.replace(b'New Testament narrative/vision \xe2\x80\x94 Matthew ',b'New Testament narrative \xe2\x80\x94 Matthew ')==b
for p in ['public/atlas/engine.js','public/atlas/layers.js','public/atlas/engine.css',P+'supplementary-implementation.csv',P+'bmc-semantic-dispositions.csv',P+'bmc-omission-rollup.csv']:assert read(BASE,p)==read(HEAD,p)
def rows(r):return list(csv.DictReader(io.StringIO(read(r,P+'timeline-source-vision.csv').decode())))
a=rows(BASE);b=rows(HEAD);assert len(a)==154 and len(b)==152
assert [x for x in a if x['record'] not in ['codex:AE09','codex:AE10']]==b
with tempfile.TemporaryDirectory(prefix='s43-crosswalk-') as d:
 root=pathlib.Path(d)
 for p in [pack,P+'supplementary-build/timeline_vision.cjs']:
  f=root/p;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(read(HEAD,p))
 for _ in range(2):
  subprocess.check_output(['node',str(root/(P+'supplementary-build/timeline_vision.cjs'))]);assert (root/(P+'timeline-source-vision.csv')).read_bytes()==read(HEAD,P+'timeline-source-vision.csv')
m=subprocess.run(['git','merge-tree','--write-tree','--name-only',MAIN,HEAD],capture_output=True,text=True);assert m.returncode==0
out={'head':HEAD,'base':BASE,'onlyRuntimeChanges':'AE09/AE10 category suffix removed','remainingCrosswalkRowsUnchanged':152,'removedRows':['codex:AE09','codex:AE10'],'keywordCandidates':sum(x['vision_keyword']=='yes' for x in b),'generatorReproductions':2,'mergeTreeMain':MAIN,'mergeTreeExit':m.returncode,'mergeTreeOutput':m.stdout.strip(),'noBranchMergePerformed':True,'browserExecuted':False,'result':'pass'}
(HERE/'verification-result.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))

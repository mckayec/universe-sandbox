import subprocess,pathlib,json,re
HERE=pathlib.Path(__file__).resolve().parent
HEAD='b878e38a49ba76394f5e5d144e0cf09ae8e40b1e';BASE='52507fc725d1d4834aaf34449fedec685df28590';CODE='29ada5249e5924187f341c427611dbaeebb2c585';MAIN='96af7fd9009b3811e0a78f29bd2f46a183a4cd20'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p]).decode()
changed=subprocess.check_output(['git','diff','--name-only',BASE,HEAD]).decode().splitlines();assert len(changed)==4
assert [p for p in changed if p.startswith('public/')]==['public/atlas/engine.js']
a=read(BASE,'public/atlas/engine.js');b=read(HEAD,'public/atlas/engine.js')
label='<div id="labels"></div>'
assert a.count(label)==b.count(label)==1
# Only move the label container and add the explanatory comment: preserve all executable code otherwise.
norm=lambda s: re.sub(r'  /\* #labels follows.*?\*/\n','',s,flags=re.S).replace(label,'')
assert norm(a)==norm(b)
assert b.index('<header class="top"')<b.index('<aside class="panel" id="dossier"')<b.index(label)<b.index('<div id="announce"')
assert not subprocess.check_output(['git','diff','--name-only',CODE,HEAD,'--','public']).strip()
for p in ['public/atlas/packs/lds-standard-works.js','public/atlas/layers.js','public/atlas/engine.css','docs/universes/packs/lds-standard-works/timeline-source-vision.csv','docs/universes/packs/lds-standard-works/bmc-semantic-dispositions.csv']:assert read(BASE,p)==read(HEAD,p),p
r=subprocess.run(['git','merge-tree','--write-tree','--name-only',MAIN,HEAD],capture_output=True,text=True);assert r.returncode==0,r.stdout+r.stderr
out={'head':HEAD,'base':BASE,'builderTestedCode':CODE,'runtimeEqualToBuilderTestedCode':True,'changedFiles':changed,'onlyExecutableChange':'relocate labels container after side panels','packAndSemanticLedgersUnchanged':True,'mergeTreeBase':MAIN,'mergeTreeExit':r.returncode,'mergeTreeOutput':r.stdout.strip(),'noBranchOrWorktreeMergePerformed':True,'browserExecuted':False,'result':'pass'}
(HERE/'verification-result.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))

import subprocess,pathlib,json
HERE=pathlib.Path(__file__).resolve().parent
H='421a5bc0a65323a06bafd8c694f106823b71f1ff';B='4aa6571c45bd6cc9063e77c57f7a40156e0a4c26';P='docs/universes/packs/lds-standard-works/'
def read(r,p):return subprocess.check_output(['git','show',r+':'+p])
changed=subprocess.check_output(['git','diff','--name-only',B,H]).decode().splitlines();assert len(changed)==5 and all(p.startswith(P) for p in changed)
assert not subprocess.check_output(['git','diff','--name-only',B,H,'--','public','tests']).strip()
a=read(H,P+'supplementary-build/s42-probe.mjs').decode().splitlines();b=read(H,P+'supplementary-build/s46-finished-probe.mjs').decode().splitlines();assert a[1:]==[x.replace('s46-finished-${vp.width}','s42-finished-${vp.width}') for x in b[1:]]
log=read(H,P+'supplementary-build/s46-finished-probe-output.txt').decode();assert '[1731s] PASS' in log
for width,height in [(390,844),(1280,800)]:assert f'{width}x{height} bake finished' in log and f'"canvas":[{width},{height}]' in log
out={'head':H,'baseAndTestedRuntime':B,'changedFiles':changed,'allRuntimeAndTestsUnchanged':True,'probeDelta':'header comment and screenshot filename only','finishedViewports':[[390,844],[1280,800]],'terminalBuilderLog':'PASS','independentBrowserExecuted':False,'result':'pass'}
(HERE/'verification-result.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))

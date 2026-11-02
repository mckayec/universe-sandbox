"""Exact docs-only delta and screenshot byte provenance, not rendered execution."""
import subprocess,json,hashlib,pathlib
H='3e1f46091306c136610758a92a52589ac9a5e9f4'; B='6bf2812973995956e60cd3dc20472feb269cf916'; P='docs/universes/packs/lds-standard-works/'
def git(*a):return subprocess.check_output(['git',*a])
files=git('diff','--name-only',B,H).decode().splitlines()
shots=['s27-event-completed-1440x900.jpg','s27-event-moving-1440x900.jpg','s27-zion-390x844.jpg','s27-zion-link-1440x900.jpg']
assert set(files)=={P+'supplementary-implementation.md',*[P+'shots/'+f for f in shots]}
assert not git('diff',B,H,'--','public','src','tests','package.json','pnpm-lock.yaml',P+'supplementary-build',P+'typed-links.csv',P+'supplementary-implementation.csv')
r={'head':H,'base':B,'changedFiles':files,'applicationTestsGeneratorsMappingsUnchanged':True,'images':[{'path':P+'shots/'+f,'sha256':hashlib.sha256(git('show',H+':'+P+'shots/'+f)).hexdigest()} for f in shots],'scope':'Image hashes attest repository bytes; four images viewed independently. No browser/server execution or independent reproduction of builder probe.'}
print(json.dumps(r,indent=2))

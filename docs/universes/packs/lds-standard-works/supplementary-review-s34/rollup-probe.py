"""Audit the actual parser without invoking its writer; usage: python rollup-probe.py <exact checkout>."""
import csv, importlib.util, json, pathlib, re, subprocess, sys
root=pathlib.Path(sys.argv[1]).resolve(); head='29e888069f32f7e2e5cd0ea8a0b5912af5a52339'
assert subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD']).decode().strip()==head
p=root/'docs/universes/packs/lds-standard-works'
spec=importlib.util.spec_from_file_location('audited_rollup',p/'supplementary-build/bmc_omission_rollup.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
assert m.chapter_number_ranges('Alma 36:1–30') is None
assert m.chapter_number_ranges('Alma 36')==('Alma',36,36)
section='';skipped=[];seen=0
for line in (p/'coverage-bom.md').read_text().splitlines():
 if line.startswith('## '):section=line
 if not section.startswith('## Full-read omission checks'):continue
 x=re.match(r'\| \[([^\]]+)\]\((https://[^)]+)\) \| (.*) \|$',line)
 if not x:continue
 seen+=1
 if m.chapter_number_ranges(x[1]) is None:skipped.append({'reference':x[1],'body':x[3]})
ledger,fullread,cross=m.load_ledger();assert not any(a[0][0]=='Alma' and a[0][1]<=36<=a[0][2] for a in fullread)
rows=list(csv.DictReader((p/'bmc-omission-rollup.csv').open()));bad=[r for r in rows if r['research_key']=='BMC-131'];assert len(bad)==1 and bad[0]['state']=='reconciled-no-shared-name'
assert any('Jerusalem' in r['body'] and r['reference'].startswith('Alma 36:') for r in skipped)
result={'head':head,'matchedFullReadTableRows':seen,'parsedRows':len(fullread),'skippedRows':len(skipped),'skippedReferences':[r['reference'] for r in skipped],'counterexample':bad[0],'verdict':'parser coverage failure reproduced; no full-text absence inference'}
out=pathlib.Path(__file__).resolve().parent;(out/'rollup-probe-result.json').write_text(json.dumps(result,indent=2)+'\n')
with (out/'skipped-fullread-rows.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=['reference','body'],lineterminator='\n');w.writeheader();w.writerows(skipped)
print(json.dumps(result,indent=2))

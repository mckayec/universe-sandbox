"""Exact-head parser/ingestion regression, read-only actual module functions."""
import csv,importlib.util,json,pathlib,re,subprocess,sys
root=pathlib.Path(sys.argv[1]).resolve();head='a89df3ee1ee97d713790ef7f999c305befc54604';assert subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD']).decode().strip()==head
p=root/'docs/universes/packs/lds-standard-works';spec=importlib.util.spec_from_file_location('r',p/'supplementary-build/bmc_omission_rollup.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
cases={'Alma 36:1–30':('Alma',36,36),'Alma 36:1–37:5':('Alma',36,37),'1 Nephi 1–5':('1 Nephi',1,5),'Helaman 1:1–34':('Helaman',1,1),'Mosiah 29:1–47':('Mosiah',29,29),'Enos':('Enos',1,1),'Words of Mormon':('Words of Mormon',1,1)}
for ref,exp in cases.items():assert m.chapter_number_ranges(ref)==exp
assert m.chapter_number_ranges('unsupported reference') is None
_,full,_,inv=m.load_ledger();assert len(inv)==121 and len({r[0] for r in inv})==118 and all(r[6]=='consumed' for r in inv)
sec='';expected=set()
for n,l in enumerate((p/'coverage-bom.md').read_text().splitlines(),1):
 if l.startswith('## '):sec=l
 if sec.startswith('## Full-read omission checks') and l.startswith('| ['):expected.add(n)
assert expected=={r[0] for r in inv}
assert sum(':' in r[2] for r in inv)==76
assert sum(r[7]=='multi-link row' for r in inv)==4
assert any(r[0]==('Alma',36,36) and 'Egypt/Jerusalem' in r[2] for r in full)
roll=list(csv.DictReader((p/'bmc-omission-rollup.csv').open()));r=[x for x in roll if x['research_key']=='BMC-131'];assert {'Egypt','Jerusalem'}<={x['scan_name'] for x in r};assert all('1 full-read row' in x['evidence_scanned'] for x in r)
result={'head':head,'tableRows':118,'references':121,'verseQualified':76,'multiLinkReferences':4,'silentlySkippedCurrentRows':0,'explicitParserCases':len(cases)+1,'alma36EgyptJerusalemRecovered':True,'sourceAbsenceCertified':False,'result':'pass'}
(pathlib.Path(__file__).parent/'ingestion-result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

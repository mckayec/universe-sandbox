import argparse,csv,hashlib,json,re
from pathlib import Path
parser=argparse.ArgumentParser(description="Verify actual private source capture bytes against public witness metadata. Does not certify reading or historical truth.")
parser.add_argument("--archive",type=Path,default=Path("/workspace/lds-source-evidence/20261026"))
args=parser.parse_args()
base=Path(__file__).resolve().parent
archive=args.archive
summary={}; errors=[]
expected={"bom-source-witnesses.csv", "dc-source-witnesses.csv", "pgp-source-witnesses.csv", "nt-source-witnesses.csv", "ot-history-source-witnesses.csv", "ot-late-major-source-witnesses.csv", "ot-wisdom-source-witnesses.csv"}
missing_manifests=sorted(expected-{p.name for p in base.glob("*-source-witnesses.csv")})
for p in sorted(base.glob('*-witnesses.csv')):
 rows=list(csv.DictReader(p.open())); checks=0
 if not rows: errors.append(f'{p.name}: empty manifest')
 for i,r in enumerate(rows,2):
  date=r.get('actual_retrieval_date') or r.get('retrieval_date_utc') or r.get('retrieval_date') or ''
  url=r.get('source_url') or r.get('url') or ''
  completeness=r.get('body_completeness') or r.get('completeness') or r.get('completeness_window_gaps') or ''
  if not r.get('unit') or not r.get('witness') or not completeness: errors.append(f'{p.name}:{i}: missing unit/witness/completeness')
  if not re.fullmatch(r'\d{4}-\d{2}-\d{2}',date): errors.append(f'{p.name}:{i}: missing/invalid retrieval date')
  if not url.startswith('https://'): errors.append(f'{p.name}:{i}: missing source URL')
  hashes=(r.get('capture_sha256') or r.get('retrieval_sha256') or '').split(';')
  paths=(r.get('capture_path') or r.get('capture_files') or r.get('capture_filename') or r.get('private_capture') or '').split(';')
  if p.name.startswith('pgp-'): paths=[str(archive/'pgp'/f'{h.strip()}.txt') for h in hashes]
  elif p.name.startswith('bom-'): paths=[str(archive/'bom'/v) for v in paths]
  elif p.name.startswith('ot-history-'): paths=[str(archive/'ot-history'/v) for v in paths]
  elif p.name.startswith('dc-'): paths=[str(archive/'dc'/v) for v in paths]
  if len(paths)!=len(hashes): errors.append(f'{p.name}:{i}: mismatched paths/hashes'); continue
  for file,h in zip(paths,hashes):
   f=Path(file.strip())
   if f.is_absolute() and '/20261026/' in str(f): f=archive/str(f).split('/20261026/',1)[1]
   if not f.is_file(): errors.append(f'{p.name}:{i}: missing {f}'); continue
   if hashlib.sha256(f.read_bytes()).hexdigest()!=h.strip(): errors.append(f'{p.name}:{i}: hash mismatch {f}');continue
   checks+=1
 summary[p.name]={'rows':len(rows),'units':len({r['unit'] for r in rows}),'verified_capture_references':checks,'metadata_sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
print(json.dumps({'manifests':summary,'missing_manifests':missing_manifests,'errors':errors,'scope':'Capture bytes only; no certification of reading, extraction completeness, historical truth or normalized-body hashes'},indent=2))
raise SystemExit(bool(errors or missing_manifests))

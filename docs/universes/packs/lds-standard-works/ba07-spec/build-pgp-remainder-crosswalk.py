"""Tranche6: remaining primary PGP views; accepted source evidence reused."""
import csv,hashlib,io,re,sys
from pathlib import Path
P=Path(__file__).resolve().parent;B=P.parent
checks={
'PP01':'Name withheld; do not infer Horeb/Sinai or date ancient vision to June1830.',
'PP02':'Shared Eden concept, separate Moses/Abraham wording; no modern river-based location.',
'PP03':'Nod east of Eden in text; no measured direction or modern region.',
'PP04':'Shulon departure of Enos group; do not merge with BoM Enos.',
'PP05':'Cainan land named after son, not biblical Canaan; Enoch homeland is not an exact preaching site.',
'PP06':'Potiphar hill/Olishem altar association is not Egyptian location or surveyed Ur candidate.',
'PP07':'Reuse FM06 neutral hill identity from3; this JS—History source view stays5; no battlefield identification.',
'PP08':'Mahujah place differs from Mahijah person; instruction setting is not all vision geography.',
'PP09':'Mount Simeon ascent/vision; no surveyed mountain or physical itinerary through visionary regions.',
'PE01':'Vision/conversation attributed to Moses; June1830 is text-production metadata, not ancient event date.',
'PE04':'Cain’s son Enoch/city differs from Enoch’s Zion; no merged community.',
'PE05':'Enoch call while journeying from Cainan; no exact preaching location or date.',
'PE07':'Abraham reports altar rescue; no independent miracle verification or modern altar pin.',
'PE09':'Reported September22,1827 receipt, not1823first visit; reuse FM06 occurrence, preserve PGP5source gate.',
'PJ01':'Enos/group Shulon→Cainan; textual sequence only, no distance/direction or recovered route.',
'PJ02':'Enoch Mahujah→Simeon; narrative ascent only, not travel through places seen in vision.',
'PC09':'Nine named vision settings retained as source-qualified group; no modern boundaries or automatic person/place merges.',
'PC10':'Four Moses river names retained; shared names do not locate Eden or add named rivers to Abraham5.'
}
lines=(B/'pgp-inventory.md').read_text().splitlines();audit=(B/'core-pgp-audit.md').read_text().splitlines()
account={r['research_id']:r for r in csv.DictReader((B/'content-audit/research-import-accounting.csv').open())}
prior=set()
for f in ['minimum-content-crosswalk.csv','restoration-content-crosswalk.csv','bom-content-crosswalk.csv','bible-content-crosswalk.csv','bom-events-content-crosswalk.csv']:
 prior.update(r['research_id'] for r in csv.DictReader((P/f).open()))
rows=[]
for key,check in checks.items():
 assert key not in prior
 hits=[(i+1,s) for i,s in enumerate(lines) if s.startswith('| '+key+' ')];assert len(hits)==1
 line,raw=hits[0];cells=[s.strip() for s in raw.split('|')[1:-1]]
 copy='Pearl of Great Price — '+re.search('“([^”]+)”',raw).group(1)
 keys=re.findall(r'\[(PG\d+|S\d+)(?:[^\]]*)\]',raw);urls=[]
 for sk in keys:
  src=next(s for s in lines if s.startswith('| '+sk+' |')) if sk.startswith('PG') else (B/'sources.md').read_text().split('## '+sk+' — ',1)[1].split('\n## ',1)[0]
  urls+=re.findall(r'\]\((https://[^)]+)\)',src)
 al=next(i+1 for i,s in enumerate(audit) if s.startswith('| '+key+' |'))
 assert account[key]['disposition']=='not-represented-as-record' and urls
 rows.append(dict(research_id=key,priority=1 if key in ['PP07','PE09','PP01','PE01','PP05','PE04'] else 2,current_representation=account[key]['disposition'],accepted_label=cells[0],books='[5]',layers='["pgp"]',numeric_when='omit; PE09 reported1827-09-22 retained in prose',minimal_neutral_copy=copy,source_keys=';'.join(keys),source_urls=';'.join(dict.fromkeys(urls)),source_location=f'pgp-inventory.md:{line}',source_row_sha256=hashlib.sha256(raw.encode()).hexdigest(),prior_support=f'core-pgp-audit.md:{al}',shared_identity_exception='FM06 neutral identity/occurrence3; distinct PGP source view5' if key in ['PP07','PE09'] else 'reuse existing canonical identity if applicable; no new pin',disposition='nonspatial reference or textual sequence; source-qualified consolidation allowed',deferral='no blanket dense-display deferral; explicit disposition required for omission',acceptance_check=check))
assert len(rows)==18 and len(prior)==85
pgp={k for k in account if k.startswith(('PP','PE','PJ','PC'))}
assert len(pgp)==30 and pgp.issubset(prior|set(checks))
out=io.StringIO();w=csv.DictWriter(out,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
p=P/'pgp-remainder-content-crosswalk.csv'
if '--write' in sys.argv:p.write_text(out.getvalue())
else:assert p.read_text()==out.getvalue()
print('PASS:18 omitted PGP views;85prior views disjoint; all30primary PGP IDs now specified across tranches; exact rows/hashes,URLs,source gates and support-audit locations resolve. Not fresh reading/implementation approval.')

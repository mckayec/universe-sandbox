"""Reproduce tranche3 BC01–20 specifications; reused accepted evidence, not new reading."""
import csv,hashlib,io,re,sys
from pathlib import Path
P=Path(__file__).resolve().parent;B=P.parent
checks=[
'Distinguish Jacob narrating, Sherem debating and Enos receiving records; no outside historical corroboration implied.',
'Forest is unnamed and unlocated; prayer for two peoples is attributed narrative, not an ethnic judgment.',
'Jarom and Omni are distinct record custodians; do not invent a journey or coordinate for transfer.',
'Keep Mormon’s editorial explanation separate from the era of the earlier record and Moroni’s later writing.',
'Use Alma in Mosiah17, not an unqualified merge with later Alma; concealment does not locate a cave or city.',
'Preserve sharing followed later by division; no invented date marking the transition or eternal homogeneous society.',
'Keep Moroni’s safety context and invitation attributed; do not address visitor as if atlas certifies spiritual test.',
'Attribute instruction to Christ as recorded by Moroni; twelve disciples are not automatically the Jerusalem Twelve.',
'Distinguish elders performing ordination from priests/teachers ordained; no perpetual tenure implied.',
'Preserve bread and wine wording, both chapters and remembrance/Spirit relation; do not substitute later practice.',
'Keep repentance, ongoing care and forgiveness conditions; not proof that every community always complied.',
'Preserve Mormon as teacher and Moroni as recorder; charity is the text’s theological concept, not measured behavior.',
'Attribute position to Mormon’s letter; do not present it as neutral judgment on other traditions’ baptism practices.',
'Keep suffering among both peoples and hopeful ending; no sensational added detail or modern ethnic attribution.',
'Attribute blessings/discipleship to Jesus in3Nephi12; generic NT summary does not import this source view.',
'Keep3Nephi18 reported action separate from Moroni4–5 prayer text; no precise banquet site or artifact reconstruction.',
'Future New Jerusalem/gathering is teaching/prophecy; do not identify it with a surveyed modern city or dated completed route.',
'Preserve instruction to study Isaiah and amend record; not archaeological proof of resurrection or a second source attestation.',
'Preserve teaching about name and gospel; do not infer every similarly named historical institution is identical.',
'No modern identities/sightings, precise return date or biological immortality claim; retain attributed narrative promise.'
]
lines=(B/'bom-inventory.md').read_text().splitlines()
account={r['research_id']:r for r in csv.DictReader((B/'content-audit/research-import-accounting.csv').open())}
support={r['id']:r for r in csv.DictReader((B/'bom-record-support.csv').open())}
prior=set()
for file in ['minimum-content-crosswalk.csv','restoration-content-crosswalk.csv']:
 prior.update(r['research_id'] for r in csv.DictReader((P/file).open()))
rows=[]
for n,check in enumerate(checks,1):
 key=f'BC{n:02}';assert key not in prior
 matches=[(i+1,s) for i,s in enumerate(lines) if s.startswith('| '+key+';')];assert len(matches)==1
 line,raw=matches[0];label=raw.split('|')[1].strip();_,title,passage=label.split(';',2)
 copy='Book of Mormon — '+re.search('“([^”]+)”',raw).group(1)
 keys=re.findall(r'B\d+', ''.join(re.findall(r'\[(B[^\]]+)\]',raw)))
 urls=[]
 for source in keys:
  src=next(s for s in lines if s.startswith('| '+source+' |'))
  urls.extend(re.findall(r'\]\((https://[^)]+)\)',src))
 assert account[key]['disposition']=='not-represented-as-record'
 assert support[key]['status']=='supported-text' and support[key]['first']=='3'
 assert set(urls)=={s.strip() for s in support[key]['source_urls'].split(';')}
 group='record-transmission-and-short-books' if n<=7 else 'moroni-teachings-and-letters' if n<=14 else 'third-nephi-teachings'
 rows.append(dict(research_id=key,priority=1 if n<=7 else 2,consolidation_group=group,current_representation=account[key]['disposition'],proposed_title=title.strip(),books='[3]',layers='["bom"]',numeric_when='omit; narrative order/passage only',minimal_neutral_copy=copy,passage=passage.strip(),source_keys=';'.join(keys),source_urls=';'.join(dict.fromkeys(urls)),source_location=f'bom-inventory.md:{line}',source_row_sha256=hashlib.sha256(raw.encode()).hexdigest(),prior_support=f'bom-record-support.csv:id={key}',disposition='import attributed nonspatial codex source view; labeled consolidation allowed',deferral='no existing dense-display deferral for this material; omission requires explicit scope disposition',acceptance_check=check))
assert len(rows)==20 and len(prior)==33
out=io.StringIO();w=csv.DictWriter(out,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
p=P/'bom-content-crosswalk.csv'
if '--write' in sys.argv:p.write_text(out.getvalue())
else:assert p.read_text()==out.getvalue()
print('PASS:20 BC source-view specifications;20prior omissions; source URLs match prior support register; exact rows/hashes/gates; no overlap with33earlier views. No fresh primary verification.')

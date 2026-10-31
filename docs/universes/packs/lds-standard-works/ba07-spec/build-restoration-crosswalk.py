"""Tranche2: reproduce12 Restoration source-view specifications from accepted research."""
import csv,hashlib,io,re,sys
from pathlib import Path
P=Path(__file__).resolve().parent; B=P.parent
rules={
'RE14':(1,'Manifesto accepted','1890-10-06','Document history — ','Distinguish October6 acceptance from September24 Manifesto date; not instant end of all unions.','RC05;RE20'),
'RE20':(1,'Second Manifesto','1904-04-06','Church historical account — ','No additional numbered Official Declaration; stronger ban on new marriages is not automatic dissolution of existing families.','RC05;RE14'),
'RC05':(1,'Ending plural marriage','','','Retain transition, later marriages and1904prohibition; attribute Church history, not all Restoration movements.','RE14;RE20'),
'RE18':(1,'First Presidency letter','1978-06-08','Document history — ','Date printed letter, not first press release; no venue inferred. Retain Kimball/Tanner/Romney as signatories if shown.','RE17;RE19;RC06'),
'RE19':(1,'Declaration sustained','1978-09-30','Document history — ','Conference vote differs from June1confirmation and June8letter; no invented meeting-room pin.','RE17;RE18;RC06'),
'RC06':(1,'Racial priesthood and temple restrictions','','','Preserve distinct effects on men/women and stated repudiation; do not imply baptism/membership barred or women newly ordained.','RE17;RE18;RE19'),
'RE15':(2,'Vision of the redemption of the dead','1918-10-03','D&C138 — ','Attribute report to Joseph F. Smith, not Joseph Smith Jr.; no spirit-world map or exact room.','RE16;RC03'),
'RE16':(2,'Vision accepted by Church councils','1918-10-31','D&C138 heading — ','Council acceptance is not general-conference canonization; keep separate from October3vision and1976/1979publication history.','RE15;RC03;FM09'),
'RC03':(2,'Salvation for the dead','','','Retain D&C137 conditional wording and D&C138 messengers; existing Kirtland vision event is partial context only.','RE08;RE15;RE16'),
'RC01':(2,'Priesthood restoration accounts','','','Do not assign May15,1829 to Peter/James/John visitation; earliest extant1835record is not its event date.','RE01'),
'RC02':(2,'Authority and persuasion','','','Normative teaching is not proof all leaders complied; no invented physical event for doctrine.','RE07'),
'RC04':(2,'Organizing the journey','','','Retain obligations to vulnerable families; existing travel-instructions event is partial, not proof all companies complied.','RE11'),
}
lines=(B/'restoration-inventory.md').read_text().splitlines()
audit=(B/'restoration-record-audit.md').read_text().splitlines()
account={r['research_id']:r for r in csv.DictReader((B/'content-audit/research-import-accounting.csv').open())}
prior={r['research_id'] for r in csv.DictReader((P/'minimum-content-crosswalk.csv').open())}
rows=[]
for key,(priority,title,date,prefix,check,related) in rules.items():
 assert key not in prior
 matches=[(i+1,s) for i,s in enumerate(lines) if s.startswith('| '+key+' ')];assert len(matches)==1
 line,raw=matches[0]
 copy=re.search('“([^”]+)”',raw).group(1)
 # All dates come from the already accepted event row, not newly inferred timestamps.
 if date: assert '`'+date+'`' in raw
 copy=prefix+(date+': ' if date else '')+copy
 keys=list(dict.fromkeys(re.findall(r'\[(R\d+)\]',raw)));urls=[]
 for source in keys:
  src=next(s for s in lines if s.startswith('| '+source+' |'))
  urls.extend(re.findall(r'\]\((https://[^)]+)\)',src))
 auditline=next(i+1 for i,s in enumerate(audit) if s.startswith('| '+key+' |'))
 rows.append(dict(research_id=key,priority=priority,current_representation=account[key]['disposition'],existing_build_targets=account[key]['build_targets'],
 proposed_title=title,books='[4]',layers='["dc"]',date_as_attributed_text=date,numeric_when='omit for codex source view',minimal_neutral_copy=copy,
 source_location=f'restoration-inventory.md:{line}',source_row_sha256=hashlib.sha256(raw.encode()).hexdigest(),prior_support_audit=f'restoration-record-audit.md:{auditline}',
 source_keys=';'.join(keys),source_urls=';'.join(dict.fromkeys(urls)),related_research_ids=related,
 disposition='attributed nonspatial codex source view; source-qualified consolidation permitted',
 deferral='no accepted blanket deferral; any omission needs explicit scope disposition',acceptance_check=check))
assert len(rows)==12 and all(r['source_urls'] for r in rows)
assert sum(r['current_representation']=='not-represented-as-record' for r in rows)==10
assert sum(r['current_representation']=='partial-context-only' for r in rows)==2
out=io.StringIO();w=csv.DictWriter(out,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
p=P/'restoration-content-crosswalk.csv'
if '--write' in sys.argv:p.write_text(out.getvalue())
else:assert p.read_text()==out.getvalue()
print('PASS:12 distinct tranche2 rows (10 omitted,2 partial), no overlap with prior21; exact accepted dates, source rows/hashes,URLs,gates and prior audit locations resolve. Not fresh primary validation.')

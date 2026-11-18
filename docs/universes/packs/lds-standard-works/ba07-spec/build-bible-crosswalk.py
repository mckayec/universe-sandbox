"""Tranche4: remaining AE/AC views; accepted evidence reused, no fresh source reading."""
import csv,hashlib,io,re,sys
from pathlib import Path
P=Path(__file__).resolve().parent;B=P.parent
rules={
'AE01':(1,'Journey into the wilderness','Exodus13:17–22','No recovered Philistine/wilderness road or BCE conversion; divine guidance stays attributed.'),
'AE02':(1,'Israel at Sinai','Exodus19:1–6','Third month after departure is relative narrative time; no chosen modern Sinai or calculated date.'),
'AE03':(1,'Crossing the Jordan','Joshua3:1,14–17','Attribute stopped-waters account; no exact river crossing or archaeological proof from Jericho pin.'),
'AE09':(2,'Prayer before arrest','Matthew26:30–57','Existing Gethsemane card is partial context; preserve prayer-before-arrest sequence and source; no chosen modern garden.'),
'AE10':(2,'Crucifixion in Matthew','Matthew27:33–35','Existing Golgotha card is partial context; retain Matthew attribution; no harmonized Gospel date or chosen candidate site.'),
'AE14':(2,'Vision of a new city','Revelation21:1–4','No terrestrial city identity, modern pin, dated completion or equivalence to Independence/Jerusalem.'),
'AC01':(1,'Exodus map uncertainty','Church Bible map2','Preserve possible-route/questioned-location status; no tracing or upgrading artwork to settled geography.'),
'AC02':(1,'Text and archaeology','Joshua6:20–25; UNESCO1687','Visible editorial evidence distinction; Tell es-Sultan marker does not prove conquest episode or destruction-date concordance.'),
'AC03':(2,'Revelation setting and vision','Revelation1:9–11;21:1–4','Distinguish Patmos setting from visionary city; no claim all imagery is literal cartography or merely fiction.'),
}
lines=(B/'bible-inventory.md').read_text().splitlines();audit=(B/'bible-record-audit.md').read_text().splitlines()
account={r['research_id']:r for r in csv.DictReader((B/'content-audit/research-import-accounting.csv').open())}
prior=set()
for file in ['minimum-content-crosswalk.csv','restoration-content-crosswalk.csv','bom-content-crosswalk.csv']:
 prior.update(r['research_id'] for r in csv.DictReader((P/file).open()))
rows=[]
for key,(gate,title,passage,check) in rules.items():
 assert key not in prior
 matches=[(i+1,s) for i,s in enumerate(lines) if s.startswith('| '+key+' ')];assert len(matches)==1
 line,raw=matches[0];text=re.search('“([^”]+)”',raw).group(1)
 if key=='AE09': text='Matthew narrates Jesus’ prayer at Gethsemane before his arrest.'
 if key=='AC02':text='Editorial evidence note: '+text
 elif key.startswith('AE'):text=('Old Testament narrative — ' if gate==1 else 'New Testament narrative/vision — ')+text
 keys=list(dict.fromkeys(re.findall(r'A\d+', ''.join(re.findall(r'\[(A[^\]]+)\]',raw)))))
 urls=[]
 for sk in keys:
  src=next(s for s in lines if s.startswith('| '+sk+' |'));urls+=re.findall(r'\]\((https://[^)]+)\)',src)
 al=next(i+1 for i,s in enumerate(audit) if s.startswith('| '+key+' |'))
 rows.append(dict(research_id=key,priority=1 if gate==1 else 2,current_representation=account[key]['disposition'],existing_build_targets=account[key]['build_targets'],proposed_title=title,books=f'[{gate}]',layers='["ot"]' if gate==1 else '["nt"]',numeric_when='omit; preserve relative/narrative wording only',minimal_neutral_copy=text,passage=passage,source_keys=';'.join(keys),source_urls=';'.join(dict.fromkeys(urls)),source_location=f'bible-inventory.md:{line}',source_row_sha256=hashlib.sha256(raw.encode()).hexdigest(),prior_support=f'bible-record-audit.md:{al}',disposition='attributed nonspatial reference view; labeled consolidation allowed',deferral='no blanket dense-display deferral; any omission needs explicit scope disposition',acceptance_check=check))
assert len(prior)==53 and len(rows)==9
assert {k for k,v in account.items() if k.startswith(('AE','AC')) and v['disposition']!='represented'}==set(rules)
assert sum(r['current_representation']=='not-represented-as-record' for r in rows)==7
assert sum(r['current_representation']=='partial-context-only' for r in rows)==2
assert all(r['source_urls'] for r in rows)
out=io.StringIO();w=csv.DictWriter(out,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
p=P/'bible-content-crosswalk.csv'
if '--write' in sys.argv:p.write_text(out.getvalue())
else:assert p.read_text()==out.getvalue()
print('PASS:9 remaining AE/AC rows (7omitted,2partial); all other8AE rows already represented;53earlier views disjoint; source hashes,URLs,prior audit locations and gates resolve. Not implementation approval.')

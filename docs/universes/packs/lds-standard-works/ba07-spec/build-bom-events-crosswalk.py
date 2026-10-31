"""Tranche5: BE01–23 narrative minimums from accepted evidence, no fresh reading."""
import csv,hashlib,io,re,sys
from pathlib import Path
P=Path(__file__).resolve().parent;B=P.parent
checks=[
'No modern valley/river coordinate; distinguish valley Lemuel from river Laman.',
'Burial narrative does not prove a modern Nahom identification or excavated grave.',
'Arabian Bountiful is distinct from American Bountiful/3Nephi temple; no modern shipyard or hull reconstruction.',
'Arrival/planting do not locate a continent coast or exact landing beach; no ocean distance inferred.',
'Settlement named Nephi is not the person; no assumption withdrawal began on the original landing beach.',
'Mosiah in Omni is distinct from later Mosiah in Limhi/Alma migrations; no invented union date.',
'Tower near temple is a narrative relation, not measured building geometry or an excavated monument.',
'Ammon plus three descend; imprisonment precedes formal audience two days later. Not son-of-Mosiah Ammon.',
'Night escape skirts Shilom; do not replace around with through or add a recovered road.',
'Eight-day flight precedes settlement; Helam is not a single overnight camp; distinct from Limhi escape.',
'One day to valley then twelve after leaving; retain pause, do not label thirteen uninterrupted travel days.',
'Later Alma ministry in judges-year10; do not merge actor with Mosiah23 Alma; no CE/BCE conversion.',
'Between Moroni and Aaron is source relation, not solved coordinates; keep later Nephihah textual tension visible if expanded.',
'Restore Pahoran at Zarahemla then retake Nephihah; no claim he accompanies every subsequent campaign leg.',
'Northward remains narrative direction; scarce timber does not identify a modern ecology or latitude.',
'Samuel denied entry preaches from wall; do not invent tower, wall dimensions or modern city.',
'Year34/month1/day4 is narrative notation; Zarahemla burns, Moroni sinks; no modern disaster correlation.',
'Healing follows appearance context; do not assign exact day or merge this proposition into generic E07 appearance.',
'Rebuilding distinct from prior destruction; no exact construction year or silent unchanged city-state claim.',
'Angola→David→Joshua/western sea is early retreat only; no invented continuous route onward to Cumorah.',
'Gathering after384years is not automatic battle date; survivors retained; no NewYorkbattlefield identification.',
'344days describes Jaredite water travel, not Lehite crossing, distance or BCE date.',
'Shiz at Ogath and Coriantumr at Ramah are separate camps; no shared itinerary, modernhill proof or unwritten death claim.'
]
lines=(B/'bom-inventory.md').read_text().splitlines()
account={r['research_id']:r for r in csv.DictReader((B/'content-audit/research-import-accounting.csv').open())}
support={r['id']:r for r in csv.DictReader((B/'bom-record-support.csv').open())}
prior=set()
for file in ['minimum-content-crosswalk.csv','restoration-content-crosswalk.csv','bom-content-crosswalk.csv','bible-content-crosswalk.csv']:
 prior.update(r['research_id'] for r in csv.DictReader((P/file).open()))
rows=[]
for n,check in enumerate(checks,1):
 key=f'BE{n:02}';assert key not in prior
 matches=[(i+1,s) for i,s in enumerate(lines) if s.startswith('| '+key+' —')];assert len(matches)==1
 line,raw=matches[0];cells=[s.strip() for s in raw.split('|')[1:-1]]
 title=cells[0].split(' — ',1)[1];chronology=cells[2].split('“',1)[0].strip()
 copy='Book of Mormon narrative — '+re.search('“([^”]+)”',raw).group(1)
 keys=re.findall(r'B\d+', ''.join(re.findall(r'\[(B[^\]]+)\]',raw)));urls=[]
 for sk in keys:
  src=next(s for s in lines if s.startswith('| '+sk+' |'));urls+=re.findall(r'\]\((https://[^)]+)\)',src)
 assert account[key]['disposition']=='not-represented-as-record'
 assert support[key]['status']==('corrected-supported' if key=='BE08' else 'supported-text') and support[key]['first']=='3'
 assert set(urls)=={s.strip() for s in support[key]['source_urls'].split(';')}
 rows.append(dict(research_id=key,priority=1 if 6<=n<=11 or 17<=n<=19 else 2,consolidation_group='early-households' if n<=5 else 'nephi-zarahemla-communities' if n<=11 else 'judges-to-rebuilding' if n<=19 else 'distinct-late-narrative-threads',current_representation=account[key]['disposition'],proposed_title=title,books='[3]',layers='["bom"]',numeric_when='omit; source chronology displayed as text only',source_chronology_text=chronology,minimal_neutral_copy=copy,places_actors_passage=cells[1],source_keys=';'.join(keys),source_urls=';'.join(dict.fromkeys(urls)),source_location=f'bom-inventory.md:{line}',source_row_sha256=hashlib.sha256(raw.encode()).hexdigest(),prior_support=f'bom-record-support.csv:id={key}',prior_support_status=support[key]['status'],disposition='nonspatial narrative reference view; labeled consolidation allowed',deferral='no blanket dense-display deferral; omission needs explicit scope disposition',acceptance_check=check))
assert len(prior)==62 and len(rows)==23
out=io.StringIO();w=csv.DictWriter(out,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
p=P/'bom-events-content-crosswalk.csv'
if '--write' in sys.argv:p.write_text(out.getvalue())
else:assert p.read_text()==out.getvalue()
print('PASS:23BE specs,23prior omissions, chronology/rows/hashes retained, URLs agree with prior support, no overlap with62earlier views. Not new primary validation.')

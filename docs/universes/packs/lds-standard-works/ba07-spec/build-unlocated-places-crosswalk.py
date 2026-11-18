"""Tranche 9: 30 BP places, six AP places and AJ01. No geometry inferred."""
import csv, hashlib, io, re, sys
from pathlib import Path
P=Path(__file__).resolve().parent; B=P.parent
prior_files=['minimum-content-crosswalk.csv','restoration-content-crosswalk.csv','bom-content-crosswalk.csv','bible-content-crosswalk.csv','bom-events-content-crosswalk.csv','pgp-remainder-content-crosswalk.csv','restoration-events-content-crosswalk.csv','bom-journeys-content-crosswalk.csv']
prior={r['research_id'] for f in prior_files for r in csv.DictReader((P/f).open())}
assert len(prior)==119
account={r['research_id']:r for r in csv.DictReader((B/'content-audit/research-import-accounting.csv').open())}
support={r['id']:r for r in csv.DictReader((B/'bom-record-support.csv').open())}
rows=[]
def add(key,title,copy,gate,layer,urls,passage,check,consolidate,evidence):
 a=account[key];file,line=a['research_location'].split(':');raw=(B/file).read_text().splitlines()[int(line)-1]
 assert raw==a['research_row'] and key not in prior and a['disposition']=='not-represented-as-record'
 rows.append(dict(research_id=key,priority=1 if key in ['AJ01','BP03','BP14','BP26','AP34'] else 2,proposed_title=title,minimal_neutral_copy=copy,books=f'[{gate}]',layers='["'+layer+'"]',numeric_when='omit; no absolute year inferred',geometry='none; nonspatial source view',source_urls=urls,source_locator=passage,source_location=a['research_location'],source_row_sha256=hashlib.sha256(raw.encode()).hexdigest(),source_context=raw,evidence_mode=evidence,current_representation='not represented in original accounting; no keyed import at 5a9711e',consolidation=consolidate,acceptance_check=check,deferral='not covered by blanket dense-display deferral; explicit disposition required'))
for i in range(1,31):
 k=f'BP{i:02}';a=account[k];raw=a['research_row'];cells=[x.strip() for x in raw.split('|')[1:-1]]
 title=cells[0].split(';')[1].strip();copy=re.search('“([^”]+)”',cells[1]).group(1)
 if k=='BP03':copy+=' Mosiah uses Lehi-Nephi and Nephi in Limhi’s setting; later uses remain attached to their passages.'
 s=support[k];assert s['status']=='supported-text' and s['first']=='3'
 passage=re.sub(r'\[[^]]+\]|\(C\)','',cells[1]).strip()
 check=cells[2]+'; preserve land/city/river/camp kind and attribution; no Earth pin, distance, mapped course or inferred calendar.'
 extra={3:'Do not flatten all Nephi/Lehi-Nephi episodes into one city footprint.',4:'Keep the earlier Mosiah in Omni distinct from the later king; burning/rebuilding require their own 3 Nephi sources.',9:'West/head relations are textual; no full flow course or modern river.',14:'American Bountiful differs from Arabian Bountiful and from its temple setting P10.',16:'No conversion of travel time into kilometers; no selected modern isthmus.',18:'Moroni city is not Moroni the person; sinking is a separately sourced 3 Nephi episode.',19:'No claim that Alma 51 is free of the previously recorded Nephihah tension.',20:'Do not merge with Aaron in every other passage.',21:'North/coast wording remains source-relative, not a continental placement.',26:'Do not equate the battle hill with the New York record-recovery hill or import its coordinates.',27:'Do not merge Jaredite and Lehite landings.',29:'Shiz camps at Ogath; do not route Coriantumr through it.',30:'Temple gathering and tower are not a measured site plan.'}
 if i in extra:check+=' '+extra[i]
 add(k,title,'Book of Mormon — '+copy,3,'bom',s['source_urls'],passage,check,'Reuse stable bom- identity in related BE/BJ views; one entity may have distinct source views. Preserve this ID in import crosswalk even if consolidated.','accepted bom-record-support.csv:'+k+' reused; no new primary reading')
root='https://www.churchofjesuschrist.org/study/scriptures/'
ex13=root+'ot/ex/13?lang=eng';ex19=root+'ot/ex/19?lang=eng';josh=root+'ot/josh/3?lang=eng';rev=root+'nt/rev/21?lang=eng'
data=[
('AP01','Succoth (Exodus)','Exodus describes Israel departing from Succoth and camping at Etham.',ex13,'Exodus 13:20','Distinguish other places named Succoth; no modern identification adopted.'),
('AP02','Etham','Exodus places Israel’s camp at Etham at the edge of the wilderness.',ex13,'Exodus 13:20','Wilderness edge is a narrative relation, not a measured boundary.'),
('AP03','Rephidim','Exodus describes Israel leaving Rephidim and camping in the wilderness of Sinai.',ex19,'Exodus 19:2','Do not add a modern Rephidim candidate or intervening route geometry.'),
('AP04','Sinai camp and mountain','Exodus describes Israel camping before the mountain and Moses receiving a divine summons there.',ex19,'Exodus 19:1–3','Keep camp and mountain roles distinct; no modern summit, exact camp or identity with Moses 1’s unnamed mountain inferred.'),
('AP05','Jordan crossing in Joshua','Joshua’s narrative places Israel’s crossing of the Jordan opposite Jericho, with the priests standing on dry ground.',josh,'Joshua 3:16–17','No exact crossing coordinate, river centroid or heritage point proves the narrated crossing.'),
('AP34','New Jerusalem (Revelation)','Revelation describes John seeing a new Jerusalem descending from heaven.',rev,'Revelation 21:2','Visionary city: no modern Jerusalem or Independence pin, projected landing position or event year.'),
('AJ01','Selected Exodus travel statements','Exodus describes Israel traveling from Succoth to Etham. A separate passage describes departure from Rephidim and arrival in the wilderness of Sinai. The intervening itinerary is not supplied in this selected sequence.',ex13+';'+ex19,'Exodus 13:20; 19:2','Two sequences only: AP01→AP02; separately AP03→AP04. No AP02→AP03 bridge, P04 departure extension, distance, travel duration or recovered road.')]
for k,title,copy,urls,passage,check in data:
 gate=2 if k=='AP34' else 1
 consolidation='Reuse corresponding place identity in AJ01; preserve per-ID evidence and distinct stop roles.'
 if k=='AP04':consolidation='Relate to existing P05 Horeb and AE02 narrative without asserting one modern mountain or merging source passages.'
 if k=='AP05':consolidation='May share AE03 card if crossing setting and both IDs remain explicitly accounted; no second invented event.'
 if k=='AP34':consolidation='May consolidate with AE14 and AC03 while retaining visionary-place facet and all three ID dispositions; not an extra historical city.'
 if k=='AJ01':consolidation='Can present AP01–04 in one textual itinerary panel; preserve both disconnected segments and five distinct research-ID dispositions.'
 add(k,title,copy,gate,'nt' if gate==2 else 'ot',urls,passage,check,consolidation,'targeted official primary passage accessed 2026-10-31; see unlocated-places-source-check.md')
assert len(rows)==37 and len({r['research_id'] for r in rows}|prior)==156
assert {r['research_id'] for r in rows if r['research_id'].startswith('BP')}=={k for k in account if k.startswith('BP')}
out=io.StringIO();w=csv.DictWriter(out,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
f=P/'unlocated-places-content-crosswalk.csv'
if '--write' in sys.argv:f.write_text(out.getvalue())
else:assert f.read_text()==out.getvalue()
print('PASS: 37 distinct specifications; 30 BP + six AP + AJ01; disjoint from prior 119, total 156. Exact accepted rows/hashes and BoM support retained. Bible targeted access separately documented. No implementation certification.')

"""Reproduce 21 source-qualified minimum content specifications; not source revalidation."""
import csv,hashlib,io,re,sys
from pathlib import Path
P=Path(__file__).resolve().parent
B=P.parent
rules={
'PE02':('Creation in Moses','No absolute epoch or geological duration; retain Moses attribution, separate from PE08.'),
'PE03':('Leaving Eden in Moses','No coordinate for Eden; retain expulsion and subsequent life as narrative order, not dated history.'),
'PE06':('Noah’s warning in Moses','Do not add a completed Flood or ark landing: Moses8 ends with warning.'),
'PE08':('Creation in Abraham','Keep divine beings/organization wording; do not harmonize with Moses or calculate a timescale.'),
'PC01':('Facsimile 1: published explanation','Attribute figures to published explanation; do not label them an Egyptological identification or pin altar in Egypt.'),
'PC02':('Facsimile 2: published explanation','C05 Kolob is not this caption view; no measured astronomy or unrevealed caption expansion.'),
'PC03':('Facsimile 3: published explanation','No named historical Pharaoh/palace or independent translation claim; no artwork import.'),
'PC04':('Prophecy in Joseph Smith—Matthew','P20 Olives setting is not this prophecy; no calculated coming date or completed flight route.'),
'PC05':('Book of Abraham: Church account of papyri','Explicitly attribute to Church essay; no claim of independent figure-by-figure Ritner comparison.'),
'PC06':('Articles of Faith 1–3','Keep belief attribution; existing C06 article4 and C07 articles8–9 do not substitute for these.'),
'PC07':('Articles of Faith 5–7','No inferred permanent office tenure or historical chronology; preserve confession-of-belief framing.'),
'PC08':('Articles of Faith 10–13','Future hopes are belief statements, not dated predictions or map routes.'),
'FM01':('Book of Mormon publication setting','Reuse RP03/Palmyra neutral entity at3 with bom access; gate detailed RE04 D&C history separately. Salt Lake publishing is not1847 arrival.'),
'FM02':('Book of Mormon title and attributed record','Keep abridgment/authorship/translation roles distinct; no recovered-artifact claim.'),
'FM03':('Book of Mormon introduction','Keep official editorial attribution and among wording; no exclusive Indigenous ancestry/DNA claim or battlefield identification.'),
'FM04':('Testimony of Three Witnesses','Retain three names and printed testimony attribution at3; no venue/day inferred; reuse person identities, not new duplicate people.'),
'FM05':('Testimony of Eight Witnesses','Retain testimony/appearance wording, not metallurgy; resolve eight signatories via source row, no invented date/venue or surname kinship.'),
'FM06':('Joseph Smith’s testimony of the plates','Reuse PP07/PE09 episode identities with a separate BoM view at3. PGP account stays5. Do not expose First Vision/woods via this gate.'),
'FM07':('Book of Mormon record explanation','Distinguish textual plates/provenance families; do not claim archaeological recovery or silently convert editorial dates to history.'),
'FM08':('Doctrine and Covenants collection history','C04 is partial framing only; preserve compilation/revision history separately from dates of reported ancient/modern episodes.'),
'FM09':('Pearl of Great Price collection history','Separate1851collection,1880canonization,1976addition,1979transfer and1981edition if expanded; none dates Abraham’s journey.'),
}
account={r['research_id']:r for r in csv.DictReader((B/'content-audit/research-import-accounting.csv').open())}
rows=[]
for key,(title,check) in rules.items():
 file='frontmatter-inventory.md' if key.startswith('FM') else 'pgp-inventory.md'
 lines=(B/file).read_text().splitlines()
 matches=[(i+1,s) for i,s in enumerate(lines) if s.startswith('| '+key+' ')]
 assert len(matches)==1,key
 line,raw=matches[0]
 copy=re.search('“([^”]+)”',raw).group(1)
 if key.startswith('PE'): copy='Pearl of Great Price — '+copy
 elif key in ['PC01','PC02','PC03']: copy='Pearl of Great Price — '+copy
 elif key in ['PC06','PC07','PC08']: copy='Articles of Faith — '+copy
 elif key=='PC04': copy='Joseph Smith—Matthew — '+copy
 urls=re.findall(r'\]\((https://[^)]+)\)',raw)
 sourcekeys=[]
 if not urls:
  sourcekeys=re.findall(r'\[(PG\d+|S\d+)(?:[^\]]*)\]',raw)
  for sk in sourcekeys:
   if sk.startswith('PG'):
    src=next(s for s in lines if s.startswith('| '+sk+' |'))
   else:
    src=(B/'sources.md').read_text().split('## '+sk+' — ',1)[1].split('\n## ',1)[0]
   urls.extend(re.findall(r'\]\((https://[^)]+)\)',src))
 first=3 if key in [f'FM{i:02}' for i in range(1,8)] else 4 if key=='FM08' else 5
 layer={3:'bom',4:'dc',5:'pgp'}[first]
 current=account[key]['disposition'] if key in account else 'no dedicated FM source-view card; shared identity/context only'
 rows.append(dict(research_id=key,priority=1 if key in ['FM01','FM04','FM05','FM06','PC01','PC02','PC03','PC04','PC05'] else 2,
 category='frontmatter source view' if key.startswith('FM') else 'PGP narrative' if key.startswith('PE') else 'PGP explanatory entry',
 current_representation=current,source_location=f'{file}:{line}',source_row_sha256=hashlib.sha256(raw.encode()).hexdigest(),
 proposed_title=title,books=f'[{first}]',layers=f'["{layer}"]',minimal_neutral_copy=copy,
 source_keys=';'.join(sourcekeys),source_urls=';'.join(dict.fromkeys(urls)),
 required_disposition='import as attributed nonspatial codex source view; consolidation allowed only retaining text/source/gate',
 deferral='no existing blanket deferral; omission requires explicit scope disposition, not missing coordinates',
 acceptance_check=check))
assert len(rows)==21 and len({r['research_id'] for r in rows})==21
assert all(r['source_urls'] for r in rows)
assert all(account[r['research_id']]['disposition']=='not-represented-as-record' for r in rows if not r['research_id'].startswith('FM'))
out=io.StringIO();w=csv.DictWriter(out,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
path=P/'minimum-content-crosswalk.csv'
if '--write' in sys.argv:path.write_text(out.getvalue())
else:assert path.read_text()==out.getvalue(),'crosswalk differs from accepted source rows/specification'
print('PASS:21 unique specifications,12 prior omitted PGP records,9 FM source views; every source row/hash,URL and gate present. No primary rereading or implementation acceptance claimed.')

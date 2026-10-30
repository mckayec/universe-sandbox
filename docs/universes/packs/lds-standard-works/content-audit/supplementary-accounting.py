"""Reproduce bounded supplementary category accounting; no primary-source certification.
Run without arguments to check saved output; --write regenerates the two inventories.
Section rows are declarations/views, NOT globally unique entities or build mandates.
"""
import csv
import hashlib
import io
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
BASE = HERE.parent
config = json.loads((HERE / 'supplementary-sections.json').read_text())
primary = {r['research_id'] for r in csv.DictReader((HERE / 'research-import-accounting.csv').open())}
categories, declarations = [], []
for filename, headings in config.items():
    lines = (BASE / filename).read_text().splitlines(keepends=True)
    for heading in headings:
        start = 0 if heading == '@preamble' else next(i for i,s in enumerate(lines) if re.sub(r'^#+ ', '', s).strip() == heading)
        end = next((i for i in range(start+1,len(lines)) if re.match(r'^#{2,} ',lines[i])),len(lines))
        cid = f'SC{len(categories)+1:02}'
        keys, reused = [], []
        # Table header is identified by the following separator; no pipes inside quoted cells are parsed.
        for i in range(start,end):
            s = lines[i].strip()
            if not s.startswith('|') or re.match(r'^\|[\s:|-]+$',s):
                continue
            if i+1 < end and re.match(r'^\|[\s:|-]+$',lines[i+1].strip()):
                continue
            key = s.split('|')[1].strip()
            first = key.strip('`').split()[0] if key else ''
            is_primary = first in primary
            (reused if is_primary else keys).append(key)
            declarations.append(dict(category=cid,location=f'{filename}:{i+1}',declaration=key,
                primary_reuse=str(is_primary).lower(),row_sha256=hashlib.sha256(lines[i].encode()).hexdigest()))
        if 'apparatus' in heading.lower():
            disposition='reference-constraints-retained-in-research; no standalone object required'
        elif heading == 'Named model comparisons':
            disposition='omitted-model-comparison; detailed geometry evidence-limited; no Earth-pin requirement'
        elif filename=='coverage-bom.md' and 'Place' in heading or filename=='coverage-bom.md' and 'place register' in heading:
            disposition='omitted-supplementary-nonspatial-place-family; no blanket deferral'
        else:
            disposition='partial-at-category-level; core overlaps do not import supplementary source views'
        categories.append(dict(category=cid,file=filename,section=heading,start_line=start+1,end_line=end,
            table_declarations=len(keys)+len(reused),primary_reuse_rows=len(reused),supplementary_declaration_views=len(keys),
            disposition=disposition,deferral_authority='none for wholesale omission',
            section_sha256=hashlib.sha256(''.join(lines[start:end]).encode()).hexdigest()))
for filename in ['joshua-allotment-register.csv','ot-history-relationship-payload.csv','late-history-relationship-contexts.csv','late-history-relationship-register.csv','late-history-chain-payload.csv','late-history-literal-relation-pairs.csv','nt-relationship-expansion.csv','nt-people-roster-payload.csv']:
    data=(BASE/filename).read_bytes()
    n=len(list(csv.DictReader(io.StringIO(data.decode()))))
    categories.append(dict(category=f'SC{len(categories)+1:02}',file=filename,section='whole dense payload (overlapping views)',start_line=1,end_line=len(data.splitlines()),table_declarations=n,primary_reuse_rows='',supplementary_declaration_views='',disposition='approved-display-deferral; retain cited research and essential relationships',deferral_authority='research-addendum.md:A04/Q04/RR06 lines67-71',section_sha256=hashlib.sha256(data).hexdigest()))
for name,rows in [('supplementary-category-accounting.csv',categories),('supplementary-declaration-index.csv',declarations)]:
    out=io.StringIO(newline=''); w=csv.DictWriter(out,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
    target=HERE/name
    if '--write' in sys.argv: target.write_text(out.getvalue())
    else: assert target.read_text()==out.getvalue(),f'stale {name}'
print(json.dumps(dict(categories=len(categories),markdown_categories=len(categories)-8,dense_payload_families=8,table_declaration_views=len(declarations),primary_reuse_views=sum(r['primary_reuse']=='true' for r in declarations),note='Overlapping source views, not unique new entities; section prose retained by bounds/hash.')))

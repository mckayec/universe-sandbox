"""Expand accepted supplementary requirements without inventing entities or source access."""
import csv,hashlib,io,json,re,sys
from pathlib import Path
P=Path(__file__).resolve().parent;B=P.parent
read=lambda p:list(csv.DictReader(p.open()))
cats=read(B/'content-audit/supplementary-category-accounting.csv')
decls=read(B/'content-audit/supplementary-declaration-index.csv')
rules={r['category']:r for r in csv.DictReader((P/'category-rules.tsv').open(),delimiter='\t')}
assert len(rules)==len(cats)==62 and len(decls)==1271
specified={r['research_id'] for f in (B/'ba07-spec').glob('*crosswalk.csv') for r in read(f)}
assert len(specified)==169
rows=[];sections=[]
for cat in cats:
 cid=cat['category'];rule=rules[cid];file=B/cat['file'];lines=file.read_text().splitlines(keepends=True)
 text=''.join(lines[int(cat['start_line'])-1:int(cat['end_line'])]);assert hashlib.sha256(text.encode()).hexdigest()==cat['section_sha256'],cid
 dense=cid>='SC55';prose=int(cat['table_declarations'])==0
 sections.append(dict(category=cid,source_location=cat['file']+':'+cat['start_line']+'-'+cat['end_line'],section_sha256=cat['section_sha256'],action=rule['action'],work_gate=rule['work_gate'],builder_requirement=rule['builder_requirement'],table_declaration_views=cat['table_declarations'],prose_retention='whole bounded section is mandatory context, including bullets and text around tables',deferral_authority='research-addendum.md:A04/Q04/RR06; display only, not deletion' if dense else 'none; retain or consolidate accepted source views',implementation_state='required disposition; not verified imported',acceptance='Provide per-source target or explicitly preserved reference payload; verify source copy/gates and essential identity constraints; no blanket omission'))
for i,d in enumerate(decls,1):
 cid=d['category'];rule=rules[cid];file,line=d['location'].split(':');raw=(B/file).read_text().splitlines(keepends=True)[int(line)-1]
 assert hashlib.sha256(raw.encode()).hexdigest()==d['row_sha256'],d['location']
 first=d['declaration'].strip('`').split()[0]
 reuse=d['primary_reuse']=='true' or first in specified
 action='consolidate-with-existing-research-ID' if reuse else rule['action']
 rows.append(dict(disposition_id=f'SD{i:04}',category=cid,source_location=d['location'],research_declaration=d['declaration'],primary_reuse=d['primary_reuse'],specified_ID_reuse=first if first in specified else '',disposition=action,work_gate=rule['work_gate'],minimum_retained_source_context=raw.strip(),source_urls_in_row=';'.join(dict.fromkeys(re.findall(r'https://[^\s)\]>]+',raw))),source_resolution='Retain row locators and category context; named source keys/verse-only references resolve through accepted source registers and chapter ledgers. No new access claim.',row_sha256=d['row_sha256'],consolidation_rule=rule['builder_requirement'],required_builder_result='Map this source view to an imported card/episode/identity facet or named retained reference; preserve source-specific copy and constraints. Do not count SD ID as a new entity.',implementation_state='not individually re-audited against current build'))
assert len(rows)==1271 and sum(r['primary_reuse']=='true' for r in rows)==19
assert len({r['source_location'] for r in rows})==1271
for name,data in [('category-dispositions.csv',sections),('declaration-dispositions.csv',rows)]:
 out=io.StringIO();w=csv.DictWriter(out,fieldnames=list(data[0]),lineterminator='\n');w.writeheader();w.writerows(data)
 target=P/name
 if '--write' in sys.argv:target.write_text(out.getvalue())
 else:assert target.read_text()==out.getvalue(),name
print(json.dumps({'categories':62,'mandatory_markdown_sections':54,'approved_dense_display_deferrals':8,'table_source_views':1271,'direct_primary_redeclarations':19,'already_specified_ID_reuses':sum(bool(r['specified_ID_reuse']) for r in rows),'prose_only_sections':sum(int(c['table_declarations'])==0 for c in cats),'new_entity_count':'not asserted','new_source_reading':'none; accepted evidence reused','implementation_signoff':False}))

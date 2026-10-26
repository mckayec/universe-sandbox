#!/usr/bin/env python3
"""Regenerate bounded explicit-reference and nonspatial-context dispositions.
Not a semantic identity, gate, source-truth or exhaustive prose-link validator.
"""
from pathlib import Path
import re,csv,collections
p=Path(__file__).resolve().parent
files=['research.md','bible-inventory.md','bom-inventory.md','restoration-inventory.md','pgp-inventory.md','geography-evidence.md']+sorted(x.name for x in p.glob('coverage-*.md'))
place=re.compile(r'(?<![A-Za-z0-9-])(?:BXP\d{2}|[ABRD]?P\d{2}|PP\d{2}|OH-P\d{2}|WP-P\d{2}|NTP-[a-z0-9-]+)(?![A-Za-z0-9-])')
event=re.compile(r'^(?:[ABRP]?E\d{2}|[ABRP]?J\d{2}|DE\d{2}[a-z]?|DJ\d{2}|BX[JE]\d{2}|OHJ-\d{2}|WP-[JE]\d{2}|NT[JE]-[a-z0-9-]+|(?:mp|lh)-j\d{2}-[a-z0-9-]+|LHE-\d{2})(?![A-Za-z0-9-])')
defs=collections.defaultdict(list);rows=[]
for fn in files:
 for n,line in enumerate((p/fn).read_text().splitlines(),1):
  if not line.startswith('|'):continue
  c=line.split('|')[1].strip(); clean=c.strip('`')
  mplace=place.match(c.strip('`'))
  if mplace: defs[mplace.group()].append(f'{fn}:{n}')
  for t in re.findall(r'`([a-z][a-z0-9-]+)`',c):defs[t].append(f'{fn}:{n}')
  m=event.match(clean)
  if m: rows.append((fn,n,m.group(),line.split('|')[2:]))
for n,line in enumerate((p/'coverage-dc.md').read_text().splitlines(),1):
 if line.startswith('The following place keys supply names only'):
  for t in place.findall(line):
   if t.startswith('DP'):defs[t].append(f'coverage-dc.md:{n}')
refs=[];unkeyed=[]
for fn,n,owner,cells in rows:
 body='|'.join(cells)
 targets=set(place.findall(body))|{s for s in re.findall(r'`([a-z][a-z0-9-]+)`',body) if s in defs}
 if not targets: unkeyed.append((fn,n,owner))
 for t in sorted(targets):refs.append([fn,n,owner,t,'resolved' if t in defs else 'UNRESOLVED',';'.join(defs[t]),'Existing research handle; retain source-specific gate and nonspatial status.', 'concept-reference' if t.startswith('lh-c') else 'movement-reference' if t.startswith('lh-j') else 'place-handle'])
with (p/'reference-disposition.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator="\n");w.writerow(['file','line','owner_record','target_handle','resolution','declaration_locations','constraint','target_kind']);w.writerows(refs)
print('rows',len(rows),'owners',len(set((f,o) for f,n,o,c in rows)),'references',len(refs),'unkeyed',len(unkeyed),'missing',[r[:5] for r in refs if r[4]!='resolved'])
# Explicit disposition for every no-key occurrence; a context reference is not a place.
keyed={(r[0],r[2]) for r in refs}
seen=set();out=[]
for fn,n,owner,cells in rows:
 if (fn,n,owner) not in unkeyed:continue
 key=(fn,owner)
 if key in keyed:
  kind='secondary-view-of-keyed-record'; target=owner
 elif key in seen:
  kind='duplicate-context-view';target=owner
 else:
  kind='nonspatial-reference-only';target=f'context::{fn.removesuffix(".md")}::{owner}'
 seen.add(key)
 out.append([fn,n,owner,kind,target,'; '.join(c.strip() for c in cells if c.strip()),'No physical-place union or route geometry approved by this disposition. Keep the cited narrative setting in reference copy; do not fabricate an event-site edge.'])
with (p/'reference-disposition-contexts.csv').open('w',newline='') as f:
 w=csv.writer(f,lineterminator="\n");w.writerow(['file','line','owner_record','disposition','reference_target','retained_source_context','constraint']);w.writerows(out)
print('context dispositions',dict(collections.Counter(r[3] for r in out)))

if any(r[4] != "resolved" for r in refs):
    raise SystemExit(1)

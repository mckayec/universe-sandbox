#!/usr/bin/env python3
"""Check local source keys, links and CSV structure; not a factual audit."""
from pathlib import Path
import csv,json,re,sys
root=Path(__file__).resolve().parent
errors=[];counts={}
for name,prefix in [('judaism-research.md','JU'),('christianity-research.md','CH'),('islam-research.md','IS'),('comparative-evidence.md','X')]:
    p=root/name;text=p.read_text()
    definitions=re.findall(r'^\| ('+prefix+r'\d{2}) \|',text,re.M)
    if len(definitions)!=len(set(definitions)):errors.append(f'{name}: duplicate source key')
    refs=set()
    for group in re.findall(r'\[([^\]\n]+)\]',text):
        for token in group.split(','):
            m=re.fullmatch(prefix+r'(\d{2})(?:[–-](?:'+prefix+r')?(\d{2}))?',token.strip())
            if m:
                a=int(m[1]);b=int(m[2] or m[1]);refs.update(f'{prefix}{i:02}' for i in range(a,b+1))
    missing=sorted(refs-set(definitions))
    if missing:errors.append(f'{name}: missing sources {missing}')
    counts[name]={'source_keys':len(definitions),'cited_keys':len(refs)}
for p in root.glob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
        if '://' in target or target.startswith('#'):continue
        f=target.split('#')[0]
        if f and not (p.parent/f).exists():errors.append(f'{p.name}: missing local link {target}')
for p in root.glob('*.csv'):
    rows=list(csv.reader(p.open(newline='')))
    if rows and any(len(row)!=len(rows[0]) for row in rows):errors.append(f'{p.name}: inconsistent CSV width')
print(json.dumps({'source_registers':counts,'errors':errors,'scope':'Structural source/link integrity only; no historical, coverage, geometry or readiness certification'},indent=2))
sys.exit(bool(errors))

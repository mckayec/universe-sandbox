"""Structural checks only: never evidence of reading or historical truth."""
import csv
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
errors = []
report = {}
for path in sorted(ROOT.glob('*.csv')):
    with path.open(newline='') as stream:
        reader = csv.DictReader(stream)
        rows = list(reader)
        fields = reader.fieldnames or []
    if len(fields) != len(set(fields)):
        errors.append(f'{path.name}: duplicate column')
    if any(None in row or any(value is None for value in row.values()) for row in rows):
        errors.append(f'{path.name}: malformed row')
    id_field = next((key for key in ('record_id', 'unit_id', 'stable_id', 'id') if key in fields), None)
    if id_field:
        counts = Counter(row[id_field] for row in rows)
        if any(not key or count > 1 for key, count in counts.items()):
            errors.append(f'{path.name}: empty/duplicate {id_field}')
    status = next((key for key in ('reading_status', 'status', 'coverage') if key in fields), None)
    report[path.name] = {'rows': len(rows), 'status_counts': dict(Counter(row[status] for row in rows)) if status else {}}
    for row in rows:
        for key in ('source_url',):
            if key in row and row[key] and not row[key].startswith('https://'):
                errors.append(f'{path.name}: unexpected URL {row[key]}')

gates = list(csv.DictReader((ROOT / 'work-gates.csv').open()))
if [int(row['first']) for row in gates] != list(range(1, len(gates) + 1)):
    errors.append('work-gates: nonsequential/duplicate navigation slots')
if len({row['work_key'] for row in gates}) != len(gates):
    errors.append('work-gates: duplicate work key')
for gate in gates:
    rows = list(csv.DictReader((ROOT / gate['ledger']).open()))
    field = 'work_id' if 'work_id' in rows[0] else 'work'
    if not any(row[field] == gate['ledger_work'] for row in rows):
        errors.append(f"work-gates: unresolved {gate['work_key']}")

# Index joins are exact references to heterogeneous registry rows, not facts.
registry_ids = {}
for path in ROOT.glob('*-integration.csv'):
    for row in csv.DictReader(path.open()):
        rid = row.get('id') or row.get('record_id') or row.get('stable_id')
        if rid in registry_ids:
            errors.append(f'duplicate cross-registry ID: {rid}')
        registry_ids[rid] = path.name
index = list(csv.DictReader((ROOT / 'record-work-index.csv').open()))
if set(registry_ids) != {row['id'] for row in index}:
    errors.append('record-work-index: missing or extra registry IDs')
valid_gates = {row['work_key']: row['first'] for row in gates}
for row in index:
    if registry_ids.get(row['id']) != row['registry']:
        errors.append(f"record-work-index: wrong registry for {row['id']}")
    if valid_gates.get(row['work_key']) != row['first']:
        errors.append(f"record-work-index: wrong global gate for {row['id']}")
for row in csv.DictReader((ROOT / 'related-traditions-integration.csv').open()):
    for key in json.loads(row['additional_work_gates']):
        if key not in valid_gates:
            errors.append(f"related-traditions: unmapped secondary work {key}")
    for link in json.loads(row['typed_links']):
        target = link['target']
        if target.startswith(('http:', 'https:')) or target.endswith('.md'):
            continue
        if target not in registry_ids:
            errors.append(f"related-traditions: unresolved link {target}")

for path in ROOT.glob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)', path.read_text()):
        if target.startswith(('https://', 'http://', '#')):
            continue
        target = target.split('#')[0]
        if not (path.parent / target).exists():
            errors.append(f'{path.name}: missing local link {target}')
print(json.dumps({'scope': 'CSV structure, IDs, work lookup and local Markdown targets only; no source certification', 'files': report, 'errors': errors}, indent=2))
raise SystemExit(bool(errors))

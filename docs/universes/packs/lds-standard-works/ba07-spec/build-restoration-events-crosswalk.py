"""Tranche 7: five remaining primary Restoration episode specifications."""
import csv, hashlib, io, re, sys
from pathlib import Path
P = Path(__file__).resolve().parent
B = P.parent
rules = {
    'RE02': ('Reported baptisms', 'May 15, 1829, as reported', 'Reported religious experience', 'Keep reciprocal baptisms after the visitation distinct from RE01. JS—History supplies the report; R04 supplies the river identification. No exact riverbank or historical shoreline.'),
    'RE05': ('Missouri expulsion order', 'October 27, 1838', 'Archival historical account', 'Attribute to Missouri State Archives and its finding aid. No claim of newly reading the handwritten order; no issuance pin at Liberty Jail or an unsupported battlefield.'),
    'RE06': ('Imprisonment at Liberty', 'December 1, 1838 to April 6, 1839', 'Documentary historical synthesis', 'End date is transfer for proceedings, not acquittal, conviction or ultimate escape. Reuse Liberty identity without importing its modern marker as the exact cell.'),
    'RE07': ('Letters from Liberty', 'March 20 and approximately March 22, 1839', 'Document history and scriptural text', 'Preserve two epistles and approximate second date. Do not turn D&C 121 into a single March 20 letter; retain pleas and authority teaching.'),
    'RE13': ('Young reaches the valley camp', 'July 24, 1847', 'NPS historical synthesis', 'Young arrives after the advance company; not first human arrival or all emigrants arriving together. Broad valley/camp setting is not a surveyed episode point.')
}
lines = (B / 'restoration-inventory.md').read_text().splitlines()
audit = (B / 'restoration-record-audit.md').read_text().splitlines()
account = {r['research_id']: r for r in csv.DictReader((B / 'content-audit/research-import-accounting.csv').open())}
prior = set()
for filename in ['minimum-content-crosswalk.csv', 'restoration-content-crosswalk.csv', 'bom-content-crosswalk.csv', 'bible-content-crosswalk.csv', 'bom-events-content-crosswalk.csv', 'pgp-remainder-content-crosswalk.csv']:
    prior.update(r['research_id'] for r in csv.DictReader((P / filename).open()))
rows = []
for key, (title, date, mode, check) in rules.items():
    assert key not in prior
    hits = [(i + 1, s) for i, s in enumerate(lines) if s.startswith('| ' + key + ' ')]; assert len(hits) == 1
    line, raw = hits[0]
    copy = re.search('“([^”]+)”', raw).group(1).replace('D&C121', 'D&C 121')
    keys = list(dict.fromkeys(re.findall(r'\[(R\d+)\]', raw)))
    urls = []
    for source in keys:
        src = next(s for s in lines if s.startswith('| ' + source + ' |'))
        urls.extend(re.findall(r'\]\((https://[^)]+)\)', src))
    al = next(i + 1 for i, s in enumerate(audit) if s.startswith('| ' + key + ' |'))
    assert account[key]['disposition'] == 'not-represented-as-record' and urls
    rows.append(dict(research_id=key, current_representation=account[key]['disposition'], proposed_title=title, books='[4]', layers='["dc"]', evidence_mode=mode, display_date=date, numeric_when='omit for minimum codex source view', minimal_neutral_copy=mode + ' — ' + copy, source_keys=';'.join(keys), source_urls=';'.join(dict.fromkeys(urls)), source_location=f'restoration-inventory.md:{line}', source_row_sha256=hashlib.sha256(raw.encode()).hexdigest(), accepted_context=raw.split('|')[2].strip(), prior_support=f'restoration-record-audit.md:{al}', disposition='nonspatial reference view; source-qualified consolidation permitted', deferral='no blanket dense-display deferral; omission needs explicit scope disposition', acceptance_check=check))
assert len(prior) == 103 and len(rows) == 5
missing = {k for k, v in account.items() if k.startswith('RE') and v['disposition'] != 'represented'}
assert missing.issubset(prior | set(rules)) and len(missing) == 11
out = io.StringIO(); writer = csv.DictWriter(out, fieldnames=list(rows[0]), lineterminator='\n'); writer.writeheader(); writer.writerows(rows)
target = P / 'restoration-events-content-crosswalk.csv'
if '--write' in sys.argv: target.write_text(out.getvalue())
else: assert target.read_text() == out.getvalue()
print('PASS: 5 omitted RE views; no overlap with 103 prior views; all 11 omitted primary RE records specified across tranches; 9 represented RE records not duplicated; source rows, hashes, URLs and audit pointers resolve. Not fresh reading or implementation approval.')

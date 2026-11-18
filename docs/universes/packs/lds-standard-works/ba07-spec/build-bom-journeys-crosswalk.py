"""Tranche 8: primary BJ textual journeys, reusing accepted support."""
import csv, hashlib, io, re, sys
from pathlib import Path
P = Path(__file__).resolve().parent
B = P.parent
copies = [
"First Nephi describes selected stages of Lehi's household migration: Jerusalem, the valley of Lemuel, Shazer, Nahom, coastal Bountiful and an unnamed landing. Intervening camps and return trips are omitted from this summary.",
"Second Nephi describes Nephi's group withdrawing from his brothers into the wilderness and naming its settlement Nephi. The exact departure site is unknown; the earlier landing is only broad prior context.",
"Omni describes Mosiah's group leaving Nephi, traveling through wilderness and reaching Zarahemla.",
"Mosiah describes Ammon's search from Zarahemla to a hill north of Shilom; Ammon and three companions descend to Limhi's setting. Later, Limhi's people escape by night, skirt Shilom and reach Zarahemla. These are different traveler groups and actions.",
"Mosiah describes Alma's community leaving Mormon, settling at Helam and later escaping through the valley of Alma to Zarahemla. The first flight takes eight days; Helam is a settled interval, and the journey after leaving the valley takes twelve days.",
"Alma describes a return from Gideon to Zarahemla with a home and rest interval, followed by a new year's mission to Melek and three days traveling north to Ammonihah.",
"Alma describes the people of Anti-Nephi-Lehi leaving Nephi for the dividing wilderness and later receiving refuge in Jershon. While the community waits, a delegation goes to Zarahemla and returns; the whole refugee community is not described taking that detour.",
"Alma describes selected campaign stages from Gideon to Zarahemla, Nephihah, Lehi and Moroni. Moroni joins Pahoran, but the summary does not assert Pahoran accompanied every later leg; unnamed intermediate cities are omitted.",
"Helaman describes emigrants leaving Zarahemla for the land northward. Intermediate settlements and exact distance are not supplied in this selected sequence.",
"Mormon describes an early retreat through Angola and David to Joshua near the western sea. This sequence does not reconstruct a later route to Cumorah.",
"Ether describes a migration from the great tower to the valley of Nimrod, then through further stages to Moriancumer and eventually an unnamed promised shore. Earlier water crossings and wilderness are compressed; the brother of Jared's Shelem visit is a separate excursion, not a company port."
]
checks = [
'Keep Arabian Bountiful distinct; no modern landing, ocean track or continuous complete itinerary.',
'Do not render the first-landing handle as proof of departure from a beach.',
'Mosiah in Omni differs from the later Mosiah receiving Limhi and Alma; no calendar conversion.',
'Split outbound search and later collective escape; preserve camp descent by four and around Shilom.',
'Preserve settlement and escape stages; no continuous single trip or invented distance from travel days.',
'Preserve rest and new-year interval; north and three days apply to Melek–Ammonihah only.',
'Show community and delegation as separate textual threads; no all-refugees Zarahemla leg.',
'Do not attach Pahoran to every leg or merge Lehi/Moroni place names with people.',
'Northward is source-relative, not a continental boundary or measured bearing.',
'No bridging missing later chapters into a recovered Cumorah route.',
'Keep earlier barges, coastal stay and later sea voyage distinct; Shelem is a side excursion.'
]
lines = (B / 'bom-inventory.md').read_text().splitlines()
account = {r['research_id']: r for r in csv.DictReader((B / 'content-audit/research-import-accounting.csv').open())}
support = {r['id']: r for r in csv.DictReader((B / 'bom-record-support.csv').open())}
prior = set()
for filename in ['minimum-content-crosswalk.csv', 'restoration-content-crosswalk.csv', 'bom-content-crosswalk.csv', 'bible-content-crosswalk.csv', 'bom-events-content-crosswalk.csv', 'pgp-remainder-content-crosswalk.csv', 'restoration-events-content-crosswalk.csv']:
    prior.update(r['research_id'] for r in csv.DictReader((P / filename).open()))
rows = []
for n, (copy, check) in enumerate(zip(copies, checks), 1):
    key = f'BJ{n:02}'; assert key not in prior
    hits = [(i + 1, s) for i, s in enumerate(lines) if s.startswith('| ' + key + ';')]; assert len(hits) == 1
    line, raw = hits[0]; cells = [s.strip() for s in raw.split('|')[1:-1]]
    assert account[key]['disposition'] == 'not-represented-as-record'
    assert support[key]['status'] == 'supported-text' and support[key]['first'] == '3'
    rows.append(dict(research_id=key, priority=1 if n in [4,5,6,7,11] else 2, current_representation=account[key]['disposition'], accepted_title=re.search('“([^”]+)”', raw).group(1), travelers=cells[0].split(';',1)[1].strip(), ordered_research_references=cells[1], source_sequence_constraints=cells[2], minimal_attributed_copy=copy, books='[3]', layers='["bom"]', numeric_when='omit; source-relative intervals only', geometry='none; textual sequence, not surface route', source_urls=support[key]['source_urls'], source_location=f'bom-inventory.md:{line}', source_row_sha256=hashlib.sha256(raw.encode()).hexdigest(), prior_support=f'bom-record-support.csv:id={key}', disposition='source-labeled textual journey; consolidation must retain travelers and intervals', deferral='no blanket dense-display deferral; omission needs explicit scope disposition', acceptance_check=check))
assert len(prior) == 108 and len(rows) == 11
assert {k for k in account if k.startswith('BJ')} == {r['research_id'] for r in rows}
out = io.StringIO(); w = csv.DictWriter(out, fieldnames=list(rows[0]), lineterminator='\n'); w.writeheader(); w.writerows(rows)
p = P / 'bom-journeys-content-crosswalk.csv'
if '--write' in sys.argv: p.write_text(out.getvalue())
else: assert p.read_text() == out.getvalue()
print('PASS: 11 omitted BJ textual journeys; no overlap with 108 prior views; all primary BJ IDs covered; source rows, hashes, URLs and gate 3 resolve. Accepted support reused, not newly verified.')

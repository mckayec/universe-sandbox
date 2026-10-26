"""Validate research ledgers without mistaking row presence for completed research.

Run from any directory: python docs/universes/packs/lds-standard-works/validate-coverage.py
No application code or generated content is modified. Missing ledgers/units are
reported as research gaps; malformed or duplicate records fail validation.
"""

import csv
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BOOKS = {
    "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36,
    "Deuteronomy": 34, "Joshua": 24, "Judges": 21, "Ruth": 4,
    "1 Samuel": 31, "2 Samuel": 24, "1 Kings": 22, "2 Kings": 25,
    "1 Chronicles": 29, "2 Chronicles": 36, "Ezra": 10, "Nehemiah": 13,
    "Esther": 10, "Job": 42, "Psalms": 150, "Proverbs": 31,
    "Ecclesiastes": 12, "Song of Solomon": 8, "Isaiah": 66,
    "Jeremiah": 52, "Lamentations": 5, "Ezekiel": 48, "Daniel": 12,
    "Hosea": 14, "Joel": 3, "Amos": 9, "Obadiah": 1, "Jonah": 4,
    "Micah": 7, "Nahum": 3, "Habakkuk": 3, "Zephaniah": 3,
    "Haggai": 2, "Zechariah": 14, "Malachi": 4,
    "Matthew": 28, "Mark": 16, "Luke": 24, "John": 21, "Acts": 28,
    "Romans": 16, "1 Corinthians": 16, "2 Corinthians": 13,
    "Galatians": 6, "Ephesians": 6, "Philippians": 4, "Colossians": 4,
    "1 Thessalonians": 5, "2 Thessalonians": 3, "1 Timothy": 6,
    "2 Timothy": 4, "Titus": 3, "Philemon": 1, "Hebrews": 13,
    "James": 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5,
    "2 John": 1, "3 John": 1, "Jude": 1, "Revelation": 22,
    "1 Nephi": 22, "2 Nephi": 33, "Jacob": 7, "Enos": 1,
    "Jarom": 1, "Omni": 1, "Words of Mormon": 1, "Mosiah": 29,
    "Alma": 63, "Helaman": 16, "3 Nephi": 30, "4 Nephi": 1,
    "Mormon": 9, "Ether": 15, "Moroni": 10,
    "Doctrine and Covenants": 138, "Official Declaration": 2,
    "Moses": 8, "Abraham": 5, "Facsimile": 3,
    "Joseph Smith—Matthew": 1, "Joseph Smith—History": 1,
    "Articles of Faith": 1,
}
EXPECTED = {f"{book} {chapter}" for book, count in BOOKS.items()
            for chapter in range(1, count + 1)}
assert len(EXPECTED) == 1587
FIELDS = {"unit", "source_url", "status", "evidence", "records", "exclusion", "remaining"}
STATUSES = {"inspected", "text-partial", "heading-only", "pending", "access-blocked"}
seen = {}
reports = []
errors = []
for path in sorted(ROOT.glob("coverage-*.csv")):
    with path.open(newline="") as stream:
        reader = csv.DictReader(stream)
        if not FIELDS.issubset(reader.fieldnames or []):
            errors.append(f"{path.name}: required columns missing")
            continue
        rows = list(reader)
    counts = Counter()
    for row in rows:
        unit = re.sub(r"\s+", " ", row["unit"].strip())
        if unit not in EXPECTED:
            errors.append(f"{path.name}: unexpected canonical unit {unit!r}")
        if unit in seen:
            errors.append(f"Duplicate {unit}: {seen[unit]}, {path.name}")
        seen[unit] = path.name
        status = row["status"]
        if status not in STATUSES:
            errors.append(f"{unit}: unknown review status {status!r}")
        counts[status] += 1
        if not row["source_url"].startswith("https://"):
            errors.append(f"{unit}: missing HTTPS evidence URL")
        if not row["evidence"].strip() or not row["remaining"].strip():
            errors.append(f"{unit}: evidence/remaining boundary missing")
        if status == "inspected" and (not row["records"].strip() or not row["exclusion"].strip()):
            errors.append(f"{unit}: inspected without content/exclusion disposition")
    reports.append({"file": path.name, "units": len(rows), "depth": dict(counts)})
totals = Counter()
for report in reports:
    totals.update(report["depth"])
missing = sorted(EXPECTED - seen.keys())
print(json.dumps({
    "canonical_units_expected": len(EXPECTED),
    "unit_definition": "1189 Bible chapters +239 BoM chapters +138 D&C sections +2 declarations +16 PGP chapters +3 facsimile explanations",
    "files": reports,
    "total_depth": dict(totals),
    "unrepresented_units": missing,
    "errors": errors,
    "scope_ready": False,
    "scope_ready_reason": "Ledger integrity is not canon/source/integration approval. See substantive audit and status.",
}, indent=2, ensure_ascii=False))
raise SystemExit(bool(errors))

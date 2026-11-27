# Shared-identity crosswalk for the 12 neutral front-matter people (supplementary-review-s22, builder answer 1).
#
# Each person keeps ONE accepted identity key. Their cards stay source views with their own work gates: neutral names at
# 3/bom (FM02/FM04/FM05/FM06, fm-person-*), D&C facts at 4/dc (DCM-dcp-* and the person's dossier/relation cards),
# JS—History views at 5/pgp. Nothing is merged and no gate is lowered; the cards are joined by `see` links that the
# engine renders as See-also buttons (PACK_FORMAT 20.5). A target the reader has not reached is not shown, only counted.
# Kinship is never inferred from a surname: a family card is linked only where its own text names that person.
#
# build.py writes these `see` lists onto the cards (idempotent) and writes identity-crosswalk.csv from PEOPLE.

# person -> (accepted identity key, identity hub card, neutral 3/bom source views, later D&C views, later PGP views)
# Identity keys are the accepted register keys (`dcp-*`, coverage-dc.md SC40) or, for the two Whitmers with no D&C
# card, the SC51 neutral keys. Aliases are the name forms the linked cards themselves print.
PEOPLE = [
    ('Joseph Smith Jr.', 'dcp-joseph-smith-jr', 'DCM-dcp-joseph-smith-jr', ['FM02', 'FM05', 'FM06'],
     ['DCM-dr01-smith-rigdon', 'DCM-dr02-smith-cowdery', 'DCM-dr03-joseph-emma', 'DCM-dr04-joseph-hyrum',
      'DCM-dr06-joseph-alvin', 'DCM-dr09-smith-family'],
     ['PGM-qg14-js-history-moves', 'PGM-jsh-family', 'PGM-jsh-harmony-marriage', 'PGM-jsh-moroni-material',
      'PGM-jsh-harris-anthon', 'PGM-jsh-baptism']),
    ('Oliver Cowdery', 'dcp-oliver-cowdery', 'DCM-dcp-oliver-cowdery', ['FM04'],
     ['DCM-dd006-oliver-cowdery-scribe', 'DCM-dd008-cowdery-gifts', 'DCM-dr02-smith-cowdery',
      'DCM-dre030-whitmer-cowdery', 'DCM-dre069-cowdery-whitmer'],
     ['PGM-qg14-cowdery-1834', 'PGM-jsh-baptism']),
    ('David Whitmer', 'dcp-david-whitmer', 'DCM-dcp-david-whitmer', ['FM04'], ['DCM-dd014-david-whitmer'], []),
    ('Martin Harris', 'dcp-martin-harris', 'DCM-dcp-martin-harris', ['FM04'],
     ['DCM-dd005-martin-harris-witness', 'DCM-dd019-martin-harris-printing'], ['PGM-jsh-harris-anthon']),
    ('Christian Whitmer', 'fm-person-christian-whitmer', 'fm-person-christian-whitmer', ['FM05'], [], []),
    ('Jacob Whitmer', 'fm-person-jacob-whitmer', 'fm-person-jacob-whitmer', ['FM05'], [], []),
    ('Peter Whitmer Jr.', 'dcp-peter-whitmer-jr', 'DCM-dcp-peter-whitmer-jr', ['FM05'],
     ['DCM-dd016-peter-whitmer-jr', 'DCM-dre030-whitmer-cowdery'], []),
    ('John Whitmer', 'dcp-john-whitmer', 'DCM-dcp-john-whitmer', ['FM05'],
     ['DCM-dd015-john-whitmer', 'DCM-dd047-historian', 'DCM-dre069-cowdery-whitmer'], []),
    ('Hiram Page', 'dcp-hiram-page', 'DCM-dcp-hiram-page', ['FM05'], [], []),
    ('Joseph Smith Sr.', 'dcp-joseph-smith-sr', 'DCM-dcp-joseph-smith-sr', ['FM05'],
     ['DCM-dd004-joseph-smith-sr', 'DCM-dr09-smith-family'], ['PGM-jsh-family']),
    ('Hyrum Smith', 'dcp-hyrum-smith', 'DCM-dcp-hyrum-smith', ['FM05'],
     ['DCM-dd011-hyrum-prepare', 'DCM-dr04-joseph-hyrum', 'DCM-dr09-smith-family', 'DCM-dre124a-galland-hyrum-law'], ['PGM-jsh-family']),
    ('Samuel H. Smith', 'dcp-samuel-h-smith', 'DCM-dcp-samuel-h-smith', ['FM05'],
     ['DCM-dr09-smith-family', 'DCM-dre061-cahoon-samuel-smith', 'DCM-dre066-mclellin-samuel-smith'],
     ['PGM-jsh-family']),
]

# name forms looked for in each linked card's own name/desc (for the crosswalk's alias column; regexes, not copy)
ALIAS_PATTERNS = {
    'Joseph Smith Jr.': [r'Joseph Smith Jr\.', r'Joseph Smith, Jun\.', r'Joseph Smith(?! Sr| III|, Sen)', r'\bJoseph\b'],
    'Oliver Cowdery': [r'Oliver Cowdery', r'\bCowdery\b'],
    'David Whitmer': [r'David Whitmer'],
    'Martin Harris': [r'Martin Harris', r'\bHarris\b'],
    'Christian Whitmer': [r'Christian Whitmer'],
    'Jacob Whitmer': [r'Jacob Whitmer'],
    'Peter Whitmer Jr.': [r'Peter Whitmer Jr\.', r'Peter Whitmer, Jun\.'],
    'John Whitmer': [r'John Whitmer'],
    'Hiram Page': [r'Hiram Page'],
    'Joseph Smith Sr.': [r'Joseph Smith Sr\.', r'Joseph Smith, Sen\.'],
    'Hyrum Smith': [r'Hyrum Smith', r'\bHyrum\b'],
    'Samuel H. Smith': [r'Samuel H\. Smith', r'Samuel Harrison', r'\bSamuel\b(?! Harrison)'],
}


def see_links():
    """card key -> ordered list of linked card keys (each link listed once, never to itself)."""
    out = {}

    def add(a, b):
        if a != b and b not in out.setdefault(a, []):
            out[a].append(b)

    for _name, _ident, hub, neutral, dc, pgp in PEOPLE:
        for k in neutral + dc + pgp:
            add(hub, k)
            add(k, hub)
    return out

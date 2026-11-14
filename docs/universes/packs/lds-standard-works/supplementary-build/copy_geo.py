# Builder display copy for supplementary SC52–SC54 (geography-evidence.md, SD1261–SD1271).
#
# SC52 (SD1261–SD1263, retain-attributed-model-comparison): three attributed model summaries with their cited
# criticism, as new `bom-more` cards (3/bom). No endorsement, no ranking, no blended Heartland variant, no geometry,
# no archaeological identity claim; geography models stay off the map. Sources are the row's G keys
# (geography-evidence.md "Sources"), given as full URLs.
#
# SC53 (SD1264–SD1267, consolidate-Arabian-source-views) and SC54 (SD1268–SD1271, consolidate-Jaredite-source-views):
# the rule is to reuse the existing geography identities, so no new cards. Irreantum (SD1266) consolidates into the
# SD0002 card (copy_bom); the others map to existing primary cards in `bom-geography` (BE02 Nahom burial, BE03
# Arabian Bountiful, BJ01 Lehi's migration, BJ11 Jaredite migration) and build.py rewrites only those cards' `desc`
# (idempotent; key, name, gate and sources unchanged; their sources already cite the rows' chapters G7–G9, G14–G16).
# Nothing is added from memory.

P = 'Book of Mormon — '
M = 'Proposed geography model, attributed — '

G3 = ('Sorenson 2002 (Scripture Central archive)',
      'https://scripturecentral.org/archive/books/book-chapter/'
      'how-could-joseph-smith-write-so-accurately-about-ancient-american-civilization')
G4 = ('Wunderli, Dialogue 35:3',
      'https://www.dialoguejournal.com/articles/critique-of-a-limited-geography-for-book-of-mormon-events/')
G5 = ('Hedges, BYU Studies 60:3', 'https://byustudies.byu.edu/article/book-of-mormon-geographies')
G6 = ('FAIR, Heartland model description',
      'https://www.fairlatterdaysaints.org/answers/'
      'Question:_What_is_the_Heartland_Model_of_Book_of_Mormon_geography')

G1 = ('Church, Book of Mormon Geography',
      'https://www.churchofjesuschrist.org/study/manual/gospel-topics/book-of-mormon-geography?lang=eng')
# S23-C1: the accepted G1 Church-position notice, carried visibly on each model card (supplementary-review-s23).
NOTICE = (' For Book of Mormon events in the ancient Americas, the Church takes no position on specific geographic '
          'locations. These models are individual interpretations, not Church-endorsed maps.')

COPY = {
    'SD1261': ('bom-model-mesoamerican-sorenson', 'Geography model: limited Mesoamerican setting (Sorenson)',
               M + 'John L. Sorenson places the land southward mainly in Guatemala, Chiapas and Tabasco, the narrow '
               'neck at Tehuantepec, and the land northward north and west of that isthmus, and argues that regional '
               'cultural patterns fit the narrative. Earl Wunderli challenges the need for a small setting and that '
               'reading of directions; his essay favors a hemispheric reading of the text, not archaeological '
               'confirmation of that alternative. The interpretation is disputed. The atlas draws no model and ranks '
               'none.' + NOTICE),
    'SD1262': ('bom-model-heartland', 'Geography model: Heartland (North America)',
               M + 'Heartland proposals place the narrative in parts of North America, particularly the Mississippi '
               'and Ohio valleys; Andrew H. Hedges identifies Rod L. Meldrum with this model. Supporters cite early '
               'Church identifications of a New York Cumorah and read promised-land language as referring to the '
               'United States; critics dispute those premises and the fit to the text’s internal geography. Proposed '
               'boundaries and site identifications vary. An older Meldrum variant, as described by FAIR, identifies '
               'Sidon with the Mississippi, Cumorah with New York and the narrow neck with Niagara; Hedges describes a '
               'later Lake Michigan corridor reading of the narrow neck. The two variants are kept separate, and no '
               'Heartland pins are drawn.' + NOTICE),
    'SD1263': ('bom-model-hemispheric-historical', 'Geography model: historical hemispheric (Orson Pratt)',
               M + 'A historical hemispheric interpretation associated with Orson Pratt spread the narrative across '
               'North and South America: the land of Nephi and Zarahemla in northern South America, the narrow neck '
               'at Darien (Panama) and the final battles at a New York Cumorah. Later interpreters proposed smaller '
               'settings. Broad continental readings have been defended from the text’s internal language; '
               'limited-model advocates contest the travel scale and distribution of events. These are disagreements '
               'about interpretation, not evidence that either map is established history.' + NOTICE),
    # SC53: Irreantum is the SD0002 card (its copy, in copy_bom, carries this row's retained context)
    'SD1266': 'SD0002',
}
CHILDREN = {}
EXTRA_SRC = {'SD1261': [G3, G4, G1], 'SD1262': [G5, G6, G1], 'SD1263': [G5, G4, G1]}

# SD row -> existing primary card in `bom-geography`
ROWS = {
    'SD1264': 'BE02', 'SD1265': 'BE03', 'SD1267': 'BJ01',
    'SD1268': 'BJ11', 'SD1269': 'BJ11', 'SD1270': 'BJ11', 'SD1271': 'BJ11',
}
TAB = 'bom-geography'

# primary card -> rewritten desc (the first sentence or sentences are the card's existing copy)
DESC = {
    'BE02': ('Book of Mormon narrative — The narrative reports Ishmael’s death and says he was buried at Nahom; his '
             'daughters mourn. The text names '
             'Nahom as the place of burial, not as the place of death. Nahom is unlocated in the default view, and '
             'no grave pin is drawn.'),
    'BE03': ('Book of Mormon narrative — At coastal Bountiful, Nephi receives a command to build a ship. Nephi '
             'describes a fertile place by the sea that the travelers name Bountiful; after arriving he goes up a '
             'mountain, where the command comes. Coast, mountain and sea stay distinct settings. This Bountiful in '
             'Arabia is a different place from the later Bountiful in the Americas, despite the shared name. See '
             'also: “Irreantum”, “Bountiful (Americas)”.'),
    'BJ01': ('First Nephi describes selected stages of Lehi\'s household migration: Jerusalem, the valley of Lemuel, '
             'Shazer, Nahom, coastal Bountiful and an unnamed landing. Intervening camps and return trips are omitted '
             'from this summary. After sailing many days, the company reaches the land it calls the promised land; '
             'no American landing port and no ocean track are drawn.'),
    'BJ11': ('Ether describes a migration from the great tower to the valley of Nimrod, then through further stages '
             'to Moriancumer and eventually an unnamed promised shore. Earlier water crossings and wilderness are '
             'compressed; the brother of Jared\'s Shelem visit is a separate excursion, not a company port. The '
             'account begins as Jared’s group leaves the great tower at the scattering of languages; no excavated '
             'tower is identified and no numeric date is given. The group gathers in the valley called Nimrod, '
             'northward of its earlier location, a relative position only. The travelers name their coastal camp '
             'Moriancumer and remain there four years; that camp is not the sea crossing, and no modern coast, sea or '
             'longitude is set. At the mountain called Shelem the brother of Jared prepares stones to give the vessels '
             'light; no modern mountain is identified.'),
}

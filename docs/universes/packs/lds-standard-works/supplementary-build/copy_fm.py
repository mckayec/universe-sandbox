# Builder display copy for supplementary SC50 (frontmatter-inventory.md FM01–FM09, SD1252–SD1260) and the zero-row
# SC51 integration constraints (frontmatter-inventory.md "Binding integration adjustments").
# SC50's rule: reuse the nine already specified FM IDs, not nine more entities. Each row therefore maps to its
# existing primary card FM01–FM09 in the `reference-views` tab; build.py rewrites only that card's `desc` with the
# row's minimum retained source context in reader sentences (the card's first sentence is the existing copy).
# Gates and sources of the FM cards are unchanged (FM01–07 3/bom, FM08 4/dc, FM09 5/pgp).
# SC51 adds two neutral person cards (Christian and Jacob Whitmer, 3/bom, testimony-signatory role only) through
# copy_bom.PROSE, and its other constraints are sentences in FM01/FM04/FM05/FM06 (see PROSE_INTO_PRIMARY).
# "See also" names existing cards visible at the same layer; build.py checks each title. Nothing is added from memory.

PRIMARY = {
    'SD1252': ('FM01',
               'The edition identifies Palmyra as the first English publication setting in 1830 and Salt Lake City as '
               'the publisher’s location. This is the same Palmyra as the map’s Palmyra marker, here as a neutral '
               'publication setting with the year only; the more precise month of publication belongs to the '
               'separately sourced publication history in a later layer. Salt Lake City as the '
               'publisher’s location is not the 1847 arrival in the valley.'),
    'SD1253': ('FM02',
               'The title presents the work as an abridgment associated with Mormon and Moroni, including a Jaredite '
               'record, addressed to Lamanites, Jews and Gentiles. Abridging, sealing up and addressing are kept as '
               'distinct relations, not one act. Joseph Smith Jr. is credited as translator. The title supplies no '
               'site and no calendar date. See also: “Keepers of the records: Nephi to Moroni”.'),
    'SD1254': ('FM03',
               'The Church introduction describes the Lamanites as among the ancestors of American Indians and '
               'presents Christ’s Nephite ministry as the book’s central event. This is official editorial teaching, '
               'attributed to the introduction; it is not a DNA finding and not a claim that all Indigenous ancestry '
               'comes from one group. The introduction names Cumorah in its account of the plates; that editorial '
               'mention is not used to fix a modern location for the battle in Mormon 6. See also: “Cumorah / '
               'Ramah”.'),
    'SD1255': ('FM04',
               'Oliver Cowdery, David Whitmer and Martin Harris testify that an angel showed them the plates and that '
               'a divine voice affirmed the translation. Each signs the printed testimony and reports seeing; this is '
               'participant testimony as printed. The page gives no venue and no day, so no event is pinned. Their '
               'names are visible from the Book of Mormon layer; relationships reported in later works stay in those '
               'layers, and no surname alone shows kinship.'),
    'SD1256': ('FM05',
               'Eight named witnesses (Christian Whitmer, Jacob Whitmer, Peter Whitmer Jr., John Whitmer, Hiram Page, '
               'Joseph Smith Sr., Hyrum Smith and Samuel H. Smith) testify that Joseph Smith showed them plates, which '
               'they handled and described as having the appearance of gold. This is printed testimony; no '
               'independent metallurgical test is reported. No date or venue is inferred. Only the signatory role is '
               'asserted here: shared surnames do not establish kinship, and family relationships reported in later '
               'works stay in those layers. See also: “Christian Whitmer”, “Jacob Whitmer”.'),
    'SD1257': ('FM06',
               'Smith recounts Moroni’s 1823 visits, repeated annual instruction, receipt of the plates on September '
               '22, 1827 and later return to the messenger. This is a first-person religious narrative and the '
               'Book of Mormon front-matter view of the same reported episodes told in Joseph Smith’s longer history, not '
               'additional visits or a second plates event. Collapsing in the field, the instruction that follows and '
               'the visit to the hill stay distinct actions, kept to the account; no roads are drawn. The account '
               'places the hill near Manchester but gives no survey coordinate, and neither an editorial Cumorah label '
               'nor a modern monument settles where Mormon 6’s battle took place. May 2, 1838 is the account’s stated '
               'reporting vantage, not the date the plates were returned.'),
    'SD1258': ('FM07',
               'The edition distinguishes the small and large plates of Nephi, Mormon’s abridgment, Ether’s record and '
               'the brass plates. This is an editorial explanation of textual provenance, not an archaeological '
               'recovery claim, and its date of about 421 is the edition’s editorial attribution. It identifies the '
               'nonitalic narrative introductions and the original title as sacred text, and the italic chapter '
               'headings as study helps. No journey is drawn. See also: “Keepers of the small plates”.'),
    'SD1259': ('FM08',
               'The introduction traces manuscript copying, interrupted Missouri printing in 1833 and later '
               'publication and revision of the collection. This is the Church’s documentary synthesis. The 1835 '
               'printed testimony naming the Twelve and its account of an earlier 1831 testimony are kept as distinct '
               'documentary contexts. The Lectures on Faith, omitted from the 1921 edition, are historical context, '
               'not a current unit of the canon. The collection-level description of modern origin does not erase '
               'section 7’s attribution as a translated record. See also: “Independence”, “Kirtland Temple”.'),
    'SD1260': ('FM09',
               'The introduction describes Franklin D. Richards’s 1851 collection, 1880 canonization and later changes '
               'to its contents. It names Franklin D. Richards as compiler and as president of the British Mission. '
               'Sections 137 and 138 were added to the Pearl of Great Price in 1976 and transferred to the Doctrine '
               'and Covenants in 1979; their inclusion in the 1981 edition of the Doctrine and Covenants is a separate publication milestone. The '
               'five component descriptions are the existing Pearl of Great Price cards. Nauvoo periodical '
               'publication dates do not date Abraham’s narrated journey.'),
}

# S22-C1 (supplementary-review-s22): two retained assertions rest on a further official page, so the primary card
# keeps its existing source and gains this one (label, path under BASE). build.py appends each once (idempotent) and
# lists it in the SC50 row's mapping locators.
ADDED_SOURCES = {
    'FM08': [('D&C 7, historical heading', 'dc-testament/dc/7')],
    'FM09': [('D&C introduction, 1981 edition', 'dc-testament/introduction')],
}

# SC51 paragraphs (frontmatter-inventory.md lines 19, 21 and 23) and the primary card that carries each constraint.
PROSE_INTO_PRIMARY = [
    ('SC51', 'frontmatter-inventory.md:19', 'SC51 witness neutral-name gates; Christian and Jacob Whitmer keys',
     'FM04; FM05; fm-person-christian-whitmer; fm-person-jacob-whitmer'),
    ('SC51', 'frontmatter-inventory.md:21', 'SC51 Palmyra publication facet vs. month-specific history', 'FM01'),
    ('SC51', 'frontmatter-inventory.md:23', 'SC51 FM06 not another plates event; no Cumorah equivalence',
     'FM06; FM03'),
]

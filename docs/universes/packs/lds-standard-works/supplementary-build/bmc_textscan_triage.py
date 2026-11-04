# Builder triage for bmc_textscan.py (checkpoint 56). Keys are a cue (applies to every row) or (research_key, cue).
# States:
#   consistent  - the hit agrees with the row's semantic state and reason (namesake, Book of Mormon usage, etc.)
#   reader      - the text shows a Bible relation the research row does not state; a reviewer decides whether it
#                 warrants a view or link (proposed card given where one exists). Nothing is built.
#   note        - consistent with the state, but the row's reason does not name it; a reason refinement is proposed.
#   resolved    - checkpoint 58 (HANDOFF_PLAN 2026-11-04 residual dispositions) decided this hit after a primary
#                 reading of the cited verses; the reason names the view or recorded decision.
NS = 'namesake'
TRIAGE = {
    # Generic vocabulary or Book of Mormon persons/places with Bible-identical names, as the row reasons state.
    'Satan': ('consistent', 'teaching vocabulary, not a Bible event'),
    'devil': ('consistent', 'teaching vocabulary, not a Bible event'),
    'cross': ('consistent', 'the verb “cross/across” (crossing the sea or the deep), not the cross'),
    'flood': ('consistent', 'storm floods of the Jaredite crossing or a general image; no Genesis flood named'),
    'Lehi': ('consistent', 'Book of Mormon Lehi (the dating epoch, the people of Lehi or the Nephite commander)'),
    'Jared': ('consistent', NS + ': Jaredite founder, his brother or later Jaredite kings; no Genesis Jared card'),
    'Heth': ('consistent', NS + ': Jaredite ruler Heth'),
    'Nimrod': ('consistent', NS + ': Jaredite valley or person Nimrod'),
    'Kish': ('consistent', NS + ': Jaredite king Kish'),
    'Levi': ('consistent', NS + ': Jaredite king Levi'),
    'Seth': ('consistent', NS + ': Jaredite captive Seth'),
    'Gilgal': ('consistent', NS + ': Book of Mormon city or Jaredite valley Gilgal'),
    'Gilead': ('consistent', NS + ': Jaredite Gilead, Shared’s brother'),
    'Sidon': ('consistent', NS + ': the river Sidon'),
    'Boaz': ('consistent', NS + ': the city Boaz'),
    'Ramah': ('consistent', NS + ': the Jaredite hill Ramah'),
    'Ammon': ('consistent', NS + ': Book of Mormon Ammon or the people of Ammon'),
    'Aaron': ('consistent', NS + ': Book of Mormon or Jaredite Aaron'),
    'Jacob': ('consistent', NS + ': Book of Mormon Jacob, or the patriarch in a divine title (see row)'),
    'Samuel': ('consistent', NS + ': Samuel the Lamanite (named as such in the cited verses), not the Bible Samuel'),
    'Jerusalem': ('consistent', 'the Book of Mormon dating epoch “since Lehi left Jerusalem” (a narrative anchor '
                                'carried by the 1 Nephi views), not a Bible event in this chapter'),
    'Israel': ('consistent', 'the collective covenant people or “God of Israel” as a divine title (Book of Mormon '
                             'audience/teaching class)'),
    'the twelve': ('consistent', 'the twelve Nephite disciples (a Book of Mormon institution)'),
    'apostles': ('consistent', 'the Nephite twelve or apostles in general teaching; no New Testament apostle named'),
    'law of Moses': ('consistent', 'the law as an observed or fulfilled practice (practice-or-title class)'),
    'Moses': ('consistent', 'only in “law of Moses” or a rhetorical name; no Moses event'),
    # Row-specific readings.
    ('BMC-175', 'new star'): ('consistent', 'the row already gives the birth-sign star as Book of Mormon content'),
    ('BMC-178', 'Abraham'): ('resolved', 'one divine-title formula (4:30); recorded checkpoint-58 decision, no patriarch event link'),
    ('BMC-178', 'Isaac'): ('resolved', 'same divine title (4:30); see the BMC-178 decision'),
    ('BMC-183', 'Jerusalem'): ('consistent', NS + ': the Book of Mormon city Jerusalem destroyed by water (9:7)'),
    ('BMC-185', 'flood'): ('consistent', 'floods in the sandy-foundation image (11:40); see the parallel rows'),
    # checkpoint 62 (HANDOFF_PLAN 2026-11-04 MAT61-C1): both leads closed by one source-only comparison view
    ('BMC-185', 'parallel: Matthew 7:26-27'): ('resolved', '11:39–40 rock/sandy-foundation image compared with '
                                                           'Matthew 7:24–27 in BMV-185-doctrine-foundations-matthew '
                                                           '(3/bom, no link); wording and images, not one event'),
    ('BMC-185', 'parallel: Matthew 16:18'): ('resolved', '11:39 gates-of-hell/rock wording compared with Matthew '
                                                         '16:18 in BMV-185-doctrine-foundations-matthew (3/bom, no '
                                                         'link); the rock referent is not arbitrated'),
    ('BMC-226', 'parallel: Hebrews 11:1'): ('resolved', '12:6 wording matches Hebrews 11:1; kept as an unstated parallel without a link in the checkpoint-58 BMC-226 decision'),
    ('BMC-236', 'parallel: 1 Corinthians 13:4-7'): ('resolved', 'one passage-level comparison: BMV-236 cites Moroni 7:45–46 and 1 Corinthians 13:4–8, without a link'),
    ('BMC-236', 'parallel: 1 Corinthians 13:8'): ('resolved', 'same passage-level comparison as 7:45 (BMV-236)'),
    ('BMC-193', 'Isaiah'): ('consistent', NS + ': Isaiah is a Nephite disciple (19:4), as the row says'),
    ('BMC-193', 'Jeremiah'): ('consistent', NS + ': Jeremiah is a Nephite disciple (19:4), as the row says'),
    ('BMC-193', 'Zedekiah'): ('consistent', NS + ': Zedekiah is a Nephite disciple (19:4), as the row says'),
    ('BMC-201', 'cross'): ('resolved', '27:14 crucifixion recollection: BMV-201 links AE10 as recalled, not quoted'),
    ('BMC-205', 'Jerusalem'): ('resolved', '1:31 attempted-killing comparison: BMV-205 without a link (AE10 not selected)'),
    ('BMC-207', 'David'): ('consistent', NS + ': the Book of Mormon land of David (2:5)'),
    ('BMC-207', 'Joshua'): ('consistent', NS + ': the Book of Mormon land of Joshua (2:6)'),
    ('BMC-213', 'Isaiah'): ('resolved', '8:23 Isaiah-study instruction: recorded checkpoint-58 decision, no Isaiah or JST link'),
    ('BMC-216', 'cross'): ('consistent', 'crossing the waters (2:6, 22, 25)'),
    ('BMC-216', 'Nimrod'): ('resolved', '2:1 valley called after the mighty hunter: BMV-216 cites Genesis 10:8–9 as a '
                                     'comparison (no Nimrod card); not Shinar or Babel'),
    ('BMC-220', 'Noah'): ('resolved', '6:7 ark comparison: BMV-220 relation without a card; PE06 rejected'),
    ('BMC-221', 'Ephraim'): ('consistent', NS + ': the Jaredite hill Ephraim (7:9), as the row says'),
    ('BMC-221', 'Noah'): ('consistent', NS + ': Noah son of Corihor (7:14–18), as the row says'),
    ('BMC-226', 'law of Moses'): ('resolved', '12:11 law given by faith: a practice in the checkpoint-58 BMC-226 decision; no law-practice link'),
    ('BMC-226', 'Moses'): ('resolved', 'same verse as law of Moses (12:11)'),
    ('BMC-237', 'Adam'): ('resolved', '8:8 curse of Adam: BMV-237 links OH-E01 as a comparison with the Genesis account'),
    ('BMC-222', 'Cain'): ('resolved', '8:15 oaths handed down from Cain: BMV-222 links OH-R01; found only by the '
                                   'checkpoint-58 controlled Cain cue'),
}

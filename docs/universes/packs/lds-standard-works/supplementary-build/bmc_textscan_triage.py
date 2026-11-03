# Builder triage for bmc_textscan.py (checkpoint 56). Keys are a cue (applies to every row) or (research_key, cue).
# States:
#   consistent  - the hit agrees with the row's semantic state and reason (namesake, Book of Mormon usage, etc.)
#   reader      - the text shows a Bible relation the research row does not state; a reviewer decides whether it
#                 warrants a view or link (proposed card given where one exists). Nothing is built.
#   note        - consistent with the state, but the row's reason does not name it; a reason refinement is proposed.
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
    ('BMC-178', 'Abraham'): ('note', '“God of Abraham, Isaac and Jacob” (4:30) is a divine title: a practice-or-title '
                                     'reason, not no-bible-relation; no link proposed'),
    ('BMC-178', 'Isaac'): ('note', 'same divine title as Abraham (4:30)'),
    ('BMC-183', 'Jerusalem'): ('consistent', NS + ': the Book of Mormon city Jerusalem destroyed by water (9:7)'),
    ('BMC-185', 'flood'): ('consistent', 'floods in the sandy-foundation image (11:40); see the parallel rows'),
    ('BMC-185', 'parallel: Matthew 7:26-27'): ('reader', '11:39–40 rock and sandy-foundation image parallels '
                                                         'Matthew 7:24–27; no comparison is stated in the row '
                                                         '(unstated-parallel class, cf. BMC-188); no card'),
    ('BMC-185', 'parallel: Matthew 16:18'): ('reader', '11:39 “the gates of hell shall not prevail” matches '
                                                       'Matthew 16:18 wording; unstated parallel, no card'),
    ('BMC-226', 'parallel: Hebrews 11:1'): ('reader', '12:6 “faith is things which are hoped for and not seen” '
                                                      'matches Hebrews 11:1, and the chapter then lists examples '
                                                      'of faith; unstated parallel (candidate NTC-faith-exemplars '
                                                      '“Examples of faith (Hebrews 11)”, 2/nt)'),
    ('BMC-236', 'parallel: 1 Corinthians 13:4-7'): ('reader', '7:45 charity wording matches 1 Corinthians 13:4–7; '
                                                              'unstated parallel; no 1 Corinthians 13 card (BC12 '
                                                              'and BXC05 are Book of Mormon cards)'),
    ('BMC-236', 'parallel: 1 Corinthians 13:8'): ('reader', '7:46 “charity never faileth” matches 1 Corinthians '
                                                            '13:8; same disposition as 7:45'),
    ('BMC-193', 'Isaiah'): ('consistent', NS + ': Isaiah is a Nephite disciple (19:4), as the row says'),
    ('BMC-193', 'Jeremiah'): ('consistent', NS + ': Jeremiah is a Nephite disciple (19:4), as the row says'),
    ('BMC-193', 'Zedekiah'): ('consistent', NS + ': Zedekiah is a Nephite disciple (19:4), as the row says'),
    ('BMC-201', 'cross'): ('reader', '27:14 Jesus says he was lifted up upon the cross: the crucifixion recalled '
                                     '(candidate AE10 “Crucifixion in Matthew”, 2/nt, as BMV-032 links it)'),
    ('BMC-205', 'Jerusalem'): ('reader', '1:31 compares persecution to “the Jews at Jerusalem [who] sought to kill '
                                         'Jesus”: a stated Gospel comparison (candidate AE10, 2/nt)'),
    ('BMC-207', 'David'): ('consistent', NS + ': the Book of Mormon land of David (2:5)'),
    ('BMC-207', 'Joshua'): ('consistent', NS + ': the Book of Mormon land of Joshua (2:6)'),
    ('BMC-213', 'Isaiah'): ('reader', '8:23 “Search the prophecies of Isaiah”: the prophet named as a source; a '
                                      'reviewer decides whether a naming link to an Isaiah card is wanted'),
    ('BMC-216', 'cross'): ('consistent', 'crossing the waters (2:6, 22, 25)'),
    ('BMC-220', 'Noah'): ('reader', '6:7 the barges are “tight like unto the ark of Noah”: a stated comparison to '
                                    'the patriarch’s ark; no Genesis flood card exists (PE06 is 5/pgp), so '
                                    'relation-no-card unless a reviewer picks PE06'),
    ('BMC-221', 'Ephraim'): ('consistent', NS + ': the Jaredite hill Ephraim (7:9), as the row says'),
    ('BMC-221', 'Noah'): ('consistent', NS + ': Noah son of Corihor (7:14–18), as the row says'),
    ('BMC-226', 'law of Moses'): ('note', '12:11 “by faith was the law of Moses given”: the giving of the law is '
                                          'recalled in Moroni’s faith teaching; reason could name it (practice/'
                                          'teaching), no link proposed'),
    ('BMC-226', 'Moses'): ('note', 'same verse as law of Moses (12:11)'),
    ('BMC-237', 'Adam'): ('reader', '8:8 “the curse of Adam is taken from them”: a Fall teaching naming Adam (the '
                                    'Fall/creation reader class; cf. BMV-031/107/214)'),
}

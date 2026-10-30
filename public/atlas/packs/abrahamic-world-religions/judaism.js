/* Religious Traditions atlas — data part: Judaism (PACK_FORMAT §1.1; read by ../abrahamic-world-religions.js).
   Research: docs/universes/packs/abrahamic-world-religions/judaism-research.md §4–§6, §8 (JA01 correction from
   judaism-record-audit.md); ids from identity-and-edges.csv. Moved here unchanged from the pack file at
   checkpoint 4, except that the Orthodox non-merge now links the Eastern Orthodox node. */
((window.ATLAS_PACK_PARTS = window.ATLAS_PACK_PARTS || {})['abrahamic-world-religions'] =
  window.ATLAS_PACK_PARTS['abrahamic-world-religions'] || {}).judaism = function (h) {
    /* ---------- Judaism: tree nodes, events, journeys, people (judaism-research.md §4–§6, §8) ----------
       Node ids are the canonical ids of identity-and-edges.csv. Dates: a number only where the source gives a
       year; otherwise `emerge` (a literal century window, research-review Q02) or `undated`, always with the
       source's wording in `whenText`. Ties follow the typed ledger JU-R01–R18; none is upgraded to "branched from". */
    function jud(id, name, kind, extra, blurb, notes) {
      return Object.assign({ id, name, kind, layers: ['jud'], world: 'earth', blurb }, extra, notes ? { notes } : {});
    }
    /* children of the overview hub are grouped there for reading, not classified under one institution */
    const IN = (p, rel) => ({
      parent: p,
      parentType: 'within',
      parentRel: p === 'judaism' ? 'grouped in this overview' : rel || 'within',
    });
    const SCH = h.SCH;
    const TRAD = h.TRAD;

    const JUD_NODES = [
      jud(
        'judaism',
        'Judaism',
        'overview',
        { undated: true, ongoing: true, whenText: 'No single founding date' },
        'Jewish texts, communities and movements across different periods. Connections describe traditions, historical developments and institutions; they do not rank communities or reduce Jewish identity to a single family tree.',
        [
          SCH('Patriarchal narrative, ancient communal formation, Second Temple developments and rabbinic institutions answer different questions; none is an exact founding date for Judaism.'),
          { k: 'note', t: 'Many Jews participate across institutional boundaries or use no denominational label.' },
          { k: 'note', t: 'Outside this bounded pass, and not classed as extinct or unimportant: Samaritan traditions, Beta Israel and other African and Asian Jewish histories, detailed Sephardi, Mizrahi, Yemenite and Indian community histories, medieval legal schools and every Hasidic dynasty.' },
        ],
      ),
      jud(
        'jud-covenant-tradition',
        'Covenant tradition',
        'textual frame',
        Object.assign(IN('judaism', 'textual frame'), { undated: true, ongoing: true, whenText: 'Narrative time' }),
        'The Torah presents Abram’s call and Israel’s Sinai covenant as foundational relationships with God.',
        [{ k: 'text', t: 'Genesis 12:1–10 and Exodus 19:1–8. The narrative gives Abram’s age (75), not a BCE date.', ref: 'Gen. 12; Exod. 19' }],
      ),
      jud(
        'jud-israelite-judean-context',
        'Ancient Israel and Judah',
        'historical context',
        Object.assign(IN('judaism', 'historical context'), { undated: true, whenText: 'Ancient Levant; no single origin year' }),
        'Ancient Israel and Judah provide political and cultural contexts for Jewish history; their kingdoms are not modern denominations.',
        [{ k: 'notsame', t: 'The modern State of Israel. The northern kingdom of Israel and southern Judah were ancient political entities.' }],
      ),
      jud(
        'jud-second-temple',
        'Second Temple era',
        'period',
        {
          parent: 'jud-israelite-judean-context',
          parentType: 'branch',
          parentRel: 'historical-development',
          when: [-515, 70],
          approx: true,
          whenText: 'Temple-period frame',
          site: 'jerusalem',
        },
        'Jewish life in the Second Temple era included multiple groups and diaspora communities.',
        [SCH('A broad period, not a birthday for Judaism: no single founding act.')],
      ),
      jud(
        'jud-pharisees',
        'Pharisees',
        'ancient group (as Josephus describes it)',
        Object.assign(IN('jud-second-temple', 'contains-attributed-groups'), { undated: true, whenText: 'Late Second Temple period' }),
        'Josephus describes Pharisees as one of several Jewish philosophical groups.',
        [SCH('Josephus’s portrayal is an ancient author’s account, not a census, and his list is not exhaustive. No claim that all Jews belonged, or that the Pharisees became all later rabbis.')],
      ),
      jud(
        'jud-sadducees',
        'Sadducees',
        'ancient group (as Josephus describes it)',
        Object.assign(IN('jud-second-temple', 'contains-attributed-groups'), { undated: true, whenText: 'Late Second Temple period' }),
        'Josephus distinguishes Sadducees from Pharisees and Essenes.',
        [SCH('No surviving institutional successor is asserted. In particular, the Karaites are not shown as descended from the Sadducees.')],
      ),
      jud(
        'jud-essenes',
        'Essenes',
        'ancient group (as Josephus describes it)',
        Object.assign(IN('jud-second-temple', 'contains-attributed-groups'), { undated: true, whenText: 'Late Second Temple period' }),
        'Josephus describes an Essene group and its communal practices.',
        [SCH('Not every Dead Sea manuscript’s author is equated with this label.')],
      ),
      jud(
        'jud-rabbinic',
        'Rabbinic Judaism',
        'religious and literary development',
        {
          parent: 'jud-second-temple',
          parentType: 'branch',
          parentRel: 'historical-development',
          undated: true,
          ongoing: true,
          whenText: 'Early centuries CE onward',
        },
        'Rabbinic Judaism gives central importance to Torah interpretation and rabbinic teaching; its literature includes the Mishnah and the two Talmuds.',
        [
          TRAD('Tradition holds that the Oral Torah was transmitted from Moses.'),
          SCH('The Mishnah and later Palestinian and Babylonian discussion formed over the early centuries CE, in more than one centre. Not all communities changed at once in 70 CE.'),
        ],
      ),
      jud(
        'jud-ananites',
        'Ananites',
        'historical movement',
        Object.assign(IN('judaism', 'historical movement'), { emerge: [701, 800], whenText: 'Eighth century' }),
        'Followers of Anan ben David in the eighth century.',
        [SCH('Lasker distinguishes Anan’s followers from the later Karaite movement; Anan is not automatically its sole founder.')],
      ),
      jud(
        'jud-karaite',
        'Karaite Judaism',
        'movement',
        Object.assign(IN('judaism', 'movement'), { emerge: [801, 900], whenText: 'Apparently ninth century (consolidation)', ongoing: true, notSame: [{ id: 'jud-sadducees', t: 'No continuous institutional ancestry from the Sadducees is established.' }, { t: 'Every Eastern European Karaim identity.' }] }),
        'Karaite Judaism developed outside rabbinic authority while maintaining its own interpretive practices and changing relationships with Rabbanite Jews.',
        [
          SCH('A development over time, not an exact schism day. Communities today include Israel and California.'),
          
        ],
      ),
      jud(
        'jud-mystical-context',
        'Jewish mystical traditions',
        'intellectual context',
        Object.assign(IN('judaism', 'intellectual context'), { undated: true, ongoing: true, whenText: 'No single date' }),
        'The broader mystical background of Hasidism. Not all Kabbalah is Hasidism.',
      ),
      jud(
        'jud-hasidic',
        'Hasidism',
        'religious movement',
        Object.assign(IN('judaism', 'religious movement'), { emerge: [1701, 1800], whenText: 'Eighteenth century; no single founding day', ongoing: true }),
        'Hasidism is a Jewish mystical movement associated with the Baal Shem Tov and eighteenth-century Eastern Europe.',
        [SCH('Dynastic succession and biographical legends are not set out here. Hasidism is not the source of all Orthodox Judaism.')],
      ),
      jud(
        'jud-orthodox',
        'Orthodox Judaism',
        'modern umbrella',
        Object.assign(IN('judaism', 'modern umbrella'), { undated: true, ongoing: true, whenText: 'Modern; no single founder', notSame: [{ id: 'ch-eastern-orthodox', t: 'Eastern Orthodox Christianity: a shared English word does not identify the same religion.' }] }),
        'Orthodox Judaism includes distinct forms of observance and community. Modern Orthodox and Haredi are useful distinctions in the cited US study, not a complete global taxonomy.',
      ),
      jud(
        'jud-modern-orthodox',
        'Modern Orthodox',
        'modern stream',
        Object.assign(IN('jud-orthodox', 'within (modern classification)'), { undated: true, ongoing: true, whenText: 'Modern' }),
        'Modern Orthodox approaches combine commitment to Jewish law with engagement in modern society.',
        [SCH('No claim that all communities follow one institutional authority.')],
      ),
      jud(
        'jud-haredi',
        'Haredi',
        'umbrella',
        Object.assign(IN('jud-orthodox', 'within (modern classification)'), { undated: true, ongoing: true, whenText: 'Modern' }),
        'Haredi includes both Hasidic and non-Hasidic traditions; these categories are not synonyms.',
        [SCH('A modern classification, not a dated secession; the Haredi label is not backdated to Hasidism’s beginnings.')],
      ),
      jud(
        'jud-haskalah-context',
        'Haskalah and modern European debates',
        'intellectual context',
        Object.assign(IN('judaism', 'intellectual context'), { undated: true, whenText: 'Modern Europe; no single date' }),
        'Modern European Jewish debates that influenced Reform. An intellectual context, not a denomination.',
      ),
      jud(
        'jud-reform-progressive',
        'Reform / Progressive Judaism',
        'family of movements',
        Object.assign(IN('judaism', 'family of movements'), { emerge: [1801, 1900], whenText: 'Nineteenth-century Germany', ongoing: true }),
        'Reform developed in nineteenth-century Germany and spread internationally, adapting inherited practice to new settings.',
        [SCH('An umbrella, not the name of every national organization. Seesen (1810) and Hamburg (1818) are early milestones, not one founding act for all Reform communities.')],
      ),
      jud(
        'jud-conservative-masorti',
        'Conservative / Masorti Judaism',
        'movement',
        Object.assign(IN('judaism', 'movement'), { emerge: [1801, 1900], whenText: 'Nineteenth century onward', ongoing: true }),
        'Conservative/Masorti Judaism connects inherited practice with historical development. Frankel’s positive-historical approach is an important antecedent; later institutions shaped the movement.',
      ),
      jud(
        'jud-jts',
        'Jewish Theological Seminary',
        'institution',
        Object.assign(IN('judaism', 'institution'), { when: 1886, ongoing: true }),
        'Founded in 1886 in New York; classes began in 1887. Its institutional leadership shaped the Conservative movement.',
        [SCH('Later Conservative institutional boundaries are not projected back onto its founding coalition, and its founding is not every member’s origin.')],
      ),
      jud(
        'jud-reconstructionist',
        'Reconstructionist Judaism',
        'movement',
        Object.assign(IN('judaism', 'movement'), { emerge: [1901, 2000], whenText: 'Twentieth-century US origins', ongoing: true }),
        'Reconstructionist thought describes Judaism as an evolving civilization; Kaplan’s work and later institutions developed this approach.',
        [SCH('1922 (Society for the Advancement of Judaism), 1955 (congregational federation) and 1968 (the college) are different milestones. Institutional reach is not a population census.')],
      ),
      jud(
        'jud-humanistic',
        'Humanistic Judaism',
        'movement',
        Object.assign(IN('judaism', 'movement'), { emerge: [1901, 2000], whenText: 'Twentieth century; congregational formation in the 1960s', ongoing: true }),
        'Humanistic Judaism maintains Jewish cultural and communal life through a human-centred philosophy.',
        [
          SCH('IISHJ’s history dates the congregational practice to 1964 and the Society for Humanistic Judaism to 1969; the often-repeated 1963 is not used.'),
          { k: 'notsame', t: 'Every secular Jew.' },
        ],
      ),
      jud(
        'jud-renewal',
        'Jewish Renewal',
        'spiritual movement',
        Object.assign(IN('judaism', 'spiritual movement'), { undated: true, ongoing: true, whenText: 'Contemporary; no single origin date' }),
        'Jewish Renewal combines Jewish spiritual practice, community and renewal; ALEPH is one major organizational expression.',
        [SCH('Transcommunal: not all participants are exclusively affiliated. ALEPH’s 1993 formation is not Renewal’s sole origin date.')],
      ),
      jud('jud-pnai-or', 'P’nai Or', 'organization', Object.assign(IN('judaism', 'organization'), { undated: true, whenText: 'Before 1993' }), 'One of the two organizations whose merger formed ALEPH in 1993.'),
      jud('jud-shalom-center', 'The Shalom Center', 'organization', Object.assign(IN('judaism', 'organization'), { undated: true, whenText: 'Before 1993' }), 'One of the two organizations named in ALEPH’s account of its 1993 formation. No claim that it then ceased all independent activity.'),
      jud(
        'jud-aleph',
        'ALEPH: Alliance for Jewish Renewal',
        'organization',
        { merge: ['jud-pnai-or', 'jud-shalom-center'], parentRel: 'institutional-merger', when: 1993, ongoing: true },
        'ALEPH describes its formation through the merger of P’nai Or and the Shalom Center in 1993.',
        [SCH('An organizational expression of Renewal, not every Renewal participant.')],
      ),
      jud('jud-liberal-uk-historical', 'Liberal Judaism (UK)', 'organization', Object.assign(IN('judaism', 'organization'), { undated: true, whenText: 'Before the 2026 merger' }), 'The British Liberal Judaism organization, before its 2026 merger.'),
      jud('jud-reform-uk-historical', 'Movement for Reform Judaism (UK)', 'organization', Object.assign(IN('judaism', 'organization'), { undated: true, whenText: 'Before the 2026 merger' }), 'The British Reform organization, before its 2026 merger. Not world Reform Judaism.'),
      jud(
        'jud-progressive-uk',
        'Movement for Progressive Judaism (UK)',
        'organization',
        { merge: ['jud-liberal-uk-historical', 'jud-reform-uk-historical'], parentRel: 'institutional-merger', when: 2026, ongoing: true, whenText: 'Effective 1 January 2026', notSame: [{ id: 'jud-reform-progressive', t: 'A British organizational merger, not a global merger of all liberal movements.' }] },
        'The Movement for Progressive Judaism brings together the former British Liberal and Reform organizations.',
        [SCH('The December 2025 launch publicity is a separate milestone from the 1 January 2026 effective date. Registered office: the Sternberg Centre, London.')],
      ),
      jud(
        'jud-diaspora-cultures',
        'Ashkenazi and Sephardic cultures',
        'cultural-family reference',
        Object.assign(IN('judaism', 'cultural reference'), { undated: true, ongoing: true, whenText: 'No single date' }),
        'Ashkenazi and Sephardic histories describe diaspora cultures and rites, rather than parallel modern denominations.',
        [SCH('Cultural ancestry is not forced into an Orthodox/Reform binary.')],
      ),
    ];

    /* typed ties (JU-R01, R06–R08, R11–R14, aleph within renewal); the person edges R05, R13, R15, R16 are in People */
    const JUD_LINKS = [
      { from: 'jud-covenant-tradition', to: 'jud-rabbinic', type: 'context', rel: 'inherited text / traditional transmission; the religious account is kept apart from literary history' },
      { from: 'jud-ananites', to: 'jud-karaite', type: 'contact', rel: 'later appropriation / influence; not an exact schism' },
      { from: 'jud-karaite', to: 'jud-rabbinic', type: 'history', rel: 'interaction and differentiation; no claim of total social separation' },
      { from: 'jud-mystical-context', to: 'jud-hasidic', type: 'contact', rel: 'influenced-by' },
      { from: 'jud-hasidic', to: 'jud-haredi', type: 'overlap', rel: 'overlapping modern classification' },
      { from: 'jud-haskalah-context', to: 'jud-reform-progressive', type: 'context', rel: 'historical influence' },
      { from: 'jud-jts', to: 'jud-conservative-masorti', type: 'context', rel: 'institutional leadership' },
      { from: 'jud-aleph', to: 'jud-renewal', type: 'within', rel: 'an organizational expression of Renewal' },
    ];

    /* Chronicle (judaism-research.md §4). `whenText` keeps the source's precision; `when` only drives the year filter */
    const ev = h.ev('jud');
    const JUD_EVENTS = [
      ev('jud-e00', 'Abram’s call and departure', 'The text: a divine call precedes the household’s departure; Abram is 75 in the narrative. There is no modern BCE date.', { whenText: 'Narrative chronology; no calendar date', ref: 'jud-j01' }),
      ev('jud-e00b', 'Covenant at Sinai', 'The text: Exodus 19 narrates a covenant proposal and the people’s assent. A foundational covenant story, not independently established dating.', { whenText: 'Third month after leaving Egypt (narrative); no BCE date', ref: 'jud-sinai' }),
      ev('jud-e01', 'Conquest and deportations', 'Conquest and deportation came in stages, 597 and 586 BCE in the cited account, under Nebuchadnezzar II; Jehoiachin and Zedekiah are named. Not all Judeans left together.', { when: [-597, -586], whenText: '597 BCE and 586 BCE (separate episodes)', site: 'jerusalem' }),
      ev('jud-e02', 'Cyrus takes Babylon', 'Cyrus took Babylon in 539 BCE; a return and rebuilding followed over time. Ezra’s return-and-rebuilding decree is kept distinct from the Cyrus Cylinder’s account of other communities.', { when: -539, whenText: '539 BCE; later return and rebuilding', site: 'jud-babylon' }),
      ev('jud-e03', 'Second Temple restored', 'The restored Temple became the period’s main Jerusalem sanctuary. An approximate chronology, not a day-specific founding of a religion.', { when: -515, approx: true, whenText: 'Late sixth century BCE (c. 515 BCE)', site: 'jerusalem' }),
      ev('jud-e04', 'The Temple destroyed', 'Roman forces destroyed the Temple in 70 CE: a decisive institutional rupture, after which rabbinic practice developed over time. Judaism and diaspora communities did not begin in 70 CE.', { when: 70, whenText: '70 CE', site: 'jerusalem' }),
      ev('jud-e05', 'Rabbinic literature forms', 'The Mishnah and later Palestinian and Babylonian discussion form major rabbinic corpora. That the Oral Torah was transmitted from Moses is a traditional claim, distinct from this literary history.', { whenText: 'Early centuries CE (approximate)', ref: 'jud-babylonia' }),
      ev('jud-e06', 'Ananites and Karaites', 'Scholarship (Lasker) distinguishes Anan ben David’s eighth-century followers from the Karaite movement, which apparently consolidated in the ninth century. A development, not a schism day.', { when: [701, 900], whenText: 'Eighth to ninth century', ref: 'jud-babylonia' }),
      ev('jud-e07', 'Hasidism develops', 'Hasidism develops as a Jewish mystical movement around Israel Baal Shem Tov and his disciples. Dynastic succession and biographical legends are not set out here.', { when: [1701, 1800], whenText: 'Eighteenth century; no single founding day', side: 'Eastern Europe · regional context, no map point' }),
      ev('jud-e08', 'Seesen temple inaugurated', 'Israel Jacobson’s temple in Seesen is inaugurated: an early Reform milestone, not one founding act shared by all Reform communities.', { when: 1810, whenText: '17 July 1810', ref: 'jud-seesen' }),
      ev('jud-e09', 'Hamburg Temple', 'Hamburg’s Reform temple illustrates institutional change in German Jewish life.', { when: 1818, whenText: '1818', ref: 'jud-hamburg' }),
      ev('jud-e10', 'Jewish Theological Seminary', 'JTS is founded (Sabato Morais, H. Pereira Mendes and lay supporters) and begins teaching. Later Conservative boundaries are not projected back onto its founding coalition.', { when: [1886, 1887], whenText: '1886 founded; 1887 first class', ref: 'jud-new-york' }),
      ev('jud-e11', 'Society for the Advancement of Judaism', 'Mordecai Kaplan founds the Society for the Advancement of Judaism.', { when: 1922, whenText: '1922', side: 'Location not given by the cited source' }),
      ev('jud-e12', 'Reconstructionist Rabbinical College', 'The college is dedicated (Kaplan, Ira Eisenstein) and classes begin the next day. Distinct from the earlier development of Reconstructionist thought.', { when: 1968, whenText: '13 October 1968 (classes 14 October)', ref: 'jud-philadelphia' }),
      ev('jud-e13', 'Humanistic Judaism organizes', 'Sherwin Wine’s congregational Humanistic Jewish practice (1964 in IISHJ’s history) and the Society for Humanistic Judaism (1969) are separate milestones.', { when: [1964, 1969], whenText: '1960s; Society founded 1969', ref: 'jud-detroit-region' }),
      ev('jud-e14', 'ALEPH formed', 'ALEPH describes its formation through the merger of P’nai Or and the Shalom Center, with Zalman Schachter-Shalomi as a founding influence. Not Jewish Renewal’s sole origin date.', { when: 1993, whenText: '1993', side: 'A network of organizations; no map point' }),
      ev('jud-e16', 'Movement for Progressive Judaism', 'The British Liberal Judaism and Movement for Reform Judaism organizations merge. The December 2025 launch publicity is a separate milestone.', { when: 2026, whenText: '1 January 2026 (effective date)', ref: 'london' }),
    ];

    /* journeys: ordered reference sequences, never drawn routes (judaism-research.md §5) */
    const JOURNEY_NOTE = h.JOURNEY_NOTE;
    const JUD_JOURNEYS = [
      { id: 'jud-j01', name: 'Abram’s household', role: 'Narrative sequence · Judaism', first: 1, layers: ['jud'], desc: 'Genesis 12:4–10 narrates this order: Haran → Canaan → Shechem and Moreh → between Beth-el and Ai → southward travel → Egypt. Textual narrative, not an independently reconstructed migration.' + JOURNEY_NOTE },
      { id: 'jud-j02', name: 'Israel: Rephidim to Sinai', role: 'Narrative sequence · Judaism', first: 1, layers: ['jud'], desc: 'Exodus 19:1–2: Rephidim → Sinai. Egypt is the broader recalled departure context, not an adjacent leg invented here.' + JOURNEY_NOTE },
      { id: 'jud-j03', name: 'Judean deportation and return', role: 'Historical movements · Judaism', first: 1, layers: ['jud'], desc: 'Judean deportees: Jerusalem and Judah → Babylonia; later some returnees → Jerusalem. Distinct forced movements and return episodes (597 and 586 BCE; after 539 BCE). Neither all people nor any intermediate waypoints are specified.' + JOURNEY_NOTE },
      { id: 'jud-j04', name: 'Spread of Reform', role: 'Spread of institutions and ideas · Judaism', first: 1, layers: ['jud'], desc: 'Reform institutions and ideas: German settings → Europe and North America, as described by Reform’s institutional historian. Not one person’s trip or a sequence through every country.' + JOURNEY_NOTE },
    ];

    /* people: source-qualified roles; none is a biological parent of a movement */
    const PERSON = (id, name, role, desc) => ({ id, name, role: role + ' · Judaism', first: 1, layers: ['jud'], desc });
    const JUD_PEOPLE = [
      PERSON('jud-abram', 'Abram', 'Narrative figure', 'In Genesis 12, Abram leaves Haran with Sarai and his nephew Lot.'),
      PERSON('jud-moses', 'Moses', 'Narrative figure', 'The mediator of the covenant in Exodus 19.'),
      PERSON('jud-anan', 'Anan ben David', 'Eighth century', 'The figure associated with the Ananites; not automatically the sole founder of the Karaites.'),
      PERSON('jud-besht', 'Israel Baal Shem Tov', 'Eighteenth century', 'The founding figure associated with Hasidism.'),
      PERSON('jud-jacobson', 'Israel Jacobson', 'Seesen, 1810', 'Patron and speaker at the Seesen temple inauguration.'),
      PERSON('jud-frankel', 'Zacharias Frankel', 'Nineteenth century', 'Thinker of the positive-historical approach, an important antecedent of Conservative/Masorti Judaism.'),
      PERSON('jud-kaplan', 'Mordecai Kaplan', 'Twentieth century', 'Thinker whose work developed Reconstructionist Judaism; founded the Society for the Advancement of Judaism in 1922.'),
      PERSON('jud-wine', 'Sherwin Wine', 'Twentieth century', 'Leader in the development of Humanistic Judaism.'),
      PERSON('jud-schachter-shalomi', 'Zalman Schachter-Shalomi', 'Twentieth century', 'A founding influence on Jewish Renewal and ALEPH.'),
    ];

    return { nodes: JUD_NODES, links: JUD_LINKS, events: JUD_EVENTS, journeys: JUD_JOURNEYS, people: JUD_PEOPLE };
};

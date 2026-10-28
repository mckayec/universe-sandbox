/* =====================================================================================================
   RELIGIOUS TRADITIONS: ORIGINS AND CONNECTIONS — Track A data pack (PACK_FORMAT §13.1, §20, §21).
   BUILD CHECKPOINT 3 (draft, not reviewed): meta, notice, theme, layers, the ten map anchors, the
   reference-only place cards, and the Judaism tree, Chronicle, journeys and people. Christianity, Islam and
   Encounters follow in checkpoints 4–6.

   Research: docs/universes/packs/abrahamic-world-religions/ at research acceptance f7b74e7 — research.md,
   build-contract.md, gazetteer-evidence.md/.csv, identity-and-edges.csv and the three tradition dossiers.
   Builder review: research-review.md.

   Rules followed here (build-contract.md, gazetteer-evidence.md):
   * Only ten places are pins: eight UNESCO heritage components (gaz-*) plus Jerusalem and Babylon from the
     Judaism dossier. Each is a heritage reference, never the exact point of an event.
   * Every other place is a reference card in the Codex ("Places without a map point"), never a guessed pin.
   * Card ids are the canonical ids of identity-and-edges.csv; shared cities (Jerusalem, London, Cairo) are
     one record with each tradition's association kept separately.
   * Non-merges from identity-and-edges.csv are shown as "Not the same as" notes.
   * One overview gate (book 1): this is a historical atlas, not a reading order.
   ===================================================================================================== */
(window.ATLAS_PACKS = window.ATLAS_PACKS || {})['abrahamic-world-religions'] = (function () {
  /* layers = optional filters (research.md §2); they are not mutually exclusive population categories */
  const LAYERS = [
    { id: 'jud', name: 'Judaism', short: 'Judaism', c: '#d9b45a', tip: 'Jewish texts, communities and movements' },
    { id: 'chr', name: 'Christianity', short: 'Christianity', c: '#7fa8e8', tip: 'Christian families and movements' },
    { id: 'isl', name: 'Islam', short: 'Islam', c: '#7cc4a4', tip: 'Muslim traditions, schools and movements' },
    {
      id: 'enc',
      name: 'Encounters',
      short: 'Encounters',
      c: '#c99ad9',
      tip: 'Sourced contacts with other traditions: comparison, translation, policy, declaration',
    },
  ];

  /* ---------- map anchors (gazetteer-evidence.csv; judaism-research.md §3 for Jerusalem and Babylon) ---------- */
  const HERITAGE = 'Heritage reference: a modern marker for a named heritage property, not the exact place of an event.';

  function note(t) {
    return { k: 'note', t };
  }
  function notSame(t) {
    return { k: 'notsame', t };
  }

  const SITES = [
    {
      id: 'jerusalem',
      name: 'Jerusalem',
      lat: 31.777778,
      lon: 35.231667,
      layers: ['jud', 'chr', 'isl'],
      modern: 'Jerusalem (UNESCO Old City representative point)',
      desc: 'Jerusalem connects the Temple history in the Judaism layer with Jewish religious memory and later communities.',
      notes: [
        {
          k: 'christianity',
          t: 'First century CE: the setting of the crucifixion in the Christian origins account. The resurrection is a religious claim and is attributed as such.',
        },
        {
          k: 'islam',
          t: 'Muslim tradition identifies Jerusalem as the destination of the Night Journey. The sacred-place claim stays attributed to that tradition.',
        },
        note(
          'One city-level marker for all three layers. It does not mark a specific building, a destruction or revelation site, or any claim of sovereignty.',
        ),
      ],
    },
    {
      id: 'jud-babylon',
      name: 'Babylon',
      lat: 32.541969,
      lon: 44.420833,
      layers: ['jud'],
      modern: 'Babylon archaeological site (UNESCO property point)',
      desc: 'Babylon was a Neo-Babylonian imperial capital. Judean exile and the community life that followed link this region with Jerusalem.',
      notes: [
        notSame('Babylonia, the wider region. Academies and diaspora life in Babylonia are not placed at this city marker.'),
        notSame('Baghdad. Ancient Babylon is a different city.'),
      ],
    },
    {
      id: 'gaz-rome-centre',
      name: 'Rome: historic centre',
      lat: 41.890222,
      lon: 12.492306,
      layers: ['chr'],
      modern: 'Historic Centre of Rome (UNESCO component 91quater-001)',
      desc: 'The central episcopal reference of the Catholic communion; the 1965 joint declaration was read in Rome.',
      notes: [
        note(HERITAGE),
        note('City heritage context only: not a burial place, and not the room where the 1965 declaration was read.'),
      ],
    },
    {
      id: 'gaz-istanbul-sultanahmet',
      name: 'Istanbul: Sultanahmet',
      lat: 41.008333,
      lon: 28.983333,
      layers: ['chr'],
      modern: 'Historic Areas of Istanbul, Sultanahmet (UNESCO component 356bis-001)',
      desc: 'A modern heritage reference for historical Constantinople: the 381 council, the censures of 1054, and Istanbul, the name used for the 1965 ceremony.',
      notes: [note(HERITAGE), note('Not the point of a council or of the 1054 excommunications.')],
    },
    {
      id: 'gaz-wittenberg-luther-hall',
      name: 'Wittenberg: Luther Hall',
      lat: 51.864611,
      lon: 12.652722,
      layers: ['chr'],
      modern: 'Luther Memorials in Eisleben and Wittenberg, Luther Hall (UNESCO component 783-003)',
      desc: 'Wittenberg is associated with Luther’s public opposition to the sale of indulgences in 1517.',
      notes: [
        note(HERITAGE),
        note('A named Wittenberg component, not the door where the theses are said to have been posted.'),
      ],
    },
    {
      id: 'gaz-cairo-historic',
      name: 'Historic Cairo',
      lat: 30.044417,
      lon: 31.262139,
      layers: ['chr', 'isl'],
      modern: 'Historic Cairo (UNESCO component 89-002)',
      desc: 'Cairo is the setting of Fatimid succession history, and of the 1978 conference that established the Organization of African Instituted Churches.',
      notes: [
        note(HERITAGE),
        note(
          'The component covers the Mosque of Ahmed Ibn Tulun, the Citadel area, the Fatimid nucleus and the necropolis. It is not the venue of a succession meeting or of the 1978 conference.',
        ),
      ],
    },
    {
      id: 'gaz-ghardaia-ksar',
      name: 'Ksar Ghardaïa',
      lat: 32.488828,
      lon: 3.674228,
      layers: ['isl'],
      modern: 'M’Zab Valley, Ksar Ghardaïa (UNESCO component 188-005)',
      desc: 'One settlement of the M’zab Valley, a setting of Ibadi community life.',
      notes: [
        note(HERITAGE),
        note('One component, not the whole valley and not the origin point of all Ibadis. No foundation date is given.'),
      ],
    },
    {
      id: 'gaz-zanzibar-stone-town',
      name: 'Stone Town of Zanzibar',
      lat: -6.16306,
      lon: 39.18917,
      layers: ['isl'],
      modern: 'Stone Town of Zanzibar (UNESCO property 173rev)',
      desc: 'Zanzibar is a setting of interaction between Ibadi and Sunni scholars.',
      notes: [
        note(HERITAGE),
        notSame('Zanzibar island. The town property is not the island boundary.'),
        note('Not the documented end point of any individual scholar’s journey.'),
      ],
    },
    {
      id: 'gaz-canterbury-cathedral',
      name: 'Canterbury Cathedral',
      lat: 51.28,
      lon: 1.083222,
      layers: ['chr'],
      modern: 'Canterbury Cathedral, St Augustine’s Abbey and St Martin’s Church (UNESCO component 496-001)',
      desc: 'A heritage reference for the institutional context of the Church of England.',
      notes: [
        note(HERITAGE),
        note('It marks no founding event, and does not make every Anglican province subject to one authority.'),
      ],
    },
    {
      id: 'gaz-bethlehem-nativity',
      name: 'Bethlehem: Church of the Nativity',
      lat: 31.704353,
      lon: 35.2075,
      layers: ['chr'],
      modern: 'Birthplace of Jesus: Church of the Nativity and the Pilgrimage Route (UNESCO property 1433)',
      desc: 'A commemorative heritage site framed by Christian tradition about the birth of Jesus.',
      notes: [
        note(HERITAGE),
        note('The listing records the Christian birth tradition; it does not establish an exact historical birthplace.'),
      ],
    },
  ];
  SITES.forEach((s) => (s.books = [1]));

  /* ---------- reference-only places (codex tab "places"; PACK_FORMAT §13.1) ---------- */
  const LAYER_NAME = {};
  LAYERS.forEach((l) => (LAYER_NAME[l.id] = l.name));

  /* place(id, name, type, layers, desc, [map anchor id], [notSame text]) */
  function place(id, name, type, layers, desc, anchor, ns) {
    const role = type + ' · ' + layers.map((l) => LAYER_NAME[l]).join(', ') + ' · no map point';
    let d = desc;
    if (anchor) d += ' Heritage marker on the map: ' + anchor + '.';
    if (ns) d += ' Not the same as ' + ns;
    return { id, name, role, first: 1, layers, desc: d };
  }

  const PLACES = [
    /* Judaism (judaism-research.md §3) */
    place('jud-babylonia', 'Babylonia', 'Historical region', ['jud'], 'Babylonia was a setting for Jewish diaspora life and later rabbinic study.', null, 'Babylon, the city, which has its own marker; and not the same as the wider Church of the East setting of Assyria, Babylonia and Persia.'),
    place('jud-canaan', 'Canaan', 'Scriptural region', ['jud'], 'Canaan in Abram’s narrative. No narrative date is assigned.'),
    place('jud-haran', 'Haran', 'Narrative place', ['jud'], 'Haran in Abram’s narrative. There is no ancient departure point to pin.'),
    place('jud-shechem', 'Shechem and Moreh', 'Narrative city', ['jud'], 'Shechem and Moreh in Abram’s narrative.'),
    place('jud-bethel-ai', 'Between Beth-el and Ai', 'Narrative setting', ['jud'], 'The camp between Beth-el and Ai in Abram’s narrative. No campsite is invented.'),
    place('jud-egypt', 'Egypt', 'Regional reference', ['jud'], 'Egypt appears in two distinct narrative contexts, whose chronologies are kept apart.', null, 'Cairo: a country or region is not a city.'),
    place('jud-sinai', 'Sinai', 'Narrative setting', ['jud'], 'Exodus 19 describes Israel’s camp and covenant response at Sinai. No coordinate, and no BCE date, is given.'),
    place('jud-rephidim', 'Rephidim', 'Narrative setting', ['jud'], 'Exodus 19 names Rephidim as the departure point immediately before the Sinai camp.'),
    place('jud-alexandria', 'Alexandria', 'Diaspora city', ['jud'], 'Alexandria was a major setting of Greek-speaking Jewish life in the Hellenistic and Roman periods. No single migration route is supplied.'),
    place('jud-land-israel', 'Land of Israel', 'Historical regional label', ['jud'], 'Sources locate Palestinian rabbinic literature and an important medieval Karaite centre in this region. The term is used without a modern boundary.', null, 'Jerusalem, and not a sovereign boundary.'),
    place('jud-seesen', 'Seesen', 'City', ['jud'], 'Israel Jacobson’s temple inauguration in Seesen (1810) is an early Reform milestone.'),
    place('jud-hamburg', 'Hamburg', 'City', ['jud'], 'The Hamburg Temple (1818) was another important early Reform institution.'),
    place('jud-new-york', 'New York', 'City', ['jud'], 'New York hosted the early classes of the Jewish Theological Seminary (1886–1887).'),
    place('jud-philadelphia', 'Philadelphia', 'City', ['jud'], 'The Reconstructionist Rabbinical College opened here in 1968.'),
    place('jud-detroit-region', 'Suburban Detroit', 'Region', ['jud'], 'Sherwin Wine and the Birmingham Temple helped develop congregational Humanistic Judaism here in the 1960s.'),
    {
      id: 'london',
      name: 'London',
      role: 'City · Judaism, Christianity · no map point',
      first: 1,
      layers: ['jud', 'chr'],
      desc: 'Christianity: a Baptist congregation associated with Thomas Helwys (1612). Judaism: the Movement for Progressive Judaism’s registered office is at the Sternberg Centre in London; this is not a universal capital of Progressive Judaism.',
    },

    /* Christianity (christianity-research.md §3 and "Additional places") */
    place('chp-nicaea', 'Nicaea', 'Council city', ['chr'], 'The council convened by Constantine met here in 325. No building footprint is supplied.'),
    place('chp-constantinople', 'Constantinople', 'Historical city', ['chr'], 'The council of 381 and the Rome–Constantinople censures of 1054. Istanbul is the name used for the 1965 ceremony.', 'Istanbul: Sultanahmet'),
    place('chp-ephesus', 'Ephesus', 'Council city', ['chr'], 'The council of 431, kept distinct from the later Chalcedonian controversy.'),
    place('chp-chalcedon', 'Chalcedon', 'Council reference', ['chr'], 'The council of 451 and its contested reception. No boundary or modern alias is assumed.'),
    place('chp-rome', 'Rome', 'City', ['chr'], 'The central episcopal reference of the Catholic communion; the 1965 joint declaration was read in Rome.', 'Rome: historic centre'),
    place('chp-wittenberg', 'Wittenberg', 'City', ['chr'], 'Luther’s public opposition to the sale of indulgences, 1517.', 'Wittenberg: Luther Hall'),
    place('chp-zurich', 'Zurich', 'City', ['chr'], 'The Swiss believers’ baptism episode of 1525, a symbolic beginning of Anabaptism.'),
    place('chp-azusa', 'Azusa Street mission, Los Angeles', 'Historical mission address', ['chr'], 'The revival under William J. Seymour at 312 Azusa Street began in April 1906. The address is a historical association, not a verified surviving building.'),
    place('chp-fayette', 'Fayette, New York', 'Founding setting (institution’s account)', ['chr'], 'The Church of Jesus Christ of Latter-day Saints dates its organization here to 6 April 1830 in its official account.'),
    place('chp-east-syriac-region', 'Assyria, Babylonia and Persia', 'Broad historical context', ['chr'], 'The Church of the East developed east of the Roman-Byzantine world. There is no single point of origin.', null, 'Babylonia alone: the combined setting is broader than one region.'),
    place('chp-battle-creek', 'Battle Creek, Michigan', 'City', ['chr'], 'Seventh-day Adventist General Conference organization, May 1863.'),
    place('chp-pittsburgh', 'Pittsburgh area, Pennsylvania', 'Region', ['chr'], 'Bible Student origins in the late 1800s. No single house is identified.'),
    place('chp-columbus', 'Columbus, Ohio', 'City', ['chr'], 'The 1931 convention that adopted the name Jehovah’s Witnesses.'),
    {
      id: 'cairo',
      name: 'Cairo',
      role: 'City · Christianity, Islam · city record',
      first: 1,
      layers: ['chr', 'isl'],
      desc: 'Islam: the setting of Fatimid succession history. Christianity: the 1978 conference that established the Organization of African Instituted Churches. Heritage marker on the map: Historic Cairo (one UNESCO component, not the whole city).',
    },
    place('chp-amboy', 'Amboy, Illinois', 'City', ['chr'], 'Joseph Smith III became president of the Reorganized Church here on 6 April 1860.'),
    place('chp-green-oak', 'Green Oak, Pennsylvania', 'Settlement', ['chr'], 'William Bickerton organized The Church of Jesus Christ here in 1862.'),
    place('chp-utrecht', 'Utrecht', 'City', ['chr'], 'Five bishops met on 24 September 1889 and affirmed communion among the represented Old Catholic churches.'),
    place('chp-brest', 'Brest', 'Synod city', ['chr'], 'A synod in 1595–1596 proclaimed union with Rome; its reception was contested.'),
    place('chp-lexington', 'Lexington, Kentucky', 'City', ['chr'], 'The setting of the Stone–Campbell union of 31 December 1831 and 1 January 1832.'),

    /* Islam (islam-research.md §3 and added place keys) */
    place('ISP01', 'Mecca (Makkah)', 'City', ['isl'], 'Muhammad’s early setting and his point of departure for Medina.'),
    place('ISP02', 'Medina (Madinah)', 'City', ['isl'], 'The destination of the Hijra.'),
    place('ISP03', 'Hira', 'Mountain setting near Mecca', ['isl'], 'The setting of the first-revelation tradition. No cave coordinate is supplied.'),
    place('ISP05', 'Karbala', 'Battlefield and city, Iraq', ['isl'], 'Associated with the remembrance of Husayn.'),
    place('ISP06', 'Kufa', 'City', ['isl'], 'The setting of Zayd’s revolt.'),
    place('ISP07', 'Northern Yemen', 'Region', ['isl'], 'The setting of the Zaydi imamate. No equivalence to modern political control is implied.'),
    place('ISP08', 'Ifriqiya', 'Historical region', ['isl'], 'Where the Fatimid state was established. Not a modern national boundary.'),
    place('ISP10', 'Oman', 'Region', ['isl'], 'A setting of Ibadi presence.'),
    place('ISP11', 'Zanzibar', 'Island and city', ['isl'], 'A setting of Ibadi and Sunni scholarly interaction.', 'Stone Town of Zanzibar', 'the town alone: the island and the town are different shapes on a map.'),
    place('ISP12', 'M’zab Valley, Algeria', 'Region', ['isl'], 'A setting of Ibadi community life.', 'Ksar Ghardaïa, one of its settlements'),
    place('ISP13', 'Djerba (Jerba), Tunisia', 'Island', ['isl'], 'A setting of Ibadi community life.'),
    place('ISP14', 'Nafusa Mountains, Libya', 'Region', ['isl'], 'A setting of Ibadi community life.'),
    place('ISP15', 'Qadian', 'Town', ['isl'], 'Associated with Mirza Ghulam Ahmad. Not asserted as the place of the first initiation in 1889.'),
    place('ISP16', 'Deoband', 'Town and seminary setting', ['isl'], 'The place associated with Darul Uloom Deoband. The town and the campus are different places.'),
    place('ISP17', 'Bareilly', 'Town', ['isl'], 'The setting of Ahmad Riza Khan.', null, 'Rae Bareli, or the different Sayyid Ahmad Barelwi.'),
    place('ISP18', 'Najd', 'Historical region', ['isl'], 'Historical context for the Wahhabi movement. No fixed modern boundary.'),

    /* Encounters (comparative-evidence.md) */
    place('xian', 'Xi’an', 'City', ['enc', 'chr'], 'A stele erected in 781 records a Christian arrival at Xi’an in 635: the inscription’s date and the date of the arrival it reports are kept apart.', null, 'Nanjing: the contacts in China happened in different settings.'),
    place('nanjing', 'Nanjing', 'City', ['enc', 'isl'], 'The biographical setting of Liu Zhi, who used Daoist and Buddhist writings within an Islamic and Confucian intellectual project.', null, 'Xi’an.'),
    place('lahore', 'Lahore', 'City', ['enc', 'isl'], 'A biographical and intellectual setting of Dara Shikoh’s comparison of Hindu thought and Islamic Sufism. Not every part of the translation work happened at one place.'),
    place('talwandi', 'Talwandi', 'Town', ['enc'], 'A sourced setting in the life of Guru Nanak (1469–1539). No precise birthplace coordinate is given.'),
    place('sultanpur', 'Sultanpur', 'Town', ['enc'], 'A sourced setting in the life of Guru Nanak. Not merged with other places of the same name.'),
    place('shiraz', 'Shiraz', 'City', ['enc'], 'Bahá’í sources trace the faith’s origins to the Báb’s announcement here in 1844.'),
    place('baghdad', 'Baghdad', 'City', ['enc'], 'The official Bahá’í history places Bahá’u’lláh’s announcement here in 1863.', null, 'ancient Babylon.'),
    place('acre', 'Acre', 'City', ['enc'], 'The official Bahá’í history describes exile from Iran through Baghdad to confinement at Acre, reached in 1868. No route between them is drawn.'),
  ];


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
  const SCH = (t) => ({ k: 'scholarship', t });
  const TRAD = (t) => ({ k: 'tradition', t });

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
      Object.assign(IN('judaism', 'modern umbrella'), { undated: true, ongoing: true, whenText: 'Modern; no single founder', notSame: [{ t: 'Eastern Orthodox Christianity: a shared English word does not identify the same religion.' }] }),
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
  function ev(id, title, text, extra) {
    return Object.assign({ id, book: 1, world: 'earth', layers: ['jud'], title, text }, extra);
  }
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
  const JOURNEY_NOTE = ' Shown as an ordered list, not a drawn route: no surveyed path or geocoded waypoint is supported.';
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

  return {
    id: 'abrahamic-world-religions',
    meta: {
      title: 'Religious Traditions: Origins and Connections',
      series: 'Religious Traditions: Origins and Connections',
      tagline: 'Judaism · Christianity · Islam · <b>Encounters</b>',
      splash: 'Explore how religious communities developed, divided, interacted and spread, with traditions and historical evidence clearly distinguished.',
      notice:
        'Independent educational atlas. Religious self-descriptions, historical interpretations and demographic estimates are identified by source. Connections do not imply agreement, biological ancestry or institutional authority.',
      srcnote:
        'Map markers are ten heritage references (UNESCO World Heritage Centre geographical data, accessed 26 October 2026). Other places are listed without coordinates rather than guessed.',
      canvasLabel: 'Globe of Earth with heritage reference markers for religious history',
      sources: [
        'docs/universes/packs/abrahamic-world-religions/ (research acceptance f7b74e7)',
        'UNESCO World Heritage Centre geographical data: lists 91, 356, 783, 89, 188, 173, 496, 1433, and the Jerusalem and Babylon properties',
      ],
    },
    /* warm stone, ink blue, restrained gold (research.md §1) */
    theme: {
      void: '#07080b',
      deep: '#10131a',
      panel: 'rgba(14,16,22,.88)',
      accent: '#a88a4a',
      accentHi: '#dcc58e',
      accentLo: '#4c3f22',
      chrome: '#ece4d4',
      ember: '#d9b45a',
      text: '#e4ddcf',
      muted: '#a39a88',
      faint: '#6c6656',
      line: 'rgba(220,197,142,.16)',
      lineStrong: 'rgba(220,197,142,.44)',
      panelRgb: '20,22,30',
      panelRgb2: '9,10,14',
      insetRgb: '236,226,206',
      btnRgb: '14,16,22',
      ink: '#0b0c10',
      glowRgb: '120,150,210',
      hiRgb: '168,138,74',
      swRgb: '220,197,142',
      pipRgb: '220,197,142',
      shadeRgb: '7,8,11',
      tip1: '#1a1d27',
      tip2: '#0a0b10',
      voidRgb: '7,8,11',
      codexRgb: '3,4,6',
      splashGlow: '#141a2a',
      brandSpacing: '.07em',
      selRing: '#dcc58e',
      hoverRing: '#ece4d4',
      /* an original mark: three arcs from one point, not a religious symbol */
      sigil:
        '<g fill="none" stroke="url(#cg)" stroke-width="2.2" stroke-linecap="round"><path d="M24 40 C24 30 24 20 24 8"/><path d="M24 40 C24 30 14 24 10 14"/><path d="M24 40 C24 30 34 24 38 14"/><circle cx="24" cy="40" r="3"/></g>',
    },
    spoilers: { mode: 'single' },
    books: { 1: { n: 'I', title: 'Overview' } },
    ui: {
      galaxyButton: 'Space',
      homeButton: 'Earth',
      noteLabels: { christianity: 'Christianity', islam: 'Islam', judaism: 'Judaism' },
      refPlacesTitle: 'Places without a map point',
      refPlacesNote:
        'Most places in this atlas have no sourced coordinates yet. They are listed as reference cards instead of guessed pins.',
    },
    intro: {
      text: 'Explore how religious communities developed, divided, interacted and spread, with traditions and historical evidence clearly distinguished. Map markers are heritage references, not exact event sites. Layers are filters, not population categories: one person or community can belong to more than one.',
      legend: [
        ['Markers', 'Ten heritage references (UNESCO), not exact event sites'],
        ['Codex', 'Places without a map point, as reference cards'],
        ['Layers', 'Judaism, Christianity, Islam and Encounters: filters that may overlap'],
      ],
    },
    layers: LAYERS,
    start: { world: 'earth', view: 'surface', site: 'jerusalem' },
    groups: [{ id: 'home', name: 'Earth' }],
    worlds: [
      {
        id: 'earth',
        name: 'Earth',
        group: 'home',
        books: [1],
        major: true,
        map: [0, 27.14],
        status: 'Ten heritage references',
        blurb: 'Ten heritage reference markers. Every other place in the research is a reference card without coordinates.',
        refPlaces: 'places',
        hero: 'jerusalem',
        gfx: { type: 'terran', base: 'earth', sea: 0.5, clouds: 0.25 },
        sites: SITES,
      },
    ],
    timeline: {
      min: -800,
      max: 2030,
      step: 10,
      style: 'BCE/CE',
      label: 'Years',
      eras: [{ name: 'Second Temple era (c. 515 BCE – 70 CE)', from: -515, to: 70 }],
    },
    tree: {
      title: 'Family tree',
      button: 'Tree',
      view: 'relationship',
      intro:
        'Traditions, movements and institutions, with typed ties: what the sources say and no more. Most have a century, a period or no single founding date; those are shown as windows or open rings, never as invented years. A tie is not a ranking.',
      nodes: JUD_NODES,
      links: JUD_LINKS,
    },
    events: JUD_EVENTS,
    codex: [
      { id: 'places', title: 'Places without a map point', list: PLACES },
      { id: 'journeys', title: 'Journeys and spread', list: JUD_JOURNEYS },
      { id: 'people', title: 'People', list: JUD_PEOPLE },
    ],
  };
})();

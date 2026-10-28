/* =====================================================================================================
   RELIGIOUS TRADITIONS: ORIGINS AND CONNECTIONS — Track A data pack (PACK_FORMAT §13.1, §20, §21).
   BUILD CHECKPOINT 2 (draft, not reviewed): meta, notice, theme, layers, the ten map anchors and the
   reference-only place cards. Tradition nodes, events and journeys follow in checkpoints 3–6.

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
    events: [],
    codex: [{ id: 'places', title: 'Places without a map point', list: PLACES }],
  };
})();

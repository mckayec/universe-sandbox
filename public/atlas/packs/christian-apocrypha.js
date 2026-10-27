/* =====================================================================================================
   BIBLICAL APOCRYPHA AND RELATED TRADITIONS: Track A data pack (schema: docs/atlas/PACK_FORMAT.md §6, §20).
   BUILD CHECKPOINT 2 (draft, not reviewed): works, layers, the five reused Earth anchors, coverage notes, and
   Tobit and Judith (slots 1–2). The remaining works are added layer by layer in later checkpoints.

   Research: docs/universes/packs/christian-apocrypha/ at research revision 4dc7f44 (owner-approved narrowed
   handoff): research.md, integration-contract.md, work-gates.csv, geography-reuse.md, the five
   *-integration.csv registries and record-work-index.csv. Builder review: research-review.md.

   Rules followed here (integration-contract.md, geography-reuse.md):
   * Books are the 39 work-family slots of work-gates.csv, in its browsing order (not a canon or a
     chronology). Gating is cumulative: choosing a work shows it and every earlier slot.
   * Only the five anchors in geography-reuse.md are pins; each marks a heritage property or gazetteer
     point, never the site of a narrated episode. Every other place is a text record (codex).
   * Visionary and otherworldly settings get no coordinates.
   * Expanded-OT rows XO-U01–XO-U11 (Meqabyan, translation fidelity unresolved) are excluded entirely;
     tests/atlas-apocrypha.test.ts checks this.
   * Narrated dates are shown as text; no numeric timeline.
   ===================================================================================================== */
(window.ATLAS_PACKS = window.ATLAS_PACKS || {})['christian-apocrypha'] = (function () {
  /* layers = the research's browsing groups (research.md §2); they are not religious truth categories */
  const LAYERS = [
    { id: 'dc', name: 'Deuterocanonical core', short: 'Deuterocanon', c: '#d9b45a' },
    { id: 'xot', name: 'Expanded Old Testament collections', short: 'Expanded OT', c: '#c9785a' },
    { id: 'rp', name: 'Related Isaiah and Baruch traditions', short: 'Isaiah/Baruch', c: '#8cc49a' },
    { id: 'nta', name: 'Gospels, acts and apocalypses', short: 'NT-related', c: '#7fa8e8' },
    { id: 'pm', name: 'Pilate and Marian traditions', short: 'Pilate/Mary', c: '#c49ad9' },
  ];
  const LAYER_BY = {};
  LAYERS.forEach((l) => (LAYER_BY[l.id] = l));

  /* work-gates.csv: [slot, short label, title, layer]. Slot = `first` value in the registries. */
  const WORKS = [
    [1, 'Tob', 'Tobit', 'dc'],
    [2, 'Jdt', 'Judith', 'dc'],
    [3, 'Wis', 'Wisdom', 'dc'],
    [4, 'Sir', 'Sirach', 'dc'],
    [5, 'Bar', 'Baruch', 'dc'],
    [6, '1 Mc', '1 Maccabees', 'dc'],
    [7, '2 Mc', '2 Maccabees', 'dc'],
    [8, 'Add Est', 'Esther additions', 'dc'],
    [9, 'Add Dan', 'Daniel additions', 'dc'],
    [10, '1 Esd', '1 Esdras (English)', 'xot'],
    [11, '2 Esd', '2 Esdras (English composite)', 'xot'],
    [12, '3 Mc', '3 Maccabees', 'xot'],
    [13, '4 Mc', '4 Maccabees', 'xot'],
    [14, 'Pr Man', 'Prayer of Manasseh', 'xot'],
    [15, 'Ps 151', 'Psalm 151', 'xot'],
    [16, '1 En', '1 Enoch', 'xot'],
    [17, 'Jub', 'Jubilees', 'xot'],
    [18, '1 Meq', '1 Meqabyan (coverage incomplete)', 'xot'],
    [19, '2 Meq', '2 Meqabyan (coverage incomplete)', 'xot'],
    [20, '3 Meq', '3 Meqabyan (coverage incomplete)', 'xot'],
    [21, 'Asc Isa', 'Ascension of Isaiah', 'rp'],
    [22, '4 Bar', '4 Baruch', 'rp'],
    [23, 'Prot Jas', 'Protevangelium of James', 'nta'],
    [24, 'Inf Thom', 'Infancy Gospel of Thomas', 'nta'],
    [25, 'G Pet', 'Gospel of Peter', 'nta'],
    [26, 'G Thom', 'Gospel of Thomas', 'nta'],
    [27, 'G Mary', 'Gospel of Mary', 'nta'],
    [28, 'G Jud', 'Gospel of Judas', 'nta'],
    [29, 'A Paul', 'Acts of Paul, including Thecla', 'nta'],
    [30, 'A Pet', 'Acts of Peter', 'nta'],
    [31, 'A John', 'Acts of John', 'nta'],
    [32, 'A And', 'Acts of Andrew', 'nta'],
    [33, 'A Thom', 'Acts of Thomas', 'nta'],
    [34, 'Apoc Pet', 'Apocalypse of Peter', 'nta'],
    [35, 'Apoc Paul', 'Apocalypse of Paul', 'nta'],
    [36, 'A Pil', 'Acts of Pilate, Greek form I', 'pm'],
    [37, 'Desc', 'Descent into Hades, Latin form I', 'pm'],
    [38, 'Dorm', 'Dormition, Greek Pseudo-John', 'pm'],
    [39, 'Ps-Mt', 'Pseudo-Matthew (expanded Walker witness)', 'pm'],
  ];

  const BOOKS = {};
  WORKS.forEach(([slot, n, title, layer]) => {
    BOOKS[slot] = { n, title, c: LAYER_BY[layer].c, group: LAYER_BY[layer].name };
  });
  const ALL_SLOTS = WORKS.map((w) => w[0]);

  /* Chronicle entry: one per research record (id in the comment), paraphrased, with its passage as the side
     note. Events attach to Earth; `site` only where the scene is at one of the five anchors. */
  function ev(id, book, layer, title, text, ref, site) {
    const e = { id, book, world: 'earth', layers: [layer], title, text, side: ref };
    if (site) e.site = site;
    return e;
  }
  /* reference entry for a place with no approved map anchor, or a person, scoped to one work */
  function ref(name, first, layer, desc, role) {
    const e = { name, first, books: [first], layers: [layer], desc };
    if (role) e.role = role;
    return e;
  }

  return {
    id: 'christian-apocrypha',
    meta: {
      title: 'Biblical Apocrypha and Related Traditions',
      series: 'Biblical Apocrypha and Related Traditions',
      author: 'Deuterocanonical books, expanded Old Testament collections, early Christian gospels, acts and apocalypses',
      tagline: 'Additional <b>biblical and early Christian</b> writings',
      splash:
        'Explore additional biblical and early Christian writings through their distinct texts, settings and reception traditions.',
      credits: '',
      notice:
        'Independent educational research. Ancient texts, modern translations and manuscript images have different rights and provenance. Short original summaries identify the editions consulted.',
      srcnote:
        'Map pins mark modern heritage properties or gazetteer points. They locate a city, not the spot of a narrated event, and do not verify any story. Places without an approved location, and visionary or otherworldly settings, are listed in the reference panel instead of being pinned.',
      canvasLabel: 'A globe of places named in biblical apocrypha and related early Christian writings',
      sources: [
        'UNESCO World Heritage List: Old City of Jerusalem (148); Babylon (278); Birthplace of Jesus, Bethlehem (1433); Historic Centre of Rome (91)',
        'Pleiades gazetteer (pleiades.stoa.org): Nazareth 678299, E. M. Meyers, J. P. Brown and contributors (CC BY 3.0)',
        'Editions consulted are named on each entry; see the research files for the full source registers.',
      ],
    },
    theme: {
      void: '#06080e',
      deep: '#0c1120',
      panel: 'rgba(12,17,32,.9)',
      accent: '#b8a06a',
      accentHi: '#ecdcae',
      accentLo: '#4c4128',
      chrome: '#efe6cf',
      ember: '#d9b45a',
      text: '#e6e0d0',
      muted: '#a59d88',
      faint: '#6c6656',
      line: 'rgba(236,220,174,.16)',
      lineStrong: 'rgba(236,220,174,.46)',
      panelRgb: '16,22,40',
      panelRgb2: '7,10,18',
      btnRgb: '12,17,32',
      shadeRgb: '6,8,14',
      voidRgb: '6,8,14',
      codexRgb: '4,6,10',
      splashGlow: '#132044',
      selRing: '#ecdcae',
      sigil:
        '<g fill="none" stroke="url(#cg)" stroke-width="1.6"><path d="M13 9h18l6 6v24H13z"/><path d="M31 9v6h6"/><path d="M18 20h14M18 25h14M18 30h9"/><circle cx="24" cy="24" r="21" stroke-width=".8" opacity=".5"/></g>',
    },
    spoilers: { mode: 'cumulative' },
    books: BOOKS,
    layers: LAYERS,
    start: { world: 'earth', view: 'surface', site: 'jerusalem' },
    ui: {
      galaxyButton: 'Space',
      homeButton: 'Earth',
      indexTitle: 'Earth',
      bookLabel: 'Up to',
      booksAria: 'Show works up to',
      allTitle: 'All works',
      pickerAll: 'All works',
      pickerPrev: 'Previous work',
      pickerNext: 'Next work',
      chronTitle: 'NARRATIVES',
      codexTitle: 'REFERENCE',
      noteLabels: {
        text: 'The text',
        tradition: 'Reception',
        scholarship: 'Scholarship',
        location: 'Location evidence',
      },
      modernLabel: 'Marker',
      routeNote: 'Order of stops in the text; not a recovered road.',
    },
    intro: {
      text: 'Additional biblical and early Christian writings, in 39 works grouped five ways. Choose a work to see it and the works listed before it; the order is for browsing, not a canon or a date order. Most settings in these texts cannot be located, so they are listed in the reference panel; the few pins mark modern heritage properties, not the scenes of the stories.',
      legend: [
        ['Layers', 'Browsing groups; all on = everything'],
        ['Pins', 'Modern anchors, not exact event sites'],
        ['Reference', 'Places, people and visionary settings without pins'],
      ],
    },
    groups: [{ id: 'earth', name: 'Earth' }],
    worlds: [
      {
        id: 'earth',
        name: 'Earth',
        group: 'earth',
        books: ALL_SLOTS,
        major: true,
        map: [0, 27.14],
        blurb: 'Places named in these writings that have a cited modern location.',
        distText: 'Present-day Earth with modern place markers',
        gfx: { type: 'terran', base: 'earth', sea: 0.5, clouds: 0.25 },
        hero: 'jerusalem',
        /* geography-reuse.md. `books` = the earliest slot whose registry rows name the place
           (record-work-index.csv); fuller badge lists arrive with each layer's content. */
        sites: [
          {
            /* JU21 at e1082e3; UNESCO 148. dc-ref-jerusalem (slot 1). */
            id: 'jerusalem',
            major: true,
            name: 'Jerusalem',
            lat: 31.777778,
            lon: 35.231667,
            books: [1, 2],
            modern: 'Old City of Jerusalem (UNESCO World Heritage property)',
            desc: 'The marker locates Jerusalem’s Old City. It does not mark any tribunal, Temple chamber, tomb or execution site named in these texts.',
          },
          {
            /* JU22 at e1082e3; UNESCO 278. dc-ref-babylon (slot 5). City only, not Babylonia. */
            id: 'babylon',
            name: 'Babylon',
            lat: 32.541969,
            lon: 44.420833,
            books: [5],
            modern: 'Babylon (UNESCO World Heritage property)',
            desc: 'The marker locates the ancient city of Babylon, not the wider region of Babylonia or any exile route.',
          },
          {
            /* Abrahamic gazetteer at e1082e3; UNESCO 1433. Protevangelium of James (slot 23). */
            id: 'bethlehem',
            name: 'Bethlehem',
            lat: 31.704353,
            lon: 35.2075,
            books: [23],
            modern: 'Nativity heritage property, Bethlehem (UNESCO)',
            desc: 'The marker locates the Nativity heritage property in Bethlehem. It is not evidence for any particular narrated cave.',
          },
          {
            /* Abrahamic gazetteer at e1082e3; UNESCO 91 component 001. dc-ref-rome (slot 6). */
            id: 'rome',
            name: 'Rome',
            lat: 41.890222,
            lon: 12.492306,
            books: [6],
            modern: 'Historic Centre of Rome (UNESCO component point)',
            desc: 'The marker locates a component of Rome’s historic centre, not the site of any martyrdom told in these texts.',
          },
          {
            /* LDS gazetteer at 689b495; Pleiades 678299 (CC BY 3.0). Pseudo-Matthew PMP11 (slot 39).
               Not bound to the unnamed village of the Infancy Gospel of Thomas (nta-it-scene). */
            id: 'nazareth',
            name: 'Nazareth',
            lat: 32.701029,
            lon: 35.300148,
            books: [39],
            modern: 'Nazareth settlement point (Pleiades 678299)',
            desc: 'The marker is a representative point for the settlement, not a house or the site of any childhood miracle.',
          },
        ],
      },
    ],
    events: [
      /* ---- Tobit (slot 1). deuterocanonical-integration.csv dc-tob-01-card … dc-tob-14-card;
         editions per deuterocanonical-sources.md (NABRE, with RV where noted). ---- */
      ev('tob-01', 1, 'dc', 'Tobit in exile at Nineveh', 'Tobit, of the tribe of Naphtali, recalls being deported from Thisbe to Nineveh, and his earlier pilgrimages to Jerusalem. While trading in Media he left ten talents in trust with Gabael at Rages.', 'Tobit 1'),
      ev('tob-02', 1, 'dc', 'A burial, and Tobit’s blindness', 'A Pentecost meal is interrupted when Tobit goes to bury a murdered fellow Israelite. Soon after, bird droppings blind him; Anna supports the household with her spinning, and a gift of a goat sets off a quarrel between them.', 'Tobit 2'),
      ev('tob-03', 1, 'dc', 'Two prayers on the same day', 'Tobit prays in his distress, and so does Sarah, daughter of Raguel, at Ecbatana in Media, whose seven husbands have each been killed by the demon Asmodeus. The angel Raphael is sent to heal them both.', 'Tobit 3'),
      ev('tob-04', 1, 'dc', 'Tobit’s instructions to his son', 'Tobit tells Tobiah how to live: bury his parents, give alms, marry within his kin, pay wages promptly and seek good counsel. He reminds him of the money left with Gabael at Rages.', 'Tobit 4'),
      ev('tob-05', 1, 'dc', 'A guide called Azarias', 'Tobiah hires a guide who calls himself Azarias, son of Ananias; the reader knows he is Raphael. They set out with a dog while Anna fears for her son.', 'Tobit 5'),
      ev('tob-06', 1, 'dc', 'The fish in the Tigris', 'Camped by the Tigris, Tobiah catches a fish and, on Raphael’s advice, keeps some of its organs. Nearing Ecbatana, Raphael urges him to marry Sarah and to pray against the demon.', 'Tobit 6'),
      ev('tob-07', 1, 'dc', 'Welcome at Raguel’s house', 'At Ecbatana, Raguel and Edna receive Tobiah, a kinsman. After hearing of Sarah’s seven earlier husbands, Tobiah marries her with her parents’ consent.', 'Tobit 7'),
      ev('tob-08', 1, 'dc', 'The demon driven away', 'Smoke from the fish drives Asmodeus off to upper Egypt, where Raphael binds him. The couple pray, the grave Raguel had dug in case is filled in, and a fourteen-day wedding feast begins.', 'Tobit 8'),
      ev('tob-09', 1, 'dc', 'The money from Rages', 'Raphael travels with four servants and two camels to Rages, collects the sealed money from Gabael and brings him back to the wedding.', 'Tobit 9'),
      ev('tob-10', 1, 'dc', 'Leaving Ecbatana', 'Tobit and Anna wait anxiously. After the feast, Tobiah and Sarah set out from Raguel and Edna with property and blessings.', 'Tobit 10'),
      ev('tob-11', 1, 'dc', 'Tobit sees again', 'Near Kaserin, opposite Nineveh, Tobiah and Raphael go ahead of Sarah. The fish’s gall restores Tobit’s sight; Sarah is welcomed at the gate of Nineveh, and Ahiqar and his nephew Nadin join a seven-day feast.', 'Tobit 11'),
      ev('tob-12', 1, 'dc', 'Raphael reveals himself', 'Offered half the money as wages, the guide explains his mission, says he is one of the seven angels, and ascends.', 'Tobit 12'),
      ev('tob-13', 1, 'dc', 'Tobit’s hymn', 'Tobit’s song of praise speaks of scattering and regathering, and of an ideal Jerusalem built with precious stones. The book presents this as praise, not a description of a real city plan.', 'Tobit 13'),
      ev('tob-14', 1, 'dc', 'The last years', 'In this edition Tobit dies at 112 and urges his family to move to Media. After burying his mother, Tobiah settles at Ecbatana, cares for Raguel and Edna, and before his own death hears of Nineveh’s fall.', 'Tobit 14'),

      /* ---- Judith (slot 2). dc-jdt-01-card … dc-jdt-16-card. Bethulia is unidentified: no pin. ---- */
      ev('jdt-01', 2, 'dc', 'Nebuchadnezzar against Arphaxad', 'The book portrays Nebuchadnezzar ruling the Assyrians from Nineveh and fighting Arphaxad of Ecbatana. He captures Ecbatana and summons peoples from Persia to Egypt and Ethiopia to his war.', 'Judith 1'),
      ev('jdt-02', 2, 'dc', 'Holofernes sent west', 'Nebuchadnezzar commissions his general Holofernes to punish the lands that refused. The campaign sweeps from Nineveh through Cilicia, Mesopotamia and Arabia to Damascus, and terror reaches the coastal cities.', 'Judith 2'),
      ev('jdt-03', 2, 'dc', 'Submission is not enough', 'The coastal peoples submit, but Holofernes still destroys their shrines and demands worship of Nebuchadnezzar. He camps for a month between Geba and Scythopolis.', 'Judith 3'),
      ev('jdt-04', 2, 'dc', 'Judea prepares', 'Recently returned from exile, the Judeans fortify. The high priest Joakim and the council in Jerusalem tell Bethulia and Betomesthaim to hold the mountain passes, and the people fast at the Temple.', 'Judith 4', 'jerusalem'),
      ev('jdt-05', 2, 'dc', 'Achior’s warning', 'The Ammonite Achior tells Holofernes the history of Israel from Abraham’s ancestors to the return from exile, and warns Holofernes against attacking them.', 'Judith 5'),
      ev('jdt-06', 2, 'dc', 'Achior handed over', 'Holofernes has Achior bound and left at the foot of Bethulia’s hill; the townspeople bring him in, and Uzziah, one of the town’s leaders, takes him into his house.', 'Judith 6'),
      ev('jdt-07', 2, 'dc', 'The siege of Bethulia', 'The army seizes the springs below Bethulia. After thirty-four days without water the people despair, and Uzziah promises to surrender if no help comes in five days.', 'Judith 7'),
      ev('jdt-08', 2, 'dc', 'Judith', 'Judith, daughter of Merari, has been a widow for over three years since Manasseh died at the barley harvest. She rebukes the elders for setting God a deadline and says she will act, with her maid.', 'Judith 8'),
      ev('jdt-09', 2, 'dc', 'Judith’s prayer', 'At the hour of the evening incense, Judith prays for the Temple and for success in deceiving the enemy, recalling her ancestor Simeon at Shechem.', 'Judith 9'),
      ev('jdt-10', 2, 'dc', 'Into the camp', 'Judith and her maid pass out through Bethulia’s gate, go down into the valley, meet an Assyrian patrol and are taken to Holofernes’ tent.', 'Judith 10'),
      ev('jdt-11', 2, 'dc', 'A false story', 'Judith tells Holofernes a deceptive story that her people are about to break their food laws, and promises to lead him through Judea to Jerusalem.', 'Judith 11'),
      ev('jdt-12', 2, 'dc', 'The banquet', 'For three nights Judith goes out to the spring in the valley to bathe and pray. On the fourth day Bagoas arranges a banquet, and Holofernes drinks heavily.', 'Judith 12'),
      ev('jdt-13', 2, 'dc', 'Holofernes’ death', 'Judith beheads the sleeping Holofernes; her maid carries the head out in their food bag. They return to Bethulia and show it at the gate.', 'Judith 13'),
      ev('jdt-14', 2, 'dc', 'Achior joins Israel; the camp discovers', 'Achior recognizes the head and is circumcised, joining Israel. In the camp, Bagoas finds Holofernes’ headless body and Judith gone.', 'Judith 14'),
      ev('jdt-15', 2, 'dc', 'The rout', 'The army flees and the Israelites pursue it beyond Damascus. Joakim and the council come from Jerusalem to honor Judith; there are thirty days of plunder and a public dance.', 'Judith 15'),
      ev('jdt-16', 2, 'dc', 'Judith’s hymn and old age', 'Judith leads a hymn of victory, and the people celebrate in Jerusalem for three months. Back in Bethulia she frees her maid, dies at 105 and is buried with Manasseh.', 'Judith 16', 'jerusalem'),
    ],
    codex: [
      {
        id: 'coverage',
        title: 'About this collection',
        list: [
          {
            name: 'What is included',
            first: 1,
            desc: 'Selected editions of 39 works, grouped for browsing: the deuterocanonical core, expanded Old Testament collections, related Isaiah and Baruch traditions, early Christian gospels, acts and apocalypses, and Pilate and Marian traditions. It is not every Christian apocryphon, any one community’s complete Bible, or a comparison of every manuscript.',
          },
          {
            name: 'Meqabyan (Ethiopian books of Maccabees)',
            first: 18,
            desc: 'Coverage incomplete. The available English translation could not be matched to an identified base edition, so no narrative content from these three books is shown. They are distinct from the Greek books of Maccabees.',
          },
          {
            name: 'Text, reception and scholarship',
            first: 1,
            desc: 'Entries keep apart what a text says, which communities received it and how, what scholars conclude, and what the location evidence shows. A community’s acceptance of a book does not prove a modern site, and a scholarly date does not settle religious questions.',
          },
        ],
      },
      {
        id: 'places',
        title: 'Places without a map pin',
        list: [
          /* deuterocanonical-integration.csv dc-ref-* rows; identities not pinned (geography-reuse.md). */
          ref('Nineveh', 1, 'dc', 'Tobit: the city where Tobit lives in exile and where the story begins and ends. Judith: Nebuchadnezzar’s capital in that book’s telling.'),
          ref('Ecbatana, in Media', 1, 'dc', 'Tobit: the home of Raguel, Edna and Sarah, where Tobiah marries Sarah and later settles. Judith: the city of Arphaxad, captured by Nebuchadnezzar.'),
          ref('Rages, in Media', 1, 'dc', 'Tobit: where Gabael keeps the money Tobit left in trust.'),
          ref('Thisbe', 1, 'dc', 'Tobit: Tobit’s home in Naphtali before his deportation.'),
          ref('The Tigris', 1, 'dc', 'Tobit: the river where Tobiah catches the fish on the journey out.'),
          ref('Kaserin', 1, 'dc', 'Tobit: a place opposite Nineveh where Tobiah and Raphael go ahead of Sarah on the way home.'),
          ref('Upper Egypt', 1, 'dc', 'Tobit: where the demon Asmodeus flees and is bound. A destination in the story, not a mapped event.'),
          ref('Bethulia', 2, 'dc', 'Judith: Judith’s town, besieged by Holofernes. Its location is not identified, so it has no pin.'),
          ref('Betomesthaim', 2, 'dc', 'Judith: a town told, with Bethulia, to hold the mountain passes.'),
        ],
      },
      {
        id: 'journeys',
        title: 'Journeys in the texts',
        list: [
          /* dc-route-* rows: ordered stops as stated; no map lines (only Jerusalem is pinned among them). */
          ref('Tobit’s exile', 1, 'dc', 'Thisbe to Nineveh, by deportation. The text names no stops between.'),
          ref('Tobiah’s journey out', 1, 'dc', 'Nineveh, the Tigris, then Ecbatana, with Raphael and the dog. One edition also names Rages here; the difference is kept, and the order is not a road.'),
          ref('Raphael’s errand', 1, 'dc', 'Ecbatana to Rages and back, to collect the money and bring Gabael to the wedding. Tobiah stays behind.'),
          ref('The homecoming', 1, 'dc', 'Ecbatana, Kaserin, then Nineveh: Tobiah and Raphael go ahead of Sarah.'),
          ref('Tobiah resettles', 1, 'dc', 'Nineveh to Ecbatana, after the burial of his parents.'),
          ref('Judith’s mission', 2, 'dc', 'Bethulia, down into the valley, to the camp of Holofernes, and back the same way with the head.'),
          ref('Achior handed over', 2, 'dc', 'From the Assyrian camp to the foot of Bethulia’s hill, then into the town.'),
          ref('Celebration at Jerusalem', 2, 'dc', 'Judith and the people go up to Jerusalem to give thanks, and Judith returns to Bethulia.'),
        ],
      },
      {
        id: 'people',
        title: 'People',
        list: [
          /* person-reference rows; each is scoped to its own work (integration-contract nonmerge rules). */
          ref('Tobit', 1, 'dc', 'An Israelite of Naphtali in exile at Nineveh, known for burying the dead; blinded, then healed.', 'Tobit'),
          ref('Anna', 1, 'dc', 'Tobit’s wife, who supports the household while he is blind.', 'Tobit'),
          ref('Tobiah (Tobias)', 1, 'dc', 'Son of Tobit and Anna, who travels to Media and marries Sarah.', 'Tobit'),
          ref('Raphael (“Azarias”)', 1, 'dc', 'An angel who guides Tobiah under the name Azarias and reveals himself at the end.', 'Tobit'),
          ref('Sarah', 1, 'dc', 'Daughter of Raguel and Edna, whose seven husbands had died on their wedding nights.', 'Tobit'),
          ref('Raguel and Edna', 1, 'dc', 'Sarah’s parents at Ecbatana; Raguel is Tobit’s kinsman.', 'Tobit'),
          ref('Gabael', 1, 'dc', 'The man at Rages who keeps Tobit’s money in trust.', 'Tobit'),
          ref('Ahiqar and Nadin', 1, 'dc', 'Ahiqar (Achiacharus), Tobit’s nephew, supports him while he is blind; Nadin is Ahiqar’s nephew, and their story is recalled as an example at the end of the book.', 'Tobit'),
          ref('Judith', 2, 'dc', 'A devout widow of Bethulia, daughter of Merari, who goes into the enemy camp and kills Holofernes.', 'Judith'),
          ref('Holofernes', 2, 'dc', 'Nebuchadnezzar’s general, leader of the campaign against the west.', 'Judith'),
          ref('Achior', 2, 'dc', 'An Ammonite who warns Holofernes and later joins Israel.', 'Judith'),
          ref('Uzziah', 2, 'dc', 'A leader of Bethulia who shelters Achior and sets the five-day deadline.', 'Judith'),
          ref('Bagoas', 2, 'dc', 'A member of Holofernes’ household who arranges the banquet and discovers his body.', 'Judith'),
          ref('Judith’s maid', 2, 'dc', 'Unnamed in the text; she goes with Judith into the camp and is freed at the end.', 'Judith'),
        ],
      },
    ],
  };
})();

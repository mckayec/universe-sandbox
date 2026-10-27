/* =====================================================================================================
   BIBLICAL APOCRYPHA AND RELATED TRADITIONS: Track A data pack (schema: docs/atlas/PACK_FORMAT.md §6, §20).
   BUILD CHECKPOINT 14 (draft, not reviewed): works, layers, the five reused Earth anchors, coverage notes, and
   the deuterocanonical core: Tobit, Judith, Wisdom, Sirach, Baruch, 1–2 Maccabees and the Esther and Daniel additions (slots 1–9);
   expanded OT works 1–2 Esdras, 3–4 Maccabees, Prayer of Manasseh and Psalm 151 (slots 10–15); 1 Enoch and Jubilees (16–17); Ascension of Isaiah and 4 Baruch (21–22); the NT-related gospels (23–28); the Acts of Paul, Peter, John, Andrew and Thomas and the Apocalypses of Peter and Paul (29–35).
   The remaining works are added layer by layer in later checkpoints.

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
  /* Later works' mentions of a place or person whose entry is written with an earlier work, kept here by work
     so each work's additions stay together: { entry name: [[slot, text], …] }. Merged into `more` by ref(). */
  const LATER = {};
  function later(slot, entries) {
    Object.keys(entries).forEach((name) => (LATER[name] = (LATER[name] || []).concat([[slot, entries[name]]])));
  }
  /* 2 Maccabees (slot 7) mentions of places and people first written up with earlier works */
  later(7, {
    'Ecbatana, in Media': 'Second Maccabees: where Antiochus hears of his defeats before his last journey (ch. 9).',
    Sparta: 'Second Maccabees: the deposed high priest Jason flees toward it (ch. 5).',
    Ptolemais: 'Second Maccabees: Hegemonides is made governor from Ptolemais to the Gerrenians, and opposition there is calmed (ch. 13).',
    Joppa: 'Second Maccabees: Antiochus visits it (ch. 4); after its people drown Jews, Judas burns its harbour (ch. 12).',
    Ephron: 'Second Maccabees: a place of fighting in Judas’s campaign of chapter 12.',
    Gazara: 'Second Maccabees: taken after a siege, and Timotheus killed there (ch. 10).',
    Marisa: 'Second Maccabees: where Gorgias escapes after the battle (ch. 12).',
    Cyrene: 'Second Maccabees: home of Jason, the author whose five books the epitomator condenses (ch. 2). An author’s label, not a journey.',
    Modin: 'Second Maccabees: Judas attacks by night near it (ch. 13).',
    Bethsura: 'Second Maccabees: resupplied during Eupator’s campaign (ch. 13).',
    Antioch: 'Second Maccabees: the royal city in chapters 4, 5, 8, 11, 13 and 14; the sanctuary of Daphne is near it (ch. 4).',
    Idumaea: 'Second Maccabees: the war on its strongholds (ch. 10), and named again in chapter 12.',
    Cyprus: 'Second Maccabees: Ptolemy Macron had held office there (ch. 10).',
  });

  /* 4 Baruch (slot 22) mentions of places first written up with earlier works (RPP16, RPP17) */
  later(22, {
    'The Jordan': '4 Baruch: the returning exiles come to the Jordan before going up to Jerusalem (8:1–6). The crossing point is not given.',
    Samaria: '4 Baruch: the story says families turned away from Jerusalem and Babylon founded Samaria (8:7–12). The story’s account, not the history of the Samaritans.',
  });

  /* NT-related gospel mentions (slots 26, 28) of Judea, whose entry is written with Judith */
  later(26, { 'Judea (Judaea)': 'Gospel of Thomas: saying 60 mentions a Samaritan going into Judea. No starting point is given.' });
  later(28, { 'Judea (Judaea)': 'Gospel of Judas: the frame sets the conversations in Judea before Passover (p. 33).' });

  /* Acts of Peter (slot 30) mention of Judea, whose entry is written with Judith */
  later(30, { 'Judea (Judaea)': 'Acts of Peter: Peter recalls an earlier episode there with Eubula (XVII). A memory, not a leg of his journey to Rome.' });

  /* reference entry for a place with no approved map anchor, or a person, scoped to one work */
  function ref(name, first, layer, desc, role, more) {
    const e = { name, first, books: [first], layers: [layer], desc };
    if (role) e.role = role;
    more = (more || []).concat(LATER[name] || []).sort((a, b) => a[0] - b[0]);
    if (!more.length) more = undefined;
    /* later works' mentions: [[slot, text], …], each shown only once that work is chosen (PACK_FORMAT §13) */
    if (more) {
      e.more = more;
      more.forEach(([b]) => e.books.indexOf(b) < 0 && e.books.push(b));
    }
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
            books: [1, 2, 4, 5, 6, 7, 8, 9, 10, 12, 21, 22, 23, 24, 25, 30, 31, 33],
            modern: 'Old City of Jerusalem (UNESCO World Heritage property)',
            desc: 'The marker locates Jerusalem’s Old City. It does not mark any tribunal, Temple chamber, tomb or execution site named in these texts.',
          },
          {
            /* JU22 at e1082e3; UNESCO 278. dc-ref-babylon (slot 5). City only, not Babylonia. */
            id: 'babylon',
            name: 'Babylon',
            lat: 32.541969,
            lon: 44.420833,
            books: [5, 6, 7, 8, 9, 10, 11, 22],
            modern: 'Babylon (UNESCO World Heritage property)',
            desc: 'The marker locates the ancient city of Babylon, not the wider region of Babylonia or any exile route.',
          },
          {
            /* Abrahamic gazetteer at e1082e3; UNESCO 1433. Ascension of Isaiah RPP02 (slot 21); Protevangelium of James (slot 23). */
            id: 'bethlehem',
            name: 'Bethlehem',
            lat: 31.704353,
            lon: 35.2075,
            books: [21, 23],
            modern: 'Nativity heritage property, Bethlehem (UNESCO)',
            desc: 'The marker locates the Nativity heritage property in Bethlehem. It is not evidence for any particular narrated cave.',
          },
          {
            /* Abrahamic gazetteer at e1082e3; UNESCO 91 component 001. dc-ref-rome (slot 6). */
            id: 'rome',
            name: 'Rome',
            lat: 41.890222,
            lon: 12.492306,
            books: [6, 29, 30],
            modern: 'Historic Centre of Rome (UNESCO component point)',
            desc: 'The marker locates a component of Rome’s historic centre, not the site of any martyrdom told in these texts.',
          },
          {
            /* LDS gazetteer at 689b495; Pleiades 678299 (CC BY 3.0). Ascension of Isaiah RPP10 (slot 21); Pseudo-Matthew PMP11 (slot 39).
               Not bound to the unnamed village of the Infancy Gospel of Thomas (nta-it-scene). */
            id: 'nazareth',
            name: 'Nazareth',
            lat: 32.701029,
            lon: 35.300148,
            books: [21, 39],
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

      /* ---- Wisdom (slot 3). dc-wis-01-card … dc-wis-19-card (concept chapter cards). Chapters 1, 5, 10
         and 19 follow RV 1895 (the NABRE chapter page was unavailable); the rest NABRE. No places pinned. ---- */
      ev('wis-01', 3, 'dc', 'Righteousness, Wisdom and death', 'The opening chapter links Wisdom with righteousness and speaks of death. Hades here is an idea, not a named place.', 'Wisdom 1 (RV 1895)'),
      ev('wis-02', 3, 'dc', 'The plot against the righteous', 'The wicked reason among themselves and turn on a righteous person; the chapter ties the entry of death into the world to the devil (2:24). No victim or place is named.', 'Wisdom 2'),
      ev('wis-03', 3, 'dc', 'Suffering and immortality', 'The chapter sets the suffering of the righteous against their hoped-for immortality, and speaks of childlessness. Its reward in the temple is not a dated event.', 'Wisdom 3'),
      ev('wis-04', 3, 'dc', 'An early death', 'A righteous person who dies young is defended. The edition’s notes see allusions to Enoch and Lot in 4:10–15; the text names neither.', 'Wisdom 4'),
      ev('wis-05', 3, 'dc', 'Judgment', 'The judgment of the wicked and a cosmic battle. A trackless desert and a passing ship are images, not a journey.', 'Wisdom 5 (RV 1895)'),
      ev('wis-06', 3, 'dc', 'Kings, seek Wisdom', 'Rulers are admonished and urged to seek Wisdom. From 6:22 a royal speaker talks in the first person; the notes identify him as Solomon, though the text does not name him.', 'Wisdom 6'),
      ev('wis-07', 3, 'dc', 'The royal speaker', 'The speaker says he shares the mortal origin of everyone (a note identifies Adam at 7:1) and asks for Wisdom and knowledge. It is not a dated life of Solomon.', 'Wisdom 7'),
      ev('wis-08', 3, 'dc', 'Wisdom as bride and counselor', 'The speaker seeks Wisdom as a bride and a counselor. This is personification, not a marriage.', 'Wisdom 8'),
      ev('wis-09', 3, 'dc', 'A prayer for Wisdom', 'A prayer modeled on Solomon’s, according to the notes, asks for Wisdom and recalls a commission to build a Temple on God’s holy mountain, in God’s city. The city is not named.', 'Wisdom 9'),
      ev('wis-10', 3, 'dc', 'Wisdom in the ancestors’ stories', 'Wisdom’s protection is traced through unnamed figures: the first father, a brother-slayer, a flood survivor, a father tested over his child, an escape from five cities and a memorial of salt, a brother who fled, a righteous man who was sold, and an oppressed people led through the Red Sea. The names come from other books, not this chapter.', 'Wisdom 10 (RV 1895)'),
      ev('wis-11', 3, 'dc', 'Water from the rock', 'Desert travel and water from a rock are set against a river turned to blood and plagues of animals; the notes give the Nile, Horeb and Moses as background. From 11:17 the chapter turns to God’s mercy.', 'Wisdom 11'),
      ev('wis-12', 3, 'dc', 'The land’s earlier inhabitants', 'The book condemns the earlier inhabitants of the holy land and presents their displacement as judgment. This is the text’s own hostile portrait, not verified history. From 12:23 the punishment of Egypt resumes.', 'Wisdom 12'),
      ev('wis-13', 3, 'dc', 'Against nature worship and idols', 'Worship of natural things and the making of idols are criticized. The carpenter and his household shrine are hypothetical, not a site.', 'Wisdom 13'),
      ev('wis-14', 3, 'dc', 'The raft, and how idols began', 'A sea voyage and a raft recall the flood survivor (a note names Noah). The chapter then proposes how idol worship began and condemns it: polemic, not a neutral account of religion.', 'Wisdom 14'),
      ev('wis-15', 3, 'dc', 'The potter’s idols', 'God is contrasted with the idols potters make and with Israel’s enslaving enemies.', 'Wisdom 15'),
      ev('wis-16', 3, 'dc', 'Quail, the serpent sign and manna', 'Quail, healing through the serpent sign, hail and fire, and manna show God’s care for Israel, set against the plagues on Egypt. No camp is located.', 'Wisdom 16'),
      ev('wis-17', 3, 'dc', 'Darkness on the enslavers', 'Darkness and terror fall on the enslavers. The imagery of darkness and Hades is not a map.', 'Wisdom 17'),
      ev('wis-18', 3, 'dc', 'Light, Passover and a plague stopped', 'A pillar guides the people; a rescued infant, the death of the firstborn and the Passover are recalled; and a priest stops a plague in the wilderness. The notes identify Moses and Aaron. No date is given.', 'Wisdom 18'),
      ev('wis-19', 3, 'dc', 'Through the Red Sea', 'The pursuit and the crossing of the Red Sea; the plagues and the quail are recalled, and the treatment of strangers is compared with Sodom. No crossing route is mapped.', 'Wisdom 19 (RV 1895)'),

      /* ---- Sirach (slot 4). dc-sir-prologue-card, dc-sir-01-card … dc-sir-51-card (concept chapter cards).
         Editions per deuterocanonical-coverage.csv: RV 1895 for the prologue and chapters 4, 22, 34, 37, 38,
         44, 46 and 51, NABRE otherwise. Sirach 24 attaches to the Jerusalem anchor (Wisdom settles in Zion). ---- */
      ev('sir-prologue', 4, 'dc', 'The translator’s prologue', 'The grandson of Jesus (Yeshua), the book’s author, explains that he came to Egypt in the thirty-eighth year of King Euergetes and translated his grandfather’s Hebrew work into Greek, warning that a translation cannot match the original exactly. Where he set out from is not said.', 'Sirach, prologue (RV 1895)'),
      ev('sir-01', 4, 'dc', 'Wisdom comes from God', 'Wisdom has its origin with God; the chapter speaks of the fear of God and of discipline. A teaching, with no earthly setting.', 'Sirach 1'),
      ev('sir-02', 4, 'dc', 'Trust in trials', 'The reader is told to trust God in hardship and to return when they fail. No person or place is named.', 'Sirach 2'),
      ev('sir-03', 4, 'dc', 'Parents, humility and alms', 'Honoring father and mother, humility, a teachable spirit and almsgiving. Family duties in general, not a genealogy.', 'Sirach 3'),
      ev('sir-04', 4, 'dc', 'The poor, the orphan and Wisdom’s discipline', 'Care for the poor and the orphan; Wisdom is pictured testing and training those who seek her.', 'Sirach 4'),
      ev('sir-05', 4, 'dc', 'Presumption, wealth and speech', 'Warnings against presuming on mercy, trusting in wealth and careless speech. Its paths and winds are images, not an itinerary.', 'Sirach 5'),
      ev('sir-06', 4, 'dc', 'Friendship tested', 'True and false friends, and the pursuit of Wisdom. The house and doorway are teaching images.', 'Sirach 6'),
      ev('sir-07', 4, 'dc', 'Duties at home, to priests and to the needy', 'Counsel on household, priestly and charitable duties. Ophir appears only as a byword for the value of gold (7:18).', 'Sirach 7'),
      ev('sir-08', 4, 'dc', 'Caution with the powerful', 'Prudence toward the powerful and toward travel companions; the warning about the desert is general.', 'Sirach 8'),
      ev('sir-09', 4, 'dc', 'Counsel on women, friends and rulers', 'Counsel about women, friendship and rulers, written from the book’s own social standpoint. The city streets are unnamed.', 'Sirach 9'),
      ev('sir-10', 4, 'dc', 'Rulers and pride', 'Rulers, pride and social honor. Kingdoms change hands in general terms, not as dated events.', 'Sirach 10'),
      ev('sir-11', 4, 'dc', 'Reversals of fortune', 'Poverty, sudden changes of status, patience, and guests. No court or event is named.', 'Sirach 11'),
      ev('sir-12', 4, 'dc', 'Doing good, and enemies', 'When and to whom to give, and wariness toward enemies.', 'Sirach 12'),
      ev('sir-13', 4, 'dc', 'Rich and poor company', 'On keeping company with the rich and the poor; the animal comparisons are similes.', 'Sirach 13'),
      ev('sir-14', 4, 'dc', 'Wealth, death and the search for Wisdom', 'Wealth in the face of death, and the search for Wisdom. Sheol and Wisdom’s house are ideas, not places.', 'Sirach 14'),
      ev('sir-15', 4, 'dc', 'Wisdom as mother and bride; free choice', 'Wisdom meets the seeker like a mother and a young bride; people are free to choose. Personification, not a marriage or a route.', 'Sirach 15'),
      ev('sir-16', 4, 'dc', 'Judgment recalled', 'The warning recalls rebels, Lot’s neighbors, dispossessed peoples and the wilderness generation (16:6–10). The notes identify Sodom, Gomorrah and the Canaanites; those are interpretations.', 'Sirach 16'),
      ev('sir-17', 4, 'dc', 'Creation, covenant and repentance', 'Humanity’s creation, the covenant given to Israel, and the call to repent. The notes read 17:12–13 in light of Sinai; Sheol is an idea.', 'Sirach 17'),
      ev('sir-18', 4, 'dc', 'Mercy, giving and restraint', 'God’s mercy; giving with kindness, keeping vows and self-control.', 'Sirach 18'),
      ev('sir-19', 4, 'dc', 'Gossip and true wisdom', 'Gossip, correcting a neighbor, and the difference between cleverness and wisdom.', 'Sirach 19'),
      ev('sir-20', 4, 'dc', 'Speech and its paradoxes', 'Silence and speech, gains that are losses, lying and gifts.', 'Sirach 20'),
      ev('sir-21', 4, 'dc', 'Sin and folly', 'Sin and folly set against wisdom. The road to Sheol is a metaphor.', 'Sirach 21'),
      ev('sir-22', 4, 'dc', 'Idleness, shame and friendship', 'Laziness, children who bring shame, mourning and keeping friends.', 'Sirach 22 (RV 1895)'),
      ev('sir-23', 4, 'dc', 'A prayer against pride and lust', 'A prayer for help against pride and desire, followed by warnings about oaths and adultery. “Jacob’s inheritance” means the community, not a journey.', 'Sirach 23'),
      ev('sir-24', 4, 'dc', 'Wisdom’s dwelling in Zion', 'Wisdom speaks: seeking a resting place, she is told to dwell in Jacob and is established in Zion and Jerusalem (24:8–12). She is compared with trees of Lebanon, Hermon, Engedi and Jericho, and the Law with rivers: Pishon, Tigris, Euphrates, Jordan, the Nile and Gihon. These are images, not travels.', 'Sirach 24', 'jerusalem'),
      ev('sir-25', 4, 'dc', 'Social virtues; judgments about women', 'Social virtues, and harsh judgments about women from the book’s own standpoint. 25:24 alludes to the first sin; it is an allusion, not a separate claim.', 'Sirach 25'),
      ev('sir-26', 4, 'dc', 'Good and bad wives', 'Good and bad wives and integrity. The sanctuary comparisons (26:17–18) do not locate a temple.', 'Sirach 26'),
      ev('sir-27', 4, 'dc', 'Honest dealing and betrayed trust', 'Integrity in trade, speech that reveals character, betrayed confidences and vengeance.', 'Sirach 27'),
      ev('sir-28', 4, 'dc', 'Forgiveness and the harm of the tongue', 'Forgiveness, and the damage done by the tongue. The refugees and cities are general.', 'Sirach 28'),
      ev('sir-29', 4, 'dc', 'Loans, alms and surety', 'Lending, almsgiving, standing surety and hospitality. The exile in 29:18 is general, not a mapped journey.', 'Sirach 29'),
      ev('sir-30', 4, 'dc', 'Discipline, health and joy', 'Disciplining children, the worth of health, and gladness of heart.', 'Sirach 30'),
      ev('sir-31', 4, 'dc', 'Wealth and table manners', 'Wealth, and how to behave at a banquet.', 'Sirach 31'),
      ev('sir-32', 4, 'dc', 'Leading a banquet; the Law', 'How to preside at a meal, keeping the Law, and prudence. The road warnings are general.', 'Sirach 32'),
      ev('sir-33', 4, 'dc', 'Providence and differences among people', 'God’s ordering of differences, inheritance and the treatment of slaves. The teacher’s self-description (33:16–18) gives no address.', 'Sirach 33'),
      ev('sir-34', 4, 'dc', 'Dreams, travel and unjust offerings', 'Dreams are unreliable; the speaker says he learned much through travel and faced danger (34:9–12), without saying where. Offerings from injustice are rejected.', 'Sirach 34 (RV 1895)'),
      ev('sir-35', 4, 'dc', 'The Law, offerings and justice', 'The Law and offerings; justice, and God’s hearing of poor petitioners.', 'Sirach 35'),
      ev('sir-36', 4, 'dc', 'A prayer for restoration', 'A prayer asks God to gather the tribes of Jacob and to glorify Jerusalem, Zion and the Temple (36:13–22). It is a petition, not a return that happens; family counsel follows.', 'Sirach 36'),
      ev('sir-37', 4, 'dc', 'Friends and advisers', 'True and false friends and counselors, and moderation. Israel is spoken of as enduring (37:25).', 'Sirach 37 (RV 1895)'),
      ev('sir-38', 4, 'dc', 'Physicians, mourning and trades', 'Physicians and remedies are placed within God’s care, alongside prayer; mourning the dead; skilled workers. 38:5 alludes to water made sweet by wood without naming a place.', 'Sirach 38 (RV 1895)'),
      ev('sir-39', 4, 'dc', 'The scribe', 'The scribe studies and travels in foreign lands (39:4); creation is praised, its blessings likened to the Nile and the Euphrates. No endpoints are given.', 'Sirach 39'),
      ev('sir-40', 4, 'dc', 'Mortality and relative goods', 'Human mortality, and which goods are better than others.', 'Sirach 40'),
      ev('sir-41', 4, 'dc', 'Death, reputation and shame', 'Facing death, a good name that lasts, and what to be ashamed of. Sheol is an idea.', 'Sirach 41'),
      ev('sir-42', 4, 'dc', 'Shame, daughters, and the works of God', 'Proper and improper shame, the book’s anxious counsel about daughters, and the beginning of praise of creation.', 'Sirach 42'),
      ev('sir-43', 4, 'dc', 'Praise of sun, moon and weather', 'Sun, moon, stars and weather praise their maker; the moon marks feasts (43:6–8). No dated observation.', 'Sirach 43'),
      ev('sir-44', 4, 'dc', 'Praise of the ancestors', 'The praise of the ancestors names Enoch, Noah, Abraham, Isaac, Jacob and the twelve tribes (44:16–23). The promised inheritance is an ideal, not a mapped territory.', 'Sirach 44 (RV 1895)'),
      ev('sir-45', 4, 'dc', 'Moses, Aaron and Phinehas', 'Moses and his brother Aaron of the tribe of Levi; Aaron’s priesthood and descendants; the opposition of Dathan, Abiram and Korah; Phinehas son of Eleazar. The priestly inheritance is distinguished from David’s royal one.', 'Sirach 45'),
      ev('sir-46', 4, 'dc', 'Joshua, Caleb, the judges and Samuel', 'Joshua son of Nun succeeds Moses, and he and Caleb son of Jephunneh survive to enter the inheritance; the judges are honored; Samuel judges, anoints rulers, and speaks after his death.', 'Sirach 46 (RV 1895)'),
      ev('sir-47', 4, 'dc', 'Nathan, David and Solomon', 'Nathan in David’s time; David defeats Goliath and the Philistines and leads worship; his wise son Solomon builds the sanctuary, and the kingdom’s later division is tied to Solomon’s failings. Rehoboam and Jeroboam are named only in the notes.', 'Sirach 47'),
      ev('sir-48', 4, 'dc', 'Elijah, Elisha and Hezekiah', 'Elijah is recalled at Sinai and Horeb and taken up in fire; Elisha succeeds him. Israel is scattered while Judah survives. Hezekiah brings water into the city; Sennacherib threatens Zion and deliverance comes through Isaiah. The notes identify the Siloam tunnel.', 'Sirach 48'),
      ev('sir-49', 4, 'dc', 'Josiah, the prophets and the rebuilders', 'Josiah is faithful while other kings fail and the holy city is destroyed; Jeremiah, Ezekiel, Job and the Twelve Prophets are recalled. Zerubbabel and Jeshua son of Jozadak rebuild the altar and Temple; Nehemiah restores the walls. Enoch, Joseph, Shem, Seth, Enosh and Adam close the list.', 'Sirach 49'),
      ev('sir-50', 4, 'dc', 'Simeon the high priest', 'Simeon son of Jochanan repairs the Temple and the city’s defenses and leads splendid worship. The author then voices hostility toward Seir, Philistia and the people at Shechem (50:25–26), and signs the book as Yeshua son of Eleazar son of Sira (50:27).', 'Sirach 50'),
      ev('sir-51', 4, 'dc', 'Thanksgiving and an invitation to learn', 'A thanksgiving for rescue from unnamed dangers, then a poem of seeking Wisdom in youth, praying before the Temple, and an invitation to the house of instruction. No school is located.', 'Sirach 51 (RV 1895)'),

      /* ---- Baruch (slot 5). dc-bar-01-card … dc-bar-06-card. Chapter 6 is the Letter of Jeremiah. ---- */
      ev('bar-01', 5, 'dc', 'Baruch reads to the exiles', 'In Babylon, Baruch son of Nerias reads a book to Jechonias and the exiles by the river Sud. Money and the scroll are sent to Joakim the high priest in Jerusalem, the vessels are returned, and prayer is asked for Nabuchodonosor and his son Baltasar. The date names the fifth year and seventh day but no month. The edition’s introduction treats this setting as a literary frame.', 'Baruch 1', 'babylon'),
      ev('bar-02', 5, 'dc', 'A confession', 'The exiles’ prayer recalls the siege of Jerusalem, the ruined Temple, the deliverance from Egypt and subjection to Babylon, and looks to a promised return to the land and covenant.', 'Baruch 2'),
      ev('bar-03', 5, 'dc', 'Where is wisdom?', 'The prayer gives way to a poem on wisdom. Canaan, Teman, Medan, Tema and the descendants of Hagar are named only as comparisons, and wisdom is given to Jacob, to Israel.', 'Baruch 3'),
      ev('bar-04', 5, 'dc', 'Jerusalem mourns her children', 'Wisdom is identified with the law. Jerusalem, pictured as a mother and widow, mourns her exiled children and looks for their return.', 'Baruch 4'),
      ev('bar-05', 5, 'dc', 'Behold your children', 'Jerusalem is told to look and see her children coming home; the hills are leveled and trees give shade. A poem of restoration, not a road.', 'Baruch 5'),
      ev('bar-06', 5, 'dc', 'The Letter of Jeremiah', 'A letter attributed to Jeremiah tells the deportees to Babylon they will stay seven generations before returning, and mocks idols carried in procession, Bel, their priests and powerless images. Its picture of Babylonian religion is polemic. Some editions print it as a separate book.', 'Baruch 6'),

      /* ---- 1 Maccabees (slot 6). dc-m1-c01-card … dc-m1-c16-card (event groups), all RV 1895. Years are the
         book’s own Greek-kingdom era; the RV’s approximate BC annotations are not adopted. ---- */
      ev('m1-01', 6, 'dc', 'Alexander’s heirs and Antiochus Epiphanes', 'After Alexander’s conquests his kingdom passes to his officers. Antiochus Epiphanes becomes king in year 137 of the Greek kingdom (the book’s own era). A gymnasium is built in Jerusalem; after a campaign in Egypt the king plunders the Temple (year 143), a citadel is set up, and the ancestral practices are banned. On 15 Chislev 145 the abomination is set up, with sacrifice following on the 25th. The casualty figures and the polemic are the narrator’s.', '1 Maccabees 1 (RV 1895)', 'jerusalem'),
      ev('m1-02', 6, 'dc', 'Mattathias at Modin', 'Mattathias, a priest of the family of Joarib, moves from Jerusalem to Modin with his sons John Gaddis, Simon Thassi, Judas Maccabaeus, Eleazar Avaran and Jonathan Apphus. A killing at the altar there is followed by flight to the mountains. After a Sabbath massacre his group decides to fight even on the Sabbath, and the Hasidaeans join them. Dying in year 146, he names Simon as counselor and Judas as commander, and is buried at Modin.', '1 Maccabees 2 (RV 1895)'),
      ev('m1-03', 6, 'dc', 'Judas’s first victories', 'Judas defeats Apollonius, then Seron at Bethhoron. Antiochus leaves Lysias in charge from the Euphrates to Egypt, with his son Antiochus, and goes to the upper countries in year 147. Ptolemy, Nicanor and Gorgias camp at Emmaus; Judas’s men pray at Mizpeh, opposite Jerusalem, and camp south of Emmaus.', '1 Maccabees 3 (RV 1895)'),
      ev('m1-04', 6, 'dc', 'Emmaus, and the sanctuary rededicated', 'While Gorgias searches the mountains, Judas defeats the camp at Emmaus and pursues toward Gazara. The next year Lysias invades by way of Idumaea and Bethsura, then returns to Antioch. The sanctuary is cleansed; the defiled altar stones are stored until a prophet comes, and a new altar is dedicated on 25 Chislev 148 with eight days of celebration, to be kept every year. Mount Sion and Bethsura are fortified.', '1 Maccabees 4 (RV 1895)', 'jerusalem'),
      ev('m1-05', 6, 'dc', 'Campaigns east and west', 'Judas fights in Idumaea and Ammon. Simon rescues the Jews of Galilee and Arbatta and brings them to Judaea. Judas and Jonathan cross the Jordan, meet the Nabathaeans, take Bosora, relieve a besieged stronghold in Gilead, defeat Timotheus, burn the temple at Carnaim, force a way through Ephron and return by the Jordan and Bethshan. Joseph son of Zacharias and Azarias, acting without orders, are defeated at Jamnia. Hebron and Azotus follow. This edition prints Samaria at 5:66, with Marisa as an alternative reading.', '1 Maccabees 5 (RV 1895)'),
      ev('m1-06', 6, 'dc', 'The death of Antiochus; Bethzacharias', 'Antiochus fails to plunder Elymais in Persia, hears of losses in Judaea and dies in a foreign land in year 149, having entrusted the succession to Philip; Lysias makes Antiochus Eupator king. A siege of the Jerusalem citadel in year 150 brings a royal army; at Bethzacharias Eleazar kills an elephant and is crushed beneath it. A sabbatical-year famine, a treaty, and the pulling down of the Sion wall follow before the army turns back to Antioch against Philip.', '1 Maccabees 6 (RV 1895)'),
      ev('m1-07', 6, 'dc', 'Demetrius, Alcimus and Nicanor', 'Demetrius son of Seleucus comes from Rome in year 151, and Antiochus and Lysias are killed. Bacchides installs Alcimus; sixty Hasidaeans are killed despite an oath, and there are killings at Bezeth. Nicanor threatens the Temple and is defeated and killed at Adasa on 13 Adar; his trophies are displayed in Jerusalem and the day is kept every year.', '1 Maccabees 7 (RV 1895)'),
      ev('m1-08', 6, 'dc', 'A treaty with Rome', 'Judas hears reports of Roman power and sends Eupolemus son of John and Jason son of Eleazar to Rome. The treaty promises mutual military help, and a letter warns Demetrius. The reports of Roman rule are the narrator’s picture, not a verified map.', '1 Maccabees 8 (RV 1895)', 'rome'),
      ev('m1-09', 6, 'dc', 'Judas falls; Jonathan leads', 'In the first month of year 152 Bacchides attacks; Judas dies at Elasa and is buried at Modin by Jonathan and Simon, and Jonathan takes command. A baggage mission led by their brother John is intercepted, and the brothers take revenge on a wedding party before escaping across the Jordan. Bacchides fortifies towns; Alcimus dies in year 153 during his wall project. Later Jonathan defends Bethbasi, a treaty returns captives, and Jonathan settles at Michmash.', '1 Maccabees 9 (RV 1895)'),
      ev('m1-10', 6, 'dc', 'Jonathan made high priest', 'Alexander lands at Ptolemais in year 160, and Demetrius competes for Jonathan’s support. Jonathan puts on the high priest’s vestments at Tabernacles in the seventh month of year 160, by royal appointment. Alexander defeats Demetrius and marries Cleopatra, daughter of Ptolemy, at Ptolemais in year 162. When a younger Demetrius comes from Crete in year 165, Jonathan and Simon defeat Apollonius near Joppa and Azotus and burn the temple of Dagon.', '1 Maccabees 10 (RV 1895)'),
      ev('m1-11', 6, 'dc', 'Ptolemy, Demetrius and Tryphon', 'Ptolemy invades, gives Cleopatra to Demetrius, and Alexander flees to Arabia, where Zabdiel beheads him; Ptolemy dies, and Demetrius reigns from year 167. Jonathan receives three districts and sends 3,000 men to rescue Demetrius in Antioch, but the king breaks his promises. Tryphon raises Alexander’s young son Antiochus. Jonathan campaigns along the coast, at Gaza and toward Damascus, while Simon takes Bethsura.', '1 Maccabees 11 (RV 1895)'),
      ev('m1-12', 6, 'dc', 'Embassies, and Jonathan captured', 'Numenius son of Antiochus and Antipater son of Jason go to Rome and Sparta; a letter to the Spartans claims kinship through Abraham. Jonathan campaigns toward Hamath and Damascus. Tryphon meets him at Bethshan, lures him to Ptolemais, takes him prisoner and kills his escort. The survivors believe Jonathan dead; his death comes later.', '1 Maccabees 12 (RV 1895)'),
      ev('m1-13', 6, 'dc', 'Simon succeeds', 'Simon is chosen leader. Tryphon takes a ransom and Jonathan’s two sons but kills Jonathan at Bascama; Simon buries the bones at Modin under a monument of seven pyramids. Tryphon kills the young Antiochus. Demetrius grants relief in year 170, Gazara is taken (a note says some authorities read Gaza), and the citadel surrenders on the 23rd of the second month, year 171.', '1 Maccabees 13 (RV 1895)'),
      ev('m1-14', 6, 'dc', 'The decree for Simon', 'Demetrius is captured by Arsaces in year 172. A poem praises the peace of Simon’s time, and friendship with Rome and Sparta is renewed. A decree of 18 Elul 172, Simon’s third year, recognizes him as leader and high priest until a faithful prophet arises, and is set up on bronze. Asaramel, where it was proclaimed, may be a title or a place.', '1 Maccabees 14 (RV 1895)'),
      ev('m1-15', 6, 'dc', 'Antiochus son of Demetrius', 'Antiochus son of Demetrius arrives in year 174 and besieges Tryphon at Dor; then he withdraws his favors from Simon and, through Athenobius, demands disputed towns. Tryphon escapes by ship to Orthosia, and Cendebaeus raids from Jamnia and Kidron. A Roman letter from Lucius is addressed to a long list of kings and cities; the list is of recipients, not a route.', '1 Maccabees 15 (RV 1895)'),
      ev('m1-16', 6, 'dc', 'The murder of Simon', 'Simon’s sons Judas and John defeat Cendebaeus. Then Simon’s son-in-law Ptolemy son of Abubus murders Simon and his sons Mattathias and Judas at Dok, in the eleventh month, Sebat, of year 177. John, warned at Gazara, escapes the assassins; the book refers his later deeds to another chronicle.', '1 Maccabees 16 (RV 1895)'),
      /* ---- 2 Maccabees (slot 7). dc-m2-c01-card … dc-m2-c15-card, all RV 1895. An abridgment that overlaps
         1 Maccabees; its dates and death accounts are not harmonized with it. dc-m2-r01…r04 are stated in text. ---- */
      ev('m2-01', 7, 'dc', 'Letters to the Jews of Egypt', 'Two letters urge the Jews of Egypt to keep the Chislev festival of the Temple’s purification; they recall earlier correspondence of year 169 and are dated year 188. The second, to Aristobulus, tells how Antiochus and his party were trapped and killed in the temple of Nanaea, and how in Nehemiah’s time the altar fire hidden at the deportation was found as a thick liquid that kindled the sacrifice, and the king of Persia recognized it. This death account is not harmonized with 1 Maccabees 6 or 2 Maccabees 9; the edition notes a variant in the wording of the trap.', '2 Maccabees 1 (RV 1895)'),
      ev('m2-02', 7, 'dc', 'The hidden ark, and the epitomator’s preface', 'A tradition says Jeremiah hid the tabernacle, the ark and the altar of incense in a cave in the mountain from which Moses viewed the inheritance, the place to stay unknown until the restoration. The dedications of Moses and Solomon, Nehemiah’s library and Judas’s collection of books are recalled. The epitomator says he condenses five books by Jason of Cyrene about Judas and the reigns of Antiochus Epiphanes and Eupator. The book is an abridgment that overlaps 1 Maccabees, not a sequel to it.', '2 Maccabees 2 (RV 1895)'),
      ev('m2-03', 7, 'dc', 'Heliodorus at the Temple', 'Simon, guardian of the Temple, quarrels with the high priest Onias and tells Apollonius of the Temple’s wealth, and King Seleucus sends Heliodorus (Coelesyria and Phoenicia are named on his inspection). Onias defends the deposits of widows and orphans and of Hyrcanus son of Tobias. A heavenly rider and two young men strike Heliodorus; Onias offers sacrifice for his recovery, and Heliodorus returns and testifies to the king. The apparition is the text’s miracle account.', '2 Maccabees 3 (RV 1895)', 'jerusalem'),
      ev('m2-04', 7, 'dc', 'Jason, Menelaus and the murder of Onias', 'Jason, Onias’s brother, buys the high priesthood and builds a gymnasium; envoys go to the games at Tyre, and Antiochus visits Joppa, Jerusalem and Phoenicia. Menelaus, Simon’s brother, outbids Jason, with his brother Lysimachus as deputy. A revolt at Tarsus and Mallus draws the king away; Andronicus lures Onias out of the sanctuary at Daphne and murders him, and is executed. Lysimachus is killed, and Menelaus bribes his way to acquittal while the Jewish envoys are condemned at Tyre. The religious judgments are the narrator’s; this Jason is not Jason of Cyrene.', '2 Maccabees 4 (RV 1895)'),
      ev('m2-05', 7, 'dc', 'Jason’s attack and the plunder of the Temple', 'During Antiochus’s second campaign in Egypt, armies are seen in the sky. A false rumour of the king’s death leads Jason to attack the city; he flees to the Ammonite country, to Aretas, to Egypt and toward Sparta, and dies abroad. Antiochus plunders the Temple with Menelaus as guide and returns to Antioch, leaving Philip as governor at Jerusalem and Andronicus at Gerizim. Apollonius carries out a Sabbath massacre, and Judas and his companions withdraw to the mountains. The sky vision is told as a portent; the casualty totals are the narrator’s.', '2 Maccabees 5 (RV 1895)', 'jerusalem'),
      ev('m2-06', 7, 'dc', 'Compulsion, and the death of Eleazar', 'An agent from Athens enforces the decrees: the Jerusalem sanctuary is renamed for Zeus Olympius and the one on Gerizim for Zeus, Protector of strangers. A Dionysiac procession is forced; mothers who circumcised their sons are killed, and people keeping the Sabbath in caves are burned. Eleazar, an aged scribe, refuses pork and any pretence and dies under beating; he is not Eleazar Avaran of 1 Maccabees. The edition notes variant readings for the agent and for Gerizim, and the theology of chastisement is the narrator’s.', '2 Maccabees 6 (RV 1895)'),
      ev('m2-07', 7, 'dc', 'A mother and seven sons', 'An unnamed mother and her seven sons are put to death before Antiochus. They declare their trust in creation, resurrection and restoration, and the mother dies last. The text names neither them nor the place; later traditional names are not used here, and its heaven and Hades are not places on the map.', '2 Maccabees 7 (RV 1895)'),
      ev('m2-08', 7, 'dc', 'Judas’s first campaigns', 'Judas recruits from the villages. At Philip’s appeal, Ptolemy commissions Nicanor son of Patroclus and Gorgias; Nicanor’s plan to pay with the sale of captives as slaves fails, and Judas wins before the Sabbath. Simon, Joseph, Jonathan and Eleazar are named as leaders. Timotheus and Bacchides are defeated, Callisthenes is burned, and Nicanor flees to Antioch. A battle in Babylon is recalled from the past. The chapter does not name Emmaus.', '2 Maccabees 8 (RV 1895)'),
      ev('m2-09', 7, 'dc', 'The death of Antiochus', 'Antiochus fails to plunder the temple at Persepolis and hears at Ecbatana of the defeats. Hurrying toward Jerusalem with threats, he falls ill and falls from his chariot. He promises to convert and to make amends, writes commending his son Antiochus, and dies in foreign mountains. Philip, his foster-brother, brings the body home and then flees to Ptolemy Philometor in Egypt. The divine judgment is the book’s; this account is kept separate from 1 Maccabees 6 and 2 Maccabees 1.', '2 Maccabees 9 (RV 1895)'),
      ev('m2-10', 7, 'dc', 'The Temple cleansed; Idumaea and Gazara', 'The Temple is cleansed on 25 Chislev, with eight days of celebration like Tabernacles, to be kept every year. Eupator succeeds, and Ptolemy Macron, who had held office in Cyprus, poisons himself. The war on the Idumaean strongholds involves bribery and executions. Five heavenly riders appear at the battle with Timotheus; Gazara is taken after a siege, on the 25th day, and Timotheus, his brother Chaereas and Apollophanes are killed. The book places the dedication after the king’s death, and that order is kept. A Timotheus appears again in chapter 12.', '2 Maccabees 10 (RV 1895)', 'jerusalem'),
      ev('m2-11', 7, 'dc', 'Lysias at Bethsuron; the letters', 'Lysias invades and besieges Bethsuron; a heavenly rider appears, Lysias is defeated and makes a treaty. Letters follow: from Jewish envoys John and Absalom, a royal restoration of rights, and the approval of the Roman envoys Memmius and Manius, who plan to go to Antioch. They are dated year 148, 24 Dioscorinthius, and 15 Xanthicus, with a return deadline of 30 Xanthicus. Dioscorinthius may be a corrupt month name and is not converted.', '2 Maccabees 11 (RV 1895)'),
      ev('m2-12', 7, 'dc', 'Joppa, Jamnia and the eastern campaign', 'After the people of Joppa drown Jews, Judas burns its harbour, and then Jamnia’s. He fights nomads and makes a pact with them, takes Caspin, campaigns toward Charax against Timotheus, lets Timotheus go for the sake of hostages, and fights at Carnion and Ephron; Scythopolis is friendly, and the army returns to Jerusalem before the feast of Weeks. After Pentecost Gorgias is defeated and escapes to Marisa, and the army keeps the Sabbath at Adullam. Idol tokens are found on fallen soldiers; Judas has prayers made and sends a collection to Jerusalem for a sin offering, which the text links to resurrection.', '2 Maccabees 12 (RV 1895)'),
      ev('m2-13', 7, 'dc', 'Eupator’s campaign', 'In year 149 Eupator and Lysias invade. Menelaus is executed in a tower of ashes at Beroea. Judas attacks by night near Modin; Bethsura is resupplied and the traitor Rhodocus arrested. Trouble with Philip at Antioch brings a withdrawal and a treaty; Hegemonides is made governor from Ptolemais to the Gerrenians, opposition at Ptolemais is calmed, and Lysias returns to Antioch. The book’s year 149 stands beside year 150 in 1 Maccabees 6, unreconciled.', '2 Maccabees 13 (RV 1895)'),
      ev('m2-14', 7, 'dc', 'Demetrius, Nicanor and Razis', 'Demetrius son of Seleucus lands at Tripolis; about year 151 Alcimus accuses Judas, and Nicanor is commissioned. After an encounter at Lessau, Nicanor and Judas are reconciled and Judas marries; his wife is not named. Alcimus’s complaint forces Nicanor to break the agreement, and Judas escapes an order to send him to Antioch. Nicanor threatens the Temple with a temple to Dionysus; Razis, besieged, dies by his own hand. The text near Lessau is corrupt.', '2 Maccabees 14 (RV 1895)'),
      ev('m2-15', 7, 'dc', 'The defeat of Nicanor', 'Nicanor plans to attack on the Sabbath. Judas dreams of Onias and Jeremiah, and Jeremiah gives him a sword. Nicanor is killed in the battle; his head and arm are displayed at Jerusalem, and 13 Adar, the day before Mordecai’s day, is to be kept every year. The epitomator ends his book with this victory. The dream is a vision, not a meeting.', '2 Maccabees 15 (RV 1895)'),

      /* ---- Esther additions (slot 8). dc-est-a-card … dc-est-f-card. The Greek king Artaxerxes is not
         renamed Ahasuerus; dates are given as each edition states them. ---- */
      ev('est-a', 8, 'dc', 'Mordecai’s dream', 'In Susa, Mardocheus (Mordecai), who was deported from Jerusalem to Babylon, dreams of two dragons, warring nations and a saving stream. He exposes a plot by Gabatha and Tharra against King Artaxerxes, and Aman (Haman) turns against him. The text dates this to the second year, on the first of Nisan.', 'Additions to Esther A (RV 11:2–12:6)'),
      ev('est-b', 8, 'dc', 'The decree of destruction', 'A royal decree to the 127 provinces from India to Ethiopia orders the destruction of the Jews, and Mordecai urges Esther to plead with the king. The Douay edition used dates the decree’s day to the fourteenth of Adar.', 'Additions to Esther B (Douay 13:1–7, 15:1–3)'),
      ev('est-c', 8, 'dc', 'Two prayers', 'Mordecai says he refused Aman the honor due to God; his prayer recalls Egypt and the covenant. Esther lays aside her royal dress, says she wears the crown only under compulsion and has kept the food laws, and asks for persuasive words.', 'Additions to Esther C (Douay 13:8–18, RV 14:1–19)'),
      ev('est-d', 8, 'dc', 'Esther before the king', 'On the third day Esther, with two maids, goes through the palace doors and faints before the king. God changes the king’s mood; he holds her up, extends his scepter, and she is heard.', 'Additions to Esther D (RV 15:1–16)'),
      ev('est-e', 8, 'dc', 'The counter-decree', 'A second decree to the provinces from India to Ethiopia revokes Aman’s order and allows the Jews to defend themselves on the thirteenth of Adar. It calls Aman a Macedonian and describes his punishment at Susa.', 'Additions to Esther E (RV 16:1–24)'),
      ev('est-f', 8, 'dc', 'The dream explained', 'Mordecai interprets the two dragons as himself and Aman and the stream as Esther, and the fourteenth and fifteenth of Adar are kept in remembrance. A closing note says Dositheus and his son Ptolemy brought the letter, translated by Lysimachus son of Ptolemy in Jerusalem, in the fourth year of Ptolemy and Cleopatra.', 'Additions to Esther F (RV 10:4–13, 11:1)'),

      /* ---- Daniel additions (slot 9). dc-dan-prayer-song-card, dc-dan-susanna-card, dc-dan-bel-dragon-card.
         Bel and the Dragon follows NABRE (Theodotion-based); the Old Greek differs. ---- */
      ev('dan-song', 9, 'dc', 'The prayer and song in the furnace', 'In the furnace, Azarias prays, recalling Jerusalem, the covenant and the ancestors. An angel protects the three young men, and Ananias, Azarias and Misael call on all creation to bless God. Verse numbers differ between editions.', 'Prayer of Azarias and Song of the Three (RV), within Daniel 3'),
      ev('dan-sus', 9, 'dc', 'Susanna', 'In Babylon, Susanna, daughter of Helkias and wife of Joakim, is threatened in her garden by two elders, falsely accused and condemned. Young Daniel questions the elders separately; they name different trees, Susanna is cleared, and the elders are executed.', 'Susanna (RV), Daniel 13 in some editions', 'babylon'),
      ev('dan-bel', 9, 'dc', 'Bel and the Dragon', 'In this telling Cyrus succeeds Astyages. Daniel uses footprints to expose the priests’ secret entrance to Bel’s temple, and the idol and its temple are destroyed; he kills the dragon and is thrown to the lions. An angel carries Habakkuk from Judea to the den with a meal and back home, and Daniel is freed on the seventh day.', 'Bel and the Dragon (NABRE), Daniel 14 in some editions', 'babylon'),

      /* ---- 1 Esdras (slot 10). expanded-ot-integration.csv XO-P01, XO-P03, XO-E01, XO-E23–E26. KJV
         transcription (XO01). Narrated dates stay as the text gives them; no BC dates imported. ---- */
      ev('xo-p01', 10, 'xot', 'Josiah’s Passover, and the city’s fall', 'First Esdras opens with Josiah’s Passover at Jerusalem and ends its first chapter with the city’s destruction. First Esdras is a distinct work, not the canonical book of Ezra or Nehemiah.', '1 Esdras 1:1–22, 54–56 (KJV)', 'jerusalem'),
      ev('xo-p03', 10, 'xot', 'Exile to Babylon, and the way back', 'Babylon is where the captives are taken at the end of chapter 1, and where the first return sets out in chapter 2.', '1 Esdras 1:54–58; 2:15 (KJV)', 'babylon'),
      ev('xo-e01', 10, 'xot', 'The debate at Darius’s court', 'At King Darius’s court, Zerubbabel wins a debate and asks for Jerusalem to be restored. The story gives no date beyond Darius’s reign.', '1 Esdras 4:13, 34–63 (KJV)'),
      ev('xo-e23', 10, 'xot', 'Altar and foundations', 'The altar is restored and the Temple’s foundations are laid, then opponents stop the rebuilding. The text keeps these stages separate from the final dedication.', '1 Esdras 5 (KJV)'),
      ev('xo-e24', 10, 'xot', 'The Temple completed', 'The Temple is finished and dedicated, and a Passover follows. The text dates the completion to the twenty-third of Adar in Darius’s sixth year; this is the book’s own date.', '1 Esdras 7:5–15 (KJV)'),
      ev('xo-e25', 10, 'xot', 'Ezra and the mixed marriages', 'Ezra laments over marriages to foreign wives, and a process separates those marriages and families. The atlas reports this hard outcome as the text tells it, without endorsing it.', '1 Esdras 8:91–9:36 (KJV)'),
      ev('xo-e26', 10, 'xot', 'The law read aloud', 'The law is read and explained before the gathered people.', '1 Esdras 9:37–55 (KJV)'),

      /* ---- 2 Esdras (slot 11), the 16-chapter English composite. XO-P06, XO-E02 (chapters 1–4, KJV transcription
         XO02) and the supplement rows XE2-* (chapters 5–16, WEB Classic). Chapters 3–14 are the core usually called
         4 Ezra; 1–2 and 15–16 are Christian framing not found in every recension. Visions are not mapped. ---- */
      ev('xo-p06', 11, 'xot', 'A lament in Babylon', 'The narrator speaks from Babylon in the thirtieth year after the city’s ruin, and laments.', '2 Esdras 3:1–2 (KJV)', 'babylon'),
      ev('xo-e02', 11, 'xot', 'Uriel’s answers', 'The angel Uriel answers Ezra’s questions about suffering by comparing them with the limits of human understanding.', '2 Esdras 4 (KJV)'),
      ev('xe2-c03', 11, 'xot', 'The fate of souls', 'The angel describes what souls experience after death and at the judgment. This passage is marked as restored in the WEB edition; the KJV transcription lacks it and jumps from 7:35 to the passage WEB numbers 7:106. The text gives no measured chambers, and traditions do not agree on its teaching.', '2 Esdras 7:75–105 (WEB)'),
      ev('xe2-e01', 11, 'xot', 'The mourning woman becomes a city', 'Ezra sees a grieving woman who becomes a city, and the vision is interpreted as Zion. Her son and his thirty years belong to the interpretation, not to a historical family.', '2 Esdras 9:38–10:49 (WEB)'),
      ev('xe2-c01', 11, 'xot', 'The eagle and the lion', 'In a dream vision an eagle stands for a kingdom, and a lion is interpreted as the anointed one. The atlas does not match the eagle’s wings to particular rulers.', '2 Esdras 11–12 (WEB)'),
      ev('xe2-e02', 11, 'xot', 'Ezra and the five scribes', 'Over forty days, Ezra and five named scribes produce books, some for everyone and some kept back. In the WEB edition there are 94 books, 70 of them reserved, which leaves 24 by arithmetic; the KJV transcription has 204 books. Neither total is preferred here.', '2 Esdras 14:23–48 (WEB)'),
      ev('xe2-c04', 11, 'xot', 'Oracles against the nations', 'The closing prophecies threaten Egypt, Libanus, Arabia, Assyria, Babylon, Asia and Syria. These are literary targets, not a record of real campaigns.', '2 Esdras 15:10–63; 16:1 (WEB)'),

      /* ---- 3 Maccabees (slot 12). XO-P07, XO-E03, XO-E04. WEB Classic (XO18). Story chronology only. ---- */
      ev('xo-p07', 12, 'xot', 'Philopator at the Temple', 'King Ptolemy Philopator tries to enter the Temple at Jerusalem, and his entry is contested.', '3 Maccabees 1:9–29 (WEB)', 'jerusalem'),
      ev('xo-e03', 12, 'xot', 'Persecution and rescue in Egypt', 'The narrative tells of persecution in Egypt, a threat to have the Jews trampled by elephants, a rescue by angels, and the king’s change of heart.', '3 Maccabees 2–6 (WEB)'),
      ev('xo-e04', 12, 'xot', 'The return, and the reprisals', 'The return home includes reprisals, authorized by the king, against fellow Jews who had abandoned the law. The book ends with this difficult episode alongside the deliverance.', '3 Maccabees 7:10–15 (WEB)'),

      /* ---- 4 Maccabees (slot 13). XO-E07, XO-E27–E30. Online translation XO04 (edition not identified), with
         chapters 1 and 18 checked against WEB Classic (XO19) and 10:4, 11:7–8 supplied from the WEB PDF (XO22). ---- */
      ev('xo-e07', 13, 'xot', 'Devout reason', 'The book’s theme is devout reason, illustrated through Eleazar, the seven brothers and their mother. No date of death is given.', '4 Maccabees 1:1–12 (WEB)'),
      ev('xo-e27', 13, 'xot', 'The Temple treasury', 'An accusation by Simon leads to Apollonius’s attempt on the Temple. Jason’s appointment and Antiochus’s attack follow in the story. Kinship between these figures is not assumed.', '4 Maccabees 4 (online translation)'),
      ev('xo-e28', 13, 'xot', 'Eleazar', 'Eleazar refuses forbidden food and dies under torture. He is the elder of this book, not the Eleazar of 3 Maccabees.', '4 Maccabees 5–6 (online translation)'),
      ev('xo-e29', 13, 'xot', 'The seven brothers', 'Seven brothers resist coercion and are killed one after another. Verses missing from the online text in chapters 10 and 11 were read in the WEB edition.', '4 Maccabees 8–12 (online translation; 10:4, 11:7–8 WEB)'),
      ev('xo-e30', 13, 'xot', 'The mother', 'The mother exhorts her sons, and her death is then reported. The book proposes an epitaph for them; it is a text, not a monument that has been found.', '4 Maccabees 16–17 (online translation)'),

      /* ---- Prayer of Manasseh (slot 14), XO-E05, and Psalm 151 (slot 15), XO-E06. Both translations are under
         copyright (NRSV; Holy Transfiguration Monastery 1974): paraphrase only. ---- */
      ev('xo-e05', 14, 'xot', 'A prayer of repentance', 'The prayer confesses wrongdoing and asks for mercy. It names no city and gives no date.', 'Prayer of Manasseh 1–15 (NRSV)'),
      ev('xo-e06', 15, 'xot', 'David’s psalm', 'The speaker recalls being a shepherd, being anointed, and defeating his opponent. The heading attributes the psalm to David; a heading is not proof of authorship.', 'Psalm 151, heading and 1–7 (Holy Transfiguration Monastery 1974)'),

      /* ---- 1 Enoch (slot 16). XO-E31, XO-E08, XO-E11–E14. Charles translation as hosted by NNU (XO07); Charles
         chapter numbers are working locators. Edition defects are disclosed, not corrected. No dates imported. ---- */
      ev('xo-e31', 16, 'xot', 'The Watchers descend', 'The Watchers come down, teach what they should not, and are judged. This is the background to Enoch’s petition; the supernatural claims are the text’s own.', '1 Enoch 6–11 (Charles)'),
      ev('xo-e08', 16, 'xot', 'Enoch carries the Watchers’ petition', 'Enoch takes the Watchers’ petition to heaven, and it fails. The story is set before the Flood; that is its literary setting, not a date.', '1 Enoch 13–16 (Charles)'),
      ev('xo-e11', 16, 'xot', 'Sun, moon and the 364-day year', 'Portals for the sun and moon and a 364-day year. This is the text’s ancient picture of the sky, not a scientific model.', '1 Enoch 72–82 (Charles)'),
      ev('xo-e12', 16, 'xot', 'The animal vision', 'A dream tells history through animals: destruction, deliverance, rule, the loss of the temple and judgment. Which animal stands for which person or nation is interpretation, and the atlas does not assign them.', '1 Enoch 85–90 (Charles)'),
      ev('xo-e13', 16, 'xot', 'The Apocalypse of Weeks', 'A history told in weeks, which in this edition runs across chapters printed out of order (93:1–10, then 91:12–17). The reading order is kept as the edition gives it.', '1 Enoch 93:1–10; 91:12–17 (Charles)'),
      ev('xo-e14', 16, 'xot', 'Noah’s birth', 'Lamech is afraid at his son Noah’s unusual birth, and Enoch assures him that the child is his. The fear is only a fear; the text does not make an angel the father.', '1 Enoch 106–107 (Charles)'),

      /* ---- Jubilees (slot 17). XO-E32, XO-E15, XO-E09, XO-E16–E22, XO-E33. Charles translation as hosted by NNU
         (XO08). The jubilee/week/year scheme is the book’s own; bracketed AM figures are not converted. ---- */
      ev('xo-e32', 17, 'xot', 'Flood and covenant', 'The Flood and the covenant come before the division of the earth. The ark comes to rest on Lubar, which is not identified with any modern summit.', 'Jubilees 5–6 (Charles)'),
      ev('xo-e15', 17, 'xot', 'The festival of Weeks and the 364-day year', 'The covenant is tied to keeping the festival of Weeks and to a 364-day year. These are the book’s institutions, not a measure of astronomical accuracy.', 'Jubilees 6 (Charles)'),
      ev('xo-e09', 17, 'xot', 'The earth divided by lot', 'Noah’s descendants receive their lands by lot and swear not to take each other’s. This belongs to the book’s jubilee scheme; it does not describe modern borders.', 'Jubilees 8–9 (Charles)'),
      ev('xo-e16', 17, 'xot', 'Mastema’s tenth, and Noah’s remedies', 'Mastema is allowed to keep a tenth of the spirits, and Noah passes on remedies. The account is a story, not medical evidence.', 'Jubilees 10 (Charles)'),
      ev('xo-e17', 17, 'xot', 'Abram burns the house of idols', 'Abram sets fire to the house of idols; Haran dies trying to save them. A traditional story, not a verified biography.', 'Jubilees 12 (Charles)'),
      ev('xo-e18', 17, 'xot', 'Dinah, and Shechem', 'Dinah is assaulted; Simeon and Levi kill the men of Shechem, and the narrative approves. The atlas reports the violence and who approves it as the text does, without endorsing it.', 'Jubilees 30 (Charles)'),
      ev('xo-e19', 17, 'xot', 'Levi’s priesthood, and the sanctuary not built', 'Levi’s role as priest is affirmed. Jacob plans to make Bethel a permanent sanctuary, and an angel forbids it; the planned walls are not built.', 'Jubilees 32 (Charles)'),
      ev('xo-e20', 17, 'xot', 'Reuben and Bilhah', 'Reuben assaults Bilhah while she sleeps. The text presents an assault, not a relationship.', 'Jubilees 33 (Charles)'),
      ev('xo-e21', 17, 'xot', 'Jacob and Esau', 'In this book Jacob kills Esau, and his sons’ pursuit ends with Seir paying tribute. This ending belongs to Jubilees and is not replaced with Genesis.', 'Jubilees 38 (Charles)'),
      ev('xo-e33', 17, 'xot', 'Joseph in Egypt', 'Joseph is enslaved and imprisoned, then appointed, before he runs the famine administration. The book’s reign-based chronology is literary, not established Egyptian history.', 'Jubilees 39–40 (Charles)'),
      ev('xo-e22', 17, 'xot', 'Passover and Sabbath laws', 'Laws for Passover and the Sabbath, framed as given at Sinai. The sanctuary instructions and the crossing of the Jordan look ahead; neither is a completed journey in this book.', 'Jubilees 49–50 (Charles)'),

      /* ---- Ascension of Isaiah (slot 21). related-traditions-integration.csv RPE01–RPE11; copy from
         related-pseudepigrapha.md. R. H. Charles translation (RP1). Chapters 6–11 look back to an earlier year of
         Hezekiah (20th, against the 26th of chapter 1); both are the text’s own years, not historical dates. ---- */
      ev('rpe01', 21, 'rp', 'Hezekiah’s instruction', 'Hezekiah hands on his instruction, and Isaiah foretells that Manasseh will turn away. The text sets this in Hezekiah’s twenty-sixth year.', 'Ascension of Isaiah 1:1–13 (Charles)', 'jerusalem'),
      ev('rpe02', 21, 'rp', 'Isaiah withdraws', 'Isaiah leaves Jerusalem, goes through Bethlehem, and settles on a mountain in the wilderness.', 'Ascension of Isaiah 2:1–16 (Charles)', 'bethlehem'),
      ev('rpe03', 21, 'rp', 'Belchira’s accusation', 'Belchira accuses Isaiah, and the narrative turns to the Beloved and to conflict in the future church.', 'Ascension of Isaiah 3:1–31 (Charles)'),
      ev('rpe04', 21, 'rp', 'Beliar’s reign foretold', 'The reign of Beliar and the Beloved’s judgment are foretold. The periods of time given are part of the prophecy, not a modern prediction.', 'Ascension of Isaiah 4:1–22 (Charles)'),
      ev('rpe05', 21, 'rp', 'Isaiah’s death', 'Isaiah refuses to recant and is killed; his companions are told to flee. The place of his death is not given.', 'Ascension of Isaiah 5:1–16 (Charles)'),
      ev('rpe06', 21, 'rp', 'The vision at court', 'Earlier in Hezekiah’s reign, in his twentieth year, Isaiah falls into a vision at the king’s court.', 'Ascension of Isaiah 6:1–17 (Charles)', 'jerusalem'),
      ev('rpe07', 21, 'rp', 'Through the firmament', 'An angel guides Isaiah through the firmament and the first five heavens.', 'Ascension of Isaiah 7:1–37 (Charles)'),
      ev('rpe08', 21, 'rp', 'The sixth heaven', 'In the sixth heaven all praise together; the divisions of the lower heavens are gone.', 'Ascension of Isaiah 8:1–28 (Charles)'),
      ev('rpe09', 21, 'rp', 'The seventh heaven', 'Isaiah enters the seventh heaven and sees the righteous and the divine glory.', 'Ascension of Isaiah 9:1–42 (Charles)'),
      ev('rpe10', 21, 'rp', 'The Beloved descends', 'The Beloved comes down through the heavens one level at a time, with his identity hidden.', 'Ascension of Isaiah 10:1–31 (Charles)'),
      ev('rpe11', 21, 'rp', 'The vision of Jesus’ life', 'The vision tells of Jesus’ birth, life on earth, death and exaltation, and Isaiah reports what he saw. This birth account is not harmonized with any gospel.', 'Ascension of Isaiah 11:1–43 (Charles)'),

      /* ---- 4 Baruch (slot 22), the longer form. RPE12–RPE20. Kraft and Purintun translation (CATSS), cross-checked
         in RP8. The 66 years, the nine days and the 477 years are the text’s own numbers. ---- */
      ev('rpe12', 22, 'rp', 'The fall announced', 'God announces that Jerusalem will fall and tells Jeremiah and Baruch to leave.', '4 Baruch 1:1–12 (Kraft and Purintun)', 'jerusalem'),
      ev('rpe13', 22, 'rp', 'Lament in the sanctuary', 'Jeremiah and Baruch lament in the sanctuary before the destruction they have been told of.', '4 Baruch 2:1–10 (Kraft and Purintun)', 'jerusalem'),
      ev('rpe14', 22, 'rp', 'The vessels hidden', 'Angels approach the city; the sacred vessels are hidden; Abimelech is sent out for figs.', '4 Baruch 3:1–22 (Kraft and Purintun)'),
      ev('rpe15', 22, 'rp', 'Captivity, and the tomb', 'Jeremiah goes with the captives to Babylon; Baruch stays near Jerusalem, in a tomb.', '4 Baruch 4:1–12 (Kraft and Purintun)', 'babylon'),
      ev('rpe16', 22, 'rp', 'Abimelech wakes', 'Abimelech wakes after sixty-six years, in the month Nisan (Abib), and does not recognize Jerusalem; his figs are still fresh.', '4 Baruch 5:1–35 (Kraft and Purintun)', 'jerusalem'),
      ev('rpe17', 22, 'rp', 'Abimelech and Baruch', 'An angel brings Abimelech to Baruch, and Baruch prepares a letter.', '4 Baruch 6:1–25 (Kraft and Purintun)'),
      ev('rpe18', 22, 'rp', 'The eagle', 'An eagle carries the letters and figs; outside Babylon a dead person comes back to life.', '4 Baruch 7:1–37 (Kraft and Purintun)'),
      ev('rpe19', 22, 'rp', 'The return, and Samaria', 'The returning exiles meet exclusion, and in the story the rejected group founds Samaria. This is the story’s own account, not the history of the Samaritans.', '4 Baruch 8:1–12 (Kraft and Purintun)'),
      ev('rpe20', 22, 'rp', 'Jeremiah’s last days', 'After nine days of sacrifice, Jeremiah appears dead for three days, revives, prophesies Christ and is stoned. This Christian ending is the work’s own; the hostile crowd is not the atlas’s picture of any people.', '4 Baruch 9:1–32 (Kraft and Purintun)'),

      /* ---- NT-related gospels (slots 23–28). nt-apocrypha-integration.csv nta-pj-scene … nta-gj-scene, one entry per
         narrative cluster; chapter labels from nt-apocrypha-coverage.csv. Editions per nt-apocrypha-sources.md: Roberts–
         Donaldson (Protevangelium), M. R. James 1924 (Infancy Thomas Greek A), the hosted Gospel of Peter and Gospel of Mary
         translations (translators/licences not established: paraphrase only), Patterson and Meyer's Scholars Version
         (Gospel of Thomas, copyright: paraphrase only), Mattison (Gospel of Judas, public domain). ---- */
      ev('nta-pj-scene', 23, 'nta', 'Mary’s birth, and the birth in the cave', 'Joachim withdraws and Anna prays; Mary is born to them and dedicated at the temple, which the story places in Jerusalem. Joseph, who already has children, is chosen to take her into his care. She works on the temple veil, receives the annunciation and visits Elizabeth. Accused, she and Joseph undergo an ordeal; Joseph’s household then travels toward Bethlehem, and the birth takes place in a cave, with a midwife and Salome, whose test and healing are the story’s account. The Magi come and leave another way; there is a hiding, and Zacharias is killed and succeeded by Simeon. Ages and months are the story’s own chronology, and the narrator’s claim to be James is a literary one.', 'Protevangelium of James 1–25 (Roberts–Donaldson)', 'jerusalem'),
      ev('nta-it-scene', 24, 'nta', 'The child’s wonders', 'Stories of the child Jesus, in Greek A’s nineteen chapters: wonders that harm and are then reversed, clashes with teachers, Zeno, carrying water, a harvest, carpentry, the healing of James, and people brought back to life. This witness does not name the village. The ages five, six, eight and twelve are the story’s markers. In the last chapter his parents go up to Jerusalem and return.', 'Infancy Gospel of Thomas, Greek A I–XIX (M. R. James)'),
      ev('nta-gp-scene', 25, 'nta', 'The Gospel of Peter fragment', 'The surviving fragment runs from a judgment through the execution and darkness, the burial in Joseph’s garden tomb, guards under Petronius, a resurrection vision in which a cross speaks, and the women’s visit to the tomb. It breaks off beside a sea it does not name. Its collective accusations against the Jews are the narrative’s polemic, not this atlas’s history, and the missing ending is not supplied from the canonical gospels.', 'Gospel of Peter 1–14 (hosted translation; translator not identified)'),
      ev('nta-gt-scene', 26, 'nta', 'A collection of sayings', 'A prologue under Thomas’s name and 114 sayings, with no travel story. A few sayings name disciples: James, Peter, Matthew and Thomas (12–13) and Salome (61); saying 60 mentions a Samaritan going into Judea. Its language of kingdom, light and Paradise does not describe a place. The translation is under copyright, so nothing here is quoted.', 'Gospel of Thomas, prologue and sayings 1–114 (Scholars Version)'),
      ev('nta-gm-scene', 27, 'nta', 'Mary and the disciples', 'In what survives, Mary encourages the disciples and tells of a vision; Andrew and Peter object, and Levi defends her. A passage on a soul’s ascent survives without its beginning, so the soul is not identified. Codex pages 1–6 and 11–14 are lost and are not filled in from the Greek fragments. No place, route or marriage is stated.', 'Gospel of Mary 4:22–39; 5:1–11; 8:10–24; 9:1–10 (hosted translation)'),
      ev('nta-gj-scene', 28, 'nta', 'Conversations before Passover', 'Set in Judea in the days before Passover, Jesus speaks with the disciples and with Judas. The disciples’ vision of an altar, Judas’s vision of a house and the account of the cosmos and its rulers are separate levels of the story. The damaged text closes with Judas handing Jesus over for money. Whether the work presents Judas favourably is contested; gaps and restored names are kept as the translator marks them.', 'Gospel of Judas, Codex Tchacos 33–58 (Mattison)'),

      /* ---- Acts of Paul, including Thecla (slot 29). nta-pt-panchares … nta-pt-unplaced, one entry per cluster, in the
         work's section order. M. R. James 1924 (Coptic episodes fragmentary; VIII and XI known only from quotations).
         Only the Roman martyrdom attaches to an anchor (Rome); which Antioch is meant is not settled. ---- */
      ev('nta-pt-panchares', 29, 'nta', 'Panchares and Phila', 'A fragmentary story of Panchares, Phila and a son. Its setting at Antioch and the son’s suggested name, Barnabas, come from outside testimony and the editor’s reconstruction.', 'Acts of Paul I (M. R. James; fragmentary Coptic)'),
      ev('nta-pt-scene', 29, 'nta', 'Paul and Thecla', 'Paul comes from Antioch to Iconium; the road toward Lystra is a meeting place, not a proven visit to Lystra. Thecla leaves confinement to visit the prison, survives the pyre and rejoins Paul near a roadside tomb. At Antioch (which Antioch is not settled) she encounters Alexander and faces the beasts; Tryphaena, whose daughter Falconilla has died, protects her, and faints but does not die. Thecla baptizes herself, later finds Paul at Myra, returns to Iconium and goes on to Seleucia. Paul sends her to teach; there is no marriage. Endings printed after the episode, on a mountain and at Rome, are later variants.', 'Acts of Paul II.1–43 (M. R. James)'),
      ev('nta-pt-myra', 29, 'nta', 'At Myra', 'Episodes with Hermocrates and Nympha, and with Dion and Hermippus. Paul then leaves toward Sidon.', 'Acts of Paul III (M. R. James; fragmentary Coptic)'),
      ev('nta-pt-sidon-tyre', 29, 'nta', 'Sidon and Tyre', 'Companions from Perga, an episode at a temple in Sidon, and fragments at Tyre. Uncertain names stay uncertain, and a broken mention of Jerusalem is not made into a journey.', 'Acts of Paul IV–V (M. R. James; fragmentary Coptic)'),
      ev('nta-pt-frontina', 29, 'nta', 'Frontina and the mines', 'Longinus, Firmilla and Frontina, and the mines. None of it is located, and Philippi is not inferred from the section that follows.', 'Acts of Paul VI (M. R. James; fragmentary Coptic)'),
      ev('nta-pt-correspondence', 29, 'nta', 'Letters with the Corinthians', 'A letter from the Corinthians, how it reached Paul, and his reply, known as Third Corinthians, with its teaching on resurrection and creation. It belongs to this work and is not one of the New Testament letters.', 'Acts of Paul VII (M. R. James)'),
      ev('nta-pt-ephesus', 29, 'nta', 'Ephesus, in quotations', 'Known only from quotations by Hippolytus and Nicephorus: a lion, and Eubula and Artemilla. Quotations, not the recovered episode.', 'Acts of Paul VIII (M. R. James; quoted by later writers)'),
      ev('nta-pt-prophecy', 29, 'nta', 'A prophecy about Rome', 'A fragmentary prophecy by Cleobius and Myrte about Rome.', 'Acts of Paul IX (M. R. James; fragmentary)'),
      ev('nta-pt-martyrdom', 29, 'nta', 'Paul’s death at Rome', 'At Rome, with Patroclus, Nero, Longus and Cestus in the story, Paul is beheaded, and milk is said to flow. He appears afterward, and Titus and Luke are at his grave. No execution site or tomb is located.', 'Acts of Paul X.1–7 (M. R. James)', 'rome'),
      ev('nta-pt-unplaced', 29, 'nta', 'Quotations by later writers', 'Short passages that Origen, Clement, Pseudo-Cyprian, Lactantius, Commodian and John of Salisbury connect with Paul’s acts. Each is attributed to its writer; which part of the work it belongs to is uncertain, and none is added to Paul’s route. Suggested links to Peter are conjecture.', 'Acts of Paul XI (M. R. James, Wikisource)'),

      /* ---- Acts of Peter (slot 30). nta-ape-paul-departure … nta-ape-gardener, one entry per cluster. M. R. James 1924:
         the Latin (Vercelli) text to XXIX and Greek from XXX, a separate Coptic fragment, and a story known only from
         later testimony. Scenes set in Rome attach to the Rome anchor; no execution or burial site is located. ---- */
      ev('nta-ape-paul-departure', 30, 'nta', 'Paul leaves Rome', 'Paul sets out from Rome toward Spain, with a departure scene by the Tiber, and the episode of Rufina. This is the Acts of Peter’s own account of Paul.', 'Acts of Peter I–III (M. R. James; Latin)', 'rome'),
      ev('nta-ape-peter-arrival', 30, 'nta', 'Simon and Peter come to Rome', 'Simon comes to Rome from Aricia. Peter travels from Jerusalem by Caesarea and Puteoli to Rome; Theon is baptized during the voyage, and Ariston meets Peter at Puteoli. Peter declines to stay there and goes on to the house of Narcissus in Rome. The six days and nights of the voyage are the story’s own count, not a sailing calendar.', 'Acts of Peter IV–VI (M. R. James; Latin)'),
      ev('nta-ape-marcellus', 30, 'nta', 'Peter and Marcellus', 'Peter teaches Marcellus and reconciles him. A dog speaks, a statue is repaired and a fish is revived: wonders of the story. Marcellus’s house is in Rome; the contest in the Forum is announced here and held later.', 'Acts of Peter VII–XVI (M. R. James; Latin)', 'rome'),
      ev('nta-ape-eubula', 30, 'nta', 'Peter remembers Eubula', 'Peter recalls an earlier episode in Judaea, with Eubula, Simon, and Agrippinus or Pompeius. The gate at Neapolis and the cave are uncertain. A memory, not a new leg of Peter’s journey to Rome.', 'Acts of Peter XVII (M. R. James; Latin)'),
      ev('nta-ape-contest', 30, 'nta', 'The contest in the Forum', 'Peter teaches and heals in Marcellus’s household. In the contest with Simon in the Forum, the dead are raised, Nicostratus among them. Servants who are freed keep their freedom, and Chryse makes a gift. A vision in this section uses racialized imagery: the work’s polemic, not a description of any people.', 'Acts of Peter XVIII–XXXI (M. R. James; Latin to XXIX, Greek from XXX)', 'rome'),
      ev('nta-ape-martyrdom', 30, 'nta', 'Simon’s fall and Peter’s death', 'Simon falls at Rome and goes by Aricia to Terracina. Peter leaves the city, sees Jesus in a vision and returns; he is crucified head downward, and Marcellus buries him. Agrippa is the story’s prefect, not assumed to be a Herodian king. No site at the Vatican and no historical date are given, and the editor flags the addition in XLI.', 'Acts of Peter XXXII–XLI (M. R. James; Greek)', 'rome'),
      ev('nta-ape-daughter', 30, 'nta', 'Peter’s daughter', 'In a separate Coptic fragment, Peter’s unnamed daughter is healed and then disabled again; Ptolemaeus is part of the story, and property goes to the poor. The missing leaf is the editor’s reconstruction. Naming her Petronilla, or setting the story in Jerusalem, is not secure.', 'Acts of Peter, Coptic fragment (M. R. James)'),
      ev('nta-ape-gardener', 30, 'nta', 'The gardener’s daughter', 'A story of a gardener’s daughter, known only from later writers (Titus; Augustine). No setting is added, and she is not merged with Peter’s daughter.', 'Acts of Peter, later testimony (M. R. James)'),

      /* ---- Acts of John (slot 31). nta-aj-lycomedes … nta-aj-death. M. R. James 1924: the Greek sequence, Latin
         supplements, and two detached fragments read from unproofread Wikisource scans (printed pp. 264–266). None pinned. ---- */
      ev('nta-aj-lycomedes', 31, 'nta', 'Lycomedes and Cleopatra', 'John comes from Miletus to Ephesus. Lycomedes and his wife Cleopatra are restored. The portrait Lycomedes commissions belongs to the story, not to any surviving object.', 'Acts of John 18–29 (M. R. James)'),
      ev('nta-aj-artemis', 31, 'nta', 'The theatre and the temple of Artemis', 'At Ephesus, a healing in the theatre; the temple of Artemis collapses, and its priest is revived. John puts off leaving for Smyrna. One manuscript’s four years at Smyrna, with Bucolus and Polycarp, is a variant and is not added.', 'Acts of John 30–47 (M. R. James)'),
      ev('nta-aj-parricide', 31, 'nta', 'The young man and his father', 'Outside Ephesus, a young man’s murdered father is revived. John’s rejection of the young man’s self-castration is part of the explanation. An invitation to Smyrna is not a completed journey.', 'Acts of John 48–55 (M. R. James)'),
      ev('nta-aj-inn', 31, 'nta', 'The inn and the bugs', 'John sets out toward Ephesus; a manuscript heading reported by James names the route as Laodicea to Ephesus. At an unnamed inn the bugs obey, and the household of Andronicus appears. The gap at 55–58 is not filled.', 'Acts of John 58–62 (M. R. James)'),
      ev('nta-aj-drusiana', 31, 'nta', 'Drusiana', 'Drusiana, wife of Andronicus, is in the tomb when Callimachus attempts to abuse her body; Fortunatus and a serpent are part of the scene. Revivals follow, and Fortunatus later dies. The tomb belongs to the story, with no modern location.', 'Acts of John 63–86 (M. R. James)'),
      ev('nta-aj-christ-discourse', 31, 'nta', 'John’s account of Jesus', 'John tells of a Christ who appears in changing forms, of a hymn and dance, of Gennesaret, and of a vision in a cave on the Mount of Olives while the crucifixion takes place at Jerusalem. The cross of light, distinct from the wooden cross, is this narrator’s teaching, not harmonized with the gospels.', 'Acts of John 87–105 (M. R. James)'),
      ev('nta-aj-latin-supplement', 31, 'nta', 'The Latin supplements', 'Craton and the gems; John goes from Ephesus to Pergamum; Atticus and Eugenius and their wealth; Stacteus; the poison trial with Aristodemus. Latin XIX is the editor’s summary, and a later sentence about founding churches is marked separately.', 'Acts of John, Latin XIV–XXI (M. R. James)'),
      ev('nta-aj-oxyrhynchus', 31, 'nta', 'A papyrus fragment', 'Scraps of a papyrus: an unnamed bridge over a deep river, a soldier’s apparition, Zeuxis and the eucharist, and a letter from an emperor. The page order and the emperor’s restored name are uncertain. These scraps do not establish a trial at Rome or an exile on Patmos.', 'P. Oxy. 850 (M. R. James pp. 264–265; Wikisource scan, unproofread)'),
      ev('nta-aj-titus', 31, 'nta', 'Quotations in Titus', 'Two quoted passages: a demon’s speech, and an excerpt on chastity at a wedding. The name Verus for Dyrus is the editor’s emendation, and placing these before Ephesus is conjecture. The 31 clauses James left out as corrupt are not read.', 'Quotations b–c (M. R. James p. 266; Wikisource scan, unproofread)'),
      ev('nta-aj-death', 31, 'nta', 'John’s death', 'John says farewell and shares communion; a trench is dug for a tomb outside a gate, and he dies. Other witnesses end with an empty tomb, manna or sandals; they are alternatives and are not merged.', 'Acts of John 106–115 (M. R. James)'),

      /* ---- Acts of Andrew (slot 32). nta-aa-epitome-route … nta-aa-martyrdom. M. R. James 1924: an abstract of Gregory's
         epitome (mediated), the Vatican Gr. 808 fragment, quotations, and a martyrdom James assembles from several
         witnesses. The original Acts is lost. None pinned. ---- */
      ev('nta-aa-epitome-route', 32, 'nta', 'Andrew’s travels, in Gregory’s epitome', 'Known through Gregory’s epitome as James abstracts it: Andrew goes by Amasea, Sinope, Nicaea, Nicomedia, the Hellespont, Byzantium, Thrace, Perinthus, Philippi and Thessalonica, then to Patrae; Corinth, Lacedaemon and Megara come in later episodes. Episodes name Exoos, Medias and Philomedes, Nicolaus, Virinus, a voyage of twelve days, Lesbius, Callisto and Trophima, Philopator and Sostratus, and Stratocles and Alcman, and end with the martyrdom and the reception at his tomb. These are the epitome’s claims, not the original itinerary, and its cures are the story’s. The Mermidona story comes from the Andrew and Matthew tradition and is not counted as part of the original Acts.', 'Acts of Andrew, Gregory’s epitome 1–38 (M. R. James’s abstract)'),
      ev('nta-aa-prison', 32, 'nta', 'Andrew in prison', 'In the surviving fragment, Maximilla, Iphidamia and Stratocles visit Andrew while Aegeates presses his wife. Andrew’s comparison with Adam and Eve is teaching, not descent or rebirth. The fragment breaks off before the discourse ends.', 'Acts of Andrew, Vatican Gr. 808 §§1–18 (M. R. James)'),
      ev('nta-aa-detached', 32, 'nta', 'Quotations by Titus and Evodius', 'Passages on cousin marriage, and on Maximilla and Euclia, each with its own witness’s qualifications.', 'Acts of Andrew, quotations (M. R. James)'),
      ev('nta-aa-martyrdom', 32, 'nta', 'Andrew’s death at Patrae', 'On the seashore at Patrae Andrew is bound to a cross and refuses release; Maximilla buries him, and Aegeates dies. The witnesses give different crowd sizes, and no X-shaped cross is stated here. The feast on 30 November is a later observance, not a recovered date. James assembles the account from several witnesses; the full original is lost.', 'Acts of Andrew, martyrdom (M. R. James, from several witnesses)'),

      /* ---- Acts of Thomas (slot 33). nta-at-sale-wedding … nta-at-death-relics. M. R. James 1924; Greek and Syriac
         readings differ section by section. India is an ancient name, not a modern country. None pinned. ---- */
      ev('nta-at-sale-wedding', 33, 'nta', 'Thomas is sold', 'At Jerusalem the apostles’ fields of mission are allotted. Jesus sells Thomas to Abbanes, envoy of King Gundaphorus; they sail to Andrapolis, whose location is unresolved, where a royal wedding ends in an ascetic conversion. Calling Jesus Thomas’s brother is the work’s literary claim.', 'Acts of Thomas 1–16 (M. R. James)'),
      ev('nta-at-palace', 33, 'nta', 'The palace in heaven', 'Gundaphorus commissions a palace; Thomas gives the money as alms. Gad, the king’s brother, sees a palace in heaven. The months from Dius to Xanthicus are the story’s own, not converted to dates.', 'Acts of Thomas 17–29 (M. R. James)'),
      ev('nta-at-serpent-colt', 33, 'nta', 'The serpent and the colt', 'On an unnamed road, a serpent and a youth; a colt speaks and carries Thomas to the city gate. The animals’ descent from biblical animals is the story’s myth.', 'Acts of Thomas 30–41 (M. R. James)'),
      ev('nta-at-woman', 33, 'nta', 'A woman freed', 'A woman is freed from a demon and initiated. A river appears only in a Syriac variant and is not added.', 'Acts of Thomas 42–50 (M. R. James)'),
      ev('nta-at-murder', 33, 'nta', 'The murdered woman', 'A murder is condemned; the murdered woman is raised at the inn and tells of the punishments she saw. Her journey is a vision, not a place on Earth, and §§55–56 differ or are absent in the Syriac.', 'Acts of Thomas 51–61 (M. R. James)'),
      ev('nta-at-siphor', 33, 'nta', 'Siphor the captain', 'Siphor asks help for his wife and daughter. A journey by chariot, wild asses, and the arrival at the captain’s house, where they are healed. The city in India is not named.', 'Acts of Thomas 62–81 (M. R. James)'),
      ev('nta-at-mygdonia', 33, 'nta', 'Mygdonia', 'Mygdonia, wife of Charisius, hears the teaching and resists coercion. An arrest under King Misdaeus and a release follow; her household is initiated with her nurse Narcia (Marcia in some witnesses), and Siphor’s family is baptized. Charisius is the king’s kinsman; the exact relation is not inferred.', 'Acts of Thomas 82–107, 114–133 (M. R. James)'),
      ev('nta-at-hymn', 33, 'nta', 'The Hymn of the Soul', 'A poem set into the work: a prince goes from the East by Maishan and Babylon to Egypt, and returns by Sarbug and Mesene. A symbolic journey, not Thomas travelling to Egypt; what the names refer to is uncertain. James leaves out the Syriac Song of Praise that follows.', 'Acts of Thomas 108–113 (M. R. James)'),
      ev('nta-at-tertia', 33, 'nta', 'Tertia and the king', 'Tertia, wife of Misdaeus, learns from Mygdonia and Thomas. The king strikes Thomas, and Iuzanes, the king’s son, questions him; heated plates and a flood follow. The court and prison are not named.', 'Acts of Thomas 134–143 (M. R. James)'),
      ev('nta-at-initiation', 33, 'nta', 'Iuzanes and Mnesara', 'Iuzanes and his wife Mnesara (he is 21 and seven years married, by the story’s count) are healed and initiated at their house, and Thomas returns to the prison. In some manuscripts the prayer stands after §167. Narcia is a nurse, not anyone’s mother.', 'Acts of Thomas 144–163 (M. R. James)'),
      ev('nta-at-death-relics', 33, 'nta', 'Thomas’s death', 'A mile outside the city the king hands Thomas to soldiers, who take him up an unnamed mountain, where four of them spear him. He is buried in a royal tomb. Siphor becomes a presbyter and Iuzanes a deacon; the women persist. His remains are carried to Mesopotamia; Misdaeus’s son is healed with dust from the tomb, and the king converts. These passages name no Mylapore, Chennai or Edessa, and give no year.', 'Acts of Thomas 164–170 (M. R. James)'),

      /* ---- Apocalypse of Peter (slot 34). nta-ap-akhmim … nta-ap-sibylline-comparison. M. R. James 1924. The Greek
         (Akhmim) and Ethiopic witnesses differ in order and are not merged. None pinned; the westward commission is not Rome. ---- */
      ev('nta-ap-akhmim', 34, 'nta', 'The Akhmim fragment', 'On an unnamed mountain, radiant figures appear, and the realms of the blessed and of the punished are shown. Settings of a vision, not places on Earth.', 'Apocalypse of Peter, Akhmim Greek B1–34 (M. R. James)'),
      ev('nta-ap-ethiopic', 34, 'nta', 'The Ethiopic text', 'Set on the Mount of Olives: resurrection, judgment and punishments, Acherusia and Elysium, paradise, Moses and Elijah, and an ascent in a cloud. Its order differs from the Greek; the scenes are not merged, and the Greek fragment’s mountain is not renamed. A command to go west does not by itself mean Rome.', 'Apocalypse of Peter, Ethiopic D (M. R. James)'),
      ev('nta-ap-excerpts', 34, 'nta', 'Quotations and excerpts', 'Quotations by early writers and a Bodleian leaf; separately, selected later Ethiopic excerpts, which are not a full continuation.', 'Apocalypse of Peter A, C and later Ethiopic excerpts (M. R. James)'),
      ev('nta-ap-sibylline-comparison', 34, 'nta', 'A Sibylline parallel', 'A passage from a separate Sibylline work, printed by James for comparison; it is not another chapter of this apocalypse. Whether the apocalypse teaches a final restoration of all is an editors’ debate. Its lists of punishments are the work’s own, not judgments endorsed here.', 'M. R. James, appendix II, lines 190–338'),

      /* ---- Apocalypse of Paul (slot 35). nta-apa-discovery … nta-apa-paradise. M. R. James 1924 on Wikisource, the
         Latin-based text; not the Coptic Apocalypse of Paul from Nag Hammadi. Every realm is visionary; none pinned,
         and the heavenly city called Jerusalem is not the Jerusalem anchor. ---- */
      ev('nta-apa-discovery', 35, 'nta', 'The box at Tarsus', 'The work’s own story of being found in a box at Tarsus, with copies for the emperor and for Jerusalem. A framing story, not an authenticated discovery.', 'Apocalypse of Paul 1–2 (M. R. James)'),
      ev('nta-apa-souls', 35, 'nta', 'Creation’s appeal and the souls', 'Creation makes its appeals, angels report, and souls leave their bodies and are judged. Michael appears, and an angel named Tartaruchus in some versions is Temeluchus in others.', 'Apocalypse of Paul 3–18 (M. R. James)'),
      ev('nta-apa-promised-land', 35, 'nta', 'The third heaven and the promised land', 'Paul is taken to the third heaven and paradise, then down through the levels of the cosmos to the Ocean, the promised land, the Acherusian lake and the city of Christ.', 'Apocalypse of Paul 19–24 (M. R. James)'),
      ev('nta-apa-city', 35, 'nta', 'The city of Christ', 'Rivers named Phison, Euphrates, Geon and Tigris flow with honey, milk, oil and wine, and David’s altar stands in the city, here called Jerusalem. A vision: not the real rivers, and not the earthly city.', 'Apocalypse of Paul 25–30 (M. R. James)'),
      ev('nta-apa-punishment', 35, 'nta', 'The places of punishment', 'In the western regions Paul sees punishments by category, among them clergy and lenders at interest. The polemic on confession and sexuality differs by witness: a Latin paragraph in §39 is absent from the other versions. Michael and Christ intercede and a Sunday rest is granted; this is not a final salvation of all.', 'Apocalypse of Paul 31–44 (M. R. James)'),
      ev('nta-apa-paradise', 35, 'nta', 'Paradise', 'In paradise: Adam and Eve, Mary, the patriarchs and prophets, Noah, Elijah and Elisha. The text ends abruptly. A Syriac ending returns to Tarsus; the Coptic continuation is the editor’s summary and excerpts, and its Mount of Olives and 29 June are not facts about Paul.', 'Apocalypse of Paul 45–51; appendices kept separate (M. R. James)'),
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
          ref('Nineveh', 1, 'dc', 'Tobit: the city where Tobit lives in exile and where the story begins and ends.', '', [[2, 'Judith: Nebuchadnezzar’s capital in that book’s telling.']]),
          ref('Ecbatana, in Media', 1, 'dc', 'Tobit: the home of Raguel, Edna and Sarah, where Tobiah marries Sarah and later settles.', '', [[2, 'Judith: the city of Arphaxad, captured by Nebuchadnezzar.']]),
          ref('Rages, in Media', 1, 'dc', 'Tobit: where Gabael keeps the money Tobit left in trust.'),
          ref('Thisbe', 1, 'dc', 'Tobit: Tobit’s home in Naphtali before his deportation.'),
          ref('The Tigris', 1, 'dc', 'Tobit: the river where Tobiah catches the fish on the journey out.', '', [[4, 'Sirach: one of six rivers used as images of Wisdom’s abundance (24:25–27); a comparison, not a journey.']]),
          ref('Kaserin', 1, 'dc', 'Tobit: a place opposite Nineveh where Tobiah and Raphael go ahead of Sarah on the way home.'),
          ref('Upper Egypt', 1, 'dc', 'Tobit: where the demon Asmodeus flees and is bound. A destination in the story, not a mapped event.'),
          ref('Bethulia', 2, 'dc', 'Judith: Judith’s town, besieged by Holofernes. Its location is not identified, so it has no pin.'),
          ref('Betomesthaim', 2, 'dc', 'Judith: a town told, with Bethulia, to hold the mountain passes.'),
          ref('The Red Sea', 2, 'dc', 'Judith: named in Achior’s account of Israel’s past. No crossing point is mapped.', '', [[3, 'Wisdom: the sea the oppressed people pass through.']]),
          /* Tobit and Judith (slots 1–2): the remaining dc-ref-* place-reference rows with first = 1 or 2. Each entry
             says only what the chapter cards dc-tob-01…14 and dc-jdt-01…16 state; names that appear only in a list
             (Nebuchadnezzar’s summons, Holofernes’s campaign, the warned towns) are described as such, not given a
             role. Later works’ mentions are gated `more` text. Similar names are kept apart (Kedesh, Kadesh and
             Kadesh-barnea; Sur and Bethsura; Belmain and Belmaim; Choba and Chobai; Dothan and Dothaim). */
          ref('Media', 1, 'dc', 'Tobit: where Tobit trades and leaves ten talents in trust with Gabael at Rages (ch. 1); Ecbatana, Sarah’s home, is in Media (ch. 3). Dying, Tobit urges Tobiah and his seven sons to go to Media, in light of Nahum’s prophecy (ch. 14).', '', [
            [6, 'First Maccabees: named in chapter 1 (Alexander’s conquests), among the reports of Roman power (ch. 8), and in chapter 14, the chapter of Demetrius’s capture by Arsaces.'],
          ]),
          ref('Egypt', 1, 'dc', 'Tobit: the demon flees to upper Egypt (ch. 8; see Upper Egypt). No binding site is mapped.', '', [
            [2, 'Judith: “the river of Egypt” and Egyptian towns are in the list of lands Nebuchadnezzar summons (ch. 1); Achior’s account of Israel’s past goes from Canaan to Egypt and out by the Red Sea (ch. 5).'],
            [3, 'Wisdom: chapter 16 contrasts Egypt and Israel. A literary contrast, not a mapped event.'],
            [4, 'Sirach: the translator says in the prologue that he came to Egypt in the thirty-eighth year of King Euergetes. Where he set out from is not stated.'],
            [6, 'First Maccabees: Antiochus Epiphanes’ Egyptian campaign (ch. 1); recalled among ancestral memories (ch. 2); Lysias is left over the lands west of the Euphrates, Egypt included (ch. 3); named again in chapter 11, the chapter of Ptolemy’s invasion.'],
            [7, 'Second Maccabees: the opening letters are addressed to Jews in Egypt (ch. 1); Antiochus’s second Egyptian campaign, and Jason’s flight, which passes through Egypt (ch. 5); Philip brings Antiochus’s body home, then flees to Ptolemy Philometor in Egypt (ch. 9). Also named in chapter 4.'],
            [8, 'Esther additions: Mordecai’s prayer recalls Egypt (C).'],
          ]),
          ref('Elymais', 1, 'dc', 'Tobit: named in chapter 2. Editions differ on who goes there (the RV reads “until I went into Elymais”, with a “he went” variant), so no journey is assigned.', '', [
            [6, 'First Maccabees: “Elymais in Persia”, which Antiochus Epiphanes fails to plunder before he dies in a foreign land (ch. 6). Kept separate from the death accounts in 2 Maccabees.'],
          ]),
          ref('Kedesh', 1, 'dc', 'Tobit: Thisbe, Tobit’s home, is described as near Kedesh of Naphtali (ch. 1). Kept separate from Kadesh and Kadesh-barnea in Judith.', '', [
            [6, 'First Maccabees: named in chapter 11, in the wars of Ptolemy and Demetrius and Jonathan’s campaigns.'],
          ]),
          ref('Ararat', 1, 'dc', 'Tobit: where Sennacherib’s sons flee after his assassination (ch. 1).'),
          ref('Dan', 1, 'dc', 'Tobit: in Tobit’s memory of his youth, his pilgrimages to Jerusalem are set against worship at Dan (ch. 1).'),
          ref('Phogor', 1, 'dc', 'Tobit: named with Thisbe in Tobit’s home region (ch. 1). The notes leave both unidentified.'),
          ref('Tobit’s remembered home region', 1, 'dc', 'Tobit: the Naphtali homeland Tobit recalls before his deportation to Nineveh (ch. 1). A remembered region, without a location.'),
          ref('Sarah and Tobiah’s bridal chamber', 1, 'dc', 'Tobit: where the fish smoke drives the demon away and the couple pray (ch. 8). A story setting, not a located room.'),
          ref('Persia', 2, 'dc', 'Judith: first in the list of lands Nebuchadnezzar summons to his war (ch. 1).', '', [
            [6, 'First Maccabees: named in chapter 1 (Alexander’s conquests) and in chapter 6, where Elymais is “in Persia”.'],
            [7, 'Second Maccabees: the opening letter’s story of the hidden fire recovered under Nehemiah ends with Persian recognition (ch. 1); named again in chapter 9, where Antiochus fails to plunder the temple at Persepolis.'],
          ]),
          ref('Cilicia', 2, 'dc', 'Judith: in the list of lands summoned (ch. 1); Holofernes’s campaign passes Upper Cilicia and later Cilicia (ch. 2). A note calls the three-day march from Nineveh impossible: a narrative sequence, not a route.', '', [
            [6, 'First Maccabees: named in chapter 11, in the wars of Ptolemy and Demetrius and Jonathan’s campaigns.'],
            [7, 'Second Maccabees: named in chapter 4 with Tarsus and Mallus, whose revolt draws Antiochus away.'],
          ]),
          ref('Damascus', 2, 'dc', 'Judith: in the list of lands summoned (ch. 1); Holofernes’s campaign sequence ends at Damascus (ch. 2); after his death the Israelites pursue the fleeing army beyond Damascus (ch. 15), a broad direction only.', '', [
            [6, 'First Maccabees: Jonathan’s campaign reaches it (ch. 11), and after campaigning toward Hamath he returns by Damascus to Jerusalem (ch. 12).'],
          ]),
          ref('Gilead', 2, 'dc', 'Judith: in the list of lands summoned (ch. 1); people of Gilead and Galilee join the pursuit (ch. 15).', '', [
            [6, 'First Maccabees: Judas and Jonathan cross the Jordan to relieve the besieged in Gilead (ch. 5; see Mizpeh of Gilead and Bosora); named again in chapter 13, the chapter of Jonathan’s death.'],
          ]),
          ref('Galilee', 2, 'dc', 'Judith: in the list of lands summoned (ch. 1); people of Galilee join the pursuit (ch. 15).', '', [
            [6, 'First Maccabees: Simon brings the Jews of Galilee and Arbatta into Judaea (ch. 5).'],
          ]),
          ref('Samaria', 2, 'dc', 'Judith: in the list of lands summoned (ch. 1), and the first of the places warned to prepare (ch. 4).', '', [
            [6, 'First Maccabees: named in chapter 3, the chapter of Judas’s victories over Apollonius and Seron; in chapter 5 the RV prints “Samaria” with “Marisa” as an alternative reading; named again in chapter 11.'],
            [7, 'Second Maccabees: the region of Samaria is named in the chapter of Nicanor’s planned Sabbath attack (ch. 15).'],
          ]),
          ref('The Jordan', 2, 'dc', 'Judith: in the list of lands summoned (ch. 1); named in Achior’s account of Israel’s past (ch. 5).', '', [
            [4, 'Sirach: one of six rivers whose fullness is compared with the Law’s wisdom (24:25–27).'],
            [6, 'First Maccabees: Judas and Jonathan cross it for the Gilead campaign and come back over it by Bethshan (ch. 5); an escape across the Jordan in chapter 9, during the fighting with Bacchides.'],
          ]),
          ref('Jericho', 2, 'dc', 'Judith: one of the places warned to prepare for Holofernes (ch. 4).', '', [
            [4, 'Sirach: one of four places whose plants are images for Wisdom (24:13–14).'],
            [6, 'First Maccabees: named in chapter 9, in Bacchides’s campaign; the plain of Jericho is named in chapter 16, with Dok, where Simon and two of his sons are murdered.'],
          ]),
          ref('The Euphrates', 2, 'dc', 'Judith: one of the rivers named with the coalition (ch. 1); Holofernes’s campaign sequence passes the Euphrates and Mesopotamia (ch. 2).', '', [
            [4, 'Sirach: one of the six river images for the Law’s wisdom (24:25–27).'],
            [6, 'First Maccabees: Antiochus leaves Lysias in charge of the lands west of the Euphrates (ch. 3).'],
          ]),
          ref('Judea (Judaea)', 2, 'dc', 'Judith: Judith promises to lead Holofernes through Judea to Jerusalem (ch. 11). A deceptive promise; the route is never travelled.', '', [
            [6, 'First Maccabees: Simon brings the Jews of Galilee and Arbatta into Judaea (ch. 5); named again in chapter 7, the chapter of Bacchides and Nicanor.'],
            [7, 'Second Maccabees: named in the opening letter (ch. 1), in Eupator’s campaign (ch. 13) and in Nicanor’s commission (ch. 14).'],
            [9, 'Bel and the Dragon: an angel carries Habakkuk from Judea to the lions’ den in Babylon and back.'],
          ]),
          ref('Lebanon', 2, 'dc', 'Judith: in the list of lands summoned (ch. 1).', '', [[4, 'Sirach: one of four places whose plants are images for Wisdom (24:13–14).']]),
          ref('Esdraelon', 2, 'dc', 'Judith: in the list of lands summoned (ch. 1); Holofernes approaches it near Dotaea (ch. 3); the passes Bethulia must hold are near it (ch. 4); the army camps between Belmaim and Cyamon by Esdraelon (ch. 7).'),
          ...['Antilebanon', 'Carmel', 'Bethany', 'Chelous', 'The river of Egypt', 'Tahpanhes', 'Raamses', 'Goshen', 'Tanis', 'Memphis', 'Ethiopia'].map((n) =>
            ref(n, 2, 'dc', 'Judith: named only in the list of lands Nebuchadnezzar summons to his war (ch. 1).'),
          ),
          ref('Kadesh', 2, 'dc', 'Judith: named only in the list of lands summoned (ch. 1). Kept separate from Kedesh in Tobit and from Kadesh-barnea.'),
          ref('Hydaspes', 2, 'dc', 'Judith: one of the rivers named with Nebuchadnezzar’s opponents (ch. 1), with the Euphrates and the Tigris.'),
          ref('Ragau', 2, 'dc', 'Judith: Nebuchadnezzar fights Arphaxad near Ragau (ch. 1). The notes call both kings, as portrayed, inventions of the story.'),
          ...['Bectileth', 'Put', 'Lud', 'Mesopotamia', 'Wadi Abron', 'Japheth', 'Midian'].map((n) =>
            ref(n, 2, 'dc', 'Judith: a name in Holofernes’s campaign sequence from Nineveh to Damascus (ch. 2). The note calls the sequence partly rhetorical; it is not a route.'),
          ),
          ref('Arabia', 2, 'dc', 'Judith: in Holofernes’s campaign sequence, with Japheth and Midian (ch. 2).', '', [
            [6, 'First Maccabees: Alexander flees to Arabia, where Zabdiel beheads him (ch. 11).'],
            [7, 'Second Maccabees: named in the account of Jason’s flight (ch. 5).'],
          ]),
          ...['Sidon', 'Ocina'].map((n) => ref(n, 2, 'dc', 'Judith: one of the coastal places struck with terror by Holofernes’s advance (ch. 2).')),
          ref('Sur', 2, 'dc', 'Judith: one of the coastal places struck with terror (ch. 2). Kept separate from Bethsura.'),
          ref('Tyre', 2, 'dc', 'Judith: one of the coastal places struck with terror (ch. 2).', '', [
            [6, 'First Maccabees: the Ladder of Tyre is named in chapter 11 (its own entry).'],
            [7, 'Second Maccabees: envoys are sent to the games at Tyre; later Jewish envoys are condemned there while Menelaus buys his acquittal (ch. 4).'],
          ]),
          ref('Jamnia', 2, 'dc', 'Judith: one of the coastal places struck with terror (ch. 2).', '', [
            [6, 'First Maccabees: named in the pursuit after Emmaus (ch. 4); Joseph son of Zacharias and Azarias are defeated there after acting without orders (ch. 5); named in chapter 10; Cendebaeus raids from it (ch. 15).'],
            [7, 'Second Maccabees: Judas burns its harbour (ch. 12).'],
          ]),
          ref('Azotus', 2, 'dc', 'Judith: one of the coastal places struck with terror (ch. 2).', '', [
            [6, 'First Maccabees: named in the pursuit after Emmaus (ch. 4); a campaign after Hebron (ch. 5); Jonathan and Simon defeat Apollonius near Joppa and Azotus and burn the temple of Dagon (ch. 10); named again in chapter 16.'],
          ]),
          ref('Ascalon', 2, 'dc', 'Judith: one of the coastal places struck with terror (ch. 2).', '', [[6, 'First Maccabees: it receives Jonathan (ch. 10); named again in chapters 11 and 12.']]),
          ref('Scythopolis', 2, 'dc', 'Judith: Holofernes camps between Geba and Scythopolis for a month (ch. 3).', '', [
            [7, 'Second Maccabees: its friendship is noted before Judas returns to Jerusalem for the feast of Weeks (ch. 12).'],
          ]),
          ref('Geba', 2, 'dc', 'Judith: Holofernes camps between Geba and Scythopolis (ch. 3).'),
          ref('Dotaea', 2, 'dc', 'Judith: Holofernes approaches Esdraelon near Dotaea (ch. 3). The RV spelling is kept; no modern identification is made.'),
          ref('Bethhoron', 2, 'dc', 'Judith: one of the places warned to prepare (ch. 4). Also spelled Beth-horon.', '', [
            [6, 'First Maccabees: Judas defeats Seron there after defeating Apollonius (ch. 3); named again in chapters 7 and 9.'],
          ]),
          ...['Kona', 'Belmain', 'Choba', 'Aesora', 'Salem'].map((n) => ref(n, 2, 'dc', 'Judith: one of the places warned to prepare for Holofernes (ch. 4). Spellings are not independently located.')),
          ref('Dothan', 2, 'dc', 'Judith: the passes Bethulia and Betomesthaim must hold are near Esdraelon and Dothan (ch. 4). Kept separate from Dothaim.'),
          ref('Canaan', 2, 'dc', 'Judith: in Achior’s account of Israel’s past, between the ancestors’ origins and Egypt (ch. 5).', '', [
            [5, 'Baruch: named in the Wisdom poem as a rhetorical comparison (ch. 3), not a journey.'],
          ]),
          ref('Sinai', 2, 'dc', 'Judith: in Achior’s account of Israel’s past, with Kadesh-barnea (ch. 5). Also called Horeb.', '', [
            [3, 'Wisdom: the notes give Horeb as background to the water from the rock (ch. 11).'],
            [4, 'Sirach: the notes read 17:12–13 in light of Sinai; Elijah is recalled at Sinai and Horeb (ch. 48).'],
          ]),
          ref('Kadesh-barnea', 2, 'dc', 'Judith: in Achior’s account of Israel’s past, with Sinai (ch. 5). An embedded history, not a verified route.'),
          ref('Holofernes’ camp', 2, 'dc', 'Judith: where Achior speaks before Holofernes (ch. 5); Judith enters it, returns to it each night, and leaves it with Holofernes’s head (chs. 10–13). No coordinates.'),
          ref('The hillfoot below Bethulia', 2, 'dc', 'Judith: where Achior is left bound and is rescued into the town (ch. 6).'),
          ref('The valley outside Bethulia', 2, 'dc', 'Judith: Judith and her maid cross it to reach the camp (ch. 10); she bathes and prays at its spring on three nights (ch. 12).'),
          ...['Dothaim', 'Belmaim', 'Cyamon'].map((n) => ref(n, 2, 'dc', n === 'Dothaim' ? 'Judith: the army camps between Dothaim and Belmaim (ch. 7); Judith’s husband Manasseh is buried between Dothaim and Balamon (ch. 8). Kept separate from Dothan.' : 'Judith: named in the siege of Bethulia, where the army camps by the spring (ch. 7). The siege layout is literary.')),
          ...['Ekrebel', 'Chusi', 'Mochmur'].map((n) => ref(n, 2, 'dc', 'Judith: named in the positions of the Edomite and Ammonite forces during the siege (ch. 7). The siege layout is literary.')),
          ref('Balamon', 2, 'dc', 'Judith: Manasseh, Judith’s husband, is buried between Dothaim and Balamon (ch. 8). No tomb is mapped.'),
          ...['Bebai', 'Chobai', 'Chola'].map((n) => ref(n, 2, 'dc', 'Judith: one of the places sent word after Holofernes’s death (ch. 15). Spelling variants are not independently located.')),
          ref('Shechem', 2, 'dc', 'Judith: her prayer recalls Simeon’s violence at Shechem (ch. 9). An attributed prayer, not the narrator’s endorsement.', '', [
            [4, 'Sirach: the people at Shechem are one of three groups the author names with hostility (50:25–26).'],
          ]),
          ref('The Nile', 3, 'dc', 'Wisdom: the notes give the Nile as the background of the river turned to blood. Not a mapped event.', '', [[4, 'Sirach: a river image for abundance (24:27) and for blessing (39:22). Wisdom and Sirach are not linked into one river course.']]),
          ref('The river Sud', 5, 'dc', 'Baruch: where the exiles in Babylon hear Baruch read. Its location is unknown.'),
          ref('Susa', 8, 'dc', 'Esther additions: where Mordecai has his dream, and where the counter-decree says Aman was punished.'),
          ref('Joakim’s garden', 9, 'dc', 'Susanna: the garden of Susanna’s husband in Babylon, where the elders threaten her.'),
          ref('The temple of Bel', 9, 'dc', 'Bel and the Dragon: the temple whose priests Daniel exposes. A story setting, not an identified building.'),
          ref('The lions’ den', 9, 'dc', 'Bel and the Dragon: where Daniel is thrown and Habakkuk brings the meal. Not the same episode as the den in Daniel 6.'),
          /* Sirach (slot 4): dc-ref-hermon, -engedi, -pishon, -gihon, -seir, -philistia; dc-sir-ophir. Ophir's
             Tobit 13 mention (dc-ref-ophir first 1) is not yet written up, so the entry is scoped to Sirach. */
          ref('Hermon', 4, 'dc', 'Sirach: one of four places whose trees and plants are images for Wisdom (24:13–14), with Lebanon, Engedi and Jericho. Not a journey stop.'),
          ref('Engedi', 4, 'dc', 'Sirach: its palms are an image for Wisdom (24:14). A simile, not a scene.'),
          ref('Pishon', 4, 'dc', 'Sirach: one of six rivers whose fullness is compared with the Law’s wisdom (24:25). Location unknown.'),
          ref('Gihon', 4, 'dc', 'Sirach: one of the six river images (24:27). A note raises a possible link with the Nile; the two names are kept separate here.'),
          ref('Seir', 4, 'dc', 'Sirach: one of three groups the author names with hostility (50:25–26). The polemic is the author’s, not this atlas’s judgment.'),
          ref('Philistia', 4, 'dc', 'Sirach: named in the author’s closing polemic (50:26), with Seir and the people at Shechem.'),
          ref('Ophir', 1, 'dc', 'Tobit: the hymn of chapter 13 pictures an ideal Jerusalem built with precious stones, among them stones of Ophir. Imagery, not a visit.', '', [[4, 'Sirach: a byword for fine gold (7:18). The notes say the port is unidentified; no voyage is shown.']]),
          /* 1 Maccabees (slot 6): the 94 dc-ref-* place-reference rows with first = 6, except Rome, which is a
             pinned anchor. Each entry says only what the chapter cards (dc-m1-c01…c16) state about the place;
             where a card only lists a name, the entry gives the chapter and its episode, not a role. Mentions in
             2 Maccabees (slot 7) are added with that work. Places first named in Tobit or Judith (Egypt, Media,
             Jordan, Jericho, Azotus and others) carry their 1 Maccabees text as gated `more` on their own entries. */
          ref('Sparta', 6, 'dc', 'First Maccabees: Jonathan’s envoys carry a letter to the Spartans claiming kinship through Abraham (ch. 12); friendship is renewed under Simon (ch. 14), and Sparta is among the recipients of the Roman letter (ch. 15). Also called the Spartans or Lacedaemonians.'),
          ref('Chittim', 6, 'dc', 'First Maccabees: named in chapter 1, in the account of Alexander’s conquests, and again in the reports of Roman power (ch. 8).'),
          ref('The City of David', 6, 'dc', 'First Maccabees: named in chapter 1, among the events in Jerusalem under Antiochus Epiphanes.'),
          ref('Modin', 6, 'dc', 'First Maccabees: the town Mattathias moves to from Jerusalem, where the resistance begins and where he is buried (ch. 2). Judas is buried there (ch. 9), and Simon raises a monument of seven pyramids over Jonathan’s bones (ch. 13). Named again in chapter 16.'),
          ref('Antioch', 6, 'dc', 'First Maccabees: the royal city Lysias returns to after his invasion (ch. 4) and the royal army returns to face Philip (ch. 6); Jonathan sends 3,000 men to rescue Demetrius there (ch. 11). Also named in chapter 3.'),
          ref('Emmaus', 6, 'dc', 'First Maccabees: where Ptolemy, Nicanor and Gorgias camp and Judas camps to its south (ch. 3), and where Judas defeats the camp (ch. 4). Named again in chapter 9. Kept separate from places of the same name in other works.'),
          ref('Mizpeh, opposite Jerusalem', 6, 'dc', 'First Maccabees: where Judas’s men gather to pray before Emmaus (ch. 3). Kept separate from Mizpeh of Gilead.'),
          ref('The Philistine plain', 6, 'dc', 'First Maccabees: named in Judas’s early campaigns (chs. 3–4), also as the Philistine country.'),
          ref('Gazara', 6, 'dc', 'First Maccabees: Judas pursues toward it after Emmaus (ch. 4) and after Adasa (ch. 7); it is taken under Simon (a note says some authorities read Gaza), and Simon’s son John commands there (ch. 13). John is at Gazara when he is warned of his father’s murder (ch. 16). Also named in chapters 9, 14 and 15.'),
          ref('Bethsura', 6, 'dc', 'First Maccabees: Lysias invades by way of it, and it is fortified with Mount Sion (ch. 4); Simon takes it (ch. 11). Also named in chapters 6, 9 and 14.'),
          ref('Idumaea', 6, 'dc', 'First Maccabees: Lysias invades by way of it (ch. 4), and Judas campaigns there (ch. 5). Also named in chapter 6.'),
          ref('Bethshan', 6, 'dc', 'First Maccabees: Judas and Jonathan return past it from Gilead (ch. 5); Tryphon meets Jonathan there before luring him to Ptolemais (ch. 12).'),
          ref('Ptolemais', 6, 'dc', 'First Maccabees: Alexander lands there in year 160 and marries Cleopatra there in year 162 (ch. 10); Jonathan is lured there and taken prisoner by Tryphon (ch. 12). Also named in chapters 5, 11 and 13.'),
          ref('Ephron', 6, 'dc', 'First Maccabees: a city Judas and Jonathan force their way through on the way back from Gilead (ch. 5).'),
          ref('Marisa', 6, 'dc', 'First Maccabees: an alternative reading at 5:66, where this edition prints Samaria.'),
          ref('Bosora', 6, 'dc', 'First Maccabees: taken by Judas and Jonathan in Gilead (ch. 5).'),
          ref('Mizpeh of Gilead', 6, 'dc', 'First Maccabees: a stop on the Gilead campaign (ch. 5). Kept separate from Mizpeh opposite Jerusalem.'),
          ref('Carnaim', 6, 'dc', 'First Maccabees: its temple is burned in the Gilead campaign (ch. 5).'),
          ref('Dathema', 6, 'dc', 'First Maccabees: a stop on the Gilead campaign (ch. 5).'),
          ref('Arbatta', 6, 'dc', 'First Maccabees: with Galilee, where Simon rescues the Jews and brings them to Judaea (ch. 5).'),
          ref('Hebron', 6, 'dc', 'First Maccabees: named in the campaign toward Hebron and Azotus that follows the Gilead expedition (ch. 5).'),
          ref('The wilderness on the Gilead campaign', 6, 'dc', 'First Maccabees: a wilderness crossed in the Gilead campaign (ch. 5). Not identified with any other wilderness scene.'),
          ...[
            'Akrabattine',
            'Jazer',
            'Tubias',
            'Casphor',
            'Maked',
            'Bosor',
            'Raphon',
          ].map((n) => ref(n, 6, 'dc', 'First Maccabees: named in Judas’s campaigns in Idumaea, Ammon and Gilead (ch. 5).')),
          ref('Bethzacharias', 6, 'dc', 'First Maccabees: where Eleazar kills an elephant and is crushed beneath it (ch. 6).'),
          ref('Bezeth', 6, 'dc', 'First Maccabees: a place of killings under Bacchides (ch. 7).'),
          ref('Adasa', 6, 'dc', 'First Maccabees: where Nicanor is defeated and killed on 13 Adar (ch. 7).'),
          ref('Capharsalama', 6, 'dc', 'First Maccabees: named in the fighting with Nicanor (ch. 7).'),
          ...['Gaul', 'Spain', 'Asia', 'India', 'Lydia', 'Greece'].map((n) =>
            ref(n, 6, 'dc', 'First Maccabees: named in the reports of Roman power that Judas hears (ch. 8). The narrator’s picture, not a verified map.', '', n === 'India' ? [[8, 'Esther additions: the decrees go to the provinces “from India to Ethiopia” (B and E).']] : undefined),
          ),
          ref('Elasa', 6, 'dc', 'First Maccabees: where Judas dies fighting Bacchides in year 152 (ch. 9).'),
          ref('Bethbasi', 6, 'dc', 'First Maccabees: the place Jonathan defends against Bacchides (ch. 9).'),
          ref('Michmash', 6, 'dc', 'First Maccabees: where Jonathan settles after the treaty and the return of captives (ch. 9).'),
          ref('Mesaloth', 6, 'dc', 'First Maccabees: named “in Arbela” at the start of Bacchides’ campaign against Judas (ch. 9).'),
          ref('Arbela', 6, 'dc', 'First Maccabees: named with Mesaloth (“Mesaloth in Arbela”) at the start of Bacchides’ campaign against Judas (ch. 9).'),
          ...[
            'Gilgal',
            'Berea',
            'Tekoah',
            'Asphar',
            'Medaba',
            'Nadabath',
            'Bethel',
            'Timnath',
            'Pharathon',
            'Tephon',
          ].map((n) => ref(n, 6, 'dc', 'First Maccabees: named in the account of Judas’s death and Jonathan’s struggle with Bacchides (ch. 9).')),
          ref('Crete', 6, 'dc', 'First Maccabees: where the younger Demetrius comes from in year 165 (ch. 10).'),
          ref('Ekron', 6, 'dc', 'First Maccabees: named as Jonathan’s reward after the victory near Joppa and Azotus (ch. 10).'),
          ref('Joppa', 6, 'dc', 'First Maccabees: Jonathan and Simon defeat Apollonius near Joppa and Azotus (ch. 10); Jonathan son of Absalom is sent there (ch. 13). Also named in chapters 11, 12, 14 and 15.'),
          ref('Gaza', 6, 'dc', 'First Maccabees: on Jonathan’s coastal campaign (ch. 11).'),
          ...['Eleutherus', 'Seleucia', 'Aphaerema', 'Lydda', 'Ramathaim', 'The Ladder of Tyre', 'Hazor', 'Gennesareth'].map((n) =>
            ref(n, 6, 'dc', n === 'Eleutherus' ? 'First Maccabees: named in chapters 11 and 12, in the wars of Ptolemy, Demetrius and Jonathan.' : 'First Maccabees: named in chapter 11, in the wars of Ptolemy and Demetrius and Jonathan’s campaigns.'),
          ),
          ref('Hamath', 6, 'dc', 'First Maccabees: Jonathan campaigns toward it (ch. 12).'),
          ...['Chaphenatha', 'Adida'].map((n) => ref(n, 6, 'dc', 'First Maccabees: named in chapter 12, in the account of Jonathan’s and Simon’s campaigns before Jonathan’s capture.')),
          ref('Bascama', 6, 'dc', 'First Maccabees: where Tryphon kills Jonathan (ch. 13).'),
          ref('Adora', 6, 'dc', 'First Maccabees: named in chapter 13, the chapter of Simon’s succession and Jonathan’s death.'),
          ref('Asaramel', 6, 'dc', 'First Maccabees: where the decree for Simon is proclaimed (ch. 14). It may be a title rather than a place.'),
          ref('Dor', 6, 'dc', 'First Maccabees: where Antiochus son of Demetrius besieges Tryphon (ch. 15).'),
          ref('Orthosia', 6, 'dc', 'First Maccabees: where Tryphon escapes by ship from Dor (ch. 15).'),
          ref('Kidron', 6, 'dc', 'First Maccabees: Cendebaeus raids from it and from Jamnia (ch. 15). Named again in chapter 16.'),
          ...[
            'Delos',
            'Myndos',
            'Sicyon',
            'Caria',
            'Samos',
            'Pamphylia',
            'Lycia',
            'Halicarnassus',
            'Rhodes',
            'Phaselis',
            'Cos',
            'Side',
            'Aradus',
            'Gortyna',
            'Cnidus',
            'Cyprus',
            'Cyrene',
            'Sampsames',
          ].map((n) => ref(n, 6, 'dc', 'First Maccabees: one of the kings and cities the Roman letter from Lucius is addressed to (ch. 15). A list of recipients, not a route.')),
          ref('Dok', 6, 'dc', 'First Maccabees: where Ptolemy son of Abubus murders Simon and two of his sons in year 177 (ch. 16).'),
          /* 2 Maccabees (slot 7): the 25 dc-ref-* rows with first = 7 (incl. five source-scoped unnamed sites). */
          ref('Caspin', 7, 'dc', 'Second Maccabees: a city Judas takes (ch. 12). Its relation to Gephyrun is uncertain.'),
          ref('Gephyrun', 7, 'dc', 'Second Maccabees: named with Caspin in chapter 12; the relation between the two names is uncertain.'),
          ref('Charax', 7, 'dc', 'Second Maccabees: Judas campaigns toward it against Timotheus (ch. 12).'),
          ref('Tubieni', 7, 'dc', 'Second Maccabees: named in the Charax campaign against Timotheus (ch. 12).'),
          ref('Carnion', 7, 'dc', 'Second Maccabees: a place of fighting in Judas’s campaign, where a temple of Atergatis is also named (ch. 12).'),
          ref('Adullam', 7, 'dc', 'Second Maccabees: where the army keeps the Sabbath after the battle with Gorgias (ch. 12).'),
          ref('Persepolis', 7, 'dc', 'Second Maccabees: Antiochus fails to plunder its temple (ch. 9).'),
          ref('Lessau', 7, 'dc', 'Second Maccabees: where Nicanor and Judas meet (ch. 14). The text of this passage is corrupt.'),
          ref('Coelesyria', 7, 'dc', 'Second Maccabees: named in chapters 3, 8 and 10, together with Phoenicia.'),
          ref('Phoenicia', 7, 'dc', 'Second Maccabees: Antiochus visits it after Joppa and Jerusalem (ch. 4); named also in chapters 3, 8 and 10.'),
          ref('Tarsus', 7, 'dc', 'Second Maccabees: with Mallus, its revolt draws Antiochus away (ch. 4).'),
          ref('Mallus', 7, 'dc', 'Second Maccabees: with Tarsus, its revolt draws Antiochus away (ch. 4).'),
          ref('Daphne', 7, 'dc', 'Second Maccabees: a sanctuary near Antioch, from which Andronicus lures Onias and murders him (ch. 4).'),
          ref('The Ammonite country', 7, 'dc', 'Second Maccabees: named in chapter 4; Jason flees there after his attack on Jerusalem (ch. 5).'),
          ref('Gerizim', 7, 'dc', 'Second Maccabees: Andronicus is left as governor there (ch. 5), and its sanctuary is renamed for Zeus, Protector of strangers (ch. 6). The edition notes a variant reading.'),
          ref('Athens', 7, 'dc', 'Second Maccabees: the agent who enforces the decrees comes from there (ch. 6). The edition notes a variant reading.'),
          ref('Bethsuron', 7, 'dc', 'Second Maccabees: besieged by Lysias (ch. 11). The distance the Greek gives is uncertain. Kept separate from Bethsura.'),
          ref('Beroea', 7, 'dc', 'Second Maccabees: where Menelaus is executed in a tower of ashes (ch. 13). Kept separate from Berea in 1 Maccabees.'),
          ref('The Gerrenians', 7, 'dc', 'Second Maccabees: the far end of Hegemonides’ district, which begins at Ptolemais (ch. 13). A variant reads Gerarenes.'),
          ref('Tripolis', 7, 'dc', 'Second Maccabees: where Demetrius son of Seleucus lands (ch. 14).'),
          ref('The court of Aretas', 7, 'dc', 'Second Maccabees: one stop in Jason’s flight (ch. 5). Where it was is not stated.'),
          ref('The foreign mountains where Antiochus dies', 7, 'dc', 'Second Maccabees: his place of death in chapter 9. No city is named.'),
          ref('The temple of Nanaea', 7, 'dc', 'Second Maccabees: in the letter of chapter 1, where Antiochus and his party are trapped and killed. Kept apart from the death accounts of 1 Maccabees 6 and 2 Maccabees 9.'),
          ref('The well of the hidden fire', 7, 'dc', 'Second Maccabees: in the letter of chapter 1, where the fire hidden at the deportation is found as a thick liquid. Its location is not given.'),
          ref('Jeremiah’s cave', 7, 'dc', 'Second Maccabees: where Jeremiah hides the tabernacle, the ark and the altar of incense, in the mountain from which Moses viewed the inheritance (ch. 2). No site is pinned.'),
          /* ---- Expanded OT settings (expanded-ot-integration.csv XO-P*, pilate-esdras-integration.csv XE2-P01).
             All coordinates null. Same-spelled places are not merged with earlier works' entries. ---- */
          ref('Magiddo (Megiddo)', 10, 'xot', 'First Esdras: where Josiah fights his last battle; in this witness he dies after being carried to Jerusalem (1:29–31).'),
          ref('Darius’s court', 10, 'xot', 'First Esdras: the setting of the debate in chapter 3. The text does not name the city.'),
          ref('Ecbatane (1 Esdras)', 10, 'xot', 'First Esdras: the archive where the decree is found (6:23). Not merged with Tobit’s and Judith’s Ecbatana by spelling, and no building is located.'),
          ref('The river Theras', 10, 'xot', 'First Esdras: Ezra’s staging point (8:41, 61). Not equated with a river named in another book.'),
          ref('The field called Ardat', 11, 'xot', 'Second Esdras: where Ezra receives the vision of the woman who becomes a city (9:26; 10:51–54). Some witnesses read Arphad. Unlocated.'),
          ref('Schedia', 12, 'xot', 'Third Maccabees: where the captives are landed (4:11). No precise modern location is given.'),
          ref('The hippodrome outside the city', 12, 'xot', 'Third Maccabees: where the captives are confined and later delivered (4:11; 6:16–30).'),
          ref('Ptolemais, “rose-bearing” (3 Maccabees)', 12, 'xot', 'Third Maccabees: a seven-day stop on the way home (7:17–20). Not automatically the Ptolemais of 1–2 Maccabees.'),
          ref('Hermon (1 Enoch)', 16, 'xot', 'First Enoch: where the Watchers come down and bind themselves by an oath (6:6). Kept separate from Sirach’s Hermon, per the no-merge rule for these rows.'),
          ref('The waters of Dan', 16, 'xot', 'First Enoch: where Enoch reads the petition and has his dream (13:7–8). Unlocated.'),
          ref('The house of Mahalalel', 16, 'xot', 'First Enoch: where Enoch has his first dream (83:3–9). The town is not known.'),
          ref('Sinai (Jubilees)', 17, 'xot', 'Jubilees: the frame of the whole book, where Moses receives the revelation (1:1–4).'),
          ref('Elda', 17, 'xot', 'Jubilees: where Adam and Eve live after Eden (3:32–34). Its modern identity is unknown.'),
          ref('Lubar, a mountain of Ararat', 17, 'xot', 'Jubilees: where the ark comes to rest and where Noah plants a vineyard (5:28; ch. 7). Not identified with any modern summit.'),
          ref('Sedeqetelebab, Na’eltama’uk and Adatan’eses', 17, 'xot', 'Jubilees: three towns near Lubar, named for wives and lying east, south and west of it (7:14–17). Positions relative to each other only.'),
          ref('Sion, mountain of Isaac’s binding', 17, 'xot', 'Jubilees: in this witness the mountain where Isaac is bound is called Sion (18:13). The name is kept as given, not harmonized with another book’s.'),
          ref('The wells of Gerar', 17, 'xot', 'Jubilees: wells named Perversity, Enmity and Room (ch. 24). Separate wells in the story; unlocated.'),
          ref('The land of the Rephaim', 17, 'xot', 'Jubilees: Karnaim, Ashtaroth, Edrei, Misur and Beon in the narrated landscape of the Rephaim (29:9–11). No locations are guessed.'),
          ref('Deborah’s burial place', 17, 'xot', 'Jubilees: Deborah’s burial, which the text marks with an oak and a river (ch. 32). A separate memorial from Rachel’s pillar.'),
          ref('Rachel’s pillar', 17, 'xot', 'Jubilees: Rachel’s pillar by the road at Ephrath, which is Bethlehem (ch. 32). A separate memorial from Deborah’s burial place.'),
          ref('Magdaladra’ef', 17, 'xot', 'Jubilees: a stopping place on a journey (ch. 33). No modern identification is offered.'),
          ref('Robel and Tamnatares', 17, 'xot', 'Jubilees: towns the text says were founded, named in chapter 34. The seven Amorite rulers and places in the same chapter are not written up one by one yet.'),
          ref('The hill of Aduram', 17, 'xot', 'Jubilees: where Esau is buried in this book (ch. 38). No modern identification.'),
          ref('Goshen and Rameses', 17, 'xot', 'Jubilees: the regions given to Jacob’s household to live in (45:1–7). No boundaries are drawn.'),
          /* ---- Ascension of Isaiah and 4 Baruch places (RPP02–RPP05, RPP11–RPP13, RPP15, RPP18). Coordinates withheld;
             Jerusalem (RPP01), Babylon (RPP14), Bethlehem (RPP02) and Nazareth (RPP10) are the reused anchors;
             the Jordan (RPP16) and Samaria (RPP17) are later() additions to their earlier entries. ---- */
          ref('Isaiah’s wilderness mountain', 21, 'rp', 'Ascension of Isaiah: an unnamed mountain where Isaiah and other prophets live (2:8–11).'),
          ref('The region of Tyre and Sidon', 21, 'rp', 'Ascension of Isaiah: where Isaiah tells his companions to go (5:13). The text does not say they arrived.'),
          ref('Galgala', 21, 'rp', 'Ascension of Isaiah: where Isaiah and Josab set out from to go to Hezekiah in Jerusalem (6:1). Not tied to any one modern Gilgal.'),
          ref('The sanctuary and altar (4 Baruch)', 22, 'rp', '4 Baruch: where Jeremiah and Baruch lament before the city falls (2:1–10), and where sacrifice is offered later (9:1–7). Not a separately located site.'),
          ref('Agrippa’s estate', 22, 'rp', '4 Baruch: Abimelech is sent by the mountain road to bring figs from it (3:14, 21–22). Not identified with any historical Agrippa’s property.'),
          ref('Baruch’s tomb', 22, 'rp', '4 Baruch: where Baruch stays after leaving Jerusalem (4:11–12). Not the place of Jeremiah’s later burial.'),
          ref('The burial place outside Babylon', 22, 'rp', '4 Baruch: where the eagle meets Jeremiah (7:12–18). Unlocated.'),
          ref('The Mount of Olives (4 Baruch)', 22, 'rp', '4 Baruch: named in Jeremiah’s last vision, in its announcement of the Messiah (9:20). Jeremiah does not go there.'),
          /* ---- NT-related gospels (slots 23–28): settings named in nta-pj-scene, nta-it-scene, nta-gp-scene. All coordinates
             null; the temple (Jerusalem) uses the anchor; Judea mentions are later() additions. ---- */
          ref('Joseph’s home (Protevangelium)', 23, 'nta', 'Protevangelium of James: Joseph’s home, a setting of the story. Not located.'),
          ref('Elizabeth’s house', 23, 'nta', 'Protevangelium of James: where Mary visits Elizabeth (ch. 12). Not located.'),
          ref('The desert of Joachim’s retreat', 23, 'nta', 'Protevangelium of James: where Joachim withdraws (ch. 1). Not located.'),
          ref('The opened mountain', 23, 'nta', 'Protevangelium of James: a mountain that opens during the hiding (ch. 22). Not located.'),
          ref('The birth cave', 23, 'nta', 'Protevangelium of James: the cave where the birth takes place, in the Bethlehem episode (ch. 18). The story’s cave is not identified with the modern Nativity shrine.'),
          ref('The unnamed village (Infancy Thomas)', 24, 'nta', 'Infancy Gospel of Thomas: the village of the childhood stories, which Greek A does not name. Not tied to Nazareth from other versions.'),
          ref('Joseph’s garden', 25, 'nta', 'Gospel of Peter: the garden with the tomb where the body is laid (ch. 6). This text does not name Golgotha, and nothing is located.'),
          ref('The unnamed sea', 25, 'nta', 'Gospel of Peter: the fragment breaks off beside a sea it does not name (ch. 14).'),
          /* ---- Acts of Paul places (nta-pt-*). Kept apart from same-named places in other works; coordinates null. ---- */
          ref('Antioch (Acts of Paul)', 29, 'nta', 'Acts of Paul: where Paul comes from before Iconium, and where Thecla faces Alexander and the beasts (II). Which Antioch is meant is not settled, so this is not merged with the Seleucid royal city.'),
          ref('Iconium', 29, 'nta', 'Acts of Paul: where Paul comes from Antioch, and where Thecla later returns (II).'),
          ref('The road toward Lystra', 29, 'nta', 'Acts of Paul: where Paul is met on the way to Iconium (II). Not a proven visit to Lystra.'),
          ref('The roadside tomb', 29, 'nta', 'Acts of Paul: where Thecla rejoins Paul after the pyre (II). Not located.'),
          ref('Myra', 29, 'nta', 'Acts of Paul: where Thecla finds Paul (II), and the setting of episode III.'),
          ref('Seleucia (Acts of Paul)', 29, 'nta', 'Acts of Paul: where Thecla goes at the end of her story (II).'),
          ref('Perga', 29, 'nta', 'Acts of Paul: companions come from Perga (IV).'),
          ref('Sidon (Acts of Paul)', 29, 'nta', 'Acts of Paul: an episode at a temple in Sidon (IV). Kept apart from the region of Tyre and Sidon in the Ascension of Isaiah.'),
          ref('Tyre (Acts of Paul)', 29, 'nta', 'Acts of Paul: fragments set at Tyre (V).'),
          ref('The mines', 29, 'nta', 'Acts of Paul: the mines of episode VI. Not located.'),
          ref('Ephesus (Acts of Paul)', 29, 'nta', 'Acts of Paul: the setting of episode VIII, known only from quotations by later writers.'),
          /* ---- Acts of Peter places (nta-ape-*). Rome itself is the anchor; these settings have no coordinates. ---- */
          ref('The Tiber (Acts of Peter)', 30, 'nta', 'Acts of Peter: the setting of Paul’s departure from Rome (I–III).'),
          ref('Spain (Acts of Peter)', 30, 'nta', 'Acts of Peter: where Paul is going as he leaves Rome (I–III).'),
          ref('Aricia', 30, 'nta', 'Acts of Peter: Simon comes from Aricia to Rome (IV), and after his fall goes by Aricia to Terracina (XXXII–XLI).'),
          ref('Terracina', 30, 'nta', 'Acts of Peter: where Simon goes after his fall at Rome (XXXII–XLI).'),
          ref('Caesarea (Acts of Peter)', 30, 'nta', 'Acts of Peter: on Peter’s route from Jerusalem to Puteoli (IV–VI). Which Caesarea is meant is not settled here.'),
          ref('Puteoli', 30, 'nta', 'Acts of Peter: Ariston meets Peter here; Peter declines to stay (IV–VI).'),
          ref('The house of Narcissus', 30, 'nta', 'Acts of Peter: where Peter goes in Rome (IV–VI). Not located.'),
          ref('The house of Marcellus', 30, 'nta', 'Acts of Peter: Marcellus’s house in Rome, where Peter teaches and heals (VII–XXXI). Not located.'),
          ref('The Forum (Acts of Peter)', 30, 'nta', 'Acts of Peter: the contest with Simon is announced (VII–XVI) and held there (XVIII–XXXI). No exact site.'),
          ref('The gate at Neapolis and the cave', 30, 'nta', 'Acts of Peter: settings of Peter’s recollection of Eubula in Judaea (XVII). Both are uncertain.'),
          /* ---- Acts of John places (nta-aj-*). Kept apart from same-named places in other works; coordinates null. ---- */
          ref('Miletus', 31, 'nta', 'Acts of John: John comes from Miletus to Ephesus (18–29).'),
          ref('Ephesus (Acts of John)', 31, 'nta', 'Acts of John: the main setting. The theatre and the temple of Artemis (30–47), the young man’s father revived outside the city (48–55) and the household of Andronicus and Drusiana’s tomb (58–86). Kept apart from the Acts of Paul entry.'),
          ref('Smyrna', 31, 'nta', 'Acts of John: John puts off going (30–47) and is invited (48–55); neither is a completed journey. One manuscript’s four years at Smyrna is a variant and is not added.'),
          ref('Laodicea (Acts of John)', 31, 'nta', 'Acts of John: named only in a manuscript heading reported by James, as the start of the journey to Ephesus (58–62).'),
          ref('The inn (Acts of John)', 31, 'nta', 'Acts of John: the unnamed inn where the bugs obey (58–62).'),
          ref('Drusiana’s tomb', 31, 'nta', 'Acts of John: the tomb of the Drusiana story (63–86). No modern location.'),
          ref('Pergamum', 31, 'nta', 'Acts of John: John goes from Ephesus to Pergamum in the Latin supplements (Latin XIV–XXI).'),
          ref('The bridge over a deep river', 31, 'nta', 'Acts of John: in a papyrus fragment (P. Oxy. 850). The river is not named, and nothing is located.'),
          ref('Gennesaret (Acts of John)', 31, 'nta', 'Acts of John: named in John’s account of Jesus (87–105).'),
          ref('The cave on the Mount of Olives (Acts of John)', 31, 'nta', 'Acts of John: where John has a vision while the crucifixion takes place at Jerusalem (87–105). Not merged with the Mount of Olives of other works.'),
          ref('John’s grave outside the gate', 31, 'nta', 'Acts of John: the trench outside a gate where John dies (106–115). The empty-tomb, manna and sandals endings are alternatives.'),
          /* ---- Acts of Andrew places (nta-aa-*): the stops are claims of Gregory’s epitome, not a reconstructed original
             itinerary. Kept apart from same-named places in other works; coordinates null. ---- */
          ref('Amasea', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: on Andrew’s route.'),
          ref('Sinope', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: on Andrew’s route.'),
          ref('Nicaea', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: on Andrew’s route.'),
          ref('Nicomedia', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: on Andrew’s route.'),
          ref('The Hellespont', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: on Andrew’s route.'),
          ref('Byzantium', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: on Andrew’s route.'),
          ref('Thrace', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: on Andrew’s route.'),
          ref('Perinthus', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: on Andrew’s route.'),
          ref('Philippi', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: on Andrew’s route.'),
          ref('Thessalonica', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: on Andrew’s route, before Patrae.'),
          ref('Patrae', 32, 'nta', 'Acts of Andrew: where Andrew’s route in the epitome leads, and where he dies on the seashore, bound to a cross (martyrdom). No execution site is located.'),
          ref('Corinth (Acts of Andrew)', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: a setting of later episodes (25–30).'),
          ref('Megara', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: a setting of later episodes (25–30).'),
          ref('Lacedaemon (Acts of Andrew)', 32, 'nta', 'Acts of Andrew, in Gregory’s epitome: named in later episodes. Kept apart from the Sparta entry of 1–2 Maccabees.'),
          ref('Mermidona', 32, 'nta', 'The epitome’s Mermidona story comes from the Andrew and Matthew tradition; it is not counted as part of the original Acts of Andrew.'),
          /* ---- Acts of Thomas places (nta-at-*). The Hymn of the Soul’s names belong to its symbolic journey and get no
             place entries. Coordinates null. ---- */
          ref('Andrapolis', 33, 'nta', 'Acts of Thomas: the city of the royal wedding, reached by sea (1–16). Its location is unresolved.'),
          ref('India (Acts of Thomas)', 33, 'nta', 'Acts of Thomas: the land of Thomas’s mission. An ancient designation, not the borders of a modern country.'),
          ref('The unnamed city, court and prison (Acts of Thomas)', 33, 'nta', 'Acts of Thomas: the city of the Siphor stories is not named (62–81), nor are King Misdaeus’s court and prison (82–170).'),
          ref('The inn (Acts of Thomas)', 33, 'nta', 'Acts of Thomas: where the murdered woman is raised (51–61).'),
          ref('The captain’s house', 33, 'nta', 'Acts of Thomas: Siphor’s house, where his wife and daughter are healed (62–81).'),
          ref('The house of Iuzanes and Mnesara', 33, 'nta', 'Acts of Thomas: where they are healed and initiated (144–163).'),
          ref('The mountain of Thomas’s death', 33, 'nta', 'Acts of Thomas: an unnamed mountain outside the city, where soldiers spear Thomas (164–170).'),
          ref('The royal tomb (Acts of Thomas)', 33, 'nta', 'Acts of Thomas: where Thomas is buried; dust from it heals the king’s son (164–170). These passages name no modern site.'),
          ref('Mesopotamia (Acts of Thomas)', 33, 'nta', 'Acts of Thomas: where his remains are carried (164–170). No city is named.'),
          /* ---- Apocalypse of Peter and Apocalypse of Paul places (nta-ap-*, nta-apa-*). Their realms are under
             Visionary and otherworldly settings. ---- */
          ref('The Mount of Olives (Apocalypse of Peter)', 34, 'nta', 'Apocalypse of Peter, Ethiopic text: the setting of the revelation. Not merged with the Greek fragment’s unnamed mountain, or with the Mount of Olives of other works.'),
          ref('Tarsus (Apocalypse of Paul)', 35, 'nta', 'Apocalypse of Paul: where the work says it was found in a box (1–2); a Syriac ending returns there. Kept apart from the Tarsus of 2 Maccabees.'),
        ],
      },
      {
        id: 'themes',
        title: 'Themes and allusions',
        list: [
          /* dc-wis-* thematic-card rows. Names the body of Wisdom does not give are marked as coming from notes. */
          ref('Wisdom personified', 3, 'dc', 'Wisdom: a divine gift, pictured as a woman who is companion, teacher and counselor. The bride imagery is personification (6:12–8:21).'),
          ref('The righteous and the wicked', 3, 'dc', 'Wisdom: the apparent suffering of the righteous set against their hoped-for immortality and the judgment of the wicked (chapters 1–5).'),
          ref('The royal speaker', 3, 'dc', 'Wisdom: an unnamed king prays for Wisdom and speaks of a commission to build God’s sanctuary (6:22–9:18). Identifying him as Solomon is editorial.'),
          ref('The sanctuary on the holy mountain', 3, 'dc', 'Wisdom: the prayer places the Temple on God’s holy mountain, in God’s city (9:8). The city is not named in this book.'),
          ref('The first human and the brother-slayer', 3, 'dc', 'Wisdom: Wisdom protects the first human; an angry brother-slayer is the contrast (10:1–3). Adam, Cain and Abel are not named here.'),
          ref('The flood survivor', 3, 'dc', 'Wisdom: a righteous man is steered through the flood on wood (10:4; 14:6–7). A note names Noah; no landing place is given.'),
          ref('The tested father', 3, 'dc', 'Wisdom: a righteous father stays faithful despite his feeling for his child (10:5). The link to Abraham and Isaac comes from other books.'),
          ref('The five cities', 3, 'dc', 'Wisdom: a righteous man escapes fire falling on a region of five cities, and the text recalls a memorial of salt (10:6–8). Nothing is identified on the ground.'),
          ref('The fugitive brother', 3, 'dc', 'Wisdom: Wisdom guides a righteous man fleeing a brother’s anger, through labor and conflict (10:10–12). Jacob is not named.'),
          ref('The sold righteous man', 3, 'dc', 'Wisdom: a righteous man is sold, confined, and later given authority (10:13–14). Joseph is not named; no prison site is given.'),
          ref('Out of Egypt', 3, 'dc', 'Wisdom: an oppressed people leave their oppressors, cross the Red Sea and travel the desert (10:15–21; 11:1–4; 19:1–9). The order is kept; no crossing or camp is pinned.'),
          ref('Blood and water', 3, 'dc', 'Wisdom: a river turned to blood contrasted with water from a rock for the thirsty (11:5–14).'),
          ref('The earlier inhabitants', 3, 'dc', 'Wisdom: the book portrays the land’s earlier occupants as guilty and their displacement as judgment (12:3–22). This is the text’s hostile characterization, not ethnography.'),
          ref('Against idols', 3, 'dc', 'Wisdom: criticism of treating nature as divine, of handmade images and of cults of kings and the dead (chapters 13–15). Its craftsmen and ships are hypothetical.'),
          ref('Food and healing in the desert', 3, 'dc', 'Wisdom: quail, healing by the serpent sign and manna, set against the plagues (chapter 16).'),
          ref('Darkness and light', 3, 'dc', 'Wisdom: darkness and fear for the enslavers, light and guidance for the protected people (17:1–18:4).'),
          ref('The night of the Passover', 3, 'dc', 'Wisdom: danger to infants, the death of the firstborn and the shared sacrifice recalled together (18:5–19). No date is given.'),
          ref('The priest who stopped the plague', 3, 'dc', 'Wisdom: a priestly intercessor stands in a wilderness plague with incense and prayer (18:20–25). A note identifies Aaron.'),
          ref('The treatment of strangers', 3, 'dc', 'Wisdom: the last chapter compares how strangers were treated in the Sodom and Egypt stories (19:13–17). The two are not one event.'),
          /* dc-sir-* thematic-card rows (people cards are under People). Names given only by notes are marked. */
          ref('Instruction in wisdom', 4, 'dc', 'Sirach: teaching on wisdom, reverence, speech, friendship, family conduct, wealth and duties to the community (chapters 1–43). Its paths, houses and roads are images, not travels.'),
          ref('Arriving in Egypt', 4, 'dc', 'Sirach, prologue: the translator says he came to Egypt in the thirty-eighth year of Euergetes and stayed there. The date is the text’s own regnal date; no city is named.'),
          ref('Judgment on the ancestors’ neighbors', 4, 'dc', 'Sirach: a warning recalls rebellion, Lot’s neighbors, dispossessed peoples and the wilderness generation (16:6–10). Naming them as Sodom, Gomorrah or Canaanites is the notes’ interpretation.'),
          ref('Wisdom seeks a dwelling', 4, 'dc', 'Sirach: Wisdom looks for a resting place and is established among Jacob and Israel, in Zion and Jerusalem (24:3–12). A theological picture, not a migration.'),
          ref('Trees of Wisdom', 4, 'dc', 'Sirach: Lebanon, Hermon, Engedi and Jericho supply plant images for Wisdom (24:13–14). Four comparisons, not four stops.'),
          ref('Rivers of Wisdom', 4, 'dc', 'Sirach: Pishon, Tigris, Euphrates, Jordan, Nile and Gihon are images of abundance (24:25–27). No river course is drawn.'),
          ref('Wisdom and the Law', 4, 'dc', 'Sirach: the speaker identifies this Wisdom with the book of the covenant, the law Moses commanded (24:23).'),
          ref('Learning by travel', 4, 'dc', 'Sirach: the teacher says he learned through travel and danger (34:9–12), and the ideal scribe travels abroad (39:4). Neither gives a destination, and the scribe passage need not be autobiography.'),
          ref('A prayer for gathering', 4, 'dc', 'Sirach: a prayer for the tribes of Jacob to be gathered and for Jerusalem, Zion and the Temple to be glorified (36:13–22). A hope, not a completed return. Two verses are missing from the numbering there, not from the text.'),
          ref('Physicians', 4, 'dc', 'Sirach: physicians and remedies are placed within God’s care, alongside prayer (38:1–15). No medical advice is given here.'),
          ref('Praise of creation', 4, 'dc', 'Sirach: sun, moon, seasons, the festival calendar and weather in praise of the creator (42:15–43:33). No dated observation.'),
          ref('The early ancestors', 4, 'dc', 'Sirach: Enoch, Noah, Abraham, Isaac and Jacob carry the covenant memory; Isaac is named as Abraham’s son (44:16–23). The twelve-tribe division is not drawn as a map.'),
          ref('Moses and the priests', 4, 'dc', 'Sirach: Moses and his brother Aaron, of Levi; Aaron’s priestly line; Phinehas son of Eleazar; the opponents Dathan, Abiram and Korah (45:1–24).'),
          ref('Priest and king', 4, 'dc', 'Sirach: David’s royal inheritance, passed through one son, is set beside the priestly inheritance of Aaron’s descendants (45:25).'),
          ref('Joshua and Caleb', 4, 'dc', 'Sirach: Joshua son of Nun succeeds Moses; he and Caleb son of Jephunneh are praised as the ones who entered the inheritance (46:1–10). No battles are located.'),
          ref('The judges and Samuel', 4, 'dc', 'Sirach: the judges are honored; Samuel judges, anoints rulers and speaks after death (46:11–20). This edition (RV 1895) names the Tyrians in 46:18.'),
          ref('David', 4, 'dc', 'Sirach: Nathan serves in David’s time; David defeats Goliath, fights the Philistines and is praised for his worship (47:1–11). An idealized memory, with no campaign map.'),
          ref('Solomon', 4, 'dc', 'Sirach: David’s wise son builds the sanctuary; the later division of the kingdom is tied to his failings (47:12–24). Rehoboam and Jeroboam are named by the notes.'),
          ref('Elijah and Elisha', 4, 'dc', 'Sirach: Elijah at Sinai and Horeb, taken up in fire, succeeded by Elisha (48:1–16). A prophetic succession, not a family line.'),
          ref('Hezekiah and Isaiah', 4, 'dc', 'Sirach: Hezekiah brings water into the city; Sennacherib threatens Zion, and deliverance comes through Isaiah (48:17–25). The Siloam tunnel identification is a note.'),
          ref('Josiah and the prophets', 4, 'dc', 'Sirach: Josiah’s faithfulness, and Jeremiah, Ezekiel, Job and the Twelve, against the failure of kings and the destruction of the holy city (49:1–10).'),
          ref('The rebuilders', 4, 'dc', 'Sirach: Zerubbabel and Jeshua son of Jozadak restore the altar and Temple; Nehemiah restores the walls and gates (49:11–13). Separate works, not one project.'),
          ref('The first generations', 4, 'dc', 'Sirach: Enoch, Joseph, Shem, Seth, Enosh and Adam close the list of ancestors (49:14–16); Joseph’s remains are honored.'),
          ref('The closing polemic', 4, 'dc', 'Sirach: the author voices hostility toward Seir, Philistia and the people at Shechem (50:25–26). A note identifies the last as Samaritans. Recorded as the author’s polemic, not endorsed.'),
          ref('The house of instruction', 4, 'dc', 'Sirach: the closing poem recalls seeking Wisdom in youth and praying before the Temple, and invites learners to a house of instruction (51:13–30). No school is located.'),
          /* Jubilees sacred groupings (XO-P18, XO-P29): relations between named places, not a measured alignment. */
          ref('Four holy places', 17, 'xot', 'Jubilees: Eden, the mountain of the east, Sinai and Zion are grouped as four sacred places (4:26). Kept alongside the three-place grouping of chapter 8.'),
          ref('Eden, Sinai and Zion', 17, 'xot', 'Jubilees: three sacred places set in relation to one another (8:19). A theological pattern, not a line on a map.'),
          /* 4 Baruch nonspatial references (related-pseudepigrapha.md, after RPP18) and RPC09. */
          ref('The temple keys given to the sun', 22, 'rp', '4 Baruch: the keys of the temple are handed over to the sun (4:4). An image, not a place.'),
          ref('The heavenly Jerusalem', 22, 'rp', '4 Baruch: named in chapter 5 (5:35). Not a stop on any journey.'),
          ref('Paradise and the tree of life', 22, 'rp', '4 Baruch: named in Jeremiah’s last prophecy (9:16–19). Not a place on the map.'),
          ref('The figs', 22, 'rp', '4 Baruch: the figs that stay fresh become a sign of hope for the body’s restoration (6:5–10).'),
          ref('Sayings without places', 26, 'nta', 'Gospel of Thomas: its language of kingdom, light and Paradise does not describe places on a map. Sayings 22 and 114 speak of male and female in different ways; each is left as its own saying, not merged into one teaching.'),
          ref('The cosmos and its rulers', 28, 'nta', 'Gospel of Judas: a teaching on the spirit, the luminaries, Adamas, the cosmos and its rulers, Adam and Eve and the stars (pp. 47–55). Some names in the list of rulers are uncertain or restored. No star positions follow from it.'),
          /* Acts of John, Acts of Thomas and the two apocalypses (slots 31–35). */
          ref('The hymn and the dance', 31, 'nta', 'Acts of John: a hymn with a dance, in John’s account of Jesus (87–105).'),
          ref('The cross of light', 31, 'nta', 'Acts of John: the narrator’s teaching of a cross of light, distinct from the wooden cross (87–105). His claim, not harmonized with the gospels.'),
          ref('The Hymn of the Soul (theme)', 33, 'nta', 'Acts of Thomas: a poem of a prince’s journey from the East to Egypt and back (108–113), read as symbol. What its place names refer to is uncertain.'),
          ref('A restoration of all?', 34, 'nta', 'Apocalypse of Peter: whether it teaches a final restoration of everyone is debated by editors. The Sibylline parallel James prints is a separate work.'),
          ref('Sunday rest', 35, 'nta', 'Apocalypse of Paul: after Michael and Christ intercede, a rest on Sunday is granted (31–44). Not a final salvation of all.'),
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
          ref('The money and the scroll', 5, 'dc', 'Babylon to Jerusalem: money and a scroll sent to the high priest. The carriers are not clearly named, so this is not a journey by Baruch himself.'),
          /* dc-m1-j01…j05: stated order or destination only; no lines drawn. */
          ref('Simon brings the Galileans home', 6, 'dc', 'First Maccabees: from Galilee to Judaea, a rescue separate from Judas and Jonathan’s expedition.'),
          ref('Judas and Jonathan in Gilead', 6, 'dc', 'First Maccabees: across the Jordan, the wilderness, Bosora, Dathema and Mizpeh of Gilead, Ephron, back over the Jordan past Bethshan, through Judaea to Jerusalem. A rough outline, not the whole campaign.'),
          ref('The embassy of Eupolemus and Jason', 6, 'dc', 'First Maccabees: to Rome. No stops are given.'),
          ref('The embassy of Numenius and Antipater', 6, 'dc', 'First Maccabees: to Rome, then Sparta, attested by letters. No road is described.'),
          ref('Jonathan’s capture', 6, 'dc', 'First Maccabees: Bethshan, where he meets Tryphon; Ptolemais, where he is seized; Bascama, where he is killed (13:23).'),
          /* dc-m2-j01…j03: stated order only; no lines drawn. */
          ref('Jason’s flight', 7, 'dc', 'Second Maccabees: the Ammonite country, the court of Aretas (place not stated), Egypt, then toward Sparta; he dies abroad. Not Jason of Cyrene.'),
          ref('Antiochus’s last journey', 7, 'dc', 'Second Maccabees: Persepolis, Ecbatana, then foreign mountains where he dies. Jerusalem is threatened but not reached. Kept apart from 1 Maccabees 6 and 2 Maccabees 1.'),
          ref('Judas’s campaign of chapter 12', 7, 'dc', 'Second Maccabees: Joppa, Jamnia, Caspin, Charax, Carnion, Ephron, Scythopolis, Jerusalem before Weeks, then Adullam after Pentecost. Selected stops, not every battle or a surveyed route.'),
          ref('Habakkuk carried', 9, 'dc', 'Judea to the lions’ den in Babylon, then home (the place is not named), carried by an angel. Not a road.'),
          /* Expanded OT journeys (XO-J*, XE2-J01): ordered stops as stated; no lines drawn. */
          ref('Josiah carried from Magiddo', 10, 'xot', 'First Esdras: Magiddo to Jerusalem, after the battle (1:29–31). Not a surveyed road.'),
          ref('The return with Sanabassar', 10, 'xot', 'First Esdras: Babylon to Jerusalem (2:15). The leaders’ names are kept as this book gives them, not merged with similar names elsewhere.'),
          ref('Timber from Lebanon', 10, 'xot', 'First Esdras: timber brought by sea from Lebanon to Joppa (5:55). No shipping route is drawn.'),
          ref('Ezra’s journey', 10, 'xot', 'First Esdras: Babylon, the river Theras, then Jerusalem (8:3–6, 41, 61).'),
          ref('The ten tribes to Arzareth', 11, 'xot', 'Second Esdras: in the interpretation of a vision, the ten tribes cross the Euphrates toward a region called Arzareth, and their return is foretold; the journey takes a year and a half (13:40–47). No distance, date or modern destination follows from this.'),
          ref('The captives brought to Schedia', 12, 'xot', 'Third Maccabees: from unnamed places in Egypt, by boat, to Schedia and the place of confinement (4:7–11).'),
          ref('The journey home', 12, 'xot', 'Third Maccabees: the released people set out, stop at Ptolemais, and return to their homes (7:16–20).'),
          /* 1 Enoch journeys (XO-J05–J09): the visionary ones are sequences in a vision, not routes. */
          ref('Enoch’s ascent', 16, 'xot', 'First Enoch: from the waters of Dan, where he presents the petition, into a vision of heaven (13–14). A dream and ascent, not a route.'),
          ref('Enoch’s tour of the cosmos', 16, 'xot', 'First Enoch: a journey through the cosmos, in the order the text gives (17–36). No star or sky positions are plotted.'),
          ref('Enoch taken up', 16, 'xot', 'First Enoch: raised in a chariot of the spirit, to a place between north and west, then to a house of fire in heaven (70–71). A symbolic sequence.'),
          ref('Enoch returned home', 16, 'xot', 'First Enoch: seven holy ones bring Enoch back to his house to teach his children (81:5–10). No city is named.'),
          ref('Methuselah goes to Enoch', 16, 'xot', 'First Enoch: Lamech sends Methuselah, who visits Enoch at the ends of the earth and comes back (106:4–9; 107). No distance or route.'),
          /* Jubilees journeys (XO-J10–J20): stops in the text’s order; no lines drawn. */
          ref('From Eden to Elda', 17, 'xot', 'Jubilees: from the place of creation, into Eden, then to Elda (ch. 3). A sacred narrative, not a migration.'),
          ref('Ararat to Shinar', 17, 'xot', 'Jubilees: from Ararat to Shinar and Babel (ch. 10). The book’s accounts of Canaan’s disputed settlement and of Madai in Media are its own territorial traditions.'),
          ref('Abram’s journeys', 17, 'xot', 'Jubilees: Ur, Haran, Asshur, Shechem, Bethel and Ai, Hebron, Bealoth, Egypt, back to Bethel and Ai, and Hebron (12–13). “Asshur” is kept as printed; no road is inferred.'),
          ref('Hagar and Ishmael in the wilderness', 17, 'xot', 'Jubilees: the wilderness of Beersheba, then Paran (ch. 17). No modern border is implied.'),
          ref('Isaac’s wells', 17, 'xot', 'Jubilees: Hebron, the Well of Vision, Gerar and its wells, then the Well of the Oath (ch. 24). Isaac is forbidden to go down to Egypt, and does not.'),
          ref('Jacob’s journey and return', 17, 'xot', 'Jubilees: the Well of the Oath, Bethel, Haran, Gilead, the Jabbok, the Jordan and pastures, Shechem, then Bethel (27–32). A family visit to Hebron is told separately.'),
          ref('Joseph sold', 17, 'xot', 'Jubilees: Joseph looks for his brothers at Shechem, finds them at Dothan, and is sold on to Egypt (ch. 34). A movement into slavery, not a chosen journey.'),
          ref('Buying grain in Egypt', 17, 'xot', 'Jubilees: two journeys from Canaan to Egypt and back; on the second return the brothers are accused over a planted cup and brought back to Joseph’s city (42–43).'),
          ref('Jacob goes down to Goshen', 17, 'xot', 'Jubilees: from Haran, as printed, to the Well of the Oath, then Goshen (44–45). The starting point is kept although the scene before is at Hebron. The text dates departure to the sixteenth of the third month and arrival to the first of the fourth; these are the book’s own calendar.'),
          ref('Burials at Hebron', 17, 'xot', 'Jubilees: Jacob is carried from Egypt to Hebron for burial, and later his sons’ bones; Joseph’s bones stay in Egypt for now. Amram stays in Hebron before going back (45–46).'),
          ref('Moses’ flight and the Exodus', 17, 'xot', 'Jubilees: Moses flees from Egypt to Midian and returns; then the crossing of the sea, Shur and the shore, and Sin between Elim and Sinai (47–50). The route is unknown, and the Jordan crossing is still to come.'),
          /* Ascension of Isaiah and 4 Baruch journeys (RPJ01–RPJ10): ordered as stated; no lines drawn. */
          ref('Isaiah’s withdrawal', 21, 'rp', 'Ascension of Isaiah: Jerusalem, Bethlehem, then the wilderness mountain (2:7–11). No road is reconstructed.'),
          ref('The companions sent away', 21, 'rp', 'Ascension of Isaiah: from near the place of Isaiah’s death toward the region of Tyre and Sidon (5:13). An instruction; the journey is not narrated.'),
          ref('Isaiah and Josab come to court', 21, 'rp', 'Ascension of Isaiah: from Galgala to Hezekiah in Jerusalem (6:1).'),
          ref('Isaiah’s ascent', 21, 'rp', 'Ascension of Isaiah: from the vision at court, through the firmament, then up through the seven heavens in order (6–9). A vision, not a flight through space.'),
          ref('The Beloved’s descent', 21, 'rp', 'Ascension of Isaiah: from the seventh heaven down through each heaven to the first, then the firmament and the air (10:17–31). His descent to Sheol is commanded in 10:8 and told in 11:19.'),
          ref('Birth, death and exaltation', 21, 'rp', 'Ascension of Isaiah: the child is taken from Bethlehem to Nazareth; later, from Jerusalem, the Beloved goes down to Sheol and is exalted (11:12–33). The earthly moves are kept apart from the vision. On the way up the text names the firmament and then the second heaven; no stop in the first heaven is added.'),
          ref('Abimelech and the figs', 22, 'rp', '4 Baruch: Jerusalem to Agrippa’s estate and the shade tree, back to Jerusalem, its outskirts, and Baruch’s tomb (3:21–22; 5:1–14; 6:1–3). How the tree relates to the estate is not stated.'),
          ref('Into captivity; into hiding', 22, 'rp', '4 Baruch: Jeremiah goes with the exiles from Jerusalem to Babylon; Baruch goes from Jerusalem to the tomb (4:6, 11–12). Two travelers, two destinations.'),
          ref('The eagle’s flight', 22, 'rp', '4 Baruch: from the tomb to the burial place outside Babylon, and back to Jerusalem (7:1–18, 35–36). Letters go out and come back; the figs go out. No stops between.'),
          ref('The return from Babylon', 22, 'rp', '4 Baruch: the exiles go from Babylon to the Jordan and Jerusalem; the families turned away go back toward Babylon and then found Samaria (8:1–12). A story’s itinerary, not migration history.'),
          /* NT-related gospel journeys (nta-pj-scene route edges; nta-it-scene XIX): ordered as stated; no lines drawn. */
          ref('Mary visits Elizabeth', 23, 'nta', 'Protevangelium of James: Mary goes to Elizabeth (ch. 12). No road or stops are given.'),
          ref('Toward Bethlehem', 23, 'nta', 'Protevangelium of James: Joseph’s household approaches Bethlehem (chs. 17–18). No stops are added.'),
          ref('The Magi leave another way', 23, 'nta', 'Protevangelium of James: the Magi depart by another way (ch. 21). Their route is not given.'),
          ref('To Jerusalem and back (Infancy Thomas)', 24, 'nta', 'Infancy Gospel of Thomas: the parents go up to Jerusalem and return (ch. XIX). The starting village is not named.'),
          /* Acts of Paul journeys (nta-pt-scene, nta-pt-myra, nta-pt-correspondence): ordered as stated; no lines drawn. */
          ref('Paul to Iconium', 29, 'nta', 'Acts of Paul: from Antioch to Iconium (II). The road toward Lystra is only where he is met.'),
          ref('Thecla’s journeys', 29, 'nta', 'Acts of Paul: Iconium, the roadside tomb, Antioch, then Myra to find Paul, back to Iconium, and on to Seleucia (II). The mountain and Rome endings are variants and are not added.'),
          ref('Paul leaves Myra', 29, 'nta', 'Acts of Paul: from Myra toward Sidon (III).'),
          ref('The letter carriers', 29, 'nta', 'Acts of Paul: the journey of Threptus and Eutychus belongs to the letter exchange with the Corinthians (VII). No route is given.'),
          /* Acts of Peter, John, Andrew and Thomas, and the two apocalypses (slots 30–35): ordered as stated; no lines drawn. */
          ref('Paul sets out for Spain', 30, 'nta', 'Acts of Peter: from Rome, by the Tiber, toward Spain (I–III).'),
          ref('Simon comes to Rome', 30, 'nta', 'Acts of Peter: from Aricia to Rome (IV).'),
          ref('Peter’s voyage to Rome', 30, 'nta', 'Acts of Peter: Jerusalem, Caesarea, Puteoli, Rome (IV–VI). The six days and nights are the story’s count.'),
          ref('Simon after his fall', 30, 'nta', 'Acts of Peter: from Rome by Aricia to Terracina (XXXII–XLI).'),
          ref('Peter leaves Rome and returns', 30, 'nta', 'Acts of Peter: Peter leaves the city, sees Jesus in a vision and returns (XXXII–XLI). No road is given.'),
          ref('John comes to Ephesus', 31, 'nta', 'Acts of John: from Miletus to Ephesus (18–29).'),
          ref('John sets out toward Ephesus', 31, 'nta', 'Acts of John: the text has John set out toward Ephesus; a manuscript heading gives Laodicea as the start (58–62).'),
          ref('Ephesus to Pergamum', 31, 'nta', 'Acts of John, Latin supplements: from Ephesus to Pergamum.'),
          ref('Andrew’s route in the epitome', 32, 'nta', 'Acts of Andrew, Gregory’s epitome: Amasea, Sinope, Nicaea, Nicomedia, the Hellespont, Byzantium, Thrace, Perinthus, Philippi, Thessalonica, then Patrae, with a voyage of twelve days (21) and later episodes at Corinth, Megara and Lacedaemon. The epitome’s claims, not the original itinerary.'),
          ref('Thomas sails to Andrapolis', 33, 'nta', 'Acts of Thomas: from Jerusalem, sold to Abbanes, by sea to Andrapolis (1–16). Its location is unresolved.'),
          ref('The chariot journey', 33, 'nta', 'Acts of Thomas: by chariot to the captain’s house, with the wild asses (62–81). The city is not named.'),
          ref('Thomas’s last walk', 33, 'nta', 'Acts of Thomas: a mile out of the city, then up an unnamed mountain (164–170).'),
          ref('Thomas’s remains carried away', 33, 'nta', 'Acts of Thomas: his remains are carried to Mesopotamia (164–170). No route or city is given.'),
          ref('The prince’s journey (Hymn of the Soul)', 33, 'nta', 'Acts of Thomas: a symbolic journey in the poem, from the East by Maishan and Babylon to Egypt, and back by Sarbug and Mesene (108–113). Not a journey of Thomas.'),
          ref('The ascent in the cloud', 34, 'nta', 'Apocalypse of Peter, Ethiopic text: the closing ascent in a cloud. A visionary journey.'),
          ref('Paul’s journey through the heavens', 35, 'nta', 'Apocalypse of Paul: to the third heaven and paradise, down through the cosmic levels to the Ocean, the promised land, the Acherusian lake and the city of Christ, then to the western places of punishment, and to paradise (19–51). A visionary journey.'),
        ],
      },
      {
        id: 'visions',
        title: 'Visionary and otherworldly settings',
        list: [
          /* Settings inside visions, dreams and the afterlife. No coordinates; nothing here is a terrestrial place. */
          ref('Visionary Zion (2 Esdras)', 11, 'xot', 'Second Esdras: a crowned assembly seen in a vision of Zion (2:42–47). A vision, not the plan of a city.'),
          ref('The mountain of the man from the sea', 11, 'xot', 'Second Esdras: in the vision of chapter 13, a mountain interpreted as Zion (13:6–7, 35–36). The seer cannot tell where it came from, and it has no outline to map.'),
          /* 1 Enoch settings (XO-P12, XO-P14–P16, XO-P19–P24, XO-P26–P27): visionary or mythic, coordinates null. */
          ref('Dudael', 16, 'xot', 'First Enoch: where Azazel is confined (10:4–6). Its location is unknown. Not assumed to be Duidain.'),
          ref('The heavenly houses', 16, 'xot', 'First Enoch: the houses Enoch sees on his ascent (14:8–25).'),
          ref('The chambers of the dead', 16, 'xot', 'First Enoch: places where the spirits of the dead are received (ch. 22). The text speaks of four hollows and of three divisions; the difference is kept, not turned into a plan.'),
          ref('The Garden of Righteousness', 16, 'xot', 'First Enoch: where Enoch sees the tree of wisdom (ch. 32).'),
          ref('The dwellings of the righteous', 16, 'xot', 'First Enoch: a whirlwind carries the narrator to the dwellings of the righteous at the end of heaven (39:3–8).'),
          ref('The fountain of righteousness', 16, 'xot', 'First Enoch: a fountain of righteousness surrounded by fountains of wisdom (48:1).'),
          ref('The mountains of metal', 16, 'xot', 'First Enoch: mountains of metal in the west (ch. 52). A vision, not a record of ore deposits.'),
          ref('The burning valley', 16, 'xot', 'First Enoch: a valley of fire where punishment takes place (54:1–6). Not merged with other valleys of punishment.'),
          ref('Duidain', 16, 'xot', 'First Enoch: a wilderness east of the garden where Behemoth lives; Leviathan lives in the depths of the sea (60:7–10). Not assumed to be Dudael.'),
          ref('The house of crystal and fire', 16, 'xot', 'First Enoch: a house of crystal and fire, surrounded by guardian angels (71:5–9).'),
          ref('The old house and the new', 16, 'xot', 'First Enoch: in the animal vision the old house is taken away and a larger one gathers the flock (90:28–36). No dimensions are reconstructed.'),
          ref('The burning wilderness', 16, 'xot', 'First Enoch: a fiery, chaotic waste (108:3–6). Not a place on Earth.'),
          /* Ascension of Isaiah realms (RPP06–RPP09): no Earth parent, no coordinates, no scale. */
          ref('The firmament', 21, 'rp', 'Ascension of Isaiah: where Isaiah sees hostile powers in conflict (7:9–12).'),
          ref('The seven heavens', 21, 'rp', 'Ascension of Isaiah: seven heavens of increasing glory, through which the guide leads Isaiah (7–9). In order only; no distances.'),
          ref('Sheol', 21, 'rp', 'Ascension of Isaiah: the Beloved goes down to the angel of Sheol (10:8; 11:19). Haguel is excluded in 10:8 and is not merged with Sheol.'),
          ref('Gehenna', 21, 'rp', 'Ascension of Isaiah: Isaiah foretells that Beliar will be defeated and taken to Gehenna (4:14).'),
          ref('The soul’s ascent (Gospel of Mary)', 27, 'nta', 'Gospel of Mary: an account of a soul’s ascent, after the lost pages. Its beginning is lost, so the soul is not identified, and no place on Earth is meant.'),
          ref('The mountain, the cloud and the incorruptible realm', 28, 'nta', 'Gospel of Judas: settings of the visions and teaching, with no place on Earth. The house in Judas’s vision is a vision, not a building.'),
          /* Acts of Thomas and the apocalypses of Peter and Paul (slots 33–35). */
          ref('The palace in heaven', 33, 'nta', 'Acts of Thomas: the palace Gad, the king’s brother, sees in heaven (17–29).'),
          ref('The punishments the woman saw', 33, 'nta', 'Acts of Thomas: the places of punishment the raised woman describes (51–61). §§55–56 differ or are absent in the Syriac.'),
          ref('The mountain and the realms (Akhmim fragment)', 34, 'nta', 'Apocalypse of Peter, Greek: an unnamed mountain, and the realms of the blessed and of the punished (B1–34).'),
          ref('Acherusia and Elysium', 34, 'nta', 'Apocalypse of Peter, Ethiopic text: named in the scenes after judgment. Not places on Earth.'),
          ref('Paradise (Apocalypse of Peter)', 34, 'nta', 'Apocalypse of Peter, Ethiopic text: the paradise shown before the ascent.'),
          ref('The third heaven (Apocalypse of Paul)', 35, 'nta', 'Apocalypse of Paul: where Paul is first taken (19–24).'),
          ref('The Ocean and the promised land', 35, 'nta', 'Apocalypse of Paul: reached by descending through the levels of the cosmos (19–24).'),
          ref('The Acherusian lake', 35, 'nta', 'Apocalypse of Paul: on the way to the city of Christ (19–24).'),
          ref('The city of Christ', 35, 'nta', 'Apocalypse of Paul: with four rivers of honey, milk, oil and wine bearing the names Phison, Euphrates, Geon and Tigris, and David’s altar; called Jerusalem (25–30). Not the earthly city or the real rivers.'),
          ref('The western places of punishment', 35, 'nta', 'Apocalypse of Paul: punishments by category (31–44).'),
          ref('Paradise (Apocalypse of Paul)', 35, 'nta', 'Apocalypse of Paul: where Paul sees Adam and Eve, Mary, the patriarchs and prophets (45–51).'),
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
          ref('Jesus (Yeshua) son of Eleazar son of Sira', 4, 'dc', 'The author named in the colophon (50:27) and, in the prologue, the translator’s grandfather. Not Jesus of Nazareth.', 'Sirach'),
          ref('The translator', 4, 'dc', 'Unnamed in the prologue: the author’s grandson, who translated the Hebrew work into Greek in Egypt.', 'Sirach'),
          ref('Simeon son of Jochanan', 4, 'dc', 'The high priest praised in chapter 50 for repairing the Temple and city and for his worship. A note identifies him as Simeon II (about 219–196 BC) and suggests a Day of Atonement setting; both are editorial, not dates in the text.', 'Sirach'),
          ref('Baruch son of Nerias', 5, 'dc', 'Reads his book to the exiles in Babylon in the book’s opening frame.', 'Baruch'),
          /* 1 Maccabees person-reference rows; dc-m1-r01…r08 relationships are stated on the entries. */
          ref('Mattathias', 6, 'dc', 'A priest of the family of Joarib who leaves Jerusalem for Modin and starts the resistance; father of John, Simon, Judas, Eleazar and Jonathan.', '1 Maccabees'),
          ref('John Gaddis', 6, 'dc', 'Eldest son of Mattathias. Not the later John son of Simon.', '1 Maccabees'),
          ref('Simon Thassi', 6, 'dc', 'Son of Mattathias, named counselor by his father; leader after Jonathan’s capture, later recognized as leader and high priest by decree; murdered at Dok.', '1 Maccabees'),
          ref('Judas Maccabaeus', 6, 'dc', 'Son of Mattathias and military commander after him; rededicates the sanctuary; dies at Elasa.', '1 Maccabees'),
          ref('Eleazar Avaran', 6, 'dc', 'Son of Mattathias, killed at Bethzacharias beneath the elephant he struck.', '1 Maccabees'),
          ref('Jonathan Apphus', 6, 'dc', 'Son of Mattathias; succeeds Judas, is made high priest by royal appointment, and is captured by Tryphon and later killed at Bascama.', '1 Maccabees'),
          ref('John son of Simon', 6, 'dc', 'Simon’s son, commander at Gazara, who escapes his father’s murderers.', '1 Maccabees'),
          ref('Ptolemy son of Abubus', 6, 'dc', 'Simon’s son-in-law, who murders Simon and two of his sons at Dok. Not the royal Ptolemy, Cleopatra’s father.', '1 Maccabees'),
          ref('Antiochus Epiphanes', 6, 'dc', 'The king whose decrees ban the ancestral practices; dies in a foreign land after failing at Elymais.', '1 Maccabees'),
          ref('Antiochus Eupator', 6, 'dc', 'Son of Antiochus Epiphanes, made king by Lysias. Not the young Antiochus son of Alexander, nor Antiochus son of Demetrius.', '1 Maccabees'),
          ref('Cleopatra', 6, 'dc', 'Daughter of King Ptolemy, married first to Alexander and later given to Demetrius.', '1 Maccabees'),
          ref('Ptolemy, Cleopatra’s father', 6, 'dc', 'The king who gives his daughter to Alexander, later invades and transfers her to Demetrius, and dies.', '1 Maccabees'),
          ref('Alexander (the rival king)', 6, 'dc', 'Lands at Ptolemais, defeats Demetrius and marries Cleopatra; later flees to Arabia and is killed. Not Alexander the conqueror of chapter 1.', '1 Maccabees'),
          ref('Demetrius (Cleopatra’s second husband)', 6, 'dc', 'The younger Demetrius, who comes from Crete and to whom Ptolemy gives Cleopatra. Kept separate from the earlier Demetrius son of Seleucus.', '1 Maccabees'),
          ref('Tryphon', 6, 'dc', 'Raises Alexander’s young son as king, captures and kills Jonathan, then kills the young king; besieged at Dor, he escapes to Orthosia.', '1 Maccabees'),
          ref('Eupolemus', 6, 'dc', 'Son of John son of Accos; one of the two envoys Judas sends to Rome.', '1 Maccabees'),
          ref('Jason son of Eleazar', 6, 'dc', 'The second envoy sent to Rome with Eupolemus.', '1 Maccabees'),
          ref('Numenius', 6, 'dc', 'Son of Antiochus; envoy to Rome and Sparta.', '1 Maccabees'),
          ref('Antipater', 6, 'dc', 'Son of Jason; envoy to Rome and Sparta with Numenius.', '1 Maccabees'),
          /* 2 Maccabees person-reference rows; dc-m2-r01 and r02 relationships are stated on the entries. */
          ref('Jason, brother of Onias', 7, 'dc', 'Buys the high priesthood and builds a gymnasium; later attacks Jerusalem, flees and dies abroad. Not Jason of Cyrene.', '2 Maccabees'),
          ref('Onias (2 Maccabees)', 7, 'dc', 'The high priest who defends the Temple deposits against Heliodorus and prays for his recovery; lured from the sanctuary at Daphne and murdered. He appears in Judas’s dream before the last battle.', '2 Maccabees'),
          ref('Menelaus', 7, 'dc', 'Brother of Simon; outbids Jason for the high priesthood, guides the king’s plunder of the Temple, and is executed at Beroea.', '2 Maccabees'),
          ref('Simon, brother of Menelaus', 7, 'dc', 'Guardian of the Temple who quarrels with Onias and reports the Temple’s wealth.', '2 Maccabees'),
          ref('Lysimachus', 7, 'dc', 'Menelaus’s brother and deputy, who is killed.', '2 Maccabees'),
          ref('Jason of Cyrene', 7, 'dc', 'Author of the five books the epitomator condenses. Named as a source, not as a traveler.', '2 Maccabees'),
          ref('The mother of seven sons', 7, 'dc', 'Unnamed; she dies after her seven sons (ch. 7). Later traditional names are not used.', '2 Maccabees'),
          ref('The seven sons', 7, 'dc', 'Unnamed brothers put to death one by one before Antiochus (ch. 7).', '2 Maccabees'),
          ref('Esther', 8, 'dc', 'The queen who prays, then goes before the king and is heard.', 'Esther additions'),
          ref('Mordecai (Mardocheus)', 7, 'dc', 'Second Maccabees: 13 Adar, the day of Nicanor’s defeat, is fixed as the day before “Mordecai’s day” (15:36).', '', [[8, 'Esther additions: dreams of the dragons and the stream, urges Esther to plead with the king, and later explains the dream.']]),
          ref('Aman (Haman)', 8, 'dc', 'Mordecai’s enemy, whose decree targets the Jews; the counter-decree calls him a Macedonian.', 'Esther additions'),
          ref('Daniel', 9, 'dc', 'In the additions: the young man who clears Susanna and exposes Bel’s priests. Scoped to these additions.', 'Daniel additions'),
          ref('Susanna', 9, 'dc', 'Daughter of Helkias and wife of Joakim, falsely accused by two elders.', 'Daniel additions'),
          ref('Joakim', 9, 'dc', 'Susanna’s husband, in whose garden the story is set. Not the high priest Joakim of Judith or Baruch.', 'Daniel additions'),
          ref('Habakkuk', 9, 'dc', 'Carried by an angel from Judea to bring Daniel a meal in the den.', 'Daniel additions'),
          /* Expanded OT people (XO-R*, XE2-R01 and persons named in the XO-E and XO-P rows), each scoped to its own work. */
          ref('Josiah (1 Esdras)', 10, 'xot', 'The king whose Passover opens the book and who dies after the battle at Magiddo.', '1 Esdras'),
          ref('Zerubbabel (1 Esdras)', 10, 'xot', 'Wins the debate at Darius’s court and petitions the king for Jerusalem. The court title “cousin” marks royal favour, not kinship.', '1 Esdras'),
          ref('Darius (1 Esdras)', 10, 'xot', 'The king at whose court the debate takes place; the Temple’s completion is dated to his sixth year.', '1 Esdras'),
          ref('Sanabassar', 10, 'xot', 'A leader of the return from Babylon. Not merged with similar names in other books.', '1 Esdras'),
          ref('Ezra (1 Esdras)', 10, 'xot', 'Leads a party from Babylon to Jerusalem, and laments over the mixed marriages.', '1 Esdras'),
          ref('Ezra (2 Esdras)', 11, 'xot', 'The seer of the visions, who questions the angel Uriel and later produces books with five scribes.', '2 Esdras'),
          ref('Uriel', 11, 'xot', 'The angel who answers Ezra’s questions.', '2 Esdras'),
          ref('Ezra’s five scribes', 11, 'xot', 'Sarea, Dabria, Selemia, Ethanus and Asiel, who help Ezra write the books (14:24, 37, 42). Helpers, not descendants.', '2 Esdras'),
          ref('Ptolemy Philopator', 12, 'xot', 'The king whose entry into the Temple is contested; the persecution that follows ends in his change of heart.', '3 Maccabees'),
          ref('Simon (3 Maccabees)', 12, 'xot', 'Intercedes for the community (2:1–20).', '3 Maccabees'),
          ref('Eleazar (3 Maccabees)', 12, 'xot', 'Intercedes for the community (6:1–15). Not the martyr of 4 Maccabees.', '3 Maccabees'),
          ref('Eleazar (4 Maccabees)', 13, 'xot', 'The martyr who refuses forbidden food. Not the Eleazar of 3 Maccabees.', '4 Maccabees'),
          ref('The mother (4 Maccabees)', 13, 'xot', 'Mother of the seven brothers; unnamed in the text, and no later traditional name is used (18:6–10).', '4 Maccabees'),
          ref('The seven brothers (4 Maccabees)', 13, 'xot', 'Brothers who resist coercion and are killed one after another.', '4 Maccabees'),
          /* 1 Enoch people (XO-R06, XO-R09–R12 and persons named in the XO-E and XO-P rows), scoped to slot 16. */
          ref('Enoch (1 Enoch)', 16, 'xot', 'The seer: he carries the Watchers’ petition, is shown heaven and the cosmos, and passes his books to his son Methuselah for later generations (82:1–2).', '1 Enoch'),
          ref('The Watchers', 16, 'xot', 'Beings who come down, teach forbidden things and are judged (6–11).', '1 Enoch'),
          ref('Azazel', 16, 'xot', 'Confined at Dudael (10:4–6).', '1 Enoch'),
          ref('Raphael (1 Enoch)', 16, 'xot', 'Explains the chambers of the dead to Enoch (ch. 22). Spelling as in this witness; kept separate from Tobit’s Raphael.', '1 Enoch'),
          ref('The angel of peace', 16, 'xot', 'Explains to Enoch the roles of Michael, Raphael, Gabriel and Phanuel (40:8–10). Not identified with any of the four.', '1 Enoch'),
          ref('Methuselah', 16, 'xot', 'Son of Enoch and Edna (85:1–3); receives Enoch’s books, and visits him for Lamech. Father of Lamech (106–107).', '1 Enoch'),
          ref('Edna (1 Enoch)', 16, 'xot', 'Named as Methuselah’s mother (85:1–3).', '1 Enoch'),
          ref('Lamech (1 Enoch)', 16, 'xot', 'Methuselah’s son and Noah’s father, who fears at Noah’s birth; Enoch confirms the child is his (106–107). This explicit line is followed over looser “grandfather” wording in chapter 65.', '1 Enoch'),
          ref('Noah (1 Enoch)', 16, 'xot', 'Lamech’s son, whose unusual birth is the subject of chapters 106–107.', '1 Enoch'),
          /* Jubilees people (XO-R07, XO-R08, XO-R13–R19 and persons named in the XO-E rows), scoped to slot 17. */
          ref('The angel of the presence', 17, 'xot', 'Speaks to Moses at Sinai (1:27–29). Not given a name here, because the text does not name him.', 'Jubilees'),
          ref('Moses (Jubilees)', 17, 'xot', 'Receives the revelation at Sinai (ch. 1). Adopted by Tharmuth, nursed by Jochebed, taught to write by Amram and watched over by Miriam (ch. 47).', 'Jubilees'),
          ref('Cain and Awan; Seth and Azura', 17, 'xot', 'Awan is Cain’s sister and wife; Azura is Seth’s sister and wife (ch. 4). Family claims in the text.', 'Jubilees'),
          ref('Edna daughter of Danel', 17, 'xot', 'Enoch’s wife (ch. 4). A different person from Edna daughter of Azrial.', 'Jubilees'),
          ref('Edna daughter of Azrial', 17, 'xot', 'Methuselah’s wife (ch. 4). A different person from Edna daughter of Danel.', 'Jubilees'),
          ref('Noah and his sons (Jubilees)', 17, 'xot', 'Noah is the father of Shem, Ham and Japheth (8:10–11). A genealogy in the text, not population history.', 'Jubilees'),
          ref('Mastema', 17, 'xot', 'Allowed to keep a tenth of the spirits (ch. 10).', 'Jubilees'),
          ref('Abraham and Sarah', 17, 'xot', 'Abram is renamed Abraham, and Sarai Sarah (ch. 15). In this book Abram burns the house of idols, and Haran dies trying to save them (ch. 12).', 'Jubilees'),
          ref('Bilhah and Zilpah', 17, 'xot', 'Sisters, in this book (28:9).', 'Jubilees'),
          ref('Zebulon and Dinah', 17, 'xot', 'Twins, in this book (28:23).', 'Jubilees'),
          ref('Asenath', 17, 'xot', 'Daughter of Potiphar, priest of Heliopolis; her marriage is told in chapter 40 (also 44:24). The name Potiphar is kept as this witness gives it.', 'Jubilees'),
          ref('Levi (Jubilees)', 17, 'xot', 'Affirmed as priest (ch. 32); Jacob entrusts him with the ancestral books (45:16). Keeping books in the story is not evidence of surviving manuscripts.', 'Jubilees'),
          /* Ascension of Isaiah people (RPC01–RPC06), scoped to slot 21. */
          ref('Isaiah (Ascension of Isaiah)', 21, 'rp', 'The prophet and visionary at the center of the book. The attribution to Isaiah is the book’s literary voice, not proven authorship.', 'Ascension of Isaiah'),
          ref('Josab', 21, 'rp', 'Isaiah’s son, who travels with him from Galgala (1:2; 6:1).', 'Ascension of Isaiah'),
          ref('Hezekiah (Ascension of Isaiah)', 21, 'rp', 'Instructs his son Manasseh (ch. 1).', 'Ascension of Isaiah'),
          ref('Manasseh (Ascension of Isaiah)', 21, 'rp', 'Hezekiah’s son, who later turns against Isaiah (1–3).', 'Ascension of Isaiah'),
          ref('Belchira', 21, 'rp', 'Accuses Isaiah before Manasseh (3:1–12). A human accuser, not merged with Beliar.', 'Ascension of Isaiah'),
          ref('Beliar', 21, 'rp', 'Shown as the hostile power behind the persecution (5:15). Spellings vary; demonic names are not merged with one another.', 'Ascension of Isaiah'),
          ref('The guide', 21, 'rp', 'The unnamed angel who leads Isaiah (7:2–8). Kept apart from the angel of the Holy Spirit.', 'Ascension of Isaiah'),
          ref('The Beloved', 21, 'rp', 'Identified as Christ, who will be called Jesus in the world (9:5; 10:7).', 'Ascension of Isaiah'),
          ref('The angel of the Holy Spirit', 21, 'rp', 'Shown in the vision separately from the Beloved and from the guide (9:27–40).', 'Ascension of Isaiah'),
          ref('Mary and Joseph (Ascension of Isaiah)', 21, 'rp', 'Appear in Isaiah’s vision of the child’s birth and life (11:2–17).', 'Ascension of Isaiah'),
          /* 4 Baruch people (RPC07, RPC08, RPC10), scoped to slot 22. */
          ref('Jeremiah (4 Baruch)', 22, 'rp', 'Intercedes and teaches during the captivity; writes to Baruch (1:4–7; 7:21–36). In the last chapter he sees a vision of Jesus, is killed, and a stone is miraculously put in his place (9:14–32).', '4 Baruch'),
          ref('Baruch (4 Baruch)', 22, 'rp', 'Jeremiah’s correspondent, who stays in a tomb near Jerusalem. Scoped to this work; not merged with the entry for the book of Baruch.', '4 Baruch'),
          ref('Abimelech the Ethiopian', 22, 'rp', 'Spared from seeing Jerusalem fall, he later meets Baruch again (3:12–14; 6:1–4). A character’s origin, not evidence of where the book was written.', '4 Baruch'),
          /* NT-related gospel people, scoped to their work (nta-pj-scene … nta-gj-scene). Namespaced; not merged across works. */
          ref('Joachim and Anna', 23, 'nta', 'Mary’s parents in this story (chs. 1–7).', 'Protevangelium of James'),
          ref('Mary (Protevangelium)', 23, 'nta', 'Born to Joachim and Anna, dedicated at the temple, and given into Joseph’s care (chs. 5–9).', 'Protevangelium of James'),
          ref('Joseph (Protevangelium)', 23, 'nta', 'Chosen as Mary’s guardian and husband; he already has children (chs. 8–9).', 'Protevangelium of James'),
          ref('Elizabeth (Protevangelium)', 23, 'nta', 'Mary visits her (ch. 12).', 'Protevangelium of James'),
          ref('Zacharias and Simeon', 23, 'nta', 'Zacharias is killed, and Simeon succeeds him (chs. 23–24).', 'Protevangelium of James'),
          ref('Salome (Protevangelium)', 23, 'nta', 'Tests the birth and is healed (ch. 20). The story’s account. Not merged with the Salome of the Gospel of Thomas.', 'Protevangelium of James'),
          ref('The narrator James', 23, 'nta', 'The narrator names himself James (ch. 25). A literary claim, not proven authorship.', 'Protevangelium of James'),
          ref('Jesus as a child (Infancy Thomas)', 24, 'nta', 'The child of the stories, at five, six, eight and twelve: the story’s own ages.', 'Infancy Gospel of Thomas'),
          ref('James, son of Joseph (Infancy Thomas)', 24, 'nta', 'Joseph’s son, healed by the child (ch. XVI). The text calls him Joseph’s son; it does not settle a family tree.', 'Infancy Gospel of Thomas'),
          ref('Zeno', 24, 'nta', 'Named in the childhood stories (ch. IX).', 'Infancy Gospel of Thomas'),
          ref('Petronius', 25, 'nta', 'In charge of the guards at the tomb (ch. 8).', 'Gospel of Peter'),
          ref('Joseph (Gospel of Peter)', 25, 'nta', 'The garden tomb where the body is laid is his (ch. 6).', 'Gospel of Peter'),
          ref('Peter, Andrew and Levi (Gospel of Peter)', 25, 'nta', 'Peter and Andrew are brothers; Levi is called the son of Alphaeus.', 'Gospel of Peter'),
          ref('Disciples in the Gospel of Thomas', 26, 'nta', 'James, Peter, Matthew and Thomas appear in sayings 12–13, and Salome in saying 61. Thomas here is kept apart from the Infancy Gospel and the Acts of Thomas.', 'Gospel of Thomas'),
          ref('Mary (Gospel of Mary)', 27, 'nta', 'Encourages the disciples and tells of a vision. Catalogues identify her with Mary Magdalene; that is an interpretation, not a name in every passage.', 'Gospel of Mary'),
          ref('Andrew, Peter and Levi (Gospel of Mary)', 27, 'nta', 'Andrew and Peter object to Mary’s words; Levi defends her.', 'Gospel of Mary'),
          ref('Judas (Gospel of Judas)', 28, 'nta', 'Speaks privately with Jesus and later hands him over. Whether the work presents him well is disputed by its readers.', 'Gospel of Judas'),
          /* Acts of Paul people (nta-pt-*), scoped to slot 29. */
          ref('Paul (Acts of Paul)', 29, 'nta', 'The apostle of this work’s stories, from Antioch and Iconium to his death at Rome. Kept apart from Paul in the Acts of Peter and the Apocalypse of Paul.', 'Acts of Paul'),
          ref('Thecla', 29, 'nta', 'Leaves confinement to visit the prison, survives the pyre and the beasts, baptizes herself, and is sent by Paul to teach (II). No marriage.', 'Acts of Paul'),
          ref('Tryphaena and Falconilla', 29, 'nta', 'Tryphaena protects Thecla at Antioch and faints, but does not die; Falconilla is her daughter, already dead (II).', 'Acts of Paul'),
          ref('Alexander (Acts of Paul)', 29, 'nta', 'Encounters Thecla at Antioch (II).', 'Acts of Paul'),
          ref('Panchares and Phila', 29, 'nta', 'Named in the fragmentary first episode, with a son (I). The son’s name, Barnabas, is the editor’s suggestion.', 'Acts of Paul'),
          ref('People of the Myra episode', 29, 'nta', 'Hermocrates and Nympha, Dion and Hermippus (III).', 'Acts of Paul'),
          ref('Longinus, Firmilla and Frontina', 29, 'nta', 'Named in episode VI.', 'Acts of Paul'),
          ref('Eubula and Artemilla', 29, 'nta', 'Named in the Ephesus quotations (VIII).', 'Acts of Paul'),
          ref('Cleobius and Myrte', 29, 'nta', 'Give the prophecy about Rome (IX).', 'Acts of Paul'),
          ref('People of the Roman martyrdom', 29, 'nta', 'Patroclus, Nero, Longus and Cestus; Titus and Luke at the grave (X).', 'Acts of Paul'),
          /* Acts of Peter people (nta-ape-*), scoped to slot 30. Namespaced; not merged across works. */
          ref('Peter (Acts of Peter)', 30, 'nta', 'Comes to Rome from Jerusalem, contends with Simon, leaves the city and returns after a vision, and is crucified head downward (IV–XLI). Kept apart from Peter in other works.', 'Acts of Peter'),
          ref('Simon (Acts of Peter)', 30, 'nta', 'Peter’s opponent: comes from Aricia to Rome, contends in the Forum, falls, and goes to Terracina.', 'Acts of Peter'),
          ref('Paul (Acts of Peter)', 30, 'nta', 'Leaves Rome for Spain at the work’s opening (I–III). This work’s own account, kept apart from the Acts of Paul.', 'Acts of Peter'),
          ref('Rufina', 30, 'nta', 'Named in the episode as Paul leaves Rome (I–III).', 'Acts of Peter'),
          ref('Marcellus', 30, 'nta', 'Taught and reconciled by Peter (VII–XVI); Peter teaches and heals in his household; he buries Peter (XXXII–XLI).', 'Acts of Peter'),
          ref('Theon and Ariston', 30, 'nta', 'Theon is baptized during the voyage; Ariston meets Peter at Puteoli (IV–VI).', 'Acts of Peter'),
          ref('Narcissus', 30, 'nta', 'Peter goes to his house in Rome (IV–VI).', 'Acts of Peter'),
          ref('Eubula', 30, 'nta', 'In Peter’s recollection of Judaea, with Simon, and Agrippinus or Pompeius (XVII).', 'Acts of Peter'),
          ref('Nicostratus and Chryse', 30, 'nta', 'Nicostratus is among those raised in the Forum contest; Chryse makes a gift (XVIII–XXXI).', 'Acts of Peter'),
          ref('Agrippa (Acts of Peter)', 30, 'nta', 'The story’s prefect at Peter’s death (XXXII–XLI). Not assumed to be a Herodian king.', 'Acts of Peter'),
          ref('Peter’s daughter and Ptolemaeus', 30, 'nta', 'Coptic fragment: the daughter is unnamed; identifying her as Petronilla is not secure.', 'Acts of Peter'),
          ref('The gardener’s daughter', 30, 'nta', 'Known from later testimony; not Peter’s daughter.', 'Acts of Peter'),
          /* Acts of John people (nta-aj-*), scoped to slot 31. */
          ref('John (Acts of John)', 31, 'nta', 'The apostle of these stories, from Miletus to Ephesus and to his death outside a gate. Kept apart from John in other works.', 'Acts of John'),
          ref('Lycomedes and Cleopatra', 31, 'nta', 'A married couple at Ephesus, restored (18–29). Lycomedes commissions a portrait.', 'Acts of John'),
          ref('Andronicus and Drusiana', 31, 'nta', 'Drusiana is Andronicus’s wife; the tomb story and revivals (58–86).', 'Acts of John'),
          ref('Callimachus and Fortunatus', 31, 'nta', 'Callimachus attempts to abuse Drusiana’s body; Fortunatus is part of the scene and later dies (63–86).', 'Acts of John'),
          ref('People of the Latin supplements', 31, 'nta', 'Craton; Atticus and Eugenius; Stacteus; Aristodemus, of the poison trial (Latin XIV–XXI).', 'Acts of John'),
          ref('Zeuxis', 31, 'nta', 'In a papyrus fragment, with the eucharist (P. Oxy. 850).', 'Acts of John'),
          ref('Verus (Dyrus)', 31, 'nta', 'Named in a quotation; Verus is the editor’s emendation of Dyrus.', 'Acts of John'),
          /* Acts of Andrew people (nta-aa-*), scoped to slot 32. */
          ref('Andrew (Acts of Andrew)', 32, 'nta', 'The apostle of the epitome’s travels and of the death at Patrae. Kept apart from Andrew in other works.', 'Acts of Andrew'),
          ref('Maximilla', 32, 'nta', 'Visits Andrew in prison and buries him; named with Euclia in the quotations.', 'Acts of Andrew'),
          ref('Aegeates', 32, 'nta', 'Presses his wife while Andrew is in prison; his death is told in the martyrdom account.', 'Acts of Andrew'),
          ref('Iphidamia and Stratocles', 32, 'nta', 'Visit Andrew in prison with Maximilla; Stratocles also appears with Alcman in the epitome.', 'Acts of Andrew'),
          ref('People of the epitome', 32, 'nta', 'Exoos; Medias and Philomedes; Nicolaus; Virinus; Lesbius; Callisto and Trophima; Philopator and Sostratus; Alcman (Gregory’s epitome).', 'Acts of Andrew'),
          /* Acts of Thomas people (nta-at-*), scoped to slot 33. */
          ref('Thomas (Acts of Thomas)', 33, 'nta', 'Sold by Jesus to Abbanes, teaches in India, and is speared on a mountain. Calling him Jesus’s brother is the work’s literary claim. Kept apart from the Thomas of the two gospels.', 'Acts of Thomas'),
          ref('Abbanes', 33, 'nta', 'Envoy of King Gundaphorus, who buys Thomas (1–16).', 'Acts of Thomas'),
          ref('Gundaphorus and Gad', 33, 'nta', 'The king who commissions the palace, and his brother, who sees the palace in heaven (17–29).', 'Acts of Thomas'),
          ref('Siphor', 33, 'nta', 'A captain who asks help for his wife and daughter (62–81); his family is baptized, and he becomes a presbyter (164–170).', 'Acts of Thomas'),
          ref('Mygdonia and Charisius', 33, 'nta', 'Mygdonia, Charisius’s wife, hears the teaching and resists coercion; Charisius is the king’s kinsman, degree not stated (82–133).', 'Acts of Thomas'),
          ref('Narcia (Marcia)', 33, 'nta', 'Mygdonia’s nurse, initiated with her household. A nurse, not a mother.', 'Acts of Thomas'),
          ref('Misdaeus and Tertia', 33, 'nta', 'The king and his wife; Tertia learns from Mygdonia and Thomas, and the king finally converts (134–170).', 'Acts of Thomas'),
          ref('Iuzanes and Mnesara', 33, 'nta', 'The king’s son and his wife; healed and initiated, he becomes a deacon (144–170).', 'Acts of Thomas'),
          /* Apocalypse of Peter and Apocalypse of Paul people (nta-ap-*, nta-apa-*). */
          ref('Moses and Elijah (Apocalypse of Peter)', 34, 'nta', 'Appear in the Ethiopic text before the ascent in the cloud.', 'Apocalypse of Peter'),
          ref('Paul (Apocalypse of Paul)', 35, 'nta', 'The seer of this work, taken through the heavens and the places of punishment. Kept apart from Paul of the Acts; this is not the Coptic Apocalypse of Paul from Nag Hammadi.', 'Apocalypse of Paul'),
          ref('Michael and Tartaruchus', 35, 'nta', 'Michael appears and intercedes; the angel Tartaruchus is Temeluchus in other versions (3–44).', 'Apocalypse of Paul'),
        ],
      },
    ],
  };
})();

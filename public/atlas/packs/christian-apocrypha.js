/* =====================================================================================================
   BIBLICAL APOCRYPHA AND RELATED TRADITIONS: Track A data pack (schema: docs/atlas/PACK_FORMAT.md §6, §20).
   BUILD CHECKPOINT 3 (draft, not reviewed): works, layers, the five reused Earth anchors, coverage notes, and
   Tobit, Judith, Wisdom, Baruch and the Esther and Daniel additions (slots 1–3, 5, 8, 9). The remaining works are added layer by layer in later checkpoints.

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
            books: [1, 2, 5, 8, 9],
            modern: 'Old City of Jerusalem (UNESCO World Heritage property)',
            desc: 'The marker locates Jerusalem’s Old City. It does not mark any tribunal, Temple chamber, tomb or execution site named in these texts.',
          },
          {
            /* JU22 at e1082e3; UNESCO 278. dc-ref-babylon (slot 5). City only, not Babylonia. */
            id: 'babylon',
            name: 'Babylon',
            lat: 32.541969,
            lon: 44.420833,
            books: [5, 8, 9],
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

      /* ---- Baruch (slot 5). dc-bar-01-card … dc-bar-06-card. Chapter 6 is the Letter of Jeremiah. ---- */
      ev('bar-01', 5, 'dc', 'Baruch reads to the exiles', 'In Babylon, Baruch son of Nerias reads a book to Jechonias and the exiles by the river Sud. Money and the scroll are sent to Joakim the high priest in Jerusalem, the vessels are returned, and prayer is asked for Nabuchodonosor and his son Baltasar. The date names the fifth year and seventh day but no month. The edition’s introduction treats this setting as a literary frame.', 'Baruch 1', 'babylon'),
      ev('bar-02', 5, 'dc', 'A confession', 'The exiles’ prayer recalls the siege of Jerusalem, the ruined Temple, the deliverance from Egypt and subjection to Babylon, and looks to a promised return to the land and covenant.', 'Baruch 2'),
      ev('bar-03', 5, 'dc', 'Where is wisdom?', 'The prayer gives way to a poem on wisdom. Canaan, Teman, Medan, Tema and the descendants of Hagar are named only as comparisons, and wisdom is given to Jacob, to Israel.', 'Baruch 3'),
      ev('bar-04', 5, 'dc', 'Jerusalem mourns her children', 'Wisdom is identified with the law. Jerusalem, pictured as a mother and widow, mourns her exiled children and looks for their return.', 'Baruch 4'),
      ev('bar-05', 5, 'dc', 'Behold your children', 'Jerusalem is told to look and see her children coming home; the hills are leveled and trees give shade. A poem of restoration, not a road.', 'Baruch 5'),
      ev('bar-06', 5, 'dc', 'The Letter of Jeremiah', 'A letter attributed to Jeremiah tells the deportees to Babylon they will stay seven generations before returning, and mocks idols carried in procession, Bel, their priests and powerless images. Its picture of Babylonian religion is polemic. Some editions print it as a separate book.', 'Baruch 6'),

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
          ref('The Red Sea', 2, 'dc', 'Judith: named in Achior’s account of Israel’s past. Wisdom: the sea the oppressed people pass through. No crossing point is mapped.'),
          ref('The Nile', 3, 'dc', 'Wisdom: the notes give the Nile as the background of the river turned to blood. Not a mapped event.'),
          ref('The river Sud', 5, 'dc', 'Baruch: where the exiles in Babylon hear Baruch read. Its location is unknown.'),
          ref('Susa', 8, 'dc', 'Esther additions: where Mordecai has his dream, and where the counter-decree says Aman was punished.'),
          ref('Joakim’s garden', 9, 'dc', 'Susanna: the garden of Susanna’s husband in Babylon, where the elders threaten her.'),
          ref('The temple of Bel', 9, 'dc', 'Bel and the Dragon: the temple whose priests Daniel exposes. A story setting, not an identified building.'),
          ref('The lions’ den', 9, 'dc', 'Bel and the Dragon: where Daniel is thrown and Habakkuk brings the meal. Not the same episode as the den in Daniel 6.'),
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
          ref('Habakkuk carried', 9, 'dc', 'Judea to the lions’ den in Babylon, then home (the place is not named), carried by an angel. Not a road.'),
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
          ref('Baruch son of Nerias', 5, 'dc', 'Reads his book to the exiles in Babylon in the book’s opening frame.', 'Baruch'),
          ref('Esther', 8, 'dc', 'The queen who prays, then goes before the king and is heard.', 'Esther additions'),
          ref('Mordecai (Mardocheus)', 8, 'dc', 'Dreams of the dragons and the stream, urges Esther to plead with the king, and later explains the dream.', 'Esther additions'),
          ref('Aman (Haman)', 8, 'dc', 'Mordecai’s enemy, whose decree targets the Jews; the counter-decree calls him a Macedonian.', 'Esther additions'),
          ref('Daniel', 9, 'dc', 'In the additions: the young man who clears Susanna and exposes Bel’s priests. Scoped to these additions.', 'Daniel additions'),
          ref('Susanna', 9, 'dc', 'Daughter of Helkias and wife of Joakim, falsely accused by two elders.', 'Daniel additions'),
          ref('Joakim', 9, 'dc', 'Susanna’s husband, in whose garden the story is set. Not the high priest Joakim of Judith or Baruch.', 'Daniel additions'),
          ref('Habakkuk', 9, 'dc', 'Carried by an angel from Judea to bring Daniel a meal in the den.', 'Daniel additions'),
        ],
      },
    ],
  };
})();

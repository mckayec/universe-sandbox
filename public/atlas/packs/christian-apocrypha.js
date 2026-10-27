/* =====================================================================================================
   BIBLICAL APOCRYPHA AND RELATED TRADITIONS: Track A data pack (schema: docs/atlas/PACK_FORMAT.md §6, §20).
   BUILD CHECKPOINT 6 (draft, not reviewed): works, layers, the five reused Earth anchors, coverage notes, and
   Tobit, Judith, Wisdom, Sirach, Baruch, 1 Maccabees and the Esther and Daniel additions (slots 1–6, 8, 9). The remaining works are added layer by layer in later checkpoints.

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
  function ref(name, first, layer, desc, role, more) {
    const e = { name, first, books: [first], layers: [layer], desc };
    if (role) e.role = role;
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
            books: [1, 2, 4, 5, 6, 8, 9],
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
          ref('Ophir', 4, 'dc', 'Sirach: a byword for fine gold (7:18). The notes say the port is unidentified; no voyage is shown.'),
          /* 1 Maccabees (slot 6): the 94 dc-ref-* place-reference rows with first = 6, except Rome, which is a
             pinned anchor. Each entry says only what the chapter cards (dc-m1-c01…c16) state about the place;
             where a card only lists a name, the entry gives the chapter and its episode, not a role. Mentions in
             2 Maccabees (slot 7) are added with that work. Places first named in Tobit or Judith (Egypt, Media,
             Jordan, Jericho, Azotus and others) get their 1 Maccabees text when their own entries are written. */
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

/* =====================================================================================================
   BIBLICAL APOCRYPHA AND RELATED TRADITIONS: Track A data pack (schema: docs/atlas/PACK_FORMAT.md §6, §20).
   BUILD CHECKPOINT 1 (skeleton, not reviewed): works, layers, the five reused Earth anchors and coverage notes.
   Narrative content is added layer by layer in later checkpoints.

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
            books: [1],
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
    events: [],
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
    ],
  };
})();

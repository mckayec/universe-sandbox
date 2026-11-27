/* =====================================================================================================
   THE LICANIUS TRILOGY (James Islington): world-only reference-card pack (PACK_FORMAT §6.1, §22).
   BUILT, AWAITING BUILD AUDIT. A nonspatial, spoiler-gated seed prototype "based on author recaps and publisher
   descriptions". No full-trilogy, canon or release claim.

   Research (docs/universes/packs/licanius/): research.md at 9f6ea35f, sources.md at 9b3468eb, independent
   review at 6b0d6d58, builder review research-review.md (the build authority: LR-01, LR-02 and L2-01..L2-05
   adopted). Exactly the 29 seed records are built: 13 places, 7 events, 3 partial journeys, 6 codex entries.

   Sources (sources.md): S1 = author's recap of book 1 (jamesislington.com/ShadowRecap.pdf); S2 = author's recap
   of books 1–2 (EchoRecap.pdf); S3 = Hachette page for book 3; S4 = Hachette page for book 2; S5 = Orbit UK page
   for book 3 (no excerpt). S1 and S2 share an author and are not independent witnesses.

   Rules followed here (research-review.md):
   * The recaps give relations (north/south, proximity, ordered stops) and the author publishes a map of Andarra,
     but this atlas has no verified coordinates or measured routes (LB-02), so the pack uses layout:"cards" (EC-2)
     and text journeys (EC-3). Nothing is positioned.
   * Gates are "completed through book N" minimum thresholds, never "first appears" (L2-02). The visitor must
     choose a completed book before anything is listed, and there is no "All" (EC-1).
   * "The setting" is an editorial container, not a canonical world name. "Caladel school site" is an editorial
     label (L2-01).
   * Book 3 has only three cards (le03, le04, lc06), each labelled "publisher premise" (L2-03). No ending, prison
     route or identity reveal.
   * Res Kartha (gate 1) says only "Lyth dwelling place"; the Lyth background (lc04) is gate 2 and not linked from
     it. lc01 and lc04 are history background, with no current-membership or residence claim (LR-02).
   * lc05 is two attributed views, not a narrator-certified cosmology.
   * le02 is displacement in time, not travel, and belongs to no journey.
   * No secret aliases anywhere (labels, search, ids, URLs). Descriptions are paraphrase; no quoted text or art.
   ===================================================================================================== */
(window.ATLAS_PACKS = window.ATLAS_PACKS || {}).licanius = (function () {
  const RECAP1 = 'author recap of book 1';
  const RECAP2 = 'author recap of books 1–2';
  const PUB3 = 'publisher description of book 3';
  const PREMISE =
    'Publisher premise for book 3, not a located scene. It does not show where in the book this arises.';

  /* Places (research.md §3). [id, name, parent site or null, type, gate, card text, source, editorial label] */
  const R1 = page => 'S1 ' + page + ' (' + RECAP1 + ')';
  const R2 = page => 'S2 ' + page + ' (' + RECAP2 + ')';
  const PLACES = [
    ['andarra', 'Andarra', null, 'country', 1, 'A country south of the Boundary.', R1('p1')],
    ['talan-gol', 'Talan Gol', null, 'region', 1, 'Wastelands to the north of the Boundary.', R1('p1')],
    ['boundary', 'The Boundary', null, 'barrier', 1, 'An energy barrier between Andarra and Talan Gol.', R1('p1')],
    ['caladel', 'Caladel school site', 'andarra', 'school site', 1, 'The school at Caladel.', R1('p3'), true],
    ['ilin-illan', 'Ilin Illan', 'andarra', 'city', 1, 'The capital.', R1('p4')],
    ['prythe', 'Prythe', 'andarra', 'city', 2, 'A southern city near Tol Shen.', R2('p13')],
    ['desriel', 'Desriel', null, 'country', 1, 'A country governed by the Gil’shar.', R1('p4')],
    ['deilannis', 'Deilannis', null, 'city', 1, 'An abandoned city on a border.', R1('p5')],
    ['tol-shen', 'Tol Shen', null, 'stronghold', 1, 'A stronghold of the Gifted.', R1('p2')],
    ['res-kartha', 'Res Kartha', null, 'location', 1, 'A dwelling place of the Lyth.', R1('p8')],
    ['daren-tel', 'Daren Tel', null, 'locality', 2, 'Where Wirr’s family estate lies.', R2('p15')],
    ['alkathronen', 'Alkathronen', null, 'city', 2, 'A city covered in snow.', R2('p16')],
    ['ilshan-gathdel-teth', 'Ilshan Gathdel Teth', null, 'location', 2, 'A place of captivity.', R2('p20')],
  ];

  function site(row) {
    const [id, name, parent, type, gate, desc, src, editorial] = row;
    const s = { id, name, type, first: gate, desc, src };
    if (parent) s.parent = parent;
    if (editorial) s.editorial = true;
    return s;
  }

  const at = id => 'setting/' + id;

  /* Events (research.md §4 with LR-01). Locators are recap pages (S1 = book 1 recap, S2 = books 1–2 recap) or
     publisher descriptions (S3 book 3, S4 book 2), never novel chapters. Array order = order within each book;
     ids are stable, not a chronology. */
  const PUB3_LOC = 'Book 3 publisher description';
  const EVENTS = [
    {
      id: 'le01',
      book: 1,
      site: 'caladel',
      title: 'Departure',
      who: ['Davian', 'Wirr'],
      text: 'Davian and Wirr leave the school together.',
      locator: 'Book 1 recap, p. 3',
    },
    {
      id: 'le02',
      book: 1,
      site: 'deilannis',
      title: 'Temporal separation',
      who: ['Davian'],
      text: 'Davian is displaced into the past.',
      locator: 'Book 1 recap, p. 6',
      note: 'A displacement in time, not travel; it is not part of any journey.',
    },
    {
      id: 'le05',
      book: 2,
      site: 'ilin-illan',
      title: 'Investigation',
      who: ['Asha'],
      text: 'Investigates missing Shadows.',
      locator: 'Book 2 publisher description; books 1–2 recap, p. 13',
    },
    {
      id: 'le06',
      book: 2,
      site: 'tol-shen',
      title: 'Confinement',
      who: ['Davian', 'Rohin'],
      text: 'Rohin imprisons Davian.',
      locator: 'Books 1–2 recap, pp. 14–15',
    },
    {
      id: 'le07',
      book: 2,
      site: 'daren-tel',
      title: 'Journal recovered',
      who: ['Wirr', 'Deldri'],
      text: 'Wirr and Deldri recover Elocien’s journal.',
      locator: 'Books 1–2 recap, p. 15',
    },
    {
      id: 'le03',
      book: 3,
      site: 'boundary',
      places: [at('andarra')],
      title: 'Renewed danger',
      who: ['The Venerate'],
      text: 'The Boundary has been repaired; Banes are in Andarra; enemy armies gather.',
      locator: PUB3_LOC,
      note: PREMISE,
    },
    {
      id: 'le04',
      book: 3,
      site: 'ilin-illan',
      title: 'Fragile coalition',
      who: ['Wirr'],
      text: 'In Ilin Illan, Wirr tries to hold a precarious alliance together.',
      locator: PUB3_LOC,
      note: PREMISE,
    },
  ].map(e => Object.assign({ world: 'setting' }, e));

  /* Journeys (research.md §5, L2-05): ordered text cards of sampled stops; no route, distance or timing. */
  const JOURNEYS = [
    {
      id: 'lj01',
      book: 1,
      title: 'From Caladel to Deilannis',
      who: ['Davian', 'Wirr'],
      path: [at('caladel'), at('desriel'), at('deilannis')],
      locator: 'Book 1 recap, pp. 3–6',
      note: 'Stops named in the recap, in order. Not a complete route.',
    },
    {
      id: 'lj02',
      book: 2,
      title: 'To Daren Tel and back',
      who: ['Wirr'],
      path: [at('ilin-illan'), at('daren-tel'), at('ilin-illan')],
      legs: ['Sets out from the capital.', 'Visits Daren Tel.', 'Returns to Ilin Illan.'],
      locator: 'Books 1–2 recap, pp. 15–16',
      note: 'Stops named in the recap, in order. Not a complete route.',
    },
    {
      id: 'lj03',
      book: 2,
      title: 'North to the Boundary',
      who: ['Davian’s group'],
      path: [at('tol-shen'), at('boundary')],
      legs: ['Starting point.', 'Destination of the northward trip.'],
      locator: 'Books 1–2 recap, pp. 16–18; book 2 publisher description',
      note: 'Start and end only. No intervening stops are given.',
    },
  ];

  /* Codex (research.md §6 with LR-02). Gate 2 for lc01–lc05 is a conservative hold, not an earliest disclosure. */
  const CODEX = [
    {
      id: 'background',
      title: 'Background (history)',
      list: [
        {
          id: 'lc01',
          name: 'The Venerate',
          first: 2,
          desc: 'An original group of eleven immortals.',
          note: 'History background only: says nothing about who belongs to the group now.',
          src: 'S2 pp1–2 (' + RECAP2 + ')',
        },
        {
          id: 'lc04',
          name: 'The Lyth',
          first: 2,
          desc: 'Darecians transformed into the Lyth survived in Res Kartha.',
          note: 'History background only: not a claim about where the Lyth live permanently.',
          src: 'S2 pp3–4 (' + RECAP2 + ')',
        },
      ],
    },
    {
      id: 'concepts',
      title: 'Objects and claims',
      list: [
        {
          id: 'lc02',
          name: 'Licanius',
          first: 2,
          desc: 'Andrael’s blade, able to kill the Venerate.',
          src: 'S2 p3 (' + RECAP2 + ')',
        },
        {
          id: 'lc03',
          name: 'The Jha’vett',
          first: 2,
          desc: 'A time device at Deilannis.',
          src: 'S2 p3 (' + RECAP2 + ')',
        },
        {
          id: 'lc05',
          name: 'A claimed divine mission',
          first: 2,
          desc: 'Gassandrid’s view: the mission is one of liberation. Andrael’s view: he suspected deception.',
          note: 'Two attributed views, not the atlas’s or the narrator’s verdict.',
          src: 'S2 pp1–3 (' + RECAP2 + ')',
        },
      ],
    },
    {
      id: 'premise',
      title: 'Publisher premise',
      list: [
        {
          id: 'lc06',
          name: 'Davian’s predicament',
          first: 3,
          desc: 'A captive who opposes the remaining Venerate.',
          note: PREMISE,
          src: 'S3 (' + PUB3 + ')',
        },
      ],
    },
  ];

  return {
    id: 'licanius',
    layout: 'cards',
    meta: {
      title: 'The Licanius Atlas',
      series: 'The Licanius Trilogy',
      author: 'James Islington',
      tagline: 'Places, events and journeys <b>without a map</b>',
      splash: 'Andarra, the Boundary and the places around them, as reference cards.',
      notice:
        'Unofficial fan project for personal, non-commercial use. The Licanius Trilogy and related names are the ' +
        'property of James Islington and his publishers. Based on author recaps and publisher descriptions. ' +
        'Places are reference cards, not mapped positions.',
      srcnote:
        'Sources: the author’s recaps of book 1 and of books 1–2, and Hachette and Orbit publisher pages for ' +
        'books 2 and 3. No full novel text was used.',
      sources: [
        'S1 James Islington, Shadow recap: https://jamesislington.com/ShadowRecap.pdf',
        'S2 James Islington, Shadow and Echo recap: https://jamesislington.com/EchoRecap.pdf',
        'S3 Hachette, The Light of All That Falls (ebook ISBN 9780316274173)',
        'S4 Hachette, An Echo of Things to Come (ebook ISBN 9780316274128)',
        'S5 Orbit UK, The Light of All That Falls (product page; no excerpt opened)',
      ],
    },
    theme: {
      void: '#06080c',
      deep: '#0d1220',
      panel: 'rgba(12,16,26,.88)',
      accent: '#b8894a',
      accentHi: '#e2b877',
      accentLo: '#5b4426',
      chrome: '#e6e9f0',
      text: '#dfe3ec',
      muted: '#9aa4b8',
      faint: '#646e84',
      line: 'rgba(160,185,230,.18)',
      lineStrong: 'rgba(226,184,119,.5)',
      ink: '#0a0c12',
      ember: '#e2a25e',
      chromeGrad: 'linear-gradient(180deg,#fbeed6 0%,#e2b877 45%,#8d6431 70%,#f1d9ae 100%)',
    },
    /* Book 1's first-publication date is unresolved (Known gap), so no year is shown for it. */
    books: {
      1: { n: 'I', title: 'The Shadow of What Was Lost', c: '#c99a5b' },
      2: { n: 'II', title: 'An Echo of Things to Come', y: 2017, c: '#6f93c8' },
      3: { n: 'III', title: 'The Light of All That Falls', y: 2019, c: '#b7c4d8' },
    },
    spoilers: { mode: 'cumulative', start: 'choose', all: false },
    ui: {
      bookLabel: 'Completed through',
      booksAria: 'The last Licanius book you have completed',
      placesTitle: 'Places',
      gateAbout:
        'The buttons in the header say which book you have completed. Anything gated to a later book stays hidden, ' +
        'including in links. Gates are conservative “completed through” thresholds, not where something first appears.',
      chronNote:
        'A small sample of events from author recaps and publisher descriptions, grouped by book. Not a complete ' +
        'timeline; order within a book is not a chronology.',
      journeysNote:
        'Ordered stops documented in the recaps. This atlas has no verified coordinates, measured routes or timing.',
      codexNote: 'Each entry shows from the book it is gated to: a conservative threshold, not where it first appears.',
    },
    intro: {
      text:
        'A small reference atlas for James Islington’s Licanius Trilogy: thirteen places, seven events, three ' +
        'journeys and six concepts. Pick the last book you have completed and only what is safe up to that book ' +
        'is shown.',
      coverage:
        'Seed prototype based on author recaps and publisher descriptions, not on the novels themselves. Book 3 ' +
        'appears only through its publisher premise. Gates are conservative “completed through” thresholds. ' +
        'These cards show the places and ordered stops documented in the recaps. This atlas has no verified ' +
        'coordinates or measured routes, so nothing is drawn on a map.',
    },
    groups: [{ id: 'places', name: 'Reference cards (no map)' }],
    worlds: [
      {
        id: 'setting',
        name: 'The setting',
        group: 'places',
        type: 'editorial container',
        first: 1,
        editorial: true,
        blurb:
          'An atlas grouping for the places below. The sources name no wider world, so this is not a canonical name.',
        sites: PLACES.map(site),
      },
    ],
    events: EVENTS,
    journeys: JOURNEYS,
    codex: CODEX,
  };
})();

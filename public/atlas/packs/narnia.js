/* =====================================================================================================
   THE CHRONICLES OF NARNIA: world-only reference-card pack (schema: docs/atlas/PACK_FORMAT.md §6.1, §22).
   BUILD (bounded seed prototype, awaiting build audit). Not a complete atlas, canon clearance or release.

   Research: docs/universes/packs/narnia/ — research.md at 5396b0c20832366a0a52f979cb704595bc14f17d,
   sources.md at 7352da2ea826beca39f02ee00c0a874a686e5075, independent-review.md at aa0fad2, and the builder
   review research-review.md (the build authority). Exactly the 51 seed records (23 places/containers,
   14 events, 7 partial journeys, 7 codex) plus 7 later-era rows are built, with overlay NR-01 applied.

   Rules followed here (research-review.md §1–§5):
   * Book keys are PUBLICATION order and are the only spoiler gate ("completed through book k").
     `chron` is the chronological slot [S8]; it reorders the display only (EC-4), never eligibility.
   * layout:"cards" (EC-2): no galaxy, no pins, no coordinates, no distances. Parent links are
     breadcrumbs, not distance or political claims (NQ07).
   * Spoiler-neutral start (EC-1): nothing is listed until the reader picks a completed book; no "All".
   * Journeys are ordered text stops (EC-3), never routes; all seven are partial.
   * Later eras are `more` additions behind their own gates; base descriptions stay safe for `first`.
   * Copy is the research's own short paraphrase. No quotations, art, maps or adaptation facts.
   * Not built: any wolf record or Fenris Ulf/Maugrim alias (NA2-08 / NQ03).
   Source tags in `src` lines: S1–S7 = the seven novels (Faded Page transcriptions of named editions,
   chapter locators in Roman numerals); S8 = chronological order essay; S9 = publication years.
   ===================================================================================================== */
(window.ATLAS_PACKS = window.ATLAS_PACKS || {}).narnia = (function () {
  /* Books: key = publication order = gate; y [S9]; chron = chronological slot [S8]. */
  const BOOKS = {
    1: { n: 'I', title: 'The Lion, the Witch and the Wardrobe', y: 1950, chron: 2, c: '#8fc58a' },
    2: { n: 'II', title: 'Prince Caspian', y: 1951, chron: 4, c: '#c9d6e3' },
    3: { n: 'III', title: 'The Voyage of the Dawn Treader', y: 1952, chron: 5, c: '#7fb8d8' },
    4: { n: 'IV', title: 'The Silver Chair', y: 1953, chron: 6, c: '#b9c3cf' },
    5: { n: 'V', title: 'The Horse and His Boy', y: 1954, chron: 3, c: '#e6b866' },
    6: { n: 'VI', title: "The Magician's Nephew", y: 1955, chron: 1, c: '#d9a35a' },
    7: { n: 'VII', title: 'The Last Battle', y: 1956, chron: 7, c: '#f0d58a' },
  };

  /* NQ07: the Narnia container groups records; it does not say every land is ruled by Narnia. */
  const CONTAINER_NOTE = 'Grouping container; not a claim that every land is ruled by Narnia.';
  const LISTED_NOTE = 'Listed under Narnia (world) for grouping only; not a claim that it is ruled by Narnia.';

  /* Sites inside the Narnia world container (research.md §3, overlay NR-01). `first` = gate. */
  const NARNIA_SITES = [
    { id: 'p01', name: 'Lamp-post', type: 'Landmark', first: 1, src: 'S1 I–II',
      desc: 'Western entry landmark. Lucy meets Tumnus here.' },
    { id: 'p02', name: 'Stone Table', type: 'Landmark', first: 1, src: 'S1 XII',
      desc: 'A raised stone slab on a hill.' },
    { id: 'p03', name: 'Cair Paravel', type: 'Castle', first: 1, src: 'S1 VIII; later S2 II–III',
      desc: 'Royal castle at the river mouth on the eastern sea.',
      more: [[2, 'The returning children find their former castle ruined.']] },
    { id: 'p04', name: 'Dancing Lawn', type: 'Clearing', first: 2, src: 'S2 VI–VII',
      desc: 'Council gathering place. Its precise position is not recorded in this atlas.' },
    /* NA2-07 / NQ06: one Table record; the How is shown as built over its site. */
    { id: 'p05', name: "Aslan's How", type: 'Mound', first: 2, src: 'S2 VII–VIII',
      desc: 'Hollow mound over the older Stone Table site.',
      facts: [['Built over', 'The Stone Table site (one place, not a second Table)']] },
    { id: 'p06', name: 'Beruna', type: 'Crossing', first: 1, src: 'S1 XIV; later S2 IX, XIV',
      desc: 'Broad, shallow river fords.',
      more: [[2, 'A Telmarine bridge spans the crossing; later it is destroyed.']] },
    { id: 'p07', name: 'Lone Islands', type: 'Island group', first: 1, src: 'S1 VI; later S3 III–IV',
      desc: "Named in the Witch's claimed titles; this is not proof of effective rule.",
      more: [[3, 'Eastern-voyage destination under Narnian sovereignty.']] },
    { id: 'p08', name: 'Dragon Island', type: 'Island', first: 3, src: 'S3 V–VII',
      desc: 'Voyage stop beyond the Lone Islands.' },
    { id: 'p09', name: "Ramandu's Island", type: 'Island', first: 3, src: 'S3 XIII–XIV',
      desc: 'Later eastern-voyage stop associated with the sleeping lords.' },
    { id: 'p11', name: 'Harfang', type: 'Giant residence', first: 4, src: 'S4 VII–VIII',
      desc: "High-crag house north of the travellers' tableland." },
    { id: 'p12', name: 'Underland', type: 'Subterranean region', first: 4, src: 'S4 XI–XII',
      desc: "Underground setting of the captive knight's chamber.", note: LISTED_NOTE },
    { id: 'p13', name: 'Calormen', type: 'Country', first: 2, src: 'S2 II; later S5 I',
      desc: 'Its king sent ambassadors to Cair Paravel.', note: LISTED_NOTE,
      more: [[5, "Shasta's starting country."]] },
    { id: 'p14', name: 'Tashbaan', type: 'City', parent: 'p13', first: 5, src: 'S5 IV',
      desc: 'Walled city on a river island.' },
    { id: 'p15', name: 'Anvard', type: 'Castle', first: 5, src: 'S5 VIII, XV',
      desc: "King Lune's castle in Archenland.", note: LISTED_NOTE },
    { id: 'p19', name: 'Caldron Pool', type: 'Pool', first: 7, src: 'S7 I',
      desc: "Below the western waterfall, feeding Narnia's river." },
    /* NR-01 adopted: Stable Hill is a landmark name, not an editorial label. */
    { id: 'p20', name: 'Stable Hill', type: 'Landmark', first: 7, src: 'S7 III, IX, XIII',
      desc: 'Stable-bearing hill in Lantern Waste.' },
  ];

  const WORLDS = [
    { id: 'n00', name: 'Narnia (world)', group: 'narnia', type: 'World container', first: 1, editorial: true,
      blurb: "The children's destination beyond the wardrobe.", note: CONTAINER_NOTE,
      src: 'S1 I–II; later S6 VIII–IX, S7 XIV',
      more: [
        [6, 'Its beginning is witnessed.'],
        [7, 'Its ending is witnessed through the doorway.'],
      ],
      sites: NARNIA_SITES },
    { id: 'e00', name: 'Earth', group: 'other', type: 'World container', first: 1, editorial: true,
      blurb: "Home-world container for the children's departures.", src: 'S1 I',
      sites: [
        { id: 'p16', name: 'London', type: 'City', first: 1, src: 'S1 I; later S6 VI',
          desc: 'The Pevensies leave during wartime air raids.',
          more: [[6, "Digory and Polly's home-world setting."]] },
        { id: 'p10', name: 'Experiment House', type: 'School', first: 4, src: 'S4 I',
          desc: "Jill and Eustace's school; real-world site unidentified." },
      ] },
    { id: 'p17', name: 'Wood between the Worlds', group: 'other', type: 'Inter-world place', first: 6,
      src: 'S6 III', blurb: 'Pools provide connections to different worlds.' },
    { id: 'p18', name: 'Charn', group: 'other', type: 'City in another world', first: 6, src: 'S6 IV–V',
      blurb: 'Ruined city identified by Jadis.' },
    { id: 'p21', name: 'Country beyond the stable door', group: 'other', type: 'Other-country view', first: 7,
      editorial: true, src: 'S7 XII–XIV', blurb: 'Daylit country entered through the stable doorway.' },
  ];

  /* Events (research.md §4): gate = book; array order = chapter order within each book. */
  const EV = (id, book, locator, title, text, place, who) => {
    const [world, site] = place.split('/');
    return { id, book, locator: 'Ch. ' + locator, title, text, world, site, who, src: 'S' + book + ' ' + locator };
  };
  const EVENTS = [
    EV('e01', 1, 'I–II', 'First encounter', 'Lucy reaches the lamp and meets Tumnus.', 'n00/p01', ['Lucy', 'Tumnus']),
    EV('e02', 1, 'XIV–XV', 'Sacrifice and return', 'Aslan is killed; the Table breaks and he returns.', 'n00/p02',
      ['Aslan', 'the Witch', 'Susan', 'Lucy']),
    EV('e03', 2, 'VI–VII', 'Council', "Caspian's allies assemble and prepare for war.", 'n00/p04',
      ['Caspian', 'allies']),
    EV('e04', 2, 'XIV', 'Crossing freed', 'The bridge collapses.', 'n00/p06', ['Aslan', 'Bacchus']),
    EV('e05', 3, 'IV', 'Government changed', 'Caspian removes Gumpas and appoints Bern duke.', 'n00/p07',
      ['Caspian', 'Bern', 'Gumpas']),
    EV('e06', 3, 'VI', 'Transformation', 'Eustace awakens as a dragon.', 'n00/p08', ['Eustace']),
    EV('e07', 4, 'I', 'School encounter', 'Bullied Jill meets the changed Eustace.', 'e00/p10', ['Jill', 'Eustace']),
    EV('e08', 4, 'XI', 'Release', 'The travellers free the knight, revealed as Rilian.', 'n00/p12',
      ['Jill', 'Eustace', 'Puddleglum', 'Rilian']),
    EV('e09', 5, 'IV–V', 'Mistaken identity', 'Narnians mistake Shasta for Corin.', 'n00/p14', ['Shasta', 'Narnians']),
    EV('e10', 5, 'XIII', 'Relief battle', 'Narnian forces reach the fighting at Anvard.', 'n00/p15',
      ['Edmund', 'Lucy', 'Shasta', 'Corin']),
    EV('e11', 6, 'IV–V', 'Bell struck', "Digory's choice awakens Jadis.", 'p18', ['Digory', 'Polly', 'Jadis']),
    EV('e12', 6, 'VIII–IX', 'Founding', 'Aslan sings the new world into life.', 'n00', ['Aslan', 'witnesses']),
    EV('e13', 7, 'I', 'Skin recovered', 'Puzzle retrieves a lion skin for Shift.', 'n00/p19', ['Puzzle', 'Shift']),
    EV('e14', 7, 'XIV', 'Door closed', "Peter shuts the doorway after Narnia's end.", 'p21',
      ['Peter', 'Aslan', 'witnesses']),
  ];

  /* Partial journeys (research.md §5): ordered stops only; intermediate stops omitted; no geometry. */
  const PARTIAL = 'Partial: only the listed anchors are researched; there is no measured route.';
  const JR = (id, book, title, who, path, text, locator) => ({
    id, book, title, who, path, text, locator: 'S' + book + ' ' + locator, note: PARTIAL,
  });
  const JOURNEYS = [
    JR('j01', 1, "Lucy's wardrobe visit", ['Lucy'], ['e00', 'n00/p01', 'e00'],
      'Wardrobe entry and return; intervening cave omitted.', 'I–II'),
    JR('j02', 2, 'From the council to the How', ['Caspian and allies'], ['n00/p04', 'n00/p05'],
      'Council to defensive mound.', 'VII'),
    JR('j03', 3, 'The eastward voyage', ['The Dawn Treader company'], ['n00/p07', 'n00/p08', 'n00/p09'],
      'Eastward voyage; multiple omitted stops between anchors.', 'III–XIV'),
    JR('j04', 4, 'From Harfang to Underland', ['Jill', 'Eustace', 'Puddleglum'], ['n00/p11', 'n00/p12'],
      'Surface hospitality to underground captivity site; intervening route omitted.', 'VIII–XI'),
    JR('j05', 5, "Shasta's flight north", ['Shasta'], ['n00/p14', 'n00/p15'],
      'Escape and later battle arrival; desert and Narnia detours omitted.', 'VI–XIII'),
    JR('j06', 6, 'The rings', ['Digory', 'Polly'], ['e00/p16', 'p17', 'p18', 'p17', 'e00/p16'],
      'Ring-mediated outward journey and return.', 'III–VI'),
    JR('j07', 7, 'Through the stable door', ['Tirian'], ['n00/p20', 'p21'],
      'Door transition, not a measured overland leg.', 'XII–XIII'),
  ];

  /* Codex (research.md §6). C02 is limited to its single instance (NA2-05): no conversion rule. */
  const CODEX = [
    { id: 'people', title: 'People and beings', list: [
      { id: 'c01', name: 'Aslan', first: 1, src: 'S1 XIV–XV', desc: 'The lion central to the Table episode.' },
      { id: 'c04', name: 'Rilian', first: 4, src: 'S4 IV, XI', desc: "Caspian's missing son, released from enchantment." },
      { id: 'c05', name: 'Bree', first: 5, src: 'S5 I', desc: 'A Talking Horse seeking freedom in Narnia.' },
    ] },
    { id: 'ideas', title: 'Quests, magic and ideas', list: [
      { id: 'c02', name: 'Narnian time', first: 1, src: 'S1 XVII',
        desc: "The children return at their departure's day and hour.",
        note: 'This one instance only; it is not a general rule for converting time between worlds.' },
      { id: 'c03', name: 'Seven-lord quest', first: 3, src: 'S3 II', desc: "Caspian seeks his father's exiled friends." },
      { id: 'c06', name: 'Rings', first: 6, src: 'S6 III',
        desc: 'Yellow draws travellers to the Wood; green takes them into worlds.' },
      { id: 'c07', name: "Shift's fraud", first: 7, src: 'S7 I, III',
        desc: "Puzzle's lion disguise supports a false Aslan presentation." },
    ] },
  ];

  const LEGEND = Object.keys(BOOKS).map((k) => {
    const b = BOOKS[k];
    return [b.n + ' · ' + b.y, b.title + ' (chronological slot ' + b.chron + ')'];
  });

  return {
    id: 'narnia',
    layout: 'cards',
    meta: {
      title: 'The Narnia Atlas',
      series: 'The Chronicles of Narnia',
      author: 'C. S. Lewis',
      years: '1950–1956',
      publisher: 'their rights holders',
      notice:
        'Unofficial fan project for personal, non-commercial use; not endorsed by or affiliated with the C. S. Lewis ' +
        'estate or any publisher. The Chronicles of Narnia and related names belong to their rights holders. ' +
        'No maps, art or quotations are reproduced; places are listed without positions.',
      srcnote:
        'Sources: selected chapters of volunteer transcriptions of named print editions of all seven novels ' +
        '(Faded Page), with publication years from a fan reading-order page and chronological order from an essay ' +
        'on the official C. S. Lewis website. Editions were not collated, so a few names may differ by edition.',
      sources: [
        'S1–S7: C. S. Lewis, the seven Chronicles, Faded Page transcriptions (see docs/universes/packs/narnia/sources.md)',
        'S8: Charlie W. Starr, "The Narnian Order of Things", cslewis.com, 2013',
        'S9: NarniaWeb, "In What Order Should the Narnia Books Be Read?"',
      ],
    },
    /* woodland green, winter silver, sunrise gold (research.md §1 theme proposal) */
    theme: {
      void: '#080b09',
      deep: '#101712',
      panel: 'rgba(16, 24, 18, 0.84)',
      accent: '#7fae7a',
      accentHi: '#ead690',
      accentLo: '#3d5a3a',
      chrome: '#eef1ea',
      text: '#e2e7de',
      muted: '#a2ad9d',
      faint: '#6c7768',
      line: 'rgba(214, 226, 214, 0.15)',
      lineStrong: 'rgba(234, 214, 144, 0.45)',
      ink: '#0b100b',
      chromeGrad: 'linear-gradient(180deg, #f7f9f4 0%, #cfd8d6 42%, #a08a4c 70%, #f1e2a8 100%)',
    },
    books: BOOKS,
    spoilers: { mode: 'cumulative', start: 'choose', all: false },
    ui: {
      bookLabel: 'Completed through',
      booksAria: 'The last Narnia book you have finished, in publication order',
      placesTitle: 'Places',
      gateText:
        'Pick the last book you have finished, in publication order. Anything first met in a later book stays ' +
        'hidden, including in links, events and journeys.',
      chronNote:
        'A small sample of events per book, not a complete timeline. Within each book, events follow chapter order.',
      journeysNote:
        'All seven journeys are partial: ordered anchor places only. Intermediate stops are omitted and no route ' +
        'or distance is measured.',
      codexNote: 'Short reference entries from the seven books; each appears from the book where it is described.',
    },
    intro: {
      text:
        "Explore C. S. Lewis's seven connected stories through places, events and partial journeys. Nothing is " +
        'placed on a map: the books give relations, not coordinates, so places are cards linked by where they sit. ' +
        'The reading gate follows publication order; the Chronological switch only reorders the books.',
      coverage:
        'Limited coverage: a bounded seed of 23 places, 14 events, 7 partial journeys and 7 reference entries ' +
        'from selected chapters of each book. Many major places and events are not yet included, and no book has ' +
        'been audited in full.',
      legend: LEGEND,
    },
    groups: [
      { id: 'narnia', name: 'The world of Narnia' },
      { id: 'other', name: 'Other worlds and ways between' },
    ],
    worlds: WORLDS,
    events: EVENTS,
    journeys: JOURNEYS,
    codex: CODEX,
  };
})();

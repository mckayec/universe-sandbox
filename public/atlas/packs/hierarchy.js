/* The Hierarchy Atlas: a world-only, spoiler-gated reference prototype (PACK_FORMAT section 22, layout:"cards").
   Built strictly from docs/universes/packs/hierarchy/research.md (checkpoint 2, blob 234dc264), with the build
   decisions of research-review.md (HR-01, HR-02, H2-01..H2-06) and research-addendum.md. Bounded 40-record seed:
   22 places (HP01-HP22), 6 events (HE01-HE06), 2 journeys (HJ01-HJ02), 10 codex entries (HC01-HC10). Nothing else.
   Sources (docs/universes/packs/hierarchy/sources.md):
     S1  James Islington, Hierarchy glossaries (author website; map images not inspected)
     S2  Simon & Schuster, The Will of the Many: publisher page and authorized chapter I excerpt
     S3  Simon & Schuster, The Strength of the Few: publisher page, synopsis and authorized chapter I excerpt
     S4  James Islington, author updates (book 3 drafting status; Hierarchy is not the Licanius world)
   Rules kept here: no coordinates, pins, coastlines, scale or distances (H2-03); `first` is a display gate, read as
   "completed through book k" (H2-01); HP06/HP07 sit under the anonymous editorial container and are never linked to
   HP10 Res; HP02 and HP20 stay separate records (HQ04); editorial names are tagged; HE02 is departure only, HE04 has
   no destination, HC08 is an attributed character account. Book 3 (unpublished) is not in the selector. */
(function () {
  'use strict';
  const S1 = 'author’s Hierarchy glossary (S1)';
  const S2 = 'publisher’s page and excerpt, The Will of the Many (S2)';
  const S3 = 'publisher’s page and excerpt, The Strength of the Few (S3)';
  const S3syn = 'publisher’s synopsis, The Strength of the Few (S3)';
  const src = (id, s) => id + ' · ' + s;

  (window.ATLAS_PACKS = window.ATLAS_PACKS || {})['hierarchy'] = {
    id: 'hierarchy',
    layout: 'cards',
    meta: {
      title: 'The Hierarchy Atlas',
      series: 'The Hierarchy',
      author: 'James Islington',
      years: '2023–2025',
      publisher: 'Saga Press / Simon & Schuster',
      tagline: 'A fugitive confronts an empire sustained by <b>transferred personal power</b>',
      credits: 'Fan-made reference atlas of James Islington’s <i>Hierarchy</i> novels.',
      notice:
        'Unofficial, non-commercial fan atlas. Based on James Islington’s Hierarchy novels. All original rights remain with their respective holders. Geography is schematic.',
      srcnote:
        'Sources: the author’s Hierarchy glossary, the publisher’s pages and authorized chapter I excerpts of both novels, and the author’s updates. The official map images could not be inspected, so no place is positioned. Descriptions are paraphrased; nothing is quoted.',
      sources: ['S1 author glossary', 'S2 Simon & Schuster, The Will of the Many', 'S3 Simon & Schuster, The Strength of the Few', 'S4 author updates'],
    },
    theme: {
      void: '#0c0b0a',
      deep: '#171413',
      panel: 'rgba(26, 22, 20, 0.84)',
      accent: '#b8925a',
      accentHi: '#e0c592',
      accentLo: '#5c4730',
      chrome: '#f1e7d6',
      ember: '#b5443b',
      text: '#e5ded3',
      muted: '#a99d8d',
      faint: '#766b5f',
      line: 'rgba(224, 197, 146, 0.16)',
      lineStrong: 'rgba(224, 197, 146, 0.45)',
      ink: '#140f0a',
    },
    books: {
      1: { n: 'I', title: 'The Will of the Many', y: 2023, c: '#c9a46a' },
      2: { n: 'II', title: 'The Strength of the Few', y: 2025, c: '#a8423c', ink: '#fff' },
    },
    spoilers: { mode: 'cumulative', start: 'choose', all: false },
    ui: {
      bookLabel: 'Completed through',
      booksAria: 'The last Hierarchy novel you have completed',
      gateTitle: 'Which Hierarchy novel have you finished?',
      gateText:
        'Nothing is listed until you choose. You will only see places, episodes and ideas cleared for the books you have completed. You can change this at any time in the header.',
      placesTitle: 'Places',
      tabs: { codex: 'Ideas' },
      chronNote:
        'Sampled opening episodes only, in story order within each book. This is not a complete timeline: most of both novels is not covered yet.',
      journeysNote: 'Ordered steps only. No routes, distances or map positions are known, so none are drawn.',
      editorialNote: 'This name is the atlas’s own label: the source gives no name for it.',
      pickHint: 'Pick a place to open its card. Places are linked by what the sources say about them, not by position.',
    },
    intro: {
      text: 'A spoiler-gated reference prototype for James Islington’s Hierarchy novels. Places appear as linked cards with only the relationships the sources state; nothing is placed on a map. Hierarchy is a different world from the author’s Licanius series, and nothing from Licanius is used.',
      coverage:
        'Limited source coverage: this seed draws only on the author’s glossary, the publisher’s synopsis and the opening chapter of each novel. It is not a complete atlas of either book. The third novel, The Justice of One, is unpublished and not included.',
      legend: [
        ['Completed through', 'Choose the last novel you have finished; later material stays hidden, including in links'],
        ['Editorial label', 'A name supplied by this atlas where the source gives none'],
        ['Sources', 'Each card names its source and record number'],
      ],
    },

    worlds: [
      {
        id: 'setting',
        name: 'First-novel setting',
        type: 'Container',
        first: 1,
        editorial: true,
        blurb:
          'An editorial grouping for the places named in the first novel’s glossary and opening chapter. It is not a name used in the books.',
        sites: [
          { id: 'caten', name: 'Caten', type: 'City', first: 1, desc: 'Capital of Deditia and the Republic.', src: src('HP01', S1) },
          { id: 'solivagus', name: 'Solivagus', type: 'Island', first: 1, desc: 'Academy island on the Sea of Quus.', src: src('HP02', S1) },
          { id: 'catenan-academy', name: 'Catenan Academy', parent: 'solivagus', type: 'Institution', first: 1, desc: 'Vis’s school.', src: src('HP03', S1) },
          { id: 'suus', name: 'Suus', type: 'Island', first: 1, desc: 'Vis’s homeland.', src: src('HP04', S1) },
          { id: 'letens', name: 'Letens', type: 'City', first: 1, desc: 'Capital of Tensia.', src: src('HP05', S1) },
          { id: 'letens-prison', name: 'Letens Prison', parent: 'letens', type: 'Prison', first: 1, desc: 'Vis works here.', src: src('HP06', S2 + ', chapter I') },
          { id: 'deep-cells', name: 'Deep cells', parent: 'letens-prison', type: 'Interior area', first: 1, desc: 'Below the prison’s upper level.', src: src('HP07', S2 + ', chapter I') },
          { id: 'deditia', name: 'Deditia', type: 'Region', first: 1, desc: 'Surrounds Caten.', src: src('HP13', S1 + ', Locations') },
          /* HR-01 build copy */
          { id: 'tensia', name: 'Tensia', type: 'Country', first: 1, desc: 'Southernmost populated country in the known world.', src: src('HP14', S1 + ', Locations') },
          { id: 'sytrece', name: 'Sytrece', type: 'Country', first: 1, desc: 'East of Deditia.', src: src('HP15', S1 + ', Locations') },
          { id: 'sea-of-quus', name: 'Sea of Quus', type: 'Sea', first: 1, desc: 'Caten and Solivagus border it.', src: src('HP16', S1 + ', Locations') },
          { id: 'agerus', name: 'Agerus', type: 'Region', first: 1, desc: 'Near Caten.', src: src('HP17', S1 + ', Locations') },
          { id: 'necropolis', name: 'Necropolis', parent: 'agerus', type: 'Funerary area', first: 1, desc: 'Dedicated to Catenan dead.', src: src('HP18', S1 + ', Locations') },
          { id: 'eldargo-strait', name: 'Eldargo Strait', type: 'Strait', first: 1, desc: 'Separates Suus and Aquiria.', src: src('HP19', S1 + ', Locations') },
        ],
      },
      {
        id: 'obiteum',
        name: 'Obiteum',
        type: 'World',
        first: 2,
        blurb: 'Caeror identifies their surrounding world by this name.',
        src: src('HP08', S3 + ', chapter I'),
        sites: [
          {
            id: 'seawall',
            name: 'Seawall',
            type: 'Landmark',
            first: 2,
            desc: 'Waves strike this barrier.',
            note: 'A landmark in view, not a claim that the characters visit the barrier itself.',
            src: src('HP11', S3 + ', chapter I'),
          },
          {
            id: 'archway',
            name: 'Obsidian archway site',
            type: 'Device site',
            first: 2,
            editorial: true,
            desc: 'Caeror activates an arch from a circular installation.',
            src: src('HP12', S3 + ', chapter I'),
          },
          {
            id: 'solivagus-obiteum',
            name: 'Solivagus in Obiteum',
            type: 'Island',
            first: 2,
            desc: 'Vis recognizes the devastated counterpart.',
            note: 'Kept as a separate record from the first novel’s Solivagus; no identity between them is asserted here.',
            src: src('HP20', S3 + ', chapter I'),
          },
          { id: 'crater', name: 'Crater', parent: 'solivagus-obiteum', type: 'Terrain', first: 2, editorial: true, desc: 'Below the hovering sphere.', src: src('HP21', S3 + ', chapter I') },
          { id: 'ridge', name: 'Ridge', parent: 'solivagus-obiteum', type: 'Terrain', first: 2, editorial: true, desc: 'Westward from the crater floor.', src: src('HP22', S3 + ', chapter I') },
        ],
      },
      { id: 'luceum', name: 'Luceum', type: 'World', first: 2, blurb: 'One of the three worlds in the sequel’s premise.', src: src('HP09', S3syn) },
      { id: 'res', name: 'Res', type: 'World', first: 2, blurb: 'Another of those worlds.', src: src('HP10', S3syn) },
    ],

    /* display order follows research §4: HE01 → HE05 → HE02 (book 1), HE03 → HE06 → HE04 (book 2) */
    events: [
      {
        id: 'he01',
        book: 1,
        world: 'setting',
        site: 'letens-prison',
        places: ['setting/deep-cells'],
        locator: 'Chapter I',
        who: ['Vis', 'Hospius'],
        title: 'Prison escort',
        text: 'Vis escorts the visitor downstairs to question Nateo.',
      },
      {
        id: 'he05',
        book: 1,
        world: 'setting',
        site: 'deep-cells',
        locator: 'Chapter I, interrogation',
        who: ['Hospius', 'Nateo', 'Vis'],
        title: 'Names questioned',
        text: 'Two unexplained names enter the inquiry.',
      },
      {
        id: 'he02',
        book: 1,
        world: 'setting',
        site: 'letens-prison',
        locator: 'Chapter I, final paragraph',
        who: ['Vis', 'Hrolf'],
        title: 'Leaving work',
        text: 'Vis leaves for the Theatre.',
        note: 'An announced destination, not a recorded arrival; the Theatre has no card.',
      },
      {
        id: 'he03',
        book: 2,
        world: 'obiteum',
        locator: 'Chapter I, opening',
        who: ['Vis', 'Caeror'],
        title: 'Leaving the hall',
        text: 'They escape through a hall and ascend.',
      },
      {
        id: 'he06',
        book: 2,
        world: 'obiteum',
        site: 'solivagus-obiteum',
        places: ['obiteum/crater'],
        locator: 'Chapter I, before the westward walk',
        who: ['Vis', 'Caeror'],
        title: 'Descent completed',
        text: 'They reach the crater floor.',
      },
      {
        id: 'he04',
        book: 2,
        world: 'obiteum',
        site: 'archway',
        locator: 'Chapter I, closing',
        who: ['Vis', 'Caeror'],
        title: 'Archway activation',
        text: 'Both stand at the activated device as light envelops them.',
        note: 'The source gives no destination, so no link to any other place is drawn.',
      },
    ],

    journeys: [
      {
        id: 'hj01',
        book: 1,
        title: 'Down to the deep cells',
        who: ['Vis', 'Hospius'],
        locator: 'Chapter I',
        path: ['setting/letens-prison', 'setting/deep-cells'],
        note: 'A stated descent inside the prison, not a geographic route.',
      },
      {
        id: 'hj02',
        book: 2,
        title: 'From the crater to the archway',
        who: ['Vis', 'Caeror'],
        locator: 'Chapter I',
        path: ['obiteum/crater', 'obiteum/ridge', 'obiteum/archway'],
        note: 'An ordered local segment only: no measured route and no onward endpoint.',
      },
    ],

    codex: [
      {
        id: 'ideas',
        title: 'Ideas',
        list: [
          { id: 'hc01', name: 'Ceding', first: 1, desc: 'A person passes half their Will to the rank above.', src: src('HC01', S1) },
          { id: 'hc02', name: 'Transvect', first: 1, desc: 'Will-powered transport.', src: src('HC02', S1) },
          { id: 'hc03', name: 'Anguis', first: 1, desc: 'Rebels opposing the Hierarchy.', src: src('HC03', S1) },
          { id: 'hc04', name: 'Iudicium', first: 1, desc: 'Academy ranking test for Class Three.', src: src('HC04', S1) },
          { id: 'hc05', name: 'Foundation', first: 1, desc: 'Strategy game; Vis plays Hrolf.', src: src('HC05', S2 + ', chapter I') },
          {
            id: 'hc06',
            name: 'Senatorial pyramids',
            first: 1,
            desc: 'Governance, Military and Religion divide institutional responsibilities.',
            src: src('HC06', S2 + ', chapter I'),
          },
          { id: 'hc09', name: 'Sapper', first: 1, desc: 'Prison device draining Will.', src: src('HC09', S2 + ', chapter I') },
          { id: 'hc10', name: 'Aurora Columnae', first: 1, desc: 'Artifacts enabling ceding.', src: src('HC10', S2 + ', chapter I') },
          {
            id: 'hc07',
            name: 'Replication',
            first: 2,
            desc: 'The publisher describes three versions of Vis across three worlds.',
            src: src('HC07', S3syn),
          },
          {
            id: 'hc08',
            name: 'Caeror’s account',
            first: 2,
            desc: 'His explanation of the worlds includes acknowledged uncertainty about which was original.',
            note: 'A character’s account, reported as his; not a verified description of how the worlds relate.',
            src: src('HC08', S3 + ', chapter I'),
          },
        ],
      },
    ],
  };
})();

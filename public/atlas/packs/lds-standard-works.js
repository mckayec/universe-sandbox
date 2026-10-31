/* =====================================================================================================
   LATTER-DAY SAINT STANDARD WORKS: Track A data pack (schema: docs/atlas/PACK_FORMAT.md §20).
   BUILD CHECKPOINT 6 (draft, not reviewed): anchored core plus 13 builder-compiled restoration-era anchors and
   13 builder-compiled New Testament anchors (RR01/Q01, listed in docs/universes/packs/lds-standard-works/anchors-proposal.csv, pending canon audit).

   Research: docs/universes/packs/lds-standard-works/ at research revision 52adadf
   (research.md, bible-inventory.md, restoration-inventory.md, gazetteer-evidence.md, build-handoff.md).
   Record keys from the research are given in comments (P08, AP06, RP05, E03, AE04, J02, C01, …).
   All display copy is the research's own proposed wording; nothing here is added from memory.

   Placement rules (build-handoff.md "Known-place recipe"):
   * Only places with a cited modern anchor are pins. A pin marks the heritage property, gazetteer point or
     visitor center named in its description, never the exact spot of a narrated episode.
   * Places with no approved anchor are not pins (the engine would put them at 0,0). They are listed in the
     codex under "Places without a map pin", each beginning with its work.
   * Book of Mormon places have no Earth coordinates; geography models are not shown as pins.
   * Narrated ancient episodes carry no numeric year; only sourced modern dates get `when`.
   Anchors: UNESCO (Jerusalem, Bethlehem, Jericho/Tell es-Sultan, Babylon, Philippi), Pleiades (Nazareth,
   Capernaum, Perga, Antioch in Pisidia), National Park Service (Winter Quarters / Mormon Trail Center),
   and Wikipedia infobox coordinates (NRHP/GNIS-derived) for the builder-compiled restoration-era anchors;
   Pleiades (Salamis) and Wikipedia coordinates for the builder-compiled New Testament anchors; after the
   2026-10-30 build audit (BA02/BA03) eleven of those use ToposText representative points and the secondary
   restoration-era and Rome points carry a visible approximate qualification. Lystra and South Pass are held (BA01).
   ===================================================================================================== */
(window.ATLAS_PACKS = window.ATLAS_PACKS || {})['lds-standard-works'] = (function () {
  const OT = 1;
  const NT = 2;
  const BOM = 3;
  const DC = 4;
  const PGP = 5;

  /* Codex entry for a place with no approved map anchor (build-handoff.md "Unknown-place recipe"). */
  function unmapped(name, book, layers, desc) {
    return { name, books: [book], layers, desc };
  }

  return {
    id: 'lds-standard-works',
    meta: {
      title: 'Latter-day Saint Standard Works',
      series: 'Latter-day Saint Standard Works',
      author: 'Old and New Testaments, Book of Mormon, Doctrine and Covenants, Pearl of Great Price',
      tagline: 'Places and narratives of the <b>standard works</b>',
      splash:
        'Explore the places and narratives of Latter-day Saint scripture, with historical evidence and proposed geography clearly distinguished.',
      credits: '',
      notice:
        'Independent educational atlas. Not an official publication of The Church of Jesus Christ of Latter-day Saints. Scripture narratives, religious beliefs, historical evidence and geographic proposals are labelled separately.',
      srcnote:
        'Map pins mark modern heritage properties, gazetteer points or visitor centers. They locate a place, not the exact spot of a narrated event, and do not verify it. Places without an approved location are listed in the codex instead of being pinned.',
      canvasLabel: 'A globe of places named in the Latter-day Saint standard works',
      sources: [
        'The Church of Jesus Christ of Latter-day Saints, scriptures (churchofjesuschrist.org/study/scriptures)',
        'UNESCO World Heritage List: Old City of Jerusalem; Birthplace of Jesus (Bethlehem); Tell es-Sultan; Babylon; Philippi',
        'Pleiades gazetteer (pleiades.stoa.org): Nazareth 678299, Capernaum 678231, Perga 639048, Antioch in Pisidia 609307 (CC BY 3.0)',
        'National Park Service, Mormon Pioneer National Historic Trail: Mormon Trail Center at Historic Winter Quarters',
        'The Joseph Smith Papers',
        'Wikipedia infobox coordinates (derived from NRHP/GNIS records) for restoration-era sites: Fayette, Independence, Kirtland Temple, Nauvoo, Carthage Jail, Harmony, Palmyra, Salt Lake Temple, Garden Grove, Mount Pisgah, Chimney Rock, Fort Bridger',
        'ToposText gazetteer (topostext.org) representative points: Antioch on the Orontes, Seleucia Pieria, Salamis, Nea Paphos, Iconium, Attalia, Alexandria Troas, Syracuse, Rhegium, Puteoli, Patmos',
        'Wikipedia coordinates (secondary, approximate): Rome',
      ],
    },
    theme: {
      void: '#07090d',
      deep: '#0e1119',
      panel: 'rgba(14,17,26,.88)',
      accent: '#b89a5a',
      accentHi: '#e4cf9a',
      accentLo: '#4e4128',
      chrome: '#ece4d2',
      ember: '#d9b45a',
      text: '#e4dfd4',
      muted: '#a39c8c',
      faint: '#6b665b',
      line: 'rgba(228,207,154,.16)',
      lineStrong: 'rgba(228,207,154,.46)',
      panelRgb: '18,21,32',
      panelRgb2: '8,10,15',
      btnRgb: '14,17,26',
      shadeRgb: '7,9,13',
      voidRgb: '7,9,13',
      codexRgb: '4,5,8',
      splashGlow: '#141a2a',
      selRing: '#e4cf9a',
      sigil:
        '<g fill="none" stroke="url(#cg)" stroke-width="1.6"><path d="M10 12h12c1.5 0 2 1 2 2v24c0-1-.5-2-2-2H10z"/><path d="M38 12H26c-1.5 0-2 1-2 2v24c0-1 .5-2 2-2h12z"/><circle cx="24" cy="24" r="21" stroke-width=".8" opacity=".5"/></g>',
    },
    spoilers: { mode: 'single' },
    books: {
      1: { n: 'OT', title: 'Old Testament', c: '#d9b45a' },
      2: { n: 'NT', title: 'New Testament', c: '#e08a6a' },
      3: { n: 'BoM', title: 'Book of Mormon', y: 1830, c: '#7fa8e8' },
      4: { n: 'D&C', title: 'Doctrine and Covenants', c: '#8cc49a' },
      5: { n: 'PGP', title: 'Pearl of Great Price', c: '#c49ad9' },
    },
    layers: [
      { id: 'ot', name: 'Old Testament', short: 'OT', c: '#d9b45a' },
      { id: 'nt', name: 'New Testament', short: 'NT', c: '#e08a6a' },
      { id: 'bom', name: 'Book of Mormon', short: 'BoM', c: '#7fa8e8' },
      { id: 'dc', name: 'Doctrine and Covenants and church history', short: 'D&C', c: '#8cc49a' },
      { id: 'pgp', name: 'Pearl of Great Price', short: 'PGP', c: '#c49ad9' },
    ],
    timeline: {
      min: 1800,
      max: 2000,
      step: 1,
      label: 'Years',
      eras: [
        { name: 'Restoration in New York, Ohio and Missouri', from: 1820, to: 1838 },
        { name: 'Nauvoo and the westward migration', from: 1839, to: 1847 },
        { name: 'Utah period', from: 1848, to: 2000 },
      ],
    },
    start: { world: 'earth', view: 'surface', site: 'jerusalem' },
    ui: {
      galaxyButton: 'Space',
      homeButton: 'Earth',
      indexTitle: 'Earth',
      chronTitle: 'NARRATIVES',
      codexTitle: 'REFERENCE',
      noteLabels: { text: 'The text', tradition: 'Tradition', scholarship: 'History and scholarship' },
      modernLabel: 'Marker',
      routeNote: 'Narrative sequence; connecting lines are schematic, not a recovered road.',
    },
    intro: {
      text: 'An Earth atlas of places named in the Latter-day Saint standard works. Each work is a layer: switch layers to see one work or all of them combined. Pins mark modern heritage properties, gazetteer points or visitor centers, which locate a place but do not mark the exact spot of an event. Places without an approved location, including every Book of Mormon place, are listed in the reference library instead of being pinned. The reference library follows the same layers; entries without verified locations are not placed on the Earth map.',
      legend: [
        ['Layers', 'One per work; all on = all works combined'],
        ['Pins', 'Modern anchors, not exact event sites'],
        ['Dashed lines', 'Order of stops in the text; not a road'],
      ],
    },
    groups: [{ id: 'earth', name: 'Earth' }],
    worlds: [
      {
        id: 'earth',
        name: 'Earth',
        group: 'earth',
        books: [1, 2, 3, 4, 5],
        major: true,
        map: [0, 27.14],
        blurb: 'Places named in the standard works that have a cited modern location.',
        distText: 'Present-day Earth with modern place markers',
        gfx: { type: 'terran', base: 'earth', sea: 0.5, clouds: 0.25 },
        hero: 'jerusalem',
        sites: [
          {
            /* P08. UNESCO Old City of Jerusalem [S22]; OT anchor 2 Sam 5 (AE05). */
            id: 'jerusalem',
            major: true,
            name: 'Jerusalem',
            lat: 31.777778,
            lon: 35.231667,
            books: [OT, NT, BOM],
            layers: ['ot', 'nt', 'bom'],
            modern: 'Old City of Jerusalem (UNESCO World Heritage property)',
            desc: 'The marker locates Jerusalem’s Old City.',
            notes: [
              {
                k: 'text',
                t: '2 Samuel describes David taking Zion and establishing his residence there.',
                layers: ['ot'],
                ref: '2 Sam. 5',
              },
              {
                k: 'text',
                t: 'Luke describes Jesus being brought to Jerusalem for presentation.',
                layers: ['nt'],
                ref: 'Luke 2:22',
              },
              {
                k: 'text',
                t: '1 Nephi places Lehi at Jerusalem during Zedekiah’s reign.',
                layers: ['bom'],
                ref: '1 Ne. 1:4',
              },
            ],
          },
          {
            /* P07. UNESCO Birthplace of Jesus: Church of the Nativity and the Pilgrimage Route [S23]. */
            id: 'bethlehem',
            name: 'Bethlehem',
            lat: 31.704353,
            lon: 35.2075,
            books: [OT, NT],
            layers: ['ot', 'nt'],
            modern: 'Nativity heritage property, Bethlehem (UNESCO)',
            desc: 'The marker locates the Nativity heritage property in Bethlehem.',
            notes: [
              {
                k: 'text',
                t: 'Ruth describes Naomi and Ruth arriving in Bethlehem. The mapped property does not locate their arrival.',
                layers: ['ot'],
                ref: 'Ruth 1',
              },
              {
                k: 'text',
                t: 'Luke places Jesus’ birth in Bethlehem; the mapped property commemorates that birth in Christian tradition.',
                layers: ['nt'],
                ref: 'Luke 2:4–7',
              },
            ],
          },
          {
            /* P06. Pleiades 678299 representative point (gazetteer-evidence.md). */
            id: 'nazareth',
            name: 'Nazareth',
            lat: 32.701029,
            lon: 35.300148,
            books: [NT],
            layers: ['nt'],
            modern: 'Representative point, Pleiades gazetteer',
            desc: 'Representative location of Nazareth from the Pleiades gazetteer.',
            notes: [
              {
                k: 'text',
                t: 'Luke names Nazareth as Joseph’s starting point before the journey to Bethlehem.',
                ref: 'Luke 2:4',
              },
            ],
          },
          {
            /* AP08. Pleiades 678231 representative point. */
            id: 'capernaum',
            name: 'Capernaum',
            lat: 32.880887,
            lon: 35.575891,
            books: [NT],
            layers: ['nt'],
            modern: 'Representative point, Pleiades gazetteer',
            desc: 'Representative location of Capernaum from the Pleiades gazetteer.',
            notes: [
              { k: 'text', t: 'Matthew describes Jesus settling at Capernaum by the sea.', ref: 'Matt. 4:13' },
            ],
          },
          {
            /* AP06. UNESCO Tell es-Sultan [A19]. */
            id: 'jericho',
            name: 'Jericho',
            lat: 31.871306,
            lon: 35.444056,
            books: [OT],
            layers: ['ot'],
            modern: 'Tell es-Sultan, northwest of modern Jericho (UNESCO)',
            desc: 'The marker locates Tell es-Sultan, the heritage site of ancient Jericho. The coordinate does not date or verify Joshua’s account.',
            notes: [{ k: 'text', t: 'Joshua narrates the capture and destruction of Jericho.', ref: 'Josh. 6' }],
          },
          {
            /* AP07. UNESCO Babylon [A18]. */
            id: 'babylon',
            major: true,
            name: 'Babylon',
            lat: 32.541969,
            lon: 44.420833,
            books: [OT],
            layers: ['ot'],
            modern: 'Babylon archaeological property, Iraq (UNESCO)',
            desc: 'The marker locates the Babylon archaeological property.',
            notes: [
              { k: 'text', t: 'Babylon is the departure point for returning exiles in Ezra.', ref: 'Ezra 1' },
            ],
          },
          {
            /* AP16. Pleiades 639048 representative point. */
            id: 'perga',
            name: 'Perga',
            lat: 36.964466,
            lon: 30.853259,
            books: [NT],
            layers: ['nt'],
            modern: 'Representative point, Pleiades gazetteer',
            desc: 'Representative location of Perga from the Pleiades gazetteer.',
            notes: [
              {
                k: 'text',
                t: 'The company reaches Perga before continuing inland.',
                ref: 'Acts 13:13–14',
              },
            ],
          },
          {
            /* AP17. Pleiades 609307 representative point; distinct from the sending church's Antioch (AP12). */
            id: 'antioch-pisidia',
            name: 'Antioch in Pisidia',
            lat: 38.305374,
            lon: 31.18987,
            books: [NT],
            layers: ['nt'],
            modern: 'Representative point, Pleiades gazetteer',
            desc: 'Representative location of Antioch in Pisidia from the Pleiades gazetteer. Not the Antioch that sent Barnabas and Saul.',
            notes: [{ k: 'text', t: 'Paul and Barnabas visit the synagogue here.', ref: 'Acts 13:14' }],
          },
          {
            /* AP25. UNESCO Archaeological Site of Philippi [A20][A21]. */
            id: 'philippi',
            name: 'Philippi',
            lat: 41.014722,
            lon: 24.285278,
            books: [NT],
            layers: ['nt'],
            modern: 'Archaeological site of Philippi, northeastern Greece (UNESCO)',
            desc: 'The marker locates the archaeological site of Philippi. It does not mark where Lydia was baptized.',
            notes: [{ k: 'text', t: 'Acts places the meeting with Lydia near Philippi.', ref: 'Acts 16:12–15' }],
          },
          {
            /* AP12. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia "Antioch" coordinates; ruins lie beneath modern Antakya. */
            /* AP12. BA02 replace-representative: ToposText https://topostext.org/place/362362PAnt; original point 36.20472, 36.18167. */
            id: 'antioch-sending',
            name: 'Antioch (sending church)',
            lat: 36.200000,
            lon: 36.165000,
            books: [NT],
            layers: ['nt'],
            modern: 'Antioch on the Orontes; representative ancient-city point at modern Antakya, not the sending church building. Coordinate: ToposText gazetteer point (representative).',
            desc: 'City reference point for ancient Antioch, whose ruins lie beneath modern Antakya. Not Antioch in Pisidia.',
            notes: [{ k: 'text', t: 'The church sends Barnabas and Saul from Antioch.', ref: 'Acts 13:1–4' }],
          },
          {
            /* AP13. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia "Seleucia Pieria" infobox. */
            /* AP13. BA02 replace-representative: ToposText https://topostext.org/place/361359USel; original point 36.12389, 35.92194. */
            id: 'seleucia',
            name: 'Seleucia',
            lat: 36.122200,
            lon: 35.934700,
            books: [NT],
            layers: ['nt'],
            modern: 'Seleucia Pieria; representative ruins point near Cevlik, not an embarkation berth. Coordinate: ToposText gazetteer point (representative).',
            desc: 'Representative point for the ruins of Seleucia Pieria, Antioch’s port. Not a harbor or embarkation point.',
            notes: [{ k: 'text', t: 'The travelers sail from Seleucia toward Cyprus.', ref: 'Acts 13:4' }],
          },
          {
            /* AP14. Builder-compiled anchor (RR01/Q01), pending canon audit: Pleiades 707617 (Salamis/Konstantia) representative point. */
            /* AP14. BA02 replace-representative: ToposText https://topostext.org/place/352339PSal; original point 35.179581302, 33.9028569668. */
            id: 'salamis',
            name: 'Salamis',
            lat: 35.179951,
            lon: 33.903053,
            books: [NT],
            layers: ['nt'],
            modern: 'Salamis/Konstantia, Cyprus; representative city-site point, not a synagogue location. Coordinate: ToposText gazetteer point (representative).',
            desc: 'Representative location of Salamis on Cyprus from the Pleiades gazetteer. No synagogue is located.',
            notes: [{ k: 'text', t: 'Barnabas and Saul preach at Salamis.', ref: 'Acts 13:5' }],
          },
          {
            /* AP15. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia "Nea Paphos (ancient city)" coordinates; Nea Paphos specifically, not Palaepaphos. */
            /* AP15. BA02 replace-representative: ToposText https://topostext.org/place/348324PPap; original point 34.760, 32.407. */
            id: 'paphos',
            name: 'Paphos',
            lat: 34.757000,
            lon: 32.407000,
            books: [NT],
            layers: ['nt'],
            modern: 'Nea Paphos / Kato Paphos; representative ancient-city point, not Palaepaphos or the proconsul encounter location. Coordinate: ToposText gazetteer point (representative).',
            desc: 'Locates the ancient city of Nea Paphos, capital of Cyprus in the Roman era. Not the older sanctuary town of Palaepaphos.',
            notes: [{ k: 'text', t: 'The mission reaches Paphos before sailing to Perga.', ref: 'Acts 13:6–13' }],
          },
          {
            /* AP18. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia "Konya" infobox; page states Konya was known in antiquity as Iconium. */
            /* AP18. BA02 replace-representative: ToposText https://topostext.org/place/379325PIko; original point 37.87444, 32.49306. */
            id: 'iconium',
            name: 'Iconium',
            lat: 37.872800,
            lon: 32.492100,
            books: [NT],
            layers: ['nt'],
            modern: 'Iconium / modern Konya; representative city point, not a synagogue or episode location. Coordinate: ToposText gazetteer point (representative).',
            desc: 'City reference point for modern Konya, known in antiquity as Iconium.',
            notes: [{ k: 'text', t: 'Paul and Barnabas preach in Iconium.', ref: 'Acts 14:1' }],
          },
          {
            /* AP21. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia "Antalya" infobox; page states the city was formerly Attaleia. */
            /* AP21. BA02 replace-representative: ToposText https://topostext.org/place/369307PAtt; original point 36.88694, 30.70333. */
            id: 'attalia',
            name: 'Attalia',
            lat: 36.885300,
            lon: 30.708600,
            books: [NT],
            layers: ['nt'],
            modern: 'Attalia / modern Antalya; representative city point, not an embarkation berth. Coordinate: ToposText gazetteer point (representative).',
            desc: 'City reference point for modern Antalya, formerly Attaleia. Not a harbor point.',
            notes: [{ k: 'text', t: 'The return voyage departs from Attalia.', ref: 'Acts 14:25–26' }],
          },
          {
            /* AP22. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia "Alexandria Troas" infobox (point given for the site’s baths). */
            /* AP22. BA02 replace-representative: ToposText https://topostext.org/place/398262UAnt; original point 39.75167, 26.15861. */
            id: 'troas',
            name: 'Troas',
            lat: 39.752000,
            lon: 26.159000,
            books: [NT],
            layers: ['nt'],
            modern: 'Alexandria Troas; representative ruins point, not the room, baths or harbor of a narrated episode. Coordinate: ToposText gazetteer point (representative).',
            desc: 'Representative point within the large ruined city of Alexandria Troas. Not a harbor or departure point.',
            notes: [{ k: 'text', t: 'The company departs from Troas toward Macedonia.', ref: 'Acts 16:8–11' }],
          },
          {
            /* AP27. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia "Syracuse, Sicily" infobox. */
            /* AP27. BA02 replace-representative: ToposText https://topostext.org/place/371153PSyr; original point 37.06917, 15.28750. */
            id: 'syracuse',
            name: 'Syracuse',
            lat: 37.063900,
            lon: 15.293000,
            books: [NT],
            layers: ['nt'],
            modern: 'Syracuse / Siracusa; representative city point, not the landing place in Acts. Coordinate: ToposText gazetteer point (representative).',
            desc: 'City reference point for Syracuse. The harbor where the ship stopped is not marked.',
            notes: [{ k: 'text', t: 'The company stops at Syracuse.', ref: 'Acts 28:12' }],
          },
          {
            /* AP28. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia "Reggio Calabria" infobox; page states the city was ancient Rhegion. */
            /* AP28. BA02 replace-representative: ToposText https://topostext.org/place/381156PRhe; original point 38.11139, 15.66194. */
            id: 'rhegium',
            name: 'Rhegium',
            lat: 38.109000,
            lon: 15.644000,
            books: [NT],
            layers: ['nt'],
            modern: 'Rhegium / Reggio Calabria; representative ancient-city point, not a verified port stop. Coordinate: ToposText gazetteer point (representative).',
            desc: 'City reference point for Reggio Calabria, ancient Rhegion. The harbor is not marked.',
            notes: [{ k: 'text', t: 'The voyage continues through Rhegium.', ref: 'Acts 28:13' }],
          },
          {
            /* AP29. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia "Pozzuoli" infobox; page states Pozzuoli was known in antiquity as Puteoli. */
            /* AP29. BA02 replace-representative: ToposText https://topostext.org/place/408141PDik; original point 40.84444, 14.09333. */
            id: 'puteoli',
            name: 'Puteoli',
            lat: 40.825900,
            lon: 14.125300,
            books: [NT],
            layers: ['nt'],
            modern: 'Puteoli / Dikaiarcheia / Pozzuoli; representative ancient-city point, not the landing berth. Coordinate: ToposText gazetteer point (representative).',
            desc: 'City reference point for Pozzuoli, ancient Puteoli. The harbor is not marked.',
            notes: [{ k: 'text', t: 'The travelers stay with believers at Puteoli.', ref: 'Acts 28:13–14' }],
          },
          {
            /* AP32. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia "Rome" infobox. */
            /* AP32. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Rome. */
            id: 'rome',
            major: true,
            name: 'Rome',
            lat: 41.89333,
            lon: 12.48278,
            books: [NT],
            layers: ['nt'],
            modern: 'Rome; approximate modern-city reference, not Paul’s lodging, prison or an ancient administrative center. Coordinate: secondary source (approximate).',
            desc: 'City reference point for Rome. Paul’s residence under guard is not located.',
            notes: [{ k: 'text', t: 'Acts ends with Paul receiving visitors under guard in Rome.', ref: 'Acts 28:16, 30–31' }],
          },
          {
            /* AP33. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia "Patmos" coordinates. */
            /* AP33. BA02 replace-representative: ToposText https://topostext.org/place/373265IPat; original point 37.3250, 26.5417. */
            id: 'patmos',
            name: 'Patmos',
            lat: 37.326000,
            lon: 26.535200,
            books: [NT],
            layers: ['nt'],
            modern: 'Patmos; island reference using the gazetteer point associated with Kastelli, not the traditional cave or the place of a vision. Coordinate: ToposText gazetteer point (representative).',
            desc: 'Reference point for the island of Patmos. No cave or other site on the island is identified.',
            notes: [{ k: 'text', t: 'John locates himself on Patmos when introducing the vision.', ref: 'Rev. 1:9' }],
          },
          {
            /* RP05. NPS: Mormon Trail Center, 3215 State Street, North Omaha [R13]. */
            id: 'winter-quarters',
            name: 'Winter Quarters',
            lat: 41.33503,
            lon: -95.965154,
            books: [DC],
            layers: ['dc'],
            when: [1846, 1848],
            modern: 'Mormon Trail Center, North Omaha, Nebraska (National Park Service)',
            desc: 'Winter Quarters sheltered emigrants before their westward journey. The marker identifies the modern Mormon Trail Center, not the precise revelation site.',
          },
          {
            /* P12. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Peter Whitmer log home). */
            /* P12. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Peter_Whitmer_log_home; identity https://www.churchofjesuschrist.org/learn/locations/whitmer-farm-church-organization-site?lang=eng. */
            id: 'fayette',
            name: 'Fayette (Whitmer home)',
            lat: 42.865972,
            lon: -76.869778,
            books: [DC],
            layers: ['dc'],
            /* BA06: no `when` on this persistent reference point; its 1829 and 1830 episodes carry their own dates. */
            modern: 'Whitmer farm near Fayette; approximate reference to the replica log home, not surviving 1830 fabric. Coordinate: secondary source (approximate).',
            desc: 'The Joseph Smith Papers editors identify the Whitmer home in Fayette as the Church’s organization setting. The marker locates the replica log home on the farm site; the original house no longer stands.',
          },
          {
            /* P13. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Independence, Missouri). */
            /* P13. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Independence. */
            id: 'independence',
            name: 'Independence',
            lat: 39.0925,
            lon: -94.41389,
            books: [DC],
            layers: ['dc'],
            when: 1831,
            modern: 'Independence, Missouri; approximate modern city reference, not the temple lot or a revelation location. Coordinate: secondary source (approximate).',
            desc: 'D&C 57 names Independence as the center place for Zion and describes a nearby temple lot. The marker is the city’s reference point, not the temple lot.',
          },
          {
            /* P14. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Kirtland Temple). */
            /* P14. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Kirtland_Temple; identity https://www.churchofjesuschrist.org/learn/locations/kirtland-temple?lang=eng. */
            id: 'kirtland-temple',
            major: true,
            name: 'Kirtland Temple',
            lat: 41.62528,
            lon: -81.36222,
            books: [DC],
            layers: ['dc'],
            when: 1836,
            modern: 'Kirtland Temple; approximate building reference, not a room or the physical location of a vision. Coordinate: secondary source (approximate).',
            desc: 'D&C 109 preserves the prayer associated with the Kirtland Temple dedication. The marker locates the standing temple.',
          },
          {
            /* P15. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Nauvoo, Illinois). */
            /* P15. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Nauvoo,_Illinois. */
            id: 'nauvoo',
            major: true,
            name: 'Nauvoo',
            lat: 40.54444,
            lon: -91.375,
            books: [DC],
            layers: ['dc'],
            when: [1839, 1846],
            modern: 'Nauvoo, Illinois; approximate modern city reference, not a house, temple or departure landing. Coordinate: secondary source (approximate).',
            desc: 'The heading to D&C 124 places the revelation at Nauvoo. Its instructions include building a temple and lodging for visitors. The marker is the city’s reference point.',
          },
          {
            /* P16. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Carthage Jail). */
            /* P16. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Carthage_Jail; identity https://www.nps.gov/places/carthage-jail.htm. */
            id: 'carthage-jail',
            name: 'Carthage Jail',
            lat: 40.41572,
            lon: -91.13884,
            books: [DC],
            layers: ['dc'],
            when: 1844,
            modern: 'Carthage Jail; approximate historic-building reference, not a room-level event coordinate. Coordinate: secondary source (approximate).',
            desc: 'D&C 135 reports Joseph and Hyrum Smith’s deaths at Carthage Jail. The marker locates the standing jail building.',
          },
          {
            /* RP01. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Priesthood Restoration Site). */
            /* RP01. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Priesthood_Restoration_Site; identity https://www.churchofjesuschrist.org/learn/locations/priesthood-restoration-site?lang=eng. */
            id: 'harmony',
            name: 'Harmony / Priesthood Restoration Site',
            lat: 41.9512,
            lon: -75.6387,
            books: [DC],
            layers: ['dc'],
            when: 1829,
            modern: 'Historic Harmony / Priesthood Restoration Site in modern Oakland Township; approximate site-complex reference. Houses are reconstructions; this point does not locate the baptism or a specific house. Coordinate: secondary source (approximate).',
            desc: 'The Church’s historic site commemorates the Smith home where much of the Book of Mormon dictation took place. Current houses are reconstructions, not original standing homes.',
          },
          {
            /* RP03. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Palmyra (village), New York). */
            /* RP03. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Palmyra_(village),_New_York. */
            id: 'palmyra',
            major: true,
            name: 'Palmyra',
            lat: 43.06417,
            lon: -77.23361,
            books: [DC],
            layers: ['dc'],
            when: 1830,
            modern: 'Palmyra, New York; approximate village reference, not the Grandin print shop, Smith farm or Sacred Grove. Coordinate: secondary source (approximate).',
            desc: 'Palmyra hosted publication of the Book of Mormon. The marker is the village’s reference point, not the print shop.',
          },
          {
            /* RP07. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Salt Lake Temple). */
            /* RP07. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Salt_Lake_Temple; identity https://www.churchofjesuschrist.org/temples/details/salt-lake-temple?lang=eng. */
            id: 'salt-lake-temple',
            major: true,
            name: 'Salt Lake Temple',
            lat: 40.77056,
            lon: -111.89194,
            books: [DC],
            layers: ['dc'],
            when: 1978,
            modern: 'Salt Lake Temple; approximate temple-building reference, not a room or the exact place of the 1978 experience. Coordinate: secondary source (approximate).',
            desc: 'The official declaration’s heading identifies this temple as the setting for Church leaders’ reported confirmation in June 1978. The marker locates the temple.',
          },
          {
            /* RP09. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Garden Grove, Iowa). */
            /* RP09. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Garden_Grove,_Iowa; identity https://www.nps.gov/mopi/planyourvisit/garden-grove.htm. */
            id: 'garden-grove',
            name: 'Garden Grove',
            lat: 40.82667,
            lon: -93.60694,
            books: [DC],
            layers: ['dc'],
            when: 1846,
            modern: 'Garden Grove, Iowa; approximate modern-town reference, not the 1846 camp location. Coordinate: secondary source (approximate).',
            desc: 'Emigrants established a farming settlement to support travelers who followed. The marker is the modern town’s reference point, not the 1846 camp.',
          },
          {
            /* RP10. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Mount Pisgah, Iowa). */
            /* RP10. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Mount_Pisgah,_Iowa; identity https://www.nps.gov/mopi/planyourvisit/mount-pisgah.htm. */
            id: 'mount-pisgah',
            name: 'Mount Pisgah (Iowa)',
            lat: 41.038586,
            lon: -94.113028,
            books: [DC],
            layers: ['dc'],
            when: 1846,
            modern: 'Mount Pisgah way station and cemetery near Thayer, Union County, Iowa. Approximate historic-site reference, not a surveyed cemetery boundary or individual grave. Coordinate: secondary source (approximate).',
            desc: 'A second farming settlement supported the migration across Iowa. Not the biblical Pisgah.',
          },
          {
            /* RP11. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Chimney Rock National Historic Site). */
            /* RP11. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Chimney_Rock_National_Historic_Site; identity https://www.nps.gov/places/000/chimney-rock-national-historic-site.htm. */
            id: 'chimney-rock',
            name: 'Chimney Rock',
            lat: 41.70361,
            lon: -103.34833,
            books: [DC],
            layers: ['dc'],
            when: 1847,
            modern: 'Chimney Rock, Nebraska; approximate landmark reference near Bayard, not the museum, campsite or an emigrant observation point. Coordinate: secondary source (approximate).',
            desc: 'The 1847 emigrant company passed this landmark on its journey west.',
          },
          {
            /* RP13. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Fort Bridger). */
            /* RP13. BA03 conditional-retain (L): secondary coordinate https://en.wikipedia.org/wiki/Fort_Bridger; identity https://www.nps.gov/places/000/fort-bridger-state-historic-site.htm. */
            id: 'fort-bridger',
            name: 'Fort Bridger',
            lat: 41.31778,
            lon: -110.39194,
            books: [DC],
            layers: ['dc'],
            when: 1847,
            modern: 'Fort Bridger State Historic Site; approximate grounds reference, not a particular 1847 camp or an assertion that every structure is original. Coordinate: secondary source (approximate).',
            desc: 'Near Fort Bridger, the company turned toward Utah on the Hastings Cutoff.',
          },
        ],
        routes: [
          {
            /* J02. Luke 2:4–7, 22, 39. Jesus is born at Bethlehem, so the first leg is Joseph and Mary's. */
            id: 'luke-childhood',
            name: 'Joseph, Mary and Jesus in Luke',
            books: [NT],
            layers: ['nt'],
            ref: 'Luke 2:4–7, 22, 39',
            desc: 'Luke’s sequence; no precise route or travel date supplied. Jesus is born at Bethlehem, so the first leg is Joseph and Mary’s journey.',
            stops: [
              { site: 'nazareth', note: 'Joseph and Mary set out' },
              { site: 'bethlehem', note: 'Jesus is born' },
              { site: 'jerusalem', note: 'Presentation' },
              { site: 'nazareth', note: 'Return' },
            ],
          },
          {
            /* AJ06. Matt 4:13. */
            id: 'nazareth-capernaum',
            name: 'Jesus moves to Capernaum',
            books: [NT],
            layers: ['nt'],
            ref: 'Matt. 4:13',
            desc: 'Matthew’s move to Capernaum; no precise road supplied.',
            stops: ['nazareth', 'capernaum'],
          },
          {
            /* AJ02. Ezra 1:11. */
            id: 'return-babylon',
            name: 'Return from Babylon',
            books: [OT],
            layers: ['ot'],
            ref: 'Ezra 1:11',
            desc: 'Return sequence in Ezra; route schematic. The intermediate path is unknown.',
            stops: ['babylon', 'jerusalem'],
          },
          {
            /* AJ03. Acts 13–14. Unanchored stops are listed but not drawn. John leaves at Perga. */
            id: 'paul-first-mission',
            name: 'Barnabas and Saul’s first mission',
            books: [NT],
            layers: ['nt'],
            ref: 'Acts 13–14',
            desc: 'Named stops in Acts; roads and sea tracks schematic. John accompanies the outbound part and leaves at Perga. Stops without an approved location are listed but not drawn.',
            stops: [
              'antioch-sending',
              'seleucia',
              'salamis',
              'paphos',
              { site: 'perga', note: 'John leaves the company' },
              'antioch-pisidia',
              'iconium',
              { name: 'Lystra', note: 'healing (Acts 14:6–10); identification contested, not drawn' },
              { name: 'Derbe', note: 'site debated; not drawn' },
              { name: 'Lystra', note: 'return visit; not drawn' },
              'iconium',
              'antioch-pisidia',
              'perga',
              'attalia',
              'antioch-sending',
            ],
          },
          {
            /* AJ04. Acts 16:11–12. Selected segment, not the whole second mission. */
            id: 'macedonia-crossing',
            name: 'Crossing toward Macedonia',
            books: [NT],
            layers: ['nt'],
            ref: 'Acts 16:11–12',
            desc: 'Crossing toward Macedonia in Acts; a selected segment, not the whole second mission.',
            stops: ['troas', { name: 'Samothracia' }, { name: 'Neapolis' }, 'philippi'],
          },
          {
            /* AJ05. Acts 28:11–16. Appii Forum and Three Taverns grouped (their order is not separately stated). */
            id: 'italy-segment',
            name: 'Paul’s company to Rome',
            books: [NT],
            layers: ['nt'],
            ref: 'Acts 28:11–16',
            desc: 'Final travel segment in Acts; intermediate meeting places grouped. Sea tracks schematic. Melita and the meeting places have no approved location and are listed but not drawn.',
            stops: [
              { name: 'Melita', note: 'winters on the island' },
              'syracuse',
              'rhegium',
              'puteoli',
              { name: 'Appii Forum and Three Taverns', note: 'believers meet the company' },
              'rome',
            ],
          },
          {
            /* RJ01. Builder anchors (Q01). JSP dates the move to May; the site describes June hosting. */
            id: 'dictation-move',
            name: 'From Harmony to the Whitmer home',
            books: [DC],
            layers: ['dc'],
            when: 1829,
            desc: 'Work moved to the Whitmer household before dictation was completed (1829). Day and month are not reconciled between sources.',
            stops: ['harmony', 'fayette'],
          },
          {
            /* RJ02. Compressed sequence; east-bank camps and river-crossing stages are omitted. */
            id: 'iowa-migration',
            name: 'Nauvoo to the Missouri River camps',
            books: [DC],
            layers: ['dc'],
            when: 1846,
            desc: 'A compressed migration sequence across Iowa in 1846. East-bank camps and river-crossing stages are omitted, not conflated with Winter Quarters.',
            stops: [
              { site: 'nauvoo', note: 'Cross Iowa' },
              { site: 'garden-grove', note: 'Support farms for later travelers' },
              { site: 'mount-pisgah', note: 'Continue toward the Missouri River' },
              'winter-quarters',
            ],
          },
          {
            /* RJ03. Abridged sequence. South Pass (coordinate conflict, A01d/BA01) and the Salt Lake Valley have no approved pin, so their legs are listed, not drawn. */
            id: 'valley-migration',
            name: 'The 1847 journey',
            books: [DC],
            layers: ['dc'],
            when: 1847,
            desc: 'An abridged sequence for Brigham Young’s 1847 company. Stops without an approved location are listed but not drawn.',
            stops: [
              { site: 'winter-quarters', note: 'Across the plains' },
              { site: 'chimney-rock', note: 'Across the Divide' },
              { name: 'South Pass', note: 'Across the Continental Divide toward Fort Bridger; location held, not drawn' },
              { site: 'fort-bridger', note: 'Along the Hastings Cutoff' },
              { name: 'Salt Lake Valley' },
            ],
          },
        ],
      },
    ],
    events: [
      /* Only narratives whose place has an approved anchor are in the Chronicle (build-handoff.md: unlocated
         episodes stay in the reference library). Ancient episodes carry no numeric year. */
      {
        id: 'jericho-capture',
        book: OT,
        world: 'earth',
        site: 'jericho',
        layers: ['ot'],
        title: 'Capture of Jericho',
        text: 'Joshua recounts Jericho’s destruction and the rescue of Rahab’s household.',
      } /* AE04 */,
      {
        id: 'david-jerusalem',
        book: OT,
        world: 'earth',
        site: 'jerusalem',
        layers: ['ot'],
        title: 'David takes Jerusalem',
        text: '2 Samuel describes David taking Zion and establishing his residence there.',
      } /* AE05 */,
      {
        id: 'jerusalem-destruction',
        book: OT,
        world: 'earth',
        site: 'jerusalem',
        layers: ['ot'],
        title: 'Jerusalem destroyed',
        text: '2 Kings describes the burning of Jerusalem and the deportation of survivors under Babylonian rule. The text dates the burning to Nebuchadnezzar’s nineteenth year.',
      } /* AE06 */,
      {
        id: 'cyrus-return',
        book: OT,
        world: 'earth',
        site: 'babylon',
        layers: ['ot'],
        title: 'Return authorized',
        text: 'Ezra describes Cyrus authorizing rebuilding and temple vessels returning from Babylon.',
      } /* AE07 */,
      {
        id: 'jesus-birth-luke',
        book: NT,
        world: 'earth',
        site: 'bethlehem',
        layers: ['nt'],
        title: 'Birth in Luke',
        text: 'Luke describes Joseph and Mary’s journey to Bethlehem and Jesus’ birth there.',
      } /* E03 */,
      {
        id: 'presentation',
        book: NT,
        world: 'earth',
        site: 'jerusalem',
        layers: ['nt'],
        title: 'Presentation in Jerusalem',
        text: 'Jesus is brought to Jerusalem for presentation.',
      } /* E04 */,
      {
        id: 'galilee-ministry',
        book: NT,
        world: 'earth',
        site: 'capernaum',
        layers: ['nt'],
        title: 'Ministry in Galilee',
        text: 'Matthew describes Jesus settling at Capernaum and calling fishermen beside the sea.',
      } /* AE08 */,
      {
        id: 'mission-sending',
        book: NT,
        world: 'earth',
        site: 'antioch-sending',
        layers: ['nt'],
        title: 'Barnabas and Saul sent',
        text: 'The church commissions Barnabas and Saul for their mission.',
      } /* AE11 */,
      {
        id: 'paul-rome',
        book: NT,
        world: 'earth',
        site: 'rome',
        layers: ['nt'],
        title: 'Paul reaches Rome',
        text: 'Acts describes Paul teaching visitors during his guarded residence in Rome.',
      } /* AE12; two years stated in Acts 28:30, no start year inferred */,
      {
        id: 'patmos-vision',
        book: NT,
        world: 'earth',
        site: 'patmos',
        layers: ['nt'],
        title: 'Vision introduced on Patmos',
        text: 'John introduces his revelation from Patmos and addresses seven churches.',
      } /* AE13 */,
      {
        id: 'lehi-jerusalem',
        book: BOM,
        world: 'earth',
        site: 'jerusalem',
        layers: ['bom'],
        title: 'Lehi at Jerusalem',
        text: 'Nephi introduces Lehi’s life at Jerusalem and his visionary experience.',
      } /* E05 */,
      {
        id: 'winter-quarters-camp',
        book: DC,
        world: 'earth',
        site: 'winter-quarters',
        layers: ['dc'],
        when: 1846,
        title: 'Winter camp on the Missouri',
        text: 'Emigrants established Winter Quarters on Omaha land beside the Missouri River, in autumn 1846.',
      } /* RE10 */,
      {
        id: 'dc136-camp-instructions',
        book: DC,
        world: 'earth',
        site: 'winter-quarters',
        layers: ['dc'],
        when: 1847,
        title: 'Instructions for the journey',
        text: 'D&C 136 (January 14, 1847) directs the organization of traveling companies and shared provision for vulnerable families.',
      } /* RE11 */,
      {
        id: 'departure-winter-quarters',
        book: DC,
        world: 'earth',
        site: 'winter-quarters',
        layers: ['dc'],
        when: 1847,
        title: 'Westward departure',
        text: 'The first group led by Brigham Young left Winter Quarters for the western journey on April 5, 1847. Later companies had separate departure dates.',
      } /* RE12 */,
      {
        id: 'aaronic-priesthood-account',
        book: DC,
        world: 'earth',
        site: 'harmony',
        layers: ['dc'],
        when: 1829,
        title: 'Aaronic Priesthood account',
        text: 'Joseph Smith’s history reports that John the Baptist conferred priesthood authority near Harmony (D&C 13 heading; JS—H 1:68–72). No exact forest point is marked.',
      } /* RE01 */,
      {
        id: 'translation-fayette',
        book: DC,
        world: 'earth',
        site: 'fayette',
        layers: ['dc'],
        when: 1829,
        title: 'Final dictation in Fayette',
        text: 'The Whitmer home hosted the final phase of the Book of Mormon’s dictation, in June 1829.',
      } /* RE03 */,
      {
        id: 'book-mormon-publication',
        book: DC,
        world: 'earth',
        site: 'palmyra',
        layers: ['dc'],
        when: 1830,
        title: 'First edition available',
        text: 'Copies of the first Book of Mormon edition were available by the end of March 1830.',
      } /* RE04 */,
      {
        id: 'organization',
        book: DC,
        world: 'earth',
        site: 'fayette',
        layers: ['dc'],
        when: 1830,
        title: 'Church organization',
        text: 'The Church was organized on April 6, 1830; documentary editors locate the meeting in Fayette.',
      } /* E09 */,
      {
        id: 'zion-designation',
        book: DC,
        world: 'earth',
        site: 'independence',
        layers: ['dc'],
        when: 1831,
        title: 'Independence designated',
        text: 'The revelation of July 20, 1831 designates Independence as the center place for Zion (D&C 57).',
      } /* E10 */,
      {
        id: 'vision-celestial-kingdom',
        book: DC,
        world: 'earth',
        site: 'kirtland-temple',
        layers: ['dc'],
        when: 1836,
        title: 'Vision recorded at Kirtland',
        text: 'Joseph Smith reports seeing Alvin in the celestial kingdom and receiving teaching about those who died without gospel knowledge (D&C 137, January 21, 1836).',
      } /* RE08 */,
      {
        id: 'kirtland-dedication',
        book: DC,
        world: 'earth',
        site: 'kirtland-temple',
        layers: ['dc'],
        when: 1836,
        title: 'Kirtland dedication prayer',
        text: 'D&C 109 preserves the dedication prayer for the Kirtland Temple (March 27, 1836).',
      } /* E11 */,
      {
        id: 'nauvoo-revelation',
        book: DC,
        world: 'earth',
        site: 'nauvoo',
        layers: ['dc'],
        when: 1841,
        title: 'Nauvoo building instructions',
        text: 'The Nauvoo revelation of January 19, 1841 directs construction of a temple and a house for visitors (D&C 124).',
      } /* E13 */,
      {
        id: 'departure-nauvoo',
        book: DC,
        world: 'earth',
        site: 'nauvoo',
        layers: ['dc'],
        when: 1846,
        title: 'Departure from Nauvoo',
        text: 'The first wagons left Nauvoo and crossed the Mississippi River on February 4, 1846. This dates the first departures, not every family’s.',
      } /* RE09 */,
      {
        id: '1978-temple-confirmation',
        book: DC,
        world: 'earth',
        site: 'salt-lake-temple',
        layers: ['dc'],
        when: 1978,
        title: 'Reported confirmation in the temple',
        text: 'The heading to Official Declaration 2 reports that Church leaders affirmed, in the temple on June 1, 1978, the revelation ending racial priesthood restrictions. The later announcement and sustaining have their own dates.',
      } /* RE17 */,
    ],
    codex: [
      {
        id: 'works',
        title: 'The works',
        list: [
          {
            /* C01 */ name: 'Standard works',
            desc: 'The Church names the Bible, Book of Mormon, Doctrine and Covenants and Pearl of Great Price as its standard works.',
          },
          {
            /* C02 */ name: 'Resurrection testimony',
            books: [NT],
            layers: ['nt'],
            desc: 'Matthew 28 narrates the announcement that Jesus has risen, appearances to followers and a commission to teach and baptize.',
          },
          {
            /* C03 */ name: 'Baptism at Mormon',
            books: [BOM],
            layers: ['bom'],
            desc: 'Mosiah connects baptism with service, mourning with others and standing as witnesses of God.',
          },
          {
            /* C04 */ name: 'Doctrine and Covenants',
            books: [DC],
            layers: ['dc'],
            desc: 'The Church presents this collection as modern revelations and declarations. Section 7 is specifically described as a translated record attributed to John.',
          },
          {
            /* C05 */ name: 'Kolob',
            books: [PGP],
            layers: ['pgp'],
            desc: 'Abraham describes Kolob in a revelation about heavenly order and divine reckoning of time. This atlas does not identify it with an observed star.',
          },
          {
            /* C06 */ name: 'Principles and ordinances',
            books: [PGP],
            layers: ['pgp'],
            desc: 'The fourth Article of Faith names faith in Jesus Christ, repentance, baptism by immersion and laying on of hands for the gift of the Holy Ghost.',
          },
          {
            /* C07 */ name: 'Scripture and revelation',
            books: [PGP],
            layers: ['pgp'],
            desc: 'Articles of Faith 8–9 affirm the Bible, with a translation qualification, the Book of Mormon and continuing revelation.',
          },
        ],
      },
      {
        id: 'unmapped-places',
        title: 'Places without a map pin',
        list: [
          /* BA05: each source's account is its own entry, so it follows only its own layer. */
          unmapped('Haran', OT, ['ot'], 'Old Testament: Genesis describes Abram departing from Haran. Modern identification not adopted here.'), // P01
          unmapped('Haran', PGP, ['pgp'], 'Pearl of Great Price: Abraham’s account describes departure from Haran. Modern identification not adopted here.'), // P01
          unmapped('Shechem (Sichem)', OT, ['ot'], 'Old Testament: the journey reaches the place called Sichem by the plain of Moreh. Modern archaeological identification pending.'), // P02
          unmapped('Camp between Bethel and Hai', OT, ['ot'], 'Old Testament: Abram pitches his tent between Bethel and Hai and builds an altar. The text gives Bethel to the west and Hai to the east; no pin.'), // P03
          unmapped('Egypt', OT, ['ot'], 'Old Testament: Genesis describes Abram travelling to Egypt during famine. No single city or point is asserted.'), // P04
          unmapped('Horeb', OT, ['ot'], 'Old Testament: Exodus places Moses’ encounter at the burning bush at Horeb. No Sinai candidate is adopted.'), // P05
          unmapped('Ur of the Chaldees', OT, ['ot'], 'Old Testament: Genesis describes Terah’s household leaving Ur for Canaan and settling in Haran. No proposed Ur is chosen.'), // P18
          unmapped('Ur of the Chaldees', PGP, ['pgp'], 'Pearl of Great Price: Abraham describes leaving Ur with family members. No proposed Ur is chosen.'), // P18
          unmapped('Mount of Olives', OT, ['ot'], 'Old Testament: Zechariah’s prophecy names the Mount of Olives east of Jerusalem.'), // P20
          unmapped('Mount of Olives', NT, ['nt'], 'New Testament: Matthew names the Mount of Olives in the Passion narrative.'), // P20
          unmapped('Mount of Olives', PGP, ['pgp'], 'Pearl of Great Price: Joseph Smith—Matthew places Jesus’ conversation with his disciples on the Mount of Olives.'), // P20
          unmapped('Gethsemane', NT, ['nt'], 'New Testament: Matthew describes Jesus praying here before his arrest. No exact garden identification is adopted.'), // AP10
          unmapped('Golgotha', NT, ['nt'], 'New Testament: Matthew names Golgotha as the place of crucifixion. No modern candidate is selected.'), // AP11
          unmapped('Waters of Mormon', BOM, ['bom'], 'Book of Mormon: Mosiah describes Alma teaching and baptizing at waters in the place called Mormon. Modern location unknown; not placed on the Earth map.'), // P09
          unmapped('Temple in Bountiful', BOM, ['bom'], 'Book of Mormon: 3 Nephi places a gathered multitude at the temple in Bountiful when Jesus appears. Modern location unknown; distinct from the Bountiful on the Arabian shore in 1 Nephi.'), // P10
          unmapped('Woods near the Smith home', PGP, ['pgp'], 'Pearl of Great Price: Joseph Smith’s canonized account describes a prayer in nearby woods and a vision of two personages, reported for spring 1820, near Manchester, New York. No grove point is sourced.'), // P11
          unmapped('Enoch’s city (Zion)', DC, ['dc'], 'Doctrine and Covenants: D&C 38:4 describes the Zion of Enoch as taken into God’s presence. No terrestrial location is supplied.'), // P17
          unmapped('Enoch’s city (Zion)', PGP, ['pgp'], 'Pearl of Great Price: Moses 7 describes Enoch’s community as Zion and the city being taken up. No terrestrial location is supplied.'), // P17
          unmapped('Jershon (Abraham)', PGP, ['pgp'], 'Pearl of Great Price: Abraham names Jershon on the way from Haran to Canaan. Location unknown; not the Book of Mormon Jershon.'), // P19
        ],
      },
      {
        id: 'unmapped-narratives',
        title: 'Narratives without a map pin',
        list: [
          { name: 'Abram’s journey', books: [OT], layers: ['ot'], desc: 'Genesis traces Abram’s movement from Haran into Canaan and then Egypt (Gen. 12:4–10).' }, // E01
          { name: 'Moses’ commission', books: [OT], layers: ['ot'], desc: 'At Horeb, Moses is commissioned to bring Israel out of Egypt (Ex. 3:1–12).' }, // E02
          { name: 'Baptisms at Mormon', books: [BOM], layers: ['bom'], desc: 'Alma teaches baptismal commitments and baptizes at the waters of Mormon (Mosiah 18:7–17).' }, // E06
          { name: 'Jesus at Bountiful', books: [BOM], layers: ['bom'], desc: 'The narrative describes Jesus appearing to the multitude at the temple (3 Ne. 11:1–17).' }, // E07
          { name: 'First Vision account', books: [DC], layers: ['dc'], when: 1820, desc: 'The D&C introduction reports Joseph Smith’s First Vision in spring 1820 while he was living in Manchester.' }, // E08
          { name: 'First Vision account', books: [PGP], layers: ['pgp'], when: 1820, desc: 'Joseph Smith’s canonized account in the Pearl of Great Price reports a vision following prayer in the woods.' }, // E08
          { name: 'Abraham’s journey account', books: [PGP], layers: ['pgp'], desc: 'Abraham describes a journey from Ur through Haran and Canaan toward Egypt (Abr. 2:4–21). It gives Abraham’s age on leaving Haran as 62; Genesis 12:4 gives 75. Neither value is corrected or harmonized here.' }, // E12, LDS-Q04
        ],
      },
    ],
  };
})();

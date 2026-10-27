/* =====================================================================================================
   LATTER-DAY SAINT STANDARD WORKS: Track A data pack (schema: docs/atlas/PACK_FORMAT.md §20).
   BUILD CHECKPOINT 4 (draft, not reviewed): anchored core plus 13 builder-compiled restoration-era anchors
   (RR01/Q01, listed in docs/universes/packs/lds-standard-works/anchors-proposal.csv, pending canon audit).

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
   and Wikipedia infobox coordinates (NRHP/GNIS-derived) for the builder-compiled restoration-era anchors.
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
        'Wikipedia infobox coordinates (derived from NRHP/GNIS records) for restoration-era sites: Fayette, Independence, Kirtland Temple, Nauvoo, Carthage Jail, Harmony, Palmyra, Salt Lake Temple, Garden Grove, Mount Pisgah, Chimney Rock, South Pass, Fort Bridger',
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
            id: 'fayette',
            name: 'Fayette (Whitmer home)',
            lat: 42.865972,
            lon: -76.869778,
            books: [DC],
            layers: ['dc'],
            when: 1830,
            modern: 'Peter Whitmer log home (1980 replica on the original site), Fayette, New York',
            desc: 'The Joseph Smith Papers editors identify the Whitmer home in Fayette as the Church’s organization setting. The marker locates the replica log home on the farm site; the original house no longer stands.',
          },
          {
            /* P13. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Independence, Missouri). */
            id: 'independence',
            name: 'Independence',
            lat: 39.0925,
            lon: -94.41389,
            books: [DC],
            layers: ['dc'],
            when: 1831,
            modern: 'City of Independence, Missouri (city reference point)',
            desc: 'D&C 57 names Independence as the center place for Zion and describes a nearby temple lot. The marker is the city’s reference point, not the temple lot.',
          },
          {
            /* P14. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Kirtland Temple). */
            id: 'kirtland-temple',
            name: 'Kirtland Temple',
            lat: 41.62528,
            lon: -81.36222,
            books: [DC],
            layers: ['dc'],
            when: 1836,
            modern: 'Kirtland Temple, Kirtland, Ohio (standing building, National Historic Landmark)',
            desc: 'D&C 109 preserves the prayer associated with the Kirtland Temple dedication. The marker locates the standing temple.',
          },
          {
            /* P15. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Nauvoo, Illinois). */
            id: 'nauvoo',
            name: 'Nauvoo',
            lat: 40.54444,
            lon: -91.375,
            books: [DC],
            layers: ['dc'],
            when: [1839, 1846],
            modern: 'City of Nauvoo, Illinois (city reference point)',
            desc: 'The heading to D&C 124 places the revelation at Nauvoo. Its instructions include building a temple and lodging for visitors. The marker is the city’s reference point.',
          },
          {
            /* P16. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Carthage Jail). */
            id: 'carthage-jail',
            name: 'Carthage Jail',
            lat: 40.41572,
            lon: -91.13884,
            books: [DC],
            layers: ['dc'],
            when: 1844,
            modern: 'Carthage Jail, Carthage, Illinois (standing building, NRHP)',
            desc: 'D&C 135 reports Joseph and Hyrum Smith’s deaths at Carthage Jail. The marker locates the standing jail building.',
          },
          {
            /* RP01. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Priesthood Restoration Site). */
            id: 'harmony',
            name: 'Harmony (Smith home site)',
            lat: 41.9512,
            lon: -75.6387,
            books: [DC],
            layers: ['dc'],
            when: 1829,
            modern: 'Priesthood Restoration Site, Oakland Township, Pennsylvania (historic Harmony)',
            desc: 'The Church’s historic site commemorates the Smith home where much of the Book of Mormon dictation took place. Current houses are reconstructions, not original standing homes.',
          },
          {
            /* RP03. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Palmyra (village), New York). */
            id: 'palmyra',
            name: 'Palmyra',
            lat: 43.06417,
            lon: -77.23361,
            books: [DC],
            layers: ['dc'],
            when: 1830,
            modern: 'Village of Palmyra, New York (village reference point)',
            desc: 'Palmyra hosted publication of the Book of Mormon. The marker is the village’s reference point, not the print shop.',
          },
          {
            /* RP07. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Salt Lake Temple). */
            id: 'salt-lake-temple',
            name: 'Salt Lake Temple',
            lat: 40.77056,
            lon: -111.89194,
            books: [DC],
            layers: ['dc'],
            when: 1978,
            modern: 'Salt Lake Temple, Temple Square, Salt Lake City, Utah',
            desc: 'The official declaration’s heading identifies this temple as the setting for Church leaders’ reported confirmation in June 1978. The marker locates the temple.',
          },
          {
            /* RP09. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Garden Grove, Iowa). */
            id: 'garden-grove',
            name: 'Garden Grove',
            lat: 40.82667,
            lon: -93.60694,
            books: [DC],
            layers: ['dc'],
            when: 1846,
            modern: 'City of Garden Grove, Iowa (city reference point)',
            desc: 'Emigrants established a farming settlement to support travelers who followed. The marker is the modern town’s reference point, not the 1846 camp.',
          },
          {
            /* RP10. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Mount Pisgah, Iowa). */
            id: 'mount-pisgah',
            name: 'Mount Pisgah (Iowa)',
            lat: 41.038586,
            lon: -94.113028,
            books: [DC],
            layers: ['dc'],
            when: 1846,
            modern: 'Mount Pisgah historic site and cemetery, near Thayer, Iowa',
            desc: 'A second farming settlement supported the migration across Iowa. Not the biblical Pisgah.',
          },
          {
            /* RP11. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Chimney Rock National Historic Site). */
            id: 'chimney-rock',
            name: 'Chimney Rock',
            lat: 41.70361,
            lon: -103.34833,
            books: [DC],
            layers: ['dc'],
            when: 1847,
            modern: 'Chimney Rock National Historic Site, near Bayard, Nebraska',
            desc: 'The 1847 emigrant company passed this landmark on its journey west.',
          },
          {
            /* RP12. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (South Pass (Wyoming)). */
            id: 'south-pass',
            name: 'South Pass',
            lat: 42.3303,
            lon: -108.9738,
            books: [DC],
            layers: ['dc'],
            when: 1847,
            modern: 'Historic South Pass crossing, Continental Divide, Wyoming (National Historic Landmark)',
            desc: 'The company crossed the Continental Divide through South Pass. The marker is the historic crossing; the exact 1847 track is not plotted.',
          },
          {
            /* RP13. Builder-compiled anchor (RR01/Q01), pending canon audit: Wikipedia infobox coordinates (Fort Bridger). */
            id: 'fort-bridger',
            name: 'Fort Bridger',
            lat: 41.31778,
            lon: -110.39194,
            books: [DC],
            layers: ['dc'],
            when: 1847,
            modern: 'Fort Bridger State Historic Site, Wyoming',
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
              { name: 'Antioch (sending church)' },
              { name: 'Seleucia' },
              { name: 'Salamis' },
              { name: 'Paphos' },
              { site: 'perga', note: 'John leaves the company' },
              'antioch-pisidia',
              { name: 'Iconium' },
              { name: 'Lystra' },
              { name: 'Derbe' },
              { name: 'Lystra' },
              { name: 'Iconium' },
              'antioch-pisidia',
              'perga',
              { name: 'Attalia' },
              { name: 'Antioch (sending church)' },
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
            stops: [{ name: 'Troas' }, { name: 'Samothracia' }, { name: 'Neapolis' }, 'philippi'],
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
            /* RJ03. Abridged sequence. The Salt Lake Valley has no approved pin, so the last leg is listed, not drawn. */
            id: 'valley-migration',
            name: 'The 1847 journey',
            books: [DC],
            layers: ['dc'],
            when: 1847,
            desc: 'An abridged sequence for Brigham Young’s 1847 company.',
            stops: [
              { site: 'winter-quarters', note: 'Across the plains' },
              { site: 'chimney-rock', note: 'Across the Divide' },
              { site: 'south-pass', note: 'Toward Fort Bridger' },
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
          unmapped('Haran', OT, ['ot', 'pgp'], 'Old Testament: Genesis describes Abram departing from Haran. Pearl of Great Price: Abraham’s account also describes departure from Haran. Modern identification not adopted here.'), // P01
          unmapped('Shechem (Sichem)', OT, ['ot', 'pgp'], 'Old Testament: the journey reaches the place called Sichem by the plain of Moreh. Modern archaeological identification pending.'), // P02
          unmapped('Camp between Bethel and Hai', OT, ['ot', 'pgp'], 'Old Testament: Abram pitches his tent between Bethel and Hai and builds an altar. The text gives Bethel to the west and Hai to the east; no pin.'), // P03
          unmapped('Egypt', OT, ['ot', 'pgp'], 'Old Testament: Genesis describes Abram travelling to Egypt during famine. No single city or point is asserted.'), // P04
          unmapped('Horeb', OT, ['ot'], 'Old Testament: Exodus places Moses’ encounter at the burning bush at Horeb. No Sinai candidate is adopted.'), // P05
          unmapped('Ur of the Chaldees', OT, ['ot', 'pgp'], 'Old Testament: Genesis describes Terah’s household leaving Ur for Canaan and settling in Haran. Pearl of Great Price: Abraham describes leaving Ur with family members. No proposed Ur is chosen.'), // P18
          unmapped('Mount of Olives', OT, ['ot', 'nt', 'pgp'], 'Old Testament: Zechariah’s prophecy names the Mount of Olives east of Jerusalem. New Testament: Matthew names the Mount of Olives in the Passion narrative. Pearl of Great Price: Joseph Smith—Matthew places Jesus’ conversation with his disciples on the Mount of Olives.'), // P20
          unmapped('Gethsemane', NT, ['nt'], 'New Testament: Matthew describes Jesus praying here before his arrest. No exact garden identification is adopted.'), // AP10
          unmapped('Golgotha', NT, ['nt'], 'New Testament: Matthew names Golgotha as the place of crucifixion. No modern candidate is selected.'), // AP11
          unmapped('Rome', NT, ['nt'], 'New Testament: Acts ends with Paul receiving visitors under guard in Rome. Map anchor pending.'), // AP32
          unmapped('Patmos', NT, ['nt'], 'New Testament: John locates himself on Patmos when introducing the vision. Map anchor pending.'), // AP33
          unmapped('Waters of Mormon', BOM, ['bom'], 'Book of Mormon: Mosiah describes Alma teaching and baptizing at waters in the place called Mormon. Modern location unknown; not placed on the Earth map.'), // P09
          unmapped('Temple in Bountiful', BOM, ['bom'], 'Book of Mormon: 3 Nephi places a gathered multitude at the temple in Bountiful when Jesus appears. Modern location unknown; distinct from the Bountiful on the Arabian shore in 1 Nephi.'), // P10
          unmapped('Woods near the Smith home', PGP, ['pgp', 'dc'], 'Pearl of Great Price: Joseph Smith’s canonized account describes a prayer in nearby woods and a vision of two personages, reported for spring 1820, near Manchester, New York. No grove point is sourced.'), // P11
          unmapped('Enoch’s city (Zion)', DC, ['dc', 'pgp'], 'Doctrine and Covenants: D&C 38 describes Enoch’s city as taken into God’s presence. Pearl of Great Price: Moses describes Enoch’s community as Zion and says the city was taken up. No terrestrial location.'), // P17
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
          { name: 'First Vision account', books: [DC], layers: ['dc', 'pgp'], when: 1820, desc: 'The D&C introduction reports Joseph Smith’s First Vision in spring 1820 while he was living in Manchester. Joseph Smith’s canonized account in the Pearl of Great Price reports a vision following prayer in the woods.' }, // E08
          { name: 'Abraham’s journey account', books: [PGP], layers: ['pgp'], desc: 'Abraham describes a journey from Ur through Haran and Canaan toward Egypt (Abr. 2:4–21). It gives Abraham’s age on leaving Haran as 62; Genesis 12:4 gives 75. Neither value is corrected or harmonized here.' }, // E12, LDS-Q04
        ],
      },
    ],
  };
})();

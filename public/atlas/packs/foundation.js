/* The Foundation Atlas: data pack for Isaac Asimov's seven Foundation novels, in publication order.
   Schema: docs/atlas/PACK_FORMAT.md in the repo (galactic engine v1).

   Sources (consulted 2026-10-23; full notes in packs/foundation/RESEARCH.md):
   - Wikipedia articles on Foundation (1951), Foundation and Empire (1952), Second Foundation (1953),
     Foundation's Edge (1982), Foundation and Earth (1986), Prelude to Foundation (1988),
     Forward the Foundation (1993), "Foundation universe", "The Mule (Foundation)".
   - The former Wikipedia "List of Foundation universe planets" (IPFS mirror) and the 2006 mirror of
     "Galactic Empire (Asimov)": distances (Anacreon ~8 pc and Smyrno ~50 pc from Terminus, Terminus
     ~10,000 pc from Trantor, Santanni ~9,000 pc from Trantor, Kalgan ~7,000 pc from Terminus, Gaia
     ~10 pc from Sayshell), sectors (Sirius, Arcturus, Sayshell, Normannic, Anacreon Province).
   - asimov.fandom.com (Trantor, Terminus, Seldon Crisis, Kalgan, Siwenna, Anacreon, Korell,
     Neotrantor, Helicon, Solaria, Sayshell, Comporellon, Dahl Sector, Mannix IV, Streeling
     University, Alpha, Battle of Quoriston), cross-checked against Wikipedia.
   - concord.fandom.com (Trantor): Asimov moved Trantor from the exact centre to "as close to the
     centre as habitability allows".
   - Prelude to Foundation character list (2006 Wikipedia mirror); supersummary.com and
     asimovreviews.net plot outlines for the trilogy.
   - Places and landmarks (2026-10-26): supersummary.com scene breakdowns of Foundation part 3 ("The
     Mayors") and part 1 and of Second Foundation; bookrags.com Prelude to Foundation chapter list and
     overview; asimov.fandom.com (Mycogen Sector, Imperial Gardens, Las Zenow, Tamwile Elar, Gleb Andorin,
     Gamol Deen Namarti); Wikipedia plot sections of all seven novels. Landmark positions inside a site
     are schematic; site positions on a globe are estimated (the books draw no maps).
   Asimov's galaxy is the real Milky Way, but the novels give almost no coordinates. Every world
   placed by `map` below is placed by its stated region and is marked est:true ("estimated").
   Real nearby stars (Alpha Centauri, Tau Ceti, Epsilon Eridani, Arcturus) use real RA/Dec.
   All descriptions are paraphrase; nothing is quoted from the books.
   Spoilers are gated by PUBLICATION order (the prequels, books 6 and 7, come last). */
(window.ATLAS_PACKS = window.ATLAS_PACKS || {})["foundation"] = {
  id: "foundation",
  meta: {
    title: "The Foundation Atlas",
    series: "The Foundation Series",
    author: "Isaac Asimov",
    years: "1951–1993",
    tagline: "Psychohistory, the falling Empire &amp; <b>a thousand years of darkness</b>",
    splash: "Twenty-five million worlds under one Emperor, one mathematician who can see their fall, and a plan to shorten the dark that follows.",
    credits: "Fan-made atlas of Isaac Asimov’s <i>Foundation</i> novels. Positions marked estimated are ours.",
    srcnote: "A fan-made atlas. Asimov gave few coordinates, so most positions are estimated from the region each book names. Surfaces are generated interpretations.",
    canvasLabel: "A 3D map of the Milky Way with the worlds of Asimov’s Foundation novels",
    sources: [
      "https://en.wikipedia.org/wiki/Foundation_(Asimov_novel)",
      "https://en.wikipedia.org/wiki/Foundation_and_Empire",
      "https://en.wikipedia.org/wiki/Second_Foundation",
      "https://en.wikipedia.org/wiki/Foundation%27s_Edge",
      "https://en.wikipedia.org/wiki/Foundation_and_Earth",
      "https://en.wikipedia.org/wiki/Prelude_to_Foundation",
      "https://en.wikipedia.org/wiki/Forward_the_Foundation",
      "https://en.wikipedia.org/wiki/Foundation_universe",
      "https://asimov.fandom.com/wiki/Trantor",
      "https://asimov.fandom.com/wiki/Terminus",
      "https://asimov.fandom.com/wiki/Seldon_Crisis",
      "https://asimov.fandom.com/wiki/Battle_of_Quoriston",
      "https://www.supersummary.com/foundation/part-3-summary",
      "https://supersummary.com/foundation/part-1-summary",
      "https://www.supersummary.com/second-foundation/summary/",
      "https://www.bookrags.com/studyguide-prelude-to-foundation/",
      "https://asimov.fandom.com/wiki/Mycogen_Sector",
      "https://asimov.fandom.com/wiki/Imperial_Gardens",
      "https://asimov.fandom.com/wiki/Las_Zenow",
      "https://asimov.fandom.com/wiki/Tamwile_Elar",
      "https://asimov.fandom.com/wiki/Gleb_Andorin",
      "List of Foundation universe planets (former Wikipedia article, IPFS mirror)"
    ]
  },

  /* Cool steel and atomic blue, with an amber accent for the Empire's last light */
  theme: {
    void: "#04060a", deep: "#0a0f18", panel: "rgba(9,13,22,.86)",
    accent: "#5f9cc4", accentHi: "#a8d4f0", accentLo: "#2a4a66",
    chrome: "#dde6ee", ember: "#e09a3a", amber: "#e8b45a",
    text: "#d8e0e8", muted: "#8e9cac", faint: "#5a6878",
    line: "rgba(168,212,240,.17)", lineStrong: "rgba(168,212,240,.48)",
    chromeGrad: "linear-gradient(180deg,#ffffff 0%,#cfe4f2 42%,#6f94b2 70%,#e6f2fa 100%)",
    chromeStops: [[0, "#ffffff"], [.42, "#cfe4f2"], [.7, "#6f94b2"], [1, "#e6f2fa"]],
    panelRgb: "13,19,30", panelRgb2: "6,9,15", insetRgb: "205,228,245", btnRgb: "9,13,22",
    ink: "#060a10", glowRgb: "110,180,230", hiRgb: "95,156,196", swRgb: "168,212,240", pipRgb: "140,200,240",
    title: "#f2f6fa", title2: "#eef3f8", title3: "#eef3f8",
    shadeRgb: "5,8,13", tip1: "#111a28", tip2: "#070b12", voidRgb: "4,6,10", codexRgb: "2,3,6",
    splashGlow: "#0c1a2a", selRing: "#a8d4f0", hoverRing: "#dde6ee",
    /* original sigil: a sun at the rim of a galaxy disc, with a rising curve (psychohistory) */
    sigil: '<ellipse cx="24" cy="26" rx="20" ry="8" fill="none" stroke="url(#cg)" stroke-width="1.2"/>' +
           '<ellipse cx="24" cy="26" rx="11" ry="4.2" fill="none" stroke="url(#cg)" stroke-width=".9" opacity=".7"/>' +
           '<circle cx="24" cy="26" r="2.4" fill="url(#cg)"/>' +
           '<path d="M6 40 C 16 38, 26 30, 42 8" fill="none" stroke="url(#cg)" stroke-width="1.4" stroke-linecap="round"/>' +
           '<circle cx="42" cy="8" r="2.6" fill="#e09a3a"/>'
  },

  books: {
    1: {n: "I", title: "Foundation", y: 1951, c: "#7fb8e8"},
    2: {n: "II", title: "Foundation and Empire", y: 1952, c: "#e8b45a"},
    3: {n: "III", title: "Second Foundation", y: 1953, c: "#b48ae8", ink: "#fff"},
    4: {n: "IV", title: "Foundation’s Edge", y: 1982, c: "#6fd0a8"},
    5: {n: "V", title: "Foundation and Earth", y: 1986, c: "#e8786a", ink: "#fff"},
    6: {n: "VI", title: "Prelude to Foundation", y: 1988, c: "#e8d880"},
    7: {n: "VII", title: "Forward the Foundation", y: 1993, c: "#8aa0f0", ink: "#fff"}
  },
  spoilers: {mode: "cumulative"},

  ui: {
    wrapBooks: true,   /* engine owner: put the seven book buttons on their own row on phones */
    indexTitle: "Worlds of the Foundation",
    homeButton: "Empire",
    homeAction: "Fly over the Empire",
    homeLink: "The Empire",
    homeCrumb: "The Galactic Empire",
    go: {id: "trantor", label: "Go to Trantor"},
    allTitle: "All seven books, with spoilers",
    booksAria: "The book you are reading through, in publication order"
  },

  intro: {
    text: "In the distant future, the Galactic Empire rules twenty-five million worlds from Trantor, a planet covered by a single city. Hari Seldon’s psychohistory predicts its fall and thirty thousand years of barbarism, and his Plan sets two Foundations at opposite ends of the Galaxy to cut that dark age to a thousand years. The book buttons follow publication order, so the two prequels, set before the first book, come last.",
    legend: [
      ["Galaxy", "The real Milky Way. Asimov gave few coordinates, so most worlds are placed by the region the books name and marked estimated"],
      ["Bright points", "Worlds, coloured by their star. The worlds near Sol use the real stars"],
      ["Coloured lines", "The main journeys of each book, one colour per book"],
      ["Red lines", "Hostile campaigns: Anacreon’s attack, Bel Riose, the Mule, the Kalgan war"],
      ["Washes of colour", "The Empire at the core, the Foundation’s growing sphere in the Periphery"],
      ["Book buttons", "Choose the book you are reading, in publication order. Later worlds, events and journeys stay hidden"],
      ["Surfaces", "Every world can be landed on. Surfaces are generated on your graphics card"]
    ]
  },

  groups: [
    {id: "core", name: "Trantor and the inner Empire", chip: {border: "rgba(232,180,90,.55)", color: "#e8c47a"}},
    {id: "periphery", name: "The Periphery: the Foundation’s reach", chip: {border: "rgba(127,184,232,.55)", color: "#a8d4f0"}},
    {id: "provinces", name: "Imperial provinces and the far rim", chip: {border: "rgba(180,138,232,.55)", color: "#cdb2f2"}},
    {id: "sayshell", name: "The Sayshell Sector", chip: {border: "rgba(111,208,168,.55)", color: "#9ae4c4"}},
    {id: "earthward", name: "The Sirius and Arcturus Sectors", chip: {border: "rgba(232,120,106,.55)", color: "#f0a49a"}, flyDist: 9},
    {id: "outer", name: "Other worlds", chip: {border: "rgba(232,216,128,.5)", color: "#ece2a0"}}
  ],

  /* gfx palette: [deep water, shallow water, lowland, lowland 2, highland, peak/snow] */
  worlds: [
  /* ======================= Trantor and the core ======================= */
  {id: "trantor", name: "Trantor", group: "core", books: [1, 2, 3, 4, 6, 7], major: true, first: 1,
   status: "Imperial capital · a world-city", hero: "palace",
   star: {name: "Trantor’s sun", col: "#fff2dc"},
   map: [1.4, 3.8], est: true, /* estimated: near the core, "as close as habitability allows" (concord wiki) */
   blurb: "The capital of the Galactic Empire, close to the centre of the Galaxy: a whole planet sealed under domes of metal and enclosed into one city of some forty billion people, fed by the farm worlds around it. Only the grounds of the Imperial Palace lie open to the sky. Gaal Dornick arrives here for Hari Seldon’s trial, at which Seldon foretells that Trantor will be a ruin within three centuries.",
   short: "The world-city at the heart of the Empire.",
   facts: [["Ruler", "The Emperor; in Seldon’s last years, the Commission of Public Safety"], ["People", "About 40 billion"], ["Surface", "Domed and built over, except the Palace grounds"], ["Placement", "Near the galactic centre (estimated)"]],
   gfx: {type: "city", sea: .18, freq: 1.3, rough: .35, bump: 1.3,
         pal: ["#0a1420", "#1a2e40", "#30363e", "#3c424a", "#4a525c", "#646d78"],
         lights: 1, lightCol: "#ffd9a0", clouds: .08, cloudCol: "#9aa2ac", atmo: "#9ab8e8", atmoK: .8, ice: 90, sw: "#7a8088",
         feat: [{k: "biome", style: "forest", at: [24, 14], r: 4.5, s: 1, c: "#3e5a34"},
                {k: "biome", style: "rock", at: [-82, 0], r: 9, s: .8, c: "#5a5e66"}]},
   eras: {
     2: {status: "Sacked: a ruin among ruins",
         blurb: "Between Riose’s time and the Mule’s, Trantor is sacked. By then its metal skin is cracked and stripped, its billions dead or scattered, and a few farmers live among the wreckage. The Imperial Library alone is left standing, which is why Ebling Mis comes here to look for the Second Foundation.",
         gfx: {type: "terran", lights: .12, rough: .7, pal: ["#0e1418", "#22303a", "#4a4640", "#5a4e42", "#5e5a56", "#8a8680"], clouds: .3,
               feat: [{k: "biome", style: "farm", at: [24, 14], r: 9, s: .8, c: "#5a6a3a"}, {k: "biome", style: "rock", at: [10, -30], r: 12, s: .7, c: "#4a3e34"}]}},
     3: {status: "Ruins, farms, and a hidden secret",
         blurb: "Farmers grow grain among the ruins of the world-city and sell it to the worlds nearby. The end of Second Foundation reveals that the Second Foundation has been here all along, on the old capital at the social opposite end of the Galaxy from Terminus."},
     4: {status: "Hamish farms · seat of the Second Foundation",
         blurb: "Five centuries after Seldon, Trantor is a quiet farm world of Hamish folk. Behind them, in the old university near the ruined Library, the Speakers of the Second Foundation watch over the Plan, until Stor Gendibal finds signs that someone stronger is watching them.",
         gfx: {type: "terran", lights: .06, rough: .5, pal: ["#0e1a22", "#24404a", "#4e5a3c", "#6a7240", "#5e5a50", "#8a8a84"], clouds: .38,
               feat: [{k: "biome", style: "farm", at: [24, 14], r: 22, s: .9, c: "#6e7a3e"}, {k: "biome", style: "farm", at: [-20, 80], r: 18, s: .8, c: "#7a7440"}, {k: "biome", style: "rock", at: [10, -30], r: 10, s: .6, c: "#4a3e34"}]}},
     6: {status: "Imperial capital at its height (12,020 G.E.)",
         blurb: "The prequels return to Trantor at its height, roughly 12,000 years into the Galactic Era: a domed world of more than eight hundred sectors, each with its own customs, from the open Palace grounds to Streeling, Mycogen, Dahl and Wye. Prelude follows Hari Seldon as he flees across it. The reader already knows that within three centuries it will be sacked.",
         gfx: {type: "city", lights: 1, rough: .35, pal: ["#0a1420", "#1a2e40", "#30363e", "#3c424a", "#4a525c", "#646d78"], clouds: .08,
               feat: [{k: "biome", style: "forest", at: [24, 14], r: 4.5, s: 1, c: "#3e5a34"}, {k: "biome", style: "rock", at: [-82, 0], r: 9, s: .8, c: "#5a5e66"}]}},
     7: {status: "Capital in decline (12,028–12,069 G.E.)",
         blurb: "In Forward the Foundation Trantor is still the capital, but the decay Seldon predicted has started: failing services, riots and a coup. Seldon, briefly First Minister, builds psychohistory here and plants the Second Foundation in the Galactic Library before he dies."}
   },
   /* Site positions on Trantor are estimated: the books name sectors but draw no map (Wye is "near the
      south pole"; the Palace grounds are the one open-air area). Landmarks inside each site: layout schematic. */
   sites: [
     {id: "palace", name: "Imperial Palace grounds", lat: 24, lon: 14, books: [2, 6, 7], desc: "The only open land on Trantor: parkland, gardens and the Palace in the Imperial Sector, where the Emperors hold court.",
      scene: {kind: "palace", arch: "imperial", size: "huge", tod: "day", weather: "clear", /* layout schematic */
       landmarks: [
        {id: "palace", name: "The Imperial Palace", kind: "palace", at: [0, .2], h: 1.6, books: [2, 6, 7], desc: "The Emperor’s residence and court, at the heart of the one stretch of Trantor left open to the sky."},
        {id: "office", name: "The First Minister’s office", kind: "hall", at: [.45, .35], books: [6, 7], desc: "Seat of the First Minister, the Emperor’s chief official, who runs the Empire day to day while the Emperor reigns."},
        {id: "gardens", name: "The Imperial Gardens", kind: "garden", at: [-.4, -.3], h: .8, books: [7], desc: "Grass, trees and paths under real sky, kept by a corps of gardeners. Cleon I walks and talks here with his First Ministers, and the gardener Mandell Gruber becomes Seldon’s friend after helping fight off an attacker."}
       ]}},
     {id: "commission", name: "Commission of Public Safety", rel: {to: "palace", dlat: -6, dlon: 9}, books: [1, 7], desc: "The ruling commission that tries Seldon in 12,067 G.E. and sends his project into exile on Terminus.",
      scene: {kind: "capital", arch: "imperial", size: "large", tod: "day", under: true, /* layout schematic */
       landmarks: [
        {id: "court", name: "The trial chamber", kind: "hall", at: [0, 0], h: 1.3, books: [1], desc: "A closed hearing before Imperial officials. Under questioning Seldon explains psychohistory and says plainly that the Empire will fall."},
        {id: "chen", name: "The Commission’s council room", kind: "hall", at: [.45, .35], books: [1], desc: "Where Chief Commissioner Linge Chen and his colleagues see Seldon and Gaal in private, and offer exile to Terminus in place of a verdict that could make Seldon a martyr."}
       ]}},
     {id: "hotel", name: "Gaal’s arrival", rel: {to: "commission", dlat: 6, dlon: -9}, books: [1], /* estimated */ desc: "From the spaceport to his hotel: Gaal Dornick’s first day on Trantor, and his first meeting with Hari Seldon.",
      scene: {kind: "city", arch: "imperial", size: "huge", tod: "day", weather: "clear", /* layout schematic */
       landmarks: [
        {id: "terminal", name: "The spaceport terminal", kind: "pad", at: [.6, -.55], books: [1], desc: "Gaal lands in an immense terminal and takes an air-taxi into the city, with an Imperial agent already on his trail."},
        {id: "tower", name: "The observation tower", kind: "tower", at: [0, .2], h: 2.2, books: [1], desc: "Gaal rides up to look at Trantor and sees metal to every horizon, and no green at all. A man named Jerril falls into talk with him and sneers at “Raven” Seldon."},
        {id: "room", name: "Gaal’s hotel room", kind: "house", at: [-.35, -.15], books: [1], desc: "Seldon is waiting here. He works the numbers in front of Gaal and puts the chance that Trantor will be destroyed at 92.5 percent."}
       ]}},
     {id: "seldonoffice", name: "Seldon’s university", rel: {to: "commission", dlat: -9, dlon: 15}, books: [1], /* estimated: the first book does not name it */ desc: "The university where Seldon’s project works, far from the trial chamber. After the verdict soldiers guard it while the project gets ready to leave.",
      scene: {kind: "town", arch: "imperial", size: "medium", tod: "dusk", under: true, /* layout schematic */
       landmarks: [
        {id: "office", name: "Seldon’s office", kind: "hall", at: [0, 0], books: [1], desc: "After the trial Seldon tells Gaal the rest of the plan: there will be two Foundations, one on Terminus and the other at Star’s End."}
       ]}},
     {id: "library", name: "The Galactic Library", rel: {to: "palace", dlat: 9, dlon: -12}, books: [2, 4, 7], desc: "The Imperial Library, the greatest store of knowledge in the Galaxy, and the one great building left standing after the Sack.",
      scene: {kind: "library", arch: "imperial", size: "large", tod: "dusk", /* layout schematic */
       landmarks: [
        {id: "hall", name: "The Library", kind: "library", at: [0, .15], h: 1.8, books: [2, 4, 7], desc: "The great Imperial Library. When Trantor is sacked it is spared, and its records still reach back across the whole history of the Empire."},
        {id: "mis", name: "Mis’s workroom", kind: "hall", at: [-.4, -.2], books: [2], desc: "Where Ebling Mis buries himself in the old records, working without rest or food, while Bayta, Toran and Magnifico look after him."},
        {id: "zenow", name: "The Chief Librarian’s office", kind: "hall", at: [.45, .3], books: [7], desc: "Las Zenow, the Chief Librarian, gives Seldon the Library’s help with an encyclopedia, and his staff’s search of old astronomical records turns up an empty world at the rim: Terminus."},
        {id: "rooms", name: "The encyclopedia project", kind: "hall", at: [.35, -.35], books: [7], desc: "Seldon’s encyclopedia work in the Library, and the cover under which Wanda Seldon and Stettin Palver quietly gather other mentalics: the start of a second Foundation inside the Library."}
       ]}},
     {id: "speakers", name: "The Speakers’ university", rel: {to: "library", dlat: 6, dlon: 6}, books: [4], desc: "The old university buildings where the Second Foundation meets around the Speakers’ Table, hidden behind the Hamish farm country.",
      scene: {kind: "library", arch: "classical", size: "medium", tod: "dusk", /* layout schematic */
       landmarks: [
        {id: "table", name: "The Speakers’ Table", kind: "hall", at: [0, .1], h: 1.2, books: [4], desc: "The council of the Second Foundation: the First Speaker, Quindor Shandess, and the Speakers. Delora Delarmi moves to impeach Stor Gendibal here, and he answers by showing them Sura Novi’s mind."},
        {id: "radiant", name: "The Prime Radiant", kind: "monolith", at: [-.4, -.15], h: .6, books: [4], desc: "The device that displays the Plan’s equations, which every Speaker studies and amends. Gendibal’s study of it convinces him that someone else is keeping the Plan on course."},
        {id: "grounds", name: "The university grounds", kind: "garden", at: [.35, -.35], books: [4], desc: "Old buildings and walks where the Second Foundationers live apart. The Hamish farmers around them see only a community of scholars, and resent them."}
       ]}},
     {id: "hamish", name: "Hamish farmlands", lat: 18, lon: 40, books: [3, 4], desc: "Farms worked among the ruins of the world-city by people who grow and sell grain.",
      scene: {kind: "farm", arch: "ancient", size: "large", tod: "day", weather: "clear", /* layout schematic */
       landmarks: [
        {id: "fields", name: "Fields among the ruins", kind: "farm", at: [0, 0], books: [3, 4], desc: "Farmers plough between the broken remains of the old world-city and sell their grain to the worlds nearby."},
        {id: "palver", name: "The Palver farm", kind: "farm", at: [-.45, .3], books: [3], desc: "Home of Preem Palver and his wife, cheerful Trantorian farmers. Arkady lives here for months after they bring her from Kalgan."},
        {id: "road", name: "The farm road", kind: "stones", at: [.5, -.3], books: [4], desc: "Outside the university grounds a burly Hamish farmer, Karoll Rufirant, picks a fight with Gendibal, until a young Hamish woman, Sura Novi, steps in."}
       ]}},
     {id: "streeling", name: "Streeling University", lat: 8, lon: -40, books: [6, 7], desc: "The university in the Streeling Sector where Hummin hides Seldon and he meets the historian Dors Venabili.",
      scene: {kind: "town", arch: "classical", size: "large", tod: "day", under: true, /* layout schematic */
       landmarks: [
        {id: "rooms", name: "Seldon’s room", kind: "house", at: [-.3, .2], books: [6], desc: "The campus quarters Hummin arranges for Seldon, with the historian Dors Venabili asked to look after him."},
        {id: "libr", name: "The university library", kind: "library", at: [.1, .45], h: 1.2, books: [6], desc: "Seldon reads history here, hunting for a society small and simple enough to model, and keeps finding how little is known of humanity’s first world."},
        {id: "lift", name: "The lift to Upperside", kind: "tower", at: [.55, -.1], h: 1.6, books: [6], desc: "Meteorologists ride up from here to work on top of the domes. Seldon gets himself included on one of Jenarr Leggen’s trips."},
        {id: "project", name: "The Psychohistory Project", kind: "hall", at: [-.1, -.35], h: 1.2, books: [7], desc: "The research group Seldon builds at Streeling over the decades, with Yugo Amaryl at his side, growing into a large staff of mathematicians working on the Prime Radiant."},
        {id: "office", name: "Seldon’s office", kind: "hall", at: [-.5, -.45], books: [7], desc: "Where the old Seldon goes on working after almost everyone he loved is gone, and where he dies at his desk with the Prime Radiant in his hand."}
       ]}},
     {id: "upperside", name: "Upperside", rel: {to: "streeling", dlat: 8, dlon: 6}, books: [6], desc: "The roof of the domes, under real weather. Seldon goes up with a meteorologist, is left behind in the cold, and is found half-frozen by Dors.",
      scene: {kind: "dome", arch: "modern", size: "huge", tod: "day", weather: "mist", /* layout schematic */
       landmarks: [
        {id: "station", name: "Leggen’s instruments", kind: "mast", at: [.3, .3], books: [6], desc: "Weather instruments on the dome roofs, where the meteorologist Jenarr Leggen and his team study Trantor’s real climate."},
        {id: "domes", name: "The dome roofs", kind: "dome", at: [-.35, -.25], h: 1.4, books: [6], desc: "Cold and empty, under an open sky. Seldon wanders off alone, hides from a passing jet-down, and cannot find his way back."}
       ]}},
     {id: "mycogen", name: "Mycogen", lat: -6, lon: 62, books: [6, 7], desc: "A closed, bald-headed, religious sector that farms yeast and algae. Its people keep a Book about their lost home, Aurora, and a secret in their Sacratorium.",
      scene: {kind: "city", arch: "brutal", size: "medium", tod: "day", under: true, pal: {stone: "#d8d8d0", roof: "#bdbdb4"}, /* layout schematic */
       landmarks: [
        {id: "microfarms", name: "The microfarms", kind: "farm", at: [0, -.4], books: [6], desc: "Vats of yeast and algae below Mycogen, the source of foods prized by Trantor’s rich. On a tour Sister Raindrop Forty-Three shows Seldon round and, against the rules, lends him the Book."},
        {id: "lodging", name: "The guests’ lodging", kind: "house", at: [-.4, .25], books: [6], desc: "Where Seldon and Dors live as tolerated outsiders, in kirtles and with their hair hidden, and where Seldon reads the Book and finds in it Aurora and robots."},
        {id: "gravibus", name: "The gravibus line", kind: "bridge", at: [.45, .2], books: [6], desc: "A gravitic bus runs toward the Sacratorium. On it Seldon falls into talk with an old scholar, Mycelium Seventy-Two."}
       ]}},
     {id: "sacratorium", name: "The Sacratorium", rel: {to: "mycogen", dlat: 4, dlon: 5}, books: [6], desc: "Mycogen’s temple, where Seldon and Dors break in looking for an ancient robot and are caught.",
      scene: {kind: "temple", arch: "ancient", size: "medium", tod: "dusk", under: true, /* layout schematic */
       landmarks: [
        {id: "hall", name: "The Sacratorium", kind: "temple", at: [0, 0], h: 1.5, books: [6], desc: "Mycogen’s temple, a place of mourning for Aurora, the world its people believe was stolen from them. Old screens show Aurora’s landscapes."},
        {id: "aerie", name: "The Aerie", kind: "tower", at: [0, .35], h: 2, books: [6], desc: "The Elders’ sanctum above the temple, closed to everyone else. Seldon climbs up into it."},
        {id: "robot", name: "The robot", kind: "statue", at: [.3, .45], h: .6, books: [6], desc: "Mycogen’s holiest relic: a motionless metal figure in human shape, kept in the Aerie. It is not the living robot Seldon hoped to question."}
       ]}},
     {id: "dahl", name: "Dahl", lat: -24, lon: -96, books: [6, 7], desc: "A poor, proud sector whose heat-sink workers tap the planet’s inner heat for power. Seldon meets the heat-sinker Yugo Amaryl, who becomes his partner in psychohistory.",
      scene: {kind: "city", arch: "industrial", size: "large", tod: "dusk", under: true, /* layout schematic */
       landmarks: [
        {id: "tisalver", name: "The Tisalvers’ apartment", kind: "house", at: [-.35, .25], books: [6], desc: "Seldon and Dors rent rooms here from Jirad Tisalver and his wife, who never like having them. In the end Mrs. Tisalver informs on them."},
        {id: "heatsinks", name: "The heat sinks", kind: "mine", at: [.3, -.3], h: 1.3, books: [6], desc: "Shafts that draw power from the planet’s inner heat, worked by Dahlite heat-sinkers in fierce heat. Seldon meets Yugo Amaryl here, a worker with a gift for mathematics."},
        {id: "tunnels", name: "The sewers under Dahl", kind: "cave", at: [.55, .4], books: [6], desc: "When they have to leave Dahl in a hurry, the boy Raych leads Seldon and Dors away through the sewers below the sector."}
       ]}},
     {id: "billibotton", name: "Billibotton", rel: {to: "dahl", dlat: -6, dlon: -8}, books: [6], desc: "Dahl’s notorious slum, where Seldon and Dors find the street boy Raych and the old woman Mother Rittah, who tells them legends of Earth.",
      scene: {kind: "city", arch: "industrial", size: "medium", tod: "night", under: true, /* layout schematic */
       landmarks: [
        {id: "street", name: "The street where Dors fights", kind: "plaza", at: [0, 0], books: [6], desc: "A crowd of Billibotton toughs led by Marron corners the visitors. Dors beats Marron with two knives and becomes a local legend."},
        {id: "rittah", name: "Mother Rittah’s home", kind: "house", at: [-.45, .3], books: [6], desc: "An old woman tells Seldon and Dors legends of Earth, the true first home, of Aurora, its enemy, and of robots from the oldest stories."},
        {id: "davan", name: "Davan’s hideout", kind: "house", at: [.45, -.3], books: [6], desc: "The agitator Davan, who wants to unite Trantor’s downtrodden against the Empire, asks Seldon for help. Seldon decides psychohistory is the better help."}
       ]}},
     {id: "wye", name: "Wye", lat: -80, lon: 30, books: [6, 7], desc: "A powerful sector near the south pole, ruled by Mayor Mannix IV. His daughter Rashelle kidnaps Seldon to lend her coup legitimacy; Demerzel crushes it.",
      scene: {kind: "capital", arch: "imperial", size: "large", tod: "dusk", under: true, /* layout schematic */
       landmarks: [
        {id: "palace", name: "The Mayor’s palace", kind: "palace", at: [0, .2], h: 1.4, books: [6], desc: "Seat of Wye’s mayors. Rashelle, who rules in place of her ageing father Mannix IV, keeps Seldon here as an honoured prisoner while Wye prepares to seize the throne."},
        {id: "namarti", name: "Namarti’s headquarters", kind: "hall", at: [.45, -.35], books: [7], desc: "A guarded office in Wye from which Namarti runs what is left of Joranum’s movement, planning years of small breakdowns to turn Trantor against its rulers."}
       ]}}
   ]},

  {id: "neotrantor", name: "Neotrantor", aka: ["Delicass"], group: "core", books: [2], first: 2, status: "Last seat of the Empire",
   star: {name: "Neotrantor’s sun", col: "#fff0d4"},
   at: {of: "trantor", spread: 5}, est: true, /* estimated: a small farm world near Trantor */
   blurb: "A small farming world near Trantor, renamed when the Imperial court fled there after the Sack. By the Mule’s time the Empire is some twenty farm worlds ruled from here by Dagobert IX. The Darells pass through on their way to the Library, and the Emperor’s son, who tries to take Bayta, dies suddenly.",
   short: "Where the last Emperors keep a shrunken court.",
   facts: [["Ruler", "Dagobert IX"], ["Realm", "About twenty farm worlds"]],
   gfx: {type: "terran", sea: .45, freq: 1.5, pal: ["#0c2034", "#2a5a78", "#6a7a3a", "#8a8a48", "#6e6650", "#ecece6"], clouds: .4, atmo: "#8ab0ff", lights: .3,
         feat: [{k: "biome", style: "farm", at: [20, 0], r: 25, s: .8, c: "#8a8a4a"}]},
   sites: [{id: "court", name: "The Imperial court", lat: 22, lon: 4, books: [2], desc: "A country palace standing in for the lost splendour of Trantor.",
            scene: {kind: "palace", arch: "classical", size: "small", tod: "day", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "palace", name: "Dagobert IX’s palace", kind: "palace", at: [0, .2], h: 1.1, books: [2], desc: "The last Emperor keeps his shadow court here, ruling a handful of farm worlds as if they were still the Galaxy."},
              {id: "fields", name: "The farmland round the palace", kind: "farm", at: [-.4, -.35], books: [2], desc: "Neotrantor is a farm world, and the palace sits among its fields. The travellers come down here on their way to Trantor."}
             ]}}]},

  /* ======================= The Periphery: Terminus and the Four Kingdoms ======================= */
  {id: "terminus", name: "Terminus", group: "periphery", books: [1, 2, 3, 4, 7], major: true, first: 1,
   status: "Seat of the Foundation", hero: "termcity",
   star: {name: "Terminus’s lone sun", col: "#fff4e6"},
   map: [-27, 21.5], est: true, /* estimated: the Periphery, ~10,000 pc from Trantor; the books give no direction */
   blurb: "A world at the very rim of the Galaxy, the only planet of an isolated sun, with almost no metal and almost all ocean. Seldon’s Encyclopedists are exiled here to compile the Encyclopedia Galactica. It is really the Foundation, the seed of a second Empire. Its night sky has few stars on one side.",
   short: "The Foundation’s ocean world at the edge of the Galaxy.",
   facts: [["Founded", "1 F.E. (12,069 G.E.) by about 100,000 Encyclopedists"], ["Capital", "Terminus City, on the one large island"], ["Resources", "Almost no metals"], ["Nearest world", "Anacreon, about 8 parsecs"]],
   gfx: {type: "terran", sea: .74, freq: 2.4, warp: .7, rough: .3, pal: ["#05213c", "#1c6a8e", "#4a6a3e", "#6a7e4c", "#6a6656", "#e8ece8"],
         clouds: .5, atmo: "#7ab8ff", atmoK: 1.05, lights: .25, ice: 80, sw: "#1c6a8e",
         feat: [{k: "continent", at: [22, -18], r: 10, s: .7}, {k: "continent", at: [27, -27], r: 6, s: .6}, {k: "range", from: [27, -24], to: [18, -12], w: 1.6, s: .14}]},
   eras: {
     2: {status: "Hereditary mayors · falls to the Mule",
         blurb: "Three centuries on, Terminus rules a trading empire through the Merchant Princes, and its mayoralty has become hereditary under the Indburs. The Independent Traders of worlds such as Haven resent it. When the Mule strikes, the Foundation that has never lost a crisis surrenders almost without a fight."},
     3: {status: "Free again · afraid of the Second Foundation",
         blurb: "Some sixty years after its conquest the Foundation is free once more, the Mule’s Union having fallen apart after his death. Having been enslaved once, its scientists now study the mind, and a small circle around Dr. Toran Darell sets out to find out whether the Second Foundation is steering them."},
     4: {status: "Capital of the Foundation Federation",
         blurb: "Five centuries on, Terminus rules a Federation of thousands of worlds and is a rich, crowded planet. Mayor Harla Branno has just weathered a crisis over moving the capital inward when Golan Trevize stands up in Council to say the Plan is too perfect."}
   },
   /* Site positions on Terminus are estimated; landmarks inside each site: layout schematic. */
   sites: [
     {id: "termcity", name: "Terminus City", lat: 22, lon: -18, books: [1, 2, 3, 4], desc: "The capital, on the only large island. Salvor Hardin is its first mayor, and the city outgrows the Encyclopedia to rule the Periphery.",
      scene: {kind: "city", arch: "modern", size: "large", tod: "day", weather: "clear", coast: "s", /* layout schematic */
       landmarks: [
        {id: "encyclopedia", name: "The Encyclopedia Building", kind: "library", at: [0, .25], h: 1.4, books: [1], desc: "Home of the Encyclopedia Foundation and its Board of Trustees under Lewis Pirenne, whose scholars spend fifty years preparing the first volume. Hardin shows Anacreon’s envoy round it."},
        {id: "spaceport", name: "The spaceport", kind: "pad", at: [.6, -.5], books: [3, 4], desc: "Terminus’s link to the rest of the Galaxy. Arkady Darell slips aboard Homir Munn’s ship here to follow him to Kalgan."},
        {id: "actionparty", name: "Action Party headquarters", kind: "hall", at: [-.5, -.2], books: [1], desc: "Where Sef Sermak and the young councilmen of the Action Party plot to replace Hardin, convinced that his religion of science is betraying the Foundation."},
        {id: "board", name: "The Board of Trustees’ meeting", kind: "hall", at: [.3, .55], books: [1], desc: "Where the Encyclopedists’ Board meets. Hardin plays them the record of Lord Dorwin’s visit and shows, by symbolic logic, that the envoy promised nothing at all."},
        {id: "mallow", name: "Mallow’s mansion", kind: "house", at: [-.35, .5], books: [1], desc: "The rich Master Trader’s home. Mallow plans his run for office here with Ankor Jael, and Jorane Sutt comes to bargain with him."}
       ]}},
     {id: "vault", name: "The Time Vault", rel: {to: "termcity", dlat: 3, dlon: 4}, books: [1, 2, 4], desc: "A sealed room Seldon left behind. At each crisis it opens and his recorded image speaks to whoever is there.",
      scene: {kind: "town", arch: "modern", size: "small", tod: "night", under: true, /* layout schematic */
       landmarks: [
        {id: "cubicle", name: "The glass cubicle", kind: "monolith", at: [0, .3], h: 1, books: [1, 2, 4], desc: "A glass enclosure at the front of the Vault. At the appointed time the lights dim and Seldon’s image appears in it, an old man in a wheelchair, to speak to whoever has come."},
        {id: "seats", name: "The Vault’s seats", kind: "hall", at: [0, -.35], h: .7, books: [1, 2, 4], desc: "Rows of seats facing the cubicle, where the Foundation’s leaders gather at each appointed time to hear what Seldon has to say."}
       ]}},
     {id: "cityhall", name: "City Hall", rel: {to: "termcity", dlat: -3, dlon: 3}, books: [1, 2, 4], desc: "Seat of the mayors of Terminus and their Council, from Salvor Hardin on.",
      scene: {kind: "capital", arch: "modern", size: "medium", tod: "day", weather: "clear", /* layout schematic */
       landmarks: [
        {id: "mayor", name: "The Mayor’s office", kind: "hall", at: [0, .3], h: 1.4, books: [1, 4], desc: "Hardin keeps a framed motto on his wall, that violence is the last refuge of the incompetent. Every later mayor governs from here."},
        {id: "council", name: "The Council chamber", kind: "hall", at: [.45, -.15], h: 1.1, books: [1, 4], desc: "Where the Council of Terminus sits. The Action Party’s move to impeach Hardin narrowly fails here, and Mallow’s trial is broadcast from here across Foundation space."}
       ]}},
     {id: "darell", name: "The Darell house", rel: {to: "termcity", dlat: 6, dlon: -6}, books: [3], desc: "Where Dr. Toran Darell’s circle meets to hunt the Second Foundation, and his daughter Arkady listens in.",
      scene: {kind: "town", arch: "modern", size: "small", tod: "night", weather: "clear", /* layout schematic */
       landmarks: [
        {id: "study", name: "Dr. Darell’s study", kind: "house", at: [0, .2], books: [3], desc: "The conspirators meet here. Pelleas Anthor shows them brain recordings of leading men with the same odd flattening, which he calls the Tamper Plateau, and Arkady eavesdrops from her room."},
        {id: "lab", name: "Darell’s laboratory", kind: "factory", at: [.45, -.3], books: [3], desc: "With Dr. Semic, Darell builds a device that fills the air with mental static, unbearable to anyone with mind powers. It unmasks Anthor, and later Darell uses his instruments to test Arkady."}
       ]}}
   ]},

  {id: "anacreon", name: "Anacreon", group: "periphery", books: [1], major: true, first: 1, status: "Kingdom · strongest of the Four Kingdoms", hero: "royal",
   star: {name: "Anacreon A (binary)", col: "#ffe6c0"},
   at: {of: "terminus", spread: 1.2}, est: true, /* about 8 parsecs from Terminus */
   blurb: "Terminus’s nearest neighbour, once a prefecture of the Empire and now the strongest of the Four Kingdoms that break away. In 50 F.E. its king wants Terminus for its harbour and its atomic power. Thirty years on, its Prince Regent Wienis attacks the Foundation with a refitted Imperial cruiser.",
   short: "The kingdom next door, and the first threat.",
   facts: [["Rulers", "Prince Regent Wienis; King Lepold I"], ["Distance", "About 8 parsecs from Terminus"]],
   gfx: {type: "terran", sea: .5, freq: 1.4, pal: ["#0a1e36", "#2a5e86", "#4a6a34", "#6e7e44", "#7a6e58", "#f0f0ec"], clouds: .42, atmo: "#86aaff", lights: .35, ice: 76,
         feat: [{k: "range", from: [30, 10], to: [12, 40], w: 2.5, s: .24}]},
   sites: [{id: "royal", name: "The royal palace", lat: 20, lon: 26, books: [1], desc: "Hardin attends Lepold’s coming of age here while Wienis launches the attack, and the Foundation’s priests turn Anacreon against its regent.",
            scene: {kind: "capital", arch: "classical", size: "large", tod: "night", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "ballroom", name: "The grand ballroom", kind: "hall", at: [0, .25], h: 1.4, books: [1], desc: "Lepold is crowned here at midnight, glowing with the aura the priests give him and seated on a floating throne. When the priests strike, the lights die, his aura goes dark and the throne drops."},
              {id: "office", name: "Wienis’s office", kind: "hall", at: [.45, .1], books: [1], desc: "Wienis tells Hardin the fleet has sailed and calls him a prisoner of war. Here he watches his son read the priests’ ultimatum, orders his guards to shoot Hardin, and when they refuse fires himself, in vain."},
              {id: "hunt", name: "The royal hunting grounds", kind: "grove", at: [-.55, -.45], books: [1], desc: "Young King Lepold comes back from a hunt proud of his forty-sixth nyakbird, and his uncle talks him into war with the Foundation."},
              {id: "square", name: "Outside the palace", kind: "plaza", at: [.1, -.4], books: [1], desc: "When the power fails, Poly Verisof, the Foundation’s ambassador and high priest, leads a crowd outside, and Wienis orders the guards to fire on them."}
             ]}},
           {id: "temple", name: "Temple of the Galactic Spirit", rel: {to: "royal", dlat: -4, dlon: 6}, books: [1], desc: "A temple of the Foundation’s religion of science, whose priests run the atomic plants Anacreon depends on.",
            scene: {kind: "temple", arch: "classical", size: "medium", tod: "dusk", /* layout schematic */
             landmarks: [
              {id: "temple", name: "The temple", kind: "temple", at: [0, .1], h: 1.3, books: [1], desc: "Foundation-trained priests tend the atomic machines here as holy mysteries. On Hardin’s word they go on strike, and Anacreon’s power stops."}
             ]}}]},

  {id: "smyrno", name: "Smyrno", group: "periphery", books: [1], first: 1, status: "One of the Four Kingdoms",
   star: {name: "Smyrno’s sun", col: "#ffd8a0"},
   at: {of: "terminus", spread: 3}, est: true, /* about 50 pc from Terminus (planet list) */
   blurb: "One of the Four Kingdoms carved out of the old Anacreon prefecture, and Hober Mallow’s birthplace. Its people live largely underground.",
   gfx: {type: "desert", sea: .12, dune: 7, pal: ["#1a2a3a", "#3a5a6a", "#9a7a4e", "#b8946a", "#8a7a64", "#ecdcc4"], clouds: .14, atmo: "#f0c890", atmoK: .7, lights: .15}},

  {id: "konom", name: "Konom", group: "periphery", books: [1], first: 1, status: "One of the Four Kingdoms",
   star: {name: "Konom’s sun", col: "#fff0d8"},
   at: {of: "terminus", spread: 3.4}, est: true,
   blurb: "A former Imperial prefecture near Terminus, named among the Four Kingdoms whose fear of Anacreon Salvor Hardin uses in the first crisis.",
   gfx: {type: "forest", sea: .48, pal: ["#0a2234", "#2a5a6a", "#25502a", "#356a30", "#4e6a3e", "#e6ece4"], clouds: .45, atmo: "#80b4ff", lights: .2}},

  {id: "daribow", name: "Daribow", group: "periphery", books: [1], first: 1, status: "One of the Four Kingdoms",
   star: {name: "Daribow’s sun", col: "#ffe2bc"},
   at: {of: "terminus", spread: 3.8}, est: true,
   blurb: "Another of the Four Kingdoms of the old Anacreon prefecture, drawn into Hardin’s balance of power.",
   gfx: {type: "terran", sea: .36, pal: ["#0c2034", "#2c5c7c", "#6a6a3a", "#8a7e48", "#7a6a50", "#eeeae0"], clouds: .3, atmo: "#90b4ff", lights: .2}},

  {id: "askone", name: "Askone", group: "periphery", books: [1], first: 1, status: "Periphery world · ruled by its Elders", hero: "grandmaster",
   star: {name: "Askone’s sun", col: "#ffeccc"},
   map: [-25.9, 21.0], est: true, /* estimated: the Periphery near the Foundation */
   blurb: "A tradition-bound world whose Elders forbid atomic technology. Master Trader Limmar Ponyets frees a captured Foundation agent by selling an ambitious councillor a machine that turns iron into gold, then blackmailing him with a recording of its use.",
   gfx: {type: "terran", sea: .42, freq: 1.6, pal: ["#0c1e30", "#2c5a76", "#5a6a3a", "#7a7e48", "#7a6a54", "#ece8de"], clouds: .38, atmo: "#88aaff", lights: .08},
   sites: [{id: "grandmaster", name: "The Grand Master’s court", lat: 14, lon: -20, books: [1], desc: "Where Ponyets bargains for the condemned agent Eskel Gorov, around 135 F.E.",
            scene: {kind: "town", arch: "ancient", size: "medium", tod: "day", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "court", name: "The Grand Master’s audience hall", kind: "hall", at: [0, .2], h: 1.2, books: [1], desc: "The Grand Master hears Ponyets out. The Elders’ religion forbids the Foundation’s gadgets, but gold might buy the prisoner’s life."},
              {id: "prison", name: "Gorov’s prison", kind: "keep", at: [.45, -.3], books: [1], desc: "Eskel Gorov, a Master Trader and Foundation agent, waits here under sentence of death for selling atomic goods."},
              {id: "pherl", name: "Ponyets’s ship", kind: "ship", at: [-.45, -.2], books: [1], desc: "Ponyets arrives with a crude transmuter of his own making that turns iron into gold. He sells it to the ambitious councillor Pherl, and a recording of Pherl using forbidden technology makes him Ponyets’s partner."}
             ]}}]},

  {id: "korell", name: "Korell", group: "periphery", books: [1], major: true, first: 1, status: "Republic of Korell · in name", hero: "commdor",
   star: {name: "Korell’s sun", col: "#ffe8c4"},
   map: [-25.7, 22.9], est: true, /* estimated: in or beyond the Whassalian Rift */
   blurb: "A so-called republic ruled by a Commdor, almost always of the Argo family. Three Foundation ships vanish near it. Hober Mallow comes to investigate, finds Imperial atomic weapons in the guards’ hands, and sells the Commdor the household gadgets that will make Korell dependent on Foundation trade.",
   short: "Where Hober Mallow wins a war by trade alone.",
   facts: [["Ruler", "Commdor Asper Argo"], ["Crisis", "The third Seldon crisis, c. 155 F.E."]],
   gfx: {type: "barren", sea: .3, freq: 1.5, rough: .6, pal: ["#121a22", "#2a3a44", "#5a5248", "#6a6052", "#7a6e5e", "#d8d0c4"], clouds: .3, cloudCol: "#bcb4a8", atmo: "#c8b8a0", atmoK: .7, lights: .35},
   sites: [{id: "commdor", name: "The Commdor’s palace", lat: 18, lon: 30, books: [1], desc: "Mallow sells Asper Argo trinkets for his wife here, and in Korell’s foundries he notices the Empire’s spaceship-and-sun on the guards’ weapons.",
            scene: {kind: "palace", arch: "brutal", size: "medium", tod: "day", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "palace", name: "The Commdor’s palace", kind: "palace", at: [0, .3], h: 1.2, books: [1], desc: "Seat of Commdor Asper Argo. Years after Mallow’s visit, Argo debates war with the Foundation here, and his wife cannot bear to lose her Foundation gadgets."},
              {id: "garden", name: "The palace garden", kind: "garden", at: [-.4, -.1], books: [1], desc: "Mallow shows the Commdor his wares here, jewelled trinkets for the Commdora among them, and wins her over."},
              {id: "foundry", name: "The steel foundry", kind: "factory", at: [.45, -.35], books: [1], desc: "Mallow demonstrates Foundation tools and sees that the guards carry atomic blasters bearing the Empire’s emblem."}
             ]}},
           {id: "korport", name: "The spaceport", rel: {to: "commdor", dlat: -5, dlon: -6}, books: [1], desc: "A man calling himself a Foundation missionary begs Mallow for sanctuary. Mallow hands him over to the crowd, suspecting a trap; he is right.",
            scene: {kind: "spaceport", arch: "brutal", size: "small", tod: "night", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "farstar", name: "Mallow’s ship, the Far Star", kind: "ship", at: [0, 0], h: 1.1, books: [1], desc: "Mallow’s trading ship waits at a remote field for an audience. A hurt man calling himself the Reverend Jord Parma gets aboard, and Mallow hands him to the Korellians outside."}
             ]}}]},

  {id: "haven", name: "Haven", group: "periphery", books: [2], major: true, first: 2, status: "Trader world", hero: "havencity",
   star: {name: "Haven’s sun", col: "#ffbc8a"},
   map: [-25.2, 19.6], est: true, /* estimated: one of the Independent Trading Worlds of the Periphery */
   blurb: "A barren, rocky Trader world whose people live in cities underground. Toran Darell comes from here. When the Foundation falls to the Mule, Haven holds out longest, and the Darells shelter here until it too gives in.",
   facts: [["Known for", "Independent Traders"], ["People", "Live in underground cities"]],
   gfx: {type: "barren", sea: .05, rough: .7, bump: 1.3, pal: ["#16120e", "#2a221a", "#5a4a3a", "#6a5844", "#7a6a56", "#c8bcaa"], clouds: .1, atmo: "#d0a080", atmoK: .45, lights: .2},
   sites: [{id: "havencity", name: "The underground city", lat: 6, lon: 10, books: [2], desc: "Haven’s cities lie under the rock. Here Toran’s family plots the Traders’ resistance.",
            scene: {kind: "underground", arch: "industrial", size: "medium", tod: "night", /* layout schematic */
             landmarks: [
              {id: "city", name: "The city under the rock", kind: "cave", at: [0, 0], h: 1.2, books: [2], desc: "Haven’s people live in cities carved under its barren surface. The Darells and Ebling Mis shelter here when the Foundation falls, and watch the last Traders lose heart."}
             ]}}]},

  {id: "radole", name: "Radole", group: "periphery", books: [2], first: 2, status: "Trader world · tidally locked",
   star: {name: "Radole’s sun", col: "#ffd0a0"},
   map: [-24.5, 20.7], est: true, /* estimated */
   blurb: "One of the Independent Trading Worlds. It keeps one face to its sun, so only a ribbon of land around the line between day and night is livable.",
   gfx: {type: "desert", sea: .08, dune: 5, pal: ["#1a2a3a", "#3a5a6a", "#9a6a40", "#b88a58", "#5a5a5a", "#f4f6f8"], clouds: .2, atmo: "#ffc890", atmoK: .7, lights: .25,
         feat: [{k: "biome", style: "flame", at: [0, 90], r: 50, s: .6, c: "#a85a2a"}, {k: "biome", style: "snow", at: [0, -90], r: 50, s: .8, c: "#d8e0ea"}, {k: "biome", style: "grass", at: [0, 0], r: 14, s: .6, c: "#6a7a44"}]}},

  {id: "loris", name: "Loris", group: "periphery", books: [2], first: 2, status: "Foundation world",
   star: {name: "Loris’s sun", col: "#fff0d8"},
   at: {of: "terminus", spread: 1.6}, est: true, /* about 20 pc from Terminus (planet list) */
   blurb: "A Foundation world reached by Bel Riose’s campaign.",
   gfx: {type: "terran", sea: .45, freq: 1.7, pal: ["#0c2034", "#2c5c7c", "#4e6a34", "#6e7a40", "#7a6a50", "#eeeae0"], clouds: .4, atmo: "#88aaff", lights: .3,
         feat: [{k: "biome", style: "farm", at: [30, 10], r: 14, s: .7, c: "#6a5a3a"}]}},

  {id: "quoriston", name: "Quoriston", group: "periphery", books: [3], first: 3, status: "Battle site · 377 F.E.",
   star: {name: "Quoriston", col: "#ffd8b0"},
   map: [-25.0, 19.9], est: true, /* estimated; asimov.fandom "Battle of Quoriston" */
   blurb: "A star system on the Foundation’s frontier, where in 377 F.E. the Foundation’s Third Fleet outmanoeuvres Lord Stettin’s main battle fleet and ends the Kalgan war. The war had gone badly until then; after Quoriston, Kalgan’s will to fight collapses.",
   gfx: {type: "barren", sea: 0, rough: .7, pal: ["#1e1a18", "#2e2824", "#5a5048", "#6a5e54", "#7e7266", "#d4ccc2"], clouds: 0, atmoK: .1, lights: 0}},

  {id: "ifni", name: "Ifni", group: "periphery", books: [3], first: 3, status: "Battle site · Kalgan war",
   star: {name: "Ifni", col: "#fff2e0"},
   map: [-24.0, 18.4], est: true, /* estimated; former Wikipedia planet list */
   blurb: "A system where Kalgan wins an early battle against a Foundation squadron, before the war turns.",
   gfx: {type: "ice", sea: 0, pal: ["#4a5a6a", "#6a7a8a", "#9aa4ae", "#b4bcc4", "#d0d6dc", "#f6f8fa"], clouds: .1, atmoK: .3, lights: 0}},

  {id: "gammaandromeda", name: "Gamma Andromeda", group: "provinces", books: [1], first: 1, status: "Imperial world · atomic disaster",
   star: {name: "Gamma Andromeda", col: "#fff0d0"},
   map: [-14, 19], est: true, /* estimated: an Imperial world; the book gives no position */
   blurb: "An Imperial world where, around 50 F.E., a badly maintained atomic power plant fails and kills a great many people. Salvor Hardin takes it as a sign of how far Imperial technology has decayed.",
   gfx: {type: "toxic", sea: .4, pal: ["#1a1c1e", "#2e3234", "#4a4440", "#5a524a", "#6e6458", "#c8c4bc"], clouds: .5, cloudCol: "#a8a49a", atmo: "#b0a890", atmoK: .8, lights: .2,
         feat: [{k: "basin", at: [20, 20], r: 6, s: .5}, {k: "biome", style: "rock", at: [20, 20], r: 5, s: 1, c: "#2a2422"}]},
   hero: "plant",
   sites: [{id: "plant", name: "The failed power plant", lat: 20, lon: 20, books: [1], /* estimated: the book only reports the disaster */ desc: "The atomic plant whose failure kills a great many people, news of which reaches Terminus around 50 F.E.",
            scene: {kind: "ruins", arch: "imperial", size: "medium", tod: "dusk", weather: "ash", /* layout schematic */
             landmarks: [
              {id: "reactor", name: "The wrecked plant", kind: "reactor", at: [0, 0], h: 1.3, books: [1], desc: "Poor maintenance lets the plant fail, with terrible loss of life. To Hardin it is proof that the Empire can no longer run its own machines."}
             ]}}]},

  {id: "siwenna", name: "Siwenna", group: "provinces", books: [1, 2], major: true, first: 1, status: "Old capital of the Normannic Sector", hero: "barr",
   star: {name: "Siwenna’s sun", col: "#fff0d0"},
   map: [-21.5, 17.0], est: true, /* estimated: the Imperial frontier facing the Periphery */
   blurb: "Once the rich capital of a province, ruined by a viceroy’s reprisals that killed most of the patrician Onum Barr’s family. Hober Mallow sees the dying Empire here.",
   eras: {2: {status: "Bel Riose’s base", blurb: "Once the rich capital of a province, ruined by a viceroy’s reprisals. About 195 F.E. the Empire’s last great general, Bel Riose, governs here, forces Ducem Barr to tell him about the Foundation, and marches on it. After his fall Siwenna passes to the Foundation."}},
   short: "A ruined provincial capital on the Empire’s edge.",
   facts: [["Sector", "Normannic"], ["Family", "The Barrs, patricians"]],
   gfx: {type: "terran", sea: .5, freq: 1.4, pal: ["#0b1f36", "#2b6080", "#5a6a3c", "#7a7e4a", "#76705e", "#eeeeea"], clouds: .4, atmo: "#86aaff", lights: .3},
   sites: [{id: "barr", name: "The Barr home", lat: 26, lon: 18, books: [1, 2], desc: "Home of the once-great patrician Barr family, now poor. Onum Barr tells Mallow how the Empire is rotting.",
            scene: {kind: "town", arch: "classical", size: "medium", tod: "dusk", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "home", name: "Onum Barr’s house", kind: "house", at: [-.3, .15], books: [1], desc: "Onum Barr, a ruined old patrician living in a barren corner of the world, tells Mallow what the viceroys did to Siwenna and helps him with a passport."},
              {id: "ducem", name: "Ducem Barr’s house", kind: "house", at: [-.1, .45], books: [2], desc: "Bel Riose comes here to question Onum’s son Ducem about the Foundation. Barr shows him a small force-field device that a Foundation trader left with his father."},
              {id: "plant", name: "The atomic power plant", kind: "reactor", at: [.45, -.2], h: 1.4, books: [1], desc: "Mallow bribes a tech-man with a personal shield to show him round. The men running it keep it going by rote and can no longer repair it; later the tech-man complains that his shield went dead."}
             ]}}]},

  {id: "kalgan", name: "Kalgan", group: "provinces", books: [2, 3], major: true, first: 2, status: "Pleasure world · the Mule’s capital", hero: "mulepalace",
   star: {name: "Kalgan’s sun", col: "#fff4d8"},
   map: [-30.5, -0.5], est: true, /* estimated: "in the Periphery" yet ~7,000 pc from Terminus (planet list) */
   blurb: "A semi-tropical resort world where Imperial nobles came to play, which survives the Empire by staying neutral. Bayta and Toran honeymoon here and meet the clown Magnifico. The Mule takes it without a fight and makes it the capital of his Union of Worlds.",
   short: "The pleasure planet the Mule makes his capital.",
   facts: [["Rulers", "A warlord; then the Mule"], ["Known for", "Resorts and pleasure gardens"]],
   eras: {3: {status: "Capital of the Union of Worlds",
              blurb: "After the Mule’s death his heirs rule a shrinking Union from Kalgan. In 376 F.E. Lord Stettin, egged on by his belief that the Plan no longer binds anyone, attacks the Foundation and loses at Quoriston."}},
   gfx: {type: "archipelago", sea: .6, freq: 1.8, pal: ["#05284a", "#1a8aa8", "#3a7a3a", "#5a8a44", "#6a6a4a", "#f2f2f2"], clouds: .4, atmo: "#7ab8ff", lights: .55, lightCol: "#ffd890", ice: 86},
   sites: [{id: "mulepalace", name: "The Mule’s palace", lat: 10, lon: 40, books: [2, 3], desc: "The seat of Kalgan’s warlords, and then of the Mule.",
            scene: {kind: "capital", arch: "imperial", size: "large", tod: "day", weather: "clear", coast: "s", /* layout schematic */
             landmarks: [
              {id: "palace", name: "The Mule’s palace", kind: "palace", at: [0, .3], h: 1.5, books: [2, 3], desc: "The seat of Kalgan’s warlords. The Mule takes it without a fight and rules his Union of Worlds from here."},
              {id: "records", name: "The palace records", kind: "library", at: [-.45, .1], books: [3], desc: "After the Mule’s death his palace is kept as it was. Homir Munn comes to Kalgan hoping to search the records there for clues to the Second Foundation."},
              {id: "stettin", name: "Lord Stettin’s residence", kind: "hall", at: [.45, -.15], books: [3], desc: "Where Stettin, who has taken the Mule’s title of First Citizen, decides the Plan is nonsense and plans war, and where his mistress Lady Callia takes a liking to Arkady."}
             ]}},
           {id: "kalport", name: "The spaceport", rel: {to: "mulepalace", dlat: 5, dlon: 7}, books: [3], desc: "Kalgan’s link to the stars, and Arkady’s way off the planet.",
            scene: {kind: "spaceport", arch: "modern", size: "medium", tod: "night", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "pad", name: "The departure field", kind: "pad", at: [0, 0], books: [3], desc: "Running from Stettin’s police, Arkady falls in with Preem Palver and his wife, who take her with them to Trantor."}
             ]}},
           {id: "resorts", name: "The pleasure coast", rel: {to: "mulepalace", dlat: -6, dlon: -8}, books: [2], sea: true, desc: "Beaches and carnivals where the Darells find Magnifico running from the Mule’s men.",
            scene: {kind: "port", arch: "modern", size: "medium", tod: "dusk", weather: "clear", coast: "s", /* layout schematic */
             landmarks: [
              {id: "coast", name: "The resort beaches", kind: "plaza", at: [0, -.2], books: [2], desc: "Kalgan’s pleasure grounds, built for Imperial nobles at play. Bayta and Toran honeymoon here and save a terrified clown, Magnifico, from the Mule’s soldiers."}
             ]}}]},

  {id: "rossem", name: "Rossem", group: "provinces", books: [3], first: 3, status: "Cold vassal of Tazenda", hero: "rossemvillage",
   star: {name: "Rossem’s dim sun", col: "#ffb88a"},
   map: [26.5, -21.0], est: true, /* estimated: the far rim opposite Terminus, from the "Star's End" theory */
   blurb: "A frozen, thinly settled world under the oligarchy of Tazenda. Bail Channis leads Han Pritcher here, convinced that the Second Foundation is at Star’s End and that Tazenda is it. Here the Mule springs his own trap, and the First Speaker springs the last one.",
   gfx: {type: "ice", sea: .15, pal: ["#5a6a7e", "#7a8aa0", "#b8c2cc", "#ccd4dc", "#e2e8ee", "#ffffff"], clouds: .35, atmo: "#c0d0f0", atmoK: .6, lights: .08},
   sites: [{id: "rossemvillage", name: "A farming village", lat: 30, lon: -10, books: [3], desc: "Where the Tazendian governor receives Channis and Pritcher, and the Mule confronts Channis.",
            scene: {kind: "village", arch: "rustic", size: "small", tod: "day", weather: "snow", /* layout schematic */
             landmarks: [
              {id: "village", name: "The village", kind: "house", at: [-.3, .1], books: [3], desc: "A poor, cold farming village. Its Elders make it plain that the Tazendian governor is already expecting the visitors."},
              {id: "governor", name: "The governor’s residence", kind: "hall", at: [.35, .35], books: [3], desc: "Tazenda’s governor receives Channis and Pritcher, and seems an entirely ordinary man."},
              {id: "ship", name: "The ship", kind: "ship", at: [0, -.4], h: 1.1, books: [3], desc: "Pritcher arrests Channis here. The Mule arrives, breaks Channis, and is himself defeated when the First Speaker appears."}
             ]}}]},

  {id: "tazenda", name: "Tazenda", group: "provinces", books: [3], first: 3, status: "Oligarchy of 27 worlds · destroyed",
   star: {name: "Tazenda’s sun", col: "#fff0d8"},
   at: {of: "rossem", spread: 3}, est: true,
   blurb: "A quiet oligarchy of twenty-seven worlds, far from everything. Channis argues that its name descends from Star’s End. The Mule has his fleet destroy it, believing it to be the Second Foundation. It was not.",
   gfx: {type: "lava", sea: .25, pal: ["#0a0808", "#1a1210", "#2a1a14", "#3a221a", "#4a2a20", "#7a5a4a"], lava: "#ff7a3a", clouds: .35, cloudCol: "#5a4a40", atmo: "#ff9a5a", atmoK: .9}},

  {id: "santanni", name: "Santanni", group: "outer", books: [7], first: 7, status: "Imperial world · in revolt", hero: "santuni",
   star: {name: "Santanni’s sun", col: "#fff2dc"},
   map: [23, 22], est: true, /* about 9,000 pc from Trantor (planet list) */
   blurb: "A distant world where Raych takes his family. When Santanni rises against the junta, Raych is killed defending its university. The ship carrying his wife and younger daughter out is never heard from again.",
   gfx: {type: "terran", sea: .55, pal: ["#0a1e36", "#2a5e86", "#3e6034", "#6a7e48", "#76705e", "#f2f2ee"], clouds: .45, atmo: "#86aaff", lights: .45},
   sites: [{id: "santuni", name: "University of Santanni", lat: 20, lon: -30, books: [7], desc: "Where Raych dies in the uprising.",
            scene: {kind: "town", arch: "modern", size: "medium", tod: "dusk", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "univ", name: "The university", kind: "hall", at: [0, .1], h: 1.2, books: [7], desc: "Raych is killed here during Santanni’s revolt against the junta."}
             ]}}]},

  {id: "synnax", name: "Synnax", group: "outer", books: [1], first: 1, status: "Provincial world · Gaal Dornick’s home",
   star: {name: "Synnax’s sun", col: "#e4ecff"},
   map: [-6, 36.5], est: true, /* estimated: "at the edges of the Blue Drift" in an outer arm */
   blurb: "A backwater world near the Blue Drift, far out from the centre, where Gaal Dornick grew up. A trip to Trantor is the journey of his life.",
   gfx: {type: "ocean", sea: .9, pal: ["#06203a", "#1a6a8a", "#3a5a3a", "#5a7a4a", "#5a5a4a", "#f4f4f4"], clouds: .5, atmo: "#7ab8ff", lights: .2}},

  {id: "helicon", name: "Helicon", group: "earthward", books: [1, 6, 7], first: 1, status: "Seldon’s home world · Arcturus Sector",
   star: {name: "Helicon’s sun", col: "#fff0d8", ra: 213.915, dec: 19.182, ly: 60}, est: true, /* estimated: towards Arcturus; the books say only "Arcturus sector" */
   blurb: "Hari Seldon’s birthplace, in the Arcturus Sector, where he is born in 11,988 G.E. to a family of modest means, as the Encyclopedia Galactica tells it.",
   eras: {6: {blurb: "A small, middling world in the Arcturus Sector, often pushed around by its neighbours, where Hari Seldon is born in 11,988 G.E. It is known for a martial art, Twisting, which Seldon can still use. Prelude opens with him newly arrived from here for the Decennial Convention."}},
   facts: [["Sector", "Arcturus"], ["Born here", "Hari Seldon, 11,988 G.E."]],
   gfx: {type: "terran", sea: .5, freq: 1.6, pal: ["#0b1f3a", "#2b6286", "#4a6a34", "#6e8a4c", "#7a7262", "#f2f2ee"], clouds: .45, atmo: "#86aaff", lights: .3}},

  /* ======================= The Sayshell Sector ======================= */
  {id: "sayshell", name: "Sayshell", group: "sayshell", books: [4], major: true, first: 4, status: "Capital of the Sayshell Union", hero: "sayshellcity",
   star: {name: "Sayshell’s sun", col: "#fff0d0"},
   map: [-5.5, 31.0], est: true, /* estimated: an independent union surrounded by Federation space */
   blurb: "Capital of the Sayshell Union, eighty-six worlds that never yielded to the Empire, the Mule or the Foundation, though Federation space surrounds them. Its people are mystical and suspicious of Foundationers. Trevize and Pelorat land here and learn of a nearby world, Gaia, that no ship ever conquers.",
   facts: [["Union", "86 worlds"], ["Capital", "Sayshell City"]],
   gfx: {type: "terran", sea: .45, freq: 1.4, pal: ["#0c2034", "#2e5e7a", "#6a7a3a", "#8a8e4a", "#7a6a50", "#eeeeea"], clouds: .4, atmo: "#90b0ff", lights: .5, lightCol: "#ffd0a0"},
   sites: [{id: "sayshellcity", name: "Sayshell City", lat: 16, lon: 22, books: [4], desc: "The capital. Trevize meets his old classmate Munn Li Compor here, and a guide shows them the city.",
            scene: {kind: "city", arch: "eastern", size: "large", tod: "day", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "city", name: "The city centre", kind: "plaza", at: [0, 0], books: [4], desc: "Compor turns up here and tells them the old story that Earth is radioactive, and that nobody can find it."}
             ]}},
           {id: "sayuni", name: "University of Sayshell", rel: {to: "sayshellcity", dlat: 5, dlon: 7}, books: [4], desc: "Pelorat consults the historian Quintesetz, who gives them Gaia’s coordinates and the local legends about it.",
            scene: {kind: "library", arch: "eastern", size: "medium", tod: "day", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "quintesetz", name: "Quintesetz’s office", kind: "hall", at: [0, .1], books: [4], desc: "Professor Quintesetz knows Pelorat’s work. He tells them, reluctantly, where Gaia lies, and how Sayshell has come to fear it."}
             ]}}]},

  {id: "gaia", name: "Gaia", group: "sayshell", books: [4, 5], major: true, first: 4, status: "A living planet", hero: "dom",
   star: {name: "Gaia’s sun", col: "#fff4e4"},
   at: {of: "sayshell", spread: .8}, est: true, /* about 10 pc from Sayshell */
   blurb: "A green, gentle world where every person, animal, plant and rock shares one consciousness while keeping its own. Gaia has quietly protected Sayshell and guarded the Plan; its mentalics are stronger than the Second Foundation’s. Trevize is brought here to choose the Galaxy’s future, and chooses Gaia’s: a living Galaxia.",
   short: "The world that is one mind.",
   facts: [["People", "Every Gaian is part of Gaia"], ["Goal", "Galaxia, a living Galaxy"]],
   gfx: {type: "forest", sea: .48, freq: 1.5, pal: ["#0a2236", "#2a5a6a", "#1e4a22", "#2f6a28", "#4a6a3a", "#e8ece6"], clouds: .45, atmo: "#80c4ff", atmoK: 1.05, lights: .05},
   sites: [{id: "dom", name: "Dom’s house", lat: 12, lon: -14, books: [4, 5], desc: "The old Gaian Dom explains Gaia to Pelorat and Trevize. Bliss is the part of Gaia who meets them.",
            scene: {kind: "village", arch: "organic", size: "small", tod: "day", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "dom", name: "Dom’s house", kind: "house", at: [0, .1], books: [4, 5], desc: "A plain house in gentle country. Old Dom, whose full name runs to many syllables, explains that he, the house and the land around it are all Gaia."},
              {id: "country", name: "The Gaian countryside", kind: "grove", at: [-.45, -.3], books: [4], desc: "Mild weather and quiet: everything here shares one mind. Pelorat is delighted; Trevize is wary."}
             ]}},
           {id: "gaiaport", name: "The landing field", rel: {to: "dom", dlat: -4, dlon: -6}, books: [4, 5], desc: "Where Gaia brings the Far Star down.",
            scene: {kind: "spaceport", arch: "organic", size: "small", tod: "day", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "field", name: "The landing field", kind: "pad", at: [0, 0], books: [4, 5], desc: "Gaia takes control of the Far Star in space and brings it down here, its controls no longer answering Trevize."}
             ]}}]},

  /* ======================= Earth's region: the Sirius Sector and the Spacer worlds ======================= */
  {id: "comporellon", name: "Comporellon", aka: ["Baleyworld"], group: "earthward", books: [5], major: true, first: 5, status: "Associated power of the Foundation", hero: "compcity",
   star: {name: "Comporellon’s sun (possibly Epsilon Eridani)", col: "#ffd8a8", ra: 53.233, dec: -9.458, ly: 10.5}, est: true, /* identification with Epsilon Eridani is a fan inference; marked estimated */
   blurb: "A cold, proud world that claims to be the oldest settled planet in the Galaxy, and resents its ties to the Foundation. Officials try to seize the Far Star. Trevize talks his way out with the help of Minister Mitza Lizalor, and the historian Vasil Deniador gives them coordinates for three of the forbidden worlds.",
   facts: [["Climate", "Very cold"], ["Old name", "Baleyworld (Robot novels)"]],
   gfx: {type: "ice", sea: .25, pal: ["#3a4e66", "#5a7088", "#a8b4c0", "#bcc6d0", "#d6dce4", "#ffffff"], clouds: .45, atmo: "#b8cce8", atmoK: .8, lights: .55, ice: 50},
   sites: [{id: "compcity", name: "Comporellon City", lat: 24, lon: -20, books: [5], desc: "The capital, much of it underground against the cold. Trevize and Pelorat are held here.",
            scene: {kind: "city", arch: "brutal", size: "large", tod: "day", weather: "snow", /* layout schematic */
             landmarks: [
              {id: "ministry", name: "The Minister’s office", kind: "hall", at: [0, .25], h: 1.2, books: [5], desc: "Mitza Lizalor, the minister in charge of transport, means to keep the Far Star for Comporellon. Trevize talks, and charms, his way to the ship’s release."},
              {id: "port", name: "The spaceport", kind: "pad", at: [.5, -.4], books: [5], desc: "The Far Star is held here while Comporellon’s officials look for a way to take the advanced ship for themselves."}
             ]}},
           {id: "deniador", name: "The university", rel: {to: "compcity", dlat: 4, dlon: 6}, books: [5], desc: "Vasil Deniador, a sceptical historian, tells them what Comporellon remembers of Earth and the first settlers.",
            scene: {kind: "library", arch: "brutal", size: "small", tod: "day", weather: "snow", /* layout schematic */
             landmarks: [
              {id: "office", name: "Deniador’s office", kind: "hall", at: [0, 0], books: [5], desc: "Deniador shares the old tales of Earth and the Spacers, and the positions of three Spacer worlds said to lie near Earth: Aurora, Solaria and Melpomenia."}
             ]}}]},

  {id: "aurora", name: "Aurora", group: "earthward", books: [5, 6], first: 5, status: "Spacer world · abandoned", hero: "ruins",
   star: {name: "Tau Ceti", col: "#fff0d0", ra: 26.017, dec: -15.94, ly: 11.9}, /* Tau Ceti, per the Robot novels */
   blurb: "The first and greatest of the Spacer worlds, now empty for twenty thousand years. Its buildings have fallen, and the descendants of its pet dogs run in packs; they nearly kill Trevize.",
   eras: {6: {blurb: "The first and greatest of the Spacer worlds. In Foundation and Earth it is empty, its buildings fallen and its dogs gone wild. Prelude reveals that the people of Mycogen, on Trantor, remember it as the home of their ancestors."}},
   facts: [["People", "None left"]],
   gfx: {type: "forest", sea: .45, pal: ["#0a1e30", "#2a4a6a", "#2a3a2a", "#4a5a3a", "#5a5a50", "#e0dcd4"], clouds: .45, atmo: "#a0b8e0", atmoK: .9, lights: 0},
   sites: [{id: "ruins", name: "Ruined city", lat: 20, lon: 30, books: [5], desc: "Overgrown buildings where feral dogs attack the travellers, until Bliss turns them with fear.",
            scene: {kind: "ruins", arch: "ancient", size: "medium", tod: "day", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "buildings", name: "The fallen buildings", kind: "ruin", at: [0, .2], h: 1.2, books: [5], desc: "Twenty thousand years of neglect have brought the Spacer city down. The travellers search the ruins and find nothing that tells them where Earth is."},
              {id: "dogs", name: "Where the dogs attack", kind: "grove", at: [-.45, -.3], books: [5], desc: "A pack of wild dogs, descended from the Aurorans’ pets, closes in. Trevize’s weapon only enrages them, until Bliss magnifies their fear and they flee."}
             ]}}]},

  {id: "solaria", name: "Solaria", group: "earthward", books: [5], first: 5, status: "Spacer world · a few estates", hero: "bander",
   star: {name: "Solaria’s sun", col: "#fff4e0"},
   dir: {l: 150, b: 18}, ly: 60, est: true, /* estimated: the books give no position; the Spacer worlds lie around Earth */
   blurb: "The last Spacer world, still inhabited by about twelve hundred Solarians, each alone on a vast estate run by robots. They have made themselves hermaphrodite and draw power with brain lobes of their own. Sarton Bander means to kill the visitors; Bliss strikes first, and the travellers take Bander’s child Fallom with them.",
   facts: [["People", "About 1,200, one to an estate"], ["Robots", "Thousands to each person"]],
   gfx: {type: "terran", sea: .4, freq: 1.4, pal: ["#0a1e36", "#2a5a7a", "#5a7a3a", "#7a8a48", "#6e6a58", "#eeeeea"], clouds: .3, atmo: "#86aaff", lights: .1,
         feat: [{k: "biome", style: "farm", at: [20, 40], r: 20, s: .7, c: "#7a8a44"}]},
   sites: [{id: "bander", name: "Bander’s estate", lat: 22, lon: 40, books: [5], desc: "A mansion among endless orchards and fields, kept by robots. Here Bander dies and Fallom is saved.",
            scene: {kind: "farm", arch: "modern", size: "large", tod: "day", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "landing", name: "Where the Far Star lands", kind: "pad", at: [.5, -.45], books: [5], desc: "Robots meet the ship. Sarton Bander, the estate’s one human, receives the visitors, curious about people who come in the flesh."},
              {id: "grounds", name: "The estate grounds", kind: "farm", at: [-.4, -.2], books: [5], desc: "Fields and orchards worked entirely by robots, powered through Bander’s own transducer lobes. Bander shows them round with pride."},
              {id: "mansion", name: "Bander’s mansion", kind: "house", at: [0, .25], h: 1.2, books: [5], desc: "Most of it lies underground. Bander turns on the visitors to kill them; Bliss turns the energy back and Bander dies."},
              {id: "nursery", name: "Fallom’s rooms", kind: "house", at: [.35, .45], books: [5], desc: "Bander’s young child Fallom lives here with a robot nurse. With Bander dead, the Solarians would kill the child as surplus, so the travellers take Fallom with them."}
             ]}}]},

  {id: "melpomenia", name: "Melpomenia", group: "earthward", books: [5], first: 5, status: "Spacer world · airless", hero: "plaque",
   star: {name: "Melpomenia’s sun", col: "#ffe8c8"},
   dir: {l: 300, b: -24}, ly: 55, est: true, /* estimated */
   blurb: "A Spacer world whose air has nearly all gone. The travellers search it in spacesuits and find a library with a plaque listing the fifty Spacer worlds and their positions, and a hungry moss that tries to feed on their suits.",
   gfx: {type: "barren", sea: 0, rough: .6, pal: ["#2a2c30", "#3a3c40", "#6a6a6a", "#7e7c78", "#9a968e", "#e4e2de"], clouds: 0, atmoK: .15, lights: 0,
         feat: [{k: "biome", style: "grass", at: [14, -30], r: 8, s: .5, c: "#4a5a3a"}]},
   sites: [{id: "plaque", name: "The library plaque", lat: 14, lon: -30, books: [5], desc: "A wall plaque of the fifty Spacer worlds. Plotted, they form a sphere, and Earth should lie near its centre.",
            scene: {kind: "ruins", arch: "ancient", size: "small", tod: "day", weather: "clear", /* layout schematic */
             landmarks: [
              {id: "library", name: "The library", kind: "library", at: [0, .2], h: 1.2, books: [5], desc: "Trevize and Pelorat walk in spacesuits into an airless library and find a plaque giving the names and positions of all fifty Spacer worlds."},
              {id: "moss", name: "The moss", kind: "grove", at: [-.45, -.3], books: [5], desc: "A hungry moss, all that lives here, gathers round the seals of their suits to feed on the traces of breath leaking out. They burn it off before leaving."}
             ]}}]},

  {id: "alpha", name: "Alpha", aka: ["New Earth"], group: "earthward", books: [5], major: true, first: 5, status: "Ocean world · one island", hero: "newearth",
   star: {name: "Alpha Centauri A", col: "#fff3dc", ra: 219.902, dec: -60.834, ly: 4.37},
   blurb: "A water world circling the larger star of Alpha Centauri, terraformed long ago, with a single island where a small, friendly people fish, farm and make music. They welcome the travellers and quietly plan to kill them with an infection. Hiroko, who has taken to Trevize, warns them in time.",
   short: "The island of New Earth on an ocean world.",
   facts: [["Land", "One large island"]],
   gfx: {type: "ocean", sea: .93, pal: ["#05284a", "#1a8aa8", "#3a7a3a", "#5a8a44", "#6a6a4a", "#f2f2f2"], clouds: .4, atmo: "#7ab8ff", lights: .05, ice: 86,
         feat: [{k: "continent", at: [8, 20], r: 5, s: .45}]},
   sites: [{id: "newearth", name: "New Earth", lat: 8, lon: 20, books: [5], desc: "The one inhabited island. Fallom plays the islanders’ music, and Hiroko warns the visitors to run.",
            scene: {kind: "village", arch: "rustic", size: "small", tod: "dusk", weather: "clear", coast: "s", /* layout schematic */
             landmarks: [
              {id: "beach", name: "The beach", kind: "plaza", at: [0, -.35], books: [5], desc: "The islanders welcome the visitors warmly. Hiroko, a young woman who fishes and farms, takes to Trevize."},
              {id: "music", name: "The music gathering", kind: "hall", at: [-.4, .15], books: [5], desc: "Fallom picks up an islander’s flute and plays it by transducing power rather than breath. The islanders are enchanted."},
              {id: "hiroko", name: "Hiroko’s warning", kind: "house", at: [.4, .3], books: [5], desc: "At night Hiroko tells Trevize the truth: the visitors carry an infection the islanders are immune to, to be set off when the fishing fleet returns. They leave before dawn."}
             ]}}]},

  {id: "earth", name: "Earth", group: "earthward", books: [4, 5, 6], major: true, first: 4, status: "Humanity’s lost home · radioactive", hero: "dead",
   star: {name: "Sol", col: "#fff4e0"},
   /* no placement: sits at Sol */
   blurb: "The world where humanity began, so forgotten that most scholars doubt it ever existed and every reference to it has vanished from the Galactic Library. Pelorat has spent his life on the origin question, and the legends say it is dangerous, even deadly, to look for it.",
   eras: {5: {status: "Found · radioactive and lifeless", blurb: "The world where humanity began. When the Far Star finally reaches the Sun, Earth is radioactive and dead, and the answer to Trevize’s question lies on its large moon.", gfx: {pal: ["#101418", "#1e2628", "#4a4038", "#5a4a3c", "#6e6050", "#b8b0a4"], clouds: .22, cloudCol: "#a8a49a", atmo: "#b0a890", atmoK: .7}},
          6: {blurb: "The world where humanity began, radioactive and dead by the time Trevize finds it. In Prelude, twenty thousand years after the Spacers, the people of Billibotton and Mycogen still keep legends of it."}},
   short: "The forgotten origin world.",
   facts: [["Also called", "The origin world, in the legends"]],
   gfx: {type: "terran", base: "earth", sea: .5, rough: .35, pal: ["#0e1a2a", "#24384a", "#4a5048", "#5a5a4c", "#6e6656", "#d8d4cc"], clouds: .7, cloudCol: "#c8c8c4", atmo: "#a8b4c8", atmoK: .8, lights: 0},
   sites: [{id: "dead", name: "The dead surface", lat: 30, lon: 35, books: [5], desc: "Seen only from orbit: the glow of radioactivity and no sign of life.",
            scene: {kind: "desert", arch: "ancient", size: "medium", tod: "dusk", weather: "ash", pal: {ground: "#5a4e42", stone: "#6e6050"}, /* layout schematic: the travellers never land */
             landmarks: [
              {id: "crust", name: "The radioactive crust", kind: "crater", at: [0, 0], books: [5], desc: "What the Far Star’s instruments find below: a world too radioactive for anything to live on. Nobody lands. Trevize’s attention turns to the giant Moon when Fallom, trying to steer for home, sets him thinking."}
             ]}}]},

  {id: "moon", name: "The Moon", group: "earthward", books: [5], first: 5, status: "Earth’s satellite · Daneel’s refuge", hero: "base",
   star: {name: "Sol", col: "#fff4e0"},
   at: {of: "earth", spread: .25},
   blurb: "Earth’s unusually large moon. Beneath its surface the travellers find the robot R. Daneel Olivaw, who has guided humanity for twenty thousand years and now needs Fallom’s mind to go on.",
   gfx: {type: "barren", sea: 0, rough: .7, bump: 1.4, pal: ["#2a2a2c", "#3a3a3c", "#7a7874", "#8a8884", "#a4a29c", "#e4e2dc"], clouds: 0, atmoK: 0, lights: 0},
   sites: [{id: "base", name: "Daneel’s refuge", lat: 10, lon: -20, books: [5], desc: "A hidden hangar and halls under the lunar crust, where the last answers of the series are given.",
            scene: {kind: "underground", arch: "modern", size: "small", tod: "night", under: true, /* layout schematic */
             landmarks: [
              {id: "hangar", name: "The hidden hangar", kind: "gate", at: [.4, -.4], books: [5], desc: "An entrance opens in the Moon’s surface and the Far Star is drawn inside."},
              {id: "chamber", name: "Daneel’s chamber", kind: "hall", at: [-.2, .25], h: 1.2, books: [5], desc: "R. Daneel Olivaw tells them his story: twenty thousand years guarding humanity, Gaia and psychohistory among his works. His brain is failing, and he wants to merge it with Fallom’s."}
             ]}}]}
  ],

  events: [
  /* ---------- I · Foundation ---------- */
  {id: "f1a", book: 1, world: "synnax", title: "Gaal Dornick sets out", text: "In 12,067 G.E. a young mathematician leaves his provincial world for Trantor, to join Hari Seldon’s project."},
  {id: "f1a2", book: 1, world: "trantor", site: "hotel", lm: "tower", title: "The world-city", text: "Gaal lands on Trantor and rides up an observation tower to see it: metal to every horizon. A stranger who chats with him there is an Imperial agent."},
  {id: "f1a3", book: 1, world: "trantor", site: "hotel", lm: "room", title: "Seldon’s numbers", text: "Seldon is waiting in Gaal’s hotel room. He shows him psychohistory at work on Trantor’s future, and the odds of its destruction are high. Soon afterwards Gaal is arrested."},
  {id: "f1b", book: 1, world: "trantor", site: "commission", lm: "court", title: "Seldon on trial", text: "The Commission of Public Safety tries Seldon. He predicts Trantor’s ruin within three centuries and thirty thousand years of chaos, which his plan could cut to one thousand. He is exiled with his Encyclopedists, exactly as he intended."},
  {id: "f1b2", book: 1, world: "trantor", site: "commission", lm: "chen", title: "Exile, not martyrdom", text: "Linge Chen sees Seldon and Gaal in private. Rather than make a martyr, the Commission will send the Encyclopedia project to the remote world of Terminus, and Seldon accepts."},
  {id: "f1b3", book: 1, world: "trantor", site: "seldonoffice", lm: "office", title: "Two Foundations", text: "In his office Seldon tells Gaal that the exile was what he wanted, and that a second Foundation will be set up at the other end of the Galaxy, at Star’s End."},
  {id: "f1c", book: 1, world: "terminus", site: "termcity", lm: "encyclopedia", title: "The Encyclopedia Foundation", text: "About 100,000 scientists settle the empty world of Terminus to write the Encyclopedia Galactica. Seldon dies on Trantor in 1 F.E."},
  {id: "f1c2", book: 1, world: "terminus", site: "termcity", lm: "encyclopedia", title: "Anacreon’s envoy", text: "In 50 F.E. Hardin shows Anacreon’s envoy, Anselm haut Rodric, round the Encyclopedia Building with every courtesy. Afterwards Rodric demands a military base on Terminus."},
  {id: "f1d0", book: 1, world: "gammaandromeda", site: "plant", lm: "reactor", fx: "blast", title: "A plant fails", text: "News comes of an atomic disaster at Gamma Andromeda: the Empire can no longer keep its own machines running."},
  {id: "f1d", book: 1, world: "terminus", site: "termcity", lm: "board", title: "Lord Dorwin’s empty promises", text: "In 50 F.E. Anacreon demands bases on Terminus. An Imperial envoy visits; Salvor Hardin’s analysis shows his reassurances contain nothing at all."},
  {id: "f1e", book: 1, world: "terminus", site: "vault", lm: "cubicle", title: "The first Seldon crisis", text: "Hardin and Yohan Lee take power from the Encyclopedists. The Vault opens and Seldon reveals the Encyclopedia was a cover. Hardin sets the other kingdoms against Anacreon and Terminus stays free."},
  {id: "f1e2", book: 1, world: "terminus", site: "cityhall", lm: "council", title: "The Action Party", text: "Thirty years on, Councilman Sef Sermak’s Action Party wants Terminus to arm and strike first, and calls Hardin a traitor for propping up the kingdoms. Its move to impeach him fails by a narrow vote."},
  {id: "f1e3", book: 1, world: "anacreon", site: "royal", lm: "hunt", title: "A regent’s war", text: "Young King Lepold comes back from the hunt, and his uncle, Prince Regent Wienis, talks him into war as soon as an old Imperial cruiser, refitted by the Foundation, is ready."},
  {id: "f1f0", book: 1, world: "anacreon", site: "royal", lm: "ballroom", fx: "crowd", title: "The lights go out", text: "At midnight on Lepold’s coronation the priests strike. The ballroom goes dark, the king loses his glow, and outside Poly Verisof’s crowd faces Wienis’s guards."},
  {id: "f1f1", book: 1, world: "anacreon", title: "Mutiny on the Wienis", text: "Aboard the cruiser, named for the regent, the high priest Theo Aporat declares the ship cursed. When its systems die the crew seizes the regent’s son, Admiral Prince Lefkin, and makes him read the priests’ ultimatum over the hyperwave."},
  {id: "f1f", book: 1, world: "anacreon", site: "royal", lm: "office", title: "The second Seldon crisis", text: "In 80 F.E. Prince Regent Wienis attacks with a refitted Imperial cruiser while Hardin visits. Its crew and Anacreon’s people obey the Foundation’s priests instead, and Wienis dies by his own blaster."},
  {id: "f1f2", book: 1, world: "terminus", site: "vault", lm: "seats", title: "Seldon’s second visit", text: "On the Foundation’s eightieth anniversary a packed Vault hears Seldon praise the outcome, and warn against turning the Foundation’s spiritual power into a weapon."},
  {id: "f1g0", book: 1, world: "askone", site: "grandmaster", lm: "prison", title: "A trader condemned", text: "Around 135 F.E. Askone’s Elders sentence Master Trader Eskel Gorov to death for selling atomic goods. Limmar Ponyets is sent to get him out."},
  {id: "f1g", book: 1, world: "askone", site: "grandmaster", lm: "pherl", title: "The transmuter", text: "Around 135 F.E. the trader Limmar Ponyets frees a Foundation agent by trading a gold-making machine and blackmailing the man who used it."},
  {id: "f1g2", book: 1, world: "askone", site: "grandmaster", lm: "court", title: "Gorov released", text: "With Councillor Pherl now on his side, Ponyets gets Gorov released and a cargo of tin besides. Askone’s ban on Foundation technology begins to give way."},
  {id: "f1h", book: 1, world: "korell", site: "korport", lm: "farstar", title: "Mallow reaches Korell", text: "Around 155 F.E. Hober Mallow comes to find three lost ships. He refuses sanctuary to a false missionary, and sells to the Commdor."},
  {id: "f1h2", book: 1, world: "korell", site: "commdor", lm: "garden", title: "Selling to the Commdor", text: "Mallow wins Commdor Asper Argo over with Foundation gadgets, and his wife with jewelled trinkets."},
  {id: "f1h3", book: 1, world: "korell", site: "commdor", lm: "foundry", title: "Imperial blasters", text: "At a foundry Mallow notices that Korell’s guards carry atomic blasters marked with the Empire’s emblem. Someone is arming Korell."},
  {id: "f1i", book: 1, world: "siwenna", site: "barr", lm: "home", title: "The dying Empire", text: "Mallow travels on to Siwenna and hears from Onum Barr how the Empire’s provinces are decaying, and that it is arming Korell."},
  {id: "f1i2", book: 1, world: "siwenna", site: "barr", lm: "plant", title: "A plant nobody understands", text: "Mallow bribes his way into Siwenna’s atomic power plant and finds its tech-men keep it going without understanding it. The Empire is losing what it knows."},
  {id: "f1j", book: 1, world: "terminus", site: "cityhall", lm: "council", title: "Mallow’s trial", text: "Tried for murder over the missionary, Mallow proves he was a Korellian agent, and is elected mayor."},
  {id: "f1k", book: 1, world: "korell", site: "commdor", lm: "palace", title: "The third Seldon crisis", text: "Korell declares war, but its industry runs on Foundation goods. When trade stops, Korell gives in without a battle: trade, not religion, now carries the Plan."},

  /* ---------- II · Foundation and Empire ---------- */
  {id: "f2a", book: 2, world: "siwenna", site: "barr", lm: "ducem", title: "Bel Riose and Ducem Barr", text: "Around 195 F.E. the young Imperial general Bel Riose seeks out Ducem Barr to learn about the magicians of the Periphery, then marches on the Foundation."},
  {id: "f2b", book: 2, world: "loris", title: "The fourth Seldon crisis", text: "Riose’s fleets press into Foundation space as far as Loris. The trader Lathan Devers lets himself be captured to get close to him."},
  {id: "f2c", book: 2, world: "trantor", site: "palace", title: "Bribery on Trantor", text: "Devers and Barr escape to Trantor to turn the Emperor against Riose, and barely escape the police."},
  {id: "f2d", book: 2, world: "trantor", site: "palace", lm: "palace", title: "Riose recalled", text: "Cleon II fears any successful general, and has Riose and his own secretary recalled and executed. A strong Empire cannot allow a strong subject: the crisis solves itself."},
  {id: "f2d2", book: 2, world: "siwenna", site: "barr", title: "Siwenna rises", text: "With Riose gone, Siwenna rebels and joins the Foundation. At the celebration Barr explains why the Empire could never have won."},
  {id: "f2e", book: 2, world: "terminus", site: "termcity", title: "Bayta and Toran", text: "Around 310 F.E. the Foundation is run by hereditary mayors and the Traders chafe. Bayta, a Foundationer, marries Toran Darell of Haven."},
  {id: "f2f", book: 2, world: "kalgan", site: "resorts", lm: "coast", title: "Magnifico", text: "Honeymooning on Kalgan, the Darells rescue a frightened clown who says he fled the Mule, the new warlord who took Kalgan without a fight. Captain Han Pritcher, a Foundation agent, joins them."},
  {id: "f2g", book: 2, world: "terminus", site: "vault", lm: "cubicle", title: "The Vault opens", text: "Seldon’s image speaks of a civil war with the Traders, a crisis the Mule has made irrelevant. Seldon did not foresee him, and the Foundation falls without a fight."},
  {id: "f2h", book: 2, world: "haven", site: "havencity", lm: "city", title: "Haven holds out", text: "The Darells and the psychologist Ebling Mis flee to Haven, the last Trader world resisting. Its will collapses as the others did."},
  {id: "f2i", book: 2, world: "neotrantor", site: "court", lm: "palace", title: "The last Emperor", text: "They pass through Neotrantor, where Dagobert IX keeps a shadow court. The Emperor’s son tries to take Bayta, and is found dead."},
  {id: "f2j", book: 2, world: "trantor", site: "library", lm: "mis", title: "Ebling Mis and the Library", text: "In the ruins of the sacked capital, Mis works feverishly to find the Second Foundation, as if something drives him."},
  {id: "f2k", book: 2, world: "trantor", site: "library", lm: "mis", title: "Bayta fires", text: "As Mis is about to say where the Second Foundation is, Bayta shoots him. She has realised Magnifico is the Mule, who has been steering everyone toward the Second Foundation."},

  /* ---------- III · Second Foundation ---------- */
  {id: "f3a", book: 3, world: "kalgan", site: "mulepalace", lm: "palace", title: "The Mule’s search", text: "Five years into his reign the Mule sends Han Pritcher, his convert, and Bail Channis, an unconverted man, to look for the Second Foundation."},
  {id: "f3b", book: 3, world: "rossem", site: "rossemvillage", lm: "village", title: "Star’s End", text: "Channis leads them to Rossem, under Tazenda, claiming that Tazenda is the Star’s End of Seldon’s riddle."},
  {id: "f3b2", book: 3, world: "rossem", site: "rossemvillage", lm: "governor", title: "Expected", text: "The Tazendian governor receives them as if he knew they were coming. Pritcher begins to wonder why Channis finds his way so easily."},
  {id: "f3c", book: 3, world: "tazenda", title: "Tazenda destroyed", text: "The Mule reveals he followed them and has destroyed Tazenda. He breaks Channis, who confesses he is a Second Foundationer."},
  {id: "f3d", book: 3, world: "rossem", site: "rossemvillage", lm: "ship", title: "The First Speaker", text: "The First Speaker appears: it was a trap, and Channis’s memories were false. The Mule’s mind is changed, and he returns to Kalgan to rule in peace until his death."},
  {id: "f3e", book: 3, world: "terminus", site: "darell", lm: "study", title: "The conspirators", text: "Around 376 F.E. Dr. Toran Darell and his friends fear the Second Foundation is steering them. His fourteen-year-old daughter Arkady listens in."},
  {id: "f3e2", book: 3, world: "terminus", site: "termcity", lm: "spaceport", title: "A stowaway", text: "The circle sends the librarian Homir Munn to Kalgan to look for clues in the Mule’s palace. Arkady hides aboard his ship."},
  {id: "f3f", book: 3, world: "kalgan", site: "mulepalace", lm: "stettin", title: "Arkady on Kalgan", text: "Arkady stows away with Homir Munn to Kalgan. Lord Stettin wants her, and she escapes with help from his mistress Lady Callia."},
  {id: "f3f2", book: 3, world: "kalgan", site: "mulepalace", lm: "records", title: "The Mule’s palace opened", text: "Through Lady Callia, Arkady gets Munn permission to search the records in the Mule’s palace. Stettin, meanwhile, decides the Plan no longer binds him."},
  {id: "f3f3", book: 3, world: "kalgan", site: "kalport", lm: "pad", title: "Escape with the Palvers", text: "Fleeing Stettin’s police, Arkady falls in with Preem Palver and his wife, a Trantorian trading couple, who take her with them."},
  {id: "f3g", book: 3, world: "trantor", site: "hamish", lm: "palver", title: "The Palvers", text: "The farmer Preem Palver and his wife hide Arkady and take her home to Trantor, as Stettin goes to war with the Foundation."},
  {id: "f3h0", book: 3, world: "ifni", title: "Kalgan strikes first", text: "Stettin’s fleets win the opening battles, and the Foundation’s morale sinks."},
  {id: "f3h1", book: 3, world: "trantor", site: "hamish", lm: "palver", title: "A message carried", text: "Arkady talks Palver into a food run to Terminus, and he carries her message to her father."},
  {id: "f3h", book: 3, world: "quoriston", title: "Battle of Quoriston", text: "In 377 F.E. the Foundation’s Third Fleet routs Kalgan’s main fleet, and Stettin’s war collapses."},
  {id: "f3i", book: 3, world: "terminus", site: "darell", lm: "lab", title: "A circle has no end", text: "Arkady sends word that the Second Foundation is at the other end of the Galaxy, which, on a circle, is Terminus. Dr. Darell’s mind-static unmasks Pelleas Anthor, and then a nest of Second Foundationers on Terminus."},
  {id: "f3i2", book: 3, world: "terminus", site: "darell", lm: "lab", title: "Arkady tested", text: "Afraid his daughter’s mind was tampered with, Dr. Darell tests her, and finds nothing. Relieved, he believes the Second Foundation is gone."},
  {id: "f3j", book: 3, world: "trantor", site: "hamish", lm: "palver", title: "The real Star’s End", text: "The captured Second Foundationers were sacrifices. The Second Foundation is on Trantor, where all roads end, and its First Speaker is Preem Palver."},

  /* ---------- IV · Foundation's Edge ---------- */
  {id: "f4a", book: 4, world: "terminus", site: "vault", lm: "cubicle", title: "A crisis resolved", text: "In 498 F.E. Seldon appears again in the Time Vault and Mayor Harla Branno is vindicated. Councilman Golan Trevize says the Plan works too well: the Second Foundation must still exist."},
  {id: "f4a2", book: 4, world: "terminus", site: "cityhall", lm: "council", title: "Trevize speaks out", text: "Trevize tells the Council that the Plan is too perfect to be anything but steered by a hidden Second Foundation, and is arrested for treason."},
  {id: "f4b", book: 4, world: "terminus", site: "cityhall", lm: "mayor", title: "Exiled with a scholar", text: "Branno arrests Trevize and sends him off in the Far Star with the historian Janov Pelorat, who wants to find Earth, as bait for the Second Foundation."},
  {id: "f4b2", book: 4, world: "terminus", site: "termcity", lm: "spaceport", fx: "launch", title: "The Far Star", text: "Trevize and Pelorat leave Terminus in a new gravitic ship. Trevize decides to make for the Sayshell Sector rather than Trantor."},
  {id: "f4c0", book: 4, world: "trantor", site: "hamish", lm: "road", title: "On the farm road", text: "Outside the university grounds the Hamish farmer Karoll Rufirant picks a fight with Speaker Stor Gendibal, until a Hamish woman, Sura Novi, intervenes."},
  {id: "f4c1", book: 4, world: "trantor", site: "speakers", lm: "table", title: "Delarmi’s challenge", text: "Speaker Delora Delarmi moves to impeach Gendibal over the brawl. He answers with Novi’s mind, touched by a hand finer than any Speaker’s."},
  {id: "f4c", book: 4, world: "trantor", site: "speakers", lm: "radiant", title: "Gendibal and the anti-Mules", text: "On Trantor Speaker Stor Gendibal finds a Hamish woman, Sura Novi, whose mind has been touched by someone more skilled than any Speaker. He sets out after Trevize, with Novi."},
  {id: "f4d0", book: 4, world: "sayshell", site: "sayshellcity", lm: "city", title: "Compor’s warning", text: "In Sayshell City Trevize’s old classmate Munn Li Compor finds them and passes on the legend that Earth is radioactive."},
  {id: "f4d", book: 4, world: "sayshell", site: "sayuni", lm: "quintesetz", title: "Sayshell", text: "Trevize and Pelorat land on Sayshell, meet Munn Li Compor and learn from the historian Quintesetz of Gaia, a world the Sayshellians fear."},
  {id: "f4e0", book: 4, world: "gaia", site: "gaiaport", lm: "field", fx: "arrival", title: "Drawn down", text: "Near Gaia the Far Star stops answering its controls and is brought down to the surface."},
  {id: "f4e", book: 4, world: "gaia", site: "dom", lm: "dom", title: "Gaia", text: "Gaia captures the Far Star. Trevize and Pelorat meet Bliss and Dom and learn what Gaia is."},
  {id: "f4f", book: 4, world: "gaia", site: "gaiaport", title: "Trevize chooses", text: "Branno’s warship and Gendibal meet above Gaia in deadlock; Novi is Gaia. Trevize, whose intuition is never wrong, must choose the future, and chooses Galaxia."},
  {id: "f4g", book: 4, world: "earth", title: "Where is Earth?", text: "Trevize is left with one question: why has every reference to Earth been removed from the Galactic Library? Gaia says it was not them."},

  /* ---------- V · Foundation and Earth ---------- */
  {id: "f5a", book: 5, world: "gaia", site: "gaiaport", lm: "field", fx: "launch", title: "The search for Earth", text: "In 499 F.E. Trevize, Pelorat and Bliss leave Gaia in the Far Star to find Earth and test the choice."},
  {id: "f5b0", book: 5, world: "comporellon", site: "compcity", lm: "port", title: "Held at Comporellon", text: "Comporellon’s officials detain the travellers and keep the Far Star, hoping to take the advanced ship for themselves."},
  {id: "f5b", book: 5, world: "comporellon", site: "compcity", lm: "ministry", title: "Comporellon", text: "Comporellon tries to take their ship. Trevize charms Minister Lizalor, and Deniador gives them the positions of three forbidden worlds."},
  {id: "f5b2", book: 5, world: "comporellon", site: "deniador", lm: "office", title: "Three forbidden worlds", text: "The historian Vasil Deniador shares Comporellon’s old tales and the positions of three Spacer worlds said to lie near Earth."},
  {id: "f5c", book: 5, world: "aurora", site: "ruins", lm: "dogs", title: "Aurora’s dogs", text: "The first Spacer world is empty, and its dogs have gone wild."},
  {id: "f5d0", book: 5, world: "solaria", site: "bander", lm: "landing", title: "A Solarian host", text: "Robots meet the Far Star, and Sarton Bander, the estate’s only human, shows the visitors round with pride, explaining how Solarians power their robots with their own brains."},
  {id: "f5d", book: 5, world: "solaria", site: "bander", lm: "mansion", title: "Solaria and Fallom", text: "Sarton Bander intends to kill them. Bliss acts and he dies; they rescue his child Fallom, who would otherwise be destroyed."},
  {id: "f5d2", book: 5, world: "solaria", site: "bander", lm: "nursery", title: "Fallom taken aboard", text: "Bliss insists they take Bander’s young child with them, and they escape the estate with Fallom before more Solarians can act."},
  {id: "f5e", book: 5, world: "melpomenia", site: "plaque", lm: "library", title: "Fifty worlds", text: "On an airless world they find the list of all fifty Spacer worlds. Plotted in space, they point to the centre, and to Earth."},
  {id: "f5e2", book: 5, world: "melpomenia", site: "plaque", lm: "moss", title: "The moss", text: "Back outside, they find moss growing round their suit seals, feeding on their breath. They destroy it so that nothing is carried off the planet."},
  {id: "f5f0", book: 5, world: "alpha", site: "newearth", lm: "beach", title: "A warm welcome", text: "The islanders of Alpha greet the travellers with food, music and friendship, and Hiroko takes to Trevize."},
  {id: "f5f1", book: 5, world: "alpha", site: "newearth", lm: "music", title: "Fallom’s flute", text: "Fallom plays an islander’s flute without breathing into it, drawing the sound out by transducing power. The islanders are enchanted."},
  {id: "f5f", book: 5, world: "alpha", site: "newearth", lm: "hiroko", title: "New Earth", text: "The friendly islanders of Alpha plan to kill them with a disease. Hiroko warns them away."},
  {id: "f5g", book: 5, world: "earth", site: "dead", lm: "crust", title: "Earth found", text: "Earth is radioactive and dead. But its moon is very large."},
  {id: "f5g2", book: 5, world: "moon", site: "base", lm: "hangar", fx: "arrival", title: "Into the Moon", text: "An opening appears in the lunar surface and the Far Star is drawn into a hidden hangar."},
  {id: "f5h", book: 5, world: "moon", site: "base", lm: "chamber", title: "Daneel", text: "Under the Moon waits R. Daneel Olivaw, who has watched humanity for twenty thousand years and set up Gaia and psychohistory. He is dying, and Fallom is his answer."},
  {id: "f5i", book: 5, world: "moon", site: "base", lm: "chamber", title: "Galaxia confirmed", text: "Trevize understands why he chose Gaia: a united Galaxy could face whatever might come from outside it. Then he looks at Fallom, uneasy."},

  /* ---------- VI · Prelude to Foundation ---------- */
  {id: "f6a", book: 6, world: "helicon", title: "From Helicon to Trantor", text: "In 12,020 G.E. a young Heliconian mathematician reads a paper on psychohistory at the Decennial Convention on Trantor."},
  {id: "f6b", book: 6, world: "trantor", site: "palace", lm: "palace", title: "An audience with Cleon I", text: "The Emperor wants predictions he can use. Seldon says the theory is not practical, and is let go."},
  {id: "f6c", book: 6, world: "trantor", site: "streeling", lm: "rooms", title: "Hummin and Dors", text: "A journalist, Chetter Hummin, warns that First Minister Demerzel is hunting him, and hides him at Streeling University with Dors Venabili."},
  {id: "f6c2", book: 6, world: "trantor", site: "streeling", lm: "libr", title: "In the library", text: "Seldon reads history at Streeling, looking for a smaller, simpler society to test psychohistory on, and grows fascinated by hints of a single first world of humanity."},
  {id: "f6c3", book: 6, world: "trantor", site: "streeling", lm: "lift", title: "Up to the roof", text: "Seldon talks his way onto the meteorologist Jenarr Leggen’s next trip to Upperside."},
  {id: "f6d", book: 6, world: "trantor", site: "upperside", lm: "domes", title: "Lost Upperside", text: "Seldon wanders off on the domes, hides from a prowling jet-down, loses his way and nearly dies of cold."},
  {id: "f6d2", book: 6, world: "trantor", site: "upperside", lm: "station", title: "Dors searches", text: "Dors forces a search. With the help of Leggen and the seismologist Rogen Benastra she finds Seldon, half-frozen."},
  {id: "f6e0", book: 6, world: "trantor", site: "mycogen", lm: "lodging", title: "Guests of Mycogen", text: "Hummin moves them to Mycogen, where Sunmaster Fourteen, head of its Elders, accepts them grudgingly as guests, in kirtles and with their hair hidden."},
  {id: "f6e", book: 6, world: "trantor", site: "mycogen", lm: "microfarms", title: "Mycogen", text: "On a tour of the microfarms, Sister Raindrop Forty-Three lends Seldon the sector’s sacred Book, which outsiders are never meant to read."},
  {id: "f6e2", book: 6, world: "trantor", site: "mycogen", lm: "lodging", title: "The Book", text: "Most of the Book disappoints him, but two things do not: the name of the Mycogenians’ lost world, Aurora, and its robots."},
  {id: "f6f0", book: 6, world: "trantor", site: "mycogen", lm: "gravibus", title: "The gravibus", text: "Disguised as a Mycogenian, Seldon rides toward the Sacratorium and falls into talk with an old scholar, Mycelium Seventy-Two."},
  {id: "f6f2", book: 6, world: "trantor", site: "sacratorium", lm: "robot", title: "The robot in the Aerie", text: "Seldon climbs into the Elders’ Aerie and finds the robot: a metal figure in human form, motionless, kept as a relic."},
  {id: "f6f", book: 6, world: "trantor", site: "sacratorium", lm: "aerie", title: "The Sacratorium", text: "Seldon and Dors break into Mycogen’s temple seeking a robot and are caught. Hummin gets them out."},
  {id: "f6g0", book: 6, world: "trantor", site: "dahl", lm: "tisalver", title: "Lodgers in Dahl", text: "In Dahl Seldon and Dors rent rooms from Jirad Tisalver and his family."},
  {id: "f6g", book: 6, world: "trantor", site: "dahl", lm: "heatsinks", title: "The heat sinks", text: "In Dahl they meet Yugo Amaryl, a heat-sinker with a gift for mathematics."},
  {id: "f6h0", book: 6, world: "trantor", site: "billibotton", lm: "street", fx: "duel", title: "Dors draws her knives", text: "Toughs corner the visitors in Billibotton. Dors fights their leader with two knives, beats him, and becomes a legend in the slum."},
  {id: "f6h", book: 6, world: "trantor", site: "billibotton", lm: "rittah", title: "Raych and Mother Rittah", text: "In Billibotton a street boy, Raych, guides them, and an old woman tells Seldon of Earth and of Aurora, Earth’s enemy."},
  {id: "f6h2", book: 6, world: "trantor", site: "billibotton", lm: "davan", title: "Davan", text: "The agitator Davan asks for Seldon’s help in uniting Trantor’s downtrodden against the Empire. Seldon decides that psychohistory will help them more."},
  {id: "f6h3", book: 6, world: "trantor", site: "dahl", lm: "tunnels", title: "Betrayed", text: "Mrs. Tisalver informs on her lodgers, and Raych leads Seldon and Dors away through the sewers beneath Dahl."},
  {id: "f6i0", book: 6, world: "trantor", site: "wye", lm: "palace", title: "Taken to Wye", text: "Sergeant Emmer Thalus brings Seldon, Dors and Raych to Wye. Its ruler, Rashelle, wants Seldon’s science to bless her bid for the throne, and Seldon refuses."},
  {id: "f6i", book: 6, world: "trantor", site: "wye", lm: "palace", title: "Rashelle’s coup", text: "Wye kidnaps Seldon to lend Rashelle’s coup the weight of psychohistory. Demerzel’s forces end it."},
  {id: "f6j", book: 6, world: "trantor", site: "streeling", title: "Hummin unmasked", text: "Seldon works out that Hummin and Demerzel are one person, the robot Daneel. Trantor itself will be his model for psychohistory."},

  /* ---------- VII · Forward the Foundation ---------- */
  {id: "f7a", book: 7, world: "trantor", site: "palace", lm: "office", title: "Joranum", text: "In 12,028 G.E. the populist Laskin Joranum threatens Demerzel. Seldon unmasks Joranum’s past instead; Demerzel retires and Seldon becomes First Minister."},
  {id: "f7b", book: 7, world: "trantor", site: "mycogen", title: "Joranum’s secret", text: "Joranum turns out to be Mycogenian, and his movement falls apart."},
  {id: "f7b1", book: 7, world: "trantor", site: "palace", lm: "gardens", title: "The gardener", text: "Attacked on the Palace grounds, Seldon is defended by Dors and by a gardener, Mandell Gruber, who becomes his friend."},
  {id: "f7b2", book: 7, world: "trantor", site: "wye", lm: "namarti", title: "Namarti’s long game", text: "From Wye, Joranum’s old lieutenant Namarti rebuilds the movement and spends years arranging small breakdowns in Trantor’s services, to turn people against their rulers."},
  {id: "f7b3", book: 7, world: "trantor", title: "Raych undercover", text: "Raych goes undercover among the conspirators. They drug him so that he will kill his own father at a Palace ceremony."},
  {id: "f7c", book: 7, world: "trantor", site: "palace", lm: "gardens", title: "The Emperor killed", text: "Around 12,038 G.E. a plot through Wye and a drugged Raych is foiled by Manella Dubanqua, but in the confusion a gardener kills Cleon I. A military junta takes over."},
  {id: "f7d", book: 7, world: "trantor", site: "streeling", title: "Dors destroyed", text: "A member of Seldon’s own project, convinced Dors is a robot, attacks her with a device. She kills him and dies in Seldon’s arms."},
  {id: "f7e", book: 7, world: "santanni", site: "santuni", lm: "univ", title: "Raych falls", text: "Raych dies on Santanni during its revolt. The ship carrying Manella and Bellis away is lost."},
  {id: "f7e2", book: 7, world: "trantor", title: "Yugo’s death", text: "Yugo Amaryl, Seldon’s first partner in psychohistory, dies, worn out by the work."},
  {id: "f7f0", book: 7, world: "trantor", site: "library", lm: "zenow", title: "An encyclopedia", text: "Seldon wins the Chief Librarian, Las Zenow, over to an encyclopedia project, and the Library opens its resources to the work."},
  {id: "f7f", book: 7, world: "trantor", site: "library", lm: "rooms", title: "Wanda and the mentalics", text: "Seldon’s granddaughter Wanda can read minds. With her and Stettin Palver he gathers mentalics, the hidden Second Foundation, inside the Galactic Library."},
  {id: "f7g", book: 7, world: "trantor", site: "library", lm: "zenow", title: "Terminus chosen", text: "The Library’s search of old records turns up a remote, empty world at the edge of the Galaxy. The Encyclopedia project gives Seldon his public Foundation there, while the Commission rules behind a powerless Emperor."},
  {id: "f7h", book: 7, world: "trantor", site: "streeling", lm: "office", title: "Seldon’s death", text: "In 12,069 G.E. (1 F.E.) Seldon dies at his desk, both Foundations set in motion."}
  ],

  codex: [
  {id: "powers", title: "Powers", list: [
    {name: "The Galactic Empire", first: 1, desc: "Twelve thousand years old, twenty-five million inhabited worlds, ruled from Trantor. Seldon sees it is already dying.", more: [[2, "By the Mule’s time Trantor has been sacked and the Empire is a few farm worlds around Neotrantor."], [6, "The prequels show it at its height under Cleon I, with Demerzel as First Minister."]]},
    {name: "The Foundation", first: 1, desc: "Seldon’s colony of scientists on Terminus, nominally writing the Encyclopedia Galactica, really the seed of a second Empire. It grows through atomic power, a religion of science, and then trade.", more: [[2, "Under the Indburs it hardens into a hereditary dictatorship and falls to the Mule."], [3, "Free again after the Mule, it wins the Kalgan war."], [4, "By 498 F.E. it is the Foundation Federation, the greatest power in the Galaxy."]]},
    {name: "The Four Kingdoms", first: 1, desc: "Anacreon, Smyrno, Konom and Daribow, which break away from the Empire around Terminus. Hardin plays them against each other; by 80 F.E. they depend on the Foundation’s priests."},
    {name: "The Commission of Public Safety", first: 1, desc: "The oligarchy that truly rules Trantor in Seldon’s last years, led by Linge Chen. It sends the Foundation to Terminus.", more: [[7, "Forward shows it taking power behind a puppet Emperor."]]},
    {name: "The Traders", first: 1, desc: "The Foundation’s traders carry its goods and its religion out into the Periphery. Master Traders such as Ponyets and Mallow make trade the Foundation’s real power.", more: [[2, "The Independent Trading Worlds, such as Haven, resist the hereditary mayors of Terminus, and fight the Mule longest."]]},
    {name: "The Board of Trustees", first: 1, desc: "The Encyclopedists who govern Terminus in its first fifty years under Lewis Pirenne, caring for nothing but the Encyclopedia. Salvor Hardin pushes them aside."},
    {name: "The Action Party", first: 1, desc: "Sef Sermak’s party of young councilmen in 80 F.E., who want Terminus to arm and strike the Four Kingdoms and call Hardin a traitor."},
    {name: "The Merchant Princes", first: 1, desc: "After Mallow, rich traders become the Foundation’s ruling class."},
    {name: "The Second Foundation", first: 2, desc: "Seldon is said to have set up a second Foundation at the other end of the Galaxy, and left no record of where. Ebling Mis looks for it, and the Mule fears it.", more: [ [3, "A secret society of mentalics and psychohistorians guarding the Plan. It traps the Mule, then makes the Foundation think it has been destroyed. It is on Trantor."], [4, "Its Speakers meet in the old university on Trantor. Gendibal finds that something stronger is manipulating them."]]},
    {name: "The Union of Worlds", first: 2, desc: "The Mule’s empire, ruled from Kalgan.", more: [[3, "After his death it shrinks; Stettin’s war breaks what is left."]]},
    {name: "Kalgan", first: 2, desc: "A pleasure world that becomes the seat of a warlord, the Mule, and then Lord Stettin."},
    {name: "The Hamish", first: 4, desc: "The farming people of Trantor in the Foundation Era, who see the Second Foundationers in their midst only as scholars, and resent them."},
    {name: "The Sayshell Union", first: 4, desc: "Eighty-six worlds that have never been conquered, surrounded by the Foundation Federation."},
    {name: "Gaia", first: 4, desc: "A world that is a single living mind made of every person, creature and stone on it. It wants to grow into Galaxia.", more: [[5, "It was founded with the help of robots, and Daneel Olivaw."]]},
    {name: "The Spacers", first: 5, desc: "The first wave of settlers from Earth, long-lived and served by robots. Their fifty worlds are now empty or, in Solaria’s case, nearly so."},
    {name: "Mycogen", first: 6, desc: "A closed sector of Trantor that remembers its ancestors came from Aurora."},
    {name: "Wye", first: 6, desc: "A rich Trantorian sector whose mayors claim the throne.", more: [[7, "Joranum’s movement is run from Wye in its last years, behind the plot that ends with Cleon I dead."]]},
    {name: "Dahl", first: 6, desc: "A poor Trantorian sector of proud, moustached people who carry knives despite the law, and whose heat-sinkers tap the planet’s inner heat. Its slum, Billibotton, is a byword for danger."},
    {name: "The Joranumites", first: 7, desc: "The movement Laskin Joranum builds against Demerzel. After his fall Namarti keeps it alive in secret, sabotaging Trantor’s services for years."},
    {name: "The junta", first: 7, desc: "The military government that seizes power after Cleon I is killed, and rules Trantor badly for a decade."}
  ]},
  {id: "people", title: "People", list: [
    {name: "Hari Seldon", role: "Psychohistorian", books: [1, 2, 4, 6, 7], first: 1, desc: "The mathematician who invents psychohistory, predicts the fall of the Empire, and sets up the Foundations. He dies in 1 F.E., but his recorded image appears in the Vault at each crisis.", more: [[6, "Prelude shows him young, newly arrived from Helicon, running across Trantor."], [7, "He serves as First Minister, loses Dors, Raych and Yugo, and dies alone."]]},
    {name: "Gaal Dornick", role: "Mathematician", books: [1], desc: "A young recruit from Synnax who sees Seldon’s trial, and whose view opens the series."},
    {name: "Linge Chen", role: "Chief Commissioner", books: [1], desc: "The real ruler of Trantor at Seldon’s trial."},
    {name: "Salvor Hardin", role: "First mayor of Terminus", books: [1], desc: "The politician who takes the Foundation from the Encyclopedists and wins its first two crises without firing a shot."},
    {name: "Yohan Lee", role: "Hardin’s ally", books: [1], desc: "Hardin’s blunt partner in the coup of 50 F.E."},
    {name: "Jerril", role: "Imperial agent", books: [1], desc: "The man who strikes up a conversation with Gaal on his first day on Trantor, and is watching him for the Commission."},
    {name: "Lewis Pirenne", role: "Chairman of the Board", books: [1], desc: "Head of the Encyclopedists’ Board of Trustees, who wants nothing to interrupt the Encyclopedia."},
    {name: "Anselm haut Rodric", role: "Envoy of Anacreon", books: [1], desc: "The soldierly envoy who comes to Terminus in 50 F.E. and asks for a military base."},
    {name: "Lord Dorwin", role: "Imperial Chancellor", books: [1], desc: "The Empire’s envoy to the Periphery, an affected aristocrat with a taste for archaeology, whose long talks with the Board turn out to contain no promises at all."},
    {name: "Lepold I", role: "King of Anacreon", books: [1], desc: "Wienis’s young nephew, who comes of age in 80 F.E. and is crowned with the Foundation’s priests lighting his halo."},
    {name: "Lefkin", role: "Admiral Prince", books: [1], desc: "Wienis’s eldest son, who commands the refitted cruiser against Terminus, and is seized by his own crew."},
    {name: "Poly Verisof", role: "Ambassador and high priest", books: [1], desc: "The Foundation’s representative on Anacreon, who serves as the kingdom’s high priest of the religion of science."},
    {name: "Theo Aporat", role: "Priest", books: [1], desc: "The high priest aboard the cruiser Wienis, who declares the ship cursed and turns the crew against its admiral."},
    {name: "Sef Sermak", role: "Councilman", books: [1], desc: "The young leader of the Action Party, who tries to impeach Hardin."},
    {name: "Eskel Gorov", role: "Master Trader · agent", books: [1], desc: "A Foundation agent sentenced to death on Askone for selling atomic goods."},
    {name: "Pherl", role: "Councillor of Askone", books: [1], desc: "The Grand Master’s ambitious favourite, who buys Ponyets’s gold-making machine and is caught using it."},
    {name: "Jorane Sutt", role: "Foundation politician", books: [1], desc: "A schemer close to the Mayor who sends Mallow to Korell, hoping to be rid of him.", more: [[1, "Mallow has him arrested after the trial."]]},
    {name: "Publis Manlio", role: "Foreign Secretary", books: [1], desc: "Sutt’s ally in the government, and a power in the Foundation’s religion."},
    {name: "Jaim Twer", role: "Trader", books: [1], desc: "A talkative trader who invites himself along on Mallow’s voyage.", more: [[1, "He was Sutt’s spy."]]},
    {name: "Jord Parma", role: "So-called missionary", books: [1], desc: "A hurt man claiming to be a hunted Foundation missionary, who begs Mallow for sanctuary on Korell.", more: [[1, "He was a Korellian agent sent to provoke a war."]]},
    {name: "Wienis", role: "Prince Regent of Anacreon", books: [1], desc: "Anacreon’s regent, who tries to take Terminus by force in 80 F.E.", more: [[1, "He dies by his own blaster."]]},
    {name: "Limmar Ponyets", role: "Master Trader", books: [1], desc: "The trader who opens Askone with a transmuter and blackmail."},
    {name: "Hober Mallow", role: "Master Trader · mayor", books: [1], desc: "A Smyrnian trader who settles the Korell crisis with trade and becomes the first Merchant Prince."},
    {name: "Onum Barr", role: "Patrician of Siwenna", books: [1], desc: "An old man who tells Mallow how the Empire has failed his world."},
    {name: "Asper Argo", role: "Commdor of Korell", books: [1], desc: "Korell’s ruler, who arms himself with the Empire’s help and learns he cannot do without the Foundation."},
    {name: "Bel Riose", role: "Imperial general", books: [2], desc: "The Empire’s last great general, who believes in the Foundation’s threat and marches on it.", more: [[2, "Cleon II recalls him and has him executed."]]},
    {name: "Ducem Barr", role: "Siwennese patrician", books: [2], desc: "Onum Barr’s son, forced to advise Riose, who escapes to Trantor with Lathan Devers."},
    {name: "Lathan Devers", role: "Trader", books: [2], desc: "A rough-edged trader who gets himself captured to spy on Riose."},
    {name: "Cleon II", role: "Emperor", books: [2], desc: "The last strong Emperor, sick and suspicious."},
    {name: "Ammel Brodrig", role: "Privy Secretary", books: [2], desc: "Cleon II’s favourite, sent to keep watch on Riose, who throws in his lot with the general.", more: [[2, "Recalled and executed with Riose."]]},
    {name: "Bayta Darell", role: "Foundationer", books: [2, 3], desc: "A young woman of the Foundation, married to Toran, who is with Ebling Mis to the end.", more: [[2, "She shoots Mis to keep the Second Foundation hidden, and names the Mule."], [3, "Arkady’s grandmother, remembered as the woman who stopped the Mule."]]},
    {name: "Toran Darell", role: "Trader of Haven", books: [2], desc: "Bayta’s husband, of a Haven trading family."},
    {name: "Magnifico Giganticus", role: "Clown", books: [2], desc: "A thin, timid clown with a Visi-Sonor, who says he fled the Mule.", more: [[2, "He is the Mule."]]},
    {name: "The Mule", role: "Mutant conqueror", books: [2, 3], desc: "A warlord who appears from nowhere, takes Kalgan, and then the Foundation, by changing people’s emotions. Seldon’s Plan never foresaw him.", more: [[3, "He hunts the Second Foundation for five years, is trapped on Rossem, and lives out his life on Kalgan."], [4, "Gaia says he was born on Gaia, a renegade."]]},
    {name: "Ebling Mis", role: "Psychologist", books: [2], desc: "The Foundation’s greatest scientist, who works himself to death in the Library looking for the Second Foundation."},
    {name: "Han Pritcher", role: "Captain", books: [2, 3], desc: "A Foundation officer who goes to Kalgan to spy on the Mule.", more: [[3, "Converted to the Mule’s service, he hunts the Second Foundation with Channis."]]},
    {name: "Indbur III", role: "Mayor", books: [2], desc: "The hereditary mayor of the Foundation when the Mule strikes."},
    {name: "Dagobert IX", role: "Emperor on Neotrantor", books: [2], desc: "The ruler of a shrunken Empire of farm worlds."},
    {name: "Bail Channis", role: "Unconverted officer", books: [3], desc: "A clever young man whom the Mule leaves free, and sends to find the Second Foundation.", more: [[3, "He is a Second Foundationer, deliberately fed false clues."]]},
    {name: "The First Speaker", role: "Head of the Second Foundation", books: [3, 4], desc: "The leader of the Second Foundation.", more: [[3, "The one who defeats the Mule. A later First Speaker is Preem Palver."], [4, "In 498 F.E. it is Quindor Shandess."]]},
    {name: "Arkady Darell", role: "Girl of fourteen", books: [3], desc: "Bayta’s granddaughter, who follows the conspiracy to Kalgan and escapes to Trantor."},
    {name: "Dr. Toran Darell", role: "Scientist", books: [3], desc: "Bayta’s son and Arkady’s father, who builds a mind-static device to find Second Foundationers."},
    {name: "Pelleas Anthor", role: "Young scientist", books: [3], desc: "A clever young man who joins Darell’s circle.", more: [[3, "Unmasked as a Second Foundationer."]]},
    {name: "Homir Munn", role: "Librarian", books: [3], desc: "A shy, stammering expert on the Mule, sent to Kalgan."},
    {name: "Lord Stettin", role: "First Citizen of Kalgan", books: [3], desc: "Kalgan’s ruler, who takes the Mule’s title and starts a war he cannot win."},
    {name: "Lady Callia", role: "Stettin’s mistress", books: [3], desc: "Seemingly silly, she helps Arkady escape."},
    {name: "Preem Palver", role: "Trantorian trader", books: [3], desc: "A cheerful farmer and grain dealer who helps Arkady.", more: [[3, "He is the First Speaker of the Second Foundation."]]},
    {name: "Golan Trevize", role: "Councilman", books: [4, 5], desc: "A young Councilman and former officer who says the Second Foundation is still steering the Foundation, and is exiled for it.", more: [[4, "His intuition makes him the one who chooses between the Foundations and Gaia. He chooses Gaia."], [5, "He searches for Earth to learn why he was right."]]},
    {name: "Janov Pelorat", role: "Historian", books: [4, 5], desc: "A gentle scholar who has spent his life on the question of Earth, Trevize’s companion.", more: [[4, "He falls in love with Bliss."]]},
    {name: "Harla Branno", role: "Mayor of Terminus", books: [4], desc: "The tough, ageing mayor who sends Trevize out as bait and follows with a fleet."},
    {name: "Liono Kodell", role: "Director of Security", books: [4], desc: "Branno’s security chief."},
    {name: "Munn Li Compor", role: "Councilman", books: [4], desc: "Trevize’s old friend, who shadows him.", more: [[4, "He works for the Second Foundation."]]},
    {name: "Stor Gendibal", role: "Speaker", books: [4], desc: "The youngest and most ambitious Speaker of the Second Foundation."},
    {name: "Delora Delarmi", role: "Speaker", books: [4], desc: "Gendibal’s rival at the Speakers’ Table."},
    {name: "Quindor Shandess", role: "First Speaker", books: [4], desc: "The First Speaker in 498 F.E., who backs Gendibal and names the unknown manipulators the anti-Mules."},
    {name: "Karoll Rufirant", role: "Hamish farmer", books: [4], desc: "The burly farmer who starts a fight with Gendibal on the road outside the university."},
    {name: "Quintesetz", role: "Historian of Sayshell", books: [4], desc: "The Sayshellian professor who tells Trevize and Pelorat where to find Gaia."},
    {name: "Sura Novi", role: "Hamish farm woman", books: [4], desc: "A plain Hamish woman whom Gendibal takes with him.", more: [[4, "She is part of Gaia."]]},
    {name: "Bliss", role: "Gaian", books: [4, 5], desc: "A young woman who is Gaia, speaking for the planet.", more: [[5, "She travels with Trevize and Pelorat to find Earth."]]},
    {name: "Dom", role: "Elder of Gaia", books: [4], desc: "An old Gaian with a very long name, who explains what Gaia is."},
    {name: "Mitza Lizalor", role: "Minister of Comporellon", books: [5], desc: "The minister who means to keep the Far Star, and is charmed out of it."},
    {name: "Vasil Deniador", role: "Historian of Comporellon", books: [5], desc: "A sceptic who gives Trevize the first coordinates."},
    {name: "Sarton Bander", role: "Solarian", books: [5], desc: "The Solarian who shows the visitors his estate and then decides they must die."},
    {name: "Fallom", role: "Solarian child", books: [5], desc: "Bander’s child, saved from destruction and taken on the journey.", more: [[5, "Daneel means to merge his mind with Fallom’s."]]},
    {name: "Hiroko", role: "Islander of Alpha", books: [5], desc: "A fisherwoman of New Earth who warns the visitors."},
    {name: "R. Daneel Olivaw", role: "Robot", books: [5, 6, 7], desc: "A humaniform robot, twenty thousand years old, who has watched over humanity from the Moon and beyond.", more: [[6, "As Chetter Hummin, and as First Minister Eto Demerzel, he protects young Seldon."], [7, "Demerzel leaves office and departs."]]},
    {name: "Cleon I", role: "Emperor", books: [6, 7], desc: "The Emperor in Seldon’s youth, who wants psychohistory as a tool.", more: [[7, "He is killed by a gardener."]]},
    {name: "Eto Demerzel", role: "First Minister", books: [6, 7], desc: "Cleon I’s feared First Minister.", more: [[6, "He is Hummin, and the robot Daneel."]]},
    {name: "Dors Venabili", role: "Historian · protector", books: [6, 7], desc: "A historian at Streeling, who protects Seldon and becomes his wife.", more: [[6, "Seldon suspects she is not human."], [7, "She is a robot, and is destroyed protecting him."]]},
    {name: "Raych", role: "Seldon’s son", books: [6, 7], desc: "A street boy from Billibotton whom Seldon and Dors adopt.", more: [[7, "He dies on Santanni."]]},
    {name: "Yugo Amaryl", role: "Psychohistorian", books: [6, 7], desc: "A Dahlite heat-sinker who becomes Seldon’s partner in psychohistory.", more: [[7, "He dies worn out by the work."]]},
    {name: "Rashelle", role: "Mayor of Wye", books: [6], desc: "Mannix IV’s daughter, who tries to seize the throne."},
    {name: "Jenarr Leggen", role: "Meteorologist", books: [6], desc: "The Streeling meteorologist who takes Seldon Upperside, and afterwards helps Dors look for him."},
    {name: "Sunmaster Fourteen", role: "Head of Mycogen", books: [6], desc: "The leader of Mycogen’s Elders, who tolerates Seldon and Dors as guests until they break into the Sacratorium."},
    {name: "Raindrop Forty-Three", role: "Sister of Mycogen", books: [6], desc: "With her sister Raindrop Forty-Five she looks after the visitors, and lends Seldon the forbidden Book."},
    {name: "Jirad Tisalver", role: "Dahlite landlord", books: [6], desc: "The holovision programmer whose family rents rooms to Seldon and Dors in Dahl."},
    {name: "Davan", role: "Agitator", books: [6], desc: "A Billibotton activist who wants to unite the downtrodden of Trantor against the Empire."},
    {name: "Emmer Thalus", role: "Sergeant", books: [6], desc: "The big, literal-minded soldier who brings Seldon to Wye."},
    {name: "Mannix IV", role: "Mayor of Wye", books: [6], desc: "The old ruler of Wye, who has long dreamed of the throne and leaves it to his daughter Rashelle to try for it."},
    {name: "Mother Rittah", role: "Billibotton seer", books: [6], desc: "An old woman who tells legends of Earth."},
    {name: "Laskin Joranum", role: "Populist", books: [7], desc: "A politician who rouses Trantor against Demerzel."},
    {name: "Namarti", role: "Conspirator", books: [7], desc: "Joranum’s right-hand man, who keeps the movement going in secret from Wye and plans the attack at the Palace."},
    {name: "Gleb Andorin", role: "Wyan aristocrat", books: [7], desc: "A conspirator who hopes to be put on the throne, and who drugs Raych to make him a weapon against his father."},
    {name: "Mandell Gruber", role: "Palace gardener", books: [7], desc: "A gardener who helps save Seldon from an attacker and becomes his friend. In the chaos of the later plot, he kills Cleon I."},
    {name: "Tamwile Elar", role: "Mathematician", books: [7], desc: "A brilliant member of Seldon’s project who secretly works with the junta, and turns a device of the project into a weapon against Dors."},
    {name: "Las Zenow", role: "Chief Librarian", books: [7], desc: "Head of the Galactic Library, who backs Seldon’s encyclopedia without ever suspecting the Plan behind it."},
    {name: "Manella Dubanqua", role: "Agent", books: [7], desc: "A security agent who saves Seldon and marries Raych."},
    {name: "Wanda Seldon", role: "Granddaughter", books: [7], desc: "Raych’s daughter, a mentalic who can read minds, and the founder of the Second Foundation with Hari."},
    {name: "Stettin Palver", role: "Mentalic", books: [7], desc: "A young mentalic whom Wanda finds, and who joins the Second Foundation."}
  ]},
  {id: "ideas", title: "Ideas", list: [
    {name: "Psychohistory", first: 1, desc: "Seldon’s mathematics of very large populations: it cannot predict a person, but it can predict a galaxy, so long as people do not know the predictions."},
    {name: "The Seldon Plan", first: 1, desc: "Seldon’s course for the thousand years after the Empire falls, steering the Foundation through crises to a second Empire."},
    {name: "Seldon crises", first: 1, desc: "Moments when the Foundation has only one way out. Each is followed by Seldon’s recorded image in the Vault.", more: [[2, "Riose is the fourth crisis; the fifth is overtaken by the Mule, whom the Plan never foresaw."], [4, "In 498 F.E. Seldon appears again, and is right."]]},
    {name: "Galactic Era and Foundation Era", first: 1, desc: "G.E. counts the Empire’s years; F.E. counts from the founding of Terminus, 12,069 G.E."},
    {name: "Encyclopedia Galactica", first: 1, desc: "The great reference work the Foundation was supposedly sent to write. Each book opens with an extract from a later edition."},
    {name: "The religion of science", first: 1, desc: "The Foundation teaches atomic technology to its neighbours as a faith, with priests who run the power plants and do not understand them."},
    {name: "The origin question", first: 1, desc: "Imperial scholars argue over which world humanity came from, without ever going to look."},
    {name: "Star’s End", first: 3, desc: "The riddle of where Seldon put the Second Foundation: at Star’s End, at the other end of the Galaxy. Channis says it means Tazenda; Arkady reasons that on a circle the other end is Terminus. It means Trantor, the social opposite of Terminus, where all roads end."},
    {name: "The Visi-Sonor", first: 2, desc: "A rare instrument that plays music and colour together."},
    {name: "Mentalics", first: 3, desc: "The power to read and change emotions. The Second Foundation trains it.", more: [[4, "Gaia is stronger."], [7, "Wanda Seldon and Stettin Palver are born with it."]]},
    {name: "The Prime Radiant", first: 3, desc: "The device holding the Plan’s equations, which Second Foundationers study and correct."},
    {name: "Galaxia", first: 4, desc: "Gaia’s goal: a whole Galaxy that is one living being."},
    {name: "The Laws of Robotics", first: 5, desc: "The rules built into every robot’s brain: a robot may not harm a human being, must obey and must protect itself.", more: [[5, "Daneel follows a Zeroth Law above them: protect humanity as a whole."]]},
    {name: "Upperside", first: 6, desc: "The outer surface of Trantor’s domes, under real sky and weather, where few Trantorians ever go."},
    {name: "Microfarms", first: 6, desc: "Mycogen’s vats of yeast and algae, whose foods are prized by Trantor’s rich."},
    {name: "The Book", first: 6, desc: "Mycogen’s sacred history, kept from outsiders, which remembers Aurora and robots."},
    {name: "Heat sinks", first: 6, desc: "Dahl’s deep shafts that tap Trantor’s inner heat for power."},
    {name: "Twisting", first: 6, desc: "Helicon’s martial art. Seldon uses it."},
    {name: "The electro-clarifier", first: 7, desc: "A device built in Seldon’s project to sharpen the Prime Radiant. Tamwile Elar uses an intensified one against Dors."}
  ]},
  {id: "notes", title: "Connections", list: [
    {name: "Codex note: the Robot novels", first: 5, desc: "Labelled note, outside the seven books. Aurora, Solaria and R. Daneel Olivaw come from Asimov’s Robot novels (The Caves of Steel, The Naked Sun, The Robots of Dawn, Robots and Empire), set thousands of years earlier, when the Spacers and Earth’s Settlers began to spread. Comporellon’s old name, Baleyworld, honours a character from them."},
    {name: "Codex note: the Empire novels", first: 1, desc: "Labelled note, outside the seven books. The Stars, Like Dust, The Currents of Space and Pebble in the Sky are set as Trantor rises to rule the Galaxy. Pebble in the Sky places Earth in the Sirius Sector, which is why this atlas uses that name for Earth’s region."},
    {name: "Codex note: the books only", first: 1, desc: "This atlas follows Asimov’s novels. The Apple TV series changes many characters and events, and is not used here."},
    {name: "Codex note: where things are", first: 1, desc: "Asimov put Trantor near the galactic centre and Terminus at the rim, some 10,000 parsecs away. Few other positions are given. The atlas places each world by the region the books name and marks the result estimated; Alpha Centauri, Tau Ceti and Epsilon Eridani are real stars."}
  ]}
  ],

  galaxy: {
    sol: [0, 26.7],
    mirrorGal: false,
    seed: 1951,
    home: {at: {map: [-13, 13]}, dist: 640, pitch: .92, dur: 2400},
    /* engine owner: phone-specific opening view (narrow screens need a wider, more top-down frame) */
    homeMob: {at: {map: [-12, 12]}, dist: 1100, pitch: 1.2, dur: 2400},
    overview: {at: {xyz: [0, 0, 0]}, dist: 1150, pitch: .95, dur: 2200},
    flyDist: 26,
    labelFar: {major: 2600, minor: 900},
    labels: [
      {text: "The Periphery", at: {map: [-27, 23.5]}, off: [0, 6, 0], min: 60, max: 2600, big: true},
      {text: "The Four Kingdoms", at: {map: [-27.3, 21.2]}, off: [0, 3, 0], min: 8, max: 140},
      {text: "Whassalian Rift", at: {map: [-25.6, 23.4]}, off: [0, 2, 0], min: 10, max: 160},
      {text: "Normannic Sector", at: {map: [-21.5, 16]}, off: [0, 3, 0], min: 40, max: 900},
      {text: "Sirius Sector", at: {sol: [0, 0, 0]}, off: [0, 8, 0], min: 30, max: 700},
      {text: "The Inner Empire", at: {map: [0, 8]}, off: [0, 10, 0], min: 300, max: 2600, big: true}
    ],
    territories: [
      {name: "Galactic Empire", at: [0, 4], r: 24, c: "#e8b45a", a: .09, sx: 1.1, sy: 1},
      {name: "Foundation", at: [-26, 21], r: 3.5, c: "#7fb8e8", a: .16}
    ],
    glows: [
      {at: {world: "trantor"}, scale: 22, opacity: .45, color: "#ffcf80"},
      {at: {world: "terminus"}, scale: 14, opacity: .4, color: "#9fd0ff", pulse: true}
    ],
    link: {base: .5, gain: 1.4, curveMax: 60},
    links: [
      /* journeys, one colour per book */
      {id: "j1a", path: ["synnax", "trantor", "terminus"], book: 1, curve: .1},
      {id: "j1b", path: ["terminus", "anacreon"], book: 1},
      {id: "j1c", path: ["terminus", "askone"], book: 1},
      {id: "j1d", path: ["terminus", "korell", "siwenna", "terminus"], book: 1},
      {id: "j2a", path: ["siwenna", "trantor"], book: 2, curve: .08},
      {id: "j2b", path: ["terminus", "kalgan", "terminus", "haven", "neotrantor", "trantor"], book: 2, curve: .1},
      {id: "j3a", path: ["kalgan", "rossem"], book: 3, curve: .12},
      {id: "j3b", path: ["terminus", "kalgan", "trantor", "terminus"], book: 3, curve: .1},
      {id: "j4a", path: ["terminus", "sayshell", "gaia"], book: 4, curve: .1},
      {id: "j4b", path: ["trantor", "gaia"], book: 4, curve: .08},
      {id: "j5", path: ["gaia", "comporellon", "aurora", "solaria", "melpomenia", "alpha", "earth", "moon"], book: 5, curve: .2},
      {id: "j6", path: ["helicon", "trantor"], book: 6, curve: .08},
      {id: "j7", path: ["trantor", "santanni"], book: 7, curve: .08},
      /* hostile campaigns (red strike lines) */
      {id: "s1", pairs: [["anacreon", "terminus"]], color: "#ff4a36", book: 1, opacity: {all: .4, cur: .9, past: .3}, speed: .8, dash: 3, curve: .3},
      {id: "s2", pairs: [["siwenna", "loris"]], color: "#ff4a36", book: 2, opacity: {all: .4, cur: .9, past: .3}, speed: .8, dash: 3, curve: .08},
      {id: "s2b", pairs: [["kalgan", "terminus"], ["kalgan", "haven"], ["kalgan", "radole"]], color: "#ff4a36", book: 2, opacity: {all: .4, cur: .9, past: .3}, speed: .8, dash: 3, curve: .06},
      {id: "s3a", pairs: [["kalgan", "tazenda"]], color: "#ff4a36", book: 3, opacity: {all: .4, cur: .9, past: .3}, speed: .8, dash: 3, curve: .1},
      {id: "s3b", pairs: [["kalgan", "ifni"], ["kalgan", "quoriston"]], color: "#ff4a36", book: 3, opacity: {all: .4, cur: .9, past: .3}, speed: .8, dash: 3, curve: .06}
    ]
  },

  legend: [
    {bookColors: true, label: "Journeys", allLabel: "Journeys, by book"},
    {color: "#ff4a36", label: "Hostile campaigns"},
    {color: "rgba(232,180,90,.6)", label: "The Empire"},
    {color: "rgba(127,184,232,.6)", label: "The Foundation"}
  ]
};

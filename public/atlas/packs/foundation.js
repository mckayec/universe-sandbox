/* The Foundation Atlas: data pack for Isaac Asimov's seven Foundation novels, in publication order.
   Schema: atlas/PACK_FORMAT.md (galactic engine v1).

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
    text: "Twelve thousand years after humanity spread from a forgotten home world, the Galactic Empire rules twenty-five million worlds of the Milky Way from Trantor, a planet roofed over by a single city. Hari Seldon’s psychohistory predicts its fall and thirty thousand years of barbarism, and his Plan sets two Foundations at opposite ends of the Galaxy to cut that dark age to a thousand years. The book buttons follow publication order, so the two prequels, set before the first book, come last.",
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
   sites: [
     {id: "palace", name: "Imperial Palace grounds", lat: 24, lon: 14, books: [2, 6, 7], desc: "The only open land on Trantor: parkland, gardens and the Palace in the Imperial Sector, where the Emperors hold court."},
     {id: "commission", name: "Commission of Public Safety", rel: {to: "palace", dlat: -6, dlon: 9}, books: [1, 7], desc: "The ruling commission that tries Seldon in 12,067 G.E. and sends his project into exile on Terminus."},
     {id: "library", name: "The Galactic Library", rel: {to: "palace", dlat: 9, dlon: -12}, books: [2, 4, 7], desc: "The Imperial Library, the greatest store of knowledge in the Galaxy, and the one great building left standing after the Sack."},
     {id: "speakers", name: "The Speakers’ university", rel: {to: "library", dlat: 6, dlon: 6}, books: [4], desc: "The old university buildings where the Second Foundation meets around the Speakers’ Table, hidden behind the Hamish farm country."},
     {id: "hamish", name: "Hamish farmlands", lat: 18, lon: 40, books: [3, 4], desc: "Farms worked among the ruins of the world-city by people who grow and sell grain."},
     {id: "streeling", name: "Streeling University", lat: 8, lon: -40, books: [6, 7], desc: "The university in the Streeling Sector where Hummin hides Seldon and he meets the historian Dors Venabili."},
     {id: "upperside", name: "Upperside", rel: {to: "streeling", dlat: 8, dlon: 6}, books: [6], desc: "The roof of the domes, under real weather. Seldon goes up with a meteorologist, is left behind in the cold, and is found half-frozen by Dors."},
     {id: "mycogen", name: "Mycogen", lat: -6, lon: 62, books: [6, 7], desc: "A closed, bald-headed, religious sector that farms yeast and algae. Its people keep a Book about their lost home, Aurora, and a secret in their Sacratorium."},
     {id: "sacratorium", name: "The Sacratorium", rel: {to: "mycogen", dlat: 4, dlon: 5}, books: [6], desc: "Mycogen’s temple, where Seldon and Dors break in looking for an ancient robot and are caught."},
     {id: "dahl", name: "Dahl", lat: -24, lon: -96, books: [6, 7], desc: "A poor, proud sector whose heat-sink workers tap the planet’s inner heat for power. Seldon meets the heat-sinker Yugo Amaryl, who becomes his partner in psychohistory."},
     {id: "billibotton", name: "Billibotton", rel: {to: "dahl", dlat: -6, dlon: -8}, books: [6], desc: "Dahl’s notorious slum, where Seldon and Dors find the street boy Raych and the old woman Mother Rittah, who tells them legends of Earth."},
     {id: "wye", name: "Wye", lat: -80, lon: 30, books: [6, 7], desc: "A powerful sector at the south pole, ruled by Mayor Mannix IV. His daughter Rashelle kidnaps Seldon to lend her coup legitimacy; Demerzel crushes it."}
   ]},

  {id: "neotrantor", name: "Neotrantor", aka: ["Delicass"], group: "core", books: [2], first: 2, status: "Last seat of the Empire",
   star: {name: "Neotrantor’s sun", col: "#fff0d4"},
   at: {of: "trantor", spread: 5}, est: true, /* estimated: a small farm world near Trantor */
   blurb: "A small farming world near Trantor, renamed when the Imperial court fled there after the Sack. By the Mule’s time the Empire is some twenty farm worlds ruled from here by Dagobert IX. The Darells pass through on their way to the Library, and the Emperor’s son, who tries to take Bayta, dies suddenly.",
   short: "Where the last Emperors keep a shrunken court.",
   facts: [["Ruler", "Dagobert IX"], ["Realm", "About twenty farm worlds"]],
   gfx: {type: "terran", sea: .45, freq: 1.5, pal: ["#0c2034", "#2a5a78", "#6a7a3a", "#8a8a48", "#6e6650", "#ecece6"], clouds: .4, atmo: "#8ab0ff", lights: .3,
         feat: [{k: "biome", style: "farm", at: [20, 0], r: 25, s: .8, c: "#8a8a4a"}]},
   sites: [{id: "court", name: "The Imperial court", lat: 22, lon: 4, books: [2], desc: "A country palace standing in for the lost splendour of Trantor."}]},

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
     4: {status: "Capital of the Foundation Federation",
         blurb: "Five centuries on, Terminus rules a Federation of thousands of worlds and is a rich, crowded planet. Mayor Harla Branno has just weathered a crisis over moving the capital inward when Golan Trevize stands up in Council to say the Plan is too perfect."}
   },
   sites: [
     {id: "termcity", name: "Terminus City", lat: 22, lon: -18, books: [1, 2, 3, 4], desc: "The capital, on the only large island. Salvor Hardin is its first mayor, and the city outgrows the Encyclopedia to rule the Periphery."},
     {id: "vault", name: "The Time Vault", rel: {to: "termcity", dlat: 3, dlon: 4}, books: [1, 2, 4], desc: "A sealed room Seldon left behind. At each crisis it opens and his recorded image speaks to whoever is there."},
     {id: "cityhall", name: "City Hall", rel: {to: "termcity", dlat: -3, dlon: 3}, books: [1, 2, 4], desc: "Seat of the mayors of Terminus and their Council, from Salvor Hardin on."},
     {id: "darell", name: "The Darell house", rel: {to: "termcity", dlat: 6, dlon: -6}, books: [3], desc: "Where Dr. Toran Darell’s circle meets to hunt the Second Foundation, and his daughter Arkady listens in."}
   ]},

  {id: "anacreon", name: "Anacreon", group: "periphery", books: [1], major: true, first: 1, status: "Kingdom · strongest of the Four Kingdoms", hero: "royal",
   star: {name: "Anacreon A (binary)", col: "#ffe6c0"},
   at: {of: "terminus", spread: 1.2}, est: true, /* about 8 parsecs from Terminus */
   blurb: "Terminus’s nearest neighbour, once a prefecture of the Empire and now the strongest of the Four Kingdoms that break away. In 50 F.E. its king wants Terminus for its harbour and its atomic power. Thirty years on, its Prince Regent Wienis attacks the Foundation with a refitted Imperial cruiser.",
   short: "The kingdom next door, and the first threat.",
   facts: [["Rulers", "Prince Regent Wienis; King Lepold I"], ["Distance", "About 8 parsecs from Terminus"]],
   gfx: {type: "terran", sea: .5, freq: 1.4, pal: ["#0a1e36", "#2a5e86", "#4a6a34", "#6e7e44", "#7a6e58", "#f0f0ec"], clouds: .42, atmo: "#86aaff", lights: .35, ice: 76,
         feat: [{k: "range", from: [30, 10], to: [12, 40], w: 2.5, s: .24}]},
   sites: [{id: "royal", name: "The royal palace", lat: 20, lon: 26, books: [1], desc: "Hardin attends Lepold’s coming of age here while Wienis launches the attack, and the Foundation’s priests turn Anacreon against its regent."},
           {id: "temple", name: "Temple of the Galactic Spirit", rel: {to: "royal", dlat: -4, dlon: 6}, books: [1], desc: "A temple of the Foundation’s religion of science, whose priests run the atomic plants Anacreon depends on."}]},

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
   sites: [{id: "grandmaster", name: "The Grand Master’s court", lat: 14, lon: -20, books: [1], desc: "Where Ponyets bargains for the condemned agent Eskel Gorov, around 135 F.E."}]},

  {id: "korell", name: "Korell", group: "periphery", books: [1], major: true, first: 1, status: "Republic of Korell · in name", hero: "commdor",
   star: {name: "Korell’s sun", col: "#ffe8c4"},
   map: [-25.7, 22.9], est: true, /* estimated: in or beyond the Whassalian Rift */
   blurb: "A so-called republic ruled by a Commdor, almost always of the Argo family. Three Foundation ships vanish near it. Hober Mallow comes to investigate, finds Imperial atomic weapons in the guards’ hands, and sells the Commdor the household gadgets that will make Korell dependent on Foundation trade.",
   short: "Where Hober Mallow wins a war by trade alone.",
   facts: [["Ruler", "Commdor Asper Argo"], ["Crisis", "The third Seldon crisis, c. 155 F.E."]],
   gfx: {type: "barren", sea: .3, freq: 1.5, rough: .6, pal: ["#121a22", "#2a3a44", "#5a5248", "#6a6052", "#7a6e5e", "#d8d0c4"], clouds: .3, cloudCol: "#bcb4a8", atmo: "#c8b8a0", atmoK: .7, lights: .35},
   sites: [{id: "commdor", name: "The Commdor’s palace", lat: 18, lon: 30, books: [1], desc: "Mallow sells Asper Argo trinkets for his wife here and notices the Empire’s spaceship-and-sun on his guards’ weapons."},
           {id: "korport", name: "The spaceport", rel: {to: "commdor", dlat: -5, dlon: -6}, books: [1], desc: "A man calling himself a Foundation missionary begs Mallow for sanctuary. Mallow hands him over to the crowd, suspecting a trap; he is right."}]},

  {id: "haven", name: "Haven", group: "periphery", books: [2], major: true, first: 2, status: "Trader world", hero: "havencity",
   star: {name: "Haven’s sun", col: "#ffbc8a"},
   map: [-25.2, 19.6], est: true, /* estimated: one of the Independent Trading Worlds of the Periphery */
   blurb: "A barren, rocky Trader world whose people live in cities underground. Toran Darell comes from here. When the Foundation falls to the Mule, Haven holds out longest, and the Darells shelter here until it too gives in.",
   facts: [["Known for", "Independent Traders"], ["People", "Live in underground cities"]],
   gfx: {type: "barren", sea: .05, rough: .7, bump: 1.3, pal: ["#16120e", "#2a221a", "#5a4a3a", "#6a5844", "#7a6a56", "#c8bcaa"], clouds: .1, atmo: "#d0a080", atmoK: .45, lights: .2},
   sites: [{id: "havencity", name: "The underground city", lat: 6, lon: 10, books: [2], desc: "Haven’s cities lie under the rock. Here Toran’s family plots the Traders’ resistance."}]},

  {id: "radole", name: "Radole", group: "periphery", books: [2], first: 2, status: "Trader world · tidally locked",
   star: {name: "Radole’s sun", col: "#ffd0a0"},
   map: [-24.5, 20.7], est: true, /* estimated */
   blurb: "One of the Independent Trading Worlds. It keeps one face to its sun, so only a ribbon of land around the line between day and night is livable.",
   gfx: {type: "desert", sea: .08, dune: 5, pal: ["#1a2a3a", "#3a5a6a", "#9a6a40", "#b88a58", "#5a5a5a", "#f4f6f8"], clouds: .2, atmo: "#ffc890", atmoK: .7, lights: .25,
         feat: [{k: "biome", style: "flame", at: [0, 90], r: 50, s: .6, c: "#a85a2a"}, {k: "biome", style: "snow", at: [0, -90], r: 50, s: .8, c: "#d8e0ea"}, {k: "biome", style: "grass", at: [0, 0], r: 14, s: .6, c: "#6a7a44"}]}},

  {id: "loris", name: "Loris", group: "periphery", books: [2], first: 2, status: "Foundation world",
   star: {name: "Loris’s sun", col: "#fff0d8"},
   at: {of: "terminus", spread: 1.6}, est: true, /* about 20 pc from Terminus (planet list) */
   blurb: "A Foundation world some twenty parsecs from Terminus, known for its wine. It marks the deepest point of Bel Riose’s advance into Foundation space.",
   gfx: {type: "terran", sea: .45, freq: 1.7, pal: ["#0c2034", "#2c5c7c", "#4e6a34", "#6e7a40", "#7a6a50", "#eeeae0"], clouds: .4, atmo: "#88aaff", lights: .3,
         feat: [{k: "biome", style: "farm", at: [30, 10], r: 14, s: .7, c: "#6a5a3a"}]}},

  {id: "quoriston", name: "Quoriston", group: "periphery", books: [3], first: 3, status: "Battle site · 377 F.E.",
   star: {name: "Quoriston", col: "#ffd8b0"},
   map: [-25.0, 19.9], est: true, /* estimated; asimov.fandom "Battle of Quoriston" */
   blurb: "A star system on the Foundation’s frontier, where in 377 F.E. the Foundation’s Third Fleet outmanoeuvres Lord Stettin’s main battle fleet and ends the Kalgan war.",
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
         feat: [{k: "basin", at: [20, 20], r: 6, s: .5}, {k: "biome", style: "rock", at: [20, 20], r: 5, s: 1, c: "#2a2422"}]}},

  {id: "siwenna", name: "Siwenna", group: "provinces", books: [1, 2], major: true, first: 1, status: "Old capital of the Normannic Sector", hero: "barr",
   star: {name: "Siwenna’s sun", col: "#fff0d0"},
   map: [-21.5, 17.0], est: true, /* estimated: the Imperial frontier facing the Periphery */
   blurb: "Once the rich capital of a province, ruined by a viceroy’s reprisals that killed most of the patrician Onum Barr’s family. Hober Mallow sees the dying Empire here.",
   eras: {2: {status: "Bel Riose’s base", blurb: "Once the rich capital of a province, ruined by a viceroy’s reprisals. About 195 F.E. the Empire’s last great general, Bel Riose, governs here, forces Ducem Barr to tell him about the Foundation, and marches on it. After his fall Siwenna passes to the Foundation."}},
   short: "A ruined provincial capital on the Empire’s edge.",
   facts: [["Sector", "Normannic"], ["Family", "The Barrs, patricians"]],
   gfx: {type: "terran", sea: .5, freq: 1.4, pal: ["#0b1f36", "#2b6080", "#5a6a3c", "#7a7e4a", "#76705e", "#eeeeea"], clouds: .4, atmo: "#86aaff", lights: .3},
   sites: [{id: "barr", name: "The Barr estate", lat: 26, lon: 18, books: [1, 2], desc: "Home of the patrician Barr family. Onum Barr tells Mallow how the Empire is rotting."}]},

  {id: "kalgan", name: "Kalgan", group: "provinces", books: [2, 3], major: true, first: 2, status: "Pleasure world · the Mule’s capital", hero: "mulepalace",
   star: {name: "Kalgan’s sun", col: "#fff4d8"},
   map: [-30.5, -0.5], est: true, /* estimated: "in the Periphery" yet ~7,000 pc from Terminus (planet list) */
   blurb: "A semi-tropical resort world where Imperial nobles came to play, which survives the Empire by staying neutral. Bayta and Toran honeymoon here and meet the clown Magnifico. The Mule takes it without a fight and makes it the capital of his Union of Worlds.",
   short: "The pleasure planet the Mule makes his capital.",
   facts: [["Rulers", "A warlord; then the Mule"], ["Known for", "Resorts and pleasure gardens"]],
   eras: {3: {status: "Capital of the Union of Worlds",
              blurb: "After the Mule’s death his heirs rule a shrinking Union from Kalgan. In 376 F.E. Lord Stettin, egged on by his belief that the Plan no longer binds anyone, attacks the Foundation and loses at Quoriston."}},
   gfx: {type: "archipelago", sea: .6, freq: 1.8, pal: ["#05284a", "#1a8aa8", "#3a7a3a", "#5a8a44", "#6a6a4a", "#f2f2f2"], clouds: .4, atmo: "#7ab8ff", lights: .55, lightCol: "#ffd890", ice: 86},
   sites: [{id: "mulepalace", name: "The Mule’s palace", lat: 10, lon: 40, books: [2, 3], desc: "The seat of Kalgan’s warlords, and then of the Mule."},
           {id: "resorts", name: "The pleasure coast", rel: {to: "mulepalace", dlat: -6, dlon: -8}, books: [2], sea: true, desc: "Beaches and carnivals where the Darells find Magnifico running from the Mule’s men."}]},

  {id: "rossem", name: "Rossem", group: "provinces", books: [3], first: 3, status: "Cold vassal of Tazenda", hero: "rossemvillage",
   star: {name: "Rossem’s dim sun", col: "#ffb88a"},
   map: [26.5, -21.0], est: true, /* estimated: the far rim opposite Terminus, from the "Star's End" theory */
   blurb: "A frozen, thinly settled world under the oligarchy of Tazenda. Bail Channis leads Han Pritcher here, convinced that the Second Foundation is at Star’s End and that Tazenda is it. Here the Mule springs his own trap, and the First Speaker springs the last one.",
   gfx: {type: "ice", sea: .15, pal: ["#5a6a7e", "#7a8aa0", "#b8c2cc", "#ccd4dc", "#e2e8ee", "#ffffff"], clouds: .35, atmo: "#c0d0f0", atmoK: .6, lights: .08},
   sites: [{id: "rossemvillage", name: "A farming village", lat: 30, lon: -10, books: [3], desc: "Where the Tazendian governor receives Channis and Pritcher, and the Mule confronts Channis."}]},

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
   sites: [{id: "santuni", name: "University of Santanni", lat: 20, lon: -30, books: [7], desc: "Where Raych dies in the uprising."}]},

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
   sites: [{id: "sayshellcity", name: "Sayshell City", lat: 16, lon: 22, books: [4], desc: "The capital. Trevize meets his old classmate Munn Li Compor here, and a guide shows them the city."},
           {id: "sayuni", name: "University of Sayshell", rel: {to: "sayshellcity", dlat: 5, dlon: 7}, books: [4], desc: "Pelorat consults the historian Quintesetz, who gives them Gaia’s coordinates and the local legends about it."}]},

  {id: "gaia", name: "Gaia", group: "sayshell", books: [4, 5], major: true, first: 4, status: "A living planet", hero: "dom",
   star: {name: "Gaia’s sun", col: "#fff4e4"},
   at: {of: "sayshell", spread: .8}, est: true, /* about 10 pc from Sayshell */
   blurb: "A green, gentle world where every person, animal, plant and rock shares one consciousness while keeping its own. Gaia has quietly protected Sayshell and guarded the Plan; its mentalics are stronger than the Second Foundation’s. Trevize is brought here to choose the Galaxy’s future, and chooses Gaia’s: a living Galaxia.",
   short: "The world that is one mind.",
   facts: [["People", "Every Gaian is part of Gaia"], ["Goal", "Galaxia, a living Galaxy"]],
   gfx: {type: "forest", sea: .48, freq: 1.5, pal: ["#0a2236", "#2a5a6a", "#1e4a22", "#2f6a28", "#4a6a3a", "#e8ece6"], clouds: .45, atmo: "#80c4ff", atmoK: 1.05, lights: .05},
   sites: [{id: "dom", name: "Dom’s house", lat: 12, lon: -14, books: [4, 5], desc: "The old Gaian Dom explains Gaia to Pelorat and Trevize. Bliss is the part of Gaia who meets them."},
           {id: "gaiaport", name: "The landing field", rel: {to: "dom", dlat: -4, dlon: -6}, books: [4, 5], desc: "Where Gaia brings the Far Star down."}]},

  /* ======================= Earth's region: the Sirius Sector and the Spacer worlds ======================= */
  {id: "comporellon", name: "Comporellon", aka: ["Baleyworld"], group: "earthward", books: [5], major: true, first: 5, status: "Associated power of the Foundation", hero: "compcity",
   star: {name: "Comporellon’s sun (possibly Epsilon Eridani)", col: "#ffd8a8", ra: 53.233, dec: -9.458, ly: 10.5}, est: true, /* identification with Epsilon Eridani is a fan inference; marked estimated */
   blurb: "A cold, proud world that claims to be the oldest settled planet in the Galaxy, and resents its ties to the Foundation. Officials try to seize the Far Star. Trevize talks his way out with the help of Minister Mitza Lizalor, and the historian Vasil Deniador gives them coordinates for three of the forbidden worlds.",
   facts: [["Climate", "Very cold"], ["Old name", "Baleyworld (Robot novels)"]],
   gfx: {type: "ice", sea: .25, pal: ["#3a4e66", "#5a7088", "#a8b4c0", "#bcc6d0", "#d6dce4", "#ffffff"], clouds: .45, atmo: "#b8cce8", atmoK: .8, lights: .55, ice: 50},
   sites: [{id: "compcity", name: "Comporellon City", lat: 24, lon: -20, books: [5], desc: "The capital, much of it underground against the cold. Trevize and Pelorat are held here."},
           {id: "deniador", name: "The university", rel: {to: "compcity", dlat: 4, dlon: 6}, books: [5], desc: "Vasil Deniador, a sceptical historian, tells them what Comporellon remembers of Earth and the first settlers."}]},

  {id: "aurora", name: "Aurora", group: "earthward", books: [5, 6], first: 5, status: "Spacer world · abandoned", hero: "ruins",
   star: {name: "Tau Ceti", col: "#fff0d0", ra: 26.017, dec: -15.94, ly: 11.9}, /* Tau Ceti, per the Robot novels */
   blurb: "The first and greatest of the Spacer worlds, now empty for twenty thousand years. Its buildings have fallen, and the descendants of its pet dogs run in packs; they nearly kill Trevize.",
   eras: {6: {blurb: "The first and greatest of the Spacer worlds. In Foundation and Earth it is empty, its buildings fallen and its dogs gone wild. Prelude reveals that the people of Mycogen, on Trantor, remember it as the home of their ancestors."}},
   facts: [["People", "None left"]],
   gfx: {type: "forest", sea: .45, pal: ["#0a1e30", "#2a4a6a", "#2a3a2a", "#4a5a3a", "#5a5a50", "#e0dcd4"], clouds: .45, atmo: "#a0b8e0", atmoK: .9, lights: 0},
   sites: [{id: "ruins", name: "Ruined city", lat: 20, lon: 30, books: [5], desc: "Overgrown buildings where feral dogs attack the travellers, until Bliss turns them with fear."}]},

  {id: "solaria", name: "Solaria", group: "earthward", books: [5], first: 5, status: "Spacer world · a few estates", hero: "bander",
   star: {name: "Solaria’s sun", col: "#fff4e0"},
   dir: {l: 150, b: 18}, ly: 60, est: true, /* estimated: the books give no position; the Spacer worlds lie around Earth */
   blurb: "The last Spacer world, still inhabited by about twelve hundred Solarians, each alone on a vast estate run by robots. They have made themselves hermaphrodite and draw power with brain lobes of their own. Sarton Bander means to kill the visitors; Bliss strikes first, and the travellers take Bander’s child Fallom with them.",
   facts: [["People", "About 1,200, one to an estate"], ["Robots", "Thousands to each person"]],
   gfx: {type: "terran", sea: .4, freq: 1.4, pal: ["#0a1e36", "#2a5a7a", "#5a7a3a", "#7a8a48", "#6e6a58", "#eeeeea"], clouds: .3, atmo: "#86aaff", lights: .1,
         feat: [{k: "biome", style: "farm", at: [20, 40], r: 20, s: .7, c: "#7a8a44"}]},
   sites: [{id: "bander", name: "Bander’s estate", lat: 22, lon: 40, books: [5], desc: "A mansion among endless orchards and fields, kept by robots. Here Bander dies and Fallom is saved."}]},

  {id: "melpomenia", name: "Melpomenia", group: "earthward", books: [5], first: 5, status: "Spacer world · airless", hero: "plaque",
   star: {name: "Melpomenia’s sun", col: "#ffe8c8"},
   dir: {l: 300, b: -24}, ly: 55, est: true, /* estimated */
   blurb: "A Spacer world whose air has nearly all gone. The travellers search it in spacesuits and find a library with a plaque listing the fifty Spacer worlds and their positions, and a hungry moss that tries to feed on their suits.",
   gfx: {type: "barren", sea: 0, rough: .6, pal: ["#2a2c30", "#3a3c40", "#6a6a6a", "#7e7c78", "#9a968e", "#e4e2de"], clouds: 0, atmoK: .15, lights: 0,
         feat: [{k: "biome", style: "grass", at: [14, -30], r: 8, s: .5, c: "#4a5a3a"}]},
   sites: [{id: "plaque", name: "The library plaque", lat: 14, lon: -30, books: [5], desc: "A wall plaque of the fifty Spacer worlds. Plotted, they form a sphere, and Earth should lie near its centre."}]},

  {id: "alpha", name: "Alpha", aka: ["New Earth"], group: "earthward", books: [5], major: true, first: 5, status: "Ocean world · one island", hero: "newearth",
   star: {name: "Alpha Centauri A", col: "#fff3dc", ra: 219.902, dec: -60.834, ly: 4.37},
   blurb: "A water world circling the larger star of Alpha Centauri, terraformed long ago, with a single island where a small, friendly people fish, farm and make music. They welcome the travellers and quietly plan to kill them with an infection. Hiroko, who has taken to Trevize, warns them in time.",
   short: "The island of New Earth on an ocean world.",
   facts: [["Land", "One large island"]],
   gfx: {type: "ocean", sea: .93, pal: ["#05284a", "#1a8aa8", "#3a7a3a", "#5a8a44", "#6a6a4a", "#f2f2f2"], clouds: .4, atmo: "#7ab8ff", lights: .05, ice: 86,
         feat: [{k: "continent", at: [8, 20], r: 5, s: .45}]},
   sites: [{id: "newearth", name: "New Earth", lat: 8, lon: 20, books: [5], desc: "The one inhabited island. Fallom plays the islanders’ music, and Hiroko warns the visitors to run."}]},

  {id: "earth", name: "Earth", group: "earthward", books: [4, 5, 6], major: true, first: 4, status: "Humanity’s lost home · radioactive", hero: "dead",
   star: {name: "Sol", col: "#fff4e0"},
   /* no placement: sits at Sol */
   blurb: "The world where humanity began, so forgotten that most scholars doubt it ever existed and every reference to it has vanished from the Galactic Library. Pelorat has spent his life on the origin question, and the legends say it is dangerous, even deadly, to look for it.",
   eras: {5: {status: "Found · radioactive and lifeless", blurb: "The world where humanity began. When the Far Star finally reaches the Sun, Earth is radioactive and dead, and the answer to Trevize’s question lies on its large moon.", gfx: {pal: ["#101418", "#1e2628", "#4a4038", "#5a4a3c", "#6e6050", "#b8b0a4"], clouds: .22, cloudCol: "#a8a49a", atmo: "#b0a890", atmoK: .7}},
          6: {blurb: "The world where humanity began, radioactive and dead by the time Trevize finds it. In Prelude, twenty thousand years after the Spacers, the people of Billibotton and Mycogen still keep legends of it."}},
   short: "The forgotten origin world.",
   facts: [["Also called", "The origin world, in the legends"]],
   gfx: {type: "terran", base: "earth", sea: .5, rough: .35, pal: ["#0e1a2a", "#24384a", "#4a5048", "#5a5a4c", "#6e6656", "#d8d4cc"], clouds: .7, cloudCol: "#c8c8c4", atmo: "#a8b4c8", atmoK: .8, lights: 0},
   sites: [{id: "dead", name: "The dead surface", lat: 30, lon: 35, books: [5], desc: "Seen only from orbit: the glow of radioactivity and no sign of life."}]},

  {id: "moon", name: "The Moon", group: "earthward", books: [5], first: 5, status: "Earth’s satellite · Daneel’s refuge", hero: "base",
   star: {name: "Sol", col: "#fff4e0"},
   at: {of: "earth", spread: .25},
   blurb: "Earth’s unusually large moon. Beneath its surface the travellers find the robot R. Daneel Olivaw, who has guided humanity for twenty thousand years and now needs Fallom’s mind to go on.",
   gfx: {type: "barren", sea: 0, rough: .7, bump: 1.4, pal: ["#2a2a2c", "#3a3a3c", "#7a7874", "#8a8884", "#a4a29c", "#e4e2dc"], clouds: 0, atmoK: 0, lights: 0},
   sites: [{id: "base", name: "Daneel’s refuge", lat: 10, lon: -20, books: [5], desc: "A hidden hangar and halls under the lunar crust, where the last answers of the series are given."}]}
  ],

  events: [
  /* ---------- I · Foundation ---------- */
  {id: "f1a", book: 1, world: "synnax", title: "Gaal Dornick sets out", text: "In 12,067 G.E. a young mathematician leaves his provincial world for Trantor, to join Hari Seldon’s project."},
  {id: "f1b", book: 1, world: "trantor", site: "commission", title: "Seldon on trial", text: "The Commission of Public Safety tries Seldon. He predicts Trantor’s ruin within three centuries and thirty thousand years of chaos, which his plan could cut to one thousand. He is exiled with his Encyclopedists, exactly as he intended."},
  {id: "f1c", book: 1, world: "terminus", site: "termcity", title: "The Encyclopedia Foundation", text: "About 100,000 scientists settle the empty world of Terminus to write the Encyclopedia Galactica. Seldon dies on Trantor in 1 F.E."},
  {id: "f1d0", book: 1, world: "gammaandromeda", title: "A plant fails", text: "News comes of an atomic disaster at Gamma Andromeda: the Empire can no longer keep its own machines running."},
  {id: "f1d", book: 1, world: "terminus", site: "cityhall", title: "Lord Dorwin’s empty promises", text: "In 50 F.E. Anacreon demands bases on Terminus. An Imperial envoy visits; Salvor Hardin’s analysis shows his reassurances contain nothing at all."},
  {id: "f1e", book: 1, world: "terminus", site: "vault", title: "The first Seldon crisis", text: "Hardin and Yohan Lee take power from the Encyclopedists. The Vault opens and Seldon reveals the Encyclopedia was a cover. Hardin sets the other kingdoms against Anacreon and Terminus stays free."},
  {id: "f1f", book: 1, world: "anacreon", site: "royal", title: "The second Seldon crisis", text: "In 80 F.E. Prince Regent Wienis attacks with a refitted Imperial cruiser while Hardin visits. Its crew and Anacreon’s people obey the Foundation’s priests instead, and Wienis dies by his own blaster."},
  {id: "f1g", book: 1, world: "askone", site: "grandmaster", title: "The transmuter", text: "Around 135 F.E. the trader Limmar Ponyets frees a Foundation agent by trading a gold-making machine and blackmailing the man who used it."},
  {id: "f1h", book: 1, world: "korell", site: "korport", title: "Mallow reaches Korell", text: "Around 155 F.E. Hober Mallow comes to find three lost ships. He refuses sanctuary to a false missionary, and sells to the Commdor."},
  {id: "f1i", book: 1, world: "siwenna", site: "barr", title: "The dying Empire", text: "Mallow travels on to Siwenna and hears from Onum Barr how the Empire’s provinces are decaying, and that it is arming Korell."},
  {id: "f1j", book: 1, world: "terminus", site: "cityhall", title: "Mallow’s trial", text: "Tried for murder over the missionary, Mallow proves he was a Korellian agent, and is elected mayor."},
  {id: "f1k", book: 1, world: "korell", site: "commdor", title: "The third Seldon crisis", text: "Korell declares war, but its industry runs on Foundation goods. When trade stops, Korell gives in without a battle: trade, not religion, now carries the Plan."},

  /* ---------- II · Foundation and Empire ---------- */
  {id: "f2a", book: 2, world: "siwenna", site: "barr", title: "Bel Riose and Ducem Barr", text: "Around 195 F.E. the young Imperial general Bel Riose seeks out Ducem Barr to learn about the magicians of the Periphery, then marches on the Foundation."},
  {id: "f2b", book: 2, world: "loris", title: "The fourth Seldon crisis", text: "Riose’s fleets press into Foundation space as far as Loris. The trader Lathan Devers lets himself be captured to get close to him."},
  {id: "f2c", book: 2, world: "trantor", site: "palace", title: "Bribery on Trantor", text: "Devers and Barr escape to Trantor to turn the Emperor against Riose, and barely escape the police."},
  {id: "f2d", book: 2, world: "trantor", site: "palace", title: "Riose recalled", text: "Cleon II fears any successful general, and has Riose and his own secretary recalled and executed. A strong Empire cannot allow a strong subject: the crisis solves itself."},
  {id: "f2e", book: 2, world: "terminus", site: "termcity", title: "Bayta and Toran", text: "Around 310 F.E. the Foundation is run by hereditary mayors and the Traders chafe. Bayta, a Foundationer, marries Toran Darell of Haven."},
  {id: "f2f", book: 2, world: "kalgan", site: "resorts", title: "Magnifico", text: "Honeymooning on Kalgan, the Darells rescue a frightened clown who says he fled the Mule, the new warlord who took Kalgan without a fight. Captain Han Pritcher, a Foundation agent, joins them."},
  {id: "f2g", book: 2, world: "terminus", site: "vault", title: "The Vault opens", text: "Seldon’s image speaks of a civil war with the Traders, a crisis the Mule has made irrelevant. Seldon did not foresee him, and the Foundation falls without a fight."},
  {id: "f2h", book: 2, world: "haven", site: "havencity", title: "Haven holds out", text: "The Darells and the psychologist Ebling Mis flee to Haven, the last Trader world resisting. Its will collapses as the others did."},
  {id: "f2i", book: 2, world: "neotrantor", site: "court", title: "The last Emperor", text: "They pass through Neotrantor, where Dagobert IX keeps a shadow court. The Emperor’s son tries to take Bayta, and is found dead."},
  {id: "f2j", book: 2, world: "trantor", site: "library", title: "Ebling Mis and the Library", text: "In the ruins of the sacked capital, Mis works feverishly to find the Second Foundation, as if something drives him."},
  {id: "f2k", book: 2, world: "trantor", site: "library", title: "Bayta fires", text: "As Mis is about to say where the Second Foundation is, Bayta shoots him. She has realised Magnifico is the Mule, who has been steering everyone toward the Second Foundation."},

  /* ---------- III · Second Foundation ---------- */
  {id: "f3a", book: 3, world: "kalgan", site: "mulepalace", title: "The Mule’s search", text: "Five years into his reign the Mule sends Han Pritcher, his convert, and Bail Channis, an unconverted man, to look for the Second Foundation."},
  {id: "f3b", book: 3, world: "rossem", site: "rossemvillage", title: "Star’s End", text: "Channis leads them to Rossem, under Tazenda, claiming that Tazenda is the Star’s End of Seldon’s riddle."},
  {id: "f3c", book: 3, world: "tazenda", title: "Tazenda destroyed", text: "The Mule reveals he followed them and has destroyed Tazenda. He breaks Channis, who confesses he is a Second Foundationer."},
  {id: "f3d", book: 3, world: "rossem", site: "rossemvillage", title: "The First Speaker", text: "The First Speaker appears: it was a trap, and Channis’s memories were false. The Mule’s mind is changed, and he returns to Kalgan to rule in peace until his death."},
  {id: "f3e", book: 3, world: "terminus", site: "darell", title: "The conspirators", text: "Around 376 F.E. Dr. Toran Darell and his friends fear the Second Foundation is steering them. His fourteen-year-old daughter Arkady listens in."},
  {id: "f3f", book: 3, world: "kalgan", site: "mulepalace", title: "Arkady on Kalgan", text: "Arkady stows away with Homir Munn to Kalgan. Lord Stettin wants her, and she escapes with help from his mistress Lady Callia."},
  {id: "f3g", book: 3, world: "trantor", site: "hamish", title: "The Palvers", text: "The farmer Preem Palver and his wife hide Arkady and take her home to Trantor, as Stettin goes to war with the Foundation."},
  {id: "f3h0", book: 3, world: "ifni", title: "Kalgan strikes first", text: "Stettin’s fleets win the opening battles, and the Foundation’s morale sinks."},
  {id: "f3h", book: 3, world: "quoriston", title: "Battle of Quoriston", text: "In 377 F.E. the Foundation’s Third Fleet routs Kalgan’s main fleet, and Stettin’s war collapses."},
  {id: "f3i", book: 3, world: "terminus", site: "darell", title: "A circle has no end", text: "Arkady sends word that the Second Foundation is at the other end of the Galaxy, which, on a circle, is Terminus. Dr. Darell’s mind-static unmasks Pelleas Anthor, and then a nest of Second Foundationers on Terminus."},
  {id: "f3j", book: 3, world: "trantor", site: "hamish", title: "The real Star’s End", text: "The captured Second Foundationers were sacrifices. The Second Foundation is on Trantor, where all roads end, and its First Speaker is Preem Palver."},

  /* ---------- IV · Foundation's Edge ---------- */
  {id: "f4a", book: 4, world: "terminus", site: "vault", title: "A crisis resolved", text: "In 498 F.E. Seldon appears again in the Time Vault and Mayor Harla Branno is vindicated. Councilman Golan Trevize says the Plan works too well: the Second Foundation must still exist."},
  {id: "f4b", book: 4, world: "terminus", site: "cityhall", title: "Exiled with a scholar", text: "Branno arrests Trevize and sends him off in the Far Star with the historian Janov Pelorat, who wants to find Earth, as bait for the Second Foundation."},
  {id: "f4c", book: 4, world: "trantor", site: "speakers", title: "Gendibal and the anti-Mules", text: "On Trantor Speaker Stor Gendibal finds a Hamish woman, Sura Novi, whose mind has been touched by someone more skilled than any Speaker. He sets out after Trevize, with Novi."},
  {id: "f4d", book: 4, world: "sayshell", site: "sayuni", title: "Sayshell", text: "Trevize and Pelorat land on Sayshell, meet Munn Li Compor and learn from the historian Quintesetz of Gaia, a world the Sayshellians fear."},
  {id: "f4e", book: 4, world: "gaia", site: "dom", title: "Gaia", text: "Gaia captures the Far Star. Trevize and Pelorat meet Bliss and Dom and learn what Gaia is."},
  {id: "f4f", book: 4, world: "gaia", site: "gaiaport", title: "Trevize chooses", text: "Branno’s warship and Gendibal meet above Gaia in deadlock; Novi is Gaia. Trevize, whose intuition is never wrong, must choose the future, and chooses Galaxia."},
  {id: "f4g", book: 4, world: "earth", title: "Where is Earth?", text: "Trevize is left with one question: why has every reference to Earth been removed from the Galactic Library? Gaia says it was not them."},

  /* ---------- V · Foundation and Earth ---------- */
  {id: "f5a", book: 5, world: "gaia", site: "gaiaport", title: "The search for Earth", text: "In 499 F.E. Trevize, Pelorat and Bliss leave Gaia in the Far Star to find Earth and test the choice."},
  {id: "f5b", book: 5, world: "comporellon", site: "compcity", title: "Comporellon", text: "Comporellon tries to take their ship. Trevize charms Minister Lizalor, and Deniador gives them the positions of three forbidden worlds."},
  {id: "f5c", book: 5, world: "aurora", site: "ruins", title: "Aurora’s dogs", text: "The first Spacer world is empty, and its dogs have gone wild."},
  {id: "f5d", book: 5, world: "solaria", site: "bander", title: "Solaria and Fallom", text: "Sarton Bander intends to kill them. Bliss acts and he dies; they rescue his child Fallom, who would otherwise be destroyed."},
  {id: "f5e", book: 5, world: "melpomenia", site: "plaque", title: "Fifty worlds", text: "On an airless world they find the list of all fifty Spacer worlds. Plotted in space, they point to the centre, and to Earth."},
  {id: "f5f", book: 5, world: "alpha", site: "newearth", title: "New Earth", text: "The friendly islanders of Alpha plan to kill them with a disease. Hiroko warns them away."},
  {id: "f5g", book: 5, world: "earth", site: "dead", title: "Earth found", text: "Earth is radioactive and dead. But its moon is very large."},
  {id: "f5h", book: 5, world: "moon", site: "base", title: "Daneel", text: "Under the Moon waits R. Daneel Olivaw, who has watched humanity for twenty thousand years and set up Gaia and psychohistory. He is dying, and Fallom is his answer."},
  {id: "f5i", book: 5, world: "moon", site: "base", title: "Galaxia confirmed", text: "Trevize understands why he chose Gaia: a united Galaxy could face whatever might come from outside it. Then he looks at Fallom, uneasy."},

  /* ---------- VI · Prelude to Foundation ---------- */
  {id: "f6a", book: 6, world: "helicon", title: "From Helicon to Trantor", text: "In 12,020 G.E. a young Heliconian mathematician reads a paper on psychohistory at the Decennial Convention on Trantor."},
  {id: "f6b", book: 6, world: "trantor", site: "palace", title: "An audience with Cleon I", text: "The Emperor wants predictions he can use. Seldon says the theory is not practical, and is let go."},
  {id: "f6c", book: 6, world: "trantor", site: "streeling", title: "Hummin and Dors", text: "A journalist, Chetter Hummin, warns that First Minister Demerzel is hunting him, and hides him at Streeling University with Dors Venabili."},
  {id: "f6d", book: 6, world: "trantor", site: "upperside", title: "Lost Upperside", text: "Seldon climbs out onto the domes, is left behind in a storm, and nearly dies before Dors finds him."},
  {id: "f6e", book: 6, world: "trantor", site: "mycogen", title: "Mycogen", text: "In bald-headed Mycogen, the sisters Raindrop Forty-Three and Forty-Five help Seldon read the sector’s Book of history, and its lost home, Aurora."},
  {id: "f6f", book: 6, world: "trantor", site: "sacratorium", title: "The Sacratorium", text: "Seldon and Dors break into Mycogen’s temple seeking a robot and are caught. Hummin gets them out."},
  {id: "f6g", book: 6, world: "trantor", site: "dahl", title: "The heat sinks", text: "In Dahl they meet Yugo Amaryl, a heat-sinker with a gift for mathematics."},
  {id: "f6h", book: 6, world: "trantor", site: "billibotton", title: "Raych and Mother Rittah", text: "In Billibotton a street boy, Raych, guides them, and an old woman tells Seldon of Earth and of Aurora, Earth’s enemy."},
  {id: "f6i", book: 6, world: "trantor", site: "wye", title: "Rashelle’s coup", text: "Wye kidnaps Seldon to lend Rashelle’s coup the weight of psychohistory. Demerzel’s forces end it."},
  {id: "f6j", book: 6, world: "trantor", site: "streeling", title: "Hummin unmasked", text: "Seldon works out that Hummin and Demerzel are one person, the robot Daneel. Trantor itself will be his model for psychohistory."},

  /* ---------- VII · Forward the Foundation ---------- */
  {id: "f7a", book: 7, world: "trantor", site: "palace", title: "Joranum", text: "In 12,028 G.E. the populist Laskin Joranum threatens Demerzel. Seldon unmasks Joranum’s past instead; Demerzel retires and Seldon becomes First Minister."},
  {id: "f7b", book: 7, world: "trantor", site: "mycogen", title: "Joranum’s secret", text: "Joranum turns out to be Mycogenian, and his movement falls apart."},
  {id: "f7c", book: 7, world: "trantor", site: "palace", title: "The Emperor killed", text: "Around 12,038 G.E. a plot through Wye and a drugged Raych is foiled by Manella Dubanqua, but in the confusion a gardener kills Cleon I. A military junta takes over."},
  {id: "f7d", book: 7, world: "trantor", site: "streeling", title: "Dors destroyed", text: "A member of Seldon’s own project, convinced Dors is a robot, attacks her with a device. She kills him and dies in Seldon’s arms."},
  {id: "f7e", book: 7, world: "santanni", site: "santuni", title: "Raych falls", text: "Raych dies on Santanni during its revolt. The ship carrying Manella and Bellis away is lost."},
  {id: "f7f", book: 7, world: "trantor", site: "library", title: "Wanda and the mentalics", text: "Seldon’s granddaughter Wanda can read minds. With her and Stettin Palver he gathers mentalics, the hidden Second Foundation, inside the Galactic Library."},
  {id: "f7g", book: 7, world: "terminus", title: "Terminus chosen", text: "The Encyclopedia project gives Seldon his public Foundation, bound for a remote, empty world at the edge of the Galaxy, while the Commission rules behind a powerless Emperor."},
  {id: "f7h", book: 7, world: "trantor", site: "streeling", title: "Seldon’s death", text: "In 12,069 G.E. (1 F.E.) Seldon dies at his desk, both Foundations set in motion."}
  ],

  codex: [
  {id: "powers", title: "Powers", list: [
    {name: "The Galactic Empire", first: 1, desc: "Twelve thousand years old, twenty-five million inhabited worlds, ruled from Trantor. Seldon sees it is already dying.", more: [[2, "By the Mule’s time Trantor has been sacked and the Empire is a few farm worlds around Neotrantor."], [6, "The prequels show it at its height under Cleon I, with Demerzel as First Minister."]]},
    {name: "The Foundation", first: 1, desc: "Seldon’s colony of scientists on Terminus, nominally writing the Encyclopedia Galactica, really the seed of a second Empire. It grows through atomic power, a religion of science, and then trade.", more: [[2, "Under the Indburs it hardens into a hereditary dictatorship and falls to the Mule."], [3, "Free again after the Mule, it wins the Kalgan war."], [4, "By 498 F.E. it is the Foundation Federation, the greatest power in the Galaxy."]]},
    {name: "The Four Kingdoms", first: 1, desc: "Anacreon, Smyrno, Konom and Daribow, which break away from the Empire around Terminus. Hardin plays them against each other; by 80 F.E. they depend on the Foundation’s priests."},
    {name: "The Commission of Public Safety", first: 1, desc: "The oligarchy that truly rules Trantor in Seldon’s last years, led by Linge Chen. It sends the Foundation to Terminus.", more: [[7, "Forward shows it taking power behind a puppet Emperor."]]},
    {name: "The Traders", first: 1, desc: "The Foundation’s traders carry its goods and its religion out into the Periphery. Master Traders such as Ponyets and Mallow make trade the Foundation’s real power.", more: [[2, "The Independent Trading Worlds, such as Haven, resist the hereditary mayors of Terminus, and fight the Mule longest."]]},
    {name: "The Merchant Princes", first: 1, desc: "After Mallow, rich traders become the Foundation’s ruling class."},
    {name: "The Second Foundation", first: 2, desc: "Seldon is said to have set up a second Foundation at the other end of the Galaxy, and left no record of where. Ebling Mis looks for it, and the Mule fears it.", more: [ [3, "A secret society of mentalics and psychohistorians guarding the Plan. It traps the Mule, then makes the Foundation think it has been destroyed. It is on Trantor."], [4, "Its Speakers meet in the old university on Trantor. Gendibal finds that something stronger is manipulating them."]]},
    {name: "The Union of Worlds", first: 2, desc: "The Mule’s empire, ruled from Kalgan.", more: [[3, "After his death it shrinks; Stettin’s war breaks what is left."]]},
    {name: "Kalgan", first: 2, desc: "A pleasure world that becomes the seat of a warlord, the Mule, and then Lord Stettin."},
    {name: "The Sayshell Union", first: 4, desc: "Eighty-six worlds that have never been conquered, surrounded by the Foundation Federation."},
    {name: "Gaia", first: 4, desc: "A world that is a single living mind made of every person, creature and stone on it. It wants to grow into Galaxia.", more: [[5, "It was founded with the help of robots, and Daneel Olivaw."]]},
    {name: "The Spacers", first: 5, desc: "The first wave of settlers from Earth, long-lived and served by robots. Their fifty worlds are now empty or, in Solaria’s case, nearly so."},
    {name: "Mycogen", first: 6, desc: "A closed sector of Trantor that remembers its ancestors came from Aurora."},
    {name: "Wye", first: 6, desc: "A rich Trantorian sector whose mayors claim the throne.", more: [[7, "Wye money is still behind the plot that kills Cleon I."]]}
  ]},
  {id: "people", title: "People", list: [
    {name: "Hari Seldon", role: "Psychohistorian", books: [1, 2, 4, 6, 7], first: 1, desc: "The mathematician who invents psychohistory, predicts the fall of the Empire, and sets up the Foundations. He dies in 1 F.E., but his recorded image appears in the Vault at each crisis.", more: [[6, "Prelude shows him young, newly arrived from Helicon, running across Trantor."], [7, "He serves as First Minister, loses Dors, Raych and Yugo, and dies alone."]]},
    {name: "Gaal Dornick", role: "Mathematician", books: [1], desc: "A young recruit from Synnax who sees Seldon’s trial, and whose view opens the series."},
    {name: "Linge Chen", role: "Chief Commissioner", books: [1], desc: "The real ruler of Trantor at Seldon’s trial."},
    {name: "Salvor Hardin", role: "First mayor of Terminus", books: [1], desc: "The politician who takes the Foundation from the Encyclopedists and wins its first two crises without firing a shot."},
    {name: "Yohan Lee", role: "Hardin’s ally", books: [1], desc: "Hardin’s blunt partner in the coup of 50 F.E."},
    {name: "Wienis", role: "Prince Regent of Anacreon", books: [1], desc: "Anacreon’s regent, who tries to take Terminus by force in 80 F.E.", more: [[1, "He dies by his own blaster."]]},
    {name: "Limmar Ponyets", role: "Master Trader", books: [1], desc: "The trader who opens Askone with a transmuter and blackmail."},
    {name: "Hober Mallow", role: "Master Trader · mayor", books: [1], desc: "A Smyrnian trader who settles the Korell crisis with trade and becomes the first Merchant Prince."},
    {name: "Onum Barr", role: "Patrician of Siwenna", books: [1], desc: "An old man who tells Mallow how the Empire has failed his world."},
    {name: "Asper Argo", role: "Commdor of Korell", books: [1], desc: "Korell’s ruler, who arms himself with the Empire’s help and learns he cannot do without the Foundation."},
    {name: "Bel Riose", role: "Imperial general", books: [2], desc: "The Empire’s last great general, who believes in the Foundation’s threat and marches on it.", more: [[2, "Cleon II recalls him and has him executed."]]},
    {name: "Ducem Barr", role: "Siwennese patrician", books: [2], desc: "Onum Barr’s son, forced to advise Riose, who escapes to Trantor with Lathan Devers."},
    {name: "Lathan Devers", role: "Trader", books: [2], desc: "A rough-edged trader who gets himself captured to spy on Riose."},
    {name: "Cleon II", role: "Emperor", books: [2], desc: "The last strong Emperor, sick and suspicious."},
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
    {name: "Mother Rittah", role: "Billibotton seer", books: [6], desc: "An old woman who tells legends of Earth."},
    {name: "Laskin Joranum", role: "Populist", books: [7], desc: "A politician who rouses Trantor against Demerzel."},
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
    {name: "Heat sinks", first: 6, desc: "Dahl’s deep shafts that tap Trantor’s inner heat for power."},
    {name: "Twisting", first: 6, desc: "Helicon’s martial art. Seldon uses it."}
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

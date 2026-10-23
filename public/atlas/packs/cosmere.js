/* The Cosmere Atlas: data pack for the shared galactic atlas engine (schema: ../PACK_FORMAT.md, v1).
   Series: Brandon Sanderson's Cosmere, 2005–2026 (Elantris to The Fires of December).

   SOURCES (all text below is paraphrased in our own words):
   - The Coppermind (coppermind.net): Physical Realm, Canticle, Lumar, Kilahito, Komashi (it.coppermind.net),
     Nomad, Retribution, Miral, The Fires of December, Isles of the Emberdark, and the per-book pages.
   - Wikipedia: Wind and Truth (plot), and the plot articles for the earlier novels.
   - 17th Shard forum notes on the Arcanum Unbounded star chart (which systems it shows; the author has
     said only that it is drawn "from a frame of reference" he has not revealed).
   - Publisher and news pages for release dates (The Fires of December: ebook 6 Oct 2026, Tor print 8 Dec 2026).

   LAYOUT (important):
   - The books never give a star map with distances. The Coppermind describes the Cosmere as a large star
     cluster inside a dwarf galaxy, or possibly a galaxy of its own. The spiral drawn behind the cluster is
     the engine's stand-in galaxy, NOT a claim that the Cosmere is the Milky Way.
   - Every system is placed SCHEMATICALLY on rings around Yolen (the world where Adonalsium was shattered),
     roughly 600–1,700 light-years out. Every world says so in its distance line.
   - The Cognitive Realm places (Shadesmar, Silverlight, the Emberdark) float above the disc.
   - Surface sites on Roshar, Scadrial, Sel and Nalthis are laid out by eye from the maps printed in the
     books; every other surface is a generated interpretation. */
(function () {
  "use strict";
  var SOL = [0, 27.14];                       /* engine default "Sol" point: used here as the cluster centre (Yolen) */
  var D2R = Math.PI / 180;
  function orb(r, deg, h) {
    return [+(SOL[0] + r * Math.sin(deg * D2R) / 10).toFixed(4),
            +(SOL[1] + r * Math.cos(deg * D2R) / 10).toFixed(4),
            +((h || 0) / 10).toFixed(4)];
  }
  function near(base, r, deg, h) {
    return [+(base[0] + r * Math.sin(deg * D2R) / 10).toFixed(4),
            +(base[1] + r * Math.cos(deg * D2R) / 10).toFixed(4),
            +((base[2] || 0) + (h || 0) / 10).toFixed(4)];
  }
  /* schematic positions (scene units of 100 ly from Yolen); estimated, none given in the books */
  var P = {
    yolen: orb(0, 0, 0),
    sel: orb(7, 300, .6), nalthis: orb(8, 350, -.5), scadrial: orb(9, 40, .4),
    roshar: orb(11, 110, -.3), taldain: orb(10, 170, .7), threnody: orb(12, 215, -.6),
    firstsun: orb(8.5, 250, .3), lumar: orb(14, 75, .9), komashi: orb(13, 145, -.8),
    canticle: orb(15, 15, -.4), miral: orb(17, 280, 1.1)
  };
  P.ashyn = near(P.roshar, .5, 200, .05); P.braize = near(P.roshar, .9, 40, -.08);
  /* the Cognitive Realm: above the disc */
  P.shadesmar = [P.roshar[0], P.roshar[1], .38];
  P.emberdark = [P.firstsun[0], P.firstsun[1], .36];
  P.silverlight = [SOL[0], SOL[1], .62];

  var SCHEM = "Position schematic: the books give no star distances";
  var COG = "In the Cognitive Realm, drawn above the cluster";

  var BOOKC = {1: "#8fc1e8", 2: "#c9a36a", 3: "#e66fb0", 4: "#6fa2ff", 5: "#7fd6c2", 6: "#d9b04a",
               7: "#b89cf2", 8: "#ff9a62", 9: "#9be07a", 10: "#c7c2b8", 11: "#5fd0e8", 12: "#f0e6ff"};

  var PACK = {
    id: "cosmere",
    meta: {
      title: "The Cosmere Atlas",
      series: "The Cosmere",
      author: "Brandon Sanderson",
      years: "2005–2026",
      tagline: "One shattered god, sixteen Shards &amp; the <b>worlds they touched</b>",
      splash: "Long ago a god was broken into sixteen pieces. Each piece took a world, and every world grew its own kind of magic.",
      credits: "Fan-made atlas of Brandon Sanderson’s <i>Cosmere</i>. Star positions are schematic; surfaces are interpretations.",
      canvasLabel: "Three-dimensional schematic map of the Cosmere star cluster and its worlds",
      srcnote: "A fan-made atlas. Sources: The Coppermind, Wikipedia plot articles and the maps printed in the books. The books give no star distances, so every system is placed schematically around Yolen. Surfaces are generated interpretations.",
      sources: ["https://coppermind.net/wiki/Physical_Realm", "https://coppermind.net/wiki/Canticle", "https://coppermind.net/wiki/Lumar",
        "https://coppermind.net/wiki/Kilahito", "https://it.coppermind.net/wiki/Komashi", "https://coppermind.net/wiki/Nomad",
        "https://coppermind.net/wiki/Retribution", "https://coppermind.net/wiki/Miral", "https://coppermind.net/wiki/The_Fires_of_December",
        "https://coppermind.net/wiki/Isles_of_the_Emberdark", "https://en.wikipedia.org/wiki/Wind_and_Truth",
        "https://www.17thshard.com/forums/topic/61528-from-where-are-we-seeing-the-arcanum-unbounded-constellations/"]
    },

    theme: {
      void: "#06050b", deep: "#0e0b1a", panel: "rgba(13,10,24,.88)",
      accent: "#8a6fe8", accentHi: "#c9b8ff", accentLo: "#3d2f78",
      chrome: "#ece8f6", ember: "#ff6a5a", amber: "#f0c060",
      text: "#e2deee", muted: "#9a93b2", faint: "#615a7a",
      line: "rgba(201,184,255,.16)", lineStrong: "rgba(201,184,255,.48)",
      chromeGrad: "linear-gradient(180deg,#ffffff 0%,#d9ccff 42%,#7a5fd0 68%,#efe8ff 100%)",
      chromeStops: [[0, "#ffffff"], [.42, "#d9ccff"], [.68, "#7a5fd0"], [1, "#efe8ff"]],
      panelRgb: "18,14,32", panelRgb2: "8,6,15", insetRgb: "220,205,255", btnRgb: "13,10,24", ink: "#0a0814",
      glowRgb: "150,120,255", hiRgb: "138,111,232", swRgb: "201,184,255", pipRgb: "201,184,255",
      title: "#f5f2fc", title2: "#f5f2fc", title3: "#f5f2fc", shadeRgb: "7,5,14", tip1: "#1a1530", tip2: "#09070f",
      voidRgb: "6,5,11", codexRgb: "3,2,7", splashGlow: "#1a1236", brandSpacing: ".14em",
      selRing: "#c9b8ff", hoverRing: "#ece8f6",
      /* our own mark: a broken ring of sixteen beads around a bright point */
      sigil: '<circle cx="24" cy="24" r="3.4" fill="url(#cg)"/>' +
        (function () { var s = ""; for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8; s += '<circle cx="' + (24 + 17 * Math.sin(a)).toFixed(2) + '" cy="' + (24 - 17 * Math.cos(a)).toFixed(2) + '" r="' + (i % 4 ? 1.3 : 2.1) + '" fill="url(#cg)"/>'; } return s; })() +
        '<circle cx="24" cy="24" r="10" fill="none" stroke="url(#cg)" stroke-width=".7" stroke-dasharray="4 2.3"/>'
    },

    books: {
      1: {n: "I", title: "Elantris", y: 2005, c: BOOKC[1]},
      2: {n: "II", title: "Mistborn: the first trilogy", y: 2006, c: BOOKC[2]},
      3: {n: "III", title: "Warbreaker", y: 2009, c: BOOKC[3]},
      4: {n: "IV", title: "The Way of Kings", y: 2010, c: BOOKC[4], ink: "#fff"},
      5: {n: "V", title: "Words of Radiance", y: 2014, c: BOOKC[5]},
      6: {n: "VI", title: "Mistborn: Wax & Wayne I–III", y: 2011, c: BOOKC[6]},
      7: {n: "VII", title: "Arcanum Unbounded (with White Sand)", y: 2016, c: BOOKC[7]},
      8: {n: "VIII", title: "Oathbringer & Dawnshard", y: 2017, c: BOOKC[8]},
      9: {n: "IX", title: "Rhythm of War", y: 2020, c: BOOKC[9]},
      10: {n: "X", title: "The Lost Metal", y: 2022, c: BOOKC[10]},
      11: {n: "XI", title: "Tress, Yumi & The Sunlit Man", y: 2023, c: BOOKC[11]},
      12: {n: "XII", title: "Wind and Truth, Isles of the Emberdark & The Fires of December", y: 2024, c: BOOKC[12]}
    },
    spoilers: {mode: "cumulative"},

    ui: {
      indexTitle: "Worlds of the Cosmere",
      homeButton: "Cluster",
      homeAction: "Fly to the cluster",
      homeLink: "Back to the cluster",
      homeCrumb: "The cluster",
      galaxyCrumb: "The galaxy",
      go: {id: "roshar", label: "Go to Roshar"},
      bookLabel: "Read through",
      allTitle: "Everything through The Fires of December, with spoilers",
      hints: {
        galaxy: "Drag to turn · scroll to zoom · click a world",
        galaxyMob: "Drag to turn · pinch to zoom · tap a world",
        world: "Drag to turn the world · scroll to zoom · click a named place",
        worldMob: "Drag to turn · pinch to zoom · tap a named place"
      }
    },

    intro: {
      text: "Before history began, a being called Adonalsium was shattered on the world of Yolen into sixteen Shards, each holding one aspect of its power: Honor, Ruin, Devotion and the rest. The Shards scattered across a cluster of stars. Where a Shard settled, it shaped the land and gave its people a magic of their own, so every world in these books plays by different rules. A few travellers, above all the storyteller Hoid, move between them. The books are written to stand alone; together they tell one larger story heading toward a space age.",
      legend: [
        ["Galaxy", "A stand-in. The books have not said which galaxy the Cosmere is in"],
        ["Cluster", "Systems placed schematically around Yolen: the books give no distances"],
        ["Above the disc", "Places in the Cognitive Realm: Shadesmar, Silverlight and the Emberdark"],
        ["Coloured lines", "Worldhopping: people and powers crossing between worlds, in the book where it happens"],
        ["Book buttons", "Pick where you are in the reading order. Later worlds, events and people stay hidden"]
      ]
    },

    groups: [
      {id: "origin", name: "The world of the Shattering", chip: {border: "rgba(240,230,255,.55)", color: "#f0e6ff"}},
      {id: "rosharan", name: "The Rosharan system", chip: {border: "rgba(111,162,255,.6)", color: "#a8c6ff"}, flyDist: 9},
      {id: "scadrian", name: "The Scadrian system", chip: {border: "rgba(201,163,106,.6)", color: "#e2c08a"}},
      {id: "selish", name: "The Selish system", chip: {border: "rgba(143,193,232,.6)", color: "#b6dbf4"}},
      {id: "nalthian", name: "The Nalthian system", chip: {border: "rgba(230,111,176,.6)", color: "#f4a6cf"}},
      {id: "shardworlds", name: "Other Shardworlds", chip: {border: "rgba(184,156,242,.6)", color: "#d2c0fa"}},
      {id: "wider", name: "The wider cosmere", chip: {border: "rgba(95,208,232,.6)", color: "#9ce6f4"}},
      {id: "cognitive", name: "The Cognitive Realm", chip: {border: "rgba(200,180,255,.6)", color: "#ddd0ff"}, flyDist: 10}
    ],

    worlds: [
      /* ============================ YOLEN ============================ */
      {id: "yolen", name: "Yolen", group: "origin", books: [7, 12], first: 7, major: true, status: "Where Adonalsium was shattered",
       star: {name: "Yolen’s sun", col: "#fff4e0"}, map: P.yolen, distText: "Centre of the drawing · " + SCHEM, est: true,
       blurb: "The world where it all began. Humans, dragons and the strange Sho Del all came from Yolen, and it was here, long before any of the books, that a group of conspirators shattered Adonalsium into sixteen Shards. Hoid and Khriss are among the few people who remember it. The books have barely shown the planet itself; this surface is an interpretation.",
       short: "Origin of humanity and of the Shattering.",
       eras: {12: {blurb: "The world where it all began. Humans, dragons and the Sho Del all came from Yolen, and it was here that Adonalsium was shattered into sixteen Shards. In Isles of the Emberdark, Starling, a young dragon living in human form, was exiled from Yolen twelve years before the story. The planet itself is still barely described; this surface is an interpretation."}},
       facts: [["Known for", "The Shattering of Adonalsium"], ["Peoples", "Humans, dragons, Sho Del"], ["On the page", "Mostly in essays and backstory"]],
       gfx: {type: "forest", sea: .5, freq: 1.4, pal: ["#0b1d3a", "#2a5f8a", "#2f5a2e", "#4d7a3a", "#7c7a64", "#eef0f2"],
             clouds: .4, atmo: "#9ec4ff", moist: .2, sw: "#9cc28a"},
       sites: [{id: "shattering", name: "The Shattering (site unknown)", lat: 12, lon: 20, desc: "Somewhere on Yolen the conspirators struck down Adonalsium. The exact place has never been shown; this marker is ours."}]},

      /* ============================ ROSHAR ============================ */
      {id: "roshar", name: "Roshar", group: "rosharan", books: [4, 5, 7, 8, 9, 12], first: 4, major: true, status: "Shardworld of Honor, Cultivation and Odium",
       star: {name: "Roshar’s sun", col: "#fff1d8"}, map: P.roshar, est: true, hero: "shatteredplains", view: 4.2,
       blurb: "A world of stone and wind scoured by highstorms that roll in from the east every few days. Plants pull into the rock when the storm comes, animals carry shells, and spheres left out in a storm fill with Stormlight. The Alethi princes fight an endless war on the Shattered Plains against the Parshendi, while old stories speak of Desolations and of the Knights Radiant who once held them back.",
       short: "The storm world of the Stormlight Archive.",
       eras: {
         5: {status: "Shardworld of Honor, Cultivation and Odium · the Everstorm"},
         8: {blurb: "A world of stone and wind scoured by highstorms from the east, and now by the Everstorm blowing the other way. The Knights Radiant have returned, the singers have woken, and Odium’s Fused are back from Braize. Dalinar Kholin tries to hold a coalition of nations together through the True Desolation."},
         12: {status: "Retribution’s world · cut off in slowed time",
              blurb: "Dalinar challenged Odium to a contest of champions and, holding Honor’s power at the end, renounced it. Odium took Honor’s power into his own and became Retribution, killed the Stormfather, drew all Stormlight from the world and turned the highstorm into a planet-wide Everstorm. Time on Roshar has slowed, so about a decade there passes for decades elsewhere. Only Azir is spared the storm.",
              gfx: {clouds: .7, cloudCol: "#4a3540", atmo: "#c04a48", lights: .15}}
       },
       facts: [["Shards", "Honor, Cultivation, Odium"], ["Moons", "Salas, Nomon, Mishim"], ["Magic", "Surgebinding, Soulcasting, fabrials"], ["Storms", "Highstorms from the east"]],
       moons: [{name: "Salas", size: .14, dist: 2.7, speed: .06}, {name: "Nomon", size: .2, dist: 3.5, speed: .045}, {name: "Mishim", size: .12, dist: 4.3, speed: .035}],
       gfx: {type: "terran", sea: .58, freq: 1.2, warp: .5, rough: .8, ice: 82,
             pal: ["#0a1e36", "#2c5f7c", "#7e6e56", "#6a7444", "#8e8070", "#e6e2da"],
             clouds: .38, cloudScale: 1.8, atmo: "#86b0ff", lights: .3, sw: "#8a7c66",
             feat: [
               {k: "continent", at: [22, -40], r: 40, s: .3},
               {k: "continent", at: [-8, 5], r: 36, s: .28},
               {k: "continent", at: [5, 40], r: 26, s: .26},
               {k: "continent", at: [26, -100], r: 18, s: .26},
               {k: "range", from: [36, -94], to: [6, -92], w: 3, s: .32},
               {k: "biome", at: [24, -108], r: 13, s: 1, style: "grass", c: "#5f9a3e"},
               {k: "range", from: [24, 2], to: [6, 14], w: 2.5, s: .26},
               {k: "biome", at: [8, 26], r: 8, s: .9, style: "rock", c: "#7a6248"},
               {k: "basin", at: [-12, -86], r: 4, s: .2},
               {k: "biome", at: [-30, 28], r: 12, s: .8, style: "snow", c: "#cfd6dc"},
               {k: "continent", at: [-38, 18], r: 10, s: .22},
               {k: "biome", at: [4, -64], r: 12, s: .7, style: "rock", c: "#a08860"}
             ]},
       sites: [
         {id: "kholinar", name: "Kholinar", lat: 30, lon: -28, books: [4, 8, 12], desc: "Capital of Alethkar, a city built among rock fins carved by the storms. Gavilar Kholin was murdered in his palace here, and in Oathbringer the city falls to the singers."},
         {id: "shatteredplains", name: "The Shattered Plains", lat: 8, lon: 24, books: [4, 5, 8, 9, 12], desc: "A vast plateau cracked into islands of rock by deep chasms, where the Alethi warcamps hunt chasmfiends for gemhearts. Kaladin carries bridges here as a slave."},
         {id: "narak", name: "Narak", rel: {to: "shatteredplains", dlat: 0, dlon: 8}, books: [5, 8, 9], desc: "The ruined city at the centre of the Shattered Plains, the Parshendi stronghold, once called Stormseat."},
         {id: "tower", name: "The Tower", rel: {to: "shatteredplains", dlat: 6, dlon: 5}, books: [4], desc: "A huge plateau where Sadeas abandons Dalinar’s army and Kaladin’s bridge crew turns back to save it."},
         {id: "urithiru", name: "Urithiru", lat: 6, lon: 4, books: [5, 8, 9, 12], desc: "The tower city of the ancient Knights Radiant, high in the mountains and reached through the Oathgates. Rediscovered by Shallan, it becomes the coalition’s seat."},
         {id: "kharbranth", name: "Kharbranth", lat: -26, lon: -14, books: [4, 8, 12], desc: "A city-state of bells and hospitals climbing a coastal cleft, home to the Palanaeum library, where Shallan finds Jasnah. Its king is Taravangian."},
         {id: "thaylen", name: "Thaylen City", lat: -32, lon: 18, sea: true, books: [8, 12], desc: "The trading capital of Thaylenah, built in tiers up an island cliff. Its Oathgate makes it a prize in the war."},
         {id: "azimir", name: "Azimir", lat: -2, lon: -70, books: [7, 8, 12], desc: "Capital of Azir, a land run by scribes and paperwork under an emperor called the Prime Aqasix. Sigzil comes from here."},
         {id: "yeddaw", name: "Yeddaw", lat: -8, lon: -58, books: [7], desc: "A Tashikki city cut down into the rock, where Lift takes on the Herald Nale in Edgedancer."},
         {id: "vedenar", name: "Vedenar", lat: -20, lon: -46, books: [5, 8], desc: "Capital of Jah Keved, torn by succession war. Shallan grew up in the Veden countryside."},
         {id: "shinovar", name: "Shinovar", lat: 24, lon: -108, books: [4, 12], desc: "The only lands sheltered from the storms, behind the Misty Mountains, where grass stays still and the Shin forbid walking on stone. Szeth’s homeland."},
         {id: "purelake", name: "The Purelake", lat: -12, lon: -86, sea: true, books: [4], desc: "A warm, ankle-deep lake the size of a country, glimpsed in the interludes."},
         {id: "frostlands", name: "The Frostlands", lat: -30, lon: 28, books: [4, 5], desc: "Cold, thinly settled lands south of the Shattered Plains."},
         {id: "hearthstone", name: "Hearthstone", lat: 18, lon: -10, books: [4], desc: "Kaladin’s small home town, where his father was the surgeon."},
         {id: "akinah", name: "Akinah", lat: 38, lon: -70, books: [8], desc: "A lost island nation sealed by storms, sought by the expedition in Dawnshard."},
         {id: "origin", name: "The Origin", lat: 0, lon: 70, sea: true, books: [4], desc: "Far to the east, where the highstorms are born. No one has seen it and come back to say much."}
       ]},

      {id: "ashyn", name: "Ashyn", group: "rosharan", books: [8, 12], first: 8, status: "Inner world of the Rosharan system",
       star: {name: "Roshar’s sun", col: "#fff1d8"}, map: P.ashyn, est: true,
       blurb: "The world humans came from before they fled to Roshar. Its people misused their magic and wrecked their own planet, and survivors arrived on Roshar as refugees, which is the root of the long war with the singers. People still live on Ashyn, but much of it is hostile.",
       short: "Humanity’s ruined world before Roshar.",
       facts: [["Revealed", "Oathbringer"], ["Fate", "Largely ruined by misused magic"]],
       gfx: {type: "barren", sea: .3, pal: ["#3a2a20", "#5a4030", "#6a5a48", "#7a6a50", "#9a8a70", "#d8d0c0"],
             clouds: .25, cloudCol: "#d8c8b0", atmo: "#d8b080", atmoK: .7, sw: "#9a8a70"}},

      {id: "braize", name: "Braize", aka: ["Damnation"], group: "rosharan", books: [5, 8, 9], first: 5, status: "Odium’s prison world",
       star: {name: "Roshar’s sun", col: "#fff1d8"}, map: P.braize, est: true,
       blurb: "The outer, frozen planet of Roshar’s system, which the Rosharans call Damnation. The souls of the Fused were bound here with Odium, and the Heralds were sent back again and again to be tortured here between Desolations.",
       short: "Damnation: where the Heralds were tormented.",
       facts: [["Rosharan name", "Damnation"], ["Bound here", "Odium and the Fused"]],
       gfx: {type: "ice", sea: .2, pal: ["#20242c", "#383e4a", "#5a6070", "#6a7080", "#8890a0", "#d8dce4"],
             clouds: .1, atmo: "#a0a8c0", atmoK: .4, lava: "#ff4030", sw: "#6a7080"}},

      /* ============================ SCADRIAL ============================ */
      {id: "scadrial", name: "Scadrial", group: "scadrian", books: [2, 6, 7, 10, 12], first: 2, major: true, status: "The Final Empire",
       star: {name: "Scadrial’s sun", col: "#ffd8a0"}, map: P.scadrial, est: true, hero: "luthadel",
       blurb: "Under a red sun and a constant fall of ash, the Lord Ruler has governed the Final Empire for a thousand years. Mists come out every night, the plants are brown, and the skaa labour as slaves under noble houses and the Steel Ministry. Allomancers burn metals to gain powers, and a crew of thieves plans the impossible: to bring the empire down.",
       short: "The ash-covered world of Mistborn.",
       eras: {
         6: {status: "Harmony’s world · the Elendel Basin",
             blurb: "Three hundred years after the end of the first trilogy, Sazed holds both Ruin and Preservation as the god Harmony and has remade the planet: blue skies, green plants, no ash. In the Elendel Basin there are railways, electric lights and early cars, and Allomancers solve crimes. Beyond the Basin lie the Roughs, a lawless frontier.",
             facts: [["Shards", "Harmony (Ruin and Preservation)"], ["Magic", "Allomancy, Feruchemy, Hemalurgy"], ["Era", "Industrial, about 300 years after Mistborn"]],
             gfx: {pal: ["#0a2240", "#2a6aa0", "#4e7a3a", "#6a8e44", "#8a8460", "#eef0f2"], clouds: .45, cloudCol: "#ffffff", atmo: "#7aa8ff", lights: .5, sea: .55}},
         10: {status: "Harmony’s world · under threat from outside"}
       },
       facts: [["Shards", "Preservation and Ruin"], ["Magic", "Allomancy, Feruchemy, Hemalurgy"], ["Ruler", "The Lord Ruler"]],
       gfx: {type: "terran", sea: .42, freq: 1.5, rough: .75, ice: 84,
             pal: ["#1a1a1e", "#3a3634", "#4a4038", "#5a4a3a", "#3e3632", "#8a8078"],
             clouds: .55, cloudCol: "#7a706a", atmo: "#c87a50", atmoK: 1.1, lights: .1, sw: "#5a4a3a",
             feat: [
               {k: "continent", at: [26, 2], r: 34, s: .3},
               {k: "peak", at: [24, 18], r: 3, s: .45}, {k: "peak", at: [16, -12], r: 3, s: .45}, {k: "peak", at: [32, 8], r: 2.5, s: .42},
               {k: "range", from: [50, -10], to: [44, 22], w: 3, s: .3},
               {k: "continent", at: [-40, 10], r: 22, s: .24},
               {k: "biome", at: [-40, 10], r: 18, s: .9, style: "forest", c: "#3e6a3a"}
             ]},
       sites: [
         {id: "luthadel", name: "Luthadel", lat: 22, lon: 2, books: [2], desc: "Capital of the Final Empire, a dark city of keeps and skaa slums under the ash. The heist of Mistborn is planned here."},
         {id: "kredikshaw", name: "Kredik Shaw", rel: {to: "luthadel", dlat: 2, dlon: 2}, books: [2], desc: "The Lord Ruler’s palace, a hill of spires, where Vin finally faces him."},
         {id: "hathsin", name: "Pits of Hathsin", lat: 14, lon: 8, books: [2], desc: "The prison mine where atium was harvested and where Kelsier survived and Snapped."},
         {id: "well", name: "Well of Ascension", lat: 48, lon: 6, books: [2], desc: "In the Terris mountains, the place of power the Lord Ruler used a thousand years before. Vin releases what was trapped there."},
         {id: "tathingdwen", name: "Tathingdwen", lat: 45, lon: 0, books: [2], desc: "Old capital of the Terris people, home of the Keepers."},
         {id: "fadrex", name: "Fadrex City", lat: 26, lon: -26, books: [2], desc: "A western city in a ring of rock formations, protecting one of the Lord Ruler’s hidden storage caches."},
         {id: "urteau", name: "Urteau", lat: 34, lon: 14, books: [2], desc: "A northern city ruled by skaa rebels in The Hero of Ages."},
         {id: "elendel", name: "Elendel", lat: 20, lon: 0, books: [6, 7, 10], desc: "The great city of the Basin, laid out in octants around a central park, named after Elend Venture."},
         {id: "roughs", name: "The Roughs", lat: 20, lon: -24, books: [6, 10], desc: "The dry frontier beyond the Basin, where Waxillium was a lawman for twenty years."},
         {id: "newseran", name: "New Seran", lat: 32, lon: -6, books: [6], desc: "A rich hill town reached by rail, the starting point of the hunt for the Bands of Mourning."},
         {id: "bilming", name: "Bilming", lat: 18, lon: 22, books: [10], desc: "A rival Basin city where the Set gathers its strength in The Lost Metal."},
         {id: "southcontinent", name: "The Southern Continent", lat: -40, lon: 10, books: [6, 10], desc: "Across the ocean from the Basin, the lands of the Malwish and other southern Scadrians, revealed in The Bands of Mourning."}
       ]},

      /* ============================ SEL ============================ */
      {id: "sel", name: "Sel", group: "selish", books: [1, 7], first: 1, major: true, status: "Shardworld of Devotion and Dominion",
       star: {name: "Sel’s sun", col: "#fff6e8"}, map: P.sel, est: true, hero: "elantris",
       blurb: "Once the city of Elantris shone, and anyone the Shaod took became a near-immortal with silver skin and power drawn from the Aons, the symbols of their writing. Ten years ago it all failed. Now Elantris is a rotting prison where the newly taken are thrown, Arelon is ruled by a merchant king, and the empire of Fjorden sends priests to convert what is left.",
       short: "The world of Elantris and The Emperor’s Soul.",
       eras: {7: {facts: [["Shards", "Devotion and Dominion, both splintered"], ["Magic", "AonDor, Forgery, Dakhor and more, tied to the land"], ["Nations", "Arelon, Teod, Fjorden, the Rose Empire"]]}},
       facts: [["Nations", "Arelon, Teod, Fjorden"], ["Magic", "AonDor, drawn from the shape of the land"]],
       gfx: {type: "terran", sea: .58, freq: 1.4, pal: ["#0c2240", "#2c6a92", "#4a7a40", "#6a8a4a", "#8a8068", "#f0f0ee"],
             clouds: .35, atmo: "#8ab8ff", lights: .25, sw: "#6a8a4a",
             feat: [
               {k: "continent", at: [26, -16], r: 24, s: .28},
               {k: "continent", at: [8, -44], r: 7, s: .25},
               {k: "continent", at: [34, 30], r: 20, s: .26},
               {k: "river", from: [32, -26], to: [18, -10], w: 1.2, s: .45},
               {k: "continent", at: [-18, 62], r: 20, s: .25},
               {k: "biome", at: [-18, 62], r: 14, s: .8, style: "farm", c: "#a89a5a"}
             ]},
       sites: [
         {id: "elantris", name: "Elantris", lat: 26, lon: -18, books: [1, 7], desc: "The fallen city of the Elantrians, its walls now holding the Shaod’s victims. Raoden is thrown in here at the start of the book."},
         {id: "kae", name: "Kae", rel: {to: "elantris", dlat: -4, dlon: 6}, books: [1], desc: "The town in Elantris’s shadow that became Arelon’s capital after the fall."},
         {id: "chasm", name: "The Chasm", lat: 24, lon: -14, books: [1], desc: "A great rift that opened during the Reod. Raoden realises the land itself is part of the Aons, and the Chasm broke them."},
         {id: "teod", name: "Teod", lat: 8, lon: -44, sea: true, books: [1], desc: "Sarene’s island homeland, a trading kingdom tied to Arelon by her marriage."},
         {id: "fjorden", name: "Fjorden", lat: 36, lon: 30, books: [1], desc: "The empire of the Derethi church, sending gyorns like Hrathen to convert the east."},
         {id: "roseempire", name: "The Rose Empire", lat: -20, lon: 62, books: [7], desc: "On another continent, the empire where the Forger Shai rebuilds the emperor’s soul in The Emperor’s Soul."}
       ]},

      /* ============================ NALTHIS ============================ */
      {id: "nalthis", name: "Nalthis", group: "nalthian", books: [3, 5, 7], first: 3, major: true, status: "Shardworld of Endowment",
       star: {name: "Nalthis’s sun", col: "#fff4dc"}, map: P.nalthis, est: true, hero: "ttelir",
       blurb: "A bright, tropical world where every person is born with one Breath, which can be given away. Those who gather many see colour more vividly, live longer and can Awaken objects. Hallandren, rich and full of colour, is ruled by Returned gods; the stern highland kingdom of Idris fears it, and two sisters are caught between them.",
       short: "The world of Warbreaker.",
       facts: [["Shard", "Endowment"], ["Magic", "Awakening with Breath; the Returned"], ["Nations", "Hallandren, Idris, Pahn Kahl"]],
       gfx: {type: "forest", sea: .55, freq: 1.5, pal: ["#0a2a48", "#1a7aa8", "#3a8a3a", "#5aa848", "#7a8a58", "#f0f0e8"],
             clouds: .35, atmo: "#7ac0ff", moist: .3, lights: .3, sw: "#5aa848",
             feat: [
               {k: "continent", at: [10, 0], r: 26, s: .28},
               {k: "basin", at: [-6, -6], r: 8, s: .25},
               {k: "range", from: [26, -10], to: [24, 18], w: 4, s: .3},
               {k: "biome", at: [4, 4], r: 7, s: .9, style: "flame", c: "#e05a9a"},
               {k: "biome", at: [-14, 8], r: 6, s: .8, style: "grass", c: "#c8a048"}
             ]},
       sites: [
         {id: "ttelir", name: "T’Telir", lat: 2, lon: 2, books: [3], desc: "Hallandren’s capital on the Inner Sea, crowded, colourful and full of Awakened statues."},
         {id: "courtofgods", name: "The Court of Gods", rel: {to: "ttelir", dlat: 4, dlon: 3}, books: [3], desc: "The walled court of the Returned and the God King’s black palace, where Siri is sent to be married."},
         {id: "bevalis", name: "Bevalis", lat: 26, lon: 6, books: [3], desc: "The modest highland capital of Idris, Siri and Vivenna’s home."},
         {id: "pahnkahl", name: "Pahn Kahl", lat: -14, lon: 8, books: [3], desc: "A quiet southern people living inside Hallandren, with grievances of their own."}
       ]},

      /* ============================ OTHER SHARDWORLDS ============================ */
      {id: "taldain", name: "Taldain", group: "shardworlds", books: [7], first: 7, status: "Shardworld of Autonomy",
       star: {name: "Taldain’s sun", col: "#fffaf0"}, map: P.taldain, est: true, hero: "kerla",
       blurb: "A tidally locked world: Dayside is under a sun that never sets and covered in white sand, while Darkside lies in permanent shadow under a dust cloud. On Dayside the Sand Masters ride and fight with ribbons of sand. Kenton, the son of their leader, is left as the only master after a massacre.",
       short: "Dayside’s white sand: White Sand.",
       facts: [["Shard", "Autonomy"], ["Magic", "Sand mastery"], ["Peculiarity", "One face always toward the sun"]],
       gfx: {type: "desert", sea: .08, freq: 1.3, dune: 12, pal: ["#3a3a40", "#6a6a70", "#f2ece0", "#e8dcc8", "#d8c8b0", "#ffffff"],
             clouds: .05, atmo: "#ffffff", atmoK: .7, sw: "#f2ece0"},
       sites: [
         {id: "kerla", name: "Kerla", lat: 4, lon: 10, books: [7], desc: "The desert of Dayside, home of the Diem, the order of Sand Masters."},
         {id: "darkside", name: "Darkside", lat: 0, lon: -160, books: [7], desc: "The night face of the world, where Khriss comes from. Its peoples have magic of their own."}
       ]},

      {id: "threnody", name: "Threnody", group: "shardworlds", books: [7], first: 7, status: "Where Odium wounded Ambition",
       star: {name: "Threnody’s sun", col: "#ffe8c8"}, map: P.threnody, est: true, hero: "waystop",
       blurb: "A grim frontier world where the dead linger as shades in the Forests of Hell. Shed blood draws them, and a shade’s touch kills. Silence Montane runs a waystop for travellers and secretly hunts bounties to keep it afloat. The world bears the scars of a great clash between two Shards.",
       short: "The Forests of Hell.",
       facts: [["Shards", "Scarred by Odium’s fight with Ambition"], ["Danger", "Shades in the forests"]],
       gfx: {type: "forest", sea: .4, freq: 1.6, pal: ["#0a141c", "#1a3038", "#1a3424", "#22402c", "#4a5048", "#c8ccd0"],
             clouds: .5, cloudCol: "#a8b0b4", atmo: "#8aa0a8", amb: .03, sw: "#22402c"},
       sites: [
         {id: "waystop", name: "Silence’s waystop", lat: 14, lon: 20, books: [7], desc: "The roadside inn deep in the forest that Silence keeps going for her family."},
         {id: "lastport", name: "Lastport", lat: 18, lon: -6, books: [7], desc: "The coastal town at the edge of the forest, where bounties are paid."}
       ]},

      {id: "firstsun", name: "First of the Sun", group: "shardworlds", books: [7, 12], first: 7, status: "Archipelago world · Drominad system",
       star: {name: "Drominad", col: "#fff2d4"}, map: P.firstsun, est: true, hero: "patji",
       blurb: "An ocean world of islands. The greatest of them, Patji, is a jungle where almost everything can kill you. Trappers like Dusk survive by knowing its rules and by the Aviar, birds that give their owners talents such as seeing danger coming. Now ships from the Ones Above have arrived in orbit.",
       short: "Patji and the Aviar: Sixth of the Dusk.",
       eras: {12: {blurb: "An ocean world of islands. The greatest, Patji, is a deadly jungle, and the Aviar birds lend talents to those who carry them. Years after the Ones Above appeared, Dusk sees his people racing to modernise before they are conquered, and he sails through Patji’s Eye into the Emberdark to find help."}},
       facts: [["System", "Drominad"], ["Magic", "Aviar birds"], ["Threat", "The Ones Above"]],
       gfx: {type: "archipelago", sea: .72, freq: 2.2, pal: ["#062a48", "#1a8ab0", "#2a7a3a", "#3a8a2a", "#4a6a3a", "#e0e8d8"],
             clouds: .4, atmo: "#7ac8ff", moist: .4, sw: "#3a8a2a",
             feat: [{k: "continent", at: [4, 0], r: 8, s: .35}, {k: "peak", at: [4, 0], r: 2, s: .3}]},
       sites: [
         {id: "patji", name: "Patji", lat: 4, lon: 2, books: [7, 12], desc: "The Father island, a jungle that punishes every mistake. Dusk traps Aviar here."},
         {id: "patjiseye", name: "Patji’s Eye", rel: {to: "patji", dlat: 3, dlon: 2}, books: [12], desc: "A sacred place on Patji that is in fact a gateway between the realms. Dusk sails through it into the Emberdark."},
         {id: "homeisles", name: "The inner islands", lat: -10, lon: -20, sea: true, books: [7, 12], desc: "The gentler islands where Dusk’s people live and where the change brought by the Ones Above is felt first."}
       ]},

      /* ============================ THE WIDER COSMERE ============================ */
      {id: "lumar", name: "Lumar", group: "wider", books: [11], first: 11, status: "World of the spore seas",
       star: {name: "Lumar’s sun", col: "#fff2dc"}, map: P.lumar, est: true, hero: "rock",
       blurb: "There is no water to sail here. Twelve moons hang close overhead, and from each one spores rain down to make an ocean: an emerald sea, a crimson sea, a midnight sea and more. Touch spores with water and they burst. Tress, a girl who collects cups on a dull little island, sets out across these seas to rescue the boy she loves from a Sorceress.",
       short: "Seas of spores: Tress of the Emerald Sea.",
       facts: [["Moons", "Twelve, each raining its own spore"], ["Seas", "Emerald, Crimson, Midnight, Sapphire, Rose and more"], ["Danger", "Spores erupt when wet"]],
       moons: [{name: "Emerald moon", size: .16, dist: 2.2, speed: .05}, {name: "Crimson moon", size: .14, dist: 2.6, speed: .045},
               {name: "Midnight moon", size: .15, dist: 3.0, speed: .04}, {name: "Sapphire moon", size: .13, dist: 3.4, speed: .035},
               {name: "Rose moon", size: .12, dist: 3.8, speed: .03}, {name: "Sunlight moon", size: .14, dist: 4.2, speed: .025}],
       gfx: {type: "terran", sea: 0, freq: 1.2, rough: .15, bump: .4, ice: 90,
             pal: ["#1a5a3a", "#1a5a3a", "#24804c", "#2a8a52", "#24804c", "#2a8a52"],
             clouds: .15, atmo: "#d0ffe8", atmoK: .7, sw: "#2a8a52",
             feat: [
               {k: "biome", at: [18, -4], r: 30, s: 1, style: "forest", c: "#1f9a58"},
               {k: "biome", at: [-18, 52], r: 32, s: 1, style: "forest", c: "#b01c2c"},
               {k: "biome", at: [30, 140], r: 36, s: 1, style: "forest", c: "#1a1a3a"},
               {k: "biome", at: [-26, -50], r: 32, s: 1, style: "forest", c: "#2a62d0"},
               {k: "biome", at: [40, -130], r: 30, s: 1, style: "forest", c: "#e08aaa"},
               {k: "biome", at: [-45, -160], r: 30, s: 1, style: "forest", c: "#e8c030"},
               {k: "peak", at: [12, -6], r: 1.5, s: .5}, {k: "peak", at: [26, 132], r: 2, s: .5},
               {k: "peak", at: [-4, 30], r: 1.2, s: .45}, {k: "peak", at: [-22, 48], r: 1.2, s: .45},
               {k: "biome", at: [12, -6], r: 2.2, s: 1, style: "rock", c: "#8a8068"},
               {k: "biome", at: [26, 132], r: 2.6, s: 1, style: "rock", c: "#5a5470"}
             ]},
       sites: [
         {id: "rock", name: "Diggen’s Point (the Rock)", lat: 12, lon: -6, books: [11], desc: "A small, plain island in the Emerald Sea where Tress works and collects cups."},
         {id: "kingsport", name: "Kingsport", lat: 20, lon: 14, books: [11], sea: true, desc: "Port of the Verdant king, at war with the Sorceress over trade tariffs."},
         {id: "crimson", name: "The Crimson Sea", lat: -18, lon: 52, sea: true, books: [11], desc: "Wild, uninhabited and unpredictable. Something very old lives at its bottom."},
         {id: "sorceress", name: "The Sorceress’s island", lat: 26, lon: 132, books: [11], desc: "In the Midnight Sea, where Riina, an outsider from Sel, set herself up as the Sorceress."}
       ]},

      {id: "komashi", name: "Komashi", group: "wider", books: [11], first: 11, status: "Double world with UTol",
       star: {name: "UTol system’s red-orange sun", col: "#ffb070"}, map: P.komashi, est: true, hero: "kilahito",
       blurb: "Half of a double planet circling a big red-orange sun, with its twin UTol shining blue in the sky. In one age, Yumi stacks stones to honour the spirits that warm the land. In another, a black shroud hides the sky, nightmares come out of it, and Nikaro paints them away for a living. A spirit binds the two of them together.",
       short: "Stone-stacking and nightmare-painting: Yumi and the Nightmare Painter.",
       eras: {12: {status: "Shroud lifted"}},
       facts: [["Twin", "UTol, a blue world in the sky"], ["Spirits", "The hijo"], ["Shard", "Virtuosity splintered nearby"]],
       moons: [{name: "UTol", size: .5, dist: 3.4, speed: .02, gfx: {type: "ocean", pal: ["#2a5aa8", "#4a8ad8", "#6ab0e8", "#8ac8f0", "#aad8f8", "#ffffff"]}}],
       gfx: {type: "desert", sea: .32, freq: 1.4, pal: ["#0c1a30", "#2a4a6a", "#7a5a40", "#8a6a48", "#a08060", "#e0d8c8"],
             clouds: .1, atmo: "#ffb880", atmoK: .8, lights: .4, sw: "#8a6a48",
             feat: [{k: "basin", at: [10, 0], r: 6, s: .05}, {k: "biome", at: [10, 0], r: 6, s: .8, style: "grass", c: "#6a8a48"}]},
       sites: [
         {id: "kilahito", name: "Kilahito", lat: 12, lon: 6, books: [11], desc: "A round city in Nagadan, built around a hion line under the shroud, where Nikaro paints nightmares."},
         {id: "torio", name: "Torio City", lat: 8, lon: -6, books: [11], desc: "Ruins of the oldest kingdom, Torio, where the machine that made the shroud was built."},
         {id: "steamwells", name: "The steamwells", lat: 6, lon: -12, books: [11], desc: "Warm springs where Yumi’s people lived, heated by the hijo under the ground."}
       ]},

      {id: "canticle", name: "Canticle", group: "wider", books: [11, 12], first: 11, status: "World under a burning sun",
       star: {name: "Canticle’s sun", col: "#fff0c0"}, map: P.canticle, est: true, hero: "union",
       blurb: "Sunlight on Canticle burns anything it touches, so whole cities fly around the world just ahead of the dawn. The planet spins backwards and a firestorm sweeps the sunset line. A stranger called Nomad lands here, hunted from world to world, and is captured by the people of the Cinder King, who rules the cities through power cells called sunhearts.",
       short: "Cities racing the dawn: The Sunlit Man.",
       eras: {12: {blurb: "Sunlight on Canticle burns anything it touches, so cities fly around the world ahead of the dawn. The stranger Nomad, who is Sigzil of Bridge Four years after leaving Roshar, helps the people of Beacon overthrow the Cinder King, then Skips on to UTol."}},
       facts: [["Hazard", "Sunlight that burns"], ["Power", "Sunhearts"], ["Ruler", "The Cinder King"]],
       ring: {inner: 1.5, outer: 2.3, c1: "#c8a080", c2: "#806050", tilt: .2},
       gfx: {type: "lava", sea: .35, freq: 1.8, rough: .9, pal: ["#1a0a08", "#3a1a10", "#3a3030", "#4a3a34", "#6a5a50", "#a09088"],
             lava: "#ff7a30", clouds: .15, cloudCol: "#a08070", atmo: "#ffa060", atmoK: .7, lights: .3, sw: "#ff7a30"},
       sites: [
         {id: "union", name: "Union", lat: 20, lon: 10, books: [11], desc: "The largest flying city, which has swallowed most others under the Cinder King."},
         {id: "beacon", name: "Beacon", lat: 30, lon: -30, books: [11], desc: "A smaller flying city that keeps the Chorus, and the heart of the rebellion."},
         {id: "scadrianlab", name: "The Scadrian research facility", lat: -20, lon: 40, books: [11], desc: "Offworld scientists studying the sunhearts and trading technology for them."}
       ]},

      {id: "miral", name: "Miral", group: "wider", books: [12], first: 12, status: "Isolated world · Valor once worked here",
       star: {name: "Miral’s sun", col: "#fff0dc"}, map: P.miral, est: true, hero: "kingseat",
       blurb: "A rarely visited world off the usual routes. In the kingdom of Mountaincrest, built on an enormous gentle mountain, the rivers run with the blood of a slain monster rather than water. December, an orphan from a riverside town, learns of a plague coming and travels up the River Violet to warn the court in Kingseat.",
       short: "Rivers of demon blood: The Fires of December.",
       facts: [["Shard", "Valor was active here"], ["Kingdom", "Mountaincrest"], ["Rivers", "Blood of the Megalith"]],
       gfx: {type: "forest", sea: .45, freq: 1.4, pal: ["#0c1e36", "#2a5a7a", "#5a6a3a", "#3a5a34", "#7a7058", "#eceae4"],
             clouds: .35, atmo: "#a0b8ff", sw: "#5a6a3a",
             feat: [{k: "peak", at: [20, 0], r: 14, s: .32},
                    {k: "river", from: [20, 0], to: [4, -8], w: 1.4, s: .4},
                    {k: "river", from: [20, 0], to: [6, 10], w: 1.4, s: .4},
                    {k: "river", from: [20, 0], to: [30, 18], w: 1.4, s: .4},
                    {k: "biome", at: [-6, 4], r: 14, s: .8, style: "forest", c: "#2e4a2a"}]},
       sites: [
         {id: "kingseat", name: "Kingseat", lat: 20, lon: 0, books: [12], desc: "Capital of Mountaincrest, at the summit of its great mountain."},
         {id: "rivershore", name: "Rivershore", lat: 6, lon: -6, books: [12], desc: "The small riverside town December comes from."},
         {id: "riverviolet", name: "The River Violet", lat: 12, lon: -4, books: [12], desc: "One of the rivers of the Megalith’s blood, which December follows up the mountain."},
         {id: "southplains", name: "The southern plains", lat: -6, lon: 4, books: [12], desc: "Lands south of Mountaincrest where nomads live alongside large demons."}
       ]},

      /* ============================ THE COGNITIVE REALM ============================ */
      {id: "shadesmar", name: "Shadesmar (Roshar)", group: "cognitive", books: [4, 5, 8, 9, 12], first: 4, status: "Roshar’s Cognitive Realm",
       star: {name: "A small, distant sun", col: "#e8e0ff"}, map: P.shadesmar, distText: COG,
       blurb: "The world of thought behind the physical one. Where Roshar has land, Shadesmar has an ocean of glass beads, each the soul of an object; where Roshar has sea, there is solid ground. Spren live here as people. Shallan glimpses it in her first book.",
       short: "The bead ocean of the spren.",
       eras: {8: {blurb: "The world of thought behind the physical one: an ocean of glass beads where Roshar has land, and dry ground where it has sea. Spren live here in cities, and Kaladin, Shallan and Adolin cross it on foot and by ship after the fall of Kholinar."}},
       facts: [["Realm", "Cognitive"], ["Inhabitants", "Spren"]],
       gfx: {type: "ocean", sea: .55, freq: 1.2, pal: ["#20183a", "#3a2a6a", "#1a1a24", "#2a2a34", "#3a3a48", "#8a8aa0"],
             clouds: 0, atmo: "#a080ff", atmoK: .6, amb: .06, sw: "#3a2a6a",
             feat: [{k: "continent", at: [-22, 40], r: 16, s: .26}, {k: "continent", at: [30, 120], r: 14, s: .26}]},
       sites: [
         {id: "celebrant", name: "Celebrant", lat: -20, lon: 40, books: [8], desc: "A spren trading city beside a sea of beads, where the travellers buy passage."},
         {id: "lastingintegrity", name: "Lasting Integrity", lat: 30, lon: 120, books: [9], desc: "The honorspren fortress where Adolin stands trial for the old betrayal of the Radiants."},
         {id: "beadsea", name: "The bead ocean", lat: 6, lon: -20, sea: true, books: [4, 8], desc: "Every bead is the soul of a physical thing. Sink in and you may not come back."}
       ]},

      {id: "silverlight", name: "Silverlight", group: "cognitive", books: [7, 11, 12], first: 7, major: true, status: "City in the Cognitive Realm",
       star: {name: "No sun of its own", col: "#e0e8ff"}, map: P.silverlight, distText: COG, craft: true,
       blurb: "A city built in the Cognitive Realm, where scholars and travellers from many worlds meet. Much of what the books tell us about the wider cosmere comes from people based here, including the essays in Arcanum Unbounded. Its codes of conduct are honoured, at least on paper, across many worlds.",
       short: "The crossroads city of worldhoppers.",
       facts: [["Realm", "Cognitive"], ["Known for", "Scholarship, starcharts, the Silverlight Codes"]],
       gfx: {type: "city", sea: .3, pal: ["#1a1a30", "#2a2a48", "#5a5a6a", "#6a6a7a", "#9a9aac", "#e8e8f4"],
             clouds: .1, atmo: "#c0c8ff", lights: 1, lightCol: "#d8e0ff", amb: .05, sw: "#9a9aac"},
       sites: [{id: "slcity", name: "The city", lat: 10, lon: 0, books: [7], desc: "The books describe Silverlight mostly through its scholars and its rules. This surface is our own interpretation."}]},

      {id: "emberdark", name: "The Emberdark", group: "cognitive", books: [12], first: 12, status: "A region of the Cognitive Realm",
       star: {name: "None", col: "#ff9a60"}, map: P.emberdark, distText: COG,
       blurb: "A dark region of the Cognitive Realm that Dusk enters through Patji’s Eye. Here he meets Starling, a young dragon serving on a starship, who has found a map to a hidden gate back into the physical world.",
       short: "Where Dusk meets Starling.",
       facts: [["Realm", "Cognitive"], ["Book", "Isles of the Emberdark"]],
       gfx: {type: "lava", sea: .5, freq: 2, pal: ["#06040a", "#140a10", "#1a1014", "#24161a", "#3a2420", "#6a4a3a"],
             lava: "#ff6a30", clouds: 0, atmo: "#ff8a50", atmoK: .5, amb: .02, sw: "#ff6a30"},
       sites: [{id: "hiddengate", name: "The hidden gate", lat: 0, lon: 0, books: [12], desc: "The way back to the physical world shown on Starling’s old map."}]}
    ],

    events: [
      /* I Elantris */
      {id: "e1", book: 1, world: "sel", site: "elantris", title: "Raoden is taken", text: "The prince of Arelon wakes with the Shaod and is quietly thrown into Elantris, declared dead to the world."},
      {id: "e2", book: 1, world: "sel", site: "kae", title: "A widow before the wedding", text: "Sarene of Teod arrives to marry Raoden and finds him already ‘dead’. She stays and goes to war in the court."},
      {id: "e3", book: 1, world: "sel", site: "kae", title: "Hrathen’s three months", text: "A priest of Fjorden comes with a deadline: convert Arelon, or watch it destroyed."},
      {id: "e4", book: 1, world: "sel", site: "chasm", title: "The land is part of the writing", text: "Raoden works out that the Aons echo the shape of the land. The Chasm broke them, and one more line fixes them."},
      {id: "e5", book: 1, world: "sel", site: "elantris", title: "Elantris shines again", text: "The magic returns, the city is restored and an invasion is turned back."},
      /* II Mistborn */
      {id: "e6", book: 2, world: "scadrial", site: "luthadel", title: "The crew", text: "Kelsier gathers thieves for an impossible job and finds Vin, a street girl who is secretly Mistborn."},
      {id: "e7", book: 2, world: "scadrial", site: "hathsin", title: "The survivor of Hathsin", text: "Kelsier’s past: he lived through the Pits when his wife did not, and came out with every Allomantic power."},
      {id: "e8", book: 2, world: "scadrial", site: "kredikshaw", title: "The Lord Ruler falls", text: "Vin finds his weakness and kills the immortal emperor in his palace."},
      {id: "e9", book: 2, world: "scadrial", site: "luthadel", title: "Siege of Luthadel", text: "Elend Venture tries to rule a free city while three armies camp outside the walls."},
      {id: "e10", book: 2, world: "scadrial", site: "well", title: "The Well of Ascension", text: "Vin reaches the Well and gives up its power, freeing the thing that had been tricking her."},
      {id: "e11", book: 2, world: "scadrial", site: "fadrex", title: "Fadrex and the caches", text: "Searching for the Lord Ruler’s storehouses, the crew lays siege to Fadrex as the world falls apart."},
      {id: "e12", book: 2, world: "scadrial", title: "The Hero of Ages", text: "Sazed takes up both Shards and remakes the world, ending the ash and the mists."},
      /* III Warbreaker */
      {id: "e13", book: 3, world: "nalthis", site: "courtofgods", title: "Siri’s marriage", text: "Idris sends its youngest princess to marry the God King of Hallandren, and she finds him nothing like the stories."},
      {id: "e14", book: 3, world: "nalthis", site: "ttelir", title: "Vivenna in the city", text: "Her sister comes after her, falls in with mercenaries and learns what the city really is."},
      {id: "e15", book: 3, world: "nalthis", site: "courtofgods", title: "Lightsong’s last day", text: "A god who doesn’t believe in himself uncovers the plot to start a war and gives his Breath to heal the God King."},
      {id: "e16", book: 3, world: "nalthis", site: "ttelir", title: "Vasher and Nightblood", text: "A grim Awakener with a talking black sword works to stop the war he helped cause long ago."},
      /* IV The Way of Kings */
      {id: "e17", book: 4, world: "roshar", site: "kholinar", title: "The assassin in white", text: "Szeth, bound to obey, kills King Gavilar during a feast, and Alethkar marches to war for revenge."},
      {id: "e18", book: 4, world: "roshar", site: "shatteredplains", title: "Bridge Four", text: "Kaladin, a surgeon’s son turned soldier turned slave, carries bridges in the plateau runs and keeps his crew alive."},
      {id: "e19", book: 4, world: "roshar", site: "kharbranth", title: "Jasnah’s ward", text: "Shallan Davar talks her way into Jasnah Kholin’s service, planning to steal her Soulcaster."},
      {id: "e20", book: 4, world: "roshar", site: "tower", title: "Battle of the Tower", text: "Abandoned by Sadeas, Dalinar’s army is saved when Kaladin leads his bridgemen back."},
      {id: "e21", book: 4, world: "roshar", site: "shatteredplains", title: "The visions", text: "In the storms Dalinar sees the past and hears a voice that admits it is dying."},
      /* V Words of Radiance */
      {id: "e22", book: 5, world: "roshar", site: "narak", title: "To the centre of the Plains", text: "Dalinar marches on the Parshendi city as they summon a new storm from the west."},
      {id: "e23", book: 5, world: "roshar", site: "urithiru", title: "Urithiru found", text: "Shallan opens the Oathgate and leads the armies to the lost tower city."},
      {id: "e24", book: 5, world: "roshar", site: "narak", title: "Kaladin’s Third Ideal", text: "Kaladin swears to protect even those he hates, and flies."},
      {id: "e25", book: 5, world: "braize", title: "Damnation named", text: "The Heralds’ torment between Desolations is laid bare, and the Everstorm brings the return of something long imprisoned."},
      /* VI Wax & Wayne */
      {id: "e26", book: 6, world: "scadrial", site: "elendel", title: "Home from the Roughs", text: "Waxillium Ladrian returns to Elendel to run his house, and is pulled back into lawkeeping by a run of train heists."},
      {id: "e27", book: 6, world: "scadrial", site: "elendel", title: "Shadows of Self", text: "A rogue kandra murders her way through the city’s elite, and Harmony’s quiet influence comes into the open."},
      {id: "e28", book: 6, world: "scadrial", site: "newseran", title: "The Bands of Mourning", text: "Wax’s crew chases a legendary relic and finds proof of other peoples beyond the sea."},
      {id: "e29", book: 6, world: "scadrial", site: "southcontinent", title: "News from the south", text: "The southern Scadrians are real, and ahead of the Basin in some technologies."},
      /* VII Arcanum Unbounded */
      {id: "e30", book: 7, world: "sel", site: "roseempire", title: "The Emperor’s Soul", text: "A condemned Forger is given a hundred days to rebuild the soul of a dying emperor."},
      {id: "e31", book: 7, world: "firstsun", site: "patji", title: "Sixth of the Dusk", text: "Dusk the trapper meets Vathi, a scholar who has seen the ships of the Ones Above."},
      {id: "e32", book: 7, world: "threnody", site: "waystop", title: "Shadows for Silence", text: "Silence goes after a dangerous bounty in the Forests of Hell with her daughter."},
      {id: "e33", book: 7, world: "taldain", site: "kerla", title: "White Sand", text: "After a massacre of the Sand Masters, Kenton fights to save the order with help from Khriss of Darkside."},
      {id: "e34", book: 7, world: "scadrial", title: "Mistborn: Secret History", text: "What Kelsier did after his death, and how he looked into the wider cosmere."},
      {id: "e35", book: 7, world: "roshar", site: "yeddaw", title: "Edgedancer", text: "Lift crosses to Tashikk to protect a man the Herald Nale wants dead."},
      {id: "e36", book: 7, world: "silverlight", title: "The view from outside", text: "Essays and a star chart from a worldhopping scholar show the Shardworlds side by side for the first time."},
      /* VIII Oathbringer & Dawnshard */
      {id: "e37", book: 8, world: "roshar", site: "urithiru", title: "A coalition", text: "Dalinar tries to unite the monarchs of Roshar against the Voidbringers, with his own past catching up with him."},
      {id: "e38", book: 8, world: "roshar", site: "kholinar", title: "The fall of Kholinar", text: "Kaladin, Shallan, Adolin and Elhokar slip into the occupied capital. The city falls and the king dies."},
      {id: "e39", book: 8, world: "shadesmar", site: "celebrant", title: "Across Shadesmar", text: "Pulled through the Oathgate into the Cognitive Realm, the survivors walk and sail toward Thaylen City."},
      {id: "e40", book: 8, world: "roshar", site: "thaylen", title: "The Battle of Thaylen Field", text: "Odium sends his champion. Dalinar refuses to give in, binds the realms together and becomes the Bondsmith."},
      {id: "e41", book: 8, world: "ashyn", title: "The truth about humans", text: "The Alethi learn that their ancestors came from Ashyn as refugees and took the singers’ world."},
      {id: "e42", book: 8, world: "roshar", site: "akinah", title: "Dawnshard", text: "Rysn’s ship sails for forbidden Akinah and finds something far older than the Radiants."},
      /* IX Rhythm of War */
      {id: "e43", book: 9, world: "roshar", site: "urithiru", title: "The tower occupied", text: "The Fused take Urithiru. Navani, a prisoner, works out the science of Light."},
      {id: "e44", book: 9, world: "roshar", site: "urithiru", title: "Kaladin’s Fourth Ideal", text: "Alone in the captured tower, Kaladin learns he cannot save everyone and keeps going anyway."},
      {id: "e45", book: 9, world: "shadesmar", site: "lastingintegrity", title: "Adolin’s trial", text: "Adolin asks the honorspren to judge humanity, and stands up for the dead spren of his sword."},
      {id: "e46", book: 9, world: "roshar", title: "A new Odium", text: "Taravangian kills the vessel of Odium and takes up the Shard himself."},
      /* X The Lost Metal */
      {id: "e47", book: 10, world: "scadrial", site: "bilming", title: "The Set in Bilming", text: "Wax finally confronts the secret society behind years of crimes, and its link to a power from off the world."},
      {id: "e48", book: 10, world: "scadrial", site: "elendel", title: "A weapon over Elendel", text: "A bomb that could destroy the city and a god’s scheme from beyond the planet bring the Wax and Wayne era to its end."},
      /* XI 2023 */
      {id: "e49", book: 11, world: "lumar", site: "rock", title: "Tress sets sail", text: "When the duke’s son is sent off to the Sorceress, Tress leaves her island to get him back."},
      {id: "e50", book: 11, world: "lumar", site: "sorceress", title: "The Sorceress’s island", text: "With a pirate crew and an unusual narrator, Tress reaches the Midnight Sea and forces the Sorceress to leave the world."},
      {id: "e51", book: 11, world: "komashi", site: "kilahito", title: "Yumi and Nikaro", text: "A stone-stacker and a nightmare painter are bound together across time and must work out why."},
      {id: "e52", book: 11, world: "komashi", site: "torio", title: "The shroud lifts", text: "They destroy the machine behind the shroud, and the sun shines on Komashi again."},
      {id: "e53", book: 11, world: "canticle", site: "union", title: "Nomad lands", text: "Hunted by the Night Brigade, Nomad arrives on Canticle and is taken prisoner in Union."},
      {id: "e54", book: 11, world: "canticle", site: "beacon", title: "Beacon stands", text: "Nomad joins Beacon’s rebellion against the Cinder King, racing the sunrise."},
      /* XII 2024-26 */
      {id: "e55", book: 12, world: "roshar", site: "urithiru", title: "A contest of champions", text: "Dalinar and Odium agree on a contest, with ten days for both sides to prepare."},
      {id: "e56", book: 12, world: "roshar", site: "shinovar", title: "Kaladin and Szeth in Shinovar", text: "They cross the storms to Szeth’s homeland and find the Herald Ishar behind its silence."},
      {id: "e57", book: 12, world: "roshar", site: "thaylen", title: "Fronts falling", text: "Odium’s side gains ground at Thaylenah, Azimir and the Shattered Plains."},
      {id: "e58", book: 12, world: "roshar", site: "urithiru", title: "Retribution", text: "Dalinar renounces Honor’s power. Odium absorbs it, kills the Stormfather and becomes Retribution."},
      {id: "e59", book: 12, world: "roshar", title: "The Night of Sorrows", text: "Stormlight is withdrawn, the Everstorm covers the world, and time on Roshar slows to a crawl."},
      {id: "e60", book: 12, world: "scadrial", title: "Hoid seeks help", text: "In the epilogue Hoid travels to Scadrial to look for allies against Retribution."},
      {id: "e61", book: 12, world: "firstsun", site: "patjiseye", title: "Through Patji’s Eye", text: "Dusk leaves his world through the Eye, searching for help against the Ones Above."},
      {id: "e62", book: 12, world: "emberdark", site: "hiddengate", title: "Dusk and Starling", text: "In the Emberdark he allies with Starling and her crew in a hunt for a hidden gate."},
      {id: "e63", book: 12, world: "miral", site: "riverviolet", title: "Up the River Violet", text: "December sets out to warn Kingseat of a coming plague. (The Fires of December, published October 2026.)"}
    ],

    codex: [
      {id: "shards", title: "Shards", list: [
        {name: "Adonalsium", first: 1, desc: "The single power behind creation, shattered long before the books into sixteen Shards.", more: [[7, "It was destroyed on Yolen by a group that included Hoid."]]},
        {name: "Honor", books: [4, 5, 8, 9, 12], desc: "Shard of oaths and bonds on Roshar, said to be dead; his voice survives in Dalinar’s visions.", more: [[12, "Merged with Odium after Dalinar renounced it, forming Retribution."]]},
        {name: "Cultivation", books: [4, 5, 8, 9, 12], desc: "Shard of growth and change on Roshar, the Nightwatcher’s power, rarely seen directly."},
        {name: "Odium", books: [4, 5, 8, 9, 12], desc: "Shard of passion and division, the enemy behind the Desolations, who has killed other Shards.", more: [[7, "He splintered Devotion and Dominion on Sel and wounded Ambition at Threnody."], [9, "His vessel Rayse is killed and Taravangian takes the Shard."], [12, "Becomes Retribution."]]},
        {name: "Preservation", books: [2], desc: "Shard of stability on Scadrial, who made the mists."},
        {name: "Ruin", books: [2], desc: "Shard of entropy, trapped at the Well of Ascension and working through lies."},
        {name: "Harmony", first: 2, books: [2, 6, 10], desc: "Sazed holding both Preservation and Ruin, god of Scadrial’s second era."},
        {name: "Devotion and Dominion", books: [1, 7], desc: "The Shards of Sel. Their broken power lingers in the land and drives Sel’s many magics."},
        {name: "Endowment", books: [3], desc: "Shard of Nalthis, giver of Breath and of the Returned."},
        {name: "Autonomy", books: [7, 10], desc: "Shard of Taldain, who likes many avatars and dislikes rivals.", more: [[10, "Reaches toward Scadrial in The Lost Metal."]]},
        {name: "Ambition", first: 7, desc: "A Shard wounded by Odium near Threnody and later destroyed."},
        {name: "Virtuosity", first: 11, desc: "A Shard who splintered herself near Komashi."},
        {name: "Valor", first: 12, desc: "A Shard who was active on Miral and founded temples there."},
        {name: "Retribution", first: 12, desc: "Odium and Honor merged under Taravangian, now one of the greatest threats in the cosmere."}
      ]},
      {id: "people", title: "People", list: [
        {name: "Hoid (Wit)", role: "Worldhopper", books: [1, 2, 3, 4, 5, 8, 9, 11, 12], desc: "A storyteller who turns up on almost every world under another name, older than he looks.", more: [[7, "He was on Yolen at the Shattering."], [11, "Narrates Tress’s story."], [12, "Goes to Scadrial for help after Roshar falls."]]},
        {name: "Raoden and Sarene", role: "Elantris", books: [1], desc: "A prince thrown into Elantris and the Teo princess who fights for Arelon from outside the walls."},
        {name: "Kelsier", role: "The Survivor", books: [2, 7, 12], desc: "Leader of the crew that brings down the Lord Ruler.", more: [[7, "His story continues after death in Secret History."], [12, "Works with the Ghostbloods far from Scadrial."]]},
        {name: "Vin", role: "Mistborn", books: [2], desc: "A street thief who becomes the most powerful Allomancer of her age."},
        {name: "Sazed", role: "Keeper of Terris", books: [2, 6, 10], desc: "A scholar and Feruchemist who carries every religion in his metalminds.", more: [[6, "Now the god Harmony."]]},
        {name: "Siri and Vivenna", role: "Warbreaker", books: [3], desc: "Princesses of Idris, one married to a god and one lost in his city."},
        {name: "Vasher", role: "Awakener", books: [3, 5], desc: "Bearer of the sword Nightblood.", more: [[5, "Appears on Roshar as the swordmaster Zahel."]]},
        {name: "Kaladin Stormblessed", role: "Windrunner", books: [4, 5, 8, 9, 12], desc: "A soldier made slave who becomes the first of the new Knights Radiant."},
        {name: "Shallan Davar", role: "Lightweaver", books: [4, 5, 8, 9, 12], desc: "An artist and scholar hiding a past she won’t remember."},
        {name: "Dalinar Kholin", role: "The Blackthorn", books: [4, 5, 8, 9, 12], desc: "A warlord trying to become a better man.", more: [[8, "Becomes the Bondsmith."], [12, "Dies after renouncing Honor’s power."]]},
        {name: "Jasnah Kholin", role: "Scholar, queen", books: [4, 8, 9, 12], desc: "A brilliant historian and Elsecaller."},
        {name: "Szeth", role: "Truthless", books: [4, 5, 8, 9, 12], desc: "The assassin in white, bound to obey whoever holds his oathstone."},
        {name: "Taravangian", role: "King of Kharbranth", books: [4, 5, 8, 9, 12], desc: "An old, gentle king with a ruthless plan.", more: [[9, "Becomes Odium."]]},
        {name: "Waxillium and Wayne", role: "Lawkeepers", books: [6, 10], desc: "A Twinborn lawman and his impressionist sidekick in Elendel."},
        {name: "Shai", role: "Forger", books: [7], desc: "A thief who rewrites the history of objects, and one emperor."},
        {name: "Khriss", role: "Scholar of Darkside", books: [7], desc: "A worldhopping scholar whose essays explain the cosmere’s rules."},
        {name: "Tress", role: "Cup collector", books: [11], desc: "A practical girl from the Rock who becomes a captain."},
        {name: "Yumi and Nikaro", role: "Komashi", books: [11], desc: "A spirit-honouring stone-stacker and a nightmare painter."},
        {name: "Nomad", role: "Worldhopper", books: [11], desc: "A haunted traveller on the run from the Night Brigade.", more: [[12, "He is Sigzil of Bridge Four."]]},
        {name: "Dusk", role: "Trapper of Patji", books: [7, 12], first: 7, desc: "A trapper who survives Patji by knowing its rules and by his Aviar.", more: [[12, "Dusk teams up with Starling, a young dragon and one of Hoid’s apprentices."]]},
        {name: "December", role: "Miral", books: [12], desc: "An orphan who bonds with a demon and tries to warn a kingdom of plague."}
      ]},
      {id: "ideas", title: "Ideas", list: [
        {name: "Investiture", first: 1, desc: "The power of the Shards, which can take many forms: Breath, Stormlight, metals burned, the Aons."},
        {name: "The three Realms", first: 4, desc: "Every thing exists in the Physical, Cognitive and Spiritual Realms. Shadesmar is Roshar’s Cognitive Realm."},
        {name: "Worldhoppers", first: 3, desc: "People who cross between worlds, usually through the Cognitive Realm.", more: [[7, "Silverlight is their crossroads, and its codes set rules for visitors."], [11, "By the 2023 books there are starships as well."]]},
        {name: "Perpendicularities", first: 7, desc: "Places where a Shard’s power touches all three Realms, used as gates between worlds. Patji’s Eye is one."},
        {name: "The Ghostbloods", first: 5, desc: "A secret society on Roshar with interests far beyond it."},
        {name: "The Night Brigade", first: 11, desc: "A crew that hunts Nomad from world to world."}
      ]}
    ],

    galaxy: {
      sol: SOL,
      home: {at: {sol: [0, 0, 0]}, dist: 52, pitch: .55, dur: 2200},
      homeMob: {dist: 96, pitch: .72},
      flyDist: 12,
      labelFar: {major: 420, minor: 160},
      coreLabels: false,
      localField: {spread: 18, clear: 1.5},
      labels: [
        {text: "The Cosmere cluster", at: {sol: [0, 0, 0]}, off: [0, -1.5, 13], min: 30, max: 900, big: true},
        {text: "The Cognitive Realm", at: {world: "silverlight"}, off: [0, 2.2, 0], min: 8, max: 300, book: 4}
      ],
      link: {base: .35, gain: 1.2, curveMax: 2},
      links: [
        {id: "h-nal-ros", pairs: [["nalthis", "roshar"]], book: 5, opacity: {all: .5, cur: .95, past: .35}, curve: .12},
        {id: "h-yol-silv", pairs: [["yolen", "silverlight"], ["taldain", "silverlight"]], book: 7, opacity: {all: .45, cur: .9, past: .3}, curve: .05},
        {id: "h-sel-lum", pairs: [["sel", "lumar"]], book: 11, opacity: {all: .5, cur: .95, past: .35}, curve: .12},
        {id: "h-nomad", path: ["canticle", "komashi"], book: 11, opacity: {all: .5, cur: .95, past: .35}, curve: .12},
        {id: "h-scad-can", pairs: [["scadrial", "canticle"]], book: 11, opacity: {all: .45, cur: .9, past: .3}, curve: .1},
        {id: "h-nomad2", pairs: [["roshar", "canticle"]], book: 12, opacity: {all: .5, cur: .95, past: .35}, curve: .12},
        {id: "h-hoid12", pairs: [["roshar", "scadrial"]], book: 12, opacity: {all: .5, cur: .95, past: .35}, curve: .14},
        {id: "h-dusk", pairs: [["firstsun", "emberdark"], ["yolen", "emberdark"]], book: 12, opacity: {all: .5, cur: .95, past: .35}, curve: .08},
        /* Odium's attacks on other Shards: red */
        {id: "odium", pairs: [["braize", "sel"], ["braize", "threnody"]], color: "#ff5a48", book: 7, opacity: {all: .4, cur: .85, past: .35}, speed: .8, dash: 3, curve: .1}
      ]
    },

    legend: [
      {bookColors: true, label: "Worldhopping", allLabel: "Worldhopping, by book"},
      {color: "#ff5a48", label: "Odium’s strikes on other Shards", book: 7}
    ],

    hooks: {
      distText: function (w) {
        if (w.distText) return w.distText;
        if (w.id === "yolen") return "Centre of the drawing · " + SCHEM;
        return SCHEM;
      }
    }
  };

  (window.ATLAS_PACKS = window.ATLAS_PACKS || {})["cosmere"] = PACK;
})();

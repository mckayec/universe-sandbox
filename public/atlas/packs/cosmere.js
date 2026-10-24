/* The Cosmere Atlas: data pack for the shared galactic atlas engine (schema: ../PACK_FORMAT.md, v1).
   Series: Brandon Sanderson's Cosmere, 2005–2026 (Elantris to The Fires of December).

   SOURCES (all text below is paraphrased in our own words):
   - The Coppermind (coppermind.net): Cosmere, Physical Realm, Rosharan system, Scadrian system,
     Selish system, Nalthian System, Threnodite system, Drominad system, Taldain system, UTol system,
     Scar, Scadrial, Sel, Threnody, Canticle, Lumar, Kilahito, Komashi (it.coppermind.net), Nomad,
     Retribution, Miral, The Fires of December, Isles of the Emberdark.
   - The illustrated system charts by Isaac Stewart (Rosharan, Scadrian, Selish, Nalthian, Threnodite,
     Drominad), used for the order of planets, belts, moons, rings and painted colours.
   - The Cosmere star chart by Isaac Stewart (the constellation chart with the Scar): used for where
     each charted system sits relative to the others.
   - The book maps: The Final Empire (1021), Sycla/Opelon (Nazh's survey), Arelon (Elantris), for sites.
   - Wikipedia: Wind and Truth (plot). Release dates from publisher and news pages.

   LAYOUT (important):
   - The Coppermind describes the cosmere as a cluster of roughly 50–100 stars. The spiral drawn
     behind it is the engine's stand-in galaxy, NOT a claim that the Cosmere is in the Milky Way.
   - Systems on the star chart (Threnody, Taldain, Roshar, Scadrial, Sel, Nalthis, First of the Sun
     and the Scar) are laid out flat from that chart's picture: their directions from each other
     match the chart, but the chart is a sky view from an unrevealed vantage point and gives no
     distances or depth. The scale (1 chart pixel = 2 ly) is ours.
   - Every charted system is drawn as an ENLARGED ORRERY around its star (thousands of times too big
     at cluster scale; orbital radii compressed; angles arbitrary). Planet order, moons, rings and
     belts follow the system charts and the Coppermind.
   - Systems not on the star chart (Yolen, UTol, Lumar, Canticle, Miral and the worlds only named in
     passing) have no known position. They are placed around the edge and every one says so.
   - The Cognitive Realm places (Shadesmar, Silverlight, the Emberdark) float above the disc.
   - Surface sites on Roshar, Scadrial, Sel and Nalthis follow the book maps by eye; every other
     surface is a generated interpretation. */
(function () {
  "use strict";
  var SOL = [0, 27.14];                       /* engine default "Sol" point: used here as the centre of the star chart */
  var D2R = Math.PI / 180;
  var K = 0.02;                               /* scene units (100 ly) per star-chart pixel: our scale */
  /* a point on the Isaac Stewart star chart (1920 x 1451 px image), laid flat on the disc */
  function chart(px, py, h) {
    return [+(SOL[0] + (px - 960) * K / 10).toFixed(4), +(SOL[1] + (py - 725) * K / 10).toFixed(4), +((h || 0) / 10).toFixed(4)];
  }
  /* offset from another point: r scene units at bearing deg, h scene units up */
  function near(base, r, deg, h) {
    return [+(base[0] + r * Math.sin(deg * D2R) / 10).toFixed(4),
            +(base[1] + r * Math.cos(deg * D2R) / 10).toFixed(4),
            +((base[2] || 0) + (h || 0) / 10).toFixed(4)];
  }
  /* star positions read off the star chart (pixel centre of each labelled star) */
  var C = {
    threnody: chart(130, 148), taldain: chart(252, 718), roshar: chart(511, 866), scadrial: chart(793, 855),
    sel: chart(545, 968), nalthis: chart(684, 947), drominad: chart(1280, 1158), scar: chart(1640, 330)
  };
  /* not on the chart: positions unknown, placed around the edge (estimated) */
  var U = {
    yolen: chart(960, 600, 3.5), utol: chart(1500, 1350), lumar: near(C.drominad, 1.1, 120, .1),
    canticle: chart(1850, 900), miral: chart(80, 1250), dhatri: chart(1750, 1300),
    bjendal: chart(-60, 500), obrodai: chart(1150, 1420), mythos: chart(250, 1420), vax: chart(-40, 950)
  };
  /* orrery helper: body at r scene units from its star, bearing deg */
  function orb(star, r, deg) { return near(star, r, deg, 0); }

  var SCHEM = "Not on the star chart: position unknown";
  var ORR = "System drawn enlarged; planet order from the system chart";
  var CHARTPOS = "Placed from the Cosmere star chart (direction only; no distances given)";
  var COG = "In the Cognitive Realm, drawn above the cluster";
  function gas(pal, extra) { var g = {type: "gas", pal: pal, bands: 14, clouds: 0, atmoK: .9, sw: pal[2]}; for (var k in extra) g[k] = extra[k]; return g; }
  function rock(pal, extra) { var g = {type: "barren", sea: .2, pal: pal, clouds: 0, atmoK: .2, sw: pal[3]}; for (var k in extra) g[k] = extra[k]; return g; }
  function sun(col, hot, extra) { var g = {type: "lava", sea: .55, pal: hot, lava: col, rough: .3, bump: .3, clouds: 0, atmo: col, atmoK: 1.2, amb: .9, sw: col}; for (var k in extra) g[k] = extra[k]; return g; }
  var HOTW = ["#cfe0ff", "#e0ecff", "#eef4ff", "#f6f9ff", "#ffffff", "#ffffff"];
  var HOTY = ["#ff9a30", "#ffb848", "#ffd060", "#ffe890", "#fff4c0", "#ffffff"];
  var HOTR = ["#8a1a10", "#b0301a", "#d04a24", "#e86a30", "#f49050", "#ffc090"];
  function moonsN(n, base, prefix) { var a = []; for (var i = 0; i < n; i++) a.push({name: (prefix || "Moon") + " " + (i + 1), size: .09 + (i % 3) * .03, dist: (base || 2.4) + i * .7, speed: .06 - i * .006}); return a; }
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
        ["Charted stars", "Threnody, Taldain, Roshar, Scadrial, Sel, Nalthis, First of the Sun and the Scar sit where the Cosmere star chart shows them. The chart gives directions, not distances"],
        ["Each system", "Drawn enlarged, with every planet, belt and moon from its system chart, in order from the star"],
        ["Edge of the map", "Worlds not on the star chart. Their real positions are unknown"],
        ["Above the disc", "Places in the Cognitive Realm: Shadesmar, Silverlight and the Emberdark"],
        ["Coloured lines", "Worldhopping: people and powers crossing between worlds, in the book where it happens"],
        ["Book buttons", "Pick where you are in the reading order. Later worlds, events and people stay hidden"]
      ]
    },

    groups: [
      {id: "rosharan", name: "The Rosharan system", chip: {border: "rgba(111,162,255,.6)", color: "#a8c6ff"}, labelFar: 7, flyDist: 2.1},
      {id: "scadrian", name: "The Scadrian system", chip: {border: "rgba(201,163,106,.6)", color: "#e2c08a"}, labelFar: 6, flyDist: 1.6},
      {id: "selish", name: "The Selish system", chip: {border: "rgba(143,193,232,.6)", color: "#b6dbf4"}, labelFar: 6, flyDist: 1.6},
      {id: "nalthian", name: "The Nalthian system", chip: {border: "rgba(230,111,176,.6)", color: "#f4a6cf"}, labelFar: 6, flyDist: 1.6},
      {id: "threnodite", name: "The Threnodite system", chip: {border: "rgba(232,110,90,.6)", color: "#f4a89a"}, labelFar: 6, flyDist: 1.6},
      {id: "taldain", name: "The Taldain system", chip: {border: "rgba(220,230,255,.6)", color: "#e6eeff"}, labelFar: 5, flyDist: 1.4},
      {id: "drominad", name: "The Drominad system", chip: {border: "rgba(160,200,230,.6)", color: "#c4def0"}, labelFar: 6, flyDist: 1.6},
      {id: "utol", name: "The UTol system", chip: {border: "rgba(255,160,100,.6)", color: "#ffc49a"}, labelFar: 5, flyDist: 1.4},
      {id: "origin", name: "The world of the Shattering", chip: {border: "rgba(240,230,255,.55)", color: "#f0e6ff"}},
      {id: "wider", name: "Worlds off the star chart", chip: {border: "rgba(95,208,232,.6)", color: "#9ce6f4"}},
      {id: "named", name: "Worlds named in passing", chip: {border: "rgba(150,150,180,.5)", color: "#b8b8cc"}, labelFar: 60},
      {id: "cognitive", name: "The Cognitive Realm", chip: {border: "rgba(200,180,255,.6)", color: "#ddd0ff"}, flyDist: 10}
    ],

    worlds: [
      /* ============================ THE ROSHARAN SYSTEM (system chart: sun, Ashyn, Roshar, Braize, asteroid belt, ten gas giants) ============================ */
      {id: "rosharsun", name: "Roshar’s sun", group: "rosharan", books: [4, 5, 8, 9, 12], first: 4, major: true, status: "Star of the Rosharan system",
       star: {name: "Roshar’s sun", col: "#f4f6ff"}, map: C.roshar, distText: CHARTPOS,
       blurb: "A large white star, a little smaller than UTol’s. Thirteen planets circle it: three rocky worlds close in, then an asteroid belt, then ten gas giants named with the Vorin numerals.",
       short: "Large white star of the Rosharan system.",
       facts: [["Planets", "Ashyn, Roshar, Braize, then ten gas giants"], ["Colour", "White"]],
       gfx: sun("#ffffff", HOTW)},

      {id: "ashyn", name: "Ashyn", aka: ["Alaswha", "the Tranquiline Halls"], group: "rosharan", books: [8, 12], first: 8, status: "First planet · the Tranquiline Halls of legend",
       star: {name: "Roshar’s sun", col: "#f4f6ff"}, map: orb(C.roshar, .14, 200), distText: ORR,
       blurb: "The innermost planet, the world humans came from before Roshar. A global catastrophe, probably from Surges used without restraint, drove most of its people away as refugees. Those who stayed live in floating cities in the sky and a few habitable pockets. The surface is violently volcanic, and the axial tilt gives it seasons. Rosharan myth calls it the Tranquiline Halls.",
       short: "Humanity’s ruined world before Roshar.",
       facts: [["Order", "1st from the sun"], ["Known as", "The Tranquiline Halls"], ["People", "Floating cities and small refuges"]],
       gfx: {type: "lava", sea: .35, freq: 1.7, pal: ["#2a1410", "#4a2418", "#5a4a40", "#6a5848", "#8a7a68", "#d8d0c0"], lava: "#ff5a20",
             clouds: .35, cloudCol: "#b8a898", atmo: "#e0a080", atmoK: .8, lights: .2, sw: "#a03a2a"}},

      {id: "roshar", name: "Roshar", group: "rosharan", books: [4, 5, 7, 8, 9, 12], first: 4, major: true, status: "Second planet · Shardworld of Honor, Cultivation and Odium",
       star: {name: "Roshar’s sun", col: "#f4f6ff"}, map: orb(C.roshar, .22, 20), distText: ORR, hero: "shatteredplains", view: 4.2,
       blurb: "A world of stone and wind scoured by highstorms that roll in from the east every few days. One supercontinent, also called Roshar, holds nearly all its life. Plants pull into the rock when the storm comes, animals carry shells, and spheres left out in a storm fill with Stormlight. The Alethi princes fight an endless war on the Shattered Plains, while old stories speak of Desolations and of the Knights Radiant.",
       short: "The storm world of the Stormlight Archive.",
       eras: {
         5: {status: "Second planet · Shardworld of Honor, Cultivation and Odium · the Everstorm"},
         8: {blurb: "A world of stone and wind scoured by highstorms from the east, and now by the Everstorm blowing the other way. The Knights Radiant have returned, the singers have woken, and Odium’s Fused are back from Braize. Dalinar Kholin tries to hold a coalition of nations together through the True Desolation."},
         12: {status: "Retribution’s world · cut off in slowed time",
              blurb: "Dalinar challenged Odium to a contest of champions and, holding Honor’s power at the end, renounced it. Odium took Honor’s power into his own and became Retribution, killed the Stormfather, drew all Stormlight from the world and turned the highstorm into a planet-wide Everstorm. Time on Roshar has slowed, so about a decade there passes for decades elsewhere. Only Azir is spared the storm.",
              gfx: {clouds: .7, cloudCol: "#4a3540", atmo: "#c04a48", lights: .15}}
       },
       facts: [["Order", "2nd from the sun"], ["Shards", "Honor, Cultivation, Odium"], ["Moons", "Salas, Nomon, Mishim (a fourth broke up long ago)"], ["Gravity", "About 0.7 g; no axial tilt"], ["Day", "20 hours; about 500 days a year"]],
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
         {id: "shatteredplains", name: "The Shattered Plains", lat: 8, lon: 24, books: [4, 5, 8, 9, 12], desc: "A vast plateau cracked into islands of rock by deep chasms, where the Alethi warcamps hunt chasmfiends for gemhearts. Pieces of a moon that broke up long ago lie beneath it. Kaladin carries bridges here as a slave."},
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

      {id: "braize", name: "Braize", aka: ["Damnation"], group: "rosharan", books: [5, 8, 9], first: 5, status: "Third planet · Odium’s world",
       star: {name: "Roshar’s sun", col: "#f4f6ff"}, map: orb(C.roshar, .3, 130), distText: ORR,
       blurb: "The third rocky planet, cold, barren and swept by wind under a thin atmosphere, probably outside the habitable zone. Rosharans call it Damnation. Its metallic core draws in souls and Investiture, which is why Odium, the Fused and the tormented Heralds were bound here between Desolations.",
       short: "Damnation: where the Heralds were tormented.",
       facts: [["Order", "3rd from the sun"], ["Rosharan name", "Damnation"], ["Bound here", "Odium and the Fused"]],
       gfx: {type: "ice", sea: .2, pal: ["#20242c", "#383e4a", "#5a6070", "#6a7080", "#8890a0", "#d8dce4"],
             clouds: .1, atmo: "#a0a8c0", atmoK: .4, sw: "#6a7080"}},
    /* the ten gas giants beyond the asteroid belt: named by Vorin numerals; colours as painted on the system chart */
    ].concat([
      ["jes", "Jes", "#3a6ad8", "#6a94ee", "#a8c4f8"], ["nan", "Nan", "#5a5a64", "#7a7a86", "#a0a0aa"], ["chach", "Chach", "#a02a2a", "#c8503a", "#e88a6a"],
      ["vev", "Vev", "#b8bcc8", "#d8dce4", "#f4f6fa"], ["palah", "Palah", "#2a8a4a", "#4ab06a", "#8ad8a0"], ["shash", "Shash", "#7a1a2a", "#a83a44", "#d06a70"],
      ["betab", "Betab", "#2a8a9a", "#4ab0c0", "#8ad8e0"], ["kak", "Kak", "#5a2a8a", "#7a4ab0", "#a888d8"], ["tanat", "Tanat", "#a86a2a", "#d08a40", "#ecb878"],
      ["ishi", "Ishi", "#a8a02a", "#ccc44a", "#ece888"]
    ].map(function (g, i) {
      return {id: g[0], name: g[1], group: "rosharan", books: [7], first: 7, status: "Gas giant · " + (i + 5) + "th from the sun",
        star: {name: "Roshar’s sun", col: "#f4f6ff"}, map: orb(C.roshar, .42 + i * .053, 60 + i * 37), distText: ORR,
        blurb: g[1] + " is one of the ten gas giants beyond the Rosharan asteroid belt, named with the Vorin numerals in order outward from the sun (Jes is one, Ishi is ten). None is habitable, none has known moons or rings, and their faint shadows in Shadesmar suggest no one lives there. Why there are exactly ten, the number Honor holds sacred, is not known. The colour is the one painted on the system chart.",
        short: "Gas giant " + (i + 1) + " of 10 beyond the asteroid belt.",
        facts: [["Order", (i + 5) + "th from the sun (" + (i + 1) + " of the ten gas giants)"], ["Moons", "None known"]],
        gfx: gas([g[2], g[3], g[4], g[3], g[2], g[4]], {atmo: g[4]})};
    })).concat([

      /* ============================ THE SCADRIAN SYSTEM (system chart: sun, Scadrial old/new orbit, Aagal Nod, Aagal Uch, comet belt, two dwarf planets) ============================ */
      {id: "scadsun", name: "Scadrial’s sun", group: "scadrian", books: [2, 6, 10], first: 2, major: true, status: "Star of the Scadrian system",
       star: {name: "Scadrial’s sun", col: "#fff0c8"}, map: C.scadrial, distText: CHARTPOS,
       blurb: "Scadrial’s yellow sun. The planet has been moved toward it and back again: the Lord Ruler pushed Scadrial closer, and Harmony later restored it. The system chart shows both the old orbit and the new. Under the ash in the first trilogy the sun looks red.",
       short: "Yellow star of the Scadrian system.",
       facts: [["Planets", "Scadrial, Aagal Nod, Aagal Uch, two dwarf planets"]],
       gfx: sun("#ffe8a0", HOTY)},

      {id: "scadrial", name: "Scadrial", group: "scadrian", books: [2, 6, 7, 10, 12], first: 2, major: true, status: "First planet · the Final Empire",
       star: {name: "Scadrial’s sun", col: "#ffd8a0"}, map: orb(C.scadrial, .2, 40), distText: ORR, hero: "luthadel",
       blurb: "Under a red sun and a constant fall of ash, the Lord Ruler has governed the Final Empire for a thousand years. The empire lies in the far north, its Ashmounts near the pole, and most of the rest of the planet has been baked into desert. Mists come out every night, the plants are brown, and the skaa labour as slaves. Allomancers burn metals to gain powers, and a crew of thieves plans the impossible: to bring the empire down.",
       short: "The ash-covered world of Mistborn.",
       eras: {
         6: {status: "First planet · Harmony’s world · the Elendel Basin",
             blurb: "Three hundred years after the end of the first trilogy, Sazed holds both Ruin and Preservation as the god Harmony and has remade the planet: blue skies, green plants, no ash. Most northerners live in the fertile Elendel Basin near the equator, ringed by the Seran, Faleast and Channerel mountains, where there are railways, electric lights and early cars. Around the Basin lie the Roughs, and near the south pole a colder southern continent.",
             facts: [["Order", "1st from the sun · no moon"], ["Shards", "Harmony (Ruin and Preservation)"], ["Magic", "Allomancy, Feruchemy, Hemalurgy"], ["Era", "Industrial, about 300 years after Mistborn"]],
             gfx: {pal: ["#0a2240", "#2a6aa0", "#4e7a3a", "#6a8e44", "#8a8460", "#eef0f2"], clouds: .45, cloudCol: "#ffffff", atmo: "#7aa8ff", lights: .5, sea: .55, ice: 78,
                   feat: [
                     {k: "continent", at: [6, 0], r: 26, s: .3},
                     {k: "basin", at: [2, 4], r: 5, s: .18},
                     {k: "range", from: [16, -18], to: [-4, -16], w: 2.6, s: .3},
                     {k: "range", from: [18, 14], to: [-2, 18], w: 2.6, s: .3},
                     {k: "range", from: [-8, -12], to: [-8, 14], w: 2.4, s: .28},
                     {k: "biome", at: [4, 0], r: 10, s: .9, style: "farm", c: "#7a9a48"},
                     {k: "biome", at: [10, -26], r: 12, s: .8, style: "rock", c: "#a08a60"},
                     {k: "continent", at: [-72, 10], r: 20, s: .26},
                     {k: "biome", at: [-72, 10], r: 16, s: .9, style: "snow", c: "#d8dee4"}
                   ]}},
         10: {status: "First planet · Harmony’s world · under threat from outside"}
       },
       facts: [["Order", "1st from the sun · no moon"], ["Shards", "Preservation and Ruin"], ["Magic", "Allomancy, Feruchemy, Hemalurgy"], ["Ruler", "The Lord Ruler"]],
       gfx: {type: "desert", sea: .3, freq: 1.4, rough: .7, ice: 90, dune: 7,
             pal: ["#1a1a1e", "#3a3634", "#8a6a48", "#9a7a50", "#6a5848", "#a89888"],
             clouds: .55, cloudCol: "#6a605a", atmo: "#c87a50", atmoK: 1.1, lights: .1, sw: "#5a4a3a",
             feat: [
               {k: "continent", at: [60, 0], r: 22, s: .3},
               {k: "biome", at: [60, 0], r: 20, s: .95, style: "forest", c: "#4a4038"},
               {k: "peak", at: [80, 30], r: 3, s: .45}, {k: "peak", at: [78, -40], r: 3, s: .45}, {k: "peak", at: [82, 120], r: 3, s: .42},
               {k: "range", from: [74, -20], to: [72, 30], w: 3, s: .3},
               {k: "basin", at: [50, -14], r: 6, s: .25},
               {k: "river", from: [66, 6], to: [56, -4], w: 1, s: .4},
               {k: "continent", at: [-80, 0], r: 12, s: .22}
             ]},
       sites: [
         {id: "luthadel", name: "Luthadel", lat: 60, lon: 0, books: [2], desc: "Capital of the Final Empire in the Central Dominance, a dark city of keeps and skaa slums under the ash, built over the Well of Ascension."},
         {id: "kredikshaw", name: "Kredik Shaw", rel: {to: "luthadel", dlat: 2, dlon: 2}, books: [2], desc: "The Lord Ruler’s palace, a hill of spires, where Vin finally faces him."},
         {id: "well", name: "Well of Ascension", rel: {to: "luthadel", dlat: -2, dlon: 3}, books: [2], desc: "The place of power hidden beneath Luthadel, not in the Terris mountains as the legends claimed. Vin releases what was trapped there."},
         {id: "hathsin", name: "Pits of Hathsin", lat: 54, lon: -10, books: [2], desc: "The prison mine where atium was harvested and where Kelsier survived and Snapped. The kandra Homeland lies nearby."},
         {id: "homeland", name: "The kandra Homeland", rel: {to: "hathsin", dlat: -3, dlon: -5}, books: [2], desc: "Caverns of the kandra near the Pits, where most of the Lord Ruler’s atium was kept."},
         {id: "tathingdwen", name: "Tathingdwen", lat: 70, lon: 16, books: [2], desc: "Old capital of the Terris people, home of the Keepers."},
         {id: "fadrex", name: "Fadrex City", lat: 58, lon: -30, books: [2], desc: "A city of the Western Dominance in a ring of rock formations, guarding one of the Lord Ruler’s storage caches."},
         {id: "urteau", name: "Urteau", lat: 68, lon: -8, books: [2], desc: "Once Straff Venture’s capital in the north, later held by rebel skaa."},
         {id: "elendel", name: "Elendel", lat: 3, lon: 0, books: [6, 7, 10], desc: "The great city of the Basin, on the coast of the Sea of Yomend near the equator, with the prime meridian running through it."},
         {id: "newseran", name: "New Seran", lat: 10, lon: -10, books: [6], desc: "A rich Basin town reached by rail, the starting point of the hunt for the Bands of Mourning."},
         {id: "dulsing", name: "Dulsing", lat: -2, lon: -8, books: [6], desc: "A Basin town in The Alloy of Law."},
         {id: "bilming", name: "Bilming", lat: 8, lon: 12, books: [10], desc: "A rival Basin city where the Set gathers its strength in The Lost Metal."},
         {id: "roughs", name: "The Roughs", lat: 12, lon: -28, books: [6, 10], desc: "The dry lands around the Basin, where Waxillium was a lawman for twenty years. Towns include Weathering and Far Dorest."},
         {id: "southcontinent", name: "The Southern Continent", lat: -72, lon: 10, books: [6, 10], desc: "Near the south pole, colder and harsher than the Basin, with towers and flying craft. Revealed in The Bands of Mourning."}
       ]},

      {id: "aagalnod", name: "Aagal Nod", aka: ["Near Eye"], group: "scadrian", books: [7], first: 7, status: "Gas giant · 2nd from the sun",
       star: {name: "Scadrial’s sun", col: "#fff0c8"}, map: orb(C.scadrial, .34, 160), distText: ORR,
       blurb: "A blue gas giant with at least six moons, the largest planet in the system. The name comes from the Nelazan people and means Near Eye.",
       short: "Blue gas giant, the Near Eye.",
       facts: [["Order", "2nd from the sun"], ["Moons", "At least six"]],
       moons: moonsN(6, 2.2), gfx: gas(["#1a3a8a", "#3a6ac8", "#6a9ae8", "#3a6ac8", "#2a4aa8", "#a8c8f8"], {atmo: "#8ab8ff"})},
      {id: "aagaluch", name: "Aagal Uch", aka: ["Far Eye"], group: "scadrian", books: [7], first: 7, status: "Gas giant · 3rd from the sun",
       star: {name: "Scadrial’s sun", col: "#fff0c8"}, map: orb(C.scadrial, .46, 280), distText: ORR,
       blurb: "A red gas giant with at least five moons and a ring system. Its Nelazan name means Far Eye. A comet belt lies beyond it.",
       short: "Red, ringed gas giant, the Far Eye.",
       facts: [["Order", "3rd from the sun"], ["Moons", "At least five"], ["Rings", "Yes"]],
       moons: moonsN(5, 2.8), ring: {inner: 1.4, outer: 2.1, c1: "#d09080", c2: "#805048", tilt: .3},
       gfx: gas(["#6a1a14", "#a0302a", "#c85a44", "#a0302a", "#801e1a", "#e8a088"], {atmo: "#ff9a80"})},
      {id: "scaddwarf1", name: "Dwarf planet (inner)", group: "scadrian", books: [7], first: 7, status: "Dwarf planet beyond the comet belt",
       star: {name: "Scadrial’s sun", col: "#fff0c8"}, map: orb(C.scadrial, .6, 90), distText: ORR,
       blurb: "One of two unnamed dwarf planets at the edge of the Scadrian system, outside the comet belt.",
       facts: [["Order", "Beyond the comet belt"]], gfx: rock(["#3a3a40", "#5a5a62", "#7a7a82", "#8a8a92", "#a0a0a8", "#e0e0e6"])},
      {id: "scaddwarf2", name: "Dwarf planet (outer)", group: "scadrian", books: [7], first: 7, status: "Dwarf planet beyond the comet belt",
       star: {name: "Scadrial’s sun", col: "#fff0c8"}, map: orb(C.scadrial, .68, 215), distText: ORR,
       blurb: "The second unnamed dwarf planet at the edge of the Scadrian system, outside the comet belt.",
       facts: [["Order", "Outermost"]], gfx: rock(["#3a3630", "#5a5448", "#7a7266", "#8a8276", "#a09888", "#e4e0d8"])},

      /* ============================ THE SELISH SYSTEM (system chart: Mashe, Donne, Sel + Oem, asteroid belt, Ky, Ralen, comet belt, dwarf planet) ============================ */
      {id: "mashe", name: "Mashe", group: "selish", books: [1, 7], first: 1, major: true, status: "Star of the Selish system",
       star: {name: "Mashe", col: "#fff6e0"}, map: C.sel, distText: CHARTPOS,
       blurb: "Sel’s sun. Its name holds the Aon Ashe, light.",
       short: "Star of the Selish system.",
       facts: [["Planets", "Donne, Sel, Ky, Ralen, a dwarf planet"]], gfx: sun("#fff0c0", HOTY)},
      {id: "donne", name: "Donne", aka: ["Doo"], group: "selish", books: [7], first: 7, status: "1st from Mashe",
       star: {name: "Mashe", col: "#fff6e0"}, map: orb(C.sel, .13, 250), distText: ORR,
       blurb: "The innermost planet. It lies in the habitable zone but is barren, very hot and scoured by dust storms.",
       short: "Hot, dusty and barren.", facts: [["Order", "1st from Mashe"]],
       gfx: {type: "desert", sea: .05, pal: ["#3a2818", "#5a3a20", "#b08458", "#c09468", "#a07a50", "#e8d8c0"], clouds: .3, cloudCol: "#c8a878", atmo: "#e0b080", atmoK: .9, sw: "#c09468"}},

      {id: "sel", name: "Sel", aka: ["Seol"], group: "selish", books: [1, 7], first: 1, major: true, status: "2nd from Mashe · Shardworld of Devotion and Dominion",
       star: {name: "Mashe", col: "#fff6e0"}, map: orb(C.sel, .22, 30), distText: ORR, hero: "elantris",
       blurb: "Once the city of Elantris shone, and anyone the Shaod took became a near-immortal with silver skin and power drawn from the Aons, the symbols of their writing. Ten years ago it all failed. Now Elantris is a rotting prison where the newly taken are thrown, Arelon is ruled by a merchant king, and the empire of Fjorden, which holds most of the continent, sends priests to convert what is left.",
       short: "The world of Elantris and The Emperor’s Soul.",
       eras: {7: {facts: [["Order", "2nd from Mashe"], ["Moon", "Oem"], ["Shards", "Devotion and Dominion, both splintered"], ["Magic", "AonDor, Forgery, Dakhor and more, tied to the land"], ["Nations", "Arelon, Teod, the Fjordell Empire, the Rose Empire"]]}},
       facts: [["Order", "2nd from Mashe"], ["Moon", "Oem"], ["Continents", "Opelon (Sycla) and a northern continent"], ["Magic", "AonDor, drawn from the shape of the land"]],
       moons: [{name: "Oem", size: .2, dist: 3.2, speed: .04, gfx: rock(["#a8b8c8", "#c0d0e0", "#d8e4ee", "#e0eaf2", "#eef4fa", "#ffffff"])}],
       gfx: {type: "terran", sea: .62, freq: 1.5, pal: ["#0c2240", "#2c6a92", "#4a7a40", "#6a8a4a", "#8a8068", "#f0f0ee"],
             clouds: .35, atmo: "#8ab8ff", lights: .25, sw: "#6a8a4a",
             feat: [
               {k: "continent", at: [14, 4], r: 30, s: .3},
               {k: "continent", at: [22, -30], r: 11, s: .28},
               {k: "range", from: [32, -21], to: [8, -20], w: 2.6, s: .34},
               {k: "river", from: [24, -33], to: [30, -30], w: .8, s: .4},
               {k: "basin", at: [21, -33], r: 1.6, s: .25},
               {k: "river", from: [17, -36], to: [17, -24], w: .8, s: .45},
               {k: "biome", at: [-14, 6], r: 16, s: .9, style: "grass", c: "#c8a868"},
               {k: "continent", at: [56, -20], r: 18, s: .3},
               {k: "continent", at: [44, -40], r: 6, s: .26},
               {k: "range", from: [50, -42], to: [52, -16], w: 2.4, s: .3},
               {k: "biome", at: [60, -20], r: 12, s: .8, style: "farm", c: "#a89a5a"},
               {k: "biome", at: [16, 8], r: 18, s: .5, style: "farm", c: "#6a8a48"}
             ]},
       sites: [
         {id: "elantris", name: "Elantris", lat: 32, lon: -31, books: [1, 7], desc: "The fallen city of the Elantrians on Arelon’s north coast by the Sea of Fjorden, its walls now holding the Shaod’s victims. Raoden is thrown in here at the start of the book."},
         {id: "kae", name: "Kae", lat: 32, lon: -27, books: [1], desc: "The town east of Elantris that became Arelon’s capital after the fall."},
         {id: "kondeon", name: "Kondeon", lat: 27, lon: -31, books: [1], desc: "A town on the Aredel River south of Elantris."},
         {id: "alonoe", name: "Lake Alonoe", lat: 21, lon: -33, sea: true, books: [1], desc: "The lake at the heart of Arelon."},
         {id: "chasm", name: "The Chasm", lat: 17, lon: -30, books: [1], desc: "A great rift near Kaln that opened during the Reod. Raoden realises the land itself is part of the Aons, and the Chasm broke them."},
         {id: "fellavoo", name: "Fellavoo", lat: 11, lon: -26, books: [1], desc: "A city of Duladel, just south of Arelon."},
         {id: "fjorden", name: "Fjorden", lat: 22, lon: 2, books: [1], desc: "Heart of the Fjordell Empire and seat of the Wyrn, whose Derethi church sends gyorns like Hrathen to convert the east."},
         {id: "jindo", name: "JinDo", lat: 9, lon: -16, books: [1], desc: "A land south-east of Arelon whose people Fjorden absorbed; home of the city of HaiKo."},
         {id: "svorden", name: "Svorden", lat: 34, lon: 32, books: [1], desc: "A north-eastern nation of the Fjordell Empire."},
         {id: "hrovell", name: "Hrovell", lat: 2, lon: 26, books: [1], desc: "A south-eastern part of the Fjordell Empire."},
         {id: "teod", name: "Teoras, Teod", lat: 44, lon: -40, sea: true, books: [1], desc: "Capital of Teod, Sarene’s homeland, on a peninsula of the northern continent. Its navy rules the Northern Sea."},
         {id: "roseempire", name: "The Rose Empire", lat: 60, lon: -20, books: [7], desc: "North of Teod beyond the mountains, the empire where the Forger Shai rebuilds the emperor’s soul in The Emperor’s Soul. Its provinces include Dzhamar and MaiPon."},
         {id: "desert", name: "The southern desert", lat: -12, lon: 4, books: [1], desc: "A vast desert south of the known nations of Opelon."}
       ]},

      {id: "ky", name: "Ky", aka: ["Kii"], group: "selish", books: [7], first: 7, status: "Gas giant · beyond the asteroid belt",
       star: {name: "Mashe", col: "#fff6e0"}, map: orb(C.sel, .38, 150), distText: ORR,
       blurb: "The first planet past the Selish asteroid belt, apparently a gas giant with four moons. Its other name, Kii, is the Aon for justice.",
       short: "Gas giant with four moons.", facts: [["Order", "3rd planet, beyond the asteroid belt"], ["Moons", "Four"]],
       moons: moonsN(4, 2.3), gfx: gas(["#3a2a6a", "#5a4a9a", "#8a7ac8", "#5a4a9a", "#4a3a80", "#c0b4e8"], {atmo: "#b0a0ff"})},
      {id: "ralen", name: "Ralen", aka: ["Raa"], group: "selish", books: [7], first: 7, status: "Gas giant · the largest Selish planet",
       star: {name: "Mashe", col: "#fff6e0"}, map: orb(C.sel, .5, 300), distText: ORR,
       blurb: "Apparently a gas giant, and the largest planet of the system, with five moons and a ring system. A comet belt lies beyond it.",
       short: "Ringed gas giant with five moons.", facts: [["Order", "4th planet"], ["Moons", "Five"], ["Rings", "Yes"]],
       moons: moonsN(5, 2.8), ring: {inner: 1.4, outer: 2.2, c1: "#e8b0d0", c2: "#906080", tilt: .35},
       gfx: gas(["#8a2a6a", "#b04a8a", "#d880b4", "#b04a8a", "#9a3a7a", "#f4c4e0"], {atmo: "#ffa0d8"})},
      {id: "seldwarf", name: "Dwarf planet", group: "selish", books: [7], first: 7, status: "At the system’s edge",
       star: {name: "Mashe", col: "#fff6e0"}, map: orb(C.sel, .6, 80), distText: ORR,
       blurb: "A small, unnamed dwarf planet just outside the Selish comet belt, at the edge of the system.",
       facts: [["Order", "Outermost"]], gfx: rock(["#3a3a44", "#5a5a66", "#7a7a86", "#8a8a96", "#a0a0ac", "#e4e4ec"])},

      /* ============================ THE NALTHIAN SYSTEM (system chart: sun, Nalthis + Rrendos, cognitive anomaly, Farkeeper the Bright, Nightstar the Hidden, comet belt) ============================ */
      {id: "nalthsun", name: "Nalthis’s sun", group: "nalthian", books: [3], first: 3, major: true, status: "Star of the Nalthian system",
       star: {name: "Nalthis’s sun", col: "#fff2c8"}, map: C.nalthis, distText: CHARTPOS,
       blurb: "A yellow star much like Scadrial’s and Sel’s, in the constellation known as the Giver.",
       short: "Yellow star of the Nalthian system.", facts: [["Planets", "Nalthis, Farkeeper the Bright, Nightstar the Hidden"]], gfx: sun("#ffe8a0", HOTY)},

      {id: "nalthis", name: "Nalthis", group: "nalthian", books: [3, 5, 7], first: 3, major: true, status: "Shardworld of Endowment",
       star: {name: "Nalthis’s sun", col: "#fff4dc"}, map: orb(C.nalthis, .2, 330), distText: ORR, hero: "ttelir",
       blurb: "A bright, tropical world where every person is born with one Breath, which can be given away. Those who gather many see colour more vividly, live longer and can Awaken objects. Hallandren, rich and full of colour, is ruled by Returned gods; the stern highland kingdom of Idris fears it, and two sisters are caught between them.",
       short: "The world of Warbreaker.",
       facts: [["Order", "Innermost known planet"], ["Moon", "Rrendos"], ["Shard", "Endowment"], ["Magic", "Awakening with Breath; the Returned"], ["Nations", "Hallandren, Idris, Pahn Kahl"], ["Orbit shared with", "A cognitive anomaly"]],
       moons: [{name: "Rrendos", size: .18, dist: 3, speed: .04, gfx: rock(["#4a3a5a", "#6a5a7a", "#8a7a9a", "#9a8aaa", "#b0a0c0", "#e8e0f0"])}],
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
      {id: "farkeeper", name: "Farkeeper the Bright", group: "nalthian", books: [7], first: 7, status: "Red gas giant · the largest Nalthian planet",
       star: {name: "Nalthis’s sun", col: "#fff2c8"}, map: orb(C.nalthis, .38, 120), distText: ORR,
       blurb: "A red gas giant, the largest planet in the system, with at least six moons.",
       short: "Red gas giant with six moons.", facts: [["Moons", "At least six"]],
       moons: moonsN(6, 2.2), gfx: gas(["#7a2010", "#b0401e", "#d86a3a", "#b0401e", "#902e18", "#f4b088"], {atmo: "#ffa070"})},
      {id: "nightstar", name: "Nightstar the Hidden", group: "nalthian", books: [7], first: 7, status: "Small violet outer planet",
       star: {name: "Nalthis’s sun", col: "#fff2c8"}, map: orb(C.nalthis, .58, 230), distText: ORR,
       blurb: "A small violet planet a long way out beyond Farkeeper. A comet belt past it marks the edge of the system.",
       short: "Small, distant, violet.", facts: [["Order", "Outermost"]],
       gfx: rock(["#2a1a4a", "#4a3a7a", "#6a5aa0", "#7a6ab0", "#9a8ac8", "#e0d8f4"], {atmo: "#b0a0ff", atmoK: .4})},

      /* ============================ THE THRENODITE SYSTEM (system chart: red sun, Monody, Elegy + Coronach, Threnody, far-out Purity) ============================ */
      {id: "threnosun", name: "Threnody’s sun", group: "threnodite", books: [7], first: 7, major: true, status: "Red star of the Threnodite system",
       star: {name: "Threnody’s sun", col: "#ff9a70"}, map: C.threnody, distText: CHARTPOS,
       blurb: "A red star. In the empty space of this system the Shards Ambition, Odium and probably Mercy fought; Ambition was mortally wounded, and planets that once orbited here were destroyed. The twisted Investiture on Threnody is at least partly a scar of that battle.",
       short: "Red star where Ambition was wounded.", facts: [["Planets", "Monody, Elegy, Threnody, Purity"]], gfx: sun("#ff8a50", HOTR)},
      {id: "monody", name: "Monody", group: "threnodite", books: [7], first: 7, status: "1st from the sun",
       star: {name: "Threnody’s sun", col: "#ff9a70"}, map: orb(C.threnody, .12, 70), distText: ORR,
       blurb: "The planet closest to the sun, similar in size to Elegy and Threnody.", facts: [["Order", "1st from the sun"]],
       gfx: rock(["#3a2018", "#5a3428", "#7a5040", "#8a604c", "#a07a64", "#e0c8b8"])},
      {id: "elegy", name: "Elegy", group: "threnodite", books: [7], first: 7, status: "2nd from the sun",
       star: {name: "Threnody’s sun", col: "#ff9a70"}, map: orb(C.threnody, .19, 200), distText: ORR,
       blurb: "The second planet, with one moon, Coronach.", facts: [["Order", "2nd from the sun"], ["Moon", "Coronach"]],
       moons: [{name: "Coronach", size: .16, dist: 2.8, speed: .05}], gfx: rock(["#2a2a30", "#4a4a52", "#6a6a72", "#7a7a82", "#9a9aa2", "#e0e0e6"], {atmoK: .4, atmo: "#c0b0b0"})},

      {id: "threnody", name: "Threnody", group: "threnodite", books: [7], first: 7, major: true, status: "3rd from the sun · scarred by Ambition’s death",
       star: {name: "Threnody’s sun", col: "#ff9a70"}, map: orb(C.threnody, .26, 320), distText: ORR, hero: "waystop",
       blurb: "A grim frontier world under a red sun. Humans came from the larger continent, now called the Fallen World, where something known only as the Evil appeared long after the Shards left. On the smaller continent the dead linger as shades in the Forests of Hell. Shed blood draws them, and a shade’s touch kills. Silence Montane runs a waystop for travellers and secretly hunts bounties to keep it afloat.",
       short: "The Forests of Hell.",
       facts: [["Order", "3rd from the sun · no moon"], ["Shard", "Ambition (its death left its mark)"], ["Continents", "The Fallen World and the forested continent"], ["Danger", "Shades in the forests"]],
       gfx: {type: "terran", sea: .55, freq: 1.4, pal: ["#0a141c", "#1a3038", "#1a3424", "#22402c", "#4a5048", "#c8ccd0"],
             clouds: .5, cloudCol: "#a8b0b4", atmo: "#c09890", amb: .03, sw: "#22402c",
             feat: [{k: "continent", at: [20, 20], r: 22, s: .3}, {k: "biome", at: [20, 20], r: 20, s: 1, style: "forest", c: "#14301e"},
                    {k: "continent", at: [-10, -110], r: 34, s: .3}, {k: "biome", at: [-10, -110], r: 26, s: .8, style: "rock", c: "#5a5048"}]},
       sites: [
         {id: "waystop", name: "Silence’s waystop", lat: 18, lon: 22, books: [7], desc: "The roadside inn deep in the forest that Silence keeps going for her family."},
         {id: "lastport", name: "Lastport", lat: 10, lon: 8, books: [7], desc: "The most powerful city on the forested continent, where bounties are paid."},
         {id: "bastion", name: "Bastion Hill", lat: 28, lon: 30, books: [7], desc: "A fortress town in the mountains."},
         {id: "fallenworld", name: "The Fallen World", lat: -10, lon: -110, books: [7], desc: "The larger continent, humanity’s first home on Threnody, abandoned to the Evil."}
       ]},
      {id: "purity", name: "Purity", group: "threnodite", books: [7], first: 7, status: "Outermost planet · much the largest",
       star: {name: "Threnody’s sun", col: "#ff9a70"}, map: orb(C.threnody, .7, 120), distText: ORR,
       blurb: "The outermost planet, much farther out than the other three and much larger than any of them.", facts: [["Order", "4th, far out"]],
       gfx: gas(["#6a1410", "#9a2a1e", "#c84a34", "#9a2a1e", "#7a1e16", "#f09078"], {atmo: "#ff8a70"})},

      /* ============================ THE TALDAIN SYSTEM (binary: AisDa and the Eye of Ridos; Taldain at a Lagrange point; moon Nizh Da) ============================ */
      {id: "aisda", name: "AisDa", group: "taldain", books: [7], first: 7, major: true, status: "Blue-white supergiant",
       star: {name: "AisDa", col: "#dce8ff"}, map: C.taldain, distText: CHARTPOS,
       blurb: "The larger star of the Taldain system, a blue-white supergiant, which holds both the Eye of Ridos and Taldain in orbit. Its light is central to how Autonomy Invests the planet.",
       short: "Blue-white supergiant.", facts: [["Companion", "The Eye of Ridos"]], gfx: sun("#dce8ff", HOTW)},
      {id: "ridos", name: "The Eye of Ridos", aka: ["Ridos"], group: "taldain", books: [7], first: 7, status: "White dwarf behind a particle ring",
       star: {name: "The Eye of Ridos", col: "#f0f4ff"}, map: orb(C.taldain, .5, 90), distText: ORR,
       blurb: "A faint white dwarf wrapped in a dense ring of particles. Every seven orbits of Taldain’s moon it sends pulses of light and Investiture through the ring.",
       short: "White dwarf behind the dust.", facts: [["Ring", "A dense particle cloud"]], ring: {inner: 1.6, outer: 3.2, c1: "#8a8070", c2: "#3a3430", tilt: .1},
       gfx: sun("#f0f4ff", HOTW, {atmoK: .6})},
      {id: "taldain", name: "Taldain", group: "taldain", books: [7], first: 7, status: "Sole planet · Shardworld of Autonomy",
       star: {name: "AisDa", col: "#dce8ff"}, map: orb(C.taldain, .3, 90), distText: ORR, hero: "kerla",
       blurb: "The only planet of a binary system, held at a Lagrange point between the two stars and tidally locked. Dayside always faces AisDa and is covered in white sand; Darkside always faces the Eye of Ridos, hidden behind its dust. On Dayside the Sand Masters fight with ribbons of sand. Kenton, son of their leader, is left as the only master after a massacre.",
       short: "Dayside’s white sand: White Sand.",
       facts: [["Shard", "Autonomy"], ["Moon", "Nizh Da, on a polar orbit over the twilight line"], ["Magic", "Sand mastery"], ["Peculiarity", "One face to each star"]],
       moons: [{name: "Nizh Da", size: .16, dist: 2.8, speed: .05}],
       gfx: {type: "desert", sea: .08, freq: 1.3, dune: 12, pal: ["#3a3a40", "#6a6a70", "#f2ece0", "#e8dcc8", "#d8c8b0", "#ffffff"],
             clouds: .05, atmo: "#ffffff", atmoK: .7, sw: "#f2ece0"},
       sites: [
         {id: "kerla", name: "Kerla", lat: 4, lon: 10, books: [7], desc: "The desert of Dayside, home of the Diem, the order of Sand Masters."},
         {id: "darkside", name: "Darkside", lat: 0, lon: -160, books: [7], desc: "The night face of the world, where Khriss comes from. Its peoples have magic of their own."}
       ]},

      /* ============================ THE DROMINAD SYSTEM (system chart: sun, First of the Sun + First of the First, Second, Third, Fourth, asteroid belt, Fifth, Sixth, Seventh) ============================ */
      {id: "drominad", name: "Drominad", group: "drominad", books: [7, 12], first: 7, major: true, status: "Star of the Drominad system",
       star: {name: "Drominad", col: "#e8f0ff"}, map: C.drominad, distText: CHARTPOS,
       blurb: "The star of First of the Sun, painted pale blue-white on the system chart. Seven planets circle it, named simply by their order: four small worlds in the habitable zone, an asteroid belt, then three gas giants.",
       short: "Star of the Drominad system.", facts: [["Planets", "First to Seventh of the Sun"]], gfx: sun("#e8f0ff", HOTW)},

      {id: "firstsun", name: "First of the Sun", group: "drominad", books: [7, 12], first: 7, status: "1st planet · archipelago world",
       star: {name: "Drominad", col: "#e8f0ff"}, map: orb(C.drominad, .14, 30), distText: ORR, hero: "patji",
       blurb: "An ocean world with one large mainland and many islands where the Eelakin live. The greatest island, Patji, is a jungle where almost everything can kill you. Trappers like Dusk survive by knowing its rules and by the Aviar, birds that give their owners talents such as seeing danger coming. Now ships from the Ones Above have arrived in orbit.",
       short: "Patji and the Aviar: Sixth of the Dusk.",
       eras: {12: {blurb: "An ocean world of islands. The greatest, Patji, is a deadly jungle where the Aviar live, and Patji itself is an avatar of Autonomy. Years after the Ones Above appeared, Dusk sees his people racing to modernise before they are conquered, and he sails through Patji’s Eye into the Emberdark to find help.",
                   facts: [["Order", "1st from Drominad"], ["Moon", "First of the First"], ["Power", "Patji, an avatar of Autonomy"], ["Magic", "Aviar birds"], ["Gate", "Patji’s Eye"]]}},
       facts: [["Order", "1st from Drominad"], ["Moon", "First of the First"], ["People", "The Eelakin"], ["Magic", "Aviar birds"], ["Threat", "The Ones Above"]],
       moons: [{name: "First of the First", size: .18, dist: 3, speed: .04}],
       gfx: {type: "archipelago", sea: .72, freq: 2.2, pal: ["#062a48", "#1a8ab0", "#2a7a3a", "#3a8a2a", "#4a6a3a", "#e0e8d8"],
             clouds: .4, atmo: "#7ac8ff", moist: .4, sw: "#3a8a2a",
             feat: [{k: "continent", at: [4, 0], r: 8, s: .35}, {k: "peak", at: [4, 0], r: 2, s: .3}, {k: "continent", at: [30, 80], r: 22, s: .3}]},
       sites: [
         {id: "patji", name: "Patji", lat: 4, lon: 2, books: [7, 12], desc: "The Father island, a jungle that punishes every mistake. Dusk traps Aviar here."},
         {id: "patjiseye", name: "Patji’s Eye", rel: {to: "patji", dlat: 3, dlon: 2}, books: [12], desc: "A sacred place on Patji that is in fact a perpendicularity, a gateway between the realms. Dusk sails through it into the Emberdark."},
         {id: "homeisles", name: "The Eelakin islands", lat: -10, lon: -20, sea: true, books: [7, 12], desc: "The gentler islands where Dusk’s people live and where the change brought by the Ones Above is felt first."},
         {id: "mainland", name: "The mainland", lat: 30, lon: 80, books: [7, 12], desc: "The one large landmass of First of the Sun."}
       ]},
    ]).concat([
      ["secondsun", "Second of the Sun", .21, 150, "A habitable-zone world, smaller than First of the Sun, where water is the main surface feature. It may hold fully developed human societies.", {type: "ocean", sea: .8, pal: ["#0a2a4a", "#2a6a9a", "#6a8a6a", "#7a9a7a", "#9aa89a", "#eef2f4"], clouds: .45, atmo: "#9ac8ff", sw: "#2a6a9a"}, []],
      ["thirdsun", "Third of the Sun", .27, 260, "Apparently the smallest planet in the system. It may hold human societies.", rock(["#3a3a3e", "#5a5a60", "#8a8a8e", "#9a9a9e", "#b0b0b4", "#eaeaec"], {atmoK: .6, atmo: "#c0d0e0"}), []],
      ["fourthsun", "Fourth of the Sun", .33, 20, "The last planet in the habitable zone and the last that might hold fully developed human societies. It appears to have rings. An asteroid belt lies beyond it.", rock(["#4a4038", "#6a5a4a", "#8a7a66", "#9a8a76", "#b0a08c", "#ece4dc"], {atmoK: .6, atmo: "#d0d8e0"}), [], {inner: 1.4, outer: 1.9, c1: "#c8c0b0", c2: "#706858", tilt: .3}],
      ["fifthsun", "Fifth of the Sun", .46, 110, "The first gas giant past the asteroid belt, with three major moons and a ring system.", gas(["#1a5a5a", "#2a8a8a", "#5ab8b0", "#2a8a8a", "#1e6e6e", "#a0e0d8"], {atmo: "#8ae0d8"}), moonsN(3, 2.4), {inner: 1.4, outer: 2, c1: "#b0d8d0", c2: "#5a8a84", tilt: .25}],
      ["sixthsun", "Sixth of the Sun", .58, 220, "A gas giant with four major moons and a ring system, apparently the largest planet in the Drominad system.", gas(["#2a7a4a", "#4aa86a", "#8ad8a8", "#4aa86a", "#3a8a5a", "#c8f0d8"], {atmo: "#a0f0c0"}), moonsN(4, 2.4), {inner: 1.4, outer: 2.2, c1: "#c0e8c8", c2: "#5a8a64", tilt: .3}],
      ["seventhsun", "Seventh of the Sun", .7, 330, "The outermost planet, a gas giant with four major moons.", gas(["#1a3a7a", "#3a5aa8", "#6a8ad0", "#3a5aa8", "#2a4a90", "#b0c8f0"], {atmo: "#90b0ff"}), moonsN(4, 2.4)]
    ].map(function (g, i) {
      var w = {id: g[0], name: g[1], group: "drominad", books: [7], first: 7, status: (i + 2) + (i === 0 ? "nd" : i === 1 ? "rd" : "th") + " planet from Drominad",
        star: {name: "Drominad", col: "#e8f0ff"}, map: orb(C.drominad, g[2], g[3]), distText: ORR, blurb: g[4],
        facts: [["Order", (i + 2) + " of 7"]].concat(g[6].length ? [["Moons", g[6].length + " major"]] : []), gfx: g[5]};
      if (g[6].length) w.moons = g[6];
      if (g[7]) w.ring = g[7];
      return w;
    })).concat([
      {id: "lumar", name: "Lumar", group: "wider", books: [11], first: 11, status: "World of the spore seas · near the Drominad system",
       star: {name: "Lumar’s sun", col: "#fff2dc"}, map: U.lumar, est: true, distText: "Not on the star chart. Close to the Drominad system: under a year by sublight starship (moved apart here to be visible)",
       blurb: "There is no water to sail here. Twelve moons hang close overhead, and from each one spores rain down to make an ocean: an emerald sea, a crimson sea, a midnight sea and more. Touch spores with water and they burst. Tress, a girl who collects cups on a dull little island, sets out across these seas to rescue the boy she loves from a Sorceress.",
       short: "Seas of spores: Tress of the Emerald Sea.",
       eras: {12: {facts: [["Moons", "Twelve, each home to an aether"], ["Seas", "Emerald, Crimson, Midnight, Sapphire, Rose and more"], ["Network", "Part of the Dhatrian planetary network"], ["Neighbour", "First of the Sun, under a year by sublight ship"]]}},
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

      /* ============================ THE UTOL SYSTEM (red-orange sun; UTol and Komashi, a double planet) ============================ */
      {id: "utolsun", name: "UTol’s sun", group: "utol", books: [11], first: 11, major: true, status: "Red-orange star",
       star: {name: "UTol’s sun", col: "#ffb070"}, map: U.utol, est: true, distText: SCHEM,
       blurb: "A large red-orange star, bigger than Roshar’s and comparatively close to its inhabited planets. UTol and Komashi orbit it together as a double planet.",
       short: "Red-orange star of UTol and Komashi.", facts: [["Planets", "UTol and Komashi (a pair)"]], gfx: sun("#ffa060", HOTR)},
      {id: "utol", name: "UTol", group: "utol", books: [11], first: 11, status: "Ocean world · Komashi’s twin",
       star: {name: "UTol’s sun", col: "#ffb070"}, map: orb(U.utol, .26, 50), est: true, distText: SCHEM,
       blurb: "An ocean world with very few landmasses, home to the Sho Del. From Komashi it shines as a pale blue star, the only light that reached through the shroud.",
       short: "Ocean twin of Komashi.", facts: [["People", "The Sho Del"], ["Twin", "Komashi"]],
       gfx: {type: "ocean", sea: .88, pal: ["#0a2a6a", "#2a6ac0", "#6a9a7a", "#7aaa8a", "#9ab09a", "#f0f4f8"], clouds: .4, atmo: "#9ac8ff", sw: "#2a6ac0"}},
      {id: "komashi", name: "Komashi", group: "utol", books: [11], first: 11, status: "Double world with UTol",
       star: {name: "UTol’s sun", col: "#ffb070"}, map: orb(U.utol, .3, 70), est: true, distText: SCHEM, hero: "kilahito",
       blurb: "Half of a double planet circling a big red-orange sun, with its twin UTol shining blue in the sky. In one age, Yumi stacks stones to honour the spirits that warm the land. In another, a black shroud hides the sky, nightmares come out of it, and Nikaro paints them away for a living. A spirit binds the two of them together.",
       short: "Stone-stacking and nightmare-painting: Yumi and the Nightmare Painter.",
       eras: {12: {status: "Shroud lifted"}},
       facts: [["Twin", "UTol"], ["Spirits", "The hijo"], ["Shard", "Virtuosity splintered nearby"], ["Nations", "Torio (ancient), Nagadan"]],
       gfx: {type: "desert", sea: .32, freq: 1.4, pal: ["#0c1a30", "#2a4a6a", "#7a5a40", "#8a6a48", "#a08060", "#e0d8c8"],
             clouds: .1, atmo: "#ffb880", atmoK: .8, lights: .4, sw: "#8a6a48",
             feat: [{k: "basin", at: [10, 0], r: 6, s: .05}, {k: "biome", at: [10, 0], r: 6, s: .8, style: "grass", c: "#6a8a48"}]},
       sites: [
         {id: "kilahito", name: "Kilahito", lat: 12, lon: 6, books: [11], desc: "A round city in Nagadan, built around a hion line under the shroud, where Nikaro paints nightmares."},
         {id: "torio", name: "Torio City", lat: 8, lon: -6, books: [11], desc: "Ruins of the oldest kingdom, Torio, where the machine that made the shroud was built."},
         {id: "steamwells", name: "The steamwells", lat: 6, lon: -12, books: [11], desc: "Warm springs where Yumi’s people lived, heated by the hijo under the ground."}
       ]},

      /* ============================ YOLEN and the other worlds off the chart ============================ */
      {id: "yolen", name: "Yolen", group: "origin", books: [7, 12], first: 7, major: true, status: "Where Adonalsium was shattered · hidden",
       star: {name: "Yolen’s sun", col: "#fff4e0"}, map: U.yolen, est: true, distText: "Hidden: not on the star chart, position unknown",
       blurb: "The world where it all began. Humans, dragons and the strange Sho Del all came from Yolen, and it was here, long before any of the books, that a group of conspirators shattered Adonalsium into sixteen Shards. Khriss writes that it is shrouded and hidden somewhere in the cosmere. The books have barely shown the planet itself; this surface is an interpretation.",
       short: "Origin of humanity and of the Shattering.",
       eras: {12: {blurb: "The world where it all began. Humans, dragons and the Sho Del all came from Yolen, and it was here that Adonalsium was shattered into sixteen Shards. It is hidden from most of the cosmere. In Isles of the Emberdark, Starling, a young dragon living in human form, was exiled from Yolen twelve years before the story. The planet itself is still barely described; this surface is an interpretation."}},
       facts: [["Known for", "The Shattering of Adonalsium"], ["Peoples", "Humans, dragons, Sho Del"], ["Where", "Hidden; not on the star chart"]],
       gfx: {type: "forest", sea: .5, freq: 1.4, pal: ["#0b1d3a", "#2a5f8a", "#2f5a2e", "#4d7a3a", "#7c7a64", "#eef0f2"],
             clouds: .4, atmo: "#9ec4ff", moist: .2, sw: "#9cc28a"},
       sites: [{id: "shattering", name: "The Shattering (site unknown)", lat: 12, lon: 20, desc: "Somewhere on Yolen the conspirators struck down Adonalsium. The exact place has never been shown; this marker is ours."}]},

      {id: "canticle", name: "Canticle", group: "wider", books: [11, 12], first: 11, status: "Tiny world under a burning sun",
       star: {name: "Canticle’s sun", col: "#fff0c0"}, map: U.canticle, est: true, distText: SCHEM, hero: "union",
       blurb: "A tiny planet whose sunlight burns anything it touches, so whole cities fly around the world just ahead of the dawn. It spins backwards, rings light its night side, and a firestorm sweeps the sunset line. A stranger called Nomad lands here, hunted from world to world, and is captured by the people of the Cinder King, who rules the cities through power cells called sunhearts.",
       short: "Cities racing the dawn: The Sunlit Man.",
       eras: {12: {blurb: "A tiny planet whose sunlight burns anything it touches, so cities fly around the world ahead of the dawn. The stranger Nomad, who is Sigzil of Bridge Four years after leaving Roshar, helps the people of Beacon overthrow the Cinder King, then Skips on to UTol."}},
       facts: [["Hazard", "Sunlight that burns"], ["Power", "Sunhearts"], ["Ruler", "The Cinder King"], ["Rings", "Yes, lighting the night side"]],
       ring: {inner: 1.5, outer: 2.3, c1: "#c8a080", c2: "#806050", tilt: .2},
       gfx: {type: "lava", sea: .35, freq: 1.8, rough: .9, pal: ["#1a0a08", "#3a1a10", "#3a3030", "#4a3a34", "#6a5a50", "#a09088"],
             lava: "#ff7a30", clouds: .15, cloudCol: "#a08070", atmo: "#ffa060", atmoK: .7, lights: .3, sw: "#ff7a30"},
       sites: [
         {id: "union", name: "Union", lat: 20, lon: 10, books: [11], desc: "The largest flying city, which has swallowed most others under the Cinder King."},
         {id: "beacon", name: "Beacon", lat: 30, lon: -30, books: [11], desc: "A smaller flying city that keeps the Chorus, and the heart of the rebellion."},
         {id: "scadrianlab", name: "The Scadrian research facility", lat: -20, lon: 40, books: [11], desc: "Offworld scientists studying the sunhearts and trading technology for them."}
       ]},

      {id: "miral", name: "Miral", group: "wider", books: [12], first: 12, status: "Isolated world · Valor once worked here",
       star: {name: "Miral’s sun", col: "#fff0dc"}, map: U.miral, est: true, distText: SCHEM, hero: "kingseat",
       blurb: "A rarely visited world off the usual routes, with a perpendicularity attuned to no Shard. In the kingdom of Mountaincrest, built on an enormous gentle mountain, the rivers run with the blood of a slain monster rather than water. December, an orphan from a riverside town, learns of a plague coming and travels up the River Violet to warn the court in Kingseat.",
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

      /* worlds named in the books but never visited on the page (Coppermind: Physical Realm) */
      {id: "obrodai", name: "Obrodai", group: "named", books: [8], first: 8, status: "Claimed by Autonomy",
       star: {name: "Unknown", col: "#e8e0d0"}, map: U.obrodai, est: true, distText: SCHEM,
       blurb: "Named in a letter from Patji to Hoid in Oathbringer’s epigraphs: Autonomy has claimed it and is raising an avatar there, and Hoid is warned not to come back. Nothing else is known; this surface is a placeholder.",
       facts: [["Named in", "Oathbringer"], ["Shard", "Autonomy"]], gfx: rock(["#3a3428", "#5a5040", "#7a7058", "#8a8068", "#a09880", "#e4e0d4"], {atmoK: .5, atmo: "#d8d0b8"})},
      {id: "vax", name: "Vax", group: "named", books: [7], first: 7, status: "World with its own Investiture",
       star: {name: "Unknown", col: "#e8e0d0"}, map: U.vax, est: true, distText: SCHEM,
       blurb: "Mentioned in Mistborn: Secret History: a planet whose people are Invested in a way different from Sel, Scadrial, Nalthis or Taldain. Little else is known; this surface is a placeholder.",
       facts: [["Named in", "Mistborn: Secret History"]], gfx: rock(["#2a3a3a", "#3a5a5a", "#5a7a7a", "#6a8a8a", "#8aa0a0", "#e0ecec"], {atmoK: .5, atmo: "#a0d0d0"})},
      {id: "bjendal", name: "Bjendal", group: "named", books: [10], first: 10, status: "A Ghostblood primary system",
       star: {name: "Unknown", col: "#e8e0d0"}, map: U.bjendal, est: true, distText: SCHEM,
       blurb: "Named in The Lost Metal as one of the Ghostbloods’ primary systems. Travel to it through the Cognitive Realm has been disrupted, probably by trouble with its perpendicularity. This surface is a placeholder.",
       facts: [["Named in", "The Lost Metal"]], gfx: rock(["#2a2a3a", "#40405a", "#5a5a78", "#6a6a88", "#8888a0", "#e0e0ec"], {atmoK: .5, atmo: "#b0b0e0"})},
      {id: "mythos", name: "Mythos", group: "named", books: [10], first: 10, status: "An off-world nickname",
       star: {name: "Unknown", col: "#e8e0d0"}, map: U.mythos, est: true, distText: SCHEM,
       blurb: "Named in The Lost Metal’s epilogue, where Kelsier lists it as a possible source of allies after Autonomy’s attack on Scadrial is turned back. Mythos is an off-world nickname for a planet. This surface is a placeholder.",
       facts: [["Named in", "The Lost Metal"]], gfx: rock(["#3a2a3a", "#5a405a", "#7a5a7a", "#8a6a8a", "#a088a0", "#ece0ec"], {atmoK: .5, atmo: "#e0b0e0"})},
      {id: "dhatri", name: "Dhatri", group: "named", books: [12], first: 12, status: "Homeworld of the Aethers",
       star: {name: "Unknown", col: "#e8e0d0"}, map: U.dhatri, est: true, distText: SCHEM,
       blurb: "Named in Isles of the Emberdark: the homeworld of the Aethers and the centre of the Dhatrian planetary network, which includes Lumar. It has lost its perpendicularity but has starships. This surface is a placeholder.",
       facts: [["Named in", "The Lost Metal and Isles of the Emberdark"], ["Network", "The Dhatrian planetary network"]],
       gfx: {type: "forest", sea: .5, pal: ["#0a2a2a", "#1a5a5a", "#2a6a4a", "#3a7a5a", "#6a7a6a", "#e0eee8"], clouds: .3, atmo: "#a0e8d0", sw: "#2a6a4a"}},

      /* ============================ THE COGNITIVE REALM ============================ */
      {id: "shadesmar", name: "Shadesmar (Roshar)", group: "cognitive", books: [4, 5, 8, 9, 12], first: 4, status: "Roshar’s Cognitive Realm",
       star: {name: "A small, distant sun", col: "#e8e0ff"}, map: [C.roshar[0], C.roshar[1], .38], distText: COG,
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
       star: {name: "No sun of its own", col: "#e0e8ff"}, map: [SOL[0], SOL[1], .62], distText: COG, craft: true,
       blurb: "A city built in the Cognitive Realm, where scholars and travellers from many worlds meet. Much of what the books tell us about the wider cosmere comes from people based here, including the essays in Arcanum Unbounded. The author has said the star chart may have been drawn from here, though he has not confirmed it. Its codes of conduct are honoured, at least on paper, across many worlds.",
       short: "The crossroads city of worldhoppers.",
       facts: [["Realm", "Cognitive"], ["Known for", "Scholarship, star charts, the Silverlight Codes"]],
       gfx: {type: "city", sea: .3, pal: ["#1a1a30", "#2a2a48", "#5a5a6a", "#6a6a7a", "#9a9aac", "#e8e8f4"],
             clouds: .1, atmo: "#c0c8ff", lights: 1, lightCol: "#d8e0ff", amb: .05, sw: "#9a9aac"},
       sites: [{id: "slcity", name: "The city", lat: 10, lon: 0, books: [7], desc: "The books describe Silverlight mostly through its scholars and its rules. This surface is our own interpretation."}]},

      {id: "emberdark", name: "The Emberdark", group: "cognitive", books: [12], first: 12, status: "A region of the Cognitive Realm",
       star: {name: "None", col: "#ff9a60"}, map: [C.drominad[0], C.drominad[1], .36], distText: COG,
       blurb: "A dark region of the Cognitive Realm that Dusk enters through Patji’s Eye. Here he meets Starling, a young dragon serving on a starship, who has found a map to a hidden gate back into the physical world.",
       short: "Where Dusk meets Starling.",
       facts: [["Realm", "Cognitive"], ["Book", "Isles of the Emberdark"]],
       gfx: {type: "lava", sea: .5, freq: 2, pal: ["#06040a", "#140a10", "#1a1014", "#24161a", "#3a2420", "#6a4a3a"],
             lava: "#ff6a30", clouds: 0, atmo: "#ff8a50", atmoK: .5, amb: .02, sw: "#ff6a30"},
       sites: [{id: "hiddengate", name: "The hidden gate", lat: 0, lon: 0, books: [12], desc: "The way back to the physical world shown on Starling’s old map."}]}
    ]),

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
        {name: "Autonomy", books: [7, 10], desc: "Shard of Taldain, who likes many avatars and dislikes rivals.", more: [[8, "Claims the world of Obrodai and raises an avatar there."], [10, "Reaches toward Scadrial in The Lost Metal."], [12, "Patji, the deadly island of First of the Sun, is one of its avatars."]]},
        {name: "Ambition", first: 7, desc: "A Shard mortally wounded in a battle with Odium, and probably Mercy, in the empty space of the Threnodite system. The battle destroyed planets there and still twists the Investiture on Threnody."},
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
      home: {at: {sol: [0, 0, 0]}, dist: 46, pitch: .62, dur: 2200},
      homeMob: {dist: 84, pitch: .75},
      flyDist: 12,
      labelFar: {major: 420, minor: 120},
      coreLabels: false,
      localField: {spread: 22, clear: 1, density: .7},
      labels: [
        {text: "The Cosmere cluster", at: {sol: [0, 0, 0]}, off: [0, -1.5, 17], min: 30, max: 900, big: true},
        /* system names, visible from the cluster view */
        {text: "Rosharan system", at: {world: "rosharsun"}, off: [0, -1.25, 0], min: 1.5, max: 26, book: 4},
        {text: "Scadrian system", at: {world: "scadsun"}, off: [0, -.95, 0], min: 1.5, max: 26, book: 2},
        {text: "Selish system", at: {world: "mashe"}, off: [0, -.85, 0], min: 1.5, max: 26, book: 1},
        {text: "Nalthian system", at: {world: "nalthsun"}, off: [0, -.85, 0], min: 1.5, max: 26, book: 3},
        {text: "Threnodite system", at: {world: "threnosun"}, off: [0, -1, 0], min: 1.5, max: 26, book: 7},
        {text: "Taldain system", at: {world: "aisda"}, off: [0, -.8, 0], min: 1.5, max: 26, book: 7},
        {text: "Drominad system", at: {world: "drominad"}, off: [0, -1, 0], min: 1.5, max: 26, book: 7},
        {text: "UTol system", at: {world: "utolsun"}, off: [0, -.7, 0], min: 1.5, max: 26, book: 11},
        /* belts and the Nalthian cognitive anomaly, visible up close */
        {text: "asteroid belt", at: {world: "rosharsun"}, off: [0, .02, .37], min: .3, max: 4, book: 7},
        {text: "comet belt", at: {world: "scadsun"}, off: [0, .02, .54], min: .3, max: 4, book: 7},
        {text: "asteroid belt", at: {world: "mashe"}, off: [0, .02, .3], min: .3, max: 4, book: 7},
        {text: "comet belt", at: {world: "mashe"}, off: [0, .02, -.56], min: .3, max: 4, book: 7},
        {text: "cognitive anomaly", at: {world: "nalthsun"}, off: [-.2, .02, .03], min: .3, max: 4, book: 7},
        {text: "comet belt", at: {world: "nalthsun"}, off: [0, .02, .66], min: .3, max: 4, book: 7},
        {text: "asteroid belt", at: {world: "drominad"}, off: [0, .02, .4], min: .3, max: 4, book: 7},
        {text: "particle ring", at: {world: "ridos"}, off: [0, .12, 0], min: .3, max: 3, book: 7},
        /* the Scar: a cluster of unusually bright, reddish stars on the star chart */
        {text: "The Scar", at: {xyz: [(C.scar[0]) * 10, C.scar[2] * 10 + .2, C.scar[1] * 10]}, off: [0, 2.4, 0], min: 4, max: 400, big: true, book: 4},
        {text: "The Cognitive Realm", at: {world: "silverlight"}, off: [0, 2.2, 0], min: 8, max: 300, book: 4}
      ],
      glows: [
        {at: {xyz: [C.scar[0] * 10, .2, C.scar[1] * 10]}, scale: 7, opacity: .55, color: "red", pulse: true, book: 4},
        {at: {xyz: [C.scar[0] * 10 - 3, .3, C.scar[1] * 10 + 2]}, scale: 3.5, opacity: .45, color: "red", book: 4},
        {at: {xyz: [C.scar[0] * 10 + 3.4, .1, C.scar[1] * 10 - 2.4]}, scale: 3.5, opacity: .45, color: "red", book: 4},
        {at: {xyz: [C.scar[0] * 10 - 6, .2, C.scar[1] * 10 + 5]}, scale: 2.6, opacity: .4, color: "red", book: 4}
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
        {id: "h-dhatri", pairs: [["dhatri", "lumar"]], book: 12, opacity: {all: .35, cur: .7, past: .3}, curve: .06},
        /* Odium's attacks on other Shards: red */
        {id: "odium", pairs: [["braize", "sel"], ["braize", "threnosun"]], color: "#ff5a48", book: 7, opacity: {all: .4, cur: .85, past: .35}, speed: .8, dash: 3, curve: .1}
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

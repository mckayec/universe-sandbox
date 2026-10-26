/* The Expanse Atlas: data pack for the shared galactic atlas engine (schema: docs/atlas/PACK_FORMAT.md in the repo, v1).
   Series: The Expanse, James S. A. Corey (Daniel Abraham and Ty Franck), nine novels, 2011-2021.

   SOURCES (all text below is paraphrased in our own words; see RESEARCH.md for the working notes):
   - Wikipedia plot articles for the nine novels and "The Expanse (novel series)".
   - The Expanse Wiki (expanse.fandom.com): the book-summary pages for each novel, and the pages
     Interstellar colonies, Slow Zone (Books), Sol gate, Ilus, Auberon, Freehold, Adro system,
     Tycho Station, Mars, Earth, Ring Entities, Laconia.
   The fandom wiki mixes book and TV canon; only book facts are used. Where sources disagreed, the
   more conservative statement was kept or the detail left out.

   LAYOUT (important):
   - Sol is at its real place in the galaxy (engine default, map [0, 27.14] kly).
   - The Sol system is drawn as an ENLARGED SCHEMATIC orrery around Sol (hundreds of times too big
     at galaxy scale, orbital radii compressed, angles arbitrary). Each body says so in its distance line.
   - The ring-gate colony systems: the books never give their real positions. They are placed
     SCHEMATICALLY on a ring around Sol, and every one says "position not given in the books".
   - The ring space (slow zone, Ring Station, Medina) is not in normal space; it floats above Sol.
   - Surface site positions on invented worlds and on Ceres/Eros/Ganymede/Io etc. are estimated
     (the books give no coordinates); real places on Earth and Mars use real coordinates. */
(function () {
  "use strict";
  var SOL = [0, 27.14];                       /* engine default Sol (map kly) */
  var D2R = Math.PI / 180;
  /* orbit-style placement: r scene units (100 ly) from Sol, angle deg, height scene units */
  function orb(r, deg, h) {
    return [+(SOL[0] + r * Math.sin(deg * D2R) / 10).toFixed(4),
            +(SOL[1] + r * Math.cos(deg * D2R) / 10).toFixed(4),
            +((h || 0) / 10).toFixed(4)];
  }
  /* placement near another body (offset r scene units at angle deg) */
  function near(base, r, deg, h) {
    return [+(base[0] + r * Math.sin(deg * D2R) / 10).toFixed(4),
            +(base[1] + r * Math.cos(deg * D2R) / 10).toFixed(4),
            +((base[2] || 0) + (h || 0) / 10).toFixed(4)];
  }
  var P = {
    sun: orb(0, 0, 0),
    venus: orb(0.9, 205), earth: orb(1.3, 150), mars: orb(1.85, 245), eros: orb(1.58, 305),
    hungaria: orb(2.1, 20), tycho: orb(2.5, 125), ceres: orb(2.72, 92), pallas: orb(2.86, 200), thoth: orb(3.0, 330), leuctra: orb(2.7, 265),
    jupiter: orb(4.1, 55), saturn: orb(5.3, 172), uranus: orb(6.35, 280), solring: orb(7.15, 296)
  };
  P.luna = near(P.earth, 0.2, 60, 0.03);
  P.io = near(P.jupiter, 0.24, 150, 0.02); P.europa = near(P.jupiter, 0.34, 250, -0.02);
  P.ganymede = near(P.jupiter, 0.46, 20, 0.03); P.callisto = near(P.jupiter, 0.62, 300, -0.03);
  P.phoebe = near(P.saturn, 0.55, 80, 0.05);
  /* gate systems: schematic ring at 10-13 scene units around Sol (positions NOT given in the books) */
  var G = {
    ilus: orb(10, 18, .8), laconia: orb(11.2, 62, -.5), freehold: orb(10.3, 98, 1.0), auberon: orb(11, 132, -.8),
    newegypt: orb(9.8, 168, .5), baragaon: orb(11.6, 202, -.9), sanesteban: orb(10, 236, .6),
    nieuwestad: orb(10.8, 268, -.4), adro: orb(12, 300, .9), tecoma: orb(11.3, 326, -.6), thanjavur: orb(9.6, 342, .4),
    dobridomov: orb(13.2, 6, -1.2)
  };
  /* ring space: above Sol, out of the disc (scene units). Sol scene = (0, 0.2, 271.4) */
  var HUB = [0, 6.2, 271.4];

  var SCHEM = "Sol system drawn enlarged and not to scale";
  var GATEPOS = "Position not given in the books; placed schematically around Sol";

  var BOOKC = {1:"#e8a948", 2:"#6fc0a8", 3:"#d4d46a", 4:"#d9a07a", 5:"#e878b8", 6:"#8aa6c8", 7:"#6ad8e8", 8:"#5a86e8", 9:"#ece6d8"};
  /* (red is kept for attacks and violet for the gates, so no book uses them) */

  var PACK = {
    id: "expanse",
    meta: {
      title: "The Expanse Atlas",
      series: "The Expanse",
      author: "James S. A. Corey",
      years: "2011–2021",
      tagline: "The Sol system, the Ring &amp; the <b>thirteen hundred gates</b>",
      splash: "A crowded solar system on the edge of war, an alien molecule on a moon of Saturn, and a ring beyond Uranus that opens onto thirteen hundred other suns.",
      credits: "Fan-made atlas of James S. A. Corey’s <i>The Expanse</i>. The Sol system is enlarged; gate-system positions are schematic.",
      srcnote: "A fan-made atlas. Sources: the Wikipedia plot articles and The Expanse Wiki (book canon only). The Sol system is drawn as an enlarged schematic; the books never say where the gate systems really lie, so they are placed schematically. Surfaces are generated interpretations.",
      sources: ["https://en.wikipedia.org/wiki/The_Expanse_(novel_series)",
        "Wikipedia plot articles: Leviathan Wakes, Caliban's War, Abaddon's Gate, Cibola Burn, Nemesis Games, Babylon's Ashes, Persepolis Rising, Tiamat's Wrath, Leviathan Falls",
        "https://expanse.fandom.com/wiki/<book title> (book summaries)", "https://expanse.fandom.com/wiki/Interstellar_colonies",
        "https://expanse.fandom.com/wiki/Slow_Zone_(Books)", "https://expanse.fandom.com/wiki/Ilus", "https://expanse.fandom.com/wiki/Auberon",
        "https://expanse.fandom.com/wiki/Freehold", "https://expanse.fandom.com/wiki/Adro_system", "https://expanse.fandom.com/wiki/Tycho_Station",
        "https://expanse.fandom.com/wiki/Mars", "https://expanse.fandom.com/wiki/Earth", "https://expanse.fandom.com/wiki/Ring_Entities"]
    },

    theme: {
      void: "#04060a", deep: "#0a0f16", panel: "rgba(10,14,20,.88)",
      accent: "#d9783a", accentHi: "#ffb27a", accentLo: "#6a3418",
      chrome: "#e6ebf2", ember: "#ff5a3a", amber: "#ffb05a",
      text: "#dde3ea", muted: "#93a0b0", faint: "#5c6878",
      line: "rgba(255,178,122,.16)", lineStrong: "rgba(255,178,122,.46)",
      chromeGrad: "linear-gradient(180deg,#ffffff 0%,#ffd2a8 45%,#c0632c 70%,#ffe2c4 100%)",
      chromeStops: [[0, "#ffffff"], [.45, "#ffd2a8"], [.7, "#c0632c"], [1, "#ffe2c4"]],
      panelRgb: "14,19,27", panelRgb2: "6,9,13", insetRgb: "255,220,190", btnRgb: "10,14,20", ink: "#0a0705",
      glowRgb: "255,140,70", hiRgb: "217,120,58", swRgb: "255,178,122", pipRgb: "255,178,122",
      title: "#f3f5f8", title2: "#f3f5f8", title3: "#f3f5f8", shadeRgb: "5,7,11", tip1: "#16202c", tip2: "#080b10",
      voidRgb: "4,6,10", codexRgb: "2,3,6", splashGlow: "#1a1008", brandSpacing: ".14em",
      selRing: "#ffb27a", hoverRing: "#e6ebf2",
      /* a ring seen at an angle, with the sun behind it: our own simple mark */
      sigil: '<ellipse cx="24" cy="24" rx="19" ry="7.5" fill="none" stroke="url(#cg)" stroke-width="1.6" transform="rotate(-24 24 24)"/><circle cx="24" cy="24" r="3.2" fill="url(#cg)"/><circle cx="24" cy="24" r="22" fill="none" stroke="url(#cg)" stroke-width=".6" stroke-dasharray="1.5 3.2"/>'
    },

    books: {
      1: {n: "I", title: "Leviathan Wakes", y: 2011, c: BOOKC[1]},
      2: {n: "II", title: "Caliban’s War", y: 2012, c: BOOKC[2]},
      3: {n: "III", title: "Abaddon’s Gate", y: 2013, c: BOOKC[3]},
      4: {n: "IV", title: "Cibola Burn", y: 2014, c: BOOKC[4]},
      5: {n: "V", title: "Nemesis Games", y: 2015, c: BOOKC[5]},
      6: {n: "VI", title: "Babylon’s Ashes", y: 2016, c: BOOKC[6]},
      7: {n: "VII", title: "Persepolis Rising", y: 2017, c: BOOKC[7]},
      8: {n: "VIII", title: "Tiamat’s Wrath", y: 2019, c: BOOKC[8], ink: "#fff"},
      9: {n: "IX", title: "Leviathan Falls", y: 2021, c: BOOKC[9]}
    },
    spoilers: {mode: "cumulative"},

    ui: {
      indexTitle: "Places of the Expanse",
      homeButton: "Sol",
      homeAction: "Fly to the Sol system",
      homeCrumb: "The Sol system",
      go: {id: "ceres", label: "Go to Ceres"},
      hints: {
        galaxy: "Drag to turn · scroll to zoom · click a world, station or gate system",
        galaxyMob: "Drag to turn · pinch to zoom · tap a world",
        world: "Drag to turn the world · scroll to zoom · click a named place",
        worldMob: "Drag to turn · pinch to zoom · tap a named place"
      }
    },

    intro: {
      text: "A few centuries from now the Epstein drive has spread humanity across the solar system. Earth’s United Nations and the Martian Congressional Republic eye each other across a cold war, while the Belters who mine the asteroids and the outer moons do the work and pay the price. Then a missing girl, a ship lost near Saturn and a molecule older than life on Earth set everything moving, and a ring beyond Uranus opens onto more than a thousand other suns.",
      legend: [
        ["Sun at centre", "The Sol system, drawn at the Sun’s real place in the galaxy but hugely enlarged and not to scale"],
        ["Outer circle", "The gate systems. The books never say where they really are, so they are placed schematically"],
        ["Above the disc", "The ring space: the slow zone, the Ring Station and Medina, outside normal space"],
        ["Coloured lines", "Where the crew of the Rocinante goes, one colour per book"],
        ["Red lines", "The great attacks: Eros, the rocks thrown at Earth, the Laconian invasion and more"],
        ["Faint lines", "The ring gates, all opening onto the ring space"],
        ["Book buttons", "Choose the book you are reading. Later places, events and people stay hidden"]
      ]
    },

    groups: [
      {id: "inner", name: "The inner planets", chip: {border: "rgba(120,170,255,.55)", color: "#a8c8ff"}, labelFar: 70, flyDist: 9},
      {id: "belt", name: "The Belt", chip: {border: "rgba(255,178,122,.55)", color: "#ffb27a"}, labelFar: 70, flyDist: 9},
      {id: "jovian", name: "Jupiter and its moons", chip: {border: "rgba(230,200,140,.55)", color: "#e8cc90"}, labelFar: 26, flyDist: 4.5},
      {id: "outer", name: "Saturn and beyond", chip: {border: "rgba(200,190,160,.5)", color: "#d8ccb0"}, labelFar: 80, flyDist: 9},
      {id: "ringspace", name: "The ring space", chip: {border: "rgba(160,140,255,.6)", color: "#c4b6ff"}, labelFar: 160, flyDist: 10},
      {id: "gates", name: "Through the gates", chip: {border: "rgba(120,220,190,.55)", color: "#9ae8cc"}, labelFar: 320, flyDist: 22}
    ],

    worlds: [
      /* ============================ THE INNER SYSTEM ============================ */
      {noSurface: true, id: "sun", name: "The Sun", aka: ["Sol"], group: "inner", books: [1, 2, 3, 4, 5, 6, 7, 8, 9], first: 1, status: "Sol",
       star: {name: "Sol", col: "#fff2d8"}, map: P.sun,
       distText: "Centre of the Sol system · " + SCHEM,
       blurb: "The star at the centre of human space, warming a system crowded with stations, colonies and warships.",
       short: "Humanity’s sun.",
       eras: {3: {blurb: "The star at the centre of human space. In the third book the Ring Station shows Holden that its builders could make a star explode to stop a threat, and the fear that it might do so to the Sun hangs over the climax."}},
       facts: [["Drawn here", "At its real position in the Milky Way, with its planets enlarged around it"]],
       gfx: {type: "lava", sea: .55, pal: ["#ff8a20", "#ffb040", "#ffd060", "#ffe890", "#fff4c0", "#ffffff"], lava: "#ffe0a0",
             rough: .3, bump: .3, clouds: 0, atmo: "#ffd890", atmoK: 1.2, lights: 0, amb: .9, sw: "#ffd060"}},

      {id: "venus", name: "Venus", group: "inner", books: [1, 2, 3], first: 1, status: "Planet",
       star: {name: "Sol", col: "#fff2d8"}, map: P.venus, major: true, hero: "erosfall",
       distText: "About 0.7 AU from the Sun · " + SCHEM,
       blurb: "Under its yellow cloud a crushing, poisonous world that nobody lives on. At the end of the first book Eros comes down here with the protomolecule aboard, and nobody knows what it is building under the clouds.",
       short: "Where Eros fell.",
       facts: [["Surface", "Hot enough to melt lead, under a crushing atmosphere"]],
       eras: {
         2: {status: "Protomolecule construction site", blurb: "Since Eros fell, the protomolecule has been building something vast on the surface of Venus, and no government can say what it is. Strange structures grow there and seem to talk to the hybrid soldiers. At the end of the second book the construction lifts off the planet and heads out of the system."},
         3: {status: "Dead world again", blurb: "The protomolecule has left. Whatever it built on Venus rose from the planet and flew out past Uranus to become the Ring, leaving Venus dead and quiet once more."}
       },
       gfx: {type: "toxic", sea: 0, pal: ["#3a2a10", "#5a4018", "#8a6a30", "#a88040", "#c09a58", "#e8d0a0"], clouds: .92, cloudCol: "#e8d4a0", cloudOp: .97,
             atmo: "#ffd890", atmoK: 1.2, lights: 0, rough: .5, sw: "#d8b878"},
       sites: [
         {id: "erosfall", name: "Where Eros came down", lat: -8, lon: 40, books: [1, 2], desc: "The crash site of Eros Station (position estimated; the books give none). From here the protomolecule spreads out under the clouds and begins to build.",
          scene: {kind: "crater", arch: "alien", size: "large", tod: "dusk", weather: "storm", /* layout schematic */
           landmarks: [
             {id: "impact", name: "Eros’s grave", kind: "crater", at: [0, 0], h: 1.4, books: [1], desc: "Where Eros comes down under the clouds at the end of the first book, carrying Miller and what is left of Julie."},
             {id: "structures", name: "The protomolecule’s structures", kind: "monolith", at: [.45, .35], h: 2, books: [2], desc: "Vast shapes grow across the surface after the crash, and no government can say what they are for. At the end of the second book the construction lifts off and leaves the planet."}
           ]}}
       ]},

      {id: "earth", name: "Earth", aka: ["Terra"], group: "inner", books: [1, 2, 3, 4, 5, 6, 7, 8, 9], first: 1, major: true,
       status: "Seat of the United Nations", star: {name: "Sol", col: "#fff2d8"}, map: P.earth, hero: "newyork",
       distText: "1 AU from the Sun · " + SCHEM,
       blurb: "Home to some thirty billion people, most of them living on basic assistance in crowded cities, under a United Nations government. Earth and Mars together dominate the Belt, and the Earth navy and its intrigues drive much of the early story.",
       short: "The UN’s crowded homeworld.",
       facts: [["Government", "United Nations, from New York"], ["People", "Around thirty billion"]],
       eras: {
         5: {status: "Struck by the rocks", blurb: "In the fifth book the Free Navy drops stealth-coated asteroids on Earth. The impacts and their aftermath kill vast numbers, crash the ecology and leave the planet crippled for decades. The surviving governments move to Luna.",
             gfx: {clouds: .62, cloudCol: "#d8d4cc", lights: .35}},
         7: {status: "Under Laconian rule", blurb: "Still healing from the rocks, Earth surrenders with Mars when the Laconian battleship Heart of the Tempest destroys the combined fleets. Laconian ships hold its orbit."},
         9: {status: "A thousand years on", blurb: "When the gates close, Earth is cut off from the colonies with the rest of Sol. In the epilogue, about a thousand years later, travellers from a federation of colonies with their own faster-than-light drive find it nearly empty but still guarded, and Amos Burton waiting."}
       },
       gfx: {type: "terran", base: "earth", sea: .5, rough: .35, pal: ["#0a1e3e", "#2a608a", "#4a5a36", "#7a7a50", "#7a6a52", "#f2f4f6"],
             clouds: .48, atmo: "#8ab0ff", atmoK: 1, lights: .9, sw: "#3a6a9a"},
       sites: [
         {id: "newyork", name: "New York", lat: 40.7, lon: -74.0, books: [2, 5], desc: "The UN capital, home of the Secretariat, where Chrisjen Avasarala plays the politics of Earth.",
          scene: {kind: "capital", arch: "modern", size: "huge", tod: "day", weather: "clear", coast: "s", river: true, /* layout schematic */
           landmarks: [
             {id: "un", name: "United Nations headquarters", kind: "skyscraper", at: [0, .1], h: 2, books: [2], desc: "The seat of Earth’s government. Avasarala works its offices, and Bobbie Draper, brought to Earth for the peace talks, ends up on her staff here."}
           ]}},
         {id: "baltimore", name: "Baltimore", lat: 39.3, lon: -76.6, books: [5], desc: "Where Amos grew up on the streets. He comes back for the funeral of the woman who raised him and meets his old friend Erich.",
          scene: {kind: "city", arch: "brutal", size: "large", tod: "dusk", weather: "clear", coast: "e", /* layout schematic */
           landmarks: [
             {id: "erich", name: "Erich’s turf", kind: "house", at: [-.2, .1], books: [5], desc: "Amos’s childhood friend Erich runs the local criminal trade from here. After the rocks fall, Erich leaves Earth with Amos and Clarissa."}
           ]}},
         {id: "philly", name: "Philadelphia", lat: 39.95, lon: -75.2, books: [5], desc: "Amos visits the widower of the woman who raised him.",
          scene: {kind: "city", arch: "modern", size: "large", tod: "day", weather: "clear"}},
         {id: "winnipesaukee", name: "Lake Winnipesaukee", lat: 43.6, lon: -71.35, books: [5], desc: "A rich enclave with a private launch pad. After the rocks fall, Amos, Clarissa and Erich get a shuttle off the ground here and make for Luna.",
          scene: {kind: "village", arch: "modern", size: "small", tod: "dusk", weather: "ash", coast: "s", /* layout schematic */
           landmarks: [
             {id: "pad", name: "The private launch pad", kind: "pad", at: [.3, -.2], books: [5], desc: "A wealthy enclave’s own launch pad. Amos, Clarissa and Erich get a shuttle off the broken Earth from here and make for Luna."}
           ]}},
         {id: "montana", name: "Montana", lat: 46.6, lon: -111.0, books: [1], desc: "Holden grew up on a family farm co-op in Montana with several parents (the exact place is not given; marker estimated).",
          scene: {kind: "farm", arch: "rustic", size: "small", tod: "day", weather: "clear", /* layout schematic */
           landmarks: [
             {id: "farm", name: "The family farm", kind: "farm", at: [0, 0], books: [1], desc: "The co-op where Holden was raised by a family of eight parents (exact place not given)."}
           ]}},
         {id: "impact", name: "North African strike", lat: 21, lon: 12, books: [5], desc: "The first of the Free Navy’s rocks comes down over Africa. Other impacts devastate regions of North America, West Africa and South Asia (exact sites are not given; marker estimated).",
          scene: {kind: "crater", arch: "modern", size: "huge", tod: "dusk", weather: "ash", /* layout schematic */
           landmarks: [
             {id: "strike", name: "The first impact", kind: "crater", at: [0, 0], h: 1.6, books: [5], desc: "Where one of the Free Navy’s stealth-coated rocks comes down (exact place not given). The impacts and their aftermath kill vast numbers and break Earth’s ecology."}
           ]}},
         {id: "abuja", name: "Abuja", lat: 9.06, lon: 7.5, books: [6], desc: "The Nigerian capital, where Anna Volovodov’s wife Namono lives through the aftermath of the rocks at the start of the sixth book.",
          scene: {kind: "city", arch: "modern", size: "large", tod: "day", weather: "ash"}}
       ]},

      {id: "luna", name: "Luna", aka: ["The Moon"], group: "inner", books: [1, 2, 3, 4, 5, 6, 7], first: 1, status: "Earth’s moon",
       star: {name: "Sol", col: "#fff2d8"}, map: P.luna,
       distText: "Earth’s moon · " + SCHEM,
       blurb: "Earth’s heavily settled moon, under the United Nations’ jurisdiction. Rich and powerful families keep their homes here, among them the Maos of Mao-Kwikowski Mercantile, whose daughter Julie ran away to the Belt.",
       short: "Earth’s moon; the Maos’ home and later the seat of government.",
       facts: [["Notable residents", "Jules-Pierre Mao and family"]],
       eras: {2: {blurb: "Earth’s heavily settled moon and the home of the wealthy Mao family. The guilty of the great scandals are brought here to face trial."},
              5: {status: "Seat of the surviving governments", blurb: "After the rocks fall on Earth, the survivors of the UN and the Martian government gather on Luna, and Avasarala, now acting Secretary-General, runs the war against the Free Navy from here."}},
       gfx: {type: "barren", sea: 0, pal: ["#2a2a2a", "#3a3a3a", "#6a6a68", "#8a8a86", "#a8a8a2", "#d8d8d2"], rough: .7, bump: 1.4, clouds: 0, atmoK: 0, lights: .55, sw: "#8a8a86"},
       hero: "lunagov",
       sites: [
         {id: "lunagov", name: "Government in exile", lat: 10, lon: -20, books: [5, 6], desc: "Where the surviving governments of Earth and Mars gather after the rocks fall, and Avasarala runs the war against the Free Navy (marker position estimated).",
          scene: {kind: "underground", arch: "modern", size: "large", tod: "night", weather: "clear", under: true, sky: {planet: "#3a6a9a"}, /* layout schematic */
           landmarks: [
             {id: "port", name: "Luna’s ports", kind: "pad", at: [.6, -.4], books: [5], desc: "Survivors come in here: Alex and Bobbie bring the Martian prime minister in the Razorback, and Amos, Clarissa and Erich land after escaping Earth."},
             {id: "conference", name: "Avasarala’s conference", kind: "hall", at: [0, .2], h: 1.3, books: [5], desc: "Acting Secretary-General Avasarala meets Fred Johnson, the Martian prime minister and Holden’s crew here. Naomi offers testimony in exchange for immunity."},
             {id: "warroom", name: "The war room", kind: "hall", at: [-.4, .3], books: [6], desc: "Avasarala, the Martian prime minister and Fred Johnson plan the strike on the Azure Dragon here, and later send the fleets to retake Ceres."}
           ]}}
       ]},

      {id: "mars", name: "Mars", group: "inner", books: [1, 2, 3, 4, 5, 6, 7], first: 1, major: true,
       status: "Martian Congressional Republic", star: {name: "Sol", col: "#fff2d8"}, map: P.mars, hero: "mariner",
       distText: "About 1.5 AU from the Sun · " + SCHEM,
       blurb: "The Martian Congressional Republic: a disciplined, technologically advanced society living under domes and in tunnels while it slowly terraforms its world. Its navy is the best in the system. Mars stands with Earth over the Belt and against it in everything else.",
       short: "The Martian Congressional Republic.",
       facts: [["Government", "Martian Congressional Republic"], ["Navy", "MCRN"], ["Project", "Terraforming, generations from done"]],
       eras: {
         4: {blurb: "Once the gates open, Mars begins to lose people to the new worlds, and the terraforming dream that held it together starts to fade."},
         5: {status: "Betrayed from within", blurb: "In the fifth book Martian warships go missing from the books and are sold to the Free Navy, and a rogue admiral, Winston Duarte, takes a fleet of the best of them through the Laconia gate."},
         7: {status: "Under Laconian rule", blurb: "Mars surrenders to Laconia along with Earth when the Heart of the Tempest destroys the combined fleets."}
       },
       gfx: {type: "desert", sea: 0, dune: 5, pal: ["#000", "#000", "#8a3a1e", "#b0582c", "#7a3418", "#e8d0c0"], rough: .65, clouds: .06, cloudCol: "#f0d8c8",
             atmo: "#e8a07a", atmoK: .45, lights: .55, ice: 80, sw: "#b0582c",
             feat: [{k: "peak", at: [18.6, -133.8], r: 6, s: .55}, {k: "peak", at: [32.1, 150.2], r: 2.5, s: .3},
                    {k: "peak", at: [-0.8, -113.4], r: 3.5, s: .4}, {k: "peak", at: [1.5, -104.5], r: 3.5, s: .4}, {k: "peak", at: [11.8, -101], r: 3.5, s: .4},
                    {k: "river", from: [-6, -95], to: [-12, -45], w: 1.6, s: .45}, {k: "basin", at: [-42.4, 70.5], r: 12, s: .35},
                    {k: "basin", at: [-25, -40], r: 9, s: .2}]},
       sites: [
         {id: "mariner", name: "Mariner Valley", lat: -10, lon: -70, books: [1, 5], desc: "A great settlement built along the canyon walls of Valles Marineris, its neighbourhoods linked by tubes across the canyon, with shipyards nearby. Alex Kamal’s home.",
          scene: {kind: "city", arch: "modern", size: "large", tod: "day", weather: "dust", river: false, /* layout schematic */
           landmarks: [
             {id: "tubes", name: "The canyon tubes", kind: "bridge", at: [0, 0], h: 1.2, books: [1], desc: "Neighbourhoods dug into the canyon walls, joined by tubes that cross the gorge."},
             {id: "yards", name: "The shipyards", kind: "dock", at: [.6, .4], books: [1], desc: "Martian shipyards near the valley."},
             {id: "home", name: "Alex’s home", kind: "house", at: [-.5, -.2], books: [5], desc: "Alex grew up in Mariner Valley. He comes back in the fifth book hoping to make peace with his ex-wife, and she turns him away."}
           ]}},
         {id: "olympus", name: "Olympus Mons", lat: 18.6, lon: -133.8, desc: "The great volcano, with settlements and a Martian navy base on its flanks.",
          scene: {kind: "mountain", arch: "modern", size: "medium", tod: "day", weather: "dust"}},
         {id: "hecates", name: "Hecates Tholus", lat: 32.1, lon: 150.2, desc: "A volcano with a training base for Martian marine special forces.",
          scene: {kind: "fortress", arch: "brutal", size: "small", tod: "day", weather: "dust"}},
         {id: "londres", name: "Londres Nova", lat: 4, lon: -60, desc: "One of Mars’s major cities (its position on the planet is not given; marker estimated).",
          scene: {kind: "city", arch: "modern", size: "large", tod: "day", weather: "dust"}}
       ]},

      {id: "eros", name: "Eros", aka: ["Eros Station"], group: "inner", books: [1, 2, 9], first: 1, status: "Belt station · near-Earth asteroid",
       star: {name: "Sol", col: "#fff2d8"}, map: P.eros, major: true, hero: "hotel",
       distText: "A near-Earth asteroid, about 1.5 AU from the Sun · " + SCHEM,
       blurb: "A potato-shaped asteroid hollowed into a station of about a million and a half people, a centre of shipbuilding and gambling. In the first book the security firm Protogen herds its people into shelters and turns the protomolecule loose on them as an experiment. Then the whole asteroid begins to move.",
       short: "The station that became the protomolecule’s body.",
       facts: [["People", "About 1.5 million before the incident"], ["Fate", "Crashed into Venus at the end of the first book"]],
       gfx: {type: "barren", sea: 0, pal: ["#2a2420", "#3a322a", "#5a4a3c", "#6e5c4a", "#7e6c5a", "#a8988a"], rough: .9, bump: 1.8, freq: 2.2, clouds: 0, atmoK: 0, lights: .7, lightCol: "#9fd8ff", sw: "#6e5c4a"},
       sites: [
         {id: "hotel", name: "The hotel room", lat: 10, lon: 20, books: [1], desc: "Inside the station (marker position schematic): where Miller and Holden find Julie Mao’s body, overgrown by something that is not human.",
          scene: {kind: "underground", arch: "industrial", size: "large", tod: "night", weather: "clear", under: true, /* layout schematic */
           landmarks: [
             {id: "room", name: "Julie’s room", kind: "house", at: [0, 0], books: [1], desc: "A cheap hotel room where Miller and Holden’s crew find Julie Mao dead, her body overgrown by a strange growth. Her records point to the ship that brought the infection."}
           ]}},
         {id: "shelters", name: "Radiation shelters", lat: -6, lon: 34, books: [1], desc: "Inside the station (marker position schematic): a fake radiation alarm herds the people of Eros here, where they are infected.",
          scene: {kind: "underground", arch: "industrial", size: "large", tod: "night", weather: "mist", under: true, /* layout schematic */
           landmarks: [
             {id: "shelter", name: "The shelters", kind: "hall", at: [0, .1], h: 1.2, books: [1], desc: "Behind the false radiation alarm, the shelters really are flooded with lethal radiation, and the people herded inside are seeded with the protomolecule. Holden and Miller force their way in and are badly dosed."}
           ]}},
         {id: "docks", name: "Eros docks", lat: 2, lon: -30, books: [1], desc: "Inside the station (marker position schematic): Holden’s crew and Miller fight their way out of the dying station.",
          scene: {kind: "spaceport", arch: "industrial", size: "medium", tod: "night", weather: "clear", under: true, /* layout schematic */
           landmarks: [
             {id: "berth", name: "The Rocinante’s berth", kind: "dock", at: [.3, 0], books: [1], desc: "Miller drags a sickening Holden back here, and the Rocinante gets them out of the dying station; the ship’s medical bay treats their radiation."}
           ]}}
       ]},

      /* ============================ THE BELT ============================ */
      {id: "ceres", name: "Ceres", aka: ["Ceres Station"], group: "belt", books: [1, 3, 5, 6], first: 1, major: true,
       status: "Largest station of the Belt", star: {name: "Sol", col: "#fff2d8"}, map: P.ceres, hero: "helix",
       distText: "About 2.8 AU from the Sun · " + SCHEM,
       blurb: "The dwarf planet at the heart of the Belt, spun up for gravity and tunnelled into a city of millions. Its police contract belongs to Star Helix Security, and Detective Joe Miller works its corridors. The OPA, under Anderson Dawes, is strong here.",
       short: "The Belt’s great city, Miller’s beat.",
       facts: [["Security", "Star Helix Security (first book)"], ["People", "About six million by the sixth book"]],
       eras: {6: {status: "Stripped and abandoned", blurb: "In the sixth book the Free Navy holds Ceres, strips it of everything useful and pulls out, leaving its six million people for the Earth and Martian fleets to keep alive."}},
       gfx: {type: "barren", sea: 0, pal: ["#24221e", "#34302a", "#4e4a42", "#5e5a52", "#6e6a62", "#b8b4aa"], rough: .55, bump: 1.4, clouds: 0, atmoK: 0, lights: .8, lightCol: "#ffd8a0", sw: "#5e5a52"},
       sites: [
         {id: "helix", name: "Star Helix station house", lat: 12, lon: 10, books: [1], desc: "Inside the rock (marker position schematic): the precinct where Miller is handed the Julie Mao case as a side job, and later fired.",
          scene: {kind: "underground", arch: "industrial", size: "large", tod: "night", weather: "clear", under: true, /* layout schematic */
           landmarks: [
             {id: "stationhouse", name: "The station house", kind: "hall", at: [0, 0], h: 1.2, books: [1], desc: "Star Helix Security’s precinct. Miller’s captain quietly hands him the Julie Mao job here, and later takes his badge when he will not let it go."},
             {id: "tunnels", name: "The tunnels", kind: "plaza", at: [.5, .3], books: [1], desc: "Ceres’s corridors and levels, where Miller works his beat. Riots break out across the Belt after Holden’s broadcast blames Mars."}
           ]}},
         {id: "cdocks", name: "Ceres docks", lat: -8, lon: 40, books: [1, 3, 5, 6], desc: "Inside the rock (marker position schematic): the busy ports of the Belt’s biggest station.",
          scene: {kind: "spaceport", arch: "industrial", size: "large", tod: "night", weather: "clear", under: true, /* layout schematic */
           landmarks: [
             {id: "berth", name: "The impound berth", kind: "dock", at: [-.3, 0], books: [3], desc: "Mars sues for the return of its stolen corvette, and the Rocinante is held here. Holden takes a documentary contract to pay the lawyers."},
             {id: "chetz", name: "Where Naomi is taken", kind: "dock", at: [.4, .2], books: [5], desc: "Naomi meets her son Filip here and buys the small transport Chetzemoka for his crew. As she says goodbye, Marco’s people seize her, as planned all along."}
           ]}},
         {id: "govhall", name: "Governor’s offices", lat: 4, lon: -15, books: [6], desc: "Inside the rock (marker position schematic): the seat of Anderson Dawes, governor of Ceres under the Free Navy.",
          scene: {kind: "underground", arch: "modern", size: "medium", tod: "night", weather: "clear", under: true, /* layout schematic */
           landmarks: [
             {id: "dawes", name: "Dawes’s office", kind: "hall", at: [0, .2], books: [6], desc: "Marco Inaros tells Governor Dawes he will strip Ceres of its reactors, defences and medical supplies and leave its millions to his enemies. When Filip shoots a Ceres security officer, Dawes confronts Marco."},
             {id: "conference", name: "The peace conference", kind: "hall", at: [.4, -.3], h: 1.2, books: [6], desc: "Months after the war, the leaders of the system meet on Ceres to settle its future. Holden proposes a union of Belter shippers to run the gates, turns down its leadership, and names Michio Pa instead."}
           ]}}
       ]},

      {id: "tycho", name: "Tycho Station", group: "belt", books: [1, 2, 3, 5, 6, 7], first: 1, major: true, craft: true,
       status: "OPA headquarters · shipyard", star: {name: "Sol", col: "#fff2d8"}, map: P.tycho,
       distText: "A station in the Belt · " + SCHEM,
       blurb: "A great construction station in the Belt: a manufacturing sphere ringed by spinning habitat rings, able to build the biggest ships in the system. It belongs to Tycho Manufacturing, and it is also the quiet headquarters of Fred Johnson’s wing of the OPA. The generation ship Nauvoo is being built here when the story begins.",
       short: "Fred Johnson’s station.",
       facts: [["Owner", "Tycho Manufacturing and Engineering Concern"], ["Leader", "Fred Johnson"], ["Built", "The Nauvoo, later the Behemoth"]],
       eras: {5: {status: "Attacked", blurb: "In the fifth book the Free Navy strikes Tycho while the Rocinante is in for refit, and in the confusion the last sample of the protomolecule is stolen from Fred Johnson’s safe."},
              7: {status: "Withdrawn from Pallas", blurb: "Tycho withdraws from the Pallas–Tycho complex before the Tempest destroys Pallas."}},
       gfx: {type: "city", sea: 0, pal: ["#1a1e24", "#2a3038", "#4a525c", "#5e6670", "#7a828c", "#c8d0d8"], rough: .3, clouds: 0, atmoK: 0, lights: 1, lightCol: "#ffcc88", sw: "#7a828c"},
       sites: [
         {id: "tychostation", name: "Tycho Station", lat: 0, lon: 0, books: [1, 2, 5, 6], desc: "The station itself: a manufacturing sphere wrapped in spinning habitat rings, with berths for the largest ships in the system (marker position schematic).",
          scene: {kind: "station", arch: "industrial", size: "large", tod: "night", weather: "clear", space: true, sky: {sun: "#fff2d8"}, /* layout schematic */
           landmarks: [
             {id: "sphere", name: "The construction sphere", kind: "factory", at: [0, 0], h: 2, books: [1], desc: "The heart of the station, where Tycho Manufacturing builds ships too big for anyone else to build."},
             {id: "nauvoo", name: "The Nauvoo’s berth", kind: "ship", at: [.6, .3], h: 2.4, books: [1], desc: "Where the Nauvoo, the largest ship ever built, is under construction as a generation ship for Mormon colonists. The OPA takes it to try to push Eros into the Sun."},
             {id: "ring", name: "The habitat rings", kind: "ring", at: [-.5, .4], h: 1.6, books: [1], desc: "The spinning rings where Tycho’s workers live, with gravity from the spin."},
             {id: "fred", name: "Fred Johnson’s office", kind: "hall", at: [-.3, -.2], books: [1], desc: "Fred runs the station and his wing of the OPA from here. He takes in Holden’s crew after the Donnager and hires them for OPA work."},
             {id: "berth", name: "The Rocinante’s berth", kind: "dock", at: [.4, -.5], books: [1], desc: "The Rocinante is repaired here after the battle at Thoth, while the crew plans what to do about Eros."},
             {id: "safe", name: "Fred’s safe", kind: "keep", at: [-.6, -.5], books: [5], desc: "Where Fred keeps the last known sample of the protomolecule. During the fifth book’s coup attempt, insurgents steal the safe."}
           ]}}
       ]},

      {id: "thoth", name: "Thoth Station", group: "belt", books: [1], first: 1, craft: true, status: "Secret Protogen base",
       star: {name: "Sol", col: "#fff2d8"}, map: P.thoth,
       distText: "Hidden in the Belt · " + SCHEM,
       blurb: "A hidden Protogen research station in the Belt, receiving the data from the Eros experiment. Holden’s crew, Miller and OPA volunteers storm it, and Miller shoots the lead scientist, Antony Dresden, rather than let anyone bargain with him.",
       short: "Protogen’s secret lab.",
       gfx: {type: "barren", sea: 0, pal: ["#1e1e22", "#2a2a30", "#44444c", "#56565e", "#6a6a72", "#a8a8b0"], rough: .8, clouds: 0, atmoK: 0, lights: .6, lightCol: "#c8f0ff", sw: "#56565e"},
       sites: [
         {id: "thothbase", name: "Inside Thoth", lat: 0, lon: 0, books: [1], desc: "Protogen’s hidden base, where the Eros data comes in (marker position schematic).",
          scene: {kind: "station", arch: "modern", size: "medium", tod: "night", weather: "clear", space: true, /* layout schematic */
           landmarks: [
             {id: "landing", name: "Where the Rocinante comes down", kind: "pad", at: [.5, -.4], books: [1], desc: "Badly damaged in the fight with the station’s defences, the Rocinante is forced to set down on Thoth itself."},
             {id: "corridors", name: "The corridors", kind: "hall", at: [0, 0], books: [1], desc: "OPA fighters, Holden’s crew and Miller fight their way through the station."},
             {id: "lab", name: "Dresden’s lab", kind: "hall", at: [-.4, .4], books: [1], desc: "The station’s research heart. Antony Dresden defends the Eros experiment as a step toward making humanity into gods, and Miller shoots him."}
           ]}}
       ]},

      {id: "hungaria", name: "Hungaria asteroids", group: "belt", books: [5], first: 5, status: "Inner-edge asteroid group",
       star: {name: "Sol", col: "#fff2d8"}, map: P.hungaria,
       distText: "Inner edge of the Belt, about 1.9 AU from the Sun · " + SCHEM,
       blurb: "A swarm of small asteroids on the inner edge of the Belt. In the fifth book Holden traces a missing ship here, and Alex and Bobbie find a hidden fleet of stolen Martian warships, then fight their way clear.",
       short: "Where the stolen Martian fleet hides.",
       gfx: {type: "barren", sea: 0, pal: ["#2a2622", "#3a342e", "#56504a", "#68625a", "#7a746c", "#b0aaa0"], rough: .9, bump: 1.8, clouds: 0, atmoK: 0, sw: "#68625a"},
       sites: [
         {id: "hidden", name: "The hidden fleet", lat: 0, lon: 0, books: [5], desc: "Among the rocks (marker position schematic): where the stolen Martian warships wait.",
          scene: {kind: "battlefield", arch: "industrial", size: "medium", tod: "night", weather: "clear", space: true, sky: {sun: "#fff2d8"}, /* layout schematic */
           landmarks: [
             {id: "corvettes", name: "The stolen corvettes", kind: "ship", at: [0, .2], h: 1.3, books: [5], desc: "A fleet of Martian warships missing from the navy’s books, hidden among the asteroids. Alex and Bobbie find them in the racing ship Razorback and flee under missile fire."}
           ]}}
       ]},

      {id: "pallas", name: "Pallas", aka: ["Pallas-Tycho"], group: "belt", books: [7], first: 7, status: "Belt station",
       star: {name: "Sol", col: "#fff2d8"}, map: P.pallas,
       distText: "About 2.8 AU from the Sun · " + SCHEM,
       blurb: "A large asteroid station with refineries. By the seventh book Tycho Station has been moved and joined to it. After Tycho’s section withdraws, the Tempest destroys Pallas Station.",
       short: "Destroyed by the Tempest.",
       gfx: {type: "barren", sea: 0, pal: ["#26241e", "#36322a", "#524c42", "#645e52", "#767064", "#b4ae9e"], rough: .7, bump: 1.4, clouds: 0, atmoK: 0, lights: .5, sw: "#645e52"},
       sites: [
         {id: "pallasstation", name: "Pallas Station", lat: 0, lon: 0, books: [7], desc: "The station on the asteroid, with its refineries and the joined Tycho section (marker position schematic).",
          scene: {kind: "industrial", arch: "industrial", size: "large", tod: "night", weather: "clear", space: true, sky: {sun: "#fff2d8"}, /* layout schematic */
           landmarks: [
             {id: "refineries", name: "The refineries", kind: "factory", at: [-.2, 0], h: 1.4, books: [7], desc: "The industry of Pallas, among the largest in the Belt. The Tempest destroys the station."},
             {id: "tychosection", name: "The Tycho section", kind: "station", at: [.5, .3], h: 1.4, books: [7], desc: "Tycho Station, moved and joined to Pallas in the decades since the sixth book. It withdraws before the Tempest strikes."}
           ]}}
       ]},

      {id: "leuctra", name: "Point Leuctra", group: "belt", books: [7], first: 7, status: "Battle site · schematic marker",
       star: {name: "Sol", col: "#fff2d8"}, map: P.leuctra, est: true,
       distText: "In the asteroid belt; marker position schematic · " + SCHEM,
       blurb: "At Point Leuctra in the asteroid belt, the combined fleet fails to stop the Tempest.",
       short: "Where the combined fleet fails to stop the Tempest.",
       gfx: {type: "barren", sea: 0, pal: ["#26241e", "#36322a", "#524c42", "#645e52", "#767064", "#b4ae9e"], rough: .7, clouds: 0, atmoK: 0},
       sites: [
         {id: "battle", name: "The battle line", lat: 0, lon: 0, books: [7], desc: "A schematic marker for the battle in the Belt; the books do not tie it to a body.",
          scene: {kind: "battlefield", arch: "modern", size: "large", tod: "night", weather: "clear", space: true, sky: {sun: "#fff2d8"}, /* layout schematic */
           landmarks: [
             {id: "fleet", name: "The combined fleet", kind: "ship", at: [0, 0], h: 1.2, books: [7], desc: "The ships of Earth, Mars and the Transport Union, gathered to stop the Heart of the Tempest. They fail."}
           ]}}
       ]},

      /* ============================ JUPITER ============================ */
      {id: "jupiter", name: "Jupiter", group: "jovian", books: [2, 7, 8], first: 2, status: "Gas giant",
       star: {name: "Sol", col: "#fff2d8"}, map: P.jupiter, view: 4.8,
       distText: "About 5.2 AU from the Sun · " + SCHEM,
       blurb: "The great gas giant, whose moons hold much of the outer system’s population and food. Earth and Mars share its moons uneasily, and the second book is fought over them. A rogue UN admiral’s fleet gathers in its system, and the war ends in a battle above Io.",
       short: "The Jovian system.",
       eras: {7: {blurb: "The great gas giant and its crowded moons."},
              8: {blurb: "The great gas giant and its crowded moons. Under Laconian rule the resistance fights on here, and the Tempest is sent to the Jovian system to hunt the stolen gunship Gathering Storm."}},
       gfx: {type: "gas", pal: ["#6a4a30", "#a8805a", "#e0c8a0", "#f2e6d0", "#c09a70", "#b86a48"], bands: 16, atmo: "#e8d8c0", atmoK: .7, sw: "#c09a70"},
       moons: [{name: "Io", size: .07, dist: 2.2, gfx: {type: "desert", sea: 0, pal: ["#000", "#000", "#c8b040", "#e0d070", "#a87030", "#f0e8b0"], atmoK: 0}},
               {name: "Europa", size: .06, dist: 2.9, gfx: {type: "ice", sea: 0, pal: ["#7a6a5a", "#8a7a6a", "#b8a890", "#d8ccb8", "#e8e0d0", "#ffffff"], atmoK: 0}},
               {name: "Ganymede", size: .1, dist: 3.8}, {name: "Callisto", size: .09, dist: 5.0}],
       hero: "jovianspace",
       sites: [
         {id: "jovianspace", name: "Jovian space", lat: 0, lon: 0, books: [2, 8], desc: "The crowded space among Jupiter’s moons, busy with traffic between its colonies (marker position schematic).",
          scene: {kind: "battlefield", arch: "modern", size: "huge", tod: "night", weather: "clear", space: true, sky: {planet: {c: "#c09a70", size: 2}}, /* layout schematic */
           landmarks: [
             {id: "yacht", name: "Mao’s yacht", kind: "ship", at: [-.4, .2], books: [2], desc: "Jules-Pierre Mao’s private yacht, the Guanshiyin, on which Avasarala is sent out of the way. When she learns ships are coming to kill Holden, Bobbie takes the yacht by force."},
             {id: "unships", name: "The UN hunters", kind: "ship", at: [.4, .3], books: [2], desc: "Ships sent by the rogue faction to kill Holden. With Martian warships on its side and Bobbie on the guns, the Rocinante beats them."},
             {id: "freighter", name: "The Laconian freighter", kind: "ship", at: [.1, -.4], books: [8], desc: "A supply ship carrying a senior Laconian political officer. Bobbie and Alex take it in the stolen gunship Gathering Storm, and find antimatter aboard."}
           ]}}
       ]},

      {id: "io", name: "Io", group: "jovian", books: [2], first: 2, status: "Jovian moon",
       star: {name: "Sol", col: "#fff2d8"}, map: P.io, hero: "iolab",
       distText: "Innermost of Jupiter’s large moons · " + SCHEM,
       blurb: "Jupiter’s volcanic inner moon. In the second book it hides the lab where Mao-Kwikowski and Protogen’s heirs breed protomolecule hybrid soldiers from sick children. The war ends in a battle over it.",
       short: "Where the hybrids were made.",
       gfx: {type: "desert", sea: 0, dune: 3, pal: ["#000", "#000", "#c8b040", "#e0d070", "#a87030", "#f0e8b0"], rough: .5, clouds: 0, atmoK: 0, sw: "#d8c050",
             feat: [{k: "biome", style: "flame", at: [10, 40], r: 4, s: .9, c: "#2a1a10"}, {k: "biome", style: "flame", at: [-20, -60], r: 5, s: .9, c: "#3a1a0a"},
                    {k: "biome", style: "rock", at: [30, 120], r: 6, s: .8, c: "#c06030"}, {k: "biome", style: "flame", at: [-5, 150], r: 3, s: .9, c: "#201008"}]},
       sites: [
         {id: "iolab", name: "The hybrid lab", lat: 8, lon: 30, books: [2], desc: "A hidden base (position estimated) where Mei and other immune-deficient children are held. Amos and Prax get her out while Holden and the fleets fight overhead.",
          scene: {kind: "underground", arch: "modern", size: "medium", tod: "night", weather: "ash", under: true, sky: {planet: "#e0c8a0"}, /* layout schematic */
           landmarks: [
             {id: "outside", name: "Outside the lab", kind: "pad", at: [.6, -.4], books: [2], desc: "Bobbie, Prax and Amos land here. Bobbie holds off another hybrid outside while the others go in."},
             {id: "children", name: "The children’s ward", kind: "hall", at: [-.2, .2], books: [2], desc: "Where the surviving children are kept. Prax finds Mei alive."},
             {id: "strickland", name: "Strickland’s lab", kind: "hall", at: [.1, .5], books: [2], desc: "The workrooms of the doctor who took Mei. Amos kills him here."}
           ]}},
         {id: "ioorbit", name: "The battle over Io", lat: -10, lon: 60, books: [2], desc: "The space above Io (marker position schematic), where the UN ships of Nguyen and Souther face each other.",
          scene: {kind: "battlefield", arch: "modern", size: "large", tod: "night", weather: "clear", space: true, sky: {planet: {c: "#d8c050", size: 1.4}}, /* layout schematic */
           landmarks: [
             {id: "flagship", name: "Nguyen’s flagship", kind: "ship", at: [0, .2], h: 1.6, books: [2], desc: "Admiral Nguyen refuses to surrender and launches hybrid-loaded rockets. One crashes into his own ship and infects those aboard; Holden boards it to get the tracking codes, and the ship is destroyed."},
             {id: "souther", name: "Souther’s ships", kind: "ship", at: [-.6, -.2], books: [2], desc: "UN ships under Admiral Souther, working with Avasarala to stop the release of the protomolecule."}
           ]}}
       ]},

      {id: "europa", name: "Europa", group: "jovian", books: [3, 9], first: 3, status: "Jovian moon",
       star: {name: "Sol", col: "#fff2d8"}, map: P.europa,
       distText: "Second of Jupiter’s large moons · " + SCHEM,
       blurb: "Jupiter’s ice-shelled ocean moon, home of the Methodist pastor Anna Volovodov, who joins the UN delegation to the Ring in the third book.",
       short: "Anna’s home.",
       eras: {9: {blurb: "Jupiter’s ice-shelled ocean moon, home of Anna Volovodov. In the last book the record at Adro shows that the builders of the protomolecule began as simple creatures in the ocean of a frozen world much like this one."}},
       gfx: {type: "ice", sea: 0, pal: ["#7a6a5a", "#8a7a6a", "#b8a890", "#d8ccb8", "#e8e0d0", "#ffffff"], rough: .25, clouds: 0, atmoK: 0, lights: .3, sw: "#d8ccb8"},
       sites: [
         {id: "annahome", name: "Anna’s home", lat: 12, lon: -30, books: [3], desc: "The settlement where Anna Volovodov lives with her wife Nono and their daughter Nami (marker position estimated).",
          scene: {kind: "underground", arch: "modern", size: "medium", tod: "night", weather: "clear", under: true, /* layout schematic */
           landmarks: [
             {id: "church", name: "Anna’s church", kind: "temple", at: [0, 0], books: [3], desc: "Anna is a Methodist pastor here. She leaves her family to join the UN’s delegation of artists and clergy sent to witness the Ring."}
           ]}}
       ]},

      {id: "ganymede", name: "Ganymede", group: "jovian", books: [2, 3, 4, 6], first: 2, major: true, status: "Breadbasket of the outer planets",
       star: {name: "Sol", col: "#fff2d8"}, map: P.ganymede, hero: "domes",
       distText: "Largest moon of Jupiter · " + SCHEM,
       blurb: "The largest moon in the system and the food basket of the outer planets, its crops grown under domes and mirrors, shared uneasily by Earth and Mars. The second book opens here with an attack that kills two units of marines, and a war that wrecks the moon.",
       short: "The outer system’s farm, and where the second book begins.",
       eras: {3: {blurb: "After the battle of the second book, Ganymede’s food output has fallen to a fraction of what it was, and the outer system goes hungry. Refugees leave for wherever they can."}},
       gfx: {type: "ice", sea: 0, pal: ["#3a3530", "#4a443c", "#6a6258", "#7e766a", "#9a9286", "#d8d2c8"], rough: .5, bump: 1.2, clouds: 0, atmoK: 0, lights: .7, lightCol: "#c8ffb0", sw: "#7e766a"},
       sites: [
         {id: "domes", name: "Agricultural domes", lat: 15, lon: 10, books: [2], desc: "The farms under domes and mirrors (marker position estimated). Prax Meng is a botanist here, and his work is lost when a mirror comes down in the fighting.",
          scene: {kind: "dome", arch: "modern", size: "large", tod: "day", weather: "clear", sky: {planet: {c: "#c09a70", size: 2.2}}, /* layout schematic */
           landmarks: [
             {id: "farms", name: "Prax’s soy domes", kind: "dome", at: [0, 0], h: 1.6, books: [2], desc: "The domed farms that feed the outer planets. Prax Meng works here as a botanist until the fighting brings down a mirror and his crops die."},
             {id: "mirrors", name: "The mirrors", kind: "tower", at: [.5, .5], h: 2, books: [2], desc: "Great mirrors that light the crops. One falls in the fighting, and the colony’s food system begins to collapse."},
             {id: "preschool", name: "Mei’s preschool", kind: "house", at: [-.5, -.3], books: [2], desc: "Four-year-old Mei Meng, who has an immune disorder, is taken from here by her own doctor just before the fighting starts. Other children with her condition vanish too."}
           ]}},
         {id: "lab", name: "The hidden lab", lat: 6, lon: 24, books: [2], desc: "A disused tunnel complex (position estimated) where Mei’s doctor takes her. Holden, Amos and Prax find it, and one of the monsters inside.",
          scene: {kind: "underground", arch: "industrial", size: "medium", tod: "night", weather: "mist", under: true, /* layout schematic */
           landmarks: [
             {id: "tunnels", name: "The old tunnels", kind: "cave", at: [.4, -.3], books: [2], desc: "Holden, Amos and Prax follow video of the kidnapping through these tunnels to a guarded secret lab, and fight their way in."},
             {id: "cage", name: "The glass cage", kind: "hall", at: [-.2, .3], books: [2], desc: "Inside the lab a transformed human is held in a cage, the kind of creature that killed Bobbie’s platoon. A ship lifts off during the fighting, and Prax fears Mei is aboard."}
           ]}},
         {id: "outpost", name: "The marine outposts", lat: 28, lon: -20, books: [2], desc: "Where a single creature in no armour kills Bobbie Draper’s Martian platoon and the UN marines facing them (position estimated).",
          scene: {kind: "battlefield", arch: "brutal", size: "small", tod: "night", weather: "clear", sky: {planet: {c: "#c09a70", size: 2.2}}, /* layout schematic */
           landmarks: [
             {id: "line", name: "The picket line", kind: "wall", at: [0, 0], books: [2], desc: "Martian and UN marines watch each other across the surface. A creature with no suit walks out of the UN side and kills them all except Bobbie, then destroys itself."}
           ]}}
       ]},

      {id: "callisto", name: "Callisto", group: "jovian", books: [5, 6, 8], first: 5, status: "Jovian moon · shipyards",
       star: {name: "Sol", col: "#fff2d8"}, map: P.callisto, hero: "yards",
       distText: "Outermost of Jupiter’s large moons · " + SCHEM,
       blurb: "Jupiter’s dark, cratered outer moon, with shipyards. The fifth book opens with a radical OPA cell, led by a teenager named Filip, stealing stealth coating from the yards and wrecking them.",
       short: "Shipyards; Filip’s first raid.",
       eras: {6: {blurb: "Jupiter’s dark outer moon. After the Free Navy’s raid on its yards in the fifth book, Callisto is where Filip, breaking with his father at the end of the sixth, stays behind under his mother’s name."},
              8: {blurb: "Jupiter’s dark outer moon. In the eighth book the stolen Laconian gunship Gathering Storm lies low here after an attack on a Laconian freighter."}},
       gfx: {type: "barren", sea: 0, pal: ["#1e1a16", "#2a2420", "#3e3630", "#4c443c", "#5c544a", "#a89e90"], rough: .7, bump: 1.6, clouds: 0, atmoK: 0, lights: .45, sw: "#4c443c"},
       sites: [
         {id: "yards", name: "The shipyards", lat: 20, lon: 40, books: [5], desc: "Twin shipyards (position estimated), struck in the opening raid of the fifth book.",
          scene: {kind: "industrial", arch: "industrial", size: "large", tod: "night", weather: "clear", sky: {planet: {c: "#c09a70", size: 1.4}}, /* layout schematic */
           landmarks: [
             {id: "yard", name: "The Martian yard", kind: "factory", at: [0, 0], h: 1.4, books: [5], desc: "Filip Inaros’s team knocks out the yard’s defences and steals four canisters of stealth coating, leaving two of their own men behind."}
           ]}}
       ]},

      /* ============================ SATURN AND BEYOND ============================ */
      {id: "saturn", name: "Saturn", group: "outer", books: [1], first: 1, status: "Gas giant", major: true,
       star: {name: "Sol", col: "#fff2d8"}, map: P.saturn, view: 4.8,
       distText: "About 9.5 AU from the Sun · " + SCHEM,
       blurb: "The ringed giant. The ice hauler Canterbury works its rings, carrying water to Ceres, and is on that run when it answers a distress call in the first chapters. Its moon Phoebe is where the protomolecule was found.",
       short: "Ice from the rings; the Canterbury’s run.",
       gfx: {type: "gas", pal: ["#7a6a48", "#b8a070", "#e8d8a8", "#f4ead0", "#d0b880", "#a89060"], bands: 18, atmo: "#f0e0b0", atmoK: .6, sw: "#d0b880"},
       ring: {inner: 1.35, outer: 2.3, c1: "#e8dcc0", c2: "#8a7a60", tilt: .45, seed: 9},
       moons: [{name: "Titan", size: .12, dist: 3.4, gfx: {type: "toxic", sea: 0, pal: ["#5a3a10", "#7a5018", "#a07030", "#b8883c", "#c89a50", "#e0c080"], clouds: .9, cloudCol: "#e0a850", atmo: "#e0a050", atmoK: 1}},
               {name: "Phoebe", size: .05, dist: 5.2}],
       sites: [
         {id: "rings", name: "The ice fields", lat: 0, lon: 0, books: [1], desc: "Saturn’s rings, where ice haulers load water for the Belt (marker position schematic).",
          scene: {kind: "station", arch: "industrial", size: "medium", tod: "day", weather: "clear", space: true, sky: {planet: {c: "#d0b880", size: 2.4}, rings: true}, /* layout schematic */
           landmarks: [
             {id: "canterbury", name: "The Canterbury", kind: "ship", at: [0, 0], h: 1.6, books: [1], desc: "An old ice hauler that carries water from Saturn’s rings to Ceres. Jim Holden is its executive officer and Naomi Nagata, Amos Burton and Alex Kamal are among its crew."}
           ]}}
       ]},

      {id: "phoebe", name: "Phoebe", group: "outer", books: [1], first: 1, status: "Captured moon of Saturn",
       star: {name: "Sol", col: "#fff2d8"}, map: P.phoebe,
       distText: "Outer moon of Saturn · " + SCHEM,
       blurb: "A small dark moon on a backwards orbit around Saturn. It is not a moon at all but a weapon, launched at Earth billions of years ago by an alien intelligence to rewrite the young planet’s life, and caught by Saturn instead. Protogen found the protomolecule inside it.",
       short: "Where the protomolecule came from.",
       facts: [["Cargo", "The protomolecule"], ["Launched", "Billions of years ago, aimed at Earth"]],
       gfx: {type: "barren", sea: 0, pal: ["#121010", "#1a1816", "#2a2622", "#36302a", "#443c34", "#7a7068"], rough: .9, bump: 1.8, clouds: 0, atmoK: 0, sw: "#36302a"},
       sites: [
         {id: "phoebecore", name: "Inside Phoebe", lat: 0, lon: 0, books: [1], desc: "The moon’s interior, where the alien cargo lay hidden (marker position schematic).",
          scene: {kind: "crater", arch: "alien", size: "small", tod: "night", weather: "clear", sky: {planet: {c: "#d0b880", size: 1.2}, rings: true}, /* layout schematic */
           landmarks: [
             {id: "find", name: "Protogen’s find", kind: "crater", at: [0, 0], books: [1], desc: "Where Protogen found the protomolecule: a payload sent at the young Earth billions of years ago and caught by Saturn instead."}
           ]}}
       ]},

      {id: "uranus", name: "Uranus", group: "outer", books: [3], first: 3, status: "Ice giant",
       star: {name: "Sol", col: "#fff2d8"}, map: P.uranus,
       distText: "About 19 AU from the Sun · " + SCHEM,
       blurb: "The pale ice giant. When the protomolecule’s construction leaves Venus it flies out past the orbit of Uranus and stops, and builds the Ring there.",
       short: "The Ring lies beyond its orbit.",
       gfx: {type: "gas", pal: ["#6aa8b8", "#8ac4cc", "#a8dce0", "#c0e8ea", "#9ad0d6", "#7ab8c4"], bands: 8, atmo: "#c0f0ff", atmoK: .8, sw: "#a8dce0"},
       ring: {inner: 1.6, outer: 1.8, c1: "#8a9aa0", c2: "#4a5a60", tilt: 1.4, seed: 3}},

      /* ============================ THE RING SPACE ============================ */
      {id: "solring", name: "The Ring", aka: ["Sol gate", "Sol Ring"], group: "ringspace", books: [3, 4, 5, 6, 7, 9], first: 3, major: true, craft: true,
       status: "Sol’s ring gate", star: {name: "Sol", col: "#fff2d8"}, map: P.solring,
       distText: "Beyond the orbit of Uranus · " + SCHEM,
       blurb: "A ring about a thousand kilometres across, built by the protomolecule from what it took from Eros and Venus, hanging dark beyond the orbit of Uranus. The first ship to dive through it, a daredevil’s racer, is lost. Through it lies the ring space.",
       short: "The gate out of the Sol system.",
       facts: [["Size", "About 1,000 km across"], ["Built from", "Eros, by way of Venus"]],
       eras: {6: {blurb: "The gate out of the Sol system. In the sixth book Naomi works out that ships vanish when too much mass has gone through a gate too quickly, and the coalition uses that to swallow Marco Inaros’s fleet as it crosses."},
              9: {blurb: "The gate out of the Sol system. In the last book a big colony ship crosses too soon after another and is nearly lost, but something saves it and all the rings shine. When the Ring Station dies at the end, the Ring goes dark and Sol is alone again."}},
       gfx: {type: "barren", sea: 0, freq: 3, pal: ["#101016", "#181820", "#2a2a34", "#363642", "#44444f", "#7a7a8c"], rough: .25, bump: .5, clouds: 0, atmoK: 0, lights: .5, lightCol: "#b0a0ff", amb: .04, sw: "#363642"},
       ring: {inner: 1.6, outer: 2.2, c1: "#4a4a5a", c2: "#1a1a24", tilt: .9, seed: 7},
       sites: [
         {id: "ringmouth", name: "Before the Ring", lat: 0, lon: 0, books: [3, 6, 9], desc: "The space in front of the gate, where the navies watch and ships line up to cross (marker position schematic).",
          scene: {kind: "station", arch: "alien", size: "huge", tod: "night", weather: "clear", space: true, sky: {sun: "#fff2d8"}, /* layout schematic */
           landmarks: [
             {id: "gate", name: "The Ring", kind: "portal", at: [0, .2], h: 3, books: [3], desc: "A dark ring about a thousand kilometres across. Manéo Jung-Espinoza, a young Belter from Ceres, slingshots a patched-up ship through it; on the far side it stops dead and kills him, but his camera keeps broadcasting."},
             {id: "flotilla", name: "The watching fleets", kind: "ship", at: [-.6, -.3], h: 1.2, books: [3], desc: "Earth, Mars and the OPA send fleets to watch the Ring. Clarissa Mao’s bomb destroys the Earth destroyer Seung Un here, and the Behemoth fires on the Rocinante until Holden flies into the gate."},
             {id: "crossing", name: "The crossing lane", kind: "beacon", at: [.6, -.3], books: [6], desc: "Ships line up here to cross into the ring space. The coalition times a heavily loaded ship’s transit against Marco Inaros’s fleet as it crosses, and his whole fleet vanishes in the gate."}
           ]}}
       ]},

      {id: "ringstation", name: "Ring Station", aka: ["The slow zone", "The hub"], group: "ringspace", books: [3, 8, 9], first: 3, major: true, craft: true,
       status: "The hub of the gates", star: {name: "No star: the ring space is dark", col: "#dcd8ec"}, pos3: HUB,
       distText: "Inside the ring space, outside normal space · shown above Sol",
       blurb: "Beyond the Ring is a dark, starless sphere about a million kilometres across, with more than thirteen hundred gates spaced around its edge. At its centre floats the Ring Station, a metal sphere a few kilometres wide that enforces a speed limit: anything moving faster than six hundred metres a second is seized and dragged down. Humans call it the slow zone.",
       short: "The hub of the gate network.",
       facts: [["Gates", "1,373 around the edge"], ["Speed limit", "600 m/s"], ["Size", "About a million km across"]],
       eras: {8: {status: "Under attack", blurb: "The hub of the gate network. In the eighth book the beings that killed the builders strike inside the ring space itself, and everything humans have put there is wiped away."},
              9: {status: "Destroyed", blurb: "In the last book Winston Duarte joins himself to the station to hold back the ring entities. After he dies, Holden takes his place, then destroys the station. The gates fall dark, leaving some thirteen hundred colonies on their own."}},
       gfx: {type: "barren", sea: 0, freq: 2.6, pal: ["#0e0c18", "#16142a", "#262238", "#322c48", "#403a58", "#8a80b0"], rough: .2, bump: .45, clouds: 0, atmo: "#9a88ff", atmoK: .35, lights: .7, lightCol: "#c0b0ff", amb: .05, sw: "#322c48"},
       sites: [
         {id: "core", name: "The heart of the station", lat: 0, lon: 0, books: [3, 9], desc: "The Ring Station at the centre of the slow zone, where Holden goes in alone with Miller’s ghost in the third book and touches the station’s memory.",
          scene: {kind: "station", arch: "alien", size: "large", tod: "night", weather: "clear", space: true, sky: {sun: "#8aa0ff"}, /* layout schematic */
           landmarks: [
             {id: "sphere", name: "The blue sphere", kind: "dome", at: [0, 0], h: 2.4, books: [3], desc: "A glowing metal sphere a few kilometres across at the centre of the ring space. Believing Miller has called him, Holden makes a solo spacewalk to it."},
             {id: "memory", name: "The station’s memory", kind: "monolith", at: [-.3, .5], h: 1.4, books: [3], desc: "Inside, Miller’s ghost shows Holden the builders’ empire across the galaxy, the thing that attacked it, and the systems they burned to stop it. To be judged harmless, every ship must power down."},
             {id: "throne", name: "Duarte’s seat", kind: "throne", at: [.3, .5], books: [9], desc: "In the last book Duarte sits here, joined to the station, holding humanity’s minds together against the dark gods. Tanaka kills him and dies; Holden takes his place."},
             {id: "surface", name: "The station’s surface", kind: "pad", at: [.6, -.4], books: [9], desc: "Laconian scientists find Duarte’s small alien ship resting on the Ring Station’s surface. Teresa, Tanaka and Amos come here to open the station, and Miller appears once more to help."}
           ]}},
         {id: "slowzone", name: "The slow zone", lat: 20, lon: 60, books: [3, 6, 8, 9], desc: "The dark sphere of the ring space, with its gates on the rim (marker position schematic).",
          scene: {kind: "station", arch: "alien", size: "huge", tod: "night", weather: "clear", space: true, /* layout schematic */
           landmarks: [
             {id: "gates", name: "The gates on the rim", kind: "portal", at: [0, .7], h: 2, books: [3], desc: "1,373 gates spaced around the edge of the million-kilometre sphere, each opening onto another star system once the station unlocks them."},
             {id: "flotilla", name: "The stalled flotilla", kind: "ship", at: [-.4, -.1], h: 1.2, books: [3], desc: "When a Martian marine fires a grenade near the station, the speed limit drops at a stroke, and every ship in the zone is slammed to a crawl. Hundreds are killed or hurt."},
             {id: "railguns", name: "The Free Navy railguns", kind: "mast", at: [-.1, .3], h: 1.4, books: [6], desc: "Powerful railguns the Free Navy sets up to guard the slow zone. Pinned down by Duarte’s marines, Bobbie sends her landing craft into the reactor that powers them, and the guns fall silent."},
             {id: "tecomagate", name: "The Tecoma and Thanjavur gates", kind: "portal", at: [.6, .2], books: [8], desc: "Two gates on opposite sides of the rim. The gamma-ray burst from the Tecoma experiment crosses the slow zone and destroys both."},
             {id: "battle", name: "The last battle", kind: "ship", at: [.3, -.5], h: 1.2, books: [9], desc: "Laconian and Underground fleets hold off the ships whose crews Duarte has taken over, while the struggle goes on at the station."}
           ]}}
       ]},

      {id: "medina", name: "Medina Station", aka: ["Nauvoo", "Behemoth"], group: "ringspace", books: [3, 4, 5, 6, 7, 8], first: 3, major: true, craft: true,
       status: "Waystation of the ring space", star: {name: "No star: the ring space is dark", col: "#dcd8ec"}, pos3: [0.7, 6.45, 271.8],
       distText: "Inside the ring space, outside normal space · shown above Sol",
       blurb: "Built at Tycho as the Nauvoo, a generation ship for Mormon colonists, then refitted by the OPA as the warship Behemoth and sent to the Ring. After the disaster in the slow zone it becomes a refuge, and at the end of the third book it is left there as Medina Station, a waystation for ships bound for the gates.",
       short: "The old Nauvoo, parked in the ring space.",
       facts: [["Built", "At Tycho, as the Nauvoo"], ["Later", "OPA warship Behemoth, then Medina Station"]],
       eras: {5: {status: "Seized by the Free Navy", blurb: "The waystation of the ring space. In the fifth book the Free Navy seizes it and cuts the colonies off."},
              6: {status: "Retaken", blurb: "The waystation of the ring space. The Free Navy guards it with railguns; in the sixth book a combined assault breaks the guns, and Medina surrenders to the Rocinante. It later becomes the home of the new Transport Union."},
              7: {status: "Occupied by Laconia", blurb: "Thirty years on, Medina is the heart of the Transport Union, until the Laconian battleship Heart of the Tempest takes it. Captain Santiago Singh governs it, ever more harshly, until a resistance led by Saba breaks out."},
              8: {status: "Destroyed", blurb: "In the eighth book the ring entities sweep the ring space and Medina Station is destroyed with everyone aboard."}},
       gfx: {type: "city", sea: 0, pal: ["#16181e", "#22262e", "#3e444e", "#4e5560", "#646c78", "#b4bcc8"], rough: .3, clouds: 0, atmoK: 0, lights: 1, lightCol: "#ffc890", sw: "#4e5560"},
       sites: [
         {id: "drum", name: "The drum", lat: 0, lon: 0, books: [3, 5, 6, 7], desc: "The great ship turned station: the spinning habitat drum, the engineering decks and the bridge, parked in the slow zone (marker position schematic).",
          scene: {kind: "habitat", arch: "industrial", size: "large", tod: "night", weather: "clear", space: true, /* layout schematic */
           landmarks: [
             {id: "drumring", name: "The habitat drum", kind: "ring", at: [0, 0], h: 2.2, books: [3], desc: "Built to spin for a generation ship’s farms and homes. After the deceleration, a paralysed Bull spins it up to give the injured gravity, and the Behemoth becomes the slow zone’s hospital."},
             {id: "engineering", name: "Engineering", kind: "reactor", at: [-.6, -.3], h: 1.3, books: [3], desc: "Where the engineer Sam Rosenberg secretly sabotages Ashford’s weapon and is shot for it, and where Bull holds off armoured attackers with grenades and dies so Holden and Naomi can get through."},
             {id: "bridge", name: "The bridge", kind: "hall", at: [.5, .4], books: [3], desc: "Ashford orders the laser fired from here. Clarissa, moved by Anna’s broadcast, opens the doors, knocks Ashford from the controls and sends the ship dark."},
             {id: "laser", name: "The comm laser", kind: "beacon", at: [.7, -.2], books: [3], desc: "Ashford has the ship’s communications laser turned into a weapon to strike the Ring. Holden fears the station will answer by destroying the Sun."},
             {id: "brig", name: "The brig", kind: "keep", at: [-.3, .5], books: [3], desc: "Clarissa is held here after her attack on the Rocinante. Anna visits her and offers forgiveness she will not accept; Ashford plots his comeback from a cell."},
             {id: "governor", name: "The governor’s office", kind: "hall", at: [-.6, .2], books: [7], desc: "Captain Santiago Singh rules Medina from here for Laconia, with curfews and purges. His own security chief, Overstreet, kills him when he orders loyalists executed."},
             {id: "docks", name: "The docks", kind: "dock", at: [.7, .7], books: [7], desc: "The Laconian gunship Gathering Storm is berthed here. In the breakout Bobbie’s team seizes it and Alex takes the Rocinante out, as twenty ships escape through the gates."}
           ]}}
       ]},

      /* ============================ THROUGH THE GATES ============================ */
      {id: "ilus", name: "Ilus", aka: ["New Terra", "Bering Survey Four"], group: "gates", gate: true, books: [4, 7, 8], first: 4, major: true,
       status: "First human colony beyond the Ring", star: {name: "Ilus’s sun", col: "#fff0dc"}, map: G.ilus, est: true, hero: "landing",
       distText: GATEPOS,
       blurb: "The fourth world of its star: one great continent, one great ocean, and thirteen dark moons sharing a single orbit. Ganymede refugees get here first and found a lithium-mining town; then a corporate survey arrives with a UN charter. Under the dust the whole planet is an alien machine, built as one huge refinery for the builders’ empire, and it is waking up.",
       short: "New Terra, where colonists and a corporation fight over a world that is a machine.",
       facts: [["Charter", "Royal Charter Energy"], ["Settlers", "Belter refugees from Ganymede"], ["Moons", "Thirteen, sharing one orbit (a few are drawn)"]],
       eras: {7: {blurb: "The first colony beyond the Ring. Decades on, the Laconian governor of Medina presses Holden about what happened on Ilus, because the sphere of strange matter found after the Tempest fires its weapon matches the one Elvi met here."}},
       gfx: {type: "terran", sea: .62, freq: 1.2, warp: .7, pal: ["#0a1a30", "#2a5a7a", "#4a4a2e", "#6a6a40", "#8a7050", "#e8e4dc"], clouds: .4, atmo: "#9ab8ff", atmoK: 1, lights: .1, sw: "#6a6a40",
             feat: [{k: "continent", at: [20, -20], r: 50, s: .32}, {k: "biome", style: "rock", at: [-5, -45], r: 18, s: .9, c: "#b89868"},
                    {k: "continent", at: [-10, 110], r: 4, s: .25}, {k: "continent", at: [0, 125], r: 3, s: .25}, {k: "continent", at: [12, 140], r: 3, s: .22},
                    {k: "continent", at: [-18, 150], r: 2.5, s: .22}, {k: "biome", style: "forest", at: [45, 10], r: 14, s: .8, c: "#7a3a2a"},
                    {k: "range", from: [35, -60], to: [10, -15], w: 2.5, s: .2}]},
       moons: [{name: "Moon", size: .07, dist: 3.1}, {name: "Moon", size: .07, dist: 3.1}, {name: "Moon", size: .06, dist: 3.1},
               {name: "Moon", size: .07, dist: 3.1}, {name: "Moon", size: .06, dist: 3.1}],
       sites: [
         {id: "landing", name: "First Landing", lat: 8, lon: -40, books: [4], desc: "The refugee town, just north of the great south-western desert, where the lithium is closest to the surface. The colonists bomb the corporate landing pad here, and the feud begins (all Ilus positions estimated).",
          scene: {kind: "town", arch: "rustic", size: "small", tod: "day", weather: "dust", /* layout schematic */
           landmarks: [
             {id: "pad", name: "The RCE landing pad", kind: "pad", at: [.5, -.3], books: [4], desc: "Built by Royal Charter Energy’s advance team. Basia Merton and the other colonists plant bombs under it; when the corporate shuttle comes down early he can stop only one of the detonators, and the provisional governor and a dozen others die."},
             {id: "town", name: "The colonists’ town", kind: "house", at: [-.2, .1], books: [4], desc: "The settlement the Ganymede refugees built to mine lithium. When a colonist threatens him in public, the corporate security chief Murtry shoots the man dead here."},
             {id: "clinic", name: "Lucia’s clinic", kind: "hall", at: [-.5, -.2], books: [4], desc: "Doctor Lucia Merton, Basia’s wife, leads the medical care for the town after the bombing and through the disasters that follow."},
             {id: "mine", name: "The lithium workings", kind: "mine", at: [.1, .6], books: [4], desc: "The reason the refugees came: lithium close to the surface near the edge of the desert."}
           ]}},
         {id: "ruins", name: "The alien ruins", lat: 10, lon: -36, books: [4], desc: "Builder ruins near the town, where survivors shelter from the storm and the poisonous slugs, and where Holden and Miller ride an alien car into the planet’s machinery.",
          scene: {kind: "ruins", arch: "alien", size: "medium", tod: "dusk", weather: "rain", /* layout schematic */
           landmarks: [
             {id: "shelter", name: "The shelter", kind: "ruin", at: [0, 0], h: 1.6, books: [4], desc: "The town’s survivors shelter here from the storm. A tiny organism in the rainwater starts to blind them; Holden is spared by his anti-cancer medicine and gives his supply away."},
             {id: "transit", name: "The alien transit", kind: "portal", at: [.5, .4], books: [4], desc: "Guided by Miller, who has taken over a huge alien machine, Holden travels down into the planet’s old transit network. Miller explains that Ilus was built to process rare minerals and send power across worlds."},
             {id: "bridge", name: "The narrow bridge", kind: "bridge", at: [-.4, .5], books: [4], desc: "Deep in the structure, after Murtry shoots Amos from behind and the RCE officer Wei is killed, Holden faces Murtry, shoots him and drags him to safety."}
           ]}},
         {id: "island", name: "The largest island", lat: -5, lon: 125, books: [4], sea: true, desc: "One of the alien reactors in the archipelago melts down here, throwing up a tsunami and storm winds that flatten First Landing.",
          scene: {kind: "sea", arch: "alien", size: "medium", tod: "dusk", weather: "storm", water: true, /* layout schematic */
           landmarks: [
             {id: "reactor", name: "The buried reactor", kind: "reactor", at: [0, 0], h: 1.6, books: [4], desc: "An alien power plant under the island chain explodes. The blast raises hurricane winds, and the planet’s defences shut down every fusion reactor in orbit."}
           ]}},
         {id: "deadspot", name: "The dead spot", lat: 30, lon: -5, books: [4], desc: "A gap in the planet’s network, a sphere of something that kills alien machines. Elvi carries the network’s controller into it and shuts down the defences.",
          scene: {kind: "underground", arch: "alien", size: "medium", tod: "night", weather: "clear", under: true, /* layout schematic */
           landmarks: [
             {id: "void", name: "The pulsing darkness", kind: "portal", at: [0, .2], h: 1.4, books: [4], desc: "A darkness at the heart of the network that only Elvi can perceive. Miller asks her to carry his core into it; she does, is taken apart and put back together, and the alien machines fall silent."},
             {id: "nerve", name: "The nerve centre", kind: "hall", at: [-.4, -.3], books: [4], desc: "Dormant machines wake and attack as Elvi pulls Miller’s core free. Fayez Sarkis attacks Murtry so she can run deeper."}
           ]}},
         {id: "ilusorbit", name: "Orbit over Ilus", lat: -20, lon: -80, books: [4], desc: "The three ships above the planet: the Rocinante, the corporate Edward Israel and the refugees’ ore ship Barbapiccola (marker position schematic).",
          scene: {kind: "station", arch: "industrial", size: "medium", tod: "day", weather: "clear", space: true, sky: {planet: {c: "#6a6a40", size: 2.2}, moons: 5}, /* layout schematic */
           landmarks: [
             {id: "israel", name: "The Edward Israel", kind: "ship", at: [-.5, .2], h: 1.4, books: [4], desc: "Royal Charter Energy’s survey ship, home of Murtry’s security team. Naomi is captured aboard trying to disable a shuttle rigged as a bomb, until Havelock turns on Murtry and frees her."},
             {id: "barb", name: "The Barbapiccola", kind: "ship", at: [.4, -.2], h: 1.4, books: [4], desc: "The refugees’ ore ship, falling with its reactor dead. Naomi tries to tow it up with the Rocinante’s railgun recoil; the tether is cut, and Basia gets the crew out in improvised pods before it burns up."},
             {id: "roci", name: "The Rocinante", kind: "ship", at: [0, .5], books: [4], desc: "Alex holds the ship in orbit on battery power. At the end Holden sends the protomolecule fragment that held Miller into Ilus’s sun."}
           ]}}
       ]},

      {id: "laconia", name: "Laconia", group: "gates", gate: true, books: [5, 6, 7, 8, 9], first: 5, major: true,
       status: "Duarte’s refuge", star: {name: "Laconia’s sun", col: "#ffeccc"}, map: G.laconia, est: true, hero: "statebuilding",
       distText: GATEPOS,
       blurb: "A world beyond one of the gates. At the end of the fifth book a Martian admiral, Winston Duarte, takes a fleet of stolen warships through the Laconia gate, and the next ship to follow is lost in the crossing. Nobody in Sol knows what is on the other side.",
       short: "The world behind the forbidden gate.",
       facts: [["Ruler", "Winston Duarte"]],
       eras: {
         6: {status: "Behind a blockade", blurb: "The rogue Martians on Laconia have been arming the Free Navy. After Marco Inaros falls, Laconia goes silent and Earth blockades its gate."},
         7: {status: "Capital of the Laconian Empire", blurb: "Decades of quiet work: using the protomolecule and the builders’ huge construction platforms in orbit, Duarte’s people have built warships no one else can match. From this capital High Consul Duarte sends them out to take the ring space, then Sol, and a captive Holden is brought here."},
         8: {status: "Besieged", blurb: "The heart of the empire. With Duarte struck senseless by the ring entities, his court hides the truth and fights over who rules. In the end Naomi’s resistance fleet comes through the gate and destroys the orbital construction platforms, so Laconia can build no more."},
         9: {status: "The emperor gone", blurb: "Duarte wakes changed, walks out of the State Building and vanishes, and Colonel Aliana Tanaka is sent to find him."}
       },
       gfx: {type: "terran", sea: .5, freq: 1.4, pal: ["#0a1c32", "#2a5a80", "#3a5a34", "#6a7a48", "#7a6a52", "#eeeeea"], clouds: .4, atmo: "#86aaff", atmoK: 1, lights: .4, sw: "#4a6a40",
             feat: [{k: "continent", at: [20, 40], r: 28, s: .22}, {k: "range", from: [30, 20], to: [14, 58], w: 2.5, s: .26}]},
       sites: [
         {id: "statebuilding", name: "The State Building", lat: 22, lon: 38, books: [7, 8, 9], desc: "The Duarte family’s seat in the capital of the Laconian Empire, where Holden is held as a prisoner-guest (all Laconia positions estimated).",
          scene: {kind: "palace", arch: "imperial", size: "large", tod: "day", weather: "clear", /* layout schematic */
           landmarks: [
             {id: "cell", name: "Holden’s cell", kind: "keep", at: [-.5, .2], books: [7], desc: "Holden is brought here as a prisoner. Duarte visits him and offers an alliance: humanity must meet whatever killed the builders with discipline, under one ruler."},
             {id: "grounds", name: "The grounds", kind: "garden", at: [0, -.4], h: 1.2, books: [8], desc: "Holden may walk the palace grounds but never leave, and he is always watched. He speaks with Kajri, Avasarala’s granddaughter, and with Drummer at Avasarala’s wake."},
             {id: "hall", name: "The funeral hall", kind: "hall", at: [.3, .3], h: 1.4, books: [8], desc: "Chrisjen Avasarala dies of old age and is given a state funeral on Laconia; Holden, still a captive, pays his respects."},
             {id: "quarters", name: "Duarte’s rooms", kind: "palace", at: [0, .6], h: 1.8, books: [8], desc: "Left senseless when the ring entities strike, Duarte lies here while Trejo, Ilich, Teresa and Cortázar hide his condition. When he wakes he kills Cortázar."},
             {id: "teresa", name: "Teresa’s rooms", kind: "house", at: [.5, -.1], books: [8], desc: "The fourteen-year-old heir is being trained to succeed a father who means never to die. She slips out to the hills, and in the end leaves with Holden using Amos’s beacon."}
           ]}},
         {id: "pens", name: "The Pens", lat: 20, lon: 41, books: [8], desc: "Cortázar’s research facility, where Elvi meets the children Cara and Xan, brought back from death by the planet’s native repair creatures.",
          scene: {kind: "industrial", arch: "modern", size: "medium", tod: "day", weather: "clear", /* layout schematic */
           landmarks: [
             {id: "lab", name: "Cortázar’s lab", kind: "hall", at: [0, 0], books: [8], desc: "Brought in to cure Duarte, Elvi learns here that his long life came from two dead children rebuilt by Laconia’s native repair drones."}
           ]}},
         {id: "cave", name: "The cave in the hills", lat: 26, lon: 33, books: [8, 9], desc: "Where Teresa Duarte secretly visits a man she calls Timothy, who is really Amos Burton. He is killed in a firefight here, and the native repair creatures bring him back.",
          scene: {kind: "wilds", arch: "rustic", size: "small", tod: "dusk", weather: "clear", /* layout schematic */
           landmarks: [
             {id: "cave", name: "Timothy’s cave", kind: "cave", at: [0, .2], books: [8], desc: "Teresa sneaks out to meet a man here she calls Timothy. He is Amos, sent with a pocket nuclear weapon to free Holden. Laconian security kills him, and his body vanishes."},
             {id: "trail", name: "Duarte’s trail", kind: "camp", at: [.5, -.3], books: [9], desc: "Tracking the vanished High Consul, Colonel Tanaka finds that he came to Amos’s old cave and left in a small alien ship."}
           ]}},
         {id: "orbit", name: "The orbital platforms", lat: -10, lon: 60, books: [7, 8], desc: "The builders’ huge construction platforms in orbit over Laconia, where Duarte’s warships are grown (marker position schematic).",
          scene: {kind: "station", arch: "alien", size: "huge", tod: "day", weather: "clear", space: true, sky: {planet: {c: "#4a6a40", size: 2.4}}, /* layout schematic */
           landmarks: [
             {id: "platforms", name: "The construction platforms", kind: "station", at: [0, .2], h: 2.4, books: [7], desc: "Alien construction platforms that Laconia controls with protomolecule samples, growing warships no one else can match."},
             {id: "strike", name: "The siege", kind: "ship", at: [.5, -.3], h: 1.2, books: [8], desc: "Naomi’s hundreds of ships draw out the last flagship guarding Laconia while a strike force destroys the platforms. Laconia is left with one flagship and no way to build more."}
           ]}}
       ]},

      {id: "freehold", name: "Freehold", group: "gates", gate: true, books: [7, 8, 9], first: 7, status: "Colony of sovereign citizens",
       star: {name: "Freehold’s sun", col: "#ffe4c4"}, map: G.freehold, est: true, hero: "township",
       distText: GATEPOS,
       blurb: "A small, dry world, a little smaller than Mars, settled by a few hundred Earth-born colonists who reject any central authority. When it defies the Transport Union in the seventh book, the Rocinante is sent to bring its governor in. Later the crew hides the Rocinante here.",
       short: "The libertarian colony where the Rocinante hides.",
       facts: [["Settlers", "About 300, all born on Earth"], ["Government", "Assembly of Sovereign Citizens"], ["Resources", "Lithium; uranium in the polar ice"]],
       eras: {9: {status: "Base of the Underground", blurb: "A small, dry libertarian colony that becomes home to the Underground’s base, Draper Station. In the last book Laconian forces come here hunting the Rocinante."}},
       gfx: {type: "desert", sea: .15, dune: 6, pal: ["#1a2a3a", "#3a5a6a", "#9a7a50", "#b89a68", "#7a6450", "#f0f0ea"], clouds: .2, atmo: "#c8b898", atmoK: .7, lights: .1, ice: 70, sw: "#b89a68"},
       sites: [
         {id: "township", name: "Freehold township", lat: 30, lon: 10, books: [7], desc: "The colony’s only town, in a semi-arid temperate zone, run by its Assembly and a citizen militia (position estimated).",
          scene: {kind: "town", arch: "rustic", size: "small", tod: "day", weather: "dust", /* layout schematic */
           landmarks: [
             {id: "assembly", name: "The Assembly", kind: "hall", at: [0, .1], books: [7], desc: "Freehold’s colonists govern themselves here. Facing a three-year trade ban from the Transport Union, they hand over their governor, Payne Houston, rather than starve."},
             {id: "hideout", name: "The Rocinante’s hiding place", kind: "pad", at: [.6, -.4], books: [7], desc: "After the breakout from Medina, the crew hides the Rocinante here, out of Laconia’s sight."}
           ]}},
         {id: "draper", name: "Draper Station", lat: -12, lon: 60, books: [9], desc: "The Underground’s base in the Freehold system (shown on the world for convenience; marker position schematic).",
          scene: {kind: "station", arch: "industrial", size: "medium", tod: "night", weather: "clear", space: true, sky: {planet: {c: "#b89a68", size: 1.6}}, /* layout schematic */
           landmarks: [
             {id: "cells", name: "Where the crew is held", kind: "keep", at: [-.3, .2], books: [9], desc: "The resistance member Jillian Houston locks up the Rocinante’s crew and accepts Laconia’s offer of an armistice in exchange for Teresa. When Tanaka kills her guards, Jillian lets the crew go."},
             {id: "berth", name: "The berths", kind: "dock", at: [.4, -.3], books: [9], desc: "The crew runs for the Rocinante and escapes through the gate, while the Gathering Storm sacrifices itself to cover them."}
           ]}}
       ]},

      {id: "auberon", name: "Auberon", group: "gates", gate: true, books: [7, 8], first: 7, status: "Prosperous colony",
       star: {name: "Auberon’s sun", col: "#fff2dc"}, map: G.auberon, est: true, hero: "barradan",
       distText: GATEPOS,
       blurb: "One of the most successful colonies, lush and crowded, with a dozen cities of millions, farms of native and Earth crops, and a base on its moon. It was working on a way to turn alien life into food humans can eat. It welcomes the Laconians early, and Duarte sends a governor, Biryar Rittenaur.",
       short: "The rich colony; later Naomi’s base.",
       facts: [["Cities", "Twelve, of millions each"], ["Capital", "Barradan"], ["Laconian governor", "Biryar Rittenaur"]],
       eras: {8: {status: "Underground base", blurb: "A rich colony under a Laconian governor. In the eighth book Naomi, stranded by the closing of the gates, comes here and takes over its Underground."}},
       gfx: {type: "terran", sea: .48, freq: 1.5, pal: ["#0a1e34", "#2a6286", "#3e6a32", "#6a8a44", "#6e6a50", "#f0f0ea"], clouds: .45, atmo: "#86aaff", atmoK: 1, lights: .8, sw: "#3e6a32"},
       moons: [{name: "Moon", size: .2, dist: 3.4}],
       sites: [
         {id: "barradan", name: "Barradan", lat: 18, lon: 22, books: [7, 8], desc: "The capital, with the governor’s office and a great agricultural company (spelled Barradon in some places; position estimated).",
          scene: {kind: "capital", arch: "modern", size: "large", tod: "day", weather: "clear", /* layout schematic */
           landmarks: [
             {id: "governor", name: "The governor’s office", kind: "hall", at: [0, .2], h: 1.3, books: [7], desc: "Auberon accepts the new order early, and Duarte sends it a Laconian governor who rules from here."},
             {id: "underground", name: "The Underground’s cell", kind: "house", at: [-.5, -.3], books: [8], desc: "Stranded when Laconia halts gate traffic, Naomi reaches Auberon and takes over its Underground, then gathers ships from across the colonies."}
           ]}},
         {id: "carlisle", name: "Carlisle", lat: 8, lon: 40, books: [7], desc: "Another of Auberon’s cities (position estimated).",
          scene: {kind: "city", arch: "modern", size: "large", tod: "day", weather: "clear"}}
       ]},

      {id: "newegypt", name: "New Egypt", group: "gates", gate: true, books: [6, 9], first: 6, status: "Colony world",
       star: {name: "New Egypt’s sun", col: "#ffeccc"}, map: G.newegypt, est: true,
       distText: GATEPOS,
       blurb: "A colony settled by Royal Charter Energy in the years after the gates open.",
       short: "A corporate colony.",
       eras: {9: {blurb: "A colony settled by Royal Charter Energy. In the last book the Rocinante brings Teresa Duarte here to a boarding school run by a relative, and Tanaka’s marines are waiting."}},
       gfx: {type: "desert", sea: .3, dune: 7, pal: ["#0a2a3a", "#2a6a7a", "#b08a58", "#c8a46e", "#9a7a58", "#f0e8d8"], clouds: .25, atmo: "#a8c8ff", atmoK: .9, lights: .3, sw: "#c8a46e"},
       sites: [
         {id: "school", name: "The boarding school", lat: 15, lon: -20, books: [9], desc: "Where the Rocinante tries to leave Teresa Duarte in safety (marker position estimated).",
          scene: {kind: "town", arch: "modern", size: "small", tod: "day", weather: "clear", /* layout schematic */
           landmarks: [
             {id: "school", name: "The school", kind: "hall", at: [0, .2], books: [9], desc: "A boarding school where the crew means to leave Teresa. Tanaka and her Laconian marines are already waiting."},
             {id: "fight", name: "The firefight", kind: "plaza", at: [.4, -.3], books: [9], desc: "The crew fights its way back to the Rocinante. Amos is shot and keeps going."}
           ]}}
       ]},

      {id: "baragaon", name: "Bara Gaon", aka: ["Bara Gaon 5"], group: "gates", gate: true, books: [9], first: 9, status: "Colony system",
       star: {name: "Bara Gaon", col: "#fff0d8"}, map: G.baragaon, est: true,
       distText: GATEPOS,
       blurb: "A colony system with an orbital complex around its fifth planet. In the last book Tanaka follows the wrong ship here, and on Bara Gaon 5 she has her wounds treated and seeks help for the strange shared memories in her head.",
       short: "Where Tanaka loses the trail.",
       gfx: {type: "terran", sea: .55, pal: ["#0c1e30", "#2c5a78", "#4a5e3a", "#6a7a4a", "#7a6e58", "#eeeeea"], clouds: .5, atmo: "#90b0ff", atmoK: 1, lights: .5, sw: "#4a5e3a"},
       sites: [
         {id: "bg5", name: "Bara Gaon 5", lat: 10, lon: 0, books: [9], desc: "The colony world of the system, with an orbital complex above it (marker position estimated).",
          scene: {kind: "city", arch: "modern", size: "medium", tod: "day", weather: "clear", /* layout schematic */
           landmarks: [
             {id: "clinic", name: "The doctor’s office", kind: "hall", at: [0, 0], books: [9], desc: "Having followed the wrong ship here, Tanaka has her wounds treated and looks for help, and medication, for the memories in her head that are not her own."}
           ]}}
       ]},

      {id: "sanesteban", name: "San Esteban", group: "gates", gate: true, books: [6, 9], first: 6, status: "Colony system",
       star: {name: "San Esteban’s sun", col: "#ffe8c8"}, map: G.sanesteban, est: true,
       distText: GATEPOS,
       blurb: "A colony destination. In the sixth book the colony ship Minsky, bound here, is seized by Michio Pa’s breakaway fleet.",
       short: "A colony destination.",
       eras: {9: {status: "Dead system", blurb: "In the last book the ring entities strike San Esteban: the speed of light itself shifts, chemical bonds fail, and nearly every living thing in the system dies. The news terrifies every colony."}},
       gfx: {type: "terran", sea: .5, pal: ["#0a1a2c", "#2a5476", "#4e5a3a", "#6e7448", "#76684e", "#ecece8"], clouds: .4, atmo: "#8aaaf0", atmoK: .9, lights: .2, sw: "#4e5a3a"},
       sites: [
         {id: "sanesteban-colony", name: "The colony", lat: 5, lon: 10, books: [6, 9], desc: "San Esteban’s settlement (marker position estimated; the books give no detail of its towns).",
          scene: {kind: "town", arch: "modern", size: "small", tod: "dusk", weather: "mist", /* layout schematic */
           landmarks: [
             {id: "colony", name: "The settlement", kind: "house", at: [0, 0], books: [6], desc: "The destination of the colony ship Minsky, seized on its way here by Michio Pa’s breakaway ships."},
             {id: "dead", name: "The dead system", kind: "ruin", at: [.4, .3], books: [9], desc: "The ring entities shift the laws of physics here; chemistry fails and nearly every living thing in the system dies."}
           ]}}
       ]},

      {id: "nieuwestad", name: "Nieuwestad", group: "gates", gate: true, books: [9], first: 9, status: "Colony system",
       star: {name: "Nieuwestad’s sun", col: "#fff4e0"}, map: G.nieuwestad, est: true,
       distText: GATEPOS,
       blurb: "The colony where Alex Kamal’s son Kit takes his family. At the end of the series Alex flies the Rocinante here to be with them.",
       short: "Alex’s last port.",
       gfx: {type: "terran", sea: .55, freq: 1.7, pal: ["#0a1e34", "#2a6086", "#3a6234", "#68844a", "#72705a", "#f2f2ee"], clouds: .45, atmo: "#8ab0ff", atmoK: 1, lights: .3, sw: "#3a6234"},
       sites: [
         {id: "kithome", name: "Kit’s home", lat: 12, lon: -15, books: [9], desc: "Where Alex’s son Kit and his family live (marker position estimated).",
          scene: {kind: "town", arch: "modern", size: "small", tod: "dawn", weather: "clear", /* layout schematic */
           landmarks: [
             {id: "port", name: "Where the Rocinante comes down", kind: "pad", at: [.4, -.3], books: [9], desc: "At the end of the series Alex flies the Rocinante here to join his son and grandchild."}
           ]}}
       ]},

      {id: "adro", name: "Adro", aka: ["The Adro Diamond"], group: "gates", gate: true, books: [8, 9], first: 8, major: true, status: "Dead system · builder record",
       star: {name: "A faint white dwarf", col: "#e8f0ff"}, map: G.adro, est: true,
       distText: GATEPOS,
       blurb: "A dead system: a faint white dwarf with no planets, only its gate and a huge, faintly green crystal the size of Jupiter. Elvi Okoye’s Laconian science mission finds that it answers to the protomolecule, and suspects it is a record left by the builders.",
       short: "The giant green diamond.",
       facts: [["Star", "White dwarf"], ["Object", "A crystal about the size of Jupiter"]],
       eras: {9: {status: "The builders’ library", blurb: "In the last book Elvi’s team uses the protomolecule-changed girl Cara to dive into the diamond’s memory. It shows the builders’ history, from creatures in a frozen ocean to a single mind across the galaxy, and how they died."}},
       gfx: {type: "ice", sea: 0, pal: ["#0a3a2a", "#1a5a40", "#3a8a6a", "#5aa888", "#8ad0b0", "#d8fff0"], rough: .15, bump: .6, clouds: 0, atmo: "#7affc8", atmoK: .6, lights: 0, amb: .06, sw: "#5aa888"},
       sites: [
         {id: "diamond", name: "Beside the diamond", lat: 0, lon: 0, books: [8, 9], desc: "The space beside the green crystal, where the Falcon studies it (marker position schematic).",
          scene: {kind: "station", arch: "crystal", size: "large", tod: "night", weather: "clear", space: true, sky: {planet: {c: "#5aa888", size: 3}, sun: "#e8f0ff"}, /* layout schematic */
           landmarks: [
             {id: "crystal", name: "The Adro Diamond", kind: "monolith", at: [0, .3], h: 3, books: [8], desc: "A faintly green crystal the size of a planet, orbiting a white dwarf. It reacts to the Falcon’s live protomolecule sample, and Elvi suspects it stores records; the mission commander forces them on before she can finish."},
             {id: "falcon", name: "The Falcon", kind: "ship", at: [-.4, -.3], h: 1.2, books: [8], desc: "Elvi Okoye’s Laconian science ship, exploring the dead systems with her husband Fayez and their team."},
             {id: "dive", name: "The dives", kind: "beacon", at: [.4, -.3], books: [9], desc: "Elvi’s team sends Cara, and then Cara and Amos together, into the diamond’s memory. They see the builders’ history, until Amos persuades Elvi to stop using Cara."}
           ]}}
       ]},

      {noSurface: true, id: "tecoma", name: "Tecoma", group: "gates", gate: true, books: [8], first: 8, status: "Dead system · neutron star",
       star: {name: "A neutron star", col: "#c8e0ff"}, map: G.tecoma, est: true,
       distText: GATEPOS,
       blurb: "An empty system with nothing but an unstable neutron star and its gate. Laconia uses it to strike back at whatever has been eating ships in the gates: an antimatter-laden ship is sent through. The star collapses, and the burst of gamma rays it throws through the gate destroys the Tecoma gate and the one across from it in the ring space.",
       short: "Where Laconia attacked the dark.",
       facts: [["Shown as", "The neutron star itself"]],
       gfx: {type: "lava", sea: .5, pal: ["#3a5aa0", "#6a8ad0", "#a8c0f0", "#d0e0ff", "#f0f6ff", "#ffffff"], lava: "#d8e8ff", rough: .2, bump: .4, clouds: 0, atmo: "#b8d0ff", atmoK: 1.1, lights: 0, amb: .7, sw: "#a8c0f0"}},

      {id: "thanjavur", name: "Thanjavur", group: "gates", gate: true, books: [8], first: 8, status: "Colony cut off",
       star: {name: "Thanjavur’s sun", col: "#fff0d8"}, map: G.thanjavur, est: true,
       distText: GATEPOS,
       blurb: "A colony whose gate lies across the ring space from Tecoma’s. When the Laconian experiment at Tecoma throws gamma rays through the slow zone, the Thanjavur gate is destroyed and the colony is cut off from the rest of humanity.",
       short: "Stranded by the Tecoma burst.",
       gfx: {type: "terran", sea: .5, pal: ["#0a1c30", "#2a5a7e", "#4a5a36", "#6a7646", "#746a52", "#eeeeea"], clouds: .45, atmo: "#8aaeff", atmoK: 1, lights: .25, sw: "#4a5a36"},
       sites: [
         {id: "thanjavur-colony", name: "The colony", lat: 8, lon: 30, books: [8], desc: "Thanjavur’s settlement (marker position estimated; the books give no detail of it).",
          scene: {kind: "town", arch: "modern", size: "small", tod: "dusk", weather: "clear", /* layout schematic */
           landmarks: [
             {id: "settlement", name: "The settlement", kind: "house", at: [0, 0], books: [8], desc: "A human colony that loses its only gate when the Tecoma burst crosses the slow zone, cutting it off from everyone else for good."}
           ]}}
       ]},

      {id: "dobridomov", name: "Dobridomov", group: "gates", gate: true, books: [9], first: 9, status: "One of the Thirty Worlds",
       star: {name: "Dobridomov’s sun", col: "#fff2e0"}, map: G.dobridomov, est: true,
       distText: GATEPOS,
       blurb: "A colony that, about a thousand years after the gates fall, belongs to the Thirty Worlds, a federation with its own faster-than-light ship. The mission that finds Amos on Earth in the epilogue sets out from here.",
       short: "Where the epilogue’s mission begins.",
       gfx: {type: "terran", sea: .5, freq: 1.5, pal: ["#0a1e34", "#2a6086", "#3e6236", "#6a844c", "#74705a", "#f2f2ee"], clouds: .42, atmo: "#8ab0ff", atmoK: 1, lights: .9, sw: "#3e6236"},
       sites: [
         {id: "launch", name: "The mission’s departure", lat: 10, lon: 20, books: [9], desc: "Where the Thirty Worlds expedition to Earth begins (marker position estimated; the epilogue gives no detail of the planet).",
          scene: {kind: "spaceport", arch: "modern", size: "medium", tod: "dawn", weather: "clear", /* layout schematic */
           landmarks: [
             {id: "ship", name: "The faster-than-light ship", kind: "ship", at: [0, 0], h: 1.6, books: [9], desc: "About a thousand years after the gates fall, the Thirty Worlds have built their own faster-than-light ship. An expedition sets out to find old Earth."}
           ]}}
       ]}
    ],

    events: [
      /* I · Leviathan Wakes */
      {id: "b1a", book: 1, world: "saturn", site: "rings", lm: "canterbury", title: "The Canterbury", text: "The ice hauler Canterbury, out of Saturn’s rings for Ceres, answers a distress call from a derelict ship, the Scopuli. Its executive officer Jim Holden takes four crew to look. While they are away a stealth ship destroys the Canterbury, and Holden broadcasts that Martian technology was involved."},
      {id: "b1b", book: 1, world: "ceres", site: "helix", lm: "stationhouse", title: "A side job for Miller", text: "On Ceres, the tired detective Joe Miller is quietly told to find Julie Mao, the runaway daughter of a rich Lunar family, and send her home. Riots follow Holden’s broadcast."},
      {id: "b1k", book: 1, world: "sun", side: "In deep space", title: "The Donnager", text: "The Martian flagship Donnager picks up Holden’s crew and is then boarded by attackers. As the battleship is scuttled, the survivors escape in its gunship Tachi, which Holden renames the Rocinante."},
      {id: "b1c", book: 1, world: "tycho", site: "tychostation", lm: "fred", title: "The Rocinante reaches Tycho", text: "After escaping the destruction of the Donnager, Holden’s crew reaches Fred Johnson’s station."},
      {id: "b1d", book: 1, world: "ceres", site: "helix", lm: "stationhouse", title: "Miller fired", text: "Miller learns Julie had joined the OPA and was aboard the Scopuli. Warned off, he keeps digging, loses his badge, and buys passage to Eros."},
      {id: "b1e", book: 1, world: "eros", site: "hotel", lm: "room", title: "Julie", text: "Miller meets Holden’s crew on Eros. They find Julie dead in a hotel room, covered in a strange growth, and her records point to the ship that brought the infection."},
      {id: "b1f", book: 1, world: "eros", site: "shelters", lm: "shelter", fx: "crowd", title: "The Eros incident", text: "A false radiation alarm herds the people of Eros into shelters, where Protogen seeds them with the protomolecule. Miller and the crew barely get out."},
      {id: "b1m", book: 1, world: "eros", site: "docks", lm: "berth", title: "Out of Eros", text: "Badly dosed with radiation, Miller hauls Holden back to the Rocinante, and the ship’s medical bay keeps them both alive."},
      {id: "b1g", book: 1, world: "phoebe", site: "phoebecore", lm: "find", title: "What came from Phoebe", text: "A recording from Protogen reveals the truth: the protomolecule came from Phoebe, a weapon sent long ago to remake life on Earth. Eros is an experiment, and the Canterbury was destroyed to start a war that would keep everyone looking away."},
      {id: "b1o", book: 1, world: "thoth", site: "thothbase", lm: "landing", fx: "battle", title: "The assault on Thoth", text: "Fred Johnson’s OPA attacks Protogen’s hidden station in space and inside its corridors. The Rocinante is badly damaged and has to set down on the station itself."},
      {id: "b1h", book: 1, world: "thoth", site: "thothbase", lm: "lab", title: "Thoth Station", text: "The crew, Miller and the OPA storm Protogen’s hidden station. Its chief scientist, Dresden, talks of making humanity into gods; Miller shoots him dead."},
      {id: "b1p", book: 1, world: "tycho", site: "tychostation", lm: "berth", title: "Repairs at Tycho", text: "While the Rocinante is repaired at Tycho, Holden and Naomi become a couple, and the crew argues over what to do about Eros."},
      {id: "b1i", book: 1, world: "eros", title: "Eros moves", text: "The OPA tries to drive Eros into the Sun with the Nauvoo. The asteroid dodges, then turns toward Earth faster than any ship can follow."},
      {id: "b1j", book: 1, world: "venus", site: "erosfall", lm: "impact", fx: "blast", title: "Into Venus", text: "Miller rides a bomb into Eros and finds what is left of Julie steering it. He talks her round, and Eros comes down on Venus instead of Earth."},
      {id: "b1q", book: 1, world: "ceres", title: "A bargaining chip", text: "Back on Ceres, Holden gives Fred Johnson the protomolecule sample recovered from Protogen, to bargain with at the coming peace talks."},
      /* II · Caliban's War */
      {id: "b2i", book: 2, world: "ganymede", site: "domes", lm: "preschool", title: "Mei is taken", text: "Four-year-old Mei Meng, who has an immune disorder, is led out of her preschool by her own doctor, Strickland. Other children with her condition vanish too."},
      {id: "b2a", book: 2, world: "ganymede", site: "outpost", lm: "line", fx: "battle", title: "The monster on Ganymede", text: "A creature wearing no armour wipes out Bobbie Draper’s Martian marine platoon and the UN troops facing them. Earth and Mars start shooting, and Ganymede comes apart."},
      {id: "b2j", book: 2, world: "ganymede", site: "domes", lm: "mirrors", title: "The mirror falls", text: "In the fighting one of the great mirrors comes down. Prax’s crops die, and the food system of the outer planets begins to fail."},
      {id: "b2b", book: 2, world: "ganymede", site: "lab", lm: "cage", fx: "battle", title: "Prax’s search", text: "The botanist Prax Meng’s little daughter Mei has been taken from her school by her own doctor. Holden, Amos and Prax trace her to a hidden lab, and the thing kept inside it."},
      {id: "b2c", book: 2, world: "earth", site: "newyork", lm: "un", title: "Avasarala", text: "Bobbie is brought to Earth for peace talks and breaks ranks. Chrisjen Avasarala, a sharp-tongued UN official, takes her on and starts pulling at a conspiracy inside her own government."},
      {id: "b2d", book: 2, world: "tycho", site: "tychostation", lm: "fred", title: "Stowaway", text: "A hybrid hidden in the Rocinante’s hold is killed with the ship’s own drive. At Tycho, Holden accuses Fred Johnson and the crew is cut loose from the OPA."},
      {id: "b2e", book: 2, world: "jupiter", site: "jovianspace", lm: "yacht", title: "Escape from the Guanshiyin", text: "Sent out on Jules-Pierre Mao’s yacht as a way of sidelining her, Avasarala learns a fleet is coming to kill Holden. Bobbie takes the yacht by force and they get to the Rocinante."},
      {id: "b2k", book: 2, world: "jupiter", site: "jovianspace", lm: "unships", fx: "battle", title: "The hunters beaten", text: "With Martian warships alongside and Bobbie on the guns, the Rocinante beats the UN ships sent to kill Holden and turns for Io."},
      {id: "b2f", book: 2, world: "io", site: "ioorbit", lm: "flagship", fx: "battle", title: "The battle over Io", text: "The hybrids are made on Io, sold by Mao to a rogue UN faction. Holden boards the flagship of Admiral Nguyen to stop hybrid-loaded rockets bound for Mars, while Amos and Prax rescue Mei."},
      {id: "b2l", book: 2, world: "io", site: "iolab", lm: "children", title: "Mei found", text: "Bobbie holds off a hybrid outside the lab while Prax and Amos go in. Prax finds Mei alive among the surviving children, and Amos kills Strickland."},
      {id: "b2g", book: 2, world: "luna", title: "Reckoning", text: "Errinwright and Mao are brought down. Avasarala is promoted, Prax is given Ganymede to rebuild, and Bobbie goes home."},
      {id: "b2h", book: 2, world: "venus", site: "erosfall", lm: "structures", fx: "launch", title: "Venus rises", text: "The structure on Venus finishes and launches itself out of the system. Aboard the Rocinante, Holden sees Miller again: a ghost made by the protomolecule."},
      /* III · Abaddon's Gate */
      {id: "b3a", book: 3, world: "solring", site: "ringmouth", lm: "gate", title: "The Ring", text: "The construction from Venus stops beyond the orbit of Uranus and becomes a ring a thousand kilometres across. A young Belter racer dives through it and is lost, and the navies gather."},
      {id: "b3b", book: 3, world: "europa", site: "annahome", lm: "church", title: "Anna", text: "Anna Volovodov, a Methodist pastor from Europa, joins a UN delegation of artists and clergy sent to witness the Ring."},
      {id: "b3c", book: 3, world: "ceres", site: "cdocks", lm: "berth", title: "The Rocinante impounded", text: "Mars sues for the return of its stolen corvette. Holden agrees to a documentary to pay the lawyers, and a film crew comes aboard."},
      {id: "b3d", book: 3, world: "solring", site: "ringmouth", lm: "flotilla", fx: "blast", title: "Framed", text: "Clarissa Mao, posing as a technician, hijacks the Rocinante through planted software and blames Holden for a bombing. With the fleets firing on him, Holden flies into the Ring, and the others follow."},
      {id: "b3k", book: 3, world: "ringstation", site: "slowzone", lm: "gates", title: "The slow zone", text: "On the far side of the Ring, the torpedo chasing the Rocinante is caught and stopped. Nothing may move faster than six hundred metres a second, and the Behemoth leads the flotilla through after Holden."},
      {id: "b3e", book: 3, world: "ringstation", site: "core", lm: "memory", title: "The station", text: "Inside is the slow zone. Holden reaches the station with Miller’s ghost and sees what happened to the builders: an empire across the galaxy, attacked by something, burning whole star systems to stop it."},
      {id: "b3l", book: 3, world: "ringstation", site: "slowzone", lm: "flotilla", title: "The grenade", text: "Martian marines follow Holden to the station, and one of them fires a grenade. The station answers by dropping its speed limit at a stroke."},
      {id: "b3f", book: 3, world: "medina", site: "drum", lm: "drumring", title: "The deceleration", text: "Every ship in the slow zone is slammed to a crawl, and many die. Paralysed in the crash, Bull spins up the Behemoth’s drum for gravity, and the ship becomes a hospital and a refuge."},
      {id: "b3n", book: 3, world: "medina", site: "drum", lm: "brig", title: "Clarissa", text: "Caught after attacking the Rocinante, Clarissa Mao is held in the Behemoth’s brig. Anna visits her and offers a forgiveness she will not accept."},
      {id: "b3o", book: 3, world: "medina", site: "drum", lm: "engineering", fx: "battle", title: "Bull’s last stand", text: "Ashford retakes the ship and shoots the engineer Sam Rosenberg for sabotaging his weapon. Holden and Bull storm engineering; Bull stays behind with grenades to stop armoured attackers, and dies."},
      {id: "b3g", book: 3, world: "medina", site: "drum", lm: "bridge", title: "Ashford’s gamble", text: "Ashford orders the comm laser fired at the Ring, and Holden fears the station will answer by destroying the Sun. Moved by Anna’s broadcast, Clarissa opens the bridge, knocks Ashford from the controls and sends the Behemoth dark."},
      {id: "b3h", book: 3, world: "ringstation", site: "slowzone", lm: "gates", title: "The gates open", text: "The ships power down, the station judges them harmless, and the speed limit lifts. More than thirteen hundred gates open onto other star systems."},
      {id: "b3i", book: 3, world: "medina", site: "drum", lm: "drumring", title: "Medina Station", text: "The Behemoth is left in the ring space as Medina Station, a waystation for ships heading for the new worlds."},
      /* IV · Cibola Burn */
      {id: "b4a", book: 4, world: "ilus", site: "landing", lm: "pad", fx: "blast", title: "First Landing", text: "Refugees from Ganymede slip through a gate and found a mining town on Ilus. When a corporate survey ship arrives with a UN charter, they blow up its landing pad as a shuttle comes down."},
      {id: "b4b", book: 4, world: "medina", title: "A mediator", text: "Fred Johnson and Avasarala send Holden through the gates to keep the peace on Ilus."},
      {id: "b4c", book: 4, world: "ilus", site: "landing", lm: "town", title: "Murtry", text: "The corporate security chief Adolphus Murtry shoots a colonist in front of the town. Holden’s mediation fails as killings mount on both sides."},
      {id: "b4g", book: 4, world: "ilus", site: "ilusorbit", lm: "israel", title: "Naomi taken", text: "Naomi tries to disable the corporate shuttle Murtry has rigged as a bomb and is captured aboard the Edward Israel. Alex aims the Rocinante’s railgun at the Israel’s reactor."},
      {id: "b4d", book: 4, world: "ilus", site: "island", lm: "reactor", fx: "storm", title: "The planet wakes", text: "An alien reactor melts down on the largest island. A storm of water and wind flattens the town; the survivors shelter in the ruins, and the planet’s old defences start shooting down anything with power."},
      {id: "b4h", book: 4, world: "ilus", site: "ruins", lm: "shelter", title: "Blindness", text: "In the ruins, a tiny organism in the rainwater starts to blind the colonists. Holden’s daily anti-cancer drugs protect him, Elvi works out why, and he gives his supply away."},
      {id: "b4e", book: 4, world: "ilus", site: "ilusorbit", lm: "barb", fx: "fire", title: "Falling orbits", text: "With their reactors dead, the ships in orbit start to fall. The Rocinante and the corporate ship’s crew rescue the refugees aboard the Barbapiccola before it burns up."},
      {id: "b4i", book: 4, world: "ilus", site: "ruins", lm: "transit", title: "Under Ilus", text: "Miller, riding a huge alien machine, leads Holden down into the planet’s transit network and explains what Ilus was built for."},
      {id: "b4j", book: 4, world: "ilus", site: "ruins", lm: "bridge", fx: "duel", title: "On the bridge", text: "Murtry follows them down and shoots Amos from behind, and the RCE officer Wei is killed. On a narrow bridge, Holden shoots Murtry and drags him to safety."},
      {id: "b4f", book: 4, world: "ilus", site: "deadspot", lm: "void", title: "The dead spot", text: "Guided by Miller, the biologist Elvi Okoye carries the network’s controller into a sphere of something that kills alien machines, and the defences fall silent. Murtry is taken for trial."},
      {id: "b4k", book: 4, world: "ilus", site: "ilusorbit", lm: "roci", title: "Goodbye, Miller", text: "With a new town rising on Ilus, Holden sends the protomolecule fragment that carried Miller into Ilus’s sun."},
      /* V · Nemesis Games */
      {id: "b5a", book: 5, world: "callisto", site: "yards", lm: "yard", fx: "battle", title: "The Callisto raid", text: "A radical Belter cell, led by a teenager named Filip, steals stealth coating from the Callisto shipyards and wrecks them."},
      {id: "b5b", book: 5, world: "tycho", site: "tychostation", lm: "berth", title: "Shore leave", text: "With the Rocinante under repair at Tycho, the crew scatters. Holden takes up a journalist’s question: who is stealing colony ships?"},
      {id: "b5m", book: 5, world: "tycho", site: "tychostation", title: "A mole on Tycho", text: "The journalist Monica Stuart, who has evidence of colony ships vanishing, is kidnapped; Holden and Fred find her sealed in a shipping container. Tycho’s chief engineer turns out to be a radical mole."},
      {id: "b5c", book: 5, world: "earth", site: "baltimore", title: "Amos goes home", text: "Amos returns to Baltimore for the funeral of the woman who raised him, then visits Clarissa Mao in prison."},
      {id: "b5d", book: 5, world: "mars", site: "mariner", lm: "home", title: "Alex and Bobbie", text: "Alex goes home to Mars and teams up with Bobbie, who is chasing missing Martian warships. Someone tries to kill them both."},
      {id: "b5e", book: 5, world: "ceres", site: "cdocks", lm: "chetz", title: "Naomi’s past", text: "Naomi answers a call from her past on Ceres: her son Filip, and his father, Marco Inaros. Marco takes her prisoner."},
      {id: "b5f", book: 5, world: "earth", site: "impact", lm: "strike", fx: "bombard", title: "The rocks fall", text: "Marco’s Free Navy drops stealth-coated asteroids on Earth. The strikes and what follows kill vast numbers and break the planet."},
      {id: "b5g", book: 5, world: "tycho", site: "tychostation", lm: "safe", fx: "battle", title: "Tycho attacked", text: "In the same coordinated strike the Free Navy hits Tycho and steals the last sample of the protomolecule."},
      {id: "b5h", book: 5, world: "medina", site: "drum", title: "Medina seized", text: "Free Navy ships seize Medina Station and close the gates."},
      {id: "b5i", book: 5, world: "hungaria", site: "hidden", lm: "corvettes", fx: "battle", title: "The stolen fleet", text: "Alex and Bobbie find the hidden fleet of stolen Martian warships, then save the Martian prime minister from an ambush and carry him to Luna in Bobbie’s racing yacht."},
      {id: "b5j", book: 5, world: "earth", site: "winnipesaukee", lm: "pad", fx: "launch", title: "Off the ground", text: "Amos breaks Clarissa out of prison. With his old friend Erich they make their way through the wreckage and fly to Luna from a rich enclave’s launch pad."},
      {id: "b5n", book: 5, world: "sun", side: "In deep space", title: "Naomi’s leap", text: "Marco rigs the Chetzemoka as a bomb, with a false distress call in Naomi’s voice. She crosses open vacuum without a suit to reach it and turns the call into a coded message that she is alive."},
      {id: "b5k", book: 5, world: "luna", site: "lunagov", lm: "conference", title: "Survivors", text: "Naomi slips Marco’s trap and is picked up by Alex and Bobbie. The crew comes together on Luna, where Avasarala is now acting Secretary-General."},
      {id: "b5l", book: 5, world: "laconia", title: "The Laconia gate", text: "The Martian admiral Winston Duarte, who armed the Free Navy, takes the best stolen warships through the Laconia gate. The next ship to cross is lost: something in the gates eats ships."},
      /* VI · Babylon's Ashes */
      {id: "b6a", book: 6, world: "earth", site: "abuja", title: "Earth after the rocks", text: "In Abuja, Anna Volovodov’s wife Namono lives through the aftermath as more rocks keep coming."},
      {id: "b6k", book: 6, world: "luna", site: "lunagov", lm: "warroom", title: "A joint fleet", text: "On Luna, Avasarala, the Martian prime minister and Fred Johnson join forces against the Free Navy. Holden agrees to help if he keeps the Rocinante, with Bobbie as mission commander."},
      {id: "b6b", book: 6, world: "luna", title: "The Azure Dragon", text: "Under Bobbie’s command, the Rocinante takes the Free Navy ship that has been guiding the rocks at Earth."},
      {id: "b6c", book: 6, world: "ceres", site: "govhall", lm: "dawes", title: "Ceres abandoned", text: "Marco strips Ceres and pulls out, leaving millions for his enemies to feed."},
      {id: "b6d", book: 6, world: "sanesteban", site: "sanesteban-colony", lm: "colony", title: "Michio Pa breaks away", text: "Michio Pa, sickened by Marco’s methods, turns her ships to piracy for the Belt, seizing the colony ship Minsky on its way to San Esteban, and pays for it."},
      {id: "b6e", book: 6, world: "tycho", title: "Fred Johnson’s last flight", text: "On a hard burn to an OPA meeting at Tycho, under attack from Marco’s ships, Fred Johnson has a stroke and dies."},
      {id: "b6f", book: 6, world: "callisto", title: "Filip Nagata", text: "Filip breaks with his father and stays behind on Callisto under his mother’s name."},
      {id: "b6l", book: 6, world: "ringstation", site: "slowzone", lm: "railguns", fx: "blast", title: "The guns fall", text: "Decoy drones draw the railguns’ fire while Bobbie’s team lands. Pinned down by Duarte’s marines, she sends her landing craft into the reactor that powers the guns and jumps clear."},
      {id: "b6g", book: 6, world: "medina", site: "drum", title: "Retaking Medina", text: "A combined fleet of Earth, Mars and the loyal Belt strikes for Medina. With its railguns silenced, Holden bluffs a full invasion, and the station surrenders to the Rocinante."},
      {id: "b6h", book: 6, world: "solring", site: "ringmouth", lm: "crossing", title: "Marco vanishes", text: "Naomi has worked out the rule of the vanishing ships. Mass sent through the Ring just ahead of Marco’s fleet makes the whole fleet disappear in the crossing."},
      {id: "b6i", book: 6, world: "ceres", site: "govhall", lm: "conference", title: "The Transport Union", text: "At a conference on Ceres, Holden proposes a union of Belter shippers to run the gates. He turns down its leadership, and Michio Pa takes it."},
      {id: "b6j", book: 6, world: "laconia", title: "Silence from Laconia", text: "Earth blockades the Laconia gate. Duarte makes no move."},
      /* VII · Persepolis Rising */
      {id: "b7a", book: 7, world: "freehold", site: "township", lm: "assembly", title: "Freehold", text: "Some thirty years on, with Camina Drummer president of the Transport Union, the Rocinante is sent to make Freehold give up the governor who broke the Union’s rules."},
      {id: "b7b", book: 7, world: "laconia", site: "orbit", lm: "platforms", title: "Laconia’s fleet", text: "On Laconia, Duarte’s people have used the builders’ orbital platforms and the protomolecule to build warships beyond anything in human space."},
      {id: "b7c", book: 7, world: "medina", site: "drum", lm: "governor", fx: "fleet", title: "The Tempest comes", text: "The battleship Heart of the Tempest comes through the Laconia gate, tears apart the slow zone’s defences and takes Medina. Captain Santiago Singh becomes governor."},
      {id: "b7p", book: 7, world: "medina", site: "drum", lm: "governor", title: "Singh’s rule", text: "After an assassination attempt kills his aide, Singh clamps curfews on Medina and removes his security chief, Colonel Aliana Tanaka, when she objects."},
      {id: "b7d", book: 7, world: "medina", site: "drum", lm: "engineering", title: "The heist", text: "Holden and Naomi, about to retire, join Saba’s resistance. They steal Laconian codes; Holden keeps the alarms going and is caught."},
      {id: "b7e", book: 7, world: "leuctra", site: "battle", lm: "fleet", fx: "battle", title: "The fleets broken", text: "At Point Leuctra in the asteroid belt, the combined fleet fails to stop the Tempest."},
      {id: "b7f", book: 7, world: "pallas", site: "pallasstation", lm: "refineries", fx: "blast", title: "Pallas destroyed", text: "After Tycho’s section withdraws, the Tempest destroys Pallas Station."},
      {id: "b7g", book: 7, world: "earth", title: "Surrender", text: "After a last stand in the Belt, Drummer surrenders the Union, and Earth and Mars follow."},
      {id: "b7h", book: 7, world: "medina", site: "drum", lm: "docks", fx: "battle", title: "The breakout", text: "Saba frees the prisoners; Bobbie and Amos take the gunship Gathering Storm while ships flee through the gates. Clarissa dies after saving Naomi, and Singh is shot by his own security chief."},
      {id: "b7i", book: 7, world: "freehold", site: "township", lm: "hideout", title: "Hiding on Freehold", text: "The Rocinante escapes the ring space and hides on Freehold."},
      {id: "b7j", book: 7, world: "auberon", site: "barradan", lm: "governor", title: "A Laconian governor", text: "Auberon is one of the first colonies to accept the new order, and Duarte sends it a governor."},
      {id: "b7k", book: 7, world: "laconia", site: "statebuilding", lm: "cell", title: "Duarte", text: "Holden arrives on Laconia as a prisoner and meets High Consul Duarte, who means to use the protomolecule to rule humanity and live forever."},
      /* VIII · Tiamat's Wrath */
      {id: "b8a", book: 8, world: "laconia", site: "statebuilding", lm: "hall", title: "Avasarala’s funeral", text: "Chrisjen Avasarala dies of old age and is given a state funeral on Laconia. Holden, still a captive, pays his respects."},
      {id: "b8b", book: 8, world: "adro", site: "diamond", lm: "crystal", title: "The diamond", text: "Elvi Okoye’s Laconian science ship Falcon explores the dead systems and finds a vast green crystal that reacts to the protomolecule."},
      {id: "b8k", book: 8, world: "jupiter", site: "jovianspace", lm: "freighter", fx: "battle", title: "The freighter", text: "In the stolen Gathering Storm, Bobbie and Alex take a Laconian freighter near Jupiter. The political officer aboard dies in the crossfire, and Bobbie finds antimatter in the hold."},
      {id: "b8l", book: 8, world: "laconia", site: "statebuilding", lm: "teresa", title: "Teresa", text: "Duarte begins to train his fourteen-year-old daughter Teresa as his heir. She slips out of the palace to visit a man in a mountain cave whom she calls Timothy."},
      {id: "b8c", book: 8, world: "tecoma", title: "The Tecoma experiment", text: "Laconia sends an antimatter weapon through the gates from Tecoma. The neutron star collapses, and the burst of gamma rays destroys two gates."},
      {id: "b8d", book: 8, world: "thanjavur", site: "thanjavur-colony", lm: "settlement", title: "Thanjavur cut off", text: "The burst through the slow zone destroys the gate to Thanjavur, stranding its colony."},
      {id: "b8e", book: 8, world: "ringstation", site: "slowzone", lm: "gates", title: "The ring space wiped clean", text: "The ring entities answer. Everyone everywhere blacks out; in the ring space, Medina Station and the battleship Typhoon are destroyed. Only the Falcon gets out."},
      {id: "b8f", book: 8, world: "laconia", site: "pens", lm: "lab", title: "The empty throne", text: "Duarte, changed by the protomolecule, is left senseless by the attack. His court hides it. Elvi is put to work on him and learns how the native repair creatures restore the dead."},
      {id: "b8g", book: 8, world: "laconia", site: "cave", lm: "cave", fx: "battle", title: "Timothy", text: "Teresa Duarte’s secret friend in the hills is Amos, sent to get Holden out. Laconian security kills him, and his body disappears."},
      {id: "b8h", book: 8, world: "auberon", site: "barradan", lm: "underground", title: "Naomi takes command", text: "Stranded when the gates close, Naomi reaches Auberon and takes over its Underground."},
      {id: "b8i", book: 8, world: "sun", side: "In the Sol system", title: "Bobbie’s last fight", text: "Bobbie and Alex go after the Tempest with stolen antimatter. Bobbie throws the bomb by hand from outside her damaged shuttle; the Tempest is destroyed, and so is she."},
      {id: "b8j", book: 8, world: "laconia", site: "orbit", lm: "strike", fx: "battle", title: "The siege of Laconia", text: "Naomi leads hundreds of ships through the Laconia gate. While they draw off the last flagship, a strike force destroys the orbital construction platforms, so Laconia can build no more."},
      {id: "b8n", book: 8, world: "laconia", site: "statebuilding", title: "Duarte wakes", text: "Duarte wakes and kills Cortázar. Teresa leaves with Holden using Amos’s beacon, Amos returns changed, and the Rocinante crew is together again."},
      /* IX · Leviathan Falls */
      {id: "b9a", book: 9, world: "laconia", site: "cave", lm: "trail", title: "The hunt for Duarte", text: "Duarte walks out of the State Building and vanishes in a small alien ship. Colonel Aliana Tanaka traces him through Amos’s old cave and sets out after Teresa."},
      {id: "b9b", book: 9, world: "newegypt", site: "school", lm: "fight", fx: "battle", title: "New Egypt", text: "Tanaka’s marines are waiting when the Rocinante brings Teresa to New Egypt. In the firefight Amos is shot, and keeps going."},
      {id: "b9c", book: 9, world: "freehold", site: "draper", lm: "cells", fx: "battle", title: "Draper Station", text: "At the Underground’s base a local leader tries to trade the crew to Laconia for peace. Tanaka storms the station, and the Gathering Storm is lost covering the Rocinante’s escape."},
      {id: "b9d", book: 9, world: "sanesteban", site: "sanesteban-colony", lm: "dead", title: "San Esteban dies", text: "The ring entities change the laws of physics in the San Esteban system and nearly every living thing there dies."},
      {id: "b9e", book: 9, world: "baragaon", site: "bg5", lm: "clinic", title: "Bara Gaon", text: "Tanaka follows the wrong ship to Bara Gaon and, on its fifth planet, gets help for her wounds and the memories that are not hers."},
      {id: "b9f", book: 9, world: "adro", site: "diamond", lm: "dive", title: "Diving the diamond", text: "At Adro, Elvi’s team and the crew send Cara and Amos into the diamond’s memory and learn how the builders lived and died."},
      {id: "b9g", book: 9, world: "solring", site: "ringmouth", lm: "gate", title: "The rings shine", text: "A colony ship crossing from Sol too soon after another should vanish, but something saves it. Every ring glows, minds touch, and the attacks stop."},
      {id: "b9n", book: 9, world: "ringstation", site: "core", lm: "surface", title: "Opening the station", text: "Duarte’s small ship is found on the Ring Station’s surface. Teresa, Tanaka and Amos come to open the station; Holden injects himself with live protomolecule to follow, and Miller appears once more."},
      {id: "b9o", book: 9, world: "ringstation", site: "slowzone", lm: "battle", fx: "battle", title: "Battle in the slow zone", text: "Laconian and Underground ships fight side by side to hold off the crews Duarte has taken over, while the struggle inside the station goes on."},
      {id: "b9h", book: 9, world: "ringstation", site: "core", lm: "throne", title: "The last battle", text: "Duarte has joined himself to the Ring Station, pulling minds into a single will to hold the dark gods back. In the station’s heart Tanaka kills him and dies; Holden, dying of the protomolecule he took to get in, takes Duarte’s place."},
      {id: "b9i", book: 9, world: "nieuwestad", site: "kithome", lm: "port", fx: "arrival", title: "Alex’s last flight", text: "The crew parts. Alex takes the Rocinante to Nieuwestad, where his son’s family lives."},
      {id: "b9j", book: 9, world: "ringstation", site: "core", lm: "sphere", fx: "blast", title: "The gates close", text: "Once the ring space is clear, Holden destroys the station. The gates die with it, and some thirteen hundred colonies are on their own."},
      {id: "b9k", book: 9, world: "dobridomov", site: "launch", lm: "ship", fx: "launch", title: "The Thirty Worlds", text: "About a thousand years later, a federation of colonies has built its own faster-than-light ship and sets out to find old Earth."},
      {id: "b9l", book: 9, world: "earth", title: "Earth, a thousand years on", text: "The explorers find Earth almost empty but still guarded, and Amos Burton there to meet them."}
    ],

    codex: [
      {id: "powers", title: "Powers", list: [
        {name: "The United Nations", first: 1, desc: "Earth’s planetary government, run from New York by a Secretary-General and a great bureaucracy, with the UN Navy in orbit.", more: [[5, "After the rocks fall it rebuilds on Luna, with Avasarala at its head."], [7, "It surrenders to Laconia."]]},
        {name: "The Martian Congressional Republic", first: 1, desc: "The government of Mars, with the finest navy in the system (the MCRN) and a long project to terraform its world.", more: [[5, "Part of its navy defects to Winston Duarte."], [7, "It surrenders to Laconia."]]},
        {name: "The Outer Planets Alliance", first: 1, desc: "The OPA: half union, half liberation movement, half terrorist network for the Belters, with many factions. Fred Johnson runs one wing from Tycho; Anderson Dawes another on Ceres.", more: [[5, "Its most radical wing, under Marco Inaros, becomes the Free Navy."]]},
        {name: "Protogen", first: 1, desc: "A security and biotech firm from Earth that found the protomolecule and tested it on the people of Eros."},
        {name: "Mao-Kwikowski Mercantile", first: 1, desc: "The Mao family’s shipping company, based on Luna.", more: [[2, "Jules-Pierre Mao keeps the protomolecule work going after Protogen falls, and sells hybrid soldiers to a rogue UN faction."]]},
        {name: "Star Helix Security", first: 1, desc: "The corporate police on Ceres, Miller’s employer."},
        {name: "Royal Charter Energy", first: 4, desc: "The corporation given the first UN charter to survey and exploit Ilus. Its security chief is Adolphus Murtry."},
        {name: "The Free Navy", first: 5, desc: "Marco Inaros’s fleet of stolen Martian warships, which declares Belter independence by dropping rocks on Earth.", more: [[6, "It fortifies Medina, then vanishes in the Ring."]]},
        {name: "The Transport Union", first: 6, desc: "Holden’s idea after the Free Navy war: a union of Belter shippers to run trade through the gates.", more: [[7, "Under Camina Drummer it governs the gates, until Laconia comes."]]},
        {name: "The Laconian Empire", first: 7, desc: "The rogue Martians of Laconia, built into an empire by High Consul Winston Duarte, with protomolecule-grown battleships of the Magnetar class such as the Heart of the Tempest.", more: [[8, "It calls the ring entities the dark gods, and loses its orbital shipyards."], [9, "Admiral Trejo makes peace with the Underground at the end."]]},
        {name: "The Underground", first: 8, desc: "The resistance to Laconia across the colonies, led in the end by Naomi Nagata."},
        {name: "The builders", first: 1, desc: "The makers of the protomolecule, long gone, whose weapon came to Phoebe.", more: [[3, "The Ring Station shows that they ruled across the galaxy and used the gates; something attacked them, and they burned whole systems trying to stop it."], [9, "They began as simple creatures in the ocean of a frozen world and became one mind across many stars."]]},
        {name: "The ring entities", first: 5, desc: "Something in the gates swallows ships that cross too close behind too much traffic.", more: [[6, "Naomi finds the rule: too much mass through the gates too fast."], [7, "When the Tempest fires its weapon, everyone in the system blacks out."], [8, "Struck at Tecoma, they wipe the ring space clean. Laconians call them the dark gods."], [9, "They change the laws of physics in San Esteban. They are what killed the builders."]]}
      ]},
      {id: "people", title: "People", list: [
        {name: "James Holden", role: "Captain of the Rocinante", books: [1, 2, 3, 4, 5, 6, 7, 8, 9], desc: "A dismissed UN Navy officer serving on an ice hauler, raised on a Montana farm, who cannot stop telling everyone the truth.", more: [[3, "He opens the gates."], [7, "He is taken to Laconia as a prisoner."], [9, "He gives himself to the Ring Station and closes the gates forever."]]},
        {name: "Naomi Nagata", role: "Engineer · executive officer", books: [1, 2, 3, 4, 5, 6, 7, 8, 9], desc: "A brilliant Belter engineer from the Canterbury.", more: [[5, "Her past comes back: her son Filip and his father, Marco Inaros."], [8, "She leads the Underground."]]},
        {name: "Amos Burton", role: "Mechanic", books: [1, 2, 3, 4, 5, 6, 7, 8, 9], desc: "A cheerful, frightening mechanic from Baltimore who lets others decide what is right.", more: [[8, "Killed on Laconia, he is brought back by the native repair creatures."], [9, "A thousand years later he is still on Earth."]]},
        {name: "Alex Kamal", role: "Pilot", books: [1, 2, 3, 4, 5, 6, 7, 8, 9], desc: "A former Martian Navy pilot from Mariner Valley.", more: [[9, "He takes the Rocinante to his son on Nieuwestad."]]},
        {name: "Joe Miller", role: "Ceres detective", books: [1, 2, 3, 4, 9], desc: "A burned-out Star Helix detective who falls for the missing girl he is hunting.", more: [[2, "After dying in Eros, he appears to Holden as a ghost made by the protomolecule."], [4, "That ghost, the protomolecule’s investigator, is ended on Ilus."], [9, "He returns once more to open the Ring Station."]]},
        {name: "Julie Mao", role: "Heiress · OPA volunteer", books: [1], desc: "The rebel daughter of the Mao family, aboard the Scopuli; her infected body steers Eros into Venus."},
        {name: "Fred Johnson", role: "OPA leader", books: [1, 2, 3, 4, 5, 6], desc: "A former UN Marine colonel, once called the Butcher of Anderson Station, who now leads the OPA from Tycho.", more: [[6, "He dies of a stroke on a hard burn."]]},
        {name: "Anderson Dawes", role: "OPA leader on Ceres", books: [1, 6], desc: "A rival OPA leader on Ceres.", more: [[6, "He sits in Marco Inaros’s inner circle."]]},
        {name: "Shed Garvey", role: "Medic", books: [1], desc: "The Canterbury’s medic, killed when the Donnager is boarded."},
        {name: "Antony Dresden", role: "Protogen scientist", books: [1], desc: "The man behind the Eros experiment, shot by Miller on Thoth."},
        {name: "Dimitri Havelock", role: "Security officer", books: [1, 4], desc: "Miller’s Earther partner on Ceres.", more: [[4, "He is the corporate deputy security chief on Ilus, and turns against Murtry."]]},
        {name: "Chrisjen Avasarala", role: "UN politician", books: [2, 3, 4, 5, 6, 7, 8], desc: "A foul-mouthed grandmother in a sari who plays UN politics better than anyone.", more: [[5, "She becomes acting Secretary-General."], [8, "She dies of old age as a guest of Laconia."]]},
        {name: "Bobbie Draper", role: "Martian marine", books: [2, 4, 5, 6, 7, 8], desc: "A huge Martian marine, the only survivor of her platoon on Ganymede.", more: [[6, "She commands the assault on Medina’s guns."], [7, "She captains the Rocinante, then seizes the Gathering Storm."], [8, "She dies destroying the Tempest."]]},
        {name: "Praxidike Meng", role: "Botanist", books: [2, 6], desc: "A gentle Ganymede botanist hunting for his daughter Mei."},
        {name: "Jules-Pierre Mao", role: "Tycoon", books: [1, 2, 3], desc: "Julie’s father, head of Mao-Kwikowski.", more: [[2, "He is behind the hybrids, and falls."]]},
        {name: "Sadavir Errinwright", role: "UN undersecretary", books: [2], desc: "Avasarala’s superior, secretly in league with Mao."},
        {name: "Admiral Nguyen", role: "UN admiral", books: [2], desc: "The admiral of the rogue faction; Holden kills him aboard his flagship."},
        {name: "Clarissa Mao", role: "Saboteur, later mechanic", books: [3, 5, 6, 7], desc: "Julie’s younger sister, who sets out to destroy Holden for ruining her father.", more: [[5, "Amos breaks her out of prison; she becomes his apprentice."], [7, "She dies on Medina, saving Naomi."]]},
        {name: "Anna Volovodov", role: "Pastor", books: [3], desc: "A Methodist pastor from Europa sent to the Ring, who becomes a peacemaker in the slow zone."},
        {name: "Carlos “Bull” de Baca", role: "Behemoth security chief", books: [3, 6], desc: "A tough, practical Earther in the OPA who holds the Behemoth together."},
        {name: "Klaes Ashford", role: "Captain of the Behemoth", books: [3], desc: "An OPA captain who would rather strike the Ring than wait."},
        {name: "Michio Pa", role: "Officer, later Union leader", books: [3, 5, 6], desc: "The Behemoth’s executive officer.", more: [[6, "She breaks from Marco and becomes the first head of the Transport Union."]]},
        {name: "Elvi Okoye", role: "Biologist", books: [4, 8, 9], desc: "A corporate scientist on Ilus who becomes the one who understands the alien world best.", more: [[8, "Taken into Laconian service, she explores the dead systems on the Falcon."], [9, "She leads the work at Adro."]]},
        {name: "Fayez Sarkis", role: "Geologist", books: [4, 8, 9], desc: "Elvi’s colleague on Ilus.", more: [[8, "By now he is her husband, and goes with her on the Falcon."]]},
        {name: "Basia Merton", role: "Ilus colonist", books: [2, 4], desc: "A Ganymede father whose son is taken in the second book.", more: [[4, "As a colonist on Ilus he sets off the bomb that starts the feud."]]},
        {name: "Adolphus Murtry", role: "RCE security chief", books: [4], desc: "A cold, capable killer who means to hold Ilus for the company."},
        {name: "Camina Drummer", role: "Tycho security, later Union president", books: [5, 6, 7, 8], desc: "Fred Johnson’s security chief on Tycho.", more: [[7, "As president of the Transport Union she surrenders to Laconia."]]},
        {name: "Marco Inaros", role: "Free Navy commander", books: [5, 6], desc: "Naomi’s charismatic, manipulative former lover.", more: [[6, "He and his fleet vanish in the Ring."]]},
        {name: "Filip Inaros", role: "Naomi’s son", books: [5, 6], desc: "Marco’s son, raised as a soldier.", more: [[6, "He leaves his father and takes his mother’s name."]]},
        {name: "Monica Stuart", role: "Journalist", books: [3, 5], desc: "A documentary maker who follows Holden to the Ring and later asks him about the missing ships."},
        {name: "Erich", role: "Baltimore fixer", books: [5], desc: "Amos’s childhood friend, now running crime in Baltimore."},
        {name: "Winston Duarte", role: "High Consul of Laconia", books: [5, 6, 7, 8, 9], desc: "A Martian admiral who arms the Free Navy, then takes his own fleet to Laconia.", more: [[7, "He rules an empire and has remade himself with the protomolecule."], [9, "He joins himself to the Ring Station and is killed there by Tanaka."]]},
        {name: "Santiago Singh", role: "Governor of Medina", books: [7], desc: "A young Laconian captain made governor of Medina, who turns harsh under pressure and is shot by his own security chief."},
        {name: "Saba", role: "Resistance leader", books: [7], desc: "Drummer’s husband, who leads the underground on Medina."},
        {name: "Paolo Cortázar", role: "Laconian chief scientist", books: [7, 8], desc: "The researcher behind Duarte’s use of the protomolecule.", more: [[8, "He plots against Teresa and is killed by Duarte."]]},
        {name: "Teresa Duarte", role: "Duarte’s daughter", books: [8, 9], desc: "The High Consul’s teenage heir, who slips out to the hills to visit a strange friend.", more: [[9, "She sails with the Rocinante."]]},
        {name: "Anton Trejo", role: "Laconian admiral", books: [8, 9], desc: "The admiral who holds the empire together when Duarte falls.", more: [[9, "He makes peace with the Underground."]]},
        {name: "Aliana Tanaka", role: "Laconian colonel", books: [9], desc: "A relentless officer sent to bring Duarte back; she kills him at the Ring Station and dies there."},
        {name: "Cara and Xan", role: "Children of Laconia", books: [8, 9], desc: "A girl and her little brother on Laconia, changed by the planet’s repair creatures (first met in the novella Strange Dogs).", more: [[9, "Cara dives into the Adro diamond."]]},
        {name: "Mei Meng", role: "Prax’s daughter", books: [2], desc: "A four-year-old with an immune disorder, led out of her Ganymede preschool by her own doctor. Her father finds her alive in the lab on Io."},
        {name: "Dr. Strickland", role: "Mei’s doctor", books: [2], desc: "The doctor who takes Mei and other sick children for the hybrid programme. Amos kills him on Io."},
        {name: "Admiral Souther", role: "UN admiral", books: [2], desc: "A UN admiral who works with Avasarala against Nguyen’s faction in the battle over Io."},
        {name: "Manéo Jung-Espinoza", role: "Belter daredevil", books: [3], desc: "A young Belter from Ceres who slingshots a patched-up ship through the Ring and is killed when it stops dead on the far side."},
        {name: "Sam Rosenberg", role: "Behemoth chief engineer", books: [3], desc: "The engineer who keeps the old Nauvoo flying and builds Bull an exoskeleton. Ashford shoots her when he finds she has sabotaged his weapon."},
        {name: "Tilly Fagan", role: "Socialite", books: [3], desc: "A wealthy member of the delegation to the Ring who helps Anna, reaches Clarissa in her cell, and in the end buys the Rocinante from Mars for Holden."},
        {name: "Hector Cortez", role: "Televangelist", books: [3], desc: "A preacher who joins Ashford in believing the Ring must be destroyed, then stops him with a taser at the last."},
        {name: "Lucia Merton", role: "Doctor on Ilus", books: [4], desc: "Basia’s wife, who leads the colonists’ medical care through the bombing, the storm and the blindness."},
        {name: "Chandra Wei", role: "RCE security officer", books: [4], desc: "One of Murtry’s officers, killed in the crossfire deep inside the alien structure."},
        {name: "Nathan Smith", role: "Martian prime minister", books: [5, 6], desc: "Saved from an ambush by Alex and Bobbie and carried to Luna in a racing yacht.", more: [[6, "He joins Avasarala and Fred Johnson in the war against the Free Navy."]]},
        {name: "Payne Houston", role: "Governor of Freehold", books: [7], desc: "The colony leader whose ship breaks the Transport Union’s rules; his own people hand him over rather than starve."},
        {name: "Overstreet", role: "Laconian security chief", books: [7], desc: "Singh’s second security chief on Medina, who kills him when he orders loyalists executed."},
        {name: "Jason Ilich", role: "Laconian colonel", books: [8], desc: "One of the inner circle who hides Duarte’s condition after the ring entities strike."},
        {name: "Jillian Houston", role: "Underground leader", books: [9], desc: "A resistance leader at Draper Station who locks up the Rocinante’s crew and accepts Laconia’s offer, then lets them go when Tanaka turns on her."}
      ]},
      {id: "ships", title: "Ships", list: [
        {name: "The Canterbury", first: 1, desc: "An old ice hauler working Saturn’s rings for Ceres, destroyed in the first chapters while Holden and four crewmates are away on its shuttle."},
        {name: "The Donnager", first: 1, desc: "The flagship of the Martian navy, boarded and destroyed soon after it picks up Holden’s crew."},
        {name: "The Rocinante", first: 1, desc: "A Martian corvette, first named the Tachi, in which Holden’s crew escapes the Donnager. Holden renames it after Don Quixote’s horse.", more: [[3, "Mars sues to get it back; Tilly Fagan settles the matter by buying it."], [7, "Bobbie captains it when Holden retires."], [9, "Alex takes it to Nieuwestad at the end."]]},
        {name: "The Nauvoo", first: 1, desc: "The biggest ship ever built, a generation ship for Mormon colonists under construction at Tycho. The OPA uses it to try to push Eros into the Sun.", more: [[3, "Refitted as the OPA warship Behemoth, it becomes Medina Station."]]},
        {name: "The Guanshiyin", first: 2, desc: "Jules-Pierre Mao’s private yacht, on which Avasarala is sent out of the way until Bobbie takes it."},
        {name: "The Seung Un", first: 3, desc: "An Earth destroyer at the Ring, destroyed by Clarissa Mao’s bomb in an attack framed on Holden."},
        {name: "The Edward Israel", first: 4, desc: "Royal Charter Energy’s survey ship over Ilus, home of Murtry’s security team."},
        {name: "The Barbapiccola", first: 4, desc: "The refugees’ ore ship over Ilus, which falls and burns up after its crew is saved."},
        {name: "The Razorback", first: 5, desc: "A small, fast racing ship in which Alex and Bobbie find the hidden Martian fleet and carry the Martian prime minister to safety."},
        {name: "The Pella", first: 5, desc: "Marco Inaros’s flagship, where Naomi is held prisoner."},
        {name: "The Chetzemoka", first: 5, desc: "A small transport Naomi buys for her son’s crew, later rigged as a bomb to lure the Rocinante."},
        {name: "The Azure Dragon", first: 6, desc: "The Free Navy ship that guides the rocks at Earth, taken by the Rocinante."},
        {name: "Heart of the Tempest", first: 7, desc: "The first Laconian Magnetar-class battleship, with a self-healing hull and a magnetic weapon; it takes Medina and breaks the fleets of Sol.", more: [[8, "Bobbie destroys it with a bomb thrown by hand."]]},
        {name: "The Gathering Storm", first: 7, desc: "A Laconian gunship berthed at Medina, seized by Bobbie’s team in the breakout.", more: [[8, "Bobbie and Alex raid Laconian shipping in it."], [9, "It is lost covering the Rocinante’s escape from Freehold."]]},
        {name: "The Falcon", first: 8, desc: "Elvi Okoye’s Laconian science ship, sent to explore the dead systems."},
        {name: "The Typhoon", first: 8, desc: "A Laconian battleship destroyed when the ring entities sweep the ring space."}
      ]},
      {id: "ideas", title: "Ideas & technology", list: [
        {name: "The Epstein drive", first: 1, desc: "A fusion drive efficient enough to burn for days, which opened the solar system. Crews take drugs and sit in crash couches to survive hard burns."},
        {name: "Belters", first: 1, desc: "People born in the Belt and the outer moons: tall and thin from low gravity, speaking their own creole, and doing the system’s dangerous work."},
        {name: "The protomolecule", first: 1, desc: "An alien replicator that hijacks living things to rebuild them as something else. It arrived in Phoebe, aimed at an Earth with no life yet complex enough to use.", more: [[2, "Mao uses it to make hybrid soldiers."], [3, "Its purpose was to build a gate."]]},
        {name: "The Eros incident", first: 1, desc: "Protogen’s release of the protomolecule on Eros, which kills the station’s people and turns the asteroid into something alive."},
        {name: "The ring space", first: 3, desc: "The starless sphere behind the Ring, with 1,373 gates on its rim and the Ring Station at the centre. Nothing moving faster than 600 m/s is allowed in it."},
        {name: "The gates", first: 3, desc: "Each gate opens on another star system the builders used. The books never say where those systems are in the galaxy.", more: [[4, "Many worlds still hold builder machines."], [6, "Ships vanish when too much mass crosses too fast."], [9, "When the Ring Station dies, every gate goes dark."]]},
        {name: "The dead systems", first: 8, desc: "Systems with gates but no habitable world, such as Adro and Tecoma, explored by Laconian science ships."},
        {name: "Rock drops", first: 5, desc: "Asteroids hidden under stealth coating and thrown at Earth by the Free Navy."},
        {name: "Magnetar-class battleships", first: 7, desc: "Laconian warships grown with builder technology, armed with a magnetic weapon that tears matter apart."},
        {name: "The repair creatures", first: 8, desc: "Native life on Laconia that can rebuild the dead, with something missing; the novella Strange Dogs begins their story."},
        {name: "Duarte’s hive mind", first: 9, desc: "Duarte’s plan to link all humans into one mind to stand against the dark gods, as the builders once were."},
        {name: "The Thirty Worlds", first: 9, desc: "A federation of former colonies that, a thousand years after the gates close, builds its own faster-than-light ship."},
        {name: "Novellas", first: 1, desc: "Shorter stories fill gaps between the novels; this atlas follows the nine novels only.",
         more: [[1, "Drive (Solomon Epstein and his drive), The Butcher of Anderson Station (Fred Johnson’s past) and The Churn (Amos’s early life in Baltimore) look back before the first book."],
                [2, "Gods of Risk is set on Mars between the second and third books."],
                [5, "The Vital Abyss follows Protogen’s imprisoned scientists."],
                [6, "Strange Dogs is set on Laconia between the sixth and seventh books."],
                [7, "Auberon falls between the seventh and eighth books."],
                [9, "The Sins of Our Fathers follows Filip after the gates close. All are collected in Memory’s Legion."]]}
      ]}
    ],

    galaxy: {
      sol: SOL,
      home: {at: {sol: [0, 1.5, 0]}, dist: 34, pitch: .62, dur: 2200},
      flyDist: 12,
      labelFar: {major: 360, minor: 120},
      labels: [
        {text: "The Sol system", at: {sol: [0, 0, 0]}, off: [0, -1.2, 7.5], min: 14, max: 260, big: true},
        {text: "The Belt", at: {sol: [2.2, 0, -1.6]}, off: [0, .5, 0], min: 4, max: 40},
        /* engine owner: book-gated labels (engine feature added after this pack was written) */
        {text: "Ring space", at: {world: "ringstation"}, off: [0, 1.2, 0], min: 3, max: 120, book: 3},
        {text: "The gate systems", at: {sol: [0, 0, 0]}, off: [0, 1.8, 11.5], min: 14, max: 260, book: 4}
      ],
      /* engine owner: keep the decorative field stars out of the enlarged Sol orrery (radius ~7 units) */
      localField: {clear: 7.5},
      coreLabels: true,
      link: {base: .4, gain: 1.2, curveMax: 1.6},
      links: [
        /* the gate network: every gate system (and Sol's Ring) to the hub */
        /* (one link per gate system is appended below, gated to the book in which that system is first met;
           a single engine `network` link would draw lines to systems the reader has not reached yet) */
        {id: "solgate", path: ["solring", "ringstation"], color: "#a898ff", book: 3, opacity: {all: .35, cur: .6, past: .35}, speed: .3, dash: 1.2, curve: .05},
        /* the crew's road, one colour per book */
        {id: "r1", path: ["saturn", "tycho", "eros", "tycho", "thoth", "tycho", "eros", "venus"], book: 1, label: "Simplified route"},
        {id: "r1m", path: ["ceres", "eros"], book: 1},
        {id: "r2", path: ["tycho", "ganymede", "tycho", "io", "luna"], book: 2},
        {id: "r2b", path: ["ganymede", "earth", "jupiter", "io"], book: 2},
        {id: "r3", path: ["ceres", "solring", "ringstation", "medina", "luna"], book: 3},
        {id: "r4", path: ["medina", "ilus", "tycho"], book: 4},
        {id: "r5", path: ["tycho", "ceres"], book: 5},
        {id: "r5b", path: ["tycho", "earth", "luna"], book: 5},
        {id: "r5c", path: ["tycho", "mars", "hungaria", "luna"], book: 5},
        {id: "r6", path: ["luna", "ceres", "tycho", "solring", "medina"], book: 6},
        {id: "r7", path: ["freehold", "medina", "freehold"], book: 7},
        {id: "r7h", path: ["medina", "laconia"], book: 7},
        {id: "r8", path: ["callisto", "auberon", "freehold", "laconia"], book: 8},
        {id: "r8e", path: ["laconia", "adro", "tecoma", "ringstation", "laconia"], book: 8},
        {id: "r9", path: ["laconia", "newegypt", "freehold", "adro", "ringstation"], book: 9},
        {id: "r9b", path: ["ringstation", "nieuwestad"], book: 9},
        /* red strike lines: the great attacks, gated to the book in which they happen */
        {id: "s1", pairs: [["thoth", "eros"], ["eros", "venus"]], color: "#ff4a36", book: 1, opacity: {all: .4, cur: .9, past: .35}, speed: .8, dash: 3, curve: .08},
        {id: "s2", pairs: [["io", "ganymede"], ["io", "mars"]], color: "#ff4a36", book: 2, opacity: {all: .4, cur: .9, past: .35}, speed: .8, dash: 3, curve: .08},
        {id: "s5", pairs: [[{sol: [1.6, .4, -2.2]}, "earth"], [{sol: [1.6, .4, -2.2]}, "callisto"], [{sol: [1.6, .4, -2.2]}, "tycho"], ["solring", "medina"]], color: "#ff4a36", book: 5, opacity: {all: .4, cur: .9, past: .35}, speed: .8, dash: 3, curve: .08},
        {id: "s6", pairs: [[{sol: [1.6, .4, -2.2]}, "earth"], ["solring", "medina"]], color: "#ff4a36", book: 6, opacity: {all: .4, cur: .9, past: .35}, speed: .8, dash: 3, curve: .08},
        {id: "s7", pairs: [["laconia", "medina"], ["solring", "leuctra"], ["leuctra", "pallas"], ["pallas", "earth"], ["earth", "mars"]], color: "#ff4a36", book: 7, opacity: {all: .4, cur: .9, past: .35}, speed: .8, dash: 3, curve: .06},
        {id: "s8", pairs: [["laconia", "tecoma"], ["tecoma", "thanjavur"], [{xyz: [0, 12, 271.4]}, "ringstation"], ["auberon", "laconia"], ["freehold", "laconia"]], color: "#ff4a36", book: 8, opacity: {all: .4, cur: .9, past: .35}, speed: .8, dash: 3, curve: .08},
        {id: "s9", pairs: [[{xyz: [0, 12, 271.4]}, "sanesteban"], ["laconia", "newegypt"], ["laconia", "freehold"]], color: "#ff4a36", book: 9, opacity: {all: .4, cur: .9, past: .35}, speed: .8, dash: 3, curve: .08}
      ]
    },

    legend: [
      {bookColors: true, label: "The Rocinante’s road", allLabel: "The Rocinante’s road, by book"},
      {color: "#ff4a36", label: "Great attacks"},
      {color: "#a898ff", label: "Ring gates", book: 3}
    ]
  };

  /* gate lines: hub to each gate system, appearing with the book in which the reader first meets it */
  PACK.worlds.forEach(function (w) {
    if (!w.gate) return;
    PACK.galaxy.links.unshift({id: "gate-" + w.id, pairs: [["ringstation", w.id]], color: "#a898ff", book: w.first,
      opacity: {all: .3, cur: .45, past: .3}, speed: .25, dash: 1, curve: .04});
  });

  (window.ATLAS_PACKS = window.ATLAS_PACKS || {})["expanse"] = PACK;
})();

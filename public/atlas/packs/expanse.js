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
         {id: "erosfall", name: "Where Eros came down", lat: -8, lon: 40, books: [1, 2], desc: "The crash site of Eros Station (position estimated; the books give none). From here the protomolecule spreads out under the clouds and begins to build."}
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
         {id: "newyork", name: "New York", lat: 40.7, lon: -74.0, books: [2, 5], desc: "The UN capital, home of the Secretariat. Avasarala works here in the second book, and Amos is picked up on arrival here in the fifth."},
         {id: "baltimore", name: "Baltimore", lat: 39.3, lon: -76.6, books: [5], desc: "Where Amos grew up on the streets. He comes back for the funeral of the woman who raised him and meets his old friend Erich."},
         {id: "philly", name: "Philadelphia", lat: 39.95, lon: -75.2, books: [5], desc: "Amos visits the widower of the woman who raised him."},
         {id: "winnipesaukee", name: "Lake Winnipesaukee", lat: 43.6, lon: -71.35, books: [5], desc: "A rich enclave with a private launch pad. After the rocks fall, Amos, Clarissa and Erich get a shuttle off the ground here and make for Luna."},
         {id: "montana", name: "Montana", lat: 46.6, lon: -111.0, books: [1], desc: "Holden grew up on a family farm co-op in Montana with several parents (the exact place is not given; marker estimated)."},
         {id: "impact", name: "North African strike", lat: 21, lon: 12, books: [5], desc: "The first of the Free Navy’s rocks comes down over Africa. Other impacts devastate regions of North America, West Africa and South Asia (exact sites are not given; marker estimated)."},
         {id: "abuja", name: "Abuja", lat: 9.06, lon: 7.5, books: [6], desc: "The Nigerian capital, where Anna Volovodov’s wife Namono lives through the aftermath of the rocks at the start of the sixth book."}
       ]},

      {id: "luna", name: "Luna", aka: ["The Moon"], group: "inner", books: [1, 2, 3, 4, 5, 6, 7], first: 1, status: "Earth’s moon",
       star: {name: "Sol", col: "#fff2d8"}, map: P.luna,
       distText: "Earth’s moon · " + SCHEM,
       blurb: "Earth’s heavily settled moon and the home of the wealthy Mao family.",
       short: "Earth’s moon; the Maos’ home and later the seat of government.",
       facts: [["Notable residents", "Jules-Pierre Mao and family"]],
       eras: {2: {blurb: "Earth’s heavily settled moon and the home of the wealthy Mao family. The guilty of the great scandals are brought here to face trial."},
              5: {status: "Seat of the surviving governments", blurb: "After the rocks fall on Earth, the survivors of the UN and the Martian government gather on Luna, and Avasarala, now acting Secretary-General, runs the war against the Free Navy from here."}},
       gfx: {type: "barren", sea: 0, pal: ["#2a2a2a", "#3a3a3a", "#6a6a68", "#8a8a86", "#a8a8a2", "#d8d8d2"], rough: .7, bump: 1.4, clouds: 0, atmoK: 0, lights: .55, sw: "#8a8a86"}},

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
         {id: "mariner", name: "Mariner Valley", lat: -10, lon: -70, books: [1, 5], desc: "A great settlement built along the canyon walls of Valles Marineris, its neighbourhoods linked by tubes across the canyon, with shipyards nearby. Alex Kamal’s home."},
         {id: "olympus", name: "Olympus Mons", lat: 18.6, lon: -133.8, desc: "The great volcano, with settlements and a Martian navy base on its flanks."},
         {id: "hecates", name: "Hecates Tholus", lat: 32.1, lon: 150.2, desc: "A volcano with a training base for Martian marine special forces."},
         {id: "londres", name: "Londres Nova", lat: 4, lon: -60, desc: "One of Mars’s major cities (its position on the planet is not given; marker estimated)."}
       ]},

      {id: "eros", name: "Eros", aka: ["Eros Station"], group: "inner", books: [1, 2, 9], first: 1, status: "Belt station · near-Earth asteroid",
       star: {name: "Sol", col: "#fff2d8"}, map: P.eros, major: true, hero: "hotel",
       distText: "A near-Earth asteroid, about 1.5 AU from the Sun · " + SCHEM,
       blurb: "A potato-shaped asteroid hollowed into a station of about a million and a half people, a centre of shipbuilding and gambling. In the first book the security firm Protogen herds its people into shelters and turns the protomolecule loose on them as an experiment. Then the whole asteroid begins to move.",
       short: "The station that became the protomolecule’s body.",
       facts: [["People", "About 1.5 million before the incident"], ["Fate", "Crashed into Venus at the end of the first book"]],
       gfx: {type: "barren", sea: 0, pal: ["#2a2420", "#3a322a", "#5a4a3c", "#6e5c4a", "#7e6c5a", "#a8988a"], rough: .9, bump: 1.8, freq: 2.2, clouds: 0, atmoK: 0, lights: .7, lightCol: "#9fd8ff", sw: "#6e5c4a"},
       sites: [
         {id: "hotel", name: "The hotel room", lat: 10, lon: 20, books: [1], desc: "Inside the station (marker position schematic): where Miller and Holden find Julie Mao’s body, overgrown by something that is not human."},
         {id: "shelters", name: "Radiation shelters", lat: -6, lon: 34, books: [1], desc: "Inside the station (marker position schematic): a fake radiation alarm herds the people of Eros here, where they are infected."},
         {id: "docks", name: "Eros docks", lat: 2, lon: -30, books: [1], desc: "Inside the station (marker position schematic): Holden’s crew and Miller fight their way out of the dying station."}
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
         {id: "helix", name: "Star Helix station house", lat: 12, lon: 10, books: [1], desc: "Inside the rock (marker position schematic): the precinct where Miller is handed the Julie Mao case as a side job, and later fired."},
         {id: "cdocks", name: "Ceres docks", lat: -8, lon: 40, books: [1, 3, 5, 6], desc: "Inside the rock (marker position schematic): the ports where the Rocinante lies impounded in the third book and Naomi slips away to meet Marco’s people in the fifth."}
       ]},

      {id: "tycho", name: "Tycho Station", group: "belt", books: [1, 2, 3, 5, 6, 7], first: 1, major: true, craft: true,
       status: "OPA headquarters · shipyard", star: {name: "Sol", col: "#fff2d8"}, map: P.tycho,
       distText: "A station in the Belt · " + SCHEM,
       blurb: "A great construction station in the Belt: a manufacturing sphere ringed by spinning habitat rings, able to build the biggest ships in the system. It belongs to Tycho Manufacturing, and it is also the quiet headquarters of Fred Johnson’s wing of the OPA. The generation ship Nauvoo is being built here when the story begins.",
       short: "Fred Johnson’s station.",
       facts: [["Owner", "Tycho Manufacturing and Engineering Concern"], ["Leader", "Fred Johnson"], ["Built", "The Nauvoo, later the Behemoth"]],
       eras: {5: {status: "Attacked", blurb: "In the fifth book the Free Navy strikes Tycho while the Rocinante is in for refit, and in the confusion the last sample of the protomolecule is stolen from Fred Johnson’s safe."},
              7: {status: "Withdrawn from Pallas", blurb: "Tycho withdraws from the Pallas–Tycho complex before the Tempest destroys Pallas."}},
       gfx: {type: "city", sea: 0, pal: ["#1a1e24", "#2a3038", "#4a525c", "#5e6670", "#7a828c", "#c8d0d8"], rough: .3, clouds: 0, atmoK: 0, lights: 1, lightCol: "#ffcc88", sw: "#7a828c"}},

      {id: "thoth", name: "Thoth Station", group: "belt", books: [1], first: 1, craft: true, status: "Secret Protogen base",
       star: {name: "Sol", col: "#fff2d8"}, map: P.thoth,
       distText: "Hidden in the Belt · " + SCHEM,
       blurb: "A hidden Protogen research station in the Belt, receiving the data from the Eros experiment. Holden’s crew, Miller and OPA volunteers storm it, and Miller shoots the lead scientist, Antony Dresden, rather than let anyone bargain with him.",
       short: "Protogen’s secret lab.",
       gfx: {type: "barren", sea: 0, pal: ["#1e1e22", "#2a2a30", "#44444c", "#56565e", "#6a6a72", "#a8a8b0"], rough: .8, clouds: 0, atmoK: 0, lights: .6, lightCol: "#c8f0ff", sw: "#56565e"}},

      {id: "hungaria", name: "Hungaria asteroids", group: "belt", books: [5], first: 5, status: "Inner-edge asteroid group",
       star: {name: "Sol", col: "#fff2d8"}, map: P.hungaria,
       distText: "Inner edge of the Belt, about 1.9 AU from the Sun · " + SCHEM,
       blurb: "A swarm of small asteroids on the inner edge of the Belt. In the fifth book Holden traces a missing ship here, and Alex and Bobbie find a hidden fleet of stolen Martian warships, then fight their way clear.",
       short: "Where the stolen Martian fleet hides.",
       gfx: {type: "barren", sea: 0, pal: ["#2a2622", "#3a342e", "#56504a", "#68625a", "#7a746c", "#b0aaa0"], rough: .9, bump: 1.8, clouds: 0, atmoK: 0, sw: "#68625a"}},

      {id: "pallas", name: "Pallas", aka: ["Pallas-Tycho"], group: "belt", books: [7], first: 7, status: "Belt station",
       star: {name: "Sol", col: "#fff2d8"}, map: P.pallas,
       distText: "About 2.8 AU from the Sun · " + SCHEM,
       blurb: "A large asteroid station with refineries. By the seventh book Tycho Station has been moved and joined to it. After Tycho’s section withdraws, the Tempest destroys Pallas Station.",
       short: "Destroyed by the Tempest.",
       gfx: {type: "barren", sea: 0, pal: ["#26241e", "#36322a", "#524c42", "#645e52", "#767064", "#b4ae9e"], rough: .7, bump: 1.4, clouds: 0, atmoK: 0, lights: .5, sw: "#645e52"}},

      {id: "leuctra", name: "Point Leuctra", group: "belt", books: [7], first: 7, status: "Battle site · schematic marker",
       star: {name: "Sol", col: "#fff2d8"}, map: P.leuctra, est: true,
       distText: "In the asteroid belt; marker position schematic · " + SCHEM,
       blurb: "At Point Leuctra in the asteroid belt, the combined fleet fails to stop the Tempest.",
       short: "Where the combined fleet fails to stop the Tempest.",
       gfx: {type: "barren", sea: 0, pal: ["#26241e", "#36322a", "#524c42", "#645e52", "#767064", "#b4ae9e"], rough: .7, clouds: 0, atmoK: 0}},

      /* ============================ JUPITER ============================ */
      {id: "jupiter", name: "Jupiter", group: "jovian", books: [2, 7, 8], first: 2, status: "Gas giant",
       star: {name: "Sol", col: "#fff2d8"}, map: P.jupiter, view: 4.8,
       distText: "About 5.2 AU from the Sun · " + SCHEM,
       blurb: "The great gas giant, whose moons hold much of the outer system’s population and food. The second book is fought over its moons.",
       short: "The Jovian system.",
       eras: {7: {blurb: "The great gas giant and its crowded moons."},
              8: {blurb: "The great gas giant and its crowded moons. Under Laconian rule the resistance fights on here, and the Tempest is sent to the Jovian system to hunt the stolen gunship Gathering Storm."}},
       gfx: {type: "gas", pal: ["#6a4a30", "#a8805a", "#e0c8a0", "#f2e6d0", "#c09a70", "#b86a48"], bands: 16, atmo: "#e8d8c0", atmoK: .7, sw: "#c09a70"},
       moons: [{name: "Io", size: .07, dist: 2.2, gfx: {type: "desert", sea: 0, pal: ["#000", "#000", "#c8b040", "#e0d070", "#a87030", "#f0e8b0"], atmoK: 0}},
               {name: "Europa", size: .06, dist: 2.9, gfx: {type: "ice", sea: 0, pal: ["#7a6a5a", "#8a7a6a", "#b8a890", "#d8ccb8", "#e8e0d0", "#ffffff"], atmoK: 0}},
               {name: "Ganymede", size: .1, dist: 3.8}, {name: "Callisto", size: .09, dist: 5.0}]},

      {id: "io", name: "Io", group: "jovian", books: [2], first: 2, status: "Jovian moon",
       star: {name: "Sol", col: "#fff2d8"}, map: P.io, hero: "iolab",
       distText: "Innermost of Jupiter’s large moons · " + SCHEM,
       blurb: "Jupiter’s volcanic inner moon. In the second book it hides the lab where Mao-Kwikowski and Protogen’s heirs breed protomolecule hybrid soldiers from sick children. The war ends in a battle over it.",
       short: "Where the hybrids were made.",
       gfx: {type: "desert", sea: 0, dune: 3, pal: ["#000", "#000", "#c8b040", "#e0d070", "#a87030", "#f0e8b0"], rough: .5, clouds: 0, atmoK: 0, sw: "#d8c050",
             feat: [{k: "biome", style: "flame", at: [10, 40], r: 4, s: .9, c: "#2a1a10"}, {k: "biome", style: "flame", at: [-20, -60], r: 5, s: .9, c: "#3a1a0a"},
                    {k: "biome", style: "rock", at: [30, 120], r: 6, s: .8, c: "#c06030"}, {k: "biome", style: "flame", at: [-5, 150], r: 3, s: .9, c: "#201008"}]},
       sites: [
         {id: "iolab", name: "The hybrid lab", lat: 8, lon: 30, books: [2], desc: "A hidden base (position estimated) where Mei and other immune-deficient children are held. Amos and Prax get her out while Holden and the fleets fight overhead."}
       ]},

      {id: "europa", name: "Europa", group: "jovian", books: [3, 9], first: 3, status: "Jovian moon",
       star: {name: "Sol", col: "#fff2d8"}, map: P.europa,
       distText: "Second of Jupiter’s large moons · " + SCHEM,
       blurb: "Jupiter’s ice-shelled ocean moon, home of the Methodist pastor Anna Volovodov, who joins the UN delegation to the Ring in the third book.",
       short: "Anna’s home.",
       eras: {9: {blurb: "Jupiter’s ice-shelled ocean moon, home of Anna Volovodov. In the last book the record at Adro shows that the builders of the protomolecule began as simple creatures in the ocean of a frozen world much like this one."}},
       gfx: {type: "ice", sea: 0, pal: ["#7a6a5a", "#8a7a6a", "#b8a890", "#d8ccb8", "#e8e0d0", "#ffffff"], rough: .25, clouds: 0, atmoK: 0, lights: .3, sw: "#d8ccb8"}},

      {id: "ganymede", name: "Ganymede", group: "jovian", books: [2, 3, 4, 6], first: 2, major: true, status: "Breadbasket of the outer planets",
       star: {name: "Sol", col: "#fff2d8"}, map: P.ganymede, hero: "domes",
       distText: "Largest moon of Jupiter · " + SCHEM,
       blurb: "The largest moon in the system and the food basket of the outer planets, its crops grown under domes and mirrors, shared uneasily by Earth and Mars. The second book opens here with an attack that kills two units of marines, and a war that wrecks the moon.",
       short: "The outer system’s farm, and where the second book begins.",
       eras: {3: {blurb: "After the battle of the second book, Ganymede’s food output has fallen to a fraction of what it was, and the outer system goes hungry. Refugees leave for wherever they can."}},
       gfx: {type: "ice", sea: 0, pal: ["#3a3530", "#4a443c", "#6a6258", "#7e766a", "#9a9286", "#d8d2c8"], rough: .5, bump: 1.2, clouds: 0, atmoK: 0, lights: .7, lightCol: "#c8ffb0", sw: "#7e766a"},
       sites: [
         {id: "domes", name: "Agricultural domes", lat: 15, lon: 10, books: [2], desc: "The farms under domes and mirrors (marker position estimated). Prax Meng is a botanist here, and his work is lost when a mirror comes down in the fighting."},
         {id: "lab", name: "The hidden lab", lat: 6, lon: 24, books: [2], desc: "A disused tunnel complex (position estimated) where Mei’s doctor takes her. Holden, Amos and Prax find it, and one of the monsters inside."},
         {id: "outpost", name: "The marine outposts", lat: 28, lon: -20, books: [2], desc: "Where a single creature in no armour kills Bobbie Draper’s Martian platoon and the UN marines facing them (position estimated)."}
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
         {id: "yards", name: "The shipyards", lat: 20, lon: 40, books: [5], desc: "Twin shipyards (position estimated), struck in the opening raid of the fifth book."}
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
               {name: "Phoebe", size: .05, dist: 5.2}]},

      {id: "phoebe", name: "Phoebe", group: "outer", books: [1], first: 1, status: "Captured moon of Saturn",
       star: {name: "Sol", col: "#fff2d8"}, map: P.phoebe,
       distText: "Outer moon of Saturn · " + SCHEM,
       blurb: "A small dark moon on a backwards orbit around Saturn. It is not a moon at all but a weapon, launched at Earth billions of years ago by an alien intelligence to rewrite the young planet’s life, and caught by Saturn instead. Protogen found the protomolecule inside it.",
       short: "Where the protomolecule came from.",
       facts: [["Cargo", "The protomolecule"], ["Launched", "Billions of years ago, aimed at Earth"]],
       gfx: {type: "barren", sea: 0, pal: ["#121010", "#1a1816", "#2a2622", "#36302a", "#443c34", "#7a7068"], rough: .9, bump: 1.8, clouds: 0, atmoK: 0, sw: "#36302a"}},

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
       ring: {inner: 1.6, outer: 2.2, c1: "#4a4a5a", c2: "#1a1a24", tilt: .9, seed: 7}},

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
         {id: "core", name: "The heart of the station", lat: 0, lon: 0, books: [3, 9], desc: "Holden goes in alone with Miller’s ghost in the third book and touches the station’s memory. In the last book Duarte sits here, joined to the station."}
       ]},

      {id: "medina", name: "Medina Station", aka: ["Nauvoo", "Behemoth"], group: "ringspace", books: [3, 4, 5, 6, 7, 8], first: 3, major: true, craft: true,
       status: "Waystation of the ring space", star: {name: "No star: the ring space is dark", col: "#dcd8ec"}, pos3: [0.7, 6.45, 271.8],
       distText: "Inside the ring space, outside normal space · shown above Sol",
       blurb: "Built at Tycho as the Nauvoo, a generation ship for Mormon colonists, then refitted by the OPA as the warship Behemoth and sent to the Ring. After the disaster in the slow zone it becomes a refuge, and at the end of the third book it is left there as Medina Station, a waystation for ships bound for the gates.",
       short: "The old Nauvoo, parked in the ring space.",
       facts: [["Built", "At Tycho, as the Nauvoo"], ["Later", "OPA warship Behemoth, then Medina Station"]],
       eras: {5: {status: "Seized by the Free Navy", blurb: "The waystation of the ring space. In the fifth book the Free Navy seizes it and cuts the colonies off."},
              6: {status: "Retaken", blurb: "The waystation of the ring space. The Free Navy fortifies it with railguns; in the sixth book a combined assault breaks the guns, and Medina surrenders to the Rocinante. The Transport Union is born here."},
              7: {status: "Occupied by Laconia", blurb: "Thirty years on, Medina is the heart of the Transport Union, until the Laconian battleship Heart of the Tempest takes it. Captain Santiago Singh governs it, ever more harshly, until a resistance led by Saba breaks out."},
              8: {status: "Destroyed", blurb: "In the eighth book the ring entities sweep the ring space and Medina Station is destroyed with everyone aboard."}},
       gfx: {type: "city", sea: 0, pal: ["#16181e", "#22262e", "#3e444e", "#4e5560", "#646c78", "#b4bcc8"], rough: .3, clouds: 0, atmoK: 0, lights: 1, lightCol: "#ffc890", sw: "#4e5560"},
       sites: [
         {id: "drum", name: "The drum", lat: 0, lon: 0, books: [3, 7], desc: "The spinning habitat section, turned to give gravity in the slow zone. Most of the ship’s life, and most of its fighting, happens here (marker position schematic)."}
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
         {id: "landing", name: "First Landing", lat: 8, lon: -40, books: [4], desc: "The refugee town, just north of the great south-western desert, where the lithium is closest to the surface. The colonists bomb the corporate landing pad here, and the feud begins (all Ilus positions estimated)."},
         {id: "ruins", name: "The alien ruins", lat: 10, lon: -36, books: [4], desc: "Builder ruins near the town, where survivors shelter from the storm and the poisonous slugs, and where Holden and Miller ride an alien car into the planet’s machinery."},
         {id: "island", name: "The largest island", lat: -5, lon: 125, books: [4], sea: true, desc: "One of the alien reactors in the archipelago melts down here, throwing up a tsunami and storm winds that flatten First Landing."},
         {id: "deadspot", name: "The dead spot", lat: 30, lon: -5, books: [4], desc: "A gap in the planet’s network, a sphere of something that kills alien machines. Elvi carries the network’s controller into it and shuts down the defences."}
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
         {id: "statebuilding", name: "The State Building", lat: 22, lon: 38, books: [7, 8, 9], desc: "The Duarte family’s seat in the capital. Holden lives here as a prisoner-guest, and Avasarala’s funeral reception is held here (all Laconia positions estimated)."},
         {id: "pens", name: "The Pens", lat: 20, lon: 41, books: [8], desc: "Cortázar’s research facility, where Elvi meets the children Cara and Xan, brought back from death by the planet’s native repair creatures."},
         {id: "cave", name: "The cave in the hills", lat: 26, lon: 33, books: [8, 9], desc: "Where Teresa Duarte secretly visits a man she calls Timothy, who is really Amos Burton. He is killed in a firefight here, and the native repair creatures bring him back."}
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
         {id: "township", name: "Freehold township", lat: 30, lon: 10, books: [7], desc: "The colony’s only town, in a semi-arid temperate zone, run by its Assembly and a citizen militia (position estimated)."}
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
         {id: "barradan", name: "Barradan", lat: 18, lon: 22, books: [7, 8], desc: "The capital, with the governor’s office and a great agricultural company (spelled Barradon in some places; position estimated)."},
         {id: "carlisle", name: "Carlisle", lat: 8, lon: 40, books: [7], desc: "Another of Auberon’s cities (position estimated)."}
       ]},

      {id: "newegypt", name: "New Egypt", group: "gates", gate: true, books: [6, 9], first: 6, status: "Colony world",
       star: {name: "New Egypt’s sun", col: "#ffeccc"}, map: G.newegypt, est: true,
       distText: GATEPOS,
       blurb: "A colony settled by Royal Charter Energy in the years after the gates open.",
       short: "A corporate colony.",
       eras: {9: {blurb: "A colony settled by Royal Charter Energy. In the last book the Rocinante brings Teresa Duarte here to a boarding school run by a relative, and Tanaka’s marines are waiting."}},
       gfx: {type: "desert", sea: .3, dune: 7, pal: ["#0a2a3a", "#2a6a7a", "#b08a58", "#c8a46e", "#9a7a58", "#f0e8d8"], clouds: .25, atmo: "#a8c8ff", atmoK: .9, lights: .3, sw: "#c8a46e"}},

      {id: "baragaon", name: "Bara Gaon", aka: ["Bara Gaon 5"], group: "gates", gate: true, books: [9], first: 9, status: "Colony system",
       star: {name: "Bara Gaon", col: "#fff0d8"}, map: G.baragaon, est: true,
       distText: GATEPOS,
       blurb: "A colony system with an orbital complex around its fifth planet. In the last book Tanaka follows the wrong ship here, and on Bara Gaon 5 she has her wounds treated and seeks help for the strange shared memories in her head.",
       short: "Where Tanaka loses the trail.",
       gfx: {type: "terran", sea: .55, pal: ["#0c1e30", "#2c5a78", "#4a5e3a", "#6a7a4a", "#7a6e58", "#eeeeea"], clouds: .5, atmo: "#90b0ff", atmoK: 1, lights: .5, sw: "#4a5e3a"}},

      {id: "sanesteban", name: "San Esteban", group: "gates", gate: true, books: [6, 9], first: 6, status: "Colony system",
       star: {name: "San Esteban’s sun", col: "#ffe8c8"}, map: G.sanesteban, est: true,
       distText: GATEPOS,
       blurb: "A colony destination. In the sixth book the colony ship Minsky, bound here, is seized by Michio Pa’s breakaway fleet.",
       short: "A colony destination.",
       eras: {9: {status: "Dead system", blurb: "In the last book the ring entities strike San Esteban: the speed of light itself shifts, chemical bonds fail, and nearly every living thing in the system dies. The news terrifies every colony."}},
       gfx: {type: "terran", sea: .5, pal: ["#0a1a2c", "#2a5476", "#4e5a3a", "#6e7448", "#76684e", "#ecece8"], clouds: .4, atmo: "#8aaaf0", atmoK: .9, lights: .2, sw: "#4e5a3a"}},

      {id: "nieuwestad", name: "Nieuwestad", group: "gates", gate: true, books: [9], first: 9, status: "Colony system",
       star: {name: "Nieuwestad’s sun", col: "#fff4e0"}, map: G.nieuwestad, est: true,
       distText: GATEPOS,
       blurb: "The colony where Alex Kamal’s son Kit takes his family. At the end of the series Alex flies the Rocinante here to be with them.",
       short: "Alex’s last port.",
       gfx: {type: "terran", sea: .55, freq: 1.7, pal: ["#0a1e34", "#2a6086", "#3a6234", "#68844a", "#72705a", "#f2f2ee"], clouds: .45, atmo: "#8ab0ff", atmoK: 1, lights: .3, sw: "#3a6234"}},

      {id: "adro", name: "Adro", aka: ["The Adro Diamond"], group: "gates", gate: true, books: [8, 9], first: 8, major: true, status: "Dead system · builder record",
       star: {name: "A faint white dwarf", col: "#e8f0ff"}, map: G.adro, est: true,
       distText: GATEPOS,
       blurb: "A dead system: a faint white dwarf with no planets, only its gate and a huge, faintly green crystal the size of Jupiter. Elvi Okoye’s Laconian science mission finds that it answers to the protomolecule, and suspects it is a record left by the builders.",
       short: "The giant green diamond.",
       facts: [["Star", "White dwarf"], ["Object", "A crystal about the size of Jupiter"]],
       eras: {9: {status: "The builders’ library", blurb: "In the last book Elvi’s team uses the protomolecule-changed girl Cara to dive into the diamond’s memory. It shows the builders’ history, from creatures in a frozen ocean to a single mind across the galaxy, and how they died."}},
       gfx: {type: "ice", sea: 0, pal: ["#0a3a2a", "#1a5a40", "#3a8a6a", "#5aa888", "#8ad0b0", "#d8fff0"], rough: .15, bump: .6, clouds: 0, atmo: "#7affc8", atmoK: .6, lights: 0, amb: .06, sw: "#5aa888"}},

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
       gfx: {type: "terran", sea: .5, pal: ["#0a1c30", "#2a5a7e", "#4a5a36", "#6a7646", "#746a52", "#eeeeea"], clouds: .45, atmo: "#8aaeff", atmoK: 1, lights: .25, sw: "#4a5a36"}},

      {id: "dobridomov", name: "Dobridomov", group: "gates", gate: true, books: [9], first: 9, status: "One of the Thirty Worlds",
       star: {name: "Dobridomov’s sun", col: "#fff2e0"}, map: G.dobridomov, est: true,
       distText: GATEPOS,
       blurb: "A colony that, about a thousand years after the gates fall, belongs to the Thirty Worlds, a federation with its own faster-than-light ship. The mission that finds Amos on Earth in the epilogue sets out from here.",
       short: "Where the epilogue’s mission begins.",
       gfx: {type: "terran", sea: .5, freq: 1.5, pal: ["#0a1e34", "#2a6086", "#3e6236", "#6a844c", "#74705a", "#f2f2ee"], clouds: .42, atmo: "#8ab0ff", atmoK: 1, lights: .9, sw: "#3e6236"}}
    ],

    events: [
      /* I · Leviathan Wakes */
      {id: "b1a", book: 1, world: "saturn", title: "The Canterbury", text: "The ice hauler Canterbury, out of Saturn’s rings for Ceres, answers a distress call from a derelict ship, the Scopuli. Its executive officer Jim Holden takes four crew to look. While they are away a stealth ship destroys the Canterbury, and Holden broadcasts that Martian technology was involved."},
      {id: "b1b", book: 1, world: "ceres", site: "helix", title: "A side job for Miller", text: "On Ceres, the tired detective Joe Miller is quietly told to find Julie Mao, the runaway daughter of a rich Lunar family, and send her home. Riots follow Holden’s broadcast."},
      {id: "b1c", book: 1, world: "tycho", title: "The Rocinante reaches Tycho", text: "After escaping the destruction of the Donnager, Holden’s crew reaches Fred Johnson’s station."},
      {id: "b1d", book: 1, world: "ceres", title: "Miller fired", text: "Miller learns Julie had joined the OPA and was aboard the Scopuli. Warned off, he keeps digging, loses his badge, and buys passage to Eros."},
      {id: "b1e", book: 1, world: "eros", site: "hotel", title: "Julie", text: "Miller meets Holden’s crew on Eros. They find Julie dead in a hotel room, covered in a strange growth, and her records point to the ship that brought the infection."},
      {id: "b1f", book: 1, world: "eros", site: "shelters", title: "The Eros incident", text: "A false radiation alarm herds the people of Eros into shelters, where Protogen seeds them with the protomolecule. Miller and the crew barely get out."},
      {id: "b1g", book: 1, world: "phoebe", title: "What came from Phoebe", text: "A recording from Protogen reveals the truth: the protomolecule came from Phoebe, a weapon sent long ago to remake life on Earth. Eros is an experiment, and the Canterbury was destroyed to start a war that would keep everyone looking away."},
      {id: "b1h", book: 1, world: "thoth", title: "Thoth Station", text: "The crew, Miller and the OPA storm Protogen’s hidden station. Its chief scientist, Dresden, talks of making humanity into gods; Miller shoots him dead."},
      {id: "b1i", book: 1, world: "eros", title: "Eros moves", text: "The OPA tries to drive Eros into the Sun with the Nauvoo. The asteroid dodges, then turns toward Earth faster than any ship can follow."},
      {id: "b1j", book: 1, world: "venus", site: "erosfall", title: "Into Venus", text: "Miller rides a bomb into Eros and finds what is left of Julie steering it. He talks her round, and Eros comes down on Venus instead of Earth."},
      /* II · Caliban's War */
      {id: "b2a", book: 2, world: "ganymede", site: "outpost", title: "The monster on Ganymede", text: "A creature wearing no armour wipes out Bobbie Draper’s Martian marine platoon and the UN troops facing them. Earth and Mars start shooting, and Ganymede comes apart."},
      {id: "b2b", book: 2, world: "ganymede", site: "lab", title: "Prax’s search", text: "The botanist Prax Meng’s little daughter Mei has been taken from her school by her own doctor. Holden, Amos and Prax trace her to a hidden lab, and the thing kept inside it."},
      {id: "b2c", book: 2, world: "earth", site: "newyork", title: "Avasarala", text: "Bobbie is brought to Earth for peace talks and breaks ranks. Chrisjen Avasarala, a sharp-tongued UN official, takes her on and starts pulling at a conspiracy inside her own government."},
      {id: "b2d", book: 2, world: "tycho", title: "Stowaway", text: "A hybrid hidden in the Rocinante’s hold is killed with the ship’s own drive. At Tycho, Holden accuses Fred Johnson and the crew is cut loose from the OPA."},
      {id: "b2e", book: 2, world: "jupiter", title: "Escape from the Guanshiyin", text: "Sent out on Jules-Pierre Mao’s yacht as a way of sidelining her, Avasarala learns a fleet is coming to kill Holden. Bobbie takes the yacht by force and they get to the Rocinante."},
      {id: "b2f", book: 2, world: "io", site: "iolab", title: "The battle over Io", text: "The hybrids are made on Io, sold by Mao to a rogue UN faction. Holden boards the flagship of Admiral Nguyen to stop hybrid-loaded rockets bound for Mars, while Amos and Prax rescue Mei."},
      {id: "b2g", book: 2, world: "luna", title: "Reckoning", text: "Errinwright and Mao are brought down. Avasarala is promoted, Prax is given Ganymede to rebuild, and Bobbie goes home."},
      {id: "b2h", book: 2, world: "venus", title: "Venus rises", text: "The structure on Venus finishes and launches itself out of the system. Aboard the Rocinante, Holden sees Miller again: a ghost made by the protomolecule."},
      /* III · Abaddon's Gate */
      {id: "b3a", book: 3, world: "solring", title: "The Ring", text: "The construction from Venus stops beyond the orbit of Uranus and becomes a ring a thousand kilometres across. A young Belter racer dives through it and is lost, and the navies gather."},
      {id: "b3b", book: 3, world: "europa", title: "Anna", text: "Anna Volovodov, a Methodist pastor from Europa, joins a UN delegation of artists and clergy sent to witness the Ring."},
      {id: "b3c", book: 3, world: "ceres", site: "cdocks", title: "The Rocinante impounded", text: "Mars sues for the return of its stolen corvette. Holden agrees to a documentary to pay the lawyers, and a film crew comes aboard."},
      {id: "b3d", book: 3, world: "solring", title: "Framed", text: "Clarissa Mao, posing as a technician, hijacks the Rocinante through planted software and blames Holden for a bombing. With the fleets firing on him, Holden flies into the Ring, and the others follow."},
      {id: "b3e", book: 3, world: "ringstation", site: "core", title: "The station", text: "Inside is the slow zone. Holden reaches the station with Miller’s ghost and sees what happened to the builders: an empire across the galaxy, attacked by something, burning whole star systems to stop it."},
      {id: "b3f", book: 3, world: "medina", site: "drum", title: "The deceleration", text: "The station lowers its speed limit at a stroke and every ship in the slow zone is slammed to a crawl. Many die. The OPA’s Behemoth becomes a hospital and a refuge."},
      {id: "b3g", book: 3, world: "medina", title: "Ashford’s gamble", text: "The Behemoth’s captain, Ashford, plans to attack the Ring, and Holden fears the station will answer by destroying the Sun. Holden, Bull and Anna stop him, with help from Clarissa."},
      {id: "b3h", book: 3, world: "ringstation", title: "The gates open", text: "The ships power down, the station judges them harmless, and the speed limit lifts. More than thirteen hundred gates open onto other star systems."},
      {id: "b3i", book: 3, world: "medina", title: "Medina Station", text: "The Behemoth is left in the ring space as Medina Station, a waystation for ships heading for the new worlds."},
      /* IV · Cibola Burn */
      {id: "b4a", book: 4, world: "ilus", site: "landing", title: "First Landing", text: "Refugees from Ganymede slip through a gate and found a mining town on Ilus. When a corporate survey ship arrives with a UN charter, they blow up its landing pad as a shuttle comes down."},
      {id: "b4b", book: 4, world: "medina", title: "A mediator", text: "Fred Johnson and Avasarala send Holden through the gates to keep the peace on Ilus."},
      {id: "b4c", book: 4, world: "ilus", site: "landing", title: "Murtry", text: "The corporate security chief Adolphus Murtry shoots a colonist in front of the town. Holden’s mediation fails as killings mount on both sides."},
      {id: "b4d", book: 4, world: "ilus", site: "island", title: "The planet wakes", text: "An alien reactor melts down on the largest island. A storm of water and wind flattens the town; the survivors shelter in the ruins, and the planet’s old defences start shooting down anything with power."},
      {id: "b4e", book: 4, world: "ilus", title: "Falling orbits", text: "With their reactors dead, the ships in orbit start to fall. The Rocinante and the corporate ship’s crew rescue the refugees aboard the Barbapiccola before it burns up."},
      {id: "b4f", book: 4, world: "ilus", site: "deadspot", title: "The dead spot", text: "Guided by Miller, the biologist Elvi Okoye carries the network’s controller into a sphere of something that kills alien machines, and the defences fall silent. Murtry is taken for trial."},
      /* V · Nemesis Games */
      {id: "b5a", book: 5, world: "callisto", site: "yards", title: "The Callisto raid", text: "A radical Belter cell, led by a teenager named Filip, steals stealth coating from the Callisto shipyards and wrecks them."},
      {id: "b5b", book: 5, world: "tycho", title: "Shore leave", text: "With the Rocinante under repair at Tycho, the crew scatters. Holden takes up a journalist’s question: who is stealing colony ships?"},
      {id: "b5c", book: 5, world: "earth", site: "baltimore", title: "Amos goes home", text: "Amos returns to Baltimore for the funeral of the woman who raised him, then visits Clarissa Mao in prison."},
      {id: "b5d", book: 5, world: "mars", site: "mariner", title: "Alex and Bobbie", text: "Alex goes home to Mars and teams up with Bobbie, who is chasing missing Martian warships. Someone tries to kill them both."},
      {id: "b5e", book: 5, world: "ceres", site: "cdocks", title: "Naomi’s past", text: "Naomi answers a call from her past on Ceres: her son Filip, and his father, Marco Inaros. Marco takes her prisoner."},
      {id: "b5f", book: 5, world: "earth", site: "impact", title: "The rocks fall", text: "Marco’s Free Navy drops stealth-coated asteroids on Earth. The strikes and what follows kill vast numbers and break the planet."},
      {id: "b5g", book: 5, world: "tycho", title: "Tycho attacked", text: "In the same coordinated strike the Free Navy hits Tycho and steals the last sample of the protomolecule."},
      {id: "b5h", book: 5, world: "medina", title: "Medina seized", text: "Free Navy ships seize Medina Station and close the gates."},
      {id: "b5i", book: 5, world: "hungaria", title: "The stolen fleet", text: "Alex and Bobbie find the hidden fleet of stolen Martian warships, then save the Martian prime minister from an ambush and carry him to Luna in Bobbie’s racing yacht."},
      {id: "b5j", book: 5, world: "earth", site: "winnipesaukee", title: "Off the ground", text: "Amos breaks Clarissa out of prison. With his old friend Erich they make their way through the wreckage and fly to Luna from a rich enclave’s launch pad."},
      {id: "b5k", book: 5, world: "luna", title: "Survivors", text: "Naomi slips Marco’s trap and is picked up by Alex and Bobbie. The crew comes together on Luna, where Avasarala is now acting Secretary-General."},
      {id: "b5l", book: 5, world: "laconia", title: "The Laconia gate", text: "The Martian admiral Winston Duarte, who armed the Free Navy, takes the best stolen warships through the Laconia gate. The next ship to cross is lost: something in the gates eats ships."},
      /* VI · Babylon's Ashes */
      {id: "b6a", book: 6, world: "earth", site: "abuja", title: "Earth after the rocks", text: "In Abuja, Anna Volovodov’s wife Namono lives through the aftermath as more rocks keep coming."},
      {id: "b6b", book: 6, world: "luna", title: "The Azure Dragon", text: "Under Bobbie’s command, the Rocinante takes the Free Navy ship that has been guiding the rocks at Earth."},
      {id: "b6c", book: 6, world: "ceres", title: "Ceres abandoned", text: "Marco strips Ceres and pulls out, leaving millions for his enemies to feed."},
      {id: "b6d", book: 6, world: "sanesteban", title: "Michio Pa breaks away", text: "Michio Pa, sickened by Marco’s methods, turns her ships to piracy for the Belt, seizing the colony ship Minsky on its way to San Esteban, and pays for it."},
      {id: "b6e", book: 6, world: "tycho", title: "Fred Johnson’s last flight", text: "On a hard burn to an OPA meeting at Tycho, under attack from Marco’s ships, Fred Johnson has a stroke and dies."},
      {id: "b6f", book: 6, world: "callisto", title: "Filip Nagata", text: "Filip breaks with his father and stays behind on Callisto under his mother’s name."},
      {id: "b6g", book: 6, world: "medina", title: "Retaking Medina", text: "A combined fleet of Earth, Mars and the loyal Belt strikes for Medina. Bobbie and Amos destroy the reactor powering its railguns, and the station surrenders to the Rocinante."},
      {id: "b6h", book: 6, world: "solring", title: "Marco vanishes", text: "Naomi has worked out the rule of the vanishing ships. Mass sent through the Ring just ahead of Marco’s fleet makes the whole fleet disappear in the crossing."},
      {id: "b6i", book: 6, world: "medina", title: "The Transport Union", text: "Holden proposes a union of Belter shippers to run the gates. He turns down its leadership, and Michio Pa takes it."},
      {id: "b6j", book: 6, world: "laconia", title: "Silence from Laconia", text: "Earth blockades the Laconia gate. Duarte makes no move."},
      /* VII · Persepolis Rising */
      {id: "b7a", book: 7, world: "freehold", site: "township", title: "Freehold", text: "Some thirty years on, with Camina Drummer president of the Transport Union, the Rocinante is sent to make Freehold give up the governor who broke the Union’s rules."},
      {id: "b7b", book: 7, world: "laconia", title: "Laconia’s fleet", text: "On Laconia, Duarte’s people have used the builders’ orbital platforms and the protomolecule to build warships beyond anything in human space."},
      {id: "b7c", book: 7, world: "medina", title: "The Tempest comes", text: "The battleship Heart of the Tempest comes through the Laconia gate, tears apart the slow zone’s defences and takes Medina. Captain Santiago Singh becomes governor."},
      {id: "b7d", book: 7, world: "medina", site: "drum", title: "The heist", text: "Holden and Naomi, about to retire, join Saba’s resistance. They steal Laconian codes; Holden keeps the alarms going and is caught."},
      {id: "b7e", book: 7, world: "leuctra", title: "The fleets broken", text: "At Point Leuctra in the asteroid belt, the combined fleet fails to stop the Tempest."},
      {id: "b7f", book: 7, world: "pallas", title: "Pallas destroyed", text: "After Tycho’s section withdraws, the Tempest destroys Pallas Station."},
      {id: "b7g", book: 7, world: "earth", title: "Surrender", text: "After a last stand in the Belt, Drummer surrenders the Union, and Earth and Mars follow."},
      {id: "b7h", book: 7, world: "medina", title: "The breakout", text: "Saba frees the prisoners; Bobbie and Amos take the gunship Gathering Storm while ships flee through the gates. Clarissa dies after saving Naomi, and Singh is shot by his own security chief."},
      {id: "b7i", book: 7, world: "freehold", title: "Hiding on Freehold", text: "The Rocinante escapes the ring space and hides on Freehold."},
      {id: "b7j", book: 7, world: "auberon", site: "barradan", title: "A Laconian governor", text: "Auberon is one of the first colonies to accept the new order, and Duarte sends it a governor."},
      {id: "b7k", book: 7, world: "laconia", site: "statebuilding", title: "Duarte", text: "Holden arrives on Laconia as a prisoner and meets High Consul Duarte, who means to use the protomolecule to rule humanity and live forever."},
      /* VIII · Tiamat's Wrath */
      {id: "b8a", book: 8, world: "laconia", site: "statebuilding", title: "Avasarala’s funeral", text: "Chrisjen Avasarala dies of old age and is given a state funeral on Laconia. Holden, still a captive, pays his respects."},
      {id: "b8b", book: 8, world: "adro", title: "The diamond", text: "Elvi Okoye’s Laconian science ship Falcon explores the dead systems and finds a vast green crystal that reacts to the protomolecule."},
      {id: "b8c", book: 8, world: "tecoma", title: "The Tecoma experiment", text: "Laconia sends an antimatter weapon through the gates from Tecoma. The neutron star collapses, and the burst of gamma rays destroys two gates."},
      {id: "b8d", book: 8, world: "thanjavur", title: "Thanjavur cut off", text: "The burst through the slow zone destroys the gate to Thanjavur, stranding its colony."},
      {id: "b8e", book: 8, world: "ringstation", title: "The ring space wiped clean", text: "The ring entities answer. Everyone everywhere blacks out; in the ring space, Medina Station and the battleship Typhoon are destroyed. Only the Falcon gets out."},
      {id: "b8f", book: 8, world: "laconia", site: "pens", title: "The empty throne", text: "Duarte, changed by the protomolecule, is left senseless by the attack. His court hides it. Elvi is put to work on him and learns how the native repair creatures restore the dead."},
      {id: "b8g", book: 8, world: "laconia", site: "cave", title: "Timothy", text: "Teresa Duarte’s secret friend in the hills is Amos, sent to get Holden out. Laconian security kills him, and his body disappears."},
      {id: "b8h", book: 8, world: "auberon", site: "barradan", title: "Naomi takes command", text: "Stranded when the gates close, Naomi reaches Auberon and takes over its Underground."},
      {id: "b8i", book: 8, world: "sun", side: "In the Sol system", title: "Bobbie’s last fight", text: "Bobbie and Alex go after the Tempest with stolen antimatter. Bobbie throws the bomb by hand from outside her damaged shuttle; the Tempest is destroyed, and so is she."},
      {id: "b8j", book: 8, world: "laconia", title: "The siege of Laconia", text: "Naomi leads hundreds of ships through the gate and destroys the orbital construction platforms. Duarte wakes and kills Cortázar. Teresa leaves with Holden, Amos returns changed, and the Rocinante crew is together again."},
      /* IX · Leviathan Falls */
      {id: "b9a", book: 9, world: "laconia", site: "cave", title: "The hunt for Duarte", text: "Duarte walks out of the State Building and vanishes in a small alien ship. Colonel Aliana Tanaka traces him through Amos’s old cave and sets out after Teresa."},
      {id: "b9b", book: 9, world: "newegypt", title: "New Egypt", text: "Tanaka’s marines are waiting when the Rocinante brings Teresa to New Egypt. In the firefight Amos is shot, and keeps going."},
      {id: "b9c", book: 9, world: "freehold", title: "Draper Station", text: "At the Underground’s base a local leader tries to trade the crew to Laconia for peace. Tanaka storms the station, and the Gathering Storm is lost covering the Rocinante’s escape."},
      {id: "b9d", book: 9, world: "sanesteban", title: "San Esteban dies", text: "The ring entities change the laws of physics in the San Esteban system and nearly every living thing there dies."},
      {id: "b9e", book: 9, world: "baragaon", title: "Bara Gaon", text: "Tanaka follows the wrong ship to Bara Gaon and, on its fifth planet, gets help for her wounds and the memories that are not hers."},
      {id: "b9f", book: 9, world: "adro", title: "Diving the diamond", text: "At Adro, Elvi’s team and the crew send Cara and Amos into the diamond’s memory and learn how the builders lived and died."},
      {id: "b9g", book: 9, world: "solring", title: "The rings shine", text: "A colony ship crossing from Sol too soon after another should vanish, but something saves it. Every ring glows, minds touch, and the attacks stop."},
      {id: "b9h", book: 9, world: "ringstation", site: "core", title: "The last battle", text: "Duarte has joined himself to the Ring Station, pulling minds into a single will to hold the dark gods back. In the station’s heart Tanaka kills him and dies; Holden, dying of the protomolecule he took to get in, takes Duarte’s place."},
      {id: "b9i", book: 9, world: "nieuwestad", title: "Alex’s last flight", text: "The crew parts. Alex takes the Rocinante to Nieuwestad, where his son’s family lives."},
      {id: "b9j", book: 9, world: "ringstation", title: "The gates close", text: "Once the ring space is clear, Holden destroys the station. The gates die with it, and some thirteen hundred colonies are on their own."},
      {id: "b9k", book: 9, world: "dobridomov", title: "The Thirty Worlds", text: "About a thousand years later, a federation of colonies has built its own faster-than-light ship and sets out to find old Earth."},
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
        {name: "Cara and Xan", role: "Children of Laconia", books: [8, 9], desc: "A girl and her little brother on Laconia, changed by the planet’s repair creatures (first met in the novella Strange Dogs).", more: [[9, "Cara dives into the Adro diamond."]]}
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

/* =====================================================================================================
   THE DUNE ATLAS: data pack for the shared galactic atlas engine (schema: atlas/PACK_FORMAT.md v1).
   Scope: Frank Herbert's six novels only (Dune 1965, Dune Messiah 1969, Children of Dune 1976,
   God Emperor of Dune 1981, Heretics of Dune 1984, Chapterhouse: Dune 1985). Later prequels and
   sequels by other authors are not used, except for one clearly labelled codex note.

   Sources (full notes in packs/dune/RESEARCH.md):
   [S1] Dune (1965), appendix "Terminology of the Imperium" (glossary): stars and planet numbers.
   [S2] Dune (1965), map of the north polar region of Arrakis and its Cartographic Notes
        (as transcribed at duneworld.org/books/map.html).
   [S3] "Atlas of the Imperium: Arrakis", atlasoficeandfireblog.wordpress.com (2019), a reading of
        the map (Arrakeen-Carthag 200 km, Shield Wall, Broken Land, Observatory Mount).
   [S4] Wikipedia plot articles: Arrakis, God Emperor of Dune, Heretics of Dune, Chapterhouse: Dune.
   [S5] dune.fandom.com: Bela Tegeuse, Wallach IX, Ix, Kaitain, Conquest of Naraj.
   [S6] Stellar Australis, "Project: Dune Stars": fan identifications of the glossary's star names
        with real stars (citing the Dune Encyclopedia and Joseph Daniels' fan Dune Gazetteer, 1999).
   [S7] Real star positions: J2000 catalogue RA/Dec and distances (SIMBAD / Wikipedia values).

   Placement: worlds with a real star use star:{ra,dec,ly} (degrees, J2000), so the engine puts them in
   the true direction from Sol on its compressed local-space radius (PACK_FORMAT 2.4). Only Canopus,
   Delta Pavonis, 36 Ophiuchi B, Alpha Centauri B, 70 Ophiuchi A and Sigma Draconis come straight
   from Frank Herbert's glossary. Stars that are fan identifications of the glossary's Chinese or
   invented star names are flagged est:true. Worlds with no star in the books are placed by eye with
   dir+ly and est:true (estimated). Surfaces are generated interpretations; Arrakis sites follow the
   book's polar map (longitude 0 through Observatory Mountain, per the Cartographic Notes) but exact
   positions are hand-laid estimates.
   All descriptions are paraphrased; no quotations from the novels.
   ===================================================================================================== */
(window.ATLAS_PACKS = window.ATLAS_PACKS || {})["dune"] = (function () {

/* far-off point used as the origin of the Honored Matres and the end of the Scattering arrows:
   a direction out of the disc at a large compressed radius. Purely symbolic (estimated). */
const SCATTER = {lb: [118, 14], ly: 60000};
const SCATTER2 = {lb: [250, -20], ly: 60000};
const SCATTER3 = {lb: [20, 35], ly: 60000};
const BEYOND = {lb: [160, 40], ly: 90000};

return {
  id: "dune",
  meta: {
    title: "The Dune Atlas",
    series: "Dune",
    author: "Frank Herbert",
    years: "1965–1985",
    tagline: "The desert planet, the spice and the <b>worm</b>",
    splash: "One desert world holds the only spice in the universe, and whoever rules the sand rules the stars.",
    credits: "Fan-made atlas of Frank Herbert’s six <i>Dune</i> novels. Placements marked estimated are ours.",
    srcnote: "A fan-made atlas. Star positions follow the novel’s glossary where it names a real star; other placements are estimates. Surfaces are generated interpretations.",
    canvasLabel: "A 3D map of the stars and worlds of Frank Herbert’s Dune novels",
    sources: [
      "Frank Herbert, Dune (1965), appendix Terminology of the Imperium and the map of Arrakis with its Cartographic Notes",
      "Frank Herbert, Dune Messiah, Children of Dune, God Emperor of Dune, Heretics of Dune, Chapterhouse: Dune",
      "duneworld.org/books/map.html (Cartographic Notes)",
      "atlasoficeandfireblog.wordpress.com/2019/04/01/atlas-of-the-imperium-arrakis/",
      "en.wikipedia.org: Arrakis; God Emperor of Dune; Heretics of Dune; Chapterhouse: Dune",
      "dune.fandom.com: Bela Tegeuse, Wallach IX, Ix, Kaitain, Conquest of Naraj",
      "stellaraustralis.com/project-dune-stars/ (fan star identifications)",
      "SIMBAD / Wikipedia catalogue positions of real stars"
    ]
  },

  theme: {
    void: "#070504", deep: "#140d07", panel: "rgba(20,13,8,.86)",
    accent: "#c98a3c", accentHi: "#f0c47e", accentLo: "#6a4218",
    chrome: "#f1e4cc", ember: "#d24a2a", amber: "#e8a948",
    text: "#eadfcc", muted: "#ab9a7e", faint: "#705f48",
    line: "rgba(240,196,126,.16)", lineStrong: "rgba(240,196,126,.46)",
    chromeGrad: "linear-gradient(180deg,#fff3dc 0%,#f0c47e 45%,#a8662a 70%,#f6d9a4 100%)",
    chromeStops: [[0, "#fff3dc"], [.45, "#f0c47e"], [.68, "#a8662a"], [1, "#f6d9a4"]],
    panelRgb: "26,17,10", panelRgb2: "10,7,4", insetRgb: "255,226,180", btnRgb: "20,13,8",
    ink: "#120b05", glowRgb: "236,150,60", hiRgb: "210,140,60", swRgb: "240,196,126", pipRgb: "240,190,120",
    shadeRgb: "10,7,4", tip1: "#22160c", tip2: "#0b0805", voidRgb: "7,5,4", codexRgb: "5,3,2",
    splashGlow: "#2a170a", selRing: "#f0c47e", hoverRing: "#efe2cc",
    /* sigil: a sandworm's ringed mouth under two moons (original drawing) */
    sigil: '<g fill="none" stroke="url(#cg)" stroke-linecap="round"><circle cx="24" cy="24" r="17" stroke-width="1.4"/><circle cx="24" cy="24" r="11.5" stroke-width="1"/><circle cx="24" cy="24" r="6" stroke-width="1"/><path d="M24 7v4.5M24 36.5V41M7 24h4.5M36.5 24H41M12 12l3.2 3.2M32.8 32.8L36 36M12 36l3.2-3.2M32.8 15.2L36 12" stroke-width="1"/></g><circle cx="38.5" cy="8.5" r="2.6" fill="url(#cg)"/><circle cx="43" cy="14" r="1.5" fill="url(#cg)"/>'
  },

  books: {
    1: {n: "I", title: "Dune", y: 1965, c: "#e6a24a"},
    2: {n: "II", title: "Dune Messiah", y: 1969, c: "#7fa8e0"},
    3: {n: "III", title: "Children of Dune", y: 1976, c: "#5fb39a"},
    4: {n: "IV", title: "God Emperor of Dune", y: 1981, c: "#c8608c", ink: "#fff"},
    5: {n: "V", title: "Heretics of Dune", y: 1984, c: "#a08ce6"},
    6: {n: "VI", title: "Chapterhouse: Dune", y: 1985, c: "#e0703e", ink: "#fff"}
  },
  spoilers: {mode: "cumulative"},

  ui: {
    wrapBooks: true,   /* six books plus nav buttons overflow the phone bar otherwise */
    indexTitle: "Worlds of the Imperium",
    homeButton: "Imperium",
    homeAction: "Fly to the Imperium",
    homeCrumb: "The Imperium",
    go: {id: "arrakis", label: "Go to Arrakis"},
    allTitle: "All six novels, with spoilers",
    chronTitle: "THE CHRONICLE",
    hints: {
      galaxy: "Drag to turn · scroll to zoom · click a world to visit it",
      galaxyMob: "Drag to turn · pinch to zoom · tap a world",
      world: "Drag to turn the globe · scroll to zoom · click a named place",
      worldMob: "Drag to turn · pinch to zoom · tap a place"
    }
  },

  intro: {
    text: "Some twenty thousand years from now, after a holy war against thinking machines, an emperor of House Corrino balances the great houses of the Landsraad, the Spacing Guild and the Bene Gesserit sisterhood. All of it runs on melange, the spice found only on the desert world Arrakis. Frank Herbert’s six novels begin when House Atreides is sent to rule Arrakis and follow its fortunes across thousands of years. The book buttons hide everything you have not yet read.",
    legend: [
      ["Bright points", "Worlds, coloured by their star. Most stars named in the novel’s glossary are real stars near the Sun"],
      ["Distances", "Shown on a compressed scale around the Sun so that Alpha Centauri (4 light-years) and Canopus (310) both read clearly"],
      ["Coloured lines", "The main journeys of each book, in that book’s colour"],
      ["Red lines", "Hostile campaigns, as far as the selected book"],
      ["Estimated", "Worlds whose star the books never give are placed by us and marked estimated"]
    ]
  },

  groups: [
    {id: "dune", name: "Arrakis and the Great Houses", chip: {border: "rgba(240,196,126,.55)", color: "#f0c47e"}},
    {id: "imperial", name: "The Imperial and Sisterhood worlds", chip: {border: "rgba(200,150,230,.55)", color: "#d7b8f0"}},
    {id: "machine", name: "Ix, Tleilax and the makers", chip: {border: "rgba(140,200,220,.55)", color: "#a8dcec"}},
    {id: "landsraad", name: "Worlds of the Landsraad", chip: {border: "rgba(200,180,140,.5)", color: "#d8c49a"}},
    {id: "later", name: "The far future: after the Scattering", chip: {border: "rgba(224,112,62,.6)", color: "#f0a07a"}},
    {id: "ancient", name: "Ancient and legendary", chip: {border: "rgba(170,170,170,.5)", color: "#c8c8c8"}}
  ],

  worlds: [
/* ------------------------------------------------------------------ Arrakis ------------------ */
/* [S1] third planet of Canopus. Sites: [S2] map and Cartographic Notes; [S3]; [S4]. Every lat/lon
   below is hand-laid from the map's general arrangement and is an estimate. Longitude 0 passes
   through Observatory Mountain [S2]. Carthag ~200 km NE of Arrakeen across the Broken Land [S2,S4]. */
{id: "arrakis", name: "Arrakis", aka: ["Dune"], group: "dune", books: [1, 2, 3, 4, 5, 6], first: 1, major: true,
 status: "Imperial fief · the only source of the spice", hero: "arrakeen",
 star: {name: "Canopus, third planet (glossary)", col: "#fbf4e6", ra: 95.988, dec: -52.696, ly: 310},
 blurb: "A desert planet with no open water and no rain, ringed at the north by the Shield Wall that shelters its few cities. Giant sandworms rule the open sand, and the spice melange, which extends life and lets Guild navigators steer between the stars, is found here and nowhere else. The Emperor hands it from House Harkonnen to House Atreides as the first book opens, and the desert Fremen wait in their hidden sietches.",
 short: "Dune, the desert planet: the spice, the worms and the Fremen.",
 facts: [["Moons", "Two; the second shows the shape of the kangaroo mouse the Fremen call muad’dib"], ["Native people (Dune)", "The Fremen, in hidden sietches"], ["Export", "Melange, the spice"]],
 gfx: {type: "desert", sea: 0, pal: ["#3a2410", "#5a3a1c", "#c48a50", "#dcae6c", "#a86e3c", "#f2dcb4"], dune: 10, rough: .5,
   ice: 86, clouds: .04, cloudCol: "#e8c89a", atmo: "#e8a868", atmoK: .7, lights: .12, sw: "#d8a060",
   feat: [
    {k: "range", from: [70, -62], to: [67.5, -8], w: 1.8, s: .32},          /* Shield Wall, west arm (estimated) */
    {k: "range", from: [67.5, 2], to: [70, 62], w: 1.8, s: .32},            /* Shield Wall, east arm; gap near lon -8..2 = Old Gap (estimated) */
    {k: "range", from: [72.5, -3], to: [76.5, 9], w: 1.4, s: .26},          /* Broken Land between Arrakeen and Carthag [S2,S4] */
    {k: "peak", at: [74, 0], r: 1.6, s: .5},                                 /* Observatory Mountain, highest point [S2,S3] */
    {k: "range", from: [69.5, -30], to: [70.5, -20], w: 1, s: .42},          /* Rimwall West, high scarp of the Wall [S2] */
    {k: "basin", at: [88, 40], r: 4, s: .22},                                /* Polar Sink, ~500 m below the Bled [S2] */
    {k: "basin", at: [72, -9], r: 2.6, s: .1},                                /* Imperial Basin round Arrakeen (estimated) */
    {k: "range", from: [64.5, 20], to: [60.5, 31], w: 1.1, s: .24},          /* False Wall East (estimated) */
    {k: "range", from: [63.5, -30], to: [59.5, -41], w: 1.1, s: .24},        /* False Wall West (estimated) */
    {k: "range", from: [53, -16], to: [50.5, -28], w: 1.1, s: .24},          /* Habbanya Ridge (estimated) */
    {k: "basin", at: [62, 30], r: 1, s: .4},                                  /* Red Chasm, ~1,582 m below the Bled [S2] */
    {k: "basin", at: [63, -26], r: 2.6, s: .12},                              /* Cielago Depression (estimated) */
    {k: "biome", style: "rock", at: [58, 4], r: 5.5, s: .7, c: "#a8784a"},   /* Great Flat: open rock south of the Wall [S2] */
    {k: "biome", style: "farm", at: [-40, 10], r: 6, s: .6, c: "#8a8a4a"}    /* Palmaries of the South, ~40 S [S2] (estimated longitude) */
   ]},
 moons: [{name: "First Moon", size: .2, dist: 3.0, speed: .04}, {name: "Second Moon (muad’dib)", size: .13, dist: 4.1, speed: .06}],
 eras: {
  2: {status: "Throne world of Emperor Paul Muad’Dib",
      blurb: "Twelve years after the Battle of Arrakeen, Arrakis is the seat of an empire. Paul rules from a vast new Keep in Arrakeen, pilgrims crowd the city and the Temple of Alia, and the Fremen legions of the jihad have carried his name across the Imperium. Greenery is spreading where the ecological plan has taken hold, and the old desert ways are fading."},
  3: {status: "Regency of Alia",
      blurb: "Nine years after Paul walked into the desert, his sister Alia rules as regent for his twins, Leto and Ghanima. The terraforming is pushing back the desert and the sandworms with it, and a blind preacher out of the deep desert speaks against the priesthood that has grown up around Muad’Dib."},
  4: {status: "Green world of the God Emperor",
      blurb: "Three and a half thousand years into Leto II’s reign, Arrakis is a planet of forests, rivers and farmland. Only the Sareer remains: a strip of desert kept around the God Emperor’s Citadel, flanked by the Forbidden Forest. The festival city Onn stands where Arrakeen was, and the sandworms are gone except for Leto himself.",
      gfx: {type: "forest", sea: .3, pal: ["#0e2a3a", "#2a5a6a", "#3e6a32", "#6a8a44", "#7a6a4a", "#e8e0d0"], rough: .45, ice: 82,
            clouds: .34, cloudCol: "#ffffff", atmo: "#8ab0e8", atmoK: 1, lights: .25, sw: "#5a7a3a",
            feat: [
             {k: "biome", style: "rock", at: [64, -4], r: 6, s: 1, c: "#d0a464"},     /* the Sareer (estimated) */
             {k: "biome", style: "forest", at: [69, -10], r: 4, s: .95, c: "#24401e"}, /* Forbidden Forest (estimated) */
             {k: "river", from: [72, -12], to: [67, 6], w: .45, s: .4},              /* Idaho River (estimated) */
             {k: "continent", at: [66, -4], r: 8, s: .25},
             {k: "continent", at: [40, 20], r: 30, s: .2},
             {k: "continent", at: [-20, -60], r: 26, s: .2},
             {k: "peak", at: [74, 0], r: 1.6, s: .4}
            ]}},
  5: {status: "Rakis: desert again, held by its priesthood",
      blurb: "Fifteen hundred years after Leto II’s death his body’s sandtrout have turned the planet back into desert, and the worms have returned. Now called Rakis, it is ruled by the Priesthood of the Divided God from the city of Keen, with the Bene Gesserit, Tleilaxu and Ixians all keeping watch. At the end of Heretics the Honored Matres burn its surface to glass.",
      gfx: {type: "desert", sea: 0, pal: ["#3a2410", "#5a3a1c", "#c48a50", "#dcae6c", "#a86e3c", "#f2dcb4"], rough: .5, ice: 86,
            clouds: .04, cloudCol: "#e8c89a", atmo: "#e8a868", atmoK: .7, lights: .1, sw: "#d8a060",
            feat: [
             {k: "range", from: [70, -62], to: [67.5, -8], w: 1.8, s: .26},
             {k: "range", from: [67.5, 2], to: [70, 62], w: 1.8, s: .26},
             {k: "peak", at: [74, 0], r: 1.6, s: .35},
             {k: "biome", style: "rock", at: [58, 4], r: 5.5, s: .7, c: "#a8784a"},
             {k: "basin", at: [72, -9], r: 2.6, s: .1}
            ]}},
  6: {status: "Burned by the Honored Matres",
      blurb: "The Honored Matres have scorched Rakis, killing the people, the priesthood and every sandworm they could find. The only known survivor of the old cycle is the worm Odrade and Sheeana carried away, whose sandtrout now seed a new desert on Chapterhouse.",
      gfx: {type: "lava", sea: 0, pal: ["#120c0a", "#1e1612", "#2e221c", "#3e2e24", "#5a4434", "#7a6a5a"], rough: .7, ice: 90,
            clouds: .3, cloudCol: "#5a5048", atmo: "#8a5a3a", atmoK: .55, lights: 0, lava: "#ff6a2a", sw: "#3e2e24"}}
 },
 sites: [
  {id: "arrakeen", name: "Arrakeen", lat: 72, lon: -6, books: [1, 2, 3],
   desc: "The old seat of planetary government, a small walled city in the Imperial Basin under the Shield Wall. House Atreides lands here in the first book and holds the Residency until the Harkonnen night attack; Paul later makes it the capital of his empire."},
  {id: "carthag", name: "Carthag", lat: 76, lon: 6, books: [1],
   desc: "The Harkonnen-built city about 200 kilometres northeast of Arrakeen across the Broken Land, larger and harsher than the old capital."},
  {id: "observatory", name: "Observatory Mountain", lat: 74, lon: 0, books: [1],
   desc: "The highest point of the Broken Land; the book’s map runs its zero meridian through this peak."},
  {id: "shieldwall", name: "The Shield Wall", lat: 68.4, lon: -24, books: [1, 2, 3],
   desc: "A great mountain wall around the northern lowlands that breaks the coriolis storms and shelters the cities. Beyond it lies the open desert of the Fremen."},
  {id: "oldgap", name: "Old Gap", lat: 67.8, lon: -3, books: [1],
   desc: "A deep cleft through the Shield Wall that the map credits to Paul, who blasted the Wall open with the house atomics so that the Fremen and their worms could ride into the Imperial Basin."},
  {id: "rimwall", name: "Rimwall West", lat: 70, lon: -25, books: [1],
   desc: "A sheer scarp rising out of the western Shield Wall, one of the highest walls on the map."},
  {id: "harg", name: "Harg Pass", lat: 68.6, lon: 14, books: [1],
   desc: "A pass through the Shield Wall. The map notes a shrine to Duke Leto’s skull overlooking it."},
  {id: "windpass", name: "Wind Pass", lat: 66.6, lon: 24, books: [1],
   desc: "A cliff-walled pass that opens onto the sink villages of the pyons."},
  {id: "polarsink", name: "Polar Sink", lat: 87, lon: 40, books: [1],
   desc: "The low ground around the north pole, some 500 metres below the level of the Bled, near the small polar cap that the cities mine for water."},
  {id: "funeral", name: "Funeral Plain", lat: 64.4, lon: -10, books: [1],
   desc: "An open erg of shifting sand south of the Shield Wall, named on the book’s map."},
  {id: "tabr", name: "Sietch Tabr", lat: 60, lon: 6, books: [1, 2, 3],
   desc: "Stilgar’s sietch, a hidden cave-warren in the rock south of the Shield Wall. Paul and Jessica are taken in here; it becomes Paul’s base, Chani dies in childbirth here in the second book, and the twins grow up here."},
  {id: "greatflat", name: "The Great Flat", lat: 57, lon: -2, books: [1],
   desc: "Open rock and sand south of the Wall. A line of outcrops runs from Sietch Tabr south towards the other sietch communities."},
  {id: "falsewallE", name: "False Wall East", lat: 62.6, lon: 26, books: [1],
   desc: "One of the rock walls in the desert that travellers mistake for the true Shield Wall."},
  {id: "falsewallW", name: "False Wall West", lat: 61.6, lon: -36, books: [1],
   desc: "The western of the two false walls that edge the Minor Erg."},
  {id: "redchasm", name: "Red Chasm", lat: 62, lon: 30, books: [1],
   desc: "The deepest place on the map, more than 1,500 metres below the level of the Bled."},
  {id: "cielago", name: "Cielago Depression", lat: 63, lon: -26, books: [1],
   desc: "A broad low basin about 200 metres below the Bled."},
  {id: "sihaya", name: "Sihaya Ridge", lat: 56, lon: 22, books: [1],
   desc: "A rock ridge in the desert south of the Wall, named on the map. Sihaya, the desert springtime, is also Paul’s private name for Chani."},
  {id: "habbanya", name: "Habbanya Ridge", lat: 52, lon: -22, books: [1],
   desc: "A long ridge deep in Fremen country, south and west of Sietch Tabr."},
  {id: "birds", name: "Cave of Birds", lat: 51.4, lon: -24, books: [1],
   desc: "A cave in Habbanya Ridge, named on the map and used as a Fremen meeting place."},
  {id: "palmaries", name: "Palmaries of the South", lat: -40, lon: 10, books: [1],
   desc: "Fremen plantings far in the southern desert, around 40 degrees south, where the hidden work of changing Arrakis is furthest along. Paul spends the later years of his desert war in the south."},
  {id: "keep", name: "Paul’s Keep", lat: 72.6, lon: -4.4, books: [2, 3],
   desc: "The immense palace Paul builds in Arrakeen as emperor, said to be the largest building ever raised. It is the setting of most of the second book."},
  {id: "fane", name: "Temple of Alia", lat: 71.4, lon: -7.4, books: [2, 3],
   desc: "Alia’s Fane, the great temple raised for Paul’s sister. In Children of Dune the blind Preacher is killed on its steps."},
  {id: "jacurutu", name: "Jacurutu", lat: 34, lon: -58, books: [3],
   desc: "A lost sietch of water-stealers in the deep desert, whose people were wiped out long ago and whose name the Fremen will not speak. Leto II flees here in Children of Dune and passes through the spice trance that sets him on the Golden Path. Position estimated."},
  {id: "shuloch", name: "Shuloch", lat: 30, lon: -64, books: [3],
   desc: "The hidden settlement in the deep desert where Jacurutu’s secret survivors live. Position estimated."},
  {id: "citadel", name: "The Citadel", lat: 65.4, lon: -2, books: [4],
   desc: "Leto II’s tower in the Sareer, the last desert on a green world, where the God Emperor keeps his court, his Duncan Idahos and his hidden spice. Position estimated."},
  {id: "sareer", name: "The Sareer", lat: 62.5, lon: -6, books: [4],
   desc: "The only desert left in Leto’s time, a long strip of sand kept around the Citadel. Leto tests Siona by walking her across it. Position estimated."},
  {id: "onn", name: "Onn", lat: 71.6, lon: -5.4, books: [4],
   desc: "The festival city of the God Emperor, built where Arrakeen once stood. Leto comes here for the great festivals and audiences."},
  {id: "bridge", name: "Idaho River bridge", lat: 69, lon: -4.6, books: [4],
   desc: "A high bridge over the Idaho River on the royal road. When Leto’s wedding procession crosses it, the supports are cut and he falls into the river. Position estimated."},
  {id: "tuono", name: "Tuono", lat: 63.4, lon: -16, books: [1, 4],
   desc: "Tuono Basin is named on the first book’s map. In God Emperor, Tuono is the village at the edge of the Sareer where Leto means to marry Hwi Noree. Position estimated."},
  {id: "darbalat", name: "Dar-es-Balat", lat: 64, lon: -12, books: [4],
   desc: "The site on Rakis where Leto II’s hidden journals are later found, the record the fourth book presents itself as drawn from. Position estimated."},
  {id: "keen", name: "Keen", lat: 72.3, lon: -6.6, books: [5],
   desc: "The city of the Priesthood of the Divided God on Rakis, on the ground of old Arrakeen and Onn. The Bene Gesserit keep a fortress here."},
  {id: "sheeana", name: "Sheeana’s village", lat: 58, lon: -14, books: [5],
   desc: "A poor pan village in the open desert, destroyed by a sandworm that spared only one child, Sheeana, who can command the worms. Position estimated."}
 ]},

/* ------------------------------------------------------------------ Caladan ------------------ */
/* [S1] third planet of Delta Pavonis. Surface estimated. */
{id: "caladan", name: "Caladan", group: "dune", books: [1, 2, 3, 6], first: 1, major: true,
 status: "Ancestral home of House Atreides", hero: "castle",
 star: {name: "Delta Pavonis, third planet (glossary)", col: "#ffe9c4", ra: 302.182, dec: -66.182, ly: 19.9},
 blurb: "A mild ocean world of rain and fishing fleets, home of House Atreides for twenty-six generations. Paul grows up in Castle Caladan above the sea and passes the Reverend Mother’s test of the box and the needle there before the family leaves for Arrakis.",
 short: "The ocean world House Atreides leaves for Arrakis.",
 facts: [["Rulers (Dune)", "House Atreides"], ["Known for", "Pundi rice, the sea"]],
 gfx: {type: "ocean", sea: .7, freq: 1.5, pal: ["#06203a", "#1e5a84", "#3e6a3a", "#6a8a4a", "#6a6252", "#eef0f2"], clouds: .55,
   atmo: "#7aa8ff", atmoK: 1.1, lights: .15, sw: "#2a6a8a",
   feat: [{k: "continent", at: [30, 10], r: 18, s: .22}, {k: "continent", at: [-10, 70], r: 12, s: .2}, {k: "continent", at: [5, -90], r: 14, s: .2},
          {k: "range", from: [36, 4], to: [26, 18], w: 2, s: .24}, {k: "biome", style: "farm", at: [24, 12], r: 6, s: .8, c: "#7a8a3e"}]},
 eras: {
  2: {status: "Lady Jessica’s retreat", blurb: "After Paul’s victory his mother Jessica goes home to Caladan and lives there apart from the court on Arrakis."},
  3: {status: "Lady Jessica’s retreat", blurb: "Jessica leaves Caladan for Arrakis at the start of Children of Dune to see her grandchildren and judge Alia."},
  6: {status: "Dan, an old Atreides world", blurb: "In the far future Caladan is called Dan, remembered as the old Atreides home."}
 },
 sites: [
  {id: "castle", name: "Castle Caladan", lat: 30, lon: 8, books: [1],
   desc: "The Atreides castle on the sea cliffs, Paul’s childhood home. Here the Reverend Mother Mohiam tests him with the gom jabbar. Position estimated."},
  {id: "paddies", name: "Pundi rice paddies", lat: 24, lon: 13, books: [1],
   desc: "Caladan’s lowland farms; pundi rice is its main export. Position estimated."}
 ]},

/* ------------------------------------------------------------------ Giedi Prime / Gammu ------- */
/* [S1] planet of 36 Ophiuchi B. Gammu = later name (Heretics) [S4]. Surface estimated. */
{id: "giedi", name: "Giedi Prime", group: "dune", books: [1, 5, 6], first: 1, major: true,
 status: "Homeworld of House Harkonnen", hero: "hkeep",
 star: {name: "36 Ophiuchi B (glossary)", col: "#ffcf94", ra: 258.837, dec: -26.602, ly: 19.5},
 blurb: "The Harkonnen homeworld, an industrial planet of black stone and smoke, run on slavery and fear. Baron Vladimir Harkonnen plots the fall of House Atreides here with his Mentat Piter de Vries, and his nephew Feyd-Rautha fights slave gladiators in its arena.",
 short: "The Harkonnen homeworld.",
 facts: [["Rulers (Dune)", "House Harkonnen"]],
 gfx: {type: "barren", sea: .22, pal: ["#0e1012", "#22262a", "#3a3632", "#4a443c", "#5e544a", "#a09a90"], rough: .6, clouds: .45,
   cloudCol: "#6a645c", atmo: "#a08a6a", atmoK: .8, lights: .8, lightCol: "#ff9a4a", sw: "#4a443c"},
 eras: {
  5: {status: "Gammu: Bene Gesserit keep, then Honored Matre prize",
      blurb: "Fifteen hundred years after Leto II, the old Harkonnen world is called Gammu. The Bene Gesserit raise a Duncan Idaho ghola in their keep here under the old Bashar Miles Teg, until the Honored Matres sweep in and take the planet. Harkonnen relics still lie hidden in its wilds.",
      gfx: {type: "terran", sea: .4, pal: ["#0e2030", "#2a4a5e", "#3a5a34", "#5a6a40", "#5e5446", "#d8d4cc"], clouds: .42, cloudCol: "#e8e8e8", atmo: "#8aa8d8", atmoK: .95, lights: .5, lightCol: "#ffc27a", sw: "#3a5a34"}},
  6: {status: "Honored Matre stronghold",
      blurb: "Lucilla takes refuge on Gammu with a hidden community of Jews and meets the wild Reverend Mother Rebecca. Later the Bene Gesserit, led by the reborn Miles Teg, strike the Honored Matres here."}
 },
 sites: [
  {id: "hkeep", name: "Harkonnen Keep", lat: 22, lon: 30, books: [1],
   desc: "The Baron’s fortress, where he and Piter de Vries plan the trap for House Atreides. Position estimated."},
  {id: "arena", name: "The arena", lat: 20, lon: 34, books: [1],
   desc: "Where Feyd-Rautha fights a captive gladiator on his birthday. Position estimated."},
  {id: "gammukeep", name: "Gammu Keep", lat: 34, lon: -20, books: [5],
   desc: "The Bene Gesserit fortress where Miles Teg trains the boy ghola Duncan Idaho and Lucilla waits to imprint him. Position estimated."},
  {id: "ysai", name: "Ysai", lat: 26, lon: -8, books: [5, 6],
   desc: "Gammu’s great city, once the Harkonnen capital Barony. Teg gathers old veterans in its bars here, and Murbella first meets Duncan here. Position estimated."},
  {id: "noglobe", name: "The Harkonnen no-globe", lat: 40, lon: -34, books: [5],
   desc: "An ancient Harkonnen hiding place, invisible to prescience, where Teg restores Duncan’s original memories. Position estimated."}
 ]},

/* ------------------------------------------------------------------ Kaitain ------------------ */
/* No star in Herbert. Alpha Piscium is the fan Dune Gazetteer's identification [S6]: estimated. */
{id: "kaitain", name: "Kaitain", group: "imperial", books: [1, 2], first: 1, major: true, est: true,
 status: "Seat of the Padishah Emperor", hero: "palace",
 star: {name: "Unnamed in the novels (Alpha Piscium in a fan gazetteer)", col: "#d8e2ff", ra: 30.512, dec: 2.764, ly: 151},
 blurb: "The throne world of House Corrino, where Shaddam IV holds court after the Imperial seat moved there from Salusa Secundus. The Emperor and his court leave it to come to Arrakis for the final confrontation of the first book.",
 short: "Throne world of House Corrino.",
 facts: [["Ruler (Dune)", "Padishah Emperor Shaddam IV"], ["House", "Corrino"] ],
 gfx: {type: "city", sea: .45, pal: ["#0a1d3a", "#2a5f86", "#5a6a44", "#7a7a5a", "#8a8070", "#f0ece4"], clouds: .3, atmo: "#9ab8ff", lights: .9, sw: "#8a8070"},
 eras: {2: {status: "Former throne world", blurb: "With Paul on the throne the centre of power has moved to Arrakeen, and House Corrino has gone into exile on Salusa Secundus."}},
 sites: [{id: "palace", name: "The Imperial Palace", lat: 18, lon: 10, books: [1], desc: "Shaddam IV’s court, where Irulan grows up. Position estimated."}]},

/* ------------------------------------------------------------------ Salusa Secundus ---------- */
/* [S1] third planet of Gamma Waiping; second stop of the Zensunni migration; prison planet.
   Waiping is a Chinese asterism in Pisces; gamma Psc used per [S6]: estimated. */
{id: "salusa", name: "Salusa Secundus", group: "imperial", books: [1, 3], first: 1, major: true, est: true,
 status: "Imperial prison planet · Sardaukar training ground", hero: "prison",
 star: {name: "Gamma Waiping, third planet (glossary); shown at Gamma Piscium", col: "#ffd9a8", ra: 349.291, dec: 3.282, ly: 138},
 blurb: "A harsh, half-ruined world and the old capital of House Corrino, now the Emperor’s prison planet. Its brutal conditions breed the Sardaukar, the Emperor’s terror troops. The Fremen keep a tradition that their ancestors were slaves here.",
 short: "Prison planet that breeds the Sardaukar.",
 facts: [["Role", "Prison planet; Sardaukar recruiting ground"], ["Zensunni migration", "Second stop (glossary)"]],
 gfx: {type: "barren", sea: .1, pal: ["#1a1a1c", "#2a2a2c", "#5a4a3a", "#6a5a46", "#7a6a56", "#c8beb0"], rough: .7, clouds: .2, cloudCol: "#a8a098", atmo: "#c8a080", atmoK: .7, lights: .08, sw: "#6a5a46"},
 eras: {3: {status: "Court of House Corrino in exile",
            blurb: "After Paul’s victory the deposed Shaddam IV and his house live in exile on Salusa Secundus. In Children of Dune his daughter Wensicia plots from here for her son Farad’n, and Jessica comes here to train Farad’n in the Bene Gesserit way."}},
 sites: [
  {id: "prison", name: "Prison and training grounds", lat: -12, lon: 40, books: [1], desc: "The Emperor’s prison camps, where the survivors become Sardaukar. Position estimated."},
  {id: "exile", name: "Corrino court in exile", lat: 10, lon: -20, books: [3], desc: "Farad’n’s household, where the plot against the Atreides twins is hatched. Position estimated."}
 ]},

/* ------------------------------------------------------------------ Wallach IX --------------- */
/* [S1] ninth planet of Laoujin; Bene Gesserit Mother School. Laoujin not identified: estimated. */
{id: "wallach", name: "Wallach IX", group: "imperial", books: [1, 2, 6], first: 1, est: true,
 status: "Bene Gesserit Mother School",
 star: {name: "Laoujin, ninth planet (glossary); star unidentified", col: "#fff0dc"}, dir: {l: 38, b: -22}, ly: 140,
 blurb: "Home of the Bene Gesserit Mother School, where the Sisterhood trains its acolytes and keeps its breeding records.",
 facts: [["Placement", "Estimated: Laoujin is not identified with a real star"]],
 gfx: {type: "terran", sea: .5, pal: ["#0e1e30", "#2a4a66", "#4a5a40", "#6a7050", "#7a6a5a", "#f0eeea"], clouds: .5, atmo: "#a8b8e8", lights: .2},
 eras: {
  2: {status: "Mother School · where the plot is hatched",
      blurb: "In Dune Messiah the Reverend Mother Mohiam, the Guild navigator Edric, the Tleilaxu Face Dancer Scytale and Princess Irulan meet on Wallach IX to plot against Emperor Paul."},
  6: {status: "Struck by the Honored Matres", blurb: "In Chapterhouse word reaches the Honored Matres that Wallach IX, the old Mother School, has been overrun or destroyed in their war on the Sisterhood."}
 }},

/* ------------------------------------------------------------------ Ix ----------------------- */
/* Messiah: ninth planet of its sun. Star from the non-canon Dune Encyclopedia (Alkalurops / mu Boo): estimated. */
{id: "ix", name: "Ix", group: "machine", books: [1, 2, 4, 5, 6], first: 1, major: true, est: true,
 status: "World of the machine-makers",
 star: {name: "Unnamed; Alkalurops in the non-canon Dune Encyclopedia", col: "#f8f6ff", ra: 231.123, dec: 37.377, ly: 113},
 blurb: "With Richese, the leading machine culture of the Imperium, building devices that skirt the ban on thinking machines. Ixian goods turn up everywhere, from hunter-seekers to Guild equipment.",
 facts: [["Known for", "Machines at the edge of the Butlerian ban"] ],
 gfx: {type: "ice", sea: .15, pal: ["#1a2430", "#2a3a4a", "#5a646e", "#707a84", "#8a929a", "#e8eef4"], clouds: .25, atmo: "#a8c0e0", atmoK: .7, lights: .6, lightCol: "#9fd0ff"},
 eras: {
  2: {status: "World of the machine-makers", blurb: "Dune Messiah calls Ix the ninth planet of its sun. Ixian makers and their devices are part of the web of powers around Paul’s throne."},
  4: {status: "Ixian embassy to the God Emperor", blurb: "Ix sends Hwi Noree, a woman bred and shaped to be the perfect match for Leto II, as its ambassador to the God Emperor, along with her uncle Malky. Ix is also building machines that may let ships travel without Guild navigators."},
  5: {status: "Ixians and their no-ships", blurb: "In the far future the Ixians build no-ships and navigation machines, hidden from prescience, that break the Guild’s old monopoly on travel."}
 }},

/* ------------------------------------------------------------------ Tleilax ------------------ */
/* [S1] lone planet of Thalim. Acamar is the fan identification [S6]: estimated. */
{id: "tleilax", name: "Tleilax", group: "machine", books: [1, 2, 4, 5, 6], first: 1, major: true, est: true,
 status: "World of the Bene Tleilax",
 star: {name: "Thalim, lone planet (glossary); shown at Acamar", col: "#e4eaff", ra: 44.565, dec: -40.305, ly: 161},
 blurb: "The lone planet of the star Thalim, home of the Tleilaxu, who sell twisted Mentats and other products of their flesh-craft. Piter de Vries, the Baron’s Mentat, is one of theirs.",
 facts: [["Known for", "Twisted Mentats; later gholas and Face Dancers"]],
 gfx: {type: "desert", sea: .12, pal: ["#2a2418", "#3a3424", "#7a6a4a", "#8a7a56", "#6a5a42", "#d8ccb4"], clouds: .2, atmo: "#c8b890", atmoK: .7, lights: .35},
 eras: {
  2: {status: "World of the Bene Tleilax", blurb: "The Tleilaxu grow gholas, beings regrown from the dead, and train Face Dancers, shape-shifters who can wear any face. They send Paul a ghola of Duncan Idaho as a poisoned gift."},
  4: {status: "Source of the Duncan Idahos", blurb: "For Leto II the Tleilaxu supply one Duncan Idaho ghola after another, each a copy of his grandfather’s swordmaster."},
  5: {status: "The Masters’ world", blurb: "In Heretics the Tleilaxu Masters, led by Tylwyth Waff, run a secret religion and plan to dominate the returning Scattering with Face Dancers who can copy minds. They supply the Bene Gesserit with a new Duncan ghola."},
  6: {status: "Overrun by the Honored Matres", blurb: "In Chapterhouse the Honored Matres crush the Tleilaxu worlds, and the Bene Gesserit hold Scytale, the last of the Masters, captive."}
 }},

/* ------------------------------------------------------------------ Chapterhouse ------------- */
/* No star or location in the books (it is secret): estimated. Surface estimated. */
{id: "chapterhouse", name: "Chapterhouse", group: "later", books: [5, 6], first: 5, major: true, est: true,
 status: "Secret world of the Bene Gesserit", hero: "central",
 star: {name: "Unnamed", col: "#fff2dc"}, dir: {l: 112, b: -24}, ly: 900,
 blurb: "The hidden home of the Bene Gesserit, a green world of farms and orchards whose position the Sisterhood guards with its life. At the end of Heretics, Odrade and Sheeana bring here the last sandworm of Rakis, to start the desert cycle over again.",
 short: "The Sisterhood’s hidden world, turned into a new desert.",
 facts: [["Rulers", "The Bene Gesserit Mother Superior"], ["Placement", "Secret in the books; position estimated"]],
 gfx: {type: "terran", sea: .48, freq: 1.4, pal: ["#0a2034", "#2a5a7a", "#4a6e34", "#7a8a48", "#7a6a50", "#eef0f0"], clouds: .4,
   atmo: "#8ab4ff", lights: .2, sw: "#4a6e34",
   feat: [{k: "continent", at: [20, 20], r: 30, s: .2}, {k: "biome", style: "farm", at: [24, 16], r: 10, s: .85, c: "#8a9a42"},
          {k: "biome", style: "forest", at: [32, 36], r: 7, s: .8, c: "#2e4a26"}]},
 eras: {6: {status: "A new Dune in the making",
            blurb: "The sandtrout from the Rakis worm spread a desert band across Chapterhouse, killing orchards and farmland while Sheeana watches for the first worms. The Sisterhood plans its war on the Honored Matres from here, and at the end a great no-ship escapes from its landing field.",
            gfx: {pal: ["#0a2034", "#2a5a7a", "#7a7a46", "#c8a066", "#8a6a48", "#eee6d8"], clouds: .25, sw: "#c8a066",
                  feat: [{k: "continent", at: [20, 20], r: 30, s: .2}, {k: "biome", style: "rock", at: [6, 10], r: 14, s: .95, c: "#d0a468"},
                         {k: "biome", style: "farm", at: [30, 22], r: 6, s: .8, c: "#8a9a42"}]}}},
 sites: [
  {id: "central", name: "Central", lat: 26, lon: 18, books: [5, 6], desc: "The main Keep of the Sisterhood and seat of the Mother Superior. Position estimated."},
  {id: "archives", name: "The Archives", lat: 25, lon: 20.5, books: [6], desc: "The Sisterhood’s records, kept under Bellonda. Position estimated."},
  {id: "landing", name: "The landing field and no-ship", lat: 21, lon: 22, books: [6], desc: "Where the great no-ship rests, a prison for Duncan Idaho, Murbella and the Tleilaxu Master Scytale. Position estimated."},
  {id: "desert", name: "The new desert", lat: 6, lon: 10, books: [6], desc: "The spreading belt of sand where Sheeana tends the sandtrout and the first young worms. Position estimated."}
 ]},

/* ------------------------------------------------------------------ Later-era worlds --------- */
{id: "junction", name: "Junction", group: "later", books: [6], first: 6, est: true,
 status: "Guild world · seat of the Honored Matres",
 star: {name: "Unnamed", col: "#ffe6c4"}, dir: {l: 300, b: 16}, ly: 220,      /* estimated */
 blurb: "An old Spacing Guild world that the Honored Matres have taken as the seat of their Great Honored Matre. The Bene Gesserit strike here at the climax of Chapterhouse, and it is here that the two orders are forcibly joined.",
 facts: [["Placement", "Not given in the books; estimated"]],
 gfx: {type: "city", sea: .35, pal: ["#101a26", "#2a3a4e", "#4a4a44", "#5e5a50", "#7a7264", "#e0dcd4"], clouds: .3, atmo: "#c8a8a0", lights: .85, lightCol: "#ffb08a"}},

{id: "lampadas", name: "Lampadas", group: "later", books: [6], first: 6, est: true,
 status: "Bene Gesserit school world, destroyed",
 star: {name: "Unnamed", col: "#fff0dc"}, dir: {l: 72, b: -12}, ly: 400,      /* estimated */
 blurb: "A Bene Gesserit centre of learning, destroyed by the Honored Matres in Chapterhouse. The Chancellor Lucilla escapes carrying the shared memories of millions of its Reverend Mothers.",
 facts: [["Placement", "Not given in the books; estimated"]],
 gfx: {type: "barren", sea: .2, pal: ["#141010", "#241c18", "#3a2a22", "#4a3628", "#5a4434", "#8a7a6a"], clouds: .35, cloudCol: "#6a5a50", atmo: "#a87050", atmoK: .7, lights: 0}},

{id: "buzzell", name: "Buzzell", group: "later", books: [6], first: 6, est: true,
 status: "Bene Gesserit punishment world",
 star: {name: "Unnamed", col: "#e8f0ff"}, dir: {l: 152, b: 18}, ly: 600,      /* estimated */
 blurb: "A sea world where the Bene Gesserit post disgraced sisters and gather soostones, which the Honored Matres covet.",
 facts: [["Placement", "Not given in the books; estimated"]],
 gfx: {type: "ocean", sea: .82, pal: ["#061a30", "#1a4a74", "#5a6a5a", "#7a826a", "#7a7466", "#eef0f2"], clouds: .5, atmo: "#88aaff"}},

{id: "lernaeus", name: "Lernaeus", group: "later", books: [5], first: 5, est: true,
 status: "Miles Teg’s home",
 star: {name: "Unnamed", col: "#fff1d6"}, dir: {l: 18, b: 30}, ly: 90,        /* estimated */
 blurb: "The farm world where the retired Bashar Miles Teg lives at the start of Heretics, until Mother Superior Taraza calls him back to guard the new Duncan Idaho ghola.",
 facts: [["Placement", "Not given in the books; estimated"]],
 gfx: {type: "terran", sea: .45, pal: ["#0a2240", "#2a6088", "#5a8a3a", "#8a9a4a", "#7a6a50", "#f0f0ec"], clouds: .4, atmo: "#88aaff", lights: .15,
   feat: [{k: "biome", style: "farm", at: [20, 0], r: 20, s: .85, c: "#8e9a3e"}]}},

/* ------------------------------------------------------------------ Landsraad & glossary worlds - */
{id: "naraj", name: "Naraj", group: "landsraad", books: [2], first: 2, est: true,
 status: "Jihad battlefield",
 star: {name: "Unnamed", col: "#fff0dc"}, dir: {l: 192, b: 10}, ly: 260,      /* estimated */
 blurb: "One of the few battles of Paul’s jihad the books name. The old Fedaykin Farok fought in the conquest of Naraj and its moons, where the defenders used a stone burner and his son lost his eyes.",
 facts: [["Source", "Dune Messiah"], ["Placement", "Not given in the books; estimated"]],
 gfx: {type: "terran", sea: .5, pal: ["#0a1e36", "#2a5a80", "#5a6a3a", "#7a7a4a", "#6a5a4a", "#e8e6e0"], clouds: .4, atmo: "#90b0ff", lights: .2},
 moons: [{name: "Moon", size: .15, dist: 3}, {name: "Moon", size: .1, dist: 3.8}]},

{id: "ecaz", name: "Ecaz", group: "landsraad", books: [1], first: 1,
 status: "Sculptors’ paradise",
 star: {name: "Alpha Centauri B, fourth planet (glossary)", col: "#ffcf94", ra: 219.896, dec: -60.837, ly: 4.37},
 blurb: "The fourth planet of Alpha Centauri B, a sculptors’ paradise famous for fogwood, a plant that can be shaped by thought as it grows.",
 facts: [["Known for", "Fogwood"]],
 gfx: {type: "forest", sea: .45, pal: ["#0a2034", "#2a5a7a", "#2e5a2e", "#4a7a3a", "#5a5a46", "#e8eae4"], clouds: .5, atmo: "#9ab8ff", lights: .1}},

{id: "richese", name: "Richese", group: "machine", books: [1], first: 1, est: true,
 status: "Machine culture",
 star: {name: "Eridani A, fourth planet (glossary); shown at 40 Eridani A", col: "#ffd6a0", ra: 63.818, dec: -7.653, ly: 16.3},
 blurb: "The fourth planet of Eridani A. With Ix it leads the Imperium in miniaturised machines, having come through the Butlerian Jihad less harmed than most.",
 gfx: {type: "city", sea: .4, pal: ["#0a1a2a", "#26486a", "#4a5050", "#5e6460", "#747a76", "#e8ecee"], clouds: .3, atmo: "#9ab8e8", lights: .8, lightCol: "#bfe0ff"}},

{id: "sikun", name: "Sikun", group: "landsraad", books: [1], first: 1,
 status: "Source of akarso",
 star: {name: "70 Ophiuchi A (glossary)", col: "#ffd8a0", ra: 271.364, dec: 2.5, ly: 16.6},
 blurb: "A world of 70 Ophiuchi A, named in the glossary as the home of akarso, a striped-leaved plant whose berries give a stimulant.",
 gfx: {type: "forest", sea: .4, pal: ["#0a2034", "#2a5a7a", "#3a6a2a", "#6a8a3a", "#6a5a42", "#e8e6dc"], clouds: .45, atmo: "#9ab8ff"}},

{id: "belategeuse", name: "Bela Tegeuse", group: "landsraad", books: [1], first: 1, est: true,
 status: "Third stop of the Zensunni migration",
 star: {name: "Kuentsing, fifth planet (glossary); shown at Iota Leporis", col: "#d6e0ff", ra: 78.075, dec: -11.869, ly: 232},
 blurb: "The fifth planet of Kuentsing, remembered as the third stopping place of the Zensunni wanderers, the Fremen’s ancestors, on their long forced migration.",
 gfx: {type: "ice", sea: .3, pal: ["#2a3a4a", "#4a5a6a", "#7a828a", "#9aa2aa", "#b8bec4", "#f2f4f6"], clouds: .4, atmo: "#b0c4e8", atmoK: .7}},

{id: "gamont", name: "Gamont", group: "landsraad", books: [1], first: 1, est: true,
 status: "Pleasure world",
 star: {name: "Niushe, third planet (glossary); shown at Psi-1 Draconis", col: "#fff6e8", ra: 265.485, dec: 72.149, ly: 74},
 blurb: "The third planet of Niushe, known for its hedonistic culture.",
 gfx: {type: "terran", sea: .55, pal: ["#0a2240", "#2a6088", "#4a7a3a", "#7a9a4a", "#7a6a50", "#f0f0ec"], clouds: .4, atmo: "#ffb0c0", lights: .4}},

{id: "grumman", name: "Grumman", group: "landsraad", books: [1], first: 1, est: true,
 status: "House Moritani",
 star: {name: "Niushe, second planet (glossary)", col: "#fff6e8"}, at: {of: "gamont", spread: .5},
 blurb: "The second planet of Niushe, ruled by House Moritani, which fought and beat House Ginaz in a War of Assassins.",
 gfx: {type: "desert", sea: .15, pal: ["#2a2418", "#3a3424", "#8a6a4a", "#9a7a56", "#6a5a42", "#d8ccb4"], clouds: .2, atmo: "#d8b890"}},

{id: "chusuk", name: "Chusuk", group: "landsraad", books: [1], first: 1, est: true,
 status: "The music planet",
 star: {name: "Theta Shalish, fourth planet (glossary); shown at Theta Arietis", col: "#d8e2ff", ra: 34.531, dec: 19.901, ly: 430},
 blurb: "The fourth planet of Theta Shalish, famous for its musical instruments; Gurney Halleck’s baliset is the kind made here.",
 facts: [["Known for", "Balisets and other instruments"]],
 gfx: {type: "terran", sea: .5, pal: ["#0a2240", "#2a6088", "#5a7a3a", "#7a8a4a", "#7a6a50", "#f0f0ec"], clouds: .45, atmo: "#a8c0ff", lights: .3}},

{id: "hagal", name: "Hagal", group: "landsraad", books: [1], first: 1, est: true,
 status: "The jewel planet, mined out",
 star: {name: "Theta Shaowei, second planet (glossary); shown at Theta Leonis", col: "#dfe6ff", ra: 168.56, dec: 15.429, ly: 165},
 blurb: "The second planet of Theta Shaowei, once famous for opal-like gems such as opafire, and stripped of them long before the story opens.",
 gfx: {type: "barren", sea: .1, pal: ["#1a1a20", "#2a2a34", "#5a5060", "#6a6070", "#8a8094", "#d8d4e0"], clouds: .1, atmo: "#c8b8e8", atmoK: .5}},

{id: "lankiveil", name: "Lankiveil", group: "landsraad", books: [1], first: 1, est: true,
 status: "Harkonnen holding",
 star: {name: "Unnamed", col: "#fff0dc"}, dir: {l: 344, b: 24}, ly: 60,      /* estimated */
 blurb: "A Harkonnen holding mentioned in the first book: Glossu Rabban, the Baron’s brutal nephew, is Count of Lankiveil.",
 facts: [["Placement", "Not given in the books; estimated"]],
 gfx: {type: "ice", sea: .55, pal: ["#0a1a2a", "#2a4a6a", "#6a7480", "#8a929a", "#a8b0b8", "#f2f4f6"], clouds: .5, atmo: "#a8c0e0"}},

{id: "tupile", name: "Tupile", group: "landsraad", books: [1], first: 1, est: true,
 status: "Sanctuary for defeated houses",
 star: {name: "Secret", col: "#fff2dc"}, dir: {l: 232, b: 40}, ly: 500,     /* estimated */
 blurb: "The sanctuary world, or worlds, where defeated great houses can hide under the Guild’s protection; its location is a Guild secret.",
 facts: [["Placement", "Secret in the books; estimated"]],
 gfx: {type: "forest", sea: .4, pal: ["#0a2034", "#2a5a7a", "#2a4a2a", "#4a6a3a", "#5a5a46", "#e8eae4"], clouds: .55, atmo: "#9ab8ff"}},

/* ------------------------------------------------------------------ Ancient ------------------ */
/* [S1] Harmonthep: a former satellite of Delta Pavonis that no longer exists; sixth Zensunni stop per "Ingsley". */
{id: "harmonthep", name: "Harmonthep", group: "ancient", books: [1], first: 1,
 status: "Lost world of the Zensunni migration",
 star: {name: "Delta Pavonis", col: "#ffe9c4"}, at: {of: "caladan", spread: .5},
 blurb: "A world of the Delta Pavonis system, Caladan’s star, which the glossary says no longer exists. One scholar it cites counts it the sixth stop of the Zensunni wanderers.",
 distText: "In the Delta Pavonis system, 19.9 light-years from Sol (real star)",
 facts: [["Fate", "Gone; the glossary does not say how"]],
 gfx: {type: "barren", sea: 0, pal: ["#1a1614", "#2a2420", "#4a4038", "#5a5046", "#6e6458", "#b8b0a4"], clouds: 0, atmoK: 0}},

{id: "poritrin", name: "Poritrin", group: "ancient", books: [1], first: 1, est: true,
 status: "Remembered origin of the Zensunni",
 star: {name: "Epsilon Alangue, third planet (glossary); shown at Epsilon Ophiuchi", col: "#ffd9a8", ra: 244.58, dec: -4.692, ly: 106},
 blurb: "The third planet of Epsilon Alangue, which many Zensunni wanderers regard as their world of origin, though their language and myths point to older roots.",
 gfx: {type: "terran", sea: .55, pal: ["#0a2240", "#2a6088", "#5a7a3a", "#8a9a4a", "#7a6a50", "#f0f0ec"], clouds: .4, atmo: "#90b0ff"}},

{id: "corrin", name: "Corrin", group: "ancient", books: [1], first: 1,
 status: "Battlefield that named House Corrino",
 star: {name: "Sigma Draconis (glossary)", col: "#ffd6a0", ra: 293.09, dec: 69.661, ly: 18.8},
 blurb: "The glossary places the Battle of Corrin, the space battle from which the Imperial House Corrino took its name, near Sigma Draconis.",
 distText: "18.8 light-years from Sol: the Battle of Corrin was fought near this real star",
 facts: [["When", "88 B.G., before the Guild"]],
 gfx: {type: "barren", sea: 0, pal: ["#1a1614", "#2a2420", "#4a4038", "#5a5046", "#6e6458", "#b8b0a4"], clouds: 0, atmoK: 0}},

{id: "terra", name: "Old Terra", group: "ancient", books: [1], first: 1,
 status: "Humanity’s lost homeworld",
 star: {name: "Sol", col: "#fff4e0"},
 distText: "The Sun: humanity’s first home, long behind the Imperium",
 blurb: "Earth, the world humanity came from, half-forgotten after some twenty thousand years. Most of the real stars the glossary names lie within a few hundred light-years of the Sun, so the Imperium’s old heart lies all around it. Shown for reference.",
 gfx: {type: "terran", base: "earth", sea: .5, pal: ["#0a1e3e", "#2a608a", "#3e5e2e", "#7a804a", "#7a6a52", "#f2f4f6"], clouds: .44, atmo: "#8ab0ff", lights: 0},
 moons: [{name: "Luna", size: .27, dist: 3.2}]}
  ],

/* ======================================================================== events (Chronicle) */
  events: [
/* I Dune */
{id: "d1", book: 1, world: "caladan", site: "castle", title: "The gom jabbar", text: "On the eve of the move to Arrakis, the Reverend Mother Mohiam tests the fifteen-year-old Paul with a box of pain and a poisoned needle, and he passes."},
{id: "d2", book: 1, world: "giedi", site: "hkeep", title: "The Baron’s trap", text: "Baron Harkonnen and Piter de Vries lay their plan: let the Atreides take Arrakis, then destroy them with a traitor inside their house and Sardaukar in Harkonnen uniform."},
{id: "d3", book: 1, world: "arrakis", site: "arrakeen", title: "House Atreides comes to Arrakis", text: "Duke Leto, Jessica and Paul take over Arrakeen. Leto courts the Fremen and the planetologist Liet-Kynes and wins respect by saving a spice crew from a worm at the cost of his harvester."},
{id: "d4", book: 1, world: "arrakis", site: "arrakeen", title: "Yueh’s betrayal and the night attack", text: "Dr Yueh drops the house shields, and Harkonnen troops with disguised Sardaukar overrun Arrakeen. The captured Duke dies trying to kill the Baron with a poison tooth, killing Piter de Vries instead."},
{id: "d5", book: 1, world: "arrakis", title: "Flight into the deep desert", text: "Paul and Jessica escape by ornithopter into a storm, hide in an ecological testing station where Duncan Idaho dies holding off their pursuers, and are taken in by Stilgar’s band. Paul kills Jamis in a ritual duel and becomes a Fremen."},
{id: "d6", book: 1, world: "arrakis", site: "tabr", title: "Sietch Tabr", text: "Jessica drinks the Water of Life and becomes the Fremen’s Reverend Mother, awakening her unborn daughter Alia. Paul takes the name Muad’Dib and Chani as his partner."},
{id: "d7", book: 1, world: "arrakis", title: "Paul rides the worm", text: "Paul calls and rides his first sandworm, and his Fedaykin raids begin to cripple Harkonnen spice production."},
{id: "d8", book: 1, world: "giedi", site: "arena", title: "Feyd-Rautha’s hundredth fight", text: "On his birthday Feyd kills a captured Atreides fighter in the Harkonnen arena, while the Baron takes the captive Thufir Hawat into his service."},
{id: "d9", book: 1, world: "arrakis", site: "palmaries", title: "The Water of Life", text: "Years later, in the south, Paul drinks the Water of Life, survives, and sees past and future at once: he is the Kwisatz Haderach."},
{id: "d10", book: 1, world: "kaitain", site: "palace", title: "The Emperor moves", text: "With spice production collapsing, Shaddam IV, his Sardaukar and the Guild descend on Arrakis."},
{id: "d11", book: 1, world: "arrakis", site: "oldgap", title: "Battle of Arrakeen", text: "Under cover of a great storm Paul blasts open the Shield Wall with the family atomics, and the Fremen ride worms into the Imperial Basin and overwhelm the Sardaukar."},
{id: "d12", book: 1, world: "arrakis", site: "arrakeen", title: "Paul takes the throne", text: "Paul kills Feyd-Rautha in single combat, forces the Guild to submit by threatening the spice, and claims the throne by agreeing to marry Princess Irulan."},
/* II Dune Messiah */
{id: "m1", book: 2, world: "naraj", title: "The jihad", text: "In twelve years the Fremen legions have carried Paul’s holy war across the known universe, killing billions. Paul foresaw it and could not stop it."},
{id: "m2", book: 2, world: "wallach", title: "The conspiracy", text: "The Bene Gesserit, the Guild, the Tleilaxu and Princess Irulan join in a plot to bring down Emperor Paul."},
{id: "m3", book: 2, world: "arrakis", site: "keep", title: "Hayt", text: "The Tleilaxu give Paul a ghola of Duncan Idaho, called Hayt, conditioned to kill him."},
{id: "m4", book: 2, world: "arrakis", site: "arrakeen", title: "The stone burner", text: "A forbidden atomic stone burner goes off in Arrakeen. Paul is blinded but goes on seeing through his prescience."},
{id: "m5", book: 2, world: "arrakis", site: "tabr", title: "Chani dies", text: "Chani dies giving birth to twins, Leto and Ghanima, which Paul had not foreseen. Hayt’s conditioning breaks and he becomes Duncan Idaho again."},
{id: "m6", book: 2, world: "arrakis", site: "tabr", title: "Paul walks into the desert", text: "Blind and without his vision, Paul follows Fremen custom and walks alone into the desert. Alia rules as regent."},
/* III Children of Dune */
{id: "c1", book: 3, world: "arrakis", site: "arrakeen", title: "Jessica returns", text: "Jessica comes from Caladan and finds Alia changed. Alia is losing herself to the voices of her ancestors, the Baron among them."},
{id: "c2", book: 3, world: "salusa", site: "exile", title: "The Corrino plot", text: "On Salusa Secundus, Wensicia Corrino trains Laza tigers to kill the Atreides twins and clear the way for her son Farad’n."},
{id: "c3", book: 3, world: "arrakis", site: "tabr", title: "The tigers", text: "The twins survive the tigers. Leto lets it be believed he is dead and slips into the desert."},
{id: "c4", book: 3, world: "salusa", title: "Jessica among the Corrinos", text: "Duncan Idaho carries Jessica off to Salusa Secundus, where she trains Farad’n in the Bene Gesserit way."},
{id: "c5", book: 3, world: "arrakis", site: "jacurutu", title: "Jacurutu and the Golden Path", text: "Captured at Jacurutu, Leto is forced into the spice trance, sees the Golden Path, and covers himself in sandtrout, becoming more than human."},
{id: "c6", book: 3, world: "arrakis", site: "fane", title: "The Preacher’s death", text: "The blind Preacher, who is Paul, is killed on the temple steps. Alia, possessed by the Baron, takes her own life when Leto confronts her."},
{id: "c7", book: 3, world: "arrakis", site: "keep", title: "Leto II takes the throne", text: "Leto II begins his reign, with Ghanima betrothed to Farad’n."},
/* IV God Emperor of Dune */
{id: "g1", book: 4, world: "arrakis", site: "citadel", title: "The God Emperor", text: "After three and a half thousand years Leto II has almost become a sandworm. He rules a peaceful, stagnant empire from his Citadel in the Sareer, guarded by his Fish Speakers."},
{id: "g2", book: 4, world: "arrakis", site: "citadel", title: "Siona’s rebels", text: "Leto’s descendant Siona leads young rebels who steal some of his journals. Leto watches with interest rather than anger."},
{id: "g3", book: 4, world: "ix", title: "Hwi Noree", text: "Ix sends Hwi Noree as its ambassador. Leto falls in love with her and decides to marry her."},
{id: "g4", book: 4, world: "arrakis", site: "sareer", title: "The test in the Sareer", text: "Leto walks Siona and a Duncan ghola into the Sareer. To survive, Siona drinks his spice essence and sees the Golden Path, but keeps her resolve to kill him."},
{id: "g5", book: 4, world: "arrakis", site: "onn", title: "Festival at Onn", text: "Leto holds his great festival in Onn, the city that rose on the ruins of Arrakeen."},
{id: "g6", book: 4, world: "arrakis", site: "bridge", title: "The bridge over the Idaho River", text: "On the way to his wedding, the Fish Speaker Nayla cuts the bridge. Leto falls into the river, and the water tears his body apart into sandtrout."},
{id: "g7", book: 4, world: "arrakis", site: "darbalat", title: "The hidden journals", text: "Leto’s own record of his reign survives in hidden chambers on Arrakis, later found at Dar-es-Balat."},
{id: "g8", book: 4, world: "arrakis", title: "The Scattering", text: "Leto’s death releases the pent-up energy of his long peace. Humans spread out into the universe beyond the Imperium, in numbers no power can track or control."},
/* V Heretics of Dune */
{id: "h1", book: 5, world: "lernaeus", title: "Teg is called back", text: "Mother Superior Taraza brings the old Bashar Miles Teg out of retirement to guard a new Duncan Idaho ghola."},
{id: "h2", book: 5, world: "giedi", site: "gammukeep", title: "The ghola on Gammu", text: "Teg trains the young Duncan in the Bene Gesserit Keep, with the Imprinter Lucilla waiting to bind him to the Sisterhood."},
{id: "h3", book: 5, world: "arrakis", site: "sheeana", title: "Sheeana", text: "A girl survives the worm that destroys her village on Rakis and is found to command the sandworms. The Bene Gesserit take her into their care."},
{id: "h4", book: 5, world: "arrakis", site: "keen", title: "Odrade on Rakis", text: "Reverend Mother Darwi Odrade, Teg’s secret daughter, commands the Sisterhood’s keep at Keen and begins Sheeana’s training."},
{id: "h5", book: 5, world: "tleilax", title: "The Tleilaxu Masters", text: "Tylwyth Waff and the Masters pursue their own plan against the Bene Gesserit and the returning Honored Matres."},
{id: "h6", book: 5, world: "giedi", site: "noglobe", title: "The no-globe", text: "Attacked on Gammu, Teg and Lucilla hide Duncan in an old Harkonnen no-globe, where Teg wakes Duncan’s original memories."},
{id: "h7", book: 5, world: "giedi", title: "Teg breaks", text: "Staying behind so Lucilla and Duncan can get away, Teg is taken by the Honored Matres and tortured with a T-probe. Something in him wakes: he moves faster than eyes can follow and fights his way out, then seizes a no-ship with veterans gathered in Ysai."},
{id: "h8", book: 5, world: "giedi", site: "ysai", title: "Duncan and Murbella", text: "The Honored Matre Murbella tries to enslave Duncan sexually, but his Tleilaxu conditioning turns the bond on her, and all his past lives return to him."},
{id: "h9", book: 5, world: "arrakis", site: "keen", title: "Taraza and Waff", text: "Taraza comes to Rakis to bargain with Waff, and plans for the planet’s destruction to serve the Sisterhood."},
{id: "h10", book: 5, world: "arrakis", title: "The burning of Rakis", text: "The Honored Matres attack Rakis and scorch its surface. Taraza and Waff die, and Teg dies in a last stand that draws the Matres in."},
{id: "h11", book: 5, world: "chapterhouse", site: "central", title: "The last worm", text: "Odrade, now Mother Superior, escapes with Sheeana and a single sandworm, bound for Chapterhouse."},
/* VI Chapterhouse: Dune */
{id: "x1", book: 6, world: "lampadas", title: "Lampadas destroyed", text: "The Honored Matres destroy the Bene Gesserit school world. Lucilla escapes carrying the memories of millions of Reverend Mothers."},
{id: "x2", book: 6, world: "giedi", title: "Rebecca", text: "Hidden among the Jews of Gammu, Lucilla shares her memories with the wild Reverend Mother Rebecca before she is handed to the Honored Matres and killed by the Great Honored Matre Dama."},
{id: "x3", book: 6, world: "chapterhouse", site: "desert", title: "The desert grows", text: "The worm’s sandtrout spread across Chapterhouse, killing its orchards and building a desert where Sheeana waits for new worms."},
{id: "x4", book: 6, world: "chapterhouse", site: "central", title: "Murbella’s agony", text: "Murbella, the captive Honored Matre, survives the spice agony and becomes a Reverend Mother."},
{id: "x5", book: 6, world: "chapterhouse", title: "The child Bashar", text: "A Teg ghola is grown and his memories awakened; Odrade makes him Bashar of the Sisterhood’s forces again."},
{id: "x6", book: 6, world: "tleilax", title: "The last Master", text: "With the Tleilaxu worlds overrun, the Bene Gesserit hold Scytale, the last Master, and bargain for his secrets."},
{id: "x7", book: 6, world: "giedi", title: "Strike on Gammu", text: "The young Teg leads the Sisterhood’s forces against the Honored Matres on Gammu."},
{id: "x8", book: 6, world: "junction", title: "Battle of Junction", text: "Teg seizes Junction, but the Honored Matres turn the victory with a new weapon and capture Odrade."},
{id: "x9", book: 6, world: "junction", title: "The union", text: "Murbella goes in among the Honored Matres, kills their new leader Logno, and is acclaimed by them; Odrade dies in the fighting. Murbella now heads both orders."},
{id: "x10", book: 6, world: "chapterhouse", site: "landing", title: "The no-ship’s escape", text: "Duncan, Sheeana, the Teg ghola, Scytale and the Jews fly the great no-ship out into the unknown with sandworms aboard, watched by a strange old couple, Daniel and Marty."}
  ],

/* ======================================================================== codex */
  codex: [
   {id: "powers", title: "Powers", list: [
    {name: "The Padishah Empire and House Corrino", first: 1, desc: "The ruling house for ten thousand years, its throne held by the terror of its Sardaukar and balanced against the Landsraad and the Guild.",
     more: [[2, "After Paul’s victory the Corrinos are exiled to Salusa Secundus."], [3, "Farad’n Corrino becomes Leto II’s ally and Ghanima’s husband-to-be."]]},
    {name: "House Atreides", first: 1, desc: "A great house of the Landsraad, ruled from Caladan by Duke Leto, famed for its loyalty and its fighters.",
     more: [[2, "Paul’s line rules the universe."], [4, "Leto II’s breeding program runs through his Atreides descendants, ending in Siona."]]},
    {name: "House Harkonnen", first: 1, desc: "The Atreides’ old enemies, ruled from Giedi Prime by Baron Vladimir Harkonnen. They held Arrakis before the Atreides and take it back by treachery."},
    {name: "The Landsraad", first: 1, desc: "The assembly of great and minor houses, whose collective power checks the Emperor."},
    {name: "Sardaukar", first: 1, desc: "The Emperor’s fanatical soldiers, bred on the prison world Salusa Secundus. In the first book they fight in Harkonnen uniform against the Atreides."},
    {name: "The Spacing Guild", first: 1, desc: "Holds the monopoly on travel between the stars. Its navigators use the spice to foresee safe paths for the great heighliners.",
     more: [[5, "Ixian navigation machines and no-ships are breaking the Guild’s monopoly."], [6, "The Honored Matres hold the Guild world Junction."]]},
    {name: "CHOAM", first: 1, desc: "The great trading combine through which the Emperor and the great houses share the wealth of the Imperium; directorships are a measure of power."},
    {name: "The Bene Gesserit", first: 1, desc: "A sisterhood of women trained in body and mind, who serve as advisers and wives to the great houses and run a breeding program, centuries long, aimed at a male Kwisatz Haderach.",
     more: [[2, "They join the plot against Paul."], [4, "Under Leto II they survive by his leave."], [5, "In the far future they are hunted by the Honored Matres and keep their world, Chapterhouse, hidden."], [6, "Murbella forces them into union with the Honored Matres."]]},
    {name: "The Fremen", first: 1, desc: "The desert people of Arrakis, descendants of Zensunni wanderers, who live in hidden sietches, ride the worms, and are secretly changing their planet.",
     more: [[2, "Their legions fight Paul’s jihad."], [3, "Their old ways fade as the planet grows green."], [4, "In Leto’s day the Fremen survive only as museum Fremen, performing their past."]]},
    {name: "Mentats", first: 1, desc: "Human computers, trained in logic since thinking machines were banned. Thufir Hawat and Piter de Vries are Mentats.",
     more: [[5, "Miles Teg is a Mentat as well as a Bashar."]]},
    {name: "Smugglers", first: 1, desc: "Spice smugglers who work the desert beyond the Harkonnen and Imperial patrols. Gurney Halleck hides among them."},
    {name: "Ixians", first: 1, desc: "The machine-makers of Ix, working at the edge of the ban on thinking machines.",
     more: [[4, "They send Hwi Noree to Leto."], [5, "They build no-ships and navigation machines."]]},
    {name: "Bene Tleilax", first: 1, desc: "The Tleilaxu, sellers of twisted Mentats and of other biological products, distrusted by all.",
     more: [[2, "Their gholas and Face Dancers are part of the plot against Paul."], [5, "Their Masters secretly hold to a faith of their own and plan to rule the returning Scattering."]]},
    {name: "The Qizarate", first: 2, desc: "The priesthood of Muad’Dib’s religion, led by Korba, which grows rich and powerful in Paul’s name."},
    {name: "Fish Speakers", first: 4, desc: "Leto II’s all-female army and priesthood, devoted to him, who keep order in his empire."},
    {name: "Priesthood of the Divided God", first: 5, desc: "The priests of Rakis, who worship Leto II as the Divided God present in every sandworm, led by the High Priest Hedley Tuek."},
    {name: "The Honored Matres", first: 5, desc: "A violent order of women from the Scattering, returning to the old empire in great numbers. They rule by sexual enslavement and raw force, and seek out and destroy the Bene Gesserit.",
     more: [[6, "Something even worse is hunting them out in the Scattering. Murbella becomes their leader and joins them to the Bene Gesserit."]]},
    {name: "Secret Israel", first: 6, desc: "A hidden community of Jews who have kept their faith and identity through the ages. On Gammu they shelter Lucilla."}
   ]},
   {id: "people", title: "People", list: [
    {name: "Paul Atreides", role: "Muad’Dib", books: [1, 2, 3], desc: "The fifteen-year-old heir of House Atreides, trained in Bene Gesserit ways by his mother. On Arrakis he becomes Muad’Dib, leader of the Fremen, and the Kwisatz Haderach.",
     more: [[2, "As emperor he cannot stop his own jihad. Blinded, he walks into the desert."], [3, "He returns as the blind Preacher and dies on the temple steps."]]},
    {name: "Lady Jessica", role: "Bene Gesserit, Paul’s mother", books: [1, 2, 3], desc: "Duke Leto’s concubine, who defied her order by bearing a son instead of a daughter. She becomes a Reverend Mother of the Fremen.",
     more: [[3, "She returns from Caladan, is taken to Salusa Secundus and trains Farad’n."]]},
    {name: "Duke Leto Atreides", role: "Duke of House Atreides", books: [1], desc: "Paul’s father, an honourable ruler sent to Arrakis knowing it is a trap. He dies trying to kill the Baron."},
    {name: "Alia Atreides", role: "Paul’s sister", books: [1, 2, 3], desc: "Born a Reverend Mother with her ancestors’ memories already awake, a strange, unsettling child among the Fremen.",
     more: [[2, "She rules as regent after Paul."], [3, "Possessed by the memory of the Baron, she becomes the Abomination."]]},
    {name: "Chani", role: "Fremen, Paul’s beloved", books: [1, 2], desc: "Daughter of Liet-Kynes, who becomes Paul’s partner in the desert.",
     more: [[2, "She dies giving birth to Leto and Ghanima."]]},
    {name: "Stilgar", role: "Naib of Sietch Tabr", books: [1, 2, 3], desc: "The Fremen leader who takes in Paul and Jessica and becomes Paul’s loyal follower."},
    {name: "Liet-Kynes", role: "Imperial Planetologist", books: [1], desc: "The Emperor’s ecologist on Arrakis and secretly the Fremen’s leader, heir to his father Pardot’s dream of a green Arrakis."},
    {name: "Thufir Hawat", role: "Atreides Mentat", books: [1], desc: "The house’s master of assassins, captured and used by the Harkonnens after the fall of Arrakeen."},
    {name: "Gurney Halleck", role: "Warrior-troubadour", books: [1, 3], desc: "A fighter and baliset player, Paul’s teacher. After the attack he hides among the smugglers."},
    {name: "Duncan Idaho", role: "Swordmaster", books: [1, 2, 3, 4, 5, 6], desc: "A swordmaster of the Atreides who dies saving Paul and Jessica.",
     more: [[2, "Reborn as the ghola Hayt."], [4, "Dozens of Duncan gholas serve Leto II in turn."], [5, "A new ghola raised on Gammu recovers the memories of all his lives."], [6, "He escapes Chapterhouse in the no-ship."]]},
    {name: "Wellington Yueh", role: "Suk doctor", books: [1], desc: "The Atreides physician, whose conditioning was thought unbreakable, turned traitor to save his wife."},
    {name: "Baron Vladimir Harkonnen", role: "Head of House Harkonnen", books: [1, 3], desc: "A cruel, immensely fat schemer, kept aloft by suspensors, who destroys the Atreides with Imperial help.",
     more: [[3, "His memory lives on inside Alia."]]},
    {name: "Feyd-Rautha Harkonnen", role: "The Baron’s heir", books: [1], desc: "The Baron’s younger nephew, groomed to take Arrakis after his brother Rabban has crushed it."},
    {name: "Glossu Rabban", role: "The Beast", books: [1], desc: "The Baron’s brutal elder nephew, given Arrakis to squeeze."},
    {name: "Piter de Vries", role: "Harkonnen Mentat", books: [1], desc: "A twisted Mentat from Tleilax who designs the plan against the Atreides."},
    {name: "Shaddam IV", role: "Padishah Emperor", books: [1], desc: "The Corrino emperor who fears Duke Leto’s popularity and lends his Sardaukar to the Harkonnens."},
    {name: "Princess Irulan", role: "Shaddam’s daughter", books: [1, 2, 3], desc: "The Emperor’s eldest daughter, whose histories open each chapter of the first book.",
     more: [[2, "Paul’s wife in name only, she joins the plot against him."]]},
    {name: "Gaius Helen Mohiam", role: "Reverend Mother", books: [1, 2], desc: "The Bene Gesserit who tests Paul with the gom jabbar and serves as the Emperor’s Truthsayer."},
    {name: "Count Hasimir Fenring", role: "The Emperor’s friend", books: [1], desc: "A deadly courtier and failed Kwisatz Haderach candidate, with his Bene Gesserit wife Margot."},
    {name: "Jamis", role: "Fremen", books: [1], desc: "The Fremen who challenges Paul and dies in the duel that makes Paul one of the tribe."},
    {name: "Scytale", role: "Tleilaxu Face Dancer", books: [2], desc: "The shape-shifter at the heart of the plot against Paul."},
    {name: "Edric", role: "Guild Steersman", books: [2], desc: "A Guild navigator who joins the conspiracy, his presence clouding Paul’s vision."},
    {name: "Hayt", role: "Ghola of Duncan Idaho", books: [2], desc: "The Tleilaxu’s gift to Paul, the dead swordmaster grown again with a Mentat’s mind."},
    {name: "Korba", role: "Qizara", books: [2], desc: "A Fremen turned priest of the Qizarate who conspires against Paul."},
    {name: "Leto II", role: "Paul’s son", books: [3, 4], desc: "Ghanima’s twin, born with all his ancestors’ memories, who chooses the Golden Path.",
     more: [[4, "God Emperor for three and a half thousand years, slowly becoming a sandworm."]]},
    {name: "Ghanima", role: "Paul’s daughter", books: [3], desc: "Leto’s twin, his match in every way, who keeps her ancestors’ memories in check with the help of one, her mother Chani."},
    {name: "Farad’n Corrino", role: "Corrino heir", books: [3], desc: "Shaddam’s grandson, a thoughtful scholar used by his mother’s schemes."},
    {name: "Wensicia Corrino", role: "Shaddam’s daughter", books: [3], desc: "Farad’n’s mother, who plots to put her son on the throne."},
    {name: "The Preacher", role: "Blind prophet", books: [3], desc: "A blind man from the deep desert who denounces the religion made in Muad’Dib’s name."},
    {name: "Moneo", role: "Leto II’s majordomo", books: [4], desc: "An Atreides descendant who serves the God Emperor and knows something of his purpose."},
    {name: "Siona Atreides", role: "Rebel", books: [4], desc: "Moneo’s daughter and leader of the rebels, the end product of Leto’s breeding plan."},
    {name: "Hwi Noree", role: "Ixian ambassador", books: [4], desc: "A woman made by Ix to be Leto’s perfect companion, whom he truly loves."},
    {name: "Nayla", role: "Fish Speaker", books: [4], desc: "A Fish Speaker who secretly serves Siona."},
    {name: "Miles Teg", role: "Bashar and Mentat", books: [5, 6], desc: "The Sisterhood’s greatest commander, an old soldier of Atreides blood called back to guard the Duncan ghola.",
     more: [[6, "Reborn as a ghola child and Bashar again."]]},
    {name: "Alma Mavis Taraza", role: "Mother Superior", books: [5], desc: "The head of the Bene Gesserit, whose plans no one sees whole."},
    {name: "Darwi Odrade", role: "Reverend Mother", books: [5, 6], desc: "An Atreides by blood and Teg’s daughter, sent to Rakis.",
     more: [[6, "As Mother Superior she plans the union of the orders."]]},
    {name: "Lucilla", role: "Imprinter", books: [5, 6], desc: "A Bene Gesserit trained to bind men to the Sisterhood through sex, sent to imprint Duncan."},
    {name: "Sheeana", role: "Worm-rider", books: [5, 6], desc: "A Rakian orphan whom the worms will not harm and will obey."},
    {name: "Murbella", role: "Honored Matre", books: [5, 6], desc: "A young Honored Matre who becomes bound to Duncan.",
     more: [[6, "She becomes a Reverend Mother, then leader of both orders."]]},
    {name: "Tylwyth Waff", role: "Tleilaxu Master", books: [5], desc: "A Master of the Bene Tleilax sent to Rakis."},
    {name: "Schwangyu", role: "Reverend Mother", books: [5], desc: "Commander of the Gammu Keep, who opposes Taraza’s plan for the ghola."},
    {name: "Dama", role: "Great Honored Matre", books: [6], desc: "The leader of the Honored Matres in the old empire."},
    {name: "Logno", role: "Honored Matre", books: [6], desc: "Dama’s chief adviser, who poisons her and takes her place."},
    {name: "Rebecca", role: "Wild Reverend Mother", books: [6], desc: "A Jewish woman of Gammu who took the spice agony outside the Sisterhood and carries the memories of Lampadas."},
    {name: "Bellonda", role: "Archivist", books: [6], desc: "Mentat-archivist of the Sisterhood, Odrade’s sharpest critic."},
    {name: "Scytale (the Master)", role: "Last Tleilaxu Master", books: [6], desc: "A Tleilaxu Master held on Chapterhouse, bargaining with the secrets of ghola-making."},
    {name: "Daniel and Marty", role: "Watchers", books: [6], desc: "An old man and woman tending a garden who appear in Duncan’s visions and watch the no-ship escape."}
   ]},
   {id: "ideas", title: "Ideas & things", list: [
    {name: "Melange", first: 1, desc: "The spice of Arrakis. It extends life, opens the mind to prescience, makes Guild travel possible, and turns the eyes of habitual users entirely blue. It is found on no other world."},
    {name: "Sandworms", first: 1, desc: "Shai-Hulud to the Fremen: giant worms of the open desert, drawn to rhythm, which the Fremen ride with maker hooks.",
     more: [[3, "Sandtrout, their young form, can be used as a living skin."], [4, "Leto II becomes one."], [5, "The priesthood worships them as the Divided God."]]},
    {name: "Sandtrout", first: 1, desc: "The small first stage of the sandworm, which seals away water deep in the sand. The novel’s appendix ties them to Arrakis’s dryness."},
    {name: "Stillsuit", first: 1, desc: "The Fremen body suit that recovers the wearer’s water."},
    {name: "Sietch", first: 1, desc: "A hidden cave community of the Fremen, where water is hoarded in secret reservoirs."},
    {name: "The Butlerian Jihad", first: 1, desc: "The crusade, ten thousand years before, that destroyed thinking machines and forbade making a machine in the likeness of a human mind."},
    {name: "Kwisatz Haderach", first: 1, desc: "The male Bene Gesserit who would see past and future, goal of the Sisterhood’s breeding plan."},
    {name: "The Water of Life", first: 1, desc: "The poisonous bile of a drowned sandworm. A Reverend Mother changes it within her body, and so gains her ancestors’ memories."},
    {name: "Gom jabbar", first: 1, desc: "The poisoned needle of the Bene Gesserit test of humanity."},
    {name: "Shields and lasguns", first: 1, desc: "Personal Holtzman shields stop fast objects, so fighters use blades. A lasgun beam hitting a shield causes a nuclear-scale blast."},
    {name: "The Great Convention", first: 1, desc: "The law that forbids using atomics against people. Paul turns the Atreides atomics on the Shield Wall instead."},
    {name: "Prescience", first: 1, desc: "Seeing the future through the spice. In Herbert, it binds whoever sees as much as it frees them."},
    {name: "The jihad", first: 1, desc: "The holy war in Paul’s name that he foresees and dreads.", more: [[2, "It costs some sixty billion lives."]]},
    {name: "Ghola", first: 2, desc: "A person regrown by the Tleilaxu from the cells of the dead."},
    {name: "Face Dancers", first: 2, desc: "Tleilaxu shape-shifters who can take on any person’s look."},
    {name: "The Golden Path", first: 3, desc: "The future Leto II alone is willing to follow: a long tyranny that saves humanity from extinction.",
     more: [[4, "Its last part is humans hidden from prescience, of whom Siona is the first."]]},
    {name: "The Scattering", first: 4, desc: "The great outflow of humanity into the universe after Leto II’s death.", more: [[5, "Its descendants now return, the Honored Matres among them."]]},
    {name: "No-ships and no-globes", first: 5, desc: "Ixian-made ships and shelters that hide what is inside them from prescient sight, making Guild-free travel and hiding possible."},
    {name: "Other Memory", first: 5, desc: "The Bene Gesserit name for the memories of all their ancestors that a Reverend Mother carries."},
    {name: "Imprinting", first: 5, desc: "Bene Gesserit sexual conditioning, used to bind men to the Sisterhood."},
    {name: "Beyond Frank Herbert’s six novels", first: 1, desc: "This atlas follows only Frank Herbert’s six novels. The Dune Encyclopedia (1984) and the prequels and sequels by Brian Herbert and Kevin J. Anderson (from 1999) add more history and worlds, but nothing from them is used here except, where labelled, a few star identifications for worlds Frank Herbert gave no star."}
   ]}
  ],

/* ======================================================================== galaxy */
  galaxy: {
    sol: [0, 27.14],
    mirrorGal: false,
    seed: 1965,
    home: {at: {sol: [-3.5, 0, 0]}, dist: 50, pitch: .7, dur: 2200},
    flyDist: 14,
    labelFar: {major: 1500, minor: 260},
    labels: [
      {text: "The Imperium", at: {sol: [0, 0, 0]}, off: [0, 9, 0], min: 70, max: 1500, big: true},
      {text: "Canopus", at: {world: "arrakis"}, off: [0, 2.2, 0], min: 10, max: 160}
    ],
    territories: [{name: "The Imperium", at: [0, 27.14], r: 1.6, c: "#d08a3a", a: .1}],
    glows: [{at: {world: "arrakis"}, scale: 6, opacity: .5, color: "#f0b060", pulse: true}],
    link: {base: .32, gain: 1.1, curveMax: 6},
    links: [
     /* Book I */
     {id: "r1", path: ["caladan", "arrakis"], book: 1},
     {id: "r1emp", pairs: [["kaitain", "arrakis"]], color: "#e8d090", book: 1, opacity: {all: .4, cur: .7, past: .18}},
     {id: "zensunni", path: ["poritrin", "salusa", "belategeuse", "harmonthep", "arrakis"], color: "#b8a888", book: 1, opacity: {all: .3, cur: .45, past: .15}, dash: 1.2, speed: .25},
     {id: "s1", pairs: [["giedi", "arrakis"], ["salusa", "arrakis"]], color: "#ff4a36", book: 1, opacity: {all: .4, cur: .9, past: .3}, speed: .8, dash: 3},
     /* Book II */
     {id: "r2", pairs: [["wallach", "arrakis"], ["tleilax", "arrakis"]], book: 2},
     {id: "s2", pairs: [["arrakis", "naraj"]], color: "#ff4a36", book: 2, opacity: {all: .4, cur: .9, past: .3}, speed: .8, dash: 3},
     /* Book III */
     {id: "r3", path: ["caladan", "arrakis", "salusa", "arrakis"], book: 3},
     /* Book IV */
     {id: "r4", pairs: [["ix", "arrakis"], ["tleilax", "arrakis"]], book: 4},
     {id: "scatter", pairs: [["arrakis", SCATTER], ["arrakis", SCATTER2], ["arrakis", SCATTER3]], color: "#e8c8a0", book: 4, opacity: {all: .3, cur: .6, past: .2}, speed: .3, dash: 1.4, curve: .05},
     /* Book V */
     {id: "r5", pairs: [["lernaeus", "giedi"], ["tleilax", "giedi"], ["chapterhouse", "arrakis"], ["giedi", "arrakis"], ["arrakis", "chapterhouse"]], book: 5},
     {id: "s5", pairs: [[SCATTER, "giedi"], [SCATTER, "arrakis"]], color: "#ff4a36", book: 5, opacity: {all: .4, cur: .9, past: .3}, speed: .8, dash: 3},
     /* Book VI */
     {id: "r6", pairs: [["lampadas", "giedi"], ["chapterhouse", "giedi"], ["chapterhouse", "junction"], ["chapterhouse", BEYOND]], book: 6},
     {id: "s6", pairs: [[SCATTER, "lampadas"], [SCATTER, "tleilax"], [SCATTER, "wallach"], [SCATTER, "junction"]], color: "#ff4a36", book: 6, opacity: {all: .4, cur: .9, past: .3}, speed: .8, dash: 3}
    ]
  },

  legend: [
    {bookColors: true, label: "Journeys", allLabel: "Journeys, by book"},
    {color: "#ff4a36", label: "Hostile campaigns"},
    {color: "#b8a888", label: "Zensunni migration", books: [1]},
    {color: "#e8c8a0", label: "The Scattering", book: 4}
  ]
};
})();

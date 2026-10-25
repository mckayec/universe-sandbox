/* Template atlas pack. Copy to packs/<id>.js (for example packs/my-series.js), change BOTH the
   ATLAS_PACKS key and `id` below from "template" to that same <id>, fill in, and add
   {id: "<id>", ...} to packs/registry.js and to src/universe-packs.ts (a test keeps the two in sync).
   This file itself is never loaded: names starting with "_" are skipped. Full schema: docs/PACK_FORMAT.md.
   Sources: list every source here (wiki pages, appendices, maps, author statements).
   Coordinates: map:[x,y] in thousands of light-years, galactic core at [0,0], Sol at galaxy.sol.
   Mark any placement you estimated with est:true and an "estimated" comment. */
(window.ATLAS_PACKS = window.ATLAS_PACKS || {})["template"] = {
  id: "template",
  meta: {
    title: "The Template Atlas",
    series: "The Template Series",
    author: "Author Name",
    years: "2001–2010",
    tagline: "Worlds, wars &amp; the <b>thing at the end</b>",
    splash: "One sentence that sets the scene, in your own words.",
    credits: "Fan-made atlas of Author Name’s <i>Template Series</i>. Placements marked estimated are ours.",
    srcnote: "A fan-made atlas. Surfaces are generated interpretations."
  },

  /* optional: omit theme to get the gold Sun Eater look */
  theme: {
    accent: "#4f78e0", accentHi: "#9db8ff", accentLo: "#2a3f80",
    line: "rgba(157,184,255,.18)", lineStrong: "rgba(157,184,255,.5)",
    selRing: "#9db8ff", hoverRing: "#d7dde8"
  },

  books: {
    1: {n: "I", title: "Book One", y: 2001, c: "#6f93ff"},
    2: {n: "II", title: "Book Two", y: 2004, c: "#c94a38", ink: "#fff"}
  },
  spoilers: {mode: "cumulative"},          /* or "single" */

  ui: {
    indexTitle: "Worlds of the Template",
    homeButton: "Known space",
    homeAction: "Fly to known space",
    go: {id: "capital", label: "Go to the Capital"}
  },

  intro: {
    text: "Two or three sentences introducing the setting, in your own words.",
    legend: [["Galaxy", "The Milky Way; positions are estimated from the books"],
             ["Bright points", "Worlds, coloured by their star"],
             ["Lines", "The main journey of each book"]]
  },

  groups: [
    {id: "core", name: "The Core Worlds", chip: {border: "rgba(157,200,255,.55)", color: "#bcd6ff"}},
    {id: "rim", name: "The Rim", chip: {border: "rgba(232,169,72,.55)", color: "#e8a948"}}
  ],

  worlds: [
    {id: "capital", name: "Capital", group: "core", books: [1, 2], major: true, status: "Imperial capital",
     star: {name: "Capital’s sun", col: "#fff1d6"},
     map: [-3.2, 24.5], est: true,            /* estimated: the books only say "near the core-ward edge" */
     blurb: "Two to four sentences describing the world and its role in the story.",
     short: "One line for the tooltip.",
     facts: [["Ruler", "Someone"], ["People", "About 2 billion"]],
     gfx: {type: "city", sea: .45, pal: ["#0a1d3a", "#2a5f86", "#4a4a44", "#6a6a60", "#8a8478", "#f0f0ec"],
           clouds: .35, atmo: "#7aa4ff", lights: .9,
           feat: [{k: "continent", at: [20, 10], r: 30, s: .2},
                  {k: "range", from: [30, -5], to: [10, 25], w: 2.5, s: .25}]},
     hero: "palace",
     sites: [
       {id: "palace", name: "The Palace", lat: 22, lon: 12, books: [1], desc: "Where the story begins."},
       {id: "port", name: "The Port", lat: 14, lon: 4, books: [1, 2], sea: true, desc: "A harbour city."}
     ]},
    {id: "frontier", name: "Frontier", group: "rim", books: [2], first: 2, status: "Frontier world",
     star: {name: "Unnamed red dwarf", col: "#ffb070"},
     map: [12.0, 30.5], est: true,            /* estimated */
     blurb: "A cold world at the edge of settled space.",
     gfx: {type: "ice", sea: .2, pal: ["#3a4a5a", "#5a6a7a", "#8a929a", "#a8b0b8", "#c8ccd0", "#f4f6f8"],
           clouds: .3, atmo: "#b8c8e0", atmoK: .6},
     moons: [{name: "Little Moon", size: .2, dist: 2.8}]}
  ],

  events: [
    {id: "e1", book: 1, world: "capital", site: "palace", title: "The story begins", text: "One or two sentences."},
    {id: "e2", book: 2, world: "frontier", title: "Flight to the rim", text: "One or two sentences."}
  ],

  codex: [
    {id: "factions", title: "Powers", list: [{name: "The Empire", first: 1, desc: "Short description."}]},
    {id: "people", title: "People", list: [{name: "The Hero", role: "Protagonist", books: [1, 2], desc: "Short description.",
                                           more: [[2, "A later development, hidden until book II."]]}]},
    {id: "ideas", title: "Ideas", list: [{name: "The Drive", first: 1, desc: "Short description."}]}
  ],

  galaxy: {
    sol: [0, 26.5],
    home: {at: {map: [3, 27]}, dist: 160, pitch: .8, dur: 2200},
    labels: [{text: "The Rim", at: {map: [12, 31]}, off: [0, 4, 0], min: 60, max: 1500}],
    territories: [{name: "The Empire", at: [0, 25], r: 6, c: "#6f93ff", a: .12}],
    links: [
      /* a link may only pass through worlds that have appeared by its book (frontier first appears in book 2) */
      {id: "journey2", path: ["capital", "frontier"], book: 2},
      {id: "journey2b", path: ["frontier", "capital"], book: 2}
    ]
  },

  legend: [
    {bookColors: true, label: "The hero’s road", allLabel: "The hero’s road, by book"},
    {color: "rgba(111,147,255,.6)", label: "The Empire"}
  ]
};

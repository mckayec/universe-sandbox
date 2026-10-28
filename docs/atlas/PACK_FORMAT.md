STATUS: schema ready

# Atlas pack format (galactic engine, v1)

One shared engine (`engine.js` + `engine.css`) draws every galactic-scale atlas. A series is added by
writing one **data pack**: a plain JavaScript file in `packs/<id>.js` plus one line in `packs/registry.js`.
Open `index.html?pack=<id>` to view it. No build step, no other files.

The engine is a generalisation of the Sun Eater Atlas and the Hyperion Atlas. `packs/sun-eater.js`
and `packs/hyperion.js` are full working examples; `packs/_template.js` is a small starting point.

Contents: 1 file layout · 2 coordinates · 3 top level · 4 meta · 5 theme · 6 books & spoilers ·
7 ui strings · 8 intro · 9 groups · 10 worlds · 11 world surfaces (`gfx`, features, sites) ·
12 events · 13 codex · 14 galaxy (layout, labels, territories, glows, links) · 15 legend ·
16 hooks · 17 minimum pack · 18 content rules · 19 realms · 20 layers & timeline (Track A) ·
21 family tree (Track A).

---------------------------------------------------------------------------------------------------

## 1. File layout and registration

```js
/* packs/my-series.js */
(window.ATLAS_PACKS = window.ATLAS_PACKS || {})["my-series"] = {
  id: "my-series",
  meta: { ... }, books: { ... }, worlds: [ ... ], events: [ ... ], ...
};
```

* The key in `ATLAS_PACKS` and `id` must match the file name and the registry entry. Use lowercase
  letters, digits and `-` only.
* The pack is ordinary JS, so you may compute values (helper functions, `map()` over arrays), but it
  must not touch the DOM or THREE. Everything must be inline: no fetches, no images, no external URLs.
* Register it in `packs/registry.js` (order = order in the chooser) **and** add a matching `atlasPack(...)`
  entry with `atlasPath: 'atlas/?pack=<id>'` to `src/universe-packs.ts`, so it shows in the sandbox's Universe
  library. `tests/atlas-registry.test.ts` fails until both lists agree.
* Files starting with `_` (such as `_template.js`) are templates and are never loaded.
* This document lives in the repository (`docs/atlas/PACK_FORMAT.md`) and is not published with the site.

```js
{id:"my-series", title:"The My Series Atlas", blurb:"One line for the chooser.", accent:"#9db8ff"},
```

Unknown fields are ignored. Every field marked *optional* may be left out; the engine falls back to
the default shown. A pack with only `id`, `meta.title`, `books` and `worlds` loads (see section 17).

---------------------------------------------------------------------------------------------------

## 2. Coordinates and units (read this first)

### 2.1 Scene units
* **1 scene unit = 100 light-years.** The galactic centre is at the origin, the disc lies in the X-Z
  plane, +Y is "up" out of the disc. The drawn Milky Way is about 1,000 units (100,000 ly) across.
* **Sol** sits at `galaxy.sol` (section 14). Default `[0, 27.14]` (map kly), i.e. scene `(0, 0.2, 271.4)`.

### 2.2 Map coordinates `map:[x, y, h]` (kly) — the main way to place things
* `x`, `y` are **thousands of light-years (kly)** on a flat map of the galaxy seen from the north
  galactic pole: core at `[0,0]`. `h` (optional, kly) is height above the disc plane.
* Conversion used by the engine: `scene = (x*10, h*10 + 0.2, y*10)`.
* Convention used by both shipped packs: **Sol / Old Earth lies on the +y axis** (`[0, 26.5]` to
  `[0, 27.14]`), **+x is "map east"**, and the core is towards −y from Sol. Keep Sol at `x = 0` so
  that real-sky directions (2.3) point the right way.
* The spiral arms are drawn from `galaxy.arms` (14.2); place worlds by eye against the arms, or from a
  published map scaled so that Sol is ~26–27 kly from the core.

### 2.3 Real galactic coordinates `gal:{l, b, ly}` (true distance, linear)
* `l`, `b` in degrees (galactic longitude/latitude), `ly` = distance from Sol in light-years.
* Engine: `dir = (cos b·sin l, sin b, −cos b·cos l)`; if `galaxy.mirrorGal` is true, `dir.x = −dir.x`;
  `position = Sol + dir · ly/100` (scene units). So l = 0 points from Sol to the galactic centre.
* Equivalent map coordinates (with Sol at `[sx, sy]`, `m = −1` if `mirrorGal` else `+1`):
  `x = sx + m·ly·cos b·sin l / 1000`, `y = sy − ly·cos b·cos l / 1000`, `h = ly·sin b / 1000`.
* Use this for real stars when true distances matter at galaxy scale (Deneb, the Pleiades, LMC worlds).
  Stars a few dozen ly away will sit almost on top of Sol at this scale — use 2.4 for those.
* `mirrorGal` exists only to reproduce the Sun Eater book map (which is mirrored). **New packs should
  leave it `false`.** It is applied to every l/b direction (2.3, 2.4, and `lb` points) but never to
  the drawn Magellanic Clouds and Andromeda, which are always at their true positions.

### 2.4 Compressed local space (log radius) — for real nearby stars and "human space"
* `star:{ra, dec, ly}` (RA/Dec in **degrees**, J2000) or `dir:{l, b}` plus `ly`: the world is put in the
  true direction from Sol at a **display radius** `R = 3·ln(1 + ly/6)` scene units, so 6 ly and
  6,000 ly are both readable around Sol (Hyperion uses this for the whole Web).
* RA in hours → multiply by 15. Distance used: `star.ly`, else world `ly`, else
  `galaxy.groupLy[group]`, else `galaxy.defaultLy` (default 300).

### 2.5 Other placements
* `at:{of:"otherWorldId", spread:1.2}` — near another world: a deterministic random offset of up to
  `±spread/2` scene units (x, z) and `±spread/4` (y). For moons, twin planets, habitats in one system.
* `pos3:[x, y, z]` — raw scene units. For places outside normal space (shown far above the disc).
* No placement at all: if `galaxy.sectors[group]` exists the world gets a seeded random direction in
  that sector at the compressed radius of its `ly` (2.4); otherwise it sits at Sol.

Priority when several are present: `pos3` > `map` > `gal` > `at` > `star.ra/dec` > `dir` > sector > Sol.

### 2.6 Surface coordinates
`lat` −90..90 (north +), `lon` −180..180 (east +), degrees, on an equirectangular map. Sites, surface
features and `rel` offsets all use these.

---------------------------------------------------------------------------------------------------

## 3. Top level

| field | type | req | notes |
|---|---|---|---|
| `id` | string | yes | matches file and registry |
| `meta` | object | yes (`title`) | section 4 |
| `theme` | object | no | colours, fonts, sigil (5) |
| `books` | object | yes | `{1:{...},2:{...}}` (6) |
| `spoilers` | object | no | `{mode:"cumulative"}` default (6) |
| `ui` | object | no | labels and strings (7) |
| `intro` | object | no | About panel (8) |
| `groups` | array | no | index sections, in order (9). Default: one group per distinct `world.group` |
| `worlds` | array | yes | at least one (10) |
| `events` | array | no | the Chronicle (12) |
| `codex` | array | no | codex tabs (13). Empty → Codex button hidden |
| `galaxy` | object | no | layout, labels, links (14) |
| `legend` | array/function | no | chronicle-bar legend (15) |
| `hooks` | object | no | optional functions (16) |

---------------------------------------------------------------------------------------------------

## 4. `meta`

| field | type | default | used for |
|---|---|---|---|
| `title` | string | — | `<title>`, header and splash (shown upper-case), mobile sheet title |
| `series` | string | `title` | heading of the About panel ("The Sun Eater") |
| `author` | string | "" | About eyebrow: `author · years` |
| `years` | string | "" | e.g. `"2018–2025"` |
| `tagline` | HTML | "" | small line under the header title; `<b>` shows in the accent red |
| `splash` | string | "" | one-sentence teaser on the loading screen |
| `credits` | HTML | "" | fan-made / attribution note at the right of the Chronicle bar (wide screens) |
| `publisher` | string | "the publishers" | used in the fan-work notice |
| `notice` | string | auto | overrides the fan-work notice shown after `credits` and at the foot of the About panel ("Unofficial fan project for personal, non-commercial use. *series* and related names are the property of *author* and *publisher*. Maps and positions are schematic reconstructions.") |
| `srcnote` | string | none | small source note at the bottom of the About panel |
| `canvasLabel` | string | auto | aria-label of the 3D canvas |
| `sources` | array of strings | — | not shown; put your citations here and in comments |

---------------------------------------------------------------------------------------------------

## 5. `theme` (all optional; defaults are the Sun Eater gold-on-black theme)

Colours are CSS colour strings. `*Rgb` fields are `"r,g,b"` triples (used inside `rgba()`).

| field | Sun Eater | Hyperion | role |
|---|---|---|---|
| `void` | `#060504` | `#04050b` | page background |
| `deep` | `#120e0a` | `#0a0d1a` | |
| `panel` | `rgba(16,12,9,.86)` | `rgba(9,12,24,.86)` | |
| `accent` | `#b8913e` | `#4f78e0` | selection borders |
| `accentHi` | `#e8cd8a` | `#9db8ff` | eyebrows, highlights |
| `accentLo` | `#5e4720` | `#2a3f80` | scrollbars, arrows |
| `chrome` | `#efe6d2` | `#d7dde8` | bright UI text |
| `ember` | `#c8352c` | `#e0472c` | tagline `<b>` |
| `amber` | `#e8a948` | `#e8a948` | |
| `text`/`muted`/`faint` | `#e6dfd2`/`#a89e8a`/`#6e6454` | `#d9deea`/`#8f98b0`/`#5d6680` | text tiers |
| `line`/`lineStrong` | `rgba(232,205,138,.16)`/`.46` | `rgba(157,184,255,.18)`/`.5` | hairlines |
| `chromeGrad` | gold gradient | silver gradient | CSS gradient for titles and primary buttons |
| `chromeStops` | `[[0,"#fff7e2"],[.45,"#e8cd8a"],[.68,"#9a7432"],[1,"#f4e2b2"]]` | silver | SVG gradient `url(#cg)` for the sigil |
| `fontDisplay` | `"Cinzel","Cormorant Garamond",Georgia,serif` | `"Cormorant SC",…` | big titles |
| `fontTitle`/`fontBody`/`fontHud` | Cormorant Garamond / Spectral / IBM Plex Mono | same | |
| `panelRgb`/`panelRgb2` | `22,17,12`/`9,7,5` | `14,18,36`/`6,8,16` | panel gradient |
| `insetRgb` | `255,236,200` | `200,215,255` | panel top highlight |
| `btnRgb` | `16,12,9` | `9,12,24` | button backgrounds |
| `ink` | `#0d0a06` | `#060812` | dark text on chrome |
| `glowRgb` | `232,170,80` | `110,150,255` | header sigil glow |
| `hiRgb` | `201,162,74` | `110,150,255` | hover/selected fills |
| `swRgb`/`pipRgb` | `232,205,138` | `160,190,255`/`130,170,255` | swatch and site-pip glows |
| `title`/`title2`/`title3` | `#f6efe2` ×3 | `#f2f5fb`/`#f0f3fa`/`#f1f4fb` | headings |
| `shadeRgb` | `8,6,5` | `5,7,14` | label/hint backgrounds |
| `tip1`/`tip2` | `#1e1610`/`#0a0806` | `#121831`/`#070912` | tooltip gradient |
| `voidRgb` | `6,5,4` | `4,5,11` | chronicle fade |
| `codexRgb` | `4,3,2` | `2,3,8` | codex backdrop |
| `splashGlow` | `#20150c` | `#0d1330` | loading screen glow |
| `brandSpacing` | `.12em` | `.16em` | header title letter-spacing |
| `selRing`/`hoverRing` | `#e8cd8a`/`#ece4d2` | `#9db8ff`/`#d7dde8` | galaxy selection rings |
| `sigil` | SVG markup | | inner markup of a 48×48 `viewBox` icon; may use `url(#cg)` |
| `splashSigil` | SVG markup | | splash version (default: `sigil`) |
| `splashSize` | `78` | `74` | splash sigil size in px |

Bundled fonts (offline, in `atlas/fonts/`): Cinzel, Cormorant Garamond, Cormorant SC, Spectral,
IBM Plex Mono. Any other family falls back to the next one in the stack.

---------------------------------------------------------------------------------------------------

## 6. `books` and spoiler gating

```js
books: {
  1: {n:"I", title:"Empire of Silence", y:2018, c:"#e0b85c"},
  2: {n:"II", title:"Howling Dark", y:2019, c:"#86a6ea", ink:"#fff"},
}
```
* Keys are the integers 1..N in reading order (1–12 books supported). `n` = short label on the book
  buttons and badges, `y` = year (button tooltip), `c` = book colour (badges, timeline, routes),
  `ink` = optional text colour on the badge (default `theme.ink`; use `"#fff"` on dark colours).
* Chooser "All" = book 0 = everything, with spoilers.
* The chosen book is remembered per pack in the visitor's browser (so a reload never jumps back to "All"),
  and the address keeps the view: `#book=3&world=arrakis&site=tabr&realm=cognitive&view=surface`. Such a
  link opens straight onto that place; descending to a surface adds a history entry so Back ascends.
* Any number of books works. On phones, packs with more than 7 books get the book buttons on their own
  full-width row so none are hidden.

`spoilers.mode` decides what picking book *k* does:

**`"cumulative"`** (default; Sun Eater) — "I am reading book k": everything first met after book k is
hidden.
* World shown iff `world.first <= k` (`first` defaults to the smallest entry of `books`, else 1).
  Hidden worlds vanish from the galaxy, index, labels and picking; the index notes how many are hidden.
  Worlds whose `books` does not include k are dimmed.
* Sites shown iff they have no `books` or `min(site.books) <= k`; sites not in book k are dimmed.
* Events shown iff `event.book <= k`; in the Chronicle later books are locked, earlier ones faded.
* World `eras` (10.3) apply for every era key `<= k`; with "All" the latest era applies.
* Book badges list only books `<= k`.
* Codex entries shown iff `first <= k` (`first` defaults to `min(books)`, else 1); each `more:[[book,
  text]]` addition is appended only once its book `<= k`.
* Links (14.6) and legend entries use their own `book` / `books` gating.

**`"single"`** (Hyperion) — "show me book k": nothing is hidden; things not in book k are dimmed.
* All worlds shown; those whose `books` lacks k are dimmed. All sites listed; those whose `books`
  lacks k are faded.
* Events: only those with `event.book === k` are listed per world; other books' events are dimmed
  in the Chronicle.
* Eras apply for keys `<= k`; with "All" the base text applies and the status reads `base → latest`.
* Codex unfiltered.

Optional fine-tuning: `spoilers.dimLabel` (opacity of off-book labels; 0.4 cumulative, 0.35 single)
and `spoilers.dimMarker` (0.2 / 0.15).

---------------------------------------------------------------------------------------------------

## 7. `ui` strings (all optional)

| field | default | where |
|---|---|---|
| `indexTitle` | `"Worlds of " + series` | eyebrow at the top of the world index |
| `homeButton` | `"Home"` | header button that flies to `galaxy.home` (SE "Empire") |
| `homeAction` | `"Fly to " + homeButton` | primary button in the About panel |
| `homeLink` | `homeButton` | secondary button in a world dossier |
| `homeCrumb` | `homeButton` | breadcrumb label when no world is selected |
| `galaxyCrumb` | `"Milky Way"` | first breadcrumb (the whole galaxy); change it when the series is not set in the Milky Way |
| `crumbGroups` | `true` | breadcrumb shows the world's group name; `false` → always `homeCrumb` |
| `go` | first major world | `{id:"delos", label:"Go to Delos"}` About-panel shortcut, or `false` |
| `bookLabel` | `"Reading"` in cumulative, none in single | small label before the book buttons |
| `allTitle` | `"All N books, with spoilers"` | tooltip of the "All" button |
| `booksAria` | `"The book you are reading through"` | |
| `chronTitle` | `"THE CHRONICLE"` | |
| `codexTitle` | `"CODEX"` | |
| `galaxyButton` | `"Galaxy"` | |
| `hints` | sensible text | `{galaxy, galaxyMob, world, worldMob}` one-line navigation hints |
| `showCredits` | `true` | show `meta.credits` in the Chronicle bar on wide screens |
| `wrapBooks` | auto | phones: `true` puts the book buttons on their own full-width row (automatic above 3 books); `false` never. On wider screens the engine moves the controls to a second header row by itself whenever they would not fit |
| `backHref` | `"../"` | the "← Gravity Lab" link in the header (relative, so it works under any subpath) |
| `backLabel` | `"Gravity Lab"` | its text |
| `evCount` | `""` | suffix after an index world's event count (Hyperion `" ev"`) |

---------------------------------------------------------------------------------------------------

## 8. `intro` (About panel, shown when nothing is selected)

```js
intro: {
  text: "Two or three sentences in your own words.",
  legend: [["Galaxy","What the galaxy shows"],["Bright points","Worlds, coloured by their star"], ...]
}
```
Both optional. In cumulative mode a "Reading through" block explaining the book buttons is added.

---------------------------------------------------------------------------------------------------

## 9. `groups` (index sections, in display order)

```js
groups: [
  {id:"orion", name:"Spur of Orion", chip:{border:"rgba(232,205,138,.5)", color:"#e8cd8a"}},
  {id:"outside", name:"Outside time", chip:{border:"rgba(184,140,236,.6)", color:"#d2b6f4"},
   labelFar:7000, flyDist:70},
  {id:"far", name:"The far reaches", crumb:{label:"The far reaches", ascendOnly:true}},
]
```
| field | notes |
|---|---|
| `id` | matches `world.group` |
| `name` | section heading, tooltip eyebrow, dossier eyebrow, breadcrumb |
| `chip` | `{border, color}` of the status chip in the dossier (default: theme line/muted) |
| `labelFar` | camera distance (scene units) beyond which this group's labels hide (default `galaxy.labelFar`) |
| `flyDist` | camera distance when flying to a world of this group (default `galaxy.flyDist`) |
| `eras` | `{book:{name}}`: the section name changes from that book on (like world eras), so a heading need not spoil |
| `crumb` | `{label, ascendOnly}` replaces the middle breadcrumb for this group; `ascendOnly` makes it only return from a surface instead of flying home |

Worlds whose group is not listed get an extra section at the end, named after the group id (capitalised).

---------------------------------------------------------------------------------------------------

## 10. `worlds`

```js
{id:"delos", name:"Delos", aka:["Old name"], group:"orion", books:[1,2,3], first:1, major:true,
 status:"Imperial world · Auriga Province", hero:"devilsrest",
 star:{name:"Delos’s pale sun", col:"#fff0d2"},
 map:[6.647, 29.354],             // or gal / star.ra+dec / dir+ly / at / pos3 (section 2)
 est:true,                        // placement estimated (shown in the distance line)
 blurb:"Two to four sentences.", short:"One line for the tooltip.",
 facts:[["Owner","House Kephalos"],["Known for","Uranium"]],
 gfx:{...}, sites:[...], eras:{...}, moons:[...], ring:{...}}
```

| field | type | req | notes |
|---|---|---|---|
| `id` | string | yes | unique; `[a-z0-9_-]` |
| `name` | string | yes | |
| `group` | string | yes | a `groups[].id` |
| `books` | number[] | yes | books where it appears (badges, dimming) |
| `first` | number | no | book where a reader first learns of it (cumulative gating). Default `min(books)` |
| `status` | string | no | chip text ("Imperial capital") |
| `blurb` | string | yes | dossier text |
| `short` | string | no | tooltip line (default: first sentence of `blurb`) |
| `aka` | string[] | no | alternative names |
| `major` | bool | no | bigger marker, label visible from further away |
| `star` | object | no | `{name, col, ra, dec, ly}`: star name for the facts list, `col` tints the galaxy marker, the sunlight and the sun sprite on the surface view (default `#fff6e4`) |
| placement | | yes* | one of `map`, `gal`, `at`, `star.ra/dec`, `dir`+`ly`, `pos3` (2). *Else sector or Sol |
| `ly` | number | no | distance from Sol, ly (compressed placement, distance text) |
| `est` | bool | no | placement is an estimate; says so in the distance line |
| `facts` | `[label, value][]` | no | facts list |
| `distText` | string | no | overrides the computed distance line |
| `hero` | site id | no | site turned to face the viewer on landing (default first site) |
| `view` | number | no | landing camera distance in planet radii (default 4.0, gas giants 4.8) |
| `gfx` | object | yes | surface recipe (11) |
| `sites` | array | no | named places (11.4) |
| `eras` | object | no | per-book changes (10.3) |
| `moons` | array | no | `{name, size (planet radii, default .18), dist (radii, default 2.4+1.1i), speed (default .05), gfx}`. Decorative only: moons cannot be landed on and carry no sites. A moon that matters in the story should be its own world placed with `at:{of:"planet", spread:.3}` (and can also appear in the parent's `moons` for looks) |
| `ring` | object | no | `{inner:1.4, outer:2.4, c1, c2, tilt (rad, default .35), seed}` radii in planet radii |
| `craft` | bool | no | a ship/station: diamond marker and swatch |
| `noSurface` | bool | no | a star or other body with nothing to land on: selectable in the galaxy, but no Descend button, no double-click descent and no surface bake. `gfx.type:"star"` implies it |
| `swarm` | bool | no | a drifting cloud of red motes around it in the galaxy (fleets, swarms) |
| any flag | | no | e.g. `web:true`, used by a link `network` (14.6) |

### 10.3 `eras` — the world changes later in the series
```js
eras:{ 7:{status:"Revealed: green and living", blurb:"…", gfx:{base:"earth", clouds:.44}} }
```
Keys are book numbers. Each entry may override `status`, `blurb`, `short`, `facts` (replaces the whole
list) and any `gfx` fields (merged over the base `gfx`). This is the intended mechanism for anything about a
world that changes or is revealed later: keep the base fields safe for the world's `first` book. Site
descriptions are not era-gated: give a later-revealed place its own site with a later `books`. Applied for every key `<= ` the selected book (see section 6 for "All").

---------------------------------------------------------------------------------------------------

## 11. World surfaces

Every world is landable. On descent the engine bakes a 512 px preview immediately, then the full map
(4096×2048 on desktop) in strips; past the baked resolution a live procedural detail layer adds
fractal coastlines and fine relief as you zoom in (always on, nothing to configure).

### 11.1 `gfx` fields
| field | default | notes |
|---|---|---|
| `type` | `"terran"` | `terran ocean archipelago desert forest ice gas city barren lava hive toxic dyson` |
| `pal` | earth-like | **6 colours**: `[deep water, shallow water, lowland, lowland 2, highland, peak/snow]`. For `gas` it is a 6-stop band ramp; `desert` ramps lowland→peak; `ice` uses `pal[0..2]` for open water and cracks |
| `sea` | .5 | sea level 0..1 (height field is ~0..1). 0 = no water, .7+ = mostly ocean |
| `freq` | 1.6 | continent size (lower = bigger landmasses) |
| `warp` | .6 | coastline swirl |
| `rough` | .6 | mountain strength |
| `bump` | 1 | normal-map strength |
| `ice` | 78 | latitude (deg) where polar ice begins (90 = none) |
| `moist` | 0 | −.5..+.5 shifts lowland towards `pal[3]` |
| `dune` | 9 | dune frequency (desert) |
| `bands` | 14 | band count (gas) |
| `clouds` | 0 | cloud cover 0..1 (0 = no cloud layer) |
| `cloudScale` | 2.2 | cloud feature size |
| `cloudCol` | `#ffffff` | |
| `cloudOp` | .95 | cloud opacity |
| `atmo` | `#6fa8ff` | rim/atmosphere colour |
| `atmoK` | 1 | atmosphere strength; 0 = airless (no halo) |
| `lights` | 0 | night-side city lights 0..1 (city/hive worlds glow more) |
| `lightCol` | `#ffc27a` | |
| `lava` | `#ff5a1a` | glow colour for `lava` and `dyson` |
| `amb` | .018 | ambient light on the night side |
| `wall` | 0 | 1 = a single thin glowing line across one face (Hyperion's Wall); rarely needed |
| `base` | none | `"earth"` = use the built-in real Earth landmask as the height base |
| `sw` | `pal[3]` | swatch colour in the index |
| `feat` | [] | hand-laid features, max **18** (11.2) |

### 11.2 `feat` — hand-laid continents and regions (optional)
Use these to make a world match a described or published map. All angles in degrees. At most **18**
entries are drawn; the engine warns in the console when a list is longer.

| `k` | fields | effect |
|---|---|---|
| `continent` | `at:[lat,lon]`, `r` (radius, default 5), `s` (height, default .3) | raises a landmass |
| `basin` | `at`, `r`, `s` | lowers a sea or basin |
| `peak` | `at`, `r`, `s` | a single mountain / volcano |
| `range` | `from:[lat,lon]`, `to:[lat,lon]`, `w` (half-width, default 3), `s` | a mountain chain along the great-circle arc |
| `river` | `from`, `to`, `w`, `s` | cuts a gorge / river valley (wiggles naturally) |
| `biome` | `at`, `r`, `s` (blend 0..1), `style`, `c` (colour) | paints a land region |

`style` for biomes: `grass forest rock flame farm snow` (texture pattern). `c` is the region colour.
Typical strengths: continents `s:.2`, ranges `.2–.3`, biomes `s:.9–1`, rivers `.35–.45`.
Tip: with `sea:.6+`, the noise makes mostly ocean and your continents decide where land is.

### 11.3 Built-in Earth
`gfx:{type:"terran", base:"earth", sea:.5}` draws Earth's real continents (sites at real lat/lon).

### 11.5 `gfx.map` — a drawn map instead of noise continents (high detail)
For worlds with a real map in the books, give the coastlines as vector data. The engine roughens each
outline with fractal detail, rasterises it into an 8192×4096 land/mountain/water texture (4096 on
phones) and uses that both for the baked globe and, up close, for crisp coastlines and rivers. Zoom
goes much closer on mapped worlds. Mapped worlds should use `type:"terran"` (or `"desert"`).
```js
gfx:{type:"terran", sea:.5, pal:[…], map:{
  rough:.5, mtn:.5, depth:3,                       // outline roughness, mountain height, ocean depth (all optional)
  land:[ [[lat,lon],…], … ],                       // polygons that are land; everything else is sea
  water:[ [[lat,lon],…] ],                         // lakes and inland seas cut out of the land
  ranges:[{line:[[lat,lon],…], w:1.6, s:1}],       // mountain ridges: width in degrees, strength
  rivers:[{line:[…], w:.12}, {line:[…], w:.05, c:"#9a3cff"}], // c = coloured line painted on the land, not water
  regions:[{poly:[[lat,lon],…], c:"#4f9a3a", s:.9}] // nation or biome colours on the land
}, feat:[]}
```
Points are `[lat, lon]` in degrees. Polygons should not cross ±180°; split them instead, or cover
the whole globe with `[[89.5,-180],[89.5,0],[89.5,180],[-89.5,180],[-89.5,0],[-89.5,-180]]`.
`feat` entries still apply on top (peaks, for example).

### 11.4 `sites` — named places on the surface
```js
sites:[
 {id:"keats", name:"Keats", lat:1.8, lon:13, books:[1,2], desc:"One to three sentences."},
 {id:"karch", name:"Karch", lat:12, lon:-40, books:[1], sea:true, desc:"An island city."},
 {id:"dock", name:"The Docks", rel:{to:"keats", dlat:2, dlon:-3}, books:[1], desc:"…"}
]
```
| field | notes |
|---|---|
| `id`, `name`, `desc` | required |
| `lat`, `lon` | degrees (2.6). Required unless `rel` |
| `rel` | `{to:siteId, dlat, dlon}` place relative to another site; offsets are multiplied by 0.32 (so `dlat:3` ≈ 1°) |
| `books` | books where the place matters (badges, gating). Omit = always shown |
| `sea` | true = may sit on water. Otherwise a site that falls in the sea is moved to the nearest land |
| `aka` | optional alternative name (not displayed yet) |
| `since`, `until` | book numbers: show the site only from book `since`, or only before book `until` (for worlds whose map changes in an era; with no book chosen, the first era shows) |
| `realm` | `"cognitive"` or `"spiritual"`: shown only in that realm (19) |

---------------------------------------------------------------------------------------------------

## 12. `events` (the Chronicle)

```js
{id:"e1", book:1, world:"delos", site:"devilsrest", title:"Short title", text:"Two sentences.", side:"Novella"}
```
`id` unique; `book` 1..N; `world` a world id; `site` optional site id (clicking the event lands there);
`side` optional note shown instead of the site name (side stories). Order in the array = order
within each book on the timeline.

---------------------------------------------------------------------------------------------------

## 13. `codex`

```js
codex: [
  {id:"factions", title:"Powers", list:[{name:"The Empire", first:1, desc:"…", more:[[5,"Later addition."]]}]},
  {id:"people", title:"People", list:[{name:"Hadrian Marlowe", role:"Narrator", books:[1,2,3], desc:"…"}]},
  {id:"ideas", title:"Ideas & beings", list:[...]}
]
```
Entry fields: `name` (req), `desc` (req), `role`, `books` (badges), `first` (gating, default
`min(books)` else 1), `more` (`[[book, text], …]` spoiler-gated additions).

### 13.1 Reference cards: places without a map point (optional)
For places with no sourced coordinates (Track A atlases), do not invent a pin: make each one a codex entry
with an `id`, in a tab of its own.

| field | notes |
|---|---|
| codex entry `id` | `[a-z0-9_-]`, unique across all tabs. Lets other items open this entry directly |
| world `refPlaces` | a codex tab id. The world's details panel adds a "Places without a map point" section with a button that opens that tab (`ui.refPlacesTitle` / `ui.refPlacesNote` rename the heading and note) |
| event `ref` | a codex entry id, for an event with no anchored `site`. The Chronicle shows the card's name with "no map point", and the open event gets a "Reference card" button that opens the codex at that entry, highlighted |

The validator rejects a `ref` or `refPlaces` that points nowhere, duplicate entry ids, and (as before) any site
without numeric `lat`/`lon`, so a missing coordinate can never fall back to 0,0.

---------------------------------------------------------------------------------------------------

## 14. `galaxy`

All optional. Distances are scene units (100 ly) unless marked kly.

### 14.1 Frame
| field | default | notes |
|---|---|---|
| `sol` | `[0, 27.14]` | Sol in map kly (2.2) |
| `mirrorGal` | `false` | see 2.3 |
| `seed` | 1977 | star-field seed |
| `sectors` | none | `{group:{l, dl, b, db}}` direction box (deg) for worlds without placement |
| `groupLy` | none | `{group: ly}` default distance per group for compressed placement |
| `defaultLy` | 300 | |

### 14.2 Arms and spur
```js
arms:[{a:-4.955, name:"Norma Arm"}, {a:-6.526, name:"Centaurus Arm"}, ...],  // default: 4 arms, Hyperion layout
pitch:12.5,            // arm pitch angle, degrees
spur:{r:27.1, span:.8, n:5500}   // optional short bright spur through radius r (kly), centred on the +y axis
```
Each arm is a logarithmic spiral: at scene radius `r`, angle `θ = a + ln(r/40)/tan(pitch)`, point
`(sin θ·r, 0, cos θ·r)`. So `a` is the arm's angle (radians, measured from +z towards +x) at
r = 40 units (4 kly). Arms are drawn from 4.2 to 47 kly.

### 14.3 Camera
| field | default | notes |
|---|---|---|
| `home` | `{at:{sol:[0,0,0]}, dist:58, pitch:.62, dur:2000}` | view the header "home" button flies to (and the opening view) |
| `homeMob` | none | fields merged over `home` on phones (narrow screens usually need a larger `dist` or a higher `pitch`) |
| `overview` | `{at:{xyz:[0,0,40]}, dist:1100, pitch:.95, dur:2200}` | "Galaxy" button |
| `flyDist` | 24 | camera distance when a world is selected |
| `flyPitch` | .5 | |
| `labelFar` | `{major:1500, minor:560}` | label hide distances (scene units) |

### 14.4 Point specs (used by labels, glows, link endpoints)
A point is a world id string, or an object with one of:
`{world:"id"}` · `{map:[x,y,h]}` (kly) · `{xyz:[x,y,z]}` (scene) · `{sol:[dx,dy,dz]}` (scene offset
from Sol) · `{gal:[l,b,ly]}` (2.3, linear) · `{lb:[l,b], ly:N}` (2.4, compressed) ·
`{sat:"lmc"|"smc"|"andromeda"|"core"}` · `{arm:"Arm name" or index, r:kly}`; plus optional
`off:[dx,dy,dz]` added in scene units.

### 14.5 Labels, territories, glows
```js
labels:[{text:"Veil of Marinus", at:{map:[10.6,10.2]}, off:[0,4,0], min:70, max:1500, big:false}],
coreLabels:true,   // the built-in "Galactic core", "Large/Small Magellanic Cloud" labels
territories:[{name:"Sollan Empire", at:[1,24], r:15, c:"#c9a24a", a:.12, sx:1.5, sy:1, h:0}],
glows:[{at:{map:[17.5,1.5]}, scale:26, opacity:.5, color:"red", pulse:true}],
swarm:{n:220, spread:4.5}
```
* Labels, territories and glows accept optional spoiler gating: `book` (or `first`) = shown only from that book on,
  `books:[..]` = shown only in those books. "All" always shows them. (Same rule in both spoiler modes.)
* Labels are faint upper-case region names visible while the camera is between `min` and `max`
  (scene units) from the point. `big` = brighter, larger. Use `text` = arm name with
  `at:{arm:"…", r:30}` to label arms.
* Territories: soft additive discs on the disc plane. `at` map kly, `r` radius kly, `c` colour,
  `a` opacity (.1–.2), `sx`/`sy` stretch, `h` height kly. (`name` is not drawn: add a label.)
* Glows: pulsing beacons. `color`: `"white"`, `"red"` or a CSS colour.
* `swarm`: size of the mote clouds around `swarm:true` worlds (default `{n:160, spread:.7}`; spread in scene units, so use ~4 for a galaxy-wide map).

### 14.5b Local field stars
`localField` controls the decorative cloud of faint stars around Sol (3,000 points, gaussian, ~14 units):
`false` removes it; `{density:.5}` thins it; `{spread:14}` sizes it; `{at:<point>}` centres it elsewhere;
`{clear:7.5}` empties a sphere of that radius (scene units) around its centre, e.g. to keep an enlarged
solar-system orrery clean. Default: the full cloud around Sol.

### 14.6 Links (animated lines)
```js
links:[
 {id:"r1", path:["delos","emesh"], color:"#e0b85c", book:1},                 // a route, progressive
 {id:"web", network:{flag:"web", hub:"tc2", nearest:2}, color:"#a9c6ff", books:[1,2],
  opacity:{all:.4, cur:.65}, speed:.35, dash:1.2, curve:.06},
 {id:"raids1", pairs:[[{map:[17.5,1.5]},"cressgard"],[{map:[17.5,1.5]},"caishen"]], color:"#ff4a36", book:1,
  opacity:{all:.4, cur:.85, past:.35}, speed:.8, dash:3, curve:.08}
]
```
| field | default | notes |
|---|---|---|
| `id` | required | unique |
| geometry | required | one of `path` (world ids, consecutive pairs), `pairs` (`[[point, point], …]`), `network:{flag, hub, nearest}` (links every world with `world[flag]` to its `nearest` neighbours and to `hub`) |
| `color` | book colour | CSS colour; omit with `book` set to use that book's colour |
| `book` | none | progressive: hidden before book k, full in book k, faint (`past`) after |
| `books` | none | shown only while one of these books (or All) is selected |
| `opacity` | `{all:.6, cur:1, past:.22}` | with no `book`/`books` the link always uses `all`/`cur` |
| `speed` / `dash` | .45 / 2.2 | pulse speed and pulses per segment |
| `first` | none | extra gate: hidden while the selected book is earlier than this (any link type) |
| `curve` | .13 | arc height as a fraction of length (0 = straight), capped at `galaxy.link.curveMax` |
| `label` | none | descriptive only (not drawn); use `legend` to explain lines |

In cumulative mode a `network` link is split by edge: each edge appears from the later `first` of its two
worlds, so it never points at a world the reader has not met (`network:{…, gate:false}` turns this off).

`galaxy.link:{base:.28, gain:1, curveMax:2.4}` tunes all lines (Sun Eater: `{base:.62, gain:1.5,
curveMax:90}` for brighter lines and tall arcs across the whole galaxy).

---------------------------------------------------------------------------------------------------

## 15. `legend` (small key in the Chronicle bar; desktop only)

Array of items, each one of:
* `{color:"#ff4a36", label:"Cielcin raids"}` — always shown
* `{color, label, books:[1,2]}` — shown with "All" or one of these books
* `{color, label, book:3}` — shown with "All" or book ≥ 3
* `{bookColors:true, label:"Hadrian’s road", allLabel:"Hadrian’s road, by book"}` — a swatch in the
  selected book's colour labelled `label · Book title`, or a gradient of all book colours with "All".

It may also be a function `(book, api) => [[cssColor, label], …]`.

---------------------------------------------------------------------------------------------------

## 16. `hooks` (optional functions)
* `distText(world, api)` → string: replaces the computed distance line. `api` has `worldBy`, `sol`
  (THREE.Vector3), `state` (`{book, sel, view}`), `books`.
  Default: `pos3` → "Not in our time or space"; `gal` → "About N light-years from Sol (real star)";
  `star.ly` → "N light-years from Sol (real star)"; `ly` → "About N light-years from Sol (placement
  estimated)"; otherwise the straight-line distance from Sol, plus "· position estimated" if `est`.

---------------------------------------------------------------------------------------------------

## 17. Minimum pack

```js
(window.ATLAS_PACKS = window.ATLAS_PACKS || {})["mini"] = {
  id:"mini", meta:{title:"Mini Atlas"},
  books:{1:{n:"I", title:"Book One", y:2000}},
  worlds:[{id:"home", name:"Home", group:"core", books:[1], map:[0,26], blurb:"A world.",
           gfx:{type:"terran"}}]
};
```
Everything else falls back to defaults. Missing books colours get a default palette.

## 18. Content rules (from the brief)
* Describe the books in your own words: no quoted passages, lyrics, poems, cover art or official art.
* Cite sources in comments (and `meta.sources`). Mark estimated placements with `est:true` and a
  comment `/* estimated */`; never invent facts.
* Keep the pack self-contained (no network requests). Sizes: aim for 30–60 worlds, 40–80 events.

---------------------------------------------------------------------------------------------------

## 19. `realms` — Physical, Cognitive and Spiritual views of the same space (optional)
Adds a three-way switch above the Chronicle. The realms are not separate places: each is a different
view of the same worlds. Worlds move smoothly between their positions in each view.
```js
realms:{
  center:{sol:[0,0,0]},                                // point the Cognitive view compresses toward
  physical:{label:"Physical", tip:"…"},
  cognitive:{label:"Cognitive", first:4, title:"…", text:"…", unknown:"…",
    compress:.36, compressInner:.8, zoom:.6, emberSpread:9,   // how much empty space collapses
    look:{style:"unsea", c1:"#1e1a2c", c2:"#5a5088", c3:"#0e0c14"},  // default subastral look
    subastrals:[{world:"roshar", name:"Shadesmar", color:"rgba(…)", r:1.6, first:4}],
    perps:[{world:"roshar", first:5, color:"rgba(…)"}]},      // beams where the realms touch
  spiritual:{label:"Spiritual", first:7, title:"…", text:"…", radius:13, lift:1.5, pull:.6,
    coreLabel:"…", coreFirst:7, color:"#f0d890",
    shards:[{id:"honor", name:"Honor", color:"#9cc4ff", first:4, major:true}]}
}
```
* Groups take `anchor` (the world they compress around) and `spirit:[shardId,…]` (threads in the
  Spiritual view). A world can add its own `spirit`, or `realmAnchor` to sit by another world.
* A world's `realms.cognitive` = `{name, style, c1, c2, c3, blurb}` sets its look and dossier card.
  Styles: `beads` (bead ocean over the land, obsidian over the seas), `mist`, `plasma`, `paint`, `unsea`.
* Worlds, sites, labels, glows and links accept `realm:"cognitive"` (only there) or
  `realms:["physical","cognitive"]`. `first` gates each realm behind a book.

---------------------------------------------------------------------------------------------------

## 20. Layers, timeline and Earth start (Track A: Earth-historical atlases, optional)

Helpers live in `layers.js` (loaded by `index.html` before `engine.js`); `tests/fixtures/track-a-demo.js`
is a small working example with placeholder data. None of this changes packs that do not use it.

### 20.1 `layers` — switchable content layers
```js
layers:[
  {id:"ot", name:"Old Testament", short:"OT", c:"#d9b45a", tip:"Hover text"},
  {id:"bom", name:"Book of Mormon", short:"BoM", c:"#7fa8e8"},
  {id:"models", name:"Geography models", c:"#8cc49a", on:false},   // starts switched off
]
```
* A bar of toggle buttons appears above the Chronicle (top of the screen on phones). Every layer on =
  "all combined". The last layer that is on cannot be switched off.
* Worlds, sites, events and `galaxy.links` take `layers:["ot","nt"]` (or `layer:"ot"`). An item is shown
  when **any** of its layers is on; an item with no layers is always shown.
* Layers combine with book gating (section 6): an item must pass both.
* The address keeps the choice: `#layers=ot,bom` (left out when every layer is on).

### 20.2 `timeline` — a year-range filter
```js
timeline:{min:-2200, max:2000, step:10, style:"BC/AD", label:"Years",
  eras:[{name:"Patriarchs", from:-2100, to:-1700}, {name:"Restoration", from:1820, to:1847}]}
```
* Years are historical: **negative = BC/BCE, positive = AD/CE, there is no year 0** (1 BC is `-1`,
  AD 1 is `1`). The validator rejects `when` values of 0.
* `min`/`max` default to the earliest and latest `when` in the pack; `step` (default 1) is the slider
  step in years; `style` is `"BC/AD"` (default: "1446 BC", "AD 30", "1830") or `"BCE/CE"`.
* `eras` names are shown beside the selected range (descriptive only).
* Worlds, sites, events and links take `when:1830` or `when:[-1446,-1406]`, and `approx:true` to print
  "c.". An item is shown when its span overlaps the selected range; items with no `when` always show.
* The bar is a two-handle slider plus an "All years" reset. The address keeps it: `#yr=-1500_-1000`.
* Dates appear next to places and events in the details panel, with the item's layer swatches.

### 20.3 Place details for Earth-historical sites
| field | notes |
|---|---|
| `modern` | modern name, shown as "Today: …" when the place is open (`ui.modernLabel` renames "Today") |
| `notes` | `[{k:"text"|"tradition"|"scholarship"|…, t:"…", ref:"Gen. 12:1"}]`: labelled paragraphs shown when the place is open, so what the text says, what tradition holds and what scholars say stay visibly separate (RESEARCH_TEMPLATE §8). Labels: "The text", "Tradition", "Scholarship"; rename or add kinds with `ui.noteLabels:{text:"Scripture"}` |

Use real `lat`/`lon` with `gfx:{type:"terran", base:"earth"}` (11.3). For places whose location is
unknown or disputed, do not give coordinates as fact: leave them out, or put each proposal in its own
layer (e.g. one layer per geography model, off by default) with a note saying it is a proposal.

### 20.4 `start` — open on a world instead of the galaxy
`start:{world:"earth", view:"surface", site:"jerusalem"}` (`view` and `site` optional). Used only when the
address names no world; a link with `#world=…` still wins.

---------------------------------------------------------------------------------------------------

## 21. `tree` — a branching "family tree" of traditions (Track A, optional)

Adds a button to the header (label `tree.button`, default "Tree") that opens a full-window chart: years run
left to right, each tradition is a bar from the year it began, and a curved branch joins it to the tradition
it came from at that year. Built for the Abrahamic divergence atlas, usable by any pack. The code is in
`tree.js` (loaded by `index.html` after `layers.js`); `tests/fixtures/track-a-demo.js` has a working example.

```js
tree:{
  title:"Family tree",                 // dialog title (default "Family tree")
  button:"Tree",                       // header button label
  intro:"One or two sentences shown before anything is picked.",
  nodes:[
    {id:"judaism", name:"Judaism", when:-1200, ongoing:true, approx:true,
     layers:["abr"], c:"#d9b45a", world:"earth", site:"jerusalem",
     blurb:"Short description in your own words.",
     notes:[{k:"tradition", t:"…"}, {k:"scholarship", t:"…", ref:"…"}]},
    {id:"christianity", name:"Christianity", parent:"judaism", when:30, ongoing:true, approx:true,
     sites:["jerusalem","antioch","rome"], world:"earth"},
    {id:"islam", name:"Islam", parent:null, also:["judaism","christianity"], when:610, ongoing:true}
  ],
  links:[{from:"buddhism", to:"taoism", label:"Chan/Zen synthesis", when:500}]
}
```

| node field | notes |
|---|---|
| `id`, `name` | required; id is `[a-z0-9_-]` |
| `when` | required: the year it began, or `[from, to]` for a tradition that ended. Same year rules as 20.2 (no year 0) |
| `ongoing` | `true` = still practised: the bar runs to the end of the axis and the details say "– today" |
| `approx` | print "c." before the start year |
| `parent` | the node it branched from (one). Leave it out for a root. The branch is drawn at the child's start year |
| `also` | other nodes it drew on or shares roots with: drawn as dashed ties, listed under "Ties" |
| `layers` | as 20.1; colour falls back to the parent's colour, then the first layer's |
| `c` | bar colour |
| `books` / `first` | spoiler gate, as for sites. A hidden node's branches attach to its nearest visible ancestor |
| `blurb`, `notes` | details panel text; `notes` use the same labelled kinds as places (20.3) so what a tradition says about itself, what tradition holds and what scholars say stay separate |
| `world`, `site`, `sites` | where it began and where it spread: shown as "On the map" buttons that close the tree and fly to the place. When a place is open, a "Show … in the family tree" link leads back |

`links` (optional) are extra ties between any two nodes (dashed unless typed, 21.1), with a `label` (shown on hover and in the
details) and an optional `when` (the year the tie is drawn at).

Behaviour:
* Rows are depth-first: every branch sits under the tradition it came from, oldest branch first.
* The layer and year filters (20.1, 20.2) **fade** nodes rather than remove them, so the shape stays readable;
  the dialog says how many are faded. The book spoiler gate removes nodes.
* Picking a node highlights its lineage (ancestors and descendants) and its ties; arrow keys move between
  rows, Enter or Space picks, Escape closes. Zoom buttons widen the years; the chart scrolls on phones.
* The address keeps it: `#tree=1` (open) or `#tree=<nodeId>` (open with that node picked).
* Content rules: describe each tradition in its own terms; when the date or the parentage is disputed, say so
  in `notes` (`scholarship`) and mark `approx:true` rather than picking a side silently. A tree draws a
  lineage, not a ranking: no ordering other than by date.

### 21.1 Typed relations, uncertain dates and the relationship view (optional)

For traditions whose sources give a century, a period or no founding date, and whose ties are not all
"branched from". The code is in `tree-rel.js` (loaded before `tree.js`); the DOM controller is `tree-view.js`
(loaded after it). `tests/fixtures/tree-typed-demo.js` has a working example.

```js
tree:{
  view:"date",                         // "date" (default) or "relationship": which arrangement opens first
  nodes:[
    {id:"hub", name:"Hub", undated:true, ongoing:true},                       // no defensible date at all
    {id:"stream", name:"Stream", parent:"hub", parentType:"within", parentRel:"classified-within",
     emerge:[1501,1600], whenText:"sixteenth century", ongoing:true, kind:"movement"},
    {id:"merged", name:"Merged body", merge:["org-a","org-b"], parentRel:"institutional-merger", when:2026,
     ongoing:true, notSame:[{id:"stream", t:"A shared label does not make them the same."}]}
  ],
  links:[{from:"stream", to:"other", type:"contact", rel:"authored-comparison", when:1650}]
}
```

| field | notes |
|---|---|
| `emerge:[a, b]` | instead of `when`: an uncertain emergence window. Drawn as a ramp from `a` to `b`, then a solid bar. Ends at `until` (a year ≥ `b`), or runs on with `ongoing`. Give the source's own words in `whenText` (shown instead of the numbers); convert a century literally (sixteenth century = 1501–1600) and say nothing more precise than the source does |
| `undated:true` | instead of `when`: no defensible date. Drawn as an open ring with a dotted line, placed where its earliest dated branch begins (or at the start of the axis) only so it can be drawn. Text and aria labels say "No single founding date" (or `whenText`); no year is ever printed, and the year filter never fades it |
| `whenText` | the source's wording for the date ("sixteenth century", "early centuries CE") |
| `kind` | a short type shown beside the date ("legal school", "Sufi order", "movement") |
| `parentType` | the relation family of the `parent` tie (default `branch`); `parentRel` keeps the research's exact label, shown on hover and in the details |
| `merge` | two or more predecessor node ids: a body formed by merger. Drawn from every predecessor; without a `parent`, it is placed under the first one for the row order only, and the details list all of them under "Formed by merging" |
| `notSame` | `[{id, t}]`: "Not the same as …" notes for names or places that must not be merged (`id` optional, a node to link). Places use a note of kind `notsame` (20.3) for the same purpose |
| `links[].type` / `rel` | the link's relation family and its exact research label. Untyped links (and `also`) are `overlap` |

Relation families (fixed vocabulary; the validator rejects anything else). The key in the details panel lists
only the families the pack uses.

| family | drawn as | details say |
|---|---|---|
| `branch` | solid | Developed from / Developments |
| `within` | thin solid | Within / Includes |
| `division` | solid with a cross-stroke where it leaves | Divided from / Divisions |
| `merger` | one solid from each predecessor | Formed by merging / Merged into |
| `overlap` | dashed | Overlaps |
| `contact` | dotted | Contact (comparison, translation, influence, encounter) |
| `history` | dash-dot | History with (separation and reconciliation) |
| `context` | faint dotted | Context / Context for |

**By relationship.** The tree dialog has *By date* and *By relationship* buttons. The relationship view is an
indented, collapsible outline of every visible node (dated, windowed or undated) under the node it is placed
beneath, each with its typed ties; it needs no horizontal scrolling on phones. Spoiler gating, layer fading
and selection work the same way in both views. Content rule: a tie says what the sources say and no more; use
`contact` or `context` rather than a parent when one tradition did not branch from the other.

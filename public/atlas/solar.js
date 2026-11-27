/* ============================================================
   SOLAR SYSTEM DATA
   Units: R = mean radius (km). Heliocentric orbits use classical
   elements: a (AU), e, i, node (Ω), peri (ω, argument of perihelion),
   M0 (mean anomaly at J2000, deg), P (years, derived if absent).
   Moons use a (km), P (days, negative = retrograde), inc (deg to
   parent's equator).
   Features: lat/lon on the body's texture map (east-positive).
   Interior layers: [name, outer radius as fraction of R, colour, note, flags]
   ============================================================ */

const INTERIOR = {
  sun: [
    ["Core","0.25","#fff6d6","Hydrogen fuses into helium at about 15 million °C. Almost all of the Sun's energy is made here.",{hot:1}],
    ["Radiative zone","0.70","#ffb347","Energy crawls outward as light, scattered so often that a photon can take over 100,000 years to cross this zone.",{hot:.7}],
    ["Tachocline","0.72","#ff8a2a","A thin shear layer between the rigid radiative zone and the churning convective zone. It is thought to drive the Sun's magnetic dynamo.",{hot:.6}],
    ["Convective zone","0.995","#f2661f","Hot plasma rises in giant columns, cools at the top and sinks again, like a boiling pot.",{hot:.5,cells:1}],
    ["Photosphere","1","#ffd27a","The visible 'surface', about 5,500 °C. Granules and sunspots live here.",{hot:.8}]
  ],
  mercury: [
    ["Solid inner core","0.41","#e3d1a6","Iron-nickel, solid. Its size is still debated; MESSENGER data suggest roughly 1,000 km across or more.",{hot:.5}],
    ["Liquid outer core","0.83","#d68a3c","Molten iron with sulfur, which powers Mercury's weak magnetic field. The core fills about 85% of the planet's radius.",{hot:.4}],
    ["Mantle","0.985","#8a5a3c","A thin silicate shell only ~400 km thick.",{}],
    ["Crust","1","#6d6560","Dark, carbon-rich crust 20–40 km thick.",{}]
  ],
  venus: [
    ["Iron core","0.5","#e5a94a","Probably iron-nickel and at least partly liquid, yet Venus has no global magnetic field, possibly because its core does not convect.",{hot:.5}],
    ["Mantle","0.99","#a9532b","Hot silicate rock. Heat may escape in bursts that resurface the whole planet.",{hot:.15}],
    ["Crust","1","#7d6b4e","Basaltic crust about 30–60 km thick, mostly younger than 750 million years.",{}]
  ],
  earth: [
    ["Inner core","0.19","#fff2c4","Solid iron-nickel, about 5,400 °C, as hot as the Sun's surface. Kept solid by immense pressure.",{hot:1}],
    ["Outer core","0.546","#ffa53a","Liquid iron-nickel. Its swirling currents generate Earth's magnetic field.",{hot:.8}],
    ["Lower mantle","0.896","#e2582a","Hot, solid rock that still flows very slowly over millions of years.",{hot:.4}],
    ["Upper mantle","0.995","#b8442a","Includes the soft asthenosphere that tectonic plates glide on.",{hot:.2}],
    ["Crust","1","#6a5a49","5–70 km thick. Oceanic crust is thin basalt; continental crust is thick granite.",{}]
  ],
  moon: [
    ["Solid inner core","0.14","#f3e3b8","Iron, about 240 km in radius. Confirmed by re-analysis of Apollo seismic data in 2011.",{hot:.6}],
    ["Fluid outer core","0.19","#d99a4a","A thin shell of liquid iron.",{hot:.5}],
    ["Partial-melt layer","0.28","#b4683c","A boundary zone that may be 5–30% molten.",{hot:.3}],
    ["Mantle","0.97","#7a6a5c","Dense silicate rock rich in olivine and pyroxene.",{}],
    ["Crust","1","#a9a29a","Anorthosite highlands about 30–50 km thick, thicker on the far side.",{}]
  ],
  mars: [
    ["Liquid iron core","0.54","#e9a046","Iron, nickel and a lot of sulfur. InSight's seismometer showed it is larger and less dense than expected and fully molten.",{hot:.5}],
    ["Molten silicate layer","0.585","#c76a35","A ~150 km layer of melted rock wrapping the core, inferred from InSight marsquake data in 2023.",{hot:.35}],
    ["Mantle","0.985","#9c4a2c","Silicate rock that once fed the giant Tharsis volcanoes.",{}],
    ["Crust","1","#c26a43","Basaltic crust 24–72 km thick, stained red by iron oxide dust.",{}]
  ],
  jupiter: [
    ["Dilute core","0.35","#ffd38a","Juno found the core is not a compact rock ball but 'fuzzy', heavy elements mixed with hydrogen out to a large fraction of the radius.",{hot:.8,soft:1}],
    ["Metallic hydrogen","0.83","#4f5aa8","At millions of times Earth's air pressure, hydrogen becomes an electrically conducting liquid metal. It drives Jupiter's enormous magnetic field.",{soft:1,sheen:1}],
    ["Molecular hydrogen","0.99","#9fb6d6","Liquid hydrogen and helium that fades gradually into gas. There is no solid surface.",{soft:1}],
    ["Cloud decks","1","#e7caa0","Ammonia ice, ammonium hydrosulfide and water clouds form the belts and zones.",{}]
  ],
  saturn: [
    ["Diffuse core","0.22","#ffcf7a","Ice and rock blended with hydrogen. Ring 'seismology' suggests it smears out to about 60% of the radius.",{hot:.7,soft:1}],
    ["Metallic hydrogen","0.47","#5e52a6","Liquid metallic hydrogen generates Saturn's magnetic field.",{soft:1,sheen:1}],
    ["Helium rain","0.52","#9a9ccf","Helium separates from hydrogen and falls as droplets. This releases heat and explains why Saturn glows brighter than models predict.",{soft:1}],
    ["Molecular hydrogen","0.99","#c9d7e6","Liquid hydrogen and helium blending into the atmosphere.",{soft:1}],
    ["Atmosphere","1","#e8d3a2","Ammonia cloud tops, hazy and muted gold.",{}]
  ],
  uranus: [
    ["Rocky core","0.2","#c99a6a","Silicate and iron, perhaps about Earth's mass. Uranus gives off almost no internal heat.",{hot:.3}],
    ["Icy mantle","0.75","#4fa8c8","A hot, dense fluid of water, ammonia and methane: 'ices' to astronomers. It may conduct electricity and create the lopsided magnetic field.",{soft:1}],
    ["Hydrogen-helium envelope","1","#bfe6ea","Gas with methane, which absorbs red light and gives the cyan colour.",{soft:1}]
  ],
  neptune: [
    ["Rocky core","0.25","#c6955f","Rock and iron, about 1.2 Earth masses.",{hot:.45}],
    ["Icy mantle","0.8","#2e6fd0","Superheated water, ammonia and methane. Deep inside, pressure may squeeze methane into diamond rain.",{soft:1}],
    ["Hydrogen-helium envelope","1","#6aa0f0","Gas laced with methane, home to the fastest winds measured in the Solar System.",{soft:1}]
  ],
  io: [
    ["Iron core","0.52","#e5b04d","Iron and iron sulfide, about half Io's radius.",{hot:.6}],
    ["Mantle","0.9","#c4532a","Silicate rock squeezed and heated by Jupiter's tides.",{hot:.35}],
    ["Partially molten layer","0.97","#ff7a2c","A magma-rich zone, possibly a global 'magma sponge', that feeds over 400 active volcanoes.",{hot:.8}],
    ["Crust","1","#d9c76d","Sulfur and silicate crust, constantly repaved by lava.",{}]
  ],
  europa: [
    ["Iron core","0.4","#d9a35a","Metallic core.",{hot:.4}],
    ["Rocky mantle","0.91","#7d5b44","Silicate rock. Its seafloor may host hydrothermal vents.",{}],
    ["Salty ocean","0.985","#1f6fb8","A global ocean 60–150 km deep, holding about twice the water of all Earth's oceans.",{water:1}],
    ["Ice shell","1","#e6eef2","Ice roughly 15–25 km thick, cracked into ridges and chaos terrain.",{}]
  ],
  ganymede: [
    ["Solid iron core","0.2","#fff0c0","Solid iron at the centre.",{hot:.9}],
    ["Liquid iron sulfide core","0.26","#ff9a2e","Molten iron sulfide. Its churning makes Ganymede the only moon with its own magnetic field.",{hot:.8}],
    ["Rocky mantle","0.55","#7a4a33","Silicate rock.",{}],
    ["High-pressure ice","0.9","#bfd5e2","Dense ice phases (such as ice VI) that only form under great pressure.",{}],
    ["Saltwater ocean","0.94","#2a7fd0","A buried ocean about 100 km deep, sandwiched between ice layers.",{water:1}],
    ["Ice crust","1","#9d968c","Ordinary ice about 150 km thick, dark and grooved.",{}]
  ],
  callisto: [
    ["Rock-ice interior","0.9","#6d655c","Callisto is only partly differentiated: rock and ice remain mixed, with more rock toward the centre.",{soft:1}],
    ["Possible ocean","0.95","#2c6ea8","Magnetic measurements from Galileo hint at a salty ocean more than 100 km down.",{water:1}],
    ["Ice crust","1","#8a8379","Ancient, heavily cratered ice and dust.",{}]
  ],
  titan: [
    ["Rocky core","0.7","#7e5a3e","Hydrated silicate rock.",{}],
    ["High-pressure ice","0.84","#bccbd8","Dense ice between core and ocean.",{}],
    ["Subsurface ocean","0.94","#2b6fa3","Water, possibly very salty, with ammonia.",{water:1}],
    ["Ice crust","0.995","#c9b98e","Water-ice bedrock with methane lakes and organic dunes on top.",{}],
    ["Atmosphere","1","#e19a3f","Nitrogen air 1.5 times as thick as Earth's, with orange organic haze.",{}]
  ],
  enceladus: [
    ["Porous rocky core","0.75","#6e5a48","Water percolates through this loose core and is heated by tidal friction, much like hydrothermal vents on Earth.",{hot:.2}],
    ["Global ocean","0.9","#2e88c9","Salty water about 10 km deep (deeper at the south pole). Cassini sampled it directly through the plumes.",{water:1}],
    ["Ice shell","1","#f2f6f8","20–40 km thick, but only a few km thick at the south pole where the plumes erupt.",{}]
  ],
  triton: [
    ["Rocky core","0.62","#7a5c45","Rock and metal making up about two-thirds of Triton's mass.",{}],
    ["Ice mantle","0.88","#b8c7d0","Water ice.",{}],
    ["Possible ocean","0.92","#2f7ab8","Tidal heating after capture may have kept an ammonia-water ocean liquid.",{water:1}],
    ["Nitrogen-ice crust","1","#d8c6bc","Frozen nitrogen over water ice. Geysers vent nitrogen gas.",{}]
  ],
  pluto: [
    ["Rocky core","0.72","#7a5a45","Rock making up most of Pluto's mass.",{}],
    ["Possible ocean","0.87","#2a6aa0","A slushy ocean is strongly suggested by Sputnik Planitia's position and Pluto's tectonic cracks.",{water:1}],
    ["Ice shell","1","#e9dccb","Water-ice bedrock topped with frozen nitrogen, methane and carbon monoxide.",{}]
  ],
  charon: [
    ["Rocky core","0.63","#6e5a4c","Rock and metal.",{}],
    ["Ice mantle","1","#a9a39d","Water ice. An ancient ocean likely froze and cracked the crust open.",{}]
  ],
  ceres: [
    ["Rocky interior","0.55","#6c5a4a","Dense, partly dehydrated rock.",{}],
    ["Hydrated mantle","0.92","#5b6670","Clay-rich rock mixed with salts. Deep brine pockets may survive today.",{}],
    ["Ice-rich crust","1","#55524f","A mix of ice, salts and hydrated minerals about 40 km thick.",{}]
  ],
  vesta: [
    ["Iron core","0.42","#d8a457","Vesta melted and separated like a small planet.",{hot:.3}],
    ["Mantle","0.92","#6b5b49","Olivine-rich rock.",{}],
    ["Basaltic crust","1","#8a8276","Lava crust. Fragments reach Earth as HED meteorites.",{}]
  ],
  dwarfIcy: [
    ["Rocky core","0.68","#7a5b44","Rock and metal, likely most of the mass.",{}],
    ["Ice mantle","1","#cfc6bd","Water ice, perhaps with a buried ocean early in its history.",{}]
  ],
  icyDiff: [
    ["Rocky core","0.5","#6f5a48","Rock separated from ice early in the moon's history.",{}],
    ["Ice mantle","1","#d6dbde","Mostly water ice.",{}]
  ],
  icyMixed: [
    ["Ice-rock mixture","1","#c4c6c4","A porous blend of ice and rock that never fully separated into layers.",{soft:1}]
  ],
  rubble: [
    ["Rubble pile","1","#6b6460","Loosely bound rock and dust with large empty spaces inside.",{soft:1}]
  ],
  comet: [
    ["Ice and dust","0.94","#5d6470","A fragile, porous mix of water ice, frozen gases and dust: 'dirty snowball' or 'icy dirtball'.",{soft:1}],
    ["Dark crust","1","#2a2624","A tar-black crust that reflects only about 4% of sunlight. Jets break through it near the Sun.",{}]
  ],
  ninth: [
    ["Rock-ice core","0.3","#8a6c50","If Planet Nine exists, it may be a 'super-Earth' core of rock and ice.",{}],
    ["Ice mantle","0.75","#3f78b3","Possibly water, ammonia and methane, like Uranus and Neptune.",{soft:1}],
    ["Hydrogen-helium envelope","1","#8fb4cf","A thin gas envelope would make it a 'mini-Neptune'. Everything here is speculative.",{soft:1}]
  ],
  mimas: [
    ["Rocky core","0.45","#6d5c4c","Rock.",{}],
    ["Young ocean","0.82","#2f7cc0","Cassini orbit wobbles suggest a hidden ocean that formed only 5–15 million years ago (2024 study).",{water:1}],
    ["Ice shell","1","#d6d8d6","Ice about 20–30 km thick.",{}]
  ],
  haumea: [
    ["Rocky core","0.8","#7c5c46","Haumea is dense, so rock makes up most of the body.",{}],
    ["Ice mantle","1","#e8ecef","A thin crystalline-water-ice coat, bright and fresh.",{}]
  ]
};
// layer helper: radius values were stored as strings for readability
Object.values(INTERIOR).forEach(L=>L.forEach(l=>l[1]=parseFloat(l[1])));

/* --------------------------------------------------------------
   BODIES
   kind: star | planet | dwarf | moon | small | comet | hypo
   -------------------------------------------------------------- */
const BODIES = [
 {id:"sun",name:"Sun",kind:"star",R:695700,tex:"sun",tilt:7.25,rot:609.1,glow:"#ffb84d",interior:"sun",
  facts:{"Diameter":"1,392,700 km (109 Earths)","Mass":"99.86% of the Solar System","Surface":"5,500 °C","Core":"15 million °C","Age":"4.6 billion years","Spin":"25 days at equator, 35 at poles"},
  blurb:"A middle-aged yellow dwarf star. Every second it fuses about 600 million tonnes of hydrogen into helium, and the energy takes tens of thousands of years to reach the surface before an 8-minute trip to Earth.",
  features:[
   {n:"Sunspots",lat:18,lon:-25,fx:"spots",d:"Darker, cooler patches (about 3,500 °C against 5,500 °C around them) where tangled magnetic fields block heat from below. The dark centre is the umbra, the streaky rim the penumbra. Their number rises and falls over an 11-year cycle; Solar Cycle 25 peaked around 2024–25."},
   {n:"Solar flare",lat:12,lon:-8,fx:"flare",d:"A sudden release of magnetic energy that brightens a patch of the Sun for minutes to hours: two bright ribbons, then an arcade of glowing loops. The biggest release as much energy as billions of nuclear bombs and can disrupt radio and GPS on Earth."},
   {n:"Coronal loops",lat:-15,lon:35,fx:"loops",d:"Arches of glowing plasma that trace magnetic field lines above active regions, often over 100,000 km high. They show up best in extreme-ultraviolet images like the gold ones from NASA's Solar Dynamics Observatory."},
   {n:"Prominence",lat:32,lon:82,fx:"prom",d:"A huge cloud of cooler, denser plasma (about 10,000 °C) held above the surface by magnetic fields. On the limb it glows red-pink; seen against the disc it looks like a dark filament. It can be many times wider than Earth and may erupt."},
   {n:"Coronal mass ejection",lat:-20,lon:-120,fx:"cme",d:"A billion-tonne bubble of plasma and magnetic field blasted into space at 300–3,000 km/s. When one hits Earth one to three days later it drives geomagnetic storms and auroras."},
   {n:"Granulation",lat:-5,lon:-5,fx:"gran",d:"The surface is tiled with convection cells about 1,000 km wide: hot plasma rises in the bright centres and sinks in the dark lanes. Each lasts 8–20 minutes."},
   {n:"Polar coronal hole",lat:78,lon:0,fx:"hole",d:"Here the magnetic field opens out into space instead of looping back, letting the fast solar wind stream out at around 800 km/s. In ultraviolet images the region looks dark."}
  ]},

 {id:"mercury",name:"Mercury",kind:"planet",R:2439.7,a:.38710,e:.20563,i:7.005,node:48.331,peri:29.124,M0:174.796,tex:"mercury",normal:"mercury",tilt:.03,rot:1407.6,interior:"mercury",
  facts:{"Diameter":"4,879 km","From Sun":"58 million km (0.39 AU)","Year":"88 Earth days","Day (sunrise to sunrise)":"176 Earth days","Temperature":"−180 to 430 °C","Moons":"0"},
  blurb:"The smallest planet and the closest to the Sun. Mercury is mostly iron core, has almost no atmosphere, and spins exactly three times for every two orbits.",
  features:[
   {n:"Caloris Basin",lat:30.5,lon:-170.2,d:"A 1,550 km impact basin. The shock of the impact was focused on the opposite side of the planet, creating 'weird terrain' there."},
   {n:"Rachmaninoff Basin",lat:-27.6,lon:57.6,d:"A double-ringed basin with a smooth floor of relatively young volcanic plains."},
   {n:"Polar ice craters",lat:86,lon:0,d:"Craters near the poles never see sunlight. MESSENGER found water ice inside them, on the planet closest to the Sun."},
   {n:"Hokusai",lat:57.8,lon:16.8,d:"A young crater with bright rays that stretch for over a thousand kilometres."}
  ]},

 {id:"venus",name:"Venus",kind:"planet",R:6051.8,a:.72333,e:.00677,i:3.395,node:76.680,peri:54.884,M0:50.115,tex:"venus",veil:{tex:"venus_clouds",label:"Cloud deck",alt:"Radar surface"},atmo:"#f5d79a",tilt:177.36,rot:-5832.5,interior:"venus",
  facts:{"Diameter":"12,104 km","From Sun":"108 million km (0.72 AU)","Year":"225 Earth days","Day":"243 Earth days (spins backward)","Surface":"465 °C, 92× Earth's air pressure","Moons":"0"},
  blurb:"Nearly Earth's twin in size, but wrapped in a crushing carbon dioxide atmosphere and sulfuric acid clouds. A runaway greenhouse effect makes it the hottest planet. Turn off the clouds to see the radar map made by NASA's Magellan.",
  features:[
   {n:"Maxwell Montes",lat:65.2,lon:3.3,d:"The highest mountains on Venus, about 11 km above the average surface."},
   {n:"Aphrodite Terra",lat:-5.8,lon:104.8,d:"A highland region about the size of Africa, cut by deep rift valleys."},
   {n:"Maat Mons",lat:.5,lon:-165.4,d:"An 8 km shield volcano. In 2023 scientists spotted a vent nearby that changed shape between Magellan images, evidence of recent eruptions."},
   {n:"Venera 13 landing site",lat:-7.5,lon:-57,d:"In 1982 the Soviet Venera 13 lander sent the first colour photos from the surface. It survived 127 minutes."}
  ]},

 {id:"earth",name:"Earth",kind:"planet",R:6371,a:1.00000,e:.01671,i:0,node:-11.26,peri:114.21,M0:357.529,tex:"earth",normal:"earth",earth:1,atmo:"#6fb2ff",aurora:{color:"#58ff8c",lat:81,lon:-73,r:21,sLat:-79,sLon:108,sR:21,w:2.6,night:1,gain:1.4},tilt:23.44,rot:23.934,interior:"earth",
  facts:{"Diameter":"12,742 km","From Sun":"150 million km (1 AU)","Year":"365.25 days","Day":"23 h 56 min","Surface":"−89 to 57 °C","Moons":"1"},
  blurb:"The only world known to host life. Liquid water covers 71% of the surface, a magnetic field shields the atmosphere, and plate tectonics recycles the crust.",
  features:[
   {n:"Mount Everest",lat:27.99,lon:86.93,d:"8,849 m, the highest point above sea level. The Himalaya is still rising as India pushes into Asia."},
   {n:"Mariana Trench",lat:11.35,lon:142.2,d:"The deepest point on Earth: Challenger Deep, about 10,935 m below sea level."},
   {n:"Amazon Rainforest",lat:-3.5,lon:-62,d:"The largest tropical rainforest, home to about 10% of all known species."},
   {n:"Sahara",lat:23,lon:13,d:"The largest hot desert. Dust blown from it fertilises the Amazon across the Atlantic."},
   {n:"Great Barrier Reef",lat:-18.3,lon:147.7,d:"The largest structure built by living things, visible from orbit."},
   {n:"Northern lights",lat:66,lon:-100,aur:1,d:"The aurora borealis: solar-wind particles steered by Earth's magnetic field strike oxygen 100 to 300 km up, which glows green. The ovals sit around the magnetic poles and are brightest on the night side."},
   {n:"Antarctic Ice Sheet",lat:-82,lon:40,d:"Holds about 60% of Earth's fresh water, in ice up to 4.8 km thick."}
  ]},

 {id:"moon",name:"Moon",kind:"moon",parent:"earth",R:1737.4,a:384400,P:27.322,inc:5.1,tex:"moon",normal:"moon",rot:"sync",interior:"moon",
  facts:{"Diameter":"3,475 km","From Earth":"384,400 km","Orbit":"27.3 days","Gravity":"16.6% of Earth's","Temperature":"−173 to 127 °C","Visitors":"12 astronauts, 1969–72"},
  blurb:"Likely formed from debris after a Mars-sized body hit the young Earth. It is tidally locked, always showing the same face, and slowly drifting away about 3.8 cm per year.",
  features:[
   {n:"Tycho",lat:-43.3,lon:-11.4,d:"An 85 km crater about 108 million years old, with bright rays visible from Earth with binoculars."},
   {n:"Copernicus",lat:9.6,lon:-20.1,d:"A 93 km crater with terraced walls and central peaks."},
   {n:"Mare Imbrium",lat:32.8,lon:-15.6,d:"A vast plain of dark basalt filling an ancient impact basin, the 'right eye' of the Man in the Moon."},
   {n:"South Pole–Aitken Basin",lat:-53,lon:169,d:"About 2,500 km across, one of the largest impact craters in the Solar System. Chang'e 6 brought back samples from it in 2024."},
   {n:"Mare Orientale",lat:-19.4,lon:-94.7,d:"A bullseye of three rings, straddling the edge of the near side."}
  ]},

 {id:"mars",name:"Mars",kind:"planet",R:3389.5,a:1.52366,e:.09341,i:1.850,node:49.558,peri:286.502,M0:19.373,tex:"mars",normal:"mars",atmo:"#e9a27a",atmoThin:1,tilt:25.19,rot:24.623,interior:"mars",
  facts:{"Diameter":"6,779 km","From Sun":"228 million km (1.52 AU)","Year":"687 Earth days","Day":"24 h 37 min","Temperature":"−140 to 20 °C","Moons":"2"},
  blurb:"A cold desert world with enormous volcanoes and the vast Valles Marineris canyon system. Dry river valleys and lake beds show Mars was once warmer and wetter. Rovers Curiosity and Perseverance are exploring it now.",
  features:[
   {n:"Olympus Mons",lat:18.65,lon:-133.8,d:"The tallest volcano in the Solar System: about 22 km high and as wide as Arizona."},
   {n:"Valles Marineris",lat:-13.9,lon:-59.2,d:"A canyon system 4,000 km long and up to 7 km deep. It would stretch across the United States."},
   {n:"Tharsis Montes",lat:0,lon:-112,d:"A line of three giant volcanoes on a bulge so massive it shifted the planet's tilt."},
   {n:"Hellas Planitia",lat:-42.4,lon:70.5,d:"An impact basin 2,300 km wide and over 7 km deep. Air pressure at the bottom is the highest on Mars."},
   {n:"Jezero Crater",lat:18.4,lon:77.7,d:"An ancient lake with a river delta. Perseverance has been collecting rock samples here since 2021."},
   {n:"Gale Crater",lat:-5.4,lon:137.8,d:"Curiosity has been climbing Mount Sharp in this crater since 2012."},
   {n:"North polar ice cap",lat:86,lon:0,d:"Layers of water ice and dust, topped in winter by frozen carbon dioxide."}
  ]},
 {id:"phobos",name:"Phobos",kind:"moon",parent:"mars",R:11.27,a:9376,P:.3189,inc:1.1,tex:"phobos",rot:"sync",lumpy:[13.0,11.4,9.1],interior:"rubble",
  facts:{"Size":"27 × 22 × 18 km","From Mars":"9,376 km","Orbit":"7 h 39 min"},
  blurb:"Phobos circles Mars three times a day and is spiralling inward. In about 50 million years it will crash or break into a ring.",
  features:[{n:"Stickney crater",lat:1,lon:-49,d:"A 9 km crater, nearly half the moon's width. The impact almost shattered Phobos."}]},
 {id:"deimos",name:"Deimos",kind:"moon",parent:"mars",R:6.2,a:23463,P:1.263,inc:.9,tex:"deimos",rot:"sync",lumpy:[7.5,6.1,5.2],interior:"rubble",
  facts:{"Size":"15 × 12 × 11 km","From Mars":"23,463 km","Orbit":"30.3 hours"},blurb:"The smaller, smoother moon of Mars, probably a captured asteroid or debris from an ancient impact."},

 /* Asteroid belt */
 {id:"ceres",name:"Ceres",kind:"dwarf",R:469.7,a:2.7675,e:.0758,i:10.59,node:80.3,peri:73.6,M0:77.4,tex:"ceres",tilt:4,rot:9.074,interior:"ceres",
  facts:{"Diameter":"940 km","From Sun":"2.77 AU","Year":"4.6 years","Day":"9 h 4 min","Share of belt mass":"About 25%","Visited":"Dawn, 2015–18"},
  blurb:"The largest object in the asteroid belt and the only dwarf planet in the inner Solar System. Dawn found salt deposits and a briny interior.",
  features:[
   {n:"Occator Crater",lat:19.8,lon:-120.7,d:"Its bright spots are sodium carbonate salts left behind when brine seeped up from below and evaporated."},
   {n:"Ahuna Mons",lat:-10.5,lon:-43.6,d:"A 4 km tall ice volcano (cryovolcano) made of salty mud."},
   {n:"Kerwan",lat:-10.8,lon:124,d:"The largest impact basin on Ceres, about 280 km across."}
  ]},
 {id:"vesta",name:"Vesta",kind:"small",R:262.7,a:2.3615,e:.0887,i:7.14,node:103.8,peri:151.2,M0:205.5,tex:"vesta",tilt:29,rot:5.342,lumpy:[286,279,223],interior:"vesta",
  facts:{"Size":"573 × 557 × 446 km","From Sun":"2.36 AU","Year":"3.6 years","Visited":"Dawn, 2011–12"},
  blurb:"The brightest asteroid and a protoplanet that melted and layered like a small planet before growth stopped.",
  features:[{n:"Rheasilvia",lat:-75,lon:-59,d:"A 505 km crater covering most of the south pole, with a central peak 22 km high, among the tallest in the Solar System. Debris from it gave rise to the Vesta family of asteroids."}]},
 {id:"pallas",name:"Pallas",kind:"small",R:256,a:2.7724,e:.2305,i:34.84,node:173.0,peri:310.2,M0:40.6,tex:"asteroid",tint:"#9da3a8",lumpy:[284,256,226],interior:"rubble",
  facts:{"Size":"~512 km","From Sun":"2.77 AU","Orbit tilt":"34.8°"},blurb:"The third-largest asteroid, on a steeply tilted orbit that makes it hard for spacecraft to reach."},
 {id:"hygiea",name:"Hygiea",kind:"small",R:217,a:3.1415,e:.1125,i:3.83,node:283.2,peri:312.3,M0:152.2,tex:"asteroid",tint:"#5b5652",interior:"rubble",
  facts:{"Diameter":"~434 km","From Sun":"3.14 AU"},blurb:"Almost perfectly round, which makes it a candidate dwarf planet."},

 /* Jupiter */
 {id:"jupiter",name:"Jupiter",kind:"planet",R:69911,a:5.20336,e:.04839,i:1.304,node:100.464,peri:273.867,M0:20.020,tex:"jupiter",atmo:"#d8e0ea",aurora:{color:"#7fb0ff",lat:78,lon:-165,r:12,sLat:-80,sLon:40,sR:10,w:1.8},tilt:3.13,rot:9.925,interior:"jupiter",ring:{inner:1.4,outer:1.81,color:"#8a7356",opacity:.06},
  facts:{"Diameter":"139,820 km (11 Earths)","From Sun":"778 million km (5.2 AU)","Year":"11.9 Earth years","Day":"9 h 56 min","Cloud tops":"−110 °C","Moons":"115 known"},
  blurb:"The largest planet, more than twice as massive as all the others combined. Its fast spin stretches the clouds into colourful belts and zones. NASA's Juno has orbited it since 2016.",
  features:[
   {n:"Great Red Spot",lat:-20.5,lon:-57.5,d:"A storm larger than Earth that has raged for at least 190 years. It has been shrinking; today it is about 1.3 times Earth's width."},
   {n:"Oval BA",lat:-33,lon:-15,d:"'Red Spot Junior', formed in 2000 when three white storms merged."},
   {n:"North Equatorial Belt",lat:14,lon:20,d:"A dark band of warmer, descending air with lightning storms and plumes."},
   {n:"Polar cyclones",lat:84,lon:0,d:"Juno found eight cyclones packed around a central one at the north pole and five around the south pole, a geometric pattern seen nowhere else."},
   {n:"Auroras",lat:72,lon:-160,aur:1,d:"The most powerful auroras in the Solar System, hundreds of times more energetic than Earth's and glowing mostly in ultraviolet, as Hubble sees them here. Io's volcanoes feed them with charged particles."}
  ]},
 {id:"metis",name:"Metis",kind:"moon",parent:"jupiter",R:21.5,a:128000,P:.295,tex:"asteroid",tint:"#8a6a55",lumpy:[30,20,17],rot:"sync",interior:"rubble",facts:{"Size":"60 × 40 × 34 km","Orbit":"7 h 4 min"},blurb:"Jupiter's innermost moon. It orbits inside the main ring and supplies it with dust."},
 {id:"adrastea",name:"Adrastea",kind:"moon",parent:"jupiter",R:8.2,a:129000,P:.298,tex:"asteroid",tint:"#8a6a55",lumpy:[10,8,7],rot:"sync",interior:"rubble",facts:{"Size":"~16 km","Orbit":"7 h 9 min"},blurb:"A tiny ring-shepherding moon, one of the smallest Voyager photographed."},
 {id:"amalthea",name:"Amalthea",kind:"moon",parent:"jupiter",R:83.5,a:181400,P:.498,tex:"asteroid",tint:"#a3503a",lumpy:[125,73,64],rot:"sync",interior:"rubble",facts:{"Size":"250 × 146 × 128 km","Orbit":"12 hours"},blurb:"The reddest object in the Solar System, stained with sulfur from Io. It is so porous it may be a rubble pile of ice."},
 {id:"thebe",name:"Thebe",kind:"moon",parent:"jupiter",R:49.3,a:221900,P:.675,tex:"asteroid",tint:"#8a5a48",lumpy:[58,49,42],rot:"sync",interior:"rubble",facts:{"Size":"~98 km","Orbit":"16 hours"},blurb:"Feeds Jupiter's faint outer 'gossamer' ring with dust."},
 {id:"io",name:"Io",kind:"moon",parent:"jupiter",R:1821.6,a:421700,P:1.769,tex:"io",rot:"sync",interior:"io",
  facts:{"Diameter":"3,643 km","From Jupiter":"421,700 km","Orbit":"1.77 days","Active volcanoes":"400+"},
  blurb:"The most volcanic world known. Tides from Jupiter flex Io's interior by up to 100 m, heating it enough to keep hundreds of volcanoes erupting.",
  features:[
   {n:"Loki Patera",lat:13,lon:51,d:"A lava lake 200 km across, the most powerful volcano in the Solar System. Its crust overturns in waves every few hundred days."},
   {n:"Pele",lat:-19,lon:100,plume:{h:.3,spread:.22,col:"#cfd8ff",umbrella:1,n:2600},d:"Its sulfur plume rises 300 km and leaves a red ring 1,200 km wide."},
   {n:"Tvashtar Paterae",lat:63,lon:-124,d:"New Horizons caught a 330 km plume erupting here in 2007."},
   {n:"Prometheus",lat:-1.5,lon:-153,plume:{h:.12,spread:.1,col:"#fff1c8",umbrella:1,n:1400},d:"A long-lived plume called the 'Old Faithful' of Io."}
  ]},
 {id:"europa",name:"Europa",kind:"moon",parent:"jupiter",R:1560.8,a:671034,P:3.551,tex:"europa",rot:"sync",interior:"europa",
  facts:{"Diameter":"3,122 km","From Jupiter":"671,000 km","Orbit":"3.55 days","Ocean depth":"60–150 km"},
  blurb:"An ice-covered ocean world and one of the best places to look for life beyond Earth. NASA's Europa Clipper launched in 2024 and arrives in 2030.",
  features:[
   {n:"Conamara Chaos",lat:10,lon:86,d:"Rafts of ice that broke apart, drifted and refroze, a sign warm water came close to the surface."},
   {n:"Pwyll crater",lat:-26,lon:89,d:"A young 26 km crater whose bright rays splash for over 1,000 km."},
   {n:"Lineae",lat:-40,lon:-170,d:"Long reddish cracks crisscross the ice. The colour may be salts from the ocean below."},
   {n:"Thera Macula",lat:-47,lon:179,d:"A dark, lumpy region that may sit above a lake of liquid water trapped in the ice."}
  ]},
 {id:"ganymede",name:"Ganymede",kind:"moon",parent:"jupiter",R:2634.1,a:1070412,P:7.155,tex:"ganymede",rot:"sync",aurora:{color:"#b39cff",lat:90,lon:0,r:44,sLat:-90,sLon:0,sR:44,w:2.4},interior:"ganymede",
  facts:{"Diameter":"5,268 km (larger than Mercury)","From Jupiter":"1.07 million km","Orbit":"7.15 days","Magnetic field":"Yes, the only moon with one"},
  blurb:"The largest moon in the Solar System. It has a hidden saltwater ocean and its own magnetic field. ESA's JUICE will orbit it from 2034.",
  features:[
   {n:"Galileo Regio",lat:35,lon:-145,d:"A huge dark region of ancient, cratered ice, about 3,200 km across."},
   {n:"Uruk Sulcus",lat:0,lon:-160,d:"Bright grooved terrain formed when the crust stretched and cracked."},
   {n:"Tros",lat:11,lon:-27,d:"A bright rayed crater 94 km wide."},
   {n:"Auroral ovals",lat:45,lon:0,aur:1,d:"Glowing bands caused by Ganymede's own magnetic field. Their rocking motion revealed the ocean."}
  ]},
 {id:"callisto",name:"Callisto",kind:"moon",parent:"jupiter",R:2410.3,a:1882709,P:16.689,tex:"callisto",rot:"sync",interior:"callisto",
  facts:{"Diameter":"4,821 km","From Jupiter":"1.88 million km","Orbit":"16.7 days"},
  blurb:"The most heavily cratered object in the Solar System. Its surface is about 4 billion years old.",
  features:[
   {n:"Valhalla",lat:14,lon:-56,d:"A multi-ring impact basin about 3,800 km across, rippling out like a frozen pond."},
   {n:"Asgard",lat:32,lon:-140,d:"Another ringed basin, about 1,600 km wide."}
  ]},
 {id:"leda",name:"Leda",kind:"moon",parent:"jupiter",R:10.75,a:11165000,P:240.9,inc:27,tex:"asteroid",tint:"#6b6560",lumpy:1,interior:"rubble",facts:{"Diameter":"~21 km","Orbit":"241 days"},blurb:"A small prograde irregular moon of the Himalia group."},
 {id:"himalia",name:"Himalia",kind:"moon",parent:"jupiter",R:70,a:11460000,P:250.6,inc:28,tex:"asteroid",tint:"#6b6560",lumpy:[75,60,55],interior:"rubble",facts:{"Diameter":"~140 km","Orbit":"251 days"},blurb:"Largest of Jupiter's outer irregular moons, likely a captured asteroid."},
 {id:"elara",name:"Elara",kind:"moon",parent:"jupiter",R:40,a:11740000,P:259.6,inc:26,tex:"asteroid",tint:"#6b6560",lumpy:1,interior:"rubble",facts:{"Diameter":"~80 km","Orbit":"260 days"},blurb:"A member of the Himalia group, fragments of one captured body."},
 {id:"ananke",name:"Ananke",kind:"moon",parent:"jupiter",R:14,a:21280000,P:-629.8,inc:148,tex:"asteroid",tint:"#6b6560",lumpy:1,interior:"rubble",facts:{"Diameter":"~28 km","Orbit":"630 days, retrograde"},blurb:"Orbits backwards, a sign it was captured rather than formed with Jupiter."},
 {id:"carme",name:"Carme",kind:"moon",parent:"jupiter",R:23,a:23400000,P:-734.2,inc:165,tex:"asteroid",tint:"#7a6555",lumpy:1,interior:"rubble",facts:{"Diameter":"~46 km","Orbit":"734 days, retrograde"},blurb:"Leader of a retrograde family of more than 20 small moons."},
 {id:"pasiphae",name:"Pasiphae",kind:"moon",parent:"jupiter",R:30,a:23620000,P:-743.6,inc:151,tex:"asteroid",tint:"#6b6560",lumpy:1,interior:"rubble",facts:{"Diameter":"~60 km","Orbit":"744 days, retrograde"},blurb:"Largest of the retrograde Pasiphae group."},
 {id:"sinope",name:"Sinope",kind:"moon",parent:"jupiter",R:19,a:23940000,P:-758.9,inc:158,tex:"asteroid",tint:"#7a6555",lumpy:1,interior:"rubble",facts:{"Diameter":"~38 km","Orbit":"759 days, retrograde"},blurb:"A distant reddish retrograde moon."},

 /* Saturn */
 {id:"saturn",name:"Saturn",kind:"planet",R:58232,a:9.53707,e:.05415,i:2.485,node:113.665,peri:339.392,M0:317.020,tex:"saturn",atmo:"#efd9a6",aurora:{color:"#6f8cff",lat:89,lon:0,r:15,sLat:-89,sLon:0,sR:16,w:2.0,gain:.75},tilt:26.73,rot:10.656,interior:"saturn",rings:"saturn",
  facts:{"Diameter":"116,460 km (9 Earths)","From Sun":"1.43 billion km (9.5 AU)","Year":"29.4 Earth years","Day":"10 h 33 min","Density":"Less than water","Moons":"293 known"},
  blurb:"The ringed jewel of the Solar System. Its rings are mostly water ice, 280,000 km wide but often only about 10 m thick. Saturn has more known moons than any other planet.",
  features:[
   {n:"North polar hexagon",lat:78,lon:0,d:"A six-sided jet stream about 30,000 km across, each side wider than Earth, with a hurricane-like vortex at its centre. Cassini watched the inside turn from blue to gold between 2012 and 2016 as northern summer brought sunlight and haze."},
   {n:"Auroras",lat:74,lon:30,aur:1,d:"Saturn's auroras ring both poles and pulse with the planet's rotation. They glow in ultraviolet and infrared."},
   {n:"Great White Spot (2010–11)",lat:35,lon:-40,d:"A giant storm erupts about once every Saturn year. The 2010 storm wrapped all the way around the planet."},
   {n:"Cassini Division",ring:1.99,d:"A 4,700 km gap between the A and B rings, cleared by a resonance with the moon Mimas."},
   {n:"B Ring",ring:1.75,d:"The brightest and most massive ring, with ice chunks from dust to house-sized."},
   {n:"Encke Gap",ring:2.21,d:"A 325 km gap in the A ring kept open by the tiny moon Pan."}
  ]},
 {id:"pan",name:"Pan",kind:"moon",parent:"saturn",R:14,a:133584,P:.575,tex:"icy",tint:"#cfc5b4",lumpy:[17,16,10],rot:"sync",interior:"icyMixed",facts:{"Size":"34 × 31 × 21 km","Orbit":"13.8 hours"},blurb:"Shaped like a ravioli by ring particles piling onto its equator. It clears the Encke Gap."},
 {id:"daphnis",name:"Daphnis",kind:"moon",parent:"saturn",R:3.8,a:136505,P:.594,tex:"icy",tint:"#cfc5b4",lumpy:1,rot:"sync",interior:"icyMixed",facts:{"Diameter":"~8 km","Orbit":"14.3 hours"},blurb:"Raises waves up to 1.5 km tall along the edges of the Keeler Gap."},
 {id:"atlas",name:"Atlas",kind:"moon",parent:"saturn",R:15,a:137670,P:.602,tex:"icy",tint:"#cfc5b4",lumpy:[20,18,9],rot:"sync",interior:"icyMixed",facts:{"Size":"41 × 35 × 19 km","Orbit":"14.4 hours"},blurb:"Another flying-saucer moon, shepherding the outer edge of the A ring."},
 {id:"prometheus",name:"Prometheus",kind:"moon",parent:"saturn",R:43,a:139380,P:.613,tex:"icy",tint:"#bfb6a8",lumpy:[68,40,30],rot:"sync",interior:"icyMixed",facts:{"Size":"136 × 79 × 59 km","Orbit":"14.7 hours"},blurb:"Shepherds the inner edge of the F ring, carving streamers in it every orbit."},
 {id:"pandora",name:"Pandora",kind:"moon",parent:"saturn",R:40,a:141720,P:.629,tex:"icy",tint:"#bfb6a8",lumpy:[52,41,32],rot:"sync",interior:"icyMixed",facts:{"Size":"104 × 81 × 64 km","Orbit":"15.1 hours"},blurb:"The outer shepherd of the narrow, braided F ring."},
 {id:"epimetheus",name:"Epimetheus",kind:"moon",parent:"saturn",R:58,a:151422,P:.694,tex:"icy",tint:"#b9b2a6",lumpy:[65,58,51],rot:"sync",interior:"icyMixed",facts:{"Size":"130 × 114 × 103 km","Orbit":"16.7 hours"},blurb:"Shares an orbit with Janus. Every four years the two swap places without colliding."},
 {id:"janus",name:"Janus",kind:"moon",parent:"saturn",R:89,a:151472,P:.695,tex:"icy",tint:"#b9b2a6",lumpy:[101,93,76],rot:"sync",interior:"icyMixed",facts:{"Size":"203 × 185 × 153 km","Orbit":"16.7 hours"},blurb:"Co-orbital partner of Epimetheus."},
 {id:"mimas",name:"Mimas",kind:"moon",parent:"saturn",R:198.2,a:185539,P:.942,tex:"mimas",rot:"sync",interior:"mimas",
  facts:{"Diameter":"396 km","From Saturn":"185,500 km","Orbit":"22.6 hours"},
  blurb:"The smallest body known to be round because of its own gravity. Its giant crater gives it a famous resemblance to a certain space station.",
  features:[{n:"Herschel crater",lat:0,lon:-112,d:"130 km wide, a third of the moon's diameter, with walls 5 km high and a central peak almost as tall as Everest."}]},
 {id:"enceladus",name:"Enceladus",kind:"moon",parent:"saturn",R:252.1,a:237948,P:1.370,tex:"enceladus",rot:"sync",interior:"enceladus",
  facts:{"Diameter":"504 km","From Saturn":"238,000 km","Orbit":"1.37 days","Reflectivity":"~99%, the whitest body known"},
  blurb:"A small, snow-white moon that sprays its ocean into space. Cassini flew through the plumes and found salt, silica and organic molecules, the ingredients for life.",
  features:[
   {n:"Tiger stripes",lat:-82,lon:-30,plume:{h:.9,spread:.25,col:"#dff1ff",stripes:1,n:4000,speed:.12,size:.02},d:"Four parallel fractures about 130 km long at the south pole. They are warm and vent the geysers."},
   {n:"South polar plumes",lat:-88,lon:0,d:"Over 100 jets shoot about 250 kg of water vapour and ice every second, feeding Saturn's E ring."},
   {n:"Cratered north",lat:55,lon:50,d:"Old, cratered terrain, very different from the young, smooth south."}
  ]},
 {id:"tethys",name:"Tethys",kind:"moon",parent:"saturn",R:531.1,a:294619,P:1.888,tex:"tethys",rot:"sync",interior:"icyDiff",
  facts:{"Diameter":"1,062 km","Orbit":"1.89 days","Density":"Almost pure water ice"},
  blurb:"An icy moon so low in density it must be nearly all water ice.",
  features:[{n:"Odysseus",lat:32,lon:-128,d:"A 445 km crater, two-fifths of the moon's diameter, with a flattened floor."},{n:"Ithaca Chasma",lat:-10,lon:5,d:"A canyon 100 km wide and 2,000 km long that wraps three-quarters of the way around."}]},
 {id:"telesto",name:"Telesto",kind:"moon",parent:"saturn",R:12,a:294619,P:1.888,phase:60,tex:"icy",lumpy:[16,12,10],rot:"sync",interior:"icyMixed",facts:{"Size":"~25 km","Orbit":"Leads Tethys by 60°"},blurb:"A Trojan moon riding 60° ahead of Tethys in a gravitational sweet spot."},
 {id:"calypso",name:"Calypso",kind:"moon",parent:"saturn",R:10,a:294619,P:1.888,phase:-60,tex:"icy",lumpy:[15,11,7],rot:"sync",interior:"icyMixed",facts:{"Size":"~21 km","Orbit":"Trails Tethys by 60°"},blurb:"Tethys' trailing Trojan companion."},
 {id:"dione",name:"Dione",kind:"moon",parent:"saturn",R:561.4,a:377396,P:2.737,tex:"dione",rot:"sync",interior:"icyDiff",
  facts:{"Diameter":"1,123 km","Orbit":"2.74 days"},blurb:"Bright ice cliffs and a possible deep ocean.",
  features:[{n:"Wispy terrain",lat:10,lon:30,d:"The 'wisps' turned out to be ice cliffs hundreds of metres high, formed by tectonic fracturing."}]},
 {id:"helene",name:"Helene",kind:"moon",parent:"saturn",R:18,a:377396,P:2.737,phase:60,tex:"icy",lumpy:[23,19,13],rot:"sync",interior:"icyMixed",facts:{"Size":"~35 km","Orbit":"Leads Dione by 60°"},blurb:"Dione's Trojan, coated with fine dust from the E ring."},
 {id:"rhea",name:"Rhea",kind:"moon",parent:"saturn",R:763.8,a:527108,P:4.518,tex:"rhea",rot:"sync",interior:"icyMixed",
  facts:{"Diameter":"1,527 km","Orbit":"4.5 days"},blurb:"Saturn's second-largest moon, an icy, heavily cratered world with a thin oxygen atmosphere.",
  features:[{n:"Inktomi",lat:-14,lon:-112,d:"A young crater whose bright rays give it the nickname 'the Splat'."},{n:"Wispy fractures",lat:5,lon:60,d:"Bright ice cliffs on the trailing side, like Dione's."}]},
 {id:"titan",name:"Titan",kind:"moon",parent:"saturn",R:2574.7,a:1221870,P:15.945,tex:"titan",veil:{tex:"titan_haze",color:"#d9902f",label:"Haze",alt:"Radar & infrared surface"},atmo:"#e7a24a",rot:"sync",interior:"titan",
  facts:{"Diameter":"5,150 km","From Saturn":"1.22 million km","Orbit":"15.9 days","Surface":"−179 °C, 1.5× Earth's air pressure"},
  blurb:"The only moon with a thick atmosphere, and the only place besides Earth with liquid lakes and seas, made of methane and ethane. NASA's Dragonfly rotorcraft is set to launch in 2028.",
  features:[
   {n:"Kraken Mare",lat:68,lon:50,d:"The largest sea on Titan, bigger than the Caspian Sea, filled with liquid methane and ethane."},
   {n:"Ligeia Mare",lat:79,lon:112,d:"A methane sea about 160 m deep. Radar showed waves and 'magic islands' that come and go."},
   {n:"Huygens landing site",lat:-10.6,lon:167.7,d:"ESA's Huygens probe landed here in 2005, the most distant landing ever, and photographed rounded ice pebbles."},
   {n:"Selk crater",lat:7,lon:161,d:"Dragonfly's target, where liquid water and organics may once have mixed after an impact."},
   {n:"Equatorial dunes",lat:-5,lon:-60,d:"Dune seas of organic grains, shaped like Namibia's sand dunes."}
  ]},
 {id:"hyperion",name:"Hyperion",kind:"moon",parent:"saturn",R:135,a:1500880,P:21.28,tex:"hyperion",lumpy:[180,133,103],rot:-13,interior:"icyMixed",
  facts:{"Size":"360 × 266 × 205 km","Orbit":"21.3 days","Spin":"Chaotic"},blurb:"A sponge-like moon about 40% empty space. It tumbles chaotically, so its spin is unpredictable.",
  features:[{n:"Sponge craters",lat:20,lon:0,d:"Deep, sharp-edged pits: impacts compress the porous ice instead of blasting it out."}]},
 {id:"iapetus",name:"Iapetus",kind:"moon",parent:"saturn",R:734.5,a:3560820,P:79.32,inc:15.5,tex:"iapetus",rot:"sync",interior:"icyDiff",
  facts:{"Diameter":"1,469 km","Orbit":"79 days","Orbit tilt":"15.5°"},blurb:"The two-toned moon: one hemisphere is as dark as coal, the other as bright as snow.",
  features:[{n:"Cassini Regio",lat:0,lon:-90,d:"The dark leading hemisphere picks up dust and warms; ice evaporates and refreezes on the bright side, sharpening the contrast."},{n:"Equatorial ridge",lat:0,lon:120,d:"A mountain ridge up to 20 km high running along the equator, like a walnut seam."}]},
 {id:"kiviuq",name:"Kiviuq",kind:"moon",parent:"saturn",R:8,a:11110000,P:449,inc:46,tex:"asteroid",tint:"#7d6c60",lumpy:1,interior:"rubble",facts:{"Diameter":"~17 km","Orbit":"449 days"},blurb:"An irregular moon of the Inuit group, with an elongated, possibly two-lobed shape."},
 {id:"phoebe",name:"Phoebe",kind:"moon",parent:"saturn",R:106.5,a:12947780,P:-550.3,inc:175,tex:"phoebe",lumpy:[109,108,102],rot:9.3,interior:"rubble",
  facts:{"Diameter":"213 km","Orbit":"550 days, retrograde"},blurb:"A captured relic from the outer Solar System. Dust from it forms a faint ring extending roughly 6–16 million km from Saturn’s center.",
  features:[{n:"Jason crater",lat:16,lon:-40,d:"A 100 km crater; impacts reveal bright ice under a dark coating."}]},
 {id:"siarnaq",name:"Siarnaq",kind:"moon",parent:"saturn",R:20,a:18195000,P:895.5,inc:46,tex:"asteroid",tint:"#7d6c60",lumpy:1,interior:"rubble",facts:{"Diameter":"~40 km","Orbit":"896 days"},blurb:"The largest moon of Saturn's Inuit group."},
 {id:"ymir",name:"Ymir",kind:"moon",parent:"saturn",R:9,a:23040000,P:-1315,inc:173,tex:"asteroid",tint:"#5a5550",lumpy:1,interior:"rubble",facts:{"Diameter":"~19 km","Orbit":"3.6 years, retrograde"},blurb:"A dark Norse-group moon on one of the longest orbits around Saturn."},

 /* Uranus */
 {id:"uranus",name:"Uranus",kind:"planet",R:25362,a:19.1913,e:.04717,i:.770,node:74.006,peri:96.999,M0:142.238,tex:"uranus",atmo:"#a9e3ec",tilt:97.77,rot:-17.24,interior:"uranus",rings:"uranus",
  facts:{"Diameter":"50,724 km (4 Earths)","From Sun":"2.9 billion km (19.2 AU)","Year":"84 Earth years","Day":"17 h 14 min","Cloud tops":"−224 °C, coldest planet","Moons":"29 known"},
  blurb:"An ice giant knocked on its side, probably by an ancient collision. Each pole gets 42 years of continuous sunlight followed by 42 years of darkness. Only Voyager 2 has visited, in 1986.",
  features:[
   {n:"North polar haze",lat:80,lon:0,d:"A bright cap of haze has grown as the north pole tipped toward the Sun approaching the 2028 solstice."},
   {n:"Storm bands",lat:30,lon:60,d:"Bright methane-ice clouds appear more often as seasons change."},
   {n:"Epsilon ring",ring:2.0,d:"The brightest of Uranus' 13 narrow, dark rings. They were discovered in 1977 when they blocked a star's light."}
  ]},
 {id:"cordelia",name:"Cordelia",kind:"moon",parent:"uranus",R:20,a:49770,P:.335,tex:"asteroid",tint:"#55504c",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~40 km","Orbit":"8 hours"},blurb:"Inner shepherd of the epsilon ring."},
 {id:"ophelia",name:"Ophelia",kind:"moon",parent:"uranus",R:21,a:53790,P:.376,tex:"asteroid",tint:"#55504c",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~43 km","Orbit":"9 hours"},blurb:"Outer shepherd of the epsilon ring."},
 {id:"bianca",name:"Bianca",kind:"moon",parent:"uranus",R:26,a:59170,P:.435,tex:"asteroid",tint:"#55504c",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~51 km"},blurb:"One of a crowded swarm of small inner moons."},
 {id:"cressida",name:"Cressida",kind:"moon",parent:"uranus",R:40,a:61780,P:.464,tex:"asteroid",tint:"#55504c",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~80 km"},blurb:"May collide with Desdemona within a million years."},
 {id:"desdemona",name:"Desdemona",kind:"moon",parent:"uranus",R:32,a:62680,P:.474,tex:"asteroid",tint:"#55504c",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~64 km"},blurb:"Part of the Portia group of inner moons."},
 {id:"juliet",name:"Juliet",kind:"moon",parent:"uranus",R:47,a:64350,P:.493,tex:"asteroid",tint:"#55504c",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~94 km"},blurb:"Uranus' inner moons are among the most dynamically unstable systems known."},
 {id:"portia",name:"Portia",kind:"moon",parent:"uranus",R:68,a:66090,P:.513,tex:"asteroid",tint:"#55504c",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~135 km"},blurb:"Largest of the Portia group."},
 {id:"rosalind",name:"Rosalind",kind:"moon",parent:"uranus",R:36,a:69940,P:.558,tex:"asteroid",tint:"#55504c",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~72 km"},blurb:"A small dark inner moon."},
 {id:"belinda",name:"Belinda",kind:"moon",parent:"uranus",R:40,a:75260,P:.624,tex:"asteroid",tint:"#55504c",lumpy:[64,32,32],rot:"sync",interior:"rubble",facts:{"Size":"128 × 64 km"},blurb:"An elongated inner moon."},
 {id:"puck",name:"Puck",kind:"moon",parent:"uranus",R:81,a:86010,P:.762,tex:"puck",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~162 km","Orbit":"18 hours"},blurb:"The largest inner moon, found by Voyager 2 in 1985."},
 {id:"mab",name:"Mab",kind:"moon",parent:"uranus",R:6,a:97736,P:.923,tex:"icy",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~12 km"},blurb:"Feeds Uranus' faint blue outer ring."},
 {id:"miranda",name:"Miranda",kind:"moon",parent:"uranus",R:235.8,a:129390,P:1.413,inc:4.3,tex:"miranda",rot:"sync",interior:"icyDiff",
  facts:{"Diameter":"472 km","Orbit":"1.41 days"},blurb:"A patchwork moon with some of the strangest terrain in the Solar System, possibly torn apart and reassembled.",
  features:[{n:"Verona Rupes",lat:10,lon:-10,d:"A cliff about 20 km high, the tallest known. A rock dropped from the top would fall for about 12 minutes."},{n:"Coronae",lat:30,lon:-100,d:"Racetrack-shaped regions of grooves and ridges, likely formed by warm ice welling up."}]},
 {id:"ariel",name:"Ariel",kind:"moon",parent:"uranus",R:578.9,a:191020,P:2.520,tex:"ariel",rot:"sync",interior:"icyDiff",facts:{"Diameter":"1,158 km","Orbit":"2.52 days"},blurb:"The brightest and possibly youngest-surfaced of Uranus' major moons, with deep rift valleys.",
  features:[{n:"Kachina Chasmata",lat:30,lon:-20,d:"Rift valleys over 600 km long, floored with smooth, flowed ice."}]},
 {id:"umbriel",name:"Umbriel",kind:"moon",parent:"uranus",R:584.7,a:266300,P:4.144,tex:"umbriel",rot:"sync",interior:"icyDiff",facts:{"Diameter":"1,169 km","Orbit":"4.1 days"},blurb:"The darkest of the large Uranian moons, ancient and heavily cratered.",
  features:[{n:"Wunda",lat:-8,lon:-87,d:"A mysterious bright ring 130 km across at the edge of the imaged region, like a glowing fairy ring."}]},
 {id:"titania",name:"Titania",kind:"moon",parent:"uranus",R:788.4,a:435910,P:8.706,tex:"titania",rot:"sync",interior:"icyDiff",facts:{"Diameter":"1,577 km","Orbit":"8.7 days"},blurb:"Uranus' largest moon, scarred by huge canyons. It may hide a thin ocean.",
  features:[{n:"Messina Chasmata",lat:-25,lon:-30,d:"A canyon about 1,500 km long."}]},
 {id:"oberon",name:"Oberon",kind:"moon",parent:"uranus",R:761.4,a:583520,P:13.46,tex:"oberon",rot:"sync",interior:"icyDiff",facts:{"Diameter":"1,523 km","Orbit":"13.5 days"},blurb:"The outermost large moon, old and cratered, with an 11 km mountain on its edge."},
 {id:"caliban",name:"Caliban",kind:"moon",parent:"uranus",R:36,a:7231000,P:-579.7,inc:141,tex:"asteroid",tint:"#8a5a48",lumpy:1,interior:"rubble",facts:{"Diameter":"~72 km","Orbit":"580 days, retrograde"},blurb:"A reddish captured moon."},
 {id:"sycorax",name:"Sycorax",kind:"moon",parent:"uranus",R:75,a:12179000,P:-1288,inc:159,tex:"asteroid",tint:"#8a5a48",lumpy:1,interior:"rubble",facts:{"Diameter":"~150 km","Orbit":"3.5 years, retrograde"},blurb:"The largest irregular moon of Uranus."},

 /* Neptune */
 {id:"neptune",name:"Neptune",kind:"planet",R:24622,a:30.0690,e:.00859,i:1.769,node:131.784,peri:276.336,M0:256.228,tex:"neptune",atmo:"#5d8fff",tilt:28.32,rot:16.11,interior:"neptune",rings:"neptune",
  facts:{"Diameter":"49,244 km","From Sun":"4.5 billion km (30 AU)","Year":"165 Earth years","Day":"16 h 7 min","Winds":"Up to 2,100 km/h","Moons":"16 known"},
  blurb:"The windiest planet, found in 1846 by mathematics before anyone saw it. It radiates more than twice the heat it gets from the Sun.",
  features:[
   {n:"Great Dark Spot",lat:-20,lon:-36,d:"An Earth-sized storm Voyager 2 saw in 1989. It had vanished by 1994; new dark spots come and go."},
   {n:"Scooter",lat:-42,lon:60,d:"A fast-moving white cloud that zipped around the planet faster than the dark spots."},
   {n:"Adams ring arcs",ring:2.54,d:"Clumps called Liberté, Égalité and Fraternité in an otherwise thin ring, held together by the moon Galatea."}
  ]},
 {id:"naiad",name:"Naiad",kind:"moon",parent:"neptune",R:33,a:48227,P:.294,inc:4.7,tex:"asteroid",tint:"#5d5a58",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~66 km"},blurb:"Dances around Thalassa in a zig-zag orbital resonance."},
 {id:"thalassa",name:"Thalassa",kind:"moon",parent:"neptune",R:41,a:50074,P:.311,tex:"asteroid",tint:"#5d5a58",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~82 km"},blurb:"A disc-shaped inner moon."},
 {id:"despina",name:"Despina",kind:"moon",parent:"neptune",R:75,a:52526,P:.335,tex:"asteroid",tint:"#5d5a58",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~150 km"},blurb:"Shepherds the Le Verrier ring."},
 {id:"galatea",name:"Galatea",kind:"moon",parent:"neptune",R:88,a:61953,P:.429,tex:"asteroid",tint:"#5d5a58",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~176 km"},blurb:"Its gravity keeps the Adams ring arcs bunched."},
 {id:"larissa",name:"Larissa",kind:"moon",parent:"neptune",R:97,a:73548,P:.555,tex:"asteroid",tint:"#5d5a58",lumpy:[108,102,84],rot:"sync",interior:"rubble",facts:{"Diameter":"~194 km"},blurb:"A battered inner moon."},
 {id:"hippocamp",name:"Hippocamp",kind:"moon",parent:"neptune",R:17,a:105283,P:.95,tex:"asteroid",tint:"#5d5a58",lumpy:1,rot:"sync",interior:"rubble",facts:{"Diameter":"~35 km"},blurb:"Found in Hubble images in 2013. It may be a chip knocked off Proteus."},
 {id:"proteus",name:"Proteus",kind:"moon",parent:"neptune",R:210,a:117646,P:1.122,tex:"asteroid",tint:"#5d5a58",lumpy:[218,208,201],rot:"sync",interior:"rubble",facts:{"Diameter":"~420 km","Orbit":"1.12 days"},blurb:"About as large as a body can be without gravity pulling it round."},
 {id:"triton",name:"Triton",kind:"moon",parent:"neptune",R:1353.4,a:354759,P:-5.877,inc:157,tex:"triton",rot:"sync",interior:"triton",atmo:"#cdd8e8",atmoThin:1,
  facts:{"Diameter":"2,707 km","Orbit":"5.88 days, retrograde","Surface":"−235 °C"},
  blurb:"A captured Kuiper Belt world orbiting backwards. It is one of the coldest surfaces measured, yet has active nitrogen geysers. In about 3.6 billion years tides will tear it apart.",
  features:[{n:"Polar cap & geysers",lat:-45,lon:20,plume:{h:.06,spread:.05,col:"#9a9088",n:900,speed:.25,size:.008},d:"Dark plumes up to 8 km high leave streaks on the nitrogen frost of the polar cap."},{n:"Cantaloupe terrain",lat:25,lon:-100,d:"Dimpled terrain unlike anything else, possibly from blobs of ice rising through the crust."}]},
 {id:"nereid",name:"Nereid",kind:"moon",parent:"neptune",R:170,a:5513818,P:360.1,inc:7,ecc:.75,tex:"icy",tint:"#b0aba5",interior:"icyMixed",facts:{"Diameter":"~340 km","Orbit":"360 days, very eccentric"},blurb:"Has one of the most stretched orbits of any moon, swinging from 1.4 to 9.7 million km from Neptune."},
 {id:"halimede",name:"Halimede",kind:"moon",parent:"neptune",R:31,a:16611000,P:-1879,inc:134,tex:"asteroid",tint:"#5d5a58",lumpy:1,interior:"rubble",facts:{"Diameter":"~62 km","Orbit":"5.1 years, retrograde"},blurb:"A distant irregular moon, possibly a fragment of Nereid."},
 {id:"neso",name:"Neso",kind:"moon",parent:"neptune",R:30,a:49285000,P:-9741,inc:132,tex:"asteroid",tint:"#5d5a58",lumpy:1,interior:"rubble",facts:{"Diameter":"~60 km","Orbit":"26.7 years"},blurb:"One of Neptune’s most distant known moons: its orbit reaches more than 70 million km."},

 /* Trans-Neptunian */
 {id:"pluto",name:"Pluto",kind:"dwarf",R:1188.3,a:39.482,e:.2488,i:17.14,node:110.30,peri:113.76,M0:14.53,tex:"pluto",atmo:"#b9c9e8",atmoThin:1,tilt:122.5,rot:-153.3,interior:"pluto",
  facts:{"Diameter":"2,377 km","From Sun":"30–49 AU","Year":"248 Earth years","Day":"6.4 Earth days","Surface":"−230 °C","Moons":"5"},
  blurb:"Reclassified as a dwarf planet in 2006, then revealed by New Horizons in 2015 as a surprisingly active world with glaciers, mountains of water ice and blue haze.",
  features:[
   {n:"Sputnik Planitia",lat:20,lon:175,d:"The left lobe of the 'heart': a 1,000 km basin of churning nitrogen ice cells that slowly overturn."},
   {n:"Tombaugh Regio",lat:15,lon:-160,d:"The bright 'heart', named for Clyde Tombaugh who discovered Pluto in 1930."},
   {n:"Cthulhu Macula",lat:-3,lon:100,d:"A long, dark red region coloured by tholins, organic molecules made by sunlight acting on methane."},
   {n:"Wright Mons",lat:-21,lon:173,d:"A possible giant ice volcano 4 km high and 150 km wide."},
   {n:"Tartarus Dorsa",lat:15,lon:-135,d:"'Bladed terrain' of methane-ice ridges as tall as skyscrapers."}
  ]},
 {id:"charon",name:"Charon",kind:"moon",parent:"pluto",R:606,a:19591,P:6.387,tex:"charon",rot:"sync",interior:"charon",
  facts:{"Diameter":"1,212 km","Orbit":"6.4 days"},blurb:"Half Pluto's size. Pluto and Charon are tidally locked to each other, each always showing the other the same face, and they orbit a point in empty space between them.",
  features:[{n:"Mordor Macula",lat:85,lon:0,d:"A dark red polar cap made from gas escaping Pluto that freezes and is cooked by sunlight."},{n:"Serenity Chasma",lat:20,lon:30,d:"Part of a canyon belt over 1,600 km long, cracked open when an ancient ocean froze and expanded."}]},
 {id:"styx",name:"Styx",kind:"moon",parent:"pluto",R:5,a:42656,P:20.16,tex:"icy",lumpy:1,interior:"icyMixed",facts:{"Size":"~16 × 9 km"},blurb:"The smallest of Pluto's moons."},
 {id:"nix",name:"Nix",kind:"moon",parent:"pluto",R:20,a:48694,P:24.85,tex:"nix",lumpy:[25,17,16],rot:43,interior:"icyMixed",facts:{"Size":"50 × 35 × 33 km"},blurb:"Tumbles chaotically. A reddish crater marks one side."},
 {id:"kerberos",name:"Kerberos",kind:"moon",parent:"pluto",R:6,a:57783,P:32.17,tex:"icy",lumpy:[9,6,4],interior:"icyMixed",facts:{"Size":"~19 × 10 km"},blurb:"Two lobes, like a tiny snowman."},
 {id:"hydra",name:"Hydra",kind:"moon",parent:"pluto",R:25,a:64738,P:38.2,tex:"icy",lumpy:[25,17,15],interior:"icyMixed",facts:{"Size":"51 × 36 km"},blurb:"Pluto's outermost moon, covered in clean water ice."},

 {id:"arrokoth",name:"Arrokoth",kind:"small",R:9,a:44.58,e:.042,i:2.45,node:158.9,peri:174.4,M0:316,tex:"arrokoth",contact:1,rot:15.92,interior:"icyMixed",
  facts:{"Size":"36 km long","From Sun":"44.6 AU","Year":"298 Earth years","Visited":"New Horizons, 1 January 2019"},
  blurb:"The most distant object ever explored up close. Two flattened lobes merged gently 4.5 billion years ago, a snapshot of how planets began.",
  features:[{n:"The 'neck'",lat:0,lon:0,d:"The bright collar where the two lobes touched at walking speed."}]},
 {id:"orcus",name:"Orcus",kind:"dwarf",R:455,a:39.17,e:.227,i:20.6,node:268.8,peri:72.3,M0:181,tex:"icy",tint:"#b8b4b0",interior:"dwarfIcy",
  facts:{"Diameter":"~910 km","From Sun":"30.3–48.1 AU","Year":"245 years","Moons":"1 (Vanth)"},blurb:"The 'anti-Pluto': it shares Pluto's orbit size but is always on the opposite side of its path."},
 {id:"vanth",name:"Vanth",kind:"moon",parent:"orcus",R:221,a:9000,P:9.54,tex:"rocky",tint:"#8c8580",rot:"sync",interior:"icyMixed",facts:{"Diameter":"~442 km"},blurb:"Unusually large compared with Orcus."},
 {id:"haumea",name:"Haumea",kind:"dwarf",R:816,a:43.13,e:.195,i:28.2,node:122.2,peri:239.0,M0:218,tex:"icy",tint:"#f2f4f6",shape:[1161,852,513],rot:3.915,interior:"haumea",ring:{inner:2.75,outer:2.85,color:"#d8d8d8",opacity:.45},
  facts:{"Size":"~2,320 × 1,700 × 1,030 km","From Sun":"43 AU","Year":"284 years","Day":"3.9 hours","Moons":"2"},
  blurb:"Spins so fast, once every 3.9 hours, that it has stretched into an egg shape. It has a ring, found in 2017, and a dark red spot.",
  features:[{n:"Ring",ring:2.8,d:"A narrow ring about 70 km wide, the first found around a dwarf planet."},{n:"Dark red spot",lat:0,lon:30,d:"A patch richer in minerals or organics than the bright ice around it."}]},
 {id:"hiiaka",name:"Hiʻiaka",kind:"moon",parent:"haumea",R:160,a:49880,P:49.12,tex:"icy",interior:"icyMixed",facts:{"Diameter":"~320 km"},blurb:"Haumea's larger moon, coated with crystalline water ice."},
 {id:"namaka",name:"Namaka",kind:"moon",parent:"haumea",R:85,a:25657,P:18.28,inc:13,tex:"icy",interior:"icyMixed",facts:{"Diameter":"~170 km"},blurb:"The smaller, inner moon of Haumea."},
 {id:"quaoar",name:"Quaoar",kind:"dwarf",R:545,a:43.69,e:.040,i:8.0,node:188.8,peri:147.5,M0:301,tex:"rocky",tint:"#a07a66",interior:"dwarfIcy",ring:{inner:7.3,outer:7.5,color:"#bfa898",opacity:.35},
  facts:{"Diameter":"~1,090 km","From Sun":"43.7 AU","Year":"289 years","Moons":"1 (Weywot)"},blurb:"Has rings far outside the distance where they should clump into moons, a puzzle for theory."},
 {id:"weywot",name:"Weywot",kind:"moon",parent:"quaoar",R:100,a:13300,P:12.4,tex:"rocky",tint:"#8a7a70",interior:"icyMixed",facts:{"Diameter":"~200 km"},blurb:"Quaoar's moon."},
 {id:"makemake",name:"Makemake",kind:"dwarf",R:715,a:45.43,e:.161,i:29.0,node:79.6,peri:294.8,M0:165,tex:"icy",tint:"#e2b38c",rot:22.8,interior:"dwarfIcy",
  facts:{"Diameter":"~1,430 km","From Sun":"45.4 AU","Year":"306 years","Moons":"1"},blurb:"A reddish-brown dwarf planet covered in methane frost, discovered just after Easter 2005 and named for the Rapa Nui creator god."},
 {id:"mk2",name:"MK 2",kind:"moon",parent:"makemake",R:80,a:21000,P:12.4,tex:"rocky",tint:"#3a3634",interior:"icyMixed",facts:{"Diameter":"~160 km","Found":"2016, by Hubble"},blurb:"A dark, coal-coloured moon."},
 {id:"gonggong",name:"Gonggong",kind:"dwarf",R:615,a:67.49,e:.503,i:30.7,node:336.8,peri:207.2,M0:106,tex:"rocky",tint:"#b0614a",interior:"dwarfIcy",
  facts:{"Diameter":"~1,230 km","From Sun":"33–101 AU","Year":"554 years","Moons":"1 (Xiangliu)"},blurb:"One of the reddest large objects in the Solar System, named for a Chinese water god."},
 {id:"xiangliu",name:"Xiangliu",kind:"moon",parent:"gonggong",R:50,a:24000,P:25.2,tex:"rocky",tint:"#8a6050",interior:"icyMixed",facts:{"Diameter":"~100 km"},blurb:"Gonggong's moon."},
 {id:"eris",name:"Eris",kind:"dwarf",R:1163,a:67.86,e:.4361,i:44.04,node:35.95,peri:151.6,M0:205,tex:"icy",tint:"#f4f3f0",tilt:78,rot:378,interior:"dwarfIcy",
  facts:{"Diameter":"2,326 km","From Sun":"38–98 AU (now ~96)","Year":"559 years","Moons":"1 (Dysnomia)","Reflectivity":"96%"},
  blurb:"Almost the same size as Pluto and more massive. Its discovery in 2005 led to the definition of 'dwarf planet'. Its methane atmosphere freezes onto the surface as it travels away from the Sun."},
 {id:"dysnomia",name:"Dysnomia",kind:"moon",parent:"eris",R:307,a:37350,P:15.79,tex:"rocky",tint:"#4a4644",interior:"icyMixed",facts:{"Diameter":"~615 km"},blurb:"A large, dark moon that keeps Eris tidally locked to it."},
 {id:"sedna",name:"Sedna",kind:"dwarf",R:500,a:506,e:.855,i:11.93,node:144.25,peri:311.3,M0:358.2,tex:"rocky",tint:"#b14c38",interior:"dwarfIcy",
  facts:{"Diameter":"~1,000 km","From Sun":"Perihelion: about 76 AU, up to ~940 AU","Year":"~11,400 years","Perihelion":"July 2076"},
  blurb:"A deep-red world that never comes close to Neptune. Its strange orbit is one of the clues behind the Planet Nine idea."},

 {id:"halley",name:"Halley's Comet",kind:"comet",R:5.5,a:17.834,e:.96714,i:162.26,node:58.42,peri:111.33,Tp:1986.11,tex:"comet",tint:"#4b4844",lumpy:[7.5,4.2,4.0],rot:52.8,interior:"comet",
  facts:{"Nucleus":"15 × 8 × 8 km","Orbit":"About 76 years, retrograde","Closest to Sun":"0.59 AU","Farthest":"35 AU (passed Dec 2023)","Next return":"July 2061"},
  blurb:"The most famous comet, seen and recorded for over 2,000 years. Halley used its returns to prove comets orbit the Sun. In 1986 ESA's Giotto photographed its peanut-shaped nucleus. It is heading back toward the Sun now.",
  features:[{n:"Jets",lat:20,lon:30,d:"Near the Sun, jets of gas and dust burst through the dark crust, building a coma and two tails millions of km long."},{n:"Giotto's view (1986)",lat:-10,lon:-60,d:"Giotto flew within 596 km of the nucleus on 14 March 1986 and showed it was one of the darkest objects known."}]},

 {id:"ninth",name:"Planet Nine",kind:"hypo",R:16000,a:500,e:.25,i:16,node:96,peri:150,M0:180,tex:"ninth",tint:"#9fb7cc",atmo:"#8fb4d9",interior:"ninth",rot:20,
  facts:{"Status":"Hypothetical, not observed","Mass":"~5–6 Earths (predicted)","From Sun":"~300–700 AU","Year":"~10,000+ years","Brightness":"Fainter than magnitude 21"},
  blurb:"Proposed in 2016 to explain why several extreme Kuiper Belt objects have clustered orbits. No telescope has found it yet. The Vera C. Rubin Observatory, surveying since 2025, should settle the question. Its size, position and appearance here are illustrative."}
];

/* Moon counts beyond the named moons modelled individually (NASA, mid-2026). */
const MOON_TOTALS = {jupiter:115, saturn:293, uranus:29, neptune:16};

/* Regions (not single bodies) */
const REGIONS = [
 {id:"belt",name:"Asteroid Belt",range:[2.1,3.3],
  facts:{"Distance":"2.1–3.3 AU","Known asteroids":"Over 1.3 million","Total mass":"About 3% of the Moon's","Typical spacing":"~1 million km apart"},
  blurb:"Leftover building blocks that Jupiter's gravity kept from forming a planet. Despite films, it is mostly empty space; spacecraft cross it without dodging.",
  features:[{n:"Kirkwood gaps",d:"Empty lanes where an asteroid's orbit would resonate with Jupiter's, which kicks it out."},{n:"Jupiter Trojans",d:"Two swarms of asteroids sharing Jupiter's orbit, 60° ahead and behind. NASA's Lucy is visiting them through 2033."}]},
 {id:"kuiper",name:"Kuiper Belt",range:[30,50],
  facts:{"Distance":"30–50 AU","Objects larger than 100 km":"Estimated 100,000+","Notable":"Pluto, Haumea, Makemake, Quaoar, Arrokoth"},
  blurb:"A thick doughnut of icy bodies beyond Neptune, the source of many short-period comets. It is like the asteroid belt but around 20 times wider and up to 200 times more massive.",
  features:[{n:"Plutinos",d:"Objects like Pluto that orbit twice for every three of Neptune's, which protects them from close encounters."},{n:"Scattered disc",d:"Bodies like Eris flung onto long, tilted orbits by Neptune."}]},
 {id:"helio",name:"Heliosphere",range:[94,120],
  facts:{"Termination shock":"~94 AU","Heliopause":"~120 AU","Crossed by":"Voyager 1 (2012) and Voyager 2 (2018)"},
  blurb:"The bubble blown into interstellar space by the solar wind. Its edge, the heliopause, is where the Sun's influence gives way to the galaxy's."},
 {id:"oort",name:"Oort Cloud",range:[2000,100000],
  facts:{"Distance":"~2,000 to 100,000 AU (up to 1.5 light-years)","Objects":"Possibly trillions","Status":"Never directly observed"},
  blurb:"A vast, spherical shell of icy bodies that marks the outer edge of the Sun's gravitational reach and is the source of long-period comets. Voyager 1 would need about 300 years to reach its inner edge. Distances here are heavily compressed.",
  features:[{n:"Inner (Hills) cloud",d:"A denser, disc-like inner region from about 2,000 to 20,000 AU."},{n:"Outer cloud",d:"A loose sphere nudged by passing stars and the galaxy's tides, which occasionally send comets inward."}]}
];

/* every other known moon, from Wikipedia's moon tables (Oct 2026). Saturn's Inuit and Gallic inclinations are
   group averages and Saturn's irregular periods are computed from their orbits. */
const MINOR_MOONS = {"jupiter":[["Themisto",9.0,7397000,129.97,44.3,"Themisto"],["S/2011 J 4",3.0,11104600,239.05,28.5,"Himalia"],["Ersa",3.0,11399400,248.62,29.0,"Himalia"],["S/2018 J 2",3.0,11419700,249.28,28.3,"Himalia"],["Pandia",3.0,11479600,251.23,28.9,"Himalia"],["Lysithea",42.2,11699100,258.5,27.7,"Himalia"],["S/2011 J 3",3.0,11716800,259.09,27.6,"Himalia"],["S/2017 J 17",1.0,11776100,261.07,29.0,"Himalia"],["Dia",4.0,12257900,277.25,29.1,"Himalia"],["S/2018 J 4",2.0,16328500,426.26,50.2,"Carpo"],["Carpo",3.0,17039500,454.4,53.3,"Carpo"],["Valetudo",1.0,18690100,522.07,34.5,"Valetudo"],["Euporie",2.0,19261900,-546.18,145.5,"Ananke"],["S/2003 J 18",2.0,20332800,-592.33,145.7,"Ananke"],["Eupheme",2.0,20763400,-611.32,147.9,"Ananke"],["S/2021 J 3",2.0,20776600,-611.87,147.9,"Ananke"],["S/2010 J 2",1.0,20786900,-612.35,148.0,"Ananke"],["S/2016 J 1",1.0,20796700,-612.78,145.1,"Ananke"],["Mneme",2.0,20815800,-613.61,147.8,"Ananke"],["Euanthe",3.0,20822900,-613.93,148.1,"Ananke"],["S/2003 J 16",2.0,20877500,-616.34,147.8,"Ananke"],["Harpalyke",4.0,20887500,-616.78,147.8,"Ananke"],["Orthosie",2.0,20897800,-617.23,144.2,"Ananke"],["Helike",4.0,20911400,-617.86,154.4,"Ananke"],["S/2021 J 2",1.0,20926600,-618.5,148.1,"Ananke"],["Praxidike",7.0,20931100,-618.72,148.2,"Ananke"],["S/2017 J 3",2.0,20936500,-618.97,147.9,"Ananke"],["S/2021 J 1",1.0,20954700,-619.77,150.5,"Ananke"],["S/2003 J 12",1.0,20959300,-619.96,150.0,"Ananke"],["S/2017 J 7",2.0,20960400,-620.02,147.4,"Ananke"],["Thelxinoe",2.0,20972300,-620.55,150.7,"Ananke"],["Thyone",4.0,20972700,-620.59,147.6,"Ananke"],["S/2021 J 8",1.0,20978900,-620.85,147.1,"Ananke"],["S/2003 J 2",2.0,20992900,-621.47,150.1,"Ananke"],["S/2022 J 3",1.0,21015100,-622.44,148.1,"Ananke"],["Iocaste",5.0,21062300,-624.55,148.7,"Ananke"],["S/2017 J 10",1.0,21075800,-625.15,145.1,"Ananke"],["Hermippe",4.0,21103600,-626.38,150.2,"Ananke"],["S/2010 J 6",2.0,21489800,-643.67,149.9,"Ananke"],["S/2017 J 9",3.0,21764200,-656.05,155.4,"Ananke"],["Philophrosyne",2.0,22600200,-694.2,146.1,"Pasiphae"],["S/2016 J 3",2.0,22719300,-699.76,164.6,"Carme"],["S/2022 J 1",1.0,22744700,-700.93,164.5,"Carme"],["S/2010 J 4",1.0,22793400,-703.19,164.6,"Carme"],["S/2017 J 8",1.0,22819600,-704.42,164.8,"Carme"],["Pasithee",2.0,22840800,-705.41,164.5,"Carme"],["S/2017 J 13",1.0,22842700,-705.5,164.5,"Carme"],["S/2021 J 6",1.0,22870400,-706.77,164.9,"Carme"],["S/2003 J 24",2.0,22882400,-707.33,164.6,"Carme"],["Eurydome",3.0,22894500,-707.86,148.9,"Pasiphae"],["S/2011 J 2",1.0,22903400,-708.29,151.7,"Pasiphae"],["S/2003 J 4",2.0,22922300,-709.12,148.3,"Pasiphae"],["S/2017 J 18",2.0,22923800,-709.24,164.9,"Carme"],["Chaldene",4.0,22926300,-709.36,164.7,"Carme"],["S/2017 J 2",2.0,22949600,-710.42,164.5,"Carme"],["Isonoe",4.0,22976300,-711.66,164.9,"Carme"],["S/2017 J 11",1.0,22991300,-712.38,164.8,"Carme"],["S/2017 J 16",1.0,23007800,-713.13,164.7,"Carme"],["Kallichore",2.0,23017100,-713.59,164.7,"Carme"],["S/2021 J 4",1.0,23019700,-713.71,164.6,"Carme"],["Erinome",3.0,23027200,-714.05,164.3,"Carme"],["Kale",2.0,23047800,-715.02,164.6,"Carme"],["Eirene",4.0,23051300,-715.19,164.7,"Carme"],["Aitne",3.0,23059400,-715.54,164.5,"Carme"],["Eukelade",4.0,23062400,-715.69,164.7,"Carme"],["S/2022 J 2",1.0,23073400,-716.21,164.7,"Carme"],["Arche",3.0,23093200,-717.11,164.5,"Carme"],["Taygete",5.0,23103400,-717.59,164.7,"Carme"],["S/2016 J 4",1.0,23113900,-718.04,147.1,"Pasiphae"],["S/2011 J 1",2.0,23120800,-718.42,164.7,"Carme"],["Herse",2.0,23146700,-719.63,164.4,"Carme"],["S/2003 J 19",2.0,23153100,-719.92,164.6,"Carme"],["S/2017 J 15",2.0,23170300,-720.65,149.2,"Pasiphae"],["S/2010 J 1",2.0,23185600,-721.43,164.5,"Carme"],["S/2003 J 9",1.0,23195100,-721.88,164.7,"Carme"],["S/2017 J 5",2.0,23202000,-722.2,164.7,"Carme"],["S/2011 J 6",1.0,23238700,-723.93,164.9,"Carme"],["S/2017 J 6",2.0,23251200,-724.47,149.6,"Pasiphae"],["S/2018 J 5",2.0,23269900,-725.38,164.9,"Carme"],["S/2017 J 12",1.0,23270500,-725.4,164.8,"Carme"],["Kalyke",6.9,23298000,-726.7,164.7,"Carme"],["S/2021 J 7",1.0,23305900,-727.01,149.4,"Pasiphae"],["Hegemone",3.0,23342600,-728.77,152.5,"Pasiphae"],["S/2003 J 10",2.0,23384400,-730.74,164.6,"Carme"],["S/2018 J 3",1.0,23400200,-731.49,164.9,"Carme"],["S/2017 J 14",1.0,23412500,-732.04,142.7,"Pasiphae"],["S/2021 J 5",2.0,23414600,-732.15,164.9,"Carme"],["S/2024 J 1",2.0,23462100,-734.38,164.7,"Carme"],["S/2011 J 5",2.0,23527800,-737.46,164.6,"Carme"],["Sponde",2.0,23538700,-737.95,149.4,"Pasiphae"],["S/2010 J 5",1.0,23581000,-739.99,164.6,"Carme"],["Megaclite",6.0,23640100,-742.77,149.9,"Pasiphae"],["Cyllene",2.0,23650000,-743.21,146.8,"Pasiphae"],["S/2017 J 1",2.0,23739600,-747.44,145.6,"Pasiphae"],["Aoede",4.0,23773100,-749.07,155.7,"Pasiphae"],["Autonoe",4.0,23785200,-749.61,150.7,"Pasiphae"],["Callirrhoe",9.6,23789400,-749.79,144.9,"Pasiphae"],["S/2003 J 23",2.0,23824000,-751.4,144.4,"Pasiphae"],["S/2010 J 3",1.0,23862900,-753.28,148.3,"Pasiphae"],["Kore",2.0,24203300,-769.42,141.7,"Pasiphae"]],"uranus":[["S/2025 U 1",9.0,57844,0.42,4.0,"Inner"],["Cupid",17.8,74396,0.613,2.0,"Belinda"],["Perdita",26.6,76418,0.638,1.6,"Belinda"],["Francisco",22.0,4275700,-267.0,146.8,"Irregular"],["Stephano",32.0,7951400,-677.0,143.6,"Caliban"],["S/2023 U 1",8.0,7976600,-681.0,143.9,"Caliban"],["Trinculo",18.0,8502600,-749.0,167.1,"Irregular"],["Margaret",20.0,14425000,1655.0,60.5,"Irregular"],["Prospero",50.0,16221000,-1974.0,149.4,"Irregular"],["Setebos",47.0,17519800,-2215.0,153.9,"Irregular"],["Ferdinand",21.0,20421400,-2788.0,169.2,"Irregular"]],"neptune":[["Sao",44.0,22239900,2912.72,50.2,"Sao"],["S/2002 N 5",38.0,23414700,3156.556,46.3,"Sao"],["Laomedeia",42.0,23499900,3171.33,36.9,"Sao"],["Psamathe",40.0,47646600,-9149.514,127.8,"Neso"],["S/2021 N 1",25.0,50700200,-10036.651,135.2,"Neso"]],"saturn":[["S/2009 S 1",0.3,116914,0.472,0.0,"Ring moonlet"],["S/2009 S 2",0.3,117059,0.473,0.0,"Ring moonlet"],["Aegaeon",0.66,167500,0.808,0.0,"Ring arc"],["Methone",2.9,194700,1.01,0.0,"Alkyonides"],["Anthe",1.8,198100,1.039,0.0,"Alkyonides"],["Pallene",5.0,212300,1.154,0.2,"Alkyonides"],["Polydeuces",2.6,377200,2.737,0.2,"Dione trojan"],["Paaliaq",30.0,14997900,685.825,45.4,"Inuit"],["Ijiraq",15.0,11344600,451.182,44.9,"Inuit"],["Tarqeq",7.0,17751000,883.084,44.4,"Inuit"],["S/2004 S 31",5.0,17497200,864.213,46.4,"Inuit"],["S/2019 S 1",5.0,11245400,445.277,49.5,"Inuit"],["S/2020 S 1",4.0,11338600,450.824,48.8,"Inuit"],["S/2020 S 3",3.0,18057200,906.032,48.6,"Inuit"],["S/2020 S 5",3.0,18391400,931.301,45.3,"Inuit"],["S/2019 S 6",4.0,18205500,917.216,47.2,"Inuit"],["S/2005 S 4",5.0,11324500,449.983,45.7,"Inuit"],["S/2019 S 14",4.0,17853200,890.721,45.0,"Inuit"],["S/2004 S 54",4.0,11277500,447.185,44.6,"Inuit"],["S/2004 S 55",3.0,11294700,448.208,45.3,"Inuit"],["S/2004 S 58",5.0,18254500,920.922,49.6,"Inuit"],["S/2005 S 6",4.0,18107300,909.805,49.0,"Inuit"],["S/2006 S 23",3.0,18269700,922.072,48.8,"Inuit"],["S/2007 S 10",4.0,11364900,452.393,48.8,"Inuit"],["S/2019 S 22",3.0,11305100,448.827,45.2,"Inuit"],["S/2019 S 23",3.0,11310200,449.131,45.9,"Inuit"],["S/2019 S 24",4.0,11360500,452.131,47.8,"Inuit"],["S/2019 S 25",4.0,11329400,450.275,48.4,"Inuit"],["S/2019 S 26",3.0,11390900,453.947,49.1,"Inuit"],["S/2019 S 32",5.0,17960500,898.763,49.3,"Inuit"],["S/2020 S 11",3.0,11295600,448.262,44.5,"Inuit"],["S/2020 S 12",3.0,11314500,449.387,47.6,"Inuit"],["S/2020 S 13",3.0,11415600,455.424,48.0,"Inuit"],["S/2020 S 19",3.0,17726700,881.271,47.0,"Inuit"],["S/2023 S 1",3.0,11205400,442.903,45.1,"Inuit"],["S/2023 S 2",3.0,11309900,449.113,46.8,"Inuit"],["S/2023 S 3",3.0,17646400,875.29,44.5,"Inuit"],["S/2023 S 6",3.0,11953100,487.965,49.6,"Inuit"],["S/2023 S 7",4.0,12133700,499.066,49.2,"Inuit"],["S/2023 S 19",3.0,17590300,871.119,47.3,"Inuit"],["S/2023 S 22",4.0,18577500,945.472,45.8,"Inuit"],["S/2020 S 48",3.0,11355100,451.808,49.5,"Inuit"],["S/2023 S 56",3.0,11287500,447.78,47.4,"Inuit"],["S/2020 S 49",2.0,11305900,448.875,49.3,"Inuit"],["Tarvos",16.0,18215600,917.98,39.2,"Gallic"],["Erriapus",12.0,17507000,864.939,37.5,"Gallic"],["Albiorix",28.6,16329100,779.132,37.1,"Gallic"],["Bebhionn",7.0,17027200,829.627,38.0,"Gallic"],["S/2004 S 24",3.0,23339000,1331.347,37.2,"Gallic"],["S/2004 S 29",5.0,17064100,832.325,35.8,"Gallic"],["S/2020 S 4",3.0,18236000,919.522,36.5,"Gallic"],["S/2006 S 12",4.0,19569800,1022.227,39.1,"Gallic"],["S/2007 S 8",4.0,17049000,831.22,35.2,"Gallic"],["S/2005 S 7",3.0,18502500,939.752,35.2,"Gallic"],["S/2007 S 11",4.0,17434400,859.564,38.1,"Gallic"],["S/2019 S 29",3.0,17353900,853.618,36.4,"Gallic"],["S/2019 S 31",3.0,17739100,882.196,37.7,"Gallic"],["S/2019 S 34",3.0,18446800,935.512,37.4,"Gallic"],["S/2020 S 15",3.0,16729200,807.943,36.7,"Gallic"],["S/2023 S 17",3.0,17385300,855.936,40.0,"Gallic"],["S/2023 S 18",3.0,17381700,855.67,36.0,"Gallic"],["S/2023 S 54",3.0,17485100,863.316,37.1,"Gallic"],["S/2023 S 55",3.0,16875100,818.535,36.0,"Gallic"],["Thrymr",8.0,20330500,-1082.405,175.0,"Norse"],["Skathi",8.0,15575400,-725.816,151.6,"Norse"],["Mundilfari",7.0,18588200,-946.289,167.1,"Norse"],["Suttungr",7.0,19391900,-1008.32,175.7,"Norse"],["Narvi",7.0,19285000,-999.994,142.2,"Norse"],["Saturn LXVII",5.0,21327600,-1163.003,164.8,"Norse"],["Fornjot",6.0,24936800,-1470.378,170.0,"Norse"],["Farbauti",5.0,20290700,-1079.228,156.2,"Norse"],["Aegir",6.0,20664400,-1109.18,166.1,"Norse"],["S/2004 S 12",4.0,19801000,-1040.396,164.7,"Norse"],["S/2004 S 13",4.0,18453700,-936.037,169.0,"Norse"],["Bergelmir",5.0,19268100,-998.679,158.8,"Norse"],["Hati",5.0,19695000,-1032.052,165.4,"Norse"],["Fenrir",4.0,22330800,-1246.018,164.5,"Norse"],["S/2004 S 17",4.0,19699000,-1032.367,167.9,"Norse"],["Bestla",7.0,20337800,-1082.988,138.3,"Norse"],["Hyrrokkin",8.0,18340900,-927.468,149.9,"Norse"],["S/2006 S 1",5.0,18746300,-958.387,156.1,"Norse"],["Kari",6.0,22032100,-1221.101,153.0,"Norse"],["S/2006 S 3",5.0,21353100,-1165.089,156.1,"Norse"],["Greip",5.0,18380000,-930.435,174.2,"Norse"],["Loge",5.0,22919200,-1295.588,168.1,"Norse"],["Jarnsaxa",6.0,19273500,-999.099,163.0,"Norse"],["Surtur",6.0,22748000,-1281.099,168.4,"Norse"],["Skoll",5.0,17623400,-873.579,159.4,"Norse"],["S/2007 S 2",5.0,15939100,-751.387,174.0,"Norse"],["S/2007 S 3",5.0,19614400,-1025.724,173.8,"Norse"],["Gridr",4.0,19250600,-997.319,163.9,"Norse"],["S/2004 S 21",4.0,23160900,-1316.137,153.2,"Norse"],["Angrboda",4.0,20591500,-1103.316,177.7,"Norse"],["Skrymir",4.0,21447400,-1172.816,175.6,"Norse"],["Gerd",4.0,20947500,-1132.051,174.4,"Norse"],["Saturn LVIII",5.0,26097500,-1574.223,172.9,"Norse"],["Eggther",6.0,19844600,-1043.834,165.0,"Norse"],["S/2004 S 28",5.0,21865900,-1207.31,167.9,"Norse"],["Beli",4.0,20703700,-1112.346,158.9,"Norse"],["Gunnlod",4.0,21141800,-1147.838,160.4,"Norse"],["Thiazzi",4.0,23577500,-1351.806,158.8,"Norse"],["Saturn LXIV",4.0,24145800,-1400.974,168.3,"Norse"],["Alvaldi",6.0,21993800,-1217.918,177.4,"Norse"],["S/2004 S 36",4.0,23390800,-1335.781,153.3,"Norse"],["S/2004 S 37",4.0,15956300,-752.603,158.2,"Norse"],["Geirrod",4.0,22259400,-1240.047,154.4,"Norse"],["S/2004 S 39",4.0,23192400,-1318.822,165.9,"Norse"],["S/2004 S 40",4.0,16075600,-761.059,169.2,"Norse"],["S/2006 S 9",3.0,14406700,-645.676,173.0,"Norse"],["S/2007 S 5",4.0,15835600,-744.08,158.4,"Norse"],["S/2019 S 2",3.0,16560300,-795.738,173.3,"Norse"],["S/2019 S 3",4.0,17077400,-833.298,166.9,"Norse"],["S/2020 S 2",3.0,17869000,-891.904,170.7,"Norse"],["S/2019 S 4",3.0,17951900,-898.118,170.1,"Norse"],["S/2004 S 41",4.0,18095400,-908.908,165.7,"Norse"],["S/2004 S 42",4.0,18240700,-919.878,165.7,"Norse"],["S/2006 S 10",3.0,18979900,-976.357,161.6,"Norse"],["S/2007 S 6",3.0,18545000,-942.992,166.5,"Norse"],["S/2019 S 5",3.0,19090100,-984.873,158.8,"Norse"],["S/2004 S 43",4.0,18935700,-972.948,171.1,"Norse"],["S/2004 S 44",5.0,19515400,-1017.968,167.7,"Norse"],["S/2004 S 45",4.0,19693700,-1031.95,154.0,"Norse"],["S/2006 S 11",3.0,19711900,-1033.381,174.1,"Norse"],["S/2004 S 46",3.0,20513800,-1097.077,177.2,"Norse"],["S/2004 S 47",4.0,16050700,-759.292,160.9,"Norse"],["S/2006 S 13",4.0,19953300,-1052.422,162.0,"Norse"],["S/2006 S 14",3.0,21062300,-1141.37,166.7,"Norse"],["S/2019 S 7",4.0,20185100,-1070.814,174.2,"Norse"],["S/2019 S 8",4.0,20287400,-1078.965,172.8,"Norse"],["S/2019 S 9",4.0,20359700,-1084.738,159.5,"Norse"],["S/2019 S 10",3.0,20700300,-1112.072,163.9,"Norse"],["S/2019 S 11",4.0,20664200,-1109.164,144.6,"Norse"],["S/2019 S 12",4.0,20895000,-1127.798,167.1,"Norse"],["S/2019 S 13",3.0,20964500,-1133.43,177.3,"Norse"],["S/2020 S 6",3.0,21253300,-1156.931,166.9,"Norse"],["S/2005 S 5",3.0,21364900,-1166.055,169.5,"Norse"],["S/2007 S 7",4.0,15931600,-750.856,169.3,"Norse"],["S/2019 S 15",3.0,21191100,-1151.856,157.8,"Norse"],["S/2020 S 7",3.0,17394000,-856.578,161.4,"Norse"],["S/2004 S 48",4.0,22137400,-1229.866,161.9,"Norse"],["S/2004 S 49",4.0,22399400,-1251.764,159.8,"Norse"],["S/2004 S 50",3.0,22345000,-1247.206,164.0,"Norse"],["S/2004 S 51",4.0,25207100,-1494.349,171.2,"Norse"],["S/2004 S 52",3.0,26446400,-1605.897,165.4,"Norse"],["S/2006 S 15",4.0,21799600,-1201.823,161.1,"Norse"],["S/2006 S 16",3.0,21721200,-1195.346,164.1,"Norse"],["S/2006 S 17",4.0,22384200,-1250.49,168.7,"Norse"],["S/2006 S 18",4.0,22760600,-1282.163,169.5,"Norse"],["S/2006 S 19",4.0,23800500,-1371.03,175.5,"Norse"],["S/2019 S 16",3.0,23265200,-1325.037,162.0,"Norse"],["S/2019 S 17",4.0,22722700,-1278.962,155.5,"Norse"],["S/2019 S 18",3.0,23139500,-1314.313,154.6,"Norse"],["S/2019 S 19",3.0,23044400,-1306.219,151.8,"Norse"],["S/2019 S 20",3.0,23677900,-1360.45,156.0,"Norse"],["S/2020 S 8",3.0,21967200,-1215.71,161.8,"Norse"],["S/2020 S 9",4.0,25408700,-1512.312,161.4,"Norse"],["S/2004 S 53",4.0,23279800,-1326.284,162.6,"Norse"],["S/2007 S 9",4.0,20174600,-1069.979,159.3,"Norse"],["S/2019 S 21",4.0,26439500,-1605.268,171.9,"Norse"],["S/2020 S 10",3.0,25315300,-1503.981,165.6,"Norse"],["S/2006 S 20",5.0,13193700,-565.871,173.1,"Norse"],["S/2004 S 56",5.0,13670200,-596.802,161.6,"Norse"],["S/2004 S 57",4.0,18150500,-913.063,167.9,"Norse"],["S/2004 S 59",3.0,19170700,-991.117,167.3,"Norse"],["S/2004 S 60",3.0,19517000,-1018.093,173.8,"Norse"],["S/2004 S 61",4.0,20986900,-1135.247,168.4,"Norse"],["S/2006 S 21",3.0,14976500,-684.358,169.8,"Norse"],["S/2006 S 22",3.0,15109500,-693.494,172.0,"Norse"],["S/2006 S 24",3.0,18210700,-917.609,165.9,"Norse"],["S/2006 S 25",3.0,18572400,-945.083,158.8,"Norse"],["S/2006 S 26",3.0,18619300,-948.665,171.9,"Norse"],["S/2006 S 27",4.0,19205700,-993.832,170.5,"Norse"],["S/2006 S 28",4.0,21955100,-1214.705,172.9,"Norse"],["S/2006 S 29",3.0,25212100,-1494.794,156.2,"Norse"],["S/2019 S 27",3.0,16267000,-774.692,162.1,"Norse"],["S/2019 S 28",4.0,17496000,-864.124,158.4,"Norse"],["S/2019 S 30",3.0,17709900,-880.019,168.3,"Norse"],["S/2019 S 33",4.0,18696100,-954.54,170.4,"Norse"],["S/2019 S 35",3.0,18557800,-943.969,157.3,"Norse"],["S/2019 S 36",3.0,19903200,-1048.461,166.9,"Norse"],["S/2019 S 37",3.0,19996900,-1055.873,149.9,"Norse"],["S/2019 S 38",3.0,21998400,-1218.301,163.0,"Norse"],["S/2019 S 39",3.0,23784500,-1369.648,174.5,"Norse"],["S/2019 S 40",3.0,24087800,-1395.93,161.8,"Norse"],["S/2019 S 41",3.0,24493600,-1431.353,157.1,"Norse"],["S/2019 S 42",4.0,24111600,-1397.999,163.2,"Norse"],["S/2019 S 43",3.0,26664100,-1625.767,165.3,"Norse"],["S/2019 S 44",3.0,26796900,-1637.927,172.6,"Norse"],["S/2020 S 14",3.0,16186200,-768.927,161.7,"Norse"],["S/2020 S 16",3.0,16963400,-824.968,167.3,"Norse"],["S/2020 S 17",4.0,17094200,-834.528,148.9,"Norse"],["S/2020 S 18",3.0,17777900,-885.092,168.9,"Norse"],["S/2020 S 20",3.0,17997300,-901.527,169.8,"Norse"],["S/2020 S 21",3.0,18862100,-967.281,169.9,"Norse"],["S/2020 S 22",3.0,19443000,-1012.308,161.3,"Norse"],["S/2020 S 23",3.0,19801500,-1040.435,165.0,"Norse"],["S/2020 S 24",3.0,20618300,-1105.47,159.6,"Norse"],["S/2020 S 25",3.0,20763700,-1117.185,171.8,"Norse"],["S/2020 S 26",3.0,21264400,-1157.837,163.2,"Norse"],["S/2020 S 27",3.0,21802300,-1202.046,145.3,"Norse"],["S/2020 S 28",3.0,21993700,-1217.91,160.1,"Norse"],["S/2020 S 29",3.0,22301400,-1243.558,169.1,"Norse"],["S/2020 S 30",3.0,21790700,-1201.087,154.2,"Norse"],["S/2020 S 31",3.0,22457300,-1256.62,163.8,"Norse"],["S/2020 S 32",3.0,21884100,-1208.818,169.1,"Norse"],["S/2020 S 33",3.0,22922500,-1295.868,162.8,"Norse"],["S/2020 S 34",3.0,22435600,-1254.799,160.6,"Norse"],["S/2020 S 35",3.0,23030300,-1305.02,174.9,"Norse"],["S/2020 S 36",3.0,22806200,-1286.018,168.8,"Norse"],["S/2020 S 37",3.0,23751800,-1366.824,174.8,"Norse"],["S/2020 S 38",4.0,23583900,-1352.357,159.7,"Norse"],["S/2020 S 39",3.0,24262400,-1411.135,160.1,"Norse"],["S/2020 S 40",3.0,23785900,-1369.768,167.3,"Norse"],["S/2020 S 41",3.0,25876400,-1554.26,160.2,"Norse"],["S/2020 S 42",3.0,25329400,-1505.238,157.5,"Norse"],["S/2020 S 43",3.0,26657400,-1625.154,164.6,"Norse"],["S/2020 S 44",3.0,27259400,-1680.514,168.5,"Norse"],["S/2023 S 4",3.0,17764600,-884.099,170.0,"Norse"],["S/2023 S 5",3.0,25583500,-1527.945,168.8,"Norse"],["S/2023 S 8",3.0,14018800,-619.775,166.9,"Norse"],["S/2023 S 9",3.0,13167500,-564.187,172.2,"Norse"],["S/2023 S 10",3.0,15500200,-720.566,163.0,"Norse"],["S/2023 S 11",3.0,14046100,-621.586,170.9,"Norse"],["S/2023 S 12",3.0,15805900,-741.988,168.8,"Norse"],["S/2023 S 13",3.0,15193000,-699.251,168.5,"Norse"],["S/2023 S 14",3.0,16853000,-816.928,171.6,"Norse"],["S/2023 S 15",3.0,18241300,-919.923,161.9,"Norse"],["S/2023 S 16",3.0,17005300,-828.027,162.6,"Norse"],["S/2023 S 20",3.0,17261000,-846.772,136.5,"Norse"],["S/2023 S 21",3.0,17755400,-883.412,157.3,"Norse"],["S/2023 S 23",3.0,18783700,-961.257,164.8,"Norse"],["S/2023 S 24",3.0,18351800,-928.295,169.7,"Norse"],["S/2023 S 25",3.0,19136600,-988.473,166.4,"Norse"],["S/2023 S 26",3.0,19894300,-1047.758,163.9,"Norse"],["S/2023 S 27",3.0,19820100,-1041.901,151.1,"Norse"],["S/2023 S 28",3.0,19881000,-1046.707,168.7,"Norse"],["S/2023 S 29",3.0,20042400,-1059.479,172.2,"Norse"],["S/2023 S 30",3.0,18238300,-919.696,142.4,"Norse"],["S/2023 S 31",3.0,20729200,-1114.401,163.0,"Norse"],["S/2023 S 32",2.0,20454400,-1092.315,169.8,"Norse"],["S/2023 S 33",3.0,21621900,-1187.158,155.8,"Norse"],["S/2023 S 34",3.0,20803900,-1120.431,168.4,"Norse"],["S/2023 S 35",3.0,22269700,-1240.907,168.5,"Norse"],["S/2023 S 36",3.0,22230600,-1237.641,166.3,"Norse"],["S/2023 S 37",3.0,19889800,-1047.402,172.3,"Norse"],["S/2023 S 38",3.0,12823500,-542.223,149.2,"Norse"],["S/2023 S 39",3.0,20824500,-1122.095,164.8,"Norse"],["S/2023 S 40",3.0,21065100,-1141.598,169.6,"Norse"],["S/2023 S 41",3.0,21286400,-1159.634,172.1,"Norse"],["S/2023 S 42",3.0,21837000,-1204.917,166.7,"Norse"],["S/2023 S 43",3.0,22563900,-1265.578,170.3,"Norse"],["S/2023 S 44",3.0,19292400,-1000.569,167.4,"Norse"],["S/2023 S 45",3.0,23438400,-1339.861,157.4,"Norse"],["S/2023 S 46",3.0,24708900,-1450.267,143.2,"Norse"],["S/2023 S 47",3.0,25102300,-1485.04,162.5,"Norse"],["S/2023 S 48",3.0,20029200,-1058.433,169.7,"Norse"],["S/2023 S 49",3.0,21766500,-1199.087,171.7,"Norse"],["S/2023 S 50",3.0,11656500,-469.916,166.1,"Norse"],["S/2020 S 45",3.0,23507700,-1345.808,172.8,"Norse"],["S/2020 S 46",3.0,18892100,-969.59,167.3,"Norse"],["S/2020 S 47",3.0,21397400,-1168.717,146.1,"Norse"],["S/2023 S 51",3.0,23431500,-1339.269,163.3,"Norse"],["S/2023 S 52",3.0,22528000,-1262.559,146.2,"Norse"],["S/2023 S 53",3.0,17181100,-840.9,171.2,"Norse"],["S/2023 S 57",2.0,20536100,-1098.866,168.0,"Norse"],["S/2023 S 58",2.0,17206000,-842.728,169.6,"Norse"],["S/2023 S 59",2.0,20064000,-1061.192,169.5,"Norse"],["S/2023 S 60",2.0,17493700,-863.953,170.7,"Norse"],["S/2023 S 61",3.0,18067700,-906.822,158.0,"Norse"],["S/2023 S 62",2.0,14025900,-620.246,155.6,"Norse"],["S/2023 S 63",4.0,18482600,-938.237,165.0,"Norse"]]};
(function(){
  const PN = {jupiter:"Jupiter", saturn:"Saturn", uranus:"Uranus", neptune:"Neptune"};
  const GROUP = {
    Themisto:"A lone prograde moon between the Galilean moons and the Himalia group.",
    Himalia:"A prograde moon of the Himalia group, probably pieces of one asteroid captured and broken apart long ago.",
    Carpo:"A prograde moon on a steeply tilted orbit, part of the small Carpo group.",
    Valetudo:"An oddball: a prograde moon whose orbit crosses the paths of the backward-moving outer moons, so a collision is likely one day.",
    Ananke:"A retrograde moon of the Ananke group, debris from a captured body that broke apart.",
    Carme:"A retrograde moon of the Carme group, the tightest-knit family of fragments around Jupiter.",
    Pasiphae:"A retrograde moon of the Pasiphae group, a looser family of captured fragments.",
    "Ring moonlet":"A tiny moonlet at the outer edge of the B ring, seen by Cassini as a bump casting a shadow on the rings.",
    "Ring arc":"A sub-kilometre moonlet embedded in a bright arc of the G ring, which its impact debris helps supply.",
    Alkyonides:"One of the Alkyonides, tiny moons between Mimas and Enceladus that each sweep a faint ring arc of dust.",
    "Dione trojan":"Shares Dione's orbit, staying about 60° behind it at a stable Lagrange point.",
    Inuit:"A prograde irregular moon of the Inuit group, tilted about 45°. Members are named after giants of Inuit mythology.",
    Gallic:"A prograde irregular moon of the Gallic group, tilted about 36° and reddish in colour. Members are named after Gallic giants.",
    Norse:"A retrograde irregular moon of the Norse group, the largest family of moons in the Solar System. Members are named after Norse giants. Most are only a few kilometres across, and many were found only in the last few years.",
    Inner:"A small dark moon orbiting close in, among the rings.",
    Portia:"One of the Portia group, a crowded swarm of small inner moons whose orbits slowly perturb each other.",
    Belinda:"One of the Belinda group of inner moons. Cupid and Mab orbit near the faint outer rings.",
    Caliban:"A retrograde irregular moon of the Caliban group.",
    Irregular:"A distant irregular moon, probably captured from a passing orbit.",
    Sao:"A prograde irregular moon of the Sao group.",
    Neso:"A retrograde moon of the Neso group, among the most distant moons of any planet, taking more than 25 years per orbit."
  };
  const tints = ["#6b6560","#76675a","#5f5a55","#7a6b5f","#686461"];
  const f0 = n => n >= 100 ? Math.round(n).toLocaleString("en-US") : n >= 10 ? n.toFixed(0) : n.toFixed(1);
  Object.entries(MINOR_MOONS).forEach(([pid, list]) => list.forEach(([name, d, a, P, inc, grp], k) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const yrs = Math.abs(P) > 700 ? ` (${(Math.abs(P)/365.25).toFixed(1)} years)` : "";
    const per = Math.abs(P) < 2 ? `${f0(Math.abs(P)*24)} hours` : `${f0(Math.abs(P))} days${yrs}`;
    const prov = /^S\//.test(name) ? ` It has no name yet: “${name}” means it was the ${name.split(" ").pop()}${["th","st","nd","rd"][[1,2,3].includes(+name.split(" ").pop()%10)&&!(+name.split(" ").pop()>10&&+name.split(" ").pop()<14)?+name.split(" ").pop()%10:0]} ${PN[pid]} moon found in images from ${name.slice(2,6)}.` :
                 /^Saturn L/.test(name) ? " It is known only by its Roman-numeral catalogue number." : "";
    BODIES.push({ id, name, kind:"moon", parent:pid, R:Math.max(d/2, .15), a, P, inc: inc > 90 ? inc : inc, minor:1, group:grp,
      tex:"asteroid", tint:tints[k % tints.length], lumpy:1, interior:"rubble", rot: Math.abs(P) < 4 ? "sync" : 11 + (k%9),
      facts:{"Diameter": d < 1 ? `~${Math.round(d*1000)} m` : `~${f0(d)} km`, ["From " + PN[pid]]: `${f0(a)} km`, "Orbit": per + (P < 0 ? ", retrograde" : ""), "Tilt": `${inc.toFixed(0)}°`, "Group": grp},
      blurb: (GROUP[grp] || GROUP.Irregular) + prov });
  }));
})();

/* notable small bodies and spacecraft (Wikipedia infoboxes, NASA/ESA/JAXA mission pages; positions for 22 Oct 2026, approximate where marked) */
const EXTRA_SMALL = [{"id":"bennu","name":"101955 Bennu","sub":"Near-Earth asteroid","R":0.245,"e":0.2038,"i":6.0349,"node":2.0609,"peri":66.2231,"blurb":"A rubble-pile asteroid sampled by NASA's OSIRIS-REx, which delivered about 120 g of it to Earth in 2023. It has a small chance of hitting Earth in the late 2100s.","a":1.1264,"M0":29.40745182590399},{"id":"ryugu","name":"162173 Ryugu","sub":"Near-Earth asteroid","R":0.448,"e":0.1902,"i":5.8837,"node":251.62,"peri":211.43,"blurb":"A spinning-top-shaped, carbon-rich asteroid. Japan's Hayabusa2 returned 5.4 g of it to Earth in 2020.","a":1.1896,"M0":290.0306723858421},{"id":"itokawa","name":"25143 Itokawa","sub":"Near-Earth asteroid","R":0.165,"e":0.2801,"i":1.6214,"node":69.081,"peri":162.82,"blurb":"A peanut-shaped rubble pile only about 535 m long. Hayabusa returned the first asteroid dust samples from it in 2010.","a":1.3241,"M0":44.74066675840277},{"id":"eros","name":"433 Eros","sub":"Near-Earth asteroid","R":8.42,"e":0.2226,"i":10.828,"node":304.32,"peri":178.82,"blurb":"The first asteroid orbited by a spacecraft. NEAR Shoemaker circled it for a year and then landed on it in 2001.","a":1.4579,"M0":56.76061971901754},{"id":"apophis","name":"99942 Apophis","sub":"Near-Earth asteroid","R":0.185,"e":0.1911,"i":3.341,"node":203.9,"peri":126.7,"blurb":"On 13 April 2029 Apophis will pass about 31,600 km above Earth, closer than geostationary satellites, and be visible to the naked eye. It poses no impact risk for at least a century.","a":0.9224,"M0":232.74634823212727},{"id":"didymos","name":"65803 Didymos (with Dimorphos)","sub":"Near-Earth asteroid","R":0.3825,"e":0.38385,"i":3.4079,"node":73.196,"peri":319.32,"blurb":"A binary asteroid. NASA's DART slammed into its ~160 m moon Dimorphos in 2022 and shortened its orbit, and ESA's Hera arrives in November 2026.","a":1.6442,"M0":66.0750648856374},{"id":"2024yr4","name":"2024 YR4","sub":"Near-Earth asteroid","R":0.03,"e":0.6615,"i":3.4082,"node":271.364,"peri":134.366,"blurb":"Briefly the riskiest asteroid ever recorded, with a 3% chance of hitting Earth in 2032 that was later ruled out. A roughly 4% chance remains that it hits the Moon on 22 Dec 2032.","approx":"Wikipedia scrape lacked row labels: a=2.5158 AU is inferred (q=a(1-e)=0.85 AU); angles mapped in standard table order. Diameter 60 +/- 7 m (JWST).","a":2.5158,"M0":224.8852956210494},{"id":"kamooalewa","name":"469219 Kamoʻoalewa","sub":"Near-Earth asteroid","R":0.015,"e":0.10269,"i":7.79605,"node":65.7907,"peri":305.0478,"blurb":"A tiny quasi-satellite of Earth that may be a fragment blasted off the Moon. China's Tianwen-2 is orbiting it now.","approx":"Size uncertain: Wikipedia lists 27 m mean diameter; 2026 JWST thermal data suggest ~18 m. 0.03 km is a rounded middle value.","a":1.00094,"M0":99.23178412118978},{"id":"psyche","name":"16 Psyche","sub":"Main-belt asteroid","R":111.0,"e":0.1343,"i":3.097,"node":150.0,"peri":229.8,"blurb":"A metal-rich asteroid that may be part of the core of a shattered protoplanet. NASA's Psyche spacecraft arrives in 2029.","a":2.92,"M0":332.8338601226196},{"id":"lutetia","name":"21 Lutetia","sub":"Main-belt asteroid","R":49.0,"e":0.16339,"i":3.064,"node":80.867,"peri":249.997,"blurb":"A large, ancient asteroid imaged by ESA's Rosetta in 2010. It may be a leftover piece of the material that built the rocky planets.","a":2.435,"M0":314.0466592650364},{"id":"gaspra","name":"951 Gaspra","sub":"Main-belt asteroid","R":6.1,"e":0.1734,"i":4.1063,"node":253.06,"peri":129.94,"blurb":"The first asteroid ever visited by a spacecraft, photographed by Galileo in 1991 on its way to Jupiter.","a":2.2099,"M0":96.03690205613589},{"id":"ida","name":"243 Ida","sub":"Main-belt asteroid","R":15.7,"e":0.0411,"i":1.132,"node":324.016,"peri":110.961,"blurb":"Galileo found that Ida has its own tiny moon, Dactyl, the first asteroid moon ever discovered (1993).","a":2.861,"M0":245.35938616970589},{"id":"mathilde","name":"253 Mathilde","sub":"Main-belt asteroid","R":26.4,"e":0.2643,"i":6.74,"node":179.494,"peri":157.564,"blurb":"A very dark, low-density asteroid covered in giant craters, seen by NEAR Shoemaker in 1997.","a":2.647,"M0":223.71790500980387},{"id":"steins","name":"2867 Šteins","sub":"Main-belt asteroid","R":2.6,"e":0.1459,"i":9.9354,"node":55.366,"peri":251.08,"blurb":"A small diamond-shaped asteroid that Rosetta flew past in 2008. It is one of the rare E-type asteroids.","a":2.3633,"M0":176.66853963525227},{"id":"donaldjohanson","name":"52246 Donaldjohanson","sub":"Main-belt asteroid","R":2.4,"e":0.1869,"i":4.425,"node":262.777,"peri":212.882,"blurb":"Visited by NASA's Lucy on 20 April 2025 and named after the discoverer of the 'Lucy' fossil. It turned out to be an elongated contact binary.","a":2.384,"M0":82.45345677388923},{"id":"juno-3","name":"3 Juno","sub":"Main-belt asteroid","R":127.0,"e":0.2562,"i":12.991,"node":169.84,"peri":247.74,"blurb":"The third asteroid ever discovered (1804) and one of the largest in the main belt.","a":2.67,"M0":241.61129229829203},{"id":"interamnia","name":"704 Interamnia","sub":"Main-belt asteroid","R":166.0,"e":0.155,"i":17.31,"node":280.3,"peri":94.8,"blurb":"The fifth-largest asteroid and nearly round. It may be a small body on the edge of being a dwarf planet.","a":3.056,"M0":239.44534419795673},{"id":"davida","name":"511 Davida","sub":"Main-belt asteroid","R":149.0,"e":0.188,"i":15.94,"node":107.6,"peri":337.2,"blurb":"One of the largest main-belt asteroids, a dark, primitive C-type body.","a":3.163,"M0":177.3241182966567},{"id":"europa-52","name":"52 Europa","sub":"Main-belt asteroid","R":159.5,"e":0.1125,"i":7.48,"node":128.57,"peri":342.8,"blurb":"A large dark asteroid in the outer main belt, not to be confused with Jupiter's moon Europa.","a":3.094,"M0":39.04960197186824},{"id":"eurybates","name":"3548 Eurybates","sub":"Jupiter Trojan asteroid","R":34.65,"e":0.0909,"i":8.054,"node":43.542,"peri":27.481,"blurb":"A leading (L4) Trojan with a tiny moon, Queta. NASA's Lucy flies past it on 12 August 2027.","a":5.206,"M0":45.89772051209957},{"id":"patroclus","name":"617 Patroclus–Menoetius","sub":"Jupiter Trojan asteroid","R":56.5,"e":0.1399,"i":22.062,"node":44.36,"peri":308.306,"blurb":"A near-equal binary pair (about 113 km and 104 km) in the trailing L5 Trojan swarm. It is Lucy's final target in 2033.","a":5.209,"M0":338.50274606967787},{"id":"hektor","name":"624 Hektor","sub":"Jupiter Trojan asteroid","R":112.5,"e":0.0238,"i":18.166,"node":342.79,"peri":185.22,"blurb":"The largest Jupiter Trojan, an elongated and possibly two-lobed body about 400 km long, with a small moon.","approx":"Published sizes vary widely (147-256 km equivalent diameter); 225 km chosen as representative.","a":5.2571,"M0":311.87111697256694},{"id":"chiron","name":"2060 Chiron","sub":"Centaur","R":98.0,"e":0.3772,"i":6.9299,"node":209.27,"peri":339.71,"blurb":"The first centaur discovered, orbiting between Saturn and Uranus. It sometimes shows a comet-like coma and is also catalogued as comet 95P.","a":13.7,"M0":28.08962467196139},{"id":"chariklo","name":"10199 Chariklo","sub":"Centaur","R":125.0,"e":0.1696,"i":23.425,"node":300.47,"peri":241.323,"blurb":"The largest known centaur and the first small body found to have rings (2013).","a":15.748,"M0":337.77048960490697},{"id":"varuna","name":"20000 Varuna","sub":"Trans-Neptunian object","R":330.0,"e":0.0536,"i":17.14,"node":97.213,"peri":272.579,"blurb":"A large classical Kuiper Belt object that spins very fast, about every 6.3 hours, stretching it into an elongated shape.","approx":"Diameter estimates 654-668 km.","a":42.718,"M0":82.2264898122675},{"id":"ixion","name":"28978 Ixion","sub":"Trans-Neptunian object","R":348.5,"e":0.244,"i":19.63,"node":71.031,"peri":299.864,"blurb":"A plutino locked in a 2:3 resonance with Neptune like Pluto, and one of the largest known.","a":39.497,"M0":257.43012954687316},{"id":"salacia","name":"120347 Salacia","sub":"Trans-Neptunian object","R":419.0,"e":0.10636,"i":23.921,"node":279.88,"peri":312.294,"blurb":"A large, dark Kuiper Belt object with a moon, Actaea. It is a possible dwarf planet.","a":42.184,"M0":96.31746644687854},{"id":"leleakuhonua","name":"541132 Leleākūhonua (2015 TG387, 'The Goblin')","sub":"Trans-Neptunian object","R":110.0,"e":0.94572,"i":11.68,"node":300.989,"peri":118.236,"blurb":"An extreme distant object that never comes closer than 65 AU and swings out to roughly 2,700 AU over a ~50,000-year orbit. Its orbit is cited as evidence for a possible distant 'Planet Nine'.","approx":"Diameter = 2 x mean radius 110 km (uncertain). It is near perihelion now (M ~360 deg).","a":1389,"M0":359.4690102590962},{"id":"2012vp113","name":"2012 VP113","sub":"Trans-Neptunian object","R":225.0,"e":0.6931,"i":24.0563,"node":90.8,"peri":293.9,"blurb":"A sednoid with a perihelion of 80 AU, far beyond Neptune's influence. Its discovery strengthened the case for unseen distant planets.","approx":"Diameter assumes albedo 0.15.","a":262.3,"M0":21.902591215200665},{"id":"farout","name":"2018 VG18 'Farout'","sub":"Trans-Neptunian object","R":250.0,"e":0.5301,"i":24.292,"node":245.325,"peri":16.865,"blurb":"The first Solar System object found beyond 100 AU (about 124 AU in 2024), nicknamed 'Farout'.","approx":"Diameter estimated (490-790 km range).","a":81.628,"M0":146.35262550342645},{"id":"farfarout","name":"2018 AG37 'Farfarout'","sub":"Trans-Neptunian object","R":200.0,"e":0.655,"i":18.68,"node":68.35,"peri":231.9,"blurb":"The most distant Solar System object ever observed, about 132 AU from the Sun when found in 2018. Its orbit takes roughly 700 years.","approx":"Orbit is poorly determined (peri +/-60 deg, M +/-219 deg); place it near aphelion at ~132 AU. Diameter estimated.","a":80.2,"M0":177.30003864750435},{"id":"67p","name":"67P/Churyumov–Gerasimenko","sub":"Comet","R":2.05,"e":0.64989,"i":3.8719,"node":36.33,"peri":22.15,"blurb":"The rubber-duck-shaped comet that ESA's Rosetta orbited from 2014 to 2016, and the first comet landed on (Philae).","approx":"diameter_km is the long axis of the larger lobe (4.1 x 3.3 x 1.8 km); the small lobe is 2.6 x 2.3 x 1.8 km.","a":3.457,"Tp":2028.2724161533197},{"id":"tempel1","name":"9P/Tempel 1","sub":"Comet","R":3.0,"e":0.46,"i":10.474,"node":68.64,"peri":179.54,"blurb":"NASA's Deep Impact fired a 370 kg impactor into this comet in 2005, and Stardust-NExT later photographed the crater.","approx":"A 2024 Jupiter approach raised q from 1.545 to 1.77 AU. a and e were derived from the 2022-to-2028 perihelion interval and the new q; angles are the pre-2024 values (epoch 2023-02-25). Nucleus 7.6 x 4.9 km.","a":3.28,"Tp":2028.116358658453},{"id":"wild2","name":"81P/Wild 2","sub":"Comet","R":2.15,"e":0.53739,"i":3.237,"node":136.09,"peri":41.568,"blurb":"NASA's Stardust flew through its coma in 2004 and brought comet dust back to Earth in 2006.","approx":"Nucleus 5.5 x 4.0 x 3.3 km; 4.3 km is a mean.","a":3.452,"Tp":2029.3655030800821},{"id":"hartley2","name":"103P/Hartley 2","sub":"Comet","R":0.58,"e":0.694,"i":13.608,"node":219.76,"peri":181.33,"blurb":"A small, hyperactive comet visited by NASA's EPOXI (ex-Deep Impact) in 2010. It vents jets of carbon dioxide.","a":3.48,"Tp":2023.7789185489391},{"id":"encke","name":"2P/Encke","sub":"Comet","R":2.43,"e":0.84711,"i":11.344,"node":334.01,"peri":187.28,"blurb":"The comet with the shortest known orbital period, about 3.3 years. Its debris causes the Taurid meteor showers.","a":2.218,"Tp":2027.1108829568789},{"id":"hale-bopp","name":"C/1995 O1 (Hale–Bopp)","sub":"Comet","R":30.0,"e":0.99498,"i":89.288,"node":282.73,"peri":130.41,"blurb":"The Great Comet of 1997, visible to the naked eye for a record 18 months. Its nucleus is unusually large, perhaps 60 km across.","approx":"Period ~2,400 yr; next perihelion ~4385 AD. Nucleus size 60 +/- 20 km.","a":177.43,"Tp":1997.2477754962354},{"id":"swift-tuttle","name":"109P/Swift–Tuttle","sub":"Comet","R":13.0,"e":0.9632,"i":113.45,"node":139.44,"peri":153.0,"blurb":"Parent of the Perseid meteor shower every August. At 26 km across, it is the largest object that makes repeated close passes by Earth.","a":26.092,"Tp":1992.9486652977412},{"id":"tempel-tuttle","name":"55P/Tempel–Tuttle","sub":"Comet","R":1.8,"e":0.90587,"i":162.48,"node":235.41,"peri":172.45,"blurb":"Parent of the November Leonid meteor shower, which can erupt into meteor storms when Earth crosses fresh debris.","a":10.354,"Tp":2031.381930184805},{"id":"tsuchinshan-atlas","name":"C/2023 A3 (Tsuchinshan–ATLAS)","sub":"Comet","R":2.95,"e":1.00005,"i":139.112,"node":21.559,"peri":308.491,"blurb":"A bright naked-eye comet in October 2024. Its outbound orbit is very slightly hyperbolic, so it may never return.","approx":"Inbound e = 0.999992 (a ~48,000 AU); outbound e = 1.000039 given here. Nucleus < 5.9 km (upper limit).","hyp":1,"q":0.39143,"Tp":2024.7405886379192,"Tpd":9035.5},{"id":"oumuamua","name":"1I/ʻOumuamua","sub":"Interstellar object","R":0.1,"e":1.20113,"i":122.74,"node":24.597,"peri":241.811,"blurb":"The first known interstellar object, found in 2017. Its elongated or flattened shape and slight non-gravitational push are still debated.","approx":"Size highly uncertain (~100-400 m long); 0.2 km is representative.","hyp":1,"q":0.255916,"Tp":2017.6885694729638,"Tpd":6460.5},{"id":"borisov","name":"2I/Borisov","sub":"Interstellar object","R":0.2,"e":3.3565,"i":44.053,"node":308.15,"peri":209.12,"blurb":"The first known interstellar comet (2019). It looked much like Solar System comets, but was unusually rich in carbon monoxide.","approx":"Nucleus at most ~0.4-0.5 km.","hyp":1,"q":2.00652,"Tp":2019.9349760438056,"Tpd":7280.5},{"id":"3i-atlas","name":"3I/ATLAS","sub":"Interstellar object","R":0.5,"e":6.14135,"i":175.12,"node":322.17,"peri":128.02,"blurb":"The third interstellar visitor, found on 1 July 2025. It is moving faster than any previous one (~58 km/s far from the Sun) on a nearly ecliptic, retrograde path.","approx":"Nucleus size poorly constrained (0.32-5.6 km by Hubble; 0.52-0.75 km from non-gravitational fits); 1.0 km is a placeholder.","hyp":1,"q":1.35645,"Tp":2025.8254620123203,"Tpd":9432.5}];
const CRAFT = [{"id":"iss","name":"International Space Station","agency":"NASA / Roscosmos / ESA / JAXA / CSA","launched":"1998-11-20","status":"active","where":"earth-orbit","facts":{"First module":"20 Nov 1998","Crewed since":"Nov 2000","Speed":"~7.66 km/s","Orbits per day":"~15.5"},"blurb":"The largest structure humans have built in space, continuously crewed since November 2000. It circles Earth about every 93 minutes.","approx":"Altitude varies ~400-420 km with reboosts; launch date is first module (Zarya).","alt_km":415,"inc_deg":51.64,"period_min":92.9},{"id":"hubble","name":"Hubble Space Telescope","agency":"NASA / ESA","launched":"1990-04-24","status":"active","where":"earth-orbit","facts":{"Launched":"24 Apr 1990","Mirror":"2.4 m","Servicing missions":"5 (1993-2009)","Released at":"~612 km"},"blurb":"Hubble has photographed the universe in visible and ultraviolet light for over 35 years. Its orbit is slowly sinking under atmospheric drag.","approx":"Orbit is decaying; Oct 2026 reports put it 'well below 500 km' with re-entry possible from ~2028 without a reboost. 480 km is an estimate.","alt_km":480,"inc_deg":28.47,"period_min":94.2},{"id":"tiangong","name":"Tiangong Space Station","agency":"CMSA (China)","launched":"2021-04-29","status":"active","where":"earth-orbit","facts":{"Core module":"29 Apr 2021","Modules":"3","Crew":"3 (6 during handovers)"},"blurb":"China's modular space station, permanently crewed since 2022. It is roughly a fifth the mass of the ISS.","approx":"Altitude varies ~370-400 km; launch date is core module Tianhe.","alt_km":385,"inc_deg":41.47,"period_min":92.2},{"id":"chandra","name":"Chandra X-ray Observatory","agency":"NASA","launched":"1999-07-23","status":"active","where":"earth-orbit","facts":{"Launched":"23 Jul 1999","Orbit":"~16,000 x 133,000 km","Period":"~64 hours","Band":"X-ray"},"blurb":"NASA's flagship X-ray telescope, which studies black holes, supernova remnants and hot gas in galaxy clusters. Its long looping orbit takes it a third of the way to the Moon.","approx":"Highly elliptical orbit; alt_km is a rough mean. Perigee/apogee and inclination evolve over time and are approximate (28.5 deg was the launch value). Operating under reduced budget.","alt_km":74000,"inc_deg":28.5,"period_min":3816,"perigee_km":16000,"apogee_km":133000},{"id":"spherex","name":"SPHEREx","agency":"NASA","launched":"2025-03-11","status":"active","where":"earth-orbit","facts":{"Launched":"11 Mar 2025","Mission":"All-sky spectral survey","Bands":"102 infrared colors"},"blurb":"SPHEREx maps the entire sky in 102 infrared colors to study the early universe and the ices that seed planets.","approx":"Sun-synchronous polar orbit; values approximate (not verified this session).","alt_km":700,"inc_deg":98.0,"period_min":98.6},{"id":"smile","name":"SMILE","agency":"ESA / CAS","launched":"2026-05-22","status":"active","where":"earth-orbit","facts":{"Launched":"22 May 2026 (Vega-C)","Orbit":"5,000 x 121,000 km","Studies":"Solar wind vs. magnetosphere"},"blurb":"A joint European-Chinese mission that images how the solar wind buffets Earth's magnetic shield in X-rays and ultraviolet.","approx":"Target orbit 5,000 x 121,000 km (Avio). Inclination is described only as 'high'; 70 deg is a placeholder. alt_km is a rough mean; period computed from the target orbit.","alt_km":63000,"inc_deg":70,"period_min":3030,"perigee_km":5000,"apogee_km":121000},{"id":"jwst","name":"James Webb Space Telescope","agency":"NASA / ESA / CSA","launched":"2021-12-25","status":"active","where":"lagrange","facts":{"Launched":"25 Dec 2021","Mirror":"6.5 m","Location":"Sun-Earth L2, ~1.5 million km","Band":"Infrared"},"blurb":"The largest space telescope ever launched, orbiting the Sun-Earth L2 point 1.5 million km from Earth. Its sunshield keeps its infrared instruments below 50 K.","point":"L2"},{"id":"roman","name":"Nancy Grace Roman Space Telescope","agency":"NASA","launched":"2026-08-30","status":"cruise","where":"lagrange","facts":{"Launched":"30 Aug 2026 (Falcon Heavy)","Destination":"Sun-Earth L2","Field of view":"~100x Hubble"},"blurb":"Roman will survey huge swaths of sky to probe dark energy and find thousands of exoplanets. It launched in August 2026 and is commissioning on its way to L2.","approx":"En route to a Sun-Earth L2 halo orbit; arrival expected about early December 2026 (~100 days after launch).","point":"L2"},{"id":"imap","name":"IMAP","agency":"NASA","launched":"2025-09-24","status":"active","where":"lagrange","facts":{"Launched":"24 Sep 2025","Reached L1":"10 Jan 2026","Studies":"Heliosphere boundary, solar wind"},"blurb":"The Interstellar Mapping and Acceleration Probe maps the boundary of the Sun's bubble from Sun-Earth L1 and gives early warning of solar storms.","point":"L1"},{"id":"escapade","name":"ESCAPADE (Blue & Gold)","agency":"NASA / Rocket Lab / UC Berkeley","launched":"2025-11-13","status":"cruise","where":"lagrange","facts":{"Launched":"13 Nov 2025 (New Glenn)","Spacecraft":"2 identical orbiters","Departs for Mars":"Nov 2026"},"blurb":"Two small orbiters bound for Mars to study how the solar wind strips its atmosphere. They are waiting near L2 for the planets to line up.","approx":"Twin spacecraft loitering in an Earth-proximity orbit around Sun-Earth L2 until the November 2026 Mars window; Mars arrival ~2027 (date not verified).","point":"L2"},{"id":"apollo11","name":"Apollo 11 (Tranquility Base)","agency":"NASA","launched":"1969-07-16","status":"ended","where":"surface","facts":{"Launched":"1969-07-16","Landed":"1969-07-20","Crew on surface":"2"},"blurb":"First crewed landing; Armstrong and Aldrin walked on the Moon for about 2.5 hours.","body":"moon","lat":0.6741,"lon":23.473},{"id":"apollo12","name":"Apollo 12","agency":"NASA","launched":"1969-11-14","status":"ended","where":"surface","facts":{"Launched":"1969-11-14","Landed":"1969-11-19","Crew on surface":"2"},"blurb":"Pinpoint landing beside the Surveyor 3 probe in Oceanus Procellarum.","body":"moon","lat":-3.0124,"lon":-23.4216},{"id":"apollo14","name":"Apollo 14","agency":"NASA","launched":"1971-01-31","status":"ended","where":"surface","facts":{"Launched":"1971-01-31","Landed":"1971-02-05","Crew on surface":"2"},"blurb":"Landed in the Fra Mauro highlands; Alan Shepard hit two golf balls.","body":"moon","lat":-3.6453,"lon":-17.4714},{"id":"apollo15","name":"Apollo 15","agency":"NASA","launched":"1971-07-26","status":"ended","where":"surface","facts":{"Launched":"1971-07-26","Landed":"1971-07-30","Crew on surface":"2"},"blurb":"First mission with the Lunar Roving Vehicle, at Hadley Rille.","body":"moon","lat":26.1322,"lon":3.6339},{"id":"apollo16","name":"Apollo 16","agency":"NASA","launched":"1972-04-16","status":"ended","where":"surface","facts":{"Launched":"1972-04-16","Landed":"1972-04-21","Crew on surface":"2"},"blurb":"Explored the Descartes highlands, the only Apollo landing in the central highlands.","body":"moon","lat":-8.973,"lon":15.5002},{"id":"apollo17","name":"Apollo 17","agency":"NASA","launched":"1972-12-07","status":"ended","where":"surface","facts":{"Launched":"1972-12-07","Landed":"1972-12-11","Crew on surface":"2"},"blurb":"The last crewed lunar landing so far, in the Taurus-Littrow valley.","body":"moon","lat":20.1908,"lon":30.7717},{"id":"luna9","name":"Luna 9","agency":"USSR","launched":"1966-01-31","status":"ended","where":"surface","facts":{"Launched":"31 Jan 1966","Landed":"3 Feb 1966","First":"Soft landing on another world"},"blurb":"The first spacecraft to soft-land on the Moon and send back pictures from its surface.","approx":"Coordinates commonly given as 7.08N 64.37W; not re-verified this session.","body":"moon","lat":7.08,"lon":-64.37},{"id":"change3","name":"Chang'e 3 / Yutu","agency":"CNSA","launched":"2013-12-01","status":"ended","where":"surface","facts":{"Launched":"1 Dec 2013","Landed":"14 Dec 2013","Site":"Mare Imbrium"},"blurb":"China's first lunar lander and rover, and the first soft landing on the Moon since 1976.","approx":"Coordinates from memory of published values (44.12N 19.51W); not re-verified this session.","body":"moon","lat":44.12,"lon":-19.51},{"id":"change4","name":"Chang'e 4 / Yutu-2","agency":"CNSA","launched":"2018-12-07","status":"active","where":"surface","facts":{"Launched":"7 Dec 2018","Landed":"3 Jan 2019","Site":"Von Karman crater, far side"},"blurb":"The first soft landing on the far side of the Moon. Its Yutu-2 rover set the record for the longest-operating lunar rover.","approx":"Coordinates ~45.44S 177.60E (Von Karman crater); status of Yutu-2 in 2026 not verified.","body":"moon","lat":-45.44,"lon":177.6},{"id":"change5","name":"Chang'e 5","agency":"CNSA","launched":"2020-11-23","status":"ended","where":"surface","facts":{"Launched":"23 Nov 2020","Landed":"1 Dec 2020","Sample returned":"1.73 kg"},"blurb":"Returned the first lunar samples since 1976, from some of the youngest volcanic rocks on the Moon.","approx":"Lander position ~43.06N 51.92W (Mons Rumker region); not re-verified this session.","body":"moon","lat":43.06,"lon":-51.92},{"id":"change6","name":"Chang'e 6","agency":"CNSA","launched":"2024-05-03","status":"ended","where":"surface","facts":{"Launched":"3 May 2024","Landed":"1 Jun 2024","Samples home":"25 Jun 2024","Site":"Apollo basin, far side"},"blurb":"The first mission to bring back samples from the Moon's far side, about 1.9 kg from the Apollo basin.","body":"moon","lat":-41.6385,"lon":-153.9852},{"id":"chandrayaan3","name":"Chandrayaan-3 (Vikram & Pragyan)","agency":"ISRO","launched":"2023-07-14","status":"ended","where":"surface","facts":{"Launched":"14 Jul 2023","Landed":"23 Aug 2023","First":"Landing near the lunar south pole"},"blurb":"India's first successful Moon landing, and the first near the lunar south polar region.","approx":"Published site ~69.37S 32.32E (Statio Shiv Shakti); not re-verified this session.","body":"moon","lat":-69.37,"lon":32.32},{"id":"slim","name":"SLIM","agency":"JAXA","launched":"2023-09-06","status":"ended","where":"surface","facts":{"Launched":"6 Sep 2023","Landed":"19 Jan 2024","Accuracy":"within ~100 m of target"},"blurb":"Japan's first Moon lander demonstrated a pinpoint landing, even though it ended up tipped on its nose.","approx":"Coordinates ~13.316S 25.251E (near Shioli crater); not re-verified this session.","body":"moon","lat":-13.316,"lon":25.251},{"id":"im1","name":"IM-1 Odysseus","agency":"Intuitive Machines / NASA CLPS","launched":"2024-02-15","status":"ended","where":"surface","facts":{"Launched":"15 Feb 2024","Landed":"22 Feb 2024","First":"Commercial lunar landing"},"blurb":"The first commercial spacecraft to soft-land on the Moon, and the first US landing since Apollo 17. It came to rest tilted on its side.","approx":"Site near Malapert A, ~80.13S 1.44E; not re-verified this session.","body":"moon","lat":-80.13,"lon":1.44},{"id":"im2","name":"IM-2 Athena","agency":"Intuitive Machines / NASA CLPS","launched":"2025-02-27","status":"ended","where":"surface","facts":{"Launched":"27 Feb 2025","Landed":"6 Mar 2025","Site":"Mons Mouton region","Ended":"7 Mar 2025"},"blurb":"Landed closer to the south pole than any previous craft but tipped over in a shadowed crater and ran out of power within a day.","body":"moon","lat":-84.7906,"lon":29.1957},{"id":"blueghost1","name":"Blue Ghost Mission 1","agency":"Firefly Aerospace / NASA CLPS","launched":"2025-01-15","status":"ended","where":"surface","facts":{"Launched":"15 Jan 2025","Landed":"2 Mar 2025","Site":"Mare Crisium (near Mons Latreille)","Surface mission":"~14 days"},"blurb":"The first fully successful commercial Moon landing, which operated through a full lunar day in Mare Crisium.","body":"moon","lat":18.5623,"lon":61.8103},{"id":"lro","name":"Lunar Reconnaissance Orbiter","agency":"NASA","launched":"2009-06-18","status":"active","where":"body-orbit","facts":{"Launched":"18 Jun 2009","Orbit":"Polar, ~2 h","Known for":"Mapping the whole Moon at high resolution"},"blurb":"LRO has mapped the Moon in detail for well over a decade, including photographing the Apollo landing sites.","approx":"Since 2011 LRO flies an elliptical polar orbit (roughly 30-180 km); 100 km is a rough mean. Values not re-verified this session.","alt_km":100,"inc_deg":90,"body":"moon","period_hr":2.0},{"id":"mro","name":"Mars Reconnaissance Orbiter","agency":"NASA","launched":"2005-08-12","status":"active","where":"body-orbit","facts":{"Launched":"12 Aug 2005","Arrived":"10 Mar 2006","Camera":"HiRISE (~30 cm/pixel)"},"blurb":"MRO's HiRISE camera can see rovers on the surface. It also relays much of the data from Mars landers.","approx":"Sun-synchronous ~255 x 320 km orbit; values from memory, not re-verified.","alt_km":290,"inc_deg":93,"body":"mars","period_hr":1.87},{"id":"maven","name":"MAVEN","agency":"NASA","launched":"2013-11-18","status":"lost contact (Dec 2025)","where":"body-orbit","facts":{"Launched":"18 Nov 2013","Arrived":"22 Sep 2014","Last signal":"Dec 2025"},"blurb":"MAVEN measured how Mars loses its atmosphere to space. NASA lost contact with it in December 2025.","approx":"Contact lost 4-6 Dec 2025; recovery judged very unlikely and the spacecraft may be tumbling. Orbit values are approximate (pre-loss ~150 x 4,500 km).","alt_km":2300,"inc_deg":75,"body":"mars","period_hr":3.6},{"id":"mars-express","name":"Mars Express","agency":"ESA","launched":"2003-06-02","status":"active","where":"body-orbit","facts":{"Launched":"2 Jun 2003","Arrived":"25 Dec 2003","Known for":"First radar evidence of buried water ice"},"blurb":"Europe's first Mars mission is still mapping the planet in 3D more than two decades after arrival.","approx":"Elliptical ~330 x 10,500 km polar orbit; alt_km is a rough mean. Status assumed active (not verified for 2026).","alt_km":5400,"inc_deg":86.6,"body":"mars","period_hr":7.0},{"id":"odyssey","name":"2001 Mars Odyssey","agency":"NASA","launched":"2001-04-07","status":"active (near end of fuel)","where":"body-orbit","facts":{"Launched":"7 Apr 2001","Arrived":"24 Oct 2001","Record":"Longest-serving Mars spacecraft"},"blurb":"The oldest active spacecraft at Mars. It found water ice under the surface and relays data from rovers.","alt_km":400,"inc_deg":93.06,"body":"mars","period_hr":2.0},{"id":"tianwen1","name":"Tianwen-1 orbiter","agency":"CNSA","launched":"2020-07-23","status":"active","where":"body-orbit","facts":{"Launched":"23 Jul 2020","Arrived":"10 Feb 2021","Delivered":"Zhurong rover"},"blurb":"China's first Mars mission put an orbiter, lander and rover on and around Mars in one launch.","approx":"Remote-sensing orbit roughly 265 x 10,700 km; all values approximate, not verified this session.","alt_km":5500,"inc_deg":87,"body":"mars","period_hr":7.1},{"id":"hope","name":"Emirates Mars Mission (Hope)","agency":"UAE Space Agency / MBRSC","launched":"2020-07-19","status":"active","where":"body-orbit","facts":{"Launched":"19 Jul 2020","Arrived":"9 Feb 2021","First":"Arab interplanetary mission"},"blurb":"Hope's high, wide orbit lets it watch Mars's weather across the whole planet at all times of day.","approx":"Science orbit ~20,000 x 43,000 km, ~25 deg inclination, ~55 h period; not re-verified this session.","alt_km":31500,"inc_deg":25,"body":"mars","period_hr":55},{"id":"viking1","name":"Viking 1 lander","agency":"NASA","launched":"1975-08-20","status":"ended","where":"surface","facts":{"Launched":"1975-08-20","Landed":"1976-07-20","Last contact":"Nov 1982"},"blurb":"First successful Mars lander to operate on the surface; it returned data for over six years.","body":"mars","lat":22.27,"lon":-47.95},{"id":"viking2","name":"Viking 2 lander","agency":"NASA","launched":"1975-09-09","status":"ended","where":"surface","facts":{"Launched":"1975-09-09","Landed":"1976-09-03","Last contact":"Apr 1980"},"blurb":"Landed in Utopia Planitia and saw frost form on the ground in Martian winter.","body":"mars","lat":47.64,"lon":134.29},{"id":"pathfinder","name":"Mars Pathfinder / Sojourner","agency":"NASA","launched":"1996-12-04","status":"ended","where":"surface","facts":{"Launched":"1996-12-04","Landed":"1997-07-04","Last contact":"Sep 1997"},"blurb":"Sojourner was the first rover on another planet; the lander bounced down on airbags.","approx":"Published landing-site coordinates, not re-verified this session.","body":"mars","lat":19.13,"lon":-33.22},{"id":"spirit","name":"Spirit (MER-A)","agency":"NASA","launched":"2003-06-10","status":"ended","where":"surface","facts":{"Launched":"2003-06-10","Landed":"2004-01-04","Last contact":"Mar 2010"},"blurb":"Planned for 90 days, Spirit explored Gusev crater for six years before getting stuck in sand.","approx":"Published landing-site coordinates, not re-verified this session.","body":"mars","lat":-14.5684,"lon":175.4726},{"id":"opportunity","name":"Opportunity (MER-B)","agency":"NASA","launched":"2003-07-07","status":"ended","where":"surface","facts":{"Launched":"2003-07-07","Landed":"2004-01-25","Last contact":"Jun 2018"},"blurb":"Opportunity drove more than a marathon's distance and found clear signs of past water.","approx":"Published landing-site coordinates, not re-verified this session.","body":"mars","lat":-1.9462,"lon":354.4734},{"id":"phoenix","name":"Phoenix","agency":"NASA","launched":"2007-08-04","status":"ended","where":"surface","facts":{"Launched":"2007-08-04","Landed":"2008-05-25","Last contact":"Nov 2008"},"blurb":"Dug into Mars's arctic plains and touched water ice just below the surface.","approx":"Published landing-site coordinates, not re-verified this session.","body":"mars","lat":68.22,"lon":234.25},{"id":"curiosity","name":"Curiosity","agency":"NASA","launched":"2011-11-26","status":"active","where":"surface","facts":{"Launched":"2011-11-26","Landed":"2012-08-06"},"blurb":"A car-sized nuclear-powered rover climbing Mount Sharp inside Gale crater.","approx":"Landing-site coordinates; the rover has since driven several km to tens of km from here.","body":"mars","lat":-4.5895,"lon":137.4417},{"id":"insight","name":"InSight","agency":"NASA","launched":"2018-05-05","status":"ended","where":"surface","facts":{"Launched":"2018-05-05","Landed":"2018-11-26","Last contact":"Dec 2022"},"blurb":"InSight recorded more than 1,300 marsquakes and mapped the planet's interior.","approx":"Published landing-site coordinates, not re-verified this session.","body":"mars","lat":4.502,"lon":135.623},{"id":"perseverance","name":"Perseverance & Ingenuity","agency":"NASA","launched":"2020-07-30","status":"active","where":"surface","facts":{"Launched":"2020-07-30","Landed":"2021-02-18"},"blurb":"Perseverance is collecting rock samples in Jezero crater. Its helicopter Ingenuity made the first powered flights on another world.","approx":"Landing-site coordinates; the rover has since driven several km to tens of km from here.","body":"mars","lat":18.4447,"lon":77.4508},{"id":"zhurong","name":"Zhurong","agency":"CNSA","launched":"2020-07-23","status":"dormant (no contact since May 2022)","where":"surface","facts":{"Launched":"23 Jul 2020","Landed":"14 May 2021","Hibernated":"May 2022"},"blurb":"China's first Mars rover explored Utopia Planitia for a year before dust kept it from waking from hibernation.","body":"mars","lat":25.102,"lon":109.914},{"id":"venera13","name":"Venera 13","agency":"USSR","launched":"1981-10-30","status":"ended","where":"surface","facts":{"Launched":"30 Oct 1981","Landed":"1 Mar 1982","Survived":"127 min","Surface":"~457 C, 89 bar"},"blurb":"Venera 13 sent the first color pictures from the surface of Venus before the heat and pressure overwhelmed it.","body":"venus","lat":-7.5,"lon":303.0},{"id":"akatsuki","name":"Akatsuki","agency":"JAXA","launched":"2010-05-20","status":"ended","where":"body-orbit","facts":{"Launched":"20 May 2010","Entered orbit":"7 Dec 2015 (2nd try)","Ended":"18 Sep 2025"},"blurb":"Japan's Venus climate orbiter missed orbit insertion in 2010 but was rescued five years later. It studied Venus's super-rotating clouds until 2024.","approx":"Elliptical ~1,000 x 360,000 km orbit, ~10-11 day period; alt_km is a rough mean, inclination approximate. Contact lost Apr 2024; operations ended 18 Sep 2025.","alt_km":180000,"inc_deg":3,"body":"venus","period_hr":260},{"id":"huygens","name":"Huygens probe","agency":"ESA","launched":"1997-10-15","status":"ended","where":"surface","facts":{"Launched":"15 Oct 1997 (with Cassini)","Landed":"14 Jan 2005","First":"Landing in the outer Solar System"},"blurb":"Huygens parachuted through Titan's haze and landed on a damp plain of icy pebbles, the most distant landing ever made.","body":"titan","lat":-10.573,"lon":167.665},{"id":"philae","name":"Philae lander","agency":"ESA / DLR","launched":"2004-03-02","status":"ended","where":"surface","facts":{"Launched":"2 Mar 2004 (with Rosetta)","Landed":"12 Nov 2014","Found":"Sep 2016, wedged in a crevice"},"blurb":"The first spacecraft to land on a comet. It bounced twice and came to rest in shadow, but still returned data for about 60 hours.","approx":"Final resting site at Abydos. Comet-frame coordinates are uncertain: one source gives 5S 10W; treat as illustrative only.","body":"67p","lat":-8,"lon":-10},{"id":"juno","name":"Juno","agency":"NASA","launched":"2011-08-05","status":"active (extended)","where":"body-orbit","facts":{"Launched":"5 Aug 2011","Arrived":"4 Jul 2016","Orbit":"Polar, ~33 days","Power":"Solar (at 5 AU)"},"blurb":"Juno swoops low over Jupiter's poles to probe its deep interior, magnetic field and auroras. It has also flown past Ganymede, Europa and Io.","approx":"Polar orbit; period ~33 days after the 2021-2024 moon flybys (a_km computed from that). Ops were guaranteed only to Sep 2025, but a Jan 2026 NASA release scheduled its 81st perijove for 25 Feb 2026. 2026 status otherwise unverified.","inc_deg":90,"body":"jupiter","a_km":2966000,"period_hr":792},{"id":"dawn","name":"Dawn","agency":"NASA","launched":"2007-09-27","status":"ended (defunct in orbit)","where":"body-orbit","facts":{"Launched":"27 Sep 2007","Vesta":"2011-2012","Ceres":"2015-2018","Ended":"1 Nov 2018"},"blurb":"Dawn was the first spacecraft to orbit two different worlds beyond Earth, Vesta and Ceres. It remains a silent satellite of Ceres.","approx":"Final elliptical orbit ~35 x 4,000 km; alt_km is a rough mean. Ran out of hydrazine 31 Oct-1 Nov 2018; expected to stay in orbit for decades.","alt_km":2000,"inc_deg":90,"body":"ceres","period_hr":27},{"id":"bepicolombo","name":"BepiColombo","agency":"ESA / JAXA","launched":"2018-10-20","status":"arriving","where":"heliocentric","facts":{"Launched":"20 Oct 2018","Mercury flybys":"6 (2021-2025)","Orbit insertion":"21 Nov 2026 (planned)"},"blurb":"Two orbiters, Europe's MPO and Japan's Mio, travelling together to Mercury. They are weeks from entering orbit.","approx":"Transfer module separated 3 Sep 2026; Mercury orbit insertion planned 21 Nov 2026, so on 22 Oct 2026 it is effectively at Mercury. Position = Mercury's (Standish approx. ephemeris).","near":"mercury","ecl_lon_deg":334.8,"ecl_lat_deg":-6.7,"r_AU":0.388},{"id":"parker","name":"Parker Solar Probe","agency":"NASA","launched":"2018-08-12","status":"active (extended to 2029)","where":"heliocentric","facts":{"Launched":"12 Aug 2018","Closest approach":"6.16 million km from surface","Top speed":"~192 km/s","Orbit":"88 days"},"blurb":"The fastest object ever built and the closest to the Sun. It dips through the solar corona every 88 days.","approx":"a, q (0.046 AU), Q (0.73 AU), i (3.4 deg) and the 88-day period are from Wikipedia. Node assumed equal to Venus's (orbit lies near Venus's plane); perihelion direction derived by placing the 6 Nov 2024 Venus flyby on the orbit. Orientation is approximate.","ecl_lon_deg":326.3,"ecl_lat_deg":-3.2,"r_AU":0.726,"a_AU":0.388,"e":0.881,"i_deg":3.4,"node_deg":76.7,"peri_deg":67.4,"M_deg":196.4,"epoch":"2026-10-22","M0":229.13524931969732},{"id":"solar-orbiter","name":"Solar Orbiter","agency":"ESA / NASA","launched":"2020-02-10","status":"active","where":"heliocentric","facts":{"Launched":"10 Feb 2020","Perihelion":"0.29 AU","Orbit":"~5.5 months","Goal":"First views of the Sun's poles"},"blurb":"Solar Orbiter uses Venus flybys to tilt its orbit so it can photograph the Sun's poles for the first time.","approx":"Perihelia (0.29 AU) every ~169 days per ESA; a and e derived from that. Orbit tilted ~17 deg to the Sun's equator after the Feb 2025 Venus flyby; tilt to the ecliptic, and so ecl_lat, is not verified (latitude could be up to roughly +/-15 deg). Longitude derived by placing the 18 Feb 2025 Venus flyby on the orbit. Next Venus flyby 24 Dec 2026 raises the tilt to 24 deg.","ecl_lon_deg":72.0,"ecl_lat_deg":0.0,"r_AU":0.87,"a_AU":0.598,"e":0.515,"Tp":2026.6283367556468},{"id":"europa-clipper","name":"Europa Clipper","agency":"NASA","launched":"2024-10-14","status":"cruise","where":"heliocentric","facts":{"Launched":"14 Oct 2024","Mars flyby":"1 Mar 2025","Earth flyby":"3 Dec 2026","Jupiter arrival":"Apr 2030"},"blurb":"NASA's largest planetary spacecraft, heading to Jupiter to find out whether Europa's hidden ocean could support life. It is swinging back toward Earth for a gravity boost.","approx":"Position and elements from a ballistic Mars (1 Mar 2025) to Earth (3 Dec 2026) Lambert arc; about 6 weeks before its Earth gravity assist, roughly 0.3 AU from Earth. Approximate.","ecl_lon_deg":12.1,"ecl_lat_deg":-1.7,"r_AU":0.843,"a_AU":1.6,"e":0.473,"i_deg":2.0,"node_deg":70.5,"peri_deg":303.2,"M_deg":359.5,"epoch":"2026-10-22","M0":271.4898205525906},{"id":"juice","name":"JUICE","agency":"ESA","launched":"2023-04-14","status":"cruise","where":"heliocentric","facts":{"Launched":"14 Apr 2023","Lunar-Earth flyby":"Aug 2024","Venus flyby":"Aug 2025","Earth flybys":"Sep 2026, Jan 2029","Jupiter arrival":"2031"},"blurb":"ESA's Jupiter Icy Moons Explorer will study Ganymede, Callisto and Europa, and will be the first spacecraft to orbit a moon of another planet.","approx":"Just after its Earth gravity assist on 28 Sep 2026 (about 24 days earlier); estimated ~0.1 AU from Earth, outbound. Position is a rough estimate.","ecl_lon_deg":31,"ecl_lat_deg":0.0,"r_AU":1.05},{"id":"lucy","name":"Lucy","agency":"NASA","launched":"2021-10-16","status":"cruise","where":"heliocentric","facts":{"Launched":"16 Oct 2021","Dinkinesh":"Nov 2023","Donaldjohanson":"20 Apr 2025","Eurybates":"12 Aug 2027","Patroclus":"2033"},"blurb":"Lucy is the first mission to Jupiter's Trojan asteroids. It is crossing toward the swarm that leads Jupiter in its orbit.","approx":"Elements from a ballistic Lambert arc from the 12 Dec 2024 Earth flyby to the 12 Aug 2027 Eurybates flyby; the same arc passes within 0.01 AU of Donaldjohanson on its real 20 Apr 2025 flyby date.","ecl_lon_deg":223.8,"ecl_lat_deg":-2.6,"r_AU":5.126,"a_AU":3.338,"e":0.712,"i_deg":4.5,"node_deg":260.1,"peri_deg":161.2,"M_deg":112.0,"epoch":"2026-10-22","M0":329.7042943906672},{"id":"psyche-sc","name":"Psyche (spacecraft)","agency":"NASA","launched":"2023-10-13","status":"cruise","where":"heliocentric","facts":{"Launched":"13 Oct 2023","Mars flyby":"15 May 2026 (4,609 km)","Arrival":"Aug 2029","Propulsion":"Hall-effect thrusters"},"blurb":"Psyche is flying to a metal-rich asteroid that may be the exposed core of a shattered protoplanet. It gained speed from Mars in May 2026.","approx":"Rough estimate: ~5 months after the 15 May 2026 Mars flyby, modelled as an orbit with perihelion at the flyby point and aphelion ~3 AU. The real path uses continuous electric propulsion.","ecl_lon_deg":96.3,"ecl_lat_deg":-1.6,"r_AU":1.895},{"id":"hera","name":"Hera","agency":"ESA","launched":"2024-10-07","status":"arriving","where":"heliocentric","facts":{"Launched":"7 Oct 2024","Mars/Deimos flyby":"12 Mar 2025","Arrival":"Nov 2026","CubeSats":"Milani, Juventas"},"blurb":"Hera is arriving at the asteroid pair Didymos and Dimorphos to measure what NASA's DART impact did to them in 2022.","approx":"Imaged Didymos from 236,500 km on 7 Oct 2026 and began braking on 15 Oct; arrival Nov 2026. Position = Didymos's, propagated from its Wikipedia elements.","near":"didymos","ecl_lon_deg":316.7,"ecl_lat_deg":-3.1,"r_AU":1.281},{"id":"tianwen2","name":"Tianwen-2","agency":"CNSA","launched":"2025-05-28","status":"active (at asteroid)","where":"heliocentric","facts":{"Launched":"28 May 2025","Arrived":"Jul 2026","Sample return":"Nov 2027 (planned)","Next target":"Comet 311P (2035)"},"blurb":"China's first asteroid sample-return mission is orbiting Kamo'oalewa, a tiny quasi-moon of Earth that may be a chip off our Moon.","approx":"Rendezvoused with Kamo'oalewa in June-July 2026 and is surveying it before sampling; departure planned 24 Apr 2027, sample capsule to Earth 29 Nov 2027, then on to comet 311P (2035). Position = Kamo'oalewa's.","near":"kamooalewa","ecl_lon_deg":30.1,"ecl_lat_deg":-4.6,"r_AU":0.903},{"id":"tesla-roadster","name":"Tesla Roadster (Starman)","agency":"SpaceX","launched":"2018-02-06","status":"derelict","where":"heliocentric","facts":{"Launched":"6 Feb 2018 (Falcon Heavy test)","Orbit":"~1.0-1.66 AU","Period":"~557 days"},"blurb":"A red sports car with a spacesuited mannequin at the wheel, launched as a dummy payload on Falcon Heavy's first flight. It now loops between Earth's and Mars's orbits.","approx":"Elements from where-is-tesla-roadster.space (based on a 2018 JPL Horizons solution); M shifted back from its 2035 epoch, so the position may be off by several degrees.","ecl_lon_deg":5.1,"ecl_lat_deg":0.8,"r_AU":1.48,"a_AU":1.325,"e":0.256,"i_deg":1.07,"node_deg":316.8,"peri_deg":177.9,"M_deg":255.9,"epoch":"2026-10-22","M0":48.96561534081138},{"id":"voyager1","name":"Voyager 1","agency":"NASA","launched":"1977-09-05","status":"active","where":"escape","facts":{"Launched":"5 Sep 1977","Jupiter":"Mar 1979","Saturn":"Nov 1980","Interstellar space":"25 Aug 2012","One light-day from Earth":"18 Nov 2026"},"blurb":"The most distant human-made object. It crossed into interstellar space in 2012 and reaches one light-day from Earth in November 2026.","approx":"Distance scaled to 2026-10-22 from Heaven's Above values (table date not stated, inferred ~Mar 2026) and anchored to NASA's 1-light-day date for Voyager 1; uncertainty ~0.5 AU. Direction from the RA/Dec on Heaven's Above, converted to ecliptic J2000.","ecl_lon_deg":257.4,"ecl_lat_deg":35.2,"r_AU":172.1,"speed_AU_per_yr":3.569},{"id":"voyager2","name":"Voyager 2","agency":"NASA","launched":"1977-08-20","status":"active","where":"escape","facts":{"Launched":"20 Aug 1977","Planets visited":"Jupiter, Saturn, Uranus, Neptune","Interstellar space":"5 Nov 2018"},"blurb":"The only spacecraft to visit Uranus and Neptune. It is heading south out of the Solar System, toward the constellation Pavo.","approx":"Distance scaled to 2026-10-22 from Heaven's Above values (table date not stated, inferred ~Mar 2026) and anchored to NASA's 1-light-day date for Voyager 1; uncertainty ~0.5 AU. Direction from the RA/Dec on Heaven's Above, converted to ecliptic J2000.","ecl_lon_deg":290.4,"ecl_lat_deg":-38.3,"r_AU":144.2,"speed_AU_per_yr":3.219},{"id":"pioneer10","name":"Pioneer 10","agency":"NASA","launched":"1972-03-03","status":"ended","where":"escape","facts":{"Launched":"3 Mar 1972","Jupiter flyby":"Dec 1973","Last signal":"Jan 2003","Heading":"Toward Aldebaran (Taurus)"},"blurb":"The first spacecraft to cross the asteroid belt and visit Jupiter. It carries a plaque with a message for anyone who finds it.","approx":"Distance scaled to 2026-10-22 from Heaven's Above values (table date not stated, inferred ~Mar 2026) and anchored to NASA's 1-light-day date for Voyager 1; uncertainty ~0.5 AU. Direction from the RA/Dec on Heaven's Above, converted to ecliptic J2000.","ecl_lon_deg":79.0,"ecl_lat_deg":3.0,"r_AU":142.1,"speed_AU_per_yr":2.504},{"id":"pioneer11","name":"Pioneer 11","agency":"NASA","launched":"1973-04-06","status":"ended","where":"escape","facts":{"Launched":"6 Apr 1973","Jupiter":"Dec 1974","Saturn":"Sep 1979","Last signal":"Nov 1995"},"blurb":"The first spacecraft to fly past Saturn. It is now coasting silently toward the constellation Aquila.","approx":"Distance scaled to 2026-10-22 from Heaven's Above values (table date not stated, inferred ~Mar 2026) and anchored to NASA's 1-light-day date for Voyager 1; uncertainty ~0.5 AU. Direction from the RA/Dec on Heaven's Above, converted to ecliptic J2000.","ecl_lon_deg":284.5,"ecl_lat_deg":13.8,"r_AU":119.5,"speed_AU_per_yr":2.348},{"id":"new-horizons","name":"New Horizons","agency":"NASA","launched":"2006-01-19","status":"active","where":"escape","facts":{"Launched":"19 Jan 2006","Pluto flyby":"14 Jul 2015","Arrokoth flyby":"1 Jan 2019"},"blurb":"The first mission to Pluto, and the first to visit a Kuiper Belt object, Arrokoth. It is still exploring the outer heliosphere.","approx":"Distance scaled to 2026-10-22 from Heaven's Above values (table date not stated, inferred ~Mar 2026) and anchored to NASA's 1-light-day date for Voyager 1; uncertainty ~0.5 AU. Direction from the RA/Dec on Heaven's Above, converted to ecliptic J2000.","ecl_lon_deg":289.2,"ecl_lat_deg":2.0,"r_AU":65.8,"speed_AU_per_yr":2.867}];
(function(){
  const has = new Set(BODIES.map(b => b.id));
  const f0 = n => n >= 100 ? Math.round(n).toLocaleString("en-US") : n >= 10 ? n.toFixed(0) : n.toFixed(2);
  EXTRA_SMALL.forEach(s => {
    if (has.has(s.id)) return;
    const comet = s.sub === "Comet", ist = s.sub === "Interstellar object";
    const facts = {"Size": s.R*2 < 1 ? `~${Math.round(s.R*2000)} m` : `~${f0(s.R*2)} km`};
    if (s.a) facts["Orbit"] = `${f0(s.a)} AU average · ${f0(Math.pow(s.a,1.5))} years`;
    if (s.q) facts["Closest to Sun"] = `${s.q.toFixed(2)} AU`;
    if (s.Tp) facts["Perihelion"] = `${Math.floor(s.Tp)}`;
    facts["Tilt"] = `${s.i.toFixed(1)}°`;
    BODIES.push(Object.assign({ kind: comet || ist ? "comet" : "small", extra:1, tex: comet || ist ? "comet" : "asteroid", lumpy:1, interior: comet || ist ? "comet" : "rubble",
      tint: comet ? "#5d5a56" : "#8a8580", rot: 7 + (s.R % 5), facts, blurb: s.blurb + (s.approx ? " (Some values approximate.)" : "") }, s));
  });
  const earth = BODIES.find(b => b.id === "earth");
  CRAFT.forEach(c => {
    const facts = Object.assign({}, c.facts || {}, {"Status": c.status});
    const base = { id:"sc-" + c.id, name:c.name, kind:"craft", agency:c.agency, status:c.status, facts, blurb:(c.blurb || "") + (c.approx ? " Position approximate." : "") };
    const B = id => BODIES.find(b => b.id === id);
    if (c.where === "surface"){
      const host = B(c.body); if (!host) return;
      (host.features = host.features || []).push({ n:c.name, lat:c.lat, lon:((c.lon + 180) % 360 + 360) % 360 - 180, craft:1, d:`${c.blurb || ""} ${c.agency ? "(" + c.agency + ", launched " + (c.launched || "").slice(0,4) + ")" : ""}`.trim() });
      return;
    }
    if (c.where === "earth-orbit"){
      const a = c.perigee_km ? 6371 + (c.perigee_km + c.apogee_km)/2 : 6371 + c.alt_km;
      BODIES.push(Object.assign(base, { parent:"earth", R:.02, a, P:(c.period_min || 95)/1440, inc:c.inc_deg || 0, ecc:c.perigee_km ? (c.apogee_km - c.perigee_km)/(c.apogee_km + c.perigee_km + 2*6371) : 0 }));
    } else if (c.where === "body-orbit"){
      const host = B(c.body); if (!host) return;
      BODIES.push(Object.assign(base, { parent:c.body, R:.02, a:c.a_km || host.R + c.alt_km, P:(c.period_hr || 2)/24, inc:c.inc_deg || 0 }));
    } else if (c.where === "lagrange"){
      BODIES.push(Object.assign(base, { R:.02, lp:c.point }));
    } else if (c.where === "heliocentric"){
      if (c.near && B(c.near)){ const host = B(c.near); BODIES.push(Object.assign(base, { parent:c.near, R:.02, a:host.R*4, P:host.R < 5 ? 2 : 3, inc:10 })); }
      else if (c.a_AU) BODIES.push(Object.assign(base, { R:.02, a:c.a_AU, e:c.e, i:c.i_deg || 0, node:c.node_deg || 0, peri:c.peri_deg || 0, M0:c.M0, Tp:c.M0 === undefined ? c.Tp : undefined }));
      else BODIES.push(Object.assign(base, { R:.02, fixed:[c.ecl_lon_deg, c.ecl_lat_deg, c.r_AU] }));
    } else if (c.where === "escape"){
      BODIES.push(Object.assign(base, { R:.02, esc:[c.ecl_lon_deg, c.ecl_lat_deg, c.r_AU, c.speed_AU_per_yr] }));
    }
  });
})();

/* temperatures, pressures and densities: see sources in the credits (standard models, NASA fact sheets, JPL) */
const CONDITIONS = {"layers":{"sun":[{"name":"Core","T_C":"≈ 8–15.7 million °C","P":"≈ 2×10¹⁰–2.6×10¹¹ bar (2–26 PPa; centre 265 billion atm)","rho":"≈ 20–150 g/cm³","Tmid":11500000.0,"Pmid_bar":70000000000.0},{"name":"Radiative zone","T_C":"≈ 2.2–8 million °C","P":"≈ 6×10⁷–2×10¹⁰ bar","rho":"≈ 0.2–20 g/cm³","Tmid":4500000.0,"Pmid_bar":1000000000.0},{"name":"Tachocline","T_C":"≈ 2.2 million °C","P":"≈ 5–6×10⁷ bar (≈ 5–6 TPa)","rho":"≈ 0.2 g/cm³","Tmid":2200000.0,"Pmid_bar":55000000.0},{"name":"Convective zone","T_C":"≈ 6,000 °C (top) to 2.2 million °C (base)","P":"≈ 0.1 bar to 6×10⁷ bar","rho":"≈ 2×10⁻⁷–0.2 g/cm³","Tmid":500000.0,"Pmid_bar":1000000.0},{"name":"Photosphere","T_C":"≈ 4,100–6,100 °C (effective 5,500 °C)","P":"≈ 0.01–0.12 bar","rho":"≈ 10⁻⁸–3×10⁻⁷ g/cm³","Tmid":5500,"Pmid_bar":0.1}],"mercury":[{"name":"Solid inner core","T_C":"≈ 1,700–2,000 °C","P":"≈ 30–40 GPa (0.3–0.4 million atm)","rho":"≈ 8–9 g/cm³","Tmid":1850,"Pmid_bar":350000.0},{"name":"Liquid outer core","T_C":"≈ 1,350–1,700 °C","P":"≈ 5–30 GPa (50,000–300,000 atm)","rho":"≈ 6.8–7.5 g/cm³","Tmid":1550,"Pmid_bar":170000.0},{"name":"Mantle","T_C":"≈ 400–1,450 °C","P":"≈ 0.4–6 GPa","rho":"≈ 3.2–3.4 g/cm³","Tmid":950,"Pmid_bar":30000.0},{"name":"Crust","T_C":"−173 to 427 °C at the surface; ≈ 400 °C at the base","P":"0 to ≈ 0.4 GPa","rho":"≈ 2.7–3.1 g/cm³","Tmid":200,"Pmid_bar":2000.0}],"venus":[{"name":"Iron core","T_C":"≈ 3,000–5,400 °C","P":"≈ 120–350 GPa (1.2–3.5 million atm)","rho":"≈ 9.5–13 g/cm³","Tmid":4200,"Pmid_bar":2300000.0},{"name":"Mantle","T_C":"≈ 700–3,000 °C","P":"≈ 1–120 GPa","rho":"≈ 3.3–5.5 g/cm³","Tmid":1850,"Pmid_bar":600000.0},{"name":"Crust","T_C":"464 °C at the surface to ≈ 700–900 °C at the base","P":"92 bar to ≈ 1.5 GPa","rho":"≈ 2.8–3.0 g/cm³","Tmid":650,"Pmid_bar":7000.0}],"earth":[{"name":"Inner core","T_C":"≈ 5,200–5,700 °C","P":"330–364 GPa (3.3–3.6 million atm)","rho":"12.8–13.1 g/cm³","Tmid":5400,"Pmid_bar":3470000.0},{"name":"Outer core","T_C":"≈ 3,700–5,200 °C","P":"136–330 GPa (1.3–3.3 million atm)","rho":"9.9–12.2 g/cm³","Tmid":4450,"Pmid_bar":2300000.0},{"name":"Lower mantle","T_C":"≈ 1,600–3,700 °C","P":"24–136 GPa","rho":"4.4–5.6 g/cm³","Tmid":2400,"Pmid_bar":800000.0},{"name":"Upper mantle","T_C":"≈ 500–1,600 °C","P":"≈ 1–24 GPa","rho":"3.3–4.0 g/cm³","Tmid":1100,"Pmid_bar":120000.0},{"name":"Crust","T_C":"≈ 15 °C at the surface to 400–1,000 °C at the base","P":"1 bar to ≈ 1–2 GPa","rho":"2.7–3.0 g/cm³","Tmid":400,"Pmid_bar":5000.0}],"moon":[{"name":"Solid inner core","T_C":"≈ 1,300–1,450 °C","P":"≈ 4.8–5.1 GPa (≈ 50,000 atm)","rho":"≈ 8 g/cm³","Tmid":1380,"Pmid_bar":49500.0},{"name":"Fluid outer core","T_C":"≈ 1,300–1,400 °C","P":"≈ 4.5–4.8 GPa","rho":"≈ 5–7 g/cm³","Tmid":1350,"Pmid_bar":46500.0},{"name":"Partial-melt layer","T_C":"≈ 1,250–1,350 °C","P":"≈ 4.3–4.5 GPa","rho":"≈ 3.4–3.6 g/cm³","Tmid":1300,"Pmid_bar":44000.0},{"name":"Mantle","T_C":"≈ 300–1,250 °C","P":"≈ 0.2–4.3 GPa","rho":"≈ 3.3–3.4 g/cm³","Tmid":800,"Pmid_bar":22000.0},{"name":"Crust","T_C":"−173 to 127 °C at the surface; ≈ 300 °C at the base","P":"0 to ≈ 0.2 GPa","rho":"≈ 2.5–2.6 g/cm³","Tmid":0,"Pmid_bar":1000.0}],"mars":[{"name":"Liquid iron core","T_C":"≈ 1,700–2,100 °C","P":"≈ 19–40 GPa (0.2–0.4 million atm)","rho":"≈ 5.7–6.5 g/cm³","Tmid":1900,"Pmid_bar":300000.0},{"name":"Molten silicate layer","T_C":"≈ 1,650–1,750 °C","P":"≈ 17–19 GPa","rho":"≈ 4.0–4.2 g/cm³","Tmid":1700,"Pmid_bar":180000.0},{"name":"Mantle","T_C":"≈ 500–1,650 °C","P":"≈ 0.6–17 GPa","rho":"≈ 3.4–4.0 g/cm³","Tmid":1100,"Pmid_bar":90000.0},{"name":"Crust","T_C":"−153 to 20 °C at the surface; ≈ 500 °C at the base","P":"6 mbar to ≈ 0.8 GPa","rho":"≈ 2.6–3.1 g/cm³","Tmid":200,"Pmid_bar":3000.0}],"jupiter":[{"name":"Dilute core","T_C":"≈ 12,000–20,000 °C","P":"≈ 25–45 Mbar (2,500–4,500 GPa)","rho":"≈ 3–5 g/cm³","Tmid":16000,"Pmid_bar":35000000.0},{"name":"Metallic hydrogen","T_C":"≈ 6,000–12,000 °C","P":"≈ 1.5–25 Mbar (150–2,500 GPa)","rho":"≈ 0.8–3 g/cm³","Tmid":9000,"Pmid_bar":10000000.0},{"name":"Molecular hydrogen","T_C":"≈ −100 °C to 6,000 °C","P":"≈ 10 bar to 1.5 Mbar","rho":"≈ 0.001–0.8 g/cm³","Tmid":2500,"Pmid_bar":500000.0},{"name":"Cloud decks","T_C":"−161 °C (0.1 bar) to ≈ 0–30 °C (water clouds, ~5–7 bar); 1 bar level −108 °C","P":"≈ 0.1–7 bar","rho":"≈ 10⁻⁵–10⁻³ g/cm³","Tmid":-80,"Pmid_bar":1}],"saturn":[{"name":"Diffuse core","T_C":"≈ 9,000–12,000 °C","P":"≈ 10–15 Mbar (1,000–1,500 GPa)","rho":"≈ 4–6 g/cm³","Tmid":10500,"Pmid_bar":12000000.0},{"name":"Metallic hydrogen","T_C":"≈ 6,000–9,000 °C","P":"≈ 2–10 Mbar (200–1,000 GPa)","rho":"≈ 1–3 g/cm³","Tmid":7500,"Pmid_bar":5000000.0},{"name":"Helium rain","T_C":"≈ 5,000–6,500 °C","P":"≈ 1–2 Mbar (100–200 GPa)","rho":"≈ 0.8–1 g/cm³","Tmid":5700,"Pmid_bar":1500000.0},{"name":"Molecular hydrogen","T_C":"≈ −100 °C to 5,000 °C","P":"≈ 10 bar to 1 Mbar","rho":"≈ 0.001–0.8 g/cm³","Tmid":2000,"Pmid_bar":300000.0},{"name":"Atmosphere","T_C":"−189 °C (0.1 bar) to −139 °C (1 bar), warming below","P":"≈ 0.1–10 bar","rho":"≈ 10⁻⁵–10⁻³ g/cm³","Tmid":-140,"Pmid_bar":1}],"uranus":[{"name":"Rocky core","T_C":"≈ 4,700–7,000 °C","P":"≈ 5–8 Mbar (500–800 GPa)","rho":"≈ 4.5–9 g/cm³","Tmid":5800,"Pmid_bar":6000000.0,"approx":true},{"name":"Icy mantle","T_C":"≈ 1,700–4,700 °C","P":"≈ 0.1–5 Mbar (10–500 GPa)","rho":"≈ 1–4 g/cm³","Tmid":3200,"Pmid_bar":1500000.0},{"name":"Hydrogen-helium envelope","T_C":"−224 °C (tropopause) / −197 °C (1 bar) to ≈ 1,700 °C","P":"≈ 0.1 bar to 0.1 Mbar (10 GPa)","rho":"≈ 4×10⁻⁴–0.5 g/cm³","Tmid":700,"Pmid_bar":1000.0}],"neptune":[{"name":"Rocky core","T_C":"≈ 5,000–7,800 °C","P":"≈ 6–8 Mbar (600–800 GPa)","rho":"≈ 5–10 g/cm³","Tmid":6400,"Pmid_bar":7000000.0,"approx":true},{"name":"Icy mantle","T_C":"≈ 1,800–5,000 °C","P":"≈ 0.1–6 Mbar (10–600 GPa)","rho":"≈ 1–4.5 g/cm³","Tmid":3400,"Pmid_bar":2000000.0},{"name":"Hydrogen-helium envelope","T_C":"−218 °C (tropopause) / −201 °C (1 bar) to ≈ 1,800 °C","P":"≈ 0.1 bar to 0.1 Mbar (10 GPa)","rho":"≈ 4×10⁻⁴–0.5 g/cm³","Tmid":800,"Pmid_bar":1000.0}],"io":[{"name":"Iron core","T_C":"≈ 1,300–1,700 °C","P":"≈ 5–9 GPa","rho":"≈ 5–8 g/cm³","Tmid":1500,"Pmid_bar":70000.0},{"name":"Mantle","T_C":"≈ 1,200–1,500 °C","P":"≈ 1–5 GPa","rho":"≈ 3.2–3.4 g/cm³","Tmid":1350,"Pmid_bar":30000.0},{"name":"Partially molten layer","T_C":"≈ 1,200–1,400 °C (≥20% melt)","P":"≈ 0.3–1 GPa","rho":"≈ 3.0–3.2 g/cm³","Tmid":1300,"Pmid_bar":6500.0},{"name":"Crust","T_C":"−183 to −143 °C at the surface (lava up to ≈ 1,300 °C); ≈ 1,200 °C at the base","P":"0 to ≈ 0.3 GPa","rho":"≈ 2.6–3.0 g/cm³ (sulfur-rich ≈ 2)","Tmid":500,"Pmid_bar":1500.0}],"europa":[{"name":"Iron core","T_C":"≈ 1,000–1,500 °C","P":"≈ 3.5–5 GPa","rho":"≈ 5–8 g/cm³","Tmid":1250,"Pmid_bar":42000.0,"approx":true},{"name":"Rocky mantle","T_C":"≈ 0–1,000 °C","P":"≈ 0.2–3.5 GPa","rho":"≈ 3.0–3.6 g/cm³","Tmid":500,"Pmid_bar":18000.0},{"name":"Salty ocean","T_C":"≈ −5 to 0 °C","P":"≈ 300–1,900 bar (30–190 MPa)","rho":"≈ 1.0–1.1 g/cm³","Tmid":-2,"Pmid_bar":1100},{"name":"Ice shell","T_C":"−220 to −160 °C at the surface; ≈ −3 °C at the base","P":"0 to ≈ 300 bar (30 MPa)","rho":"≈ 0.92–0.94 g/cm³","Tmid":-100,"Pmid_bar":150}],"ganymede":[{"name":"Solid iron core","T_C":"≈ 1,400–1,600 °C","P":"≈ 7–9 GPa","rho":"≈ 7.5–8 g/cm³","Tmid":1500,"Pmid_bar":80000.0,"approx":true},{"name":"Liquid iron sulfide core","T_C":"≈ 1,300–1,500 °C","P":"≈ 6–7 GPa","rho":"≈ 5.5–6 g/cm³","Tmid":1400,"Pmid_bar":65000.0,"approx":true},{"name":"Rocky mantle","T_C":"≈ 200–1,300 °C","P":"≈ 1.5–6 GPa","rho":"≈ 3.0–3.6 g/cm³","Tmid":750,"Pmid_bar":35000.0},{"name":"High-pressure ice","T_C":"≈ −20 to 30 °C","P":"≈ 0.4–1.5 GPa (4,000–15,000 bar)","rho":"≈ 1.15–1.35 g/cm³ (ices III, V, VI)","Tmid":5,"Pmid_bar":9500},{"name":"Saltwater ocean","T_C":"≈ −20 to 0 °C","P":"≈ 0.2–0.4 GPa (2,000–4,000 bar)","rho":"≈ 1.0–1.15 g/cm³","Tmid":-10,"Pmid_bar":3000},{"name":"Ice crust","T_C":"−203 to −121 °C at the surface; ≈ −20 °C at the base","P":"0 to ≈ 0.2 GPa (2,000 bar)","rho":"≈ 0.92–0.94 g/cm³","Tmid":-90,"Pmid_bar":1000}],"callisto":[{"name":"Rock-ice interior","T_C":"≈ 0–600 °C","P":"≈ 0.3–3.5 GPa","rho":"≈ 1.8–3.0 g/cm³ (denser toward the centre)","Tmid":300,"Pmid_bar":19000.0,"approx":true},{"name":"Possible ocean","T_C":"≈ −30 to 0 °C","P":"≈ 0.14–0.3 GPa (1,400–3,000 bar)","rho":"≈ 1.0–1.1 g/cm³","Tmid":-15,"Pmid_bar":2200},{"name":"Ice crust","T_C":"−193 to −108 °C at the surface; ≈ −20 °C at the base","P":"0 to ≈ 0.14 GPa (1,400 bar)","rho":"≈ 0.93–1.5 g/cm³ (ice mixed with dust)","Tmid":-100,"Pmid_bar":700}],"titan":[{"name":"Rocky core","T_C":"≈ 0–700 °C","P":"≈ 1.2–5 GPa","rho":"≈ 2.4–2.7 g/cm³ (hydrated silicate)","Tmid":350,"Pmid_bar":30000.0,"approx":true},{"name":"High-pressure ice","T_C":"≈ −20 to 30 °C","P":"≈ 0.55–1.2 GPa","rho":"≈ 1.2–1.35 g/cm³","Tmid":5,"Pmid_bar":8800},{"name":"Subsurface ocean","T_C":"≈ −20 to 0 °C (colder if ammonia-rich)","P":"≈ 0.2–0.55 GPa (2,000–5,500 bar)","rho":"≈ 1.0–1.3 g/cm³","Tmid":-10,"Pmid_bar":3700},{"name":"Ice crust","T_C":"−179 °C at the surface; ≈ −20 °C at the base","P":"1.5 bar to ≈ 0.2 GPa","rho":"≈ 0.92–0.95 g/cm³","Tmid":-100,"Pmid_bar":1000},{"name":"Atmosphere","T_C":"−179 °C at the surface; −203 °C at the tropopause; ≈ −90 °C stratosphere","P":"1.5 bar at the surface, thinning with height","rho":"≈ 0.0053 g/cm³ at the surface","Tmid":-180,"Pmid_bar":0.75}],"enceladus":[{"name":"Porous rocky core","T_C":"≈ 0 to >90 °C (tidally heated, hydrothermal)","P":"≈ 70–400 bar (7–40 MPa)","rho":"≈ 2.4–2.5 g/cm³ (water-filled pores)","Tmid":50,"Pmid_bar":230,"approx":true},{"name":"Global ocean","T_C":"≈ −1 to 0 °C","P":"≈ 25–70 bar (2.5–7 MPa)","rho":"≈ 1.0–1.05 g/cm³","Tmid":-0.5,"Pmid_bar":48},{"name":"Ice shell","T_C":"−201 °C average at the surface (tiger stripes up to ≈ −90 °C); ≈ 0 °C at the base","P":"0 to ≈ 25 bar","rho":"≈ 0.92–0.93 g/cm³","Tmid":-100,"Pmid_bar":12}],"triton":[{"name":"Rocky core","T_C":"≈ 200–700 °C","P":"≈ 0.45–2 GPa","rho":"≈ 3–4 g/cm³ (rock + iron)","Tmid":450,"Pmid_bar":12000.0,"approx":true},{"name":"Ice mantle","T_C":"≈ −30 to 0 °C","P":"≈ 0.13–0.45 GPa","rho":"≈ 0.93–1.3 g/cm³","Tmid":-15,"Pmid_bar":2900},{"name":"Possible ocean","T_C":"≈ −97 to −30 °C (ammonia-water)","P":"≈ 0.08–0.13 GPa (800–1,300 bar)","rho":"≈ 1.0 g/cm³","Tmid":-60,"Pmid_bar":1050,"approx":true},{"name":"Nitrogen-ice crust","T_C":"−235 °C at the surface; ≈ −100 °C at the base","P":"14 µbar to ≈ 0.08 GPa","rho":"≈ 0.93–1.0 g/cm³","Tmid":-170,"Pmid_bar":400}],"pluto":[{"name":"Rocky core","T_C":"≈ 0–600 °C","P":"≈ 0.2–1.3 GPa","rho":"≈ 2.8–3.3 g/cm³","Tmid":300,"Pmid_bar":7500,"approx":true},{"name":"Possible ocean","T_C":"≈ −20 to 0 °C (colder if ammonia-rich)","P":"≈ 0.09–0.2 GPa (900–2,000 bar)","rho":"≈ 1.0–1.1 g/cm³","Tmid":-10,"Pmid_bar":1450,"approx":true},{"name":"Ice shell","T_C":"−240 to −218 °C at the surface; ≈ −20 °C at the base","P":"10 µbar to ≈ 0.09 GPa","rho":"≈ 0.92–1.0 g/cm³ (N₂ ice on top ≈ 1.0)","Tmid":-130,"Pmid_bar":450}],"charon":[{"name":"Rocky core","T_C":"≈ −50 to 200 °C","P":"≈ 0.06–0.3 GPa","rho":"≈ 2.6–3.5 g/cm³","Tmid":75,"Pmid_bar":1800,"approx":true},{"name":"Ice mantle","T_C":"−220 °C at the surface to ≈ −100 °C at depth","P":"0 to ≈ 0.06 GPa (600 bar)","rho":"≈ 0.92–1.0 g/cm³","Tmid":-160,"Pmid_bar":300}],"ceres":[{"name":"Rocky interior","T_C":"≈ 0–300 °C","P":"≈ 0.1–0.2 GPa (1,000–2,000 bar)","rho":"≈ 2.4–2.9 g/cm³","Tmid":150,"Pmid_bar":1500,"approx":true},{"name":"Hydrated mantle","T_C":"≈ −40 to 0 °C (brines)","P":"≈ 0.015–0.1 GPa","rho":"≈ 2.2–2.5 g/cm³","Tmid":-20,"Pmid_bar":580,"approx":true},{"name":"Ice-rich crust","T_C":"−143 to −38 °C at the surface; ≈ −40 °C at the base","P":"0 to ≈ 150 bar (15 MPa)","rho":"≈ 1.3–1.6 g/cm³","Tmid":-90,"Pmid_bar":75}],"vesta":[{"name":"Iron core","T_C":"≈ 0–300 °C today (molten 4.5 billion years ago)","P":"≈ 0.13–0.22 GPa","rho":"≈ 7.1–7.8 g/cm³","Tmid":150,"Pmid_bar":1750,"approx":true},{"name":"Mantle","T_C":"≈ −50 to 200 °C today","P":"≈ 0.015–0.13 GPa","rho":"≈ 3.2–3.5 g/cm³","Tmid":75,"Pmid_bar":720,"approx":true},{"name":"Basaltic crust","T_C":"−188 to −3 °C at the surface","P":"0 to ≈ 150 bar (15 MPa)","rho":"≈ 2.9–3.0 g/cm³","Tmid":-100,"Pmid_bar":75}],"dwarfIcy":[{"name":"Rocky core","T_C":"≈ −50 to 500 °C","P":"≈ 0.05–1 GPa (depends on body size)","rho":"≈ 2.5–3.3 g/cm³","Tmid":200,"Pmid_bar":4000,"approx":true},{"name":"Ice mantle","T_C":"≈ −240 °C at the surface to ≈ −50 °C at depth","P":"0 to ≈ 0.3 GPa","rho":"≈ 0.93–1.2 g/cm³","Tmid":-150,"Pmid_bar":800,"approx":true}],"icyDiff":[{"name":"Rocky core","T_C":"≈ −100 to 200 °C","P":"≈ 0.01–0.3 GPa (100–3,000 bar)","rho":"≈ 2.3–3.0 g/cm³","Tmid":50,"Pmid_bar":800,"approx":true},{"name":"Ice mantle","T_C":"≈ −210 °C at the surface to ≈ −100 °C at depth","P":"0 to ≈ 0.1 GPa (1,000 bar)","rho":"≈ 0.92–1.2 g/cm³","Tmid":-160,"Pmid_bar":300,"approx":true}],"icyMixed":[{"name":"Ice-rock mixture","T_C":"≈ −250 to −100 °C (warmer only deep inside larger bodies such as Rhea)","P":"≈ 0 (moonlets: < 1 bar) to ≈ 0.1 GPa at Rhea's centre","rho":"≈ 0.3–1.5 g/cm³ (highly porous in small bodies)","Tmid":-180,"Pmid_bar":10,"approx":true}],"rubble":[{"name":"Rubble pile","T_C":"≈ −230 to −20 °C depending on distance from the Sun","P":"≈ 0.01 bar (small moons) to ≈ 800 bar at Pallas's centre","rho":"≈ 0.9–2.9 g/cm³ bulk (rock grains ≈ 3; 20–50% voids)","Tmid":-120,"Pmid_bar":5,"approx":true}],"comet":[{"name":"Ice and dust","T_C":"≈ −220 to −150 °C (interior stays cold)","P":"≈ 0 to ≈ 0.015 bar (1.5 kPa) at the centre","rho":"≈ 0.3–0.7 g/cm³ (≈ 70% empty space)","Tmid":-190,"Pmid_bar":0.005,"approx":true},{"name":"Dark crust","T_C":"≈ −200 °C far from the Sun to ≈ +100 °C near perihelion","P":"≈ vacuum (a few Pa of gas under active jets)","rho":"≈ 0.5–1.5 g/cm³","Tmid":-50,"Pmid_bar":1e-05,"approx":true}],"ninth":[{"name":"Rock-ice core","T_C":"≈ 3,000–7,000 °C","P":"≈ 300–1,500 GPa (3–15 Mbar)","rho":"≈ 6–15 g/cm³","Tmid":5000,"Pmid_bar":8000000.0,"approx":true},{"name":"Ice mantle","T_C":"≈ 1,000–4,000 °C","P":"≈ 10–300 GPa","rho":"≈ 1.5–4 g/cm³","Tmid":2500,"Pmid_bar":600000.0,"approx":true},{"name":"Hydrogen-helium envelope","T_C":"≈ −230 °C at the top to ≈ 1,000 °C at the base","P":"≈ 1 bar to ≈ 10 GPa","rho":"≈ 10⁻⁴–0.5 g/cm³","Tmid":400,"Pmid_bar":1000.0,"approx":true}],"mimas":[{"name":"Rocky core","T_C":"≈ 0–100 °C","P":"≈ 65–130 bar (6.5–13 MPa)","rho":"≈ 2.4–2.7 g/cm³","Tmid":50,"Pmid_bar":100,"approx":true},{"name":"Young ocean","T_C":"≈ −1 to 0 °C","P":"≈ 20–65 bar (2–6.5 MPa)","rho":"≈ 1.0 g/cm³","Tmid":-0.5,"Pmid_bar":43,"approx":true},{"name":"Ice shell","T_C":"−209 °C average at the surface; ≈ 0 °C at the base","P":"0 to ≈ 20 bar (2 MPa)","rho":"≈ 0.92–0.93 g/cm³","Tmid":-105,"Pmid_bar":10}],"haumea":[{"name":"Rocky core","T_C":"≈ −50 to 300 °C","P":"≈ 0.06–0.35 GPa","rho":"≈ 2.6–2.8 g/cm³","Tmid":120,"Pmid_bar":2000,"approx":true},{"name":"Ice mantle","T_C":"≈ −240 °C at the surface to ≈ −100 °C at depth","P":"0 to ≈ 0.06 GPa (600 bar)","rho":"≈ 0.93–1.0 g/cm³","Tmid":-170,"Pmid_bar":300,"approx":true}]},"surface":{"sun":{"T":"photosphere ≈ 5,500 °C (effective 5,772 K); ≈ 4,100–6,100 °C through the layer","P":"≈ 0.1 bar at the visible surface (τ = 1)","g":"274","vesc":"617.7","atm":"hydrogen ≈ 92%, helium ≈ 8% (by number of atoms)"},"mercury":{"T":"−173 to 427 °C","P":"trace exosphere (≈ 5×10⁻¹⁵ bar)","g":"3.70","vesc":"4.25","atm":"none (exosphere of O, Na, H, He, K)"},"venus":{"T":"≈ 464 °C day and night","P":"92 bar","g":"8.87","vesc":"10.36","atm":"CO₂ 96.5%, N₂ 3.5%; sulfuric-acid clouds"},"earth":{"T":"−89 to 57 °C (average ≈ 15 °C)","P":"1.013 bar (sea level)","g":"9.81","vesc":"11.19","atm":"N₂ 78%, O₂ 21%, Ar 0.9%, CO₂ 0.04%"},"moon":{"T":"−173 to 127 °C (polar craters down to ≈ −247 °C)","P":"trace exosphere (≈ 3×10⁻¹⁵ bar)","g":"1.62","vesc":"2.38","atm":"none (exosphere of He, Ar, Ne, Na, K)"},"mars":{"T":"−153 to 20 °C (average ≈ −63 °C)","P":"≈ 0.006 bar (4–9 mbar)","g":"3.73","vesc":"5.03","atm":"CO₂ 95%, N₂ 2.8%, Ar 2%"},"phobos":{"T":"≈ −112 to −4 °C","P":"none (vacuum)","g":"0.0058","vesc":"0.011 (11 m/s)","atm":"none"},"deimos":{"T":"≈ −110 to −40 °C","P":"none (vacuum)","g":"0.0025","vesc":"0.006 (5.6 m/s)","atm":"none"},"jupiter":{"T":"cloud tops ≈ −145 °C (1 bar level −108 °C)","P":"no surface — 1 bar level shown","g":"24.79 (1 bar, equator)","vesc":"59.5","atm":"H₂ ≈ 90%, He ≈ 10% (by volume); CH₄, NH₃"},"io":{"T":"≈ −183 to −143 °C (volcanic hotspots up to ≈ 1,300 °C)","P":"≈ 10⁻⁹ bar (0.3–3 nbar, SO₂)","g":"1.80","vesc":"2.56","atm":"SO₂ (thin, patchy), with SO, S, Na"},"europa":{"T":"≈ −220 to −160 °C","P":"≈ 10⁻¹² bar (0.1 µPa)","g":"1.31","vesc":"2.03","atm":"O₂ (very tenuous)"},"ganymede":{"T":"≈ −203 to −121 °C","P":"≈ 10⁻¹¹ bar (0.2–1.2 µPa)","g":"1.43","vesc":"2.74","atm":"O₂ (very tenuous)"},"callisto":{"T":"≈ −193 to −108 °C","P":"≈ 10⁻¹¹ bar (≈ 7.5 pbar CO₂)","g":"1.24","vesc":"2.44","atm":"CO₂, O₂ (very tenuous)"},"saturn":{"T":"cloud tops ≈ −178 °C (1 bar level −139 °C)","P":"no surface — 1 bar level shown","g":"10.44 (1 bar, equator)","vesc":"35.5","atm":"H₂ ≈ 96%, He ≈ 3%; CH₄, NH₃"},"mimas":{"T":"≈ −209 °C average (≈ −196 °C warmest)","P":"none (vacuum)","g":"0.064","vesc":"0.16","atm":"none"},"enceladus":{"T":"≈ −201 °C average; tiger stripes up to ≈ −90 °C","P":"none globally (local water-vapour plumes)","g":"0.113","vesc":"0.24","atm":"none (south-polar H₂O plumes)"},"tethys":{"T":"≈ −187 °C average","P":"none (vacuum)","g":"0.146","vesc":"0.39","atm":"none"},"dione":{"T":"≈ −186 °C average","P":"trace (O₂ exosphere, ≈ 10⁻¹⁴ bar)","g":"0.232","vesc":"0.51","atm":"none (trace O₂ exosphere)"},"rhea":{"T":"≈ −220 to −174 °C","P":"trace (O₂/CO₂ exosphere, ≈ 10⁻¹⁴ bar)","g":"0.264","vesc":"0.64","atm":"none (trace O₂, CO₂ exosphere)"},"titan":{"T":"−179 °C (≈ −183 °C at the poles)","P":"1.47 bar","g":"1.35","vesc":"2.64","atm":"N₂ ≈ 95–98%, CH₄ ≈ 1.5–5%"},"hyperion":{"T":"≈ −180 °C","P":"none (vacuum)","g":"0.02","vesc":"0.074 (74 m/s)","atm":"none"},"iapetus":{"T":"≈ −183 °C (bright side) to −143 °C (dark side)","P":"none (vacuum)","g":"0.224","vesc":"0.57","atm":"none"},"phoebe":{"T":"≈ −200 to −161 °C","P":"none (vacuum)","g":"0.049","vesc":"0.10","atm":"none"},"uranus":{"T":"cloud tops ≈ −216 °C (1 bar level −197 °C)","P":"no surface — 1 bar level shown","g":"8.87 (1 bar, equator)","vesc":"21.3","atm":"H₂ 83%, He 15%, CH₄ 2.3%"},"miranda":{"T":"≈ −213 to −187 °C","P":"none (vacuum)","g":"0.077","vesc":"0.19","atm":"none"},"ariel":{"T":"≈ −215 to −189 °C","P":"none (vacuum)","g":"0.249","vesc":"0.54","atm":"none"},"umbriel":{"T":"≈ −213 to −188 °C","P":"none (vacuum)","g":"0.249","vesc":"0.54","atm":"none"},"titania":{"T":"≈ −203 to −184 °C","P":"< 10⁻⁸ bar (upper limit)","g":"0.365","vesc":"0.76","atm":"none detected (CO₂ upper limit)"},"oberon":{"T":"≈ −203 to −193 °C","P":"none (vacuum)","g":"0.354","vesc":"0.73","atm":"none"},"neptune":{"T":"cloud tops ≈ −218 °C (1 bar level −201 °C)","P":"no surface — 1 bar level shown","g":"11.15 (1 bar, equator)","vesc":"23.5","atm":"H₂ 80%, He 19%, CH₄ 1.5%"},"triton":{"T":"≈ −235 °C","P":"≈ 1.4×10⁻⁵ bar (14 µbar)","g":"0.781","vesc":"1.45","atm":"N₂ with traces of CH₄, CO"},"nereid":{"T":"≈ −222 °C","P":"none (vacuum)","g":"0.071","vesc":"0.16","atm":"none","approx":true},"proteus":{"T":"≈ −222 °C","P":"none (vacuum)","g":"0.06","vesc":"0.16","atm":"none"},"ceres":{"T":"≈ −143 to −38 °C","P":"trace (transient water-vapour exosphere)","g":"0.284","vesc":"0.52","atm":"none (transient H₂O exosphere)"},"vesta":{"T":"≈ −188 to −3 °C","P":"none (vacuum)","g":"0.251","vesc":"0.36","atm":"none"},"pallas":{"T":"≈ −160 to −30 °C","P":"none (vacuum)","g":"0.208","vesc":"0.33","atm":"none","approx":true},"hygiea":{"T":"≈ −160 to −30 °C","P":"none (vacuum)","g":"0.124","vesc":"0.23","atm":"none","approx":true},"pluto":{"T":"−240 to −218 °C (average ≈ −229 °C)","P":"≈ 1×10⁻⁵ bar (10 µbar)","g":"0.616","vesc":"1.21","atm":"N₂ with CH₄, CO; blue haze"},"charon":{"T":"≈ −220 °C average","P":"none (vacuum)","g":"0.289","vesc":"0.59","atm":"none"},"eris":{"T":"≈ −243 to −217 °C","P":"none at present (may form at perihelion)","g":"0.813","vesc":"1.37","atm":"none detected (N₂/CH₄ frost on surface)"},"haumea":{"T":"≈ −241 °C","P":"none (vacuum)","g":"0.42 mean (≈ 0.25–0.44 across its elongated shape)","vesc":"0.82","atm":"none"},"makemake":{"T":"≈ −243 to −238 °C","P":"none detected (< 10⁻⁸ bar)","g":"0.405","vesc":"0.76","atm":"none detected (possible trace CH₄)"},"quaoar":{"T":"≈ −230 °C","P":"none detected (< 10⁻⁸ bar)","g":"0.27","vesc":"0.54","atm":"none detected"},"gonggong":{"T":"≈ −243 to −223 °C","P":"none detected (possible tenuous CH₄)","g":"0.309","vesc":"0.62","atm":"none detected (possible trace CH₄)","approx":true},"orcus":{"T":"≈ −231 °C","P":"none (vacuum)","g":"0.205","vesc":"0.43","atm":"none"},"sedna":{"T":"≈ −264 °C (aphelion) to −240 °C (perihelion)","P":"none (vacuum)","g":"0.28","vesc":"0.53","atm":"none","approx":true},"arrokoth":{"T":"≈ −233 °C","P":"none (vacuum)","g":"0.00062 (varies over the two lobes)","vesc":"0.003 (3.3 m/s)","atm":"none","approx":true},"halley":{"T":"≈ −200 °C far from the Sun to ≈ +100 °C near perihelion (nucleus surface)","P":"none bound — a gas coma forms near the Sun","g":"0.00049","vesc":"0.002 (2.3 m/s)","atm":"none (coma of H₂O, CO, CO₂ when active)"}},"sunAtmosphere":[{"name":"Chromosphere","T_C":"≈ 3,800 °C (temperature minimum) rising to ≈ 20,000 °C","P":"≈ 10⁻³ bar at the base falling to ≈ 10⁻⁷ bar at the top","rho":"≈ 10⁻⁹–10⁻¹³ g/cm³","Tmid":8000,"Pmid_bar":1e-05},{"name":"Transition region","T_C":"≈ 20,000 °C to ≈ 1 million °C over a few hundred km","P":"≈ 10⁻⁷ bar (0.01–0.02 Pa)","rho":"≈ 10⁻¹³–10⁻¹⁵ g/cm³","Tmid":500000.0,"Pmid_bar":1.5e-07},{"name":"Corona","T_C":"≈ 1–3 million °C (flares > 10 million °C)","P":"≈ 10⁻⁷ bar at the base, falling outward to ~10⁻¹² bar and below","rho":"≈ 10⁻¹⁵–10⁻¹⁸ g/cm³","Tmid":1500000.0,"Pmid_bar":1e-09}]};

/* nearby stars (Wikipedia list of nearest stars, RECONS/Gaia), Milky Way arms (Reid et al. 2019), bar (Wegg et al. 2015), GRAVITY 2019 */
const GALAXY = {"near":[{"name":"Sun","dist_ly":0.0,"spectral":"G2V","color_hex":"#fff4e6","mag_V":-26.74,"radius_sun":1.0,"planets":8,"xyz_gal_ly":[0,0,0],"note":"Our star; 8 planets.","type":"star","comp":["Sun"]},{"name":"Alpha Centauri","dist_ly":4.3441,"spectral":"G2V","color_hex":"#fff4e6","mag_V":0.01,"radius_sun":1.22,"planets":2,"xyz_gal_ly":[3.111,-3.032,-0.052],"note":"Closest star system; Proxima (4.25 ly, 2.2 deg away on the sky) hosts Proxima b in the habitable zone and Proxima d. A JWST planet candidate around A (2025) is unconfirmed.","type":"star","comp":["Alpha Centauri A (Rigil Kentaurus)","Alpha Centauri B (Toliman)","Proxima Centauri"],"cp":[{"component":"Alpha Centauri A","spectral":"G2V","mag_V":0.01,"radius_sun":1.22,"color_hex":"#fff4e6","dist_ly":4.3441,"l_deg":null,"b_deg":null,"ra_deg":219.9021,"dec_deg":-60.8339},{"component":"Alpha Centauri B","spectral":"K1V","mag_V":1.33,"radius_sun":0.86,"color_hex":"#ffd8a6","dist_ly":4.3441,"l_deg":null,"b_deg":null,"ra_deg":219.8963,"dec_deg":-60.8372},{"component":"Proxima Centauri","spectral":"M5.5Ve","mag_V":11.09,"radius_sun":0.154,"color_hex":"#ff8636","dist_ly":4.2465,"l_deg":313.94,"b_deg":-1.927,"ra_deg":217.4292,"dec_deg":-62.6794}]},{"name":"Barnard's Star","dist_ly":5.9629,"spectral":"M4.0Ve","color_hex":"#ff9a4c","mag_V":9.53,"radius_sun":0.19,"planets":4,"xyz_gal_ly":[4.958,2.98,1.449],"note":"Fastest proper motion of any star (10.4\"/yr); four small rocky planets confirmed 2024-2025.","type":"star","comp":["Barnard's Star"]},{"name":"Luhman 16","dist_ly":6.5102,"spectral":"L8","color_hex":"#e8622c","radius_sun":0.1,"planets":0,"xyz_gal_ly":[1.698,-6.256,0.601],"note":"Nearest brown dwarfs; a binary found only in 2013. Cloud weather maps have been made of B.","type":"brown_dwarf","brown_dwarf":true,"comp":["Luhman 16 A","Luhman 16 B"],"mag_J":10.7},{"name":"WISE 0855-0714","dist_ly":7.43,"spectral":"Y4","color_hex":"#6e3a5c","radius_sun":0.09,"planets":0,"xyz_gal_ly":[-3.914,-5.587,2.945],"note":"Coldest known brown dwarf (~285 K, about freezing point of water); water-ice clouds suspected.","type":"brown_dwarf","brown_dwarf":true,"comp":["WISE 0855-0714"],"mag_J":25.0},{"name":"Wolf 359","dist_ly":7.856,"spectral":"M6.0V","color_hex":"#ff8636","mag_V":13.44,"radius_sun":0.14,"planets":0,"xyz_gal_ly":[-1.916,-3.938,6.522],"note":"Flare star; famous from Star Trek's Battle of Wolf 359.","type":"star","comp":["Wolf 359"]},{"name":"Lalande 21185","dist_ly":8.3044,"spectral":"M2.0V","color_hex":"#ffb06a","mag_V":7.47,"radius_sun":0.39,"planets":2,"xyz_gal_ly":[-3.439,-0.308,7.553],"note":"Brightest red dwarf in the northern sky, but still too faint to see with the naked eye.","type":"star","comp":["Lalande 21185"]},{"name":"Sirius","dist_ly":8.7094,"spectral":"A1V","color_hex":"#cad7ff","mag_V":-1.46,"radius_sun":1.71,"planets":0,"xyz_gal_ly":[-5.843,-6.317,-1.346],"note":"Brightest star in the night sky; companion Sirius B is a white dwarf.","type":"star","comp":["Sirius A","Sirius B"]},{"name":"Gliese 65 (Luyten 726-8)","dist_ly":8.77,"spectral":"M5.5Ve","color_hex":"#ff8636","mag_V":12.54,"radius_sun":0.15,"planets":0,"xyz_gal_ly":[-2.159,0.171,-8.498],"note":"UV Ceti is the prototype of flare stars.","type":"star","comp":["BL Ceti (A)","UV Ceti (B)"]},{"name":"Ross 154","dist_ly":9.7063,"spectral":"M3.5Ve","color_hex":"#ff9a4c","mag_V":10.43,"radius_sun":0.24,"planets":0,"xyz_gal_ly":[9.365,1.872,-1.733],"note":"Flare star in Sagittarius.","type":"star","comp":["Ross 154"]},{"name":"Ross 248","dist_ly":10.3057,"spectral":"M5.5Ve","color_hex":"#ff8636","mag_V":12.29,"radius_sun":0.16,"planets":0,"xyz_gal_ly":[-3.37,9.265,-3.003],"note":"Approaching us; will be the closest star to the Sun in ~36,000 years (~3 ly).","type":"star","comp":["Ross 248"]},{"name":"Epsilon Eridani","dist_ly":10.4749,"spectral":"K2V","color_hex":"#ffd8a6","mag_V":3.73,"radius_sun":0.74,"planets":1,"xyz_gal_ly":[-6.736,-1.912,-7.791],"note":"Young Sun-like star with a dusty debris disk and a Jupiter-mass planet.","type":"star","comp":["Epsilon Eridani"]},{"name":"Lacaille 9352 (Gliese 887)","dist_ly":10.7241,"spectral":"M0.5V","color_hex":"#ffb06a","mag_V":7.34,"radius_sun":0.47,"planets":4,"xyz_gal_ly":[4.352,0.388,-9.794],"note":"Unusually quiet red dwarf; super-Earths found 2020 (planet count per Wikipedia list; some may be candidates).","type":"star","comp":["Gliese 887"]},{"name":"Ross 128","dist_ly":11.0074,"spectral":"M4.0V","color_hex":"#ff9a4c","mag_V":11.13,"radius_sun":0.2,"planets":1,"xyz_gal_ly":[0.014,-5.577,9.49],"note":"Quiet red dwarf with a temperate Earth-mass planet, Ross 128 b.","type":"star","comp":["Ross 128"]},{"name":"EZ Aquarii","dist_ly":11.109,"spectral":"M5.0Ve","color_hex":"#ff8636","mag_V":13.33,"radius_sun":0.17,"planets":0,"xyz_gal_ly":[4.123,4.433,-9.315],"note":"Triple system of red dwarfs.","type":"star","comp":["EZ Aquarii A","EZ Aquarii B","EZ Aquarii C"]},{"name":"61 Cygni","dist_ly":11.4039,"spectral":"K5.0V","color_hex":"#ffbf80","mag_V":5.21,"radius_sun":0.67,"planets":0,"xyz_gal_ly":[1.516,11.243,-1.156],"note":"First star to have its distance measured (Bessel, 1838).","type":"star","comp":["61 Cygni A","61 Cygni B"]},{"name":"Procyon","dist_ly":11.463,"spectral":"F5IV-V","color_hex":"#fff8ef","mag_V":0.38,"radius_sun":2.05,"planets":0,"xyz_gal_ly":[-9.291,-6.197,2.582],"note":"Eighth-brightest star; companion Procyon B is a white dwarf.","type":"star","comp":["Procyon A","Procyon B"]},{"name":"Struve 2398","dist_ly":11.4908,"spectral":"M3.0V","color_hex":"#ff9a4c","mag_V":8.9,"radius_sun":0.35,"planets":0,"xyz_gal_ly":[0.13,10.478,4.716],"note":"Pair of red dwarfs in Draco (Gliese 725).","type":"star","comp":["Struve 2398 A","Struve 2398 B"]},{"name":"Groombridge 34","dist_ly":11.6191,"spectral":"M1.5V","color_hex":"#ffb06a","mag_V":8.08,"radius_sun":0.38,"planets":2,"xyz_gal_ly":[-4.948,9.849,-3.677],"note":"Red-dwarf binary in Andromeda; A hosts planets.","type":"star","comp":["Groombridge 34 A (GX And)","Groombridge 34 B (GQ And)"]},{"name":"DX Cancri","dist_ly":11.6797,"spectral":"M6.5Ve","color_hex":"#ff8636","mag_V":14.78,"radius_sun":0.11,"planets":0,"xyz_gal_ly":[-9.428,-2.885,6.262],"note":"Very-low-mass flare star.","type":"star","comp":["DX Cancri"]},{"name":"Epsilon Indi","dist_ly":11.867,"spectral":"K5Ve","color_hex":"#ffbf80","mag_V":4.69,"radius_sun":0.73,"planets":1,"xyz_gal_ly":[7.259,-3.203,-8.825],"note":"K dwarf with a pair of brown dwarfs (Ba, Bb); its giant planet Eps Ind Ab was directly imaged by JWST in 2024.","type":"star","comp":["Epsilon Indi A","Epsilon Indi Ba","Epsilon Indi Bb"]},{"name":"Tau Ceti","dist_ly":11.9118,"spectral":"G8.5V","color_hex":"#ffeacc","mag_V":3.49,"radius_sun":0.79,"planets":4,"xyz_gal_ly":[-3.371,0.408,-11.418],"note":"Nearest single Sun-like (G) star; radial-velocity planets e,f,g,h are low-amplitude and still debated.","type":"star","comp":["Tau Ceti"]},{"name":"GJ 1061","dist_ly":11.9839,"spectral":"M5.5V","color_hex":"#ff8636","mag_V":13.09,"radius_sun":0.16,"planets":3,"xyz_gal_ly":[-2.249,-6.869,-9.559],"note":"Three Earth-mass planets; c and d are in the habitable zone.","type":"star","comp":["GJ 1061"]},{"name":"YZ Ceti","dist_ly":12.1222,"spectral":"M4.5V","color_hex":"#ff9a4c","mag_V":12.02,"radius_sun":0.17,"planets":3,"xyz_gal_ly":[-2.04,1.192,-11.89],"note":"Three compact rocky planets; possible star-planet magnetic interaction detected in radio.","type":"star","comp":["YZ Ceti"]},{"name":"Luyten's Star","dist_ly":12.3485,"spectral":"M3.5V","color_hex":"#ff9a4c","mag_V":9.86,"radius_sun":0.35,"planets":2,"xyz_gal_ly":[-10.262,-6.499,2.224],"note":"Target of the 2017 'Sonar Calling GJ 273b' METI message.","type":"star","comp":["Luyten's Star (GJ 273)"]},{"name":"Teegarden's Star","dist_ly":12.497,"spectral":"M6.5V","color_hex":"#ff8636","mag_V":15.14,"radius_sun":0.11,"planets":3,"xyz_gal_ly":[-9.391,3.369,-7.525],"note":"Tiny red dwarf with Earth-mass planets b and c in the habitable zone.","type":"star","comp":["Teegarden's Star"]},{"name":"Kapteyn's Star","dist_ly":12.8308,"spectral":"M1.5VI","color_hex":"#ffb06a","mag_V":8.84,"radius_sun":0.29,"planets":0,"xyz_gal_ly":[-3.459,-9.787,-7.542],"note":"Halo subdwarf on a retrograde Galactic orbit; possibly from the disrupted Omega Centauri progenitor.","type":"star","comp":["Kapteyn's Star"]},{"name":"Lacaille 8760 (AX Microscopii)","dist_ly":12.9472,"spectral":"M0.0V","color_hex":"#ffb06a","mag_V":6.67,"radius_sun":0.51,"planets":0,"xyz_gal_ly":[9.251,0.631,-9.036],"note":"One of the brightest red dwarfs; at the edge of naked-eye visibility.","type":"star","comp":["Lacaille 8760"]},{"name":"SCR 1845-6357","dist_ly":13.0638,"spectral":"M8.5V","color_hex":"#ff8636","mag_V":17.39,"radius_sun":0.1,"planets":0,"xyz_gal_ly":[10.53,-5.713,-5.211],"note":"Ultracool red dwarf with a T6 brown-dwarf companion.","type":"star","comp":["SCR 1845-6357 A","SCR 1845-6357 B"]},{"name":"Kruger 60","dist_ly":13.0724,"spectral":"M3.0V","color_hex":"#ff9a4c","mag_V":9.79,"radius_sun":0.35,"planets":0,"xyz_gal_ly":[-3.314,12.645,-0.001],"note":"Visual binary with a 44.6-year orbit.","type":"star","comp":["Kruger 60 A","Kruger 60 B (DO Cephei)"]},{"name":"DENIS J1048-3956","dist_ly":13.1932,"spectral":"M8.5V","color_hex":"#ff8636","mag_V":17.39,"radius_sun":0.1,"planets":0,"xyz_gal_ly":[1.904,-12.468,3.872],"note":"Ultracool dwarf near the star/brown-dwarf boundary; strong radio flares.","type":"star","comp":["DENIS J1048-3956"]},{"name":"Ross 614","dist_ly":13.363,"spectral":"M4.5V","color_hex":"#ff9a4c","mag_V":11.15,"radius_sun":0.21,"planets":0,"xyz_gal_ly":[-11.151,-7.222,-1.44],"note":"Close red-dwarf binary in Monoceros.","type":"star","comp":["Ross 614 A","Ross 614 B"]},{"name":"UGPS J0722-0540","dist_ly":13.43,"spectral":"T9","color_hex":"#b54a68","radius_sun":0.09,"planets":0,"xyz_gal_ly":[-10.025,-8.881,0.999],"note":"Very cold T9 brown dwarf discovered in UKIDSS (2010).","type":"brown_dwarf","brown_dwarf":true,"comp":["UGPS J0722-0540"],"mag_J":16.52},{"name":"Wolf 1061","dist_ly":14.05,"spectral":"M3.0V","color_hex":"#ff9a4c","mag_V":10.07,"radius_sun":0.31,"planets":3,"xyz_gal_ly":[12.845,0.752,5.643],"note":"Planet c is a super-Earth near the inner edge of the habitable zone.","type":"star","comp":["Wolf 1061"]},{"name":"Van Maanen's Star","dist_ly":14.0718,"spectral":"DZ7","color_hex":"#fff1df","mag_V":12.38,"radius_sun":0.011,"planets":0,"xyz_gal_ly":[-3.995,6.424,-11.865],"note":"Nearest solitary white dwarf; metal pollution reveals it is eating planetary debris.","type":"white_dwarf","comp":["Van Maanen's Star"]},{"name":"Gliese 1","dist_ly":14.1747,"spectral":"M1.5V","color_hex":"#ffb06a","mag_V":8.55,"radius_sun":0.38,"planets":0,"xyz_gal_ly":[3.311,-0.977,-13.748],"note":"First entry in the Gliese Catalogue of Nearby Stars.","type":"star","comp":["Gliese 1"]},{"name":"TZ Arietis","dist_ly":14.578,"spectral":"M4.5V","color_hex":"#ff9a4c","mag_V":12.27,"radius_sun":0.16,"planets":1,"xyz_gal_ly":[-8.48,5.369,-10.573],"note":"Flare star with a giant planet.","type":"star","comp":["TZ Arietis"]},{"name":"Wolf 424","dist_ly":14.595,"spectral":"M5.5Ve","color_hex":"#ff8636","mag_V":13.18,"radius_sun":0.14,"planets":0,"xyz_gal_ly":[1.498,-4.41,13.832],"note":"Pair of flaring red dwarfs.","type":"star","comp":["Wolf 424 A","Wolf 424 B"]},{"name":"Gliese 687","dist_ly":14.8395,"spectral":"M3.0V","color_hex":"#ff9a4c","mag_V":9.17,"radius_sun":0.42,"planets":2,"xyz_gal_ly":[-1.883,12.448,7.856],"note":"Red dwarf in Draco with Neptune-mass planets.","type":"star","comp":["Gliese 687"]},{"name":"Gliese 674","dist_ly":14.8492,"spectral":"M3.0V","color_hex":"#ff9a4c","mag_V":9.38,"radius_sun":0.36,"planets":1,"xyz_gal_ly":[14.101,-4.31,-1.753],"note":"Hosts a Neptune-mass planet on a 4.7-day orbit.","type":"star","comp":["Gliese 674"]},{"name":"LHS 292","dist_ly":14.8706,"spectral":"M6.5V","color_hex":"#ff8636","mag_V":15.6,"radius_sun":0.11,"planets":0,"xyz_gal_ly":[-1.749,-11.036,9.812],"note":"Faint flare star in Sextans.","type":"star","comp":["LHS 292"]},{"name":"Gliese 440","dist_ly":15.1226,"spectral":"DQ6","color_hex":"#fff1df","mag_V":11.5,"radius_sun":0.012,"planets":0,"xyz_gal_ly":[6.625,-13.573,-0.753],"note":"White dwarf with carbon features in its spectrum.","type":"white_dwarf","comp":["Gliese 440"]},{"name":"GJ 1245","dist_ly":15.2001,"spectral":"M5.5V","color_hex":"#ff8636","mag_V":13.46,"radius_sun":0.14,"planets":0,"xyz_gal_ly":[2.905,14.749,2.25],"note":"Triple red-dwarf system in the Kepler field.","type":"star","comp":["GJ 1245 A","GJ 1245 B","GJ 1245 C"]},{"name":"WISE 1741+2553","dist_ly":15.22,"spectral":"T9","color_hex":"#b54a68","radius_sun":0.09,"planets":0,"xyz_gal_ly":[8.766,10.486,6.696],"note":"Cold T9 brown dwarf found by WISE.","type":"brown_dwarf","brown_dwarf":true,"comp":["WISE 1741+2553"],"mag_J":16.53},{"name":"Gliese 876","dist_ly":15.2382,"spectral":"M3.5V","color_hex":"#ff9a4c","mag_V":10.17,"radius_sun":0.38,"planets":4,"xyz_gal_ly":[4.743,6.071,-13.147],"note":"First red dwarf found to host a planet (1998); four planets in resonant orbits.","type":"star","comp":["Gliese 876"]},{"name":"WISE 1639-6847","dist_ly":15.336,"spectral":"Y0.5","color_hex":"#6e3a5c","radius_sun":0.09,"planets":0,"xyz_gal_ly":[11.573,-9.304,-3.835],"note":"Y-type brown dwarf, only a few hundred kelvin.","type":"brown_dwarf","brown_dwarf":true,"comp":["WISE 1639-6847"],"mag_J":20.57},{"name":"LHS 288","dist_ly":15.7586,"spectral":"M5.5V","color_hex":"#ff8636","mag_V":13.9,"radius_sun":0.15,"planets":0,"xyz_gal_ly":[4.928,-14.958,-0.555],"note":"Faint red dwarf in Carina.","type":"star","comp":["LHS 288"]},{"name":"GJ 1002","dist_ly":15.806,"spectral":"M5.5V","color_hex":"#ff8636","mag_V":13.76,"radius_sun":0.14,"planets":2,"xyz_gal_ly":[-0.258,5.985,-14.627],"note":"Two Earth-mass planets in the habitable zone (2022).","type":"star","comp":["GJ 1002"]},{"name":"DENIS 0255-4700","dist_ly":15.877,"spectral":"L7.5V","color_hex":"#e8622c","mag_V":22.92,"radius_sun":0.09,"planets":0,"xyz_gal_ly":[-1.35,-8.144,-13.562],"note":"Nearest isolated L-type brown dwarf.","type":"brown_dwarf","brown_dwarf":true,"comp":["DENIS 0255-4700"],"mag_J":13.25},{"name":"Groombridge 1618","dist_ly":15.8857,"spectral":"K7.0V","color_hex":"#ffbf80","mag_V":6.59,"radius_sun":0.61,"planets":0,"xyz_gal_ly":[-9.453,2.38,12.543],"note":"Orange-red dwarf in Ursa Major.","type":"star","comp":["Groombridge 1618 (Gliese 380)"]},{"name":"Gliese 412","dist_ly":15.9969,"spectral":"M1.0V","color_hex":"#ffb06a","mag_V":8.77,"radius_sun":0.4,"planets":0,"xyz_gal_ly":[-7.099,1.444,14.262],"note":"WX UMa is a vigorous flare star.","type":"star","comp":["Gliese 412 A","Gliese 412 B (WX UMa)"]},{"name":"AD Leonis","dist_ly":16.1939,"spectral":"M3.0V","color_hex":"#ff9a4c","mag_V":9.32,"radius_sun":0.43,"planets":0,"xyz_gal_ly":[-7.549,-5.577,13.197],"note":"One of the most active flare stars known; a claimed planet was refuted.","type":"star","comp":["AD Leonis"]},{"name":"Gliese 832","dist_ly":16.2005,"spectral":"M1.5V","color_hex":"#ffb06a","mag_V":8.66,"radius_sun":0.48,"planets":1,"xyz_gal_ly":[10.983,-2.101,-11.722],"note":"Hosts a Jupiter-like planet on a ~10-year orbit.","type":"star","comp":["Gliese 832"]},{"name":"Gliese 682","dist_ly":16.3328,"spectral":"M4V","color_hex":"#ff9a4c","mag_V":10.95,"radius_sun":0.3,"planets":0,"xyz_gal_ly":[15.741,-3.929,-1.887],"note":"Red dwarf in Scorpius near the Galactic centre direction.","type":"star","comp":["Gliese 682"]},{"name":"Omicron2 Eridani (40 Eridani)","dist_ly":16.333,"spectral":"K0.5V","color_hex":"#ffd8a6","mag_V":4.43,"radius_sun":0.81,"planets":0,"xyz_gal_ly":[-12.028,-4.558,-10.066],"note":"Triple with a white dwarf (B) and red dwarf (C); Star Trek's Vulcan orbits A.","type":"star","comp":["40 Eridani A (Keid)","40 Eridani B","40 Eridani C"]},{"name":"EV Lacertae","dist_ly":16.4761,"spectral":"M3.5V","color_hex":"#ff9a4c","mag_V":10.22,"radius_sun":0.36,"planets":0,"xyz_gal_ly":[-2.954,15.775,-3.726],"note":"Young flare star; produced a superflare seen by Swift in 2008.","type":"star","comp":["EV Lacertae"]},{"name":"70 Ophiuchi","dist_ly":16.7074,"spectral":"K0V","color_hex":"#ffd8a6","mag_V":4.21,"radius_sun":0.91,"planets":0,"xyz_gal_ly":[14.201,8.163,3.293],"note":"Bright orange-dwarf binary with an 88-year orbit.","type":"star","comp":["70 Ophiuchi A","70 Ophiuchi B"]},{"name":"Altair","dist_ly":16.73,"spectral":"A7V","color_hex":"#e4e9ff","mag_V":0.77,"radius_sun":1.8,"planets":0,"xyz_gal_ly":[11.114,12.233,-2.591],"note":"Rotates so fast (~9 h) that it is visibly oblate; vertex of the Summer Triangle.","type":"star","comp":["Altair"]},{"name":"EI Cancri","dist_ly":16.8,"spectral":"M5.5V","color_hex":"#ff8636","mag_V":14.06,"radius_sun":0.15,"planets":0,"xyz_gal_ly":[-11.979,-6.249,9.985],"note":"Red-dwarf binary in Cancer.","type":"star","comp":["EI Cancri A (GJ 1116 A)","EI Cancri B"]},{"name":"WISE J1506+7027","dist_ly":16.856,"spectral":"T6","color_hex":"#b54a68","radius_sun":0.09,"planets":0,"xyz_gal_ly":[-3.888,11.782,11.411],"note":"T6 brown dwarf in Ursa Minor.","type":"brown_dwarf","brown_dwarf":true,"comp":["WISE J1506+7027"],"mag_J":13.74},{"name":"GJ 3379","dist_ly":16.9861,"spectral":"M3.5V","color_hex":"#ff9a4c","mag_V":11.31,"radius_sun":0.26,"planets":0,"xyz_gal_ly":[-15.208,-6.95,-2.991],"note":"Red dwarf in Orion.","type":"star","comp":["GJ 3379"]},{"name":"DENIS J0817-6155","dist_ly":17.002,"spectral":"T6","color_hex":"#b54a68","radius_sun":0.09,"planets":0,"xyz_gal_ly":[1.737,-16.376,-4.228],"note":"T6 brown dwarf in Carina.","type":"brown_dwarf","brown_dwarf":true,"comp":["DENIS J0817-6155"],"mag_J":13.61},{"name":"Gliese 445","dist_ly":17.1368,"spectral":"M3.5V","color_hex":"#ff9a4c","mag_V":10.79,"radius_sun":0.25,"planets":0,"xyz_gal_ly":[-8.104,10.814,10.538],"note":"Voyager 1 will pass within ~1.6 ly of it in ~40,000 years.","type":"star","comp":["Gliese 445"]},{"name":"2MASS J1540-5101","dist_ly":17.3738,"spectral":"M7V","color_hex":"#ff8636","mag_V":15.26,"radius_sun":0.11,"planets":0,"xyz_gal_ly":[14.713,-9.182,1.032],"note":"Ultracool dwarf identified in 2014.","type":"star","comp":["2MASS J15404342-5101357"]},{"name":"2MASS 0939-2448","dist_ly":17.41,"spectral":"T8","color_hex":"#b54a68","radius_sun":0.09,"planets":0,"xyz_gal_ly":[-3.694,-15.887,6.087],"note":"Binary of two cold T8 brown dwarfs.","type":"brown_dwarf","brown_dwarf":true,"comp":["2MASS 0939-2448 A","2MASS 0939-2448 B"],"mag_J":15.61},{"name":"GJ 3323","dist_ly":17.5309,"spectral":"M4V","color_hex":"#ff9a4c","mag_V":12.22,"radius_sun":0.12,"planets":2,"xyz_gal_ly":[-13.928,-6.923,-8.087],"note":"Two planets, one in the habitable zone.","type":"star","comp":["GJ 3323"]},{"name":"Gliese 526","dist_ly":17.7263,"spectral":"M1V","color_hex":"#ffb06a","mag_V":8.46,"radius_sun":0.47,"planets":0,"xyz_gal_ly":[5.298,-0.785,16.898],"note":"Red dwarf in Bootes.","type":"star","comp":["Gliese 526"]},{"name":"WISE 0350-5658","dist_ly":17.84,"spectral":"Y1","color_hex":"#6e3a5c","radius_sun":0.09,"planets":0,"xyz_gal_ly":[-0.212,-12.24,-12.977],"note":"Y1 brown dwarf, one of the coldest known.","type":"brown_dwarf","brown_dwarf":true,"comp":["WISE 0350-5658"],"mag_J":22.47},{"name":"Stein 2051","dist_ly":17.9925,"spectral":"M4V","color_hex":"#ff9a4c","mag_V":11.04,"radius_sun":0.26,"planets":0,"xyz_gal_ly":[-15.151,9.43,2.29],"note":"B is a white dwarf whose mass was measured by gravitational microlensing (2017).","type":"star","comp":["Stein 2051 A (Gliese 169.1 A)","Stein 2051 B"]},{"name":"2MASS J1114-2618","dist_ly":18.2,"spectral":"T7.5","color_hex":"#b54a68","radius_sun":0.09,"planets":0,"xyz_gal_ly":[1.992,-15.351,9.572],"note":"Cold T7.5 brown dwarf in Hydra.","type":"brown_dwarf","brown_dwarf":true,"comp":["2MASS J11145133-2618235"],"mag_J":15.86},{"name":"Gliese 251","dist_ly":18.2146,"spectral":"M3V","color_hex":"#ff9a4c","mag_V":10.02,"radius_sun":0.36,"planets":1,"xyz_gal_ly":[-17.56,-0.901,4.756],"note":"Super-Earth on a 14-day orbit.","type":"star","comp":["Gliese 251"]},{"name":"LP 816-60","dist_ly":18.3305,"spectral":"M3.5V","color_hex":"#ff9a4c","mag_V":11.5,"radius_sun":0.22,"planets":0,"xyz_gal_ly":[13.106,7.616,-10.307],"note":"Red dwarf in Capricornus.","type":"star","comp":["LP 816-60"]},{"name":"LSR J1835+3259","dist_ly":18.5534,"spectral":"M8.5V","color_hex":"#ff8636","mag_V":18.27,"radius_sun":0.1,"planets":0,"xyz_gal_ly":[8.406,15.577,5.562],"note":"Ultracool dwarf with aurorae detected in radio (2015).","type":"star","comp":["LSR J1835+3259"]},{"name":"Gliese 205","dist_ly":18.6042,"spectral":"M1V","color_hex":"#ffb06a","mag_V":7.95,"radius_sun":0.55,"planets":0,"xyz_gal_ly":[-15.64,-7.946,-6.194],"note":"Bright red dwarf in Orion.","type":"star","comp":["Gliese 205"]},{"name":"2MASS J0415-0935","dist_ly":18.62,"spectral":"T8","color_hex":"#b54a68","radius_sun":0.09,"planets":0,"xyz_gal_ly":[-13.337,-5.645,-11.703],"note":"T8 brown dwarf in Eridanus.","type":"brown_dwarf","brown_dwarf":true,"comp":["2MASS J04151954-0935066"],"mag_J":15.34},{"name":"Gliese 229","dist_ly":18.7906,"spectral":"M1.5V","color_hex":"#ffb06a","mag_V":8.14,"radius_sun":0.58,"planets":0,"xyz_gal_ly":[-11.786,-13.374,-5.943],"note":"Gliese 229 B (1995) was the first confirmed T dwarf; in 2024 it was resolved into a tight brown-dwarf binary. Planet claims around A exist (GJ 229 A c); Wikipedia list shows none confirmed.","type":"star","comp":["Gliese 229 A","Gliese 229 Ba","Gliese 229 Bb"]},{"name":"Sigma Draconis (Alsafi)","dist_ly":18.7993,"spectral":"K0V","color_hex":"#ffd8a6","mag_V":4.67,"radius_sun":0.78,"planets":0,"xyz_gal_ly":[-3.419,17.107,7.005],"note":"Naked-eye orange dwarf near the north ecliptic pole.","type":"star","comp":["Sigma Draconis"]},{"name":"Ross 47","dist_ly":18.8883,"spectral":"M4V","color_hex":"#ff9a4c","mag_V":11.57,"radius_sun":0.22,"planets":0,"xyz_gal_ly":[-18.114,-4.418,-3.024],"note":"Red dwarf in Orion.","type":"star","comp":["Ross 47 (Gliese 213)"]},{"name":"WISE 1541-2250","dist_ly":18.93,"spectral":"Y0.5","color_hex":"#6e3a5c","radius_sun":0.09,"planets":0,"xyz_gal_ly":[16.651,-3.983,8.077],"note":"Y-type brown dwarf in Libra.","type":"brown_dwarf","brown_dwarf":true,"comp":["WISE 1541-2250"],"mag_J":20.99},{"name":"Gliese 570","dist_ly":19.1987,"spectral":"K4V","color_hex":"#ffd8a6","mag_V":5.64,"radius_sun":0.74,"planets":0,"xyz_gal_ly":[15.009,-5.99,10.365],"note":"Quadruple: orange dwarf, two red dwarfs, and a distant T7.5 brown dwarf.","type":"star","comp":["Gliese 570 A","Gliese 570 B","Gliese 570 C","Gliese 570 D"]},{"name":"Gliese 693","dist_ly":19.2078,"spectral":"M3V","color_hex":"#ff9a4c","mag_V":10.76,"radius_sun":0.26,"planets":0,"xyz_gal_ly":[16.899,-7.772,-4.793],"note":"Red dwarf in Pavo.","type":"star","comp":["Gliese 693"]},{"name":"Gliese 754","dist_ly":19.2724,"spectral":"M4V","color_hex":"#ff9a4c","mag_V":12.23,"radius_sun":0.2,"planets":0,"xyz_gal_ly":[17.463,-2.342,-7.809],"note":"Red dwarf in Telescopium.","type":"star","comp":["Gliese 754"]},{"name":"Gliese 908","dist_ly":19.2745,"spectral":"M1V","color_hex":"#ffb06a","mag_V":8.98,"radius_sun":0.41,"planets":0,"xyz_gal_ly":[-0.654,10.511,-16.143],"note":"Metal-poor red dwarf in Pisces.","type":"star","comp":["Gliese 908"]},{"name":"Gliese 752 (Wolf 1055)","dist_ly":19.2922,"spectral":"M2.5V","color_hex":"#ff9a4c","mag_V":9.1,"radius_sun":0.48,"planets":1,"xyz_gal_ly":[14.657,12.495,-1.105],"note":"VB 10 was long the lowest-mass star known.","type":"star","comp":["Gliese 752 A","VB 10 (Gliese 752 B)"]},{"name":"Gliese 588","dist_ly":19.2996,"spectral":"M2.5V","color_hex":"#ff9a4c","mag_V":9.31,"radius_sun":0.42,"planets":0,"xyz_gal_ly":[16.763,-8.661,4.055],"note":"Red dwarf in Lupus.","type":"star","comp":["Gliese 588"]},{"name":"Eta Cassiopeiae (Achird)","dist_ly":19.3314,"spectral":"G0V","color_hex":"#fff4e6","mag_V":3.46,"radius_sun":1.04,"planets":0,"xyz_gal_ly":[-10.38,16.219,-1.703],"note":"Sun-like G dwarf with an orange-dwarf companion; naked-eye in Cassiopeia.","type":"star","comp":["Eta Cassiopeiae A","Eta Cassiopeiae B"]},{"name":"36 Ophiuchi","dist_ly":19.4185,"spectral":"K1.5V","color_hex":"#ffd8a6","mag_V":5.07,"radius_sun":0.69,"planets":0,"xyz_gal_ly":[19.27,-0.579,2.325],"note":"Triple of orange dwarfs.","type":"star","comp":["36 Ophiuchi A (Guniibuu)","36 Ophiuchi B","36 Ophiuchi C"]},{"name":"YZ Canis Minoris","dist_ly":19.533,"spectral":"M4V","color_hex":"#ff9a4c","mag_V":11.19,"radius_sun":0.3,"planets":0,"xyz_gal_ly":[-15.397,-11.127,4.546],"note":"Flare star in Canis Minor.","type":"star","comp":["YZ Canis Minoris"]},{"name":"GJ 1005","dist_ly":19.577,"spectral":"M3.5V","color_hex":"#ff9a4c","mag_V":11.6,"radius_sun":0.2,"planets":0,"xyz_gal_ly":[0.495,4.643,-19.012],"note":"Red-dwarf binary in Cetus.","type":"star","comp":["GJ 1005 A","GJ 1005 B"]},{"name":"HR 7703","dist_ly":19.609,"spectral":"K2.5V","color_hex":"#ffd8a6","mag_V":5.31,"radius_sun":0.75,"planets":0,"xyz_gal_ly":[16.751,1.534,-10.077],"note":"Orange dwarf with a red-dwarf companion, in Sagittarius.","type":"star","comp":["HR 7703 A","HR 7703 B"]},{"name":"82 G. Eridani","dist_ly":19.7045,"spectral":"G8V","color_hex":"#ffeacc","mag_V":4.26,"radius_sun":0.92,"planets":3,"xyz_gal_ly":[-3.626,-10.382,-16.351],"note":"Old Sun-like star with three super-Earths.","type":"star","comp":["82 G. Eridani"]},{"name":"Gliese 268","dist_ly":19.7414,"spectral":"M4.5V","color_hex":"#ff9a4c","mag_V":12.05,"radius_sun":0.2,"planets":0,"xyz_gal_ly":[-18.559,0.339,6.721],"note":"Close red-dwarf binary in Auriga.","type":"star","comp":["Gliese 268 A","Gliese 268 B"]},{"name":"Delta Pavonis","dist_ly":19.893,"spectral":"G8IV","color_hex":"#ffeacc","mag_V":3.55,"radius_sun":1.2,"planets":0,"xyz_gal_ly":[14.509,-8.455,-10.664],"note":"Sun-like star beginning to evolve into a subgiant; a top SETI target.","type":"star","comp":["Delta Pavonis"]},{"name":"SIMP J0136+0933","dist_ly":19.955,"spectral":"T2.5","color_hex":"#b54a68","radius_sun":0.11,"planets":0,"xyz_gal_ly":[-9.644,7.749,-15.657],"note":"Planetary-mass object (~13 Jupiter masses) with strong aurorae.","type":"brown_dwarf","brown_dwarf":true,"comp":["SIMP J0136+0933"],"mag_J":13.25},{"name":"2MASS 0937+2931","dist_ly":19.5,"spectral":"T7","color_hex":"#b54a68","radius_sun":0.09,"planets":0,"xyz_gal_ly":[-12.521,-4.032,14.395],"note":"Metal-poor T dwarf in Leo.","type":"brown_dwarf","brown_dwarf":true,"comp":["2MASS 0937+2931"],"mag_J":14.65}],"land":[{"name":"Vega","dist_ly":25.04,"spectral":"A0V","color_hex":"#cad7ff","mag_V":0.03,"radius_sun":2.4,"planets":0,"xyz_gal_ly":[9.07,21.83,8.25],"note":"Former and future pole star (~12,000 yr); the zero-point of the magnitude scale; dusty debris disk.","comp":["Vega"]},{"name":"Arcturus","dist_ly":36.7,"spectral":"K1.5III","color_hex":"#ffd8a6","mag_V":-0.05,"radius_sun":25.4,"planets":0,"xyz_gal_ly":[12.64,3.4,34.29],"note":"Brightest star in the northern celestial hemisphere; an old thick-disk/halo-like red giant.","comp":["Arcturus"]},{"name":"Capella","dist_ly":42.9,"spectral":"G3III","color_hex":"#fff4e6","mag_V":0.08,"radius_sun":12.0,"planets":0,"xyz_gal_ly":[-40.8,12.8,3.42],"note":"Actually two yellow giants (Aa, Ab) in a 104-day orbit.","comp":["Capella"]},{"name":"Pollux","dist_ly":33.8,"spectral":"K0III","color_hex":"#ffd8a6","mag_V":1.14,"radius_sun":9.1,"planets":1,"xyz_gal_ly":[-30.31,-6.57,13.43],"note":"Nearest giant star with a confirmed planet (Pollux b / Thestias).","comp":["Pollux"]},{"name":"Fomalhaut","dist_ly":25.1,"spectral":"A3V","color_hex":"#cad7ff","mag_V":1.16,"radius_sun":1.84,"planets":0,"xyz_gal_ly":[9.97,3.73,-22.73],"note":"Spectacular debris ring imaged by Hubble/JWST; 'Fomalhaut b' turned out to be a dust cloud.","comp":["Fomalhaut"]},{"name":"Castor","dist_ly":51.0,"spectral":"A1V","color_hex":"#cad7ff","mag_V":1.58,"radius_sun":2.4,"planets":0,"xyz_gal_ly":[-46.73,-6.1,19.5],"note":"A sextuple system: three spectroscopic binaries.","comp":["Castor"]},{"name":"Aldebaran","dist_ly":65.3,"spectral":"K5III","color_hex":"#ffbf80","mag_V":0.86,"radius_sun":44.0,"planets":0,"xyz_gal_ly":[-61.26,-1.04,-22.6],"note":"Orange giant 'eye of the Bull', in the foreground of the Hyades cluster.","comp":["Aldebaran"]},{"name":"Regulus","dist_ly":79.3,"spectral":"B8IVn","color_hex":"#bccdff","mag_V":1.4,"radius_sun":4.35,"planets":0,"xyz_gal_ly":[-35.91,-37.74,59.79],"note":"Spins near break-up speed; strongly flattened.","comp":["Regulus"]},{"name":"Mizar","dist_ly":82.9,"spectral":"A2V","color_hex":"#cad7ff","mag_V":2.23,"radius_sun":2.4,"planets":0,"xyz_gal_ly":[-15.49,36.29,72.91],"note":"First telescopic double and first spectroscopic binary; pairs with Alcor.","comp":["Mizar"]},{"name":"Achernar","dist_ly":139.0,"spectral":"B6Vep","color_hex":"#bccdff","mag_V":0.46,"radius_sun":7.3,"planets":0,"xyz_gal_ly":[25.62,-67.31,-118.89],"note":"Most oblate star known; equatorial radius ~1.5x polar.","comp":["Achernar"]},{"name":"Spica","dist_ly":250.0,"spectral":"B1V","color_hex":"#a7bcff","mag_V":0.97,"radius_sun":7.5,"planets":0,"xyz_gal_ly":[113.77,-109.43,193.86],"note":"Close massive binary whose stars are tidally distorted.","comp":["Spica"]},{"name":"Bellatrix","dist_ly":250.0,"spectral":"B2III","color_hex":"#a7bcff","mag_V":1.64,"radius_sun":5.75,"planets":0,"xyz_gal_ly":[-229.96,-69.99,-68.71],"note":"Orion's left shoulder; hot blue giant.","comp":["Bellatrix"]},{"name":"Mimosa (Beta Crucis)","dist_ly":280.0,"spectral":"B0.5III","color_hex":"#a7bcff","mag_V":1.25,"radius_sun":8.4,"planets":0,"xyz_gal_ly":[150.06,-235.89,15.53],"note":"Second-brightest star of the Southern Cross.","comp":["Mimosa (Beta Crucis)"]},{"name":"Mira","dist_ly":300.0,"spectral":"M7IIIe","color_hex":"#ff8636","mag_V":3.0,"radius_sun":350.0,"planets":0,"xyz_gal_ly":[-155.43,33.73,-254.37],"note":"Prototype long-period variable (V 2 to 10); trails a 13-light-year comet-like tail.","comp":["Mira"]},{"name":"Thuban","dist_ly":303.0,"spectral":"A0III","color_hex":"#cad7ff","mag_V":3.65,"radius_sun":3.4,"planets":0,"xyz_gal_ly":[-66.91,178.74,235.34],"note":"Pole star when the pyramids of Giza were built.","comp":["Thuban"]},{"name":"Canopus","dist_ly":310.0,"spectral":"A9II","color_hex":"#e4e9ff","mag_V":-0.74,"radius_sun":71.0,"planets":0,"xyz_gal_ly":[-42.82,-276.99,-132.44],"note":"Second-brightest star in the night sky; used by spacecraft for attitude control.","comp":["Canopus"]},{"name":"Acrux","dist_ly":320.0,"spectral":"B0.5IV","color_hex":"#a7bcff","mag_V":0.76,"radius_sun":7.8,"planets":0,"xyz_gal_ly":[160.61,-276.77,-2.03],"note":"Brightest star of the Southern Cross; a multiple system.","comp":["Acrux"]},{"name":"Hadar (Beta Centauri)","dist_ly":390.0,"spectral":"B1III","color_hex":"#a7bcff","mag_V":0.61,"radius_sun":8.6,"planets":0,"xyz_gal_ly":[259.72,-290.82,8.51],"note":"Pointer star with Alpha Centauri toward the Southern Cross.","comp":["Hadar (Beta Centauri)"]},{"name":"Polaris","dist_ly":433.0,"spectral":"F7Ib","color_hex":"#fff8ef","mag_V":1.98,"radius_sun":37.5,"planets":0,"xyz_gal_ly":[-212.71,324.06,192.94],"note":"Current North Star; a Cepheid variable. Distance uncertain (~410-450 ly).","comp":["Polaris"]},{"name":"Alcyone","dist_ly":440.0,"spectral":"B7IIIe","color_hex":"#bccdff","mag_V":2.87,"radius_sun":9.3,"planets":0,"xyz_gal_ly":[-392.77,93.08,-175.13],"note":"Brightest star of the Pleiades cluster.","comp":["Alcyone"]},{"name":"Betelgeuse","dist_ly":548.0,"spectral":"M1-2Ia-ab","color_hex":"#ffb06a","mag_V":0.5,"radius_sun":760.0,"planets":0,"xyz_gal_ly":[-509.35,-183.25,-85.34],"note":"Red supergiant; Great Dimming of 2019-20. Distance ~168 pc (Joyce et al. 2020); older estimates ~640-700 ly. A small companion (Siwarha) was reported in 2025.","comp":["Betelgeuse"]},{"name":"Antares","dist_ly":550.0,"spectral":"M1.5Iab","color_hex":"#ffb06a","mag_V":1.06,"radius_sun":680.0,"planets":0,"xyz_gal_ly":[525.86,-74.4,142.94],"note":"Red supergiant 'rival of Mars', heart of Scorpius.","comp":["Antares"]},{"name":"Rigel","dist_ly":860.0,"spectral":"B8Ia","color_hex":"#bccdff","mag_V":0.13,"radius_sun":79.0,"planets":0,"xyz_gal_ly":[-678.74,-379.97,-366.78],"note":"Blue supergiant, Orion's foot; ~120,000 L_sun.","comp":["Rigel"]},{"name":"Alnitak","dist_ly":1260.0,"spectral":"O9.5Iab","color_hex":"#9bb0ff","mag_V":1.77,"radius_sun":20.0,"planets":0,"xyz_gal_ly":[-1081.16,-537.91,-359.65],"note":"Easternmost Orion's Belt star, beside the Flame and Horsehead nebulae. Distance uncertain.","comp":["Alnitak"]},{"name":"Alnilam","dist_ly":1340.0,"spectral":"B0Ia","color_hex":"#a7bcff","mag_V":1.69,"radius_sun":42.0,"planets":0,"xyz_gal_ly":[-1157.87,-545.15,-397.19],"note":"Middle star of Orion's Belt. Distance very uncertain (~1,300-2,000 ly).","comp":["Alnilam"]},{"name":"Deneb","dist_ly":2600.0,"spectral":"A2Ia","color_hex":"#cad7ff","mag_V":1.25,"radius_sun":203.0,"planets":0,"xyz_gal_ly":[258.75,2585.5,90.65],"note":"One of the most luminous naked-eye stars; distance uncertain (~1,500-2,600 ly).","comp":["Deneb"]},{"name":"Eta Carinae","dist_ly":7500.0,"spectral":"LBV","color_hex":"#b8c8ff","mag_V":4.3,"radius_sun":240.0,"planets":0,"xyz_gal_ly":[2267.26,-7148.62,-82.47],"note":"Hypergiant binary (~100+ M_sun) inside the Carina Nebula; Great Eruption of the 1840s. Radius ill-defined.","comp":["Eta Carinae"]}],"arms":[{"name":"3-kpc arm (near)","pts":[[-2.528,-2.122],[-2.684,-1.95],[-2.828,-1.767],[-2.959,-1.574],[-3.078,-1.37],[-3.182,-1.158],[-3.272,-0.938],[-3.346,-0.711],[-3.405,-0.479],[-3.448,-0.241],[-3.474,0.0],[-3.484,0.244],[-3.476,0.488],[-3.451,0.734],[-3.409,0.977],[-3.349,1.219],[-3.273,1.457],[-3.18,1.691],[-3.07,1.918],[-2.943,2.138],[-2.801,2.351],[-2.644,2.553],[-2.472,2.746],[-2.286,2.926],[-2.087,3.095],[-1.876,3.249]],"w":0.18,"note":"Only 3 masers; probably a bar-driven feature rather than a true spiral arm.","Rref":3.52,"phiref":165.0,"pin":-4.2,"pout":-4.2,"p0":120.0,"p1":220.0},{"name":"3-kpc arm (far)","pts":[[2.528,2.122],[2.684,1.95],[2.828,1.767],[2.959,1.574],[3.078,1.37],[3.182,1.158],[3.272,0.938],[3.346,0.711],[3.405,0.479],[3.448,0.241],[3.474,-0.0],[3.484,-0.244],[3.476,-0.488],[3.451,-0.734],[3.409,-0.977],[3.349,-1.219],[3.273,-1.457],[3.18,-1.691],[3.07,-1.918],[2.943,-2.138],[2.801,-2.351],[2.644,-2.553],[2.472,-2.746],[2.286,-2.926],[2.087,-3.095],[1.876,-3.249]],"w":0.18,"note":"MODEL-BASED: not in Reid et al. 2019 Table 2. Mirror of the near 3-kpc arm through the Galactic Centre (Dame & Thaddeus 2008 found the far arm in CO, symmetric with the near arm; tangent near l=+23 deg). Use for visual completeness only.","Rref":3.52,"phiref":-15.0,"pin":-4.2,"pout":-4.2,"p0":-60.0,"p1":40.0},{"name":"Norma","pts":[[-2.191,-3.795],[-2.453,-3.637],[-2.704,-3.461],[-2.943,-3.268],[-3.168,-3.059],[-3.377,-2.834],[-3.571,-2.595],[-3.748,-2.342],[-3.907,-2.077],[-4.047,-1.802],[-4.168,-1.517],[-4.269,-1.224],[-4.349,-0.924],[-4.409,-0.62],[-4.447,-0.311],[-4.463,0.0],[-4.457,0.312],[-4.43,0.623],[-4.381,0.931],[-4.311,1.236],[-4.165,1.516],[-3.95,1.759],[-3.725,1.98],[-3.49,2.181],[-3.248,2.36],[-3.0,2.518],[-2.749,2.654],[-2.494,2.77],[-2.239,2.866],[-1.984,2.941],[-1.731,2.998]],"w":0.14,"note":"Inner portion nearly circular (psi ~ -1 deg). Thought to continue as the Outer arm on the far side (Norma-Outer).","Rref":4.46,"phiref":162.0,"pin":19.5,"pout":-1.0,"p0":120.0,"p1":240.0},{"name":"Scutum-Centaurus","pts":[[1.471,-8.342],[0.87,-8.278],[0.285,-8.174],[-0.28,-8.032],[-0.825,-7.854],[-1.347,-7.642],[-1.845,-7.398],[-2.315,-7.126],[-2.758,-6.826],[-3.171,-6.502],[-3.554,-6.156],[-3.906,-5.791],[-4.225,-5.408],[-4.513,-5.012],[-4.767,-4.603],[-4.988,-4.186],[-5.176,-3.761],[-5.332,-3.332],[-5.455,-2.9],[-5.546,-2.469],[-5.605,-2.04],[-5.634,-1.616],[-5.634,-1.197],[-5.604,-0.788],[-5.547,-0.388],[-5.464,0.0],[-5.356,0.375],[-5.225,0.734],[-5.071,1.078],[-4.897,1.404],[-4.704,1.712],[-4.496,2.002],[-4.281,2.276],[-4.051,2.531],[-3.807,2.766],[-3.551,2.98],[-3.285,3.172],[-3.01,3.343],[-2.729,3.493],[-2.442,3.62],[-2.151,3.725],[-1.858,3.809],[-1.564,3.871],[-1.271,3.911],[-0.98,3.931],[-0.693,3.931],[-0.411,3.91],[-0.135,3.871],[0.133,3.814],[0.393,3.739],[0.643,3.647],[0.883,3.54]],"w":0.23,"note":"Major arm (with Perseus) of the Milky Way's likely two-armed old-star pattern. Centaurus segment (beta<0, 4th quadrant) is model extrapolation; the Outer Scutum-Centaurus (OSC) arm on the far side is not included.","Rref":4.91,"phiref":157.0,"pin":12.1,"pout":14.1,"p0":76.0,"p1":280.0},{"name":"Sagittarius-Carina","pts":[[2.054,-11.647],[1.21,-11.512],[0.395,-11.322],[-0.387,-11.081],[-1.134,-10.793],[-1.844,-10.461],[-2.515,-10.088],[-3.144,-9.677],[-3.731,-9.234],[-4.273,-8.761],[-4.77,-8.262],[-5.222,-7.741],[-5.627,-7.202],[-5.985,-6.648],[-6.298,-6.082],[-6.564,-5.508],[-6.785,-4.93],[-6.961,-4.35],[-7.094,-3.772],[-7.184,-3.198],[-7.232,-2.632],[-7.241,-2.076],[-7.212,-1.533],[-7.146,-1.004],[-7.046,-0.493],[-6.913,0.0],[-6.749,0.472],[-6.558,0.922],[-6.34,1.348],[-6.098,1.749],[-5.835,2.124],[-5.552,2.472],[-5.359,2.85],[-5.141,3.213],[-4.899,3.559],[-4.633,3.887],[-4.345,4.196],[-4.037,4.483],[-3.71,4.748],[-3.365,4.989],[-3.005,5.205],[-2.632,5.396],[-2.246,5.56],[-1.851,5.696],[-1.447,5.804],[-1.037,5.883],[-0.624,5.934],[-0.208,5.956],[0.208,5.949],[0.621,5.913]],"w":0.27,"note":"Carina segment (beta<0, 4th quadrant) is model extrapolation; tangency at l=285.6 matches classic Carina tangent.","Rref":6.04,"phiref":156.0,"pin":1.0,"pout":17.1,"p0":83.0,"p1":280.0},{"name":"Local (Orion Spur)","pts":[[-8.649,-3.148],[-8.723,-2.501],[-8.753,-1.86],[-8.737,-1.228],[-8.679,-0.607],[-8.578,0.0],[-8.438,0.59],[-8.259,1.161],[-8.044,1.71],[-7.794,2.235],[-7.513,2.734],[-7.202,3.206],[-6.863,3.649],[-6.5,4.062],[-6.114,4.442],[-5.708,4.79],[-5.285,5.104]],"w":0.31,"note":"Short arm/spur the Sun lies just inside of; recent Gaia work suggests it may be longer than the masers trace.","Rref":8.26,"phiref":171.0,"pin":11.4,"pout":11.4,"p0":135.0,"p1":200.0},{"name":"Perseus","pts":[[-8.811,-7.393],[-9.188,-6.676],[-9.51,-5.943],[-9.777,-5.198],[-9.988,-4.447],[-10.144,-3.692],[-10.246,-2.938],[-10.295,-2.188],[-10.291,-1.446],[-10.236,-0.716],[-10.132,0.0],[-9.98,0.698],[-9.782,1.375],[-9.54,2.028],[-9.257,2.654],[-8.935,3.252],[-8.577,3.819],[-8.185,4.352],[-7.763,4.851],[-7.312,5.313],[-6.837,5.737],[-6.351,6.134],[-5.845,6.492],[-5.321,6.811],[-4.782,7.089],[-4.23,7.327],[-3.669,7.523],[-3.102,7.678],[-2.532,7.792],[-1.961,7.866],[-1.393,7.898],[-0.829,7.891],[-0.274,7.846],[0.271,7.762],[0.803,7.643],[1.32,7.488],[1.82,7.299],[2.3,7.078],[2.758,6.827],[3.194,6.548],[3.604,6.242],[3.988,5.912],[4.344,5.56],[4.671,5.187],[4.968,4.797],[5.234,4.392],[5.469,3.973],[5.672,3.544],[5.843,3.107],[5.981,2.663],[6.087,2.215],[6.16,1.766],[6.202,1.318],[6.212,0.873],[6.191,0.433],[6.14,0.0],[6.06,-0.424],[5.952,-0.837],[5.817,-1.236],[5.656,-1.622],[5.47,-1.991]],"w":0.35,"note":"Beyond beta~115 deg the arm is not traced by masers; extension toward far end of the bar (~(X,Y)=(-3.5,-0.5) kpc in Reid's frame) is speculative.","Rref":8.87,"phiref":140.0,"pin":8.7,"pout":10.3,"p0":-20.0,"p1":220.0},{"name":"Outer (Norma-Outer)","pts":[[-6.613,-11.454],[-7.369,-10.925],[-8.083,-10.346],[-8.753,-9.721],[-9.376,-9.054],[-9.948,-8.347],[-10.468,-7.605],[-10.933,-6.831],[-11.341,-6.03],[-11.691,-5.205],[-11.982,-4.361],[-12.212,-3.502],[-12.381,-2.632],[-12.489,-1.755],[-12.535,-0.877],[-12.52,0.0],[-12.443,0.87],[-12.307,1.73],[-12.112,2.575],[-11.86,3.401],[-11.506,4.188],[-11.057,4.923],[-10.564,5.617],[-10.03,6.267],[-9.458,6.872],[-8.853,7.428],[-8.218,7.936],[-7.556,8.392],[-6.873,8.796],[-6.17,9.148],[-5.454,9.446],[-4.727,9.691],[-3.993,9.882],[-3.256,10.02],[-2.52,10.106],[-1.788,10.139],[-1.064,10.121],[-0.351,10.054],[0.347,9.938],[1.028,9.776],[1.687,9.57],[2.324,9.32],[2.934,9.03]],"w":0.65,"note":"Outer arm; often considered continuation of Norma arm.","Rref":12.24,"phiref":162.0,"pin":9.4,"pout":3.0,"p0":70.0,"p1":240.0}],"bar":{"half_length_kpc":5.0,"half_length_unc":0.2,"angle_to_sun_gc_line_deg":28,"angle_range_deg":[25,33],"near_end_side":"positive longitudes (first quadrant, y > 0)","near_end_xy_kpc":[-4.415,2.347],"far_end_xy_kpc":[4.415,-2.347],"box_peanut_bulge":{"half_length_kpc":2.2,"angle_deg":27,"detail":"Inner 3D boxy/peanut (X-shaped) bulge, axis ratios ~1:0.4:0.3; angle 27 +/- 2 deg."},"pattern_speed_km_s_kpc":39,"pattern_speed_range":[33,41],"detail":"Long bar: two-component (thin + super-thin) model, 5.0 +/- 0.2 kpc half-length at 28-33 deg (Wegg+2015). Some recent work favours ~4 kpc, 25 deg (Zhang+2024). The bar rotates clockwise like the disk.","sources":["Wegg, Gerhard & Portail 2015, MNRAS 450, 4050 (arXiv:1504.01401)","Bland-Hawthorn & Gerhard 2016","Portail et al. 2017; Sanders et al. 2019 (pattern speed)"]},"objs":[{"name":"Sgr A* / Galactic Centre","kind":"supermassive black hole","xyz":[0.0,0.0,0.0],"note":"Defines the origin; GRAVITY 2019/2021 distance 8.178-8.275 kpc. Placed at the origin exactly in this frame.","dist_kpc":8.2},{"name":"Orion Nebula (M42)","kind":"H II region / star-forming","xyz":[-8.522,-0.178,-0.109],"note":"Nearest massive star-forming region; Trapezium cluster. Lies on the Radcliffe Wave.","dist_kpc":0.39},{"name":"Carina Nebula (NGC 3372)","kind":"H II region","xyz":[-7.489,-2.24,-0.006],"note":"Hosts Eta Carinae and Trumpler 14/16; in the Sagittarius-Carina arm.","dist_kpc":2.35},{"name":"Eagle Nebula (M16)","kind":"H II region","xyz":[-6.536,0.507,0.045],"note":"'Pillars of Creation'; in the Sagittarius arm.","dist_kpc":1.74},{"name":"Crab Nebula (M1)","kind":"supernova remnant","xyz":[-10.184,-0.158,-0.181],"note":"Remnant of SN 1054 with a 30-Hz pulsar; in/near the Perseus arm direction.","dist_kpc":2.0},{"name":"Pleiades (M45)","kind":"open cluster","xyz":[-8.321,0.029,-0.033],"note":"Seven Sisters; ~100 Myr old.","dist_kpc":0.136},{"name":"Omega Centauri (NGC 5139)","kind":"globular cluster","xyz":[-4.892,-4.071,1.423],"note":"Most massive MW globular (~3.5e6 M_sun); likely the stripped core of a dwarf galaxy; intermediate-mass black hole evidence (2024).","dist_kpc":5.43},{"name":"47 Tucanae (NGC 104)","kind":"globular cluster","xyz":[-6.323,-2.594,-3.169],"note":"Second-brightest globular; seen next to the SMC on the sky but far in front of it.","dist_kpc":4.52},{"name":"Large Magellanic Cloud","kind":"satellite galaxy","xyz":[-0.633,-40.948,-26.908],"note":"Largest MW satellite (~1-2e11 M_sun incl. dark matter); on first infall.","dist_kpc":49.59},{"name":"Small Magellanic Cloud","kind":"satellite galaxy","xyz":[16.008,-37.563,-43.588],"note":"Elongated along our line of sight; interacting with the LMC (Magellanic Bridge/Stream).","dist_kpc":62.44},{"name":"Sagittarius Dwarf Spheroidal","kind":"satellite galaxy (disrupting)","xyz":[17.372,2.494,-6.466],"note":"Being torn apart; its stellar stream wraps around the Galaxy. Core lies behind the bulge on the far side of the GC, below the plane. M54 marks its nucleus.","dist_kpc":26.5},{"name":"Andromeda Galaxy (M31)","kind":"Local Group spiral","xyz":[-376.419,608.722,-281.222],"note":"Nearest large spiral; approaching at ~110 km/s; for a future Local Group view.","dist_kpc":765.0},{"name":"Cygnus X / North America Nebula region","kind":"star-forming complex","xyz":[-7.957,1.379,0.04],"note":"Massive star-forming complex in the Local arm (optional extra label).","dist_kpc":1.4},{"name":"Local Bubble","kind":"superbubble (hot, low-density cavity)","xyz":null,"note":"Carved by ~15 supernovae over the last ~14 Myr; its expanding shell triggered all nearby young star-forming regions.","dist_kpc":null},{"name":"Radcliffe Wave","kind":"wave-shaped chain of molecular clouds","xyz":null,"note":"Discovered in 3D dust maps (2020); it also oscillates/'waves' in time. Contains most nearby star-forming regions (Orion, Perseus, Taurus, Cepheus, CMa).","dist_kpc":null},{"name":"Gould Belt (historical)","kind":"ring of bright OB stars & clouds","xyz":null,"note":"Classic ~20-deg tilted ring of bright stars (Herschel/Gould, 19th c.). 3D dust maps show it is largely a projection of two linear structures (Radcliffe Wave and the 'split'). Show as a historical overlay. Geometry approximate (Perrot & Grenier 2003).","dist_kpc":null}],"params":{"R0_sun_gc_kpc":8.2,"z_sun_pc":20.8,"disk_radius_kpc":15,"thin_disk":null,"thick_disk":null,"bar":null,"sgr_a_star_mass_msun":4300000.0,"stellar_mass_msun":50000000000.0,"number_of_stars":200000000000.0,"rotation_speed_at_sun_km_s":233,"sun_orbital_period_myr":210,"sun_vertical_oscillation":null},"conv":{"system":"ICRS/J2000 equatorial -> IAU 1958 Galactic (Hipparcos realisation)","ngp_ra_deg":192.85948,"ngp_dec_deg":27.12825,"l_ncp_deg":122.93192,"gc_direction_ra_dec_deg":[266.405,-28.93617],"rotation_matrix_icrs_to_galactic":[[-0.0548755604162154,-0.873437090234885,-0.4838350155487132],[0.4941094278755837,-0.4448296299600112,0.746982244497219],[-0.8676661490190047,-0.1980763734312015,0.4559837761750669]],"usage":"unit vector u_eq = [cos d cos a, cos d sin a, sin d]; u_gal = M @ u_eq; l = atan2(u_gal[1], u_gal[0]); b = asin(u_gal[2]). Equivalent spherical formulas: sin b = sin d sin d_NGP + cos d cos d_NGP cos(a - a_NGP); l = l_NCP - atan2(cos d sin(a - a_NGP), sin d cos d_NGP - cos d sin d_NGP cos(a - a_NGP)).","B1950_FK4_definition":{"ngp_ra_deg":192.25,"ngp_dec_deg":27.4,"l_ncp_deg":123.0,"note":"Original IAU 1958 definition in B1950; do not mix with J2000 coordinates."},"heliocentric_galactic_cartesian":"x = d cos b cos l (toward GC), y = d cos b sin l (toward rotation), z = d sin b (toward NGP). Provided as xyz_gal_ly for each star.","source":"ESA 1997, The Hipparcos and Tycho Catalogues, Vol. 1, Sec. 1.5.3; Liu, Zhu & Zhang 2011 A&A 526, A16"}};

/* Local Group: McConnachie 2012 and later surveys; groups, clusters, superclusters, walls and voids: Wikipedia, Tully et al. 2014, Pomarède et al. 2020 and others (approximate where marked) */
const COSMOS = {"localGroup":[{"name":"Milky Way","type":"spiral","ra_deg":266.4168,"dec_deg":-29.0078,"dist_kly":26.7,"diam_kly":87.4,"parent":"none","note":"Home galaxy (barred spiral SBbc); coordinates/distance are to Sgr A* (Galactic Centre)","approx":true},{"name":"Canis Major Dwarf","type":"disputed overdensity","ra_deg":108.1458,"dec_deg":-27.6667,"dist_kly":22.8,"diam_kly":10.0,"parent":"Milky Way","note":"Disputed: may be a warp/flare of the Milky Way disc rather than a galaxy; linked to Monoceros Ring","approx":true,"disputed":true},{"name":"Sagittarius Dwarf Spheroidal","type":"dwarf spheroidal","ra_deg":283.8313,"dec_deg":-30.5453,"dist_kly":84.8,"diam_kly":33.75,"parent":"Milky Way","note":"Being tidally disrupted; Sagittarius Stream wraps the Galaxy","approx":true},{"name":"Segue 1","type":"dwarf spheroidal","ra_deg":151.7667,"dec_deg":16.0819,"dist_kly":75.0,"diam_kly":0.38,"parent":"Milky Way","note":"Ultra-faint; one of the most dark-matter dominated galaxies known","approx":true},{"name":"Ursa Major II","type":"dwarf spheroidal","ra_deg":132.875,"dec_deg":63.13,"dist_kly":104.4,"diam_kly":1.94,"parent":"Milky Way","note":"Ultra-faint","approx":true},{"name":"Bootes II","type":"dwarf spheroidal","ra_deg":209.5,"dec_deg":12.85,"dist_kly":137.0,"diam_kly":0.67,"parent":"Milky Way","note":"Ultra-faint","approx":true},{"name":"Segue 2","type":"dwarf spheroidal","ra_deg":34.8167,"dec_deg":20.1753,"dist_kly":114.2,"diam_kly":0.44,"parent":"Milky Way","note":"Ultra-faint","approx":true},{"name":"Willman 1","type":"dwarf spheroidal","ra_deg":162.3375,"dec_deg":51.05,"dist_kly":123.9,"diam_kly":0.33,"parent":"Milky Way","note":"Ultra-faint; galaxy vs cluster status debated","approx":true},{"name":"Coma Berenices Dwarf","type":"dwarf spheroidal","ra_deg":186.7458,"dec_deg":23.9042,"dist_kly":143.5,"diam_kly":1.0,"parent":"Milky Way","note":"Ultra-faint","approx":true},{"name":"Bootes III","type":"dwarf spheroidal","ra_deg":209.3,"dec_deg":26.8,"dist_kly":153.3,"diam_kly":13.05,"parent":"Milky Way","note":"Likely disrupting; size very uncertain","approx":true},{"name":"Large Magellanic Cloud","type":"irregular","ra_deg":80.8938,"dec_deg":-69.7561,"dist_kly":166.3,"diam_kly":32.2,"parent":"Milky Way","note":"Largest MW satellite; Magellanic-type barred irregular"},{"name":"Small Magellanic Cloud","type":"dwarf irregular","ra_deg":13.1867,"dec_deg":-72.8286,"dist_kly":208.7,"diam_kly":18.9,"parent":"Milky Way","note":"Interacting with LMC (Magellanic Bridge/Stream)"},{"name":"Bootes I","type":"dwarf spheroidal","ra_deg":210.025,"dec_deg":14.5,"dist_kly":215.3,"diam_kly":3.16,"parent":"Milky Way","approx":true},{"name":"Draco Dwarf","type":"dwarf spheroidal","ra_deg":260.0517,"dec_deg":57.9153,"dist_kly":247.9,"diam_kly":2.88,"parent":"Milky Way","approx":true},{"name":"Ursa Minor Dwarf","type":"dwarf spheroidal","ra_deg":227.2854,"dec_deg":67.2225,"dist_kly":247.9,"diam_kly":2.36,"parent":"Milky Way","approx":true},{"name":"Sculptor Dwarf","type":"dwarf spheroidal","ra_deg":15.0392,"dec_deg":-33.7092,"dist_kly":280.5,"diam_kly":3.69,"parent":"Milky Way","note":"Not to be confused with the Sculptor Group","approx":true},{"name":"Sextans Dwarf","type":"dwarf spheroidal","ra_deg":153.2625,"dec_deg":-1.6147,"dist_kly":280.5,"diam_kly":9.07,"parent":"Milky Way","approx":true},{"name":"Ursa Major I","type":"dwarf spheroidal","ra_deg":158.72,"dec_deg":51.92,"dist_kly":316.4,"diam_kly":4.16,"parent":"Milky Way","note":"Ultra-faint","approx":true},{"name":"Carina Dwarf","type":"dwarf spheroidal","ra_deg":100.4029,"dec_deg":-50.9661,"dist_kly":342.5,"diam_kly":3.26,"parent":"Milky Way","approx":true},{"name":"Hercules Dwarf","type":"dwarf spheroidal","ra_deg":247.7583,"dec_deg":12.7917,"dist_kly":430.5,"diam_kly":4.31,"parent":"Milky Way","note":"Elongated, likely tidally stretched","approx":true},{"name":"Fornax Dwarf","type":"dwarf spheroidal","ra_deg":39.9971,"dec_deg":-34.4492,"dist_kly":479.4,"diam_kly":9.26,"parent":"Milky Way","note":"Has six globular clusters","approx":true},{"name":"Leo IV","type":"dwarf spheroidal","ra_deg":173.2375,"dec_deg":-0.5333,"dist_kly":502.3,"diam_kly":2.69,"parent":"Milky Way","note":"Ultra-faint","approx":true},{"name":"Canes Venatici II","type":"dwarf spheroidal","ra_deg":194.2917,"dec_deg":34.3208,"dist_kly":521.8,"diam_kly":0.97,"parent":"Milky Way","note":"Ultra-faint","approx":true},{"name":"Leo V","type":"dwarf spheroidal","ra_deg":172.79,"dec_deg":2.22,"dist_kly":580.6,"diam_kly":1.76,"parent":"Milky Way","note":"Ultra-faint","approx":true},{"name":"Pisces II","type":"dwarf spheroidal","ra_deg":344.6292,"dec_deg":5.9525,"dist_kly":593.6,"diam_kly":0.78,"parent":"Milky Way","note":"Distance uncertain","approx":true},{"name":"Canes Venatici I","type":"dwarf spheroidal","ra_deg":202.0146,"dec_deg":33.5558,"dist_kly":711.0,"diam_kly":7.36,"parent":"Milky Way","approx":true},{"name":"Leo II","type":"dwarf spheroidal","ra_deg":168.37,"dec_deg":22.1517,"dist_kly":759.9,"diam_kly":2.3,"parent":"Milky Way","approx":true},{"name":"Leo I","type":"dwarf spheroidal","ra_deg":152.1171,"dec_deg":12.3064,"dist_kly":828.4,"diam_kly":3.27,"parent":"Milky Way","note":"Possibly unbound / recent infall; McConnachie group code G/L (ambiguous membership)","approx":true},{"name":"Andromeda Galaxy (M31)","type":"spiral","ra_deg":10.6846,"dec_deg":41.2692,"dist_kly":2553.8,"diam_kly":152.0,"parent":"none","note":"Largest Local Group member; D from (m-M)0=24.47"},{"name":"M32","type":"compact elliptical","ra_deg":10.6742,"dec_deg":40.8653,"dist_kly":2625.6,"diam_kly":6.5,"parent":"Andromeda","note":"Close M31 companion"},{"name":"Andromeda IX","type":"dwarf spheroidal","ra_deg":13.2208,"dec_deg":43.1958,"dist_kly":2498.4,"diam_kly":7.27,"parent":"Andromeda","approx":true},{"name":"M110 (NGC 205)","type":"dwarf elliptical","ra_deg":10.0921,"dec_deg":41.6853,"dist_kly":2687.5,"diam_kly":17.0,"parent":"Andromeda","note":"Close M31 companion","approx":true},{"name":"Andromeda XVII","type":"dwarf spheroidal","ra_deg":9.2792,"dec_deg":44.3222,"dist_kly":2589.7,"diam_kly":3.42,"parent":"Andromeda","approx":true},{"name":"Andromeda I","type":"dwarf spheroidal","ra_deg":11.4158,"dec_deg":38.0411,"dist_kly":2429.9,"diam_kly":8.77,"parent":"Andromeda","approx":true},{"name":"Andromeda XXVII","type":"dwarf spheroidal","ra_deg":9.3629,"dec_deg":45.3869,"dist_kly":2700.6,"diam_kly":5.66,"parent":"Andromeda","note":"Possibly disrupting","approx":true},{"name":"Andromeda III","type":"dwarf spheroidal","ra_deg":8.8908,"dec_deg":36.4978,"dist_kly":2439.6,"diam_kly":6.25,"parent":"Andromeda","approx":true},{"name":"Andromeda XXV","type":"dwarf spheroidal","ra_deg":7.5371,"dec_deg":46.8519,"dist_kly":2651.6,"diam_kly":8.38,"parent":"Andromeda","approx":true},{"name":"Andromeda XXVI","type":"dwarf spheroidal","ra_deg":5.94,"dec_deg":47.9161,"dist_kly":2485.3,"diam_kly":2.86,"parent":"Andromeda","approx":true},{"name":"Andromeda XI","type":"dwarf spheroidal","ra_deg":11.5833,"dec_deg":33.8014,"dist_kly":2475.5,"diam_kly":1.89,"parent":"Andromeda","approx":true},{"name":"Andromeda V","type":"dwarf spheroidal","ra_deg":17.5713,"dec_deg":47.6281,"dist_kly":2521.2,"diam_kly":4.11,"parent":"Andromeda","approx":true},{"name":"Andromeda X","type":"dwarf spheroidal","ra_deg":16.6404,"dec_deg":44.8044,"dist_kly":2286.4,"diam_kly":3.3,"parent":"Andromeda","approx":true},{"name":"Andromeda XXIII","type":"dwarf spheroidal","ra_deg":22.3408,"dec_deg":38.7189,"dist_kly":2508.1,"diam_kly":13.42,"parent":"Andromeda","approx":true},{"name":"Andromeda XX","type":"dwarf spheroidal","ra_deg":1.8779,"dec_deg":35.1322,"dist_kly":2615.8,"diam_kly":1.62,"parent":"Andromeda","approx":true},{"name":"Andromeda XII","type":"dwarf spheroidal","ra_deg":11.8625,"dec_deg":34.3747,"dist_kly":2840.8,"diam_kly":3.97,"parent":"Andromeda","note":"Possibly first infall; McConnachie group code A/L (ambiguous membership)","approx":true},{"name":"NGC 147","type":"dwarf elliptical","ra_deg":8.3004,"dec_deg":48.5089,"dist_kly":2204.8,"diam_kly":10.0,"parent":"Andromeda","note":"Pair with NGC 185","approx":true},{"name":"Andromeda XXI","type":"dwarf spheroidal","ra_deg":358.6987,"dec_deg":42.4708,"dist_kly":2801.7,"diam_kly":11.42,"parent":"Andromeda","approx":true},{"name":"Andromeda XIV","type":"dwarf spheroidal","ra_deg":12.8958,"dec_deg":29.6969,"dist_kly":2397.2,"diam_kly":4.74,"parent":"Andromeda","note":"High velocity; possibly unbound; McConnachie group code A/L (ambiguous membership)","approx":true},{"name":"Andromeda XV","type":"dwarf spheroidal","ra_deg":18.5779,"dec_deg":38.1175,"dist_kly":2058.0,"diam_kly":2.9,"parent":"Andromeda","approx":true},{"name":"Andromeda XIII","type":"dwarf spheroidal","ra_deg":12.9625,"dec_deg":33.0044,"dist_kly":2974.5,"diam_kly":2.7,"parent":"Andromeda","approx":true},{"name":"Andromeda II","type":"dwarf spheroidal","ra_deg":19.1242,"dec_deg":33.4192,"dist_kly":2126.5,"diam_kly":15.34,"parent":"Andromeda","approx":true},{"name":"NGC 185","type":"dwarf elliptical","ra_deg":9.7417,"dec_deg":48.3375,"dist_kly":2012.4,"diam_kly":8.0,"parent":"Andromeda","approx":true},{"name":"Andromeda XXIX","type":"dwarf spheroidal","ra_deg":359.7317,"dec_deg":30.7556,"dist_kly":2384.2,"diam_kly":4.7,"parent":"Andromeda","approx":true},{"name":"Andromeda XIX","type":"dwarf spheroidal","ra_deg":4.8838,"dec_deg":35.0436,"dist_kly":3043.0,"diam_kly":21.96,"parent":"Andromeda","note":"Very extended, low surface brightness","approx":true},{"name":"Triangulum Galaxy (M33)","type":"spiral","ra_deg":23.4621,"dec_deg":30.6603,"dist_kly":2638.6,"diam_kly":61.1,"parent":"Andromeda","note":"Third-largest LG member; satellite status of M31 uncertain"},{"name":"Andromeda XXIV","type":"dwarf spheroidal","ra_deg":19.625,"dec_deg":46.3661,"dist_kly":1956.9,"diam_kly":4.79,"parent":"Andromeda","approx":true},{"name":"Cassiopeia Dwarf (Andromeda VII)","type":"dwarf spheroidal","ra_deg":351.6321,"dec_deg":50.6758,"dist_kly":2485.3,"diam_kly":10.12,"parent":"Andromeda","approx":true},{"name":"Andromeda XXII","type":"dwarf spheroidal","ra_deg":21.9167,"dec_deg":28.0903,"dist_kly":2589.7,"diam_kly":2.83,"parent":"Triangulum","note":"Probable M33 satellite; distance uncertain","approx":true},{"name":"IC 10","type":"dwarf irregular","ra_deg":5.0721,"dec_deg":59.3039,"dist_kly":2589.7,"diam_kly":5.0,"parent":"Andromeda","note":"Starburst dwarf behind MW disc","approx":true},{"name":"LGS 3 (Pisces Dwarf)","type":"transition dwarf (dIrr/dSph)","ra_deg":15.9792,"dec_deg":21.885,"dist_kly":2508.1,"diam_kly":6.13,"parent":"Andromeda","note":"Possibly M33-associated","approx":true},{"name":"Pegasus Dwarf Spheroidal (Andromeda VI)","type":"dwarf spheroidal","ra_deg":357.9429,"dec_deg":24.5825,"dist_kly":2553.8,"diam_kly":6.84,"parent":"Andromeda","approx":true},{"name":"Andromeda XVI","type":"dwarf spheroidal","ra_deg":14.8742,"dec_deg":32.3767,"dist_kly":1712.3,"diam_kly":1.77,"parent":"Andromeda","note":"McConnachie group code A/L (ambiguous membership)","approx":true},{"name":"Andromeda XXVIII","type":"dwarf spheroidal","ra_deg":338.1717,"dec_deg":31.2161,"dist_kly":2155.9,"diam_kly":2.78,"parent":"Andromeda","note":"Far from M31; membership uncertain; McConnachie group code A/L (ambiguous membership)","approx":true},{"name":"IC 1613","type":"dwarf irregular","ra_deg":16.1992,"dec_deg":2.1178,"dist_kly":2462.5,"diam_kly":19.52,"parent":"none","approx":true},{"name":"Phoenix Dwarf","type":"transition dwarf (dIrr/dSph)","ra_deg":27.7763,"dec_deg":-44.4447,"dist_kly":1353.5,"diam_kly":5.92,"parent":"none","note":"McConnachie group code L/G (ambiguous membership)","approx":true},{"name":"NGC 6822 (Barnard's Galaxy)","type":"dwarf irregular","ra_deg":296.2358,"dec_deg":-14.7892,"dist_kly":1497.1,"diam_kly":7.0,"parent":"none","note":"McConnachie group code L/G (ambiguous membership)","approx":true},{"name":"Cetus Dwarf","type":"dwarf spheroidal","ra_deg":6.5458,"dec_deg":-11.0444,"dist_kly":2462.5,"diam_kly":9.17,"parent":"none","note":"Isolated dSph","approx":true},{"name":"Pegasus Dwarf Irregular (DDO 216)","type":"transition dwarf (dIrr/dSph)","ra_deg":352.1513,"dec_deg":14.7431,"dist_kly":3000.6,"diam_kly":7.33,"parent":"none","note":"Possibly bound to M31; McConnachie group code L/A (ambiguous membership)","approx":true},{"name":"Leo T","type":"transition dwarf (dIrr/dSph)","ra_deg":143.7225,"dec_deg":17.0514,"dist_kly":1360.1,"diam_kly":1.57,"parent":"none","note":"Faintest galaxy with gas and recent star formation; McConnachie group code L/G (ambiguous membership)","approx":true},{"name":"Wolf-Lundmark-Melotte (WLM)","type":"dwarf irregular","ra_deg":0.4925,"dec_deg":-15.4608,"dist_kly":3043.0,"diam_kly":8.0,"parent":"none","note":"Isolated LG outskirts","approx":true},{"name":"Leo A","type":"dwarf irregular","ra_deg":149.8604,"dec_deg":30.7464,"dist_kly":2602.7,"diam_kly":6.51,"parent":"none","note":"Isolated","approx":true},{"name":"Andromeda XVIII","type":"dwarf spheroidal","ra_deg":0.5604,"dec_deg":45.0889,"dist_kly":4419.4,"diam_kly":4.24,"parent":"none","note":"Well behind M31","approx":true},{"name":"Aquarius Dwarf (DDO 210)","type":"transition dwarf (dIrr/dSph)","ra_deg":311.7158,"dec_deg":-12.8481,"dist_kly":3496.4,"diam_kly":5.98,"parent":"none","note":"Isolated","approx":true},{"name":"Tucana Dwarf","type":"dwarf spheroidal","ra_deg":340.4567,"dec_deg":-64.4194,"dist_kly":2893.0,"diam_kly":3.71,"parent":"none","note":"Isolated dSph","approx":true},{"name":"Sagittarius Dwarf Irregular (SagDIG)","type":"dwarf irregular","ra_deg":292.4958,"dec_deg":-17.6781,"dist_kly":3480.1,"diam_kly":3.68,"parent":"none","note":"Not to be confused with Sgr dSph","approx":true},{"name":"UGC 4879 (VV 124)","type":"transition dwarf (dIrr/dSph)","ra_deg":139.0092,"dec_deg":52.84,"dist_kly":4439.0,"diam_kly":2.11,"parent":"none","note":"LG outskirts","approx":true},{"name":"NGC 3109","type":"dwarf irregular","ra_deg":150.7788,"dec_deg":-26.1597,"dist_kly":4240.0,"diam_kly":25.0,"parent":"none","note":"Antlia-Sextans group; just beyond LG"},{"name":"Sextans B","type":"dwarf irregular","ra_deg":150.0004,"dec_deg":5.3322,"dist_kly":4651.0,"diam_kly":5.74,"parent":"none","note":"Antlia-Sextans group","approx":true},{"name":"Antlia Dwarf","type":"dwarf irregular","ra_deg":151.0171,"dec_deg":-27.3311,"dist_kly":4399.8,"diam_kly":6.14,"parent":"none","note":"Antlia-Sextans group; companion of NGC 3109","approx":true},{"name":"Sextans A","type":"dwarf irregular","ra_deg":152.7533,"dec_deg":-4.6928,"dist_kly":4670.6,"diam_kly":13.42,"parent":"none","note":"Antlia-Sextans group","approx":true},{"name":"Crater II","type":"dwarf spheroidal","ra_deg":177.31,"dec_deg":-18.413,"dist_kly":383.2,"diam_kly":13.9,"parent":"Milky Way","note":"Extremely diffuse 'feeble giant'; r_h ~1.07 kpc"},{"name":"Antlia 2","type":"dwarf spheroidal","ra_deg":143.8079,"dec_deg":-36.6991,"dist_kly":429.9,"diam_kly":33.2,"parent":"Milky Way","note":"Lowest surface brightness galaxy known; r_h ~2.5 kpc, about LMC-sized but ~1/4000 as bright"},{"name":"Tucana II","type":"dwarf spheroidal","ra_deg":342.98,"dec_deg":-58.57,"dist_kly":189.2,"diam_kly":2.15,"parent":"Milky Way","note":"Ultra-faint (DES 2015)","approx":true},{"name":"Reticulum II","type":"dwarf spheroidal","ra_deg":53.92,"dec_deg":-54.05,"dist_kly":97.8,"diam_kly":0.42,"parent":"Milky Way","note":"Ultra-faint; r-process enriched (DES 2015)","approx":true},{"name":"Eridanus II","type":"dwarf spheroidal","ra_deg":56.09,"dec_deg":-43.53,"dist_kly":1193.7,"diam_kly":3.61,"parent":"Milky Way","note":"Probable MW satellite near LG edge; hosts a lone star cluster","approx":true},{"name":"Andromeda VIII","type":"dwarf spheroidal (disputed)","ra_deg":10.525,"dec_deg":40.6167,"dist_kly":2700,"diam_kly":1.0,"parent":"Andromeda","note":"Existence disputed; possibly a tidal feature of M31; diameter unknown, placeholder 1 kly","approx":true},{"name":"Andromeda XXX (Cassiopeia II)","type":"dwarf spheroidal","ra_deg":9.1454,"dec_deg":49.6467,"dist_kly":2221.1,"diam_kly":3.52,"parent":"Andromeda","note":"Near NGC 147/185 pair","approx":true},{"name":"Andromeda XXXI (Lacerta I)","type":"dwarf spheroidal","ra_deg":344.5679,"dec_deg":41.2911,"dist_kly":2465.7,"diam_kly":11.9,"parent":"Andromeda","note":"Discovered 2013 (Pan-STARRS)","approx":true},{"name":"Andromeda XXXII (Cassiopeia III)","type":"dwarf spheroidal","ra_deg":8.9975,"dec_deg":51.5597,"dist_kly":2740,"diam_kly":19.0,"parent":"Andromeda","note":"Discovered 2013 (Pan-STARRS)","approx":true},{"name":"Andromeda XXXIII (Perseus I)","type":"dwarf spheroidal","ra_deg":45.3483,"dec_deg":40.9883,"dist_kly":2410,"diam_kly":4.4,"parent":"Andromeda","note":"~1.1 Mly from M31; membership loose","approx":true},{"name":"Pegasus V (Andromeda XXXIV)","type":"dwarf spheroidal","ra_deg":349.6158,"dec_deg":33.3589,"dist_kly":2224.4,"diam_kly":1.0,"parent":"Andromeda","note":"Discovered 2022; very faint, ancient stars; diameter unknown, placeholder 1 kly","approx":true},{"name":"Andromeda XXXV","type":"dwarf spheroidal","ra_deg":6.6608,"dec_deg":40.1081,"dist_kly":3020,"diam_kly":1.0,"parent":"Andromeda","note":"Discovered 2025; faintest known M31 satellite; diameter unknown, placeholder 1 kly","approx":true}],"clusters":[{"name":"Local Group (barycentre)","kind":"group","ra_deg":10.68,"dec_deg":41.27,"dist_mly":1.46,"size_mly":10,"members":134,"note":"Barycentre ~447 kpc from MW toward M31; mass ~2-2.5e12 Msun; Wikipedia gives 5.1 Mpc major axis","approx":true},{"name":"IC 342/Maffei Group","kind":"group","ra_deg":56.7,"dec_deg":68.1,"dist_mly":10.7,"size_mly":6,"members":20,"note":"Hidden behind the Milky Way disc; Maffei 1 (RA 39.15, Dec +59.65) at ~9.8 Mly","approx":true},{"name":"Sculptor Group","kind":"group","ra_deg":11.888,"dec_deg":-25.288,"dist_mly":11.4,"size_mly":20,"members":13,"note":"Coordinates of NGC 253; group is elongated along line of sight (NGC 55/300 at ~6.5 Mly)","approx":true},{"name":"M81 Group","kind":"group","ra_deg":148.888,"dec_deg":69.065,"dist_mly":11.7,"size_mly":3,"members":34,"note":"M81, M82 (starburst), NGC 3077 tidally interacting","approx":true},{"name":"Centaurus A/M83 Group","kind":"group","ra_deg":201.365,"dec_deg":-43.019,"dist_mly":12.0,"size_mly":10,"members":60,"note":"Coordinates of Cen A (NGC 5128); M83 subgroup at RA 204.25 Dec -29.87, ~15 Mly","approx":true},{"name":"Canes Venatici I Group (M94 Group)","kind":"group","ra_deg":192.721,"dec_deg":41.12,"dist_mly":13,"size_mly":10,"members":30,"note":"Loose, extended group; coordinates of M94","approx":true},{"name":"M101 Group","kind":"group","ra_deg":210.802,"dec_deg":54.349,"dist_mly":21,"size_mly":3,"members":9,"note":"Pinwheel Galaxy and companions","approx":true},{"name":"Leo Triplet (M66 Group)","kind":"group","ra_deg":170.063,"dec_deg":12.992,"dist_mly":35,"size_mly":0.5,"members":3,"note":"M65, M66, NGC 3628","approx":true},{"name":"Virgo Cluster","kind":"cluster","ra_deg":186.75,"dec_deg":12.717,"dist_mly":53.8,"size_mly":14.3,"members":1500,"note":"Nearest large cluster; M87 at core; mass ~1.2e15 Msun; size from 2.2 Mpc radius"},{"name":"Ursa Major Cluster","kind":"cluster","ra_deg":179.0,"dec_deg":49.0,"dist_mly":61,"size_mly":10,"members":80,"note":"Spiral-rich, loose; Tully 1996 definition","approx":true},{"name":"Fornax Cluster","kind":"cluster","ra_deg":54.621,"dec_deg":-35.45,"dist_mly":62,"size_mly":7,"members":340,"note":"Compact; centred on NGC 1399; part of Southern Supercluster","approx":true},{"name":"Eridanus Cluster (Eridanus Group)","kind":"group","ra_deg":54.0,"dec_deg":-21.0,"dist_mly":75,"size_mly":10,"members":200,"note":"Loose aggregate linking toward Fornax","approx":true},{"name":"Hydra Cluster (Abell 1060)","kind":"cluster","ra_deg":159.178,"dec_deg":-27.528,"dist_mly":158,"size_mly":10,"members":157,"note":"z~0.0126; part of Hydra-Centaurus Supercluster","approx":true},{"name":"Centaurus Cluster (Abell 3526)","kind":"cluster","ra_deg":192.205,"dec_deg":-41.311,"dist_mly":170,"size_mly":12,"members":300,"note":"z~0.0114; centred on NGC 4696","approx":true},{"name":"Great Attractor","kind":"attractor","ra_deg":199.65,"dec_deg":-53.66,"dist_mly":220,"size_mly":300,"note":"Gravitational anomaly at l~307, b~9 (RA/Dec computed); 150-250 Mly; core of Laniakea flows; mostly behind Zone of Avoidance","approx":true},{"name":"Norma Cluster (Abell 3627)","kind":"cluster","ra_deg":243.893,"dec_deg":-60.913,"dist_mly":220,"size_mly":10,"members":600,"note":"Most massive cluster near the Great Attractor core (Norma Wall)","approx":true},{"name":"Perseus Cluster (Abell 426)","kind":"cluster","ra_deg":49.951,"dec_deg":41.512,"dist_mly":240,"size_mly":12,"members":1000,"note":"z~0.0179; NGC 1275 at core; brightest X-ray cluster in sky","approx":true},{"name":"Perseus-Pisces Supercluster","kind":"supercluster","ra_deg":27.5,"dec_deg":36.0,"dist_mly":250,"size_mly":250,"note":"Spans >40 deg of northern winter sky; main clusters Abell 262, 347, 426; borders Taurus Void","approx":true},{"name":"Leo Cluster (Abell 1367)","kind":"cluster","ra_deg":176.15,"dec_deg":19.76,"dist_mly":300,"size_mly":10,"members":300,"note":"z~0.022; with Coma forms the Coma Supercluster","approx":true},{"name":"Coma Cluster (Abell 1656)","kind":"cluster","ra_deg":194.953,"dec_deg":27.981,"dist_mly":321,"size_mly":20,"members":1000,"note":"z=0.0231; mass ~7e14 Msun; Zwicky's dark matter evidence (1933); infobox gives 336 Mly"},{"name":"Coma Supercluster","kind":"supercluster","ra_deg":185.0,"dec_deg":24.0,"dist_mly":330,"size_mly":65,"members":3000,"note":"Coma + Leo clusters; heart of the CfA2 Great Wall","approx":true},{"name":"CfA2 Great Wall","kind":"wall","ra_deg":195.0,"dec_deg":29.0,"dist_mly":300,"size_mly":500,"note":"Geller & Huchra 1989; ~500 x 300 x 15 Mly sheet","approx":true},{"name":"Ophiuchus Supercluster","kind":"supercluster","ra_deg":257.5,"dec_deg":-22.0,"dist_mly":400,"size_mly":85,"note":"cz 8500-9000 km/s; 18 x 26 Mpc; behind Galactic bulge; Valade+ 2024 basin of attraction centred on Ophiuchus","approx":true},{"name":"Leo Supercluster","kind":"supercluster","ra_deg":167.7,"dec_deg":28.7,"dist_mly":480,"size_mly":130,"note":"SCl 93; Abell 1185/1228/1257/1267 region, z~0.035","approx":true},{"name":"Hercules Supercluster","kind":"supercluster","ra_deg":241.15,"dec_deg":17.75,"dist_mly":500,"size_mly":330,"note":"SCl 160; Abell 2151 (Hercules Cluster), 2147, 2152; near edge of Bootes Void","approx":true},{"name":"South Pole Wall","kind":"wall","ra_deg":0.0,"dec_deg":-90.0,"dist_mly":520,"size_mly":1400,"note":"Pomarede, Tully et al. 2020 (Cosmicflows-3); cz~12,000 km/s; density peak at celestial south pole; extends ~0.11c","approx":true},{"name":"Shapley Supercluster (Shapley Concentration)","kind":"supercluster","ra_deg":201.25,"dec_deg":-30.0,"dist_mly":652,"size_mly":625,"members":8000,"note":"z~0.046; most massive structure within ~1 Gly; core mass ~1.3e16 Msun; A3558 central cluster; text gives extent up to ~850 Mly; member count approx","approx":true},{"name":"Pisces-Cetus Supercluster Complex","kind":"supercluster","ra_deg":15.0,"dec_deg":-10.0,"dist_mly":650,"size_mly":1000,"note":"Tully 1987 filament ~1 Gly x 150 Mly; Laniakea/Virgo region sits at one end in the original definition","approx":true},{"name":"Horologium-Reticulum Supercluster","kind":"supercluster","ra_deg":52.0,"dec_deg":-50.0,"dist_mly":700,"size_mly":550,"note":"z~0.063; SCl 48 + SCl 49","approx":true},{"name":"Bootes Void","kind":"void","ra_deg":215.0,"dec_deg":26.0,"dist_mly":700,"size_mly":330,"members":60,"note":"'Great Nothing'; ~150 h^-1 Mpc away, ~100 h^-1 Mpc across; ~60 galaxies found inside","approx":true},{"name":"Dipole Repeller","kind":"void","ra_deg":347.94,"dec_deg":6.95,"dist_mly":720,"size_mly":600,"note":"Hoffman et al. 2017; underdensity at ~16,000 km/s in the anti-CMB-dipole direction (position = CMB dipole anti-apex, computed); pushes LG toward Shapley","approx":true},{"name":"Local Void","kind":"void","ra_deg":279.5,"dec_deg":18.0,"dist_mly":116,"size_mly":195,"note":"Adjacent to the Local Group/Local Sheet; cz~2500 km/s; ~60 Mpc across; its expansion contributes ~260 km/s to LG motion","approx":true},{"name":"Sculptor Void","kind":"void","ra_deg":357.0,"dec_deg":-24.65,"dist_mly":250,"size_mly":160,"note":"~35 h^-1 Mpc; next to Southern Wall","approx":true},{"name":"KBC Void (Local Hole)","kind":"void","ra_deg":0.0,"dec_deg":0.0,"dist_mly":0,"size_mly":2000,"note":"Keenan-Barger-Cowie 2013: proposed ~600 Mpc underdensity centred near us; contested; RA/Dec meaningless (centred on observer)","approx":true},{"name":"Sloan Great Wall","kind":"wall","ra_deg":195.0,"dec_deg":0.0,"dist_mly":1000,"size_mly":1370,"note":"Gott et al. 2003 (SDSS); in Corvus/Hydra/Centaurus/Virgo region, z~0.07-0.08; not gravitationally bound","approx":true},{"name":"Giant Void (AR-Lp 36)","kind":"void","ra_deg":195.25,"dec_deg":38.7,"dist_mly":1500,"size_mly":1150,"note":"z=0.116; 300-400 Mpc; discovered 1988 (Canes Venatici)","approx":true},{"name":"Eridanus Supervoid / CMB Cold Spot","kind":"void","ra_deg":48.77,"dec_deg":-19.58,"dist_mly":3000,"size_mly":1800,"note":"Szapudi et al. 2015 supervoid at z~0.15-0.22 (radius ~220 h^-1 Mpc) aligned with CMB Cold Spot; whether it explains the Cold Spot is disputed; beyond 1.5 Gly (flagged)","approx":true,"far":true},{"name":"Saraswati Supercluster","kind":"supercluster","ra_deg":354.6,"dec_deg":0.3,"dist_mly":4000,"size_mly":652,"note":"z~0.28; ~2e16 Msun; 43 massive clusters incl. Abell 2361; beyond 1.5 Gly (flagged)","approx":true,"far":true},{"name":"Giant Arc","kind":"wall","ra_deg":214.0,"dec_deg":24.0,"dist_mly":9250,"size_mly":3300,"note":"Lopez et al. 2021, MgII absorbers at z~0.8 in Bootes; ~9.2 Gly light-travel; sky position approximate; possibly linked to Big Ring; challenges cosmological principle (flagged)","approx":true,"far":true},{"name":"Hercules-Corona Borealis Great Wall","kind":"wall","ra_deg":255.0,"dec_deg":27.75,"dist_mly":16000,"size_mly":10000,"note":"Horvath et al. 2013 via GRB clustering at z=1.6-2.1; comoving 15.0-17.7 Gly (light-travel 9.6-10.5 Gly); existence statistically disputed (flagged)","approx":true,"far":true}],"laniakea":{"diameter_mly":520},"universe":{"radius_gly":46.5,"age_gyr":13.787,"cmb_K":2.72548,"galaxies_note":"a few hundred billion (New Horizons, 2021) to about 2 trillion (Conselice et al., 2016)"}};

"use strict";
/* ============================================================
   SOLAR SYSTEM ATLAS — engine
   ============================================================ */
const DEG = Math.PI/180, TAU = Math.PI*2;
const J2000 = Date.UTC(2000,0,1,12);
const SUN_R = 12, AU_K = 145;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt = n => n >= 100 ? Math.round(n).toLocaleString("en-US") : n >= 10 ? n.toFixed(0) : n.toFixed(1);

/* compressed heliocentric distance: square-root inside 100 AU, logarithmic beyond */
function D(au){ return au <= 100 ? AU_K*Math.sqrt(au) : AU_K*10*(1 + 0.6*Math.log(au/100)); }
function bodyRadius(Rkm){ return Math.max(.12, 1.5*Math.pow(Rkm/6371,.55)); }
function moonDist(parent, rkm){
  const x = Math.max(1.05, rkm/parent.R);
  if (x <= 30) return parent.r*(1 + 0.9*Math.sqrt(x-1));
  return parent.r*(1 + 0.9*Math.sqrt(29) + 2.7*Math.log(x/30));
}
function rng(seed){ let s = seed>>>0 || 1; return () => (s = (s*1664525 + 1013904223)>>>0, s/4294967296); }
function hashStr(str){ let h = 2166136261; for (const ch of str){ h ^= ch.charCodeAt(0); h = Math.imul(h,16777619); } return h>>>0; }

/* small 3D value noise for shaping lumpy bodies */
function noise3(seed){
  const R = rng(seed), P = new Uint8Array(512), G = new Float32Array(256);
  for (let i=0;i<256;i++){ P[i]=i; G[i]=R()*2-1; }
  for (let i=255;i>0;i--){ const j=(R()*(i+1))|0; [P[i],P[j]]=[P[j],P[i]]; }
  for (let i=0;i<256;i++) P[i+256]=P[i];
  const f = t => t*t*(3-2*t), h = (x,y,z) => G[P[P[P[x&255]+(y&255)]+(z&255)]];
  return (x,y,z) => {
    const X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z), u=f(x-X),v=f(y-Y),w=f(z-Z);
    const l=(a,b,t)=>a+(b-a)*t;
    return l(l(l(h(X,Y,Z),h(X+1,Y,Z),u),l(h(X,Y+1,Z),h(X+1,Y+1,Z),u),v),
             l(l(h(X,Y,Z+1),h(X+1,Y,Z+1),u),l(h(X,Y+1,Z+1),h(X+1,Y+1,Z+1),u),v),w);
  };
}

/* ---------------- Kepler ---------------- */
function keplerE(M, e){ let E = e < .8 ? M : Math.PI; for (let k=0;k<30;k++){ const d=(E - e*Math.sin(E) - M)/(1 - e*Math.cos(E)); E -= d; if (Math.abs(d)<1e-9) break; } return E; }
function periodYears(b){ return Math.pow(b.a,1.5); }
function meanAnomaly(b, T){
  if (b.Tp !== undefined){ const yr = 2000 + T/365.25; return TAU*((yr - b.Tp)/periodYears(b)); }
  return b.M0*DEG + TAU*T/(365.25*periodYears(b));
}
/* returns heliocentric position in AU in three.js axes (y = ecliptic north) */
function hyperPoint(b, T, out){
  const a = b.q/(1 - b.e), n = 0.01720209895/Math.pow(-a, 1.5), M = n*(T - b.Tpd);
  let H = Math.asinh(M/b.e); for (let k=0;k<40;k++){ const d = (b.e*Math.sinh(H) - H - M)/(b.e*Math.cosh(H) - 1); H -= d; if (Math.abs(d) < 1e-10) break; }
  return planeToEcl(b, a*(Math.cosh(H) - b.e), -a*Math.sqrt(b.e*b.e - 1)*Math.sinh(H), out);
}
function planeToEcl(b, xv, yv, out){
  const w=b.peri*DEG, O=b.node*DEG, i=b.i*DEG;
  const cw=Math.cos(w), sw=Math.sin(w), cO=Math.cos(O), sO=Math.sin(O), ci=Math.cos(i), si=Math.sin(i);
  const x1 = xv*cw - yv*sw, y1 = xv*sw + yv*cw;
  return out.set(x1*cO - y1*ci*sO, y1*si, -(x1*sO + y1*ci*cO));
}
function helioAU(b, T, out){
  if (b.hyp) return hyperPoint(b, T, out);
  const M = meanAnomaly(b,T), E = keplerE(((M%TAU)+TAU)%TAU, b.e);
  return orbitPoint(b, E, out);
}
function orbitPoint(b, E, out){
  const xv = b.a*(Math.cos(E) - b.e), yv = b.a*Math.sqrt(1-b.e*b.e)*Math.sin(E);
  const w=b.peri*DEG, O=b.node*DEG, i=b.i*DEG;
  const cw=Math.cos(w), sw=Math.sin(w), cO=Math.cos(O), sO=Math.sin(O), ci=Math.cos(i), si=Math.sin(i);
  const x1 = xv*cw - yv*sw, y1 = xv*sw + yv*cw;
  const X = x1*cO - y1*ci*sO, Y = x1*sO + y1*ci*cO, Z = y1*si;
  return out.set(X, Z, -Y);
}
function eclDir(lon, lat){ const l = lon*DEG, b = lat*DEG; return new THREE.Vector3(Math.cos(b)*Math.cos(l), Math.sin(b), -Math.cos(b)*Math.sin(l)); }
function toDisplay(v){ const r = v.length(); return r > 0 ? v.multiplyScalar(D(r)/r) : v; }

/* ---------------- GLSL snippets ---------------- */
const GLSL_NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*snoise(p);p*=2.03;a*=.5;}return s;}
`;
const NL = s => "\n" + s + "\n";
const LOGDEPTH_V = NL("bool isPerspectiveMatrix(mat4 m){return m[2][3]==-1.0;}\n" + THREE.ShaderChunk.logdepthbuf_pars_vertex), LOGDEPTH_VM = NL(THREE.ShaderChunk.logdepthbuf_vertex);
const LOGDEPTH_F = NL(THREE.ShaderChunk.logdepthbuf_pars_fragment), LOGDEPTH_FM = NL(THREE.ShaderChunk.logdepthbuf_fragment);

/* ---------------- renderer & scene ---------------- */
const canvas = $("#c");
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, logarithmicDepthBuffer:true, powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
const MAX_ANISO = renderer.capabilities.getMaxAnisotropy();
const COARSE = matchMedia("(hover:none),(pointer:coarse)").matches;
const MOB = {on:false};
const FX_HOOKS = [], FX_HOOKS_SC = [];
const SCALE = {mode:"system", busy:false};
const DEEP = {on:false};
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020308);
const camera = new THREE.PerspectiveCamera(42, 1, 0.005, 120000);
camera.position.set(0, 780, 1350);
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = .08; controls.rotateSpeed = .55; controls.zoomSpeed = 1.1;
controls.maxDistance = 30000; controls.minDistance = 1;
scene.add(new THREE.AmbientLight(0x8090a8, .1));
const sunLight = new THREE.PointLight(0xfff4e6, 1.55, 0, 0); scene.add(sunLight);

/* ---------------- textures ---------------- */
const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);
/* Surface maps are painted procedurally by solar-tex.js (the photographic tex/ folder was never shipped).
   tex() keeps its old contract: a promise of a THREE texture, or null when there is no map for that name. */
const texCache = {};
function tex(name, hi, linear){
  const key = (hi?"hi/":"lo/")+name;
  if (!texCache[key]){
    manager.itemStart(key);
    texCache[key] = window.SolarTex.make(name, hi).then(cv => {
      if (!cv) return null;
      const t = new THREE.CanvasTexture(cv);
      t.anisotropy = MAX_ANISO; t.wrapS = THREE.RepeatWrapping;
      if (!linear) t.encoding = THREE.sRGBEncoding;
      return t;
    }).finally(() => manager.itemEnd(key));
  }
  return texCache[key];
}
const pngCache = {};
function pngTex(name){
  if (!pngCache[name]){ const cv = window.SolarTex.ring(name); let t = null;
    if (cv){ t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; }
    pngCache[name] = Promise.resolve(t); }
  return pngCache[name];
}
const WHITE = new THREE.DataTexture(new Uint8Array([255,255,255,255]),1,1); WHITE.needsUpdate = true;
function glowTex(stops){ const cv=document.createElement("canvas"); cv.width=cv.height=256; const g=cv.getContext("2d"); const gr=g.createRadialGradient(128,128,0,128,128,128); stops.forEach(s=>gr.addColorStop(s[0],s[1])); g.fillStyle=gr; g.fillRect(0,0,256,256); const t=new THREE.CanvasTexture(cv); t.encoding=THREE.sRGBEncoding; return t; }
const DOT_TEX = glowTex([[0,"rgba(255,255,255,1)"],[.25,"rgba(255,255,255,.85)"],[.55,"rgba(255,255,255,.25)"],[1,"rgba(255,255,255,0)"]]);

/* ---------------- shaders ---------------- */
const SPOTS = [[18,-25,.075],[12,-8,.04],[-14,40,.05],[-20,-120,.045]];   // [lat, lon, angular radius rad] — 0 is the "Sunspots" landmark
const sunUniforms = { map:{value:null}, time:{value:0}, filt:{value:0}, gran:{value:0}, spotK:{value:0},
  spotD:{value:SPOTS.map(s => { const la=s[0]*Math.PI/180, lo=s[1]*Math.PI/180; return new THREE.Vector3(Math.cos(la)*Math.cos(lo), Math.sin(la), -Math.cos(la)*Math.sin(lo)); })},
  spotR:{value:SPOTS.map(s => s[2])} };
const sunMat = new THREE.ShaderMaterial({ uniforms: sunUniforms,
  vertexShader:`varying vec2 vUv;varying vec3 vN;varying vec3 vP;${LOGDEPTH_V}
    void main(){vUv=uv;vN=normalize(normalMatrix*normal);vP=position;vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
  fragmentShader:`uniform sampler2D map;uniform float time;uniform float filt;uniform float gran;uniform float spotK;uniform vec3 spotD[4];uniform float spotR[4];
    varying vec2 vUv;varying vec3 vN;varying vec3 vP;${GLSL_NOISE}${LOGDEPTH_F}
    void main(){${LOGDEPTH_FM}
      vec3 p=normalize(vP);
      float warp=fbm(p*2.5+vec3(time*.015));
      vec2 uv=vUv+vec2(warp*.008,warp*.005);
      float lum=dot(texture2D(map,uv).rgb,vec3(.3,.55,.15));
      float g1=snoise(p*110.0+vec3(0.,time*.15,0.))*.5+.5;
      float g2=snoise(p*330.0+vec3(time*.3,0.,0.))*.5+.5;
      float g=mix(g1,g1*.6+g2*.4,gran);
      float act=smoothstep(.05,.55,fbm(p*2.2+vec3(time*.008,0.,0.)));
      /* sunspot groups: dark umbra, filamented penumbra, peppered small spots, bright faculae */
      float dark=0.;float fac=0.;
      for(int i=0;i<4;i++){
        vec3 c=spotD[i];float r=spotR[i]*(i==0?1.+spotK*.15:1.);
        float a=acos(clamp(dot(p,c),-1.,1.));
        vec3 u=normalize(cross(c,vec3(0.,1.,0.))+vec3(1e-4));vec3 v=cross(c,u);
        float ang=atan(dot(p,v),dot(p,u));
        float wob=snoise(p*40.+float(i)*7.)*.12*r;
        float umb=smoothstep(r*.48,r*.36,a+wob);
        float pen=smoothstep(r*.92,r*.7,a+wob)*(1.-umb);
        float fil=.72+.28*sin(ang*46.+snoise(p*90.)*3.);
        float pep=smoothstep(.74,.86,snoise(p*70.+float(i)*13.))*smoothstep(r*2.2,r*1.05,a);
        dark=max(dark,max(umb*.92,max(pen*.34*fil,pep*.5)));
        fac+=smoothstep(r*4.,r*1.2,a)*(.5+.5*snoise(p*55.+float(i)));
      }
      float mu=clamp(dot(normalize(vN),vec3(0.,0.,1.)),0.,1.);
      /* true colour: white disc, ~15% granulation contrast, white-light limb darkening that reddens toward the edge */
      float l=lum*.6+g*.5;
      float I=mix(.84,1.06,smoothstep(.15,.85,l));
      I*=.32+.68*pow(mu,.55);
      vec3 tint=mix(vec3(1.,.66,.42),vec3(1.,.99,.965),pow(mu,.35));
      vec3 tc=tint*I*1.04;
      tc+=vec3(.25,.22,.18)*fac*.35*pow(1.-mu,1.5);
      tc*=1.-dark*.92; tc=mix(tc,vec3(.22,.12,.07)*I,dark*.35);
      /* filtered look (like the coloured SDO/observatory images) */
      vec3 q=p*7.0+vec3(warp*1.6,time*.02,0.);
      float rid=pow(1.0-abs(snoise(q)),7.0)+.6*pow(1.0-abs(snoise(q*2.1+3.1)),9.0);
      float lf=lum*.95+g*.18-.12;
      vec3 fc=mix(vec3(.30,.07,.01),vec3(.95,.45,.07),smoothstep(.05,.75,lf));
      fc+=vec3(1.,.78,.38)*rid*act*.9;
      fc+=vec3(1.,.8,.4)*fac*.25;
      fc=mix(fc,vec3(.16,.035,.0),dark*.9);
      fc*= .38+.62*pow(mu,.55);
      fc+= vec3(1.,.5,.12)*pow(1.-mu,2.5)*.45;
      gl_FragColor=vec4(mix(tc,fc*.9,filt),1.);}`
});
function coronaMat(color){
  return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{time:sunUniforms.time, col:{value:new THREE.Color(color)}},
    vertexShader:`varying vec2 vUv;${LOGDEPTH_V}void main(){vUv=uv*2.-1.;vec4 mv=modelViewMatrix*vec4(0.,0.,0.,1.);mv.xy+=position.xy;gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
    fragmentShader:`uniform float time;uniform vec3 col;varying vec2 vUv;${GLSL_NOISE}${LOGDEPTH_F}
      void main(){${LOGDEPTH_FM}
        float r=length(vUv)*5.0; if(r<.98) discard;
        float a=atan(vUv.y,vUv.x);
        float glow=exp(-(r-1.)*2.6)*.95;
        float str=pow(max(snoise(vec3(cos(a)*3.,sin(a)*3.,time*.03)),0.),2.)*exp(-(r-1.)*.9)*.9;
        float fine=pow(max(snoise(vec3(cos(a)*14.,sin(a)*14.,r*.6-time*.05)),0.),3.)*exp(-(r-1.)*1.6)*.7;
        float i=glow+str+fine; i*=smoothstep(5.,2.4,r);
        gl_FragColor=vec4(col*i,1.);}`
  });
}
function atmoMat(color, strength){
  return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.BackSide,
    uniforms:{col:{value:new THREE.Color(color)}, k:{value:strength}},
    vertexShader:`varying vec3 vN;varying vec3 vW;varying vec3 vV;${LOGDEPTH_V}void main(){vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;${LOGDEPTH_VM}}`,
    fragmentShader:`uniform vec3 col;uniform float k;varying vec3 vN;varying vec3 vW;varying vec3 vV;${LOGDEPTH_F}
      void main(){${LOGDEPTH_FM}
        float f=pow(clamp(1.0+dot(vV,vN),0.,1.),2.2);
        float rim=1.-abs(dot(vV,vN));
        vec3 L=normalize(-vW);
        float lit=smoothstep(-.35,.5,dot(vN,L));
        float a=pow(rim,3.5)*lit*k*1.6;
        gl_FragColor=vec4(col*a,1.);}`
  });
}
function earthMat(){
  return new THREE.ShaderMaterial({
    uniforms:{day:{value:null}, night:{value:null}},
    vertexShader:`varying vec2 vUv;varying vec3 vN;varying vec3 vW;${LOGDEPTH_V}void main(){vUv=uv;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;${LOGDEPTH_VM}}`,
    fragmentShader:`uniform sampler2D day;uniform sampler2D night;varying vec2 vUv;varying vec3 vN;varying vec3 vW;${LOGDEPTH_F}
      void main(){${LOGDEPTH_FM}
        vec3 N=normalize(vN),L=normalize(-vW),V=normalize(cameraPosition-vW);
        float d=dot(N,L);
        vec3 dc=texture2D(day,vUv).rgb;
        vec3 nc=texture2D(night,vUv).rgb;
        float water=smoothstep(.02,.1,dc.b-dc.r)*smoothstep(.45,.2,dc.g);
        vec3 col=dc*(max(d,0.)*1.08+.015);
        float spec=pow(max(dot(reflect(-L,N),V),0.),38.)*water*.55*step(0.,d);
        col+=vec3(1.,.95,.85)*spec;
        col+=nc*vec3(1.,.82,.55)*smoothstep(.12,-.18,d)*1.5;
        float rim=pow(1.-max(dot(N,V),0.),3.)*smoothstep(-.2,.4,d);
        col+=vec3(.35,.6,1.)*rim*.45;
        gl_FragColor=vec4(col,1.);}`
  });
}
function ringMat(map, inner, outer, tint, opacity){
  return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, side:THREE.DoubleSide,
    uniforms:{map:{value:map||WHITE}, pc:{value:new THREE.Vector3()}, pr:{value:1}, tint:{value:new THREE.Color(tint||"#ffffff")}, op:{value:opacity==null?1:opacity}},
    vertexShader:`varying vec2 vUv;varying vec3 vW;${LOGDEPTH_V}void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;${LOGDEPTH_VM}}`,
    fragmentShader:`uniform sampler2D map;uniform vec3 pc;uniform float pr;uniform vec3 tint;uniform float op;varying vec2 vUv;varying vec3 vW;${LOGDEPTH_F}
      void main(){${LOGDEPTH_FM}
        vec4 c=texture2D(map,vec2(vUv.x,.5));
        vec3 d=normalize(-vW);vec3 oc=vW-pc;float b=dot(oc,d);float cc=dot(oc,oc)-pr*pr;float h=b*b-cc;
        float sh=(h>0.0 && (-b-sqrt(h))>0.0)?.12:1.0;
        gl_FragColor=vec4(c.rgb*tint*sh*1.05,c.a*op);}`
  });
}
/* auroral ovals: an additive shell that co-rotates with the planet's magnetic field */
function llDir(lat, lon){ const la = lat*DEG, lo = lon*DEG; return new THREE.Vector3(Math.cos(la)*Math.cos(lo), Math.sin(la), -Math.cos(la)*Math.sin(lo)); }
function auroraMat(a, shellK){
  return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{ time:sunUniforms.time, k:{value:0}, col:{value:new THREE.Color(a.color).multiplyScalar(a.gain||1)}, cN:{value:llDir(a.lat, a.lon)}, cS:{value:llDir(a.sLat, a.sLon)},
      rN:{value:a.r*DEG}, rS:{value:(a.sR||a.r)*DEG}, wid:{value:(a.w||2)*DEG}, night:{value:a.night?1:0}, shell:{value:shellK} },
    vertexShader:`varying vec3 vP;varying vec3 vN;varying vec3 vW;${LOGDEPTH_V}void main(){vP=normalize(position);vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;${LOGDEPTH_VM}}`,
    fragmentShader:`uniform float time;uniform float k;uniform vec3 col;uniform vec3 cN;uniform vec3 cS;uniform float rN;uniform float rS;uniform float wid;uniform float night;uniform float shell;varying vec3 vP;varying vec3 vN;varying vec3 vW;${GLSL_NOISE}${LOGDEPTH_F}
      float oval(vec3 c,float r){
        float a=acos(clamp(dot(vP,c),-1.,1.));
        float wob=snoise(vec3(vP*9.+vec3(0.,time*.06,0.)))*.35*wid+snoise(vP*3.1)*wid*.6;
        float d=(a-r-wob)/wid;
        float ring=exp(-d*d)*(.55+.45*snoise(vec3(vP*38.+vec3(time*.25,0.,0.))));
        float rays=pow(max(snoise(vec3(vP*70.+vec3(0.,0.,time*.4))),0.),2.)*exp(-d*d*.35)*.8;
        float inner=smoothstep(r+wid,r*.2,a)*.07*(.6+.4*snoise(vP*14.+time*.05));
        return ring+rays+inner;}
      void main(){${LOGDEPTH_FM}
        vec3 V=normalize(cameraPosition-vW);vec3 N=normalize(vN);
        float i=oval(cN,rN)+oval(cS,rS);
        float edge=1./max(abs(dot(N,V)),.18);
        i*=mix(1.,edge,.55)*shell;
        if(night>.5){ float d=dot(N,normalize(-vW)); i*=mix(.3,1.,smoothstep(.25,-.2,d)); }
        vec3 c=mix(col,vec3(1.),clamp(i*.22,0.,.45))*i*k;
        gl_FragColor=vec4(c,1.);}`
  });
}
function ringGeo(inner, outer){
  const g = new THREE.RingGeometry(inner, outer, 256, 4);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i=0;i<p.count;i++){ const r = Math.hypot(p.getX(i), p.getY(i)); uv.setXY(i, (r-inner)/(outer-inner), .5); }
  g.rotateX(-Math.PI/2); return g;
}
const MAXL = 6;
function cutMat(layers, R){
  const rad=[], col=[], hot=[], soft=[], wat=[];
  for (let i=0;i<MAXL;i++){ const l = layers[Math.min(i,layers.length-1)];
    rad.push(i<layers.length ? l[1]*R : 1e9); col.push(new THREE.Color(l[2]));
    hot.push((l[4]&&l[4].hot)||0); soft.push((l[4]&&l[4].soft)?1:0); wat.push((l[4]&&l[4].water)?1:0); }
  return new THREE.ShaderMaterial({ side:THREE.DoubleSide,
    uniforms:{rad:{value:rad}, col:{value:col}, hot:{value:hot}, soft:{value:soft}, wat:{value:wat}, R:{value:R}, n:{value:layers.length}, time:sunUniforms.time, hl:{value:-1}},
    vertexShader:`varying vec2 vL;${LOGDEPTH_V}void main(){vL=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);${LOGDEPTH_VM}}`,
    fragmentShader:`uniform float rad[${MAXL}];uniform vec3 col[${MAXL}];uniform float hot[${MAXL}];uniform float soft[${MAXL}];uniform float wat[${MAXL}];uniform float R;uniform int n;uniform float time;uniform float hl;varying vec2 vL;${GLSL_NOISE}${LOGDEPTH_F}
      void main(){${LOGDEPTH_FM}
        float r=length(vL);
        int idx=0; float inner=0.; float outer=rad[0];
        for(int i=0;i<${MAXL};i++){ if(i<n && r>rad[i]) { idx=i+1; } }
        vec3 c=col[0]; float h=hot[0]; float s=soft[0]; float w=wat[0]; float rin=0.; float rout=rad[0];
        for(int i=0;i<${MAXL};i++){ if(i==idx){ c=col[i]; h=hot[i]; s=soft[i]; w=wat[i]; rout=rad[i]; } if(i==idx-1){ rin=rad[i]; } }
        vec3 p=vec3(vL/R*6.,0.);
        float nz=fbm(p*1.5+vec3(float(idx)*3.7));
        float fine=snoise(vec3(vL/R*60.,float(idx)));
        c*=1.0+nz*.16+fine*.04;
        if(w>.5){ c*=1.0+.18*sin(r/R*220.+nz*6.); }
        if(s>.5 && idx>0){ vec3 prev=col[0]; for(int i=0;i<${MAXL};i++){ if(i==idx-1) prev=col[i]; }
          float t=smoothstep(0.,(rout-rin)*.35,r-rin); c=mix((prev+c)*.5,c,t); }
        if(h>0.){ float g=1.-clamp(r/R,0.,1.); c+=vec3(1.,.55,.15)*h*.35*g; c*=1.0+h*.25*(snoise(vec3(vL/R*8.,time*.15))*.5+.5); }
        float edge=1.-smoothstep(0.,R*.006,abs(r-rout));
        if(idx>0) edge=max(edge,1.-smoothstep(0.,R*.006,abs(r-rin)));
        c=mix(c,vec3(1.),edge*.35);
        if(hl>-.5 && abs(hl-float(idx))<.1) c=mix(c,vec3(1.,.75,.3),.28);
        gl_FragColor=vec4(c,1.);}`
  });
}
function pointsMat(opts){
  return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{time:{value:0}, px:{value:600}, jup:{value:0}, op:{value:opts.op||1}, tex:{value:DOT_TEX}},
    vertexShader:`attribute float aA;attribute float aPh;attribute float aN;attribute float aInc;attribute float aNode;attribute float aSize;attribute vec3 aCol;
      uniform float time;uniform float px;uniform float jup;varying vec3 vC;varying float vA;${LOGDEPTH_V}
      void main(){
        ${opts.static ? "vec3 p=position;" : `float ang=aPh+${opts.trojan?"jup":"time*aN"};vec3 p=vec3(cos(ang)*aA,0.,-sin(ang)*aA);
        float ci=cos(aInc),si=sin(aInc);p=vec3(p.x,p.y*ci-p.z*si,p.y*si+p.z*ci);
        float cn=cos(aNode),sn=sin(aNode);p=vec3(p.x*cn+p.z*sn,p.y,-p.x*sn+p.z*cn);`}
        vec4 mv=modelViewMatrix*vec4(p,1.);
        float s=aSize*px/(-mv.z);
        vA=clamp(s/1.6,.15,1.)*min(1.,${(opts.maxPx||5).toFixed(1)}/s);
        gl_PointSize=clamp(s,1.6,${(opts.maxPx||5).toFixed(1)});
        vC=aCol;gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
    fragmentShader:`uniform sampler2D tex;uniform float op;varying vec3 vC;varying float vA;${LOGDEPTH_F}
      void main(){${LOGDEPTH_FM}float a=texture2D(tex,gl_PointCoord).a;gl_FragColor=vec4(vC*a*vA*op,1.);}`
  });
}

/* ---------------- geometry helpers ---------------- */
function remapUV(g, phiStart, phiLen, thStart, thLen){
  const uv = g.attributes.uv;
  for (let i=0;i<uv.count;i++){
    uv.setX(i, (phiStart + uv.getX(i)*phiLen)/TAU);
    if (thLen !== undefined) uv.setY(i, 1 - (thStart + (1 - uv.getY(i))*thLen)/Math.PI);
  }
}
function lumpyGeo(axes, seed, amp, seg){
  const g = new THREE.SphereGeometry(1, seg||72, Math.round((seg||72)*.55));
  const n = noise3(seed), p = g.attributes.position, v = new THREE.Vector3();
  for (let i=0;i<p.count;i++){
    v.fromBufferAttribute(p,i);
    const d = 1 + amp*(n(v.x*1.6+9,v.y*1.6,v.z*1.6) + .45*n(v.x*4+3,v.y*4,v.z*4) + .2*n(v.x*9,v.y*9+5,v.z*9));
    p.setXYZ(i, v.x*axes[0]*d, v.y*axes[1]*d, v.z*axes[2]*d);
  }
  g.computeVertexNormals(); return g;
}

/* ============================================================
   BUILD THE SYSTEM
   ============================================================ */
const TEX_AVG = {"ariel": "#bdbdbd", "arrokoth": "#4a4137", "asteroid": "#a7a7a7", "callisto": "#9d9890", "ceres": "#41403e", "charon": "#858482", "comet": "#4a4641", "deimos": "#2d2d2d", "dione": "#d0d0cd", "earth": "#4e5154", "earth_clouds": "#4c4c4c", "earth_night": "#000000", "enceladus": "#e7e7e6", "europa": "#cecac3", "ganymede": "#b4b1ad", "hyperion": "#97938c", "iapetus": "#908c82", "icy": "#e6e6e7", "io": "#bbb299", "jupiter": "#a28e7a", "mars": "#735b43", "mercury": "#59554e", "mimas": "#cbcac9", "miranda": "#b9b9b9", "moon": "#57534b", "neptune": "#9fb8ca", "ninth": "#a6c6d2", "nix": "#858686", "oberon": "#929292", "phobos": "#212121", "phoebe": "#444444", "pluto": "#cdc4b5", "puck": "#828280", "rhea": "#cdccc5", "rocky": "#54524b", "saturn": "#e3cea5", "sun": "#f08828", "tethys": "#e3e2df", "titan": "#6c5e51", "titan_haze": "#b49e76", "titania": "#9e9e9e", "triton": "#a9a7a0", "umbriel": "#878787", "uranus": "#bac8cd", "venus": "#797466", "venus_clouds": "#e6e2d4", "vesta": "#7e7b78"};
const HI_SET = new Set(["ariel", "arrokoth", "asteroid", "callisto", "ceres", "charon", "comet", "deimos", "dione", "earth", "earth_clouds", "earth_night", "earth_normal", "enceladus", "europa", "ganymede", "hyperion", "iapetus", "icy", "io", "jupiter", "mars", "mars_normal", "mercury", "mercury_normal", "mimas", "miranda", "moon", "moon_normal", "neptune", "ninth", "nix", "oberon", "phobos", "phoebe", "pluto", "puck", "rhea", "rocky", "saturn", "sun", "tethys", "titan", "titan_haze", "titania", "triton", "umbriel", "uranus", "venus", "venus_clouds", "vesta"]);
const byId = {}; BODIES.forEach(b => { byId[b.id] = b; b.moons = []; });
BODIES.forEach(b => { b.craft = []; });
BODIES.forEach(b => { if (b.parent) (b.kind === "craft" ? byId[b.parent].craft : byId[b.parent].moons).push(b); });
const PLANET_ORDER = ["mercury","venus","earth","mars","jupiter","saturn","uranus","neptune"];
const pickables = [];
const T0 = (Date.now() - J2000)/86400000;
let T = T0;

function radiusFor(b){
  if (b.kind === "star") return SUN_R;
  if (b.kind === "moon"){ const p = byId[b.parent]; return Math.max(.045, p.r*Math.pow(b.R/p.R, .7)); }
  if (b.kind === "craft") return b.parent ? Math.max(.004, Math.min(.016, byId[b.parent].r*.011)) : .02;
  return bodyRadius(b.R);
}
function axesFor(b){
  if (b.shape) return b.shape.map(x => x/b.R);
  if (Array.isArray(b.lumpy)){ const m = b.lumpy.reduce((s,x)=>s+x,0)/3; return b.lumpy.map(x => x/m); }
  if (b.lumpy){ const R = rng(hashStr(b.id)); return [1.12+R()*.15, .9+R()*.08, .78+R()*.1]; }
  return [1,1,1];
}

const MINOR_GEO = [0,1,2,3,4,5].map(i => lumpyGeo([1.15+.1*(i%3), .92, .8+.05*i], 900+i, .1, 28));
const MINOR_MAT = {};
const CRAFT_GEO = { body:new THREE.BoxGeometry(.8, .8, 1.1), panel:new THREE.BoxGeometry(2.2, .05, .7) };
const CRAFT_MAT = { gold:new THREE.MeshStandardMaterial({ color:0xd9a94a, metalness:.6, roughness:.35, emissive:0x3a2a08 }), panel:new THREE.MeshStandardMaterial({ color:0x24345a, metalness:.4, roughness:.4, emissive:0x0a1430 }),
  beacon:new THREE.SpriteMaterial({ map:glowTex([[0,"rgba(255,230,170,.9)"],[.3,"rgba(255,200,110,.25)"],[1,"rgba(0,0,0,0)"]]), blending:THREE.AdditiveBlending, depthWrite:false, transparent:true }) };
function buildBody(b){
  if (b.parent) b.r = radiusFor(b); else b.r = radiusFor(b);
  b.orbitNode = new THREE.Group(); b.orbitNode.name = b.id;
  b.tiltG = new THREE.Group();
  const tilt = (b.tilt||0)*DEG;
  b.tiltG.quaternion.setFromAxisAngle(new THREE.Vector3(0,0,1), tilt);
  b.spin = new THREE.Group();
  b.tiltG.add(b.spin); b.orbitNode.add(b.tiltG);
  b.axes = axesFor(b);
  const seed = hashStr(b.id);
  let geo;
  const segs = b.kind==="moon" && b.R < 400 ? 48 : 96;
  if (b.contact){
    geo = null;
  } else if (b.minor){
    geo = MINOR_GEO[seed % MINOR_GEO.length];
  } else if (b.lumpy){
    geo = lumpyGeo(b.axes, seed, b.R < 30 ? .12 : .07, 72);
  } else geo = new THREE.SphereGeometry(1, segs, Math.round(segs/2));

  let mat;
  if (b.minor){ mat = MINOR_MAT[b.tint] || (MINOR_MAT[b.tint] = new THREE.MeshStandardMaterial({ color:new THREE.Color(b.tint), roughness:1, metalness:0 })); if (!mat.map) tex("asteroid").then(t => { if (t && !mat.map){ mat.map = t; mat.needsUpdate = true; } }); }
  else if (b.kind === "star"){ mat = sunMat; }
  else if (b.earth){ mat = earthMat(); }
  else {
    mat = new THREE.MeshStandardMaterial({ color:new THREE.Color(b.tint||"#ffffff"), roughness:1, metalness:0 });
    if (b.kind === "hypo"){ mat.transparent = true; mat.opacity = .82; mat.emissive = new THREE.Color("#1a2a3a"); }
    if (b.kind === "comet") mat.color.multiplyScalar(.85);
  }
  b.mat = mat;
  if (b.kind === "craft"){
    const g = new THREE.Group(), gold = CRAFT_MAT.gold, pan = CRAFT_MAT.panel;
    const body = new THREE.Mesh(CRAFT_GEO.body, gold), p1 = new THREE.Mesh(CRAFT_GEO.panel, pan), p2 = new THREE.Mesh(CRAFT_GEO.panel, pan);
    p1.position.x = 1.6; p2.position.x = -1.6; g.add(body, p1, p2);
    const beacon = new THREE.Sprite(CRAFT_MAT.beacon); beacon.scale.setScalar(2.4); g.add(beacon);
    g.scale.setScalar(b.r); b.mesh = g; [body, p1, p2].forEach(m => { m.userData.body = b; pickables.push(m); });
    b.axes = [1,1,1];
  } else if (b.contact){
    const g = new THREE.Group();
    const l1 = new THREE.Mesh(lumpyGeo([1.22,.39,1.11], seed, .06, 64), mat); l1.position.x = -.88;
    const l2 = new THREE.Mesh(lumpyGeo([.83,.55,.83], seed+7, .06, 64), mat); l2.position.x = 1.15;
    g.add(l1,l2); g.scale.setScalar(b.r); b.mesh = g;
    [l1,l2].forEach(m => { m.userData.body = b; pickables.push(m); });
    b.axes = [2.0,.6,1.1];
  } else {
    b.mesh = new THREE.Mesh(geo, mat);
    if (!b.lumpy && b.shape) b.mesh.scale.set(b.r*b.axes[0], b.r*b.axes[2], b.r*b.axes[1]);
    else b.mesh.scale.setScalar(b.r);
    b.mesh.userData.body = b; pickables.push(b.mesh);
  }
  b.spin.add(b.mesh);
  if (b.lumpy || b.tint) b.spin.rotation.y = (seed%360)*DEG;   // vary the look of shared maps

  // textures
  if (b.kind === "star"){ tex("sun").then(t => { sunUniforms.map.value = t; }); }
  else if (b.earth){ tex("earth").then(t => mat.uniforms.day.value = t); tex("earth_night").then(t => mat.uniforms.night.value = t); }
  else if (b.tex && !b.minor && b.kind !== "craft"){ tex(b.tex).then(t => { if (t){ mat.map = t; mat.needsUpdate = true; } }); }

  // clouds / veils
  if (b.earth){
    const cm = new THREE.MeshStandardMaterial({ color:0xffffff, transparent:true, depthWrite:false, roughness:1, opacity:.95 });
    tex("earth_clouds", false, true).then(t => { cm.alphaMap = t; cm.needsUpdate = true; });
    b.clouds = new THREE.Mesh(new THREE.SphereGeometry(1.008, 96, 48), cm); b.clouds.scale.setScalar(b.r);
    b.spin.add(b.clouds);
  }
  if (b.veil){
    const vm = new THREE.MeshStandardMaterial({ color:new THREE.Color(b.veil.color||"#ffffff"), roughness:1, transparent:true, opacity:b.id==="titan"?.93:.99 });
    tex(b.veil.tex).then(t => { if (t){ vm.map = t; if (b.veil.color) vm.color.set("#ffffff"); vm.needsUpdate = true; } });
    b.veilMesh = new THREE.Mesh(new THREE.SphereGeometry(1.012, 96, 48), vm); b.veilMesh.scale.setScalar(b.r);
    b.veilMesh.userData.body = b; pickables.push(b.veilMesh);
    b.spin.add(b.veilMesh);
  }
  if (b.atmo){
    b.atmoMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), atmoMat(b.atmo, b.atmoThin ? .45 : 1));
    b.atmoMesh.scale.setScalar(b.r*(b.atmoThin?1.035:1.07));
    b.tiltG.add(b.atmoMesh);
  }
  // rings
  if (b.rings){
    const spec = {saturn:[1.235,2.41,"#ffffff",1], uranus:[1.65,2.02,"#c8d6dc",1], neptune:[1.70,2.56,"#c8c8d0",.9]}[b.rings];
    const m = ringMat(null, spec[0], spec[1], spec[2], spec[3]);
    pngTex(b.rings+"_rings").then(t => { if (t) m.uniforms.map.value = t; });
    b.ringMesh = new THREE.Mesh(ringGeo(spec[0]*b.r, spec[1]*b.r), m); b.tiltG.add(b.ringMesh);
  } else if (b.ring){
    const m = ringMat(null, b.ring.inner, b.ring.outer, b.ring.color, b.ring.opacity);
    b.ringMesh = new THREE.Mesh(ringGeo(b.ring.inner*b.r, b.ring.outer*b.r), m); b.tiltG.add(b.ringMesh);
  }
  if (b.aurora){
    b.auroraMeshes = [[1.012, 1], [1.045, .45]].map(([sz, k]) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), auroraMat(b.aurora, k));
      m.scale.setScalar(b.r*sz); m.renderOrder = 3; b.spin.add(m); return m; });
    b.aurK = 0;
  }
  if (b.kind === "hypo"){
    const wire = new THREE.Mesh(new THREE.SphereGeometry(1.03, 24, 12), new THREE.MeshBasicMaterial({ color:0xf0b44c, wireframe:true, transparent:true, opacity:.16, depthWrite:false }));
    wire.scale.setScalar(b.r); b.spin.add(wire);
  }
  if (b.kind === "star"){
    const cor = new THREE.Mesh(new THREE.PlaneGeometry(SUN_R*10, SUN_R*10), coronaMat("#ffb347"));
    cor.frustumCulled = false; b.orbitNode.add(cor); b.corona = cor;
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex([[0,"rgba(255,220,150,.42)"],[.22,"rgba(255,160,60,.14)"],[1,"rgba(0,0,0,0)"]]), blending:THREE.AdditiveBlending, depthWrite:false, transparent:true }));
    halo.scale.setScalar(SUN_R*28); b.orbitNode.add(halo); b.halo = halo;
  }
  return b;
}

BODIES.forEach(b => { if (!b.parent) buildBody(b); });
BODIES.forEach(b => { if (b.parent) buildBody(b); });   // moons after parents (radius depends on parent)

/* place in hierarchy, moon orbit params */
const orbitLines = [];
BODIES.forEach(b => {
  if (b.parent){
    const p = byId[b.parent];
    p.tiltG.add(b.orbitNode);
    const R = rng(hashStr(b.id+"o"));
    b.inc = b.inc || 0;
    b.dir = b.inc > 90 ? 1 : Math.sign(b.P);   // an inclination over 90° already makes the orbit retrograde
    b.node = R()*360; b.argp = R()*360;
    b.theta = (b.phase !== undefined ? (byId[b.parent].moons.find(m => m.a === b.a && m.phase === undefined)||{theta0:0}).theta0 + b.phase*DEG : R()*TAU);
    b.theta0 = b.theta;
    b.e = b.ecc || 0;
    b.dist = moonDist(p, b.a);
    // orbit line
    const pts = [];
    for (let k=0;k<=160;k++){ const ang = k/160*TAU; pts.push(moonLocal(b, ang, new THREE.Vector3())); }
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color:0x9fb0c8, transparent:true, opacity:b.minor ? .05 : .22, depthWrite:false }));
    line.userData.moon = b; p.tiltG.add(line); b.orbitLine = line; line.visible = false;
  } else {
    scene.add(b.orbitNode);
    if (b.a || b.hyp){
      const pts = [], N = b.e > .5 ? 900 : 360, v = new THREE.Vector3();
      if (b.hyp){ const a = b.q/(1 - b.e), Hm = Math.acosh((1 - 80/a)/b.e); for (let k=0;k<=N;k++){ const H = -Hm + 2*Hm*k/N; planeToEcl(b, a*(Math.cosh(H) - b.e), -a*Math.sqrt(b.e*b.e - 1)*Math.sinh(H), v); pts.push(toDisplay(v.clone())); } }
      else for (let k=0;k<=N;k++){ const E = k/N*TAU; orbitPoint(b, E, v); pts.push(toDisplay(v.clone())); }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const col = {planet:0x8fa3bf, dwarf:0x9b8f86, small:0x7f8790, comet:0x7fc0e0, hypo:0xf0b44c, craft:0xd8b46a}[b.kind] || 0x8fa3bf;
      const mat = b.kind === "hypo" ? new THREE.LineDashedMaterial({ color:col, dashSize:22, gapSize:16, transparent:true, opacity:.55, depthWrite:false })
                                    : new THREE.LineBasicMaterial({ color:col, transparent:true, opacity: b.kind==="planet" ? .32 : b.extra || b.kind === "craft" ? .1 : .2, depthWrite:false });
      const line = new THREE.Line(g, mat); if (b.kind === "hypo") line.computeLineDistances();
      line.userData.base = mat.opacity; scene.add(line); b.orbitLine = line; orbitLines.push(line);
    }
    if (b.esc){
      const dir = eclDir(b.esc[0], b.esc[1]), pts = [];
      for (let k=0;k<=80;k++){ const au = 2 + k/80*(b.esc[2] + 60); pts.push(dir.clone().multiplyScalar(D(au))); }
      const m = new THREE.LineDashedMaterial({ color:0xd8b46a, dashSize:30, gapSize:24, transparent:true, opacity:.28, depthWrite:false });
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), m); line.computeLineDistances(); line.userData.base = .28; scene.add(line); b.orbitLine = line; orbitLines.push(line);
    }
  }
});
function moonLocal(b, M, out){
  let ang = M, rkm = b.a;
  if (b.e){ const E = keplerE(((M%TAU)+TAU)%TAU, b.e); rkm = b.a*(1 - b.e*Math.cos(E)); ang = 2*Math.atan2(Math.sqrt(1+b.e)*Math.sin(E/2), Math.sqrt(1-b.e)*Math.cos(E/2)) + b.argp*DEG; }
  const d = b.e ? moonDist(byId[b.parent], rkm) : b.dist;
  out.set(Math.cos(ang)*d, 0, -Math.sin(ang)*d);
  const inc = b.inc*DEG, node = b.node*DEG;
  out.applyAxisAngle(new THREE.Vector3(1,0,0), inc).applyAxisAngle(new THREE.Vector3(0,1,0), node);
  return out;
}

/* irregular-moon swarms: the moons beyond those modelled individually */
const swarms = [];
Object.entries(MOON_TOTALS).forEach(([pid, total]) => {
  const p = byId[pid], named = p.moons.length, n = Math.max(0, total - named);
  p.swarmCount = n; if (!n) return;
  const R = rng(hashStr(pid+"swarm")), pos = [], col = [], size = [];
  for (let i=0;i<n;i++){
    const x = 120 + Math.pow(R(),.8)*(pid==="neptune"?1600:pid==="uranus"?650:360);
    const retro = R() < (pid==="jupiter" ? .85 : .7);
    const inc = (retro ? 140 + R()*35 : 25 + R()*30)*DEG, node = R()*TAU, ang = R()*TAU;
    const d = moonDist(p, x*p.R);
    const v = new THREE.Vector3(Math.cos(ang)*d, 0, -Math.sin(ang)*d).applyAxisAngle(new THREE.Vector3(1,0,0), inc).applyAxisAngle(new THREE.Vector3(0,1,0), node);
    pos.push(v.x, v.y, v.z); const c = .55 + R()*.3; col.push(c, c*.95, c*.9); size.push(.05 + R()*.05);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute("aCol", new THREE.Float32BufferAttribute(col,3));
  g.setAttribute("aSize", new THREE.Float32BufferAttribute(size,1));
  const m = pointsMat({static:true, op:.9});
  const pts = new THREE.Points(g, m); pts.frustumCulled = false; pts.visible = false;
  p.tiltG.add(pts); p.swarm = pts; swarms.push(pts);
});

/* ---------------- belts, clouds and the heliosphere ---------------- */
const beltGroup = new THREE.Group(); scene.add(beltGroup);
const pointMats = [];
function makeBelt(n, gen, opts){
  const A=[],Ph=[],Nn=[],Inc=[],Nd=[],S=[],C=[], R = rng(opts.seed);
  for (let i=0;i<n;i++){ const o = gen(R); A.push(D(o.a)); Ph.push(o.ph); Nn.push(TAU/(365.25*Math.pow(o.a,1.5))); Inc.push(o.inc); Nd.push(o.node); S.push(o.s); C.push(...o.c); }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n*3),3));
  [["aA",A],["aPh",Ph],["aN",Nn],["aInc",Inc],["aNode",Nd],["aSize",S]].forEach(([k,v]) => g.setAttribute(k, new THREE.Float32BufferAttribute(v,1)));
  g.setAttribute("aCol", new THREE.Float32BufferAttribute(C,3));
  const m = pointsMat(opts); pointMats.push(m);
  const pts = new THREE.Points(g, m); pts.frustumCulled = false; beltGroup.add(pts); return pts;
}
const gaps = [[2.47,2.53],[2.80,2.85],[2.94,2.98],[3.25,3.3]];
makeBelt(9000, R => { let a; do { a = 2.1 + Math.pow(R(),1.15)*1.2; } while (gaps.some(g => a>g[0] && a<g[1]));
  const t = R(); return {a, ph:R()*TAU, inc:(R()*R())*18*DEG, node:R()*TAU, s:.35+R()*.5, c:[.62+t*.2,.55+t*.15,.48+t*.1]}; }, {seed:11, op:.85});
makeBelt(4200, R => { const side = R()<.5 ? 1 : -1; return {a:5.2+(R()-.5)*.25, ph:side*60*DEG + (R()-.5)*(R()*55)*DEG, inc:R()*R()*30*DEG, node:R()*TAU, s:.4+R()*.4, c:[.62,.5,.42]}; }, {seed:12, trojan:true, op:.8});
makeBelt(14000, R => { const cl = R() < .55; const a = cl ? 42 + R()*5 : 36 + R()*19; const t = R();
  return {a, ph:R()*TAU, inc:(cl ? R()*4 : R()*R()*30)*DEG, node:R()*TAU, s:1.0+R()*1.3, c:[.55+t*.15,.6+t*.15,.72+t*.15]}; }, {seed:13, op:.6});
makeBelt(2600, R => { const a = 50 + Math.pow(R(),2)*90; return {a, ph:R()*TAU, inc:R()*35*DEG, node:R()*TAU, s:1.6+R()*1.5, c:[.5,.55,.68]}; }, {seed:14, op:.45});
// Oort cloud: static shell, gently rotated
(function(){
  const n = 26000, R = rng(15), pos = [], col = [], size = [];
  for (let i=0;i<n;i++){
    const au = 2000*Math.pow(10, Math.pow(R(),.85)*1.7), d = D(au);
    const u = R()*2-1, ph = R()*TAU, s = Math.sqrt(1-u*u);
    let x = s*Math.cos(ph), y = u, z = s*Math.sin(ph);
    if (au < 20000){ const f = (au-2000)/18000; y *= .25 + .75*f; }
    const L = Math.hypot(x,y,z); pos.push(x/L*d, y/L*d, z/L*d);
    const c = .5 + R()*.4; col.push(c*.85, c*.92, c); size.push(9 + R()*12);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute("aCol", new THREE.Float32BufferAttribute(col,3));
  g.setAttribute("aSize", new THREE.Float32BufferAttribute(size,1));
  const m = pointsMat({static:true, op:.75}); pointMats.push(m);
  const pts = new THREE.Points(g, m); pts.frustumCulled = false; beltGroup.add(pts); window.__oort = pts;
})();
function shellMat(color, k){
  return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.FrontSide,
    uniforms:{col:{value:new THREE.Color(color)}, k:{value:k}},
    vertexShader:`varying vec3 vN;varying vec3 vV;${LOGDEPTH_V}void main(){vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;${LOGDEPTH_VM}}`,
    fragmentShader:`uniform vec3 col;uniform float k;varying vec3 vN;varying vec3 vV;${LOGDEPTH_F}void main(){${LOGDEPTH_FM}float f=pow(1.-abs(dot(vN,vV)),4.);gl_FragColor=vec4(col*f*k,1.);}`
  });
}
const helioShock = new THREE.Mesh(new THREE.SphereGeometry(D(94), 96, 48), shellMat("#5f8fd6", .35));
const helioPause = new THREE.Mesh(new THREE.SphereGeometry(D(120), 96, 48), shellMat("#f0b44c", .3));
helioPause.scale.set(1,1,1.12); helioShock.scale.set(1,1,1.08);
beltGroup.add(helioShock, helioPause);

/* starfield + Milky Way band */
(function(){
  const n = 9000, R = rng(99), pos = [], col = [], size = [];
  const band = new THREE.Vector3(.2, .9, .35).normalize();
  for (let i=0;i<n;i++){
    let v;
    if (i < 5000){ const u=R()*2-1, ph=R()*TAU, s=Math.sqrt(1-u*u); v = new THREE.Vector3(s*Math.cos(ph), u, s*Math.sin(ph)); }
    else { v = new THREE.Vector3(R()*2-1,R()*2-1,R()*2-1); v.sub(band.clone().multiplyScalar(v.dot(band)*(.85+R()*.15))).normalize(); }
    v.multiplyScalar(60000); pos.push(v.x,v.y,v.z);
    const t = R(), b = .35 + Math.pow(R(),3)*.9;
    const c = t < .2 ? [1,.82,.65] : t < .45 ? [.75,.85,1] : [1,1,1];
    col.push(c[0]*b, c[1]*b, c[2]*b); size.push((i<5000 ? 55 : 40) + Math.pow(R(),8)*110);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute("aCol", new THREE.Float32BufferAttribute(col,3));
  g.setAttribute("aSize", new THREE.Float32BufferAttribute(size,1));
  const m = pointsMat({static:true, op:1}); pointMats.push(m);
  const stars = new THREE.Points(g, m); stars.frustumCulled = false; scene.add(stars); window.__stars = stars;
})();

/* Halley's tails */
const tail = (function(){
  const n = 2400, R = rng(77), T_ = [], O = [], K = [];
  for (let i=0;i<n;i++){ const k = i < n*.45 ? 0 : 1; T_.push(Math.pow(R(), k ? 1.3 : 1.0)); const u=R()*2-1, ph=R()*TAU, s=Math.sqrt(1-u*u); O.push(s*Math.cos(ph), u, s*Math.sin(ph)); K.push(k); }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n*3),3));
  g.setAttribute("aT", new THREE.Float32BufferAttribute(T_,1)); g.setAttribute("aO", new THREE.Float32BufferAttribute(O,3)); g.setAttribute("aK", new THREE.Float32BufferAttribute(K,1));
  const m = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{cp:{value:new THREE.Vector3()}, as:{value:new THREE.Vector3(1,0,0)}, vel:{value:new THREE.Vector3(0,0,1)}, L:{value:0}, px:{value:600}, tex:{value:DOT_TEX}},
    vertexShader:`attribute float aT;attribute vec3 aO;attribute float aK;uniform vec3 cp;uniform vec3 as;uniform vec3 vel;uniform float L;uniform float px;varying vec3 vC;varying float vA;${LOGDEPTH_V}
      void main(){vec3 p=cp+as*L*aT*(aK>.5?.75:1.)-vel*L*.45*aT*aT*aK+aO*L*(.012+aT*(aK>.5?.11:.035));
        vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=clamp(L*.05*px/(-mv.z),1.5,28.);
        vC=aK>.5?vec3(1.,.9,.72):vec3(.55,.75,1.);vA=(1.-aT)*(1.-aT)*.5;gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
    fragmentShader:`uniform sampler2D tex;varying vec3 vC;varying float vA;${LOGDEPTH_F}void main(){${LOGDEPTH_FM}float a=texture2D(tex,gl_PointCoord).a;gl_FragColor=vec4(vC*a*vA,1.);}`
  });
  const pts = new THREE.Points(g, m); pts.frustumCulled = false; scene.add(pts);
  const coma = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex([[0,"rgba(220,240,255,.9)"],[.3,"rgba(150,200,255,.3)"],[1,"rgba(0,0,0,0)"]]), blending:THREE.AdditiveBlending, depthWrite:false, transparent:true }));
  scene.add(coma);
  return {pts, m, coma};
})();

/* ============================================================
   INTERACTION STATE
   ============================================================ */
const REG = {}; REGIONS.forEach(r => REG[r.id] = r);
let focus = null;          // body or region
let lastFocusPos = new THREE.Vector3();
let fly = null;
let playing = true, speed = 1;   // days per second
let showOrbits = true, showLabels = true, showBelts = true;
let selFeature = null;
const tmpV = new THREE.Vector3(), tmpV2 = new THREE.Vector3(), tmpQ = new THREE.Quaternion();

function worldPos(b, out){ return b.orbitNode.getWorldPosition(out); }

/* ---------------- labels ---------------- */
const labelsEl = $("#labels");
const labels = [];
function addLabel(item, cls, getPos, priority){
  const el = document.createElement("button");
  el.className = "lbl " + cls; el.type = "button"; el.style.opacity = 0; el.style.pointerEvents = "none";
  el.innerHTML = `<span class="d"></span><span class="t">${esc(item.name)}</span>`;
  el.addEventListener("click", e => { e.stopPropagation(); select(item.id); });
  el.addEventListener("pointerenter", () => setHot(item.id, true));
  el.addEventListener("pointerleave", () => setHot(item.id, false));
  labelsEl.appendChild(el);
  const L = {item, el, getPos, priority, w: item.name.length*7.6 + 20, vis:false}; labels.push(L); item.label = L; return L;
}
BODIES.forEach(b => {
  const cls = b.kind === "moon" ? "moon" : b.kind === "small" ? "small" : b.kind === "hypo" ? "hypo" : b.kind === "craft" ? "craft" : b.extra ? "small" : "";
  const pri = {star:100, planet:90, dwarf:70, comet:66, hypo:62, small:50, moon:20, craft:18}[b.kind] + Math.log10(b.R+1) - (b.extra ? 18 : 0);
  addLabel(b, cls, out => worldPos(b, out), pri);
});
const REGION_ANCHOR = {belt:[2.75, 40], kuiper:[44, -35], helio:[120, 15], oort:[9000, 20]};
REGIONS.forEach(r => {
  const [au, ang] = REGION_ANCHOR[r.id];
  const p = new THREE.Vector3(Math.cos(ang*DEG)*D(au), r.id==="oort"? D(au)*.35 : 0, -Math.sin(ang*DEG)*D(au));
  addLabel(r, "region", out => out.copy(p), 45);
});

/* feature pins and layer numbers */
let pinEls = [], layerEls = [];
function clearPins(){ pinEls.forEach(p => p.el.remove()); pinEls = []; }
function buildPins(b){
  clearPins();
  (b.features||[]).forEach((f, i) => {
    const el = document.createElement("button"); el.type = "button"; el.className = "pinl" + (f.craft ? " craft" : "");
    el.innerHTML = `<span class="p"></span><span class="t">${esc(f.n)}</span>`;
    el.addEventListener("click", e => { e.stopPropagation(); selectFeature(b, i); });
    labelsEl.appendChild(el); pinEls.push({el, f, i});
  });
}
function featureWorld(b, f, out, normalOut){
  if (f.ring !== undefined){
    const loc = b.tiltG.worldToLocal(camera.position.clone());
    const a = Math.atan2(-loc.z, loc.x) + .55;
    out.set(Math.cos(a)*f.ring*b.r, 0, -Math.sin(a)*f.ring*b.r);
    if (normalOut) normalOut.set(0, Math.sign(loc.y)||1, 0).applyQuaternion(b.tiltG.getWorldQuaternion(tmpQ));
    return b.tiltG.localToWorld(out);
  }
  const la = f.lat*DEG, lo = f.lon*DEG;
  const ax = b.axes || [1,1,1];
  const n = new THREE.Vector3(Math.cos(la)*Math.cos(lo), Math.sin(la), -Math.cos(la)*Math.sin(lo));
  out.set(n.x*ax[0], n.y*(b.shape?ax[2]:ax[1]), n.z*(b.shape?ax[1]:ax[2])).multiplyScalar(b.r*1.004);
  if (normalOut) normalOut.copy(n).applyQuaternion(b.spin.getWorldQuaternion(tmpQ));
  return b.spin.localToWorld(out);
}

/* ---------------- hover ---------------- */
let hotId = null;
function setHot(id, on){
  hotId = on ? id : (hotId === id ? null : hotId);
  document.querySelectorAll(".row").forEach(r => r.classList.toggle("hot", r.dataset.id === hotId));
  labels.forEach(L => L.el.classList.toggle("hot", L.item.id === hotId));
}
const tip = $("#tip");
const ray = new THREE.Raycaster(); const mouse = new THREE.Vector2();
let downAt = null, lastHoverT = 0;
function pick(cx, cy){
  const rc = canvas.getBoundingClientRect();
  mouse.set(((cx-rc.left)/rc.width)*2-1, -((cy-rc.top)/rc.height)*2+1);
  ray.setFromCamera(mouse, camera);
  const hits = ray.intersectObjects(pickables.filter(m => isShown(m)), false);
  return hits.length ? hits[0].object.userData.body : null;
}
function isShown(o){ while (o){ if (!o.visible) return false; o = o.parent; } return true; }
canvas.addEventListener("pointerdown", e => { downAt = [e.clientX, e.clientY]; canvas.classList.add("drag"); });
window.addEventListener("pointerup", e => {
  canvas.classList.remove("drag");
  if (!downAt) return;
  const moved = Math.hypot(e.clientX-downAt[0], e.clientY-downAt[1]); downAt = null;
  if (moved < 5 && e.target === canvas){ const b = pick(e.clientX, e.clientY); if (b) select(b.id); }
});
canvas.addEventListener("pointermove", e => {
  const now = performance.now(); if (now - lastHoverT < 60 || downAt) return; lastHoverT = now;
  const b = pick(e.clientX, e.clientY);
  canvas.classList.toggle("point", !!b);
  if (b){
    tip.hidden = false; tip.innerHTML = `<b>${esc(b.name)}</b><span>${esc(kindLine(b))}</span>`;
    const rc = $("#app").getBoundingClientRect();
    tip.style.left = Math.min(e.clientX - rc.left + 14, rc.width - 270) + "px"; tip.style.top = (e.clientY - rc.top + 14) + "px";
  } else tip.hidden = true;
});
canvas.addEventListener("pointerleave", () => { tip.hidden = true; });

/* ============================================================
   SELECTION & CAMERA
   ============================================================ */
function kindLine(b){
  if (b.range) return "Region";
  if (b.kind === "star") return "Our star · G-type main-sequence";
  if (b.kind === "planet") return `Planet · ${["1st","2nd","3rd","4th","5th","6th","7th","8th"][PLANET_ORDER.indexOf(b.id)]} from the Sun`;
  if (b.kind === "dwarf") return "Dwarf planet";
  if (b.sub) return b.sub;
  if (b.kind === "small") return b.id === "arrokoth" ? "Kuiper Belt object" : "Asteroid";
  if (b.kind === "comet") return "Periodic comet";
  if (b.kind === "hypo") return "Hypothetical planet";
  if (b.kind === "moon") return `Moon of ${byId[b.parent].name}`;
  if (b.kind === "craft") return `Spacecraft · ${b.status || ""}`;
  return "";
}
function easeInOut(t){ return t<.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }

function startFly(toTargetFn, endOffset, dur){
  fly = { t0: performance.now(), dur: dur || 1700, fromT: controls.target.clone(), fromO: camera.position.clone().sub(controls.target), toTargetFn, endOffset };
}
/* portrait phones see less sideways, so stand further back */
function fitK(strength){ const a = camera.aspect; return a < .85 ? Math.min(2, Math.pow(.85/a, strength == null ? .6 : strength)) : 1; }
function viewDistance(b){
  let k = b.kind === "star" ? 4.2 : 4.4;
  if (b.rings || b.ring) k = 7.5;
  if (b.kind === "comet") return helioAU(b, T, new THREE.Vector3()).length() < 9 ? 70 : b.r*9;
  if (b.contact) k = 7;
  return b.r*k;
}
function select(id, opts){
  opts = opts || {};
  const item = byId[id] || REG[id];
  if (!item) return;
  if (focus && focus !== item && focus.cut) removeCutaway(focus);
  BODIES.forEach(x => x.featFreeze = false);
  focus = item; selFeature = null;
  if (item.range){
    const pos = {belt:[0, D(3.2)*1.15, D(3.2)*1.55], kuiper:[0, D(48)*1.0, D(48)*1.65], helio:[0, D(120)*1.1, D(120)*2.1], oort:[0, D(90000)*.55, D(90000)*1.3]}[item.id];
    startFly(out => out.set(0,0,0), new THREE.Vector3(...pos), 2000);
    controls.minDistance = 1;
    clearPins();
  } else {
    const b = item;
    if (b.minor || (b.kind === "craft" && b.parent)) moonLocal(b, b.theta, b.orbitNode.position);
    const bp = worldPos(b, new THREE.Vector3());
    const cur = camera.position.clone().sub(controls.target).normalize();
    const sunDir = bp.lengthSq() > 1 ? bp.clone().negate().normalize() : cur.clone();
    let dir = sunDir.clone().multiplyScalar(.85).add(cur.multiplyScalar(.55)).add(new THREE.Vector3(0,.32,0)).normalize();
    if (b.kind === "star") dir = cur.lengthSq() ? cur : new THREE.Vector3(0,.3,1).normalize();
    startFly(out => worldPos(b, out), dir.multiplyScalar(viewDistance(b)*fitK()), opts.dur);
    controls.minDistance = b.r*1.12;
    buildPins(b);
    loadHi(b);
    // show siblings' orbit lines
  }
  updateMoonVisibility();
  renderDossier(item);
  renderCrumbs(item);
  markIndex(item.id);
  labels.forEach(L => L.el.classList.toggle("sel", L.item === item));
  if (MOB.on || window.innerWidth <= 860){ $("#index").classList.remove("open"); document.body.classList.remove("idx-open"); $("#idxBtn").setAttribute("aria-expanded","false"); }
}
function goHome(){
  if (focus && focus.cut) removeCutaway(focus);
  BODIES.forEach(x => x.featFreeze = false);
  focus = null; selFeature = null; clearPins();
  startFly(out => out.set(0,0,0), new THREE.Vector3(0, 780, 1350), 1800);
  controls.minDistance = 1;
  $("#dossier").hidden = true; if (typeof HUD !== "undefined") HUD.render(); renderCrumbs(null); markIndex(null); updateMoonVisibility();
  labels.forEach(L => L.el.classList.remove("sel"));
}
function selectFeature(b, i){
  const f = b.features[i]; selFeature = i; b.featFreeze = true;
  const n = new THREE.Vector3(); const p = featureWorld(b, f, new THREE.Vector3(), n);
  const center = worldPos(b, new THREE.Vector3());
  let off;
  if (f.ring !== undefined){ off = p.clone().sub(center).normalize().multiplyScalar(b.r*1.6).add(n.clone().multiplyScalar(b.r*2.2)); off.setLength(b.r*4.2); }
  else if (f.fx === "prom" || f.fx === "cme"){ off = llDir(f.lat*.15, f.lon - 78).applyQuaternion(b.spin.getWorldQuaternion(tmpQ)).multiplyScalar(b.r*(f.fx === "cme" ? 9 : 3.6)*fitK(.6)); }
  else if (f.fx === "hole"){ off = llDir(4, f.lon + 20).applyQuaternion(b.spin.getWorldQuaternion(tmpQ)).multiplyScalar(b.r*5*fitK(.6)); }
  else if (f.aur || f.plume){ const la = f.lat > 0 ? Math.max(f.lat - 40, 12) : Math.min(f.lat + 40, -12); off = llDir(la, f.lon).applyQuaternion(b.spin.getWorldQuaternion(tmpQ)).multiplyScalar(b.r*3.7*fitK(.75)); }
  else off = n.clone().multiplyScalar(b.r*(b.r < .3 ? 2.6 : 2.0));
  startFly(out => worldPos(b, out), off, 1400);
  document.querySelectorAll(".feat").forEach(el => el.classList.toggle("sel", +el.dataset.i === i));
  pinEls.forEach(p => p.el.classList.toggle("sel", p.i === i));
  const el = document.querySelector(`.feat[data-i="${i}"]`);
  if (el){ if (MOB.on) MOB.peekAt(el); else el.scrollIntoView({block:"nearest", behavior:"smooth"}); }
}
function loadHi(b){
  if (b.hiLoaded) return; b.hiLoaded = true;
  if (b.minor) return;
  if (b.kind === "star"){ if (HI_SET.has("sun")) tex("sun", true).then(t => { if (t) sunUniforms.map.value = t; }); return; }
  if (b.earth){ tex("earth", true).then(t => { if (t) b.mat.uniforms.day.value = t; }); tex("earth_night", true).then(t => { if (t) b.mat.uniforms.night.value = t; });
    tex("earth_clouds", true, true).then(t => { if (t){ b.clouds.material.alphaMap = t; b.clouds.material.needsUpdate = true; } }); return; }
  const big = b.id === "jupiter" && !COARSE && renderer.capabilities.maxTextureSize >= 8192 && Math.min(screen.width, screen.height) >= 700;
  if (b.tex && HI_SET.has(b.tex)) tex(big ? "jupiter8k" : b.tex, true).then(t => { if (t){ b.mat.map = t; b.mat.needsUpdate = true; } else if (big) tex(b.tex, true).then(t2 => { if (t2){ b.mat.map = t2; b.mat.needsUpdate = true; } }); });
  if (b.normal && HI_SET.has(b.normal+"_normal")) tex(b.normal+"_normal", true, true).then(t => { if (t){ b.mat.normalMap = t; b.mat.normalScale = new THREE.Vector2(.9,.9); b.mat.needsUpdate = true; } });
  if (b.veil && HI_SET.has(b.veil.tex)) tex(b.veil.tex, true).then(t => { if (t){ b.veilMesh.material.map = t; b.veilMesh.material.needsUpdate = true; } });
}
function updateMoonVisibility(){
  const ctx = focus && !focus.range ? (focus.parent ? byId[focus.parent] : focus) : null;
  BODIES.forEach(b => { if (b.parent && b.orbitLine){ b.orbitLine.visible = !!(showOrbits && ctx && byId[b.parent] === ctx); if (b.minor) b.orbitLine.material.opacity = focus === b ? .5 : .05; } });
  BODIES.forEach(b => { if (b.minor || (b.kind === "craft" && b.parent)) b.orbitNode.visible = !!ctx && (byId[b.parent] === ctx); });
  BODIES.forEach(b => { if (b.swarm) b.swarm.visible = !!ctx && ctx === b; });
  orbitLines.forEach(l => l.visible = showOrbits);
  BODIES.forEach(b => { if (!b.parent && b.orbitLine){ b.orbitLine.material.opacity = (focus === b ? Math.min(.75, b.orbitLine.userData.base*2.4) : b.orbitLine.userData.base); } });
}

/* ---------------- cutaway ---------------- */
function addCutaway(b){
  if (b.cut) return;
  const layers = INTERIOR[b.interior]; if (!layers) return;
  b.frozen = true;
  const g = new THREE.Group(); g.scale.copy(b.mesh.scale);
  if (b.contact) g.scale.set(b.r*b.axes[0]*.75, b.r*b.axes[1]*1.3, b.r*b.axes[2]*.8);
  else if (b.lumpy) g.scale.set(b.r*b.axes[0], b.r*b.axes[1], b.r*b.axes[2]);
  const loc = b.spin.worldToLocal(camera.position.clone());
  const phiC = Math.atan2(loc.z, -loc.x), W = Math.PI/2;
  // remove the upper octant facing the viewer: the lower hemisphere stays whole
  const lower = new THREE.SphereGeometry(1, 128, 32, 0, TAU, Math.PI/2, Math.PI/2); remapUV(lower, 0, TAU, Math.PI/2, Math.PI/2);
  const upper = new THREE.SphereGeometry(1, 128, 32, phiC + W/2, TAU - W, 0, Math.PI/2); remapUV(upper, phiC + W/2, TAU - W, 0, Math.PI/2);
  const shellMesh = new THREE.Mesh(lower, b.mat), shellUp = new THREE.Mesh(upper, b.mat);
  shellMesh.userData.body = b; shellUp.userData.body = b; g.add(shellMesh, shellUp); pickables.push(shellMesh, shellUp);
  const cm = cutMat(layers, 1);
  [phiC - W/2, phiC + W/2].forEach(phi => {
    const f = new THREE.Mesh(new THREE.RingGeometry(.0005, 1, 96, 1, 0, Math.PI/2), cm);
    f.rotation.y = Math.PI + phi; g.add(f);
  });
  const floor = new THREE.Mesh(new THREE.RingGeometry(.0005, 1, 96, 1, Math.PI + phiC - W/2, W), cm);
  floor.rotation.x = -Math.PI/2; g.add(floor);
  b.spin.add(g);
  b.cut = {group:g, shells:[shellMesh, shellUp], mat:cm, phi1: phiC - W/2, phiC, layers};
  b.mesh.visible = false;
  if (b.clouds) b.clouds.visible = false;
  if (b.veilMesh) b.veilMesh.visible = false;
  if (b.atmoMesh) b.atmoMesh.visible = false;
  // numbered layer markers
  layerEls.forEach(l => l.el.remove()); layerEls = [];
  const n = layers.length;
  layers.forEach((l, i) => {
    const inner = i ? layers[i-1][1] : 0, outer = l[1];
    const rm = i ? (inner + outer)/2 : outer*.45;
    const eps = (n === 1 ? 45 : 72 - i*(56/(n-1)))*DEG;
    const el = document.createElement("div"); el.className = "lay"; el.textContent = i+1;
    el.addEventListener("pointerenter", () => hotLayer(i, true)); el.addEventListener("pointerleave", () => hotLayer(i, false));
    el.addEventListener("click", e => { e.stopPropagation(); if (typeof HUD !== "undefined") HUD.pin(i); });
    labelsEl.appendChild(el);
    const d = new THREE.Vector3(-Math.cos(b.cut.phi1), 0, Math.sin(b.cut.phi1));
    const local = d.multiplyScalar(Math.cos(eps)*rm).add(new THREE.Vector3(0, Math.sin(eps)*rm, 0));
    layerEls.push({el, local});
  });
  // swing the camera so it looks down into the opening
  const look = new THREE.Vector3(-Math.cos(phiC)*Math.cos(32*DEG), Math.sin(32*DEG), Math.sin(phiC)*Math.cos(32*DEG));
  look.applyQuaternion(b.spin.getWorldQuaternion(new THREE.Quaternion()));
  const len = camera.position.distanceTo(worldPos(b, new THREE.Vector3()));
  startFly(out => worldPos(b, out), look.multiplyScalar(Math.max(Math.min(len, b.r*5), b.r*3.3*fitK(.5))), 1100);
}
function removeCutaway(b){
  if (!b.cut) return;
  b.spin.remove(b.cut.group);
  b.cut.shells.forEach(m => { const i = pickables.indexOf(m); if (i >= 0) pickables.splice(i,1); });
  b.cut.group.traverse(o => { if (o.geometry) o.geometry.dispose(); });
  b.cut.mat.dispose(); b.cut = null; b.frozen = false;
  b.mesh.visible = true;
  if (b.clouds) b.clouds.visible = true;
  if (b.veilMesh) b.veilMesh.visible = !b.veilOff;
  if (b.atmoMesh) b.atmoMesh.visible = true;
  layerEls.forEach(l => l.el.remove()); layerEls = [];
}
function hotLayer(i, on){
  if (typeof HUD !== "undefined") HUD.hot(i, on);
  if (focus && focus.cut) focus.cut.mat.uniforms.hl.value = on ? i : -1;
  layerEls.forEach((l, k) => l.el.classList.toggle("hot", on && k === i));
  document.querySelectorAll(".layers li").forEach((li, k) => li.classList.toggle("hot", on && k === i));
}

/* ============================================================
   UI: index, dossier, crumbs, time rail
   ============================================================ */
function swatch(b){
  if (b.range) return `<span class="sw reg"></span>`;
  if (b.kind === "hypo") return `<span class="sw hyp"></span>`;
  const c = b.tint || TEX_AVG[b.tex] || "#888";
  return `<span class="sw" style="background:${b.kind==="star"?"#f2a640":c}"></span>`;
}
const GROUPS = [
  ["Our star", ["sun"]],
  ["Inner planets", ["mercury","venus","earth","mars"]],
  ["Near-Earth asteroids", ["bennu","ryugu","itokawa","eros","apophis","didymos","2024yr4","kamooalewa"]],
  ["Asteroid belt", ["belt","ceres","vesta","pallas","hygiea","psyche","juno-3","interamnia","davida","europa-52","lutetia","ida","mathilde","gaspra","steins","donaldjohanson"]],
  ["Giant planets", ["jupiter","saturn","uranus","neptune"]],
  ["Trojans & centaurs", ["patroclus","eurybates","hektor","chiron","chariklo"]],
  ["Beyond Neptune", ["kuiper","pluto","arrokoth","orcus","ixion","varuna","haumea","quaoar","salacia","makemake","gonggong","eris","sedna","2012vp113","leleakuhonua","farout","farfarout"]],
  ["Comets", ["halley","67p","tempel1","wild2","hartley2","encke","swift-tuttle","tempel-tuttle","hale-bopp","tsuchinshan-atlas"]],
  ["Interstellar visitors", ["oumuamua","borisov","3i-atlas"]],
  ["Spacecraft", BODIES.filter(b => b.kind === "craft").map(b => b.id)],
  ["The outer edge", ["helio","oort","ninth"]]
];
const expanded = new Set();
function renderIndex(){
  let h = "";
  GROUPS.forEach(([title, ids]) => {
    h += `<div class="grp">${title}</div>`;
    const fold = title === "Spacecraft" && !expanded.has("__craft") && !(focus && focus.kind === "craft");
    if (title === "Spacecraft") h += `<button class="mtog" data-tog="__craft" style="margin-left:6px">${fold ? `Show ${ids.length} spacecraft` : "Hide spacecraft"}</button>`;
    if (fold) return;
    ids.forEach(id => {
      const it = byId[id] || REG[id]; if (!it) return;
      const n = it.moons && it.moons.length ? (MOON_TOTALS[id] || it.moons.length) : "";
      const main = it.moons ? it.moons.filter(m => !m.minor || m === focus) : [];
      h += `<button class="row${focus===it?" sel":""}" data-id="${id}">${swatch(it)}<span>${esc(it.name)}</span>${n?`<span class="n">${n} moon${n>1?"s":""}</span>`:""}</button>`;
      if (main.length){
        const open = expanded.has(id) || main.length <= 2;
        if (open) main.forEach(m => { h += `<button class="row moon${focus===m?" sel":""}" data-id="${m.id}">${swatch(m)}<span>${esc(m.name)}</span></button>`; });
        const extra = it.moons.length - main.length;
        if (open && extra) h += `<button class="mtog" data-go="${id}">+ ${extra} small moons, listed in ${esc(it.name)}'s panel</button>`;
        if (main.length > 2) h += `<button class="mtog" data-tog="${id}">${open ? "Hide moons" : `Show main moons (${main.length})`}</button>`;
      }
    });
  });
  $("#indexList").innerHTML = h;
}
$("#indexList").addEventListener("click", e => {
  const g = e.target.closest("[data-go]"); if (g){ select(g.dataset.go); setTimeout(() => { const d = document.querySelector("#dossierBody .sect.msect"); if (d) d.scrollIntoView({block:"start", behavior:"smooth"}); }, 60); return; }
  const t = e.target.closest("[data-tog]");
  if (t){ const id = t.dataset.tog; expanded.has(id) ? expanded.delete(id) : expanded.add(id); renderIndex(); return; }
  const r = e.target.closest(".row"); if (r) select(r.dataset.id);
});
$("#indexList").addEventListener("pointerover", e => { const r = e.target.closest(".row"); if (r) setHot(r.dataset.id, true); });
$("#indexList").addEventListener("pointerout", e => { const r = e.target.closest(".row"); if (r) setHot(r.dataset.id, false); });
function markIndex(id){
  if (id){ const it = byId[id]; const host = it && it.parent ? it.parent : id; if (byId[host] && byId[host].moons.length > 2) expanded.add(host); }
  renderIndex();
  const el = document.querySelector(`.row[data-id="${id}"]`); if (el) el.scrollIntoView({block:"nearest"});
}
function renderCrumbs(it){
  const c = $("#crumbs");
  if (!it){ c.innerHTML = ""; return; }
  let h = `<button data-home>Solar System</button><span>/</span>`;
  if (it.parent){ const p = byId[it.parent]; h += `<button data-id="${p.id}">${esc(p.name)}</button><span>/</span>`; }
  h += `<b>${esc(it.name)}</b>`;
  c.innerHTML = h;
}
$("#crumbs").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; if (b.dataset.home !== undefined) goHome(); else select(b.dataset.id); });

function factsHTML(f){ return `<dl class="facts">${Object.entries(f).map(([k,v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`; }
function renderDossier(it){
  const d = $("#dossier"); d.hidden = false;
  let h = `<button class="sheet-handle" type="button" aria-label="Show or hide details" aria-expanded="${document.body.classList.contains("sheet-open")}"><i></i></button><p class="eyebrow">${esc(kindLine(it))}</p><h2>${esc(it.name)}</h2>`;
  if (it.parent) h += `<button class="parentlink" data-go="${it.parent}">← Orbits ${esc(byId[it.parent].name)}</button>`;
  if (it.kind === "hypo") h += `<span class="hypotag">Not yet observed</span>`;
  if (!it.range && it.kind !== "craft"){
    const hasInt = !!INTERIOR[it.interior];
    h += `<div class="seg" role="group" aria-label="View"><button data-view="surface" aria-pressed="${!it.cut}">Surface</button>${hasInt?`<button data-view="cut" aria-pressed="${!!it.cut}">Cutaway</button>`:""}</div>`;
    if (it.kind === "star" && !it.cut) h += `<div class="seg" role="group" aria-label="Colour"><button data-sunf="0" aria-pressed="${!FX.sunFilt}">True colour</button><button data-sunf="1" aria-pressed="${!!FX.sunFilt}">Filtered (SDO)</button></div>`;
    if (it.veil && !it.cut) h += `<div class="seg" role="group" aria-label="Atmosphere"><button data-veil="on" aria-pressed="${!it.veilOff}">${esc(it.veil.label)}</button><button data-veil="off" aria-pressed="${!!it.veilOff}">${esc(it.veil.alt)}</button></div>`;
  }
  h += `<p class="blurb">${esc(it.blurb)}</p>`;
  if (it.id === "halley") h += `<button class="btn" data-jump="1986.11">Jump to Feb 1986 perihelion</button><button class="btn" data-jump="2061.57">Jump to Jul 2061 return</button><button class="btn" data-jump="now">Back to today</button>`;
  if (it.cut){
    const L = it.cut.layers;
    h += `<div class="sect">Inside ${esc(it.name)}</div><ol class="layers">${L.map((l,i) => {
      const inner = i ? L[i-1][1] : 0, thick = (l[1]-inner)*it.R;
      const meta = i ? `About ${fmt(thick)} km thick` : `Radius about ${fmt(l[1]*it.R)} km`;
      return `<li data-l="${i}"><span class="num">${i+1}</span><span class="lc" style="background:${l[2]}"></span><span class="ln">${esc(l[0])}</span><span class="lk">${meta}</span><span class="ld">${esc(l[3])}</span></li>`; }).join("")}</ol>`;
    if (["comet","rubble","icyMixed"].includes(it.interior) || it.kind === "hypo") h += `<p class="note">${it.kind==="hypo" ? "Every layer here is a prediction." : "Small bodies like this are rarely layered; the cutaway shows their bulk makeup."}</p>`;
  }
  h += `<div class="sect">Key facts</div>${factsHTML(it.facts)}`;
  if (!it.range && !it.parent && it.a) h += `<dl class="facts" style="margin-top:6px"><dt>Distance now</dt><dd id="liveDist">—</dd></dl>`;
  const featHTML = (f, i) => `<button class="feat${f.craft ? " cr" : ""}" data-i="${i}"><span class="fn"><span class="pin"></span>${esc(f.n)}<span class="go">Zoom in</span></span><p class="fd">${esc(f.d)}</p></button>`;
  const crSites = (it.features || []).map((f, i) => [f, i]).filter(([f]) => f.craft);
  if (it.features && it.features.length > crSites.length){
    h += `<div class="sect">${it.range ? "Look for" : "Landmarks"}</div>`;
    h += it.features.map((f,i) => f.craft ? "" : it.range
      ? `<div class="feat static"><span class="fn">${esc(f.n)}</span><p class="fd">${esc(f.d)}</p></div>`
      : featHTML(f, i)).join("");
  }
  if (crSites.length) h += `<div class="sect">Spacecraft on the surface · ${crSites.length}</div>` + crSites.map(([f, i]) => featHTML(f, i)).join("");
  if (it.craft && it.craft.length) h += `<div class="sect">Spacecraft in orbit · ${it.craft.length}</div><div class="moons">${it.craft.map(m => `<button data-go="${m.id}">${esc(m.name)}</button>`).join("")}</div>`;
  if (it.id === "earth"){ const lp = BODIES.filter(b => b.lp); if (lp.length) h += `<div class="sect">At the Lagrange points</div><div class="moons">${lp.map(m => `<button data-go="${m.id}">${esc(m.name)} · ${m.lp}</button>`).join("")}</div>`; }
  if (it.moons && it.moons.length){
    const total = MOON_TOTALS[it.id] || it.moons.length;
    const main = it.moons.filter(m => !m.minor), minor = it.moons.filter(m => m.minor);
    h += `<div class="sect msect">Moons · ${total}</div><div class="moons">${main.map(m => `<button data-go="${m.id}">${esc(m.name)}</button>`).join("")}</div>`;
    if (minor.length){
      const groups = {}; minor.forEach(m => (groups[m.group] = groups[m.group] || []).push(m));
      h += `<p class="note">Every other known moon is listed below and orbits in the view as a small body. Most are a few kilometres across.</p>`;
      h += Object.entries(groups).map(([g, ms]) => `<details class="mgrp"><summary>${esc(g)}${/group|moonlet|arc|trojan|Alkyonides/i.test(g) ? "" : " group"} <span>${ms.length}</span></summary><div class="moons sm">${ms.map(m => `<button data-go="${m.id}">${esc(m.name)}</button>`).join("")}</div></details>`).join("");
    }
    if (it.swarmCount) h += `<p class="note">The ${it.swarmCount} other known moons are small captured bodies, most only a few km across and many still unnamed. They appear as the faint swarm of points around ${esc(it.name)}.</p>`;
  }
  if (it.id === "kuiper") h += `<div class="sect">Worlds here</div><div class="moons">${["pluto","arrokoth","orcus","haumea","quaoar","makemake","gonggong","eris"].map(id => `<button data-go="${id}">${esc(byId[id].name)}</button>`).join("")}</div>`;
  if (it.id === "belt") h += `<div class="sect">Worlds here</div><div class="moons">${["ceres","vesta","pallas","hygiea"].map(id => `<button data-go="${id}">${esc(byId[id].name)}</button>`).join("")}</div>`;
  if (it.id === "oort") h += `<div class="sect">Related</div><div class="moons">${["sedna","ninth","halley"].map(id => `<button data-go="${id}">${esc(byId[id].name)}</button>`).join("")}</div>`;
  $("#dossierBody").innerHTML = h;
  $("#dossierBody").scrollTop = 0;
  if (typeof HUD !== "undefined") HUD.reset();
}
$("#dossierBody").addEventListener("click", e => {
  const go = e.target.closest("[data-go]"); if (go){ select(go.dataset.go); return; }
  const v = e.target.closest("[data-view]");
  if (v && focus && !focus.range){
    if (v.dataset.view === "cut") addCutaway(focus); else { removeCutaway(focus); }
    renderDossier(focus); return;
  }
  const vl = e.target.closest("[data-veil]");
  if (vl && focus && focus.veilMesh){ focus.veilOff = vl.dataset.veil === "off"; focus.veilMesh.visible = !focus.veilOff; renderDossier(focus); return; }
  const j = e.target.closest("[data-jump]");
  if (j){ if (j.dataset.jump === "now") T = (Date.now()-J2000)/86400000; else T = (parseFloat(j.dataset.jump) - 2000)*365.25; setSpeed(1);
    if (focus && !focus.range && !focus.parent && focus.a){ helioAU(focus, T, au); focus.orbitNode.position.copy(toDisplay(au)); lastFocusPos.copy(focus.orbitNode.position); select(focus.id); } return; }
  const f = e.target.closest(".feat[data-i]"); if (f && focus && !focus.range) selectFeature(focus, +f.dataset.i);
});
$("#dossierBody").addEventListener("pointerover", e => { const li = e.target.closest(".layers li"); if (li) hotLayer(+li.dataset.l, true); });
$("#dossierBody").addEventListener("click", e => { const li = e.target.closest(".layers li"); if (li && typeof HUD !== "undefined") HUD.pin(+li.dataset.l); });
$("#dossierBody").addEventListener("pointerout", e => { const li = e.target.closest(".layers li"); if (li) hotLayer(+li.dataset.l, false); });
$("#closeDossier").addEventListener("click", () => { $("#dossier").hidden = true; });

const SPEEDS = [["Real time",1/86400],["1 hr/s",1/24],["1 day/s",1],["1 wk/s",7],["1 mo/s",30.44],["1 yr/s",365.25],["10 yr/s",3652.5]];
$("#speeds").innerHTML = SPEEDS.map(([l,v],i) => `<button data-s="${i}" aria-pressed="${v===1}">${l}</button>`).join("");
function setSpeed(v){ speed = v; document.querySelectorAll("#speeds button").forEach(b => b.setAttribute("aria-pressed", SPEEDS[+b.dataset.s][1] === v)); if (!playing) togglePlay(); }
$("#speeds").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setSpeed(SPEEDS[+b.dataset.s][1]); });
function togglePlay(){ playing = !playing; $("#playIco").setAttribute("d", playing ? "M3 2h3v10H3zM8 2h3v10H8z" : "M3 1.5l9 5.5-9 5.5z"); $("#play").setAttribute("aria-label", playing ? "Pause time" : "Play time"); }
$("#play").addEventListener("click", togglePlay);
$("#todayBtn").addEventListener("click", () => { T = (Date.now()-J2000)/86400000; });
$("#homeBtn").addEventListener("click", goHome);
function toggle(btn, fn){ btn.addEventListener("click", () => { const on = btn.getAttribute("aria-pressed") !== "true"; btn.setAttribute("aria-pressed", on); fn(on); }); }
const ORBIT_LINES_EXTRA = [];   // orbit lines in the star, galaxy and deep-time scenes
function setOrbits(on){
  showOrbits = on; updateMoonVisibility();
  ORBIT_LINES_EXTRA.forEach(l => l.visible = on);
  document.querySelectorAll("[data-orbits]").forEach(b => b.setAttribute("aria-pressed", on));
}
$("#tOrbits").setAttribute("data-orbits", "");
$("#tOrbits").addEventListener("click", () => setOrbits(!showOrbits));
{ const b = document.createElement("button"); b.className = "chip orb"; b.id = "railOrbits"; b.setAttribute("data-orbits", ""); b.setAttribute("aria-pressed", "true"); b.title = "Show or hide orbit lines (O)";
  b.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><ellipse cx="7" cy="7" rx="6" ry="3.2" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="7" cy="7" r="1.6" fill="currentColor"/></svg><span>Orbits</span>`;
  b.addEventListener("click", () => setOrbits(!showOrbits)); $("#todayBtn").after(b); }
window.addEventListener("keydown", e => { if ((e.key === "o" || e.key === "O") && !(e.target.closest && e.target.closest("input,textarea"))) setOrbits(!showOrbits); });
toggle($("#tLabels"), on => { showLabels = on; });
toggle($("#tBelts"), on => { showBelts = on; beltGroup.visible = on; });
$("#idxBtn").addEventListener("click", () => { const o = $("#index").classList.toggle("open"); $("#idxBtn").setAttribute("aria-expanded", o); });
window.addEventListener("keydown", e => {
  if (e.target.closest && e.target.closest("input,textarea")) return;
  if (e.key === "Escape"){ if (focus && focus.parent) select(focus.parent); else goHome(); }
  if (e.key === " " && e.target === canvas){ e.preventDefault(); togglePlay(); }
});

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function dateText(){
  const d = new Date(J2000 + T*86400000);
  const yr = d.getUTCFullYear();
  let s = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${yr}`;
  if (speed < 1) s += ` · ${String(d.getUTCHours()).padStart(2,"0")}:${String(d.getUTCMinutes()).padStart(2,"0")} UTC`;
  return s;
}

/* ============================================================
   FRAME LOOP
   ============================================================ */
function resize(){
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w/h;
  // on phones, centre the view in the strip between the header and the sheet
  const sh = MOB.on ? MOB.shift() : 0;
  if (sh) camera.setViewOffset(w, h, 0, sh, w, h); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
  const px = h/(2*Math.tan(camera.fov*DEG/2))*renderer.getPixelRatio();
  pointMats.forEach(m => m.uniforms.px.value = px); swarms.forEach(s => s.material.uniforms.px.value = px); tail.m.uniforms.px.value = px;
}
window.addEventListener("resize", resize); resize();

const clock = new THREE.Clock();
let dateTick = 0;
const v3 = new THREE.Vector3(), au = new THREE.Vector3();
function frame(){
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), .1);
  const dDays = playing ? dt*speed : 0;
  T += dDays;
  sunUniforms.time.value += dt;
  if (DEEP.on && DEEP.frame){ DEEP.frame(dt); return; }
  if (SCALE.mode !== "system" && SCALE.frame){ SCALE.frame(dt); return; }

  // heliocentric positions
  BODIES.forEach(b => {
    if (!b.parent && (b.a || b.hyp)){ helioAU(b, T, au); b.au = au.length(); b.orbitNode.position.copy(toDisplay(au)); }
    else if (b.esc){ const r = b.esc[2] + b.esc[3]*(T - T0)/365.25; au.copy(eclDir(b.esc[0], b.esc[1])).multiplyScalar(Math.max(r, .5)); b.au = au.length(); b.orbitNode.position.copy(toDisplay(au)); }
    else if (b.fixed){ au.copy(eclDir(b.fixed[0], b.fixed[1])).multiplyScalar(b.fixed[2]); b.au = au.length(); b.orbitNode.position.copy(toDisplay(au)); }
  });
  // Lagrange-point craft ride along with Earth, 1.5 million km sunward (L1) or anti-sunward (L2)
  { const ep = byId.earth.orbitNode.position, d = moonDist(byId.earth, 1.5e6);
    BODIES.forEach(b => { if (b.lp){ b.orbitNode.position.copy(ep).addScaledVector(tmpV.copy(ep).normalize(), b.lp === "L1" ? -d : d); b.au = byId.earth.au; } }); }
  // moons
  BODIES.forEach(b => {
    if (!b.parent) return;
    let dth = b.featFreeze ? 0 : TAU*dDays/Math.abs(b.P)*b.dir;
    const lim = 1.4*dt; if (Math.abs(dth) > lim) dth = Math.sign(dth)*lim;
    if (b.phase !== undefined){ const lead = byId[b.parent].moons.find(m => m.a === b.a && m.phase === undefined); if (lead){ b.theta = lead.theta + b.phase*DEG; } }
    else b.theta += dth;
    if (!(b.minor || b.kind === "craft") || b.orbitNode.visible) moonLocal(b, b.theta, b.orbitNode.position);
    if (b.rot === "sync" && !b.frozen){ b.spin.rotation.y = b.theta + Math.PI + (b.e ? 0 : 0); }
  });
  // spin
  BODIES.forEach(b => {
    if (b.frozen || b.featFreeze || b.rot === "sync" || !b.rot) return;
    const rh = (b.tilt||0) > 90 ? Math.abs(b.rot) : b.rot;
    let da = TAU*dDays*24/rh; const lim = .5*dt; if (Math.abs(da) > lim) da = Math.sign(da)*lim;
    b.spin.rotation.y += da;
    if (b.clouds) b.clouds.rotation.y += da*.08;
  });
  // Jupiter Trojans follow Jupiter
  const jp = byId.jupiter.orbitNode.position; const jupAng = Math.atan2(-jp.z, jp.x);
  pointMats.forEach(m => { m.uniforms.time.value = T; m.uniforms.jup.value = jupAng; });
  if (window.__oort) window.__oort.rotation.y += dt*.002;
  if (window.__stars) window.__stars.position.copy(camera.position);
  { const sd = camera.position.length(); byId.sun.halo.material.opacity = Math.min(1, Math.max(0, (sd - SUN_R*2.5)/(SUN_R*14))); }
  swarms.forEach(s => { if (s.visible) s.rotation.y += dt*.01; });

  // auroras: faint whenever you are at the planet, full strength when the landmark is picked
  BODIES.forEach(b => { if (!b.auroraMeshes) return;
    const picked = focus === b && selFeature !== null && b.features[selFeature] && b.features[selFeature].aur;
    const tgt = b.cut ? 0 : picked ? 1 : (focus === b ? .2 : 0);
    b.aurK += (tgt - b.aurK)*Math.min(1, dt*2.5);
    b.auroraMeshes.forEach(m => { m.material.uniforms.k.value = b.aurK; m.visible = b.aurK > .003; }); });

  FX_HOOKS.forEach(f => f(dt));

  // rings: planet shadow
  BODIES.forEach(b => { if (b.ringMesh){ worldPos(b, b.ringMesh.material.uniforms.pc.value); b.ringMesh.material.uniforms.pr.value = b.r*(b.shape?b.axes[0]:1); } });

  // comet tails
  const h = byId.halley, hp = h.orbitNode.position;
  if (h.au < 9){
    const L = 46*Math.min(1.5, 1.6/Math.max(h.au,.5)) * Math.min(1, (9-h.au)/3);
    tail.m.uniforms.L.value = L; tail.m.uniforms.cp.value.copy(hp); tail.m.uniforms.as.value.copy(hp).normalize();
    helioAU(h, T+1, v3); toDisplay(v3); tail.m.uniforms.vel.value.copy(v3.sub(hp)).normalize();
    tail.pts.visible = true; tail.coma.visible = true; tail.coma.position.copy(hp);
    const cs = L*.16 + h.r*6, cd = camera.position.distanceTo(hp);
    tail.coma.scale.setScalar(cs); tail.coma.material.opacity = Math.max(0, Math.min(.9, (cd - cs*.5)/cs));
  } else { tail.pts.visible = false; tail.coma.visible = false; }

  // camera: follow focus and fly
  if (fly){
    const k = easeInOut(Math.min(1, (performance.now()-fly.t0)/fly.dur));
    const tgt = fly.toTargetFn(new THREE.Vector3());
    controls.target.copy(fly.fromT).lerp(tgt, k);
    const off = fly.fromO.clone().lerp(fly.endOffset, k);
    const len = Math.exp(Math.log(fly.fromO.length())*(1-k) + Math.log(fly.endOffset.length())*k);
    camera.position.copy(controls.target).add(off.setLength(len));
    if (k >= 1){ fly = null; }
    if (focus && !focus.range) worldPos(focus, lastFocusPos);
  } else if (focus && !focus.range){
    const p = worldPos(focus, new THREE.Vector3());
    const delta = p.clone().sub(lastFocusPos);
    camera.position.add(delta); controls.target.add(delta); lastFocusPos.copy(p);
  }
  controls.update();

  if (!(SCALE.renderSys && SCALE.renderSys(dt))) renderer.render(scene, camera);
  if (SCALE.mode === "system") updateLabels();
  if (SCALE.check) SCALE.check();

  if ((dateTick += dt) > .25){
    dateTick = 0;
    $("#date").firstChild.nodeValue = dateText();
    const ld = $("#liveDist");
    if (ld && focus && focus.au !== undefined) ld.textContent = `${focus.au.toFixed(focus.au < 10 ? 3 : 1)} AU from the Sun · ${fmt(focus.au*149.6)} million km`;
  }
}

const proj = new THREE.Vector3();
function updateLabels(){
  const W = canvas.clientWidth, H = canvas.clientHeight;
  const camPos = camera.position;
  const tanF = Math.tan(camera.fov*DEG/2);
  const ctx = focus && !focus.range ? (focus.parent ? byId[focus.parent] : focus) : null;
  const placed = [];
  const cands = [];
  const occ = [];
  [byId.sun, focus && !focus.range ? focus : null, ctx].forEach(ob => {
    if (!ob || occ.some(o => o.b === ob)) return;
    const wp = worldPos(ob, new THREE.Vector3()); const d = wp.distanceTo(camPos); wp.project(camera);
    if (wp.z > 1) return;
    occ.push({b:ob, d, x:(wp.x*.5+.5)*W, y:(-wp.y*.5+.5)*H, r:ob.r/(d*tanF)*(H/2)});
  });
  labels.forEach(L => {
    const it = L.item; let show = showLabels;
    if (show && it.kind === "craft"){
      if (it.parent){ const p = byId[it.parent]; show = ctx === p || focus === it; }
      else show = focus === it || hotId === it.id || worldPos(it, tmpV2).distanceTo(camPos) < (it.lp ? 60 : 260);
    }
    if (show && it.kind === "moon"){
      const p = byId[it.parent];
      const dp = worldPos(p, tmpV2).distanceTo(camPos);
      show = (ctx === p) || (it.R > 1000 && dp < p.r*40) || focus === it;
      if (it.minor && focus !== it && hotId !== it.id && dp < p.r*30) show = false;   // small moons label themselves only from afar
    }
    if (show && it.range){ show = !focus || focus.range || !ctx; if (it.id==="oort" && camPos.length() < 2500) show = false; if (it.id==="helio" && camPos.length() < 900) show = false; }
    if (!show){ if (L.vis){ L.el.style.opacity = 0; L.el.style.pointerEvents = "none"; L.vis = false; } return; }
    L.getPos(proj);
    const dist = proj.distanceTo(camPos);
    proj.project(camera);
    if (proj.z > 1 || proj.z < -1 || Math.abs(proj.x) > 1.2 || Math.abs(proj.y) > 1.2){ hide(L); return; }
    const x = (proj.x*.5+.5)*W, y = (-proj.y*.5+.5)*H;
    const rpx = it.r ? it.r/(dist*tanF)*(H/2) : 0;
    // hide a moon that is behind its planet's disc
    if (it.kind === "moon"){
      const p = byId[it.parent]; const pp = worldPos(p, tmpV2); const dpar = pp.distanceTo(camPos);
      if (dist > dpar){ pp.project(camera); const px = (pp.x*.5+.5)*W, py = (-pp.y*.5+.5)*H; const pr = p.r/(dpar*tanF)*(H/2); if (Math.hypot(px-x, py-y) < pr){ hide(L); return; } }
    }
    if (focus === it && rpx > 60){ hide(L); return; }
    for (const oc of occ){ if (oc.b !== it && dist > oc.d && Math.hypot(oc.x-x, oc.y-y) < oc.r){ hide(L); return; } }
    cands.push({L, x, y, rpx, pri: L.priority + (focus===it?1000:0) + (ctx && it.parent===ctx.id ? 40 : 0)});
  });
  cands.sort((a,b) => b.pri - a.pri);
  cands.forEach(c => {
    const L = c.L, big = c.rpx > 3;
    const lx = big ? c.x - L.w/2 : c.x - 5, ly = big ? c.y + c.rpx + 4 : c.y - 9;
    const rect = [lx, ly, lx + L.w, ly + 18];
    if (placed.some(r => rect[0] < r[2] && rect[2] > r[0] && rect[1] < r[3] && rect[3] > r[1])){ hide(L); return; }
    placed.push(rect);
    L.el.classList.toggle("big", big);
    L.el.style.transform = `translate(${lx.toFixed(1)}px,${ly.toFixed(1)}px)`;
    if (!L.vis){ L.el.style.opacity = 1; L.el.style.pointerEvents = "auto"; L.vis = true; }
  });
  // feature pins
  if (focus && !focus.range && pinEls.length){
    const b = focus, n = new THREE.Vector3(), p = new THREE.Vector3();
    const camDist = worldPos(b, tmpV2).distanceTo(camPos);
    const near = camDist < b.r*14;
    pinEls.forEach(pe => {
      featureWorld(b, pe.f, p, n);
      const facing = n.dot(tmpV.copy(camPos).sub(p).normalize());
      const ok = near && !b.cut && facing > (pe.f.ring !== undefined ? -2 : .12);
      if (!ok){ pe.el.style.opacity = 0; pe.el.style.pointerEvents = "none"; return; }
      p.project(camera);
      const x = (p.x*.5+.5)*W, y = (-p.y*.5+.5)*H;
      pe.el.style.transform = `translate(${(x-6).toFixed(1)}px,${(y-8).toFixed(1)}px)`;
      pe.el.style.opacity = 1; pe.el.style.pointerEvents = "auto";
    });
  }
  // cutaway layer numbers
  if (focus && focus.cut){
    layerEls.forEach(l => {
      p2.copy(l.local); focus.cut.group.localToWorld(p2); p2.project(camera);
      l.el.style.transform = `translate(${((p2.x*.5+.5)*W).toFixed(1)}px,${((-p2.y*.5+.5)*H).toFixed(1)}px)`;
    });
  }
  function hide(L){ if (L.vis){ L.el.style.opacity = 0; L.el.style.pointerEvents = "none"; L.vis = false; } }
}
const p2 = new THREE.Vector3();

/* ---------------- phone layout ---------------- */
function mobSync(){
  const B = document.body, m = matchMedia("(max-width:860px), (max-height:520px) and (pointer:coarse)").matches;
  B.classList.toggle("mob", m); B.classList.toggle("land", m && innerHeight <= 520 && innerWidth > innerHeight);
  MOB.on = m; resize();
}
MOB.shift = () => {
  const B = document.body, cs = getComputedStyle(B);
  const px = v => { const t = document.createElement("div"); t.style.cssText = "position:absolute;visibility:hidden;height:" + v; B.appendChild(t); const r = t.offsetHeight; t.remove(); return r; };
  const top = px(cs.getPropertyValue("--hdrH")), rail = px(cs.getPropertyValue("--railH"));
  const sheet = $("#dossier").hidden ? 0 : px(cs.getPropertyValue("--sheetMin"));
  return Math.round((rail + sheet - top)/2);
};
MOB.setSheet = on => {
  document.body.classList.toggle("sheet-open", on);
  const hd = document.querySelector(".sheet-handle"); if (hd) hd.setAttribute("aria-expanded", on);
  if (!on) $("#dossierBody").scrollTop = 0;
};
MOB.peekAt = el => {
  MOB.setSheet(false);
  const body = $("#dossierBody");
  requestAnimationFrame(() => { body.scrollTop = Math.max(0, el.offsetTop - 26); });
};
(function(){
  const B = document.body, dos = $("#dossier"), body = $("#dossierBody"), ix = $("#index");
  mobSync(); addEventListener("resize", mobSync);
  const closeIdx = () => { ix.classList.remove("open"); B.classList.remove("idx-open"); $("#idxBtn").setAttribute("aria-expanded", "false"); };
  // a new body always arrives as a title strip
  new MutationObserver(() => { if (MOB.on){ MOB.setSheet(false); resize(); } }).observe(dos, {attributes:true, attributeFilter:["hidden"]});
  let lastTitle = "";
  new MutationObserver(() => { const t = body.querySelector("h2"); const k = t ? t.textContent : ""; if (k !== lastTitle){ lastTitle = k; if (MOB.on) MOB.setSheet(false); } }).observe(body, {childList:true});
  // tap the strip (or its handle) to open; tap the handle again to close
  dos.addEventListener("click", e => {
    if (!MOB.on) return;
    if (e.target.closest(".sheet-handle")){ e.stopPropagation(); MOB.setSheet(!B.classList.contains("sheet-open")); return; }
    if (!B.classList.contains("sheet-open") && !e.target.closest("#closeDossier,[data-view],[data-veil]")){ e.stopPropagation(); e.preventDefault(); MOB.setSheet(true); }
  }, true);
  // swipe up / down on the sheet
  let ty = null;
  dos.addEventListener("touchstart", e => { ty = (body.scrollTop <= 0 || !B.classList.contains("sheet-open") || e.target.closest(".sheet-handle")) ? e.touches[0].clientY : null; }, {passive:true});
  dos.addEventListener("touchend", e => { if (ty == null || !MOB.on) return; const dy = e.changedTouches[0].clientY - ty; ty = null;
    if (dy > 50 && B.classList.contains("sheet-open")) MOB.setSheet(false); else if (dy < -40 && !B.classList.contains("sheet-open")) MOB.setSheet(true); }, {passive:true});
  // cutaway: keep the view clear and show the legend's first rows in the strip
  body.addEventListener("click", e => { if (!MOB.on) return; const v = e.target.closest("[data-view]");
    if (v) setTimeout(() => { const sct = body.querySelector(".layers"); if (sct && v.dataset.view === "cut") MOB.peekAt(sct.previousElementSibling); else MOB.setSheet(false); }, 30); });
  // touching the 3D view tucks everything away
  canvas.addEventListener("pointerdown", () => { if (MOB.on){ closeIdx(); if (B.classList.contains("sheet-open")) MOB.setSheet(false); } });
  $("#idxBtn").addEventListener("click", () => { B.classList.toggle("idx-open", ix.classList.contains("open")); if (ix.classList.contains("open")) MOB.setSheet(false); });
  ix.addEventListener("click", e => { if (MOB.on && e.target.closest(".row,[data-go]")) closeIdx(); });
})();

/* ---------------- boot ---------------- */
renderIndex();
manager.onProgress = (url, done, total) => { $("#loadBar").style.width = (done/total*100).toFixed(0) + "%"; };
let booted = false;
function boot(){ if (booted) return; booted = true; $("#loader").classList.add("done"); }
manager.onLoad = boot;
setTimeout(boot, 9000);
updateMoonVisibility();
frame();
const startHash = (location.hash || "").slice(1);
if (startHash && (byId[startHash] || REG[startHash])) setTimeout(() => select(startHash), 400);

/* ============================================================
   EFFECTS: solar activity (loops, prominences, flares, CMEs,
   open field lines), cryovolcanic and volcanic plumes.
   Each landmark with an `fx` tag brings its effect to full
   strength when picked, so you can see what the text describes.
   ============================================================ */
const FX = { sunFilt: 0, list: [] };
const fxPx = () => canvas.clientHeight/(2*Math.tan(camera.fov*DEG/2))*renderer.getPixelRatio();

function slerpDir(a, b, t, out){ return out.copy(a).multiplyScalar(1-t).addScaledVector(b, t).normalize(); }
class ArcCurve extends THREE.Curve {
  constructor(a, b, h, twist){ super(); this.a = a; this.b = b; this.h = h; this.tw = twist || 0; this.side = new THREE.Vector3().crossVectors(a, b).normalize(); }
  getPoint(t, out = new THREE.Vector3()){
    slerpDir(this.a, this.b, t, out);
    const s = Math.sin(Math.PI*t);
    out.multiplyScalar(1 + this.h*s).addScaledVector(this.side, this.tw*s*s);
    return out;
  }
}
function tubeMat(col, opts){
  opts = opts || {};
  return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
    uniforms:{ time:sunUniforms.time, k:{value:0}, col:{value:new THREE.Color(col)}, ph:{value:Math.random()*10}, clump:{value:opts.clump||0}, flash:{value:0} },
    vertexShader:`varying vec2 vUv;varying vec3 vN;varying vec3 vV;varying vec3 vP;${LOGDEPTH_V}
      void main(){vUv=uv;vP=position;vec4 w=modelMatrix*vec4(position,1.);vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;${LOGDEPTH_VM}}`,
    fragmentShader:`uniform float time;uniform float k;uniform vec3 col;uniform float ph;uniform float clump;uniform float flash;varying vec2 vUv;varying vec3 vN;varying vec3 vV;varying vec3 vP;${GLSL_NOISE}${LOGDEPTH_F}
      void main(){${LOGDEPTH_FM}
        float core=pow(abs(dot(normalize(vN),vV)),1.6);
        float along=vUv.x;
        float ends=smoothstep(0.,.06,along)*smoothstep(1.,.94,along);
        float flow=.65+.35*sin(along*38.-time*2.4+ph);
        float n=snoise(vec3(along*14.+ph,vUv.y*3.,time*.25))*.5+.5;
        float cl=mix(1.,smoothstep(.35,.85,snoise(vP*9.+vec3(0.,time*.08,ph))*.5+.5)*1.6,clump);
        float i=core*ends*flow*(.6+.6*n)*cl*k*(1.+flash*3.);
        gl_FragColor=vec4(col*i,1.);}`
  });
}
function fxPoints(n, attrs, vsBody, col, size, opts){
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n*3), 3));
  Object.entries(attrs).forEach(([k, arr]) => g.setAttribute(k, new THREE.Float32BufferAttribute(arr, arr.length/n)));
  const m = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{ time:{value:0}, k:{value:0}, px:{value:600}, col:{value:new THREE.Color(col)}, size:{value:size}, tex:{value:DOT_TEX}, ...(opts && opts.uniforms || {}) },
    vertexShader:`${Object.keys(attrs).map(k => `attribute ${({1:"float",2:"vec2",3:"vec3",4:"vec4"})[attrs[k].length/n]} ${k};`).join("")}
      uniform float time;uniform float k;uniform float px;uniform float size;${opts && opts.decl || ""}varying float vA;${LOGDEPTH_V}
      void main(){ vec3 p; float a=1.; ${vsBody}
        vec4 mv=modelViewMatrix*vec4(p,1.); float s=size*px/(-mv.z); gl_PointSize=clamp(s,1.,28.); vA=a*k*min(1.,s/1.5);
        gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
    fragmentShader:`uniform sampler2D tex;uniform vec3 col;varying float vA;${LOGDEPTH_F}
      void main(){${LOGDEPTH_FM}float t=texture2D(tex,gl_PointCoord).a;gl_FragColor=vec4(col*t*vA,1.);}`
  });
  const pts = new THREE.Points(g, m); pts.frustumCulled = false; return pts;
}

/* ---------------- the Sun ---------------- */
(function(){
  const sun = byId.sun, R = sun.r, rnd = rng(77);
  const grp = new THREE.Group(); grp.scale.setScalar(R); sun.spin.add(grp);
  const ll = (la, lo) => llDir(la, lo);
  const fx = {}; FX.sun = fx;
  const mk = (k) => (fx[k] = { objs:[], k:0, base:0 });

  // coronal loops over the active region at the "Coronal loops" landmark, plus smaller ones over other spot groups
  mk("loops");
  const loopSets = [[-15, 35, 14, 1], [18, -25, 7, .55], [-20, -120, 6, .5]];
  loopSets.forEach(([la, lo, n, sc]) => {
    for (let i=0;i<n;i++){
      const ang = rnd()*Math.PI, sep = (3 + rnd()*7)*sc, off = (rnd()-.5)*5*sc, off2 = (rnd()-.5)*5*sc;
      const a = ll(la + Math.sin(ang)*sep/2 + off2, lo + Math.cos(ang)*sep/2 + off), b = ll(la - Math.sin(ang)*sep/2 + off2, lo - Math.cos(ang)*sep/2 + off);
      const h = (.05 + rnd()*.16)*sc;
      const m = new THREE.Mesh(new THREE.TubeGeometry(new ArcCurve(a, b, h, (rnd()-.5)*.03), 64, .0035 + rnd()*.004, 6, false), tubeMat("#ffd89a"));
      grp.add(m); fx.loops.objs.push(m);
    }
  });
  // a big quiescent prominence on the limb at the "Prominence" landmark, built from twisted strands
  mk("prom");
  for (let i=0;i<7;i++){
    const a = ll(29 + (rnd()-.5)*5, 64 + (rnd()-.5)*5), b = ll(36 + (rnd()-.5)*5, 100 + (rnd()-.5)*5);
    const m = new THREE.Mesh(new THREE.TubeGeometry(new ArcCurve(a, b, .42 + rnd()*.14, (rnd()-.5)*.16), 120, .016 + rnd()*.016, 8, false), tubeMat("#ff5a66", {clump:1}));
    grp.add(m); fx.prom.objs.push(m);
  }
  // smaller prominences around the disc so the limb is never bare
  [[ -40, 150], [55, -150], [-5, 175], [8, -95]].forEach(([la, lo]) => {
    const a = ll(la, lo - 4), b = ll(la + 2, lo + 4);
    const m = new THREE.Mesh(new THREE.TubeGeometry(new ArcCurve(a, b, .08 + rnd()*.06, .02), 48, .008, 6, false), tubeMat("#ff5a66", {clump:1}));
    grp.add(m); fx.prom.objs.push(m);
  });
  // solar flare: post-flare loop arcade and two bright ribbons, flashing on a cycle
  mk("flare"); fx.flare.site = ll(12, -8);
  for (let i=0;i<9;i++){
    const t = i/8, lo = -12 + t*8;
    const m = new THREE.Mesh(new THREE.TubeGeometry(new ArcCurve(ll(10.2, lo), ll(13.8, lo + 1.2), .035 + .015*Math.sin(t*Math.PI), 0), 40, .003, 5, false), tubeMat("#fff3d0"));
    grp.add(m); fx.flare.objs.push(m);
  }
  [[10.2, 0], [13.8, 1.2]].forEach(([la, d]) => {
    const m = new THREE.Mesh(new THREE.TubeGeometry(new ArcCurve(ll(la, -12.5 + d), ll(la, -3.5 + d), .004, 0), 48, .004, 5, false), tubeMat("#ffffff"));
    grp.add(m); fx.flare.objs.push(m);
  });
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex([[0,"rgba(255,255,255,1)"],[.2,"rgba(255,245,220,.6)"],[1,"rgba(0,0,0,0)"]]), blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, opacity:0 }));
  flash.position.copy(fx.flare.site).multiplyScalar(1.03); flash.scale.setScalar(.35); grp.add(flash); fx.flare.flash = flash;
  // coronal mass ejection: a looping expanding shell of plasma from the "CME" landmark
  mk("cme");
  { const n = 5000, dir = [], sp = [], ph = [];
    const c = ll(-20, -120), u = new THREE.Vector3().crossVectors(c, new THREE.Vector3(0,1,0)).normalize(), v = new THREE.Vector3().crossVectors(c, u);
    for (let i=0;i<n;i++){
      const th = Math.acos(1 - rnd()*(1 - Math.cos(.55))), az = rnd()*TAU;
      const shell = rnd() < .65;   // most material in the bright front, the rest in the trailing cavity
      const d = c.clone().multiplyScalar(Math.cos(th)).addScaledVector(u, Math.sin(th)*Math.cos(az)).addScaledVector(v, Math.sin(th)*Math.sin(az));
      dir.push(d.x, d.y, d.z); sp.push(shell ? .9 + rnd()*.15 : .35 + rnd()*.5); ph.push(rnd()*.08);
    }
    const pts = fxPoints(n, {aDir:dir, aSp:sp, aPh:ph}, `float t=fract(time*.09+aPh); float r=1.02+t*3.4*aSp; p=aDir*r; a=(1.-t)*(1.-t)*smoothstep(0.,.05,t)*(aSp>.85?1.:.45);`, "#ffe9c8", .045);
    grp.add(pts); fx.cme.objs.push(pts);
  }
  // open magnetic field lines streaming out of the north polar coronal hole
  mk("hole");
  { const n = 3500, a1 = [], a2 = [];
    for (let i=0;i<n;i++){ const th = rnd()*28*DEG, az = rnd()*TAU; a1.push(th, az); a2.push(rnd(), .6 + rnd()*.6); }
    const pts = fxPoints(n, {aA:a1, aB:a2}, `float t=fract(aB.x+time*.05*aB.y); float r=1.01+t*2.6; float th=aA.x*(1.+t*1.6); p=vec3(sin(th)*cos(aA.y),cos(th),sin(th)*sin(aA.y))*r; a=(1.-t)*smoothstep(0.,.08,t);`, "#bfe0ff", .014);
    grp.add(pts); fx.hole.objs.push(pts);
    for (let i=0;i<22;i++){ const az = i/22*TAU, th0 = (6 + rnd()*20)*DEG, pts2 = [];
      for (let k=0;k<=40;k++){ const t = k/40, r = 1.005 + t*2.4, th = th0*(1 + t*1.6); pts2.push(new THREE.Vector3(Math.sin(th)*Math.cos(az), Math.cos(th), Math.sin(th)*Math.sin(az)).multiplyScalar(r)); }
      const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts2), 40, .0025, 4, false), tubeMat("#a9d4ff")); grp.add(m); fx.hole.objs.push(m); }
  }
  mk("spots"); mk("gran");
  fx.loops.base = .35; fx.prom.base = .55;
  // colour schemes for true colour and filtered views
  const SCHEME = {0:{loops:"#ffe7c2", prom:"#ff5a6e", corona:"#b8ad9e", halo:"#d8d4cc"}, 1:{loops:"#ffc760", prom:"#ff6a2a", corona:"#ffb347", halo:"#ffb060"}};
  FX.userFilt = 0; FX.shown = -1;
  FX.setSunFilt = v => { FX.userFilt = v; FX.sunFilt = v; };
  const applyScheme = v => {
    FX.shown = v; const sc = SCHEME[v];
    document.querySelectorAll("[data-sunf]").forEach(x => x.setAttribute("aria-pressed", +x.dataset.sunf === v));
    fx.loops.objs.forEach(m => m.material.uniforms.col.value.set(sc.loops));
    fx.prom.objs.forEach(m => m.material.uniforms.col.value.set(sc.prom));
    if (sun.corona) sun.corona.material.uniforms.col.value.set(sc.corona);
    if (sun.halo) sun.halo.material.color.set(sc.halo);
  };
  let flareT = 0;
  FX_HOOKS.push(dt => {
    const sel = focus === sun && selFeature !== null ? (sun.features[selFeature]||{}).fx : null;
    const near = focus === sun;
    const camD = camera.position.distanceTo(worldPos(sun, tmpV));
    // loops, flares, CMEs and coronal holes only show up in ultraviolet, so picking one switches to the filtered view
    FX.sunFilt = sel && /loops|flare|cme|hole/.test(sel) ? 1 : FX.userFilt;
    if (FX.shown !== FX.sunFilt) applyScheme(FX.sunFilt);
    sunUniforms.filt.value += (FX.sunFilt - sunUniforms.filt.value)*Math.min(1, dt*4);
    Object.entries(fx).forEach(([key, f]) => {
      const tgt = sel === key ? 1 : near ? f.base : (camD < SUN_R*30 ? f.base*.6 : 0);
      f.k += (tgt - f.k)*Math.min(1, dt*2.2);
      f.objs.forEach(o => { o.visible = f.k > .004; if (o.material.uniforms.k) o.material.uniforms.k.value = f.k; if (o.material.uniforms.time && o.isPoints){ o.material.uniforms.time.value = sunUniforms.time.value; o.material.uniforms.px.value = fxPx()*R; } });
    });
    sunUniforms.spotK.value = fx.spots.k; sunUniforms.gran.value = fx.gran.k;
    // flare cycle: impulsive flash, then slowly fading arcade
    flareT = (flareT + dt) % 9;
    const fl = flareT < .35 ? flareT/.35 : Math.exp(-(flareT - .35)*.9);
    fx.flare.objs.forEach(o => o.material.uniforms.flash.value = fl*.8);
    flash.material.opacity = fx.flare.k*fl; flash.visible = flash.material.opacity > .01;
    flash.scale.setScalar(.18 + fl*.35);
  });
})();

/* ---------------- plumes: Io's volcanoes, Enceladus's geysers, Triton's nitrogen jets ---------------- */
function addPlume(b, f, fi){
  const P = f.plume, rnd = rng(hashStr(b.id + fi)), n = P.n || 1800;
  const src = [], ph = [], sp = [], ang = [];
  for (let i=0;i<n;i++){
    let la = f.lat, lo = f.lon;
    if (P.stripes){ const s = (rnd()*4)|0; la = -86 + s*3.2 + (rnd()-.5)*.8; lo = -80 + rnd()*110 + s*14; }
    const d = llDir(la, lo); src.push(d.x, d.y, d.z);
    ph.push(rnd()); sp.push(.55 + rnd()*.45); ang.push(rnd()*TAU, Math.pow(rnd(), .7));
  }
  const pts = fxPoints(n, {aS:src, aPh:ph, aSp:sp, aAng:ang},
    `float t=fract(aPh+time*${(P.speed||.18).toFixed(3)});
     vec3 nrm=normalize(aS); vec3 u=normalize(cross(nrm,vec3(0.,1.,.3))); vec3 v=cross(nrm,u);
     float H=${P.h.toFixed(3)}*aSp; float L=${P.spread.toFixed(3)}*aAng.y;
     vec3 lat=(u*cos(aAng.x)+v*sin(aAng.x));
     p=aS*1.0 + nrm*(4.*H*t*(1.-t)) + lat*L*t;
     a=smoothstep(0.,.08,t)*(1.-t*.7)*(${P.umbrella ? "1.+smoothstep(.35,.5,t)*smoothstep(.75,.5,t)" : "1."});`,
    P.col, P.size || .012);
  pts.scale.setScalar(b.r); b.spin.add(pts);
  const ent = { b, fi, pts, k:0 };
  FX_HOOKS.push(dt => {
    const tgt = focus === b && selFeature === fi ? 1 : (focus === b ? .35 : 0);
    ent.k += (tgt - ent.k)*Math.min(1, dt*2.5);
    pts.visible = ent.k > .004 && !b.cut; pts.material.uniforms.k.value = ent.k;
    pts.material.uniforms.time.value = sunUniforms.time.value; pts.material.uniforms.px.value = fxPx()*b.r;
  });
}
BODIES.forEach(b => (b.features||[]).forEach((f, i) => { if (f.plume) addPlume(b, f, i); }));

/* true colour / filtered switch in the Sun's panel */
$("#dossierBody").addEventListener("click", e => {
  const t = e.target.closest("[data-sunf]"); if (!t) return;
  FX.setSunFilt(+t.dataset.sunf);
});
FX.setSunFilt(0);

/* ============================================================
   CONDITIONS BOX — temperature, pressure, density, gravity.
   Shows the surface of the body in view; in a cutaway, point at
   (or tap) a layer to read the conditions inside it.
   ============================================================ */
const HUD = (function(){
  const el = document.createElement("aside"); el.id = "hud"; el.className = "panel"; el.hidden = true;
  el.setAttribute("aria-live", "polite"); $("#app").appendChild(el);
  let pinned = null;
  // gauges: temperature on a log scale from 10 K to 20 million K, pressure on a log scale from vacuum to 10¹⁰ bar
  const tPos = c => { const k = Math.max(c + 273.15, 3); return Math.min(1, Math.max(0, (Math.log10(k) - 1)/(7.3 - 1))); };
  const pPos = b => b <= 0 ? 0 : Math.min(1, Math.max(0, (Math.log10(b) + 15)/(11 + 15)));
  const gauge = (lbl, pos, cls) => `<div class="gz ${cls}"><span>${lbl}</span><i><b style="left:${(pos*100).toFixed(1)}%"></b></i></div>`;
  function render(){
    const b = focus && !focus.range ? focus : null;
    if (!b){ el.hidden = true; return; }
    const surf = CONDITIONS.surface[b.id];
    const layers = b.cut && CONDITIONS.layers[b.interior];
    const li = layers ? (pinned !== null ? pinned : hotI) : null;
    let h = "";
    if (layers && li !== null && li !== undefined && layers[li]){
      const L = layers[li];
      h = `<p class="eyebrow">Inside ${esc(b.name)} · layer ${li+1}</p><h3>${esc(L.name)}</h3><dl>`
        + `<dt>Temperature</dt><dd>${esc(L.T_C)}</dd><dt>Pressure</dt><dd>${esc(L.P)}</dd>` + (L.rho ? `<dt>Density</dt><dd>${esc(L.rho)}</dd>` : "") + `</dl>`
        + gauge("Temp", tPos(L.Tmid), "t") + gauge("Pressure", pPos(L.Pmid_bar), "p")
        + `<p class="hint">${L.approx ? "Model estimate. " : ""}Earth's air at sea level is 1 bar; a room is 20 °C.</p>`;
    } else if (surf){
      h = `<p class="eyebrow">${b.kind === "star" ? "Visible surface" : surf.P && /no surface/i.test(surf.P) ? "At the cloud tops" : "At the surface"}</p><h3>${esc(b.name)}</h3><dl>`
        + `<dt>Temperature</dt><dd>${esc(surf.T)}</dd><dt>Pressure</dt><dd>${esc(surf.P)}</dd>`
        + (surf.g ? `<dt>Gravity</dt><dd>${esc(surf.g)} m/s² <small>(${(parseFloat(surf.g)/9.81).toFixed(2)} × Earth)</small></dd>` : "")
        + (surf.vesc ? `<dt>Escape speed</dt><dd>${esc(surf.vesc)} km/s</dd>` : "")
        + (surf.atm ? `<dt>Air</dt><dd>${esc(surf.atm)}</dd>` : "") + `</dl>`
        + (layers ? `<p class="hint">${COARSE ? "Tap" : "Point at"} a layer to read the conditions inside.</p>` : "");
    } else if (layers){
      h = `<p class="eyebrow">Inside ${esc(b.name)}</p><h3>Pick a layer</h3><p class="hint">${COARSE ? "Tap" : "Point at"} a layer to read its temperature and pressure.</p>`;
    } else { el.hidden = true; return; }
    if (b.kind === "star" && !b.cut && CONDITIONS.sunAtmosphere) h += `<details class="hx"><summary>Above the surface</summary><dl>${CONDITIONS.sunAtmosphere.map(a => `<dt>${esc(a.name)}</dt><dd>${esc(a.T_C)}</dd>`).join("")}</dl></details>`;
    el.innerHTML = `<button class="hmin" aria-label="Hide conditions">–</button>` + h; el.hidden = false;
  }
  let hotI = null;
  el.addEventListener("click", e => { if (e.target.closest(".hmin") || (MOB.on && !e.target.closest("summary,details"))) document.body.classList.toggle("hud-min"); });
  if (MOB.on) document.body.classList.add("hud-min");
  return {
    render,
    hot(i, on){ hotI = on ? i : (hotI === i ? null : hotI); render(); },
    pin(i){ pinned = pinned === i ? null : i; if (pinned !== null) document.body.classList.remove("hud-min"); render(); },
    reset(){ pinned = null; hotI = null; render(); }
  };
})();

/* ============================================================
   SCALE LADDER — zoom out of the Solar System into the stellar
   neighbourhood (real positions of every system within 20 light
   years plus bright landmark stars), then out to the Milky Way
   (arms from Reid et al. 2019 maser parallaxes, bar, bulge).
   Each scale has its own linear unit so nothing is squashed:
     stars:  1 unit = 0.05 light-year
     galaxy: 1 unit = 10 light-years
   ============================================================ */
(function(){
  const SU = 20, GU = 326.16/10*10;            // stars: units per ly; galaxy: units per kpc (1 kpc = 3,261.6 ly = 326.16 units)
  const KPC = 326.16;
  const L = { system:"Solar System", stars:"Nearby stars", galaxy:"Milky Way", group:"Local Group", cosmos:"Cosmic web" };
  const sc = { stars:new THREE.Scene(), galaxy:new THREE.Scene(), group:new THREE.Scene(), cosmos:new THREE.Scene() };
  sc.group.background = new THREE.Color(0x010103); sc.cosmos.background = new THREE.Color(0x000002);
  sc.stars.background = new THREE.Color(0x010207); sc.galaxy.background = new THREE.Color(0x010104);
  const lab = document.createElement("div"); lab.id = "labels2"; $("#app").insertBefore(lab, $("#labels").nextSibling);
  const items = { stars:[], galaxy:[], group:[], cosmos:[] }; SCALE.sc = sc; SCALE.items = items;       // {name, pos, cls, pri, info}
  const gal2three = (x, y, z, k) => new THREE.Vector3(x*k, z*k, -y*k);   // galactic x→three x, galactic z (north) → three y

  const starMat = () => new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{ tex:{value:DOT_TEX}, pr:{value:renderer.getPixelRatio()}, px:{value:600}, att:{value:0}, fade:{value:1} },
    vertexShader:`attribute vec3 aCol;attribute float aSize;uniform float pr;uniform float px;uniform float att;varying vec3 vC;varying float vA;${LOGDEPTH_V}
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.);float s=aSize*1.5*${renderer.getPixelRatio().toFixed(2)};gl_PointSize=s;vA=1.;vC=aCol;gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
    fragmentShader:`uniform sampler2D tex;uniform float fade;varying vec3 vC;varying float vA;${LOGDEPTH_F}void main(){${LOGDEPTH_FM}float a=texture2D(tex,gl_PointCoord).a;gl_FragColor=vec4(vC*a*vA*fade,1.);}`
  });
  function pointsFrom(arr, mat){
    const g = new THREE.BufferGeometry(), pos = [], col = [], size = [];
    arr.forEach(p => { pos.push(p.x, p.y, p.z); const c = new THREE.Color(p.c); col.push(c.r*(p.k||1), c.g*(p.k||1), c.b*(p.k||1)); size.push(p.s); });
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("aCol", new THREE.Float32BufferAttribute(col, 3)); g.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1));
    const pts = new THREE.Points(g, mat); pts.frustumCulled = false; return pts;
  }
  const absMag = (m, ly) => m == null ? null : m - 5*Math.log10(ly/3.2616/10);

  /* ---------------- stellar neighbourhood ---------------- */
  (function(){
    const S = sc.stars, pts = [];
    const sunInfo = { name:"The Sun", eyebrow:"Our star · you are here", facts:{"Spectral type":"G2V","Distance":"0","Planets":"8"}, blurb:"At this scale the whole Solar System, out to the edge of the Oort Cloud about 1.5 light-years away, fits inside the faint sphere around the Sun. Even Voyager 1, our most distant spacecraft, is less than a thousandth of a light-year out." };
    pts.push({x:0,y:0,z:0,c:"#fff5e8",s:16,k:1.3}); items.stars.push({name:"Sun", pos:new THREE.Vector3(), cls:"sun", pri:200, info:sunInfo, home:1});
    const add = (s, land) => {
      const p = s.xyz_gal_ly; if (!p) return;
      const v = gal2three(p[0], p[1], p[2], SU);
      const M = absMag(s.mag_V, s.dist_ly);
      const size = s.brown_dwarf ? 4 : M == null ? 5 : Math.max(5, Math.min(30, 9 + (8 - M)*1.6));
      pts.push({x:v.x, y:v.y, z:v.z, c:s.color_hex || "#ffffff", s:size, k:s.brown_dwarf ? .6 : 1});
      const facts = {"Distance":`${s.dist_ly < 100 ? s.dist_ly.toFixed(2) : Math.round(s.dist_ly).toLocaleString("en-US")} light-years`, "Spectral type":s.spectral || "—"};
      if (s.comp && s.comp.length > 1) facts["Stars"] = s.comp.join(", ");
      if (s.mag_V != null) facts["Brightness from Earth"] = `magnitude ${s.mag_V}` + (s.mag_V > 6.5 ? " (too faint for the naked eye)" : "");
      if (s.radius_sun) facts["Radius"] = `${s.radius_sun} × the Sun`;
      if (s.planets) facts["Known planets"] = s.planets;
      const yr = Math.round(2026 - s.dist_ly);
      const blurb = (s.note ? s.note + " " : "") + (s.dist_ly < 3000 ? `The light you would see from it tonight left ${yr > 0 ? "in " + yr : Math.round(s.dist_ly).toLocaleString("en-US") + " years ago"}.` : "");
      items.stars.push({name:s.name, pos:v, cls:land ? "land" : s.brown_dwarf ? "bd" : "", pri:(land ? 60 : 40) - (M == null ? 18 : M*1.5) + (s.planets ? 6 : 0), info:{name:s.name, eyebrow:(land ? "Bright star" : s.brown_dwarf ? "Brown dwarf" : "Star system") + (s.planets ? ` · ${s.planets} planet${s.planets > 1 ? "s" : ""}` : ""), facts, blurb}});
    };
    GALAXY.near.forEach(s => { if (s.dist_ly > 0) add(s, false); });
    GALAXY.land.forEach(s => add(s, true));
    const sm = starMat(); S.add(pointsFrom(pts, sm)); FX_HOOKS_SC.push(() => { sm.uniforms.pr.value = renderer.getPixelRatio(); });
    // the Solar System to scale: Oort Cloud shell (~2,000 to 100,000 AU) and the heliosphere
    const oort = new THREE.Mesh(new THREE.SphereGeometry(1.58*SU, 48, 24), new THREE.MeshBasicMaterial({ color:0x6d86b0, transparent:true, opacity:.07, depthWrite:false, wireframe:true }));
    S.add(oort);
    items.stars.push({name:"Oort Cloud (edge of the Solar System)", pos:new THREE.Vector3(0, 1.58*SU, 0), cls:"reg", pri:30, info:{name:"Oort Cloud", eyebrow:"Edge of the Solar System", facts:{"Outer edge":"about 100,000 AU (1.6 light-years)","Inner edge":"about 2,000 AU"}, blurb:"A shell of trillions of icy bodies, the source of long-period comets. Its outer edge is about a third of the way to Alpha Centauri, so the Sun's gravity and the nearest stars' gravity overlap out here."}});
    // distance rings in the galactic plane and the direction to the Galactic Centre
    [5, 10, 15, 20].forEach(r => {
      const g = new THREE.BufferGeometry().setFromPoints(Array.from({length:181}, (_, i) => new THREE.Vector3(Math.cos(i/180*TAU)*r*SU, 0, Math.sin(i/180*TAU)*r*SU)));
      S.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color:0x4a5a78, transparent:true, opacity:.28, depthWrite:false })));
      items.stars.push({name:`${r} ly`, pos:new THREE.Vector3(r*SU*.707, 0, r*SU*.707), cls:"ring", pri:5, info:null});
    });
    const gc = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(21*SU,0,0), 5*SU, 0xf0b44c, 1.2*SU, .6*SU); gc.line.material.transparent = true; gc.line.material.opacity = .6; S.add(gc);
    items.stars.push({name:"→ Galactic Centre, 26,700 ly", pos:new THREE.Vector3(26*SU, 0, 0), cls:"ring", pri:8, info:null});
    // the Local Bubble: a hot, thin cavity ~1,000 ly across blown by supernovae
    const lb = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20), new THREE.MeshBasicMaterial({ color:0xc06a8a, transparent:true, opacity:.035, depthWrite:false, side:THREE.BackSide }));
    lb.scale.set(500*SU, 300*SU, 400*SU); lb.position.set(-30*SU, 20*SU, 40*SU); S.add(lb);
    items.stars.push({name:"Local Bubble", pos:new THREE.Vector3(-30*SU, 330*SU, 40*SU), cls:"reg", pri:12, info:{name:"Local Bubble", eyebrow:"Interstellar medium", facts:{"Size":"about 1,000 light-years across","Formed":"about 14 million years ago"}, blurb:"A cavity of hot, very thin gas blown out by a chain of supernovae. Its expanding edge compressed gas into the star-forming regions that surround it today. Shown here as a rough ellipsoid."}});
  })();

  /* ---------------- the Milky Way ---------------- */
  (function(){
    const S = sc.galaxy, rnd = rng(2026), gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); v = rnd(); return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*v); };
    const mob = COARSE || Math.min(innerWidth, innerHeight) < 600;
    const N = mob ? .5 : 1, pts = [], dust = [];
    const P = (x, y, z, c, s, k) => { const v = gal2three(x, y, z, KPC); pts.push({x:v.x, y:v.y, z:v.z, c, s, k}); };
    // bar + boxy bulge (Wegg et al. 2015: half-length ~5 kpc, ~28° to the Sun–centre line)
    const ba = Math.atan2(GALAXY.bar.near_end_xy_kpc[1], GALAXY.bar.near_end_xy_kpc[0]);
    for (let i=0;i<26000*N;i++){
      const long = rnd() < .45, a = gauss()*(long ? 1.9 : 1.0), b = gauss()*(long ? .45 : .7), z = gauss()*(long ? .18 : .45);
      P(a*Math.cos(ba) - b*Math.sin(ba), a*Math.sin(ba) + b*Math.cos(ba), z, rnd() < .5 ? "#ffd59a" : "#ffe6c2", .05 + rnd()*.05, .55);
    }
    // smooth old disk: exponential, scale length 2.6 kpc, thin (we exaggerate thickness slightly for visibility)
    for (let i=0;i<52000*N;i++){
      const R = -2.6*Math.log(rnd()*rnd() + 1e-6)*.75, ph = rnd()*TAU;
      if (R > 18) continue;
      P(R*Math.cos(ph), R*Math.sin(ph), gauss()*.12, rnd() < .7 ? "#f4e2c8" : "#cdd8ff", .045 + rnd()*.04, .45);
    }
    // spiral arms from the published maser fits: young blue stars, pink star-forming nebulae, dust on the inner edge
    const arms = GALAXY.arms.filter(a => a.pts && a.pts.length > 2);
    const T12 = Math.tan(12*DEG), SCL = 8.2/8.15;
    arms.forEach(a => {
      if (a.Rref == null){ a.full = a.pts; return; }
      const Rr = (phi) => { const tp = Math.tan((phi > a.phiref ? a.pout : a.pin)*DEG); return a.Rref*Math.exp((phi - a.phiref)*DEG*tp); };
      const extend = !/3-kpc|Local/.test(a.name);
      const lo = a.p0, hi = a.p1, out = [];
      let phi0 = lo, phi1 = hi;
      if (extend){ while (phi0 > lo - 400 && Rr(lo)*Math.exp((phi0 - lo)*DEG*T12) > 3.4) phi0 -= 2; while (phi1 < hi + 400 && Rr(hi)*Math.exp((phi1 - hi)*DEG*T12) < 17) phi1 += 2; }
      for (let ph = phi0; ph <= phi1; ph += 1.5){
        const R = ph < lo ? Rr(lo)*Math.exp((ph - lo)*DEG*T12) : ph > hi ? Rr(hi)*Math.exp((ph - hi)*DEG*T12) : Rr(ph);
        out.push([R*SCL*Math.cos(ph*DEG), R*SCL*Math.sin(ph*DEG), ph >= a.p0 && ph <= a.p1 ? 1 : 0]);
      }
      a.full = out;
    });
    const segs = []; let tot = 0;
    arms.forEach(a => { const P = a.full; for (let i=0;i<P.length-1;i++){ const p = P[i], q = P[i+1], l = Math.hypot(q[0]-p[0], q[1]-p[1]); const R = Math.hypot(p[0], p[1]);
      const major = /Perseus|Scutum|Norma|Outer|Sagittarius/.test(a.name) ? 1 : .55;
      const w = Math.max(.25, a.w*(1 + .06*R))*1.6;
      segs.push({p, q, l, w, wt:l*major*Math.max(.25, Math.exp(-(R - 4)/9))}); tot += segs[segs.length-1].wt; } });
    const pick = () => { let r = rnd()*tot; for (const s of segs){ r -= s.wt; if (r <= 0) return s; } return segs[segs.length-1]; };
    for (let i=0;i<60000*N;i++){
      const s = pick(), t = rnd(), x = s.p[0] + (s.q[0]-s.p[0])*t, y = s.p[1] + (s.q[1]-s.p[1])*t;
      const nx = -(s.q[1]-s.p[1])/s.l, ny = (s.q[0]-s.p[0])/s.l, o = gauss()*s.w*.5;
      const hii = rnd() < .035;
      P(x + nx*o, y + ny*o, gauss()*.06, hii ? "#ff7aa6" : rnd() < .6 ? "#bcd2ff" : "#eef2ff", hii ? .12 + rnd()*.1 : .05 + rnd()*.05, hii ? 1.2 : .95);
      if (rnd() < .3){ const R = Math.hypot(x, y), io = -Math.sign(o || 1)*.15; const v = gal2three(x + nx*(o*.4) - x/R*.18, y + ny*(o*.4) - y/R*.18, gauss()*.04, KPC); dust.push(v); }
    }
    for (let i=0;i<5000*N;i++){ const s = pick(), t = rnd(), x = s.p[0] + (s.q[0]-s.p[0])*t, y = s.p[1] + (s.q[1]-s.p[1])*t; P(x + gauss()*.35, y + gauss()*.35, gauss()*.05, rnd() < .5 ? "#3a4a78" : "#5a4a6a", .5 + rnd()*.4, .5); }
    for (let i=0;i<3000*N;i++){ const R = -3.2*Math.log(rnd()*rnd() + 1e-6)*.7, ph = rnd()*TAU; if (R > 16) continue; P(R*Math.cos(ph), R*Math.sin(ph), gauss()*.1, "#4a4238", .7 + rnd()*.5, .4); }
    // globular clusters in the halo
    for (let i=0;i<160;i++){ const r = Math.pow(rnd(), 1.6)*35 + 1, th = Math.acos(2*rnd()-1), ph = rnd()*TAU; P(r*Math.sin(th)*Math.cos(ph), r*Math.sin(th)*Math.sin(ph), r*Math.cos(th), "#ffe0a8", .25, 1); }
    const gm = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
      uniforms:{ tex:{value:DOT_TEX}, px:{value:600}, fade:{value:1} },
      vertexShader:`attribute vec3 aCol;attribute float aSize;uniform float px;varying vec3 vC;varying float vA;${LOGDEPTH_V}
        void main(){vec4 mv=modelViewMatrix*vec4(position,1.);float s=aSize*${KPC.toFixed(2)}*px/(-mv.z);gl_PointSize=clamp(s,1.,7.);vA=clamp(s/2.,.12,1.)*min(1.,7./s);vC=aCol;gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
      fragmentShader:`uniform sampler2D tex;uniform float fade;varying vec3 vC;varying float vA;${LOGDEPTH_F}void main(){${LOGDEPTH_FM}float a=texture2D(tex,gl_PointCoord).a;gl_FragColor=vec4(vC*a*vA*.55*fade,1.);}` });
    { const mw = pointsFrom(pts, gm); S.add(mw); SCALE.mwGeo = mw.geometry; }
    // dust: drawn with normal blending so it dims what is behind it
    { const g = new THREE.BufferGeometry(); g.setFromPoints(dust);
      const dm = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, uniforms:{ tex:{value:DOT_TEX}, px:{value:600}, fade:{value:1} },
        vertexShader:`uniform float px;${LOGDEPTH_V}void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(.16*${KPC.toFixed(2)}*px/(-mv.z),1.,14.);gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
        fragmentShader:`uniform sampler2D tex;uniform float fade;${LOGDEPTH_F}void main(){${LOGDEPTH_FM}float a=texture2D(tex,gl_PointCoord).a;gl_FragColor=vec4(.05,.03,.02,a*.22*fade);}` });
      const dp = new THREE.Points(g, dm); dp.frustumCulled = false; S.add(dp); FX_HOOKS_SC.push(() => dm.uniforms.px.value = fxPx()); }
    FX_HOOKS_SC.push(() => gm.uniforms.px.value = fxPx());
    // central glow and Sgr A*
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex([[0,"rgba(255,226,170,.8)"],[.25,"rgba(255,190,120,.25)"],[1,"rgba(0,0,0,0)"]]), blending:THREE.AdditiveBlending, depthWrite:false, transparent:true }));
    glow.scale.setScalar(9*KPC); S.add(glow);
    // the Sun and its orbit
    const sun = gal2three(-8.2, 0, .0208, KPC); SCALE.sunGal = sun;
    const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({length:361}, (_, i) => new THREE.Vector3(Math.cos(i/360*TAU)*8.2*KPC, 0, Math.sin(i/360*TAU)*8.2*KPC))), new THREE.LineDashedMaterial({ color:0xf0b44c, dashSize:60, gapSize:40, transparent:true, opacity:.45, depthWrite:false }));
    ring.computeLineDistances(); S.add(ring); ORBIT_LINES_EXTRA.push(ring);
    const you = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex([[0,"rgba(255,255,255,1)"],[.3,"rgba(240,180,76,.6)"],[1,"rgba(0,0,0,0)"]]), blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, sizeAttenuation:false }));
    you.scale.setScalar(.03); you.position.copy(sun); S.add(you);
    const pr = GALAXY.params;
    items.galaxy.push({name:"You are here · the Sun", pos:sun, cls:"sun", pri:200, home:1, info:{name:"The Sun in the Milky Way", eyebrow:"Our place", facts:{"From the centre":"about 26,700 light-years (8.2 kpc)","Above the midplane":"about 68 light-years","Orbital speed":`${pr.rotation_speed_at_sun_km_s} km/s`,"One lap":`about ${pr.sun_orbital_period_myr} million years`}, blurb:"The Sun sits in a minor arm, the Local Arm or Orion Spur, between the Sagittarius–Carina and Perseus arms. Since it formed it has gone around the galaxy roughly 20 times. The dashed circle is its approximate orbit."}});
    items.galaxy.push({name:"Sagittarius A* · Galactic Centre", pos:new THREE.Vector3(), cls:"gc", pri:150, info:{name:"Sagittarius A*", eyebrow:"Supermassive black hole", facts:{"Mass":"4.3 million Suns","Distance":"about 26,700 light-years"}, blurb:"The black hole at the centre of the galaxy, imaged by the Event Horizon Telescope in 2022. Its mass was pinned down by tracking stars that orbit it, work that won the 2020 Nobel Prize in Physics."}});
    items.galaxy.push({name:"Central bar", pos:gal2three(GALAXY.bar.near_end_xy_kpc[0]*.7, GALAXY.bar.near_end_xy_kpc[1]*.7, .3, KPC), cls:"reg", pri:60, info:{name:"The central bar", eyebrow:"Structure", facts:{"Half-length":`about ${GALAXY.bar.half_length_kpc} kpc (16,000 ly)`,"Angle to the Sun–centre line":`about ${GALAXY.bar.angle_to_sun_gc_line_deg}°`}, blurb:"The Milky Way is a barred spiral. An elongated bar of old stars crosses the centre, with a peanut-shaped bulge in its middle. We know its shape from star counts and motions, since dust hides it from view."}});
    arms.forEach(a => { const ms = (a.full || a.pts).filter(q => q[2] !== 0); const m = ms[Math.floor(ms.length*.5)] || a.pts[0]; items.galaxy.push({name:a.name.replace(" (Orion Spur)","").replace(" (Norma-Outer)","") + (/arm/i.test(a.name) ? "" : " Arm"), pos:gal2three(m[0], m[1], .05, KPC), cls:"arm", pri:/Local/.test(a.name) ? 90 : 70, info:{name:a.name, eyebrow:"Spiral arm", facts:{"Traced by":"maser parallaxes (Reid et al. 2019)"}, blurb:(a.note || "") + " Beyond the measured stretch the arm is extrapolated."}}); });
    GALAXY.objs.forEach(o => { if (!o.xyz || /Sgr A/.test(o.name)) return; const far = /Andromeda/.test(o.name); if (far) return;
      const v = gal2three(o.xyz[0], o.xyz[1], o.xyz[2], KPC);
      const ly = o.dist_kpc ? Math.round(o.dist_kpc*3261.6).toLocaleString("en-US") + " light-years" : "";
      items.galaxy.push({name:o.name, pos:v, cls:"obj", pri:/Magellanic|Omega|Orion/.test(o.name) ? 55 : 40, info:{name:o.name, eyebrow:o.kind || "Object", facts:ly ? {"Distance from the Sun":ly} : {}, blurb:o.note || ""}});
      if (/Magellanic/.test(o.name)){ const blob = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex([[0,"rgba(220,225,255,.55)"],[.4,"rgba(170,180,230,.15)"],[1,"rgba(0,0,0,0)"]]), blending:THREE.AdditiveBlending, depthWrite:false, transparent:true })); blob.position.copy(v); blob.scale.setScalar((/Large/.test(o.name) ? 9 : 5)*KPC); S.add(blob); }
    });
  })();

  /* ---------------- switching scales ---------------- */
  const fade = document.createElement("div"); fade.id = "scaleFade"; $("#app").appendChild(fade);
  const note = document.createElement("div"); note.id = "scaleNote"; $("#app").appendChild(note);
  const NOTES = { stars:"Real positions of every star system within 20 light-years, plus bright landmark stars. Scale: 1 grid ring = 5 light-years. Sizes show how bright each star really is, not its size.",
                  galaxy:"Milky Way model: arms from radio measurements of star-forming regions (Reid et al. 2019), bar and disk from star surveys. The arms are drawn where they have been measured and continued around the galaxy with a typical pitch where they have not (the far side is hidden behind the centre), so the shading is an artist's model." };
  /* ---- one orientation for every scale: the near-star and galaxy scenes are rotated from galactic
     to ecliptic axes, so the Solar System sits at its true ~60° tilt to the plane of the Milky Way ---- */
  const M = (function(){
    const T = [[-0.0548755604,-0.8734370902,-0.4838350155],[0.4941094279,-0.4448296300,0.7469822445],[-0.8676661490,-0.1980763734,0.4559837762]];
    const e = 23.4392911*DEG, ce = Math.cos(e), se = Math.sin(e);
    const conv = v3 => { // three-galactic (gx, gz, -gy) -> three-ecliptic (ex, ez, -ey)
      const g = [v3.x, -v3.z, v3.y];
      const q = [0,1,2].map(r => T[0][r]*g[0] + T[1][r]*g[1] + T[2][r]*g[2]);   // equatorial = Tᵀ·galactic
      const ex = q[0], ey = q[1]*ce + q[2]*se, ez = -q[1]*se + q[2]*ce;
      return new THREE.Vector3(ex, ez, -ey);
    };
    const a = conv(new THREE.Vector3(1,0,0)), b = conv(new THREE.Vector3(0,1,0)), c = conv(new THREE.Vector3(0,0,1));
    return new THREE.Matrix4().makeBasis(a, b, c);
  })();
  ["stars", "galaxy"].forEach(k => { const S = sc[k], g = new THREE.Group(); g.matrixAutoUpdate = false; g.matrix.copy(M); while (S.children.length) g.add(S.children[0]); S.add(g); });
  const seenPos = new Set();
  ["stars", "galaxy"].forEach(k => items[k].forEach(it => { if (!seenPos.has(it.pos)){ seenPos.add(it.pos); it.pos.applyMatrix4(M); } }));
  const GAL_N = new THREE.Vector3(0,1,0).applyMatrix4(M).normalize();      // galactic north in scene axes
  const GC = new THREE.Vector3(0,0,0);

  NOTES.group = "Galaxies within about 5 million light-years, placed by their measured distances and sky positions. The Milky Way and Andromeda are shown as models; the small ones are dwarf galaxies, most of them satellites.";
  NOTES.cosmos = "Galaxy groups, clusters and superclusters at their measured positions, with the cosmic web drawn as a model of filaments and voids around them. Distances to the farthest structures come from redshifts.";

  const smooth = x => { const t = Math.min(1, Math.max(0, x)); return t*t*(3 - 2*t); };
  /* ---- a shared field of ordinary stars around the Sun, out to 4,000 light-years, drawn in both the near-star
     and Milky Way scenes at identical positions, so the hand-off between them has something in common ---- */
  (function(){
    const rnd = rng(77077), gauss = () => { let u = 0; while (!u) u = rnd(); return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*rnd()); };
    const n = COARSE ? 5000 : 9000, pos = [], col = [], size = [];
    const COLS = ["#ffcf9a","#ffb070","#ffe6c8","#fff4ea","#dfe6ff","#ff9a5a"];
    for (let i=0;i<n;i++){
      const r = 25 + Math.pow(rnd(), .5)*4000, ph = rnd()*TAU;                 // light-years, in the galactic plane
      const z = gauss()*Math.min(300, r*.6)*.9;
      pos.push(r*Math.cos(ph), z, -r*Math.sin(ph)); const c = new THREE.Color(COLS[(rnd()*COLS.length)|0]); const k = .45 + rnd()*.5; col.push(c.r*k, c.g*k, c.b*k); size.push(2 + rnd()*3.2);
    }
    const mk = (unit, fadeFar) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos.map(v => v*unit), 3)); g.setAttribute("aCol", new THREE.Float32BufferAttribute(col, 3)); g.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1));
      const m = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, uniforms:{ tex:{value:DOT_TEX}, fade:{value:1} },
        vertexShader:`attribute vec3 aCol;attribute float aSize;varying vec3 vC;varying float vA;${LOGDEPTH_V}
          void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=aSize*${renderer.getPixelRatio().toFixed(2)};vA=1.-smoothstep(${(fadeFar*.4).toFixed(2)},${fadeFar.toFixed(2)},-mv.z);vC=aCol;gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
        fragmentShader:`uniform sampler2D tex;uniform float fade;varying vec3 vC;varying float vA;${LOGDEPTH_F}void main(){${LOGDEPTH_FM}float a=texture2D(tex,gl_PointCoord).a;gl_FragColor=vec4(vC*a*vA*fade,1.);}` });
      const p = new THREE.Points(g, m); p.frustumCulled = false; return p;
    };
    sc.stars.children[0].add(mk(SU, 40000*SU));
    const gp = mk(.1, 4000); gp.position.copy(gal2three(-8.2, 0, .0208, KPC)); sc.galaxy.children[0].add(gp);
  })();

  /* ---- the scale ladder ----
     Each scale's units are linear; K is the size of one unit of the scale inside it, measured in this scale's
     units, and the anchor is where that inner scale's origin sits here. So a point p in the inner scale is at
     anchor + p·K in this one. Because the conversion is exact, switching scales never moves the picture. */
  const K1 = 1.58*SU/D(1e5);                 // system (compressed) -> near stars: matches the Oort Cloud's edge
  const STEPS = [
    { key:"system" },
    { key:"stars",  K:K1,     anchor:new THREE.Vector3(),  band:[12000*K1, 26000*K1], home:() => new THREE.Vector3() },
    { key:"galaxy", K:1/(10*SU), anchor:SCALE.sunGal,      band:[18, 520],
      home:d => SCALE.sunGal.clone().lerp(GC, smooth((d - 1200)/9000)) },
    { key:"group",  K:1/100,  anchor:new THREE.Vector3(),  band:[110, 560], home:d => (SCALE.groupHome || new THREE.Vector3()).clone().multiplyScalar(smooth((d - 900)/4000)) },
    { key:"cosmos", K:1/1000, anchor:new THREE.Vector3(),  band:[4.2, 30],  home:() => new THREE.Vector3() }
  ];
  const IDX = {}; STEPS.forEach((s, i) => IDX[s.key] = i);
  const GOAL = { system:1600, stars:320, galaxy:10500, group:4000, cosmos:2400 };
  const camB = new THREE.PerspectiveCamera();
  const quadS = new THREE.Scene(), quadC = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0, depthTest:false, depthWrite:false }));
  quadS.add(quad);
  function setFade(S, f){
    S.traverse(o => { const m = o.material; if (!m) return;
      if (m.uniforms && m.uniforms.fade) m.uniforms.fade.value = f;
      else if (m.opacity !== undefined){ if (m.userData.op0 === undefined) m.userData.op0 = m.opacity; m.opacity = m.userData.op0*f; m.transparent = true; } });
  }
  const sceneOf = k => k === "system" ? scene : sc[k];
  function overlay(lowerS, lowerC, upperS, upperC, b){
    renderer.autoClear = false; renderer.clear();
    renderer.render(lowerS, lowerC);
    if (b > .001){
      quad.material.opacity = Math.min(1, b*1.05); renderer.render(quadS, quadC); renderer.clearDepth();
      const bg = upperS.background; upperS.background = null; setFade(upperS, b); renderer.render(upperS, upperC); upperS.background = bg; setFade(upperS, 1);
    }
    renderer.autoClear = true;
  }
  function camAt(pos){ camB.copy(camera, false); camB.position.copy(pos); camB.quaternion.copy(camera.quaternion); camB.updateMatrixWorld(); camB.updateProjectionMatrix(); return camB; }
  const bandW = (st, r) => smooth(Math.log(r/st.band[0])/Math.log(st.band[1]/st.band[0]));
  const toOuter = (st, v) => st.anchor.clone().addScaledVector(v, st.K);
  const toInner = (st, v) => v.clone().sub(st.anchor).multiplyScalar(1/st.K);
  let sel = null, anim = null;
  const fadeLabels = (el, o) => { el.style.opacity = o; el.style.pointerEvents = o < .5 ? "none" : ""; };
  function limits(k){
    const i = IDX[k], st = STEPS[i], up = STEPS[i+1];
    controls.minDistance = k === "system" ? 1 : st.band[0]*.5;
    controls.maxDistance = up ? up.band[1]/up.K*1.6 : 160000;
    camera.far = k === "system" ? 120000 : k === "cosmos" ? 4e6 : controls.maxDistance*40; camera.near = k === "system" ? .005 : controls.minDistance*.001; camera.updateProjectionMatrix();
  }
  /* switch the live scale, converting camera and target exactly */
  function liveSwitch(k){
    const a = IDX[SCALE.mode], b = IDX[k];
    let cp = camera.position.clone(), tp = controls.target.clone();
    if (b === a + 1){ const st = STEPS[b]; cp = toOuter(st, cp); tp = toOuter(st, tp); }
    if (b === a - 1){ const st = STEPS[a]; cp = toInner(st, cp); tp = toInner(st, tp); }
    applyMode(k);
    camera.position.copy(cp); controls.target.copy(tp); controls.update();
  }
  function applyMode(mode){
    const prev = SCALE.mode; SCALE.mode = mode;
    document.body.classList.toggle("far", mode !== "system");
    document.body.classList.toggle("far-galaxy", mode === "galaxy");
    if (prev === "system"){ if (focus && focus.cut) removeCutaway(focus); focus = null; selFeature = null; clearPins(); $("#dossier").hidden = true; renderCrumbs(null); markIndex(null); }
    fly = null; sel = null; limits(mode);
    if (mode === "system"){ $("#dossier").hidden = true; renderIndex(); updateMoonVisibility(); }
    else { renderFarIndex(); $("#dossier").hidden = true; }
    note.textContent = NOTES[mode] || ""; note.hidden = !NOTES[mode];
    lab.innerHTML = ""; (items[mode] || []).forEach(it => { if (!it.el){ it.el = document.createElement("button"); it.el.type = "button"; it.el.className = "sl " + it.cls; it.el.innerHTML = `<span class="d"></span><span class="t">${esc(it.name)}</span>`; it.el.addEventListener("click", e => { e.stopPropagation(); pickItem(it); }); } lab.appendChild(it.el); it.vis = null; });
    document.querySelectorAll("#scaleSeg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.scale === mode));
    if (typeof HUD !== "undefined") HUD.render();
    resize();
  }
  /* instant jump (used when leaving deep time) */
  function setMode(mode){
    if (mode === SCALE.mode) return;
    anim = null; SCALE.busy = true; fade.classList.add("on");
    setTimeout(() => {
      applyMode(mode);
      controls.target.copy(STEPS[IDX[mode]].home ? STEPS[IDX[mode]].home(GOAL[mode]) : new THREE.Vector3());
      camera.position.copy(controls.target).add(new THREE.Vector3(0, .55, .83).multiplyScalar(GOAL[mode]));
      setTimeout(() => { fade.classList.remove("on"); SCALE.busy = false; }, 60);
    }, 320);
  }
  /* smooth zoom to a scale: the camera keeps flying through the hand-off bands */
  function zoomTo(mode){
    if (DEEP.on) return;
    if (mode === SCALE.mode && Math.abs(Math.log(camera.position.distanceTo(controls.target)/GOAL[mode])) < .2) return;
    fly = null; sel = null; anim = { to:mode };
    if (SCALE.mode === "system" && focus){ if (focus.cut) removeCutaway(focus); focus = null; selFeature = null; clearPins(); $("#dossier").hidden = true; renderCrumbs(null); markIndex(null); updateMoonVisibility(); }
  }
  SCALE.zoomTo = zoomTo; SCALE.jump = setMode;
  canvas.addEventListener("mousedown", () => { anim = null; }, {passive:true});
  canvas.addEventListener("touchstart", () => { anim = null; }, {passive:true});
  canvas.addEventListener("wheel", () => { anim = null; if (SCALE.mode !== "system" && !fly) sel = null; }, {passive:true});

  /* per frame: advance zoom animations, ease the target toward each scale's natural centre, switch scales */
  function step(dt){
    const i = IDX[SCALE.mode], st = STEPS[i], up = STEPS[i+1];
    if (anim){
      const d = camera.position.distanceTo(controls.target), j = IDX[anim.to];
      const out = j > i || (j === i && d < GOAL[anim.to]);
      let nd = d*Math.exp((out ? 1 : -1)*dt*(j === i ? 2.2 : 2.9));
      if (j === i && ((out && nd >= GOAL[anim.to]) || (!out && nd <= GOAL[anim.to]))){ nd = GOAL[anim.to]; anim = null; }
      camera.position.sub(controls.target).setLength(nd).add(controls.target);
      // on the way out to the galaxy and beyond, swing gently toward a view from above the disk
      if (out && i >= 2){ const want = GAL_N.clone().multiplyScalar(.8).add(new THREE.Vector3(0, 0, .5)).normalize(); const o = camera.position.clone().sub(controls.target); const c = o.clone().normalize().lerp(want, Math.min(1, dt*.5)).normalize(); camera.position.copy(controls.target).addScaledVector(c, o.length()); }
    }
    const d = camera.position.distanceTo(controls.target);
    if (SCALE.mode === "system"){
      if (d > 6000 && !fly){
        if (focus && d > 9000){ focus = null; selFeature = null; clearPins(); $("#dossier").hidden = true; renderCrumbs(null); markIndex(null); updateMoonVisibility(); }
        if (!focus){ const o = camera.position.clone().sub(controls.target); controls.target.lerp(GC, Math.min(1, dt*2.5*smooth((d - 6000)/5000))); camera.position.copy(controls.target).add(o); }
      }
    } else if (!sel && !fly && st.home){
      const o = camera.position.clone().sub(controls.target), h = st.home(d); controls.target.lerp(h, anim ? 1 : Math.min(1, dt*5)); camera.position.copy(controls.target).add(o);
    }
    // hand-offs: measured from where the inner scale sits, not from the target, so they are always continuous
    if (up && camera.position.length()*up.K > up.band[1]) liveSwitch(up.key);
    else if (i > 0 && camera.position.distanceTo(st.anchor) < st.band[0]) liveSwitch(STEPS[i-1].key);
  }
  /* draw the live scale and, inside a band, its neighbour cross-faded over it */
  function draw(){
    const i = IDX[SCALE.mode], st = STEPS[i], up = STEPS[i+1];
    let w = 1;
    if (i > 0 && camera.position.distanceTo(st.anchor) < st.band[1]){
      const b = bandW(st, camera.position.distanceTo(st.anchor)); w = b;
      overlay(sceneOf(STEPS[i-1].key), camAt(toInner(st, camera.position)), sceneOf(st.key), camera, b);
    } else if (up && camera.position.length()*up.K > up.band[0]){
      const b = bandW(up, camera.position.length()*up.K); w = 1 - b;
      overlay(sceneOf(st.key), camera, sceneOf(up.key), camAt(toOuter(up, camera.position)), b);
    } else renderer.render(sceneOf(st.key), camera);
    return w;
  }
  SCALE.renderSys = dt => {
    step(Math.min(dt, .1));
    if (SCALE.mode !== "system") return false;
    fadeLabels($("#labels"), draw());
    return true;
  };
  SCALE.check = () => {};
  limits("system");

  function pickItem(it){
    sel = it;
    lab.querySelectorAll(".sl").forEach(e => e.classList.toggle("sel", e === it.el));
    if (it.info){
      const i = it.info, d = $("#dossier"), inner = STEPS[IDX[SCALE.mode]-1];
      $("#dossierBody").innerHTML = `<button class="sheet-handle" type="button" aria-label="Show or hide details"><i></i></button><p class="eyebrow">${esc(i.eyebrow||"")}</p><h2>${esc(i.name||it.name)}</h2><p class="blurb">${esc(i.blurb||"")}</p>${i.facts && Object.keys(i.facts).length ? `<div class="sect">Key facts</div>${factsHTML(i.facts)}` : ""}${it.home && inner ? `<button class="btn" data-scale-go="${inner.key}">Zoom in to ${esc(L[inner.key])}</button>` : ""}`;
      d.hidden = false; if (MOB.on) MOB.setSheet(false);
    }
    const t0 = controls.target.clone(), o0 = camera.position.clone().sub(t0), t1 = it.pos.clone();
    const st = STEPS[IDX[SCALE.mode]];
    const near = it.size ? it.size*3.5 : SCALE.mode === "stars" ? (it.home ? 60 : 40 + t1.length()*.15) : st.band[1]*.9;
    const len = Math.max(st.band[0]*1.2, Math.min(o0.length(), near));
    fly = { t0:performance.now(), dur:1400, fromT:t0, fromO:o0, toTargetFn:out => out.copy(t1), endOffset:o0.clone().setLength(len) };
  }
  SCALE.pickItem = pickItem;
  $("#dossierBody").addEventListener("click", e => { const g = e.target.closest("[data-scale-go]"); if (g) zoomTo(g.dataset.scaleGo); });
  function renderFarIndex(){
    const m = SCALE.mode; let h = "";
    if (m === "stars"){
      const list = items.stars.filter(i => i.info && !/ring/.test(i.cls));
      h += `<div class="grp">Nearest star systems</div>` + list.filter(i => !/land|reg/.test(i.cls)).sort((a, b) => a.pos.length() - b.pos.length()).map(i => `<button class="row" data-sl="${items.stars.indexOf(i)}"><span class="sw" style="background:#fff3e0"></span><span>${esc(i.name)}</span><span class="n">${(i.pos.length()/SU).toFixed(1)} ly</span></button>`).join("");
      h += `<div class="grp">Bright landmark stars</div>` + list.filter(i => /land/.test(i.cls)).sort((a, b) => a.pos.length() - b.pos.length()).map(i => `<button class="row" data-sl="${items.stars.indexOf(i)}"><span class="sw"></span><span>${esc(i.name)}</span><span class="n">${Math.round(i.pos.length()/SU)} ly</span></button>`).join("");
    } else if (m === "galaxy"){
      h += `<div class="grp">The Milky Way</div>` + items.galaxy.filter(i => i.info).map(i => `<button class="row" data-sl="${items.galaxy.indexOf(i)}"><span class="sw reg"></span><span>${esc(i.name)}</span></button>`).join("");
    } else {
      const groups = {}; items[m].filter(i => i.info).forEach(i => (groups[i.grp || "Objects"] = groups[i.grp || "Objects"] || []).push(i));
      h += Object.entries(groups).map(([g, list]) => `<div class="grp">${esc(g)}</div>` + list.map(i => `<button class="row" data-sl="${items[m].indexOf(i)}"><span class="sw reg"></span><span>${esc(i.name)}</span>${i.dist ? `<span class="n">${esc(i.dist)}</span>` : ""}</button>`).join("")).join("");
    }
    $("#indexList").innerHTML = `<button class="row" data-scale-go="system"><span class="sw" style="background:#f2a640"></span><span>← Back to the Solar System</span></button>` + h;
  }
  $("#indexList").addEventListener("click", e => {
    const g = e.target.closest("[data-scale-go]"); if (g){ e.stopImmediatePropagation(); zoomTo(g.dataset.scaleGo); return; }
    const r = e.target.closest("[data-sl]"); if (r && SCALE.mode !== "system"){ e.stopImmediatePropagation(); pickItem(items[SCALE.mode][+r.dataset.sl]); }
  }, true);

  // header control
  const seg = document.createElement("div"); seg.className = "scl"; seg.id = "scaleSeg"; seg.setAttribute("role", "group"); seg.setAttribute("aria-label", "Scale");
  seg.innerHTML = Object.entries(L).map(([k, v]) => `<button data-scale="${k}" aria-pressed="${k === "system"}">${v}</button>`).join("");
  $("#homeBtn").after(seg);
  seg.addEventListener("click", e => { const b = e.target.closest("button"); if (b) zoomTo(b.dataset.scale); });
  $("#homeBtn").addEventListener("click", e => { if (SCALE.mode !== "system"){ e.stopImmediatePropagation(); zoomTo("system"); } }, true);
  window.addEventListener("keydown", e => { if (e.key === "Escape" && SCALE.mode !== "system"){ e.stopImmediatePropagation(); zoomTo(STEPS[IDX[SCALE.mode]-1].key); } }, true);

  // frame for the far scales
  const pv = new THREE.Vector3();
  SCALE.frame = dt => {
    FX_HOOKS_SC.forEach(f => f(dt));
    step(Math.min(dt || 1/60, .1));
    if (SCALE.mode === "system") return;
    if (fly){
      const k = easeInOut(Math.min(1, (performance.now()-fly.t0)/fly.dur)), tgt = fly.toTargetFn(new THREE.Vector3());
      controls.target.copy(fly.fromT).lerp(tgt, k);
      const len = Math.exp(Math.log(fly.fromO.length())*(1-k) + Math.log(fly.endOffset.length())*k);
      camera.position.copy(controls.target).add(fly.fromO.clone().lerp(fly.endOffset, k).setLength(len));
      if (k >= 1) fly = null;
    }
    controls.update();
    fadeLabels(lab, draw());
    // labels with simple decluttering
    const W = canvas.clientWidth, H = canvas.clientHeight, placed = [], list = items[SCALE.mode];
    const cand = [];
    list.forEach(it => { pv.copy(it.pos).project(camera); let ok = pv.z < 1 && Math.abs(pv.x) < 1.1 && Math.abs(pv.y) < 1.1;
      if (ok && it.minD){ const dd = camera.position.distanceTo(it.pos); ok = dd > it.minD[0] && dd < it.minD[1]; }
      if (!ok || !showLabels && !it.home){ if (it.vis !== false){ it.el.style.opacity = 0; it.el.style.pointerEvents = "none"; it.vis = false; } return; }
      cand.push({it, x:(pv.x*.5+.5)*W, y:(-pv.y*.5+.5)*H, pri:it.pri + (it === sel ? 1000 : 0)}); });
    cand.sort((a, b) => b.pri - a.pri);
    cand.forEach(c => { const w = c.it.name.length*7 + 18, r = [c.x - 5, c.y - 9, c.x + w, c.y + 9];
      if (placed.some(p => r[0] < p[2] && r[2] > p[0] && r[1] < p[3] && r[3] > p[1])){ if (c.it.vis !== false){ c.it.el.style.opacity = 0; c.it.el.style.pointerEvents = "none"; c.it.vis = false; } return; }
      placed.push(r); c.it.el.style.transform = `translate(${(c.x-5).toFixed(1)}px,${(c.y-9).toFixed(1)}px)`;
      if (c.it.vis !== true){ c.it.el.style.opacity = 1; c.it.el.style.pointerEvents = "auto"; c.it.vis = true; } });
  };
  // helpers for the Local Group and cosmic-web builders
  SCALE.lib = { M, GAL_N, gal2three, pointsFrom, starMat, smooth, KPC, SU, items, sc };
})();

/* ============================================================
   BEYOND THE MILKY WAY
   Local Group (1 unit = 1,000 light-years) and the cosmic web
   (1 unit = 1 million light-years). Galaxies, groups, clusters,
   superclusters, walls and voids sit at their catalogued sky
   positions and distances; the filaments between them are a
   statistical model of the cosmic web, not a map.
   ============================================================ */
(function(){
  const { M, GAL_N, items, sc } = SCALE.lib;
  const KPC = SCALE.lib.KPC;
  const OBL = 23.4392911*DEG, cO = Math.cos(OBL), sO = Math.sin(OBL);
  // J2000 equatorial direction -> scene axes (ecliptic, three.js y up), the same frame every other scale uses
  const eqDir = (ra, dec) => { const a = ra*DEG, d = dec*DEG, x = Math.cos(d)*Math.cos(a), y = Math.cos(d)*Math.sin(a), z = Math.sin(d);
    return new THREE.Vector3(x, -y*sO + z*cO, -(y*cO + z*sO)); };
  const rnd = rng(31415), gauss = () => { let u = 0; while (!u) u = rnd(); return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*rnd()); };
  const D = typeof COSMOS !== "undefined" ? COSMOS : { localGroup:[], clusters:[], laniakea:{}, universe:{} };
  const fmtLy = kly => kly >= 1000 ? `${(kly/1000).toFixed(kly < 10000 ? 2 : 1)} million ly` : `${Math.round(kly).toLocaleString("en-US")},000 ly`;
  const fmtMly = m => m >= 1000 ? `${(m/1000).toFixed(m < 10000 ? 2 : 1)} billion ly` : `${Math.round(m).toLocaleString("en-US")} million ly`;
  const glowT = glowTex([[0,"rgba(255,255,255,1)"],[.2,"rgba(255,255,255,.5)"],[.55,"rgba(255,255,255,.1)"],[1,"rgba(0,0,0,0)"]]);
  function sprite(S, pos, size, col, op){ const s = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowT, color:new THREE.Color(col), blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, opacity:op == null ? 1 : op }));
    s.position.copy(pos); s.scale.setScalar(size); S.add(s); return s; }
  /* point clouds whose dots shrink with distance (sizes in scene units) */
  function cloud(S, list, maxPx, gain){
    const g = new THREE.BufferGeometry(), pos = [], col = [], size = [];
    list.forEach(p => { pos.push(p.x, p.y, p.z); const c = new THREE.Color(p.c); col.push(c.r*p.k, c.g*p.k, c.b*p.k); size.push(p.s); });
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("aCol", new THREE.Float32BufferAttribute(col, 3)); g.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1));
    const m = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, uniforms:{ tex:{value:DOT_TEX}, px:{value:600}, fade:{value:1} },
      vertexShader:`attribute vec3 aCol;attribute float aSize;uniform float px;varying vec3 vC;varying float vA;${LOGDEPTH_V}
        void main(){vec4 mv=modelViewMatrix*vec4(position,1.);float s=aSize*px/(-mv.z);gl_PointSize=clamp(s,1.,${maxPx.toFixed(1)});vA=clamp(s/1.6,.08,1.)*min(1.,${maxPx.toFixed(1)}/s);vC=aCol;gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
      fragmentShader:`uniform sampler2D tex;uniform float fade;varying vec3 vC;varying float vA;${LOGDEPTH_F}void main(){${LOGDEPTH_FM}float a=texture2D(tex,gl_PointCoord).a;gl_FragColor=vec4(vC*a*vA*${(gain || 1).toFixed(2)}*fade,1.);}` });
    const p = new THREE.Points(g, m); p.frustumCulled = false; S.add(p); FX_HOOKS_SC.push(() => m.uniforms.px.value = fxPx()); return p;
  }
  /* a copy of the Milky Way model, re-scaled, for whole-galaxy views */
  function spiralCopy(S, unitsPerKpc, basis, tint, scale){
    const m = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, uniforms:{ tex:{value:DOT_TEX}, px:{value:600}, fade:{value:1}, tint:{value:new THREE.Color(tint || "#ffffff")} },
      vertexShader:`attribute vec3 aCol;attribute float aSize;uniform float px;uniform vec3 tint;varying vec3 vC;varying float vA;${LOGDEPTH_V}
        void main(){vec4 mv=modelViewMatrix*vec4(position,1.);float s=aSize*${(KPC).toFixed(2)}*px/(-mv.z)*${(unitsPerKpc/KPC*(scale||1)).toFixed(6)};gl_PointSize=clamp(s,1.,5.);vA=clamp(s/2.,.05,1.)*min(1.,5./s);vC=aCol*tint;gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
      fragmentShader:`uniform sampler2D tex;uniform float fade;varying vec3 vC;varying float vA;${LOGDEPTH_F}void main(){${LOGDEPTH_FM}float a=texture2D(tex,gl_PointCoord).a;gl_FragColor=vec4(vC*a*vA*.55*fade,1.);}` });
    const p = new THREE.Points(SCALE.mwGeo, m); p.frustumCulled = false;
    const g = new THREE.Group(); g.matrixAutoUpdate = false; g.matrix.copy(basis).scale(new THREE.Vector3(1,1,1).multiplyScalar(unitsPerKpc/KPC*(scale||1))); g.add(p); S.add(g);
    FX_HOOKS_SC.push(() => m.uniforms.px.value = fxPx()); return g;
  }
  /* orientation of a disc galaxy from its inclination and position angle on the sky */
  function discBasis(pos, incl, pa){
    const L = pos.clone().normalize(), up = eqDir(0, 90), N = up.clone().sub(L.clone().multiplyScalar(up.dot(L))).normalize(), E = new THREE.Vector3().crossVectors(N, L).normalize();
    const p = pa*DEG, major = N.clone().multiplyScalar(Math.cos(p)).addScaledVector(E, Math.sin(p)).normalize(), minor = N.clone().multiplyScalar(-Math.sin(p)).addScaledVector(E, Math.cos(p));
    const n = L.clone().multiplyScalar(Math.cos(incl*DEG)).addScaledVector(minor, Math.sin(incl*DEG)).normalize();
    // the model's own axes: three-galactic x (toward its centre-from-Sun), y (its north pole), z
    return new THREE.Matrix4().makeBasis(major, n, new THREE.Vector3().crossVectors(major, n).normalize());
  }
  const add = (S, it) => { items[S].push(it); return it; };
  const COL = { spiral:"#cfd8ff", elliptical:"#ffe1b0", irregular:"#bcd0ff", dwarf:"#f4e3c8" };

  /* ======================= LOCAL GROUP ======================= */
  (function(){
    const S = sc.group, U = 1;   // 1 unit = 1,000 ly
    const mwBasis = M.clone();
    spiralCopy(S, KPC/100, mwBasis, "#ffffff", 1);
    add("group", { name:"Milky Way", pos:new THREE.Vector3(), cls:"sun", pri:200, home:1, grp:"Big three", size:60, dist:"you are here",
      info:{ name:"The Milky Way", eyebrow:"Our galaxy · barred spiral", facts:{ "Diameter":"about 100,000 light-years (stars thin out further)", "Stars":"100–400 billion", "Satellites":"60+ known dwarf galaxies" }, blurb:"Seen from outside, our galaxy is a barred spiral. It is one of the two giants of the Local Group, along with Andromeda." } });
    let m31pos = null;
    (D.localGroup || []).forEach(g => {
      if (/^Milky Way$/i.test(g.name) || g.ra_deg == null || !g.dist_kly) return;
      const pos = eqDir(g.ra_deg, g.dec_deg).multiplyScalar(g.dist_kly*U);
      const big = /Andromeda Galaxy|M31\b|Messier 31/i.test(g.name) ? "m31" : /Triangulum Galaxy|M33\b|Messier 33/i.test(g.name) ? "m33" : null;
      const type = (g.type || "dwarf").toLowerCase();
      const col = type.includes("spiral") ? COL.spiral : type.includes("ellip") ? COL.elliptical : type.includes("irreg") ? COL.irregular : COL.dwarf;
      const diam = Math.max(.6, g.diam_kly || 2);
      if (big === "m31"){ m31pos = pos.clone(); spiralCopy(S, KPC/100, discBasis(pos, 77, 38).setPosition(pos), "#ffe8d0", 1.55); sprite(S, pos, 40, "#ffe2c0", .5); }
      else if (big === "m33"){ spiralCopy(S, KPC/100, discBasis(pos, 55, 23).setPosition(pos), "#d8e2ff", .6); sprite(S, pos, 14, "#dbe4ff", .45); }
      else if (/Magellanic/i.test(g.name)){ const pts = []; for (let i=0;i<(/Large/.test(g.name) ? 2200 : 1100);i++){ const r = Math.abs(gauss())*diam*.28; const a = rnd()*TAU; const v = new THREE.Vector3(Math.cos(a)*r*(1 + .5*rnd()), gauss()*diam*.08, Math.sin(a)*r*.7).add(pos); pts.push({x:v.x, y:v.y, z:v.z, c:rnd() < .7 ? "#c8d6ff" : "#ff9ab8", s:.25 + rnd()*.35, k:.8}); } cloud(S, pts, 4, .9); sprite(S, pos, diam*1.2, "#cfd8ff", .35); }
      else { const pts = []; const n = Math.round(Math.min(600, 40 + diam*30)); for (let i=0;i<n;i++){ const v = new THREE.Vector3(gauss(), gauss()*.8, gauss()).multiplyScalar(diam*.22).add(pos); pts.push({x:v.x, y:v.y, z:v.z, c:col, s:.18 + rnd()*.2, k:.75}); } cloud(S, pts, 3, .8); sprite(S, pos, diam*1.6, col, .3); }
      const facts = { "Distance": fmtLy(g.dist_kly), "Type": g.type || "dwarf galaxy" };
      if (g.diam_kly) facts["Diameter"] = `about ${fmtLy(g.diam_kly)}`;
      if (g.parent && g.parent !== "none") facts["Satellite of"] = g.parent;
      add("group", { name:g.name, pos, cls:big ? "gc" : "obj", pri:big ? 150 : (g.diam_kly || 1)*1 + (g.parent === "Milky Way" ? 8 : 0), size:Math.max(diam*2, big ? 160 : 6), dist:fmtLy(g.dist_kly).replace(" light-years",""),
        grp: big || /Magellanic/i.test(g.name) ? "Big three & Magellanic Clouds" : g.parent === "Milky Way" ? "Milky Way satellites" : g.parent === "Andromeda" ? "Andromeda satellites" : "Other Local Group members",
        info:{ name:g.name, eyebrow:(g.type || "Dwarf galaxy") + (g.approx ? " · approximate" : ""), facts, blurb:(g.note || "") + (big === "m31" ? " Andromeda and the Milky Way are falling toward each other at about 110 km/s. A 2025 study puts the chance of a merger within the next 10 billion years at roughly 50%." : "") } });
    });
    SCALE.groupHome = m31pos ? m31pos.clone().multiplyScalar(.45) : new THREE.Vector3();
    // a faint sphere marking the Local Group's zero-velocity surface (~3 Mly radius around the barycentre)
    const zv = new THREE.Mesh(new THREE.SphereGeometry(3000, 40, 20), new THREE.MeshBasicMaterial({ color:0x6d86b0, wireframe:true, transparent:true, opacity:.022, depthWrite:false }));
    zv.position.copy(SCALE.groupHome); S.add(zv);
    add("group", { name:"Local Group", pos:SCALE.groupHome.clone().add(new THREE.Vector3(0, 3100, 0)), cls:"reg", pri:60, grp:"Structure",
      info:{ name:"The Local Group", eyebrow:"Our galaxy group", facts:{ "Size":"about 10 million light-years across", "Members":"80+ galaxies, mostly dwarfs", "Mass":"about 2–3 trillion Suns" }, blurb:"A gravitationally bound family dominated by Andromeda and the Milky Way, with Triangulum a distant third. The faint sphere marks roughly where galaxies stop falling inward and start moving away with the expansion of the universe." } });
    // a sprinkle of distant background galaxies so empty space isn't uniformly black
    const bg = []; for (let i=0;i<1500;i++){ const v = new THREE.Vector3(gauss(), gauss(), gauss()).normalize().multiplyScalar(30000 + rnd()*60000); bg.push({x:v.x, y:v.y, z:v.z, c:rnd() < .5 ? "#ffe6c8" : "#cdd8ff", s:300 + rnd()*400, k:.5}); }
    cloud(S, bg, 2.5, .6);
  })();

  /* ======================= COSMIC WEB ======================= */
  (function(){
    const S = sc.cosmos;    // 1 unit = 1 million ly
    const mob = COARSE || Math.min(innerWidth, innerHeight) < 600, N = mob ? .5 : 1;
    // the Local Group in miniature
    const lg = []; (D.localGroup || []).forEach(g => { if (g.ra_deg == null) return; const v = eqDir(g.ra_deg, g.dec_deg).multiplyScalar(g.dist_kly/1000); lg.push({x:v.x, y:v.y, z:v.z, c:"#ffe6c8", s:/Andromeda Galaxy|Triangulum Galaxy/.test(g.name) ? .25 : .06, k:1}); });
    lg.push({x:0, y:0, z:0, c:"#fff2dc", s:.2, k:1.3});
    cloud(S, lg, 6, 1.2);
    add("cosmos", { name:"Local Group · you are here", pos:new THREE.Vector3(), cls:"sun", pri:200, home:1, grp:"Nearby", size:5, info:{ name:"The Local Group", eyebrow:"Our galaxy group", facts:{ "Size":"about 10 million light-years" }, blurb:"At this scale our whole galaxy group, Milky Way and Andromeda included, is a small knot on the outskirts of the Virgo Cluster's neighbourhood." } });
    // catalogued structures
    const nodes = [{ p:new THREE.Vector3(), w:1 }];
    const voids = [];
    const KIND_COL = { group:"#ffe8cc", cluster:"#ffd9a8", supercluster:"#ffc98a", wall:"#ffb980", attractor:"#ffa070", void:"#6f8fc0" };
    (D.clusters || []).forEach(c => {
      if (c.ra_deg == null || c.dist_mly == null || /^Local Group/i.test(c.name)) return;
      const pos = eqDir(c.ra_deg, c.dec_deg).multiplyScalar(c.dist_mly), size = Math.max(1.5, c.size_mly || 10), kind = (c.kind || "cluster").toLowerCase();
      if (kind === "void"){
        voids.push({ p:pos, r:size/2 });
        const ring = new THREE.Mesh(new THREE.SphereGeometry(size/2, 32, 16), new THREE.MeshBasicMaterial({ color:0x4f6f9f, wireframe:true, transparent:true, opacity:size > 900 ? .012 : .03, depthWrite:false })); ring.position.copy(pos); S.add(ring);
      } else {
        const n = Math.round(Math.min(2500, 60 + Math.sqrt(c.members || 50)*25)*N), pts = [];
        const flat = kind === "wall" ? [1, .12, .35] : kind === "supercluster" ? [1, .45, .7] : [1, 1, 1];
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd()*TAU, rnd()*TAU, rnd()*TAU));
        for (let i=0;i<n;i++){ const v = new THREE.Vector3(gauss()*flat[0], gauss()*flat[1], gauss()*flat[2]).multiplyScalar(size*(kind === "cluster" || kind === "group" ? .18 : .28)).applyQuaternion(q).add(pos);
          pts.push({x:v.x, y:v.y, z:v.z, c:rnd() < .6 ? "#ffe4c0" : "#d0dcff", s:Math.max(.08, size*.004) + rnd()*.1, k:.75}); }
        cloud(S, pts, 4, .9);
        sprite(S, pos, size*(kind === "cluster" ? 1.4 : 1), KIND_COL[kind] || "#ffd9a8", kind === "wall" ? .18 : .32);
        nodes.push({ p:pos, w:kind === "cluster" ? 3 : kind === "group" ? 1 : 2 });
      }
      add("cosmos", { name:c.name, pos, cls:kind === "void" ? "reg" : "obj", pri:(kind === "supercluster" || kind === "wall" ? 70 : kind === "cluster" ? 55 : kind === "attractor" ? 65 : 40) - Math.log10(c.dist_mly + 1)*5,
        size:Math.max(size, 6), dist:fmtMly(c.dist_mly).replace(" light-years",""), grp:{group:"Galaxy groups", cluster:"Clusters", supercluster:"Superclusters", wall:"Walls & great structures", attractor:"Superclusters", void:"Voids"}[kind] || "Structures",
        info:{ name:c.name, eyebrow:(c.kind || "structure").replace(/^./, x => x.toUpperCase()) + (c.approx ? " · approximate" : "") + (c.far ? " · very distant" : ""), facts:Object.assign({ "Distance":fmtMly(c.dist_mly) }, c.size_mly ? { "Size":`about ${fmtMly(c.size_mly)}` } : {}, c.members ? { "Galaxies":`about ${Number(c.members).toLocaleString("en-US")}` } : {}), blurb:c.note || "" } });
    });
    // Laniakea: our supercluster, ~520 Mly across, centred near the Great Attractor
    const lan = D.laniakea || {}, ga = (D.clusters || []).find(c => /Great Attractor/i.test(c.name));
    const lanC = ga ? eqDir(ga.ra_deg, ga.dec_deg).multiplyScalar(ga.dist_mly*.55) : new THREE.Vector3(80, -40, 60);
    const lanR = (lan.diameter_mly || 520)/2;
    { const pts = []; for (let i=0;i<9000*N;i++){ const v = new THREE.Vector3(gauss(), gauss()*.55, gauss()*.8).multiplyScalar(lanR*.42); if (v.length() > lanR) continue; v.add(lanC); pts.push({x:v.x, y:v.y, z:v.z, c:"#ffb38a", s:.9 + rnd()*1.4, k:.22}); } cloud(S, pts, 3, .7); }
    add("cosmos", { name:"Laniakea Supercluster", pos:lanC.clone().add(new THREE.Vector3(0, lanR*.65, 0)), cls:"reg", pri:95, size:lanR*2.2, grp:"Our supercluster",
      info:{ name:"Laniakea", eyebrow:"Our home supercluster", facts:{ "Diameter":`about ${fmtMly(lanR*2)}`, "Galaxies":"about 100,000", "Mass":"about 100 million billion Suns", "Defined":"Tully et al. 2014" }, blurb:"Laniakea ('immeasurable heaven' in Hawaiian) is defined by how galaxies move: inside it, galaxies flow toward a common centre near the Great Attractor. The Virgo Supercluster, which contains the Local Group, is one of its limbs. Its boundary here is drawn as a soft cloud, not its true irregular shape." } });
    // the cosmic web: filaments joining real and statistical nodes, avoiding catalogued voids
    const R0 = 1600;
    for (let i=0;i<(mob ? 300 : 520);i++){
      let p, ok = false, tries = 0;
      while (!ok && tries++ < 20){ p = new THREE.Vector3(gauss(), gauss(), gauss()).normalize().multiplyScalar(Math.pow(rnd(), .45)*R0); ok = !voids.some(v => p.distanceTo(v.p) < v.r*.9); }
      nodes.push({ p, w:rnd() < .2 ? 2 : 1 });
    }
    const web = [];
    nodes.forEach((a, i) => {
      const near = nodes.map((b, j) => [j, a.p.distanceToSquared(b.p)]).filter(x => x[0] !== i).sort((x, y) => x[1] - y[1]).slice(0, 3);
      near.forEach(([j, d2]) => {
        if (j < i && nodes[j].done && nodes[j].done.has(i)) return; (a.done = a.done || new Set()).add(j);
        const b = nodes[j], L = Math.sqrt(d2); if (L > 420) return;
        const mid = a.p.clone().add(b.p).multiplyScalar(.5).add(new THREE.Vector3(gauss(), gauss(), gauss()).multiplyScalar(L*.12));
        const n = Math.round(L*(mob ? .5 : 1));
        for (let k=0;k<n;k++){ const t = rnd(), u = 1 - t; const v = a.p.clone().multiplyScalar(u*u).addScaledVector(mid, 2*u*t).addScaledVector(b.p, t*t).add(new THREE.Vector3(gauss(), gauss(), gauss()).multiplyScalar(2.5 + L*.012));
          web.push({x:v.x, y:v.y, z:v.z, c:rnd() < .55 ? "#9fb8ff" : "#d8c0ff", s:1.4 + rnd()*2, k:.5}); }
      });
      // clusters at the knots
      const m = a.w*(mob ? 30 : 60); for (let k=0;k<m;k++){ const v = a.p.clone().add(new THREE.Vector3(gauss(), gauss(), gauss()).multiplyScalar(4 + a.w*2)); web.push({x:v.x, y:v.y, z:v.z, c:"#ffe0c0", s:1.4 + rnd()*2, k:.6}); }
    });
    cloud(S, web, 3.5, 1);
    // further out the web continues statistically to the edge of the observable universe
    const U = D.universe || {}, Rmax = (U.radius_gly || 46.5)*1000;
    { const pts = []; for (let i=0;i<(mob ? 18000 : 36000);i++){ const r = R0 + Math.pow(rnd(), .6)*(Rmax*.92 - R0); const dir = new THREE.Vector3(gauss(), gauss(), gauss()).normalize();
        const cell = Math.sin(dir.x*13.1 + r*.004)*Math.sin(dir.y*11.7 + r*.0037)*Math.sin(dir.z*12.3 - r*.0041); if (Math.abs(cell) > .35 && rnd() < .8) continue;
        const v = dir.multiplyScalar(r); pts.push({x:v.x, y:v.y, z:v.z, c:rnd() < .5 ? "#a8b8ff" : "#e0c8ff", s:12 + r*.004, k:.3}); }
      cloud(S, pts, 2.5, .8); }
    // the cosmic microwave background: the edge of what we can see
    const cmbM = new THREE.ShaderMaterial({ side:THREE.BackSide, transparent:true, depthWrite:false, uniforms:{ fade:{value:1}, vis:{value:0} },
      vertexShader:`varying vec3 vP;${LOGDEPTH_V}void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);${LOGDEPTH_VM}}`,
      fragmentShader:`uniform float fade;uniform float vis;varying vec3 vP;${GLSL_NOISE}${LOGDEPTH_F}void main(){${LOGDEPTH_FM}float n=fbm(vP*6.)*.6+snoise(vP*22.)*.25;
        vec3 c=mix(vec3(.05,.12,.45),vec3(.95,.55,.12),smoothstep(-.45,.45,n));gl_FragColor=vec4(c*.45,.38*fade*vis);}` });
    const cmb = new THREE.Mesh(new THREE.SphereGeometry(Rmax, 96, 48), cmbM); cmb.frustumCulled = false; S.add(cmb);
    FX_HOOKS_SC.push(() => { const d = camera.position.length(); cmbM.uniforms.vis.value = SCALE.mode === "cosmos" ? Math.min(1, Math.max(0, (d - Rmax*.25)/(Rmax*.6))) : 0; });
    add("cosmos", { name:"Edge of the observable universe", pos:new THREE.Vector3(0, Rmax*.98, 0), cls:"reg", pri:80, size:Rmax*2.4, grp:"The whole picture",
      info:{ name:"The observable universe", eyebrow:"As far as light can reach us", facts:{ "Radius":`about ${(Rmax/1000).toFixed(1)} billion light-years`, "Age":`${U.age_gyr || 13.8} billion years`, "Galaxies":U.galaxies_note || "hundreds of billions to about 2 trillion", "Afterglow":`cosmic microwave background, ${U.cmb_K || 2.725} K` }, blurb:"Light from further away hasn't had time to reach us. The glowing shell is the cosmic microwave background, light released 380,000 years after the Big Bang, shown with exaggerated hot and cold spots. The universe itself almost certainly continues beyond it. Expansion means the edge is 46 billion light-years away even though the universe is only 13.8 billion years old." } });
    add("cosmos", { name:"Cosmic web (model)", pos:new THREE.Vector3(R0*.7, R0*.5, -R0*.4), cls:"reg", pri:50, size:R0*2.5, grp:"The whole picture",
      info:{ name:"The cosmic web", eyebrow:"Largest structure there is", facts:{ "Filaments":"tens to hundreds of millions of light-years long", "Voids":"typically 30–300 million light-years across" }, blurb:"Galaxies are not scattered evenly: dark matter's gravity pulled matter into a web of sheets and filaments, with clusters at the knots and huge, nearly empty voids between. Galaxy surveys such as SDSS and DESI map it. The named clusters, superclusters, walls and voids here are real; the filaments joining them are a statistical model." } });
  })();
})();

/* ============================================================
   DEEP TIME — animated chapters from the solar nebula to the
   Sun's red-giant future. Each chapter builds its own little
   scene, plays a timeline with narration, and can be scrubbed.
   These are illustrations of what models describe, sped up
   enormously; the narration says what is known and debated.
   ============================================================ */
(function(){
  const S = new THREE.Scene(); S.background = new THREE.Color(0x020205);
  S.add(new THREE.AmbientLight(0x404858, .35));
  const lamp = new THREE.PointLight(0xffffff, 1.6, 0, 0); S.add(lamp);
  const root = new THREE.Group(); S.add(root);
  const lab = document.createElement("div"); lab.id = "labels3"; $("#app").insertBefore(lab, $("#labels").nextSibling);
  const bar = document.createElement("div"); bar.id = "deepbar"; $("#app").appendChild(bar);
  bar.innerHTML = `<button id="dtPlay" aria-label="Pause"><svg width="14" height="14" viewBox="0 0 14 14"><path id="dtIco" d="M3 2h3v10H3zM8 2h3v10H8z" fill="currentColor"/></svg></button><button id="dtRe" class="chip">Replay</button><div class="dtw"><input id="dtScrub" type="range" min="0" max="1000" value="0" aria-label="Timeline"><div id="dtStamp"></div></div><button id="dtPrev" class="chip">‹ Prev</button><button id="dtNext" class="chip">Next ›</button><button id="dtExit" class="chip home">Back to today</button>`;
  const rnd = rng(4600);
  const gauss = () => { let u = 0; while (!u) u = rnd(); return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*rnd()); };

  /* ---------- shared materials ---------- */
  function partMat(opts){
    return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:opts && opts.normal ? THREE.NormalBlending : THREE.AdditiveBlending,
      uniforms:{ tex:{value:DOT_TEX}, px:{value:600}, k:{value:1}, ...(opts && opts.u || {}) },
      vertexShader:`attribute vec3 aCol;attribute float aSize;attribute float aA;uniform float px;uniform float k;${opts && opts.decl || ""}varying vec3 vC;varying float vA;${LOGDEPTH_V}
        void main(){ vec3 p=position; float alpha=aA; ${opts && opts.vs || ""}
          vec4 mv=modelViewMatrix*vec4(p,1.);float s=aSize*px/(-mv.z);gl_PointSize=clamp(s,1.,${(opts && opts.max || 16).toFixed(1)});vA=alpha*k*clamp(s/1.5,.2,1.);vC=aCol;gl_Position=projectionMatrix*mv;${LOGDEPTH_VM}}`,
      fragmentShader:`uniform sampler2D tex;varying vec3 vC;varying float vA;${LOGDEPTH_F}void main(){${LOGDEPTH_FM}float a=texture2D(tex,gl_PointCoord).a;gl_FragColor=${opts && opts.normal ? "vec4(vC,a*vA)" : "vec4(vC*a*vA,1.)"};}`
    });
  }
  function cloud(n, fill, opts){
    const pos = new Float32Array(n*3), col = new Float32Array(n*3), size = new Float32Array(n), al = new Float32Array(n), extra = {};
    (opts && opts.attrs || []).forEach(([k, w]) => extra[k] = new Float32Array(n*w));
    for (let i=0;i<n;i++) fill(i, pos, col, size, al, extra);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("aCol", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1)); g.setAttribute("aA", new THREE.BufferAttribute(al, 1));
    Object.entries(extra).forEach(([k, a]) => g.setAttribute(k, new THREE.BufferAttribute(a, a.length/n)));
    const m = partMat(opts); const p = new THREE.Points(g, m); p.frustumCulled = false; root.add(p); return p;
  }
  const setC = (arr, i, hex, k) => { const c = new THREE.Color(hex); arr[i*3] = c.r*(k||1); arr[i*3+1] = c.g*(k||1); arr[i*3+2] = c.b*(k||1); };
  function glow(hex, size, op){ const s = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex([[0,"rgba(255,255,255,1)"],[.18,"rgba(255,255,255,.55)"],[.5,"rgba(255,255,255,.12)"],[1,"rgba(0,0,0,0)"]]), color:new THREE.Color(hex), blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, opacity:op == null ? 1 : op })); s.scale.setScalar(size); root.add(s); return s; }
  // molten / cooling rocky world
  function lavaMat(seed, crust){
    return new THREE.ShaderMaterial({ uniforms:{ time:{value:0}, heat:{value:1}, seed:{value:seed}, crust:{value:new THREE.Color(crust || "#3a2a22")}, L:{value:new THREE.Vector3(1,.3,.5).normalize()}, ocean:{value:0} },
      vertexShader:`varying vec3 vP;varying vec3 vN;varying vec3 vV;${LOGDEPTH_V}void main(){vP=position;vec4 w=modelMatrix*vec4(position,1.);vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;${LOGDEPTH_VM}}`,
      fragmentShader:`uniform float time;uniform float heat;uniform float seed;uniform vec3 crust;uniform vec3 L;uniform float ocean;varying vec3 vP;varying vec3 vN;varying vec3 vV;${GLSL_NOISE}${LOGDEPTH_F}
        void main(){${LOGDEPTH_FM}
          vec3 p=normalize(vP);
          float n=fbm(p*3.+vec3(seed,time*.03,0.));
          float cracks=1.-abs(snoise(p*7.+vec3(0.,seed,time*.05)));
          float molten=smoothstep(.15,.95,cracks*.7+n*.6+heat*.75-.55);
          vec3 lava=mix(vec3(.9,.25,.03),vec3(1.,.82,.4),pow(molten,2.));
          vec3 rock=crust*(.75+.5*n);
          rock=mix(rock,vec3(.08,.2,.38)*(.8+.3*n),ocean*smoothstep(-.05,.15,-n));
          float d=max(dot(normalize(vN),L),0.);
          vec3 col=rock*(d*.9+.06)+lava*molten*heat*1.4;
          float rim=pow(1.-max(dot(normalize(vN),vV),0.),3.);
          col+=vec3(1.,.45,.15)*rim*heat*.6;
          gl_FragColor=vec4(col,1.);}`
    });
  }
  function ball(r, mat){ const m = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), mat); m.scale.setScalar(r); root.add(m); return m; }
  function ring(r, hex, op, dashed){ const g = new THREE.BufferGeometry().setFromPoints(Array.from({length:181}, (_, i) => new THREE.Vector3(Math.cos(i/180*TAU)*r, 0, Math.sin(i/180*TAU)*r)));
    const m = dashed ? new THREE.LineDashedMaterial({ color:hex, dashSize:r*.04, gapSize:r*.03, transparent:true, opacity:op, depthWrite:false }) : new THREE.LineBasicMaterial({ color:hex, transparent:true, opacity:op, depthWrite:false });
    const l = new THREE.Line(g, m); if (dashed) l.computeLineDistances(); root.add(l); if (!dashed){ l.visible = showOrbits; ORBIT_LINES_EXTRA.push(l); } return l; }
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a)/(b - a))); return t*t*(3 - 2*t); };

  /* ---------- chapters ---------- */
  const CH = [
  { id:"nebula", when:"4.6 billion years ago", title:"The solar nebula collapses", dur:20, cam:[0, 380, 760],
    text:[[0,"Everything starts as a cold cloud of gas and dust, mostly hydrogen and helium with a sprinkle of heavier elements made by earlier generations of stars. The shock wave of a nearby supernova may have set off the collapse; meteorites hold traces of short-lived isotopes that point that way, though this is still debated."],
          [7,"As the cloud falls inward it spins faster, the way a skater does when pulling in their arms, and flattens into a disk."],
          [13,"Material piles up in the middle and heats until it glows: a protostar, the Sun-to-be. The whole collapse took on the order of 100,000 years."]],
    build(){
      const n = MOB.on ? 9000 : 18000;
      const p = cloud(n, (i, pos, col, size, al, ex) => {
        const r = 40 + Math.pow(rnd(), .5)*300, th = Math.acos(2*rnd()-1), ph = rnd()*TAU;
        ex.aS[i*3] = r*Math.sin(th)*Math.cos(ph); ex.aS[i*3+1] = r*Math.cos(th); ex.aS[i*3+2] = r*Math.sin(th)*Math.sin(ph);
        const dr = 8 + Math.pow(rnd(), .8)*230; ex.aD[i*2] = dr; ex.aD[i*2+1] = ph;
        setC(col, i, rnd() < .5 ? "#c98a5a" : "#8a5a4a", .9); size[i] = 2 + rnd()*4; al[i] = .35 + rnd()*.4;
      }, { attrs:[["aS",3],["aD",2]], decl:"attribute vec3 aS;attribute vec2 aD;uniform float s;uniform float t;", u:{ s:{value:0}, t:{value:0} },
           vs:`float w=.02+ .9*s*pow(30./max(aD.x,8.),1.2); float ph=aD.y+t*w; vec3 disk=vec3(cos(ph)*aD.x,(aS.y*.04)*(1.-s*.7),sin(ph)*aD.x);
               float ca=cos(t*.03),sa=sin(t*.03); vec3 sp=vec3(aS.x*ca-aS.z*sa,aS.y,aS.x*sa+aS.z*ca);
               p=mix(sp,disk,s); alpha*=mix(1.,1.3-aD.x/260.,s);` });
      const star = glow("#ffd28a", 30, 0);
      return t => { p.material.uniforms.s.value = sm(2, 15, t); p.material.uniforms.t.value = t; star.material.opacity = sm(9, 17, t); star.scale.setScalar(20 + 60*sm(9, 18, t)); lamp.intensity = .5; };
    }},
  { id:"disk", when:"4.57 billion years ago", title:"The protoplanetary disk", dur:22, cam:[0, 300, 560], loop:1,
    text:[[0,"The young Sun is surrounded by a disk of gas and dust. Close in, it is too hot for ice; only rock and metal can condense."],
          [6,"Beyond the frost line, about 2.7 times Earth's distance, water freezes into ice. Extra solid material out here lets giant-planet cores grow quickly."],
          [12,"Forming planets carve gaps and rings, just like the disks ALMA has photographed around young stars such as HL Tauri. Jets of gas blast out of the young Sun's poles."],
          [18,"Dust grains stick into pebbles, then kilometre-sized planetesimals: the building blocks of planets, asteroids and comets."]],
    build(){
      const AU = 20, n = MOB.on ? 12000 : 24000, gaps = [[5.2, .9], [9.5, 1.2], [19, 1.6], [30, 1.8]];
      const p = cloud(n, (i, pos, col, size, al, ex) => {
        let r; do { r = .25 + Math.pow(rnd(), 1.4)*40; } while (gaps.some(([g, w]) => Math.abs(r - g) < w*.5 && rnd() < .9));
        ex.aD[i*3] = r*AU; ex.aD[i*3+1] = rnd()*TAU; ex.aD[i*3+2] = gauss()*r*AU*.03;
        setC(col, i, r < 2.7 ? (rnd() < .5 ? "#ffb070" : "#e07a48") : (rnd() < .5 ? "#a88a78" : "#7a7088"), 1); size[i] = 2.5 + rnd()*4; al[i] = .45;
      }, { attrs:[["aD",3]], decl:"attribute vec3 aD;uniform float t;", u:{ t:{value:0} },
           vs:`float w=3.2*pow(${AU.toFixed(1)}/aD.x,1.5); float ph=aD.y+t*w*.4; p=vec3(cos(ph)*aD.x,aD.z,sin(ph)*aD.x);` });
      const jets = cloud(1800, (i, pos, col, size, al, ex) => { ex.aJ[i*4] = rnd(); ex.aJ[i*4+1] = rnd() < .5 ? 1 : -1; ex.aJ[i*4+2] = rnd()*TAU; ex.aJ[i*4+3] = Math.abs(gauss())*.06; setC(col, i, rnd() < .7 ? "#9fc8ff" : "#ffffff"); size[i] = 3 + rnd()*4; al[i] = .6; },
        { attrs:[["aJ",4]], decl:"attribute vec4 aJ;uniform float t;", u:{ t:{value:0} }, vs:`float f=fract(aJ.x+t*.12); float r=f*340.*aJ.w+4.; p=vec3(cos(aJ.z)*r,aJ.y*(6.+f*340.),sin(aJ.z)*r); alpha*=(1.-f)*(1.-f);` });
      const planetesimals = cloud(500, (i, pos, col, size, al, ex) => { const r = 1 + rnd()*30; ex.aD[i*2] = r*AU; ex.aD[i*2+1] = rnd()*TAU; setC(col, i, "#d8d0c8"); size[i] = 6 + rnd()*5; al[i] = .9; },
        { attrs:[["aD",2]], decl:"attribute vec2 aD;uniform float t;uniform float g;", u:{ t:{value:0}, g:{value:0} }, vs:`float ph=aD.y+t*3.2*pow(${AU.toFixed(1)}/aD.x,1.5)*.4; p=vec3(cos(ph)*aD.x,0.,sin(ph)*aD.x); alpha*=g;` });
      const sun = glow("#fff0d0", 70, 1);
      const frost = ring(2.7*AU, 0x8fd0ff, .55, true);
      return t => { [p, jets, planetesimals].forEach(o => o.material.uniforms.t.value = t); planetesimals.material.uniforms.g.value = sm(16, 20, t); frost.material.opacity = .55*sm(5, 7, t); };
    },
    labels:[["Frost line", () => new THREE.Vector3(54*.707, 0, 54*.707), 5], ["Young Sun", () => new THREE.Vector3(0, 0, 0), 0], ["Gap carved by a forming giant", () => new THREE.Vector3(104*.707, 0, -104*.707), 11]] },
  { id:"planets", when:"4.57 to 4.5 billion years ago", title:"Planets assemble", dur:24, cam:[0, 360, 640],
    text:[[0,"Planetesimals collide and merge into planetary embryos, Moon- to Mars-sized."],
          [5,"Jupiter's core grows fastest, within a few million years, and sweeps up a massive envelope of gas. Saturn follows. Their gravity stirs the asteroid belt, which never formed a planet."],
          [11,"Within about 10 million years the young Sun's wind blows the remaining gas out of the system. The giant planets have to be finished by then."],
          [16,"In the inner system, dozens of embryos crash together over tens of millions of years to build Mercury, Venus, Earth and Mars. Theia was one of the last of these."]],
    build(){
      const AU = 20, n = MOB.on ? 8000 : 16000;
      const gas = cloud(n, (i, pos, col, size, al, ex) => { const r = .3 + Math.pow(rnd(), 1.2)*35; ex.aD[i*3] = r*AU; ex.aD[i*3+1] = rnd()*TAU; ex.aD[i*3+2] = gauss()*r*AU*.035; setC(col, i, r < 2.7 ? "#e0905a" : "#8a7a92"); size[i] = 3 + rnd()*4; al[i] = .35; },
        { attrs:[["aD",3]], decl:"attribute vec3 aD;uniform float t;uniform float fade;", u:{ t:{value:0}, fade:{value:1} },
          vs:`float ph=aD.y+t*1.3*pow(${AU.toFixed(1)}/aD.x,1.5); p=vec3(cos(ph)*aD.x,aD.z,sin(ph)*aD.x); float out_=1.-fade; p*=1.+out_*1.5*(aD.x/700.); alpha*=fade;` });
      const giants = [[5.2, 3.2, "#d8b48a", 3], [9.5, 2.6, "#e8d3a2", 6], [19.2, 1.6, "#9fd6e0", 9], [30, 1.55, "#5f8ee0", 11]].map(([a, R, c, t0]) => {
        const m = ball(R*3, new THREE.MeshStandardMaterial({ color:c, roughness:1, emissive:new THREE.Color(c).multiplyScalar(.12) })); m.userData = {a:a*AU, ph:rnd()*TAU, R:R*3, t0}; return m; });
      const emb = Array.from({length:22}, () => { const m = ball(1.2, lavaMat(rnd()*10)); m.userData = {a:(.35 + rnd()*1.3)*AU, ph:rnd()*TAU, R:1 + rnd()*1.4, alive:1}; return m; });
      const flashes = [];
      const sun = glow("#fff0d0", 60, 1);
      return (t, dt) => {
        gas.material.uniforms.t.value = t; gas.material.uniforms.fade.value = 1 - sm(10, 16, t);
        giants.forEach(m => { const u = m.userData, k = sm(u.t0, u.t0 + 5, t); m.scale.setScalar(Math.max(.01, u.R*k)); m.visible = k > .01; const ph = u.ph + t*1.3*Math.pow(AU/u.a, 1.5); m.position.set(Math.cos(ph)*u.a, 0, Math.sin(ph)*u.a); });
        // inner embryos merge one by one after t=14
        const alive = emb.filter(m => m.userData.alive); const target = Math.max(4, 22 - Math.floor(Math.max(0, t - 14)*2.2));
        while (alive.length > target){ const a = alive.pop(), b = alive.reduce((best, m) => Math.abs(m.userData.a - a.userData.a) < Math.abs(best.userData.a - a.userData.a) ? m : best, alive[0]);
          a.userData.alive = 0; a.visible = false; b.userData.R = Math.cbrt(Math.pow(b.userData.R, 3) + Math.pow(a.userData.R, 3)); const f = glow("#ffd08a", 12, 1); f.position.copy(b.position); flashes.push(f); }
        emb.forEach(m => { const u = m.userData; if (!u.alive) return; const ph = u.ph + t*1.3*Math.pow(AU/u.a, 1.5); m.position.set(Math.cos(ph)*u.a, 0, Math.sin(ph)*u.a); m.scale.setScalar(u.R); m.material.uniforms.time.value = t; m.material.uniforms.L.value.copy(m.position).negate().normalize(); });
        flashes.forEach(f => { f.material.opacity *= .94; });
        if (t < .05){ emb.forEach(m => { m.visible = true; m.userData.alive = 1; }); }
      };
    },
    labels:[["Jupiter", () => null, 4, "giant0"], ["Frost line", () => new THREE.Vector3(38, 0, 38), 0]] },
  { id:"theia", when:"4.5 billion years ago", title:"Theia hits Earth: the Moon is born", dur:34, cam:[0, 70, 180],
    text:[[0,"About 50 to 100 million years after the Sun formed, a Mars-sized world called Theia is on a collision course with the young Earth."],
          [4.5,"Impact. A glancing blow at around 45°. Both surfaces melt, and much of Theia's iron core sinks into Earth."],
          [8,"Molten rock and vapour are thrown into orbit, forming a glowing disk around Earth; some models make it a giant spinning doughnut of vapour called a synestia."],
          [16,"Beyond the Roche limit, about 3 Earth radii out, Earth's tides can no longer tear clumps apart, so the debris gathers together."],
          [22,"The Moon forms, in as little as hours in some simulations or over about a century in others, only about 25,000 km away and looming huge in the sky."],
          [28,"It has been drifting outward ever since: it is now 384,000 km away and still recedes 3.8 cm a year. Apollo rocks with oxygen isotopes almost identical to Earth's support the impact idea; remnants of Theia may survive as two huge blobs deep in Earth's mantle."]],
    build(){
      const RE = 10, earth = ball(RE, lavaMat(1.3, "#4a3a30")), theia = ball(RE*.53, lavaMat(7.1, "#3a3640"));
      theia.material.uniforms.heat.value = .25; earth.material.uniforms.heat.value = .4;
      const moon = ball(.1, lavaMat(4.2, "#5a5650")); moon.visible = false;
      const impactDir = new THREE.Vector3(-1, .15, .55).normalize(), impactP = impactDir.clone().multiplyScalar(RE);
      const start = new THREE.Vector3(-150, 18, -40), tangent = new THREE.Vector3().crossVectors(impactDir, new THREE.Vector3(0,1,0)).normalize();
      const N = MOB.on ? 3500 : 7000, GM = 3000;
      const ps = new Float32Array(N*3), vs = new Float32Array(N*3), live = new Uint8Array(N);
      const debris = cloud(N, (i, pos, col, size, al) => { setC(col, i, rnd() < .55 ? "#ffb060" : "#ffe2a8"); size[i] = .9 + rnd()*1.2; al[i] = 0; }, { max:9 });
      const P = debris.geometry.attributes.position, A = debris.geometry.attributes.aA, C = debris.geometry.attributes.aCol;
      let spawned = false, flash = glow("#fff2d0", 10, 0), moonM = 0, moonR = 0;
      const moonOrb = { a:34, ph:0 };
      function spawn(){
        spawned = true;
        for (let i=0;i<N;i++){
          const p = impactP.clone().addScaledVector(impactDir, rnd()*3).add(new THREE.Vector3(gauss(), gauss(), gauss()).multiplyScalar(2.5));
          const vc = Math.sqrt(GM/RE), sp = vc*(.95 + rnd()*.33);
          const v = tangent.clone().multiplyScalar(sp).addScaledVector(impactDir, vc*(.05 + rnd()*.3)).add(new THREE.Vector3(gauss(), gauss()*.6, gauss()).multiplyScalar(vc*.08));
          ps.set([p.x, p.y, p.z], i*3); vs.set([v.x, v.y, v.z], i*3); live[i] = 1; A.array[i] = .9;
        }
      }
      return (t, dt) => {
        earth.material.uniforms.time.value = t; theia.material.uniforms.time.value = t; moon.material.uniforms.time.value = t;
        earth.rotation.y += dt*(.6 + sm(4.5, 6, t)*1.6);
        if (t < 4.5){
          const k = Math.pow(t/4.5, 1.6); theia.visible = true; theia.position.lerpVectors(start, impactP.clone().addScaledVector(impactDir, RE*.5), k);
          debris.visible = false; spawned = false; moon.visible = false; moonM = 0; flash.material.opacity = 0; earth.material.uniforms.heat.value = .4;
        } else {
          theia.visible = t < 5; theia.scale.setScalar(RE*.53*(1 - sm(4.5, 5, t)));
          if (!spawned) spawn();
          debris.visible = true;
          flash.position.copy(impactP); flash.material.opacity = Math.max(0, 1 - (t - 4.5)/2.5); flash.scale.setScalar(20 + (t - 4.5)*40);
          earth.material.uniforms.heat.value = .4 + .6*sm(4.5, 5.5, t) - .55*sm(20, 32, t);
          // integrate debris: gravity, gentle damping into a disk, Roche-limit clumping into the Moon
          const steps = Math.min(4, Math.ceil(dt/.02)), h = Math.min(dt, .08)/steps;
          const moonP = moon.position;
          moonOrb.a = 34 + 30*sm(26, 34, t); moonOrb.ph += dt*Math.sqrt(GM/Math.pow(moonOrb.a, 3));
          moonP.set(Math.cos(moonOrb.ph)*moonOrb.a, 0, Math.sin(moonOrb.ph)*moonOrb.a);
          const clump = sm(15, 23, t);
          for (let s=0;s<steps;s++) for (let i=0;i<N;i++){ if (!live[i]) continue;
            const j = i*3; let x = ps[j], y = ps[j+1], z = ps[j+2]; const r2 = x*x + y*y + z*z, r = Math.sqrt(r2);
            if (r < RE*.98){ live[i] = 0; A.array[i] = 0; continue; }
            const g = -GM/(r2*r);
            vs[j] += x*g*h; vs[j+1] += y*g*h; vs[j+2] += z*g*h;
            vs[j+1] *= 1 - .8*h;                                    // collisions flatten the cloud into a disk
            { const sgn = Math.sign(z*vs[j] - x*vs[j+2]) || 1, rr = Math.hypot(x, z) || 1, vc = Math.sqrt(GM/Math.max(r, RE*1.2));   // ...and slowly circularise orbits
              const tx = sgn*z/rr*vc, tz = -sgn*x/rr*vc; vs[j] += (tx - vs[j])*.45*h; vs[j+2] += (tz - vs[j+2])*.45*h; }
            if (clump > 0 && r > RE*2.6){ const dx = moonP.x - x, dy = moonP.y - y, dz = moonP.z - z, d = Math.hypot(dx, dy, dz) + .5;
              const pull = clump*90/d; vs[j] += dx/d*pull*h; vs[j+1] += dy/d*pull*h; vs[j+2] += dz/d*pull*h;
              if (d < 3 + moonR*1.5 || rnd() < clump*.25*h){ live[i] = 0; A.array[i] = 0; moonM++; } }
            ps[j] = x + vs[j]*h; ps[j+1] = y + vs[j+1]*h; ps[j+2] = z + vs[j+2]*h;
          }
          for (let i=0;i<N*3;i++) P.array[i] = ps[i];
          P.needsUpdate = true; A.needsUpdate = true;
          moonR = 2.7*Math.cbrt(Math.min(1, Math.max(moonM/(N*.15), sm(16, 26, t)*.85)));
          moon.visible = moonR > .2; moon.scale.setScalar(Math.max(.1, moonR)); moon.material.uniforms.heat.value = .9 - .6*sm(24, 34, t);
          const cool = sm(18, 30, t); for (let i=0;i<N;i++){ C.array[i*3+1] = .55 + .3*(1 - cool); C.array[i*3+2] = .25 + .3*(1 - cool); } C.needsUpdate = true;
          debris.material.uniforms.k.value = 1 - .6*sm(24, 32, t);
        }
        const L = new THREE.Vector3(1, .35, .6).normalize(); [earth, theia, moon].forEach(m => m.material.uniforms.L.value.copy(L));
      };
    },
    labels:[["Proto-Earth", () => new THREE.Vector3(0, 12, 0), 0], ["Theia", () => null, 0, "theia"], ["Roche limit", () => new THREE.Vector3(29*.707, 0, 29*.707), 15], ["The Moon", () => null, 22, "moon"]],
    ring:29 },
  { id:"lhb", when:"4.1 to 3.8 billion years ago", title:"The heavy bombardment", dur:16, cam:[30, 30, 120], loop:1,
    text:[[0,"For hundreds of millions of years, leftover planetesimals kept slamming into the planets. The Moon's great dark basins, like the one that became Mare Imbrium, date from this era."],
          [6,"One idea is a sudden spike of impacts around 3.9 billion years ago, the 'Late Heavy Bombardment', set off when the giant planets' orbits shifted (the Nice model)."],
          [11,"Many scientists now think it was more of a long, declining tail of impacts than a spike. Either way, life may have appeared on Earth soon after, by about 3.8 billion years ago or earlier."]],
    build(){
      const earth = ball(10, lavaMat(2.2, "#4a4038")); earth.material.uniforms.heat.value = .15; earth.material.uniforms.ocean.value = 1;
      const moon = ball(2.7, lavaMat(5.5, "#6a6660")); moon.material.uniforms.heat.value = .05; moon.position.set(-30, 8, 16);
      const flashes = Array.from({length:14}, () => { const g = glow("#fff0c0", 3, 0); g.userData = {t:rnd()*4, body:rnd() < .45 ? moon : earth}; return g; });
      return (t, dt) => {
        earth.rotation.y += dt*.4; [earth, moon].forEach(m => { m.material.uniforms.time.value = t; m.material.uniforms.L.value.set(1, .3, .5).normalize(); });
        flashes.forEach(f => { const u = f.userData; u.t -= dt; if (u.t < 0){ u.t = .6 + rnd()*2.5; u.body = rnd() < .45 ? moon : earth; const R = u.body === earth ? 10 : 2.7; const d = new THREE.Vector3(gauss(), gauss(), gauss()).normalize(); if (d.dot(new THREE.Vector3(0,.3,1)) < 0) d.negate(); f.position.copy(u.body.position).addScaledVector(d, R*1.01); u.life = 1; }
          u.life = (u.life || 0)*.93; f.material.opacity = u.life; f.scale.setScalar((u.body === earth ? 6 : 2.5)*(1.5 - u.life)); });
      };
    }},
  { id:"giant", when:"5 billion years from now", title:"The Sun becomes a red giant", dur:30, cam:[0, 180, 380],
    text:[[0,"In about 5 billion years the Sun runs out of hydrogen in its core. The core contracts and heats while the outer layers swell."],
          [5,"Over a few hundred million years it becomes a red giant, about 200 times wider than today and thousands of times brighter."],
          [10,"Mercury and Venus are swallowed."],
          [14,"Earth's fate is uncertain. The Sun loses about a third of its mass, so the planets' orbits widen, and Earth may just escape or be dragged in by tides. Either way its oceans boil away long before this, roughly a billion years from now, as the Sun slowly brightens."],
          [20,"Finally the outer layers drift off into space as a glowing planetary nebula, like the Ring Nebula."],
          [25,"What remains is a white dwarf: a hot, Earth-sized core that will slowly cool for trillions of years."]],
    build(){
      const AU = 60;
      const sunM = new THREE.ShaderMaterial({ uniforms:{ time:{value:0}, g:{value:0} },
        vertexShader:`varying vec3 vP;varying vec3 vN;${LOGDEPTH_V}void main(){vP=position;vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);${LOGDEPTH_VM}}`,
        fragmentShader:`uniform float time;uniform float g;varying vec3 vP;varying vec3 vN;${GLSL_NOISE}${LOGDEPTH_F}void main(){${LOGDEPTH_FM}
          vec3 p=normalize(vP);float n=fbm(p*(3.+g*1.5)+vec3(time*.05));float c=snoise(p*12.+time*.1)*.5+.5;
          float mu=clamp(dot(vN,vec3(0.,0.,1.)),0.,1.);
          vec3 young=vec3(1.,.97,.9)*(.6+.4*pow(mu,.5));
          vec3 old=mix(vec3(.55,.08,.02),vec3(1.,.55,.18),smoothstep(-.3,.6,n+c*.4))*(.35+.65*pow(mu,.7));
          gl_FragColor=vec4(mix(young,old,g),1.);}` });
      const sun = ball(4, sunM);
      const halo = glow("#ffb070", 20, .8);
      const pl = [[.39, .8, "#9a8a78"], [.72, 1.4, "#e3c584"], [1, 1.5, "#4f86b8"], [1.52, 1.1, "#c0583a"], [5.2, 4, "#d2a77a"]].map(([a, r, c], i) => {
        const m = ball(r, new THREE.MeshStandardMaterial({ color:c, roughness:1 })); m.userData = {a:a*AU, ph:i*1.3, gone:0}; return m; });
      const orbits = pl.map(m => ring(m.userData.a, 0x8fa3bf, .2));
      const neb = cloud(MOB.on ? 6000 : 12000, (i, pos, col, size, al, ex) => {
        const d = new THREE.Vector3(gauss(), gauss()*.4, gauss()).normalize(); ex.aN[i*3] = d.x; ex.aN[i*3+1] = d.y; ex.aN[i*3+2] = d.z;
        const shell = .6 + rnd()*.5; ex.aR[i] = shell; setC(col, i, shell > .92 ? "#ff5a4a" : shell > .78 ? "#ffd27a" : rnd() < .5 ? "#5fe0c8" : "#8fb8ff"); size[i] = 2.5 + rnd()*3.5; al[i] = .55;
      }, { attrs:[["aN",3],["aR",1]], decl:"attribute vec3 aN;attribute float aR;uniform float e;", u:{ e:{value:0} }, vs:`p=aN*aR*e*${(2.6*AU).toFixed(1)}; alpha*=smoothstep(0.,.05,e)*(1.-e*.45);` });
      const wd = glow("#dfe8ff", 10, 0);
      return (t, dt) => {
        sunM.uniforms.time.value = t;
        const grow = sm(3, 12, t), shed = sm(19, 25, t);
        const R = 4 + grow*(1.08*AU - 4); sunM.uniforms.g.value = grow;
        sun.scale.setScalar(Math.max(.01, R*(1 - shed))); sun.visible = shed < .99;
        halo.scale.setScalar(R*3*(1 - shed) + 10); halo.material.color.set(grow > .3 ? "#ff7a40" : "#fff0d0"); halo.material.opacity = .8*(1 - shed);
        const massLoss = 1 + .45*sm(8, 20, t);
        pl.forEach((m, i) => { const u = m.userData; const a = u.a*(i < 2 ? 1 : massLoss); u.ph += dt*.6*Math.pow(AU/a, 1.5); m.position.set(Math.cos(u.ph)*a, 0, Math.sin(u.ph)*a); orbits[i].scale.setScalar(a/u.a);
          const inside = R*(1 - shed) > a*.98 && i < 2; if (inside && !u.gone){ u.gone = 1; const f = glow("#ffd080", 30, 1); f.position.copy(m.position); setTimeout(() => f.material.opacity = 0, 600); }
          m.visible = !u.gone; if (t < 1){ u.gone = 0; m.visible = true; } });
        neb.material.uniforms.e.value = sm(19, 30, t); neb.visible = t > 19;
        wd.material.opacity = sm(22, 26, t); wd.scale.setScalar(8);
      };
    },
    labels:[["Mercury", () => null, 0, "p0"], ["Venus", () => null, 0, "p1"], ["Earth", () => null, 0, "p2"], ["Mars", () => null, 0, "p3"], ["Jupiter", () => null, 0, "p4"], ["White dwarf", () => new THREE.Vector3(0, 4, 0), 24]] }
  ];

  /* ---------- player ---------- */
  let cur = null, t = 0, playing = true, update = null, named = {}, labs = [];
  function clear(){ while (root.children.length){ const o = root.children.pop(); o.traverse && o.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material && x.material.dispose) x.material.dispose(); }); } lab.innerHTML = ""; labs = []; }
  function load(i){
    clear(); cur = CH[i]; t = 0; playing = true; setIco();
    update = cur.build();
    if (cur.ring) ring(cur.ring, 0x8fd0ff, .35, true);
    // find objects the labels refer to
    named = {}; const balls = root.children.filter(o => o.isMesh && o.geometry.type === "SphereGeometry");
    if (cur.id === "theia"){ named.theia = balls[1]; named.moon = balls[2]; }
    if (cur.id === "planets"){ named.giant0 = balls[0]; }
    if (cur.id === "giant"){ for (let k=0;k<5;k++) named["p"+k] = balls[1+k]; }
    labs = (cur.labels || []).map(([name, fn, at, ref]) => { const el = document.createElement("div"); el.className = "sl obj"; el.innerHTML = `<span class="d"></span><span class="t">${esc(name)}</span>`; lab.appendChild(el); return {el, fn, at, ref}; });
    controls.target.set(0, 0, 0); camera.position.set(...cur.cam).multiplyScalar(fitK(.7)); controls.minDistance = 5; controls.maxDistance = 4000;
    renderChapterList(); renderText(true);
    bar.querySelector("#dtPrev").disabled = i === 0; bar.querySelector("#dtNext").disabled = i === CH.length - 1;
  }
  function renderText(force){
    if (!cur) return;
    const k = cur.text.reduce((a, x, i) => t >= x[0] ? i : a, 0);
    if (!force && k === renderText.k) return; renderText.k = k;
    const d = $("#dossier"), body = $("#dossierBody");
    body.innerHTML = `<button class="sheet-handle" type="button" aria-label="Show or hide details"><i></i></button><p class="eyebrow">${esc(cur.when)}</p><h2>${esc(cur.title)}</h2>` +
      cur.text.map((x, i) => `<p class="blurb dt${i === k ? " now" : i < k ? " past" : ""}">${esc(x[1])}</p>`).join("") +
      `<p class="note">An illustration of what models describe, sped up by billions of times. Sizes and distances are not to scale.</p>`;
    d.hidden = false;
    const el = body.querySelector(".dt.now"); if (el && !MOB.on) el.scrollIntoView({block:"nearest", behavior:"smooth"}); if (el && MOB.on && !document.body.classList.contains("sheet-open")) MOB.peekAt(el);
  }
  function renderChapterList(){
    $("#indexList").innerHTML = `<div class="grp">Deep time</div>` + CH.map((c, i) => (c.id === "giant" ? `<button class="row" data-dt-now><span class="sw" style="background:#f2a640"></span><span>Today</span><span class="n">now</span></button>` : "") +
      `<button class="row${c === cur ? " sel" : ""}" data-dt="${i}"><span class="sw reg"></span><span>${esc(c.title)}</span><span class="n">${esc(c.when.replace(" billion years", " Gyr").replace(" from now", " ahead").replace(" ago", " ago"))}</span></button>`).join("");
  }
  function setIco(){ $("#dtIco").setAttribute("d", playing ? "M3 2h3v10H3zM8 2h3v10H8z" : "M3 1.5l9 5.5-9 5.5z"); }
  $("#indexList").addEventListener("click", e => {
    if (!DEEP.on) return;
    const r = e.target.closest("[data-dt]"); if (r){ e.stopImmediatePropagation(); load(+r.dataset.dt); return; }
    if (e.target.closest("[data-dt-now]")){ e.stopImmediatePropagation(); exit(); }
  }, true);
  bar.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.id === "dtPlay"){ playing = !playing; setIco(); }
    if (b.id === "dtRe"){ load(CH.indexOf(cur)); }
    if (b.id === "dtPrev"){ load(Math.max(0, CH.indexOf(cur) - 1)); }
    if (b.id === "dtNext"){ load(Math.min(CH.length - 1, CH.indexOf(cur) + 1)); }
    if (b.id === "dtExit") exit();
  });
  const scrub = bar.querySelector("#dtScrub");
  scrub.addEventListener("input", () => {
    // replaying from the start up to the scrub point keeps the physics-based chapters consistent
    const target = scrub.value/1000*cur.dur; if (target < t){ const i = CH.indexOf(cur); const keep = playing; load(i); playing = keep; setIco(); }
    while (t < target){ const h = Math.min(.05, target - t); t += h; update(t, h); }
    renderText();
  });

  function enter(i){
    if (SCALE.mode !== "system"){ SCALE.jump("system"); setTimeout(() => enter(i), 500); return; }
    if (focus && focus.cut) removeCutaway(focus); focus = null; selFeature = null; clearPins(); fly = null; renderCrumbs(null);
    DEEP.on = true; document.body.classList.add("deep"); document.body.classList.add("far");
    DEEP.saved = { pos:camera.position.clone(), tgt:controls.target.clone() };
    load(i || 0); resize(); if (typeof HUD !== "undefined") HUD.render();
    $("#deepBtn").setAttribute("aria-pressed", "true");
  }
  function exit(){
    DEEP.on = false; clear(); document.body.classList.remove("deep"); document.body.classList.remove("far");
    $("#dossier").hidden = true; renderIndex();
    controls.minDistance = 1; controls.maxDistance = 30000; goHome();
    $("#deepBtn").setAttribute("aria-pressed", "false");
  }
  DEEP.frame = dt => {
    if (playing){ t += dt; if (t > cur.dur){ if (cur.loop) { load(CH.indexOf(cur)); } else { t = cur.dur; playing = false; setIco(); } } }
    if (update) update(t, playing ? dt : 0);
    scrub.value = Math.round(t/cur.dur*1000);
    $("#dtStamp").textContent = cur.when;
    renderText();
    const px = fxPx(); root.traverse(o => { if (o.isPoints && o.material.uniforms && o.material.uniforms.px) o.material.uniforms.px.value = px; });
    controls.update();
    renderer.render(S, camera);
    const W = canvas.clientWidth, H = canvas.clientHeight, v = new THREE.Vector3();
    labs.forEach(L => {
      let p = L.ref ? (named[L.ref] && named[L.ref].visible ? named[L.ref].getWorldPosition(v) : null) : L.fn();
      if (p && L.ref) p = p.clone().add(new THREE.Vector3(0, (named[L.ref].scale.x || 1)*1.3, 0));
      const show = p && t >= L.at; if (show){ v.copy(p).project(camera); }
      if (!show || v.z > 1){ L.el.style.opacity = 0; return; }
      L.el.style.opacity = 1; L.el.style.transform = `translate(${((v.x*.5+.5)*W - 5).toFixed(1)}px,${((-v.y*.5+.5)*H - 9).toFixed(1)}px)`;
    });
  };
  DEEP.enter = enter; DEEP.exit = exit;
  // header button
  const btn = document.createElement("button"); btn.className = "chip"; btn.id = "deepBtn"; btn.setAttribute("aria-pressed", "false"); btn.textContent = "Deep time";
  $("#scaleSeg").after(btn);
  btn.addEventListener("click", () => DEEP.on ? exit() : enter(0));
  $("#homeBtn").addEventListener("click", e => { if (DEEP.on){ e.stopImmediatePropagation(); exit(); } }, true);
  document.querySelector("#scaleSeg").addEventListener("click", e => { if (DEEP.on){ exit(); } }, true);
})();

/* scroll hint for the phone tool row (see .tools.more-l / .more-r in solar.css) */
(function(){
  const row = document.querySelector(".top .tools"); if (!row) return;
  const upd = () => { const max = row.scrollWidth - row.clientWidth;
    row.classList.toggle("more-r", max > 2 && row.scrollLeft < max - 2); row.classList.toggle("more-l", row.scrollLeft > 2); };
  row.addEventListener("scroll", upd, {passive:true}); addEventListener("resize", upd);
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(upd).observe(row);
  setTimeout(upd, 300);
})();

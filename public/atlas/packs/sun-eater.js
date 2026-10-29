/* The Sun Eater Atlas — data pack for the shared galactic atlas engine (../engine.js). Schema: docs/atlas/PACK_FORMAT.md in the repo */
(function(){
"use strict";
/* ===================== CONTENT =====================
   Sources: the Nov Belgaer Sun Eater wiki (suneater.wiki: chapter location headers, Index of Worlds, battle timeline),
   Christopher Ruocchio's Highmatter Books lore pages, the Daniel Hasenbos galaxy map printed in Disquiet Gods and
   Shadows Upon Time (33 positions as transcribed by a reader), and published summaries and reviews. All text paraphrased.
   `map:[x,y]` = thousands of light-years on the book's map: core at the origin, Old Earth 27.1 kly toward +y, +x map-east.
   Worlds the map does not pin are placed by their stated arm or region and marked as estimated. */
const BOOKS={1:{n:"I",title:"Empire of Silence",y:2018},2:{n:"II",title:"Howling Dark",y:2019},3:{n:"III",title:"Demon in White",y:2020},4:{n:"IV",title:"Kingdoms of Death",y:2022},5:{n:"V",title:"Ashes of Man",y:2022},6:{n:"VI",title:"Disquiet Gods",y:2024},7:{n:"VII",title:"Shadows Upon Time",y:2025}};

const INTRO={
 text:"In humanity’s distant future, the Sollan Empire holds four arms of the Milky Way under a Solar Throne, and the Chantry keeps machines and Old Earth forbidden. Out of the Norma Arm come the Cielcin, the Pale, who live in moon-sized ships and eat the people they conquer. Hadrian Marlowe, the disowned son of a minor lord, writes his memoir in the Library of Colchis: a soldier and a heretic, called Halfmortal, Starbreaker, and the Sun Eater.",
 legend:[["Galaxy","Drawn from the official map in the later books: the core at centre, Old Earth 27,000 light-years out"],["Bright points","Worlds, coloured by their star. Diamonds are ships and worldships"],["Gold lines","Hadrian’s road, one colour per book"],["Red lines","Cielcin raids and invasions, as far as the selected book"],["Washes of colour","Sollan, Jaddian, Lothrian, Durantine and Tavrosi space, and the Veil of Marinus"],["Book buttons","Choose the book you are reading. Later worlds, events and routes stay hidden"],["Surfaces","Each world is generated on your graphics card when you descend"]]
};

/* gfx: type, sea level, palette [deep water, shallow water, lowland, lowland 2, highland, peak/snow], clouds, atmosphere, city lights */
const WORLDS=[
/* ---------------- Spur of Orion ---------------- */
{id:"delos",name:"Delos",group:"orion",books:[1,2,3,4,5,6,7],major:true,first:1,status:"Imperial world · Auriga Province",hero:"devilsrest",
 star:{name:"Delos’s pale sun",col:"#fff0d2"},map:[6.647,29.354],
 blurb:"A temperate, terraformed world under a weak sun, rich in uranium. Hadrian Marlowe is born here, heir to the Archon of Meidua, and flees it at the start of the first book rather than be sent to the Chantry.",
 short:"Hadrian’s birthplace and the seat of House Marlowe.",
 facts:[["Owner","House Kephalos (planetary); House Marlowe, Archons of Meidua"],["Known for","Uranium"],["In the system","The gas giant Omphalos and its airless moon Linon"]],
 gfx:{type:"terran",sea:.6,freq:1.4,warp:.7,rough:.55,pal:["#0a1d3a","#2a5f86","#3d5a32","#6a7a46","#7a6e5c","#f0f0ec"],clouds:.42,atmo:"#7aa4ff",atmoK:1.05,lights:.35,ice:74,sw:"#3d6a8a",
  feat:[{k:"continent",at:[34,-22],r:26,s:.22},{k:"continent",at:[8,-48],r:18,s:.2},{k:"continent",at:[-20,60],r:24,s:.2},{k:"range",from:[44,-36],to:[30,-6],w:2.4,s:.26},{k:"biome",style:"rock",at:[29,-12],r:4,s:.9,c:"#d8d2c2"}]},
 sites:[
  {id:"devilsrest",name:"Devil’s Rest",lat:30,lon:-12,books:[1],desc:"The Marlowe castle, a black-stone citadel on a white limestone bluff above the Apollan Ocean. Hadrian grows up here under the scholiast Tor Gibson.",
   scene:{kind:"castle",arch:"gothic",size:"medium",tod:"dusk",weather:"mist",coast:"s",walls:true,pal:{stone:"#26242a",ground:"#d8d2c2"},   /* layout schematic */
    landmarks:[
     {id:"castle",name:"Devil’s Rest",kind:"castle",at:[0,.15],h:1.7,desc:"The dark-stone home of House Marlowe, whose lord is Archon of Meidua. Hadrian grows up under a father who wants an heir rather than a child."},
     {id:"bluff",name:"The limestone bluff",kind:"cliff",at:[0,-.5],h:1.2,desc:"The white bluff the castle crowns, dropping to the Apollan Ocean."},
     {id:"study",name:"The scholiast’s rooms",kind:"library",at:[-.4,.35],desc:"Where Tor Gibson tutors Hadrian in history, languages and the scholiasts’ discipline, and feeds his dream of leaving to join their order."}]}},
  {id:"meidua",name:"Meidua",lat:28.4,lon:-10,books:[1],desc:"An old fishing village grown into the prefecture capital, with a Colosso and the slums of Lowtown below the castle.",
   scene:{kind:"city",arch:"classical",size:"medium",tod:"day",weather:"clear",coast:"s",   /* layout schematic */
    landmarks:[
     {id:"colosso",name:"The Colosso",kind:"arena",at:[.35,.2],h:1.3,desc:"Meidua’s arena, where gladiators and myrmidons fight before the Archon’s family."},
     {id:"lowtown",name:"Lowtown",kind:"market",at:[-.25,-.45],desc:"The poor quarter at the foot of the castle’s bluff."},
     {id:"bluffview",name:"Devil’s Rest above the city",kind:"castle",at:[-.55,.7],h:1.4,desc:"The Marlowe castle looks down on the prefecture capital from its height."}]}},
  {id:"haspida",name:"Haspida",lat:21,lon:-30,books:[1],desc:"The Kephalos summer palace in Artemia, where Hadrian’s mother arranges his escape and he fights his brother Crispin.",
   scene:{kind:"palace",arch:"classical",size:"small",tod:"night",weather:"clear",   /* layout schematic */
    landmarks:[
     {id:"palace",name:"The summer palace",kind:"palace",at:[0,0],h:1.2,desc:"His mother’s retreat away from Devil’s Rest. Her plan to get Hadrian off Delos runs through here, and so does his fight with Crispin."}]}},
  {id:"karch",name:"Karch",lat:12,lon:-40,books:[1],sea:true,desc:"An island city and starport. Hadrian boards the merchant ship Eurynasir here, bound for the scholiasts of Teukros.",
   scene:{kind:"port",arch:"modern",size:"small",tod:"dawn",weather:"clear",water:true,   /* layout schematic */
    landmarks:[
     {id:"starport",name:"Karch starport",kind:"pad",at:[.2,.1],desc:"Where Hadrian slips aboard the merchant ship Eurynasir, expecting to wake at Teukros."}]}},
  {id:"redtine",name:"Redtine Mountains",lat:40,lon:-30,books:[1],desc:"Where Crispin and Sabine Marlowe crash and find a hidden village in the novella The Lesser Devil.",
   scene:{kind:"mountain",arch:"rustic",size:"small",tod:"day",weather:"mist",   /* layout schematic */
    landmarks:[
     {id:"village",name:"The hidden village",kind:"house",at:[.1,-.1],desc:"The settlement Crispin and Sabine find after their crash, in the novella The Lesser Devil."}]}}]},

{id:"earth",name:"Old Earth",aka:["Sol III"],group:"orion",books:[1,6,7],first:1,status:"Forbidden world · held by the Chantry",
 eras:{7:{status:"Revealed: green and living",gfx:{type:"terran",base:"earth",sea:.5,rough:.35,pal:["#0a1e3e","#2a608a","#3e5e2e","#7a804a","#7a6a52","#f2f4f6"],clouds:.44,atmo:"#8ab0ff",atmoK:1,lights:0},blurb:"The Chantry taught that Earth was a nuclear ruin and let no one walk there. Shadows Upon Time shows the lie: Earth is green and alive, kept by the Chantry as its own preserve."}},
 star:{name:"Sol",col:"#fff4e0"},map:[0,27.14],
 blurb:"Humanity’s birthplace, under Chantry quarantine. The Chantry teaches that it was left a nuclear ruin by the Foundation War against the Mericanii machines, and no one may set foot on it.",
 short:"The cradle of mankind, sealed by the Chantry.",
 facts:[["Owner","The Holy Terran Chantry"],["In the system","Mars, the Martian Guard’s training ground; Ganymede; Europa"]],
 gfx:{type:"toxic",sea:.42,pal:["#1a1c1e","#2e3234","#4a4440","#5a524a","#6e6458","#c8c4bc"],clouds:.62,cloudCol:"#a8a49a",atmo:"#b0a890",atmoK:.8,lights:0},
 moons:[{name:"Luna",size:.27,dist:3.2}],
 sites:[{id:"britannia",name:"Britannia",lat:52,lon:-1,books:[1],desc:"Where House Avent began, before the British kings fled to Avalon.",
   scene:{kind:"ruins",arch:"ancient",size:"small",tod:"dusk",weather:"ash",coast:"w",   /* layout schematic */
    landmarks:[{id:"isles",name:"Old Britannia",kind:"ruin",at:[0,0],desc:"Remembered as the first home of House Avent, the line of the Emperors."}]}},
  {id:"sanfran",name:"San Francisco",lat:37.8,lon:-122.4,books:[1],desc:"Remembered as the birthplace of the Mericanii machines.",
   scene:{kind:"ruins",arch:"modern",size:"small",tod:"dusk",weather:"ash",coast:"w",   /* layout schematic */
    landmarks:[{id:"city",name:"San Francisco",kind:"ruin",at:[0,0],desc:"Named in the histories as the place where the Mericanii machines began."}]}}]},

{id:"avalon",name:"Avalon",group:"orion",books:[1,3,5],first:1,status:"Imperial world · birthplace of the Empire",
 star:{name:"Avalon’s sun",col:"#fff2dc"},map:[-0.569,28.547],
 blurb:"One of the first colonies, settled by European generation ships rather than the Mericanii. The British royal house of Avent fled here, and the Sollan Empire was born on it.",
 facts:[["Landmarks","The Cenotaph, Caliburn House, Mountbatten Academy"]],
 gfx:{type:"terran",sea:.55,freq:1.7,pal:["#0b1f3a","#2b6286","#3a6a34","#6e8a4c","#7a7262","#f2f2ee"],clouds:.5,atmo:"#86aaff",lights:.55},
 sites:[{id:"cenotaph",name:"The Cenotaph",lat:48,lon:4,books:[1],desc:"The memorial to the Foundation War, which keeps a copy of the Acts of Will.",
   scene:{kind:"temple",arch:"imperial",size:"small",tod:"day",weather:"clear",   /* layout schematic */
    landmarks:[{id:"memorial",name:"The Cenotaph",kind:"obelisk",at:[0,.1],h:1.6,desc:"Avalon’s memorial to the Foundation War, in which the Empire was born from the defeat of the Mericanii."},
     {id:"acts",name:"The Acts of Will",kind:"shrine",at:[.3,-.2],desc:"A copy of the Acts of Will, kept at the memorial."}]}}]},

{id:"forum",name:"Forum",group:"orion",books:[1,3,5,6,7],major:true,first:1,status:"Imperial capital",hero:"eternal",
 eras:{7:{status:"Fallen to the Cielcin",gfx:{pal:["#3a2418","#8a5a3a","#c8a07a","#d8c0a0","#9a4a2a","#5a1a10"],atmo:"#f0a070",lights:.15},blurb:"Hadrian learns the capital has fallen to the Cielcin, and that the Chantry hid the news for nearly two years."}},
 star:{name:"Forum’s sun",col:"#fff1d6"},map:[-5.187,27.041],
 blurb:"The throne world: a gas giant with a breathable upper atmosphere and sixty moons. The Eternal City floats in its cloud tops on thousands of barges, home to some thirty billion people and the Solar Throne.",
 short:"The Eternal City, a floating capital in a gas giant’s sky.",
 facts:[["Ruler","Emperor William XXIII of House Avent"],["People","About 30 billion"],["Moons","Sixty"]],
 gfx:{type:"gas",pal:["#6a5a46","#b8a07a","#ece0c8","#f6efe2","#cfc0a0","#9ab4d0"],bands:16,atmo:"#d8e4ff",atmoK:.8,lights:.6},
 ring:{inner:1.6,outer:1.75,c1:"#e8dcc0",c2:"#8a8070",tilt:.18,seed:5},
 moons:[{name:"Moon",size:.11,dist:2.9},{name:"Moon",size:.08,dist:3.7},{name:"Moon",size:.06,dist:4.4}],
 sites:[
  {id:"eternal",name:"The Eternal City",lat:12,lon:20,books:[3,6,7],desc:"Floating barges held aloft by repulsors and balloons, shielded by sails. The court, the Colosseum and the Great Sanctum all ride the clouds.",
   scene:{kind:"capital",arch:"imperial",size:"huge",tod:"day",weather:"mist",sky:{planet:{c:"#cfc0a0",size:1.4},moons:3},pal:{ground:"#ece0c8",stone:"#f4ecdc",roof:"#c9a24a"},   /* layout schematic */
    landmarks:[
     {id:"barges",name:"The floating barges",kind:"plaza",at:[0,0],h:1.2,desc:"The city is built on thousands of barges riding the gas giant’s upper air, home to some thirty billion people."},
     {id:"sails",name:"The shield sails",kind:"mast",at:[-.7,.5],h:2,desc:"Great sails that shelter the barges from the planet’s winds."},
     {id:"palace",name:"The Emperor’s court",kind:"palace",at:[.15,.55],h:2,desc:"The seat of the Solar Throne and of House Avent, where Hadrian is summoned after Hermonassa falls."},
     {id:"colosseum",name:"The Grand Colosseum",kind:"arena",at:[-.45,-.35],h:1.5,desc:"The great arena of the capital, part of Hadrian’s triumph."},
     {id:"sanctum",name:"The Great Sanctum",kind:"cathedral",at:[.6,.25],h:1.8,books:[6],desc:"The Chantry’s great temple in the capital."},
     {id:"ports",name:"The starports",kind:"pad",at:[.7,-.55],books:[6],desc:"The Eternal City has seven starports, Porta Leonora among them."}]}},
  {id:"sunking",name:"Sun King’s Hall",lat:14,lon:24,books:[3,6],desc:"The throne room of the Solar Throne, where Hadrian is received by William XXIII.",
   scene:{kind:"palace",arch:"imperial",size:"medium",tod:"day",weather:"clear",sky:{planet:"#cfc0a0"},   /* layout schematic */
    landmarks:[
     {id:"throne",name:"The Solar Throne",kind:"throne",at:[0,.4],h:1.6,desc:"The throne of House Avent. William XXIII receives Hadrian here and sends him with Prince Alexander to find two missing legions."},
     {id:"council",name:"The Emperor’s council",kind:"hall",at:[.45,-.1],books:[6],desc:"In Disquiet Gods Hadrian sits on the Emperor’s council and meets Crown Prince Aurelian at court."}]}},
  {id:"colosseum",name:"Grand Colosseum",lat:9,lon:16,books:[3],desc:"Seats for a million, and a floor that can be flooded. Hadrian fights the Jaddian gladiator Irshan here in a duel his enemies arranged.",
   scene:{kind:"arena",arch:"imperial",size:"large",tod:"day",weather:"clear",water:true,sky:{planet:"#cfc0a0"},   /* layout schematic */
    landmarks:[
     {id:"floor",name:"The flooded floor",kind:"lake",at:[0,0],h:1,desc:"The arena floor can be flooded. Hadrian’s enemies force him into a duel here with the Jaddian gladiator Irshan."},
     {id:"stands",name:"The stands",kind:"arena",at:[0,.6],h:1.8,desc:"Seats for a million spectators."}]}},
  {id:"sanctum",name:"Great Sanctum",lat:17,lon:28,books:[6],desc:"The Chantry’s great temple. In Disquiet Gods the Chantry has Hadrian dissolved with poison in the capital.",
   scene:{kind:"temple",arch:"gothic",size:"medium",tod:"dusk",weather:"mist",sky:{planet:"#cfc0a0"},   /* layout schematic */
    landmarks:[
     {id:"temple",name:"The Great Sanctum",kind:"cathedral",at:[0,.2],h:2,desc:"The Chantry’s seat in the capital. The Chantry, which has distrusted Hadrian since Emesh, has him killed with poison."}]}},
  {id:"leonora",name:"Porta Leonora",lat:6,lon:30,books:[6],desc:"One of the seven starports of the Eternal City.",
   scene:{kind:"spaceport",arch:"imperial",size:"medium",tod:"day",weather:"clear",sky:{planet:"#cfc0a0"},   /* layout schematic */
    landmarks:[{id:"port",name:"Porta Leonora",kind:"pad",at:[0,0],desc:"One of the seven starports of the floating capital."}]}}]},

{id:"vorgossos",name:"Vorgossos",aka:["Fort Grissom"],group:"orion",books:[1,2,6,7],major:true,first:1,status:"Extrasolarian kingdom of Kharn Sagara",hero:"palace",
 eras:{2:{status:"Extrasolarian kingdom of Kharn Sagara",blurb:"A sunless black world of ice, the hidden kingdom of Kharn Sagara, the Undying, who trades in clones, genetic monsters and forbidden machines. Under it lies an ocean holding Brethren, the last of the Mericanii minds."},6:{status:"Conquered by the Empire",blurb:"Moved by world-engines from its first star, Vorgossos is found hidden near the Pleiades in the old heart of the Empire. Hadrian helps lead the joint Imperial and Latarran assault in Disquiet Gods, kills Kharn Sagara’s clones, drowns the machine Brethren, and takes the Demiurge."}},
 star:{name:"A brown dwarf; later the Pleiades",col:"#c8704a"},gal:{l:166.6,b:-23.5,ly:444},
 blurb:"A hidden Extrasolarian kingdom that trades in clones, monsters and forbidden machines. The dying Cielcin captain Uvanari gives Hadrian its name, and finding it becomes the Red Company’s purpose.",
 short:"The black planet of the Undying King.",
 facts:[["Ruler","Kharn Sagara, the Undying"],["Original site","A brown dwarf about 30 light-years from Old Earth"],["Placement","Shown near the Pleiades, where it was later found"]],
 gfx:{type:"ice",sea:0,pal:["#0a0c12","#141820","#1c2028","#262a32","#3a3e48","#9aa4b8"],clouds:.05,atmo:"#6a4a3a",atmoK:.25,bump:1.6,rough:.9,amb:.035,lights:.35,lightCol:"#9fd0ff"},
 sites:[
  {id:"palace",name:"Palace of the Undying",lat:8,lon:30,books:[2,6],desc:"Kharn’s palace: the Orchid Stair, the Garden of Everything and the dormitories of his clone bodies.",
   scene:{kind:"underground",arch:"alien",size:"large",tod:"night",weather:"clear",under:true,pal:{stone:"#1c2028",light:"#9fd0ff"},   /* layout schematic */
    landmarks:[
     {id:"throne",name:"Kharn Sagara’s court",kind:"throne",at:[0,.5],h:1.5,desc:"Where Hadrian meets Kharn Sagara, the Undying, who has lived for millennia by moving his mind from one cloned body to the next."},
     {id:"stair",name:"The Orchid Stair",kind:"arch",at:[-.4,.1],h:1.3,desc:"A grand stair in the palace of the Undying."},
     {id:"garden",name:"The Garden of Everything",kind:"garden",at:[.45,.05],h:1,desc:"A garden inside Kharn’s palace under the ice."},
     {id:"clones",name:"The clone dormitories",kind:"hall",at:[0,-.5],desc:"Where the Undying keeps the bodies he will wear next."},
     {id:"heirs",name:"The heirs’ fall",kind:"hall",at:[.35,-.65],books:[6],desc:"In the Battle of Vorgossos Hadrian kills the clones Kharn has kept as his heirs."}]}},
  {id:"undersea",name:"The Underground Sea",lat:-4,lon:36,books:[2,6],desc:"Where Brethren lives: a sea under the ice of Vorgossos.",
   scene:{kind:"underground",arch:"alien",size:"medium",tod:"night",weather:"mist",under:true,water:true,pal:{light:"#9fd0ff"},   /* layout schematic */
    landmarks:[
     {id:"brethren",name:"Brethren",kind:"lake",at:[0,0],h:1.4,desc:"The last of the Mericanii machine minds lives in this sea. It shows Hadrian possible futures."},
     {id:"drowning",name:"The drowned machine",kind:"reactor",at:[.4,-.3],books:[6],desc:"In Disquiet Gods Hadrian floods the sea and kills Brethren. A new machine, Orphan, is born from it, and Hadrian spares it."}]}},
  {id:"deep",name:"The Seventh Deep",lat:14,lon:20,books:[6],desc:"The gate to the inner city, fought through in the Battle of Vorgossos.",
   scene:{kind:"fortress",arch:"alien",size:"medium",tod:"night",weather:"clear",under:true,   /* layout schematic */
    landmarks:[{id:"gate",name:"The Seventh Deep",kind:"gate",at:[0,0],h:1.6,desc:"The way into the inner city of Vorgossos, taken by Imperial, Latarran and Chantry forces in Disquiet Gods."}]}}]},

{id:"vesperad",name:"Vesperad",group:"orion",books:[1],first:1,status:"Chantry world",map:[1.6,26.2],est:true,
 star:{name:"Unnamed sun",col:"#fff0dc"},
 blurb:"The moon of the gas giant Ius and the oldest world the Chantry controls. Hadrian’s father means to send him to its seminary, Lorica College, to become a priest of the Chantry and leave the succession to Crispin. Hadrian runs rather than go.",
 gfx:{type:"ice",sea:.2,pal:["#3a4a5a","#5a6a7a","#8a929a","#a8b0b8","#c8ccd0","#f4f6f8"],clouds:.3,atmo:"#b8c8e0",atmoK:.6,lights:.25},
 sites:[{id:"lorica",name:"Lorica College",lat:22,lon:14,books:[1],desc:"The Chantry seminary on Vesperad, where Hadrian’s father means to send him.",   /* estimated */
   scene:{kind:"monastery",arch:"gothic",size:"small",tod:"dusk",weather:"snow",sky:{planet:{c:"#c8a878",size:1.6}},   /* layout schematic */
    landmarks:[{id:"college",name:"Lorica College",kind:"cathedral",at:[0,.2],h:1.5,desc:"The seminary Hadrian runs from Delos rather than enter."}]}}]},

{id:"caritas",name:"Caritas",group:"orion",books:[1],first:1,status:"New Vatican",map:[-2.2,28.6],est:true,
 star:{name:"Unnamed sun",col:"#ffe6c4"},
 blurb:"A windy, twilit world, seat of the Museum Catholic Church after its holy city was moved from Earth.",
 gfx:{type:"forest",sea:.45,pal:["#0a1e30","#2a4a6a","#2a3a2a","#4a5a3a","#5a5a50","#e0dcd4"],clouds:.6,atmo:"#d0a0a0",atmoK:.9,lights:.2},
 sites:[{id:"newvatican",name:"The New Vatican",lat:30,lon:-20,books:[1],desc:"The holy city of the Museum Catholic Church, moved here from Old Earth.",   /* estimated */
   scene:{kind:"temple",arch:"classical",size:"medium",tod:"dusk",weather:"mist",   /* layout schematic */
    landmarks:[{id:"holycity",name:"The New Vatican",kind:"cathedral",at:[0,.2],h:1.6,desc:"Seat of the Museum Catholic Church since its holy city left Earth."}]}}]},

/* ---------------- Sagittarius ---------------- */
{id:"colchis",name:"Colchis",aka:["Moon of Atlas"],group:"sagittarius",books:[1,3,4,5,7],major:true,first:1,status:"Imperial library world",hero:"belgaer",
 star:{name:"Unnamed sun",col:"#ffeed6"},map:[-12.916,17.556],
 blurb:"A cool, misty island moon of the orange gas giant Atlas, kept nearly empty by Imperial decree for the great Library. Hadrian writes his memoir here, so every book begins in Colchis.",
 short:"The Library moon, where Hadrian writes his account.",
 facts:[["Parent","The gas giant Atlas"],["Athenaeum","Nov Belgaer, above the town of Aea"],["Arm","Disputed: the sources say Sagittarius or Centaurus"]],
 gfx:{type:"archipelago",sea:.74,freq:1.6,pal:["#06202e","#24606a","#3a5a40","#5a7050","#6a6a60","#e8ece8"],clouds:.55,cloudCol:"#e4e8ec",atmo:"#9ab8c8",atmoK:1.1,lights:.05},
 moons:[{name:"Atlas",size:2.2,dist:12,speed:.006,gfx:{type:"gas",pal:["#5a3018","#9a5a28","#d8a060","#ecd0a0","#b07040","#7a3a18"],bands:14,atmoK:0}}],
 sites:[
  {id:"belgaer",name:"Nov Belgaer",lat:24,lon:-30,books:[3,4,5],desc:"The scholiast athenaeum on a mesa above Aea, beside the Imperial Library. Hadrian finds his old tutor Gibson alive here.",
   scene:{kind:"library",arch:"classical",size:"medium",tod:"day",weather:"mist",coast:"w",sky:{planet:{c:"#d8a060",size:2}},   /* layout schematic */
    landmarks:[
     {id:"athenaeum",name:"Nov Belgaer",kind:"hall",at:[0,0.2],h:1.4,desc:"The scholiast athenaeum on a mesa above the town of Aea."},
     {id:"library",name:"The Imperial Library",kind:"library",at:[0.45,0.35],h:2,desc:"The great Library for which Colchis is kept nearly empty by Imperial decree. The old Hadrian writes his account here."},
     {id:"aea",name:"Aea",kind:"house",at:[-0.3,-0.55],desc:"The small town below the mesa."},
     {id:"gibson",name:"Gibson’s rooms",kind:"house",at:[-0.35,0.4],desc:"Where Hadrian finds his old tutor Tor Gibson alive, long after he was sent away from Delos."}]}},
  {id:"archive",name:"Gabriel’s Archive",lat:22,lon:-27,books:[3],desc:"A vault under the Library that hides the U.S.S. Horizon, a Mericanii-era ship mind. It gives Hadrian the coordinates of the Quiet’s world.",
   scene:{kind:"underground",arch:"ancient",size:"small",tod:"night",weather:"clear",under:true,pal:{light:"#9fd0ff"},   /* layout schematic */
    landmarks:[
     {id:"vault",name:"The Archive vault",kind:"cave",at:[0,0.2],desc:"A hidden vault beneath the Library."},
     {id:"horizon",name:"The U.S.S. Horizon",kind:"reactor",at:[0.1,-0.3],h:1.2,desc:"A Mericanii-era ship mind kept in the vault. It gives Hadrian the coordinates of the world where the Quiet left their mark."}]}},
  {id:"thessa",name:"Thessa",lat:6,lon:-50,books:[3,4,5],sea:true,desc:"A mossy crescent island with a black-sand beach in the Sevrast Islands, where the Red Company rests.",
   scene:{kind:"wilds",arch:"rustic",size:"small",tod:"dusk",weather:"mist",coast:"s",   /* layout schematic */
    landmarks:[
     {id:"beach",name:"The black-sand beach",kind:"lake",at:[0,-0.5],desc:"The shore of the mossy crescent island where the Red Company rests."},
     {id:"isle",name:"The Isle of the Dead",kind:"tomb",at:[0.5,0.3],h:1,books:[4],desc:"Where Hadrian and Valka honour the dead of the Red Company after Akterumu."}]}},
  {id:"racha",name:"Racha",lat:10,lon:-46,books:[4],desc:"A village in the Sevrast Islands where Hadrian and Valka hide after Akterumu.",
   scene:{kind:"village",arch:"rustic",size:"small",tod:"day",weather:"mist",coast:"w",   /* layout schematic */
    landmarks:[
     {id:"village",name:"Racha",kind:"house",at:[0,0],desc:"A village in the Sevrast Islands where Hadrian and Valka hide after Akterumu."}]}}]},

{id:"teukros",name:"Teukros",group:"sagittarius",books:[1,3],first:1,status:"Imperial world · scholiast athenaeum",map:[14.343,23.638],
 star:{name:"Unnamed sun",col:"#fff0c8"},
 blurb:"A hot desert world terraformed with too little water. Its athenaeum, Nov Senber, is where young Hadrian means to go to become a scholiast, as his tutor Gibson once did. He sleeps in fugue aboard the Eurynasir for the voyage, but the ship never brings him here: he wakes robbed and stranded on Emesh.",
 gfx:{type:"desert",sea:0,dune:8,pal:["#000","#000","#9a7448","#c49a62","#a48a6a","#ecdcc0"],clouds:.1,atmo:"#f0c08a",atmoK:.7,lights:.1},
 sites:[{id:"senber",name:"Nov Senber",lat:18,lon:24,books:[1],desc:"The scholiast athenaeum young Hadrian sets out to join. His ship never brings him here.",   /* estimated */
   scene:{kind:"library",arch:"desert",size:"medium",tod:"day",weather:"dust",   /* layout schematic */
    landmarks:[{id:"athenaeum",name:"Nov Senber",kind:"library",at:[0,.1],h:1.4,desc:"The athenaeum of the scholiasts on Teukros, the goal of Hadrian’s flight from Delos."}]}}]},

{id:"padmurak",name:"Padmurak",group:"sagittarius",books:[4],major:true,first:4,status:"Capital of the Lothrian Commonwealth",hero:"vedatharad",
 star:{name:"Unnamed sun",col:"#ffe2c0"},map:[-19.64,7.512],
 blurb:"A frozen, airless world past the Rasan Belt, capital of the collectivist Lothrian Commonwealth. Hadrian comes here as an envoy seeking an alliance against the Cielcin and finds the Conclave already sold to them.",
 short:"Domed capital of the Lothrians, where Hadrian is betrayed.",
 facts:[["People","About 1.3 billion"],["Government","The Grand Conclave and its Thirty-Four Chairs"]],
 gfx:{type:"ice",sea:0,pal:["#5a6a7a","#7a8a9a","#b8c0c8","#d0d6dc","#e4e8ec","#ffffff"],clouds:0,atmoK:0,bump:1.2,rough:.7,lights:.5,lightCol:"#ffd8a0"},
 sites:[
  {id:"vedatharad",name:"Vedatharad",lat:18,lon:40,books:[4],desc:"The Great City: domed concrete hives and the People’s Palace. The Red Company escapes through its sewers and fights across the city to the embassy.",
   scene:{kind:"dome",arch:"brutal",size:"huge",tod:"night",weather:"clear",pal:{stone:"#8a8c90",light:"#ffd8a0"},   /* layout schematic */
    landmarks:[
     {id:"domes",name:"The hive domes",kind:"dome",at:[0,0],h:1.6,desc:"Domed concrete hives that keep the people of the airless capital alive."},
     {id:"peoples",name:"The People’s Palace",kind:"palace",at:[0.1,0.6],h:1.8,desc:"The seat of the Commonwealth’s rulers in the Great City."},
     {id:"sewers",name:"The sewers",kind:"cave",at:[-0.5,-0.4],desc:"The Red Company escapes through the sewers under the city."},
     {id:"embassy",name:"The embassy",kind:"hall",at:[0.6,-0.3],desc:"The Red Company fights its way across Vedatharad to reach it."}]}},
  {id:"conclave",name:"Grand Conclave",lat:19,lon:42,books:[4],desc:"The arena of the Lothrian government, where the sorcerer Urbaine takes Hadrian and hands him to the Cielcin.",
   scene:{kind:"arena",arch:"brutal",size:"medium",tod:"night",weather:"clear",   /* layout schematic */
    landmarks:[
     {id:"chairs",name:"The Thirty-Four Chairs",kind:"hall",at:[0,0.5],h:1.4,desc:"The ruling council of the Lothrian Commonwealth sits here, already in league with Dorayaica."},
     {id:"floor",name:"The Conclave floor",kind:"arena",at:[0,-0.2],desc:"Where the sorcerer Urbaine takes Hadrian and hands him over to the Cielcin."}]}},
  {id:"everfrost",name:"Everfrost Station",lat:-82,lon:0,books:[4],desc:"A south-polar labour camp mining water.",
   scene:{kind:"industrial",arch:"brutal",size:"small",tod:"night",weather:"snow",   /* layout schematic */
    landmarks:[
     {id:"camp",name:"Everfrost Station",kind:"mine",at:[0,0],desc:"A south-polar labour camp where prisoners mine water ice."}]}}]},

{id:"eue",name:"Eue",aka:["Akterumu"],group:"beyond",books:[4,5,7],major:true,first:4,status:"Ancient seat of the Cielcin",hero:"akterumu",
 star:{name:"Unnamed sun",col:"#ffe0c0"},map:[-4.188,-12.067],
 blurb:"A pale desert world on the far side of the galactic core, once a city of the vanished Enar. Its temple is built inside the skull of a dead Watcher. Syriani Dorayaica is crowned King of Kings here at the Black Feast, and Hadrian’s Red Company is slaughtered.",
 short:"The skull-temple of Akterumu and the Black Feast.",
 facts:[["Builders","The Enar, or Vaiartu"],["Holy to","The Cielcin"]],
 gfx:{type:"desert",sea:0,dune:6,pal:["#000","#000","#a89880","#c8bca4","#6a6258","#ece6da"],clouds:.06,atmo:"#e8d8c0",atmoK:.5,lights:0,
  feat:[{k:"basin",at:[10,20],r:9,s:.5},{k:"biome",style:"rock",at:[10,20],r:5,s:1,c:"#2a2624"}]},
 sites:[
  {id:"akterumu",name:"Akterumu",lat:12,lon:22,books:[4],desc:"The Shrine of the Skull, a city of pillars and gates carved by the Enar.",
   scene:{kind:"ruins",arch:"ancient",size:"huge",tod:"dusk",weather:"dust",pal:{stone:"#c8bca4",ground:"#a89880"},   /* layout schematic */
    landmarks:[
     {id:"pillars",name:"The pillared city",kind:"ruin",at:[-0.4,0],h:1.4,desc:"Endless pillars and halls carved by the Enar, the vanished Firstborn, ages before the Cielcin came."},
     {id:"gates",name:"The great gates",kind:"gate",at:[0,-0.6],h:1.6,desc:"The gates of the Shrine of the Skull, through which the Cielcin princes come to the Aetavanni."},
     {id:"skull",name:"The Skull",kind:"dome",at:[0.2,0.5],h:2.8,col:"#ece6da",desc:"The temple at the city’s heart is built inside the skull of a dead Watcher."}]}},
  {id:"elu",name:"Temple of Elu",lat:10,lon:20,books:[4],desc:"A temple inside the hollow skull of Miudanar, the Dreamer. Here Dorayaica sacrifices the Cielcin princes and is crowned.",
   scene:{kind:"temple",arch:"ancient",size:"large",tod:"night",weather:"dust",under:true,   /* layout schematic */
    landmarks:[
     {id:"skull",name:"Miudanar’s skull",kind:"dome",at:[0,0.3],h:2.4,desc:"The hollow skull of Miudanar, the Dreamer, god of the Cielcin."},
     {id:"altar",name:"The feast floor",kind:"shrine",at:[0,-0.2],desc:"Where Dorayaica sacrifices the Cielcin princes at the Black Feast and is crowned, and where the Red Company is slaughtered."}]}}]},

{id:"hermonassa",name:"Hermonassa",group:"sagittarius",books:[3],first:3,status:"Imperial shipyard world",map:[-3.0,21.2],est:true,
 star:{name:"Unnamed sun",col:"#ffe8c8"},
 blurb:"An Imperial world with a Red Star Foundries shipyard. Dorayaica’s rout of its defenders opens Demon in White: the first sign of a Cielcin prince able to beat the Legions in open battle. The defeat is why William XXIII summons Hadrian to court and sends him out with Prince Alexander.",
 gfx:{type:"barren",sea:.15,pal:["#1a2026","#2a3036","#4a4844","#5c5850","#6e665c","#d0ccc4"],rough:.6,clouds:.2,atmo:"#b0b8c8",atmoK:.5,lights:.6},
 sites:[{id:"foundries",name:"Red Star Foundries",lat:10,lon:30,books:[3],desc:"The Red Star Foundries shipyard, whose defenders Dorayaica routs at the start of Demon in White.",   /* estimated */
   scene:{kind:"industrial",arch:"industrial",size:"large",tod:"night",weather:"clear",   /* layout schematic */
    landmarks:[{id:"yards",name:"The shipyards",kind:"dock",at:[0,0],h:1.6,desc:"Red Star Foundries’ yards. Their fall to Dorayaica sends Hadrian to court."}]}}]},

{id:"thermon",name:"Thermon",group:"sagittarius",books:[4],first:4,status:"Chantry stronghold",map:[-7.2,23.4],est:true,
 star:{name:"Unnamed sun",col:"#ffeed8"},
 blurb:"A Chantry fortress world in the Sagittarine provinces. Between Demon in White and Kingdoms of Death, Hadrian stands trial here for witchcraft for twelve years.",
 gfx:{type:"barren",sea:.3,pal:["#1a1a22","#2a2a34","#4a4446","#5a5254","#6a6266","#dcd8d8"],rough:.6,clouds:.4,atmo:"#c0b8d0",atmoK:.6,lights:.3},
 sites:[{id:"court",name:"The Chantry court",lat:20,lon:0,books:[4],desc:"Where Hadrian stands trial for witchcraft before the Chantry for twelve years, between Demon in White and Kingdoms of Death.",   /* estimated */
   scene:{kind:"fortress",arch:"gothic",size:"medium",tod:"dusk",weather:"mist",walls:true,   /* layout schematic */
    landmarks:[{id:"tribunal",name:"The tribunal",kind:"hall",at:[0,.2],h:1.5,desc:"The Chantry tries Hadrian for witchcraft after Berenike. The trial runs for twelve years."}]}}]},

{id:"tenba",name:"Tenba",group:"sagittarius",books:[7],first:7,status:"Tidally locked world",map:[2.6,23.0],est:true,
 star:{name:"Unnamed sun",col:"#ffd8a8"},
 blurb:"A tidally locked world at the edge of the Sagittarius Arm, its one city built on the line between day and night. The last human muster gathers here before Gododdin.",
 gfx:{type:"desert",sea:.1,dune:4,pal:["#1a2a3a","#3a5a6a","#8a6a4a","#a8885a","#5a5a5a","#f0f4f8"],clouds:.35,atmo:"#ffc890",atmoK:.8,lights:.3},
 sites:[{id:"meridian",name:"Meridian",lat:4,lon:90,books:[7],desc:"The capital, on the terminator.",
   scene:{kind:"capital",arch:"modern",size:"medium",tod:"dusk",weather:"clear",   /* layout schematic */
    landmarks:[
     {id:"city",name:"Meridian",kind:"tower",at:[0,0],h:1.4,desc:"The capital of Tenba, built on the line between endless day and endless night. Humanity’s last fleets gather here."}]}},{id:"morne",name:"Tower of Morne",lat:8,lon:93,books:[7],desc:"Where, the histories say, Hadrian is to be hanged.",
   scene:{kind:"fortress",arch:"gothic",size:"small",tod:"dusk",weather:"clear",   /* layout schematic */
    landmarks:[
     {id:"tower",name:"The Tower of Morne",kind:"tower",at:[0,0],h:2,desc:"Where, the histories say, Hadrian is to be hanged."}]}}]},

/* ---------------- The Sullen Gulf & Centaurus ---------------- */
{id:"gododdin",name:"Gododdin",group:"centaurus",books:[1,3,7],major:true,first:1,status:"Imperial garrison world",hero:"din",
 eras:{7:{status:"Destroyed: its sun murdered",gfx:{type:"lava",sea:.3,pal:["#08080a","#1a1414","#2a1c16","#3a2418","#4a3020","#8a6a5a"],lava:"#ffb04a",clouds:.3,cloudCol:"#6a4a3a",atmo:"#ff9a4a",atmoK:1.1,lights:0},blurb:"The last battle. Humanity masters its fleets at Gododdin, the Cielcin come with their worldships and Watchers, and Hadrian turns its star into a hypernova that destroys the system, the Cielcin host and the gods they serve. This is the murdered sun the first page of the series promised. Gododdin’s capital suffers a devastating explosion amid the final book’s unrest; Hadrian is blamed."}},
 star:{name:"Gododdin’s sun",col:"#fff2d0"},map:[5.635,20.664],
 blurb:"A grain world in the Sullen Gulf between the Sagittarius and Centaurus arms, a waypoint and fortress since the first push into Centaurus. Its grasslands feed the Legions. The opening lines of the series already name it.",
 short:"Fort Din and the Green Sea, in the Sullen Gulf.",
 facts:[["Capital","Catraeth"],["Fortress","Fort Din, in the mountain above the city"],["Neighbours","Elfed, Dal, Ywain, Cynon, Aeron and Eidyn"]],
 gfx:{type:"terran",sea:.4,freq:1.3,pal:["#0c2238","#2e6480","#7a8a3a","#a8a04a","#7a6a4a","#f0eee4"],clouds:.38,atmo:"#8eb2ff",lights:.4,
  feat:[{k:"biome",style:"grass",at:[18,30],r:22,s:1,c:"#b8b05a"},{k:"range",from:[22,8],to:[30,24],w:2.5,s:.25}]},
 sites:[
  {id:"catraeth",name:"Catraeth",lat:24,lon:14,books:[3,7],desc:"The white-stone capital.",
   scene:{kind:"capital",arch:"classical",size:"large",tod:"day",weather:"clear",pal:{stone:"#efeadf"},   /* layout schematic */
    landmarks:[
     {id:"city",name:"White Catraeth",kind:"palace",at:[0,0],h:1.4,desc:"The white-stone capital of Gododdin, below the mountain of Fort Din."},
     {id:"blast",name:"The blast",kind:"crater",at:[0.4,-0.3],h:1,books:[7],desc:"An explosion devastates the city amid the final book’s unrest, and Hadrian is blamed."}]}},
  {id:"din",name:"Fort Din",lat:26,lon:16,books:[3,7],desc:"A bunker fortress in the mountain above Catraeth. Hadrian stops a decimation of Irchtani auxiliaries here.",
   scene:{kind:"fortress",arch:"brutal",size:"medium",tod:"day",weather:"clear",under:true,   /* layout schematic */
    landmarks:[
     {id:"fort",name:"Fort Din",kind:"keep",at:[0,0.2],h:1.6,desc:"A bunker fortress dug into the mountain above Catraeth. Here Hadrian stops the decimation of the Irchtani auxiliaries and wins their loyalty."},
     {id:"hq",name:"Hadrian’s headquarters",kind:"hall",at:[0.4,-0.2],h:1,books:[7],desc:"In the last book Hadrian makes the fortress his headquarters for the final battle."}]}},
  {id:"greensea",name:"The Green Sea",lat:18,lon:30,books:[3],desc:"Grasslands and buttes, and fields of bromos grain for the Legions.",
   scene:{kind:"farm",arch:"rustic",size:"large",tod:"day",weather:"clear",   /* layout schematic */
    landmarks:[
     {id:"fields",name:"The bromos fields",kind:"farm",at:[0,-0.2],desc:"Fields of bromos grain that feed the Legions."},
     {id:"buttes",name:"The buttes",kind:"cliff",at:[0.5,0.5],h:1.3,desc:"Buttes standing over the grasslands."}]}}]},

{id:"nessus",name:"Nessus",group:"centaurus",books:[4,5,6],major:true,first:4,status:"Seat of the Centaurine Primarchate",hero:"maddalo",
 eras:{6:{status:"Fallen",blurb:"The pastoral seat of the Magnarch of Centaurus, where Hadrian spends his long internal exile at Maddalo House. Nessus falls to the Cielcin in the years before Disquiet Gods."}},
 star:{name:"Unnamed sun",col:"#fff0d8"},map:[6.342,18.303],
 blurb:"A green, treeless, pastoral world and the seat of the Magnarch of Centaurus. After Berenike Hadrian is kept here for some seventy years, at Maddalo House, before he is recalled.",
 facts:[["Province","Alicante"],["Capital","Sananne"]],
 gfx:{type:"terran",sea:.42,freq:1.5,pal:["#0c2034","#2e5e7a","#5a7a3a","#7a8e4a","#6a6650","#eeeeea"],clouds:.42,atmo:"#8eb2ff",lights:.55},
 sites:[
  {id:"sananne",name:"Sananne",lat:30,lon:50,books:[4,5],desc:"The cliff-top capital, with the Magnarch’s palace and great shipyards.",
   scene:{kind:"capital",arch:"classical",size:"large",tod:"day",weather:"clear",coast:"s",   /* layout schematic */
    landmarks:[
     {id:"cliffs",name:"The cliffs",kind:"cliff",at:[0,-0.5],h:1.4,desc:"The capital stands on the cliff tops."},
     {id:"palace",name:"The Magnarch’s palace",kind:"palace",at:[0,0.3],h:1.7,desc:"The seat of the Magnarch of Centaurus."},
     {id:"yards",name:"The shipyards",kind:"dock",at:[0.6,-0.1],desc:"Great shipyards serving the Centaurine provinces."}]}},
  {id:"maddalo",name:"Maddalo House",lat:27,lon:46,books:[4,5],desc:"A former monastery with an English garden and koi ponds: Hadrian and Valka’s home in exile.",
   scene:{kind:"monastery",arch:"classical",size:"small",tod:"dusk",weather:"clear",   /* layout schematic */
    landmarks:[
     {id:"house",name:"Maddalo House",kind:"house",at:[0,0.2],h:1.2,desc:"A former monastery, Hadrian and Valka’s home through long decades of internal exile."},
     {id:"garden",name:"The English garden",kind:"garden",at:[-0.4,-0.3],desc:"The garden around the old house."},
     {id:"ponds",name:"The koi ponds",kind:"lake",at:[0.4,-0.3],desc:"Ponds in the garden at Maddalo House."}]}}]},

{id:"eikana",name:"Eikana",group:"centaurus",books:[4],first:4,status:"Fuel world",map:[7.7,17.1],est:true,
 star:{name:"Unnamed sun",col:"#fff4e4"},
 blurb:"An airless desert world that fuels Nessus. Kingdoms of Death opens with Hadrian recalled from exile to save its antimatter refinery from Hushansa of Dorayaica’s White Hand.",
 gfx:{type:"barren",pal:["#2a2c30","#3a3c40","#7a7c80","#9a9ca0","#b0b2b6","#e8eaec"],rough:.5,sea:0,atmoK:0,bump:1,lights:.45,lightCol:"#bfe0ff"},
 sites:[{id:"yamato",name:"Yamato Fuelworks",lat:10,lon:20,books:[4],desc:"The antimatter refinery on the silver sands of the Virdi Planum.",
   scene:{kind:"industrial",arch:"industrial",size:"medium",tod:"day",weather:"clear",pal:{ground:"#c8ccd0"},   /* layout schematic */
    landmarks:[
     {id:"refinery",name:"Yamato Fuelworks",kind:"factory",at:[0,0.1],h:1.6,desc:"The antimatter refinery that fuels Nessus, attacked by Hushansa of the White Hand."},
     {id:"planum",name:"The Virdi Planum",at:[0,-0.6],desc:"The silver sands around the refinery."}]}}]},

{id:"berenike",name:"Berenike",group:"centaurus",books:[3],major:true,first:3,status:"Legion fortress world",hero:"deira",map:[5.6,15.3],est:true,
 star:{name:"Unnamed sun",col:"#ffeed0"},
 blurb:"A flat, storm-wracked world on the Centaurine frontier facing the Veil. In Demon in White the Cielcin attack it in force. Valka is grievously wounded, Hauptmann dies, and Hadrian walks out alone to Dorayaica’s worldship and lives because he chooses a world in which its great gun misses.",
 short:"The storm world where Hadrian chooses his future.",
 facts:[["Prefecture","Deira"],["Weather","Equatorial storms above 200 mph"]],
 gfx:{type:"toxic",sea:.5,pal:["#1a2a1a","#3a4a2a","#4a4a2a","#5a5a34","#6a5a40","#d8d4c4"],clouds:.6,cloudCol:"#d8dcc8",atmo:"#b8c8a0",atmoK:.9,lights:.25,
  feat:[{k:"basin",from:[-6,-20],to:[4,30],w:1.8,at:[-1,5],r:4,s:.7}]},
 sites:[
  {id:"deira",name:"Deira",lat:-4,lon:8,books:[3],desc:"The only real city, much of it below ground.",
   scene:{kind:"city",arch:"brutal",size:"medium",tod:"day",weather:"storm",under:true,   /* layout schematic */
    landmarks:[
     {id:"city",name:"Deira",kind:"hall",at:[0,0],desc:"Berenike’s only real city, much of it dug below ground against the storms."}]}},
  {id:"merguli",name:"Valles Merguli",lat:-2,lon:4,books:[3],desc:"A chasm more than five miles deep that shelters the settlements.",
   scene:{kind:"wilds",arch:"brutal",size:"medium",tod:"day",weather:"storm",   /* layout schematic */
    landmarks:[
     {id:"chasm",name:"Valles Merguli",kind:"cliff",at:[0,0],h:1.8,desc:"A chasm more than five miles deep that shelters the settlements from the wind."}]}},
  {id:"stormwall",name:"The Storm Wall",lat:-6,lon:12,books:[3],desc:"A mile-high wall. Hadrian walks out from it to surrender himself.",
   scene:{kind:"fortress",arch:"brutal",size:"medium",tod:"day",weather:"storm",walls:true,   /* layout schematic */
    landmarks:[
     {id:"wall",name:"The Storm Wall",kind:"wall",at:[0,0.3],h:2.4,desc:"A mile-high wall against Berenike’s storms, held by the Legions when the Cielcin come in force."},
     {id:"plain",name:"The storm plain",at:[0,-0.5],desc:"The flat, wind-scoured ground beyond the Wall, where Hadrian walks out alone toward Dorayaica’s worldship."}]}}]},

{id:"carteia",name:"Carteia",group:"centaurus",books:[5],major:true,first:5,status:"Imperial world · the Emperor’s camp",hero:"camp",map:[16.53,15.747],
 star:{name:"Carteia’s white sun",col:"#f4f6ff"},
 blurb:"An icy world under a white sun, scarred by the crater where its capital, Rothsmoor, was destroyed. In Ashes of Man the Emperor keeps his court in the field here, and meets Hadrian in secret.",
 facts:[["Destroyed","Rothsmoor, ISD 17041"],["Day","29 hours"]],
 gfx:{type:"ice",sea:.15,pal:["#6a7e96","#8aa0b8","#c8d2dc","#dce4ec","#eef2f6","#ffffff"],clouds:.3,atmo:"#c0d4ff",atmoK:.6,bump:1.2,lights:.3,
  feat:[{k:"basin",at:[30,-40],r:5,s:.7},{k:"biome",style:"rock",at:[30,-40],r:3.5,s:1,c:"#1a1a1c"}]},
 sites:[{id:"camp",name:"The Emperor’s Camp",lat:24,lon:-30,books:[5],desc:"A moving city of grounded ships around the Emperor’s flagship, the Radiant Dawn.",
   scene:{kind:"camp",arch:"imperial",size:"large",tod:"day",weather:"snow",sky:{sun:"#f4f6ff"},   /* layout schematic */
    landmarks:[
     {id:"radiant",name:"The Radiant Dawn",kind:"ship",at:[0,0.2],h:2,desc:"The Emperor’s flagship, at the heart of the camp."},
     {id:"ships",name:"The grounded ships",kind:"ship",at:[-0.5,-0.3],h:1.2,desc:"The Emperor’s court travels as a moving city of grounded ships."}]}},{id:"rothsmoor",name:"Rothsmoor",lat:30,lon:-40,books:[5],desc:"The ruined old capital. In its ruins the Emperor tells Hadrian what his secret service knows about dead civilizations.",
   scene:{kind:"ruins",arch:"imperial",size:"medium",tod:"day",weather:"snow",   /* layout schematic */
    landmarks:[
     {id:"crater",name:"The crater",kind:"crater",at:[0.3,0.3],h:1.4,desc:"Where the old capital was destroyed in ISD 17041."},
     {id:"ruins",name:"The ruins of Rothsmoor",kind:"ruin",at:[-0.3,-0.2],desc:"Here the Emperor meets Hadrian in secret and tells him what his service knows of dead civilizations."}]}}]},

{id:"ganelon",name:"Ganelon",aka:["VA-639D"],group:"centaurus",books:[5],first:5,status:"MINOS research base",map:[15.4,17.3],est:true,
 star:{name:"Unnamed sun",col:"#ffd8b0"},
 blurb:"A half-barren world where the machine cult MINOS breeds a plague for the Cielcin. Hadrian leads a strike that destroys its tower, and a Jaddian prince arrives who turns out to be an old friend from Emesh.",
 gfx:{type:"barren",sea:.2,pal:["#2a2420","#3a322a","#5a4e40","#6a5c4a","#7a6c5a","#d8d0c4"],rough:.7,clouds:.15,atmo:"#d0b898",atmoK:.4},
 sites:[{id:"darktower",name:"The Dark Tower",lat:-10,lon:40,books:[5],desc:"MINOS’s laboratory, where the Lethovirus is made. Hadrian’s strike team destroys it with atomics.",
   scene:{kind:"fortress",arch:"industrial",size:"small",tod:"night",weather:"dust",   /* layout schematic */
    landmarks:[
     {id:"tower",name:"The Dark Tower",kind:"tower",at:[0,0],h:2.2,desc:"The MINOS laboratory where the Lethovirus is bred for the Cielcin. Hadrian’s strike team destroys it with atomics."}]}}]},

{id:"fidchell",name:"Fidchell",group:"centaurus",books:[5],first:5,status:"Legion fuel station",map:[14.4,18.8],est:true,
 star:{name:"Unnamed sun",col:"#ffe8d0"},
 blurb:"A cold outer world with a great ring station for refuelling fleets. Here Hadrian learns the Emperor is trapped at Perfugium.",
 gfx:{type:"ice",sea:0,pal:["#4a5a6a","#6a7a8a","#9aa4ae","#b4bcc4","#d0d6dc","#f6f8fa"],clouds:.1,atmoK:.3,lights:.2},
 ring:{inner:1.5,outer:1.56,c1:"#c8ccd4",c2:"#7a808a",tilt:.4,seed:2},
 sites:[{id:"station",name:"Fidchell Station",lat:0,lon:0,books:[5],desc:"A great ring station where Legion fleets refuel. Word reaches Hadrian here that the Emperor is besieged at Perfugium.",
   scene:{kind:"station",arch:"industrial",size:"large",tod:"night",weather:"clear",space:true,sky:{planet:{c:"#b4bcc4",size:2}},   /* layout schematic */
    landmarks:[{id:"ring",name:"The fuel ring",kind:"ring",at:[0,.2],h:1.8,desc:"The ring station circling cold Fidchell, where fleets take on fuel."},
     {id:"telegraph",name:"The telegraph",kind:"mast",at:[.5,-.3],desc:"News of the siege of Perfugium comes in to the station."}]}}]},

{id:"perfugium",name:"Perfugium",group:"centaurus",books:[5],major:true,first:5,status:"House Valavar · ruined",hero:"resonno",map:[12.897,17.257],
 star:{name:"Unnamed sun",col:"#fff0dc"},
 blurb:"A Centaurine world besieged by seven worldships while the Emperor is on tour. Hadrian, Bassander Lin and Kaim rescue William XXIII, but Valka dies in the evacuation. On the way home Hadrian breaks the Emperor’s nose and is condemned.",
 short:"Where Valka dies and Hadrian strikes the Emperor.",
 facts:[["Capital","Resonno, left in ruins"],["Battle","ISD 17136"]],
 gfx:{type:"barren",sea:.3,pal:["#16181a","#26282a","#4a4844","#5a5650","#6a645c","#b8b4ac"],rough:.6,clouds:.45,cloudCol:"#8a8680",atmo:"#a8a49c",atmoK:.7,lights:.1},
 sites:[{id:"resonno",name:"Resonno",lat:14,lon:-20,books:[5],desc:"The capital, turned to grey sand and melted towers. The fighting runs through its Colosso and catacombs.",
   scene:{kind:"ruins",arch:"imperial",size:"large",tod:"day",weather:"ash",pal:{ground:"#8a8680"},   /* layout schematic */
    landmarks:[
     {id:"colosso",name:"The Colosso",kind:"arena",at:[0,0.2],h:1.4,desc:"Resonno’s arena, where the fighting rages as Hadrian, Bassander Lin and Kaim fight to reach the Emperor."},
     {id:"towers",name:"The melted towers",kind:"ruin",at:[0.5,-0.3],h:1.6,desc:"The capital is left as grey sand and melted towers."},
     {id:"catacombs",name:"The catacomb entrance",kind:"cave",at:[-0.5,-0.3],desc:"The way down into vaults where millions of people sleep in fugue."}]}},{id:"catacombs",name:"The catacombs",lat:12,lon:-17,books:[5],desc:"Vaults holding millions of people asleep in fugue.",
   scene:{kind:"tombs",arch:"imperial",size:"medium",tod:"night",weather:"clear",under:true,   /* layout schematic */
    landmarks:[
     {id:"vaults",name:"The fugue vaults",kind:"tomb",at:[0,0],desc:"Vaults holding millions of Perfugium’s people asleep in fugue."}]}}]},

{id:"danu",name:"Danu",group:"centaurus",books:[2,7],first:2,status:"Imperial duchy",map:[8.6,19.8],est:true,
 eras:{7:{status:"Torn apart",gfx:{type:"lava",sea:.25,pal:["#0a0808","#1a1210","#2a1a14","#3a221a","#4a2a20","#7a5a4a"],lava:"#ff6a2a",clouds:.3,cloudCol:"#5a4a40",atmo:"#ff8a4a"},blurb:"The birthplace of Switch, one of Hadrian’s first companions. In the final book Cielcin worldships tear Danu apart and the Watcher Ushara destroys the Tavrosi fleet sent to defend it."}},
 star:{name:"Unnamed sun",col:"#fff2dc"},
 blurb:"A major Centaurine duchy and the birthplace of Switch, one of Hadrian’s first companions.",
 gfx:{type:"terran",sea:.55,pal:["#0a1e36","#2a5e86","#3e6034","#6a7e48","#76705e","#f2f2ee"],clouds:.45,atmo:"#86aaff",lights:.5}},

{id:"bracara",name:"Bracara",group:"centaurus",books:[7],first:7,status:"Imperial world",map:[4.2,19.6],est:true,
 star:{name:"Unnamed sun",col:"#fff0d8"},
 blurb:"Where the human fleet waits for months for the Cielcin in the last book.",
 gfx:{type:"forest",sea:.4,pal:["#0a2236","#2a5a6a","#1e4a22","#2f6a28","#4a6a3a","#e8ece6"],clouds:.5,atmo:"#80b4ff"}},

{id:"caishen",name:"Cai Shen",group:"centaurus",books:[1],first:1,status:"Mandari world · destroyed",map:[11.2,19.6],est:true,
 star:{name:"Unnamed sun",col:"#ffecd0"},
 blurb:"A Mandari world with a famous temple, burned by the Cielcin in ISD 16130 while Hadrian is still a boy.",
 gfx:{type:"barren",sea:.2,pal:["#100c0a","#201812","#3a2c22","#4a382a","#5a4434","#9a8070"],rough:.6,clouds:.25,cloudCol:"#5a4a40",atmo:"#c08060",atmoK:.5}},

{id:"nemavand",name:"Nemavand",group:"centaurus",books:[3],first:3,status:"Frontier colony",map:[13.115,12.807],
 star:{name:"Unnamed sun",col:"#ffeed8"},
 blurb:"A colony in Rammanu Province on the Veil frontier. Hadrian’s fleet is bound here from Gododdin when Iubalu’s worldship drags it out of warp.",
 gfx:{type:"terran",sea:.5,pal:["#0c1e34","#2c5a7c","#4a5e3a","#6c7a4c","#6e6a5a","#eeeeea"],clouds:.48,atmo:"#8aaeff",lights:.2}},

{id:"beast",name:"Iubalu’s worldship",aka:["The Beast"],group:"centaurus",craft:true,books:[3],first:3,status:"Cielcin worldship · destroyed",map:[9.5,16.6],
 star:{name:"Deep space between Gododdin and Nemavand",col:"#ff8a6a"},
 blurb:"A Cielcin worldship that nets Hadrian’s fleet in deep space. Hadrian boards it, finds the Cielcin eating a captured Imperial crew from their fugue pods, and kills Iubalu, one of Dorayaica’s White Hand.",
 gfx:{type:"hive",sea:0,pal:["#121214","#2a2a2c","#4a4846","#5a5654","#3a3836","#bcb8b0"],lights:.55,lightCol:"#9fd8ff",clouds:0,atmoK:0,rough:.8,bump:1.6},
 sites:[{id:"holds",name:"The worldship’s holds",lat:10,lon:0,books:[3],desc:"Inside Iubalu’s worldship, where Hadrian finds the Cielcin feeding on a captured Imperial crew taken from their fugue pods.",
   scene:{kind:"underground",arch:"alien",size:"large",tod:"night",weather:"clear",under:true,pal:{light:"#9fd8ff"},   /* layout schematic */
    landmarks:[{id:"pods",name:"The fugue pods",kind:"hall",at:[-.4,0],desc:"A captured Imperial crew, still in their fugue pods, kept as food."},
     {id:"iubalu",name:"Iubalu’s end",kind:"throne",at:[.4,.4],h:1.3,desc:"Where Hadrian kills Iubalu, one of Dorayaica’s White Hand."}]}}]},

/* ---------------- Norma: the Veil of Marinus & Norman Expanse ---------------- */
{id:"emesh",name:"Emesh",group:"norma",books:[1,2,4,5],major:true,first:1,status:"Imperial world · House Mataro",hero:"borosevo",
 star:{name:"Emesh’s red sun",col:"#ff8e6a"},map:[9.311,9.845],
 blurb:"A hot ocean world under a weeping red sun, annexed from the Normans. Robbed and stranded here, Hadrian lives as a street thief, fights as a gladiator, serves Count Mataro, explores the ruins at Calagah with Valka Onderra, and meets the Cielcin for the first time.",
 short:"Where Hadrian is stranded, and first meets the Cielcin.",
 facts:[["Gravity","1.3 times Delos"],["Continent","Anshar, the only one"],["Moons","Armand (white, mined) and Binah (green, terraformed)"]],
 gfx:{type:"ocean",sea:.9,freq:1.5,pal:["#04121e","#103e4e","#2a2a26","#3a3430","#4a3e36","#e0dcd4"],clouds:.42,atmo:"#ff9a7a",atmoK:.9,lights:.3,ice:88,sw:"#1a5a6e",
  feat:[{k:"continent",at:[-30,40],r:14,s:.3},{k:"biome",style:"rock",at:[-30,40],r:10,s:.8,c:"#2a2624"}]},
 moons:[{name:"Armand",size:.12,dist:2.7,gfx:{type:"barren",pal:["#5a5a5a","#7a7a7a","#a0a0a0","#b8b8b8","#d0d0d0","#f0f0f0"],rough:.8}},{name:"Binah",size:.17,dist:3.8,gfx:{type:"forest",sea:.2,pal:["#0a2a3a","#2a5a6a","#1a5a22","#2a7a2a","#3a6a3a","#e8f0e4"],clouds:.3,atmo:"#9ad0a0",atmoK:.6}}],
 sites:[
  {id:"borosevo",name:"Borosevo",lat:6,lon:10,books:[1],sea:true,desc:"A ring-atoll city on steel pilings, crossed by canals. Hadrian begs in its Belows, loses his friend Cat to plague, and fights in the Colosso as a myrmidon.",
   scene:{kind:"city",arch:"modern",size:"large",tod:"dusk",weather:"rain",water:true,sky:{sun:"#ff8e6a",moons:2},pal:{light:"#ffb070"},   /* layout schematic */
    landmarks:[
     {id:"belows",name:"The Belows",kind:"market",at:[-0.4,-0.4],desc:"The undercity where Hadrian lives as a beggar and thief, and where his friend Cat dies of plague."},
     {id:"colosso",name:"The Colosso",kind:"arena",at:[0.35,0.1],h:1.5,desc:"Borosevo’s arena, where Hadrian fights as a myrmidon beside Switch and Pallino."},
     {id:"canals",name:"The canals",kind:"bridge",at:[-0.1,0.1],desc:"The ring-atoll city stands on steel pilings and is crossed by canals."},
     {id:"castleview",name:"Castle Borosevo",kind:"ziggurat",at:[0,0.7],h:1.8,desc:"The count’s seat rises on its concrete ziggurat above the city."}]}},
  {id:"castle",name:"Castle Borosevo",lat:7,lon:11.5,books:[1],sea:true,desc:"Count Mataro’s seat on a concrete ziggurat. Hadrian lives here as a companion to the count’s daughter Anaïs.",
   scene:{kind:"palace",arch:"modern",size:"medium",tod:"day",weather:"clear",coast:"s",sky:{sun:"#ff8e6a",moons:2},   /* layout schematic */
    landmarks:[
     {id:"ziggurat",name:"The ziggurat",kind:"ziggurat",at:[0,0.2],h:2,desc:"Count Mataro’s seat. Hadrian lives here as a companion for the count’s daughter Anaïs, and meets the Tavrosi xenologist Valka Onderra."}]}},
  {id:"calagah",name:"Calagah",lat:-30,lon:40,books:[1,5],desc:"Black ruins of the Quiet, reachable only at extreme tide. Here Hadrian has his first visions, and a Cielcin scout ship lands nearby.",
   scene:{kind:"ruins",arch:"alien",size:"medium",tod:"dusk",weather:"mist",coast:"s",sky:{sun:"#ff8e6a"},pal:{stone:"#141416"},   /* layout schematic */
    landmarks:[
     {id:"ruins",name:"The black ruins",kind:"ruin",at:[0,0.2],h:1.6,desc:"Ruins of black stone left by the Quiet, reachable only at extreme tide, which Valka Onderra has come to study."},
     {id:"chamber",name:"The chamber of visions",kind:"cave",at:[-0.3,0.45],desc:"A strange chamber in the ruins where Hadrian has his first vision."},
     {id:"landing",name:"The Cielcin landing",kind:"wreck",at:[0.5,-0.4],desc:"A Cielcin ship comes down near the ruins, and Hadrian helps capture its survivors."}]}},
  {id:"ulakiel",name:"Ulakiel",lat:2,lon:-20,books:[1],sea:true,desc:"The island where the native Umandh are kept.",
   scene:{kind:"camp",arch:"modern",size:"small",tod:"day",weather:"rain",water:true,   /* layout schematic */
    landmarks:[
     {id:"alienage",name:"The Umandh alienage",kind:"camp",at:[0,0],desc:"Where the three-legged native Umandh are kept."}]}}]},

{id:"rustam",name:"Rustam",group:"norma",books:[2,3],first:2,status:"Imperial colony · Norman Expanse",hero:"arslan",map:[5.142,10.626],
 star:{name:"Unnamed sun",col:"#fff0c8"},
 blurb:"An ochre world with yellow seas, its old capital torn open by a Cielcin attack. In Howling Dark Hadrian steals the Cielcin prisoner Tanaran here, maims Bassander Lin, and breaks with the Legions to seek Vorgossos.",
 gfx:{type:"desert",sea:.3,dune:5,pal:["#6a5a1a","#a89a3a","#9a7440","#b08a50","#7a5a3a","#e8dcc0"],clouds:.2,atmo:"#f0d090",atmoK:.8,lights:.25,
  feat:[{k:"range",from:[10,20],to:[14,48],w:.8,s:-.3}]},
 sites:[{id:"arslan",name:"Arslan",lat:12,lon:30,books:[2],desc:"A refugee city built from grounded starships. Hadrian meets and kills the Extrasolarian called the Painted Man.",
   scene:{kind:"city",arch:"industrial",size:"medium",tod:"day",weather:"dust",   /* layout schematic */
    landmarks:[
     {id:"ships",name:"The grounded starships",kind:"ship",at:[0,0],h:1.4,desc:"A refugee city built from grounded starships. Hadrian meets and kills the Extrasolarian called the Painted Man here."}]}},{id:"rent",name:"The rent",lat:12,lon:34,books:[2],desc:"A fifty-mile wound in the crust where the old capital stood.",
   scene:{kind:"crater",arch:"ancient",size:"large",tod:"dusk",weather:"dust",   /* layout schematic */
    landmarks:[
     {id:"wound",name:"The rent",kind:"crater",at:[0,0],h:1.5,desc:"A fifty-mile wound in the crust where the old capital stood before the Cielcin attack."}]}}]},

{id:"march",name:"March Station",group:"norma",craft:true,books:[2],first:2,status:"Extrasolarian ring station",map:[7.2,11.4],est:true,
 star:{name:"A cold blue supergiant",col:"#a8c4ff"},
 blurb:"An Extrasolarian ring city circling the disk of a blue giant. The broker Antonius Brevon sells Hadrian the way to Vorgossos in exchange for the Cielcin prisoner’s blood.",
 gfx:{type:"city",sea:0,pal:["#101418","#20262c","#3a4046","#4a5056","#6a7076","#c8ccd0"],lights:.9,lightCol:"#bfe0ff",clouds:0,atmoK:0},
 sites:[{id:"ring",name:"The ring city",lat:0,lon:0,books:[2],desc:"The Extrasolarian city on its ring around the blue giant, where Hadrian bargains with Antonius Brevon.",
   scene:{kind:"station",arch:"modern",size:"large",tod:"night",weather:"clear",space:true,sky:{sun:"#a8c4ff"},   /* layout schematic */
    landmarks:[{id:"brevon",name:"Brevon’s market",kind:"market",at:[0,.1],desc:"The broker Antonius Brevon sells Hadrian the way to Vorgossos, for the blood of his Cielcin prisoner."},
     {id:"enigma",name:"The Enigma of Hours",kind:"ship",at:[.55,-.35],h:1.6,desc:"A vast Sojourner ship. An oracle aboard speaks to Hadrian in Cat’s last words."}]}}]},

{id:"monmara",name:"Monmara",group:"norma",books:[1,6],first:1,status:"Norman freehold",map:[6.538,7.596],
 eras:{6:{status:"Destroyed",blurb:"A Norman water world known for cheap starships, where the Meidua Red Company was formally founded. By Disquiet Gods the Cielcin have destroyed it."}},
 star:{name:"Unnamed sun",col:"#fff0dc"},
 blurb:"A Norman water world known for cheap, mass-produced starships. The Meidua Red Company, chartered to search for Vorgossos, is formally founded here.",
 gfx:{type:"ocean",sea:.96,pal:["#06203a","#1a6a8a","#3a5a3a","#5a7a4a","#5a5a4a","#f4f4f4"],clouds:.5,atmo:"#7ab8ff",lights:.3}},

{id:"pharos",name:"Pharos",group:"norma",books:[2],first:2,status:"Norman freehold",map:[10.342,5.185],
 star:{name:"Unnamed sun",col:"#ffeed8"},
 blurb:"A jungle and ice freehold ruled by a dictator admiral. The Red Company’s first battle is fought here in ISD 16179, told in the stories The Guns of Pharos and Falling Angels.",
 gfx:{type:"forest",sea:.45,pal:["#082236","#1a5a6a","#1a4a1a","#2f7024","#4a6a32","#f4f8fc"],clouds:.5,atmo:"#80b8ff",ice:55}},

{id:"cressgard",name:"Cressgard",group:"norma",books:[1],first:1,status:"Lost Imperial colony",map:[13.042,6.61],
 star:{name:"Unnamed sun",col:"#ffe8d0"},
 blurb:"An Imperial colony in the Norma Arm where humans first met the Cielcin, in ISD 15792, three centuries before Hadrian is born. The colony was lost, and the war that followed has never ended.",
 gfx:{type:"barren",sea:.25,pal:["#0e1012","#1e2024","#3a3632","#4a443c","#5a5248","#a8a098"],rough:.6,clouds:.2,atmo:"#9aa0b0",atmoK:.4}},

{id:"marinus",name:"Marinus",group:"norma",books:[3],first:3,status:"First freehold annexed",map:[4.64,13.107],
 star:{name:"Unnamed sun",col:"#fff0e0"},
 blurb:"The first Norman freehold the Empire seized, which gives the Veil its name. Its fall in ISD 16632 is a disaster, and bait for the trap at Berenike.",
 gfx:{type:"archipelago",sea:.66,pal:["#05284a","#1a8aa8","#3a7a3a","#5a8a44","#6a6a4a","#f2f2f2"],clouds:.45,atmo:"#7ab8ff",lights:.2}},

{id:"thagura",name:"Thagura",group:"norma",books:[3],first:3,status:"Imperial colony",map:[21.188,11.074],
 star:{name:"Unnamed sun",col:"#ffe0b8"},
 blurb:"A desert colony under a great red stone dome. Hadrian’s company defeats a Cielcin prince here in ISD 16257, the story of the novella Queen Amid Ashes.",
 gfx:{type:"desert",sea:0,dune:9,pal:["#000","#000","#a8582e","#c8763e","#8a3e22","#ecc8a0"],clouds:.06,atmo:"#ffb080",atmoK:.7,lights:.1},
 sites:[{id:"rock",name:"The Rock",lat:14,lon:10,books:[3],desc:"A red stone dome thousands of feet high above the city of Pseldona and the dunes of the Tagurine Erg.",
   scene:{kind:"city",arch:"desert",size:"large",tod:"day",weather:"dust",pal:{stone:"#a8582e"},   /* layout schematic */
    landmarks:[
     {id:"dome",name:"The Rock",kind:"dome",at:[0,0.2],h:3,desc:"A red stone dome thousands of feet high over the city."},
     {id:"pseldona",name:"Pseldona",kind:"house",at:[0,-0.1],desc:"The city under the Rock, where the Red Company defeats Prince Muzugara."},
     {id:"erg",name:"The Tagurine Erg",at:[0.6,-0.6],desc:"The dune sea around the Rock."}]}}]},

{id:"aptucca",name:"Aptucca",group:"norma",books:[2,3],first:2,status:"Imperial colony",map:[20.732,6.821],
 star:{name:"Unnamed sun",col:"#ffeed6"},
 blurb:"Site of one of Hadrian’s greatest victories, over the Cielcin prince Ulurani in ISD 16462. It is remembered in Demon in White but never shown.",
 gfx:{type:"terran",sea:.45,pal:["#0a1e34","#2a5a7a","#5a6a3a","#7a8048","#7a6a52","#eeeeea"],clouds:.4,atmo:"#8ab0ff",lights:.2}},

{id:"arae",name:"Arae",group:"norma",books:[3],first:3,status:"Uninhabited",map:[17.6,8.6],est:true,
 star:{name:"Unnamed sun",col:"#fff4e8"},
 blurb:"A lifeless world of salt flats where the Red Company fights mercenaries in ISD 16443, in the story The Demons of Arae.",
 gfx:{type:"desert",sea:0,dune:3,pal:["#000","#000","#c8c4bc","#dcd8d0","#a8a49c","#ffffff"],clouds:0,atmoK:.2},
 sites:[{id:"flats",name:"The salt flats",lat:0,lon:0,books:[3],desc:"The lifeless salt plains where the Red Company fights mercenaries, in the story The Demons of Arae.",   /* estimated */
   scene:{kind:"desert",arch:"modern",size:"large",tod:"day",weather:"clear",pal:{ground:"#e4e0d8"},   /* layout schematic */
    landmarks:[{id:"flats",name:"The salt flats",kind:"crater",at:[0,0],desc:"White salt to the horizon, the battleground of The Demons of Arae."}]}}]},

{id:"tyras",name:"Tyras",group:"norma",books:[2],first:2,status:"Annexed freehold · destroyed",map:[5.9,9.6],est:true,
 star:{name:"Unnamed sun",col:"#ffeed8"},
 blurb:"An annexed freehold destroyed by the Cielcin in ISD 16216, just before Howling Dark opens.",
 gfx:{type:"barren",sea:.2,pal:["#100c0a","#201812","#3a2a20","#4a3428","#5a4030","#9a8070"],rough:.6,clouds:.2,cloudCol:"#5a4a40",atmo:"#c08060",atmoK:.4}},

{id:"latarra",name:"Latarra",group:"norma",books:[6],major:true,first:6,status:"Seat of the Monarch",hero:"printed",map:[-3.976,11.177],
 star:{name:"Unnamed sun",col:"#fff0dc"},
 blurb:"A former freehold in the Veil, now the capital of Calen Harendotes, the Monarch, and his New Order. Lorian Aristedes keeps a home here. The Monarch proves to be another Kharn Sagara, and becomes the Empire’s ally against Vorgossos.",
 short:"The Monarch’s Printed City.",
 facts:[["Ruler","Calen Harendotes, the Monarch"],["Old city","The Maze, some 20 million people"]],
 gfx:{type:"city",sea:.35,pal:["#141a20","#2a3a46","#5a5a54","#6a6a60","#8a8478","#e6e2d8"],lights:.85,clouds:.45,cloudCol:"#c8c4bc",atmo:"#c0b8a8",atmoK:.9,lightCol:"#fff0d0"},
 sites:[{id:"printed",name:"The Printed City",lat:20,lon:-10,books:[6],desc:"A white city of machine-cut limestone around the Citadel ziggurat.",
   scene:{kind:"capital",arch:"classical",size:"large",tod:"day",weather:"clear",pal:{stone:"#ece6d8"},   /* layout schematic */
    landmarks:[
     {id:"citadel",name:"The Citadel",kind:"ziggurat",at:[0,0.3],h:2.2,desc:"The Monarch’s ziggurat at the heart of the white city. Its ruler, Calen Harendotes, proves to be another Kharn Sagara."},
     {id:"streets",name:"The limestone streets",kind:"plaza",at:[0,-0.4],desc:"A white city of machine-cut limestone."}]}},{id:"maze",name:"The Maze",lat:18,lon:-14,books:[6],desc:"The old city: canals, steam pillars and twenty million people.",
   scene:{kind:"city",arch:"industrial",size:"huge",tod:"dusk",weather:"mist",river:true,   /* layout schematic */
    landmarks:[
     {id:"canals",name:"The canals",kind:"bridge",at:[0,0],desc:"The old city of Latarra, threaded with canals and home to some twenty million people."},
     {id:"steam",name:"The steam pillars",kind:"tower",at:[0.4,0.4],h:1.6,desc:"Pillars of steam rising over the Maze."}]}}]},

{id:"annica",name:"Annica",group:"beyond",books:[3,7],major:true,first:3,status:"Quiet ruins",hero:"mountain",map:[11.726,-13.436],
 star:{name:"A red dwarf",col:"#ff7a54"},
 blurb:"An airless world around a red dwarf on the far side of the galactic core. On its Mountain Hadrian climbs through buried arches and meets the Quiet, who show him time and let him choose between possible worlds.",
 short:"The Mountain of the Quiet.",
 facts:[["Found by","Coordinates from the U.S.S. Horizon"]],
 gfx:{type:"barren",pal:["#120c0a","#1e1612","#2e2420","#3a2e28","#4a3c34","#8a7a70"],rough:.8,sea:0,atmoK:0,bump:1.8,
  feat:[{k:"peak",at:[12,-30],r:7,s:1}]},
 sites:[{id:"mountain",name:"The Mountain",lat:12,lon:-30,books:[3,7],desc:"A towering peak hollowed with arches and caves left by the Quiet. Hadrian reaches its summit in Demon in White.",
   scene:{kind:"mountain",arch:"ancient",size:"large",tod:"night",weather:"clear",sky:{sun:"#ff7a54"},   /* layout schematic */
    landmarks:[
     {id:"arches",name:"The buried arches",kind:"arch",at:[-0.3,-0.3],h:1.4,desc:"Arches and caves left by the Quiet, through which Hadrian climbs."},
     {id:"summit",name:"The summit",kind:"peak",at:[0,0.5],h:2.6,desc:"At the top Hadrian meets the Quiet, who show him time and give him the power to choose between possible outcomes."},
     {id:"refuge",name:"The exile’s camp",kind:"camp",at:[0.4,-0.4],h:1,books:[7],desc:"In the last book Hadrian waits here beyond the core, a fugitive from Empire and Chantry."}]}}]},

/* ---------------- Perseus ---------------- */
{id:"jadd",name:"Jadd",group:"perseus",books:[1,5,6],major:true,first:1,status:"Sacred world of the Jaddian Principalities",hero:"fireschool",
 star:{name:"Jadd’s red sun",col:"#ff9a6a"},map:[-20.343,20.645],
 blurb:"A volcanic world of fire and black sand under a red sun, holy capital of the eighty-one Jaddian princes, who broke from the Empire long ago and now fight beside it. Jaddian knights like Olorin Milta are famous swordmasters.",
 eras:{5:{status:"Hadrian’s place of exile",blurb:"A volcanic world of fire and black sand under a red sun, holy capital of the eighty-one Jaddian princes. After striking the Emperor, Hadrian escapes here with Prince Kaim-Olorin, carrying what is left of Valka."},6:{status:"Hadrian’s home in exile",blurb:"A volcanic world of fire and black sand under a red sun, holy capital of the eighty-one Jaddian princes. Hadrian lives here for two centuries after Ashes of Man and raises his daughter Cassandra, who trains as a swordmaster at the Fire School."}},
 short:"Hadrian’s refuge, and Cassandra’s home.",
 facts:[["Moons","Three: Taiph (green, terraformed) and two white"],["Capital","Jaharrad"],["Seceded","ISD 11466"]],
 gfx:{type:"lava",sea:.5,pal:["#06141c","#1a4a5a","#1c1916","#2e2620","#3a3028","#8a8478"],lava:"#ff7a2a",clouds:.35,cloudCol:"#d8c8b8",atmo:"#ffb080",atmoK:.9,lights:.4},
 moons:[{name:"Taiph",size:.2,dist:3.1,gfx:{type:"forest",sea:.3,pal:["#0a2a3a","#2a5a6a","#2a5a22","#3a7a2a","#4a6a3a","#e8f0e4"],clouds:.3,atmo:"#9ad0a0",atmoK:.5}},{name:"Moon",size:.1,dist:4},{name:"Moon",size:.08,dist:4.8}],
 sites:[{id:"fireschool",name:"The Fire School",lat:-8,lon:30,books:[6],desc:"The school of the maeskoloi, the Jaddian swordmasters, on the slopes of Mount Hephaistos. Cassandra passes the Trial of the Heart.",
   scene:{kind:"monastery",arch:"eastern",size:"medium",tod:"dusk",weather:"ash",sky:{sun:"#ff9a6a",moons:3},   /* layout schematic */
    landmarks:[
     {id:"school",name:"The Fire School",kind:"temple",at:[0,0],h:1.4,desc:"The school of the maeskoloi, the Jaddian swordmasters. Cassandra passes the Trial of the Heart here."},
     {id:"hephaistos",name:"Mount Hephaistos",kind:"peak",at:[0,0.7],h:2.6,desc:"The volcano on whose slopes the school stands."}]}},
  {id:"jaharrad",name:"Jaharrad",lat:-4,lon:38,books:[6],desc:"The capital, with the golden dome of the Alcaz du Badr, the Castle of the Moon.",
   scene:{kind:"capital",arch:"eastern",size:"large",tod:"day",weather:"clear",sky:{sun:"#ff9a6a",moons:3},   /* layout schematic */
    landmarks:[
     {id:"alcaz",name:"Alcaz du Badr",kind:"palace",at:[0,0.3],h:2,col:"#e8c060",desc:"The Castle of the Moon, with its golden dome, in the capital of the Jaddian princes."}]}},
  {id:"islis",name:"Islis du Albukam",lat:-12,lon:24,books:[6],sea:true,desc:"The island where Hadrian keeps his villa.",
   scene:{kind:"village",arch:"eastern",size:"small",tod:"dusk",weather:"clear",water:true,sky:{sun:"#ff9a6a",moons:3},   /* layout schematic */
    landmarks:[
     {id:"villa",name:"Hadrian’s villa",kind:"house",at:[0,0],desc:"Hadrian’s home on Jadd, where he raises his daughter Cassandra."}]}}]},

{id:"sabratha",name:"Sabratha",group:"perseus",books:[6],major:true,first:6,status:"Imperial frontier world",hero:"phanamhara",map:[18.663,35.001],
 star:{name:"Unnamed sun",col:"#ffeccc"},
 blurb:"A dry world of ochre sand and salt fifteen thousand light-years east of Tiryns. A dig under its black plateau wakes the Watcher Ushara, and the Cielcin attack the camp. It is where Disquiet Gods begins in earnest.",
 short:"The dig where a Watcher wakes.",
 facts:[["Settled","ISD 16997; fewer than 50,000 people"],["Ruins","Phanamhara, an Enar city"]],
 gfx:{type:"desert",sea:0,dune:7,pal:["#000","#000","#a8783e","#c8a060","#2a2420","#f4f0e8"],clouds:.05,atmo:"#f0c890",atmoK:.6,lights:.05,
  feat:[{k:"biome",style:"rock",at:[-14,40],r:6,s:1,c:"#1c1a18"},{k:"biome",style:"snow",at:[-20,20],r:9,s:.8,c:"#f0ece4"}]},
 sites:[{id:"phanamhara",name:"Phanamhara",lat:-14,lon:40,books:[6],desc:"An Enar city of green stone under the plateau of Cetorum Mensa, where Ushara is found.",
   scene:{kind:"ruins",arch:"ancient",size:"large",tod:"day",weather:"dust",pal:{stone:"#3a6a4a"},   /* layout schematic */
    landmarks:[
     {id:"mensa",name:"Cetorum Mensa",kind:"cliff",at:[0,0.6],h:2,desc:"The black plateau above the ruins."},
     {id:"city",name:"Phanamhara",kind:"ruin",at:[-0.3,0],h:1.3,col:"#4a8a5a",desc:"An Enar city of green stone beneath the plateau."},
     {id:"dig",name:"The dig camp",kind:"camp",at:[0.5,-0.4],desc:"The Imperial excavation at the ruins, where Hadrian is brought by the Emperor’s service."},
     {id:"ushara",name:"Ushara’s chamber",kind:"monolith",at:[0,0.15],h:1.8,desc:"Where the Watcher Ushara is found sleeping under the ruins."}]}},{id:"silentii",name:"Mare Silentii",lat:-20,lon:24,books:[6],desc:"A dead sea of ivory and gold sand, with the skeletons of whale-like animals.",
   scene:{kind:"desert",arch:"ancient",size:"large",tod:"day",weather:"clear",   /* layout schematic */
    landmarks:[
     {id:"sea",name:"Mare Silentii",at:[0,0],desc:"A dead sea of ivory and gold sand."},
     {id:"bones",name:"The great skeletons",kind:"ruin",at:[0.4,0.3],desc:"The bones of whale-like animals lie in the sand."}]}}]},

{id:"tiryns",name:"Tiryns",group:"perseus",books:[5,6],first:5,status:"Seat of the Persean Magnarchate",map:[0.424,35.439],
 star:{name:"Unnamed sun",col:"#fff2e0"},
 blurb:"Capital of the Empire’s Perseus provinces and seat of its Magnarch. Sabratha lies fifteen thousand light-years east of it. Hadrian passes through on the way from Sabratha to Forum.",
 gfx:{type:"city",sea:.45,pal:["#0a1a30","#245a80","#7a6e50","#6a6a48","#8a7e60","#e0e0e0"],lights:.85,clouds:.34,atmo:"#8ab0ff"}},

{id:"durannos",name:"Durannos",group:"perseus",books:[1],first:1,status:"Capital of the Durantine Republic",map:[-7.941,33.846],
 star:{name:"Unnamed sun",col:"#fff0dc"},
 blurb:"The marshy capital of the Durantine Republic, largely covered by one city. The Republic is a tributary ally of the Empire.",
 gfx:{type:"hive",sea:.35,pal:["#1a1e18","#3a4232","#5a5a40","#6a6a48","#5e5850","#d0ccb8"],lights:.8,clouds:.4,cloudCol:"#c8ccb8",atmo:"#b0c098",atmoK:.9}},

{id:"oannos",name:"Oannos",group:"perseus",books:[6],first:6,status:"Kingdom of the Three Suns",map:[-25.716,18.125],
 star:{name:"Three suns",col:"#ffe6c8"},
 blurb:"Capital of one of the Small Kingdoms near the Rasan Belt, known for its genecraft. The story The Fangs of Oannos is set during Hadrian’s years on Jadd.",
 gfx:{type:"forest",sea:.5,pal:["#062a3a","#1a6a7a","#1e5a2a","#3a7a2a","#4a6a3a","#e8f0ec"],clouds:.5,atmo:"#90d0ff",lights:.3}},

{id:"nairi",name:"Nairi",group:"perseus",books:[5,6],first:5,status:"Unsettled Imperial territory",map:[7.332,38.737],
 star:{name:"Unnamed sun",col:"#fff0e4"},
 blurb:"Never settled. An Enar shrine city fifty miles across was built around the corpse of a Monumental, one of the Watchers.",
 gfx:{type:"barren",sea:.1,pal:["#1c1a18","#2c2a26","#4a4640","#5a5650","#6a6660","#d8d4cc"],rough:.7,clouds:.1,atmoK:.3},
 sites:[{id:"shrine",name:"The shrine city",lat:-10,lon:20,books:[5],desc:"An Enar city fifty miles across, built around the corpse of a Monumental.",   /* estimated */
   scene:{kind:"ruins",arch:"ancient",size:"huge",tod:"dusk",weather:"dust",   /* layout schematic */
    landmarks:[{id:"city",name:"The Enar city",kind:"ruin",at:[-.4,-.2],h:1.3,desc:"A shrine city of the vanished Enar, on a world humans never settled."},
     {id:"corpse",name:"The Monumental",kind:"monolith",at:[.2,.3],h:3,desc:"The corpse of one of the Watchers, around which the Enar raised their city."}]}}]},

{id:"belusha",name:"Belusha",group:"perseus",books:[5,6],first:5,status:"Prison planet",map:[-3.4,31.5],est:true,
 star:{name:"Unnamed sun",col:"#fff4e8"},
 blurb:"The Empire’s most feared prison: ice and black stone under seventeen orbital mirrors, so the sun never sets. Hadrian is condemned here after Perfugium and escapes; Lorian Aristedes is sent in his place, the story of the novella The Dregs of Empire.",
 facts:[["Placement","Not shown on the map; position estimated"]],
 gfx:{type:"ice",sea:0,pal:["#2a3440","#4a5a6a","#9aa8b8","#c0ccd8","#e0e6ee","#ffffff"],clouds:.2,atmo:"#b8d0ff",atmoK:.5,bump:1.4,lights:.25},
 sites:[{id:"downwell",name:"Downwell",lat:20,lon:10,books:[5],desc:"The prison beneath the mile-high Tower, an orbital lift of black nanocarbon.",
   scene:{kind:"fortress",arch:"brutal",size:"medium",tod:"day",weather:"snow",   /* layout schematic */
    landmarks:[
     {id:"tower",name:"The Tower",kind:"tower",at:[0,0.3],h:3,col:"#1a1a1c",desc:"A mile-high orbital lift of black nanocarbon."},
     {id:"prison",name:"Downwell",kind:"keep",at:[0,-0.3],desc:"The prison beneath the Tower, the most feared in the Empire."},
     {id:"mirrors",name:"The orbital mirrors",kind:"beacon",at:[0.6,0.6],desc:"Seventeen mirrors in orbit keep the sun from ever setting on Belusha."}]}}]},

/* ---------------- The Taurus Wisp ---------------- */
{id:"tavros",name:"Tavros",group:"wisp",books:[1,7],first:1,status:"Demarchy of Tavros",map:[24.687,28.851,1.8],
 star:{name:"Unnamed sun",col:"#fff4ea"},
 blurb:"Chief world of the Demarchy, a small, free and technologically daring state in a thin string of stars above the galactic plane. Valka Onderra comes from here.",
 eras:{7:{blurb:"Chief world of the Demarchy, a small, free and technologically daring state in a thin string of stars above the galactic plane, and Valka Onderra’s home. In the last book the Tavrosi fleet joins the fight and is destroyed at Danu."}},
 gfx:{type:"forest",sea:.5,pal:["#062236","#1a5a72","#2a4a2a","#3a6a32","#4a5a4a","#f0f4f8"],clouds:.5,atmo:"#9ac8ff",lights:.45,ice:66}},

{id:"edda",name:"Edda",group:"wisp",books:[1],first:1,status:"Demarchy of Tavros",map:[24.276,27.641,1.6],
 star:{name:"A distant sun",col:"#ffe8d0"},
 blurb:"A windy desert world of canyons and sinkholes over underground oceans, warmed by orbital mirrors. Valka studied at its university.",
 gfx:{type:"desert",sea:.08,dune:5,pal:["#1a3a5a","#3a6a8a","#9a5a34","#b8784a","#7a4a2e","#ecd8c0"],clouds:.1,atmo:"#f0c090",atmoK:.6},
 sites:[{id:"university",name:"The university",lat:10,lon:0,books:[1],desc:"Where Valka Onderra studied before she came to Emesh.",   /* estimated */
   scene:{kind:"town",arch:"modern",size:"small",tod:"day",weather:"dust",   /* layout schematic */
    landmarks:[{id:"campus",name:"The university",kind:"hall",at:[0,0],desc:"Valka’s school on the windy canyon world."}]}}]},

/* ---------------- Ancient & beyond ---------------- */
{id:"vaiartu",name:"Vaiartu",group:"beyond",books:[5],first:5,status:"Homeworld of the Enar",map:[34.701,6.952],
 star:{name:"Unnamed sun",col:"#ffeacc"},
 blurb:"The homeworld of the Enar, the Firstborn, who built Phanamhara and Akterumu. An Enar tablet captured from the Cielcin points to it. It is the farthest east of the mapped worlds.",
 gfx:{type:"toxic",sea:.3,pal:["#1a2a20","#2a4a34","#3a5a3a","#4a6a40","#5a6a4a","#d8e0d0"],clouds:.4,cloudCol:"#d8e8d0",atmo:"#a8e0b0",atmoK:.8}},

{id:"dharantun",name:"Dharan-Tun",group:"beyond",craft:true,books:[3,4,6,7],major:true,first:3,status:"Worldship of Syriani Dorayaica",hero:"dhariagon",map:[-2.8,-10.9],
 eras:{4:{blurb:"The worldship of Syriani Dorayaica, Prince of Princes: a hollowed iron moon of bone towers and dungeons. It fires on Hadrian at Berenike, and after Padmurak he is held and tortured aboard it for seven years."},7:{status:"Destroyed with its master",blurb:"Dorayaica’s worldship, larger than some moons. Hadrian is its prisoner for seven years in Kingdoms of Death. In the last book he and Cassandra go aboard as bait, and Dorayaica and the Watcher Ushara are destroyed."}},
 star:{name:"A moving ship; shown near Eue",col:"#ff8a6a"},
 blurb:"The worldship of Syriani Dorayaica, Prince of Princes: a hollowed iron moon of bone towers and dungeons. At Berenike its great gun fires on Hadrian as he walks out alone.",
 short:"Dorayaica’s iron moon.",
 facts:[["Citadel","Dhar-Iagon"],["Size","Larger than some moons"]],
 gfx:{type:"city",sea:0,pal:["#0c0c0e","#1a1a1c","#2e2c2c","#3a3836","#4a4644","#d8d4cc"],lights:.55,lightCol:"#ff6a4a",clouds:0,atmoK:0,rough:.8,bump:1.5},
 swarm:true,
 sites:[{id:"dhariagon",name:"Dhar-Iagon",lat:20,lon:0,books:[4],desc:"Dorayaica’s palace-fortress at the worldship’s heart.",
   scene:{kind:"fortress",arch:"alien",size:"large",tod:"night",weather:"clear",under:true,pal:{light:"#ff6a4a"},   /* layout schematic */
    landmarks:[
     {id:"citadel",name:"Dhar-Iagon",kind:"citadel",at:[0,0.3],h:2,desc:"Dorayaica’s palace-fortress at the worldship’s heart."},
     {id:"towers",name:"The bone towers",kind:"spire",at:[-0.5,-0.2],h:1.6,desc:"Towers of bone inside the hollowed iron moon."}]}},{id:"grottoes",name:"The Prophet’s Grottoes",lat:10,lon:10,books:[4],desc:"Where Hadrian is tortured and loses two fingers.",
   scene:{kind:"underground",arch:"alien",size:"small",tod:"night",weather:"clear",under:true,   /* layout schematic */
    landmarks:[
     {id:"cell",name:"The grottoes",kind:"cave",at:[0,0],desc:"Where Hadrian is held and tortured for years and loses two fingers."}]}}]},

{id:"llesu",name:"Llesu",aka:["The City at the End of Time"],group:"outside",books:[6],first:6,status:"Outside time",pos3:[0,520,0],
 star:{name:"A dying red sun",col:"#ff5a3c"},
 blurb:"A decaying city under a dying red sun, about a trillion years in the future. After the Chantry kills Hadrian on Forum, the Judicator Ragama brings him back to life here and burns the Watcher’s hold out of him.",
 short:"A trillion years from now.",
 facts:[["Placement","Not in space as we know it; shown above the galaxy"]],
 gfx:{type:"barren",sea:.15,pal:["#0a0606","#1a0e0c","#2a1814","#3a2018","#4a2a20","#8a6a5a"],rough:.6,clouds:.3,cloudCol:"#5a3a30",atmo:"#ff5a3c",atmoK:.7,lights:.15,lightCol:"#ffb080"},
 sites:[{id:"oldchurch",name:"The Old Church",lat:10,lon:0,books:[6],desc:"Seat of the Judicator, a temple of the Quiet.",
   scene:{kind:"temple",arch:"ancient",size:"medium",tod:"dusk",weather:"ash",sky:{sun:"#ff5a3c"},   /* layout schematic */
    landmarks:[
     {id:"church",name:"The Old Church",kind:"temple",at:[0,0],h:1.6,desc:"A temple of the Quiet in the decaying city, seat of the Judicator Ragama."}]}},{id:"nahaman",name:"Well of Nahaman",lat:8,lon:4,books:[6],desc:"Where Hadrian is restored.",
   scene:{kind:"temple",arch:"ancient",size:"small",tod:"dusk",weather:"ash",sky:{sun:"#ff5a3c"},   /* layout schematic */
    landmarks:[
     {id:"well",name:"The Well of Nahaman",kind:"well",at:[0,0],desc:"Where Hadrian is restored to life and the Watcher’s hold on him is burned away."}]}}]}
];

/* Hadrian's road, one route per book. `book` gates it; earlier routes stay faint. */
const ROUTES=[
 {id:"r1",book:1,label:"Empire of Silence",path:["delos","emesh"]},
 {id:"r2",book:2,label:"Howling Dark",path:["emesh","rustam","march","vorgossos"]},
 {id:"r3",book:3,label:"Demon in White",path:["forum","gododdin","beast","forum","colchis","annica","berenike"]},
 {id:"r4",book:4,label:"Kingdoms of Death",path:["thermon","nessus","eikana","nessus","padmurak","dharantun","eue","colchis"]},
 {id:"r5",book:5,label:"Ashes of Man",path:["colchis","nessus","carteia","ganelon","fidchell","perfugium","jadd"]},
 {id:"r6",book:6,label:"Disquiet Gods",path:["jadd","sabratha","tiryns","forum","llesu","latarra","vorgossos"]},
 {id:"r7",book:7,label:"Shadows Upon Time",path:["vorgossos","annica","tenba","danu","bracara","gododdin","dharantun"]}
];
/* Cielcin raids and invasions [from, to, book in which the reader learns of it] */
const CIELCIN_ORIGIN="veil";
const STRIKES=[
 ["cressgard",1],["caishen",1],["emesh",1],["tyras",2],["rustam",2],["pharos",2],["thagura",3],["aptucca",3],["hermonassa",3],["marinus",3],["berenike",3],
 ["eikana",4],["padmurak",4],["carteia",5],["perfugium",5],["nessus",6],["monmara",6],["sabratha",6],["forum",7],["danu",7],["gododdin",7]
];

const EVENTS=[
 /* I · Empire of Silence */
 {id:"b1p",book:1,world:"cressgard",title:"First contact",text:"Three centuries before Hadrian is born, humans meet the Cielcin for the first time at Cressgard, ISD 15792. The colony is lost."},
 {id:"b1q",book:1,world:"caishen",fx:"fire",title:"Cai Shen burns",text:"While Hadrian is still a boy, the Cielcin burn the Mandari world of Cai Shen and its famous temple, ISD 16130."},
 {id:"b1a",book:1,world:"colchis",title:"The memoir begins",text:"From the Library on Colchis, Hadrian Marlowe sets out to tell the truth about the man history calls the Sun Eater, who burned a star and killed billions."},
 {id:"b1b",book:1,world:"delos",site:"devilsrest",lm:"study",title:"A boyhood at Devil’s Rest",text:"Heir to the Archon of Meidua, Hadrian is schooled by the scholiast Tor Gibson and dreams of joining the scholiasts rather than ruling."},
 {id:"b1k",book:1,world:"delos",site:"devilsrest",lm:"castle",title:"The Consortium",text:"House Marlowe does business with the Wong-Hopper Consortium, and Hadrian grows to resent his family’s dealings with it."},
 {id:"b1l",book:1,world:"delos",site:"meidua",lm:"colosso",fx:"crowd",title:"Games in the Colosso",text:"Hadrian watches the Colosso games with his family and is sickened by the killing his brother Crispin relishes."},
 {id:"b1c",book:1,world:"delos",site:"devilsrest",lm:"castle",title:"Sent to the Chantry",text:"His father means to send him to the Chantry’s seminary on Vesperad. Gibson is caught helping him and is maimed and exiled."},
 {id:"b1d",book:1,world:"delos",site:"haspida",lm:"palace",title:"Flight from Delos",text:"His mother arranges his escape. After a fight with his brother Crispin, he boards the Eurynasir at Karch, bound for Teukros."},
 {id:"b1m",book:1,world:"delos",site:"karch",lm:"starport",fx:"launch",title:"Aboard the Eurynasir",text:"Hadrian goes into fugue aboard the merchant ship for the long voyage to the scholiasts of Teukros."},
 {id:"b1e",book:1,world:"emesh",site:"borosevo",lm:"belows",title:"Stranded on Emesh",text:"He wakes years later robbed and abandoned on Emesh, far off course, and lives as a beggar in Borosevo. His friend Cat dies of plague."},
 {id:"b1f",book:1,world:"emesh",site:"borosevo",lm:"colosso",fx:"crowd",title:"Myrmidon",text:"He fights in the Colosso as a gladiator, alongside Switch and Pallino."},
 {id:"b1g",book:1,world:"emesh",site:"castle",lm:"ziggurat",fx:"duel",title:"Count Mataro’s house",text:"The count takes Hadrian in as a companion for his daughter. He meets the Tavrosi xenologist Valka Onderra and kills the Chantry priest Gilliam Vas in a duel."},
 {id:"b1h",book:1,world:"emesh",site:"calagah",lm:"chamber",title:"The ruins of Calagah",text:"In the Quiet’s black ruins Hadrian has visions. A Cielcin ship of Clan Otiolo lands nearby."},
 {id:"b1i",book:1,world:"emesh",site:"calagah",lm:"landing",fx:"battle",title:"Battle of Emesh",text:"Imperial legions under Raine Smythe and a Jaddian knight, Olorin Milta, defeat the Cielcin. ISD 16172."},
 {id:"b1n",book:1,world:"emesh",site:"borosevo",title:"The captive Cielcin",text:"Captured Cielcin are held and questioned in Borosevo. Hadrian secretly goes to speak with their captain and is caught."},
 {id:"b1j",book:1,world:"emesh",site:"borosevo",title:"Uvanari",text:"Hadrian interprets for the captured Cielcin captain, then grants it a merciful death in exchange for the location of Vorgossos. His father disowns him, and the Meidua Red Company is founded to find it."},
 {id:"b1o",book:1,world:"delos",site:"redtine",lm:"village",side:"Novella",title:"The Lesser Devil",text:"Crispin and Sabine Marlowe crash in the Redtine Mountains and find a hidden village, in a novella set on Delos."},
 /* II · Howling Dark */
 {id:"b2p",book:2,world:"pharos",title:"The Guns of Pharos",side:"Tales of the Sun Eater",text:"The Red Company’s first battle, in ISD 16179, against a Norman dictator. Told in two short stories."},
 {id:"b2r",book:2,world:"tyras",title:"Tyras destroyed",text:"Just before the story resumes, the Cielcin destroy the annexed freehold of Tyras, ISD 16216."},
 {id:"b2s",book:2,world:"rustam",site:"rent",lm:"wound",title:"The wound at Rustam",text:"A Cielcin attack has torn a fifty-mile rent in Rustam’s crust where its old capital stood. Refugees live in a city of grounded ships."},
 {id:"b2a",book:2,world:"rustam",site:"arslan",lm:"ships",title:"Forty-eight years on",text:"After half a century of fruitless searching, the Red Company is at Rustam. Hadrian kills the Extrasolarian called the Painted Man in Arslan."},
 {id:"b2b",book:2,world:"rustam",title:"The First Treason",text:"Hadrian steals the Cielcin prisoner Tanaran, cuts off Bassander Lin’s sword hand, and flees with his loyalists on the Mistral."},
 {id:"b2c",book:2,world:"march",site:"ring",lm:"brevon",title:"March Station",text:"The broker Antonius Brevon sells passage to Vorgossos for Tanaran’s blood. On the Sojourner Enigma of Hours, an oracle speaks Cat’s last words to him."},
 {id:"b2d",book:2,world:"vorgossos",site:"palace",lm:"throne",title:"The Undying King",text:"Hadrian meets Kharn Sagara, who has lived for millennia by moving his mind into cloned bodies."},
 {id:"b2e",book:2,world:"vorgossos",site:"undersea",lm:"brethren",title:"Brethren",text:"Under the ice lies Brethren, the last Mericanii machine mind, which shows Hadrian possible futures."},
 {id:"b2t",book:2,world:"vorgossos",title:"Switch sent away",text:"Switch betrays a secret on Vorgossos, and Hadrian sends one of his oldest friends away."},
 {id:"b2f",book:2,world:"vorgossos",title:"Battle upon the Demiurge",text:"Peace talks with Prince Aranata Otiolo aboard Kharn’s ship the Demiurge end when an Imperial fleet arrives. Aranata beheads Hadrian; the Quiet returns him to life, and he kills the prince. ISD 16227."},
 {id:"b2g",book:2,world:"vorgossos",title:"Halfmortal",text:"Hailed as Halfmortal, Hadrian sets out with Valka for Forum and the Emperor."},
 /* III · Demon in White */
 {id:"b3t",book:3,world:"thagura",site:"rock",lm:"pseldona",fx:"battle",title:"Queen Amid Ashes",side:"Novella",text:"The Red Company’s first official mission defeats Prince Muzugara on Thagura, ISD 16257."},
 {id:"b3u",book:3,world:"arae",site:"flats",lm:"flats",fx:"battle",title:"The Demons of Arae",side:"Tales of the Sun Eater",text:"The Red Company fights mercenaries on the salt flats of Arae, ISD 16443."},
 {id:"b3v",book:3,world:"aptucca",title:"Aptucca",text:"Remembered as one of Hadrian’s greatest victories, over Prince Ulurani in ISD 16462."},
 {id:"b3w",book:3,world:"hermonassa",site:"foundries",lm:"yards",fx:"battle",title:"Hermonassa falls",text:"The Cielcin prince Syriani Dorayaica routs the defenders of the Red Star Foundries shipyard."},
 {id:"b3a",book:3,world:"forum",site:"sunking",lm:"throne",title:"The Emperor’s summons",text:"A century on, Sir Hadrian commands the Tamerlane. After Hermonassa falls, William XXIII sends him with Prince Alexander to find two missing legions."},
 {id:"b3b",book:3,world:"gododdin",site:"din",lm:"fort",title:"Fort Din",text:"On Gododdin Hadrian forbids the decimation of mutinous Irchtani auxiliaries and wins their loyalty."},
 {id:"b3c",book:3,world:"beast",site:"holds",lm:"iubalu",fx:"battle",title:"Battle of the Beast",text:"A Cielcin gravity net pulls the fleet from warp. Hadrian boards the worldship and kills Iubalu of the White Hand. ISD 16534."},
 {id:"b3d",book:3,world:"forum",site:"eternal",lm:"palace",fx:"crowd",title:"Triumph and treachery",text:"Hadrian is given a triumph in the capital and betrothed to Princess Selene. Valka is wounded by an assassin."},
 {id:"b3n",book:3,world:"forum",site:"colosseum",lm:"floor",fx:"duel",title:"The duel with Irshan",text:"His enemies at court force him into a duel in the flooded Grand Colosseum against the Jaddian gladiator Irshan."},
 {id:"b3e",book:3,world:"colchis",site:"archive",lm:"horizon",title:"Gibson and the Horizon",text:"On Colchis Hadrian finds Gibson alive. A Mericanii ship mind hidden in Gabriel’s Archive gives him the way to the Quiet."},
 {id:"b3f",book:3,world:"annica",site:"mountain",lm:"summit",title:"The Mountain",text:"On Annica Hadrian climbs to the summit and meets the Quiet, who show him time and give him the power to choose between possible outcomes."},
 {id:"b3m",book:3,world:"marinus",title:"Marinus falls",text:"A catastrophic defeat in ISD 16632, and bait for a larger trap."},
 {id:"b3g",book:3,world:"berenike",site:"stormwall",lm:"wall",fx:"battle",title:"Battle of Berenike",text:"The Cielcin destroy much of the Imperial fleet and Titus Hauptmann dies. Valka is cut down by the sorcerer Urbaine and put into fugue. ISD 16701."},
 {id:"b3h",book:3,world:"berenike",site:"stormwall",lm:"plain",fx:"bombard",title:"The Demon in White",text:"Hadrian walks out alone to surrender to Dorayaica. The worldship’s gun fires and misses, because he chooses the world in which it misses."},
 /* IV · Kingdoms of Death */
 {id:"b4z",book:4,world:"thermon",site:"court",lm:"tribunal",title:"Trial for witchcraft",text:"Between the books Hadrian spends twelve years on trial before the Chantry, then decades in internal exile."},
 {id:"b4a",book:4,world:"eikana",site:"yamato",lm:"refinery",fx:"battle",title:"Recalled to Eikana",text:"Hadrian is brought out of exile to save the antimatter refinery from Hushansa of the White Hand. ISD 17006."},
 {id:"b4b",book:4,world:"nessus",site:"maddalo",lm:"house",title:"Exile on Nessus",text:"At Maddalo House he and Valka have lived quietly for decades. The Emperor’s agents send him as envoy to the Lothrians."},
 {id:"b4c",book:4,world:"padmurak",site:"vedatharad",lm:"embassy",fx:"battle",title:"The embassy",text:"The Lothrian Conclave is already allied with Dorayaica and feeding its own people to the Cielcin. The Red Company fights its way across Vedatharad."},
 {id:"b4d",book:4,world:"padmurak",site:"conclave",lm:"floor",title:"Taken",text:"In the Grand Conclave the sorcerer Urbaine captures Hadrian and gives him to the Cielcin."},
 {id:"b4e",book:4,world:"dharantun",site:"grottoes",lm:"cell",title:"Seven years in the dark",text:"Hadrian is imprisoned and tortured aboard the Dharan-Tun, and loses his hold on his power."},
 {id:"b4f",book:4,world:"eue",site:"elu",lm:"altar",fx:"battle",title:"The Black Feast",text:"At Akterumu Dorayaica sacrifices the Cielcin princes to the dead god Miudanar and is crowned. The Red Company is massacred and the Tamerlane brought down. ISD 17061."},
 {id:"b4g",book:4,world:"eue",title:"Valka’s rescue",text:"Valka, who escaped Padmurak and slipped aboard the worldship, frees Hadrian. They escape on the Ascalon; only Lorian is sent home with the news."},
 {id:"b4h",book:4,world:"colchis",site:"thessa",lm:"isle",title:"The Isle of the Dead",text:"After decades adrift, Hadrian and Valka hide on Colchis and honour their dead."},
 /* V · Ashes of Man */
 {id:"b5a",book:5,world:"colchis",site:"belgaer",lm:"gibson",title:"Gibson’s secret",text:"Gibson dies, and Hadrian learns his tutor was born a Bourbon prince."},
 {id:"b5b",book:5,world:"nessus",site:"maddalo",lm:"house",title:"Lorian found",text:"Back on Nessus they find Lorian alive in fugue."},
 {id:"b5c",book:5,world:"carteia",site:"camp",lm:"radiant",title:"The Emperor in the field",text:"At Carteia William XXIII meets Hadrian in secret and shows him what his service knows of extinct civilizations."},
 {id:"b5d",book:5,world:"ganelon",site:"darktower",lm:"tower",fx:"blast",title:"Battle of Ganelon",text:"Hadrian destroys the MINOS laboratory making a plague. A Jaddian prince, Kaim-Olorin, proves to be Olorin Milta from Emesh. ISD 17131."},
 {id:"b5e",book:5,world:"fidchell",site:"station",lm:"telegraph",title:"News from Perfugium",text:"At Fidchell Station word comes that the Emperor is besieged."},
 {id:"b5j",book:5,world:"vaiartu",title:"The Enar homeworld",text:"An Enar tablet captured from the Cielcin points to Vaiartu, the homeworld of the Firstborn, the farthest east of the mapped worlds."},
 {id:"b5f",book:5,world:"perfugium",site:"resonno",lm:"colosso",fx:"battle",title:"Battle of Perfugium",text:"Seven worldships fall on the Emperor’s tour. Hadrian, Lin and Kaim save William XXIII, but Valka dies in the evacuation. ISD 17136."},
 {id:"b5g",book:5,world:"perfugium",title:"The blow",text:"When the Emperor dismisses Valka’s death, Hadrian breaks his nose. He is condemned to the prison world Belusha and escapes with Lorian’s help."},
 {id:"b5i",book:5,world:"jadd",title:"Refuge on Jadd",text:"Hadrian reaches Jadd with Prince Kaim-Olorin, carrying what is left of Valka."},
 /* VI · Disquiet Gods */
 {id:"b6y",book:6,world:"belusha",site:"downwell",lm:"prison",title:"The Dregs of Empire",side:"Novella",text:"Lorian Aristedes, sent to Belusha in Hadrian’s place, survives the prison world."},
 {id:"b6h",book:6,world:"nessus",title:"Nessus falls",text:"In the years before the book opens, the Cielcin take Nessus, the seat of the Magnarch of Centaurus where Hadrian once lived in exile."},
 {id:"b6i",book:6,world:"monmara",title:"Monmara destroyed",text:"The Norman water world where the Red Company was formally founded has been destroyed by the Cielcin."},
 {id:"b6a",book:6,world:"jadd",site:"fireschool",lm:"school",title:"Two hundred years on Jadd",text:"Hadrian has raised a daughter, Cassandra, from Valka’s genetic material. She passes the Fire School’s Trial of the Heart."},
 {id:"b6j",book:6,world:"oannos",title:"The Fangs of Oannos",side:"Tales of the Sun Eater",text:"A story set in the Kingdom of the Three Suns during Hadrian’s years on Jadd."},
 {id:"b6b",book:6,world:"sabratha",site:"phanamhara",lm:"ushara",fx:"bombard",title:"A Watcher wakes",text:"Summoned by the Emperor’s service, Hadrian finds the Watcher Ushara under the Enar ruins. Cielcin attack, and orbital fire shatters the god. ISD 17410."},
 {id:"b6k",book:6,world:"tiryns",title:"Through Tiryns",text:"From Sabratha Hadrian travels by way of Tiryns, the Persean capital, on the road to Forum."},
 {id:"b6c",book:6,world:"forum",site:"sanctum",lm:"temple",title:"Murdered by the Chantry",text:"At court Hadrian meets Crown Prince Aurelian. The Chantry dissolves him with poison."},
 {id:"b6d",book:6,world:"llesu",site:"nahaman",lm:"well",title:"The City at the End of Time",text:"A trillion years ahead, the Judicator Ragama resurrects Hadrian and burns away the Watcher’s influence."},
 {id:"b6e",book:6,world:"latarra",site:"printed",lm:"citadel",title:"The Monarch",text:"On Lorian’s ship Hadrian reaches Latarra. Its Monarch is another Kharn Sagara, and becomes an ally."},
 {id:"b6f",book:6,world:"vorgossos",site:"deep",lm:"gate",fx:"battle",title:"Battle of Vorgossos",text:"Imperial, Latarran and Chantry fleets take Vorgossos. Hadrian kills Kharn’s heirs, drowns Brethren, spares the new machine Orphan, and takes the Demiurge. ISD 17458."},
 {id:"b6g",book:6,world:"dharantun",title:"Dorayaica declares war",text:"In a vision, the Prince of Princes, merging with Miudanar, declares its final war."},
 /* VII · Shadows Upon Time */
 {id:"b7l",book:7,world:"forum",title:"The capital has fallen",text:"Hadrian learns that the Eternal City has fallen to the Cielcin, and that the Chantry hid the news for nearly two years."},
 {id:"b7a",book:7,world:"vorgossos",title:"Master of the Demiurge",text:"Hadrian holds the Demiurge against Chantry and Vorgossene attacks and makes peace with the ship’s mind."},
 {id:"b7b",book:7,world:"annica",site:"mountain",lm:"refuge",title:"Exile on Annica",text:"A fugitive from Empire and Chantry, Hadrian waits beyond the core with Cassandra."},
 {id:"b7d",book:7,world:"earth",title:"Earth is green",text:"The Chantry’s great secret: Old Earth was never a ruin."},
 {id:"b7e",book:7,world:"tenba",site:"meridian",lm:"city",fx:"fleet",title:"The muster at Tenba",text:"The last fleets of humanity gather."},
 {id:"b7f",book:7,world:"danu",title:"Danu",text:"Cielcin worldships tear the world apart and Ushara destroys the Tavrosi fleet."},
 {id:"b7g",book:7,world:"bracara",title:"Waiting at Bracara",text:"The fleet waits months for an enemy that does not come."},
 {id:"b7h",book:7,world:"gododdin",site:"catraeth",lm:"blast",fx:"blast",title:"Catraeth burns",text:"An explosion devastates Catraeth, and Hadrian is blamed."},
 {id:"b7m",book:7,world:"gododdin",site:"din",lm:"hq",fx:"fleet",title:"The host comes to Gododdin",text:"Humanity masters its last fleets at Gododdin. The Cielcin come with their worldships and the Watchers."},
 {id:"b7i",book:7,world:"dharantun",title:"Into the worldship",text:"Hadrian and Cassandra go aboard the Dharan-Tun. Syriani Dorayaica and Ushara are destroyed."},
 {id:"b7j",book:7,world:"gododdin",site:"din",lm:"hq",fx:"blast",title:"The Sun Eater",text:"Miudanar rises over Ywain. Hadrian drives Gododdin’s star to hypernova, destroying the Cielcin host, the Watchers, and the system with billions of people in it."},
 {id:"b7k",book:7,world:"colchis",site:"belgaer",lm:"library",title:"After",text:"The Cielcin are broken and Alexander takes the throne. The old man in the Library finishes his account."}
];

/* faint washes of territory on the disc: [label, centre x,y (kly), radius (kly), colour, squash] */
const TERRITORIES=[
 {name:"Sollan Empire",at:[1,24],r:15,c:"#c9a24a",a:.12,sx:1.5,sy:1},
 {name:"",at:[10,16],r:8,c:"#c9a24a",a:.1},
 {name:"Principalities of Jadd",at:[-22,20.5],r:5,c:"#e0703a",a:.16},
 {name:"Lothrian Commonwealth",at:[-19,8.5],r:5.5,c:"#8a9ab8",a:.16},
 {name:"Durantine Republic",at:[-8,33.6],r:3.5,c:"#7aa07a",a:.15},
 {name:"Veil of Marinus",at:[9,9.5],r:7,c:"#b0403a",a:.13},
 {name:"Demarchy of Tavros",at:[24.5,28.3],r:2.6,c:"#6ab0d0",a:.18,h:1.7}
];
/* region labels on the map: [text, x,y (kly), min, max camera distance, big] */
const REGION_TEXT=[
 ["Spur of Orion",-1.5,28.6,150,2600],["Sagittarius Arm",-11,19,200,4200,true],["Centaurus Arm",14,15,200,4200,true],["Norma Arm",3.5,8,200,4200,true],["Perseus Arm",-2,37.5,200,4200,true],
 ["Veil of Marinus",10.6,10.2,70,1500],["Norman Expanse",15,7.6,70,1500],["The Sullen Gulf",4.2,21.8,60,1200],["Rasan Belt",-23.5,13,70,1500],["Upper Sagittarius",-15,10.5,70,1500],["Centaurine provinces",11.5,18.2,70,1500],
 ["Taurus Wisp",24.6,30,60,1500],["Principalities of Jadd",-22.5,22.8,70,1500],["Lothrian Commonwealth",-20.5,5.8,70,1500],["Durantine Republic",-8,35.5,70,1500],["Beyond the core",4,-15,120,3000,true]
];

const FACTIONS=[
 {name:"The Sollan Empire",first:1,desc:"The Imperium of the Solar Throne: about half a billion habitable worlds in four arms, ruled by House Avent for some seventeen thousand years from Forum. Four primarchates (Orion, Sagittarius, Centaurus and Perseus) divide into provinces, palatine fiefs and prefectures. A fifth, in Norma, was stopped by the war."},
 {name:"The Holy Terran Chantry",first:1,desc:"The state church and judiciary. Its Inquisition enforces the ban on thinking machines, guards Old Earth, and crowns the Emperors. It distrusts Hadrian from the start."},
 {name:"The palatine houses",first:1,desc:"The genetically refined nobility, who live for centuries and hold worlds as fiefs. House Marlowe, Archons of Meidua on Delos, is one of them."},
 {name:"The Legions",first:1,desc:"The Empire’s numbered armies, such as the 437th Centaurine, with their own intelligence office. Its secret xenological branch, HAPSIS, studies the dead civilizations."},
 {name:"The scholiasts",first:1,desc:"Monastic scholars trained to think without emotion. Their athenaea include Nov Belgaer on Colchis and Nov Senber on Teukros. Hadrian’s tutor Gibson is one."},
 {name:"The Red Company",first:1,desc:"Hadrian’s mercenary company, founded on Emesh to search for Vorgossos.",more:[[3,"It becomes an Imperial unit aboard the Tamerlane."],[4,"Most of it dies at Akterumu."]]},
 {name:"Principalities of Jadd",first:1,desc:"Eighty-one principalities in outer Perseus that broke from the Empire in ISD 11466 and later became its ally. Their swordmasters, the maeskoloi, train at the Fire School on Jadd."},
 {name:"The Lothrian Commonwealth",first:1,desc:"The second-largest human state: a collectivist dictatorship beyond the Rasan Belt ruled by the Grand Conclave from Padmurak.",more:[[4,"In Kingdoms of Death it is revealed as Dorayaica’s ally."]]},
 {name:"The Durantine Republic",first:1,desc:"About three thousand worlds in Perseus under a Doxe, a tributary ally of the Empire, known for its mercenaries."},
 {name:"The Norman Freeholds",first:1,desc:"Independent, rival worlds in the Norma Arm, steadily annexed by the Empire. They sit on the front line of the Cielcin war."},
 {name:"The Demarchy of Tavros",first:1,desc:"A small direct democracy run through neural lace, in a filament of stars above the galactic plane. Valka’s people."},
 {name:"Extrasolarians",first:2,desc:"Humans outside every state, who embrace machines and body-modification. Vorgossos and March Station are theirs."},
 {name:"MINOS",first:3,desc:"An Extrasolarian order of biomechanics that serves Dorayaica. Its sorcerer Urbaine fights at Berenike."},
 {name:"The Monarchy of Latarra",first:6,desc:"A New Order founded in the Veil by Calen Harendotes, the Monarch, who allies with the Empire against Vorgossos."},
 {name:"The Cielcin",first:1,desc:"The Pale: tall, white, hairless predators with huge black eyes, who live in hollowed, ice-sheathed moons and eat their captives. Trillions, divided into clans (scianda) under princes (aeta)."},
 {name:"The Wong-Hopper Consortium",first:1,desc:"A great trading combine with business on Delos. Hadrian resents his family’s dealings with it."},
 {name:"The White Hand",first:3,desc:"Dorayaica’s prince-generals, the vayadan: Iubalu, Hushansa, Aulamn and others."}
];
const CHARACTERS=[
 {name:"Hadrian Marlowe",role:"Narrator · the Halfmortal",books:[1,2,3,4,5,6,7],desc:"The disowned heir of Delos, who becomes a beggar, a gladiator and a mercenary captain. History will call him the Sun Eater.",more:[[2,"On the Demiurge he is killed and brought back by the Quiet, and hailed as Halfmortal."],[3,"On Annica the Quiet give him the power to choose between possible futures."],[4,"He survives seven years as Dorayaica’s prisoner."],[5,"After Perfugium he strikes the Emperor and flees into exile."],[7,"At Gododdin he destroys a star."]]},
 {name:"Valka Onderra",role:"Xenologist",books:[1,2,3,4,5],desc:"A Tavrosi scholar of alien ruins, with machine lace in her mind, whom Hadrian meets on Emesh.",more:[[2,"She becomes Hadrian’s companion and lover."],[5,"She dies at Perfugium."]]},
 {name:"Tor Gibson",role:"Scholiast · tutor",books:[1,3,4,5],desc:"Hadrian’s teacher on Delos, maimed and exiled for helping him run.",more:[[3,"Hadrian finds him alive on Colchis."],[5,"He dies there, revealed as a former Bourbon prince."]]},
 {name:"Lord Alistair Marlowe",role:"Archon of Meidua",books:[1],desc:"Hadrian’s cold father, who disowns him."},
 {name:"Hadrian’s mother",role:"House Marlowe",books:[1],desc:"Hadrian’s mother, who arranges his escape from Delos."},
 {name:"Cat",role:"Street child",books:[1],desc:"A girl of Borosevo’s streets who befriends Hadrian when he is a beggar there, and dies of plague.",more:[[2,"Aboard the Enigma of Hours an oracle speaks to Hadrian in her last words."]]},
 {name:"Count Mataro",role:"Lord of Emesh",books:[1],desc:"The count of Emesh, who takes Hadrian into his household at Castle Borosevo."},
 {name:"Anaïs Mataro",role:"The count’s daughter",books:[1],desc:"The daughter of Count Mataro, for whom Hadrian is brought in as a companion."},
 {name:"Gilliam Vas",role:"Chantry priest",books:[1],desc:"A Chantry priest on Emesh and Hadrian’s enemy, whom Hadrian kills in a duel."},
 {name:"Crispin Marlowe",role:"Hadrian’s brother",books:[1],desc:"The violent younger son who becomes heir."},
 {name:"Switch",role:"Gladiator · companion",books:[1,2],desc:"One of Hadrian’s first friends on Emesh.",more:[[2,"He betrays a secret on Vorgossos and is sent away."]]},
 {name:"Pallino",role:"Soldier",books:[1,2,3,4],desc:"A veteran myrmidon who becomes Hadrian’s most loyal soldier.",more:[[4,"He dies at Akterumu."]]},
 {name:"Bassander Lin",role:"Legion officer",books:[1,2,3,5],desc:"A proud Legion officer and Hadrian’s rival from Emesh.",more:[[2,"Hadrian cuts off his sword hand on Rustam."],[5,"He fights beside Hadrian at Perfugium."]]},
 {name:"Raine Smythe",role:"Legion commander",books:[1,2],desc:"The tribune who wins the battle of Emesh and charters the Red Company.",more:[[2,"She dies on the Demiurge."]]},
 {name:"Olorin Milta",role:"Jaddian swordmaster",books:[1,5,6,7],desc:"A Jaddian knight who fights at Emesh.",more:[[5,"He is revealed as Prince Kaim-Olorin du Otranto and becomes Hadrian’s protector."]]},
 {name:"Uvanari",role:"Cielcin captain",books:[1],desc:"The first Cielcin to surrender in centuries. Hadrian learns its language and grants it death."},
 {name:"Kharn Sagara",role:"The Undying",books:[2,6,7],desc:"Lord of Vorgossos, who survives by moving his mind into cloned bodies.",more:[[6,"Another of him rules Latarra as the Monarch; Hadrian kills his heirs on Vorgossos."]]},
 {name:"Brethren",role:"Mericanii machine",books:[2,6],desc:"The last of the old machine minds, in the sea under Vorgossos.",more:[[6,"Hadrian kills it."]]},
 {name:"Tanaran",role:"Cielcin prisoner",books:[2],desc:"A Cielcin prisoner of the Legions, whom Hadrian steals on Rustam in the hope of making peace."},
 {name:"Antonius Brevon",role:"Extrasolarian broker",books:[2],desc:"The broker of March Station, who sells Hadrian the way to Vorgossos for Tanaran’s blood."},
 {name:"Aranata Otiolo",role:"Cielcin prince",books:[2],desc:"Prince of Clan Otiolo, who comes to Vorgossos to bargain and beheads Hadrian; brought back by the Quiet, Hadrian kills it."},
 {name:"Otavia Corvo",role:"Captain",books:[2,3,4],desc:"A Norman captain who joins Hadrian and commands his ships.",more:[[4,"She dies at Akterumu."]]},
 {name:"Lorian Aristedes",role:"Tactical officer",books:[3,4,5,6,7],desc:"A brilliant, frail officer of the Red Company.",more:[[4,"He alone is spared at Akterumu, to carry the news."],[6,"He took Hadrian’s place on Belusha and returns as an Extrasolarian captain."]]},
 {name:"William XXIII",role:"Emperor",books:[3,5,6,7],desc:"Emperor of the Solar Throne for some seventeen centuries, and Hadrian’s patron.",more:[[5,"Hadrian breaks his nose."],[7,"William names Hadrian Auctor of the Imperium."]]},
 {name:"Princess Selene",role:"Imperial princess",books:[3,6,7],desc:"The Emperor’s daughter, betrothed to Hadrian for political reasons."},
 {name:"Prince Alexander",role:"Squire",books:[3,5,6,7],desc:"A young prince who serves as Hadrian’s squire.",more:[[7,"He becomes Hadrian’s enemy and takes the throne."]]},
 {name:"Syriani Dorayaica",role:"Prince of Princes",books:[3,4,5,6,7],desc:"A Cielcin prophet-prince who serves the Watcher Miudanar and gathers the clans to war.",more:[[4,"Crowned at the Black Feast of Akterumu."],[7,"Destroyed in the final battle."]]},
 {name:"Titus Hauptmann",role:"First Strategos",books:[2,3],desc:"The Imperial commander who arrives at Vorgossos.",more:[[3,"He dies at Berenike."]]},
 {name:"Urbaine",role:"MINOS sorcerer",books:[3,4,5],desc:"A machine-cult surgeon in Dorayaica’s service who cuts down Valka at Berenike.",more:[[4,"He captures Hadrian on Padmurak."]]},
 {name:"Iubalu",role:"Cielcin vayadan",books:[3],desc:"One of Dorayaica’s White Hand, master of the worldship that pulls Hadrian’s fleet out of warp. Hadrian kills it aboard its own ship."},
 {name:"Hushansa",role:"Cielcin vayadan",books:[4],desc:"One of Dorayaica’s White Hand, who attacks the antimatter refinery on Eikana."},
 {name:"Crown Prince Aurelian",role:"Imperial heir",books:[6],desc:"The Emperor’s heir, whom Hadrian meets at court on Forum."},
 {name:"Ragama",role:"The Judicator",books:[6],desc:"The keeper of the Old Church in the City at the End of Time, who brings Hadrian back to life."},
 {name:"Cassandra",role:"Hadrian’s daughter",books:[6,7],desc:"Raised on Jadd from Valka’s genes and trained as a Jaddian swordmaster."},
 {name:"Ushara",role:"Watcher",books:[6,7],desc:"A god woken under the ruins of Sabratha, which follows Hadrian.",more:[[7,"It is destroyed in the last book."]]},
 {name:"Calen Harendotes",role:"The Monarch",books:[6],desc:"Ruler of Latarra, and another incarnation of Kharn Sagara."}
];
const CONCEPTS=[
 {name:"Imperial Standard Date",first:1,desc:"Years since the Empire’s founding. Hadrian is born in ISD 16117. The books are set in humanity’s distant future."},
 {name:"Warp and fugue",first:1,desc:"Ships cross between stars in years or decades; passengers sleep in cryonic fugue. On the map that is very roughly a thousand light-years a year, so Hadrian lives a millennium and spends half of it asleep."},
 {name:"Quantum telegraph",first:1,desc:"Instant communication across the galaxy between paired stations, while people and goods still take years."},
 {name:"Highmatter",first:1,desc:"The exotic metal of the swords carried by knights, which can cut almost anything."},
 {name:"The Foundation War",first:1,desc:"The war in which William Windsor of Avalon destroyed the Mericanii machines and founded the Empire. The Chantry’s ban on thinking machines comes from it."},
 {name:"The Mericanii",first:1,desc:"An ancient American-born civilization run by artificial minds, which enslaved humanity. Their relics include Brethren, the Demiurge and the U.S.S. Horizon."},
 {name:"The Quiet",first:1,desc:"The builders of the black ruins on Emesh and Annica, possibly humanity’s own far future. They guide and resurrect Hadrian."},
 {name:"The Watchers",first:4,desc:"Vast, ancient beings partly outside time, worshipped by the Cielcin. Miudanar the Dreamer is their god, and its skull is the temple at Akterumu.",more:[[5,"The corpse of another, a Monumental, lies at the heart of an Enar city on Nairi."],[6,"Ushara wakes under the ruins on Sabratha."]]},
 {name:"The Enar",first:5,desc:"The Firstborn, or Vaiartu: a civilization that ruled much of the galaxy millions of years ago and built Akterumu and Phanamhara."},
 {name:"Worldships",first:1,desc:"The Cielcin travel in hollowed moons sheathed in ice. The Dharan-Tun is larger than some moons."},
 {name:"The Black Feast",first:4,desc:"The Aetavanni at Akterumu, ISD 17061, where Dorayaica kills the rival princes and is crowned."},
 {name:"Choosing",first:3,desc:"The gift of the Quiet: Hadrian can see possible outcomes and choose which one becomes real."},
 {name:"Myrmidons",first:1,desc:"Fighters who sell themselves to the Colosso arenas, set against trained gladiators for the crowd. Hadrian fights as one in Borosevo."},
 {name:"Sojourners",first:2,desc:"Vast Extrasolarian ships. Aboard one, the Enigma of Hours, an oracle speaks to Hadrian."},
 {name:"The Lethovirus",first:5,desc:"The plague the machine cult MINOS breeds for the Cielcin on Ganelon, until Hadrian destroys its laboratory."},
 {name:"The Irchtani",first:3,desc:"Winged, bird-like people of Judecca who serve as Imperial auxiliaries and refuse to eat the dead."},
 {name:"The Umandh",first:1,desc:"Three-legged amphibians native to Emesh, kept in an alienage."},
 {name:"The Sun Eater",first:1,desc:"The name history gives Hadrian, for a star he destroys and the billions who die with it.",more:[[7,"The star is Gododdin’s, and its death ends the Cielcin."]]}
];


/* ===================== PACK =====================
   Everything above is the Sun Eater Atlas data block, moved here unchanged. Below it is mapped onto
   the shared engine's pack format (see docs/atlas/PACK_FORMAT.md in the repo). */
const BOOK_COL={1:"#e0b85c",2:"#86a6ea",3:"#efe8da",4:"#d24a40",5:"#b2a898",6:"#7cc6a2",7:"#b88cec"};
const BOOK_INK={4:"#fff"};
const ORIGIN={map:[17.5,1.5]};   /* where the Cielcin first come from, past the Veil */
const SIGIL='<g stroke="url(#cg)" stroke-width="1.4" stroke-linecap="round"><path d="M24 3v6M24 39v6M3 24h6M39 24h6M9.2 9.2l4.2 4.2M34.6 34.6l4.2 4.2M9.2 38.8l4.2-4.2M34.6 13.4l4.2-4.2"/></g>'+
  '<circle cx="24" cy="24" r="11" fill="none" stroke="url(#cg)" stroke-width="1.6"/><circle cx="29" cy="21" r="9.2" fill="#060504" stroke="#c8352c" stroke-width="1"/>';
const SPLASH_SIGIL='<g stroke="url(#cg)" stroke-width="1.2" stroke-linecap="round"><path d="M24 3v6M24 39v6M3 24h6M39 24h6M9.2 9.2l4.2 4.2M34.6 34.6l4.2 4.2M9.2 38.8l4.2-4.2M34.6 13.4l4.2-4.2"/></g>'+
  '<circle cx="24" cy="24" r="11" fill="none" stroke="url(#cg)" stroke-width="1.4"/><circle cx="29" cy="21" r="9.2" fill="#060504" stroke="#c8352c" stroke-width="1"/>';
const books={};Object.keys(BOOKS).forEach(k=>{books[k]=Object.assign({},BOOKS[k],{c:BOOK_COL[k]},BOOK_INK[k]?{ink:BOOK_INK[k]}:{});});
/* Hadrian's road, one line per book; Cielcin raids grouped by the book in which the reader learns of them */
const links=ROUTES.map(r=>({id:r.id,label:r.label,path:r.path,book:r.book,speed:.45,dash:2.2,curve:.13}));
for(let b=1;b<=7;b++){const pairs=STRIKES.filter(s=>s[1]===b).map(([t])=>[b>=4?"dharantun":ORIGIN,t]);
  if(pairs.length)links.push({id:"s"+b,pairs,book:b,color:"#ff4a36",speed:.8,dash:3,curve:.08,opacity:{all:.4,cur:.85,past:.35}});}
const labels=REGION_TEXT.map(r=>({text:r[0],at:{map:[r[1],r[2]]},off:[0,4,0],min:r[3],max:r[4],big:!!r[5]}))
  .concat([{text:"Out of the dark",at:ORIGIN,off:[0,8,0],min:40,max:1400},{text:"Outside time",at:{world:"llesu"},off:[0,26,0],min:60,max:6000}]);
const gold={border:"rgba(232,205,138,.5)",color:"#e8cd8a"},red={border:"rgba(200,53,44,.6)",color:"#f08a7c"};

(window.ATLAS_PACKS=window.ATLAS_PACKS||{})["sun-eater"]={
  id:"sun-eater",
  meta:{
    title:"The Sun Eater Atlas",series:"The Sun Eater",author:"Christopher Ruocchio",years:"2018–2025",
    tagline:"The Empire, the Pale &amp; the <b>murdered sun</b>",
    splash:"Four arms of a galaxy under the Solar Throne, a pale enemy out of the dark beyond the Veil, and one man who will put out a star.",
    credits:"Fan-made atlas of Christopher Ruocchio’s <i>Sun Eater</i>. Positions follow the map in the later books; unmapped worlds are placed by region.",
    srcnote:"A fan-made atlas. Positions follow the galaxy map printed in Disquiet Gods and Shadows Upon Time, as transcribed by a reader; worlds the map leaves out are placed by their stated region. Surfaces are generated interpretations. Book VII details rest on early summaries.",
    canvasLabel:"Three-dimensional map of the Milky Way and the worlds of the Sun Eater",
    sources:["suneater.wiki (Nov Belgaer Sun Eater wiki)","Highmatter Books lore pages","Daniel Hasenbos galaxy map in Disquiet Gods / Shadows Upon Time","published summaries and reviews"]
  },
  theme:{
    void:"#060504",deep:"#120e0a",panel:"rgba(16,12,9,.86)",accent:"#b8913e",accentHi:"#e8cd8a",accentLo:"#5e4720",chrome:"#efe6d2",ember:"#c8352c",amber:"#e8a948",
    text:"#e6dfd2",muted:"#a89e8a",faint:"#6e6454",line:"rgba(232,205,138,.16)",lineStrong:"rgba(232,205,138,.46)",
    fontDisplay:'"Cinzel","Cormorant Garamond",Georgia,serif',
    chromeGrad:"linear-gradient(180deg,#fff7e2 0%,#e8cd8a 38%,#9a7432 62%,#f4e2b2 100%)",
    chromeStops:[[0,"#fff7e2"],[.45,"#e8cd8a"],[.68,"#9a7432"],[1,"#f4e2b2"]],
    panelRgb:"22,17,12",panelRgb2:"9,7,5",insetRgb:"255,236,200",btnRgb:"16,12,9",ink:"#0d0a06",glowRgb:"232,170,80",hiRgb:"201,162,74",
    swRgb:"232,205,138",pipRgb:"232,205,138",title:"#f6efe2",title2:"#f6efe2",title3:"#f6efe2",shadeRgb:"8,6,5",tip1:"#1e1610",tip2:"#0a0806",
    voidRgb:"6,5,4",codexRgb:"4,3,2",splashGlow:"#20150c",brandSpacing:".12em",selRing:"#e8cd8a",hoverRing:"#ece4d2",
    sigil:SIGIL,splashSigil:SPLASH_SIGIL,splashSize:78
  },
  books,
  spoilers:{mode:"cumulative"},
  ui:{wrapBooks:true,indexTitle:"Worlds of the Sun Eater",homeButton:"Empire",homeAction:"Fly to the Empire",homeLink:"The Empire",homeCrumb:"Sollan Empire",crumbGroups:true,
      go:{id:"delos",label:"Go to Delos"},bookLabel:"Reading",allTitle:"All seven books, with spoilers",booksAria:"The book you are reading through",showCredits:false},
  intro:INTRO,
  groups:[
    {id:"orion",name:"Spur of Orion",chip:gold},{id:"sagittarius",name:"Sagittarius Arm",chip:gold},{id:"centaurus",name:"Centaurus & the Sullen Gulf",chip:gold},
    {id:"norma",name:"Norma & the Veil of Marinus",chip:red},{id:"perseus",name:"Perseus Arm",chip:gold},
    {id:"wisp",name:"The Taurus Wisp",chip:{border:"rgba(106,176,208,.6)",color:"#9ad0e8"}},{id:"beyond",name:"Beyond the core",chip:red},
    {id:"outside",name:"Outside time",chip:{border:"rgba(184,140,236,.6)",color:"#d2b6f4"},labelFar:7000,flyDist:70}
  ],
  worlds:WORLDS,
  events:EVENTS,
  codex:[{id:"factions",title:"Powers",list:FACTIONS},{id:"people",title:"People",list:CHARACTERS},{id:"ideas",title:"Ideas & beings",list:CONCEPTS}],
  galaxy:{
    sol:[0,27.14],mirrorGal:true,
    /* arms fitted to the book map: log spirals of 12.5° pitch through Norma, Centaurus, Sagittarius and Perseus */
    arms:[{a:-4.955,name:"Norma Arm"},{a:-6.526,name:"Centaurus Arm"},{a:-8.097,name:"Sagittarius Arm"},{a:-9.668,name:"Perseus Arm"}],pitch:12.5,
    spur:{r:27.1,span:.8,n:5500,nMob:2500},   /* the Spur of Orion around Old Earth */
    home:{at:{xyz:[10,0,215]},dist:560,pitch:.92,dur:2200},
    flyDist:24,flyPitch:.5,labelFar:{major:1500,minor:560},
    link:{base:.62,gain:1.5,curveMax:90},
    swarm:{n:220,spread:4.5},
    labels,territories:TERRITORIES,
    glows:[{at:ORIGIN,scale:26,opacity:.5,color:"red",pulse:true}],
    links
  },
  legend:[{bookColors:true,label:"Hadrian’s road",allLabel:"Hadrian’s road, by book"},{color:"#ff4a36",label:"Cielcin raids"},{color:"rgba(201,162,74,.6)",label:"Sollan space"}],
  hooks:{
    distText(w,api){const W=api.worldBy;if(w.pos3)return "Not in our time or space";if(w.id==="earth")return "The map’s reference point, 27,000 light-years from the core";
      const ly=w.gal?w.gal.ly:Math.round(w.pos.distanceTo(W.earth.pos))*100;
      if(w.gal)return "About "+ly.toLocaleString()+" light-years from Old Earth (real star)";
      return "About "+ly.toLocaleString()+" light-years from Old Earth"+(w.est?" · position estimated":" · from the book map");}
  }
};
})();

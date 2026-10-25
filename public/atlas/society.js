(function(){
"use strict";
function isMob(){return matchMedia("(max-width:820px), (max-height:520px) and (pointer:coarse)").matches;}
/* ---- 00-data.js ---- */
/* ===================== CONTENT ===================== */
const BOOKS={1:{n:"I",title:"Red Rising"},2:{n:"II",title:"Golden Son"},3:{n:"III",title:"Morning Star"},4:{n:"IV",title:"Iron Gold"},5:{n:"V",title:"Dark Age"},6:{n:"VI",title:"Light Bringer"}};

const BODIES=[
 {id:"sun",name:"Sol",kind:"sun",size:4.2,a:0,epithet:"The Sun",control:"—",
  blurb:"The star every Color works beneath. Helium-3 mined on Mars keeps the Society’s engines and cities burning across its reach.",sw:"#f2a94a"},
 {id:"mercury",name:"Mercury",parent:"sun",kind:"mercury",a:11,size:.72,period:30,phase:.15,group:"Core",epithet:"Core world",control:"The Society",
  blurb:"A scorched world of the Core.",sw:"#9a8a78"},
 {id:"venus",name:"Venus",parent:"sun",kind:"venus",a:16,size:1.02,period:44,phase:.62,group:"Core",epithet:"Core world",control:"The Society",
  blurb:"A cloud-covered Core world.",sw:"#e3c584"},
 {id:"earth",name:"Earth",parent:"sun",kind:"earth",a:22,size:1.12,period:58,phase:.38,group:"Core",epithet:"Humanity’s homeworld",control:"The Society",
  blurb:"Humanity’s homeworld, governed from Luna.",sw:"#4f86b8"},
 {id:"luna",name:"Luna",parent:"earth",kind:"luna",a:2.4,size:.42,period:7,phase:.1,group:"Core",moon:true,epithet:"Seat of the Society",control:"Sovereign Octavia au Lune",
  blurb:"The Society’s political center and home of its Sovereign.",sw:"#bdb8ae"},
 {id:"mars",name:"Mars",parent:"sun",kind:"mars",a:30,size:1,period:76,phase:.82,group:"Mars",epithet:"Darrow’s home",control:"House Augustus · ArchGovernor Nero",
  blurb:"A terraformed world where Reds mine helium-3 deep underground, told they are pioneers preparing the planet for others. Home to Lykos, the Institute, and the Augustus capital of Agea.",sw:"#c0583a"},
 {id:"phobos",name:"Phobos",parent:"mars",kind:"phobos",a:1.9,size:.22,period:4.5,phase:.4,group:"Mars",moon:true,epithet:"Moon of Mars",control:"The Society",
  blurb:"An industrial moon of Mars.",sw:"#8d7d70"},
 {id:"jupiter",name:"Jupiter",parent:"sun",kind:"jupiter",a:50,size:2.6,period:150,phase:.55,group:"Jupiter",epithet:"Gas giant · gateway to the Rim",control:"Rim Golds · House Raa",
  blurb:"Its moons hold the Raa family seat and the great shipyards of Ganymede.",sw:"#d2a77a"},
 {id:"io",name:"Io",parent:"jupiter",kind:"io",a:4.2,size:.34,period:7,phase:.0,group:"Jupiter",moon:true,epithet:"Seat of House Raa",control:"Romulus au Raa",
  blurb:"Volcanic moon ruled by House Raa.",sw:"#e0c45c"},
 {id:"europa",name:"Europa",parent:"jupiter",kind:"europa",a:5.4,size:.31,period:10,phase:.3,group:"Jupiter",moon:true,epithet:"Ocean moon of the Rim",control:"House Arcos",
  blurb:"An ocean moon of Jupiter.",sw:"#ddd3c2"},
 {id:"ganymede",name:"Ganymede",parent:"jupiter",kind:"ganymede",a:6.9,size:.45,period:14,phase:.6,group:"Jupiter",moon:true,epithet:"Shipyard moon",control:"The Society",
  blurb:"Home to the Society’s great dockyards.",sw:"#9d917f"},
 {id:"callisto",name:"Callisto",parent:"jupiter",kind:"callisto",a:8.4,size:.4,period:20,phase:.85,group:"Jupiter",moon:true,epithet:"Outer Jovian moon",control:"Rim Golds",
  blurb:"Part of the Rim’s holdings around Jupiter. It stays in the background during the trilogy.",sw:"#5e554c"},
 {id:"saturn",name:"Saturn",parent:"sun",kind:"saturn",a:70,size:2.2,period:220,phase:.25,ring:true,group:"Saturn",epithet:"Gas giant · the far Rim",control:"Moon Lords of the Rim",
  blurb:"The far edge of the Rim, where independent-minded Gold houses rule its moons. Mostly offstage in the trilogy; its role grows in later books.",sw:"#d8c391"}
];

/* Places on each globe. lat/lon are stylized for this atlas except where noted. `site` opens a bird's-eye scene. */
const POIS={
 mars:[
  {id:"lykos",name:"Lykos",lat:-34,lon:-14,site:"lykos",desc:"One of the first of Mars’s two dozen underground mining colonies. Reds here drill for helium-3 and compete for the Laurel, believing their work will make Mars habitable."},
  {id:"yorkton",name:"Yorkton",lat:-6,lon:24,site:"yorkton",desc:"Martian city whose dark, crowded Bazaar hides Mickey the Carver’s club and workshop, where the Sons of Ares bring Darrow to be remade as a Gold."},
  {id:"agea",name:"Agea",lat:-8,lon:-71,site:"agea",desc:{0:"Capital of Mars and seat of House Augustus, set in the heart of Valles Marineris.",2:"Capital of Mars and seat of House Augustus, set in the heart of Valles Marineris. Its Citadel and the Field of Mars host the great Triumph."}},
  {id:"institute",name:"The Institute",lat:-5,lon:-58,site:"institute",desc:"A terraformed valley in the upper arm of Valles Marineris, about 80 km east of Agea. Highlands, the Argos River, the Greatwoods and a southern sea, where young Golds are split into twelve Houses and fight for supremacy."},
  {id:"olympus",name:"Olympus",lat:-1.5,lon:-55,site:"institute",focus:"olympus",desc:"An artificial mountain floating about two kilometers above the Institute, crowned by a bone-pale marble citadel. The Proctors watch the games from here, and quietly rig them."},
  {id:"attica",name:"Attica",lat:-32,lon:145,site:"attica",desc:{0:"A city on seven mountain peaks in Cimmeria, crowned with jagged steel-and-glass towers linked by bridges.",3:"A city on seven mountain peaks in Cimmeria, crowned with jagged steel-and-glass towers linked by bridges. The Jackal’s stronghold from the end of the Iron Rain; after the Triumph, Darrow is held prisoner here for nearly a year."}},
  {id:"southpole",name:"South Pole · Asgard",lat:-78,lon:110,site:"asgard",desc:{0:"The frozen southern continent of the Obsidian tribes, cut off by the South Sea.",3:"The frozen southern continent of the Obsidian tribes, cut off by the South Sea. Above it hangs Asgard, a flying mountain from which Golds play the tribes’ gods."}}
 ],
 luna:[{id:"hyperion",name:"Hyperion",lat:1,lon:32,site:"hyperion",desc:{0:"Luna’s capital on the south shore of the Sea of Serenity: a layered city of kilometers-tall towers, with the Citadel of Light on its western edge.",2:"Luna’s capital on the south shore of the Sea of Serenity: a layered city of kilometers-tall towers, with the Citadel of Light on its western edge. Site of the Summit in Golden Son.",3:"Luna’s capital on the south shore of the Sea of Serenity: a layered city of kilometers-tall towers, with the Citadel of Light on its western edge. Site of the Summit in Golden Son and the last stand in Morning Star."}}],
 phobos:[{id:"phobosport",name:"The Hive & the Needles",lat:8,lon:0,site:"phobos",desc:{0:"A jagged city built over six centuries into and above the rock, its luxury tower tips called the Needles.",3:"A jagged city built over six centuries into and above the rock, its luxury tower tips called the Needles. Quicksilver’s helium-3 fortune is based here."}}],
 io:[{id:"raaseat",name:"Nesos",lat:12,lon:20,site:"io",desc:"Io’s capital and the seat of House Raa, sheltered by pulse shields amid sulfur dunes and volcanoes. Romulus au Raa meets Darrow on Io."}],
 europa:[{id:"lornhome",name:"Lorn’s castle",lat:62,lon:-20,site:"europa",desc:{0:"A white limestone castle on a far-northern island of Europa’s ocean, its walls ringing a private forest.",2:"A white limestone castle on a far-northern island of Europa’s ocean, its walls ringing a private forest. Lorn au Arcos lives here with his family, far from his wars."}}],
 ganymede:[{id:"docks",name:"Ganymede Dockyards",lat:0,lon:6,site:"ganymede",desc:"A grey ring of shipyards around Ganymede’s equator, centuries in the building, where the Society’s greatest warships, Colossus among them, are made."}]
};

/* lm = landmark inside the site scene; fx = an animation to play */
const EVENTS=[
 {id:"e1",book:1,body:"mars",poi:"lykos",lm:"gallows",title:"Eo is hanged",text:"Eo sings a forbidden song in defiance and is hanged on ArchGovernor Nero au Augustus’s orders. Darrow buries her, is hanged in turn, and survives because his uncle Narol drugged him."},
 {id:"e2",book:1,body:"mars",poi:"yorkton",lm:"carver",title:"Carved into a Gold",text:"The Sons of Ares take Darrow in. Mickey the Carver remakes his body into a Gold’s, and Matteo teaches him how Golds speak and move."},
 {id:"e3",book:1,body:"mars",poi:"institute",lm:"passage",title:"The Passage",text:"On the first night at the Institute, students are paired off and must kill to survive. Darrow kills Julian au Bellona, Cassius’s brother."},
 {id:"e4",book:1,body:"mars",poi:"institute",lm:"castle_mars",title:"War of the Houses",text:"House Mars fractures. Darrow earns the name Reaper, Cassius kills Titus in a duel, and later Cassius stabs Darrow and leaves him for dead. Mustang saves him."},
 {id:"e4b",book:1,body:"mars",poi:"institute",lm:"castle_minerva",title:"Minerva and Diana fall",text:"Darrow builds an army of freed slaves under the Minerva flag. His growing force enslaves House Diana and most of House Minerva, but he lets Mustang escape, and she later joins him."},
 {id:"e4c",book:1,body:"mars",poi:"institute",lm:"castle_apollo",title:"Blitz on Apollo",text:"Darrow’s army conquers Houses Ceres and Apollo. When the Proctors kidnap Mustang to stop him, Darrow kills Proctor Apollo."},
 {id:"e5",book:1,body:"mars",poi:"olympus",lm:"olympus",title:"Storming Olympus",text:"Darrow’s army takes the Proctors’ stronghold, frees Mustang, and wins the Institute. Nero offers Darrow a place as his lancer in House Augustus."},
 {id:"e6",book:2,body:"belt",where:"The Asteroid Belt",poi:null,title:"Losing the Academy",text:"At the fleet Academy out in the asteroid belt, Darrow finishes second to Karnus au Bellona, who has help from the Sovereign and the Proctors. Nero puts Darrow’s contract up for auction."},
 {id:"e7",book:2,body:"luna",poi:"hyperion",lm:"sovspire",title:"The Summit",text:"Darrow abandons a Sons of Ares bombing, duels and beats Cassius, and a sword brawl breaks out with House Bellona. Leto is killed."},
 {id:"e8",book:2,body:"luna",poi:null,fx:"vanguard",title:"Taking the Vanguard",text:"After the Summit massacre, Darrow and Sevro are fired from launch tubes onto the bridge of the Vanguard, a warship of the Sovereign’s fleet, while its lowColor crew rises against their Golds. Renamed the Pax, it escapes Luna, and Ragnar pledges himself to Darrow."},
 {id:"e9",book:2,body:"europa",poi:"lornhome",lm:"villa",title:"Winning Lorn",text:"Darrow comes to recruit his old sword teacher and survives an ambush by Aja. After Tactus betrays them, Lorn executes him and joins Darrow’s cause."},
 {id:"e10",book:2,body:"ganymede",poi:"docks",lm:"platform",fx:"docktrap",title:"Trap at Ganymede",text:"House Augustus raids the dockyards, knocking out reactors on the defense platform, but Pliny has betrayed the plan. Nero and the Jackal are ambushed and captured while Darrow is away on Europa."},
 {id:"e11",book:2,body:"mars",poi:"agea",fx:"ironrain",title:"Iron Rain over Mars",text:"Darrow’s forces drop onto Bellona-held Mars in an Iron Rain, thousands of soldiers falling from orbit at once. Ragnar opens Agea’s gates from within. Darrow kills Karnus aboard the Sovereign’s ship, and Fitchner reveals that he is Ares."},
 {id:"e12",book:2,body:"mars",poi:"lykos",lm:"common",title:"Return to Lykos",text:"Darrow brings Mustang home and tells her the truth about who he is. He sees his mother again, and Mustang leaves troubled by what his revolution will cost."},
 {id:"e13",book:2,body:"mars",poi:"agea",lm:"field",title:"The Triumph",text:"At the victory Triumph, Roque betrays Darrow and hands him a box holding Fitchner’s head. Lorn and Nero are killed, and the Jackal takes Mars for himself."},
 {id:"e14",book:3,body:"mars",poi:"attica",lm:"citadel",title:"Out of the dark",text:"Holiday and Trigg break Darrow out of the Jackal’s captivity, where he has been held for nearly a year. Aja kills Trigg during the escape."},
 {id:"e15",book:3,body:"phobos",poi:"phobosport",lm:"helix",title:"Raid on the peace talks",text:"The Howlers strike the peace talks on Phobos and kidnap Quicksilver, who turns out to be a founder of the Sons of Ares."},
 {id:"e16",book:3,body:"phobos",poi:"phobosport",lm:"docks",title:"Phobos seized",text:"Darrow’s broadcast sets off a revolt on Phobos while Sevro springs a trap on the Society’s response fleet, covering Darrow’s mission to the south pole."},
 {id:"e17",book:3,body:"mars",poi:"southpole",lm:"asgard",title:"Ragnar falls",text:"Shot down over the ice, Darrow and Ragnar fight Aja and Cassius. Aja kills Ragnar. Darrow, Mustang and Sefi then take the flying fortress of Asgard, and the Obsidians join the Rising."},
 {id:"e18",book:3,body:"io",poi:"raaseat",lm:"court",title:"The Rim’s bargain",text:"Darrow meets Romulus au Raa on Io and wins him over. The Rim joins the fight against Roque’s armada in exchange for its independence."},
 {id:"e19",book:3,body:"jupiter",poi:null,fx:"armada",title:"Battle of Ilium",text:"Over Jupiter, the Pax charges into the Sword Armada as a decoy and is blown up with Roque’s boarders aboard, while drills bore into Colossus. Cornered on his bridge, Roque takes his own life."},
 {id:"e20",book:3,body:"ganymede",poi:"docks",lm:"ring",fx:"yardsburn",title:"The shipyards burn",text:"On Darrow’s order, the captured Colossus bombards the Ganymede dock ring, crippling the Rim’s ability to make war. Wreckage falls on New Troy below, and the attack is staged to look like Roque’s doing."},
 {id:"e21",book:3,body:"luna",poi:"hyperion",lm:"dragonmaw",fx:"nukes",title:"Siege of Luna",text:"In the Sovereign’s bunker beneath the Citadel, Darrow kills Octavia and Aja finally falls. The Jackal’s hidden nuclear bombs kill millions across Luna before the Ash Lord’s fleet destroys Lilath’s ship."},
 {id:"e22",book:3,body:"luna",poi:"hyperion",lm:"citadel",title:"A new Sovereign",text:"Mustang becomes Sovereign. Luna, Mars, and Earth belong to the Rising, and the Jackal is executed."},
 {id:"e23",book:3,body:"venus",poi:null,title:"The Ash Lord retreats",text:"The Ash Lord’s surviving fleet withdraws to Venus and Mercury, leaving the inner system to the Rising."},
 {id:"e24",book:3,body:"earth",poi:null,title:"Pax",text:"On Earth, Mustang tells Darrow they have a son."}
];
/* Where each animation plays: in a site scene or around a globe */
const FX_VIEW={ironrain:{view:"site",site:"agea",title:"The Iron Rain",sub:"StarShells fired from orbit burn through the sky toward Bellona-held Agea"},
  vanguard:{view:"globe",body:"luna",title:"Taking the Vanguard",sub:"Darrow and Sevro are fired onto the Vanguard’s bridge above Luna"},
  docktrap:{view:"site",site:"ganymede",title:"Trap at Ganymede",sub:"The raid on the defense platform turns into an ambush"},
  yardsburn:{view:"site",site:"ganymede",title:"The Shipyards Burn",sub:"On Darrow’s order, the captured Colossus turns its guns on the dock ring"},
  armada:{view:"globe",body:"jupiter",title:"Battle of Ilium",sub:"The Pax charges the Sword Armada while drills bore into Colossus"},
  nukes:{view:"globe",body:"luna",title:"The Siege of Luna",sub:"The Jackal’s hidden bombs detonate across the moon"}};


/* ---- 01-data-saga.js ---- */
/* ===================== THE SECOND TRILOGY: Iron Gold · Dark Age · Light Bringer ===================== */
/* ---- worlds by era (a value applies from that book onward) ---- */
const ERAS={
 mercury:{1:{epithet:"Innermost world of the Core",control:"House Votum · the Society",blurb:"A terraformed world under a fierce sun. Its great continent, Helios, runs from alpine north coasts through the chalk desert of the Waste of Ladon to southern jungles. Ancestral seat of House Votum."},
   3:{blurb:"A terraformed world under a fierce sun. Its great continent, Helios, runs from alpine north coasts through the chalk desert of the Waste of Ladon to southern jungles. Ancestral seat of House Votum. At the close of the trilogy it becomes a refuge for the Ash Lord’s retreating fleet."},
   4:{epithet:"The Republic’s conquest",control:"The Republic · Darrow’s legions",blurb:"Ten years after Morning Star, Darrow’s Iron Rain tears Mercury from the Society against the Senate’s wishes. Tyche and Heliopolis fly Republic colors, but the Society Remnant has not let go."},
   5:{epithet:"The war for Helios",control:"Contested · Republic vs. Society Remnant",blurb:"Dark Age. Atalantia’s Remnant falls on Mercury. Darrow wakes the Storm Gods, Tyche drowns, the Ladon swallows armies, and Heliopolis is besieged until it falls."},
   6:{epithet:"Lysander’s world",control:"The Society · Lysander au Lune",blurb:"Light Bringer. Mercury belongs to the Society and hails Lysander as its hero. Above Heliopolis he unveils the Lightbringer, once Darrow’s Morning Star."}},
 venus:{3:{blurb:"Cloud-wrapped Core world loyal to the Sovereign. After Luna falls, the Ash Lord pulls what remains of his forces back here and to Mercury."},
   4:{epithet:"Stronghold of the Society",control:"The Society · the Ash Lord",blurb:"A terraformed world of warm seas and islands. On Gorgon Isle stands the fortress of the Ash Lord, Magnus au Grimmus, until Darrow storms it in Iron Gold."},
   6:{epithet:"Shipyards of the Society",control:"Contested · House Carthii vs. Apollonius au Valii-Rath",blurb:"The great Venus dockyards of the Carthii build the Society’s fleets. In Light Bringer, Darrow loses a duel in the Hanging Coliseum before Sevro blows the dockyards apart."}},
 earth:{3:{control:"The Society, then the Rising",blurb:"Conquered long ago and governed from Luna. The Rising takes it at the end of Morning Star, and it is where Mustang finally tells Darrow her secret."},
   4:{control:"The Republic",blurb:"Republic territory a decade after the Rising. Beneath the Atlantic lies Deepgrave, the prison where Apollonius au Valii-Rath is held."},
   5:{control:"The Rim and the Society Remnant",blurb:"Dark Age. Diomedes au Raa and Ajax au Grimmus seize Earth for the Rim and the Society."},
   6:{control:"The Society · Atalantia au Grimmus",blurb:"Light Bringer. Atalantia rules the Society from New Sparta in Africa and summons Lysander there to humble him."}},
 luna:{3:{blurb:"A moon paved over with cities from pole to pole, home of the Sovereign, the Senate, and the Society’s oldest Gold families. The trilogy’s final battle is fought here."},
   4:{epithet:"Capital of the Republic",control:"The Republic · Sovereign Virginia",blurb:"Ten years on, Hyperion is the Republic’s capital: a Senate and a Sovereign, rebuilt with Quicksilver’s money, its scars from the Jackal’s bombs still visible. The Syndicate rules the underworld."},
   5:{control:"The Republic, then the Vox Populi coup",blurb:"Dark Age. On the Day of Red Doves, Dancer is poisoned and Publius’s Vox Populi seize power. Lilath au Faran is unmasked as the Syndicate Queen, serving a child clone of the Jackal and ruling through Publius."},
   6:{control:"Besieged by Atalantia",blurb:"Light Bringer. Luna is under siege by Atalantia’s Society."}},
 mars:{4:{control:"The Republic",blurb:"A decade after the Rising, Reds have left the mines for camps and new towns, and the Red Hand wages a terror war. Lyria of Lagalos loses her family here."},
   5:{control:"The Republic, under attack",blurb:"Dark Age. Volsung Fá’s Ascomanni raid Mars, kill Sefi at Olympia, and leave with the Obsidian people. Virginia escapes Luna and is given emergency powers on Mars."},
   6:{control:"The Republic’s last bastion",blurb:"Light Bringer. Virginia holds Mars as the Society closes in, and Phobos falls above her, and she retreats to the planet."}},
 phobos:{3:{blurb:"Mars’s inner moon, built over until it is closer to a space station than a rock. An industrial hub tied to Quicksilver, scene of the Howlers’ raid on the peace talks, later seized by the Rising."},
   4:{epithet:"The Republic’s fortress moon",control:"The Republic",blurb:"A hollowed moon wrapped in metal and grown over with spires that reach far beyond the rock: the Republic’s orbital defenses, docks and shipyards, watched over by statues of the Rising."},
   6:{control:"The Republic, then Lysander",blurb:"Light Bringer. Mercury’s railguns and Lysander’s crewless destroyers break Phobos’s shield, and it falls. Victra and Thraxa kill Ajax in the fighting."}},
 jupiter:{4:{control:"The Rim Dominion · House Raa",blurb:"The independent Rim. Dido au Raa’s coup on Io topples Romulus and bends the Rim toward war with the Republic."},
   6:{control:"The Rim, then ruin",blurb:"Light Bringer. Volsung Fá razes Io, bombs Callisto and invades Europa. At Kalyke, Atlas kills Dido and Helios and wrecks the Rim fleet."}},
 io:{4:{epithet:"Seat of House Raa",control:"Dido au Raa",blurb:"Seat of the Raa at Sungrave. In the Bleeding Place, Cassius fights for his life; Dido’s coup ends with Romulus’s death."},
   6:{control:"Razed by Volsung Fá",blurb:"Light Bringer. Fá razes Io and enslaves its people. Then Lysander bombards Demeter’s Garter, the farm belt that feeds the Rim."}},
 europa:{6:{control:"Invaded by Volsung Fá",blurb:"An ocean world of forested islands. In Light Bringer, Fá invades it, and beneath its sea the Daughters of Athena put Darrow and Diomedes on trial."}},
 ganymede:{4:{blurb:"Its forests and seas still glow with cities, but the great dock ring lies wrecked, destroyed on Darrow’s order at the end of Morning Star."}},
 callisto:{6:{blurb:"Bombed by Volsung Fá’s Ascomanni in Light Bringer."}}
};
Object.keys(ERAS).forEach(id=>{const b=BODIES.find(x=>x.id===id);if(b)b.eras=ERAS[id];});

/* ---- new bodies ---- */
const _NEWB=[
 {id:"kalyke",name:"Kalyke",parent:"jupiter",kind:"callisto",a:10.2,size:.16,period:28,phase:.2,group:"Jupiter",moon:true,epithet:"Small outer moon of Jupiter",control:"The Rim",
  blurb:"A small, distant moon of Jupiter.",sw:"#7a7066"},
 {id:"asteroid",name:"Asteroid 12193",parent:"sun",kind:"phobos",a:40,size:.2,period:120,phase:.62,group:"Belt",epithet:"An asteroid",control:"Unknown",
  blurb:"A rock in the asteroid belt, hollowed out in secret.",sw:"#8a7a6a"}
];
BODIES.splice(BODIES.findIndex(b=>b.id==="callisto")+1,0,_NEWB[0]);
BODIES.splice(BODIES.findIndex(b=>b.id==="jupiter"),0,_NEWB[1]);

/* ---- places ---- */
const HL={"tyche":[24.33,-17.33],"heliopolis":[-3.86,-15.95],"bluereach":[29.54,-10.6],"pan":[33.67,-4.68],"kaikos":[41.34,12.53],"priapos":[40.8,32.46],"kydon":[30.2,30.45],"redreach":[22.58,4.73],"kylor":[20.54,-15.64],"angelia":[14.2,15.38],"naran":[9.38,-13.3],"erebos":[7.45,-16.35],"eleusis":[6.43,17.87],"caduceus":[26.58,9.88],"ladon":[12.46,-5.39],"hesperides":[2.44,-31.72],"sirens":[-14.67,-23.62],"caliban":[-26.4,-61.37],"keryx":[1.59,49.98],"polybos":[-17.83,33.41],"arabos":[33.53,45.36]};
POIS.mercury=[
 {id:"heliopolis",name:"Heliopolis",lat:HL.heliopolis[0],lon:HL.heliopolis[1],site:"heliopolis",desc:{0:"Second jewel of Mercury, south of the Hesperides and east of the Bay of Sirens: the Hippodrome, the Water Plaza, the Graveyard of Tyrants, and the Mound of Votum on the bay.",5:"Second jewel of Mercury, south of the Hesperides and east of the Bay of Sirens: the Hippodrome, the Water Plaza, the Graveyard of Tyrants, and the Mound of Votum on the bay. It falls in Dark Age."}},
 {id:"tyche",name:"Tyche",lat:HL.tyche[0],lon:HL.tyche[1],site:"tyche",desc:{0:"Mercury’s capital and richest city, on the Sycorax Sea: glass-and-limestone towers of House Votum, libraries carved into the mountains as colossal heads, and bridged islands.",5:"Mercury’s capital and richest city, on the Sycorax Sea: glass-and-limestone towers of House Votum, libraries carved into the mountains as colossal heads, and bridged islands. Darrow’s headquarters, drowned in Dark Age."}},
 {id:"ladon",name:"Waste of Ladon",lat:HL.ladon[0],lon:HL.ladon[1],site:"helios",focus:"ladon",desc:{0:"The chalk desert along Helios’s equator, called the Waste and the Eater of Armies.",5:"The chalk desert along Helios’s equator, called the Waste and the Eater of Armies. In Dark Age the Storm Gods raise a sandstorm across it that swallows armies."}},
 {id:"redreach",name:"Red Reach",lat:HL.redreach[0],lon:HL.redreach[1],site:"helios",focus:"redreach",from:4,desc:{0:"A Republic military base east of Tyche, one of the few with its own power.",5:"A Republic military base east of Tyche, one of the few with its own power. In Dark Age an atomic strike destroys it, along with most of the Second Army."}},
 {id:"caduceus",name:"Plains of Caduceus",lat:HL.caduceus[0],lon:HL.caduceus[1],site:"helios",focus:"caduceus",desc:{0:"Grasslands between the north coast and the Ladon.",5:"Grasslands between the north coast and the Ladon, where the Society’s landing waves are caught in Orion’s storms."}},
 {id:"angelia",name:"Angelia",lat:HL.angelia[0],lon:HL.angelia[1],site:"helios",focus:"angelia",desc:{0:"A small city north of Eleusis.",5:"A small city north of Eleusis. The Fear Knight booby-traps it and sets its reactor to blow."}},
 {id:"erebos",name:"Erebos",lat:HL.erebos[0],lon:HL.erebos[1],site:"helios",focus:"erebos",desc:{0:"A town in the foothills of the Hesperides.",5:"A town in the foothills of the Hesperides. Lysander is captured here by the Gorgons after the Ladon."}},
 {id:"eleusis",name:"Eleusis",lat:HL.eleusis[0],lon:HL.eleusis[1],site:"helios",focus:"eleusis",desc:"A mining city on the eastern edge of the Ladon."},
 {id:"children",name:"The Children",lat:HL.kydon[0]+3,lon:HL.kydon[1]-14,site:"helios",focus:"kydon",desc:{0:"The cities of the Petasos Peninsula on the northeast coast, among them Kydon, Pan, Kaikos and Priapos.",4:"The cities of the Petasos Peninsula on the northeast coast, among them Kydon, Pan, Kaikos and Priapos. Republic bases stand near Kydon and Pan."}},
 {id:"caliban",name:"Caliban Sea",lat:-8,lon:-38,desc:{0:"The sea west of Helios.",5:"The sea west of Helios. Wrecks of the White Fleet fall into it after Atalantia’s ambush over Tyche."}},
 {id:"polar",name:"Storm God vaults",lat:72,lon:-12,from:5,desc:"House Lune secretly buried seven Storm Gods, kilometer-wide weather machines, beneath Mercury’s polar ice as a check on House Votum. Darrow raises them in Dark Age."}
];
POIS.venus=[
 {id:"gorgon",name:"Gorgon Isle",lat:18,lon:-40,site:"gorgon",desc:{0:"The Ash Lord’s fortress island.",4:"The Ash Lord’s fortress island. In Iron Gold, Darrow storms it to find Magnus au Grimmus dying of poison; he learns Atalantia leads the Society now, and Magnus burns."}},
 {id:"vdocks",name:"Venus Dockyards",lat:0,lon:30,site:"venusdocks",desc:{0:"The orbital shipyards of House Carthii and the Hanging Coliseum.",6:"The orbital shipyards of House Carthii and the Hanging Coliseum. In Light Bringer, Darrow loses a razor duel here before Sevro blows up the dockyards."}},
 {id:"rath",name:"House Valii-Rath",lat:-22,lon:60,from:4,desc:"Where Apollonius au Valii-Rath takes back his house’s forces from his brother Tharsus in Iron Gold."}
];
POIS.earth=[
 {id:"newsparta",name:"New Sparta",lat:4,lon:24,site:"newsparta",from:6,desc:"Atalantia’s African seat, where she pressures Lysander before the summit."},
 {id:"deepgrave",name:"Deepgrave",lat:38,lon:-38,from:4,desc:"A prison beneath the Atlantic. Darrow’s team raids it in Iron Gold and frees Apollonius au Valii-Rath."},
 {id:"greenland",name:"Greenland base",lat:72,lon:-42,from:4,desc:"Darrow’s hidden base on Earth in Iron Gold."},
 {id:"rome",name:"Rome",lat:41.9,lon:12.5,from:6,desc:"Atalantia convenes the Two Hundred in Rome’s Colosseum."}
];
POIS.luna.push(
 {id:"silene",name:"Lake Silene",lat:14,lon:34,from:4,desc:"Silene Manor stands here, where Darrow gives Pax his gravBike key and says goodbye before escaping."},
 {id:"endymion",name:"Endymion",lat:52,lon:58,from:4,desc:"A manufacturing and shipping city on Luna. In Iron Gold, Ephraim frees Pax and Electra from a vault here."}
);
POIS.mars.push(
 {id:"lagalos",name:"Lagalos & Camp 121",lat:-24,lon:-40,from:4,desc:"Lyria’s home mine, and the riverside assimilation camp where her family moved. The Red Hand massacres the camp in Iron Gold; Lyria pulls Kavax au Telemanus from the river."},
 {id:"olympia",name:"Olympia",lat:22,lon:-110,from:4,desc:{0:"The old Bellona citadel on Eagle Rest, now Sefi’s seat.",5:"The old Bellona citadel on Eagle Rest, now Sefi’s seat. In Dark Age, Volsung Fá breaks the Alltribe here, kills Sefi in a duel, and Ephraim dies."}},
 {id:"cimmeria",name:"Cimmeria mines",lat:-30,lon:130,from:5,desc:"Quicksilver’s helium mines. Victra’s escape craft crashes in Cimmeria after the Pandora is boarded."}
);
POIS.phobos.push({id:"nucleus",name:"The Nucleus",lat:-30,lon:90,from:6,site:"phobos",focus:"nucleus",desc:"Virginia’s command center inside Phobos, from which she directs its battle stations in Light Bringer."});
POIS.io.push(
 {id:"garter",name:"Demeter’s Garter",lat:0,lon:-60,site:"garter",desc:"The equatorial farm belt that grows most of the Rim’s food. In Light Bringer, Lysander bombards it."},
 {id:"sungrave",name:"Sungrave",lat:-18,lon:70,from:4,desc:"City of House Raa on Io, where Lysander and Cassius are brought as prisoners in Iron Gold."},
 {id:"bleeding",name:"The Bleeding Place",lat:26,lon:110,from:4,desc:"The dueling ground of the Raa. Cassius kills Bellerephon here in Iron Gold, and Lysander reveals who he is."}
);
POIS.europa.push({id:"athena",name:"Daughters of Athena",lat:-20,lon:60,from:6,site:"europa",focus:"athena",desc:"A base hidden beneath Europa’s ocean. In Light Bringer, Athena tries Darrow and Diomedes here, and Sevro talks her into sparing them."});
POIS.asteroid=[{id:"base",name:"Tabula Rasa",lat:10,lon:0,from:6,site:"asteroid",desc:"Quicksilver’s secret base inside the asteroid, and the generation ship he has built in place of a fleet."}];
/* places that belong to the first trilogy only */
["institute","olympus"].forEach(id=>{const p=POIS.mars.find(x=>x.id===id);if(p)p.until=6;});

/* ---- the Chronicle, books IV to VI ---- */
EVENTS.push(
 /* IRON GOLD */
 {id:"g1",book:4,body:"mercury",poi:"tyche",fx:"rainmerc",title:"The Rain on Mercury",text:"Ten years after Morning Star, Darrow leads the Republic’s Iron Rain onto Mercury and frees it from the Society, against the wishes of the Senate."},
 {id:"g2",book:4,body:"luna",poi:"hyperion",lm:"citadel",title:"Darrow on trial",text:"After a Triumph along the Via Triumphia, the Senate condemns Darrow’s unauthorized war. Dancer reveals he refused the Ash Lord’s ceasefire, and Darrow is placed under arrest."},
 {id:"g3",book:4,body:"luna",poi:"silene",title:"Escape from Luna",text:"Darrow says goodbye to Virginia and Pax at Silene Manor and escapes Luna, accidentally killing ArchWarden Wulfgar."},
 {id:"g4",book:4,body:"mars",poi:"lagalos",title:"Camp 121",text:"The Red Hand massacres Lyria’s assimilation camp on Mars and her family dies. She jumps into the river to save Kavax au Telemanus from drowning, then enters his house’s service."},
 {id:"g5",book:4,body:"luna",poi:"hyperion",lm:"lostcity",title:"The kidnapping",text:"Ephraim’s crew downs the Telemanus shuttle and takes Pax and Electra. Lyria escapes the kidnappers through the Lost City."},
 {id:"g6",book:4,body:"earth",poi:"deepgrave",title:"Deepgrave",text:"Darrow’s team raids the prison beneath the Atlantic and frees Apollonius au Valii-Rath to lead them to the Ash Lord."},
 {id:"g7",book:4,body:"venus",poi:"gorgon",lm:"keep",title:"The Ash Lord’s end",text:"Darrow storms Gorgon Isle and finds Magnus au Grimmus dying of poison. He learns that Atalantia leads the Society and that Pax and Electra were taken. Magnus is burned alive."},
 {id:"g8",book:4,body:"io",poi:"bleeding",title:"The Bleeding Place",text:"Prisoners of the Rim, Lysander and Cassius are brought to Io. Cassius kills Bellerephon in the Bleeding Place, Lysander reveals his name, and Dido’s coup topples Romulus, who dies."},
 {id:"g9",book:4,body:"luna",poi:"endymion",title:"Endymion",text:"Ephraim frees Pax and Electra from the Duke of Hands’ vault in Endymion. When the Syndicate Queen seizes their ship, he crashes it."},
 {id:"g10",book:4,body:"io",poi:"sungrave",title:"A new alliance",text:"Lysander proposes an alliance between the Rim and the Society, and Dido accepts. Darrow returns to Mercury, where Atalantia’s forces are massacring the people."},
 /* DARK AGE */
 {id:"d1",book:5,body:"mercury",poi:"caliban",fx:"caliban",title:"Battle of Caliban",text:"While Darrow is away, Atalantia ambushes half the White Fleet in orbit over Tyche, using the sun’s radiation to blind its sensors. Wrecks fall into the Caliban Sea, and the Fear Knight takes Orion."},
 {id:"d2",book:5,body:"mercury",poi:"angelia",lm:"angelia",fx:"angelia",title:"Angelia",text:"The Fear Knight booby-traps Angelia and its reactor melts down. The linked shields of the north begin to fail."},
 {id:"d3",book:5,body:"mercury",poi:"ladon",lm:"ladon",fx:"ashrain",title:"Atalantia’s Iron Rain",text:"Atalantia launches her Iron Rain from the Annihilo. Ajax au Grimmus leads it with his Iron Leopards, and Lysander and Seraphina au Raa drop with them, diverting toward Heliopolis."},
 {id:"d4",book:5,body:"mercury",poi:"redreach",lm:"redreach",fx:"atomic",title:"Red Reach",text:"An omega-atomic strike destroys the Red Reach command center and most of the Republic’s Second Army."},
 {id:"d5",book:5,body:"mercury",poi:"caduceus",lm:"caduceus",title:"Plains of Caduceus",text:"Orion’s storms trap the Society’s landing waves on the plains, and Darrow’s Helldivers break a Votum division."},
 {id:"d6",book:5,body:"mercury",poi:"ladon",lm:"ladon",fx:"storms",title:"Operation Tartarus",text:"Darrow wakes the Storm Gods against the Iron Rain. Hypercanes and a vast sandstorm across the Ladon wreck the landing; Darrow’s forces ride the storm."},
 {id:"d7",book:5,body:"mercury",poi:"ladon",lm:"stormgod",title:"Battle of the Ladon",text:"Seraphina is killed by a rail slug at the Storm God. At a downed Storm God, Darrow maims Kalindora and burns half of Lysander’s face."},
 {id:"d8",book:5,body:"mercury",poi:"tyche",lm:"harbor",fx:"flood",title:"Tyche drowns",text:"Orion, broken by torture, drives the Storm Gods toward horizon four. Storm surges drown Tyche, and Darrow kills her with the master override. Tens of millions are dead."},
 {id:"d9",book:5,body:"mercury",poi:"erebos",lm:"erebos",title:"Lysander in the Ladon",text:"Abandoned in a sandstorm, Lysander survives the desert and is captured by the Gorgons at Erebos. Posing as “Cato,” he is sent into Heliopolis and wins over Glirastes."},
 {id:"d10",book:5,body:"mercury",poi:"heliopolis",lm:"wall",title:"Siege of Heliopolis",text:"Ajax’s siege is broken, then Atalantia’s begins. She shows Darrow footage of Dancer’s death and gives him a day to surrender."},
 {id:"d11",book:5,body:"luna",poi:"hyperion",lm:"forum",title:"Day of Red Doves",text:"Dancer is poisoned before the vote. Publius and the Vox Populi seize power, Daxo is killed, and Lilath au Faran is revealed as the Syndicate Queen. Virginia escapes, maimed."},
 {id:"d12",book:5,body:"mercury",poi:"heliopolis",lm:"hippodrome",fx:"heliofall",title:"Fall of Heliopolis",text:"Glirastes’ EMP drops the city shield and the ships above it. Lysander rides out of the Hippodrome, tramples Darrow’s men on the Via Triumphia and runs Darrow through; Cassius carries Darrow off from the Mound of Votum aboard the Archimedes."},
 {id:"d13",book:5,body:"mars",poi:"cimmeria",fx:"pandora",title:"The Pandora",text:"Volsung Fá’s Ascomanni board Victra’s flagship, the Pandora, in Mars space. Victra releases a nerve agent and escapes; her craft crashes in Cimmeria with Lyria aboard."},
 {id:"d14",book:5,body:"mars",poi:null,where:"A Red Hand mine, Mars",title:"Lyria and the Red Hand",text:"Lyria frees the child-brides of a Red Hand mine and rescues Victra. Harmony is thrown to the pitvipers."},
 {id:"d15",book:5,body:"mars",poi:"olympia",title:"Fall of the Alltribe",text:"Volsung Fá enters Olympia, kills Sefi in a duel, and kills Ephraim. Volga gives herself to Fá to save the survivors, and the Obsidians leave Mars."},
 {id:"d16",book:5,body:"earth",poi:null,title:"Earth falls",text:"Diomedes au Raa and Ajax au Grimmus seize Earth for the Rim and the Society."},
 {id:"d17",book:5,body:"mercury",poi:"heliopolis",lm:"votum",title:"Lysander’s Triumph",text:"Lysander is hailed in Heliopolis, bends the knee and proposes to Atalantia, who accepts. Kalindora confesses that Octavia was behind his mother’s death, then dies."},
 /* LIGHT BRINGER */
 {id:"l1",book:6,body:"mercury",poi:"heliopolis",lm:"bay",title:"The Lightbringer",text:"Eight months after Mercury falls, Lysander unveils the rebuilt Morning Star above Heliopolis, renamed the Lightbringer."},
 {id:"l2",book:6,body:"belt",where:"Marcher, a trash moon",title:"Marcher",text:"Darrow and barely two hundred survivors, later joined by Colloway’s two thousand, hide for months on a trash moon with the crippled Archimedes."},
 {id:"l3",book:6,body:"earth",poi:"newsparta",lm:"palace",title:"New Sparta",text:"Atalantia pressures Lysander at New Sparta, using Glirastes as leverage."},
 {id:"l3b",book:6,body:"earth",poi:"rome",title:"The Two Hundred",text:"Lysander defies Atalantia at the summit and gathers support for attacking Mars."},
 {id:"l4",book:6,body:"venus",poi:"vdocks",lm:"coliseum",fx:"venusdocks",title:"The Hanging Coliseum",text:"Darrow and Cassius are caught at Venus. Darrow loses a razor duel in the Hanging Coliseum, then Sevro blows up the dockyards and they escape."},
 {id:"l5",book:6,body:"asteroid",poi:"base",lm:"tabula",title:"The Tabula Rasa",text:"In the asteroid belt, Darrow finds Quicksilver’s secret: not a fleet, but a generation ship to carry children beyond the Solar System."},
 {id:"l6",book:6,body:"phobos",poi:"phobosport",fx:"phobosfall",title:"Fall of Phobos",text:"Mercury’s railguns batter Phobos’s defenses and Lysander rams its shield with crewless destroyers. Phobos falls; Victra and Thraxa kill Ajax."},
 {id:"l7",book:6,body:"phobos",poi:"nucleus",lm:"nucleus",title:"The Nucleus",text:"Virginia commands the defense from the Nucleus. Kavax leads a counterattack and is taken by Apollonius. Virginia frees Valdir and his Obsidians, then gives up the Phobos dockyards for safe passage to Mars."},
 {id:"l8",book:6,body:"kalyke",poi:null,fx:"kalyke",title:"Kalyke",text:"Atlas au Raa kills Dido and Helios and wrecks much of the Rim fleet, then offers Lysander the role of the Rim’s liberator."},
 {id:"l9",book:6,body:"io",poi:"sungrave",title:"Fá’s campaign",text:"Volsung Fá razes Io and enslaves its people, bombs Callisto and invades Europa. Lysander’s forces then massacre the Ascomanni and proclaim Io liberated."},
 {id:"l10",book:6,body:"europa",poi:"athena",lm:"athena",title:"The Daughters of Athena",text:"Beneath Europa’s ocean, Athena puts Darrow and Diomedes on trial, and Sevro talks her into sparing them."},
 {id:"l11",book:6,body:"jupiter",poi:null,where:"Jupiter space",title:"Death of Volsung Fá",text:"Darrow defeats Volsung Fá in a duel, and Volga kills him."},
 {id:"l12",book:6,body:"jupiter",poi:null,where:"Jupiter space",title:"Cassius",text:"Cassius and Lysander kill Atlas and Rhone. Learning that Lysander used him to win the bioweapon Eidmi, Cassius tries to destroy it, and Lysander kills him."},
 {id:"l13",book:6,body:"io",poi:"garter",fx:"garter",title:"The Sack of Demeter",text:"Lysander skips the summit, blames Cassius for an invented plot, and bombards Demeter’s Garter, the Rim’s food supply, before withdrawing to the Core with Eidmi."},
 {id:"l14",book:6,body:"jupiter",poi:null,where:"Jupiter space",title:"The Rim summit",text:"Darrow presents Fá’s head and apologizes for the Ganymede dockyards, and Diomedes is chosen to lead the Rim. Republic, Rim, Daughters and Volk leave together for Mars."}
);
Object.assign(FX_VIEW,{
 rainmerc:{view:"site",site:"helios",title:"The Rain on Mercury",sub:"The Republic’s legions fall on Helios"},
 caliban:{view:"globe",body:"mercury",title:"Battle of Caliban",sub:"Atalantia strikes the White Fleet out of the sun’s glare"},
 angelia:{view:"site",site:"helios",title:"Angelia",sub:"The Fear Knight’s trap: a city reactor melts down"},
 ashrain:{view:"site",site:"helios",title:"Atalantia’s Iron Rain",sub:"The Iron Leopards fall from the Annihilo onto Helios"},
 atomic:{view:"site",site:"helios",title:"Red Reach",sub:"An atomic blast over the northern base"},
 storms:{view:"site",site:"helios",title:"Operation Tartarus",sub:"The Storm Gods wake over the Waste of Ladon"},
 flood:{view:"site",site:"tyche",title:"Tyche Drowns",sub:"Storm surges pour over the capital"},
 heliofall:{view:"site",site:"heliopolis",title:"Fall of Heliopolis",sub:"The EMP drops the shield; Lysander rides from the Hippodrome"},
 pandora:{view:"globe",body:"mars",title:"The Pandora",sub:"Ascomanni boarding craft swarm Victra’s flagship"},
 venusdocks:{view:"site",site:"venusdocks",title:"The Venus Dockyards Burn",sub:"Sevro blows the Carthii dockyards apart"},
 phobosfall:{view:"globe",body:"phobos",title:"Fall of Phobos",sub:"Railgun slugs and crewless destroyers against the shield"},
 kalyke:{view:"globe",body:"kalyke",title:"Kalyke",sub:"Atlas turns on the Rim fleet"},
 garter:{view:"site",site:"garter",title:"The Sack of Demeter",sub:"The Lightbringer bombards the Rim’s farm belt"}
});

/* ---- 02-data-far.js ---- */
/* ===================== IO & EUROPA FROM THE LIGHT BRINGER MAPS, AND THE FAR RIM ===================== */
/* Io: the Light Bringer map draws the moon tilted, with Demeter's Garter as its equator. */
(function(){const io=POIS.io,set=(id,o)=>{const p=io.find(x=>x.id===id);if(p)Object.assign(p,o);};
  set("raaseat",{lat:17,lon:59,desc:{0:"North of the Garter, Io’s old capital and seat of House Raa.",3:"North of the Garter, Io’s old capital and seat of House Raa during the Second Moon Lord Rebellion. Romulus au Raa meets Darrow on Io in Morning Star."}});
  set("garter",{lat:0,lon:20,desc:{0:"The belt of farmland around Io’s equator, growing more than half of the Rim’s food.",6:"The belt of farmland around Io’s equator, growing more than half of the Rim’s food. In Light Bringer, Lysander bombards it."}});
  set("sungrave",{lat:-19,lon:3,desc:"Io’s most famous city, south-west of Plutus, and its capital by Iron Gold. Lysander and Cassius are brought here as prisoners."});
  set("bleeding",{lat:-15,lon:10,desc:"The dueling ground of the Raa. Cassius kills Bellerephon here in Iron Gold, and Lysander reveals who he is."});
  io.push(
   {id:"plutus",name:"Plutus",lat:9,lon:43,from:4,desc:"Just south of Nesos on the Garter’s edge: the administrative heart of the farm belt."},
   {id:"ioinst",name:"The Institute of Io",lat:78,lon:20,desc:"The Rim’s Institute, in the frozen far north at the edge of the Yellow Sea. The most brutal of them all, so cold that blood freezes before it can drip."},
   {id:"yellowsea",name:"The Yellow Sea",lat:26,lon:26,desc:"A sea of yellow dunes inside Io’s terraformed pulse shields, beneath a great black caldera."},
   {id:"dragon",name:"The Dragon Tomb",lat:44,lon:-68,from:4,desc:"Tomb of Akari au Raa, a black obelisk carved as a winged beast, eighty steps beyond the pulse shield in killing cold. Shamed Raa walk to it to die. In Iron Gold, Romulus falls seventy-one steps short."},
   {id:"nightmourn",name:"Nightmourn",lat:-20,lon:-14,from:4,desc:"City on the edge of the Waste of Karrack, south-west of Sungrave, famous for its Airdancers."},
   {id:"darkfall",name:"Darkfall",lat:-27,lon:-12,from:4,desc:"City near Nightmourn, known for its orators, sopranists and philosophers."},
   {id:"karrack",name:"Waste of Karrack",lat:-34,lon:-32,desc:"Plains of frozen sulfur crystal lit by Jupiter’s auroras, where Airdancers sail. Romulus au Raa keeps a private home here."});
})();
/* Europa: the Discordia Sea turns around The Deep. */
(function(){const eu=POIS.europa;const a=eu.find(x=>x.id==="athena");
  if(a)Object.assign(a,{name:"The Deep",lat:-6,lon:4,desc:"The refuge beneath the Discordia Sea at the eye of its great current. In Light Bringer the Daughters of Athena shelter more than seven thousand people here, and Athena puts Darrow and Diomedes on trial."});
  const M=" Named on the Light Bringer map.";
  eu.push(
   {id:"discordia",name:"Discordia Sea",lat:30,lon:-14,desc:"The ocean that covers almost all of Europa, some ninety kilometres deep. Its storms raise ten-metre waves."},
   {id:"nyad",name:"Nyad Isles",lat:14,lon:31,desc:"An equatorial island chain in the Discordia Sea."+M},
   {id:"nixian",name:"Nixian Isles",lat:-5,lon:-45,desc:"Island chain west of The Deep."+M},
   {id:"harmonia",name:"Harmonia",lat:58,lon:-52,desc:"A city of the far north."+M},
   {id:"heraklion",name:"Heraklion",lat:28,lon:50,desc:"A city on Europa’s eastern seas."+M},
   {id:"oceanus",name:"Oceanus",lat:-22,lon:-52,desc:"A city of the warmer southern archipelagos, where hurricanes come."+M},
   {id:"psychonas",name:"Psychonas",lat:-60,lon:-9,desc:"A city of the southern mountains."+M});
})();

/* ---- the far Rim ---- */
const _FAR=[
 {id:"rhea",name:"Rhea",parent:"saturn",kind:"callisto",a:6.2,size:.26,period:16,phase:.4,group:"Saturn",moon:true,epithet:"A moon of Saturn",control:"Unknown",
  blurb:"Once the seat of the Rim’s government.",sw:"#5a524c",
  facts:[["Burned","701 PCE, First Moon Lord Rebellion"],["Ordered by","Sovereign Octavia au Lune"],["Carried out by","Magnus au Grimmus, the Ash Lord"],["Dead","About 60 million"]]},
 {id:"uranus",name:"Uranus",parent:"sun",kind:"saturn",a:92,size:1.55,period:330,phase:.7,group:"Uranus",epithet:"Ice giant of the outer dark",control:"Unknown",
  blurb:"The ice giant beyond Saturn. The books barely mention it; it is shown here to complete the Solar System.",sw:"#9fd6dc"},
 {id:"neptune",name:"Neptune",parent:"sun",kind:"saturn",a:112,size:1.5,period:430,phase:.08,group:"Neptune",epithet:"Ice giant at the Society’s edge",control:"The Society",
  blurb:"The last giant world. Its moon Triton is being terraformed by Lovelock Engines at its poles.",sw:"#4f7cf0"},
 {id:"triton",name:"Triton",parent:"neptune",kind:"callisto",a:3.6,size:.27,period:12,phase:.3,group:"Neptune",moon:true,epithet:"Lovelock moon",control:"The Society",
  blurb:"Neptune’s great moon, warmed by Lovelock Engines at both poles. In the Sons of Ares comics, Fitchner au Barca governs it after a quake throws the northern engine into the sea.",sw:"#c9d4dc"},
 {id:"pluto",name:"Pluto",parent:"sun",kind:"callisto",a:130,size:.3,period:560,phase:.5,group:"Kuiper",epithet:"A world under construction",control:"The Society’s frontier",
  blurb:"Months from the Core and still being terraformed: domes and shield lattices creep across the great heart-shaped plain.",sw:"#d8c8b0"}
];
BODIES.splice(BODIES.findIndex(b=>b.id==="saturn")+1,0,..._FAR);

/* ---- the rest of the verified Solar System (real astronomy, not from the saga) ---- */
(function(){
  const X=o=>Object.assign({control:"—",real:true,kind:"callisto"},o);
  const after=(id,list)=>{const i=BODIES.findIndex(b=>b.id===id);BODIES.splice(i+1,0,...list);};
  const before=(id,list)=>{const i=BODIES.findIndex(b=>b.id===id);BODIES.splice(i,0,...list);};
  const NS=" Not part of the saga; shown to complete the Solar System.";
  after("phobos",[X({id:"deimos",name:"Deimos",parent:"mars",kind:"phobos",a:2.7,size:.14,period:7,phase:.6,group:"Mars",moon:true,cls:"Moon of Mars",epithet:"The outer moon of Mars",sw:"#8c7f72",
    blurb:"The smaller and more distant of Mars’s two moons, about 12 km across. It circles Mars every 30 hours, and dust has filled its craters so it looks almost smooth."+NS})]);
  before("jupiter",[
    X({id:"ceres",name:"Ceres",parent:"sun",a:39.6,size:.24,period:58,phase:.15,inc:10.6,group:"Belt",cls:"Dwarf planet",epithet:"Largest world of the asteroid belt",sw:"#8a8580",
      blurb:"The largest object in the asteroid belt and the closest dwarf planet to the Sun, about 940 km across. NASA’s Dawn orbited it from 2015 to 2018 and found bright salt deposits in Occator crater, left by brine from below. Giuseppe Piazzi discovered it in 1801."+NS}),
    X({id:"vesta",name:"Vesta",parent:"sun",a:38.3,size:.17,period:45,phase:.7,inc:7.1,group:"Belt",cls:"Asteroid",epithet:"Second-largest body in the belt",sw:"#9a9188",
      blurb:"About 525 km across. Its south pole is the giant impact basin Rheasilvia, whose central peak is about twice the height of Everest. Dawn orbited it in 2011 and 2012."+NS}),
    X({id:"pallas",name:"Pallas",parent:"sun",a:40.4,size:.16,period:58,phase:.42,inc:34.8,node:173,group:"Belt",cls:"Asteroid",epithet:"The steeply tilted asteroid",sw:"#80808a",
      blurb:"A large asteroid about 510 km across, discovered in 1802. Its orbit is tilted about 35° to the plane of the planets. No spacecraft has visited it; its surface here is an artist’s impression from telescope colors."+NS}),
    X({id:"hygiea",name:"Hygiea",parent:"sun",a:41.8,size:.14,period:70,phase:.88,inc:3.8,group:"Belt",cls:"Dwarf planet candidate",epithet:"A dark, nearly round asteroid",sw:"#5a5856",
      blurb:"The fourth-largest asteroid, about 430 km across and nearly round, which makes it a dwarf planet candidate. One of the darkest large bodies in the belt. Never visited; artist’s impression."+NS})]);
  const rhea=BODIES.find(b=>b.id==="rhea");rhea.a=7.75;rhea.inc=21.8;
  after("saturn",[
    X({id:"mimas",name:"Mimas",parent:"saturn",a:5.4,size:.12,period:3,phase:.1,inc:21.8,group:"Saturn",moon:true,cls:"Moon of Saturn",epithet:"The moon with one giant crater",sw:"#c8c8c8",
      blurb:"Saturn’s smallest round moon, about 396 km across. The crater Herschel, 130 km wide, spans nearly a third of its face."+NS}),
    X({id:"enceladus",name:"Enceladus",parent:"saturn",a:5.85,size:.13,period:4,phase:.55,inc:21.8,group:"Saturn",moon:true,cls:"Moon of Saturn",epithet:"Ice moon with geysers",sw:"#f0f4f6",
      blurb:"A 500 km ice moon with a salty ocean under its crust. Jets of water vapor and ice spray from the ‘tiger stripe’ cracks at its south pole and feed Saturn’s E ring. Cassini flew through the plumes."+NS}),
    X({id:"tethys",name:"Tethys",parent:"saturn",a:6.45,size:.17,period:5,phase:.3,inc:21.8,group:"Saturn",moon:true,cls:"Moon of Saturn",epithet:"Icy moon of Saturn",sw:"#e4e4e2",
      blurb:"About 1,060 km across, marked by the 400 km crater Odysseus and the long canyon Ithaca Chasma."+NS}),
    X({id:"dione",name:"Dione",parent:"saturn",a:7.05,size:.18,period:6.5,phase:.8,inc:21.8,group:"Saturn",moon:true,cls:"Moon of Saturn",epithet:"Moon of ice cliffs",sw:"#d8d6d2",
      blurb:"About 1,120 km across. Its bright ‘wispy’ streaks turned out to be ice cliffs hundreds of meters high."+NS})]);
  after("rhea",[
    X({id:"titan",name:"Titan",parent:"saturn",a:9.7,size:.36,period:20,phase:.2,inc:21.8,group:"Saturn",moon:true,cls:"Moon of Saturn",epithet:"The hazy giant moon",sw:"#d89a4a",
      blurb:"Saturn’s largest moon, 5,150 km across and bigger than Mercury. A thick nitrogen atmosphere hides the ground, where methane rains into lakes and seas. The Huygens probe landed there in 2005."+NS}),
    X({id:"iapetus",name:"Iapetus",parent:"saturn",a:12.6,size:.2,period:40,phase:.65,inc:29,group:"Saturn",moon:true,cls:"Moon of Saturn",epithet:"The two-toned moon",sw:"#8a8478",
      blurb:"About 1,470 km across. One hemisphere is dark as coal, the other bright as snow, and a ridge up to 20 km high runs along much of its equator."+NS})]);
  const UI=97.8;
  after("uranus",[
    X({id:"miranda",name:"Miranda",parent:"uranus",a:2.6,size:.11,period:3,phase:.2,inc:UI,group:"Uranus",moon:true,cls:"Moon of Uranus",epithet:"The patchwork moon",sw:"#b0b0b4",
      blurb:"The smallest of Uranus’s five major moons, about 470 km across, with jumbled terrain and Verona Rupes, a cliff around 20 km high. Voyager 2 saw only its southern half in 1986; the rest of this map is filled in."+NS}),
    X({id:"ariel",name:"Ariel",parent:"uranus",a:3.2,size:.16,period:4.5,phase:.6,inc:UI,group:"Uranus",moon:true,cls:"Moon of Uranus",epithet:"Brightest moon of Uranus",sw:"#b6b4b2",
      blurb:"About 1,160 km across and crossed by long rift valleys. Voyager 2 imaged part of it in 1986; the unseen half here is filled in."+NS}),
    X({id:"umbriel",name:"Umbriel",parent:"uranus",a:3.85,size:.16,period:6,phase:.05,inc:UI,group:"Uranus",moon:true,cls:"Moon of Uranus",epithet:"Darkest moon of Uranus",sw:"#787674",
      blurb:"About 1,170 km across and the darkest of Uranus’s major moons, with a bright ring, Wunda, near its equator. Only partly imaged by Voyager 2."+NS}),
    X({id:"titania",name:"Titania",parent:"uranus",a:4.65,size:.2,period:9,phase:.4,inc:UI,group:"Uranus",moon:true,cls:"Moon of Uranus",epithet:"Largest moon of Uranus",sw:"#aaa096",
      blurb:"About 1,580 km across, cut by huge fault canyons. Only partly imaged by Voyager 2."+NS}),
    X({id:"oberon",name:"Oberon",parent:"uranus",a:5.45,size:.2,period:12,phase:.75,inc:UI,group:"Uranus",moon:true,cls:"Moon of Uranus",epithet:"Outermost major moon of Uranus",sw:"#a09187",
      blurb:"About 1,520 km across and heavily cratered. Only partly imaged by Voyager 2."+NS})]);
  after("pluto",[
    X({id:"charon",name:"Charon",parent:"pluto",a:.95,size:.16,period:4,phase:.3,group:"Kuiper",moon:true,cls:"Moon of Pluto",epithet:"Pluto’s twin",sw:"#9a9590",
      blurb:"Pluto’s largest moon, about 1,210 km across, half Pluto’s size. The two are tidally locked face to face. New Horizons photographed its reddish north pole, Mordor Macula, in 2015."+NS}),
    X({id:"styx",name:"Styx",parent:"pluto",kind:"phobos",a:2.1,size:.05,period:13,phase:.15,group:"Kuiper",moon:true,cls:"Moon of Pluto",epithet:"Pluto’s smallest moon",sw:"#9a9894",shape:[1,.56,.5],
      blurb:"Pluto’s smallest known moon, roughly 16 km long. The Hubble Space Telescope found it in 2012, while scientists were checking the path ahead of New Horizons."+NS}),
    X({id:"nix",name:"Nix",parent:"pluto",kind:"phobos",a:2.35,size:.07,period:16,phase:.55,group:"Kuiper",moon:true,cls:"Moon of Pluto",epithet:"Tumbling moon of Pluto",sw:"#c8c4bc",shape:[1,.7,.66],
      blurb:"About 50 km long, found by Hubble in 2005 along with Hydra. It tumbles chaotically instead of keeping one face toward Pluto, and New Horizons saw a reddish crater on it in 2015."+NS}),
    X({id:"kerberos",name:"Kerberos",parent:"pluto",kind:"phobos",a:2.8,size:.05,period:21,phase:.8,group:"Kuiper",moon:true,cls:"Moon of Pluto",epithet:"The double-lobed moon",sw:"#b8b6b2",shape:[1,.52,.48],
      blurb:"About 19 km long, found by Hubble in 2011. New Horizons showed it is made of two lobes stuck together, with a bright, icy surface."+NS}),
    X({id:"hydra",name:"Hydra",parent:"pluto",kind:"phobos",a:3.1,size:.07,period:25,phase:.35,group:"Kuiper",moon:true,cls:"Moon of Pluto",epithet:"Pluto’s outermost moon",sw:"#d8d8dc",shape:[1,.7,.6],
      blurb:"Pluto’s outermost known moon, about 51 km long, coated in bright water ice. Like Nix, it tumbles as it orbits."+NS}),
    X({id:"orcus",name:"Orcus",parent:"sun",a:129,size:.17,period:560,phase:0,inc:20.6,group:"Kuiper",cls:"Dwarf planet candidate",epithet:"The anti-Pluto",sw:"#9696a0",
      blurb:"About 900 km across. It shares Pluto’s 2:3 resonance with Neptune but stays on the opposite side of its orbit, earning the nickname ‘anti-Pluto’. Its moon is Vanth. Never photographed up close; artist’s impression."+NS}),
    X({id:"haumea",name:"Haumea",parent:"sun",a:141,size:.24,period:600,phase:.33,inc:28.2,node:122,ecc:.19,peri:240,group:"Kuiper",cls:"Dwarf planet",epithet:"The spinning egg",sw:"#e8eaee",
      blurb:"An egg-shaped dwarf planet about 2,100 km long that spins once every 4 hours, among the fastest of any large body. A thin ring was found around it in 2017. Its moons are Hiʻiaka and Namaka. Artist’s impression."+NS}),
    X({id:"quaoar",name:"Quaoar",parent:"sun",a:143,size:.19,period:610,phase:.72,inc:8,ecc:.04,peri:155,group:"Kuiper",cls:"Dwarf planet candidate",epithet:"The ringed world",sw:"#a87c68",
      blurb:"About 1,100 km across. In 2023 astronomers found a ring around it far beyond the distance where rings were thought able to survive. Its moon is Weywot. Artist’s impression."+NS}),
    X({id:"makemake",name:"Makemake",parent:"sun",a:146,size:.22,period:630,phase:.12,inc:29,ecc:.16,node:79,peri:296,group:"Kuiper",cls:"Dwarf planet",epithet:"Red world of methane ice",sw:"#c4926e",
      blurb:"A dwarf planet about 1,430 km across, reddish and coated in methane ice, named for the creator god of the Rapa Nui people. A small moon was found in 2016. Artist’s impression."+NS}),
    X({id:"gonggong",name:"Gonggong",parent:"sun",a:175,size:.21,period:1100,phase:.58,inc:30.6,ecc:.5,node:337,peri:207,group:"Scattered",cls:"Dwarf planet candidate",epithet:"One of the reddest worlds",sw:"#a86048",
      blurb:"About 1,230 km across and one of the reddest bodies in the Solar System, on a long, tilted orbit through the scattered disc. Named in 2020 for a Chinese water god; its moon is Xiangliu. Artist’s impression."+NS}),
    X({id:"eris",name:"Eris",parent:"sun",a:182,size:.3,period:1150,phase:.85,inc:44,ecc:.44,node:36,peri:151,group:"Scattered",cls:"Dwarf planet",epithet:"The most massive dwarf planet",sw:"#e2e0dc",
      blurb:"Slightly smaller than Pluto but about 27% heavier. Its discovery in 2005 led the IAU to define ‘planet’ in 2006, which reclassified Pluto. Its orbit is tilted 44° and takes about 560 years. Its moon is Dysnomia. Artist’s impression."+NS}),
    X({id:"sedna",name:"Sedna",parent:"sun",a:330,size:.19,period:4000,phase:.02,inc:12,ecc:.5,node:144,peri:311,group:"Scattered",cls:"Dwarf planet candidate",epithet:"The most distant red world",sw:"#b6563e",
      blurb:"One of the reddest and most remote known bodies. Its orbit never comes closer than about 76 AU from the Sun and swings out to roughly 900 AU, taking around 11,000 years. Drawn here far closer than its true distance. Artist’s impression."+NS}),
    X({id:"halley",name:"Halley’s Comet",parent:"sun",kind:"phobos",a:66,size:.1,period:900,phase:.08,inc:162,ecc:.8,node:58,peri:112,group:"Comets",cls:"Comet",epithet:"Returns every 75–76 years",sw:"#9ab8d0",
      blurb:"The best-known periodic comet. Its nucleus is about 15 km long and darker than coal; ESA’s Giotto photographed it in 1986. It dips inside Venus’s orbit and swings out past Neptune’s, moving backward against the planets. Next return: 2061."+NS})]);
  BODIES.find(b=>b.id==="triton").retro=true;
})();

POIS.rhea=[{id:"rheacities",name:"The burned cities",lat:8,lon:12,desc:{0:"Glass craters where the Rim’s capital stood.",2:"Glass craters where the Rim’s capital stood. The ArchGovernor of Rhea died in the burning, after striking the Ash Lord with his scepter for urging him to submit."}}];
POIS.triton=[{id:"lovelockn",name:"North Lovelock Engine",lat:84,lon:0,desc:"One of the two pole engines warming Triton. In the Sons of Ares comics a geyser quake throws it into the sea."},
 {id:"lovelocks",name:"South Lovelock Engine",lat:-84,lon:0,desc:"The southern pole engine."},
 {id:"cryssos",name:"Cryssos",lat:28,lon:-60,desc:"A Red settlement on Triton, home of Bryn, in the Sons of Ares comics."}];
POIS.pluto=[{id:"heart",name:"The terraforming works",lat:22,lon:-178,desc:"The great plain where Pluto’s terraforming has begun: seas, domes and shield lattices, still under construction."}];
POIS.neptune=[];POIS.uranus=[];
EVENTS.push(
 {id:"r1",book:2,body:"rhea",poi:"rheacities",title:"Memory of Rhea",text:"Golden Son recalls how Rhea burned in 701 PCE: on Octavia’s order, the Ash Lord’s fleet ended the First Moon Lord Rebellion by killing some sixty million people. The Rim never forgets."},
 {id:"r2",book:3,body:"rhea",poi:"rheacities",title:"Never again",text:"Darrow reveals that Octavia has stockpiled warheads to burn the Rim again, and the memory of Rhea helps bring the Moon Lords into the fight against her."},
 {id:"r3",book:2,body:"pluto",poi:"heart",title:"Exiled to Pluto",text:"Sevro and the Howlers are posted to distant Pluto, keeping them from Darrow, before they return for the Summit on Luna."}
);

/* ---- 09-index.js ---- */

/* lore-corrections IR3: later-book text moved out of base blurbs (book-I-safe base) */
[["jupiter",2,{"blurb": "Its moons hold the Raa family seat, Lorn’s retreat, and the great shipyards of Ganymede."}],["jupiter",3,{"blurb": "Its moons hold the Raa family seat, Lorn’s retreat, and the great shipyards of Ganymede. The decisive fleet battle of Morning Star is fought in its space."}],["io",3,{"blurb": "Volcanic moon ruled by House Raa. Romulus au Raa negotiates with Darrow here, and the Rim chooses its side."}],["europa",2,{"blurb": "The ice moon where Lorn au Arcos withdrew from war to raise his grandchildren. Darrow comes here to bring him back."}],["ganymede",2,{"blurb": "Home to the Society’s great dockyards. Pliny springs his trap here in Golden Son."}],["ganymede",3,{"blurb": "Home to the Society’s great dockyards. Pliny springs his trap here in Golden Son, and the yards burn in Morning Star.", "control": "The Society, then the Rim"}],["kalyke",6,{"blurb": "A small, distant moon of Jupiter. In Light Bringer it becomes a slaughterhouse: Atlas au Raa kills Dido and Helios here and wrecks much of the Rim fleet."}],["neptune",2,{"blurb": "The last giant world. Its moon Triton is being terraformed by Lovelock Engines at its poles, and the Sons of Ares keep bases there by Golden Son."}],["triton",2,{"blurb": "Neptune’s great moon, warmed by Lovelock Engines at both poles. In the Sons of Ares comics, Fitchner au Barca governs it after a quake throws the northern engine into the sea. Its ArchGoverness is killed at the Gala Massacre in Golden Son."}],["pluto",2,{"blurb": "Months from the Core and still being terraformed: domes and shield lattices creep across the great heart-shaped plain. In Golden Son, Sevro and the Howlers are posted out here, far from Darrow."}],["asteroid",6,{"blurb": "A rock in the asteroid belt, hollowed out in secret. In Light Bringer, Darrow finds that Quicksilver has built no fleet here, but a generation ship, the Tabula Rasa, to carry children beyond the Solar System.", "epithet": "Quicksilver’s hidden base", "control": "Quicksilver"}],["rhea",2,{"blurb": "Once the seat of the Rim’s government. When the Moon Lords rose against Octavia au Lune, the Ash Lord’s fleet burned Rhea with atomics and some sixty million died. The Rim has remembered ever since.", "epithet": "The burned moon", "control": "Dead since 701 PCE"}]].forEach(([id,k,o])=>{const b=BODIES.find(x=>x.id===id);if(!b)return;b.eras=b.eras||{};b.eras[k]=Object.assign({},b.eras[k]||{},o);});
/* ===================== INDEXES & ERAS ===================== */
const byId={}; BODIES.forEach(b=>byId[b.id]=b);
const poiById={}; Object.keys(POIS).forEach(k=>POIS[k].forEach(p=>{p.body=k;poiById[k+":"+p.id]=p;}));
const EV=Object.fromEntries(EVENTS.map(e=>[e.id,e]));
function placeName(ev){ if(ev.where)return ev.where; if(ev.poi){const p=poiById[ev.body+":"+ev.poi]; return p?p.name:byId[ev.body].name;} return byId[ev.body].name; }
function eventsFor(bodyId,poiId){ return EVENTS.filter(e=>e.body===bodyId&&(poiId===undefined||e.poi===poiId)); }
const SITES={}; /* filled by the site modules */

/* the world state follows the selected book; "All" shows the latest */
/* spoiler-safe start: open on Book I unless the reader explicitly chose another book (or All) before.
   The choice is remembered per atlas in this browser only; storage can be unavailable, so every access is guarded. */
const BOOK_KEY="atlas-book:society";
function storedBook(){try{const v=localStorage.getItem(BOOK_KEY);if(v!=null&&/^[0-6]$/.test(v))return +v;}catch(e){}return 1;}
function saveBook(b){try{localStorage.setItem(BOOK_KEY,String(b));}catch(e){}}
const START_BOOK=storedBook();
let ERA=START_BOOK||6;
function eraVal(v){if(v==null||typeof v!=="object"||Array.isArray(v))return v;let best=null,bk=-1;Object.keys(v).forEach(k=>{const n=+k;if(n<=ERA&&n>bk){bk=n;best=v[k];}});
  if(best==null){const ks=Object.keys(v).map(Number).sort((a,b)=>a-b);best=v[ks[0]];}return best;}
function bodyF(b,f){return eraVal(b.eras?Object.fromEntries(Object.entries(b.eras).filter(([k,o])=>o[f]!=null).map(([k,o])=>[k,o[f]]).concat([[0,b[f]]])):b[f]);}
function poiVisible(p){return (p.from==null||ERA>=p.from)&&(p.until==null||ERA<=p.until);}
function poiDesc(p){return eraVal(p.desc);}
function siteF(S,f){return S.eras?eraVal(Object.fromEntries(Object.entries(S.eras).filter(([k,o])=>o[f]!=null).map(([k,o])=>[k,o[f]]).concat([[0,S[f]]]))):S[f];}

/* ---- 10-noise.js ---- */
/* ===================== NOISE & TEXTURES ===================== */
function makeNoise(seed){
  const h=(x,y,z)=>{let n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(z|0,1274126177)^Math.imul(seed,362437);
    n=Math.imul(n^(n>>>13),1274126177); n^=n>>>16; return (n>>>0)/4294967296;};
  const s=t=>t*t*(3-2*t);
  function vn(x,y,z){const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z);const u=s(x-xi),v=s(y-yi),w=s(z-zi);
    const a=h(xi,yi,zi),b=h(xi+1,yi,zi),c=h(xi,yi+1,zi),d=h(xi+1,yi+1,zi),e=h(xi,yi,zi+1),f=h(xi+1,yi,zi+1),g=h(xi,yi+1,zi+1),k=h(xi+1,yi+1,zi+1);
    const x0=a+(b-a)*u,x1=c+(d-c)*u,x2=e+(f-e)*u,x3=g+(k-g)*u;const y0=x0+(x1-x0)*v,y1=x2+(x3-x2)*v;return y0+(y1-y0)*w;}
  function f(x,y,z,o){o=o||5;let a=.5,fr=1,sum=0,nm=0;for(let i=0;i<o;i++){sum+=a*vn(x*fr+i*19.7,y*fr+i*7.3,z*fr);nm+=a;a*=.5;fr*=2.03;}
    const r=(sum/nm-.5)*2.3+.5;return r<0?0:r>1?1:r;}
  return {vn,f};
}
const cl=t=>t<0?0:t>1?1:t;
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
function ramp(st,t){t=cl(t);const n=st.length-1;const i=Math.min(n-1,Math.floor(t*n));return mix(st[i],st[i+1],t*n-i);}

const KINDS={
 sun(N,x,y,z){const n=N.f(x*3.5,y*3.5,z*3.5,4);const g=N.f(x*12,y*12,z*12,3);return {c:ramp([[230,90,20],[255,150,45],[255,205,110],[255,240,190]],n*.75+g*.3)};},
 mercury(N,x,y,z){const n=N.f(x*3,y*3,z*3);const cr=N.vn(x*16,y*16,z*16);let c=ramp([[62,56,52],[118,106,96],[168,154,138]],n);if(cr>.78)c=mix(c,[40,36,34],(cr-.78)*3);return {c};},
 venus(N,x,y,z){const w=N.f(x*2,y*2,z*2,3);const n=N.f(x*2.5+w*2,y*5+w,z*2.5,5);return {c:ramp([[160,118,62],[214,176,110],[240,218,165],[250,236,200]],n)};},
 earth(N,x,y,z,lat){const n=N.f(x*2.1,y*2.1,z*2.1,6);let c,land=false;
  if(n<.53)c=ramp([[10,26,62],[22,58,110],[44,98,140]],n/.53);else{land=true;c=ramp([[58,92,46],[96,112,62],[146,128,92],[176,160,128]],(n-.53)/.47);}
  if(Math.abs(lat)>68+n*12)c=[232,236,240];
  const k=N.f(x*3.6+11,y*5,z*3.6,4);if(k>.56)c=mix(c,[245,245,245],cl((k-.56)*2.2)*.85);
  let L=0;if(land&&N.vn(x*55,y*55,z*55)>.62)L=.9;return {c,L};},
 luna(N,x,y,z){const n=N.f(x*2.6,y*2.6,z*2.6);let c=ramp([[58,58,62],[108,106,106],[160,157,152]],n);
  const cr=N.vn(x*12,y*12,z*12);if(cr>.8)c=mix(c,[190,186,178],(cr-.8)*3);
  const grid=N.vn(x*70,y*70,z*70);const dens=N.f(x*5+3,y*5,z*5,3);let L=0;if(grid>.55&&dens>.35)L=.55+(grid-.55)*1.4;return {c,L};},
 mars(N,x,y,z,lat){const n=N.f(x*2.3,y*2.3,z*2.3,6);const m=N.f(x*4+5,y*4,z*4,4);
  let c=ramp([[118,48,28],[168,70,38],[202,108,62],[220,150,104]],n);
  if(n<.34)c=mix([36,74,82],[56,96,96],n/.34);
  else if(m>.66&&Math.abs(lat)<55)c=mix(c,[92,104,58],cl((m-.66)*2.6)*.75);
  if(Math.abs(lat)>74+n*8)c=[236,232,226];
  let L=0;if(n>.4&&N.vn(x*60,y*60,z*60)>.8)L=.7;return {c,L};},
 phobos(N,x,y,z){const n=N.f(x*3,y*3,z*3);const cr=N.vn(x*10,y*10,z*10);let c=ramp([[70,60,54],[120,106,94],[150,136,120]],n);if(cr>.74)c=mix(c,[44,38,34],(cr-.74)*2.5);
  let L=0;if(N.vn(x*45,y*45,z*45)>.7&&n>.45)L=.8;return {c,L};},
 jupiter(N,x,y,z,lat){const t=lat/90;const w=t*7+(N.f(x*3,y*9,z*3,4)-.5)*1.1;const b=.5+.5*Math.sin(w*3.3);
  let c=ramp([[128,86,60],[188,140,100],[222,196,160],[240,228,206]],b);const sp=N.f(x*6,y*6,z*6,3);if(sp>.75)c=mix(c,[176,92,62],(sp-.75)*2.5);return {c};},
 saturn(N,x,y,z,lat){const t=lat/90;const w=t*9+(N.f(x*3,y*10,z*3,3)-.5)*.6;const b=.5+.5*Math.sin(w*3);return {c:ramp([[176,150,104],[210,188,140],[234,222,186]],b)};},
 io(N,x,y,z){const n=N.f(x*3,y*3,z*3);let c=ramp([[176,140,40],[222,196,86],[238,228,156]],n);const sp=N.vn(x*9,y*9,z*9);if(sp>.78)c=mix(c,[120,40,24],(sp-.78)*3.5);return {c};},
 europa(N,x,y,z){const n=N.f(x*2,y*2,z*2);let c=ramp([[196,186,170],[226,220,206],[238,234,226]],n);const r=1-Math.abs(N.vn(x*5,y*5,z*5)*2-1);if(r>.9)c=mix(c,[150,96,64],(r-.9)*8);return {c};},
 ganymede(N,x,y,z){const n=N.f(x*2.6,y*2.6,z*2.6);return {c:ramp([[78,72,66],[128,118,104],[184,174,160]],n)};},
 callisto(N,x,y,z){const n=N.f(x*3,y*3,z*3);let c=ramp([[40,36,33],[78,70,62],[104,94,84]],n);if(N.vn(x*30,y*30,z*30)>.86)c=[200,196,188];return {c};}
};

const texCache={};
function genTex(body,W,H){
  const key=body.id+W;if(texCache[key])return texCache[key];
  const fn=KINDS[body.kind];const N=makeNoise(body.id.length*977+body.id.charCodeAt(0)*31);
  const cv=document.createElement("canvas");cv.width=W;cv.height=H;const ctx=cv.getContext("2d");const img=ctx.createImageData(W,H);
  let ecv=null,ectx=null,eimg=null,hasL=false;
  const TAU=Math.PI*2;
  for(let j=0;j<H;j++){const v=(j+.5)/H,sv=Math.sin(Math.PI*v),y=Math.cos(Math.PI*v),lat=90-v*180;
    for(let i=0;i<W;i++){const u=(i+.5)/W;const x=-Math.cos(TAU*u)*sv,z=Math.sin(TAU*u)*sv;
      const r=fn(N,x,y,z,lat);const o=(j*W+i)*4;img.data[o]=r.c[0];img.data[o+1]=r.c[1];img.data[o+2]=r.c[2];img.data[o+3]=255;
      if(r.L){if(!eimg){ecv=document.createElement("canvas");ecv.width=W;ecv.height=H;ectx=ecv.getContext("2d");eimg=ectx.createImageData(W,H);}
        hasL=true;eimg.data[o]=255*r.L;eimg.data[o+1]=178*r.L;eimg.data[o+2]=96*r.L;eimg.data[o+3]=255;}
    }}
  ctx.putImageData(img,0,0);
  const out={map:new THREE.CanvasTexture(cv)};
  if(hasL){for(let o=3;o<eimg.data.length;o+=4)eimg.data[o]=255;ectx.putImageData(eimg,0,0);out.emissive=new THREE.CanvasTexture(ecv);}
  texCache[key]=out;return out;
}
function glowTexture(stops){const cv=document.createElement("canvas");cv.width=cv.height=128;const g=cv.getContext("2d");const gr=g.createRadialGradient(64,64,0,64,64,64);
  stops.forEach(s=>gr.addColorStop(s[0],s[1]));g.fillStyle=gr;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(cv);}


/* ---- 20-core.js ---- */
/* ===================== HELPERS ===================== */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const col=h=>new THREE.Color(h).convertSRGBToLinear();
const TAU=Math.PI*2;
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function rng(seed){let s=seed>>>0||1;return()=>{s=Math.imul(s^(s>>>15),2246822507);s=Math.imul(s^(s>>>13),3266489909);s^=s>>>16;return (s>>>0)/4294967296;};}
function srgbTex(t){if(t){t.encoding=THREE.sRGBEncoding;}return t;}

/* ===================== RENDERER ===================== */
const canvas=$("#c");
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.setClearColor(col(0x07060a),1);
const MAX_ANISO=Math.min(8,renderer.capabilities.getMaxAnisotropy());

const sys=new THREE.Scene();
const camS=new THREE.PerspectiveCamera(42,1,.05,3000);
const glb=new THREE.Scene();
const camG=new THREE.PerspectiveCamera(36,1,.01,1000);
camG.position.set(0,0,12.5);

function glowTexture(stops){const cv=document.createElement("canvas");cv.width=cv.height=128;const g=cv.getContext("2d");const gr=g.createRadialGradient(64,64,0,64,64,64);
  stops.forEach(s=>gr.addColorStop(s[0],s[1]));g.fillStyle=gr;g.fillRect(0,0,128,128);return srgbTex(new THREE.CanvasTexture(cv));}
const GLOW_WARM=glowTexture([[0,"rgba(255,226,170,1)"],[.2,"rgba(255,170,80,.55)"],[.5,"rgba(220,90,30,.12)"],[1,"rgba(0,0,0,0)"]]);
const GLOW_WHITE=glowTexture([[0,"rgba(255,255,255,1)"],[.25,"rgba(255,240,210,.5)"],[1,"rgba(0,0,0,0)"]]);
const GLOW_BLUE=glowTexture([[0,"rgba(220,240,255,1)"],[.25,"rgba(120,180,255,.5)"],[1,"rgba(0,0,0,0)"]]);
const GLOW_RED=glowTexture([[0,"rgba(255,220,180,1)"],[.2,"rgba(255,90,40,.6)"],[.55,"rgba(160,30,10,.15)"],[1,"rgba(0,0,0,0)"]]);
function glowSprite(tex,scale,opacity){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:opacity==null?1:opacity}));s.scale.set(scale,scale,1);return s;}

function stars(scene,n,r,size){const g=new THREE.BufferGeometry();const p=new Float32Array(n*3),c=new Float32Array(n*3);const R=rng(n);
  for(let i=0;i<n;i++){const u=R()*2-1,t=R()*TAU,s=Math.sqrt(1-u*u);const rr=r*(.85+R()*.3);
    p[i*3]=s*Math.cos(t)*rr;p[i*3+1]=u*rr;p[i*3+2]=s*Math.sin(t)*rr;const w=Math.pow(R(),2.2)*.9+.08,warm=R()<.3;
    c[i*3]=w;c[i*3+1]=w*(warm?.82:.95);c[i*3+2]=w*(warm?.66:1);}
  g.setAttribute("position",new THREE.BufferAttribute(p,3));g.setAttribute("color",new THREE.BufferAttribute(c,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({size:size||1.7,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:.95,depthWrite:false}));scene.add(pts);return pts;}
/* a faint band of the Milky Way */
function milkyWay(scene,r){const n=9000,g=new THREE.BufferGeometry(),p=new Float32Array(n*3),c=new Float32Array(n*3);const R=rng(77);
  const tilt=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(.9,.3,.4));const v=new THREE.Vector3();
  for(let i=0;i<n;i++){const a=R()*TAU;const spread=(R()+R()+R()-1.5)*.16;v.set(Math.cos(a),spread,Math.sin(a)).normalize().multiplyScalar(r).applyMatrix4(tilt);
    p[i*3]=v.x;p[i*3+1]=v.y;p[i*3+2]=v.z;const w=.08+R()*.22;c[i*3]=w;c[i*3+1]=w*.92;c[i*3+2]=w*.85;}
  g.setAttribute("position",new THREE.BufferAttribute(p,3));g.setAttribute("color",new THREE.BufferAttribute(c,3));
  scene.add(new THREE.Points(g,new THREE.PointsMaterial({size:1.2,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:.8,depthWrite:false})));}
stars(sys,3600,2300);milkyWay(sys,2250);stars(glb,2200,400);milkyWay(glb,390);

/* ===================== MATERIALS ===================== */
/* city lights glow only on each world's night side */
const SUN_U={sys:{value:new THREE.Vector3()},glb:{value:new THREE.Vector3()}};
function nightOnly(m,tag){m.onBeforeCompile=sh=>{sh.uniforms.uSunView=SUN_U[tag];
  sh.fragmentShader="uniform vec3 uSunView;\n"+sh.fragmentShader.replace("#include <emissivemap_fragment>","#include <emissivemap_fragment>\n{vec3 sd=normalize(uSunView+vViewPosition);float ndl=dot(normalize(vNormal),sd);totalEmissiveRadiance*=1.0-smoothstep(-0.14,0.2,ndl);}");};
  m.customProgramCacheKey=()=>"night";}
function makeMat(b,t,tag){
  if(b.kind==="sun")return new THREE.MeshBasicMaterial({map:t.map,color:col(0xffffff)});
  const m=new THREE.MeshPhongMaterial({map:t.map,shininess:t.spec?70:5,specular:col(t.spec?0x4a4038:0x0c0b0a)});
  if(t.spec)m.specularMap=t.spec;
  if(t.normal){m.normalMap=t.normal;m.normalScale=new THREE.Vector2(.9,.9);}
  if(t.lights){m.emissiveMap=t.lights;m.emissive=col(0xffffff);m.emissiveIntensity=tag==="sys"?1.6:1.45;nightOnly(m,tag);}
  return m;}
function procSet(b,W,H){const t=genTex(b,W,H);srgbTex(t.map);if(t.emissive)srgbTex(t.emissive);return {map:t.map,lights:t.emissive};}
function ringGeo(inner,outer){const g=new THREE.RingGeometry(inner,outer,160,1);const pos=g.attributes.position,uv=g.attributes.uv;
  for(let i=0;i<pos.count;i++){const r=Math.hypot(pos.getX(i),pos.getY(i));uv.setXY(i,(r-inner)/(outer-inner),.5);}return g;}
function makeRing(R,tex){if(tex)return new THREE.Mesh(ringGeo(R*1.22,R*2.3),new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,depthWrite:false,color:col(0xe8e0d0)}));
  const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.RingGeometry(R*1.35,R*2.25,96),new THREE.MeshBasicMaterial({color:col(0xb8a77e),transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false})));return g;}
function makeClouds(R,tex){return new THREE.Mesh(new THREE.SphereGeometry(R*1.012,64,48),new THREE.MeshPhongMaterial({color:col(0xffffff),alphaMap:tex,transparent:true,depthWrite:false,opacity:.95,shininess:2}));}
const atmoMat=new THREE.ShaderMaterial({uniforms:{c:{value:new THREE.Color(0xd9aa52)},k:{value:1}},
  vertexShader:"varying vec3 vN;varying vec3 vV;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}",
  fragmentShader:"uniform vec3 c;uniform float k;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-max(dot(vN,vV),0.),2.4);gl_FragColor=vec4(c*f*k,f*k);}",
  transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
const ATMO={rhea:[0x6a605a,.12],uranus:[0x9fe6ee,.9],neptune:[0x5f8cff,1.0],triton:[0xc8d8e8,.35],pluto:[0xc8d8ff,.35],kalyke:[0x8a8070,.15],asteroid:[0x8a8070,.1],mercury:[0x9fd0ff,1.0],mars:[0xe8906a,.95],earth:[0x6fb0ff,1.25],venus:[0x9fd4ff,1.2],luna:[0xe0b870,.55],jupiter:[0xe8c8a0,.7],saturn:[0xe8d8a8,.6],io:[0xe8d070,.35],europa:[0x8fc8ff,.9],ganymede:[0xc8a0ff,.8],callisto:[0x8a8070,.2],phobos:[0xd0a070,.5]};
function makeAtmo(id,R,scale){const a=ATMO[id]||[0xd9aa52,.3];const am=atmoMat.clone();am.uniforms.c.value=col(a[0]);am.uniforms.k.value=a[1];
  return new THREE.Mesh(new THREE.SphereGeometry(R*scale,64,48),am);}
const REAL={};

/* ===================== SOLAR SYSTEM ===================== */
sys.add(new THREE.AmbientLight(col(0x2c2428),.9));
const sunLight=new THREE.PointLight(col(0xfff0d8),1.9,0,0);sys.add(sunLight);
const objs={};
BODIES.forEach(b=>{
  const grp=new THREE.Group();sys.add(grp);
  const seg=b.size>1.5?64:40;
  const t=procSet(b,256,128);
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(b.size,seg,seg*0.7|0),makeMat(b,t,"sys"));
  if(b.kind==="sun"){grp.add(glowSprite(GLOW_WARM,34,1));grp.add(glowSprite(GLOW_WARM,90,.18));}
  grp.add(mesh);
  let ring=null;if(b.ring){ring=makeRing(b.size,null);ring.rotation.x=-Math.PI/2+.38;grp.add(ring);}
  if(["earth","mars","venus","luna","mercury","europa","ganymede"].includes(b.id))grp.add(makeAtmo(b.id,b.size,1.06));
  const hitR=b.moon?Math.max(b.size*2.2,.55):b.kind==="sun"?b.size*1.1:b.size*1.5;
  const hit=new THREE.Mesh(new THREE.SphereGeometry(hitR,12,8),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
  hit.userData.id=b.id;grp.add(hit);
  const hr=Math.max(b.size*1.55,b.moon?.5:b.size*1.55);
  const halo=new THREE.Mesh(new THREE.RingGeometry(hr,hr+Math.max(.05,b.size*.07),64),new THREE.MeshBasicMaterial({color:col(0xd9aa52),transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));grp.add(halo);
  objs[b.id]={b,grp,mesh,hit,halo,ring,clouds:null,hlT:0,hl:0,pos:new THREE.Vector3()};
  if(b.parent){const pts=[];const N=b.moon?96:256;for(let i=0;i<=N;i++){const a=i/N*TAU;pts.push(new THREE.Vector3(Math.cos(a)*b.a,0,Math.sin(a)*b.a));}
    const line=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:col(0xd9aa52),transparent:true,opacity:b.moon?.12:.17}));
    objs[b.id].orbit=line;sys.add(line);}
});
const hitList=Object.values(objs).map(o=>o.hit);
/* asteroid belt */
const belt=(function(){const n=2400,g=new THREE.BufferGeometry(),p=new Float32Array(n*3);const R=rng(9);
  for(let i=0;i<n;i++){const a=R()*TAU,r=37+R()*5.5+Math.sin(a*3)*.6;p[i*3]=Math.cos(a)*r;p[i*3+1]=(R()-.5)*.9;p[i*3+2]=Math.sin(a)*r;}
  g.setAttribute("position",new THREE.BufferAttribute(p,3));const b=new THREE.Points(g,new THREE.PointsMaterial({color:col(0x8a7560),size:.15,transparent:true,opacity:.75}));sys.add(b);return b;})();

/* ship traffic between worlds: torchShips burning along the lanes */
const LANES=[["luna","mars"],["mars","jupiter"],["earth","mars"],["luna","venus"],["mars","phobos"],["jupiter","saturn"],["luna","mercury"],["mars","ganymede"],["io","ganymede"],["luna","jupiter"],["saturn","neptune"],["jupiter","uranus"]];
const traffic=[];
(function(){const R=rng(31);
  for(let i=0;i<38;i++){const lane=LANES[i%LANES.length];const s=glowSprite(R()<.25?GLOW_BLUE:GLOW_WARM,.9+R()*.6,.95);sys.add(s);
    const trail=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:col(0xffd9a0),transparent:true,opacity:.35}));sys.add(trail);
    traffic.push({s,trail,from:lane[R()<.5?0:1],to:null,t:R(),speed:.03+R()*.05,arc:(R()-.5)*14,lift:(R()-.5)*3,lane});}
  traffic.forEach(tr=>{tr.to=tr.lane[0]===tr.from?tr.lane[1]:tr.lane[0];});})();
const _a=new THREE.Vector3(),_b=new THREE.Vector3(),_m=new THREE.Vector3(),_p=new THREE.Vector3(),_q=new THREE.Vector3();
function lanePoint(tr,t,out){_a.copy(objs[tr.from].pos);_b.copy(objs[tr.to].pos);_m.copy(_a).add(_b).multiplyScalar(.5);
  const dx=_b.x-_a.x,dz=_b.z-_a.z;_m.x+=-dz*.0+tr.arc*Math.sign(dx||1)*.0;_m.x+= -dz/Math.hypot(dx,dz||1)*tr.arc;_m.z+=dx/Math.hypot(dx,dz||1)*tr.arc;_m.y+=tr.lift;
  const u=1-t;out.set(u*u*_a.x+2*u*t*_m.x+t*t*_b.x,u*u*_a.y+2*u*t*_m.y+t*t*_b.y,u*u*_a.z+2*u*t*_m.z+t*t*_b.z);return out;}
function updateTraffic(dt){traffic.forEach(tr=>{tr.t+=dt*tr.speed;if(tr.t>=1){tr.t=0;const f=tr.from;tr.from=tr.to;tr.to=f;}
  lanePoint(tr,tr.t,_p);lanePoint(tr,Math.max(0,tr.t-.05),_q);tr.s.position.copy(_p);
  const pa=tr.trail.geometry.attributes.position;pa.setXYZ(0,_p.x,_p.y,_p.z);pa.setXYZ(1,_q.x,_q.y,_q.z);pa.needsUpdate=true;
  const fade=Math.min(1,tr.t*8,(1-tr.t)*8);tr.s.material.opacity=.95*fade;tr.trail.material.opacity=.35*fade;});}

/* ===================== GLOBE VIEW ===================== */
const gAmb=new THREE.AmbientLight(col(0x3a3036),.55);glb.add(gAmb);
const gSun=new THREE.DirectionalLight(col(0xfff0dc),2.1);gSun.position.set(-6,3,7);glb.add(gSun);
const gSunSprite=glowSprite(GLOW_WARM,40,.55);gSunSprite.position.copy(gSun.position).multiplyScalar(30);glb.add(gSunSprite);
const globe=new THREE.Group();glb.add(globe);
let globeMesh=null,globeAtmo=null,globeRing=null,globeClouds=null,globeExtra=null,globeOrbit=null;const markers=[];
const GR=3;
function latLonVec(lat,lon,r){const v=(90-lat)/180,u=(lon+180)/360,sv=Math.sin(Math.PI*v);return new THREE.Vector3(-Math.cos(TAU*u)*sv*r,Math.cos(Math.PI*v)*r,Math.sin(TAU*u)*sv*r);}
function refreshGlobe(b){if(!globeMesh)return;const t=REAL[b.id];if(!t)return;
  globeMesh.material=makeMat(b,t,"glb");
  if(t.clouds&&!globeClouds){globeClouds=makeClouds(GR,t.clouds);globe.add(globeClouds);}
  if(b.ring&&t.ring){globe.remove(globeRing);globeRing=makeRing(GR,t.ring);globeRing.rotation.x=-Math.PI/2;globe.add(globeRing);}}
function buildGlobe(b){
  while(globe.children.length)globe.remove(globe.children[0]);markers.length=0;globeClouds=null;globeRing=null;globeExtra=null;
  const t=REAL[b.id]||procSet(b,1024,512);
  const lumpy=b.kind==="phobos";const geo=new THREE.SphereGeometry(GR,160,120);
  if(lumpy){const p=geo.attributes.position;const N=makeNoise(5);for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);const s=1+(N.f(v.x*.5+9,v.y*.5,v.z*.5,3)-.5)*.2;v.multiplyScalar(s);v.y*=.86;p.setXYZ(i,v.x,v.y,v.z);}geo.computeVertexNormals();}
  globeMesh=new THREE.Mesh(geo,makeMat(b,t,"glb"));globe.add(globeMesh);
  if(t.clouds){globeClouds=makeClouds(GR,t.clouds);globe.add(globeClouds);}
  globeAtmo=makeAtmo(b.id,GR,1.03);globe.add(globeAtmo);
  if(b.ring){globeRing=makeRing(GR,t.ring||null);globeRing.rotation.x=-Math.PI/2;globe.add(globeRing);}
  if(GLOBE_EXTRAS[b.id]){globeExtra=GLOBE_EXTRAS[b.id](globe,GR);}
  /* ship traffic in orbit */
  globeOrbit=new THREE.Group();globe.add(globeOrbit);const no={mars:30,luna:46,earth:34,ganymede:34,jupiter:24,io:12,europa:8,venus:10,mercury:8,saturn:10,callisto:6}[b.id]||0;const rr=rng(no+7);
  for(let i=0;i<no;i++){const pv=new THREE.Object3D();pv.rotation.set((rr()-.5)*1.6,rr()*TAU,(rr()-.5)*1.6);const s=glowSprite(rr()<.3?GLOW_BLUE:GLOW_WARM,.07+rr()*.06,.95);s.position.x=GR*(1.12+rr()*.5);pv.add(s);pv.userData.sp=(rr()<.5?-1:1)*(.08+rr()*.22);globeOrbit.add(pv);}
  (POIS[b.id]||[]).filter(poiVisible).forEach(p=>{const v=latLonVec(p.lat,p.lon,GR*(lumpy?1.1:1.004));
    const ring=new THREE.Mesh(new THREE.RingGeometry(.075,.095,40),new THREE.MeshBasicMaterial({color:col(0xf0c870),transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false}));
    ring.position.copy(v).multiplyScalar(1.002);ring.lookAt(v.clone().multiplyScalar(2));globe.add(ring);
    const mk=MINI[p.id]||(p.site&&!p.focus?MINI._city:null);if(mk&&!lumpy){const m=mk(p);const n=v.clone().normalize();m.position.copy(n.clone().multiplyScalar(GR*.999));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),n);globe.add(m);}
    markers.push({p,ring,local:v.clone()});});
}

/* ---------- small 3D cities that sit on the globes ---------- */
const miniStone=new THREE.MeshStandardMaterial({color:col(0xe9e1d0),roughness:.6,metalness:.1,emissive:col(0x000000)});
const miniRed=new THREE.MeshStandardMaterial({color:col(0xa8402c),roughness:.6});
const miniGold=new THREE.MeshStandardMaterial({color:col(0xd8b060),roughness:.35,metalness:.8});
const miniDark=new THREE.MeshStandardMaterial({color:col(0x3a3532),roughness:.8});
const miniLight=new THREE.MeshBasicMaterial({color:col(0xffd59a)});
function miniCity(opt){const g=new THREE.Group();const R=rng(opt.seed||1);const s=opt.scale||.12;
  for(let i=0;i<opt.n;i++){const a=R()*TAU,r=Math.pow(R(),opt.spread||.7)*s;const h=s*(opt.hmin+(opt.hmax-opt.hmin)*Math.pow(R(),3)*(1-r/s*.6));
    const w=s*(.04+R()*.05);const geo=R()<(opt.spires||0)?new THREE.ConeGeometry(w*.7,h,6):new THREE.BoxGeometry(w,h,w);
    const mat=R()<(opt.redFrac||0)?miniRed:R()<(opt.goldFrac||0)?miniGold:opt.mat||miniStone;
    const m=new THREE.Mesh(geo,mat);m.position.set(Math.cos(a)*r,h/2,Math.sin(a)*r);m.rotation.y=R()*TAU;g.add(m);
    if(R()<.5){const l=new THREE.Mesh(new THREE.BoxGeometry(w*1.02,w*.12,w*1.02),miniLight);l.position.set(m.position.x,h*(.3+R()*.5),m.position.z);g.add(l);}}
  return g;}
const MINI={
  _city:p=>miniCity({n:70,seed:p.id.length*7,scale:.11,hmin:.05,hmax:.4,spires:.3,goldFrac:.08}),
  agea:p=>{const g=miniCity({n:110,seed:3,scale:.16,hmin:.05,hmax:.55,spires:.35,redFrac:.25,goldFrac:.06,spread:.6});
    const c=new THREE.Mesh(new THREE.ConeGeometry(.012,.16,8),miniGold);c.position.y=.08;g.add(c);return g;},
  yorkton:p=>miniCity({n:70,seed:5,scale:.11,hmin:.05,hmax:.3,mat:miniDark,redFrac:.15}),
  attica:p=>miniCity({n:70,seed:7,scale:.11,hmin:.06,hmax:.4,spires:.2,goldFrac:.1}),
  hyperion:p=>{const g=miniCity({n:180,seed:11,scale:.22,hmin:.08,hmax:1.0,spires:.25,goldFrac:.08,spread:.55});
    const c=new THREE.Mesh(new THREE.CylinderGeometry(.006,.02,.42,8),miniGold);c.position.y=.21;g.add(c);return g;},
  institute:p=>{const g=new THREE.Group();const R=rng(4);for(let i=0;i<12;i++){const a=i/12*TAU+R()*.3,r=.06+R()*.06;const k=new THREE.Mesh(new THREE.BoxGeometry(.014,.02,.014),miniStone);k.position.set(Math.cos(a)*r,.01,Math.sin(a)*r);g.add(k);}return g;},
  olympus:p=>{const g=new THREE.Group();const m=new THREE.Mesh(new THREE.CylinderGeometry(.02,.03,.05,8),miniGold);m.position.y=.025;g.add(m);const l=new THREE.Mesh(new THREE.SphereGeometry(.012,8,6),miniLight);l.position.y=.06;g.add(l);return g;},
  lykos:p=>{const g=new THREE.Group();const r=new THREE.Mesh(new THREE.TorusGeometry(.03,.006,6,24),miniLight);r.rotation.x=Math.PI/2;r.position.y=.002;g.add(r);return g;},
  southpole:p=>miniCity({n:16,seed:13,scale:.07,hmin:.03,hmax:.12,mat:miniDark}),
  raaseat:p=>miniCity({n:40,seed:17,scale:.09,hmin:.04,hmax:.25,spires:.3}),
  lornhome:p=>miniCity({n:12,seed:19,scale:.05,hmin:.02,hmax:.06}),
  docks:p=>{const g=new THREE.Group();const R=rng(23);for(let i=0;i<9;i++){const f=new THREE.Mesh(new THREE.BoxGeometry(.02,.012,.16),miniDark);f.position.set((i-4)*.035,.08+R()*.04,R()*.04);g.add(f);
    const s=new THREE.Mesh(new THREE.BoxGeometry(.004,.08,.004),miniStone);s.position.set(f.position.x,.04,f.position.z);g.add(s);}return g;}
};
/* Phobos: a moon built over into a station */
const GLOBE_EXTRAS={
  ganymede:(grp,R)=>{const g=new THREE.Group();grp.add(g);
    const ring=new THREE.Mesh(new THREE.CylinderGeometry(R*1.045,R*1.045,R*.07,200,1,true),new THREE.MeshStandardMaterial({color:col(0x8a8580),roughness:.5,metalness:.6,side:THREE.DoubleSide}));g.add(ring);
    const lit=new THREE.Mesh(new THREE.TorusGeometry(R*1.047,.008,4,240),new THREE.MeshBasicMaterial({color:col(0xffd08a)}));lit.rotation.x=Math.PI/2;g.add(lit);
    for(let i=0;i<16;i++){const a=i/16*TAU;const sh=makeShip("torch",.16);sh.position.set(Math.cos(a)*R*1.12,.0,Math.sin(a)*R*1.12);sh.lookAt(0,0,0);g.add(sh);}return g;},
  luna:(grp,R)=>{const g=new THREE.Group();grp.add(g);const rr=rng(51);
    /* orbital rings of traffic and stations */
    const lamp=new THREE.MeshBasicMaterial({color:col(0xffe2b0),transparent:true,opacity:.75});
    for(let k=0;k<2;k++){const tor=new THREE.Mesh(new THREE.TorusGeometry(R*(1.28+k*.12),.006,4,240),lamp);tor.rotation.x=Math.PI/2+(k?.35:-.2);tor.rotation.y=k*.6;g.add(tor);}
    for(let i=0;i<9;i++){const a=rr()*TAU;const st=makeShip(rr()<.4?"station":"frigate",.18+rr()*.2);st.position.set(Math.cos(a)*R*1.35,(rr()-.5)*.6,Math.sin(a)*R*1.35);st.lookAt(0,0,0);g.add(st);}
    return g;}
};

/* ===================== CAMERA CONTROL ===================== */
const ctl={target:new THREE.Vector3(),r:150,theta:.55,phi:1.02,follow:null};
const home={r:150,theta:.55,phi:1.02};
function applyCam(){const sp=Math.sin(ctl.phi);camS.position.set(ctl.target.x+ctl.r*sp*Math.sin(ctl.theta),ctl.target.y+ctl.r*Math.cos(ctl.phi),ctl.target.z+ctl.r*sp*Math.cos(ctl.theta));camS.lookAt(ctl.target);}
const gRot={x:.2,y:0,tx:.2,ty:0,auto:true};
const gZoom={z:12.5,tz:12.5,min:4.4,max:16};

/* ---- 30-kit.js ---- */
/* ===================== SITE SCENE TOOLKIT ===================== */
const site3=new THREE.Scene();
const camX=new THREE.PerspectiveCamera(40,1,1,30000);
const sHemi=new THREE.HemisphereLight(0xffffff,0x332822,.6);site3.add(sHemi);
const sAmb=new THREE.AmbientLight(0xffffff,.1);site3.add(sAmb);
const sSun=new THREE.DirectionalLight(0xffffff,2);sSun.castShadow=true;
{const SM=(isMob()||matchMedia("(pointer:coarse)").matches||(navigator.deviceMemory||8)<4)?2048:4096;sSun.shadow.mapSize.set(SM,SM);}/* 2048 on phones: a 4096 shadow map is ~64 MB of GPU memory */ sSun.shadow.bias=-.0012;sSun.shadow.normalBias=2.5;site3.add(sSun);site3.add(sSun.target);
const siteRoot=new THREE.Group();site3.add(siteRoot);
const WIN_U={night:{value:0},k:{value:1},time:{value:0},cw:{value:1.4},ch:{value:1.1}};
const pmrem=new THREE.PMREMGenerator(renderer);

/* ---------- building material: vertex colors + lit windows that wake at night ---------- */
/* fine surface detail: masonry courses or hull panels, weathering, relief and roughness variation */
const DETAIL_GLSL=`
float hn3(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float vn3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hn3(i),hn3(i+vec3(1.,0.,0.)),f.x),mix(hn3(i+vec3(0.,1.,0.)),hn3(i+vec3(1.,1.,0.)),f.x),f.y),
             mix(mix(hn3(i+vec3(0.,0.,1.)),hn3(i+vec3(1.,0.,1.)),f.x),mix(hn3(i+vec3(0.,1.,1.)),hn3(i+vec3(1.,1.,1.)),f.x),f.y),f.z);}
float fbm3(vec3 p){return vn3(p)*.5+vn3(p*2.07)*.25+vn3(p*4.13)*.125+vn3(p*8.31)*.125;}
float jointMask(vec3 P,vec3 wn,out float aa){
  float bw=uCW*(OBJSPACE?1.0:2.0),bh=uCH*(OBJSPACE?.8:1.0);vec2 c;
  if(abs(wn.y)<0.6){float along=abs(wn.x)>abs(wn.z)?P.z:P.x;float row=floor(P.y/bh);c=vec2(along/bw+mod(row,2.0)*.5,P.y/bh);}
  else c=P.xz/vec2(bw);
  vec2 f=fract(c);vec2 fw=max(fwidth(c),vec2(1e-5));vec2 d=min(f,1.0-f)/fw;
  aa=clamp(1.6-max(fw.x,fw.y)*7.0,0.0,1.0);
  return mix(1.0,smoothstep(.6,1.8,min(d.x,d.y)),aa);}
`;
const DETAIL_APPLY=`{
  vec3 wn0=normalize(vWN);float aaJ;vec3 P=vWP;
  float jm=jointMask(P,wn0,aaJ);
  float fq=OBJSPACE?2.6:1.1;
  float fade=clamp(1.6-length(fwidth(P*fq))*1.5,0.0,1.0);
  float n1=fbm3(P*(OBJSPACE?.32:.18));
  float n2=vn3(P*fq)*.6+vn3(P*fq*2.3)*.4;
  float hgt=jm*.5+n2*.18*fade+n1*.12;
  float feat=0.0,grime=0.0;
  if(!OBJSPACE&&abs(wn0.y)<0.6){
    float along=abs(wn0.x)>abs(wn0.z)?P.z:P.x;
    /* architectural relief at three scales: floor courses, storey bands, monumental tiers;
       each fades in only when it is large enough on screen */
    for(int k=0;k<3;k++){float S=k==0?1.0:(k==1?6.0:30.0);
      vec2 cell=vec2(along/(uCW*S*(k==0?1.0:1.5)),P.y/(uCH*S));vec2 fc=fract(cell);vec2 fwc=max(fwidth(cell),vec2(1e-5));
      float aaC=clamp(1.4-max(fwc.x,fwc.y)*5.0,0.0,1.0)*clamp(max(fwc.x,fwc.y)*60.0,0.0,1.0);
      float sc=1.0-smoothstep(0.0,0.07+fwc.y,fc.y);
      float cor=step(mod(floor(cell.y),3.0),0.5)*(1.0-smoothstep(0.0,0.2+fwc.y,fc.y));
      float pil=step(mod(floor(cell.x),3.0),0.5)*(1.0-smoothstep(0.0,0.14+fwc.x,fc.x));
      feat=max(feat,max(max(sc*.55,cor),pil*.8)*aaC);}
    hgt+=feat*.8;
    float st=vn3(vec3(along*.06,P.y*.004,floor(along*.06)*1.7));
    grime=smoothstep(.5,.92,st);
  }
  vec3 sp=-vViewPosition;vec3 ddx=dFdx(sp),ddy=dFdy(sp);
  vec3 R1=cross(ddy,normal),R2=cross(normal,ddx);float det=dot(ddx,R1);
  vec3 grad=sign(det)*(dFdx(hgt)*R1+dFdy(hgt)*R2);
  normal=normalize(abs(det)*normal-grad*(OBJSPACE?.7:.85));
  float tint=.95+.1*hn3(floor(P/vec3(70.0,400.0,70.0)));
  diffuseColor.rgb*=mix(.74,1.0,jm)*(.88+.24*n1)*(.97+.06*n2*fade)*(1.0+feat*.14)*(1.0-grime*.16)*(OBJSPACE?1.0:tint);
  roughnessFactor=clamp(roughnessFactor*(.8+.4*n2)*(1.0+grime*.2),.05,1.0);
}`;
function buildingMat(opts){opts=opts||{};
  const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:opts.rough==null?.72:opts.rough,metalness:opts.metal||.05,envMapIntensity:opts.env==null?.6:opts.env});
  m.extensions={derivatives:true};
  const U=opts.uniforms||WIN_U;
  m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,{uNight:U.night,uLightK:U.k,uCW:U.cw,uCH:U.ch});
    sh.vertexShader=sh.vertexShader.replace("#include <common>","#include <common>\n#define OBJSPACE "+(opts.objSpace?"true":"false")+"\nattribute float aWin;varying float vWin;varying vec3 vWP;varying vec3 vWN;")
      .replace("#include <worldpos_vertex>","#include <worldpos_vertex>\nvWin=aWin;vWP=OBJSPACE?transformed:(modelMatrix*vec4(transformed,1.0)).xyz;vWN=OBJSPACE?objectNormal:normalize(mat3(modelMatrix)*objectNormal);");
    sh.fragmentShader=sh.fragmentShader.replace("#include <common>","#include <common>\nuniform float uNight;uniform float uLightK;uniform float uCW;uniform float uCH;varying float vWin;varying vec3 vWP;varying vec3 vWN;\nfloat h21(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}\n#define OBJSPACE "+(opts.objSpace?"true":"false")+"\n"+DETAIL_GLSL)
      .replace("#include <normal_fragment_maps>","#include <normal_fragment_maps>\n"+DETAIL_APPLY)
      .replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
      if(vWin>0.5){vec3 wn=normalize(vWN);if(abs(wn.y)<0.55){
        float along=abs(wn.x)>abs(wn.z)?vWP.z:vWP.x;
        vec2 cell=vec2(along/uCW,vWP.y/uCH);vec2 f=fract(cell);vec2 id=floor(cell);
        float pane=step(.2,f.x)*step(f.x,.8)*step(.22,f.y)*step(f.y,.78)*step(.035,abs(f.x-.5))*step(.03,abs(f.y-.6));
        float hsh=h21(id+floor(vWP.xz*.013)*7.0+vWin*1.7);
        float lf=0.1+uNight*.42;float lit=step(1.0-lf,hsh);
        float aa=clamp(1.6-max(fwidth(cell.x),fwidth(cell.y))*2.2,0.0,1.0);
        float term=mix(.1*lf,pane*lit,aa);
        float paneD=mix(.36,pane,aa);
        diffuseColor.rgb*=1.0-paneD*(.12+uNight*.3);
        vec3 wc=mix(vec3(1.0,.62,.3),vec3(1.0,.86,.62),hsh);
        totalEmissiveRadiance+=term*wc*uLightK*(0.15+uNight*2.2);
      }}
      if(vWin>1.5){totalEmissiveRadiance+=diffuseColor.rgb*uLightK*(.15+uNight*1.6);}`);};
  m.customProgramCacheKey=()=>"bld2"+(opts.objSpace?"o":"");return m;}
const MAT={};
function mats(){if(MAT.bld)return MAT;
  MAT.bld=buildingMat();MAT.metal=buildingMat({rough:.38,metal:.45});MAT.glass=buildingMat({rough:.18,metal:.55});
  MAT.terrain=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.96,metalness:0});
  MAT.tree=new THREE.MeshStandardMaterial({roughness:.9,metalness:0,vertexColors:true});
  MAT.water=new THREE.MeshPhongMaterial({color:col(0x174458),specular:col(0x9fb8c8),shininess:90,transparent:true,opacity:.94});
  MAT.glow=new THREE.MeshBasicMaterial({color:col(0xffc777)});
  return MAT;}

/* ---------- geometry builder: merges many shapes into one mesh ---------- */
class GeoBuilder{
  constructor(){this.pos=[];this.nrm=[];this.col=[];this.win=[];}
  add(geo,matrix,color,win,noAO){const g=geo.index?geo.toNonIndexed():geo.clone();if(matrix)g.applyMatrix4(matrix);
    const p=g.attributes.position.array,n=g.attributes.normal.array;const c=col(color);const w=win||0;
    let y0=Infinity,y1=-Infinity;for(let i=1;i<p.length;i+=3){if(p[i]<y0)y0=p[i];if(p[i]>y1)y1=p[i];}const span=Math.max(1,Math.min(y1-y0,30));
    for(let i=0;i<p.length;i++){this.pos.push(p[i]);this.nrm.push(n[i]);}
    for(let i=0;i<p.length/3;i++){const k=noAO?1:.62+.38*Math.min(1,(p[i*3+1]-y0)/span);this.col.push(c.r*k,c.g*k,c.b*k);this.win.push(w);}
    return this;}
  mesh(mat,opts){const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(this.pos,3));g.setAttribute("normal",new THREE.Float32BufferAttribute(this.nrm,3));
    g.setAttribute("color",new THREE.Float32BufferAttribute(this.col,3));g.setAttribute("aWin",new THREE.Float32BufferAttribute(this.win,1));g.computeBoundingSphere();
    const m=new THREE.Mesh(g,mat||mats().bld);m.castShadow=!(opts&&opts.noShadow);m.receiveShadow=true;return m;}
}
const _M=new THREE.Matrix4(),_Q=new THREE.Quaternion(),_E=new THREE.Euler(),_S=new THREE.Vector3(),_T=new THREE.Vector3();
function TM(x,y,z,ry,sx,sy,sz,rx,rz){_E.set(rx||0,ry||0,rz||0);_Q.setFromEuler(_E);_S.set(sx==null?1:sx,sy==null?1:sy,sz==null?1:sz);_T.set(x,y,z);return _M.clone().compose(_T,_Q,_S);}
const G={
  box:(w,h,d)=>new THREE.BoxGeometry(w,h,d).translate(0,h/2,0),
  cyl:(rt,rb,h,s)=>new THREE.CylinderGeometry(rt,rb,h,s||16,1).translate(0,h/2,0),
  cone:(r,h,s)=>new THREE.ConeGeometry(r,h,s||12).translate(0,h/2,0),
  dome:(r,s)=>new THREE.SphereGeometry(r,s||20,(s||20)/2,0,TAU,0,Math.PI/2),
  sphere:(r,s)=>new THREE.SphereGeometry(r,s||16,(s||16)*.75|0),
  torus:(r,t,s)=>new THREE.TorusGeometry(r,t,8,s||32),
  gable:(w,h,d)=>{const sh=new THREE.Shape();sh.moveTo(-w/2,0);sh.lineTo(w/2,0);sh.lineTo(0,h);sh.lineTo(-w/2,0);const g=new THREE.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false});g.translate(0,0,-d/2);return g;},
  pyramid:(w,h)=>new THREE.ConeGeometry(w*.7071,h,4,1).rotateY(Math.PI/4).translate(0,h/2,0),
  arch:(w,h,d,t)=>{const sh=new THREE.Shape();sh.moveTo(-w/2,0);sh.lineTo(-w/2,h);sh.lineTo(w/2,h);sh.lineTo(w/2,0);sh.lineTo(w/2-t,0);sh.lineTo(w/2-t,h-w/2);
    sh.absarc(0,h-w/2,w/2-t,0,Math.PI,false);sh.lineTo(-w/2+t,0);sh.lineTo(-w/2,0);const g=new THREE.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false,curveSegments:10});g.translate(0,0,-d/2);return g;}
};

/* ---------- reusable architecture ---------- */
const ARCH={
  /* a round tower with conical roof and battlements */
  tower(B,x,y,z,r,h,c,roof,win){B.add(G.cyl(r,r*1.08,h,14),TM(x,y,z),c,win||0);
    if(roof==="cone")B.add(G.cone(r*1.25,r*2.4,14),TM(x,y+h,z),0x5c3b33);
    else if(roof==="gold")B.add(G.cone(r*1.15,r*3,14),TM(x,y+h,z),0xd9b060);
    else{for(let i=0;i<10;i++){const a=i/10*TAU;B.add(G.box(r*.32,r*.4,r*.3),TM(x+Math.cos(a)*r*.95,y+h,z+Math.sin(a)*r*.95,-a),c);}}},
  /* straight wall with crenellations between two points */
  wall(B,x1,z1,x2,z2,y,h,t,c){const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz),a=Math.atan2(dz,dx);
    B.add(G.box(L,h,t),TM((x1+x2)/2,y,(z1+z2)/2,-a),c);const n=Math.floor(L/(t*1.6));
    for(let i=0;i<n;i+=2){const f=(i+.5)/n;B.add(G.box(t*.8,t*.7,t*1.05),TM(x1+dx*f,y+h,z1+dz*f,-a),c);}},
  /* a castle: keep, curtain wall, towers */
  castle(B,x,y,z,s,c,roofC,seed){const R=rng(seed||1);const k=s*.42;
    B.add(G.box(k,s*.9,k),TM(x,y,z),c,1);B.add(G.box(k*1.08,s*.08,k*1.08),TM(x,y+s*.9,z),c);
    ARCH.tower(B,x+k*.5,y,z-k*.5,s*.1,s*1.25,c,roofC||"cone",1);
    const W=s*.62;const pts=[[-W,-W],[W,-W],[W,W],[-W,W]];
    for(let i=0;i<4;i++){const a=pts[i],b=pts[(i+1)%4];ARCH.wall(B,x+a[0],z+a[1],x+b[0],z+b[1],y,s*.32,s*.08,c);ARCH.tower(B,x+a[0],y,z+a[1],s*.11,s*.48,c,R()<.5?"cone":null);}
    B.add(G.arch(s*.2,s*.26,s*.12,s*.04),TM(x,y,z+W),0x2a2320);},
  /* tall slender spire tower in the Gold style */
  spire(B,x,y,z,r,h,c,cap){B.add(G.cyl(r*.55,r,h*.78,8),TM(x,y,z),c,1);B.add(G.cyl(r*.9,r*.9,h*.03,8),TM(x,y+h*.6,z),cap||0xd9b060);
    B.add(G.cone(r*.55,h*.22,8),TM(x,y+h*.78,z),cap||c);},
  /* colonnade along x */
  colonnade(B,x,y,z,len,h,n,c,ry){for(let i=0;i<n;i++){const t=n>1?i/(n-1)-.5:0;const px=x+Math.cos(ry||0)*t*len,pz=z-Math.sin(ry||0)*t*len;B.add(G.cyl(h*.06,h*.07,h,10),TM(px,y,pz),c);}
    B.add(G.box(len+h*.3,h*.1,h*.28),TM(x,y+h,z,ry||0),c);},
  /* statue on plinth (lion or figure) */
  statue(B,x,y,z,s,c,ry){B.add(G.box(s*.8,s*.5,s*.8),TM(x,y,z,ry),0xcfc6b6);B.add(G.box(s*.32,s*.42,s*.62),TM(x,y+s*.5,z,ry),c);B.add(G.sphere(s*.2,8),TM(x+Math.sin(ry||0)*s*.25,y+s*.95,z+Math.cos(ry||0)*s*.25),c);},
  /* stepped tower with setbacks, optional dome or spire cap */
  tiered(B,x,y,z,w,d,h,c,R,trim){const tiers=1+((R()*3)|0);let cw=w,cd=d,cy=y,left=h;
    for(let i=0;i<tiers;i++){const th=i===tiers-1?left:left*(.45+R()*.2);B.add(G.box(cw,th,cd),TM(x,cy,z),c,1);
      B.add(G.box(cw*1.04,Math.max(1.2,h*.012),cd*1.04),TM(x,cy+th,z),trim||c);cy+=th;left-=th;cw*=.72;cd*=.72;}
    const cap=R();if(cap<.25)B.add(G.dome(Math.min(cw,cd)*.5,12),TM(x,cy,z),trim||0xd9b060);else if(cap<.45)B.add(G.cone(Math.min(cw,cd)*.35,h*.18,8),TM(x,cy,z),trim||c);
    else if(cap<.6)B.add(G.pyramid(Math.min(cw,cd)*.9,h*.08),TM(x,cy,z),trim||c);},
  /* city block of towers on a grid */
  district(B,cx,cz,size,step,hFn,groundFn,palette,seed,skip){const R=rng(seed||7);
    for(let x=-size/2;x<=size/2;x+=step)for(let z=-size/2;z<=size/2;z+=step){const px=cx+x+(R()-.5)*step*.2,pz=cz+z+(R()-.5)*step*.2;if(skip&&skip(px,pz))continue;
      const h=hFn(px,pz,R);if(h<=0)continue;const w=step*(.45+R()*.35),d=step*(.45+R()*.35);const y=groundFn(px,pz);const c=palette[(R()*palette.length)|0];
      const kind=R();
      if(kind<.6){if(h>60)ARCH.tiered(B,px,y,pz,w,d,h,c,R,R()<.3?0xd9b060:null);else{B.add(G.box(w,h,d),TM(px,y,pz,(R()-.5)*.1),c,1);if(R()<.5)B.add(G.pyramid(Math.min(w,d)*1.02,h*.25),TM(px,y+h,pz),R()<.5?0xa8402c:c);}}
      else if(kind<.85){B.add(G.cyl(w*.42,w*.5,h,10),TM(px,y,pz),c,1);B.add(G.cone(w*.44,h*.18,10),TM(px,y+h,pz),c);}
      else{B.add(G.box(w,h*.5,d),TM(px,y,pz),c,1);ARCH.spire(B,px,y+h*.5,pz,w*.3,h*.9,c);}}}
};

/* ---------- terrain ---------- */
function makeTerrain(opt){const g=new THREE.PlaneGeometry(opt.size,opt.size,opt.seg,opt.seg);g.rotateX(-Math.PI/2);
  const p=g.attributes.position;const cols=new Float32Array(p.count*3);
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,opt.height(x,z));}
  g.computeVertexNormals();const n=g.attributes.normal;const c=new THREE.Color();
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const rgb=opt.color(x,z,y,1-n.getY(i));c.setRGB(rgb[0]/255,rgb[1]/255,rgb[2]/255).convertSRGBToLinear();cols[i*3]=c.r;cols[i*3+1]=c.g;cols[i*3+2]=c.b;}
  g.setAttribute("color",new THREE.BufferAttribute(cols,3));
  const m=new THREE.Mesh(g,mats().terrain);m.receiveShadow=true;m.castShadow=!!opt.cast;
  if(opt.snow){const a=cols.slice(),b=new Float32Array(cols.length);
    for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const rgb=opt.snow(x,z,y,1-n.getY(i),[a[i*3],a[i*3+1],a[i*3+2]]);b[i*3]=rgb[0];b[i*3+1]=rgb[1];b[i*3+2]=rgb[2];}
    let last=-1;m.userData.setSnow=k=>{if(Math.abs(k-last)<.01)return;last=k;const c=g.attributes.color.array;for(let i=0;i<c.length;i++)c[i]=a[i]+(b[i]-a[i])*k;g.attributes.color.needsUpdate=true;};}
  return m;}
const mixc=(a,b,t)=>{t=t<0?0:t>1?1:t;return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];};
const sst=(e0,e1,x)=>{const t=Math.max(0,Math.min(1,(x-e0)/(e1-e0)));return t*t*(3-2*t);};

/* ---------- forests (instanced) ---------- */
function makeForest(list,kind,seed){const R=rng(seed||3);const m=mats();
  let geo;const trunk=new THREE.CylinderGeometry(.12,.18,1,5).translate(0,.5,0);
  if(kind==="pine"){const a=new THREE.ConeGeometry(1,2.2,7).translate(0,2.0,0),b=new THREE.ConeGeometry(.78,1.7,7).translate(0,3.0,0);geo=mergeSimple([trunk,a,b],[0x4a3524,0xffffff,0xffffff]);}
  else if(kind==="dead"){const a=new THREE.CylinderGeometry(.05,.12,3,5).translate(0,1.5,0);geo=mergeSimple([a],[0x4a3a30]);}
  else{const a=new THREE.IcosahedronGeometry(1.25,1).scale(1,.85,1).translate(0,2.2,0);geo=mergeSimple([trunk,a],[0x4a3524,0xffffff]);}
  const im=new THREE.InstancedMesh(geo,m.tree,list.length);im.castShadow=true;im.receiveShadow=true;const c=new THREE.Color();
  list.forEach((t,i)=>{const s=t.s;im.setMatrixAt(i,TM(t.x,t.y-.2*s,t.z,R()*TAU,s*(.85+R()*.3),s*(.8+R()*.5),s*(.85+R()*.3)));c.set(t.c).convertSRGBToLinear();im.setColorAt(i,c);});
  im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;return im;}
function mergeSimple(geos,colors){const B=new GeoBuilder();geos.forEach((g,i)=>B.add(g,null,colors[i]));const g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(B.pos,3));g.setAttribute("normal",new THREE.Float32BufferAttribute(B.nrm,3));g.setAttribute("color",new THREE.Float32BufferAttribute(B.col,3));return g;}
function scatter(n,size,R,accept){const out=[];let tries=0;while(out.length<n&&tries<n*30){tries++;const x=(R()-.5)*size,z=(R()-.5)*size;const r=accept(x,z,R);if(r)out.push(r);}return out;}

/* ---------- sky dome ---------- */
const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,
  uniforms:{top:{value:new THREE.Color()},hor:{value:new THREE.Color()},bot:{value:new THREE.Color()},sunDir:{value:new THREE.Vector3(0,1,0)},sunCol:{value:new THREE.Color()},sunSize:{value:.9993},haze:{value:.6}},
  vertexShader:"varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position.z=gl_Position.w;}",
  fragmentShader:"uniform vec3 top;uniform vec3 hor;uniform vec3 bot;uniform vec3 sunDir;uniform vec3 sunCol;uniform float sunSize;uniform float haze;varying vec3 vD;void main(){vec3 d=normalize(vD);float y=d.y;vec3 c=y>0.?mix(hor,top,pow(clamp(y,0.,1.),.55)):mix(hor,bot,pow(clamp(-y*3.,0.,1.),.6));float s=max(dot(d,sunDir),0.);c+=sunCol*(pow(s,8.)*.35*haze+pow(s,64.)*.6);c+=sunCol*smoothstep(sunSize,sunSize+.0004,s)*6.;gl_FragColor=vec4(c,1.);}"});
const sky=new THREE.Mesh(new THREE.SphereGeometry(15000,32,16),skyMat);sky.frustumCulled=false;site3.add(sky);
const nightStars=(function(){const n=2600,g=new THREE.BufferGeometry(),p=new Float32Array(n*3);const R=rng(91);
  for(let i=0;i<n;i++){const u=R(),t=R()*TAU,s=Math.sqrt(1-u*u);p[i*3]=s*Math.cos(t)*14000;p[i*3+1]=u*14000;p[i*3+2]=s*Math.sin(t)*14000;}
  g.setAttribute("position",new THREE.BufferAttribute(p,3));const m=new THREE.PointsMaterial({color:0xffffff,size:1.6,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false});const pts=new THREE.Points(g,m);pts.frustumCulled=false;site3.add(pts);return pts;})();
/* a planet or moon hanging in the sky (Earth over Luna, Mars over Phobos, Jupiter over its moons) */
let skyBody=null;
function setSkyBody(id,dir,size){if(skyBody){site3.remove(skyBody);skyBody=null;}if(!id)return;
  const t=REAL[id]||procSet(byId[id],512,256);const m=new THREE.Mesh(new THREE.SphereGeometry(size,64,48),new THREE.MeshPhongMaterial({map:t.map,emissiveMap:t.lights||null,emissive:col(t.lights?0xffffff:0),emissiveIntensity:.8,shininess:4,fog:false}));
  const g=new THREE.Group();g.add(m);const a=makeAtmo(id,size,1.03);a.material.fog=false;g.add(a);
  if(id==="saturn"){const r=makeRing(size,(REAL.saturn||{}).ring);r.rotation.x=-Math.PI/2+.3;g.add(r);}
  g.userData.dir=dir.clone().normalize();g.position.copy(g.userData.dir).multiplyScalar(11000);g.lookAt(0,0,0);m.rotation.y=1.2;g.userData.mesh=m;skyBody=g;site3.add(g);}

/* ---------- time of day ---------- */
const TOD_KEYS=["day","dusk","night","winter"];const TOD_LABEL={day:"Day",dusk:"Dusk",night:"Night",winter:"Winter"};
let tod={cur:null,from:null,to:null,t:1};
function todState(site,key){const d=site.tods[key];return d;}
function applyTod(a,b,k){
  const L=(x,y)=>x+(y-x)*k;const C=(x,y)=>col(x).lerp(col(y),k);
  skyMat.uniforms.top.value.copy(C(a.top,b.top));skyMat.uniforms.hor.value.copy(C(a.hor,b.hor));skyMat.uniforms.bot.value.copy(C(a.bot||a.hor,b.bot||b.hor));
  const el=L(a.sunEl,b.sunEl),az=L(a.sunAz,b.sunAz);const dir=new THREE.Vector3(Math.cos(el)*Math.cos(az),Math.sin(el),Math.cos(el)*Math.sin(az));
  skyMat.uniforms.sunDir.value.copy(dir);skyMat.uniforms.sunCol.value.copy(C(a.sun,b.sun));skyMat.uniforms.haze.value=L(a.haze==null?.6:a.haze,b.haze==null?.6:b.haze);skyMat.uniforms.sunSize.value=L(a.sunSize||.9993,b.sunSize||.9993);
  const sr=tod.site.shadow||900;sSun.position.copy(dir).multiplyScalar(sr*2.2).add(sctl.target.clone().setY(0));sSun.target.position.copy(sctl.target).setY(0);
  sSun.color.copy(C(a.sun,b.sun));sSun.intensity=L(a.sunI,b.sunI);
  sHemi.color.copy(C(a.skyL,b.skyL));sHemi.groundColor.copy(C(a.gndL,b.gndL));sHemi.intensity=L(a.hemiI,b.hemiI);
  site3.fog.color.copy(C(a.fog,b.fog));site3.fog.density=L(a.fogD,b.fogD);
  WIN_U.night.value=L(a.night,b.night);nightStars.material.opacity=L(a.stars||0,b.stars||0);
  renderer.toneMappingExposure=L(a.exp||1,b.exp||1);
  const snow=L(a.snow||0,b.snow||0);if(tod.site._snow)tod.site._snow(snow);if(tod.site.onTod)tod.site.onTod(L(a.night,b.night),snow);}

/* ---------- site camera: drag to pan the ground, right-drag or two fingers to orbit ---------- */
const sctl={target:new THREE.Vector3(),r:800,theta:.6,phi:.9,tt:new THREE.Vector3(),tr:800,tth:.6,tph:.9,bounds:2000,minR:60,maxR:4000,anim:null};
function sCamApply(dt){const k=Math.min(1,dt*6);
  sctl.target.lerp(sctl.tt,k);sctl.r+=(sctl.tr-sctl.r)*k;sctl.theta+=(sctl.tth-sctl.theta)*k;sctl.phi+=(sctl.tph-sctl.phi)*k;
  const sp=Math.sin(sctl.phi);camX.position.set(sctl.target.x+sctl.r*sp*Math.sin(sctl.theta),sctl.target.y+sctl.r*Math.cos(sctl.phi),sctl.target.z+sctl.r*sp*Math.cos(sctl.theta));
  if(curSite&&curSite.ground){const gy=curSite.ground(camX.position.x,camX.position.z)+20;if(camX.position.y<gy)camX.position.y=gy;}
  camX.lookAt(sctl.target);}
function sPan(dx,dy){const s=sctl.r*.0016;const fx=Math.cos(sctl.theta),fz=-Math.sin(sctl.theta);const bx=Math.sin(sctl.theta),bz=Math.cos(sctl.theta);
  sctl.tt.x+=(-dx*fx+ -dy*bx)*s;sctl.tt.z+=(-dx*fz+ -dy*bz)*s;const L=Math.hypot(sctl.tt.x,sctl.tt.z);if(L>sctl.bounds){sctl.tt.x*=sctl.bounds/L;sctl.tt.z*=sctl.bounds/L;}
  if(curSite&&curSite.ground){const gy=curSite.ground(sctl.tt.x,sctl.tt.z);if(gy>-1e6)sctl.tt.y=gy+(curSite.targetLift||0);}}
function sFly(c){if(!c)return;sctl.tt.set(c.target[0],c.target[1],c.target[2]);sctl.tr=c.r;if(c.theta!=null){let d=c.theta-sctl.tth;d=Math.atan2(Math.sin(d),Math.cos(d));sctl.tth+=d;}if(c.phi!=null)sctl.tph=c.phi;}

/* ---------- loading a site ---------- */
let curSite=null,siteUpdate=null,siteLabels=[],siteFx=[];
function clearSite(){if(WAR.active)WAR.stop();while(siteRoot.children.length){const c=siteRoot.children[0];siteRoot.remove(c);c.traverse(o=>{if(o.geometry)o.geometry.dispose();});}
  siteLabels.forEach(l=>l.el.remove());siteLabels=[];siteFx=[];siteUpdate=null;setSkyBody(null);}
function loadSite(key){clearSite();const S=SITES[key];curSite=S;mats();MAT.tree.emissive.setRGB(0,0,0);
  site3.fog=new THREE.FogExp2(0x000000,.0003);
  WIN_U.cw.value=S.win?S.win[0]:1.4;WIN_U.ch.value=S.win?S.win[1]:1.1;WIN_U.k.value=S.winK||1;
  const s=S.shadow||900;const sc=sSun.shadow.camera;sc.left=-s;sc.right=s;sc.top=s;sc.bottom=-s;sc.near=10;sc.far=s*6;sc.updateProjectionMatrix();
  const ctx={root:siteRoot,R:rng(S.seed||1)};
  const out=S.build(ctx)||{};siteUpdate=out.update||null;
  if(S.skyBody)setSkyBody(S.skyBody.id,new THREE.Vector3().fromArray(S.skyBody.dir),S.skyBody.size);
  const c=S.cam;sctl.bounds=S.bounds||2000;sctl.minR=S.minR||60;sctl.maxR=S.maxR||4000;
  sctl.tt.fromArray(c.target);sctl.target.copy(sctl.tt);sctl.tr=c.r*1.5;sctl.r=c.r*2.4;sctl.tth=c.theta;sctl.theta=c.theta+.6;sctl.tph=c.phi;sctl.phi=Math.max(.25,c.phi-.3);
  setTimeout(()=>{sctl.tr=c.r;},60);
  tod.site=S;const k=S.defaultTod||"dusk";tod.cur=k;tod.t=1;tod.from=tod.to=null;applyTod(S.tods[k],S.tods[k],1);
  site3.environment=null;
  return S;}
function skyOnlyScene(){const s=new THREE.Scene();const m=new THREE.Mesh(new THREE.SphereGeometry(100,32,16),skyMat.clone());m.material.uniforms=THREE.UniformsUtils.clone(skyMat.uniforms);s.add(m);return s;}
function setTod(key){if(!curSite||!curSite.tods[key])return;tod.from=curSite.tods[tod.cur];tod.to=curSite.tods[key];tod.cur=key;tod.t=0;document.querySelectorAll('[data-tod]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.tod===key));}
function updateTod(dt){if(tod.t<1&&tod.from){tod.t=Math.min(1,tod.t+dt*.7);applyTod(tod.from,tod.to,ease(tod.t));
}}

/* ---- 32-ships.js ---- */
/* ===================== SHIPS ===================== */
/* Built from tapered hull segments, superstructure towers, turrets, engine banks and greebles,
   at a canonical length of 100 units, then scaled. Geometry is cached per class. */
const SHIP_U={night:{value:.2},k:{value:1.1},cw:{value:4},ch:{value:3}};
let SHIPMAT=null;
function shipMats(){if(!SHIPMAT)SHIPMAT=buildingMat({rough:.42,metal:.6,objSpace:true,uniforms:SHIP_U});return SHIPMAT;}
/* a box whose far (+x) end is scaled, for prows and tapered hull sections */
function frustum(len,w0,h0,w1,h1,dy1){const g=new THREE.BoxGeometry(len,1,1);const p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const front=x>0;const w=front?w1:w0,h=front?h1:h0;p.setXYZ(i,x,y*h+(front?(dy1||0):0),z*w);}
  g.computeVertexNormals();return g;}
const SHIP_CLASSES={
  /* length in old units for scale compatibility, and design parameters */
  ripwing:{L:.25},frigate:{L:1.2},destroyer:{L:1.6},torch:{L:2},dread:{L:3.2},moonbreaker:{L:5},hauler:{L:3.6}
};
const shipGeoCache={};
function shipGeometry(kind){if(shipGeoCache[kind])return shipGeoCache[kind];const R=rng(kind.length*131+kind.charCodeAt(0));const B=new GeoBuilder();
  const DARK=0x3a3a40,MID=0x5e5e66,LIGHT=0x92929a,GOLD=0xc9a050,RED=0x8a2a22,ENG=0x1a1a1e;
  const engines=[];
  if(kind==="ripwing"){/* bat-winged fighter, blade nose */
    B.add(frustum(60,10,7,2,2,0),TM(0,0,0),DARK);B.add(frustum(26,6,6,10,7),TM(-38,0,0),MID);
    const wing=new THREE.BufferGeometry();const v=new Float32Array([-30,0,0, 20,0,4, -40,0,46, -30,0,0, -40,0,46, -48,0,30]);wing.setAttribute("position",new THREE.BufferAttribute(v,3));wing.computeVertexNormals();
    [1,-1].forEach(s=>{B.add(new THREE.BoxGeometry(46,1.6,30).translate(-22,0,s*22),TM(0,0,0,s*.35),DARK);B.add(new THREE.BoxGeometry(30,1.2,10).translate(-30,0,s*44),TM(0,0,0,s*.1),RED);});
    B.add(new THREE.BoxGeometry(10,4,5),TM(14,4.5,0),0x9fb8c8,1);engines.push([-52,0,0,9]);
  }else if(kind==="hauler"){/* cosmosHauler: long spine of cargo pods */
    B.add(new THREE.BoxGeometry(100,4,4),TM(0,0,0),MID);B.add(frustum(14,10,10,6,6),TM(46,0,0),LIGHT,1);
    for(let i=0;i<9;i++){const x=-38+i*9.5;[[0,7],[0,-7],[7,0],[-7,0]].forEach(o=>B.add(new THREE.BoxGeometry(8.5,6,6),TM(x,o[0],o[1]),[0x6a5a4a,0x4a5a6a,0x7a6a3a,0x5a5a5a][(R()*4)|0]));}
    B.add(new THREE.BoxGeometry(10,12,12),TM(-48,0,0),DARK);engines.push([-54,4,4,6],[-54,-4,4,6],[-54,4,-4,6],[-54,-4,-4,6]);
  }else{
    const P={frigate:{w:9,h:7,segs:3,tower:1,turrets:4,eng:2},destroyer:{w:11,h:8,segs:4,tower:1,turrets:6,eng:3},torch:{w:12,h:9,segs:4,tower:2,turrets:8,eng:3},
      dread:{w:16,h:12,segs:5,tower:3,turrets:14,eng:6},moonbreaker:{w:20,h:16,segs:6,tower:4,turrets:22,eng:8}}[kind]||{w:12,h:9,segs:4,tower:2,turrets:8,eng:3};
    /* main hull: tapering toward a blade prow */
    const segL=86/P.segs;let x=-44;
    for(let i=0;i<P.segs;i++){const t0=i/P.segs,t1=(i+1)/P.segs;const w0=P.w*(1-t0*.55),w1=P.w*(1-t1*.55),h0=P.h*(1-t0*.4),h1=P.h*(1-t1*.4);
      B.add(frustum(segL,w0,h0,w1,h1),TM(x+segL/2,0,0),i%2?DARK:MID,1);
      B.add(frustum(segL*.96,w0*.6,h0*.25,w1*.6,h1*.25),TM(x+segL/2,h0*.55,0),DARK,1);/* dorsal plate */
      B.add(frustum(segL*.96,w0*.5,h0*.3,w1*.5,h1*.3),TM(x+segL/2,-h0*.6,0),ENG);/* keel */
      x+=segL;}
    B.add(frustum(18,P.w*.45,P.h*.6,.6,.6,-P.h*.1),TM(51,0,0),LIGHT,0);/* prow blade */
    B.add(new THREE.BoxGeometry(70,.8,P.w*1.02),TM(4,P.h*.06,0),GOLD,0,true);/* gold trim line */
    /* superstructure towers rising from the rear third, like a cathedral bridge */
    for(let k=0;k<P.tower;k++){const tx=-26+k*9,th=P.h*(1.1+R()*.6)*(1-k*.12),tw=P.w*(.42-k*.05);
      B.add(new THREE.BoxGeometry(8,th,tw).translate(0,th/2,0),TM(tx,P.h*.55,0),k%2?MID:LIGHT,1);
      B.add(new THREE.BoxGeometry(5,th*.35,tw*.7).translate(0,th*.35/2,0),TM(tx-1,P.h*.55+th,0),DARK,1);
      B.add(new THREE.CylinderGeometry(.3,.3,th*.7,4).translate(0,th*.35,0),TM(tx+1,P.h*.55+th*1.35,0),LIGHT);}
    B.add(new THREE.BoxGeometry(5,2,P.w*.36),TM(-24,P.h*.55+P.h*1.5,0),0x9fd0ff,2,true);/* bridge glass */
    /* side sponsons and turrets */
    for(let k=0;k<P.turrets;k++){const t=(k>>1)/(P.turrets/2);const side=k%2?1:-1;const tx=-34+t*70;const ww=P.w*(1-((tx+44)/86)*.55)*.5;
      B.add(new THREE.BoxGeometry(6,P.h*.3,2.4),TM(tx,0,side*(ww+.6)),MID,1);
      B.add(new THREE.CylinderGeometry(1.4,1.6,1.4,8),TM(tx,P.h*.45*(1-t*.4)+.7,side*ww*.55),LIGHT);
      B.add(new THREE.BoxGeometry(5,.5,.5).translate(2.5,0,0),TM(tx+1,P.h*.45*(1-t*.4)+1.3,side*ww*.55,side*.1),DARK);}
    /* greebles */
    for(let k=0;k<40+P.turrets*4;k++){const tx=-40+R()*80;const t=(tx+44)/86;const ww=P.w*(1-t*.55)*.5,hh=P.h*(1-t*.4)*.5;const face=R();
      const g=new THREE.BoxGeometry(1+R()*4,.6+R()*1.6,1+R()*3);
      if(face<.5)B.add(g,TM(tx,hh+.3,(R()-.5)*ww*1.4),R()<.5?MID:LIGHT);else B.add(g,TM(tx,(R()-.5)*hh*1.4,(face<.75?1:-1)*(ww+.3)),R()<.5?MID:DARK,1);}
    /* cathedral detail */
    const hw=x0=>P.w*(1-((x0+44)/86)*.55)*.5,hh=x0=>P.h*(1-((x0+44)/86)*.4)*.5;
    for(let k=0;k<P.tower+3;k++){const tx=-30+k*7+R()*3,th=P.h*(1.6+R()*1.6)*(1-k*.08);const r0=1.1+R()*1.3;
      B.add(new THREE.ConeGeometry(r0,th,6).translate(0,th/2,0),TM(tx,P.h*.5,(R()-.5)*hw(tx)*.6),k%2?DARK:MID,0);
      for(let q=0;q<4;q++){const pa=q/4*TAU;B.add(new THREE.ConeGeometry(.35,th*.28,4).translate(0,th*.14,0),TM(tx+Math.cos(pa)*r0*1.3,P.h*.5+th*.12,Math.sin(pa)*r0*1.3),LIGHT);}}
    for(let k=0;k<18+P.turrets;k++){const tx=-36+R()*76;B.add(new THREE.ConeGeometry(.3+R()*.4,1.5+R()*3.5,4).translate(0,1,0),TM(tx,hh(tx)+P.h*.08,(R()-.5)*hw(tx)*1.2),R()<.3?GOLD:LIGHT);}
    for(let k=0;k<P.segs*4;k++){const tx=-40+k*(80/(P.segs*4));[1,-1].forEach(sd=>{const w=hw(tx),h=hh(tx);
      B.add(new THREE.BoxGeometry(1.1,h*1.5,.7),TM(tx,h*.35,sd*(w+.35),0,1,1,1,sd*.5,0),DARK);});}
    for(let row=0;row<2;row++)for(let k=0;k<26;k++){const tx=-38+k*3;[1,-1].forEach(sd=>{const w=hw(tx),h=hh(tx);
      if(R()<.75)B.add(new THREE.BoxGeometry(1.2,.7,.15),TM(tx,h*(.1-row*.45),sd*(w+.08)),R()<.15?0x9fd0ff:0xffc06a,2,true);});}
    if(P.turrets>=6){for(let k=0;k<P.turrets;k++){const tx=-34+R()*64,hl=P.h*(.6+R()*1.3);B.add(new THREE.ConeGeometry(.6+R()*1.2,hl,5).translate(0,-hl/2,0),TM(tx,-hh(tx)*1.1,(R()-.5)*hw(tx)),DARK);}}
    /* engine bank */
    B.add(frustum(8,P.w*.9,P.h*.9,P.w*1.05,P.h*1.05),TM(-48,0,0),ENG);
    const cols=Math.ceil(P.eng/2);for(let k=0;k<P.eng;k++){const row=k%2,c=(k>>1);const ez=(c-(cols-1)/2)*P.w*.32,ey=(row?-1:1)*P.h*.22;
      B.add(new THREE.CylinderGeometry(P.h*.16,P.h*.2,5,10),TM(-53,ey,ez,0,1,1,1,0,Math.PI/2),0x3a3a40);engines.push([-56,ey,ez,P.h*.5]);}
    if(kind==="moonbreaker"||kind==="dread"){/* forward ram and heavy spinal gun */B.add(new THREE.CylinderGeometry(1.2,1.6,30,8),TM(46,-P.h*.1,0,0,1,1,1,0,Math.PI/2),LIGHT);}
  }
  const geo=B.mesh(shipMats()).geometry;const out={geo,engines};shipGeoCache[kind]=out;return out;}
function makeShip(kind,scale){const g=new THREE.Group();const s=scale||1;
  if(kind==="station"){const hub=new THREE.Mesh(new THREE.CylinderGeometry(.3*s,.3*s,.5*s,12),shipMats());const B=new GeoBuilder();
    B.add(new THREE.CylinderGeometry(30,30,50,16),null,0x6a6a70,1);B.add(new THREE.TorusGeometry(70,6,8,40).rotateX(Math.PI/2),null,0x4a4a52,1);
    for(let k=0;k<4;k++)B.add(new THREE.BoxGeometry(70,4,4).translate(35,0,0),TM(0,0,0,k*Math.PI/2),0x5a5a60);
    B.add(new THREE.CylinderGeometry(4,4,120,6),null,0x7a7a80);const m=B.mesh(shipMats());m.scale.setScalar(s/100);g.add(m);return g;}
  const C=SHIP_CLASSES[kind]||SHIP_CLASSES.torch;const sg=shipGeometry(kind in SHIP_CLASSES?kind:"torch");
  const k=C.L*s/100;const m=new THREE.Mesh(sg.geo,shipMats());m.castShadow=true;m.receiveShadow=true;m.scale.setScalar(k);g.add(m);
  let main=null;sg.engines.forEach(e=>{const gl=glowSprite(GLOW_BLUE,e[3]*k*3.2,.95);gl.position.set(e[0]*k,e[1]*k,e[2]*k);g.add(gl);if(!main)main=gl;});
  g.userData.glow=main;g.userData.len=C.L*s;return g;}

/* ---- 40-site-agea.js ---- */
/* ===================== AGEA ===================== */
(function(){
const N=makeNoise(101);
/* canyon runs along x. Floor near y=0, walls climb past |z|~1700 */
function wallZ(x){return 1750+Math.sin(x*.0007)*260+Math.sin(x*.0021+1)*120;}
function riverZ(x){return 1050+Math.sin(x*.0011+.6)*140;}
function ground(x,z){const wz=wallZ(x);const az=Math.abs(z-(Math.sin(x*.0004)*120));
  let h=(N.f(x*.0012,0,z*.0012,4)-.5)*30;
  const w=sst(wz-250,wz+700,az);const strata=Math.floor((N.f(x*.0006,3,z*.0006,3)*.4+w)*14)/14;
  h+=w*1300+strata*120*w+(N.f(x*.004,1,z*.004,3)-.5)*160*w;
  /* citadel rise */
  const dc=Math.hypot(x+60,z+40);h+=sst(520,180,dc)*42;
  /* river channel */
  const rd=Math.abs(z-riverZ(x));h-=sst(120,30,rd)*16;
  return h;}
function color(x,z,h,slope){
  const rd=Math.abs(z-riverZ(x));
  let c=[176,104,66];
  if(h>120){const band=.5+.5*Math.sin(h*.045+N.vn(x*.003,h*.01,z*.003)*4);c=mixc([150,78,48],[214,150,104],band);c=mixc(c,[110,58,40],slope*.7);if(h>1200)c=mixc(c,[226,190,150],sst(1200,1450,h));}
  else{const g=N.f(x*.003,7,z*.003,4);c=mixc([132,120,74],[96,112,58],g);if(Math.hypot(x,z)<1150)c=mixc(c,[196,184,166],.75);if(rd<150)c=mixc(c,[86,104,62],.5);}
  if(rd<40)c=[60,54,44];
  return c;}
const CAM={target:[0,40,150],r:2600,theta:.35,phi:1.02};
SITES.agea={name:"Agea",body:"mars",poi:"agea",epithet:"Capital of Mars · seat of House Augustus",seed:5,
  blurb:"Twenty million people in the heart of Valles Marineris, between canyon walls up to seven kilometers high. White and red spires rise from the Citadel of House Augustus, ringed by walls two hundred meters tall.",
  facts:[["Ruler","ArchGovernor Nero au Augustus"],["Setting","Valles Marineris, Apollonia"],["Walls","About 200 m high"],["Jackal’s seat","Attica, from after the Iron Rain"]],
  note:"Layout is an artistic reconstruction from the books’ descriptions.",
  ground,targetLift:30,bounds:3600,minR:120,maxR:7000,shadow:1700,win:[2.2,1.8],cam:CAM,defaultTod:"dusk",
  skyBody:{id:"phobos",dir:[-.5,.32,-.8],size:340},
  tods:{
    day:{top:0x5c7fae,hor:0xe9cba0,bot:0xb98a62,sun:0xfff1d8,sunEl:.95,sunAz:-.9,sunI:3.0,skyL:0xbfd3ef,gndL:0x8a5a3c,hemiI:.9,fog:0xd8b896,fogD:.000075,night:0,exp:.95,haze:.4},
    dusk:{top:0x283158,hor:0xf38a4c,bot:0x6a3b2c,sun:0xffa560,sunEl:.07,sunAz:-.55,sunI:2.6,skyL:0x8c80a8,gndL:0x5a3428,hemiI:.65,fog:0xc77a55,fogD:.00009,night:.55,exp:1.05,haze:1},
    night:{top:0x04050c,hor:0x1d1624,bot:0x0d0a0d,sun:0x8aa0d8,sunEl:.55,sunAz:2.2,sunI:.22,skyL:0x2c3048,gndL:0x120c0c,hemiI:.2,fog:0x161220,fogD:.00008,night:1,exp:1.1,stars:1}},
  landmarks:[
    {id:"citadel",name:"The Citadel",pos:[-60,560,-40],desc:"House Augustus’s seat: white and red spires decorated with lions, tea parks, and gardens of honey roses. Nero hung art of his family’s deeds on its walls. The Triumph ends at its gates.",cam:{target:[-60,120,-40],r:1050,theta:.5,phi:1.0}},
    {id:"field",name:"Field of Mars",pos:[-60,70,330],desc:"The white-stone plaza at the Citadel entrance where Triumph parades end. At the Triumph celebration, Roque gives Darrow the box meant for his Triumph mask; Fitchner’s head is inside.",cam:{target:[-60,50,330],r:640,theta:.15,phi:.95}},
    {id:"via",name:"Via Triumphia",pos:[-60,30,1500],desc:"The white road of the Triumph, running from the Triumph Arch to the Field of Mars. Red rose petals along the route mark Gold casualties.",cam:{target:[-60,20,1250],r:1300,theta:.05,phi:.85}},
    {id:"walls",name:"City Walls",pos:[1100,230,0],desc:"Defensive walls about two hundred meters high ring the city. In the Iron Rain, Ragnar opens the gates from within.",cam:{target:[900,60,300],r:900,theta:1.1,phi:1.05}},
    {id:"river",name:"The River Gate",pos:[-200,60,1060],desc:"Darrow’s Iron Rain reaches Agea’s walls along the river route. A Brown girl’s EMP shuts down the Howlers’ armored suits as they come out of the water; Weed and Rotback drown before Darrow and Ragnar pull the others out.",cam:{target:[-200,10,1060],r:700,theta:.6,phi:1.05}},
    {id:"park",name:"Hadrian Park",pos:[520,90,-380],desc:"Central park near the financial district. The Sun Industries skyscraper, Quicksilver’s company, overlooks its west corner.",cam:{target:[520,40,-380],r:800,theta:.9,phi:.95}},
    {id:"opera",name:"Opera Agea Magnifica",pos:[-560,120,-360],desc:"The city’s grand opera house.",cam:{target:[-560,40,-360],r:560,theta:-.4,phi:1.0}},
    {id:"bazaar",name:"The Bazaar",pos:[700,40,620],desc:"The lowColor market quarter, near the spaceport and warehouses.",cam:{target:[700,20,620],r:600,theta:.7,phi:1.0}},
    {id:"port",name:"Spaceport",pos:[1650,40,200],desc:"Landing fields beyond the walls, where ships come down from orbit.",cam:{target:[1650,20,200],r:900,theta:1.2,phi:1.0}}
  ],
  build(ctx){const R=ctx.R,root=ctx.root;
    root.add(makeTerrain({size:9000,seg:360,height:ground,color}));
    /* river water */
    const rv=new THREE.PlaneGeometry(9000,1,600,1);rv.rotateX(-Math.PI/2);const rp=rv.attributes.position;
    for(let i=0;i<rp.count;i++){const x=rp.getX(i);const side=rp.getZ(i)>0?1:-1;rp.setZ(i,riverZ(x)+side*70);rp.setY(i,-9);}rv.computeVertexNormals();
    const water=new THREE.Mesh(rv,mats().water);water.receiveShadow=true;root.add(water);
    const B=new GeoBuilder(),Bm=new GeoBuilder(),Bl=new GeoBuilder();
    const WHITE=[0xf2ece1,0xe8e0d2,0xddd2c0,0xf6f1e8],RED=[0xa8402c,0x92382a,0xb54a33],SAND=[0xd8c3a3,0xcdb28e,0xbfa07c,0xe2d3bb];
    /* ---- the Citadel: white and red spires on the rise ---- */
    const cx=-60,cz=-40,cy=ground(cx,cz);
    B.add(G.cyl(430,470,30,40),TM(cx,cy-20,cz),0xcdbb9c,0,true);B.add(G.cyl(400,400,2,40),TM(cx,cy+9.5,cz),0x6f8a4a,0,true);
    for(let i=0;i<46;i++){const a=R()*TAU,r=Math.pow(R(),.6)*360;const x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;const h=180+Math.pow(1-r/360,1.6)*520+R()*80;const rad=10+R()*14;
      const red=R()<.35;ARCH.spire(B,x,cy+8,z,rad,h,red?RED[(R()*3)|0]:WHITE[(R()*4)|0],red?0xd9b060:(R()<.5?0xd9b060:0xf2ece1));}
    ARCH.spire(B,cx,cy+8,cz,34,820,0xf6f1e8,0xe0b860);
    for(let i=0;i<6;i++){const a=i/6*TAU;ARCH.spire(B,cx+Math.cos(a)*90,cy+8,cz+Math.sin(a)*90,20,560,i%2?0xa8402c:0xf2ece1,0xd9b060);}
    /* the Forum colonnade and palace halls */
    ARCH.colonnade(B,cx,cy+10,cz+230,360,60,16,0xf2ece1,0);
    B.add(G.box(300,70,120),TM(cx,cy+10,cz+150),0xe8e0d2,1);B.add(G.gable(320,40,140),TM(cx,cy+80,cz+150),0xa8402c);
    /* lions along the citadel approach */
    for(let i=0;i<10;i++){const s=i%2?1:-1;ARCH.statue(B,cx+s*70,cy+10,cz+270+Math.floor(i/2)*45,22,0xd9b060,s>0?-Math.PI/2:Math.PI/2);}
    /* ---- Field of Mars ---- */
    const fz=330;B.add(G.box(520,4,300),TM(cx,ground(cx,fz)+1,fz),0xf3eee4,0,true);
    for(let i=0;i<8;i++){const a=i/8*TAU;B.add(G.cyl(5,6,90,10),TM(cx+Math.cos(a)*230,ground(cx,fz),fz+Math.sin(a)*130),0xf3eee4);B.add(G.box(3,40,22),TM(cx+Math.cos(a)*230,ground(cx,fz)+46,fz+Math.sin(a)*130+12),0xb0342a,0,true);}
    /* ---- Via Triumphia and the Triumph Arch ---- */
    for(let z=480;z<2700;z+=60){B.add(G.box(70,3,62),TM(cx,ground(cx,z)+1,z),0xf5f0e6,0,true);}
    for(let z=520;z<2600;z+=120){[-1,1].forEach(s=>B.add(G.cyl(4,5,34,8),TM(cx+s*48,ground(cx+s*48,z),z),0xf0e8da));}
    B.add(G.arch(160,170,50,32),TM(cx,ground(cx,2700),2700),0xf3eee4);B.add(G.box(180,40,60),TM(cx,ground(cx,2700)+170,2700),0xe8e0d2);
    B.add(G.box(150,120,4),TM(cx,ground(cx,2700),2726),0xa22a20,0,true);/* the red curtain */
    /* ---- city walls (200 m) with towers and gates ---- */
    const WR=1150;const segs=40;
    for(let i=0;i<segs;i++){const a0=i/segs*TAU,a1=(i+1)/segs*TAU;const x0=Math.cos(a0)*WR*1.12,z0=Math.sin(a0)*WR,x1=Math.cos(a1)*WR*1.12,z1=Math.sin(a1)*WR;
      if(Math.abs(Math.atan2(Math.sin(a0-Math.PI/2),Math.cos(a0-Math.PI/2)))<.05)continue;
      ARCH.wall(B,x0,z0,x1,z1,Math.min(ground(x0,z0),ground(x1,z1))-6,46,14,0xd9cdb8);ARCH.tower(B,x0,Math.min(ground(x0,z0),0)-6,z0,22,64,0xe6dccb,i%4===0?"gold":null,1);}
    /* ---- districts ---- */
    const inCity=(x,z)=>Math.hypot(x/1.12,z)<WR-60;
    const avoid=(x,z)=>!inCity(x,z)||Math.hypot(x-cx,z-cz)<480||(Math.abs(x-cx)<120&&z>200)||(Math.abs(x-cx)<300&&z>180&&z<500)||Math.hypot(x-520,z+380)<230||Math.hypot(x+560,z+360)<150||Math.hypot(x-700,z-620)<190||Math.abs(z-riverZ(x))<160;
    ARCH.district(B,0,0,2600,58,(x,z,r)=>{const d=Math.hypot(x,z);return 30+Math.pow(r(),2.2)*230*(1-d/1400)+(d<800?R()*60:0);},ground,WHITE.concat(SAND,SAND,[0xa8402c]),11,avoid);
    /* financial district towers near the park + Sun Industries tower */
    for(let i=0;i<14;i++){const x=520+(R()-.5)*460,z=-380+(R()<.5?-1:1)*(240+R()*120);if(Math.hypot(x-520,z+380)<230)continue;Bm.add(G.box(40+R()*20,260+R()*320,40+R()*20),TM(x,ground(x,z),z,R()),0x9fb4c0,1);}
    Bm.add(G.box(70,780,70),TM(300,ground(300,-560),-560,.3),0xd8b366,1);Bm.add(G.cone(36,120,4),TM(300,ground(300,-560)+780,-560,Math.PI/4+.3),0xe8c879);
    /* Hadrian Park lawn */
    B.add(G.cyl(220,220,3,40),TM(520,ground(520,-380)+.5,-380),0x5f7d3e,0,true);B.add(G.cyl(60,60,4,24),TM(520,ground(520,-380)+1,-380),0x3e6f84,0,true);
    /* opera: domed hall with colonnade */
    const ox=-560,oz=-360,oy=ground(ox,oz);B.add(G.cyl(110,120,70,32),TM(ox,oy,oz),0xf0e8da,1);B.add(G.dome(110,32),TM(ox,oy+70,oz),0xd9b060);ARCH.colonnade(B,ox,oy,oz+130,200,60,10,0xf6f1e8,0);
    /* bazaar: dense low stalls with awnings */
    for(let i=0;i<260;i++){const a=R()*TAU,r=Math.sqrt(R())*180;const x=700+Math.cos(a)*r,z=620+Math.sin(a)*r;const y=ground(x,z);const w=10+R()*12;
      B.add(G.box(w,8+R()*10,w),TM(x,y,z,R()),SAND[(R()*4)|0],1);if(R()<.6)B.add(G.box(w*1.2,1.5,w*.9),TM(x,y+12,z,R()),[0xb5462f,0x3f6f87,0xc98b2e,0x7a3f6e,0x4f7a3e][(R()*5)|0],0,true);}
    /* spaceport: landing pads and parked ships */
    for(let i=0;i<9;i++){const x=1550+(i%3)*150,z=60+Math.floor(i/3)*150;const y=ground(x,z);Bm.add(G.cyl(60,62,4,24),TM(x,y,z),0x6d6863,0,true);
      if(R()<.75){const sh=makeShip(R()<.5?"torch":"frigate",34+R()*20);sh.position.set(x,y+40,z);sh.rotation.y=R()*TAU;root.add(sh);}}
    /* outlying villas and farms on the canyon floor */
    for(let i=0;i<180;i++){const x=(R()-.5)*7000,z=(R()-.5)*2600;if(inCity(x,z)||Math.abs(z-riverZ(x))<160||ground(x,z)>60)continue;B.add(G.box(16+R()*20,10+R()*14,16+R()*20),TM(x,ground(x,z),z,R()),SAND[(R()*4)|0],1);}
    root.add(B.mesh(mats().bld));root.add(Bm.mesh(mats().metal));
    /* beacons on the spire tips that glow at night */
    const beacons=new THREE.Group();root.add(beacons);
    [[cx,cy+8+820,cz,90],[300,ground(300,-560)+900,-560,70]].concat(Array.from({length:6},(_,i)=>{const a=i/6*TAU;return [cx+Math.cos(a)*90,cy+8+560,cz+Math.sin(a)*90,50];})).forEach(b=>{const s=glowSprite(GLOW_WARM,b[3],0);s.position.set(b[0],b[1],b[2]);beacons.add(s);});
    SITES.agea.onTod=n=>beacons.children.forEach(s=>s.material.opacity=n*.95);
    /* trees: gardens in the citadel, park, along the river and farms */
    const trees=scatter(2600,7000,R,(x,z)=>{const h=ground(x,z);if(h>70||Math.abs(z-riverZ(x))<75)return null;
      const inPark=Math.hypot(x-520,z+380)<200&&Math.hypot(x-520,z+380)>70,inGarden=Math.hypot(x-cx,z-cz)<470&&Math.hypot(x-cx,z-cz)>380;
      const nearRiver=Math.abs(z-riverZ(x))<260;const farm=!inCity(x,z)&&N.f(x*.002,5,z*.002,3)>.55;
      if(!(inPark||inGarden||nearRiver||farm))return null;return {x,y:h,z,s:6+R()*6,c:[0x4f6b33,0x5d7a3a,0x3f5a2c,0x6e8540][(R()*4)|0]};});
    root.add(makeForest(trees,"broad",7));
    /* air traffic: airCars on lanes over the city */
    const cars=[];const carGeo=new THREE.BoxGeometry(6,2,3);const carMat=new THREE.MeshBasicMaterial({color:col(0xffe2b0)});
    for(let i=0;i<120;i++){const m=new THREE.Mesh(carGeo,carMat);root.add(m);cars.push({m,r:300+R()*900,a:R()*TAU,y:120+R()*380,sp:(R()<.5?-1:1)*(.02+R()*.05),ex:1.12});}
    return {update(dt,t){cars.forEach(c=>{c.a+=c.sp*dt;c.m.position.set(Math.cos(c.a)*c.r*c.ex,c.y,Math.sin(c.a)*c.r);c.m.rotation.y=-c.a;});}};
  }};
})();

/* ---- 41-site-institute.js ---- */
/* ===================== THE INSTITUTE ===================== */
(function(){
const N=makeNoise(202);
/* north is -z. Western mountains, Argos River north to south, Highlands north, Greatwoods east, South Sea south. */
const riverX=z=>-420+Math.sin(z*.0007+.4)*330+Math.sin(z*.0021)*70;
const shoreZ=x=>2750+Math.sin(x*.0009+.3)*260+Math.sin(x*.0031)*60;
function polyDist(px,pz,pts){let best=1e9;for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];const dx=b[0]-a[0],dz=b[1]-a[1];let t=((px-a[0])*dx+(pz-a[1])*dz)/(dx*dx+dz*dz);t=Math.max(0,Math.min(1,t));best=Math.min(best,Math.hypot(px-a[0]-dx*t,pz-a[1]-dz*t));}return best;}
const WTRIB=[[-3150,-3050],[-2700,-2300],[-2200,-1250],[-1500,-700],[riverX(-350),-350]];
const WSTREAM=[[-3300,-700],[-2750,-1050],[-2200,-1250]];
const FUROR=[[350,-3950],[30,-3560],[-120,-3420]],METAS=[[300,-2900],[40,-3280],[-120,-3420]];
const ETRIB=[[-120,-3420],[-260,-2700],[riverX(-1950),-1950]];
const RIVERS=[{pts:WTRIB,w:46},{pts:WSTREAM,w:32},{pts:FUROR,w:30},{pts:METAS,w:30},{pts:ETRIB,w:44}];
function riverDist(x,z){let d=Math.abs(x-riverX(z));let w=78;if(z>shoreZ(x))d=1e9;
  RIVERS.forEach(r=>{const dd=polyDist(x,z,r.pts);if(dd-r.w<d-w){d=dd;w=r.w;}});return d-w;}
const HIGH=[650,-3400],POST=[3700,-3300];
function base(x,z){
  let h=(N.f(x*.0007,0,z*.0007,5)-.5)*90+30;
  const m=sst(-2500,-3700,x);let ridge=1-Math.abs(N.f(x*.0011,4,z*.0011,4)*2-1);
  let pass=1-.6*Math.exp(-Math.pow((z+2350)/650,2))-.45*sst(-200,1600,z);
  h+=m*(700+ridge*900)*pass;
  const dh=Math.hypot((x-HIGH[0])/1500,(z-HIGH[1])/950);h+=sst(1.05,.55,dh)*(300+N.f(x*.002,1,z*.002,3)*90);
  const dp=Math.hypot(x-POST[0],z-POST[1]);h+=sst(1500,300,dp)*(140+Math.sin(x*.006)*Math.cos(z*.005)*90+N.f(x*.003,2,z*.003,3)*120);
  h+=crag(x,z);
  return h;}
/* every castle stands on a crag of its own: a flat crown, cliffs falling away, broken rock at the foot */
function crag(x,z){let h=0;for(let i=0;i<HOUSES.length;i++){const H=HOUSES[i];if(H.under)continue;const dx=x-H.x,dz=z-H.z;if(Math.abs(dx)>H.s*3||Math.abs(dz)>H.s*3)continue;
    const a=Math.atan2(dz,dx);const d=Math.hypot(dx,dz)*(1+(N.f(Math.cos(a)*2+i,Math.sin(a)*2,i,3)-.5)*.5);const top=H.s*(H.id==="mars"?1.5:1.05);
    const cliff=(1-sst(H.s*.7,H.s*1.05,d))*.72+(1-sst(H.s*.9,H.s*2.4,d))*.28;const rough=d>H.s*.68?(N.f(x*.03,i,z*.03,3)-.5)*H.s*.3*(1-sst(H.s*1.2,H.s*2.4,d)):0;
    h=Math.max(h,top*cliff+rough);}
  return h;}
function nearCrag(x,z){for(const H of HOUSES){if(H.under)continue;const d=Math.hypot(x-H.x,z-H.z);if(d<H.s*2.4)return 1-sst(H.s*.8,H.s*2.4,d);}return 0;}
function ground(x,z){let h=base(x,z);const sz=shoreZ(x);
  if(z>sz-120){const k=sst(sz-120,sz+260,z);h=h*(1-k)+(-70)*k;}
  const rd=riverDist(x,z);if(rd<40)h-=sst(40,-20,rd)*26;
  return h;}
const WATER_Y=-22;
function inGreat(x,z){return x>1150&&z>-1900&&z<shoreZ(x)-140&&N.f(x*.0016,9,z*.0016,3)>.32;}
function inNorth(x,z){const n=(N.f(x*.0015,11,z*.0015,3)-.5)*900;return z<-2650+n&&x<-120+n*.5&&x>-2700+n&&Math.hypot((x-HIGH[0])/1500,(z-HIGH[1])/950)>.9&&N.f(x*.004,12,z*.004,2)>.3;}
function color(x,z,h,slope){
  let c;const g=N.f(x*.002,5,z*.002,4);
  c=mixc([110,132,64],[150,150,78],g);
  if(inGreat(x,z))c=mixc([46,74,36],[60,86,40],g);
  if(inNorth(x,z))c=mixc([52,72,44],[70,86,52],g);
  if(h>380){c=mixc(c,[120,110,92],sst(380,700,h));c=mixc(c,[92,84,74],slope*1.4);}
  if(h>1050)c=mixc(c,[238,238,240],sst(1050,1250,h+N.f(x*.01,0,z*.01,2)*80));
  if(slope>.45&&h<380)c=mixc(c,[118,102,80],(slope-.45)*2);
  const nc=nearCrag(x,z);if(nc>0){const rock=mixc([122,118,108],[82,80,74],N.f(x*.012,3,z*.012,3));const moss=mixc([78,96,52],[54,72,40],N.f(x*.02,6,z*.02,3));
    c=mixc(c,mixc(rock,moss,sst(.75,.25,slope)*.65+(N.f(x*.015,8,z*.015,3)-.5)*.8+.15),Math.min(1,nc*1.6)*sst(.08,.3,slope));}
  const rd=riverDist(x,z);if(rd<55)c=mixc([152,140,110],c,sst(10,55,rd));
  if(z>shoreZ(x)-160)c=mixc(c,[206,192,150],sst(shoreZ(x)-160,shoreZ(x)-40,z));
  return c;}
function snow(x,z,h,slope,lin){const w=Math.min(1,.82+N.vn(x*.01,1,z*.01)*.18);const s=col(0xeef1f6);const k=slope>.6?.5:.92;
  return [lin[0]+(s.r*w-lin[0])*k,lin[1]+(s.g*w-lin[1])*k,lin[2]+(s.b*w-lin[2])*k];}
/* House castles. Positions follow the Institute map described in the books and wiki; banner colors are this atlas's choice. */
const HOUSES=[
 {id:"mars",name:"Castle Mars",x:700,z:-3480,s:260,c:0xb03526,note:"On the Highlands. Phobos and Deimos, two towers, guard its western approach where the Furor and Metas rivers meet."},
 {id:"minerva",name:"Castle Minerva",x:2300,z:-2550,s:190,c:0x3b5f9a,note:"On the plains between the Postern Hills and the Highlands. Mustang’s House."},
 {id:"diana",name:"Castle Diana",x:2150,z:-1250,s:170,c:0x3f7a4a,note:"Deep in the northern Greatwoods, southeast of the Highlands."},
 {id:"ceres",name:"Castle Ceres",x:-260,z:-1900,s:175,c:0xd2a645,note:"South of the Northwoods, where the eastern tributary meets the Argos."},
 {id:"apollo",name:"Castle Apollo",x:3350,z:2150,s:190,c:0xe0b84a,note:"On the southeastern edge of the Greatwoods."},
 {id:"jupiter",name:"Castle Jupiter",x:-3150,z:-2350,s:190,c:0x6a4aa0,note:"Guarding the low passes just south of the northernmost western mountains."},
 {id:"pluto",name:"Castle Pluto",x:-3150,z:-650,s:150,c:0x2a2a30,under:true,note:"Underground, in the low mountains south of Jupiter. The Jackal’s House."},
 {id:"juno",name:"Castle Juno",x:-2200,z:-1250,s:160,c:0x2f8a8a,note:"Where two rivers join, northeast of Pluto."},
 {id:"vulcan",name:"Castle Vulcan",x:-1250,z:350,s:165,c:0xc86a2a,note:"On the west bank of the Argos, southeast of Juno."},
 {id:"venus",name:"Castle Venus",x:250,z:1000,s:160,c:0xc87a9a,note:"Thought to stand on the east bank of the Argos, southeast of Vulcan."},
 {id:"bacchus",name:"Castle Bacchus",x:1450,z:2450,s:160,c:0x7a2a4a,note:"Thought to stand on the southwest edge of the Greatwoods, by the South Sea."},
 {id:"mercury",name:"Castle Mercury",x:-2750,z:2350,s:160,c:0xa8b0b8,note:"Thought to stand on the western shore of the South Sea, below the mountains."},
 {id:"neptune",name:"Castle Neptune",x:150,z:4500,s:160,c:0x2a6a9a,note:"Thought to stand on the far southern shore of the South Sea."}];
const OLY={x:350,y:2300,z:-500};
/* A stone keep after the concept art: a tall square tower over stepped blocks that follow the crag,
   flat crenellated roofs, narrow window slits, moss climbing the lower walls. Returns the banner point. */
function keep(B,x,y,z,s,c,seed,grand){const R=rng(seed);const MOSS=0x6f7c4e,SLIT=0x1c1a18;const st=c;
  const block=(bx,by,bz,w,h,d,ry,k)=>{B.add(G.box(w,h,d),TM(bx,by,bz,ry),k||st,1);
    /* crenellations */
    const nx=Math.max(2,Math.round(w/(s*.07))),nz=Math.max(2,Math.round(d/(s*.07)));const ca=Math.cos(ry),sa=Math.sin(ry);
    for(let i=0;i<nx;i++){const u=-w/2+(i+.5)*w/nx;[[u,-d/2],[u,d/2]].forEach(([lx,lz])=>B.add(G.box(w/nx*.55,s*.035,s*.03),TM(bx+lx*ca+lz*sa,by+h,bz-lx*sa+lz*ca,ry),k||st));}
    for(let i=0;i<nz;i++){const v=-d/2+(i+.5)*d/nz;[[-w/2,v],[w/2,v]].forEach(([lx,lz])=>B.add(G.box(s*.03,s*.035,d/nz*.55),TM(bx+lx*ca+lz*sa,by+h,bz-lx*sa+lz*ca,ry),k||st));}
    /* window slits on the long faces */
    const rows=Math.max(1,Math.floor(h/(s*.16)));for(let r=0;r<rows;r++)for(let i=0;i<nx-1;i++){if(R()<.45)continue;const u=-w/2+(i+1)*w/nx;const yy=by+h*(r+.55)/rows;
      B.add(G.box(s*.016,s*.055,1.2),TM(bx+u*ca+(d/2+.4)*sa,yy,bz-u*sa+(d/2+.4)*ca,ry),SLIT,0,true);}
    /* moss on the lower walls */
    if(R()<.8)B.add(G.box(w*1.012,h*(.2+R()*.3),d*1.012),TM(bx,by,bz,ry),MOSS,0,true);};
  const ry=R()*TAU;const ca=Math.cos(ry),sa=Math.sin(ry);const at=(u,v)=>[x+u*ca+v*sa,z-u*sa+v*ca];
  const K=s*(grand?1.15:.95);const TONES=[st,0xc4beb0,0xb2ac9e,0xd0cabc];
  /* the great keep */
  const kh=K*.95;let [kx,kz]=at(0,-K*.05);block(kx,y,kz,K*.4,kh,K*.34,ry);
  /* a cluster of stepped halls and towers around it, falling away over the cliff edge */
  const steps=grand?11:6;for(let i=0;i<steps;i++){const a=i/steps*TAU+R()*.5,rr=K*(.25+R()*.35);const u=Math.cos(a)*rr,v=Math.sin(a)*rr;const [bx,bz]=at(u,v);const d=rr/K;
    const h=K*(.28+R()*.45)*(1.1-d*.6);const drop=Math.max(0,d-.42)*K*1.3;const w=K*(.16+R()*.2),dd=K*(.14+R()*.18);
    block(bx,y-drop,bz,w,h+drop,dd,ry+(R()<.35?Math.PI/2:0),TONES[(R()*4)|0]);}
  /* a slender watch tower on the keep */
  const [tx,tz]=at(K*.1,-K*.1);block(tx,y+kh,tz,K*.14,K*.28,K*.14,ry,0xcac4b6);
  /* curtain wall and gate tower toward the approach */
  const [gx,gz]=at(0,K*.55);const [w1x,w1z]=at(-K*.42,K*.4),[w2x,w2z]=at(K*.42,K*.4);
  ARCH.wall(B,w1x,w1z,gx,gz,y-K*.18,K*.22,K*.05,st);ARCH.wall(B,gx,gz,w2x,w2z,y-K*.18,K*.22,K*.05,st);block(gx,y-K*.2,gz,K*.14,K*.36,K*.14,ry);
  B.add(G.arch(K*.07,K*.1,K*.06,K*.02),TM(gx,y-K*.2,gz,ry),0x2a2320);
  /* buttress walls dropping down the cliff */
  for(let i=0;i<(grand?6:3);i++){const a=R()*TAU;const [bx,bz]=[x+Math.cos(a)*K*.55,z+Math.sin(a)*K*.55];B.add(G.box(K*.08,K*.6,K*.2),TM(bx,y-K*.55,bz,-a),st,1);B.add(G.box(K*.082,K*.3,K*.205),TM(bx,y-K*.55,bz,-a),MOSS,0,true);}
  return [tx,y+kh+K*.32,tz];}
const lm=[];
HOUSES.forEach(h=>lm.push({id:"castle_"+h.id,name:h.name,minor:h.id!=="mars",pos:[h.x,0,h.z],desc:h.note,cam:{target:[h.x,0,h.z],r:h.id==="mars"?1300:1000,theta:.4,phi:1.0}}));
lm.unshift(
 {id:"olympus",name:"Olympus",pos:[OLY.x,OLY.y+260,OLY.z],desc:"An artificial mountain floating about two kilometers above the grounds, crowned by a bone-pale marble citadel and armory. The Proctors watch every House from here. Darrow’s army storms it with the Proctors’ own flying boots.",cam:{target:[OLY.x,OLY.y,OLY.z],r:1900,theta:.5,phi:1.15}},
 {id:"passage",name:"The Passage",pos:[700,0,-3480],desc:"A dark stone room beneath each castle. On the first night, students are paired off and sealed in to fight; half of every House dies. Darrow kills Julian au Bellona here.",cam:{target:[700,0,-3480],r:600,theta:.9,phi:.85}},
 {id:"phobosdeimos",name:"Phobos & Deimos",pos:[-120,0,-3420],desc:"Two towers guarding the western side of the Highlands, where the rivers Furor and Metas meet.",cam:{target:[-120,0,-3420],r:900,theta:-.3,phi:1.0}},
 {id:"argos",name:"Argos River",pos:[riverX(0),0,0],desc:"The great river running north to south through the middle of the Institute into the South Sea.",cam:{target:[riverX(0),0,0],r:2200,theta:.2,phi:1.0}},
 {id:"greatwoods",name:"The Greatwoods",pos:[2600,0,400],desc:"Forest covering much of the east, its godTrees as tall as buildings, blotting out the sun above tentacle-like roots.",cam:{target:[2500,0,300],r:1700,theta:.6,phi:1.1}},
 {id:"northwoods",name:"Northwoods",pos:[-1300,0,-3600],desc:"Pine forest at the northern end of the Argos, between its western tributary and the Highlands.",cam:{target:[-1300,0,-3500],r:1600,theta:.2,phi:1.05}},
 {id:"highlands",name:"The Highlands",pos:[700,0,-3000],desc:"Raised ground in the north, home of Castle Mars.",cam:{target:[700,0,-3300],r:2400,theta:.2,phi:1.0}},
 {id:"posterns",name:"Postern Hills",pos:[3700,0,-3300],desc:"Rolling hills along the northeastern edge of the Institute.",cam:{target:[3500,0,-3200],r:2000,theta:.5,phi:1.0}},
 {id:"southsea",name:"South Sea",pos:[0,WATER_Y,3500],desc:"A large body of water at the southern end of the Institute, where the Argos empties.",cam:{target:[0,0,3300],r:3000,theta:.1,phi:1.0}},
 {id:"mountains",name:"Western Mountains",pos:[-3800,0,-1500],desc:"A snowy range along the western edge, with low passes in the middle and south.",cam:{target:[-3500,0,-1500],r:2800,theta:-.8,phi:1.0}});
lm.forEach(l=>{if(l.id!=="olympus"&&l.id!=="southsea"){l.pos[1]=Math.max(ground(l.pos[0],l.pos[2]),WATER_Y)+60;l.cam.target[1]=Math.max(ground(l.cam.target[0],l.cam.target[2]),WATER_Y);}});
lm.find(l=>l.id==="passage").pos[1]-=40;

SITES.institute={name:"The Institute",body:"mars",poi:"institute",pois:["olympus"],epithet:"Valles Marineris · eighty kilometers east of Agea",seed:9,
  blurb:"A terraformed valley where each year’s Gold class is split into twelve Houses and set loose to conquer one another. The Proctors control the climate to mimic Earth’s seasons, and watch it all from Olympus.",
  facts:[["Houses","Twelve, each with a castle and standard"],["Judges","The Proctors, on Olympus"],["Victory","Capture every House’s standard"],["Winner","Darrow, House Mars, Red Rising"]],
  note:"Castle positions follow the map described in the books and on the Red Rising wiki; several southern Houses are only presumed. Castle designs and banner colors are this atlas’s own.",
  ground,targetLift:0,bounds:5600,minR:250,maxR:16000,shadow:5200,win:[3,2.6],winK:.8,cam:{target:[0,120,-400],r:9800,theta:.22,phi:.92},defaultTod:"day",
  skyBody:{id:"phobos",dir:[.4,.3,-.85],size:260},
  tods:{
    day:{top:0x4f7fb8,hor:0xd9d2c0,bot:0x8a8a7a,sun:0xfff2dc,sunEl:.85,sunAz:-.7,sunI:3.1,skyL:0xbcd2f0,gndL:0x5a5038,hemiI:.85,fog:0xc8d0d8,fogD:.000045,night:0,exp:.95,haze:.4},
    dusk:{top:0x2a3560,hor:0xf09050,bot:0x5a3a30,sun:0xffa060,sunEl:.06,sunAz:-.6,sunI:2.5,skyL:0x8a7aa0,gndL:0x4a3428,hemiI:.6,fog:0xb87458,fogD:.00005,night:.5,exp:1.05,haze:1},
    night:{top:0x04060e,hor:0x161a28,bot:0x0a0a0e,sun:0x8aa4e0,sunEl:.6,sunAz:2.0,sunI:.25,skyL:0x2a3050,gndL:0x0c0c10,hemiI:.22,fog:0x10121a,fogD:.00004,night:1,exp:1.1,stars:1},
    winter:{top:0x7b93b0,hor:0xdfe4ea,bot:0xb8c0c8,sun:0xf2f4ff,sunEl:.35,sunAz:-.5,sunI:2.4,skyL:0xcfd8e6,gndL:0x8a909a,hemiI:.95,fog:0xd8dee6,fogD:.00008,night:.15,exp:.92,haze:.5,snow:1}},
  landmarks:lm,
  build(ctx){const R=ctx.R,root=ctx.root;
    const terr=makeTerrain({size:12000,seg:440,height:ground,color,snow});root.add(terr);
    /* water: sea plane + river ribbons */
    const sea=new THREE.Mesh(new THREE.PlaneGeometry(14000,5200).rotateX(-Math.PI/2),mats().water.clone());sea.material.side=THREE.DoubleSide;sea.position.set(0,WATER_Y,4200);root.add(sea);
    function ribbon(fnPts,w){const pts=fnPts;const g=new THREE.BufferGeometry();const pos=[],idx=[];
      for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)];let dx=b[0]-a[0],dz=b[1]-a[1];const L=Math.hypot(dx,dz)||1;dx/=L;dz/=L;
        const y=Math.min(base(pts[i][0],pts[i][1])-10,i?pos[pos.length-2]:1e9);
        pos.push(pts[i][0]-dz*w,y,pts[i][1]+dx*w,pts[i][0]+dz*w,y,pts[i][1]-dx*w);if(i){const k=i*2;idx.push(k-2,k-1,k,k-1,k+1,k);}}
      g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();const m=new THREE.Mesh(g,sea.material);m.receiveShadow=true;root.add(m);}
    const ap=[];for(let z=-5600;z<shoreZ(riverX(2800))+80;z+=40)ap.push([riverX(z),z]);ribbon(ap,72);
    const dens=pts=>{const o=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/40);for(let k=0;k<n;k++)o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}o.push(pts[pts.length-1]);return o;};
    RIVERS.forEach(r=>ribbon(dens(r.pts),r.w));
    const B=new GeoBuilder(),Bd=new GeoBuilder();
    const STONE=0xcfc6b4,DSTONE=0x8f877a;
    function banner(x,y,z,c,h){B.add(G.cyl(1.5,1.8,h,6),TM(x,y,z),0x5a4a3a);B.add(G.box(2,h*.32,h*.22),TM(x,y+h*.6,z+h*.11),c,0,true);}
    HOUSES.forEach((H,i)=>{const y=ground(H.x,H.z);
      if(H.under){/* cave mouth in the mountainside */
        Bd.add(G.arch(120,110,60,26),TM(H.x,y-6,H.z,.7),0x3a3432);Bd.add(G.box(80,70,40),TM(H.x-6,y-6,H.z-6,.7),0x0a0808,0,true);
        for(let k=0;k<4;k++)banner(H.x+Math.cos(.7+k)*90,y,H.z+Math.sin(.7+k)*90,H.c,60);return;}
      const top=keep(B,H.x,y,H.z,H.s,H.id==="mars"?0xcfc8b8:0xc6c0b2,i+3,H.id==="mars");
      banner(top[0],top[1],top[2],H.c,H.s*.42);});
    /* mist pooling around the crags */
    const mists=[];HOUSES.forEach((H,i)=>{if(H.under)return;const y=ground(H.x,H.z);for(let k=0;k<(H.id==="mars"?7:4);k++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW_WHITE,transparent:true,opacity:.32,depthWrite:false,fog:true}));
      const a=R()*TAU,r=H.s*(1.2+R()*1.2),sc=H.s*(2.4+R()*1.6);s.scale.set(sc,sc*.32,1);s.position.set(H.x+Math.cos(a)*r,y-H.s*(.55+R()*.5),H.z+Math.sin(a)*r);root.add(s);mists.push(s);}});
    SITES.institute._mists=mists;
    /* Phobos and Deimos towers */
    [[-170,-3620],[-60,-3220]].forEach(p=>{const y=ground(p[0],p[1]);B.add(G.cyl(42,52,30,16),TM(p[0],y-20,p[1]),DSTONE);ARCH.tower(B,p[0],y+8,p[1],32,300,0xd6ccb8,"cone",1);banner(p[0],y+8+300+70,p[1],0xb03526,90);});
    /* ---- Olympus: a floating mountain with a marble citadel ---- */
    const oly=new THREE.Group();oly.position.set(OLY.x,OLY.y,OLY.z);root.add(oly);
    const rock=new THREE.ConeGeometry(620,1150,28,10,false);rock.rotateX(Math.PI);rock.translate(0,-575,0);
    {const p=rock.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const k=1+(N.f(x*.004+3,y*.004,z*.004,4)-.5)*.75+(N.vn(x*.02,y*.02,z*.02)-.5)*.12;if(y<-5)p.setXYZ(i,x*k,y*(1+(N.f(x*.006,1,z*.006,3)-.5)*.2),z*k);}rock.computeVertexNormals();}
    const OB=new GeoBuilder();OB.add(rock,null,0x7a6e62,0,true);
    OB.add(G.cyl(640,620,40,32),TM(0,-40,0),0x8a7d6c,0,true);
    OB.add(G.cyl(600,600,4,32),TM(0,0,0),0x6f8a4a,0,true);
    /* bone-pale citadel */
    const PALE=0xf1ece2;
    OB.add(G.cyl(160,190,90,24),TM(0,0,0),PALE,1);OB.add(G.dome(150,28),TM(0,90,0),0xe9dfcc);OB.add(G.cyl(10,14,120,10),TM(0,230,0),0xd9b060);
    for(let k=0;k<16;k++){const a=k/16*TAU;OB.add(G.cyl(9,10,90,10),TM(Math.cos(a)*205,0,Math.sin(a)*205),PALE);}
    OB.add(G.torus(205,12,48),TM(0,92,0,0,1,1,1,Math.PI/2),PALE);
    for(let k=0;k<6;k++){const a=k/6*TAU+.3;ARCH.tower(OB,Math.cos(a)*430,0,Math.sin(a)*430,34,190,PALE,"gold",1);
      OB.add(G.box(120,60,70),TM(Math.cos(a)*330,0,Math.sin(a)*330,-a),PALE,1);}
    for(let k=0;k<14;k++){const a=k/14*TAU+.15,r=300+(k%2)*150;const x=Math.cos(a)*r,z=Math.sin(a)*r;const w=60+R()*30,d=34+R()*14;
      OB.add(G.box(w,30,d),TM(x,0,z,-a),PALE,1);OB.add(G.gable(w*1.05,18,d*1.1),TM(x,30,z,-a+Math.PI/2),0xe3d8c4);ARCH.colonnade(OB,x+Math.cos(a)*(d*.7),0,z+Math.sin(a)*(d*.7),w,28,6,PALE,-a+Math.PI/2);}
    for(let k=0;k<4;k++){const a=k/4*TAU+.8;ARCH.statue(OB,Math.cos(a)*250,0,Math.sin(a)*250,26,0xd9b060,-a);}
    /* broken rocks hanging beneath */
    for(let k=0;k<9;k++){const g=new THREE.DodecahedronGeometry(40+R()*70,0);const a=R()*TAU,r=200+R()*420;OB.add(g,TM(Math.cos(a)*r,-260-R()*500,Math.sin(a)*r,R(),1,1.4,1),0x6a6058,0,true);}
    const om=OB.mesh(mats().bld);om.castShadow=false;oly.add(om);
    const oGlow=glowSprite(GLOW_BLUE,1300,.25);oGlow.position.y=-900;oly.add(oGlow);
    for(let k=0;k<5;k++){const s=glowSprite(GLOW_WHITE,80,.6);s.position.set(Math.cos(k/5*TAU)*430,260,Math.sin(k/5*TAU)*430);oly.add(s);}
    root.add(B.mesh(mats().bld));root.add(Bd.mesh(mats().bld));
    /* ---- forests ---- */
    const god=scatter(3200,11000,R,(x,z)=>{if(!inGreat(x,z)||riverDist(x,z)<60)return null;const h=ground(x,z);if(h<WATER_Y+6)return null;if(HOUSES.some(H=>Math.hypot(x-H.x,z-H.z)<H.s*1.1))return null;return {x,y:h,z,s:20+R()*22,c:[0x2f5a2a,0x3a6630,0x2a4f26,0x44702f][(R()*4)|0]};});
    root.add(makeForest(god,"broad",11));
    const pines=scatter(2600,11000,R,(x,z)=>{const h=ground(x,z);const north=inNorth(x,z);const mount=h>300&&h<1000&&N.f(x*.003,4,z*.003,3)>.45;if(!(north||mount)||riverDist(x,z)<50||h<WATER_Y+6)return null;return {x,y:h,z,s:11+R()*8,c:[0x2c4a32,0x355a3a,0x2a4430][(R()*3)|0]};});
    root.add(makeForest(pines,"pine",13));
    const copse=scatter(1400,11000,R,(x,z)=>{const h=ground(x,z);if(h>360||h<WATER_Y+8||inGreat(x,z)||inNorth(x,z)||riverDist(x,z)<40)return null;const near=riverDist(x,z)<240;if(!near&&N.f(x*.004,7,z*.004,3)<.6)return null;if(HOUSES.some(H=>Math.hypot(x-H.x,z-H.z)<H.s*1.1))return null;return {x,y:h,z,s:8+R()*7,c:[0x4f6f34,0x5e7b3a,0x6d8640][(R()*3)|0]};});
    root.add(makeForest(copse,"broad",17));
    /* drifting clouds below Olympus */
    const clouds=[];const cm=new THREE.SpriteMaterial({map:GLOW_WHITE,transparent:true,opacity:.22,depthWrite:false});
    for(let i=0;i<26;i++){const s=new THREE.Sprite(cm.clone());const sc=700+R()*900;s.scale.set(sc,sc*.35,1);s.position.set((R()-.5)*9000,900+R()*700,(R()-.5)*8000);root.add(s);clouds.push(s);}
    SITES.institute._snow=k=>{terr.userData.setSnow(k);MAT.tree.emissive.copy(col(0xb8c0c8)).multiplyScalar(k*.45);sea.material.color.copy(col(0x2a5a6a)).lerp(col(0xdfe8ee),k*.8);sea.material.roughness=.12+k*.6;};
    return {update(dt,t){oly.position.y=OLY.y+Math.sin(t*.25)*30;oly.rotation.y+=dt*.01;clouds.forEach((c,i)=>{c.position.x+=dt*(18+i%5*4);if(c.position.x>4800)c.position.x=-4800;});}};
  }};
})();

/* ---- 42-site-hyperion.js ---- */
/* ===================== HYPERION (LUNA) ===================== */
(function(){
const N=makeNoise(303);
/* north is -z: the Sea of Serenity. The city runs along the south shore; the Citadel of Light holds the western edge. */
const shoreZ=x=>-1900+Math.sin(x*.0008)*220+Math.sin(x*.0027+1)*70;
const CIT={x:-3300,z:150};
function ground(x,z){let h=(N.f(x*.0009,0,z*.0009,4)-.5)*50;
  /* craters */
  [[1800,1900,520],[-600,2600,380],[4200,800,460],[2600,-600,260]].forEach(c=>{const d=Math.hypot(x-c[0],z-c[1])/c[2];if(d<1.35)h+=d<1?(d*d-1)*60:Math.exp(-Math.pow((d-1)*5,2))*40;});
  /* Palatine (NW of citadel) and Esqueline (SE) hills */
  h+=sst(900,150,Math.hypot(x-(CIT.x-700),z-(CIT.z-650)))*140;
  h+=sst(1100,200,Math.hypot(x-(CIT.x+800),z-(CIT.z+800)))*110;
  h+=sst(650,120,Math.hypot(x-CIT.x,z-CIT.z))*60;
  const sz=shoreZ(x);if(z<sz+150){const k=sst(sz+150,sz-350,z);h=h*(1-k)-60*k;}
  return h;}
const SEA_Y=-18;
function color(x,z,h,slope){let c=mixc([128,124,118],[160,156,148],N.f(x*.002,1,z*.002,4));
  const dc=Math.hypot(x-CIT.x,z-CIT.z);if(dc<1900)c=mixc([70,96,58],c,sst(1500,1900,dc));
  if(x>-2200&&x<4200&&z>shoreZ(x)+200&&z<2400)c=mixc(c,[88,84,82],.55);
  if(z<shoreZ(x)+220)c=mixc(c,[196,186,164],sst(shoreZ(x)+220,shoreZ(x)+60,z));
  return c;}
const lm=[
 {id:"sovspire",name:"The Sovereign’s Spire",pos:[CIT.x,1900,CIT.z],desc:"The highest point of the Citadel, rising from its central gardens with a landing pad on its roof. The Society’s summit is held in its garden; here Darrow duels Cassius in Golden Son.",cam:{target:[CIT.x,700,CIT.z],r:2600,theta:.4,phi:1.1}},
 {id:"occular",name:"The Occular Sphere",pos:[CIT.x,2240,CIT.z],desc:"A glass chamber shaped like an upside-down teardrop, hanging above the tip of the Sovereign’s spire.",cam:{target:[CIT.x,1950,CIT.z],r:900,theta:.6,phi:1.2}},
 {id:"citadel",name:"Citadel of Light",pos:[CIT.x+450,260,CIT.z+350],desc:"Seat of the Sovereign on the city’s western edge: kilometers of buildings, gardens and hills, ringed off by forest. Mustang is raised to Sovereign here at the end of Morning Star.",cam:{target:[CIT.x,120,CIT.z],r:3400,theta:.25,phi:.95}},
 {id:"dragonmaw",name:"Dragon Maw",pos:[CIT.x+260,90,CIT.z-260],desc:"A two-kilometer gravLift plunging to the Sovereign’s secret bunker. In Morning Star, Darrow is brought below as Cassius’s prisoner, and Octavia and Aja die in the bunker.",cam:{target:[CIT.x+260,40,CIT.z-260],r:700,theta:.7,phi:.8}},
 {id:"palatine",name:"Palatine Hill",pos:[CIT.x-700,260,CIT.z-650],desc:"Northwest quarter of the Citadel: landing pads, officials’ residences and the Politico School. Rebel bombs strike it in Morning Star.",cam:{target:[CIT.x-700,140,CIT.z-650],r:1200,theta:-.3,phi:1.0}},
 {id:"esqueline",name:"Esqueline Hills",pos:[CIT.x+800,220,CIT.z+800],desc:"Southeast quarter of the Citadel: villas and gardens for visiting Gold dignitaries.",cam:{target:[CIT.x+800,110,CIT.z+800],r:1200,theta:.6,phi:1.0}},
 {id:"forum",name:"The Forum",pos:[CIT.x+700,420,CIT.z-200],desc:"The pyramid where the Senate of the Society meets.",cam:{target:[CIT.x+700,150,CIT.z-200],r:1100,theta:.9,phi:1.0}},
 {id:"arch",name:"Arch of Silenius",pos:[CIT.x+1500,200,CIT.z+150],desc:"The Citadel’s main gate, opening onto the Via Triumphia. Protesters gather here in Morning Star.",cam:{target:[CIT.x+1500,80,CIT.z+150],r:900,theta:1.3,phi:1.0}},
 {id:"promenade",name:"The Promenade",pos:[700,960,200],desc:"The city’s highest layer, reserved for highColors: the Museum of Antiquities, the Cerebian Zoo, Aristotle Park and the Gravity Gardens.",cam:{target:[900,700,300],r:2200,theta:.5,phi:1.05}},
 {id:"hysperia",name:"Hysperia Gardens",pos:[2400,780,-700],desc:"A Pink breeding facility on the Promenade. Lilath’s ship, shot down by the Ash Lord’s fleet, crashes here at the end of the Siege of Luna.",cam:{target:[2400,600,-700],r:1400,theta:.7,phi:1.05}},
 {id:"lostcity",name:"The Lost City",pos:[1600,60,1500],desc:"The lowColor slum at the bottom of Hyperion’s stacked layers, far below the sunlit towers. Before the Summit, Darrow meets the Jackal here in hiding and the two plan their alliance.",cam:{target:[1600,20,1400],r:900,theta:.8,phi:1.25}},
 {id:"sea",name:"Sea of Serenity",pos:[600,SEA_Y+40,-3000],desc:"A crater sea flooded with water when Luna was terraformed. Hyperion sits on its southern shore.",cam:{target:[600,0,-2600],r:4200,theta:.2,phi:1.05}}
];
lm.forEach(l=>{if(["dragonmaw","palatine","esqueline","arch","lostcity"].includes(l.id)){l.pos[1]+=ground(l.pos[0],l.pos[2]);l.cam.target[1]+=ground(l.cam.target[0],l.cam.target[2]);}});
SITES.hyperion={name:"Hyperion",body:"luna",poi:"hyperion",epithet:"Capital of Luna · seat of the Sovereign",seed:31,
  blurb:"A city stacked in layers on the south shore of the Sea of Serenity. In Luna’s low gravity its towers climb kilometers high: highColors live on top, midColors in between, and lowColors in the Lost City at the bottom.",
  facts:[["Ruler","Sovereign Octavia au Lune"],["Gravity","About one-sixth of Earth’s"],["Days","Two weeks of light, two of dark"],["Layers","Promenade · mid-levels · Lost City"]],
  note:"Layout is an artistic reconstruction from the books’ descriptions; Earth hangs in Luna’s sky.",
  ground,targetLift:40,bounds:5200,minR:200,maxR:14000,shadow:4200,win:[3.2,2.6],cam:{target:[-200,600,200],r:7200,theta:.32,phi:1.32},defaultTod:"night",
  skyBody:{id:"earth",dir:[-.28,.1,-.95],size:1250},
  tods:{
    day:{top:0x16224a,hor:0x8aa0c8,bot:0x5a5a64,sun:0xffffff,sunEl:.7,sunAz:-.2,sunI:3.2,skyL:0x8aa0d0,gndL:0x4a4844,hemiI:.7,fog:0x8a98b8,fogD:.00004,night:.08,exp:.95,stars:.35,haze:.3},
    dusk:{top:0x0c1230,hor:0xd08a6a,bot:0x3a3036,sun:0xffc090,sunEl:.05,sunAz:.9,sunI:2.2,skyL:0x6a6a98,gndL:0x2a2420,hemiI:.5,fog:0x6a5a6a,fogD:.00005,night:.65,exp:1.05,stars:.6,haze:1},
    night:{top:0x020309,hor:0x0e1426,bot:0x07070a,sun:0x9ab8ff,sunEl:.35,sunAz:-.4,sunI:.2,skyL:0x34446e,gndL:0x0a0a10,hemiI:.1,fog:0x0c1020,fogD:.00004,night:1,exp:1.15,stars:1}},
  landmarks:lm,
  build(ctx){const R=ctx.R,root=ctx.root;
    root.add(makeTerrain({size:12000,seg:360,height:ground,color}));
    const sea=new THREE.Mesh(new THREE.PlaneGeometry(40000,16000).rotateX(-Math.PI/2),mats().water);sea.position.set(0,SEA_Y,-9800);root.add(sea);
    const B=new GeoBuilder(),Bg=new GeoBuilder(),Bm=new GeoBuilder();
    const WHITE=[0xf2eee6,0xe6e0d4,0xdcd6cc],GLASS=[0x9fb3c6,0x8aa2b8,0xb6c4d0,0x7f96ad],GOLD=0xd9b060;
    const cy=ground(CIT.x,CIT.z);
    /* ---- Citadel of Light ---- */
    Bg.add(G.cyl(80,150,1500,12),TM(CIT.x,cy,CIT.z),0xe9edf2,1);
    Bg.add(G.cyl(170,190,40,24),TM(CIT.x,cy+1500,CIT.z),0xdfe6ee,1);/* landing pad */
    B.add(G.cyl(60,40,180,12),TM(CIT.x,cy+1540,CIT.z),GOLD);B.add(G.cone(40,160,12),TM(CIT.x,cy+1720,CIT.z),GOLD);
    for(let k=0;k<4;k++){const a=k/4*TAU+.4;B.add(G.box(16,700,16),TM(CIT.x+Math.cos(a)*120,cy,CIT.z+Math.sin(a)*120,a),0xe6e0d4,1);}
    /* the Occular Sphere: an inverted teardrop */
    const tear=new THREE.LatheGeometry(Array.from({length:22},(_,i)=>{const t=i/21;const r=Math.sin(Math.PI*Math.pow(t,.7))*95*(1-t*.25);return new THREE.Vector2(Math.max(.1,r),t*260);}),28);
    const glassMat=new THREE.MeshPhongMaterial({color:col(0xbfe0ff),specular:col(0xffffff),shininess:120,transparent:true,opacity:.42,emissive:col(0x3a5a80),emissiveIntensity:.5});
    const tearM=new THREE.Mesh(tear,glassMat);tearM.position.set(CIT.x,cy+1950,CIT.z);root.add(tearM);
    const tearGlow=glowSprite(GLOW_BLUE,520,.35);tearGlow.position.set(CIT.x,cy+2060,CIT.z);root.add(tearGlow);
    /* palaces and halls around the spire, within the forest ring */
    for(let i=0;i<70;i++){const a=R()*TAU,r=260+Math.pow(R(),.8)*1100;const x=CIT.x+Math.cos(a)*r*1.1,z=CIT.z+Math.sin(a)*r;const y=ground(x,z);
      if(Math.hypot(x-(CIT.x+260),z-(CIT.z-260))<120)continue;
      const k=R();if(k<.5){ARCH.tiered(B,x,y,z,60+R()*50,40+R()*40,60+R()*160,WHITE[(R()*3)|0],R,GOLD);}
      else if(k<.8){ARCH.spire(B,x,y,z,14+R()*10,220+R()*380,WHITE[(R()*3)|0],GOLD);}
      else{B.add(G.cyl(40,46,40,16),TM(x,y,z),0xefe9de,1);B.add(G.dome(40,16),TM(x,y+40,z),GOLD);}}
    /* the Forum pyramid */
    {const x=CIT.x+700,z=CIT.z-200,y=ground(x,z);B.add(G.pyramid(380,260),TM(x,y,z),0xd8cfbf,1);B.add(G.pyramid(80,56),TM(x,y+204,z),GOLD);}
    /* Palatine landing pads, Esqueline villas */
    for(let i=0;i<7;i++){const a=i/7*TAU,x=CIT.x-700+Math.cos(a)*230,z=CIT.z-650+Math.sin(a)*230,y=ground(x,z);Bm.add(G.cyl(50,54,10,20),TM(x,y,z),0x8a8f98,0,true);if(i%2){const sh=makeShip("frigate",40);sh.position.set(x,y+50,z);sh.rotation.y=R()*TAU;root.add(sh);}}
    for(let i=0;i<40;i++){const a=R()*TAU,r=R()*620;const x=CIT.x+800+Math.cos(a)*r,z=CIT.z+800+Math.sin(a)*r,y=ground(x,z);B.add(G.box(40,18,30),TM(x,y,z,R()),0xefe9de,1);B.add(G.gable(42,12,32),TM(x,y+18,z,R()),0xb05a3c);}
    /* Dragon Maw: a dark shaft with a ring of light */
    {const x=CIT.x+260,z=CIT.z-260,y=ground(x,z);B.add(G.torus(70,10,40),TM(x,y+4,z,0,1,1,1,Math.PI/2),0x2a2a2e);B.add(G.cyl(64,64,2,32),TM(x,y+1,z),0x050506,0,true);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(70,3,8,48),new THREE.MeshBasicMaterial({color:col(0xff7a40)}));ring.rotation.x=Math.PI/2;ring.position.set(x,y+9,z);root.add(ring);}
    /* Arch of Silenius and the Via Triumphia into the city */
    {const x=CIT.x+1500,z=CIT.z+150,y=ground(x,z);B.add(G.arch(200,230,70,40),TM(x,y,z,Math.PI/2),0xf3eee4);B.add(G.box(80,50,230),TM(x,y+230,z),0xe9e2d4);
      for(let k=0;k<30;k++){const xx=x+80+k*70;B.add(G.box(60,3,90),TM(xx,ground(xx,z)+1,z),0xf5f1ea,0,true);}}
    /* ---- the tower city ---- */
    const towers=[];
    const city=(x,z)=>x>CIT.x+1700&&x<4600&&z>shoreZ(x)+250&&z<2300;
    for(let i=0;i<620;i++){const x=CIT.x+1700+R()*(4600-CIT.x-1700),z=shoreZ(x)+250+R()*2100;if(!city(x,z))continue;
      const cx=900,cz=300;const d=Math.hypot((x-cx)/2400,(z-cz)/1300);const y=ground(x,z);
      const core=Math.pow(Math.max(0,1-d),1.2);const h=90+core*260+Math.pow(R(),2.4)*1700*(.25+core)+R()*80;const w=46+R()*64;
      const glass=R()<.55;const c=glass?GLASS[(R()*4)|0]:WHITE[(R()*3)|0];
      if(R()<.5)ARCH.tiered(glass?Bg:B,x,y,z,w,w*(.7+R()*.5),h,c,R,R()<.3?GOLD:null);
      else{(glass?Bg:B).add(G.cyl(w*.42,w*.55,h,8),TM(x,y,z),c,1);(glass?Bg:B).add(G.cone(w*.3,h*.15,8),TM(x,y+h,z),R()<.4?GOLD:c);}
      towers.push({x,z,h:y+h,w});}
    /* the Promenade and mid-level decks spanning between towers */
    const decks=[];const Bk=new GeoBuilder();
    /* the Promenade: a chain of round garden plazas high among the towers, linked by bridges */
    [[700,200,260,900],[1150,-80,200,880],[400,620,220,860],[1300,520,240,900],[2400,-700,300,700],[1900,240,180,820],[-200,300,200,640],[3100,500,220,560]].forEach(d=>{
      Bk.add(G.cyl(d[2],d[2]*.6,26,32),TM(d[0],d[3]-26,d[1]),0xd8d4cc,1);Bk.add(G.cyl(d[2]*.94,d[2]*.94,2,32),TM(d[0],d[3],d[1]),0x5d8a46,0,true);decks.push(d);
      Bk.add(G.cyl(d[2]*.16,d[2]*.22,d[3]-26,10),TM(d[0],0,d[1]),0xe6e0d4,1);
      for(let k=0;k<6;k++){const a=R()*TAU,r=R()*d[2]*.7;Bk.add(G.cyl(14,16,24,10),TM(d[0]+Math.cos(a)*r,d[3],d[1]+Math.sin(a)*r),0xefe9de,1);Bk.add(G.dome(14,10),TM(d[0]+Math.cos(a)*r,d[3]+24,d[1]+Math.sin(a)*r),GOLD);}});
    for(let i=0;i<decks.length-1;i++){const a=decks[i],b=decks[i+1];const L=Math.hypot(a[0]-b[0],a[1]-b[1]);if(L>1500)continue;const y=Math.min(a[3],b[3])-12;Bk.add(G.box(L,8,22),TM((a[0]+b[0])/2,y,(a[1]+b[1])/2,-Math.atan2(b[1]-a[1],b[0]-a[0])),0xe0dcd4,1);}
    /* gardens on the decks */
    const deckTrees=[];decks.forEach(d=>{for(let k=0;k<60;k++){const a=R()*TAU,r=Math.sqrt(R())*d[2]*.88;deckTrees.push({x:d[0]+Math.cos(a)*r,y:d[3]+2,z:d[1]+Math.sin(a)*r,s:4+R()*3,c:[0x4f7a3a,0x5e8a44,0x3e6a32][(R()*3)|0]});}});
    /* the Lost City: dense low blocks around the tower feet */
    for(let i=0;i<1400;i++){const x=CIT.x+1750+R()*(4600-CIT.x-1750),z=shoreZ(x)+260+R()*2100;if(!city(x,z))continue;const y=ground(x,z);
      B.add(G.box(16+R()*24,14+R()*40,16+R()*24),TM(x,y,z,R()*.4),[0x6e6a66,0x7a746c,0x5e5a58,0x8a8076][(R()*4)|0],1);}
    /* sky bridges between nearby towers */
    for(let i=0;i<90;i++){const a=towers[(R()*towers.length)|0],b=towers[(R()*towers.length)|0];if(!a||!b||a===b)continue;const L=Math.hypot(a.x-b.x,a.z-b.z);if(L<120||L>520)continue;
      const y=Math.min(a.h,b.h)*(.4+R()*.5);B.add(G.box(L,6,8),TM((a.x+b.x)/2,y,(a.z+b.z)/2,-Math.atan2(b.z-a.z,b.x-a.x)),0xe0dcd4,1);}
    /* outer districts along the shore */
    ARCH.district(B,600,2900,5200,90,(x,z,r)=>12+Math.pow(r(),3)*160,ground,[0x9a948c,0xb0aaa0,0x8a847c,0xd8d2c8],41,(x,z)=>city(x,z)||Math.hypot(x-CIT.x,z-CIT.z)<1950||z<shoreZ(x)+200||Math.abs(x)>5200);
    root.add(B.mesh(mats().bld));root.add(Bg.mesh(mats().glass));root.add(Bm.mesh(mats().metal));root.add(Bk.mesh(mats().bld));
    /* forest ring around the Citadel */
    const ring=scatter(2400,6000,R,(x,z)=>{x+=CIT.x;z+=CIT.z;const d=Math.hypot((x-CIT.x)/1.1,z-CIT.z);if(d<1500||d>1900)return null;const y=ground(x,z);if(y<SEA_Y+5)return null;return {x,y,z,s:9+R()*6,c:[0x355a2e,0x41683a,0x2f5028][(R()*3)|0]};});
    root.add(makeForest(ring.concat(deckTrees),"broad",5));
    /* aerial trains and airCars */
    const movers=[];const tMat=new THREE.MeshBasicMaterial({color:col(0xffe7c0)});const tGeo=new THREE.BoxGeometry(60,5,5);const cGeo=new THREE.BoxGeometry(8,3,4);
    for(let i=0;i<10;i++){const m=new THREE.Mesh(tGeo,tMat);root.add(m);movers.push({m,kind:"t",y:300+R()*500,z:-900+R()*2600,x0:CIT.x+1600,x1:4800,t:R(),sp:.02+R()*.03});}
    for(let i=0;i<220;i++){const m=new THREE.Mesh(cGeo,tMat);root.add(m);movers.push({m,kind:"c",cx:900+(R()-.5)*2600,cz:300+(R()-.5)*1400,r:120+R()*700,a:R()*TAU,y:150+R()*900,sp:(R()<.5?-1:1)*(.04+R()*.08)});}
    const beacons=new THREE.Group();root.add(beacons);towers.filter(t=>t.h>900).forEach(t=>{const s=glowSprite(GLOW_RED,40,0);s.position.set(t.x,t.h+20,t.z);beacons.add(s);});
    SITES.hyperion.onTod=n=>{beacons.children.forEach(s=>s.material.opacity=.4+n*.6);tearGlow.material.opacity=.2+n*.5;glassMat.emissiveIntensity=.3+n*1.2;};
    return {update(dt,t){movers.forEach(o=>{if(o.kind==="t"){o.t=(o.t+dt*o.sp)%1;o.m.position.set(o.x0+(o.x1-o.x0)*o.t,o.y,o.z);}else{o.a+=o.sp*dt;o.m.position.set(o.cx+Math.cos(o.a)*o.r,o.y,o.cz+Math.sin(o.a)*o.r);o.m.rotation.y=-o.a;}});
      beacons.children.forEach((s,i)=>s.scale.setScalar(40*(.7+.3*Math.sin(t*2+i))));tearM.rotation.y+=dt*.05;}};
  }};
})();

/* ---- 42z-site-gala.js ---- */
/* ===================== THE SUMMIT GALA (Golden Son) ===================== */
/* The snow-swept gala in the garden hall of the Sovereign's Spire, where Darrow duels Cassius. */
(function(){
const HX=640,HZ=440;                                  /* half-size of the hall floor */
function ground(x,z){return (Math.abs(x)<HX+60&&Math.abs(z)<HZ+60)?0:-4000;}
/* a duelist: cloak, body, head and a razor drawn in light */
function duelist(cloak,trim){const g=new THREE.Group();const D=new GeoBuilder();
  D.add(G.cone(4.2,15,10),TM(0,0,0),cloak);D.add(G.cyl(1.7,2.1,6,8),TM(0,9,0),trim);D.add(G.sphere(1.5,10),TM(0,16.6,0),0xc8a888);
  D.add(G.box(1.2,6,1.2),TM(2.4,10,0,0,1,1,1,0,-.9),trim);D.add(G.box(1.2,6,1.2),TM(-2.4,10,0,0,1,1,1,0,.6),trim);
  g.add(D.mesh(mats().bld));
  const blade=new THREE.Mesh(new THREE.BoxGeometry(.35,.35,16).translate(0,0,8),new THREE.MeshBasicMaterial({color:col(0xcfe6ff)}));blade.position.set(4.6,13,0);blade.rotation.set(-.3,.4,0);g.add(blade);
  const gl=glowSprite(GLOW_BLUE,14,.7);gl.position.set(6,13.5,6);g.add(gl);g.userData.blade=blade;return g;}
const lm=[
 {id:"duel",name:"The duel",pos:[0,30,0],desc:"Darrow tips wine into Cassius’s lap to provoke him. Octavia declares a fight to the death. Darrow feigns exhaustion, lets Cassius think he has won, then beats him with what Lorn taught him and takes his sword arm. Mustang talks him out of the killing blow.",cam:{target:[0,10,0],r:170,theta:.5,phi:1.25}},
 {id:"dais",name:"The Sovereign’s dais",pos:[0,110,-HZ+70],desc:"Octavia au Lune presides over the Summit from the head of the hall, and changes the rules of the duel once Cassius falls.",cam:{target:[0,70,-HZ+90],r:320,theta:0,phi:1.3}},
 {id:"stair",name:"The grand stair",pos:[0,50,-HZ+170],desc:"White stairs climb from the dancing floor to the Sovereign’s dais between colonnades hung with light.",cam:{target:[0,30,-HZ+200],r:360,theta:.3,phi:1.35}},
 {id:"brawl",name:"The brawl",pos:[-300,30,160],desc:"The party breaks into a sword brawl between Bellona and Augustus. Karnus kills Leto while the Jackal secretly helps, and only Darrow sees it. Augustus’s ships have already been sent away: Octavia has betrayed them.",cam:{target:[-280,10,140],r:300,theta:-.7,phi:1.25}},
 {id:"garden",name:"The winter garden",pos:[420,40,-240],desc:"The garden of the Spire dressed for the Summit’s gala, snow drifting over the trees and the dancers.",cam:{target:[400,10,-200],r:360,theta:.9,phi:1.3}},
 {id:"view",name:"Hyperion below",pos:[0,60,HZ],desc:"From the Spire’s heights the towers of Hyperion fall away into the night, with Earth hanging in the black above.",cam:{target:[0,40,HZ-40],r:520,theta:Math.PI,phi:1.42}}
];
SITES.gala={name:"The Summit Gala",body:"luna",poi:"hyperion",epithet:"Hyperion · the Sovereign’s Spire",seed:741,
  blurb:"Golden Son. On the third night of the once-a-decade Summit, the Society’s greatest families dance in the snow at the Sovereign’s gala. It ends in blood: Darrow’s duel with Cassius, a brawl between Bellona and Augustus, and Leto dead.",
  facts:[["When","The Summit, December 741 PCE"],["Host","Sovereign Octavia au Lune"],["Duel","Darrow takes Cassius’s sword arm"],["After","Leto killed; Darrow and Sevro seize the Vanguard"]],
  note:"Our sources don’t settle exactly which building on Luna holds the gala; following the Hyperion scene, it is shown in the garden hall of the Sovereign’s Spire. The hall’s design is this atlas’s own.",
  todLabel:{night:"Gala night",dusk:"Earthrise"},
  ground,targetLift:0,bounds:620,minR:40,maxR:2200,shadow:900,win:[1.1,1.0],winK:1.5,cam:{target:[0,40,0],r:900,theta:.55,phi:1.12},defaultTod:"night",
  skyBody:{id:"earth",dir:[.35,.42,-.84],size:520},
  tods:{
    night:{top:0x02030a,hor:0x141a2e,bot:0x05060a,sun:0xc8d8ff,sunEl:.9,sunAz:.6,sunI:.7,skyL:0x6a7aa8,gndL:0x2a2a34,hemiI:.55,fog:0x10141e,fogD:.00022,night:1,exp:.95,stars:1},
    dusk:{top:0x0a1024,hor:0x3a4a7a,bot:0x0a0a10,sun:0xe0e8ff,sunEl:.35,sunAz:.9,sunI:1.2,skyL:0x8a9ac8,gndL:0x3a3a44,hemiI:.7,fog:0x1a2234,fogD:.0002,night:.8,exp:1.1,stars:1}},
  landmarks:lm,
  build(ctx){const R=ctx.R,root=ctx.root;
    const MARBLE=0xdedad2,PALE=0xd2ccc0,GOLD=0xd9b060;
    /* floor: pale marble dusted with snow, an inlaid gold ring for the duel */
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(HX*2+120,HZ*2+120).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:col(0xb8bcc6),roughness:.3,metalness:.1}));floor.receiveShadow=true;root.add(floor);
    const ring=new THREE.Mesh(new THREE.RingGeometry(58,62,80).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:col(GOLD),roughness:.3,metalness:.8}));ring.position.y=.3;root.add(ring);
    const B=new GeoBuilder();
    /* the hall: two tiers of colonnade around three sides, with a wall of tall arches behind */
    const sides=[[0,-HZ,HX*2,0],[ -HX,0,HZ*2,Math.PI/2],[HX,0,HZ*2,Math.PI/2]];
    sides.forEach(([x,z,len,ry])=>{ARCH.colonnade(B,x,0,z,len,70,Math.round(len/38),MARBLE,ry);B.add(G.box(ry?10:len,8,ry?len:10),TM(x,70,z),PALE);
      ARCH.colonnade(B,x,78,z,len,50,Math.round(len/38),MARBLE,ry);B.add(G.box(ry?12:len+10,6,ry?len+10:12),TM(x,128,z),PALE);
      const back=ry?[x+(x<0?-40:40),z]:[x,z-40];B.add(G.box(ry?12:len+80,200,ry?len+80:12),TM(back[0],0,back[1]),0xdcd6ca);
      const n=Math.round(len/90);for(let i=0;i<n;i++){const t=(i+.5)/n-.5;const ax=ry?back[0]+(x<0?7:-7):x+t*len,az=ry?z+t*len:back[1]+7;B.add(G.arch(36,90,4,5),TM(ax,20,az,ry?Math.PI/2:0),GOLD);}});
    /* the grand stair and the dais */
    for(let i=0;i<24;i++)B.add(G.box(300-i*4,2.6,8),TM(0,i*2.6,-HZ+260-i*8),MARBLE);
    B.add(G.box(320,62,140),TM(0,0,-HZ+70),PALE,1);B.add(G.box(330,4,150),TM(0,62,-HZ+70),GOLD);
    B.add(G.box(26,36,18),TM(0,66,-HZ+40),GOLD);B.add(G.box(34,6,24),TM(0,66,-HZ+40),0xa88a40);
    ARCH.statue(B,-120,66,-HZ+60,46,GOLD,0);ARCH.statue(B,120,66,-HZ+60,46,GOLD,0);
    for(let s of [-1,1]){ARCH.tower(B,s*190,0,-HZ+20,22,260,MARBLE,"gold",1);}
    /* the balustrade at the open south edge, over the drop */
    for(let i=0;i<60;i++){const x=-HX+i*(HX*2/59);B.add(G.cyl(1.6,2,14,6),TM(x,0,HZ+20),MARBLE);}B.add(G.box(HX*2,3,6),TM(0,14,HZ+20),PALE);
    /* tables of the great houses */
    for(let i=0;i<14;i++){const side=i<7?-1:1;const x=side*(300+(i%7)*0),z=-260+(i%7)*90;B.add(G.box(80,10,22),TM(side*(HX-120),0,z),0xece6da);B.add(G.box(84,1.5,26),TM(side*(HX-120),10,z),GOLD);}
    root.add(B.mesh(mats().bld));
    /* the winter garden: snow-white trees along the colonnades */
    const trees=scatter(46,HX*2,R,(x,z)=>{if(Math.abs(z)>HZ-60||Math.abs(x)<HX-220||Math.abs(x)>HX-40)return null;return {x,y:0,z,s:7+R()*5,c:[0xeef2f6,0xe2e8f0,0xf6f0f2][(R()*3)|0]};});
    const tm=makeForest(trees,"broad",5);root.add(tm);
    /* the crowd ring, and the dancers further out */
    {const n=900;const body=new THREE.CylinderGeometry(1.4,2.6,10,7).translate(0,5,0),head=new THREE.SphereGeometry(1.3,8,6).translate(0,11.2,0);
      const mat=new THREE.MeshStandardMaterial({roughness:.5,metalness:.35});const ib=new THREE.InstancedMesh(body,mat,n),ih=new THREE.InstancedMesh(head,new THREE.MeshStandardMaterial({color:col(0xd8b898),roughness:.6}),n);
      const m=new THREE.Matrix4(),c=new THREE.Color();const PAL=[0xd9b060,0xf2ece0,0x1a1a20,0x8a1a1a,0xc8a050,0xe8e0d0,0x2a2a40];let k=0;
      for(let i=0;i<n*3&&k<n;i++){const ring=R()<.55;const a=R()*TAU,r=ring?72+R()*60:150+R()*360;const x=Math.cos(a)*r,z=Math.sin(a)*r*.75;if(Math.abs(x)>HX-130||Math.abs(z)>HZ-90)continue;if(z<-HZ+280&&Math.abs(x)<170)continue;
        m.compose(new THREE.Vector3(x,0,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,-Math.atan2(z,x)-Math.PI/2,0)),new THREE.Vector3(1,.9+R()*.25,1));ib.setMatrixAt(k,m);ih.setMatrixAt(k,m);
        c.copy(col(PAL[(R()*PAL.length)|0]));ib.setColorAt(k,c);k++;}
      ib.count=ih.count=k;ib.castShadow=true;root.add(ib);root.add(ih);}
    /* Darrow and Cassius */
    const dA=duelist(0x16161a,0x2a2a30),dB=duelist(0xf0ece4,0xd9b060);root.add(dA);root.add(dB);
    /* chandeliers of light hung over the floor */
    const lamps=[];[[-260,0],[0,-120],[260,0],[0,160]].forEach(([x,z],i)=>{const s=glowSprite(GLOW_WHITE,160,.85);s.position.set(x,150,z);root.add(s);
      const C=new GeoBuilder();for(let k=0;k<10;k++){const a=k/10*TAU;C.add(G.sphere(2.4,6),TM(x+Math.cos(a)*18,146,z+Math.sin(a)*18),0xfff2d0);}C.add(G.torus(18,1,30),TM(x,148,z,0,1,1,1,Math.PI/2),GOLD);root.add(C.mesh(mats().glass));
      if(i<3){const L=new THREE.PointLight(col(0xfff0d8),.8,900,1.6);L.position.set(x,140,z);root.add(L);lamps.push(L);}});
    /* the towers of Hyperion around and below the Spire */
    const T=new GeoBuilder();for(let i=0;i<70;i++){const a=R()*TAU,r=1500+R()*3800;const x=Math.cos(a)*r,z=Math.sin(a)*r;if(z<HZ+400&&Math.abs(x)<900&&z>0)continue;const h=800+R()*3200;const w=60+R()*140;
      T.add(G.box(w,h,w),TM(x,-3600,z,R()),[0xd6d0c4,0xbab4aa,0xe2dcd0][i%3],1);T.add(G.cone(w*.5,h*.2,6),TM(x,-3600+h,z),0xd9b060);}
    const tmesh=T.mesh(mats().bld);tmesh.castShadow=false;root.add(tmesh);
    /* snow drifting down over the dancers */
    const n=3000,g=new THREE.BufferGeometry(),p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(R()-.5)*HX*2.4;p[i*3+1]=R()*420;p[i*3+2]=(R()-.5)*HZ*2.4;}
    g.setAttribute("position",new THREE.BufferAttribute(p,3));const snow=new THREE.Points(g,new THREE.PointsMaterial({color:col(0xffffff),size:2.2,transparent:true,opacity:.85,depthWrite:false}));root.add(snow);
    return {update(dt,t){
      /* the duel: circling, closing, striking */
      const a=t*.55,r=18+Math.sin(t*1.3)*8;dA.position.set(Math.cos(a)*r,0,Math.sin(a)*r);dB.position.set(-Math.cos(a)*r,0,-Math.sin(a)*r);
      dA.lookAt(dB.position);dB.lookAt(dA.position);dA.userData.blade.rotation.x=-.3+Math.sin(t*4.1)*.7;dB.userData.blade.rotation.x=-.3+Math.sin(t*3.7+1)*.7;
      const sp=g.attributes.position.array;for(let i=0;i<n;i++){sp[i*3+1]-=dt*(14+(i%7)*2);sp[i*3]+=Math.sin(t*.7+i)*dt*3;if(sp[i*3+1]<0)sp[i*3+1]=420;}g.attributes.position.needsUpdate=true;}};
  }};
/* the Spire in the Hyperion scene now opens onto the gala */
if(SITES.hyperion){const l=SITES.hyperion.landmarks.find(x=>x.id==="sovspire");if(l)l.enter="gala";}
})();

/* ---- 43-site-lykos.js ---- */
/* ===================== LYKOS (underground) ===================== */
/* A deep, narrow cavern: homes stacked and overhanging up the walls, cables strung across the dark,
   lamp rigs hanging over the Common, and the crowd gathered below. */
(function(){
const N=makeNoise(404);
const WALL=640,LV=22,STEP=24,RISE=62;           /* terraces: 22 levels, ~1.4 km of township up the walls */
const SHAFT={x:330,z:200,r:110},FACE={x:-360,z:-250,r:200},GARDEN={x:300,z:-360,r:140};
function wallR(a){return WALL+N.f(Math.cos(a)*1.4+3,Math.sin(a)*1.4,0,3)*160-60;}
function ground(x,z){const r=Math.hypot(x,z),a=Math.atan2(z,x);let h=(N.f(x*.004,0,z*.004,4)-.5)*20;
  const W=wallR(a);
  if(r>W){const k=r-W;const lv=Math.min(LV,Math.floor(k/STEP));h=lv*RISE+50+N.vn(x*.02,0,z*.02)*5;
    if(k>LV*STEP)h=LV*RISE+50+Math.pow(k-LV*STEP,1.1)*3+N.f(x*.006,1,z*.006,4)*200;}
  const ds=Math.hypot(x-SHAFT.x,z-SHAFT.z);if(ds<SHAFT.r+30)h=Math.min(h,ds<SHAFT.r?-700:h-sst(SHAFT.r+30,SHAFT.r,ds)*30);
  const df=Math.hypot(x-FACE.x,z-FACE.z);if(df<FACE.r+80)h-=sst(FACE.r+80,FACE.r*.5,df)*160;
  const dg=Math.hypot(x-GARDEN.x,z-GARDEN.z);if(dg<GARDEN.r+30)h=Math.min(h,30);
  return h;}
function color(x,z,h,slope){let c=mixc([86,60,46],[116,82,60],N.f(x*.005,4,z*.005,4));
  if(slope>.45)c=mixc(c,[58,40,32],(slope-.45)*1.5);
  if(h>LV*RISE+60)c=mixc(c,[44,30,24],sst(LV*RISE+60,LV*RISE+300,h));
  const r=Math.hypot(x,z);if(r<260)c=mixc([112,96,80],c,sst(200,260,r));
  if(Math.hypot(x-GARDEN.x,z-GARDEN.z)<GARDEN.r)c=[54,92,44];
  if(Math.hypot(x-FACE.x,z-FACE.z)<FACE.r)c=mixc(c,[60,46,40],.6);
  return c;}
const COMMON_Y=()=>ground(0,0);
const lm=[
 {id:"common",name:"The Common",pos:[0,40,0],desc:"The public square at the bottom of the township, where Reds gather for broadcasts, floggings and hangings while the homes of the clans climb the walls above. Darrow feasts the miners here when he returns in Golden Son.",cam:{target:[0,40,0],r:700,theta:.3,phi:1.2}},
 {id:"gallows",name:"The Gallows",pos:[-70,60,40],desc:"Where Eo is hanged for singing the forbidden song, and where Darrow is hanged after burying her. In the mine’s low gravity, someone must pull the legs of the hanged to finish it; Narol’s gentle pull saves Darrow.",cam:{target:[-70,30,40],r:300,theta:.6,phi:1.2}},
 {id:"holo",name:"The ArchGovernor’s address",pos:[0,330,0],desc:"Above the Common, the Society’s broadcasts play and the ArchGovernor’s image addresses the miners. Nero au Augustus speaks to Lykos on the day Eo dies.",cam:{target:[0,300,0],r:420,theta:.1,phi:1.35}},
 {id:"stacks",name:"The Stacks",pos:[-560,700,-300],desc:"Homes cut into the rock and built out from it, level on level up the cavern walls, hung with cables, ladders and lifts.",cam:{target:[-420,600,-220],r:900,theta:-1.1,phi:1.3}},
 {id:"lambda",name:"Lambda Homes",pos:[-560,420,560],desc:"Darrow’s clan. He climbs up through the township to reach his home.",cam:{target:[-500,380,500],r:700,theta:-.6,phi:1.25}},
 {id:"gamma",name:"Gamma Quarter",pos:[560,620,560],desc:"The always-favored clan, winner of the Laurel year after year, and so the best fed.",cam:{target:[500,560,500],r:700,theta:.8,phi:1.25}},
 {id:"cages",name:"Gray patrols",pos:[180,170,-120],desc:"Gray guards under Ugly Dan watch the township from grav platforms above the crowd.",cam:{target:[180,150,-120],r:380,theta:.4,phi:1.2}},
 {id:"shaft",name:"The Mine Shaft",pos:[SHAFT.x,60,SHAFT.z],desc:"The way down to the helium-3 tunnels, worked in frysuits among deadly gas pockets.",cam:{target:[SHAFT.x,-60,SHAFT.z],r:600,theta:.5,phi:.85}},
 {id:"clawdrill",name:"The ClawDrill",pos:[FACE.x+40,-40,FACE.z+40],enter:"lykosmine",desc:"A great drill whose claws grind the rock face, steered by a Helldiver from the control panels. Darrow is Lykos’s youngest Helldiver; slow down and it overheats.",cam:{target:[FACE.x+40,-80,FACE.z+40],r:600,theta:.9,phi:1.0}},
 {id:"garden",name:"The Bubble Garden",pos:[GARDEN.x,100,GARDEN.z],desc:"A hidden forest grove reached through a ventilation duct from the Webbery. Darrow and Eo are whipped for visiting it; Darrow buries Eo here.",cam:{target:[GARDEN.x,50,GARDEN.z],r:460,theta:.4,phi:1.1}},
 {id:"laurel",name:"The Laurel",pos:[60,70,-60],desc:"The prize for the clan that mines the most helium-3 each quarter: food, burners to smoke, quilts and better wood for zithers. It is rigged to keep the clans competing.",cam:{target:[60,30,-60],r:360,theta:-.2,phi:1.15}}
];
SITES.lykos={name:"Lykos",body:"mars",poi:"lykos",epithet:"Mining colony · beneath the Martian surface",seed:41,
  blurb:"One of the first of Mars’s underground colonies. Generations of Reds have lived here believing they are pioneers making Mars habitable, while the surface above them has been green for centuries.",
  facts:[["Mined","Helium-3"],["Clans","Lambda, Gamma, Mu, Chi and more"],["Guards","Grays under Ugly Dan"],["Prize","The Laurel, every quarter"]],
  note:"The township’s look is an artistic reconstruction, after the concept art you shared.",
  todLabel:{day:"Shift",dusk:"Laureltide",night:"Lights down"},
  ground,targetLift:0,bounds:1100,minR:90,maxR:3600,shadow:1300,win:[1.2,1.0],winK:1.5,cam:{target:[0,260,0],r:1500,theta:.35,phi:1.25},defaultTod:"day",
  tods:{
    day:{top:0x0a0706,hor:0x2a1c12,bot:0x0a0706,sun:0xffd6a0,sunEl:1.3,sunAz:.6,sunI:1.2,skyL:0x8a7462,gndL:0x1a0e0a,hemiI:.55,fog:0x2e2016,fogD:.00042,night:.7,exp:1.15,haze:0},
    dusk:{top:0x080404,hor:0x30160a,bot:0x050304,sun:0xff9a50,sunEl:1.2,sunAz:.9,sunI:1.0,skyL:0x7a3a2a,gndL:0x1a0a06,hemiI:.45,fog:0x2a140a,fogD:.0004,night:1,exp:1.2,haze:0},
    night:{top:0x020202,hor:0x0a0706,bot:0x020202,sun:0x8a7a9a,sunEl:1.3,sunAz:.2,sunI:.3,skyL:0x2a2030,gndL:0x050304,hemiI:.2,fog:0x0c0907,fogD:.00036,night:1,exp:1.25,haze:0}},
  landmarks:lm,
  build(ctx){const R=ctx.R,root=ctx.root;
    root.add(makeTerrain({size:3000,seg:360,height:ground,color,cast:true}));
    const B=new GeoBuilder(),Bm=new GeoBuilder(),Bd=new GeoBuilder();
    const ROCK=[0x8a5c46,0x7a5040,0x9a6a50,0x6e463a,0x5e4236,0xa07a5a,0x74584a];
    /* ---- the stacks: homes on every terrace, built out over the drop ---- */
    for(let lv=0;lv<LV;lv++){const y0=lv*RISE+50;
      const circ=TAU*(WALL+lv*STEP);let a=R()*TAU;const end=a+TAU;
      while(a<end){const W=wallR(a);const r0=W+lv*STEP+2;const w=14+R()*22;const da=w/(r0)*1.02;const am=a+da/2;
        const cx=Math.cos(am),cz=Math.sin(am);const ry=-am+Math.PI/2;
        if(Math.hypot(Math.cos(am)*r0-FACE.x,Math.sin(am)*r0-FACE.z)>FACE.r+60&&Math.hypot(Math.cos(am)*r0-GARDEN.x,Math.sin(am)*r0-GARDEN.z)>GARDEN.r+40){
          const out=R()*R()*22;const dep=STEP+out+6;const h=RISE*(.55+R()*.55);const rc=r0+STEP/2-out/2;
          const x=cx*rc,z=cz*rc;const c=ROCK[(R()*ROCK.length)|0];
          B.add(G.box(w,h,dep),TM(x,y0,z,ry),c,1);
          if(R()<.35){B.add(G.box(w*.7,h*.45,dep*.7),TM(x+cx*3,y0+h,z+cz*3,ry+.05),ROCK[(R()*ROCK.length)|0],1);}
          if(out>8){const sx=cx*(r0-out+3),sz=cz*(r0-out+3);Bd.add(G.box(2.4,RISE*.9,2.4),TM(sx,y0-RISE*.9,sz,ry),0x3a2c22);}
          if(R()<.4)Bd.add(G.box(w*.9,1.6,6),TM(cx*(r0-out-2),y0+h*.45,cz*(r0-out-2),ry),0x4a3426);
          if(R()<.5)Bd.add(G.box(w*.35,h*.45,1.2),TM(cx*(r0-out-.4),y0,cz*(r0-out-.4),ry),0x1a100a,0,true);
          if(R()<.08)Bd.add(G.box(1.2,RISE*1.6,1.2),TM(cx*(r0-out-4),y0,cz*(r0-out-4),ry),0x6a5a4a);}
        a+=da;}}
    root.add(B.mesh(mats().bld));root.add(Bd.mesh(mats().metal));
    /* ---- two great rock pillars hold up the cavern roof ---- */
    const P=new GeoBuilder();[[260,-260,46],[-300,240,38]].forEach(([x,z,r])=>{const y=ground(x,z);
      for(let k=0;k<12;k++){const rr=r*(1-k*.015)*(.9+R()*.2);P.add(G.cyl(rr,rr*1.05,140,10),TM(x+(R()-.5)*6,y+k*140,z+(R()-.5)*6,R()),[0x6e5040,0x7a5a48,0x5e4436][k%3]);}
      for(let k=0;k<30;k++){const yy=y+40+R()*1500,aa=R()*TAU;P.add(G.box(12+R()*14,16+R()*20,10+R()*12),TM(x+Math.cos(aa)*r,yy,z+Math.sin(aa)*r,-aa),ROCK[(R()*ROCK.length)|0],1);}});
    root.add(P.mesh(mats().bld));
    /* ---- cables strung across the dark ---- */
    {const pts=[];const ends=n=>{const a=R()*TAU,lv=(R()*LV)|0;const r=wallR(a)+lv*STEP;return new THREE.Vector3(Math.cos(a)*r,lv*RISE+50+RISE*.8,Math.sin(a)*r);};
      for(let i=0;i<150;i++){const A=ends(),Bv=ends();if(A.distanceTo(Bv)<400)continue;const sag=60+R()*160;let prev=A;
        for(let s=1;s<=14;s++){const t=s/14;const p=A.clone().lerp(Bv,t);p.y-=Math.sin(t*Math.PI)*sag;pts.push(prev,p);prev=p;}}
      const g=new THREE.BufferGeometry().setFromPoints(pts);root.add(new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:col(0x1a120c),transparent:true,opacity:.85})));}
    /* ---- lamp rigs hanging over the Common ---- */
    const rigs=[];[[0,520,0,1.4],[-260,760,-120,1],[240,880,200,1],[-120,1050,320,.9],[160,640,-300,.9]].forEach(([x,y,z,s],i)=>{const g=new THREE.Group();const F=new GeoBuilder();
      for(let k=0;k<4;k++){const a=k/4*TAU+.3;F.add(G.box(22*s,34*s,6*s),TM(Math.cos(a)*16*s,-17*s,Math.sin(a)*16*s,-a,1,1,1,.35),0x2a2420);}
      F.add(G.box(10*s,30*s,10*s),TM(0,0,0),0x3a3430);g.add(F.mesh(mats().metal));
      const panes=new THREE.Mesh(new THREE.CylinderGeometry(15*s,13*s,26*s,4,1,true),new THREE.MeshBasicMaterial({color:col(0xf4f0e0),side:THREE.DoubleSide}));panes.position.y=-14*s;panes.rotation.y=.3+Math.PI/4;g.add(panes);
      const glow=glowSprite(GLOW_WARM,240*s,.9);glow.position.y=-14*s;g.add(glow);
      g.position.set(x,y,z);root.add(g);
      const line=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,y,z),new THREE.Vector3(x+(R()-.5)*200,y+900,z+(R()-.5)*200)]);root.add(new THREE.Line(line,new THREE.LineBasicMaterial({color:col(0x1a120c)})));
      if(i<3){const L=new THREE.PointLight(col(0xfff0d8),i===0?2.2:1.2,1800,1.6);L.position.set(x,y-30*s,z);root.add(L);rigs.push(L);}});
    /* ---- the Common, the crowd ---- */
    const Bc=new GeoBuilder();Bc.add(G.cyl(230,240,4,40),TM(0,COMMON_Y()-1,0),0x8e7c68,0,true);root.add(Bc.mesh(mats().bld));
    {const n=2600;const geo=new THREE.CylinderGeometry(1.1,1.3,5.2,5).translate(0,2.6,0);const im=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({roughness:.9,metalness:0}),n);const m=new THREE.Matrix4();const c=new THREE.Color();let k=0;
      for(let i=0;i<n*2&&k<n;i++){const a=R()*TAU,r=Math.sqrt(R())*225;const x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.hypot(x+70,z-40)<36||Math.hypot(x-60,z+60)<14)continue;
        m.compose(new THREE.Vector3(x,ground(x,z),z),new THREE.Quaternion(),new THREE.Vector3(1,.85+R()*.3,1));im.setMatrixAt(k,m);c.setRGB(.25+R()*.25,.12+R()*.1,.08+R()*.06);im.setColorAt(k,c);k++;}
      im.count=k;im.castShadow=true;im.receiveShadow=true;root.add(im);}
    /* gallows */
    {const x=-70,z=40,y=ground(x,z);Bm.add(G.box(60,8,30),TM(x,y,z),0x5a3e2a);Bm.add(G.box(4,46,4),TM(x-24,y+8,z),0x4a3222);Bm.add(G.box(4,46,4),TM(x+24,y+8,z),0x4a3222);Bm.add(G.box(54,4,4),TM(x,y+54,z),0x4a3222);
      for(let k=0;k<3;k++)Bm.add(G.box(.6,14,.6),TM(x-14+k*14,y+40,z),0xc8b080);}
    /* the ArchGovernor's image, standing on a hovering disc above the crowd */
    const holo=new THREE.Group();{const H=new GeoBuilder();H.add(G.cyl(16,12,4,24),TM(0,0,0),0x2a2622);ARCH.statue(H,0,4,0,26,0x2a2420,0);H.add(G.box(9,30,7),TM(0,4,0),0x26201c);holo.add(H.mesh(mats().metal));
      const under=glowSprite(glowTexture([[0,"rgba(220,240,255,1)"],[.3,"rgba(140,190,255,.35)"],[1,"rgba(0,0,0,0)"]]),90,.9);under.position.y=-3;holo.add(under);}
    holo.position.set(0,COMMON_Y()+300,0);root.add(holo);
    /* Gray patrol platforms */
    const cages=[];[[180,150,-120],[-170,120,150]].forEach(([x,y,z])=>{const g=new THREE.Group();const C=new GeoBuilder();C.add(G.box(26,2,18),TM(0,0,0),0x3a3430);
      for(let k=0;k<6;k++)C.add(G.box(1,14,1),TM(-12+k*4.8,2,9),0x4a4440);C.add(G.box(26,1,1),TM(0,15,9),0x4a4440);ARCH.statue(C,-4,2,-2,9,0x5a6066,0);ARCH.statue(C,6,2,1,9,0x5a6066,0);
      g.add(C.mesh(mats().metal));const gl=glowSprite(GLOW_WARM,40,.6);gl.position.y=-3;g.add(gl);g.position.set(x,ground(x,z)+y,z);root.add(g);cages.push(g);});
    /* the Laurel on its post */
    {const x=60,z=-60,y=ground(x,z);Bm.add(G.cyl(4,5,30,8),TM(x,y,z),0x6a5a4a);Bm.add(G.torus(10,2.5,20),TM(x,y+36,z,0,1,1,1,Math.PI/2),0xd9b060);}
    /* mine shaft headframe */
    {const x=SHAFT.x,z=SHAFT.z,y=ground(x+SHAFT.r+30,z);Bm.add(G.torus(SHAFT.r+8,8,40),TM(x,y+2,z,0,1,1,1,Math.PI/2),0x4a4440);
      for(let k=0;k<4;k++){const a=k/4*TAU+.4;Bm.add(G.box(8,160,8),TM(x+Math.cos(a)*(SHAFT.r-10),y,z+Math.sin(a)*(SHAFT.r-10)),0x5a524a);}Bm.add(G.box(SHAFT.r*1.6,8,8),TM(x,y+160,z),0x5a524a);}
    root.add(Bm.mesh(mats().metal));
    /* the ClawDrill at the rock face (enter it for the deep mine) */
    const drill=makeClawDrill(.42,R);drill.position.set(FACE.x+30,ground(FACE.x+30,FACE.z+30)+30,FACE.z+30);drill.rotation.y=2.4;root.add(drill);
    const drillGlow=glowSprite(GLOW_WARM,220,.8);drillGlow.position.set(FACE.x-40,drill.position.y,FACE.z-30);root.add(drillGlow);
    /* the Bubble Garden */
    const gTrees=scatter(60,GARDEN.r*1.8,R,(x,z)=>{x+=GARDEN.x;z+=GARDEN.z;if(Math.hypot(x-GARDEN.x,z-GARDEN.z)>GARDEN.r*.9)return null;return {x,y:ground(x,z),z,s:5+R()*4,c:[0x4f8a3a,0x5e9a44,0x3e7a32][(R()*3)|0]};});
    root.add(makeForest(gTrees,"broad",3));
    const dome=new THREE.Mesh(new THREE.SphereGeometry(GARDEN.r,32,16,0,TAU,0,Math.PI/2),new THREE.MeshPhongMaterial({color:col(0xa8e0a0),transparent:true,opacity:.14,shininess:100,emissive:col(0x2a6a2a),emissiveIntensity:.4,depthWrite:false}));
    dome.position.set(GARDEN.x,ground(GARDEN.x,GARDEN.z),GARDEN.z);root.add(dome);
    const gGlow=glowSprite(glowTexture([[0,"rgba(180,255,170,.9)"],[.4,"rgba(80,180,80,.25)"],[1,"rgba(0,0,0,0)"]]),440,.6);gGlow.position.set(GARDEN.x,ground(GARDEN.x,GARDEN.z)+70,GARDEN.z);root.add(gGlow);
    /* window glints up the stacks */
    {const n=1800,g=new THREE.BufferGeometry(),p=new Float32Array(n*3);for(let i=0;i<n;i++){const a=R()*TAU,lv=(R()*LV)|0;const r=wallR(a)+lv*STEP-R()*14;p[i*3]=Math.cos(a)*r;p[i*3+1]=lv*RISE+50+8+R()*30;p[i*3+2]=Math.sin(a)*r;}
      g.setAttribute("position",new THREE.BufferAttribute(p,3));root.add(new THREE.Points(g,new THREE.PointsMaterial({color:col(0xffc070),size:3,transparent:true,opacity:.85,depthWrite:false,blending:THREE.AdditiveBlending})));}
    /* drifting dust in the lamp light */
    const dust=(function(){const n=1400,g=new THREE.BufferGeometry(),p=new Float32Array(n*3);for(let i=0;i<n;i++){const a=R()*TAU,r=Math.sqrt(R())*700;p[i*3]=Math.cos(a)*r;p[i*3+1]=R()*1400;p[i*3+2]=Math.sin(a)*r;}g.setAttribute("position",new THREE.BufferAttribute(p,3));
      return new THREE.Points(g,new THREE.PointsMaterial({color:col(0xffd8a8),size:2,transparent:true,opacity:.45,depthWrite:false}));})();root.add(dust);
    SITES.lykos.onTod=n=>{rigs.forEach((l,i)=>{l.intensity=(i===0?2.2:1.2)*(1.15-n*.5);});};
    return {update(dt,t){drill.userData.update&&drill.userData.update(dt,t);drillGlow.material.opacity=.55+.35*Math.sin(t*7)*Math.sin(t*3.1);
      holo.position.y=COMMON_Y()+300+Math.sin(t*.8)*6;holo.rotation.y=Math.sin(t*.3)*.4;cages.forEach((c,i)=>{c.position.y+=Math.sin(t*1.1+i*2)*.05;c.rotation.y=Math.sin(t*.2+i)*.6;});dust.rotation.y+=dt*.008;}};
  }};

/* ===================== THE CLAWDRILL ===================== */
/* A many-armed red machine: armoured cab with a glowing eye, limbs braced against the tunnel walls,
   and drill claws biting the rock. */
function makeClawDrill(s,R){const g=new THREE.Group();const D=new GeoBuilder();const RED=[0xb0301e,0xc23a22,0x9a2818,0x8a2216];
  const seg=(a,b,r,c)=>{const d=b.clone().sub(a);const L=d.length();const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());
    D.add(new THREE.CylinderGeometry(r*.85,r,L,10).translate(0,L/2,0),new THREE.Matrix4().compose(a,q,new THREE.Vector3(1,1,1)),c,1);
    D.add(G.box(r*1.2,L*.6,r*.5),new THREE.Matrix4().compose(a.clone().addScaledVector(d,.2),q,new THREE.Vector3(1,1,1)),0x6a1a10);
    D.add(new THREE.SphereGeometry(r*1.25,10,8),new THREE.Matrix4().makeTranslation(b.x,b.y,b.z),c);};
  /* body */
  D.add(G.box(90,80,70),TM(0,-40,0),RED[0],1);D.add(G.box(70,40,90),TM(-10,30,0),RED[1],1);D.add(G.box(50,30,50),TM(30,60,0),RED[2],1);
  for(let k=0;k<6;k++)D.add(G.box(8,90,8),TM(-40+k*16,-45,36),0x5a1a10);
  D.add(G.cyl(26,30,20,16),TM(-50,-50,0,0,1,1,1,0,Math.PI/2),0x3a2a24);
  /* limbs: three on each side, braced out against the walls */
  const limbs=[];const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  [[-1,0],[1,0]].forEach(([side])=>{for(let k=0;k<3;k++){const sh=V(-30+k*30,0,side*40);const el=V(-60+k*50+(R()-.5)*20,90+k*30,side*(150+R()*30));const ft=V(-90+k*70,-40+k*60,side*(260+R()*40));
    seg(sh,el,14,RED[(k+1)%4]);seg(el,ft,10,RED[k%4]);D.add(G.cone(10,34,8),new THREE.Matrix4().compose(ft,new THREE.Quaternion().setFromUnitVectors(V(0,1,0),ft.clone().sub(el).normalize()),V(1,1,1)),0x2a2420);}});
  /* the drill arm, reaching forward to the face */
  const sh=V(50,20,0),el=V(140,80,20),wr=V(230,40,0);seg(sh,el,18,RED[1]);seg(el,wr,14,RED[0]);
  g.add(D.mesh(mats().metal));
  const head=new THREE.Group();const Hd=new GeoBuilder();Hd.add(G.cyl(18,22,30,14),TM(0,0,0,0,1,1,1,0,-Math.PI/2),0x7a6a58,1);
  for(let k=0;k<6;k++){const a=k/6*TAU;Hd.add(G.cone(6,50,8),TM(30,Math.cos(a)*12,Math.sin(a)*12,0,1,1,1,0,-Math.PI/2),0xc8c8c8);}
  head.add(Hd.mesh(mats().metal));head.position.copy(wr);g.add(head);
  /* the eye */
  const eye=new THREE.Mesh(new THREE.SphereGeometry(11,16,12),new THREE.MeshBasicMaterial({color:col(0xf0f6ff)}));eye.position.set(48,48,0);g.add(eye);
  const eg=glowSprite(glowTexture([[0,"rgba(255,255,255,1)"],[.2,"rgba(220,230,255,.6)"],[1,"rgba(0,0,0,0)"]]),120,.95);eg.position.copy(eye.position);g.add(eg);
  for(let k=0;k<4;k++){const l=new THREE.Mesh(new THREE.SphereGeometry(3,8,6),new THREE.MeshBasicMaterial({color:col(0xff5030)}));l.position.set(30,74,-15+k*10);g.add(l);}
  g.scale.setScalar(s);
  g.userData.update=(dt,t)=>{head.rotation.x+=dt*3;eg.material.opacity=.8+.15*Math.sin(t*5);};
  return g;}
window.__clawDrill=makeClawDrill;

/* ===================== THE DEEP MINE ===================== */
(function(){const N=makeNoise(808);
  const CH=x=>Math.sin(x*.004)*90;                 /* the lava channel's course along z */
  function ground(x,z){const w=Math.abs(x-CH(z));let h=(N.f(x*.006,0,z*.006,4)-.5)*60;
    const wall=380+N.f(0,z*.003,1,3)*120;if(Math.abs(x)>wall){const k=Math.abs(x)-wall;h+=Math.pow(k,1.2)*3.4+N.f(x*.008,2,z*.008,4)*240*sst(0,120,k);}
    if(w<60)h-=sst(60,20,w)*36;
    const ds=Math.hypot(x+60,z-140);h+=Math.max(0,520-ds*2.6)*(.85+N.f(x*.02,3,z*.02,3)*.4);   /* the black rock spire */
    return Math.min(h,1800);}
  function color(x,z,h,slope){let c=mixc([52,38,30],[86,60,44],N.f(x*.006,4,z*.006,4));if(slope>.5)c=mixc(c,[34,26,22],(slope-.5)*1.6);
    const w=Math.abs(x-CH(z));if(w<30)c=[255,140,40];else if(w<70)c=mixc([180,70,24],c,sst(30,70,w));
    return c;}
  const lm=[
   {id:"drill1",name:"The ClawDrill",pos:[220,260,-260],desc:"Helldivers steer the drill from inside its cab, its claws chewing the rock face. In the heat of the deep mines it overheats if the diver slows.",cam:{target:[200,200,-260],r:520,theta:.12,phi:1.25}},
   {id:"drill2",name:"A second drill",pos:[-260,420,320],desc:"Drills brace their limbs against the tunnel walls as they climb and cut.",cam:{target:[-240,360,320],r:480,theta:-.1,phi:1.3}},
   {id:"lava",name:"The molten channel",pos:[0,20,0],desc:"Heat and molten rock in the deep: why the miners work in frysuits.",cam:{target:[0,0,0],r:800,theta:.05,phi:1.2}},
   {id:"spire",name:"The black spire",pos:[-60,520,140],desc:"A pillar of rock the drills have yet to break.",cam:{target:[-60,300,140],r:900,theta:3.0,phi:1.25}}
  ];
  SITES.lykosmine={name:"The Deep Mine",body:"mars",poi:"lykos",epithet:"Lykos · the helium-3 tunnels",seed:88,
    blurb:"Far below the township, Helldivers like Darrow run the clawDrills through hot rock, chasing helium-3 among gas pockets and heat that would kill a man without a frysuit.",
    facts:[["Mined","Helium-3"],["Worked by","Helldivers in clawDrills"],["Danger","Heat, gas pockets, collapse"]],
    note:"The lava and the machines’ look follow concept art rather than the books.",
    todLabel:{day:"Drilling",dusk:"Overheat",night:"Lamps out"},
    ground,targetLift:0,bounds:1200,minR:120,maxR:3200,shadow:1400,win:[1.4,1.2],winK:1.2,cam:{target:[0,220,-100],r:1300,theta:.04,phi:1.22},defaultTod:"day",
    tods:{
      day:{top:0x0a0402,hor:0x3a1808,bot:0x0a0402,sun:0xff9a50,sunEl:.9,sunAz:.6,sunI:1.3,skyL:0x8a4a2a,gndL:0x3a1a0a,hemiI:.55,fog:0x3a1a0a,fogD:.00032,night:.8,exp:1.15,haze:0},
      dusk:{top:0x140402,hor:0x5a1a06,bot:0x0a0302,sun:0xff6a20,sunEl:.7,sunAz:.9,sunI:1.6,skyL:0xaa3a1a,gndL:0x4a1a08,hemiI:.6,fog:0x4a1806,fogD:.00036,night:1,exp:1.2,haze:0},
      night:{top:0x020101,hor:0x140804,bot:0x020101,sun:0xff8040,sunEl:1.1,sunAz:.2,sunI:.4,skyL:0x2a140a,gndL:0x0a0402,hemiI:.25,fog:0x120804,fogD:.0003,night:1,exp:1.3,haze:0}},
    landmarks:lm,
    build(ctx){const R=ctx.R,root=ctx.root;
      root.add(makeTerrain({size:3200,seg:320,height:ground,color,cast:true}));
      /* molten rock: an animated emissive channel and falls down the walls */
      const LU={t:{value:0}};
      const lavaMat=new THREE.ShaderMaterial({uniforms:LU,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
        vertexShader:"varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
        fragmentShader:"uniform float t;varying vec2 vU;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}"+
          "void main(){vec2 p=vU*vec2(6.,40.);p.y-=t*1.5;float v=n(p)*.6+n(p*2.3+3.)*.3+n(p*5.)*.1;float edge=smoothstep(0.,.25,vU.x)*smoothstep(1.,.75,vU.x);vec3 c=mix(vec3(.9,.18,.02),vec3(1.,.85,.4),pow(v,2.2));gl_FragColor=vec4(c*edge*(.6+v),edge*.95);}"});
      {const pts=[];for(let z=-1600;z<=1600;z+=40)pts.push(new THREE.Vector3(CH(z),0,z));const curve=new THREE.CatmullRomCurve3(pts);
        const g=new THREE.PlaneGeometry(1,1,1,160);const p=g.attributes.position;for(let i=0;i<p.count;i++){const u=p.getX(i)+.5,v=p.getY(i)+.5;const c=curve.getPoint(v);p.setXYZ(i,c.x+(u-.5)*60,ground(c.x,c.z)+3,c.z);}
        g.computeVertexNormals();root.add(new THREE.Mesh(g,lavaMat));}
      const falls=[];[[-520,-200,900],[540,300,700],[-480,600,600]].forEach(([x,z,hgt])=>{const g=new THREE.PlaneGeometry(50,hgt,1,20);const m=new THREE.Mesh(g,lavaMat);m.position.set(x*.92,hgt/2,z);m.lookAt(0,hgt/2,z);root.add(m);
        const gl=glowSprite(GLOW_WARM,420,.7);gl.position.set(x*.85,hgt*.3,z);root.add(gl);falls.push(gl);});
      /* lights from the lava */
      [[0,60,-300],[0,60,500],[-420,300,-200]].forEach(([x,y,z],i)=>{const L=new THREE.PointLight(col(0xff7a30),2.2,1600,1.5);L.position.set(CH(z)+x,y,z);root.add(L);});
      /* two clawdrills on the walls */
      const d1=makeClawDrill(1.25,R);d1.position.set(220,ground(220,-260)+120,-260);d1.rotation.set(0,2.6,.25);root.add(d1);
      const d2=makeClawDrill(.95,R);d2.position.set(-300,ground(-300,320)+160,320);d2.rotation.set(.1,-.6,-.3);root.add(d2);
      const L1=new THREE.PointLight(col(0xdde8ff),1.6,900,1.6);L1.position.set(220+50,ground(220,-260)+200,-260);root.add(L1);
      /* rising sparks and embers */
      const n=1800,g=new THREE.BufferGeometry(),pp=new Float32Array(n*3),vel=new Float32Array(n);
      for(let i=0;i<n;i++){const z=(R()-.5)*3000;pp[i*3]=CH(z)+(R()-.5)*140;pp[i*3+1]=R()*900;pp[i*3+2]=z;vel[i]=20+R()*60;}
      g.setAttribute("position",new THREE.BufferAttribute(pp,3));
      const sparks=new THREE.Points(g,new THREE.PointsMaterial({color:col(0xffa050),size:4,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending}));root.add(sparks);
      /* drill sparks at the rock face */
      const dsg=glowSprite(GLOW_WARM,260,.9);dsg.position.copy(d1.localToWorld(new THREE.Vector3(260,40,0)));root.add(dsg);
      return {update(dt,t){LU.t.value=t;d1.userData.update(dt,t);d2.userData.update(dt,t);falls.forEach((f,i)=>f.material.opacity=.55+.2*Math.sin(t*2+i));dsg.material.opacity=.5+.5*Math.abs(Math.sin(t*13)*Math.sin(t*7));
        const a=g.attributes.position.array;for(let i=0;i<n;i++){a[i*3+1]+=vel[i]*dt;a[i*3]+=Math.sin(t+i)*dt*6;if(a[i*3+1]>1000){a[i*3+1]=0;}}g.attributes.position.needsUpdate=true;}};
    }};
})();
})();

/* ---- 44-site-mars-more.js ---- */
/* ===================== YORKTON · ATTICA · ASGARD ===================== */
(function(){
/* ---------- YORKTON ---------- */
{const N=makeNoise(505);
const ground=(x,z)=>(N.f(x*.0008,0,z*.0008,4)-.5)*60+sst(2600,3600,Math.hypot(x,z))*500;
const color=(x,z,h,sl)=>{let c=mixc([128,86,62],[150,110,80],N.f(x*.002,3,z*.002,3));if(Math.hypot(x,z)<2300)c=mixc(c,[70,64,60],.7);return c;};
const BZ={x:350,z:400};
SITES.yorkton={name:"Yorkton",body:"mars",poi:"yorkton",epithet:"Martian city · hideout of the Sons of Ares",seed:51,
  blurb:"A working city of Mars. In its dark, crowded Bazaar, a district even Obsidians avoid, Mickey the Carver runs a smoky club where dancers move inside glass pillars, and in a back room he remakes bodies.",
  facts:[["Carver","Mickey, a Violet"],["Patrons","The Sons of Ares"],["Quarter","The Bazaar"]],note:"Layout is an artistic reconstruction; the books describe the Bazaar and Mickey’s club, little of the wider city.",
  ground,bounds:2600,minR:120,maxR:6000,shadow:1600,win:[2,1.6],winK:1.2,cam:{target:[0,40,100],r:2600,theta:.4,phi:1.0},defaultTod:"night",
  skyBody:{id:"phobos",dir:[.3,.35,-.9],size:300},
  tods:{day:{top:0x6a7fa6,hor:0xe2c4a0,bot:0xa88060,sun:0xfff0d8,sunEl:.9,sunAz:-.8,sunI:2.8,skyL:0xbccbe4,gndL:0x7a5038,hemiI:.85,fog:0xc8a888,fogD:.00012,night:0,exp:.95,haze:.4},
    dusk:{top:0x2a2e52,hor:0xe2804a,bot:0x5a3426,sun:0xff9a58,sunEl:.07,sunAz:-.4,sunI:2.3,skyL:0x86789e,gndL:0x4a2e24,hemiI:.6,fog:0xa06048,fogD:.00012,night:.6,exp:1.05,haze:1},
    night:{top:0x050510,hor:0x1a1420,bot:0x0b090c,sun:0x8aa0d8,sunEl:.5,sunAz:2.2,sunI:.2,skyL:0x2a2c44,gndL:0x0c0a0a,hemiI:.18,fog:0x14101a,fogD:.00011,night:1,exp:1.15,stars:1}},
  landmarks:[
   {id:"carver",name:"Mickey’s Club",pos:[BZ.x+120,90,BZ.z-60],desc:"Smoke, pulsing lights, and dancers inside glass pillars. In a workshop behind it, Mickey the Carver spends months remaking Darrow into a Gold.",cam:{target:[BZ.x+120,20,BZ.z-60],r:520,theta:.6,phi:1.05}},
   {id:"bazaar",name:"The Bazaar",pos:[BZ.x,60,BZ.z],desc:"A dense, dark lowColor district so rough that even Obsidians steer clear. The Sons of Ares hide in plain sight here.",cam:{target:[BZ.x,10,BZ.z],r:900,theta:.3,phi:1.0}},
   {id:"spires",name:"High City",pos:[-600,500,-500],desc:"The towers of Yorkton’s higher Colors, looking down on the Bazaar.",cam:{target:[-600,100,-500],r:1300,theta:-.3,phi:1.0}}],
  build(ctx){const R=ctx.R,root=ctx.root;root.add(makeTerrain({size:8000,seg:200,height:ground,color}));
    const B=new GeoBuilder(),Bg=new GeoBuilder();
    ARCH.district(B,0,0,4200,60,(x,z,r)=>{const d=Math.hypot(x+600,z+500);return 24+Math.pow(r(),2.4)*420*Math.max(.15,1-d/1800);},ground,[0x8a7a6c,0x9a8a7a,0x6e6258,0xb0a090,0x7a6a5e],61,(x,z)=>Math.hypot(x-BZ.x,z-BZ.z)<520||Math.hypot(x,z)>2100);
    for(let i=0;i<1700;i++){const a=R()*TAU,r=Math.sqrt(R())*500;const x=BZ.x+Math.cos(a)*r,z=BZ.z+Math.sin(a)*r;const y=ground(x,z);const w=8+R()*12;
      B.add(G.box(w,8+R()*18,w),TM(x,y,z,R()),[0x5a4e46,0x6a5a4e,0x4e443e,0x7a6656][(R()*4)|0],1);if(R()<.35)B.add(G.box(w*1.3,1.2,w),TM(x,y+10+R()*8,z,R()),[0x8a2e2a,0x2e5a6a,0x8a6a2a,0x5a2e6a][(R()*4)|0],2,true);}
    {const x=BZ.x+120,z=BZ.z-60,y=ground(x,z);B.add(G.box(90,30,70),TM(x,y,z,.3),0x2a2226,1);}
    root.add(B.mesh(mats().bld));
    const pillars=[];const pm=new THREE.MeshBasicMaterial({color:col(0xc070ff),transparent:true,opacity:.7});
    for(let k=0;k<6;k++){const p=new THREE.Mesh(new THREE.CylinderGeometry(4,4,40,10),pm.clone());const a=k/6*TAU;p.position.set(BZ.x+120+Math.cos(a)*30,ground(BZ.x+120,BZ.z-60)+50,BZ.z-60+Math.sin(a)*30);root.add(p);pillars.push(p);}
    const neon=[];for(let i=0;i<120;i++){const a=R()*TAU,r=Math.sqrt(R())*480;const s=glowSprite([GLOW_WARM,GLOW_RED,GLOW_BLUE][(R()*3)|0],18+R()*24,0);s.position.set(BZ.x+Math.cos(a)*r,ground(BZ.x,BZ.z)+12+R()*20,BZ.z+Math.sin(a)*r);root.add(s);neon.push(s);}
    SITES.yorkton.onTod=n=>neon.forEach(s=>s.material.opacity=n*.85);
    return {update(dt,t){pillars.forEach((p,i)=>{p.material.color.setHSL(((t*.1+i/6)%1),.8,.6);});}};}};}

/* ---------- ATTICA ---------- */
{const N=makeNoise(606);
const PEAKS=[[0,0,1500],[-900,-500,1050],[850,-650,1100],[1100,400,980],[-1100,500,1000],[-200,1050,900],[500,-1250,940]];
const ground=(x,z)=>{let h=(N.f(x*.0008,0,z*.0008,4)-.5)*80;PEAKS.forEach(p=>{const d=Math.hypot(x-p[0],z-p[1]);h=Math.max(h,p[2]*Math.pow(Math.max(0,1-d/1100),1.6)+(N.f(x*.004,1,z*.004,3)-.5)*90*sst(1100,200,d));});return h;};
const color=(x,z,h,sl)=>{let c=mixc([96,110,70],[120,120,80],N.f(x*.002,2,z*.002,3));if(sl>.4)c=mixc(c,[110,92,78],(sl-.4)*1.6);if(h>800)c=mixc(c,[132,120,110],sst(800,1100,h));return c;};
SITES.attica={name:"Attica",body:"mars",poi:"attica",epithet:"City of seven peaks · seat of the Jackal",seed:71,
  blurb:"A city built across seven mountain peaks in Cimmeria. Each summit is crowned with jagged steel-and-glass towers like a crown of thorns, linked by bridges, with the lower wards running down the slopes. The Jackal rules from here after the Iron Rain.",
  facts:[["Ruler","Adrius au Augustus, the Jackal"],["Region","Cimmeria"],["Citadel","On the highest peak, with a prison below"]],note:"Layout is an artistic reconstruction from the books’ descriptions.",
  ground,bounds:2600,minR:150,maxR:7000,shadow:2000,win:[2.4,2],cam:{target:[0,500,0],r:4200,theta:.5,phi:1.08},defaultTod:"dusk",
  skyBody:{id:"phobos",dir:[-.4,.3,-.85],size:280},
  tods:{day:{top:0x5a7aa8,hor:0xdcc8b0,bot:0x9a8a78,sun:0xfff0d8,sunEl:.9,sunAz:-.7,sunI:2.9,skyL:0xbccbe4,gndL:0x6a5a40,hemiI:.85,fog:0xc8c0b8,fogD:.00008,night:0,exp:.95,haze:.4},
    dusk:{top:0x1e2448,hor:0xe0703e,bot:0x4a2a22,sun:0xff8a48,sunEl:.06,sunAz:-.9,sunI:2.4,skyL:0x7a6a90,gndL:0x3a2a22,hemiI:.55,fog:0x8a5040,fogD:.00008,night:.6,exp:1.05,haze:1},
    night:{top:0x04040c,hor:0x141420,bot:0x08080a,sun:0x8aa0d8,sunEl:.5,sunAz:2,sunI:.2,skyL:0x2a2c44,gndL:0x0a0a0c,hemiI:.18,fog:0x101018,fogD:.00008,night:1,exp:1.15,stars:1}},
  landmarks:[
   {id:"citadel",name:"The Jackal’s Citadel",pos:[0,1900,0],desc:"A fortress of more than two dozen floors on the highest peak, with a prison for thousands. Darrow is held by the Jackal for nearly a year before Holiday and Trigg break him out.",cam:{target:[0,1500,0],r:1500,theta:.6,phi:1.1}},
   {id:"pad",name:"Landing Pad",pos:[250,1560,-180],desc:"Reached from the citadel along a tree-lined path.",cam:{target:[250,1500,-180],r:700,theta:.9,phi:1.0}},
   {id:"bridges",name:"The Bridges",pos:[-450,1250,-250],desc:"Spans linking the crowned peaks high above the valleys.",cam:{target:[-450,1100,-250],r:1400,theta:-.2,phi:1.15}},
   {id:"wards",name:"Lower Wards",pos:[700,450,700],desc:"The city’s lower districts, spilling down the mountainsides.",cam:{target:[700,300,700],r:1300,theta:.9,phi:1.0}}],
  build(ctx){const R=ctx.R,root=ctx.root;root.add(makeTerrain({size:8000,seg:300,height:ground,color,cast:true}));
    const B=new GeoBuilder(),Bg=new GeoBuilder();
    PEAKS.forEach((p,i)=>{const top=ground(p[0],p[1]);const n=i?26:40;
      for(let k=0;k<n;k++){const a=k/n*TAU+R()*.2,r=(i?90:140)*(.4+R()*.8);const x=p[0]+Math.cos(a)*r,z=p[1]+Math.sin(a)*r;const y=ground(x,z)-6;const h=(i?160:240)+R()*(i?220:420);
        const g=new THREE.ConeGeometry(10+R()*14,h,4+((R()*3)|0)).translate(0,h/2,0);Bg.add(g,TM(x,y,z,R(),1,1,1,(R()-.5)*.35,(R()-.5)*.35),R()<.6?0x8ea4b4:0xb0bac2,1);}
      Bg.add(G.cyl(i?60:110,i?80:140,i?70:120,8),TM(p[0],top-10,p[1]),0x6a7888,1);});
    /* fortress citadel */
    {const y=ground(0,0);B.add(G.box(180,300,180),TM(0,y,0,.3),0x5a5c62,1);B.add(G.box(120,90,120),TM(0,y+300,0,.3),0x6a6e76,1);ARCH.spire(Bg,0,y+390,0,30,380,0x9aaab8,0xd9b060);
      B.add(G.cyl(70,72,6,24),TM(250,ground(250,-180),-180),0x7a7c80,0,true);}
    /* bridges between peaks */
    for(let i=1;i<PEAKS.length;i++){const a=PEAKS[0],b=PEAKS[i];const ya=ground(a[0],a[1])*.82,yb=ground(b[0],b[1])*.9;const L=Math.hypot(b[0]-a[0],b[1]-a[1]);const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);const slope=Math.atan2(yb-ya,L);
      Bg.add(G.box(L,10,20),TM((a[0]+b[0])/2,(ya+yb)/2,(a[1]+b[1])/2,-ang,1,1,1,0,slope),0x8a96a2,1);}
    /* wards on the slopes */
    for(let i=0;i<2400;i++){const x=(R()-.5)*4600,z=(R()-.5)*4600;const y=ground(x,z);if(y<120||y>900)continue;B.add(G.box(16+R()*20,12+R()*26,16+R()*20),TM(x,y-4,z,R()),[0xb8b0a4,0x9a9286,0xc8c0b2,0x8a8276][(R()*4)|0],1);}
    root.add(B.mesh(mats().bld));root.add(Bg.mesh(mats().glass));
    const path=[];for(let k=0;k<20;k++){const t=k/19;const x=t*250,z=-t*180;path.push({x,y:ground(x,z),z,s:4,c:0x3e6a32});}root.add(makeForest(path,"broad",9));
    const ships=[];for(let i=0;i<6;i++){const s=makeShip("frigate",50);root.add(s);ships.push({s,a:R()*TAU,r:900+R()*900,y:1600+R()*500,sp:.05+R()*.05});}
    return {update(dt,t){ships.forEach(o=>{o.a+=dt*o.sp;o.s.position.set(Math.cos(o.a)*o.r,o.y,Math.sin(o.a)*o.r);o.s.rotation.y=-o.a-Math.PI/2;});}};}};}

/* ---------- ASGARD / SOUTH POLE ---------- */
{const N=makeNoise(707);
const ground=(x,z)=>{let h=(N.f(x*.0006,0,z*.0006,5)-.5)*260;const r=1-Math.abs(N.f(x*.0012,3,z*.0012,4)*2-1);h+=Math.pow(r,3)*420*sst(1800,4500,Math.hypot(x,z));return h;};
const color=(x,z,h,sl)=>{let c=mixc([226,232,240],[246,248,252],N.f(x*.003,1,z*.003,3));if(sl>.55)c=mixc(c,[90,96,108],(sl-.55)*1.8);return c;};
const AS={x:200,y:1800,z:-300};
SITES.asgard={name:"Asgard",body:"mars",poi:"southpole",epithet:"The South Pole of Mars · lands of the Obsidians",seed:81,
  blurb:"A frozen continent cut off by the South Sea, home to some 800,000 Obsidians. Above it floats Asgard, a mountain station from which Gold overseers play the tribes’ gods.",
  facts:[["People","Obsidian tribes"],["Tribe","The Valkyrie Spires, Ragnar’s people"],["Asgard","A flying mountain station"]],note:"Layout is an artistic reconstruction from the books’ descriptions.",
  ground,bounds:3600,minR:150,maxR:9000,shadow:2800,win:[2.4,2],cam:{target:[0,300,0],r:5600,theta:.3,phi:1.05},defaultTod:"day",
  tods:{day:{top:0x6a86b0,hor:0xe6ecf4,bot:0xc8d0dc,sun:0xf6f6ff,sunEl:.2,sunAz:-.4,sunI:2.6,skyL:0xd0dcf0,gndL:0x8a96a8,hemiI:1,fog:0xdfe6ee,fogD:.00007,night:.1,exp:.9,haze:.6},
    dusk:{top:0x1a2448,hor:0xe08a7a,bot:0x6a6a80,sun:0xffa888,sunEl:.03,sunAz:-.2,sunI:2,skyL:0x8a8ab0,gndL:0x4a4a5a,hemiI:.7,fog:0xa08a98,fogD:.00007,night:.5,exp:1,haze:1},
    night:{top:0x030612,hor:0x0e1630,bot:0x0a0c14,sun:0x9ab8ff,sunEl:.6,sunAz:1.4,sunI:.4,skyL:0x34466e,gndL:0x10141e,hemiI:.35,fog:0x0e1424,fogD:.00006,night:1,exp:1.2,stars:1}},
  landmarks:[
   {id:"asgard",name:"Asgard",pos:[AS.x,AS.y+300,AS.z],desc:"The flying mountain from which the Board of Quality Control watches the Obsidians and fakes their gods. Darrow, Mustang and Sefi seize it in Morning Star, and Sefi executes the false queen Alia Snowsparrow.",cam:{target:[AS.x,AS.y,AS.z],r:2600,theta:.5,phi:1.1}},
   {id:"spires",name:"The Valkyrie Spires",pos:[-1600,500,900],desc:"Ragnar’s tribe, ruled by Queen Alia Snowsparrow.",cam:{target:[-1600,200,900],r:1500,theta:-.4,phi:1.0}},
   {id:"field",name:"The Ice Field",pos:[1400,200,1300],desc:"Shot down over the ice, Darrow and Ragnar fight Aja and Cassius with razors. Ragnar dies here at Aja’s hand.",cam:{target:[1400,100,1300],r:1300,theta:.7,phi:1.0}}],
  build(ctx){const R=ctx.R,root=ctx.root;root.add(makeTerrain({size:10000,seg:300,height:ground,color,cast:true}));
    const B=new GeoBuilder();
    /* Valkyrie Spires: ice spires and longhouses */
    for(let i=0;i<40;i++){const a=R()*TAU,r=R()*500;const x=-1600+Math.cos(a)*r,z=900+Math.sin(a)*r;const y=ground(x,z);if(R()<.5){B.add(G.cone(30+R()*40,200+R()*400,6),TM(x,y-10,z),0xcfe4f0);}else{B.add(G.box(60,24,24),TM(x,y,z,R()),0x5a4a3a,1);B.add(G.gable(64,22,26),TM(x,y+24,z,R()),0x4a3a2e);}}
    /* crashed ship on the ice field */
    {const s=makeShip("torch",60);s.position.set(1400,ground(1400,1300)+20,1300);s.rotation.set(.3,1.1,.4);root.add(s);}
    /* Asgard */
    const ast=new THREE.Group();ast.position.set(AS.x,AS.y,AS.z);root.add(ast);
    {const rock=new THREE.ConeGeometry(700,1300,24,8);rock.rotateX(Math.PI);rock.translate(0,-650,0);const p=rock.attributes.position;
      for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const k=1+(N.f(x*.004,y*.004,z*.004,4)-.5)*.8;if(y<-5)p.setXYZ(i,x*k,y,z*k);}rock.computeVertexNormals();
      const A=new GeoBuilder();A.add(rock,null,0x4a4c52,0,true);A.add(G.cyl(720,700,60,24),TM(0,-60,0),0x5a5c62,0,true);A.add(G.cyl(690,690,4,24),TM(0,0,0),0xe6eef6,0,true);
      for(let k=0;k<12;k++){const a=k/12*TAU;ARCH.tower(A,Math.cos(a)*560,0,Math.sin(a)*560,30,140,0x3a3c42,null,1);}
      A.add(G.box(300,160,200),TM(0,0,0),0x2e3036,1);ARCH.spire(A,0,160,0,40,420,0x4a4c54,0x9fd0ff);
      for(let k=0;k<8;k++)A.add(G.box(60,40,60),TM((R()-.5)*900,0,(R()-.5)*900,R()),0x3a3c42,1);
      ast.add(A.mesh(mats().metal));const g=glowSprite(GLOW_BLUE,2000,.3);g.position.y=-1000;ast.add(g);}
    root.add(B.mesh(mats().bld));
    /* blowing snow */
    const n=2400,g=new THREE.BufferGeometry(),p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(R()-.5)*8000;p[i*3+1]=R()*1500;p[i*3+2]=(R()-.5)*8000;}g.setAttribute("position",new THREE.BufferAttribute(p,3));
    const snow=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:6,transparent:true,opacity:.7,depthWrite:false}));root.add(snow);
    return {update(dt,t){ast.position.y=AS.y+Math.sin(t*.3)*30;const a=snow.geometry.attributes.position;for(let i=0;i<n;i++){let x=a.getX(i)+dt*160,y=a.getY(i)-dt*40;if(x>4000)x=-4000;if(y<0)y=1500;a.setX(i,x);a.setY(i,y);}a.needsUpdate=true;}};}};}
})();

/* ---- 45-site-moons.js ---- */
/* ===================== PHOBOS · GANYMEDE · IO · EUROPA ===================== */
(function(){
/* ---------- PHOBOS: the Hive and the Needles ---------- */
{const N=makeNoise(808);
const ground=(x,z)=>{let h=(N.f(x*.0007,0,z*.0007,5)-.5)*200;[[1200,-900,500],[-1500,700,700],[600,1600,380]].forEach(c=>{const d=Math.hypot(x-c[0],z-c[1])/c[2];if(d<1.3)h+=d<1?(d*d-1)*120:Math.exp(-Math.pow((d-1)*5,2))*60;});return h-Math.hypot(x,z)*Math.hypot(x,z)*.000012;};
const color=(x,z,h,sl)=>mixc([60,56,54],[96,90,84],N.f(x*.002,1,z*.002,4));
SITES.phobos={name:"The Hive",body:"phobos",poi:"phobosport",epithet:"Phobos · city of the Needles",seed:91,
  blurb:"A twelve-kilometer rock hollowed out and wrapped in metal. Over six centuries a jagged city has grown into and above it, its luxury tips called the Needles, while two great ring docks circle the moon and Mars fills the sky.",
  facts:[["Magnate","Quicksilver, Sun Industries"],["Upper city","The Needles"],["Lower city","The Hollows, inside the rock"],["Trade","Helium-3 bound for the Core"]],note:"Layout is an artistic reconstruction from the books’ descriptions.",
  ground,bounds:3200,minR:150,maxR:9000,shadow:2600,win:[2.4,2],cam:{target:[0,300,0],r:5200,theta:.4,phi:1.12},defaultTod:"night",
  skyBody:{id:"mars",dir:[-.2,.34,-.92],size:3900},
  todLabel:{day:"Marslight",dusk:"Terminator",night:"Mars-night"},
  tods:{day:{top:0x020206,hor:0x1a1410,bot:0x050404,sun:0xffffff,sunEl:.6,sunAz:.8,sunI:3,skyL:0x7a5a4a,gndL:0x1a1410,hemiI:.5,fog:0x100c0c,fogD:.00002,night:.3,exp:.95,stars:1,haze:.2},
    dusk:{top:0x020206,hor:0x241410,bot:0x050404,sun:0xffd0a0,sunEl:.08,sunAz:1.4,sunI:2.4,skyL:0x6a4030,gndL:0x100a08,hemiI:.4,fog:0x120c0a,fogD:.00002,night:.7,exp:1,stars:1,haze:.8},
    night:{top:0x010104,hor:0x0a0808,bot:0x030303,sun:0xff9a70,sunEl:.6,sunAz:-.3,sunI:.6,skyL:0x5a3a2c,gndL:0x080606,hemiI:.3,fog:0x080608,fogD:.00002,night:1,exp:1.15,stars:1}},
  landmarks:[
   {id:"helix",name:"Double Helix Towers",pos:[300,1650,-200],desc:"Quicksilver’s twin spiraling towers among the Needles. The Howlers strike the peace talks inside and kidnap Quicksilver, who turns out to be a founder of the Sons of Ares.",cam:{target:[300,900,-200],r:2200,theta:.6,phi:1.15}},
   {id:"docks",name:"The Ring Docks",pos:[0,2100,-2600],desc:"Two great rings of docks circle Phobos, where Martian goods move onto kilometer-long cosmosHaulers. Sevro springs a trap on the Society’s response fleet here.",cam:{target:[0,1600,-2400],r:3600,theta:.2,phi:1.2}},
   {id:"spire",name:"Military Spire",pos:[-900,1200,400],desc:"The Society’s military spire among the Needles.",cam:{target:[-900,600,400],r:1700,theta:-.3,phi:1.1}},
   {id:"skyresh",name:"Skyresh Spaceport",pos:[1300,500,700],desc:"The interplanetary spaceport of the Needles.",cam:{target:[1300,300,700],r:1600,theta:.9,phi:1.05}},
   {id:"hollows",name:"The Hollows",pos:[-400,60,1500],desc:"LowColor slums carved inside the rock, far beneath the Needles.",cam:{target:[-400,0,1400],r:1200,theta:.2,phi:1.0}}],
  build(ctx){const R=ctx.R,root=ctx.root;root.add(makeTerrain({size:9000,seg:260,height:ground,color}));
    const B=new GeoBuilder(),Bm=new GeoBuilder(),Bg=new GeoBuilder();
    const MET=[0x7a7672,0x8a8580,0x5e5a58,0x9a948c,0x4a4644];
    /* the Hive: jagged towers grown over centuries */
    for(let i=0;i<1600;i++){const a=R()*TAU,r=Math.pow(R(),.7)*3300;const x=Math.cos(a)*r,z=Math.sin(a)*r;const y=ground(x,z);const core=Math.max(0,1-r/2600);
      const h=40+Math.pow(R(),2.2)*900*(.2+core)+core*120;const w=24+R()*40;const k=R();
      if(k<.45){(R()<.5?Bm:B).add(G.box(w,h,w*(.6+R()*.8)),TM(x,y-5,z,R(),1,1,1,(R()-.5)*.06,(R()-.5)*.06),MET[(R()*5)|0],1);}
      else if(k<.8){const g=new THREE.ConeGeometry(w*.5,h*1.2,4+((R()*3)|0)).translate(0,h*.6,0);Bm.add(g,TM(x,y-5,z,R(),1,1,1,(R()-.5)*.12,(R()-.5)*.12),MET[(R()*5)|0],1);}
      else{Bm.add(G.cyl(w*.3,w*.5,h,6),TM(x,y-5,z),MET[(R()*5)|0],1);Bm.add(G.cyl(w*.9,w*.9,6,10),TM(x,y-5+h*.7,z),0x3a3634);}}
    /* the Needles: luxury tips; Quicksilver's twin helix towers */
    for(let k=0;k<2;k++){const ox=300+(k?120:-120),oz=-200;for(let s=0;s<60;s++){const t=s/60;const a=t*TAU*3+k*Math.PI;Bg.add(G.box(70,26,40),TM(ox+Math.cos(a)*40,ground(ox,oz)+t*1500,oz+Math.sin(a)*40,-a),k?0xd8c090:0xc0d0dc,1);}
      Bg.add(G.cyl(20,26,1500,10),TM(ox,ground(ox,oz),oz),0xd0d4d8,1);Bg.add(G.cone(30,200,10),TM(ox,ground(ox,oz)+1500,oz),0xd9b060);}
    ARCH.spire(Bm,-900,ground(-900,400),400,60,1200,0x6a6e74,0xb03526);
    for(let i=0;i<8;i++){const x=1300+(i%3-1)*140,z=700+Math.floor(i/3)*140;Bm.add(G.cyl(55,60,10,20),TM(x,ground(x,z)+200,z),0x5a5654,0,true);Bm.add(G.cyl(8,10,200,8),TM(x,ground(x,z),z),0x4a4644);}
    /* the two ring docks arching overhead */
    const ringMat=mats().metal;
    [[5200,2400,0],[6200,2700,.35]].forEach((d,i)=>{const R0=d[0];const geo=new THREE.TorusGeometry(R0,70,10,220,Math.PI);const rm=new THREE.Object3D();rm.position.set(0,d[1]-R0*.55,-2200-i*700);rm.rotation.y=d[2];
      const B2=new GeoBuilder();B2.add(geo,null,0x8a8580,1);const mm=B2.mesh(ringMat);mm.position.copy(rm.position);mm.rotation.copy(rm.rotation);root.add(mm);
      const lt=new THREE.Mesh(new THREE.TorusGeometry(R0,10,6,220,Math.PI),new THREE.MeshBasicMaterial({color:col(0xffd08a)}));lt.position.copy(rm.position).add(new THREE.Vector3(0,0,80));lt.rotation.copy(rm.rotation);root.add(lt);});
    /* cosmosHaulers at the docks */
    for(let i=0;i<7;i++){const s=makeShip(i%3?"torch":"dread",180+R()*120);s.position.set(-2400+i*800,2600+R()*600,-2600-R()*800);s.rotation.y=Math.PI/2+(R()-.5)*.3;root.add(s);}
    root.add(B.mesh(mats().bld));root.add(Bm.mesh(mats().metal));root.add(Bg.mesh(mats().glass));
    const ships=[];for(let i=0;i<40;i++){const s=glowSprite(R()<.5?GLOW_BLUE:GLOW_WARM,30+R()*30,.9);root.add(s);ships.push({s,a:R()*TAU,r:1500+R()*3000,y:800+R()*2400,sp:(R()<.5?-1:1)*(.02+R()*.05)});}
    return {update(dt,t){ships.forEach(o=>{o.a+=dt*o.sp;o.s.position.set(Math.cos(o.a)*o.r,o.y,Math.sin(o.a)*o.r);});}};}};}

/* ---------- GANYMEDE DOCKYARDS ---------- */
{const N=makeNoise(909);
const ground=(x,z)=>-2600+(N.f(x*.0003,0,z*.0003,5)-.5)*500;
const color=(x,z,h,sl)=>{const n=N.f(x*.0006,2,z*.0006,4);return n>.55?mixc([36,64,42],[54,80,48],n):mixc([20,40,62],[26,52,78],n);};
SITES.ganymede={name:"Ganymede Dockyards",body:"ganymede",poi:"docks",epithet:"The shipyards of the Society",seed:101,
  blurb:"A dull grey ring of shipyards around Ganymede’s equator, roughly two hundred kilometers thick and two and a half centuries in the building. Freighters and warships are assembled here, Colossus among them, above a moon that glows like a plum with its cities.",
  facts:[["Built","Over about 250 years"],["Made here","Colossus and the Society’s warships"],["Below","New Troy and Ganymede’s forests and seas"]],note:"Layout is an artistic reconstruction from the books’ descriptions.",
  ground,bounds:5000,minR:250,maxR:14000,shadow:3800,win:[3,2.4],cam:{target:[0,0,0],r:7600,theta:.5,phi:1.05},defaultTod:"day",
  skyBody:{id:"jupiter",dir:[-.4,.3,-.87],size:2600},
  todLabel:{day:"Jupiter-rise",dusk:"Eclipse",night:"Night side"},
  tods:{day:{top:0x020206,hor:0x161220,bot:0x050408,sun:0xffffff,sunEl:.45,sunAz:.9,sunI:3,skyL:0x8a7a68,gndL:0x141018,hemiI:.55,fog:0x0e0c14,fogD:.000015,night:.35,exp:.95,stars:1,haze:.2},
    dusk:{top:0x020206,hor:0x201418,bot:0x050408,sun:0xffb080,sunEl:.05,sunAz:1.3,sunI:1.8,skyL:0x6a5060,gndL:0x0e0a10,hemiI:.45,fog:0x0e0a10,fogD:.000015,night:.75,exp:1.05,stars:1,haze:.9},
    night:{top:0x010103,hor:0x080610,bot:0x030304,sun:0xd8b890,sunEl:.5,sunAz:-.4,sunI:.5,skyL:0x4a3a40,gndL:0x080608,hemiI:.3,fog:0x08060a,fogD:.000015,night:1,exp:1.15,stars:1}},
  landmarks:[
   {id:"ring",name:"The Dock Ring",pos:[0,300,0],desc:"The shipyards wrap the moon’s equator: assembly lines, gantries and berths without end. In Morning Star, on Darrow’s order, the captured Colossus bombards the ring, and wreckage falls on New Troy below.",cam:{target:[0,0,0],r:6000,theta:.4,phi:1.05}},
   {id:"berth",name:"Colossus Berth",pos:[-1800,600,0],desc:"The great slip where Colossus, flagship of the Sword Armada, was built.",cam:{target:[-1800,200,0],r:2600,theta:.3,phi:1.05}},
   {id:"platform",name:"Defense Platform",pos:[2300,500,-900],desc:"In Golden Son, House Augustus’s lurcher squads knock out three reactors on this platform, but Pliny has betrayed the raid and Nero and the Jackal are captured.",cam:{target:[2300,200,-900],r:2000,theta:.8,phi:1.05}},
   {id:"newtroy",name:"New Troy",pos:[600,-2500,2200],desc:"The city on Ganymede’s surface beneath the ring. When the docks are destroyed, the falling ring kills millions here.",cam:{target:[600,-2600,2000],r:4200,theta:.3,phi:.95}}],
  build(ctx){const R=ctx.R,root=ctx.root;root.add(makeTerrain({size:30000,seg:220,height:ground,color}));
    const B=new GeoBuilder(),Bm=new GeoBuilder();
    /* the ring: a long truss with decks */
    Bm.add(G.box(16000,140,900),TM(0,-140,0),0x6e6a66,1);Bm.add(G.box(16000,60,1200),TM(0,-260,0),0x5a5654,1);
    for(let x=-8000;x<8000;x+=380){Bm.add(G.box(40,420,40),TM(x,-260,-560),0x4a4644);Bm.add(G.box(40,420,40),TM(x,-260,560),0x4a4644);Bm.add(G.box(380,30,30),TM(x+190,140,-560),0x5a5654);Bm.add(G.box(380,30,30),TM(x+190,140,560),0x5a5654);}
    for(let i=0;i<260;i++){const x=(R()-.5)*15600,z=(R()-.5)*800;Bm.add(G.box(60+R()*160,30+R()*140,60+R()*120),TM(x,0,z,0),[0x7a7672,0x8a8580,0x5e5a58][(R()*3)|0],1);}
    /* ships under construction in berths */
    const berthXs=[-1800,-4400,1200,4200,6400,-6800];
    berthXs.forEach((x,i)=>{const big=i===0;const s=makeShip(big?"dread":"torch",big?900:420+R()*200);s.position.set(x,big?520:380,0);root.add(s);
      for(let k=0;k<6;k++)Bm.add(G.box(30,big?900:600,30),TM(x-500+k*200,0,big?-420:-320),0x3a3634);});
    /* defense platform with reactors */
    const P={x:2300,y:240,z:-900};Bm.add(G.cyl(420,460,60,8),TM(P.x,P.y,P.z),0x4a4644,1);
    const reactors=[];for(let k=0;k<3;k++){const a=k/3*TAU;const x=P.x+Math.cos(a)*230,z=P.z+Math.sin(a)*230;Bm.add(G.cyl(60,70,120,16),TM(x,P.y+60,z),0x6a6662,1);const g=glowSprite(GLOW_BLUE,260,.8);g.position.set(x,P.y+220,z);root.add(g);reactors.push(g);}
    /* New Troy on the surface */
    for(let i=0;i<1800;i++){const a=R()*TAU,r=Math.sqrt(R())*2600;const x=600+Math.cos(a)*r,z=2200+Math.sin(a)*r;const y=ground(x,z);B.add(G.box(30+R()*40,20+Math.pow(R(),2)*300,30+R()*40),TM(x,y,z,R()),[0x9a8aa0,0x8a7a8c,0xb0a0b4][(R()*3)|0],1);}
    root.add(B.mesh(mats().bld));root.add(Bm.mesh(mats().metal));
    const sparks=[];for(let i=0;i<70;i++){const s=glowSprite(GLOW_WHITE,30+R()*40,0);s.position.set((R()-.5)*15000,R()*400,(R()-.5)*800);root.add(s);sparks.push({s,ph:R()*10});}
    const tugs=[];for(let i=0;i<40;i++){const s=glowSprite(R()<.5?GLOW_WARM:GLOW_BLUE,50,.9);root.add(s);tugs.push({s,x:(R()-.5)*15000,y:300+R()*1400,z:(R()-.5)*3000,sp:(R()<.5?-1:1)*(80+R()*200)});}
    SITES.ganymede._reactors=reactors;
    return {update(dt,t){sparks.forEach(o=>{o.s.material.opacity=Math.max(0,Math.sin(t*3+o.ph))*.9;});tugs.forEach(o=>{o.x+=o.sp*dt;if(o.x>8000)o.x=-8000;if(o.x<-8000)o.x=8000;o.s.position.set(o.x,o.y,o.z);});}};}};}

/* ---------- IO: Nesos ---------- */
{const N=makeNoise(1010);
const ground=(x,z)=>{let h=Math.abs(Math.sin(x*.004+N.f(x*.001,0,z*.001,3)*6))*40*sst(900,1600,Math.hypot(x,z));h+=(N.f(x*.0007,1,z*.0007,4)-.5)*120;
  [[2600,-1800,900],[-3000,-1200,700],[1800,2400,600]].forEach(v=>{const d=Math.hypot(x-v[0],z-v[1]);h+=v[2]*Math.max(0,1-d/1400)*sst(80,260,d);if(d<220)h-=sst(220,80,d)*180;});
  return h;};
const color=(x,z,h,sl)=>{let c=mixc([214,186,72],[236,214,120],N.f(x*.002,2,z*.002,4));if(sl>.35)c=mixc(c,[150,96,46],(sl-.35)*1.4);if(N.f(x*.003,5,z*.003,3)>.68)c=mixc(c,[196,120,52],.6);if(Math.hypot(x,z)<1100)c=mixc(c,[90,120,70],.5);return c;};
SITES.io={name:"Nesos",body:"io",poi:"raaseat",epithet:"Io · seat of House Raa",seed:111,
  blurb:"The capital of Io under its pulse shields, ringed by sulfur dunes, cliffs, some four hundred volcanoes and lakes of magma. On the side facing Jupiter the ground reaches 120°C, and the giant planet fills the sky.",
  facts:[["House","Raa, Moon Lords of the Rim"],["Ruler","Romulus au Raa"],["Cities","Nesos, Plutus, Sungrave"]],note:"Layout is an artistic reconstruction from the books’ descriptions.",
  ground,bounds:4000,minR:150,maxR:10000,shadow:3000,win:[2.4,2],cam:{target:[0,100,0],r:5600,theta:.35,phi:1.12},defaultTod:"day",
  skyBody:{id:"jupiter",dir:[.15,.3,-.94],size:3300},
  tods:{day:{top:0x0a0a18,hor:0x6a5a4a,bot:0x2a2018,sun:0xfff6e0,sunEl:.55,sunAz:.9,sunI:2.8,skyL:0xc0a080,gndL:0x4a3818,hemiI:.65,fog:0x5a4a38,fogD:.00004,night:.15,exp:.95,stars:.6,haze:.3},
    dusk:{top:0x06060e,hor:0x8a4a2a,bot:0x2a1810,sun:0xffa060,sunEl:.04,sunAz:1.2,sunI:2,skyL:0x8a5a40,gndL:0x2a1a10,hemiI:.5,fog:0x4a2a1a,fogD:.00004,night:.6,exp:1,stars:.8,haze:1},
    night:{top:0x020206,hor:0x1a120c,bot:0x060404,sun:0xd8a870,sunEl:.5,sunAz:-.3,sunI:.6,skyL:0x5a3a2a,gndL:0x0a0606,hemiI:.3,fog:0x140c08,fogD:.00004,night:1,exp:1.15,stars:1}},
  landmarks:[
   {id:"nesos",name:"Nesos",pos:[0,500,0],desc:"Io’s capital and the seat of House Raa, sheltered from the moon’s heat and poison by pulse shields.",cam:{target:[0,100,0],r:2400,theta:.4,phi:1.1}},
   {id:"court",name:"Raa’s Hall",pos:[0,700,-120],desc:"Where Romulus au Raa, ArchGovernor of Io and leader of the Moon Lords, holds court. Darrow wins him over here, and the Rim joins the fight against Roque’s armada.",cam:{target:[0,300,-120],r:1200,theta:.6,phi:1.05}},
   {id:"dunes",name:"The Sulfur Dunes",pos:[1900,120,900],desc:"Sulfur dunes, cliffs and ridges cover Io’s Jupiter-facing side, where the ground reaches 120°C.",cam:{target:[1900,60,900],r:1500,theta:.9,phi:1.05}},
   {id:"volcano",name:"The Volcanoes",pos:[2600,1000,-1800],desc:"Io has some four hundred volcanoes and lakes of magma beyond the pulse shields.",cam:{target:[2600,500,-1800],r:2400,theta:.6,phi:1.1}}],
  build(ctx){const R=ctx.R,root=ctx.root;root.add(makeTerrain({size:11000,seg:280,height:ground,color}));
    const B=new GeoBuilder(),Bg=new GeoBuilder();
    for(let i=0;i<900;i++){const a=R()*TAU,r=Math.pow(R(),.8)*950;const x=Math.cos(a)*r,z=Math.sin(a)*r;const y=ground(x,z);const h=30+Math.pow(R(),2.5)*420*(1-r/1100);
      if(R()<.6)ARCH.tiered(B,x,y,z,30+R()*30,30+R()*30,h,[0xf0e6d4,0xe0d4c0,0xd8c8b0][(R()*3)|0],R,0xd9b060);else ARCH.spire(Bg,x,y,z,10+R()*8,h*1.4,0xc8d0d8,0xd9b060);}
    {const y=ground(0,-120);B.add(G.box(260,90,160),TM(0,y,-120),0xf2ece0,1);B.add(G.dome(110,24),TM(0,y+90,-120),0xd9b060);ARCH.colonnade(B,0,y,-20,260,70,12,0xf6f1e8,0);}
    root.add(B.mesh(mats().bld));root.add(Bg.mesh(mats().glass));
    const shieldMat=new THREE.MeshPhongMaterial({color:col(0x9fd0ff),transparent:true,opacity:.12,shininess:120,emissive:col(0x2a4a7a),emissiveIntensity:.5,side:THREE.DoubleSide,depthWrite:false});
    const shield=new THREE.Mesh(new THREE.SphereGeometry(1150,48,24,0,TAU,0,Math.PI/2),shieldMat);root.add(shield);
    const lava=[];[[2600,-1800],[-3000,-1200],[1800,2400]].forEach(v=>{const y=ground(v[0],v[1]);const m=new THREE.Mesh(new THREE.CircleGeometry(170,24).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:col(0xff6a20)}));m.position.set(v[0],y+40,v[1]);root.add(m);
      const g=glowSprite(GLOW_RED,900,.8);g.position.set(v[0],y+260,v[1]);root.add(g);lava.push(g);const plume=glowSprite(GLOW_WARM,600,.25);plume.position.set(v[0],y+900,v[1]);root.add(plume);lava.push(plume);});
    return {update(dt,t){shieldMat.opacity=.1+.04*Math.sin(t*1.3);lava.forEach((g,i)=>{g.material.opacity=(i%2?.25:.7)+.15*Math.sin(t*2+i);});}};}};}

/* ---------- EUROPA: Lorn's castle ---------- */
{const N=makeNoise(1111);
const ISL=[[0,0,1100],[-2600,-900,600],[2400,-1500,500],[1800,1900,700],[-1800,2100,450]];
const ground=(x,z)=>{let h=-140;ISL.forEach(p=>{const d=Math.hypot(x-p[0],z-p[1])/p[2];h=Math.max(h,(1-d)*260+(N.f(x*.003,1,z*.003,4)-.5)*90);});return h;};
const color=(x,z,h,sl)=>{let c=mixc([60,88,52],[86,110,64],N.f(x*.003,2,z*.003,3));if(h<14)c=[196,190,170];if(sl>.5)c=mixc(c,[170,168,160],(sl-.5)*1.6);return c;};
SITES.europa={name:"Lorn’s Castle",body:"europa",poi:"lornhome",epithet:"Europa · House Arcos",seed:121,
  blurb:"A white limestone castle on a far-northern island of Europa’s ninety-kilometer-deep ocean, its walls ringing a private forest, with gulls on the shore and Jupiter filling the sky. Lorn au Arcos withdrew here from war.",
  facts:[["Lord","Lorn au Arcos, the Stoneside"],["Sea","The Discordia, with waves near ten meters"],["Weather","Blue lightning near the poles"]],note:"Layout is an artistic reconstruction from the books’ descriptions.",
  ground,bounds:3600,minR:120,maxR:9000,shadow:2200,win:[2,1.6],cam:{target:[0,120,0],r:4200,theta:.4,phi:1.08},defaultTod:"day",
  skyBody:{id:"jupiter",dir:[.5,.28,-.82],size:2300},
  tods:{day:{top:0x4a6a96,hor:0xc8d4de,bot:0x6a7a88,sun:0xfff4e4,sunEl:.6,sunAz:.9,sunI:2.6,skyL:0xbcd0e8,gndL:0x3a4a40,hemiI:.85,fog:0xb0c0cc,fogD:.00006,night:0,exp:.95,haze:.4},
    dusk:{top:0x1a2444,hor:0xd08a6a,bot:0x3a3a48,sun:0xffb080,sunEl:.05,sunAz:1.2,sunI:2,skyL:0x8a8aa8,gndL:0x2a2a30,hemiI:.6,fog:0x8a7a88,fogD:.00006,night:.6,exp:1,haze:1},
    night:{top:0x030612,hor:0x101828,bot:0x05070c,sun:0xd8c0a0,sunEl:.45,sunAz:-.3,sunI:.5,skyL:0x3a4460,gndL:0x0a0c10,hemiI:.3,fog:0x0c1220,fogD:.00006,night:1,exp:1.15,stars:1}},
  landmarks:[
   {id:"villa",name:"Lorn’s Castle",pos:[0,420,0],desc:"White limestone walls and towers on the island’s height. Darrow comes to recruit his old teacher; after Tactus takes Lorn’s grandchildren hostage and surrenders, Lorn executes him.",cam:{target:[0,240,0],r:1300,theta:.5,phi:1.05}},
   {id:"garden",name:"The Walled Forest",pos:[-380,300,280],desc:"Lorn’s private forest within the castle walls, where Darrow survives Aja’s ambush.",cam:{target:[-380,200,280],r:900,theta:-.2,phi:1.05}},
   {id:"shore",name:"The Shore",pos:[700,60,700],desc:"Gulls wheel over the coves where landing craft come ashore.",cam:{target:[700,20,700],r:900,theta:.9,phi:1.0}},
   {id:"sea",name:"Discordia Sea",pos:[0,20,-2600],desc:"Europa’s ocean, about ninety kilometers deep, where waves run near ten meters tall in the low gravity.",cam:{target:[0,0,-2000],r:4000,theta:.2,phi:1.1}}],
  build(ctx){const R=ctx.R,root=ctx.root;root.add(makeTerrain({size:10000,seg:260,height:ground,color}));
    const sea=new THREE.Mesh(new THREE.PlaneGeometry(30000,30000,120,120).rotateX(-Math.PI/2),mats().water.clone());sea.material.color.copy(col(0x1a3a50));root.add(sea);
    const B=new GeoBuilder();const y=ground(0,0);const LIME=0xece6d6;
    ARCH.castle(B,60,y,-80,330,LIME,"cone",7);
    const W=620;for(let i=0;i<16;i++){const a0=i/16*TAU,a1=(i+1)/16*TAU;const x0=Math.cos(a0)*W,z0=Math.sin(a0)*W,x1=Math.cos(a1)*W,z1=Math.sin(a1)*W;ARCH.wall(B,x0,z0,x1,z1,Math.min(ground(x0,z0),ground(x1,z1))-8,40,10,LIME);if(i%2===0)ARCH.tower(B,x0,ground(x0,z0)-8,z0,18,70,LIME,"cone",1);}
    root.add(B.mesh(mats().bld));
    const trees=scatter(1600,6000,R,(x,z)=>{const h=ground(x,z);if(h<20)return null;const inside=Math.hypot(x,z)<W-30&&Math.hypot(x-60,z+80)>260;if(!inside&&R()<.6)return null;return {x,y:h,z,s:inside?9+R()*6:6+R()*5,c:[0x2f5a2a,0x3a6630,0x44702f][(R()*3)|0]};});
    root.add(makeForest(trees,"broad",21));
    const gulls=[];for(let i=0;i<30;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(6,.5,1.5),new THREE.MeshBasicMaterial({color:col(0xf4f4f4)}));root.add(m);gulls.push({m,a:R()*TAU,r:500+R()*600,y:80+R()*120,sp:.2+R()*.3});}
    const bolts=[];for(let i=0;i<3;i++){const s=glowSprite(GLOW_BLUE,1600,0);s.position.set((R()-.5)*8000,1500,-6000-R()*3000);root.add(s);bolts.push(s);}
    const sp=sea.geometry.attributes.position;const base=Float32Array.from(sp.array);
    return {update(dt,t){for(let i=0;i<sp.count;i++){const x=base[i*3],z=base[i*3+2];sp.setY(i,Math.sin(x*.004+t*.6)*9+Math.cos(z*.005+t*.45)*7);}sp.needsUpdate=true;sea.geometry.computeVertexNormals();
      gulls.forEach(g=>{g.a+=dt*g.sp;g.m.position.set(700+Math.cos(g.a)*g.r,g.y+Math.sin(g.a*3)*10,700+Math.sin(g.a)*g.r*.6);g.m.rotation.y=-g.a;g.m.scale.z=1+Math.sin(t*12+g.a*9)*.6;});
      bolts.forEach((b,i)=>{b.material.opacity=Math.random()<.008?.9:b.material.opacity*.85;});}};}};}
})();

/* ---- 46-site-helios.js ---- */
/* ===================== HELIOS, MERCURY ===================== */
/* The continent as drawn on the Solar War maps. Scene coordinates follow the map: north is -z. */
const HELIOS={W:7440,H:12000,HS:560,SD:340,data:null,w:620,h:1000};
/* The original painted height and colour maps (tex/helios_*.png|jpg) were never shipped with the page, so Helios is
   generated: a continent shaped from the map's named features (seas, the Hesperides, the Ladon) with every city on land. */
function heliosProcRaw(N,fx,fy){
  const g=(dx,dy,r)=>Math.exp(-(dx*dx+dy*dy)/(r*r));
  let h=.6+(N.f(fx*5,1,fy*8,4)-.5)*.16;
  /* Hesperides: a ridge down the west between Tyche and Heliopolis */
  const ridge=Math.exp(-Math.pow((fx-.18-(N.f(3,fy*6,1,2)-.5)*.06)/.07,2))*sst(.22,.34,fy)*(1-sst(.78,.88,fy));
  h+=ridge*(.28+.18*(1-Math.abs(N.f(fx*14,fy*14,5,3)*2-1)));
  h+=g(fx-.52,fy-.8,.05)*.16+g(fx-.642,fy-.62,.04)*.1+g(fx-.388,fy-.37,.05)*.05;
  /* the Ladon: a flat chalk waste along the equator */
  const lad=g((fx-.6)/1.9,fy-.52,.09);h=h*(1-lad*.6)+.6*lad*.6;
  /* seas: Sycorax along the north coast, Trasmian to the west of Tyche, the Bay of Sirens, the Caliban Sea to the south */
  const coast=.05+(N.f(fx*9,7,2,3)-.5)*.05+(fx>.7?.03:0);
  h-=.45*(1-sst(coast-.02,coast+.02,fy));
  h-=.4*g(fx-.27,fy-.17,.07)+.42*g(fx-.25,fy-.9,.075)+.4*(sst(.95,1,fy))+.35*(1-sst(0,.035,fx))*(fy>.3?1:0);
  return h;}
function heliosLoad(){if(HELIOS._p)return HELIOS._p;HELIOS._p=new Promise(res=>{
  HELIOS.w=310;HELIOS.h=500;const W=HELIOS.w,H=HELIOS.h,N=makeNoise(4242);const a=new Float32Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)a[y*W+x]=heliosProcRaw(N,x/(W-1),y/(H-1));
  /* keep every named city and town on dry land */
  HCITY.forEach(c=>{const cx=c.f[0]*(W-1),cy=c.f[1]*(H-1),r=9;for(let y=Math.max(0,Math.floor(cy-r*2));y<Math.min(H,cy+r*2);y++)for(let x=Math.max(0,Math.floor(cx-r*2));x<Math.min(W,cx+r*2);x++){
    const k=Math.exp(-((x-cx)*(x-cx)+(y-cy)*(y-cy))/(r*r));const i=y*W+x;a[i]=Math.max(a[i],a[i]*(1-k)+.57*k);}});
  for(let i=0;i<a.length;i++)a[i]=Math.max(0,Math.min(1,a[i]));
  HELIOS.data=a;res();});return HELIOS._p;}
/* ground colour for the generated map: lowland green, the chalk Ladon, bare rock and snow on the Hesperides */
function heliosColor(x,z,y){const fx=x/HELIOS.W+.5,fy=z/HELIOS.H+.5;const n=HN.f(x*.0012,5,z*.0012,4);
  if(y<0)return mixc([58,78,64],[150,140,110],sst(-60,0,y));
  const des=Math.exp(-Math.pow((fx-.6)/1.9/.11,2)-Math.pow((fy-.52)/.11,2));
  let c=mixc(mixc([78,104,58],[132,128,84],n),[234,226,204],cl(des*1.4-.15));
  c=mixc(c,[118,108,98],sst(110,260,y));c=mixc(c,[236,238,242],sst(330,430,y+n*60));return c;}
const HN=makeNoise(1212);
function heliosRaw(x,z){const D=HELIOS.data;if(!D)return .6;const u=(x/HELIOS.W+.5)*(HELIOS.w-1),v=(z/HELIOS.H+.5)*(HELIOS.h-1);
  const x0=Math.max(0,Math.min(HELIOS.w-2,Math.floor(u))),y0=Math.max(0,Math.min(HELIOS.h-2,Math.floor(v)));const fx=Math.min(1,Math.max(0,u-x0)),fy=Math.min(1,Math.max(0,v-y0));
  const W=HELIOS.w;const a=D[y0*W+x0],b=D[y0*W+x0+1],c=D[(y0+1)*W+x0],d=D[(y0+1)*W+x0+1];return (a*(1-fx)+b*fx)*(1-fy)+(c*(1-fx)+d*fx)*fy;}
function heliosGround(x,z){const hw=HELIOS.W/2,hh=HELIOS.H/2;const cx=Math.max(-hw,Math.min(hw,x)),cz=Math.max(-hh,Math.min(hh,z));
  const out=Math.hypot(x-cx,z-cz);let h=heliosRaw(cx*.999,cz*.999)*2-1;
  if(out>0){const n=HN.f(x*.0006,7,z*.0006,4);h=h*(1-sst(0,3000+n*2500,out))+(-.6)*sst(0,3000+n*2500,out)+(n-.5)*.25*(1-sst(0,4000,out));}
  const det=(HN.f(x*.003,0,z*.003,3)-.5)*(h>0?18:4);
  return (h>0?Math.pow(h,1.35)*HELIOS.HS:h*HELIOS.SD)+det*Math.min(1,Math.abs(h)*5);}
const HF=(fx,fy)=>[(fx-.5)*HELIOS.W,(fy-.5)*HELIOS.H];
/* cities and features, placed from the map */
const HCITY=[
 {id:"heliopolis",name:"Heliopolis",f:[.346,.765],kind:"capital",r:230,enter:"heliopolis",desc:"Mercury’s second great city, south of the Hesperides and east of the Bay of Sirens: the Hippodrome, the Water Plaza, the Graveyard of Tyrants. Besieged and taken in Dark Age."},
 {id:"tyche",name:"Tyche",f:[.376,.307],kind:"capital",r:210,enter:"tyche",desc:"Mercury’s capital, on a strip of lowland between the Hesperides and the Sycorax Sea, spilling onto bridged islands. Darrow’s headquarters; drowned by storm surges in Dark Age."},
 {id:"redreach",name:"Red Reach",f:[.662,.372],kind:"base",r:110,desc:"A Republic base east of Tyche with its own power supply. In Dark Age an atomic strike destroys it, along with most of the Second Army."},
 {id:"bluereach",name:"Blue Reach",f:[.473,.24],kind:"base",r:70,desc:"A coastal installation east of Tyche, as marked on the map."},
 {id:"pan",name:"Pan",f:[.553,.188],kind:"city",r:110,desc:"One of the Children, the cities of the Petasos Peninsula. A Republic base stands near it; Darrow’s planned killbox lay to its south."},
 {id:"kaikos",name:"Kaikos",f:[.751,.098],kind:"city",r:100,desc:"A city of the Petasos Peninsula on the Sycorax coast, one of the Children."},
 {id:"priapos",name:"Priapos",f:[.953,.115],kind:"city",r:100,desc:"A city of the Petasos Peninsula, one of the Children."},
 {id:"kydon",name:"Kydon",f:[.97,.272],kind:"city",r:120,desc:"A city of the Children with a Republic base nearby. Thraxa is sent here to rally the Third Army."},
 {id:"angelia",name:"Angelia",f:[.804,.52],kind:"town",r:80,desc:"A small city north of Eleusis. The Fear Knight booby-traps it and its reactor melts down; the shields of the north fail after."},
 {id:"eleusis",name:"Eleusis",f:[.836,.65],kind:"town",r:90,desc:"A mining city on the eastern edge of the Ladon, the planned site of Darrow’s trap."},
 {id:"erebos",name:"Erebos",f:[.353,.58],kind:"town",r:70,desc:"A town in the Hesperides foothills, where the Gorgons capture Lysander after the Ladon."},
 {id:"naran",name:"Naran",f:[.398,.555],kind:"town",r:55,desc:"A settlement at the western edge of the Waste, near Erebos."},
 {id:"southtown",name:"Field of Phaethon",f:[.346,.70],kind:"town",r:60,desc:"A settlement on the road between Erebos and Heliopolis, near the Field of Phaethon as labeled on the map."}
];
const HFEAT=[
 {id:"ladon",name:"Waste of Ladon",f:[.513,.52],r:2400,desc:"The chalk desert along Helios’s equator: the Waste, the Eater of Armies. In Dark Age the Storm Gods raise a sandstorm across it that swallows the Society’s landing.",cam:5200},
 {id:"stormgod",name:"Downed Storm God",f:[.47,.49],r:200,desc:"At a Storm God brought down in the Ladon, Darrow maims Kalindora and burns half of Lysander’s face.",cam:1100},
 {id:"caduceus",name:"Plains of Caduceus",f:[.73,.315],r:1300,desc:"Grasslands between the north coast and the Ladon. Orion’s storms trap the Society’s landing waves here.",cam:3000},
 {id:"hesperides",name:"Hesperides Mountains",f:[.18,.55],r:2000,desc:"The great range running north to south along Helios’s west, between Tyche and Heliopolis. The GravLoop runs beneath it; railguns in its northern peaks guard Tyche.",cam:4200},
 {id:"kylor",name:"Kylor Pass",f:[.388,.37],r:300,desc:"A pass through the mountains south of Tyche, the road toward Heliopolis.",cam:1600},
 {id:"aigle",name:"Aigle Mountains",f:[.52,.8],r:900,desc:"A range southeast of Heliopolis.",cam:2600},
 {id:"buonides",name:"Buonides Range",f:[.642,.62],r:700,desc:"Hills crossing the southern Ladon, as named on the map.",cam:2200},
 {id:"solanaan",name:"Valley of Solanaan",f:[.662,.68],r:600,desc:"A great round valley south of the Buonides Range, as named on the map.",cam:2000},
 {id:"votum",name:"Mound of Votum",f:[.29,.8],r:120,desc:"House Votum’s basilica on the Bay of Sirens, west of Heliopolis, crowned by a statue of Helios about half a kilometer tall. Darrow’s last stand before Cassius carries him out.",cam:900},
 {id:"sirens",name:"Bay of Sirens",f:[.25,.9],r:900,desc:"The bay below Heliopolis, gateway to the Caliban Sea. Glirastes’ floating home, the Lady Beatrice, hangs above the city.",cam:2600},
 {id:"sycorax",name:"Sycorax Sea",f:[.5,.06],r:2000,desc:"The northern sea on which Tyche stands. One Storm God was raised from a glacier near it.",cam:4600},
 {id:"trasmian",name:"Trasmian Sea",f:[.27,.17],r:900,desc:"The sea west of Tyche; its winds reach the capital.",cam:2600},
 {id:"ismere",name:"Ismere Islands",f:[.43,.1],r:500,desc:"Islands off the north coast.",cam:2000},
 {id:"talarian",name:"Talarian Peninsula",f:[.07,.26],r:700,desc:"The peninsula northwest of Tyche, joined to it by the coastal lowlands.",cam:2600},
 {id:"petasos",name:"Petasos Peninsula",f:[.85,.15],r:900,desc:"Home of the Children Cities on the northeast coast.",cam:3000}
];
(function(){
const lm=[];
HCITY.forEach(c=>{const [x,z]=HF(c.f[0],c.f[1]);lm.push({id:c.id,name:c.name,minor:c.kind==="town",pos:[x,0,z],desc:c.desc,enter:c.enter,cam:{target:[x,0,z],r:c.kind==="capital"?1500:c.kind==="base"?900:800,theta:.3,phi:.95}});});
HFEAT.forEach(c=>{const [x,z]=HF(c.f[0],c.f[1]);lm.push({id:c.id,name:c.name,minor:c.cam<2000,region:true,pos:[x,0,z],desc:c.desc,cam:{target:[x,0,z],r:c.cam,theta:.2,phi:.98}});});
const fixY=()=>lm.forEach(l=>{const y=Math.max(0,heliosGround(l.pos[0],l.pos[2]));l.pos[1]=y+(l.region?120:90);l.cam.target[1]=y;});
const MERC_T={
  day:{top:0x2f5d9c,hor:0xf4e6cc,bot:0xcab890,sun:0xffffff,sunEl:.9,sunAz:-.5,sunI:3.6,skyL:0xcfe0ff,gndL:0x9a8060,hemiI:1,fog:0xf0e4d0,fogD:.000028,night:0,exp:.85,haze:.6,sunSize:.9972},
  dusk:{top:0x1c2550,hor:0xff8a40,bot:0x6a4030,sun:0xffa060,sunEl:.05,sunAz:-.5,sunI:2.6,skyL:0x8a7aa8,gndL:0x5a3a2a,hemiI:.6,fog:0xd08058,fogD:.00003,night:.6,exp:1.05,haze:1,sunSize:.9972},
  night:{top:0x03050c,hor:0x161a26,bot:0x0a0a0e,sun:0x8aa0d8,sunEl:.5,sunAz:2.2,sunI:.22,skyL:0x2a3048,gndL:0x0c0a0c,hemiI:.2,fog:0x101218,fogD:.000026,night:1,exp:1.15,stars:1}};
SITES.helios={name:"The Continent of Helios",body:"mercury",poi:"ladon",pois:["heliopolis","tyche","redreach","caduceus","angelia","erebos","eleusis","children","ladon","caliban"],epithet:"Mercury · as charted in the Solar War",seed:121,
  blurb:"Mercury’s great continent, laid out from the in-book maps: alpine green along the Sycorax coast, the chalk Waste of Ladon across the equator, the Hesperides walling the west, and Heliopolis on the Bay of Sirens.",
  eras:{4:{blurb:"Iron Gold. Darrow’s Republic has torn Helios from the Society. Shields guard the northern cities, linked into a chain by their reactors."},
        5:{blurb:"Dark Age. The Society Remnant falls on Helios. Toggle the Storm Gods to see Operation Tartarus: hypercanes, the Ladon sandstorm, and the surge that drowns Tyche."},
        6:{blurb:"Light Bringer. Helios belongs to the Society, and Lysander is its hero."}},
  facts:[["Continent","Helios, with Borealis named elsewhere"],["Seas","Sycorax north, Caliban west"],["Heart","The Waste of Ladon"],["Capital","Tyche"]],
  note:"Terrain is built from the Solar War map of Helios. Desert, coast and mountain placement follow it closely; city layouts and scale are this atlas’s reconstruction.",
  ground:heliosGround,targetLift:0,bounds:7000,minR:300,maxR:26000,shadow:9000,win:[4,3.2],winK:1.1,cam:{target:[0,0,600],r:15500,theta:0,phi:.85},defaultTod:"day",
  preload:heliosLoad,toggles:[{id:"storms",label:"Storm Gods",era:5},{id:"war",label:"⚔ War Mode"}],
  tods:MERC_T,landmarks:lm,
  build(ctx){fixY();const R=ctx.R,root=ctx.root;
    /* terrain with the painted map as its ground */
    const seg=[248,400];const g=new THREE.PlaneGeometry(HELIOS.W*1.002,HELIOS.H*1.002,seg[0],seg[1]);g.rotateX(-Math.PI/2);
    const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,heliosGround(p.getX(i),p.getZ(i)));g.computeVertexNormals();
    {const tc=new Float32Array(p.count*3),cc=new THREE.Color();for(let i=0;i<p.count;i++){const rgb=heliosColor(p.getX(i),p.getZ(i),p.getY(i));
      cc.setRGB(rgb[0]/255,rgb[1]/255,rgb[2]/255).convertSRGBToLinear();tc[i*3]=cc.r;tc[i*3+1]=cc.g;tc[i*3+2]=cc.b;}g.setAttribute("color",new THREE.BufferAttribute(tc,3));}
    const tmat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95,metalness:0});const terr=new THREE.Mesh(g,tmat);terr.receiveShadow=true;terr.castShadow=true;root.add(terr);
    /* land and sea beyond the edges of the map */
    {const sg=new THREE.PlaneGeometry(HELIOS.W*3.2,HELIOS.H*2.2,120,110);sg.rotateX(-Math.PI/2);const sp=sg.attributes.position;const cols=new Float32Array(sp.count*3);const c=new THREE.Color();
      for(let i=0;i<sp.count;i++){const x=sp.getX(i),z=sp.getZ(i);const inside=Math.abs(x)<HELIOS.W/2-20&&Math.abs(z)<HELIOS.H/2-20;const y=inside?-HELIOS.SD:heliosGround(x,z);sp.setY(i,y-2);
        const n=HN.f(x*.001,3,z*.001,3);const des=1-sst(1500,3200,Math.abs(z-(.52-.5)*HELIOS.H));
        let rgb=y<0?[30,90,110]:mixc(mixc([150,140,100],[86,108,62],n),[232,224,202],des*.8);c.setRGB(rgb[0]/255,rgb[1]/255,rgb[2]/255).convertSRGBToLinear();cols.set([c.r,c.g,c.b],i*3);}
      sg.computeVertexNormals();sg.setAttribute("color",new THREE.BufferAttribute(cols,3));const sk=new THREE.Mesh(sg,mats().terrain);sk.receiveShadow=true;root.add(sk);}
    /* surrounding sea, and sea level that can rise */
    const wmat=new THREE.MeshPhongMaterial({color:col(0x2c7a90),specular:col(0xbcd8e0),shininess:110,transparent:true,opacity:.55,depthWrite:false});
    const water=new THREE.Mesh(new THREE.PlaneGeometry(120000,120000).rotateX(-Math.PI/2),wmat);water.position.y=-3;water.renderOrder=1;root.add(water);
    const ocean=new THREE.Mesh(new THREE.PlaneGeometry(120000,120000).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:col(0x0f3a58),roughness:.4}));ocean.position.y=-HELIOS.SD*.6-2;root.add(ocean);
    /* cities */
    const B=new GeoBuilder(),Bg=new GeoBuilder(),Bm=new GeoBuilder();
    const WHITE=[0xf2ece2,0xe6ddcc,0xdcd2c0],GLASS=[0x9fb6c8,0x8aa6bc,0xb8c8d4];
    HCITY.forEach((c,ci)=>{const [cx,cz]=HF(c.f[0],c.f[1]);const rr=rng(ci*17+3);
      if(c.kind==="base"){const y=Math.max(0,heliosGround(cx,cz));const s=c.r;
        for(let k=0;k<6;k++){const a=k/6*TAU;ARCH.wall(Bm,cx+Math.cos(a)*s,cz+Math.sin(a)*s,cx+Math.cos(a+TAU/6)*s,cz+Math.sin(a+TAU/6)*s,y-4,22,8,0x6a6660);}
        for(let k=0;k<5;k++)Bm.add(G.cyl(18,20,4,16),TM(cx+(rr()-.5)*s,y,cz+(rr()-.5)*s),0x4a4846,0,true);
        for(let k=0;k<14;k++)Bm.add(G.box(16+rr()*20,10+rr()*24,16+rr()*20),TM(cx+(rr()-.5)*s*1.3,y,cz+(rr()-.5)*s*1.3,rr()),0x7a7670,1);
        Bm.add(G.cyl(10,14,90,8),TM(cx,y,cz),0x8a8680,1);return;}
      const n=c.kind==="capital"?520:c.kind==="city"?160:60;const hmax=c.kind==="capital"?240:c.kind==="city"?110:50;
      for(let k=0;k<n;k++){const a=rr()*TAU,r=Math.pow(rr(),.7)*c.r;const x=cx+Math.cos(a)*r*1.1,z=cz+Math.sin(a)*r;const y=heliosGround(x,z);if(y<1)continue;
        const h=10+Math.pow(rr(),2.4)*hmax*(1-r/c.r*.7);const w=8+rr()*14;const glass=rr()<.35;
        if(h>60&&rr()<.5)ARCH.tiered(glass?Bg:B,x,y,z,w,w,h,glass?GLASS[(rr()*3)|0]:WHITE[(rr()*3)|0],rr,0xd9b060);
        else (glass?Bg:B).add(G.box(w,h,w*(.7+rr()*.6)),TM(x,y,z,rr()),glass?GLASS[(rr()*3)|0]:WHITE[(rr()*3)|0],1);}});
    /* the Mound of Votum and its colossus of Helios */
    {const [x,z]=HF(.29,.8);const y=Math.max(0,heliosGround(x,z));B.add(G.cyl(80,110,40,24),TM(x,y,z),0xe6ddcc,1);B.add(G.box(110,60,70),TM(x,y+40,z),0xf2ece2,1);B.add(G.dome(42,20),TM(x,y+100,z),0xd9b060);
      B.add(G.box(10,120,10),TM(x+60,y+40,z),0xd9b060);B.add(G.sphere(8,10),TM(x+60,y+166,z),0xd9b060);}
    root.add(B.mesh(mats().bld));root.add(Bg.mesh(mats().glass));root.add(Bm.mesh(mats().metal));
    /* green lowlands get trees */
    const trees=scatter(5000,HELIOS.W,R,(x,z)=>{z*=HELIOS.H/HELIOS.W;const y=heliosGround(x,z);if(y<4||y>420)return null;const n=HN.f(x*.002,4,z*.002,3);
      const north=z<-1800||(x<-2400&&z<1500);if(!north&&n<.66)return null;if(n<.45)return null;return {x,y,z,s:9+R()*8,c:[0x3f6a32,0x4f7a3a,0x36582c][(R()*3)|0]};});
    root.add(makeForest(trees,"pine",21));
    /* city shields: from the Republic’s conquest on */
    const shieldMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
      uniforms:{c:{value:col(0x7fc8ff)},k:{value:1},t:{value:0}},
      vertexShader:"varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}",
      fragmentShader:"uniform vec3 c;uniform float k;uniform float t;varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){float f=pow(1.-abs(dot(vN,vV)),2.2);float hex=step(.92,fract(vP.y*.05-t*.3));gl_FragColor=vec4(c*(f*.9+.06+hex*.15)*k,1.);}"});
    const shields=[];const chain=[];
    [["tyche",1.5],["heliopolis",1.6],["redreach",1.8],["pan",1.4],["kydon",1.4],["kaikos",1.3],["priapos",1.3],["angelia",1.6],["eleusis",1.5]].forEach(([id,k])=>{const c=HCITY.find(x=>x.id===id);const [x,z]=HF(c.f[0],c.f[1]);
      const m=new THREE.Mesh(new THREE.SphereGeometry(c.r*k,40,20,0,TAU,0,Math.PI/2),shieldMat.clone());m.position.set(x,Math.max(0,heliosGround(x,z))-10,z);m.userData.id=id;root.add(m);shields.push(m);});
    /* the Northern Shield Chain: power lines between the linked cities */
    const chainMat=new THREE.LineBasicMaterial({color:col(0x7fc8ff),transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false});
    [["pan","kaikos"],["kaikos","priapos"],["priapos","kydon"],["pan","angelia"],["angelia","eleusis"],["kydon","angelia"]].forEach(([a,b])=>{const A=HCITY.find(x=>x.id===a),Bc=HCITY.find(x=>x.id===b);const pa=HF(A.f[0],A.f[1]),pb=HF(Bc.f[0],Bc.f[1]);
      const pts=[];for(let k=0;k<=24;k++){const t=k/24;const x=pa[0]+(pb[0]-pa[0])*t,z=pa[1]+(pb[1]-pa[1])*t;pts.push(new THREE.Vector3(x,Math.max(0,heliosGround(x,z))+60+Math.sin(t*Math.PI)*120,z));}
      const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),chainMat);root.add(l);chain.push(l);});
    /* storms */
    const storm=new THREE.Group();storm.visible=false;root.add(storm);
    const spiral=spiralTexture();const vort=[];
    [[.5,.5,3200,.6],[.42,.26,2200,-.8],[.72,.34,1800,.9]].forEach((v,i)=>{const [x,z]=HF(v[0],v[1]);const m=new THREE.Mesh(new THREE.CircleGeometry(v[2],64).rotateX(-Math.PI/2),new THREE.MeshLambertMaterial({map:spiral,transparent:true,opacity:.85,depthWrite:false,color:col(0xcfcac2),fog:false}));
      m.position.set(x,1500+i*160,z);storm.add(m);vort.push({m,sp:v[3]*.12});
      const m2=m.clone();m2.material=m.material.clone();m2.material.opacity=.5;m2.scale.setScalar(.7);m2.position.y-=300;storm.add(m2);vort.push({m:m2,sp:v[3]*.2});
      /* the Storm God beneath the eye */
      const god=new THREE.Group();const D=new GeoBuilder();D.add(new THREE.CylinderGeometry(140,180,30,24),null,0x4a4c52,1);D.add(new THREE.CylinderGeometry(60,140,40,24).translate(0,-35,0),null,0x2e3036,1);
      for(let k=0;k<8;k++)D.add(new THREE.BoxGeometry(40,14,14).translate(170,0,0),TM(0,0,0,k/8*TAU),0x6a6c72);
      god.add(D.mesh(mats().metal));const gl=glowSprite(GLOW_BLUE,600,.7);gl.position.y=-60;god.add(gl);god.position.set(x,700,z);storm.add(god);vort.push({m:god,sp:.02,god:true});});
    const sand=new THREE.Group();storm.add(sand);const sandM=new THREE.SpriteMaterial({map:GLOW_WHITE,color:col(0xc8b088),transparent:true,opacity:.28,depthWrite:false,fog:false});
    for(let i=0;i<120;i++){const s=new THREE.Sprite(sandM.clone());const sc=600+R()*1400;s.scale.set(sc*1.8,sc*.6,1);const [x,z]=HF(.25+R()*.55,.38+R()*.3);s.position.set(x,80+R()*500,z);s.userData.v=60+R()*120;sand.add(s);}
    const bolts=[];for(let i=0;i<10;i++){const s=glowSprite(GLOW_BLUE,900,0);storm.add(s);bolts.push(s);}
    const flashL=new THREE.PointLight(col(0xbfdcff),0,9000,1.4);storm.add(flashL);
    let stormOn=false,stormK=0;
    function applyEra(){const e=ERA;shields.forEach(s=>s.visible=e>=4);chain.forEach(l=>l.visible=e>=4&&e<=5);}
    applyEra();
    SITES.helios.onEra=applyEra;
    SITES.helios.onToggle=(id,on)=>{if(id==="storms"){stormOn=on;if(on)storm.visible=true;}if(id==="war"){if(on)WAR.start();else WAR.stop();}};
    SITES.helios._shields=shields;SITES.helios._chain=chain;
    /* the war: artillery along the front, flights of ships */
    const F=Flashes(root);const flights=[];
    for(let i=0;i<26;i++){const sh=makeShip(i%5?"ripwing":"frigate",i%5?28:60);root.add(sh);const [x,z]=HF(.25+R()*.6,.25+R()*.6);flights.push({sh,cx:x,cz:z,r:600+R()*1800,a:R()*TAU,y:600+R()*900,sp:(R()<.5?-1:1)*(.05+R()*.08)});}
    SITES.helios._flights=flights;
    return {update(dt,t){shields.forEach(s=>{s.material.uniforms.t.value=t;});
      flights.forEach(f=>{f.a+=f.sp*dt;f.sh.position.set(f.cx+Math.cos(f.a)*f.r,f.y,f.cz+Math.sin(f.a)*f.r);f.sh.rotation.y=-f.a+(f.sp>0?-Math.PI/2:Math.PI/2);f.sh.visible=ERA>=4&&!WAR.active;});
      if(ERA===5&&!WAR.active&&Math.random()<dt*3){const [x,z]=HF(.36+Math.random()*.14,.6+Math.random()*.14);F.add(GLOW_WARM,new THREE.Vector3(x,Math.max(0,heliosGround(x,z))+40,z),260,.7);}
      F.update(dt);WAR.update(dt,t);
      stormK+=((stormOn?1:0)-stormK)*Math.min(1,dt*1.5);if(window.__atlasFast)stormK=stormOn?1:0;storm.visible=stormK>.01;
      vort.forEach(v=>{if(v.god){v.m.rotation.y+=dt*.3;v.m.position.y=700+Math.sin(t*.5)*30;}else{v.m.rotation.y+=v.sp*dt;v.m.material.opacity=(v.m.scale.x<1?.5:.85)*stormK;}});
      sand.children.forEach(s=>{s.position.x+=s.userData.v*dt*2;if(s.position.x>HELIOS.W*.45)s.position.x=-HELIOS.W*.4;s.material.opacity=.3*stormK;});
      bolts.forEach(b=>{b.material.opacity=Math.random()<.012*stormK?.95:b.material.opacity*.8;if(b.material.opacity>.9){const [x,z]=HF(.3+Math.random()*.5,.2+Math.random()*.5);b.position.set(x,900,z);flashL.position.copy(b.position);flashL.intensity=6;}});
      flashL.intensity*=.85;
      water.position.y=-3+stormK*22;
      site3.fog.density=(tod.to||tod.site.tods[tod.cur]).fogD*(1+stormK*1.1);
      sSun.intensity=(tod.to||tod.site.tods[tod.cur]).sunI*(1-stormK*.55);}};
  }};
})();
/* a spiral cloud texture for hypercanes */
let _spiral=null;
function spiralTexture(){if(_spiral)return _spiral;const S=512,cv=document.createElement("canvas");cv.width=cv.height=S;const g=cv.getContext("2d");const img=g.createImageData(S,S);const N=makeNoise(77);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const dx=(x-S/2)/(S/2),dy=(y-S/2)/(S/2);const r=Math.hypot(dx,dy);const a=Math.atan2(dy,dx);
    const arm=.5+.5*Math.sin(a*3+Math.log(r+.02)*7);const n=N.f(dx*4+Math.cos(a+r*6),dy*4+Math.sin(a+r*6),r*3,4);let v=Math.min(1,Math.max(0,(arm*.75+n*.65-.45)*2.2));
    const eye=r<.06?0:Math.min(1,(r-.06)*10);const edge=1-Math.min(1,Math.max(0,(r-.75)/.25));v*=eye*edge;const o=(y*S+x)*4;
    const sh=200+arm*50;img.data[o]=sh;img.data[o+1]=sh-4;img.data[o+2]=sh-10;img.data[o+3]=Math.min(255,v*255);}
  g.putImageData(img,0,0);_spiral=srgbTex(new THREE.CanvasTexture(cv));return _spiral;}

/* ---- 47-site-mercury-cities.js ---- */
/* ===================== HELIOPOLIS & TYCHE ===================== */
function makeSea(root,size,color,y,opts){opts=opts||{};const g=new THREE.PlaneGeometry(size,size,opts.seg||80,opts.seg||80);g.rotateX(-Math.PI/2);
  const m=new THREE.Mesh(g,new THREE.MeshPhongMaterial({color:col(color),specular:col(0xc8dde4),shininess:120,transparent:true,opacity:opts.opacity||.9}));m.position.y=y;m.receiveShadow=true;root.add(m);
  const p=g.attributes.position;const base=Float32Array.from(p.array);let acc=0;
  m.userData.wave=(dt,t,amp)=>{acc+=dt;if(acc<.06)return;acc=0;for(let i=0;i<p.count;i++){const x=base[i*3],z=base[i*3+2];p.setY(i,(Math.sin(x*.004+t*.8)+Math.cos(z*.005+t*.6))*amp);}p.needsUpdate=true;g.computeVertexNormals();};
  return m;}
function shieldDome(r,color){const m=new THREE.Mesh(new THREE.SphereGeometry(r,64,32,0,TAU,0,Math.PI/2),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false,
    uniforms:{c:{value:col(color||0x7fc8ff)},k:{value:1},t:{value:0}},
    vertexShader:"varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}",
    fragmentShader:"uniform vec3 c;uniform float k;uniform float t;varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){float f=pow(1.-abs(dot(vN,vV)),2.4);vec2 q=vec2(atan(vP.z,vP.x)*20.,vP.y*.03);vec2 h=abs(fract(q)-.5);float grid=smoothstep(.47,.5,max(h.x,h.y));float wave=smoothstep(.0,.1,fract(vP.y*.002-t*.15))*smoothstep(.2,.1,fract(vP.y*.002-t*.15));gl_FragColor=vec4(c*(f*.55+.02+grid*.04+wave*.08)*k,1.);}"}));
  m.userData.set=(t,k)=>{m.material.uniforms.t.value=t;m.material.uniforms.k.value=k;};return m;}
const MERC_TODS={
  day:{top:0x2f5d9c,hor:0xf4e6cc,bot:0xcab890,sun:0xffffff,sunEl:.95,sunAz:-.6,sunI:3.6,skyL:0xcfe0ff,gndL:0x9a8060,hemiI:1,fog:0xf0e4d0,fogD:.00005,night:0,exp:.85,haze:.6,sunSize:.9972},
  dusk:{top:0x1c2550,hor:0xff8a40,bot:0x6a4030,sun:0xffa060,sunEl:.05,sunAz:-.6,sunI:2.6,skyL:0x8a7aa8,gndL:0x5a3a2a,hemiI:.6,fog:0xd08058,fogD:.00006,night:.6,exp:1.05,haze:1,sunSize:.9972},
  night:{top:0x03050c,hor:0x161a26,bot:0x0a0a0e,sun:0x8aa0d8,sunEl:.5,sunAz:2.2,sunI:.22,skyL:0x2a3048,gndL:0x0c0a0c,hemiI:.18,fog:0x101218,fogD:.00005,night:1,exp:1.15,stars:1}};

/* ---------- HELIOPOLIS ---------- */
(function(){const N=makeNoise(1313);
const BAY=x=>-2600+Math.sin(x*.0004)*500;  /* the bay lies west and south-west */
function ground(x,z){let h=(N.f(x*.0007,0,z*.0007,4)-.5)*40;
  h+=sst(-3500,-7500,z)*(900+N.f(x*.0012,2,z*.0012,4)*900);                     /* Hesperides to the north */
  const d=Math.hypot((x+4200)/2600,(z-3200)/2400);if(d<1.25)h-=sst(1.15,.7,d)*120; /* Bay of Sirens */
  h-=sst(-3800,-6200,x)*120;
  const dune=Math.sin(x*.004+N.f(x*.001,1,z*.001,3)*8)*14*sst(1800,4200,x+z*.4);h+=dune;
  return h;}
const SEA_Y=-30;
function color(x,z,h,sl){let c=mixc([226,214,186],[238,230,210],N.f(x*.002,3,z*.002,3));
  if(h<SEA_Y+12)c=[214,200,160];
  if(h>300)c=mixc(c,[150,128,104],sst(300,700,h));if(h>1300)c=mixc(c,[236,236,236],sst(1300,1500,h));
  const r=Math.hypot(x,z);if(r<2300&&h>0)c=mixc(c,[196,188,170],.7);
  return c;}
const P={hipp:[600,0,-300],water:[-300,0,350],via:[1400,0,500],grave:[3200,0,-1800],votum:[-3300,0,1100],wall:[2350,0,0],bay:[-4300,0,3000]};
const lm=[
 {id:"hippodrome",name:"The Hippodrome",pos:[P.hipp[0],120,P.hipp[2]],desc:"The great racing stadium. In the Fall of Heliopolis, Lysander rides out of it at the head of the sunblood horses.",cam:{target:P.hipp,r:1400,theta:.5,phi:1.0}},
 {id:"waterplaza",name:"Water Plaza",pos:[P.water[0],200,P.water[2]],desc:"A square kilometer dedicated to Poseidon: the Water Gardens, the GravLoop station to Tyche beneath the Hesperides, and a statue of the sea god.",cam:{target:P.water,r:1500,theta:.2,phi:1.0}},
 {id:"via",name:"Via Triumphia",pos:[P.via[0],60,P.via[2]],desc:"The triumphal avenue where the battle for the city is fought after the shield falls, and where Lysander later takes his Triumph.",cam:{target:P.via,r:1600,theta:1.1,phi:.95}},
 {id:"wall",name:"Heliopolis Wall",pos:[P.wall[0],140,P.wall[2]],desc:"The city wall. Ajax’s siege is broken here by Thraxa, Colloway and the First Army before Atalantia’s siege begins.",cam:{target:P.wall,r:1700,theta:1.2,phi:1.0}},
 {id:"shield",name:"City Shield",pos:[2900,900,1300],desc:"The shield that keeps Heliopolis alive through the siege, until Glirastes’ EMP brings it down along with the ships above.",cam:{target:[0,300,0],r:8200,theta:.3,phi:1.1}},
 {id:"graveyard",name:"Graveyard of Tyrants",pos:[P.grave[0],200,P.grave[2]],desc:"Seven monoliths raised to honor Sovereigns. The Republic dumped them at the edge of the Ladon and left them to sink into the sand.",cam:{target:P.grave,r:1300,theta:.9,phi:1.0}},
 {id:"votum",name:"Mound of Votum",pos:[P.votum[0],700,P.votum[2]],desc:"House Votum’s vast basilica on the Bay of Sirens, west of the city, with a statue of Helios about half a kilometer tall and the Votum war room. Darrow falls back here and Cassius carries him out aboard the Archimedes.",cam:{target:[P.votum[0],200,P.votum[2]],r:2200,theta:-.3,phi:1.05}},
 {id:"bay",name:"Bay of Sirens",pos:[P.bay[0],60,P.bay[2]],desc:"The bay west of the city. Glirastes’ floating home, the Lady Beatrice, hangs above the city; the Lightbringer is unveiled in the skies here in Light Bringer.",cam:{target:[P.bay[0],0,P.bay[2]],r:3800,theta:-.5,phi:1.1}}
];
SITES.heliopolis={name:"Heliopolis",body:"mercury",poi:"heliopolis",epithet:"Mercury · city of the sun",seed:131,
  blurb:"A glittering city of the south, between the Hesperides and the Bay of Sirens, at the edge of the Waste of Ladon.",
  eras:{4:{blurb:"Iron Gold. Taken by the Republic in Darrow’s Iron Rain, its shield raised against the Society."},5:{blurb:"Dark Age. The last Republic stronghold on Mercury, besieged under its shield until Glirastes’ EMP brings it down."},6:{blurb:"Light Bringer. The Society’s Heliopolis hails Lysander, and the Lightbringer hangs above the bay."}},
  facts:[["House","Votum"],["Seat","The Mound of Votum"],["Link to Tyche","The GravLoop, under the Hesperides"]],
  note:"Layout is an artistic reconstruction from the books’ descriptions.",
  ground,bounds:6000,minR:150,maxR:16000,shadow:5200,win:[3,2.4],cam:{target:[-300,200,300],r:7800,theta:.25,phi:1.1},defaultTod:"dusk",
  tods:MERC_TODS,landmarks:lm,
  build(ctx){const R=ctx.R,root=ctx.root;root.add(makeTerrain({size:22000,seg:300,height:ground,color}));
    const sea=makeSea(root,40000,0x1f6a82,SEA_Y,{seg:60});
    const B=new GeoBuilder(),Bg=new GeoBuilder(),Bm=new GeoBuilder();
    const WHITE=[0xf6f1e8,0xece4d6,0xe2d8c6],GLASS=[0xa9c4d6,0x93b2c6,0xc4d4de,0xd8c49a];
    /* towers: a Dubai-bright skyline */
    for(let i=0;i<900;i++){const a=R()*TAU,r=Math.pow(R(),.75)*2100;const x=Math.cos(a)*r*1.1,z=Math.sin(a)*r;
      if(Math.hypot(x-P.hipp[0],z-P.hipp[2])<380||Math.hypot(x-P.water[0],z-P.water[2])<560||Math.abs(z-P.via[2])<60&&x>200)continue;
      const y=ground(x,z);const core=1-r/2200;const h=30+Math.pow(R(),2.6)*720*(.3+core)+core*80;const w=26+R()*40;const glass=R()<.55;
      if(R()<.55)ARCH.tiered(glass?Bg:B,x,y,z,w,w*(.7+R()*.5),h,glass?GLASS[(R()*4)|0]:WHITE[(R()*3)|0],R,R()<.4?0xd9b060:null);
      else{(glass?Bg:B).add(G.cyl(w*.4,w*.55,h,10),TM(x,y,z),glass?GLASS[(R()*4)|0]:WHITE[(R()*3)|0],1);(glass?Bg:B).add(G.cone(w*.32,h*.2,10),TM(x,y+h,z),0xd9b060);}}
    /* Hippodrome */
    {const [x,,z]=P.hipp;const y=ground(x,z);for(let k=0;k<64;k++){const a=k/64*TAU;const px=x+Math.cos(a)*330,pz=z+Math.sin(a)*170;B.add(G.box(34,60,26),TM(px,y,pz,-a),0xf0e8da,1);}
      B.add(G.box(560,2,220),TM(x,y+.5,z),0xc8a878,0,true);B.add(G.box(420,6,10),TM(x,y,z),0xf3eee4);
      for(let k=0;k<4;k++)B.add(G.cone(6,40,8),TM(x-180+k*120,y+6,z),0xd9b060);}
    /* Water Plaza and Poseidon */
    {const [x,,z]=P.water;const y=ground(x,z);B.add(G.box(1000,3,1000),TM(x,y,z),0xe8e2d6,0,true);
      for(let k=0;k<5;k++)for(let j=0;j<5;j++)if((k+j)%2===0)B.add(G.box(140,1,140),TM(x-400+k*200,y+3,z-400+j*200),0x3f8aa0,0,true);
      B.add(G.cyl(60,70,30,24),TM(x,y,z),0xf0e8da);B.add(G.cyl(16,22,110,12),TM(x,y+30,z),0x9ab8c0);B.add(G.sphere(18,12),TM(x,y+150,z),0x9ab8c0);
      B.add(G.box(4,90,4),TM(x+22,y+120,z),0xd9b060);for(let k=0;k<3;k++)B.add(G.cone(3,24,6),TM(x+22+(k-1)*8,y+210,z),0xd9b060);
      B.add(G.cyl(40,40,40,20),TM(x+380,y,z+380),0x8aa0b0,1);}
    /* Via Triumphia to the eastern gate */
    for(let x=180;x<2400;x+=50){B.add(G.box(48,2,90),TM(x,ground(x,P.via[2])+.5,P.via[2]),0xf6f1e8,0,true);if(x%150<50){[-1,1].forEach(sd=>B.add(G.cyl(4,5,40,8),TM(x,ground(x,P.via[2]),P.via[2]+sd*60),0xece4d6));}}
    /* the wall */
    const segs=60;for(let i=0;i<segs;i++){const a0=i/segs*TAU,a1=(i+1)/segs*TAU;const R0=2350;const x0=Math.cos(a0)*R0*1.1,z0=Math.sin(a0)*R0,x1=Math.cos(a1)*R0*1.1,z1=Math.sin(a1)*R0;
      if(Math.abs(Math.atan2(z0-P.via[2]*0,x0))<.04)continue;const y=Math.min(ground(x0,z0),ground(x1,z1));if(y<SEA_Y+10)continue;ARCH.wall(B,x0,z0,x1,z1,y-6,70,20,0xe0d6c2);if(i%3===0)ARCH.tower(B,x0,y-6,z0,30,110,0xece4d6,"gold",1);}
    /* Graveyard of Tyrants: seven monoliths, tilting into the sand */
    for(let k=0;k<7;k++){const [gx,,gz]=P.grave;const x=gx+(k-3)*120,z=gz+Math.sin(k)*60;const y=ground(x,z);B.add(G.box(40,260-k*12,24),TM(x,y-50-k*8,z,k*.2,1,1,1,(k%2?1:-1)*.12,(k%3-1)*.1),0x3a3634);}
    /* the Mound of Votum and the colossus of Helios */
    {const [x,,z]=P.votum;const y=Math.max(ground(x,z),SEA_Y);B.add(G.cyl(420,520,90,40),TM(x,y-30,z),0xd8ccb6,0,true);
      B.add(G.box(520,180,300),TM(x,y+60,z),0xf2ece2,1);B.add(G.gable(540,90,320),TM(x,y+240,z,Math.PI/2),0xd9b060);
      ARCH.colonnade(B,x+290,y+60,z,300,140,12,0xf6f1e8,Math.PI/2);B.add(G.dome(120,28),TM(x,y+330,z),0xd9b060);
      /* Helios, about half a kilometer tall */
      const hx=x+520,hz=z-60,hy=y;B.add(G.box(120,60,120),TM(hx,hy,hz),0xe2d8c6);B.add(G.cyl(34,44,240,12),TM(hx,hy+60,hz),0xd9b060);
      B.add(G.box(100,120,50),TM(hx,hy+300,hz),0xd9b060);B.add(G.sphere(30,14),TM(hx,hy+450,hz),0xd9b060);
      B.add(G.box(16,140,16),TM(hx+56,hy+330,hz,0,1,1,1,0,-.6),0xd9b060);for(let k=0;k<9;k++){const a=k/9*Math.PI;B.add(G.cone(5,40,6),TM(hx+Math.cos(a)*34,hy+470+Math.sin(a)*34,hz,0,1,1,1,0,a-Math.PI/2),0xf0c870);}}
    root.add(B.mesh(mats().bld));root.add(Bg.mesh(mats().glass));root.add(Bm.mesh(mats().metal));
    /* water gardens and palms */
    const palms=scatter(1400,5200,R,(x,z)=>{const y=ground(x,z);if(y<SEA_Y+6||y>200)return null;const inPlaza=Math.abs(x-P.water[0])<480&&Math.abs(z-P.water[2])<480;const r=Math.hypot(x,z);if(!(inPlaza||r>2400&&r<3000&&R()<.3))return null;return {x,y,z,s:5+R()*4,c:[0x4f7a3a,0x5e8a44][(R()*2)|0]};});
    root.add(makeForest(palms,"broad",11));
    /* Glirastes' floating home, the Lady Beatrice */
    const lady=new THREE.Group();{const L=new GeoBuilder();L.add(G.cyl(140,40,90,12),TM(0,-90,0),0x9a8a6a,0,true);L.add(G.cyl(150,150,10,24),TM(0,0,0),0x6f8a4a,0,true);
      L.add(G.cyl(40,50,80,12),TM(0,10,0),0xf0e8da,1);L.add(G.dome(46,14),TM(0,90,0),0xd9b060);for(let k=0;k<5;k++)L.add(G.box(30,30,30),TM(Math.cos(k)*90,10,Math.sin(k)*90,k),0xece4d6,1);
      lady.add(L.mesh(mats().bld));const g=glowSprite(GLOW_BLUE,300,.5);g.position.y=-140;lady.add(g);}
    lady.position.set(-4600,700,2600);root.add(lady);
    /* the city shield */
    const shield=shieldDome(3400);root.add(shield);
    /* overhead: the Society fleet in the siege, the Lightbringer in the Society's day */
    const fleet=new THREE.Group();root.add(fleet);for(let i=0;i<12;i++){const s=makeShip(i<2?"dread":"torch",i<2?900:420);s.position.set(-3000+i*600,3600+R()*900,-2600-R()*2400);s.rotation.y=Math.PI/2;fleet.add(s);}
    const lb=makeShip("moonbreaker",560);lb.position.set(-5200,2600,1600);lb.rotation.y=.3;root.add(lb);
    const F=Flashes(root);let emp=-1;
    function applyEra(){shield.visible=ERA>=4&&ERA<=5;fleet.visible=ERA===5;lb.visible=ERA>=6;}
    applyEra();SITES.heliopolis.onEra=applyEra;
    SITES.heliopolis._emp=()=>{emp=0;};
    return {update(dt,t){sea.userData.wave(dt,t,4);lady.position.y=700+Math.sin(t*.4)*20;lady.rotation.y+=dt*.02;
      let k=1;if(emp>=0){emp+=dt;k=emp<1.2?1+Math.sin(emp*40)*.8:Math.max(0,1-(emp-1.2));if(emp>2.4){shield.visible=false;emp=-1;}}
      shield.userData.set(t,k);
      if(fleet.visible&&Math.random()<dt*2){const s=fleet.children[(Math.random()*fleet.children.length)|0];const b=new THREE.Vector3((Math.random()-.5)*3000,3400*Math.random(),(Math.random()-.5)*3000);if(shield.visible){b.setLength(3400);b.y=Math.abs(b.y);}F.add(GLOW_WARM,b,500,.6);}
      F.update(dt);}};
  }};
})();

/* ---------- TYCHE ---------- */
(function(){const N=makeNoise(1414);
/* the Sycorax Sea lies north (-z); mountains rise to the south */
function ground(x,z){let h=(N.f(x*.0008,0,z*.0008,4)-.5)*30+12;
  const coast=-400+Math.sin(x*.0007)*300;h-=sst(coast+200,coast-500,z)*140;
  h+=sst(1200,4200,z)*(1100+N.f(x*.0011,2,z*.0011,4)*900)*(1-Math.exp(-Math.pow(x/6000,2))*.0);
  /* bridged islands to the north-east */
  [[2200,-1700,520],[3400,-2300,420],[1300,-2500,360],[4600,-1500,380]].forEach(i=>{const d=Math.hypot(x-i[0],z-i[1])/i[2];if(d<1.2)h=Math.max(h,(1-d)*60+6+(N.f(x*.004,4,z*.004,2)-.5)*14);});
  return h;}
const SEA_Y=-6;
function color(x,z,h,sl){let c=mixc([96,128,70],[124,146,82],N.f(x*.002,1,z*.002,3));if(h<SEA_Y+8)c=[210,200,170];
  if(h>200)c=mixc(c,[130,124,112],sst(200,600,h));if(sl>.5)c=mixc(c,[170,162,150],(sl-.5)*1.6);if(h>1500)c=mixc(c,[240,240,240],sst(1500,1700,h));
  if(Math.hypot(x,z+100)<2000&&h>0)c=mixc(c,[200,192,178],.7);return c;}
const HEADS=[[-1800,2000],[-600,2200],[700,2100],[1900,1950]];
const lm=[
 {id:"harbor",name:"The Harbor Front",pos:[0,60,-500],desc:"Tyche’s waterfront on the Sycorax Sea. In Dark Age, storm surges and tidal waves from the Storm Gods pour over it and drown the city.",cam:{target:[0,0,-400],r:2200,theta:.15,phi:1.05}},
 {id:"libraries",name:"Libraries of the Heads",pos:[HEADS[1][0],620,HEADS[1][1]],desc:"Libraries carved into the mountains behind the city in the shape of colossal human heads.",cam:{target:[HEADS[1][0],300,HEADS[1][1]],r:2000,theta:3.1,phi:1.2}},
 {id:"centralcmd",name:"Tyche Central Command",pos:[300,520,200],desc:"The Republic’s headquarters on Mercury, from which Darrow runs the war. Orion is taken from her headquarters here.",cam:{target:[300,100,200],r:1400,theta:.6,phi:1.0}},
 {id:"vespasian",name:"Vespasian Island",pos:[2200,180,-1700],desc:"Island seat of the Hall of Justice, joined to the city by bridges.",cam:{target:[2200,40,-1700],r:1500,theta:.8,phi:1.0}},
 {id:"ancestor",name:"Ancestor Bridge",pos:[1300,140,-1050],desc:"One of the bridges that carry Tyche out onto its islands.",cam:{target:[1300,40,-1050],r:1200,theta:.4,phi:1.0}},
 {id:"oldquarter",name:"Old Quarter",pos:[-1200,140,-100],desc:"The old city, carved from local stone by House Votum, below the glass and limestone towers.",cam:{target:[-1200,40,-100],r:1300,theta:-.3,phi:1.0}},
 {id:"harpers",name:"Harper’s Plaza",pos:[-400,90,350],desc:"A public square of the capital.",cam:{target:[-400,20,350],r:900,theta:.2,phi:1.0}},
 {id:"railguns",name:"Railgun Batteries",pos:[2600,1500,2800],desc:"Railgun installations in the mountains guard Tyche from aerial attack.",cam:{target:[2600,1200,2800],r:2200,theta:2.6,phi:1.15}},
 {id:"morningstar",name:"The Morning Star",pos:[4600,1800,-3400],desc:"Darrow’s flagship, under repair at Tyche when the war turns. After Mercury falls, Lysander rebuilds it as the Lightbringer.",cam:{target:[4600,1500,-3400],r:3600,theta:2.6,phi:1.25}}
];
SITES.tyche={name:"Tyche",body:"mercury",poi:"tyche",epithet:"Capital of Mercury · on the Sycorax Sea",seed:141,
  blurb:"Mercury’s capital and richest city, on a sloping strip of lowland between the Hesperides and the sea. House Votum built it in glass and limestone; libraries shaped as colossal heads are carved into the mountains behind it, and bridges carry it onto its islands.",
  eras:{4:{blurb:"Iron Gold. Darrow’s headquarters on Mercury, under the Republic’s shield."},5:{blurb:"Dark Age. Darrow’s headquarters, with the Morning Star docked for repairs, until the Storm Gods drown it. Toggle the Storm Gods to see the flood."},6:{blurb:"Light Bringer. A drowned and broken capital under the Society."}},
  facts:[["House","Votum"],["Sea","Sycorax"],["Undersea transit","Lines beneath the seafloor"],["Link south","The GravLoop to Heliopolis"]],
  note:"Layout is an artistic reconstruction from the books’ descriptions.",
  ground,bounds:5200,minR:150,maxR:16000,shadow:5000,win:[3,2.4],cam:{target:[200,200,400],r:7400,theta:Math.PI-.15,phi:1.18},defaultTod:"day",
  tods:MERC_TODS,landmarks:lm,toggles:[{id:"storms",label:"Storm Gods"}],
  build(ctx){const R=ctx.R,root=ctx.root;root.add(makeTerrain({size:20000,seg:300,height:ground,color}));
    const sea=makeSea(root,40000,0x1a6078,SEA_Y,{seg:70});
    const B=new GeoBuilder(),Bg=new GeoBuilder(),Bm=new GeoBuilder();
    const LIME=[0xeae2d0,0xdfd4bc,0xf2ead8],GLASS=[0x8fb0c4,0xa6c0d0,0x7aa0b6];
    for(let i=0;i<1000;i++){const x=(R()-.5)*4400,z=-300+R()*1800+(R()-.5)*300;const y=ground(x,z);if(y<SEA_Y+3||y>260)continue;const core=Math.max(0,1-Math.hypot(x-300,z-200)/2200);
      const h=20+Math.pow(R(),2.4)*520*(.25+core);const w=22+R()*34;const glass=R()<.5;
      if(h>120&&R()<.6)ARCH.tiered(glass?Bg:B,x,y,z,w,w*(.7+R()*.5),h,glass?GLASS[(R()*3)|0]:LIME[(R()*3)|0],R,R()<.3?0xd9b060:null);
      else (glass?Bg:B).add(G.box(w,h,w*(.6+R()*.8)),TM(x,y,z,(R()-.5)*.3),glass?GLASS[(R()*3)|0]:LIME[(R()*3)|0],1);}
    /* old quarter of carved stone */
    for(let i=0;i<500;i++){const x=-1200+(R()-.5)*1100,z=-100+(R()-.5)*800;const y=ground(x,z);if(y<SEA_Y+3)continue;B.add(G.box(14+R()*16,10+R()*20,14+R()*16),TM(x,y,z,R()*.3),[0xcfc0a2,0xbfae90,0xd8caa8][(R()*3)|0],1);if(R()<.2)B.add(G.dome(9,10),TM(x,y+22,z),0xd9b060);}
    /* islands, bridges, the Hall of Justice */
    [[2200,-1700],[3400,-2300],[1300,-2500],[4600,-1500]].forEach((p,k)=>{for(let i=0;i<120;i++){const x=p[0]+(R()-.5)*600,z=p[1]+(R()-.5)*600;const y=ground(x,z);if(y<SEA_Y+3)continue;B.add(G.box(16+R()*20,12+R()*80,16+R()*20),TM(x,y,z,R()),LIME[(R()*3)|0],1);}});
    {const x=2200,z=-1700,y=ground(x,z);B.add(G.box(240,70,140),TM(x,y,z),0xf2ead8,1);B.add(G.gable(250,40,150),TM(x,y+70,z,Math.PI/2),0xd9b060);ARCH.colonnade(B,x,y,z+90,240,60,10,0xf6f1e8,0);}
    const bridges=[[[600,-650],[2200,-1700]],[[2200,-1700],[3400,-2300]],[[2200,-1700],[1300,-2500]],[[3400,-2300],[4600,-1500]]];
    bridges.forEach(b=>{const [a,c]=b;const L=Math.hypot(c[0]-a[0],c[1]-a[1]);const ang=Math.atan2(c[1]-a[1],c[0]-a[0]);const mx=(a[0]+c[0])/2,mz=(a[1]+c[1])/2;
      Bm.add(G.box(L,8,30),TM(mx,26,mz,-ang),0xd8d0c0,1);const n=Math.floor(L/160);for(let k=1;k<n;k++){const t=k/n;Bm.add(G.box(10,60,10),TM(a[0]+(c[0]-a[0])*t,SEA_Y-20,a[1]+(c[1]-a[1])*t),0xcfc6b4);}
      for(let k=0;k<2;k++){const t=.3+k*.4;Bm.add(G.box(14,140,14),TM(a[0]+(c[0]-a[0])*t,26,a[1]+(c[1]-a[1])*t),0xe0d8c6);}});
    /* the libraries carved as colossal heads */
    HEADS.forEach((p,k)=>{const x=p[0],z=p[1];const y=ground(x,z-260)-120;const s=300+k*20;
      B.add(G.sphere(s,20),TM(x,y+s*1.1,z,0,1,1.25,.9),0xa89c88);B.add(G.box(s*.5,s*.5,s*.4),TM(x,y+s*.1,z-s*.4),0xa89c88);
      B.add(G.box(s*.22,s*.08,s*.05),TM(x-s*.32,y+s*1.25,z-s*.86),0x2a2420,2);B.add(G.box(s*.22,s*.08,s*.05),TM(x+s*.32,y+s*1.25,z-s*.86),0x2a2420,2);
      B.add(G.box(s*.12,s*.3,s*.12),TM(x,y+s*1.0,z-s*.9),0x9a8e7a);B.add(G.box(s*.5,s*.06,s*.05),TM(x,y+s*.75,z-s*.84),0x2a2420,2);
      for(let w=0;w<6;w++)B.add(G.box(10,14,4),TM(x+(w-2.5)*30,y+s*.5,z-s*.75),0xffd59a,2);});
    /* Central Command */
    {const x=300,z=200,y=ground(x,z);Bm.add(G.box(120,420,120),TM(x,y,z,.2),0x6a7480,1);Bm.add(G.cyl(40,60,80,8),TM(x,y+420,z),0x8a9098,1);Bm.add(G.cyl(3,3,120,4),TM(x,y+500,z),0xb0b8c0);}
    /* railgun batteries on the heights */
    for(let k=0;k<5;k++){const x=1800+k*400,z=2600+(k%2)*300;const y=ground(x,z);Bm.add(G.cyl(40,50,30,10),TM(x,y,z),0x4a4c52);Bm.add(G.box(240,16,16).translate(100,0,0),TM(x,y+40,z,-.8,1,1,1,0,.6),0x5a5c62);}
    root.add(B.mesh(mats().bld));root.add(Bg.mesh(mats().glass));root.add(Bm.mesh(mats().metal));
    const trees=scatter(2500,9000,R,(x,z)=>{const y=ground(x,z);if(y<SEA_Y+5||y>900)return null;if(Math.hypot(x,z+100)<2100&&R()<.85)return null;return {x,y,z,s:8+R()*6,c:[0x3f6a32,0x4f7a3a,0x36582c][(R()*3)|0]};});
    root.add(makeForest(trees,"pine",31));
    const shield=shieldDome(3000);shield.position.set(300,0,0);root.add(shield);
    const ms=makeShip("moonbreaker",520);ms.position.set(4600,1500,-3400);ms.rotation.y=-.5;root.add(ms);
    /* storms */
    const storm=new THREE.Group();root.add(storm);storm.visible=false;
    const cloud=new THREE.Mesh(new THREE.CircleGeometry(9000,64).rotateX(Math.PI/2),new THREE.MeshLambertMaterial({map:spiralTexture(),transparent:true,opacity:0,depthWrite:false,color:col(0x6a6e78),side:THREE.DoubleSide,fog:false}));cloud.position.set(-1000,5200,-3000);storm.add(cloud);
    const rainG=new THREE.BufferGeometry(),rn=5000,rp=new Float32Array(rn*6);const RR=rng(7);for(let i=0;i<rn;i++){const x=(RR()-.5)*9000,y=RR()*4800,z=(RR()-.5)*9000;rp.set([x,y,z,x+20,y-90,z],i*6);}
    rainG.setAttribute("position",new THREE.BufferAttribute(rp,3));const rain=new THREE.LineSegments(rainG,new THREE.LineBasicMaterial({color:col(0x9fb0c0),transparent:true,opacity:0,depthWrite:false}));storm.add(rain);
    const surge=[];for(let i=0;i<3;i++){const w=new THREE.Mesh(new THREE.CylinderGeometry(6,22,9000,8,1,false,0,Math.PI).rotateZ(Math.PI/2),new THREE.MeshPhongMaterial({color:col(0xdfeaee),transparent:true,opacity:.6,shininess:60}));w.position.set(0,SEA_Y,-3000-i*1500);storm.add(w);surge.push(w);}
    const bolt=glowSprite(GLOW_BLUE,1800,0);storm.add(bolt);const flashL=new THREE.PointLight(col(0xbfdcff),0,12000,1.2);storm.add(flashL);
    let on=false,k=0,flood=0;
    function applyEra(){shield.visible=ERA>=4&&ERA<=5;ms.visible=ERA===5;}
    applyEra();SITES.tyche.onEra=applyEra;
    SITES.tyche.onToggle=(id,v)=>{if(id==="storms")on=v;};
    SITES.tyche._flood=()=>{on=true;SITES.tyche._tog={storms:true};document.querySelectorAll('[data-tog=storms]').forEach(b=>b.setAttribute("aria-pressed",true));};
    return {update(dt,t){k+=((on?1:0)-k)*Math.min(1,dt*.8);if(window.__atlasFast)k=on?1:0;storm.visible=k>.01;
      flood+=((on?1:0)-flood)*Math.min(1,dt*.12);if(window.__atlasFast)flood=on?1:0;
      sea.position.y=SEA_Y+flood*70;sea.userData.wave(dt,t,4+k*18);
      cloud.material.opacity=k*.9;cloud.rotation.y+=dt*.05;rain.material.opacity=k*.5;rain.position.y=-((t*900)%400);
      surge.forEach((w,i)=>{w.position.z=-4600+((t*260+i*1500)%4500);w.position.y=sea.position.y+2;w.material.opacity=.55*k;});
      bolt.material.opacity=Math.random()<.02*k?.95:bolt.material.opacity*.8;if(bolt.material.opacity>.9){bolt.position.set((Math.random()-.5)*6000,1800,-1500-Math.random()*3000);flashL.position.copy(bolt.position);flashL.intensity=8;}flashL.intensity*=.85;
      const T=(tod.to||tod.site.tods[tod.cur]);sSun.intensity=T.sunI*(1-k*.7);site3.fog.density=T.fogD*(1+k*3);site3.fog.color.copy(col(T.fog)).lerp(col(0x4a525c),k*.8);
      shield.userData.set(t,1);}};
  }};
})();

/* ---- 48-globe-saga.js ---- */
/* ===================== GLOBE DETAIL FOR THE SAGA ===================== */
const GLOBE_WIN={night:{value:.75},k:{value:1.3},cw:{value:16},ch:{value:12}};
let _gbm=null;function globeBldMat(){if(!_gbm)_gbm=buildingMat({rough:.45,metal:.55,objSpace:true,uniforms:GLOBE_WIN});return _gbm;}
/* place a local-space object on the sphere at lat/lon, "up" along the normal */
function onSphere(obj,lat,lon,r){const n=latLonVec(lat,lon,1).normalize();obj.position.copy(n.clone().multiplyScalar(r));obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),n);return obj;}
function domeShaderMat(color){return new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
  uniforms:{c:{value:col(color)},k:{value:1}},
  vertexShader:"varying vec3 vN;varying vec3 vV;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}",
  fragmentShader:"uniform vec3 c;uniform float k;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-abs(dot(vN,vV)),2.);gl_FragColor=vec4(c*(f*.9+.05)*k,1.);}"});}

/* ---------- MERCURY: shields of the north, and the storms ---------- */
GLOBE_EXTRAS.mercury=(grp,R)=>{const g=new THREE.Group();g.userData.fixed=true;grp.add(g);
  if(ERA>=4&&ERA<=5){const mat=domeShaderMat(0x7fc8ff);
    [["tyche",.09],["heliopolis",.1],["redreach",.07],["pan",.06],["kydon",.06],["kaikos",.05],["priapos",.05],["angelia",.06],["eleusis",.06]].forEach(([id,r])=>{const ll=HL[id];if(!ll)return;
      const d=new THREE.Mesh(new THREE.SphereGeometry(r,20,10,0,TAU,0,Math.PI/2),mat);onSphere(d,ll[0],ll[1],R*.998);g.add(d);});
    if(ERA<=5){const pts=["pan","kaikos","priapos","kydon","angelia","eleusis"].map(id=>latLonVec(HL[id][0],HL[id][1],R*1.012));const chain=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:col(0x7fc8ff),transparent:true,opacity:.6,blending:THREE.AdditiveBlending}));g.add(chain);}}
  if(ERA===5){const tex=spiralTexture();[[12,-5,.9],[24,-17,.55],[26,10,.5]].forEach(([la,lo,s],i)=>{const m=new THREE.Mesh(new THREE.CircleGeometry(s,48),new THREE.MeshLambertMaterial({map:tex,transparent:true,opacity:.85,depthWrite:false}));
      const holder=new THREE.Object3D();onSphere(holder,la,lo,R*1.03);m.rotation.x=-Math.PI/2;holder.add(m);g.add(holder);m.userData.spin=(i%2?-1:1)*.5;});
    g.userData.update=dt=>g.traverse(o=>{if(o.userData.spin)o.rotation.z+=o.userData.spin*dt;});}
  return g;};

/* ---------- VENUS: the Carthii dockyards in orbit ---------- */
GLOBE_EXTRAS.venus=(grp,R)=>{const g=new THREE.Group();grp.add(g);const rr=rng(61);
  const S=1000;const B=new GeoBuilder();const RR=R*1.32*S/R;  /* build at 1000 units per R */
  const ringR=1320;B.add(new THREE.TorusGeometry(ringR,28,10,220).rotateX(Math.PI/2),null,0x6a6a72,1);B.add(new THREE.TorusGeometry(ringR,10,6,220).rotateX(Math.PI/2).translate(0,40,0),null,0x8a8a92,1);
  for(let i=0;i<48;i++){const a=i/48*TAU;const x=Math.cos(a)*ringR,z=Math.sin(a)*ringR;B.add(new THREE.BoxGeometry(18,160,18).translate(0,40,0),TM(x,0,z,-a),0x5a5a62,1);
    if(i%3===0){B.add(new THREE.BoxGeometry(160,16,16),TM(x,120,z,-a+Math.PI/2),0x7a7a82,1);}}
  for(let i=0;i<10;i++){const a=i/10*TAU+.2;B.add(new THREE.BoxGeometry(70,70,70),TM(Math.cos(a)*ringR,0,Math.sin(a)*ringR,-a),0x9a8a6a,1);}
  const m=B.mesh(globeBldMat());m.scale.setScalar(R/S);m.rotation.x=.15;g.add(m);
  for(let i=0;i<14;i++){const a=i/14*TAU;const s=makeShip(i%4?"torch":"dread",.16);s.position.set(Math.cos(a)*R*1.32,.05,Math.sin(a)*R*1.32);s.lookAt(0,s.position.y,0);s.rotateY(Math.PI/2);g.add(s);}
  g.rotation.x=.15;return g;};

/* ---------- PHOBOS: a moon swallowed by its own city ---------- */
GLOBE_EXTRAS.phobos=(grp,R)=>{const g=new THREE.Group();grp.add(g);const rr=rng(41);const S=1000/R;  /* build in units where R = 1000 */
  const B=new GeoBuilder(),Bs=new GeoBuilder();
  const MET=[0x7a7672,0x8a8580,0x5e5a58,0x9a948c,0x4a4644,0xa89c88];
  /* the Hive: spires and towers radiating from every face, densest near the equator */
  for(let i=0;i<900;i++){const u=rr()*2-1,t=rr()*TAU,s=Math.sqrt(1-u*u);const n=new THREE.Vector3(s*Math.cos(t),u*.86,s*Math.sin(t)).normalize();
    const eq=1-Math.abs(n.y);const len=40+Math.pow(rr(),3.6)*(520+eq*520);const w=14+rr()*30;
    const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),n);const base=n.clone().multiplyScalar(1000*.97);
    const mat=new THREE.Matrix4().compose(base,q,new THREE.Vector3(1,1,1));
    const kind=rr();let geo;
    if(kind<.5)geo=new THREE.CylinderGeometry(w*.15,w*.6,len,6).translate(0,len/2,0);
    else if(kind<.8)geo=new THREE.BoxGeometry(w,len*.6,w).translate(0,len*.3,0);
    else{geo=new THREE.CylinderGeometry(w*.3,w*.4,len,8).translate(0,len/2,0);B.add(new THREE.CylinderGeometry(w*1.8,w*1.8,6,12).translate(0,len*.75,0),mat,0x3a3634,1);}
    B.add(geo,mat,MET[(rr()*MET.length)|0],1);
    if(kind>.9)B.add(new THREE.SphereGeometry(w*.9,8,6).translate(0,len,0),mat,0xd9b060);}
  /* plating over the rock */
  for(let i=0;i<700;i++){const u=rr()*2-1,t=rr()*TAU,s=Math.sqrt(1-u*u);const n=new THREE.Vector3(s*Math.cos(t),u*.86,s*Math.sin(t)).normalize();const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),n);
    B.add(new THREE.BoxGeometry(60+rr()*90,10+rr()*30,60+rr()*90),new THREE.Matrix4().compose(n.clone().multiplyScalar(960),q,new THREE.Vector3(1,1,1)),MET[(rr()*4)|0],1);}
  /* two great ring docks */
  [[1750,0,0],[2150,.32,.6]].forEach(([r,tx,tz],k)=>{const rot=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(tx,0,tz));
    Bs.add(new THREE.TorusGeometry(r,34,12,260).rotateX(Math.PI/2),rot,0x6a6662,1);Bs.add(new THREE.TorusGeometry(r,12,6,260).rotateX(Math.PI/2).translate(0,46,0),rot,0x8a8682,1);
    for(let i=0;i<64;i++){const a=i/64*TAU;const m=new THREE.Matrix4().makeRotationY(-a).premultiply(new THREE.Matrix4().makeTranslation(Math.cos(a)*r,0,Math.sin(a)*r)).premultiply(rot);
      Bs.add(new THREE.BoxGeometry(30,30,120),m,0x5a5654,1);if(i%4===0)Bs.add(new THREE.BoxGeometry(14,240,14).translate(0,0,0),m,0x4a4644);}
    /* spokes back to the moon */
    for(let i=0;i<8;i++){const a=i/8*TAU+k*.2;const d=new THREE.Vector3(Math.cos(a),0,Math.sin(a)).applyMatrix4(new THREE.Matrix4().extractRotation(rot));
      const len=r-900;const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d);Bs.add(new THREE.CylinderGeometry(10,16,len,6).translate(0,len/2,0),new THREE.Matrix4().compose(d.clone().multiplyScalar(900),q,new THREE.Vector3(1,1,1)),0x5a5654);}});
  /* defense batteries */
  for(let i=0;i<24;i++){const u=rr()*2-1,t=rr()*TAU,s=Math.sqrt(1-u*u);const n=new THREE.Vector3(s*Math.cos(t),u*.86,s*Math.sin(t)).normalize();const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),n);const m=new THREE.Matrix4().compose(n.clone().multiplyScalar(1010),q,new THREE.Vector3(1,1,1));
    Bs.add(new THREE.CylinderGeometry(40,50,30,10),m,0x3a3c42);Bs.add(new THREE.BoxGeometry(14,14,200).translate(0,40,100),m,0x5a5c62);}
  const mesh=B.mesh(globeBldMat());mesh.scale.setScalar(1/S);g.add(mesh);const mesh2=Bs.mesh(globeBldMat());mesh2.scale.setScalar(1/S);g.add(mesh2);
  /* light on the needle tips */
  const lamp=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({color:col(0xffd08a),size:2,sizeAttenuation:false}));
  {const pts=[];for(let i=0;i<500;i++){const u=rr()*2-1,t=rr()*TAU,s=Math.sqrt(1-u*u);const n=new THREE.Vector3(s*Math.cos(t),u*.86,s*Math.sin(t)).normalize();pts.push(n.multiplyScalar(R*(1+rr()*.6)));}lamp.geometry.setFromPoints(pts);}g.add(lamp);
  /* ships at the docks and under construction */
  for(let i=0;i<22;i++){const a=i/22*TAU;const r=(i%2?1.75:2.15)*R;const s=makeShip(i%5===0?"dread":i%3?"torch":"hauler",.18+rr()*.16);s.position.set(Math.cos(a)*r,(rr()-.5)*.08,Math.sin(a)*r);s.lookAt(0,s.position.y,0);s.rotateY(Math.PI/2);g.add(s);}
  /* the shield, until it falls in Light Bringer */
  const sh=new THREE.Mesh(new THREE.SphereGeometry(R*2.35,48,32),domeShaderMat(0x7fc8ff));sh.material.uniforms.k.value=.35;sh.visible=ERA>=4;g.add(sh);g.userData.shield=sh;
  return g;};

/* ---- 49-site-saga.js ---- */
/* ===================== SCENES OF THE SECOND TRILOGY ===================== */
const SPACE_TODS={day:{top:0x010104,hor:0x06060c,bot:0x010104,sun:0xfff6e8,sunEl:.35,sunAz:.6,sunI:3.2,skyL:0x8a8a9a,gndL:0x2a2420,hemiI:.45,fog:0x000000,fogD:.0000004,night:.55,exp:1,stars:1,haze:.15},
  night:{top:0x010104,hor:0x040408,bot:0x010104,sun:0xd0d8ff,sunEl:-.2,sunAz:2.6,sunI:.45,skyL:0x3a3a50,gndL:0x0a0a0c,hemiI:.35,fog:0x000000,fogD:.0000004,night:1,exp:1.15,stars:1}};
const noGround=()=>-1e7;

/* ---------- VENUS: GORGON ISLE ---------- */
(function(){const N=makeNoise(1515);
const ISL=[[0,0,1500,520],[-3600,1600,800,180],[3300,-2200,900,220],[2600,2600,700,160],[-2800,-2600,600,140]];
function ground(x,z){let h=-160;ISL.forEach(([cx,cz,r,ht],i)=>{const d=Math.hypot(x-cx,z-cz)/r;const n=N.f(x*.002+i,1,z*.002,4);h=Math.max(h,(1-d)*ht*(1.2+n*.6)-30+(i===0?sst(.5,0,d)*380:0));});return h;}
function color(x,z,h,sl){let c=mixc([64,108,54],[86,128,62],N.f(x*.003,2,z*.003,3));if(h<14)c=[232,220,182];if(sl>.55)c=mixc(c,[58,54,56],(sl-.55)*1.8);if(h>500&&Math.hypot(x,z)<900)c=mixc(c,[52,48,50],.8);return c;}
SITES.gorgon={name:"Gorgon Isle",body:"venus",poi:"gorgon",epithet:"Venus · fortress of the Ash Lord",seed:151,
  blurb:"A volcanic island in Venus’s warm sea, crowned by the black fortress of Magnus au Grimmus, the Ash Lord. Lesser islands of villas and gardens lie around it.",
  facts:[["Lord","Magnus au Grimmus, the Ash Lord"],["House","Grimmus"],["Falls","Iron Gold, to Darrow and Apollonius"]],note:"Layout is an artistic reconstruction from the books.",
  ground,bounds:6000,minR:150,maxR:16000,shadow:5000,win:[2.6,2.1],cam:{target:[0,300,0],r:6800,theta:.5,phi:1.12},defaultTod:"dusk",
  skyBody:null,
  tods:{day:{top:0x4a86c8,hor:0xe6ecee,bot:0x6a9ab0,sun:0xfff6e0,sunEl:.8,sunAz:-.6,sunI:3,skyL:0xcfe4f6,gndL:0x3a5040,hemiI:.9,fog:0xd8e6ec,fogD:.00006,night:0,exp:.9,haze:.4},
    dusk:{top:0x1a2c5a,hor:0xff9060,bot:0x3a3a50,sun:0xffa070,sunEl:.05,sunAz:-.6,sunI:2.4,skyL:0x8a80a8,gndL:0x2a2830,hemiI:.6,fog:0xb08070,fogD:.00006,night:.6,exp:1.05,haze:1},
    night:{top:0x030612,hor:0x101828,bot:0x05070c,sun:0x9ab8ff,sunEl:.5,sunAz:2,sunI:.25,skyL:0x2a3450,gndL:0x080a0e,hemiI:.2,fog:0x0c1220,fogD:.00005,night:1,exp:1.15,stars:1}},
  landmarks:[
   {id:"keep",name:"The Ash Lord’s Keep",pos:[0,1400,0],desc:"The black fortress at the island’s height. In Iron Gold, Darrow storms it to find Magnus au Grimmus dying of poison; he learns that Atalantia now leads the Society and that Pax and Electra were taken, and the Ash Lord is burned alive.",cam:{target:[0,700,0],r:2600,theta:.6,phi:1.05}},
   {id:"seagate",name:"Sea Gate",pos:[1200,120,800],desc:"The fortress harbor, cut into the island’s flank.",cam:{target:[1200,30,800],r:1400,theta:.9,phi:1.0}},
   {id:"hangars",name:"Hangars",pos:[-900,500,-500],desc:"Landing fields and hangars carved into the mountain.",cam:{target:[-900,350,-500],r:1300,theta:-.4,phi:1.0}},
   {id:"villas",name:"Villa Islands",pos:[3300,260,-2200],desc:"Islands of white villas and gardens across the warm sea.",cam:{target:[3300,100,-2200],r:2200,theta:.8,phi:1.05}}],
  build(ctx){const R=ctx.R,root=ctx.root;root.add(makeTerrain({size:20000,seg:300,height:ground,color,cast:true}));
    const sea=makeSea(root,40000,0x1a7a8a,0,{seg:70});
    const B=new GeoBuilder(),Bd=new GeoBuilder();const BLACK=[0x2a2628,0x343032,0x3e3a3c];const top=ground(0,0);
    /* the keep: black stone, stepped bastions and spires */
    Bd.add(G.cyl(520,620,140,12),TM(0,top-60,0),0x2a2628,1);Bd.add(G.cyl(360,420,220,12),TM(0,top+60,0),0x343032,1);
    for(let k=0;k<12;k++){const a=k/12*TAU;ARCH.tower(Bd,Math.cos(a)*560,top-40,Math.sin(a)*560,48,240,BLACK[k%3],null,1);}
    for(let k=0;k<6;k++){const a=k/6*TAU+.2;ARCH.spire(Bd,Math.cos(a)*240,top+260,Math.sin(a)*240,40,520,0x2e2a2c,0xb0342a);}
    ARCH.spire(Bd,0,top+260,0,80,900,0x262224,0xd9b060);
    for(let k=0;k<4;k++){const a=k/4*TAU;Bd.add(G.box(260,90,120),TM(Math.cos(a)*420,top+40,Math.sin(a)*420,-a),0x3e3a3c,1);}
    /* sea gate */
    Bd.add(G.arch(240,180,80,40),TM(1200,0,800,-.6),0x2a2628);ARCH.wall(Bd,900,600,1500,1000,0,90,30,0x343032);
    /* villas */
    ISL.slice(1).forEach(([cx,cz,r],i)=>{for(let k=0;k<40;k++){const a=R()*TAU,d=Math.sqrt(R())*r*.7;const x=cx+Math.cos(a)*d,z=cz+Math.sin(a)*d;const y=ground(x,z);if(y<10)continue;
      B.add(G.box(30+R()*30,16+R()*14,24+R()*20),TM(x,y,z,R()),0xf6f1e8,1);B.add(G.gable(34,10,26),TM(x,y+22,z,R()),0xb05a3c);}});
    root.add(B.mesh(mats().bld));root.add(Bd.mesh(mats().bld));
    const trees=scatter(2400,14000,R,(x,z)=>{const y=ground(x,z);if(y<12||y>440)return null;if(Math.hypot(x,z)<700)return null;return {x,y,z,s:8+R()*6,c:[0x3f7a3a,0x4f8a44,0x2e6a32][(R()*3)|0]};});
    root.add(makeForest(trees,"broad",41));
    const ships=[];for(let i=0;i<6;i++){const s=makeShip(i?"frigate":"dread",i?60:160);root.add(s);ships.push({s,a:R()*TAU,r:2000+R()*1500,y:900+R()*500,sp:.05+R()*.04});}
    const fire=glowSprite(GLOW_RED,900,0);fire.position.set(0,top+300,0);root.add(fire);
    SITES.gorgon.onEra=()=>{fire.material.opacity=ERA>=4?.0:0;};
    return {update(dt,t){sea.userData.wave(dt,t,5);ships.forEach(o=>{o.a+=dt*o.sp;o.s.position.set(Math.cos(o.a)*o.r,o.y,Math.sin(o.a)*o.r);o.s.rotation.y=-o.a-Math.PI/2;});
      fire.material.opacity=selEvent==="g7"?.6+.3*Math.sin(t*9):0;}};}};
})();

/* ---------- VENUS: THE DOCKYARDS AND THE HANGING COLISEUM ---------- */
(function(){
SITES.venusdocks={name:"Venus Dockyards",body:"venus",poi:"vdocks",epithet:"Venus orbit · shipyards of House Carthii",seed:161,
  blurb:"The orbital shipyards of the Carthii, where the Society’s fleets are built above the clouds of Venus. From their underside hangs the Coliseum, an arena slung in space.",
  facts:[["House","Carthii"],["Arena","The Hanging Coliseum"],["Destroyed","Light Bringer, by Sevro"]],note:"Layout is an artistic reconstruction from the books.",
  ground:noGround,bounds:9000,minR:200,maxR:22000,shadow:6000,win:[3,2.4],cam:{target:[0,0,0],r:9000,theta:.6,phi:1.2},defaultTod:"day",
  skyBody:{id:"venus",dir:[.25,-.55,-.8],size:8200},
  tods:SPACE_TODS,todLabel:{day:"Sunward",night:"Nightside"},
  landmarks:[
   {id:"coliseum",name:"The Hanging Coliseum",pos:[0,-1500,0],desc:"An arena hung beneath the dockyards. In Light Bringer, Darrow loses a razor duel here after he and Cassius are caught at Venus.",cam:{target:[0,-1300,0],r:2400,theta:.7,phi:1.25}},
   {id:"cradles",name:"Building Cradles",pos:[2600,600,0],desc:"Warships of the Society take shape in vast cradles of scaffolding.",cam:{target:[2600,200,0],r:3200,theta:.9,phi:1.1}},
   {id:"spine",name:"The Spine",pos:[-3200,500,0],desc:"The central truss of the dockyards, kilometers long.",cam:{target:[-3200,0,0],r:3600,theta:.3,phi:1.1}}],
  build(ctx){const R=ctx.R,root=ctx.root;const B=new GeoBuilder();const MET=[0x6a6a72,0x7a7a82,0x5a5a62,0x8a8478];
    /* central spine and ring frames */
    B.add(new THREE.BoxGeometry(12000,120,160),TM(0,0,0),0x5a5a62,1);B.add(new THREE.BoxGeometry(12000,40,60),TM(0,120,0),0x7a7a82,1);
    for(let x=-5600;x<=5600;x+=800){B.add(new THREE.TorusGeometry(900,40,8,40).rotateY(Math.PI/2),TM(x,0,0),0x6a6a72,1);
      for(let k=0;k<6;k++){const a=k/6*TAU;B.add(new THREE.BoxGeometry(40,900,40).translate(0,450,0),TM(x,0,0,0,1,1,1,a),0x5a5a62);}}
    /* cradles with hulls in progress */
    const cr=[-4000,-1200,1600,4400];cr.forEach((x,i)=>{for(let k=0;k<10;k++){B.add(new THREE.BoxGeometry(30,1400,30),TM(x-700+k*160,-700,1100),0x4a4a52);B.add(new THREE.BoxGeometry(30,1400,30),TM(x-700+k*160,-700,-1100),0x4a4a52);}
      B.add(new THREE.BoxGeometry(1700,30,2300),TM(x,700,0),0x5a5a62,1);
      const s=makeShip(i%2?"dread":"torch",i%2?560:600);s.position.set(x,0,i%2?1500:-1500);s.rotation.y=0;root.add(s);});
    /* the hanging coliseum */
    {const y=-1500;for(let k=0;k<4;k++){const a=k/4*TAU+.4;B.add(new THREE.CylinderGeometry(10,10,1400,6).translate(0,700,0),TM(Math.cos(a)*600,y,Math.sin(a)*600,0,1,1,1,Math.sin(a)*.3,Math.cos(a)*.3),0x7a7a82);}
      for(let k=0;k<48;k++){const a=k/48*TAU;B.add(G.box(80,160,50),TM(Math.cos(a)*620,y-100,Math.sin(a)*500,-a),0xe6ddcc,1);}
      B.add(G.cyl(560,600,40,48),TM(0,y-130,0),0xcfc6b4,1);B.add(G.cyl(420,420,6,48),TM(0,y-90,0),0xc8a878,0,true);
      B.add(G.cyl(640,560,80,48),TM(0,y-210,0),0x5a5a62,1);}
    const m=B.mesh(mats().metal);root.add(m);
    const sparks=[];for(let i=0;i<120;i++){const s=glowSprite(GLOW_WHITE,60+R()*60,0);s.position.set((R()-.5)*11000,(R()-.5)*1600,(R()-.5)*2600);root.add(s);sparks.push({s,ph:R()*10});}
    const tugs=[];for(let i=0;i<50;i++){const s=glowSprite(R()<.5?GLOW_WARM:GLOW_BLUE,70,.9);root.add(s);tugs.push({s,x:(R()-.5)*12000,y:(R()-.5)*3000,z:(R()-.5)*5000,sp:(R()<.5?-1:1)*(150+R()*300)});}
    SITES.venusdocks._mesh=m;
    return {update(dt,t){sparks.forEach(o=>o.s.material.opacity=Math.max(0,Math.sin(t*3+o.ph))*.9);tugs.forEach(o=>{o.x+=o.sp*dt;if(o.x>7000)o.x=-7000;if(o.x<-7000)o.x=7000;o.s.position.set(o.x,o.y,o.z);});}};}};
})();

/* ---------- EARTH: NEW SPARTA ---------- */
(function(){const N=makeNoise(1616);
function ground(x,z){let h=(N.f(x*.0005,0,z*.0005,5)-.5)*90;h+=sst(5000,9000,Math.hypot(x+2000,z+4000))*600*N.f(x*.001,2,z*.001,3);
  const kop=Math.hypot(x,z);h+=sst(900,200,kop)*160;return h;}
function color(x,z,h,sl){const n=N.f(x*.002,3,z*.002,3);let c=mixc([176,150,90],[150,140,80],n);c=mixc(c,[108,120,64],sst(.6,.75,N.f(x*.0015,5,z*.0015,3)));if(sl>.5)c=mixc(c,[130,96,70],(sl-.5)*1.5);return c;}
SITES.newsparta={name:"New Sparta",body:"earth",poi:"newsparta",epithet:"Earth · Africa · seat of Atalantia",seed:171,
  blurb:"Atalantia au Grimmus rules the Society from New Sparta, a fortress city rising from the African plains. In Light Bringer she summons Lysander here and coerces him with Glirastes as hostage, but at the summit of the Two Hundred he wins the vote to strike Mars first.",
  facts:[["Dictator","Atalantia au Grimmus"],["Setting","The plains of Africa"],["Book","Light Bringer"]],note:"Layout is an artistic reconstruction; the books name New Sparta but say little of its look.",
  ground,bounds:7000,minR:150,maxR:18000,shadow:5200,win:[2.6,2.1],cam:{target:[0,200,0],r:7200,theta:.4,phi:1.12},defaultTod:"dusk",
  skyBody:{id:"luna",dir:[-.4,.35,-.85],size:900},
  tods:{day:{top:0x4a7ab8,hor:0xe8dcc0,bot:0xb0a080,sun:0xfff2d8,sunEl:.9,sunAz:-.7,sunI:3.1,skyL:0xcfe0f4,gndL:0x7a6040,hemiI:.9,fog:0xe0d4b8,fogD:.00005,night:0,exp:.9,haze:.4},
    dusk:{top:0x24305a,hor:0xff9a50,bot:0x5a4030,sun:0xffa060,sunEl:.05,sunAz:-.7,sunI:2.5,skyL:0x8a7aa0,gndL:0x4a3428,hemiI:.6,fog:0xc88a5a,fogD:.00005,night:.55,exp:1.05,haze:1},
    night:{top:0x03050c,hor:0x141826,bot:0x0a0a0e,sun:0x9ab0e0,sunEl:.5,sunAz:2.2,sunI:.22,skyL:0x2a3048,gndL:0x0c0a0a,hemiI:.18,fog:0x101218,fogD:.00005,night:1,exp:1.15,stars:1}},
  landmarks:[
   {id:"palace",name:"Atalantia’s Citadel",pos:[0,900,0],desc:"The Dictator’s seat. Lysander is brought before Atalantia here and coerced. She wants her Iron Rain on Luna, but the Two Hundred vote with him for Mars.",cam:{target:[0,400,0],r:2400,theta:.5,phi:1.05}},
   {id:"plains",name:"The Plains",pos:[3800,80,2600],desc:"The African savanna around New Sparta, as this atlas imagines it.",cam:{target:[3800,0,2600],r:3000,theta:.9,phi:1.15}},
   {id:"field",name:"Landing Field",pos:[-2600,60,1400],desc:"Where the Society’s ships come down outside the walls.",cam:{target:[-2600,0,1400],r:1800,theta:-.3,phi:1.05}}],
  build(ctx){const R=ctx.R,root=ctx.root;root.add(makeTerrain({size:22000,seg:280,height:ground,color}));
    const B=new GeoBuilder(),Bm=new GeoBuilder();const top=ground(0,0);
    const STONE=[0x8a6a5a,0x9a7a68,0x6e5448,0xb08a74];
    /* the citadel: severe stepped fortress, Grimmus black and red */
    for(let k=0;k<4;k++){const s=900-k*190;B.add(G.box(s,120,s),TM(0,top+k*120,0,Math.PI/4*(k%2)),[0x3a3234,0x4a3e3e,0x5a4a48,0x2a2426][k],1);}
    ARCH.spire(B,0,top+480,0,70,620,0x2a2426,0xb0342a);
    for(let k=0;k<8;k++){const a=k/8*TAU;ARCH.tower(B,Math.cos(a)*700,top,Math.sin(a)*700,40,260,0x3a3234,null,1);}
    /* the city around it */
    for(let i=0;i<900;i++){const a=R()*TAU,r=900+Math.pow(R(),.8)*2200;const x=Math.cos(a)*r,z=Math.sin(a)*r;const y=ground(x,z);const h=16+Math.pow(R(),2.6)*240;
      B.add(G.box(20+R()*30,h,20+R()*30),TM(x,y,z,Math.round(R()*4)*Math.PI/2),STONE[(R()*4)|0],1);}
    const segs=56;for(let i=0;i<segs;i++){const a0=i/segs*TAU,a1=(i+1)/segs*TAU;const r=3200;ARCH.wall(B,Math.cos(a0)*r,Math.sin(a0)*r,Math.cos(a1)*r,Math.sin(a1)*r,ground(Math.cos(a0)*r,Math.sin(a0)*r)-6,60,20,0x6e5448);}
    for(let i=0;i<8;i++){const x=-2600+(i%4)*180,z=1300+Math.floor(i/4)*200;Bm.add(G.cyl(70,74,6,20),TM(x,ground(x,z),z),0x4a4846,0,true);if(i%2){const s=makeShip("frigate",70);s.position.set(x,ground(x,z)+70,z);s.rotation.y=R()*TAU;root.add(s);}}
    root.add(B.mesh(mats().bld));root.add(Bm.mesh(mats().metal));
    /* acacia-dotted plains */
    const trees=scatter(2600,20000,R,(x,z)=>{const y=ground(x,z);if(Math.hypot(x,z)<3400)return null;if(R()<.6)return null;return {x,y,z,s:7+R()*5,c:[0x6a7a3a,0x5a6a34,0x7a8a44][(R()*3)|0]};});
    root.add(makeForest(trees,"broad",51));
    const ships=[];for(let i=0;i<8;i++){const s=makeShip(i<2?"dread":"torch",i<2?260:140);root.add(s);ships.push({s,a:R()*TAU,r:3000+R()*3000,y:1600+R()*900,sp:.03+R()*.03});}
    return {update(dt,t){ships.forEach(o=>{o.a+=dt*o.sp;o.s.position.set(Math.cos(o.a)*o.r,o.y,Math.sin(o.a)*o.r);o.s.rotation.y=-o.a-Math.PI/2;});}};}};
})();

/* ---------- IO: DEMETER'S GARTER ---------- */
(function(){const N=makeNoise(1717);
function ground(x,z){let h=(N.f(x*.0006,0,z*.0006,4)-.5)*50;const farm=1-sst(2200,4200,Math.abs(z));h=h*(1-farm*.7);
  [[-6000,-6500,1400],[5200,-7200,1100],[7500,5800,900]].forEach(v=>{const d=Math.hypot(x-v[0],z-v[1]);h+=v[2]*Math.max(0,1-d/2600);if(d<260)h-=sst(260,80,d)*200;});return h;}
function color(x,z,h,sl){const farm=1-sst(2200,4200,Math.abs(z)+N.f(x*.0008,3,z*.0008,3)*700);
  let s=mixc([222,196,86],[236,220,130],N.f(x*.002,1,z*.002,3));if(sl>.35)s=mixc(s,[160,104,50],(sl-.35)*1.4);
  const fx=Math.floor(x/260),fz=Math.floor(z/260);const hsh=Math.abs(Math.sin(fx*12.9898+fz*78.233)*43758.5453)%1;
  let f=mixc([64,120,46],[190,170,70],hsh);const canal=(Math.abs(((x%260)+260)%260-130)<6)||(Math.abs(((z%260)+260)%260-130)<6);if(canal)f=[70,120,140];
  return mixc(s,f,farm);}
SITES.garter={name:"Demeter’s Garter",body:"io",poi:"garter",epithet:"Io · the breadbasket of the Rim",seed:181,
  blurb:"A belt of fields and canals girdling Io’s equator, growing most of the Rim’s food under Jupiter’s face, with the sulfur wastes and volcanoes beyond. In Light Bringer, Lysander turns his guns on it.",
  facts:[["Feeds","Most of the Rim"],["Sacked","Light Bringer, by Lysander"],["Beyond","Sulfur dunes and volcanoes"]],note:"Layout is an artistic reconstruction from the books.",
  ground,bounds:9000,minR:200,maxR:22000,shadow:7000,win:[2.6,2.1],cam:{target:[0,0,0],r:9000,theta:.35,phi:1.14},defaultTod:"day",
  skyBody:{id:"jupiter",dir:[.1,.32,-.94],size:3400},toggles:[{id:"burn",label:"The Sack of Demeter"}],
  tods:{day:{top:0x0a0a18,hor:0x6a5a4a,bot:0x2a2018,sun:0xfff6e0,sunEl:.55,sunAz:.9,sunI:2.8,skyL:0xc0a080,gndL:0x4a3818,hemiI:.65,fog:0x5a4a38,fogD:.000035,night:.12,exp:.95,stars:.6,haze:.3},
    night:{top:0x020206,hor:0x1a120c,bot:0x060404,sun:0xd8a870,sunEl:.5,sunAz:-.3,sunI:.6,skyL:0x5a3a2a,gndL:0x0a0606,hemiI:.3,fog:0x140c08,fogD:.000035,night:1,exp:1.15,stars:1}},
  landmarks:[
   {id:"fields",name:"The Fields",pos:[0,120,0],desc:"Field after field, laid out along irrigation canals across Io’s equator.",cam:{target:[0,0,0],r:4200,theta:.4,phi:1.1}},
   {id:"towers",name:"Agri-towers",pos:[2400,400,-600],desc:"Granaries and processing towers along the belt.",cam:{target:[2400,100,-600],r:2000,theta:.8,phi:1.05}},
   {id:"volcanoes",name:"The Volcanoes",pos:[-6000,1500,-6500],desc:"Beyond the Garter, Io’s volcanoes and magma lakes.",cam:{target:[-6000,600,-6500],r:5000,theta:-.4,phi:1.1}}],
  build(ctx){const R=ctx.R,root=ctx.root;const terr=makeTerrain({size:26000,seg:320,height:ground,color});root.add(terr);
    const B=new GeoBuilder();for(let i=0;i<40;i++){const x=(R()-.5)*16000,z=(R()-.5)*3400;const y=ground(x,z);B.add(G.cyl(40,50,140+R()*240,12),TM(x,y,z),0xd8d0c0,1);B.add(G.dome(40,12),TM(x,y+200,z),0x9ab0a0);}
    for(let i=0;i<200;i++){const x=(R()-.5)*18000,z=(R()-.5)*4000;const y=ground(x,z);B.add(G.box(30,14,40),TM(x,y,z,Math.round(R()*2)*Math.PI/2),0xf0e8da,1);}
    root.add(B.mesh(mats().bld));
    const lava=[];[[-6000,-6500],[5200,-7200],[7500,5800]].forEach(v=>{const g=glowSprite(GLOW_RED,1600,.7);g.position.set(v[0],ground(v[0],v[1])+300,v[1]);root.add(g);lava.push(g);});
    /* the burning */
    const fire=new THREE.Group();root.add(fire);const fires=[];for(let i=0;i<220;i++){const s=glowSprite(R()<.5?GLOW_RED:GLOW_WARM,300+R()*500,0);const x=(R()-.5)*18000,z=(R()-.5)*4200;s.position.set(x,ground(x,z)+80,z);fire.add(s);fires.push({s,ph:R()*10,on:x});}
    const smoke=[];const sm=new THREE.SpriteMaterial({map:GLOW_WHITE,color:col(0x3a302a),transparent:true,opacity:0,depthWrite:false});for(let i=0;i<90;i++){const s=new THREE.Sprite(sm.clone());const sc=1500+R()*2000;s.scale.set(sc,sc*.7,1);const x=(R()-.5)*18000,z=(R()-.5)*4200;s.position.set(x,600+R()*1400,z);fire.add(s);smoke.push(s);}
    const lb=makeShip("moonbreaker",700);lb.position.set(-2000,5200,-5200);lb.rotation.y=.2;root.add(lb);
    const B2=Beams(root);let burn=0,front=-1;const start=()=>{front=0;};
    SITES.garter.onToggle=(id,on)=>{if(id==="burn"){if(on)start();else{front=-1;burn=0;}}};
    SITES.garter._burn=()=>{SITES.garter._tog={burn:true};document.querySelectorAll('[data-tog=burn]').forEach(b=>b.setAttribute("aria-pressed",true));start();};
    return {update(dt,t){lava.forEach((g,i)=>g.material.opacity=.6+.2*Math.sin(t*2+i));lb.visible=front>=0;
      if(front>=0){front=window.__atlasFast?1:Math.min(1,front+dt*.06);const fx=-9000+front*18000;
        if(Math.random()<dt*14){const x=-9000+Math.random()*(fx+9000),z=(Math.random()-.5)*4000;B2.add(lb.position.clone().add(new THREE.Vector3((Math.random()-.5)*600,-80,0)),new THREE.Vector3(x,ground(x,z),z),0xff6a3a,.3);}}
      fires.forEach(f=>{const lit=front>=0&&f.on<-9000+front*18000;f.s.material.opacity=lit?.5+.4*Math.sin(t*6+f.ph):0;});
      smoke.forEach(s=>{const lit=front>=0&&s.position.x<-9000+front*18000;s.material.opacity=lit?.45:0;s.position.y+=dt*40;if(s.position.y>2800)s.position.y=600;});
      B2.update(dt);}};}};
})();

/* ---------- ASTEROID 12193: THE TABULA RASA ---------- */
(function(){const N=makeNoise(1818);
SITES.asteroid={name:"Asteroid 12193",body:"asteroid",poi:"base",epithet:"The Belt · Quicksilver’s secret",seed:191,
  blurb:"A rock in the asteroid belt, hollowed out. Inside, Quicksilver has built no fleet, but a generation ship, the Tabula Rasa, meant to carry children who are no Color at all out of the Solar System.",
  facts:[["Builder","Quicksilver (Regulus ag Sun)"],["Keeper","Matteo"],["Ship","The Tabula Rasa"]],note:"Layout is an artistic reconstruction from the books.",
  ground:noGround,bounds:4200,minR:150,maxR:9000,shadow:4000,win:[2.6,2.1],cam:{target:[0,0,0],r:5200,theta:.5,phi:1.25},defaultTod:"day",
  tods:{day:{top:0x060404,hor:0x0c0806,bot:0x060404,sun:0xffe0b0,sunEl:1.2,sunAz:.4,sunI:1.6,skyL:0x8a7a6a,gndL:0x2a2018,hemiI:.55,fog:0x0a0806,fogD:.00004,night:.9,exp:1.1,haze:0},
    night:{top:0x020202,hor:0x040304,bot:0x020202,sun:0x8a7aa0,sunEl:1.3,sunAz:.2,sunI:.4,skyL:0x3a3040,gndL:0x080606,hemiI:.25,fog:0x060404,fogD:.00004,night:1,exp:1.2,haze:0}},
  todLabel:{day:"Work lights",night:"Quiet hours"},
  landmarks:[
   {id:"tabula",name:"The Tabula Rasa",pos:[0,700,0],desc:"Quicksilver’s generation ship, built in secret inside the asteroid to carry a new people beyond the Solar System.",cam:{target:[0,0,0],r:3600,theta:.6,phi:1.2}},
   {id:"cavern",name:"The Hollow",pos:[-2400,-600,1200],desc:"The asteroid’s hollowed interior, lit by work lamps and laced with gantries.",cam:{target:[-1800,-400,900],r:2400,theta:-.4,phi:1.2}},
   {id:"dock",name:"Hidden Dock",pos:[2800,200,-1400],desc:"Where the Archimedes is repaired after Darrow reaches the asteroid.",cam:{target:[2800,0,-1400],r:1800,theta:.9,phi:1.15}}],
  build(ctx){const R=ctx.R,root=ctx.root;
    /* the cavern shell, seen from inside */
    const g=new THREE.SphereGeometry(4600,96,64);const p=g.attributes.position;const cols=new Float32Array(p.count*3);const c=new THREE.Color();
    for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);const n=N.f(v.x*.0006,v.y*.0006,v.z*.0006,5);v.multiplyScalar(1+(n-.5)*.28);v.y*=.7;p.setXYZ(i,v.x,v.y,v.z);
      const k=.35+n*.4;c.setRGB(.42*k,.34*k,.28*k);cols.set([c.r,c.g,c.b],i*3);}
    g.computeVertexNormals();g.setAttribute("color",new THREE.BufferAttribute(cols,3));
    const shell=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95,side:THREE.BackSide}));shell.receiveShadow=true;root.add(shell);
    /* the Tabula Rasa: a long cylinder with rotating habitat rings */
    const ship=new THREE.Group();root.add(ship);const B=new GeoBuilder();
    B.add(new THREE.CylinderGeometry(260,260,4200,32).rotateZ(Math.PI/2),null,0xb8b0a0,1);
    B.add(new THREE.CylinderGeometry(300,420,500,32).rotateZ(-Math.PI/2).translate(-2300,0,0),null,0x6a6a72,1);
    B.add(new THREE.SphereGeometry(300,24,16).scale(1.4,1,1).translate(2200,0,0),null,0xd8d0c0,1);
    for(let k=0;k<6;k++)B.add(new THREE.BoxGeometry(120,80,700),TM(-1800+k*700,0,0),0x8a8478,1);
    const hull=B.mesh(mats().bld);ship.add(hull);
    const rings=[];for(let k=0;k<3;k++){const RB=new GeoBuilder();RB.add(new THREE.TorusGeometry(900,90,16,64).rotateY(Math.PI/2),null,0xe6ddcc,1);for(let s=0;s<6;s++)RB.add(new THREE.BoxGeometry(30,900,30).translate(0,450,0),TM(0,0,0,0,1,1,1,s/6*TAU),0x9a9488);
      const rm=RB.mesh(mats().bld);rm.position.x=-1000+k*1000;ship.add(rm);rings.push(rm);}
    ship.position.y=300;
    /* gantries and lamps */
    const G2=new GeoBuilder();for(let i=0;i<40;i++){const x=-2400+i*120;G2.add(new THREE.BoxGeometry(20,2600,20),TM(x,-900,(i%2?1:-1)*900),0x4a4a52);}
    G2.add(new THREE.BoxGeometry(5200,30,30),TM(0,800,900),0x5a5a62);G2.add(new THREE.BoxGeometry(5200,30,30),TM(0,800,-900),0x5a5a62);root.add(G2.mesh(mats().metal));
    const lamps=[];for(let i=0;i<10;i++){const L=new THREE.PointLight(col(0xffc890),1.2,6000,1.6);const a=i/10*TAU;L.position.set(Math.cos(a)*2800,(R()-.5)*1600,Math.sin(a)*2800);root.add(L);const s=glowSprite(GLOW_WARM,300,.9);s.position.copy(L.position);root.add(s);lamps.push(L);}
    const arch=makeShip("frigate",320);arch.position.set(2800,0,-1400);arch.rotation.y=.4;root.add(arch);
    const sparks=[];for(let i=0;i<60;i++){const s=glowSprite(GLOW_WHITE,50,0);s.position.set((R()-.5)*4400,300+(R()-.5)*600,(R()-.5)*900);root.add(s);sparks.push({s,ph:R()*10});}
    return {update(dt,t){rings.forEach((r,i)=>r.rotation.x+=dt*(.05+i*.01));sparks.forEach(o=>o.s.material.opacity=Math.max(0,Math.sin(t*3+o.ph))*.9);}};}};
})();

/* ---------- EUROPA: a Roman city on the sea, and the Daughters below ---------- */
(function(){const E=SITES.europa;if(!E)return;const oldBuild=E.build;
E.name="Europa";E.epithet="Europa · the Discordia Sea";E.pois=["athena"];
E.blurb="An ocean world of mossy, forested islands under Jupiter. Lorn au Arcos keeps his white limestone castle on a northern island; across the strait rises a city of temples and colonnades, and far below the waves the Daughters of Athena keep their hidden base.";
E.eras={6:{blurb:"Light Bringer. Volsung Fá invades Europa, and beneath its sea the Daughters of Athena put Darrow and Diomedes on trial."}};
E.note="The temple city and its statues are this atlas’s interpretation of Europa’s Roman-styled Rim culture; Lorn’s castle and the Daughters’ undersea base come from the books.";
E.landmarks.push(
 {id:"temple",name:"Temple of Jupiter",pos:[-2600,700,-1000],desc:"A temple to the king of the gods above the sea, with a colossal statue of Jupiter, the Roman Zeus, holding his thunderbolt.",cam:{target:[-2600,300,-1000],r:2000,theta:-.5,phi:1.05}},
 {id:"forum",name:"Sea Forum",pos:[-1900,160,-1700],desc:"Colonnades, triumphal arches and a harbor of white stone.",cam:{target:[-1900,40,-1700],r:1500,theta:-.2,phi:1.0}},
 {id:"athena",name:"Daughters of Athena",pos:[1800,-260,-2400],desc:"A base hidden beneath Europa’s ocean. In Light Bringer, Athena tries Darrow and Diomedes here, and Sevro talks her into sparing them.",cam:{target:[1800,-100,-2400],r:1800,theta:.6,phi:1.15}});
E.build=ctx=>{const o=oldBuild(ctx)||{};const R=ctx.R,root=ctx.root;const g=E.ground;const B=new GeoBuilder();const MARB=[0xf6f1e8,0xece4d6,0xe2d8c6];
  const cx=-2600,cz=-1000;const top=Math.max(20,g(cx,cz));
  /* temple of Jupiter: peristyle with pediment */
  B.add(G.box(420,30,260),TM(cx,top,cz),0xe2d8c6);for(let i=0;i<14;i++){const t=i/13;[[-1,0],[1,0]].forEach(()=>{});B.add(G.cyl(9,11,150,12),TM(cx-190+t*380,top+30,cz-115),0xf6f1e8);B.add(G.cyl(9,11,150,12),TM(cx-190+t*380,top+30,cz+115),0xf6f1e8);}
  for(let i=0;i<8;i++){const t=i/7;B.add(G.cyl(9,11,150,12),TM(cx-190,top+30,cz-115+t*230),0xf6f1e8);B.add(G.cyl(9,11,150,12),TM(cx+190,top+30,cz-115+t*230),0xf6f1e8);}
  B.add(G.box(420,24,260),TM(cx,top+180,cz),0xece4d6);B.add(G.gable(430,60,270),TM(cx,top+204,cz,Math.PI/2),0xe2d8c6);
  /* colossus of Jupiter with thunderbolt */
  const sx=cx+420,sz=cz+60,sy=Math.max(10,g(sx,sz));B.add(G.box(90,60,90),TM(sx,sy,sz),0xd8ccb6);B.add(G.cyl(30,40,180,12),TM(sx,sy+60,sz),0xe8e0d0);B.add(G.box(80,90,44),TM(sx,sy+240,sz),0xe8e0d0);
  B.add(G.sphere(26,12),TM(sx,sy+356,sz),0xe8e0d0);B.add(G.box(14,110,14),TM(sx+50,sy+300,sz,0,1,1,1,0,-.9),0xe8e0d0);B.add(G.box(8,90,8),TM(sx+110,sy+360,sz,0,1,1,1,0,.4),0xd9b060);
  B.add(G.box(14,90,14),TM(sx-46,sy+250,sz,0,1,1,1,0,.3),0xe8e0d0);B.add(G.cyl(4,4,200,6),TM(sx-62,sy+170,sz),0xd9b060);
  /* sea forum: colonnades, arches, villas */
  const fx=-1900,fz=-1700;for(let i=0;i<3;i++)ARCH.colonnade(B,fx+(i-1)*200,Math.max(10,g(fx,fz)),fz+i*90,240,60,10,MARB[i],0);
  B.add(G.arch(90,110,30,18),TM(fx+320,Math.max(10,g(fx+320,fz)),fz,Math.PI/2),0xf6f1e8);
  for(let i=0;i<160;i++){const a=R()*TAU,r=200+R()*900;const x=cx+600+Math.cos(a)*r,z=cz-500+Math.sin(a)*r;const y=g(x,z);if(y<10)continue;B.add(G.box(24+R()*24,14+R()*16,20+R()*20),TM(x,y,z,R()),MARB[(R()*3)|0],1);B.add(G.gable(28,10,24),TM(x,y+20,z,R()),0xb05a3c);if(R()<.15)B.add(G.dome(10,10),TM(x,y+30,z),0xd9b060);}
  /* lesser statues of the gods along the harbor */
  for(let i=0;i<6;i++)ARCH.statue(B,fx-300+i*120,Math.max(10,g(fx-300+i*120,fz-200)),fz-200,30,0xe8e0d0,Math.PI);
  root.add(B.mesh(mats().bld));
  /* the Daughters' base: lights beneath the sea */
  const base=new THREE.Group();base.position.set(1800,-220,-2400);root.add(base);const DB=new GeoBuilder();
  DB.add(G.dome(220,24),TM(0,0,0),0x7a9aaa,1);for(let k=0;k<5;k++){const a=k/5*TAU;DB.add(G.dome(90,16),TM(Math.cos(a)*330,0,Math.sin(a)*330),0x6a8a9a,1);DB.add(new THREE.CylinderGeometry(14,14,330,8).rotateZ(Math.PI/2).translate(165,20,0),TM(0,0,0,-a),0x5a7a8a);}
  base.add(DB.mesh(mats().glass));for(let k=0;k<6;k++){const s=glowSprite(GLOW_BLUE,400,.7);const a=k/6*TAU;s.position.set(Math.cos(a)*300,60,Math.sin(a)*300);base.add(s);}
  base.visible=ERA>=6;E.onEra=()=>{base.visible=ERA>=6;};
  return {update(dt,t){if(o.update)o.update(dt,t);}};};
})();

/* ---------- PHOBOS: the Nucleus and the statues of the Rising ---------- */
(function(){const P=SITES.phobos;if(!P)return;const oldBuild=P.build;P.pois=["nucleus"];
P.eras={4:{blurb:"Iron Gold to Light Bringer. The Republic’s fortress moon: its spires reach far beyond the rock, its ring docks build the fleet, and and Virginia commands its defense from the Nucleus."},6:{blurb:"Light Bringer. Mercury’s railguns and Lysander’s crewless destroyers break the shield, and Phobos falls; Virginia gives up the dockyards to buy passage to Mars."}};
P.landmarks.push({id:"nucleus",name:"The Nucleus",pos:[-1800,600,1600],desc:"Virginia’s command center, where she directs Phobos’s battle stations until it overheats. Kavax leaves to lead a counterattack and is taken by Apollonius.",cam:{target:[-1800,300,1600],r:1800,theta:-.4,phi:1.1}});
P.build=ctx=>{const o=oldBuild(ctx)||{};const R=ctx.R,root=ctx.root;const B=new GeoBuilder();const g=P.ground;
  const cx=-1800,cz=1600,y0=g(cx,cz);B.add(G.cyl(420,460,40,32),TM(cx,y0,cz),0x5a5a62,1);B.add(G.dome(300,24),TM(cx,y0+40,cz),0x7a8a9a,1);
  /* statues of the Rising, colossal and stern */
  for(let k=0;k<5;k++){const a=k/5*TAU+.3;const x=cx+Math.cos(a)*520,z=cz+Math.sin(a)*520;B.add(G.box(80,40,80),TM(x,y0,z),0xcfc6b4);B.add(G.box(50,200,34),TM(x,y0+40,z,-a),0xd8d0c0);B.add(G.sphere(22,10),TM(x,y0+262,z),0xd8d0c0);
    B.add(G.box(10,160,10),TM(x+Math.cos(a)*30,y0+180,z+Math.sin(a)*30,-a,1,1,1,0,.4),0xb03526);}
  if(ERA>=4){for(let i=0;i<140;i++){const a=R()*TAU,r=Math.pow(R(),.9)*3000;const x=Math.cos(a)*r,z=Math.sin(a)*r;const y=g(x,z);const h=400+Math.pow(R(),2.5)*1800;const w=14+R()*30;
      B.add(new THREE.CylinderGeometry(w*.2,w,h,6).translate(0,h/2,0),TM(x,y,z),[0x8a8580,0x5e5a58,0xa89c88][(R()*3)|0],1);}}
  root.add(B.mesh(mats().metal));
  return o;};
})();

/* ---------- first-trilogy places, as they stand in the later books ---------- */
(function(){
if(SITES.agea)SITES.agea.eras={4:{blurb:"A decade after the Rising, Agea is a Republic city on a changed Mars, where Reds have come up from the mines into camps and new towns."},6:{blurb:"Light Bringer. Virginia governs the Republic’s last bastion from Agea while the Society closes in."}};
if(SITES.hyperion)SITES.hyperion.eras={4:{blurb:"Iron Gold. Capital of the Republic: a Senate in the Forum, Sovereign Virginia in the Citadel of Light, a city rebuilt with Quicksilver’s money while the Syndicate rules below.",facts:[["Sovereign","Virginia au Augustus"],["Government","The Republic and its Senate"],["Underworld","The Syndicate"],["Scars","The Jackal’s bombs"]]},
  5:{blurb:"Dark Age. On the Day of Red Doves, Dancer is poisoned in the Forum and the Vox Populi seize the city; Virginia escapes, maimed."},6:{blurb:"Light Bringer. Hyperion under the Society’s siege."}};
if(SITES.lykos)SITES.lykos.eras={4:{blurb:"By Iron Gold, many Reds have left the mines for camps and towns on the surface, though the old colonies remain."}};
})();

/* ---- 50-fx.js ---- */
/* ===================== ANIMATIONS (battles and set pieces) ===================== */
let fxList=[];
const FX={},FXG={};/* FX: full scenes; FXG: quick previews on a globe */
function showBanner(t,s,e){const b=$("#banner");$("#bannerE").textContent=e||"The Chronicle";$("#bannerT").textContent=t;$("#bannerS").textContent=s||"";b.hidden=false;b.style.opacity=1;
  clearTimeout(showBanner._t);showBanner._t=setTimeout(()=>{b.style.opacity=0;setTimeout(()=>{b.hidden=true;},700);},6000);}
function playFx(name,quiet){const info=FX_VIEW[name]||{};let f=FX[name];
  if(mode==="globe"&&info.view==="site")f=FXG[name];if(!f)return;stopFx();
  if(!quiet)showBanner(info.title||name,info.sub||"",mode==="site"?curSite.name:cur?cur.name:"");
  const scene=mode==="site"?site3:glb;const g=new THREE.Group();scene.add(g);const inst=f(g);if(inst){inst.group=g;inst.scene=scene;inst.t=0;inst.name=name;fxList.push(inst);}else scene.remove(g);}
function stopFx(){fxList.forEach(f=>{if(f.dispose)f.dispose();if(f.group&&f.scene)f.scene.remove(f.group);});fxList=[];}
function fxPlaying(name){return fxList.some(f=>f.name===name);}
function updateFx(dt,now){if(!fxList.length)return;dt*=window.__fxScale||1;fxList=fxList.filter(f=>{f.t+=dt;const alive=f.update(dt,f.t)!==false&&f.t<(f.dur||30);if(!alive){if(f.dispose)f.dispose();if(f.group&&f.scene)f.scene.remove(f.group);}return alive;});}

/* ---------- particle helpers ---------- */
function Flashes(g){const list=[];return{list,
  add(tex,pos,size,dur,delay,grow){const s=glowSprite(tex,size*.2,0);s.position.copy(pos);g.add(s);list.push({s,size,dur,t:-(delay||0),grow:grow==null?1:grow});},
  update(dt){for(let i=list.length-1;i>=0;i--){const f=list[i];f.t+=dt;if(f.t<0)continue;const k=f.t/f.dur;if(k>=1){g.remove(f.s);list.splice(i,1);continue;}
    f.s.material.opacity=k<.12?k/.12:Math.pow(1-(k-.12)/.88,1.6);const sc=f.size*(.25+.75*Math.pow(Math.min(1,k*1.6),.5)*f.grow+(1-f.grow));f.s.scale.set(sc,sc,1);}}};}
function Beams(g){const list=[];return{list,
  add(a,b,color,dur,delay){const geo=new THREE.BufferGeometry().setFromPoints([a.clone(),b.clone()]);const m=new THREE.Line(geo,new THREE.LineBasicMaterial({color:col(color),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(m);list.push({m,dur,t:-(delay||0)});},
  update(dt){for(let i=list.length-1;i>=0;i--){const b=list[i];b.t+=dt;if(b.t<0)continue;const k=b.t/b.dur;if(k>=1){g.remove(b.m);b.m.geometry.dispose();list.splice(i,1);continue;}b.m.material.opacity=(1-k)*(.6+.4*Math.random());}}};}
/* one draw call for many glowing points */
const glowPtsMat=new THREE.ShaderMaterial({uniforms:{map:{value:GLOW_WHITE},scale:{value:600}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:"attribute float size;attribute vec4 rgba;varying vec4 vC;uniform float scale;void main(){vC=rgba;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=min(256.,size*scale/max(1.,-mv.z));gl_Position=projectionMatrix*mv;}",
  fragmentShader:"uniform sampler2D map;varying vec4 vC;void main(){vec4 t=texture2D(map,gl_PointCoord);gl_FragColor=vec4(vC.rgb*t.rgb,t.a*vC.a);}"});
function GlowPoints(g,cap){const pos=new Float32Array(cap*3),size=new Float32Array(cap),rgba=new Float32Array(cap*4);const geo=new THREE.BufferGeometry();
  geo.setAttribute("position",new THREE.BufferAttribute(pos,3));geo.setAttribute("size",new THREE.BufferAttribute(size,1));geo.setAttribute("rgba",new THREE.BufferAttribute(rgba,4));
  const m=glowPtsMat.clone();m.uniforms.map.value=GLOW_WHITE;const pts=new THREE.Points(geo,m);pts.frustumCulled=false;g.add(pts);
  return {pts,set(i,p,sz,r,gg,b,a){pos[i*3]=p.x;pos[i*3+1]=p.y;pos[i*3+2]=p.z;size[i]=sz;rgba[i*4]=r;rgba[i*4+1]=gg;rgba[i*4+2]=b;rgba[i*4+3]=a;},
    hide(i){rgba[i*4+3]=0;},flush(){geo.attributes.position.needsUpdate=true;geo.attributes.size.needsUpdate=true;geo.attributes.rgba.needsUpdate=true;},
    setScale(v){m.uniforms.scale.value=v;}};}
function pxScale(cam){return innerHeight/(2*Math.tan(cam.fov*Math.PI/360));}
/* streaks: fiery heads with glowing tails, falling along a path */
function Streaks(g,n,opts){const R=rng(opts.seed||7);const heads=[];const TAIL=8;const P=GlowPoints(g,n*(TAIL+1));
  for(let i=0;i<n;i++){const o=opts.spawn(R,i);heads.push(Object.assign({t:-o.delay,p:new THREE.Vector3()},o));}
  return{heads,update(dt,onLand){P.setScale(pxScale(opts.cam||camX));heads.forEach((h,i)=>{h.t+=dt;const k=h.t/h.dur;const base=i*(TAIL+1);
      if(k<0||k>1){for(let j=0;j<=TAIL;j++)P.hide(base+j);}
      else{const e=k*k*(.6+.4*k);h.p.lerpVectors(h.from,h.to,e);P.set(base,h.p,opts.size,1,.95,.8,1);
        const back=_T.copy(h.from).sub(h.to).normalize().multiplyScalar(opts.trail*(.35+k)/TAIL);
        for(let j=1;j<=TAIL;j++){const f=1-j/(TAIL+1);_S.copy(h.p).addScaledVector(back,j);P.set(base+j,_S,opts.size*(.35+.65*f),1,.45+.4*f,.15+.2*f,.85*f);}}
      if(k>1&&!h.landed){h.landed=true;if(onLand)onLand(h);}});P.flush();}};}

/* ---------- THE IRON RAIN over Agea ---------- */
FX.ironrain=g=>{setTod("night");sFly({target:[-700,900,150],r:4300,theta:1.5,phi:1.42});
  const F=Flashes(g),B=Beams(g);const R=rng(3);
  /* the fleet in orbit, high above */
  const ships=[];for(let i=0;i<7;i++){const s=makeShip(i===0?"dread":"torch",i===0?520:260);s.position.set(-7600-R()*1500,3900+R()*700,-1600+i*520);s.rotation.y=0;g.add(s);ships.push(s);}
  const N=200;const st=Streaks(g,N,{size:200,trail:900,seed:5,spawn:(R,i)=>{const tx=(R()-.5)*2600,tz=(R()-.5)*2000;const sx=tx-5200-R()*2600,sz=tz+(R()-.5)*1600;
    return {from:new THREE.Vector3(sx,2700+R()*1800,sz),to:new THREE.Vector3(tx,ground0(tx,tz)+8,tz),dur:3+R()*1.6,delay:.5+Math.floor(i/40)*1.6+R()*1.4};}});
  return {dur:19,update(dt,t){st.update(dt,h=>{F.add(GLOW_WARM,h.to.clone().setY(h.to.y+30),260+R()*160,1.1);if(R()<.35)F.add(GLOW_WHITE,h.to.clone().setY(h.to.y+20),120,.4);});
    if(R()<dt*6){const a=ships[(R()*ships.length)|0].position.clone();const b=new THREE.Vector3((R()-.5)*2400,200+R()*400,(R()-.5)*2000);B.add(a,b,0x9fd0ff,.35);F.add(GLOW_BLUE,b,300,.6);}
    /* the city's guns answer */
    if(R()<dt*3){const a=new THREE.Vector3((R()-.5)*2000,300,(R()-.5)*2000);const b=a.clone().add(new THREE.Vector3((R()-.5)*1500,4000,-2000));B.add(a,b,0xff8060,.25);}
    F.update(dt);B.update(dt);ships.forEach((s,i)=>s.position.x+=dt*(30+i*4));}};};
function ground0(x,z){return curSite&&curSite.ground?curSite.ground(x,z):0;}
/* Iron Rain preview on the Mars globe: streaks falling on Agea */
FXG.ironrain=g=>{const p=poiById["mars:agea"];const target=latLonVec(p.lat,p.lon,GR*1.003);const F=Flashes(g);const R=rng(9);
  const st=Streaks(g,70,{size:.16,trail:.8,seed:11,cam:camG,spawn:(R,i)=>{const t=latLonVec(p.lat+(R()-.5)*5,p.lon+(R()-.5)*5,GR*1.003);const n=t.clone().normalize();
      const side=new THREE.Vector3(0,1,0).cross(n).normalize();const from=t.clone().add(n.clone().multiplyScalar(2.2+R())).add(side.multiplyScalar(-1.2-R()*.6));
      return {from,to:t,dur:1.6+R()*.8,delay:R()*5};}});
  globe.add(g);
  return {dur:8,update(dt,t){st.update(dt,h=>F.add(GLOW_WARM,h.to,.35,.8));F.update(dt);},dispose(){globe.remove(g);}};};

/* ---------- GANYMEDE: the trap, and the burning of the yards ---------- */
FX.docktrap=g=>{setTod("day");const P=new THREE.Vector3(2300,240,-900);sFly({target:[2300,200,-900],r:3400,theta:.7,phi:1.1});
  const F=Flashes(g),B=Beams(g);const R=rng(21);const reactors=SITES.ganymede._reactors||[];
  const raiders=[];for(let i=0;i<10;i++){const s=makeShip("frigate",70);s.position.set(P.x-3000-R()*800,P.y+400+R()*600,P.z+(R()-.5)*1400);g.add(s);raiders.push(s);}
  const traps=[];for(let i=0;i<8;i++){const s=makeShip(i<2?"dread":"torch",i<2?380:200);s.position.set(P.x+2600+R()*900,P.y+800+R()*500,P.z-2200+(R()-.5)*1200);s.rotation.y=Math.PI;g.add(s);traps.push(s);}
  return {dur:16,update(dt,t){raiders.forEach((s,i)=>{if(t<5)s.position.x+=dt*520;});
    if(t>4.5&&t<7&&R()<dt*8){const r=reactors[(R()*3)|0];if(r){F.add(GLOW_WARM,r.position.clone(),700,1.2);r.material.opacity=Math.max(0,r.material.opacity-.25);}}
    if(t>7){traps.forEach(s=>{if(s.position.x>P.x+900)s.position.x-=dt*420;});
      if(R()<dt*10){const a=traps[(R()*traps.length)|0].position.clone(),b=raiders[(R()*raiders.length)|0].position.clone();B.add(a,b,0xffd27a,.3);F.add(GLOW_WHITE,b,160,.5);}}
    F.update(dt);B.update(dt);},dispose(){(SITES.ganymede._reactors||[]).forEach(r=>r.material.opacity=.8);}};};
FX.yardsburn=g=>{setTod("dusk");sFly({target:[0,0,0],r:9000,theta:.45,phi:1.12});
  const F=Flashes(g),B=Beams(g);const R=rng(31);
  const colossus=makeShip("dread",1600);colossus.position.set(-9000,2600,-2600);colossus.rotation.y=0;g.add(colossus);
  const chunks=[];
  return {dur:22,update(dt,t){if(colossus.position.x<-2000)colossus.position.x+=dt*1800;
    if(t>3.5&&R()<dt*16){const a=colossus.position.clone().add(new THREE.Vector3((R()-.5)*1200,-80,0));const x=-6000+((t-3.5)/14)*12000+(R()-.5)*1800;const b=new THREE.Vector3(x,(R()-.3)*300,(R()-.5)*700);
      B.add(a,b,0xff6a3a,.28);F.add(GLOW_WARM,b,900+R()*700,1.4);if(R()<.25)F.add(GLOW_WHITE,b,400,.4);
      if(R()<.35){const c=new THREE.Mesh(new THREE.BoxGeometry(160+R()*300,60+R()*80,120+R()*200),mats().metal);c.position.copy(b);g.add(c);const s=glowSprite(GLOW_RED,500,.8);c.add(s);chunks.push({c,v:new THREE.Vector3((R()-.5)*80,-60-R()*80,(R()-.5)*80),spin:new THREE.Vector3(R(),R(),R()).multiplyScalar(.6)});}}
    chunks.forEach(o=>{o.v.y-=dt*70;o.c.position.addScaledVector(o.v,dt);o.c.rotation.x+=o.spin.x*dt;o.c.rotation.z+=o.spin.z*dt;});
    F.update(dt);B.update(dt);}};};
FXG.docktrap=FXG.yardsburn=g=>{const F=Flashes(g);const R=rng(41);globe.add(g);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(GR*1.06,.05,8,160),new THREE.MeshBasicMaterial({color:col(0xff8a40),transparent:true,opacity:0}));ring.rotation.x=Math.PI/2;g.add(ring);
  return {dur:8,update(dt,t){ring.material.opacity=Math.min(.7,t*.3)*(1-Math.max(0,t-6)/2);if(R()<dt*14){const a=R()*TAU;F.add(GLOW_WARM,new THREE.Vector3(Math.cos(a)*GR*1.06,(R()-.5)*.05,Math.sin(a)*GR*1.06),.6+R()*.5,1);}F.update(dt);},dispose(){globe.remove(g);}};};

/* ---------- TAKING THE VANGUARD above Luna ---------- */
FX.vanguard=g=>{selectPoi("hyperion",true);gZoom.tz=10;const F=Flashes(g),B=Beams(g);const R=rng(51);
  const v=makeShip("dread",.3);g.add(v);
  const boats=[];for(let i=0;i<5;i++){const s=glowSprite(GLOW_WARM,.3,1);g.add(s);boats.push({s,from:latLonVec(1,32,GR*1.01),delay:.6+i*.25});}
  const pursuers=[];for(let i=0;i<9;i++){const s=makeShip("torch",.16);g.add(s);pursuers.push({s,off:(R()-.5)*1.2,lag:1.4+R()*.8});}
  return {dur:16,update(dt,t){const pos=new THREE.Vector3(1.3+t*.03,.35+Math.sin(t*.4)*.05,4.4);
    if(t>10){const k=(t-10);pos.add(new THREE.Vector3(k*k*.35,k*.08,-k*.1));}
    v.position.copy(pos);v.rotation.set(0,.25,0);
    if(v.userData.glow)v.userData.glow.scale.setScalar(t>10?.9:.25);
    const lp=globe.localToWorld(latLonVec(1,32,GR*1.01));
    boats.forEach(b=>{const k=Math.min(1,Math.max(0,(t-b.delay)/2.2));b.s.position.lerpVectors(lp,pos,k*k);b.s.material.opacity=k>0&&k<1?1:0;if(k>=1&&!b.hit){b.hit=true;F.add(GLOW_WHITE,pos.clone(),.8,.6);}});
    if(t>3.4&&t<8&&R()<dt*5)F.add(GLOW_WARM,pos.clone().add(new THREE.Vector3((R()-.5)*.6,(R()-.5)*.2,(R()-.5)*.6)),.5,.5);
    pursuers.forEach((p,i)=>{const k=Math.max(0,t-5);const pp=new THREE.Vector3(-3.4+k*.3+p.off,.3+p.off*.5,4.4+p.off*.4);p.s.position.copy(pp);p.s.lookAt(pos);p.s.rotateY(-Math.PI/2);p.s.visible=t>4;
      if(t>6&&R()<dt*1.5){B.add(pp,pos,0xff7a50,.25);F.add(GLOW_WARM,pos.clone(),.4,.3);}});
    F.update(dt);B.update(dt);}};};

/* ---------- THE BATTLE OF ILIUM over Jupiter ---------- */
FX.armada=g=>{gZoom.tz=10.5;gRot.auto=false;const F=Flashes(g),B=Beams(g);const R=rng(61);
  const C=new THREE.Vector3(1.4,.4,4.1);
  const colossus=makeShip("dread",.62);colossus.position.copy(C);colossus.rotation.y=Math.PI;g.add(colossus);
  const sword=[];for(let i=0;i<38;i++){const s=makeShip(R()<.15?"dread":"torch",R()<.15?.24:.12);s.position.copy(C).add(new THREE.Vector3((R()-.2)*2.2,(R()-.5)*1.3,(R()-.5)*1.4));s.rotation.y=Math.PI;g.add(s);sword.push(s);}
  const rising=[];for(let i=0;i<30;i++){const s=makeShip(R()<.12?"dread":"torch",R()<.12?.24:.12);s.position.set(-2.2-R()*1.4,.3+(R()-.5)*1.3,4.3+(R()-.5)*1.4);g.add(s);rising.push(s);}
  const pax=makeShip("dread",.36);pax.position.set(-1.9,.5,4.4);g.add(pax);
  const drills=[];for(let i=0;i<14;i++){const s=glowSprite(GLOW_WHITE,.12,0);g.add(s);drills.push({s,from:new THREE.Vector3(-2.2,.4+(R()-.5)*.6,4.2+(R()-.5)*.8),delay:6+R()*2.5});}
  const wings=new THREE.Group();g.add(wings);for(let i=0;i<120;i++){const s=glowSprite(R()<.5?GLOW_BLUE:GLOW_WARM,.04,.9);s.userData.ph=R()*TAU;s.userData.r=.3+R()*1.6;wings.add(s);}
  return {dur:20,update(dt,t){
    if(t<5.5){pax.position.lerp(C.clone().add(new THREE.Vector3(-.9,0,.2)),dt*.5);}
    if(t>5.5&&!pax.userData.blown){pax.userData.blown=true;for(let k=0;k<6;k++)F.add(k%2?GLOW_WHITE:GLOW_WARM,pax.position.clone().add(new THREE.Vector3((R()-.5)*.4,(R()-.5)*.2,(R()-.5)*.4)),1.2+R()*.8,1.6,k*.12);pax.visible=false;}
    drills.forEach(d=>{const k=Math.min(1,Math.max(0,(t-d.delay)/2));d.s.position.lerpVectors(d.from,C,k);d.s.material.opacity=k>0&&k<1?1:0;if(k>=1&&!d.hit){d.hit=true;F.add(GLOW_WARM,C.clone().add(new THREE.Vector3((R()-.5)*.8,(R()-.5)*.2,(R()-.5)*.4)),.5,.8);}});
    if(R()<dt*14){const a=(R()<.5?sword:rising)[(R()*30)|0];const b=(a&&sword.includes(a)?rising:sword)[(R()*30)|0];if(a&&b){B.add(a.position,b.position,sword.includes(a)?0xff8a60:0x9fd0ff,.3);if(R()<.3)F.add(GLOW_WARM,b.position.clone(),.5,.5);}}
    if(t>12)sword.forEach((s,i)=>{if(i%3===0){s.position.x+=dt*.6;}});
    if(t>13&&!colossus.userData.taken){colossus.userData.taken=true;F.add(GLOW_WHITE,C.clone(),1.4,1.4);}
    wings.children.forEach((s,i)=>{const a=s.userData.ph+t*1.4;s.position.set(-.3+Math.cos(a)*s.userData.r*1.4,.4+Math.sin(a*1.7)*.4,4.3+Math.sin(a)*s.userData.r*.6);});
    F.update(dt);B.update(dt);}};};

/* ---------- THE SIEGE OF LUNA: the Jackal's bombs ---------- */
FX.nukes=g=>{selectPoi("hyperion",true);gZoom.tz=9.5;const F=Flashes(g);const R=rng(71);globe.add(g);
  const sites=[[8,26],[-6,40],[14,10],[-18,22],[3,52],[22,38],[-12,6],[-26,48],[10,64],[-2,18],[28,20],[-30,30]];
  const rings=[];
  sites.forEach((p,i)=>{const v=latLonVec(p[0],p[1],GR*1.004);const up=latLonVec(p[0],p[1],GR*1.07);F.add(GLOW_WHITE,up,.8,2,1+i*.35);F.add(GLOW_WARM,up,1.6,4,1.15+i*.35);F.add(GLOW_RED,latLonVec(p[0],p[1],GR*1.14),.9,5,1.6+i*.35,.6);
    const m=new THREE.Mesh(new THREE.RingGeometry(.02,.05,48),new THREE.MeshBasicMaterial({color:col(0xffc080),transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
    m.position.copy(v.clone().multiplyScalar(1.001));m.lookAt(v.clone().multiplyScalar(2));g.add(m);rings.push({m,delay:1+i*.35});});
  /* Lilath's ship, then the Ash Lord's fleet ends it */
  const lil=makeShip("torch",.45);g.add(lil);lil.position.copy(latLonVec(18,32,GR*1.5));
  const B=Beams(g);
  return {dur:16,update(dt,t){const sp=selPoi;const lp=latLonVec(1,32,GR);
    rings.forEach(r=>{const k=(t-r.delay)/3;if(k<0||k>1){r.m.material.opacity=0;return;}r.m.scale.setScalar(1+k*7);r.m.material.opacity=(1-k)*.8;});
    if(t>9&&t<11.5&&R()<dt*12){const a=globe.worldToLocal(new THREE.Vector3(-3.5,(R()-.5)*1.4,4+(R()-.5)));B.add(a,lil.position,0x9fd0ff,.25);}
    if(t>11.5&&!lil.userData.dead){lil.userData.dead=true;F.add(GLOW_WHITE,lil.position.clone(),1.6,1.2);F.add(GLOW_WARM,lil.position.clone(),2.4,2);lil.visible=false;}
    F.update(dt);B.update(dt);},dispose(){globe.remove(g);}};};

/* globe previews map straight through for globe-native scenes */
FXG.vanguard=FX.vanguard;FXG.armada=FX.armada;FXG.nukes=FX.nukes;

/* ---- 51-fx-saga.js ---- */
/* ===================== SECOND-TRILOGY ANIMATIONS ===================== */
function hpos(fx,fy,lift){const [x,z]=HF(fx,fy);return new THREE.Vector3(x,Math.max(0,heliosGround(x,z))+(lift||0),z);}
/* ---------- Helios: Iron Rains ---------- */
function heliosRain(g,opts){setTod(opts.tod||"dusk");sFly(opts.cam);
  const F=Flashes(g);const R=rng(opts.seed||3);
  const fleet=[];for(let i=0;i<opts.ships;i++){const s=makeShip(i===0?"moonbreaker":i<3?"dread":"torch",i===0?520:i<3?380:260);const p=opts.fleetAt.clone().add(new THREE.Vector3((R()-.5)*5000,(R()-.2)*1200,(R()-.5)*3000));s.position.copy(p);s.lookAt(opts.target);s.rotateY(-Math.PI/2);g.add(s);fleet.push(s);}
  const st=Streaks(g,opts.n,{size:260,trail:1500,seed:opts.seed||5,spawn:(R,i)=>{const t=opts.target.clone().add(new THREE.Vector3((R()-.5)*opts.spread,0,(R()-.5)*opts.spread*1.4));t.y=Math.max(0,heliosGround(t.x,t.z))+10;
    const f=fleet[(R()*fleet.length)|0].position.clone().add(new THREE.Vector3((R()-.5)*800,-200,(R()-.5)*800));return {from:f,to:t,dur:3.5+R()*2,delay:.6+(i/opts.n)*9+R()*1.2};}});
  const B=Beams(g);
  return {dur:18,update(dt,t){st.update(dt,h=>{F.add(GLOW_WARM,h.to.clone().setY(h.to.y+60),700+R()*400,1.2);if(R()<.3)F.add(GLOW_WHITE,h.to.clone().setY(h.to.y+40),300,.4);});
    if(opts.defend&&R()<dt*6){const a=opts.target.clone().add(new THREE.Vector3((R()-.5)*opts.spread,0,(R()-.5)*opts.spread));a.y=Math.max(0,heliosGround(a.x,a.z));const b=fleet[(R()*fleet.length)|0].position;B.add(a,b,0x9fd0ff,.25);F.add(GLOW_WARM,b.clone(),400,.5);}
    F.update(dt);B.update(dt);}};}
FX.ashrain=g=>heliosRain(g,{seed:7,n:240,ships:9,spread:3200,target:hpos(.38,.62),fleetAt:hpos(.5,.2,7200),cam:{target:[-1200,600,600],r:12000,theta:.15,phi:1.05},defend:true});
FX.rainmerc=g=>heliosRain(g,{seed:9,n:200,ships:7,spread:2400,target:hpos(.4,.32),fleetAt:hpos(.55,.05,6800),cam:{target:[-600,400,-2200],r:10000,theta:-.1,phi:1.05},tod:"day",defend:true});
/* ---------- Helios: Angelia and Red Reach ---------- */
function blast(g,at,opts){const F=Flashes(g);const rings=[];
  F.add(GLOW_WHITE,at.clone().setY(at.y+200),opts.size*1.2,1.6);F.add(GLOW_WARM,at.clone().setY(at.y+300),opts.size*2,4,.2);
  for(let k=0;k<8;k++)F.add(k%2?GLOW_RED:GLOW_WARM,at.clone().setY(at.y+200+k*opts.size*.18),opts.size*(.7-k*.05),5+k*.4,.4+k*.25,.8);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.9,1,96).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:col(0xffd0a0),transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));ring.position.copy(at).setY(at.y+20);g.add(ring);
  return {F,ring};}
FX.angelia=g=>{const at=hpos(.804,.52);sFly({target:[at.x,0,at.z-1500],r:7000,theta:.2,phi:1.05});setTod("dusk");
  const b=blast(g,at,{size:1600});const sh=SITES.helios._shields||[],ch=SITES.helios._chain||[];
  return {dur:14,update(dt,t){b.F.update(dt);b.ring.scale.setScalar(80+t*900);b.ring.material.opacity=Math.max(0,.8-t*.1);
    sh.forEach(s=>{if(["pan","kaikos","priapos","kydon","angelia","eleusis","redreach"].includes(s.userData.id)){const k=t<3?1:t<6?(Math.random()<.5?1:0):0;s.visible=k>0&&ERA>=4;}});
    ch.forEach(l=>{l.visible=t<4&&Math.random()<.7&&ERA>=4;});},
    dispose(){sh.forEach(s=>s.visible=ERA>=4);ch.forEach(l=>l.visible=ERA>=4&&ERA<=5);}};};
FX.atomic=g=>{const at=hpos(.662,.372);sFly({target:[at.x,0,at.z],r:7400,theta:.35,phi:1.12});setTod("dusk");
  const b=blast(g,at,{size:2200});const stem=[];for(let k=0;k<10;k++){const s=glowSprite(GLOW_RED,500,0);g.add(s);stem.push(s);}
  return {dur:16,update(dt,t){b.F.update(dt);b.ring.scale.setScalar(120+t*1200);b.ring.material.opacity=Math.max(0,.8-t*.08);
    stem.forEach((s,k)=>{const h=Math.min(1,t/6);s.position.set(at.x,at.y+k*260*h+100,at.z);s.material.opacity=t>1?Math.max(0,.55-(t-8)*.06):0;s.scale.setScalar(500+k*60);});}};};
FX.storms=g=>{const S=SITES.helios;S._tog=S._tog||{};S._tog.storms=true;document.querySelectorAll('[data-tog=storms]').forEach(b=>b.setAttribute("aria-pressed",true));if(S.onToggle)S.onToggle("storms",true);
  sFly({target:[0,0,400],r:16000,theta:.1,phi:.95});return {dur:1,update(){return true;}};};
FX.flood=g=>{if(SITES.tyche._flood)SITES.tyche._flood();sFly({target:[200,200,400],r:7400,theta:Math.PI-.15,phi:1.18});return {dur:1,update(){return true;}};};
/* ---------- Heliopolis falls ---------- */
FX.heliofall=g=>{setTod("dusk");sFly({target:[600,300,0],r:8200,theta:.7,phi:1.12});SITES.heliopolis._emp&&setTimeout(()=>SITES.heliopolis._emp(),2500);
  const F=Flashes(g);const ring=new THREE.Mesh(new THREE.RingGeometry(.96,1,128).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:col(0x9fd0ff),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));ring.position.y=200;g.add(ring);
  const P0=new THREE.Vector3(600,10,-300);const riders=[];for(let i=0;i<160;i++){const s=glowSprite(GLOW_WARM,40,0);g.add(s);riders.push({s,d:i*.04+Math.random()*.2,lane:(Math.random()-.5)*60});}
  const R=rng(4);const falling=[];
  return {dur:22,update(dt,t){const te=t-2.5;
    if(te>0&&te<3){ring.scale.setScalar(200+te*2800);ring.material.opacity=Math.max(0,.9-te*.3);}else ring.material.opacity=0;
    if(te>.4&&falling.length<10){for(let i=0;i<4;i++){const s=makeShip("torch",420);s.position.set((R()-.5)*7000,3800+R()*800,-2400-R()*2400);s.rotation.set(R()*.4,Math.PI/2,R()*.6);g.add(s);falling.push({s,v:0,spin:(R()-.5)*.3});}}
    falling.forEach(f=>{f.v+=dt*120;f.s.position.y-=f.v*dt;f.s.rotation.z+=f.spin*dt;if(f.s.userData.glow)f.s.userData.glow.visible=false;if(f.s.position.y<0&&!f.done){f.done=true;F.add(GLOW_WARM,f.s.position.clone().setY(60),1400,2.2);f.s.visible=false;}});
    riders.forEach(r=>{const k=(t-6-r.d)/7;if(k<0||k>1){r.s.material.opacity=0;return;}r.s.material.opacity=.9;r.s.position.set(P0.x+k*1900,ground0(P0.x+k*1900,500)+12,500+r.lane);});
    if(t>8&&Math.random()<dt*5){const x=300+Math.random()*1800;F.add(GLOW_WARM,new THREE.Vector3(x,40,500+(Math.random()-.5)*200),300,.6);}
    F.update(dt);}};};
/* ---------- globe battles ---------- */
FX.caliban=g=>{gRot.auto=false;selectPoi("tyche",true);gZoom.tz=11;const F=Flashes(g),B=Beams(g);const R=rng(81);
  const tyche=()=>globe.localToWorld(latLonVec(HL.tyche[0],HL.tyche[1],GR*1.35));
  const white=[];for(let i=0;i<14;i++){const s=makeShip(i<3?"dread":"torch",i<3?.12:.07);g.add(s);white.push({s,off:new THREE.Vector3((R()-.5)*1.4,(R()-.5)*.6,(R()-.5)*1.4)});}
  const enemy=[];for(let i=0;i<14;i++){const s=makeShip(i<2?"dread":"torch",i<2?.12:.07);g.add(s);enemy.push({s,from:new THREE.Vector3(-8+(R()-.5)*2,2.5+(R()-.5)*2,6+(R()-.5)*2),off:new THREE.Vector3((R()-.5)*1.6,(R()-.5)*.8,(R()-.5)*1.6)});}
  const sun=glowSprite(GLOW_WARM,12,.9);sun.position.set(-9,3,7);g.add(sun);
  return {dur:16,update(dt,t){const T=tyche();white.forEach(w=>{w.s.position.copy(T).add(w.off);w.s.lookAt(0,0,0);if(w.dead){w.s.position.y-=w.dead*.1;w.dead+=dt;}});
    const k=Math.min(1,t/5);enemy.forEach(e=>{e.s.position.lerpVectors(e.from,T.clone().add(e.off).multiplyScalar(1.15),ease(k));e.s.lookAt(T);e.s.rotateY(-Math.PI/2);});
    if(t>4&&R()<dt*16){const a=enemy[(R()*enemy.length)|0].s.position,w=white[(R()*white.length)|0];B.add(a,w.s.position,0xffc070,.25);F.add(GLOW_WARM,w.s.position.clone(),.5,.5);if(R()<.08&&!w.dead){w.dead=.01;F.add(GLOW_WHITE,w.s.position.clone(),1.2,1.2);}}
    sun.material.opacity=.9;F.update(dt);B.update(dt);}};};
FX.pandora=g=>{gRot.auto=false;gZoom.tz=11;const F=Flashes(g);const R=rng(91);
  const P=new THREE.Vector3(2.2,1.2,4.2);const pan=makeShip("dread",.5);pan.position.copy(P);pan.rotation.y=.3;g.add(pan);
  const boats=[];for(let i=0;i<40;i++){const s=glowSprite(GLOW_RED,.12,0);g.add(s);boats.push({s,from:new THREE.Vector3(5+(R()-.5)*3,2+(R()-.5)*2,1+(R()-.5)*3),delay:R()*4});}
  const esc=glowSprite(GLOW_WHITE,.2,0);g.add(esc);const cim=()=>globe.localToWorld(latLonVec(-30,130,GR));
  return {dur:16,update(dt,t){boats.forEach(b=>{const k=Math.min(1,Math.max(0,(t-b.delay)/3));b.s.position.lerpVectors(b.from,P,k);b.s.material.opacity=k>0&&k<1?1:0;if(k>=1&&!b.hit){b.hit=true;F.add(GLOW_WARM,P.clone().add(new THREE.Vector3((R()-.5)*.6,(R()-.5)*.2,(R()-.5)*.4)),.35,.4);}});
    if(t>8&&t<9)F.add(GLOW_BLUE,P.clone(),.8,1.2);
    const k=Math.max(0,Math.min(1,(t-9)/5));esc.position.lerpVectors(P,cim(),k*k);esc.material.opacity=k>0&&k<1?1:0;if(k>=1&&!esc.userData.l){esc.userData.l=1;F.add(GLOW_WARM,cim(),.8,1.5);}
    F.update(dt);}};};
FX.phobosfall=g=>{gRot.auto=false;gZoom.tz=22;const F=Flashes(g),Bm=Beams(g);const R=rng(101);const ex=globeExtra;const sh=ex&&ex.userData.shield;
  const dest=[];for(let i=0;i<6;i++){const s=makeShip("destroyer",1.1);g.add(s);dest.push({s,from:new THREE.Vector3(14+i*1.2,(R()-.5)*3,6+(R()-.5)*3),delay:5+i*1.1});}
  let hp=1;
  return {dur:20,update(dt,t){if(t<12&&R()<dt*8){const from=new THREE.Vector3(30,(R()-.5)*8,10+(R()-.5)*8);const hit=from.clone().normalize().multiplyScalar(GR*2.35*(hp>0?1:.6)).applyAxisAngle(new THREE.Vector3(0,1,0),(R()-.5)*.6);Bm.add(from,hit,0xffffff,.12);F.add(GLOW_WHITE,hit,3.2,.7);F.add(GLOW_BLUE,hit,5,.5);if(hp>0)hp-=.03;}
    dest.forEach(d=>{const k=Math.min(1,Math.max(0,(t-d.delay)/3));const to=d.from.clone().normalize().multiplyScalar(GR*2.3);d.s.position.lerpVectors(d.from,to,k);d.s.lookAt(0,0,0);d.s.rotateY(Math.PI/2);if(k>=1&&!d.hit){d.hit=true;d.s.visible=false;F.add(GLOW_WARM,to,6,2);F.add(GLOW_WHITE,to,3,.8);hp-=.15;}});
    if(sh){sh.visible=hp>0?true:false;sh.material.uniforms.k.value=hp>0?.35+Math.random()*.5*(1-hp):0;}
    if(hp<=0&&R()<dt*10){const v=new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(GR*(1+R()*.6));F.add(GLOW_WARM,v,2.2,.9);}
    F.update(dt);Bm.update(dt);},dispose(){if(sh){sh.visible=ERA>=4;sh.material.uniforms.k.value=.35;}}};};
FX.kalyke=g=>{gRot.auto=false;gZoom.tz=12;const F=Flashes(g),B=Beams(g);const R=rng(111);
  const rim=[];for(let i=0;i<26;i++){const a=R()*TAU;const s=makeShip(i<4?"dread":"torch",i<4?.5:.3);s.position.set(Math.cos(a)*GR*(1.25+R()*.5),(R()-.5)*2.2,Math.sin(a)*GR*(1.25+R()*.5)+3);s.lookAt(0,s.position.y,0);g.add(s);rim.push(s);}
  const traitors=rim.slice(0,8);
  return {dur:16,update(dt,t){if(t>3&&R()<dt*18){const a=traitors[(R()*traitors.length)|0],b=rim[8+((R()*(rim.length-8))|0)];if(b.visible){B.add(a.position,b.position,0xff5040,.22);F.add(GLOW_WARM,b.position.clone(),1.2,.5);if(R()<.1){b.visible=false;F.add(GLOW_WHITE,b.position.clone(),3,1.4);}}}
    F.update(dt);B.update(dt);}};};
FX.venusdocks=g=>{setTod("day");sFly({target:[0,-200,0],r:13000,theta:.6,phi:1.25});const F=Flashes(g);const R=rng(121);
  const esc=makeShip("frigate",320);esc.position.set(-6000,-1500,0);g.add(esc);
  return {dur:18,update(dt,t){if(t>2&&t<14&&R()<dt*10){const x=-5600+((t-2)/12)*11200+(R()-.5)*1200;F.add(R()<.3?GLOW_WHITE:GLOW_WARM,new THREE.Vector3(x,(R()-.5)*1200,(R()-.5)*2200),1600+R()*1600,1.6);}
    esc.position.x+=dt*900;esc.position.y-=dt*40;F.update(dt);}};};
FX.garter=g=>{if(SITES.garter._burn)SITES.garter._burn();sFly({target:[0,0,0],r:11000,theta:.3,phi:1.1});return {dur:1,update(){return true;}};};
/* quick previews when hovering these events on a globe */
function globeRainPreview(lat,lon,color){return g=>{const target=latLonVec(lat,lon,GR*1.003);const F=Flashes(g);globe.add(g);
  const st=Streaks(g,70,{size:.16,trail:.8,seed:13,cam:camG,spawn:(R,i)=>{const t=latLonVec(lat+(R()-.5)*7,lon+(R()-.5)*7,GR*1.003);const n=t.clone().normalize();const side=new THREE.Vector3(0,1,0).cross(n).normalize();
    return {from:t.clone().add(n.clone().multiplyScalar(2.2+R())).add(side.multiplyScalar(-1.2-R()*.6)),to:t,dur:1.6+R()*.8,delay:R()*5};}});
  return {dur:8,update(dt,t){st.update(dt,h=>F.add(color||GLOW_WARM,h.to,.35,.8));F.update(dt);},dispose(){globe.remove(g);}};};}
function globeFlashPreview(lat,lon,size){return g=>{const F=Flashes(g);globe.add(g);const v=latLonVec(lat,lon,GR*1.06);F.add(GLOW_WHITE,v,size*.6,2);F.add(GLOW_WARM,v,size,4,.2);F.add(GLOW_RED,v,size*.7,5,.6);
  return {dur:6,update(dt){F.update(dt);},dispose(){globe.remove(g);}};};}
FXG.ashrain=globeRainPreview(HL.erebos[0]-4,HL.erebos[1]+4);FXG.rainmerc=globeRainPreview(HL.tyche[0],HL.tyche[1],GLOW_BLUE);
FXG.angelia=globeFlashPreview(HL.angelia[0],HL.angelia[1],1.2);FXG.atomic=globeFlashPreview(HL.redreach[0],HL.redreach[1],1.5);
FXG.heliofall=globeFlashPreview(HL.heliopolis[0],HL.heliopolis[1],.9);FXG.flood=globeFlashPreview(HL.tyche[0],HL.tyche[1],.6);FXG.storms=globeFlashPreview(HL.ladon[0],HL.ladon[1],.6);
FXG.caliban=FX.caliban;FXG.pandora=FX.pandora;FXG.phobosfall=FX.phobosfall;FXG.kalyke=FX.kalyke;
FXG.venusdocks=g=>{const F=Flashes(g);return {dur:8,update(dt,t){if(Math.random()<dt*8){const a=Math.random()*TAU;F.add(GLOW_WARM,new THREE.Vector3(Math.cos(a)*GR*1.32,0,Math.sin(a)*GR*1.32).applyMatrix4(globe.matrixWorld),.8,1);}F.update(dt);}};};
FXG.garter=g=>{const F=Flashes(g);globe.add(g);return {dur:8,update(dt,t){if(Math.random()<dt*20){const v=latLonVec((Math.random()-.5)*12,-180+Math.random()*360,GR*1.01);F.add(GLOW_RED,v,.5,1.4);}F.update(dt);},dispose(){globe.remove(g);}};};

/* ---- 60-ui.js ---- */
/* ===================== STATE ===================== */
let mode="system",cur=null,selPoi=null,selEvent=null,bookFilter=START_BOOK,paused=false,simT=0,anim=null,hoverSel=null,curSiteKey=null,selLm=null;
const SOC_PLANETS=new Set(["mercury","venus","earth","mars","jupiter","saturn","uranus","neptune"]);
const labelsEl=$("#labels"),tip=$("#tip"),dossier=$("#dossier"),track=$("#track"),idx=$("#index"),fade=$("#fade"),crumbs=$("#crumbs"),sitehud=$("#sitehud");

/* film grain */
(function(){const g=$("#grain");g.width=256;g.height=256;const c=g.getContext("2d");const d=c.createImageData(256,256);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}c.putImageData(d,0,0);
  g.style.width="100%";g.style.height="100%";g.style.imageRendering="pixelated";g.style.objectFit="cover";})();

/* ===================== INDEX ===================== */
function renderIndex(){let html='<h2 class="eyebrow">Worlds of the Society</h2>';let g=null;
  BODIES.filter(b=>b.parent).forEach(b=>{if(b.group!==g){g=b.group;html+='<div class="grp">'+({Core:"The Core",Mars:"Mars",Belt:"The Belt",Jupiter:"Jupiter · the Rim",Saturn:"Saturn · the far Rim",Uranus:"The outer dark",Neptune:"Neptune",Kuiper:"The Kuiper Belt",Scattered:"Scattered disc · beyond",Comets:"Comets"}[g])+'</div>';}
    const n=eventsFor(b.id).filter(e=>!bookFilter||e.book===bookFilter).length;html+='<button class="world'+(b.moon?" moon":"")+'" data-id="'+b.id+'"><span class="sw" style="background:'+b.sw+'"></span>'+esc(b.name)+'<span class="n">'+(n?n+" ev":"")+'</span></button>';});
  idx.innerHTML=html;}
renderIndex();
idx.addEventListener("click",e=>{const w=e.target.closest(".world");if(w){goBody(w.dataset.id);idx.classList.remove("open");$("#indexToggle").setAttribute("aria-expanded","false");}});
idx.addEventListener("mouseover",e=>{const w=e.target.closest(".world");if(w&&mode==="system")hoverBody(w.dataset.id,null);});
idx.addEventListener("mouseout",e=>{const w=e.target.closest(".world");if(w&&!w.contains(e.relatedTarget)&&mode==="system")hoverBody(null);});
$("#indexToggle").addEventListener("click",()=>{const o=idx.classList.toggle("open");$("#indexToggle").setAttribute("aria-expanded",o);});

/* ===================== SYSTEM LABELS ===================== */
const sysLabels={};
BODIES.forEach(b=>{const el=document.createElement("button");el.className="lbl"+(b.moon?" moon":"");el.textContent=b.name;el.dataset.id=b.id;labelsEl.appendChild(el);sysLabels[b.id]=el;
  el.addEventListener("mouseenter",ev=>hoverBody(b.id,ev));el.addEventListener("mousemove",ev=>placeTip(ev.clientX,ev.clientY));
  el.addEventListener("mouseleave",()=>hoverBody(null));el.addEventListener("click",()=>clickBody(b.id));});

/* ===================== TIMELINE ===================== */
(function(){let html="";[1,2,3,4,5,6].forEach(k=>{html+='<div class="book" data-book="'+k+'"><div class="book-t" style="color:var(--b'+k+')"><i>'+BOOKS[k].n+'</i><span style="color:var(--muted)">'+BOOKS[k].title+'</span></div><div class="evs">';
  EVENTS.filter(e=>e.book===k).forEach(e=>{html+='<button class="ev" data-id="'+e.id+'" style="--c:var(--b'+k+')"><span class="d"></span><span class="tt">'+esc(e.title)+(e.fx?'<span class="fx" title="Animated">▶</span>':'')+'</span><span class="pl">'+esc(placeName(e))+'</span></button>';});
  html+='</div></div>';});track.innerHTML=html;})();
const evEls={};track.querySelectorAll(".ev").forEach(el=>evEls[el.dataset.id]=el);
track.addEventListener("mouseover",e=>{const el=e.target.closest(".ev");if(!el)return;const ev=EV[el.dataset.id];hoverSel={body:ev.body,poi:ev.poi,event:ev.id,lm:ev.lm};applyHL(false);showTipEvent(ev,el);
  if(ev.fx&&mode==="globe"&&cur){const info=FX_VIEW[ev.fx];const here=info.view==="site"?cur.id===ev.body:cur.id===info.body;if(here&&!fxPlaying(ev.fx))playFx(ev.fx,true);}});
track.addEventListener("mouseout",e=>{const el=e.target.closest(".ev");if(el&&!el.contains(e.relatedTarget)){hoverSel=null;applyHL(false);hideTip();}});
track.addEventListener("click",e=>{const el=e.target.closest(".ev");if(el)gotoEvent(EV[el.dataset.id],true);});
track.addEventListener("wheel",e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){track.scrollLeft+=e.deltaY;e.preventDefault();}},{passive:false});
function syncBookUI(){document.querySelectorAll(".seg button").forEach(x=>x.setAttribute("aria-pressed",+x.dataset.book===bookFilter));
  track.querySelectorAll(".book").forEach(bk=>bk.hidden=!!bookFilter&&+bk.dataset.book!==bookFilter);
  $("#eraName").textContent=bookFilter?"Book "+BOOKS[bookFilter].n+" · "+BOOKS[bookFilter].title:"All six books · spoilers";
  $("#spoilNote").innerHTML=bookFilter?'<span class="lg">Spoilers are shown through the selected book.</span><span class="sm">Spoilers through Book '+BOOKS[bookFilter].n+'</span>':'<span class="lg">All six books · spoilers: everything through Light Bringer is shown.</span><span class="sm">All six books · spoilers</span>';
  document.body.classList.toggle("all-books",!bookFilter);}
function selectBook(b){bookFilter=b;saveBook(b);setEra(bookFilter||6);syncBookUI();renderDossier();applyHL(false);}
document.querySelectorAll(".seg button").forEach(b=>b.addEventListener("click",()=>selectBook(+b.dataset.book)));
syncBookUI();
$("#pause").addEventListener("click",e=>{paused=!paused;e.currentTarget.textContent=paused?"Resume orbits":"Pause orbits";e.currentTarget.setAttribute("aria-pressed",paused);});

/* ===================== HIGHLIGHT ===================== */
function matches(ev,sel){return ev.body===sel.body&&(!sel.poi||ev.poi===sel.poi)&&(!sel.lm||ev.lm===sel.lm);}
function applyHL(scroll){
  const base=mode==="site"&&curSite?{body:curSite.body,poi:curSite.poi,pois:curSite.pois}:mode==="globe"&&cur?{body:cur.id}:null;
  const inBase=ev=>!base||(ev.body===base.body&&(!base.poi||ev.poi===base.poi||(base.pois&&base.pois.includes(ev.poi))));
  let first=null;
  EVENTS.forEach(ev=>{const el=evEls[ev.id];let hl=false,dim=false;
    if(hoverSel&&!hoverSel.event){hl=matches(ev,hoverSel);dim=!hl;}
    else if(hoverSel&&hoverSel.event){hl=ev.id===hoverSel.event;dim=base?!inBase(ev)&&!hl:false;}
    else if(base){dim=!inBase(ev);hl=(selPoi&&mode==="globe"&&ev.poi===selPoi&&ev.body===base.body)||(selLm&&mode==="site"&&ev.lm===selLm&&inBase(ev));}
    if(selEvent===ev.id)hl=true;
    el.classList.toggle("hl",hl);el.classList.toggle("dim",dim);if(hl&&!first&&!el.closest(".book").hidden)first=el;});
  if(scroll&&first){const r=first.getBoundingClientRect(),tr=track.getBoundingClientRect();if(r.left<tr.left+10||r.right>tr.right-10)track.scrollTo({left:first.offsetLeft-track.offsetLeft-40,behavior:"smooth"});}
  Object.values(objs).forEach(o=>{o.hlT=hoverSel&&hoverSel.body===o.b.id?1:0;});
  Object.keys(sysLabels).forEach(id=>sysLabels[id].classList.toggle("hot",!!hoverSel&&hoverSel.body===id));
  idx.querySelectorAll(".world").forEach(w=>w.classList.toggle("hot",!!hoverSel&&hoverSel.body===w.dataset.id));
  poiLabels.forEach(l=>l.el.classList.toggle("hot",!!hoverSel&&cur&&hoverSel.body===cur.id&&hoverSel.poi===l.p.id));
  siteLabels.forEach(l=>l.el.classList.toggle("hot",!!hoverSel&&hoverSel.lm===l.lm.id));
  dossier.querySelectorAll(".place").forEach(pl=>pl.classList.toggle("hot",!!hoverSel&&((pl.dataset.poi&&hoverSel.poi===pl.dataset.poi)||(pl.dataset.lm&&hoverSel.lm===pl.dataset.lm))));
}

/* ===================== TOOLTIP ===================== */
function placeTip(x,y){if(tip.hidden)return;const w=tip.offsetWidth,h=tip.offsetHeight,W=innerWidth,H=innerHeight;
  let l=x+18,t=y+18;if(l+w>W-12)l=x-w-18;if(l<12)l=12;if(t+h>H-12)t=y-h-18;if(t<12)t=12;tip.style.left=l+"px";tip.style.top=t+"px";}
function hideTip(){tip.hidden=true;}
function showTipBody(b,ev){const ne=eventsFor(b.id).filter(e=>!bookFilter||e.book===bookFilter).length,np=(POIS[b.id]||[]).filter(poiVisible).length;
  tip.innerHTML='<p class="eyebrow">'+esc(bodyF(b,"epithet"))+'</p><h3>'+esc(b.name)+'</h3>'+(b.control!=="—"?'<div class="meta">Held by <b>'+esc(bodyF(b,"control"))+'</b></div>':'')+'<p>'+esc(bodyF(b,"blurb"))+'</p>'+
   (b.kind==="sun"?'':'<div class="meta">'+ne+' event'+(ne===1?'':'s')+' · '+np+' place'+(np===1?'':'s')+'</div><div class="cta">Click to descend</div>');
  tip.hidden=false;if(ev)placeTip(ev.clientX,ev.clientY);}
function setEra(e){const changed=e!==ERA;ERA=e;
  if(!changed)return;applyEraTextures();renderIndex();if(mode==="globe"&&cur){buildGlobe(cur);buildPoiLabels();setModeLabels();}
  if(mode==="site"&&curSite&&curSite.onEra)curSite.onEra(ERA);}
function evListMeta(evs){return evs.length?evs.map(e=>BOOKS[e.book].n+' · '+esc(e.title)).join('<br>'):'No events in this filter';}
function showTipPoi(p,x,y){const evs=eventsFor(p.body,p.id).filter(e=>!bookFilter||e.book===bookFilter);
  tip.innerHTML='<p class="eyebrow">'+esc(byId[p.body].name)+'</p><h3>'+esc(p.name)+'</h3><p>'+esc(poiDesc(p))+'</p><div class="meta">'+evListMeta(evs)+'</div>'+(p.site&&SITES[p.site]?'<div class="cta">Click to descend into '+esc(p.name)+'</div>':'');
  tip.hidden=false;placeTip(x,y);}
function showTipLm(lm,x,y){const evs=siteEvents().filter(e=>e.lm===lm.id);
  tip.innerHTML='<p class="eyebrow">'+esc(curSite.name)+'</p><h3>'+esc(lm.name)+'</h3><p>'+esc(lm.desc)+'</p>'+(evs.length?'<div class="meta">'+evListMeta(evs)+'</div>':'')+'<div class="cta">Click to fly there</div>';
  tip.hidden=false;placeTip(x,y);}
function showTipEvent(e,el){const r=el.getBoundingClientRect();
  tip.innerHTML='<p class="eyebrow">Book '+BOOKS[e.book].n+' · '+BOOKS[e.book].title+'</p><h3>'+esc(e.title)+'</h3><div class="meta"><b>'+esc(placeName(e))+'</b>'+(e.poi?' · '+esc(byId[e.body].name):'')+'</div><p>'+esc(e.text)+'</p>'+(e.fx?'<div class="cta">▶ Click to watch</div>':'<div class="cta">Click to go there</div>');
  tip.hidden=false;const h=tip.offsetHeight;let l=Math.min(Math.max(12,r.left),innerWidth-tip.offsetWidth-12);tip.style.left=l+"px";tip.style.top=Math.max(12,r.top-h-12)+"px";}

/* ===================== POINTER ===================== */
function hoverBody(id,ev){if(id){hoverSel={body:id,poi:null};showTipBody(byId[id],ev);}else{hoverSel=null;hideTip();}applyHL(!!id);}
function clickBody(id){descend(id);}
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
const ptrs=new Map();let drag=null,pinch0=null,lastHover=null;
function pick(x,y){const r=canvas.getBoundingClientRect();mv.set((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1);
  if(mode==="system"){ray.setFromCamera(mv,camS);const hs=ray.intersectObjects(hitList,false);if(!hs.length)return null;
    hs.sort((a,b)=>(byId[b.object.userData.id].moon?1:0)-(byId[a.object.userData.id].moon?1:0)||a.distance-b.distance);return hs[0].object.userData.id;}
  return null;}
canvas.addEventListener("contextmenu",e=>e.preventDefault());
canvas.addEventListener("pointerdown",e=>{if(mode==="site"&&WAR.active&&WAR.down(e))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.setPointerCapture(e.pointerId);
  if(ptrs.size===1)drag={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,moved:false,pan:WAR.active?e.button===2:(e.button===2||e.button===1||e.shiftKey||e.ctrlKey||e.altKey)};
  if(ptrs.size===2){const a=[...ptrs.values()];pinch0={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),ang:Math.atan2(a[1].y-a[0].y,a[1].x-a[0].x),r:ctl.r,gz:gZoom.tz,sr:sctl.tr,th:sctl.tth,cx:(a[0].x+a[1].x)/2,cy:(a[0].y+a[1].y)/2};drag=null;}
  gRot.auto=false;});
canvas.addEventListener("pointermove",e=>{
  if(mode==="site"&&WAR.active&&WAR.move(e))return;
  if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch0&&ptrs.size===2){const a=[...ptrs.values()];const d=Math.max(1,Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y));const ratio=pinch0.d/d;
    if(mode==="system")ctl.r=clampR(pinch0.r*ratio);else if(mode==="globe")gZoom.tz=Math.min(gZoom.max,Math.max(gZoom.min,pinch0.gz*ratio));
    else{sctl.tr=Math.min(sctl.maxR,Math.max(sctl.minR,pinch0.sr*ratio));const ang=Math.atan2(a[1].y-a[0].y,a[1].x-a[0].x);sctl.tth=pinch0.th-(ang-pinch0.ang);
      const cx=(a[0].x+a[1].x)/2,cy=(a[0].y+a[1].y)/2;sPan(cx-pinch0.cx,cy-pinch0.cy);pinch0.cx=cx;pinch0.cy=cy;}
    return;}
  if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;
    if(Math.abs(e.clientX-drag.sx)+Math.abs(e.clientY-drag.sy)>5){if(!drag.moved){drag.moved=true;canvas.classList.add("dragging");hideTip();}}
    if(drag.moved){if(mode==="system"){if(drag.pan&&!anim)sysPan(dx,dy);else{ctl.theta-=dx*.005;ctl.phi=Math.min(3.08,Math.max(.06,ctl.phi-dy*.005));}}
      else if(mode==="globe"){const k=.006*gZoom.z/12.5;gRot.ty+=dx*k;gRot.tx=Math.min(1.52,Math.max(-1.52,gRot.tx+dy*k));}
      else{if(drag.pan)sPan(dx,dy);else{siteTour=false;sctl.tth-=dx*.006;sctl.tph=Math.min(1.54,Math.max(.08,sctl.tph-dy*.005));}}}
    return;}
  if(e.pointerType==="mouse"&&mode==="system"&&!anim){const id=pick(e.clientX,e.clientY);canvas.classList.toggle("pointing",!!id);
    if(id!==lastHover){lastHover=id;hoverBody(id,e);}else if(id)placeTip(e.clientX,e.clientY);}
});
function endPtr(e){if(mode==="site"&&WAR.active&&WAR.up(e)){ptrs.delete(e.pointerId);return;}ptrs.delete(e.pointerId);if(ptrs.size<2)pinch0=null;
  if(drag&&!drag.moved&&ptrs.size===0&&mode==="system"&&!anim){const id=pick(e.clientX,e.clientY);if(id)clickBody(id);}
  if(ptrs.size===0){drag=null;canvas.classList.remove("dragging");}}
canvas.addEventListener("pointerup",endPtr);canvas.addEventListener("pointercancel",endPtr);
canvas.addEventListener("pointerleave",()=>{if(mode==="system"&&lastHover){lastHover=null;hoverBody(null);}});
function clampR(r){return Math.min(1500,Math.max(4,r));}
/* pan the solar system view across the orbital plane */
function sysPan(dx,dy){ctl.follow=null;const s=ctl.r*.0018;const fx=Math.cos(ctl.theta),fz=-Math.sin(ctl.theta),bx=Math.sin(ctl.theta),bz=Math.cos(ctl.theta);
  ctl.target.x+=(-dx*fx-dy*bx)*s;ctl.target.z+=(-dx*fz-dy*bz)*s;const L=Math.hypot(ctl.target.x,ctl.target.z);if(L>700){ctl.target.x*=700/L;ctl.target.z*=700/L;}}
/* double-click in a scene: fly to the spot under the cursor */
function siteGroundHit(x,y){const r=canvas.getBoundingClientRect();mv.set((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1);ray.setFromCamera(mv,camX);
  const o=ray.ray.origin,d=ray.ray.direction;const G=curSite&&curSite.ground;const far=sctl.r*6+4000;
  if(!G||G(o.x,o.z)<-1e6){if(Math.abs(d.y)<1e-4)return null;const t=(sctl.target.y-o.y)/d.y;return t>0?o.clone().addScaledVector(d,t):null;}
  let prev=0;const step=Math.max(4,sctl.r/120);for(let t=step;t<far;t+=step*(1+t/(sctl.r*2))){const p=o.clone().addScaledVector(d,t);if(p.y<=G(p.x,p.z)){
      let a=prev,b=t;for(let i=0;i<12;i++){const m=(a+b)/2;const q=o.clone().addScaledVector(d,m);if(q.y<=G(q.x,q.z))b=m;else a=m;}return o.clone().addScaledVector(d,b);}prev=t;}
  return null;}
canvas.addEventListener("dblclick",e=>{if(WAR.active)return;if(mode==="site"){const p=siteGroundHit(e.clientX,e.clientY);if(!p)return;const L=Math.hypot(p.x,p.z);if(L>sctl.bounds*1.05)return;
    siteTour=false;sctl.tt.copy(p).setY(p.y+(curSite.targetLift||0));sctl.tr=Math.max(sctl.minR,sctl.tr*.6);}
  else if(mode==="system"&&!pick(e.clientX,e.clientY))flyHome();});
canvas.addEventListener("wheel",e=>{e.preventDefault();const k=Math.exp(Math.max(-60,Math.min(60,e.deltaY))*.0016);
  if(mode==="system")ctl.r=clampR(ctl.r*k);else if(mode==="globe")gZoom.tz=Math.min(gZoom.max,Math.max(gZoom.min,gZoom.tz*Math.exp(e.deltaY*.001)));
  else sctl.tr=Math.min(sctl.maxR,Math.max(sctl.minR,sctl.tr*k));},{passive:false});
addEventListener("keydown",e=>{if(e.target.closest&&e.target.closest("input,textarea"))return;if(mode==="site"&&WAR.active&&WAR.key(e))return;
  if(e.key==="Escape"){if(mode==="site")leaveSite();else if(mode==="globe")ascend();}
  const k=e.key.toLowerCase();if(k==="h"){toggleMapOnly();return;}
  if(mode==="site"){const s=60;if(k==="arrowleft"||k==="a")sPan(s,0);if(k==="arrowright"||k==="d")sPan(-s,0);if(k==="arrowup"||k==="w")sPan(0,s);if(k==="arrowdown"||k==="s")sPan(0,-s);
    if(k==="q")sctl.tth+=.15;if(k==="e")sctl.tth-=.15;if(k==="r")sctl.tph=Math.max(.08,sctl.tph-.12);if(k==="f")sctl.tph=Math.min(1.54,sctl.tph+.12);if(k==="="||k==="+")sctl.tr=Math.max(sctl.minR,sctl.tr*.8);if(k==="-")sctl.tr=Math.min(sctl.maxR,sctl.tr*1.25);}
  else if(mode==="system"&&!anim){const s=40;if(k==="arrowleft"||k==="a")sysPan(s,0);if(k==="arrowright"||k==="d")sysPan(-s,0);if(k==="arrowup"||k==="w")sysPan(0,s);if(k==="arrowdown"||k==="s")sysPan(0,-s);if(k==="q")ctl.theta+=.12;if(k==="e")ctl.theta-=.12;}
  else if(mode==="globe"){if(k==="arrowleft"||k==="a")gRot.ty-=.15;if(k==="arrowright"||k==="d")gRot.ty+=.15;if(k==="arrowup"||k==="w")gRot.tx=Math.max(-1.52,gRot.tx-.12);if(k==="arrowdown"||k==="s")gRot.tx=Math.min(1.52,gRot.tx+.12);gRot.auto=false;}});
/* ---- panels: collapse, map-only ---- */
const B=document.body;
function setCls(c,on){B.classList.toggle(c,on);}
$("#idxCol").addEventListener("click",()=>{const h=!B.classList.contains("hide-index");setCls("hide-index",h);$("#idxCol").setAttribute("aria-expanded",!h);syncMapOnly();});
$("#dosCol").addEventListener("click",()=>{const h=!B.classList.contains("hide-dossier");setCls("hide-dossier",h);$("#dosCol").setAttribute("aria-expanded",!h);syncMapOnly();});
$("#chronMin").addEventListener("click",()=>{const h=!B.classList.contains("hide-chron");setCls("hide-chron",h);$("#chronMin").setAttribute("aria-expanded",!h);$("#chronMin").textContent=h?"▴ Show":"▾ Hide";syncMapOnly();});
function syncMapOnly(){const all=["hide-index","hide-dossier","hide-chron"].every(c=>B.classList.contains(c));$("#mapOnly").setAttribute("aria-pressed",all);setCls("map-only",all);
  $("#idxCol").setAttribute("aria-expanded",!B.classList.contains("hide-index"));$("#dosCol").setAttribute("aria-expanded",!B.classList.contains("hide-dossier"));
  const hc=B.classList.contains("hide-chron");$("#chronMin").setAttribute("aria-expanded",!hc);$("#chronMin").textContent=hc?"▴ Show":"▾ Hide";}
function toggleMapOnly(){const on=$("#mapOnly").getAttribute("aria-pressed")!=="true";["hide-index","hide-dossier","hide-chron"].forEach(c=>setCls(c,on));syncMapOnly();hideTip();}
$("#mapOnly").addEventListener("click",toggleMapOnly);
new MutationObserver(()=>{$("#dosCol").hidden=dossier.hidden;}).observe(dossier,{attributes:true,attributeFilter:["hidden"]});
const NAVHINT={system:"<b>Drag</b> to turn · <b>right-drag</b> or <b>Shift-drag</b> to pan · <b>scroll</b> to zoom · <b>double-click</b> space to recenter · <b>H</b> hides panels",
  globe:"<b>Drag</b> to spin the world, over the poles too · <b>scroll</b> to zoom · <b>WASD</b> · click a place",
  site:"<b>Drag</b> to look around · <b>right-drag</b> or <b>Shift-drag</b> to move · <b>double-click</b> to fly there · <b>WASD</b> · <b>Q/E</b> turn · <b>R/F</b> tilt"};
let navT=null,navSeen={};function showNavHint(m){const h=$("#navhint");if(navSeen[m]>=2)return;navSeen[m]=(navSeen[m]||0)+1;h.innerHTML=NAVHINT[m];h.hidden=false;h.classList.remove("gone");clearTimeout(navT);navT=setTimeout(()=>h.classList.add("gone"),6500);}

/* ===================== TRANSITIONS ===================== */
function flyHome(){ctl.follow=null;anim={t0:performance.now(),dur:1100,from:{tg:ctl.target.clone(),r:ctl.r,th:ctl.theta,ph:ctl.phi},to:{tg:new THREE.Vector3(),r:home.r,th:ctl.theta,ph:home.phi},done:()=>{anim=null;}};}
function fadeTo(eyebrow,name,fn,hold){$("#fadeE").textContent=eyebrow;$("#fadeN").textContent=name;fade.classList.add("on");
  setTimeout(()=>{fn();setTimeout(()=>fade.classList.remove("on"),hold||140);},400);}
function goBody(id){const b=byId[id];if(!b)return;if(mode==="system")descend(id);else switchGlobe(b);}
function descend(id){if(anim)return;const b=byId[id];if(!b)return;hideTip();hoverSel=null;
  if(mode!=="system"){switchGlobe(b);return;}
  anim={t0:performance.now(),dur:1300,follow:id,from:{tg:ctl.target.clone(),r:ctl.r,th:ctl.theta,ph:ctl.phi},to:{r:b.size*(b.moon?7:5),th:ctl.theta+.35,ph:Math.min(ctl.phi,1.15)},done:()=>switchGlobe(b)};}
function setModeLabels(){Object.values(sysLabels).forEach(l=>l.hidden=mode!=="system");poiLabels.forEach(l=>l.el.hidden=mode!=="globe");siteLabels.forEach(l=>l.el.hidden=mode!=="site");}
function switchGlobe(b,after){const fromSite=mode==="site";
  fadeTo(fromSite?"Returning to orbit":b.moon?"Approaching "+byId[b.parent].name+" · moon":"Entering orbit",b.name,()=>{
    stopFx();if(fromSite){clearSite();curSite=null;curSiteKey=null;}
    buildGlobe(b);cur=b;mode="globe";selPoi=null;selEvent=null;selLm=null;gRot.auto=!fromSite;
    if(!fromSite){gRot.tx=gRot.x=.18;gRot.y=gRot.ty=-.6;}
    const zf={phobos:1.75,venus:1.15}[b.id]||1;gZoom.max=16*zf;gZoom.z=gZoom.tz=(!isMob()?12.5:15)*zf;renderer.toneMappingExposure=1.05;
    if(!fromSite){const vp=(POIS[b.id]||[]).filter(poiVisible);const p0=vp.find(p=>p.site)||vp[0];if(p0){const v=latLonVec(p0.lat,p0.lon,GR);gRot.y=gRot.ty=Math.atan2(-v.x,v.z)+.5;gRot.x=gRot.tx=Math.max(-1,Math.min(1,Math.atan2(v.y,Math.hypot(v.x,v.z))));}}
    buildPoiLabels();renderDossier();dossier.hidden=false;sitehud.hidden=true;setModeLabels();showNavHint("globe");
    anim=null;applyHL(true);renderCrumbs();resize();if(after)after();});}
function ascend(){if(mode!=="globe")return;stopFx();const id=cur.id;
  fadeTo("Leaving",cur.name,()=>{mode="system";cur=null;selPoi=null;selEvent=null;dossier.hidden=true;clearPoiLabels();setModeLabels();
    ctl.follow=null;const o=objs[id];ctl.target.copy(o.pos);renderer.toneMappingExposure=1.05;
    anim={t0:performance.now()+200,dur:1300,from:{tg:o.pos.clone(),r:byId[id].size*6,th:ctl.theta,ph:ctl.phi},to:{tg:new THREE.Vector3(),r:home.r,th:ctl.theta-.2,ph:home.phi},done:()=>{anim=null;}};
    applyHL(false);renderCrumbs();});}
function enterSite(key,focus,after){const S=SITES[key];if(!S)return;hideTip();hoverSel=null;
  if(S.preload&&!S._ready){$("#fadeE").textContent="Charting";$("#fadeN").textContent=S.name;fade.classList.add("on");S.preload().then(()=>{S._ready=true;enterSite(key,focus,after);});return;}
  fadeTo("Descending to",S.name,()=>{stopFx();if(mode==="globe")clearPoiLabels();
    if(!cur||cur.id!==S.body){cur=byId[S.body];}
    mode="site";curSiteKey=key;selLm=null;selEvent=null;if(S._tog)Object.keys(S._tog).forEach(k=>S._tog[k]=false);loadSite(key);buildSiteLabels();
    if(focus){const lm=S.landmarks.find(l=>l.id===focus);if(lm){selLm=lm.id;sFly(lm.cam);}}
    renderDossier();dossier.hidden=false;renderSiteHud();setModeLabels();showNavHint("site");applyHL(true);renderCrumbs();resize();if(after)after();},260);}
function leaveSite(){if(mode!=="site")return;const b=byId[curSite.body];const poi=curSite.poi;
  switchGlobe(b,()=>{if(poi)selectPoi(poi,true);});}
function toSystem(){if(mode==="site"){stopFx();clearSite();curSite=null;curSiteKey=null;mode="globe";}if(mode==="globe")ascend();}
let beltPulse=0;
function gotoEvent(ev,fromTimeline){hideTip();selEvent=ev.id;
  if(ev.body==="belt"){if(mode!=="system")toSystem();else flyHome();beltPulse=4;showBanner(ev.title,ev.where,"Book "+BOOKS[ev.book].n);applyHL(false);return;}
  const fx=ev.fx&&FX_VIEW[ev.fx];
  if(fx&&fx.view==="site"){if(mode==="site"&&curSiteKey===fx.site){renderDossier();applyHL(true);playFx(ev.fx);}else enterSite(fx.site,null,()=>{selEvent=ev.id;renderDossier();applyHL(true);playFx(ev.fx);});return;}
  if(fx&&fx.view==="globe"){const go=()=>{selEvent=ev.id;renderDossier();applyHL(true);playFx(ev.fx);};if(mode==="globe"&&cur.id===fx.body)go();else if(mode==="system"){descendThen(fx.body,go);}else switchGlobe(byId[fx.body],go);return;}
  const p=ev.poi&&poiById[ev.body+":"+ev.poi];
  if(p&&p.site&&SITES[p.site]){const focus=ev.lm||p.focus;if(mode==="site"&&curSiteKey===p.site){const lm=curSite.landmarks.find(l=>l.id===focus);if(lm){selLm=lm.id;sFly(lm.cam);}renderDossier();applyHL(true);}
    else enterSite(p.site,focus,()=>{selEvent=ev.id;renderDossier();applyHL(true);});return;}
  const act=()=>{selEvent=ev.id;if(ev.poi)selectPoi(ev.poi,true);else{selPoi=null;renderDossier();}applyHL(true);
    const it=dossier.querySelector('.evitem[data-id="'+ev.id+'"]');if(it)it.scrollIntoView({block:"nearest",behavior:"smooth"});};
  if(mode==="globe"&&cur.id===ev.body){act();return;}
  if(mode==="system")descendThen(ev.body,act);else switchGlobe(byId[ev.body],act);}
function descendThen(id,fn){const b=byId[id];if(anim)return;anim={t0:performance.now(),dur:1100,follow:id,from:{tg:ctl.target.clone(),r:ctl.r,th:ctl.theta,ph:ctl.phi},to:{r:b.size*(b.moon?7:5),th:ctl.theta+.35,ph:Math.min(ctl.phi,1.15)},done:()=>switchGlobe(b,fn)};}

/* ===================== CRUMBS ===================== */
function renderCrumbs(){let h='<button data-c="sys">Solar System</button>';
  if(mode!=="system"&&cur){if(cur.moon)h+='<i>›</i><button data-c="body" data-id="'+cur.parent+'">'+esc(byId[cur.parent].name)+'</button>';
    h+='<i>›</i>'+(mode==="site"?'<button data-c="body" data-id="'+cur.id+'">'+esc(cur.name)+'</button>':'<span class="here">'+esc(cur.name)+'</span>');}
  if(mode==="site"&&curSite)h+='<i>›</i><span class="here">'+esc(curSite.name)+'</span>';
  crumbs.innerHTML=mode==="system"?"":h;}
crumbs.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  if(b.dataset.c==="sys")toSystem();
  else if(b.dataset.c==="body"){if(mode==="site"&&b.dataset.id===curSite.body)leaveSite();else switchGlobe(byId[b.dataset.id]);}});

/* ===================== DOSSIER ===================== */
function siteEvents(){if(!curSite)return [];return EVENTS.filter(e=>e.body===curSite.body&&(e.poi===curSite.poi||(curSite.pois&&curSite.pois.includes(e.poi))||(e.fx&&FX_VIEW[e.fx]&&FX_VIEW[e.fx].site===curSiteKey)));}
function evItem(e){return '<button class="evitem'+(selEvent===e.id?" open":"")+'" data-id="'+e.id+'"><span class="et"><span class="bk bk'+e.book+'">'+BOOKS[e.book].n+'</span>'+esc(e.title)+'</span><span class="ep">'+esc(placeName(e))+(e.fx?' · animated':'')+'</span><span class="ex">'+esc(e.text)+'</span>'+(e.fx?'<span class="btn primary watch" data-fx="'+e.fx+'">▶ Watch it unfold</span>':'')+'</button>';}
function renderDossier(){
  if(mode==="site"&&curSite){const S=curSite;const evs=siteEvents().filter(e=>!bookFilter||e.book===bookFilter);
    let h='<button class="btn back" id="back">← Orbit of '+esc(byId[S.body].name)+'</button><p class="eyebrow">'+esc(S.epithet)+'</p><h2 class="site">'+esc(S.name)+'</h2>'+
      '<p class="blurb">'+esc(siteF(S,"blurb"))+'</p>';
    const facts=siteF(S,"facts");if(facts)h+='<dl class="facts">'+facts.map(f=>'<dt>'+esc(f[0])+'</dt><dd>'+esc(f[1])+'</dd>').join("")+'</dl>';
    h+='<div class="rule"><span class="eyebrow">'+(S.tods.winter?"Hour & season":"Hour")+'</span></div><div class="tod" role="group" aria-label="Time of day">'+TOD_KEYS.filter(k=>S.tods[k]).map(k=>'<button data-tod="'+k+'" aria-pressed="'+(tod.cur===k)+'">'+((S.todLabel&&S.todLabel[k])||TOD_LABEL[k])+'</button>').join("")+'</div>';
    h+='<div class="rule"><span class="eyebrow">Landmarks</span></div>';
    if(S.toggles)h+='<div class="rule"><span class="eyebrow">Show</span></div><div class="tod">'+S.toggles.map(t=>'<button data-tog="'+t.id+'" aria-pressed="'+!!(S._tog&&S._tog[t.id])+'">'+esc(t.label)+'</button>').join("")+'</div>';
    S.landmarks.forEach(l=>{const n=evs.filter(e=>e.lm===l.id).length;h+='<button class="place'+(selLm===l.id?" sel":"")+'" data-lm="'+l.id+'"><span class="pn"><span class="pip"></span>'+esc(l.name)+'<span class="pc">'+(n?n+" ev":"")+'</span></span><span class="pd">'+esc(eraVal(l.desc))+'</span>'+(l.enter&&SITES[l.enter]?'<span class="btn primary enter" data-site="'+l.enter+'">Enter '+esc(l.name)+' ›</span>':'')+'</button>';});
    h+='<div class="rule"><span class="eyebrow">Events here'+(bookFilter?' · Book '+BOOKS[bookFilter].n:'')+'</span></div>';
    if(!evs.length)h+='<p class="empty">'+(bookFilter?'Nothing happens here in this book.':'No pivotal events take place here.')+'</p>';
    evs.forEach(e=>h+=evItem(e));
    if(S.note)h+='<p class="blurb it">'+esc(S.note)+'</p>';
    dossier.innerHTML=h;dossier.querySelector("#back").addEventListener("click",leaveSite);return;}
  const b=cur;if(!b||mode!=="globe")return;const pois=(POIS[b.id]||[]).filter(poiVisible);const evs=eventsFor(b.id).filter(e=>!bookFilter||e.book===bookFilter);
  let h='<button class="btn back" id="back">← Solar system</button><p class="eyebrow">'+esc(bodyF(b,"epithet"))+'</p><h2>'+esc(b.name)+'</h2><div class="held">'+(b.real?'<b>'+esc(b.cls)+'</b>':'Held by <b>'+esc(bodyF(b,"control"))+'</b>')+(bookFilter?' · Book '+BOOKS[bookFilter].n:'')+'</div><p class="blurb">'+esc(bodyF(b,"blurb"))+'</p>';
  if(pois.length){h+='<div class="rule"><span class="eyebrow">Places</span></div>';
    pois.forEach(p=>{const n=eventsFor(b.id,p.id).filter(e=>!bookFilter||e.book===bookFilter).length;
      h+='<button class="place'+(selPoi===p.id?" sel":"")+'" data-poi="'+p.id+'"><span class="pn"><span class="pip"></span>'+esc(p.name)+'<span class="pc">'+(n?n+" ev":"")+'</span></span><span class="pd">'+esc(poiDesc(p))+'</span>'+(p.site&&SITES[p.site]?'<span class="btn primary enter" data-site="'+p.site+'" data-focus="'+(p.focus||"")+'">Descend into '+esc(p.name)+' ›</span>':'')+'</button>';});}
  h+='<div class="rule"><span class="eyebrow">Events here'+(bookFilter?' · Book '+BOOKS[bookFilter].n:'')+'</span></div>';
  if(!evs.length)h+='<p class="empty">'+(bookFilter?'Nothing happens here in this book.':'No pivotal events take place here.')+'</p>';
  evs.forEach(e=>h+=evItem(e));
  if(b.parent&&!b.moon){const moons=BODIES.filter(m=>m.parent===b.id);if(moons.length){h+='<div class="rule"><span class="eyebrow">Moons</span></div>';moons.forEach(m=>{const n=eventsFor(m.id).length;h+='<button class="place" data-moon="'+m.id+'"><span class="pn"><span class="sw" style="width:10px;height:10px;border-radius:50%;background:'+m.sw+'"></span>'+esc(m.name)+'<span class="pc">'+(n?n+" ev":"")+'</span></span></button>';});}}
  if(b.moon){h+='<div class="rule"><span class="eyebrow">Orbits</span></div><button class="place" data-moon="'+b.parent+'"><span class="pn">'+esc(byId[b.parent].name)+'</span></button>';}
  dossier.innerHTML=h;dossier.querySelector("#back").addEventListener("click",ascend);}
dossier.addEventListener("click",e=>{
  const w=e.target.closest(".watch");if(w){e.stopPropagation();const ev=EV[e.target.closest(".evitem").dataset.id];gotoEvent(ev);return;}
  const en=e.target.closest(".enter");if(en){e.stopPropagation();enterSite(en.dataset.site,en.dataset.focus||null);return;}
  const tg=e.target.closest("[data-tog]");if(tg){const S=curSite;S._tog=S._tog||{};const on=!S._tog[tg.dataset.tog];S._tog[tg.dataset.tog]=on;tg.setAttribute("aria-pressed",on);if(S.onToggle)S.onToggle(tg.dataset.tog,on);return;}
  const t=e.target.closest("[data-tod]");if(t){setTod(t.dataset.tod);dossier.querySelectorAll("[data-tod]").forEach(x=>x.setAttribute("aria-pressed",x===t));return;}
  const pl=e.target.closest(".place"),it=e.target.closest(".evitem");
  if(pl&&pl.dataset.moon){goBody(pl.dataset.moon);return;}
  if(pl&&pl.dataset.poi){selEvent=null;selectPoi(selPoi===pl.dataset.poi?null:pl.dataset.poi,true);return;}
  if(pl&&pl.dataset.lm){selectLm(pl.dataset.lm);return;}
  if(it){const ev=EV[it.dataset.id];if(selEvent===ev.id){selEvent=null;renderDossier();applyHL(false);return;}selEvent=ev.id;
    if(mode==="site"){if(ev.lm)selectLm(ev.lm,true);else{renderDossier();applyHL(true);}}
    else if(ev.poi&&ev.poi!==selPoi)selectPoi(ev.poi,true);else{renderDossier();applyHL(true);}}});
dossier.addEventListener("mouseover",e=>{const pl=e.target.closest(".place[data-poi],.place[data-lm]"),it=e.target.closest(".evitem");
  if(pl){hoverSel={body:cur?cur.id:null,poi:pl.dataset.poi||null,lm:pl.dataset.lm||null};if(pl.dataset.lm)hoverSel={body:curSite.body,poi:null,lm:pl.dataset.lm};applyHL(true);}
  else if(it){const ev=EV[it.dataset.id];hoverSel={body:ev.body,poi:ev.poi,event:ev.id,lm:ev.lm};applyHL(true);}});
dossier.addEventListener("mouseout",e=>{const t=e.target.closest(".place,.evitem");if(t&&!t.contains(e.relatedTarget)){hoverSel=null;applyHL(false);}});

function selectPoi(pid,rotate){selPoi=pid;renderDossier();applyHL(true);poiLabels.forEach(l=>l.el.classList.toggle("sel",l.p.id===pid));
  if(pid&&rotate){const m=markers.find(m=>m.p.id===pid);if(m){const v=m.local;const ry=Math.atan2(-v.x,v.z);const zp=Math.hypot(v.x,v.z);
    let rx=Math.atan2(v.y,zp);rx=Math.max(-1.35,Math.min(1.35,rx));let d=ry-gRot.ty;d=Math.atan2(Math.sin(d),Math.cos(d));gRot.ty+=d;gRot.tx=rx;gRot.auto=false;gZoom.tz=Math.min(gZoom.tz,9);}}
  const pe=dossier.querySelector(".place.sel");if(pe)pe.scrollIntoView({block:"nearest",behavior:"smooth"});}
function selectLm(id,keepEvent){if(!keepEvent)selEvent=null;selLm=id;const lm=curSite.landmarks.find(l=>l.id===id);if(lm)sFly(lm.cam);renderDossier();applyHL(true);
  siteLabels.forEach(l=>l.el.classList.toggle("sel",l.lm.id===id));const pe=dossier.querySelector(".place.sel");if(pe)pe.scrollIntoView({block:"nearest",behavior:"smooth"});}

/* ===================== LABELS ===================== */
let poiLabels=[];
function clearPoiLabels(){poiLabels.forEach(l=>l.el.remove());poiLabels=[];}
function buildPoiLabels(){clearPoiLabels();markers.forEach(m=>{const el=document.createElement("button");el.className="plbl";el.innerHTML='<span class="pip"></span><span>'+esc(m.p.name)+'</span>';
  labelsEl.appendChild(el);const l={el,m,p:m.p};poiLabels.push(l);
  el.addEventListener("mouseenter",ev=>{hoverSel={body:cur.id,poi:m.p.id};applyHL(true);showTipPoi(m.p,ev.clientX,ev.clientY);});
  el.addEventListener("mousemove",ev=>placeTip(ev.clientX,ev.clientY));
  el.addEventListener("mouseleave",()=>{hoverSel=null;applyHL(false);hideTip();});
  el.addEventListener("click",()=>{hideTip();selEvent=null;if(m.p.site&&SITES[m.p.site]){selectPoi(m.p.id,true);setTimeout(()=>enterSite(m.p.site,m.p.focus||null),500);}else selectPoi(m.p.id,true);});});}
function buildSiteLabels(){siteLabels.forEach(l=>l.el.remove());siteLabels=[];
  curSite.landmarks.forEach(lm=>{const el=document.createElement("button");el.className="plbl lm";el.innerHTML='<span class="pip"></span><span>'+esc(lm.name)+'</span>';labelsEl.appendChild(el);
    const l={el,lm,pos:new THREE.Vector3().fromArray(lm.pos)};siteLabels.push(l);
    el.addEventListener("mouseenter",ev=>{hoverSel={body:curSite.body,poi:null,lm:lm.id};applyHL(true);showTipLm(lm,ev.clientX,ev.clientY);});
    el.addEventListener("mousemove",ev=>placeTip(ev.clientX,ev.clientY));
    el.addEventListener("mouseleave",()=>{hoverSel=null;applyHL(false);hideTip();});
    el.addEventListener("click",()=>{hideTip();selectLm(lm.id);});});}
function renderSiteHud(){sitehud.hidden=false;sitehud.innerHTML='<button class="btn" data-h="l" title="Rotate left">⟲</button><button class="btn" data-h="in" title="Zoom in">+</button><button class="btn" data-h="out" title="Zoom out">−</button><button class="btn" data-h="r" title="Rotate right">⟳</button><button class="btn" data-h="ground" title="Drop to ground level and look around">Ground view</button><button class="btn" data-h="tour" aria-pressed="'+siteTour+'" title="Slowly circle this place">Tour</button><button class="btn" data-h="reset">Overview</button><span class="hudtxt">Drag to look · right-drag to move · double-click to fly</span>';}
let siteTour=false;
sitehud.addEventListener("click",e=>{const b=e.target.closest("button");if(!b||!curSite)return;const h=b.dataset.h;
  if(h==="l")sctl.tth+=.4;if(h==="r")sctl.tth-=.4;if(h==="in")sctl.tr=Math.max(sctl.minR,sctl.tr*.7);if(h==="out")sctl.tr=Math.min(sctl.maxR,sctl.tr*1.4);
  if(h==="reset"){selLm=null;sFly(curSite.cam);renderDossier();applyHL(false);}
  if(h==="ground"){const r=Math.max(sctl.minR,Math.min(900,sctl.tr*.12));sctl.tr=r;sctl.tph=1.5;}
  if(h==="tour"){siteTour=!siteTour;b.setAttribute("aria-pressed",siteTour);b.classList.toggle("primary",siteTour);}});

/* ===================== LOOP ===================== */
const tmp=new THREE.Vector3(),camDir=new THREE.Vector3();
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);[camS,camG,camX].forEach(c=>{c.aspect=w/h;c.updateProjectionMatrix();});
  camG.position.x=!isMob()?1.6:0;camG.position.y=!isMob()?-.7:-2.2;}
addEventListener("resize",resize);resize();
function updateBodies(){BODIES.forEach(b=>{const o=objs[b.id];if(!b.parent)o.pos.set(0,0,0);
    else{const p=objs[b.parent].pos;const a=(b.phase+simT/b.period)*TAU;o.pos.set(p.x+Math.cos(a)*b.a,p.y,p.z+Math.sin(a)*b.a);if(b.moon&&o.orbit)o.orbit.position.copy(p);}
    o.grp.position.copy(o.pos);o.mesh.rotation.y=simT*(b.kind==="sun"?.05:.25);if(o.clouds)o.clouds.rotation.y=o.mesh.rotation.y*1.15;});}
function project(v,cam){tmp.copy(v).project(cam);return {x:(tmp.x*.5+.5)*canvas.clientWidth,y:(-tmp.y*.5+.5)*canvas.clientHeight,front:tmp.z<1&&tmp.z>-1};}
let last=performance.now(),elapsed=0;
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;elapsed+=dt;
  if(window.__gallery){renderer.render(window.__gallery.scene,window.__gallery.cam);requestAnimationFrame(frame);return;}
  if(!paused&&mode==="system")simT+=dt;
  {const want=(hoverSel&&hoverSel.body==="belt")||beltPulse>0;beltPulse=Math.max(0,beltPulse-dt);belt.material.size+=((want?.42:.15)-belt.material.size)*Math.min(1,dt*6);belt.material.color.copy(want?col(0xf0c070):col(0x8a7560));}
  if(mode==="system"){updateBodies();if(!paused){belt.rotation.y+=dt*.004;updateTraffic(dt);}
    if(anim){const t=Math.max(0,Math.min(1,(now-anim.t0)/anim.dur)),k=ease(t);const tg=anim.follow?objs[anim.follow].pos:anim.to.tg;
      ctl.target.copy(anim.from.tg).lerp(tg,k);ctl.r=anim.from.r+(anim.to.r-anim.from.r)*k;ctl.theta=anim.from.th+(anim.to.th-anim.from.th)*k;ctl.phi=anim.from.ph+(anim.to.ph-anim.from.ph)*k;
      if(t>=1){const d=anim.done;anim.done=null;if(d)d();}}
    applyCam();
    Object.values(objs).forEach(o=>{o.hl+=(o.hlT-o.hl)*Math.min(1,dt*10);o.halo.material.opacity=o.hl*.85;o.halo.quaternion.copy(camS.quaternion);o.halo.visible=o.hl>.01;});
    const cw=canvas.clientWidth,ch=canvas.clientHeight;
    /* labels never overlap (SOC_PLANETS below): the selected or hovered world wins, then the Sun and planets, then nearer bodies */
    const placedL=[];const hov=hoverSel&&hoverSel.body;const selB=cur&&cur.id;
    function prio(b){return b.id===selB?0:b.id===hov?1:b.kind==="sun"?2:b.moon?5:SOC_PLANETS.has(b.id)?3:4;}
    BODIES.slice().sort((a,c)=>prio(a)-prio(c)||camS.position.distanceTo(objs[a.id].pos)-camS.position.distanceTo(objs[c.id].pos)).forEach(b=>{const el=sysLabels[b.id];const o=objs[b.id];tmp.copy(o.pos);tmp.y-=b.size*1.25;const p=project(tmp,camS);
      let vis=p.front&&p.x>-50&&p.x<cw+50&&p.y>-20&&p.y<ch+20;
      if(b.moon){const pd=camS.position.distanceTo(objs[b.parent].pos);vis=vis&&(pd<byId[b.parent].size*(b.parent==="jupiter"?16:24)||(hoverSel&&hoverSel.body===b.id));}
      if(b.kind==="sun")vis=vis&&ctl.r<200;
      if(vis){const w=el._w||(el._w=el.offsetWidth||b.name.length*8+16),h=el._h||(el._h=el.offsetHeight||18);const r={x:p.x-w/2,y:p.y+4,w,h};
        if(prio(b)>1&&placedL.some(q=>r.x<q.x+q.w+4&&r.x+r.w+4>q.x&&r.y<q.y+q.h&&r.y+r.h>q.y))vis=false;else placedL.push(r);}
      el.style.opacity=vis?1:0;el.style.pointerEvents=vis?"auto":"none";
      if(vis)el.style.transform="translate("+p.x.toFixed(1)+"px,"+(p.y+4).toFixed(1)+"px) translate(-50%,0)";});
    camS.updateMatrixWorld();SUN_U.sys.value.set(0,0,0).applyMatrix4(camS.matrixWorldInverse);
    renderer.render(sys,camS);
  }else if(mode==="globe"){
    if(gRot.auto)gRot.ty+=dt*.06;
    gRot.x+=(gRot.tx-gRot.x)*Math.min(1,dt*5);gRot.y+=(gRot.ty-gRot.y)*Math.min(1,dt*5);gZoom.z+=(gZoom.tz-gZoom.z)*Math.min(1,dt*6);camG.position.z=gZoom.z;
    globe.rotation.set(gRot.x,gRot.y,0);if(globeClouds)globeClouds.rotation.y+=dt*.01;if(globeExtra){if(!globeExtra.userData.fixed)globeExtra.rotation.y+=dt*.02;if(globeExtra.userData.update)globeExtra.userData.update(dt);}if(globeOrbit)globeOrbit.children.forEach(p=>p.rotation.y+=p.userData.sp*dt);
    globe.updateMatrixWorld();
    const pulse=1+Math.sin(now*.004)*.16;
    poiLabels.forEach(l=>{const wp=l.m.local.clone().applyMatrix4(globe.matrixWorld);const n=wp.clone().sub(globe.position).normalize();
      const facing=n.dot(tmp.copy(camG.position).sub(wp).normalize());const p=project(wp,camG);const vis=facing>.12;
      l.el.style.opacity=vis?Math.min(1,(facing-.12)*5):0;l.el.style.pointerEvents=vis?"auto":"none";
      l.el.style.transform="translate("+p.x.toFixed(1)+"px,"+p.y.toFixed(1)+"px) translate(-6px,-50%)";
      const hot=l.el.classList.contains("hot")||l.el.classList.contains("sel");l.m.ring.scale.setScalar((hot?1.6:1)*pulse*Math.max(.5,gZoom.z/12.5));});
    updateFx(dt,now);
    camG.updateMatrixWorld();SUN_U.glb.value.copy(gSun.position).multiplyScalar(100).applyMatrix4(camG.matrixWorldInverse);
    renderer.render(glb,camG);
  }else{
    updateTod(dt);if(siteTour)sctl.tth+=dt*.06;sCamApply(dt);WIN_U.time.value=elapsed;if(siteUpdate)siteUpdate(dt,elapsed);
    if(skyBody){skyBody.position.copy(camX.position).addScaledVector(skyBody.userData.dir,11000);}
    sky.position.copy(camX.position);nightStars.position.copy(camX.position);
    const cw=canvas.clientWidth,ch=canvas.clientHeight;
    siteLabels.forEach(l=>{const p=project(l.pos,camX);const d=camX.position.distanceTo(l.pos);const vis=p.front&&p.x>-40&&p.x<cw+40&&p.y>0&&p.y<ch&&(d<sctl.r*(l.lm.minor?1.9:4.5)||l.el.classList.contains('hot')||l.el.classList.contains('sel'));
      l.el.style.opacity=vis?1:0;l.el.style.pointerEvents=vis?"auto":"none";if(vis)l.el.style.transform="translate("+p.x.toFixed(1)+"px,"+p.y.toFixed(1)+"px) translate(-6px,-50%)";});
    updateFx(dt,now);
    renderer.render(site3,camX);
  }
  requestAnimationFrame(frame);
}

/* ===================== REAL MAPS ===================== */
const TEXSET={mars:{map:"mars",lights:"mars_lights",spec:"mars_spec"},luna:{map:"luna",lights:"luna_lights",spec:"luna_spec"},
  earth:{map:"earth",lights:"earth_lights",normal:"earth_normal",spec:"earth_spec",clouds:"earth_clouds"},sun:{map:"sun"},
  jupiter:{map:"jupiter"},saturn:{map:"saturn",ring:"saturn_ring"},venus:{map:"venus",lights:"venus_lights",spec:"venus_spec",clouds:"venus_clouds"},
  mercury:{map:"mercury",lights:"mercury_lights",spec:"mercury_spec"},
  phobos:{map:"phobos",lights:"phobos_lights"},io:{map:"io",lights:"io_lights",clouds:"io_clouds"},europa:{map:"europa",lights:"europa_lights",spec:"europa_spec",clouds:"europa_clouds"},
  ganymede:{map:"ganymede",lights:"ganymede_lights"},callisto:{map:"callisto"},kalyke:{map:"callisto"},asteroid:{map:"phobos"},
  rhea:{map:"rhea",spec:"rhea_spec"},uranus:{map:"uranus"},neptune:{map:"neptune"},triton:{map:"triton",lights:"triton_lights"},pluto:{map:"pluto",lights:"pluto_lights"}};
/* maps that change with the books */
const ERA_TEX={luna:{4:{map:"luna4",lights:"luna4_lights",spec:"luna_spec"}},mars:{4:{map:"mars",lights:"mars4_lights",spec:"mars_spec"}},io:{6:{map:"io_burnt",lights:"io_burnt_lights",clouds:"io_clouds"}}};
const COLOR_KEYS={map:1,lights:1,ring:1};
Object.assign(TEXSET,{styx:{map:"styx"},nix:{map:"nix"},kerberos:{map:"kerberos"},hydra:{map:"hydra"},deimos:{map:"deimos"},ceres:{map:"ceres"},vesta:{map:"vesta"},pallas:{map:"pallas"},hygiea:{map:"hygiea"},mimas:{map:"mimas"},enceladus:{map:"enceladus"},tethys:{map:"tethys"},dione:{map:"dione"},titan:{map:"titan"},iapetus:{map:"iapetus"},miranda:{map:"miranda"},ariel:{map:"ariel"},umbriel:{map:"umbriel"},titania:{map:"titania"},oberon:{map:"oberon"},charon:{map:"charon"},orcus:{map:"orcus"},haumea:{map:"haumea"},quaoar:{map:"quaoar"},makemake:{map:"makemake"},gonggong:{map:"gonggong"},eris:{map:"eris"},sedna:{map:"sedna"},halley:{map:"halley"}});
const texLoader=new THREE.TextureLoader();const TEX_BASE=window.SOCIETY_TEX_BASE||"";const texCache2={};const texApplied={};
function loadTex(name,isColor){const k=name+(isColor?"#c":"");if(texCache2[k])return texCache2[k];
  /* Photographic maps (tex/*.jpg) are not shipped: every world uses its procedural surface (genTex), so resolve
     without a request. Set TEX_BASE to a folder of maps to opt back in. */
  texCache2[k]=TEX_BASE?new Promise(res=>texLoader.load(TEX_BASE+name+(name.endsWith("ring")?".png":".jpg"),t=>{t.anisotropy=MAX_ANISO;if(isColor)t.encoding=THREE.sRGBEncoding;res(t);},undefined,()=>res(null))):Promise.resolve(null);return texCache2[k];}
function specFor(id){const v=ERA_TEX[id];if(!v)return {key:"base",spec:TEXSET[id]};let best="base",bk=-1;Object.keys(v).forEach(k=>{if(+k<=ERA&&+k>bk){bk=+k;best=k;}});return {key:best,spec:best==="base"?TEXSET[id]:v[best]};}
function applySet(id,done){const {key,spec}=specFor(id);if(texApplied[id]===key){if(done)done();return;}texApplied[id]=key;const keys=Object.keys(spec);
  Promise.all(keys.map(k=>loadTex(spec[k],!!COLOR_KEYS[k]))).then(arr=>{if(texApplied[id]!==key)return;if(done)done();if(!arr[0])return;const t={};keys.forEach((k,i)=>{if(arr[i])t[k]=arr[i];});
    REAL[id]=t;const o=objs[id],b=byId[id];o.mesh.material=makeMat(b,t,"sys");
    if(t.clouds&&!o.clouds){o.clouds=makeClouds(b.size,t.clouds);o.grp.add(o.clouds);}
    if(b.ring&&t.ring){o.grp.remove(o.ring);o.ring=makeRing(b.size,t.ring);o.ring.rotation.x=-Math.PI/2+.38;o.grp.add(o.ring);}
    if(mode==="globe"&&cur&&cur.id===id)refreshGlobe(b);});}
function applyEraTextures(){Object.keys(ERA_TEX).forEach(id=>applySet(id));}
(function(){const ids=Object.keys(TEXSET);let done=0;const msg=$("#loadmsg"),sl=$("#splashLd");
  let fin=false;const finish=()=>{if(msg)msg.hidden=true;$("#splash").classList.add("out");if(!fin){fin=true;setTimeout(()=>{if(mode==="system")showNavHint("system");},900);}};
  const tick=()=>{done++;if(msg)msg.textContent="Loading planetary maps "+done+"/"+ids.length;if(sl)sl.textContent="Charting the Society · "+done+" of "+ids.length+" worlds";if(done>=ids.length)setTimeout(finish,500);};
  setTimeout(finish,9000);$("#splash").addEventListener("click",finish);
  ids.forEach(id=>applySet(id,tick));})();

/* ===================== START ===================== */
$("#chronHint").innerHTML="Hover a world to light up what happened there. <b>Click an event</b> to go to it; <b>▶</b> marks scenes you can watch.";
updateBodies();applyCam();applyHL(false);renderCrumbs();requestAnimationFrame(frame);
const startHash=(location.hash||"").slice(1);
if(byId[startHash]&&startHash!=="sun")setTimeout(()=>descend(startHash),600);
else if(SITES[startHash])setTimeout(()=>enterSite(startHash),600);
window.__atlas={makeShip,col,glowSprite,GLOW_WARM,get fx(){return fxList;},setTodNow:k=>{if(curSite&&curSite.tods[k]){tod.cur=k;tod.t=1;tod.from=null;applyTod(curSite.tods[k],curSite.tods[k],1);}},enterSite,gotoEvent,EV,playFx,renderer,site3,sSun,sHemi,camX,sctl,skyMat,WIN_U,tod,get curSite(){return curSite;},THREE};

/* ---- 69-war-sim.js ---- */
/* ===================== WAR MODE · SIMULATION ===================== */
/* The Battle of Mercury as a real-time strategy game. This file is pure simulation: no rendering,
   no DOM. Armies are formations (cohorts, warbands, columns), each a single object with strength,
   morale and orders; combat, capture, scoring and the Society's commander all run here. */
const WARSIM=(function(){
const R_="R",S_="S";                                 /* the Solar Republic, the Society */
const TYPES={
  inf:  {label:"Legion cohort",short:"Cohort",speed:34,range:170,atk:.0062,hp:1, word:"troops",  reinforce:55},
  elite:{label:"Elite warband",short:"Elite", speed:46,range:150,atk:.036, hp:3, word:"troops",  reinforce:14},
  armor:{label:"Armored column",short:"Armor",speed:58,range:330,atk:.55,  hp:40,word:"vehicles",reinforce:.9}};
const MULT={inf:{inf:1,elite:.8,armor:.5},elite:{inf:1.25,elite:1,armor:1.35},armor:{inf:1.45,elite:1,armor:1}};
const SIZE={inf:3000,elite:900,armor:40};
const OBJ_DEF=[
  {id:"tyche",name:"Tyche",f:[.376,.307],value:1.5,r:300,hq:R_},
  {id:"redreach",name:"Red Reach",f:[.662,.372],value:1,r:240},
  {id:"heliopolis",name:"Heliopolis",f:[.346,.765],value:1.5,r:320}];
const WIN_SCORE=1000,METER_K=.5;
function mkRng(s){let a=s>>>0||1;return ()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

/* ---- names from the saga ---- */
const NAMES={
  R:{inf:["Free Legion · I Cohort","Free Legion · II Cohort","Free Legion · III Cohort","Second Army · IV Cohort","Second Army · V Cohort","Third Army · VI Cohort","Tyche Guard","Heliopolis Garrison","Red Reach Garrison","Free Legion · VII Cohort","Free Legion · VIII Cohort","Free Legion · IX Cohort"],
     elite:["The Howlers","Obsidian Warband","Valkyrie Warband","Helldivers"],armor:["Republic Lancers","Second Army Armor","Red Lancers","Third Army Armor"]},
  S:{inf:["Remnant Legion · I","Remnant Legion · II","Remnant Legion · III","Remnant Legion · IV","Remnant Legion · V","Remnant Legion · VI","Remnant Legion · VII","Remnant Legion · VIII","Remnant Legion · IX","Remnant Legion · X","Remnant Legion · XI","Remnant Legion · XII"],
     elite:["Iron Leopards","Praetorian Guard","Gorgons","Peerless Scarred","Grimmus Knights"],armor:["Votum Armored Column","Remnant Armor","Grimmus Armor","Votum Heavy Column"]}};

function create(opt){opt=opt||{};
  const ground=opt.ground||(()=>40),HF=opt.HF||((fx,fy)=>[(fx-.5)*7440,(fy-.5)*12000]);
  const rnd=mkRng(opt.seed||7);
  const G={t:0,over:null,ground,HF,forms:[],nextId:1,log:[],score:{R:0,S:0},meter:0,cas:{R:{inf:0,elite:0,armor:0},S:{inf:0,elite:0,armor:0}},
    reserve:{R:{inf:18000,elite:2400,armor:100},S:{inf:6000,elite:900,armor:40}},
    nameIdx:{R:{inf:0,elite:0,armor:0},S:{inf:0,elite:0,armor:0}},
    waves:[],aiT:0,difficulty:opt.difficulty||1,shots:[],events:[]};
  G.objs=OBJ_DEF.map(o=>{const [x,z]=HF(o.f[0],o.f[1]);return {...o,x,z,control:0,owner:null,contested:false};});
  const LZ={north:HF(.585,.43),plains:HF(.70,.28),south:HF(.43,.62),east:HF(.76,.47),west:HF(.40,.47)};
  G.LZ=LZ;
  function name(side,type){const L=NAMES[side][type];const i=G.nameIdx[side][type]++;return L[i%L.length]+(i>=L.length?" ("+(Math.floor(i/L.length)+1)+")":"");}
  function say(text,side,kind){G.log.unshift({t:G.t,text,side,kind:kind||"info"});if(G.log.length>40)G.log.pop();G.events.push({t:G.t,text,side,kind});}
  function spawn(side,type,x,z,o){const f={id:G.nextId++,side,type,name:(o&&o.name)||name(side,type),x,z,hx:0,hz:-1,count:SIZE[type]*((o&&o.k)||1),max:SIZE[type],morale:1,
      order:{kind:"idle"},state:"idle",target:null,landing:(o&&o.landing)||0,engaged:false,lastHit:-99,firing:0,dmgIn:0,home:o&&o.home};
    G.forms.push(f);return f;}
  G.spawn=spawn;
  /* ---- the opening of the battle: Dark Age, the Remnant falls on Helios ---- */
  const o=id=>G.objs.find(x=>x.id===id);
  ["tyche","heliopolis","redreach"].forEach(id=>{o(id).control=1;o(id).owner=R_;});
  const near=(ob,dx,dz)=>[ob.x+dx,ob.z+dz];
  [["inf",-60,60],["inf",80,40],["armor",0,-80],["elite",140,-60]].forEach(([t,dx,dz],i)=>{const [x,z]=near(o("tyche"),dx,dz);spawn(R_,t,x,z,{name:i===0?"Tyche Guard":undefined,home:"tyche"});});
  [["inf",0,40]].forEach(([t,dx,dz])=>{const [x,z]=near(o("redreach"),dx,dz);spawn(R_,t,x,z,{name:"Red Reach Garrison",home:"redreach"});});
  [["inf",-40,-60],["inf",60,-40],["armor",0,70]].forEach(([t,dx,dz],i)=>{const [x,z]=near(o("heliopolis"),dx,dz);spawn(R_,t,x,z,{name:i===0?"Heliopolis Garrison":undefined,home:"heliopolis"});});
  /* Society landing waves: Atalantia's Iron Rain */
  G.waves=[
    {t:8, lz:"north", comp:["inf","inf","inf","elite","armor"],title:"Atalantia’s Iron Rain falls on the Ladon"},
    {t:160,lz:"south",comp:["inf","inf","armor"],title:"A second wave drops toward Heliopolis"},
    {t:310,lz:"plains",comp:["inf","inf","elite","armor"],title:"Iron Rain over the Plains of Caduceus"},
    {t:460,lz:"west",comp:["inf","inf","inf","armor"],title:"The Remnant commits its reserves"},
    {t:600,lz:"south",comp:["inf","inf","elite","elite","armor"],title:"Ajax au Grimmus leads the final drop"}];
  G.waves.forEach(w=>w.done=false);
  say("The Society Remnant’s armada is in orbit. Hold Tyche, Red Reach and Heliopolis.",R_,"big");

  /* ---------------- helpers ---------------- */
  const alive=f=>f.count>=1;
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
  const power=f=>f.count*TYPES[f.type].hp;
  G.power=power;
  function sidePower(side){let p=0;G.forms.forEach(f=>{if(f.side===side)p+=power(f);});return p;}
  G.sidePower=sidePower;
  function objAt(x,z,pad){return G.objs.find(ob=>Math.hypot(x-ob.x,z-ob.z)<ob.r+(pad||0));}
  function nearestOwned(f,side){let best=null,bd=1e9;G.objs.forEach(ob=>{if(ob.owner!==side)return;const d=Math.hypot(f.x-ob.x,f.z-ob.z);if(d<bd){bd=d;best=ob;}});return best;}
  G.nearestOwned=nearestOwned;
  function nearestLZ(f){let best=null,bd=1e9;Object.values(LZ).forEach(p=>{const d=Math.hypot(f.x-p[0],f.z-p[1]);if(d<bd){bd=d;best=p;}});return best;}

  /* ---------------- orders (the player and the AI use the same calls) ---------------- */
  function order(f,kind,arg){if(!alive(f))return;if(f.state==="routing"&&kind!=="retreat"&&kind!=="hold")return;
    if(kind==="move")f.order={kind,x:arg.x,z:arg.z};
    else if(kind==="attack")f.order={kind,target:arg.id};
    else if(kind==="capture"){const ob=typeof arg==="string"?G.objs.find(x=>x.id===arg):arg;const a=rnd()*Math.PI*2,r=rnd()*ob.r*.55;f.order={kind,obj:ob.id,x:ob.x+Math.cos(a)*r,z:ob.z+Math.sin(a)*r};}
    else if(kind==="hold")f.order={kind:"hold"};
    else if(kind==="retreat"){let p=null;const ob=nearestOwned(f,f.side);if(ob)p=[ob.x,ob.z];else if(f.side===S_)p=nearestLZ(f);else p=[f.x,f.z-800];f.order={kind:"retreat",x:p[0],z:p[1]};}
    else if(kind==="reinforce"){const ob=nearestOwned(f,f.side);if(!ob){say(f.name+": no friendly stronghold to reinforce at.",f.side);return;}f.order={kind:"reinforce",obj:ob.id,x:ob.x,z:ob.z};}
    else if(kind==="idle")f.order={kind:"idle"};
    if(kind!=="retreat"&&f.state==="routing")f.state="idle";}
  G.order=order;
  /* formation offsets so a group ordered to one point spreads into a line */
  G.orderGroup=function(list,kind,arg){if(kind==="move"&&list.length>1){const n=list.length;const cx=list.reduce((s,f)=>s+f.x,0)/n,cz=list.reduce((s,f)=>s+f.z,0)/n;
      let dx=arg.x-cx,dz=arg.z-cz;const L=Math.hypot(dx,dz)||1;dx/=L;dz/=L;const px=-dz,pz=dx;
      list.forEach((f,i)=>{const o=(i-(n-1)/2)*130;order(f,"move",{x:arg.x+px*o,z:arg.z+pz*o});});}
    else list.forEach(f=>order(f,kind,arg));};
  G.deployState={left:8,cd:20,CD:60};
  G.callIn=function(type,objId){const D=G.deployState;const ob=G.objs.find(x=>x.id===objId);if(D.left<=0||D.cd>0||!ob||ob.owner!==R_)return false;
    const need=SIZE[type]*.8;if(G.reserve.R[type]<need)return false;G.reserve.R[type]-=need;D.left--;D.cd=D.CD;
    const f=spawn(R_,type,ob.x+(rnd()-.5)*120,ob.z+(rnd()-.5)*120,{k:.8,landing:4,home:ob.id});say(f.name+" deploys at "+ob.name+".",R_,"good");return f;};

  /* ---------------- the Society's commander ---------------- */
  function ai(dt){G.aiT-=dt;if(G.aiT>0)return;G.aiT=2.5;
    const mine=G.forms.filter(f=>f.side===S_&&alive(f)&&!f.landing);if(!mine.length)return;
    const foes=G.forms.filter(f=>f.side===R_&&alive(f));
    const defP=ob=>foes.reduce((s,f)=>s+(Math.hypot(f.x-ob.x,f.z-ob.z)<ob.r+700?power(f):0),0);
    const cx=mine.reduce((s,f)=>s+f.x,0)/mine.length,cz=mine.reduce((s,f)=>s+f.z,0)/mine.length;
    /* pick the main thrust: valuable, weakly held, near the Remnant's centre of mass */
    let best=null,bs=-1;G.objs.forEach(ob=>{if(ob.owner===S_&&ob.control<=-.99)return;const d=Math.hypot(ob.x-cx,ob.z-cz);
      const s=ob.value*(1/(1+defP(ob)/5000))*(4000/(4000+d))*(ob.owner===null?1.3:1);if(s>bs){bs=s;best=ob;}});
    const myP=mine.reduce((s,f)=>s+power(f),0);
    mine.forEach(f=>{const hp=f.count/f.max;
      if(f.state==="routing")return;
      if(hp<.33&&f.order.kind!=="retreat"&&f.order.kind!=="reinforce"){const ob=nearestOwned(f,S_);if(ob)order(f,"reinforce");else order(f,"retreat");return;}
      if(f.order.kind==="reinforce"){if(hp>.9||G.reserve.S[f.type]<=0)order(f,"idle");else return;}
      if(f.order.kind==="retreat"&&dist(f,{x:f.order.x,z:f.order.z})>150)return;
      /* garrison a threatened stronghold we hold */
      const threatened=G.objs.find(ob=>ob.owner===S_&&defP(ob)>0&&!mine.some(m=>m!==f&&Math.hypot(m.x-ob.x,m.z-ob.z)<ob.r));
      if(threatened&&Math.hypot(f.x-threatened.x,f.z-threatened.z)<2500&&rnd()<.4){order(f,"capture",threatened);return;}
      /* strike an exposed enemy formation close by */
      let tgt=null,td=1e9;foes.forEach(e=>{const d=dist(f,e);if(d<700&&d<td&&power(e)<power(f)*1.6){td=d;tgt=e;}});
      if(tgt&&f.order.kind!=="attack"){order(f,"attack",tgt);return;}
      if(f.order.kind==="attack"){const t=G.forms.find(x=>x.id===f.order.target);if(t&&alive(t)&&dist(f,t)<1200)return;}
      /* otherwise join the main thrust */
      if(best&&!(f.order.kind==="capture"&&f.order.obj===best.id))order(f,"capture",best);});}

  /* ---------------- one tick of the war ---------------- */
  G.step=function(dt){if(G.over)return;G.t+=dt;G.events.length=0;G.shots.length=0;
    /* waves */
    G.waves.forEach(w=>{if(w.done||G.t<w.t)return;w.done=true;const [lx,lz]=LZ[w.lz];
      w.comp.forEach((t,i)=>{const a=i/w.comp.length*Math.PI*2+rnd(),r=120+rnd()*220;const f=spawn(S_,t,lx+Math.cos(a)*r,lz+Math.sin(a)*r,{landing:6+rnd()*3});f.drop=true;});
      say(w.title+".",S_,"big");});
    if(G.deployState.cd>0)G.deployState.cd-=dt;
    ai(dt);
    const F=G.forms;
    /* targets */
    F.forEach(f=>{f.engaged=false;f.target=null;if(!alive(f)||f.landing>0)return;const T=TYPES[f.type];
      if(f.order.kind==="retreat"||f.state==="routing")return;
      let tg=null;if(f.order.kind==="attack"){tg=F.find(x=>x.id===f.order.target);if(tg&&!alive(tg))tg=null;if(!tg)f.order={kind:"idle"};}
      let near=null,bd=T.range;F.forEach(e=>{if(e.side===f.side||!alive(e))return;const d=dist(f,e);if(d<=bd){bd=d;near=e;}});
      f.target=(tg&&dist(f,tg)<=T.range)?tg:(near||tg);});
    /* movement */
    F.forEach(f=>{if(!alive(f))return;if(f.landing>0){f.landing=Math.max(0,f.landing-dt);return;}const T=TYPES[f.type];let dx=null,dz=null,stop=0;
      const ok=f.order;if(f.state==="routing"||ok.kind==="retreat"||ok.kind==="move"||ok.kind==="reinforce"){dx=ok.x;dz=ok.z;stop=ok.kind==="reinforce"?60:40;}
      else if(ok.kind==="attack"&&f.target){if(dist(f,f.target)>T.range*.8){dx=f.target.x;dz=f.target.z;stop=T.range*.75;}}
      else if(ok.kind==="capture"){const inRange=f.target&&dist(f,f.target)<=T.range;if(!inRange){dx=ok.x;dz=ok.z;stop=30;}}
      f.moving=false;
      if(dx!==null){const ddx=dx-f.x,ddz=dz-f.z,L=Math.hypot(ddx,ddz);
        if(L>stop){let sp=T.speed*(f.state==="routing"||ok.kind==="retreat"?1.25:1);const y=G.ground(f.x,f.z);if(y>260)sp*=.6;else if(y>160)sp*=.8;
          let ux=ddx/L,uz=ddz/L;
          /* steer around open sea */
          const look=(ax,az)=>G.ground(f.x+ax*90,f.z+az*90)>2;
          if(!look(ux,uz)){let found=false;for(const a of [.5,-.5,1,-1,1.5,-1.5,2.2,-2.2]){const c=Math.cos(a),s=Math.sin(a);const vx=ux*c-uz*s,vz=ux*s+uz*c;if(look(vx,vz)){ux=vx;uz=vz;found=true;break;}}if(!found){ux=0;uz=0;}}
          const st=Math.min(L-stop,sp*dt);f.x+=ux*st;f.z+=uz*st;if(ux||uz){f.hx+=(ux-f.hx)*Math.min(1,dt*3);f.hz+=(uz-f.hz)*Math.min(1,dt*3);}f.moving=st>0.01;}
        else{if(ok.kind==="move"||ok.kind==="retreat"){f.order={kind:"idle"};if(f.state==="routing")f.state="idle";}
          if(ok.kind==="capture"){/* stay and hold once there */}}}
      else if(f.target){const ddx=f.target.x-f.x,ddz=f.target.z-f.z,L=Math.hypot(ddx,ddz)||1;f.hx+=(ddx/L-f.hx)*Math.min(1,dt*2);f.hz+=(ddz/L-f.hz)*Math.min(1,dt*2);}
      f.state=f.state==="routing"?"routing":f.moving?"moving":f.target?"engaged":"idle";});
    /* keep formations from piling onto one spot */
    for(let i=0;i<F.length;i++)for(let j=i+1;j<F.length;j++){const a=F[i],b=F[j];const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);const min=a.side===b.side?95:60;
      if(d<min&&d>.01){const p=(min-d)/2/d;a.x-=dx*p;a.z-=dz*p;b.x+=dx*p;b.z+=dz*p;}}
    /* combat */
    F.forEach(f=>{f.firing=Math.max(0,f.firing-dt);if(!alive(f)||!f.target||f.landing>0||f.state==="routing")return;const t=f.target;if(t.landing>0&&rnd()<.5)return;const T=TYPES[f.type];
      if(dist(f,t)>T.range)return;f.engaged=true;t.engaged=true;
      let dmg=f.count*T.atk*MULT[f.type][t.type]*Math.sqrt(Math.max(.2,f.morale))*dt*G.dmgScale(f);
      if(f.moving)dmg*=.5;
      const hy=G.ground(f.x,f.z)-G.ground(t.x,t.z);if(hy>60)dmg*=1.15;else if(hy<-60)dmg*=.9;
      const ob=objAt(t.x,t.z);if(ob&&ob.owner===t.side&&!t.moving)dmg*=ob.hq?.62:.72;
      if(t.order.kind==="retreat"||t.state==="routing")dmg*=1.3;
      if(t.landing>0)dmg*=1.2;
      const lost=Math.min(t.count,dmg/TYPES[t.type].hp);t.count-=lost;t.dmgIn+=lost;t.lastHit=G.t;G.cas[t.side][t.type]+=lost;f.firing=.6;
      G.shots.push({from:f,to:t,type:f.type,side:f.side});});
    /* morale, routing, death */
    for(let i=F.length-1;i>=0;i--){const f=F[i];
      if(f.count<1){say(f.name+" is destroyed.",f.side,f.side===R_?"bad":"good");F.splice(i,1);continue;}
      const hp=f.count/f.max;const hit=G.t-f.lastHit<2;
      f.morale+=((Math.min(1,.35+hp*.9)*(hit?.85:1))-f.morale)*Math.min(1,dt*.4);
      if(hp<.22&&f.state!=="routing"&&f.order.kind!=="hold"&&hit){f.state="routing";order(f,"retreat");f.state="routing";say(f.name+" breaks and falls back.",f.side,f.side===R_?"bad":"good");}
      f.dmgIn*=Math.max(0,1-dt*2);
      /* reinforcement at a friendly stronghold */
      if(f.order.kind==="reinforce"&&!hit){const ob=G.objs.find(x=>x.id===f.order.obj);if(ob&&ob.owner===f.side&&Math.hypot(f.x-ob.x,f.z-ob.z)<ob.r+80){const T=TYPES[f.type];const need=f.max-f.count;const give=Math.min(need,T.reinforce*dt,G.reserve[f.side][f.type]);
          f.count+=give;G.reserve[f.side][f.type]-=give;if(f.count>=f.max-.5||G.reserve[f.side][f.type]<=0){f.order={kind:"hold"};say(f.name+" is reinforced at "+ob.name+".",f.side);}}}}
    /* objectives */
    G.objs.forEach(ob=>{let pr=0,ps=0;F.forEach(f=>{if(f.landing>0||f.state==="routing")return;if(Math.hypot(f.x-ob.x,f.z-ob.z)<ob.r){if(f.side===R_)pr+=power(f);else ps+=power(f);}});
      ob.pR=pr;ob.pS=ps;ob.contested=pr>0&&ps>0;const prev=ob.owner;
      if(!ob.contested&&(pr>0||ps>0)){const p=pr||ps;const rate=dt*.022*(1+Math.min(2,p/4000));ob.control+=pr>0?rate:-rate;ob.control=Math.max(-1,Math.min(1,ob.control));}
      if(ob.control>=1)ob.owner=R_;else if(ob.control<=-1)ob.owner=S_;else if(prev===R_&&ob.control<=0)ob.owner=null;else if(prev===S_&&ob.control>=0)ob.owner=null;
      if(ob.owner!==prev){if(ob.owner)say(ob.name+(ob.owner===R_?" is held by the Solar Republic.":" has fallen to the Society."),ob.owner,ob.owner===R_?"good":"bad");else say(ob.name+" is lost; it lies between the armies.",prev,"bad");}
      if(ob.owner)G.score[ob.owner]+=ob.value*dt;});
    {let v=0;G.objs.forEach(ob=>{if(ob.owner===R_)v+=ob.value;else if(ob.owner===S_)v-=ob.value;});if(G.t>12)G.meter=Math.max(-WIN_SCORE,Math.min(WIN_SCORE,G.meter+v*METER_K*dt));}
    /* victory and defeat */
    const rAlive=F.some(f=>f.side===R_),sAlive=F.some(f=>f.side===S_);const wavesLeft=G.waves.some(w=>!w.done);
    const rCanDeploy=G.deployState.left>0&&G.objs.some(o=>o.owner===R_);
    if(G.meter>=WIN_SCORE)G.over={winner:R_,why:"The Republic’s hold on Helios is unbreakable."};
    else if(G.meter<=-WIN_SCORE)G.over={winner:S_,why:"The Society has won the war for Helios."};
    else if(!sAlive&&!wavesLeft&&G.t>20)G.over={winner:R_,why:"Every Society legion on Helios has been destroyed."};
    else if(!rAlive&&!rCanDeploy)G.over={winner:S_,why:"The Republic’s armies on Helios are gone."};
    else if(G.objs.every(o=>o.owner===S_))G.over={winner:S_,why:"Tyche, Red Reach and Heliopolis have all fallen."};
    if(G.over)say(G.over.winner===R_?"Victory. "+G.over.why:"Defeat. "+G.over.why,G.over.winner,"big");};
  G.dmgScale=f=>f.side===S_?(G.difficulty===0?.8:G.difficulty===2?1.2:1):1;
  G.totals=function(side){const t={inf:0,elite:0,armor:0,forms:0};G.forms.forEach(f=>{if(f.side===side){t[f.type]+=f.count;t.forms++;}});return t;};
  G.TYPES=TYPES;G.SIZE=SIZE;G.WIN=WIN_SCORE;
  return G;}
return {create,TYPES,R:R_,S:S_};
})();

/* ---- 70-war.js ---- */
/* ===================== WAR MODE · BATTLEFIELD, HUD AND CONTROLS ===================== */
/* Lays the game over the existing Helios scene without changing it. Everything here lives in its
   own group and its own DOM layer, built when War Mode starts and removed when it ends. */
const WAR=(function(){
const W={active:false};
const SIDE={R:{name:"The Solar Republic",short:"Republic",col:0xc8402e,css:"#d4513c"},S:{name:"The Society",short:"Society",col:0xd9b060,css:"#e0bb62"}};
const FIG={
  inf:{rows:4,cols:6,sp:15,geo:()=>new THREE.BoxGeometry(8,7,8).translate(0,3.5,0),c:{R:0xa83228,S:0xbfa04e}},
  elite:{rows:3,cols:4,sp:13,geo:()=>new THREE.BoxGeometry(6,11,6).translate(0,5.5,0),c:{R:0x5a1612,S:0x26262c}},
  armor:{rows:2,cols:4,sp:28,geo:()=>{const g=new THREE.BoxGeometry(18,6,11).translate(0,3,0);return g;},c:{R:0x6a3a30,S:0x8a7650}}};
const GLYPH={inf:"✕",elite:"★",armor:"◆"};
let G=null,root=null,layer=null,hud=null,cmd=null,logEl=null,boxEl=null,endEl=null,briefEl=null,toastEl=null;
let vis=new Map(),objVis=[],sel=new Set(),pending=null,paused=false,speed=1,acc=0,frameN=0,diff=1,prevBodyCls=null,deployAt="tyche";
let proj=null,F=null,started=false;
const tmpV=new THREE.Vector3();
const gnd=(x,z)=>Math.max(0,heliosGround(x,z));

/* ---------------- visuals ---------------- */
function makeVis(f){const D=FIG[f.type];const n=D.rows*D.cols;
  const mat=new THREE.MeshStandardMaterial({color:col(D.c[f.side]),roughness:.6,metalness:f.type==="armor"?.5:.15,emissive:col(f.side==="R"?0x200604:0x201a08)});
  const im=new THREE.InstancedMesh(D.geo(),mat,n);im.castShadow=true;im.frustumCulled=false;root.add(im);
  let tur=null;if(f.type==="armor"){tur=new THREE.InstancedMesh(new THREE.BoxGeometry(8,4,6).translate(0,8,0),mat,n);tur.frustumCulled=false;root.add(tur);}
  const ring=new THREE.Mesh(new THREE.RingGeometry(60,66,48).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:col(SIDE[f.side].col),transparent:true,opacity:.35,depthTest:false}));ring.renderOrder=6;root.add(ring);
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,40,5).translate(0,20,0),new THREE.MeshStandardMaterial({color:col(0x3a3430)}));root.add(pole);
  const flag=new THREE.Mesh(new THREE.PlaneGeometry(16,10).translate(8,35,0),new THREE.MeshStandardMaterial({color:col(SIDE[f.side].col),side:THREE.DoubleSide,emissive:col(SIDE[f.side].col),emissiveIntensity:.25}));root.add(flag);
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:col(0xffffff),transparent:true,opacity:.6,depthTest:false}));line.renderOrder=7;line.visible=false;root.add(line);
  const el=document.createElement("div");el.className="wm "+f.side+" "+f.type;el.innerHTML='<i>'+GLYPH[f.type]+'</i><b><s></s></b><span class="n"></span><span class="nm">'+esc(f.name)+'</span>';layer.appendChild(el);
  el.addEventListener("pointerdown",e=>{e.stopPropagation();if(e.button===0){if(pending==="attack"&&f.side==="S"){issue("attack",f);return;}if(f.side==="R")pick(f.id,e.shiftKey);else{showEnemy(f);}}});
  el.addEventListener("contextmenu",e=>{e.preventDefault();e.stopPropagation();if(f.side==="S")issue("attack",f);else if(sel.size)issue("move",{x:f.x,z:f.z});});
  el.addEventListener("dblclick",e=>{e.stopPropagation();if(f.side==="R"){G.forms.filter(x=>x.side==="R"&&x.type===f.type).forEach(x=>sel.add(x.id));renderCmd();}});
  const v={im,tur,ring,pole,flag,line,el,n,fxT:Math.random()*.3,lastCount:-1,bob:Math.random()*6};vis.set(f.id,v);return v;}
function dropVis(id){const v=vis.get(id);if(!v)return;[v.im,v.tur,v.ring,v.pole,v.flag,v.line].forEach(o=>{if(!o)return;root.remove(o);if(o.geometry)o.geometry.dispose();});v.el.remove();vis.delete(id);sel.delete(id);}
const _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_s=new THREE.Vector3(),_p=new THREE.Vector3(),_up=new THREE.Vector3(0,1,0);
function placeFigures(f,v,t){const D=FIG[f.type];const a=Math.atan2(f.hx,f.hz);const ca=Math.cos(a),sa=Math.sin(a);_q.setFromAxisAngle(_up,a);
  const show=Math.max(f.count>=1?1:0,Math.ceil(v.n*f.count/f.max));let k=0;
  for(let r=0;r<D.rows;r++)for(let c=0;c<D.cols;c++){const lx=(c-(D.cols-1)/2)*D.sp,lz=(r-(D.rows-1)/2)*D.sp*.9;
    const wx=f.x+lx*ca+lz*sa,wz=f.z-lx*sa+lz*ca;const jig=f.moving?Math.abs(Math.sin(t*6+k+v.bob))*1.5:0;
    _p.set(wx+(f.state==="routing"?Math.sin(k*3.1)*10:0),gnd(wx,wz)+jig,wz);_s.setScalar(k<show?1:0);_m.compose(_p,_q,_s);v.im.setMatrixAt(k,_m);if(v.tur)v.tur.setMatrixAt(k,_m);k++;}
  v.im.instanceMatrix.needsUpdate=true;if(v.tur)v.tur.instanceMatrix.needsUpdate=true;}
function buildObjVis(){G.objs.forEach(ob=>{const y=gnd(ob.x,ob.z);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(9,14,1400,10,1,true).translate(0,700,0),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
    uniforms:{c:{value:col(0xffffff)}},vertexShader:"varying float vY;void main(){vY=position.y/1400.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader:"uniform vec3 c;varying float vY;void main(){gl_FragColor=vec4(c*(1.-vY)*.8,1.);}"}));beam.position.set(ob.x,y,ob.z);root.add(beam);
  const ringPts=[];for(let i=0;i<=96;i++){const a=i/96*TAU;const x=ob.x+Math.cos(a)*ob.r,z=ob.z+Math.sin(a)*ob.r;ringPts.push(new THREE.Vector3(x,gnd(x,z)+10,z));}
  const ring=new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts),new THREE.LineBasicMaterial({color:col(0xffffff),transparent:true,opacity:.85,depthTest:false}));ring.renderOrder=5;root.add(ring);
  /* the territory each stronghold commands, draped over the land */
  const R=900;const dg=new THREE.CircleGeometry(R,64,0,TAU);dg.rotateX(-Math.PI/2);{const p=dg.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)+ob.x,z=p.getZ(i)+ob.z;p.setXYZ(i,p.getX(i),gnd(x,z)+6,p.getZ(i));}}
  const disc=new THREE.Mesh(dg,new THREE.MeshBasicMaterial({color:col(0xffffff),transparent:true,opacity:.13,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4}));disc.position.set(ob.x,0,ob.z);disc.renderOrder=2;root.add(disc);
  const el=document.createElement("div");el.className="wobj";el.innerHTML='<span class="on">'+esc(ob.name)+'</span><span class="ow"></span><b><s></s></b>';layer.appendChild(el);
  el.addEventListener("contextmenu",e=>{e.preventDefault();e.stopPropagation();issue("capture",ob);});
  el.addEventListener("pointerdown",e=>{e.stopPropagation();if(e.button===0&&pending==="capture")issue("capture",ob);else if(e.button===0)focusAt(ob.x,ob.z,2400);});
  objVis.push({ob,beam,ring,disc,el,y});});}
function colFor(owner,control){const c=new THREE.Color(0xc8c2b4);if(owner==="R")c.set(SIDE.R.col);else if(owner==="S")c.set(SIDE.S.col);else c.lerp(new THREE.Color(control>0?SIDE.R.col:SIDE.S.col),Math.min(1,Math.abs(control)));return c;}

/* projectiles: one pool of line segments drawn additively */
function Proj(n){const pos=new Float32Array(n*6),colr=new Float32Array(n*6);const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));g.setAttribute("color",new THREE.BufferAttribute(colr,3));
  const m=new THREE.LineSegments(g,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));m.frustumCulled=false;m.renderOrder=8;root.add(m);
  const list=[];const free=[];for(let i=n-1;i>=0;i--)free.push(i);for(let i=0;i<n*6;i++)pos[i]=i%3===1?-1e5:0;
  return{add(a,b,c,dur,len,arc,onEnd){if(!free.length)return;const i=free.pop();list.push({i,a,b,c,t:0,dur,len,arc:arc||0,onEnd});},
    update(dt){for(let j=list.length-1;j>=0;j--){const p=list[j];p.t+=dt;const k=p.t/p.dur;const o=p.i*6;
        if(k>=1){pos[o+1]=pos[o+4]=-1e5;free.push(p.i);list.splice(j,1);if(p.onEnd)p.onEnd(p.b);continue;}
        const k0=Math.max(0,k-p.len);[k,k0].forEach((kk,h)=>{const x=p.a.x+(p.b.x-p.a.x)*kk,y=p.a.y+(p.b.y-p.a.y)*kk+Math.sin(kk*Math.PI)*p.arc,z=p.a.z+(p.b.z-p.a.z)*kk;pos[o+h*3]=x;pos[o+h*3+1]=y;pos[o+h*3+2]=z;
          const f=h?.25:1;colr[o+h*3]=p.c.r*f;colr[o+h*3+1]=p.c.g*f;colr[o+h*3+2]=p.c.b*f;});}
      g.attributes.position.needsUpdate=true;g.attributes.color.needsUpdate=true;}};}
const C_R=new THREE.Color(1,.45,.25),C_S=new THREE.Color(1,.85,.45),C_E=new THREE.Color(.7,.85,1),C_A=new THREE.Color(1,.6,.2);
function slotPos(f){const a=Math.random()*TAU,r=Math.random()*40;const x=f.x+Math.cos(a)*r,z=f.z+Math.sin(a)*r;return new THREE.Vector3(x,gnd(x,z)+6,z);}
function shotFx(s){const v=vis.get(s.from.id);if(!v)return;v.fxT-=.1;if(v.fxT>0)return;
  const T=s.type;v.fxT=T==="armor"?.45:T==="elite"?.22:.16;const a=slotPos(s.from),b=slotPos(s.to);
  if(T==="armor"){proj.add(a.add(tmpV.set(0,10,0)),b,C_A,.7,.25,60,p=>{if(F.list.length<160)F.add(GLOW_WARM,p.clone().setY(p.y+8),90+Math.random()*60,.6);});}
  else if(T==="elite"){proj.add(a,b,C_E,.35,.5,8);if(Math.random()<.25&&F.list.length<160)F.add(GLOW_BLUE,b,40,.3,.35);}
  else{for(let i=0;i<2;i++)proj.add(slotPos(s.from),slotPos(s.to),s.side==="R"?C_R:C_S,.3+Math.random()*.15,.4,4);if(Math.random()<.08&&F.list.length<160)F.add(GLOW_WARM,b,30,.35,.3);}}
function dropPod(f){for(let i=0;i<5;i++){const b=slotPos(f);const a=b.clone().add(new THREE.Vector3((Math.random()-.5)*800,6500+Math.random()*1500,(Math.random()-.5)*800));
  proj.add(a,b,new THREE.Color(1,.75,.4),2.2+Math.random()*1.6,.18,0,p=>{if(F.list.length<180)F.add(GLOW_WARM,p.clone().setY(p.y+10),160,.9);});}}

/* ---------------- HUD ---------------- */
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function fmt(n){n=Math.round(n);return n>=10000?(n/1000).toFixed(1)+"k":n.toLocaleString("en-US");}
function buildHud(){
  layer=el("div","",null);layer.id="warlayer";$("#app").appendChild(layer);
  hud=el("div","",null);hud.id="warhud";$("#app").appendChild(hud);
  cmd=el("div","panel",null);cmd.id="warcmd";$("#app").appendChild(cmd);
  logEl=el("div","",null);logEl.id="warlog";$("#app").appendChild(logEl);
  boxEl=el("div","",null);boxEl.id="warbox";boxEl.hidden=true;$("#app").appendChild(boxEl);
  toastEl=el("div","",null);toastEl.id="wartoast";$("#app").appendChild(toastEl);
  hud.innerHTML='<div class="side R"><div class="sn">The Solar Republic</div><div class="st" id="wsR"></div></div>'+
    '<div class="mid"><div class="meter"><div class="mR" id="wmR"></div><div class="mS" id="wmS"></div><i></i></div><div class="ml"><span>Republic control</span><span id="wclock">00:00</span><span>Society control</span></div>'+
    '<div class="wctl"><button class="btn" data-w="pause">Pause</button><button class="btn" data-w="speed">Speed 1×</button><button class="btn" data-w="strat">Strategic view</button><button class="btn" data-w="tact">Tactical view</button><button class="btn" data-w="help">Controls</button><button class="btn primary" data-w="exit">Exit War Mode</button></div></div>'+
    '<div class="side S"><div class="sn">The Society</div><div class="st" id="wsS"></div></div>';
  hud.addEventListener("click",e=>{const b=e.target.closest("[data-w]");if(!b)return;const k=b.dataset.w;
    if(k==="pause")setPause(!paused);if(k==="speed"){speed=speed===1?2:speed===2?4:1;b.textContent="Speed "+speed+"×";}
    if(k==="strat")stratView();if(k==="tact")tactView();if(k==="help")showBrief(true);if(k==="exit")exitWar();});
  cmd.addEventListener("click",e=>{const b=e.target.closest("[data-o],[data-sel],[data-dep],[data-at]");if(!b)return;
    if(b.dataset.o){const o=b.dataset.o;if(o==="attack"||o==="move"||o==="capture"){pending=pending===o?null:o;renderCmd();toast(pending?({attack:"Click an enemy formation to attack.",move:"Click the ground to move there.",capture:"Click a stronghold to capture or defend it."})[pending]:"");}else issue(o);}
    if(b.dataset.sel){pick(+b.dataset.sel,e.shiftKey);const f=G.forms.find(x=>x.id===+b.dataset.sel);if(f&&e.detail>1)focusAt(f.x,f.z,1600);}
    if(b.dataset.at){deployAt=b.dataset.at;renderCmd();}
    if(b.dataset.dep){const f=G.callIn(b.dataset.dep,deployAt);if(!f)toast("Can’t deploy now: check the cooldown, reserves and that "+(deployAt==="tyche"?"Tyche":"Heliopolis")+" is held.");renderCmd();}});
  cmd.addEventListener("pointerdown",e=>e.stopPropagation());}
function toast(t){toastEl.textContent=t;toastEl.classList.toggle("on",!!t);clearTimeout(toastEl._t);if(t)toastEl._t=setTimeout(()=>toastEl.classList.remove("on"),3200);}
function setPause(p){paused=p;const b=hud.querySelector('[data-w="pause"]');if(b){b.textContent=p?"Resume":"Pause";b.classList.toggle("primary",p);}}
function updHud(){const tR=G.totals("R"),tS=G.totals("S");
  const line=(t,side)=>'<span><i>'+GLYPH.inf+'</i>'+fmt(t.inf)+'</span><span><i>'+GLYPH.elite+'</i>'+fmt(t.elite)+'</span><span><i>'+GLYPH.armor+'</i>'+fmt(t.armor)+'</span><span class="cas">Lost '+fmt(G.cas[side].inf+G.cas[side].elite)+' · '+fmt(G.cas[side].armor)+' veh</span>';
  $("#wsR").innerHTML=line(tR,"R");$("#wsS").innerHTML=line(tS,"S");
  const m=G.meter/G.WIN;$("#wmR").style.width=Math.max(0,m)*50+"%";$("#wmS").style.width=Math.max(0,-m)*50+"%";
  const s=G.t|0;$("#wclock").textContent=String(s/60|0).padStart(2,"0")+":"+String(s%60).padStart(2,"0");}
function renderCmd(){const list=[...sel].map(id=>G.forms.find(f=>f.id===id)).filter(Boolean);let h='';
  const stateTxt=f=>{if(f.landing>0)return "Deploying";if(f.state==="routing")return '<em class="bad">Routing</em>';const o=f.order;
    const tgt=f.target&&f.engaged?' · <em class="eng">engaging '+esc(f.target.name)+'</em>':'';
    const ob=o.obj?G.objs.find(x=>x.id===o.obj):null;
    return ({idle:"Holding ground",move:"Moving",attack:"Attacking",capture:"Securing "+(ob?ob.name:""),hold:"Holding position",retreat:"Retreating",reinforce:"Reinforcing at "+(ob?ob.name:"")})[o.kind]+tgt;};
  if(list.length){h+='<div class="wh">Selected · '+list.length+' formation'+(list.length>1?"s":"")+'</div><div class="wl">';
    list.slice(0,8).forEach(f=>{const T=G.TYPES[f.type];h+='<button class="wf" data-sel="'+f.id+'"><span class="g">'+GLYPH[f.type]+'</span><span class="fn">'+esc(f.name)+'<small>'+T.label+' · '+fmt(f.count)+' / '+fmt(f.max)+' '+T.word+' · morale '+Math.round(f.morale*100)+'%</small><small class="os">'+stateTxt(f)+'</small></span><b><s style="width:'+(f.count/f.max*100)+'%"></s></b></button>';});
    if(list.length>8)h+='<div class="more">and '+(list.length-8)+' more</div>';
    h+='</div><div class="wo">'+[["move","Move","Right-click ground"],["attack","Attack","Right-click an enemy"],["capture","Capture","Right-click a stronghold"],["hold","Hold","X"],["retreat","Retreat","Z"],["reinforce","Reinforce","V"]].map(([k,l,t])=>'<button class="btn'+(pending===k?" primary":"")+'" data-o="'+k+'" title="'+t+'">'+l+'</button>').join("")+'</div>';}
  else{const mine=G.forms.filter(f=>f.side==="R");h+='<div class="wh">Your formations · '+mine.length+'</div><div class="wl roster">';
    mine.forEach(f=>{h+='<button class="wf" data-sel="'+f.id+'"><span class="g">'+GLYPH[f.type]+'</span><span class="fn">'+esc(f.name)+'<small>'+fmt(f.count)+' '+G.TYPES[f.type].word+' · '+stateTxt(f)+'</small></span><b><s style="width:'+(f.count/f.max*100)+'%"></s></b></button>';});
    h+='</div><p class="tipx">Click or drag a box to select · right-click to order · double-click a unit for all of its type</p>';}
  const D=G.deployState,res=G.reserve.R;
  h+='<div class="wh">Reinforcements · '+D.left+' call'+(D.left===1?"":"s")+' left'+(D.cd>0?' · ready in '+Math.ceil(D.cd)+'s':'')+'</div><div class="wd"><span>Deploy at</span>'+
    ["tyche","heliopolis"].map(id=>{const ob=G.objs.find(x=>x.id===id);return '<button class="chip'+(deployAt===id?" on":"")+(ob.owner!=="R"?" off":"")+'" data-at="'+id+'">'+ob.name+'</button>';}).join("")+'</div><div class="wo">'+
    [["inf","Cohort",3000],["elite","Elite",900],["armor","Armor",40]].map(([k,l,n])=>'<button class="btn" data-dep="'+k+'"'+(D.cd>0||D.left<=0||res[k]<n*.8?" disabled":"")+'>'+GLYPH[k]+' '+l+'<small>'+fmt(res[k])+' in reserve</small></button>').join("")+'</div>';
  cmd.innerHTML=h;}
function updLog(){logEl.innerHTML=G.log.slice(0,6).map(l=>'<div class="'+(l.kind||"")+' '+(l.side||"")+'"><span>'+String((l.t/60)|0).padStart(2,"0")+":"+String((l.t|0)%60).padStart(2,"0")+'</span>'+esc(l.text)+'</div>').join("");}
function showEnemy(f){toast(f.name+" · "+G.TYPES[f.type].label+" · "+fmt(f.count)+" "+G.TYPES[f.type].word+" · morale "+Math.round(f.morale*100)+"%");}

/* ---------------- briefing, victory ---------------- */
function showBrief(help){if(!briefEl){briefEl=el("div","",null);briefEl.id="warbrief";$("#app").appendChild(briefEl);
    briefEl.addEventListener("click",e=>{const b=e.target.closest("[data-b]");if(!b)return;const k=b.dataset.b;if(k==="go"){briefEl.hidden=true;if(!started){started=true;setPause(false);}else setPause(false);}
      if(k.startsWith("d")){diff=+k.slice(1);G.difficulty=diff;briefEl.querySelectorAll("[data-b^=d]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.b===k));}});
    briefEl.addEventListener("pointerdown",e=>e.stopPropagation());}
  briefEl.innerHTML='<div class="wbx"><p class="eyebrow">War Mode · Dark Age</p><h2 class="gild">The Battle of Mercury</h2>'+
    '<p>The Society Remnant has come for Helios. Atalantia’s Iron Rain is falling on the Waste of Ladon. You command the Solar Republic’s legions: hold <b>Tyche</b>, <b>Red Reach</b> and <b>Heliopolis</b>.</p>'+
    '<p class="wr"><b>Victory:</b> fill the control meter by holding strongholds, or destroy every Society legion after its last landing. <b>Defeat:</b> the meter swings fully to the Society, all three strongholds fall, or your armies are gone.</p>'+
    '<div class="wk"><div><b>Left-click / drag</b> select formations</div><div><b>Right-click</b> move · attack an enemy · capture a stronghold</div><div><b>Right-drag · WASD</b> pan &nbsp; <b>Middle-drag · Q/E</b> turn &nbsp; <b>Scroll</b> zoom</div><div><b>X</b> hold · <b>Z</b> retreat · <b>V</b> reinforce · <b>C</b> centre · <b>Space</b> pause · <b>1 2 3</b> jump to Tyche, Red Reach, Heliopolis</div></div>'+
    '<p class="wr">Formations fight on their own when enemies come in range. Holding a stronghold you own gives cover; high ground helps. Badly mauled formations break and run: send them to <b>Reinforce</b> at a stronghold you hold.</p>'+
    (help?'':'<div class="wdf"><span>Difficulty</span><button data-b="d0" aria-pressed="'+(diff===0)+'">Easy</button><button data-b="d1" aria-pressed="'+(diff===1)+'">Normal</button><button data-b="d2" aria-pressed="'+(diff===2)+'">Hard</button></div>')+
    '<button class="btn primary" data-b="go">'+(help?"Back to the battle":"Take command")+'</button><p class="note">Unit strengths and the battle plan are this atlas’s invention, built around the Dark Age setting.</p></div>';
  briefEl.hidden=false;setPause(true);}
function showEnd(){if(endEl)return;endEl=el("div","",null);endEl.id="warend";const win=G.over.winner==="R";
  const row=(l,a,b)=>'<tr><td>'+l+'</td><td>'+a+'</td><td>'+b+'</td></tr>';const c=G.cas;
  endEl.innerHTML='<div class="wbx"><p class="eyebrow">'+(win?"Victory":"Defeat")+' · '+$("#wclock").textContent+'</p><h2 class="gild">'+(win?"Helios holds":"Helios falls")+'</h2><p>'+esc(G.over.why)+'</p>'+
    '<table><tr><th></th><th>Republic</th><th>Society</th></tr>'+row("Troops lost",fmt(c.R.inf+c.R.elite),fmt(c.S.inf+c.S.elite))+row("Vehicles lost",fmt(c.R.armor),fmt(c.S.armor))+row("Strongholds held",G.objs.filter(o=>o.owner==="R").length,G.objs.filter(o=>o.owner==="S").length)+'</table>'+
    '<div class="wo"><button class="btn primary" data-e="again">Fight again</button><button class="btn" data-e="exit">Return to the map</button></div></div>';
  $("#app").appendChild(endEl);endEl.addEventListener("pointerdown",e=>e.stopPropagation());
  endEl.addEventListener("click",e=>{const b=e.target.closest("[data-e]");if(!b)return;if(b.dataset.e==="again"){teardown();setup();showBrief(false);}else exitWar();});}

/* ---------------- orders and selection ---------------- */
function selected(){return [...sel].map(id=>G.forms.find(f=>f.id===id)).filter(f=>f&&f.side==="R");}
function pick(id,add){if(!add)sel.clear();if(add&&sel.has(id))sel.delete(id);else sel.add(id);pending=null;renderCmd();}
function issue(kind,arg){const list=selected();if(!list.length){toast("Select one of your formations first.");pending=null;return;}
  if(kind==="move"&&arg)G.orderGroup(list,"move",arg);else list.forEach(f=>G.order(f,kind,arg));
  pending=null;renderCmd();
  const p=arg&&arg.x!=null?arg:null;if(p&&F.list.length<170)F.add(kind==="attack"?GLOW_WARM:GLOW_BLUE,new THREE.Vector3(p.x,gnd(p.x,p.z)+12,p.z),120,.6);
  toast(({move:"Moving.",attack:"Attacking "+(arg&&arg.name||"")+".",capture:"Securing "+(arg&&arg.name||"")+".",hold:"Holding position.",retreat:"Falling back.",reinforce:"Reinforcing at the nearest stronghold."})[kind]);}
function screenOf(x,y,z){tmpV.set(x,y,z);const p=project(tmpV,camX);return p;}
function formAt(sx,sy){let best=null,bd=30;G.forms.forEach(f=>{const p=screenOf(f.x,gnd(f.x,f.z)+20,f.z);if(!p.front)return;const d=Math.hypot(p.x-sx,p.y-sy);if(d<bd){bd=d;best=f;}});return best;}
function objAtScreen(sx,sy,gp){let best=null;G.objs.forEach(ob=>{if(gp&&Math.hypot(gp.x-ob.x,gp.z-ob.z)<ob.r)best=ob;});if(best)return best;let bd=40;
  G.objs.forEach(ob=>{const p=screenOf(ob.x,gnd(ob.x,ob.z)+60,ob.z);const d=Math.hypot(p.x-sx,p.y-sy);if(p.front&&d<bd){bd=d;best=ob;}});return best;}
function rel(e){const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
let box=null,rdown=null;
W.down=function(e){if(!G||endEl||(briefEl&&!briefEl.hidden))return e.button===0;
  if(e.button===0&&!e.altKey){const p=rel(e);box={x0:p.x,y0:p.y,x1:p.x,y1:p.y,add:e.shiftKey,id:e.pointerId};try{canvas.setPointerCapture(e.pointerId);}catch(_){};return true;}
  if(e.button===2){rdown={x:e.clientX,y:e.clientY};}
  return false;};
W.move=function(e){if(box){const p=rel(e);box.x1=p.x;box.y1=p.y;const w=Math.abs(box.x1-box.x0),h=Math.abs(box.y1-box.y0);
    if(w+h>6){boxEl.hidden=false;const r=canvas.getBoundingClientRect();boxEl.style.left=r.left+Math.min(box.x0,box.x1)+"px";boxEl.style.top=r.top+Math.min(box.y0,box.y1)+"px";boxEl.style.width=w+"px";boxEl.style.height=h+"px";}return true;}
  return false;};
W.up=function(e){if(box&&e.button===0){const b=box;box=null;boxEl.hidden=true;const w=Math.abs(b.x1-b.x0),h=Math.abs(b.y1-b.y0);
    if(w+h>6){if(!b.add)sel.clear();const x0=Math.min(b.x0,b.x1),x1=Math.max(b.x0,b.x1),y0=Math.min(b.y0,b.y1),y1=Math.max(b.y0,b.y1);
      G.forms.forEach(f=>{if(f.side!=="R")return;const p=screenOf(f.x,gnd(f.x,f.z)+20,f.z);if(p.front&&p.x>=x0&&p.x<=x1&&p.y>=y0&&p.y<=y1)sel.add(f.id);});pending=null;renderCmd();}
    else{const f=formAt(b.x0,b.y0);
      if(pending==="attack"){if(f&&f.side==="S")issue("attack",f);else toast("Click an enemy formation.");}
      else if(pending==="move"){const gp=siteGroundHit(e.clientX,e.clientY);if(gp)issue("move",{x:gp.x,z:gp.z});}
      else if(pending==="capture"){const gp=siteGroundHit(e.clientX,e.clientY);const ob=objAtScreen(b.x0,b.y0,gp);if(ob)issue("capture",ob);else toast("Click a stronghold.");}
      else if(f&&f.side==="R")pick(f.id,b.add);else if(f)showEnemy(f);else if(!b.add){sel.clear();renderCmd();}}
    return true;}
  if(e.button===2&&rdown){const moved=Math.hypot(e.clientX-rdown.x,e.clientY-rdown.y)>6;rdown=null;if(moved)return false;
    if(!sel.size)return false;const p=rel(e);const f=formAt(p.x,p.y);if(f&&f.side==="S"){issue("attack",f);return false;}
    const gp=siteGroundHit(e.clientX,e.clientY);const ob=objAtScreen(p.x,p.y,gp);if(ob&&(!gp||Math.hypot(gp.x-ob.x,gp.z-ob.z)<ob.r*1.4)){issue("capture",ob);return false;}
    if(gp)issue("move",{x:gp.x,z:gp.z});return false;}
  return false;};
W.key=function(e){if(!G)return false;const k=e.key.toLowerCase();
  if(endEl)return k!=="escape"?false:true;
  if(briefEl&&!briefEl.hidden){if(k==="escape"||k==="enter"){briefEl.querySelector('[data-b="go"]').click();}return true;}
  if(k===" "){setPause(!paused);e.preventDefault();return true;}
  if(k==="escape"){if(pending){pending=null;renderCmd();}else{sel.clear();renderCmd();}return true;}
  if(k==="x"){issue("hold");return true;}if(k==="z"){issue("retreat");return true;}if(k==="v"){issue("reinforce");return true;}
  if(k==="c"){tactView();return true;}
  if(k==="a"&&(e.ctrlKey||e.metaKey)){G.forms.forEach(f=>{if(f.side==="R")sel.add(f.id);});renderCmd();e.preventDefault();return true;}
  if(k==="1"||k==="2"||k==="3"){const ob=G.objs[+k-1];focusAt(ob.x,ob.z,2600);return true;}
  if(k==="h")return true;
  return false;};

/* ---------------- camera ---------------- */
function focusAt(x,z,r){sctl.tt.set(x,gnd(x,z),z);sctl.tr=r;sctl.tph=Math.min(sctl.tph,1.15);}
function stratView(){sctl.tt.set(150,0,-100);sctl.tr=11800;sctl.tth=0;sctl.tph=.62;}
function tactView(){const list=selected();if(!list.length){const f=G.forms.find(x=>x.side==="R"&&x.engaged)||G.forms.find(x=>x.side==="R");if(f)focusAt(f.x,f.z,1600);return;}
  const x=list.reduce((s,f)=>s+f.x,0)/list.length,z=list.reduce((s,f)=>s+f.z,0)/list.length;focusAt(x,z,1300+Math.min(2500,list.length*200));sctl.tph=1.02;}

/* ---------------- lifecycle ---------------- */
function setup(){G=WARSIM.create({ground:heliosGround,HF,seed:(Date.now()%100000)+1,difficulty:diff});
  root=new THREE.Group();root.name="war";siteRoot.add(root);F=Flashes(root);proj=Proj(700);
  buildObjVis();sel.clear();pending=null;acc=0;started=false;speed=1;
  const sb=hud&&hud.querySelector('[data-w="speed"]');if(sb)sb.textContent="Speed 1×";
  renderCmd();updLog();}
function teardown(){if(root){siteRoot.remove(root);root.traverse(o=>{if(o.geometry)o.geometry.dispose();});}root=null;
  vis.forEach(v=>v.el.remove());vis.clear();objVis.forEach(o=>o.el.remove());objVis=[];if(endEl){endEl.remove();endEl=null;}G=null;}
W.start=function(){if(W.active||curSite!==SITES.helios)return;W.active=true;
  prevBodyCls=["hide-index","hide-dossier","hide-chron"].filter(c=>document.body.classList.contains(c));document.body.classList.add("war-on");
  buildHud();setup();stratView();siteTour=false;showBrief(false);
  if(SITES.helios._flights)SITES.helios._flights.forEach(f=>f.sh.visible=false);};
function exitWar(){const S=SITES.helios;if(S._tog)S._tog.war=false;W.stop();renderDossier();sFly(S.cam);}
W.stop=function(){if(!W.active)return;W.active=false;teardown();[layer,hud,cmd,logEl,boxEl,toastEl,briefEl].forEach(e=>e&&e.remove());layer=hud=cmd=logEl=boxEl=toastEl=briefEl=null;
  document.body.classList.remove("war-on");box=null;rdown=null;};
W.update=function(dt,t){if(!W.active||!G)return;frameN++;
  if(!paused&&!G.over){acc+=dt*speed;let n=0;while(acc>=.1&&n<24){G.step(.1);n++;acc-=.1;G.shots.forEach(shotFx);
      G.events.forEach(ev=>{if(ev.kind==="big"){toast(ev.text);}});
      G.forms.forEach(f=>{if(f.drop&&!vis.has(f.id)){makeVis(f);dropPod(f);}});}
    if(n)updLog();}
  const fx=paused?0:dt*Math.min(speed,2);proj.update(fx);F.update(fx);
  /* formations */
  const alive=new Set(G.forms.map(f=>f.id));[...vis.keys()].forEach(id=>{if(!alive.has(id)){const v=vis.get(id);if(F.list.length<180)F.add(GLOW_WARM,new THREE.Vector3(v.ring.position.x,v.ring.position.y+20,v.ring.position.z),260,1.1);dropVis(id);}});
  const near=sctl.r<5200;const W_=canvas.clientWidth,H_=canvas.clientHeight;
  G.forms.forEach(f=>{let v=vis.get(f.id);if(!v)v=makeVis(f);const y=gnd(f.x,f.z);
    if((frameN+f.id)%2===0||f.moving)placeFigures(f,v,t);
    const s=sel.has(f.id);v.ring.position.set(f.x,y+4,f.z);v.ring.material.opacity=s?.95:f.engaged?.55:.28;v.ring.scale.setScalar(f.type==="armor"?1.25:1);
    const a=Math.atan2(f.hx,f.hz);const bx=f.x-Math.sin(a)*40,bz=f.z-Math.cos(a)*40;v.pole.position.set(bx,gnd(bx,bz),bz);v.flag.position.copy(v.pole.position);v.flag.rotation.y=a+Math.PI/2+Math.sin(t*2+f.id)*.15;
    const o=f.order;if(s&&(o.x!=null||(o.kind==="attack"&&f.target))){const tx=o.x!=null?o.x:f.target.x,tz=o.x!=null?o.z:f.target.z;const pa=v.line.geometry.attributes.position;
      pa.setXYZ(0,f.x,y+14,f.z);pa.setXYZ(1,tx,gnd(tx,tz)+14,tz);pa.needsUpdate=true;v.line.material.color.set(o.kind==="attack"?0xff6a4a:o.kind==="retreat"?0xffd070:0x9fd4ff);v.line.visible=true;}else v.line.visible=false;
    const p=screenOf(f.x,y+(near?52:30),f.z);const vis_=p.front&&p.x>-40&&p.x<W_+40&&p.y>-40&&p.y<H_+40;v.el.style.display=vis_?"":"none";
    if(vis_){v.el.style.transform="translate("+(p.x|0)+"px,"+(p.y|0)+"px) translate(-50%,-100%)";v.el.classList.toggle("sel",s);v.el.classList.toggle("eng",f.engaged);v.el.classList.toggle("rout",f.state==="routing");v.el.classList.toggle("near",near||s);
      const c=Math.round(f.count);if(c!==v.lastCount){v.lastCount=c;v.el.querySelector("s").style.width=(f.count/f.max*100)+"%";v.el.querySelector(".n").textContent=fmt(c);}}});
  /* strongholds */
  objVis.forEach(o=>{const ob=o.ob;const c=colFor(ob.owner,ob.control);o.beam.material.uniforms.c.value.copy(c).multiplyScalar(ob.contested?(.6+.4*Math.sin(t*8)):1);o.ring.material.color.copy(c);o.disc.material.color.copy(c);
    o.disc.material.opacity=ob.owner?.16:.07;
    const p=screenOf(ob.x,o.y+(near?160:80),ob.z);o.el.style.display=p.front?"":"none";o.el.style.transform="translate("+(p.x|0)+"px,"+(p.y|0)+"px) translate(-50%,-100%)";
    o.el.className="wobj "+(ob.owner||"N")+(ob.contested?" cont":"");o.el.querySelector(".ow").textContent=ob.contested?"Contested":ob.owner?SIDE[ob.owner].short:"Neutral";
    const s=o.el.querySelector("s");s.style.width=Math.abs(ob.control)*100+"%";s.style.background=ob.control>=0?SIDE.R.css:SIDE.S.css;});
  if(frameN%6===0){updHud();if(cmd&&!cmd.matches(":hover"))renderCmd();}
  if(G.over&&!endEl)showEnd();};
window.WAR_DBG=W.debug={get G(){return G;},ff(sec){for(let i=0;i<sec*10&&G&&!G.over;i++){G.step(.1);G.forms.forEach(f=>{if(f.drop&&!vis.has(f.id))makeVis(f);});}updLog();},sel(ids){sel.clear();ids.forEach(i=>sel.add(i));renderCmd();},issue,focusAt};
return W;})();

/* ===================== PHONE LAYOUT ===================== */
(function(){
  const dos=dossier,ix=idx;
  const syncMob=()=>{const m=isMob();B.classList.toggle("mob",m);B.classList.toggle("land",m&&innerHeight<=520&&innerWidth>innerHeight);};
  syncMob();addEventListener("resize",syncMob);
  const touch=matchMedia("(hover:none),(pointer:coarse)").matches;
  if(touch){NAVHINT.system="<b>Drag</b> to turn · <b>pinch</b> to zoom · <b>tap</b> a world";
    NAVHINT.globe="<b>Drag</b> to spin · <b>pinch</b> to zoom · <b>tap</b> a place";
    NAVHINT.site="<b>Drag</b> to look · <b>two fingers</b> to move, zoom and turn";}
  if(isMob()&&!B.classList.contains("hide-chron")){setCls("hide-chron",true);syncMapOnly();}
  const setSheet=on=>{B.classList.toggle("sheet-open",on);const h=dos.querySelector(".sheet-handle");if(h)h.setAttribute("aria-expanded",on);if(!on)dos.scrollTop=0;};
  const collapseChron=()=>{if(!B.classList.contains("hide-chron"))$("#chronMin").click();};
  const closeIdx=()=>{ix.classList.remove("open");B.classList.remove("idx-open");$("#indexToggle").setAttribute("aria-expanded",false);};
  /* handle that survives every re-render of the info panel */
  let lastKey="";
  function ensureHandle(){if(dos.querySelector(":scope>.sheet-handle"))return;
    const h=document.createElement("button");h.className="sheet-handle";h.type="button";h.setAttribute("aria-label","Show or hide details");h.setAttribute("aria-expanded",B.classList.contains("sheet-open"));h.innerHTML="<i></i>";
    dos.prepend(h);const t=dos.querySelector("h2");const key=t?t.textContent:"";if(key!==lastKey){lastKey=key;setSheet(false);}}
  new MutationObserver(ensureHandle).observe(dos,{childList:true});ensureHandle();
  dos.addEventListener("click",e=>{if(!B.classList.contains("mob"))return;
    if(e.target.closest(".sheet-handle")){e.stopPropagation();setSheet(!B.classList.contains("sheet-open"));return;}
    if(!B.classList.contains("sheet-open")&&!e.target.closest(".back")){e.stopPropagation();e.preventDefault();setSheet(true);}},true);
  let ty=null;dos.addEventListener("touchstart",e=>{ty=(dos.scrollTop<=0||e.target.closest(".sheet-handle"))?e.touches[0].clientY:null;},{passive:true});
  dos.addEventListener("touchend",e=>{if(ty==null||!B.classList.contains("mob"))return;const dy=e.changedTouches[0].clientY-ty;ty=null;
    if(dy>50&&B.classList.contains("sheet-open"))setSheet(false);else if(dy<-40&&!B.classList.contains("sheet-open"))setSheet(true);},{passive:true});
  /* picking a place on the map opens its details */
  $("#labels").addEventListener("click",e=>{if(!B.classList.contains("mob")||!e.target.closest(".plbl"))return;
    setTimeout(()=>{setSheet(true);const s=dos.querySelector(".place.sel");if(s)s.scrollIntoView({block:"nearest",behavior:"smooth"});},60);});
  /* chronicle and sheet take turns at the bottom of the screen */
  $("#chronMin").addEventListener("click",()=>{if(!B.classList.contains("hide-chron"))closeIdx();});
  document.querySelector(".chron-head").addEventListener("click",e=>{if(B.classList.contains("mob")&&B.classList.contains("hide-chron")&&!e.target.closest("button,a"))$("#chronMin").click();});
  track.addEventListener("click",e=>{if(B.classList.contains("mob")&&e.target.closest(".ev")){hoverSel=null;setTimeout(collapseChron,80);}});
  /* worlds list */
  $("#indexToggle").addEventListener("click",()=>{const o=ix.classList.contains("open");B.classList.toggle("idx-open",o);if(o){collapseChron();setSheet(false);}});
  ix.addEventListener("click",e=>{if(B.classList.contains("mob")&&e.target.closest(".world"))closeIdx();});
  canvas.addEventListener("pointerdown",()=>{if(B.classList.contains("mob")){closeIdx();if(B.classList.contains("sheet-open"))setSheet(false);}});
  /* the seg filter re-renders panels; keep sheet state tidy */
  if(isMob())resize();
})();

/* ===================== HD MAPS (world in view only) ===================== */
(function(){
  const HD=new Set(["callisto","earth","europa","ganymede","io","io_burnt","jupiter","luna","luna4","mars","mercury","neptune","phobos","pluto","rhea","saturn","triton","uranus","venus","deimos","ceres","vesta","pallas","hygiea","mimas","enceladus","tethys","dione","titan","iapetus","miranda","ariel","umbriel","titania","oberon","charon","orcus","haumea","quaoar","makemake","gonggong","eris","sedna","halley"]);
  const HDN={earth:"earth_normal",mars:"mars_normal",luna:"luna_normal",luna4:"luna_normal",europa:"europa_normal",ganymede:"ganymede_normal",callisto:"callisto_normal",ceres:"ceres_normal",tethys:"tethys_normal",dione:"dione_normal",charon:"charon_normal",pallas:"pallas_normal",hygiea:"hygiea_normal",haumea:"haumea_normal",makemake:"makemake_normal",eris:"eris_normal",gonggong:"gonggong_normal",quaoar:"quaoar_normal",sedna:"sedna_normal",orcus:"orcus_normal",halley:"halley_normal"};
  const HDL={io:"io_lights",io_burnt:"io_burnt_lights"},HDC={europa:"europa_clouds"};
  const held={};let heldFor=null;
  const TEX_BASE=window.SOCIETY_TEX_BASE||"";
  const ld=(name,color)=>held[name]||(held[name]=!TEX_BASE?Promise.resolve(null):new Promise(res=>texLoader.load(TEX_BASE+"hd/"+name+".jpg",t=>{t.anisotropy=MAX_ANISO;if(color)t.encoding=THREE.sRGBEncoding;res(t);},undefined,()=>res(null))));
  function release(keep){Object.keys(held).forEach(k=>{if(keep.includes(k))return;held[k].then(t=>{if(t)t.dispose();});delete held[k];});}
  function applyHD(b){if(!b||!globeMesh)return;const sp=specFor(b.id).spec;const name=sp&&sp.map;
    if(!name||!HD.has(name)||b.kind==="sun"){release([]);heldFor=null;return;}
    const nn=HDN[name]||null,nl=HDL[name]||null,nc=HDC[name]||null;release([name,nn,nl,nc].filter(Boolean));heldFor=b.id;
    const mesh=globeMesh,clouds=globeClouds;const opt=x=>x?ld(x,false):Promise.resolve(null);
    Promise.all([ld(name,true),opt(nn),nl?ld(nl,true):Promise.resolve(null),opt(nc)]).then(([m,n,l,c])=>{
      if(mesh!==globeMesh||heldFor!==b.id||!m)return;const mat=mesh.material;
      mat.map=m;if(n){mat.normalMap=n;mat.normalScale=new THREE.Vector2(.9,.9);}if(l&&mat.emissiveMap)mat.emissiveMap=l;mat.needsUpdate=true;
      if(c&&clouds&&clouds===globeClouds){clouds.material.alphaMap=c;clouds.material.needsUpdate=true;}});}
  const _bg=buildGlobe,_rg=refreshGlobe;
  buildGlobe=function(b){_bg(b);applyHD(b);};
  refreshGlobe=function(b){_rg(b);if(mode==="globe"&&cur&&cur.id===b.id)applyHD(b);};
  const _asc=ascend;ascend=function(){_asc();setTimeout(()=>{if(mode==="system"){release([]);heldFor=null;}},1200);};
})();

/* ===================== REAL SOLAR SYSTEM ADDITIONS ===================== */
(function(){
  const V3=THREE.Vector3,D2R=Math.PI/180;
  const NEW_IDS=BODIES.filter(b=>b.real).map(b=>b.id);

  /* ---- Keplerian orbits: tilted and eccentric paths ---- */
  function orbPos(b,E,out){const e=b.ecc||0,a=b.a;
    const x=a*(Math.cos(E)-e),y=a*Math.sqrt(1-e*e)*Math.sin(E);
    const w=(b.peri||0)*D2R,cw=Math.cos(w),sw=Math.sin(w);let px=x*cw-y*sw,pz=x*sw+y*cw,py=0;
    const i=(b.inc||0)*D2R;const pz2=pz*Math.cos(i),py2=-pz*Math.sin(i);pz=pz2;py=py2;
    const n=(b.node||0)*D2R,cn=Math.cos(n),sn=Math.sin(n);return out.set(px*cn+pz*sn,py,-px*sn+pz*cn);}
  function eccAnom(M,e){let E=M;for(let k=0;k<8;k++)E=E-(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E;}
  const KEP=BODIES.filter(b=>b.parent&&(b.ecc||b.inc));
  KEP.forEach(b=>{const o=objs[b.id];if(!o||!o.orbit)return;const pts=[],N=b.ecc>.3?512:256,v=new V3();
    for(let k=0;k<=N;k++){pts.push(orbPos(b,k/N*TAU,v).clone());}
    o.orbit.geometry.dispose();o.orbit.geometry=new THREE.BufferGeometry().setFromPoints(pts);});
  const kv=new V3();
  const _ub=updateBodies;updateBodies=function(){_ub();
    KEP.forEach(b=>{const o=objs[b.id];const p=objs[b.parent].pos;let M=(b.phase+simT/b.period)*TAU*(b.retro?-1:1);
      const E=(b.ecc||0)>0?eccAnom(M,b.ecc):M;orbPos(b,E,kv);o.pos.set(p.x+kv.x,p.y+kv.y,p.z+kv.z);o.grp.position.copy(o.pos);});
    const tr=objs.triton;if(tr&&!byId.triton.inc){const b=byId.triton,p=objs.neptune.pos,a=-(b.phase+simT/b.period)*TAU;tr.pos.set(p.x+Math.cos(a)*b.a,p.y,p.z+Math.sin(a)*b.a);tr.grp.position.copy(tr.pos);}};

  /* ---- shapes, tilts, rings, hazes ---- */
  if(objs.uranus)objs.uranus.mesh.rotation.x=97.8*D2R;
  if(objs.haumea)objs.haumea.mesh.scale.set(1,.51,.8);
  function thinRing(R,inner,outer){const m=new THREE.Mesh(ringGeo(R*inner,R*outer),new THREE.MeshBasicMaterial({color:col(0xe0dcd4),transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false}));
    loadTex("thin_ring",true).then(t=>{if(t){m.material.map=t;m.material.opacity=1;m.material.needsUpdate=true;}});m.rotation.x=-Math.PI/2;return m;}
  if(objs.haumea)objs.haumea.grp.add(thinRing(byId.haumea.size,2.05,2.4));
  if(objs.quaoar)objs.quaoar.grp.add(thinRing(byId.quaoar.size,7.1,7.6));
  Object.assign(ATMO,{titan:[0xe8a04a,1.9],enceladus:[0xcfe6ff,.25],ceres:[0x9a9590,.08],vesta:[0x9a9590,.06],pallas:[0x9a9590,.06],hygiea:[0x9a9590,.05],deimos:[0x9a9590,.06],
    mimas:[0xc8d8e8,.12],tethys:[0xc8d8e8,.12],dione:[0xc8d8e8,.12],iapetus:[0xa8a090,.1],miranda:[0xb8c8d8,.12],ariel:[0xb8c8d8,.12],umbriel:[0x9aa0a8,.08],titania:[0xb8c0c8,.1],oberon:[0xb8b0a8,.1],
    charon:[0xb8b4b0,.12],orcus:[0xb8c4d8,.14],haumea:[0xdde8ff,.2],quaoar:[0xc8a090,.12],makemake:[0xe0b090,.18],gonggong:[0xd08060,.14],eris:[0xe8e8f0,.2],sedna:[0xe07050,.16],halley:[0x9ab8d0,.5]});
  if(objs.titan)objs.titan.grp.add(makeAtmo("titan",byId.titan.size,1.12));

  /* Halley's tails: gas (blue) and dust (cream), longest near the Sun */
  const hal=objs.halley;let tails=null;
  if(hal){const mk=(c,o)=>{const g=new THREE.ConeGeometry(1,1,24,1,true);g.translate(0,-.5,0);
      return new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:col(c),transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));};
    tails=[mk(0x7fb6ff,.22),mk(0xfff0d0,.14)];tails.forEach(t=>hal.grp.add(t));hal.grp.add(glowSprite(GLOW_BLUE,1.2,.8));}
  const up=new V3(0,-1,0),dv=new V3();
  function updTails(){if(!tails)return;const p=hal.pos,d=p.length();const k=Math.min(1,Math.pow(30/Math.max(d,1),1.6));
    dv.copy(p).normalize();const L=.4+16*k,W=.15+1.4*k;
    tails[0].scale.set(W*.6,L,W*.6);tails[0].quaternion.setFromUnitVectors(up,dv);
    tails[1].scale.set(W,L*.7,W);const dust=dv.clone().add(new V3(-p.z,0,p.x).normalize().multiplyScalar(.25)).normalize();tails[1].quaternion.setFromUnitVectors(up,dust);
    tails.forEach(t=>t.visible=k>.02);}

  /* ---- Kuiper Belt, scattered disc, Oort Cloud ---- */
  function cloud(n,fn,c,size,op){const g=new THREE.BufferGeometry(),p=new Float32Array(n*3),R=rng(n+5);
    for(let i=0;i<n;i++){const v=fn(R);p[i*3]=v[0];p[i*3+1]=v[1];p[i*3+2]=v[2];}
    g.setAttribute("position",new THREE.BufferAttribute(p,3));
    const pts=new THREE.Points(g,new THREE.PointsMaterial({color:col(c),size,sizeAttenuation:false,transparent:true,opacity:op,depthWrite:false}));sys.add(pts);return pts;}
  const kuiper=cloud(7000,R=>{const a=R()*TAU,r=118+Math.pow(R(),.8)*34,t=(R()+R()-1)*.12;return [Math.cos(a)*r,r*t*(.3+R()),Math.sin(a)*r];},0xa8b8c8,1.25,.55);
  const scattered=cloud(1400,R=>{const a=R()*TAU,r=150+Math.pow(R(),1.6)*130,inc=(R()-.5)*1.3;return [Math.cos(a)*r,Math.sin(a)*r*Math.sin(inc)*.6,Math.sin(a)*r*Math.cos(inc)];},0x9aa6b4,1.1,.4);
  const hills=cloud(4000,R=>{const a=R()*TAU,r=560+R()*200,y=(R()+R()+R()-1.5)*90;return [Math.cos(a)*r,y,Math.sin(a)*r];},0xb8c6d8,1.2,.0);
  const oort=cloud(12000,R=>{const u=R()*2-1,t=R()*TAU,s=Math.sqrt(1-u*u),r=760+Math.pow(R(),.7)*360;return [s*Math.cos(t)*r,u*r,s*Math.sin(t)*r];},0xa8c4ff,1.35,.0);
  const REG=[
    {id:"kuiper",name:"Kuiper Belt",title:"The Kuiper Belt",text:"A ring of icy bodies beyond Neptune, about 30 to 50 AU from the Sun. Pluto, Haumea, Makemake and Quaoar live here, and many short-period comets start here. New Horizons flew past the Kuiper Belt object Arrokoth in 2019."},
    {id:"scattered",name:"Scattered disc",title:"The Scattered Disc",text:"Icy bodies flung onto long, tilted orbits by Neptune long ago, reaching from about 30 AU to well past 100 AU. Eris and Gonggong travel here."},
    {id:"oort",name:"Oort Cloud · not to scale",title:"The Oort Cloud",text:"A vast shell of icy bodies thought to surround the Solar System, from about 2,000 to 100,000 AU or more. No one has seen it directly; astronomers infer it from long-period comets falling in from every direction. Drawn here thousands of times closer than its true size."}];
  REG.forEach(r=>{const el=document.createElement("button");el.className="lbl region";el.textContent=r.name;labelsEl.appendChild(el);r.el=el;
    el.addEventListener("click",()=>showBanner(r.title,r.text,"Region of the Solar System"));});
  const cw0=new V3(),cu=new V3(),anc=new V3();
  function updRegions(){const sysOn=mode==="system";const far=ctl.r;
    kuiper.material.opacity=.55;scattered.material.opacity=Math.min(.4,Math.max(0,(far-140)/200)*.4);
    const oo=Math.min(1,Math.max(0,(far-260)/420));hills.material.opacity=oo*.45;oort.material.opacity=oo*.62;hills.visible=oort.visible=oo>0;
    cw0.copy(camS.position).sub(ctl.target).normalize();cu.set(0,1,0).applyQuaternion(camS.quaternion);
    REG.forEach(r=>{let vis=sysOn,op=1;
      if(r.id==="kuiper"){anc.set(-camS.position.x,0,-camS.position.z).normalize().multiplyScalar(150);op=far>90?1:0;}
      else if(r.id==="scattered"){anc.set(-camS.position.x,0,-camS.position.z).normalize().multiplyScalar(230);anc.y=40;op=far>200?1:0;}
      else{anc.copy(cw0).multiplyScalar(-.8).addScaledVector(cu,.6).normalize().multiplyScalar(800).add(ctl.target);op=oo;}
      const p=project(anc,camS);vis=vis&&p.front&&op>.05;r.el.style.opacity=vis?op:0;r.el.style.pointerEvents=vis?"auto":"none";
      if(vis)r.el.style.transform="translate("+p.x.toFixed(1)+"px,"+p.y.toFixed(1)+"px) translate(-50%,-50%)";});}

  /* ---- volcanic and geyser plumes ---- */
  let dotTex=null;function dot(){if(dotTex)return dotTex;const c=document.createElement("canvas");c.width=c.height=64;const g=c.getContext("2d");
    const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,"rgba(255,255,255,1)");gr.addColorStop(.4,"rgba(255,255,255,.45)");gr.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gr;g.fillRect(0,0,64,64);
    dotTex=new THREE.CanvasTexture(c);return dotTex;}
  function plumes(grp,R,vents,o){const G=new THREE.Group();grp.add(G);const sets=[];
    vents.forEach(v=>{if(!(o&&o.escape))v.h*=1.5;const n=v.n||520,pos=new Float32Array(n*3),seed=[];const R0=rng(v.lat*977+v.lon*31+n);
      const nrm=latLonVec(v.lat,v.lon,1).normalize();const t1=new V3(0,1,0).cross(nrm);if(t1.lengthSq()<1e-6)t1.set(1,0,0);t1.normalize();const t2=nrm.clone().cross(t1);
      for(let i=0;i<n;i++)seed.push({ph:R0(),az:R0()*TAU,sp:Math.pow(R0(),.6)*(v.spread||1),k:.75+R0()*.5,j:R0()});
      const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));
      const m=new THREE.PointsMaterial({color:col(v.color),size:(v.size||.035)*(o&&o.escape?1.6:2.2),map:dot(),transparent:true,opacity:v.op||.75,depthWrite:false,blending:THREE.AdditiveBlending});
      const pts=new THREE.Points(g,m);G.add(pts);
      const base=nrm.clone().multiplyScalar(R*1.002);
      if(v.glow){const s=glowSprite(GLOW_WARM,v.glow,.9);s.position.copy(nrm.clone().multiplyScalar(R*1.01));G.add(s);}
      sets.push({v,pos,seed,nrm,t1,t2,base,g,T:v.period||3.2});});
    let t=0;const tmpv=new V3();
    G.userData.fixed=true;G.userData.update=dt=>{t+=dt;sets.forEach(S=>{const {v,pos,seed,nrm,t1,t2,base,T}=S;const Hh=v.h*R,Rr=(v.reach||0)*R;
      for(let i=0;i<seed.length;i++){const s=seed[i];let f=((t/T*s.k)+s.ph)%1;
        let hgt,rad;if(o&&o.escape){hgt=Hh*f*(.6+s.k*.5);rad=Hh*f*.12*s.sp+Rr*f*s.sp;}
        else{hgt=Hh*4*f*(1-f)*s.k;rad=Rr*f*s.sp;}
        const ca=Math.cos(s.az),sa=Math.sin(s.az);
        tmpv.copy(base).addScaledVector(nrm,hgt).addScaledVector(t1,ca*rad).addScaledVector(t2,sa*rad);
        pos[i*3]=tmpv.x;pos[i*3+1]=tmpv.y;pos[i*3+2]=tmpv.z;}
      S.g.attributes.position.needsUpdate=true;});};
    return G;}
  /* Io's best-known volcanoes; east longitude = −(west longitude) on this map */
  GLOBE_EXTRAS.io=(grp,R)=>plumes(grp,R,[
    {lat:-19,lon:105,h:.17,reach:.33,color:0xffb080,n:900,size:.04,glow:.25,period:4.2},   /* Pele: the great red-ringed umbrella */
    {lat:63,lon:-124,h:.21,reach:.3,color:0xffd2a0,n:900,size:.04,glow:.22,period:4.6},    /* Tvashtar */
    {lat:-1.5,lon:-153,h:.055,reach:.1,color:0xd8ecff,n:420,size:.03,glow:.14,period:2.4}, /* Prometheus */
    {lat:13,lon:51,h:.06,reach:.1,color:0xffc890,n:360,size:.03,glow:.3,period:2.6},       /* Loki */
    {lat:24,lon:-115,h:.045,reach:.08,color:0xe0f0ff,n:300,size:.028,glow:.12,period:2.2}, /* Amirani */
    {lat:-50,lon:-54,h:.06,reach:.1,color:0xe8f0ff,n:300,size:.028,glow:.12,period:2.5},   /* Masubi */
    {lat:-28,lon:150,h:.05,reach:.09,color:0xffd8b0,n:300,size:.028,glow:.14,period:2.3}   /* Marduk */
  ]);
  /* Enceladus: jets from the four tiger stripes near the south pole */
  GLOBE_EXTRAS.enceladus=(grp,R)=>{const v=[];const R0=rng(42);
    for(let s=0;s<4;s++)for(let j=0;j<8;j++){v.push({lat:-87+s*3.2+R0()*1.5,lon:-150+j*38+R0()*12+s*9,h:.55+R0()*.5,reach:.05,spread:1,color:0xe6f2ff,n:140,size:.03,op:.5,period:3+R0()*2});}
    return plumes(grp,R,v,{escape:true});};
  GLOBE_EXTRAS.titan=(grp,R)=>{const g=new THREE.Group();grp.add(g);
    g.add(new THREE.Mesh(new THREE.SphereGeometry(R*1.035,96,64),new THREE.MeshPhongMaterial({color:col(0xd99a52),transparent:true,opacity:.42,depthWrite:false,shininess:4})));g.userData.fixed=true;return g;};
  GLOBE_EXTRAS.haumea=(grp,R)=>{const g=new THREE.Group();grp.add(g);if(globeMesh)globeMesh.scale.set(1,.51,.8);if(globeAtmo)globeAtmo.scale.set(1,.51,.8);g.add(thinRing(R,2.05,2.4));g.userData.fixed=true;return g;};
  GLOBE_EXTRAS.quaoar=(grp,R)=>{const g=new THREE.Group();grp.add(g);g.add(thinRing(R,7.1,7.6));g.userData.fixed=true;return g;};
  GLOBE_EXTRAS.halley=(grp,R)=>{const g=new THREE.Group();grp.add(g);if(globeMesh)globeMesh.scale.set(1,.55,.6);if(globeAtmo)globeAtmo.visible=false;
    const jets=plumes(g,R,[{lat:30,lon:20,h:1.4,reach:.2,color:0xcfe0ff,n:500,size:.05,op:.4,period:5},{lat:-10,lon:-80,h:1.1,reach:.2,color:0xcfe0ff,n:400,size:.05,op:.35,period:4}],{escape:true});
    g.userData.fixed=true;g.userData.update=dt=>jets.userData.update(dt);return g;};

  /* ---- planet view: pull back to see the moons ---- */
  const MS={grp:null,items:[],body:null,maxZ:16};
  function clearMS(){if(MS.grp){glb.remove(MS.grp);MS.grp.traverse(o=>{if(o.geometry)o.geometry.dispose();});}MS.items.forEach(it=>it.el.remove());MS.items=[];MS.grp=null;MS.body=null;}
  function buildMS(b){clearMS();const moons=BODIES.filter(m=>m.parent===b.id&&m.moon);if(!moons.length)return;
    MS.body=b.id;MS.grp=new THREE.Group();glb.add(MS.grp);let outer=0;
    moons.forEach(m=>{const dist=GR*(1+1.6*m.a/b.size),r=GR*Math.min(.5,Math.max(.04,m.size/b.size));outer=Math.max(outer,dist);
      const t=REAL[m.id]||procSet(m,256,128);const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,48,32),makeMat(m,t,"sys"));
      if(m.shape)mesh.scale.set(m.shape[0],m.shape[1],m.shape[2]);else if(m.id==="haumea")mesh.scale.set(1,.51,.8);
      const piv=new THREE.Group();const tilt=new THREE.Group();tilt.rotation.x=((m.inc||0)%90>0&&b.id!=="uranus"&&b.id!=="saturn"?(m.inc*D2R):0);
      tilt.add(piv);piv.add(mesh);mesh.position.x=dist;MS.grp.add(tilt);
      const pts=[];for(let k=0;k<=160;k++){const a=k/160*TAU;pts.push(new V3(Math.cos(a)*dist,0,Math.sin(a)*dist));}
      tilt.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:col(0xd9aa52),transparent:true,opacity:.2})));
      const el=document.createElement("button");el.className="lbl moon msys";el.textContent=m.name;el.style.opacity=0;labelsEl.appendChild(el);
      el.addEventListener("click",()=>{if(el.style.opacity>.1)switchGlobe(m);});
      MS.items.push({m,piv,mesh,el,ang:(m.phase||0)*TAU,sp:(m.retro?-1:1)*TAU/(Math.max(2,m.period)*4)});});
    const asp=Math.min(1,Math.max(.35,canvas.clientWidth/Math.max(1,canvas.clientHeight)));
    MS.maxZ=Math.max(16,outer*1.18/(Math.tan(18*D2R)*asp));}
  const _bg2=buildGlobe;buildGlobe=function(b){_bg2(b);buildMS(b);
    const has=MS.items.length>0;if(B.classList.contains("mob")||matchMedia("(hover:none)").matches)NAVHINT.globe="<b>Drag</b> to spin · <b>pinch</b> to zoom"+(has?" · <b>pinch out</b> to see its moons":"")+" · <b>tap</b> a place";
    else NAVHINT.globe="<b>Drag</b> to spin · <b>scroll</b> to zoom"+(has?" · <b>scroll out</b> to see its moons":"")+" · click a place";};
  const ray2=new THREE.Raycaster(),mv2=new THREE.Vector2();let downAt=null;
  canvas.addEventListener("pointerdown",e=>{downAt={x:e.clientX,y:e.clientY};});
  canvas.addEventListener("pointerup",e=>{if(!downAt||mode!=="globe"||!MS.items.length)return;const d=Math.hypot(e.clientX-downAt.x,e.clientY-downAt.y);downAt=null;if(d>8||gZoom.z<18)return;
    const r=canvas.getBoundingClientRect();mv2.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray2.setFromCamera(mv2,camG);
    const hit=ray2.intersectObjects(MS.items.map(i=>i.mesh),false)[0];if(hit){const it=MS.items.find(i=>i.mesh===hit.object);if(it)switchGlobe(it.m);}});
  const wp=new V3();let lastT=performance.now();
  function updMS(dt){const on=mode==="globe"&&MS.grp&&cur&&cur.id===MS.body;
    if(MS.grp)MS.grp.visible=!!on;
    if(!on){MS.items.forEach(it=>{it.el.style.opacity=0;it.el.style.pointerEvents="none";});B.classList.remove("far-sys");return;}
    gZoom.max=Math.max(gZoom.max,MS.maxZ);
    MS.grp.rotation.set(gRot.x,gRot.y,0);
    const fade=Math.min(1,Math.max(0,(gZoom.z-19)/8));B.classList.toggle("far-sys",fade>.3);
    MS.items.forEach(it=>{it.ang+=dt*it.sp;it.piv.rotation.y=-it.ang;it.mesh.rotation.y+=dt*.2;
      it.mesh.getWorldPosition(wp);const p=project(wp,camG);
      const hidden=wp.z<0&&Math.hypot(wp.x,wp.y)<GR*1.05;
      const vis=p.front&&fade>.02&&!hidden;it.el.style.opacity=vis?fade:0;it.el.style.pointerEvents=vis&&fade>.5?"auto":"none";
      if(vis)it.el.style.transform="translate("+p.x.toFixed(1)+"px,"+(p.y+14).toFixed(1)+"px) translate(-50%,0)";});}

  (function loop(now){const dt=Math.min(.1,(now-lastT)/1000);lastT=now;
    if(mode==="globe")gZoom.max=Math.max(gZoom.max,isMob()?34:22);
    try{updRegions();updTails();updMS(dt);}catch(err){console.error(err);}
    requestAnimationFrame(loop);})(performance.now());
})();

/* ===================== EASTER EGGS, ERUPTIONS, SEA MONSTERS, SKY REFLECTIONS ===================== */
(function(){
  const V3=THREE.Vector3;

  /* ---- odd-shaped little moons ---- */
  BODIES.forEach(b=>{if(b.shape&&objs[b.id])objs[b.id].mesh.scale.set(b.shape[0],b.shape[1],b.shape[2]);});
  BODIES.filter(b=>b.shape).forEach(b=>{GLOBE_EXTRAS[b.id]=(grp,R)=>{const g=new THREE.Group();grp.add(g);
    if(globeMesh)globeMesh.scale.set(b.shape[0],b.shape[1],b.shape[2]);if(globeAtmo)globeAtmo.visible=false;g.userData.fixed=true;return g;};});

  /* ---- sky reflections in city scenes: an environment map rendered from the live sky ---- */
  let envRT=null,envSig="";
  function updEnv(){if(mode!=="site"||!curSite||tod.t<1)return;if(!site3.environment)envSig="";
    const u=skyMat.uniforms;const sig=[curSiteKey,u.top.value.getHexString(),u.hor.value.getHexString(),u.sunDir.value.x.toFixed(2),u.sunDir.value.y.toFixed(2)].join("|");
    if(sig===envSig)return;envSig=sig;
    try{const rt=pmrem.fromScene(skyOnlyScene(),.03);if(envRT)envRT.dispose();envRT=rt;site3.environment=rt.texture;
      site3.traverse(o=>{const m=o.material;if(m&&m.isMeshStandardMaterial&&!m.userData.envTuned){m.userData.envTuned=1;if(m.roughness>.85)m.envMapIntensity=.3;}});}catch(e){console.warn(e);}}

  /* ===================== GPU eruption plumes ===================== */
  const PLUME_VS=`
    attribute vec4 aSeed;attribute float aType;
    uniform float uTime,uH,uReach,uPeriod,uScale,uSize,uEscape;uniform vec3 uBase,uN,uT1,uT2;
    varying float vAge;varying float vType;varying float vRnd;
    void main(){
      float T=uPeriod*(.75+aSeed.w*.5);float az=aSeed.y*6.2832;float h,r,age,sz;
      if(aType<.5){            /* lava fountain: incandescent spatter, low and fast */
        float f=fract(uTime/(T*.32)+aSeed.x);float hh=uH*.2*(.45+aSeed.w*.8);
        h=4.*hh*f*(1.-f);r=uReach*.1*aSeed.z*f;age=f;sz=uSize*(.55+aSeed.w*.5);
      }else if(aType<1.5){     /* gas and dust: the tall umbrella canopy */
        float f=fract(uTime/T+aSeed.x);
        if(uEscape>.5){h=uH*f*(.55+aSeed.w*.7);r=uReach*aSeed.z*f*.6+uH*f*.08*aSeed.z;}
        else{h=4.*uH*f*(1.-f)*(.82+aSeed.w*.3);r=uReach*aSeed.z*f;}
        age=f;sz=uSize*(.8+f*1.6);
      }else{                   /* smoke and fumes: rise, spread, drift, linger */
        float g=fract(uTime/(T*2.4)+aSeed.x);h=uH*(1.-pow(1.-g,2.2))*(.55+aSeed.w*.45);
        r=uReach*(.08+g*.95)*aSeed.z;age=g;sz=uSize*(2.2+g*7.);
      }
      vec3 p=uBase+uN*h+(uT1*cos(az)+uT2*sin(az))*r+uT1*(aType>1.5?age*uReach*.25:0.);
      vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
      gl_PointSize=clamp(sz*uScale/max(.001,-mv.z),1.,96.);
      vAge=age;vType=aType;vRnd=aSeed.w;}`;
  const PLUME_FS=`
    uniform vec3 uGas;uniform float uSmoke,uOp;varying float vAge;varying float vType;varying float vRnd;
    void main(){vec2 c=gl_PointCoord-.5;float d=length(c);if(d>.5)discard;float soft=smoothstep(.5,.0,d);
      vec3 col;float a;
      if(vType<.5){float t=vAge;col=mix(vec3(1.,.95,.7),vec3(1.,.5,.12),smoothstep(.0,.35,t));col=mix(col,vec3(.55,.1,.03),smoothstep(.35,.85,t));
        a=soft*(1.-smoothstep(.7,1.,t))*1.2;col*=1.6;}
      else if(vType<1.5){col=uGas*(.8+.4*vRnd);a=soft*soft*.55*sin(3.1416*vAge);}
      else{col=mix(vec3(.32,.26,.2),vec3(.55,.5,.44),vRnd);a=soft*soft*.28*sin(3.1416*vAge);}
      if(uSmoke>.5){if(vType<1.5)discard;}else{if(vType>1.5)discard;}
      gl_FragColor=vec4(col,a*uOp);}`;
  let plumeScale={value:400};
  function plumesV2(grp,R,vents,o){o=o||{};const G=new THREE.Group();grp.add(G);const mats=[];
    vents.forEach(v=>{const nL=o.escape?0:(v.lava||260),nG=v.n||600,nS=o.escape?0:(v.smoke||220),n=nL+nG+nS;const R0=rng((v.lat*977+v.lon*31+n)|0);
      const seed=new Float32Array(n*4),type=new Float32Array(n),pos=new Float32Array(n*3);
      for(let i=0;i<n;i++){seed[i*4]=R0();seed[i*4+1]=R0();seed[i*4+2]=Math.pow(R0(),.55);seed[i*4+3]=R0();type[i]=i<nL?0:i<nL+nG?1:2;}
      const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));g.setAttribute("aSeed",new THREE.BufferAttribute(seed,4));g.setAttribute("aType",new THREE.BufferAttribute(type,1));
      g.boundingSphere=new THREE.Sphere(new V3(),R*3);
      const nrm=latLonVec(v.lat,v.lon,1).normalize();const t1=new V3(0,1,0).cross(nrm);if(t1.lengthSq()<1e-6)t1.set(1,0,0);t1.normalize();const t2=nrm.clone().cross(t1);
      const U={uTime:{value:0},uH:{value:v.h*R},uReach:{value:(v.reach||0)*R},uPeriod:{value:v.period||3},uScale:plumeScale,uSize:{value:(v.size||.03)*R/3},uEscape:{value:o.escape?1:0},
        uBase:{value:nrm.clone().multiplyScalar(R*1.002)},uN:{value:nrm},uT1:{value:t1},uT2:{value:t2},uGas:{value:col(v.color||0xe8dcc8)},uOp:{value:v.op||1}};
      const add=new THREE.ShaderMaterial({uniforms:Object.assign({},U,{uSmoke:{value:0}}),vertexShader:PLUME_VS,fragmentShader:PLUME_FS,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
      const smk=new THREE.ShaderMaterial({uniforms:Object.assign({},U,{uSmoke:{value:1}}),vertexShader:PLUME_VS,fragmentShader:PLUME_FS,transparent:true,depthWrite:false,blending:THREE.NormalBlending});
      if(nS){const ps=new THREE.Points(g,smk);ps.renderOrder=2;G.add(ps);mats.push(smk);}
      const pa=new THREE.Points(g,add);pa.renderOrder=3;G.add(pa);mats.push(add);
      if(v.glow){const s=glowSprite(GLOW_WARM,v.glow,.95);s.position.copy(nrm.clone().multiplyScalar(R*1.012));G.add(s);
        const s2=glowSprite(GLOW_WARM,v.glow*2.6,.35);s2.position.copy(s.position);G.add(s2);}});
    let t=0;G.userData.fixed=true;G.userData.update=dt=>{t+=dt;mats.forEach(m=>m.uniforms.uTime.value=t);};return G;}
  GLOBE_EXTRAS.io=(grp,R)=>plumesV2(grp,R,[
    {lat:-19,lon:105,h:.24,reach:.38,color:0xf2c49a,n:1100,lava:380,smoke:320,size:.045,glow:.3,period:4.6},  /* Pele */
    {lat:63,lon:-124,h:.28,reach:.32,color:0xf5d8b0,n:1100,lava:380,smoke:300,size:.045,glow:.26,period:5},   /* Tvashtar */
    {lat:-1.5,lon:-153,h:.08,reach:.13,color:0xd8ecff,n:520,lava:160,smoke:200,size:.034,glow:.16,period:2.8},/* Prometheus */
    {lat:13,lon:51,h:.09,reach:.13,color:0xf0caa0,n:460,lava:260,smoke:220,size:.034,glow:.34,period:3},     /* Loki */
    {lat:24,lon:-115,h:.07,reach:.11,color:0xe0f0ff,n:380,lava:140,smoke:160,size:.03,glow:.14,period:2.6},   /* Amirani */
    {lat:-50,lon:-54,h:.09,reach:.12,color:0xe8f0ff,n:380,lava:140,smoke:160,size:.03,glow:.14,period:2.9},   /* Masubi */
    {lat:-28,lon:150,h:.075,reach:.11,color:0xf5dcc0,n:380,lava:180,smoke:180,size:.03,glow:.16,period:2.7}   /* Marduk */
  ]);
  /* Enceladus: ice jets from the four south-pole tiger stripes, escaping to space */
  GLOBE_EXTRAS.enceladus=(grp,R)=>{const v=[];const R0=rng(42);
    for(let s=0;s<4;s++)for(let j=0;j<9;j++)v.push({lat:-88+s*3+R0()*1.4,lon:-160+j*36+R0()*12+s*9,h:.9+R0()*.9,reach:.1,color:0xe6f2ff,n:220,size:.028,op:.75,period:3.4+R0()*2});
    const G=plumesV2(grp,R,v,{escape:true});
    /* the haze of ice the jets feed, trailing along the moon's orbit (Saturn's E ring) */
    const halo=glowSprite(GLOW_BLUE,R*1.4,.35);halo.position.set(0,-R*1.15,0);G.add(halo);return G;};

  /* Saturn's E ring, fed by Enceladus */
  function eRingTex(){const c=document.createElement("canvas");c.width=256;c.height=1;const g=c.getContext("2d");const gr=g.createLinearGradient(0,0,256,0);
    gr.addColorStop(0,"rgba(190,215,255,0)");gr.addColorStop(.3,"rgba(190,215,255,.9)");gr.addColorStop(.45,"rgba(200,225,255,1)");gr.addColorStop(1,"rgba(190,215,255,0)");g.fillStyle=gr;g.fillRect(0,0,256,1);return new THREE.CanvasTexture(c);}
  const ERT=eRingTex();
  function eRing(inner,outer,op){return new THREE.Mesh(ringGeo(inner,outer),new THREE.MeshBasicMaterial({map:ERT,transparent:true,opacity:op,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending,color:col(0x9fc4ff)}));}
  if(objs.saturn){const sz=byId.saturn.size;const r=eRing(sz*2.45,sz*3.5,.22);r.rotation.x=-Math.PI/2+.38;objs.saturn.grp.add(r);}
  const prevSat=GLOBE_EXTRAS.saturn;
  GLOBE_EXTRAS.saturn=(grp,R)=>{const g=new THREE.Group();grp.add(g);const d=R*(1+1.6*5.85/2.2);const r=eRing(d*.78,d*1.5,.18);r.rotation.x=-Math.PI/2;g.add(r);g.userData.fixed=true;if(prevSat)prevSat(grp,R);return g;};

  /* ===================== the Demiurge, drinking from the Sun ===================== */
  function makeDemiurge(o){o=o||{};const R=rng(1918);const B=new GeoBuilder();
    const OB=0x1a181d,OB2=0x24212a,OB3=0x302c34,TRIM=0x7a6234,LIT=0xffb050,LIT2=0xffd890;
    /* hull: a blade-prowed keel under a stepped cathedral */
    B.add(frustum(62,24,20,10,8),TM(-6,0,0),OB2,0);B.add(frustum(30,10,8,.6,.6,-1),TM(40,0,0),OB,1);
    B.add(frustum(70,14,6,6,3),TM(-2,-11,0),OB,0);
    /* stern castle: three stacked tiers, like a cathedral west front */
    [[26,24,26,-31,10],[19,16,20,-31,34],[12,12,13,-32,50]].forEach((t,i)=>{B.add(G.box(t[0],t[1],t[2]),TM(t[3],t[4]-t[1]/2+t[1]/2,0),i%2?OB3:OB2,0);});
    /* nave with gabled roof running forward */
    B.add(G.box(44,10,13),TM(2,10,0),OB2,0);B.add(G.gable(13,7,44),TM(2,20,0,Math.PI/2),OB,0);
    /* buttress arches along both flanks */
    for(let k=0;k<9;k++){const x=-14+k*5.4;[1,-1].forEach(s=>{B.add(new THREE.BoxGeometry(1.2,14,1.2),TM(x,9,s*9.6,0,1,1,1,s*.55,0),OB3);
      B.add(G.arch(4.4,9,1,.7),TM(x+2.7,1,s*12.3,Math.PI/2),OB3);B.add(new THREE.BoxGeometry(2.2,4.5,.2),TM(x+2.7,3.2,s*12.2),k%3?LIT:LIT2,2,true);});}
    /* rose window on the stern */
    B.add(new THREE.TorusGeometry(7,1,8,36).rotateY(Math.PI/2),TM(-44.2,28,0),TRIM);B.add(new THREE.CircleGeometry(6.4,36).rotateY(-Math.PI/2),TM(-44.3,28,0),0xb86a28,2,true);
    for(let k=0;k<12;k++){B.add(new THREE.BoxGeometry(.3,12.5,.5),TM(-44.4,28,0,0,1,1,1,k/12*Math.PI,0),OB);}
    /* spires: great towers at the stern corners, a forest of pinnacles everywhere else */
    [[-40,24,12,40],[-40,24,-12,40],[-22,24,12,32],[-22,24,-12,32],[-31,56,0,46]].forEach(t=>{B.add(G.cyl(2.2,2.8,t[3]*.35,8),TM(t[0],t[1],t[2]),OB2,0);B.add(G.cone(2.6,t[3]*.75,8),TM(t[0],t[1]+t[3]*.35,t[2]),OB3);
      for(let q=0;q<6;q++){const a=q/6*TAU;B.add(G.cone(.5,t[3]*.22,4),TM(t[0]+Math.cos(a)*3,t[1]+t[3]*.3,t[2]+Math.sin(a)*3),TRIM);}});
    for(let k=0;k<150;k++){const x=-44+R()*80;const top=x<-18?(R()<.5?22:46):x<26?20:8*(1-(x-26)/30)+4;const z=(R()-.5)*(x<26?24:12);const h=2+R()*R()*12;
      B.add(G.cone(.35+R()*.7,h,4+((R()*3)|0)),TM(x,top,z),R()<.12?TRIM:R()<.5?OB3:OB2);}
    /* hanging spires under the keel */
    for(let k=0;k<46;k++){const x=-40+R()*76;const h=4+R()*R()*26;B.add(new THREE.ConeGeometry(.6+R()*1.6,h,5).translate(0,-h/2,0),TM(x,-13,(R()-.5)*12),R()<.5?OB:OB2);}
    /* rows of lit windows down the hull */
    for(let row=0;row<4;row++)for(let k=0;k<44;k++){const x=-42+k*1.9;if(R()<.35)continue;const w=(x<20?12:12*(1-(x-20)/30))+.15;[1,-1].forEach(s=>B.add(new THREE.BoxGeometry(.8,.9,.2),TM(x,-6+row*3.4,s*w),R()<.2?LIT2:LIT,2,true));}
    /* engines */
    const eng=[];for(let k=0;k<6;k++){const y=-4+(k>>1)*6,z=(k%2?1:-1)*7;B.add(new THREE.CylinderGeometry(2.4,3,6,12),TM(-47,y,z,0,1,1,1,0,Math.PI/2),OB);eng.push([-51,y,z]);}
    const mat=buildingMat({rough:o.rough||.32,metal:o.metal||.78,objSpace:true,uniforms:{night:{value:.3},k:{value:1.3},cw:{value:3},ch:{value:3.2}}});
    const m=B.mesh(mat);const g=new THREE.Group();g.add(m);
    eng.forEach(e=>{const s=glowSprite(GLOW_BLUE,9,.9);s.position.set(e[0],e[1],e[2]);g.add(s);});
    return g;}
  let demi=null,plasma=null,demiLbl=null;
  if(objs.sun){const sun=objs.sun,R=byId.sun.size;
    demi=makeDemiurge();const L=3.4;demi.scale.setScalar(L/100);
    /* most of the ship below the photosphere: the stern castle and its spires break the surface */
    const d=new V3(.55,.42,.72).normalize();const tan=new V3(0,1,0).cross(d).normalize();
    const fwd=d.clone().multiplyScalar(-.62).addScaledVector(tan,.78).normalize();
    demi.position.copy(d).multiplyScalar(R*1.0).addScaledVector(fwd,L*.1);
    const yA=d.clone().addScaledVector(fwd,-d.dot(fwd)).normalize(),zA=fwd.clone().cross(yA).normalize();
    demi.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(fwd,yA,zA));
    /* true scale: far too small to see from orbit, so it is not drawn here */
    /* plasma drawn up from the photosphere into the hull */
    const n=700,pp=new Float32Array(n*3),sd=new Float32Array(n*4),R0=rng(77);for(let i=0;i<n;i++){sd[i*4]=R0();sd[i*4+1]=R0();sd[i*4+2]=R0();sd[i*4+3]=R0();}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pp,3));
    plasma=new THREE.Points(g,new THREE.PointsMaterial({color:col(0xffb060),size:.09,map:(function(){const c=document.createElement("canvas");c.width=c.height=32;const x=c.getContext("2d");const gr=x.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,"rgba(255,255,255,1)");gr.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=gr;x.fillRect(0,0,32,32);return new THREE.CanvasTexture(c);})(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
    plasma.userData={sd,d,tan,R,fwd,L,pos:demi.position.clone()};
    
    demiLbl=document.createElement("button");demiLbl.className="lbl region";demiLbl.textContent="?";demiLbl.title="Something is drinking from the Sun";labelsEl.appendChild(demiLbl);
    demiLbl.addEventListener("click",()=>showBanner("The Demiurge","An Easter egg from Christopher Ruocchio’s The Sun Eater: Hadrian Marlowe’s black cathedral of a warship, dipped into the Sun to drink plasma for its engines. Not part of Red Rising.","Easter egg"));}
  const pw=new V3(),tv=new V3();let pt=0;
  function updDemi(dt){if(!plasma)return;if(mode!=="system"){if(demiLbl){demiLbl.style.opacity=0;demiLbl.style.pointerEvents="none";}return;}pt+=dt;const U=plasma.userData,a=plasma.geometry.attributes.position.array;
    for(let i=0;i<U.sd.length/4;i++){const s=U.sd.subarray(i*4,i*4+4);const f=(pt*.35*(.6+s[3]*.8)+s[0])%1;
      const ang=s[1]*TAU,rad=U.L*.55*(1-f)*(.4+s[2]*.8);
      tv.copy(U.d).multiplyScalar(U.R*1.0).addScaledVector(U.tan,Math.cos(ang)*rad).addScaledVector(U.fwd,Math.sin(ang)*rad*.6-U.L*.1);
      pw.copy(tv).lerp(U.pos,f*f).addScaledVector(U.d,Math.sin(f*Math.PI)*U.L*.12);
      a[i*3]=pw.x;a[i*3+1]=pw.y;a[i*3+2]=pw.z;}
    plasma.geometry.attributes.position.needsUpdate=true;
    if(demiLbl){const vis=mode==="system"&&ctl.r<70;let p=null;if(vis){objs.sun.grp.localToWorld(pw.copy(U.pos).addScaledVector(U.d,1.4));p=project(pw,camS);}
      const ok=vis&&p&&p.front;demiLbl.style.opacity=ok?.85:0;demiLbl.style.pointerEvents=ok?"auto":"none";if(ok)demiLbl.style.transform="translate("+p.x.toFixed(1)+"px,"+p.y.toFixed(1)+"px) translate(-50%,-50%)";}}

  /* ===================== Europa's leviathans ===================== */
  /* Carved sea monsters of the Discordia Sea and the sigil of House Kalibar: a shark-like face, finned
     neck lobes with their own eyes, a whale's body and a long tail with three dorsal fins. */
  function makeLeviathan(gold){const g=new THREE.Group();
    const skin=new THREE.MeshStandardMaterial({color:col(gold?0x2c3a3c:0x24323a),roughness:.38,metalness:.15});
    const belly=new THREE.MeshStandardMaterial({color:col(0x8a9a94),roughness:.5});
    const fin=new THREE.MeshStandardMaterial({color:col(0x1a2428),roughness:.45,side:THREE.DoubleSide});
    const pts=[];const prof=[[0,-50],[3,-44],[5,-34],[7,-22],[11,-8],[15,6],[16,16],[14,26],[11,34],[8,41],[4,47],[0,50]];prof.forEach(p=>pts.push(new THREE.Vector2(p[0],p[1])));
    const body=new THREE.Mesh(new THREE.LatheGeometry(pts,28),skin);body.rotation.z=-Math.PI/2;body.scale.set(1,1,.82);g.add(body);
    const bel=new THREE.Mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p.x*.92,p.y*.96)),20,Math.PI*.25,Math.PI*.5),belly);bel.rotation.z=-Math.PI/2;bel.position.y=-1.2;g.add(bel);
    const tri=(w,h)=>{const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(w,0);sh.quadraticCurveTo(w*.2,h*.4,-w*.15,h);sh.lineTo(0,0);return new THREE.ShapeGeometry(sh);};
    [[-38,7,9,8],[-30,9,11,10],[-21,11,12,12]].forEach(f=>{const m=new THREE.Mesh(tri(f[2],f[3]),fin);m.position.set(f[0],f[1]*.8,0);g.add(m);
      if(gold){const st=new THREE.Mesh(new THREE.BoxGeometry(f[2]*.7,.6,.3),new THREE.MeshStandardMaterial({color:col(0xd9a83a),metalness:.8,roughness:.3,emissive:col(0x3a2808)}));st.position.set(f[0]+f[2]*.3,f[1]*.8+f[3]*.45,0);g.add(st);}});
    const fl=new THREE.Mesh(new THREE.ShapeGeometry((()=>{const s=new THREE.Shape();s.moveTo(0,0);s.quadraticCurveTo(-8,10,-14,14);s.lineTo(-10,0);s.lineTo(-14,-14);s.quadraticCurveTo(-8,-10,0,0);return s;})()),fin);fl.rotation.x=Math.PI/2;fl.position.set(-49,0,0);g.add(fl);
    [1,-1].forEach(s=>{const nf=new THREE.Mesh(tri(14,12),fin);nf.position.set(26,2,s*10);nf.rotation.set(s*1.2,0,Math.PI*.95);g.add(nf);
      const eye=new THREE.Mesh(new THREE.SphereGeometry(1.1,10,8),new THREE.MeshBasicMaterial({color:col(0xc8ff60)}));eye.position.set(20,6,s*13);g.add(eye);
      const beak=new THREE.Mesh(new THREE.ConeGeometry(1.4,4,6),fin);beak.rotation.z=-Math.PI/2;beak.position.set(18,2,s*14);g.add(beak);
      const e2=eye.clone();e2.position.set(42,4,s*5.5);e2.scale.setScalar(.8);g.add(e2);
      const pf=new THREE.Mesh(tri(12,9),fin);pf.position.set(10,-8,s*12);pf.rotation.set(s*-1.3,0,Math.PI*1.1);g.add(pf);});
    const jaw=new THREE.Mesh(new THREE.BoxGeometry(10,1,9),new THREE.MeshBasicMaterial({color:col(0x2a0a08)}));jaw.position.set(45,-2.5,0);g.add(jaw);
    g.traverse(o=>{if(o.isMesh){o.castShadow=true;}});return g;}
  function splashTex(){const c=document.createElement("canvas");c.width=c.height=64;const x=c.getContext("2d");const gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,"rgba(255,255,255,.95)");gr.addColorStop(.5,"rgba(220,240,255,.35)");gr.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=gr;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
  const SPLT=splashTex();
  /* one breaching animal: travels an arc in a local frame whose +y is "up out of the sea" */
  function breacher(L,cycle,phase,gold,spl){const holder=new THREE.Group(),beast=makeLeviathan(gold);beast.scale.setScalar(L/100);holder.add(beast);
    const sp=[];for(let i=0;i<2;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:SPLT,transparent:true,depthWrite:false,opacity:0}));s.scale.setScalar(L*spl);holder.add(s);sp.push(s);}
    let t=phase*cycle;holder.userData.update=dt=>{t=(t+dt)%cycle;const act=Math.min(1,t/(cycle*.45));const u=act;
      const x=(-1+2*u)*L*1.1,y=-L*.42+L*.62*Math.sin(Math.PI*u);const dy=L*.62*Math.PI*Math.cos(Math.PI*u),dx=2*L*1.1;
      beast.position.set(x,y,0);beast.rotation.z=Math.atan2(dy,dx);beast.rotation.x=Math.sin(u*Math.PI)*.25;beast.visible=t<cycle*.47;
      [[.18,0],[.82,1]].forEach(([at,i])=>{const k=Math.max(0,1-Math.abs(u-at)/.12);sp[i].material.opacity=k*.9;sp[i].position.set((-1+2*at)*L*1.1,L*.05,0);sp[i].scale.setScalar(L*spl*(.6+(1-k)*.8));});};
    return holder;}
  /* globe: leviathans breaching off the Nixian Isles and in the southern sea */
  GLOBE_EXTRAS.europa=(grp,R)=>{const G=new THREE.Group();grp.add(G);const kids=[];
    [[-5,-45,.26,16,0,1],[-14,-30,.2,13,.45,0],[8,-58,.17,15,.7,0]].forEach(([lat,lon,L,cyc,ph,gold])=>{
      const n=latLonVec(lat,lon,1).normalize();const frame=new THREE.Group();frame.position.copy(n).multiplyScalar(R*.995);
      frame.quaternion.setFromUnitVectors(new V3(0,1,0),n);frame.rotateY(lon*.05+lat);G.add(frame);
      const b=breacher(L,cyc,ph,gold,.5);frame.add(b);kids.push(b);});
    G.userData.fixed=true;G.userData.update=dt=>kids.forEach(k=>k.userData.update(dt));
    if(!levLbl){levLbl=document.createElement("button");levLbl.className="lbl region";levLbl.textContent="Leviathans";labelsEl.appendChild(levLbl);
      levLbl.addEventListener("click",()=>showBanner("Leviathans",LEV_TEXT,"Easter egg · Europa"));}
    levAnchor=kids[0];return G;};
  const LEV_TEXT="Carved monsters of Europa’s Discordia Sea and the sigil of House Kalibar, who ride them in pressure suits far below the surface. They are never truly tamed and sometimes eat their riders. The gold-striped one is Cyraxes, Kalibar’s 300-year-old bull. In Light Bringer, the Ascomanni feed captives to leviathans at the Nixian Isles.";
  let levLbl=null,levAnchor=null;
  function updLevLbl(){if(!levLbl)return;const on=mode==="globe"&&cur&&cur.id==="europa"&&levAnchor&&levAnchor.parent;let ok=false;
    if(on){const bst=levAnchor.children[0];bst.getWorldPosition(pw);const p=project(pw,camG);const front=pw.z>-.5;ok=p.front&&front&&bst.visible;
      if(ok)levLbl.style.transform="translate("+p.x.toFixed(1)+"px,"+(p.y-18).toFixed(1)+"px) translate(-50%,-100%)";}
    levLbl.style.opacity=ok?.9:0;levLbl.style.pointerEvents=ok?"auto":"none";}
  /* city scene: full-size leviathans in the Discordia Sea off Lorn's island */
  if(SITES.europa){const S=SITES.europa;
    S.landmarks.push({id:"leviathan",name:"Leviathans",pos:[300,160,-3300],desc:LEV_TEXT,cam:{target:[200,0,-3300],r:2600,theta:.35,phi:1.18}});
    const _b=S.build;S.build=function(ctx){_b.call(this,ctx);const G=new THREE.Group();const kids=[];
      [[200,-3300,560,20,0,1,.1],[-1400,-3900,420,17,.5,0,.8],[1500,-4300,380,19,.25,0,-.6]].forEach(([x,z,L,cyc,ph,gold,ry])=>{const f=new THREE.Group();f.position.set(x,0,z);f.rotation.y=ry;G.add(f);const b=breacher(L,cyc,ph,gold,.9);f.add(b);kids.push(b);});
      ctx.root.add(G);siteLev={G,kids};};}
  let siteLev=null;
  function updSiteLev(dt){if(!siteLev)return;if(mode!=="site"||curSiteKey!=="europa"||!siteLev.G.parent){if(!siteLev.G.parent)siteLev=null;return;}siteLev.kids.forEach(k=>k.userData.update(dt));}



  /* ===================== the Demiurge, high-detail build ===================== */
  /* Local frame: prow toward +x, length 100 (x -50..+50), deck at y=0, keel below. Built from a lofted
     hull plus a few thousand architectural parts merged into one mesh, with an obsidian-metal finish. */
  function makeDemiurge2(Lworld){
    const R=rng(4242),V=THREE.Vector3;
    const P=[],N=[],C=[],W=[];const T=new Map();const nm=new THREE.Matrix3();const v=new V(),n=new V();
    function tpl(key,mk){let t=T.get(key);if(!t){let g=mk();if(g.index)g=g.toNonIndexed();if(!g.attributes.normal)g.computeVertexNormals();t={p:g.attributes.position.array,n:g.attributes.normal.array};T.set(key,t);}return t;}
    function add(t,m,color,win,ao){nm.getNormalMatrix(m);const cc=col(color);const p=t.p,q=t.n;let y0=Infinity,y1=-Infinity;const st=P.length;
      for(let i=0;i<p.length;i+=3){v.set(p[i],p[i+1],p[i+2]).applyMatrix4(m);P.push(v.x,v.y,v.z);if(v.y<y0)y0=v.y;if(v.y>y1)y1=v.y;
        n.set(q[i],q[i+1],q[i+2]).applyMatrix3(nm).normalize();N.push(n.x,n.y,n.z);}
      const span=Math.max(.6,y1-y0);
      for(let i=st;i<P.length;i+=3){const k=ao===false?1:.62+.38*Math.min(1,(P[i+1]-y0)/span);C.push(cc.r*k,cc.g*k,cc.b*k);W.push(win||0);}}
    const BOX=tpl("box",()=>new THREE.BoxGeometry(1,1,1)),BOXB=tpl("boxb",()=>new THREE.BoxGeometry(1,1,1).translate(0,.5,0));
    const CONE8=tpl("c8",()=>new THREE.ConeGeometry(1,1,8,1).translate(0,.5,0)),CONE6=tpl("c6",()=>new THREE.ConeGeometry(1,1,6,1).translate(0,.5,0)),CONE4=tpl("c4",()=>new THREE.ConeGeometry(1,1,4,1).translate(0,.5,0));
    const CYL8=tpl("y8",()=>new THREE.CylinderGeometry(1,1,1,8,1).translate(0,.5,0)),CYL16=tpl("y16",()=>new THREE.CylinderGeometry(1,1,1,16,1).translate(0,.5,0));
    const DISK=tpl("disk",()=>new THREE.CircleGeometry(1,40)),TOR=tpl("tor",()=>new THREE.TorusGeometry(1,.07,6,48));
    const ARCH=tpl("arch",()=>G.arch(1,1.7,.4,.16));
    const LANCET=tpl("lan",()=>{const s=new THREE.Shape();s.moveTo(-.5,0);s.lineTo(-.5,1);s.quadraticCurveTo(-.5,1.5,0,1.75);s.quadraticCurveTo(.5,1.5,.5,1);s.lineTo(.5,0);s.lineTo(-.5,0);
      return new THREE.ExtrudeGeometry(s,{depth:.12,bevelEnabled:false,curveSegments:5}).translate(0,0,-.06);});
    const OB=0x121115,OB2=0x18171c,OB3=0x201e24,EDGE=0x2c292d,GOLD=0x8a6428,GLASS=0x0c0b10,LIT=0xffa848,LIT2=0xffd28a,LIT3=0xffc070;
    const lights=[];
    const litWin=(m,x,y,z,pr)=>{const on=R()<pr;add(LANCET,m,on?(R()<.25?LIT2:R()<.5?LIT3:LIT):GLASS,on?2:0,false);if(on&&R()<.35)lights.push(x,y,z);};

    /* ---- hull ---- */
    function prof(x){const w=x<-18?13:13*Math.pow(Math.max(0,1-(x+18)/68),.85);const yd=x<18?0:-(x-18)*.075;const t=(x+50)/100;const yk=-12+t*t*9.5;return {w:Math.max(w,.12),yd,yk};}
    function half(x){const {w,yd,yk}=prof(x),h=yd-yk;return [[w*.5,yd],[w,yd-.25],[w*1.07,yd-h*.28],[w*.86,yd-h*.6],[w*.46,yk+h*.13],[0,yk]];}
    function ring(x){const hp=half(x);const r=[[0,hp[0][1]]].concat(hp);const l=hp.slice(0,-1).reverse().map(p=>[-p[0],p[1]]);return r.concat(l).concat([[0,hp[0][1]]]);}
    (function(){const pos=[];const xs=[];for(let x=-50;x<=50.001;x+=1)xs.push(x);
      const tri=(a,b,c,ox,oy,oz)=>{const e1=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],e2=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];const nx=e1[1]*e2[2]-e1[2]*e2[1],ny=e1[2]*e2[0]-e1[0]*e2[2],nz=e1[0]*e2[1]-e1[1]*e2[0];
        const cx=(a[0]+b[0]+c[0])/3-ox,cy=(a[1]+b[1]+c[1])/3-oy,cz=(a[2]+b[2]+c[2])/3-oz;if(nx*cx+ny*cy+nz*cz<0)pos.push(...a,...c,...b);else pos.push(...a,...b,...c);};
      for(let i=0;i<xs.length-1;i++){const x0=xs[i],x1=xs[i+1];const r0=ring(x0),r1=ring(x1);const pa=prof(x0);const cy=(pa.yd+pa.yk)/2;
        for(let j=0;j<r0.length-1;j++){const a=[x0,r0[j][1],r0[j][0]],b=[x1,r1[j][1],r1[j][0]],c=[x1,r1[j+1][1],r1[j+1][0]],d=[x0,r0[j+1][1],r0[j+1][0]];
          tri(a,b,c,(x0+x1)/2,cy,0);tri(a,c,d,(x0+x1)/2,cy,0);}}
      [[-50,-1],[50,1]].forEach(([x,s])=>{const r=ring(x);const pa=prof(x);const ctr=[x,(pa.yd+pa.yk)/2,0];for(let j=0;j<r.length-1;j++){tri(ctr,[x,r[j][1],r[j][0]],[x,r[j+1][1],r[j+1][0]],x-s,ctr[1],0);}});
      const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();T.set("hull",{p:g.attributes.position.array,n:g.attributes.normal.array});
      add(T.get("hull"),new THREE.Matrix4(),OB2,0);})();
    /* a point on the hull's flank at depth f (0 = deck edge, 1 = near keel), with the surface tangent */
    function side(x,f,s){const hp=half(x).slice(1,5);const seg=[];let L=0;for(let i=0;i<hp.length-1;i++){const d=Math.hypot(hp[i+1][0]-hp[i][0],hp[i+1][1]-hp[i][1]);seg.push(d);L+=d;}
      let t=f*L,i=0;while(i<seg.length-1&&t>seg[i]){t-=seg[i];i++;}const a=hp[i],b=hp[i+1],k=Math.min(1,t/seg[i]);
      const z=(a[0]+(b[0]-a[0])*k)*s,y=a[1]+(b[1]-a[1])*k;const dy=b[1]-a[1],dz=(b[0]-a[0])*s;return {y,z,th:Math.atan2(dz,-dy)};}
    /* flank decks: ribs, lancet windows and ledges */
    const BANDS=[[.03,.23],[.25,.45],[.47,.66],[.68,.86]];
    for(let x=-49.4;x<46;x+=.62){const w=prof(x).w;if(w<1.6)break;
      [1,-1].forEach(s=>{BANDS.forEach(([f0,f1],bi)=>{if(bi===3&&x>30)return;const a=side(x,f0,s),b=side(x,f1,s);const cy=(a.y+b.y)/2,cz=(a.z+b.z)/2,len=Math.hypot(a.y-b.y,a.z-b.z);
          const th=-Math.atan2(b.z-a.z,a.y-b.y);const out=s*.12;
          add(BOX,TM(x,cy,cz+out,0,.16,len*.98,.42,th),bi%2?OB3:EDGE);
          const wm=TM(x+.31,cy-len*.28,cz+out*.6,0,.36,len*.36,1,th);if(s<0)wm.multiply(new THREE.Matrix4().makeRotationY(Math.PI));
          litWin(wm,x+.31,cy,cz,.42-bi*.06);});});}
    for(let x=-49;x<44;x+=3.5){const w=prof(x).w;if(w<1.8)break;[1,-1].forEach(s=>{BANDS.forEach(([f0])=>{const a=side(x+1.75,f0-.015,s);
      add(BOX,TM(x+1.75,a.y,a.z+s*.22,0,3.6,.28,.55,-Math.atan2(side(x+1.75,f0+.02,s).z-a.z,a.y-side(x+1.75,f0+.02,s).y)),f0<.05?GOLD:EDGE);});});}
    /* gold trim along the deck edge */
    for(let x=-50;x<40;x+=2){const p=prof(x+1);[1,-1].forEach(s=>add(BOX,TM(x+1,p.yd+.05,s*(p.w-.05),0,2.05,.22,.3),GOLD,0,false));}

    /* ---- stern castle ---- */
    add(BOXB,TM(-40.5,0,0,0,19,26,25),OB);
    /* rose window on the stern face */
    const RX=-50.1,RY=17;add(DISK,TM(RX,RY,0,-Math.PI/2,6.2,6.2,1),LIT,2,false);
    add(TOR,TM(RX-.1,RY,0,Math.PI/2,6.4,6.4,6.4),GOLD,0,false);add(TOR,TM(RX-.15,RY,0,Math.PI/2,2.4,2.4,4),GOLD,0,false);add(TOR,TM(RX-.1,RY,0,Math.PI/2,7.4,7.4,10),EDGE,0,false);
    for(let k=0;k<16;k++){add(BOX,TM(RX-.2,RY,0,0,.3,12.4,.32,k/16*Math.PI),OB3,0,false);}
    for(let k=0;k<16;k++){const a=k/16*TAU;add(DISK,TM(RX-.25,RY+Math.sin(a)*4.3,Math.cos(a)*4.3,-Math.PI/2,.55,.55,1),OB,0,false);}
    /* great portals and the arcade beneath */
    [-7,7].forEach(z=>{add(ARCH,TM(-50.2,0,z,Math.PI/2,7,7.4,2),EDGE);add(BOX,TM(-49.9,5.5,z,0,.4,11,5.2),0x08070a,0,false);
      for(let k=0;k<4;k++)add(LANCET,TM(-50.15,1,z-1.8+k*1.2,-Math.PI/2,.55,4.2,1),R()<.7?LIT:GLASS,R()<.7?2:0,false);});
    for(let k=0;k<7;k++){const z=-12+k*4;add(BOXB,TM(-50.6,0,z,0,1.4,27,1.1),OB3);add(CONE8,TM(-50.6,27,z,0,.8,4+R()*3,.8),EDGE);}
    /* castle flanks: three tiers of tall lancets between buttresses */
    [1,-1].forEach(s=>{for(let x=-48.5;x<-32;x+=2.3){add(BOXB,TM(x+1.15,0,s*12.8,0,.7,26,1.2),OB3);
        [2,10.5,18.5].forEach(ty=>{const m=TM(x,ty,s*12.55,0,1.05,3.6,1);if(s<0)m.multiply(new THREE.Matrix4().makeRotationY(Math.PI));litWin(m,x,ty+3,s*12.6,.55);});}
      add(BOX,TM(-40.5,9,s*12.9,0,19,.5,.7),GOLD);add(BOX,TM(-40.5,17.3,s*12.9,0,19,.5,.7),GOLD);});
    /* stepped tiers, the great tower and the needle spires */
    add(BOXB,TM(-41,26,0,0,15,8,20),OB2);add(BOXB,TM(-41.5,34,0,0,10,7,13),OB);add(CYL8,TM(-42,41,0,0,3.4,13,3.4),OB2);
    add(CONE8,TM(-42,54,0,0,3.9,34,3.9),OB3);add(CYL8,TM(-42,52.5,0,0,4.1,1.6,4.1),GOLD);
    for(let k=0;k<8;k++){const a=k/8*TAU;add(CONE6,TM(-42+Math.cos(a)*3.8,52,Math.sin(a)*3.8,0,.55,9+R()*4,.55),EDGE);}
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([a,b])=>{const x=-41+a*8.7,z=b*11.6;add(CYL8,TM(x,0,z,0,1.9,33,1.9),OB2);add(CYL8,TM(x,33,z,0,2.15,1,2.15),GOLD);
      add(CONE8,TM(x,34,z,0,2.3,24+R()*6,2.3),OB3);for(let q=0;q<6;q++){const t=q/6*TAU;add(CONE6,TM(x+Math.cos(t)*2.3,32,z+Math.sin(t)*2.3,0,.42,6+R()*4,.42),EDGE);}
      for(let ty=6;ty<30;ty+=6){const m=TM(x-a*1.95,ty,z,a>0?Math.PI/2:-Math.PI/2,.7,2.6,1);litWin(m,x,ty+2,z,.6);}});
    [[-35,8],[-35,-8],[-47,8],[-47,-8],[-36.5,0],[-46,0]].forEach(([x,z])=>{add(CYL8,TM(x,34,z,0,.95,5,.95),OB2);add(CONE8,TM(x,39,z,0,1.15,13+R()*9,1.15),OB3);});
    for(let k=0;k<26;k++){const x=-48+R()*14,z=(R()-.5)*19;add(CONE6,TM(x,34,z,0,.35+R()*.3,2+R()*5,.35+R()*.3),R()<.2?GOLD:EDGE);}

    /* ---- terraces stepping down toward the prow ---- */
    let prevH=26;
    for(let k=0;k<8;k++){const x0=-31+k*7.4,len=8.2,xc=x0+len/2;const pw=prof(x0+len).w;const h=Math.max(3,prevH-2.6-k*.15),wz=Math.min(22*(1-k/10),pw*1.75);prevH=h;
      add(BOXB,TM(xc,0,0,0,len,h,wz),k%2?OB:OB2);
      /* ribbed roof sloping toward the prow */
      const slope=.32;add(BOX,TM(xc,h+.35,0,0,len*1.08,.7,wz*1.02,0,0),EDGE);
            for(let j=0;j<=Math.round(wz/1.1);j++){const z=-wz/2+j*(wz/Math.round(wz/1.1));add(BOX,TM(xc,h+1.2,z,0,len*1.05,.55,.22,0,-slope),j%3?OB3:EDGE);}
      add(BOX,TM(xc,h+1,0,0,len,1.2,wz*.98,0,-slope),OB);
      /* arcade along both sides */
      [1,-1].forEach(s=>{for(let x=x0+.7;x<x0+len-.6;x+=1.25){add(BOXB,TM(x-.32,0,s*(wz/2+.15),0,.28,h,.5),OB3);
          if(h>5){const m=TM(x+.3,h*.28,s*(wz/2+.08),0,.62,Math.min(h*.28,4.5),1);if(s<0)m.multiply(new THREE.Matrix4().makeRotationY(Math.PI));litWin(m,x+.3,h*.5,s*wz/2,.48);}}
        add(BOX,TM(xc,h-.3,s*(wz/2+.2),0,len,.45,.6),GOLD);
        /* flying buttresses from the deck edge to the terrace wall */
        const dz=pw*.95-wz/2,hy=h*.72;if(dz>1.2){for(let x=x0+1;x<x0+len;x+=2.7){const L=Math.hypot(dz,hy),th=Math.atan2(dz,hy);
          add(BOX,TM(x,hy/2,s*(wz/2+dz/2),0,.45,L,.6,-s*th),OB3);add(CONE6,TM(x,0,s*(wz/2+dz),0,.5,3+R()*2,.5),EDGE);}}});
      /* spires on the terrace */
      [1,-1].forEach(s=>{const x=x0+len-1,z=s*(wz/2-.8);add(CYL8,TM(x,h,z,0,.75,3,.75),OB2);add(CONE8,TM(x,h+3,z,0,.9,6+R()*10*(1-k/9),.9),OB3);});
      for(let q=0;q<10;q++){add(CONE6,TM(x0+R()*len,h+1.2,(R()-.5)*wz*.9,0,.25+R()*.25,1+R()*4,.25+R()*.25),R()<.15?GOLD:EDGE);}}
    /* low spine running out along the prow */
    for(let x=28;x<46;x+=1.6){const p=prof(x);if(p.w<1)break;add(BOXB,TM(x,p.yd,0,0,1.4,1.4+(46-x)*.12,Math.min(3,p.w)),OB2);add(CONE4,TM(x,p.yd+1.4+(46-x)*.12,0,0,.4,1.5+R()*2.5,.4),EDGE);}
    /* prow ram */
    add(T.get("ram")||tpl("ram",()=>frustum(16,1,1,.06,.06,-.2)),TM(57.5,-2.6,0,0,1,2.2,3),EDGE);
    for(let k=0;k<3;k++)add(BOX,TM(52+k*3.2,-1.1-k*.5,0,0,3,.25,.3),GOLD,0,false);

    /* ---- the hanging spires beneath the keel ---- */
    for(let k=0;k<190;k++){const x=-49+Math.pow(R(),1.35)*86;const p=prof(x);const f=.75+R()*.25;const s=R()<.5?1:-1;const pt=side(x,f,s);
      const len=1.2+Math.pow(R(),2.6)*(x<-10?30:14),r=.25+R()*1.1;add(R()<.6?CONE8:CONE6,TM(x,pt.y+.4,pt.z*.85,0,r,len,r,Math.PI),R()<.5?OB:OB2);}
    for(let k=0;k<5;k++){const x=-44+k*7;const p=prof(x);add(CONE8,TM(x,p.yk+.5,0,0,2.2,22+R()*14,2.2,Math.PI),OB);}


    /* ---- a skyline of cathedral towers along the spine and flanks ---- */
    const tower=(x,y,z,w,hgt,lit)=>{let cy=y,cw=w;const tiers=2+((R()*2)|0);
      for(let t=0;t<tiers;t++){const th=hgt*(t===0?.5:.5/(tiers-1));add(BOXB,TM(x,cy,z,R()<.5?0:Math.PI/4,cw,th,cw),t%2?OB3:OB2);
        add(BOX,TM(x,cy+th,z,0,cw*1.12,.3,cw*1.12),GOLD,0,false);
        for(let q=0;q<4;q++){const a=q/4*TAU+Math.PI/4;add(CONE6,TM(x+Math.cos(a)*cw*.62,cy+th,z+Math.sin(a)*cw*.62,0,cw*.12,cw*(.8+R()),cw*.12),EDGE);}
        if(lit){[1,-1].forEach(s=>{const m=TM(x,cy+th*.25,z+s*(cw/2+.02),0,cw*.32,th*.32,1);if(s<0)m.multiply(new THREE.Matrix4().makeRotationY(Math.PI));litWin(m,x,cy+th*.5,z+s*cw/2,.55);});}
        cy+=th;cw*=.72;}
      add(CONE8,TM(x,cy,z,0,cw*.75,hgt*(.7+R()*.8),cw*.75),OB3);};
    for(let k=0;k<8;k++){const x0=-31+k*7.4,len=8.2;const pw=prof(x0+len).w;const wz=Math.min(22*(1-k/10),pw*1.75);const hT=Math.max(3,26-2.75*(k+1));
      const n=k<4?4:3;for(let q=0;q<n;q++){const x=x0+1+R()*(len-2),z=(R()-.5)*wz*.6;tower(x,hT+1,z,.9+R()*1.3,4+R()*10*(1-k/10),true);}}
    for(let x=-30;x<38;x+=1.7){const p=prof(x);if(p.w<2)break;[1,-1].forEach(s=>{const z=s*(p.w-.45);add(BOXB,TM(x,p.yd,z,0,.5,1.4+R()*1.8,.5),OB3);add(CONE6,TM(x,p.yd+1.6+R()*1.5,z,0,.32,1.8+R()*3,.32),R()<.2?GOLD:EDGE);});}
    /* gun towers along the flanks */
    for(let k=0;k<64;k++){const x=-46+R()*80;if(prof(x).w<2.5)continue;const s=R()<.5?1:-1;const f=[.24,.46,.67][(R()*3)|0];const a=side(x,f,s);
      add(CYL8,TM(x,a.y-.4,a.z+s*.5,0,.55,.8,.55,s*Math.PI/2),EDGE);add(BOX,TM(x+.6,a.y,a.z+s*1.1,0,1.6,.16,.16),OB3);add(BOX,TM(x+.6,a.y+.3,a.z+s*1.1,0,1.6,.16,.16),OB3);}
    /* more tiers and a crown of pinnacles on the stern castle */
    for(let k=0;k<20;k++){const a=k/20*TAU;add(CONE6,TM(-41+Math.cos(a)*7.2,34,Math.sin(a)*9.5,0,.4,3+R()*5,.4),k%4?EDGE:GOLD);}
    for(let k=0;k<12;k++){const a=k/12*TAU;add(CONE6,TM(-41.5+Math.cos(a)*4.6,41,Math.sin(a)*6,0,.35,2+R()*4,.35),EDGE);}
    [1,-1].forEach(s=>{for(let x=-48;x<-34;x+=1.6){add(ARCH,TM(x,26.2,s*10.05,0,1.2,1.6,.6),OB3);const m=TM(x,26.6,s*10.1,0,.7,1.3,1);if(s<0)m.multiply(new THREE.Matrix4().makeRotationY(Math.PI));litWin(m,x,27.5,s*10,.5);}});
    /* inverted towers hanging from the keel */
    for(let k=0;k<70;k++){const x=-46+Math.pow(R(),1.2)*70;const p=prof(x);const z=(R()-.5)*p.w*.9;const pt=side(x,.85+R()*.15,z>0?1:-1);
      let cy=pt.y+.3,cw=.8+R()*1.4;const n=2+((R()*2)|0);for(let t=0;t<n;t++){const th=1.5+R()*3.5;add(BOXB,TM(x,cy-th,z*.8,0,cw,th,cw),t%2?OB:OB2);
        for(let q=0;q<4;q++){const a=q/4*TAU+Math.PI/4;add(CONE6,TM(x+Math.cos(a)*cw*.6,cy-th,z*.8+Math.sin(a)*cw*.6,0,cw*.12,cw*(1+R()),cw*.12,Math.PI),EDGE);}
        cy-=th;cw*=.7;}
      add(CONE8,TM(x,cy,z*.8,0,cw*.7,4+R()*14,cw*.7,Math.PI),OB2);}

    /* ---- engines ---- */
    const eng=[];[[-4,-7],[-4,7],[-8.5,-3.5],[-8.5,3.5]].forEach(([y,z])=>{add(CYL16,TM(-50.3,y,z,0,2.2,3,2.2,0,Math.PI/2),EDGE);add(TOR,TM(-51.6,y,z,Math.PI/2,2.25,2.25,4),GOLD,0,false);eng.push([-52,y,z]);});

    /* ---- assemble ---- */
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(P,3));g.setAttribute("normal",new THREE.Float32BufferAttribute(N,3));
    g.setAttribute("color",new THREE.Float32BufferAttribute(C,3));g.setAttribute("aWin",new THREE.Float32BufferAttribute(W,1));g.computeBoundingSphere();
    const mat=demiMat();
    const mesh=new THREE.Mesh(g,mat);mesh.castShadow=true;mesh.receiveShadow=true;const grp=new THREE.Group();grp.add(mesh);
    /* soft glow around lit windows */
    const lg=new THREE.BufferGeometry();lg.setAttribute("position",new THREE.Float32BufferAttribute(lights,3));
    const lp=new THREE.Points(lg,new THREE.PointsMaterial({color:col(0xffb060),size:(Lworld||100)/100*1.6,map:demiGlowTex(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.55}));grp.add(lp);
    eng.forEach(e=>{const s=glowSprite(GLOW_BLUE,7,.95);s.position.set(e[0],e[1],e[2]);grp.add(s);});
    const smp=[];for(let i=0;i<P.length;i+=3*17)smp.push(P[i],P[i+1],P[i+2]);grp.userData.samples=new Float32Array(smp);grp.userData.mat=mat;
    grp.userData.tris=P.length/9;return grp;}
  /* ---------- gothic facade detail, painted once into textures and wrapped over the hull ---------- */
  let _dTex=null;
  function demiTextures(){if(_dTex)return _dTex;const S=isMob()?1024:2048,k=S/1024;const R=rng(77);
    const mk=()=>{const c=document.createElement("canvas");c.width=c.height=S;const x=c.getContext("2d");x.scale(k,k);return [c,x];};
    const [hc,h]=mk(),[ec,e]=mk();
    const g=v=>"rgb("+v+","+v+","+v+")";
    h.fillStyle=g(92);h.fillRect(0,0,1024,1024);e.fillStyle="#000";e.fillRect(0,0,1024,1024);
    for(let i=0;i<9000;i++){h.fillStyle=g(80+((R()*30)|0));h.fillRect(R()*1024,R()*1024,1+R()*2,1+R()*2);}
    const lancet=(c,x0,y0,w,hh)=>{c.beginPath();c.moveTo(x0,y0+hh);c.lineTo(x0,y0+w*.55);c.quadraticCurveTo(x0,y0,x0+w/2,y0-w*.25);c.quadraticCurveTo(x0+w,y0,x0+w,y0+w*.55);c.lineTo(x0+w,y0+hh);c.closePath();};
    for(let r=0;r<4;r++)for(let cI=0;cI<8;cI++){const x0=cI*128,y0=r*256;const kind=R();
      /* pilaster with groove and capital */
      h.fillStyle=g(176);h.fillRect(x0,y0,16,256);h.fillStyle=g(60);h.fillRect(x0+7,y0+20,2,216);h.fillStyle=g(200);h.fillRect(x0-2,y0+20,20,8);
      if(kind<.78){/* a tall lancet: frame, recessed glass, mullion and tracery */
        lancet(h,x0+28,y0+52,72,170);h.fillStyle=g(206);h.fill();lancet(h,x0+34,y0+60,60,158);h.fillStyle=g(26);h.fill();
        const lit=R()<.2,lv=lit?(120+((R()*135)|0)):0;if(lit){lancet(e,x0+34,y0+60,60,158);e.fillStyle="rgb("+lv+","+lv+","+lv+")";e.fill();}
        h.fillStyle=g(196);h.fillRect(x0+62,y0+70,4,150);e.fillStyle="#000";e.fillRect(x0+62,y0+70,4,150);
        h.strokeStyle=g(186);h.lineWidth=3;lancet(h,x0+38,y0+88,22,132);h.stroke();lancet(h,x0+68,y0+88,22,132);h.stroke();
        h.beginPath();h.arc(x0+64,y0+62,9,0,TAU);h.stroke();e.fillStyle="#000";e.beginPath();e.arc(x0+64,y0+62,4,0,TAU);e.fill();
        for(let t=0;t<4;t++){h.fillStyle=g(150);h.fillRect(x0+36,y0+110+t*30,56,2);e.fillRect(x0+36,y0+110+t*30,56,2);}
      }else{/* a niche with ribbed panels */
        lancet(h,x0+38,y0+60,52,170);h.fillStyle=g(30);h.fill();for(let t=0;t<7;t++){h.fillStyle=g(t%2?170:120);h.fillRect(x0+22+t*13,y0+40,4,200);}
        h.fillStyle=g(150);h.fillRect(x0+56,y0+150,16,70);h.beginPath();h.arc(x0+64,y0+142,9,0,TAU);h.fill();}
      /* cornice with dentils, blind arcade under the sill */
      h.fillStyle=g(214);h.fillRect(x0,y0,128,16);h.fillStyle=g(50);h.fillRect(x0,y0+16,128,4);
      for(let d=0;d<16;d++){h.fillStyle=g(186);h.fillRect(x0+d*8+1,y0+20,5,7);}
      h.strokeStyle=g(170);h.lineWidth=2;for(let a=0;a<4;a++){h.beginPath();h.moveTo(x0+18+a*26,y0+252);h.lineTo(x0+18+a*26,y0+236);h.arc(x0+29+a*26,y0+236,11,Math.PI,0);h.lineTo(x0+40+a*26,y0+252);h.stroke();}
      if(R()<.5){for(let t=0;t<5;t++){h.fillStyle=g(R()<.5?140:70);h.fillRect(x0+20+R()*90,y0+226+R()*8,4+R()*10,3+R()*4);}}}
    const tex=c=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=MAX_ANISO;return t;};
    _dTex={h:tex(hc),e:tex(ec)};return _dTex;}
  function demiMat(){const tx=demiTextures();
    const m=new THREE.MeshStandardMaterial({vertexColors:true,metalness:.8,roughness:.32,envMapIntensity:1.35});
    try{m.envMap=demiEnv();}catch(err){console.warn(err);m.metalness=.4;}
    m.extensions={derivatives:true};const U={tH:{value:tx.h},tE:{value:tx.e},uGlow:{value:1.1},uHeat:{value:1}};m.userData.U=U;
    m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);
      sh.vertexShader=sh.vertexShader.replace("#include <common>","#include <common>\nattribute float aWin;varying float vWin;varying vec3 vOP;varying vec3 vON;varying float vWY;")
        .replace("#include <begin_vertex>","#include <begin_vertex>\nvWin=aWin;vOP=position;vON=normal;vWY=(modelMatrix*vec4(position,1.)).y;");
      sh.fragmentShader=sh.fragmentShader.replace("#include <common>",`#include <common>
uniform sampler2D tH;uniform sampler2D tE;uniform float uGlow;uniform float uHeat;varying float vWin;varying vec3 vOP;varying vec3 vON;varying float vWY;
vec3 triW(vec3 n){vec3 a=pow(abs(n),vec3(4.));return a/dot(a,vec3(1.));}
float triS(sampler2D t,vec3 p,vec3 w,float s){return texture2D(t,p.zy*s).r*w.x+texture2D(t,p.xz*s).r*w.y+texture2D(t,p.xy*s).r*w.z;}`)
        .replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        vec3 tw=triW(normalize(vON));
        float h1=triS(tH,vOP,tw,.22);
        float f2=clamp(1.6-length(fwidth(vOP*.9))*12.,0.,1.);
        float h2=f2>0.?triS(tH,vOP*vec3(1.,1.,1.)+vec3(7.3,3.1,5.7),tw,.9):.36;
        float hh=h1+(h2-.36)*.5*f2;
        vec3 sp=-vViewPosition;vec3 ddx=dFdx(sp),ddy=dFdy(sp);vec3 R1=cross(ddy,normal),R2=cross(normal,ddx);float det=dot(ddx,R1);
        vec3 grad=sign(det)*(dFdx(hh)*R1+dFdy(hh)*R2);normal=normalize(abs(det)*normal-grad*1.25);
        float wmask=triS(tE,vOP,tw,.22)*(1.-tw.y);
        diffuseColor.rgb*=(.38+1.05*hh)*(1.-wmask*.6);
        roughnessFactor=clamp(roughnessFactor*(.6+.8*(1.-hh)),.08,1.);`)
        .replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        totalEmissiveRadiance+=vec3(1.,.58,.24)*wmask*uGlow;
        if(vWin>1.5)totalEmissiveRadiance+=diffuseColor.rgb*2.4;
        float heat=1.-smoothstep(0.,1100.,vWY);totalEmissiveRadiance+=vec3(1.,.38,.1)*heat*heat*uHeat*1.6;`);};
    m.customProgramCacheKey=()=>"demi3";return m;}

  let _dGlow=null;function demiGlowTex(){if(_dGlow)return _dGlow;const c=document.createElement("canvas");c.width=c.height=64;const x=c.getContext("2d");const gr=x.createRadialGradient(32,32,0,32,32,32);
    gr.addColorStop(0,"rgba(255,230,180,1)");gr.addColorStop(.25,"rgba(255,170,80,.5)");gr.addColorStop(1,"rgba(255,120,40,0)");x.fillStyle=gr;x.fillRect(0,0,64,64);_dGlow=new THREE.CanvasTexture(c);return _dGlow;}
  /* reflections for the obsidian hull: dark space above, the blazing photosphere below */
  let _dEnv=null;function demiEnv(){if(_dEnv)return _dEnv;const c=document.createElement("canvas");c.width=512;c.height=256;const x=c.getContext("2d");
    const gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,"#040303");gr.addColorStop(.38,"#1a0805");gr.addColorStop(.49,"#c84c1c");gr.addColorStop(.52,"#ff9a48");gr.addColorStop(.7,"#ffc27a");gr.addColorStop(1,"#ffe6b0");
    x.fillStyle=gr;x.fillRect(0,0,512,256);for(let k=0;k<40;k++){x.fillStyle="rgba(255,"+(160+((k*37)%80))+",90,.25)";x.beginPath();x.ellipse((k*97)%512,140+(k*53)%110,20+(k*13)%40,6+(k*7)%10,0,0,TAU);x.fill();}
    const t=new THREE.CanvasTexture(c);t.mapping=THREE.EquirectangularReflectionMapping;t.encoding=THREE.sRGBEncoding;
    const vp=new THREE.Vector4(),sc=new THREE.Vector4();renderer.getViewport(vp);renderer.getScissor(sc);const st=renderer.getScissorTest(),rt0=renderer.getRenderTarget();
    const rt=pmrem.fromEquirectangular(t);t.dispose();renderer.setRenderTarget(rt0);renderer.setViewport(vp);renderer.setScissor(sc);renderer.setScissorTest(st);
    _dEnv=rt.texture;return _dEnv;}

  /* ===================== the Sun as a world you can visit, and the Demiurge at true scale ===================== */
  /* At about 100 miles (160 km) long, the Demiurge is roughly 1/8,700 of the Sun's width: invisible from
     orbit, smaller than a single convection cell on the surface. So the system view no longer shows an
     oversized model; the ship lives in its own close-up scene on the photosphere. */
  const SUNB=byId.sun;SUNB.real=true;SUNB.cls="Our star · a yellow dwarf";
  ATMO.sun=[0xffa040,1.6];
  const DEMI_TEXT="An Easter egg from Christopher Ruocchio’s The Sun Eater: the Demiurge, a black cathedral of a warship about 100 miles long, skimming the Sun to drink plasma for its engines. Not part of Red Rising.";
  POIS.sun=[{id:"demiurge",name:"The Demiurge",lat:24,lon:38,site:"demiurge",desc:DEMI_TEXT+" At true scale it is far too small to see from here; descend to find it."}];
  POIS.sun.forEach(p=>{p.body="sun";poiById["sun:"+p.id]=p;});
  let sunPending=false;
  if(demiLbl){const nl=demiLbl.cloneNode(true);demiLbl.replaceWith(nl);demiLbl=nl;nl.title="Something is drinking from the Sun";
    nl.addEventListener("click",()=>{sunPending=true;goBody("sun");});}
  const _bgS=buildGlobe;buildGlobe=function(b){_bgS(b);if(b.id==="sun"){
      NAVHINT.globe="<b>Drag</b> to spin the Sun · <b>pinch</b> or <b>scroll</b> to zoom · tap <b>The Demiurge</b>";
      if(sunPending){sunPending=false;setTimeout(()=>{if(cur&&cur.id==="sun")selectPoi("demiurge",true);},900);}}};
  /* corona, a slow pulse of light, and looping prominences on the Sun's globe */
  function promMat(c){return new THREE.ShaderMaterial({uniforms:{t:{value:0},c:{value:col(c)}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
    vertexShader:"varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader:"uniform float t;uniform vec3 c;varying vec2 vU;float h(float x){return fract(sin(x*91.7)*43758.5);}void main(){float s=sin(vU.x*3.14159);float f=.55+.45*sin(vU.x*40.-t*2.+sin(vU.x*13.+t)*2.);float e=1.-abs(vU.y-.5)*2.;gl_FragColor=vec4(c*(1.3+f*.6),s*e*e*f*.85);}"});}
  GLOBE_EXTRAS.sun=(grp,R)=>{const g=new THREE.Group();grp.add(g);const mats=[];
    const c1=glowSprite(GLOW_WARM,R*4.2,.55),c2=glowSprite(GLOW_WARM,R*7.5,.18);g.add(c1);g.add(c2);
    const R0=rng(17);
    for(let k=0;k<6;k++){const lat=(R0()-.5)*70,lon=R0()*360-180;const n=latLonVec(lat,lon,1).normalize();
      const m=promMat(k%2?0xff6a2a:0xffa040);mats.push(m);const tor=new THREE.Mesh(new THREE.TorusGeometry(R*(.08+R0()*.08),R*.012,8,48,Math.PI),m);
      const fr=new THREE.Group();fr.position.copy(n).multiplyScalar(R*.99);fr.quaternion.setFromUnitVectors(new V3(0,1,0),n);fr.rotateY(R0()*TAU);tor.rotation.x=0;fr.add(tor);g.add(fr);}
    let t=0;g.userData.fixed=true;g.userData.update=dt=>{t+=dt;mats.forEach(m=>m.uniforms.t.value=t);const p=1+Math.sin(t*.6)*.04;c1.scale.setScalar(R*4.2*p);};return g;};

  /* ---------- the close-up scene ---------- */
  /* 1 scene unit ≈ 27 m: the ship is ~6,000 units long, a solar granule (~1,000 km) ~37,000 units */
  const PHOTO_VS="varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}";
  const PHOTO_FS=`uniform float t;uniform float ha;uniform vec3 camP;uniform vec3 fogC;varying vec3 vW;
    vec2 h2(vec2 p){vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));p3+=dot(p3,p3.yzx+33.33);return fract((p3.xx+p3.yz)*p3.zy);}
    float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float a=h2(i).x,b=h2(i+vec2(1,0)).x,c=h2(i+vec2(0,1)).x,d=h2(i+vec2(1,1)).x;return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
    float fbm(vec2 p){float s=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<6;i++){s+=a*n2(p);p=m*p+vec2(17.1,9.2);a*=.5;}return s;}
    vec2 wor(vec2 p,float tt){vec2 i=floor(p),f=fract(p);float d1=8.,d2=8.;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(x,y);vec2 o=h2(i+g);o=.5+.42*sin(tt+6.2831*o);float d=length(g+o-f);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}return vec2(d1,d2);}
    void main(){vec2 p=vW.xz;
      vec2 q=p/37000.+vec2(.31,.17);vec2 w=wor(q+.05*vec2(fbm(q*3.+t*.01),fbm(q*3.-t*.01)),t*.02);
      float lane=smoothstep(.0,.09,w.y-w.x);
      vec2 r=p/2600.;float turb=fbm(r+vec2(t*.03,-t*.02)+.6*vec2(fbm(r*.5+t*.01),fbm(r*.5-t*.012)));
      float fine=fbm(mat2(.8,-.6,.6,.8)*p/900.+vec2(-t*.05,t*.04));
      float bp=smoothstep(.82,.95,fbm(p/900.+3.1))*(1.-lane);
      float I=.5+.34*lane;I*=.7+.42*turb+.14*fine;I+=bp*.45;
      vec3 deep=vec3(.42,.07,.01),mid=vec3(1.,.4,.07),hot=vec3(1.,.76,.4);
      vec3 c=mix(deep,mid,smoothstep(.35,.75,I));c=mix(c,hot,smoothstep(.78,1.08,I));
      vec3 hc=mix(vec3(.35,.02,.02),vec3(1.,.28,.18),smoothstep(.3,1.,I));hc+=vec3(.6,.2,.15)*bp;
      c=mix(c,hc,ha)*1.05;
      float d=distance(camP,vW);float fg=1.-exp(-pow(d*.00003,2.));c=mix(c,fogC,fg);
      gl_FragColor=vec4(c,1.);}`;
  SITES.demiurge={name:"The Demiurge",body:"sun",poi:"demiurge",epithet:"Easter egg · The Sun Eater",seed:1918,
    blurb:"A black cathedral of a warship, about 100 miles long, diving nose-first into the Sun to drink plasma for its engines, then climbing back out. Shown at true scale: the convection cell below is several times wider than the ship is long.",
    facts:[["From","Christopher Ruocchio’s The Sun Eater"],["Length","About 100 miles (160 km)"],["The Sun","About 1.39 million km across, roughly 8,700 Demiurges"],["Granule below","About 1,000 km wide, a cell of rising plasma that lives for minutes"]],
    note:"An Easter egg, not part of Red Rising. The ship’s design is an original interpretation of the books’ descriptions.",
    ground:()=>0,targetLift:500,bounds:16000,minR:1500,maxR:26000,shadow:9000,win:[3,3.2],cam:{target:[0,700,0],r:14000,theta:.8,phi:1.2},defaultTod:"day",
    tods:{day:{top:0x0e0302,hor:0xe85a1c,bot:0xffa040,sun:0xffcc88,sunEl:.32,sunAz:.9,sunI:1.6,sunSize:1.01,skyL:0x5a2010,gndL:0xffa040,hemiI:1.5,fog:0xe85a1c,fogD:.00003,night:.25,exp:1.0,haze:.6},
      dusk:{top:0x0a0204,hor:0xb81e16,bot:0xff3a24,sun:0xff7a60,sunEl:.3,sunAz:.9,sunI:1.3,sunSize:1.01,skyL:0x3a0c0c,gndL:0xff4a2c,hemiI:2.2,fog:0xb81e16,fogD:.00003,night:.4,exp:1.0,haze:.6}},
    todLabel:{day:"Visible light",dusk:"Hydrogen-alpha"},
    landmarks:[
      {id:"ship",name:"The Demiurge",pos:[0,5200,0],desc:"About 100 miles from prow to stern, bristling with gun towers and spires. It plunges into the photosphere, drinks, and rises again on a slow loop.",cam:{target:[0,1200,0],r:11000,theta:.5,phi:1.18}},
      {id:"stern",name:"The rose window",pos:[0,0,0],desc:"The stern castle: a cathedral front with a great rose window over twin portals, flanked by needle-spired towers.",cam:{target:[0,0,0],r:5000,theta:0,phi:1.2}},
      {id:"intake",name:"The plunge",pos:[-1200,900,0],desc:"Where the hull cuts the photosphere, plasma sprays up and the metal glows from the heat as the ship goes under and comes back out.",cam:{target:[-600,400,0],r:4200,theta:1.1,phi:1.32}},
      {id:"granule",name:"Granule",pos:[9000,200,9000],desc:"The bright cell underfoot is the top of a column of rising gas about 1,000 km across, wider than the whole ship. Darker lanes between cells are where cooler plasma sinks.",cam:{target:[6000,0,6000],r:22000,theta:.3,phi:1.05}},
      {id:"prom",name:"Prominence",pos:[-22000,7000,-20000],desc:"A loop of plasma held up by the Sun’s magnetic field, rising tens of thousands of kilometres. Shown much smaller than true scale.",cam:{target:[-12000,2000,-10000],r:16000,theta:-.6,phi:1.15}}],
    build(ctx){const root=ctx.root;
      const camP={value:new V3()},tU={value:0},haU={value:0},fogC={value:col(0xd8642a)};
      const surf=new THREE.Mesh(new THREE.PlaneGeometry(64000,64000,1,1).rotateX(-Math.PI/2),new THREE.ShaderMaterial({uniforms:{t:tU,ha:haU,camP,fogC},vertexShader:PHOTO_VS,fragmentShader:PHOTO_FS}));root.add(surf);
      /* the ship: dives into the Sun nose-first, drinks, and climbs back out, on a slow loop */
      const L=6000;const ship=makeDemiurge2(L);ship.scale.setScalar(L/100);root.add(ship);
      ship.traverse(o=>{if(o.isMesh){o.castShadow=true;}});
      const HEAD=.5,CYCLE=56;
      const pose=el=>{const ph=(el/CYCLE)*TAU;const y=-2900+3800*Math.sin(ph);const pitch=.3*Math.cos(ph);
        ship.position.set(Math.cos(HEAD)*1400*Math.cos(ph),y,-Math.sin(HEAD)*1400*Math.cos(ph));ship.rotation.set(.03*Math.sin(ph*2),HEAD,pitch);ship.updateMatrixWorld(true);};
      pose(CYCLE*.22);
      {const lm=SITES.demiurge.landmarks.find(l=>l.id==="stern");const rw=ship.localToWorld(new V3(-50,17,0)),sd=ship.localToWorld(new V3(-60,17,0)).sub(rw).normalize();
        lm.pos=[rw.x,rw.y+900,rw.z];lm.cam={target:[rw.x,rw.y,rw.z],r:5200,theta:Math.atan2(sd.x,sd.z),phi:1.25};}
      /* plasma thrown up where the hull cuts the surface */
      const glowTex=(()=>{const c=document.createElement("canvas");c.width=c.height=128;const x=c.getContext("2d");const gr=x.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,"rgba(255,250,220,1)");gr.addColorStop(.35,"rgba(255,190,90,.6)");gr.addColorStop(1,"rgba(255,120,40,0)");x.fillStyle=gr;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);})();
      const SMP=ship.userData.samples;const nS=SMP.length/3;
      const NP=5000,pp=new Float32Array(NP*3),pc=new Float32Array(NP*3),vel=new Float32Array(NP*3),life=new Float32Array(NP),age=new Float32Array(NP);let head=0;
      for(let i=0;i<NP;i++){pp[i*3+1]=-1e5;life[i]=1;age[i]=2;}
      const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(pp,3));pg.setAttribute("color",new THREE.BufferAttribute(pc,3));
      const pm=new THREE.PointsMaterial({size:150,map:glowTex,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false});
      const pts=new THREE.Points(pg,pm);pts.frustumCulled=false;root.add(pts);
      const NW=40,wakes=[];for(let i=0;i<NW;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0,fog:false}));m.position.y=6;root.add(m);wakes.push({m,t:9,s:1});}let wHead=0;
      const v=new V3(),R0=rng(5);
      /* distant prominence loops */
      const pmM=promMat(0xff6a30);const prom=new THREE.Mesh(new THREE.TorusGeometry(9000,700,16,96,Math.PI),pmM);prom.position.set(-22000,-500,-20000);prom.rotation.y=.7;pmM.fog=false;root.add(prom);
      const pmM2=promMat(0xffa050);const prom2=new THREE.Mesh(new THREE.TorusGeometry(5200,380,12,80,Math.PI),pmM2);prom2.position.set(19000,-300,-23000);prom2.rotation.y=-.4;root.add(prom2);
      const shipLm=()=>siteLabels.find(l=>l.lm.id==="ship"),sternLm=()=>siteLabels.find(l=>l.lm.id==="stern");
      return {update(dt,el){tU.value=el;camP.value.copy(camX.position);fogC.value.copy(site3.fog.color);
        haU.value+=((tod.cur==="dusk"?1:0)-haU.value)*Math.min(1,dt*1.5);
        pmM.uniforms.t.value=el;pmM2.uniforms.t.value=el*1.3;
        pose(el+CYCLE*.22+(window.__demiT||0));
        const sl=shipLm();if(sl){ship.localToWorld(sl.pos.set(0,30,0));sl.pos.y=Math.max(sl.pos.y,300);}const st=sternLm();if(st){ship.localToWorld(st.pos.set(-52,32,0));st.pos.y=Math.max(st.pos.y,300);}
        /* find hull points near the surface and throw plasma off them */
        let spawned=0;const tries=Math.min(nS,900),dusk=haU.value>.5;
        for(let k=0;k<tries&&spawned<70;k++){const i=(R0()*nS)|0;v.set(SMP[i*3],SMP[i*3+1],SMP[i*3+2]);ship.localToWorld(v);
          if(Math.abs(v.y)<160){const j=head;head=(head+1)%NP;pp[j*3]=v.x;pp[j*3+1]=Math.max(0,v.y);pp[j*3+2]=v.z;
            const up=500+R0()*1700,a=R0()*TAU,o=200+R0()*700;vel[j*3]=Math.cos(a)*o;vel[j*3+1]=up;vel[j*3+2]=Math.sin(a)*o;life[j]=1.2+R0()*2;age[j]=0;spawned++;
            if(R0()<.06){const w=wakes[wHead];wHead=(wHead+1)%NW;w.m.position.x=v.x;w.m.position.z=v.z;w.t=0;w.s=900+R0()*1500;}}}
        for(let j=0;j<NP;j++){if(age[j]>=life[j]){pp[j*3+1]=-1e5;continue;}age[j]+=dt;const f=age[j]/life[j];
          vel[j*3+1]-=1300*dt;pp[j*3]+=vel[j*3]*dt;pp[j*3+1]+=vel[j*3+1]*dt;pp[j*3+2]+=vel[j*3+2]*dt;if(pp[j*3+1]<0){age[j]=life[j];pp[j*3+1]=-1e5;}
          const b=(1-f)*(1-f);pc[j*3]=b;pc[j*3+1]=b*(dusk?.35:.7-f*.35);pc[j*3+2]=b*(dusk?.25:.3-f*.25);}
        pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true;
        wakes.forEach(w=>{w.t+=dt;const k=Math.max(0,1-w.t/2.2);w.m.material.opacity=k*.7;const s=w.s*(1+w.t*.6);w.m.scale.set(s,1,s);});}};}};

  /* ---- loop ---- */
  let last=performance.now();
  (function loop(now){const dt=Math.min(.1,(now-last)/1000);last=now;
    try{plumeScale.value=renderer.domElement.height/(2*Math.tan(18*Math.PI/180));updDemi(dt);updLevLbl();updSiteLev(dt);}catch(e){console.error(e);}
    requestAnimationFrame(loop);})(performance.now());
})();

})();

/* Nearby Worlds - how each planet is drawn.
   The look is an artist's interpretation derived from measured properties only:
     class   (rocky / super-Earth / mini-Neptune / ice giant / gas giant) from radius, or (minimum) mass
     palette (lava / hot / warm / temperate / frozen) from equilibrium temperature
     locked  (likely tidally locked; estimate) -> fixed day side, heat pooled at the substellar point
   A seeded random generator picks variations within each family so neighbouring worlds differ.
   Output is a "gfx" block for the baked-surface shader reused from the Sun Eater Atlas. */
'use strict';
(function(){
function rng(seed){let s=seed>>>0||1;return()=>{s=Math.imul(s^(s>>>15),2246822507);s=Math.imul(s^(s>>>13),3266489909);s^=s>>>16;return (s>>>0)/4294967296;};}
const pick=(R,a)=>a[Math.floor(R()*a.length)%a.length];
const lerp=(a,b,t)=>a+(b-a)*t;
/* nudge a palette's brightness/hue a little per world */
function jitter(pal,R,k){return pal.map(h=>{const c=parseInt(h.slice(1),16);let r=c>>16&255,g=c>>8&255,b=c&255;const f=1+(R()-.5)*k;const t=(R()-.5)*k*40;
  r=Math.max(0,Math.min(255,r*f+t));g=Math.max(0,Math.min(255,g*f));b=Math.max(0,Math.min(255,b*f-t));return "#"+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1);});}

const P={
  lavaRock:["#0c0604","#190a05","#17110f","#241914","#35271f","#4a382d"],
  scorched:["#24160f","#3a2418","#583826","#7a5236","#9a6e4a","#c49a72"],
  scorched2:["#2a2622","#3c3530","#5a5048","#786a5e","#988a7a","#bcb0a0"],
  venus:["#6a5030","#8a6a40","#b08850","#c8a468","#d8bc84","#efdcb0"],
  terran:["#06172e","#1b5683","#4c6a39","#7a7a4a","#8a7560","#eef0f2"],
  terranArid:["#081a30","#215e88","#7a6a44","#9a7a52","#8a6a50","#ecebe8"],
  terranDark:["#04121f","#164a6a","#2e4a30","#4a5a38","#5e5a4a","#e8ecee"],
  ocean:["#041026","#0f3f6e","#3a5a3a","#5a6a44","#6a6a58","#f2f4f6"],
  desertCold:["#3a2c22","#5a4636","#8a6c50","#a68662","#b89a78","#e8e4dc"],
  ice:["#2e3c4c","#5e7e9c","#a4b8c8","#c4d2de","#dee6ee","#f8fbff"],
  iceDirty:["#2a2a30","#55606c","#8e98a2","#aeb6bc","#c8ccce","#eef0f2"],
  /* banded atmospheres: ramp from band low to band high, last = storm colour */
  mnHot:["#2a1a14","#4a2c20","#6a4430","#8a5e40","#a87a54","#e0a070"],
  mnWarm:["#5a5a6a","#7a7a86","#9a9488","#b4aa94","#c8bea8","#e6dcc4"],
  mnTemp:["#4a7a9a","#6a9ab4","#8ab4c8","#a8c8d8","#c4dce6","#eaf4f8"],
  mnFrozen:["#2a4a7a","#3a5e94","#4e74a8","#6a8cbc","#88a6d0","#b8cee8"],
  igHot:["#2a1e1a","#3e2c24","#56402e","#6e5440","#8a6c56","#b08a70"],
  igWarm:["#3e5a62","#4e6e76","#62848a","#7a9a9e","#94b0b2","#b8cccc"],
  igTemp:["#3e8e9c","#4e9eaa","#60acb8","#74bcc6","#8acad2","#b4e2e6"],
  igFrozen:["#16347e","#20429a","#2c52ae","#4468c0","#6684d0","#a8c0ec"],
  ggHot:["#140b09","#22120e","#341c14","#44261b","#583424","#8a4a2a"],
  ggWarm:["#26344e","#344766","#475c7e","#5e7494","#7a8ea8","#a8b6c8"],
  ggTemp:["#8a8678","#a8a494","#c4c0b0","#d8d4c6","#e8e4d8","#f6f4ec"],
  ggCold:["#6a4a34","#8a6a4c","#b08a64","#cfb08a","#e4d0b0","#c46a44"],
  /* HD 189733 b: one of the few exoplanets whose colour has been measured (Evans et al. 2013) */
  hd189:["#040e34","#071a5c","#0c2884","#143aa6","#2252c4","#4c7ee2"]
};
/* approximate glow colour of hot material at temperature T */
function heatColor(T){const t=Math.max(600,Math.min(3000,T));const k=(t-600)/2400;
  const r=1,g=lerp(.18,.62,k),b=lerp(.02,.25,k*k);return "#"+[r,g,b].map(v=>Math.round(v*255).toString(16).padStart(2,"0")).join("");}

function gfxFor(p){
  const R=rng(p.seed*7919+13);const T=p.teq_k==null?260:p.teq_k;const cls=p.class==="unknown"?"super-earth":p.class;const pal=p.palette;
  const g={locked:!!p.locked,heat:0,heatCol:"#ff4a12",interp:[]};
  const giant=cls==="gas-giant"||cls==="ice-giant"||cls==="mini-neptune";
  if(p.id==="hd-189733-b"){Object.assign(g,{type:"gas",pal:P.hd189,bands:13,atmo:"#3a6cff",atmoK:1.3,amb:.02,heat:.12,heatCol:"#ff5a20"});
    g.measuredColour=true;g.interp.push("Deep blue, as measured by Hubble (Evans et al. 2013); band pattern and storms are illustrative.");return g;}
  if(giant){
    const fam=cls==="gas-giant"?"gg":cls==="ice-giant"?"ig":"mn";
    const key={gg:{hot:"ggHot",warm:"ggWarm",temperate:"ggTemp",frozen:"ggCold"},ig:{hot:"igHot",warm:"igWarm",temperate:"igTemp",frozen:"igFrozen"},mn:{hot:"mnHot",warm:"mnWarm",temperate:"mnTemp",frozen:"mnFrozen"}}[fam][pal==="lava"?"hot":pal];
    g.type="gas";g.pal=jitter(P[key],R,.12);
    g.bands=fam==="gg"?Math.round(lerp(11,19,R())):fam==="ig"?Math.round(lerp(5,9,R())):Math.round(lerp(4,8,R()));
    g.atmo={gg:"#9cb8ff",ig:"#7ad6ff",mn:"#a8d8ff"}[fam];
    if(pal==="hot"){g.atmo="#ff9a6a";g.heat=Math.min(.7,Math.max(.1,(T-850)/1600));g.heatCol=heatColor(T*1.1);}
    if(pal==="warm")g.atmo=fam==="gg"?"#8aa6ff":"#b0c8e0";
    g.atmoK=fam==="gg"?1.0:1.35;g.amb=.016;
    return g;}
  /* rocky and super-Earth */
  if(pal==="lava"){Object.assign(g,{type:"lava",pal:jitter(P.lavaRock,R,.1),sea:lerp(.34,.42,R()),rough:.85,bump:1.5,lava:"#ff6a1e",atmo:"#ff7a3a",atmoK:.35,
      heat:Math.min(.6,Math.max(.12,(T-700)/1800)),heatCol:heatColor(T*1.1),ice:95});return g;}
  if(pal==="hot"){
    const haze=cls==="super-earth"?R()<.6:R()<.3;
    if(haze){Object.assign(g,{type:"desert",pal:jitter(P.venus,R,.12),sea:0,rough:.4,dune:7,clouds:.82,cloudCol:"#f1deb0",cloudOp:.97,atmo:"#e8b878",atmoK:1.15,ice:95});
      g.interp.push("Drawn with a thick hazy atmosphere, one possibility for a hot world of this size.");}
    else Object.assign(g,{type:"barren",pal:jitter(R()<.5?P.scorched:P.scorched2,R,.12),sea:0,rough:1,bump:1.6,atmoK:.12,atmo:"#ffb48a",ice:95});
    if(T>550){g.heat=Math.min(.35,(T-520)/1400);g.heatCol=heatColor(T*1.2);}
    return g;}
  if(pal==="frozen"){Object.assign(g,{type:"ice",pal:jitter(R()<.6?P.ice:P.iceDirty,R,.1),sea:lerp(.2,.35,R()),rough:.7,atmoK:cls==="super-earth"?.45:.2,atmo:"#bcd4ff",ice:60,bump:1.2});return g;}
  /* temperate */
  if(p.hz||p.hz_candidate){
    const water=cls==="super-earth"&&R()<.4;
    if(water){Object.assign(g,{type:"ocean",pal:jitter(P.ocean,R,.08),sea:.68,clouds:.55,atmo:"#7fb2ff",atmoK:1,ice:lerp(62,74,R())});
      g.interp.push("Drawn as a water-rich world, one of several possibilities for a temperate super-Earth.");}
    else{Object.assign(g,{type:"terran",pal:jitter(pick(R,[P.terran,P.terranArid,P.terranDark]),R,.08),sea:lerp(.44,.6,R()),clouds:lerp(.4,.6,R()),atmo:"#7fb2ff",atmoK:1,ice:lerp(62,76,R()),warp:lerp(.5,.9,R())});
      g.interp.push("Oceans, land and clouds are one possibility. Nobody knows whether this planet has water or an atmosphere.");}
    return g;}
  Object.assign(g,{type:"desert",pal:jitter(P.desertCold,R,.12),sea:lerp(.2,.32,R()),rough:.7,dune:9,atmoK:.35,atmo:"#d8c0a8",ice:lerp(55,70,R())});
  return g;}

window.LOOKS={gfxFor,heatColor};
})();

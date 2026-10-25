/* Nearby Worlds - main engine.
   Three views share one renderer:
     map     the Sun's neighbourhood to 100 ly, stars at their real positions (galactic coordinates, 1 unit = 1 ly)
     system  one star with its planets on their orbits (visible or true scale), habitable zone, orbital motion
     planet  an HD procedural close-up of one planet, with a data panel
   Engine pieces (orbit camera, HD bake pipeline, planet/cloud/atmosphere materials, labels, bottom sheet,
   fades and fly-to transitions) are adapted from the Sun Eater / Hyperion atlases. */
(function(){
'use strict';
const D=window.NEARBY;
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const TAU=Math.PI*2,DEG=Math.PI/180;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function isMob(){return matchMedia("(max-width:820px), (max-height:520px) and (pointer:coarse)").matches;}
const MOB=isMob();
function rng(seed){let s=seed>>>0||1;return()=>{s=Math.imul(s^(s>>>15),2246822507);s=Math.imul(s^(s>>>13),3266489909);s^=s>>>16;return (s>>>0)/4294967296;};}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function gauss(R){return (R()+R()+R()+R()-2)/2;}
const C=h=>new THREE.Color(h);
const CL=h=>new THREE.Color(h).convertSRGBToLinear();
const AU_RSUN=0.00465047, AU_REARTH=4.26352e-5, MJ=317.828, RJ=11.209;

if(!window.THREE||!D){document.body.insertAdjacentHTML("beforeend",'<div id="nogl"><p>Nearby Worlds needs WebGL and its data file. Please reload, or try another browser.</p></div>');return;}

/* ===================== RENDERER ===================== */
const canvas=$("#c");
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});}
catch(e){document.body.insertAdjacentHTML("beforeend",'<div id="nogl"><p>This browser could not start WebGL, which Nearby Worlds needs to draw the map.</p></div>');return;}
renderer.setPixelRatio(Math.min(devicePixelRatio||1,MOB?1.6:2));
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.0;
renderer.setClearColor(0x03050a,1);
const MAXTEX=renderer.capabilities.maxTextureSize||4096;
const ANISO=Math.min(8,renderer.capabilities.getMaxAnisotropy());
const HD=window.__HD||Math.min(MOB?2048:4096,MAXTEX);

/* ===================== COLOUR OF STARLIGHT ===================== */
/* blackbody approximation (Tanner Helland fit), returns sRGB 0..1 */
function kelvinRGB(K){const t=clamp(K,1000,40000)/100;let r,g,b;
  if(t<=66){r=255;g=99.4708025861*Math.log(t)-161.1195681661;b=t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307;}
  else{r=329.698727446*Math.pow(t-60,-0.1332047592);g=288.1221695283*Math.pow(t-60,-0.0755148492);b=255;}
  return [r,g,b].map(v=>clamp(v,0,255)/255);}
function starHex(teff){const c=kelvinRGB(teff||3500);return "#"+c.map(v=>Math.round(v*255).toString(16).padStart(2,"0")).join("");}
function starColor(teff){const c=kelvinRGB(teff||3500);return new THREE.Color(c[0],c[1],c[2]);}

/* ===================== DATA PREP ===================== */
const SYS=D.systems;const SYS_BY={};const PL_BY={};
SYS.forEach(s=>{SYS_BY[s.id]=s;s.pos=new THREE.Vector3(s.xyz[0],s.xyz[1],s.xyz[2]);
  s.hosts=s.stars.filter(st=>s.planets.some(p=>p.host===st.name));if(!s.hosts.length)s.hosts=[s.stars[0]];
  s.primary=s.hosts.slice().sort((a,b)=>s.planets.filter(p=>p.host===b.name).length-s.planets.filter(p=>p.host===a.name).length)[0];
  s.col=starHex(s.primary.teff);
  s.planets.forEach(p=>{p.sys=s;p.star=s.stars.find(st=>st.name===p.host)||s.primary;PL_BY[p.id]=p;});
  s.search=(s.name+" "+s.oec_name+" "+s.stars.map(x=>x.name).join(" ")+" "+s.planets.map(p=>p.name+" "+(p.aliases||[]).join(" ")).join(" ")).toLowerCase();});
const TOUR_IDS=["proxima-centauri","trappist-1","55-cancri","tau-ceti","epsilon-eridani","hd-189733"];
const MAJOR=new Set(TOUR_IDS.concat(["barnard-s-star","teegarden-s-star","lhs-1140","gj-1214","gliese-581","beta-pictoris","epsilon-indi","lalande-21185-gj-411","ross-128","51-peg","gliese-876","l-98-59","gliese-12","struve-2398-gj-725","au-mic","82-g-eridani-hd-20794"]));
const CLASSES=[["rocky","Rocky","#c99a72"],["super-earth","Super-Earth","#e2c47c"],["mini-neptune","Mini-Neptune","#86d0e6"],["ice-giant","Ice giant","#5d8ff0"],["gas-giant","Gas giant","#eba56a"],["brown-dwarf","Brown dwarf","#b0705a"]];
const CLASS_COL={};CLASSES.forEach(c=>CLASS_COL[c[0]]=c[2]);CLASS_COL.unknown="#9aa4b0";
const METHODS=[["RV","Radial velocity"],["transit","Transit"],["imaging","Direct imaging"],["other","Astrometry & timing"]];
const METHOD_LABEL={RV:"Radial velocity",transit:"Transit",imaging:"Direct imaging",astrometry:"Astrometry",timing:"Timing variations"};
const mgroup=m=>m==="RV"||m==="transit"||m==="imaging"?m:"other";

/* ===================== FORMATTING ===================== */
function num(v,dp){if(v==null||isNaN(v))return "—";const a=Math.abs(v);
  if(dp!=null)return v.toLocaleString("en-US",{minimumFractionDigits:dp,maximumFractionDigits:dp});
  if(a>=1000)return Math.round(v).toLocaleString("en-US");if(a>=100)return v.toFixed(0);if(a>=10)return v.toFixed(1);if(a>=1)return v.toFixed(2);
  if(a===0)return "0";return v.toPrecision(2).replace(/^0\.?0*e.*$/,"0");}
const ly=s=>num(s.dist_ly)+" ly";
/* mass_kind: "min" (M sin i), "true", "upper" (upper limit) or "estimate"; older data only had mass_src */
function massKind(p){if(p.mass_kind)return p.mass_kind;const s=p.mass_src;return s==="model"||s==="estimated"?"estimate":s||null;}
function massText(p){const m=p.mass_earth;if(m==null)return "—";const k=massKind(p);const pre=k==="min"?"≥ ":k==="upper"?"< ":k==="estimate"?"≈ ":"";
  if(m>=50)return pre+num(m/MJ)+" Jupiter masses <small>("+num(m)+" Earth)</small>";return pre+num(m)+" Earth masses";}
function radiusText(p){const r=p.radius_earth;if(r==null)return "—";const pre=p.radius_src==="estimated"?"≈ ":"";
  if(r>=6)return pre+num(r/RJ)+" Jupiter radii <small>("+num(r)+" Earth)</small>";return pre+num(r)+" Earth radii";}
function periodText(P){if(P==null)return "—";if(P<1)return num(P*24)+" hours";if(P>730)return num(P)+" days <small>("+num(P/365.25)+" yr)</small>";return num(P)+" days";}
const tempText=T=>T==null?"—":num(T,0)+" K <small>("+num(T-273.15,0)+" °C)</small>";
const auText=a=>a==null?"—":num(a)+" AU";
function shortName(p){const s=p.sys;let n=p.name;[s.name,p.host,s.oec_name].forEach(k=>{if(k&&n.indexOf(k+" ")===0&&n.length-k.length<=4)n=n.slice(k.length+1);});return n.length<=3?n:p.name;}

/* ===================== SCENES & CAMERAS ===================== */
const mapS=new THREE.Scene(),camM=new THREE.PerspectiveCamera(48,1,.05,8000);
const sysS=new THREE.Scene(),camS=new THREE.PerspectiveCamera(40,1,.002,8000);
const plS=new THREE.Scene(),camP=new THREE.PerspectiveCamera(36,1,.005,4000);

function glowTex(stops){const cv=document.createElement("canvas");cv.width=cv.height=128;const g=cv.getContext("2d");const gr=g.createRadialGradient(64,64,0,64,64,64);
  stops.forEach(s=>gr.addColorStop(s[0],s[1]));g.fillStyle=gr;g.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;return t;}
function glowSprite(tex,scale,op){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:op==null?1:op}));s.scale.set(scale,scale,1);return s;}
const GLOW_W=glowTex([[0,"rgba(255,255,255,1)"],[.18,"rgba(235,242,255,.55)"],[.5,"rgba(140,170,255,.1)"],[1,"rgba(0,0,0,0)"]]);
const GLOW_SOFT=glowTex([[0,"rgba(255,255,255,.9)"],[.4,"rgba(255,255,255,.25)"],[1,"rgba(255,255,255,0)"]]);
const DISC=glowTex([[0,"rgba(255,255,255,1)"],[.86,"rgba(255,255,255,1)"],[1,"rgba(255,255,255,0)"]]);
const RING_T=(function(){const cv=document.createElement("canvas");cv.width=cv.height=128;const g=cv.getContext("2d");g.strokeStyle="#fff";g.lineWidth=5;g.beginPath();g.arc(64,64,52,0,TAU);g.stroke();
  g.lineWidth=2;for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;g.beginPath();g.moveTo(64+Math.cos(a)*40,64+Math.sin(a)*40);g.lineTo(64+Math.cos(a)*30,64+Math.sin(a)*30);g.stroke();}return new THREE.CanvasTexture(cv);})();
function skyStars(scene,n,r,size,seed){const g=new THREE.BufferGeometry();const p=new Float32Array(n*3),c=new Float32Array(n*3);const R=rng(seed||n+3);
  for(let i=0;i<n;i++){const u=R()*2-1,t=R()*TAU,s=Math.sqrt(1-u*u);p[i*3]=s*Math.cos(t)*r;p[i*3+1]=u*r;p[i*3+2]=s*Math.sin(t)*r;
    const w=Math.pow(R(),2.4)*.8+.07,warm=R()<.3;c[i*3]=w;c[i*3+1]=w*(warm?.84:.95);c[i*3+2]=w*(warm?.7:1);}
  g.setAttribute("position",new THREE.BufferAttribute(p,3));g.setAttribute("color",new THREE.BufferAttribute(c,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({size,sizeAttenuation:false,vertexColors:true,transparent:true,depthWrite:false}));pts.frustumCulled=false;scene.add(pts);return pts;}
/* Milky Way band: in map coordinates the galactic plane is horizontal, so the band really does lie along it, brightest toward the centre (+x) */
function milkyWay(scene,r,tilt,n,seed){const R=rng(seed||77);const p=new Float32Array(n*3),c=new Float32Array(n*3);const v=new THREE.Vector3();const m=new THREE.Matrix4().makeRotationFromEuler(tilt||new THREE.Euler());
  for(let i=0;i<n;i++){const a=R()*TAU;const core=Math.pow(Math.cos(a/2),6);const sp=gauss(R)*(.07+core*.08);v.set(Math.cos(a),sp,Math.sin(a)).normalize().multiplyScalar(r).applyMatrix4(m);p.set([v.x,v.y,v.z],i*3);
    const w=.045+R()*.15*(1+core*1.4);c.set([w,w*.94,w*.86],i*3);}
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(p,3));g.setAttribute("color",new THREE.BufferAttribute(c,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({size:1.2,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:.9,depthWrite:false}));pts.frustumCulled=false;scene.add(pts);return pts;}

/* ===================== ORBIT CONTROLS (from the atlas engine) ===================== */
class Orbit{
  constructor(cam,o){this.cam=cam;this.t=o.target.clone();this.gt=o.target.clone();this.yaw=o.yaw;this.gyaw=o.yaw;this.pitch=o.pitch;this.gpitch=o.pitch;this.dist=o.dist;this.gdist=o.dist;
    this.min=o.min;this.max=o.max;this.pmin=o.pmin==null?-1.45:o.pmin;this.pmax=o.pmax==null?1.45:o.pmax;this.fly=null;this.vy=0;this.vp=0;}
  flyTo(target,dist,yaw,pitch,dur){this.fly={t0:performance.now(),dur:dur||1600,fT:this.t.clone(),fD:this.dist,fY:this.yaw,fP:this.pitch,tT:target.clone(),tD:dist,tY:yaw==null?this.yaw:yaw,tP:pitch==null?this.pitch:pitch};}
  update(dt){
    if(this.fly){const f=this.fly;const k=clamp((performance.now()-f.t0)/f.dur,0,1);const e=ease(k);
      this.t.lerpVectors(f.fT,f.tT,e);
      const ld=lerp(Math.log(f.fD),Math.log(f.tD),e);const bump=Math.sin(k*Math.PI)*Math.max(0,Math.log(f.tT.distanceTo(f.fT)/Math.max(f.tD,f.fD)+1))*.35;
      this.dist=Math.exp(ld+bump);this.yaw=lerp(f.fY,f.tY,e);this.pitch=lerp(f.fP,f.tP,e);
      this.gt.copy(this.t);this.gdist=this.dist;this.gyaw=this.yaw;this.gpitch=this.pitch;if(k>=1)this.fly=null;}
    else{const s=1-Math.pow(.0005,dt);this.yaw=lerp(this.yaw,this.gyaw,s);this.pitch=lerp(this.pitch,this.gpitch,s);
      this.dist=Math.exp(lerp(Math.log(this.dist),Math.log(this.gdist),s));this.t.lerp(this.gt,s);}
    const cp=Math.cos(this.pitch);this.cam.position.set(this.t.x+Math.sin(this.yaw)*cp*this.dist,this.t.y+Math.sin(this.pitch)*this.dist,this.t.z+Math.cos(this.yaw)*cp*this.dist);
    this.cam.lookAt(this.t);}
  rotate(dx,dy){this.fly=null;this.gyaw-=dx*.005;this.gpitch=clamp(this.gpitch+dy*.005,this.pmin,this.pmax);}
  zoom(f){this.fly=null;this.gdist=clamp(this.gdist*f,this.min,this.max);}
  pan(dx,dy){this.fly=null;const k=this.dist*.0016;const right=new THREE.Vector3(Math.cos(this.yaw),0,-Math.sin(this.yaw));const fwd=new THREE.Vector3(-Math.sin(this.yaw),0,-Math.cos(this.yaw));
    this.gt.addScaledVector(right,-dx*k).addScaledVector(fwd,dy*k);}
}
const HOME={t:new THREE.Vector3(0,0,0),d:MOB?330:250,yaw:.9,pitch:.62};
const orbM=new Orbit(camM,{target:HOME.t,yaw:HOME.yaw,pitch:HOME.pitch,dist:520,min:2,max:900,pmin:-1.5,pmax:1.5});
const orbS=new Orbit(camS,{target:new THREE.Vector3(),yaw:.5,pitch:.55,dist:90,min:2,max:600,pmin:-1.5,pmax:1.5});
const orbP=new Orbit(camP,{target:new THREE.Vector3(),yaw:.6,pitch:.22,dist:4.2,min:1.12,max:14});

/* ===================== STATE ===================== */
const S={view:"map",sel:null,hover:null,host:null,planet:null,interacted:false,scale:"vis",speed:1,days:0,showHZ:true,tour:-1};
const F={types:new Set(CLASSES.map(c=>c[0]).concat(["unknown"])),methods:new Set(METHODS.map(m=>m[0])),hz:false,disputed:true};
function planetShown(p){if(p.status==="disputed"&&!F.disputed)return false;if(!F.types.has(p.class))return false;if(!F.methods.has(mgroup(p.method)))return false;if(F.hz&&!p.hz_candidate)return false;return true;}
const sysShown=s=>s.planets.some(planetShown);
const filtersActive=()=>F.hz||!F.disputed||F.types.size<CLASSES.length+1||F.methods.size<METHODS.length;

/* ===================== MAP: STARS, STALKS, RINGS ===================== */
let markPts,markMat,selRing,hoverRing;
(function buildMap(){
  skyStars(mapS,MOB?2400:4200,3000,1.3,5);
  milkyWay(mapS,2800,null,MOB?9000:18000,77);
  const n=SYS.length;const p=new Float32Array(n*3),c=new Float32Array(n*3),sz=new Float32Array(n),dm=new Float32Array(n).fill(1);
  SYS.forEach((s,i)=>{p.set([s.pos.x,s.pos.y,s.pos.z],i*3);const col=starColor(s.primary.teff);c.set([col.r,col.g,col.b],i*3);
    const L=s.primary.lum_sun||.01;sz[i]=clamp(6.2+1.1*Math.log10(L),3.8,9)*(MAJOR.has(s.id)?1.1:1);});
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(p,3));g.setAttribute("color",new THREE.BufferAttribute(c,3));
  g.setAttribute("aS",new THREE.BufferAttribute(sz,1));g.setAttribute("aDim",new THREE.BufferAttribute(dm,1));
  markMat=new THREE.ShaderMaterial({vertexShader:MARK_VS,fragmentShader:MARK_FS,uniforms:{uPx:{value:renderer.getPixelRatio()},uScale:{value:70}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  markPts=new THREE.Points(g,markMat);markPts.frustumCulled=false;mapS.add(markPts);
  /* the Sun and landmark stars */
  const ex=[{pos:new THREE.Vector3(),teff:5772,s:6.2}].concat(D.landmarks.map(l=>({pos:new THREE.Vector3(l.xyz[0],l.xyz[1],l.xyz[2]),teff:l.teff,s:4.6})));
  const ep=new Float32Array(ex.length*3),ec=new Float32Array(ex.length*3),es=new Float32Array(ex.length),ed=new Float32Array(ex.length);
  ex.forEach((e,i)=>{ep.set([e.pos.x,e.pos.y,e.pos.z],i*3);const col=starColor(e.teff);ec.set([col.r,col.g,col.b],i*3);es[i]=e.s;ed[i]=i===0?1:.35;});
  const eg=new THREE.BufferGeometry();eg.setAttribute("position",new THREE.BufferAttribute(ep,3));eg.setAttribute("color",new THREE.BufferAttribute(ec,3));eg.setAttribute("aS",new THREE.BufferAttribute(es,1));eg.setAttribute("aDim",new THREE.BufferAttribute(ed,1));
  const ePts=new THREE.Points(eg,markMat);ePts.frustumCulled=false;mapS.add(ePts);
  const sunGlow=glowSprite(GLOW_W,9,.55);sunGlow.material.color.set("#ffe2b0");mapS.add(sunGlow);
  /* stalks down to the galactic plane, and a tick where each lands */
  const sp=[],tp=[];SYS.forEach(s=>{sp.push(s.pos.x,s.pos.y,s.pos.z,s.pos.x,0,s.pos.z);tp.push(s.pos.x,0,s.pos.z);});
  const sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.Float32BufferAttribute(sp,3));
  const stalks=new THREE.LineSegments(sg,new THREE.LineBasicMaterial({color:CL("#5e86a8"),transparent:true,opacity:.11,depthWrite:false}));mapS.add(stalks);
  const tg=new THREE.BufferGeometry();tg.setAttribute("position",new THREE.Float32BufferAttribute(tp,3));
  mapS.add(new THREE.Points(tg,new THREE.PointsMaterial({color:CL("#6f9cc4"),size:2,sizeAttenuation:false,transparent:true,opacity:.35,depthWrite:false})));
  /* distance rings in the galactic plane, spokes every 30 degrees of galactic longitude */
  [10,25,50,100].forEach(r=>{const pts=[];for(let i=0;i<=256;i++){const a=i/256*TAU;pts.push(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r));}
    const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:CL(r===100?"#4f86b0":"#3c6a90"),transparent:true,opacity:r===100?.55:.42,depthWrite:false}));mapS.add(l);});
  const spk=[];for(let k=0;k<12;k++){const a=k*30*DEG;spk.push(Math.cos(a)*10,0,-Math.sin(a)*10,Math.cos(a)*100,0,-Math.sin(a)*100);}
  const kg=new THREE.BufferGeometry();kg.setAttribute("position",new THREE.Float32BufferAttribute(spk,3));
  mapS.add(new THREE.LineSegments(kg,new THREE.LineBasicMaterial({color:CL("#2e5070"),transparent:true,opacity:.3,depthWrite:false})));
  /* faint plane disc so the eye reads "up" and "down" */
  const disc=new THREE.Mesh(new THREE.CircleGeometry(100,96),new THREE.MeshBasicMaterial({color:CL("#0e2236"),transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide}));disc.rotation.x=-Math.PI/2;mapS.add(disc);
  selRing=new THREE.Sprite(new THREE.SpriteMaterial({map:RING_T,color:CL("#bfe6ff"),transparent:true,depthWrite:false,depthTest:false,opacity:0,sizeAttenuation:false}));selRing.scale.set(.05,.05,1);mapS.add(selRing);
  hoverRing=new THREE.Sprite(new THREE.SpriteMaterial({map:RING_T,color:CL("#e8eef6"),transparent:true,depthWrite:false,depthTest:false,opacity:0,sizeAttenuation:false}));hoverRing.scale.set(.036,.036,1);mapS.add(hoverRing);
})();
function applyFilterToMap(){const a=markPts.geometry.attributes.aDim;SYS.forEach((s,i)=>a.setX(i,sysShown(s)?1:.1));a.needsUpdate=true;}

/* ===================== HD PLANET BAKING (atlas engine) ===================== */
const TYPES={terran:0,ocean:1,archipelago:2,desert:3,forest:4,ice:5,gas:6,city:7,barren:8,lava:9,hive:10,toxic:11,dyson:12};
const bakeMat=new THREE.ShaderMaterial({vertexShader:BAKE_VS,fragmentShader:BAKE_FS,depthTest:false,depthWrite:false,
  uniforms:{uPass:{value:0},uType:{value:0},uOct:{value:8},uSeed:{value:new THREE.Vector3()},uFreq:{value:1.6},uWarp:{value:.6},uRough:{value:.6},uSea:{value:.5},uIce:{value:72},
    uLights:{value:0},uBump:{value:1},uCloud:{value:.5},uCloudScale:{value:2.2},uBands:{value:14},uWall:{value:0},uNF:{value:0},uFA:{value:[]},uFB:{value:[]},uFC:{value:[]},uFD:{value:[]},tBase:{value:null},uBase:{value:0},uDune:{value:9},uMoist:{value:0},uEps:{value:.002},
    uP0:{value:new THREE.Color()},uP1:{value:new THREE.Color()},uP2:{value:new THREE.Color()},uP3:{value:new THREE.Color()},uP4:{value:new THREE.Color()},uP5:{value:new THREE.Color()}}});
for(let i=0;i<14;i++){["uFA","uFB","uFC","uFD"].forEach(k=>bakeMat.uniforms[k].value.push(new THREE.Vector4()));}
const bakeScene=new THREE.Scene();const bakeCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const bakeQuad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),bakeMat);bakeQuad.frustumCulled=false;bakeScene.add(bakeQuad);
function setBakeU(g,seedKey){const u=bakeMat.uniforms;const R=rng(hashStr(seedKey));
  u.uType.value=TYPES[g.type]!=null?TYPES[g.type]:0;u.uSeed.value.set(R()*40-20,R()*40-20,R()*40-20);
  u.uFreq.value=g.freq||1.6;u.uWarp.value=g.warp==null?.6:g.warp;u.uRough.value=g.rough==null?.6:g.rough;u.uSea.value=g.sea==null?.5:g.sea;
  u.uIce.value=g.ice==null?78:g.ice;u.uLights.value=0;u.uBump.value=g.bump==null?1:g.bump;u.uCloud.value=g.clouds||0;u.uCloudScale.value=g.cloudScale||2.2;
  u.uBands.value=g.bands||14;u.uWall.value=0;u.uDune.value=g.dune||9;u.uMoist.value=g.moist||0;u.uNF.value=0;u.uBase.value=0;
  const pal=g.pal;["uP0","uP1","uP2","uP3","uP4","uP5"].forEach((k,i)=>u[k].value.set(pal[i]||pal[pal.length-1]));}
function makeRT(w,h,mip){const rt=new THREE.WebGLRenderTarget(w,h,{depthBuffer:false,stencilBuffer:false,wrapS:THREE.RepeatWrapping,wrapT:THREE.ClampToEdgeWrapping,
  minFilter:mip?THREE.LinearMipmapLinearFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,generateMipmaps:!!mip});rt.texture.anisotropy=ANISO;return rt;}
function renderBake(rt,y0,rows){const W=rt.width;renderer.setRenderTarget(rt);
  if(rows!=null){renderer.setScissorTest(true);rt.scissor.set(0,y0,W,rows);rt.scissorTest=true;}
  renderer.render(bakeScene,bakeCam);rt.scissorTest=false;renderer.setScissorTest(false);renderer.setRenderTarget(null);}
const octFor=size=>size>=4096?10:size>=2048?9:size>=1024?8:6;
function bakeNow(g,key,W){const H=W/2;const set={alb:makeRT(W,H,true),nrm:makeRT(W,H,true),cld:makeRT(W,H,true),size:W};
  setBakeU(g,key);const u=bakeMat.uniforms;u.uOct.value=octFor(W);u.uEps.value=TAU/W*.6;
  u.uPass.value=0;renderBake(set.alb);u.uPass.value=1;renderBake(set.nrm);u.uPass.value=2;u.uOct.value=g.clouds?7:3;renderBake(set.cld);return set;}
const bakeJobs=[];let BAKE_SCALE=1;
function queueBake(g,key,W,done,progress){const H=W/2;const job={g,key,W,H,set:{alb:makeRT(W,H,true),nrm:makeRT(W,H,true),cld:makeRT(W/2,H/2,true),size:W},pass:0,row:0,done,progress,cancelled:false};bakeJobs.push(job);return job;}
function bakeStep(){
  const job=bakeJobs[0];if(!job){bakeStep.last=0;return;}if(job.cancelled){disposeSet(job.set);bakeJobs.shift();return;}
  setBakeU(job.g,job.key);const u=bakeMat.uniforms;
  const rt=job.pass===0?job.set.alb:job.pass===1?job.set.nrm:job.set.cld;
  if(bakeStep.last){const ft=performance.now()-bakeStep.last;BAKE_SCALE=clamp(BAKE_SCALE*(ft>34?.7:ft<20?1.15:1),.05,2.5);}bakeStep.last=performance.now();
  const budget=(MOB?520000:1900000)*BAKE_SCALE/(job.pass===1?3.2:1);
  const rows=Math.max(8,Math.floor(budget/rt.width/8)*8);
  u.uPass.value=job.pass;u.uOct.value=job.pass===2?(job.g.clouds?8:3):octFor(job.W);u.uEps.value=TAU/job.W*.6;
  renderBake(rt,job.row,Math.min(rows,rt.height-job.row));job.row+=rows;
  const tot=job.H*2+job.H/2;const doneRows=(job.pass>0?job.H:0)+(job.pass>1?job.H:0)+Math.min(job.row,rt.height)*(job.pass===2?2:1);
  if(job.progress)job.progress(clamp(doneRows/tot,0,1));
  if(job.row>=rt.height){job.pass++;job.row=0;if(job.pass>2){bakeJobs.shift();job.done(job.set);}}
}
function disposeSet(s){if(!s)return;["alb","nrm","cld"].forEach(k=>s[k]&&s[k].dispose());}

/* materials */
const SPHERE=new THREE.SphereGeometry(1,MOB?160:256,MOB?110:176);
const SPHERE_LO=new THREE.SphereGeometry(1,64,40);
function planetMaterial(set,g,sunDir,sunCol,seed){const u={tAlb:{value:set.alb.texture},tNrm:{value:set.nrm.texture},tCld:{value:set.cld.texture},
    uSun:{value:sunDir.clone()},uSunCol:{value:sunCol.clone()},uAtmo:{value:CL(g.atmo||"#6fa8ff")},uAtmoK:{value:g.atmoK==null?1:g.atmoK},
    uLightCol:{value:new THREE.Color(0,0,0)},uLava:{value:CL(g.lava||"#ff5a1a")},uLavaOn:{value:g.type==="lava"?1:0},uSeed:{value:new THREE.Vector3(seed%97,3,7)},
    uCloudShift:{value:0},uDetail:{value:0},uHasSea:{value:(g.sea>0&&g.type!=="gas")?1:0},uWaterCol:{value:CL(g.pal[1])},uLandCol:{value:CL(g.pal[2])},uAmb:{value:g.amb==null?.016:g.amb},
    uHasCld:{value:g.clouds?1:0},uTime:{value:0},uRot:{value:new THREE.Matrix3()},uLocked:{value:g.locked?1:0},uHeat:{value:g.heat||0},uHeatCol:{value:CL(g.heatCol||"#ff4a12")}};
  return new THREE.ShaderMaterial({vertexShader:PLANET_VS,fragmentShader:PLANET_FS,uniforms:u,extensions:{derivatives:true}});}
function cloudMaterial(set,g,sunDir,sunCol){return new THREE.ShaderMaterial({vertexShader:PLANET_VS,fragmentShader:CLOUD_FS,transparent:true,depthWrite:false,extensions:{derivatives:true},
  uniforms:{tCld:{value:set.cld.texture},uSun:{value:sunDir.clone()},uSunCol:{value:sunCol.clone()},uCloudCol:{value:CL(g.cloudCol||"#ffffff")},
    uAtmo:{value:CL(g.atmo||"#6fa8ff")},uCloudShift:{value:0},uOpacity:{value:g.cloudOp||.95},uRot:{value:new THREE.Matrix3()}}});}
function atmoMesh(g,r,sunDir){return new THREE.Mesh(new THREE.SphereGeometry(r,96,64),new THREE.ShaderMaterial({vertexShader:ATMO_VS,fragmentShader:ATMO_FS,side:THREE.BackSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  uniforms:{uC:{value:CL(g.atmo||"#6fa8ff")},uSun:{value:sunDir.clone()},uK:{value:(g.atmoK==null?1:g.atmoK)*.62},uEdge:{value:1/Math.sqrt(1-1/(r*r))}}}));}
/* light reaching a planet: the star's colour, a touch brighter so dim red light still reads on screen */
function sunColFor(st){const c=starColor(st.teff||5000);return new THREE.Color(c.r,c.g,c.b).convertSRGBToLinear().multiplyScalar(1.15);}
const gfxCache={};function gfxOf(p){return gfxCache[p.id]||(gfxCache[p.id]=window.LOOKS.gfxFor(p.class==="brown-dwarf"?Object.assign({},p,{class:"gas-giant"}):p));}

/* ===================== STAR (system view) ===================== */
function starMesh(st,r,seed){const col=starColor(st.teff||4000);const lc=new THREE.Color(col.r,col.g,col.b);const limb=lc.clone().multiply(new THREE.Color(1,.62,.42));
  const spots=clamp((4200-(st.teff||5000))/1600,.15,1);
  const m=new THREE.Mesh(new THREE.SphereGeometry(r,96,64),new THREE.ShaderMaterial({vertexShader:STAR_VS,fragmentShader:STAR_FS,uniforms:{uTime:{value:0},uSpots:{value:spots},uSeed:{value:seed%31},uCol:{value:lc},uLimb:{value:limb}}}));
  const cor=new THREE.Mesh(new THREE.PlaneGeometry(r*8,r*8),new THREE.ShaderMaterial({vertexShader:CORONA_VS,fragmentShader:CORONA_FS,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uTime:m.material.uniforms.uTime,uCol:{value:lc.clone().multiplyScalar(.9)},uK:{value:.9}}}));
  cor.frustumCulled=false;const halo=glowSprite(GLOW_W,r*14,.42);halo.material.color.copy(lc);
  const g=new THREE.Group();g.add(cor);g.add(m);g.add(halo);g.userData={mesh:m,cor,halo};return g;}

/* ===================== SYSTEM VIEW ===================== */
skyStars(sysS,MOB?2000:3600,4000,1.3,9);milkyWay(sysS,3800,new THREE.Euler(.9,.3,.2),MOB?6000:12000,31);
const sysGroup=new THREE.Group();sysS.add(sysGroup);
let SV=null;
const SEL_RING=new THREE.Sprite(new THREE.SpriteMaterial({map:RING_T,color:CL("#bfe6ff"),transparent:true,depthWrite:false,depthTest:false,opacity:0,sizeAttenuation:false}));SEL_RING.scale.set(.05,.05,1);sysS.add(SEL_RING);
function orbitMaterial(col,a,dash){return new THREE.ShaderMaterial({vertexShader:ORBIT_VS,fragmentShader:ORBIT_FS,uniforms:{uC:{value:CL(col)},uA:{value:a},uDash:{value:dash||0}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});}
function kepler(M,e){let E=e<.8?M:Math.PI;for(let i=0;i<12;i++){E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));}return E;}
/* radial mapping from AU to scene units */
function makeRadial(planets,st,mode){
  const as=planets.map(p=>p.a_au).filter(a=>a>0);const hz=st.hz;
  let amin=as.length?Math.min(...as):.05,amax=as.length?Math.max(...as):.1;
  if(mode==="true"){let hi=amax;if(hz&&hz.earlyMars<amax*4&&hz.earlyMars>amax)hi=hz.earlyMars;if(as.length===1&&hz&&hz.earlyMars<amax*4)hi=Math.max(hi,hz.earlyMars);
    const K=38/hi;return {mode,K,f:a=>a*K,starR:Math.max((st.radius_sun||.3)*AU_RSUN*K,1e-4),planetR:p=>Math.max((p.radius_earth||1)*AU_REARTH*K,1e-6)};}
  const starR=clamp(1.15*Math.pow(st.radius_sun||.3,.33),.65,2.2);const Rin=starR*2.3,Rout=40;
  let lo=amin/1.7,hi=amax*1.2;if(as.length<=1){lo=amin/2.6;hi=amin*1.5;}
  /* keep a nearby habitable zone on screen even when the planets lie outside it */
  if(hz){if(hz.recentVenus<lo&&hz.recentVenus>amin/12)lo=hz.recentVenus*.8;if(hz.earlyMars>hi&&hz.earlyMars<amax*12)hi=hz.earlyMars*1.12;}
  const L=Math.log(hi/lo);
  const f=a=>{if(a<=lo)return Math.max(starR*1.15,Rin*Math.pow(a/lo,.5));return Rin+(Rout-Rin)*Math.log(a/lo)/L;};
  return {mode,f,starR,planetR:p=>clamp(.42+.5*Math.sqrt(p.radius_earth||1),.55,2.3)};}
function buildSystem(s,hostName){
  clearSystem();
  const st=s.stars.find(x=>x.name===hostName)||s.primary;S.host=st.name;
  const planets=s.planets.filter(p=>p.host===st.name);
  const RM=makeRadial(planets,st,S.scale);
  const V={s,st,planets,RM,items:[],labels:[]};
  const star=starMesh(st,RM.starR,hashStr(st.name));sysGroup.add(star);V.star=star;
  const lc=sunColFor(st);
  /* habitable zone */
  if(st.hz){const h=st.hz;const i0=RM.f(h.recentVenus),i1=RM.f(h.runaway),o0=RM.f(h.maxGreenhouse),o1=RM.f(h.earlyMars);
    const ring=new THREE.Mesh(new THREE.RingGeometry(Math.max(i0*.97,RM.starR*1.05),o1*1.03,256,1),new THREE.ShaderMaterial({vertexShader:HZ_VS,fragmentShader:HZ_FS,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,
      uniforms:{uI0:{value:i0},uI1:{value:i1},uO0:{value:o0},uO1:{value:o1},uA:{value:1},uC:{value:CL("#6fe0a0")}}}));
    ring.rotation.x=-Math.PI/2;ring.visible=S.showHZ;sysGroup.add(ring);V.hz=ring;V.hzR=[i0,i1,o0,o1];}
  /* planets */
  planets.forEach((p,i)=>{
    const R=rng(p.seed+11);const e=p.ecc||0;const w=R()*TAU;const M0=R()*TAU;
    const it={p,e,w,M0,a:p.a_au};
    const col=p.status==="disputed"?"#ffb062":p.hz_candidate?"#8ff0b8":"#8fc8f0";
    if(p.a_au){const pts=[],tt=[];const N=360;for(let k=0;k<=N;k++){const nu=k/N*TAU;const r=p.a_au*(1-e*e)/(1+e*Math.cos(nu));const rr=RM.f(r);const th=nu+w;pts.push(Math.cos(th)*rr,0,-Math.sin(th)*rr);tt.push(k/N);}
      const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));g.setAttribute("aT",new THREE.Float32BufferAttribute(tt,1));
      it.orbit=new THREE.Line(g,orbitMaterial(col,p.status==="disputed"?.5:.42,p.status==="disputed"?90:0));sysGroup.add(it.orbit);}
    const gfx=gfxOf(p);const set=bakeNow(gfx,p.id,MOB?192:256);it.set=set;
    const mat=planetMaterial(set,gfx,new THREE.Vector3(1,0,0),lc,p.seed);it.mat=mat;
    const mesh=new THREE.Mesh(SPHERE_LO,mat);const pr=RM.planetR(p);mesh.scale.setScalar(pr);it.r=pr;it.mesh=mesh;sysGroup.add(mesh);
    if(gfx.atmoK>0&&S.scale==="vis"){const at=atmoMesh(gfx,gfx.type==="gas"?1.05:1.08,new THREE.Vector3(1,0,0));at.scale.setScalar(pr);sysGroup.add(at);it.atmo=at;}
    if(p.status==="disputed")mat.uniforms.uAmb.value=.05;
    /* finder ring: always shown in true scale, where planets are far too small to see */
    const fr=new THREE.Sprite(new THREE.SpriteMaterial({map:RING_T,color:CL(col),transparent:true,depthWrite:false,depthTest:false,opacity:S.scale==="true"?.55:0,sizeAttenuation:false}));fr.scale.set(.026,.026,1);sysGroup.add(fr);it.finder=fr;
    if(!p.a_au){mesh.visible=false;fr.visible=false;}
    V.items.push(it);
    const el=document.createElement("button");el.className="plbl"+(p.status==="disputed"?" disp":"");el.innerHTML='<span class="tx">'+esc(shortName(p))+'</span>';el.dataset.id=p.id;labelsEl.appendChild(el);
    el.addEventListener("click",ev=>{ev.stopPropagation();if(S.planet===p.id)enterPlanet(p.id);else selectPlanet(p.id);});
    V.labels.push({el,it});});
  SV=V;placePlanets();
  return V;}
function clearSystem(){if(!SV)return;SV.labels.forEach(l=>l.el.remove());SV.items.forEach(it=>disposeSet(it.set));
  sysGroup.traverse(o=>{if(o.material&&o.material.dispose)o.material.dispose();if(o.geometry&&o.geometry!==SPHERE_LO&&o.geometry!==SPHERE)o.geometry.dispose();});
  while(sysGroup.children.length)sysGroup.remove(sysGroup.children[0]);SV=null;}
const _q=new THREE.Vector3(),_m4=new THREE.Matrix4();
function placePlanets(){if(!SV)return;
  SV.items.forEach(it=>{if(!it.a)return;const p=it.p;const P=p.period_d||365;const M=((S.days/P)*TAU+it.M0)%TAU;const E=kepler(M,it.e);
    const nu=2*Math.atan2(Math.sqrt(1+it.e)*Math.sin(E/2),Math.sqrt(1-it.e)*Math.cos(E/2));const r=it.a*(1-it.e*Math.cos(E));const rr=SV.RM.f(r);const th=nu+it.w;
    it.mesh.position.set(Math.cos(th)*rr,0,-Math.sin(th)*rr);it.th=th;
    if(it.atmo)it.atmo.position.copy(it.mesh.position);it.finder.position.copy(it.mesh.position);
    /* a locked planet turns once per orbit, keeping one face to the star; others spin slowly */
    it.mesh.rotation.y=p.locked?th+Math.PI:(S.days*.6+it.M0)%TAU;
    it.mesh.updateMatrixWorld();it.mat.uniforms.uRot.value.setFromMatrix4(_m4.extractRotation(it.mesh.matrixWorld));
    _q.copy(it.mesh.position).multiplyScalar(-1).normalize();it.mat.uniforms.uSun.value.copy(_q);if(it.atmo)it.atmo.material.uniforms.uSun.value.copy(_q);});}

/* ===================== PLANET VIEW ===================== */
const SUN_DIR=new THREE.Vector3(-.78,.24,.62).normalize();
skyStars(plS,MOB?2200:4200,1500,1.4,21);milkyWay(plS,1400,new THREE.Euler(1.0,.4,.3),MOB?7000:16000,77);
plS.add(new THREE.AmbientLight(0x202430,.4));
const pStarGlow=glowSprite(GLOW_W,140,.95);pStarGlow.position.copy(SUN_DIR).multiplyScalar(600);plS.add(pStarGlow);
const pStarHalo=glowSprite(GLOW_W,520,.16);pStarHalo.position.copy(pStarGlow.position);plS.add(pStarHalo);
const pStarDisc=glowSprite(DISC,10,1);pStarDisc.material.blending=THREE.NormalBlending;pStarDisc.position.copy(SUN_DIR).multiplyScalar(620);plS.add(pStarDisc);
const planetGroup=new THREE.Group();plS.add(planetGroup);
let PL=null;const setCache={};
function buildPlanet(p,onProgress){
  clearPlanet();
  const g=gfxOf(p);const key=p.id;const st=p.star;const lc=sunColFor(st);
  /* a measured colour is a colour as seen in white light, so do not tint it by the star */
  if(g.measuredColour)lc.lerp(new THREE.Color(1.1,1.1,1.1),.75);
  const P={p,g,key,root:new THREE.Group(),jobs:[]};planetGroup.add(P.root);
  let set=setCache[key];if(!set){set=setCache[key]={pre:bakeNow(g,key,512),hd:null};}
  const use=set.hd||set.pre;
  P.mat=planetMaterial(use,g,SUN_DIR,lc,p.seed);P.mesh=new THREE.Mesh(SPHERE,P.mat);P.root.add(P.mesh);
  if(g.clouds){P.cmat=cloudMaterial(use,g,SUN_DIR,lc);P.clouds=new THREE.Mesh(SPHERE,P.cmat);P.clouds.scale.setScalar(1.012);P.root.add(P.clouds);}
  if(g.atmoK>0){P.atmo=atmoMesh(g,g.type==="gas"?1.05:1.075,SUN_DIR);P.root.add(P.atmo);}
  /* the host star in the sky, drawn at its true angular size as seen from this planet */
  const sc=starColor(st.teff||5000);[pStarGlow,pStarHalo,pStarDisc].forEach(s=>s.material.color.copy(sc));
  const ang=p.a_au&&st.radius_sun?2*st.radius_sun*AU_RSUN/p.a_au:.0093;P.ang=ang;
  const disc=clamp(620*ang,1.2,260);pStarDisc.scale.set(disc,disc,1);pStarGlow.scale.setScalar(clamp(disc*7,60,900));pStarHalo.scale.setScalar(clamp(disc*22,260,2400));
  if(!set.hd){const job=queueBake(g,key,HD,s2=>{set.hd=s2;disposeSet(set.pre);set.pre=null;if(PL===P)applySet(P,s2);},onProgress);P.jobs.push(job);}
  else if(onProgress)onProgress(1);
  Object.keys(setCache).forEach(k=>{if(k!==key){const s2=setCache[k];disposeSet(s2.hd);disposeSet(s2.pre);delete setCache[k];}});
  PL=P;return P;}
function applySet(P,s){P.mat.uniforms.tAlb.value=s.alb.texture;P.mat.uniforms.tNrm.value=s.nrm.texture;P.mat.uniforms.tCld.value=s.cld.texture;if(P.cmat)P.cmat.uniforms.tCld.value=s.cld.texture;}
function clearPlanet(){if(!PL)return;bakeJobs.forEach(j=>{if(PL.jobs.includes(j))j.cancelled=true;});
  planetGroup.remove(PL.root);PL.root.traverse(o=>{if(o.material&&o.material.dispose)o.material.dispose();if(o.geometry&&o.geometry!==SPHERE&&o.geometry!==SPHERE_LO)o.geometry.dispose();});PL=null;}
function updatePlanet(dt,t){if(!PL)return;
  if(!PL.p.locked&&!S.interacted)PL.root.rotation.y+=dt*.03;else if(!PL.p.locked)PL.root.rotation.y+=dt*.006;
  PL.root.updateMatrixWorld();const rot=new THREE.Matrix3().setFromMatrix4(_m4.extractRotation(PL.mesh.matrixWorld));
  PL.mat.uniforms.uRot.value.copy(rot);PL.mat.uniforms.uTime.value=t;
  PL.mat.uniforms.uDetail.value=clamp((2.3-orbP.dist)/1.1,0,1);
  PL.mat.uniforms.uCloudShift.value+=dt*.0035;if(PL.cmat){PL.cmat.uniforms.uCloudShift.value=PL.mat.uniforms.uCloudShift.value;PL.cmat.uniforms.uRot.value.copy(rot);}}

/* ===================== LABELS ===================== */
const labelsEl=$("#labels");const LBL={};
SYS.forEach(s=>{const b=document.createElement("button");b.className="lbl"+(MAJOR.has(s.id)?" major":"");b.textContent=s.name;b.dataset.id=s.id;labelsEl.appendChild(b);LBL[s.id]=b;
  b.addEventListener("click",ev=>{ev.stopPropagation();if(S.sel===s.id)enterSystem(s.id);else selectSystem(s.id,true);});
  b.addEventListener("mouseenter",ev=>{S.hover=s.id;showTip(s,ev.clientX,ev.clientY);});b.addEventListener("mousemove",ev=>placeTip(ev.clientX,ev.clientY));
  b.addEventListener("mouseleave",()=>{S.hover=null;hideTip();});});
const XL=[];function xlabel(text,cls,pos){const el=document.createElement("div");el.className="lbl "+cls;el.textContent=text;labelsEl.appendChild(el);XL.push({el,pos});}
xlabel("Sun","sun",new THREE.Vector3(0,0,0));
D.landmarks.forEach(l=>xlabel(l.name,"land",new THREE.Vector3(l.xyz[0],l.xyz[1],l.xyz[2])));
[10,25,50,100].forEach(r=>xlabel(r+" ly","ring",new THREE.Vector3(Math.cos(-.62)*r,0,Math.sin(-.62)*r)));
xlabel("Toward the galactic centre","dir",new THREE.Vector3(114,0,0));
xlabel("Galactic anticentre","dir",new THREE.Vector3(-114,0,0));
const _v=new THREE.Vector3();
function setL(el,show,tf){const o=show?"1":"0";if(el._o!==o){el.style.opacity=o;el.style.pointerEvents=show&&!el.classList.contains("land")&&!el.classList.contains("sun")&&!el.classList.contains("ring")&&!el.classList.contains("dir")?"auto":"none";el._o=o;}
  if(show&&tf!==el._t){el.style.transform=tf;el._t=tf;}}
function project(p,cam,W,H){_v.copy(p).project(cam);return {x:(_v.x*.5+.5)*W,y:(-_v.y*.5+.5)*H,z:_v.z};}
function layoutMapLabels(W,H){const cp=camM.position;const placed=[];const d=orbM.dist;
  const order=SYS.slice().sort((a,b)=>(b.id===S.sel)-(a.id===S.sel)||(b.id===S.hover)-(a.id===S.hover)||(MAJOR.has(b.id)?1:0)-(MAJOR.has(a.id)?1:0)||cp.distanceTo(a.pos)-cp.distanceTo(b.pos));
  let n=0;const cap=MOB?14:28;
  order.forEach(s=>{const el=LBL[s.id];const pr=project(s.pos,camM,W,H);const cd=cp.distanceTo(s.pos);
    let show=pr.z<1&&pr.x>-40&&pr.x<W+40&&pr.y>-20&&pr.y<H+20&&sysShown(s);
    const far=MAJOR.has(s.id)?d*2.6:d*.62;if(cd>far&&s.id!==S.sel&&s.id!==S.hover)show=false;
    if(show&&s.id!==S.sel&&s.id!==S.hover&&n>=cap)show=false;
    if(show){const r={x:pr.x+8,y:pr.y-10,w:s.name.length*7.6+12,h:19};
      if(s.id!==S.sel&&placed.some(o=>r.x<o.x+o.w&&r.x+r.w>o.x&&r.y<o.y+o.h&&r.y+r.h>o.y))show=false;else{placed.push(r);n++;}}
    setL(el,show,"translate("+Math.round(pr.x+6)+"px,"+Math.round(pr.y-11)+"px)");const sl=s.id===S.sel;if(el._s!==sl){el.classList.toggle("sel",sl);el._s=sl;}});
  XL.forEach(x=>{const pr=project(x.pos,camM,W,H);let show=pr.z<1;const cd=cp.distanceTo(x.pos);
    if(x.el.classList.contains("land")&&cd>d*1.4)show=false;
    if(show){const r={x:pr.x+6,y:pr.y-9,w:x.el.textContent.length*7,h:16};if(!x.el.classList.contains("sun")&&placed.some(o=>r.x<o.x+o.w&&r.x+r.w>o.x&&r.y<o.y+o.h&&r.y+r.h>o.y))show=false;else placed.push(r);}
    setL(x.el,show,x.el.classList.contains("dir")||x.el.classList.contains("ring")?"translate(-50%,-50%) translate("+Math.round(pr.x)+"px,"+Math.round(pr.y)+"px)":"translate("+Math.round(pr.x+6)+"px,"+Math.round(pr.y-9)+"px)");});}
function hideMapLabels(){Object.values(LBL).forEach(l=>setL(l,false));XL.forEach(x=>setL(x.el,false));}
function layoutSysLabels(W,H){if(!SV)return;const placed=[];
  SV.labels.slice().sort((a,b)=>(b.it.p.id===S.planet)-(a.it.p.id===S.planet)).forEach(o=>{const it=o.it;if(!it.a){o.el.style.opacity=0;o.el.style.pointerEvents="none";return;}
    const pr=project(it.mesh.position,camS,W,H);let show=pr.z<1;const off=S.scale==="true"?10:clamp(it.r/Math.max(.001,camS.position.distanceTo(it.mesh.position))*H*.9,6,40);
    const r={x:pr.x+off,y:pr.y-10,w:o.el.textContent.length*8+18,h:20};
    if(show&&it.p.id!==S.planet&&placed.some(q=>r.x<q.x+q.w&&r.x+r.w>q.x&&r.y<q.y+q.h&&r.y+r.h>q.y))show=false;if(show)placed.push(r);
    o.el.style.opacity=show?1:0;o.el.style.pointerEvents=show?"auto":"none";if(show)o.el.style.transform="translate("+(pr.x+off-4)+"px,"+(pr.y-12)+"px)";
    o.el.classList.toggle("sel",it.p.id===S.planet);});}

/* ===================== TOOLTIP ===================== */
const tip=$("#tip");
function placeTip(x,y){const r=tip.getBoundingClientRect();let tx=x+18,ty=y+16;if(tx+r.width>innerWidth-12)tx=x-r.width-18;if(ty+r.height>innerHeight-12)ty=innerHeight-r.height-12;tip.style.left=tx+"px";tip.style.top=ty+"px";}
function showTip(s,x,y){if(MOB)return;const np=s.planets.filter(p=>p.status==="confirmed").length,nd=s.planets.length-np;
  tip.innerHTML='<p class="eyebrow">'+ly(s)+' · '+esc(s.primary.spec||"")+'</p><h3>'+esc(s.name)+'</h3><p>'+np+' confirmed planet'+(np===1?"":"s")+(nd?' · '+nd+' disputed':'')+(s.planets.some(p=>p.hz_candidate)?' · habitable-zone candidate':'')+'</p><div class="meta">'+(S.sel===s.id?"Click to enter the system":"Click to select · double-click to enter")+'</div>';
  tip.hidden=false;placeTip(x,y);}
function hideTip(){tip.hidden=true;}

/* ===================== INDEX ===================== */
const idx=$("#index"),idxList=$("#idxList"),idxSearch=$("#idxSearch");let query="";
function renderIndex(){const q=query.trim().toLowerCase();let h="";let shownSys=0,shownPl=0;
  const bands=[[0,10,"Within 10 light-years"],[10,25,"10 to 25 light-years"],[25,50,"25 to 50 light-years"],[50,200,"50 to 100 light-years"]];
  bands.forEach(([a,b,t])=>{const list=SYS.filter(s=>s.dist_ly>=a&&s.dist_ly<b&&(!q||s.search.includes(q)));if(!list.length)return;
    h+='<div class="grp">'+t+'</div>';
    list.forEach(s=>{const on=sysShown(s);if(on){shownSys++;shownPl+=s.planets.filter(planetShown).length;}
      const np=s.planets.length;h+='<button class="sysrow'+(on?"":" dim")+(S.sel===s.id?" sel":"")+'" data-id="'+s.id+'"><span class="sw" style="background:'+s.col+';color:'+s.col+'"></span><span class="nm">'+esc(s.name)+'</span><span class="n">'+np+' · '+num(s.dist_ly)+' ly</span></button>';});});
  if(!h)h='<p class="srcnote">No star or planet matches “'+esc(query)+'”.</p>';
  idxList.innerHTML=h;$("#idxTitle").textContent=filtersActive()?shownSys+" systems match":SYS.length+" planetary systems";}
idxList.addEventListener("click",e=>{const b=e.target.closest(".sysrow");if(!b)return;if(MOB)toggleIndex(false);
  if(S.view!=="map")enterSystem(b.dataset.id);else selectSystem(b.dataset.id,true);});
idxSearch.addEventListener("input",()=>{query=idxSearch.value;renderIndex();});
function toggleIndex(o){idx.classList.toggle("open",o);$("#idxBtn").setAttribute("aria-expanded",o);if(o)toggleFilters(false);}
$("#idxBtn").addEventListener("click",()=>toggleIndex(!idx.classList.contains("open")));

/* ===================== FILTERS ===================== */
const fil=$("#filters");
function renderFilters(){const cnt=SYS.filter(sysShown).length;const pc=SYS.reduce((n,s)=>n+s.planets.filter(planetShown).length,0);
  fil.innerHTML='<h2 class="eyebrow">Filters</h2>'+
    '<div class="fgrp">Planet type</div><div class="chipset">'+CLASSES.map(c=>'<button class="fchip" data-t="'+c[0]+'" aria-pressed="'+F.types.has(c[0])+'"><i style="background:'+c[2]+'"></i>'+c[1]+'</button>').join("")+'</div>'+
    '<div class="fgrp">Habitable zone</div><div class="chipset"><button class="fchip" data-hz="1" aria-pressed="'+F.hz+'"><i style="background:var(--hz)"></i>Only habitable-zone candidates</button></div>'+
    '<div class="fgrp">Discovered by</div><div class="chipset">'+METHODS.map(m=>'<button class="fchip" data-m="'+m[0]+'" aria-pressed="'+F.methods.has(m[0])+'">'+m[1]+'</button>').join("")+'</div>'+
    '<div class="fgrp">Status</div><div class="chipset"><button class="fchip" data-d="1" aria-pressed="'+F.disputed+'"><i style="background:var(--disp)"></i>Include disputed planets</button></div>'+
    '<p class="fcount"><b>'+cnt+'</b> systems · <b>'+pc+'</b> planets shown</p>'+
    '<div class="actions"><button class="btn" data-reset="1">Reset</button><button class="btn" data-close="1">Done</button></div>'+
    '<p class="srcnote">Habitable-zone candidates: orbit inside the optimistic habitable zone (Kopparapu et al. 2014) and smaller than 2 Earth radii, or under 10 Earth masses when no radius is known. A derived estimate, not a measurement.</p>';}
fil.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  if(b.dataset.t){const k=b.dataset.t;if(F.types.has(k))F.types.delete(k);else F.types.add(k);if(k==="super-earth"){if(F.types.has(k))F.types.add("unknown");else F.types.delete("unknown");}}
  else if(b.dataset.m){const k=b.dataset.m;if(F.methods.has(k))F.methods.delete(k);else F.methods.add(k);}
  else if(b.dataset.hz)F.hz=!F.hz;else if(b.dataset.d)F.disputed=!F.disputed;
  else if(b.dataset.reset){F.types=new Set(CLASSES.map(c=>c[0]).concat(["unknown"]));F.methods=new Set(METHODS.map(m=>m[0]));F.hz=false;F.disputed=true;}
  else if(b.dataset.close){toggleFilters(false);return;}
  renderFilters();applyFilterToMap();renderIndex();$("#filBtn").innerHTML="Filters"+(filtersActive()?'<span class="dot"></span>':"");if(S.view==="map"&&!S.sel)renderDossier();});
function toggleFilters(o){fil.hidden=!o;$("#filBtn").setAttribute("aria-expanded",o);if(o){renderFilters();if(MOB)toggleIndex(false);}dos.style.visibility=o?"hidden":"";}
$("#filBtn").addEventListener("click",()=>toggleFilters(fil.hidden));

/* ===================== DOSSIER ===================== */
const dos=$("#dossier");let dosCollapsed=MOB;
function grab(title,sub,go,act){return '<div class="grab" id="grab" role="button" tabindex="0" aria-label="Show or hide details">'+(go?'<button class="btn primary go" data-act="'+act+'">'+go+'</button>':'')+'<span>'+esc(title)+'</span><em>'+esc(sub||"")+'</em></div>';}
function fact(k,label,html,v){return '<dt>'+label+'</dt><dd data-k="'+k+'"'+(v!=null?' data-v="'+v+'"':'')+'>'+html+'</dd>';}
function ballStyle(p){const c=CLASS_COL[p.class]||"#9aa";return "background:radial-gradient(circle at 35% 35%,"+c+",#111 85%)";}
function prow(p){const meta=[p.class_label,p.period_d!=null?(p.period_d<1?num(p.period_d*24)+" h":p.period_d>730?num(p.period_d/365.25)+" yr":num(p.period_d)+" d"):null,p.teq_k!=null?num(p.teq_k,0)+" K":null].filter(Boolean).join(" · ");
  return '<button class="prow'+(p.status==="disputed"?" disp":"")+(S.planet===p.id?" sel":"")+'" data-planet="'+p.id+'"'+(planetShown(p)?"":' style="opacity:.5"')+'><span class="ball" style="'+ballStyle(p)+'"></span><span><span class="pn">'+esc(p.name)+'</span><br><span class="pm">'+esc(meta)+'</span></span><span class="pb">'+(p.hz_candidate?'<span class="hz">HZ</span>':'')+(p.status==="disputed"?'<span class="ds">Disputed</span>':'')+'</span></button>';}
function starFacts(st,s){const e=k=>st.est&&st.est.includes(k)?' <small>(estimated)</small>':'';
  return '<dl class="facts">'+fact("spec","Type",esc(st.spec||"—"))+fact("teff","Temperature",st.teff!=null?num(st.teff,0)+" K"+e("teff"):"—",st.teff)+
    fact("smass","Mass",st.mass_sun!=null?num(st.mass_sun)+" × Sun"+e("mass"):"—",st.mass_sun)+fact("srad","Radius",st.radius_sun!=null?num(st.radius_sun)+" × Sun"+e("radius"):"—",st.radius_sun)+
    fact("lum","Luminosity",st.lum_sun!=null?num(st.lum_sun)+" × Sun"+(st.lum_src==="derived"?' <small>(derived)</small>':''):"—",st.lum_sun)+
    (st.hz?fact("hz","Habitable zone",num(st.hz.runaway)+"–"+num(st.hz.maxGreenhouse)+" AU <small>(derived)</small>"):"")+'</dl>';}
function srcList(keys){const C=D.SOURCES.cross_check;const u=[...new Set(keys)];
  return '<ul class="srcl">'+u.map(k=>'<li>'+(k==="OEC"?"Open Exoplanet Catalogue, commit "+esc(D.SOURCES.base_catalogue.commit.slice(0,10))+" ("+esc(D.SOURCES.base_catalogue.commit_date.slice(0,10))+")":esc(C[k]||k))+'</li>').join("")+'</ul>';}
function renderDossier(){let h="";
  if(S.view==="planet"&&S.planet){h=planetDossier(PL_BY[S.planet],true);}
  else if(!S.sel){const c=D.counts;
    h=grab("Nearby Worlds","About")+'<p class="eyebrow">The Sun’s neighbourhood · 100 light-years</p><h2>Nearby Worlds</h2>'+
      '<p class="blurb">Every star here is known to have at least one planet: <b>'+c.confirmed_planets+'</b> confirmed planets around <b>'+c.systems_with_confirmed+'</b> stars, all within about '+num(c.max_distance_ly,0)+' light-years. Each sits at its real position around the Sun, which is at the centre.</p>'+
      '<div class="rule"><span class="eyebrow">Reading the map</span></div>'+
      '<div class="tgrad"></div><div class="tscale"><span>2,500 K</span><span>Star colour = surface temperature</span><span>9,000 K</span></div>'+
      '<dl class="lgd"><i style="background:#3c6a90"></i><span>Rings at 10, 25, 50 and 100 light-years, in the plane of the Milky Way</span><i style="background:#5e86a8;opacity:.6"></i><span>Each star’s line drops to that plane, showing how far above or below it lies</span><i style="background:var(--warm)"></i><span>Named bright stars without known planets, for orientation</span></dl>'+
      '<div class="actions"><button class="btn primary" data-act="tour">Take the tour</button><button class="btn" data-act="go" data-id="proxima-centauri">Nearest planet</button><button class="btn" data-act="filters">Filters</button></div>'+
      '<p class="srcnote">Data: Open Exoplanet Catalogue (commit '+esc(D.SOURCES.base_catalogue.commit.slice(0,10))+', '+esc(D.SOURCES.base_catalogue.commit_date.slice(0,10))+'), cross-checked on 23–24 October 2026 against the NASA Exoplanet Archive (system overview pages, NASA’s exoplanet catalogue and Archive news), recent papers and announcements. Distances are Gaia-based NASA Exoplanet Archive values. Masses marked ≥ are minimum masses (M sin i) from radial velocities; radii marked ≈ are estimated from mass, because only transits and direct images measure a planet’s size. Objects of 13 Jupiter masses or more are listed as brown dwarfs. '+c.disputed_planets+' disputed planets are drawn with dashed orbits; '+c.retracted_or_excluded+' retracted or out-of-scope entries are left out. Planet surfaces are artist’s interpretations generated from each planet’s size and temperature.</p>';}
  else{const s=SYS_BY[S.sel];const inSys=S.view==="system";
    if(inSys&&S.planet){h=planetDossier(PL_BY[S.planet],false);}
    else{const st=inSys?s.stars.find(x=>x.name===S.host)||s.primary:s.primary;const nc=s.planets.filter(p=>p.status==="confirmed").length,nd=s.planets.length-nc,nh=s.planets.filter(p=>p.hz_candidate).length;
      h=grab(s.name,inSys?"System":ly(s),inSys?null:"Enter","enter")+'<p class="eyebrow">'+ly(s)+' from the Sun · '+num(s.dist_pc)+' pc</p><h2>'+esc(s.name)+'</h2>'+
        (s.oec_name!==s.name?'<p class="aka">Catalogue name: '+esc(s.oec_name)+'</p>':'')+
        '<div class="chips"><span class="chip">'+nc+' confirmed planet'+(nc===1?"":"s")+'</span>'+(nd?'<span class="chip disp">'+nd+' disputed</span>':'')+(nh?'<span class="chip hz">'+nh+' habitable-zone candidate'+(nh===1?"":"s")+'</span>':'')+'</div>';
      s.hosts.forEach(hs=>{h+='<div class="rule"><span class="eyebrow">'+esc(hs.name)+'</span></div>'+starFacts(hs,s);
        h+='<div class="plist">'+s.planets.filter(p=>p.host===hs.name).map(prow).join("")+'</div>';
        if(inSys&&s.hosts.length>1&&hs.name!==S.host)h+='<div class="actions"><button class="btn" data-act="host" data-host="'+esc(hs.name)+'">View '+esc(hs.name)+'’s planets</button></div>';});
      const others=s.stars.filter(x=>!s.hosts.includes(x));if(others.length)h+='<p class="srcnote">Also in this system: '+others.map(x=>esc(x.name)+(x.spec?" ("+esc(x.spec)+")":"")).join(", ")+'.</p>';
      if(s.notes.length)h+='<div class="notes">'+s.notes.map(n=>'<p>'+esc(n)+'</p>').join("")+'</div>';
      h+='<dl class="facts" style="margin-top:14px">'+fact("dist","Distance",num(s.dist_ly)+" ly <small>("+num(s.dist_pc)+" pc)</small>",s.dist_ly)+fact("radec","RA / Dec",num(s.ra_deg)+"° / "+num(s.dec_deg)+"°")+fact("galb","Galactic l / b",num(s.gal_l)+"° / "+num(s.gal_b)+"°")+'</dl>';
      h+='<div class="actions">'+(inSys?'<button class="btn" data-act="map">Back to the map</button>':'<button class="btn primary" data-act="enter">Enter the system</button><button class="btn" data-act="home">Whole map</button>')+'</div>';}}
  dos.innerHTML=h;dos.classList.toggle("collapsed",MOB&&dosCollapsed);dos.scrollTop=0;sheetH();
  const gb=$("#grab");if(gb){const tg=()=>{dosCollapsed=!dosCollapsed;dos.classList.toggle("collapsed",dosCollapsed);sheetH();};
    gb.addEventListener("click",e=>{if(e.target.closest("[data-act]"))return;tg();});gb.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();tg();}});}}
function planetDossier(p,close){const s=p.sys,st=p.star;const g=gfxOf(p);
  const meas=[],der=[];
  /* measured: values published in the catalogue or the literature */
  const mk=massKind(p);
  if(mk==="min"||mk==="true"||mk==="upper")meas.push(fact("mass",mk==="min"?"Minimum mass":mk==="upper"?"Mass (upper limit)":"Mass",massText(p)+(mk==="min"?' <small>(M sin i)</small>':''),p.mass_earth));
  if(p.radius_src==="measured")meas.push(fact("radius","Radius",radiusText(p),p.radius_earth));
  if(p.period_src==="catalogue")meas.push(fact("period","Orbital period",periodText(p.period_d),p.period_d));
  if(p.a_src==="catalogue")meas.push(fact("a","Orbit size",auText(p.a_au)+(p.kepler_flag!=null?" <small>(semi-major axis; does not fit the period, see notes)</small>":" <small>(semi-major axis)</small>"),p.a_au));
  if(p.ecc_src==="catalogue")meas.push(fact("ecc","Eccentricity",num(p.ecc,p.ecc<.1?3:2),p.ecc));
  if(p.teq_src==="catalogue")meas.push(fact("teq","Temperature",tempText(p.teq_k)+' <small>(published equilibrium value)</small>',p.teq_k));
  meas.push(fact("method","Discovered by",esc(METHOD_LABEL[p.method]||p.method||"—")+(p.year?", "+p.year:""),p.year));
  /* derived and estimated */
  if(mk==="estimate"&&p.mass_src==="model")der.push(fact("mass","Mass",massText(p)+' <small>(model estimate from brightness and age)</small>',p.mass_earth));
  if(mk==="estimate"&&p.mass_src!=="model")der.push(fact("mass","Mass",massText(p)+' <small>(estimated from radius)</small>',p.mass_earth));
  if(p.radius_src==="estimated")der.push(fact("radius","Radius",radiusText(p)+' <small>(estimated from '+(mk==="min"?"minimum ":"")+'mass)</small>',p.radius_earth));
  if(p.period_src==="derived")der.push(fact("period","Orbital period",periodText(p.period_d)+' <small>(from Kepler’s law)</small>',p.period_d));
  if(p.a_src==="derived")der.push(fact("a","Orbit size",auText(p.a_au)+' <small>(from period and star mass)</small>',p.a_au));
  if(p.a_src==="projected separation")der.push(fact("a","Separation",auText(p.a_au)+' <small>(projected; true orbit unknown)</small>',p.a_au));
  if(p.ecc_src!=="catalogue")der.push(fact("ecc","Eccentricity",'not measured <small>(drawn circular)</small>'));
  if(p.teq_src==="derived")der.push(fact("teq","Temperature",tempText(p.teq_k)+' <small>(equilibrium, albedo 0.3)</small>',p.teq_k));
  if(p.insolation!=null)der.push(fact("insol","Starlight",num(p.insolation)+" × what Earth gets",p.insolation));
  der.push(fact("class","Type",esc(p.class_label)+' <small>(from '+esc(p.class_basis)+')</small>'));
  der.push(fact("hzpos","Habitable zone",p.hz==="conservative"?"Inside (conservative zone)":p.hz==="optimistic"?"Inside (optimistic zone only)":st.hz&&p.a_au?(p.a_au<st.hz.recentVenus?"Inside it — too hot":"Beyond it — too cold"):"—"));
  der.push(fact("lock","Tidal locking",p.locked?"Likely <small>(one face always to the star)</small>":"Not expected"));
  if(p.a_au&&st.radius_sun){const k=2*st.radius_sun*AU_RSUN/p.a_au/0.0093;der.push(fact("sky","Star in the sky",(k>=1?num(k)+" × as wide":"1/"+num(1/k)+" as wide")+" as the Sun from Earth",k));}
  const interp=p.method==="imaging"?"This planet has been photographed only as a point of light. The surface is an illustration based on its estimated temperature and mass.":
    g.measuredColour?"The overall colour was measured; everything else about the look is illustrative.":"No image of this planet exists. Its look is generated from its measured size class and temperature"+(p.locked?", with the day side held toward the star":"")+".";
  const status=p.status==="disputed"?'<span class="chip disp">Disputed</span>':'';
  return grab(p.name,shortName(p)===p.name?ly(s):p.class_label,close?null:"Close-up",close?null:"planet")+
    '<p class="eyebrow">'+esc(p.host)+' · '+ly(s)+'</p><h2>'+esc(p.name)+'</h2>'+(p.aliases&&p.aliases.length?'<p class="aka">'+esc(p.aliases.slice(0,3).join(" · "))+'</p>':'')+
    '<div class="chips"><span class="chip cls">'+esc(p.class_label)+'</span>'+status+(p.hz_candidate?'<span class="chip hz">Habitable-zone candidate</span>':'')+(p.locked?'<span class="chip">Likely tidally locked</span>':'')+(g.measuredColour?'<span class="chip meas">Colour measured</span>':'')+'</div>'+
    '<p class="blurb">'+esc(summary(p))+'</p>'+
    '<div class="sect meas"><h3>Measured</h3><p class="sub">Published values from the catalogue and literature.</p><dl class="facts meas">'+meas.join("")+'</dl></div>'+
    '<div class="sect der"><h3>Derived or estimated</h3><p class="sub">Calculated here from the measured values, with stated assumptions.</p><dl class="facts der">'+der.join("")+'</dl></div>'+
    '<div class="interp"><b>Artist’s interpretation</b>'+esc(interp)+(g.interp.length?" "+esc(g.interp.join(" ")):"")+'</div>'+
    (p.notes.length?'<div class="rule"><span class="eyebrow">Notes</span></div><div class="notes">'+p.notes.map(n=>'<p>'+esc(n)+'</p>').join("")+'</div>':'')+
    '<div class="rule"><span class="eyebrow">Sources</span></div>'+srcList(p.src)+
    '<div class="actions">'+(close?'<button class="btn primary" data-act="system">Back to the system</button>':'<button class="btn primary" data-act="planet">Close-up</button><button class="btn" data-act="unsel">All planets</button>')+'<button class="btn" data-act="map">Map</button></div>';}
function summary(p){const st=p.star;const parts=[];
  const art=/^[aeiou]/i.test(p.class_label)?"An":"A";
  parts.push(art+" "+p.class_label.toLowerCase().replace("earth","Earth").replace("neptune","Neptune")+(p.status==="disputed"?" candidate":"")+" orbiting "+p.host+(p.period_d!=null?" every "+(p.period_d<1?num(p.period_d*24)+" hours":p.period_d>730?num(p.period_d/365.25)+" years":num(p.period_d)+" days"):"")+".");
  if(p.insolation!=null)parts.push(p.insolation>1.5?"It receives about "+num(p.insolation)+" times the starlight Earth gets.":p.insolation<.67?"It receives about "+num(p.insolation)+" times the starlight Earth gets.":"It receives roughly as much starlight as Earth.");
  if(p.status==="disputed")parts.push("Its existence has not been settled.");
  return parts.join(" ");}
dos.addEventListener("click",e=>{const a=e.target.closest("[data-act]");if(a){const k=a.dataset.act;
    if(k==="enter")enterSystem(S.sel);else if(k==="map")goMap();else if(k==="home"){selectSystem(null);flyHome();}else if(k==="tour")startTour();else if(k==="filters")toggleFilters(true);
    else if(k==="go")selectSystem(a.dataset.id,true);else if(k==="planet")enterPlanet(S.planet);else if(k==="system")exitPlanet();else if(k==="unsel")selectPlanet(null);
    else if(k==="host"){S.planet=null;buildSystem(SYS_BY[S.sel],a.dataset.host);frameSystem();renderDossier();}return;}
  const pr=e.target.closest("[data-planet]");if(pr){const id=pr.dataset.planet;if(S.view==="map"){enterSystem(S.sel,id);}else if(S.view==="system"){if(PL_BY[id].host!==S.host){buildSystem(SYS_BY[S.sel],PL_BY[id].host);frameSystem();}selectPlanet(id);}}});

/* ===================== CRUMBS, HINT, HUD ===================== */
function renderCrumbs(){let h='<button data-c="map"'+(!S.sel?' class="here"':'')+'>Sun’s neighbourhood</button>';
  const s=S.sel&&SYS_BY[S.sel];if(s)h+='<i>›</i><button data-c="sys" class="'+(S.view!=="planet"&&!S.planet?"here":"")+'">'+esc(s.name)+'</button>';
  if(S.planet&&S.view!=="map")h+='<i>›</i><button data-c="pl" class="here">'+esc(shortName(PL_BY[S.planet]))+'</button>';$("#crumbs").innerHTML=h;}
$("#crumbs").addEventListener("click",e=>{const b=e.target.closest("[data-c]");if(!b)return;const k=b.dataset.c;
  if(k==="map")goMap();else if(k==="sys"){if(S.view==="planet")exitPlanet(true);else if(S.view==="system")selectPlanet(null);else enterSystem(S.sel);}else if(k==="pl"&&S.view==="system")enterPlanet(S.planet);});
let hintT=0;function hint(t){const h=$("#navhint");h.textContent=t;h.style.opacity=1;clearTimeout(hintT);hintT=setTimeout(()=>h.style.opacity=0,5200);}
function speedLabel(v){return v===0?"paused":v<1?"1 s = "+(v*24).toFixed(1)+" hours":v>=365?"1 s = "+(v/365.25).toFixed(1)+" years":"1 s = "+v+" day"+(v===1?"":"s");}
function renderHud(){$("#hud").hidden=S.view!=="system";$("#sysctl").hidden=S.view!=="system";
  $("#scaleSeg").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.s===S.scale));
  $("#speedSeg").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.v===S.speed));
  $("#hzBtn").setAttribute("aria-pressed",S.showHZ);}
$("#scaleSeg").addEventListener("click",e=>{const b=e.target.closest("[data-s]");if(!b||S.view!=="system")return;S.scale=b.dataset.s;buildSystem(SYS_BY[S.sel],S.host);frameSystem(true);renderHud();
  hint(S.scale==="true"?"True scale: distances, star and planets all to the same scale. Rings mark planets too small to see.":"Visible scale: orbits spaced out and planets enlarged so you can see them");});
$("#speedSeg").addEventListener("click",e=>{const b=e.target.closest("[data-v]");if(!b)return;S.speed=+b.dataset.v;renderHud();});
$("#hzBtn").addEventListener("click",()=>{S.showHZ=!S.showHZ;if(SV&&SV.hz)SV.hz.visible=S.showHZ;renderHud();});
$("#mapBtn").addEventListener("click",()=>{if(S.view==="map"){selectSystem(null);flyHome();}else goMap();});
$("#brand").addEventListener("click",()=>{if(S.view==="map"){selectSystem(null);flyHome();}else goMap();});

/* ===================== ACTIONS ===================== */
function refreshAll(){renderIndex();renderDossier();renderCrumbs();renderHud();}
function selectSystem(id,fly){S.sel=id;S.planet=null;if(MOB)dosCollapsed=true;refreshAll();
  if(id&&fly&&S.view==="map"){const s=SYS_BY[id];orbM.flyTo(s.pos,clamp(s.dist_ly*.45+14,18,60),orbM.gyaw,.42,1700);}}
function flyHome(){orbM.flyTo(HOME.t,HOME.d,orbM.gyaw,HOME.pitch,2000);}
const fade=$("#fade");
function transition(fn){fade.classList.add("on");setTimeout(()=>{fn();requestAnimationFrame(()=>fade.classList.remove("on"));},430);}
function defaultSpeed(planets){const Ps=planets.map(p=>p.period_d).filter(Boolean);if(!Ps.length)return 1;const pmin=Math.min(...Ps);
  const opts=[.1,1,10,100,1000];let best=.1;opts.forEach(o=>{if(o<=pmin/5)best=o;});return best;}
function fitDist(cam,r){const hf=2*Math.atan(Math.tan(cam.fov*DEG/2)*cam.aspect);return r/Math.sin(Math.min(hf,cam.fov*DEG)/2);}
function frameSystem(keep){if(!SV)return;const R=40;const d=Math.max(R*(MOB?2.3:2.9),fitDist(camS,R*1.08)*.62);
  if(keep){orbS.gdist=clamp(orbS.gdist,8,d*1.6);return;}
  orbS.t.set(0,0,0);orbS.gt.set(0,0,0);orbS.dist=d*2.4;orbS.gdist=d;orbS.yaw=orbS.gyaw=.5;orbS.pitch=orbS.gpitch=.62;}
function enterSystem(id,planetId,cb){const s=SYS_BY[id];if(!s)return;
  const go=()=>transition(()=>{S.view="system";S.sel=id;S.planet=null;clearPlanet();$("#bake").hidden=true;hideTip();hideMapLabels();
    const host=planetId?PL_BY[planetId].host:s.primary.name;buildSystem(s,host);S.speed=defaultSpeed(SV.planets);S.days=0;frameSystem();S.interacted=false;
    if(planetId)S.planet=planetId;if(MOB)dosCollapsed=true;refreshAll();
    hint(MOB?"Drag to turn · pinch to zoom · tap a planet":"Drag to turn · scroll to zoom · click a planet · Esc returns to the map");if(cb)cb();});
  if(S.view==="map"&&S.sel!==id){S.sel=id;refreshAll();orbM.flyTo(s.pos,8,orbM.gyaw,.4,1300);setTimeout(go,900);}
  else if(S.view==="map"){orbM.flyTo(s.pos,6,orbM.gyaw,.4,900);setTimeout(go,500);}
  else go();}
function selectPlanet(id){S.planet=id;if(id&&MOB)dosCollapsed=false;renderDossier();renderCrumbs();}
function enterPlanet(id,cb){const p=PL_BY[id];if(!p)return;
  transition(()=>{S.view="planet";S.planet=id;S.sel=p.sys.id;hideTip();hideMapLabels();
    if(SV)SV.labels.forEach(l=>{l.el.style.opacity=0;l.el.style.pointerEvents="none";});
    const bk=$("#bake");bk.hidden=false;const bi=bk.querySelector("i");bi.style.width="0%";
    buildPlanet(p,v=>{bi.style.width=(v*100).toFixed(0)+"%";if(v>=1)setTimeout(()=>bk.hidden=true,400);});
    const g=gfxOf(p);orbP.t.set(0,0,0);orbP.gt.set(0,0,0);orbP.dist=orbP.gdist=Math.max(g.type==="gas"?4.6:4.1,fitDist(camP,1.25));
    /* open looking at the terminator so day, night and (for locked worlds) the hot spot all show */
    orbP.yaw=orbP.gyaw=Math.atan2(SUN_DIR.x,SUN_DIR.z)+(p.locked?1.05:.8);orbP.pitch=orbP.gpitch=.18;
    PL.root.rotation.y=0;S.interacted=false;if(MOB)dosCollapsed=true;refreshAll();
    hint(MOB?"Drag to turn · pinch to zoom":"Drag to look around · scroll to zoom in close · Esc returns to the system");if(cb)cb();});}
function exitPlanet(unsel){transition(()=>{S.view="system";clearPlanet();$("#bake").hidden=true;if(unsel)S.planet=null;
  if(!SV||SV.s.id!==S.sel){buildSystem(SYS_BY[S.sel],PL_BY[S.planet]?PL_BY[S.planet].host:null);frameSystem();}refreshAll();});}
function goMap(cb){if(S.view==="map"){if(cb)cb();return;}transition(()=>{S.view="map";clearPlanet();clearSystem();$("#bake").hidden=true;S.planet=null;
  const s=S.sel&&SYS_BY[S.sel];if(s){orbM.t.copy(s.pos);orbM.gt.copy(s.pos);orbM.dist=orbM.gdist=clamp(s.dist_ly*.45+14,18,60);}refreshAll();if(cb)setTimeout(cb,60);});}
addEventListener("keydown",e=>{if(e.key==="Escape"){if(!fil.hidden)toggleFilters(false);else if(S.view==="planet")exitPlanet();else if(S.view==="system"){if(S.planet)selectPlanet(null);else goMap();}else if(S.sel){selectSystem(null);}}});

/* ===================== TOUR ===================== */
const TOUR=[
 {view:"map",title:"The Sun’s neighbourhood",text:"The Sun is at the centre. Every other point is a star known to have planets, coloured by how hot its surface is, and the rings mark 10, 25, 50 and 100 light-years. Most of these hosts are red dwarfs, far too faint to see without a telescope."},
 {view:"system",sys:"proxima-centauri",title:"Proxima Centauri",text:"The nearest star to the Sun, 4.2 light-years away: a small red dwarf belonging to the Alpha Centauri triple system. Proxima b, a little more massive than Earth, circles inside the habitable zone every 11 days, and tiny Proxima d orbits closer in. A third signal, Proxima c, is disputed and drawn dashed. Planets this close to a red dwarf are probably tidally locked and face strong flares."},
 {view:"system",sys:"trappist-1",title:"TRAPPIST-1",text:"Seven roughly Earth-sized planets cross the face of this ultracool dwarf 40 light-years away. Small shifts in the timing of those transits give their masses, so they are among the best-measured small exoplanets. The whole system would fit inside Mercury’s orbit; e, f and g lie in the habitable zone. JWST measurements of b and c suggest bare rock or, at most, thin atmospheres."},
 {view:"planet",planet:"55-cancri-e",sys:"55-cancri",title:"55 Cancri e",text:"55 Cancri A, a Sun-like star 41 light-years away, has five known planets, and its red-dwarf companion has two more found in 2025. The innermost, 55 Cancri e, is a super-Earth that orbits in under 18 hours. Its day side is hot enough to melt rock, and JWST observations in 2024 hinted at a thin atmosphere, possibly released by the magma."},
 {view:"system",sys:"tau-ceti",title:"Tau Ceti",text:"A Sun-like star 11.9 light-years away and a science-fiction favourite. Four planets were proposed from radial-velocity data in 2012 and 2017, but more precise measurements have not confirmed them. In April 2026 the NASA Exoplanet Archive reclassified tau Ceti e as a false positive. The remaining candidates are drawn dashed: planet lists change as the data improve."},
 {view:"system",sys:"epsilon-eridani",title:"Epsilon Eridani",text:"A young, active orange dwarf 10.5 light-years away, surrounded by dusty debris belts (not drawn). Its giant planet, Epsilon Eridani b, takes about seven years per orbit. Its existence was debated for nearly two decades until radial-velocity and astrometry data from Hipparcos and Gaia settled its orbit."},
 {view:"planet",planet:"hd-189733-b",sys:"hd-189733",title:"HD 189733 b",text:"The classic hot Jupiter, 64 light-years away. It races around its star in just over two days, with a day side above 1,000 K. In 2013 the Hubble Space Telescope measured its colour, a deep blue, so this is one of the few exoplanets whose true colour is known. Its atmosphere has been probed for water vapour, haze and very fast winds."},
 {view:"map",title:"Explore",text:"That is the tour. Tap any star to enter its system, open a planet for a close-up and its data, or use Filters to find habitable-zone candidates, giants found by imaging, and more."}];
const tourEl=$("#tour");
function startTour(){S.tour=0;document.body.classList.add("touring");toggleFilters(false);toggleIndex(false);
  if(filtersActive()){F.types=new Set(CLASSES.map(c=>c[0]).concat(["unknown"]));F.methods=new Set(METHODS.map(m=>m[0]));F.hz=false;F.disputed=true;applyFilterToMap();$("#filBtn").innerHTML="Filters";}
  showTourStep();}
function endTour(){S.tour=-1;tourEl.hidden=true;document.body.classList.remove("touring");sheetH();}
function showTourStep(){const st=TOUR[S.tour];
  tourEl.innerHTML='<div class="tt"><h3>'+esc(st.title)+'</h3><span class="stp">'+(S.tour+1)+' / '+TOUR.length+'</span></div><p>'+esc(st.text)+'</p><div class="tb"><button class="btn" data-t="exit">Exit tour</button><span class="sp"></span>'+(S.tour>0?'<button class="btn" data-t="back">Back</button>':'')+'<button class="btn primary" data-t="next">'+(S.tour===TOUR.length-1?"Finish":"Next")+'</button></div>';
  tourEl.hidden=false;sheetH();
  if(st.view==="map")goMap(()=>{selectSystem(null);flyHome();});
  else if(st.view==="system"){if(S.view==="system"&&S.sel===st.sys){selectPlanet(null);}else if(S.view==="planet"&&S.sel===st.sys)exitPlanet(true);else{if(S.view!=="map"){goMap(()=>enterSystem(st.sys));}else enterSystem(st.sys);}}
  else if(st.view==="planet"){const go=()=>enterPlanet(st.planet);if(S.view==="map"){S.sel=st.sys;enterSystem(st.sys,st.planet,()=>setTimeout(go,700));}else if(S.view==="system"&&S.sel===st.sys)go();else goMap(()=>{enterSystem(st.sys,st.planet,()=>setTimeout(go,700));});}}
tourEl.addEventListener("click",e=>{const b=e.target.closest("[data-t]");if(!b)return;const k=b.dataset.t;
  if(k==="exit")endTour();else if(k==="back"){S.tour=Math.max(0,S.tour-1);showTourStep();}else if(k==="next"){if(S.tour>=TOUR.length-1)endTour();else{S.tour++;showTourStep();}}});
$("#tourBtn").addEventListener("click",()=>{if(S.tour>=0)endTour();else startTour();});

/* ===================== POINTER INPUT ===================== */
const ptrs=new Map();let dragMoved=0,pinch0=0,lastTap=0,downAt=0;
const curOrb=()=>S.view==="map"?orbM:S.view==="system"?orbS:orbP;
canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});dragMoved=0;downAt=performance.now();
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch0=Math.hypot(a.x-b.x,a.y-b.y);}canvas.classList.add("dragging");S.interacted=true;});
canvas.addEventListener("pointermove",e=>{const p=ptrs.get(e.pointerId);
  if(!p){if(S.view==="map"&&e.pointerType==="mouse")hoverPick(e.clientX,e.clientY);return;}
  const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;dragMoved+=Math.abs(dx)+Math.abs(dy);const orb=curOrb();
  if(ptrs.size===1){if((e.shiftKey||e.buttons===2||e.buttons===4)&&S.view!=="planet")orb.pan(dx,dy);else{const k=S.view==="planet"?clamp((orb.dist-1)/3,.12,1):1;orb.rotate(dx*k,dy*k);}}
  else if(ptrs.size===2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch0>0)orb.zoom(Math.pow(pinch0/d,1.2));pinch0=d;}});
function endPtr(e){if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);if(ptrs.size<2)pinch0=0;canvas.classList.remove("dragging");
  if(ptrs.size===0&&dragMoved<8&&performance.now()-downAt<500)tapAt(e.clientX,e.clientY);}
canvas.addEventListener("pointerup",endPtr);canvas.addEventListener("pointercancel",endPtr);
canvas.addEventListener("contextmenu",e=>e.preventDefault());
canvas.addEventListener("wheel",e=>{e.preventDefault();const f=Math.exp(e.deltaY*.0014);
  if(S.view==="planet"){const dd=orbP.gdist-1;orbP.gdist=clamp(1+dd*Math.exp(e.deltaY*.0012),orbP.min,orbP.max);orbP.fly=null;}else curOrb().zoom(f);S.interacted=true;},{passive:false});
function pickSystem(x,y){const W=innerWidth,H=innerHeight;let best=null,bd=MOB?26:16;
  SYS.forEach(s=>{if(!sysShown(s)&&s.id!==S.sel)return;const pr=project(s.pos,camM,W,H);if(pr.z>=1)return;const d=Math.hypot(pr.x-x,pr.y-y);if(d<bd){bd=d;best=s;}});return best;}
function pickPlanet(x,y){if(!SV)return null;const W=innerWidth,H=innerHeight;let best=null,bd=MOB?30:20;
  SV.items.forEach(it=>{if(!it.a)return;const pr=project(it.mesh.position,camS,W,H);if(pr.z>=1)return;const d=Math.hypot(pr.x-x,pr.y-y);if(d<bd){bd=d;best=it.p;}});return best;}
function hoverPick(x,y){const s=pickSystem(x,y);if((s&&s.id)!==S.hover){S.hover=s?s.id:null;if(s)showTip(s,x,y);else hideTip();}else if(s)placeTip(x,y);canvas.classList.toggle("pointing",!!s);}
function tapAt(x,y){const now=performance.now();const dbl=now-lastTap<320;lastTap=now;
  if(S.view==="map"){const s=pickSystem(x,y);if(s){if(dbl||S.sel===s.id)enterSystem(s.id);else selectSystem(s.id,true);}else if(MOB){dosCollapsed=true;dos.classList.add("collapsed");sheetH();}}
  else if(S.view==="system"){const p=pickPlanet(x,y);if(p){if(dbl||S.planet===p.id)enterPlanet(p.id);else selectPlanet(p.id);}else if(MOB){dosCollapsed=true;dos.classList.add("collapsed");sheetH();}}
  else if(MOB){dosCollapsed=true;dos.classList.add("collapsed");sheetH();}}

/* ===================== RESIZE & LOOP ===================== */
function viewOffset(){const W=innerWidth,H=innerHeight;let ox=0,oy=0;
  if(!MOB&&W>900){const L=idx.getBoundingClientRect().right||0,Rr=dos.getBoundingClientRect().left||W;ox=W/2-(L+Rr)/2;ox=clamp(ox,-W*.2,W*.2);}
  if(MOB)oy=H*.06;
  [camM,camS,camP].forEach(c=>{if(ox||oy)c.setViewOffset(W,H,ox,oy,W,H);else c.clearViewOffset();c.updateProjectionMatrix();});}
function sheetH(){const r=MOB?dos.getBoundingClientRect():null;document.documentElement.style.setProperty("--sheet",(MOB?Math.round(innerHeight-r.top):0)+"px");
  document.documentElement.style.setProperty("--tourh",(tourEl.hidden?0:tourEl.offsetHeight)+"px");
  document.documentElement.style.setProperty("--tb",(!MOB&&!tourEl.hidden?tourEl.offsetHeight+16:0)+"px");}
function resize(){const W=innerWidth,H=innerHeight;renderer.setSize(W,H,false);[camM,camS,camP].forEach(c=>c.aspect=W/H);viewOffset();sheetH();
  markMat.uniforms.uPx.value=renderer.getPixelRatio();}
addEventListener("resize",resize);resize();
let last=performance.now(),T=0;
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
  bakeStep();
  const W=innerWidth,H=innerHeight;
  if(S.view==="map"){orbM.update(dt);if(!S.interacted&&!orbM.fly&&S.tour<0)orbM.gyaw+=dt*.02;
    markMat.uniforms.uScale.value=60;
    const ss=S.sel&&SYS_BY[S.sel];selRing.material.opacity=ss?.95:0;if(ss)selRing.position.copy(ss.pos);
    const hs=S.hover&&SYS_BY[S.hover];hoverRing.material.opacity=hs&&hs.id!==S.sel?.7:0;if(hs)hoverRing.position.copy(hs.pos);
    layoutMapLabels(W,H);renderer.render(mapS,camM);}
  else if(S.view==="system"){orbS.update(dt);S.days+=dt*S.speed;placePlanets();
    if(SV){SV.star.userData.mesh.material.uniforms.uTime.value=T;const it=S.planet&&SV.items.find(i=>i.p.id===S.planet);SEL_RING.material.opacity=it&&it.a?.95:0;if(it)SEL_RING.position.copy(it.mesh.position);}
    const P=SV&&SV.planets.length;$("#clock").textContent="Day "+num(S.days,1)+" · "+speedLabel(S.speed);
    layoutSysLabels(W,H);renderer.render(sysS,camS);}
  else{orbP.update(dt);updatePlanet(dt,T);renderer.render(plS,camP);}
  requestAnimationFrame(frame);}

/* ===================== START ===================== */
applyFilterToMap();refreshAll();
requestAnimationFrame(frame);
$("#splashLd").textContent="Charting "+SYS.length+" planetary systems";
setTimeout(()=>{$("#splash").classList.add("out");hint(MOB?"Drag to turn · pinch to zoom · tap a star":"Drag to turn · scroll to zoom · right-drag to pan · click a star");flyHome();},1300);
$("#splash").addEventListener("click",()=>$("#splash").classList.add("out"));
window.__atlas={D,S,F,SYS_BY,PL_BY,selectSystem,enterSystem,enterPlanet,exitPlanet,goMap,selectPlanet,startTour,endTour,get SV(){return SV;},get PL(){return PL;},orbM,orbS,orbP,renderFilters,toggleFilters,gfxOf,bakeJobs};
})();

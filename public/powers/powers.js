/* Powers of Ten — a continuous zoom from 10^-16 m to 10^27 m.
   Original procedural piece. Everything is generated in code; the only data files are
   stops.js (captions, star and galaxy catalogues) and earth-land.js (Natural Earth land mask).

   HOW THE ZOOM WORKS
   - L = log10(field of view in metres), measured across the shorter side of the screen.
   - There is one global frame "G": metres, origin at a carbon atom in a strand of DNA inside a
     virus on a bacterium on the back of a hand of a person standing in a valley town at
     40.4°N 111.7°W (Utah), at local noon on the March 2025 equinox. +Y is local up,
     +X east, -Z north.
   - Each scene has an origin O (in G, metres, double precision) and a unit 10^s m. Its content
     is built in local float units, so float32 precision is never stretched.
   - focus(L) is a path through G; camOrient(L) a smooth orientation track. For every visible
     scene the camera is placed at (focus + dir*D - O) / 10^s in that scene's units.
   - Consecutive scenes cross-fade over a band of L; weights form a partition of unity, so
     there is never a gap with nothing drawn. */
(function(){
"use strict";
if(!window.THREE){document.getElementById("err").style.display="block";document.getElementById("err").textContent="Could not load three.js (needs a network connection to cdnjs.cloudflare.com).";return;}
const T=THREE;
/* ===================== helpers ===================== */
const $=s=>document.querySelector(s);
const TAU=Math.PI*2,DEG=Math.PI/180;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const sstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
function rng(seed){let s=seed>>>0||1;return()=>{s=Math.imul(s^(s>>>15),2246822507);s=Math.imul(s^(s>>>13),3266489909);s^=s>>>16;return (s>>>0)/4294967296;};}
function gauss(R){return (R()+R()+R()+R()+R()+R()-3)/1.4142;}
const V3=(x,y,z)=>new T.Vector3(x,y,z);
const QS=new URLSearchParams(location.search);
const MOB=matchMedia("(max-width:820px), (pointer:coarse)").matches;
let Q=MOB?0.45:1;if(QS.get("q")==="low")Q*=0.5;if(QS.get("q")==="high")Q=1.3;
const NQ=n=>Math.max(16,Math.round(n*Q));
const LMIN=-16.3,LMAX=27.25;
const FOV=50,TANH=Math.tan(FOV/2*DEG);

/* ===================== renderer ===================== */
const canvas=$("#c");
let renderer;
try{renderer=new T.WebGLRenderer({canvas,antialias:!MOB||devicePixelRatio<2,powerPreference:"high-performance",alpha:false});}
catch(e){$("#err").style.display="block";$("#err").textContent="WebGL is not available in this browser.";$("#load").classList.add("gone");return;}
const MAXPR=Math.min(devicePixelRatio||1,MOB?2:2);
let PR=Math.min(MAXPR,MOB?1.5:1.75);
renderer.setPixelRatio(PR);
renderer.setClearColor(0x05060a,1);
renderer.autoClear=false;
const U={px:{value:500},time:{value:0}};

/* ===================== the global frame G ===================== */
const LAT=40.4*DEG,LON=-111.7*DEG;
const UP=V3(0,1,0);
const AXN=V3(0,Math.sin(LAT),-Math.cos(LAT));            // Earth's north pole axis
const SUN=V3(0,Math.cos(LAT),Math.sin(LAT));             // direction to the Sun (local noon, equinox)
const XEQ=SUN.clone(),ZEQ=AXN.clone(),YEQ=ZEQ.clone().cross(XEQ).normalize(); // equatorial basis (x = vernal equinox)
const eqVec=(x,y,z)=>XEQ.clone().multiplyScalar(x).add(YEQ.clone().multiplyScalar(y)).add(ZEQ.clone().multiplyScalar(z));
function radec(raH,decD){const a=raH*15*DEG,d=decD*DEG;return eqVec(Math.cos(d)*Math.cos(a),Math.cos(d)*Math.sin(a),Math.sin(d));}
const NECL=eqVec(0,-Math.sin(23.44*DEG),Math.cos(23.44*DEG)).normalize(); // north ecliptic pole (RA 18h, Dec +66.56)
const XECL=XEQ.clone(),YECL=NECL.clone().cross(XECL).normalize();
const eclDir=lamD=>XECL.clone().multiplyScalar(Math.cos(lamD*DEG)).add(YECL.clone().multiplyScalar(Math.sin(lamD*DEG)));
const EQ2GAL=[[-0.0548755604,-0.8734370902,-0.4838350155],[0.4941094279,-0.4448296300,0.7469822445],[-0.8676661490,-0.1980763734,0.4559837762]];
function galDir(lD,bD){const l=lD*DEG,b=bD*DEG;const g=[Math.cos(b)*Math.cos(l),Math.cos(b)*Math.sin(l),Math.sin(b)];
  const e=[0,1,2].map(j=>EQ2GAL[0][j]*g[0]+EQ2GAL[1][j]*g[1]+EQ2GAL[2][j]*g[2]);return eqVec(e[0],e[1],e[2]).normalize();}
const GX=galDir(0,0),GY=galDir(90,0),GZ=galDir(0,90);     // galactic axes in G
const galVec=(x,y,z)=>GX.clone().multiplyScalar(x).add(GY.clone().multiplyScalar(y)).add(GZ.clone().multiplyScalar(z));

/* key positions in G (metres) */
const AU=1.495978707e11,LY=9.4607e15,MLY=LY*1e6,RE=6.371e6;
const P_EARTH=[0,-1-RE,0];
const P_SUN=[SUN.x*AU,-1-RE+SUN.y*AU,SUN.z*AU];
const R0=26000*LY;
const P_GC=[P_SUN[0]+GX.x*R0,P_SUN[1]+GX.y*R0,P_SUN[2]+GX.z*R0];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const addv=(a,v,k)=>[a[0]+v.x*k,a[1]+v.y*k,a[2]+v.z*k];

/* ===================== shaders ===================== */
const NOISE=`
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm3(vec3 p){return .5*snoise(p)+.25*snoise(p*2.03+3.1)+.125*snoise(p*4.07+7.7);}
float fbm5(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*snoise(p);p=p*2.03+vec3(17.1,3.7,9.3);a*=.5;}return s;}
float ridged(vec3 p){float a=.5,s=0.,w=1.;for(int i=0;i<5;i++){float r=1.-abs(snoise(p));r*=r;r*=w;w=clamp(r*1.6,0.,1.);s+=a*r;p=p*2.11+vec3(5.3,11.9,1.7);a*=.5;}return s;}
vec2 hash2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}
float hash1(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*45758.5453);}
vec3 voro(vec2 x){vec2 n=floor(x),f=fract(x);float d1=8.,d2=8.;vec2 id=vec2(0.);
  for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 g=vec2(float(i),float(j));vec2 o=hash2(n+g);vec2 r=g+o-f;float d=dot(r,r);
    if(d<d1){d2=d1;d1=d;id=n+g;}else if(d<d2)d2=d;}
  return vec3(sqrt(d2)-sqrt(d1),hash1(id),sqrt(d1));}
`;
/* points with a physical size (local units) that fade instead of shrinking below a pixel floor */
const PV=`attribute vec3 aCol;attribute float aSize;attribute float aPh;
uniform float uPx,uFade,uMinPx,uMaxPx,uNear,uTime,uTw,uDim,uFixed,uSwirl,uFar;
varying vec3 vC;varying float vA;
void main(){vec3 p=position;
  if(uSwirl!=0.){float a=uTime*uSwirl*(.4+aPh);float c=cos(a),s=sin(a);p.xz=mat2(c,-s,s,c)*p.xz;}
  vec4 mv=modelViewMatrix*vec4(p,1.);float z=-mv.z;
  if(z<=0.){gl_Position=vec4(2.,2.,2.,1.);gl_PointSize=0.;vA=0.;return;}
  float px=uFixed>.5?aSize:aSize*uPx/z;float a=1.;
  if(px<uMinPx){a=max(px/uMinPx,uDim);px=uMinPx;}
  if(px>uMaxPx){a*=mix(1.,uMaxPx/px,.7);px=uMaxPx;}
  a*=smoothstep(uNear*.35,uNear,z);
  if(uFar>0.)a*=1.-smoothstep(uFar*.4,uFar,z);
  if(uTw>0.)a*=1.-uTw+uTw*(.5+.5*sin(uTime*(.6+aPh*2.7)+aPh*61.));
  vA=a*uFade;vC=aCol;gl_PointSize=px;gl_Position=projectionMatrix*mv;}`;
const PF=`varying vec3 vC;varying float vA;uniform float uHard;
void main(){vec2 c=gl_PointCoord-.5;float d=dot(c,c)*4.;if(d>1.)discard;
  float a=mix(exp(-d*4.5)*(1.-d),1.-smoothstep(.55,1.,d),uHard)*vA;if(a<.002)discard;gl_FragColor=vec4(vC,a);}`;
function ptsMat(o){o=o||{};
  return new T.ShaderMaterial({vertexShader:PV,fragmentShader:PF,transparent:true,depthWrite:false,depthTest:o.depth!==false,
    blending:o.normal?T.NormalBlending:T.AdditiveBlending,
    uniforms:{uPx:U.px,uTime:U.time,uFade:{value:1},uMinPx:{value:o.minPx==null?1.3:o.minPx},uMaxPx:{value:o.maxPx||64},
      uNear:{value:0},uFar:{value:0},uTw:{value:o.tw||0},uDim:{value:o.dim==null?0:o.dim},uFixed:{value:o.fixed?1:0},uSwirl:{value:o.swirl||0},uHard:{value:o.hard||0}}});}
/* lit body: lambert + rim + optional noise mottling, alpha-fades as a whole */
const BV=`varying vec3 vN;varying vec3 vW;varying vec3 vO;
void main(){vO=position;mat4 im=modelMatrix;
  #ifdef USE_INSTANCING
  im=modelMatrix*instanceMatrix;
  #endif
  vec4 w=im*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(im)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
const BF=`uniform vec3 uCol,uCol2,uSun,uRim;uniform float uFade,uAmb,uRimK,uNz,uNzF,uSpec,uEmis;
varying vec3 vN;varying vec3 vW;varying vec3 vO;${NOISE}
void main(){vec3 N=normalize(vN);if(!gl_FrontFacing)N=-N;vec3 L=normalize(uSun);vec3 V=normalize(cameraPosition-vW);
  float n=uNz>0.?fbm3(vO*uNzF):0.;vec3 base=mix(uCol,uCol2,clamp(.5+n*uNz,0.,1.));
  float l=max(dot(N,L),0.);float fr=pow(1.-max(dot(N,V),0.),2.5);
  vec3 H=normalize(L+V);float sp=pow(max(dot(N,H),0.),40.)*uSpec;
  vec3 col=base*(uAmb+l*(1.-uAmb))+uRim*fr*uRimK+vec3(sp)+base*uEmis;
  gl_FragColor=vec4(col,uFade);}`;
function bodyMat(o){o=o||{};const c=new T.Color(o.col||"#ccc"),c2=new T.Color(o.col2||o.col||"#ccc");
  return new T.ShaderMaterial({vertexShader:BV,fragmentShader:BF,transparent:true,depthWrite:o.dw!==false,side:o.side||T.FrontSide,
    uniforms:{uCol:{value:c},uCol2:{value:c2},uSun:{value:(o.sun||SUN).clone()},uRim:{value:new T.Color(o.rim||"#fff")},uFade:{value:1},
      uAmb:{value:o.amb==null?.25:o.amb},uRimK:{value:o.rimK==null?.3:o.rimK},uNz:{value:o.nz||0},uNzF:{value:o.nzF||1},uSpec:{value:o.spec||0},uEmis:{value:o.emis||0}}});}
/* additive fresnel glow shell */
const GVS=`varying vec3 vN;varying vec3 vW;varying vec3 vO;void main(){vO=position;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
const GFS=`uniform vec3 uCol;uniform float uFade,uPow,uInt,uCore,uNz,uNzF,uTime;varying vec3 vN;varying vec3 vW;varying vec3 vO;${NOISE}
void main(){vec3 N=normalize(vN);vec3 V=normalize(cameraPosition-vW);float fr=1.-abs(dot(N,V));
  float n=uNz>0.?(.6+uNz*fbm3(vO*uNzF+uTime*.02)):1.;
  float a=(uCore+pow(fr,uPow))*uInt*n*uFade;gl_FragColor=vec4(uCol,clamp(a,0.,1.));}`;
function glowMat(o){return new T.ShaderMaterial({vertexShader:GVS,fragmentShader:GFS,transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:o.side||T.DoubleSide,
  uniforms:{uCol:{value:new T.Color(o.col)},uFade:{value:1},uPow:{value:o.pow||3},uInt:{value:o.int||1},uCore:{value:o.core||0},uNz:{value:o.nz||0},uNzF:{value:o.nzF||1},uTime:U.time}});}

/* point buffer builder */
function PB(n){return{p:new Float32Array(n*3),c:new Float32Array(n*3),s:new Float32Array(n),f:new Float32Array(n),n:0,max:n};}
function pa(b,x,y,z,r,g,bl,s,ph){if(b.n>=b.max)return;const i=b.n++;b.p[i*3]=x;b.p[i*3+1]=y;b.p[i*3+2]=z;b.c[i*3]=r;b.c[i*3+1]=g;b.c[i*3+2]=bl;b.s[i]=s;b.f[i]=ph==null?Math.random():ph;}
function pObj(b,o){const g=new T.BufferGeometry();
  g.setAttribute("position",new T.BufferAttribute(b.p.subarray(0,b.n*3),3));g.setAttribute("aCol",new T.BufferAttribute(b.c.subarray(0,b.n*3),3));
  g.setAttribute("aSize",new T.BufferAttribute(b.s.subarray(0,b.n),1));g.setAttribute("aPh",new T.BufferAttribute(b.f.subarray(0,b.n),1));
  const m=new T.Points(g,ptsMat(o));m.frustumCulled=false;return m;}

/* ===================== scene registry ===================== */
const SCENES=[];
function scene(def){def.built=false;SCENES.push(def);return def;}
function mkCtx(def){
  const S={scene:new T.Scene(),mats:[],labels:[],def};
  S.add=(o)=>{S.scene.add(o);o.traverse(c=>{if(c.material){(Array.isArray(c.material)?c.material:[c.material]).forEach(m=>{if(S.mats.indexOf(m)<0){S.mats.push(m);if(m.userData.k==null)m.userData.k=1;if(!m.uniforms&&m.userData.op==null)m.userData.op=m.opacity;}});}});return o;};
  S.label=(text,pos,lmin,lmax,cls)=>{const l={text,pos,lmin,lmax,cls:cls||""};S.labels.push(l);return l;};
  return S;}
function build(def){if(def.built)return;const S=mkCtx(def);def.S=S;const r=def.build(S)||{};def.update=r.update||null;def.built=true;}

/* ===================== reusable meshes ===================== */
function capsule(r,len,seg){ /* along X */
  const g=new T.SphereGeometry(r,seg||24,2*Math.max(4,((seg||24)/4)|0));const p=g.attributes.position;
  for(let i=0;i<p.count;i++){const y=p.getY(i);p.setY(i,y+(y>=-1e-9?len/2:-len/2));}g.rotateZ(-Math.PI/2);g.computeVertexNormals();return g;}
function ellipsoid(a,b,c,seg){const g=new T.SphereGeometry(1,seg||20,Math.max(8,(seg||20)*.6|0));g.scale(a,b,c);return g;}
function cyl(a,b,r0,r1,seg){ /* cylinder from point a to b */
  const d=new T.Vector3().subVectors(b,a);const len=d.length();const g=new T.CylinderGeometry(r1==null?r0:r1,r0,len,seg||10,1,false);
  g.translate(0,len/2,0);const q=new T.Quaternion().setFromUnitVectors(UP,d.clone().normalize());g.applyMatrix4(new T.Matrix4().makeRotationFromQuaternion(q));g.translate(a.x,a.y,a.z);return g;}
function mergeGeos(list){ /* minimal merge (position + normal) */
  let n=0,ni=0;list.forEach(g=>{n+=g.attributes.position.count;ni+=g.index?g.index.count:g.attributes.position.count;});
  const pos=new Float32Array(n*3),nor=new Float32Array(n*3),idx=new Uint32Array(ni);let o=0,oi=0;
  list.forEach(g=>{const P=g.attributes.position,N=g.attributes.normal;pos.set(P.array,o*3);nor.set(N.array,o*3);
    if(g.index){for(let i=0;i<g.index.count;i++)idx[oi++]=g.index.array[i]+o;}else{for(let i=0;i<P.count;i++)idx[oi++]=i+o;}o+=P.count;});
  const g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(pos,3));g.setAttribute("normal",new T.BufferAttribute(nor,3));g.setIndex(new T.BufferAttribute(idx,1));return g;}

/* ===================== micro layout constants (metres in G) ===================== */
const NM=1e-9,UM=1e-6;
const HEADC=[0,-15*NM,0];                 // phage head centre
const BACC=[0.3*UM,-0.575*UM,0];          // bacterium centre (axis along X)
const SKIN=[0,-0.975*UM,0];               // skin surface under the bacterium
const PERSON=[0.18,-0.12,-0.55];          // person's chest
const GROUND=[0,-1,0];                    // ground under the hand

/* ======================================================================
   SCENE 0 — quarks and gluons (unit fm)
   ====================================================================== */
scene({id:"quark",s:-15,O:[0,0,0],farK:14,build(S){
  const R=rng(11);
  const shell=new T.Mesh(new T.SphereGeometry(.84,48,32),glowMat({col:"#ff9a6a",pow:2.6,int:.55,core:.04}));S.add(shell);
  const haze=PB(NQ(5000));
  for(let i=0;i<haze.max;i++){let x,y,z;do{x=R()*2-1;y=R()*2-1;z=R()*2-1;}while(x*x+y*y+z*z>1);const r=.84*Math.cbrt(R());const l=Math.hypot(x,y,z)||1;
    const k=R(),c=k<.33?[1,.35,.3]:k<.66?[.35,1,.45]:[.4,.55,1];const b=.12+.22*R();pa(haze,x/l*r,y/l*r,z/l*r,c[0]*b,c[1]*b,c[2]*b,.012+.016*R());}
  S.add(pObj(haze,{tw:.7,swirl:.25,minPx:1.2}));
  const sea=PB(NQ(260));
  for(let i=0;i<sea.max;i++){const r=.8*Math.cbrt(R()),th=R()*TAU,ph=Math.acos(2*R()-1);const k=R(),c=k<.33?[0,1,1]:k<.66?[1,0,1]:[1,1,0];
    pa(sea,r*Math.sin(ph)*Math.cos(th),r*Math.cos(ph),r*Math.sin(ph)*Math.sin(th),c[0]*.6+.15,c[1]*.6+.15,c[2]*.6+.15,.022+.018*R());}
  S.add(pObj(sea,{tw:1,swirl:-.35,minPx:1.5,hard:.3}));
  /* valence quarks + flux tubes (updated on the CPU every frame) */
  const QC=[[1,.28,.22],[.3,1,.38],[.38,.55,1]];
  const qb=PB(6);for(let i=0;i<3;i++){pa(qb,0,0,0,QC[i][0],QC[i][1],QC[i][2],.07,0);pa(qb,0,0,0,QC[i][0]*.7,QC[i][1]*.7,QC[i][2]*.7,.32,0);}
  const qPts=pObj(qb,{hard:0,minPx:4,dim:1,maxPx:240});S.add(qPts);
  const NT=NQ(420),tb=PB(NT*3);const off=[];
  for(let i=0;i<NT*3;i++){pa(tb,0,0,0,1,1,1,.012+.012*R());off.push([gauss(R)*.025,gauss(R)*.025,gauss(R)*.025,R()]);}
  const tPts=pObj(tb,{tw:.5,minPx:1.2});S.add(tPts);
  const qp=[V3(),V3(),V3()],J=V3();
  const lbl=[S.label("up quark",qp[0],-16.4,-15.2),S.label("up quark",qp[1],-16.4,-15.2),S.label("down quark",qp[2],-16.4,-15.2)];
  S.label("proton boundary",V3(.6,.59,0),-15.6,-14.9);
  return{update(L,t){
    const f=[[.05,.04,.06,1.3,1.7,1.1],[.42,.38,.4,.71,.93,.57],[.44,.4,.42,.83,.61,1.07]];
    for(let i=0;i<3;i++){const a=f[i];qp[i].set(a[0]*Math.sin(t*a[3]+i*2.1)+(i?.0:0),a[1]*Math.sin(t*a[4]+i),a[2]*Math.cos(t*a[5]+i*1.3));
      if(i==1)qp[i].x+=.18,qp[i].y+=.12;if(i==2)qp[i].x-=.16,qp[i].z+=.2;}
    J.set(0,0,0).add(qp[0]).add(qp[1]).add(qp[2]).multiplyScalar(1/3);J.y+=.03*Math.sin(t*2.3);
    const P=qPts.geometry.attributes.position;for(let i=0;i<3;i++){P.setXYZ(i*2,qp[i].x,qp[i].y,qp[i].z);P.setXYZ(i*2+1,qp[i].x,qp[i].y,qp[i].z);}P.needsUpdate=true;
    const TP=tPts.geometry.attributes.position,TC=tPts.geometry.attributes.aCol;
    for(let k=0;k<3;k++)for(let i=0;i<NT;i++){const j=k*NT+i;const o=off[j];const u=(o[3]+t*.15*(k%2?1:-1))%1;const uu=u<0?u+1:u;
      const w=Math.sin(uu*Math.PI)*1.2+.3;
      TP.setXYZ(j,lerp(qp[k].x,J.x,uu)+o[0]*w,lerp(qp[k].y,J.y,uu)+o[1]*w,lerp(qp[k].z,J.z,uu)+o[2]*w);
      const c=QC[k],c2=QC[(k+1)%3];TC.setXYZ(j,lerp(c[0],c2[0],uu*.6)*.35+.12,lerp(c[1],c2[1],uu*.6)*.35+.12,lerp(c[2],c2[2],uu*.6)*.35+.12);}
    TP.needsUpdate=true;TC.needsUpdate=true;
  }};}});

/* ======================================================================
   SCENE 1 — carbon-12 nucleus (unit fm)
   ====================================================================== */
scene({id:"nucleus",s:-15,O:[0,0,0],build(S){
  const R=rng(5);const pos=[V3(0,0,0)];
  const ph=(1+Math.sqrt(5))/2;const ico=[[-1,ph,0],[1,ph,0],[-1,-ph,0],[1,-ph,0],[0,-1,ph],[0,1,ph],[0,-1,-ph],[0,1,-ph],[ph,0,-1],[ph,0,1],[-ph,0,-1],[-ph,0,1]];
  ico.slice(0,11).forEach(v=>pos.push(V3(v[0],v[1],v[2]).normalize().multiplyScalar(1.62)));
  const types=[1,0,1,0,1,1,0,1,0,0,1,0]; /* 6 protons (1), 6 neutrons (0); the centre one is our proton */
  const geo=new T.SphereGeometry(.84,40,28);const nuc=[];
  const LD=V3(.5,.8,.6).normalize();
  pos.forEach((p,i)=>{const m=bodyMat({col:types[i]?"#ff6f4e":"#8fa3c4",col2:types[i]?"#ffb07a":"#c7d3e8",sun:LD,amb:.32,rim:types[i]?"#ffb38a":"#cfe0ff",rimK:.55,nz:.8,nzF:2.2});
    const me=new T.Mesh(geo,m);me.position.copy(p);S.add(me);nuc.push({me,p:p.clone(),ph:R()*10,m});});
  S.add(new T.Mesh(new T.SphereGeometry(2.9,40,28),glowMat({col:"#ffb070",pow:3,int:.25})));
  const hb=PB(NQ(1500));for(let i=0;i<hb.max;i++){const r=2.6*Math.cbrt(R()),th=R()*TAU,p2=Math.acos(2*R()-1);pa(hb,r*Math.sin(p2)*Math.cos(th),r*Math.cos(p2),r*Math.sin(p2)*Math.sin(th),.9,.6,.4,.05,R());}
  S.add(pObj(hb,{tw:1,swirl:.3,minPx:1.2}));
  S.label("proton",nuc[2].p,-14.6,-13.4);S.label("neutron",nuc[1].p,-14.6,-13.4);
  return{update(L,t){const outer=sstep(-14.95,-14.45,L);
    nuc.forEach((n,i)=>{n.me.position.set(n.p.x+.05*Math.sin(t*2.1+n.ph),n.p.y+.05*Math.sin(t*1.7+n.ph*2),n.p.z+.05*Math.cos(t*1.9+n.ph));
      if(i>0)n.m.userData.k=outer;});}};}});

/* ======================================================================
   SCENE 2 — carbon atom electron cloud (unit pm)
   ====================================================================== */
function invCdfSampler(pdf,xmax,n){const N=n||4000;const cdf=new Float64Array(N+1);let s=0;
  for(let i=1;i<=N;i++){const x=(i-.5)/N*xmax;s+=Math.max(0,pdf(x));cdf[i]=s;}
  for(let i=0;i<=N;i++)cdf[i]/=s;
  return u=>{let lo=0,hi=N;while(hi-lo>1){const m=(lo+hi)>>1;if(cdf[m]<u)lo=m;else hi=m;}return (lo+(u-cdf[lo])/(cdf[hi]-cdf[lo]+1e-12))/N*xmax;};}
scene({id:"atom",s:-12,O:[0,0,0],farK:30,build(S){
  const R=rng(7);const a0=52.918;
  const Z1=5.7,Z2=3.25;
  const r1s=invCdfSampler(x=>x*x*Math.exp(-2*x),12);           // x = Z r / a0
  const r2s=invCdfSampler(x=>(2-x)*(2-x)*x*x*Math.exp(-x),30);
  const r2p=invCdfSampler(x=>Math.pow(x,4)*Math.exp(-x),30);
  const dir=()=>{const u=2*R()-1,t=R()*TAU,s=Math.sqrt(1-u*u);return[s*Math.cos(t),u,s*Math.sin(t)];};
  const b=PB(NQ(7000)+NQ(8000)+NQ(16000));
  for(let i=0;i<NQ(7000);i++){const r=r1s(R())*a0/Z1,d=dir();pa(b,d[0]*r,d[1]*r,d[2]*r,.75,.88,1,.32);}
  for(let i=0;i<NQ(8000);i++){const r=r2s(R())*a0/Z2,d=dir();pa(b,d[0]*r,d[1]*r,d[2]*r,.45,.62,1,1.5);}
  /* two 2p electrons: px and pz (cos^2 angular density about their axes) */
  for(let i=0;i<NQ(16000);i++){const ax=i&1;let d;do{d=dir();}while(R()>d[ax?2:0]*d[ax?2:0]);const r=r2p(R())*a0/Z2;
    const c=ax?[.75,.6,1]:[.4,.9,1];pa(b,d[0]*r,d[1]*r,d[2]*r,c[0],c[1],c[2],1.6);}
  S.add(pObj(b,{tw:1,minPx:1.1,dim:.12,maxPx:20}));
  const nb=PB(2);pa(nb,0,0,0,1,.62,.35,.0055,0);pa(nb,0,0,0,1,.5,.3,.04,0);
  S.add(pObj(nb,{minPx:3.5,dim:1,hard:.2}));
  S.label("nucleus",V3(0,0,0),-13.6,-11.3,"here");
  S.label("1s electrons",V3(9,9,0),-11.6,-10.6);
  S.label("2p orbital",V3(95,0,0),-10.4,-9.7);S.label("2p orbital",V3(0,0,-95),-10.4,-9.7);
  return{};}});

/* ======================================================================
   SCENE 3/4 — base pair and DNA helix (units Å and nm)
   The base pair is laid out schematically (bond length ~1.4 Å, H-bond ~2.9 Å).
   ====================================================================== */
const ELC={C:"#8d97a6",N:"#5b7cff",O:"#ff5a4a",H:"#f2f2f2",P:"#ffa340"};
const ELR={C:.45,N:.42,O:.40,H:.25,P:.55};
const BASEPAIR=(function(){
  const A=[],B=[];const add=(e,u,v)=>{A.push({e,u,v});return A.length-1;};const bond=(i,j,h)=>B.push([i,j,h?1:0]);
  const hex=(cx,cy,r,a0,els)=>els.map((e,k)=>add(e,cx+r*Math.cos((a0+60*k)*DEG),cy+r*Math.sin((a0+60*k)*DEG)));
  const cxC=-2.85,cxG=2.85;
  const c=hex(cxC,0,1.4,0,["N","C","C","C","N","C"]);   // N3,C4,C5,C6,N1,C2 (cytosine)
  for(let k=0;k<6;k++)bond(c[k],c[(k+1)%6]);
  const g=hex(cxG,0,1.4,0,["C","C","C","N","C","N"]);   // C4,C5,C6,N1,C2,N3 (guanine 6-ring), angles 0..300
  for(let k=0;k<6;k++)bond(g[k],g[(k+1)%6]);
  const sub=(i,e,len,ang)=>{const j=add(e,A[i].u+len*Math.cos(ang*DEG),A[i].v+len*Math.sin(ang*DEG));bond(i,j);return j;};
  /* cytosine substituents */
  const n4=sub(c[1],"N",1.34,60);sub(n4,"H",1.0,0);sub(n4,"H",1.0,120);
  const o2=sub(c[5],"O",1.24,-60);
  sub(c[2],"H",1.08,120);sub(c[3],"H",1.08,180);
  /* guanine: O6 on C6 (120°), N1-H (180°), N2 on C2 (240°) */
  const o6=sub(g[2],"O",1.24,120);
  const h1=sub(g[3],"H",1.0,180);
  const n2=sub(g[4],"N",1.34,240);const h2a=sub(n2,"H",1.0,180);sub(n2,"H",1.0,300);
  /* five-membered ring on C4–C5 (right side) */
  const p4=A[g[0]],p5=A[g[1]];const mx=(p4.u+p5.u)/2,my=(p4.v+p5.v)/2;const ox=mx-cxG,oy=my;const ol=Math.hypot(ox,oy);
  const n7=add("N",p5.u+ox/ol*1.3,p5.v+oy/ol*1.3),n9=add("N",p4.u+ox/ol*1.3,p4.v+oy/ol*1.3),c8=add("C",mx+ox/ol*2.05,my+oy/ol*2.05);
  bond(g[1],n7);bond(n7,c8);bond(c8,n9);bond(n9,g[0]);sub(c8,"H",1.08,Math.atan2(oy,ox)/DEG);
  /* hydrogen bonds */
  bond(n4,o6,1);bond(c[0],h1,1);bond(o2,h2a,1);
  /* sugar + phosphate stubs on cytosine N1 and guanine N9 */
  const stub=(i,ang)=>{const p=A[i];const cx=p.u+2.6*Math.cos(ang*DEG),cy=p.v+2.6*Math.sin(ang*DEG);
    const s=[];for(let k=0;k<5;k++){const a=(ang+180+72*k)*DEG;s.push(add(k==2?"O":"C",cx+1.25*Math.cos(a),cy+1.25*Math.sin(a)));}
    for(let k=0;k<5;k++)bond(s[k],s[(k+1)%5]);bond(i,s[0]);
    const c5=sub(s[3],"C",1.5,ang+40);const o5=sub(c5,"O",1.43,ang+80);const P=sub(o5,"P",1.6,ang+40);
    sub(P,"O",1.5,ang+120);sub(P,"O",1.5,ang-30);sub(P,"O",1.6,ang+40);};
  stub(c[4],240);stub(n9,Math.atan2(A[n9].v-cxG*0,A[n9].u-cxG)/DEG-10);
  /* origin: guanine C6 */
  const o=A[g[2]];const ou=o.u,ov=o.v;A.forEach(a=>{a.u-=ou;a.v-=ov;});
  const axisU=-ou,axisV=-ov; /* helix axis passes the base-pair centre */
  return{A,B,axisU,axisV};})();
/* template (u,v) → local 3D: base pair in the YZ plane; screen-right = -Z when seen from +X */
function bpPoint(a){return V3(0,a.v,-a.u);}
function atomMeshes(S,positions,els,scale,lightDir,haloSize){
  const groups={};positions.forEach((p,i)=>{(groups[els[i]]=groups[els[i]]||[]).push(p);});
  const geo=new T.SphereGeometry(1,18,12);
  Object.keys(groups).forEach(e=>{const list=groups[e];const m=bodyMat({col:ELC[e],sun:lightDir,amb:.35,rimK:.45,rim:"#bcd6ff",spec:.25});
    const im=new T.InstancedMesh(geo,m,list.length);const M=new T.Matrix4();
    list.forEach((p,i)=>{M.makeScale(ELR[e]*scale,ELR[e]*scale,ELR[e]*scale);M.setPosition(p);im.setMatrixAt(i,M);});
    im.frustumCulled=false;S.add(im);});
  if(haloSize){const hb=PB(positions.length);positions.forEach((p,i)=>{const c=new T.Color(ELC[els[i]]);pa(hb,p.x,p.y,p.z,c.r*.35+.12,c.g*.35+.15,c.b*.35+.25,haloSize*(els[i]=="H"?.6:1));});
    S.add(pObj(hb,{minPx:1,maxPx:400,tw:.25}));}}
/* instanced bodyMat: patch the vertex shader so InstancedMesh works with our ShaderMaterial */
const BVI_UNUSED=`varying vec3 vN;varying vec3 vW;varying vec3 vO;
void main(){vO=position;mat4 im=modelMatrix;
  #ifdef USE_INSTANCING
  im=modelMatrix*instanceMatrix;
  #endif
  vec4 w=im*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(im)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
const LMOL=V3(.55,.75,.4).normalize();
scene({id:"molecule",s:-10,O:[0,0,0],build(S){
  const pos=BASEPAIR.A.map(bpPoint),els=BASEPAIR.A.map(a=>a.e);
  atomMeshes(S,pos,els,1,LMOL,1.6);
  /* bonds */
  const cov=[],hb=[];BASEPAIR.B.forEach(b=>{(b[2]?hb:cov).push(b);});
  const bg=mergeGeos(cov.map(b=>cyl(pos[b[0]],pos[b[1]],.13,.13,8)));
  S.add(new T.Mesh(bg,bodyMat({col:"#c9d2de",sun:LMOL,amb:.4,rimK:.2})));
  const hp=PB(NQ(400));hb.forEach(b=>{const a=pos[b[0]],c=pos[b[1]];for(let i=0;i<14;i++){const u=i/13;if(i%3==2)continue;pa(hp,lerp(a.x,c.x,u),lerp(a.y,c.y,u),lerp(a.z,c.z,u),.5,.9,1,.12,u);}});
  S.add(pObj(hp,{minPx:1.5,hard:.6,tw:.3}));
  const water=[[0,4.2,-5.6],[0,-5,4.8],[0,5.5,3.5]];
  water.forEach(w=>{const o=V3(w[0],w[1],w[2]);const h1=o.clone().add(V3(0,.76,.59)),h2=o.clone().add(V3(0,-.76,.59));
    atomMeshes(S,[o,h1,h2],["O","H","H"],1,LMOL,1.4);});
  S.label("guanine",bpPoint({u:4.6,v:-1.5}),-9.65,-8.7);S.label("cytosine",bpPoint({u:-4.6,v:-1.2}),-9.65,-8.7);
  S.label("hydrogen bonds",bpPoint({u:-.6,v:2.4}),-9.6,-9.0);S.label("water",V3(0,5.5,3.5),-9.6,-9.0);
  S.label("our carbon atom",V3(0,0,0),-10.1,-9.45,"here");
  return{};}});
/* DNA helix following a 15 nm-radius loop through the origin (it continues as the coil inside the phage head) */
const LOOP_R=15;
function dnaFrame(s){ /* s in nm along the loop; returns axis point, tangent T, radial N, binormal B (=Z) */
  const a=s/LOOP_R;return{A:V3(LOOP_R*Math.sin(a),-LOOP_R+LOOP_R*Math.cos(a),0),T:V3(Math.cos(a),-Math.sin(a),0),N:V3(Math.sin(a),Math.cos(a),0),B:V3(0,0,1)};}
scene({id:"dna",s:-9,O:[0,0,0],build(S){
  const nbp=MOB?70:120;const pos=[],els=[];const bb1=[],bb2=[];
  const tw=2*Math.PI/10.5,rise=.34;
  const axU=BASEPAIR.axisU/10,axV=BASEPAIR.axisV/10;
  for(let k=-nbp;k<=nbp;k++){const s=k*rise;const F=dnaFrame(s);const th=k*tw;const c=Math.cos(th),sn=Math.sin(th);
    const flip=(k*7919)%3==0; /* some pairs drawn the other way round (C–G vs G–C) */
    BASEPAIR.A.forEach((a,i)=>{let u=a.u/10-axU,v=a.v/10-axV;if(flip)u=-u;
      const y=v*c-(-u)*sn,z=v*sn+(-u)*c; /* rotate (v,-u) in the N–B plane */
      const p=F.A.clone().add(F.N.clone().multiplyScalar(y+axV)).add(F.B.clone().multiplyScalar(z-axU));
      pos.push(p);els.push(a.e);if(a.e==="P"){((a.u<0)!==flip?bb1:bb2).push(p);}});}
  atomMeshes(S,pos,els,.1,LMOL,.16);
  /* backbone ribbons through the phosphates */
  [bb1,bb2].forEach((pts,j)=>{const curve=new T.CatmullRomCurve3(pts);const tg=new T.TubeGeometry(curve,pts.length*4,.12,6,false);
    S.add(new T.Mesh(tg,bodyMat({col:j?"#ffb15a":"#ffcf7a",sun:LMOL,amb:.4,rimK:.3})));});
  S.label("sugar–phosphate backbone",bb1[Math.floor(bb1.length/2)+6]||V3(),-8.9,-7.9);
  S.label("base pairs",dnaFrame(-3).A,-8.9,-8.1);
  return{};}});

/* ======================================================================
   SCENE 5 — bacteriophage (unit nm). Head centre at (0,-15,0), DNA coil inside.
   ====================================================================== */
function phageModel(withDNA,col){
  const g=new T.Group();const hc=V3(0,-15,0);
  const capsMat=bodyMat({col:col||"#9fb4cc",col2:"#d6e2f0",amb:.35,rimK:.7,rim:"#cfe6ff",nz:.5,nzF:.12,dw:!withDNA,sun:SUN});
  const ig=new T.IcosahedronGeometry(50,1);ig.scale(1,1.22,1);
  const head=new T.Mesh(ig,capsMat);head.position.copy(hc);g.add(head);
  const edges=new T.LineSegments(new T.EdgesGeometry(ig),new T.LineBasicMaterial({color:0xe6f0ff,transparent:true,opacity:.5}));edges.position.copy(hc);g.add(edges);
  const tailMat=bodyMat({col:"#8ea2bb",col2:"#c2d0e0",amb:.35,rimK:.5,nz:.4,nzF:.2});
  const parts=[];
  parts.push(cyl(V3(0,-75,0),V3(0,-158,0),10.5,10.5,16));      // sheath
  for(let y=-78;y>-158;y-=5.2){const t=new T.TorusGeometry(10.8,1.6,6,16);t.rotateX(Math.PI/2);t.translate(0,y,0);parts.push(t);}
  parts.push(cyl(V3(0,-158,0),V3(0,-166,0),24,22,6));          // baseplate (hexagonal)
  parts.push(cyl(V3(0,-64,0),V3(0,-76,0),7,13,12));            // collar
  for(let k=0;k<6;k++){const a=k/6*TAU+.3;const p0=V3(Math.cos(a)*22,-162,Math.sin(a)*22);const p1=V3(Math.cos(a)*62,-120,Math.sin(a)*62);const p2=V3(Math.cos(a)*78,-175,Math.sin(a)*78);
    parts.push(cyl(p0,p1,1.6,1.4,6));parts.push(cyl(p1,p2,1.4,1.0,6));}
  g.add(new T.Mesh(mergeGeos(parts),tailMat));
  return{g,capsMat,edges};}
scene({id:"phage",s:-9,O:[0,0,0],build(S){
  const ph=phageModel(true);S.add(ph.g);
  /* packed DNA: coaxial loops around the Z axis through the head centre */
  const loops=[];const step=MOB?4.4:3.7; /* real packing is ~2.5 nm; spacing widened so the coil reads */
  for(let r=5;r<=41;r+=step)for(let z=-38;z<=38;z+=step){if(r*r/(41*41)+z*z/(36*36)>1)continue;loops.push([r,z]);}
  loops.push([LOOP_R,0]);
  const segs=MOB?28:44,rad=MOB?4:5;const mkLoops=(list)=>{const pos=[],nor=[],idx=[];let base=0;
  list.forEach(([r,z],li)=>{const jit=li*1.7;
    for(let i=0;i<=segs;i++){const a=i/segs*TAU;const c=V3(Math.sin(a)*r,-15+Math.cos(a)*r,z+.6*Math.sin(a*3+jit));const tng=V3(Math.cos(a),-Math.sin(a),0);const nn=V3(Math.sin(a),Math.cos(a),0);const bn=V3(0,0,1);
      for(let j=0;j<rad;j++){const b=j/rad*TAU;const d=nn.clone().multiplyScalar(Math.cos(b)).add(bn.clone().multiplyScalar(Math.sin(b)));
        const p=c.clone().add(d.clone().multiplyScalar(.75));pos.push(p.x,p.y,p.z);nor.push(d.x,d.y,d.z);}}
    for(let i=0;i<segs;i++)for(let j=0;j<rad;j++){const a=base+i*rad+j,b=base+i*rad+(j+1)%rad,c=a+rad,d=b+rad;idx.push(a,c,b,b,c,d);}
    base+=(segs+1)*rad;});
  const dg=new T.BufferGeometry();dg.setAttribute("position",new T.Float32BufferAttribute(pos,3));dg.setAttribute("normal",new T.Float32BufferAttribute(nor,3));dg.setIndex(idx);return dg;};
  /* loops on the camera side of ours are faded in only once the view has pulled back */
  const dnaM=bodyMat({col:"#ffcf7a",col2:"#e0784a",amb:.18,rimK:.5,rim:"#fff0c0",nz:1.2,nzF:.08,sun:LMOL});S.add(new T.Mesh(mkLoops(loops.filter(l=>l[1]<=1.5)),dnaM));
  const dnaF=bodyMat({col:"#ffcf7a",col2:"#e0784a",amb:.18,rimK:.5,rim:"#fff0c0",nz:1.2,nzF:.08,sun:LMOL});S.add(new T.Mesh(mkLoops(loops.filter(l=>l[1]>1.5)),dnaF));
  S.label("capsid (protein shell)",V3(38,40,0),-7.6,-6.6);S.label("tail",V3(12,-110,0),-7.3,-6.6);S.label("tail fibres",V3(70,-150,0),-7.3,-6.7);
  S.label("packed DNA",V3(-25,-15,0),-7.9,-7.2);
  return{update(L){const op=sstep(-7.8,-7.0,L);ph.capsMat.userData.k=.25+.75*op;ph.edges.material.userData.op=.5*(1-op*.4);
    dnaM.userData.k=1-sstep(-7.1,-6.6,L);dnaF.userData.k=0; /* near-side loops stay hidden: they filled the frame like a wall; the opaque capsid covers them by -7 */}};}});

/* ======================================================================
   SCENE 6 — bacterium with phages (unit µm), side view; skin surface below
   ====================================================================== */
scene({id:"bact",s:-6,O:[0,0,0],build(S){
  const R=rng(21);const bc=V3(BACC[0]/UM,BACC[1]/UM,0);
  const bm=bodyMat({col:"#a8c06a",col2:"#e2e8a0",amb:.3,rimK:.5,rim:"#f4ffd0",nz:.7,nzF:6});
  const b=new T.Mesh(capsule(.4,2.2,40),bm);b.position.copy(bc);S.add(b);
  /* pili */
  const pp=PB(NQ(900));for(let i=0;i<pp.max;i++){const x=(R()-.5)*3,a=R()*TAU;const l=.02+.12*R();const ny=Math.cos(a),nz=Math.sin(a);
    const cx=clamp(x,-1.1,1.1);const dx=x-cx;const n=V3(dx,ny,nz).normalize();const p=V3(bc.x+cx,bc.y,bc.z).add(n.clone().multiplyScalar(.4+l*R()));
    pa(pp,p.x,p.y,p.z,.45,.5,.33,.008);}
  S.add(pObj(pp,{minPx:1,dim:.3}));
  /* phages: ours at the origin plus others on the surface */
  const spots=[[0,0],[.75,-.5],[-.6,.6],[1.2,.9],[-.9,-.25],[.35,1.6]];
  spots.forEach((sp,i)=>{const pm=phageModel(false,"#a9bdd4");const g=pm.g;g.scale.setScalar(.001);
    if(i==0){g.position.set(0,0,0);}
    else{const ang=sp[1];const n=V3(0,Math.cos(ang),Math.sin(ang));const base=V3(bc.x+sp[0],bc.y,bc.z).add(n.clone().multiplyScalar(.4));
      g.quaternion.setFromUnitVectors(UP,n);g.position.copy(base).add(n.clone().multiplyScalar(.175));}
    S.add(g);});
  /* skin surface */
  const sm=new T.ShaderMaterial({transparent:true,extensions:{derivatives:true},uniforms:{uFade:{value:1},uSun:{value:SUN}},
    vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform float uFade;uniform vec3 uSun;varying vec3 vW;${NOISE}
    void main(){vec2 p=vW.xz;float n=fbm3(vec3(p*1.3,0.));float n2=snoise(vec3(p*7.,1.));
      vec3 col=vec3(.86,.72,.66)*(.8+.15*n+.05*n2);float d=length(p)/18.;gl_FragColor=vec4(col*(.55+.4*max(uSun.y,0.)),uFade*(1.-smoothstep(.6,1.,d)));}`});
  const pl=new T.Mesh(new T.PlaneGeometry(40,40),sm);pl.rotation.x=-Math.PI/2;pl.position.y=SKIN[1]/UM;S.add(pl);
  /* a few more bacteria lying on the skin */
  for(let i=0;i<14;i++){const l=1+R()*2.4;const m=new T.Mesh(capsule(.38,l,20),bm);m.position.set((R()-.5)*16,SKIN[1]/UM+.38,(R()-.5)*14-3);
    if(m.position.length()<2.5)m.position.x+=5;m.rotation.y=R()*TAU;S.add(m);}
  S.label("bacterium",V3(bc.x+1.2,bc.y+.25,0),-6.4,-5.4);S.label("phages",V3(.75,-.12,-.4),-6.6,-5.9);S.label("pili",V3(bc.x-1.3,bc.y+.45,0),-6.3,-5.8);
  return{};}});

/* ======================================================================
   SCENE 7 — skin cells (unit µm), top-down. Origin at the skin surface.
   ====================================================================== */
const HAIR_X=50; /* µm: the hair lies along Z, 50 µm east of the focus */
scene({id:"cells",s:-6,O:SKIN,build(S){
  const R=rng(31);
  const m=new T.ShaderMaterial({transparent:true,extensions:{derivatives:true},uniforms:{uFade:{value:1},uSun:{value:SUN}},
    vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform float uFade;uniform vec3 uSun;varying vec3 vW;${NOISE}
    void main(){vec2 p=vW.xz;
      vec3 v=voro(p/34.+vec2(snoise(vec3(p*.02,0.)),snoise(vec3(p*.02,4.)))*.25);
      float edge=1.-smoothstep(.0,.06,v.x);float lift=smoothstep(.0,.25,v.x);
      float n=fbm3(vec3(p*.15,v.y*10.));float fine=snoise(vec3(p*1.1,2.));
      vec3 base=mix(vec3(.80,.66,.60),vec3(.92,.80,.74),v.y)*(.85+.12*n+.04*fine);
      base*=1.-edge*.45;base+=vec3(.06,.05,.05)*lift*(1.-v.z);
      float fw=fwidth(p.x);float far=smoothstep(4.,30.,fw);base=mix(base,vec3(.84,.7,.64),far);
      float d=length(p)/700.;gl_FragColor=vec4(base*(.62+.35*uSun.y),uFade*(1.-smoothstep(.75,1.,d)));}`});
  const pl=new T.Mesh(new T.PlaneGeometry(1500,1500),m);pl.rotation.x=-Math.PI/2;S.add(pl);
  /* bacteria, rods and cocci, scattered (denser near the centre) */
  const bm=bodyMat({col:"#a8c06a",col2:"#e2e8a0",amb:.35,rimK:.4,nz:.5,nzF:6});
  const N=NQ(150);const g=capsule(.38,1.6,12);const im=new T.InstancedMesh(g,bm,N);const M=new T.Matrix4(),Qt=new T.Quaternion(),Sc=V3(1,1,1);
  for(let i=0;i<N;i++){let x,z;if(i==0){x=BACC[0]/UM;z=0;}else{const r=4+Math.pow(R(),.9)*160;const a=R()*TAU;x=Math.cos(a)*r;z=Math.sin(a)*r;}
    if(i>0&&Math.abs(x-HAIR_X)<40)x+=80;
    Qt.setFromAxisAngle(UP,i==0?0:R()*TAU);const sc=i==0?1:.6+R()*.9;Sc.set(i==0?1.27:sc,1,1);
    M.compose(V3(x,.4,z),Qt,Sc);im.setMatrixAt(i,M);}
  im.frustumCulled=false;S.add(im);
  /* the hair */
  const hm=new T.ShaderMaterial({transparent:true,uniforms:{uFade:{value:1},uSun:{value:SUN}},
    vertexShader:`varying vec3 vN;varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform float uFade;uniform vec3 uSun;varying vec3 vN;varying vec3 vW;${NOISE}
    void main(){vec3 N=normalize(vN);float z=vW.z;float ang=atan(N.y,N.x);
      float sc=fract(z/7.+.35*snoise(vec3(ang*2.,z*.05,0.))+.08*sin(ang*5.));float ridge=smoothstep(.0,.12,sc)*(1.-smoothstep(.85,1.,sc));
      vec3 base=vec3(.28,.17,.1)*(.75+.35*ridge)+vec3(.05,.03,.02)*snoise(vec3(vW*.3));
      float l=max(dot(N,normalize(uSun)),0.);vec3 V=normalize(cameraPosition-vW);vec3 H=normalize(normalize(uSun)+V);
      float sp=pow(max(dot(N,H),0.),30.)*.35*ridge;
      gl_FragColor=vec4(base*(.3+.8*l)+vec3(sp),uFade);}`});
  const hg=new T.CylinderGeometry(35,35,3000,40,60);hg.rotateX(Math.PI/2);
  const hair=new T.Mesh(hg,hm);hair.position.set(HAIR_X,35,0);S.add(hair);
  S.label("skin cells (corneocytes)",V3(-22,0,-14),-5.3,-4.1);S.label("bacteria",V3(-6,.5,8),-5.6,-4.7);S.label("hair",V3(HAIR_X,72,-30),-4.6,-3.6);
  return{};}});

/* ======================================================================
   SCENE 8 — skin surface, hair, sand grain and ant (unit mm). Origin at skin.
   ====================================================================== */
const ANT_C=V3(-2.3,0,1.7);
scene({id:"macro",s:-3,O:SKIN,build(S){
  const R=rng(41);
  const m=new T.ShaderMaterial({transparent:true,extensions:{derivatives:true},uniforms:{uFade:{value:1},uSun:{value:SUN}},
    vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform float uFade;uniform vec3 uSun;varying vec3 vW;${NOISE}
    void main(){vec2 p=vW.xz;float fw=fwidth(p.x);
      vec2 q=p+vec2(snoise(vec3(p*.15,1.)),snoise(vec3(p*.15,5.)))*.6;
      vec3 v=voro(q/.75);float furrow=(1.-smoothstep(.0,.09,v.x))*(1.-smoothstep(.04,.3,fw));
      vec3 v2=voro(q/.032+3.);float cell=(1.-smoothstep(0.,.1,v2.x))*(1.-smoothstep(.0008,.004,fw));
      float n=fbm3(vec3(p*.08,0.));float n2=snoise(vec3(p*.6,3.));
      vec3 base=vec3(.82,.62,.52)*(.9+.08*n+.04*n2)+vec3(.04,.03,.03)*v.y;
      base=mix(base,vec3(.62,.44,.38),furrow*.55);base*=1.-cell*.18;
      float vein=smoothstep(.55,.7,abs(snoise(vec3(p.x*.03,p.y*.012,9.))));base=mix(base,vec3(.6,.55,.62),(1.-vein)*.06*smoothstep(5.,20.,length(p)));
      float d=length(p)/120.;gl_FragColor=vec4(base*(.62+.35*uSun.y),uFade*(1.-smoothstep(.8,1.,d)));}`});
  const pl=new T.Mesh(new T.PlaneGeometry(260,260),m);pl.rotation.x=-Math.PI/2;S.add(pl);
  /* hairs: thin dark cylinders lying almost flat, pointing roughly towards the fingers (+Z) */
  const N=NQ(520);const hg=new T.CylinderGeometry(.035,.025,1,6,1);hg.translate(0,.5,0);
  const hmat=bodyMat({col:"#5a3a24",col2:"#7a5232",amb:.35,rimK:.4,rim:"#c09870",spec:.3});
  const im=new T.InstancedMesh(hg,hmat,N);const M=new T.Matrix4(),Qt=new T.Quaternion(),Sc=V3();
  for(let i=0;i<N;i++){let x,z,len,dir;
    if(i==0){x=HAIR_X/1000;z=-4.5;len=11;dir=V3(0,.02,1).normalize();}
    else{const r=Math.sqrt(R())*60;const a=R()*TAU;x=Math.cos(a)*r;z=Math.sin(a)*r;len=4+R()*9;if(Math.hypot(x,z)<1.2){x+=2.5;}
      dir=V3((R()-.5)*.6,.02+R()*.07,1).normalize();}
    Qt.setFromUnitVectors(UP,dir);Sc.set(1,len,1);M.compose(V3(x,.03,z),Qt,Sc);im.setMatrixAt(i,M);}
  im.frustumCulled=false;S.add(im);
  /* sand grains (jittered icosahedra, quartz) */
  const sandM=bodyMat({col:"#d9c49a",col2:"#f4ead2",amb:.4,rimK:.6,rim:"#fff6e0",spec:.6,nz:.6,nzF:9});
  const grains=[[-.32,.27,.19],[1.4,.12,-.9],[-1.1,.09,-1.6],[.9,.16,2.3],[-3.4,.2,-.4]];
  grains.forEach((gr,i)=>{const g=new T.IcosahedronGeometry(1,2);const P=g.attributes.position;const RR=rng(100+i);
    const keys={};for(let k=0;k<P.count;k++){const key=P.getX(k).toFixed(3)+P.getY(k).toFixed(3)+P.getZ(k).toFixed(3);if(!keys[key])keys[key]=.8+RR()*.35;const s=keys[key];P.setXYZ(k,P.getX(k)*s,P.getY(k)*s*.8,P.getZ(k)*s);}
    g.computeVertexNormals();const me=new T.Mesh(g,sandM);me.scale.setScalar(gr[1]);me.position.set(gr[0],gr[1]*.75,gr[2]);me.rotation.set(RR()*3,RR()*3,RR()*3);S.add(me);});
  /* the ant (schematic body plan, ~6 mm) */
  const ant=new T.Group();const am=bodyMat({col:"#2a1510",col2:"#5a2a1a",amb:.25,rimK:.5,rim:"#c08060",spec:.9,nz:.3,nzF:3});
  const pt=(x,y,z)=>V3(x,y,z);
  const body=[ellipsoid(.62,.52,.55),ellipsoid(.95,.36,.32),ellipsoid(.2,.26,.18),ellipsoid(1.05,.78,.82)];
  const bp=[pt(2.4,.62,0),pt(.95,.62,0),pt(-.25,.6,0),pt(-1.45,.7,0)];
  body.forEach((g,i)=>{const me=new T.Mesh(g,am);me.position.copy(bp[i]);if(i==3)me.rotation.z=.25;ant.add(me);});
  const legs=[];for(let k=0;k<3;k++)for(let sdx=-1;sdx<=1;sdx+=2){const root=pt(1.35-k*.55,.5,sdx*.22);
    const knee=pt(1.35-k*.55+(k-1)*.9,.95,sdx*1.3);const foot=pt(1.35-k*.55+(k-1)*1.7,0,sdx*2.0);
    const lg=new T.Group();lg.add(new T.Mesh(mergeGeos([cyl(root,knee,.07,.06,6),cyl(knee,foot,.06,.04,6)]),am));lg.userData={k,s:sdx,root};ant.add(lg);legs.push(lg);}
  for(let sdx=-1;sdx<=1;sdx+=2){ant.add(new T.Mesh(mergeGeos([cyl(pt(2.8,.9,sdx*.2),pt(3.4,1.6,sdx*.45),.04,.035,5),cyl(pt(3.4,1.6,sdx*.45),pt(4.4,1.2,sdx*.9),.035,.03,5)]),am));
    ant.add(new T.Mesh(mergeGeos([cyl(pt(2.9,.4,sdx*.18),pt(3.15,.25,sdx*.06),.06,.03,5)]),am));}
  ant.scale.setScalar(.95);ant.position.copy(ANT_C);S.add(ant);
  const antL=S.label("ant",V3(),-2.6,-1.3);
  S.label("grain of sand",V3(-.32,.5,.19),-3.4,-2.3);S.label("hair",V3(.05,.1,-2),-3.7,-3.0);S.label("skin furrows",V3(4,0,-3),-2.4,-1.5);
  return{update(L,t){const a=t*.12;ant.position.set(ANT_C.x+Math.cos(a)*1.2,0,ANT_C.z+Math.sin(a)*1.2);ant.rotation.y=-a-Math.PI;
    legs.forEach(l=>{const ph=((l.userData.k%2)^(l.userData.s>0?1:0))?0:Math.PI;l.rotation.y=.25*Math.sin(t*9+ph);l.position.y=.05*Math.max(0,Math.sin(t*9+ph));});
    antL.pos.copy(ant.position).add(V3(0,1.5,0));}};}});

/* ======================================================================
   SCENE 9 — hand, person, houses, block (unit m). Origin at the back of the hand.
   ====================================================================== */
const ROADZ=k=>6.5+110*k,ROADX=k=>62+140*k;
const GLSL_TOWN=`
float roadMask(vec2 p){ /* p in metres, x east, y=z south */
  float rz=abs(mod(p.y-6.5+55.,110.)-55.);float rx=abs(mod(p.x-62.+70.,140.)-70.);
  return max(1.-smoothstep(4.,4.6,rz),1.-smoothstep(4.,4.6,rx));}
float walkMask(vec2 p){float rz=abs(mod(p.y-6.5+55.,110.)-55.);float rx=abs(mod(p.x-62.+70.,140.)-70.);
  return max(smoothstep(4.6,4.8,rz)*(1.-smoothstep(6.2,6.4,rz)),smoothstep(4.6,4.8,rx)*(1.-smoothstep(6.2,6.4,rx)));}
`;
scene({id:"ground",s:0,O:[0,0,0],build(S){
  const R=rng(51);const GY=GROUND[1];
  const light=new T.DirectionalLight(0xfff4e6,1.0);light.position.copy(SUN);S.scene.add(light);
  S.scene.add(new T.HemisphereLight(0xbcd4ff,0x6a5a40,.55));
  const lam=(c,o)=>{const m=new T.MeshLambertMaterial(Object.assign({color:c,transparent:true},o||{}));return m;};
  /* ground */
  const TOWN_R=MOB?480:760;
  const gm=new T.ShaderMaterial({transparent:true,extensions:{derivatives:true},uniforms:{uFade:{value:1},uSun:{value:SUN}},
    vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform float uFade;uniform vec3 uSun;varying vec3 vW;${NOISE}${GLSL_TOWN}
    void main(){vec2 p=vW.xz;float fw=fwidth(p.x);
      float n=fbm3(vec3(p*.05,0.)),n2=snoise(vec3(p*.7,1.))*(1.-smoothstep(.05,.5,fw)),n3=snoise(vec3(p*6.,2.))*(1.-smoothstep(.005,.06,fw));
      vec3 grass=vec3(.30,.42,.18)*(.85+.25*n+.08*n2+.06*n3);
      vec3 col=grass;
      float rd=roadMask(p),wk=walkMask(p);
      col=mix(col,vec3(.62,.61,.58),wk);col=mix(col,vec3(.24,.24,.26)*(.95+.05*n2),rd);
      float rz=abs(mod(p.y-6.5+55.,110.)-55.);float dash=step(.5,fract(p.x/6.))*(1.-smoothstep(.08,.14,rz))*(1.-smoothstep(.1,.6,fw));col=mix(col,vec3(.9,.82,.4),dash*rd*.8);
      /* driveways */
      float lot=mod(p.x+66.,20.)-10.;float dz=mod(p.y-6.5+55.,110.)-55.;float dw=(1.-smoothstep(1.6,1.8,abs(lot-6.)))*step(4.6,abs(dz))*(1.-step(14.,abs(dz)));col=mix(col,vec3(.55,.54,.52),dw*(1.-rd));
      float d=length(p);col=mix(col,vec3(.45,.47,.32),smoothstep(${(TOWN_R*.8).toFixed(1)},${(TOWN_R*1.6).toFixed(1)},d)*.6);
      float edge=1.-smoothstep(1400.,2000.,d);
      gl_FragColor=vec4(col*(.55+.45*uSun.y),uFade*edge);}`});
  const gp=new T.Mesh(new T.PlaneGeometry(4200,4200),gm);gp.rotation.x=-Math.PI/2;gp.position.y=GY;S.add(gp);
  /* houses */
  const houses=[];
  for(let kz=-8;kz<=8;kz++){const zr=ROADZ(kz);for(let kx=-6;kx<=6;kx++){const x0=ROADX(kx)+12-140;
    for(let lot=0;lot<6;lot++){const xc=x0+10+lot*20;for(let side=-1;side<=1;side+=2){
      const d=8+R()*4,w=10+R()*5,h=3+R()*3.5;const set=side<0?(xc===4?10:8+R()*4):8+R()*4;
      const zc=zr+side*(4.5+set+d/2);if(Math.hypot(xc,zc)>TOWN_R*(.85+.3*R()))continue;if(R()<.06)continue;
      houses.push({x:xc,z:zc,w,d,h,rot:side<0?0:Math.PI,hue:R()});}}}}
  const hb=new T.BoxGeometry(1,1,1);hb.translate(0,.5,0);
  const roof=(function(){const v=[[-.5,0,-.5],[-.5,0,.5],[-.5,1,0],[.5,0,-.5],[.5,0,.5],[.5,1,0]];const f=[[0,1,2],[3,5,4],[0,2,5],[0,5,3],[1,4,5],[1,5,2],[0,3,4],[0,4,1]];
    const a=[];f.forEach(t=>t.forEach(i=>a.push(...v[i])));const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(a,3));g.computeVertexNormals();return g;})();
  const wallM=lam(0xffffff),roofM=lam(0xffffff);
  const iw=new T.InstancedMesh(hb,wallM,houses.length),ir=new T.InstancedMesh(roof,roofM,houses.length);
  const M=new T.Matrix4(),Qt=new T.Quaternion(),Sc=V3(),col=new T.Color();
  houses.forEach((h,i)=>{Qt.setFromAxisAngle(UP,h.rot);Sc.set(h.w,h.h,h.d);M.compose(V3(h.x,GY,h.z),Qt,Sc);iw.setMatrixAt(i,M);
    col.setHSL(.08+h.hue*.08,.25+.2*h.hue,.62+.2*R());iw.setColorAt(i,col);
    Sc.set(h.w*1.06,2.2+h.hue*1.6,h.d*1.12);M.compose(V3(h.x,GY+h.h,h.z),Qt,Sc);ir.setMatrixAt(i,M);
    col.setHSL(R()<.5?.02+R()*.04:.58+R()*.05,.25+R()*.2,.25+R()*.15);ir.setColorAt(i,col);});
  iw.frustumCulled=ir.frustumCulled=false;S.add(iw);S.add(ir);
  /* trees */
  const NT=NQ(2600);const crown=new T.IcosahedronGeometry(1,1);const trunk=new T.CylinderGeometry(.12,.18,1,6);trunk.translate(0,.5,0);
  const ic=new T.InstancedMesh(crown,lam(0xffffff),NT),it=new T.InstancedMesh(trunk,lam(0x5a4230),NT);let n=0;
  for(let i=0;i<NT*3&&n<NT;i++){const r=Math.sqrt(R())*TOWN_R*1.1;const a=R()*TAU;let x=Math.cos(a)*r,z=Math.sin(a)*r;if(n<6){x=[-9,14,-16,20,-4,8][n];z=[-2,-5,-12,1,-24,-20][n];}
    const rz=Math.abs(((z-6.5)%110+165)%110-55),rx=Math.abs(((x-62)%140+210)%140-70);if(rz<8||rx<8)continue;
    let inH=false;for(let k=0;k<houses.length&&!inH;k+=1){const h=houses[k];if(Math.abs(h.x-x)<h.w/2+2&&Math.abs(h.z-z)<h.d/2+2)inH=true;}if(inH)continue;
    if(Math.hypot(x-.18,z+.55)<3)continue;
    const s=2+R()*3.5,th=1.5+R()*2.5;M.compose(V3(x,GY,z),Qt.identity(),Sc.set(1,th,1));it.setMatrixAt(n,M);
    M.compose(V3(x,GY+th+s*.6,z),Qt.setFromAxisAngle(UP,R()*6),Sc.set(s,s*1.15,s));ic.setMatrixAt(n,M);col.setHSL(.22+R()*.1,.4+R()*.2,.28+R()*.12);ic.setColorAt(n,col);n++;}
  ic.count=it.count=n;ic.frustumCulled=it.frustumCulled=false;S.add(ic);S.add(it);
  /* cars */
  const NC=NQ(120);const car=new T.BoxGeometry(4.4,1.4,1.8);car.translate(0,.7,0);const icar=new T.InstancedMesh(car,lam(0xffffff),NC);
  for(let i=0;i<NC;i++){const alongX=R()<.6;let x,z;if(alongX){z=ROADZ(Math.round((R()-.5)*10))+(R()<.5?-2:2);x=(R()-.5)*TOWN_R*1.6;}else{x=ROADX(Math.round((R()-.5)*8))+(R()<.5?-2:2);z=(R()-.5)*TOWN_R*1.6;}
    if(Math.hypot(x,z)<14){x+=40;}M.compose(V3(x,GY,z),Qt.setFromAxisAngle(UP,alongX?0:Math.PI/2),Sc.set(1,1,1));icar.setMatrixAt(i,M);col.setHSL(R(),.5*R(),.25+.5*R());icar.setColorAt(i,col);}
  icar.frustumCulled=false;S.add(icar);
  /* the person: facing south (+Z), right arm held out with the back of the hand up */
  const skin=lam(0xd29c80),shirt=lam(0x3f6ea8),jeans=lam(0x2c3550),shoe=lam(0x2a2420),hairM=lam(0x3a2618);
  const P=V3(PERSON[0],GY,PERSON[2]); /* feet centre */
  const add=(g,m)=>{const me=new T.Mesh(g,m);S.add(me);return me;};
  add(mergeGeos([cyl(V3(P.x-.1,GY+.05,P.z),V3(P.x-.1,GY+.86,P.z),.075,.065,12),cyl(V3(P.x+.1,GY+.05,P.z),V3(P.x+.1,GY+.86,P.z),.075,.065,12)]),jeans);
  add(mergeGeos([cyl(V3(P.x-.1,GY,P.z+.03),V3(P.x-.1,GY+.08,P.z+.03),.06,.07,10),cyl(V3(P.x+.1,GY,P.z+.03),V3(P.x+.1,GY+.08,P.z+.03),.06,.07,10)]),shoe);
  const torso=new T.Mesh(capsule(.16,.32,20),shirt);torso.rotation.z=Math.PI/2;torso.scale.set(1,1.18,.72);torso.position.set(P.x,GY+1.17,P.z);S.add(torso);
  add(cyl(V3(P.x,GY+1.4,P.z),V3(P.x,GY+1.52,P.z),.05,.05,10),skin);
  const head=add(ellipsoid(.095,.12,.105,24),skin);head.position.set(P.x,GY+1.62,P.z+.01);
  const hairC=add(ellipsoid(.1,.08,.11,20),hairM);hairC.position.set(P.x,GY+1.68,P.z-.01);
  const shR=V3(P.x-.175,GY+1.41,P.z),shL=V3(P.x+.175,GY+1.41,P.z);
  const wrist=V3(0,-.012,-.07);const elbow=V3(-.08,.16,-.33);
  /* ball joints close the gaps where the arm cylinders meet the torso and each other */
  const ball=(c,r,seg)=>{const g=new T.SphereGeometry(r,seg||14,10);g.translate(c.x,c.y,c.z);return g;};
  add(mergeGeos([ball(shR,.058),cyl(shR,elbow,.054,.045,14),ball(elbow,.046),cyl(elbow,wrist,.045,.033,14)]),shirt);
  add(mergeGeos([cyl(V3(-.07,.13,-.29),wrist,.04,.03,10),ball(wrist,.031,12)]),skin);
  const elL=V3(shL.x+.06,GY+1.13,P.z+.02),wrL=V3(shL.x+.08,GY+.86,P.z+.06);
  add(mergeGeos([ball(shL,.058),cyl(shL,elL,.054,.045,14),ball(elL,.046),cyl(elL,wrL,.045,.035,14)]),shirt);
  const hL=add(ellipsoid(.04,.085,.025,12),skin);hL.position.set(wrL.x,wrL.y-.07,wrL.z);
  /* right hand: back of the hand faces +Y, top surface at y=0 through the origin; fingers to +Z */
  const pg=new T.SphereGeometry(1,40,24);{const P=pg.attributes.position;for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i);
    const sp=(v,e)=>Math.sign(v)*Math.pow(Math.abs(v),e);P.setXYZ(i,sp(x,.55)*.043,(y>0?Math.pow(y,.5)*.012:y*.011)*(1-.25*z*z),sp(z,.6)*.05);}pg.computeVertexNormals();}
  const palm=add(pg,skin);palm.position.set(0,-.012,0);
  const fingers=[];[-.03,-.01,.01,.03].forEach((x,i)=>{const L0=[.072,.083,.078,.062][i];const k=V3(x,-.009,.044);const m=V3(x*1.06,-.014,.044+L0*.55),b=V3(x*1.1,-.024,.044+L0);
    const kn=new T.SphereGeometry(.0104,20,14);kn.translate(k.x,k.y,k.z);fingers.push(kn);fingers.push(cyl(k,m,.0098,.009,18));
    const j=new T.SphereGeometry(.0091,18,12);j.translate(m.x,m.y,m.z);fingers.push(j);fingers.push(cyl(m,b,.009,.008,18));
    const tip=new T.SphereGeometry(.008,18,12);tip.translate(b.x,b.y,b.z);fingers.push(tip);});
  /* thumb: starts inside the palm edge with a joint ball so there is no visible seam */
  {const tb=new T.SphereGeometry(.0135,12,10);tb.translate(.034,-.015,-.024);fingers.push(tb);}
  fingers.push(cyl(V3(.03,-.014,-.03),V3(.062,-.026,.018),.0135,.011,12));fingers.push(cyl(V3(.062,-.026,.018),V3(.074,-.032,.05),.011,.0095,10));
  {const tp=new T.SphereGeometry(.0095,10,8);tp.translate(.074,-.032,.05);fingers.push(tp);const tj=new T.SphereGeometry(.011,10,8);tj.translate(.062,-.026,.018);fingers.push(tj);}
  fingers.push(cyl(V3(0,-.013,-.045),V3(0,-.014,-.075),.026,.024,16));
  add(mergeGeos(fingers),skin);
  S.label("hand",V3(-.03,.04,.12),-1.25,-.35);S.label("person",V3(P.x,GY+1.95,P.z),-.3,.85);S.label("house",V3(4,GY+10,ROADZ(0)-4.5-10-5),.5,1.8);
  S.label("street",V3(22,GY,ROADZ(0)),.7,1.9);S.label("city block",V3(ROADX(0)-70,GY+2,ROADZ(0)+55),1.6,2.8);
  return{};}});

/* ======================================================================
   SCENE 10 — landscape: town, valley, mountain range (unit km). Origin at ground level.
   Procedural terrain loosely evoking a Rocky-Mountain valley town (not a real map).
   ====================================================================== */
const GLSL_TERRAIN=`
float terrH(vec2 p){ /* km; x east, y = z south */
  float r=length(p);
  float band=smoothstep(7.,13.,p.x)*(1.-smoothstep(34.,56.,p.x));
  float rid=ridged(vec3(p.x*.07,p.y*.035,1.3));
  float h=band*(.55+1.6*rid);
  float hills=smoothstep(5.,30.,r)*(.18*fbm3(vec3(p*.06,7.))+.12);
  float far=smoothstep(40.,110.,r)*(.9*ridged(vec3(p*.012,4.))+.25*fbm3(vec3(p*.03,2.)));
  h+=max(hills,0.)+far;
  vec2 lk=(p-vec2(-15.,16.))*vec2(1.,.62);float lake=1.-smoothstep(7.,9.,length(lk)+1.6*fbm3(vec3(p*.18,2.)));
  h=mix(h,-.03,lake);
  h*=smoothstep(4.5,9.,r);
  return h;}
`;
scene({id:"land",s:3,O:GROUND,build(S){
  const RMAX=1100;const NR=MOB?150:230,NA=MOB?160:256;
  const pos=[],idx=[];pos.push(0,0,0);
  for(let i=1;i<=NR;i++){const r=.004*Math.pow(RMAX/.004,i/NR);for(let j=0;j<NA;j++){const a=j/NA*TAU;pos.push(Math.cos(a)*r,0,Math.sin(a)*r);}}
  for(let j=0;j<NA;j++)idx.push(0,1+(j+1)%NA,1+j);
  for(let i=1;i<NR;i++)for(let j=0;j<NA;j++){const a=1+(i-1)*NA+j,b=1+(i-1)*NA+(j+1)%NA,c=a+NA,d=b+NA;idx.push(a,b,c,b,d,c);}
  const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(pos,3));g.setIndex(idx);
  const m=new T.ShaderMaterial({transparent:true,extensions:{derivatives:true},uniforms:{uFade:{value:1},uSun:{value:SUN},uCam:{value:V3()}},
    vertexShader:`${NOISE}${GLSL_TERRAIN}varying vec3 vW;varying float vH;
      void main(){vec3 p=position;float h=terrH(p.xz);vH=h;float r2=dot(p.xz,p.xz);p.y=h-r2/(2.*6371.);
        vec4 w=modelMatrix*vec4(p,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform float uFade;uniform vec3 uSun;varying vec3 vW;varying float vH;${NOISE}${GLSL_TOWN}
    void main(){vec2 p=vW.xz;float fw=fwidth(p.x);vec3 dx=dFdx(vW),dy=dFdy(vW);vec3 N=normalize(cross(dx,dy));if(N.y<0.)N=-N;
      float r=length(p);float h=vH;
      /* valley fields */
      vec2 fc=floor(p*vec2(2.2,1.6)+vec2(snoise(vec3(p*.2,1.)),0.)*.4);float fh=hash1(fc);
      vec3 field=mix(vec3(.36,.42,.2),vec3(.55,.5,.32),fh)*(.85+.15*snoise(vec3(p*3.,4.)));
      vec3 sage=vec3(.48,.46,.33)*(.85+.2*fbm3(vec3(p*.3,5.)));
      vec3 col=mix(field,sage,smoothstep(10.,30.,r));
      /* town: streets and roofs inside ~5 km */
      vec2 pm=p*1000.;float town=1.-smoothstep(3.2,5.5,r+1.2*snoise(vec3(p*.25,8.)));
      float rd=roadMask(pm)*(1.-smoothstep(.002,.02,fw));float lot=hash1(floor(vec2((pm.x+66.)/20.,(pm.y-6.5)/27.5)));
      vec3 tcol=mix(vec3(.34,.42,.24),mix(vec3(.55,.42,.36),vec3(.7,.68,.64),lot),step(.45,lot)*.7);
      tcol=mix(tcol,vec3(.40,.44,.36),smoothstep(.02,.08,fw));
      col=mix(col,mix(tcol,vec3(.25,.25,.27),rd),town);
      /* slopes, forest, rock, snow */
      float slope=1.-N.y;float n=fbm3(vec3(p*.4,3.));
      vec3 forest=vec3(.18,.26,.15)*(.8+.3*n);vec3 rock=vec3(.47,.44,.41)*(.85+.25*n);
      col=mix(col,forest,smoothstep(.25,.5,h+.2*n)*(1.-smoothstep(1.6,2.1,h)));
      col=mix(col,rock,smoothstep(.35,.7,slope+.1*n)*smoothstep(.2,.6,h));
      float snow=smoothstep(1.75,2.0,h+.3*n-slope*.6);col=mix(col,vec3(.93,.94,.97),snow);
      /* lake */
      vec2 lk=(p-vec2(-15.,16.))*vec2(1.,.62);float lake=1.-smoothstep(7.,7.4,length(lk)+1.6*fbm3(vec3(p*.18,2.)));col=mix(col,vec3(.12,.24,.33),lake);
      /* far: arid basin colours, to match the globe */
      vec3 arid=mix(vec3(.6,.52,.4),vec3(.45,.42,.32),fbm3(vec3(p*.01,9.))*.5+.5);col=mix(col,arid,smoothstep(70.,250.,r)*(1.-snow*.7));
      float l=max(dot(N,normalize(uSun)),0.);vec3 lit=col*(.38+.75*l);
      float haze=smoothstep(30.,600.,length(vW-cameraPosition));lit=mix(lit,vec3(.55,.66,.8),haze*.35);
      gl_FragColor=vec4(lit,uFade*(1.-smoothstep(.55*${RMAX}.,.95*${RMAX}.,r)));}`});
  S.add(new T.Mesh(g,m));
  S.label("town",V3(0,.3,0),2.7,4.4);S.label("mountain range",V3(24,2.6,-6),3.8,5.6);S.label("lake",V3(-15,.2,16),3.8,5.1);S.label("you are here",V3(0,0,0),4.4,5.8,"here");
  return{};}});

/* ======================================================================
   SKY — distant stars and the Milky Way band, drawn at infinity (orientation only)
   ====================================================================== */
const SKY=(function(){const S=mkCtx({id:"sky"});const R=rng(77);
  const b=PB(NQ(6000)+NQ(9000));
  for(let i=0;i<NQ(6000);i++){const u=2*R()-1,t=R()*TAU,s=Math.sqrt(1-u*u);const w=Math.pow(R(),3)*.9+.1;const warm=R()<.35;
    pa(b,s*Math.cos(t)*100,u*100,s*Math.sin(t)*100,w,w*(warm?.85:.95),w*(warm?.72:1),w>.7?2.0:1.2);}
  for(let i=0;i<NQ(9000);i++){let l=(R()*360),bb=gauss(R)*4*(1+.6*Math.cos(l*DEG));if(R()<.5)l=gauss(R)*40;const d=galDir(l,bb);const w=.08+.12*R()*(1+Math.cos(l*DEG));
    pa(b,d.x*100,d.y*100,d.z*100,w,w*.93,w*.85,1.6);}
  S.add(pObj(b,{fixed:true,minPx:1,dim:1}));
  const cam=new T.PerspectiveCamera(FOV,1,1,1000);return{S,cam};})();

/* ======================================================================
   SCENE 11 — Earth, satellites and Moon (unit Mm = 1000 km). Origin at Earth's centre.
   ====================================================================== */
function landTexture(){const L=window.EARTH_LAND;if(!L)return null;const bin=atob(L.b64);const W=L.w,H=L.h;const data=new Uint8Array(W*H);
  for(let i=0;i<W*H;i++)data[i]=(bin.charCodeAt(i>>3)>>(i&7))&1?255:0;
  /* soften the coast a little */
  /* distance from the coast (chamfer transform, x scaled by cos latitude) drives a rough dryness map */
  const D=new Float32Array(W*H);for(let i=0;i<W*H;i++)D[i]=data[i]?1e9:0;
  const cx=y=>Math.max(.05,Math.cos((90-(y+.5)*180/H)*DEG));
  for(let y=0;y<H;y++){const c=cx(y),dg=Math.hypot(c,1);for(let x=0;x<W;x++){const i=y*W+x;if(!D[i])continue;let v=D[i];
    v=Math.min(v,D[y*W+(x-1+W)%W]+c);if(y>0){v=Math.min(v,D[(y-1)*W+x]+1,D[(y-1)*W+(x-1+W)%W]+dg,D[(y-1)*W+(x+1)%W]+dg);}D[i]=v;}}
  for(let y=H-1;y>=0;y--){const c=cx(y),dg=Math.hypot(c,1);for(let x=W-1;x>=0;x--){const i=y*W+x;if(!D[i])continue;let v=D[i];
    v=Math.min(v,D[y*W+(x+1)%W]+c);if(y<H-1){v=Math.min(v,D[(y+1)*W+x]+1,D[(y+1)*W+(x-1+W)%W]+dg,D[(y+1)*W+(x+1)%W]+dg);}D[i]=v;}}
  const kmPx=20015/H;
  const out=new Uint8Array(W*H*2);for(let y=0;y<H;y++)for(let x=0;x<W;x++){let s=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const yy=clamp(y+dy,0,H-1),xx=(x+dx+W)%W;s+=data[yy*W+xx];}
    const i=y*W+x;out[i*2]=s/9;out[i*2+1]=Math.min(255,D[i]*kmPx/2000*255);}
  const t=new T.DataTexture(out,W,H,T.LuminanceAlphaFormat,T.UnsignedByteType);t.magFilter=T.LinearFilter;t.minFilter=T.LinearFilter;t.wrapS=T.RepeatWrapping;t.flipY=false;t.needsUpdate=true;return t;}
const EARTH_GLSL=`uniform sampler2D tLand;uniform vec3 uAxN,uM,uE;uniform float uLon0;
vec2 geo(vec3 d){float lat=asin(clamp(dot(d,uAxN),-1.,1.));float lon=uLon0+atan(dot(d,uE),dot(d,uM));return vec2(lon,lat);}
vec2 landAt(vec2 ll){vec2 uv=vec2(fract(ll.x/6.2831853+.5),.5-ll.y/3.14159265);vec4 t=texture2D(tLand,uv);return vec2(t.r,t.a);}
`;
scene({id:"earth",s:6,O:P_EARTH,build(S){
  const tex=landTexture();const R=rng(91);
  const M0=UP.clone().sub(AXN.clone().multiplyScalar(UP.dot(AXN))).normalize();const E0=AXN.clone().cross(M0).normalize();
  const uni={tLand:{value:tex},uAxN:{value:AXN},uM:{value:M0},uE:{value:E0},uLon0:{value:LON},uSun:{value:SUN},uFade:{value:1},uTime:U.time};
  const em=new T.ShaderMaterial({transparent:true,extensions:{derivatives:true},uniforms:uni,
    vertexShader:`varying vec3 vD;varying vec3 vW;void main(){vD=normalize(position);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform vec3 uSun;uniform float uFade,uTime;varying vec3 vD;varying vec3 vW;${NOISE}${EARTH_GLSL}
    void main(){vec3 d=normalize(vD);vec2 ll=geo(d);float lat=ll.y;
      float nz=fbm5(d*14.);float nz2=snoise(d*60.);float fw=length(fwidth(d));float fine=(1.-smoothstep(.002,.02,fw));
      vec2 la=landAt(ll);float land=smoothstep(.5,.62,la.x+nz*.18+nz2*.06*fine);float dist=la.y;
      float alat=abs(lat)/1.5708;
      float sub=smoothstep(.12,.25,alat)*(1.-smoothstep(.38,.48,alat));float cont=smoothstep(.08,.45,dist)*(1.-smoothstep(.55,.7,alat));
      float wet=1.-smoothstep(.06,.16,alat);
      float dry=clamp(max(sub*.85,cont*.8)*(1.-wet)+.22*fbm3(d*5.+3.)+.1*snoise(d*40.),0.,1.);
      vec3 green=vec3(.16,.30,.12),olive=vec3(.40,.40,.24),tan=vec3(.66,.55,.39),boreal=vec3(.17,.23,.15),tundra=vec3(.42,.42,.36);
      vec3 lc=dry<.5?mix(green,olive,dry*2.):mix(olive,tan,dry*2.-1.);
      float rug=ridged(d*80.)*fine;lc*=.8+.35*rug;lc=mix(lc,boreal,smoothstep(.55,.65,alat));lc=mix(lc,tundra,smoothstep(.68,.76,alat));
      lc*=.85+.3*nz;
      float ice=smoothstep(.76,.8,alat+nz*.05)*step(.5,land)+smoothstep(.86,.9,alat);
      vec3 ocean=mix(vec3(.02,.07,.17),vec3(.03,.13,.25),.5+.5*nz);
      vec3 col=mix(ocean,lc,land);col=mix(col,vec3(.92,.94,.97),clamp(ice,0.,1.));
      float cl=fbm5(d*6.+vec3(uTime*.004,0.,0.));cl=smoothstep(.05,.45,cl+.15*sin(lat*6.));
      vec3 N=d;vec3 L=normalize(uSun);float l=dot(N,L);float day=smoothstep(-.08,.2,l);
      vec3 V=normalize(cameraPosition-vW);vec3 H=normalize(L+V);float glint=pow(max(dot(N,H),0.),60.)*(1.-land)*(1.-cl)*.6;
      vec3 lit=col*(.03+max(l,0.)*1.05)+vec3(glint)*day;
      lit=mix(lit,vec3(1.)*(.04+max(l,0.)),cl*.85);
      float city=step(.5,land)*(1.-ice)*smoothstep(.55,.8,snoise(d*90.)*.5+.5+snoise(d*20.)*.3)*(1.-day)*(1.-cl);lit+=vec3(1.,.75,.4)*city*.5;
      float fr=pow(1.-max(dot(N,V),0.),3.);lit=mix(lit,vec3(.35,.6,1.)*(.2+.8*day),fr*.6*smoothstep(-.3,.2,l));
      gl_FragColor=vec4(lit,uFade);}`});
  const seg=MOB?160:256;
  const earth=new T.Mesh(new T.SphereGeometry(6.371,seg,seg/2),em);S.add(earth);
  const atm=new T.Mesh(new T.SphereGeometry(6.371*1.022,96,64),new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.BackSide,
    uniforms:{uSun:{value:SUN},uFade:{value:1}},vertexShader:`varying vec3 vN;varying vec3 vW;void main(){vN=normalize(position);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform vec3 uSun;uniform float uFade;varying vec3 vN;varying vec3 vW;void main(){vec3 V=normalize(cameraPosition-vW);float d=dot(normalize(vN),V);
      float a=pow(clamp(-d*1.0+.0,0.,1.),.5);float rim=smoothstep(0.,.35,-d)*(1.-smoothstep(.35,.9,-d));
      float lit=smoothstep(-.35,.3,dot(normalize(vN),normalize(uSun)));gl_FragColor=vec4(vec3(.35,.62,1.),rim*lit*uFade*.9);}`}));
  S.add(atm);
  /* satellites: LEO swarm, GPS, geostationary belt */
  const sb=PB(NQ(3000)+24+80);
  const eqN=AXN;const eqA=SUN.clone().sub(AXN.clone().multiplyScalar(SUN.dot(AXN))).normalize();const eqB=eqN.clone().cross(eqA);
  const orbitPt=(r,inc,raan,u)=>{const node=eqA.clone().multiplyScalar(Math.cos(raan)).add(eqB.clone().multiplyScalar(Math.sin(raan)));
    const perp=eqN.clone().cross(node);const inPlane=perp.clone().multiplyScalar(Math.cos(inc)).add(eqN.clone().multiplyScalar(Math.sin(inc)));
    return node.clone().multiplyScalar(Math.cos(u)*r).add(inPlane.multiplyScalar(Math.sin(u)*r));};
  for(let i=0;i<NQ(3000);i++){const p=orbitPt(6.371+.45+.15*R(),(R()<.7?53:R()<.5?70:97.6)*DEG,R()*TAU,R()*TAU);pa(sb,p.x,p.y,p.z,.85,.9,1,.012);}
  for(let pl=0;pl<6;pl++)for(let k=0;k<4;k++){const p=orbitPt(26.56,55*DEG,pl/6*TAU,k/4*TAU+pl*.5);pa(sb,p.x,p.y,p.z,.6,1,.7,.05);}
  for(let k=0;k<80;k++){const p=orbitPt(42.164,0,0,k/80*TAU+R()*.05);pa(sb,p.x,p.y,p.z,1,.85,.5,.05);}
  S.add(pObj(sb,{minPx:1.6,dim:.6,hard:.5}));
  const ring=(r,inc,raan,c,op)=>{const pts=[];for(let k=0;k<=256;k++)pts.push(orbitPt(r,inc,raan,k/256*TAU));const l=new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:c,transparent:true,opacity:op}));S.add(l);};
  ring(42.164,0,0,0xffc66b,.35);for(let pl=0;pl<6;pl++)ring(26.56,55*DEG,pl/6*TAU,0x8fe39a,.14);
  /* the Moon: first-quarter-ish, in the ecliptic plane */
  const mdir=NECL.clone().cross(SUN).normalize().multiplyScalar(-1);
  const moon=new T.Mesh(new T.SphereGeometry(1.737,96,64),bodyMat({col:"#77736c",col2:"#b4afa6",amb:.02,rimK:0,nz:.9,nzF:1.4}));
  moon.position.copy(mdir.clone().multiplyScalar(384.4));S.add(moon);
  const moonOrbit=[];const mo2=SUN.clone();for(let k=0;k<=256;k++){const a=k/256*TAU;moonOrbit.push(mdir.clone().multiplyScalar(Math.cos(a)*384.4).add(mo2.clone().multiplyScalar(Math.sin(a)*384.4)));}
  S.add(new T.Line(new T.BufferGeometry().setFromPoints(moonOrbit),new T.LineBasicMaterial({color:0x9aa6ba,transparent:true,opacity:.22})));
  const mp=PB(1);pa(mp,moon.position.x,moon.position.y,moon.position.z,.8,.8,.78,3.4);S.add(pObj(mp,{minPx:2.5,dim:1}));
  S.label("Earth",V3(4.6,4.6,0),6.8,8.6);S.label("geostationary orbit",orbitPt(42.164,0,0,2.2),7.5,8.8);S.label("GPS orbits",orbitPt(26.56,55*DEG,0,1.2),7.4,8.4);
  S.label("Moon",moon.position.clone().add(V3(0,3,0)),8.4,9.5);S.label("satellites in low orbit",orbitPt(6.95,53*DEG,1,1.9),6.9,7.6);
  return{};}});

/* ======================================================================
   SCENE 12 — the solar system out to the heliosphere (unit Gm = 10^9 m). Origin at the Sun.
   Planet positions: mean longitudes for 20 March 2025 on circular orbits (approximation).
   ====================================================================== */
const PLANETS=[["Mercury",.387,2.44,"#b5aa9c",252.25,149472.67],["Venus",.723,6.05,"#e8d2a0",181.98,58517.82],["Earth",1,6.37,"#6fa8ff",100.46,35999.37],
  ["Mars",1.524,3.39,"#d9734a",355.45,19140.30],["Jupiter",5.203,69.9,"#d8b48a",34.40,3034.75],["Saturn",9.537,58.2,"#e6cf98",49.95,1222.49],
  ["Uranus",19.19,25.4,"#a6e0e6",313.24,428.48],["Neptune",30.07,24.6,"#6f8ff0",304.88,218.46]];
scene({id:"solar",s:9,O:P_SUN,build(S){
  const R=rng(101);const au=AU/1e9;const tc=(2025.215-2000)/100;
  const sunM=new T.ShaderMaterial({transparent:true,uniforms:{uFade:{value:1},uTime:U.time},
    vertexShader:`varying vec3 vN;varying vec3 vO;varying vec3 vW;void main(){vO=position;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform float uFade,uTime;varying vec3 vN;varying vec3 vO;varying vec3 vW;${NOISE}
    void main(){vec3 d=normalize(vO);float g=snoise(d*55.+uTime*.05)*.5+snoise(d*130.-uTime*.08)*.3+fbm3(d*8.+uTime*.01)*.4;
      float mu=max(dot(normalize(vN),normalize(cameraPosition-vW)),0.);float limb=.35+.65*pow(mu,.55);
      vec3 col=mix(vec3(1.,.55,.18),vec3(1.,.93,.75),.55+.35*g)*limb*1.15;gl_FragColor=vec4(col,uFade);}`});
  const sun=new T.Mesh(new T.SphereGeometry(.6957,96,64),sunM);S.add(sun);
  const cg=PB(3);pa(cg,0,0,0,.45,.3,.16,.6957*8,0);pa(cg,0,0,0,.6,.42,.22,.6957*3.2,0);pa(cg,0,0,0,1,.95,.85,.01,0);S.add(pObj(cg,{minPx:5,dim:1,maxPx:4000}));
  const ex=XECL,ey=YECL;const ecl=(lam,r)=>ex.clone().multiplyScalar(Math.cos(lam)*r).add(ey.clone().multiplyScalar(Math.sin(lam)*r));
  const earthLocal=V3((P_EARTH[0]-P_SUN[0])/1e9,(P_EARTH[1]-P_SUN[1])/1e9,(P_EARTH[2]-P_SUN[2])/1e9);
  const mk=PB(PLANETS.length);
  PLANETS.forEach(p=>{const lam=(p[0]==="Earth"?180:((p[4]+p[5]*tc)%360+360)%360)*DEG;const pos=p[0]==="Earth"?earthLocal:ecl(lam,p[1]*au);
    const me=new T.Mesh(new T.SphereGeometry(p[2]/1e3,32,24),bodyMat({col:p[3],sun:pos.clone().multiplyScalar(-1).normalize(),amb:.04,rimK:.2}));
    me.position.copy(pos);me.userData.lit=true;S.add(me);
    if(p[0]==="Saturn"){const rg=new T.RingGeometry(.0745,.137,64);const rm=new T.Mesh(rg,new T.MeshBasicMaterial({color:0xd8c8a0,transparent:true,opacity:.6,side:T.DoubleSide}));rm.position.copy(pos);rm.lookAt(pos.clone().add(NECL));rm.rotateX(.47);S.add(rm);}
    const c=new T.Color(p[3]);pa(mk,pos.x,pos.y,pos.z,c.r,c.g,c.b,p[2]/1e3*2.5,0);
    const pts=[];for(let k=0;k<=360;k++){const a=k/360*TAU;pts.push(p[0]==="Earth"?ecl(a,au):ecl(a,p[1]*au));}
    S.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:c,transparent:true,opacity:.28})));
    const lo=Math.log10(p[1]*au*1e9*2);S.label(p[0],pos,lo-1.6,lo+1.25);});
  S.add(pObj(mk,{minPx:3.2,dim:1,hard:.6,maxPx:400}));
  /* asteroid belt, Kuiper belt, zodiacal dust */
  const db=PB(NQ(7000)+NQ(9000)+NQ(4000));
  for(let i=0;i<NQ(7000);i++){const r=(2.2+1.1*Math.pow(R(),.8))*au,a=R()*TAU;const p=ecl(a,r).add(NECL.clone().multiplyScalar(gauss(R)*.06*r));const w=.35+.3*R();pa(db,p.x,p.y,p.z,w,w*.9,w*.8,.25);}
  for(let i=0;i<NQ(9000);i++){const r=(30+20*Math.pow(R(),1.2)+(R()<.1?R()*60:0))*au,a=R()*TAU;const p=ecl(a,r).add(NECL.clone().multiplyScalar(gauss(R)*.12*r));const w=.3+.3*R();pa(db,p.x,p.y,p.z,w*.8,w*.9,w,3);}
  for(let i=0;i<NQ(4000);i++){const r=(.15+Math.pow(R(),.7)*4)*au,a=R()*TAU;const p=ecl(a,r).add(NECL.clone().multiplyScalar(gauss(R)*.08*r));pa(db,p.x,p.y,p.z,.25,.22,.18,.4);}
  S.add(pObj(db,{minPx:1.2,dim:.25}));
  /* interplanetary dust along the Earth–Sun path: a motion cue while the view travels to the Sun */
  const fl=PB(NQ(9000));for(let i=0;i<fl.max;i++){const t=R();const p=earthLocal.clone().multiplyScalar(t).add(V3(gauss(R),gauss(R),gauss(R)).multiplyScalar(2.5+t*4));const w=.5+.4*R();pa(fl,p.x,p.y,p.z,w,w*.9,w*.75,.01);}
  const flP=pObj(fl,{minPx:1.3,dim:1,maxPx:3});S.add(flP);
  /* cue for the Earth-to-Sun jump (L 9 to 10.5): Earth's orbit brightens, a dashed line marks the 1 AU we cross,
     and labels keep Earth (behind us) and the Sun (ahead) in mind while the view re-centres */
  const orbHi=[];for(let k=0;k<=720;k++)orbHi.push(ecl(k/720*TAU,au));
  const orbM=new T.LineBasicMaterial({color:0x8fbaff,transparent:true,opacity:.75});orbM.userData.op=.75;const orbL=new T.Line(new T.BufferGeometry().setFromPoints(orbHi),orbM);S.add(orbL);
  const auG=new T.BufferGeometry().setFromPoints([earthLocal.clone(),V3(0,0,0)]);const auM=new T.LineDashedMaterial({color:0xffd58a,dashSize:1.2,gapSize:.9,transparent:true,opacity:.8});auM.userData.op=.8;
  const auL=new T.Line(auG,auM);auL.computeLineDistances();S.add(auL);
  S.label("Earth's orbit",ecl(186*DEG,au),9.2,11.4);S.label("1 AU · 150 million km to the Sun",earthLocal.clone().multiplyScalar(.5),9.25,10.6);
  S.label("Earth",earthLocal,9.15,11.6);
  /* heliosphere: termination shock and heliopause (nose towards the interstellar wind, ecliptic lon ~255°, schematic tail) */
  const nose=ecl(255*DEG,1).normalize();
  const hg=new T.SphereGeometry(1,96,64);const P=hg.attributes.position;
  for(let i=0;i<P.count;i++){const v=V3(P.getX(i),P.getY(i),P.getZ(i));const c=v.dot(V3(0,1,0));const r=120*au*(1+1.3*Math.pow((1-c)/2,1.6));P.setXYZ(i,v.x*r,v.y*r,v.z*r);}
  hg.computeVertexNormals();const hp=new T.Mesh(hg,glowMat({col:"#5aa0ff",pow:2.2,int:.5,nz:.6,nzF:.0004}));hp.quaternion.setFromUnitVectors(V3(0,1,0),nose);S.add(hp);
  const ts=new T.Mesh(new T.SphereGeometry(90*au,64,48),glowMat({col:"#8f7aff",pow:3,int:.18}));ts.position.copy(nose.clone().multiplyScalar(-6*au));S.add(ts);
  const v1=radec(17.22,12.0).multiplyScalar(167*au),v2=radec(20.07,-59.3).multiplyScalar(140*au);
  const vb=PB(2);pa(vb,v1.x,v1.y,v1.z,1,1,.8,1,0);pa(vb,v2.x,v2.y,v2.z,1,1,.8,1,0);S.add(pObj(vb,{minPx:3,dim:1,hard:.7}));
  S.label("Voyager 1",v1,13.3,15.2);S.label("Voyager 2",v2,13.3,15.2);S.label("heliopause",nose.clone().multiplyScalar(122*au),13.5,15);
  S.label("asteroid belt",ecl(1.2,2.8*au),11.7,13.2);S.label("Kuiper belt",ecl(2.4,42*au),12.9,14.2);S.label("Sun",V3(0,0,0),11.2,14.6,"here");
  return{update(L){flP.material.userData.k=sstep(9.1,9.35,L)*(1-sstep(9.9,10.4,L));
    const cue=sstep(9.0,9.3,L)*(1-sstep(10.6,11.3,L));orbM.userData.k=cue;auM.userData.k=sstep(9.05,9.3,L)*(1-sstep(10.2,10.7,L));}};}});

/* ======================================================================
   SCENE 13 — Oort cloud, nearest stars, Local Bubble, Orion Arm (unit Pm = 10^15 m). Origin at the Sun.
   ====================================================================== */
scene({id:"stars",s:15,O:P_SUN,build(S){
  const R=rng(131);const au=AU/1e15,ly=LY/1e15;
  /* Oort cloud: log-uniform in radius 2,000–100,000 AU, inner part flattened towards the ecliptic */
  const ob=PB(NQ(26000));
  for(let i=0;i<ob.max;i++){const r=Math.pow(10,lerp(Math.log10(2000),5,R()))*au;let d=V3(gauss(R),gauss(R),gauss(R)).normalize();
    const flat=1-sstep(3.5,4.4,Math.log10(r/au));const n=d.dot(NECL);d.sub(NECL.clone().multiplyScalar(n*flat*.6)).normalize();
    const w=.28+.25*R();pa(ob,d.x*r,d.y*r,d.z*r,w*.8,w*.92,w,r*.012);}
  S.add(pObj(ob,{minPx:1.1,dim:.18}));
  /* named stars */
  const nb=PB(NEAR_STARS.length);
  NEAR_STARS.forEach(s=>{const p=s[0]==="Sun"?V3():radec(s[1],s[2]).multiplyScalar(s[3]*ly);const c=new T.Color(s[4]);pa(nb,p.x,p.y,p.z,c.r,c.g,c.b,(3+2.6*s[5])*Math.min(PR,2),0);
    const ld=s[0]==="Sun"?17:Math.log10(s[3]*LY*2);S.label(s[0],p,s[0]==="Sun"?14.6:ld-.35,s[0]==="Sun"?19.2:ld+(s[5]>1.5?.95:.6),s[0]==="Sun"?"here":"");});
  S.add(pObj(nb,{fixed:true,minPx:1,dim:1,hard:.15}));
  /* field stars: log-uniform 12–4000 ly, thickening into the galactic disc */
  const fb=PB(NQ(30000)+NQ(30000));
  const spec=[[.75,.85,1],[1,1,1],[1,.95,.85],[1,.85,.65],[1,.7,.5]];
  for(let i=0;i<NQ(30000);i++){const r=Math.pow(10,lerp(Math.log10(12),Math.log10(4000),R()))*ly;let d=V3(gauss(R),gauss(R),gauss(R)).normalize();
    const zz=d.dot(GZ);const flat=sstep(150*ly,900*ly,r);d.sub(GZ.clone().multiplyScalar(zz*flat*.85)).normalize();
    const c=spec[Math.min(4,Math.floor(Math.pow(R(),.6)*5))];const w=.35+.65*Math.pow(R(),2);pa(fb,d.x*r,d.y*r,d.z*r,c[0]*w,c[1]*w,c[2]*w,.04*ly);}
  /* the Orion Arm: a band of stars in the galactic plane running roughly from Cygnus (l≈80°) to Vela (l≈260°) */
  const armDir=galDir(78,0),armPerp=galDir(168,0);
  for(let i=0;i<NQ(30000);i++){const along=(R()*2-1)*13000*ly,across=gauss(R)*1300*ly+250*ly,up=gauss(R)*280*ly;
    const p=armDir.clone().multiplyScalar(along).add(armPerp.clone().multiplyScalar(across)).add(GZ.clone().multiplyScalar(up));
    if(p.length()<600*ly)continue;const young=R()<.45;const c=young?[.7,.8,1]:spec[1+Math.floor(R()*3)];const w=.3+.5*R();pa(fb,p.x,p.y,p.z,c[0]*w,c[1]*w,c[2]*w,.04*ly);}
  S.add(pObj(fb,{minPx:1.15,dim:.22}));
  /* star-forming clouds and the Local Bubble wall (shape schematic) */
  const clouds=[["Taurus clouds",172,-15,450],["Ophiuchus clouds",355,17,450],["Lupus clouds",339,16,500],["Chamaeleon clouds",300,-16,590],["Perseus clouds",160,-20,950],["Orion complex",209,-19,1350],["Cepheus flare",110,15,1000]];
  const cb=PB(NQ(9000));const pk=PB(NQ(1500));const per=Math.floor(cb.max/clouds.length);
  clouds.forEach((c,ci)=>{const ctr=galDir(c[1],c[2]).multiplyScalar(c[3]*ly);const rad=(40+c[3]*.06)*ly;
    for(let i=0;i<per;i++){const p=ctr.clone().add(V3(gauss(R),gauss(R)*.6,gauss(R)).multiplyScalar(rad));const pink=c[0].startsWith("Orion")&&R()<.4;
      if(pink)pa(pk,p.x,p.y,p.z,.5,.2,.3,rad*.25);else pa(cb,p.x,p.y,p.z,.16,.11,.08,rad*.3);}
    S.label(c[0],ctr,18.6,20.0);});
  S.add(pObj(cb,{normal:true,minPx:1.4,dim:.15,maxPx:120}));S.add(pObj(pk,{minPx:1.4,dim:.2,maxPx:120}));
  const bg=new T.SphereGeometry(1,80,56);const bp=bg.attributes.position;const RN=rng(7);
  const bumps=[];for(let k=0;k<9;k++)bumps.push([V3(gauss(RN),gauss(RN),gauss(RN)).normalize(),.15+.25*RN()]);
  for(let i=0;i<bp.count;i++){const v=V3(bp.getX(i),bp.getY(i),bp.getZ(i));let r=1;bumps.forEach(b=>{r+=b[1]*Math.pow(Math.max(0,v.dot(b[0])),3);});
    const zz=v.dot(GZ);r*=1+.35*zz*zz;r*=480*ly;bp.setXYZ(i,v.x*r,v.y*r,v.z*r);}
  bg.computeVertexNormals();const bubble=new T.Mesh(bg,glowMat({col:"#ff9a5a",pow:4,int:.05,nz:1.2,nzF:.0012}));bubble.position.copy(galDir(260,5).multiplyScalar(120*ly));S.add(bubble);
  const wb=PB(NQ(16000));const RW=rng(9);
  for(let i=0;i<wb.max;i++){const v=V3(gauss(RW),gauss(RW),gauss(RW)).normalize();let r=1;bumps.forEach(b=>{r+=b[1]*Math.pow(Math.max(0,v.dot(b[0])),3);});
    const zz=v.dot(GZ);r*=(1+.35*zz*zz)*480*ly*(1+.08*gauss(RW));const p=v.multiplyScalar(r).add(bubble.position);
    const hot=RW()<.5;pa(wb,p.x,p.y,p.z,hot?.22:.16,hot?.11:.1,hot?.07:.08,14*ly);}
  const wbP=pObj(wb,{minPx:1.3,dim:.25,maxPx:40});S.add(wbP);
  S.label("Oort cloud",NECL.clone().multiplyScalar(30000*au).add(XECL.clone().multiplyScalar(20000*au)),15.4,16.9);
  S.label("Local Bubble",bubble.position.clone().add(galDir(90,30).multiplyScalar(560*ly)),18.6,19.8);
  S.label("Orion Arm",armDir.clone().multiplyScalar(6500*ly),19.5,20.4);
  const cP=S.scene.children.filter(c=>c.isPoints).slice(3);
  return{update(L){const k=sstep(17.9,18.7,L);wbP.material.userData.k=k;bubble.material.userData.k=k;cP.forEach(c=>{if(c!==wbP)c.material.userData.k=sstep(17.6,18.4,L);});}};}});

/* ======================================================================
   SCENE 14 — the Milky Way (unit 10^20 m ≈ 10,570 ly). Origin at the galactic centre.
   Point-cloud galaxy adapted from the Sun Eater atlas engine (four log-spiral arms, bar, dust).
   ====================================================================== */
const GU=1e20/LY; /* ly per unit */
function lgPos(l,b,dMly){return galDir(l,b).multiplyScalar(dMly*MLY);}
scene({id:"galaxy",s:20,O:P_GC,build(S){
  const R=rng(1977);const k=26000/271.4/GU; /* their unit (≈96 ly) → ours */
  const conv=(x,y,z)=>galVec(-z,x,y).multiplyScalar(k);      /* their frame: GC origin, Sol on +Z, l=90° on +X, north +Y */
  const SOL=[0,.2,271.4];
  const ARMS=[{a:-4.955,name:"Norma Arm"},{a:-6.526,name:"Scutum–Centaurus Arm"},{a:-8.097,name:"Sagittarius Arm"},{a:-9.668,name:"Perseus Arm"}];
  const PITCH=Math.tan(12.5*DEG);const armAngle=(r,a0)=>a0+Math.log(r/40)/PITCH;
  const N=NQ(160000);const b=PB(N+NQ(6000));
  const cOld=[1,.82,.58],cMid=[1,.93,.82],cYoung=[.62,.75,1],cHII=[1,.45,.62];
  for(let i=0;i<N;i++){let x,y,z,c,s;const kk=R();
    if(kk<.2){const r=Math.abs(gauss(R))*34;const th=R()*TAU;const ph=Math.acos(R()*2-1);
      x=r*Math.sin(ph)*Math.cos(th);z=r*Math.sin(ph)*Math.sin(th)*.6;y=r*Math.cos(ph)*.55;
      if(R()<.4){const bl=gauss(R)*55;x+=bl*Math.cos(.45);z+=bl*Math.sin(.45);y*=.6;}c=cOld;s=1.6+R()*2.2;}
    else if(kk<.8){const arm=ARMS[(R()*4)|0];const r=42+Math.pow(R(),.85)*430;
      const th=armAngle(r,arm.a)+gauss(R)*(.3+r/1600)+Math.sin(r*.05+arm.a*3)*.12;const rr=r*(1+gauss(R)*.06);
      x=Math.sin(th)*rr;z=Math.cos(th)*rr;y=gauss(R)*(3+r*.012);const yb=R();c=yb<.55?cYoung:yb<.9?cMid:cOld;s=1.1+R()*2.4;if(R()<.035){c=cHII;s=3+R()*4;}}
    else{const r=30+Math.pow(R(),.7)*480;const th=R()*TAU;x=Math.sin(th)*r;z=Math.cos(th)*r;y=gauss(R)*(4+r*.01);c=R()<.6?cMid:cOld;s=.9+R()*1.6;}
    const p=conv(x,y,z);const w=.55+R()*.5;pa(b,p.x,p.y,p.z,c[0]*w,c[1]*w,c[2]*w,s*.0055);}
  /* the Orion spur near the Sun */
  for(let i=0;i<NQ(6000);i++){const th=(R()-.5)*.8;const r=271*Math.exp(PITCH*th*.6)*(1+gauss(R)*.05);const p=conv(Math.sin(th)*r,gauss(R)*3,Math.cos(th)*r);
    const c=R()<.6?[.66,.78,1]:[1,.93,.82];const w=.3+.4*R();pa(b,p.x,p.y,p.z,c[0]*w,c[1]*w,c[2]*w,(.8+R()*1.6)*.0055);}
  S.add(pObj(b,{minPx:1.25,dim:.16,maxPx:14}));
  const ND=NQ(24000);const d=PB(ND);
  for(let i=0;i<ND;i++){const arm=ARMS[(R()*4)|0];const r=50+Math.pow(R(),.9)*380;const th=armAngle(r,arm.a)-.1+gauss(R)*.09+Math.sin(r*.05+arm.a*3)*.12;
    const p=conv(Math.sin(th)*r,gauss(R)*2,Math.cos(th)*r);const v=.05+R()*.05;pa(d,p.x,p.y,p.z,v*1.2,v*.9,v*.7,(5+R()*7)*.0055);}
  S.add(pObj(d,{normal:true,minPx:1.5,dim:.1,maxPx:40}));
  const core=PB(2);pa(core,0,0,0,1,.85,.6,1.1,0);pa(core,0,0,0,1,.7,.45,2.6,0);S.add(pObj(core,{minPx:2,maxPx:2000}));
  /* satellite galaxies within ~1 Mly */
  const sat=PB(NQ(14000));const sun=conv(SOL[0],SOL[1],SOL[2]);
  LOCAL_GROUP.forEach(g=>{if(g[3]>1.0||g[3]===0)return;const ctr=sun.clone().add(lgPos(g[1],g[2],g[3]).multiplyScalar(1/1e20));const rad=g[4]*1000*LY/1e20;
    const n=Math.round(sat.max*(g[5]==="irr"&&g[4]>5?.3:g[4]>3?.15:.035));
    for(let i=0;i<n;i++){const p=ctr.clone().add(V3(gauss(R),gauss(R)*.6,gauss(R)).multiplyScalar(rad*.5));const w=.4+.4*R();pa(sat,p.x,p.y,p.z,w,w*.95,w*.9,rad*.02);}
    S.label(g[0],ctr,Math.log10(g[3]*MLY*2)-.4,23.0);});
  S.add(pObj(sat,{minPx:1.2,dim:.2}));
  S.label("Sun (you are here)",sun,19.7,21.6,"here");S.label("galactic centre",V3(0,0,0),20.4,22.2);
  ARMS.forEach((a,i)=>{const r=[330,300,250,360][i];const th=armAngle(r,a.a);S.label(a.name,conv(Math.sin(th)*r,0,Math.cos(th)*r),20.6,21.8);});
  return{};}});

/* ======================================================================
   SCENE 15 — Local Group (unit 10^22 m ≈ 1.06 Mly). Origin at the galactic centre.
   ====================================================================== */
const SPIRAL_FS=`uniform float uFade,uSeed,uArms,uBulge,uTilt;uniform vec3 uC1,uC2;varying vec2 vUv;${NOISE}
void main(){vec2 p=vUv*2.-1.;float r=length(p);if(r>1.)discard;float th=atan(p.y,p.x);
  float arm=pow(.5+.5*cos(uArms*(th-log(r+.02)*2.6)+snoise(vec3(p*3.,uSeed))*.8),3.);
  float disc=exp(-r*2.4)*(.35+1.1*arm)*(1.-smoothstep(.75,1.,r));float bul=exp(-r*r*60.)*uBulge;
  float knot=smoothstep(.6,.95,snoise(vec3(p*14.,uSeed+3.)))*arm*exp(-r*2.);
  vec3 col=uC1*disc+uC2*bul+vec3(1.,.5,.7)*knot*.5;float a=clamp((disc+bul+knot*.4)*1.3,0.,1.)*uFade;gl_FragColor=vec4(col/max(a,.001)*uFade,a);}`;
function spiralMesh(sizeR,normal,c1,c2,seed,bulge){const m=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,
  uniforms:{uFade:{value:1},uSeed:{value:seed},uArms:{value:2},uBulge:{value:bulge||1},uTilt:{value:0},uC1:{value:new T.Color(c1)},uC2:{value:new T.Color(c2)}},
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:SPIRAL_FS});
  const me=new T.Mesh(new T.PlaneGeometry(sizeR*2,sizeR*2),m);me.quaternion.setFromUnitVectors(V3(0,0,1),normal);return me;}
function diskNormal(raH,decD,incD,paD){ /* estimated from inclination and position angle */
  const los=radec(raH,decD);const north=ZEQ.clone().sub(los.clone().multiplyScalar(ZEQ.dot(los))).normalize();const east=north.clone().cross(los).multiplyScalar(-1).normalize();
  const maj=north.clone().multiplyScalar(Math.cos(paD*DEG)).add(east.clone().multiplyScalar(Math.sin(paD*DEG)));const min=los.clone().cross(maj).normalize();
  return los.clone().multiplyScalar(-Math.cos(incD*DEG)).add(min.multiplyScalar(Math.sin(incD*DEG))).normalize();}
scene({id:"lgroup",s:22,O:P_GC,build(S){
  const R=rng(151);const u=1e22;const sun=V3((P_SUN[0]-P_GC[0])/u,(P_SUN[1]-P_GC[1])/u,(P_SUN[2]-P_GC[2])/u);
  const blobs=PB(NQ(16000));const mk=PB(LOCAL_GROUP.length);
  LOCAL_GROUP.forEach((g,gi)=>{const ctr=g[3]===0?V3():sun.clone().add(lgPos(g[1],g[2],g[3]).multiplyScalar(1/u));const rad=g[4]*1000*LY/u;
    if(g[5]==="spiral"){let n=GZ.clone(),c1="#9fb8ff",c2="#ffd9a0",seed=gi;
      if(g[0].startsWith("Andromeda"))n=diskNormal(.7124,41.27,77,38);if(g[0].startsWith("Triangulum"))n=diskNormal(1.564,30.66,55,23);
      const me=spiralMesh(rad,n,c1,c2,seed,g[0].startsWith("Tri")?.4:1.2);me.position.copy(ctr);S.add(me);
      /* dark-matter halo (virial radius, rough estimate) */
      const hr=(g[0].startsWith("Tri")?.5:g[0].startsWith("Andr")?1.0:.9)*MLY/u;const h=new T.Mesh(new T.SphereGeometry(hr,40,28),glowMat({col:"#6f8fff",pow:1.4,int:.07,core:.05}));h.position.copy(ctr);S.add(h);}
    else{const n=Math.round(blobs.max*(g[5]==="ell"?.03:g[4]>5?.12:.03));for(let i=0;i<n;i++){const p=ctr.clone().add(V3(gauss(R),gauss(R)*(g[5]==="ell"?.8:.5),gauss(R)).multiplyScalar(rad*.5));
      const w=.4+.4*R();pa(blobs,p.x,p.y,p.z,w*(g[5]==="irr"?.85:1),w*.95,w*(g[5]==="irr"?1:.85),rad*.04);}}
    const c=new T.Color(g[5]==="spiral"?"#dfe6ff":g[5]==="irr"?"#cfe0ff":"#ffe9cc");pa(mk,ctr.x,ctr.y,ctr.z,c.r,c.g,c.b,rad*(g[5]==="spiral"?.6:1.2),0);
    const big=g[4]>=7||g[0].startsWith("M3")||g[0]=="IC 10"||g[0]=="NGC 6822"||g[0]=="IC 1613";
    if(big||g[3]>1)S.label(g[0],ctr,g[3]===0?22.3:Math.log10(Math.max(g[3],.3)*MLY*2)-.3,24.0);});
  S.label("dark-matter halo (size estimated)",galDir(200,40).multiplyScalar(.9*MLY/u).add(sun),22.6,23.5);
  S.add(pObj(blobs,{minPx:1.2,dim:.2}));S.add(pObj(mk,{minPx:7,dim:1,maxPx:60}));
  /* faint background galaxies to suggest depth */
  const bg=PB(NQ(2500));for(let i=0;i<bg.max;i++){const d=V3(gauss(R),gauss(R),gauss(R)).normalize().multiplyScalar(12+R()*40);const w=.15+.2*R();pa(bg,d.x,d.y,d.z,w,w*.95,w*.9,.05);}
  S.add(pObj(bg,{minPx:1.2,dim:.3}));
  return{};}});

/* ======================================================================
   SCENES 16/17 — superclusters and the cosmic web. Origin at the galactic centre (≈ us).
   Cluster positions are real (RA/Dec/distance); filaments between them and the field galaxies
   are procedural (schematic).
   ====================================================================== */
scene({id:"super",s:24,O:P_GC,build(S){
  const R=rng(171);const u=1e24;
  const CL=CLUSTERS.map(c=>({name:c[0],p:radec(c[1],c[2]).multiplyScalar(c[3]*MLY/u),r:c[4]*MLY/u,w:c[5]}));
  const nodes=CL.map(c=>c.p.clone());nodes.push(V3());
  for(let i=0;i<70;i++){const p=V3(gauss(R),gauss(R),gauss(R)).normalize().multiplyScalar(1.5+R()*7);nodes.push(p);}
  const b=PB(NQ(46000));
  const fil=(a,c,n,th)=>{for(let i=0;i<n;i++){const t=R();const mid=a.clone().lerp(c,t);const bend=Math.sin(t*Math.PI)*.12*a.distanceTo(c);mid.add(V3(gauss(R),gauss(R),gauss(R)).multiplyScalar(th+bend*.2));
    const w=.25+.35*R();pa(b,mid.x,mid.y,mid.z,w,w*.92,w*.8,.008);}};
  const LG=V3();const byName=n=>CL.find(c=>c.name.startsWith(n)).p;
  [[LG,byName("Virgo")],[byName("Virgo"),byName("Centaurus")],[byName("Centaurus"),byName("Norma")],[byName("Hydra"),byName("Norma")],[byName("Hydra"),byName("Centaurus")],
   [LG,byName("Fornax")],[byName("Fornax"),byName("Hydra")],[byName("Norma"),byName("Shapley")],[LG,byName("Perseus")],[byName("Virgo"),byName("Coma")]].forEach(e=>fil(e[0],e[1],NQ(1800),.06));
  for(let i=0;i<nodes.length;i++){const a=nodes[i];const ds=nodes.map((c,j)=>[a.distanceToSquared(c),j]).sort((x,y)=>x[0]-y[0]);
    for(let k=1;k<=2;k++){const c=nodes[ds[k][1]];if(a.distanceTo(c)<4)fil(a,c,NQ(260),.07);}}
  CL.forEach(c=>{for(let i=0;i<NQ(2600)*c.w;i++){const p=c.p.clone().add(V3(gauss(R),gauss(R),gauss(R)).multiplyScalar(c.r*.45));const w=.5+.4*R();pa(b,p.x,p.y,p.z,w,w*.9,w*.75,.01);}
    S.label(c.name,c.p,Math.log10(c.p.length()*u*2)-.5,25.6);});
  while(b.n<b.max){const p=V3(gauss(R),gauss(R),gauss(R)).multiplyScalar(4);const w=.15+.2*R();pa(b,p.x,p.y,p.z,w,w,w*.9,.008);}
  S.add(pObj(b,{minPx:1.15,dim:.18,maxPx:5}));
  /* Laniakea: schematic basin boundary and flow lines towards the Great Attractor */
  const GA=byName("Norma");const cen=GA.clone().multiplyScalar(.62);
  const lg=new T.SphereGeometry(1,64,48);const lp=lg.attributes.position;
  for(let i=0;i<lp.count;i++){const v=V3(lp.getX(i),lp.getY(i),lp.getZ(i));const n=1+.18*Math.sin(v.x*3+1)*Math.sin(v.y*4)+.12*Math.sin(v.z*5+2);const r=2.46*n;lp.setXYZ(i,v.x*r,v.y*r*.75,v.z*r);}
  lg.computeVertexNormals();const lan=new T.Mesh(lg,glowMat({col:"#ffcf7a",pow:3,int:.2,nz:.8,nzF:1.5}));lan.position.copy(cen);S.add(lan);
  const lines=[];const lc=[];
  for(let i=0;i<(MOB?120:220);i++){let p=cen.clone().add(V3(gauss(R),gauss(R)*.7,gauss(R)).multiplyScalar(1.3));
    for(let s=0;s<26;s++){const to=GA.clone().sub(p);const d=to.length();if(d<.08)break;const sw=V3(Math.sin(p.y*2+1),Math.sin(p.z*2+2),Math.sin(p.x*2+3)).multiplyScalar(.25);
      const q=p.clone().add(to.normalize().add(sw).normalize().multiplyScalar(.09));lines.push(p.x,p.y,p.z,q.x,q.y,q.z);const a=s/26;lc.push(.9*a+.1,.75*a+.1,.4*a+.1,.9*a+.2,.75*a+.2,.4*a+.2);p=q;}}
  const lgeo=new T.BufferGeometry();lgeo.setAttribute("position",new T.Float32BufferAttribute(lines,3));lgeo.setAttribute("color",new T.Float32BufferAttribute(lc,3));
  const flowM=new T.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.45,blending:T.AdditiveBlending,depthWrite:false});S.add(new T.LineSegments(lgeo,flowM));
  /* the Local (Virgo) Supercluster as a faint flattened halo around Virgo */
  const vs=new T.Mesh(new T.SphereGeometry(1,48,32),glowMat({col:"#9fd0ff",pow:3,int:.1}));vs.scale.set(.6,.25,.6);vs.position.copy(byName("Virgo").multiplyScalar(.5));
  vs.quaternion.setFromUnitVectors(V3(0,1,0),radec(12.75,15).cross(GZ).normalize());S.add(vs);
  S.label("Local Group (you are here)",V3(),23.4,25.3,"here");S.label("Virgo Supercluster",vs.position.clone().add(V3(0,.3,0)),23.6,24.6);
  S.label("Laniakea",cen.clone().add(V3(0,2.2,0)),24.4,25.8);S.label("Great Attractor",GA,24.3,25.6);
  return{update(L){const k=sstep(24.35,24.85,L);flowM.userData.k=k;lan.material.userData.k=k;}};}});
scene({id:"web",s:25,O:P_GC,build(S){
  const R=rng(191);const RU=46.5*1e9*LY/1e25; /* comoving radius of the observable universe in units */
  const NN=NQ(1400);const nodes=[];for(let i=0;i<NN;i++){const r=RU*Math.cbrt(R())*1.02;nodes.push(V3(gauss(R),gauss(R),gauss(R)).normalize().multiplyScalar(r));}
  nodes.push(V3());
  const b=PB(NQ(120000));const perEdge=Math.max(6,Math.floor(b.max*.7/(NN*2.4)));
  for(let i=0;i<nodes.length&&b.n<b.max*.75;i++){const a=nodes[i];const ds=[[1e30,0],[1e30,0],[1e30,0]];for(let j=0;j<nodes.length;j++){if(j===i)continue;const d2=a.distanceToSquared(nodes[j]);if(d2<ds[2][0]){ds[2]=[d2,j];ds.sort((x,y)=>x[0]-y[0]);}}
    for(let k=0;k<3;k++){const c=nodes[ds[k][1]];const L=a.distanceTo(c);if(L>RU*.35)continue;for(let m=0;m<perEdge;m++){const t=R();const p=a.clone().lerp(c,t).add(V3(gauss(R),gauss(R),gauss(R)).multiplyScalar(.012*L+.012));
      if(p.length()>RU)continue;const w=.5+.5*R();const warm=R()<.5;pa(b,p.x,p.y,p.z,w,w*(warm?.85:.95),w*(warm?.7:1),.03);}}}
  for(let i=0;i<nodes.length&&b.n<b.max;i++){const a=nodes[i];for(let m=0;m<10;m++){const p=a.clone().add(V3(gauss(R),gauss(R),gauss(R)).multiplyScalar(.06));const w=.6+.4*R();pa(b,p.x,p.y,p.z,w,w*.9,w*.8,.03);}}
  /* make sure the neighbourhood (Laniakea scale) is populated so it matches the supercluster scene */
  const local=PB(NQ(8000));for(let i=0;i<local.max;i++){const p=V3(gauss(R),gauss(R),gauss(R)).multiplyScalar(.35);const w=.3+.3*R();pa(local,p.x,p.y,p.z,w,w*.92,w*.8,.004);}
  S.add(pObj(b,{minPx:1.3,dim:.45}));S.add(pObj(local,{minPx:1.15,dim:.3}));
  /* CMB: the edge of the observable universe (pattern procedural; colours after the familiar maps) */
  const cm=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{uFade:{value:1}},
    vertexShader:`varying vec3 vD;varying vec3 vW;varying vec3 vN;void main(){vD=normalize(position);vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform float uFade;varying vec3 vD;varying vec3 vW;varying vec3 vN;${NOISE}
    void main(){float t=fbm5(vD*7.)*.9+snoise(vD*30.)*.15;t=clamp(.5+t*.9,0.,1.);
      vec3 c=t<.5?mix(vec3(.05,.15,.6),vec3(.85,.85,.75),t*2.):mix(vec3(.85,.85,.75),vec3(.95,.35,.05),(t-.5)*2.);
      vec3 V=normalize(cameraPosition-vW);float fr=1.-abs(dot(normalize(vN),V));float a=(.04+.96*pow(fr,3.))*uFade;gl_FragColor=vec4(c,a*.8);}`});
  const cmb=new T.Mesh(new T.SphereGeometry(RU,96,64),cm);S.add(cmb);
  S.label("Laniakea (we are here)",V3(),24.9,26.2,"here");S.label("cosmic microwave background",V3(0,RU*1.02,0),26.6,27.3);
  S.label("filaments",nodes[3],25.7,26.6);S.label("voids",nodes[9].clone().lerp(nodes[10],.5),25.8,26.5);
  return{update(L){cm.userData.k=sstep(25.9,26.8,L);}};}});

/* ===================== transitions between consecutive scenes ===================== */
/* [centre, width] of each cross-fade (in decades) */
const TR=[[-14.85,.5],[-12.9,.9],[-9.8,.5],[-8.85,.5],[-7.6,.5],[-6.35,.6],[-5.35,.6],[-3.9,.5],[-1.35,.45],[2.95,.6],[5.9,.5],[9.25,.5],[14.55,.6],[20.0,.6],[22.55,.6],[23.85,.6],[25.35,.6]];
function weights(L){const n=SCENES.length;const w=new Array(n);
  for(let i=0;i<n;i++){const up=i===0?1:sstep(TR[i-1][0]-TR[i-1][1]/2,TR[i-1][0]+TR[i-1][1]/2,L);const dn=i===n-1?1:1-sstep(TR[i][0]-TR[i][1]/2,TR[i][0]+TR[i][1]/2,L);w[i]=up*dn;}
  return w;}
const skyW=L=>sstep(6.2,7.0,L)*(1-sstep(15.2,16.4,L));

/* ===================== focus path and camera orientation ===================== */
const PV_LG=lgPos(121.17,-21.57,2.5).multiplyScalar(.42);
const VIRGO=radec(12.45,12.72).multiplyScalar(54*MLY),GA=radec(16.25,-60.9).multiplyScalar(220*MLY);
const FOCUS=[[-99,[0,0,0]],[-7.9,[0,0,0]],[-7.25,HEADC],[-6.75,HEADC],[-6.1,[0,-.2e-6,0]],[-5.75,[0,-.2e-6,0]],[-5.15,SKIN],[-1.25,SKIN],[-0.8,[0,-.01,.035]],[-0.5,[0,-.01,.035]],[0.15,PERSON],[0.7,PERSON],[1.6,[3,-1,-6]],[2.6,GROUND],[3.9,GROUND],[5.0,[14000,-1,0]],[5.85,[14000,-1,0]],[6.95,P_EARTH],[9.35,P_EARTH],[9.9,P_SUN],[19.9,P_SUN],[20.9,P_GC],[22.4,P_GC],[23.2,addv(P_GC,PV_LG,1)],[23.5,addv(P_GC,PV_LG,1)],[24.2,addv(P_GC,VIRGO,.5)],[24.45,addv(P_GC,VIRGO,.5)],[25.1,addv(P_GC,GA,.55)],[25.5,addv(P_GC,GA,.55)],[26.4,P_GC],[99,P_GC]];
function focusAt(L){for(let i=0;i<FOCUS.length-1;i++){const a=FOCUS[i],b=FOCUS[i+1];if(L<=b[0]){const t=sstep(a[0],b[0],L);return[lerp(a[1][0],b[1][0],t),lerp(a[1][1],b[1][1],t),lerp(a[1][2],b[1][2],t)];}}return FOCUS[FOCUS.length-1][1];}
function tiltFrom(n,tiltD,ref,azD){const p=ref.clone().sub(n.clone().multiplyScalar(ref.dot(n)));if(p.lengthSq()<1e-6)p.copy(Math.abs(n.y)<.9?UP:V3(0,0,1)).sub(n.clone().multiplyScalar(n.dot(Math.abs(n.y)<.9?UP:V3(0,0,1))));p.normalize();
  if(azD)p.applyAxisAngle(n,azD*DEG);return n.clone().multiplyScalar(Math.cos(tiltD*DEG)).add(p.multiplyScalar(Math.sin(tiltD*DEG))).normalize();}
const sph=(tD,aD)=>V3(Math.sin(tD*DEG)*Math.sin(aD*DEG),Math.cos(tD*DEG),Math.sin(tD*DEG)*Math.cos(aD*DEG));
const KF=[];
(function(){const k=(L,dir,up)=>KF.push({L,dir:dir.clone().normalize(),up:up.clone().normalize()});
  k(-16.3,V3(1,.35,.3),UP);k(-12.5,V3(1,.15,-.12),UP);k(-9.75,V3(1,0,0),UP);k(-8.6,V3(.05,.15,1),UP);k(-7.3,V3(.55,.42,.72),UP);k(-6.3,V3(0,.42,1),UP);
  k(-5.25,V3(0,1,.42),V3(0,0,-1));k(-3.0,V3(.12,1,.32),V3(0,0,-1));k(-1.45,V3(.05,1,.55),V3(0,0,-1));
  k(0.1,sph(62,14),UP);k(1.6,sph(54,30),UP);k(3.0,sph(46,8),UP);k(4.4,sph(46,-55),UP);k(5.6,sph(28,-40),UP);k(6.6,sph(12,-20),UP);
  const d7=UP.clone().multiplyScalar(.8).add(SUN.clone().multiplyScalar(.35)).add(V3(-.15,0,0)).normalize();k(7.4,d7,AXN);
  const d85=tiltFrom(NECL,62,d7,0);k(8.6,d85,NECL);const d10=tiltFrom(NECL,55,d85,25);k(10.2,d10,NECL);k(12.0,tiltFrom(NECL,48,d10,40),NECL);k(13.5,tiltFrom(NECL,58,d10,70),NECL);
  const d155=tiltFrom(NECL,65,d10,95);k(15.6,d155,NECL);const d175=tiltFrom(GZ,62,d155,0);k(17.6,d175,GZ);k(19.2,tiltFrom(GZ,55,d175,20),GZ);
  const d21=tiltFrom(GZ,38,d175,30);k(21.0,d21,GZ);const m31=galDir(121.17,-21.57);const sideLG=m31.clone().cross(GZ).normalize();const dLG=sideLG.clone().multiplyScalar(.82).add(GZ.clone().multiplyScalar(.45)).add(m31.clone().multiplyScalar(-.2)).normalize();k(22.3,tiltFrom(GZ,50,dLG,0),GZ);k(23.4,dLG,GZ);k(24.6,tiltFrom(GZ,58,d21,110),GZ);k(26.2,tiltFrom(GZ,50,d21,150),GZ);k(27.3,tiltFrom(GZ,45,d21,175),GZ);
  KF.forEach(f=>{const m=new T.Matrix4().lookAt(f.dir,V3(0,0,0),f.up);f.q=new T.Quaternion().setFromRotationMatrix(m);});})();
const _q=new T.Quaternion(),_up=V3();
function orientAt(L,out){let i=0;while(i<KF.length-2&&L>KF[i+1].L)i++;const a=KF[i],b=KF[i+1];const t=sstep(a.L,b.L,L);
  out.q.copy(a.q).slerp(b.q,t);out.n.copy(a.up).lerp(b.up,t).normalize();return out;}

/* ===================== camera + rendering ===================== */
const cam=new T.PerspectiveCamera(FOV,1,.1,10);
const OR={q:new T.Quaternion(),n:V3()};
let W=1,H=1,shortPx=1;
function resize(){W=innerWidth;H=innerHeight;renderer.setPixelRatio(PR);renderer.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();
  SKY.cam.aspect=W/H;SKY.cam.updateProjectionMatrix();shortPx=Math.min(W,H);U.px.value=renderer.getDrawingBufferSize(new T.Vector2()).y/(2*TANH);buildRuler();}
addEventListener("resize",resize);
const dirV=V3(),_rot=new T.Quaternion();
let userAz=0;
function applyFade(def,w){def.S.mats.forEach(m=>{const k=m.userData.k==null?1:m.userData.k;if(m.uniforms&&m.uniforms.uFade)m.uniforms.uFade.value=w*k;else m.opacity=(m.userData.op==null?1:m.userData.op)*w*k;m.visible=w*k>.002;});}
const labelEls=[];const labelsBox=$("#labels");
function labelEl(i){while(labelEls.length<=i){const d=document.createElement("div");d.className="lbl";d.style.opacity="0";labelsBox.appendChild(d);labelEls.push({el:d,text:"",cls:"",op:-1,x:0,y:0});}return labelEls[i];}
const _v=V3();const placed=[];
function render(L,t){
  const ws=weights(L);const f=focusAt(L);orientAt(L,OR);
  _rot.setFromAxisAngle(OR.n,userAz);const q=_rot.clone().multiply(OR.q);
  dirV.set(0,0,1).applyQuaternion(q);
  const aspectK=Math.min(1,W/H);const Dm=.5*Math.pow(10,L)/(TANH*aspectK);
  renderer.clear();
  let li=0;placed.length=0;
  /* sky */
  const sw=skyW(L);if(sw>.003){SKY.cam.quaternion.copy(q);SKY.cam.position.set(0,0,0);applyFade(SKY,sw);renderer.render(SKY.S.scene,SKY.cam);}
  for(let i=0;i<SCENES.length;i++){const w=ws[i];const def=SCENES[i];if(w<.003)continue;if(!def.built)build(def);
    const k=Math.pow(10,-def.s);
    cam.position.set((f[0]-def.O[0]+dirV.x*Dm)*k,(f[1]-def.O[1]+dirV.y*Dm)*k,(f[2]-def.O[2]+dirV.z*Dm)*k);
    cam.quaternion.copy(q);const D=Dm*k;cam.near=D*.004;cam.far=D*600;cam.updateProjectionMatrix();cam.updateMatrixWorld();
    if(def.update)def.update(L,t,cam,w);
    applyFade(def,w);const fk=def.farK||0;def.S.mats.forEach(m=>{if(m.uniforms&&m.uniforms.uNear){m.uniforms.uNear.value=D*.12;if(m.uniforms.uFar)m.uniforms.uFar.value=fk?D*fk:0;}});
    renderer.clearDepth();renderer.render(def.S.scene,cam);
    /* labels */
    const order=def.S.labels.slice().sort((a,b)=>(b.cls?1:0)-(a.cls?1:0));
    for(const lb of order){const a=sstep(lb.lmin,lb.lmin+.25,L)*(1-sstep(lb.lmax-.25,lb.lmax,L))*w;if(a<.02)continue;
      _v.copy(lb.pos).project(cam);if(_v.z>1||_v.z<-1||Math.abs(_v.x)>1.02||Math.abs(_v.y)>1.02)continue;
      let x=(_v.x*.5+.5)*W,y=(-_v.y*.5+.5)*H;const bw=lb.text.length*6.4+14;if(x+bw>W-46)continue;
      let hit=false;for(const r of placed){if(x<r[0]+r[2]&&x+bw>r[0]&&Math.abs(y-r[1])<15){hit=true;break;}}if(hit)continue;placed.push([x,y,bw]);
      const e=labelEl(li++);
      if(e.text!==lb.text){e.el.textContent=lb.text;e.text=lb.text;}if(e.cls!==lb.cls){e.el.className="lbl "+lb.cls;e.cls=lb.cls;}
      e.el.style.transform=`translate(${x.toFixed(1)}px,${(y-8).toFixed(1)}px)`;const op=(a*.95).toFixed(2);if(e.op!==op){e.el.style.opacity=op;e.op=op;}}}
  for(let i=li;i<labelEls.length;i++){if(labelEls[i].op!=="0"){labelEls[i].el.style.opacity="0";labelEls[i].op="0";}}
}

/* ===================== UI: readout, scale bar, captions ===================== */
const UNITS=[["fm",1e-15],["pm",1e-12],["nm",1e-9],["µm",1e-6],["mm",1e-3],["cm",1e-2],["m",1],["km",1e3],["million km",1e9],["AU",AU],["light-years",LY],["million light-years",MLY],["billion light-years",LY*1e9]];
function pickUnit(m){let u=UNITS[0];for(const x of UNITS){if(m>=x[1]*.999)u=x;}if(u[0]==="AU"&&m>=.5*LY)u=UNITS[10];return u;}
function fmtNum(v){if(v>=100)return Math.round(v).toLocaleString("en-US");if(v>=10)return v.toFixed(v%1<.05||v%1>.95?0:1).replace(/\.0$/,"");return (+v.toPrecision(2)).toString();}
function fmtLen(m){const u=pickUnit(m);let v=m/u[1];if(u[0]==="light-years"&&v>=1e3)return fmtNum(v)+" ly";return fmtNum(v)+" "+u[0];}
const SUPN={"-":"⁻","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"};
let lastStop=null,lastPow=null;
const powEl=$("#pow"),famEl=$("#fam"),barEl=$("#bar"),barlEl=$("#barl"),card=$("#card");
function updateUI(L){
  const n=Math.round(clamp(L,-16,27));
  if(n!==lastPow){powEl.innerHTML=`10<sup>${n}</sup><span class="u">m</span>`;lastPow=n;}
  famEl.textContent="view ≈ "+fmtLen(Math.pow(10,L));
  /* scale bar: a round number of the best unit, about a quarter of the short side */
  const mpp=Math.pow(10,L)/shortPx;const ideal=mpp*shortPx*.24;const u=pickUnit(ideal);const iv=ideal/u[1];
  const p=Math.pow(10,Math.floor(Math.log10(iv)));const nv=[1,2,5,10].map(x=>x*p).filter(x=>x<=iv*1.25).pop()||p;
  const px=nv*u[1]/mpp;barEl.style.width=px.toFixed(1)+"px";barlEl.textContent=(nv>=1000?Math.round(nv).toLocaleString("en-US"):(+nv.toPrecision(3)))+" "+(u[0]==="light-years"&&nv===1?"light-year":u[0]);
  const st=STOPS.find(s=>s.L===n);
  if(st!==lastStop){lastStop=st;card.classList.add("fade");clearTimeout(updateUI.t);
    updateUI.t=setTimeout(()=>{$("#name").textContent=st.name;$("#size").textContent=st.size;$("#cap").textContent=st.cap;$("#src").textContent=st.src?("Notes: "+st.src):"";
      card.classList.remove("fade");setCardH();},lastStop&&updateUI.first?180:0);updateUI.first=true;
    document.querySelectorAll("#list button").forEach(b=>b.classList.toggle("cur",+b.dataset.l===n));}
  const k=$("#ruler .knob");if(k){k.style.top=rulerY(L)+"px";}
  $("#ruler").setAttribute("aria-valuenow",n);
}
function setCardH(){document.documentElement.style.setProperty("--cardh",card.offsetHeight+"px");}
$("#cardtog").onclick=()=>{card.classList.toggle("more");setCardH();};

/* ruler */
const ruler=$("#ruler");
function rulerY(L){const h=ruler.clientHeight-12;return 6+(LMAX-L)/(LMAX-LMIN)*h;}
function rulerL(y){const h=ruler.clientHeight-12;return LMAX-(y-6)/h*(LMAX-LMIN);}
function buildRuler(){ruler.querySelectorAll(".tk,.tl,.knob").forEach(e=>e.remove());
  for(let n=-16;n<=27;n++){const t=document.createElement("div");t.className="tk"+(n%5===0?" m":"");t.style.top=rulerY(n)+"px";ruler.appendChild(t);
    if(n%5===0){const l=document.createElement("div");l.className="tl";l.textContent=n;l.style.top=rulerY(n)+"px";ruler.appendChild(l);}}
  const k=document.createElement("div");k.className="knob";ruler.appendChild(k);}
let rulerDrag=false;
ruler.addEventListener("pointerdown",e=>{rulerDrag=true;ruler.setPointerCapture(e.pointerId);stopAuto();const r=ruler.getBoundingClientRect();Lt=clamp(rulerL(e.clientY-r.top),LMIN,LMAX);fast=true;e.preventDefault();});
ruler.addEventListener("pointermove",e=>{if(!rulerDrag)return;const r=ruler.getBoundingClientRect();Lt=clamp(rulerL(e.clientY-r.top),LMIN,LMAX);});
ruler.addEventListener("pointerup",()=>{rulerDrag=false;});
ruler.addEventListener("keydown",e=>{if(e.key==="ArrowUp"){Lt=clamp(Math.round(Lt)+1,LMIN,LMAX);e.preventDefault();}if(e.key==="ArrowDown"){Lt=clamp(Math.round(Lt)-1,LMIN,LMAX);e.preventDefault();}});

/* jump list */
const list=$("#list");
STOPS.slice().reverse().forEach(s=>{const b=document.createElement("button");b.dataset.l=s.L;
  b.innerHTML=`<span class="e">10<sup>${s.L}</sup></span><span><span class="n"></span><span class="s"></span></span>`;b.querySelector(".n").textContent=s.name;b.querySelector(".s").textContent=s.size;
  b.onclick=()=>{stopAuto();Lt=s.L;fast=true;toggleList(false);};list.appendChild(b);});
function toggleList(on){on=on==null?!list.classList.contains("open"):on;list.classList.toggle("open",on);$("#bList").classList.toggle("on",on);$("#bList").setAttribute("aria-expanded",on);
  if(on){const c=list.querySelector("button.cur");if(c)c.scrollIntoView({block:"center"});}}
$("#bList").onclick=()=>toggleList();

/* ===================== input ===================== */
let L=0,Lt=0,fast=false,auto=0,lastInput=0;
const h0=location.hash.match(/L=(-?[\d.]+)/);if(h0){L=Lt=clamp(+h0[1],LMIN,LMAX);}
function hideHint(){$("#hint").classList.add("gone");}
function stopAuto(){auto=0;$("#bIn").classList.remove("on");$("#bOut").classList.remove("on");}
function startAuto(d){if(auto===d){stopAuto();return;}auto=d;fast=false;hideHint();if(d>0&&L>26.9)L=Lt=LMIN+.05;if(d<0&&L<-15.9)L=Lt=LMAX-.05;Lt=L;
  $("#bIn").classList.toggle("on",d<0);$("#bOut").classList.toggle("on",d>0);toggleList(false);}
$("#bIn").onclick=()=>startAuto(-1);$("#bOut").onclick=()=>startAuto(1);
canvas.addEventListener("wheel",e=>{e.preventDefault();stopAuto();hideHint();fast=false;let d=e.deltaY*(e.deltaMode===1?33:e.deltaMode===2?400:1);
  Lt=clamp(Lt+clamp(d,-240,240)*.0016,LMIN,LMAX);},{passive:false});
const ptrs=new Map();let pinch0=0,pinchL=0;
canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});stopAuto();hideHint();fast=false;
  if(ptrs.size===2){const a=[...ptrs.values()];pinch0=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);pinchL=Lt;}});
canvas.addEventListener("pointermove",e=>{const p=ptrs.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(ptrs.size===1){Lt=clamp(Lt+dy*(3.2/Math.max(H,300)),LMIN,LMAX);userAz-=dx*.006;}
  else if(ptrs.size===2){const a=[...ptrs.values()];const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(pinch0>0)Lt=clamp(pinchL-Math.log10(d/pinch0)*1.4,LMIN,LMAX);}});
const endPtr=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch0=0;if(ptrs.size===1){}};
canvas.addEventListener("pointerup",endPtr);canvas.addEventListener("pointercancel",endPtr);
addEventListener("keydown",e=>{if(e.target.closest&&e.target.closest("#list"))return;const k=e.key;
  if(k==="ArrowUp"||k==="+"||k==="="){Lt=clamp(Lt+.25,LMIN,LMAX);stopAuto();}else if(k==="ArrowDown"||k==="-"){Lt=clamp(Lt-.25,LMIN,LMAX);stopAuto();}
  else if(k==="PageUp"){Lt=clamp(Math.floor(Lt+.5)+1,LMIN,LMAX);fast=true;stopAuto();}else if(k==="PageDown"){Lt=clamp(Math.ceil(Lt-.5)-1,LMIN,LMAX);fast=true;stopAuto();}
  else if(k===" "){startAuto(auto||1);e.preventDefault();}else if(k==="Escape")toggleList(false);else return;hideHint();});

/* ===================== loop + adaptive quality ===================== */
let tPrev=performance.now(),acc=0,frames=0,lastBuild=performance.now()+1500,buildQ=SCENES.slice();
const t0=performance.now();
/* the Earth-to-Sun re-centre (L 9.35 to 9.9) crosses 1 AU with nothing on screen: say what is happening */
const travelEl=document.getElementById("travel");let travelOp=-1;
function travelCue(L){if(!travelEl)return;const a=sstep(9.3,9.45,L)*(1-sstep(9.95,10.15,L));const op=a.toFixed(2);if(op!==travelOp){travelOp=op;travelEl.style.opacity=op;}}
function frame(now){requestAnimationFrame(frame);
  const dt=Math.min(.1,(now-tPrev)/1000);tPrev=now;U.time.value=(now-t0)/1000;
  if(auto){const d=Math.abs(L-Math.round(L));const rate=.13+.55*sstep(.04,.32,d);Lt=clamp(L+auto*rate*dt,LMIN,LMAX);L=Lt;if(L<=LMIN+.01||L>=LMAX-.01)stopAuto();}
  else{const k=1-Math.exp(-dt*(fast?3.2:7));let step=(Lt-L)*k;const cap=(fast?9:20)*dt;step=clamp(step,-cap,cap);L+=step;if(Math.abs(Lt-L)<1e-4){L=Lt;fast=false;}}
  render(L,U.time.value);updateUI(L);travelCue(L);
  /* build the rest of the scenes in the background, nearest first, a few per second */
  if(buildQ.length&&now-lastBuild>350&&!auto){buildQ.sort((a,b)=>Math.abs(mid(a)-L)-Math.abs(mid(b)-L));const d=buildQ.shift();if(!d.built){build(d);lastBuild=performance.now();}}
  else if(buildQ.length&&auto){const nx=SCENES.find(d=>!d.built&&Math.abs(mid(d)-L)<4);if(nx&&now-lastBuild>200){build(nx);lastBuild=performance.now();}}
  /* adaptive resolution */
  acc+=dt;frames++;if(acc>1.2){const fps=frames/acc;
    if(fps<38&&PR>.6){PR=Math.max(.6,PR*.82);resize();}else if(fps>57&&PR<MAXPR){PR=Math.min(MAXPR,PR*1.1);resize();}
    acc=0;frames=0;window.__fps=fps;window.__pr=PR;}
  window.__L=L;
}
function mid(d){const i=SCENES.indexOf(d);const a=i===0?-16:TR[i-1][0],b=i===SCENES.length-1?27:TR[i][0];return (a+b)/2;}
/* test hooks */
window.__powers={SC:SCENES,setL(v){L=Lt=clamp(v,LMIN,LMAX);stopAuto();},weights,scenes:SCENES.map(s=>s.id),get L(){return L;},buildAll(){SCENES.forEach(build);},auto:startAuto};

resize();
/* build the scenes around the starting scale first */
weights(L).forEach((w,i)=>{if(w>0)build(SCENES[i]);});
updateUI(L);setCardH();
requestAnimationFrame(t=>{tPrev=t;frame(t);$("#load").classList.add("gone");});
setTimeout(hideHint,9000);
})();

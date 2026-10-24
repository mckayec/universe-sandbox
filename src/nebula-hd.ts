import * as THREE from 'three';

// High-definition procedural nebula rendering.
//
// Three layers, all procedural and generated on the GPU or once per session:
//  1. "Sheets": camera-facing billboards that sample a high-resolution nebula image baked
//     once on the GPU (domain-warped ridged fbm, dust lanes with rim lighting, multi-line
//     emission colours). Baked textures are cached per look and shared between nebulae.
//  2. A raymarched emission/absorption volume (desktop tiers only) that samples a small
//     cached tileable 3D noise texture instead of evaluating hash noise per step.
//  3. Embedded stars: soft round point stars plus a few bright stars with diffraction spikes.
//
// Every texture and shader fades to zero well before its quad/volume edge.

export type NebulaTier = 'performance' | 'balanced' | 'mobile';
export interface NebulaBuildOptions { tier: NebulaTier; compact: boolean; quality: number }

// Variant order matches NEBULA_VARIANTS in celestial-catalog.ts.
export const enum NebulaLook { Emission = 0, Reflection = 1, Planetary = 2, Dark = 3, Remnant = 4 }

let bakeRenderer: THREE.WebGLRenderer | null = null;
const stepUniform = { value: 48 };
const pointScaleUniform = { value: 600 };
const bakeCache = new Map<string, THREE.Texture>();
let noiseTexture: THREE.Data3DTexture | null = null;
let bakeMaterial: THREE.ShaderMaterial | null = null;
let bakeScene: THREE.Scene | null = null;
let bakeCamera: THREE.OrthographicCamera | null = null;
let currentTier: NebulaTier = 'balanced';
const drawingSize = new THREE.Vector2();
const tmpMatrix = new THREE.Matrix4();

function seeded(seed: number, salt = 0) { const n = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453123; return n - Math.floor(n) }

export function setNebulaRenderer(renderer: THREE.WebGLRenderer, tier: NebulaTier) { bakeRenderer = renderer; currentTier = tier; setNebulaQuality(1) }

/** Scales raymarch step counts with the adaptive/user quality setting (shared by all nebulae). */
export function setNebulaQuality(scale: number) {
  const base = currentTier === 'performance' ? 72 : currentTier === 'balanced' ? 52 : 28;
  stepUniform.value = Math.max(20, Math.round(base * THREE.MathUtils.clamp(scale, .55, 1)));
}

// Palettes (sRGB hex; THREE.Color converts to linear). core, A (H-alpha), B (OIII / reflection), C (SII / warm), rim, star tints
interface Palette { core: number; a: number; b: number; c: number; rim: number; dust: number; stars: number[]; haze: string[] }
const PALETTES: Palette[][] = [
  // Emission: Trifid, Eagle/Pillars (Hubble palette), Orion
  [
    { core: 0xfff1f4, a: 0xff3d78, b: 0x3a8cff, c: 0xff8a5c, rim: 0xffd2b8, dust: 0x05030a, stars: [0xffffff, 0xcfe2ff, 0xffe6c8], haze: ['#c2306f', '#2f63c9'] },
    { core: 0xfff6d8, a: 0xe7b25a, b: 0x2fb7b0, c: 0xff7a3c, rim: 0xfff0c0, dust: 0x0a0604, stars: [0xffffff, 0xffe1b0, 0xbfefff], haze: ['#2a8a8f', '#9a6a2a'] },
    { core: 0xfff4ee, a: 0xff4f7a, b: 0x6b7dff, c: 0xffa070, rim: 0xffe0d0, dust: 0x07040a, stars: [0xffffff, 0xd6e4ff, 0xffd8c0], haze: ['#b83a8a', '#3a4fc0'] },
  ],
  // Reflection
  [
    { core: 0xf4f9ff, a: 0x5aa8ff, b: 0x2d55d8, c: 0x9fd4ff, rim: 0xe6f2ff, dust: 0x030510, stars: [0xffffff, 0xcfe4ff, 0xa8ccff], haze: ['#2f6fd0', '#18307e'] },
    { core: 0xf0fbff, a: 0x6fd0ff, b: 0x3a63e6, c: 0xc4a0ff, rim: 0xe0f6ff, dust: 0x030510, stars: [0xffffff, 0xd8f0ff, 0xb0d0ff], haze: ['#3c8ad8', '#2a2c8a'] },
    { core: 0xf8fbff, a: 0x7fb4ff, b: 0x2448b8, c: 0xff9ec8, rim: 0xffffff, dust: 0x040510, stars: [0xffffff, 0xd8e8ff, 0xffd0e8], haze: ['#3a6ec8', '#6a3a9a'] },
  ],
  // Planetary: Helix, Cat's Eye, Butterfly
  [
    { core: 0xeaffff, a: 0xff4a3a, b: 0x30d8c8, c: 0xffb04a, rim: 0xfff0d0, dust: 0x0a0406, stars: [0xffffff, 0xd8f8ff, 0xffe0c0], haze: ['#1f9a90', '#9a2a3a'] },
    { core: 0xf4ffff, a: 0xff5aa0, b: 0x39e0d6, c: 0xffc070, rim: 0xffffff, dust: 0x05040a, stars: [0xffffff, 0xd0fff8, 0xffe4b0], haze: ['#2aa8a0', '#a0367a'] },
    { core: 0xffffff, a: 0xff6a4a, b: 0x7ad0ff, c: 0xffd27a, rim: 0xffe8c8, dust: 0x0a0503, stars: [0xffffff, 0xe0f0ff, 0xffe0b8], haze: ['#4a80c0', '#a05030'] },
  ],
  // Dark molecular cloud silhouetted against glowing gas (Horsehead / Seagull edge)
  [
    { core: 0xffe0e6, a: 0xd8344e, b: 0x4a6ad8, c: 0xff7a50, rim: 0xffb8a0, dust: 0x020102, stars: [0xffffff, 0xffd6c0, 0xc8d8ff], haze: ['#7a1f30', '#24204a'] },
    { core: 0xfff0e0, a: 0xc44a38, b: 0x2c6a9a, c: 0xe8a060, rim: 0xffd0a0, dust: 0x020101, stars: [0xffffff, 0xffe0c0, 0xc0d8ff], haze: ['#6a2a20', '#1a2a44'] },
    { core: 0xffe8f0, a: 0xe04a7a, b: 0x5a5ad8, c: 0xff8a6a, rim: 0xffc0c8, dust: 0x020102, stars: [0xffffff, 0xffd8e8, 0xd0d0ff], haze: ['#7a2048', '#262050'] },
  ],
  // Supernova remnant: Crab, Veil, Cassiopeia-like
  [
    { core: 0xeaf6ff, a: 0xff5a2a, b: 0x5ab8ff, c: 0xffd060, rim: 0xfff0b0, dust: 0x060302, stars: [0xffffff, 0xd8ecff, 0xffe8c0], haze: ['#2a6ab8', '#a04020'] },
    { core: 0xf0ffff, a: 0xff4a6a, b: 0x3ad0ff, c: 0x9affc0, rim: 0xffffff, dust: 0x040306, stars: [0xffffff, 0xd0f0ff, 0xffd0e0], haze: ['#2a8ac0', '#a02a5a'] },
    { core: 0xfff8f0, a: 0xff6a3a, b: 0x8a7aff, c: 0x7affd0, rim: 0xfff4d0, dust: 0x050304, stars: [0xffffff, 0xe8e0ff, 0xd0ffe8], haze: ['#5a4ac0', '#b05028'] },
  ],
];

// ---------- GLSL ----------
const NOISE2D = `
float h21(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
vec2 grd(vec2 i){float a=h21(i)*6.2831853;return vec2(cos(a),sin(a));}
float gn(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*f*(f*(f*6.-15.)+10.);
 return 1.45*mix(mix(dot(grd(i),f),dot(grd(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),mix(dot(grd(i+vec2(0.,1.)),f-vec2(0.,1.)),dot(grd(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);}
const mat2 RM=mat2(.8,.6,-.6,.8);
float fbm(vec2 p,int o){float v=0.,a=.5;for(int i=0;i<10;i++){if(i>=o)break;v+=a*gn(p);p=RM*p*2.02+vec2(17.1,-9.3);a*=.5;}return v;}
float ridged(vec2 p,int o){float v=0.,a=.5,w=1.;for(int i=0;i<10;i++){if(i>=o)break;float n=1.-abs(gn(p));n*=n;v+=n*a*w;w=clamp(n*1.5,0.,1.);p=RM*p*2.05+vec2(-5.3,11.7);a*=.52;}return v;}
vec2 warp(vec2 p,float s){vec2 q=vec2(fbm(p,4),fbm(p+vec2(5.2,1.3),4));return p+s*vec2(fbm(p+2.2*q+vec2(1.7,9.2),5),fbm(p+2.2*q+vec2(8.3,2.8),5));}
`;

const BAKE_FRAG = `
precision highp float;
varying vec2 vUv;
uniform float seed;uniform int kind;uniform int sub;uniform int layer;uniform int oct;
uniform vec3 cCore;uniform vec3 cA;uniform vec3 cB;uniform vec3 cC;uniform vec3 cRim;
${NOISE2D}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,s,-s,c);}
float n01(vec2 p,int o){return fbm(p,o)*.6+.5;}
// Soft-edged dust density. p: centred coords, w: mildly warped coords.
float dustField(vec2 p,vec2 w,vec2 so){
 float r=length(p);
 float base=n01(w*1.35+so.yx+vec2(3.1,7.7),oct);
 float d=smoothstep(.5,.78,base)*(.55+.6*n01(w*4.2+so,oct));
 if(kind==0){
  if(sub==0){ // Trifid: three soft dark lanes radiating from the core
   float a=atan(p.y,p.x)+fbm(w*1.1,5)*.45;
   float lane=1.-smoothstep(.0,.2+r*.2,abs(sin(a*1.5+so.x)));
   lane*=smoothstep(.04,.2,r)*smoothstep(.85,.35,r);
   d=max(d*.55,lane*(.55+.55*n01(w*3.5,oct)));
  } else if(sub==1){ // Eagle: pillars rising from the lower edge toward the light
   vec2 q=p;
   float xw=q.x+fbm(vec2(q.y*2.2,so.y),5)*.08;
   float cols=n01(vec2(xw*2.6+so.x,.5),4);
   float top=-.9+1.45*smoothstep(.45,.85,cols);
   float width=smoothstep(.52,.66,cols);
   float pillar=width*smoothstep(.04,-.06,q.y-top-fbm(vec2(q.x*9.,so.x),4)*.05)*smoothstep(-.98,-.55,q.y);
   float base=smoothstep(-.4,-.75,q.y+fbm(vec2(q.x*2.,so.x),5)*.25);
   d=max(d*.45,max(pillar,base)*(.7+.45*n01(w*5.,oct)));
  } else { // Orion: dark bay plus scattered globules
   float bay=smoothstep(.55,.78,n01(w*1.1+so,5)+smoothstep(.1,.9,p.x+p.y*.4)*.22);
   d=max(d*.7,bay*(.6+.5*n01(w*4.,oct)));
  }
 } else if(kind==1){
  d*=.75;
 } else if(kind==2){
  if(sub==2){ vec2 q=rot(so.x)*p; d=max(d*.15,exp(-pow(q.x/.06,2.)-pow(q.y/.2,2.))*(.75+.4*n01(w*6.,oct))); }
  else d*=.1;
 } else if(kind==3){
  vec2 q=rot(so.x*.15)*p;
  float edge=-.1+fbm(vec2(q.x*2.,so.y),6)*.22;
  float head=exp(-pow((q.x-.15)/.11,2.)-pow((q.y-edge-.2)/.17,2.));
  head=max(head,exp(-pow((q.x-.08-(q.y-edge)*.4)/.07,2.)-pow((q.y-edge-.08)/.1,2.)));
  float body=smoothstep(.04,-.06,q.y-edge-fbm(w*3.,5)*.05);
  d=max(d*.5,max(body,smoothstep(.35,.7,head))*(.8+.3*n01(w*5.,oct)));
 } else d*=.25;
 return clamp(d,0.,1.);
}
vec3 tone(vec3 c){return 1.-exp(-c);}
void main(){
 vec2 p=vUv*2.-1.;
 float r=length(p);
 vec2 so=vec2(fract(seed*.6180339)*40.,fract(seed*.4142)*40.);
 vec3 col=vec3(0.);float dust=0.;
 if(layer==1){ // outer halo: faint broad wisps, mostly colour
  vec2 w=p*1.2+so;w+=vec2(fbm(w,4),fbm(w+5.2,4))*.45;
  float n=n01(w,oct);
  float fil=ridged(w*1.7+so.yx,oct);
  float env=exp(-r*r*3.6)*(1.-smoothstep(.55,.95,r));
  float g=env*(pow(n,3.)*1.6+fil*fil*fil*.45);
  vec3 c=mix(cB,cA,smoothstep(.4,.6,n01(w*.5+so*.3,4)));
  c=mix(c,cC,smoothstep(.55,.9,fil)*.4);
  col=c*g*.8;
  dust=env*smoothstep(.55,.8,n01(w*2.+so.yx,oct))*.5;
 } else {
  float wscale=kind==4?1.6:kind==2?1.15:1.35;
  vec2 w=p*wscale+so;
  vec2 q=vec2(fbm(w*.9,5),fbm(w*.9+vec2(5.2,1.3),5));
  w+=q*(kind==2?.18:kind==4?.35:.42);
  float cloud=n01(w,oct);                  // fluffy large-scale
  float cloud2=n01(w*2.1+vec2(3.3,1.7),oct);
  float fil=ridged(w*1.8+so.yx,oct);       // filaments
  float fine=ridged(w*4.8+so,oct);         // fine wisps
  float hair=ridged(w*11.+q*2.+so.yx,oct);  // hair-thin strands
  float detail=pow(fil,1.6)*.9+pow(fine,2.)*.8+pow(hair,3.)*.55;
  float gas=0.;vec3 c=cA;float core=0.;
  if(kind==0){
   float edge=r+(cloud-.5)*.7;
   float env=smoothstep(.95,.1,edge);
   vec2 cp=sub==2?p-vec2(.08,.1):p;
   core=exp(-dot(cp,cp)*(sub==2?40.:28.));
   gas=env*(pow(cloud,2.2)*1.4+pow(cloud2,3.)*.5)*(.3+detail*1.25)+core*.3;
   float blueZone=smoothstep(.42,.62,n01(w*.5+so*.2,4)+p.y*(sub==0?.45:.05)-(sub==2?.1:0.));
   float t=clamp(r*1.4+(cloud-.5)*.6,0.,1.);
   c=mix(cCore,cA,smoothstep(.0,.18,t));
   c=mix(c,cB,blueZone*(sub==1?.8:.7)*smoothstep(.1,.45,r));
   c=mix(c,cC,smoothstep(.6,.95,fil)*.4*smoothstep(.15,.5,r));
  } else if(kind==1){
   vec2 s=rot(so.x)*p;
   float streak=n01(vec2(s.x*1.1,s.y*5.)+q*.8+so,oct);
   float env=smoothstep(.95,.05,r+(cloud-.5)*.6);
   core=exp(-r*r*34.);
   gas=env*(pow(cloud,2.)*1.1+pow(streak,2.5)*.9)*(.4+detail*.8)+core*.25;
   c=mix(cCore,cA,smoothstep(.0,.15,r));
   c=mix(c,cB,smoothstep(.2,.75,r+(streak-.5)*.5));
   c=mix(c,cC,smoothstep(.65,.95,fil)*.2);
  } else if(kind==2){
   vec2 qq=rot(so.x)*p;
   if(sub==0){ // Helix: thick knotty ring, OIII interior, faint outer halo
    float rr=length(qq*vec2(1.,1.15))+(cloud-.5)*.14;
    float a=atan(qq.y,qq.x);
    float ring=exp(-pow((rr-.45)/(.12+.05*cloud2),2.));
    float knots=ridged(vec2(a*7.,rr*9.)+so+q,oct);
    float inner=smoothstep(.45,.05,rr);
    float outer=exp(-pow((rr-.72)/.1,2.))*(.2+fil*.6);
    gas=ring*(.35+knots*.9+fine*.35)*1.1+inner*(.25+cloud*.5)+outer*.5;
    c=mix(cB,cA,smoothstep(.32,.55,rr+(knots-.5)*.08));
    c=mix(c,cC,smoothstep(.5,.7,rr)*.5);
    core=exp(-rr*rr*200.)*.8;
   } else if(sub==1){ // Cat's Eye: nested noisy shells, bright bubble, filamentary halo
    float sh=0.;
    for(int k=0;k<4;k++){
     float fk=float(k);vec2 e=rot(fk*.75+so.y)*qq;
     float rr=length(e*vec2(1.,1.5+fk*.15))+(cloud-.5)*.06;
     sh+=exp(-pow((rr-(.18+fk*.11))/(.035+fk*.01),2.))*(1.-fk*.18);
    }
    float bub=exp(-pow(length(qq*vec2(1.,1.7))/.22,2.));
    float halo=exp(-pow((length(qq)-.62)/.2,2.))*(.15+pow(fil,2.)*.9);
    gas=sh*(.5+fine*.7)*.9+bub*.55+halo*.6;
    c=mix(cB,cCore,bub*.45);
    c=mix(c,cA,smoothstep(.2,.55,length(qq)+(fil-.5)*.15)*.9);
    c=mix(c,cC,smoothstep(.45,.7,length(qq))*.4);
    core=exp(-dot(qq,qq)*500.)*1.;
   } else { // Butterfly: bipolar lobes with filaments
    float ax=abs(qq.x);
    float lobe=exp(-pow((ax-.42)/.3,2.)-pow(qq.y/(.05+ax*.5),2.))*smoothstep(.0,.08,ax);
    float wisps=ridged(vec2(qq.x*2.,qq.y*6.)+q,oct);
    gas=lobe*(.35+wisps*1.1+fine*.35)+exp(-dot(qq,qq)*60.)*.6;
    c=mix(cCore,cB,smoothstep(.0,.25,ax));
    c=mix(c,cA,smoothstep(.25,.7,ax+(wisps-.5)*.3));
    c=mix(c,cC,smoothstep(.55,.85,wisps)*.4);
    core=exp(-dot(qq,qq)*160.)*.7;
   }
  } else if(kind==3){
   vec2 qq=rot(so.x*.15)*p;
   float env=smoothstep(.95,.15,r+(cloud-.5)*.4);
   // streaky glowing curtain above the dark cloud (Horsehead / IC 434)
   float streak=n01(vec2(qq.x*5.,qq.y*1.2)+q*.6+so,oct);
   float glowSide=smoothstep(-.3,.25,qq.y);
   gas=env*(pow(cloud,1.8)*.9+pow(streak,2.)*.8)*(.3+detail*1.1)*(.5+glowSide*.9);
   c=mix(cA,cC,smoothstep(.55,.9,fil)*.35);
   c=mix(c,cB,smoothstep(.55,.8,n01(w*.5+so,4))*.45);
  } else { // remnant
   vec2 qq=rot(so.x)*p;
   float rr=length(qq*vec2(1.,1.3))+(cloud-.5)*.22;
   float env=smoothstep(.92,.55,rr);
   if(sub==1){ // Veil-like shell: thin wrinkled arcs
    float wr=ridged(w*2.6+so,oct);
    float shell=exp(-pow((rr-.6+(wr-.5)*.08)/.06,2.));
    gas=shell*(.25+pow(wr,2.)*1.6)+env*pow(fine,3.)*.2;
    c=mix(cB,cA,smoothstep(.4,.7,wr+(cloud-.5)*.5));
    c=mix(c,cC,smoothstep(.7,.95,fine)*.3);
   } else { // Crab: filament cage around a blue synchrotron glow
    float web=pow(ridged(w*2.4+so,oct),2.2)*1.3+pow(fine,3.)*.5;
    float sync=exp(-rr*rr*4.5);
    gas=env*(web*(.4+smoothstep(.1,.65,rr))+sync*(.35+cloud*.35));
    c=mix(cB,cA,smoothstep(.2,.6,rr+(cloud-.5)*.3)*smoothstep(.15,.55,web));
    c=mix(c,cC,smoothstep(.65,1.,web)*.5);
    c=mix(c,cCore,sync*.25);
   }
  }
  dust=dustField(p,w,so);float rawDust=dust;
  dust*=smoothstep(.0,.35,dust)*(.75+.5*hair)+ (1.-smoothstep(.0,.35,dust))*hair*.6;
  dust=clamp(dust,0.,1.);
  // rim lighting: dust edges facing the central light get a bright ionisation front
  vec2 toC=-normalize(p+1e-4)*.025;
  float dIn=dustField(p+toC,w+toC*wscale,so);
  float rim=clamp((rawDust-dIn)*3.5,0.,1.)*smoothstep(.15,.6,rawDust)*(1.-smoothstep(.55,.9,dIn))*(kind==3?1.:kind==0?.75:.25);
  float env2=1.-smoothstep(.55,.95,r);
  col=c*gas+cCore*core;
  col*=1.-dust*(kind==3?.96:.85);
  col+=mix(cA,cRim,.55)*rim*env2*(.25+fine*.75)*.6;
  dust*=env2;
 }
 float rn=r*(1.+(fbm(p*1.6+so*.7,4))*.45);
 float mask=(1.-smoothstep(.45,.92,rn))*(1.-smoothstep(.85,.98,r));
 col=tone(max(col,0.)*1.25)*mask;dust*=mask;
 float a=clamp(dust*.9,0.,1.);
 gl_FragColor=vec4(sqrt(col),a);
}`;

function ensureBakePipeline() {
  if (bakeMaterial) return;
  bakeMaterial = new THREE.ShaderMaterial({
    uniforms: { seed: { value: 0 }, kind: { value: 0 }, sub: { value: 0 }, layer: { value: 0 }, oct: { value: 7 }, cCore: { value: new THREE.Color() }, cA: { value: new THREE.Color() }, cB: { value: new THREE.Color() }, cC: { value: new THREE.Color() }, cRim: { value: new THREE.Color() } },
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader: BAKE_FRAG, depthTest: false, depthWrite: false, blending: THREE.NoBlending, toneMapped: false,
  });
  bakeScene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bakeMaterial); quad.frustumCulled = false; bakeScene.add(quad);
  bakeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
}

function bakedTexture(kind: number, sub: number, layer: number, size: number, palette: Palette): THREE.Texture | null {
  if (!bakeRenderer) return null;
  const key = `${kind}:${sub}:${layer}:${size}`;
  const cached = bakeCache.get(key); if (cached) return cached;
  ensureBakePipeline();
  const target = new THREE.WebGLRenderTarget(size, size, { type: THREE.UnsignedByteType, format: THREE.RGBAFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, stencilBuffer: false });
  target.texture.colorSpace = THREE.NoColorSpace;
  target.texture.anisotropy = Math.min(4, bakeRenderer.capabilities.getMaxAnisotropy());
  const u = bakeMaterial!.uniforms;
  u.seed.value = 11.3 + kind * 7.1 + sub * 3.7 + layer * 1.9; u.kind.value = kind; u.sub.value = sub; u.layer.value = layer;
  u.oct.value = Math.max(5, Math.min(9, Math.round(Math.log2(size) - 2)));
  u.cCore.value.setHex(palette.core); u.cA.value.setHex(palette.a); u.cB.value.setHex(palette.b); u.cC.value.setHex(palette.c); u.cRim.value.setHex(palette.rim);
  const previous = bakeRenderer.getRenderTarget(), autoClear = bakeRenderer.autoClear;
  bakeRenderer.autoClear = true; bakeRenderer.setRenderTarget(target); bakeRenderer.render(bakeScene!, bakeCamera!); bakeRenderer.setRenderTarget(previous); bakeRenderer.autoClear = autoClear;
  bakeCache.set(key, target.texture);
  return target.texture;
}

function ensureNoiseTexture() {
  if (noiseTexture) return noiseTexture;
  // Tileable smooth value-noise fbm (periods 4, 8, 16 lattice cells) in a 64^3 R8 volume.
  const N = 64, data = new Uint8Array(N * N * N);
  const lattice = (period: number, salt: number) => { const l = new Float32Array(period * period * period); for (let i = 0; i < l.length; i++) l[i] = seeded(i * 1.37 + salt, salt * 3.1); return l };
  const octaves = [4, 8, 16].map((period, i) => ({ period, l: lattice(period, 17 + i * 31), amp: [.55, .3, .15][i] }));
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  for (let z = 0; z < N; z++) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let v = 0;
    for (const o of octaves) {
      const P = o.period, fx = x / N * P, fy = y / N * P, fz = z / N * P, ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz), tx = fade(fx - ix), ty = fade(fy - iy), tz = fade(fz - iz);
      const at = (a: number, b: number, c: number) => o.l[((a % P) * P + (b % P)) * P + (c % P)];
      const x0 = ix, x1 = ix + 1, y0 = iy, y1 = iy + 1, z0 = iz, z1 = iz + 1;
      const c00 = at(x0, y0, z0) + (at(x1, y0, z0) - at(x0, y0, z0)) * tx, c10 = at(x0, y1, z0) + (at(x1, y1, z0) - at(x0, y1, z0)) * tx;
      const c01 = at(x0, y0, z1) + (at(x1, y0, z1) - at(x0, y0, z1)) * tx, c11 = at(x0, y1, z1) + (at(x1, y1, z1) - at(x0, y1, z1)) * tx;
      const c0 = c00 + (c10 - c00) * ty, c1 = c01 + (c11 - c01) * ty;
      v += (c0 + (c1 - c0) * tz) * o.amp;
    }
    data[(z * N + y) * N + x] = Math.round(THREE.MathUtils.clamp((v - .5) * 1.6 + .5, 0, 1) * 255);
  }
  const tex = new THREE.Data3DTexture(data, N, N, N);
  tex.format = THREE.RedFormat; tex.type = THREE.UnsignedByteType;
  tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = tex.wrapR = THREE.RepeatWrapping; tex.unpackAlignment = 1; tex.needsUpdate = true;
  noiseTexture = tex;
  return tex;
}

function raymarchMaterial(seed: number, kind: number, sub: number, palette: Palette, tier: NebulaTier) {
  const octaves = tier === 'performance' ? 5 : 4;
  // Note: textures live inside `uniforms`, so disposeObject() never frees the shared noise volume.
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }, seed: { value: seed * .31 }, density: { value: .82 }, compression: { value: 0 }, tidal: { value: 0 }, cameraLocal: { value: new THREE.Vector3() },
      steps: stepUniform, noiseTex: { value: ensureNoiseTexture() }, kind: { value: kind }, sub: { value: sub },
      cCore: { value: new THREE.Color(palette.core) }, cA: { value: new THREE.Color(palette.a) }, cB: { value: new THREE.Color(palette.b) }, cC: { value: new THREE.Color(palette.c) },
    },
    transparent: true, side: THREE.BackSide, depthWrite: false, toneMapped: false,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    vertexShader: 'varying vec3 vLocal;void main(){vLocal=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `
precision highp sampler3D;
varying vec3 vLocal;
uniform float time;uniform float seed;uniform float density;uniform float compression;uniform float tidal;uniform float steps;
uniform vec3 cameraLocal;uniform sampler3D noiseTex;uniform int kind;uniform int sub;
uniform vec3 cCore;uniform vec3 cA;uniform vec3 cB;uniform vec3 cC;
float tn(vec3 p){return texture(noiseTex,p).r;}
float fbm3(vec3 p){float v=0.,a=.5,n=0.;for(int i=0;i<${octaves};i++){v+=a*tn(p);n+=a;p=p*2.03+vec3(.31,.17,.43);a*=.5;}return v/n;}
vec2 sphereHit(vec3 ro,vec3 rd,float radius){float b=dot(ro,rd);float c=dot(ro,ro)-radius*radius;float h=b*b-c;if(h<0.)return vec2(-1.);h=sqrt(h);return vec2(-b-h,-b+h);}
void main(){
 vec3 ro=cameraLocal,rd=normalize(vLocal-ro);
 vec2 hit=sphereHit(ro,rd,.98);if(hit.y<=0.)discard;
 float nearT=max(hit.x,0.),span=max(.001,hit.y-nearT);
 float jitter=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233))+seed)*43758.5453);
 float stepSize=span/steps;
 vec3 acc=vec3(0.);float T=1.;
 vec3 so=vec3(fract(seed*.37),fract(seed*.61),fract(seed*.83));
 for(int i=0;i<96;i++){
  if(float(i)>=steps)break;
  float t=nearT+(float(i)+jitter)*stepSize;
  vec3 p=ro+rd*t;p.x/=1.+tidal*.18;p.y*=1.+compression*.16;
  vec3 w=p*.3+so+vec3(0.,time*.0035,0.);
  vec3 wp=p+(vec3(tn(w),tn(w+vec3(.37,.11,.73)),tn(w+vec3(.61,.83,.29)))-.5)*.85;
  float n=fbm3(wp*.38+so);
  float rf=fbm3(wp*.85+so.zxy);float ridge=1.-abs(rf*2.-1.);ridge=ridge*ridge*ridge;
  float r=length(wp);float shape;float bound=smoothstep(.97,.72,length(p));
  if(kind==2){float rr=length(wp*vec3(1.,1.2,1.));shape=exp(-pow((rr-.6)/.2,2.))+exp(-rr*rr*14.)*.4;}
  else if(kind==4){float rr=length(wp*vec3(1.,1.25,1.2));shape=smoothstep(1.02,.5,rr)*(.4+.6*smoothstep(.1,.55,rr));}
  else shape=smoothstep(.95,.1,r);
  shape*=bound;
  float gas=shape*clamp((n-.38)*2.4+ridge*.85+compression*.25,0.,1.6);
  float dustN=fbm3(wp*.55+so.yzx+vec3(.5));
  float dust=shape*smoothstep(.5,.66,dustN)*(kind==3?2.6:kind==0?1.25:.55);
  float light=.3+.9/(1.+9.*dot(p,p));
  vec3 col=mix(cCore,cA,smoothstep(.05,.55,r+(n-.5)*.4));
  col=mix(col,cB,smoothstep(.55,.75,n+p.y*.3)*.65);
  col=mix(col,cC,smoothstep(.55,.9,ridge)*.35);
  float sig=gas*density*(kind==2?.35:kind==4?.6:1.);
  acc+=T*col*sig*light*stepSize*1.35;
  T*=exp(-(dust*density*6.5+sig*.35)*stepSize);
  if(T<.02)break;
 }
 float a=1.-T;
 if(a<.004&&dot(acc,acc)<1e-5)discard;
 gl_FragColor=vec4(acc*(1.+compression*.3),a*.9);
}`,
  });
}

function sheetMaterial(map: THREE.Texture, size: number, rotation: number, drift: number, flip: number, opacity: number, gain: number) {
  return new THREE.ShaderMaterial({
    uniforms: { map: { value: map }, size: { value: size }, rot: { value: rotation }, drift: { value: drift }, flip: { value: flip }, opacity: { value: opacity }, gain: { value: gain }, time: { value: 0 }, compression: { value: 0 }, fade: { value: 1 } },
    transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    vertexShader: `uniform float size;uniform float rot;uniform float drift;uniform float time;uniform float flip;varying vec2 vUv;
void main(){vUv=vec2(flip>0.?1.-uv.x:uv.x,uv.y);vec4 mv=modelViewMatrix*vec4(0.,0.,0.,1.);
 float sx=length(modelMatrix[0].xyz),sz=length(modelMatrix[2].xyz),sy=length(modelMatrix[1].xyz);
 vec2 s=vec2(sx,(sz+sy)*.5)*size;float a=rot+time*drift;float c=cos(a),si=sin(a);
 mv.xy+=mat2(c,si,-si,c)*(position.xy*s);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform sampler2D map;uniform float opacity;uniform float gain;uniform float compression;uniform float fade;varying vec2 vUv;
void main(){vec4 t=texture2D(map,vUv);vec3 c=t.rgb*t.rgb*gain*(1.+compression*.45);
 float d=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)/255.;
 float o=opacity*fade;gl_FragColor=vec4(max(c*o+d,0.),t.a*o);}`,
  });
}

function starPointsMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { pxScale: pointScaleUniform, time: { value: 0 }, opacity: { value: 1 } },
    transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute vec3 tint;attribute float starSize;uniform float pxScale;uniform float time;varying vec3 vTint;varying float vSize;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.);float tw=.85+.15*sin(time*1.7+position.x*13.+position.z*7.);
 gl_PointSize=clamp(starSize*pxScale/max(1.,-mv.z),1.5,28.);vSize=gl_PointSize;vTint=tint*tw;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform float opacity;varying vec3 vTint;varying float vSize;
void main(){vec2 d=gl_PointCoord-.5;float r=length(d)*2.;if(r>1.)discard;
 float core=exp(-r*r*18.);float halo=exp(-r*r*4.)*.35*(1.-smoothstep(.7,1.,r));
 float spikes=(exp(-abs(d.x)*vSize*1.2)+exp(-abs(d.y)*vSize*1.2))*(1.-r)*.35*smoothstep(10.,18.,vSize);
 gl_FragColor=vec4(vTint*(core*1.6+halo+spikes)*opacity,1.);}`,
  });
}

function softGlowTexture(color: string) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, color); g.addColorStop(.25, `${color}aa`); g.addColorStop(.55, `${color}33`); g.addColorStop(.85, `${color}08`); g.addColorStop(1, `${color}00`);
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function spikeStarTexture(size: number) {
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d')!, h = size / 2;
  x.globalCompositeOperation = 'lighter';
  const halo = x.createRadialGradient(h, h, 0, h, h, h * .5);
  halo.addColorStop(0, 'rgba(255,255,255,1)'); halo.addColorStop(.08, 'rgba(255,255,255,.9)'); halo.addColorStop(.25, 'rgba(255,255,255,.25)'); halo.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = halo; x.fillRect(0, 0, size, size);
  // four diffraction spikes (plus two faint secondary ones) that fade out before the edge
  const spike = (angle: number, length: number, width: number, alpha: number) => {
    x.save(); x.translate(h, h); x.rotate(angle);
    const g = x.createLinearGradient(-length, 0, length, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5 - .5 * .12, `rgba(255,255,255,${alpha * .5})`); g.addColorStop(.5, `rgba(255,255,255,${alpha})`); g.addColorStop(.5 + .5 * .12, `rgba(255,255,255,${alpha * .5})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.beginPath(); x.moveTo(-length, 0); x.lineTo(0, -width); x.lineTo(length, 0); x.lineTo(0, width); x.closePath(); x.fill(); x.restore();
  };
  spike(0, h * .94, size * .012, .9); spike(Math.PI / 2, h * .94, size * .012, .9);
  spike(Math.PI / 4, h * .45, size * .006, .22); spike(-Math.PI / 4, h * .45, size * .006, .22);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/** Builds all nebula child parts into `group`. Part names match the update code in main.ts. */
export function buildNebulaVisual(group: THREE.Group, seed: number, opts: NebulaBuildOptions) {
  const kind = ((seed % 5) + 5) % 5 as NebulaLook;
  const sub = Math.floor(seed / 60) % 3;
  const palette = PALETTES[kind][sub];
  const { tier, compact } = opts;
  group.userData.nebulaLook = kind;

  // 1. Raymarched volume (desktop tiers). Same name/uniforms as before so gameplay updates still drive it.
  if (tier !== 'mobile') {
    const volume = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), raymarchMaterial(seed, kind, sub, palette, tier));
    volume.scale.set(7.7, kind === 2 ? 4.2 : 3.05, 7.1); volume.rotation.y = seeded(seed, 89) * Math.PI;
    volume.name = 'nebulaRaymarch'; volume.renderOrder = 2; volume.raycast = () => {};
    const cameraLocal = (volume.material as THREE.ShaderMaterial).uniforms.cameraLocal.value as THREE.Vector3;
    volume.onBeforeRender = (_r, _s, cam) => { cameraLocal.copy(cam.position).applyMatrix4(tmpMatrix.copy(volume.matrixWorld).invert()) };
    group.add(volume);
  }

  // 2. Soft outer haze (pickable sprites, also give the cloud a large clickable footprint).
  for (let i = 0; i < 2; i++) {
    const haze = new THREE.Sprite(new THREE.SpriteMaterial({ map: softGlowTexture(palette.haze[i]), transparent: true, opacity: .05, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    haze.scale.set(19 - i * 3, 14 + i * 2, 1); haze.position.set((i - .5) * 2.4, 0, (i - .5) * 2);
    haze.userData.baseOpacity = .05; haze.name = 'nebulaHaze'; group.add(haze);
  }

  // 3. Baked high-resolution sheets.
  const mainSize = tier === 'performance' ? 2048 : tier === 'balanced' ? 1024 : 768;
  const haloSize = Math.max(512, mainSize / 2);
  const halo = bakedTexture(kind, sub, 1, haloSize, palette), main = bakedTexture(kind, sub, 0, mainSize, palette);
  const sheetScale = kind === 2 ? .82 : 1;
  const addSheet = (map: THREE.Texture | null, size: number, opacity: number, gain: number, order: number, offset: THREE.Vector3, flip: number, rotation: number) => {
    if (!map) return;
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), sheetMaterial(map, size, rotation, (seeded(seed, 300 + order) - .5) * .006, flip, opacity, gain));
    sheet.position.copy(offset); sheet.frustumCulled = false; sheet.raycast = () => {}; sheet.renderOrder = order;
    sheet.name = 'nebulaSheet'; sheet.userData.nebulaHD = 'sheet'; sheet.userData.baseOpacity = opacity; group.add(sheet);
  };
  const flip = seeded(seed, 401) > .5 ? 1 : 0, baseRot = (seeded(seed, 402) - .5) * (kind === 0 && sub === 1 ? .5 : Math.PI * 2);
  addSheet(halo, 27 * sheetScale, .85, 1, 1, new THREE.Vector3(0, -.4, 0), 1 - flip, baseRot + 1.3);
  addSheet(main, 17.5 * sheetScale, 1, (tier === 'mobile' ? 1.1 : .9) * (kind === 1 ? .8 : 1), 3, new THREE.Vector3(0, .2, 0), flip, baseRot);
  if (!compact && main && (kind === 0 || kind === 1 || kind === 3)) addSheet(main, 11 * sheetScale, .3, .8, 4, new THREE.Vector3(.6, .6, .4), 1 - flip, baseRot + 2.4);

  // 4. Bright embedded stars with diffraction spikes.
  const star = spikeStarTexture(compact ? 128 : 256);
  const knotCount = compact ? 4 : 7;
  for (let i = 0; i < knotCount; i++) {
    const tint = new THREE.Color(palette.stars[i % palette.stars.length]);
    const bright = i === 0 && kind !== 3;
    const material = new THREE.SpriteMaterial({ map: star, color: tint, transparent: true, opacity: .75 + seeded(seed, i + 100) * .25, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
    const knot = new THREE.Sprite(material), size = bright ? 2.2 : .9 + seeded(seed, i + 110) * 1.6;
    knot.scale.setScalar(size);
    const spread = kind === 2 ? .25 : 1;
    if (bright) knot.position.set(0, .3, 0);
    else knot.position.set((seeded(seed, i + 120) - .5) * 9 * spread, (seeded(seed, i + 130) - .5) * 5 * spread, (seeded(seed, i + 140) - .5) * 8 * spread);
    knot.userData.baseOpacity = material.opacity; knot.name = 'nebulaKnot'; knot.renderOrder = 5; group.add(knot);
  }

  // 5. Embedded star field: round, soft, size-varied points (replaces the square point sprites).
  const count = Math.round((compact ? 160 : 340) * THREE.MathUtils.clamp(opts.quality, .6, 1));
  const pos = new Float32Array(count * 3), tints = new Float32Array(count * 3), sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = Math.pow(seeded(seed, i + 150), .55) * 7.2, a = seeded(seed, i + 500) * Math.PI * 2, y = (seeded(seed, i + 850) - .5) * 6.5 * (1 - r / 9);
    pos.set([Math.cos(a) * r, y, Math.sin(a) * r * .9], i * 3);
    const c = new THREE.Color(palette.stars[i % palette.stars.length]).multiplyScalar(.55 + seeded(seed, i + 1200) * .7);
    tints.set([c.r, c.g, c.b], i * 3);
    sizes[i] = .06 + Math.pow(seeded(seed, i + 1500), 6) * .45;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('tint', new THREE.BufferAttribute(tints, 3)); geo.setAttribute('starSize', new THREE.BufferAttribute(sizes, 1));
  const points = new THREE.Points(geo, starPointsMaterial()); points.name = 'nebulaDust'; points.renderOrder = 6; points.userData.nebulaHD = 'stars'; group.add(points);
  return group;
}

/** Per-frame hook for HD-only parts. massRatio is mass/birthMass clamped to [0.05,1]. */
export function updateNebulaPart(object: THREE.Object3D, compression: number, massRatio: number) {
  const material = (object as THREE.Mesh).material;
  if (!(material instanceof THREE.ShaderMaterial)) return;
  if (object.userData.nebulaHD === 'sheet') {
    material.uniforms.compression.value = compression;
    material.uniforms.fade.value = .5 + .5 * Math.sqrt(massRatio);
  } else if (object.userData.nebulaHD === 'stars') {
    material.uniforms.opacity.value = .6 + .4 * Math.sqrt(massRatio);
  }
}

/** Call once per frame (cheap) so point-star sizes track the drawing buffer and camera FOV. */
export function updateNebulaFrame(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
  renderer.getDrawingBufferSize(drawingSize);
  pointScaleUniform.value = drawingSize.y / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) * .5));
}


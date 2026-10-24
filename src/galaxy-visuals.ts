import * as THREE from 'three';

// Photographic galaxy renderer for the exhibit's galaxy builders.
//
// Every galaxy is assembled from three GPU-cheap layers:
//   1. galaxyDisk     – one procedural plane shader carrying the unresolved light: exponential disk,
//                       logarithmic spiral density, bar, H-II knots and reddening dust lanes (premultiplied
//                       blending so dust actually absorbs light from things behind it).
//   2. galaxyBulge    – a camera-facing Sersic / King profile glow with an astrophotography-style asinh stretch.
//   3. galaxyStarField / galaxyNursery – a single Points draw each with per-star size, colour and brightness.
// Particle counts scale with the compact flag and the quality setting; nothing allocates per frame.

export type GalaxyVisualStyle = 'spiral' | 'lenticular' | 'elliptical' | 'irregular' | 'globular';
export type GalaxyBuildOptions = { compact: boolean; quality: number };

/** Shared per-frame uniform: drawing-buffer height (pixels) used to size star points. */
export const galaxyUniforms = { uViewportH: { value: 900 } };

function seeded(seed: number, salt = 0) {
  const n = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

// ---------------------------------------------------------------------------------------------
// Shared spiral-structure model (identical maths on CPU and GPU so stars sit inside the shader arms)
// ---------------------------------------------------------------------------------------------
type SpiralParams = {
  arms: number;
  tanPitch: number;
  phase0: number;
  warp: number;
  minor: number;
  barLen: number;
  barWidth: number;
  barAngle: number;
  armStart: number;
  seed: number;
};
function armPhase(s: SpiralParams, r: number, theta: number) {
  const lr = Math.log(Math.max(r, 0.02)),
    w = s.warp * (Math.sin(3 * theta + 2 * lr + s.seed) * 0.6 + Math.sin(5 * theta - 3 * lr + s.seed * 1.7) * 0.4);
  return s.arms * (theta - lr / s.tanPitch) + s.phase0 + w;
}
function armDensity(s: SpiralParams, r: number, theta: number) {
  const phase = armPhase(s, r, theta),
    main = Math.pow(0.5 + 0.5 * Math.cos(phase), 3),
    minor = s.minor * Math.pow(0.5 - 0.5 * Math.cos(phase), 4),
    window =
      THREE.MathUtils.smoothstep(r, s.armStart * 0.75, s.armStart + 0.12) *
      (1 - THREE.MathUtils.smoothstep(r, 0.85, 1.15));
  return { arm: Math.max(main, minor) * window, dust: Math.pow(0.5 + 0.5 * Math.cos(phase - 0.62), 9) * window, phase };
}

const NOISE_GLSL = /* glsl */ `
float sq(float x){return x*x;}
float hash12(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash12(i),hash12(i+vec2(1.,0.)),u.x),mix(hash12(i+vec2(0.,1.)),hash12(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<OCT;i++){v+=a*vnoise(p);p=m*p+7.3;a*=.5;}return v;}
// compact point-like sources: one random point per cell, kept with probability (1-keep); gaussian of radius rad (cell units)
float spots(vec2 p,float keep,float rad){vec2 i=floor(p),f=fract(p);float best=0.;
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 n=vec2(float(x),float(y));vec2 c=i+n;
    if(hash12(c+19.7)<keep)continue;vec2 o=vec2(hash12(c),hash12(c+7.1))*.8+.1;vec2 d=n+o-f;
    best=max(best,exp(-dot(d,d)/(rad*rad))*(.5+.5*hash12(c+3.3)));}
  return best;}
// periodic-in-x noise for log-polar (spiral-aligned) coordinates: no seam where atan wraps
float vnoiseP(vec2 p,float P){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);float x0=mod(i.x,P),x1=mod(i.x+1.,P);
  return mix(mix(hash12(vec2(x0,i.y)),hash12(vec2(x1,i.y)),u.x),mix(hash12(vec2(x0,i.y+1.)),hash12(vec2(x1,i.y+1.)),u.x),u.y);}
float fbmP(vec2 p,float P){float v=0.,a=.5;for(int i=0;i<OCT;i++){v+=a*vnoiseP(p,P);p=p*2.+vec2(0.,7.3);P*=2.;a*=.5;}return v;}
float ridgedP(vec2 p,float P){float v=0.,a=.5;for(int i=0;i<OCT;i++){float n=1.-abs(vnoiseP(p,P)*2.-1.);v+=a*n*n;p=p*2.+vec2(0.,3.1);P*=2.;a*=.5;}return v;}
float ridged(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<OCT;i++){float n=1.-abs(vnoise(p)*2.-1.);v+=a*n*n;p=m*p+3.1;a*=.5;}return v;}
`;

const DISK_VERTEX = /* glsl */ `
uniform float uExtent;varying vec2 vP;
void main(){vP=position.xz/uExtent;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

const DISK_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vP;
uniform float uStyle,uSeed,uArms,uTanPitch,uPhase0,uWarp,uMinor,uBarLen,uBarWidth,uBarAngle,uArmStart;
uniform float uFloc,uDust,uKnots,uRingR,uRingDust,uScale,uInter,uArmGain,uBright,uCoreBoost;
uniform vec3 uCore,uDiskCol,uArmCol,uHII,uYoung;
uniform vec4 uClumps[5];
${NOISE_GLSL}
void main(){
  vec2 p=vP;float r=length(p);
  float edge=1.-smoothstep(.82,1.2,r);
  float th=atan(p.y,p.x+1e-5),lr=log(max(r,.02));
  vec2 sp=p*uScale+uSeed*3.7;
  float patchN=fbm(sp*1.3);
  float fil=ridged(sp*2.6+patchN*1.8);
  float emitArm=0.,dust=0.,knotsB=0.,knotsP=0.,disk=0.,core=0.;
  vec3 baseCol=mix(uCore,uDiskCol,smoothstep(.04,.55,r));
  if(uStyle<.5){
    // ---------------- spiral ----------------
    float w=uWarp*(sin(3.*th+2.*lr+uSeed)*.6+sin(5.*th-3.*lr+uSeed*1.7)*.4);
    // spiral-aligned texture: cells stretched along the arms so dust and star clouds form arcs, not a web
    float sa=(th-lr/uTanPitch)/6.2831853;
    float lp=lr+uSeed*.37;
    patchN=fbmP(vec2(sa*12.,lp*2.2),12.);
    fil=ridgedP(vec2(sa*40.,lp*5.5)+patchN*vec2(1.5,.6),40.);
    float phase=uArms*(th-lr/uTanPitch)+uPhase0+w+uFloc*(patchN-.5)*4.2;
    float win=smoothstep(uArmStart*.75,uArmStart+.12,r)*(1.-smoothstep(.85,1.15,r));
    float mainA=pow(max(0.,.5+.5*cos(phase)),3.),minorA=uMinor*pow(max(0.,.5-.5*cos(phase)),4.);
    float arm=max(mainA,minorA)*win;
    // flocculent: break the arms into short curved fragments (spiral-aligned noise, short along the arm)
    float frag=fbmP(vec2(sa*34.,lp*7.)+uSeed*.21,34.);
    float fragMask=smoothstep(.46,.66,frag);
    arm=mix(arm,max(arm*fragMask*.8,fragMask*smoothstep(.25,.6,patchN)*.85)*win,uFloc);
    disk=exp(-r/.27);
    emitArm=arm;
    float lane=(pow(max(0.,.5+.5*cos(phase-.55)),16.)+.2*pow(max(0.,.5+.5*cos(phase-.9)),24.))*win*(.25+.95*smoothstep(.3,.62,patchN))+uMinor*.45*pow(max(0.,.5-.5*cos(phase-.55)),18.)*win;
    float coreLanes=pow(max(0.,.5+.5*cos(phase-.62)),6.)*smoothstep(.03,.1,r)*(1.-win)*.55;
    // flocculent dust: many short brown filaments everywhere instead of continuous lanes
    float shortFil=ridgedP(vec2(sa*72.,lp*13.)+frag*vec2(2.,.8),72.);
    float flocDust=smoothstep(.55,.8,shortFil)*smoothstep(.35,.65,fbmP(vec2(sa*20.,lp*5.)+3.7,20.))*1.2*win;
    dust=uDust*(mix((lane*1.6+coreLanes)*(.15+1.25*smoothstep(.2,.75,fil)),flocDust+coreLanes*.6,uFloc))*(1.-smoothstep(.55,1.,r))*smoothstep(.05,.14,r+uFloc*.1);
    // H-II regions: dozens of small crisp pink knots hugging the OUTER (trailing) edge of the arms
    float outer=pow(max(0.,.5+.5*cos(phase+.5)),5.)*win;
    float hii=spots(p*95.+uSeed,.5,.075)+spots(p*61.+uSeed*1.3,.62,.08)*.8;
    knotsP=1.6*hii*smoothstep(.12,.55,max(outer,uFloc*fragMask*.6))*uKnots*(1.-smoothstep(.95,1.1,r))*smoothstep(.1,.22,r);
    // grainy, mottled arms: unresolved star clouds at several scales
    float clouds=spots(p*30.+uSeed*2.,.35,.2)*.6+spots(p*72.+uSeed*3.,.3,.16)*.55;
#if OCT>3
    clouds+=spots(p*150.+uSeed*4.,.25,.14)*.45;
#endif
    knotsB=(clouds+smoothstep(.55,.95,fil)*.3)*arm*uKnots;
    if(uBarLen>0.){
      float c=cos(uBarAngle),s=sin(uBarAngle);vec2 pb=vec2(c*p.x+s*p.y,-s*p.x+c*p.y);
      // boxy, clearly elongated stellar bar (super-ellipse profile) with a warm colour
      float ax=abs(pb.x)/uBarLen,ay=abs(pb.y)/uBarWidth;
      float bq=pow(pow(ax,3.)+pow(ay,2.2),.42);
      float bar=exp(-pow(max(bq,1e-4),2.6)*2.2)*(.75+.25*exp(-ax*ax*3.));
      core+=bar*1.15;
      // the disk inside the bar radius is swept clear by the bar: dim it so the bar stands out
      disk*=1.-.55*smoothstep(uBarLen*1.15,uBarLen*.35,r)*(1.-bar);
      // offset dust lanes on the leading edges (opposite sides at each end of the bar)
      float side=sign(pb.x);
      dust+=uDust*1.1*exp(-sq((pb.y*side-uBarWidth*.85)/(uBarWidth*.28)))*(1.-smoothstep(.45,1.15,ax))*smoothstep(.03,.08,r)*(.45+.8*fil);
    }
  } else if(uStyle<1.5){
    // ---------------- lenticular ----------------
    disk=exp(-r/.15)+.12*exp(-r/.36);
    float ring=exp(-sq((r-uRingR)/(.012+.01*patchN)));
    dust=uRingDust*ring*(.7+.5*fil)+uDust*.25*smoothstep(.55,.9,fil)*smoothstep(.25,.45,r)*(1.-smoothstep(.6,.8,r));
  } else {
    // ---------------- irregular ----------------
    float d=0.;
    for(int i=0;i<5;i++){vec2 q=p-uClumps[i].xy;d+=uClumps[i].w*exp(-dot(q,q)/(uClumps[i].z*uClumps[i].z));}
    float c=cos(uBarAngle),s=sin(uBarAngle);vec2 pb=vec2(c*(p.x-uClumps[0].x)+s*(p.y-uClumps[0].y),-s*(p.x-uClumps[0].x)+c*(p.y-uClumps[0].y));
    float bar=exp(-pow(max(1e-4,length(vec2(pb.x/uBarLen,pb.y/uBarWidth))),1.8)*2.);
    d=d*(.35+1.3*patchN)+bar*.55;
    disk=d;emitArm=smoothstep(.25,.9,d*(.6+.8*fil));
    core=bar*.35;
    knotsP=spots(p*40.+uSeed,.6,.09)*smoothstep(.15,.6,d)*uKnots;
    knotsB=(spots(p*48.+uSeed*2.,.55,.1)*.5+smoothstep(.55,.9,fil)*.3)*smoothstep(.1,.5,d)*uKnots;
    dust=uDust*smoothstep(.55,.9,fil)*smoothstep(.2,.6,d)*(.6+.6*patchN);
    baseCol=mix(uDiskCol,uCore,clamp(bar,0.,1.)*.6);
  }
  // unresolved stellar light: smooth disk + bluer arms + inter-arm blue haze (never black between arms)
  vec3 light=baseCol*disk*uInter;
  light+=uArmCol*disk*emitArm*uArmGain*(.7+.6*fil);
  light+=uCore*core*uCoreBoost;
  light+=uYoung*knotsB*disk*2.2+uHII*knotsP*(1.4+disk*3.);
  light*=edge;
  // dust: wavelength-dependent extinction (blue absorbed most -> brown lanes)
  vec3 T=exp(-dust*vec3(1.05,1.45,2.2));
  vec3 col=light*T*uBright;
  float a=clamp((1.-(T.r+T.g+T.b)/3.)*edge*smoothstep(.0,.06,disk),0.,.92);
  gl_FragColor=vec4(max(col,vec3(0.)),a);
}`;

const GLOW_VERTEX = /* glsl */ `
uniform float uSize;varying vec2 vUv;
void main(){vec4 mv=modelViewMatrix*vec4(0.,0.,0.,1.);vUv=position.xy;
  // slide the billboard toward the camera (keeping its angular size) so the galaxy plane / grid never slices it
  float z0=-mv.z,z1=max(z0-uSize,z0*.35),k=z1/max(z0,1e-3);mv.z=-z1;
  mv.xy=mv.xy*k+position.xy*uSize*k;gl_Position=projectionMatrix*mv;}`;

const GLOW_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uProfile,uAxis,uRe,uN,uIntensity,uStretch,uAngle;
uniform vec3 uInner,uOuter;
void main(){
  float rr=length(vUv);if(rr>1.){discard;}
  float c=cos(uAngle),s=sin(uAngle);vec2 q=vec2(c*vUv.x+s*vUv.y,(-s*vUv.x+c*vUv.y)/uAxis);
  float r=length(q),I;
  if(uProfile<.5){float b=2.*uN-.327;I=exp(-b*pow(max(r/uRe,1e-5),1./uN));}
  else if(uProfile<1.5){float x=1./sqrt(1.+r*r/(uRe*uRe))-1./sqrt(1.+1./(uRe*uRe));I=max(x,0.);I*=I;I/=pow(1.-1./sqrt(1.+1./(uRe*uRe)),2.);}
  else{I=exp(-r*r/(uRe*uRe));}
  float L=log(1.+uStretch*I)/log(1.+uStretch);
  float fade=1.-smoothstep(.35,1.,rr);fade*=fade;
  vec3 col=mix(uOuter,uInner,smoothstep(.15,.85,L));
  gl_FragColor=vec4(col*L*fade*uIntensity,1.);
}`;

const STAR_VERTEX = /* glsl */ `
attribute float aSize;attribute vec3 aColor;
uniform float uViewportH,uRef,uSoft;
varying vec3 vColor;
void main(){
  vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;
  float att=clamp(uRef/max(-mv.z,1.),.45,1.7);
  float px=aSize*att*uViewportH/900.;
  float a=1.;if(px<1.6){a=px/1.6;px=1.6;}
  gl_PointSize=min(px,72.);
  vColor=aColor*a;
}`;

const STAR_FRAGMENT = /* glsl */ `
precision mediump float;
varying vec3 vColor;uniform float uSoft;
void main(){
  vec2 d=gl_PointCoord*2.-1.;float r2=dot(d,d);if(r2>1.){discard;}
  float core=exp(-r2*mix(14.,3.2,uSoft)),halo=exp(-r2*3.)*(1.-r2)*mix(.22,.65,uSoft);
  gl_FragColor=vec4(vColor*(core+halo),1.);
}`;

function starMaterial(soft: number, ref: number) {
  return new THREE.ShaderMaterial({
    uniforms: { uViewportH: galaxyUniforms.uViewportH, uRef: { value: ref }, uSoft: { value: soft } },
    vertexShader: STAR_VERTEX,
    fragmentShader: STAR_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
}

function glowMesh(
  name: string,
  size: number,
  opts: {
    profile: number;
    axis: number;
    re: number;
    n?: number;
    intensity: number;
    stretch: number;
    inner: string;
    outer: string;
    angle?: number;
  },
) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: {
        uSize: { value: size },
        uProfile: { value: opts.profile },
        uAxis: { value: opts.axis },
        uRe: { value: opts.re },
        uN: { value: opts.n ?? 4 },
        uIntensity: { value: opts.intensity },
        uStretch: { value: opts.stretch },
        uAngle: { value: opts.angle ?? 0 },
        uInner: { value: new THREE.Color(opts.inner) },
        uOuter: { value: new THREE.Color(opts.outer) },
      },
      vertexShader: GLOW_VERTEX,
      fragmentShader: GLOW_FRAGMENT,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  mesh.name = name;
  mesh.renderOrder = 3;
  mesh.frustumCulled = false;
  mesh.raycast = () => {};
  return mesh;
}

// Star colour palette (linear-ish RGB). Tuned so additive sums read as photographic colour, not neon.
const C = {
  blue: [0.55, 0.7, 1.0],
  blueWhite: [0.78, 0.86, 1.0],
  white: [1.0, 0.96, 0.9],
  yellow: [1.0, 0.84, 0.58],
  orange: [1.0, 0.64, 0.36],
  red: [1.0, 0.46, 0.26],
  pink: [1.0, 0.38, 0.6],
  hydrogen: [1.0, 0.3, 0.42],
} as const;

class StarBuffer {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  n = 0;
  constructor(public capacity: number) {
    this.positions = new Float32Array(capacity * 3);
    this.colors = new Float32Array(capacity * 3);
    this.sizes = new Float32Array(capacity);
  }
  push(x: number, y: number, z: number, col: readonly number[], brightness: number, size: number) {
    if (this.n >= this.capacity) return;
    const i = this.n++;
    this.positions[i * 3] = x;
    this.positions[i * 3 + 1] = y;
    this.positions[i * 3 + 2] = z;
    this.colors[i * 3] = col[0] * brightness;
    this.colors[i * 3 + 1] = col[1] * brightness;
    this.colors[i * 3 + 2] = col[2] * brightness;
    this.sizes[i] = size;
  }
  toPoints(name: string, soft: number, ref: number) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions.subarray(0, this.n * 3), 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(this.colors.subarray(0, this.n * 3), 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(this.sizes.subarray(0, this.n), 1));
    geometry.computeBoundingSphere();
    const points = new THREE.Points(geometry, starMaterial(soft, ref));
    points.name = name;
    points.renderOrder = 2;
    points.raycast = () => {};
    return points;
  }
}

/** Seeded PRNG stream (mulberry32) — cheap and deterministic per galaxy. */
function rng(seed: number) {
  let a = (Math.floor(seed * 2654435761) ^ 0x9e3779b9) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gaussian(rand: () => number) {
  return Math.sqrt(-2 * Math.log(Math.max(1e-6, rand()))) * Math.cos(2 * Math.PI * rand());
}
/** Luminosity function: many faint stars, few bright ones. Returns [brightness, size]. */
function luminosity(rand: () => number, boost = 1): [number, number] {
  const u = rand(),
    l = Math.pow(u, 7);
  return [(0.16 + 1.7 * l) * boost, 1.15 + 3.4 * Math.pow(u, 9) + 0.5 * u];
}
function lerpColor(a: readonly number[], b: readonly number[], t: number) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function diskMesh(extent: number, uniforms: Record<string, THREE.IUniform>, octaves: number) {
  const R = extent * 1.22,
    geometry = new THREE.CircleGeometry(R, 96, 0, Math.PI * 2);
  geometry.rotateX(-Math.PI / 2);
  geometry.computeBoundingSphere();
  const material = new THREE.ShaderMaterial({
    uniforms: { uExtent: { value: extent }, ...uniforms },
    vertexShader: DISK_VERTEX,
    fragmentShader: DISK_FRAGMENT,
    defines: { OCT: octaves },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.ZeroFactor,
    blendDstAlpha: THREE.OneFactor,
    // the scene's reference grid lies in the same y=0 plane: pull the disk forward to avoid z-fighting streaks
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -8,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'galaxyDisk';
  mesh.raycast = () => {};
  mesh.renderOrder = 1; // after the scene grid so grid lines never draw across the galaxy
  return mesh;
}

function baseDiskUniforms(seed: number) {
  return {
    uStyle: { value: 0 },
    uSeed: { value: seeded(seed, 3) * 50 },
    uArms: { value: 2 },
    uTanPitch: { value: 0.3 },
    uPhase0: { value: 0 },
    uWarp: { value: 0.3 },
    uMinor: { value: 0 },
    uBarLen: { value: 0 },
    uBarWidth: { value: 0.05 },
    uBarAngle: { value: 0 },
    uArmStart: { value: 0.12 },
    uFloc: { value: 0 },
    uDust: { value: 1 },
    uKnots: { value: 1 },
    uRingR: { value: 0.45 },
    uRingDust: { value: 0 },
    uScale: { value: 7 },
    uInter: { value: 0.5 },
    uArmGain: { value: 1 },
    uBright: { value: 1 },
    uCoreBoost: { value: 1 },
    uCore: { value: new THREE.Color(1.0, 0.82, 0.55) },
    uDiskCol: { value: new THREE.Color(0.55, 0.62, 0.85) },
    uArmCol: { value: new THREE.Color(0.62, 0.74, 1.0) },
    uHII: { value: new THREE.Color(1.0, 0.32, 0.5) },
    uYoung: { value: new THREE.Color(0.6, 0.78, 1.0) },
    uClumps: { value: [0, 1, 2, 3, 4].map(() => new THREE.Vector4(0, 0, 1, 0)) },
  };
}

// ---------------------------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------------------------
function buildSpiral(root: THREE.Group, seed: number, extent: number, budget: number, octaves: number) {
  const rand = rng(seed * 13 + 1),
    variant = Math.floor(seeded(seed, 5) * 3), // 0 grand design (M74), 1 barred (Milky Way), 2 flocculent (NGC 4414)
    barred = variant === 1,
    flocculent = variant === 2,
    barAngle = seeded(seed, 8) * Math.PI,
    barLen = barred ? 0.36 + seeded(seed, 9) * 0.08 : 0,
    tanPitch = barred ? 0.24 : flocculent ? 0.36 : 0.3,
    arms = flocculent ? 3 : 2,
    spiral: SpiralParams = {
      arms,
      tanPitch,
      phase0: 0,
      warp: flocculent ? 0.7 : 0.28,
      minor: barred ? 0.55 : flocculent ? 0 : 0.25,
      barLen,
      barWidth: 0.08,
      barAngle,
      armStart: barred ? barLen : 0.1,
      seed: seeded(seed, 3) * 50,
    };
  // anchor arm phase so the main arms leave the ends of the bar (or a seeded angle when unbarred)
  const startR = Math.max(spiral.armStart, 0.1),
    startTheta = barred ? barAngle : seeded(seed, 4) * Math.PI * 2;
  spiral.phase0 = 0;
  spiral.phase0 = -armPhase(spiral, startR, startTheta);

  const u = baseDiskUniforms(seed);
  Object.assign(u, {
    uStyle: { value: 0 },
    uSeed: { value: spiral.seed },
    uArms: { value: arms },
    uTanPitch: { value: tanPitch },
    uPhase0: { value: spiral.phase0 },
    uWarp: { value: spiral.warp },
    uMinor: { value: spiral.minor },
    uBarLen: { value: barLen },
    uBarWidth: { value: 0.08 },
    uBarAngle: { value: barAngle },
    uArmStart: { value: spiral.armStart },
    uFloc: { value: flocculent ? 1 : 0 },
    uDust: { value: flocculent ? 1.1 : 0.9 },
    uKnots: { value: flocculent ? 0.75 : 1 },
    uInter: { value: barred ? 0.75 : flocculent ? 0.62 : 0.6 },
    uArmGain: { value: flocculent ? 0.75 : 1.05 },
    uBright: { value: barred ? 1.05 : 1.15 },
    uCoreBoost: { value: barred ? 0.9 : 1 },
    uCore: { value: barred ? new THREE.Color(1.0, 0.78, 0.45) : new THREE.Color(1.0, 0.8, 0.52) },
    uDiskCol: { value: flocculent ? new THREE.Color(0.78, 0.74, 0.8) : new THREE.Color(0.5, 0.6, 0.88) },
    uArmCol: { value: flocculent ? new THREE.Color(0.85, 0.88, 1.0) : new THREE.Color(0.6, 0.74, 1.0) },
  });
  root.add(diskMesh(extent, u, octaves));
  root.add(
    glowMesh('galaxyBulge', extent * (barred ? 0.22 : 0.5), {
      profile: 0,
      axis: barred ? 1 : 0.86,
      re: barred ? 0.14 : 0.17,
      n: 2.2,
      intensity: barred ? 0.32 : 1.5,
      stretch: 60,
      inner: '#fff1d6',
      outer: '#ffb766',
    }),
  );

  const stars = new StarBuffer(budget),
    nursery = new StarBuffer(Math.floor(budget * 0.09)),
    h = 0.27;
  const fragNoise = (r: number, th: number) => {
    const sa = (th - Math.log(Math.max(r, 0.02)) / tanPitch) / (Math.PI * 2),
      x = sa * 34,
      y = (Math.log(Math.max(r, 0.02)) + spiral.seed * 0.37) * 7,
      ix = Math.floor(x),
      iy = Math.floor(y),
      fx = x - ix,
      fy = y - iy,
      h = (a: number, b: number) => seeded((((a % 34) + 34) % 34) + seed * 0.013, b * 1.37 + 5),
      u = fx * fx * (3 - 2 * fx),
      v = fy * fy * (3 - 2 * fy);
    return (h(ix, iy) * (1 - u) + h(ix + 1, iy) * u) * (1 - v) + (h(ix, iy + 1) * (1 - u) + h(ix + 1, iy + 1) * u) * v;
  };
  const dustDim = (r: number, th: number) => {
    const a = armDensity(spiral, r, th);
    return Math.exp(-a.dust * 1.6 * (flocculent ? 1.4 : 1));
  };
  // bulge + bar population (old, warm)
  const bulgeN = Math.floor(budget * (barred ? 0.18 : 0.14));
  for (let i = 0; i < bulgeN; i++) {
    let x: number, z: number, y: number;
    if (barred && rand() < 0.7) {
      const along = (rand() * 2 - 1) * barLen * (0.55 + 0.45 * rand()),
        across = gaussian(rand) * 0.03 * (1 - 0.4 * Math.abs(along / barLen));
      x = Math.cos(barAngle) * along - Math.sin(barAngle) * across;
      z = Math.sin(barAngle) * along + Math.cos(barAngle) * across;
      y = gaussian(rand) * 0.03;
    } else {
      const s = Math.sqrt(rand()),
        r = (0.07 * s) / (1 - s * 0.94),
        ct = rand() * 2 - 1,
        ph = rand() * Math.PI * 2,
        st = Math.sqrt(1 - ct * ct);
      x = r * st * Math.cos(ph);
      z = r * st * Math.sin(ph);
      y = r * ct * 0.7;
    }
    const [b, sz] = luminosity(rand, 0.75),
      col = rand() < 0.25 ? C.orange : rand() < 0.5 ? C.yellow : C.white;
    stars.push(x * extent, y * extent, z * extent, col, b, sz);
  }
  // old disk population: exponential disk, weak arm preference
  const diskN = Math.floor(budget * 0.38);
  for (let i = 0, guard = 0; i < diskN && guard < diskN * 6; guard++) {
    const r = -h * Math.log(Math.max(1e-6, rand() * rand())),
      th = rand() * Math.PI * 2;
    if (r > 1.2) continue;
    const a = armDensity(spiral, r, th);
    if (rand() > 0.45 + 0.55 * a.arm) continue;
    i++;
    const [b, sz] = luminosity(rand, 0.85),
      t = rand(),
      col = t < 0.2 ? C.orange : t < 0.55 ? C.yellow : t < 0.85 ? C.white : C.blueWhite;
    stars.push(
      Math.cos(th) * r * extent,
      gaussian(rand) * 0.012 * extent,
      Math.sin(th) * r * extent,
      col,
      b * dustDim(r, th),
      sz,
    );
  }
  // young arm population: blue-white stars concentrated in the arms
  const armN = Math.floor(budget * 0.4);
  for (let i = 0, guard = 0; i < armN && guard < armN * 14; guard++) {
    const r = spiral.armStart * 0.8 + -0.3 * Math.log(Math.max(1e-6, rand())),
      th = rand() * Math.PI * 2;
    if (r > 1.15) continue;
    const a = armDensity(spiral, r, th),
      accept = flocculent
        ? 0.08 + 0.92 * THREE.MathUtils.smoothstep(fragNoise(r, th), 0.42, 0.7)
        : Math.pow(a.arm, 1.6);
    if (rand() > accept) continue;
    i++;
    if (rand() < 0.35) {
      // a small resolved star cloud: 6-14 stars packed together along the arm
      const n = 6 + Math.floor(rand() * 9),
        cs = 0.004 + rand() * 0.008;
      for (let m = 0; m < n && i < armN; m++, i++) {
        const [cb, csz] = luminosity(rand, 1.0),
          t2 = rand();
        stars.push(
          (Math.cos(th) * r + gaussian(rand) * cs) * extent,
          gaussian(rand) * 0.006 * extent,
          (Math.sin(th) * r + gaussian(rand) * cs) * extent,
          t2 < 0.55 ? C.blueWhite : t2 < 0.8 ? C.blue : C.white,
          cb * dustDim(r, th),
          csz,
        );
      }
      continue;
    }
    const [b, sz] = luminosity(rand, 1.05),
      t = rand(),
      col = t < 0.45 ? C.blueWhite : t < 0.75 ? C.blue : t < 0.92 ? C.white : C.yellow;
    stars.push(
      Math.cos(th) * r * extent,
      gaussian(rand) * 0.008 * extent,
      Math.sin(th) * r * extent,
      col,
      b * dustDim(r, th),
      sz,
    );
  }
  // star-forming knots along the arms: tight clusters of pink H-II gas and hot blue stars
  const knotCount = Math.floor(nursery.capacity / 9);
  for (let k = 0, guard = 0; k < knotCount && guard < knotCount * 60; guard++) {
    const r = 0.14 + rand() * 0.9,
      th = rand() * Math.PI * 2,
      a = armDensity(spiral, r, th),
      outerEdge = Math.pow(Math.max(0, 0.5 + 0.5 * Math.cos(a.phase + 0.5)), 5),
      weight = flocculent
        ? THREE.MathUtils.smoothstep(fragNoise(r, th), 0.45, 0.7) * 0.6
        : Math.min(1, outerEdge * a.arm * 2.5);
    if (rand() > weight) continue;
    k++;
    const cx = Math.cos(th) * r,
      cz = Math.sin(th) * r,
      spread = 0.0015 + rand() * 0.003,
      members = 3 + Math.floor(rand() * 7),
      pinkness = 0.5 + rand() * 0.5;
    // bright compact H-II core so each knot reads as a crisp pink bead
    nursery.push(cx * extent, 0.4, cz * extent, [1.0, 0.2, 0.42], 1.6 + rand() * 1.0, 3.4 + rand() * 2.2);
    for (let m = 0; m < members; m++) {
      const pink = rand() < 0.35 + pinkness * 0.45;
      nursery.push(
        (cx + gaussian(rand) * spread) * extent,
        gaussian(rand) * 0.002 * extent,
        (cz + gaussian(rand) * spread) * extent,
        pink ? (rand() < 0.5 ? C.pink : C.hydrogen) : C.blueWhite,
        pink ? 0.32 + rand() * 0.35 : 0.3 + rand() * 0.5,
        pink ? 1.3 + rand() * 1.4 : 1.1 + rand() * 1.0,
      );
    }
  }
  root.add(stars.toPoints('galaxyStarField', 0, 260));
  root.add(nursery.toPoints('galaxyNursery', 0.35, 260));
  root.userData.variant = variant;
  return 'spiral';
}

function buildLenticular(root: THREE.Group, seed: number, extent: number, budget: number, octaves: number) {
  const rand = rng(seed * 17 + 2),
    ringR = 0.42 + seeded(seed, 12) * 0.12,
    u = baseDiskUniforms(seed);
  Object.assign(u, {
    uStyle: { value: 1 },
    uRingR: { value: ringR },
    uRingDust: { value: 1.1 },
    uDust: { value: 0.5 },
    uInter: { value: 0.85 },
    uBright: { value: 1.0 },
    uScale: { value: 9 },
    uCore: { value: new THREE.Color(1.0, 0.82, 0.58) },
    uDiskCol: { value: new THREE.Color(0.9, 0.82, 0.7) },
  });
  root.add(diskMesh(extent, u, octaves));
  root.add(
    glowMesh('galaxyBulge', extent * 0.62, {
      profile: 0,
      axis: 0.78,
      re: 0.2,
      n: 3.2,
      intensity: 1.6,
      stretch: 120,
      inner: '#fff3dc',
      outer: '#e9a466',
    }),
  );
  const stars = new StarBuffer(budget);
  for (let i = 0; i < budget; i++) {
    const bulge = rand() < 0.35;
    let x: number, y: number, z: number;
    if (bulge) {
      const s = Math.sqrt(rand()),
        r = Math.min(0.9, (0.09 * s) / (1 - s * 0.95)),
        ct = rand() * 2 - 1,
        ph = rand() * Math.PI * 2,
        st = Math.sqrt(1 - ct * ct);
      x = r * st * Math.cos(ph);
      z = r * st * Math.sin(ph);
      y = r * ct * 0.75;
    } else {
      const r = Math.min(1.15, -0.22 * Math.log(Math.max(1e-6, rand() * rand()))),
        th = rand() * Math.PI * 2;
      x = Math.cos(th) * r;
      z = Math.sin(th) * r;
      y = gaussian(rand) * 0.014;
    }
    const r = Math.hypot(x, z),
      ring = Math.exp(-Math.pow((r - ringR) / 0.025, 2)),
      [b, sz] = luminosity(rand, 0.8),
      t = rand(),
      col = t < 0.3 ? C.orange : t < 0.7 ? C.yellow : t < 0.97 ? C.white : C.blueWhite;
    stars.push(x * extent, y * extent, z * extent, col, b * (1 - 0.75 * ring), sz);
  }
  root.add(stars.toPoints('galaxyStarField', 0, 260));
}

function buildElliptical(root: THREE.Group, seed: number, extent: number, budget: number) {
  const rand = rng(seed * 19 + 3),
    axis = 0.62 + seeded(seed, 14) * 0.3,
    angle = (seeded(seed, 15) - 0.5) * 1.2;
  root.add(
    glowMesh('galaxyBulge', extent * 1.25, {
      profile: 0,
      axis,
      re: 0.24,
      n: 4,
      intensity: 0.85,
      stretch: 6000,
      inner: '#fff6ea',
      outer: '#a88a70',
      angle,
    }),
  );
  const stars = new StarBuffer(budget),
    ca = Math.cos(angle),
    sa = Math.sin(angle);
  for (let i = 0; i < budget; i++) {
    const globularCluster = rand() < 0.035;
    // Hernquist profile sampling: r = a*s/(1-s)
    const s = Math.sqrt(rand()),
      r = Math.min(globularCluster ? 1.25 : 1.0, ((globularCluster ? 0.35 : 0.1) * s) / (1 - s * 0.97)),
      ct = rand() * 2 - 1,
      ph = rand() * Math.PI * 2,
      st = Math.sqrt(1 - ct * ct);
    // ellipsoid in the galaxy frame, flattened along y; rotated a little in plane
    const lx = r * st * Math.cos(ph),
      lz = r * st * Math.sin(ph) * (0.6 + axis * 0.4),
      ly = r * ct * axis;
    const x = lx * ca - lz * sa,
      z = lx * sa + lz * ca,
      [b, sz] = luminosity(rand, globularCluster ? 1.0 : 0.6),
      t = rand(),
      col = globularCluster ? C.white : t < 0.35 ? C.orange : t < 0.8 ? C.yellow : t < 0.97 ? C.white : C.red;
    stars.push(x * extent, ly * extent, z * extent, col, b, globularCluster ? sz + 0.8 : sz);
  }
  root.add(stars.toPoints('galaxyStarField', 0, 260));
}

function buildIrregular(root: THREE.Group, seed: number, extent: number, budget: number, octaves: number) {
  const rand = rng(seed * 23 + 4),
    clumps: [number, number, number, number][] = [];
  // main body is off-centre with an offset bar (LMC-like), plus asymmetric secondary clumps
  const bodyAngle = seeded(seed, 21) * Math.PI * 2;
  clumps.push([Math.cos(bodyAngle) * 0.12, Math.sin(bodyAngle) * 0.12, 0.34, 0.9]);
  for (let i = 1; i < 5; i++) {
    const a = bodyAngle + (seeded(seed, 30 + i) - 0.5) * 4.2,
      d = 0.22 + seeded(seed, 40 + i) * 0.45;
    clumps.push([
      Math.cos(a) * d,
      Math.sin(a) * d,
      0.1 + seeded(seed, 50 + i) * 0.18,
      0.35 + seeded(seed, 60 + i) * 0.55,
    ]);
  }
  const barAngle = seeded(seed, 22) * Math.PI,
    u = baseDiskUniforms(seed);
  Object.assign(u, {
    uStyle: { value: 2 },
    uClumps: { value: clumps.map(c => new THREE.Vector4(c[0], c[1], c[2], c[3])) },
    uBarAngle: { value: barAngle },
    uBarLen: { value: 0.26 },
    uBarWidth: { value: 0.07 },
    uDust: { value: 0.9 },
    uKnots: { value: 0.9 },
    uInter: { value: 0.3 },
    uArmGain: { value: 0.4 },
    uBright: { value: 0.7 },
    uScale: { value: 6 },
    uCore: { value: new THREE.Color(1.0, 0.88, 0.7) },
    uDiskCol: { value: new THREE.Color(0.58, 0.68, 0.95) },
    uArmCol: { value: new THREE.Color(0.65, 0.78, 1.0) },
  });
  root.add(diskMesh(extent, u, octaves));
  const density = (x: number, z: number) => {
    let d = 0;
    for (const c of clumps) d += c[3] * Math.exp(-((x - c[0]) ** 2 + (z - c[1]) ** 2) / (c[2] * c[2]));
    return d;
  };
  const stars = new StarBuffer(budget),
    nursery = new StarBuffer(Math.floor(budget * 0.12));
  for (let i = 0, guard = 0; i < budget && guard < budget * 8; guard++) {
    let x: number, z: number;
    if (rand() < 0.22) {
      const along = gaussian(rand) * 0.13,
        across = gaussian(rand) * 0.03;
      x = clumps[0][0] + Math.cos(barAngle) * along - Math.sin(barAngle) * across;
      z = clumps[0][1] + Math.sin(barAngle) * along + Math.cos(barAngle) * across;
    } else {
      const c = clumps[Math.floor(rand() * clumps.length)];
      x = c[0] + gaussian(rand) * c[2] * 0.8;
      z = c[1] + gaussian(rand) * c[2] * 0.8;
      if (rand() > Math.min(1, density(x, z) * 1.4)) continue;
    }
    i++;
    const [b, sz] = luminosity(rand, 0.3),
      t = rand(),
      col = t < 0.4 ? C.blueWhite : t < 0.62 ? C.blue : t < 0.85 ? C.white : t < 0.95 ? C.yellow : C.orange;
    stars.push(x * extent, gaussian(rand) * 0.03 * extent, z * extent, col, b, sz);
  }
  const knotCount = Math.floor(nursery.capacity / 16);
  for (let k = 0; k < knotCount; k++) {
    const c = clumps[Math.floor(rand() * clumps.length)],
      cx = c[0] + gaussian(rand) * c[2] * 0.7,
      cz = c[1] + gaussian(rand) * c[2] * 0.7,
      big = rand() < 0.08,
      spread = big ? 0.025 : 0.005 + rand() * 0.008,
      members = big ? 40 : 5 + Math.floor(rand() * 10);
    for (let m = 0; m < members; m++) {
      const pink = rand() < 0.6;
      nursery.push(
        (cx + gaussian(rand) * spread) * extent,
        gaussian(rand) * 0.01 * extent,
        (cz + gaussian(rand) * spread) * extent,
        pink ? (rand() < 0.5 ? C.pink : C.hydrogen) : C.blueWhite,
        pink ? 0.35 + rand() * 0.4 : 0.3 + rand() * 0.45,
        pink ? 1.8 + rand() * 2.4 : 1.2 + rand() * 1.3,
      );
    }
  }
  root.add(stars.toPoints('galaxyStarField', 0, 260));
  root.add(nursery.toPoints('galaxyNursery', 0.6, 260));
}

function buildGlobular(root: THREE.Group, seed: number, extent: number, budget: number) {
  const rand = rng(seed * 29 + 5),
    a = 0.13;
  root.add(
    glowMesh('galaxyBulge', extent * 0.55, {
      profile: 1,
      axis: 0.97,
      re: 0.06,
      intensity: 0.75,
      stretch: 25,
      inner: '#fff8ec',
      outer: '#ffcf8f',
    }),
  );
  const stars = new StarBuffer(budget);
  for (let i = 0; i < budget; i++) {
    // Plummer sphere sampling
    const r = Math.min(1.25, a / Math.sqrt(Math.pow(Math.max(1e-4, rand()), -2 / 3) - 1)),
      ct = rand() * 2 - 1,
      ph = rand() * Math.PI * 2,
      st = Math.sqrt(1 - ct * ct),
      t = rand();
    let col: readonly number[], b: number, sz: number;
    if (t < 0.035) {
      col = rand() < 0.5 ? C.orange : C.red; // red giants: few, bright
      b = 1.1 + rand() * 1.2;
      sz = 2.6 + rand() * 2.2;
    } else if (t < 0.05) {
      col = C.blue; // blue stragglers
      b = 0.9 + rand() * 0.8;
      sz = 2 + rand() * 1.6;
    } else {
      [b, sz] = luminosity(rand, 0.62);
      col = lerpColor(C.white, C.yellow, rand());
    }
    stars.push(r * st * Math.cos(ph) * extent, r * ct * extent, r * st * Math.sin(ph) * extent, col, b, sz);
  }
  root.add(stars.toPoints('galaxyStarField', 0, 200));
}

/**
 * Build the photographic visual for one galaxy. Returns a group whose children keep the established part names
 * (galaxyStarField, galaxyNursery, galaxyBulge, darkMatterHalo) plus the new galaxyDisk.
 */
export function buildGalaxyVisual(style: GalaxyVisualStyle, seed: number, extent: number, options: GalaxyBuildOptions) {
  const root = new THREE.Group(),
    quality = THREE.MathUtils.clamp(options.quality, 0.5, 1),
    base = options.compact ? 14000 : 52000,
    perStyle = { spiral: 1, lenticular: 0.75, elliptical: 0.8, irregular: 0.6, globular: 0.9 }[style],
    budget = Math.floor(base * perStyle * quality),
    octaves = options.compact || quality < 0.75 ? 3 : 5;
  if (style === 'spiral') buildSpiral(root, seed, extent, budget, octaves);
  else if (style === 'lenticular') buildLenticular(root, seed, extent, budget, octaves);
  else if (style === 'elliptical') buildElliptical(root, seed, extent, budget);
  else if (style === 'irregular') buildIrregular(root, seed, extent, budget, octaves);
  else buildGlobular(root, seed, extent, budget);
  if (style !== 'globular') {
    const halo = glowMesh('darkMatterHalo', extent * 1.9, {
      profile: 2,
      axis: 0.8,
      re: 0.55,
      intensity: 0.05,
      stretch: 2,
      inner: '#3b5aa8',
      outer: '#1c2c5e',
    });
    halo.renderOrder = -4;
    root.add(halo);
  }
  return root;
}

/**
 * A supermassive black hole seen at galaxy scale is a point-like nucleus inside the bulge, not a stellar-mass accretion
 * disk 20% of the galaxy wide. Calm the anchor's oversized cosmetic parts (gameplay body, mass and labels untouched).
 * Jets stay dormant unless matter streams feed the nucleus (they then light up as before).
 */
export function tameGalaxyNucleus(mesh: THREE.Object3D, style: GalaxyVisualStyle) {
  mesh.traverse(child => {
    if (child.name === 'blackHoleJets') child.userData.baseline = 0;
    if (child.name === 'accretionDiskDust' || child.name === 'blackHoleWarmGlow') child.visible = false;
    if (child.name === 'accretionDiskMid') child.scale.setScalar(0.7);
  });
}

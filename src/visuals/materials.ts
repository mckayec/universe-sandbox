// Shader materials for stars, planets, atmospheres, disks, glows and jets.
import * as THREE from 'three';
import { type StageLook } from '../celestial-catalog.ts';
import type { MatterStream } from '../state/types.ts';
import { DISK_FLOW_GLSL, DISK_VERTEX, keplerConstant } from './disk-flow.ts';
import { glowTexture } from './textures.ts';

export const NOISE_GLSL = `float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}`;
export function stellarMaterial(color: number, look?: StageLook, seed = 1) {
  const granules = look?.granules ?? 5,
    turbulence = look?.turbulence ?? 0.08,
    spots = look?.spots ?? 0.08,
    brightness = look?.brightness ?? 1;
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      base: { value: new THREE.Color(color) },
      hot: {
        value: new THREE.Color(color).lerp(
          new THREE.Color(0xffffff),
          look?.temperature && look.temperature > 9000 ? 0.9 : 0.72,
        ),
      },
      granules: { value: granules },
      turbulence: { value: turbulence },
      spotStrength: { value: spots },
      brightness: { value: brightness },
      seed: { value: seed * 0.37 },
      tidal: { value: 0 },
    },
    vertexShader: `varying vec3 vN;varying vec3 vP;uniform float time;uniform float granules;uniform float turbulence;uniform float seed;uniform float tidal;${NOISE_GLSL}void main(){vN=normalize(normalMatrix*normal);vP=normal;float broad=noise(normal*granules*.42+time*.1+seed);float mid=noise(normal*granules*1.35-time*.14-seed);float fine=noise(normal*granules*3.4+time*.18);vec3 p=position+normal*((broad-.5)*.9+(mid-.5)*.35+(fine-.5)*.12)*turbulence;float toward=pow(max(0.,normal.x),3.5);float farSide=pow(max(0.,-normal.x),4.)*.18;p+=normal*length(position)*tidal*(toward*.22+farSide*.07);p.x+=length(position)*tidal*toward*.075;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader: `varying vec3 vN;varying vec3 vP;uniform float time;uniform float seed;uniform vec3 base;uniform vec3 hot;uniform float granules;uniform float spotStrength;uniform float brightness;${NOISE_GLSL}void main(){vec3 q=normalize(vP);float broad=noise(q*granules*.48+vec3(time*.055,seed,0.));float cells=noise(q*granules*1.55+time*.18+seed)+.48*noise(q*granules*3.8-time*.13);float micro=noise(q*granules*8.2+time*.24);float cellLight=smoothstep(.24,1.28,cells);float cellEdge=1.-smoothstep(.035,.16,abs(fract(cells*2.15)-.5));float spotField=noise(q*1.7+vec3(seed,time*.012,0.));float penumbra=smoothstep(.66,.88,spotField)*spotStrength;float core=smoothstep(.8,.94,spotField)*spotStrength;float plage=smoothstep(.68,.92,broad)*spotStrength;float facing=abs(dot(normalize(vN),vec3(0,0,1)));float limb=.48+.52*pow(facing,.32);float rim=pow(1.-facing,3.2);vec3 col=mix(base,hot,cellLight*.68+micro*.08);col+=hot*(cellEdge*.12+plage*.24);col=mix(col,base*.34,penumbra);col=mix(col,base*.07,core);col=(col*limb+base*rim*.22)*brightness;gl_FragColor=vec4(col,1.);}`,
    toneMapped: false,
  });
}
export function rockyMaterial(seed: number) {
  const profiles = [
      [0x25252a, 0x77716c, 0xb3a59a],
      [0x3e1e19, 0xa94e2d, 0xd99155],
      [0x8a562a, 0xd8a95f, 0xf3dca7],
      [0x082d59, 0x2c855f, 0xd4c38a],
      [0x5f8195, 0xc7e4e8, 0xf6fbff],
      [0x09090c, 0x2a2423, 0xff5a16],
      [0x080b12, 0x252a37, 0x776a5d],
      [0x542014, 0xb54a28, 0xe89558],
      [0x132a35, 0x7a432a, 0xe6d3a8],
      [0x384e62, 0x9abac7, 0xf5f4df],
    ],
    variant = seed % profiles.length,
    [low, high, accent] = profiles[variant];
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      low: { value: new THREE.Color(low) },
      high: { value: new THREE.Color(high) },
      accent: { value: new THREE.Color(accent) },
      seed: { value: seed * 0.73 },
      mode: { value: variant },
    },
    vertexShader: `varying vec3 p;varying vec3 n;void main(){p=normal;n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec3 p;varying vec3 n;uniform float time;uniform float seed;uniform float mode;uniform vec3 low;uniform vec3 high;uniform vec3 accent;${NOISE_GLSL}void main(){vec3 q=normalize(p);float broad=noise(q*3.1+seed)+.46*noise(q*8.7-seed);float detail=noise(q*22.+seed*2.);vec3 col=mix(low,high,smoothstep(.3,1.18,broad));if(mode<.5){float crater=smoothstep(.82,.96,noise(q*7.2+seed*3.));col*=1.-crater*.48;col=mix(col,accent,detail*.13);}else if(mode<1.5){col=mix(col,accent,smoothstep(.72,1.22,broad)*.28);col*=.82+.18*detail;}else if(mode<2.5){col=mix(col,accent,smoothstep(.67,1.08,broad)*.32);}else if(mode<3.5){float land=smoothstep(.72,.86,broad);col=mix(low,mix(high,accent,detail*.3),land);float ice=smoothstep(.74,.94,abs(q.y));col=mix(col,vec3(.9,.97,1.),ice*.85);}else if(mode<4.5){float ice=smoothstep(.25,.88,broad);col=mix(low,high,ice);col=mix(col,accent,smoothstep(.72,.98,abs(q.y)));}else if(mode<5.5){float fissure=1.-smoothstep(.025,.11,abs(noise(q*5.4+seed+time*.025)-.5));col=mix(col,accent,fissure*.92);col+=accent*fissure*.42;}else if(mode<6.5){float vein=smoothstep(.67,.84,noise(q*12.+seed));col=mix(col,accent,vein*.32);}else if(mode<7.5){col=mix(col,accent,smoothstep(.52,1.04,broad)*.42);col*=.72+.28*detail;}else if(mode<8.5){float day=smoothstep(-.05,.08,dot(q,normalize(vec3(.8,.1,.4))));col=mix(low,high,day);col=mix(col,accent,smoothstep(.72,.94,detail)*.26);}else{float salt=smoothstep(.6,.82,broad);col=mix(low,high,salt);col=mix(col,accent,smoothstep(.7,.95,detail)*.34);}float daylight=smoothstep(-.18,.28,dot(q,normalize(vec3(.62,.25,.74))));col*=.12+.88*daylight;if(mode>2.5&&mode<3.5){float cities=smoothstep(.84,.94,noise(q*38.+seed*4.));col+=vec3(1.,.55,.16)*cities*(1.-daylight)*.72;}float facing=abs(dot(normalize(n),vec3(0,0,1)));col+=accent*pow(1.-facing,3.)*.08;gl_FragColor=vec4(col,1.);}`,
  });
}
export function gasMaterial(seed: number) {
  const profiles = [
      [0x513222, 0xd7ad72, 0xa84729, 8.5, 0.95],
      [0x8c7048, 0xead8a8, 0xc7a46a, 10.5, 0.3],
      [0x4f98a7, 0xb8e3df, 0xe9ffff, 4.2, 0.15],
      [0x163b83, 0x3f82cf, 0xd9f4ff, 7.2, 0.72],
      [0x55263f, 0xe08856, 0xffcf7b, 9.5, 0.65],
      [0x9b9387, 0xf4eee0, 0xc3b7a7, 6.1, 0.42],
      [0x081b55, 0x126ddd, 0x8ad6ff, 7.8, 0.28],
      [0x5c3011, 0xe4a034, 0xffe1a1, 11.2, 0.58],
      [0x51233e, 0xd37c98, 0xffc1b5, 5.8, 0.5],
      [0x153a48, 0x43808e, 0xa7d8d1, 3.8, 0.2],
    ],
    variant = seed % profiles.length,
    [dark, light, storm, frequency, stormAmount] = profiles[variant];
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      dark: { value: new THREE.Color(dark) },
      light: { value: new THREE.Color(light) },
      storm: { value: new THREE.Color(storm) },
      frequency: { value: frequency },
      stormAmount: { value: stormAmount },
      seed: { value: seed * 0.61 },
      hot: { value: variant === 4 ? 1 : 0 },
    },
    vertexShader: `varying vec3 p;varying vec3 n;void main(){p=normal;n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec3 p;varying vec3 n;uniform float time;uniform float seed;uniform float frequency;uniform float stormAmount;uniform float hot;uniform vec3 dark;uniform vec3 light;uniform vec3 storm;${NOISE_GLSL}void main(){vec3 q=normalize(p);float lon=atan(q.z,q.x);float warp=noise(vec3(lon*1.4,q.y*3.2,seed+time*.035));float lat=q.y*frequency+warp*2.1;float stripes=.5+.5*sin(lat);float fine=.5+.5*sin(lat*2.7+noise(q*8.+seed)*1.4);vec3 col=mix(dark,light,smoothstep(.16,.84,stripes));col=mix(col,light,fine*.16);float stormLon=seed*.47;float dx=abs(atan(sin(lon-stormLon),cos(lon-stormLon)));float oval=length(vec2(dx*.55,(q.y-.13*sin(seed))*3.5));float vortex=smoothstep(.45,.12,oval)*stormAmount;col=mix(col,storm,vortex);float wisps=smoothstep(.72,1.2,noise(q*10.+vec3(time*.045,seed,0.)));col=mix(col,storm,wisps*.12*stormAmount);float polar=smoothstep(.68,.96,abs(q.y));col=mix(col,light,polar*.16);float daylight=smoothstep(-.2,.32,dot(q,normalize(vec3(.62,.25,.74))));col*=.24+.76*daylight;float facing=abs(dot(normalize(n),vec3(0,0,1)));col+=light*hot*pow(1.-facing,3.)*.35;gl_FragColor=vec4(col,1.);}`,
  });
}
export function atmosphereMaterial(color: number, opacity: number, seed: number, clouds = false) {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(color) },
      opacity: { value: opacity },
      seed: { value: seed * 0.39 },
    },
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 p;varying vec3 n;void main(){p=normal;n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec3 p;varying vec3 n;uniform float time;uniform float seed;uniform float opacity;uniform vec3 color;${NOISE_GLSL}void main(){float rim=pow(1.-abs(n.z),2.6);float cloud=${clouds ? 'smoothstep(.46,.8,noise(normalize(p)*5.+vec3(time*.025,seed,0.)))' : '1.'};gl_FragColor=vec4(color*(.65+rim),opacity*(rim*.8+cloud*.25));}`,
    toneMapped: false,
  });
}
/** Black-hole disk layer: 0 hot inner disk, 1 warm mid disk, 2 cool outer dust. All layers co-rotate. */
export function blackHoleDiskMaterial(inner: number, outer: number, layer: number, variant = 0, kepler = 4, spin = 1) {
  const schemes = [
      [0xfffdf2, 0xffbd58, 0xa53812],
      [0xffffff, 0xffce78, 0x7f2a12],
      [0xf9ffff, 0xffd78f, 0xb54115],
      [0xffffff, 0xffe2a8, 0x873019],
    ],
    scheme = schemes[variant % schemes.length],
    dust = layer > 1.5;
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      kepler: { value: kepler },
      spin: { value: spin },
      inner: { value: inner },
      outer: { value: outer },
      layer: { value: layer },
      activity: { value: 0.12 + variant * 0.18 },
      hotColor: { value: new THREE.Color(scheme[0]) },
      midColor: { value: new THREE.Color(scheme[1]) },
      outerColor: { value: new THREE.Color(scheme[2]) },
      dopplerStrength: { value: 0.38 + (variant % 4) * 0.07 },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: dust ? THREE.NormalBlending : THREE.AdditiveBlending,
    toneMapped: false,
    vertexShader: DISK_VERTEX,
    fragmentShader: `varying float vR;varying float vA;varying float vRad;varying float vBeam;uniform float inner;uniform float layer;uniform float activity;uniform float dopplerStrength;uniform vec3 hotColor;uniform vec3 midColor;uniform vec3 outerColor;${NOISE_GLSL}${DISK_FLOW_GLSL}
vec2 gas(float a,float r,float s){vec2 polar=vec2(cos(a),sin(a));float m=4.+layer;float broad=noise(vec3(polar*(2.2+r*4.6),s+time*.02+layer*3.7));float fine=noise(vec3(polar*(7.+r*15.),s*1.37-time*.035+layer*7.1));float spiralA=.5+.5*sin(a*m+spin*r*(25.+layer*12.));float spiralB=.5+.5*sin(a*(9.-layer)+spin*r*(57.+layer*8.)+fine*4.2);float filaments=smoothstep(.3,.9,spiralA*.46+spiralB*.22+broad*.44+fine*.22);float gaps=smoothstep(.67,.9,noise(vec3(polar*(4.5+r*9.),s*.71+11.)));return vec2(filaments,gaps);}
void main(){float r=clamp(vR,0.,1.);float a1,a2,w1,s1,s2;diskFlow(vA,vRad,a1,a2,w1,s1,s2);vec2 g1=gas(a1,r,s1),g2=gas(a2,r,s2);float filaments=flowBlend(g1.x,g2.x,w1);float gaps=flowBlend(g1.y,g2.y,w1);float innerHeat=pow(1.-r,2.25);float whiteCore=pow(1.-r,7.5);float beta=dopplerStrength*.48*sqrt(clamp(inner/max(vRad,.01),.05,1.));float doppler=pow(max(.05,1.+beta*vBeam),2.6)/(1.+beta*beta*2.);vec3 color=mix(outerColor,midColor,pow(1.-r,.7));color=mix(color,hotColor,innerHeat*.82+whiteCore*.18);color=mix(color,color*vec3(.82,.94,1.22),clamp(vBeam*beta*2.,0.,1.));color=mix(color,color*vec3(1.18,.82,.62),clamp(-vBeam*beta*2.,0.,1.));color*=doppler*(.48+filaments*.92);float edge=smoothstep(0.,.035,r)*smoothstep(1.,.68,r);float layerAlpha=layer<.5?.82:(layer<1.5?.36:.18);float dustShade=layer>1.5?mix(.28,1.,filaments):1.;float alpha=edge*(.12+filaments*.82)*(1.-gaps*.48)*layerAlpha*(.62+activity*.48)*(1.-r*.18);if(alpha<.008)discard;gl_FragColor=vec4(color*dustShade*(.72+innerHeat*1.65+whiteCore*2.8),alpha);}`,
  });
}
export function protostarDiskMaterial(inner: number, outer: number, kepler = 2, spin = 1) {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      kepler: { value: kepler },
      spin: { value: spin },
      inner: { value: inner },
      outer: { value: outer },
      formation: { value: 0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    vertexShader: DISK_VERTEX,
    fragmentShader: `varying float vR;varying float vA;varying float vRad;varying float vBeam;uniform float formation;${NOISE_GLSL}${DISK_FLOW_GLSL}
float lanesAt(float a,float r,float s){float spiral=.5+.5*sin(a*7.+spin*r*24.);float dust=noise(vec3(cos(a)*(2.+r*5.),sin(a)*(2.+r*5.),s+time*.03));return smoothstep(.34,.9,spiral*.46+dust*.72);}
void main(){float r=clamp(vR,0.,1.);float a1,a2,w1,s1,s2;diskFlow(vA,vRad,a1,a2,w1,s1,s2);float lanes=flowBlend(lanesAt(a1,r,s1),lanesAt(a2,r,s2),w1);float edge=smoothstep(0.,.08,r)*smoothstep(1.,.72,r);vec3 color=mix(vec3(.72,.08,.012),vec3(1.,.78,.34),pow(1.-r,1.65));float alpha=edge*(.16+lanes*.54)*formation;gl_FragColor=vec4(color*(.62+lanes*.9)*(1.+vBeam*.12),alpha);}`,
  });
}
export function transferDiskMaterial(kind: MatterStream['kind'], layer: number) {
  const colors =
    kind === 'nebula'
      ? [0xf7dcff, 0xd264ff, 0x48247f]
      : kind === 'debris'
        ? [0xfff3cf, 0xff9b38, 0x7b1f09]
        : [0xffffff, 0xffd06d, 0xc33b18];
  const inner = layer ? 2.1 : 0.75,
    outer = layer ? 4.75 : 3.55;
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      kepler: { value: keplerConstant(0.75, 2.4) },
      spin: { value: 1 },
      inner: { value: inner },
      outer: { value: outer },
      intensity: { value: 0 },
      layer: { value: layer },
      hot: { value: new THREE.Color(colors[0]) },
      mid: { value: new THREE.Color(colors[1]) },
      cool: { value: new THREE.Color(colors[2]) },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    vertexShader: DISK_VERTEX,
    fragmentShader: `varying float vR;varying float vA;varying float vRad;varying float vBeam;uniform float intensity;uniform float layer;uniform vec3 hot;uniform vec3 mid;uniform vec3 cool;${NOISE_GLSL}${DISK_FLOW_GLSL}
float fil(float a,float r,float s){float spiral=.5+.5*sin(a*(13.-layer*3.)+spin*r*(38.+layer*8.));float turbulence=noise(vec3(cos(a)*(3.+r*7.),sin(a)*(3.+r*7.),s+time*.06+layer*4.));return smoothstep(.32,.9,spiral*.58+turbulence*.72);}
void main(){float r=clamp((vRad-.75)/4.,0.,1.);float a1,a2,w1,s1,s2;diskFlow(vA,vRad,a1,a2,w1,s1,s2);float filaments=flowBlend(fil(a1,r,s1),fil(a2,r,s2),w1);float innerHeat=pow(1.-r,2.2);float doppler=pow(max(.1,1.+.22*vBeam*sqrt(clamp(.75/max(vRad,.01),.05,1.))),3.);vec3 color=mix(cool,mid,pow(1.-r,.72));color=mix(color,hot,innerHeat*(.72+filaments*.28));float edge=smoothstep(0.,.06,r)*smoothstep(1.,.8,r);float alpha=edge*(.18+filaments*.7)*(layer>.5?.3:.68)*intensity;gl_FragColor=vec4(color*(.8+filaments*1.3+innerHeat)*doppler,alpha);}`,
  });
}
export function addGlow(group: THREE.Group, color: string, size: number, opacity = 0.58) {
  const s = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture(color),
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  s.scale.set(size, size, 1);
  group.add(s);
  return s;
}
export function jetMaterial(color: number, opacity = 0.5, core = false) {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      intensity: { value: 1 },
      color: { value: new THREE.Color(color) },
      opacity: { value: opacity },
      core: { value: core ? 1 : 0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    vertexShader: `varying vec2 vUv;varying float vEdge;uniform float time;void main(){vUv=uv;vEdge=abs(normal.x)+abs(normal.z);vec3 p=position;float along=uv.y;float flutter=sin(along*27.-time*9.+position.y*.7)*(.006+.018*along);p.x+=flutter;p.z+=cos(along*21.-time*7.)*flutter;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader: `varying vec2 vUv;varying float vEdge;uniform float time;uniform float intensity;uniform float opacity;uniform float core;uniform vec3 color;void main(){float base=smoothstep(0.,.055,vUv.y);float fade=1.-smoothstep(.76,1.,vUv.y);float axial=pow(max(0.,sin(vUv.y*3.14159)),.16);float knots=.48+.52*pow(max(0.,sin(vUv.y*57.-time*14.)),12.);float modulation=mix(.42+knots*.58,.92,core);float edge=mix(smoothstep(1.28,.12,vEdge),1.,core);float alpha=base*fade*axial*modulation*edge*opacity*intensity;if(alpha<.006)discard;gl_FragColor=vec4(color*(mix(1.8+knots*2.6,4.2,core)),alpha);}`,
  });
}

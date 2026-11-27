// Shared shader pieces and helpers for accretion and protoplanetary disks.
//
// Real disks rotate differentially: gas near the centre orbits much faster than gas at the rim (Keplerian,
// angular speed ∝ r^-1.5). The meshes therefore stay still and the shaders move the gas pattern instead, with a
// two-phase flow (the pattern crossfades between two advected copies every 1.5 s) so the shear
// keeps winding gas into trailing spirals without ever winding it infinitely tight. The crossfade happens at the
// same moment at every radius and preserves contrast, so it doesn't read as rings or pulses.
//
// Relativistic Doppler beaming is computed in view space, so the side of the disk moving toward the camera stays
// bright as it orbits instead of the bright patch spinning around with the gas.
import * as THREE from 'three';

/**
 * Vertex shader for a RingGeometry disk (ring in local XY, normal +Z). The local position is passed as a varying
 * and the polar angle is computed per fragment: interpolating atan() itself breaks across the -pi/+pi seam.
 */
export const DISK_VERTEX = /* glsl */ `
varying float vR;varying vec2 vXY;varying float vRad;varying float vBeam;
uniform float inner;uniform float outer;uniform float spin;
void main(){
  vRad=length(position.xy);
  vR=(vRad-inner)/(outer-inner);
  vXY=position.xy;
  float a=atan(position.y,position.x);
  vec4 mv=modelViewMatrix*vec4(position,1.);
  vec3 orbit=mat3(modelViewMatrix)*(vec3(-sin(a),cos(a),0.)*spin);
  vBeam=dot(normalize(orbit),normalize(-mv.xyz));
  gl_Position=projectionMatrix*mv;
}`;

/**
 * Readability floor (simulator-clarity item 4b-2), in pattern radians per visual second. Pure Keplerian speeds
 * left the outer edges of large disks orbiting once every 25–186 visual seconds, which reads as frozen. A small
 * uniform term is added to every radius: the differential (Keplerian) shear between radii is unchanged, so gas
 * still winds into trailing spirals, and no outer edge takes longer than about 30 visual seconds per turn.
 * This is a display choice, not a physical speed (the simulator's time is already compressed).
 */
export const READABLE_MIN_OMEGA = (2 * Math.PI) / 32;

/** Pattern angular speed (rad per visual second) at local radius `rad`, matching `diskFlow` in the shader. */
export function diskPatternOmega(kepler: number, rad: number) {
  return kepler * Math.pow(Math.max(rad, 0.05), -1.5) + READABLE_MIN_OMEGA;
}

/** Visual seconds for the gas pattern at local radius `rad` to complete one turn at 1× speed. */
export function diskPatternPeriod(kepler: number, rad: number) {
  return (2 * Math.PI) / diskPatternOmega(kepler, rad);
}

/**
 * diskFlow(angle, radius, a1, a2, w1, s1, s2): the two pattern angles to sample, the weight of the first, and a
 * seed per phase that changes only while that phase is invisible. Requires uniforms `time`, `kepler`, `spin`.
 */
export const DISK_FLOW_GLSL = /* glsl */ `
uniform float time;uniform float kepler;uniform float spin;
void diskFlow(float a,float rad,out float a1,out float a2,out float w1,out float s1,out float s2){
  float om=kepler*pow(max(rad,.05),-1.5)+${READABLE_MIN_OMEGA.toFixed(6)};
  float cyc=time*.3333;
  float p1=fract(cyc),p2=fract(cyc+.5);
  a1=a-spin*om*p1*3.;a2=a-spin*om*p2*3.;
  w1=1.-abs(2.*p1-1.);
  s1=floor(cyc)*1.713;s2=floor(cyc+.5)*1.713+3.31;
}
float flowBlend(float f1,float f2,float w1){
  float w2=1.-w1;
  return clamp((f1*w1+f2*w2-.5)/max(.5,sqrt(w1*w1+w2*w2))+.5,0.,1.);
}`;

/**
 * Companion tide for a disk (see src/disk-encounter.ts). Uniforms: `tideCut` local outer cut radius (huge = none),
 * `tideAngle` companion polar angle in the disk plane, `tideAmp` encounter strength 0..1.
 * tideShape(a, rad) returns vec2(alpha multiplier, arm brightness). The tidal bulge and its two arms stay aligned
 * with the companion while the gas pattern keeps orbiting through them; a thin streamer survives past the cut on
 * the companion side only, as an illustration of gas being pulled toward it.
 */
export const DISK_TIDE_GLSL = /* glsl */ `
uniform float tideCut;uniform float tideAngle;uniform float tideAmp;
vec2 tideShape(float a,float rad){
  if(tideAmp<.001)return vec2(1.,0.);
  float rel=a-tideAngle;
  float bulge=tideCut*(1.+.16*tideAmp*cos(2.*rel));
  float keep=1.-smoothstep(bulge*.8,bulge,rad);
  float side=atan(sin(rel),cos(rel));
  float stream=exp(-side*side/.05)*(1.-smoothstep(bulge,bulge*1.7,rad))*tideAmp;
  float near=smoothstep(.45,.95,rad/max(tideCut,.001))*(1.-smoothstep(1.,1.3,rad/max(tideCut,.001)));
  float arms=near*pow(.5+.5*cos(2.*rel-1.1*spin*rad/max(tideCut,.001)),6.)*tideAmp;
  return vec2(max(keep,stream*.85),arms);
}`;

/** Angular speed (rad/s) at the inner edge → the Kepler constant the shaders use. */
export function keplerConstant(innerRadius: number, innerAngularSpeed: number) {
  return innerAngularSpeed * Math.pow(innerRadius, 1.5);
}

/** Orbit sense of material around `receiver` as seen in a disk's local frame: +1 counter-clockwise in local XY. */
export function diskSpinFromOrbit(relativeX: number, relativeZ: number, relativeVX: number, relativeVZ: number) {
  // Angular momentum about world +Y. Disks are tilted from the XZ plane with local +Z pointing roughly down,
  // so prograde motion about +Y appears clockwise in the disk's local frame.
  const ly = relativeZ * relativeVX - relativeX * relativeVZ;
  return ly > 0 ? -1 : 1;
}

/** Set the rotation sense of every disk part (and the inflow particles) on a body visual. */
export function setDiskSpin(mesh: THREE.Object3D, spin: number) {
  if (mesh.userData.diskSpin === spin) return;
  mesh.userData.diskSpin = spin;
  mesh.traverse(child => {
    const material = (child as THREE.Mesh).material;
    if (material instanceof THREE.ShaderMaterial && material.uniforms.kepler && material.uniforms.spin)
      material.uniforms.spin.value = spin;
    if (child.name === 'inflow') child.userData.spin = spin;
  });
}

/** Height of a disk plane tilted by `tilt` about X (RingGeometry convention) at a world-z offset from its centre. */
export function diskPlaneHeight(tilt: number, zOffset: number) {
  const s = Math.sin(tilt);
  return Math.abs(s) < 1e-3 ? 0 : (zOffset * Math.cos(tilt)) / s;
}

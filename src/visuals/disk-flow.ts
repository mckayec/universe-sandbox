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

/** Vertex shader for a RingGeometry disk (ring in local XY, normal +Z). */
export const DISK_VERTEX = /* glsl */ `
varying float vR;varying float vA;varying float vRad;varying float vBeam;
uniform float inner;uniform float outer;uniform float spin;
void main(){
  vRad=length(position.xy);
  vR=(vRad-inner)/(outer-inner);
  vA=atan(position.y,position.x);
  vec4 mv=modelViewMatrix*vec4(position,1.);
  vec3 orbit=mat3(modelViewMatrix)*(vec3(-sin(vA),cos(vA),0.)*spin);
  vBeam=dot(normalize(orbit),normalize(-mv.xyz));
  gl_Position=projectionMatrix*mv;
}`;

/**
 * diskFlow(angle, radius, a1, a2, w1, s1, s2): the two pattern angles to sample, the weight of the first, and a
 * seed per phase that changes only while that phase is invisible. Requires uniforms `time`, `kepler`, `spin`.
 */
export const DISK_FLOW_GLSL = /* glsl */ `
uniform float time;uniform float kepler;uniform float spin;
void diskFlow(float a,float rad,out float a1,out float a2,out float w1,out float s1,out float s2){
  float om=kepler*pow(max(rad,.05),-1.5);
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

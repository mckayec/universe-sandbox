// GLSL and uniforms for star-relative planet lighting. The CPU side picks directions in src/key-light.ts and
// src/visuals/planet-lighting.ts sets them every frame. Directions are in scene (world) space, so body spin
// (which rotates the surface pattern in object space) and camera motion (view space) stay separate.
import * as THREE from 'three';
import { NO_STAR_LIGHT } from '../key-light.ts';

/** Varyings shared by the lit planet, gas-giant and atmosphere shaders. */
export const LIT_VARYINGS = `
varying vec3 p;
varying vec3 n;
varying vec3 vWN;
varying vec3 vWP;
`;

/** p: object-space normal (surface pattern, turns with spin); n: view normal (rim); vWN/vWP: world normal/position (light). */
export const LIT_VERTEX = `${LIT_VARYINGS}
void main() {
  p = normal;
  n = normalize(normalMatrix * normal);
  vWN = normalize(mat3(modelMatrix) * normal);
  vec4 world = modelMatrix * vec4(position, 1.);
  vWP = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

/** Day side = the brighter of the key light and the flux-weighted fill (mirrors daylight() in key-light.ts). */
export const KEY_LIGHT_GLSL = `
uniform vec3 keyDir;
uniform vec3 fillDir;
uniform float fillAmount;
float dayside(vec3 N, float lo, float hi) {
  float key = smoothstep(lo, hi, dot(N, keyDir));
  float fill = smoothstep(lo, hi, dot(N, fillDir)) * fillAmount;
  return max(key, fill);
}
vec3 oceanGlint(vec3 N, float ocean) {
  vec3 V = normalize(cameraPosition - vWP);
  vec3 H = normalize(keyDir + V);
  return vec3(1., .96, .88) * pow(max(dot(N, H), 0.), 64.) * .26 * ocean;
}
`;

export function keyLightUniforms() {
  return {
    keyDir: { value: new THREE.Vector3(NO_STAR_LIGHT.x, NO_STAR_LIGHT.y, NO_STAR_LIGHT.z) },
    fillDir: { value: new THREE.Vector3(NO_STAR_LIGHT.x, NO_STAR_LIGHT.y, NO_STAR_LIGHT.z) },
    fillAmount: { value: 0 },
  };
}

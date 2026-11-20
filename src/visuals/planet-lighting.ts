// Per-frame star-relative lighting for worlds (rocky planets, dwarf planets, moons, gas giants).
// The model and its limits are documented in src/key-light.ts.
import * as THREE from 'three';
import { STAGES } from '../celestial-catalog.ts';
import { keyLightFor, relativeLuminosity, type LightSource } from '../key-light.ts';
import { bodies } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';

/** Teaching surface temperatures for emitters the stage catalog does not cover. */
const BROWN_DWARF_TEMPERATURE = 1300;
const PROTOSTAR_TEMPERATURE = 3500;
const LIT_KINDS = new Set(['rocky', 'dwarf', 'moon', 'gas']);

export function isLitWorld(b: Pick<Body, 'kind'>) {
  return LIT_KINDS.has(b.kind);
}

/** Surface temperature used for a body's light output, or 0 when it does not light worlds. */
export function emitterTemperature(b: Pick<Body, 'kind' | 'stage'>) {
  if (b.kind === 'star') return STAGES.find(s => s.stage === b.stage)?.temperature ?? 5800;
  if (b.kind === 'brown') return BROWN_DWARF_TEMPERATURE;
  if (b.kind === 'protostar') return PROTOSTAR_TEMPERATURE;
  return 0;
}

function litMaterials(b: Body) {
  const cached = b.mesh.userData.litMaterials as THREE.ShaderMaterial[] | undefined;
  if (cached && b.mesh.userData.litChildCount === b.mesh.children.length) return cached;
  const found: THREE.ShaderMaterial[] = [];
  b.mesh.traverse(o => {
    const material = (o as THREE.Mesh).material;
    if (material instanceof THREE.ShaderMaterial && material.uniforms.keyDir) found.push(material);
  });
  b.mesh.userData.litMaterials = found;
  b.mesh.userData.litChildCount = b.mesh.children.length;
  return found;
}

const sources: LightSource[] = [];

/** Points every world's key and fill light at the brightest stars by flux; no stars → fixed scene fallback. */
export function updatePlanetLighting() {
  sources.length = 0;
  for (const b of bodies) {
    const temperature = emitterTemperature(b);
    if (temperature > 0)
      sources.push({ id: b.id, position: b.mesh.position, luminosity: relativeLuminosity(b.radius, temperature) });
  }
  for (const b of bodies) {
    if (!isLitWorld(b)) continue;
    const materials = litMaterials(b);
    if (!materials.length) continue;
    const light = keyLightFor(b.mesh.position, sources, b.id);
    for (const material of materials) {
      material.uniforms.keyDir.value.set(light.key.x, light.key.y, light.key.z);
      material.uniforms.fillDir.value.set(light.fill.x, light.fill.y, light.fill.z);
      material.uniforms.fillAmount.value = light.fillAmount;
    }
    b.mesh.userData.keyLightId = light.keyId;
  }
}

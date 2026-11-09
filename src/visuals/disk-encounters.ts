// Per-frame companion response of black-hole accretion disks (labelled approximation; see src/disk-encounter.ts).
import * as THREE from 'three';
import { QUIET_ENCOUNTER, diskEncounter, relaxEncounter, type DiskEncounter } from '../disk-encounter.ts';
import { bodies } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';

/** A companion lighter than this fraction of the host is ignored (a planet does not reshape a black-hole disk). */
const MIN_MASS_RATIO = 0.02;
const DISK_LAYERS = ['accretionDiskHot', 'accretionDiskMid', 'accretionDiskDust'];
const tmpLocal = new THREE.Vector3();

export type DiskEncounterState = DiskEncounter & { companionId?: number };

function diskLayers(b: Body) {
  const cached = b.mesh.userData.diskLayers as THREE.Mesh[] | undefined;
  if (cached && cached.every(m => m.parent)) return cached;
  const layers = DISK_LAYERS.map(name => b.mesh.getObjectByName(name)).filter(
    (o): o is THREE.Mesh => o instanceof THREE.Mesh,
  );
  b.mesh.userData.diskLayers = layers;
  return layers;
}

function targetEncounter(b: Body, reference: THREE.Mesh, outer: number) {
  let best: DiskEncounter = QUIET_ENCOUNTER,
    companionId: number | undefined;
  reference.updateWorldMatrix(true, false);
  for (const other of bodies) {
    if (other === b || other.kind === 'nebula' || other.debris || !(other.mass >= b.mass * MIN_MASS_RATIO)) continue;
    reference.worldToLocal(tmpLocal.copy(other.mesh.position));
    const e = diskEncounter(tmpLocal, outer, b.mass, other.mass);
    if (e.strength > best.strength) {
      best = e;
      companionId = other.id;
    }
  }
  return { ...best, companionId };
}

/** Update the tide uniforms on one black hole's disks. `dt` is the disk (simulated, capped) step or frame time. */
export function updateDiskEncounter(b: Body, dt: number) {
  const layers = diskLayers(b);
  if (!layers.length) return;
  const reference = layers[layers.length - 1],
    referenceMaterial = reference.material as THREE.ShaderMaterial,
    outer = Number(referenceMaterial.uniforms.outer?.value ?? 0);
  if (!(outer > 0)) return;
  let current = (b.mesh.userData.diskEncounter as DiskEncounterState | undefined) ?? { ...QUIET_ENCOUNTER };
  // A companion that no longer exists (merged or removed) leaves no tide behind: the merged disk starts fresh.
  if (current.companionId !== undefined && !bodies.some(x => x.id === current.companionId))
    current = { ...QUIET_ENCOUNTER };
  const target = targetEncounter(b, reference, outer),
    next: DiskEncounterState = {
      ...relaxEncounter(current, target, dt),
      companionId: target.strength > 0 ? target.companionId : current.companionId,
    };
  if (next.strength === 0) next.companionId = undefined;
  b.mesh.userData.diskEncounter = next;
  // All layers share the plane, so one local cut radius applies to each of them.
  const cut = next.strength > 0 ? next.cut * outer : 1e5;
  const inflow = b.mesh.getObjectByName('inflow');
  if (inflow) inflow.userData.tide = { cut, angle: next.angle, amp: next.strength };
  for (const layer of layers) {
    const uniforms = (layer.material as THREE.ShaderMaterial).uniforms;
    if (!uniforms.tideCut) continue;
    uniforms.tideCut.value = cut;
    uniforms.tideAngle.value = next.angle;
    uniforms.tideAmp.value = next.strength;
  }
}

export function diskEncounterOf(b: Body) {
  return b.mesh.userData.diskEncounter as DiskEncounterState | undefined;
}

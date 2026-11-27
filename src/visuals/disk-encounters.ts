// Per-frame companion response of black-hole, protostar and mass-transfer disks (labelled heuristic; see
// src/disk-encounter.ts).
import * as THREE from 'three';
import { QUIET_ENCOUNTER, diskEncounter, outranks, relaxEncounter, type DiskEncounter } from '../disk-encounter.ts';
import { bodies } from '../state/app-state.ts';
import type { Body, MatterStream } from '../state/types.ts';

/** A companion lighter than this fraction of the host is ignored (a planet does not reshape a black-hole disk). */
const MIN_MASS_RATIO = 0.02;
/** Disk meshes that respond to companions, per host kind. The last layer is the reference for the local frame. */
export const ENCOUNTER_DISK_LAYERS: Partial<Record<Body['kind'], readonly string[]>> = {
  blackhole: ['accretionDiskHot', 'accretionDiskMid', 'accretionDiskDust'],
  protostar: ['protoDisk'],
};
const tmpLocal = new THREE.Vector3();

export type DiskEncounterState = DiskEncounter;

function diskLayers(b: Body) {
  const cached = b.mesh.userData.diskLayers as THREE.Mesh[] | undefined;
  if (cached && cached.every(m => m.parent)) return cached;
  const layers = (ENCOUNTER_DISK_LAYERS[b.kind] ?? [])
    .map(name => b.mesh.getObjectByName(name))
    .filter((o): o is THREE.Mesh => o instanceof THREE.Mesh);
  b.mesh.userData.diskLayers = layers;
  return layers;
}

/** Deepest companion encounter for one disk; ranking shared with the pure helper via `outranks`. */
function targetEncounter(b: Body, reference: THREE.Mesh, outer: number): DiskEncounterState {
  let best: DiskEncounter = QUIET_ENCOUNTER;
  reference.updateWorldMatrix(true, false);
  for (const other of bodies) {
    if (other === b || other.kind === 'nebula' || other.debris || !(other.mass >= b.mass * MIN_MASS_RATIO)) continue;
    reference.worldToLocal(tmpLocal.copy(other.mesh.position));
    const e = { ...diskEncounter(tmpLocal, outer, b.mass, other.mass), companionId: other.id };
    if (outranks(e, best)) best = e;
  }
  return best.strength > 0 ? best : { ...QUIET_ENCOUNTER };
}

/** Update the tide uniforms on one body's responsive disks (black holes, protostars). `dt` is the disk (simulated, capped) step or frame time. */
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
  applyTide(layers, next, outer, b.mesh.getObjectByName('inflow'));
}

/** Push one encounter state into the tide uniforms of every layer (all layers share a plane and a local scale). */
function applyTide(layers: readonly THREE.Mesh[], next: DiskEncounterState, outer: number, inflow?: THREE.Object3D) {
  const cut = next.strength > 0 ? next.cut * outer : 1e5;
  if (inflow) inflow.userData.tide = { cut, angle: next.angle, amp: next.strength };
  for (const layer of layers) {
    const uniforms = (layer.material as THREE.ShaderMaterial).uniforms;
    if (!uniforms.tideCut) continue;
    uniforms.tideCut.value = cut;
    uniforms.tideAngle.value = next.angle;
    uniforms.tideAmp.value = next.strength;
  }
}

/**
 * Tide on a mass-transfer disk (slice 4b-2). The companion is the donor that feeds it: a disk around the receiver
 * cannot extend past the receiver's Roche lobe, and the companion-side streamer lines up with the incoming stream.
 * The state lives on the outer layer's userData; `dt` is the capped disk step, or frame time while paused (as for
 * black holes: nothing moves while paused, so the tide settles on a fixed target).
 */
export function updateTransferDiskTide(stream: MatterStream, receiver: Body, donor: Body, dt: number) {
  const layers = [stream.disk, stream.outerDisk],
    reference = stream.outerDisk,
    outer = Number((reference.material as THREE.ShaderMaterial).uniforms.outer?.value ?? 0);
  if (!(outer > 0)) return;
  reference.updateWorldMatrix(true, false);
  reference.worldToLocal(tmpLocal.copy(donor.mesh.position));
  // A nebula is an extended, low-density medium, not a point companion: it feeds the disk without truncating it.
  const target =
      donor.kind === 'nebula' || donor.debris
        ? { ...QUIET_ENCOUNTER }
        : { ...diskEncounter(tmpLocal, outer, receiver.mass, donor.mass), companionId: donor.id },
    current = (reference.userData.diskEncounter as DiskEncounterState | undefined) ?? { ...QUIET_ENCOUNTER },
    next: DiskEncounterState = { ...relaxEncounter(current, target, dt), companionId: donor.id };
  if (next.strength === 0) next.companionId = undefined;
  reference.userData.diskEncounter = next;
  applyTide(layers, next, outer);
}

/** Current tide state of a transfer disk, if it has been updated. */
export function transferDiskEncounterOf(stream: MatterStream) {
  return stream.outerDisk.userData.diskEncounter as DiskEncounterState | undefined;
}

export function diskEncounterOf(b: Body) {
  return b.mesh.userData.diskEncounter as DiskEncounterState | undefined;
}

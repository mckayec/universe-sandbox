// Transforming and removing bodies, matter-stream cleanup, scale and object count.
import * as THREE from 'three';
import { stellarBirthStage } from '../simulation-model.ts';
import { STAGES, TYPES, VARIANT_COUNTS, type Kind, type Placeable } from '../celestial-catalog.ts';
import { refreshGroupNavigator, removeGalaxyVisualsOf } from './groups.ts';
import { makeTrail, nameFor, updateBodyLabel } from './registry.ts';
import { habitableRange } from '../physics/body-math.ts';
import { galaxyGroupFor, galaxyOrbitVelocity } from '../physics/galaxy-dynamics.ts';
import { disposeObject } from '../scene/dispose.ts';
import { scene } from '../scene/setup.ts';
import { app, bodies, bodyGroupIds, cosmicGroups, galaxyVisuals, matterStreams, trails } from '../state/app-state.ts';
import type { Body, MatterStream } from '../state/types.ts';
import { select } from '../ui/feed.ts';
import { closeObjectMenu, updateInspector } from '../ui/inspector.ts';
import { createVisual } from '../visuals/create-visual.ts';

export function replaceVisual(b: Body) {
  const old = b.mesh,
    p = old.position.clone();
  old.remove(b.label);
  scene.remove(old);
  disposeObject(old);
  b.mesh = createVisual(b.kind, b.stage, b.variant + b.id * 60);
  b.mesh.add(b.label);
  b.mesh.position.copy(p);
  scene.add(b.mesh);
  updateScale(b);
}
export function transform(b: Body, kind: Kind, mass = b.mass) {
  if (b.artificial) {
    b.mass = mass;
    return;
  }
  // Keep custom names (Sun, Earth, Eris Hypergiant); only default catalog names follow the new kind.
  const defaultName = b.name === nameFor(b.kind, b.id);
  b.kind = kind;
  b.variant = (b.id * 7 + kind.length) % (VARIANT_COUNTS[kind as Placeable] ?? 10);
  b.mass = mass;
  b.birthMass = TYPES[kind].mass;
  b.radius = TYPES[kind].radius;
  if (defaultName) b.name = nameFor(kind, b.id);
  b.age = 0;
  b.stageAge = 0;
  b.stage = kind === 'star' ? stellarBirthStage(mass) : undefined;
  if (kind !== 'star') b.holdStage = undefined;
  b.stageTransition = undefined;
  b.nebulaTidal = 0;
  b.nebulaCompression = 0;
  b.nebulaAngle = 0;
  b.nebulaContactId = undefined;
  b.hostId = undefined;
  b.tidalStretch = 0;
  b.tidalPartnerId = undefined;
  b.tidalStrain = undefined;
  b.tidalWarned = undefined;
  b.collisionCooldown = 0.35;
  if (kind !== 'rocky') {
    b.lifeScore = 0;
    b.lifeLevel = 'none';
    b.habitabilityShock = 0;
    b.habitatStatus = 'Not applicable';
  }
  replaceVisual(b);
  const trail = trails.get(b.id);
  if (kind === 'nebula' && trail) {
    scene.remove(trail.line);
    disposeObject(trail.line);
    trails.delete(b.id);
  } else if (!trail) makeTrail(b);
  else {
    const material = trail.line.material as THREE.ShaderMaterial;
    if (material.uniforms.color) material.uniforms.color.value.set(TYPES[kind].color);
  }
  if (app.selectedBody === b) updateInspector();
}
export function removeMatterStream(stream: MatterStream) {
  scene.remove(stream.group);
  disposeObject(stream.group);
  matterStreams.delete(stream.key);
}
function removeMatterStreamsFor(id: number) {
  for (const stream of [...matterStreams.values()])
    if (stream.donorId === id || stream.receiverId === id) removeMatterStream(stream);
}
export function removeBody(b: Body) {
  if (b.kind === 'nebula') {
    const group = galaxyGroupFor(b),
      anchor = group?.anchorId === undefined ? undefined : bodies.find(body => body.id === group.anchorId);
    for (const child of bodies) {
      if (child.hostId !== b.id) continue;
      child.hostId = undefined;
      // Seeds freed inside a galaxy continue on a circular orbit there instead of the cloud's slower drift.
      if (group && anchor && anchor !== b) child.velocity.copy(galaxyOrbitVelocity(group, anchor, child.mesh.position));
      else child.velocity.copy(b.velocity);
      child.velocity.add(new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).multiplyScalar(1.2));
    }
  }
  b.removed = true;
  removeMatterStreamsFor(b.id);
  if (app.menuBody === b) closeObjectMenu();
  b.label.element.remove();
  b.mesh.remove(b.label);
  scene.remove(b.mesh);
  disposeObject(b.mesh);
  const trail = trails.get(b.id);
  if (trail) {
    scene.remove(trail.line);
    disposeObject(trail.line);
    trails.delete(b.id);
  }
  const i = bodies.indexOf(b);
  if (i >= 0) bodies.splice(i, 1);
  const groupId = bodyGroupIds.get(b.id);
  bodyGroupIds.delete(b.id);
  if (groupId !== undefined) {
    const group = cosmicGroups.find(candidate => candidate.id === groupId);
    if (group) {
      group.bodyIds = group.bodyIds.filter(id => id !== b.id);
      if (group.anchorId === b.id) group.anchorId = promoteAnchor(group.bodyIds, b);
      if (!group.bodyIds.length) {
        removeGalaxyVisualsOf(group.id);
        cosmicGroups.splice(cosmicGroups.indexOf(group), 1);
      } else if (group.anchorId !== undefined)
        for (const visual of galaxyVisuals.values()) if (visual.groupId === group.id) visual.anchorId = group.anchorId;
    }
  }
  if (app.selectedBody === b) select(null);
  updateCount();
  if (!app.historySuspended) refreshGroupNavigator();
}
/** When a group's anchor is removed, the most massive remaining non-nebula member takes over its role. */
function promoteAnchor(ids: number[], removed: Body) {
  let best: Body | undefined;
  for (const id of ids) {
    const body = bodies.find(candidate => candidate.id === id);
    if (body && body.kind !== 'nebula' && (!best || body.mass > best.mass)) best = body;
  }
  if (best && removed.exhibitAnchor && best.exhibitSystemId === removed.exhibitSystemId) best.exhibitAnchor = true;
  return best?.id ?? ids[0];
}
export function bodyBaseScale(b: Body) {
  const m = Math.cbrt(Math.max(0.05, b.mass / b.birthMass)),
    s =
      b.kind === 'star'
        ? STAGES.find(x => x.stage === b.stage)!.scale
        : b.kind === 'protostar'
          ? 0.16 + 0.84 * THREE.MathUtils.smoothstep(b.age, 0.25, 8.5)
          : 1;
  return m * s;
}
export function updateScale(b: Body) {
  const scale = bodyBaseScale(b);
  b.mesh.scale.setScalar(scale);
  b.radius = TYPES[b.kind].radius * scale;
  const hz = b.mesh.getObjectByName('habitableZone') as THREE.Mesh | undefined;
  if (hz && b.kind === 'star') {
    const range = habitableRange(b),
      inner = range.inner / scale,
      outer = range.outer / scale;
    if (Math.abs((hz.userData.inner ?? 0) - inner) > 0.025 || Math.abs((hz.userData.outer ?? 0) - outer) > 0.025) {
      hz.geometry.dispose();
      hz.geometry = new THREE.RingGeometry(inner, outer, 128);
      hz.userData.inner = inner;
      hz.userData.outer = outer;
    }
    const zoneLabel = b.mesh.getObjectByName('habitableZoneLabel');
    if (zoneLabel) zoneLabel.position.set(0, 0.08, outer * 0.93);
  }
  updateBodyLabel(b);
}
export function updateCount() {
  document.querySelector('#count')!.textContent = String(bodies.length);
}

// Named cosmic groups (systems, galaxies) and the group navigator.
import * as THREE from 'three';
import { hasRecoverySnapshot, hasSavedUniverse } from '../sandbox-state.ts';
import { buildGalaxyVisual, tameGalaxyNucleus } from '../galaxy-visuals.ts';
import { updateBodyLabel } from './registry.ts';
import { seeded } from '../physics/body-math.ts';
import { galaxyExtent } from '../physics/galaxy-dynamics.ts';
import { fitAllObjects } from '../scene/camera.ts';
import { disposeObject } from '../scene/dispose.ts';
import { MAX_CAMERA_DISTANCE, camera, isCompact, scene, viewTarget } from '../scene/setup.ts';
import { app, bodies, bodyGroupIds, cosmicGroups, galaxyVisuals } from '../state/app-state.ts';
import type { Body, CosmicGroup, GalaxyStyle } from '../state/types.ts';
import { toast } from '../ui/feed.ts';

export function registerCosmicGroup(
  kind: CosmicGroup['kind'],
  members: Body[],
  customName?: string,
  style?: GalaxyStyle,
  anchorId?: number,
  haloMass?: number,
) {
  const sequence = cosmicGroups.filter(group => group.kind === kind).length + 1,
    name =
      customName ??
      (kind === 'system'
        ? `Solar System ${sequence}`
        : kind === 'binary'
          ? `Binary System ${sequence}`
          : kind === 'triple'
            ? `Triple System ${sequence}`
            : `Galaxy ${sequence}`),
    group: CosmicGroup = {
      id: app.nextGroupId++,
      name,
      kind,
      bodyIds: members.map(body => body.id),
      ...(style ? { style } : {}),
      ...(anchorId !== undefined ? { anchorId } : {}),
      ...(haloMass !== undefined ? { haloMass } : {}),
    };
  cosmicGroups.push(group);
  for (const body of members) bodyGroupIds.set(body.id, group.id);
  refreshGroupNavigator();
  return group;
}
export function refreshGroupNavigator() {
  const select = document.querySelector<HTMLSelectElement>('#group-select')!,
    value = app.selectedGroupId === null ? '' : String(app.selectedGroupId);
  select.replaceChildren(new Option(cosmicGroups.length ? 'Named structures' : 'No named structures', ''));
  for (const group of cosmicGroups)
    select.add(
      new Option(
        `${group.kind === 'galaxy' ? '✦' : group.kind === 'triple' ? '✣' : group.kind === 'binary' ? '◉' : '☼'} ${group.name}`,
        String(group.id),
      ),
    );
  select.value = value;
  document.querySelector<HTMLButtonElement>('#load-universe')!.disabled = !hasSavedUniverse();
  document.querySelector<HTMLButtonElement>('#recover-session')!.disabled = !hasRecoverySnapshot();
}
export function groupForBody(body: Body) {
  const id = bodyGroupIds.get(body.id);
  return id === undefined ? undefined : cosmicGroups.find(group => group.id === id);
}
export function setBodyName(body: Body, name: string) {
  body.name = name;
  updateBodyLabel(body);
  return body;
}
export function galaxyName(style: GalaxyStyle) {
  return style === 'spiral'
    ? 'Spiral Galaxy'
    : style === 'lenticular'
      ? 'Lenticular Galaxy'
      : style === 'elliptical'
        ? 'Elliptical Galaxy'
        : style === 'irregular'
          ? 'Irregular Galaxy'
          : 'Globular Cluster';
}
/** Remove one galaxy picture (by its key in galaxyVisuals), including any tracer stars set loose in world space. */
export function removeGalaxyVisual(key: number) {
  const visual = galaxyVisuals.get(key);
  if (!visual) return;
  scene.remove(visual.object);
  disposeObject(visual.object);
  if (visual.live) {
    scene.remove(visual.live.holder);
    disposeObject(visual.live.holder);
  }
  galaxyVisuals.delete(key);
}
/** Remove every picture belonging to a galaxy group (a merger remnant can carry two). */
export function removeGalaxyVisualsOf(groupId: number) {
  for (const [key, visual] of [...galaxyVisuals]) if (visual.groupId === groupId) removeGalaxyVisual(key);
}
export function clearGalaxyVisuals() {
  for (const key of [...galaxyVisuals.keys()]) removeGalaxyVisual(key);
}
export function galaxyVisualsOf(groupId: number) {
  return [...galaxyVisuals.values()].filter(visual => visual.groupId === groupId);
}
export function createGalaxyBackdrop(record: CosmicGroup, anchor: Body, style: GalaxyStyle) {
  removeGalaxyVisualsOf(record.id);
  const extent = record.extent ?? galaxyExtent(style),
    root = buildGalaxyVisual(style, record.visualSeed ?? record.id * 7 + anchor.id * 13, extent, {
      compact: isCompact,
      quality: app.qualityScale,
    });
  if (anchor.kind === 'blackhole') tameGalaxyNucleus(anchor.mesh, style);
  root.position.copy(anchor.mesh.position);
  root.rotation.y = seeded(record.id, 19) * Math.PI;
  scene.add(root);
  galaxyVisuals.set(record.id, {
    groupId: record.id,
    anchorId: anchor.id,
    originalAnchorId: anchor.id,
    style,
    extent,
    object: root,
  });
}
export function rebuildGalaxyVisuals() {
  clearGalaxyVisuals();
  for (const group of cosmicGroups) {
    if (group.kind !== 'galaxy' || !group.style) continue;
    const anchor = bodies.find(body => body.id === (group.anchorId ?? group.bodyIds[0]));
    if (anchor) createGalaxyBackdrop(group, anchor, group.style);
  }
}
export function focusBodies(targets: Body[], label = 'DEEP SPACE') {
  if (!targets.length) return;
  const box = new THREE.Box3();
  for (const body of targets)
    box
      .expandByPoint(body.mesh.position.clone().addScalar(body.radius))
      .expandByPoint(body.mesh.position.clone().addScalar(-body.radius));
  const center = box.getCenter(new THREE.Vector3());
  center.y = 0;
  const size = box.getSize(new THREE.Vector3()),
    span = Math.max(size.x, size.z, 8),
    direction = camera.position.clone().sub(viewTarget);
  if (direction.lengthSq() < 0.01) direction.set(0, 0.62, 0.78);
  viewTarget.copy(center);
  camera.position
    .copy(viewTarget)
    .add(
      direction
        .normalize()
        .multiplyScalar(THREE.MathUtils.clamp(span * (isCompact ? 1.7 : 1.12) + 18, 20, MAX_CAMERA_DISTANCE)),
    );
  camera.lookAt(viewTarget);
  document.querySelector('#frame-name')!.textContent = label.toUpperCase();
}
export function focusCosmicGroup(id: number | null) {
  app.selectedGroupId = id;
  const group = id === null ? undefined : cosmicGroups.find(candidate => candidate.id === id);
  document.querySelector<HTMLSelectElement>('#group-select')!.value = id === null ? '' : String(id);
  if (!group) {
    fitAllObjects();
    document.querySelector('#frame-name')!.textContent = 'DEEP SPACE';
    return;
  }
  focusBodies(
    group.bodyIds.map(bodyId => bodies.find(body => body.id === bodyId)).filter((body): body is Body => !!body),
    group.name,
  );
  toast(`Focused ${group.name}`);
}

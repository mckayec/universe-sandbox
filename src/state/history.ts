// Reset, snapshot/restore, undo/redo, save/load and session recovery.
import * as THREE from 'three';
import { loadRecoverySnapshot, loadUniverse, saveUniverse, type SandboxSnapshot } from '../sandbox-state.ts';
import { type Kind } from '../celestial-catalog.ts';
import { rebuildGalaxyVisuals, refreshGroupNavigator, removeGalaxyVisual } from '../bodies/groups.ts';
import { removeBody, removeMatterStream, updateCount } from '../bodies/lifecycle.ts';
import { addBody, updateBodyLabel } from '../bodies/registry.ts';
import { removeTransientObject } from '../scene/dispose.ts';
import { clearGuides } from '../scene/overlays.ts';
import { camera, isCompact, viewTarget } from '../scene/setup.ts';
import {
  app,
  audio,
  bodies,
  bodyGroupIds,
  cosmicGroups,
  exhibitEvents,
  galaxyVisuals,
  matterStreams,
  redoStack,
  transients,
  undoStack,
} from './app-state.ts';
import type { LifeLevel, Stage } from './types.ts';
import { renderExhibitEvents, select, toast } from '../ui/feed.ts';
import { closeObjectMenu } from '../ui/inspector.ts';

export function resetSimulation() {
  closeObjectMenu();
  select(null);
  app.dragBody = null;
  app.pendingTouchPlacement = null;
  clearGuides();
  app.historySuspended = true;
  [...bodies].forEach(removeBody);
  app.historySuspended = false;
  for (const id of [...galaxyVisuals.keys()]) removeGalaxyVisual(id);
  cosmicGroups.length = 0;
  bodyGroupIds.clear();
  app.selectedGroupId = null;
  app.nextGroupId = 1;
  refreshGroupNavigator();
  for (const stream of [...matterStreams.values()]) removeMatterStream(stream);
  for (const transient of transients) removeTransientObject(transient.object);
  transients.length = 0;
  exhibitEvents.length = 0;
  renderExhibitEvents();
  app.elapsed = 0;
  app.simAccumulator = 0;
  app.nextId = 1;
  app.gravity = 1;
  document.querySelector<HTMLInputElement>('#gravity')!.value = '1';
  viewTarget.set(0, 0, 0);
  camera.position.set(0, isCompact ? 90 : 34, isCompact ? 120 : 42);
  camera.lookAt(viewTarget);
  document.querySelector('#frame-name')!.textContent = 'DEEP SPACE';
}
export function snapshotUniverse(): SandboxSnapshot {
  return {
    version: 1,
    elapsed: app.elapsed,
    gravity: app.gravity,
    nextId: app.nextId,
    nextGroupId: app.nextGroupId,
    bodies: bodies.map(body => ({
      id: body.id,
      kind: body.kind,
      name: body.name,
      variant: body.variant,
      mass: body.mass,
      birthMass: body.birthMass,
      radius: body.radius,
      position: body.mesh.position.toArray() as [number, number, number],
      velocity: body.velocity.toArray() as [number, number, number],
      locked: body.locked,
      buildLocked: body.buildLocked,
      exhibitSystemId: body.exhibitSystemId,
      holdStage: body.holdStage,
      satelliteHostId: body.satelliteHostId,
      satelliteOrbit: body.satelliteOrbit,
      satelliteAngle: body.satelliteAngle,
      satelliteRate: body.satelliteRate,
      age: body.age,
      stage: body.stage,
      stageAge: body.stageAge,
      nebulaTimer: body.nebulaTimer,
      hostId: body.hostId,
      protoAngle: body.protoAngle,
      protoOrbit: body.protoOrbit,
      protoDrift: body.protoDrift,
      lifeScore: body.lifeScore,
      lifeLevel: body.lifeLevel,
      habitabilityShock: body.habitabilityShock,
      habitatStatus: body.habitatStatus,
      surfaceTemperature: body.surfaceTemperature,
      atmosphere: body.atmosphere,
      water: body.water,
      magnetosphere: body.magnetosphere,
      lastEvent: body.lastEvent,
      groupId: bodyGroupIds.get(body.id),
      artificial: body.artificial,
      warpBoost: body.warpBoost,
    })),
    groups: cosmicGroups.map(group => ({ ...group, bodyIds: [...group.bodyIds] })),
    camera: camera.position.toArray() as [number, number, number],
    target: viewTarget.toArray() as [number, number, number],
  };
}
function restoreUniverse(snapshot: SandboxSnapshot) {
  app.historySuspended = true;
  resetSimulation();
  app.historySuspended = true;
  for (const saved of [...snapshot.bodies].sort((a, b) => a.id - b.id)) {
    app.nextId = saved.id;
    const body = addBody(
      saved.kind as Kind,
      new THREE.Vector3(...saved.position),
      new THREE.Vector3(...saved.velocity),
      {
        variant: saved.variant,
        mass: saved.mass,
        birthMass: saved.birthMass,
        locked: saved.locked,
        buildLocked: saved.buildLocked,
        exhibitSystemId: saved.exhibitSystemId,
        holdStage: saved.holdStage,
        satelliteHostId: saved.satelliteHostId,
        satelliteOrbit: saved.satelliteOrbit,
        satelliteAngle: saved.satelliteAngle,
        satelliteRate: saved.satelliteRate,
        age: saved.age,
        stage: saved.stage as Stage | undefined,
        stageAge: saved.stageAge,
        nebulaTimer: saved.nebulaTimer,
        hostId: saved.hostId,
        protoAngle: saved.protoAngle,
        protoOrbit: saved.protoOrbit,
        protoDrift: saved.protoDrift,
        lifeScore: saved.lifeScore,
        lifeLevel: saved.lifeLevel as LifeLevel,
        habitabilityShock: saved.habitabilityShock,
        habitatStatus: saved.habitatStatus,
        surfaceTemperature: saved.surfaceTemperature ?? 0,
        atmosphere: saved.atmosphere ?? 0,
        water: saved.water ?? 0,
        magnetosphere: saved.magnetosphere ?? 0,
        lastEvent: saved.lastEvent,
        collisionCooldown: 0.35,
        artificial: saved.artificial === 'worldship' ? 'worldship' : undefined,
        warpBoost: saved.warpBoost,
      },
    );
    body.name = saved.name;
    updateBodyLabel(body);
    if (saved.groupId !== undefined) bodyGroupIds.set(body.id, saved.groupId);
  }
  app.nextId = snapshot.nextId;
  app.nextGroupId = snapshot.nextGroupId;
  cosmicGroups.push(
    ...snapshot.groups.map(group => ({
      ...group,
      bodyIds: group.bodyIds.filter(id => bodies.some(body => body.id === id)),
    })),
  );
  rebuildGalaxyVisuals();
  app.elapsed = snapshot.elapsed;
  app.gravity = snapshot.gravity;
  document.querySelector<HTMLInputElement>('#gravity')!.value = String(app.gravity);
  camera.position.fromArray(snapshot.camera);
  viewTarget.fromArray(snapshot.target);
  camera.lookAt(viewTarget);
  app.currentExhibit = null;
  document.querySelector<HTMLElement>('#guide-card')!.hidden = true;
  app.historySuspended = false;
  refreshGroupNavigator();
  updateCount();
  renderExhibitEvents();
}
export function updateHistoryButtons() {
  document.querySelector<HTMLButtonElement>('#undo')!.disabled = !undoStack.length;
  document.querySelector<HTMLButtonElement>('#redo')!.disabled = !redoStack.length;
}
export function recordHistory(snapshot = snapshotUniverse()) {
  if (app.historySuspended) return;
  undoStack.push(snapshot);
  if (undoStack.length > 30) undoStack.shift();
  redoStack.length = 0;
  updateHistoryButtons();
}
export function undoUniverse() {
  const snapshot = undoStack.pop();
  if (!snapshot) return;
  redoStack.push(snapshotUniverse());
  restoreUniverse(snapshot);
  updateHistoryButtons();
  audio.play('ui');
  toast('Undid last construction change');
}
export function redoUniverse() {
  const snapshot = redoStack.pop();
  if (!snapshot) return;
  undoStack.push(snapshotUniverse());
  restoreUniverse(snapshot);
  updateHistoryButtons();
  audio.play('ui');
  toast('Redid construction change');
}
export function saveCurrentUniverse() {
  const saved = saveUniverse(snapshotUniverse());
  refreshGroupNavigator();
  audio.play('ui');
  toast(
    saved
      ? `Saved ${bodies.length} objects and ${cosmicGroups.length} structures on this device`
      : 'This browser blocked local storage; the universe was not saved',
  );
}
export function loadSavedUniverse() {
  const snapshot = loadUniverse();
  if (!snapshot) {
    toast('No saved universe on this device');
    return;
  }
  recordHistory();
  restoreUniverse(snapshot);
  audio.play('transform');
  toast('Saved universe restored');
}
export function recoverSession() {
  const snapshot = loadRecoverySnapshot();
  if (!snapshot) {
    toast('No automatic recovery point is available');
    return;
  }
  recordHistory();
  restoreUniverse(snapshot);
  audio.play('transform');
  toast('Recovered the latest automatic checkpoint');
}

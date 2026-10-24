// The animation loop: fixed-step simulation, visuals, overlays and rendering.
import * as THREE from 'three';
import { saveRecoverySnapshot } from '../sandbox-state.ts';
import { updateNebulaFrame } from '../nebula-hd.ts';
import { runFixedSteps } from '../physics-continuity.ts';
import { refreshGroupNavigator } from '../bodies/groups.ts';
import { updateMatterStreams } from '../physics/matter-streams.ts';
import { MAX_SIM_STEPS, SIM_STEP, simulate } from '../physics/simulate.ts';
import { debrisIds, updateSlowMotion } from '../physics/tidal-disruption.ts';
import { updateCameraTransition } from '../scene/camera.ts';
import { updateScienceOverlays } from '../scene/overlays.ts';
import { updateAdaptiveQuality, updateLensing } from '../scene/quality.ts';
import {
  BASE_BLOOM,
  bloom,
  camera,
  composer,
  deviceTier,
  isCompact,
  labelRenderer,
  performanceMonitor,
  preferences,
  renderer,
  scene,
  selectionRing,
  viewTarget,
} from '../scene/setup.ts';
import { app, audio, bodies, bodyGroupIds } from '../state/app-state.ts';
import { snapshotUniverse } from '../state/history.ts';
import { narrationFacts, showNarration, updateAttractMode } from '../ui/feed.ts';
import { updateInspector } from '../ui/inspector.ts';
import { updateTransients } from '../visuals/effects.ts';
import { updateVisuals } from '../visuals/update-visuals.ts';

const clock = new THREE.Clock();

function formatTime(s: number) {
  return `${Math.floor(s / 60)
    .toString()
    .padStart(2, '0')}:${Math.floor(s % 60)
    .toString()
    .padStart(2, '0')}`;
}
export function animate() {
  requestAnimationFrame(animate);
  const realDt = Math.min(clock.getDelta(), 0.03);
  updateCameraTransition(realDt);
  updateSlowMotion(realDt);
  updateAttractMode(realDt);
  let droppedSimulationFrame = false;
  if (!app.paused) {
    const result = runFixedSteps(app.simAccumulator, realDt, app.speed, SIM_STEP, MAX_SIM_STEPS, step => {
      simulate(step);
      app.elapsed += step;
    });
    app.simAccumulator = result.accumulator;
    droppedSimulationFrame = result.dropped;
  }
  app.recoveryTimer += realDt;
  if (app.recoveryTimer >= 15) {
    app.recoveryTimer = 0;
    if (bodies.length) {
      saveRecoverySnapshot(snapshotUniverse());
      refreshGroupNavigator();
    }
  }
  if (app.attractMode && preferences.narration) {
    app.narrationTimer += realDt;
    if (app.narrationTimer >= 8) {
      app.narrationTimer = 0;
      app.narrationIndex = (app.narrationIndex + 1) % narrationFacts.length;
      showNarration();
    }
  }
  updateVisuals(realDt);
  updateScienceOverlays();
  updateLensing();
  updateAdaptiveQuality(realDt);
  if (performanceMonitor.update(realDt, droppedSimulationFrame)) {
    const badge = document.querySelector('#perf-badge')!;
    badge.textContent = `${performanceMonitor.fps} FPS · ${deviceTier.toUpperCase()} · ${bodies.length} OBJECTS`;
    badge.classList.toggle('warning', performanceMonitor.fps < 42);
  }
  app.audioPulseTimer -= realDt;
  if (!app.paused && app.audioPulseTimer <= 0 && bodies.some(body => body.kind === 'pulsar')) {
    audio.play('pulsar', 0.28);
    app.audioPulseTimer = 0.7;
  }
  const viewDistance = camera.position.distanceTo(viewTarget);
  for (const body of bodies) {
    const inFocusedStructure = app.selectedGroupId === null || bodyGroupIds.get(body.id) === app.selectedGroupId;
    body.label.visible =
      body === app.selectedBody ||
      (!debrisIds.has(body.id) &&
        inFocusedStructure &&
        (viewDistance < 170 || (viewDistance < 650 && ['blackhole', 'nebula'].includes(body.kind))));
  }
  updateMatterStreams(realDt);
  updateTransients(realDt);
  app.flashEnergy = Math.max(0, app.flashEnergy - realDt * (app.flashEnergy > 1 ? 1.45 : 0.9));
  const flash = Math.min(1, app.flashEnergy),
    effectScale = app.effectsMode === 'gentle' ? 0.35 : 1;
  bloom.strength = BASE_BLOOM + Math.min(isCompact ? 1.05 : 2.15, app.flashEnergy * 1.35) * effectScale;
  renderer.toneMappingExposure = 1 + Math.min(isCompact ? 0.42 : 0.82, app.flashEnergy * 0.5) * effectScale;
  document.querySelector<HTMLElement>('#screen-flash')!.style.opacity = String(
    Math.pow(flash, 2.2) * (isCompact ? 0.58 : 0.86) * effectScale,
  );
  if (app.selectedBody) {
    selectionRing.position.copy(app.selectedBody.mesh.position).setY(0.08);
    selectionRing.scale.setScalar(Math.max(1.2, app.selectedBody.radius * 1.12));
    selectionRing.rotation.y += realDt * 0.18;
    app.inspectorTimer += realDt;
    if (app.inspectorTimer > 0.12) {
      app.inspectorTimer = 0;
      updateInspector();
    }
  }
  if (app.toastTimer > 0) {
    app.toastTimer -= realDt;
    if (app.toastTimer <= 0) document.querySelector('#toast')!.classList.remove('show');
  }
  document.querySelector('#elapsed')!.textContent = formatTime(app.elapsed);
  document.querySelector('#scale')!.textContent = `${(54 / viewDistance).toFixed(2)}×`;
  updateNebulaFrame(renderer, camera);
  composer.render();
  labelRenderer.render(scene, camera);
}

// The animation loop: fixed-step simulation, visuals, overlays and rendering.
import * as THREE from 'three';
import { saveRecoverySnapshot } from '../sandbox-state.ts';
import { updateNebulaFrame } from '../nebula-hd.ts';
import { runFixedSteps } from '../physics-continuity.ts';
import { refreshGroupNavigator } from '../bodies/groups.ts';
import { updateMatterStreams } from '../physics/matter-streams.ts';
import { MAX_SIM_STEPS, SIM_STEP, simulate } from '../physics/simulate.ts';
import { updateSlowMotion } from '../physics/tidal-disruption.ts';
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
import { narrationFacts, recoverySnapshot, reducedMotion, showNarration, updateAttractMode } from '../ui/feed.ts';
import { updateInspector } from '../ui/inspector.ts';
import { updateTransients } from '../visuals/effects.ts';
import { updateVisuals } from '../visuals/update-visuals.ts';

const clock = new THREE.Clock();
// DOM nodes written every frame are looked up once, and text is only written when it changes.
let dom: {
  perf: HTMLElement;
  flash: HTMLElement;
  toast: HTMLElement;
  elapsed: HTMLElement;
  scale: HTMLElement;
} | null = null;
const lastText = new WeakMap<HTMLElement, string>();
let lastFlashOpacity = '';

function domRefs() {
  dom ??= {
    perf: document.querySelector<HTMLElement>('#perf-badge')!,
    flash: document.querySelector<HTMLElement>('#screen-flash')!,
    toast: document.querySelector<HTMLElement>('#toast')!,
    elapsed: document.querySelector<HTMLElement>('#elapsed')!,
    scale: document.querySelector<HTMLElement>('#scale')!,
  };
  return dom;
}
function setText(element: HTMLElement, text: string) {
  if (lastText.get(element) === text) return;
  lastText.set(element, text);
  element.textContent = text;
}
function formatTime(s: number) {
  return `${Math.floor(s / 60)
    .toString()
    .padStart(2, '0')}:${Math.floor(s % 60)
    .toString()
    .padStart(2, '0')}`;
}
/**
 * Flash response for impacts and supernovae. Bloom, exposure and the CSS overlay used to peak together and
 * clip the frame to white; now the overlay carries the bright peak and bloom/exposure add a bounded glow.
 */
function applyFlash(dt: number) {
  app.flashEnergy = Math.max(0, app.flashEnergy - dt * (app.flashEnergy > 1 ? 1.45 : 0.9));
  const flash = Math.min(1, app.flashEnergy),
    effectScale = app.effectsMode === 'gentle' || reducedMotion.matches ? 0.35 : 1,
    glow = Math.min(1, app.flashEnergy * 0.75) * effectScale;
  bloom.strength = BASE_BLOOM + glow * (isCompact ? 0.55 : 0.85);
  renderer.toneMappingExposure = 1 + glow * (isCompact ? 0.18 : 0.28);
  const opacity = (Math.pow(flash, 2.2) * (isCompact ? 0.5 : 0.62) * effectScale).toFixed(3);
  if (opacity !== lastFlashOpacity) {
    lastFlashOpacity = opacity;
    domRefs().flash.style.opacity = opacity;
  }
}
function updateRecovery(dt: number) {
  app.recoveryTimer += dt;
  if (app.recoveryTimer < 15) return;
  app.recoveryTimer = 0;
  // Never checkpoint the attract demo, and leave the previous session's checkpoint alone until the visitor
  // has changed something in this one.
  const snapshot = app.attractMode ? null : recoverySnapshot();
  if (snapshot && snapshot.bodies.length) saveRecoverySnapshot(snapshot);
  if (bodies.length) refreshGroupNavigator();
}
// Escort warships fly in swarms: label them only when selected. A flagship is built larger than birth size.
function isEscortShip(body: (typeof bodies)[number]) {
  return body.artificial === 'warship' && body.mass <= body.birthMass;
}
function updateLabels() {
  const viewDistance = camera.position.distanceTo(viewTarget);
  for (const body of bodies) {
    const inFocusedStructure = app.selectedGroupId === null || bodyGroupIds.get(body.id) === app.selectedGroupId;
    body.label.visible =
      body === app.selectedBody ||
      (!body.debris &&
        !isEscortShip(body) &&
        inFocusedStructure &&
        (viewDistance < 170 || (viewDistance < 650 && (body.kind === 'blackhole' || body.kind === 'nebula'))));
  }
  return viewDistance;
}
export function animate() {
  requestAnimationFrame(animate);
  const realDt = Math.min(clock.getDelta(), 0.03),
    refs = domRefs();
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
  updateRecovery(realDt);
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
    setText(refs.perf, `${performanceMonitor.fps} FPS · ${deviceTier.toUpperCase()} · ${bodies.length} OBJECTS`);
    refs.perf.classList.toggle('warning', performanceMonitor.fps < 42);
  }
  app.audioPulseTimer -= realDt;
  if (!app.paused && app.audioPulseTimer <= 0 && bodies.some(body => body.kind === 'pulsar')) {
    audio.play('pulsar', 0.28);
    app.audioPulseTimer = 0.7;
  }
  const viewDistance = updateLabels();
  updateMatterStreams(realDt);
  updateTransients(realDt);
  applyFlash(realDt);
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
    if (app.toastTimer <= 0) refs.toast.classList.remove('show');
  }
  setText(refs.elapsed, formatTime(app.elapsed));
  setText(refs.scale, `${(54 / viewDistance).toFixed(2)}×`);
  updateNebulaFrame(renderer, camera);
  composer.render();
  labelRenderer.render(scene, camera);
}

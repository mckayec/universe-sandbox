// Placing palette bodies and builders at a free spot.
import * as THREE from 'three';
import { PALETTE_CHOICES, TYPES } from '../celestial-catalog.ts';
import { addBody } from '../bodies/registry.ts';
import { createGalaxy } from './galaxy.ts';
import { createBinarySystem, createSolarSystem, createTripleSystem } from './systems.ts';
import { transitionCamera } from '../scene/camera.ts';
import { camera, isCompact, viewTarget } from '../scene/setup.ts';
import { app, audio, bodies } from '../state/app-state.ts';
import { recordHistory } from '../state/history.ts';
import type { Body, GalaxyStyle } from '../state/types.ts';
import { select } from '../ui/feed.ts';

export function findOpenPlacement(origin: THREE.Vector3, radius: number, heavyClearance = 0) {
  const safe = origin.clone();
  safe.y = 0;
  const heavy = (body: Body) => ['star', 'blackhole', 'pulsar', 'brown'].includes(body.kind),
    clearance = (candidate: THREE.Vector3) =>
      bodies.every(
        body =>
          body.kind === 'nebula' ||
          candidate.distanceTo(body.mesh.position) >
            Math.max(radius + body.radius + Math.max(0.8, radius * 0.16), heavy(body) ? heavyClearance : 0),
      );
  if (clearance(safe)) return safe;
  const step = Math.max(radius * 1.8, Math.min(18, camera.position.distanceTo(viewTarget) * 0.1), 5);
  for (let ring = 1; ring <= 12; ring++) {
    const samples = ring * 6;
    for (let i = 0; i < samples; i++) {
      const angle = (i / samples) * Math.PI * 2 + ring * 0.47,
        candidate = safe
          .clone()
          .add(new THREE.Vector3(Math.cos(angle) * step * ring, 0, Math.sin(angle) * step * ring));
      if (clearance(candidate)) return candidate;
    }
  }
  return safe;
}
function addPaletteBody(pos: THREE.Vector3, vel = new THREE.Vector3()) {
  const choice = PALETTE_CHOICES.find(item => item.id === app.selectedChoiceId) ?? PALETTE_CHOICES[0],
    open = findOpenPlacement(pos, TYPES[choice.kind].radius);
  return addBody(choice.kind, open, vel, { mass: choice.mass, stage: choice.stage });
}

export function placeSelected(pos: THREE.Vector3) {
  recordHistory();
  const placed =
    app.selectedBuilder === 'system'
      ? createSolarSystem(pos)
      : app.selectedBuilder === 'binary'
        ? createBinarySystem(pos)
        : app.selectedBuilder === 'triple'
          ? createTripleSystem(pos)
          : app.selectedBuilder.startsWith('galaxy-')
            ? createGalaxy(pos, app.selectedBuilder.slice(7) as GalaxyStyle)
            : addPaletteBody(pos);
  audio.play('place', app.selectedBuilder === 'body' ? 0.7 : 1.2);
  select(placed);
  if (app.selectedBuilder === 'system') transitionCamera(placed.mesh.position, isCompact ? 190 : 135, 0.9);
  return placed;
}

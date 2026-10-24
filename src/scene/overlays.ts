// Science overlays (orbit / Hill / Roche rings, velocity arrow) and orbit-snap guides.
import * as THREE from 'three';
import { orbitalSpeed, rocheLobeRadius } from '../physics-continuity.ts';
import { G } from '../celestial-catalog.ts';
import { disposeObject } from './dispose.ts';
import {
  barycenterMarker,
  dragPoint,
  dragStart,
  scene,
  scienceHill,
  scienceOrbit,
  scienceOverlayGroup,
  scienceRoche,
  scienceVelocity,
} from './setup.ts';
import { app, bodies, orbitGuides } from '../state/app-state.ts';
import type { Body, OrbitGuide } from '../state/types.ts';
import { toast } from '../ui/feed.ts';
import { nearestOrbitTarget } from '../ui/inspector.ts';

export function updateScienceOverlays() {
  const body = app.selectedBody;
  if (app.scienceMode === 'off' || !body) {
    scienceOverlayGroup.visible = false;
    return;
  }
  scienceOverlayGroup.visible = true;
  const companion = nearestOrbitTarget(body);
  scienceVelocity.visible = body.velocity.lengthSq() > 0.002;
  scienceVelocity.position.copy(body.mesh.position).setY(0.28);
  if (scienceVelocity.visible) {
    scienceVelocity.setDirection(body.velocity.clone().setY(0).normalize());
    scienceVelocity.setLength(THREE.MathUtils.clamp(body.velocity.length() * 1.25, 1.2, 11), 0.55, 0.3);
  }
  scienceOrbit.visible = !!companion;
  scienceHill.visible = scienceRoche.visible = barycenterMarker.visible = app.scienceMode === 'full' && !!companion;
  if (!companion) return;
  const separation = body.mesh.position.distanceTo(companion.mesh.position),
    angle = Math.atan2(
      body.mesh.position.z - companion.mesh.position.z,
      body.mesh.position.x - companion.mesh.position.x,
    );
  scienceOrbit.position.copy(companion.mesh.position).setY(0.08);
  scienceOrbit.scale.setScalar(separation);
  const hillRadius = separation * Math.cbrt(Math.max(0.0001, body.mass / (3 * Math.max(body.mass, companion.mass))));
  scienceHill.position.copy(body.mesh.position).setY(0.1);
  scienceHill.scale.setScalar(Math.max(body.radius * 1.25, hillRadius));
  const rocheRadius = rocheLobeRadius(separation, body.mass, companion.mass);
  scienceRoche.position.copy(body.mesh.position).setY(0.12);
  scienceRoche.rotation.y = -angle;
  scienceRoche.scale.set(
    Math.max(body.radius * 1.12, rocheRadius * 1.18),
    1,
    Math.max(body.radius, rocheRadius * 0.82),
  );
  barycenterMarker.position
    .copy(body.mesh.position)
    .multiplyScalar(body.mass)
    .addScaledVector(companion.mesh.position, companion.mass)
    .divideScalar(body.mass + companion.mass)
    .setY(0.16);
  barycenterMarker.rotation.x = Math.PI / 2;
}

export function clearGuides() {
  for (const g of orbitGuides) {
    scene.remove(g.mesh);
    disposeObject(g.mesh);
  }
  orbitGuides.length = 0;
}
export function showGuides(b: Body) {
  clearGuides();
  const nearby = bodies
    .filter(x => x !== b && x.kind !== 'nebula' && x.kind !== 'protostar')
    .map(x => ({ x, d: x.mesh.position.distanceTo(b.mesh.position) }))
    .filter(x => x.d < 42)
    .sort((a, c) => a.d - c.d)
    .slice(0, 2);
  for (const { x } of nearby) {
    const base = Math.max(x.radius * 3.2, 5.5);
    for (const radius of [base, base * 1.65, base * 2.35]) {
      const points = Array.from({ length: 96 }, (_, i) => {
          const a = (i / 96) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * radius, 0.07, Math.sin(a) * radius);
        }),
        mesh = new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({ color: 0x719dff, transparent: true, opacity: 0.32, depthWrite: false }),
        );
      mesh.position.copy(x.mesh.position);
      scene.add(mesh);
      orbitGuides.push({ mesh, center: x, radius });
    }
  }
}
export function snapOrbit(b: Body) {
  let best: OrbitGuide | null = null,
    error = Infinity;
  for (const g of orbitGuides) {
    const e = Math.abs(b.mesh.position.distanceTo(g.center.mesh.position) - g.radius);
    if (e < error) {
      best = g;
      error = e;
    }
  }
  if (!best || error > Math.max(1.3, best.radius * 0.12)) return false;
  const radial = b.mesh.position.clone().sub(best.center.mesh.position).setY(0).normalize();
  b.mesh.position.copy(best.center.mesh.position).addScaledVector(radial, best.radius);
  const tangent = new THREE.Vector3(-radial.z, 0, radial.x);
  if (dragPoint.clone().sub(dragStart).cross(radial).y < 0) tangent.multiplyScalar(-1);
  b.velocity
    .copy(best.center.velocity)
    .addScaledVector(tangent, orbitalSpeed(G, app.gravity, best.center.mass, best.radius));
  toast(`${b.name} entered orbit around ${best.center.name}`);
  return true;
}

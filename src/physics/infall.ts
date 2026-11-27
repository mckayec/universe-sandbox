// Slow accretion (a paced exhibit rule, not a disruption calculation): a star or giant planet that reaches a
// black hole or pulsar is not swallowed in one frame. It is moved onto a prescribed shrinking orbit just outside
// the compact object (the horizon of a black hole, the surface of a pulsar) and its mass is handed over through a
// stream into a simplified disk over tens of seconds, before the remainder merges. Durations are display pacing,
// not physical times; stellar disruption, disk viscosity and outflows are not resolved.
import * as THREE from 'three';
import { G, type Kind } from '../celestial-catalog.ts';
import { infallDurationFor, infallRemainingMass, releaseCapture } from '../infall-model.ts';
import { updateScale } from '../bodies/lifecycle.ts';
import { ensureMatterStream } from './matter-streams.ts';
import { accreteMomentum, applyGrowthProgression } from './stellar-evolution.ts';
import { app, bodies } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { museumEvent } from '../ui/feed.ts';

const FOOD = new Set<Kind>(['star', 'brown', 'gas']),
  EATERS = new Set<Kind>(['blackhole', 'pulsar']),
  tangent = new THREE.Vector3();

export { infallDuration } from '../infall-model.ts';
/** Whether `eater` should feed on `food` gradually instead of swallowing it on contact. */
export function feedsSlowly(eater: Body, food: Body) {
  return (
    EATERS.has(eater.kind) &&
    FOOD.has(food.kind) &&
    !food.infall &&
    !food.artificial &&
    !food.locked &&
    eater.mass > food.mass * 1.4
  );
}
/** Capture `food` into a decaying orbit around `eater`. Momentum is handed over now; the orbit is internal. */
export function beginInfall(eater: Body, food: Body) {
  const offset = food.mesh.position.clone().sub(eater.mesh.position).setY(0),
    relative = food.velocity.clone().sub(eater.velocity),
    angularMomentum = offset.z * relative.x - offset.x * relative.z,
    duration = infallDurationFor(food.mass, food.kind, app.realismMode);
  accreteMomentum(eater, food.velocity, food.mass, eater.mass);
  food.infall = {
    eaterId: eater.id,
    age: 0,
    duration,
    startMass: food.mass,
    startRadius: Math.max(offset.length(), eater.radius * 1.35),
    angle: Math.atan2(offset.z, offset.x),
    // Positive angular momentum about +Y means the angle (atan2 z, x) decreases.
    sense: angularMomentum > 0 ? -1 : 1,
    heldStage: food.holdStage ?? false,
  };
  food.holdStage = true;
  food.collisionCooldown = Math.max(food.collisionCooldown, 0.5);
  food.lastEvent = `Captured by ${eater.name}; being stripped into its disk`;
  eater.lastEvent = `Slowly accreting ${food.name} through its disk`;
  museumEvent(
    'Slow accretion begins',
    `In this demonstration, ${eater.name} captures ${food.name} and transfers its mass through a simplified disk over about ${Math.round(duration)} simulation seconds.`,
    '#ffb36b',
    eater,
  );
}
function endInfall(food: Body) {
  releaseCapture(food);
}
/**
 * Advance every captured body. Returns the bodies whose last layers have just been handed over so the caller
 * can swallow the remainder with the ordinary merger rules.
 */
export function updateInfall(dt: number): Array<[Body, Body]> {
  const finished: Array<[Body, Body]> = [];
  for (const food of bodies) {
    const state = food.infall;
    if (!state || food.removed) continue;
    const eater = bodies.find(body => body.id === state.eaterId);
    if (!eater || eater.removed || food === app.dragBody) {
      endInfall(food);
      continue;
    }
    state.age += dt;
    const u = THREE.MathUtils.clamp(state.age / state.duration, 0, 1),
      // Tides peel the outer layers first, so most of the mass goes early and the dense core lingers.
      remaining = infallRemainingMass(state.startMass, state.age, state.duration),
      transfer = Math.max(0, food.mass - remaining);
    if (transfer > 0) {
      food.mass -= transfer;
      eater.mass += transfer;
    }
    const radius = THREE.MathUtils.lerp(state.startRadius, eater.radius * 0.55, Math.pow(u, 1.6)),
      omega = Math.min(2.4, Math.sqrt((G * app.gravity * Math.max(1, eater.mass)) / Math.pow(radius, 3)));
    state.angle += state.sense * omega * dt;
    const c = Math.cos(state.angle),
      s = Math.sin(state.angle);
    food.mesh.position.set(
      eater.mesh.position.x + c * radius,
      eater.mesh.position.y,
      eater.mesh.position.z + s * radius,
    );
    food.velocity.copy(eater.velocity).add(tangent.set(-s, 0, c).multiplyScalar(state.sense * omega * radius));
    food.tidalStretch = Math.max(food.tidalStretch, 0.35 + 0.5 * Math.sqrt(u));
    food.tidalAngle = Math.atan2(-s, -c);
    food.tidalPartnerId = eater.id;
    ensureMatterStream(food, eater, eater.kind === 'blackhole' ? 'debris' : 'plasma', 0.45 + 0.55 * Math.sqrt(u));
    food.accretionFx -= dt;
    if (food.accretionFx <= 0) {
      food.accretionFx = 0.2;
      updateScale(food);
      applyGrowthProgression(eater);
    }
    if (u >= 1 || food.mass < 0.5) {
      endInfall(food);
      finished.push([eater, food]);
    }
  }
  return finished;
}

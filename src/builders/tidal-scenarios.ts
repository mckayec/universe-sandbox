// Tidal Disruption Lab and Fall of Gododdin exhibit scenarios.
import * as THREE from 'three';
import { G } from '../celestial-catalog.ts';
import { registerCosmicGroup, setBodyName } from '../bodies/groups.ts';
import { addBody } from '../bodies/registry.ts';
import { transitionCamera } from '../scene/camera.ts';
import { isCompact } from '../scene/setup.ts';
import { app } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { updateScienceModeButton } from '../ui/controls.ts';

// ── Tidal scenarios ───────────────────────────────────────────────────────
// Predict where unperturbed bodies will be after `seconds`, so a perturber can be aimed at a moving target.
function predictPositions(members: Body[], seconds: number) {
  const state = members.map(body => ({ body, pos: body.mesh.position.clone(), vel: body.velocity.clone() })),
    step = 1 / 120,
    delta = new THREE.Vector3();
  for (let t = 0; t < seconds; t += step) {
    for (const a of state) {
      if (a.body.locked) continue;
      for (const b of state) {
        if (a === b) continue;
        delta.copy(b.pos).sub(a.pos);
        const d2 = Math.max(delta.lengthSq(), (a.body.radius + b.body.radius) ** 2 * 0.35);
        a.vel.addScaledVector(delta.normalize(), ((G * app.gravity * b.body.mass) / d2) * step);
      }
    }
    for (const a of state) if (!a.body.locked) a.pos.addScaledVector(a.vel, step);
  }
  return new Map(state.map(entry => [entry.body.id, entry.pos] as const));
}
// Start position/velocity for a straight-line pass that comes `miss` units from `arrival`, offset toward `side`, after `lead` seconds.
function flybyStart(arrival: THREE.Vector3, side: THREE.Vector3, miss: number, speed: number, lead: number) {
  const offset = side.clone().setY(0).normalize(),
    direction = new THREE.Vector3(-offset.z, 0, offset.x),
    closest = arrival.clone().addScaledVector(offset, miss);
  return {
    position: closest.clone().addScaledVector(direction, -speed * lead),
    velocity: direction.multiplyScalar(speed),
  };
}
function orbitVelocity(center: Body, position: THREE.Vector3, clockwise = true) {
  const radial = position.clone().sub(center.mesh.position).setY(0),
    r = radial.length(),
    tangent = new THREE.Vector3(radial.z, 0, -radial.x).normalize();
  if (!clockwise) tangent.multiplyScalar(-1);
  return center.velocity.clone().addScaledVector(tangent, Math.sqrt((G * app.gravity * center.mass) / r));
}
const tidalLabMiss = 3.4,
  gododdinMiss = 3.6;
export function createTidalLab() {
  const star = setBodyName(
    addBody('star', new THREE.Vector3(), new THREE.Vector3(), {
      mass: 210,
      stage: 'yellow star',
      locked: true,
      holdStage: true,
      lastEvent: 'A calm star whose system is about to be crossed by a rogue black hole',
    }),
    'Halcyon',
  );
  const planetPos = new THREE.Vector3(0, 0, -16),
    planet = setBodyName(
      addBody('rocky', planetPos, orbitVelocity(star, planetPos), {
        variant: 3,
        mass: 10,
        lastEvent: 'An ocean world on a calm orbit',
      }),
      'Tethys',
    );
  const moonPos = planetPos.clone().add(new THREE.Vector3(2.6, 0, 0)),
    moon = setBodyName(
      addBody('moon', moonPos, orbitVelocity(planet, moonPos), {
        variant: 1,
        mass: 0.74,
        lastEvent: `Orbiting ${planet.name}`,
      }),
      'Tethys I',
    );
  const giantPos = new THREE.Vector3(30, 0, 10),
    giant = setBodyName(
      addBody('gas', giantPos, orbitVelocity(star, giantPos), {
        variant: 0,
        mass: 34,
        lastEvent: 'A banded giant on the outer orbit',
      }),
      'Boreas',
    );
  const giantMoonPos = giantPos.clone().add(new THREE.Vector3(0, 0, 3.6)),
    giantMoon = setBodyName(
      addBody('moon', giantMoonPos, orbitVelocity(giant, giantMoonPos), {
        variant: 3,
        mass: 0.6,
        lastEvent: `Orbiting ${giant.name}`,
      }),
      'Boreas I',
    );
  const lead = 6.5,
    future = predictPositions([star, planet, moon, giant, giantMoon], lead),
    arrival = future.get(planet.id)!,
    approach = flybyStart(arrival, arrival.clone().sub(star.mesh.position), tidalLabMiss, 15, lead);
  const hole = setBodyName(
    addBody('blackhole', approach.position, approach.velocity, {
      mass: 650,
      variant: 1,
      collisionCooldown: 2,
      lastEvent: 'A rogue stellar black hole falling through the system',
    }),
    'Rogue Black Hole',
  );
  registerCosmicGroup('system', [star, planet, moon, giant, giantMoon, hole], 'Tidal Disruption Lab');
  transitionCamera(arrival.clone().add(new THREE.Vector3(0, 0, -8)), isCompact ? 70 : 54);
  app.scienceMode = 'full';
  updateScienceModeButton();
  return planet;
}
export function createGododdin() {
  const sun = setBodyName(
    addBody('star', new THREE.Vector3(), new THREE.Vector3(), {
      mass: 230,
      stage: 'yellow star',
      locked: true,
      holdStage: true,
      lastEvent: "Gododdin's sun",
    }),
    "Gododdin's Sun",
  );
  const worldPos = new THREE.Vector3(18, 0, 0),
    world = setBodyName(
      addBody('rocky', worldPos, orbitVelocity(sun, worldPos), {
        variant: 3,
        mass: 12,
        lastEvent: 'An imperial world where the human fleet has massed',
      }),
      'Gododdin',
    );
  const moonPos = worldPos.clone().add(new THREE.Vector3(6, 0, 0)),
    moon = setBodyName(
      addBody('moon', moonPos, orbitVelocity(world, moonPos), {
        variant: 0,
        mass: 0.74,
        lastEvent: "Gododdin's moon, on the far side from the sun",
      }),
      "Gododdin's Moon",
    );
  const lead = 5,
    future = predictPositions([sun, world, moon], lead),
    arrival = future.get(moon.id)!,
    approach = flybyStart(arrival, arrival.clone().sub(future.get(world.id)!), gododdinMiss, 72, lead);
  const ship = setBodyName(
    addBody('brown', approach.position, approach.velocity, {
      mass: 260,
      artificial: 'worldship',
      warpBoost: 40,
      collisionCooldown: 2,
      lastEvent:
        'A Cielcin worldship running at warp; its wake distorts space around it (a fictional boost to tidal stress)',
    }),
    'Cielcin Worldship',
  );
  registerCosmicGroup('system', [sun, world, moon, ship], 'Gododdin System');
  transitionCamera(
    arrival
      .clone()
      .lerp(future.get(world.id)!, 0.35)
      .add(new THREE.Vector3(0, 0, -7)),
    isCompact ? 58 : 42,
  );
  return moon;
}

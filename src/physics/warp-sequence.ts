// The Fall of Gododdin (Sun Eater, Shadows Upon Time): a scripted timeline of Cielcin worldships at warp.
// Worldships first cross the massed fleet without leaving warp, their wakes destroying ships; then they drop out of
// warp around the planet; finally one drops out of warp into Gododdin itself and the shock tears the world apart.
import * as THREE from 'three';
import { refreshGroupNavigator, setBodyName } from '../bodies/groups.ts';
import { removeBody } from '../bodies/lifecycle.ts';
import { addBody } from '../bodies/registry.ts';
import { camera, isCompact, viewTarget } from '../scene/setup.ts';
import { app, bodies, bodyGroupIds, cosmicGroups } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { museumEvent } from '../ui/feed.ts';
import { impactEffect, particleBurst, warpEmergenceEffect, warpStreakEffect } from '../visuals/effects.ts';

/** Sim-time (seconds) of each beat. */
export const WARP_BEATS = { firstPass: 2.5, secondPass: 3.6, surround: 5.5, strike: 8, shockEnds: 14 } as const;
const STREAK_TIME = 0.45,
  STRIKE_BOOST = 5;

export function startWarpSequence(world: Body) {
  app.warpScript = { time: 0, worldId: world.id, stage: 0, kills: [] };
}
const byId = (id: number | undefined) => (id === undefined ? undefined : bodies.find(body => body.id === id));
const fleet = () => bodies.filter(body => body.artificial === 'warship' && body.name !== 'Demiurge');

function joinGroup(body: Body, world: Body) {
  const groupId = bodyGroupIds.get(world.id),
    group = groupId === undefined ? undefined : cosmicGroups.find(candidate => candidate.id === groupId);
  if (!group) return;
  group.bodyIds.push(body.id);
  bodyGroupIds.set(body.id, group.id);
}
function scheduleKill(at: number, ship: Body) {
  const script = app.warpScript!;
  if (script.kills.some(kill => kill.id === ship.id)) return;
  script.kills.push({ at, id: ship.id });
}
function destroyShip(ship: Body) {
  const point = ship.mesh.position.clone();
  impactEffect(point, 0xffa25a, 0.42);
  particleBurst(point, 0xffd08a, isCompact ? 16 : 34, 1.6, 1.2);
  removeBody(ship);
}
// A worldship crosses the fleet at warp along a line `offset` units from the planet's centre.
function warpPass(world: Body, angle: number, offset: number) {
  const along = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)),
    across = new THREE.Vector3(-along.z, 0, along.x),
    centre = world.mesh.position.clone().addScaledVector(across, offset),
    from = centre.clone().addScaledVector(along, -42),
    to = centre.clone().addScaledVector(along, 42);
  warpStreakEffect(from, to, STREAK_TIME);
  const script = app.warpScript!;
  for (const ship of fleet()) {
    const rel = ship.mesh.position.clone().sub(from),
      t = rel.dot(along),
      miss = rel.addScaledVector(along, -t).length();
    if (miss < 1.05) scheduleKill(script.time + (t / 84) * STREAK_TIME + 0.04, ship);
  }
}
function emergeWorldship(world: Body, position: THREE.Vector3, mass: number, boost?: number) {
  const ship = setBodyName(
    addBody('brown', position, world.velocity.clone(), {
      mass,
      // Drawn at about half a brown dwarf's size so the planet and fleet stay readable beside it.
      birthMass: mass * 8,
      artificial: 'worldship',
      warpBoost: boost,
      lastEvent: boost
        ? 'Dropped out of warp into Gododdin; the shock of its arrival is tearing the planet apart (fiction)'
        : 'Dropped out of warp around Gododdin',
    }),
    'Cielcin Worldship',
  );
  // Out of warp now: no warp wake trailing behind it.
  const wake = ship.mesh.getObjectByName('warpWake');
  if (wake) wake.visible = false;
  joinGroup(ship, world);
  warpEmergenceEffect(position, boost ? 14 : 8, boost ? 1 : 0.6);
  return ship;
}
function killNear(point: THREE.Vector3, reach: number, start: number, spread: number) {
  for (const ship of fleet()) {
    const d = ship.mesh.position.distanceTo(point);
    if (d < reach) scheduleKill(start + (d / reach) * spread, ship);
  }
}
function surround(world: Body) {
  const count = isCompact ? 3 : 5,
    script = app.warpScript!;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + 0.4,
      position = world.mesh.position.clone().add(new THREE.Vector3(Math.cos(angle) * 7.6, 0, Math.sin(angle) * 7.6));
    emergeWorldship(world, position, 30);
    killNear(position, 3.4, script.time + 0.15, 0.5);
  }
}
function strike(world: Body) {
  const script = app.warpScript!,
    toward = new THREE.Vector3(Math.cos(-2.2), 0, Math.sin(-2.2)),
    position = world.mesh.position.clone().addScaledVector(toward, world.radius + 1.05),
    ship = emergeWorldship(world, position, 60, STRIKE_BOOST);
  script.strikeId = ship.id;
  killNear(world.mesh.position, 5.2, script.time + 0.1, 1.1);
  return ship;
}

export function updateWarpSequence(dt: number) {
  const script = app.warpScript;
  if (!script) return;
  if (app.currentExhibit !== 'gododdin') {
    app.warpScript = null;
    return;
  }
  script.time += dt;
  const world = byId(script.worldId);
  if (script.stage === 0 && script.time >= WARP_BEATS.firstPass) {
    script.stage = 1;
    if (world) {
      warpPass(world, 0.35, 3.25);
      museumEvent(
        'Passage at warp',
        'Cielcin worldships cross the massed fleet without ever leaving warp. Ships caught in their wakes are torn apart and their fuel detonates.',
        '#b79bff',
        world,
      );
    }
  }
  if (script.stage === 1 && script.time >= WARP_BEATS.secondPass) {
    script.stage = 2;
    if (world) warpPass(world, 2.2, -2.7);
  }
  if (script.stage === 2 && script.time >= WARP_BEATS.surround) {
    script.stage = 3;
    if (world) {
      surround(world);
      museumEvent(
        'Out of warp',
        'Worldships drop out of warp all around Gododdin. Gravity waves from their arrival ripple through what is left of the fleet.',
        '#b79bff',
        world,
      );
    }
  }
  if (script.stage === 3 && script.time >= WARP_BEATS.strike) {
    script.stage = 4;
    if (world) {
      const ship = strike(world);
      museumEvent(
        'Into the world',
        'One worldship drops out of warp into Gododdin itself. The shock of its arrival tears the planet apart.',
        '#ffcf7a',
        ship,
      );
    }
  }
  if (script.stage === 4 && (!world || script.time >= WARP_BEATS.shockEnds)) {
    // The arrival shock is momentary: afterwards the worldship is just a very large ship.
    script.stage = 5;
    const ship = byId(script.strikeId);
    if (ship) {
      ship.warpBoost = undefined;
      ship.lastEvent = 'Dropped out of warp into Gododdin, which broke apart around it';
    }
  }
  let removed = false;
  for (let i = script.kills.length - 1; i >= 0; i--) {
    const kill = script.kills[i];
    if (kill.at > script.time) continue;
    script.kills.splice(i, 1);
    const ship = byId(kill.id);
    if (ship && !ship.removed) {
      destroyShip(ship);
      removed = true;
    }
  }
  if (removed) refreshGroupNavigator();
  followFocus(world ?? byId(script.strikeId));
}
// Gododdin orbits its sun, so carry the camera along with it (keeping any zoom or pan the visitor has chosen).
function followFocus(target: Body | undefined) {
  const script = app.warpScript!;
  if (!target) return;
  const { x, z } = target.mesh.position;
  if (script.focus?.id === target.id) {
    const dx = x - script.focus.x,
      dz = z - script.focus.z;
    camera.position.x += dx;
    camera.position.z += dz;
    viewTarget.x += dx;
    viewTarget.z += dz;
    const transition = app.cameraTransition;
    if (transition)
      for (const v of [transition.fromPosition, transition.toPosition, transition.fromTarget, transition.toTarget]) {
        v.x += dx;
        v.z += dz;
      }
    camera.lookAt(viewTarget);
  }
  script.focus = { id: target.id, x, z };
}

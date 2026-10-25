// Builders for Our Solar System, binary and triple star systems.
import * as THREE from 'three';
import { orbitalSpeed } from '../physics-continuity.ts';
import { G } from '../celestial-catalog.ts';
import { registerCosmicGroup, setBodyName } from '../bodies/groups.ts';
import { addBody } from '../bodies/registry.ts';
import { findOpenPlacement } from './placement.ts';
import { bulkOrbitVelocity } from '../physics/galaxy-dynamics.ts';
import { app, cosmicGroups } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { museumEvent } from '../ui/feed.ts';

// Sun-like track (170–240). Planet masses keep the original preset's proportions relative to the Sun.
// Within the preset, planets orbit the Sun without tugging on each other or yanking the Sun around (see sameExhibitSystem);
// the exhibit's compressed scale exaggerates those pulls ~1000x. Outside objects still feel and exert full gravity.
const SUN_MASS = 230;
/** Circular orbital speed around `mass` at `radius`, honoring the gravity slider. */
const circular = (mass: number, radius: number) => orbitalSpeed(G, app.gravity, mass, radius);
export function createSolarSystem(origin: THREE.Vector3) {
  const members: Body[] = [],
    center = findOpenPlacement(origin, 64, 230),
    // Placed inside a galaxy, the whole system orbits its core instead of falling straight in.
    bulk = bulkOrbitVelocity(center),
    sequence = cosmicGroups.filter(group => group.name.startsWith('Solar System • Sol')).length + 1,
    sun = setBodyName(
      addBody('star', center, bulk.clone(), {
        mass: SUN_MASS,
        birthMass: SUN_MASS,
        stage: 'yellow star',
        collisionCooldown: 3,
        lastEvent: 'The Sun anchors a compressed-scale model of our planetary neighborhood',
      }),
      'Sun',
    ),
    worlds: Array<{
      name: string;
      kind: 'rocky' | 'gas';
      radius: number;
      mass: number;
      variant: number;
      angle: number;
    }> = [
      { name: 'Mercury', kind: 'rocky', radius: 7, mass: 0.1, variant: 0, angle: 0.2 },
      { name: 'Venus', kind: 'rocky', radius: 10, mass: 1, variant: 1, angle: 1.05 },
      { name: 'Earth', kind: 'rocky', radius: 13.5, mass: 1.2, variant: 3, angle: 2.08 },
      { name: 'Mars', kind: 'rocky', radius: 17.5, mass: 0.27, variant: 2, angle: 3.2 },
      { name: 'Jupiter', kind: 'gas', radius: 25, mass: 9.2, variant: 0, angle: 4.2 },
      { name: 'Saturn', kind: 'gas', radius: 32.5, mass: 6.9, variant: 1, angle: 5.08 },
      { name: 'Uranus', kind: 'gas', radius: 40.5, mass: 3.4, variant: 2, angle: 0.62 },
      { name: 'Neptune', kind: 'gas', radius: 48.5, mass: 3.8, variant: 3, angle: 2.75 },
    ];
  members.push(sun);
  let earth: Body | undefined;
  for (const data of worlds) {
    const direction = new THREE.Vector3(Math.cos(data.angle), 0, Math.sin(data.angle)),
      tangent = new THREE.Vector3(-direction.z, 0, direction.x),
      velocity = tangent.multiplyScalar(circular(sun.mass, data.radius)).add(bulk),
      planet = setBodyName(
        addBody(data.kind, center.clone().addScaledVector(direction, data.radius), velocity, {
          mass: data.mass,
          variant: data.variant,
          collisionCooldown: 3,
          lastEvent: `Following a compressed-scale orbit around the Sun`,
        }),
        data.name,
      );
    if (data.name === 'Earth') earth = planet;
    members.push(planet);
  }
  if (earth) {
    const radius = 2.35,
      direction = new THREE.Vector3(0.86, 0, 0.51).normalize(),
      tangent = new THREE.Vector3(-direction.z, 0, direction.x),
      moon = setBodyName(
        addBody(
          'moon',
          earth.mesh.position.clone().addScaledVector(direction, radius),
          earth.velocity.clone().addScaledVector(tangent, circular(earth.mass, radius)),
          { mass: 0.14, variant: 1, collisionCooldown: 3, lastEvent: 'Orbiting Earth' },
        ),
        'Moon',
      );
    moon.satelliteHostId = earth.id;
    moon.satelliteOrbit = radius;
    moon.satelliteAngle = Math.atan2(direction.z, direction.x);
    moon.satelliteRate = 1.15;
    members.push(moon);
  }
  const plutoDirection = new THREE.Vector3(-0.74, 0, 0.67).normalize(),
    pluto = setBodyName(
      addBody(
        'dwarf',
        center.clone().addScaledVector(plutoDirection, 56),
        new THREE.Vector3(-plutoDirection.z, 0, plutoDirection.x).multiplyScalar(circular(sun.mass, 56)).add(bulk),
        {
          mass: 0.08,
          variant: 1,
          collisionCooldown: 3,
          lastEvent: 'Dwarf planet beyond Neptune in this compressed exhibit scale',
        },
      ),
      'Pluto',
    );
  members.push(pluto);
  const group = registerCosmicGroup('system', members, `Solar System • Sol ${sequence}`);
  for (const member of members) member.exhibitSystemId = group.id;
  sun.exhibitAnchor = true;
  sun.holdStage = true;
  museumEvent(
    'Our Solar System implanted',
    `${group.name} includes the Sun, eight planets, Earth's Moon, and dwarf planet Pluto. Distances and sizes are compressed for play.`,
    '#ffd57c',
    sun,
  );
  return sun;
}
export function createBinarySystem(origin: THREE.Vector3) {
  const center = findOpenPlacement(origin, 42),
    members: Body[] = [],
    // Wide enough that neither main-sequence star fills its Roche lobe; transfer starts once the primary swells
    // into a giant, as the exhibit describes.
    separation = 15,
    massA = 270,
    massB = 185,
    total = massA + massB,
    radiusA = (separation * massB) / total,
    radiusB = (separation * massA) / total,
    omega = circular(total, separation) / separation,
    starA = addBody(
      'star',
      center.clone().add(new THREE.Vector3(-radiusA, 0, 0)),
      new THREE.Vector3(0, 0, -omega * radiusA),
      { mass: massA, stage: 'white star', collisionCooldown: 3, lastEvent: 'Primary star in a close binary system' },
    ),
    starB = addBody(
      'star',
      center.clone().add(new THREE.Vector3(radiusB, 0, 0)),
      new THREE.Vector3(0, 0, omega * radiusB),
      { mass: massB, stage: 'yellow star', collisionCooldown: 3, lastEvent: 'Donor star approaching its Roche lobe' },
    );
  members.push(starA, starB);
  // Circumbinary orbits need roughly 3× the binary separation to stay stable.
  const orbitRadius = 46,
    direction = new THREE.Vector3(0.22, 0, 0.98).normalize(),
    planet = addBody(
      'rocky',
      center.clone().addScaledVector(direction, orbitRadius),
      new THREE.Vector3(-direction.z, 0, direction.x).multiplyScalar(circular(total, orbitRadius)),
      { mass: 9, variant: 3, collisionCooldown: 3, lastEvent: 'Circumbinary ocean world' },
    );
  members.push(planet);
  const group = registerCosmicGroup('binary', members);
  museumEvent(
    'Binary system assembled',
    `${group.name} demonstrates barycentric orbits, Roche lobes, and future mass transfer.`,
    '#9ec5ff',
    starA,
  );
  return starA;
}
export function createTripleSystem(origin: THREE.Vector3) {
  const center = findOpenPlacement(origin, 56),
    members: Body[] = [],
    massA = 270,
    massB = 190,
    innerTotal = massA + massB,
    massC = 155,
    total = innerTotal + massC,
    outerSeparation = 50,
    innerCenterOffset = (-outerSeparation * massC) / total,
    outerOffset = (outerSeparation * innerTotal) / total,
    outerOmega = circular(total, outerSeparation) / outerSeparation,
    innerCenter = center.clone().add(new THREE.Vector3(innerCenterOffset, 0, 0)),
    innerVelocity = new THREE.Vector3(0, 0, outerOmega * innerCenterOffset),
    separation = 14,
    radiusA = (separation * massB) / innerTotal,
    radiusB = (separation * massA) / innerTotal,
    innerOmega = circular(innerTotal, separation) / separation,
    primary = setBodyName(
      addBody(
        'star',
        innerCenter.clone().add(new THREE.Vector3(-radiusA, 0, 0)),
        innerVelocity.clone().add(new THREE.Vector3(0, 0, -innerOmega * radiusA)),
        {
          mass: massA,
          stage: 'white star',
          collisionCooldown: 3,
          lastEvent: 'Primary in the close inner binary of a hierarchical triple',
        },
      ),
      'Primary A',
    ),
    companion = setBodyName(
      addBody(
        'star',
        innerCenter.clone().add(new THREE.Vector3(radiusB, 0, 0)),
        innerVelocity.clone().add(new THREE.Vector3(0, 0, innerOmega * radiusB)),
        { mass: massB, stage: 'yellow star', collisionCooldown: 3, lastEvent: 'Companion in the close inner binary' },
      ),
      'Companion B',
    ),
    tertiary = setBodyName(
      addBody(
        'star',
        center.clone().add(new THREE.Vector3(outerOffset, 0, 0)),
        new THREE.Vector3(0, 0, outerOmega * outerOffset),
        {
          mass: massC,
          stage: 'red dwarf',
          collisionCooldown: 3,
          lastEvent: 'Outer star orbiting the close pair on a wider path',
        },
      ),
      'Outer Star C',
    );
  members.push(primary, companion, tertiary);
  const group = registerCosmicGroup('triple', members);
  museumEvent(
    'Triple-star system assembled',
    `${group.name} uses a stable hierarchical layout: a close binary orbited by a more distant third star.`,
    '#c9d7ff',
    primary,
  );
  return primary;
}

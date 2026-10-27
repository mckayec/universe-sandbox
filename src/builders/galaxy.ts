// Galaxy builder (spiral, elliptical, lenticular, irregular, globular).
import * as THREE from 'three';
import { stellarBirthStage } from '../simulation-model.ts';
import { softenedDistanceSq } from '../gravity-engine.ts';
import { G, TYPES } from '../celestial-catalog.ts';
import { createGalaxyBackdrop, galaxyName, registerCosmicGroup, setBodyName } from '../bodies/groups.ts';
import { addBody } from '../bodies/registry.ts';
import { findOpenPlacement } from './placement.ts';
import { seeded } from '../physics/body-math.ts';
import {
  GALAXY_CORE_SOFTENING,
  enclosedHaloMass,
  galaxyExtent,
  galaxySpinTangent,
} from '../physics/galaxy-dynamics.ts';
import { isCompact } from '../scene/setup.ts';
import { app, bodies, cosmicGroups, galaxyVisuals } from '../state/app-state.ts';
import type { Body, CosmicGroup, GalaxyStyle } from '../state/types.ts';
import { museumEvent } from '../ui/feed.ts';

/** Member masses chosen so each label sits on its stellar track: red 120, yellow 210, white 270, blue 360. */
export const GALAXY_MEMBER_MASSES = { red: 120, yellow: 210, white: 270, blue: 360 } as const;
const DISK_SEQUENCE = [
    GALAXY_MEMBER_MASSES.red,
    GALAXY_MEMBER_MASSES.yellow,
    GALAXY_MEMBER_MASSES.white,
    GALAXY_MEMBER_MASSES.blue,
  ],
  OLD_SEQUENCE = [
    GALAXY_MEMBER_MASSES.yellow,
    GALAXY_MEMBER_MASSES.red,
    GALAXY_MEMBER_MASSES.red,
    GALAXY_MEMBER_MASSES.red,
  ];

/** Mass of the i-th interactive star of a galaxy style. */
export function galaxyMemberMass(style: GalaxyStyle, index: number) {
  return (style === 'globular' || style === 'elliptical' ? OLD_SEQUENCE : DISK_SEQUENCE)[index % 4];
}
/** Interactive member stars per galaxy (the rendered tracer stars number in the tens of thousands). */
export const GALAXY_MEMBER_COUNT = { desktop: 18, compact: 10 } as const;
/** Dark-matter halo mass and scale radius per style. */
function haloFor(style: GalaxyStyle) {
  return style === 'globular'
    ? { mass: 5000, scale: 36 }
    : style === 'irregular'
      ? { mass: 9000, scale: 58 }
      : { mass: 9000, scale: 66 };
}
/**
 * Circular speed at `radius` under the forces a galaxy member actually feels: its softened core plus the halo.
 * Member nebulae orbit with the disk too (see simulate.ts), but their extended softening slightly weakens the pull.
 */
function memberOrbitSpeed(
  anchor: Body,
  halo: { mass: number; scale: number },
  radius: number,
  memberRadius: number,
  nebula = false,
) {
  const g = G * app.gravity,
    softening = (nebula ? memberRadius * memberRadius * 1.8 : 0) + GALAXY_CORE_SOFTENING,
    anchorPull = (g * anchor.mass) / softenedDistanceSq(radius * radius, softening, 0, memberRadius, anchor.radius),
    haloPull = (g * enclosedHaloMass(halo.mass, radius, halo.scale)) / (radius * radius);
  return Math.sqrt(Math.max(0, (anchorPull + haloPull) * radius));
}
/** The nearest existing galaxy core within reach, for setting a new galaxy on an encounter course. */
function nearestGalaxy(center: THREE.Vector3) {
  let best: { group: CosmicGroup; anchor: Body; distance: number } | undefined;
  for (const group of cosmicGroups) {
    if (group.kind !== 'galaxy' || group.anchorId === undefined) continue;
    const anchor = bodies.find(body => body.id === group.anchorId);
    if (!anchor) continue;
    const distance = anchor.mesh.position.distanceTo(center);
    if (distance > 40 && distance < 1100 && (!best || distance < best.distance)) best = { group, anchor, distance };
  }
  return best;
}
export function createGalaxy(origin: THREE.Vector3, style: GalaxyStyle = 'spiral') {
  const members: Body[] = [],
    count = isCompact ? GALAXY_MEMBER_COUNT.compact : GALAXY_MEMBER_COUNT.desktop,
    extent = galaxyExtent(style),
    center = findOpenPlacement(origin, 158),
    hasBlackHole = !['irregular', 'globular'].includes(style),
    halo = haloFor(style),
    coreMass = style === 'globular' ? 160 : 230,
    neighbour = nearestGalaxy(center),
    anchor = setBodyName(
      hasBlackHole
        ? addBody('blackhole', center, new THREE.Vector3(), {
            mass: style === 'elliptical' ? 11200 : style === 'lenticular' ? 8200 : 9600,
            birthMass: 600,
            variant: style === 'spiral' ? 3 : style === 'lenticular' ? 1 : 2,
            collisionCooldown: 4,
            lastEvent: 'A central supermassive black hole inside a distributed dark-matter halo',
          })
        : addBody('star', center, new THREE.Vector3(), {
            mass: coreMass,
            stage: stellarBirthStage(coreMass),
            holdStage: true,
            collisionCooldown: 4,
            lastEvent:
              style === 'globular'
                ? 'A dense stellar core with no required central black hole'
                : 'A nuclear star cluster; this smaller galaxy has no central black hole in the exhibit model',
          }),
      hasBlackHole ? 'Central Black Hole' : style === 'globular' ? 'Globular Core' : 'Nuclear Star Cluster',
    );
  members.push(anchor);
  // Near another galaxy, the pair is set on a bound, off-centre, prograde approach (0.6 × the circular speed):
  // they pass once, throw out tidal tails, fall back together and merge.
  const bulk = new THREE.Vector3();
  if (neighbour) {
    const otherMass = neighbour.anchor.mass + (neighbour.group.haloMass ?? 0),
      ownMass = anchor.mass + halo.mass,
      offset = center.clone().sub(neighbour.anchor.mesh.position),
      approach = 0.6 * Math.sqrt((G * app.gravity * (ownMass + otherMass)) / neighbour.distance),
      relative = galaxySpinTangent(offset.x, offset.z).multiplyScalar(approach),
      ownShare = otherMass / (ownMass + otherMass),
      otherKick = relative.clone().multiplyScalar(-(1 - ownShare));
    bulk.copy(neighbour.anchor.velocity).addScaledVector(relative, ownShare);
    for (const id of neighbour.group.bodyIds) bodies.find(body => body.id === id)?.velocity.add(otherKick);
    // Stars of an already-disturbed neighbour move individually and need the same kick.
    for (const visual of galaxyVisuals.values()) {
      if (visual.groupId !== neighbour.group.id || !visual.live) continue;
      for (let i = 0; i < visual.live.n; i++) {
        visual.live.vx[i] += otherKick.x;
        visual.live.vz[i] += otherKick.z;
      }
    }
    anchor.velocity.copy(bulk);
  }
  for (let i = 0; i < count; i++) {
    const fraction = (i + 1) / (count + 1),
      radius =
        style === 'globular' ? 12 + fraction * 70 : style === 'irregular' ? 26 + fraction * 112 : 40 + fraction * 135,
      angle = i * 2.399 + (style === 'irregular' ? seeded(i, 22) * 1.1 : 0),
      direction = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)),
      tangent = galaxySpinTangent(direction.x, direction.z),
      mass = galaxyMemberMass(style, i),
      stage = stellarBirthStage(mass),
      speed = memberOrbitSpeed(anchor, halo, radius, TYPES.star.radius),
      star = setBodyName(
        addBody(
          'star',
          center.clone().addScaledVector(direction, radius),
          tangent.multiplyScalar(speed * (style === 'irregular' ? 0.86 + seeded(i, 33) * 0.2 : 1)).add(bulk),
          {
            mass,
            stage,
            holdStage: true,
            collisionCooldown: 4,
            lastEvent: `Orbiting within the ${galaxyName(style).toLowerCase()}'s combined stellar and dark-matter potential`,
          },
        ),
        `${stage.replace(' star', '').replace(' dwarf', '')} member ${i + 1}`,
      );
    members.push(star);
  }
  const cloudCount = style === 'spiral' ? 3 : style === 'irregular' ? 3 : style === 'lenticular' ? 1 : 0;
  for (let i = 0; i < cloudCount; i++) {
    const radius = 70 + i * 42,
      angle = 0.9 + i * 2.1,
      direction = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)),
      cloudRadius = TYPES.nebula.radius,
      cloud = setBodyName(
        addBody(
          'nebula',
          center.clone().addScaledVector(direction, radius),
          galaxySpinTangent(direction.x, direction.z)
            .multiplyScalar(memberOrbitSpeed(anchor, halo, radius, cloudRadius, true))
            .add(bulk),
          {
            mass: 260,
            collisionCooldown: 4,
            lastEvent: 'Star-forming gas moving through the galactic disk rather than orbiting as a rigid satellite',
          },
        ),
        `Star-forming Region ${i + 1}`,
      );
    members.push(cloud);
  }
  const sequence = cosmicGroups.filter(group => group.kind === 'galaxy' && group.style === style).length + 1,
    group = registerCosmicGroup('galaxy', members, `${galaxyName(style)} ${sequence}`, style, anchor.id, halo.mass);
  group.haloScale = halo.scale;
  group.extent = extent;
  // Members are tracers of the galaxy potential: they orbit the anchor and halo without tugging, feeding or
  // stripping one another (see sameExhibitSystem). Outside objects still interact with every member.
  for (const member of members) {
    member.exhibitSystemId = group.id;
    member.exhibitAnchor = member === anchor;
  }
  group.visualSeed = 1 + Math.floor(Math.random() * 99991);
  createGalaxyBackdrop(group, anchor, style);
  museumEvent(
    `${galaxyName(style)} assembled`,
    hasBlackHole
      ? `${group.name} combines a central black hole, a dark-matter halo, ${count} interactive stars and tens of thousands of tracer stars that respond to nearby galaxies.${neighbour ? ` It is falling toward ${neighbour.group.name} on an off-centre path: expect a close pass, tidal tails, then a merger.` : ''}`
      : `${group.name} deliberately has no central black hole; a distributed halo and dense stellar core hold this simplified exhibit model together.${neighbour ? ` It is falling toward ${neighbour.group.name}.` : ''}`,
    '#b39cff',
    anchor,
  );
  return anchor;
}

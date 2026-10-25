// Galaxy builder (spiral, elliptical, lenticular, irregular, globular).
import * as THREE from 'three';
import { stellarBirthStage } from '../simulation-model.ts';
import { softenedDistanceSq } from '../gravity-engine.ts';
import { G, TYPES } from '../celestial-catalog.ts';
import { createGalaxyBackdrop, galaxyName, registerCosmicGroup, setBodyName } from '../bodies/groups.ts';
import { addBody } from '../bodies/registry.ts';
import { findOpenPlacement } from './placement.ts';
import { seeded } from '../physics/body-math.ts';
import { enclosedHaloMass } from '../physics/galaxy-dynamics.ts';
import { isCompact } from '../scene/setup.ts';
import { app, cosmicGroups } from '../state/app-state.ts';
import type { Body, GalaxyStyle } from '../state/types.ts';
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
/**
 * Circular speed at `radius` under the forces a galaxy member actually feels: its anchor plus the halo. Member
 * nebulae orbit with the disk too (see simulate.ts), but their extended softening slightly weakens the anchor's pull.
 */
function memberOrbitSpeed(anchor: Body, haloMass: number, radius: number, memberRadius: number, nebula = false) {
  const g = G * app.gravity,
    softening = nebula ? memberRadius * memberRadius * 1.8 : 0,
    anchorPull = (g * anchor.mass) / softenedDistanceSq(radius * radius, softening, 0, memberRadius, anchor.radius),
    haloPull = (g * enclosedHaloMass(haloMass, radius)) / (radius * radius);
  return Math.sqrt(Math.max(0, (anchorPull + haloPull) * radius));
}
export function createGalaxy(origin: THREE.Vector3, style: GalaxyStyle = 'spiral') {
  const members: Body[] = [],
    count = isCompact ? 7 : 11,
    center = findOpenPlacement(origin, 158),
    hasBlackHole = !['irregular', 'globular'].includes(style),
    haloMass = style === 'globular' ? 4200 : style === 'irregular' ? 7600 : 5800,
    coreMass = style === 'globular' ? 160 : 230,
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
  for (let i = 0; i < count; i++) {
    const fraction = (i + 1) / (count + 1),
      radius =
        style === 'globular' ? 12 + fraction * 58 : style === 'irregular' ? 24 + fraction * 92 : 34 + fraction * 102,
      angle = i * 2.399 + (style === 'irregular' ? seeded(i, 22) * 1.1 : 0),
      direction = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)),
      tangent = new THREE.Vector3(-direction.z, 0, direction.x),
      mass = galaxyMemberMass(style, i),
      stage = stellarBirthStage(mass),
      speed = memberOrbitSpeed(anchor, haloMass, radius, TYPES.star.radius),
      star = setBodyName(
        addBody(
          'star',
          center.clone().addScaledVector(direction, radius),
          tangent.multiplyScalar(speed * (style === 'irregular' ? 0.86 + seeded(i, 33) * 0.2 : 1)),
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
  const cloudCount = style === 'spiral' ? 2 : style === 'irregular' ? 2 : style === 'lenticular' ? 1 : 0;
  for (let i = 0; i < cloudCount; i++) {
    const radius = 58 + i * 39,
      angle = 0.9 + i * 2.8,
      direction = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)),
      cloudRadius = TYPES.nebula.radius,
      cloud = setBodyName(
        addBody(
          'nebula',
          center.clone().addScaledVector(direction, radius),
          new THREE.Vector3(-direction.z, 0, direction.x).multiplyScalar(
            memberOrbitSpeed(anchor, haloMass, radius, cloudRadius, true),
          ),
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
    group = registerCosmicGroup('galaxy', members, `${galaxyName(style)} ${sequence}`, style, anchor.id, haloMass);
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
      ? `${group.name} combines a central black hole, a distributed dark-matter halo, ${count} interactive stars, and thousands of GPU-rendered background stars.`
      : `${group.name} deliberately has no central black hole; a distributed halo and dense stellar core hold this simplified exhibit model together.`,
    '#b39cff',
    anchor,
  );
  return anchor;
}

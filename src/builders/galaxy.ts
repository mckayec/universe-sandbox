// Galaxy builder (spiral, elliptical, lenticular, irregular, globular).
import * as THREE from 'three';
import { G } from '../celestial-catalog.ts';
import { createGalaxyBackdrop, galaxyName, registerCosmicGroup, setBodyName } from '../bodies/groups.ts';
import { addBody } from '../bodies/registry.ts';
import { findOpenPlacement } from './placement.ts';
import { seeded } from '../physics/body-math.ts';
import { isCompact } from '../scene/setup.ts';
import { cosmicGroups } from '../state/app-state.ts';
import type { Body, GalaxyStyle, Stage } from '../state/types.ts';
import { museumEvent } from '../ui/feed.ts';

export function createGalaxy(origin: THREE.Vector3, style: GalaxyStyle = 'spiral') {
  const members: Body[] = [],
    count = isCompact ? 7 : 11,
    center = findOpenPlacement(origin, 158),
    hasBlackHole = !['irregular', 'globular'].includes(style),
    haloMass = style === 'globular' ? 4200 : style === 'irregular' ? 7600 : 5800,
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
            mass: style === 'globular' ? 190 : 230,
            stage: style === 'globular' ? 'red dwarf' : 'yellow star',
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
      enclosedHalo = haloMass * Math.pow(radius / (radius + 52), 1.45),
      orbitalSpeed = Math.sqrt((G * ((hasBlackHole ? anchor.mass : anchor.mass * 0.45) + enclosedHalo)) / radius),
      stage: Stage =
        style === 'globular' || style === 'elliptical'
          ? i % 4 === 0
            ? 'yellow star'
            : 'red dwarf'
          : (['red dwarf', 'yellow star', 'white star', 'blue star'] as Stage[])[i % 4],
      star = setBodyName(
        addBody(
          'star',
          center.clone().addScaledVector(direction, radius),
          tangent.multiplyScalar(orbitalSpeed * (style === 'irregular' ? 0.72 + seeded(i, 33) * 0.42 : 1)),
          {
            mass: [105, 145, 185, 225][i % 4],
            stage,
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
      enclosedHalo = haloMass * Math.pow(radius / (radius + 52), 1.45),
      cloud = setBodyName(
        addBody(
          'nebula',
          center.clone().addScaledVector(direction, radius),
          new THREE.Vector3(-direction.z, 0, direction.x).multiplyScalar(
            Math.sqrt((G * ((hasBlackHole ? anchor.mass : 0) + enclosedHalo)) / radius) * 0.52,
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

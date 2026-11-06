// What happens to a galaxy when its core is swallowed: by another galaxy's core (a galactic merger) or by a
// loose black hole that becomes the new core. Stars, halo and pictures carry over; nothing blinks out.
import { app, bodies, bodyGroupIds, cosmicGroups, galaxyVisuals } from '../state/app-state.ts';
import type { Body, CosmicGroup } from '../state/types.ts';
import { galaxyGroupFor } from '../physics/galaxy-dynamics.ts';
import { passesThrough } from '../galaxy-encounter-model.ts';
import { museumEvent } from '../ui/feed.ts';
import { refreshGroupNavigator } from './groups.ts';

function galaxyAnchoredBy(body: Body) {
  return cosmicGroups.find(group => group.kind === 'galaxy' && group.anchorId === body.id);
}
function moveMember(body: Body, from: CosmicGroup | undefined, to: CosmicGroup) {
  if (from && from !== to) from.bodyIds = from.bodyIds.filter(id => id !== body.id);
  if (!to.bodyIds.includes(body.id)) to.bodyIds.push(body.id);
  bodyGroupIds.set(body.id, to.id);
  body.exhibitSystemId = to.id;
}
/** Galactic merger: everything of `gone` (except its swallowed core) joins `keep`, whose core is `core`. */
export function mergeGalaxies(keep: CosmicGroup, gone: CosmicGroup, core: Body, swallowed: Body) {
  for (const id of gone.bodyIds) {
    if (id === swallowed.id) continue;
    const body = bodies.find(candidate => candidate.id === id);
    if (!body) continue;
    moveMember(body, undefined, keep);
    body.exhibitAnchor = false;
  }
  gone.bodyIds = [swallowed.id];
  keep.haloMass = (keep.haloMass ?? 0) + (gone.haloMass ?? 0);
  // A merger remnant is bigger and puffier than either parent.
  keep.haloScale = Math.max(keep.haloScale ?? 52, gone.haloScale ?? 52) * 1.15;
  keep.extent = Math.max(keep.extent ?? 180, gone.extent ?? 180) * 1.15;
  for (const visual of galaxyVisuals.values())
    if (visual.groupId === gone.id || visual.groupId === keep.id) {
      visual.groupId = keep.id;
      visual.anchorId = core.id;
    }
  cosmicGroups.splice(cosmicGroups.indexOf(gone), 1);
  if (app.selectedGroupId === gone.id) app.selectedGroupId = keep.id;
  const keepName = keep.name.replace(/ merger remnant$/, ''),
    goneName = gone.name;
  keep.name = `${keepName} merger remnant`;
  core.lastEvent = `Merged with the core of ${goneName}`;
  museumEvent(
    'Galaxies merge',
    `The model has combined the cores of ${keepName} and ${goneName}. Their stars continue in the combined gravitational field. The final black-hole binary stages and the long astronomical timescale are not simulated.`,
    '#c9a6ff',
    core,
  );
  if (!app.historySuspended) refreshGroupNavigator();
}
/**
 * Call before `food` is removed when `eater` swallows it. If `food` was a galaxy's core, the galaxy keeps its
 * stars: either the two galaxies merge, or `eater` becomes the galaxy's new core.
 */
export function transferGalaxyCore(eater: Body, food: Body) {
  const foodGalaxy = galaxyAnchoredBy(food);
  if (!foodGalaxy) return;
  const eaterGalaxy = galaxyAnchoredBy(eater);
  if (eaterGalaxy && eaterGalaxy !== foodGalaxy) {
    mergeGalaxies(eaterGalaxy, foodGalaxy, eater, food);
    return;
  }
  const previousId = bodyGroupIds.get(eater.id),
    previous = previousId === undefined ? undefined : cosmicGroups.find(group => group.id === previousId);
  moveMember(eater, previous, foodGalaxy);
  foodGalaxy.anchorId = eater.id;
  eater.exhibitAnchor = true;
  for (const visual of galaxyVisuals.values()) if (visual.groupId === foodGalaxy.id) visual.anchorId = eater.id;
  museumEvent(
    'A new galactic core',
    `${eater.name} replaces the core of ${foodGalaxy.name} in this simplified model. Stars continue to respond to the combined core and halo field.`,
    '#c9a6ff',
    eater,
  );
}
/**
 * Collisionless approximation: when galaxies collide, physical star–star collisions are rare because the gaps
 * between stars are enormous, so this model suppresses contact between bodies of different galaxies (it does not
 * claim collisions are impossible, and real galactic gas does collide and shock). A core only captures a star
 * nearly at rest relative to it, and two model cores only coalesce once the drag rule has slowed them below a
 * speed cutoff (a fast pass flies through). That coalescence is illustrative, not black-hole binary evolution.
 */
export function passesThroughInGalaxyCollision(a: Body, b: Body) {
  const ga = galaxyGroupFor(a),
    gb = galaxyGroupFor(b);
  if (!ga || !gb) return false;
  const coreA = ga.anchorId === a.id,
    coreB = gb.anchorId === b.id,
    relative = a.velocity.distanceTo(b.velocity);
  return passesThrough(ga === gb, coreA, coreB, relative);
}

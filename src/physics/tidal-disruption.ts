// Roche-limit tidal disruption into debris streams, with cinematic slow motion.
import * as THREE from 'three';
import { tidalStressRatio, advanceTidalStrain } from '../physics-continuity.ts';
import { G, TYPES, type Kind } from '../celestial-catalog.ts';
import { refreshGroupNavigator, setBodyName } from '../bodies/groups.ts';
import { removeBody, transform } from '../bodies/lifecycle.ts';
import { addBody } from '../bodies/registry.ts';
import { seeded } from './body-math.ts';
import { sameExhibitSystem } from './tidal.ts';
import { isCompact } from '../scene/setup.ts';
import { app, bodies, bodyGroupIds, cosmicGroups } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { setSimulationSpeed } from '../ui/controls.ts';
import { museumEvent, select, toast } from '../ui/feed.ts';
import { impactEffect, particleBurst } from '../visuals/effects.ts';

// ── Tidal disruption: Roche-limit breakup into debris streams ──────────────
export const TIDAL_DISRUPTION_THRESHOLD = 3,
  DISRUPTABLE_KINDS: Kind[] = ['moon', 'dwarf', 'rocky', 'gas', 'comet'];
// Strain, warning and debris state live on each Body (tidalStrain, tidalWarned, debris), so they are cleared with the
// body, survive undo/save/load and can never leak onto a later body that reuses the same id.

function cinematicSlowMotion() {
  if (app.currentExhibit !== 'tidal-lab' && app.currentExhibit !== 'gododdin') return;
  if (app.slowMotionTimer <= 0) {
    if (app.speed < 0.2) return;
    app.slowMotionRestore = app.speed;
  }
  app.slowMotionTimer = 3.2;
  setSimulationSpeed(0.1);
  toast('Slow motion');
}
export function updateSlowMotion(realDt: number) {
  if (app.slowMotionTimer <= 0) return;
  app.slowMotionTimer -= realDt;
  if (app.slowMotionTimer <= 0 && app.speed === 0.1) setSimulationSpeed(app.slowMotionRestore);
}
function strongestTidalPerturber(donor: Body) {
  let worst = 0,
    perturber: Body | undefined;
  for (const primary of bodies) {
    if (
      primary === donor ||
      primary.kind === 'nebula' ||
      primary.kind === 'protostar' ||
      primary.hostId !== undefined ||
      sameExhibitSystem(primary, donor)
    )
      continue;
    const boost = primary.warpBoost ?? 1;
    if (primary.mass * boost < donor.mass * 4) continue;
    const ratio = tidalStressRatio(
      primary.mass,
      donor.mass,
      donor.radius,
      primary.mesh.position.distanceTo(donor.mesh.position),
      boost,
    );
    if (ratio > worst) {
      worst = ratio;
      perturber = primary;
    }
  }
  return { ratio: worst, perturber };
}
export function updateTidalDisruption(dt: number) {
  const doomed: Array<[Body, Body]> = [];
  for (const donor of bodies) {
    if (
      !DISRUPTABLE_KINDS.includes(donor.kind) ||
      donor.hostId !== undefined ||
      donor.infall ||
      donor === app.dragBody ||
      donor.buildLocked
    ) {
      donor.tidalStrain = undefined;
      continue;
    }
    const { ratio, perturber } = strongestTidalPerturber(donor),
      previous = donor.tidalStrain ?? 0,
      strain = advanceTidalStrain(previous, ratio, TIDAL_DISRUPTION_THRESHOLD, dt);
    if (strain <= 0) {
      if (previous > 0) {
        donor.tidalStrain = undefined;
        donor.tidalWarned = undefined;
      }
      continue;
    }
    donor.tidalStrain = strain;
    if (perturber && ratio > TIDAL_DISRUPTION_THRESHOLD) {
      const toward = perturber.mesh.position.clone().sub(donor.mesh.position);
      donor.tidalStretch = Math.max(donor.tidalStretch, Math.min(0.88, strain * 0.95));
      donor.tidalAngle = Math.atan2(toward.z, toward.x);
      donor.tidalPartnerId = perturber.id;
      if (strain > 0.3 && !donor.tidalWarned) {
        donor.tidalWarned = true;
        donor.lastEvent = `Being stretched inside ${perturber.name}'s Roche limit`;
        cinematicSlowMotion();
        museumEvent(
          'Roche limit crossed',
          `${perturber.name}${perturber.warpBoost ? "'s warp wake" : ''} is pulling harder on ${donor.name}'s near side than ${donor.name}'s own gravity can hold together.`,
          '#ffcf7a',
          donor,
        );
      }
    }
    if (strain >= 1 && perturber) doomed.push([donor, perturber]);
  }
  for (const [donor, perturber] of doomed) disruptBody(donor, perturber);
}
function disruptBody(donor: Body, primary: Body) {
  if (!bodies.includes(donor) || !bodies.includes(primary)) return;
  donor.tidalStrain = undefined;
  donor.tidalWarned = undefined;
  const point = donor.mesh.position.clone(),
    velocity = donor.velocity.clone(),
    axis = primary.mesh.position.clone().sub(point).setY(0);
  if (axis.lengthSq() < 1e-4) axis.set(1, 0, 0);
  axis.normalize();
  const tangent = new THREE.Vector3(-axis.z, 0, axis.x),
    gas = donor.kind === 'gas',
    name = donor.name,
    radius = donor.radius,
    total = donor.mass,
    wasSelected = app.selectedBody === donor,
    groupId = bodyGroupIds.get(donor.id),
    group = groupId === undefined ? undefined : cosmicGroups.find(candidate => candidate.id === groupId);
  const room = Math.max(3, (isCompact ? 72 : 100) - bodies.length),
    pieces = Math.min(isCompact ? 9 : 16, room),
    debrisMass = gas ? Math.min(total * 0.25, pieces * 0.55) : total,
    pieceMass = Math.max(0.04, debrisMass / pieces),
    spread = THREE.MathUtils.clamp(Math.sqrt((G * app.gravity * total) / Math.max(0.2, radius)) * 0.6, 0.55, 3.6),
    created: Body[] = [];
  let core: Body | undefined;
  if (gas) {
    donor.mass = Math.max(1.2, total * 0.14);
    transform(donor, 'rocky', donor.mass);
    setBodyName(donor, `${name} core`);
    donor.lastEvent = `The exposed core left after ${primary.name}'s tides stripped its envelope`;
    donor.collisionCooldown = 2;
    core = donor;
  } else removeBody(donor);
  for (let i = 0; i < pieces; i++) {
    const s = pieces === 1 ? 0 : (i / (pieces - 1)) * 2 - 1,
      jitter = seeded(i + total * 13, 71) - 0.5,
      offset = axis
        .clone()
        .multiplyScalar(s * radius * (gas ? 2.6 : 2.4))
        .addScaledVector(tangent, jitter * radius * 0.8);
    if (core && Math.abs(s) < 0.18) offset.addScaledVector(axis, Math.sign(s || 1) * radius * 0.9);
    const pieceVelocity = velocity
      .clone()
      .addScaledVector(axis, s * spread)
      .addScaledVector(tangent, jitter * spread * 0.6);
    const piece = setBodyName(
      addBody(gas ? 'comet' : 'asteroid', point.clone().add(offset), pieceVelocity, {
        mass: pieceMass,
        birthMass: gas ? TYPES.comet.mass : TYPES.asteroid.mass,
        collisionCooldown: 2.4 + seeded(i, 7),
        habitabilityShock: 1,
        lastEvent: `Torn from ${name} by ${primary.name}'s tides`,
        debris: true,
      }),
      `${name} debris ${i + 1}`,
    );
    piece.velocity.y = 0;
    created.push(piece);
    if (group) {
      group.bodyIds.push(piece.id);
      bodyGroupIds.set(piece.id, group.id);
    }
  }
  particleBurst(point, gas ? TYPES.gas.color : 0xffa36a, isCompact ? 80 : 180, 4.2, 3.4);
  impactEffect(point, gas ? 0x9fdcff : 0xffd2a0, 1.35);
  app.flashEnergy = Math.max(app.flashEnergy, 0.55);
  museumEvent(
    'Tidal disruption',
    `${primary.name}${primary.warpBoost ? "'s warp wake" : ''} tore ${name} apart inside its Roche limit. ${gas ? 'Its envelope scattered as icy debris, leaving a bare rocky core.' : `${pieces} fragments will shear into a debris stream.`}`,
    '#ffb36b',
    core ?? created[0],
  );
  if (wasSelected || app.selectedBody === null) select(core ?? created[0]);
  refreshGroupNavigator();
}

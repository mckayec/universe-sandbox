// Guided exhibits and universe packs.
import * as THREE from 'three';
import { exhibitById, type ExhibitId } from '../exhibits.ts';
import { universePackById, type UniversePackId } from '../universe-packs.ts';
import { saveRecoverySnapshot } from '../sandbox-state.ts';
import { orbitalSpeed } from '../physics-continuity.ts';
import { G } from '../celestial-catalog.ts';
import { registerCosmicGroup, setBodyName } from '../bodies/groups.ts';
import { addBody } from '../bodies/registry.ts';
import { createGalaxy } from '../builders/galaxy.ts';
import { createBinarySystem, createSolarSystem } from '../builders/systems.ts';
import { createGododdin, createTidalLab } from '../builders/tidal-scenarios.ts';
import { fitAllObjects } from '../scene/camera.ts';
import { app, bodies } from '../state/app-state.ts';
import { resetSimulation, snapshotUniverse } from '../state/history.ts';
import type { Body } from '../state/types.ts';
import { updateScienceModeButton } from './controls.ts';
import { museumEvent, select, toast } from './feed.ts';

export function showGuide(id: ExhibitId) {
  const exhibit = exhibitById(id),
    card = document.querySelector<HTMLElement>('#guide-card')!;
  document.querySelector('#guide-eyebrow')!.textContent = exhibit.eyebrow;
  document.querySelector('#guide-title')!.textContent = exhibit.title;
  document.querySelector('#guide-objective')!.textContent = exhibit.objective;
  card.style.setProperty('--guide-accent', exhibit.accent);
  card.hidden = false;
}
export function loadExhibit(id: ExhibitId, asAttract = false) {
  resetSimulation();
  app.currentExhibit = id;
  const exhibit = exhibitById(id);
  let focus: Body | null = null;
  if (id === 'build-star') {
    const cloud = addBody('nebula', new THREE.Vector3(), new THREE.Vector3(), {
        mass: 520,
        birthMass: 260,
        locked: true,
        lastEvent: 'A dense stellar nursery prepared for guided exploration',
      }),
      seedA = addBody('protostar', new THREE.Vector3(2.2, 0, 0), new THREE.Vector3(), {
        mass: 46,
        hostId: cloud.id,
        protoAngle: 0,
        protoOrbit: 2.2,
        protoDrift: 0.07,
        lastEvent: `Condensed inside ${cloud.name}`,
      }),
      seedB = addBody('protostar', new THREE.Vector3(-3.4, 0, 1.2), new THREE.Vector3(), {
        mass: 38,
        hostId: cloud.id,
        protoAngle: 2.8,
        protoOrbit: 3.6,
        protoDrift: -0.05,
        lastEvent: `Competing for gas inside ${cloud.name}`,
      });
    registerCosmicGroup('system', [cloud, seedA, seedB]);
    focus = seedA;
  } else if (id === 'habitable-world') {
    const star = addBody('star', new THREE.Vector3(), new THREE.Vector3(), {
        mass: 210,
        stage: 'yellow star',
        locked: true,
        holdStage: true,
        lastEvent: 'A calm Sun-like star anchors this guided system',
      }),
      radius = 12,
      planet = addBody(
        'rocky',
        new THREE.Vector3(radius, 0, 0),
        new THREE.Vector3(0, 0, -orbitalSpeed(G, app.gravity, star.mass, radius)),
        { variant: 3, mass: 10, lastEvent: 'Placed in the temperate zone with a stable atmosphere' },
      ),
      // The moon rides a kinematic orbit (like Earth's Moon in Our Solar System), so it can't destabilize the planet.
      moon = addBody('moon', new THREE.Vector3(radius + 2.4, 0, 0), planet.velocity.clone(), {
        variant: 3,
        mass: 0.76,
        satelliteHostId: planet.id,
        satelliteOrbit: 2.4,
        satelliteAngle: 0,
        satelliteRate: 1.1,
        lastEvent: `Orbiting ${planet.name}`,
      }),
      giantRadius = 46,
      giant = addBody(
        'gas',
        new THREE.Vector3(-giantRadius, 0, 0),
        new THREE.Vector3(0, 0, orbitalSpeed(G, app.gravity, star.mass, giantRadius)),
        { variant: 1, mass: 34, lastEvent: 'A distant gas giant well outside the temperate zone' },
      );
    const group = registerCosmicGroup('system', [star, planet, moon, giant]);
    // Members orbit the star without perturbing one another; impacts and visitors still interact fully.
    for (const member of [star, planet, moon, giant]) member.exhibitSystemId = group.id;
    star.exhibitAnchor = true;
    focus = planet;
  } else if (id === 'binary-stars') {
    focus = createBinarySystem(new THREE.Vector3());
    app.scienceMode = 'full';
    updateScienceModeButton();
  } else if (id === 'feed-black-hole') {
    const core = addBody('blackhole', new THREE.Vector3(), new THREE.Vector3(), {
        mass: 650,
        buildLocked: true,
        locked: true,
        lastEvent: 'Build lock holds the event horizon in place while it feeds',
      }),
      giant = addBody('gas', new THREE.Vector3(14, 0, 3), new THREE.Vector3(-1.28, 0, 5.95), {
        mass: 52,
        variant: 4,
        lastEvent: 'Skimming the tidal zone; atmosphere will stream toward the black hole',
      }),
      star = addBody('star', new THREE.Vector3(-18, 0, -2), new THREE.Vector3(0.68, 0, -6.08), {
        mass: 185,
        stage: 'yellow star',
        lastEvent: 'Orbiting inside the tidal-transfer zone',
      }),
      planet = addBody('rocky', new THREE.Vector3(7, 0, -24), new THREE.Vector3(4.9, 0, 1.42), {
        variant: 5,
        mass: 14,
      });
    registerCosmicGroup('system', [core, giant, star, planet]);
    focus = core;
  } else if (id === 'slow-feast') {
    focus = createSlowFeast();
  } else if (id === 'supernova-observatory') {
    const star = setBodyName(
        addBody('star', new THREE.Vector3(), new THREE.Vector3(), {
          mass: 460,
          birthMass: 210,
          stage: 'hypergiant',
          stageAge: 27.2,
          locked: true,
          lastEvent: 'Core collapse is imminent; observe at 1× speed',
        }),
        'Eris Hypergiant',
      ),
      planet = setBodyName(
        addBody('gas', new THREE.Vector3(40, 0, 0), new THREE.Vector3(0, 0, 3.48), {
          mass: 36,
          variant: 7,
          collisionCooldown: 5,
          lastEvent: 'Observing from beyond the Roche-transfer zone',
        }),
        'Aurelia',
      ),
      cloud = setBodyName(
        addBody('nebula', new THREE.Vector3(-42, 0, -26), new THREE.Vector3(0.08, 0, -0.04), {
          mass: 170,
          birthMass: 260,
          collisionCooldown: 5,
          lastEvent: 'Nearby gas will be illuminated by the supernova flash',
        }),
        'Veil Cloud',
      );
    registerCosmicGroup('system', [star, planet, cloud], 'Supernova Observatory');
    focus = star;
  } else if (id === 'tidal-lab') {
    focus = createTidalLab();
  } else if (id === 'gododdin') {
    focus = createGododdin();
  } else if (id === 'galaxy-collision') {
    // The second galaxy is set on a bound, off-centre, prograde course toward the first (see createGalaxy).
    focus = createGalaxy(new THREE.Vector3(-210, 0, 0));
    createGalaxy(new THREE.Vector3(210, 0, 0));
    fitAllObjects();
  } else if (id === 'galaxy-tour') {
    focus = createGalaxy(new THREE.Vector3(-90, 0, 0));
    createSolarSystem(new THREE.Vector3(125, 0, 45));
    fitAllObjects();
  } else {
    const left = addBody('rocky', new THREE.Vector3(-10, 0, 0), new THREE.Vector3(6.8, 0, 0), {
        variant: 1,
        mass: 12,
        collisionCooldown: 0.3,
        lastEvent: 'Launched toward a destructive collision',
      }),
      right = addBody('rocky', new THREE.Vector3(10, 0, 0), new THREE.Vector3(-6.8, 0, 0), {
        variant: 4,
        mass: 12,
        collisionCooldown: 0.3,
        lastEvent: 'Launched toward a destructive collision',
      });
    registerCosmicGroup('system', [left, right]);
    focus = left;
  }
  if (focus) select(focus);
  document.querySelector<HTMLElement>('#scenario-picker')!.hidden = true;
  if (asAttract) document.querySelector<HTMLElement>('#guide-card')!.hidden = true;
  else showGuide(id);
  museumEvent('Guided exhibit', `${exhibit.title}: ${exhibit.objective}`, exhibit.accent, focus ?? undefined);
}
/**
 * A Slow Feast: the cloud drifts in first and is drained through the disk; the star starts near the far end of a
 * very eccentric orbit (periapsis ≈ 2, inside the capture radius), so it arrives about 70 s later and is fed in
 * gradually (see physics/infall.ts).
 */
function createSlowFeast() {
  const core = setBodyName(
      addBody('blackhole', new THREE.Vector3(), new THREE.Vector3(), {
        mass: 900,
        variant: 2,
        locked: true,
        lastEvent: 'Quiet: only a faint disk until something falls in',
      }),
      'Quiet Black Hole',
    ),
    cloud = setBodyName(
      addBody('nebula', new THREE.Vector3(27, 0, -11), new THREE.Vector3(-0.92, 0, 0.42), {
        mass: 220,
        birthMass: 260,
        lastEvent: 'Drifting toward the black hole',
      }),
      'Drifting Cloud',
    ),
    gm = G * app.gravity * core.mass,
    periapsis = 2,
    apoapsis = 150,
    semiMajor = (periapsis + apoapsis) / 2,
    apoapsisSpeed =
      Math.sqrt(gm * semiMajor * (1 - Math.pow((apoapsis - periapsis) / (apoapsis + periapsis), 2))) / apoapsis,
    angle = 2.55,
    star = setBodyName(
      addBody(
        'star',
        new THREE.Vector3(Math.cos(angle) * apoapsis, 0, Math.sin(angle) * apoapsis),
        new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).multiplyScalar(apoapsisSpeed),
        {
          mass: 210,
          stage: 'yellow star',
          holdStage: true,
          lastEvent: 'Falling inward on a plunging orbit',
        },
      ),
      'Sun-like Star',
    );
  registerCosmicGroup('system', [core, cloud, star], 'Slow Feast');
  fitAllObjects();
  return core;
}
export function exitGuide() {
  app.currentExhibit = null;
  document.querySelector<HTMLElement>('#guide-card')!.hidden = true;
}
export function openUniversePack(id: UniversePackId) {
  const pack = universePackById(id),
    details = document.querySelector<HTMLElement>('#pack-details')!;
  if (pack.status === 'atlas' && pack.atlasPath) {
    if (bodies.length) saveRecoverySnapshot(snapshotUniverse());
    location.assign(pack.atlasPath);
    return;
  }
  if (pack.status === 'ready') {
    document.querySelector<HTMLElement>('#universe-picker')!.hidden = true;
    document.querySelector<HTMLElement>('#scenario-picker')!.hidden = false;
    details.hidden = true;
    toast(`${pack.title} opened`);
    return;
  }
  document.querySelector('#pack-name')!.textContent = pack.title;
  document.querySelector('#pack-status')!.textContent = 'SOURCE PACK NEEDED';
  document.querySelector('#pack-source')!.textContent = pack.sourceHint;
  details.style.borderColor = `${pack.accent}66`;
  details.hidden = false;
  toast(`${pack.title} is ready for source-backed worldbuilding`);
}

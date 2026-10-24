// Selected-object panel, object menu, locks and orbit-nearest.
import * as THREE from 'three';
import { nextStellarStep, stellarTrackLabel } from '../simulation-model.ts';
import { orbitalSpeed } from '../physics-continuity.ts';
import {
  ASTEROID_TO_DWARF,
  DWARF_TO_ROCKY,
  GAS_TO_BROWN,
  G,
  ROCKY_TO_GAS,
  STAGES,
  TYPES,
} from '../celestial-catalog.ts';
import { groupForBody } from '../bodies/groups.ts';
import {
  brownIgnitionMass,
  formatMass,
  planetSubtype,
  protoIgnitionMass,
  stellarEvolutionRate,
} from '../physics/body-math.ts';
import { app, bodies } from '../state/app-state.ts';
import { recordHistory } from '../state/history.ts';
import type { Body } from '../state/types.ts';
import { select, toast } from './feed.ts';

export function updateInspector() {
  const b = app.selectedBody;
  if (!b) return;
  const t = TYPES[b.kind],
    stageData = b.kind === 'star' ? STAGES.find(s => s.stage === b.stage) : undefined,
    transition = b.stageTransition,
    transitionTarget = transition ? STAGES.find(s => s.stage === transition.to) : undefined,
    transitionProgress = transition ? THREE.MathUtils.clamp(transition.age / transition.duration, 0, 1) : 0,
    displayColor = transitionTarget?.css ?? stageData?.css ?? t.css;
  document
    .querySelector('#info-glyph')!
    .setAttribute('style', `background:${displayColor};box-shadow:0 0 18px ${displayColor}`);
  document.querySelector('#info-name')!.textContent = b.name;
  document.querySelector('#info-type')!.textContent =
    b.kind === 'star'
      ? transition
        ? `${transition.from} → ${transition.to}`
        : b.stage!
      : ['moon', 'dwarf', 'rocky', 'gas', 'blackhole', 'nebula'].includes(b.kind)
        ? planetSubtype(b)
        : t.label;
  document.querySelector('#info-mass')!.textContent = `${formatMass(b.mass)} M⊕`;
  document.querySelector('#info-velocity')!.textContent = `${b.velocity.length().toFixed(2)} u/s`;
  document.querySelector('#info-age')!.textContent = `${b.age.toFixed(1)} s`;
  const structure = groupForBody(b),
    nearest = nearestOrbitTarget(b);
  document.querySelector('#info-group')!.textContent = structure?.name ?? 'Independent';
  document.querySelector('#info-orbit')!.textContent = nearest
    ? `${nearest.name} · ${b.mesh.position.distanceTo(nearest.mesh.position).toFixed(1)}u`
    : 'None';
  const isRocky = b.kind === 'rocky',
    tempRow = document.querySelector<HTMLElement>('#temp-row')!;
  tempRow.style.display = b.kind === 'star' || isRocky ? 'flex' : 'none';
  if (stageData) {
    const temperature = transitionTarget
      ? THREE.MathUtils.lerp(stageData.temperature, transitionTarget.temperature, transitionProgress)
      : stageData.temperature;
    document.querySelector('#info-temp')!.textContent = `${Math.round(temperature).toLocaleString()} K`;
  } else if (isRocky)
    document.querySelector('#info-temp')!.textContent =
      b.surfaceTemperature > 0 ? `${Math.round(b.surfaceTemperature)} K` : 'Calculating';
  const atmosphereRow = document.querySelector<HTMLElement>('#atmosphere-row')!,
    waterRow = document.querySelector<HTMLElement>('#water-row')!,
    magnetRow = document.querySelector<HTMLElement>('#magnet-row')!,
    lifeRow = document.querySelector<HTMLElement>('#life-row')!,
    climateRow = document.querySelector<HTMLElement>('#climate-row')!;
  for (const row of [atmosphereRow, waterRow, magnetRow, lifeRow, climateRow])
    row.style.display = isRocky ? 'flex' : 'none';
  document.querySelector('#info-atmosphere')!.textContent =
    b.atmosphere > 0 ? `${b.atmosphere.toFixed(2)} bar` : 'Trace';
  document.querySelector('#info-water')!.textContent = `${Math.round(b.water * 100)}% coverage`;
  document.querySelector('#info-magnet')!.textContent = `${Math.round(b.magnetosphere * 100)}%`;
  document.querySelector('#info-life')!.textContent = b.lifeLevel === 'none' ? 'None detected' : b.lifeLevel;
  document.querySelector('#info-climate')!.textContent = b.habitatStatus;
  document.querySelector('#info-event')!.textContent = b.lastEvent;
  const life = document.querySelector<HTMLElement>('#lifecycle')!;
  life.style.display = ['star', 'protostar', 'asteroid', 'comet', 'moon', 'dwarf', 'rocky', 'gas', 'brown'].includes(
    b.kind,
  )
    ? 'block'
    : 'none';
  if (b.kind === 'star') {
    if (transition) {
      document.querySelector('#stage-label')!.textContent = 'Stellar transition';
      document.querySelector('#stage-time')!.textContent =
        `${Math.max(0, transition.duration - transition.age).toFixed(1)}s`;
      document.querySelector<HTMLElement>('#stage-progress')!.style.width = `${transitionProgress * 100}%`;
    } else {
      const d = stageData!,
        rate = stellarEvolutionRate(b),
        step = nextStellarStep(b.mass, b.stage!);
      document.querySelector('#stage-label')!.textContent = stellarTrackLabel(b.mass);
      document.querySelector('#stage-time')!.textContent =
        step.action === 'stable' ? 'STABLE' : `${Math.max(0, (d.duration - b.stageAge) / rate).toFixed(0)}s`;
      document.querySelector<HTMLElement>('#stage-progress')!.style.width =
        step.action === 'stable' ? '100%' : `${Math.min(100, (b.stageAge / d.duration) * 100)}%`;
    }
  } else if (['protostar', 'asteroid', 'comet', 'moon', 'dwarf', 'rocky', 'gas', 'brown'].includes(b.kind)) {
    const target =
      b.kind === 'protostar'
        ? protoIgnitionMass(b)
        : b.kind === 'asteroid' || b.kind === 'comet' || b.kind === 'moon'
          ? ASTEROID_TO_DWARF
          : b.kind === 'dwarf'
            ? DWARF_TO_ROCKY
            : b.kind === 'rocky'
              ? ROCKY_TO_GAS
              : b.kind === 'gas'
                ? GAS_TO_BROWN
                : brownIgnitionMass(b);
    document.querySelector('#stage-label')!.textContent =
      b.kind === 'protostar'
        ? 'Fusion mass'
        : b.kind === 'asteroid' || b.kind === 'comet' || b.kind === 'moon'
          ? 'Dwarf-planet mass'
          : b.kind === 'dwarf'
            ? 'Planetary mass'
            : b.kind === 'rocky'
              ? 'Gas-giant mass'
              : b.kind === 'gas'
                ? 'Brown-dwarf mass'
                : 'Red-dwarf fusion';
    document.querySelector('#stage-time')!.textContent = `${formatMass(b.mass)}/${target}`;
    document.querySelector<HTMLElement>('#stage-progress')!.style.width = `${Math.min(100, (b.mass / target) * 100)}%`;
  }
  const lock = document.querySelector<HTMLButtonElement>('#lock')!,
    buildLock = document.querySelector<HTMLButtonElement>('#build-lock')!,
    positionLocked = b.locked && !b.buildLocked;
  lock.textContent = positionLocked ? 'Unlock' : 'Position lock';
  lock.classList.toggle('active', positionLocked);
  buildLock.textContent = b.buildLocked ? 'Release build lock' : 'Build lock';
  buildLock.classList.toggle('active', b.buildLocked);
}

export function nearestOrbitTarget(b: Body) {
  return (
    bodies
      .filter(x => x !== b && x.kind !== 'nebula' && x.kind !== 'protostar')
      .sort(
        (a, c) =>
          a.mesh.position.distanceToSquared(b.mesh.position) - c.mesh.position.distanceToSquared(b.mesh.position),
      )[0] ?? null
  );
}
export function closeObjectMenu() {
  const menu = document.querySelector<HTMLElement>('#object-menu')!;
  menu.hidden = true;
  app.menuBody = null;
}
export function refreshObjectMenu() {
  const b = app.menuBody;
  if (!b) return;
  const type =
      b.kind === 'star'
        ? b.stage!
        : ['moon', 'dwarf', 'rocky', 'gas', 'blackhole', 'nebula'].includes(b.kind)
          ? planetSubtype(b)
          : TYPES[b.kind].label,
    target = nearestOrbitTarget(b),
    canOrbit = !!target && app.gravity > 0 && b.kind !== 'nebula' && b.kind !== 'protostar',
    lock = document.querySelector<HTMLButtonElement>('#menu-lock')!,
    buildLock = document.querySelector<HTMLButtonElement>('#menu-build-lock')!,
    positionLocked = b.locked && !b.buildLocked;
  document.querySelector('#menu-name')!.textContent = b.name;
  document.querySelector('#menu-type')!.textContent = type;
  document.querySelector('#menu-mass')!.textContent = `${formatMass(b.mass)} M⊕`;
  document.querySelector('#menu-diameter')!.textContent = `Ø ${(b.radius * 2).toFixed(1)}u`;
  lock.textContent = positionLocked ? 'Unlock' : 'Position lock';
  lock.classList.toggle('active', positionLocked);
  buildLock.textContent = b.buildLocked ? 'Release build lock' : 'Build lock';
  buildLock.classList.toggle('active', b.buildLocked);
  const orbit = document.querySelector<HTMLButtonElement>('#menu-orbit')!;
  orbit.textContent = target ? `Orbit ${target.name}` : 'No orbit target';
  orbit.disabled = !canOrbit;
  document
    .querySelectorAll<HTMLButtonElement>('[data-change]')
    .forEach(x => x.classList.toggle('active', x.dataset.change === b.kind));
}
export function openObjectMenu(b: Body, x: number, y: number) {
  select(b);
  app.menuBody = b;
  refreshObjectMenu();
  const menu = document.querySelector<HTMLElement>('#object-menu')!;
  menu.hidden = false;
  const margin = 12,
    left = Math.min(Math.max(margin, x + 10), innerWidth - menu.offsetWidth - margin),
    top = Math.min(Math.max(margin, y + 10), innerHeight - menu.offsetHeight - margin);
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}
export function togglePositionLock(b: Body) {
  recordHistory();
  const positionLocked = b.locked && !b.buildLocked;
  b.locked = !positionLocked;
  b.buildLocked = false;
  if (b.locked) b.velocity.set(0, 0, 0);
  updateInspector();
  if (app.menuBody === b) refreshObjectMenu();
  toast(`${b.name} ${b.locked ? 'position locked' : 'unlocked'}`);
}
export function toggleBuildLock(b: Body) {
  recordHistory();
  b.buildLocked = !b.buildLocked;
  b.locked = b.buildLocked;
  if (b.buildLocked) b.velocity.set(0, 0, 0);
  updateInspector();
  if (app.menuBody === b) refreshObjectMenu();
  toast(`${b.name} ${b.buildLocked ? 'build locked — collisions will feed it' : 'released from build lock'}`);
}
export function orbitNearest(b: Body) {
  const center = nearestOrbitTarget(b);
  if (!center || app.gravity <= 0) return;
  recordHistory();
  const offset = b.mesh.position.clone().sub(center.mesh.position).setY(0),
    radius = Math.max(offset.length(), center.radius * 3.2, 5.5);
  if (offset.lengthSq() < 0.01) offset.set(1, 0, 0);
  const radial = offset.normalize();
  b.mesh.position.copy(center.mesh.position).addScaledVector(radial, radius);
  const tangent = new THREE.Vector3(-radial.z, 0, radial.x).multiplyScalar(b.id % 2 ? 1 : -1);
  b.velocity.copy(center.velocity).addScaledVector(tangent, orbitalSpeed(G, app.gravity, center.mass, radius));
  b.locked = false;
  b.buildLocked = false;
  b.hostId = undefined;
  updateInspector();
  refreshObjectMenu();
  toast(`${b.name} entered orbit around ${center.name}`);
}

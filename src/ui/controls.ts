// Simulation speed, interaction/navigation modes, builder choice and overlay toggles.
import { container, scienceOverlayGroup } from '../scene/setup.ts';
import { app, audio, trails } from '../state/app-state.ts';
import type { PlacementBuilder } from '../state/types.ts';
import { toast } from './feed.ts';
import { closeObjectMenu } from './inspector.ts';

export function setSimulationSpeed(value: number) {
  app.speed = value;
  document
    .querySelectorAll<HTMLElement>('[data-speed]')
    .forEach(element => element.classList.toggle('active', Number(element.dataset.speed) === value));
}
export function setInteractionMode(add: boolean) {
  app.placementMode = add;
  app.navigationMode = false;
  document.querySelector('#add-mode')!.classList.toggle('active', add);
  document.querySelector('#inspect-mode')!.classList.toggle('active', !add);
  document.querySelector('#navigate-mode')!.classList.remove('active');
  document.querySelector<HTMLElement>('#navigation-help')!.hidden = true;
  const builderHint =
    app.selectedBuilder === 'system'
      ? 'SOLAR SYSTEM BRUSH · CLICK TO IMPLANT SOL AND ITS PLANETS'
      : app.selectedBuilder === 'binary'
        ? 'BINARY BRUSH · CLICK TO BUILD A TWO-STAR SYSTEM'
        : app.selectedBuilder === 'triple'
          ? 'TRIPLE BRUSH · CLICK TO BUILD A HIERARCHICAL THREE-STAR SYSTEM'
          : app.selectedBuilder.startsWith('galaxy-')
            ? `${app.selectedBuilder.slice(7).toUpperCase()} BRUSH · CLICK TO BUILD · ZOOM OUT TO EXPLORE`
            : 'ADD MODE · CLICK ANYWHERE TO PLACE · SWITCH TO INSPECT TO MOVE OBJECTS';
  document.querySelector('#hint')!.textContent = add
    ? builderHint
    : 'INSPECT MODE · CLICK OR DRAG OBJECTS · RIGHT-DRAG TO PAN';
  container.classList.toggle('placing', add);
  container.classList.remove('navigating');
}
export function setNavigationMode() {
  app.placementMode = false;
  app.navigationMode = true;
  document.querySelector('#add-mode')!.classList.remove('active');
  document.querySelector('#inspect-mode')!.classList.remove('active');
  document.querySelector('#navigate-mode')!.classList.add('active');
  document.querySelector('#hint')!.textContent =
    'NAVIGATE · DRAG SPACE TO PAN · SCROLL OR PINCH TO ZOOM · DOUBLE-CLICK TO FOCUS';
  document.querySelector<HTMLElement>('#navigation-help')!.hidden = false;
  container.classList.remove('placing');
  container.classList.add('navigating');
  closeObjectMenu();
}
export function chooseBuilder(builder: PlacementBuilder) {
  app.selectedBuilder = builder;
  setInteractionMode(true);
  document
    .querySelectorAll<HTMLElement>('[data-builder]')
    .forEach(button => button.classList.toggle('active', button.dataset.builder === builder));
  if (builder !== 'body') document.querySelectorAll('.body-btn').forEach(button => button.classList.remove('active'));
}

export function updateScienceModeButton() {
  document.querySelector('#science-mode')!.textContent = `Overlays: ${app.scienceMode}`;
  document.querySelector<HTMLElement>('#science-legend')!.hidden = app.scienceMode === 'off';
  scienceOverlayGroup.visible = app.scienceMode !== 'off' && !!app.selectedBody;
}
export function cycleScienceMode() {
  app.scienceMode = app.scienceMode === 'off' ? 'orbits' : app.scienceMode === 'orbits' ? 'full' : 'off';
  updateScienceModeButton();
  audio.play('ui');
  if (app.scienceMode !== 'off' && !app.selectedBody) toast('Select an object to inspect its orbit and forces');
}
export function toggleHabitabilityGuides() {
  app.habitabilityGuides = !app.habitabilityGuides;
  const button = document.querySelector('#habitability-mode')!;
  button.textContent = `Life zones: ${app.habitabilityGuides ? 'placement' : 'off'}`;
  button.classList.toggle('active', app.habitabilityGuides);
  audio.play('ui');
  toast(
    app.habitabilityGuides ? 'Life zones will appear only while moving a planet' : 'Life-zone placement guides hidden',
  );
}
export function toggleTrails() {
  app.trailsEnabled = !app.trailsEnabled;
  const button = document.querySelector('#trail-mode')!;
  button.textContent = `Trails: ${app.trailsEnabled ? 'fading' : 'off'}`;
  button.classList.toggle('active', app.trailsEnabled);
  for (const trail of trails.values()) trail.line.visible = app.trailsEnabled;
  audio.play('ui');
  toast(app.trailsEnabled ? 'Fading motion trails enabled' : 'Motion trails hidden');
}

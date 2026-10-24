// Toolbar, panel, menu and keyboard handlers.
import { type ExhibitId } from '../exhibits.ts';
import { type UniversePackId } from '../universe-packs.ts';
import { TYPES, VARIANT_COUNTS, type Placeable } from '../celestial-catalog.ts';
import { focusCosmicGroup } from '../bodies/groups.ts';
import { removeBody, replaceVisual, transform } from '../bodies/lifecycle.ts';
import { planetSubtype } from '../physics/body-math.ts';
import { fitAllObjects, focusSelected, nudgeCamera, zoomCamera } from '../scene/camera.ts';
import { cycleEffectsMode, cycleQualityMode, cycleRealismMode } from '../scene/quality.ts';
import { renderer } from '../scene/setup.ts';
import { app, audio } from '../state/app-state.ts';
import {
  loadSavedUniverse,
  recordHistory,
  recoverSession,
  redoUniverse,
  resetSimulation,
  saveCurrentUniverse,
  snapshotUniverse,
  undoUniverse,
} from '../state/history.ts';
import type { PlacementBuilder } from '../state/types.ts';
import {
  chooseBuilder,
  cycleScienceMode,
  setInteractionMode,
  setNavigationMode,
  setSimulationSpeed,
  toggleHabitabilityGuides,
  toggleTrails,
} from './controls.ts';
import { exitGuide, loadExhibit, openUniversePack } from './exhibit-flow.ts';
import { noteActivity, select, toast } from './feed.ts';
import { closeObjectMenu, orbitNearest, refreshObjectMenu, toggleBuildLock, togglePositionLock } from './inspector.ts';
import { impactEffect } from '../visuals/effects.ts';

export function bindToolbar() {
  document.addEventListener('pointerdown', noteActivity, { capture: true, passive: true });
  document.querySelectorAll<HTMLButtonElement>('.body-btn').forEach(
    button =>
      (button.onclick = () => {
        app.selectedChoiceId = button.dataset.choice ?? 'rocky';
        chooseBuilder('body');
        document.querySelectorAll('.body-btn').forEach(x => x.classList.toggle('active', x === button));
      }),
  );
  document
    .querySelectorAll<HTMLButtonElement>('[data-builder]')
    .forEach(button => (button.onclick = () => chooseBuilder(button.dataset.builder as PlacementBuilder)));
  document.querySelector<HTMLButtonElement>('#add-mode')!.onclick = () => setInteractionMode(true);
  document.querySelector<HTMLButtonElement>('#inspect-mode')!.onclick = () => setInteractionMode(false);
  document.querySelector<HTMLButtonElement>('#navigate-mode')!.onclick = setNavigationMode;
  document.querySelector<HTMLButtonElement>('#zoom-in')!.onclick = () => zoomCamera(0.68);
  document.querySelector<HTMLButtonElement>('#zoom-out')!.onclick = () => zoomCamera(1.48);
  document.querySelector<HTMLButtonElement>('#zoom-selected')!.onclick = focusSelected;
  document.querySelector<HTMLButtonElement>('#zoom-fit')!.onclick = fitAllObjects;
  const gravityControl = document.querySelector<HTMLInputElement>('#gravity')!;
  gravityControl.onpointerdown = () => (app.historyBeforeGravity = snapshotUniverse());
  gravityControl.oninput = e => (app.gravity = Number((e.target as HTMLInputElement).value));
  gravityControl.onchange = () => {
    if (app.historyBeforeGravity) recordHistory(app.historyBeforeGravity);
    app.historyBeforeGravity = null;
  };
  document.querySelector<HTMLButtonElement>('#pause')!.onclick = e => {
    app.paused = !app.paused;
    if (app.paused) app.simAccumulator = 0;
    (e.target as HTMLButtonElement).textContent = app.paused ? 'Resume' : 'Pause';
  };
  document.querySelector<HTMLButtonElement>('#clear')!.onclick = () => {
    recordHistory();
    resetSimulation();
    app.currentExhibit = null;
    document.querySelector<HTMLElement>('#guide-card')!.hidden = true;
    toast('Simulation cleared');
  };
  document.querySelector<HTMLButtonElement>('#orbit-mode')!.onclick = e => {
    app.orbitMode = !app.orbitMode;
    (e.currentTarget as HTMLButtonElement).classList.toggle('active', app.orbitMode);
    if (app.orbitMode) setInteractionMode(false);
    document.querySelector('#hint')!.textContent = app.orbitMode
      ? 'ORBIT MODE · DRAG NEAR A BLUE RING TO ENTER ORBIT'
      : 'INSPECT MODE · CLICK OR DRAG OBJECTS · RIGHT-DRAG TO PAN';
  };
  document.querySelector<HTMLButtonElement>('#universes-button')!.onclick = () => {
    noteActivity();
    document.querySelector<HTMLElement>('#scenario-picker')!.hidden = true;
    document.querySelector<HTMLElement>('#universe-picker')!.hidden = false;
  };
  document.querySelector<HTMLButtonElement>('#universe-close')!.onclick = () =>
    (document.querySelector<HTMLElement>('#universe-picker')!.hidden = true);
  document.querySelectorAll<HTMLButtonElement>('[data-universe]').forEach(
    button =>
      (button.onclick = () => {
        noteActivity();
        openUniversePack(button.dataset.universe as UniversePackId);
      }),
  );
  document.querySelector<HTMLButtonElement>('#exhibits-button')!.onclick = () => {
    noteActivity();
    document.querySelector<HTMLElement>('#universe-picker')!.hidden = true;
    document.querySelector<HTMLElement>('#scenario-picker')!.hidden = false;
  };
  document.querySelector<HTMLButtonElement>('#scenario-close')!.onclick = () =>
    (document.querySelector<HTMLElement>('#scenario-picker')!.hidden = true);
  document.querySelectorAll<HTMLButtonElement>('[data-exhibit]').forEach(
    button =>
      (button.onclick = () => {
        noteActivity();
        app.paused = false;
        document.querySelector<HTMLButtonElement>('#pause')!.textContent = 'Pause';
        loadExhibit(button.dataset.exhibit as ExhibitId);
      }),
  );
  document.querySelector<HTMLButtonElement>('#guide-restart')!.onclick = () => {
    if (app.currentExhibit) {
      app.paused = false;
      document.querySelector<HTMLButtonElement>('#pause')!.textContent = 'Pause';
      loadExhibit(app.currentExhibit);
    }
  };
  document.querySelector<HTMLButtonElement>('#guide-exit')!.onclick = exitGuide;
  document.querySelector<HTMLButtonElement>('#fullscreen-button')!.onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      toast('Fullscreen is unavailable in this browser view');
    }
  };
  document.addEventListener(
    'fullscreenchange',
    () =>
      (document.querySelector<HTMLButtonElement>('#fullscreen-button')!.textContent = document.fullscreenElement
        ? 'Exit fullscreen'
        : 'Fullscreen'),
  );
  document.querySelector<HTMLButtonElement>('#lock')!.onclick = () => {
    if (app.selectedBody) togglePositionLock(app.selectedBody);
  };
  document.querySelector<HTMLButtonElement>('#build-lock')!.onclick = () => {
    if (app.selectedBody) toggleBuildLock(app.selectedBody);
  };
  document.querySelector<HTMLButtonElement>('#universe-home')!.onclick = fitAllObjects;
  document.querySelector<HTMLSelectElement>('#group-select')!.onchange = e => {
    const value = (e.currentTarget as HTMLSelectElement).value;
    focusCosmicGroup(value ? Number(value) : null);
  };
  document.querySelector<HTMLButtonElement>('#undo')!.onclick = undoUniverse;
  document.querySelector<HTMLButtonElement>('#redo')!.onclick = redoUniverse;
  document.querySelector<HTMLButtonElement>('#save-universe')!.onclick = saveCurrentUniverse;
  document.querySelector<HTMLButtonElement>('#load-universe')!.onclick = loadSavedUniverse;
  document.querySelector<HTMLButtonElement>('#recover-session')!.onclick = recoverSession;
  document.querySelector<HTMLButtonElement>('#habitability-mode')!.onclick = toggleHabitabilityGuides;
  document.querySelector<HTMLButtonElement>('#trail-mode')!.onclick = toggleTrails;
  document.querySelector<HTMLButtonElement>('#science-mode')!.onclick = cycleScienceMode;
  document.querySelector<HTMLButtonElement>('#quality-mode')!.onclick = cycleQualityMode;
  document.querySelector<HTMLButtonElement>('#realism-mode')!.onclick = cycleRealismMode;
  document.querySelector<HTMLButtonElement>('#effects-mode')!.onclick = cycleEffectsMode;
  document.querySelector<HTMLButtonElement>('#sound-mode')!.onclick = e => {
    audio.setMuted(!audio.muted);
    (e.currentTarget as HTMLButtonElement).textContent = `Sound: ${audio.muted ? 'off' : 'on'}`;
    if (!audio.muted) audio.play('ui');
    toast(audio.muted ? 'Exhibit sound muted' : 'Exhibit sound enabled');
  };
  document.querySelector<HTMLElement>('#event-feed')!.onclick = e => {
    const feed = e.currentTarget as HTMLElement;
    feed.classList.toggle('expanded');
    feed.querySelector(':scope > span')!.textContent = feed.classList.contains('expanded')
      ? 'Observatory timeline · click to collapse'
      : 'Observatory timeline · click to expand';
  };
  document.querySelector<HTMLButtonElement>('#menu-close')!.onclick = closeObjectMenu;
  document.querySelector<HTMLButtonElement>('#menu-lock')!.onclick = () => {
    if (app.menuBody) togglePositionLock(app.menuBody);
  };
  document.querySelector<HTMLButtonElement>('#menu-build-lock')!.onclick = () => {
    if (app.menuBody) toggleBuildLock(app.menuBody);
  };
  document.querySelector<HTMLButtonElement>('#menu-orbit')!.onclick = () => {
    if (app.menuBody) orbitNearest(app.menuBody);
  };
  document.querySelectorAll<HTMLButtonElement>('[data-change]').forEach(
    button =>
      (button.onclick = () => {
        const b = app.menuBody,
          kind = button.dataset.change as Placeable;
        if (!b) return;
        recordHistory();
        const variants = VARIANT_COUNTS[kind];
        if (b.kind === kind && variants) {
          b.variant = (b.variant + 1) % variants;
          replaceVisual(b);
          toast(`${b.name} changed to ${planetSubtype(b)}`);
        } else if (b.kind !== kind) {
          const p = b.mesh.position.clone();
          transform(b, kind, TYPES[kind].mass);
          b.mesh.position.copy(p);
          impactEffect(p, TYPES[kind].color, 1.1);
          toast(`${b.name} changed into ${TYPES[kind].label.toLowerCase()}`);
        }
        select(b);
        refreshObjectMenu();
      }),
  );
  document.querySelector<HTMLButtonElement>('#menu-remove')!.onclick = () => {
    if (!app.menuBody) return;
    recordHistory();
    const b = app.menuBody;
    closeObjectMenu();
    removeBody(b);
    toast(`${b.name} removed`);
  };
  document.addEventListener('pointerdown', e => {
    const menu = document.querySelector<HTMLElement>('#object-menu')!;
    if (!menu.hidden && !menu.contains(e.target as Node) && e.target !== renderer.domElement) closeObjectMenu();
  });
  document.addEventListener('keydown', e => {
    if ((e.target as HTMLElement).matches('input,select,textarea')) return;
    noteActivity();
    const key = e.key.toLowerCase();
    if (app.navigationMode && ['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'w', 'a', 's', 'd'].includes(key)) {
      e.preventDefault();
      const horizontal = key === 'arrowleft' || key === 'a' ? -1 : key === 'arrowright' || key === 'd' ? 1 : 0,
        vertical = key === 'arrowup' || key === 'w' ? 1 : key === 'arrowdown' || key === 's' ? -1 : 0;
      nudgeCamera(horizontal, vertical);
    } else if ((e.metaKey || e.ctrlKey) && key === 'z') {
      e.preventDefault();
      if (e.shiftKey) redoUniverse();
      else undoUniverse();
    } else if ((e.metaKey || e.ctrlKey) && key === 'y') {
      e.preventDefault();
      redoUniverse();
    } else if (e.key === 'Escape') {
      closeObjectMenu();
      document.querySelector<HTMLElement>('#scenario-picker')!.hidden = true;
      document.querySelector<HTMLElement>('#universe-picker')!.hidden = true;
      setInteractionMode(false);
    } else if (e.key === '+' || e.key === '=') zoomCamera(0.72);
    else if (e.key === '-') zoomCamera(1.4);
    else if (e.key === '0') fitAllObjects();
    else if (key === 'b') setInteractionMode(true);
    else if (key === 'v') setInteractionMode(false);
    else if (key === 'n') setNavigationMode();
    else if (key === 'f') focusSelected();
  });
  document
    .querySelectorAll<HTMLButtonElement>('[data-speed]')
    .forEach(b => (b.onclick = () => setSimulationSpeed(Number(b.dataset.speed))));
}

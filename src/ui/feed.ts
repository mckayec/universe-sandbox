// Narration, idle attract mode, toasts, the event feed and selection.
import { updateScienceOverlays } from '../scene/overlays.ts';
import { preferences, selectionRing } from '../scene/setup.ts';
import { app, audio, exhibitEvents } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { setSimulationSpeed } from './controls.ts';
import { loadExhibit, showGuide } from './exhibit-flow.ts';
import { updateInspector } from './inspector.ts';

export const narrationFacts = [
  'Gas crossing a nebula experiences drag and transfers mass gradually.',
  'Bright ribbons trace material moving between objects in this simplified model.',
  'Blue and white stars are hotter than yellow and red stars.',
  'A build lock is an exhibit tool: real celestial bodies never stay fixed in space.',
  'Accretion disks glow because falling material heats as it spirals inward.',
  "Inside a Roche limit, the pull on a world's near side outruns its own gravity, and it is torn into a stream of debris.",
];
export function showNarration() {
  if (!preferences.narration) return;
  const card = document.querySelector<HTMLElement>('#narration-card')!;
  document.querySelector('#narration-copy')!.textContent = narrationFacts[app.narrationIndex % narrationFacts.length];
  card.hidden = false;
}
export function noteActivity() {
  app.idleSeconds = 0;
  audio.ensure();
  document.querySelector<HTMLElement>('#narration-card')!.hidden = true;
  if (!app.attractMode) return;
  app.attractMode = false;
  app.attractTimer = 0;
  document.querySelector<HTMLElement>('#attract-badge')!.hidden = true;
  setSimulationSpeed(1);
  if (app.currentExhibit) showGuide(app.currentExhibit);
  toast('Demonstration paused — the exhibit is yours');
}
function startAttractMode() {
  app.attractMode = true;
  app.attractTimer = 0;
  app.narrationTimer = 0;
  app.narrationIndex = 0;
  app.paused = false;
  document.querySelector<HTMLButtonElement>('#pause')!.textContent = 'Pause';
  document.querySelector<HTMLElement>('#attract-badge')!.hidden = false;
  loadExhibit('feed-black-hole', true);
  showNarration();
  setSimulationSpeed(2);
}
export function updateAttractMode(dt: number) {
  if (app.attractMode) {
    app.attractTimer += dt;
    if (app.attractTimer > 48) startAttractMode();
    return;
  }
  app.idleSeconds += dt;
  if (app.idleSeconds > 120 && document.querySelector<HTMLElement>('#scenario-picker')!.hidden) startAttractMode();
}
export function toast(msg: string) {
  const el = document.querySelector('#toast')!;
  el.textContent = msg;
  el.classList.add('show');
  app.toastTimer = 2.6;
}
export function renderExhibitEvents() {
  const root = document.querySelector<HTMLElement>('#event-items')!;
  root.replaceChildren();
  if (!exhibitEvents.length) {
    const p = document.createElement('p');
    p.textContent = 'Interactions and transformations will appear here.';
    root.appendChild(p);
    return;
  }
  for (const event of exhibitEvents) {
    const card = document.createElement('article');
    card.style.setProperty('--event-color', event.color);
    const title = document.createElement('strong'),
      detail = document.createElement('small');
    title.textContent = event.title;
    detail.textContent = event.detail;
    card.append(title, detail);
    root.appendChild(card);
  }
}
export function museumEvent(title: string, detail: string, color = '#9bb7ff', body?: Body) {
  exhibitEvents.unshift({ title, detail, color });
  exhibitEvents.splice(8);
  if (body) body.lastEvent = `${title}: ${detail}`;
  renderExhibitEvents();
  toast(title);
  const normalized = title.toLowerCase(),
    sound = normalized.includes('supernova')
      ? 'supernova'
      : normalized.includes('collision') || normalized.includes('fragment') || normalized.includes('impact')
        ? 'impact'
        : normalized.includes('ignition') || normalized.includes('formed') || normalized.includes('transition')
          ? 'transform'
          : normalized.includes('accretion') || normalized.includes('transfer') || normalized.includes('tidal')
            ? 'accretion'
            : 'ui';
  audio.play(sound, normalized.includes('supernova') ? 2.2 : 1);
  if (app.effectsMode === 'full' && (sound === 'impact' || sound === 'supernova') && navigator.vibrate)
    navigator.vibrate(sound === 'supernova' ? [35, 25, 80] : 22);
  if (app.selectedBody === body) updateInspector();
}
export function select(b: Body | null) {
  app.selectedBody = b;
  document.querySelector('#info-panel')!.classList.toggle('empty', !b);
  selectionRing.visible = !!b;
  document.querySelector<HTMLButtonElement>('#zoom-selected')!.disabled = !b;
  updateInspector();
  updateScienceOverlays();
}

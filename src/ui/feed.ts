// Narration, idle attract mode, toasts, the event feed and selection.
import type { ExhibitId } from '../exhibits.ts';
import type { SandboxSnapshot } from '../sandbox-state.ts';
import { updateScienceOverlays } from '../scene/overlays.ts';
import { preferences, selectionRing } from '../scene/setup.ts';
import { app, audio, exhibitEvents, redoStack, undoStack } from '../state/app-state.ts';
import { restoreUniverse, snapshotUniverse } from '../state/history.ts';
import type { Body, ExhibitEvent } from '../state/types.ts';
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
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Session bookkeeping for autosave. The recovery checkpoint is only overwritten once the visitor has changed
 * something in this session (so a reload does not replace the previous build with the default scene), and
 * the visitor's scene is parked here while the idle demonstration runs.
 */
export const session = {
  userLoadedExhibit: false,
  preAttract: null as null | {
    snapshot: SandboxSnapshot;
    exhibit: ExhibitId | null;
    events: ExhibitEvent[];
    speed: number;
    paused: boolean;
  },
};
/** True once the visitor has made a change worth checkpointing in this session. */
export function sessionChanged() {
  return session.userLoadedExhibit || undoStack.length > 0 || redoStack.length > 0;
}
/** The scene that should be checkpointed: the visitor's own scene, never the attract-mode demo. */
export function recoverySnapshot(): SandboxSnapshot | null {
  if (!sessionChanged()) return null;
  return session.preAttract?.snapshot ?? (app.attractMode ? null : snapshotUniverse());
}
/** Records visitor activity. Returns true when this input ended the attract-mode demonstration. */
export function noteActivity() {
  app.idleSeconds = 0;
  audio.ensure();
  document.querySelector<HTMLElement>('#narration-card')!.hidden = true;
  if (!app.attractMode) return false;
  app.attractMode = false;
  app.attractTimer = 0;
  document.querySelector<HTMLElement>('#attract-badge')!.hidden = true;
  const saved = session.preAttract;
  session.preAttract = null;
  if (saved) {
    restoreUniverse(saved.snapshot);
    exhibitEvents.splice(0, exhibitEvents.length, ...saved.events);
    renderExhibitEvents();
    app.currentExhibit = saved.exhibit;
    app.paused = saved.paused;
    document.querySelector<HTMLButtonElement>('#pause')!.textContent = app.paused ? 'Resume' : 'Pause';
    setSimulationSpeed(saved.speed);
  } else setSimulationSpeed(1);
  if (app.currentExhibit) showGuide(app.currentExhibit);
  toast('Welcome back — your universe has been restored');
  return true;
}
function startAttractMode() {
  // Park the visitor's scene once; the demo restarts every 48 s without replacing the parked copy.
  if (!session.preAttract)
    session.preAttract = {
      snapshot: snapshotUniverse(),
      exhibit: app.currentExhibit,
      events: exhibitEvents.map(event => ({ ...event })),
      speed: app.speed,
      paused: app.paused,
    };
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
  if (reducedMotion.matches || app.idleSeconds <= 120) return;
  const pickerOpen =
    !document.querySelector<HTMLElement>('#scenario-picker')!.hidden ||
    !document.querySelector<HTMLElement>('#universe-picker')!.hidden ||
    !document.querySelector<HTMLElement>('#object-menu')!.hidden;
  if (!pickerOpen) startAttractMode();
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
/** Matches the compact (phone / iPad portrait) layout breakpoint in style.css. */
export function compactLayout() {
  return matchMedia('(max-width: 800px)').matches;
}
export function setToolsCollapsed(collapsed: boolean) {
  document.querySelector('.shell')!.classList.toggle('tools-collapsed', collapsed);
  const toggle = document.querySelector<HTMLButtonElement>('#panel-toggle')!;
  toggle.textContent = collapsed ? 'Show tools' : 'Hide tools';
  toggle.setAttribute('aria-expanded', String(!collapsed));
}
/** Offers the life-zone guide from the inspector for stars and worlds (the toolbar button is easy to miss). */
export function updateLifeZoneButton() {
  const b = app.selectedBody,
    button = document.querySelector<HTMLButtonElement>('#info-life-zones')!;
  button.hidden = !b || !['star', 'rocky', 'dwarf', 'moon', 'gas'].includes(b.kind);
  button.textContent = app.habitabilityGuides ? 'Hide life zones' : 'Show life zones';
  button.classList.toggle('active', app.habitabilityGuides);
}
export function select(b: Body | null) {
  app.selectedBody = b;
  const panel = document.querySelector('#info-panel')!;
  panel.classList.toggle('empty', !b);
  if (!b) panel.classList.remove('expanded');
  updateLifeZoneButton();
  selectionRing.visible = !!b;
  document.querySelector<HTMLButtonElement>('#zoom-selected')!.disabled = !b;
  updateInspector();
  updateScienceOverlays();
}

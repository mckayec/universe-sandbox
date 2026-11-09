export type RealismMode = 'exhibit' | 'educational' | 'realistic';
export type EffectsMode = 'full' | 'gentle';
export type DeviceTier = 'mobile' | 'balanced' | 'performance';

export type ExhibitPreferences = {
  realism: RealismMode;
  effects: EffectsMode;
  narration: boolean;
};

const PREFERENCES_KEY = 'gravity-lab-preferences-v1';

export function loadPreferences(reducedMotion = false): ExhibitPreferences {
  const fallback: ExhibitPreferences = {
    realism: 'exhibit',
    effects: reducedMotion ? 'gentle' : 'full',
    narration: true,
  };
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const parsed = JSON.parse(localStorage.getItem(PREFERENCES_KEY) ?? '') as Partial<ExhibitPreferences>;
    return {
      realism: ['exhibit', 'educational', 'realistic'].includes(parsed.realism ?? '')
        ? parsed.realism!
        : fallback.realism,
      effects: ['full', 'gentle'].includes(parsed.effects ?? '') ? parsed.effects! : fallback.effects,
      narration: parsed.narration ?? fallback.narration,
    };
  } catch {
    return fallback;
  }
}

export function savePreferences(preferences: ExhibitPreferences) {
  if (typeof localStorage === 'undefined') return false;
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    return true;
  } catch {
    return false;
  }
}

export function evolutionFactor(mode: RealismMode) {
  return mode === 'exhibit' ? 1 : mode === 'educational' ? 0.42 : 0.12;
}

export function transferFactor(mode: RealismMode) {
  return mode === 'exhibit' ? 1 : mode === 'educational' ? 0.65 : 0.38;
}

export function detectDeviceTier(compact: boolean): DeviceTier {
  const cores = typeof navigator === 'undefined' ? 4 : navigator.hardwareConcurrency || 4;
  const memory =
    typeof navigator === 'undefined' ? 4 : ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4);
  // Viewport width is a layout concern, not a reliable measure of GPU capability.
  // Only a genuinely mobile/coarse-pointer device is passed as compact; desktop
  // browsers can then let the adaptive monitor tune quality from observed FPS.
  if (compact) return 'mobile';
  if (cores >= 10 && memory >= 8) return 'performance';
  return 'balanced';
}

/** Longest real frame used for physics/animation (fixed-step safety at high speeds and after stalls). */
export const MAX_FRAME_STEP = 0.03;
/** Real frames longer than this are interruptions (hidden tab, debugger, OS pause), not rendering cost. */
export const MAX_MEASURED_FRAME = 0.5;

/**
 * Split one sampled frame delta into the honest wall-clock time used to measure performance and the capped step
 * used to advance the simulation. `measured` is null for non-finite or interruption-length frames, which callers
 * should drop from FPS and adaptive-quality windows instead of averaging them in.
 */
export function frameTiming(rawDelta: number) {
  const finite = Number.isFinite(rawDelta) && rawDelta > 0 ? rawDelta : 0;
  return {
    measured: finite > 0 && finite <= MAX_MEASURED_FRAME ? finite : null,
    step: Math.min(finite, MAX_FRAME_STEP),
  };
}

export class PerformanceMonitor {
  private elapsed = 0;
  private frames = 0;
  fps = 60;
  droppedFrames = 0;

  update(delta: number, droppedSimulationFrame = false) {
    this.elapsed += delta;
    this.frames++;
    if (droppedSimulationFrame) this.droppedFrames++;
    if (this.elapsed >= 1) {
      this.fps = Math.round(this.frames / this.elapsed);
      this.elapsed = 0;
      this.frames = 0;
      return true;
    }
    return false;
  }

  /** Start a fresh averaging window, e.g. after the page was hidden. */
  reset() {
    this.elapsed = 0;
    this.frames = 0;
  }
}

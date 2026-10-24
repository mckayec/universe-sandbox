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
}

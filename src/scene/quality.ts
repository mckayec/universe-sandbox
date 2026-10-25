// Render quality scaling, realism/effects preferences, adaptive quality and gravitational lensing.
import * as THREE from 'three';
import { setNebulaQuality } from '../nebula-hd.ts';
import { savePreferences } from '../exhibit-runtime.ts';
import { bloom, camera, composer, deviceTier, isCompact, lensingPass, preferences, renderer } from './setup.ts';
import { app, audio, bodies } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { toast } from '../ui/feed.ts';

// Lowest scale the adaptive loop and the Low setting may reach, and the absolute pixel-ratio floors. Desktop
// can now drop below 1× so Low quality really renders fewer pixels on DPR-1 displays.
export const QUALITY_FLOOR = deviceTier === 'mobile' ? 0.6 : 0.62;
const RENDERER_RATIO_FLOOR = deviceTier === 'mobile' ? 0.7 : 0.62,
  COMPOSER_RATIO_FLOOR = deviceTier === 'mobile' ? 0.66 : 0.6;
// Bloom is blurred anyway, so it runs at a further-reduced resolution as quality drops.
const bloomResolution = new THREE.Vector2();

export function applyQualityScale(scale: number) {
  app.qualityScale = scale;
  setNebulaQuality(scale);
  const rendererCap = deviceTier === 'performance' ? 2 : deviceTier === 'balanced' ? 1.75 : 1.35,
    composerCap = deviceTier === 'performance' ? 1.8 : deviceTier === 'balanced' ? 1.55 : 1.2,
    rendererRatio = Math.max(RENDERER_RATIO_FLOOR, Math.min(devicePixelRatio, rendererCap) * scale),
    composerRatio = Math.max(COMPOSER_RATIO_FLOOR, Math.min(devicePixelRatio, composerCap) * scale);
  renderer.setPixelRatio(rendererRatio);
  composer.setPixelRatio(composerRatio);
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  // UnrealBloomPass sizes its mip chain from the composer; shrink it further with quality (its own
  // setSize halves this again for the first mip).
  const bloomScale = THREE.MathUtils.clamp(scale, 0.5, 1) * (scale < 0.75 ? 0.75 : 1);
  bloomResolution.set(
    Math.max(64, Math.round(innerWidth * composerRatio * bloomScale)),
    Math.max(64, Math.round(innerHeight * composerRatio * bloomScale)),
  );
  bloom.setSize(bloomResolution.x, bloomResolution.y);
}
export function updateQualityModeButton() {
  document.querySelector('#quality-mode')!.textContent = `Quality: ${app.qualityMode}`;
}
export function cycleQualityMode() {
  app.qualityMode = app.qualityMode === 'auto' ? 'high' : app.qualityMode === 'high' ? 'low' : 'auto';
  applyQualityScale(app.qualityMode === 'high' ? 1 : app.qualityMode === 'low' ? QUALITY_FLOOR : isCompact ? 0.78 : 1);
  app.qualityTimer = 0;
  app.qualityFrames = 0;
  updateQualityModeButton();
  audio.play('ui');
  toast(`${app.qualityMode} visual quality`);
}
export function applyExhibitPreferences() {
  document.documentElement.classList.toggle('gentle-effects', app.effectsMode === 'gentle');
  document.querySelector('#realism-mode')!.textContent = `Model: ${app.realismMode}`;
  document.querySelector('#effects-mode')!.textContent = `Effects: ${app.effectsMode}`;
  preferences.realism = app.realismMode;
  preferences.effects = app.effectsMode;
  savePreferences(preferences);
}
export function cycleRealismMode() {
  app.realismMode =
    app.realismMode === 'exhibit' ? 'educational' : app.realismMode === 'educational' ? 'realistic' : 'exhibit';
  applyExhibitPreferences();
  audio.play('ui');
  toast(
    app.realismMode === 'exhibit'
      ? 'Exhibit model — transformations are accelerated'
      : app.realismMode === 'educational'
        ? 'Educational model — slower, steadier evolution'
        : 'Realistic pacing — greatly slowed evolution',
  );
}
export function cycleEffectsMode() {
  app.effectsMode = app.effectsMode === 'full' ? 'gentle' : 'full';
  applyExhibitPreferences();
  audio.play('ui');
  toast(app.effectsMode === 'full' ? 'Full exhibit effects enabled' : 'Gentle effects reduce flashes and particles');
}
export function updateAdaptiveQuality(dt: number) {
  if (app.qualityMode !== 'auto') return;
  app.qualityTimer += dt;
  app.qualityFrames++;
  if (app.qualityTimer < 2.5) return;
  // Hysteresis: step down quickly when clearly slow, step up slowly and only when comfortably fast, so the
  // scale does not oscillate around the threshold.
  const fps = app.qualityFrames / app.qualityTimer,
    target =
      fps < 43
        ? Math.max(QUALITY_FLOOR, app.qualityScale - 0.08)
        : fps > 57.5
          ? Math.min(1, app.qualityScale + 0.04)
          : app.qualityScale;
  if (Math.abs(target - app.qualityScale) > 0.02) applyQualityScale(target);
  app.qualityTimer = 0;
  app.qualityFrames = 0;
}
export function updateLensing() {
  let strongest: Body | undefined;
  for (const body of bodies)
    if (body.kind === 'blackhole' && (!strongest || body.mass > strongest.mass)) strongest = body;
  if (!strongest) {
    lensingPass.uniforms.strength.value = 0;
    return;
  }
  const projected = strongest.mesh.position.clone().project(camera),
    visible = projected.z < 1 && projected.z > -1 && Math.abs(projected.x) < 1.25 && Math.abs(projected.y) < 1.25,
    distance = camera.position.distanceTo(strongest.mesh.position);
  lensingPass.uniforms.center.value.set(projected.x * 0.5 + 0.5, projected.y * 0.5 + 0.5);
  lensingPass.uniforms.radius.value = THREE.MathUtils.clamp((strongest.radius / distance) * 3.8, 0.025, 0.18);
  lensingPass.uniforms.strength.value = visible
    ? THREE.MathUtils.clamp(0.2 + Math.log10(Math.max(10, strongest.mass)) * 0.09, 0.24, 0.58)
    : 0;
  lensingPass.uniforms.aspect.value = innerWidth / innerHeight;
}

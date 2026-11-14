import './style.css';
import './ui/template.ts';
import { bindPointerEvents } from './ui/pointer.ts';
import { bindToolbar } from './ui/toolbar.ts';
import { bindKidsMode, startKidsFromQuery } from './ui/kids.ts';
import { bindOverlayBudget } from './ui/overlay-layout.ts';
import * as THREE from 'three';
import { saveRecoverySnapshot } from './sandbox-state.ts';
import { animate, bindFrameTimingReset } from './app/loop.ts';
import { refreshGroupNavigator } from './bodies/groups.ts';
import { addBody } from './bodies/registry.ts';
import { applyExhibitPreferences, applyQualityScale, updateQualityModeButton } from './scene/quality.ts';
import { camera, labelRenderer, lensingPass } from './scene/setup.ts';
import { app, bodies } from './state/app-state.ts';
import { updateHistoryButtons } from './state/history.ts';
import { setInteractionMode, updateScienceModeButton } from './ui/controls.ts';
import { recoverySnapshot } from './ui/feed.ts';
import { installTestProbe } from './ui/test-probe.ts';
import { prewarmEffectTextures } from './visuals/textures.ts';

if (import.meta.env.PROD && 'serviceWorker' in navigator)
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => undefined));

bindPointerEvents();
bindToolbar();
bindKidsMode();
bindOverlayBudget();
bindFrameTimingReset();
installTestProbe();
setInteractionMode(true);
addBody('star', new THREE.Vector3(), new THREE.Vector3(), { locked: true });
addBody('rocky', new THREE.Vector3(7, 0, 0), new THREE.Vector3(0, 0, -5.6));
addBody('gas', new THREE.Vector3(-21, 0, 0), new THREE.Vector3(0, 0, 3.25));
addBody('nebula', new THREE.Vector3(28, 0, -20), new THREE.Vector3(0.05, 0, 0.08));
refreshGroupNavigator();
updateHistoryButtons();
updateScienceModeButton();
updateQualityModeButton();
applyExhibitPreferences();
// Query-driven Kids start runs last, after every adult default above (SC6-K2).
startKidsFromQuery();

animate();
prewarmEffectTextures();
addEventListener('pagehide', () => {
  const snapshot = recoverySnapshot();
  if (snapshot && snapshot.bodies.length) saveRecoverySnapshot(snapshot);
});
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  lensingPass.uniforms.aspect.value = innerWidth / innerHeight;
  applyQualityScale(app.qualityScale);
  labelRenderer.setSize(innerWidth, innerHeight);
});

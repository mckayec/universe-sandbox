// Camera zoom, smooth transitions, focus and fit-all.
import * as THREE from 'three';
import { focusBodies } from '../bodies/groups.ts';
import { MAX_CAMERA_DISTANCE, MIN_CAMERA_DISTANCE, camera, isCompact, viewTarget } from './setup.ts';
import { app, bodies } from '../state/app-state.ts';
import { toast } from '../ui/feed.ts';

export function zoomCamera(factor: number, focus?: THREE.Vector3) {
  const offset = camera.position.clone().sub(viewTarget),
    oldDistance = offset.length(),
    distance = THREE.MathUtils.clamp(oldDistance * factor, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE);
  if (focus && factor < 1) viewTarget.lerp(focus, 0.16);
  camera.position.copy(viewTarget).add(offset.setLength(distance));
  camera.lookAt(viewTarget);
}
export function transitionCamera(target: THREE.Vector3, distance: number, duration = 0.62) {
  const direction = camera.position.clone().sub(viewTarget);
  if (direction.lengthSq() < 0.01) direction.set(0, 0.62, 0.78);
  const toTarget = target.clone().setY(0),
    toPosition = toTarget
      .clone()
      .add(
        direction.normalize().multiplyScalar(THREE.MathUtils.clamp(distance, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE)),
      );
  app.cameraTransition = {
    fromPosition: camera.position.clone(),
    fromTarget: viewTarget.clone(),
    toPosition,
    toTarget,
    age: 0,
    duration,
  };
}
export function updateCameraTransition(dt: number) {
  if (!app.cameraTransition) return;
  app.cameraTransition.age += dt;
  const raw = THREE.MathUtils.clamp(app.cameraTransition.age / app.cameraTransition.duration, 0, 1),
    p = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
  camera.position.lerpVectors(app.cameraTransition.fromPosition, app.cameraTransition.toPosition, p);
  viewTarget.lerpVectors(app.cameraTransition.fromTarget, app.cameraTransition.toTarget, p);
  camera.lookAt(viewTarget);
  if (raw >= 1) app.cameraTransition = null;
}
export function focusSelected() {
  if (!app.selectedBody) {
    toast('Select an object to focus');
    return;
  }
  transitionCamera(app.selectedBody.mesh.position, Math.max(15, app.selectedBody.radius * 9));
  document.querySelector('#frame-name')!.textContent = app.selectedBody.name.toUpperCase();
}
export function nudgeCamera(horizontal: number, vertical: number) {
  const distance = camera.position.distanceTo(viewTarget),
    forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  if (forward.lengthSq() < 0.01) forward.set(0, 0, -1);
  forward.normalize();
  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize(),
    shift = right.multiplyScalar(horizontal * distance * 0.08).addScaledVector(forward, vertical * distance * 0.08);
  viewTarget.add(shift);
  camera.position.add(shift);
  camera.lookAt(viewTarget);
  app.cameraTransition = null;
}
export function fitAllObjects() {
  app.selectedGroupId = null;
  document.querySelector<HTMLSelectElement>('#group-select')!.value = '';
  if (!bodies.length) {
    viewTarget.set(0, 0, 0);
    camera.position.set(0, isCompact ? 90 : 34, isCompact ? 120 : 42);
    camera.lookAt(viewTarget);
    document.querySelector('#frame-name')!.textContent = 'DEEP SPACE';
    toast('View reset');
    return;
  }
  focusBodies(bodies, 'DEEP SPACE');
  toast(`Framed ${bodies.length} objects`);
}

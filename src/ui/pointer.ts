// Canvas pointer, touch, wheel and double-click handling.
import * as THREE from 'three';
import { placeSelected } from '../builders/placement.ts';
import { focusSelected, zoomCamera } from '../scene/camera.ts';
import { clearGuides, showGuides, snapOrbit } from '../scene/overlays.ts';
import {
  MAX_CAMERA_DISTANCE,
  MIN_CAMERA_DISTANCE,
  camStart,
  camera,
  container,
  dragPoint,
  dragStart,
  panStart,
  plane,
  pointer,
  raycaster,
  renderer,
  targetStart,
  viewTarget,
  world,
} from '../scene/setup.ts';
import { activePointers, app, bodies } from '../state/app-state.ts';
import { recordHistory, snapshotUniverse } from '../state/history.ts';
import { noteActivity, select, toast } from './feed.ts';
import { closeObjectMenu, openObjectMenu } from './inspector.ts';

// Reused per-event temporaries (pointermove fires at display rate during pans and pinches).
const tmpCenter = new THREE.Vector2(),
  tmpOffset = new THREE.Vector3(),
  tmpForward = new THREE.Vector3(),
  tmpRight = new THREE.Vector3(),
  UP = new THREE.Vector3(0, 1, 0);
/** Ground-plane forward/right axes for the current camera, written into tmpForward/tmpRight. */
function groundAxes() {
  camera.getWorldDirection(tmpForward);
  tmpForward.y = 0;
  if (tmpForward.lengthSq() < 0.01) tmpForward.set(0, 0, -1);
  tmpForward.normalize();
  tmpRight.crossVectors(tmpForward, UP).normalize();
}
/** The body being dragged, or null if it was removed (e.g. consumed in a collision) mid-drag. */
function liveDragBody() {
  if (app.dragBody && !bodies.includes(app.dragBody)) {
    app.dragBody = null;
    app.historyBeforeDrag = null;
    clearGuides();
  }
  return app.dragBody;
}
function setPointer(e: MouseEvent | PointerEvent | WheelEvent) {
  const r = renderer.domElement.getBoundingClientRect();
  pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, (-(e.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  raycaster.ray.intersectPlane(plane, world);
}
function fromHit(o: THREE.Object3D) {
  return (
    bodies.find(b => {
      let x: THREE.Object3D | null = o;
      while (x && x !== b.mesh) x = x.parent;
      return x === b.mesh;
    }) ?? null
  );
}
function bodyAtPointer() {
  const hits = raycaster.intersectObjects(
    bodies.map(b => b.mesh),
    true,
  );
  return hits.length ? fromHit(hits[0].object) : null;
}

function beginTouchGesture() {
  const points = [...activePointers.values()].slice(0, 2),
    dx = points[1].x - points[0].x,
    dy = points[1].y - points[0].y;
  if (app.longPressTimer) {
    clearTimeout(app.longPressTimer);
    app.longPressTimer = 0;
  }
  app.panning = false;
  container.classList.remove('dragging');
  app.dragBody = null;
  app.pendingTouchPlacement = null;
  app.longPressBody = null;
  clearGuides();
  app.touchGesture = {
    distance: Math.max(1, Math.hypot(dx, dy)),
    center: new THREE.Vector2((points[0].x + points[1].x) / 2, (points[0].y + points[1].y) / 2),
    camera: camera.position.clone(),
    target: viewTarget.clone(),
  };
}

export function bindPointerEvents() {
  renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
  renderer.domElement.addEventListener('pointerdown', e => {
    noteActivity();
    app.cameraTransition = null;
    setPointer(e);
    const hit = bodyAtPointer();
    if (e.pointerType === 'touch') {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType });
      renderer.domElement.setPointerCapture(e.pointerId);
      if (activePointers.size >= 2) {
        beginTouchGesture();
        return;
      }
    }
    if (e.button === 2) {
      closeObjectMenu();
      app.panning = true;
      app.didPan = false;
      app.rightContextBody = hit;
      panStart.set(e.clientX, e.clientY);
      camStart.copy(camera.position);
      targetStart.copy(viewTarget);
      container.classList.add('dragging');
      renderer.domElement.setPointerCapture(e.pointerId);
      return;
    }
    if (e.button !== 0) return;
    if (app.navigationMode) {
      closeObjectMenu();
      app.panning = true;
      app.didPan = false;
      app.rightContextBody = null;
      panStart.set(e.clientX, e.clientY);
      camStart.copy(camera.position);
      targetStart.copy(viewTarget);
      container.classList.add('dragging');
      if (!renderer.domElement.hasPointerCapture(e.pointerId)) renderer.domElement.setPointerCapture(e.pointerId);
      return;
    }
    closeObjectMenu();
    app.longPressTriggered = false;
    app.longPressBody = app.placementMode ? null : hit;
    app.historyBeforeDrag = null;
    panStart.set(e.clientX, e.clientY);
    app.didDrag = false;
    if (app.placementMode) {
      if (e.pointerType === 'touch')
        app.pendingTouchPlacement = {
          pointerId: e.pointerId,
          screen: new THREE.Vector2(e.clientX, e.clientY),
          world: world.clone(),
        };
      else {
        const placed = placeSelected(world.clone());
        if (app.selectedBuilder === 'body') {
          app.dragBody = placed;
          dragStart.copy(placed.mesh.position);
          dragPoint.copy(placed.mesh.position);
        } else app.dragBody = null;
      }
    } else if (hit) {
      select(hit);
      app.dragBody = hit.locked ? null : hit;
      if (app.dragBody) app.historyBeforeDrag = snapshotUniverse();
      dragStart.copy(hit.mesh.position);
      dragPoint.copy(world);
      app.longPressTimer = window.setTimeout(() => {
        if (app.longPressBody === hit && !app.didDrag) {
          app.longPressTriggered = true;
          app.dragBody = null;
          app.historyBeforeDrag = null;
          openObjectMenu(hit, e.clientX, e.clientY);
        }
      }, 550);
    } else select(null);
    if (!renderer.domElement.hasPointerCapture(e.pointerId)) renderer.domElement.setPointerCapture(e.pointerId);
  });
  renderer.domElement.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' && activePointers.has(e.pointerId)) {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType });
      if (app.touchGesture && activePointers.size >= 2) {
        const points = [...activePointers.values()].slice(0, 2),
          dx = points[1].x - points[0].x,
          dy = points[1].y - points[0].y,
          distance = Math.max(1, Math.hypot(dx, dy)),
          center = tmpCenter.set((points[0].x + points[1].x) / 2, (points[0].y + points[1].y) / 2),
          zoom = THREE.MathUtils.clamp(app.touchGesture.distance / distance, 0.22, 4.5),
          offset = tmpOffset.copy(app.touchGesture.camera).sub(app.touchGesture.target).multiplyScalar(zoom),
          panScale = offset.length() * 0.0015;
        groundAxes();
        viewTarget
          .copy(app.touchGesture.target)
          .addScaledVector(tmpRight, -(center.x - app.touchGesture.center.x) * panScale)
          .addScaledVector(tmpForward, (center.y - app.touchGesture.center.y) * panScale);
        camera.position
          .copy(viewTarget)
          .add(offset.setLength(THREE.MathUtils.clamp(offset.length(), MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE)));
        camera.lookAt(viewTarget);
        return;
      }
      if (
        app.placementMode &&
        app.pendingTouchPlacement?.pointerId === e.pointerId &&
        activePointers.size === 1 &&
        Math.hypot(e.clientX - app.pendingTouchPlacement.screen.x, e.clientY - app.pendingTouchPlacement.screen.y) >
          8 &&
        app.selectedBuilder === 'body'
      ) {
        app.dragBody = placeSelected(app.pendingTouchPlacement.world.clone());
        dragStart.copy(app.dragBody.mesh.position);
        setPointer(e);
        dragPoint.copy(world);
        app.pendingTouchPlacement = null;
        app.didDrag = true;
      }
    }
    if (app.panning) {
      const dx = e.clientX - panStart.x,
        dy = e.clientY - panStart.y;
      app.didPan ||= Math.hypot(dx, dy) > 4;
      if (app.didPan) {
        const distance = camera.position.distanceTo(viewTarget);
        groundAxes();
        const shift = tmpOffset
          .copy(tmpRight)
          .multiplyScalar(-dx * distance * 0.00145)
          .addScaledVector(tmpForward, dy * distance * 0.00145);
        viewTarget.copy(targetStart).add(shift);
        camera.position.copy(camStart).add(shift);
        camera.lookAt(viewTarget);
      }
      return;
    }
    if (app.longPressTimer && Math.hypot(e.clientX - panStart.x, e.clientY - panStart.y) > 7) {
      clearTimeout(app.longPressTimer);
      app.longPressTimer = 0;
      app.longPressBody = null;
    }
    const dragBody = liveDragBody();
    if (!dragBody) return;
    setPointer(e);
    dragPoint.copy(world);
    app.didDrag ||= dragPoint.distanceTo(dragStart) > 0.35;
    if (app.didDrag && app.longPressTimer) {
      clearTimeout(app.longPressTimer);
      app.longPressTimer = 0;
      app.longPressBody = null;
    }
    dragBody.mesh.position.copy(world);
    if (app.orbitMode) showGuides(dragBody);
  });
  renderer.domElement.addEventListener('pointerup', e => {
    if (e.pointerType === 'touch') activePointers.delete(e.pointerId);
    if (app.touchGesture) {
      if (activePointers.size < 2) app.touchGesture = null;
      app.pendingTouchPlacement = null;
      app.dragBody = null;
      app.historyBeforeDrag = null;
      clearGuides();
      if (renderer.domElement.hasPointerCapture(e.pointerId)) renderer.domElement.releasePointerCapture(e.pointerId);
      return;
    }
    if (app.pendingTouchPlacement?.pointerId === e.pointerId) {
      setPointer(e);
      placeSelected(world.clone());
      app.pendingTouchPlacement = null;
      if (renderer.domElement.hasPointerCapture(e.pointerId)) renderer.domElement.releasePointerCapture(e.pointerId);
      return;
    }
    if (app.longPressTimer) {
      clearTimeout(app.longPressTimer);
      app.longPressTimer = 0;
    }
    app.longPressBody = null;
    if (app.panning) {
      app.panning = false;
      container.classList.remove('dragging');
      if (!app.didPan && app.rightContextBody) openObjectMenu(app.rightContextBody, e.clientX, e.clientY);
      app.rightContextBody = null;
    } else if (app.longPressTriggered) {
      app.longPressTriggered = false;
      app.dragBody = null;
      app.historyBeforeDrag = null;
    } else if (liveDragBody()) {
      const dragBody = app.dragBody!;
      // A plain click only selects: velocity and history change only when the body was actually dragged.
      if (app.didDrag) {
        if (app.historyBeforeDrag) recordHistory(app.historyBeforeDrag);
        if (!(app.orbitMode && snapOrbit(dragBody)))
          dragBody.velocity.copy(dragStart).sub(dragPoint).multiplyScalar(0.55);
      }
      app.dragBody = null;
      app.historyBeforeDrag = null;
    }
    clearGuides();
    if (renderer.domElement.hasPointerCapture(e.pointerId)) renderer.domElement.releasePointerCapture(e.pointerId);
  });
  renderer.domElement.addEventListener('pointercancel', e => {
    activePointers.delete(e.pointerId);
    app.touchGesture = null;
    app.pendingTouchPlacement = null;
    app.dragBody = null;
    app.historyBeforeDrag = null;
    app.panning = false;
    clearGuides();
    if (app.longPressTimer) {
      clearTimeout(app.longPressTimer);
      app.longPressTimer = 0;
    }
  });
  renderer.domElement.addEventListener(
    'wheel',
    e => {
      noteActivity();
      app.cameraTransition = null;
      e.preventDefault();
      setPointer(e);
      zoomCamera(Math.exp(e.deltaY * 0.0018), world.clone());
    },
    { passive: false },
  );
  renderer.domElement.addEventListener('dblclick', e => {
    if (app.placementMode) return;
    setPointer(e);
    const hit = bodyAtPointer();
    if (hit) {
      select(hit);
      focusSelected();
      toast(`Focused ${hit.name}`);
    }
  });
}

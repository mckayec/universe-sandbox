// Read-only test probe for rendered evidence harnesses (simulator-clarity SC4-E1). Installed only when the page URL
// carries `?probe=1`; it adds no visible UI and cannot change the simulation.
import * as THREE from 'three';
import { app, bodies, matterStreams, undoStack } from '../state/app-state.ts';
import { camera, renderer } from '../scene/setup.ts';
import type { Body } from '../state/types.ts';
import { diskEncounterOf, transferDiskEncounterOf } from '../visuals/disk-encounters.ts';

export type ProbeSnapshot = {
  paused: boolean;
  speed: number;
  kidsMode: boolean;
  kidsArmed: boolean;
  placementMode: boolean;
  feedbackMode: string;
  undoDepth: number;
  selectedId: number | null;
  bodies: {
    id: number;
    kind: string;
    name: string;
    tide: number | null;
    stretch: number;
    position: [number, number, number];
    /** Client-pixel position of the body's centre (for tap tests). */
    screen: [number, number];
    spin: number;
    keyLightId: number | null;
    keyDir: [number, number, number] | null;
  }[];
  transferDisks: { donorId: number; receiverId: number; visible: boolean; tide: number | null; cut: number | null }[];
};

function keyDirOf(b: Body): [number, number, number] | null {
  let dir: [number, number, number] | null = null;
  b.mesh.traverse(o => {
    const material = (o as THREE.Mesh).material;
    if (!dir && material instanceof THREE.ShaderMaterial && material.uniforms.keyDir) {
      const v = material.uniforms.keyDir.value as THREE.Vector3;
      dir = [v.x, v.y, v.z];
    }
  });
  return dir;
}

function screenOf(b: Body): [number, number] {
  const p = b.mesh.getWorldPosition(new THREE.Vector3()).project(camera),
    r = renderer.domElement.getBoundingClientRect();
  return [r.left + ((p.x + 1) / 2) * r.width, r.top + ((1 - p.y) / 2) * r.height];
}

export function probeSnapshot(): ProbeSnapshot {
  return {
    paused: app.paused,
    speed: app.speed,
    kidsMode: app.kidsMode,
    kidsArmed: app.kidsArmed,
    placementMode: app.placementMode,
    feedbackMode: app.feedbackMode,
    undoDepth: undoStack.length,
    selectedId: app.selectedBody?.id ?? null,
    bodies: bodies.map(b => ({
      id: b.id,
      kind: b.kind,
      name: b.name,
      tide: diskEncounterOf(b)?.strength ?? null,
      stretch: b.tidalStretch,
      position: [b.mesh.position.x, b.mesh.position.y, b.mesh.position.z],
      screen: screenOf(b),
      spin: b.spinAngle ?? 0,
      keyLightId: (b.mesh.userData.keyLightId as number | null | undefined) ?? null,
      keyDir: keyDirOf(b),
    })),
    transferDisks: [...matterStreams.values()].map(s => {
      const e = transferDiskEncounterOf(s);
      return {
        donorId: s.donorId,
        receiverId: s.receiverId,
        visible: s.outerDisk.visible,
        tide: e?.strength ?? null,
        cut: e?.cut ?? null,
      };
    }),
  };
}

/** Expose `window.__sandboxProbe()` when the URL asks for it. Called once from main.ts. */
export function installTestProbe() {
  if (new URLSearchParams(location.search).get('probe') !== '1') return;
  (window as unknown as { __sandboxProbe?: () => ProbeSnapshot }).__sandboxProbe = probeSnapshot;
}

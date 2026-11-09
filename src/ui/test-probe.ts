// Read-only test probe for rendered evidence harnesses (simulator-clarity SC4-E1). Installed only when the page URL
// carries `?probe=1`; it adds no visible UI and cannot change the simulation.
import { app, bodies, matterStreams } from '../state/app-state.ts';
import { diskEncounterOf, transferDiskEncounterOf } from '../visuals/disk-encounters.ts';

export type ProbeSnapshot = {
  paused: boolean;
  speed: number;
  selectedId: number | null;
  bodies: { id: number; kind: string; name: string; tide: number | null }[];
  transferDisks: { donorId: number; receiverId: number; visible: boolean; tide: number | null; cut: number | null }[];
};

export function probeSnapshot(): ProbeSnapshot {
  return {
    paused: app.paused,
    speed: app.speed,
    selectedId: app.selectedBody?.id ?? null,
    bodies: bodies.map(b => ({ id: b.id, kind: b.kind, name: b.name, tide: diskEncounterOf(b)?.strength ?? null })),
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

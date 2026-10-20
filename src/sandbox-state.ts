export type SavedBody = {
  id: number;
  kind: string;
  name: string;
  variant: number;
  mass: number;
  birthMass: number;
  radius: number;
  position: [number, number, number];
  velocity: [number, number, number];
  locked: boolean;
  buildLocked: boolean;
  age: number;
  stage?: string;
  stageAge: number;
  nebulaTimer: number;
  hostId?: number;
  protoAngle: number;
  protoOrbit: number;
  protoDrift: number;
  lifeScore: number;
  lifeLevel: string;
  habitabilityShock: number;
  habitatStatus: string;
  surfaceTemperature?: number;
  atmosphere?: number;
  water?: number;
  magnetosphere?: number;
  lastEvent: string;
  groupId?: number;
};

export type SavedCosmicGroup = {
  id: number;
  name: string;
  kind: 'system' | 'galaxy' | 'binary';
  bodyIds: number[];
};

export type SandboxSnapshot = {
  version: 1;
  elapsed: number;
  gravity: number;
  nextId: number;
  nextGroupId: number;
  bodies: SavedBody[];
  groups: SavedCosmicGroup[];
  camera: [number, number, number];
  target: [number, number, number];
};

const STORAGE_KEY = 'gravity-lab-universe-v1';
const RECOVERY_KEY = 'gravity-lab-recovery-v1';

export function saveUniverse(snapshot: SandboxSnapshot) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

export function loadUniverse(): SandboxSnapshot | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SandboxSnapshot;
    return parsed.version === 1 && Array.isArray(parsed.bodies) ? parsed : null;
  } catch {
    return null;
  }
}

export function hasSavedUniverse() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function saveRecoverySnapshot(snapshot: SandboxSnapshot) {
  try {
    localStorage.setItem(RECOVERY_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

export function loadRecoverySnapshot(): SandboxSnapshot | null {
  try {
    const raw = localStorage.getItem(RECOVERY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SandboxSnapshot;
    return parsed.version === 1 && Array.isArray(parsed.bodies) ? parsed : null;
  } catch {
    return null;
  }
}

export function hasRecoverySnapshot() {
  try {
    return localStorage.getItem(RECOVERY_KEY) !== null;
  } catch {
    return false;
  }
}

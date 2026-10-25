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
  artificial?: string;
  warpBoost?: number;
  exhibitSystemId?: number;
  holdStage?: boolean;
  satelliteHostId?: number;
  satelliteOrbit?: number;
  satelliteAngle?: number;
  satelliteRate?: number;
  exhibitAnchor?: boolean;
  stageTransition?: { from: string; to: string; age: number; duration: number };
  debris?: boolean;
  tidalStrain?: number;
};

export type SavedCosmicGroup = {
  id: number;
  name: string;
  kind: 'system' | 'galaxy' | 'binary' | 'triple';
  bodyIds: number[];
  style?: 'spiral' | 'lenticular' | 'elliptical' | 'irregular' | 'globular';
  anchorId?: number;
  haloMass?: number;
  /** Seed for the procedural galaxy picture (arm pattern, bar, dust); absent in older saves. */
  visualSeed?: number;
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
  /** Guided exhibit that was running, so undo inside an exhibit keeps its behavior (optional, v1-compatible). */
  exhibit?: string;
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

const finite = (value: unknown) => typeof value === 'number' && Number.isFinite(value);
const finiteVector = (value: unknown) => Array.isArray(value) && value.length === 3 && value.every(finite);

/**
 * Drops saved bodies a restore could not rebuild (unknown kind or star stage, non-finite numbers), so a corrupt or
 * future-version save can't crash halfway through a restore. Returns the usable bodies and how many were dropped.
 */
export function validateSavedBodies(
  saved: readonly SavedBody[],
  knownKinds: ReadonlySet<string>,
  knownStages: ReadonlySet<string>,
) {
  const valid: SavedBody[] = [],
    ids = new Set<number>();
  for (const body of saved) {
    if (
      !body ||
      typeof body !== 'object' ||
      !finite(body.id) ||
      ids.has(body.id) ||
      !knownKinds.has(body.kind) ||
      (body.kind === 'star' && body.stage !== undefined && !knownStages.has(body.stage)) ||
      !finite(body.mass) ||
      body.mass <= 0 ||
      !finite(body.birthMass) ||
      body.birthMass <= 0 ||
      !finiteVector(body.position) ||
      !finiteVector(body.velocity)
    )
      continue;
    const transition = body.stageTransition;
    if (
      transition &&
      (!knownStages.has(transition.from) ||
        !knownStages.has(transition.to) ||
        !finite(transition.age) ||
        !finite(transition.duration))
    )
      valid.push({ ...body, stageTransition: undefined });
    else valid.push(body);
    ids.add(body.id);
  }
  return { bodies: valid, dropped: saved.length - valid.length };
}

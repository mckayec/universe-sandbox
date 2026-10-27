// Shared type definitions for bodies, groups, streams and other simulation records.
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { type StellarStage } from '../simulation-model.ts';
import { type SavedCosmicGroup } from '../sandbox-state.ts';
import { type Kind } from '../celestial-catalog.ts';

export type Stage = StellarStage;
export type LifeLevel = 'none' | 'habitable' | 'microbial' | 'simple' | 'complex' | 'technological';
export type StellarTransition = { from: Stage; to: Stage; age: number; duration: number };
export type Body = {
  id: number;
  name: string;
  mesh: THREE.Group;
  label: CSS2DObject;
  velocity: THREE.Vector3;
  mass: number;
  birthMass: number;
  radius: number;
  kind: Kind;
  variant: number;
  locked: boolean;
  buildLocked: boolean;
  age: number;
  stage?: Stage;
  stageAge: number;
  stageTransition?: StellarTransition;
  nebulaTimer: number;
  accretionFx: number;
  nebulaTidal: number;
  nebulaCompression: number;
  nebulaAngle: number;
  nebulaContactId?: number;
  hostId?: number;
  protoAngle: number;
  protoOrbit: number;
  protoDrift: number;
  tidalStretch: number;
  tidalAngle: number;
  spinAngle?: number;
  /** Preset exhibit system (Solar System, galaxy, guided exhibit) this body belongs to; see sameExhibitSystem. */
  exhibitSystemId?: number;
  /** The body its exhibit system orbits (Sun, central black hole): members don't tug it. */
  exhibitAnchor?: boolean;
  holdStage?: boolean;
  satelliteHostId?: number;
  satelliteOrbit?: number;
  satelliteAngle?: number;
  satelliteRate?: number;
  tidalVisualAngle?: number;
  tidalPartnerId?: number;
  /** Accumulated Roche-limit strain in [0, 1] (tidal disruption). */
  tidalStrain?: number;
  /** The "Roche limit crossed" warning has been shown for the current strain episode. */
  tidalWarned?: boolean;
  /** Fragment of a tidal disruption: label hidden and brief immunity from merging with sibling debris. */
  debris?: boolean;
  /** Receiver id → app.elapsed when this donor's tidal transfer toward it was last announced (not saved). */
  tidalAnnounced?: Map<number, number>;
  /** Being stripped and swallowed gradually by a black hole or pulsar (see physics/infall.ts; not saved). */
  infall?: {
    eaterId: number;
    age: number;
    duration: number;
    startMass: number;
    startRadius: number;
    angle: number;
    sense: number;
    heldStage: boolean;
  };
  /** Set by removeBody so loops over a stale copy of `bodies` can skip it. */
  removed?: boolean;
  lifeScore: number;
  lifeLevel: LifeLevel;
  habitabilityShock: number;
  habitatStatus: string;
  surfaceTemperature: number;
  atmosphere: number;
  water: number;
  magnetosphere: number;
  collisionCooldown: number;
  lastEvent: string;
  artificial?: 'worldship' | 'warship';
  warpBoost?: number;
};
export type OrbitGuide = { mesh: THREE.LineLoop; center: Body; radius: number };
export type Transient = {
  object: THREE.Object3D;
  age: number;
  duration: number;
  update: (life: number, dt: number) => void;
};
export type Trail = { line: THREE.Line; points: THREE.Vector3[]; accumulator: number };
export type MatterStream = {
  key: string;
  donorId: number;
  receiverId: number;
  kind: 'nebula' | 'plasma' | 'debris';
  group: THREE.Group;
  ribbon: THREE.Mesh;
  line: THREE.Line;
  points: THREE.Points;
  disk: THREE.Mesh;
  outerDisk: THREE.Mesh;
  flare: THREE.Sprite;
  donorFlare: THREE.Sprite;
  phases: Float32Array;
  intensity: number;
  lastActive: number;
  /** Orbit sense of the gas in the receiver's disk frame (+1 counter-clockwise), fixed when the stream forms. */
  flowSign?: number;
  spinApplied?: boolean;
  diskScale?: number;
};
export type ExhibitEvent = { title: string; detail: string; color: string };
export type PointerSample = { x: number; y: number; type: string };
export type TouchGesture = { distance: number; center: THREE.Vector2; camera: THREE.Vector3; target: THREE.Vector3 };
export type GalaxyStyle = 'spiral' | 'lenticular' | 'elliptical' | 'irregular' | 'globular';
export type PlacementBuilder = 'body' | 'system' | 'binary' | 'triple' | `galaxy-${GalaxyStyle}`;
export type CosmicGroup = SavedCosmicGroup;
/** Tracer stars of a galaxy that has been disturbed: they now move individually in world space. */
export type GalaxyLive = {
  n: number;
  x: Float32Array;
  z: Float32Array;
  vx: Float32Array;
  vz: Float32Array;
  y: Float32Array;
  layers: Array<{ points: THREE.Points; offset: number; count: number }>;
  holder: THREE.Group;
  age: number;
  /** Rotating subset to advance next, and the simulated time each subset has waited (see galaxy-motion.ts). */
  phase: number;
  pending: number[];
};
export type GalaxyVisual = {
  groupId: number;
  anchorId: number;
  /** The core the picture was built around; a different anchorId means the galaxy lost or swapped its core. */
  originalAnchorId: number;
  style: GalaxyStyle;
  extent: number;
  object: THREE.Group;
  live?: GalaxyLive;
};
export type ScienceMode = 'off' | 'orbits' | 'full';
export type QualityMode = 'auto' | 'high' | 'low';
export type CameraTransition = {
  fromPosition: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toPosition: THREE.Vector3;
  toTarget: THREE.Vector3;
  age: number;
  duration: number;
};
/** A scripted warp sequence (Fall of Gododdin): ships that arrive from warp on a timeline, and ships still to die. */
export type WarpScript = {
  time: number;
  worldId: number;
  stage: number;
  strikeId?: number;
  kills: Array<{ at: number; id: number }>;
  /** Last position of the body the camera is riding along with (the planet, then the worldship inside it). */
  focus?: { id: number; x: number; z: number };
};

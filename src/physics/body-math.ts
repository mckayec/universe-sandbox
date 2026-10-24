// Small pure helpers: ignition thresholds, habitable range, life levels, seeded noise, formatting, spin.
import * as THREE from 'three';
import { stellarBirthStage } from '../simulation-model.ts';
import {
  BLACK_HOLE_VARIANTS,
  DWARF_VARIANTS,
  GAS_VARIANTS,
  MOON_VARIANTS,
  NEBULA_VARIANTS,
  ROCKY_VARIANTS,
  TYPES,
} from '../celestial-catalog.ts';
import type { Body, LifeLevel, Stage } from '../state/types.ts';

export function brownIgnitionMass(b: Body) {
  return 150 + (b.id % 3) * 12;
}
export function protoIgnitionMass(b: Body) {
  return 145 + (b.id % 4) * 18;
}
export function ignitionStage(mass: number): Stage {
  return stellarBirthStage(mass);
}
export function stellarEvolutionRate(b: Body) {
  return THREE.MathUtils.clamp(Math.pow(Math.max(0.15, b.mass / 210), 0.33), 0.72, 3.25);
}
export function habitableRange(star: Body) {
  const ranges: Record<Stage, [number, number]> = {
      'red dwarf': [5.2, 8.2],
      'yellow star': [9, 15],
      'white star': [12, 20],
      'blue star': [17, 27],
      giant: [22, 34],
      hypergiant: [28, 42],
      'white dwarf': [2.2, 3.8],
    },
    base = ranges[star.stage ?? 'red dwarf'],
    massFactor = THREE.MathUtils.clamp(Math.sqrt(star.mass / 210), 0.7, 2);
  return { inner: base[0] * massFactor, outer: base[1] * massFactor };
}
export function lifeFromScore(score: number): LifeLevel {
  return score >= 55
    ? 'technological'
    : score >= 28
      ? 'complex'
      : score >= 12
        ? 'simple'
        : score >= 3
          ? 'microbial'
          : score > 0.25
            ? 'habitable'
            : 'none';
}
export function seeded(seed: number, salt = 0) {
  const n = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}
export function formatMass(mass: number) {
  return mass < 1 ? mass.toFixed(2) : mass < 10 ? mass.toFixed(1) : mass.toFixed(0);
}
export function planetSubtype(b: Body) {
  return b.kind === 'rocky'
    ? ROCKY_VARIANTS[b.variant % ROCKY_VARIANTS.length]
    : b.kind === 'gas'
      ? GAS_VARIANTS[b.variant % GAS_VARIANTS.length]
      : b.kind === 'moon'
        ? MOON_VARIANTS[b.variant % MOON_VARIANTS.length]
        : b.kind === 'dwarf'
          ? DWARF_VARIANTS[b.variant % DWARF_VARIANTS.length]
          : b.kind === 'blackhole'
            ? BLACK_HOLE_VARIANTS[b.variant % BLACK_HOLE_VARIANTS.length]
            : b.kind === 'nebula'
              ? NEBULA_VARIANTS[b.variant % NEBULA_VARIANTS.length]
              : TYPES[b.kind].label;
}
export function spinRate(b: Body) {
  return b.kind === 'pulsar'
    ? 3.8
    : b.kind === 'gas'
      ? 0.55
      : b.kind === 'rocky'
        ? 0.42
        : b.kind === 'dwarf'
          ? 0.3
          : b.kind === 'moon'
            ? 0.14
            : b.kind === 'asteroid'
              ? 0.6
              : b.kind === 'comet'
                ? 0.3
                : b.kind === 'brown'
                  ? 0.35
                  : b.kind === 'star'
                    ? 0.12
                    : b.kind === 'blackhole'
                      ? 0
                      : 0.25;
}

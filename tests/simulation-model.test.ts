import assert from 'node:assert/strict';
import test from 'node:test';
import {
  collisionRegime,
  habitabilityQuality,
  momentumWeightedVelocity,
  nextStellarStep,
  stellarBirthStage,
  stellarTrackForMass,
} from '../src/simulation-model.ts';
import { EXHIBITS, exhibitById } from '../src/exhibits.ts';

test('stellar tracks branch by accumulated mass', () => {
  assert.equal(stellarTrackForMass(150), 'low-mass');
  assert.equal(stellarTrackForMass(210), 'sun-like');
  assert.equal(stellarTrackForMass(270), 'hot-intermediate');
  assert.equal(stellarTrackForMass(420), 'massive');
  assert.equal(stellarBirthStage(420), 'blue star');
});

test('only the massive track ends in a supernova', () => {
  assert.deepEqual(nextStellarStep(210, 'giant'), {
    action: 'evolve',
    track: 'sun-like',
    next: 'white dwarf',
  });
  assert.equal(nextStellarStep(210, 'white dwarf').action, 'stable');
  assert.equal(nextStellarStep(420, 'hypergiant').action, 'supernova');
});

test('collision regimes distinguish grazing and destructive impacts', () => {
  assert.equal(collisionRegime('rocky', 'rocky', 7, 0.2), 'fragment');
  assert.equal(collisionRegime('gas', 'rocky', 6, 0.2), 'strip');
  assert.equal(collisionRegime('rocky', 'gas', 3, 0.9), 'grazing');
  assert.equal(collisionRegime('rocky', 'rocky', 1, 0.1), 'accrete');
});

test('accretion carries momentum into an unlocked receiver', () => {
  const result = momentumWeightedVelocity([0.4, 0, 0], 600, [-6, 0, 2], 30);
  assert.ok(Math.abs(result[0]) > 0.0001);
  assert.ok(Math.abs(result[2]) > 0.0001);
  assert.deepEqual(momentumWeightedVelocity(result, 630, [0, 0, 0], 0), result);
});

test('habitability rewards an ocean world and reacts to impacts', () => {
  const calm = habitabilityQuality({
    planetMass: 10,
    variant: 3,
    stellarQuality: 1,
    stellarHazard: 0,
    compactStarPenalty: 0,
    impactShock: 0,
  });
  const shocked = habitabilityQuality({
    planetMass: 10,
    variant: 3,
    stellarQuality: 1,
    stellarHazard: 0,
    compactStarPenalty: 0,
    impactShock: 0.7,
  });
  assert.ok(calm.quality > 0.9);
  assert.ok(shocked.quality < calm.quality);
  assert.match(shocked.summary, /impact/i);
});

test('guided exhibits have unique ids and educational objectives', () => {
  assert.equal(new Set(EXHIBITS.map(exhibit => exhibit.id)).size, EXHIBITS.length);
  assert.ok(EXHIBITS.every(exhibit => exhibit.objective.length > 30));
  assert.equal(exhibitById('feed-black-hole').title, 'Feed a Black Hole');
});

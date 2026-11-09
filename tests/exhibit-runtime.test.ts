import assert from 'node:assert/strict';
import test from 'node:test';
import {
  evolutionFactor,
  frameTiming,
  MAX_FRAME_STEP,
  PerformanceMonitor,
  transferFactor,
} from '../src/exhibit-runtime.ts';
import { planetClimate } from '../src/planet-climate.ts';

test('science modes deliberately slow evolution and accretion', () => {
  assert.ok(evolutionFactor('exhibit') > evolutionFactor('educational'));
  assert.ok(evolutionFactor('educational') > evolutionFactor('realistic'));
  assert.ok(transferFactor('exhibit') > transferFactor('educational'));
  assert.ok(transferFactor('educational') > transferFactor('realistic'));
});

test('planet climate responds to stellar flux, atmosphere, and impacts', () => {
  const calm = planetClimate({ mass: 10, variant: 3, stellarFlux: 1, radiationHazard: 0, impactShock: 0 });
  const hot = planetClimate({ mass: 10, variant: 3, stellarFlux: 7, radiationHazard: 0.2, impactShock: 0 });
  const shocked = planetClimate({ mass: 10, variant: 3, stellarFlux: 1, radiationHazard: 0, impactShock: 0.8 });
  assert.ok(calm.temperature > 240 && calm.temperature < 340);
  assert.ok(hot.temperature > calm.temperature);
  assert.ok(shocked.atmosphere < calm.atmosphere);
  assert.match(shocked.summary, /impact/i);
});

test('performance monitor reports an averaged frame rate', () => {
  const monitor = new PerformanceMonitor();
  let reported = false;
  for (let i = 0; i < 60; i++) reported ||= monitor.update(1 / 60, i === 0);
  assert.equal(reported, true);
  assert.ok(monitor.fps >= 59 && monitor.fps <= 61);
  assert.equal(monitor.droppedFrames, 1);
});

test('frame timing measures real frames honestly but caps the simulation step', () => {
  const slow = frameTiming(0.1);
  assert.equal(slow.measured, 0.1);
  assert.equal(slow.step, MAX_FRAME_STEP);
  const monitor = new PerformanceMonitor();
  for (let i = 0; i < 11; i++) monitor.update(frameTiming(0.1).measured!);
  assert.equal(monitor.fps, 10);
  const stall = frameTiming(4);
  assert.equal(stall.measured, null);
  assert.equal(stall.step, MAX_FRAME_STEP);
  for (const bad of [Number.NaN, Number.POSITIVE_INFINITY, -1, 0]) {
    const t = frameTiming(bad);
    assert.equal(t.measured, null);
    assert.equal(t.step, 0);
  }
});

test('performance monitor reset discards a partial window', () => {
  const monitor = new PerformanceMonitor();
  for (let i = 0; i < 30; i++) monitor.update(0.02);
  monitor.reset();
  let reported = false;
  for (let i = 0; i < 60 && !reported; i++) reported = monitor.update(1 / 60);
  assert.equal(reported, true);
  assert.ok(monitor.fps >= 59 && monitor.fps <= 61);
});

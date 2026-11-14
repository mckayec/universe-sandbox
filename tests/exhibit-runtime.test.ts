import assert from 'node:assert/strict';
import test from 'node:test';
import {
  adaptiveQualitySample,
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
  // A long foreground frame is still rendering time: duration alone never marks an interruption.
  const long = frameTiming(4);
  assert.equal(long.measured, 4);
  assert.equal(long.step, MAX_FRAME_STEP);
  for (const bad of [Number.NaN, Number.POSITIVE_INFINITY, -1, 0]) {
    const t = frameTiming(bad);
    assert.equal(t.measured, null);
    assert.equal(t.step, 0);
  }
});

test('only an explicit visibility interruption drops a measurement', () => {
  const t = frameTiming(0.6, true);
  assert.equal(t.measured, null);
  assert.equal(t.step, MAX_FRAME_STEP);
  assert.equal(frameTiming(0.01, true).step, 0.01);
});

/** Feed a foreground trace through the loop's own sampling predicate, as animate() does. */
function runTrace(deltas: number[], mode = 'auto', interruptedAt = new Set<number>()) {
  const monitor = new PerformanceMonitor(),
    window = { timer: 0, frames: 0 };
  let scale = 0.8,
    updates = 0,
    raises = 0,
    steps = 0;
  deltas.forEach((delta, i) => {
    const timing = frameTiming(delta, interruptedAt.has(i));
    steps = Math.max(steps, timing.step);
    if (timing.measured === null) return;
    const target = adaptiveQualitySample(window, timing.measured, scale, 0.62, mode);
    if (target !== null) {
      if (target > scale) raises++;
      scale = target;
    }
    if (monitor.update(timing.measured)) updates++;
  });
  const wall = deltas.length / deltas.reduce((a, b) => a + b, 0);
  return { fps: monitor.fps, scale, updates, raises, steps, wall };
}

test('sustained slow foreground frames read slow and lower quality', () => {
  const r = runTrace(Array(20).fill(0.6));
  assert.ok(r.updates > 0);
  assert.ok(r.fps <= 2);
  assert.ok(r.scale < 0.8);
  assert.equal(r.raises, 0);
  assert.ok(r.steps <= MAX_FRAME_STEP);
});

test('alternating short and long frames never look fast or raise quality', () => {
  const r = runTrace(Array.from({ length: 400 }, (_, i) => (i % 2 ? 0.6 : 1 / 60)));
  assert.ok(r.wall < 4);
  assert.ok(r.fps <= 4, `reported ${r.fps} FPS`);
  assert.equal(r.raises, 0);
  assert.ok(r.scale < 0.8);
  assert.ok(r.steps <= MAX_FRAME_STEP);
});

test('a smooth 60 FPS trace may raise quality; manual quality never changes', () => {
  const smooth = Array(400).fill(1 / 60);
  assert.ok(runTrace(smooth).scale > 0.8);
  assert.equal(runTrace(smooth, 'high').scale, 0.8);
  assert.equal(runTrace(Array(20).fill(0.6), 'low').scale, 0.8);
});

test('a visibility interruption frame is excluded but later slow frames are not', () => {
  const deltas = [...Array(10).fill(1 / 60), 30, ...Array(20).fill(0.6)];
  const r = runTrace(deltas, 'auto', new Set([10]));
  assert.ok(r.fps <= 2);
  assert.ok(r.scale < 0.8);
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

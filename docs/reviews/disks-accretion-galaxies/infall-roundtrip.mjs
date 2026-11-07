// DAG01 browser check: save→load, undo/redo-style snapshot restore and eater removal during a slow-accretion
// capture, for an initially unheld star, an initially held star and a gas giant. Runs the real page modules in a
// headless page on a Vite dev server (same approach as tests/exhibit-stability.mjs).
//   CHROME_PATH=... node docs/reviews/disks-accretion-galaxies/infall-roundtrip.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const port = 4193,
  baseURL = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  stdio: 'ignore',
});
for (let i = 0; i < 300; i++) {
  try {
    if ((await fetch(baseURL)).ok) break;
  } catch {}
  await new Promise(r => setTimeout(r, 200));
}
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(baseURL);
await page.waitForTimeout(2500);
const report = await page.evaluate(async () => {
  const [state, history, registry, lifecycle, simulate] = await Promise.all([
    import('/src/state/app-state.ts'),
    import('/src/state/history.ts'),
    import('/src/bodies/registry.ts'),
    import('/src/bodies/lifecycle.ts'),
    import('/src/physics/simulate.ts'),
  ]);
  const { app, bodies } = state;
  const V = bodies[0].velocity.constructor;
  const step = s => {
    for (let i = 0, n = Math.round(s * 60); i < n; i++) {
      simulate.simulate(1 / 60);
      app.elapsed += 1 / 60;
    }
  };
  const out = [];
  for (const [kind, held, frac] of [
    ['star', false, 0.3],
    ['star', true, 0.6],
    ['gas', false, 0.5],
  ]) {
    history.resetSimulation();
    app.paused = true;
    const hole = registry.addBody('blackhole', new V(0, 0, 0), new V(0, 0, 0), { mass: 2000, locked: true });
    const food = registry.addBody(kind, new V(hole.radius * 1.2, 0, 0), new V(0, 0, 0), { holdStage: held || undefined });
    let t = 0;
    while (!food.infall && t < 20) {
      step(0.1);
      t += 0.1;
    }
    if (!food.infall) {
      out.push({ kind, held, captured: false });
      continue;
    }
    while (food.infall && food.infall.age / food.infall.duration < frac) step(0.1);
    const before = { ...food.infall, mass: food.mass, hold: food.holdStage, id: food.id };
    // Save → Load through JSON, as localStorage does.
    const snap = JSON.parse(JSON.stringify(history.snapshotUniverse()));
    history.restoreUniverse(snap);
    const again = bodies.find(b => b.id === before.id);
    const after = again && again.infall ? { ...again.infall, mass: again.mass, hold: again.holdStage } : null;
    // Continue: the capture finishes and the food is swallowed.
    step(60);
    const swallowed = !bodies.some(b => b.id === before.id);
    // Eater removed mid-capture: capture cancels and restores the original hold flag.
    history.restoreUniverse(snap);
    const food2 = bodies.find(b => b.id === before.id),
      hole2 = bodies.find(b => b.id === before.eaterId);
    lifecycle.removeBody(hole2);
    step(0.2);
    const cancelled = { infall: !!food2.infall, hold: food2.holdStage ?? false };
    // Missing eater in the save itself.
    const orphan = JSON.parse(JSON.stringify(snap));
    orphan.bodies = orphan.bodies.filter(b => b.id !== before.eaterId);
    history.restoreUniverse(orphan);
    const food3 = bodies.find(b => b.id === before.id);
    out.push({ kind, held, captured: true, before, after, swallowed, cancelled,
      orphan: { infall: !!food3.infall, hold: food3.holdStage ?? false } });
  }
  // Legacy save without the infall field.
  return out;
});
await browser.close();
server.kill();
let pass = 0;
for (const r of report) {
  const tag = `${r.kind} held=${r.held}`;
  assert.ok(r.captured, tag + ' captured');
  assert.ok(r.after, tag + ' infall survives save/load');
  for (const k of ['eaterId', 'age', 'duration', 'startMass', 'startRadius', 'angle', 'sense', 'heldStage', 'mass'])
    assert.equal(r.after[k], r.before[k], `${tag} ${k}`);
  assert.equal(r.after.heldStage, r.held, tag + ' original hold flag kept');
  assert.equal(r.after.hold, true, tag + ' capture hold active while resuming');
  assert.ok(r.swallowed, tag + ' capture completes after load');
  assert.deepEqual(r.cancelled, { infall: false, hold: r.held }, tag + ' eater removal restores hold');
  assert.deepEqual(r.orphan, { infall: false, hold: r.held }, tag + ' save without eater restores hold');
  pass += 14;
}
assert.deepEqual(errors, []);
console.log(`infall round trip: ${report.length} captures, ${pass} assertions pass`);
for (const r of report) console.log(` ${r.kind} held=${r.held}: u=${(r.before.age / r.before.duration).toFixed(2)} mass ${r.before.mass.toFixed(2)} → ${r.after.mass.toFixed(2)}, left ${(r.after.duration - r.after.age).toFixed(1)} s`);

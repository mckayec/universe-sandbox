// R2 browser check (PR43 head 0a43a4f): real Save/Load, recovery and snapshot restore with corrupt and
// inconsistent capture records, through the page's own modules and localStorage, in a headless page.
//   CHROME_PATH=... node docs/reviews/disks-accretion-galaxies/r2-load-fallback.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const port = 4194,
  baseURL = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' },
);
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
  const toastText = () => document.querySelector('#toast').textContent;
  const step = s => {
    for (let i = 0, n = Math.round(s * 60); i < n; i++) {
      simulate.simulate(1 / 60);
      app.elapsed += 1 / 60;
    }
  };
  // A universe with one captured star, saved through the real Save path.
  const captured = held => {
    history.resetSimulation();
    app.paused = true;
    const hole = registry.addBody('blackhole', new V(0, 0, 0), new V(0, 0, 0), { mass: 2000, locked: true });
    const food = registry.addBody('star', new V(hole.radius * 1.2, 0, 0), new V(0, 0, 0), {
      holdStage: held || undefined,
    });
    for (let t = 0; !food.infall && t < 20; t += 0.1) step(0.1);
    step(1);
    return { hole, food, snap: JSON.parse(JSON.stringify(history.snapshotUniverse())) };
  };
  // A different "current" universe that a refused load must keep.
  const current = () => {
    history.resetSimulation();
    for (let i = 0; i < 3; i++) registry.addBody('rocky', new V(40 + i * 15, 0, 0), new V(0, 0, 0), {});
    return bodies.map(b => b.id).join(',');
  };
  const out = [];
  const corruptions = {
    number: () => 7,
    string: () => 'x',
    false: () => false,
    array: () => [],
    empty: () => ({}),
    noHeld: r => ({ ...r, heldStage: undefined }),
    stringHeld: r => ({ ...r, heldStage: 'true' }),
  };
  for (const held of [false, true]) {
    const { snap, food } = captured(held);
    if (!food.infall) {
      out.push({ held, captured: false });
      continue;
    }
    for (const [name, make] of Object.entries(corruptions)) {
      for (const via of ['load', 'recovery', 'restore']) {
        const bad = JSON.parse(JSON.stringify(snap));
        const entry = bad.bodies.find(b => b.id === food.id);
        entry.infall = make(entry.infall);
        const ids = current();
        let ok;
        if (via === 'load') {
          localStorage.setItem('gravity-lab-universe-v1', JSON.stringify(bad));
          history.loadSavedUniverse();
        } else if (via === 'recovery') {
          localStorage.setItem('gravity-lab-recovery-v1', JSON.stringify(bad));
          history.recoverSession();
        } else ok = history.restoreUniverse(bad, history.snapshotUniverse());
        out.push({
          held,
          case: `${name}/${via}`,
          kept: bodies.map(b => b.id).join(',') === ids,
          toast: toastText(),
          ok,
          historyOn: app.historySuspended === false,
        });
      }
    }
    // Inconsistent but well-formed: top-level hold true/false/absent. Load must resume held; eater removal
    // must restore the original flag.
    for (const top of [true, false, undefined]) {
      const odd = JSON.parse(JSON.stringify(snap));
      const entry = odd.bodies.find(b => b.id === food.id);
      if (top === undefined) delete entry.holdStage;
      else entry.holdStage = top;
      localStorage.setItem('gravity-lab-universe-v1', JSON.stringify(odd));
      current();
      history.loadSavedUniverse();
      const f = bodies.find(b => b.id === food.id);
      const resumed = { infall: !!f?.infall, hold: f?.holdStage === true, toast: toastText() };
      lifecycle.removeBody(bodies.find(b => b.id === entry.infall.eaterId));
      step(0.2);
      out.push({ held, case: `top=${top}`, resumed, cancelled: { infall: !!f.infall, hold: f.holdStage === true } });
    }
  }
  return out;
});
await browser.close();
server.kill();
let pass = 0;
for (const r of report) {
  const tag = `held=${r.held} ${r.case ?? ''}`;
  assert.notEqual(r.captured, false, tag + ' captured');
  if (r.resumed) {
    assert.deepEqual(r.resumed, { infall: true, hold: true, toast: 'Saved universe restored' }, tag + ' resumes held');
    assert.deepEqual(r.cancelled, { infall: false, hold: r.held }, tag + ' cancel restores original');
    pass += 2;
    continue;
  }
  assert.ok(r.kept, tag + ' current universe kept');
  assert.ok(r.historyOn, tag + ' history re-enabled');
  if (r.case.endsWith('/load'))
    assert.equal(r.toast, 'That saved universe could not be restored; your current universe was kept', tag);
  if (r.case.endsWith('/recovery'))
    assert.equal(r.toast, 'The recovery point could not be restored; your current universe was kept', tag);
  if (r.case.endsWith('/restore')) assert.equal(r.ok, false, tag + ' restoreUniverse reports failure');
  pass += 3;
}
assert.deepEqual(errors, []);
console.log(`r2 load fallback: ${report.length} cases, ${pass} assertions pass, no page errors`);

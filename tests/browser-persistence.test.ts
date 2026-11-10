// Deterministic harness reproduction. No server, browser or GPU is launched.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';
import { saveUniverse, loadUniverse } from '../src/sandbox-state.ts';
import { assertSaveLoadRoundTrip } from './browser-persistence.mjs';

// Frozen pre-fix sequence from browser-smoke.mjs, blob 28221747772c0857c723535041821c67f0b43290.
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const oldRoundTrip = new AsyncFunction(
  'page',
  'assert',
  `
  await page.getByRole('button', { name: 'Save' }).click();
  const savedCount = await page.locator('#count').textContent();
  await page.getByRole('button', { name: 'Clear all' }).click();
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '0');
  assert.equal(await page.locator('#info-panel').evaluate(element => element.classList.contains('empty')), true);
  await page.getByRole('button', { name: 'Load' }).click();
  await page.waitForFunction(count => document.querySelector('#count')?.textContent === count, savedCount);

  `,
);
const history = readFileSync(new URL('../src/state/history.ts', import.meta.url), 'utf8');
const flows = stripTypeScriptTypes(
  history.slice(
    history.indexOf('export function saveCurrentUniverse'),
    history.indexOf('export function recoverSession'),
  ),
).replaceAll('export ', '');
const toolbar = readFileSync(new URL('../src/ui/toolbar.ts', import.meta.url), 'utf8');
const pauseStart = toolbar.indexOf("document.querySelector<HTMLButtonElement>('#pause')!.onclick = e => {");
const pauseBodyStart = toolbar.indexOf('{', pauseStart);
const pauseBodyEnd = toolbar.indexOf('\n  };', pauseBodyStart);
const pauseHandler = new Function('app', 'e', stripTypeScriptTypes(toolbar.slice(pauseBodyStart + 1, pauseBodyEnd)));

function fixture(options = {}) {
  const app = { paused: options.paused ?? false, simAccumulator: 0 };
  const bodies = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    kind: 'rocky',
    name: `Body ${i + 1}`,
    mass: 10 + i,
    birthMass: 10 + i,
    position: [i, 0, 0],
    velocity: [0, 0, i],
    locked: false,
    buildLocked: false,
    groupId: 1,
  }));
  const cosmicGroups = [{ id: 1, name: 'Test group', bodyIds: bodies.map(b => b.id) }];
  const storage = new Map();
  let elapsed = 7,
    gravity = 1,
    count = '5',
    pauseLabel = app.paused ? 'Resume' : 'Pause',
    toast = '';
  let saveCalls = 0,
    clearCalls = 0;
  const localStorage = {
    setItem(key, value) {
      if (options.blockSave) throw new Error('QuotaExceededError');
      storage.set(key, value);
    },
    getItem: key => storage.get(key) ?? null,
    removeItem: key => storage.delete(key),
  };
  const document = {
    querySelector(selector) {
      return { textContent: { '#count': count, '#pause': pauseLabel, '#toast': toast }[selector] };
    },
  };
  function inContext(fn) {
    const saved = { localStorage: globalThis.localStorage, document: globalThis.document };
    globalThis.localStorage = localStorage;
    globalThis.document = document;
    try {
      return fn();
    } finally {
      if (saved.localStorage === undefined) delete globalThis.localStorage;
      else globalThis.localStorage = saved.localStorage;
      if (saved.document === undefined) delete globalThis.document;
      else globalThis.document = saved.document;
    }
  }
  const snapshotUniverse = () => structuredClone({ version: 1, elapsed, gravity, bodies, groups: cosmicGroups });
  const restoreUniverse = snapshot => {
    if (options.loadNoop) return true;
    bodies.splice(0, bodies.length, ...structuredClone(snapshot.bodies));
    cosmicGroups.splice(0, cosmicGroups.length, ...structuredClone(snapshot.groups));
    elapsed = snapshot.elapsed;
    gravity = snapshot.gravity;
    if (options.replaceId) bodies[0].id = 999;
    if (options.dropMass) bodies[0].mass += 1;
    count = String(bodies.length);
    return true;
  };
  const { saveCurrentUniverse, loadSavedUniverse } = new Function(
    'saveUniverse',
    'loadUniverse',
    'snapshotUniverse',
    'refreshGroupNavigator',
    'audio',
    'toast',
    'bodies',
    'cosmicGroups',
    'recordHistory',
    'restoreUniverse',
    `${flows}; return { saveCurrentUniverse, loadSavedUniverse };`,
  )(
    saveUniverse,
    loadUniverse,
    snapshotUniverse,
    () => {},
    { play() {} },
    value => {
      toast = value;
    },
    bodies,
    cosmicGroups,
    () => {},
    restoreUniverse,
  );
  function tick(where) {
    if (!app.paused && options.race === where && bodies.length) {
      const removed = bodies.pop();
      cosmicGroups[0].bodyIds = cosmicGroups[0].bodyIds.filter(id => id !== removed.id);
      elapsed += 0.01;
      count = String(bodies.length);
    }
  }
  const page = {
    locator(selector) {
      return {
        async textContent() {
          return document.querySelector(selector).textContent;
        },
        async click() {
          assert.equal(selector, '#pause');
          const target = { textContent: pauseLabel };
          pauseHandler(app, { target });
          pauseLabel = target.textContent;
        },
        async evaluate(fn) {
          return fn({ classList: { contains: name => name === 'empty' && count === '0' } });
        },
      };
    },
    getByRole(role, { name }) {
      assert.equal(role, 'button');
      return {
        async click() {
          if (name === 'Save') {
            saveCalls++;
            inContext(saveCurrentUniverse);
            tick('after-save');
          } else if (name === 'Clear all') {
            clearCalls++;
            bodies.length = 0;
            cosmicGroups.length = 0;
            elapsed = 0;
            count = '0';
          } else if (name === 'Load') {
            inContext(loadSavedUniverse);
            tick('after-load');
          } else throw new Error(`Unexpected button ${name}`);
        },
      };
    },
    async evaluate(fn, arg) {
      return inContext(() => fn(arg));
    },
    async waitForFunction(fn, arg) {
      if (!inContext(() => fn(arg)))
        throw new Error(`simulated timeout: expected=${arg}; count=${count}; pause=${pauseLabel}`);
    },
  };
  return { page, app, state: () => ({ count, pauseLabel, saveCalls, clearCalls }) };
}

test('negative control: original test passes with no intervening physics', async () => {
  const f = fixture();
  await oldRoundTrip(f.page, assert);
  assert.equal(f.state().count, '5');
});

test('actual old test fails if physics changes the count after Save but before the DOM read', async () => {
  const f = fixture({ race: 'after-save' });
  await assert.rejects(oldRoundTrip(f.page, assert), /expected=4; count=5/);
});

test('actual old test fails if physics changes the count in the first frame after Load', async () => {
  const f = fixture({ race: 'after-load' });
  await assert.rejects(oldRoundTrip(f.page, assert), /expected=5; count=4/);
});

for (const race of ['after-save', 'after-load']) {
  test(`candidate prevents ${race} race and restores original running state`, async () => {
    const f = fixture({ race });
    assert.deepEqual(await assertSaveLoadRoundTrip(f.page), { savedCount: 5, restoredCount: 5, wasRunning: true });
    assert.equal(f.app.paused, false);
    assert.equal(f.state().saveCalls, 2);
  });
}

test('candidate preserves an already-paused state', async () => {
  const f = fixture({ paused: true, race: 'after-load' });
  assert.equal((await assertSaveLoadRoundTrip(f.page)).wasRunning, false);
  assert.equal(f.app.paused, true);
});

for (const corruption of ['replaceId', 'dropMass']) {
  test(`same-count corruption ${corruption} is rejected rather than hidden`, async () => {
    const f = fixture({ [corruption]: true });
    await assert.rejects(assertSaveLoadRoundTrip(f.page), /Load must restore the saved scientific state/);
    assert.equal(f.app.paused, false);
  });
}

test('failed Save cannot reuse stale storage and must stop before Clear', async () => {
  const f = fixture({ blockSave: true });
  await assert.rejects(assertSaveLoadRoundTrip(f.page), /Save did not write a snapshot/);
  assert.equal(f.state().clearCalls, 0);
  assert.equal(f.app.paused, false);
});

test('no-op Load still fails strict count assertion with diagnostics', async () => {
  const f = fixture({ loadNoop: true });
  await assert.rejects(assertSaveLoadRoundTrip(f.page), /savedCount.*5.*count.*0/);
  assert.equal(f.app.paused, false);
});

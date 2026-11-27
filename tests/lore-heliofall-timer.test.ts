// R4-C1 (lore-corrections implementation-review-r4.md): the Heliopolis-falls effect schedules the city-shield EMP
// 2.5 s in. The timer must be cleared when the effect is disposed, and the callback must also check the reading
// generation, the active effect instance and the scene handler it captured, so a stopped or downgraded effect can
// never fire into a rebuilt scene. This runs the exact FX.heliofall and stopFx source from society.js in a VM with
// inert Three.js stand-ins and a manual timer queue (no browser, no rendering).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const SRC = readFileSync(new URL('../public/atlas/society.js', import.meta.url), 'utf8');

function slice(start: string, end: string): string {
  const a = SRC.indexOf(start);
  assert.ok(a >= 0, `missing ${start}`);
  const b = SRC.indexOf(end, a);
  assert.ok(b > a, `missing end of ${start}`);
  return SRC.slice(a, b);
}

const STOP_FX = slice('function stopFx(){', '\n');
const HELIOFALL = slice('FX.heliofall=g=>{', '/* ---------- globe battles');

function makeWorld(opts: { clearWorks?: boolean } = {}) {
  const clearWorks = opts.clearWorks !== false;
  const any: any = new Proxy(function () {}, {
    get: (_t, k) => (k === Symbol.toPrimitive ? () => 0 : any),
    apply: () => any,
    construct: () => any,
  });
  let nextId = 1;
  const timers = new Map<number, { at: number; fn: () => void }>();
  let now = 0;
  const ctx: any = {
    THREE: any,
    setTod() {},
    sFly() {},
    Flashes: () => ({ add() {}, update() {} }),
    glowSprite: () => any,
    makeShip: () => any,
    ground0: () => 0,
    col: () => 0,
    rng: () => () => 0.5,
    GLOW_WARM: 0,
    SITES: { heliopolis: {} },
    setTimeout(fn: () => void, ms: number) {
      const id = nextId++;
      timers.set(id, { at: now + ms, fn });
      return id;
    },
    clearTimeout(id: number) {
      if (clearWorks) timers.delete(id);
    },
  };
  vm.createContext(ctx);
  vm.runInContext(`var fxList=[];var navGen=0;var FX={};\n${STOP_FX}\n${HELIOFALL}`, ctx);
  const play = () => {
    const inst = ctx.FX.heliofall(any);
    inst.group = any;
    inst.scene = { remove() {} };
    inst.t = 0;
    ctx.fxList.push(inst);
    return inst;
  };
  const advance = (ms: number) => {
    now += ms;
    for (const [id, t] of [...timers]) {
      if (t.at <= now) {
        timers.delete(id);
        t.fn();
      }
    }
  };
  const handler = () => {
    const h = { calls: 0, fn: () => void h.calls++ };
    ctx.SITES.heliopolis._emp = h.fn;
    return h;
  };
  return { ctx, play, advance, handler, pending: () => timers.size };
}

test('R4-C1: uninterrupted eligible playback fires the EMP exactly once', () => {
  const w = makeWorld();
  const h = w.handler();
  w.play();
  w.advance(2499);
  assert.equal(h.calls, 0);
  w.advance(1);
  assert.equal(h.calls, 1);
  w.advance(30000);
  assert.equal(h.calls, 1);
});

test('R4-C1: stopping the effect before 2.5 s clears the timer and never fires', () => {
  const w = makeWorld();
  const h = w.handler();
  w.play();
  w.advance(1000);
  w.ctx.stopFx();
  assert.equal(w.pending(), 0);
  w.advance(5000);
  assert.equal(h.calls, 0);
});

test('R4-C1: stop and replay within the same book fires once, for the new playback only', () => {
  const w = makeWorld();
  const h = w.handler();
  w.play();
  w.advance(1000);
  w.ctx.stopFx();
  w.play();
  w.advance(1500); // the old timer's due time passes
  assert.equal(h.calls, 0);
  w.advance(1000); // the replay's own 2.5 s
  assert.equal(h.calls, 1);
});

test('R4-C1: downgrade before firing (book change: navGen++ and stopFx) never fires', () => {
  const w = makeWorld();
  const h = w.handler();
  w.play();
  w.advance(500);
  w.ctx.navGen++;
  w.ctx.stopFx();
  w.advance(5000);
  assert.equal(h.calls, 0);
});

test('R4-C1: downgrade and return with a rebuilt scene: neither the old nor the new handler is hit', () => {
  const w = makeWorld();
  const old = w.handler();
  w.play();
  w.advance(500);
  w.ctx.navGen++;
  w.ctx.stopFx();
  w.ctx.navGen++; // return to the eligible book
  const rebuilt = w.handler(); // scene construction installs a fresh handler
  w.advance(5000);
  assert.equal(old.calls, 0);
  assert.equal(rebuilt.calls, 0);
});

test('R4-C1: callback guards hold even if the timer were not cleared (defence in depth)', () => {
  // generation changed
  let w = makeWorld({ clearWorks: false });
  let h = w.handler();
  w.play();
  w.ctx.navGen++;
  w.ctx.stopFx();
  w.advance(5000);
  assert.equal(h.calls, 0);
  // same book, effect stopped (instance no longer active)
  w = makeWorld({ clearWorks: false });
  h = w.handler();
  w.play();
  w.ctx.stopFx();
  w.advance(5000);
  assert.equal(h.calls, 0);
  // effect still listed but the scene handler was replaced
  w = makeWorld({ clearWorks: false });
  const first = w.handler();
  w.play();
  const replacement = w.handler();
  w.advance(5000);
  assert.equal(first.calls, 0);
  assert.equal(replacement.calls, 0);
});

test('R4-C1: no scene handler installed means no timer is scheduled', () => {
  const w = makeWorld();
  w.play();
  assert.equal(w.pending(), 0);
});

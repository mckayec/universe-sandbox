import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  detailsAfterSelect,
  EVENT_HISTORY_LIMIT,
  labelVisible,
  narrationAllowed,
  parseFeedbackMode,
  presentEvent,
  recordEvent,
  shortLabel,
  canvasLabelText,
  exhibitLoadOrigin,
  timelineLive,
  type LabelContext,
  type LoggedEvent,
} from '../src/feedback.ts';

const ev = (n: number): LoggedEvent => ({ title: `E${n}`, detail: `d${n}`, color: '#fff' });

test('event history is stored newest first and bounded, independent of presentation', () => {
  const log: LoggedEvent[] = [];
  for (let i = 0; i < 12; i++) recordEvent(log, ev(i));
  assert.equal(log.length, EVENT_HISTORY_LIMIT);
  assert.equal(log[0].title, 'E11');
  assert.equal(log.at(-1)!.title, 'E4');
  const original = ev(99);
  recordEvent(log, original);
  original.title = 'mutated';
  assert.equal(log[0].title, 'E99', 'stored copy, not a reference');
});

test('quiet mode drops unsolicited simulation banners and sounds only', () => {
  assert.deepEqual(presentEvent('simulation', 'full'), { banner: true, sound: true });
  assert.deepEqual(presentEvent('action', 'full'), { banner: true, sound: true });
  assert.deepEqual(presentEvent('simulation', 'quiet'), { banner: false, sound: false });
  assert.deepEqual(presentEvent('action', 'quiet'), { banner: true, sound: true });
});

test('timeline live region and narration follow the feedback mode', () => {
  assert.equal(timelineLive('full'), 'polite');
  assert.equal(timelineLive('quiet'), 'off');
  assert.equal(narrationAllowed('full', true), true);
  assert.equal(narrationAllowed('full', false), false);
  assert.equal(narrationAllowed('quiet', true), false);
});

test('feedback preference parsing falls back safely', () => {
  assert.equal(parseFeedbackMode('quiet'), 'quiet');
  assert.equal(parseFeedbackMode('full'), 'full');
  assert.equal(parseFeedbackMode(undefined), 'full');
  assert.equal(parseFeedbackMode('loud'), 'full');
  assert.equal(parseFeedbackMode(3, 'quiet'), 'quiet');
});

test('short labels keep short names and truncate long ones with an ellipsis', () => {
  assert.equal(shortLabel('Void 01'), 'Void 01');
  assert.equal(shortLabel('  Terra 02  '), 'Terra 02');
  const long = shortLabel('Milky Way merger remnant');
  assert.ok(long.length <= 14, long);
  assert.ok(long.endsWith('…'));
  assert.ok(long.startsWith('Milky Way'));
});

const base: LabelContext = {
  compact: false,
  selected: false,
  debris: false,
  escort: false,
  inFocusedStructure: true,
  kind: 'rocky',
  viewDistance: 100,
};

test('compact layout shows at most the selected label', () => {
  assert.equal(labelVisible({ ...base, compact: true }), false);
  assert.equal(labelVisible({ ...base, compact: true, kind: 'blackhole', viewDistance: 20 }), false);
  assert.equal(labelVisible({ ...base, compact: true, selected: true }), true);
  const scene = Array.from({ length: 6 }, (_, i) => ({ ...base, compact: true, selected: i === 2 }));
  assert.equal(scene.filter(labelVisible).length, 1);
  assert.equal(scene.map(c => ({ ...c, selected: false })).filter(labelVisible).length, 0);
});

test('desktop label rules are unchanged', () => {
  assert.equal(labelVisible(base), true);
  assert.equal(labelVisible({ ...base, viewDistance: 300 }), false);
  assert.equal(labelVisible({ ...base, viewDistance: 300, kind: 'nebula' }), true);
  assert.equal(labelVisible({ ...base, viewDistance: 700, kind: 'blackhole' }), false);
  assert.equal(labelVisible({ ...base, debris: true }), false);
  assert.equal(labelVisible({ ...base, escort: true }), false);
  assert.equal(labelVisible({ ...base, inFocusedStructure: false }), false);
  assert.equal(labelVisible({ ...base, debris: true, selected: true }), true);
});

test('Details sheet resets on a fresh selection and survives re-selecting the same object', () => {
  assert.equal(detailsAfterSelect(true, 1, 2), false);
  assert.equal(detailsAfterSelect(true, null, 2), false);
  assert.equal(detailsAfterSelect(true, 2, 2), true);
  assert.equal(detailsAfterSelect(false, 2, 2), false);
  assert.equal(detailsAfterSelect(true, 2, null), false);
  const a = { id: 1 },
    rebuilt = { id: 1 };
  assert.equal(detailsAfterSelect(true, a, a), true);
  assert.equal(detailsAfterSelect(true, a, rebuilt), false, 'same ID after a scene rebuild is still a fresh selection');
});

test('SC6-T2: long names shorten only in compact layout, both ways across a resize', () => {
  const long = 'Milky Way merger remnant';
  assert.equal(canvasLabelText(long, false), long, 'desktop keeps the full visible name');
  const short = canvasLabelText(long, true);
  assert.ok(short.length <= 14 && short.endsWith('…'), 'compact shortens');
  assert.equal(canvasLabelText(long, false), long, 'returning to desktop restores the full name');
  assert.equal(canvasLabelText('Void 01', true), 'Void 01');
  const registry = readFileSync('src/bodies/registry.ts', 'utf8');
  assert.ok(registry.includes('canvasLabelText(b.name, app.compactLabels)'), 'labels follow the compact flag');
  const loop = readFileSync('src/app/loop.ts', 'utf8');
  const labels = loop.slice(loop.indexOf('function updateLabels'));
  assert.ok(/compact !== app\.compactLabels[\s\S]*updateBodyLabel\(body\)/.test(labels), 'breakpoint flip relabels');
});

test('SC6-T1: idle attract start/restart loads are simulation-origin; visitor picks stay action', () => {
  assert.equal(exhibitLoadOrigin(true), 'simulation');
  assert.equal(exhibitLoadOrigin(false), 'action');
  assert.deepEqual(presentEvent(exhibitLoadOrigin(true), 'quiet'), { banner: false, sound: false });
  assert.deepEqual(presentEvent(exhibitLoadOrigin(true), 'full'), { banner: true, sound: true });
  assert.deepEqual(presentEvent(exhibitLoadOrigin(false), 'quiet'), { banner: true, sound: true });
  const flow = readFileSync('src/ui/exhibit-flow.ts', 'utf8');
  const load = flow.slice(
    flow.indexOf('export function loadExhibit'),
    flow.indexOf('/**', flow.indexOf('export function loadExhibit')),
  );
  assert.ok(load.includes('exhibitLoadOrigin(asAttract)'), 'guided-exhibit event origin follows asAttract');
  assert.ok(!/'action',?\s*\)/.test(load), 'loadExhibit no longer hard-codes action origin');
  const feed = readFileSync('src/ui/feed.ts', 'utf8');
  const attract = feed.slice(
    feed.indexOf('function startAttractMode'),
    feed.indexOf('export function updateAttractMode'),
  );
  assert.ok(attract.includes("loadExhibit('feed-black-hole', true)"), 'attract start/restart passes asAttract');
  const toolbar = readFileSync('src/ui/toolbar.ts', 'utf8');
  assert.ok(!/loadExhibit\([^)]*,\s*true\)/.test(toolbar), 'visitor exhibit buttons never load as attract');
});

test('SC6-T1 audit: simulation-raised banners outside museumEvent respect quiet', () => {
  const feed = readFileSync('src/ui/feed.ts', 'utf8');
  const helper = feed.slice(
    feed.indexOf('export function simulationToast'),
    feed.indexOf('export function renderExhibitEvents'),
  );
  assert.ok(helper.includes("presentEvent('simulation', app.feedbackMode).banner"));
  for (const file of ['src/physics/collisions.ts', 'src/physics/tidal-disruption.ts']) {
    const src = readFileSync(file, 'utf8');
    assert.ok(src.includes('simulationToast('), `${file} uses simulationToast`);
    assert.ok(!/(^|[^A-Za-z.])toast\(/m.test(src), `${file} has no direct toast()`);
  }
});

test('wiring: museumEvent records before presenting; builders are action-origin', () => {
  const feed = readFileSync('src/ui/feed.ts', 'utf8');
  const body = feed.slice(feed.indexOf('export function museumEvent'), feed.indexOf('/** Matches the compact'));
  assert.ok(body.indexOf('recordEvent(') < body.indexOf('presentEvent('));
  assert.ok(body.includes('if (shown.banner) toast(title)'));
  assert.ok(!body.includes('exhibitEvents.unshift'));
  for (const file of ['src/builders/systems.ts', 'src/builders/galaxy.ts']) {
    const src = readFileSync(file, 'utf8');
    const calls = src.split('museumEvent(').length - 1;
    const actions = src.match(/'action',?\s*\)/g)?.length ?? 0;
    assert.ok(calls > 0 && actions >= calls, `${file}: every museumEvent call is action-origin`);
  }
  const physics = readFileSync('src/physics/stellar-evolution.ts', 'utf8');
  assert.ok(!physics.includes("'action'"), 'simulation events keep the default simulation origin');
  const loop = readFileSync('src/app/loop.ts', 'utf8');
  assert.ok(loop.includes('labelVisible({'));
  const select = feed.slice(feed.indexOf('export function select'));
  assert.ok(select.includes('detailsAfterSelect('));
});

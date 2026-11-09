// Independent review reproduction; run with Node 24 against exact PR47 head 0039fe0.
// Usage: node reviewer-timing-0039fe0.mjs /path/to/checkout
// A successful exit confirms the reported defect at this head, NOT correctness of timing.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = resolve(process.argv[2] || '.');
const { frameTiming, PerformanceMonitor } = await import(pathToFileURL(resolve(root, 'src/exhibit-runtime.ts')));
const src = readFileSync(resolve(root, 'src/scene/quality.ts'), 'utf8');
const start = src.indexOf('export function updateAdaptiveQuality');
const end = src.indexOf('/** Discard', start);
assert(start >= 0 && end > start);
const fn = src.slice(start, end).replace('export ', '').replace('dt: number', 'dt');
const output = [];
for (const [name, seq] of [
  ['steady10', Array(30).fill(.1)],
  ['steadySlow', Array(20).fill(.6)],
  ['alternating', Array.from({length:400}, (_,i) => i%2 ? .6 : 1/60)]
]) {
  const monitor = new PerformanceMonitor();
  const app = {qualityMode:'auto', qualityTimer:0, qualityFrames:0, qualityScale:.8};
  const context = {app, QUALITY_FLOOR:.62, applyQualityScale:x => app.qualityScale=x};
  vm.createContext(context); vm.runInContext(fn, context);
  let accepted=0, updates=0;
  for (const delta of seq) {
    const t = frameTiming(delta);
    assert(t.step <= .03);
    if (t.measured !== null) {
      accepted++;
      if (monitor.update(t.measured)) updates++;
      context.updateAdaptiveQuality(t.measured);
    }
  }
  const row = {name,frames:seq.length,wallFPS:seq.length/seq.reduce((a,b)=>a+b,0),
    accepted,displayFPS:monitor.fps,badgeUpdates:updates,quality:app.qualityScale};
  output.push(row); console.log(JSON.stringify(row));
}
assert.equal(output[0].displayFPS,10);
assert.equal(output[1].accepted,0);
assert.equal(output[1].badgeUpdates,0);
assert.equal(output[2].displayFPS,60);
assert(output[2].wallFPS<4 && output[2].quality>.8);
console.log('3/3 scenario outcomes reproduced; foreground stall exclusion defect confirmed.');

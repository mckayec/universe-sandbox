// Run from exact PR47 checkout: node docs/reviews/simulator-clarity/reviewer-encounter-c4214ef.mjs
// Imports the real pure helper; executes the actual runtime selector with identity-transform stubs.
// This is source/controller evidence, not THREE/WebGL acceptance.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { QUIET_ENCOUNTER, diskEncounter, strongestEncounter } from '../../../src/disk-encounter.ts';
const source = readFileSync(new URL('../../../src/visuals/disk-encounters.ts', import.meta.url), 'utf8');
const start = source.indexOf('function targetEncounter('), end = source.indexOf('/** Update the tide uniforms', start);
assert.ok(start >= 0 && end > start);
const controller = stripTypeScriptTypes(source.slice(start, end));
const shallow = diskEncounter({x:12,y:0,z:0},10,1,1);
const deep = diskEncounter({x:0,y:9,z:0},10,1,1);
assert.equal(shallow.strength,1); assert.equal(deep.strength,1);
assert.ok(deep.cut < shallow.cut);
const host = {id:1, mass:1, kind:'blackhole'};
const a = {id:2,mass:1,kind:'blackhole',mesh:{position:{x:12,y:0,z:0}}};
const b = {id:3,mass:1,kind:'blackhole',mesh:{position:{x:0,y:9,z:0}}};
const ref = {updateWorldMatrix(){},worldToLocal(v){return v;}};
function runtime(order) {
 const tmpLocal={copy(v){Object.assign(this,v);return this;}};
 return new Function('QUIET_ENCOUNTER','diskEncounter','bodies','tmpLocal','MIN_MASS_RATIO',
 controller+'; return targetEncounter(bodies[0], arguments[5], 10);'
 )(QUIET_ENCOUNTER,diskEncounter,[host,...order],tmpLocal,0.02,ref);
}
const results = [
 {case:'helper shallow first',got:strongestEncounter([shallow,deep]),expectedCut:deep.cut},
 {case:'helper deep first',got:strongestEncounter([deep,shallow]),expectedCut:deep.cut},
 {case:'runtime shallow first',got:runtime([a,b]),expectedCut:deep.cut,expectedCompanion:3},
 {case:'runtime deep first',got:runtime([b,a]),expectedCut:deep.cut,expectedCompanion:3},
];
for(const r of results) {r.pass=r.got.cut===r.expectedCut && (r.expectedCompanion===undefined || r.got.companionId===r.expectedCompanion);console.log(JSON.stringify(r));}
const passed=results.filter(r=>r.pass).length;
console.log(JSON.stringify({passed,total:results.length,shallow,deep}));
if(passed!==results.length)process.exitCode=1;

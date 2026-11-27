// Independent behavior probes for PR47 slice 4b-1. No app or PR edits.
// node reviewer-4b1.mjs CHECKOUT [path/to/three.module.js]
// Requires Node with stripTypeScriptTypes and Three.js 0.180.0.
// Executes source-extracted controller/removal functions; no renderer or DOM.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';
const root = resolve(process.argv[2] || '.');
const THREE = process.argv[3] ? await import(pathToFileURL(resolve(process.argv[3]))) : await import('three');
const model = await import(pathToFileURL(resolve(root, 'src/disk-encounter.ts')));
const read = p => readFileSync(resolve(root, p), 'utf8');
let passed = 0, failed = 0;
function check(name, fn) {
  try { fn(); passed++; console.log(JSON.stringify({name, ok:true})); }
  catch(e) { failed++; console.log(JSON.stringify({name, ok:false, error:e.message})); }
}
function controller(bodies) {
  const code = stripTypeScriptTypes(read('src/visuals/disk-encounters.ts'))
    .replace(/^import .*;\s*$/gm, '').replace(/\bexport /g, '');
  return new Function('THREE', 'bodies', 'QUIET_ENCOUNTER', 'diskEncounter', 'outranks', 'relaxEncounter',
    code + '\nreturn {updateDiskEncounter,diskEncounterOf};')
    (THREE, bodies, model.QUIET_ENCOUNTER, model.diskEncounter, model.outranks, model.relaxEncounter);
}
function fixture(kind='protostar', scale=1, tilt=0) {
  const mesh = new THREE.Group(); mesh.position.set(11, 7, -4); mesh.scale.setScalar(2);
  const disk = new THREE.Mesh(new THREE.RingGeometry(1,10), new THREE.ShaderMaterial({uniforms:{
    outer:{value:10}, tideCut:{value:1e5}, tideAngle:{value:0}, tideAmp:{value:0}
  }}));
  disk.name = kind==='protostar' ? 'protoDisk' : 'accretionDiskDust';
  disk.scale.setScalar(scale); disk.rotation.x=tilt; mesh.add(disk); mesh.updateMatrixWorld(true);
  const host={id:1,kind,mass:10,mesh};
  const companion={id:2,kind:'star',mass:10,mesh:new THREE.Group()};
  companion.mesh.position.copy(disk.localToWorld(new THREE.Vector3(12,0,0)));
  const bodies=[host,companion]; return {host,companion,disk,bodies,c:controller(bodies)};
}
function settle(f) {for(let i=0;i<200;i++) f.c.updateDiskEncounter(f.host,.03);return f.c.diskEncounterOf(f.host);}
check('protostar isolated writes quiet state and untouched cut',()=>{
  const f=fixture();f.bodies.pop();const s=settle(f);assert.equal(s?.strength,0);assert.equal(f.disk.material.uniforms.tideCut.value,1e5);
});
check('protostar close companion drives state and real material uniforms',()=>{
  const f=fixture();const s=settle(f);assert.equal(s?.companionId,2);assert.ok(s.strength>.99);assert.ok(Math.abs(s.cut-.3637636976452381)<1e-5);assert.ok(Math.abs(f.disk.material.uniforms.tideCut.value-s.cut*10)<1e-10);
});
check('protostar translated scaled tilted local frame preserves normalized result',()=>{
  const a=settle(fixture()),b=settle(fixture('protostar',.23,Math.PI/2.38));assert.ok(a&&b);assert.ok(Math.abs(a.cut-b.cut)<1e-10);assert.ok(Math.abs(a.angle-b.angle)<1e-10);
});
check('formation growth at fixed world separation changes quiet to perturbed',()=>{
  const f=fixture('protostar',.06);f.companion.mesh.position.set(35,7,-4);assert.equal(settle(f)?.strength,0);f.disk.scale.setScalar(1);assert.ok(settle(f).strength>.99);
});
check('removed companion resets protostar state and uniforms immediately',()=>{
  const f=fixture();settle(f);f.bodies.pop();f.c.updateDiskEncounter(f.host,.03);assert.equal(f.c.diskEncounterOf(f.host)?.strength,0);assert.equal(f.c.diskEncounterOf(f.host).companionId,undefined);assert.equal(f.disk.material.uniforms.tideCut.value,1e5);
});
check('protostar excludes nebula and sub-threshold mass companions',()=>{
  const f=fixture();f.companion.kind='nebula';assert.equal(settle(f)?.strength,0);f.companion.kind='star';f.companion.mass=.1;assert.equal(settle(f)?.strength,0);
});
check('black-hole path remains active control',()=>{const f=fixture('blackhole');assert.equal(settle(f)?.companionId,2);assert.ok(f.disk.material.uniforms.tideAmp.value>.99);});
const life=stripTypeScriptTypes(read('src/bodies/lifecycle.ts'));
const start=life.indexOf('export function removeBody('),end=life.indexOf('/** When a group',start);
assert.ok(start>=0&&end>start);
function removal(selected='food', successor='live') {
  const make=id=>({id,kind:'star',label:{element:{remove(){}}},mesh:{remove(){}},removed:false});
  const food=make(1),survivor=make(2),third=make(3),bodies=[food,survivor,third];
  const app={selectedBody:{food,survivor,third}[selected],historySuspended:true};
  const env={app,bodies,removeMatterStreamsFor(){},closeObjectMenu(){},scene:{remove(){}},disposeObject(){},trails:new Map(),bodyGroupIds:new Map(),cosmicGroups:[],updateCount(){},refreshGroupNavigator(){},select:b=>{app.selectedBody=b;}};
  const fn=new Function(...Object.keys(env),life.slice(start,end).replace('export ','')+';return removeBody;')(...Object.values(env));
  if(successor==='removed')survivor.removed=true;
  fn(food,successor==='none'?undefined:survivor);
  assert.equal(food.removed,true);assert.equal(bodies.includes(food),false);
  return {app,food,survivor,third};
}
check('selected swallowed body hands off to live survivor',()=>{const r=removal();assert.equal(r.app.selectedBody,r.survivor);});
check('already selected survivor remains selected',()=>{const r=removal('survivor');assert.equal(r.app.selectedBody,r.survivor);});
check('unrelated selected body remains selected',()=>{const r=removal('third');assert.equal(r.app.selectedBody,r.third);});
check('removal without successor clears selection',()=>{assert.equal(removal('food','none').app.selectedBody,null);});
check('removed successor is never selected',()=>{assert.equal(removal('food','removed').app.selectedBody,null);});
console.log(JSON.stringify({three:THREE.REVISION,passed,failed,total:passed+failed}));
process.exitCode=failed?1:0;

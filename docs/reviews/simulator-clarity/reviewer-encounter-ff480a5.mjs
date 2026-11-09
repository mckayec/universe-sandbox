// Run: node docs/reviews/simulator-clarity/reviewer-encounter-ff480a5.mjs [checkout-root]
// Same runner supports c4214ef and ff480a5. No THREE/WebGL instantiation.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve(process.argv[2] || '.');
const m=await import(pathToFileURL(resolve(root,'src/disk-encounter.ts')));
const source=readFileSync(resolve(root,'src/visuals/disk-encounters.ts'),'utf8');
const start=source.indexOf('function targetEncounter('),end=source.indexOf('/** Update the tide uniforms',start);
assert.ok(start>=0 && end>start);
const controller=stripTypeScriptTypes(source.slice(start,end));
const host={id:1,mass:1,kind:'blackhole'};
function runtime(order){
 const tmpLocal={copy(v){Object.assign(this,v);return this;}};
 const reference={updateWorldMatrix(){},worldToLocal(v){return v;}};
 return new Function('QUIET_ENCOUNTER','diskEncounter','outranks','bodies','tmpLocal','MIN_MASS_RATIO','reference',
 controller+'; return targetEncounter(bodies[0],reference,10);'
 )(m.QUIET_ENCOUNTER,m.diskEncounter,m.outranks,[host,...order],tmpLocal,.02,reference);
}
const body=(id,x,y)=>({id,mass:1,kind:'blackhole',mesh:{position:{x,y,z:0}}});
const scenarios=[
 ['saturated',body(2,12,0),body(3,0,9),3],
 ['cut floor',body(2,3,0),body(3,0,2),3],
 ['exact tie',body(7,9,0),body(4,-9,0),4],
];
const results=[];
for(const [name,a,b,expectedId] of scenarios){
 const candidates=[a,b].map(x=>({...m.diskEncounter(x.mesh.position,10,1,1),companionId:x.id}));
 const expected=candidates.find(x=>x.companionId===expectedId);
 for(const reversed of [false,true]){
  const bs=reversed?[b,a]:[a,b],es=reversed?[candidates[1],candidates[0]]:candidates;
  for(const [path,got] of [['helper',m.strongestEncounter(es)],['runtime',runtime(bs)]]){
   results.push({case:name,path,reversed,pass:got.companionId===expectedId&&got.cut===expected.cut&&got.angle===expected.angle,
    got:{id:got.companionId,cut:got.cut,angle:got.angle},expected:{id:expectedId,cut:expected.cut,angle:expected.angle}});
  }
 }
}
for(const [path,got] of [['helper',m.strongestEncounter([])],['runtime',runtime([])]])
 results.push({case:'quiet',path,pass:got.strength===0&&got.companionId===undefined});
for(const r of results) console.log(JSON.stringify(r));
const passed=results.filter(x=>x.pass).length;
console.log(JSON.stringify({passed,total:results.length}));
if(passed!==results.length)process.exitCode=1;

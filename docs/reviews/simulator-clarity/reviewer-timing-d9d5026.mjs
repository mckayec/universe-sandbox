// Run: node reviewer-timing-d9d5026.mjs /path/to/exact-head-checkout
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const root=process.argv[2];
const {frameTiming,PerformanceMonitor,adaptiveQualitySample}=await import(pathToFileURL(path.join(root,'src/exhibit-runtime.ts')));
const loop=fs.readFileSync(path.join(root,'src/app/loop.ts'),'utf8');
const quality=fs.readFileSync(path.join(root,'src/scene/quality.ts'),'utf8');
function fn(src,name){const start=src.indexOf('export function '+name+'(');assert.ok(start>=0);let i=src.indexOf('{',start),depth=1,j=i+1;for(;depth;j++){if(src[j]==='{')depth++;if(src[j]==='}')depth--;}return src.slice(start,j).replace('export ','').replace('(dt: number)','(dt)');}
const app={qualityTimer:0,qualityFrames:0,qualityMode:'auto',qualityScale:.8,frameTimingInterrupted:false};
const monitor=new PerformanceMonitor();let listener,clockResets=0,raises=0;
const ctx=vm.createContext({app,adaptiveQualitySample,QUALITY_FLOOR:.62,performanceMonitor:monitor,
applyQualityScale:s=>{if(s>app.qualityScale)raises++;app.qualityScale=s;},
clock:{getDelta:()=>{clockResets++;return 30;}},document:{addEventListener:(event,f)=>{assert.equal(event,'visibilitychange');listener=f;}}});
vm.runInContext(fn(quality,'updateAdaptiveQuality')+'\n'+fn(quality,'resetAdaptiveQualityWindow')+'\n'+fn(loop,'bindFrameTimingReset')+'\nbindFrameTimingReset();',ctx);
function trace(name,deltas){Object.assign(app,{qualityTimer:0,qualityFrames:0,qualityScale:.8,qualityMode:'auto'});monitor.reset();raises=0;let accepted=0,updates=0;
for(const dt of deltas){const t=frameTiming(dt);assert.ok(t.step<=.03);if(t.measured!==null){accepted++;ctx.dt=t.measured;vm.runInContext('updateAdaptiveQuality(dt)',ctx);if(monitor.update(t.measured))updates++;}}
const result={name,total:deltas.length,accepted,wallFps:deltas.length/deltas.reduce((a,b)=>a+b,0),fps:monitor.fps,scale:app.qualityScale,raises,updates};
console.log(JSON.stringify(result));return result;}
const normal=trace('10fps',Array(30).fill(.1));assert.equal(normal.fps,10);assert.equal(normal.accepted,30);
const slow=trace('slow',Array(20).fill(.6));assert.equal(slow.accepted,20);assert.equal(slow.fps,2);assert.equal(slow.raises,0);assert.ok(slow.scale<.8);
const mixed=trace('mixed',Array.from({length:400},(_,i)=>i%2?.6:1/60));assert.equal(mixed.accepted,400);assert.equal(mixed.fps,3);assert.equal(mixed.raises,0);assert.ok(mixed.scale<.8);
app.qualityTimer=2;app.qualityFrames=100;monitor.reset();monitor.update(.9);listener();
assert.equal(clockResets,1);assert.equal(app.frameTimingInterrupted,true);assert.equal(app.qualityTimer,0);assert.equal(app.qualityFrames,0);assert.equal(monitor.update(.2),false);
assert.equal(frameTiming(30,app.frameTimingInterrupted).measured,null);
assert.match(loop,/frameTiming\(clock.getDelta\(\), app.frameTimingInterrupted\)/);assert.match(loop,/app.frameTimingInterrupted = false;/);
app.frameTimingInterrupted=false;assert.equal(frameTiming(.6,app.frameTimingInterrupted).measured,.6);
console.log(JSON.stringify({visibilityListenerStub:'pass',clockResets,measurementReset:true,loopConsumption:'source-checked; not a browser execution'}));

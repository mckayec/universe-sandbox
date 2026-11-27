// Independent source/VM checks. No browser, image decoding, network or GPU claim.
// Run from repository root: node docs/universes/packs/lds-standard-works/reviewer-integration-3e5791e.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const engine=fs.readFileSync('public/atlas/engine.js','utf8');
const packText=fs.readFileSync('public/atlas/packs/lds-standard-works.js','utf8');
const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0'+s).digest('hex');
assert.equal(blob(engine),'3e7250fef4777921f5b8d36b703fd92264e55dd3');
assert.equal(blob(packText),'386fe8967a3bf32c79ca2d4015b5bde9f1834310');
assert.equal(blob(packText.replace(", earthMask: 'hi'","")),'3d279a757303e6ae7e80c358a6f6e041269eb82c');
console.log('PASS whole pack minus the single earthMask option matches approved blob');
const pc={window:{}};vm.runInNewContext(packText,pc);
const pack=pc.window.ATLAS_PACKS['lds-standard-works'];
console.log('Pack keys',Object.keys(pack));
const start=engine.indexOf('const EARTH_HI_MASK=');
const end=engine.indexOf('/* vector maps',start);
assert.ok(start>=0&&end>start);
const code=engine.slice(start,end);
async function probe(name,{hi=false,small=false,low=false,max=16384,mem=16,override,fail=0,worlds}={},expected){
 const requests=[];let images=0;
 class Image {constructor(){images++;}set src(v){this.url=v;requests.push(v);queueMicrotask(()=>{if(requests.length<=fail)this.onerror();else this.onload();});}get src(){return this.url;}}
 const ctx={window:{__EARTH_FILE:override},WORLDS:worlds||[{gfx:{base:'earth',...(hi?{earthMask:'hi'}:{})}}],gfxFor:w=>w.gfx,SMALL:small,LOWMEM:low,MAXTEX:max,navigator:{deviceMemory:mem},ENGINE_BASE:'/atlas/',Image,THREE:{Texture:class{constructor(im){this.image=im;}},RepeatWrapping:1000,LinearFilter:1006}};
 vm.createContext(ctx);vm.runInContext(code+'\nthis.probe={loadEarth,getTexture:()=>EARTH_TEX};',ctx);
 const p=ctx.probe.loadEarth();assert.equal(p,ctx.probe.loadEarth());await p;
 assert.deepEqual(requests,expected.map(f=>'/atlas/'+f));assert.equal(images,1);
 const t=ctx.probe.getTexture();
 if(fail>=requests.length)assert.equal(t,null);else {assert.equal(t.generateMipmaps,false);assert.equal(t.needsUpdate,true);}
 console.log('PASS',name,requests.join(' -> '));
}
await probe('LDS capable desktop',{hi:true},['earth-hi.png']);
await probe('LDS phone',{hi:true,small:true},['earth-hi-4k.png']);
await probe('LDS low memory',{hi:true,low:true},['earth-hi-4k.png']);
await probe('LDS max texture 4096',{hi:true,max:4096},['earth-hi-4k.png']);
await probe('LDS device memory 4',{hi:true,mem:4},['earth-hi-4k.png']);
await probe('Default capable desktop',{},['earth-base.png']);
await probe('Default phone',{small:true},['earth-base-2048.png']);
await probe('Default low memory',{low:true},['earth-base-2048.png']);
await probe('Default max texture 2048',{max:2048},['earth-base-2048.png']);
await probe('Explicit override',{override:'custom.png'},['custom.png']);
await probe('Hi failure fallback',{hi:true,fail:1},['earth-hi.png','earth-base.png']);
await probe('Both requests fail settles',{hi:true,fail:2},['earth-hi.png','earth-base.png']);
await probe('Default phone failure fallback',{small:true,fail:1},['earth-base-2048.png','earth-base.png']);
await probe('Mixed Earth worlds share pack-level hi selection',{worlds:[{gfx:{base:'earth'}},{gfx:{base:'earth',earthMask:'hi'}}]},['earth-hi.png']);
console.log('PASS 14/14 loader scenarios; 1/1 whole-pack preservation check. Stub execution only.');

// AU01-THRENODY-01 proposal characterization only; no repository mutation or browser claim.
// Usage: node au01threnody-proposal-probe.mjs INPUT_DIRECTORY
// Directory: pr24.js, pr37.js, pr48.js, engine.js, reading.js at the hashes below.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const dir=process.argv[2];assert.ok(dir,'INPUT_DIRECTORY required');
const hashes={
  "pr24.js": "3ff0aab059fa54e00f6e2ccc7b849d4bd206d958",
  "pr37.js": "5a74e300eaf88b2d3c81fa9bc957584cd4708e33",
  "pr48.js": "777cee0693d5f9443766e720d8248dae6cf07a2c",
  "engine.js": "0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0",
  "reading.js": "4d9bc177294e5e33accf6f19825ef467f0bb90d4"
};
const inputs={};
for(const [name,sha] of Object.entries(hashes)){
 const b=fs.readFileSync(path.join(dir,name));
 const actual=crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
 assert.equal(actual,sha,name+' Git blob');
 inputs[name]=b.toString('utf8');
}
function parse(src){const w={};vm.runInNewContext(src,{window:w});return JSON.parse(JSON.stringify(w.ATLAS_PACKS.cosmere));}
const before=parse(inputs['pr48.js']);
const oldWorld="A red star. In the empty space of this system the Shards Ambition, Odium and probably Mercy fought; Ambition was mortally wounded, and planets that once orbited here were destroyed. The twisted Investiture on Threnody is at least partly a scar of that battle.",newWorld="A red star. In the empty space of this system the Shards Ambition and Odium fought; Ambition was mortally wounded. The twisted Investiture on Threnody is at least partly a scar of that battle.";
const oldCodex="A Shard mortally wounded in a battle with Odium, and probably Mercy, in the empty space of the Threnodite system. The battle destroyed planets there and still twists the Investiture on Threnody.",newCodex="A Shard mortally wounded in a battle with Odium in the empty space of the Threnodite system. The battle still twists the Investiture on Threnody.";
for(const name of ['pr24.js','pr37.js','pr48.js']){
 const p=parse(inputs[name]);assert.equal(p.worlds.find(x=>x.id==='threnosun').blurb,oldWorld);
 assert.equal(p.codex.find(x=>x.id==='shards').list.find(x=>x.name==='Ambition').desc,oldCodex);
}
let proposed=inputs['pr48.js'];
for(const [oldText,newText] of [[oldWorld,newWorld],[oldCodex,newCodex]]){
 assert.equal(proposed.split(oldText).length-1,1);proposed=proposed.replace(oldText,newText);
}
const after=parse(proposed),restored=structuredClone(after);
restored.worlds.find(x=>x.id==='threnosun').blurb=oldWorld;
restored.codex.find(x=>x.id==='shards').list.find(x=>x.name==='Ambition').desc=oldCodex;
assert.deepEqual(restored,before);
const eng=inputs['engine.js'];
const a=eng.indexOf('var RDG=window.AtlasReading');
const b=eng.indexOf('buildGalaxy();buildMarkers();buildTerritories();localField();',a);
const c=eng.indexOf('let cxTab=K.codex.length');
const d=eng.indexOf('function openCodex()',c);
assert.ok(a>=0&&b>a&&c>b&&d>c);
const harness="const K={raw:PK,codex:PK.codex,intro:PK.intro};const WORLDS=PK.worlds,WORLD_BY=Object.fromEntries(WORLDS.map(w=>[w.id,w]));const CUM=true,S={book:0,rd:{mode:\"all\"},realm:\"physical\"};const ARR=x=>Array.isArray(x)?x: x==null?[]:[x];const filterOk=()=>true;const EFF=()=>S.book||12;const G={},GROUP_BY={};const BOOKS=PK.books,BOOK_IDS=Object.keys(BOOKS),nBooksWord=\"books\";const esc=x=>String(x??\"\").replace(/&/g,\"&amp;\").replace(/</g,\"&lt;\").replace(/>/g,\"&gt;\");const nodes={};const $=id=>(nodes[id]??={addEventListener(){}});\n"+eng.slice(a,b)+'\n'+eng.slice(c,d)+"\ncxTab=\"shards\";return (state)=>{setRd(state);renderCodex();const w=WORLD_BY.threnosun;const txt=seen(w)?eraVal(w,\"blurb\"):null;const body=nodes[\"#cxBody\"].innerHTML;const found=body.match(/<h3>Ambition<\\/h3>[\\s\\S]*?<p>(.*?)<\\/p>/);return {world:txt,codex:found?found[1]:null}};";
function selectors(pack){
 const window={};vm.runInNewContext(inputs['reading.js'],{window});
 return new Function('window','PK',harness)(window,pack);
}
const pre=selectors(before),post=selectors(after);
const B7=before.spoilers.works.filter(x=>x.bucket===7).map(x=>x.id),all=before.spoilers.works.map(x=>x.id);
const AU='arcanum-unbounded-system-essays-and-maps';
const states=[
 ['All',{mode:'all'},true],['legacy6',{mode:'legacy',book:6},false],
 ['legacy7',{mode:'legacy',book:7},true],['empty',{mode:'none'},false],
 ['AU01-only',{mode:'set',ids:[AU]},false],['bucket7',{mode:'set',ids:B7},true],
 ['bucket7-minus-AU01',{mode:'set',ids:B7.filter(x=>x!==AU)},false],
 ['all-works',{mode:'set',ids:all},true]
];
const rows=states.map(([name,state,visible])=>{
 const before=pre(state),proposal=post(state);
 for(const key of ['world','codex']){
   assert.equal(before[key]!==null,visible,name+' before '+key);
   assert.equal(proposal[key]!==null,visible,name+' proposal '+key);
   if(visible){assert.equal(proposal[key],key==='world'?newWorld:newCodex);assert.ok(!/Mercy|destroyed/.test(proposal[key]));}
 }
 return {name,state,expectedVisible:visible,before,proposal};
});
console.log(JSON.stringify({inputBlobs:'5/5',branchFieldMatches:'6/6',replacementOccurrences:'2/2',wholePackRestoration:'1/1',pairedFieldComparisons:'16/16',renderedBrowserCases:0,rows},null,2));

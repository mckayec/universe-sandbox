/* Read-only MB04 repository inventory and source-helper probe.
Run: node mb04-inventory-probe.cjs INPUT_DIR
INPUT_DIR: exact downloaded pack48.js, pack24.js, pack37.js, reading.js, engine.js.
No browser is run. Synthetic event below is an explicitly hypothetical gate control. */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const dir = process.argv[2] || '.';
const expected = {
 'pack48.js':'a76929639d9cc848e2c52bcaa39622fde3cf239c',
 'pack24.js':'3ff0aab059fa54e00f6e2ccc7b849d4bd206d958',
 'pack37.js':'5a74e300eaf88b2d3c81fa9bc957584cd4708e33',
 'reading.js':'4d9bc177294e5e33accf6f19825ef467f0bb90d4',
 'engine.js':'0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0'
};
const input = {}, hashes = [];
for(const [file,want] of Object.entries(expected)){
 const b=fs.readFileSync(path.join(dir,file));
 const got=crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
 assert.equal(got,want,file+' Git blob SHA');
 hashes.push({file,expected:want,actual:got});input[file]=b.toString('utf8');
}
const packs={}, inventory=[];
const pattern=/eleventh|mantiz|gemmel|shezler|malatium/i;
for(const n of [48,24,37]){
 const c={window:{}};vm.runInNewContext(input['pack'+n+'.js'],c);const p=c.window.ATLAS_PACKS.cosmere;packs[n]=p;
 const w=p.worlds.find(x=>x.id==='scadrial'), codex=p.codex.flatMap(t=>t.list);
 const matches=input['pack'+n+'.js'].split('\n').flatMap((text,i)=>pattern.test(text)?[{line:i+1,text}]:[]);
 const contentMatches=[];
 function walk(x,at){
  if(typeof x==='string'&&pattern.test(x))contentMatches.push({path:at,value:x});
  else if(x&&typeof x==='object')Object.entries(x).forEach(([k,v])=>walk(v,at+'.'+k));
 }
 for(const key of ['worlds','events','codex','groups','intro','realms','galaxy','legend'])walk(p[key],key);
 inventory.push({pr:n,counts:{worlds:p.worlds.length,sites:p.worlds.flatMap(w=>w.sites||[]).length,events:p.events.length,codex:codex.length},sourceMatches:matches,contentMatches,
  bibliography:(p.spoilers.works||[]).filter(x=>x.id==='the-eleventh-metal'),
  overlaps:{scadrial:{id:w.id,first:w.first,books:w.books,gate:w.gate||null,gates:w.gates||null},e7:p.events.find(e=>e.id==='e7')||null,hathsin:w.sites.find(s=>s.id==='hathsin'),kelsier:codex.find(x=>x.name==='Kelsier'),scadrialBook7:p.events.filter(e=>e.world==='scadrial'&&e.book===7)}
 });
}
const ctx={window:{},WORLDS:packs[48].worlds,WORLD_BY:Object.fromEntries(packs[48].worlds.map(w=>[w.id,w]))};
vm.createContext(ctx);vm.runInContext(input['reading.js'],ctx);
vm.runInContext('var RDG=window.AtlasReading; var RREG=RDG.normRegistry('+JSON.stringify(packs[48])+');',ctx);
const eng=input['engine.js'], start=eng.indexOf('const GCACHE=new WeakMap();'),end=eng.indexOf('const pvis=chain=>',start);
assert.ok(start>=0&&end>start,'engine extraction markers');
const first=eng.split('\n').find(x=>x.startsWith('const firstOf='));
assert.ok(first,'firstOf marker');
vm.runInContext(first+'\n'+eng.slice(start,end),ctx);
const details=vm.runInContext(`JSON.stringify({
 registryOK:RREG.ok, bucket2:RREG.buckets.get(2),
 worldGate:worldChain(WORLD_BY.scadrial),
 cases:[
 ['MB04 only world',RDG.visible(worldChain(WORLD_BY.scadrial),new Set(['the-eleventh-metal'])),false],
 ['empty world',RDG.visible(worldChain(WORLD_BY.scadrial),new Set()),false],
 ['MB01 only world',RDG.visible(worldChain(WORLD_BY.scadrial),new Set(['mistborn-the-final-empire'])),false],
 ['bucket2 world',RDG.visible(worldChain(WORLD_BY.scadrial),new Set(RREG.buckets.get(2))),true],
 ['MB04 only hypothetical event',RDG.visible(evChain({world:'scadrial',book:7,gate:{req:'the-eleventh-metal'}}),new Set(['the-eleventh-metal'])),false],
 ['bucket2 only hypothetical event',RDG.visible(evChain({world:'scadrial',book:7,gate:{req:'the-eleventh-metal'}}),new Set(RREG.buckets.get(2))),false],
 ['bucket2 plus MB04 hypothetical event',RDG.visible(evChain({world:'scadrial',book:7,gate:{req:'the-eleventh-metal'}}),new Set([...RREG.buckets.get(2),'the-eleventh-metal'])),true],
 ['MB04 isolated hypothetical own gate',RDG.visible([RDG.compileGate({req:'the-eleventh-metal'},RREG)],new Set(['the-eleventh-metal'])),true]
 ]})`,ctx);
const gates=JSON.parse(details);assert.equal(gates.registryOK,true);
for(const [name,actual,want] of gates.cases)assert.equal(actual,want,name);
console.log(JSON.stringify({scope:'Repository lexical/record inventory and extracted actual-source helper checks only; no full-book or browser audit',inputHashes:hashes,inventory,gates,checks:{hashes:'5/5',gateCases:'8/8'},limitations:['Lexical absence does not exclude unnamed or indirect story claims.','Synthetic event is not an implemented record.','No full-story reading, independent map verification, browser execution or release approval.']},null,2));

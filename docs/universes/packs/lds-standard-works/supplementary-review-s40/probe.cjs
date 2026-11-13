const fs=require('fs'),vm=require('vm'),cp=require('child_process'),a=require('assert/strict');
const head='66c87095778b29b86e4750e48e8b9596dc21af10',base='180b337b6b661861e19a4f746c40a5714556e698';
const read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8',maxBuffer:20000000});
function load(r,p){const c={window:{}};vm.createContext(c);vm.runInContext(read(r,p),c);return c.window;}
const path='public/atlas/packs/lds-standard-works.js';
const get=r=>Object.values(load(r,path)).flatMap(x=>Object.values(x||{})).find(x=>x&&x.id==='lds-standard-works');
const p=get(head),old=get(base),L=load(head,'public/atlas/layers.js').AtlasLayers;
const cards=p.codex.flatMap(s=>s.list),before=old.codex.flatMap(s=>s.list);a.equal(cards.length,1599);
let changes=0;cards.forEach((x,i)=>{if(JSON.stringify(x)!==JSON.stringify(before[i])){changes++;a.equal(x.name,'First Vision account');a.equal(x.date,'spring 1820, as narrated');const c={...x};delete c.date;a.equal(JSON.stringify(c),JSON.stringify(before[i]));}});a.equal(changes,2);
for(const k of Object.keys(p).filter(k=>k!=='codex'))a.equal(JSON.stringify(p[k]),JSON.stringify(old[k]),k);
let cases=0;for(const date of [undefined,'','  ',' <x> & "quoted" ',7])for(const when of [undefined,0,1820,[1815,1825]]){const it={date,when},html=L.itemMeta(null,null,it);if(typeof date==='string'&&date.trim())a.ok(html.includes('&lt;x&gt; &amp; &quot;quoted&quot;'));else a.equal(html,L.fmtWhen(it,'BC/AD')?'<span class="lwhen">'+L.fmtWhen(it,'BC/AD')+'</span>':'');cases++;}
for(const x of cards.filter(x=>x.name==='First Vision account')){a.ok(L.timeOk(x,[1820,1830]));a.ok(!L.timeOk(x,[1830,1840]));a.equal((L.itemMeta(null,null,x).match(/lwhen/g)||[]).length,1);}
const csv=read(head,'docs/universes/packs/lds-standard-works/timeline-source-vision.csv');
const missing=cards.filter(x=>/^NTC-vision-sequence-/.test(x.key||'')&&!csv.includes('codex:'+x.key+','));
const result={head,base,cards:cards.length,changedDateOnlyCards:changes,helperCases:cases,omittedVisionSequenceChildKeys:missing.map(x=>x.key),runtimeOtherwiseUnchanged:true,browserExecuted:false};
fs.writeFileSync(__dirname+'/probe-result.json',JSON.stringify(result,null,2)+'\n');console.log(result);

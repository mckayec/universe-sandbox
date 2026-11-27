// Isolated ordering characterization of exact-head goEvent; stubs are not full engine/browser validation.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const src=fs.readFileSync(process.argv[2],'utf8');
const f=src.slice(src.indexOf('function goEvent(e)'),src.indexOf('function tourShow()'));
const pending=[],entered=[];
const ctx={S:{view:'world',sel:'caladan'},WORLD_BY:{caladan:{},arrakis:{}},canEnterEv:()=>true,
ascend:cb=>pending.push(cb),selectSite:()=>{},enterPlace:(id,q,cb)=>entered.push({world:ctx.S.sel,site:id}),
evInPlace:()=>{},openEvent:()=>{},leavePlace:()=>{}};
vm.createContext(ctx);vm.runInContext(f,ctx);
ctx.goEvent({id:'old',world:'arrakis',site:'arrakeen'});
ctx.goEvent({id:'new',world:'caladan',site:'castle'});
assert.deepEqual(entered,[{world:'caladan',site:'castle'}]);
pending[0]();
assert.deepEqual(entered,[{world:'caladan',site:'castle'},{world:'arrakis',site:'arrakeen'}]);
console.log('CHARACTERIZED: delayed older goEvent callback can enter its target after a newer request in this isolated ordering model.');
console.log('Not a full-engine or browser reproduction; real ascend/enterPlace cancellation behavior is outside these stubs.');

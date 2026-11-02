// Isolated actual functions with explicit fake collaborators; no browser, DOM or server.
const cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict');
const head='e58e9a16c46b7216b055b9817a8dea464713a90e';
const en=cp.execFileSync('git',['show',head+':public/atlas/engine.js'],{encoding:'utf8'});
const start=en.indexOf('function cxGoEvent(id)'),end=en.indexOf('\n$("#cxBody").addEventListener',start);
const openStart=en.indexOf('function openCodex()'),openEnd=en.indexOf('\n$("#cxBtn").addEventListener',openStart);
function scenario(name,mutate,want){
 const queue=[],modal={hidden:false},state={ev:null};let focus='source',reach='ok',exists=true;
 const ctx={S:state,EV_BY:{e:{id:'e'}},evReach:()=>reach,renderCodex:()=>{},
  $:s=>s==='#codex'?modal:{focus:()=>{focus=s;}},openEvent:id=>{state.ev=id;},
  dos:{querySelector:()=>exists?{focus:()=>{focus='event';}}:null},setTimeout:f=>queue.push(f)};
 vm.createContext(ctx);vm.runInContext(en.slice(start,end)+'\n'+en.slice(openStart,openEnd),ctx);
 vm.runInContext('cxGoEvent("e")',ctx);
 mutate({ctx,state,setReach:r=>reach=r,setExists:r=>exists=r,focus:v=>focus=v});
 queue.forEach(f=>f());assert.equal(focus,want,name);return {name,observedFocus:focus};
}
const cases=[
 scenario('normal event activation',()=>{},'event'),
 scenario('codex reopened',({ctx})=>vm.runInContext('openCodex()',ctx),'#cxClose'),
 scenario('event replaced',({state})=>state.ev='other','source'),
 scenario('event cleared',({state})=>state.ev=null,'source'),
 scenario('layer or year filters reject target',({setReach})=>setReach('filtered'),'source'),
 scenario('work gate locks target',({setReach})=>setReach('locked'),'source'),
 scenario('target removed',({setExists})=>setExists(false),'source'),
 scenario('reopen then close preserves restored Codex button',({ctx})=>vm.runInContext('openCodex();closeCodex()',ctx),'#cxBtn'),
];
console.log(JSON.stringify({head,cases,passingGuardCases:8,S27C1:'closed for reproduced case',browserExecuted:false},null,2));

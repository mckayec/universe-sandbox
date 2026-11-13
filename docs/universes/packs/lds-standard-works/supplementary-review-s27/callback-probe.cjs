// Isolated actual functions with explicit fake collaborators; no browser, DOM or server.
const cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict');
const head='6bf2812973995956e60cd3dc20472feb269cf916';
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
 scenario('reopen then close restores Codex button but pending callback overrides it',({ctx})=>vm.runInContext('openCodex();closeCodex()',ctx),'event'),
];
const frame=en.slice(en.indexOf('function frame(now)'),en.indexOf('/* ===================== URL STATE'));
assert.match(frame,/orbG\.cam\.updateMatrixWorld\(\);layoutGalaxyLabels\(W,H\);\s*renderer\.render\(gal,camG\)/);
assert.match(frame,/orbW\.update\(dt\);updatePlanet\(dt,T,!S\.interacted\);orbW\.cam\.updateMatrixWorld\(\);layoutSiteLabels\(W,H\);layoutRoutes\(W,H\);renderer\.render\(wsc,camW\)/);
console.log(JSON.stringify({head,cases,passingGuardCases:7,remainingReproductions:1,remainingFinding:'S27-C1: reopen/close before callback steals restored Codex-button focus; current-state checks do not detect intervening navigation',cameraUpdateOrder:'verified statically in both branches; no rendering execution',browserExecuted:false},null,2));

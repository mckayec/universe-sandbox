// Exact source-order probe with fake update collaborators; no renderer or DOM.
const cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict');
const head='e58e9a16c46b7216b055b9817a8dea464713a90e',base='3e1f46091306c136610758a92a52589ac9a5e9f4';
const read=p=>cp.execFileSync('git',['show',head+':'+p],{encoding:'utf8'});
const en=read('public/atlas/engine.js');
const branch=en.match(/else\{(orbW\.update\(dt\);updatePlanet[\s\S]*?renderer\.render\(wsc,camW\);)\}/)[1];
const cases=[];
for(const completes of [false,true]){
 let observed;
 const c={dt:.05,T:1,S:{interacted:true},PL:{turn:{}},W:1440,H:900,wsc:{},camW:{},
 orbW:{fly:{},cam:{updateMatrixWorld(){}},update(){if(completes)this.fly=null;}},
 updatePlanet(){if(completes)c.PL.turn=null;},labelJump:v=>observed=v,
 layoutSiteLabels(){},layoutRoutes(){},renderer:{render(){}}};
 vm.createContext(c);vm.runInContext(branch,c);assert.equal(observed,!completes);
 cases.push({motionActiveAtFrameEntry:true,completesDuringUpdate:completes,jumpAtLabelLayout:observed});
}
assert(en.indexOf('orbG.update(dt)')<en.indexOf('labelJump(!!orbG.fly)'));
const same=cp.execFileSync('git',['diff','--name-only',base,head,'--','public/atlas/packs','docs/universes/packs/lds-standard-works/supplementary-implementation.csv','docs/universes/packs/lds-standard-works/identity-crosswalk.csv','docs/universes/packs/lds-standard-works/typed-links.csv'],{encoding:'utf8'});assert.equal(same,'');
console.log(JSON.stringify({head,base,packMappingCrosswalkUnchanged:true,cases,finding:'S28-V1: motion completing during the update leaves jump false at layout, even if the view just moved far',limits:'Source branch with fake update collaborators; not a screenshot or timing measurement',browserExecuted:false},null,2));

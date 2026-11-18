// Exact helper execution and source-order checks, no browser/DOM/server.
const cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict');
const head='34c34d96920a224d24ea8a56f86ad505c7ab8e7f',base='e58e9a16c46b7216b055b9817a8dea464713a90e';
const en=cp.execFileSync('git',['show',head+':public/atlas/engine.js'],{encoding:'utf8'});
const helper=en.slice(en.indexOf('let labelJumpHold=0;'),en.indexOf('function frame(now)'));
let checks=0;const results=[];
for(const [name,frames,want] of [
 ['normal motion',[[false,false],[false,true],[true,true],[true,false],[false,false],[false,false],[false,false]],[false,true,true,true,true,false,false]],
 ['single delayed completion',[[true,false],[false,false],[false,false]],[true,true,false]],
 ['repeated jumps',[[true,false],[false,false],[false,true],[true,false],[false,false],[false,false]],[true,true,true,true,true,false]],
]){const seen=[],c={labelJump:x=>seen.push(x)};vm.createContext(c);vm.runInContext(helper,c);for(const f of frames){c.args=f;vm.runInContext('labelJumpFrame(...args)',c);}assert.deepEqual(seen,want);checks+=frames.length;results.push({name,observed:seen});}
const c={S:{view:'galaxy'},orbG:{fly:null},orbW:{fly:null},PL:null,labelJump(){}};vm.createContext(c);vm.runInContext(helper,c);
for(const [view,g,w,t,want] of [['galaxy',true,false,false,true],['galaxy',false,true,true,false],['world',true,false,false,false],['world',false,true,false,true],['world',false,false,true,true],['world',false,false,false,false]]){c.S.view=view;c.orbG.fly=g?{}:null;c.orbW.fly=w?{}:null;c.PL={turn:t?{}:null};assert.equal(vm.runInContext('viewMoving()',c),want);checks++;}
const frame=en.slice(en.indexOf('function frame(now)'),en.indexOf('/* ===================== URL STATE'));
assert(frame.indexOf('const movingAtEntry=viewMoving();')<frame.indexOf('orbG.update(dt)'));
assert(frame.indexOf('const movingAtEntry=viewMoving();')<frame.indexOf('orbW.update(dt)'));
assert.match(frame,/labelJumpFrame\(movingAtEntry,!!orbG.fly\);orbG.cam.updateMatrixWorld\(\);layoutGalaxyLabels/);
assert.match(frame,/labelJumpFrame\(movingAtEntry,viewMoving\(\)\);orbW.cam.updateMatrixWorld\(\);layoutSiteLabels/);
const unchanged=['public/atlas/packs','public/atlas/layers.js','public/atlas/engine.css','docs/universes/packs/lds-standard-works/supplementary-implementation.csv','docs/universes/packs/lds-standard-works/identity-crosswalk.csv','docs/universes/packs/lds-standard-works/typed-links.csv'];
assert.equal(cp.execFileSync('git',['diff','--name-only',base,head,'--',...unchanged],{encoding:'utf8'}),'');
console.log(JSON.stringify({head,base,helperStateChecks:checks,results,frameEntryAndBothLayoutOrders:'pass',packLayersCssMappingsCrosswalksUnchanged:true,browserExecuted:false},null,2));

const cp=require('child_process'),vm=require('vm'),fs=require('fs'),a=require('assert/strict');
const H='5c7edcd824e7657ae0010c9d3943a753d478f899',B='421a5bc0a65323a06bafd8c694f106823b71f1ff';
const read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8',maxBuffer:20000000});
const src=read(H,'public/atlas/engine.js');
const under=src.match(/const underChrome = [^\n]+/)[0];
const logic=src.slice(src.indexOf('const edgeOut = MOB'),src.indexOf('if (show) placed.push'));
function check(sel,x,y,bands,MOB=true){const c={MOB,pr:{x,y,z:0},W:390,r:{x,y:y-12,w:110,h:24},sel,facing:1,bands,placed:[],hit:()=>false};vm.createContext(c);vm.runInContext(under+'\n'+logic+'\nresult={edgeOut,edgeDot,show,dot};',c);return c.result;}
a.equal(check(false,100,100,[[0,373]]).show,false);a.equal(check(false,100,500,[[0,373],[728,844]]).show,true);
a.equal(check(false,385,500,[]).dot,true);const selected=check(true,385,500,[]);a.equal(selected.show,true);a.equal(selected.dot,false);a.equal(selected.edgeOut,false);
a.equal(check(true,100,100,[] ,false).show,true);
const block=src.slice(src.indexOf('function layoutSiteLabels'),src.indexOf('/* ===================== SURFACE JOURNEYS'));
a.ok(!block.includes('activeElement')&&!block.includes('.focus('));
const changes=cp.execFileSync('git',['diff','--name-only',B,H],{encoding:'utf8'}).trim().split('\n');a.deepEqual(changes.filter(p=>p.startsWith('public/')),['public/atlas/engine.js']);
const main='e59f9b62d2106af7a93f0725b65afec63295732c';const merge=cp.spawnSync('git',['merge-tree','--write-tree','--name-only',main,H],{encoding:'utf8'});a.equal(merge.status,0);
const out={head:H,base:B,changedFiles:changes,sourceDecisionCases:5,selectedRightEdge:{x:385,estimatedRight:495,viewport:390,result:selected},layoutHasNoFocusRecovery:true,packAndCSSUnchanged:true,mergeTreeMain:main,mergeTreeExit:merge.status,mergeTreeOutput:merge.stdout.trim(),browserOrDOMExecuted:false,result:'findings reproduced from extracted decision logic'};
fs.writeFileSync(__dirname+'/probe-result.json',JSON.stringify(out,null,2)+'\n');console.log(out);

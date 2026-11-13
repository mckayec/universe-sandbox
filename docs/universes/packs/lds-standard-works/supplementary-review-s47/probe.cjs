const cp=require('child_process'),vm=require('vm'),fs=require('fs'),a=require('assert/strict');
const head='6b8684523d9c67f3a241e637d48df2737e7b81cb';
const src=cp.execFileSync('git',['show',head+':public/atlas/engine.js'],{encoding:'utf8'});
const logic=src.slice(src.indexOf('const edgeOut = MOB'),src.indexOf('if (show) placed.push'));
function test(x,fw){const c={MOB:true,pr:{x,y:500,z:0},W:390,fw,fh:30,o:{_flip:false},sel:true,facing:1,bands:[],placed:[],hit:()=>false,underChrome:()=>false};vm.createContext(c);vm.runInContext(logic+'\nresult={edgeOut,flip,edgeDot,x0,show,dot};',c);return c.result;}
const right=test(385,110),left=test(2,110),long=test(195,430);
a.equal(right.flip,true);a.equal(right.dot,false);a.equal(right.x0,282);
a.equal(left.show,true);a.equal(left.dot,false);a.equal(left.x0,-5);
a.equal(long.dot,true);a.equal(long.flip,false);
const focus=src.slice(src.indexOf('function visibleControl'),src.indexOf('function layoutSiteLabels'));
a.ok(focus.includes('target.focus({ preventScroll: true })'));
a.ok(!focus.includes('overflow')&&!focus.includes('elementFromPoint'));
const layout=src.slice(src.indexOf('function layoutSiteLabels'),src.indexOf('/* ===================== SURFACE JOURNEYS'));
a.ok(layout.includes('!show && document.activeElement === o.el'));
const result={head,cases:3,right,left,long,focusRecoveryGuardPresent:true,focusVisibilityDoesNotCheckClippingAncestors:true,browserOrDOMExecuted:false};
fs.writeFileSync(__dirname+'/probe-result.json',JSON.stringify(result,null,2)+'\n');console.log(result);

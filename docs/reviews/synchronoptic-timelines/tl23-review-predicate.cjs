// Independent controls for checkpoint 23's exact setEqual predicate. No browser claim.
// Run: node tl23-review-predicate.cjs <checkout-root>
// Expected at e5ff736: valid/missing/extra controls pass; duplicate rejection fails (3/4).
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const p=fs.readFileSync(path.join(process.argv[2],'docs/reviews/synchronoptic-timelines/tl23/host-layer-probe.mjs'),'utf8');
const begin=p.indexOf('const setEqual ='),end=p.indexOf('\nfor (const variant',begin);
if(begin<0||end<0)throw Error('predicate markers missing');
let actual;const x=vm.createContext({check:(name,ok)=>actual=ok});
vm.runInContext(p.slice(begin,end)+'\nthis.setEqual=setEqual;',x);
const base={missingN:0,extraN:0,distinct:2,expected:2,rows:2,libAgrees:true,relN:1,relLi:1,edgesExpected:1};
let pass=0;
for(const [name,delta,want] of [['valid',{},true],['missing',{missingN:1,distinct:1,rows:1},false],['extra',{extraN:1,distinct:3,rows:3},false],['duplicate',{rows:3},false]]){
 x.setEqual('control',name,{...base,...delta});const ok=actual===want;pass+=ok;console.log(`${ok?'PASS':'FAIL'} ${name}: predicate=${actual}, expected=${want}`);
}
console.log(`${pass}/4 predicate controls passed`);process.exitCode=pass===4?0:1;

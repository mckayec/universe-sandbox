// Source-only configuration probe; starts no browser or server.
const {execFileSync}=require('node:child_process');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const base='f877f76f295fc09bd80b28d455ce59a093f31271';
const head='b62bd3cf2d4c4218504b9c5b91720eacce98551f';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'});
const read=ref=>git('show',ref+':tests/standalone-pages.mjs');
const before=read(base), after=read(head);
assert.deepEqual(git('diff','--name-only',base,head).trim().split('\n'),['tests/standalone-pages.mjs']);
const pages=text=>vm.runInNewContext(text.slice(text.indexOf('const PACKS ='),text.indexOf('const VIEWPORTS ='))+'\nJSON.stringify(PAGES)');
const old=JSON.parse(pages(before)), current=JSON.parse(pages(after));
assert.equal(current.length,13);
let extended=0;
current.forEach((p,i)=>{
 const timeout=p.readyTimeout||60000;
 assert.equal(timeout,p.path==='atlas/?pack=lds-standard-works'?240000:60000);
 if(timeout===240000) extended++;
 const {readyTimeout,...unchanged}=p;
 assert.deepEqual(unchanged,old[i]);
});
assert.equal(extended,1);
const tail=text=>text.slice(text.indexOf('    await tab.waitForTimeout(page.wait || 1200);'));
assert.equal(tail(before),tail(after));
assert.ok(after.includes('await tab.waitForSelector(page.ready, { timeout: page.readyTimeout || 60000 });'));
assert.equal(git('diff',base,head,'--','public','src','tests/lds-pack.test.ts','tests/atlas-layers.test.ts'),'');
console.log(JSON.stringify({base,head,pages:13,extendedReadinessPages:extended,unchangedReadinessPages:12,assertionsAfterReadinessUnchanged:true,applicationAndTargetedTestsUnchanged:true,browserExecuted:false,result:'pass'},null,2));

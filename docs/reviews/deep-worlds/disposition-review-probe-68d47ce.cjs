// Independent exact-source VM review; no renderer, browser or canon certification.
// node review-probe.cjs <society.js> <head|parent>
const fs=require('fs'), vm=require('vm'), crypto=require('crypto');
const source=fs.readFileSync(process.argv[2],'utf8'), variant=process.argv[3]||'head';
const sha=crypto.createHash('sha1').update('blob '+Buffer.byteLength(source)+'\0').update(source).digest('hex');
if(sha!==(variant==='head'?'c002eae9f01eacf8655e20a368217743d5d8f5f9':'fd3b2d14eb2457fef933b8925e9a4888b3e57d34'))throw Error('wrong input blob '+sha);
let passed=0,failed=0;const check=(id,ok,detail='')=>{console.log(`${ok?'PASS':'FAIL'} ${id}${detail?' '+detail:''}`);ok?passed++:failed++;};
const cut=(a,b,start=0)=>{const i=source.indexOf(a,start),j=source.indexOf(b,i+a.length);if(i<0||j<0)throw Error('missing slice '+a);return source.slice(i,j);};
const x=vm.createContext({console,Math});const run=s=>vm.runInContext(s,x);
run(source.slice(source.indexOf('const BOOKS='),source.indexOf('/* ---- 10-noise.js ---- */')));
// Actual content fields; geometry/build omitted. Landmark id/name/desc only, no position assertions.
for(const key of ['tyche','europa']){
 const pos=source.lastIndexOf('SITES.'+key+'={');
 const end=source.indexOf('  ground,',pos);
 run(source.slice(pos,end)+'landmarks:[]};');
 const lmStart=source.lastIndexOf('const lm=[',pos);
 const lines=source.slice(lmStart,pos).split('\n').filter(l=>/^ \{id:/.test(l));
 for(const l of lines){const id=l.match(/id:("[^"]+")/)[1],name=l.match(/name:("[^"]+")/)[1],desc=l.match(/desc:("[^"]*")/)[1];run(`SITES.${key}.landmarks.push({id:${id},name:${name},desc:${desc}});`);}
}
run(cut('const SITE_FROM=','/* Mars */'));
run(cut('lmHide("europa","athena",6);','{const S=SITES.sungrave;'));
run(cut('lmGate("tyche","morningstar",6,','})();',source.indexOf('const SITE_FROM=')));
run(cut('const LEV_BASE=','  let levLbl=null'));
run(source.split('\n').find(l=>l.includes('S.landmarks.push({id:"leviathan"')).replace('S.landmarks','SITES.europa.landmarks'));
const Q=/not (?:been )?independently checked against the novel|not checked against the novel|not verified against the novel/;
const early=/Harmonia|Discordia/;
check('F1 d8 qualifier, omissions, route',run('EV.d8.book===5&&EV.d8.poi==="tyche"&&EV.d8.lm==="harbor"&&EV.d8.fx==="flood"')&&Q.test(run('EV.d8.text'))&&!/horizon four|master override|Tens of millions/.test(run('EV.d8.text')));
check('F2 banner qualifier',Q.test(run('FX_VIEW.flood.sub')));
check('F3 direct-scene illustrative extent/height note',/extent and water height are not verified/.test(run('SITES.tyche.note')));
run('ERA=5');check('F4 V blurb qualifier',Q.test(run('siteF(SITES.tyche,"blurb")')));
run('ERA=6');check('F5 VI water level not established',/does not establish Tyche’s water level/.test(run('siteF(SITES.tyche,"blurb")')));
run('ERA=5');check('F6 Mercury V narrow cut',!/Tyche drowns/.test(run('bodyF(byId.mercury,"blurb")')));
const helios=cut('SITES.helios={','  facts:');check('F7 Helios preserves Ladon, cuts Tyche drowning',/hypercane|hypercanes/.test(helios)&&/Ladon sandstorm/.test(helios)&&!/drowns Tyche/.test(helios));
run('const TOURS={};'+cut('TOURS.book5=','TOURS.book6='));
check('F8 six-step tour and neutral Tyche step',run('TOURS.book5.steps.length===6')&&!/drown/.test(run('TOURS.book5.steps.find(s=>s.site==="tyche").s')));
check('F9 harbor target survives',run('SITES.tyche.landmarks.some(l=>l.id===EV.d8.lm)'));
for(const era of [1,4,5,6]){run('ERA='+era);check('T site+pin availability '+era,run('siteVisible("tyche")')===(era>=5)&&run('poiVisible(POIS.mercury.find(p=>p.id==="tyche"))')===(era>=5));}
for(const era of [2,5,6]){
 run('ERA='+era);
 const text=run('JSON.stringify([SITES.europa.epithet,siteF(SITES.europa,"blurb"),siteF(SITES.europa,"facts"),siteLms(SITES.europa).map(l=>[l.name,eraVal(l.desc)])])');
 check('E rendered-input names boundary '+era,era<6?!early.test(text):/Harmonia/.test(text)&&/Discordia/.test(text));
 check('E pins and sea boundary '+era,run('POIS.europa.filter(p=>["harmonia","discordia"].includes(p.id)).every(p=>poiVisible(p)==='+(era>=6)+')')&&run('siteLms(SITES.europa).some(l=>l.id==="sea")')===(era>=6));
 const facts=run('JSON.stringify(siteF(SITES.europa,"facts"))');check('E bibliography '+era,era<6?/Golden Son/.test(facts)&&!/Light Bringer/.test(facts):/Golden Son, Light Bringer/.test(facts));
 // Execute the actual popup callback expression, not just its shared text object.
 run('var banner=null;function showBanner(...args){banner=args;}');
 const callback=source.match(/levLbl.addEventListener\("click",\(\)=>((?:showBanner)[^\n]+?)\);\}/)[1];run(callback);
 const popup=run('banner[1]'),landmark=run('eraVal(SITES.europa.landmarks.find(l=>l.id==="leviathan").desc)');
 check('E both leviathan text consumers '+era,popup===landmark&&(era<6?!early.test(popup):/Discordia Sea/.test(popup)));
}
// Exact flood state/update lines with mocked sea vector and controls, fixed frame steps.
const flood=cut('      const prol=SITES._prolT','      cars.forEach');
function floodY(era,on,fast=false){const c=vm.createContext({ERA:era,on,window:{__atlasFast:fast},SITES:{},flood:0,SEA_Y:-6,sea:{position:{y:-6}},Math,dt:1/60,t:0});for(let i=0;i<600;i++){c.t=i/60;vm.runInContext('{'+flood+'}',c);}return c.sea.position.y;}
check('F5 VI fresh no forced flood',floodY(6,false)===-6,'y='+floodY(6,false));
check('F5 V fresh no forced flood',floodY(5,false)===-6);
check('F5 explicit V replay raises sea',floodY(5,true)>-6);
check('F5 explicit VI replay raises sea',floodY(6,true)>-6);
check('F5 default hook-off and hook-on baseline',floodY(6,false,true)===-6);
// Actual admission and fade recheck. Renderer is not executed; record whether a build callback runs.
run('var hideTip=()=>{},hoverSel=null,fadeCallback=null,admitted=false;function stopFx(){admitted=true;throw Error("ADMISSION_SENTINEL");}function fadeTo(a,b,fn){fadeCallback=fn;}');
run(cut('function enterSite(key,focus,after){','function leaveSite()'));
run('ERA=4;enterSite("tyche")');check('T direct IV entry schedules no scene',run('fadeCallback===null'));
run('ERA=5;enterSite("tyche")');check('T V entry schedules scene',run('typeof fadeCallback==="function"'));
run('ERA=4');try{run('fadeCallback()');}catch(e){if(e.message!=="ADMISSION_SENTINEL")throw e;}check('T pending V entry rechecks IV before build',!run('admitted'));
// Society has no intra-document history router: hash evaluated only at initial startup (Book I).
check('T no Society push/pop/hash routing claimed',!/pushState\(|replaceState\(|["']popstate["']|["']hashchange["']/.test(source));
run('ERA=1');check('T fresh tyche hash refused at initial Book I',!run('siteVisible("tyche")'));
console.log(JSON.stringify({variant,blob:sha,passed,failed,total:passed+failed,kind:'actual-source VM; no browser, rendering, primary-source or full-app certification'}));
process.exitCode=failed?1:0;

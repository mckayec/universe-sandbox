const {chromium}=require('playwright');
const URL='http://localhost:'+(process.env.PORT||8811)+'/atlas/society.html';
const TITLES={2:"Golden Son",3:"Morning Star",4:"Iron Gold",5:"Dark Age",6:"Light Bringer"};
let pass=0,fail=0;const fails=[];
function ok(c,m){if(c)pass++;else{fail++;fails.push(m);}}
const later=(txt,k)=>Object.entries(TITLES).filter(([b,t])=>+b>k&&txt.includes(t)).map(x=>x[1]);
(async()=>{const br=await chromium.launch({args:["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist"]});
for(const vp of [JSON.parse(process.env.VP)]){
  const p=await br.newPage({viewport:vp});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(URL);await p.waitForFunction(()=>window.__atlas&&window.__atlas.SITES);await p.waitForTimeout(800);
  const tag=vp.width+"px";
  // Chronicle at fresh load and each book
  const chron=async()=>p.evaluate(()=>[...document.querySelectorAll('#track .book')].map(b=>({k:+b.dataset.book,boxes:b.getClientRects().length,evs:[...b.querySelectorAll('.ev')].filter(e=>e.getClientRects().length).length})));
  let c=await chron();ok(c.filter(x=>x.boxes).map(x=>x.k).join()==="1",tag+" fresh load shows only Book I column: "+JSON.stringify(c));
  for(const k of [1,2,3,4,5,6,0]){
    await p.click('.seg button[data-book="'+k+'"]');await p.waitForTimeout(100);c=await chron();
    const vis=c.filter(x=>x.boxes).map(x=>x.k).join();ok(vis===(k?String(k):"1,2,3,4,5,6"),tag+" chronicle book "+k+" -> "+vis);
    const sn=await p.evaluate(()=>{const e=document.querySelector('#spoilNote');return e.getClientRects().length>0;});ok(sn===(k===0),tag+" spoil note at "+k);
    // keyboard: hidden events not focusable
    const foc=await p.evaluate(k=>{let bad=0;document.querySelectorAll('#track .book').forEach(b=>{if(k&&+b.dataset.book!==k){b.querySelectorAll('.ev').forEach(e=>{e.focus();if(document.activeElement===e)bad++;});}});return bad;},k);
    ok(foc===0,tag+" hidden events focusable at "+k+": "+foc);
  }
  // scenes: every site at every book
  const keys=await p.evaluate(()=>Object.keys(window.__atlas.SITES));
  for(const k of [1,2,3,4,5,6]){
    await p.evaluate(k=>window.__atlas.selectBook(k),k);
    for(const key of keys){
      const r=await p.evaluate(async key=>{const A=window.__atlas;const S=A.SITES[key];
        if(A.curSite){/* reset to system */}
        const exp=S.from==null||A.ERA>=S.from;A.enterSite(key);const t0=Date.now();while(Date.now()-t0<(exp?4000:500)&&A.curSite!==S)await new Promise(r=>setTimeout(r,50));await new Promise(r=>setTimeout(r,80));
        const cs=A.curSite;const entered=cs===S;
        const dos=document.querySelector('#dossier').innerText;const labels=[...document.querySelectorAll('.plbl.lm')].map(x=>x.innerText).join('|');
        return {entered,expect:S.from==null||A.ERA>=S.from,dos,labels,lmVis:S.landmarks.filter(l=>l.from==null||A.ERA>=l.from).length,lmLabels:document.querySelectorAll('.plbl.lm').length};},key);
      ok(r.entered===r.expect,tag+` book ${k} enter ${key}: entered=${r.entered} expect=${r.expect}`);
      if(r.entered){ok(r.lmLabels===r.lmVis,tag+` book ${k} ${key} labels ${r.lmLabels}/${r.lmVis}`);
        const L=later(r.dos+" "+r.labels,k).filter(t=>!(key==="demiurge"));ok(L.length===0,tag+` book ${k} ${key} dossier names later book ${L}`);}
    }
  }
  // downgrade inside an open scene
  await p.evaluate(()=>window.__atlas.selectBook(0));await p.evaluate(()=>window.__atlas.enterSite('asteroid'));await p.waitForFunction(()=>window.__atlas.curSite===window.__atlas.SITES.asteroid,null,{timeout:8000}).catch(()=>{});
  ok(await p.evaluate(()=>window.__atlas.curSite===window.__atlas.SITES.asteroid),tag+" All enters asteroid");
  await p.click('.seg button[data-book="1"]');await p.waitForTimeout(1500);
  ok(await p.evaluate(()=>window.__atlas.curSite!==window.__atlas.SITES.asteroid||!document.querySelector('#dossier').innerText.includes('Tabula')),tag+" downgrade leaves asteroid");
  await p.evaluate(()=>window.__atlas.selectBook(0));await p.evaluate(()=>window.__atlas.enterSite('europa'));await p.waitForFunction(()=>window.__atlas.curSite===window.__atlas.SITES.europa,null,{timeout:8000}).catch(()=>{});
  await p.click('.seg button[data-book="1"]');await p.waitForTimeout(400);
  const eu=await p.evaluate(()=>({d:document.querySelector('#dossier').innerText,l:[...document.querySelectorAll('.plbl.lm')].map(x=>x.innerText)}));
  ok(!eu.l.includes('Daughters of Athena')&&!eu.d.includes('Athena'),tag+" downgrade europa hides Athena");
  // event navigation per book
  for(const k of [1,2,3,4,5,6]){
    await p.evaluate(k=>window.__atlas.selectBook(k),k);
    const ids=await p.evaluate(k=>Object.values(window.__atlas.EV).filter(e=>e.book===k).map(e=>e.id),k);
    for(const id of ids.slice(0,40)){
      const r=await p.evaluate(async id=>{const A=window.__atlas;A.gotoEvent(A.EV[id]);await new Promise(r=>setTimeout(r,900));A.playFx&&0;return document.querySelector('#dossier').innerText+' '+[...document.querySelectorAll('.plbl')].map(x=>x.innerText).join('|');},id);
      const L=later(r,k);ok(L.length===0,tag+` book ${k} event ${id} shows later ${L}`);
    }
  }
  ok(errs.length===0,tag+" page errors: "+errs.join(';'));
  await p.close();
  // direct entry
  const q=await br.newPage({viewport:vp});await q.goto(URL+'#asteroid');await q.waitForTimeout(2500);
  ok(await q.evaluate(()=>window.__atlas.curSite==null),tag+" #asteroid direct entry blocked at Book I");
  await q.goto(URL+'#agea');await q.reload();await q.waitForTimeout(2500);
  ok(await q.evaluate(()=>window.__atlas.curSite===window.__atlas.SITES.agea),tag+" #agea direct entry works");
  await q.close();
}
console.log("pass",pass,"fail",fail);fails.slice(0,60).forEach(f=>console.log(" FAIL",f));await br.close();})();

import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
const port=4199, origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'ignore'});
for(let i=0;i<300;i++){try{if((await fetch(`${origin}/atlas/?pack=lds-standard-works`)).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
const b=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
const ctx=await b.newContext({viewport:{width:390,height:640},isMobile:true,hasTouch:true});
const t=await ctx.newPage();
await t.goto(`${origin}/atlas/?pack=lds-standard-works&view=world&sel=earth&site=jerusalem`);
for(let s=0;s<40;s++){await t.waitForTimeout(10000);if(await t.evaluate(()=>document.querySelector('#bake').hidden))break;}
await t.locator('#grab').focus();await t.keyboard.press('Enter');await t.waitForTimeout(1200);
const m=()=>t.evaluate(()=>{const R=s=>{const e=document.querySelector(s);if(!e||e.hidden||!e.getClientRects().length)return null;return e.getBoundingClientRect();};let a=0;['header.top','#crumbs','#realms','#filters'].forEach(s=>{const r=R(s);if(r)a=Math.max(a,r.bottom)});let b=innerHeight;['#dossier','#chron'].forEach(s=>{const r=R(s);if(r)b=Math.min(b,r.top)});const S=window.__atlas.S;const o=window.__atlas.SITE_EL.find(q=>q.s.id===S.site);const r=o.el.getBoundingClientRect();return {H:innerHeight,a,b,gap:+(b-a).toFixed(2),collapsed:document.querySelector('#dossier').classList.contains('collapsed'),bakeHidden:document.querySelector('#bake').hidden,site:S.site,selLabel:{tab:o.el.tabIndex,top:r.top,bottom:r.bottom},shown:window.__atlas.SITE_EL.filter(q=>q.el.tabIndex===0).length}});
console.log('baked+collapsed',JSON.stringify(await m()));
for(const [H,g] of [[546,57],[545,56],[608,119]]){await t.setViewportSize({width:390,height:H});await t.waitForTimeout(1500);const r=await m();console.log(g,JSON.stringify(r));await t.screenshot({path:`docs/universes/packs/lds-standard-works/shots/s57-baked-gap${g}-390x${H}.jpg`,type:'jpeg',quality:70});}
await b.close();server.kill();

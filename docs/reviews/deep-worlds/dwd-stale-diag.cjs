// Stale-exit timing diagnostic. Usage: [W=390 H=844] node dwd-stale-diag.cjs <port> <site> <fromBook> <storms 0/1>. Polls mode after selectBook(from-1).
const { chromium } = require('playwright'); const PORT = process.argv[2]; const SITE = process.argv[3]; const FROM=+process.argv[4]; const STORMS=process.argv[5]==='1';
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
 const p = await b.newPage({ viewport: { width: +(process.env.W||1440), height: +(process.env.H||900) } }); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('crash',()=>console.log('PAGE CRASH')); p.on('console',m=>{if(m.type()==='error')console.log('console.error',m.text().slice(0,200));});
 await p.addInitScript(() => { window.__atlasFast = true; });
 await p.goto(`http://127.0.0.1:${PORT}/atlas/society.html`); await p.waitForFunction(() => window.__atlas, null, { timeout: 60000 }); await p.waitForTimeout(1500);
 const A=(f,a)=>p.evaluate(f,a);
 await A(k=>window.__atlas.selectBook(k),FROM); await p.waitForTimeout(400);
 await A(s=>window.__atlas.enterSite(s),SITE);
 await p.waitForFunction(()=>window.__atlas.mode==='site',null,{timeout:20000}).catch(()=>{}); await p.waitForTimeout(1500);
 if(STORMS){await p.click('[data-tog=storms]',{force:true}).catch(()=>{}); await p.waitForTimeout(500);}
 const st=()=>A(()=>({m:window.__atlas.mode,c:window.__atlas.curSite&&window.__atlas.curSite.name,era:window.__atlas.ERA,fade:document.getElementById('fade').className}));
 console.log('before',JSON.stringify(await st()));
 await A(k=>window.__atlas.selectBook(k),FROM-1);
 for(const t of [100,500,1000,3000,8000]){await p.waitForTimeout(t===100?100:t-[100,500,1000,3000,8000][[100,500,1000,3000,8000].indexOf(t)-1]); console.log(t,JSON.stringify(await st()));}
 console.log('errs',errs.join('|')); await b.close(); })();

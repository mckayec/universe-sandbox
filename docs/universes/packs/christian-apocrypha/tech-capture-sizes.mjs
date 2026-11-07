import { createRequire } from 'module'; const { chromium } = createRequire('/home/claude/universe-sandbox/package.json')('playwright');
const [base,out,W,H,mob] = [process.argv[2],process.argv[3],+process.argv[4],+process.argv[5],process.argv[6]==='mob'];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport:{width:W,height:H}, deviceScaleFactor:1, isMobile:mob, hasTouch:mob });
const errs=[],third=[];
p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
p.on('pageerror', e => errs.push('pageerror '+e.message));
p.on('request', r => { const u=new URL(r.url()); if(!['127.0.0.1','localhost'].includes(u.hostname)&&u.protocol.startsWith('http')) third.push(r.url()); });
const t0=Date.now();
await p.goto(base+'?pack=christian-apocrypha',{waitUntil:'load'});
await p.waitForSelector('#bake',{state:'attached',timeout:300000});
await p.waitForTimeout(4000);
const info = await p.evaluate(()=>({mob:document.body.className, hd:window.__HD, fps:0}));
const SW=+process.argv[7]||0; if(SW) await p.setViewportSize({width:SW,height:Math.round(H*SW/W)});
let last='';
for(;;){ const st=await p.evaluate(()=>{const e=document.querySelector('#bake');return{hidden:e.hidden,w:e.querySelector('i').style.width};});
  if(st.w!==last){last=st.w;} if(st.w==='100%'||(st.hidden&&last))break; if(Date.now()-t0>25*60000){console.log('TIMEOUT');break;} await p.waitForTimeout(5000);}
const bakeS=((Date.now()-t0)/1000).toFixed(0);
await p.setViewportSize({width:W,height:H}); await p.waitForTimeout(8000);
// frame-time sample (software GL; relative only)
const ft = await p.evaluate(()=>new Promise(r=>{let n=0,t=performance.now();const f=()=>{if(++n<30)requestAnimationFrame(f);else r(((performance.now()-t)/30).toFixed(1));};requestAnimationFrame(f);}));
const mem = await p.evaluate(()=>performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null);
await p.screenshot({path:out+'-full.png',timeout:240000});
console.log(JSON.stringify({W,H,mob,bakeS,frameMs:ft,heapMB:mem,errors:errs.length,errs:errs.slice(0,5),third:third.length}));
await b.close();

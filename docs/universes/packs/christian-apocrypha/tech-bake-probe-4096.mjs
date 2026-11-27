import { createRequire } from 'module'; const { chromium } = createRequire('/home/claude/universe-sandbox/package.json')('playwright');
import fs from 'fs';
const [base,out,W,H,HD]=process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width:+W, height:+H }, deviceScaleFactor: 1 });
await page.addInitScript(hd => { window.__HD = hd; }, +HD);
const errs=[]; page.on('console', m => { if (m.type()==='error') errs.push(m.text()); }); page.on('pageerror', e => errs.push('pageerror '+e.message));
const t0=Date.now();
await page.goto(base+'?pack=christian-apocrypha',{waitUntil:'load'});
for(;;){ const st=await page.evaluate(()=>({log:window.__dbgLog||[],w:document.querySelector('#bake i')?.style.width}));
  if(st.log.some(l=>l.w>=+HD)){console.log(((Date.now()-t0)/1000|0)+'s applied',JSON.stringify(st.log));break;}
  if(Date.now()-t0>25*60000){console.log('TIMEOUT',JSON.stringify(st));break;}
  await page.waitForTimeout(10000);}
const crop=await page.evaluate(()=>{const {s,renderer}=window.__dbg;const rt=s.alb;const W=rt.width,H=rt.height;
  const x0=Math.round((0/360+.5)*W),x1=Math.round((40/360+.5)*W),y0=Math.round((28/180+.5)*H),y1=Math.round((48/180+.5)*H);
  const w=x1-x0,h=y1-y0;const buf=new Uint8Array(w*h*4);renderer.readRenderTargetPixels(rt,x0,y0,w,h,buf);
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');const id=x.createImageData(w,h);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const a=((h-1-j)*w+i)*4,b=(j*w+i)*4;id.data[b]=buf[a];id.data[b+1]=buf[a+1];id.data[b+2]=buf[a+2];id.data[b+3]=255;}
  x.putImageData(id,0,0);return {w,h,url:c.toDataURL('image/png')};});
fs.writeFileSync(out+'-texcrop.png',Buffer.from(crop.url.split(',')[1],'base64'));
await page.waitForTimeout(6000);await page.screenshot({path:out+'-full.png'});
const r=await page.evaluate(()=>{const {s,renderer,bakeCam}=window.__dbg;const ac=renderer.autoClear;renderer.autoClear=false;const sc=new THREE.Scene();
  ['alb','nrm','cld'].forEach(k=>{renderer.setRenderTarget(s[k]);renderer.render(sc,bakeCam);});renderer.setRenderTarget(null);renderer.autoClear=ac;return 'remip ok';});
console.log(r);await page.waitForTimeout(4000);await page.screenshot({path:out+'-remip.png'});
console.log('crop',crop.w,crop.h,'errors',errs.length,JSON.stringify(errs.slice(0,3)),'elapsed',(Date.now()-t0)/1000|0);
await browser.close();

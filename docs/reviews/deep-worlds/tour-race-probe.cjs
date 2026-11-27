const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
for(const port of [4174,4175,4174,4175]){const urls=[];
const p=await b.newPage({viewport:{width:1440,height:900}});p.on('framenavigated',f=>{if(f===p.mainFrame())urls.push(f.url());});
await p.goto(`http://localhost:${port}/atlas/?pack=dune#book=1`,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.__atlas);await p.waitForTimeout(2500);
await p.evaluate(()=>document.querySelector('#tourBtn').click());let left='no';
for(let i=0;i<6;i++){try{await p.evaluate(()=>document.querySelector('[data-tour="next"]').click());}catch(e){left='step '+i+': '+e.message.split('\n')[0];break;}await p.waitForTimeout(1500);}
const mism=urls.filter(u=>/world=arrakis&site=castle|world=caladan&site=arrakeen/.test(u));const out=urls.filter(u=>!u.includes('/atlas/'));
console.log(port===4174?'BASE 80b8514':'HEAD', '| left app:',left,'| mismatched world/site urls:',mism.length,'| non-atlas urls:',out.join(','));await p.close();}
await b.close();})();

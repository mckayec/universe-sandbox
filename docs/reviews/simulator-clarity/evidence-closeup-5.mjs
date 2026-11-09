import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4195','--strictPort'],{stdio:'ignore'});
const sleep = ms => new Promise(r=>setTimeout(r,ms));
await sleep(2500);
const b = await chromium.launch({executablePath: process.env.CHROME_PATH, args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page = await b.newPage({viewport:{width:1440,height:900}});
await page.goto('http://127.0.0.1:4195/?probe=1',{waitUntil:'networkidle'});
await page.waitForFunction(()=>Number(document.querySelector('#count')?.textContent)>0);
await page.locator('#clear').click(); await page.locator('#pause').click();
await page.locator('[data-choice="yellow-star"]').click(); await page.mouse.click(430,450);
await page.locator('[data-choice="gas"]').click(); await page.mouse.click(1000,450);
await sleep(500);
await page.locator('#zoom-selected').click(); await sleep(1500);
for (let i=0;i<5;i++){ await page.locator('#zoom-in').click(); await sleep(200);}
await sleep(1500);
console.log(JSON.stringify(await page.evaluate(()=>window.__sandboxProbe().bodies)));
await page.screenshot({path: process.argv[2]});
await b.close(); server.kill();
